from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime

from app.database.session import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)  # login, analysis.create, report.download, etc.
    resource = Column(String(100), nullable=True)  # analysis, report, user, payment
    resource_id = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 max length
    user_agent = Column(String(500), nullable=True)
    details = Column(Text, nullable=True)
    status = Column(String(20), default="success")  # success, failure, error
    created_at = Column(DateTime, default=datetime.utcnow, index=True)