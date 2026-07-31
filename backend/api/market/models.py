from api.database.mongodb import get_db
import pymongo

MARKET_PRICE_COLLECTION = 'market_prices'
PREDICTION_COLLECTION = 'market_predictions'

def get_market_price_collection():
    db = get_db()
    if db is not None:
        return db[MARKET_PRICE_COLLECTION]
    return None

def get_prediction_collection():
    db = get_db()
    if db is not None:
        return db[PREDICTION_COLLECTION]
    return None

def setup_indexes():
    """
    Setup indexes for performance as requested in the architecture.
    """
    db = get_db()
    if db is not None:
        # Market Price Indexes
        mp_coll = db[MARKET_PRICE_COLLECTION]
        # For querying latest price per commodity/market
        mp_coll.create_index([("state", pymongo.ASCENDING), ("district", pymongo.ASCENDING), ("commodity", pymongo.ASCENDING)])
        # For historical sorting
        mp_coll.create_index([("arrival_date", pymongo.DESCENDING)])
        # Unique constraint to skip duplicates
        mp_coll.create_index(
            [("arrival_date", pymongo.ASCENDING), ("market", pymongo.ASCENDING), ("commodity", pymongo.ASCENDING)], 
            unique=True
        )

        # Prediction Indexes
        pred_coll = db[PREDICTION_COLLECTION]
        pred_coll.create_index([("commodity", pymongo.ASCENDING), ("market", pymongo.ASCENDING)])
        pred_coll.create_index([("prediction_date", pymongo.DESCENDING)])
