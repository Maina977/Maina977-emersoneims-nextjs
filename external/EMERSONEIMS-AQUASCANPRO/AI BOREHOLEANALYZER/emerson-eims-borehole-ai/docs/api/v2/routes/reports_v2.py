from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime

router = APIRouter()

@router.post("/generate-batch")
async def generate_batch_reports(analysis_ids: list[int]):
    reports = []
    for aid in analysis_ids:
        reports.append({
            "analysis_id": aid,
            "report_id": f"report_{aid}",
            "download_url": f"/reports/report_{aid}.pdf"
        })
    return {"reports": reports, "batch_id": "batch_reports_123"}

@router.get("/templates")
async def get_report_templates():
    return {
        "templates": [
            {"id": "basic", "name": "Basic Report", "description": "Standard borehole analysis report"},
            {"id": "professional", "name": "Professional Report", "description": "Detailed professional report"},
            {"id": "premium", "name": "Premium Report", "description": "Comprehensive report with all metrics"},
            {"id": "executive", "name": "Executive Summary", "description": "Brief executive summary"}
        ]
    }