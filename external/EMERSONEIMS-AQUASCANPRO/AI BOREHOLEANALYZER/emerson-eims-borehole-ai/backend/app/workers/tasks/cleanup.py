from app.workers.celery_app import celery_app
from datetime import datetime, timedelta
import os
import shutil

@celery_app.task
def cleanup_old_files(days=30):
    """Clean up old analysis files and temporary data"""
    cutoff_date = datetime.now() - timedelta(days=days)
    
    # Clean up temp directory
    temp_dir = "/tmp/borehole_ai"
    if os.path.exists(temp_dir):
        for filename in os.listdir(temp_dir):
            filepath = os.path.join(temp_dir, filename)
            if os.path.getctime(filepath) < cutoff_date.timestamp():
                os.remove(filepath)
    
    # Clean up old reports
    reports_dir = "/app/reports"
    if os.path.exists(reports_dir):
        for filename in os.listdir(reports_dir):
            filepath = os.path.join(reports_dir, filename)
            if os.path.getctime(filepath) < cutoff_date.timestamp():
                os.remove(filepath)
    
    return {"status": "completed", "deleted_count": 0}

@celery_app.task
def cleanup_old_analyses():
    """Mark old analyses as archived"""
    from app.database.session import SessionLocal
    from app.database.models.analysis import Analysis
    
    db = SessionLocal()
    try:
        cutoff_date = datetime.now() - timedelta(days=90)
        old_analyses = db.query(Analysis).filter(Analysis.created_at < cutoff_date).all()
        
        for analysis in old_analyses:
            analysis.status = "archived"
        
        db.commit()
        return {"status": "completed", "archived_count": len(old_analyses)}
    finally:
        db.close()