from celery import Celery
from app.config import Config

celery_app = Celery(
    "borehole_ai",
    broker=Config.CELERY_BROKER_URL,
    backend=Config.CELERY_RESULT_BACKEND
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
)

class TaskQueue:
    @staticmethod
    def send_analysis_task(analysis_id: int, image_url: str):
        return celery_app.send_task(
            "tasks.analysis.process_analysis",
            args=[analysis_id, image_url]
        )
    
    @staticmethod
    def send_report_task(report_id: str, analysis_data: dict):
        return celery_app.send_task(
            "tasks.report.generate_report",
            args=[report_id, analysis_data]
        )