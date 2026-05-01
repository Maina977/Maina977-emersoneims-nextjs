import csv
import io
import json
import logging
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response, FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models.borehole import Analysis
from app.database.models.report import Report
from app.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


def _get_analysis_or_404(analysis_id: int, db: Session) -> Analysis:
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Analysis {analysis_id} not found")
    return analysis


@router.get("/analysis/{analysis_id}/json")
async def export_json(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    analysis = _get_analysis_or_404(analysis_id, db)
    return {
        "analysis_id": analysis.id,
        "latitude": analysis.latitude,
        "longitude": analysis.longitude,
        "probability": analysis.probability,
        "confidence": analysis.confidence,
        "recommended_depth_m": analysis.recommended_depth_m,
        "estimated_yield_m3h": analysis.estimated_yield_m3h,
        "soil_type": analysis.soil_type,
        "water_quality": analysis.water_quality,
        "risk_assessment": analysis.risk_assessment,
        "status": analysis.status,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
    }


@router.get("/analysis/{analysis_id}/csv")
async def export_csv(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    analysis = _get_analysis_or_404(analysis_id, db)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Parameter", "Value"])
    writer.writerow(["Analysis ID", analysis.id])
    writer.writerow(["Latitude", analysis.latitude])
    writer.writerow(["Longitude", analysis.longitude])
    writer.writerow(["Probability", analysis.probability])
    writer.writerow(["Confidence", analysis.confidence])
    writer.writerow(["Recommended Depth (m)", analysis.recommended_depth_m])
    writer.writerow(["Estimated Yield (m³/h)", analysis.estimated_yield_m3h])
    writer.writerow(["Soil Type", analysis.soil_type])
    writer.writerow(["Status", analysis.status])
    writer.writerow(["Created At", analysis.created_at.isoformat() if analysis.created_at else ""])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment;filename=analysis_{analysis_id}.csv"},
    )


@router.get("/report/{report_id}/pdf")
async def export_pdf(
    report_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"Report {report_id} not found")
    if report.status != "ready":
        raise HTTPException(status_code=400, detail=f"Report status is '{report.status}', not ready for download")
    if not report.file_path:
        raise HTTPException(status_code=404, detail="Report file not found on server")

    report.download_count += 1
    db.commit()

    return FileResponse(
        path=report.file_path,
        media_type="application/pdf",
        filename=f"report_{report_id}.pdf",
    )