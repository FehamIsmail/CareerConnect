from rest_framework import serializers

from .models import StudentProfile, Application, CoverLetter, CurriculumVitae, User, Student, Employer, EmployerProfile


class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.ReadOnlyField()
    last_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']
        read_only_fields = ['first_name', 'last_name']


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role', "password", "confirm_password"]

    def create(self, validated_data):
        user = None
        if validated_data['password'] == validated_data['confirm_password']:
            if validated_data['role'] == User.Role.STUDENT:
                user = Student.objects.create_user(email=validated_data["email"],
                                                   first_name=validated_data["first_name"],
                                                   last_name=validated_data["last_name"],
                                                   role=validated_data["role"],
                                                   password=validated_data["password"]
                                                   )
            elif validated_data['role'] == User.Role.EMPLOYER:
                user = Employer.objects.create_user(email=validated_data["email"],
                                                    first_name=validated_data["first_name"],
                                                    last_name=validated_data["last_name"],
                                                    role=validated_data["role"],
                                                    password=validated_data["password"]
                                                    )
            return user
        else:
            raise serializers.ValidationError({"password": "Passwords must match."})


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


class EmployerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = EmployerProfile
        fields = ['id', 'user', 'organization']
