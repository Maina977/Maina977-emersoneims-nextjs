from sqlalchemy.orm import Session
from app.database.models.analysis import Analysis

class AnalysisRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, image_url: str, results: dict):
        analysis = Analysis(
            user_id=user_id,
            image_url=image_url,
            probability=results.get('probability'),
            recommended_depth=results.get('recommended_depth'),
            estimated_yield=results.get('estimated_yield'),
            results=results
        )
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        return analysis
    
    def get_by_user(self, user_id: int, limit: int = 10, offset: int = 0):
        return self.db.query(Analysis).filter(Analysis.user_id == user_id).offset(offset).limit(limit).all()