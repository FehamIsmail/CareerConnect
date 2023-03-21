import base64

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import UniqueValidator

from .models import StudentProfile, Application, CoverLetter, CurriculumVitae, User, Student, Employer, EmployerProfile, \
    Job


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
    # curriculum_vitae = serializers.FileField(required=True)
    # title = serializers.CharField(required=True)
    # default = serializers.BooleanField(default=False)
    #
    # def create(self, validated_data):
    #     return CurriculumVitae.objects.create(**validated_data)
    #
    # def update(self, instance, validated_data):
    #     instance.curriculum_vitae = validated_data.__get('')

    class Meta:
        model = CurriculumVitae
        fields = ['id', 'curriculum_vitae', 'title', 'default']


class CLSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverLetter
        fields = ['id', 'cover_letter', 'title', 'default']


class ApplicationSerializer(serializers.ModelSerializer):
    cv = CVSerializer(read_only=True)
    cl = CLSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'package_name', 'cv', 'cl', 'default']


class StudentProfileSerializer(serializers.ModelSerializer):
    # user = UserSerializer(read_only=True)
    # cv = CVSerializer(read_only=True, many=True)
    # cl = CLSerializer(read_only=True, many=True)
    application = ApplicationSerializer(read_only=True, many=True)
    profile_picture = serializers.ImageField(required=False, use_url=False)

    class Meta:
        model = StudentProfile
        fields = ['profile_picture', 'institution', 'education_level', 'field_of_study', 'phone_number', 'country',
                  'province_territory', 'city', 'postal_code', 'street_address', 'relocation', 'application']

    # Returns a base64-encoded string of the image
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('profile_picture'):
            with open('media/' + data['profile_picture'], 'rb') as f:
                encoded_image = base64.b64encode(f.read()).decode('utf-8')
            data['profile_picture'] = encoded_image
        return data


class ProfileSerializer(serializers.ModelSerializer):
    pass


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'types', 'description']


class EmployerProfileSerializer(serializers.ModelSerializer):
    job_set = JobSerializer(many=True, read_only=True)
    profile_picture = serializers.ImageField(required=False, use_url=False)

    class Meta:
        model = EmployerProfile
        fields = ['profile_picture', 'phone_number', 'company', 'job_set']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('profile_picture'):
            with open('media/' + data['profile_picture'], 'rb') as f:
                encoded_image = base64.b64encode(f.read()).decode('utf-8')
            data['profile_picture'] = encoded_image
        return data

