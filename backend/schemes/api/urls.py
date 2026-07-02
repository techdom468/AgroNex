from django.urls import path
from . import views

urlpatterns = [
    # Public scheme endpoints
    path('schemes/', views.list_schemes, name='list_schemes'),
    path('schemes/recommended/', views.recommended_schemes, name='recommended_schemes'),
    path('schemes/<str:scheme_id>/', views.scheme_detail, name='scheme_detail'),

    # Admin endpoints
    path('admin/refresh-schemes/', views.refresh_schemes, name='refresh_schemes'),
    path('admin/system-status/', views.system_status, name='system_status'),
]
