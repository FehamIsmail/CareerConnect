from django.shortcuts import render
from rest_framework import generics, viewsets, permissions, status
from rest_framework.permissions import DjangoModelPermissions, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Student, StudentProfile
from .serializers import StudentProfileSerializer, UserSerializer, RegistrationSerializer


# Create your views here.

class StudentProfileView(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer

# class createUser(APIView):
#     def post(self,request):
#         serializer=UserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegistrationView(APIView):
    authentication_classes = []  # disable authentication
    permission_classes = [AllowAny]  # allow any user to access the view
    #
    # # permission_classes = [DjangoModelPermissions]
    queryset = User.objects.all()
    def post(self,request):
        print(request.data)
        serializer=RegistrationSerializer(data=request.data)
        data={}
        if serializer.is_valid():
            user=serializer.save()
            data['response']="Successfully registered a new user"
            data['email'] = user.email
            data['first_name']=user.first_name
            data['last_name'] = user.last_name
            data['role'] = user.role

        else:
            data=serializer.errors
        return Response(data)