from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.session import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=True)
    probability = Column(Float, nullable=True)
    confidence = Column(Float, nullable=True)
    recommended_depth_m = Column(Float, nullable=True)
    estimated_yield_m3h = Column(Float, nullable=True)
    soil_type = Column(String(100), nullable=True)
    water_quality = Column(JSON, nullable=True)
    risk_assessment = Column(JSON, nullable=True)
    geophysics_data = Column(JSON, nullable=True)
    ensemble_sources = Column(Integer, default=0)
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    error_message = Column(Text, nullable=True)
    processing_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    reports = relationship("Report", back_populates="analysis", lazy="dynamic")
    feedbacks = relationship("Feedback", back_populates="analysis", lazy="dynamic")


class Borehole(Base):
    __tablename__ = "boreholes"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=True, index=True)
    location_name = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    drilled_depth_m = Column(Float, nullable=True)
    static_water_level_m = Column(Float, nullable=True)
    yield_m3h = Column(Float, nullable=True)
    water_quality = Column(JSON, nullable=True)
    success = Column(Boolean, nullable=True)
    drilling_date = Column(DateTime, nullable=True)
    geophysical_methods = Column(JSON, nullable=True)  # list of method names used
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)