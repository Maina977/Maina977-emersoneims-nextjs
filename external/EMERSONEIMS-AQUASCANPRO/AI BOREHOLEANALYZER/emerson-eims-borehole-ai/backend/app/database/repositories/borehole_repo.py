from sqlalchemy.orm import Session
from app.database.models.borehole import Borehole

class BoreholeRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_nearby(self, latitude: float, longitude: float, radius_km: float = 10):
        # Simplified - would use PostGIS in production
        return self.db.query(Borehole).limit(10).all()
    
    def create(self, data: dict):
        borehole = Borehole(**data)
        self.db.add(borehole)
        self.db.commit()
        self.db.refresh(borehole)
        return borehole