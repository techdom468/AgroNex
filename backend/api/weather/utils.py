def parse_weather_data(raw_data):
    """
    Parse raw Open-Meteo data into a more structured format for the frontend.
    """
    return {
        "current": raw_data.get("current", {}),
        "hourly": raw_data.get("hourly", {}),
        "daily": raw_data.get("daily", {})
    }
