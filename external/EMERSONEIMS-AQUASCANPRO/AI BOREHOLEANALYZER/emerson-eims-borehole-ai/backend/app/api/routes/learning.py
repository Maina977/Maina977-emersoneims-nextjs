"""
Drilling Outcome Feedback & Learning Sync API
Receives drilling outcomes from the frontend and stores them in PostgreSQL
for regional calibration and model improvement.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.database.config import get_db

router = APIRouter(prefix="/api/v1/learning", tags=["learning"])


class DrillingOutcomeInput(BaseModel):
    """Schema for drilling outcome submission from frontend."""
    site_id: str = Field(..., min_length=1, max_length=100)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    predicted_depth_m: float = Field(..., gt=0)
    actual_depth_m: float = Field(..., gt=0)
    predicted_yield_m3h: float = Field(..., ge=0)
    actual_yield_m3h: float = Field(..., ge=0)
    predicted_success_pct: float = Field(..., ge=0, le=100)
    was_successful: bool
    drilling_date: str
    notes: Optional[str] = None
    field_data_sources: Optional[List[str]] = None
    report_level: int = Field(default=1, ge=1, le=3)


class DrillingOutcomeResponse(BaseModel):
    id: str
    message: str
    grid_cell: str
    outcomes_in_cell: int


class RegionalStatsResponse(BaseModel):
    grid_cell: str
    outcome_count: int
    avg_depth_error_pct: float
    avg_yield_error_pct: float
    success_rate: float
    depth_correction_factor: float
    yield_correction_factor: float


@router.post("/outcomes", response_model=DrillingOutcomeResponse)
async def submit_drilling_outcome(
    outcome: DrillingOutcomeInput,
    db: AsyncSession = Depends(get_db),
):
    """Store a drilling outcome for regional learning calibration."""
    # Compute 0.5° grid cell
    grid_lat = round(outcome.latitude * 2) / 2
    grid_lon = round(outcome.longitude * 2) / 2
    grid_cell = f"{grid_lat:.1f},{grid_lon:.1f}"

    outcome_id = f"outcome_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{outcome.site_id[:20]}"

    # Insert into database (using raw SQL for compatibility)
    await db.execute(
        text("""
            INSERT INTO drilling_outcomes (
                id, site_id, latitude, longitude, grid_cell,
                predicted_depth_m, actual_depth_m,
                predicted_yield_m3h, actual_yield_m3h,
                predicted_success_pct, was_successful,
                drilling_date, notes, field_data_sources, report_level,
                created_at
            ) VALUES (
                :id, :site_id, :lat, :lon, :grid_cell,
                :pred_depth, :act_depth,
                :pred_yield, :act_yield,
                :pred_success, :was_successful,
                :drill_date, :notes, :field_sources, :report_level,
                :created_at
            )
            ON CONFLICT (id) DO NOTHING
        """),
        {
            "id": outcome_id,
            "site_id": outcome.site_id,
            "lat": outcome.latitude,
            "lon": outcome.longitude,
            "grid_cell": grid_cell,
            "pred_depth": outcome.predicted_depth_m,
            "act_depth": outcome.actual_depth_m,
            "pred_yield": outcome.predicted_yield_m3h,
            "act_yield": outcome.actual_yield_m3h,
            "pred_success": outcome.predicted_success_pct,
            "was_successful": outcome.was_successful,
            "drill_date": outcome.drilling_date,
            "notes": outcome.notes,
            "field_sources": ",".join(outcome.field_data_sources or []),
            "report_level": outcome.report_level,
            "created_at": datetime.utcnow().isoformat(),
        },
    )
    await db.commit()

    # Count outcomes in this grid cell
    result = await db.execute(
        text("SELECT COUNT(*) FROM drilling_outcomes WHERE grid_cell = :gc"),
        {"gc": grid_cell},
    )
    count = result.scalar() or 0

    return DrillingOutcomeResponse(
        id=outcome_id,
        message="Outcome recorded for regional calibration",
        grid_cell=grid_cell,
        outcomes_in_cell=count,
    )


@router.get("/stats/{lat}/{lon}", response_model=RegionalStatsResponse)
async def get_regional_stats(
    lat: float,
    lon: float,
    db: AsyncSession = Depends(get_db),
):
    """Get regional learning statistics for a grid cell."""
    grid_lat = round(lat * 2) / 2
    grid_lon = round(lon * 2) / 2
    grid_cell = f"{grid_lat:.1f},{grid_lon:.1f}"

    result = await db.execute(
        text("""
            SELECT
                COUNT(*) as cnt,
                AVG(ABS(actual_depth_m - predicted_depth_m) / NULLIF(predicted_depth_m, 0) * 100) as avg_depth_err,
                AVG(ABS(actual_yield_m3h - predicted_yield_m3h) / NULLIF(predicted_yield_m3h, 0) * 100) as avg_yield_err,
                AVG(CASE WHEN was_successful THEN 1.0 ELSE 0.0 END) as success_rate,
                AVG(actual_depth_m / NULLIF(predicted_depth_m, 0)) as depth_factor,
                AVG(actual_yield_m3h / NULLIF(predicted_yield_m3h, 0)) as yield_factor
            FROM drilling_outcomes
            WHERE grid_cell = :gc
        """),
        {"gc": grid_cell},
    )
    row = result.fetchone()
    if not row or row[0] == 0:
        raise HTTPException(status_code=404, detail=f"No outcomes in grid cell {grid_cell}")

    return RegionalStatsResponse(
        grid_cell=grid_cell,
        outcome_count=row[0],
        avg_depth_error_pct=round(row[1] or 0, 1),
        avg_yield_error_pct=round(row[2] or 0, 1),
        success_rate=round(row[3] or 0, 2),
        depth_correction_factor=round(row[4] or 1.0, 3),
        yield_correction_factor=round(row[5] or 1.0, 3),
    )


@router.get("/bulk-export")
async def export_all_outcomes(
    db: AsyncSession = Depends(get_db),
):
    """Export all drilling outcomes for frontend sync."""
    result = await db.execute(
        text("SELECT * FROM drilling_outcomes ORDER BY created_at DESC LIMIT 1000")
    )
    rows = result.fetchall()
    columns = result.keys()
    return [dict(zip(columns, row)) for row in rows]
