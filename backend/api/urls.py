from django.urls import path, include
from .views.auth_views import register, login, get_me

urlpatterns = [
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/me/', get_me, name='get_me'),
    path('crop-ai/', include('api.crop_ai.urls')),
    path('disease/', include('api.disease_ai.urls')),
    path('weather/', include('api.weather.urls')),
]
