from django.urls import path,include
from .views import get_data


urlpatterns = [
    path('api/data/', get_data ),
]