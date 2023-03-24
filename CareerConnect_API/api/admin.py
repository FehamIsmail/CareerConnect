from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, Employer, Student, StudentProfile, EmployerProfile, Job


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Define admin model for custom User model with no email field."""

    fieldsets = (
        (
            _('Authentication info'),
            {
                'fields': (
                    'email',
                    'password'
                )
            }
        ),
        (
            _('Personal info'),
            {
                'fields': (
                    'first_name',
                    'last_name',
                    'role'
                )
            }
        ),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions'
                )
            }
        ),
        (
            _('Important dates'),
            {
                'fields': (
                    'last_login',
                    'date_joined'
                )
            }
        ),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)


class CustomStudentAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Student.objects.students()


class CustomEmployerAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Employer.objects.employers()


# admin.site.register(User)
admin.site.register(Student, CustomStudentAdmin)
admin.site.register(StudentProfile)
admin.site.register(Employer, CustomEmployerAdmin)
admin.site.register(EmployerProfile)
admin.site.register(Job)