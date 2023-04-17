from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, Role, StudentProfile, CurriculumVitae


#
class CurriculumVitaeListViewTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='userprofile@example.com', password='testpassword',
                                             role=Role.STUDENT)
        # get the student's profile
        self.student_profile = StudentProfile.objects.get(user=self.user)
        self.client.force_authenticate(user=self.user)
        self.url = reverse('cv-list')

    def test_create_cv(self):
        cv_file1 = SimpleUploadedFile("cv.pdf", b"test cv", content_type="application/pdf")
        cv_info1 = {
            'curriculum_vitae': cv_file1,
            'title': "TEST CV"
        }

        response = self.client.post(self.url, data=cv_info1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual((CurriculumVitae.objects.count()), 1)

        # check the two cvs are saved correctly
        cv1 = CurriculumVitae.objects.last()

        self.assertEqual(cv1.title, cv_info1['title'])
        self.assertEqual(cv1.student_profile, self.student_profile)

    def test_list_cv(self):
        # create 2 cvs to be able to test the list function
        CurriculumVitae.objects.create(
            student_profile=self.student_profile,
            title='CV 1',
            default=True
        )
        CurriculumVitae.objects.create(
            student_profile=self.student_profile,
            title='CV 2',
            default=False
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        self.assertEqual(response.data[0]['title'], 'CV 1')
        self.assertEqual(response.data[0]['default'], True)

        self.assertEqual(response.data[1]['title'], 'CV 2')
        self.assertEqual(response.data[1]['default'], False)

        # check that the student profile is not displayed
        self.assertNotIn('student_profile', response.data[0])
        self.assertIn('curriculum_vitae', response.data[0])

