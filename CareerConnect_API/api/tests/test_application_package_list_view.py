from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, Role, StudentProfile, CurriculumVitae, CoverLetter, ApplicationPackage


class ApplicationPackageListViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@test.com", password='testpassword', role=Role.STUDENT)
        # self.student_profile = StudentProfile.objects.create(username='testuser', email='testuser@example.com')
        self.student_profile = StudentProfile.objects.get(user=self.user)
        self.cv = CurriculumVitae.objects.create(student_profile=self.student_profile)
        self.cl = CoverLetter.objects.create(student_profile=self.student_profile)
        self.url = reverse('packages-list')

    def test_create_application_package(self):
        self.client.force_authenticate(user=self.student_profile.user)

        data = {
            'title': 'My application package',
            'cv_id': str(self.cv.id),
            'cl_id': str(self.cl.id),
            'default': True,
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        package = ApplicationPackage.objects.get(id=response.data['id'])
        self.assertEqual(package.title, data['title'])
        self.assertEqual(package.curriculum_vitae.id, self.cv.id)
        self.assertEqual(package.cover_letter.id, self.cl.id)
        self.assertEqual(package.default, data['default'])
        self.assertEqual(package.student_profile, self.student_profile)


# def test_update_application_package(self):
#     self.client.force_authenticate(user=self.student_profile.user)
#
#     package = ApplicationPackage.objects.create(
#         student_profile=self.student_profile,
#         curriculum_vitae=self.cv,
#         cover_letter=self.cl,
#         title='My application package',
#         default=True,
#     )
#
#     new_cv = CurriculumVitae.objects.create(student_profile=self.student_profile)
#     new_cl = CoverLetter.objects.create(student_profile=self.student_profile)
#
#     data = {
#         'cv_id': str(new_cv.id),
#         'cl_id': str(new_cl.id),
#         'title': 'Updated title',
#         'default': False,
#     }
#     response = self.client.put(reverse('package-detail', args=[package.id]), data)
#     self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     package.refresh_from_db()
#     self.assertEqual(package.curriculum_vitae.id, new_cv.id)
#     self.assertEqual(package.cover_letter.id, new_cl.id)
#     self.assertEqual(package.title, data['title'])
#     self.assertEqual(package.default, data['default'])

