import os
from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)


class SchemesConfig(AppConfig):
    name = 'schemes'
    verbose_name = 'Government Schemes'

    def ready(self):
        """
        Start the APScheduler when the Django app is ready.
        Only start in the main process (not in the reloader child process).
        """
        # Prevent double-start when Django reloader forks a child process
        if os.environ.get('RUN_MAIN') == 'true':
            try:
                from schemes.scheduler import start_scheduler
                start_scheduler()
            except Exception as e:
                logger.error(f"Failed to start scheme scheduler: {e}")
