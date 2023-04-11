# Generated by Django 4.1.7 on 2023-04-09 02:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_applicationpackage_student_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='status',
            field=models.CharField(blank=True, choices=[('APPLIED', 'Applied'), ('INTERVIEW', 'Interview'), ('PROCESSING', 'Processing'), ('OFFER', 'Offer'), ('REJECTED', 'Rejected')], default='APPLIED', max_length=200, null=True),
        ),
    ]
