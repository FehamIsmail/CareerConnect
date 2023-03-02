from django.contrib.auth import authenticate
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, viewsets, permissions, status
from rest_framework.permissions import DjangoModelPermissions, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, Student, StudentProfile
from .serializers import StudentProfileSerializer, UserSerializer, RegistrationSerializer, EmployerProfileSerializer


# Create your views here.

class StudentProfileView(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer


class RegistrationView(APIView):
    authentication_classes = []  # disable authentication
    permission_classes = [AllowAny]  # allow any user to access the view

    #
    # # permission_classes = [DjangoModelPermissions]
    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = RegistrationSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.create(request.data)
            data['response'] = f"Successfully registered a new {user.role.lower()}"
            data['email'] = user.email
            data['first_name'] = user.first_name
            data['last_name'] = user.last_name
            data['role'] = user.role

        else:
            data = serializer.errors
        return Response(data)


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Get user credentials from the request data
        email = request.data.get('email')
        password = request.data.get('password')

        # Authenticate user
        user = authenticate(email=email, password=password)

        # If authentication fails, return an error response
        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        # If authentication succeeds, generate a JWT token and return it in the response
        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user_id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_serializer = UserSerializer(user)

        if user.role == User.Role.STUDENT:
            profile = user.studentprofile
            profile_serializer = StudentProfileSerializer(profile)
        elif user.role == User.Role.EMPLOYER:
            profile = user.employerprofile
            profile_serializer = EmployerProfileSerializer(profile)
        else:
            return Response({'error': f'User does not have a {user.role} profile'}, status=400)

        return Response({'user': user_serializer.data, 'profile': profile_serializer.data})

    def put(self, request):
        user = request.user

        # if 'email' in request.data:
        #     old_email = get_object_or_404(User, email=user.email)
        #     user.email = request.data['email']
        #     user.save()
        #     print(user.email)
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()

        if user.role == User.Role.STUDENT:
            profile = user.studentprofile
            profile_serializer = StudentProfileSerializer(profile, data=request.data, partial=True)

            if profile_serializer.is_valid():
                profile_serializer.save()

        elif user.role == User.Role.EMPLOYER:
            profile = user.employerprofile
            profile_serializer = EmployerProfileSerializer(profile, data=request.data, partial=True)

            if profile_serializer.is_valid():
                profile_serializer.save()

        else:
            return Response({'error': f'User does not have a {user.role} profile'}, status=400)

        return Response({'user': user_serializer.data, 'profile': profile_serializer.data})
