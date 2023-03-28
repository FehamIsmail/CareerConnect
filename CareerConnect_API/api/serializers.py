import base64

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import UniqueValidator

from .enums import Role
from .models import StudentProfile, ApplicationPackage, CoverLetter, CurriculumVitae, User, Student, Employer, \
    EmployerProfile, \
    Job, Application


class UniqueEmailValidator(UniqueValidator):
    message = 'A user with this email already exists.'


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[UniqueEmailValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role', 'password', 'confirm_password']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'role': {'required': True},
        }

    def validate(self, attrs):
        limited_access_keys = ["id", "last_login", "is_superuser", "is_staff", "is_active", "date_joined", "groups",
                               "user_permissions"]
        for key in limited_access_keys:
            if key in self.initial_data:
                raise PermissionDenied()
        if 'confirm_password' in attrs and attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords fields do not match."})

        if self.instance:
            old_password = self.context['request'].data.get('old_password')
            if not old_password:
                return attrs
            if not self.instance.check_password(old_password):
                raise serializers.ValidationError({"old_password": "Incorrect old password."})

        return attrs

    def create(self, validated_data):
        user = None
        validated_data.pop('confirm_password')
        if validated_data['role'] == Role.STUDENT:
            user = Student.objects.create_user(
                **validated_data
            )

        elif validated_data['role'] == Role.EMPLOYER:
            user = Employer.objects.create_user(
                **validated_data
            )

        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)

        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
            print("Password changed successfully")

        instance.save()

        return instance


class CVSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumVitae
        exclude = ['student_profile']
        extra_kwargs = {
            'curriculum_vitae': {'required': True},
            'title': {'required': True},
        }


class CLSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverLetter
        exclude = ['student_profile']
        extra_kwargs = {
            'cover_letter': {'required': True},
            'title': {'required': True},
        }


class ApplicationPackageSerializer(serializers.ModelSerializer):
    curriculum_vitae = CVSerializer(read_only=True)
    cover_letter = CLSerializer(read_only=True)
    cv_id = serializers.UUIDField(write_only=True, required=True)
    cl_id = serializers.UUIDField(write_only=True, required=True)

    # application_status = ApplicationStatusSerializer(source='applicationstatus_set', read_only=True, many=True)

    class Meta:
        model = ApplicationPackage
        exclude = ['student_profile']

    def create(self, validated_data):
        cv_id = validated_data.pop('cv_id')
        cl_id = validated_data.pop('cl_id')
        cv = CurriculumVitae.objects.get(id=cv_id)
        cl = CoverLetter.objects.get(id=cl_id)

        package = ApplicationPackage.objects.create(
            student_profile=self.context['request'].user.student_profile,
            curriculum_vitae=cv,
            cover_letter=cl,
            **validated_data)
        return package

    def update(self, instance, validated_data):
        cv_id = validated_data.pop('cv_id')
        cl_id = validated_data.pop('cl_id')
        cv = CurriculumVitae.objects.get(id=cv_id)
        cl = CoverLetter.objects.get(id=cl_id)
        instance.curriculum_vitae = cv
        instance.cover_letter = cl
        instance.title = validated_data.get('title', instance.title)
        instance.default = validated_data.get('default', instance.default)
        instance.save()

        return instance


class JobSerializerForStudent(serializers.ModelSerializer):
    company_logo = serializers.ImageField(required=False)

    class Meta:
        model = Job
        exclude = ['employer_profile', 'application_packages']


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializerForStudent(read_only=True)
    application_package = ApplicationPackageSerializer(read_only=True)
    package_id = serializers.UUIDField(write_only=True, required=True)

    # good for isma
    class Meta:
        model = Application
        fields = '__all__'

    def validate(self, attrs):
        job_id = self.context['request'].parser_context['kwargs']['pk']
        student_profile = self.context['request'].user.student_profile

        # Check if there is already an Application instance for the student and the job
        if Application.objects.filter(job_id=job_id, application_package__student_profile=student_profile).exists():
            raise serializers.ValidationError({'application': 'You have already applied to this job.'})

        return attrs

    def create(self, validated_data):
        job_id = self.context['request'].parser_context['kwargs']['pk']
        package_id = validated_data.pop('package_id')

        job = Job.objects.get(id=job_id)
        package = ApplicationPackage.objects.get(id=package_id)
        application = Application.objects.create(job=job, application_package=package)
        return application


class JobSerializer(serializers.ModelSerializer):
    application_packages = ApplicationPackageSerializer(read_only=True, many=True)
    company_logo = serializers.ImageField(required=False)
    application = ApplicationSerializer(source='application_set', read_only=True, many=True)

    class Meta:
        model = Job
        exclude = ['employer_profile']


class StudentProfileSerializer(serializers.ModelSerializer):
    # application = ApplicationSerializer(read_only=True, many=True)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = StudentProfile
        exclude = ['user']


class EmployerProfileSerializer(serializers.ModelSerializer):
    job_set = JobSerializer(many=True, read_only=True)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = EmployerProfile
        exclude = ['user']
