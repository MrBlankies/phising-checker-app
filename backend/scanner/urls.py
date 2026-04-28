from django.urls import path
from .views import test_api, predict_url

urlpatterns = [
    path("test/", test_api),
    path("predict/", predict_url),
]