from django.urls import include, path

from . import views

from .views import RegistrationView, UserProfileView, JobListView, JobDetailView, JobApplicationView, \
    ApplicationPackageListView, ApplicationPackageDetailView, CurriculumVitaeListView, CurriculumVitaeDetailView, \
    CoverLetterListView, CoverLetterDetailView, JobSelectionView, JobApplicationDetailView, \
    NotificationsListView

urlpatterns = [
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('github_oauth/', views.github_oauth_proxy, name='github_oauth_proxy'),
    path('register/', RegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    path('jobs/', JobListView.as_view(), name='jobs-list'),
    path('jobs/<uuid:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('jobs/<uuid:pk>/<int:phase>/', JobSelectionView.as_view(), name='job-process'),

    path('jobs/<uuid:pk>/apply/', JobApplicationView.as_view(), name='job-apply'),

    path('curriculumvitae/', CurriculumVitaeListView.as_view(), name='cv-list'),
    path('curriculumvitae/<uuid:pk>/', CurriculumVitaeDetailView.as_view(), name='cv-detail'),

    path('coverletter/', CoverLetterListView.as_view(), name='cl-list'),
    path('coverletter/<uuid:pk>/', CoverLetterDetailView.as_view(), name='cl-detail'),

    path('application-package/', ApplicationPackageListView.as_view(), name='packages-list'),
    path('application-package/<uuid:pk>/', ApplicationPackageDetailView.as_view(), name='package-detail'),

    path('application/', JobApplicationView.as_view(), name="application-list"),
    path('application/<uuid:pk>/', JobApplicationDetailView.as_view(), name="application-detail"),

    path('profile/notifications/', NotificationsListView.as_view(), name="notifications-list")

]
