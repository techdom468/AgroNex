import datetime
from bson.objectid import ObjectId
from api.database.mongo import get_db

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

    @classmethod
    def update_profile(cls, user_id, profile_data):
        """
        Updates farmer profile fields (state, district, main_crop, farm_size).
        Only updates allowed fields to prevent injection.
        """
        collection = cls.get_collection()
        if collection is None:
            return False

        allowed_fields = ['state', 'district', 'main_crop', 'farm_size', 'full_name', 'mobile', 'soil_type', 'profile_image']
        update_data = {}
        for key, val in profile_data.items():
            if key in allowed_fields and val is not None:
                update_data[key] = val

        if not update_data:
            return False

        update_data['updated_at'] = datetime.datetime.now(datetime.timezone.utc)

        try:
            result = collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            # matched_count > 0 means user was found and update was attempted
            # even if no fields changed (modified_count == 0), that's still success
            return result.matched_count > 0
        except Exception:
            return False

    @classmethod
    def set_reset_token(cls, user_id, token, expiry):
        collection = cls.get_collection()
        if collection is None:
            return False
        
        try:
            result = collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "reset_token": token,
                    "reset_token_expiry": expiry
                }}
            )
            return result.matched_count > 0
        except Exception:
            return False

    @classmethod
    def find_by_reset_token(cls, token):
        collection = cls.get_collection()
        if collection is not None:
            now = datetime.datetime.now(datetime.timezone.utc)
            # Find user with matching token and expiry > now
            return collection.find_one({
                "reset_token": token,
                "reset_token_expiry": {"$gt": now}
            })
        return None

    @classmethod
    def update_password(cls, user_id, hashed_password):
        collection = cls.get_collection()
        if collection is None:
            return False
        
        try:
            result = collection.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {"password_hash": hashed_password},
                    "$unset": {"reset_token": "", "reset_token_expiry": ""}
                }
            )
            return result.matched_count > 0
        except Exception:
            return False
