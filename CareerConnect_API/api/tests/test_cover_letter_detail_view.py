from datetime import timedelta

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.utils import timezone
from oauth2_provider.models import Application, AccessToken
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, Role, StudentProfile, CoverLetter


class CoverLetterDetailViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='userprofile@example.com', password='testpassword',
                                             role=Role.STUDENT)

        self.student_profile = StudentProfile.objects.get(
            user=self.user
        )
        self.cl = CoverLetter.objects.create(
            student_profile=self.student_profile,
            title='CL Title',
            default=True,
            cover_letter=SimpleUploadedFile("cl.pdf", b"test cl", content_type="application/pdf")
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

    def test_update_cl(self):
        url = reverse('cl-detail', kwargs={'pk': self.cl.id})
        updated_data = {
            'title': 'Updated Title',
            'default': False
        }
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)
        response = self.client.put(url, data=updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.cl.refresh_from_db()
        self.assertEqual(self.cl.title, updated_data['title'])
        self.assertEqual(self.cl.default, updated_data['default'])

    def test_delete_cl(self):
        url = reverse('cl-detail', kwargs={'pk': self.cl.id})
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CoverLetter.objects.filter(id=self.cl.id).exists())

    def test_get_cl(self):
        url = reverse('cl-detail', kwargs={'pk': self.cl.id})
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], CoverLetter.objects.first().title)
        self.assertEqual(response.data['default'], CoverLetter.objects.first().default)
        self.assertEqual(response.data['id'], str(CoverLetter.objects.first().id))

