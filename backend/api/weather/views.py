from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .validators import validate_coordinates
from .services import get_weather_and_recommendations, fetch_user_weather_history

@api_view(['GET'])
@permission_classes([AllowAny])
def get_current_weather(request):
    """
    Get current weather and recommendations for a given lat/lon.
    Pass ?refresh=true to bypass cache and fetch fresh data.
    """
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    location = request.GET.get('location', 'Unknown')
    force_refresh = request.GET.get('refresh', 'false').lower() == 'true'

    is_valid, result = validate_coordinates(lat, lon)
    if not is_valid:
        return Response({"error": result}, status=status.HTTP_400_BAD_REQUEST)

    lat, lon = result
    user_id = request.user.id if request.user and request.user.is_authenticated else "anonymous"

    # Clear cache if force refresh requested
    if force_refresh:
        cache_key = f"weather_{lat}_{lon}"
        cache.delete(cache_key)

    try:
        data = get_weather_and_recommendations(user_id, lat, lon, location)
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_hourly_forecast(request):
    # This is redundant since get_current_weather returns the full object
    return get_current_weather(request._request)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_daily_forecast(request):
    # This is redundant since get_current_weather returns the full object
    return get_current_weather(request._request)

@api_view(['GET'])
@permission_classes([AllowAny]) # Change to IsAuthenticated if strict auth needed
def get_weather_history(request):
    user_id = request.user.id if request.user and request.user.is_authenticated else "anonymous"
    history = fetch_user_weather_history(user_id)
    return Response({"history": history}, status=status.HTTP_200_OK)
