import datetime
from .base_adapter import BaseSchemeAdapter


class ENAMAdapter(BaseSchemeAdapter):
    """
    Adapter for National Agriculture Market (e-NAM).
    Official Portal: https://enam.gov.in/
    """
    def __init__(self):
        fallback = {
            "schemeId": "e-nam",
            "schemeName": "National Agriculture Market (e-NAM)",
            "category": "Market Access & Trade",
            "description": "An online trading platform networking existing APMC (Agricultural Produce Market Committee) mandis to create a unified national market for agricultural commodities. Provides transparent price discovery, online bidding, and streamlined trade processes.",
            "benefits": "Provides farmers online access to more buyers across state borders, transparent real-time commodity prices, elimination of middlemen resulting in better price realization, online payment directly into bank accounts, and reduced post-harvest losses.",
            "eligibility": "All farmers, traders, commission agents, and FPOs (Farmer Producer Organizations) in states that have reformed their APMC Acts to allow e-trading.",
            "requiredDocuments": [
                "Aadhaar Card",
                "Bank Account Details",
                "Mobile Number",
                "APMC License (for traders only)",
                "Land Records (optional, for farmer registration)"
            ],
            "applicationProcess": "Farmers can register on the e-NAM portal (enam.gov.in) or through the e-NAM mobile app by visiting the nearest integrated APMC mandi. Trader and commission agent registration is handled through the state APMC authority.",
            "officialWebsite": "https://enam.gov.in/",
            "state": "Central (All States with reformed APMC Acts)",
            "ministry": "Ministry of Agriculture and Farmers Welfare",
            "source": "e-NAM Portal",
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
        super().__init__(
            scheme_id="e-nam",
            official_url="https://enam.gov.in/web/about-enam/about-enam",
            fallback_data=fallback
        )

    def fetch_live_data(self):
        # The official enam.gov.in portal frequently times out or blocks automated requests.
        # Returning None immediately to use verified fallback data and prevent startup delays.
        return None
