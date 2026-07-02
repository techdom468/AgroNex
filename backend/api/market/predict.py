import pandas as pd
from datetime import datetime, timedelta
from .model_loader import MarketModelLoader


def predict_market_price(crop_name: str = "Wheat", days: int = 7) -> dict:
    """
    Loads the trained Prophet model and generates a 7-day forecast.
    Dates are shifted to start from today for a realistic dashboard view.
    """

    # ── Load models ────────────────────────────────────────────────────
    loader = MarketModelLoader()
    models_dict = loader.get_model()

    if not models_dict:
        raise ValueError("AI Model not loaded. Run train_model.py first.")

    crop_key = crop_name.lower() if crop_name else "general"
    model = models_dict.get(crop_key) or models_dict.get("general")

    if not model:
        raise ValueError("Model not found.")

    # ── Prophet forecast ───────────────────────────────────────────────
    future   = model.make_future_dataframe(periods=days)
    forecast = model.predict(future)

    # Base price = last known value just before forecast window
    today_price = forecast.iloc[-(days + 1)]["yhat"]
    future_rows = forecast.tail(days)

    # Shift dates to today's date
    today_date  = datetime.today()
    predictions = []
    for i, (_, row) in enumerate(future_rows.iterrows()):
        shifted_date    = today_date + timedelta(days=i + 1)
        predicted_price = round(row["yhat"], 2)
        lower           = round(row["yhat_lower"], 2)
        upper           = round(row["yhat_upper"], 2)
        predictions.append({
            "date":            shifted_date.strftime("%Y-%m-%d"),
            "predicted_price": predicted_price,
            "lower_bound":     lower,
            "upper_bound":     upper,
        })

    # ── Recommendation logic ───────────────────────────────────────────
    tomorrow_price    = predictions[0]["predicted_price"]
    today_price_r     = round(today_price, 2)
    price_diff        = tomorrow_price - today_price_r
    percentage_change = (price_diff / today_price_r) * 100 if today_price_r else 0

    if percentage_change > 0.5:
        recommendation = "Wait (Don't Sell Yet)"
        reason  = f"Price is expected to increase by {percentage_change:.1f}%. Selling tomorrow will be more profitable."
        trend   = "Up"
    elif percentage_change < -0.5:
        recommendation = "Sell Today"
        reason  = f"Price is expected to drop by {abs(percentage_change):.1f}%. Sell now to avoid loss."
        trend   = "Down"
    else:
        recommendation = "Hold Stock"
        reason  = "Prices are relatively stable. You may wait for a better opportunity."
        trend   = "Stable"

    # Confidence from uncertainty interval width
    confidence_spread = predictions[0]["upper_bound"] - predictions[0]["lower_bound"]
    confidence = max(50, 100 - (confidence_spread / today_price_r * 100)) if today_price_r else 85

    return {
        "crop":                     crop_name or "General",
        "today_price":              today_price_r,
        "predictions":              predictions,
        "trend":                    trend,
        "recommendation":           recommendation,
        "reason":                   reason,
        "confidence":               f"{min(99, int(confidence))}%",
        "expectedProfitDifference": round(price_diff, 2),
    }
