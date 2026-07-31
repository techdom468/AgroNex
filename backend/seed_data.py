import os
import django
import sys
import datetime
import random

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.market.models import get_market_price_collection

collection = get_market_price_collection()
if collection is None:
    print("Database connection failed")
    sys.exit(1)

states_data = {
    'Gujarat': ['Ahmedabad', 'Surat', 'Rajkot'],
    'Maharashtra': ['Pune', 'Nashik', 'Nagpur'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar']
}

commodities = ['Wheat', 'Cotton', 'Rice']

print("Seeding dummy market prices data for demonstration...")

# Generate 45 days of historical data
base_date = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=45)

records = []
for state, districts in states_data.items():
    for district in districts:
        for commodity in commodities:
            
            # Base price
            base_price = 0
            if commodity == 'Wheat': base_price = 2200
            elif commodity == 'Cotton': base_price = 7000
            else: base_price = 3500

            for i in range(45):
                current_date = base_date + datetime.timedelta(days=i)
                
                # Add some trend and seasonality
                trend = i * 2.5
                noise = random.uniform(-100, 100)
                
                modal_price = base_price + trend + noise
                min_price = modal_price - random.uniform(50, 150)
                max_price = modal_price + random.uniform(50, 200)

                record = {
                    'state': state,
                    'district': district,
                    'market': f"{district} APMC",
                    'commodity': commodity,
                    'variety': 'Other',
                    'grade': 'FAQ',
                    'arrival_date': current_date.strftime('%Y-%m-%d'),
                    'min_price': round(min_price, 2),
                    'max_price': round(max_price, 2),
                    'modal_price': round(modal_price, 2),
                    'created_at': datetime.datetime.now(datetime.timezone.utc)
                }
                records.append(record)

# Insert in chunks
if records:
    try:
        collection.insert_many(records, ordered=False)
        print(f"Successfully seeded {len(records)} records!")
    except Exception as e:
        print("Error inserting:", e)
else:
    print("No records generated.")
