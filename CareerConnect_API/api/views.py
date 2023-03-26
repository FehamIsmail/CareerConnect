from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.exceptions import server_error
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListCreateAPIView, \
    RetrieveUpdateDestroyAPIView, UpdateAPIView, get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, StudentProfile, Job, Application, CurriculumVitae, CoverLetter, ApplicationStatus
from .permissions import IsOwnerOrReadOnly, CanCreateOrRemoveApplication
from .serializers import StudentProfileSerializer, EmployerProfileSerializer, \
    UserSerializer, JobSerializer, ApplicationSerializer, CVSerializer, CLSerializer, JobSerializerForStudent, \
    ApplicationStatusSerializer


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


class CurriculumVitaeListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    serializer_class = CVSerializer

    def get_queryset(self):
        user = self.request.user
        return CurriculumVitae.objects.filter(student_profile=user.student_profile)

    def perform_create(self, serializer):
        # Set the student to the current authenticated user
        serializer.validated_data['student_profile'] = self.request.user.student_profile
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        response_data = {
            'cv': serializer.data,
            'message': "Cv is successfully created"
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class CurriculumVitaeDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = CoverLetter.objects.all()
    serializer_class = CVSerializer


class CoverLetterListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = CoverLetter.objects.all()
    serializer_class = CLSerializer

    def get_queryset(self):
        user = self.request.user
        return CoverLetter.objects.filter(student_profile=user.student_profile)

    def perform_create(self, serializer):
        # Set the student to the current authenticated user
        serializer.validated_data['student_profile'] = self.request.user.student_profile
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        response_data = {
            'cl': serializer.data,
            'message': "Cl is successfully created"
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class CoverLetterDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = CoverLetter.objects.all()
    serializer_class = CLSerializer


class ApplicationPackageListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(student_profile=user.student_profile)

    def perform_create(self, serializer):
        # Set the employer to the current authenticated user
        serializer.validated_data['student_profile'] = self.request.user.student_profile
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        response_data = {
            'package': serializer.data,
            'message': "Application package is successfully created"
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class ApplicationPackageDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class JobListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    serializer_class = JobSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == User.Role.EMPLOYER:
            return Job.objects.filter(employer=user.employer_profile)
        else:
            return Job.objects.all()

    def perform_create(self, serializer):
        # Set the employer to the current authenticated user
        serializer.validated_data['employer'] = self.request.user.employer_profile
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        response_data = {
            'job': serializer.data,
            'message': "job is successfully created"
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class JobDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def is_owner(self, job):
        return self.request.user.is_authenticated and hasattr(self.request.user,
                                                              'employer_profile') and job.employer == self.request.user.employer_profile

    def get_serializer_class(self):
        job = self.get_object()
        if self.is_owner(job):
            return JobSerializer
        else:
            return JobSerializerForStudent

    def get(self, request, *args, **kwargs):

        # if "phase" in kwargs:
        #     phase = kwargs['phase']
        # else:
        return self.retrieve(request, *args, **kwargs)

        # candidates = None

        # if phase == 1:
        #     job = self.get_object()
        #     candidates = job.applications.all()
        #     application_status=get_object_or_404(ApplicationStatus,Job=job,application_package=candidates[0])
        #     serializer=ApplicationSerializer(candidates, many=True)
        #     application_status_serializer=ApplicationStatusSerializer(instance=application_status,data={"status":"INTERVIEW"})
        #     data=serializer.data
        #     if application_status_serializer.is_valid():
        #         application_status_serializer.save()
        #
        # return Response({'Application Status': application_status_serializer["status"].value}, status=status.HTTP_200_OK)
    def post(self,request,*args,**kwargs):
        if "phase" in kwargs:
            phase = kwargs['phase']
        else:
            return self.retrieve(request, *args, **kwargs)

        candidates = None

        if phase == 1:
            job = self.get_object()
            candidates = job.applications.filter(id__in=request.data.get("ids",[]))#job.applications.all()
            for candidate in candidates:
                application_status = get_object_or_404(ApplicationStatus, Job=job, application_package=candidate)
                serializer = ApplicationSerializer(candidates, many=True)
                application_status_serializer = ApplicationStatusSerializer(instance=application_status,
                                                                            data={"status": "INTERVIEW"})
                data = serializer.data
                if application_status_serializer.is_valid():
                    application_status_serializer.save()

        return Response({'Application Status': application_status_serializer["status"].value}, status=status.HTTP_200_OK)


class JobApplicationView(UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    queryset = Job.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, CanCreateOrRemoveApplication]

    def post(self, request, *args, **kwargs):
        job = self.get_object()
        application = get_object_or_404(Application, pk=request.data['package_id'])
        job.applications.add(application)
        """
            change status from null to applied (through table) @Abdel
        """
        job.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        job = self.get_object()
        application = get_object_or_404(Application, pk=request.POST['package_id'])
        if application.student_profile == request.user.student_profile:
            job.applications.remove(application)
            """
                change status from applied to not applied (through table) @Abdel
            """
            job.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class JobApplicantsView(ListCreateAPIView):
    pass
    # serializer_class = ApplicationSerializer
    #
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    #
    # def get_queryset(self):
    #     job_id = self.kwargs["pk"]
    #     return Application.objects.filter(job__id=job_id)
    #
    # def perform_create(self, serializer):
    #     job_id = self.kwargs['pk']
    #     serializer.save(job_id=job_id)
    #
    # def post(self, request, *args, **kwargs):
    #     job_id = self.kwargs['pk']
    #     applicationid = request.data.get("ids")
    #     application = get_object_or_404(Application, applicationid)
    #     app_status = get_object_or_404(ApplicationStatus, job_id=job_id, application=application)
    #     serializer = ApplicationStatusSerializer(instance=app_status, data=["status"])
