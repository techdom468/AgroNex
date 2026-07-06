from django.urls import path, include
from .views.auth_views import (
    register, login, get_me, update_profile,
    get_profile, profile_update, upload_profile_image,
    forgot_password_view, reset_password_view
)
from .views.contact_views import contact_submit
from .views.dashboard_views import get_dashboard_summary, get_recent_activity
from .views.chat_views import chat_with_ai, get_chat_history, delete_chat_history

urlpatterns = [
    # Auth
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/me/', get_me, name='get_me'),
    path('auth/profile/', update_profile, name='update_profile'),
    path('auth/forgot-password/', forgot_password_view, name='forgot_password'),
    path('auth/reset-password/', reset_password_view, name='reset_password'),

    # Profile (new endpoints)
    path('profile/', get_profile, name='get_profile'),
    path('profile/update/', profile_update, name='profile_update'),
    path('profile/upload-image/', upload_profile_image, name='upload_profile_image'),

    # Chat API
    path('chat/', chat_with_ai, name='chat_with_ai'),
    path('chat/history/', get_chat_history, name='get_chat_history'),
    path('chat/history/delete/', delete_chat_history, name='delete_chat_history'),

    # Other features
    path('crop-ai/', include('api.crop_ai.urls')),
    path('disease/', include('api.disease_ai.urls')),
    path('weather/', include('api.weather.urls')),
    path('market/', include('api.market.urls')),
    path('', include('schemes.api.urls')),
    path('contact/', contact_submit, name='contact_submit'),
    path('dashboard/summary/', get_dashboard_summary, name='dashboard_summary'),
    path('dashboard/activity/recent/', get_recent_activity, name='recent_activity'),
]
