import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '.env'))

MONGODB_URI = os.getenv('MONGODB_URI', '')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'agronex')

class MongoDBConnection:
    _client = None

    @classmethod
    def get_client(cls):
        if cls._client is None:
            if not MONGODB_URI:
                print("WARNING: MONGODB_URI is not set in .env")
                return None
            
            try:
                # Connection pooling configuration
                cls._client = MongoClient(
                    MONGODB_URI,
                    maxPoolSize=50,
                    minPoolSize=10,
                    serverSelectionTimeoutMS=5000
                )
                cls._client.server_info() # Verify connection
                print("Successfully connected to MongoDB (local)!")
            except ConnectionFailure as e:
                print(f"ERROR: Could not connect to MongoDB: {e}")
                cls._client = None
        return cls._client

    @classmethod
    def get_db(cls):
        client = cls.get_client()
        if client:
            return client[DATABASE_NAME]
        return None

# Export a function to get the db easily
def get_db():
    return MongoDBConnection.get_db()
