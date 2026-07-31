from .cache import MarketCacheLayer
from .utils import serialize_mongo_doc

class MarketService:
    """
    Business logic layer for Market module.
    Exposes clean methods for views to consume.
    """
    @classmethod
    def get_current_prices(cls, state=None, district=None, commodity=None):
        success, msg, data = MarketCacheLayer.get_current_prices(state, district, commodity)
        
        if success:
            serialized_data = [serialize_mongo_doc(doc) for doc in data]
            return True, msg, serialized_data
        
        return False, msg, []

    @classmethod
    def get_historical_prices(cls, state=None, district=None, commodity=None, limit=30):
        success, msg, data = MarketCacheLayer.get_historical_prices(state, district, commodity, limit)
        
        if success:
            serialized_data = [serialize_mongo_doc(doc) for doc in data]
            return True, msg, serialized_data
            
        return False, msg, []

    @classmethod
    def get_states(cls):
        from .models import get_market_price_collection
        collection = get_market_price_collection()
        states = []
        if collection is not None:
            states = collection.distinct('state')
        
        if not states:
            states = ["Gujarat", "Maharashtra", "Punjab", "Haryana", "Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Telangana"]
        return True, "Success", states

    @classmethod
    def get_districts(cls, state=None):
        from .models import get_market_price_collection
        collection = get_market_price_collection()
        districts = []
        if collection is not None:
            query = {'state': state} if state else {}
            districts = collection.distinct('district', query)
            
        if not districts:
            # Fallback based on some states or general list
            if state == "Gujarat":
                districts = ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Bhavnagar", "Jamnagar", "Amreli", "Junagadh", "Kutch", "Patan", "Mehsana"]
            elif state == "Maharashtra":
                districts = ["Pune", "Nashik", "Nagpur", "Mumbai", "Thane", "Aurangabad", "Solapur", "Kolhapur"]
            else:
                districts = ["Rajkot", "Ahmedabad", "Pune", "Ludhiana"]
        return True, "Success", districts

    @classmethod
    def get_commodities(cls, state=None, district=None):
        from .models import get_market_price_collection
        collection = get_market_price_collection()
        commodities = []
        if collection is not None:
            query = {}
            if state: query['state'] = state
            if district: query['district'] = district
            commodities = collection.distinct('commodity', query)
            
        if not commodities:
            commodities = ["Wheat", "Cotton", "Rice", "Maize", "Bajra", "Jowar", "Groundnut", "Soyabean", "Mustard", "Gram"]
        return True, "Success", commodities
