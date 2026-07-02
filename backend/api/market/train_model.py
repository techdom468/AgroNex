import os
import urllib.request
import pandas as pd

import numpy as np
import joblib
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

def mean_absolute_percentage_error(y_true, y_pred): 
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100

def validate_and_eda(df):
    print("--- Dataset Structure ---")
    print(df.info())
    
    print("\n--- Missing Values ---")
    print(df.isnull().sum())
    
    # Remove duplicates
    initial_shape = df.shape
    df.drop_duplicates(inplace=True)
    print(f"\nRemoved {initial_shape[0] - df.shape[0]} duplicate rows.")
    
    # Drop rows with null target or date
    df.dropna(subset=['date', 'modal_price'], inplace=True)
    
    print("\n--- Exploratory Data Analysis (EDA) ---")
    print("Basic Statistics:")
    print(df.describe())
    
    # The dataset has 'APMC', 'Commodity', 'Year', 'Month', 'arrivals_in_qtl', 'min_price', 'max_price', 'modal_price', 'date', 'district_name', 'state_name'
    # Filter out illogical prices
    df = df[df['modal_price'] > 0]
    
    return df

def train_prophet_model(csv_path, model_path):
    print(f"Loading dataset from: {csv_path}")
    if not os.path.exists(csv_path):
        print("Dataset not found locally. Downloading from GitHub...")
        url = "https://raw.githubusercontent.com/vibhor98/Analysis-of-agricultural-trends-in-time-series-dataset/master/Mandi_Data/Monthly_data_cmo.csv"
        urllib.request.urlretrieve(url, csv_path)
        print("Download complete.")
        
    df = pd.read_csv(csv_path)
    
    # Preprocess and validate
    df = validate_and_eda(df)
    
    # Convert date to datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # We will train models for the top 5 most frequent crops, plus a "General" model
    top_crops = df['Commodity'].value_counts().head(5).index.tolist()
    # Ensure some common crops are included if possible
    custom_crops = ['Wheat', 'Cotton', 'Rice', 'Maize']
    target_crops = list(set(top_crops + custom_crops))
    
    models_dict = {}
    
    print("\nTraining models for specific crops...")
    for crop in target_crops:
        crop_df = df[df['Commodity'].str.contains(crop, case=False, na=False)]
        if len(crop_df) > 10:
            daily_avg = crop_df.groupby('date')['modal_price'].mean().reset_index()
            daily_avg.rename(columns={'date': 'ds', 'modal_price': 'y'}, inplace=True)
            daily_avg.sort_values('ds', inplace=True)
            
            model = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=False)
            model.fit(daily_avg)
            models_dict[crop.lower()] = model
            print(f"Trained model for: {crop}")
            
    # Train General Model
    print("Training General Model...")
    daily_avg_gen = df.groupby('date')['modal_price'].mean().reset_index()
    daily_avg_gen.rename(columns={'date': 'ds', 'modal_price': 'y'}, inplace=True)
    daily_avg_gen.sort_values('ds', inplace=True)
    
    gen_model = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=False)
    gen_model.fit(daily_avg_gen)
    models_dict['general'] = gen_model
    
    # Save the dictionary of models
    print(f"\nSaving multi-model dictionary to {model_path}...")
    joblib.dump(models_dict, model_path)
    print("Model training complete and saved.")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_file = os.path.join(base_dir, 'Monthly_data_cmo.csv')
    model_file = os.path.join(base_dir, 'market_price_model.pkl')
    
    train_prophet_model(csv_file, model_file)
