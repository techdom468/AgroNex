class WeatherRuleEngine:
    """
    AI Rule Engine to generate farming recommendations based on weather data.
    """
    
    @staticmethod
    def generate_recommendations(current, daily, hourly):
        temp = current.get('temperature_2m', 0)
        humidity = current.get('relative_humidity_2m', 0)
        wind_speed = current.get('wind_speed_10m', 0)
        
        # Max probabilities and values for today/tomorrow
        rain_prob_today = daily.get('precipitation_probability_max', [0])[0] if daily and 'precipitation_probability_max' in daily else 0
        uv_index_today = daily.get('uv_index_max', [0])[0] if daily and 'uv_index_max' in daily else 0
        rain_sum_today = daily.get('precipitation_sum', [0])[0] if daily and 'precipitation_sum' in daily else 0
        
        # Check consecutive rainy days (if next 3 days have > 50% rain prob)
        probs = daily.get('precipitation_probability_max', [])
        consecutive_rain = sum(1 for p in probs[:3] if p > 50) >= 2
        
        recommendations = {
            "todays_advice": "Weather conditions are stable.",
            "tomorrows_advice": "No major weather changes expected.",
            "irrigation": "Standard irrigation is fine.",
            "spraying": "Conditions are suitable for spraying.",
            "harvest": "Good conditions for harvesting.",
            "fertilizer": "Suitable time for fertilizer application.",
            "disease_risk": "Low risk of fungal diseases.",
            "heat_stress": "No heat stress warning.",
            "rain_warning": "No significant rain expected.",
            "wind_warning": "Wind conditions are normal."
        }

        # Temperature Rules
        if temp > 38:
            recommendations['todays_advice'] = "Extreme heat detected. Protect sensitive crops."
            recommendations['irrigation'] = "Irrigate crops during early morning or evening to reduce evaporation loss."
            recommendations['heat_stress'] = f"High heat stress risk ({temp}°C). Ensure adequate soil moisture."
        elif 20 <= temp <= 30:
            recommendations['todays_advice'] = "Weather conditions are suitable for healthy crop growth."

        # Rain Rules
        if rain_prob_today > 80 or rain_sum_today > 10:
            recommendations['irrigation'] = "Avoid irrigation today because rainfall is highly likely."
            recommendations['rain_warning'] = f"High probability of rain ({rain_prob_today}%). Keep harvested crops covered."
            recommendations['harvest'] = "Delay harvest due to expected rain."
            recommendations['fertilizer'] = "Delay fertilizer application until rainfall ends to prevent runoff."

        # Consecutive Rain
        if consecutive_rain:
            recommendations['rain_warning'] = "Consecutive rainy days predicted. Check drainage to prevent waterlogging."
            recommendations['disease_risk'] = "Prolonged moisture increases fungal disease risk."

        # Wind Rules
        if wind_speed > 20:
            recommendations['spraying'] = "Avoid pesticide spraying because strong wind may reduce spraying efficiency and cause drift."
            recommendations['wind_warning'] = f"Strong winds detected ({wind_speed} km/h). Secure tall crops."

        # Humidity Rules
        if humidity > 90:
            recommendations['disease_risk'] = "High fungal disease risk due to high humidity. Inspect leaves regularly. Avoid unnecessary irrigation."
        
        # UV Index Rules
        if uv_index_today > 8:
            recommendations['todays_advice'] = "Very High UV Index. Avoid transplanting sensitive crops during afternoon hours."

        # Tomorrow's Advice
        if len(probs) > 1:
            if probs[1] > 70:
                recommendations['tomorrows_advice'] = "Prepare for rain tomorrow. Avoid leaving harvested crops in the field."
            elif daily.get('temperature_2m_max', [0,0])[1] > 38:
                recommendations['tomorrows_advice'] = "High temperatures expected tomorrow. Plan for early morning irrigation."
            else:
                recommendations['tomorrows_advice'] = "Tomorrow's weather looks favorable for standard farming activities."

        return recommendations
