from django.urls import path
from .views import get_current_weather, get_hourly_forecast, get_daily_forecast, get_weather_history

urlpatterns = [
    path('current/', get_current_weather, name='get_current_weather'),
    path('hourly/', get_hourly_forecast, name='get_hourly_forecast'),
    path('forecast/', get_daily_forecast, name='get_daily_forecast'),
    path('history/', get_weather_history, name='get_weather_history'),
]
