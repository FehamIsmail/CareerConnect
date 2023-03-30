from django.db import models


class Role(models.TextChoices):
    ADMIN = "ADMIN", 'Admin'
    STUDENT = "STUDENT", 'Student'
    EMPLOYER = "EMPLOYER", 'Employer'


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


class JobType(models.TextChoices):
    FULL_TIME = 'FULL_TIME', 'Full-time'
    PART_TIME = 'PART_TIME', 'Part-time'
    TEMPORARY = 'TEMPORARY', 'Temporary'
    CONTRACT = 'CONTRACT', 'Contract'
    FREELANCE = 'FREELANCE', 'Freelance'
    INTERNSHIP = 'INTERNSHIP', 'Internship'
    VOLUNTEER = 'VOLUNTEER', 'Volunteer'
    SEASONAL = 'SEASONAL', 'Seasonal'
    REMOTE = 'REMOTE', 'Remote'
    CONSULTANT = 'CONSULTANT', 'Consultant'
    EXECUTIVE = 'EXECUTIVE', 'Executive'
    ON_SITE = 'ON_SITE', 'On-site'


class ApplicationStatus(models.TextChoices):
    APPLIED = 'APPLIED', 'Applied'
    INTERVIEW = 'INTERVIEW', 'Interview'
    PROCESSING = 'PROCESSING', 'Processing'
    OFFER = 'OFFER', 'Offer'
    REJECTED = 'REJECTED', 'Rejected'
