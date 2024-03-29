import uuid
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .enums import EducationLevel, Role, JobType, ApplicationStatus, NotificationColor


# https://rahmanfadhil.com/django-login-with-email/ Login with email or username
def upload_to(instance, filename):
    return f'images/{filename}'


class CustomQuerySet(models.QuerySet):
    def students(self):
        return self.filter(role=Role.STUDENT)

    def employers(self):
        return self.filter(role=Role.EMPLOYER)

    def admins(self):
        return self.filter(role=Role.ADMIN)


# Base User model
class UserManager(BaseUserManager):
    def create_user(self, email, role=Role.STUDENT, password=None, **extra_fields):
        """
        Creates and saves a User with the given email, role, and password.
        """
        if not email:
            raise ValueError('The Email field must be set')

        email = self.normalize_email(email)

        if role == Role.STUDENT:
            user = Student(email=email, role=role, **extra_fields)
        else:
            user = self.model(email=email, role=role, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email, role, and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email=email, password=password, role=Role.ADMIN, **extra_fields)

    def get_queryset(self):
        return CustomQuerySet(self.model, using=self._db)

    def students(self):
        return self.get_queryset().students()

    def employers(self):
        return self.get_queryset().employers()


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    objects = UserManager()
    username = None
    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    role = models.CharField(max_length=50, choices=Role.choices)


class Student(User):
    class Meta:
        proxy = True

    def welcome(self):
        return f'Hi {self.first_name}! Welcome to CareerConnect Student interface!'

    def __str__(self):
        return f"{self.first_name}, {self.last_name}"


class Employer(User):
    class Meta:
        proxy = True

    def welcome(self):
        return f'Hi {self.first_name}! Welcome to CareerConnect Employer interface!'

    def __str__(self):
        return f"{self.first_name}, {self.last_name}"


class EmployerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    profile_picture = models.ImageField(upload_to=upload_to, blank=True, null=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)

    # Profile Info
    company = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.user.first_name}, {self.user.last_name}"


class StudentProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    profile_picture = models.ImageField(upload_to=upload_to, blank=True, null=True)


    # Academic Info
    institution = models.CharField(max_length=100, null=True, blank=True)
    field_of_study = models.CharField(max_length=100, null=True, blank=True)
    education_level = models.CharField(max_length=4, choices=EducationLevel.choices)

    # Contact Information
    phone_number = models.CharField(max_length=20, null=True, blank=True)

    # Location
    country = models.CharField(max_length=50, null=True, blank=True)
    province_territory = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    postal_code = models.CharField(max_length=50, null=True, blank=True)
    street_address = models.CharField(max_length=50, null=True, blank=True)
    relocation = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.first_name}, {self.user.last_name}"


# ============= STUDENT's Objects ============= #
class CoverLetter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='cl', null=True,
                                        blank=True)
    cover_letter = models.FileField(null=True, blank=True)

    title = models.CharField(max_length=100, null=True, blank=True)
    default = models.BooleanField(default=False)

    def __str__(self):
        return f"CL: {self.title}, by {self.student_profile.user.first_name}"


class CurriculumVitae(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='cv', null=True,
                                        blank=True)
    curriculum_vitae = models.FileField(null=True, blank=True)

    title = models.CharField(max_length=100, null=True, blank=True)
    default = models.BooleanField(default=False)

    def __str__(self):
        return f"CV: {self.title}, by {self.student_profile.user.first_name}"


class ApplicationPackage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    cover_letter = models.ForeignKey(CoverLetter, on_delete=models.CASCADE, null=True, blank=True)
    curriculum_vitae = models.ForeignKey(CurriculumVitae, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=100, null=True, blank=True)
    default = models.BooleanField(default=False)

    def __str__(self):
        return f"package: {self.title}, by {self.student_profile.user.first_name}"


# ============= EMPLOYER's Objects ============= #

class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    employer_profile = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE)
    application_packages = models.ManyToManyField(ApplicationPackage, through='Application')

    # Basic Info
    title = models.CharField(max_length=100, null=True, blank=True)
    types = models.CharField(max_length=200, choices=JobType.choices, null=True, blank=True)
    industry = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    short_description = models.TextField(null=True, blank=True)
    num_positions = models.IntegerField(default=1)
    duration = models.DurationField(null=True, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Location
    street_address = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    province_territory = models.CharField(max_length=50, null=True, blank=True)
    postal_code = models.CharField(max_length=50, null=True, blank=True)
    relocation = models.BooleanField(default=False)

    # Dates
    created_at = models.DateField(auto_now_add=True, editable=False)
    deadline = models.DateField(editable=True, null=True, blank=True)

    # Contact Info
    contact_email = models.EmailField(null=True, blank=True)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    website_url = models.URLField(max_length=100, null=True, blank=True)
    company_logo = models.ImageField(upload_to=upload_to, blank=True, null=True)

    def is_job_active(self):
        if self.deadline is not None and self.deadline.__gt__(self.created_at):
            return False
        else:
            return True

    def get_job_types(self):
        return self.types.split(',') if self.types else []

    def __str__(self):
        return f"{self.title}"


class Application(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    status = models.CharField(max_length=200, choices=ApplicationStatus.choices, default=ApplicationStatus.APPLIED, null=True, blank=True)
    updated_at = models.DateField(auto_now=True)

    application_package = models.ForeignKey(ApplicationPackage, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)

    def __str__(self):
        return f"Application by {self.application_package.student_profile.user.first_name} at {self.job}; status: {self.status}"


class StudentNotifications(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_read = models.BooleanField(default=False)

    user_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    COLOR = models.CharField(max_length=20, choices=NotificationColor.choices, default=None, null=True, blank=True)

    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True,)

class EmployerNotifications(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_read=models.BooleanField(default=False)

    user_profile = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE)

    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)