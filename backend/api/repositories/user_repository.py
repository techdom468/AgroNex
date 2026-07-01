import datetime
from bson.objectid import ObjectId
from api.database.mongodb import get_db

class UserRepository:
    @staticmethod
    def get_collection():
        db = get_db()
        if db is not None:
            return db['users']
        return None

    @classmethod
    def find_by_email(cls, email):
        collection = cls.get_collection()
        if collection is not None:
            return collection.find_one({"email": email})
        return None
        
    @classmethod
    def find_by_id(cls, user_id):
        collection = cls.get_collection()
        if collection is not None:
            try:
                return collection.find_one({"_id": ObjectId(user_id)})
            except Exception:
                return None
        return None

    @classmethod
    def create_user(cls, user_data):
        collection = cls.get_collection()
        if collection is not None:
            user_data['created_at'] = datetime.datetime.now(datetime.timezone.utc)
            result = collection.insert_one(user_data)
            return result.inserted_id
        return None
