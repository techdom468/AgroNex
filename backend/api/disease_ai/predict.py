import os
import json
import time
from google import genai
from PIL import Image

# Singleton Gemini client — reused across all requests
_gemini_client = None

# Fallback model list — verified available models (google-genai SDK)
GEMINI_MODELS = [
    'gemini-flash-lite-latest',  # ✅ Working on current quota
    'gemini-2.0-flash-lite',     # Fallback when quota resets
    'gemini-2.0-flash',          # Fallback 2
]

def _get_client():
    global _gemini_client
    if _gemini_client is None:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return None
        _gemini_client = genai.Client(api_key=api_key)
    return _gemini_client

def predict_disease(image_path, plant_name):
    """
    Runs Gemini Flash inference on the given image path to detect diseases.
    Automatically retries with fallback models on 503 UNAVAILABLE.
    """
    client = _get_client()
    if not client:
        return False, "GEMINI_API_KEY is not configured.", None

    # Load image once
    img = Image.open(image_path)

    # Construct prompt
    prompt = f"""You are an expert plant pathologist and agronomist. 
I have identified this plant as '{plant_name}'. 
Please analyze the provided image of its leaf. 

Does this leaf show any signs of disease, pests, or nutrient deficiency?
If the leaf is healthy, indicate that it is healthy.

Respond ONLY with a valid JSON object matching this exact structure (do not include markdown block formatting, just the raw JSON):
{{
    "disease": "Name of the disease (or '{plant_name} Healthy' if healthy)",
    "confidence": 95.5,
    "info": {{
        "name": "Name of the disease (or 'Healthy Plant')",
        "symptoms": "Detailed symptoms observed (or 'None')",
        "causes": "Causes of the disease (or 'N/A')",
        "recommended_medicine": "Specific chemical or biological medicine recommended (or 'N/A')",
        "organic_treatment": "Organic treatment or natural remedies (or 'Continue regular care')",
        "prevention": "How to prevent this in the future (or 'Maintain current good practices')",
        "recovery_time": "Estimated recovery time (or 'N/A')"
    }}
}}"""

    last_error = None

    # Try each model in order
    for model in GEMINI_MODELS:
        try:
            response = client.models.generate_content(
                model=model,
                contents=[img, prompt],
            )

            # Clean up response text to parse JSON
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]

            result = json.loads(response_text.strip())
            return True, "Prediction successful.", result

        except json.JSONDecodeError:
            return False, "AI returned an invalid response format. Please try again.", None

        except Exception as e:
            error_str = str(e)
            last_error = error_str
            # 503 = server busy, 429 = quota exceeded, 404 = model not found — try next model
            if any(code in error_str for code in ['503', '429', '404', 'UNAVAILABLE', 'RESOURCE_EXHAUSTED', 'NOT_FOUND', 'overloaded']):
                time.sleep(1)  # brief pause before next model
                continue
            # Any other error — stop immediately
            return False, f"Prediction error: {error_str}", None

    # All models failed — show clean message, not raw API error
    return False, "AI service is temporarily unavailable. Please try again after a few minutes.", None
