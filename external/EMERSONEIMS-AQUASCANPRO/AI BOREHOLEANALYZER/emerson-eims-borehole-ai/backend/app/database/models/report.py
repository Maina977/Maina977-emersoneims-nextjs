from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.session import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255))
    file_url = Column(String(500))
    file_path = Column(String(500), nullable=True)
    format = Column(String(20))  # pdf, docx, xlsx, csv, json
    size_bytes = Column(Integer, nullable=True)
    status = Column(String(50), default="generating")  # generating, ready, expired, failed
    error_message = Column(Text, nullable=True)
    download_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    # Relationships
    analysis = relationship("Analysis", back_populates="reports")
    user = relationship("User", back_populates="reports")