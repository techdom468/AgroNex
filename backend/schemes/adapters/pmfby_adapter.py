import datetime
from .base_adapter import BaseSchemeAdapter

class PMFBYAdapter(BaseSchemeAdapter):
    """
    Adapter for Pradhan Mantri Fasal Bima Yojana (PMFBY).
    Official Portal: https://pmfby.gov.in/
    """
    def __init__(self):
        fallback = {
            "schemeId": "pmfby",
            "schemeName": "Pradhan Mantri Fasal Bima Yojana",
            "category": "Crop Insurance",
            "description": "A comprehensive crop insurance scheme designed to provide financial support to farmers suffering crop loss or damage due to natural calamities, pests, or diseases.",
            "benefits": "Covers all food, oilseed crops, and annual commercial/horticultural crops. Farmers pay uniform low premiums: 2.0% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops, with the balance subsidized by the government.",
            "eligibility": "All farmers including sharecroppers and tenant farmers growing the notified crops in the notified areas are eligible.",
            "requiredDocuments": [
                "Aadhaar Card",
                "Land Possession Documents (Record of Right / Land Revenue Receipt)",
                "Sowing Certificate (issued by local agricultural officer or Patwari)",
                "Bank Account Details (Passbook copy for direct claim settlement)"
            ],
            "applicationProcess": "Farmers can register online at the official PMFBY portal (pmfby.gov.in), apply through their local banks, or visit registered insurance company agents and Common Service Centers (CSCs).",
            "officialWebsite": "https://pmfby.gov.in/",
            "state": "Central (All States)",
            "ministry": "Ministry of Agriculture and Farmers Welfare",
            "source": "PMFBY Portal",
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
        super().__init__(
            scheme_id="pmfby",
            official_url="https://pmfby.gov.in/pdf/Revised_Operational_Guidelines.pdf",  # standard Guidelines URL
            fallback_data=fallback
        )

    def fetch_live_data(self):
        """
        Since Guideline URLs are PDF, we fetch the home page or help center for text extraction.
        """
        html = self.fetch_url_content("https://pmfby.gov.in/")
        if not html:
            return None
            
        soup = self.parse_html(html)
        if not soup:
            return None
            
        # Extract title or basic announcements
        announcements = soup.find('div', class_='announcements') or soup.find('marquee')
        desc_updates = ""
        if announcements:
            desc_updates = announcements.get_text(strip=True)
            
        return {
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
