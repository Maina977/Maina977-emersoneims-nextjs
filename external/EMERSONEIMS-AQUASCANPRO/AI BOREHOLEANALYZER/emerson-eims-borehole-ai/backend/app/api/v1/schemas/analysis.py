from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AnalysisRequest(BaseModel):
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AnalysisResponse(BaseModel):
    id: int
    probability: float
    recommended_depth: float
    estimated_yield: float
    site_type: str
    soil_type: str
    water_quality_score: float
    risk_score: float
    created_at: datetime