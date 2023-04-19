from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User, Role, EmployerProfile, Job


class JobListViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='employer@employer.com', password='test123', role=Role.EMPLOYER)
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company='genetec')
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
