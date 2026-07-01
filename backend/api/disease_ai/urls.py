from django.urls import path
from .views import predict_disease_view, get_prediction_history

urlpatterns = [
    path('predict/', predict_disease_view, name='disease_predict'),
    path('history/', get_prediction_history, name='disease_history'),
]
