import datetime
from .base_adapter import BaseSchemeAdapter

class PMKisanAdapter(BaseSchemeAdapter):
    """
    Adapter for Pradhan Mantri Kisan Samman Nidhi (PM-KISAN).
    Official Portal: https://pmkisan.gov.in/
    """
    def __init__(self):
        fallback = {
            "schemeId": "pm-kisan",
            "schemeName": "Pradhan Mantri Kisan Samman Nidhi",
            "category": "Direct Income Support",
            "description": "A Central Sector scheme with 100% funding from the Government of India to provide income support of Rs. 6,000 per year to all landholding farmer families across the country.",
            "benefits": "Financial benefit of Rs. 6000/- per year per family is payable in three equal installments of Rs. 2000/- each, every four months directly into the bank accounts of the farmers.",
            "eligibility": "All landholding farmers' families who have cultivable landholding in their names. Excluded categories include institutional landholders, former and current holders of constitutional posts, government employees, and taxpayers.",
            "requiredDocuments": [
                "Aadhaar Card (Mandatory)",
                "Land Holding Documents (Khatauni / Patta)",
                "Bank Account Details (Passbook copy)",
                "Mobile Number linked with Aadhaar"
            ],
            "applicationProcess": "Eligible farmers can apply online through the PM-KISAN portal (pmkisan.gov.in) using the 'New Farmer Registration' option, or submit applications through the local Revenue Officer (Patwari) or Common Service Centers (CSCs).",
            "officialWebsite": "https://pmkisan.gov.in/",
            "state": "Central (All States)",
            "ministry": "Ministry of Agriculture and Farmers Welfare",
            "source": "PM-KISAN Portal",
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
        super().__init__(
            scheme_id="pm-kisan",
            official_url="https://pmkisan.gov.in/About.aspx",
            fallback_data=fallback
        )

    def fetch_live_data(self):
        """
        Scrapes PM-KISAN Portal About Page for dynamic content.
        """
        html = self.fetch_url_content()
        if not html:
            return None
            
        soup = self.parse_html(html)
        if not soup:
            return None
            
        # Example scraping logic: attempt to find main content text
        content_div = soup.find('div', id='main-content') or soup.find('div', class_='about-content') or soup.find('form')
        description = ""
        if content_div:
            # Extract first few paragraphs
            paragraphs = content_div.find_all('p')
            text_list = [p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 30]
            if text_list:
                description = " ".join(text_list[:3])
                
        # Return standardized structure
        return {
            "description": description if description else None,
            "lastUpdated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
        }
