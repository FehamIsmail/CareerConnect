from datetime import timedelta

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.utils import timezone
from oauth2_provider.models import Application, AccessToken
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, Role, StudentProfile, CurriculumVitae


class CurriculumVitaeDetailViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='userprofile@example.com', password='testpassword',
                                             role=Role.STUDENT)

        self.student_profile = StudentProfile.objects.get(
            user=self.user
        )
        self.cv = CurriculumVitae.objects.create(
            student_profile=self.student_profile,
            title='CV Title',
            default=True,
            curriculum_vitae=SimpleUploadedFile("cv.pdf", b"test cv", content_type="application/pdf")
        )

        self.application = Application.objects.create(
            name='Test Application',
            user=self.user,
            authorization_grant_type=Application.GRANT_CLIENT_CREDENTIALS
        )

        self.access_token = AccessToken.objects.create(
            user=self.user,
            token='testtoken',
            application=self.application,
            expires=timezone.now() + timedelta(days=1)
        )

    def test_update_cv(self):
        url = reverse('cv-detail', kwargs={'pk': self.cv.id})
        updated_data = {
            'title': 'Updated Title',
            'default': False
        }
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)
        response = self.client.put(url, data=updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.cv.refresh_from_db()
        self.assertEqual(self.cv.title, updated_data['title'])
        self.assertEqual(self.cv.default, updated_data['default'])

    def test_delete_cv(self):
        url = reverse('cv-detail', kwargs={'pk': self.cv.id})
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CurriculumVitae.objects.filter(id=self.cv.id).exists())

    def test_get_cv(self):
        url = reverse('cv-detail', kwargs={'pk': self.cv.id})
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], CurriculumVitae.objects.first().title)
        self.assertEqual(response.data['default'], CurriculumVitae.objects.first().default)
        self.assertEqual(response.data['id'], str(CurriculumVitae.objects.first().id))

