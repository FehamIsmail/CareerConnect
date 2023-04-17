from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, Role, StudentProfile
from ..serializers import UserSerializer, StudentProfileSerializer


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

