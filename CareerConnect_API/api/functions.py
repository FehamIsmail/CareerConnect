from rest_framework.response import Response
from django.core.mail import send_mail

from .serializers import StudentNotificationsSerializer
import os
from dotenv import load_dotenv
load_dotenv()


def make_student_notif(student_profile, message, color):
    notif_serializer = StudentNotificationsSerializer(
        data={'message': message, 'COLOR': color})

    if notif_serializer.is_valid():
        notif_serializer.save(user_profile=student_profile)
    else:
        return Response(notif_serializer.errors)


def send_student_email(mail, subject, message):
    send_mail(subject, message, os.environ.get('EMAIL_HOST_USER'), [mail], fail_silently=False)
