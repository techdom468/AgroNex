from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from api.utils.decorators import jwt_required

from .services import MarketService
from .prediction import PredictionService

@method_decorator(jwt_required, name='dispatch')
class MarketStatesView(APIView):
    
    def get(self, request):
        success, msg, data = MarketService.get_states()
        if success:
            return Response({'status': 'success', 'data': data}, status=status.HTTP_200_OK)
        return Response({'status': 'error', 'message': msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(jwt_required, name='dispatch')
class MarketDistrictsView(APIView):
    
    def get(self, request):
        state = request.query_params.get('state')
        success, msg, data = MarketService.get_districts(state)
        if success:
            return Response({'status': 'success', 'data': data}, status=status.HTTP_200_OK)
        return Response({'status': 'error', 'message': msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(jwt_required, name='dispatch')
class MarketCommoditiesView(APIView):
    
    def get(self, request):
        state = request.query_params.get('state')
        district = request.query_params.get('district')
        success, msg, data = MarketService.get_commodities(state, district)
        if success:
            return Response({'status': 'success', 'data': data}, status=status.HTTP_200_OK)
        return Response({'status': 'error', 'message': msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(jwt_required, name='dispatch')
class CurrentMarketPriceView(APIView):
    
    def get(self, request):
        state = request.query_params.get('state')
        district = request.query_params.get('district')
        commodity = request.query_params.get('commodity')
        
        success, msg, data = MarketService.get_current_prices(state, district, commodity)
        if success:
            return Response({'status': 'success', 'data': data, 'message': msg}, status=status.HTTP_200_OK)
        return Response({'status': 'error', 'message': msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(jwt_required, name='dispatch')
class HistoricalMarketPriceView(APIView):
    
    def get(self, request):
        state = request.query_params.get('state')
        district = request.query_params.get('district')
        commodity = request.query_params.get('commodity')
        
        success, msg, data = MarketService.get_historical_prices(state, district, commodity)
        if success:
            return Response({'status': 'success', 'data': data}, status=status.HTTP_200_OK)
        return Response({'status': 'error', 'message': msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(jwt_required, name='dispatch')
class PredictMarketPriceView(APIView):
    
    def post(self, request):
        commodity = request.data.get('commodity')
        market = request.data.get('market')
        
        if not commodity or not market:
            return Response(
                {'status': 'error', 'message': 'Commodity and market are required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        success, msg, data = PredictionService.predict_price(commodity, market)
        if success:
            return Response({'status': 'success', 'data': data}, status=status.HTTP_200_OK)
        return Response({'status': 'error', 'message': msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
