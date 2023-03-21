import uuid
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


# https://rahmanfadhil.com/django-login-with-email/ Login with email or username
def upload_to(instance, filename):
    return f'images/{filename}'


class CustomQuerySet(models.QuerySet):
    def students(self):
        return self.filter(role=User.Role.STUDENT)

    def employers(self):
        return self.filter(role=User.Role.EMPLOYER)

    def admins(self):
        return self.filter(role=User.Role.ADMIN)


# Base User model
class UserManager(BaseUserManager):
    def create_user(self, email, role, password=None, **extra_fields):
        """
        Creates and saves a User with the given email, role, and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
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
        return self.create_user(email=email, password=password, role=User.Role.ADMIN, **extra_fields)

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

    class Role(models.TextChoices):
        ADMIN = "ADMIN", 'Admin'
        STUDENT = "STUDENT", 'Student'
        EMPLOYER = "EMPLOYER", 'Employer'

    role = models.CharField(max_length=50, choices=Role.choices)


class Student(User):
    class Meta:
        proxy = True

    def welcome(self):
        return f'Hi {self.first_name}! Welcome to CareerConnect Student interface!'


class Employer(User):
    class Meta:
        proxy = True

    def welcome(self):
        return f'Hi {self.first_name}! Welcome to CareerConnect Employer interface!'


class EmployerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    profile_picture = models.ImageField(upload_to=upload_to, blank=True, null=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)

    # Profile Info
    # user.first_name
    # user.last_name
    company = models.CharField(max_length=100, null=True, blank=True)


class StudentProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    profile_picture = models.ImageField(upload_to=upload_to, blank=True, null=True)

    # Profile Info
    # user.first_name
    # user.last_name
    # headline = models.TextField(null=True, blank=True)  # 1 sentence under name
    # bio = models.TextField(null=True, blank=True)  # describing text

    # Academic Info
    institution = models.CharField(max_length=100, null=True, blank=True)

    class EducationLevel(models.TextChoices):
        SECONDARY_SCHOOL = 'SS', 'Secondary School'
        HIGH_SCHOOL = 'HS', 'High School'
        BACHELOR = 'BA', 'Bachelor'
        MASTER = 'MA', 'Master'
        DOCTORATE = 'PHD', 'Doctorate'
        CERTIFICATE = 'CERT', 'Certificate'
        DIPLOMA = 'DIP', 'Diploma'
        ASSOCIATE = 'AA', 'Associate'
        POSTGRADUATE = 'PG', 'Postgraduate'
        PROFESSIONAL = 'PROF', 'Professional'
        SPECIALIZATION = 'SPEC', 'Specialization'
    education_level = models.CharField(max_length=4, choices=EducationLevel.choices)

    # Contact Information
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    # show_number = models.BooleanField(default=False)
    # contact_email = models.EmailField(null=True, blank=True)

    # Location
    country = models.CharField(max_length=50, null=True, blank=True)
    province_territory = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    postal_code = models.CharField(max_length=50, null=True, blank=True)
    street_address = models.CharField(max_length=50, null=True, blank=True)
    relocation = models.BooleanField(default=False)


# ============= STUDENT's Objects ============= #
class CoverLetter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='cl', null=True, blank=True)
    cover_letter = models.FileField(null=True, blank=True)

    title = models.CharField(max_length=100, null=True, blank=True)
    default = models.BooleanField(default=False)


class CurriculumVitae(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='cv', null=True, blank=True)
    curriculum_vitae = models.FileField(null=True, blank=True)

    title = models.CharField(max_length=100, null=True, blank=True)
    default = models.BooleanField(default=False)


class Application(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_profile = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='application')
    cover_letter = models.ForeignKey(CoverLetter, on_delete=models.CASCADE, null=True, blank=True)
    curriculum_vitae = models.ForeignKey(CurriculumVitae, on_delete=models.CASCADE)
    package_name = models.CharField(max_length=100, null=True, blank=True)
    default = models.BooleanField(default=False)


# ============= EMPLOYER's Objects ============= #

class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    JOB_TYPE_CHOICES = (
        ('FULL_TIME', 'Full-time'),
        ('PART_TIME', 'Part-time'),
        ('TEMPORARY', 'Temporary'),
        ('CONTRACT', 'Contract'),
        ('FREELANCE', 'Freelance'),
        ('INTERNSHIP', 'Internship'),
        ('VOLUNTEER', 'Volunteer'),
        ('SEASONAL', 'Seasonal'),
        ('REMOTE', 'Remote'),
        ('CONSULTANT', 'Consultant'),
        ('EXECUTIVE', 'Executive'),
        ('ON_SITE', 'On-site'),
    )
    employer = models.ForeignKey(EmployerProfile, on_delete=models.CASCADE)
    applications = models.ManyToManyField(Application)

    # Basic Info
    title = models.CharField(max_length=100, null=True, blank=True)
    types = models.CharField(max_length=200, choices=JOB_TYPE_CHOICES, null=True, blank=True)
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
    """
        This method and is_active are used for Celery to update the 'is_active' field of jobs based on the expiration date.
        They will stay commented out until the proper hosting is set up to run Celery tasks.
    """

    # is_active = models.BooleanField(default=True)
    # def update_active_status(self):
    #     if self.expire_at is not None and self.expire_at.__gt__(self.created_at):
    #         self.is_active = False
    #         self.save()
    #     return self.is_active
    def is_job_active(self):
        if self.deadline is not None and self.deadline.__gt__(self.created_at):
            return False
        else:
            return True

    def get_job_types(self):
        return self.types.split(',') if self.types else []


