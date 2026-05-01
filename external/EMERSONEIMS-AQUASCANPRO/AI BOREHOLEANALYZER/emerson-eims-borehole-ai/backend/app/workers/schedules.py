from celery.schedules import crontab
from app.workers.celery_app import celery_app

celery_app.conf.beat_schedule = {
    'cleanup-temp-files-daily': {
        'task': 'app.workers.tasks.cleanup.cleanup_old_files',
        'schedule': crontab(hour=2, minute=0),
        'args': (30,)
    },
    'cleanup-old-analyses-weekly': {
        'task': 'app.workers.tasks.cleanup.cleanup_old_analyses',
        'schedule': crontab(day_of_week=0, hour=3, minute=0),
    },
    'retrain-models-monthly': {
        'task': 'app.workers.tasks.training.schedule_model_retraining',
        'schedule': crontab(day_of_month=1, hour=4, minute=0),
    },
    'health-check-hourly': {
        'task': 'app.workers.tasks.monitoring.health_check',
        'schedule': crontab(minute=0),
    },
    'backup-database-daily': {
        'task': 'app.workers.tasks.backup.backup_database',
        'schedule': crontab(hour=1, minute=0),
    }
}