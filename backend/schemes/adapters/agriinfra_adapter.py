import datetime
from .base_adapter import BaseSchemeAdapter


class AgriInfraAdapter(BaseSchemeAdapter):
    """
    Adapter for Agriculture Infrastructure Fund (AIF).
    Official Portal: https://agriinfra.dac.gov.in/
    """
    def __init__(self):
        fallback = {
            "schemeId": "agri-infra-fund",
            "schemeName": "Agriculture Infrastructure Fund",
            "category": "Infrastructure & Logistics",
            "description": "A medium to long-term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets through interest subvention and financial support.",
            "benefits": "Provides loans at concessional interest rates with 3% interest subvention on loans up to Rs. 2 crore for post-harvest management projects and community farming assets. Credit guarantee coverage under CGTMSE for loans up to Rs. 2 crore.",
            "eligibility": "Primary Agricultural Cooperative Societies (PACS), Farmer Producer Organizations (FPOs), Agriculture entrepreneurs, Startups, state agencies, and central/state government entities or public-private partnership projects.",
            "requiredDocuments": [
                "Aadhaar Card",
                "PAN Card",
                "Business Registration / FPO Certificate",
                "Bank Account Details",
                "Detailed Project Report (DPR)",
                "Land documents for proposed infrastructure"
            ],
            "applicationProcess": "Applicants can apply online through the Agriculture Infrastructure Fund portal (agriinfra.dac.gov.in). The application is processed by the lending institution (bank/NABARD) and sanctioned based on project viability.",
            "officialWebsite": "https://agriinfra.dac.gov.in/",
            "state": "Central (All States)",
            "ministry": "Ministry of Agriculture and Farmers Welfare",
            "source": "AIF Portal",
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
        super().__init__(
            scheme_id="agri-infra-fund",
            official_url="https://agriinfra.dac.gov.in/",
            fallback_data=fallback
        )

    def fetch_live_data(self):
        html = self.fetch_url_content()
        if not html:
            return None

        soup = self.parse_html(html)
        if not soup:
            return None

        # Try to extract dashboard stats like total projects, amount sanctioned, etc.
        stats_section = soup.find('div', class_='dashboard') or soup.find('section', id='stats')
        if stats_section:
            text = stats_section.get_text(strip=True)

        return {
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
