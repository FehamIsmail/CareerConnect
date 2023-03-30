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
from .permissions import IsOwnerOrReadOnly, IsOwnerOnly, IsStudentAndOwner
from .serializers import StudentProfileSerializer, EmployerProfileSerializer, \
    UserSerializer, JobSerializer, ApplicationPackageSerializer, CVSerializer, CLSerializer, \
    ApplicationSerializer, ApplicationSerializerForSelection


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


class UserProfileView(RetrieveUpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # parser_classes = [MultiPartParser, FormParser] TODO: Isma3il why? :(

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
        serializer.save(student_profile=self.request.user.student_profile)
    #
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     response_data = {
    #         'cv': serializer.data,
    #         'message': "Cv is successfully created"
    #     }
    #     return Response(response_data, status=status.HTTP_201_CREATED)


class CurriculumVitaeDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = CurriculumVitae.objects.all()
    serializer_class = CVSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, partial=True)


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
        serializer.save(student_profile=self.request.user.student_profile)

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     response_data = {
    #         'cl': serializer.data,
    #         'message': "Cl is successfully created"
    #     }
    #     return Response(response_data, status=status.HTTP_201_CREATED)


class CoverLetterDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = CoverLetter.objects.all()
    serializer_class = CLSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, partial=True)


class ApplicationPackageListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = ApplicationPackage.objects.all()
    serializer_class = ApplicationPackageSerializer

    def get_queryset(self):
        user = self.request.user
        return ApplicationPackage.objects.filter(student_profile=user.student_profile)

    # def create(self, request, *args, **kwargs):
    #
    #     serializer = self.get_serializer(data=request.data, partial=True, context={'request': request})
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     response_data = {
    #         'package': serializer.data,
    #         'message': "Application package is successfully created"
    #     }
    #     return Response(response_data, status=status.HTTP_201_CREATED)


class ApplicationPackageDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    queryset = ApplicationPackage.objects.all()
    serializer_class = ApplicationPackageSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, partial=True)


class JobListView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    serializer_class = JobSerializer

    def get_queryset(self):
        user = self.request.user
        params = self.request.query_params
        self_only = params.get('self_only') == 'true'
        if user.is_authenticated and user.role == User.Role.EMPLOYER and self_only:
            return Job.objects.filter(employer_profile=user.employer_profile)
        else:
            return Job.objects.all()

    def perform_create(self, serializer):
        # Set the student to the current authenticated user
        serializer.save(employer_profile=self.request.user.employer_profile)

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     response_data = {
    #         'job': serializer.data,
    #         'message': "job is successfully created"
    #     }
    #     return Response(response_data, status=status.HTTP_201_CREATED)


class JobDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    # def is_owner(self, job):
    #     return self.request.user.is_authenticated and hasattr(self.request.user,
    #                                                           'employer_profile') and job.employer_profile == self.request.user.employer_profile


class JobSelectionView(RetrieveUpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOnly]
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get(self, request, *args, **kwargs):
        job = self.get_object()
        all_candidates = job.application_set.all()
        phase = kwargs['phase']

        if phase == 1:
            application_serializer = ApplicationSerializerForSelection(all_candidates, many=True)
            return Response({'candidates': application_serializer.data}, status=status.HTTP_200_OK)

        elif phase == 2:
            interviewing_application_ids = Application.objects.filter(job=job,
                                                                      status=ApplicationStatus.INTERVIEW).values_list(
                'id')
            interviewing_candidates = job.application_set.filter(id__in=interviewing_application_ids)

            rejected_application_ids = Application.objects.filter(job=job,
                                                                  status=ApplicationStatus.REJECTED).values_list('id')
            rejected_candidates = job.application_set.filter(id__in=rejected_application_ids)

            interviewing_serializer = ApplicationSerializerForSelection(interviewing_candidates, many=True)
            rejected_serializer = ApplicationSerializerForSelection(rejected_candidates, many=True)

            response_data = {'interviewing_candidates': interviewing_serializer.data,
                             'rejected_candidates': rejected_serializer.data}
            return Response(response_data, status=status.HTTP_200_OK)

        elif phase == 3:
            offer_application_ids = Application.objects.filter(job=job, status=ApplicationStatus.OFFER).values_list(
                'id')
            offer_candidates = job.application_set.filter(id__in=offer_application_ids)

            processing_application_ids = Application.objects.filter(job=job,
                                                                    status=ApplicationStatus.PROCESSING).values_list(
                'id')
            processing_candidates = job.application_set.filter(id__in=processing_application_ids)

            rejected_application_ids = Application.objects.filter(job=job,
                                                                  status=ApplicationStatus.REJECTED).values_list('id')
            rejected_candidates = job.application_set.filter(id__in=rejected_application_ids)

            offer_serializer = ApplicationSerializerForSelection(offer_candidates, many=True)
            processing_serializer = ApplicationSerializerForSelection(processing_candidates, many=True)
            rejected_serializer = ApplicationSerializerForSelection(rejected_candidates, many=True)

            response_data = {'offer_candidates': offer_serializer.data,
                             'processing_candidates': processing_serializer.data,
                             'rejected_candidates': rejected_serializer.data}
            return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        phase = kwargs['phase']
        application_serializer = None
        job = self.get_object()
        all_candidates = job.application_set.all()
        selected_candidates_ids = request.data.get('selected_candidates', [])

        def filter_candidate(next_status):
            for candidate in all_candidates:
                new_status = next_status if str(candidate.id) in selected_candidates_ids else ApplicationStatus.REJECTED
                application_serializer = ApplicationSerializerForSelection(instance=candidate,
                                                                           data={'status': new_status}, partial=True)

                if application_serializer.is_valid():
                    application_serializer.save()
                else:
                    return Response(application_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            selected_candidates = job.application_set.filter(status=next_status)
            response_serializer = ApplicationSerializerForSelection(selected_candidates, many=True)
            return Response({'selected candidate': response_serializer.data},
                            status=status.HTTP_200_OK)

        if phase == 1:
            return filter_candidate(next_status=ApplicationStatus.INTERVIEW)

        elif phase == 2:
            return filter_candidate(next_status=ApplicationStatus.PROCESSING)

        elif phase == 3:
            return filter_candidate(next_status=ApplicationStatus.OFFER)


class JobApplicationView(ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly, IsStudentAndOwner]
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(application_package__student_profile=user.student_profile)


class JobApplicationDetailView(RetrieveUpdateDestroyAPIView):
    """
    The permission "IsOwnerOrReadOnly" is self-explanatory:
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsStudentAndOwner]
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    # def post(self, request, *args, **kwargs):
    #     job = self.get_object()
    #     application_package = get_object_or_404(ApplicationPackage, pk=request.data['package_id'])
    #     job.application_packages.add(application_package)
    #     job.save()
    #
    #     application = Application(job=job, application_package=application_package)
    #     application_serializer = ApplicationSerializer(instance=application)
    #
    #     response_data = {
    #         'application': application_serializer.data,
    #         'message': f"Application with package: {application_package.title} to job: {job.title} successful!"
    #     }
    #
    #     return Response(response_data, status=status.HTTP_201_CREATED)
    #
    # def delete(self, request, *args, **kwargs):
    #     job = self.get_object()
    #     student_profile = request.user.student_profile
    #     application_package = ApplicationPackage.objects.get(student_profile=student_profile, job=job)
    #
    #     application = Application(job=job, application_package=application_package)
    #     application_serializer = ApplicationSerializer(instance=application)
    #
    #     job.application_packages.remove(application_package)
    #     job.save()
    #
    #     response_data = {
    #         'application': application_serializer.data,
    #         'message': f"Application with package: {application_package.title} to job: {job.title} successfully removed!"
    #     }
    #
    #     return Response(response_data, status=status.HTTP_204_NO_CONTENT)


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
