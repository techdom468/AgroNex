import os
import requests
from dotenv import load_dotenv
from .constants import GOV_API_BASE_URL, RESOURCE_ID, DEFAULT_FORMAT

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '.env'))

GOV_API_KEY = os.getenv('GOV_API_KEY')
DATA_GOV_API_KEY = os.getenv('DATA_GOV_API_KEY')

class GovernmentMarketAPI:
    """
    Service layer for fetching live market prices from Government of India Open Data API.
    """
    @classmethod
    def fetch_market_prices(cls, state=None, district=None, commodity=None, arrival_date=None, limit=1000, offset=0):
        # Allow fallback to GOV_API_KEY if needed, but prefer DATA_GOV_API_KEY
        api_key = os.getenv('DATA_GOV_API_KEY') or os.getenv('GOV_API_KEY')
        if not api_key:
            raise ValueError("DATA_GOV_API_KEY is missing in environment variables.")

        url = f"{GOV_API_BASE_URL}/{RESOURCE_ID}"
        
        params = {
            'api-key': api_key,
            'format': DEFAULT_FORMAT,
            'limit': limit,
            'offset': offset
        }

        # Add optional filters
        if state:
            params['filters[State]'] = state
        if district:
            params['filters[District]'] = district
        if commodity:
            params['filters[Commodity]'] = commodity
        if arrival_date:
            params['filters[Arrival_Date]'] = arrival_date

        try:
            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            return True, data.get('records', [])
        except requests.exceptions.RequestException as e:
            # Catch all network/http errors and return safely
            return False, str(e)
        except ValueError as e:
            # JSON parsing error
            return False, "Invalid response from Government API."
