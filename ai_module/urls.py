from django.urls import path
from . import views

urlpatterns = [
    path('', views.AiView.as_view(), name='ai_index'),
]