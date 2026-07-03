import os
import joblib

class MarketModelLoader:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MarketModelLoader, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.join(base_dir, 'market_price_model.pkl')
            
            if os.path.exists(model_path):
                self._model = joblib.load(model_path)
                print("Market Prediction Model loaded successfully.")
            else:
                print(f"Model file not found at {model_path}. Run train_model.py first.")
        except Exception as e:
            print(f"Error loading market model: {str(e)}")

    def get_model(self):
        return self._model
