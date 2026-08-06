import os
from google import genai
from google.genai import types
from .intent_detector import get_intent

_gemini_client = None

def get_gemini_client():
    global _gemini_client
    if _gemini_client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            _gemini_client = genai.Client(api_key=api_key)
    return _gemini_client

SYSTEM_PROMPT = """You are AgroNex AI. You are an agriculture expert.
Never answer outside agriculture unless it is a greeting.
Always prefer AgroNex internal services over Gemini.
If the user asks in Gujarati, reply in Gujarati.
If the user asks in Hindi, reply in Hindi.
Otherwise, reply in English.
Never hallucinate weather.
Never invent government schemes.
"""

def call_gemini(question):
    try:
        client = get_gemini_client()
        if not client:
            return "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file."
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=question,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
            )
        )
        return response.text
    except Exception as e:
        return f"Error contacting Gemini API: {str(e)}"

def get_weather_service(question):
    """Fetch real weather data from Open-Meteo API (same as Dashboard)."""
    try:
        import requests
        lat, lon = 23.03, 72.55
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
            "timezone": "auto"
        }
        response = requests.get(url, params=params, timeout=8)
        response.raise_for_status()
        data = response.json()
        current = data.get("current", {})

        temp = current.get("temperature_2m", "N/A")
        humidity = current.get("relative_humidity_2m", "N/A")
        wind = current.get("wind_speed_10m", "N/A")
        rain = current.get("precipitation", 0)

        return (
            f"Current Weather for your location ({lat}°N, {lon}°E):\n"
            f"🌡️ Temperature: {temp}°C\n"
            f"💧 Humidity: {humidity}%\n"
            f"💨 Wind Speed: {wind} km/h\n"
            f"🌧️ Precipitation: {rain} mm\n"
        )
    except Exception as e:
        return f"Unable to fetch live weather data right now. Please check the Weather Forecast section for accurate data."

def get_government_scheme_service(question):
    return """Scheme Name: PM-KISAN
Benefits: ₹6,000 per year in 3 equal installments.
Eligibility: Small and marginal farmers.
Documents: Aadhaar Card, Bank Account Details, Land Record.
Official Website: pmkisan.gov.in
Apply Link: https://pmkisan.gov.in/"""

def get_crop_recommendation_service(question):
    """
    Routes crop recommendation questions to Gemini AI with agriculture expert context.
    For ML-based prediction with soil parameters, use the /api/crop-ai/predict/ endpoint.
    """
    crop_prompt = f"""You are an expert agronomist and crop advisor working with AgroNex.
A farmer is asking for crop recommendation advice.

Farmer's question: {question}

Please provide helpful crop recommendation advice covering:
- Recommended crop(s) based on what the farmer mentioned (soil type, season, location, climate, etc.)
- Why this crop is suitable
- Best season/time to plant
- Basic soil requirements
- Expected yield or benefits

If the farmer hasn't provided soil details (N, P, K, pH, temperature, humidity, rainfall),
suggest them to use the "Crop Recommendation" feature in AgroNex app for an accurate ML-based prediction.

Reply in the same language as the question (Gujarati/Hindi/English).
"""
    return call_gemini(crop_prompt)

def get_disease_detection_service(question):
    """
    Routes disease/pest/symptom questions to Gemini API with plant pathologist context.
    For image-based disease detection, use the /api/disease/predict/ endpoint instead.
    """
    disease_prompt = f"""You are an expert plant pathologist and agronomist working with AgroNex.
A farmer is asking about a plant disease, pest, or symptom.

Farmer's question: {question}

Please provide a helpful answer covering:
- Possible disease or pest name (if identifiable from description)
- Symptoms to look for
- Chemical treatment (if applicable)
- Organic/natural treatment options
- Prevention tips

If the question is too vague to identify a specific disease, ask the farmer to upload a photo 
using the Disease Detection feature in the AgroNex app for accurate AI-powered diagnosis.

Reply in the same language as the question (Gujarati/Hindi/English).
"""
    return call_gemini(disease_prompt)


def route_question(question):
    intent, confidence = get_intent(question)
    
    source = "AgroNex Internal Service"
    answer = ""

    try:
        if intent == "Greeting":
            answer = "Hello! I am AgroNex AI. How can I help you with your farming needs today?"
        elif intent == "Weather":
            answer = get_weather_service(question)
        elif intent == "Government Schemes":
            answer = get_government_scheme_service(question)
        elif intent == "Crop Recommendation":
            answer = get_crop_recommendation_service(question)
        elif intent == "Disease":
            answer = get_disease_detection_service(question)
        elif intent == "General Agriculture":
            source = "Gemini AI"
            answer = call_gemini(question)
        else:
            source = "Gemini AI"
            answer = call_gemini(question)
    except Exception as e:
        answer = f"Error processing your request: {str(e)}"
        source = "Error"
        
    return {
        "answer": answer,
        "intent": intent,
        "source": source,
        "confidence": confidence
    }
