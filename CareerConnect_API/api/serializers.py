import base64

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import UniqueValidator

from .models import StudentProfile, Application, CoverLetter, CurriculumVitae, User, Student, Employer, EmployerProfile, \
    Job, ApplicationStatus


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
        if validated_data['role'] == User.Role.STUDENT:
            user = Student.objects.create_user(
                email=validated_data["email"],
                first_name=validated_data["first_name"],
                last_name=validated_data["last_name"],
                role=User.Role.STUDENT,
                password=validated_data["password"]
            )

        elif validated_data['role'] == User.Role.EMPLOYER:
            user = Employer.objects.create_user(
                email=validated_data["email"],
                first_name=validated_data["first_name"],
                last_name=validated_data["last_name"],
                role=User.Role.EMPLOYER,
                password=validated_data["password"]
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
    curriculum_vitae = serializers.FileField(required=False)

    class Meta:
        model = CurriculumVitae
        exclude = ['student_profile']


class CLSerializer(serializers.ModelSerializer):
    cover_letter = serializers.FileField(required=False)

    class Meta:
        model = CoverLetter
        exclude = ['student_profile']


class ApplicationSerializer(serializers.ModelSerializer):
    cv = CVSerializer(read_only=True)
    cl = CLSerializer(read_only=True)

    class Meta:
        model = Application
        exclude = ['student_profile']


class StudentProfileSerializer(serializers.ModelSerializer):
    # application = ApplicationSerializer(read_only=True, many=True)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = StudentProfile
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    applications = ApplicationSerializer(many=True, read_only=True)
    company_logo = serializers.ImageField(required=False)

    class Meta:
        model = Job
        exclude = ['employer']


class JobSerializerForStudent(serializers.ModelSerializer):
    company_logo = serializers.ImageField(required=False)

    class Meta:
        model = Job
        exclude = ['employer', 'applications']


class EmployerProfileSerializer(serializers.ModelSerializer):
    job_set = JobSerializer(many=True, read_only=True)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = EmployerProfile
        fields = ['profile_picture', 'phone_number', 'company', 'job_set']


class ApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model=ApplicationStatus
        fields="__all__"