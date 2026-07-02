import datetime
from .base_adapter import BaseSchemeAdapter

class PMKusumAdapter(BaseSchemeAdapter):
    """
    Adapter for PM-KUSUM (Solar Pumps & Renewable Energy).
    Official Portal: https://pmkusum.mnre.gov.in/
    """
    def __init__(self):
        fallback = {
            "schemeId": "pm-kusum",
            "schemeName": "PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
            "category": "Solar Energy & Irrigation",
            "description": "Scheme to provide grid security to farmers and ensure energy independence by installing solar agricultural pumps and solarizing existing grid-connected agricultural pumps.",
            "benefits": "Supports setting up decentralized solar power plants, installing standalone solar pumps (up to 7.5 HP) with 60% subsidy (30% Central + 30% State govt), and solarizing existing grid pumps. Farmers can also sell excess solar energy to DISCOMs.",
            "eligibility": "Individual farmers, groups of farmers, water user associations, cooperatives, panchayats, and Farmer Producer Organizations (FPOs).",
            "requiredDocuments": [
                "Aadhaar Card",
                "Land Registry / Ownership documents or Lease agreements (for barren lands)",
                "Bank Account details",
                "Mobile Number",
                "Passport size photograph"
            ],
            "applicationProcess": "Applications are accepted through the respective state's implementing agencies (State Renewable Energy Portals) or official state solar pump websites connected to the MNRE portal.",
            "officialWebsite": "https://pmkusum.mnre.gov.in/",
            "state": "Central (All States)",
            "ministry": "Ministry of New and Renewable Energy",
            "source": "MNRE Portal",
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
        super().__init__(
            scheme_id="pm-kusum",
            official_url="https://pmkusum.mnre.gov.in/",
            fallback_data=fallback
        )

    def fetch_live_data(self):
        """
        Parses MNRE Kusum portal home page.
        """
        html = self.fetch_url_content()
        if not html:
            return None
            
        soup = self.parse_html(html)
        if not soup:
            return None
            
        # Parse titles or links related to Component A/B/C guidelines
        guidelines = soup.find_all('a', href=True)
        links = []
        for g in guidelines:
            if 'guideline' in g.get_text(strip=True).lower():
                links.append(g.get_text(strip=True))
                
        return {
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
