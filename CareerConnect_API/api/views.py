from django.shortcuts import render
from rest_framework import generics, viewsets, permissions
from .models import User, Student, StudentProfile
from .serializers import StudentProfileSerializer


# Create your views here.

class StudentProfileView(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
