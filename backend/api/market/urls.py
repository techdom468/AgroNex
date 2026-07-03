from django.urls import path
from .views import MarketLiveView, MarketHistoryView, MarketPredictView, MarketRecommendationView

urlpatterns = [
    path('live/', MarketLiveView.as_view(), name='market-live'),
    path('history/', MarketHistoryView.as_view(), name='market-history'),
    path('predict/', MarketPredictView.as_view(), name='market-predict'),
    path('recommendation/', MarketRecommendationView.as_view(), name='market-recommendation'),
]
