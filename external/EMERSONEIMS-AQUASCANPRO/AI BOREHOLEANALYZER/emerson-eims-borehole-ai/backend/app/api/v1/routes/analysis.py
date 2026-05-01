"""Analysis endpoints: submit image for analysis, retrieve results."""

import io
import logging
from typing import Optional

from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Form
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models.borehole import Analysis
from app.database.models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    user_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
):
    """Submit an image for borehole analysis. Creates an Analysis record
    and dispatches the heavy processing to Celery."""
    if not latitude or not longitude:
        raise HTTPException(status_code=422, detail="latitude and longitude are required")

    # Read the uploaded image (validate it's a real image)
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    # Resolve user — fall back to anonymous user_id=1
    uid = user_id or 1
    if not db.query(User).filter(User.id == uid).first():
        raise HTTPException(status_code=404, detail="User not found")

    # Persist analysis request
    analysis = Analysis(
        user_id=uid,
        latitude=latitude,
        longitude=longitude,
        status="pending",
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # Dispatch to Celery worker
    try:
        from app.workers.celery_app import celery_app

        celery_app.send_task(
            "app.workers.tasks.analysis.run_analysis",
            args=[analysis.id],
            queue="default",
        )
        analysis.status = "processing"
        db.commit()
    except Exception as e:
        logger.warning(f"Celery dispatch failed, will process inline later: {e}")

    return {
        "analysis_id": analysis.id,
        "status": analysis.status,
        "message": "Analysis submitted. Poll GET /analysis/{id} for results.",
    }


@router.get("/{analysis_id}")
async def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """Retrieve analysis results by ID."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    result = {
        "id": analysis.id,
        "status": analysis.status,
        "latitude": analysis.latitude,
        "longitude": analysis.longitude,
        "probability": analysis.probability,
        "confidence": analysis.confidence,
        "recommended_depth_m": analysis.recommended_depth_m,
        "estimated_yield_m3h": analysis.estimated_yield_m3h,
        "soil_type": analysis.soil_type,
        "water_quality": analysis.water_quality,
        "risk_assessment": analysis.risk_assessment,
        "geophysics_data": analysis.geophysics_data,
        "ensemble_sources": analysis.ensemble_sources,
        "processing_time_ms": analysis.processing_time_ms,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
        "completed_at": analysis.completed_at.isoformat() if analysis.completed_at else None,
        "error_message": analysis.error_message,
    }
    if analysis.status == "pending" or analysis.status == "processing":
        result["message"] = "Analysis is still being processed. Try again shortly."

    return result


@router.get("/user/{user_id}")
async def list_user_analyses(user_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """List all analyses for a user."""
    rows = (
        db.query(Analysis)
        .filter(Analysis.user_id == user_id)
        .order_by(Analysis.created_at.desc())
        .offset(skip)
        .limit(min(limit, 100))
        .all()
    )
    return [
        {
            "id": a.id,
            "status": a.status,
            "latitude": a.latitude,
            "longitude": a.longitude,
            "probability": a.probability,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in rows
    ]