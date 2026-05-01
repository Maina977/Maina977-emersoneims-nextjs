import logging
import os
import shutil
from datetime import datetime

from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)

BACKUP_DIR = os.getenv("BACKUP_DIR", "/tmp/borehole_backups")


@celery_app.task
def backup_database():
    """
    Create a database backup.

    For SQLite: copies the DB file.
    For PostgreSQL: would invoke pg_dump.
    """
    from app.config import Config

    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")

    db_url = Config.DATABASE_URL

    if db_url.startswith("sqlite"):
        # Extract path from sqlite:///./borehole.db
        db_path = db_url.replace("sqlite:///", "").replace("sqlite://", "")
        if not os.path.isabs(db_path):
            db_path = os.path.join(os.getcwd(), db_path)

        if os.path.exists(db_path):
            backup_path = os.path.join(BACKUP_DIR, f"borehole_{timestamp}.db")
            shutil.copy2(db_path, backup_path)
            size = os.path.getsize(backup_path)
            logger.info(f"SQLite backup created: {backup_path} ({size} bytes)")
            return {"status": "completed", "path": backup_path, "size_bytes": size}
        else:
            logger.warning(f"Database file not found: {db_path}")
            return {"status": "skipped", "reason": "db_file_not_found"}

    elif "postgresql" in db_url:
        # pg_dump backup
        backup_path = os.path.join(BACKUP_DIR, f"borehole_{timestamp}.sql")
        try:
            import subprocess
            # Parse connection info from URL
            # postgresql://user:pass@host:port/dbname
            result = subprocess.run(
                ["pg_dump", "--no-owner", "--no-acl", "-f", backup_path, db_url],
                capture_output=True,
                text=True,
                timeout=300,
            )
            if result.returncode == 0:
                size = os.path.getsize(backup_path)
                logger.info(f"PostgreSQL backup created: {backup_path} ({size} bytes)")
                return {"status": "completed", "path": backup_path, "size_bytes": size}
            else:
                logger.error(f"pg_dump failed: {result.stderr}")
                return {"status": "failed", "error": result.stderr[:500]}
        except FileNotFoundError:
            logger.warning("pg_dump not found — skipping PostgreSQL backup")
            return {"status": "skipped", "reason": "pg_dump_not_installed"}
        except Exception as e:
            logger.error(f"Backup failed: {e}")
            return {"status": "failed", "error": str(e)[:500]}

    else:
        logger.warning(f"Unsupported database type for backup: {db_url[:20]}...")
        return {"status": "skipped", "reason": "unsupported_db_type"}


@celery_app.task
def cleanup_old_backups(max_age_days: int = 30):
    """Remove backup files older than max_age_days."""
    import glob
    from datetime import timedelta

    cutoff = datetime.utcnow() - timedelta(days=max_age_days)
    removed = 0

    for filepath in glob.glob(os.path.join(BACKUP_DIR, "borehole_*")):
        try:
            mtime = datetime.utcfromtimestamp(os.path.getmtime(filepath))
            if mtime < cutoff:
                os.remove(filepath)
                removed += 1
        except OSError as e:
            logger.warning(f"Failed to remove old backup {filepath}: {e}")

    logger.info(f"Cleaned up {removed} old backup files")
    return {"removed": removed}
