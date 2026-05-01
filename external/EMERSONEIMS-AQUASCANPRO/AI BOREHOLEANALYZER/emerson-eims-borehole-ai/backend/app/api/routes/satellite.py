"""
API Route: Satellite Data & Spectral Analysis
Provides endpoints for querying satellite imagery and computing spectral indices
"""

from fastapi import APIRouter, HTTPException, Query, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import logging
from typing import Optional, Dict
import json
import numpy as np
from datetime import datetime, timedelta

from app.database.config import get_db
from app.database.models import SatelliteData, AnalysisJob, BoreholeSite
from app.services.earth_engine_client import EarthEngineClient
from app.services.spectral_indices import SpectralIndicesCalculator
from app.core.schemas import LocationQuery, SatelliteResponse, IndicesResponse, JobResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/satellite", tags=["satellite"])

# Initialize Earth Engine client (lazy)
ee_client = None


def get_ee_client():
    """Lazy load Earth Engine client"""
    global ee_client
    if ee_client is None:
        ee_client = EarthEngineClient()
    return ee_client


# ============ SATELLITE QUERY ENDPOINTS ============

@router.post("/query", response_model=SatelliteResponse)
async def query_satellite(
    location: LocationQuery,
    start_date: str = Query("2023-01-01", description="Start date (YYYY-MM-DD)"),
    end_date: str = Query("2024-01-01", description="End date (YYYY-MM-DD)"),
    sensors: str = Query("sentinel2,landsat", description="Comma-separated sensor list"),
    cloud_cover: int = Query(20, ge=0, le=100, description="Max cloud cover %"),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    """
    Query satellite imagery for a location

    - **lat/lon**: Location coordinates (WGS84)
    - **start_date/end_date**: Date range for imagery
    - **sensors**: sentinel1, sentinel2, landsat8, landsat9, all
    - **cloud_cover**: Maximum acceptable cloud cover (%)

    Returns satellite bands for all available dates
    """
    try:
        ee = get_ee_client()

        # Parse inputs
        bbox = {
            'north': location.lat + 0.01,
            'south': location.lat - 0.01,
            'east': location.lon + 0.01,
            'west': location.lon - 0.01
        }

        logger.info(f"Satellite query: {location.lat}, {location.lon} | {sensors}")

        # Query each sensor
        results = {}

        if 'sentinel2' in sensors or 'all' in sensors:
            try:
                s2_data = ee.query_sentinel2(
                    bbox=bbox,
                    start_date=start_date,
                    end_date=end_date,
                    cloud_cover_pct=cloud_cover
                )
                results['sentinel2'] = s2_data
            except Exception as e:
                logger.warning(f"Sentinel-2 query failed: {e}")

        if 'sentinel1' in sensors or 'all' in sensors:
            try:
                s1_data = ee.query_sentinel1(
                    bbox=bbox,
                    start_date=start_date,
                    end_date=end_date
                )
                results['sentinel1'] = s1_data
            except Exception as e:
                logger.warning(f"Sentinel-1 query failed: {e}")

        if 'landsat' in sensors or 'all' in sensors:
            try:
                l8_data = ee.query_landsat89(
                    bbox=bbox,
                    start_date=start_date,
                    end_date=end_date
                )
                results['landsat'] = l8_data
            except Exception as e:
                logger.warning(f"Landsat query failed: {e}")

        # Store in database
        satellite_record = SatelliteData(
            location_lat=location.lat,
            location_lon=location.lon,
            sensor_type=sensors,
            start_date=datetime.strptime(start_date, "%Y-%m-%d"),
            end_date=datetime.strptime(end_date, "%Y-%m-%d"),
            cloud_cover_pct=cloud_cover,
            bands_metadata=json.dumps(results),
            query_timestamp=datetime.utcnow()
        )
        db.add(satellite_record)
        db.commit()

        return SatelliteResponse(
            location=location,
            date_range={"start": start_date, "end": end_date},
            sensors=sensors.split(","),
            bands_available=list(results.keys()),
            data_points=len(results),
            storage_id=satellite_record.id
        )

    except Exception as e:
        logger.error(f"Satellite query failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dem/{location_id}")
async def get_dem(
    location_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve Digital Elevation Model for location"""
    try:
        ee = get_ee_client()

        site = db.query(BoreholeSite).filter(BoreholeSite.id == location_id).first()
        if not site:
            raise HTTPException(status_code=404, detail="Site not found")

        bbox = {
            'north': site.latitude + 0.02,
            'south': site.latitude - 0.02,
            'east': site.longitude + 0.02,
            'west': site.longitude - 0.02
        }

        dem_data = ee.query_srtm_dem(bbox=bbox)

        return {
            "location": {"lat": site.latitude, "lon": site.longitude},
            "dem": dem_data,
            "resolution_m": 30,
            "source": "SRTM"
        }

    except Exception as e:
        logger.error(f"DEM retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/climate/{location_id}")
async def get_climate(
    location_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve climate data (CHIRPS, MERRA2)"""
    try:
        ee = get_ee_client()

        site = db.query(BoreholeSite).filter(BoreholeSite.id == location_id).first()
        if not site:
            raise HTTPException(status_code=404, detail="Site not found")

        bbox = {
            'north': site.latitude + 0.05,
            'south': site.latitude - 0.05,
            'east': site.longitude + 0.05,
            'west': site.longitude - 0.05
        }

        # 30-year rainfall history
        chirps_data = ee.query_chirps_rainfall(
            bbox=bbox,
            start_date="1993-01-01",
            end_date="2024-01-01"
        )

        merra2_data = ee.query_merra2_climate(
            bbox=bbox,
            start_date="2020-01-01",
            end_date="2024-01-01"
        )

        return {
            "location": {"lat": site.latitude, "lon": site.longitude},
            "rainfall": chirps_data,
            "meteorology": merra2_data,
            "history_years": 30
        }

    except Exception as e:
        logger.error(f"Climate data retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/gravity/{location_id}")
async def get_gravity(
    location_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve gravity anomaly data for hydrogeological analysis"""
    try:
        ee = get_ee_client()

        site = db.query(BoreholeSite).filter(BoreholeSite.id == location_id).first()
        if not site:
            raise HTTPException(status_code=404, detail="Site not found")

        bbox = {
            'north': site.latitude + 0.1,
            'south': site.latitude - 0.1,
            'east': site.longitude + 0.1,
            'west': site.longitude - 0.1
        }

        grace_data = ee.query_grace_gravity(bbox=bbox)

        return {
            "location": {"lat": site.latitude, "lon": site.longitude},
            "gravity_anomaly": grace_data,
            "units": "mGal",
            "source": "GRACE"
        }

    except Exception as e:
        logger.error(f"Gravity data retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ SPECTRAL INDICES ENDPOINTS ============

@router.post("/indices", response_model=IndicesResponse)
async def compute_spectral_indices(
    satellite_data_id: int,
    db: Session = Depends(get_db)
):
    """
    Compute all 28 spectral indices from satellite data

    Returns: Vegetation, water, soil, thermal indices
    """
    try:
        # Retrieve satellite data
        sat_data = db.query(SatelliteData).filter(SatelliteData.id == satellite_data_id).first()
        if not sat_data:
            raise HTTPException(status_code=404, detail="Satellite data not found")

        # Parse bands
        bands_metadata = json.loads(sat_data.bands_metadata)

        # Create calculator
        calculator = SpectralIndicesCalculator(bands=bands_metadata)

        # Compute all indices
        all_indices = calculator.compute_all_indices()

        # Store results
        indices_record = SpectralIndices(
            satellite_data_id=satellite_data_id,
            ndvi=float(np.nanmean(all_indices.get('NDVI', [0]))),
            evi=float(np.nanmean(all_indices.get('EVI', [0]))),
            ndwi=float(np.nanmean(all_indices.get('NDWI', [0]))),
            ndbi=float(np.nanmean(all_indices.get('NDBI', [0]))),
            bsi=float(np.nanmean(all_indices.get('BSI', [0]))),
            all_indices_json=json.dumps({k: float(np.nanmean(v)) for k, v in all_indices.items()}),
            computed_at=datetime.utcnow()
        )
        db.add(indices_record)
        db.commit()

        return IndicesResponse(
            satellite_data_id=satellite_data_id,
            indices_computed=len(all_indices),
            major_indices={
                'NDVI': float(np.nanmean(all_indices.get('NDVI', [0]))),
                'EVI': float(np.nanmean(all_indices.get('EVI', [0]))),
                'NDWI': float(np.nanmean(all_indices.get('NDWI', [0]))),
                'NDBI': float(np.nanmean(all_indices.get('NDBI', [0]))),
                'BSI': float(np.nanmean(all_indices.get('BSI', [0])))
            },
            storage_id=indices_record.id
        )

    except Exception as e:
        logger.error(f"Spectral indices computation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/indices/{indices_id}")
async def get_spectral_indices(
    indices_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve computed spectral indices"""
    try:
        indices = db.query(SpectralIndices).filter(SpectralIndices.id == indices_id).first()
        if not indices:
            raise HTTPException(status_code=404, detail="Indices not found")

        all_indices = json.loads(indices.all_indices_json)

        return {
            "indices_id": indices_id,
            "computed_at": indices.computed_at.isoformat(),
            "indices": all_indices,
            "count": len(all_indices)
        }

    except Exception as e:
        logger.error(f"Indices retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
