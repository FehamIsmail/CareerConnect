from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import RegistrationView, LoginView, UserProfileView, JobListView, JobDetailView, JobApplicationView, \
    ApplicationPackageListView, ApplicationPackageDetailView, CurriculumVitaeListView, CurriculumVitaeDetailView, \
    CoverLetterListView, CoverLetterDetailView

urlpatterns = [
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    # path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    path('jobs/', JobListView.as_view(), name='jobs-list'),
    path('jobs/<uuid:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('jobs/<uuid:pk>/apply/', JobApplicationView.as_view(), name='job-apply'),

    path('curriculumvitae/', CurriculumVitaeListView.as_view(), name='cv-list'),
    path('curriculumvitae/<uuid:pk>/', CurriculumVitaeDetailView.as_view(), name='cv-detail'),

    path('coverleter/', CoverLetterListView.as_view(), name='cv-list'),
    path('coverletter/<uuid:pk>/', CoverLetterDetailView.as_view(), name='cv-detail'),

    path('applications/', ApplicationPackageListView.as_view(), name='application-list'),
    path('applications/<uuid:pk>/', ApplicationPackageDetailView.as_view(), name='application-detail'),


]


