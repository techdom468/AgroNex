from datetime import datetime, UTC
from api.database.mongodb import get_db
from .scraper import MarketScraper
from .predict import predict_market_price


class MarketService:
    def __init__(self):
        self.db = get_db()
        self.prices_collection      = self.db['market_prices']      if self.db is not None else None
        self.predictions_collection = self.db['market_predictions'] if self.db is not None else None

    def get_live_prices(self, filters=None):
        # Run scraper to ensure fresh data in MongoDB
        scraper = MarketScraper()
        scraper.run_scraper()

        if self.prices_collection is None:
            return []

        query = {}
        if filters:
            if 'crop' in filters:
                query['crop'] = {'$regex': filters['crop'], '$options': 'i'}
            if 'state' in filters:
                query['state'] = {'$regex': filters['state'], '$options': 'i'}
            if 'district' in filters:
                query['district'] = {'$regex': filters['district'], '$options': 'i'}
            if 'market' in filters:
                query['market'] = {'$regex': filters['market'], '$options': 'i'}

        cursor  = self.prices_collection.find(query).sort("scrapedDate", -1).limit(50)
        results = []
        for doc in cursor:
            doc['_id'] = str(doc['_id'])
            if isinstance(doc.get('createdAt'), datetime):
                doc['createdAt'] = doc['createdAt'].isoformat()
            results.append(doc)

        return results

    def get_price_history(self, crop, days=30):
        if self.prices_collection is None:
            return {"error": "Database not connected"}

        query  = {'crop': {'$regex': crop, '$options': 'i'}}
        cursor = self.prices_collection.find(query).sort("scrapedDate", -1).limit(days)

        results = []
        for doc in cursor:
            doc['_id'] = str(doc['_id'])
            results.append(doc)
        return results

    def get_prediction(self, crop, user_id=None):
        try:
            prediction_data = predict_market_price(crop_name=crop, days=7)

            if self.predictions_collection is not None:
                doc = {
                    "userId":            user_id,
                    "crop":              crop,
                    "todayPrice":        prediction_data['today_price'],
                    "predictedTomorrow": prediction_data['predictions'][0]['predicted_price'],
                    "predictionDate":    datetime.now(UTC).strftime('%Y-%m-%d'),
                    "confidence":        prediction_data['confidence'],
                    "trend":             prediction_data['trend'],
                    "recommendation":    prediction_data['recommendation'],
                    "createdAt":         datetime.now(UTC),
                }
                self.predictions_collection.insert_one(doc)

            return prediction_data
        except Exception as e:
            return {"error": str(e)}

    def get_recommendation(self, crop):
        try:
            prediction_data = predict_market_price(crop_name=crop, days=2)
            return {
                "crop":                     crop,
                "recommendation":           prediction_data['recommendation'],
                "reason":                   prediction_data['reason'],
                "confidence":               prediction_data['confidence'],
                "expectedProfitDifference": prediction_data['expectedProfitDifference'],
                "trend":                    prediction_data['trend'],
            }
        except Exception as e:
            return {"error": str(e)}
