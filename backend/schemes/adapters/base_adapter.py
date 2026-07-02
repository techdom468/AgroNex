import requests
from bs4 import BeautifulSoup
import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

class BaseSchemeAdapter(ABC):
    """
    Abstract base adapter for government schemes.
    Provides robust HTTP fetching, parsing, and fallback mechanisms.
    """
    
    DEFAULT_HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive"
    }

    def __init__(self, scheme_id, official_url, fallback_data):
        self.scheme_id = scheme_id
        self.official_url = official_url
        self.fallback_data = fallback_data

    def fetch_url_content(self, url=None, timeout=5, retries=2):
        """
        Fetches the URL content with simple retries.
        """
        target_url = url or self.official_url
        for attempt in range(retries):
            try:
                response = requests.get(target_url, headers=self.DEFAULT_HEADERS, timeout=timeout)
                if response.status_code == 200:
                    return response.text
                else:
                    logger.warning(f"Failed to fetch {target_url}. Attempt {attempt + 1}/{retries}. Status code: {response.status_code}")
            except requests.RequestException as e:
                logger.warning(f"Error fetching {target_url}. Attempt {attempt + 1}/{retries}. Exception: {e}")
        return None

    def parse_html(self, html_content):
        """
        Parses HTML content using BeautifulSoup.
        """
        if not html_content:
            return None
        return BeautifulSoup(html_content, 'html.parser')

    @abstractmethod
    def fetch_live_data(self):
        """
        Perform live scraping or API fetch and return a normalized dict.
        Must return standard scheme dictionary or None if it fails.
        """
        pass

    def get_normalized_scheme(self):
        """
        Primary execution method. Attempts live fetch first. 
        Falls back to local verified official data on network/parsing failure.
        """
        try:
            live_data = self.fetch_live_data()
            if live_data:
                # Merge parsed dynamic details with complete static metadata
                merged_data = self.fallback_data.copy()
                for key, val in live_data.items():
                    if val:  # only override if live data has value
                        merged_data[key] = val
                return merged_data
        except Exception as e:
            logger.error(f"Live fetch failed for scheme {self.scheme_id}: {e}")
            
        # Guarantee we never return dummy/empty data: use verified backup schema
        return self.fallback_data.copy()
