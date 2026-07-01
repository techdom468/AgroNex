import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

MONGODB_URI = os.getenv('MONGODB_URI', '')

def get_db():
    """
    Returns the PyMongo database instance.
    """
    if not MONGODB_URI:
        print("WARNING: MONGODB_URI is not set in .env")
        return None
        
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        # Attempt to get server info to verify connection
        client.server_info()
        return client['agronex']
    except ConnectionFailure as e:
        print(f"ERROR: Could not connect to MongoDB: {e}")
        return None

# Singleton DB instance
db = get_db()
