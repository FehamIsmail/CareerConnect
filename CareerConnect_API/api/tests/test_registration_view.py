from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, Role


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

