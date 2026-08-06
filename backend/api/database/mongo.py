import os
from pathlib import Path
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# Load .env from multiple possible locations
_base = Path(__file__).resolve()
load_dotenv(_base.parent.parent.parent.parent / '.env')  # AgroNex root
load_dotenv(_base.parent.parent.parent / '.env')         # backend/

MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "agronex")


class MongoDBConnection:
    _client = None

    @classmethod
    def get_client(cls):
        if cls._client is None:
            if not MONGO_URI:
                print("[MongoDB] WARNING: MONGODB_URI is not set in .env")
                return None
            try:
                cls._client = MongoClient(
                    MONGO_URI,
                    maxPoolSize=50,
                    minPoolSize=10,
                    serverSelectionTimeoutMS=5000
                )
                cls._client.server_info()  # Verify connection
                print("[MongoDB] Successfully connected to MongoDB!")
            except ConnectionFailure as e:
                print(f"[MongoDB] ERROR: Could not connect to MongoDB: {e}")
                cls._client = None
        return cls._client

    @classmethod
    def get_db(cls):
        client = cls.get_client()
        if client:
            return client[DATABASE_NAME]
        return None


def get_db():
    """Shortcut to get the database instance."""
    return MongoDBConnection.get_db()


# --- Collections ---
_db = MongoDBConnection.get_db()

if _db is not None:
    chat_collection = _db['chat_history']
    print("[MongoDB] Chatbot connected to database.")
else:
    print("[MongoDB] No MONGODB_URI found. Chat history will be session-only (in-memory).")
    chat_collection = None
