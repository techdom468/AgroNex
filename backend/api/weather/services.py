from datetime import datetime
from django.core.cache import cache
from api.database.mongo import get_db
from .weather_api import fetch_weather_data
from .rule_engine import WeatherRuleEngine

CACHE_TIMEOUT = 1800  # 30 minutes

def get_weather_and_recommendations(user_id, lat, lon, location_name="Unknown"):
    """
    Service to get weather, generate recommendations, cache response, and save history.
    """
    cache_key = f"weather_{lat}_{lon}"
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return cached_data
    
    try:
        raw_data = fetch_weather_data(lat, lon)
        current = raw_data.get('current', {})
        daily = raw_data.get('daily', {})
        hourly = raw_data.get('hourly', {})
        
        recommendations = WeatherRuleEngine.generate_recommendations(current, daily, hourly)
        
        response_data = {
            "current": current,
            "daily": daily,
            "hourly": hourly,
            "recommendations": recommendations,
            "location": {
                "latitude": lat,
                "longitude": lon,
                "name": location_name
            }
        }
        
        # Cache the successful response
        cache.set(cache_key, response_data, CACHE_TIMEOUT)
        
        # Save to MongoDB asynchronously (fire and forget for this MVP)
        # Using a simple synchronous insert here since PyMongo is synchronous
        _save_weather_history(user_id, lat, lon, location_name, current, recommendations)
        
        return response_data
    except Exception as e:
        raise Exception(f"Failed to fetch weather data: {str(e)}")

def _save_weather_history(user_id, lat, lon, location_name, current, recommendations):
    db = get_db()
    if db is None:
        return
        
    history_collection = db['weather_history']
    
    record = {
        "user_id": user_id,
        "latitude": lat,
        "longitude": lon,
        "location": location_name,
        "temperature": current.get('temperature_2m'),
        "humidity": current.get('relative_humidity_2m'),
        "rain_probability": current.get('precipitation', 0), # Simplified for current
        "wind_speed": current.get('wind_speed_10m'),
        "pressure": current.get('surface_pressure'),
        "forecast_date": datetime.utcnow(),
        "generated_recommendations": recommendations,
        "created_timestamp": datetime.utcnow()
    }
    
    try:
        history_collection.insert_one(record)
    except Exception as e:
        print(f"Failed to save weather history: {str(e)}")

def fetch_user_weather_history(user_id):
    db = get_db()
    if db is None:
        return []
        
    history_collection = db['weather_history']
    records = list(history_collection.find({"user_id": user_id}).sort("created_timestamp", -1).limit(20))
    
    # Convert ObjectId to string for JSON serialization
    for record in records:
        record['_id'] = str(record['_id'])
        
    return records
