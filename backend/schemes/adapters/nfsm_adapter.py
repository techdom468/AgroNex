import datetime
from .base_adapter import BaseSchemeAdapter


class NFSMAdapter(BaseSchemeAdapter):
    """
    Adapter for National Food Security Mission (NFSM).
    Official Portal: https://www.nfsm.gov.in/
    """
    def __init__(self):
        fallback = {
            "schemeId": "nfsm",
            "schemeName": "National Food Security Mission",
            "category": "Food Security & Production",
            "description": "A centrally-sponsored scheme to increase the production of rice, wheat, pulses, coarse cereals, and commercial crops through area expansion and productivity enhancement in a sustainable manner, ensuring food security of the country.",
            "benefits": "Subsidies on certified high-yielding variety seeds, farm machinery, plant protection chemicals, micro/macro nutrients, soil ameliorants, water-saving devices (sprinklers, drip), and cropping system-based training programs.",
            "eligibility": "All farmers in identified districts under the mission. Priority is given to small and marginal farmers. SC/ST farmers receive additional benefits under special provisions.",
            "requiredDocuments": [
                "Aadhaar Card",
                "Land Records (Khasra/Khatauni)",
                "Bank Account Details",
                "Caste Certificate (for SC/ST benefits)",
                "Mobile Number"
            ],
            "applicationProcess": "Farmers can apply through the District Agriculture Office or the State Agriculture Department. Some states also accept online applications through their agriculture portals linked to the NFSM dashboard.",
            "officialWebsite": "https://www.nfsm.gov.in/",
            "state": "Central (All States)",
            "ministry": "Ministry of Agriculture and Farmers Welfare",
            "source": "NFSM Portal",
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
        super().__init__(
            scheme_id="nfsm",
            official_url="https://www.nfsm.gov.in/",
            fallback_data=fallback
        )

    def fetch_live_data(self):
        html = self.fetch_url_content()
        if not html:
            return None

        soup = self.parse_html(html)
        if not soup:
            return None

        # Extract main content or announcements
        content = soup.find('div', id='ContentPlaceHolder1_divmain') or soup.find('div', class_='content-area')
        description = ""
        if content:
            paragraphs = content.find_all('p')
            text_list = [p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 30]
            if text_list:
                description = " ".join(text_list[:3])

        return {
            "description": description if description else None,
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
