# Generated by Django 4.1.7 on 2023-03-28 18:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='applicationpackage',
            name='student_profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.studentprofile'),
        ),
    ]
