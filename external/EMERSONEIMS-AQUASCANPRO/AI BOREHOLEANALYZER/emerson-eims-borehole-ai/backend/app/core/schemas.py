"""
Pydantic Schemas for Request/Response Validation
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime
from enum import Enum


# ============ LOCATION & COORDINATES ============

class LocationQuery(BaseModel):
    """Geographic location query"""
    lat: float = Field(..., ge=-90, le=90, description="Latitude (WGS84)")
    lon: float = Field(..., ge=-180, le=180, description="Longitude (WGS84)")

    class Config:
        schema_extra = {
            "example": {
                "lat": -1.2921,
                "lon": 36.8219  # Nairobi, Kenya
            }
        }


# ============ SATELLITE API ============

class SatelliteResponse(BaseModel):
    """Response from satellite query"""
    location: LocationQuery
    date_range: Dict[str, str]
    sensors: List[str]
    bands_available: List[str]
    data_points: int
    storage_id: int


# ============ SPECTRAL INDICES ============

class IndicesResponse(BaseModel):
    """Response from spectral indices computation"""
    satellite_data_id: int
    indices_computed: int
    major_indices: Dict[str, float]
    storage_id: int


# ============ ANALYSIS REQUEST ============

class AnalysisRequest(BaseModel):
    """Request for comprehensive site analysis"""
    site_name: str = Field(..., max_length=200, description="Unique site identifier")
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    country: Optional[str] = None
    region: Optional[str] = None
    metadata: Optional[Dict] = None


class BoreholeSiteCreate(BaseModel):
    """Create new borehole site record"""
    site_name: str
    latitude: float
    longitude: float
    drilling_depth_m: float
    aquifer_type: Optional[str] = None
    notes: Optional[str] = None


# ============ RISK ASSESSMENT ============

class RiskScoreResponse(BaseModel):
    """Risk assessment results"""
    site_id: int
    geological_risk: float = Field(..., ge=0, le=10)
    contamination_risk: float = Field(..., ge=0, le=10)
    depth_risk: float = Field(..., ge=0, le=10)
    financial_risk: float = Field(..., ge=0, le=10)
    technical_risk: float = Field(..., ge=0, le=10)
    overall_risk: float = Field(..., ge=0, le=10)
    risk_level: str  # HIGH, MEDIUM, LOW
    recommendations: List[str]

    class Config:
        schema_extra = {
            "example": {
                "site_id": 1,
                "geological_risk": 3.5,
                "contamination_risk": 2.1,
                "depth_risk": 4.2,
                "financial_risk": 3.0,
                "technical_risk": 2.8,
                "overall_risk": 3.1,
                "risk_level": "LOW",
                "recommendations": ["Proceed with standard drilling"]
            }
        }


# ============ COST ESTIMATION ============

class CostResponse(BaseModel):
    """Cost estimation response"""
    site_id: int
    depth_m: float
    cost_breakdown: Dict[str, float]
    total_estimated_usd: float
    cost_per_meter: float

    class Config:
        schema_extra = {
            "example": {
                "site_id": 1,
                "depth_m": 80,
                "cost_breakdown": {
                    "mobilization": 500,
                    "drilling": 1200,
                    "equipment": 1000,
                    "testing": 300,
                    "contingency": 640
                },
                "total_estimated_usd": 3640,
                "cost_per_meter": 45.5
            }
        }


# ============ WATER QUALITY ============

class WaterQualityPredicted(BaseModel):
    """Predicted water quality parameter"""
    value: float
    confidence: float = Field(..., ge=0, le=1)
    unit: str
    who_compliant: bool


class WaterQualityResponse(BaseModel):
    """Water quality prediction response"""
    site_id: int
    depth_m: float
    predicted_at: datetime
    tds: WaterQualityPredicted
    fluoride: WaterQualityPredicted
    arsenic: WaterQualityPredicted
    nitrate: WaterQualityPredicted
    iron: WaterQualityPredicted
    overall_potability: str  # SAFE, CAUTION, UNSAFE


# ============ JOB STATUS ============

class JobStatus(str, Enum):
    """Celery job status"""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class JobResponse(BaseModel):
    """Job status response"""
    job_id: int
    status: JobStatus
    progress: int = Field(default=0, ge=0, le=100)
    started_at: datetime
    completed_at: Optional[datetime] = None
    results: Optional[Dict] = None


# ============ GEOLOGICAL ANALYSIS ============

class GeologicalAnalysisResponse(BaseModel):
    """Geological classification response"""
    site_id: int
    aquifer_type: str
    favorability_score: float = Field(..., ge=0, le=100)
    lineament_density: float
    bedrock_depth_m: float
    geological_unit: str
    recommendations: List[str]


# ============ REPORT REQUEST ============

class ReportFormat(str, Enum):
    """Supported report formats"""
    PDF = "pdf"
    DOCX = "docx"
    GEOJSON = "geojson"
    SHAPEFILE = "shapefile"


class ReportRequest(BaseModel):
    """Generate comprehensive analysis report"""
    site_id: int
    format: ReportFormat
    include_sections: List[str] = [
        "executive_summary",
        "geological_analysis",
        "water_quality",
        "risk_assessment",
        "cost_estimation",
        "recommendations"
    ]
    include_maps: bool = True


class ReportResponse(BaseModel):
    """Report generation response"""
    report_id: int
    site_id: int
    format: str
    generated_at: datetime
    download_url: str
    file_size_bytes: int


# ============ API RESPONSES ============

class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SuccessResponse(BaseModel):
    """Generic success response"""
    success: bool
    message: str
    data: Optional[Dict] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class PaginatedResponse(BaseModel):
    """Paginated response"""
    items: List[Dict]
    total: int
    page: int
    per_page: int
    total_pages: int
