from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, Role, EmployerProfile
from ..serializers import UserSerializer, EmployerProfileSerializer


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

