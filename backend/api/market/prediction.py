import pandas as pd
import numpy as np
import xgboost as xgb
import datetime
from .models import get_market_price_collection, get_prediction_collection

class PredictionService:
    """
    Handles XGBoost training, forecasting and recommendation engine.
    Trains dynamically on historical data fetched from MongoDB.
    """
    @staticmethod
    def get_recommendation(current_price, pred_7d):
        # Threshold for recommendation
        change = (pred_7d - current_price) / current_price
        
        if change > 0.05:
            return "HOLD", "Expected significant increase in prices. Hold your stock for better returns."
        elif change < -0.05:
            return "SELL", "Expected decline in prices. Recommend selling now before prices drop further."
        else:
            if change > 0:
                return "HOLD", "Prices are expected to slightly increase. It is safe to hold."
            else:
                return "SELL", "Prices are stable but leaning towards a slight decline. Sell to avoid potential minor losses."

    @staticmethod
    def determine_trend(current_price, pred_30d):
        change = (pred_30d - current_price) / current_price
        if change > 0.02:
            return "UP"
        elif change < -0.02:
            return "DOWN"
        return "STABLE"

    @classmethod
    def predict_price(cls, commodity, market):
        collection = get_market_price_collection()
        if collection is None:
            return False, "Database connection failed", None

        # Fetch historical data for specific commodity and market
        cursor = collection.find(
            {'commodity': commodity, 'market': market}
        ).sort('arrival_date', 1)  # Ascending order for time series
        
        data = list(cursor)
        if len(data) < 30:
            return False, "Insufficient historical data for accurate prediction. Need at least 30 days of data.", None

        # Convert to Pandas DataFrame
        df = pd.DataFrame(data)
        
        # Ensure arrival_date is datetime
        df['arrival_date'] = pd.to_datetime(df['arrival_date'])
        
        # We'll use modal_price as the target
        # Sort by date just in case
        df = df.sort_values('arrival_date').reset_index(drop=True)
        
        # Handle duplicates if any on the same day by taking mean
        df = df.groupby('arrival_date', as_index=False)['modal_price'].mean()
        
        # Fill missing dates using interpolation
        df.set_index('arrival_date', inplace=True)
        df = df.asfreq('D') # Daily frequency
        df['modal_price'] = df['modal_price'].interpolate(method='linear')
        df.reset_index(inplace=True)

        if len(df) < 30:
            return False, "Insufficient continuous data after processing.", None

        # Feature Engineering
        df['day'] = df['arrival_date'].dt.day
        df['month'] = df['arrival_date'].dt.month
        df['week'] = df['arrival_date'].dt.isocalendar().week.astype(int)
        df['dayofweek'] = df['arrival_date'].dt.dayofweek
        
        # Lags and Moving Averages
        df['lag_1'] = df['modal_price'].shift(1)
        df['lag_7'] = df['modal_price'].shift(7)
        df['ma_7'] = df['modal_price'].rolling(window=7).mean()
        df['ma_30'] = df['modal_price'].rolling(window=30).mean()
        
        # Price Trend (percentage change over last 7 days)
        df['trend_7d'] = (df['modal_price'] - df['lag_7']) / df['lag_7']

        # Drop NaNs resulted from lags
        df.dropna(inplace=True)
        df.reset_index(drop=True, inplace=True)

        if len(df) < 10:
             return False, "Insufficient data after feature engineering.", None

        # Features and Target
        features = ['month', 'week', 'dayofweek', 'lag_1', 'lag_7', 'ma_7', 'ma_30', 'trend_7d']
        X = df[features]
        y = df['modal_price']

        # Train XGBoost Model
        model = xgb.XGBRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            objective='reg:squarederror'
        )
        model.fit(X, y)

        # Predict future 30 days
        last_date = df['arrival_date'].iloc[-1]
        future_dates = [last_date + datetime.timedelta(days=i) for i in range(1, 31)]
        
        future_df = pd.DataFrame({'arrival_date': future_dates})
        future_df['month'] = future_df['arrival_date'].dt.month
        future_df['week'] = future_df['arrival_date'].dt.isocalendar().week.astype(int)
        future_df['dayofweek'] = future_df['arrival_date'].dt.dayofweek

        # Autoregressive forecasting for the next 30 days
        # We need to iteratively predict step by step to use the predicted value as lag for the next
        predictions = []
        current_data = df.iloc[-1].copy()
        
        # We maintain a small historical window to calculate MA dynamically
        recent_prices = list(df['modal_price'].iloc[-30:])

        for i in range(30):
            # Prepare row
            row = {
                'month': future_df['month'].iloc[i],
                'week': future_df['week'].iloc[i],
                'dayofweek': future_df['dayofweek'].iloc[i],
                'lag_1': recent_prices[-1],
                'lag_7': recent_prices[-7],
                'ma_7': np.mean(recent_prices[-7:]),
                'ma_30': np.mean(recent_prices[-30:]),
                'trend_7d': (recent_prices[-1] - recent_prices[-7]) / recent_prices[-7] if recent_prices[-7] != 0 else 0
            }
            
            row_df = pd.DataFrame([row])
            pred_val = float(model.predict(row_df)[0])
            
            # Avoid negative prices
            pred_val = max(0, pred_val)
            
            predictions.append(pred_val)
            
            # Update history for next iteration
            recent_prices.append(pred_val)

        # Prepare Response
        pred_7d = round(predictions[6], 2)
        pred_15d = round(predictions[14], 2)
        pred_30d = round(predictions[29], 2)
        
        current_price = recent_prices[-31] # The last known actual price

        recommendation, reason = cls.get_recommendation(current_price, pred_7d)
        overall_trend = cls.determine_trend(current_price, pred_30d)

        # Confidence Score (simplified heuristic based on R-squared proxy or data size)
        # Usually requires cross-validation, here we use a proxy based on data volume
        confidence = min(95.0, 50.0 + (len(data) / 10.0))

        result = {
            'commodity': commodity,
            'market': market,
            'today_price': round(current_price, 2),
            'predicted_price_7d': pred_7d,
            'predicted_price_15d': pred_15d,
            'predicted_price_30d': pred_30d,
            'confidence': round(confidence, 1),
            'trend': overall_trend,
            'recommendation': recommendation,
            'reason': reason,
            'predictions': [
                {
                    'date': (last_date + datetime.timedelta(days=i+1)).isoformat(),
                    'predicted_price': round(predictions[i], 2)
                } for i in range(30)
            ]
        }

        # Store prediction in MongoDB as requested
        pred_coll = get_prediction_collection()
        if pred_coll is not None:
            doc = {
                'commodity': commodity,
                'market': market,
                'prediction_date': datetime.datetime.now(datetime.timezone.utc),
                'predicted_price_7d': pred_7d,
                'predicted_price_15d': pred_15d,
                'predicted_price_30d': pred_30d,
                'confidence': confidence,
                'trend': overall_trend,
                'recommendation': recommendation,
                'reason': reason
            }
            pred_coll.insert_one(doc)

        return True, "Prediction successful", result
