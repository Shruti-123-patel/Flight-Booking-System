from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .models import LoginActivity
from django.utils.timezone import now

@api_view(['GET'])
def get_data(request):
    data = {"message": "Hello from Django"}
    return Response(data)


@receiver(user_logged_in)
def log_login(sender, request, user, **kwargs):
    # ip_address = request.META.get('REMOTE_ADDR')
    LoginActivity.objects.create(user=user, login_time=now())
