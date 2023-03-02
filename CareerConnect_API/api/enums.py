from django.db import models


class Language(models.TextChoices):
    FRENCH = 'Fr', 'French',
    ENGLISH = 'En', 'English',


# class JobType(models.TextChoices):
#     FULL_TIME = '',
#     PART_TIME = '',
#     TEMPORARY = '',
#     CONTRACT = '',
#     FREELANCE = '',
#     INTERNSHIP = '',
#     VOLUNTEER = '',
#     SEASONAL = '',
#     REMOTE = '',
#     CONSULTANT = '',
#     EXECUTIVE = '',
