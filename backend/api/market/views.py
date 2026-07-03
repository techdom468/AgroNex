from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .services import MarketService
from .validators import MarketFilterSerializer, MarketHistorySerializer, MarketPredictSerializer

class MarketLiveView(APIView):
    # Using AllowAny for demonstration, can be switched to IsAuthenticated
    permission_classes = [AllowAny]
    
    def get(self, request):
        serializer = MarketFilterSerializer(data=request.query_params)
        if serializer.is_valid():
            service = MarketService()
            data = service.get_live_prices(filters=serializer.validated_data)
            if "error" in data:
                return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MarketHistoryView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        serializer = MarketHistorySerializer(data=request.query_params)
        if serializer.is_valid():
            service = MarketService()
            data = service.get_price_history(
                crop=serializer.validated_data['crop'],
                days=serializer.validated_data.get('days', 30)
            )
            if "error" in data:
                return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MarketPredictView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        serializer = MarketPredictSerializer(data=request.query_params)
        if serializer.is_valid():
            service = MarketService()
            # user_id can be extracted from request.user.id if authenticated
            user_id = None
            if hasattr(request, 'user') and request.user and getattr(request.user, 'is_authenticated', False):
                user_id = request.user.id
            
            data = service.get_prediction(
                crop=serializer.validated_data['crop'],
                user_id=user_id
            )
            if "error" in data:
                return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MarketRecommendationView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        serializer = MarketPredictSerializer(data=request.query_params)
        if serializer.is_valid():
            service = MarketService()
            data = service.get_recommendation(crop=serializer.validated_data['crop'])
            if "error" in data:
                return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
