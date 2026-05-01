"""
Database models for Borehole AI System
Includes: Sites, water quality, risk assessment, historical records
"""

from sqlalchemy import (
    Column, Integer, Float, String, DateTime, Boolean, JSON,
    ForeignKey, Text, TIMESTAMP, Enum
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from datetime import datetime
import enum

Base = declarative_base()


class BoreholeSite(Base):
    """Core borehole analysis site record"""
    __tablename__ = "borehole_sites"

    id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String(255), index=True)
    user_id = Column(String(255), index=True)
    
    # Geospatial location (WGS84 - EPSG:4326)
    location = Column(Geometry('POINT', srid=4326), nullable=False, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Site metadata
    address = Column(Text)
    country = Column(String(100))
    region = Column(String(100))
    
    # ANALYSIS RESULTS
    # Predictions
    probability = Column(Float, default=0.0)  # 0-1 success probability
    recommended_depth_m = Column(Float)
    estimated_yield_m3h = Column(Float)
    estimated_cost_usd = Column(Float)
    
    # Geology
    aquifer_type = Column(String(50))  # 'confined', 'unconfined', 'karst'
    lithology = Column(JSON)  # List of rock types
    porosity_fraction = Column(Float)  # 0-1
    transmissivity_m2day = Column(Float)
    storage_coefficient = Column(Float)
    
    # Topography & Hydrology
    elevation_m = Column(Float)
    slope_degrees = Column(Float)
    aspect_degrees = Column(Float)
    twi = Column(Float)  # Topographic Wetness Index
    distance_to_stream_m = Column(Float)
    distance_to_river_m = Column(Float)
    lineament_density = Column(Float)  # km/km²
    
    # Satellite Data (from Sentinel-2)
    ndvi_mean = Column(Float)  # Vegetation index
    ndvi_std = Column(Float)
    ndwi_mean = Column(Float)  # Water index
    evi_mean = Column(Float)  # Enhanced vegetation
    lst_mean = Column(Float)  # Land surface temp (°C)
    
    # Satellite Data (from Sentinel-1)
    vv_backscatter_mean = Column(Float)  # dB
    vh_backscatter_mean = Column(Float)  # dB
    soil_moisture_percent = Column(Float)  # 0-100
    
    # Climate Data
    rainfall_mm_year = Column(Float)  # Annual precipitation
    rainfall_std = Column(Float)
    evapotranspiration_mm_year = Column(Float)
    
    # Bedrock & Subsurface
    bedrock_depth_m = Column(Float)
    aquifer_thickness_m = Column(Float)
    
    # Confidence & Uncertainty
    probability_confidence = Column(Float)  # 0-1
    depth_confidence_50pct_m = Column(Float)
    depth_confidence_95pct_m = Column(Float)
    
    # Time tracking
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    analysis_date = Column(DateTime)
    
    # Relationships
    water_quality = relationship("WaterQualityPrediction", back_populates="site", uselist=True)
    risk_assessment = relationship("RiskAssessment", back_populates="site", uselist=True)
    cost_estimate = relationship("CostEstimation", back_populates="site", uselist=False)


class WaterQualityPrediction(Base):
    """Water quality parameters prediction"""
    __tablename__ = "water_quality_predictions"

    id = Column(Integer, primary_key=True, index=True)
    borehole_id = Column(Integer, ForeignKey('borehole_sites.id'), index=True)
    
    # Water Quality Parameters
    tds_mg_l = Column(Float)  # Total Dissolved Solids
    tds_confidence = Column(Float)
    
    fluoride_mg_l = Column(Float)
    fluoride_confidence = Column(Float)
    
    arsenic_mg_l = Column(Float)
    arsenic_confidence = Column(Float)
    
    nitrate_mg_l = Column(Float)
    nitrate_confidence = Column(Float)
    
    iron_mg_l = Column(Float)
    iron_confidence = Column(Float)
    
    ph = Column(Float)
    hardness_mg_l = Column(Float)
    turbidity_ntu = Column(Float)
    
    # Overall Assessment
    potability_status = Column(String(50))  # 'POTABLE', 'TREAT_REQUIRED', 'NOT_POTABLE'
    treatment_required = Column(JSON)  # List of treatment types needed
    health_summary = Column(Text)
    
    # WHO Comparison
    exceeds_who_guidelines = Column(Boolean, default=False)
    exceeded_parameters = Column(JSON)  # List of parameters exceeding WHO
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    site = relationship("BoreholeSite", back_populates="water_quality")


class RiskAssessment(Base):
    """Comprehensive risk analysis results"""
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    borehole_id = Column(Integer, ForeignKey('borehole_sites.id'), index=True)
    
    # Risk Scores (0-1)
    geological_risk = Column(Float)
    contamination_risk = Column(Float)
    depth_risk = Column(Float)
    financial_risk = Column(Float)
    technical_risk = Column(Float)
    overall_risk = Column(Float)
    
    # Geological Detail
    fault_proximity_risk = Column(Float)
    karst_collapse_risk = Column(Float)
    unstable_sediment_risk = Column(Float)
    gas_hazard_risk = Column(Float)
    abandoned_well_risk = Column(Float)
    
    # Contamination Sources
    sewage_risk = Column(Float)
    agricultural_risk = Column(Float)
    industrial_risk = Column(Float)
    landfill_risk = Column(Float)
    mining_risk = Column(Float)
    
    # Financial Risk
    cost_overrun_probability = Column(Float)
    yield_shortfall_probability = Column(Float)
    dry_hole_probability = Column(Float)
    npv_risk_adjusted = Column(Float)
    
    # Technical Risk
    equipment_failure_probability = Column(Float)
    weather_delay_probability = Column(Float)
    access_difficulty_probability = Column(Float)
    permit_delay_probability = Column(Float)
    
    # Risk Assessment Details
    top_risks = Column(JSON)  # List of top risk factors
    mitigation_strategies = Column(JSON)  # Mitigation actions
    risk_matrix = Column(JSON)  # 5x5 likelihood vs consequence matrix
    
    viability_rating = Column(String(50))  # 'HIGH', 'MEDIUM', 'LOW', 'NOT_RECOMMENDED'
    recommendation = Column(Text)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    site = relationship("BoreholeSite", back_populates="risk_assessment")


class CostEstimation(Base):
    """Project cost breakdown and financial analysis"""
    __tablename__ = "cost_estimations"

    id = Column(Integer, primary_key=True, index=True)
    borehole_id = Column(Integer, ForeignKey('borehole_sites.id'), index=True)
    
    # Cost Components (USD)
    drilling_cost_usd = Column(Float)
    casing_cost_usd = Column(Float)
    screen_cost_usd = Column(Float)
    pump_cost_usd = Column(Float)
    mobilization_cost_usd = Column(Float)
    permits_cost_usd = Column(Float)
    testing_cost_usd = Column(Float)
    contingency_cost_usd = Column(Float)
    
    # Cost Totals
    subtotal_usd = Column(Float)
    total_project_cost_usd = Column(Float)
    cost_per_meter_usd = Column(Float)
    
    # Financial Analysis (10-year horizon)
    annual_water_value_usd = Column(Float)
    operational_cost_per_year_usd = Column(Float)
    
    # Investment Metrics
    payback_period_years = Column(Float)
    npv_10year_usd = Column(Float)  # At 10% discount rate
    irr_percent = Column(Float)
    roi_percent = Column(Float)
    breakeven_years = Column(Float)
    
    # Risk-Adjusted
    npv_p50_usd = Column(Float)      # 50th percentile
    npv_p10_usd = Column(Float)      # Optimistic
    npv_p90_usd = Column(Float)      # Pessimistic
    
    cost_p50_usd = Column(Float)
    cost_p10_usd = Column(Float)
    cost_p90_usd = Column(Float)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    currency = Column(String(3), default='USD')
    
    # Relationship
    site = relationship("BoreholeSite", back_populates="cost_estimate")


class HistoricalBorehole(Base):
    """10,000+ historical borehole records for comparison and training"""
    __tablename__ = "historical_boreholes"

    id = Column(Integer, primary_key=True, index=True)
    
    # Location (WGS84)
    location = Column(Geometry('POINT', srid=4326), nullable=False, index=True)
    latitude = Column(Float, index=True)
    longitude = Column(Float, index=True)
    country = Column(String(100), index=True)
    region = Column(String(100))
    
    # Borehole Characteristics
    depth_drilled_m = Column(Float, index=True)
    depth_to_water_m = Column(Float)
    yield_m3h = Column(Float, index=True)
    success = Column(Boolean, index=True)  # 1 = found water, 0 = dry
    
    # Geology
    lithology = Column(JSON)  # Rock types encountered
    formations = Column(JSON)  # Geological formations
    aquifer_type = Column(String(50))
    porosity_fraction = Column(Float)
    conductivity_m_day = Column(Float)
    
    # Water Quality
    water_quality = Column(JSON)  # TDS, fluoride, arsenic, etc.
    tds_mg_l = Column(Float)
    fluoride_mg_l = Column(Float)
    arsenic_mg_l = Column(Float)
    
    # Project Details
    drilling_cost_usd = Column(Float)
    total_cost_usd = Column(Float)
    year = Column(Integer, index=True)
    drilling_duration_days = Column(Float)
    
    # Climate
    annual_rainfall_mm = Column(Float)
    
    # Metadata
    data_source = Column(String(255))  # Source database
    source_date = Column(DateTime)
    confidence_score = Column(Float)  # 0-1


class SatelliteData(Base):
    """Downloaded satellite imagery metadata and cache info"""
    __tablename__ = "satellite_data"

    id = Column(Integer, primary_key=True, index=True)
    borehole_id = Column(Integer, ForeignKey('borehole_sites.id'), index=True)
    
    # Query Parameters
    bbox_minlon = Column(Float)
    bbox_minlat = Column(Float)
    bbox_maxlon = Column(Float)
    bbox_maxlat = Column(Float)
    
    # Data Characteristics
    sensor = Column(String(50), index=True)  # 'sentinel1', 'sentinel2', 'landsat', 'grace', 'srtm'
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    
    # Storage Location
    local_path = Column(String(500))  # Local GeoTIFF path
    s3_path = Column(String(500))     # AWS S3 path
    geom_format = Column(String(20))  # 'GeoTIFF', 'NetCDF'
    file_size_mb = Column(Float)
    
    # Data Quality
    cloud_cover_percent = Column(Float)
    data_quality_score = Column(Float)  # 0-1
    is_valid = Column(Boolean, default=True)
    
    # Processing Status
    processed = Column(Boolean, default=False)
    spectral_indices_computed = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)  # Cache expiration


class SpectralIndices(Base):
    """Computed spectral indices from satellite imagery"""
    __tablename__ = "spectral_indices"

    id = Column(Integer, primary_key=True, index=True)
    satellite_data_id = Column(Integer, ForeignKey('satellite_data.id'))
    
    # VEGETATION INDICES
    ndvi = Column(String(500))  # Path to NDVI raster
    evi = Column(String(500))
    savi = Column(String(500))
    gndvi = Column(String(500))
    
    # WATER INDICES
    ndwi = Column(String(500))
    mndwi = Column(String(500))
    ndii = Column(String(500))
    ndmi = Column(String(500))
    
    # THERMAL INDICES
    lst = Column(String(500))
    ndti = Column(String(500))
    
    # SOIL INDICES
    si = Column(String(500))  # Salinity
    bi = Column(String(500))  # Brightness
    
    # STATISTICS (for quick lookup)
    ndvi_mean = Column(Float)
    ndvi_std = Column(Float)
    ndwi_mean = Column(Float)
    ndwi_std = Column(Float)
    lst_mean = Column(Float)
    lst_std = Column(Float)
    twi_mean = Column(Float)
    twi_std = Column(Float)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)


class MLModel(Base):
    """Machine learning model registry and version tracking"""
    __tablename__ = "ml_models"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(255), index=True)
    model_type = Column(String(100))  # 'CNN', 'RandomForest', 'XGBoost', etc.
    version = Column(String(50))
    
    # Model Characteristics
    architecture = Column(JSON)  # Model structure details
    hyperparameters = Column(JSON)  # Training hyperparameters
    training_data_size = Column(Integer)  # Number of training samples
    
    # Performance Metrics
    accuracy_train = Column(Float)
    accuracy_validation = Column(Float)
    accuracy_test = Column(Float)
    rmse = Column(Float)
    mae = Column(Float)
    r2_score = Column(Float)
    auc = Column(Float)
    
    # File Location
    model_path = Column(String(500))
    weights_path = Column(String(500))
    
    # Status
    is_active = Column(Boolean, default=True)
    is_production = Column(Boolean, default=False)
    
    # Metadata
    trained_date = Column(DateTime)
    last_updated = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class AnalysisJob(Base):
    """Track long-running analysis jobs"""
    __tablename__ = "analysis_jobs"

    id = Column(Integer, primary_key=True, index=True)
    borehole_id = Column(Integer, ForeignKey('borehole_sites.id'), index=True)
    
    job_type = Column(String(100))
    status = Column(String(50), default='PENDING')  # PENDING, RUNNING, COMPLETED, FAILED
    
    # Progress Tracking
    progress_percent = Column(Integer, default=0)
    current_stage = Column(String(255))
    
    # Results
    result = Column(JSON)
    error_message = Column(Text)
    
    # Timing
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    execution_time_seconds = Column(Float)
    
    # Celery Task
    celery_task_id = Column(String(255), index=True)
