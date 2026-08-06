import os
import uuid
import datetime
from django.conf import settings
from django.core.files.storage import default_storage
from api.database.mongo import get_db
from .validators import validate_image
from .predict import predict_disease

class DiseaseDetectionService:
    @staticmethod
    def get_collection():
        db = get_db()
        if db is not None:
            return db['disease_predictions']
        return None

    @classmethod
    def identify_plant_with_plantnet(cls, image_path):
        import requests
        api_key = os.getenv('PLANTNET_API_KEY')
        if not api_key:
            return True, None, "Warning: PLANTNET_API_KEY not configured"

        url = f"https://my-api.plantnet.org/v2/identify/all?api-key={api_key}"
        
        try:
            with open(image_path, 'rb') as f:
                files = {'images': (os.path.basename(image_path), f)}
                data = {'organs': ['leaf']}
                response = requests.post(url, files=files, data=data, timeout=5)
            
            if response.status_code != 200:
                return True, None, "PlantNet API failed"
                
            result = response.json()
            if not result.get('results'):
                return True, None, "Could not identify plant"
                
            top_match = result['results'][0]
            common_names = top_match['species'].get('commonNames', [])
            scientific_name = top_match['species'].get('scientificNameWithoutAuthor', '')
            
            plant_name = common_names[0] if common_names else scientific_name
            
            return True, plant_name, "Supported plant"
            
        except Exception as e:
            return True, None, f"PlantNet Error: {str(e)}"

    @classmethod
    def process_image(cls, user_id, image_file):
        """
        Validates, saves, predicts, and stores the history in MongoDB.
        """
        # 1. Validate
        is_valid, msg = validate_image(image_file)
        if not is_valid:
            return False, msg, None
            
        # 2. Save Image
        ext = os.path.splitext(image_file.name)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        save_path = os.path.join('uploads', filename)
        
        # This saves to MEDIA_ROOT/uploads/
        saved_file = default_storage.save(save_path, image_file)
        full_path = os.path.join(settings.MEDIA_ROOT, saved_file)
        
        # 3. Pre-screen with Pl@ntNet API
        is_supported, plant_name, msg = cls.identify_plant_with_plantnet(full_path)
        if not is_supported:
            if os.path.exists(full_path):
                os.remove(full_path)
            return False, msg, None

        # 4. Predict using Gemini
        success, msg, result = predict_disease(full_path, plant_name)
        
        # We no longer cleanup the saved file, we keep it for history
        image_url = f"{settings.MEDIA_URL}{save_path}".replace("\\", "/")
            
        if not success:
            # If prediction fails, we might still want to clean up or keep it. Let's clean up on failure.
            if os.path.exists(full_path):
                os.remove(full_path)
            return False, msg, None
            
        # 5. Save to MongoDB
        collection = cls.get_collection()
        history_record = None
        
        if collection is not None:
            record = {
                'user_id': str(user_id),
                'disease_name': result['disease'],
                'confidence': result['confidence'],
                'medicine': result['info']['recommended_medicine'],
                'organic_treatment': result['info']['organic_treatment'],
                'prediction_date': datetime.datetime.now(datetime.timezone.utc),
                'details': result['info'],
                'image_url': image_url
            }
            inserted = collection.insert_one(record)
            
            history_record = {
                'id': str(inserted.inserted_id),
                'disease_name': record['disease_name'],
                'confidence': record['confidence'],
                'prediction_date': record['prediction_date'],
                'image_url': record['image_url']
            }
            
        # Add history record to the result
        result['history'] = history_record
        result['image_url'] = image_url
        result['plant_name'] = plant_name if plant_name else 'Unknown'
        
        return True, "Analysis complete.", result
        
    @classmethod
    def get_user_history(cls, user_id, skip=0, limit=10):
        collection = cls.get_collection()
        if collection is None:
            return False, "Database not available", []
            
        cursor = collection.find({'user_id': str(user_id)}).sort('prediction_date', -1).skip(skip).limit(limit)
        
        history = []
        for doc in cursor:
            history.append({
                'id': str(doc['_id']),
                'disease_name': doc['disease_name'],
                'confidence': doc['confidence'],
                'medicine': doc.get('medicine', ''),
                'prediction_date': doc['prediction_date'],
                'image_url': doc.get('image_url', '')
            })
            
        return True, "History fetched.", history
