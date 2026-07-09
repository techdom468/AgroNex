from pymongo import MongoClient
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from multiple possible locations
_base = Path(__file__).resolve()
load_dotenv(_base.parent.parent.parent.parent / '.env')  # AgroNex root
load_dotenv(_base.parent.parent.parent / '.env')         # backend/

MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")

# Connect to MongoDB regardless of whether it's local or Atlas
try:
    if MONGO_URI:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client['agronex']
        chat_collection = db['chat_history']
        print(f"[MongoDB] Chatbot connected to database.")
    else:
        print("[MongoDB] No MONGODB_URI found. Chat history will be session-only (in-memory).")
        client = None
        db = None
        chat_collection = None

except Exception as e:
    print(f"[MongoDB] Connection error: {e}")
    client = None
    db = None
    chat_collection = None
