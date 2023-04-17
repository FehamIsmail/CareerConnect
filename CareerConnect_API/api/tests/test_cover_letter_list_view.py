from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, Role, StudentProfile, CoverLetter


class CoverLetterListViewTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='userprofile@example.com', password='testpassword',
                                             role=Role.STUDENT)
        # get the student's profile
        self.student_profile = StudentProfile.objects.get(user=self.user)
        self.client.force_authenticate(user=self.user)
        self.url = reverse('cl-list')

    def test_create_cl(self):
        cl_file1 = SimpleUploadedFile("cl.pdf", b"test cl", content_type="application/pdf")
        cl_info1 = {
            'cover_letter': cl_file1,
            'title': "TEST CL"
        }

        response = self.client.post(self.url, data=cl_info1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual((CoverLetter.objects.count()), 1)

        # check the two cvs are saved correctly
        cl1 = CoverLetter.objects.last()

        self.assertEqual(cl1.title, cl_info1['title'])
        self.assertEqual(cl1.student_profile, self.student_profile)

    def test_list_cl(self):
        # create 2 cvs to be able to test the list function
        CoverLetter.objects.create(
            student_profile=self.student_profile,
            title='CL 1',
            default=True
        )
        CoverLetter.objects.create(
            student_profile=self.student_profile,
            title='CL 2',
            default=False
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        self.assertEqual(response.data[0]['title'], 'CL 1')
        self.assertEqual(response.data[0]['default'], True)

        self.assertEqual(response.data[1]['title'], 'CL 2')
        self.assertEqual(response.data[1]['default'], False)

        # check that the student profile is not displayed
        self.assertNotIn('student_profile', response.data[0])
        self.assertIn('cover_letter', response.data[0])

