import os
from google import genai
from google.genai import types
from .intent_detector import get_intent

# Configure Gemini client
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
Never hallucinate market prices or weather.
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

# Mock Internal Services
def get_weather_service(question):
    # In a real app, parse location/date from question and call Weather API
    return "Weather for your location: Sunny, 28°C. Humidity: 45%. No rain expected tomorrow."

def get_market_price_service(question):
    return "Current Price: ₹7,500/quintal\nTomorrow Prediction: ₹7,600/quintal\nMarket Name: Rajkot Mandi\nDate: Today"

def get_government_scheme_service(question):
    return """Scheme Name: PM-KISAN
Benefits: ₹6,000 per year in 3 equal installments.
Eligibility: Small and marginal farmers.
Documents: Aadhaar Card, Bank Account Details, Land Record.
Official Website: pmkisan.gov.in
Apply Link: https://pmkisan.gov.in/"""

def get_crop_recommendation_service(question):
    return "Recommended Crop: Wheat\nConfidence: 92%\nReason: Best suited for your soil type and upcoming winter season."

def get_disease_detection_service(question):
    return """Disease: Leaf Blight
Symptoms: Yellowing and browning of leaves with distinct halos.
Chemical Treatment: Apply Mancozeb or Copper Oxychloride.
Organic Treatment: Neem oil spray (5ml/L).
Prevention: Ensure proper spacing for air circulation and avoid overhead watering."""


def route_question(question):
    intent, confidence = get_intent(question)
    
    source = "AgroNex Internal Service"
    answer = ""

    try:
        if intent == "Greeting":
            answer = "Hello! I am AgroNex AI. How can I help you with your farming needs today?"
        elif intent == "Weather":
            answer = get_weather_service(question)
        elif intent == "Market Price":
            answer = get_market_price_service(question)
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
