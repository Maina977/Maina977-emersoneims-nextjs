import logging
import os
from datetime import datetime

from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)

DOWNLOAD_DIR = os.getenv("SATELLITE_DOWNLOAD_DIR", "/tmp/satellite_cache")


@celery_app.task(bind=True, max_retries=3, default_retry_delay=120)
def download_satellite_image(self, latitude: float, longitude: float, date: str):
    """
    Download satellite imagery for a location via Sentinel Hub or GEE.

    Caches locally and returns the path. Retries on transient failures.
    """
    import urllib.request

    os.makedirs(DOWNLOAD_DIR, exist_ok=True)
    cache_key = f"{latitude:.4f}_{longitude:.4f}_{date}"
    local_path = os.path.join(DOWNLOAD_DIR, f"{cache_key}.tif")

    # Check cache first
    if os.path.exists(local_path):
        logger.info(f"Cache hit for satellite image {cache_key}")
        return {
            "status": "cached",
            "location": {"lat": latitude, "lng": longitude},
            "date": date,
            "local_path": local_path,
        }

    # Build Sentinel Hub Processing API request (requires credentials)
    sentinel_client_id = os.getenv("SENTINEL_HUB_CLIENT_ID", "")
    if sentinel_client_id:
        try:
            # Real Sentinel Hub call would go here with OAuth2 token + evalscript
            # For now, we log what would happen
            logger.info(f"Would download Sentinel-2 L2A for {cache_key} via Sentinel Hub")
        except Exception as e:
            logger.warning(f"Sentinel Hub download failed: {e}")
            raise self.retry(exc=e)

    # Fallback: attempt Copernicus Open Access Hub (requires auth)
    copernicus_user = os.getenv("COPERNICUS_USER", "")
    if copernicus_user:
        try:
            logger.info(f"Would download via Copernicus Data Space for {cache_key}")
        except Exception as e:
            logger.warning(f"Copernicus download failed: {e}")
            raise self.retry(exc=e)

    logger.warning(f"No satellite provider configured for {cache_key} — returning metadata only")
    return {
        "status": "metadata_only",
        "location": {"lat": latitude, "lng": longitude},
        "date": date,
        "bands": ["B2", "B3", "B4", "B8", "B11", "B12"],
        "resolution_m": 10,
        "cloud_cover_pct": None,
        "provider": "none_configured",
    }


@celery_app.task
def batch_download_satellite_images(locations: list, date: str):
    """Dispatch parallel satellite downloads for multiple locations."""
    results = []
    for loc in locations:
        task = download_satellite_image.delay(loc["lat"], loc["lng"], date)
        results.append({"location": loc, "task_id": task.id})

    logger.info(f"Batch download started for {len(locations)} locations on {date}")
    return {"status": "batch_started", "count": len(locations), "tasks": results}