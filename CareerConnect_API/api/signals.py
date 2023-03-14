from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Student, Employer, StudentProfile, EmployerProfile, User, CurriculumVitae, CoverLetter, Application


@receiver(post_save, sender=Student)
@receiver(post_save, sender=Employer)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if isinstance(instance, Student) and instance.role == User.Role.STUDENT:
            StudentProfile.objects.create(user=instance)
        elif isinstance(instance, Employer) and instance.role == User.Role.EMPLOYER:
            EmployerProfile.objects.create(user=instance)


@receiver(pre_save, sender=CurriculumVitae)
@receiver(pre_save, sender=CoverLetter)
@receiver(pre_save, sender=Application)
def set_default(sender, instance, **kwargs):
    if instance.default:
        # Set all other instances for the same student as non-default
        sender.objects.filter(student=instance.student_profile).exclude(id=instance.id).update(default=False)
