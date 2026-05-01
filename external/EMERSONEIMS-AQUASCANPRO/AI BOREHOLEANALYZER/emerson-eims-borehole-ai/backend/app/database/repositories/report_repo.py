from sqlalchemy.orm import Session
from app.database.models.report import Report

class ReportRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, analysis_id: int, user_id: int, title: str, file_url: str):
        report = Report(
            analysis_id=analysis_id,
            user_id=user_id,
            title=title,
            file_url=file_url
        )
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report