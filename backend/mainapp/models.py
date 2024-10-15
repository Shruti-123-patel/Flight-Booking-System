from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class LoginActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    login_time = models.DateTimeField(default=timezone.now)
    # ip_address = models.GenericIPAddressField()
    
    def __str__(self):
        return f"{self.user.username} logged in at {self.login_time}"
