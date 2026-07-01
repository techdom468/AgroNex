import os
from ultralytics import YOLO

class DiseaseModelLoader:
    _model = None

    @classmethod
    def get_model(cls):
        """
        Loads the YOLOv8 model only once into memory (Singleton pattern).
        Prevents reloading the model on every API request.
        """
        if cls._model is None:
            # Path to the best.pt file we generated
            model_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                'ai_models', 'disease', 'best.pt'
            )
            
            try:
                print(f"Loading YOLOv8 Disease Model from: {model_path}")
                cls._model = YOLO(model_path)
            except Exception as e:
                print(f"Failed to load YOLOv8 model: {e}")
                return None
                
        return cls._model
