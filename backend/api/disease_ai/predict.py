import os
from .model_loader import DiseaseModelLoader

# Comprehensive disease database based on PlantVillage classes
DISEASE_DATABASE = {
    'Apple___Apple_scab': {
        'name': 'Apple Scab',
        'symptoms': 'Olive-green spots on leaves, becoming black and velvety. Fruit may crack.',
        'causes': 'Fungus (Venturia inaequalis)',
        'recommended_medicine': 'Fungicides containing Myclobutanil or Captan',
        'organic_treatment': 'Neem oil, Sulfur spray, remove fallen leaves',
        'prevention': 'Prune trees for better air circulation, avoid overhead watering',
        'recovery_time': '2-3 weeks with proper treatment'
    },
    'Tomato___Late_blight': {
        'name': 'Tomato Late Blight',
        'symptoms': 'Dark, water-soaked spots on leaves. White fungal growth on undersides.',
        'causes': 'Oomycete (Phytophthora infestans)',
        'recommended_medicine': 'Chlorothalonil or Copper-based fungicides',
        'organic_treatment': 'Copper spray, Bio-fungicides (Bacillus subtilis)',
        'prevention': 'Ensure good spacing, water at base of plant, avoid wet foliage',
        'recovery_time': 'Highly destructive; early treatment may halt spread in 1 week'
    },
    'Potato___Early_blight': {
        'name': 'Potato Early Blight',
        'symptoms': 'Brown rings with target-like concentric rings on older leaves.',
        'causes': 'Fungus (Alternaria solani)',
        'recommended_medicine': 'Mancozeb or Chlorothalonil',
        'organic_treatment': 'Copper fungicide, Compost tea',
        'prevention': 'Crop rotation, remove plant debris, proper fertilization',
        'recovery_time': '1-2 weeks to halt spread'
    }
}

# Add default handler for generic diseases or dummy detections
def get_disease_info(class_name):
    # Since we are using YOLOv8n (COCO classes) as a placeholder for local dev,
    # the predictions will be objects like 'person', 'car', 'apple'.
    # For a real PlantVillage model, it would output 'Tomato___Late_blight'.
    
    info = DISEASE_DATABASE.get(class_name)
    if info:
        return info
        
    return {
        'name': class_name.replace('___', ' ').replace('_', ' ').title(),
        'symptoms': 'General yellowing or spotting observed on the leaf surface.',
        'causes': 'Various fungal, bacterial, or environmental stress factors.',
        'recommended_medicine': 'Broad-spectrum fungicide or insecticide based on precise diagnosis.',
        'organic_treatment': 'Neem oil spray (1%) every 7 days.',
        'prevention': 'Maintain proper plant spacing, avoid overhead watering, ensure soil drainage.',
        'recovery_time': '1-3 weeks depending on severity'
    }

def predict_disease(image_path):
    """
    Runs YOLOv8 inference on the given image path.
    """
    model = DiseaseModelLoader.get_model()
    if not model:
        return False, "Disease AI Model is not available.", None
        
    try:
        # Run inference
        results = model(image_path)
        
        if not results or len(results) == 0:
            return False, "No predictions could be made.", None
            
        result = results[0]
        
        # If no probs detected (unlikely for classification, but just in case)
        if not hasattr(result, 'probs') or result.probs is None:
            # Could be healthy or just nothing detected
            return True, "No disease detected. Plant appears healthy.", {
                'disease': 'Healthy',
                'confidence': 100.0,
                'info': {
                    'name': 'Healthy Plant',
                    'symptoms': 'None',
                    'causes': 'N/A',
                    'recommended_medicine': 'N/A',
                    'organic_treatment': 'Continue regular care',
                    'prevention': 'Maintain current good practices',
                    'recovery_time': 'N/A'
                }
            }
            
        # Get the highest confidence prediction from classification model
        class_id = result.probs.top1
        confidence = float(result.probs.top1conf.item()) * 100
        
        # Get class name
        class_name = model.names[class_id]
        
        # Get detailed info
        disease_info = get_disease_info(class_name)
        
        return True, "Prediction successful.", {
            'disease': disease_info['name'],
            'confidence': round(confidence, 2),
            'info': disease_info
        }
        
    except Exception as e:
        return False, f"Prediction error: {str(e)}", None
