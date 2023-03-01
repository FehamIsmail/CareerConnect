from rest_framework import serializers

from .models import StudentProfile, Application, CoverLetter, CurriculumVitae, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']


class RegistrationSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role', "password"]

    def create(self, validated_data):
        user = User.objects.create_user(email=validated_data["email"],
                                        first_name= validated_data["first_name"],
                                        last_name=validated_data["last_name"],
                                        role=validated_data["role"],
                                        password= validated_data["password"]
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
    user = UserSerializer(read_only=True)
    cv = CVSerializer(read_only=True, many=True)
    cl = CLSerializer(read_only=True, many=True)
    application = ApplicationSerializer(read_only=True, many=True)

    class Meta:
        model = StudentProfile
        fields = ['id', 'student_id', 'education', 'user', 'cv', 'cl', 'application']
