import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

logger = logging.getLogger(__name__)

_scheduler = None


def _refresh_job():
    """
    Job function that APScheduler calls every 24 hours.
    Imports SchemeService inside the function to avoid circular imports.
    """
    try:
        from schemes.services.scheme_service import SchemeService
        logger.info("Scheduler: Starting automatic scheme refresh...")
        result = SchemeService.refresh_all_schemes()
        logger.info(
            f"Scheduler: Refresh complete. "
            f"Inserted: {result.get('inserted', 0)}, "
            f"Updated: {result.get('updated', 0)}"
        )
    except Exception as e:
        logger.error(f"Scheduler: Scheme refresh failed: {e}")


def start_scheduler():
    """
    Starts the APScheduler background scheduler.
    Runs the scheme refresh job every 24 hours.
    Also runs an initial refresh 30 seconds after startup.
    """
    global _scheduler

    if _scheduler is not None:
        logger.info("Scheduler already running, skipping start.")
        return

    _scheduler = BackgroundScheduler(daemon=True)

    # Run every 24 hours
    _scheduler.add_job(
        _refresh_job,
        trigger=IntervalTrigger(hours=24),
        id="scheme_refresh_24h",
        name="Refresh Government Schemes (24h)",
        replace_existing=True,
    )

    # Run initial refresh 30 seconds after startup
    from apscheduler.triggers.date import DateTrigger
    import datetime
    initial_run = datetime.datetime.now() + datetime.timedelta(seconds=30)
    _scheduler.add_job(
        _refresh_job,
        trigger=DateTrigger(run_date=initial_run),
        id="scheme_refresh_initial",
        name="Initial Scheme Refresh",
        replace_existing=True,
    )

    _scheduler.start()
    logger.info("APScheduler started: scheme refresh scheduled every 24 hours.")
