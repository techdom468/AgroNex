import os
import sys
import django
import requests

sys.path.append(os.path.abspath('.'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.market.cache import MarketCacheLayer
from api.market.models import get_market_price_collection
from api.market.government_api import GovernmentMarketAPI

print("Fetching data from Government API...")

# Use a longer timeout for the Government API directly
try:
    success, api_data = GovernmentMarketAPI.fetch_market_prices(limit=1000)
    if success and api_data:
        print(f"Successfully fetched {len(api_data)} records.")
        formatted_records = []
        for record in api_data:
            fmt = MarketCacheLayer._format_record(record)
            if fmt:
                formatted_records.append(fmt)
        
        if formatted_records:
            collection = get_market_price_collection()
            collection.insert_many(formatted_records, ordered=False)
            print(f"Inserted {len(formatted_records)} into MongoDB.")
    else:
        print("Failed to fetch:", api_data)
except Exception as e:
    print(f"Exception: {e}")
