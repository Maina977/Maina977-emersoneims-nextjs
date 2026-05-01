from celery import Celery
from app.config import Config

celery_app = Celery(
    "borehole_ai",
    broker=Config.CELERY_BROKER_URL,
    backend=Config.CELERY_RESULT_BACKEND,
    include=[
        "app.workers.tasks.analysis",
        "app.workers.tasks.report",
        "app.workers.tasks.email",
        "app.workers.tasks.satellite",
        "app.workers.tasks.satellite_download",
        "app.workers.tasks.cleanup",
        "app.workers.tasks.training",
        "app.workers.tasks.monitoring",
        "app.workers.tasks.backup",
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,
    task_soft_time_limit=25 * 60,
    worker_max_tasks_per_child=100,
    worker_prefetch_multiplier=1,
)