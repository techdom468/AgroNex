import os
import joblib
import pandas as pd

class CropService:
    _model = None

    @classmethod
    def load_model(cls):
        if cls._model is None:
            model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'ai_models', 'crop_model.pkl')
            try:
                cls._model = joblib.load(model_path)
            except Exception as e:
                print(f"Error loading Crop AI model: {e}")
                return None
        return cls._model

    @staticmethod
    def predict_crop(n, p, k, temperature, humidity, ph, rainfall):
        model = CropService.load_model()
        if not model:
            return False, "AI Model not available. Please contact administrator.", None

        try:
            # Create a dataframe with the exact feature names used during training
            features = pd.DataFrame([[n, p, k, temperature, humidity, ph, rainfall]], 
                                    columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
            
            prediction = model.predict(features)[0]
            
            # Additional crop information (mock data for now)
            crop_details = {
                "name": prediction,
                "description": f"{prediction} is highly suitable for your soil and weather conditions.",
                "confidence": 92.5 # Mock confidence score
            }
            return True, "Prediction successful", crop_details
        except Exception as e:
            return False, f"Prediction error: {str(e)}", None
