from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class Users(AbstractUser):
    username = models.CharField(verbose_name="نام کاربری", max_length=50, unique=True)
    profile = models.ImageField(verbose_name='پروفایل', upload_to='profile', blank=True, null=True)
    email = models.EmailField(verbose_name="ایمیل", max_length=50, unique=True)

    def __str__(self):
        return str(self.email)

