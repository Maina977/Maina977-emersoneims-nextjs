from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    probability = Column(Float)
    recommended_depth = Column(Float)
    estimated_yield = Column(Float)
    results = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)