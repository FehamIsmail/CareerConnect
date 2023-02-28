from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from .enums import Language


# Create your models here.\

# https://rahmanfadhil.com/django-login-with-email/ Login with email or username

# Base User model
class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    objects = UserManager()
    username = None
    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Role(models.TextChoices):
        ADMIN = "ADMIN", 'Admin'
        STUDENT = "STUDENT", 'Student'
        EMPLOYER = "EMPLOYER", 'Employer'

    base_role = Role.ADMIN
    role = models.CharField(max_length=50, choices=Role.choices)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            return super().save(self, *args, **kwargs)


# ============= STUDENT ============= #
class StudentManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.STUDENT)


class Student(User):
    base_role = User.Role.STUDENT
    student = StudentManager()

    class Meta:
        proxy = True

    def welcome(self):
        return "Hi Student!"


@receiver(post_save, sender=Student)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "STUDENT":
        StudentProfile.objects.create(user=instance)


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    student_id = models.BigIntegerField(null=True, blank=True)
    education = models.CharField(max_length=100, null=True, blank=True)


class CoverLetter(models.Model):
    student_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)

    title = models.CharField(max_length=100, null=True, blank=True)


class CurriculumVitae(models.Model):
    student_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)

    title = models.CharField(max_length=100, null=True, blank=True)
    skills = models.CharField(max_length=100, null=True, blank=True)


class Application(models.Model):
    student_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    cover_letter = models.ManyToManyField(CoverLetter)
    curriculum_vitae = models.ManyToManyField(CurriculumVitae)

    package_name = models.CharField(max_length=100, null=True, blank=True)


# ============= EMPLOYER ============= #
class EmployerManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.EMPLOYER)


class Employer(User):
    base_role = User.Role.EMPLOYER
    employer = EmployerManager()

    class Meta:
        proxy = True

    def welcome(self):
        return "Hi Employer!"


class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.CharField(max_length=100, null=True, blank=True)


class Job(models.Model):
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE)
    applications = models.ManyToManyField(Application)
    title = models.CharField(max_length=100, null=True, blank=True)
    description = models.CharField(max_length=300, null=True, blank=True)



@receiver(post_save, sender=Employer)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "EMPLOYER":
        EmployerProfile.objects.create(user=instance)

# class BaseUser(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(unique=True)
#     first_name = models.CharField(max_length=100)
#     last_name = models.CharField(max_length=100)
#
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['first_name', 'last_name']
#
#     class Meta:
#         abstract = True
#
#     def __str__(self):
#         return self.email
#
#
# class Student(BaseUser):
#     is_student = models.BooleanField(default=True)
#     school = models.CharField(max_length=100)
#     gpa = models.DecimalField(max_digits=3, decimal_places=2)
#     language = models.CharField(max_length=2, choices=Language.choices)
#
#
# class Employer(BaseUser):
#     is_employer = models.BooleanField(default=True)
#     company_name = models.CharField(max_length=100)
#
#
# # class Job(models.Model):
# #     pass
# #
# #
# # class Application(models.Model):
# #     pass
