from django.urls import include, path
from rest_framework import routers
from .views import StudentProfileView,RegistrationView

router = routers.DefaultRouter()
router.register(r'students', StudentProfileView)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('student/register',RegistrationView.as_view())

]