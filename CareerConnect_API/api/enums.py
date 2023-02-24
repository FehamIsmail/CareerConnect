from django.db import models


class Language(models.TextChoices):
    FRENCH = 'Fr', 'French',
    ENGLISH = 'En', 'English',
