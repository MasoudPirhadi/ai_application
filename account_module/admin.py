from django.contrib import admin

from account_module.models import Users


# Register your models here.

@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    pass
