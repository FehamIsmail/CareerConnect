from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from oauth2_provider.models import AccessToken
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, StudentProfile, CurriculumVitae, CoverLetter, ApplicationPackage


class ApplicationPackageDetailViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@user.com',
            password='testpass123'
        )
        self.student_profile = StudentProfile.objects.get(user=self.user)
        self.access_token = AccessToken.objects.create(
            user=self.user,
            token='testtoken123',
            application=None,
            expires=timezone.now() + timedelta(days=1)
        )
        self.cv = CurriculumVitae.objects.create(student_profile=self.student_profile)
        self.cl = CoverLetter.objects.create(student_profile=self.student_profile)
        self.package = ApplicationPackage.objects.create(
            student_profile=self.user.student_profile,
            title='Test Package',
            default=False,
            curriculum_vitae=self.cv,
            cover_letter=self.cl

        )

    def test_get_package_detail(self):
        url = reverse('package-detail', kwargs={'pk': self.package.pk})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token.token}')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Package')

    def test_update_package_detail(self):
        url = reverse('package-detail', kwargs={'pk': self.package.pk})

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token.token}')
        response = self.client.put(url, {'title': 'Updated Package', 'default': True, })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Package')
        self.assertEqual(response.data['default'], True)


