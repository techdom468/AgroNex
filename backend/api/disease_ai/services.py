import os
import uuid
import datetime
from django.conf import settings
from django.core.files.storage import default_storage
from api.database.mongodb import get_db
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
        
        # 3. Predict
        success, msg, result = predict_disease(full_path)
        if not success:
            # Cleanup saved file on AI failure
            if os.path.exists(full_path):
                os.remove(full_path)
            return False, msg, None
            
        # 4. Save to MongoDB
        collection = cls.get_collection()
        history_record = None
        
        if collection is not None:
            record = {
                'user_id': str(user_id),
                'image_url': f"{settings.MEDIA_URL}{saved_file}",
                'disease_name': result['disease'],
                'confidence': result['confidence'],
                'medicine': result['info']['recommended_medicine'],
                'organic_treatment': result['info']['organic_treatment'],
                'prediction_date': datetime.datetime.now(datetime.timezone.utc),
                'details': result['info']
            }
            inserted = collection.insert_one(record)
            
            history_record = {
                'id': str(inserted.inserted_id),
                'image_url': record['image_url'],
                'disease_name': record['disease_name'],
                'confidence': record['confidence'],
                'prediction_date': record['prediction_date']
            }
            
        # Add history record to the result
        result['history'] = history_record
        result['image_url'] = f"{settings.MEDIA_URL}{saved_file}"
        
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
                'image_url': doc['image_url'],
                'disease_name': doc['disease_name'],
                'confidence': doc['confidence'],
                'medicine': doc.get('medicine', ''),
                'prediction_date': doc['prediction_date']
            })
            
        return True, "History fetched.", history
