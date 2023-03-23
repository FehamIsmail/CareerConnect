from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.exceptions import server_error
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListCreateAPIView, \
    RetrieveUpdateDestroyAPIView, UpdateAPIView, get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, StudentProfile, Job, Application
from .permissions import IsOwnerOrReadOnly, CanCreateOrRemoveApplication
from .serializers import StudentProfileSerializer, EmployerProfileSerializer, \
    UserSerializer, JobSerializer, ApplicationSerializer


# Create your views here.

class StudentProfileView(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer


# class JobListView(viewsets.ModelViewSet):
#     authentication_classes = []
#     permission_classes = [AllowAny]
#     queryset = Job.objects.all()
#     serializer_class = JobSerializer


class RegistrationView(CreateAPIView):
    authentication_classes = []  # disable authentication
    permission_classes = [AllowAny]  # allow any user to access the view
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_user = serializer.save()
            if new_user.role == User.Role.STUDENT:
                new_user.student_profile.institution = request.data['institution']
                new_user.student_profile.save()
            elif new_user.role == User.Role.EMPLOYER:
                new_user.employer_profile.company = request.data['company_name']
                new_user.employer_profile.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            error = serializer.errors
            return Response(error, status=status.HTTP_400_BAD_REQUEST)


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
            'role': user.role
        })


# class LogoutView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]
#
#     def get(self, request, format=None):
#         # simply delete the token to force a login
#         request.user.auth_token.delete()
#         return Response(status=status.HTTP_200_OK)


class UserProfileView(RetrieveUpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        user = request.user
        user_serializer = UserSerializer(user)

        if user.role == User.Role.STUDENT:
            profile = user.student_profile
            profile_serializer = StudentProfileSerializer(profile)
        elif user.role == User.Role.EMPLOYER:
            profile = user.employer_profile
            profile_serializer = EmployerProfileSerializer(profile)
        else:
            return server_error(request)

        return Response({'user': user_serializer.data, 'profile': profile_serializer.data}, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        user = request.user
        user_serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})

        if user_serializer.is_valid(raise_exception=True):
            user_serializer.save()

            if user.role == User.Role.STUDENT:
                profile_serializer = StudentProfileSerializer(user.student_profile, data=request.data, partial=True)
            elif user.role == User.Role.EMPLOYER:
                profile_serializer = EmployerProfileSerializer(user.employer_profile, data=request.data, partial=True)
            else:
                return server_error(request)

            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({'user': user_serializer.data, 'profile': profile_serializer.data}, status=status.HTTP_200_OK)

    """
    API endpoint that allows listing and creation of jobs.
    GET requests return a list of all available jobs.
    POST requests create a new job.

    Only authenticated users can create jobs.
    """


class ApplicationPackageListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def perform_create(self, serializer):
        # Set the employer to the current authenticated user
        serializer.validated_data['student_profile'] = self.request.user.student_profile
        serializer.save()
        print(f'{self.request.user.email} created application package!')


class ApplicationDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class JobListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def perform_create(self, serializer):
        # Set the employer to the current authenticated user
        serializer.validated_data['employer'] = self.request.user.employer_profile
        serializer.save()
        print(f'{self.request.user.email} created job!')


class JobDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class JobApplicationView(UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    queryset = Job.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, CanCreateOrRemoveApplication]

    def post(self, request, *args, **kwargs):
        job = self.get_object()
        application = get_object_or_404(Application, pk=kwargs['package'])
        job.applications.add(application)
        job.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        job = self.get_object()
        application = get_object_or_404(Application, pk=kwargs['package'])
        if application.student_profile == request.user.student_profile:
            job.applications.remove(application)
            job.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)
