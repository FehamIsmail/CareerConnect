from django.apps import AppConfig
from django.db.models.signals import post_save, pre_save


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import api.signals
