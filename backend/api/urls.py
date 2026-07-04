from django.urls import path, include
from .views.auth_views import register, login, get_me, update_profile
from .views.contact_views import contact_submit

urlpatterns = [
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/me/', get_me, name='get_me'),
    path('auth/profile/', update_profile, name='update_profile'),
    path('crop-ai/', include('api.crop_ai.urls')),
    path('disease/', include('api.disease_ai.urls')),
    path('weather/', include('api.weather.urls')),
    path('market/', include('api.market.urls')),
    path('', include('schemes.api.urls')),
    path('contact/', contact_submit, name='contact_submit'),
]
