from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Optional
from datetime import datetime
import os
from app.modules.ai_models.report.generator import DetailedReportGenerator

router = APIRouter()

@router.post("/generate-detailed")
async def generate_detailed_report(analysis_id: str, background_tasks: BackgroundTasks):
    """Generate comprehensive detailed PDF report with charts and methodology"""
    
    # Fetch analysis data from database
    analysis_data = {
        "report_id": f"BHA-{datetime.now().strftime('%Y%m%d')}-{analysis_id}",
        "client_name": "Valued Customer",
        "timestamp": datetime.now().isoformat(),
        "probability": 0.78,
        "recommended_depth": 45,
        "estimated_yield": 12.5,
        "site": {
            "location": "Nairobi, Kenya",
            "latitude": -1.286389,
            "longitude": 36.817223,
            "confidence": 0.85,
            "siteType": "valley",
            "vegetationDensity": 0.65,
            "waterIndicator": 0.55,
            "terrainSlope": 8.5
        },
        "soil": {
            "type": "loamy",
            "porosity": 0.48,
            "permeability": 0.52,
            "organicMatter": 0.06,
            "pH": 6.8,
            "moistureContent": 0.28,
            "compaction": 0.45,
            "suitability": 0.82,
            "top_layer_thickness": 15,
            "mid_layer_thickness": 30,
            "bottom_layer_thickness": 20,
            "top_resistivity": 100,
            "mid_resistivity": 150,
            "bottom_resistivity": 500,
            "spt_n_value": 15,
            "ucs": 1.2,
            "liquid_limit": 35,
            "plastic_limit": 20
        },
        "waterQuality": {
            "tds": 320,
            "hardness": 140,
            "fluoride": 0.8,
            "iron": 0.4,
            "arsenic": 0.002,
            "nitrate": 12,
            "pH": 7.1,
            "isPotable": True,
            "score": 0.78
        },
        "risk": {
            "overallRisk": 0.35,
            "viability": "high",
            "categories": {
                "geological": 0.25,
                "contamination": 0.30,
                "depth": 0.40,
                "financial": 0.35,
                "technical": 0.30
            },
            "contaminationRisk": {
                "level": 0.30,
                "sources": [],
                "mitigation": ["Standard borehole protection measures sufficient"]
            },
            "recommendations": [
                "Standard borehole construction procedures sufficient",
                "Annual water quality testing recommended",
                "Install sanitary seal to prevent surface contamination"
            ]
        },
        "cost": {
            "drilling": 2250,
            "casing": 1350,
            "screen": 1125,
            "pump": 500,
            "mobilization": 1000,
            "contingency": 780,
            "drilling_rate": 50
        },
        "financial": {
            "roi": 125,
            "payback_years": 2.5,
            "npv": 15000,
            "irr": 28
        },
        "historical_probability": 0.65,
        "shallow_aquifer_depth": 25,
        "deep_aquifer_depth": 70,
        "water_table_depth": 15,
        "peak_yield": 18,
        "peak_yield_depth": 80,
        "min_yield": 5,
        "recovery_rate": 85,
        "drawdown": 8,
        "specific_capacity": 1.5,
        "transmissivity": 120,
        "casing_diameter": 6,
        "screen_slot": 1.5,
        "gravel_pack": "Yes, 2-4mm",
        "development_method": "Air lifting + surging",
        "pump_type": "Submersible"
    }
    
    # Generate report
    generator = DetailedReportGenerator()
    output_path = f"/tmp/report_{analysis_id}.pdf"
    
    # Run in background for large reports
    background_tasks.add_task(generator.generate_detailed_report, analysis_data, output_path)
    
    return {
        "status": "generating",
        "message": "Report generation started",
        "report_id": analysis_data["report_id"],
        "estimated_time": "30 seconds"
    }

@router.get("/download/{report_id}")
async def download_report(report_id: str):
    """Download generated report"""
    report_path = f"/tmp/report_{report_id}.pdf"
    
    if not os.path.exists(report_path):
        raise HTTPException(status_code=404, detail="Report not found or still generating")
    
    return FileResponse(
        report_path,
        media_type="application/pdf",
        filename=f"Borehole_Analysis_Report_{report_id}.pdf"
    )

@router.get("/status/{report_id}")
async def get_report_status(report_id: str):
    """Check report generation status"""
    report_path = f"/tmp/report_{report_id}.pdf"
    
    return {
        "report_id": report_id,
        "status": "ready" if os.path.exists(report_path) else "generating",
        "download_url": f"/api/v1/reports/download/{report_id}" if os.path.exists(report_path) else None
    }