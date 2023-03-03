from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import StudentProfile, Application, CoverLetter, CurriculumVitae, User, Student, Employer, EmployerProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = ['email', 'first_name', 'last_name', 'role']
        fields = '__all__'


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
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
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords fields didn't match."})
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
            user = Student.objects.create_user(
                email=validated_data["email"],
                first_name=validated_data["first_name"],
                last_name=validated_data["last_name"],
                role=User.Role.EMPLOYER,
                password=validated_data["password"]
            )

        return user


class CVSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumVitae
        fields = ['id', 'title']


class CLSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverLetter
        fields = ['id', 'title']


class ApplicationSerializer(serializers.ModelSerializer):
    cv = CVSerializer(read_only=True)
    cl = CLSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'package_name', 'cv', 'cl']


class StudentProfileSerializer(serializers.ModelSerializer):
    # user = UserSerializer(read_only=True)
    # cv = CVSerializer(read_only=True, many=True)
    # cl = CLSerializer(read_only=True, many=True)
    # application = ApplicationSerializer(read_only=True, many=True)

    class Meta:
        model = StudentProfile
        fields = ['id', 'student_id', 'education', 'user', 'cv', 'cl', 'application']


class EmployerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EmployerProfile
        fields = ['id', 'user', 'organization']
