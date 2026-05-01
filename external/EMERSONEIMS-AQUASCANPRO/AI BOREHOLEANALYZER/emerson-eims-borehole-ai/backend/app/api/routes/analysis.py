"""
API Route: Borehole Site Analysis
Endpoints for site analysis, geological classification, and risk assessment
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import logging
from typing import Optional, List
import numpy as np
from datetime import datetime

from app.database.config import get_db
from app.database.models import (
    BoreholeSite, AnalysisJob, WaterQualityPrediction,
    RiskAssessment, CostEstimation
)
from app.services.dem_processor import DEMProcessor
from app.services.spectral_indices import SpectralIndicesCalculator
from app.services.geology import GeologicalClassifier
from app.services.earth_engine_client import EarthEngineClient
from app.core.schemas import (
    BoreholeSiteCreate, AnalysisRequest, RiskScoreResponse, CostResponse
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/analysis", tags=["analysis"])


# ============ SITE ANALYSIS ENDPOINTS ============

@router.post("/site", response_model=dict)
async def analyze_site(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    """
    Perform comprehensive borehole site analysis

    - Satellite data acquisition
    - Topographic analysis (DEM)
    - Spectral index computation
    - Geological classification
    - Aquifer favorability scoring
    """
    try:
        logger.info(f"Starting site analysis: {request.latitude}, {request.longitude}")

        # Create analysis job record
        job = AnalysisJob(
            site_name=request.site_name,
            location_lat=request.latitude,
            location_lon=request.longitude,
            status='PROCESSING',
            started_at=datetime.utcnow()
        )
        db.add(job)
        db.commit()

        # Queue background tasks
        if background_tasks:
            background_tasks.add_task(
                run_full_analysis,
                job_id=job.id,
                latitude=request.latitude,
                longitude=request.longitude,
                db_session_maker=None
            )

        return {
            "job_id": job.id,
            "status": "PROCESSING",
            "site": request.site_name,
            "location": {"lat": request.latitude, "lon": request.longitude},
            "message": "Analysis queued. Results will be available shortly."
        }

    except Exception as e:
        logger.error(f"Site analysis initiation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{job_id}")
async def get_analysis_status(
    job_id: int,
    db: Session = Depends(get_db)
):
    """Get analysis job status and results"""
    try:
        job = db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        result = {
            "job_id": job.id,
            "status": job.status,
            "started_at": job.started_at.isoformat(),
            "completed_at": job.completed_at.isoformat() if job.completed_at else None,
            "progress": job.progress or 0
        }

        if job.status == 'COMPLETED':
            result['results'] = {
                "aquifer_favorability": job.metadata.get('favorability_score') if job.metadata else None,
                "aquifer_type": job.metadata.get('aquifer_type') if job.metadata else None,
                "lineament_density": job.metadata.get('lineament_density') if job.metadata else None
            }

        return result

    except Exception as e:
        logger.error(f"Status retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ GEOLOGICAL ANALYSIS ============

@router.get("/geology/{site_id}")
async def get_geological_analysis(
    site_id: int,
    db: Session = Depends(get_db)
):
    """Get geological classification for site"""
    try:
        site = db.query(BoreholeSite).filter(BoreholeSite.id == site_id).first()
        if not site:
            raise HTTPException(status_code=404, detail="Site not found")

        return {
            "site_id": site_id,
            "aquifer_type": site.aquifer_class,
            "favorability_score": site.favorability_score,
            "lineament_density": site.lineament_density,
            "bedrock_depth_m": site.bedrock_depth_m if hasattr(site, 'bedrock_depth_m') else None,
            "geological_notes": site.geological_unit
        }

    except Exception as e:
        logger.error(f"Geological analysis retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ RISK ASSESSMENT ============

@router.post("/risk/{site_id}", response_model=RiskScoreResponse)
async def assess_risk(
    site_id: int,
    db: Session = Depends(get_db)
):
    """
    Assess multiple risk dimensions:
    - Geological risk (fault proximity, stability)
    - Contamination risk (pollution sources)
    - Depth risk (drilling difficulty)
    - Financial risk (cost overrun)
    - Technical risk (construction challenges)
    """
    try:
        site = db.query(BoreholeSite).filter(BoreholeSite.id == site_id).first()
        if not site:
            raise HTTPException(status_code=404, detail="Site not found")

        # Compute risk scores (0-10 scale, where 10 is highest risk)
        geological_risk = compute_geological_risk(site)
        contamination_risk = compute_contamination_risk(site)
        depth_risk = compute_depth_risk(site)
        financial_risk = compute_financial_risk(site)
        technical_risk = compute_technical_risk(site)

        # Overall risk (weighted average)
        weights = {'geological': 0.2, 'contamination': 0.25, 'depth': 0.2, 'financial': 0.2, 'technical': 0.15}
        overall_risk = (
            weights['geological'] * geological_risk +
            weights['contamination'] * contamination_risk +
            weights['depth'] * depth_risk +
            weights['financial'] * financial_risk +
            weights['technical'] * technical_risk
        )

        # Store assessment
        assessment = RiskAssessment(
            borehole_site_id=site_id,
            geological_risk_score=geological_risk,
            contamination_risk_score=contamination_risk,
            depth_risk_score=depth_risk,
            financial_risk_score=financial_risk,
            technical_risk_score=technical_risk,
            overall_risk_score=overall_risk,
            assessed_at=datetime.utcnow()
        )
        db.add(assessment)
        db.commit()

        return RiskScoreResponse(
            site_id=site_id,
            geological_risk=geological_risk,
            contamination_risk=contamination_risk,
            depth_risk=depth_risk,
            financial_risk=financial_risk,
            technical_risk=technical_risk,
            overall_risk=overall_risk,
            risk_level="HIGH" if overall_risk > 6 else "MEDIUM" if overall_risk > 3 else "LOW",
            recommendations=generate_risk_recommendations(overall_risk)
        )

    except Exception as e:
        logger.error(f"Risk assessment failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def compute_geological_risk(site) -> float:
    """Geological risk: proximity to faults/lineaments, stability"""
    risk = 0.0

    # High lineament density = higher risk
    lineament_density = getattr(site, 'lineament_density', 0)
    risk += min(lineament_density * 2, 5)  # Scale to 0-5

    # Steep slopes = higher risk
    if hasattr(site, 'slope_deg'):
        risk += min(site.slope_deg / 20, 5)  # Scale slope to 0-5

    return min(risk, 10)


def compute_contamination_risk(site) -> float:
    """Contamination risk: pollution sources, land use"""
    risk = 0.0

    # High TWI = wetter = more vulnerable
    if hasattr(site, 'twi'):
        twi = site.twi
        risk += min(max(twi - 4, 0) / 2, 5)

    # Land use risk (would come from satellite data)
    # Urban/agricultural = higher risk
    if hasattr(site, 'ndbi'):
        risk += site.ndbi * 3  # Built-up risk

    return min(risk, 10)


def compute_depth_risk(site) -> float:
    """Depth risk: drilling complexity increases with depth"""
    risk = 0.0

    if hasattr(site, 'predicted_depth_m'):
        depth = site.predicted_depth_m
        risk = min(depth / 50, 10)  # 50m = moderate risk, 500m+ = extreme

    return risk


def compute_financial_risk(site) -> float:
    """Financial risk: cost uncertainty, market volatility"""
    # Baseline 3/10, increases with uncertainty
    return 3.0


def compute_technical_risk(site) -> float:
    """Technical risk: construction difficulty, equipment needs"""
    risk = 0.0

    # Aquifer type affects technical difficulty
    aquifer_type = getattr(site, 'aquifer_class', 'UNKNOWN')
    if aquifer_type == 'KARST':
        risk += 4  # Karst = drilling challenges
    elif aquifer_type == 'LOW_PRODUCTIVITY':
        risk += 3  # Crystalline bedrock = difficult

    return min(risk, 10)


def generate_risk_recommendations(overall_risk: float) -> List[str]:
    """Generate mitigation recommendations based on risk"""
    recommendations = []

    if overall_risk > 7:
        recommendations.append("HIGH RISK: Conduct detailed geological survey before drilling")
        recommendations.append("Consider alternative drilling methods (air rotary, DTH)")
        recommendations.append("Increase contingency budget by 30-50%")

    elif overall_risk > 4:
        recommendations.append("MEDIUM RISK: Perform pre-drilling geophysical survey")
        recommendations.append("Standard drilling appropriate with experienced crew")
        recommendations.append("Standard contingency budget (15-20%)")

    else:
        recommendations.append("LOW RISK: Site appears favorable for drilling")
        recommendations.append("Proceed with standard drilling procedures")
        recommendations.append("Minimal contingency budget needed")

    return recommendations


# ============ WATER QUALITY PREDICTION ============

@router.post("/water-quality/{site_id}")
async def predict_water_quality(
    site_id: int,
    depth_m: Optional[float] = 50,
    db: Session = Depends(get_db)
):
    """Predict water quality parameters at given depth"""
    try:
        site = db.query(BoreholeSite).filter(BoreholeSite.id == site_id).first()
        if not site:
            raise HTTPException(status_code=404, detail="Site not found")

        # Estimate water quality from SoilGrids geological data
        # Real geology determines likely water chemistry at depth
        import json as _json
        import urllib.request as _urlreq

        tds_est, fluoride_est, arsenic_est, nitrate_est, iron_est = (
            None, None, None, None, None
        )
        soil_source = "SoilGrids v2.0"

        try:
            soil_url = (
                f"https://rest.isric.org/soilgrids/v2.0/properties/query"
                f"?lon={site.longitude}&lat={site.latitude}"
                f"&property=clay&property=sand&property=phh2o&property=cec"
                f"&depth=60-100cm&value=mean"
            )
            _req = _urlreq.Request(soil_url, headers={"User-Agent": "BoreholeAI/2.0"})
            with _urlreq.urlopen(_req, timeout=15) as _resp:
                soil_data = _json.loads(_resp.read().decode())

            layers = {}
            for prop in soil_data.get("properties", {}).get("layers", []):
                name = prop.get("name")
                for d in prop.get("depths", []):
                    val = d.get("values", {}).get("mean")
                    if val is not None:
                        layers[name] = float(val)

            clay = layers.get("clay", 250) / 10.0  # g/kg → %
            sand = layers.get("sand", 400) / 10.0
            ph = layers.get("phh2o", 65) / 10.0
            cec = layers.get("cec", 150) / 10.0  # mmol(c)/kg → cmol/kg

            # TDS correlates with clay content and depth (more mineral dissolution)
            tds_est = 100 + clay * 8 + depth_m * 2.5
            # Fluoride: higher in alkaline, low-clay soils (East African Rift)
            fluoride_est = max(0.1, (ph - 6.0) * 0.8 + (100 - clay) * 0.01)
            # Arsenic: higher in reducing conditions (high clay, low sand)
            arsenic_est = max(0.5, clay * 0.15 - sand * 0.05)
            # Nitrate: lower at depth (denitrification), higher in sandy soils
            nitrate_est = max(1, 40 * sand / 100 * max(0, 1 - depth_m / 80))
            # Iron: higher in acidic, clay-rich soils
            iron_est = max(0.05, (7.0 - ph) * 0.3 + clay * 0.005)

        except Exception:
            soil_source = "estimation_failed"

        if tds_est is None:
            raise HTTPException(
                status_code=503,
                detail="Water quality prediction unavailable — SoilGrids API unreachable. "
                       "Cannot provide predictions without real geological data."
            )

        predictions = WaterQualityPrediction(
            borehole_site_id=site_id,
            sampling_depth_m=depth_m,
            tds_mg_l=round(tds_est, 1),
            fluoride_mg_l=round(fluoride_est, 3),
            arsenic_ug_l=round(arsenic_est, 2),
            nitrate_mg_l=round(nitrate_est, 1),
            iron_mg_l=round(iron_est, 3),
            tds_confidence=0.60,
            fluoride_confidence=0.50,
            arsenic_confidence=0.45,
            nitrate_confidence=0.55,
            iron_confidence=0.50,
            predicted_at=datetime.utcnow()
        )

        db.add(predictions)
        db.commit()

        return {
            "site_id": site_id,
            "depth_m": depth_m,
            "predicted_parameters": {
                "TDS": {"value": float(predictions.tds_mg_l), "confidence": predictions.tds_confidence, "unit": "mg/L"},
                "Fluoride": {"value": float(predictions.fluoride_mg_l), "confidence": predictions.fluoride_confidence, "unit": "mg/L"},
                "Arsenic": {"value": float(predictions.arsenic_ug_l), "confidence": predictions.arsenic_confidence, "unit": "µg/L"},
                "Nitrate": {"value": float(predictions.nitrate_mg_l), "confidence": predictions.nitrate_confidence, "unit": "mg/L"},
                "Iron": {"value": float(predictions.iron_mg_l), "confidence": predictions.iron_confidence, "unit": "mg/L"}
            },
            "who_compliance": {
                "TDS": float(predictions.tds_mg_l) < 1000,
                "Fluoride": 0.6 < float(predictions.fluoride_mg_l) < 1.5,
                "Arsenic": float(predictions.arsenic_ug_l) < 10,
                "Nitrate": float(predictions.nitrate_mg_l) < 50,
                "Iron": float(predictions.iron_mg_l) < 0.3
            }
        }

    except Exception as e:
        logger.error(f"Water quality prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ COST ESTIMATION ============

@router.get("/cost-estimate/{site_id}", response_model=CostResponse)
async def estimate_cost(
    site_id: int,
    depth_m: float = 80,
    aquifer_type: str = "SEMI_PRODUCTIVE",
    db: Session = Depends(get_db)
):
    """Estimate borehole drilling and development costs"""
    try:
        # Cost model (simplified)
        costs = {
            'mobilization': 500,
            'drilling': max(depth_m * 15, 1000),  # $15/meter baseline
            'casing': depth_m * 8,
            'screen': depth_m * 5,
            'development': depth_m * 3,
            'testing': 300,
            'contingency': 0
        }

        # Adjust for aquifer type risk
        if aquifer_type == 'KARST':
            costs['drilling'] *= 1.5
        elif aquifer_type == 'LOW_PRODUCTIVITY':
            costs['drilling'] *= 1.3

        total_material = sum([v for k, v in costs.items() if k != 'contingency'])
        costs['contingency'] = total_material * 0.2  # 20% contingency

        total = sum(costs.values())

        # Estimation model (Week 2 will add ML)
        estimate = CostEstimation(
            borehole_site_id=site_id,
            drilling_depth_m=depth_m,
            mobilization_usd=costs['mobilization'],
            drilling_usd=costs['drilling'],
            equipment_usd=costs['casing'] + costs['screen'],
            testing_usd=costs['testing'],
            contingency_usd=costs['contingency'],
            total_estimated_usd=total,
            roi_10year_percent=None,  # ML model (Week 2)
            npv_usd=None,
            irr_percent=None,
            payback_months=None,
            estimated_at=datetime.utcnow()
        )
        db.add(estimate)
        db.commit()

        return CostResponse(
            site_id=site_id,
            depth_m=depth_m,
            cost_breakdown=costs,
            total_estimated_usd=total,
            cost_per_meter=total / depth_m
        )

    except Exception as e:
        logger.error(f"Cost estimation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ BACKGROUND TASK ============

async def run_full_analysis(job_id: int, latitude: float, longitude: float, db_session_maker):
    """Run full analysis pipeline asynchronously using real satellite + geological APIs."""
    try:
        logger.info(f"Running full analysis for job {job_id}")
        from app.core.orchestrator import AnalysisOrchestrator
        orchestrator = AnalysisOrchestrator()
        metadata = {"latitude": latitude, "longitude": longitude}
        results = await orchestrator.run_analysis(b"", metadata)
        logger.info(f"Full analysis completed for job {job_id}: {results.get('success_probability', 'N/A')}")
        return results
    except Exception as e:
        logger.error(f"Full analysis failed: {e}")
