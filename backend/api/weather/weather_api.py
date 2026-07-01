import requests
import logging

logger = logging.getLogger(__name__)

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

def fetch_weather_data(lat: float, lon: float):
    """
    Fetches comprehensive weather data from Open-Meteo.
    Includes current, hourly (for 24 hours), and daily (for 7 days).
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,surface_pressure,wind_speed_10m",
        "hourly": "temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,uv_index",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
        "timezone": "auto"
    }
    
    try:
        response = requests.get(OPEN_METEO_URL, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        logger.error("Open-Meteo API timeout")
        raise Exception("Weather API timeout")
    except requests.exceptions.RequestException as e:
        logger.error(f"Open-Meteo API error: {str(e)}")
        raise Exception(f"Weather API error: {str(e)}")
