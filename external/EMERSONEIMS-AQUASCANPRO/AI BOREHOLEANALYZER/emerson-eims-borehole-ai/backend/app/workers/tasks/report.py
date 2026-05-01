import json
import logging
import os
from datetime import datetime, timedelta

from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)

REPORT_DIR = os.getenv("REPORT_DIR", "/tmp/borehole_reports")


@celery_app.task(bind=True)
def generate_report(self, report_id: int, analysis_data: dict, format: str = "pdf"):
    """
    Generate a downloadable report from analysis results.

    Supports PDF, CSV, and JSON export.
    """
    from app.database.session import SessionLocal
    from app.database.models.report import Report

    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            logger.error(f"Report {report_id} not found")
            return {"status": "error", "detail": "Report not found"}

        self.update_state(state="PROGRESS", meta={"current": 10, "total": 100, "step": "preparing"})

        os.makedirs(REPORT_DIR, exist_ok=True)
        filename = f"report_{report_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

        if format == "json":
            filepath = os.path.join(REPORT_DIR, f"{filename}.json")
            with open(filepath, "w") as f:
                json.dump(analysis_data, f, indent=2, default=str)

        elif format == "csv":
            import csv
            filepath = os.path.join(REPORT_DIR, f"{filename}.csv")
            with open(filepath, "w", newline="") as f:
                writer = csv.writer(f)
                writer.writerow(["Parameter", "Value"])
                for key, val in analysis_data.items():
                    writer.writerow([key, val])

        else:
            # PDF — generate a structured text report (real PDF requires reportlab/weasyprint)
            filepath = os.path.join(REPORT_DIR, f"{filename}.txt")
            with open(filepath, "w") as f:
                f.write("=" * 60 + "\n")
                f.write("BOREHOLE AI ANALYSIS REPORT\n")
                f.write("=" * 60 + "\n\n")
                f.write(f"Report ID: {report_id}\n")
                f.write(f"Generated: {datetime.utcnow().isoformat()}\n")
                f.write(f"DESKTOP ESTIMATE — field validation required\n\n")
                for key, val in analysis_data.items():
                    f.write(f"{key}: {val}\n")
                f.write("\n" + "=" * 60 + "\n")

        self.update_state(state="PROGRESS", meta={"current": 80, "total": 100, "step": "saving"})

        file_size = os.path.getsize(filepath)
        report.file_path = filepath
        report.file_url = f"/api/v1/export/report/{report_id}/pdf"
        report.size_bytes = file_size
        report.status = "ready"
        report.expires_at = datetime.utcnow() + timedelta(days=30)
        db.commit()

        logger.info(f"Report {report_id} generated: {filepath} ({file_size} bytes)")
        return {
            "report_id": report_id,
            "file_path": filepath,
            "size_bytes": file_size,
            "status": "ready",
        }

    except Exception as e:
        logger.exception(f"Report {report_id} generation failed: {e}")
        if report:
            report.status = "failed"
            report.error_message = str(e)[:500]
            db.commit()
        raise
    finally:
        db.close()