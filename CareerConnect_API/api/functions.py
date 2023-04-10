from rest_framework.response import Response

from .serializers import StudentNotificationsSerializer


def make_student_notif(student_profile, message, color):
    notif_serializer = StudentNotificationsSerializer(
        data={'message': message, 'COLOR': color})

    if notif_serializer.is_valid():
        notif_serializer.save(user_profile=student_profile)
    else:
        return Response(notif_serializer.errors)
