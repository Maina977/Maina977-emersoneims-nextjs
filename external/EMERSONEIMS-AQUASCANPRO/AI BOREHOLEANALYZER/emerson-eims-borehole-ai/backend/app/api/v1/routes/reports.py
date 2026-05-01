"""Report preview/full endpoints with payment gating."""

import logging
import os

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models.borehole import Analysis
from app.database.models.payment import Payment
from app.database.models.report import Report

router = APIRouter()
logger = logging.getLogger(__name__)


def _check_paid(analysis_id: int, db: Session) -> bool:
    """Return True if a completed payment exists for this analysis's user."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        return False
    return (
        db.query(Payment)
        .filter(Payment.user_id == analysis.user_id, Payment.status == "completed")
        .first()
        is not None
    )


@router.get("/preview/{analysis_id}")
async def get_report_preview(analysis_id: int, db: Session = Depends(get_db)):
    """Get 70% preview of report — FREE for all users."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    is_paid = _check_paid(analysis_id, db)

    wq = analysis.water_quality or {}
    risk = analysis.risk_assessment or {}

    preview = {
        "report_id": f"BHA-{analysis.created_at.strftime('%Y%m%d')}-{analysis.id}",
        "is_preview": not is_paid,
        "preview_percentage": 70,
        "disclaimer": "DESKTOP ESTIMATE — field validation required",
        "message": (
            "This is a 70% preview. Pay to unlock the complete report "
            "with full recommendations and detailed data."
            if not is_paid
            else None
        ),
        "executive_summary": {
            "probability": analysis.probability,
            "confidence": analysis.confidence,
            "recommended_depth_m": analysis.recommended_depth_m,
            "estimated_yield_m3h": analysis.estimated_yield_m3h,
            "soil_type": analysis.soil_type,
            "ensemble_sources": analysis.ensemble_sources,
        },
        "site_information": {
            "latitude": analysis.latitude,
            "longitude": analysis.longitude,
        },
        "soil_analysis_preview": {
            "soil_type": analysis.soil_type,
            "preview_note": "Detailed soil composition and lab reference values available in full report",
        },
        "water_quality_preview": {
            "tds": wq.get("tds"),
            "ph": wq.get("pH"),
            "is_potable": wq.get("isPotable"),
            "preview_note": "Full chemical analysis available in complete report.",
        },
        "risk_summary": {
            "overall_risk": risk.get("overallRisk"),
            "viability": risk.get("viability"),
            "risk_categories": risk.get("categories", {}),
        },
        "locked_sections": {
            "message": (
                "UNLOCK to access: Complete recommendations, detailed drilling "
                "specifications, water quality treatment plan, contamination "
                "mitigation strategies, financial ROI analysis, and full PDF report."
            ),
            "sections_locked": [
                "Detailed Drilling Recommendations",
                "Complete Water Quality Treatment Plan",
                "Contamination Mitigation Strategy",
                "Financial ROI Analysis with Payback Period",
                "Full PDF Report Download",
                "Professional Quotation Document",
                "5-Year Yield Projection Charts",
                "Comparative Site Analysis",
            ],
        },
    }

    return preview


@router.get("/full/{analysis_id}")
async def get_full_report(analysis_id: int, db: Session = Depends(get_db)):
    """Get 100% full report — ONLY after payment."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    if not _check_paid(analysis_id, db):
        raise HTTPException(
            status_code=402,
            detail="Payment required. Please complete payment to unlock full report.",
            headers={"X-Payment-Required": "true"},
        )

    wq = analysis.water_quality or {}
    risk = analysis.risk_assessment or {}
    geo = analysis.geophysics_data or {}

    full_report = {
        "report_id": f"BHA-{analysis.created_at.strftime('%Y%m%d')}-{analysis.id}",
        "is_full_report": True,
        "payment_verified": True,
        "disclaimer": "DESKTOP ESTIMATE — field validation required",
        "executive_summary": {
            "probability": analysis.probability,
            "confidence": analysis.confidence,
            "recommended_depth_m": analysis.recommended_depth_m,
            "estimated_yield_m3h": analysis.estimated_yield_m3h,
            "soil_type": analysis.soil_type,
            "ensemble_sources": analysis.ensemble_sources,
        },
        "site_information": {
            "latitude": analysis.latitude,
            "longitude": analysis.longitude,
        },
        "water_quality": wq,
        "risk_assessment": risk,
        "geophysics_data": geo,
        "download_links": {
            "pdf_report": f"/api/v1/export/report/{analysis.id}/pdf",
            "json_export": f"/api/v1/export/analysis/{analysis.id}/json",
            "csv_export": f"/api/v1/export/analysis/{analysis.id}/csv",
        },
    }

    return full_report


@router.get("/download/{analysis_id}")
async def download_full_report(analysis_id: int, db: Session = Depends(get_db)):
    """Download PDF of full report — ONLY after payment."""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    if not _check_paid(analysis_id, db):
        raise HTTPException(status_code=402, detail="Payment required")

    report = (
        db.query(Report)
        .filter(Report.analysis_id == analysis_id, Report.format == "pdf", Report.status == "completed")
        .first()
    )
    if not report or not report.file_path:
        raise HTTPException(status_code=404, detail="PDF report not yet generated")

    if not os.path.isfile(report.file_path):
        raise HTTPException(status_code=404, detail="Report file not found on disk")

    report.download_count = (report.download_count or 0) + 1
    db.commit()

    return FileResponse(
        report.file_path,
        media_type="application/pdf",
        filename=f"BHA-{analysis_id}.pdf",
    )