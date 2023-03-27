# Generated by Django 4.1.7 on 2023-03-27 20:39

import api.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email address')),
                ('role', models.CharField(choices=[('ADMIN', 'Admin'), ('STUDENT', 'Student'), ('EMPLOYER', 'Employer')], max_length=50)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(blank=True, choices=[('APPLIED', 'Applied'), ('INTERVIEW', 'Interview'), ('PROCESSING', 'Processing'), ('OFFER', 'Offer'), ('REJECTED', 'Rejected'), ('WAITLIST', 'Waitlist')], default='APPLIED', max_length=200, null=True)),
                ('updated_at', models.DateField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='ApplicationPackage',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(blank=True, max_length=100, null=True)),
                ('default', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='EmployerProfile',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to=api.models.upload_to)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('company', models.CharField(blank=True, max_length=100, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='employer_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StudentProfile',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to=api.models.upload_to)),
                ('institution', models.CharField(blank=True, max_length=100, null=True)),
                ('field_of_study', models.CharField(blank=True, max_length=100, null=True)),
                ('education_level', models.CharField(choices=[('SS', 'Secondary School'), ('HS', 'High School'), ('BA', 'Bachelor'), ('MA', 'Master'), ('PHD', 'Doctorate'), ('CERT', 'Certificate'), ('DIP', 'Diploma'), ('AA', 'Associate'), ('PG', 'Postgraduate'), ('PROF', 'Professional'), ('SPEC', 'Specialization')], max_length=4)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('country', models.CharField(blank=True, max_length=50, null=True)),
                ('province_territory', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('postal_code', models.CharField(blank=True, max_length=50, null=True)),
                ('street_address', models.CharField(blank=True, max_length=50, null=True)),
                ('relocation', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='student_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(blank=True, max_length=100, null=True)),
                ('types', models.CharField(blank=True, choices=[('FULL_TIME', 'Full-time'), ('PART_TIME', 'Part-time'), ('TEMPORARY', 'Temporary'), ('CONTRACT', 'Contract'), ('FREELANCE', 'Freelance'), ('INTERNSHIP', 'Internship'), ('VOLUNTEER', 'Volunteer'), ('SEASONAL', 'Seasonal'), ('REMOTE', 'Remote'), ('CONSULTANT', 'Consultant'), ('EXECUTIVE', 'Executive'), ('ON_SITE', 'On-site')], max_length=200, null=True)),
                ('industry', models.CharField(blank=True, max_length=100, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('short_description', models.TextField(blank=True, null=True)),
                ('num_positions', models.IntegerField(default=1)),
                ('duration', models.DurationField(blank=True, null=True)),
                ('salary', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('street_address', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('province_territory', models.CharField(blank=True, max_length=50, null=True)),
                ('postal_code', models.CharField(blank=True, max_length=50, null=True)),
                ('relocation', models.BooleanField(default=False)),
                ('created_at', models.DateField(auto_now_add=True)),
                ('deadline', models.DateField(blank=True, null=True)),
                ('contact_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('contact_phone', models.CharField(blank=True, max_length=20, null=True)),
                ('website_url', models.URLField(blank=True, max_length=100, null=True)),
                ('company_logo', models.ImageField(blank=True, null=True, upload_to=api.models.upload_to)),
                ('application_packages', models.ManyToManyField(through='api.Application', to='api.applicationpackage')),
                ('employer_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.employerprofile')),
            ],
        ),
        migrations.CreateModel(
            name='CurriculumVitae',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('curriculum_vitae', models.FileField(blank=True, null=True, upload_to='')),
                ('title', models.CharField(blank=True, max_length=100, null=True)),
                ('default', models.BooleanField(default=False)),
                ('student_profile', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cv', to='api.studentprofile')),
            ],
        ),
        migrations.CreateModel(
            name='CoverLetter',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('cover_letter', models.FileField(blank=True, null=True, upload_to='')),
                ('title', models.CharField(blank=True, max_length=100, null=True)),
                ('default', models.BooleanField(default=False)),
                ('student_profile', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cl', to='api.studentprofile')),
            ],
        ),
        migrations.AddField(
            model_name='applicationpackage',
            name='cover_letter',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.coverletter'),
        ),
        migrations.AddField(
            model_name='applicationpackage',
            name='curriculum_vitae',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.curriculumvitae'),
        ),
        migrations.AddField(
            model_name='applicationpackage',
            name='student_profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='application', to='api.studentprofile'),
        ),
        migrations.AddField(
            model_name='application',
            name='application_package',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.applicationpackage'),
        ),
        migrations.AddField(
            model_name='application',
            name='job',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.job'),
        ),
        migrations.CreateModel(
            name='Employer',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('api.user',),
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('api.user',),
        ),
    ]
