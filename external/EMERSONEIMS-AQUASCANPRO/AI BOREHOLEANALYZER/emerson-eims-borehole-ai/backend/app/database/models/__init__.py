from app.database.session import Base
from .user import User
from .borehole import Analysis, Borehole
from .report import Report
from .payment import Payment
from .feedback import Feedback
from .subscription import Subscription
from .api_key import ApiKey
from .audit_log import AuditLog

# Compatibility aliases for routes that reference old model names
BoreholeSite = Borehole
AnalysisJob = Analysis
SatelliteData = None  # Not yet implemented
WaterQualityPrediction = None  # Stored as JSON in Analysis.water_quality
RiskAssessment = None  # Stored as JSON in Analysis.risk_assessment
CostEstimation = None  # Computed at request time