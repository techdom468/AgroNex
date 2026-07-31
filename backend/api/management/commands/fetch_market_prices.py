import time
from django.core.management.base import BaseCommand
from api.market.government_api import GovernmentMarketAPI
from api.market.cache import MarketCacheLayer
from api.market.models import get_market_price_collection
import pymongo

class Command(BaseCommand):
    help = 'Fetches daily market prices from the Government API and stores them in MongoDB'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting market prices fetch...'))
        
        limit = 1000
        offset = 0
        total_fetched = 0
        total_inserted = 0
        
        collection = get_market_price_collection()
        if collection is None:
            self.stdout.write(self.style.ERROR('Database connection failed!'))
            return
            
        while True:
            self.stdout.write(f'Fetching limit={limit}, offset={offset}...')
            success, api_data = GovernmentMarketAPI.fetch_market_prices(limit=limit, offset=offset)
            
            if not success:
                self.stdout.write(self.style.ERROR(f'Failed to fetch from API: {api_data}'))
                break
                
            if not api_data:
                self.stdout.write(self.style.NOTICE('No more records found.'))
                break
                
            total_fetched += len(api_data)
            
            formatted_records = []
            for record in api_data:
                fmt = MarketCacheLayer._format_record(record)
                if fmt:
                    formatted_records.append(fmt)
                    
            if formatted_records:
                try:
                    # ordered=False allows skipping duplicates while inserting the rest
                    result = collection.insert_many(formatted_records, ordered=False)
                    inserted = len(result.inserted_ids)
                    total_inserted += inserted
                    self.stdout.write(self.style.SUCCESS(f'Inserted {inserted} new records.'))
                except pymongo.errors.BulkWriteError as bwe:
                    inserted = bwe.details.get('nInserted', 0)
                    total_inserted += inserted
                    self.stdout.write(self.style.SUCCESS(f'Inserted {inserted} new records. Skipped duplicates.'))
            
            # If the API returned fewer records than the limit, we've reached the end
            if len(api_data) < limit:
                break
                
            offset += limit
            # Sleep slightly to avoid rate limiting
            time.sleep(1)

        self.stdout.write(self.style.SUCCESS(f'Completed. Total fetched: {total_fetched}, Total newly inserted: {total_inserted}'))
