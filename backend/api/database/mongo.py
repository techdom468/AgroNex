from pymongo import MongoClient
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from multiple possible locations
_base = Path(__file__).resolve()
load_dotenv(_base.parent.parent.parent.parent / '.env')  # AgroNex root
load_dotenv(_base.parent.parent.parent / '.env')         # backend/

MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")

# Only connect if a real MongoDB Atlas URI is provided
_is_atlas = MONGO_URI and (MONGO_URI.startswith("mongodb+srv://") or (MONGO_URI.startswith("mongodb://") and "localhost" not in MONGO_URI))

try:
    if _is_atlas:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client['agronex']
        chat_collection = db['chat_history']
        print(f"[MongoDB] Connected to Atlas cluster.")
    else:
        print("[MongoDB] No Atlas URI found. Chat history will be session-only (in-memory).")
        client = None
        db = None
        chat_collection = None
except Exception as e:
    print(f"[MongoDB] Connection error: {e}")
    client = None
    db = None
    chat_collection = None
