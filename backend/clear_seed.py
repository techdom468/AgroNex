import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.market.models import get_market_price_collection

collection = get_market_price_collection()
if collection is None:
    print("Database connection failed")
    sys.exit(1)

# Delete records that are NOT from gov_api
result = collection.delete_many({"source": {"$ne": "gov_api"}})
print(f"Deleted {result.deleted_count} seed records.")
