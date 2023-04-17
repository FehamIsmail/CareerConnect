from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, Role, StudentProfile, EmployerProfile, CurriculumVitae
from .serializers import UserSerializer, StudentProfileSerializer, EmployerProfileSerializer


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
