from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .enums import Language


# Create your models here.
class BaseUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        abstract = True

    def __str__(self):
        return self.email


class Student(BaseUser):
    is_student = models.BooleanField(default=True)
    school = models.CharField(max_length=100)
    gpa = models.DecimalField(max_digits=3, decimal_places=2)
    language = models.CharField(max_length=2, choices=Language.choices)


class Employer(BaseUser):
    is_employer = models.BooleanField(default=True)
    company_name = models.CharField(max_length=100)


# class Job(models.Model):
#     pass
#
#
# class Application(models.Model):
#     pass
