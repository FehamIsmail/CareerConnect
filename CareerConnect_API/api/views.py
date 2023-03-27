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

from .enums import Role, ApplicationStatus
from .models import User, StudentProfile, Job, ApplicationPackage, CurriculumVitae, CoverLetter, Application
from .permissions import IsOwnerOrReadOnly, CanCreateOrRemoveApplication
from .serializers import StudentProfileSerializer, EmployerProfileSerializer, \
    UserSerializer, JobSerializer, ApplicationPackageSerializer, CVSerializer, CLSerializer, JobSerializerForStudent, \
    ApplicationSerializer


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
            if new_user.role == Role.STUDENT:
                new_user.student_profile.institution = request.data['institution']
                new_user.student_profile.save()
            elif new_user.role == Role.EMPLOYER:
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

        if user.role == Role.STUDENT:
            profile = user.student_profile
            profile_serializer = StudentProfileSerializer(profile)
        elif user.role == Role.EMPLOYER:
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

            if user.role == Role.STUDENT:
                profile_serializer = StudentProfileSerializer(user.student_profile, data=request.data, partial=True)
            elif user.role == Role.EMPLOYER:
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
    queryset = ApplicationPackage.objects.all()
    serializer_class = ApplicationPackageSerializer

    def get_queryset(self):
        user = self.request.user
        return ApplicationPackage.objects.filter(student_profile=user.student_profile)

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
    queryset = ApplicationPackage.objects.all()
    serializer_class = ApplicationPackageSerializer


class JobListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    serializer_class = JobSerializer

    def get_serializer_class(self):
        user=self.request.user
        if user.is_authenticated and user.role == Role.EMPLOYER:
            return JobSerializer
        #students and people not logged in will see only the jobs
        else:
            return JobSerializerForStudent

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == Role.EMPLOYER:
            return Job.objects.filter(employer_profile=user.employer_profile)
        # elif user.is_authenticated and user.role == Role.STUDENT:
        #     return Job.objects.filter(application__student_profile=user.student_profile)
        else:
            return Job.objects.all()

    def perform_create(self, serializer):
        # Set the employer to the current authenticated user
        serializer.validated_data['employer_profile'] = self.request.user.employer_profile
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
                                                              'employer_profile') and job.employer_profile == self.request.user.employer_profile

    def get_serializer_class(self):
        job = self.get_object()
        if self.is_owner(job):
            return JobSerializer
        else:
            return JobSerializerForStudent

    def get(self, request, *args, **kwargs):

        if "phase" in kwargs:
            phase = kwargs['phase']
        else:
            return self.retrieve(request, *args, **kwargs)

        # candidates = None
        job = self.get_object()
        candidates = job.application_packages.all()

        if phase == 1:
            application_serializer = ApplicationPackageSerializer(candidates, many=True)
            return Response({'Candidates': application_serializer.data}, status=status.HTTP_200_OK)

        elif phase == 2:
            interviewing_ids = Application.objects.filter(status="INTERVIEW").values_list(
                "application_package_id")
            candidates = job.application_packages.filter(id__in=interviewing_ids)
            application_serializer = ApplicationPackageSerializer(candidates, many=True)
            return Response({'Candidates': application_serializer.data}, status=status.HTTP_200_OK)

        elif phase == 3:
            interviewing_ids = Application.objects.filter(status="PROCESSING").values_list(
                "application_package_id")
            candidates = job.application_packages.filter(id__in=interviewing_ids)
            application_serializer = ApplicationPackageSerializer(candidates, many=True)
            return Response({'Candidates': application_serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        if "phase" in kwargs:
            phase = kwargs['phase']
        else:
            return self.update(request, *args, **kwargs)

        selected_candidates = None
        application_serializer = None
        job = self.get_object()

        if phase == 1:
            candidates_packages = job.application_packages.all()
            selected_candidates = job.application_packages.filter(id__in=request.data.get("ids", []))
            for packages in candidates_packages:
                application = get_object_or_404(Application, job=job, application_package=packages)
                if packages in selected_candidates:
                    application_serializer = ApplicationSerializer(instance=application,
                                                                          data={"status": ApplicationStatus.INTERVIEW})
                elif packages not in selected_candidates:
                    application_serializer = ApplicationSerializer(instance=application,
                                                                          data={"status": ApplicationStatus.REJECTED})

                if application_serializer.is_valid():
                    application_serializer.save()
            return Response({'Application Status': application_serializer["status"].value},
                            status=status.HTTP_200_OK)

        elif phase == 2:
            interviewing_ids = Application.objects.filter(status=ApplicationStatus.INTERVIEW).values_list(
                "application_package_id")
            candidates_packages = job.application_packages.filter(id__in=interviewing_ids)
            selected_candidates = job.application_packages.filter(id__in=request.data.get("ids", []))

            for packages in candidates_packages:
                application = get_object_or_404(Application, job=job, application_package=packages)

                if packages in selected_candidates:
                    application_serializer = ApplicationSerializer(instance=application,
                                                                          data={"status": ApplicationStatus.PROCESSING})
                if packages not in selected_candidates:
                    application_serializer = ApplicationSerializer(instance=application,
                                                                          data={"status": ApplicationStatus.REJECTED})
                if application_serializer.is_valid():
                    application_serializer.save()

            return Response({'Application Status': application_serializer.data},
                            status=status.HTTP_200_OK)

        elif phase == 3:
            interviewing_ids = Application.objects.filter(status=ApplicationStatus.PROCESSING).values_list(
                "application_package_id")
            candidates_packages = job.application_packages.filter(id__in=interviewing_ids)
            selected_candidates = job.application_packages.filter(id__in=request.data.get("ids", []))

            for packages in candidates_packages:
                application = get_object_or_404(Application, job=job, application_package=packages)

                if packages in selected_candidates:
                    application_serializer = ApplicationSerializer(instance=application,
                                                                          data={"status": ApplicationStatus.OFFER})
                if packages not in selected_candidates:
                    application_serializer = ApplicationSerializer(instance=application,
                                                                          data={"status": ApplicationStatus.WAITLIST})
                if application_serializer.is_valid():
                    application_serializer.save()

            return Response({'Application Status': "application_serializer.data"},
                            status=status.HTTP_200_OK)


class JobApplicationView(UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    queryset = Job.objects.all()
    serializer_class = ApplicationPackageSerializer
    permission_classes = [IsAuthenticated, CanCreateOrRemoveApplication]

    def post(self, request, *args, **kwargs):
        job = self.get_object()
        application_package = get_object_or_404(ApplicationPackage, pk=request.data['package_id'])
        job.application_packages.add(application_package)
        job.save()

        application = Application(job=job, application_package=application_package)
        application_serializer = ApplicationSerializer(instance=application)

        response_data = {
            'application': application_serializer.data,
            'message': f"Application with package: {application_package.title} to job: {job.title} successful!"
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        job = self.get_object()
        student_profile = request.user.student_profile
        application_package = ApplicationPackage.objects.get(student_profile=student_profile, job=job)

        application = Application(job=job, application_package=application_package)
        application_serializer = ApplicationSerializer(instance=application)

        job.application_packages.remove(application_package)
        job.save()

        response_data = {
            'application': application_serializer.data,
            'message': f"Application with package: {application_package.title} to job: {job.title} successfully removed!"
        }

        return Response(response_data, status=status.HTTP_204_NO_CONTENT)


class JobApplicantsView(ListCreateAPIView):
    serializer_class = ApplicationPackageSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        job_id = self.kwargs["pk"]
        return ApplicationPackage.objects.filter(job__id=job_id)

    def perform_create(self, serializer):
        job_id = self.kwargs['pk']
        serializer.save(job_id=job_id)

    def post(self, request, *args, **kwargs):
        job_id = self.kwargs['pk']
        applicationid = request.data.get("ids")
        application = get_object_or_404(ApplicationPackage, applicationid)
        app_status = get_object_or_404(Application, job_id=job_id, application=application)
        serializer = ApplicationSerializer(instance=app_status, data=["status"])
