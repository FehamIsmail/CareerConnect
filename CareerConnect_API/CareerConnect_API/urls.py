from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'^auth/', include('drf_social_oauth2.urls', namespace='drf')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
