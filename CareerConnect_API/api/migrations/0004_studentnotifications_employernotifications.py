# Generated by Django 4.1.7 on 2023-04-10 21:42

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_application_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentNotifications',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('is_read', models.BooleanField(default=False)),
                ('COLOR', models.CharField(blank=True, choices=[('RED', 'Red'), ('BLUE', 'Blue'), ('GREEN', 'Green')], default=None, max_length=20, null=True)),
                ('message', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.studentprofile')),
            ],
        ),
        migrations.CreateModel(
            name='EmployerNotifications',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('is_read', models.BooleanField(default=False)),
                ('message', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.employerprofile')),
            ],
        ),
    ]