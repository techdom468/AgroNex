import datetime
from .base_adapter import BaseSchemeAdapter


class SoilHealthAdapter(BaseSchemeAdapter):
    """
    Adapter for Soil Health Card Scheme.
    Official Portal: https://soilhealth.dac.gov.in/
    """
    def __init__(self):
        fallback = {
            "schemeId": "soil-health-card",
            "schemeName": "Soil Health Card Scheme",
            "category": "Soil Testing & Health",
            "description": "A scheme to issue Soil Health Cards to farmers every two years, carrying crop-wise recommendations of nutrients and fertilizers required for individual farms to help farmers improve productivity through judicious use of inputs.",
            "benefits": "Free soil testing and issuance of Soil Health Cards with nutrient status and fertilizer dose recommendations. Promotes balanced and integrated use of chemical fertilizers along with organic manures, leading to improved soil health and cost savings.",
            "eligibility": "All farmers across India with cultivable agricultural land are eligible to receive a Soil Health Card free of cost.",
            "requiredDocuments": [
                "Aadhaar Card",
                "Land Details (Survey Number / Khasra Number)",
                "Mobile Number"
            ],
            "applicationProcess": "Farmers can request a Soil Health Card through the official portal (soilhealth.dac.gov.in), or by contacting the nearest Agriculture Department office, Krishi Vigyan Kendra (KVK), or Common Service Center (CSC).",
            "officialWebsite": "https://soilhealth.dac.gov.in/",
            "state": "Central (All States)",
            "ministry": "Ministry of Agriculture and Farmers Welfare",
            "source": "Soil Health Card Portal",
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
        super().__init__(
            scheme_id="soil-health-card",
            official_url="https://soilhealth.dac.gov.in/",
            fallback_data=fallback
        )

    def fetch_live_data(self):
        html = self.fetch_url_content()
        if not html:
            return None

        soup = self.parse_html(html)
        if not soup:
            return None

        # Attempt to extract summary statistics or announcements
        stats_div = soup.find('div', class_='counter') or soup.find('div', id='stats')
        if stats_div:
            text = stats_div.get_text(strip=True)

        return {
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
