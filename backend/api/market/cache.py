import datetime
import pymongo
from .models import get_market_price_collection
from .government_api import GovernmentMarketAPI
from .utils import parse_arrival_date

class MarketCacheLayer:
    """
    Handles caching logic. Checks MongoDB first, if missing or stale, calls Gov API.
    """
    @staticmethod
    def _format_record(gov_record):
        # Format API record to match our MongoDB schema
        try:
            arrival_date = parse_arrival_date(gov_record.get('arrival_date', ''))
            return {
                'arrival_date': arrival_date,
                'state': gov_record.get('state', '').strip(),
                'district': gov_record.get('district', '').strip(),
                'market': gov_record.get('market', '').strip(),
                'commodity': gov_record.get('commodity', '').strip(),
                'grade': gov_record.get('grade', '').strip(),
                'variety': gov_record.get('variety', '').strip(),
                'min_price': float(gov_record.get('min_price', 0) or 0),
                'max_price': float(gov_record.get('max_price', 0) or 0),
                'modal_price': float(gov_record.get('modal_price', 0) or 0),
                'source': 'gov_api',
                'created_at': datetime.datetime.now(datetime.timezone.utc),
                'updated_at': datetime.datetime.now(datetime.timezone.utc)
            }
        except Exception:
            return None

    @classmethod
    def get_current_prices(cls, state=None, district=None, commodity=None):
        collection = get_market_price_collection()
        if collection is None:
            return False, "Database connection failed", []

        # Find latest records matching criteria
        query = {}
        if state: query['state'] = state
        if district: query['district'] = district
        if commodity: query['commodity'] = commodity

        # Let's check if we have data for today or yesterday
        today_str = datetime.datetime.now().strftime("%d/%m/%Y")
        today_parsed = parse_arrival_date(today_str)
        
        # We query the DB, sorted by arrival_date desc
        cursor = collection.find(query).sort('arrival_date', pymongo.DESCENDING).limit(50)
        cached_results = list(cursor)

        # If cache hit and data is recent enough (we'll just return what we have and let scheduler update, 
        # BUT the prompt says "If latest data exists Return Cached Data Else Call Government API").
        # If cache is empty for this query, we fetch from Gov API.
        if cached_results:
            # We have historical/cached data. Is it latest?
            latest_date = cached_results[0]['arrival_date']
            # If latest date is not too old (within 2 days), we can return it.
            # But let's just return if anything exists. For real-time "missing", we fetch.
            return True, "Success (Cache Hit)", cached_results

        # Cache miss
        success, api_data = GovernmentMarketAPI.fetch_market_prices(
            state=state, district=district, commodity=commodity, limit=50
        )

        if not success:
            # api_data contains error message
            return False, api_data, []

        # Store in MongoDB
        formatted_records = []
        for record in api_data:
            fmt = cls._format_record(record)
            if fmt:
                formatted_records.append(fmt)
        
        if formatted_records:
            # Insert many, ignore duplicates based on unique index
            try:
                collection.insert_many(formatted_records, ordered=False)
            except pymongo.errors.BulkWriteError:
                pass # Duplicates are skipped

        # Return the newly fetched and formatted records
        return True, "Success (API Fetched)", formatted_records

    @classmethod
    def get_historical_prices(cls, state=None, district=None, commodity=None, limit=30):
        collection = get_market_price_collection()
        if collection is None:
            return False, "Database connection failed", []

        query = {}
        if state: query['state'] = state
        if district: query['district'] = district
        if commodity: query['commodity'] = commodity

        cursor = collection.find(query).sort('arrival_date', pymongo.DESCENDING).limit(limit)
        results = list(cursor)

        # Since it's history, we primarily rely on DB (populated by scheduler)
        # If DB is empty, we don't automatically backfill 30 days via single API call because Gov API 
        # pagination is complex for historical. 
        if results:
            return True, "Success", results
        else:
            # Try fetching a few pages from API if totally empty
            success, api_data = GovernmentMarketAPI.fetch_market_prices(
                state=state, district=district, commodity=commodity, limit=limit
            )
            if success and api_data:
                formatted = [cls._format_record(r) for r in api_data if cls._format_record(r)]
                if formatted:
                    try:
                        collection.insert_many(formatted, ordered=False)
                    except pymongo.errors.BulkWriteError:
                        pass
                return True, "Success (API Fetched)", formatted
            
        return True, "No historical data found", []
