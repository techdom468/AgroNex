import requests
from bs4 import BeautifulSoup
from datetime import datetime, UTC
from api.database.mongodb import get_db


class MarketScraper:
    """
    Modular scraper for AGMARKNET market price data.
    Designed to be extended with additional state APMC portals in future.
    """

    def __init__(self):
        self.base_url = "https://agmarknet.gov.in/SearchCmmMkt.aspx"
        self.db = get_db()
        self.collection = self.db['market_prices'] if self.db is not None else None

    def fetch_page_content(self, url=None):
        url = url or self.base_url
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            # Production: uncomment below to do real scraping
            # response = requests.get(url, headers=headers, timeout=15)
            # response.raise_for_status()
            # return response.content

            # Simulated AGMARKNET HTML response (demo mode)
            return """
            <html><body>
                <table id="cphBody_GridPriceData">
                    <tr>
                        <th>Crop Name</th><th>Market Name</th><th>District</th>
                        <th>State</th><th>Arrival Quantity (qtl)</th>
                        <th>Minimum Price (Rs/qtl)</th><th>Maximum Price (Rs/qtl)</th>
                        <th>Modal Price (Rs/qtl)</th><th>Date</th>
                    </tr>
                    <tr>
                        <td>Wheat</td><td>Ahmedabad APMC</td><td>Ahmedabad</td>
                        <td>Gujarat</td><td>340</td><td>2400</td><td>2620</td>
                        <td>2510</td><td>2026-07-01</td>
                    </tr>
                    <tr>
                        <td>Wheat</td><td>Amreli APMC</td><td>Amreli</td>
                        <td>Gujarat</td><td>220</td><td>2350</td><td>2575</td>
                        <td>2500</td><td>2026-07-01</td>
                    </tr>
                    <tr>
                        <td>Wheat</td><td>Rajkot APMC</td><td>Rajkot</td>
                        <td>Gujarat</td><td>180</td><td>2300</td><td>2550</td>
                        <td>2450</td><td>2026-07-01</td>
                    </tr>
                    <tr>
                        <td>Wheat</td><td>Surat APMC</td><td>Surat</td>
                        <td>Gujarat</td><td>150</td><td>2380</td><td>2600</td>
                        <td>2480</td><td>2026-07-01</td>
                    </tr>
                    <tr>
                        <td>Cotton</td><td>Rajkot APMC</td><td>Rajkot</td>
                        <td>Gujarat</td><td>500</td><td>6500</td><td>7200</td>
                        <td>7000</td><td>2026-07-01</td>
                    </tr>
                    <tr>
                        <td>Cotton</td><td>Gondal APMC</td><td>Rajkot</td>
                        <td>Gujarat</td><td>320</td><td>6400</td><td>7100</td>
                        <td>6800</td><td>2026-07-01</td>
                    </tr>
                    <tr>
                        <td>Rice</td><td>Anand APMC</td><td>Anand</td>
                        <td>Gujarat</td><td>410</td><td>1800</td><td>2200</td>
                        <td>2050</td><td>2026-07-01</td>
                    </tr>
                    <tr>
                        <td>Maize</td><td>Vadodara APMC</td><td>Vadodara</td>
                        <td>Gujarat</td><td>280</td><td>1400</td><td>1750</td>
                        <td>1600</td><td>2026-07-01</td>
                    </tr>
                </table>
            </body></html>
            """
        except Exception as e:
            print(f"Failed to fetch market data: {str(e)}")
            return None

    def parse_market_data(self, html_content):
        if not html_content:
            return []

        soup  = BeautifulSoup(html_content, 'html.parser')
        data  = []
        table = soup.find('table', {'id': 'cphBody_GridPriceData'})

        if not table:
            return data

        rows = table.find_all('tr')[1:]  # skip header
        for row in rows:
            cols = row.find_all('td')
            if len(cols) >= 9:
                try:
                    record = {
                        "crop":            cols[0].text.strip(),
                        "market":          cols[1].text.strip(),
                        "district":        cols[2].text.strip(),
                        "state":           cols[3].text.strip(),
                        "arrivalQuantity": float(cols[4].text.strip()) if cols[4].text.strip() else 0.0,
                        "minimumPrice":    float(cols[5].text.strip()),
                        "maximumPrice":    float(cols[6].text.strip()),
                        "modalPrice":      float(cols[7].text.strip()),
                        "scrapedDate":     cols[8].text.strip(),
                        "createdAt":       datetime.now(UTC),
                    }
                    data.append(record)
                except ValueError:
                    continue

        return data

    def save_to_db(self, market_data):
        if self.collection is None or not market_data:
            return {"status": "skipped", "message": "No data or db connection"}

        inserted = updated = 0
        for record in market_data:
            query = {
                "crop":        record["crop"],
                "market":      record["market"],
                "scrapedDate": record["scrapedDate"],
            }
            result = self.collection.update_one(query, {"$set": record}, upsert=True)
            if result.upserted_id:
                inserted += 1
            elif result.modified_count > 0:
                updated += 1

        return {
            "status": "success",
            "inserted": inserted,
            "updated": updated,
            "total_processed": len(market_data),
        }

    def run_scraper(self):
        html   = self.fetch_page_content()
        data   = self.parse_market_data(html)
        result = self.save_to_db(data)
        return result


if __name__ == "__main__":
    scraper = MarketScraper()
    print(scraper.run_scraper())
