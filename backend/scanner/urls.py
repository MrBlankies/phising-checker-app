from django.urls import path
from .views import test_api, predict_url
from . import views

urlpatterns = [
    path("test/", test_api),
    path("predict/", predict_url),
    path("history/", views.scan_history),
    path("history/delete/", views.delete_history),
    path("register/", views.register_user),
    path("login/", views.login_user),
    path("logout/", views.logout_user),
]