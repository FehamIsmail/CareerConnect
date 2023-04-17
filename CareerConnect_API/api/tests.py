from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, Role, StudentProfile, EmployerProfile, CurriculumVitae, CoverLetter, ApplicationPackage, Job
from .serializers import UserSerializer, StudentProfileSerializer, EmployerProfileSerializer
from oauth2_provider.models import Application, AccessToken
from django.utils import timezone
from datetime import timedelta


class RegistrationViewTestCase(APITestCase):
    def test_register_student(self):
        url = reverse('register')
        data = {
            "email": "test@test.com",
            "first_name": "Test",
            "last_name": "User",
            "role": Role.STUDENT,
            "password": "testpassword",
            "confirm_password": "testpassword",
            "institution": "Concordia University"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(email=data['email'])
        self.assertEqual(user.first_name, data['first_name'])
        self.assertEqual(user.last_name, data['last_name'])
        self.assertEqual(user.role, Role.STUDENT)
        self.assertTrue(user.check_password(data['password']))

        student_profile = user.student_profile
        self.assertIsNotNone(student_profile)
        self.assertEqual(student_profile.institution, data['institution'])

    def test_register_employer(self):
        url = reverse('register')
        data = {
            "email": "employer@test.com",
            "first_name": "employer",
            "last_name": "employer",
            "role": Role.EMPLOYER,
            "password": "testpassword",
            "confirm_password": "testpassword",
            "company_name": "Genetec"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(email=data['email'])
        self.assertEqual(user.first_name, data['first_name'])
        self.assertEqual(user.last_name, data['last_name'])
        self.assertEqual(user.role, Role.EMPLOYER)
        self.assertTrue(user.check_password(data['password']))

        student_profile = user.employer_profile
        self.assertIsNotNone(student_profile)
        self.assertEqual(student_profile.company, data['company_name'])


class StudentProfileViewTestCase(APITestCase):
    def setUp(self):
        # user creation
        self.user = User.objects.create_user(email='userprofile@example.com', password='testpassword',
                                             role=Role.STUDENT)

        # get the student's profile
        self.student_profile = StudentProfile.objects.get(user=self.user)

        # Set up URLs for the view
        self.get_url = reverse('user-profile')
        self.put_url = reverse('user-profile')

    def test_get_user_profile(self):
        # login student
        self.client.force_authenticate(user=self.user)
        # get request to check response code
        response = self.client.get(self.get_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that the response data contains the user and profile data
        expected_data = {
            'user': UserSerializer(self.user).data,
            'profile': StudentProfileSerializer(self.student_profile).data
        }
        self.assertEqual(response.data, expected_data)

    def test_update_user_profile(self):
        # Log in the user to authenticate the request
        self.client.force_authenticate(user=self.user)

        # Make a PUT request to the view to update the user and profile data
        updated_data = {
            'email': 'newemail@example.com',
            'field_of_study': 'Philosophy'
        }
        # check the response is good
        response = self.client.put(self.put_url, data=updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # verify update has been done correctly
        self.user.refresh_from_db()
        self.student_profile.refresh_from_db()
        self.assertEqual(self.user.email, updated_data['email'])
        self.assertEqual(self.student_profile.field_of_study, updated_data['field_of_study'])


class EmployerProfileViewTestCase(APITestCase):
    def setUp(self):
        # user creation
        self.user = User.objects.create_user(email='userprofile@example.com', password='testpassword',
                                             role=Role.EMPLOYER)

        try:
            self.employer_profile = EmployerProfile.objects.get(user=self.user)
        except EmployerProfile.DoesNotExist:
            self.employer_profile = EmployerProfile.objects.create(user=self.user, company='Desjardins')

        self.get_url = reverse('user-profile')
        self.put_url = reverse('user-profile')

    def test_get_user_profile(self):
        # login student
        self.client.force_authenticate(user=self.user)
        # get request to check response code
        response = self.client.get(self.get_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that the response data contains the user and profile data
        expected_data = {
            'user': UserSerializer(self.user).data,
            'profile': EmployerProfileSerializer(self.employer_profile).data
        }
        self.assertEqual(response.data, expected_data)

    def test_update_user_profile(self):
        # Log in the user to authenticate the request
        self.client.force_authenticate(user=self.user)

        # Make a PUT request to the view to update the user and profile data
        updated_data = {
            'email': 'newemail@example.com',
            'company': 'Bombardier'
        }
        # check the response is good
        response = self.client.put(self.put_url, data=updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # verify update has been done correctly
        self.user.refresh_from_db()
        self.employer_profile.refresh_from_db()
        self.assertEqual(self.user.email, updated_data['email'])
        self.assertEqual(self.employer_profile.company, updated_data['company'])


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


class JobListViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='employer@employer.com', password='test123', role=Role.EMPLOYER)
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company='genetec')
        # self.job = Job.objects.create(employer_profile=self.employer_profile, title="Test job posting",
        #                               short_description="short description of the job")
        self.url = reverse('jobs-list')

    def test_list_jobs(self):
        employer2 = User.objects.create_user(email='employer2@employer.com', password='iukcve', role=Role.EMPLOYER)
        profile2 = EmployerProfile.objects.create(user=employer2, company='ubisoft')

        Job.objects.create(employer_profile=self.employer_profile, title="Job1",
                           short_description="short description of the job")
        Job.objects.create(employer_profile=profile2, title="Job2",
                           short_description="short description of the job")

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        self.assertEqual(response.data[0]['title'], 'Job1')
        self.assertEqual(response.data[0]['short_description'], "short description of the job")
        self.assertEqual(response.data[0]['employer_profile']['company'], self.employer_profile.company)

        self.assertEqual(response.data[1]['title'], 'Job2')
        self.assertEqual(response.data[1]['short_description'], "short description of the job")
        self.assertEqual(response.data[1]['employer_profile']['company'], profile2.company)

        self.assertNotIn('application_packages', response.data[0])
