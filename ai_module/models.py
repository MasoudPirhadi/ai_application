from django.db import models
import uuid

from account_module.models import Users


# Create your models here.

class Chat(models.Model):
    name = models.CharField(max_length=100, verbose_name='نام')
    user = models.ForeignKey(Users, on_delete=models.CASCADE, verbose_name='کاربر')
    chat_id = models.UUIDField(verbose_name='شناسه چت', default=uuid.uuid4, editable=False)

    def __str__(self):
        return str(self.name)


class SendMessage(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('ai', 'AI'),
    ]
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, verbose_name='چت')
    sender = models.CharField(max_length=4, choices=SENDER_CHOICES, verbose_name="فرستنده")
    message = models.TextField(verbose_name='پیام')
    date = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ارسال')

    def __str__(self):
        return str(self.message)

