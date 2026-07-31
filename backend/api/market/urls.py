from django.urls import path
from .views import (
    MarketStatesView,
    MarketDistrictsView,
    MarketCommoditiesView,
    CurrentMarketPriceView,
    HistoricalMarketPriceView,
    PredictMarketPriceView
)

urlpatterns = [
    path('states/', MarketStatesView.as_view(), name='market-states'),
    path('districts/', MarketDistrictsView.as_view(), name='market-districts'),
    path('commodities/', MarketCommoditiesView.as_view(), name='market-commodities'),
    path('current/', CurrentMarketPriceView.as_view(), name='market-current'),
    path('history/', HistoricalMarketPriceView.as_view(), name='market-history'),
    path('predict/', PredictMarketPriceView.as_view(), name='market-predict'),
]
