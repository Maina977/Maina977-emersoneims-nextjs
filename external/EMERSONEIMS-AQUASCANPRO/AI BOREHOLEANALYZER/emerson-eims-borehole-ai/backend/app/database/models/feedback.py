from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.session import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=True, index=True)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    actual_depth_m = Column(Float, nullable=True)
    actual_yield_m3h = Column(Float, nullable=True)
    borehole_success = Column(String(20), nullable=True)  # success, partial, dry
    response = Column(Text, nullable=True)  # admin response
    status = Column(String(50), default="submitted")  # submitted, reviewed, resolved
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="feedbacks")
    analysis = relationship("Analysis", back_populates="feedbacks")