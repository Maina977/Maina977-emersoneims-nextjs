import logging
import os
import platform
from datetime import datetime

from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task
def health_check():
    """
    Periodic health check — verifies database, Redis, and disk availability.

    Returns a structured status dict for monitoring dashboards.
    """
    import shutil

    status = {
        "timestamp": datetime.utcnow().isoformat(),
        "hostname": platform.node(),
        "checks": {},
        "overall": "healthy",
    }

    # --- Database connectivity ---
    try:
        from app.database.session import SessionLocal
        db = SessionLocal()
        db.execute("SELECT 1")  # type: ignore[arg-type]
        db.close()
        status["checks"]["database"] = {"status": "ok"}
    except Exception as e:
        status["checks"]["database"] = {"status": "error", "detail": str(e)[:200]}
        status["overall"] = "degraded"

    # --- Redis / Celery broker ---
    try:
        from app.workers.celery_app import celery_app as app
        insp = app.control.inspect(timeout=5)
        active = insp.active()
        worker_count = len(active) if active else 0
        status["checks"]["celery"] = {"status": "ok", "workers": worker_count}
    except Exception as e:
        status["checks"]["celery"] = {"status": "error", "detail": str(e)[:200]}
        status["overall"] = "degraded"

    # --- Disk space ---
    try:
        usage = shutil.disk_usage("/")
        free_gb = usage.free / (1024 ** 3)
        total_gb = usage.total / (1024 ** 3)
        status["checks"]["disk"] = {
            "status": "ok" if free_gb > 1 else "warning",
            "free_gb": round(free_gb, 2),
            "total_gb": round(total_gb, 2),
            "usage_pct": round((usage.used / usage.total) * 100, 1),
        }
        if free_gb < 1:
            status["overall"] = "degraded"
    except Exception as e:
        status["checks"]["disk"] = {"status": "error", "detail": str(e)[:200]}

    # --- Memory ---
    try:
        import resource
        mem_usage_mb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024
        status["checks"]["memory"] = {"status": "ok", "worker_rss_mb": round(mem_usage_mb, 1)}
    except (ImportError, AttributeError):
        # resource module not available on Windows
        status["checks"]["memory"] = {"status": "ok", "detail": "resource module unavailable"}

    logger.info(f"Health check: {status['overall']} — db={status['checks'].get('database', {}).get('status')}")
    return status


@celery_app.task
def collect_metrics():
    """
    Collect application metrics for Prometheus/Grafana.

    Returns counts of analyses, users, etc. from the database.
    """
    try:
        from sqlalchemy import func
        from app.database.session import SessionLocal
        from app.database.models.user import User
        from app.database.models.borehole import Analysis

        db = SessionLocal()
        try:
            metrics = {
                "timestamp": datetime.utcnow().isoformat(),
                "total_users": db.query(func.count(User.id)).scalar() or 0,
                "active_users": db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0,
                "total_analyses": db.query(func.count(Analysis.id)).scalar() or 0,
                "completed_analyses": db.query(func.count(Analysis.id)).filter(Analysis.status == "completed").scalar() or 0,
                "failed_analyses": db.query(func.count(Analysis.id)).filter(Analysis.status == "failed").scalar() or 0,
            }
            return metrics
        finally:
            db.close()

    except Exception as e:
        logger.error(f"Metrics collection failed: {e}")
        return {"error": str(e)[:200]}
