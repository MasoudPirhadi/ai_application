from django.contrib import admin

from ai_module.models import SendMessage, Chat


# Register your models here.


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    pass


@admin.register(SendMessage)
class SendMessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'chat', 'message']
