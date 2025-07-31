from django.urls import path
from . import views

urlpatterns = [
    path('', views.AiView.as_view(), name='ai_index'),
    path('api/check/login/', views.current_user, name='current_user'),
    path('api/chats/', views.get_chats, name='get_chats'),
    path('api/chats/<chat_id>/', views.get_chat_messages, name='get_chat_messages'),
    path('api/send_message/', views.send_message, name='send_message'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
    path('api/signup/', views.signup_view, name='signup'),
    path('api/password/', views.change_password, name='password'),
    path('api/edit-profile/', views.edit_profile, name='edit_profile'),
]
