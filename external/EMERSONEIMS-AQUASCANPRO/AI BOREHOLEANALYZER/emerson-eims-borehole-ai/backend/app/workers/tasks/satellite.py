import logging
import os

from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)

# GLDAS / MODIS / Sentinel-2 public endpoints
GLDAS_BASE = "https://ldas.gsfc.nasa.gov/gldas"
MODIS_BASE = "https://modis.ornl.gov/rst/api/v1"


@celery_app.task(bind=True, max_retries=3, default_retry_delay=120)
def download_satellite_data(self, latitude: float, longitude: float, date: str):
    """
    Download satellite-derived environmental data for a location.

    Fetches NDVI, soil moisture, and precipitation from public REST APIs.
    Falls back to default estimates if APIs are unavailable.
    """
    import urllib.request
    import json

    result = {
        "status": "downloaded",
        "location": {"lat": latitude, "lng": longitude},
        "date": date,
        "bands": [],
        "source": "fallback",
    }

    # --- MODIS NDVI (MOD13Q1 — 250m, 16-day) ---
    try:
        url = f"{MODIS_BASE}/MOD13Q1/subset?latitude={latitude}&longitude={longitude}&band=250m_16_days_NDVI&startDate=A{date.replace('-', '')}&endDate=A{date.replace('-', '')}&kmAboveBelow=0&kmLeftRight=0"
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read())
        ndvi_raw = data.get("subset", [{}])[0].get("data", [0])[0]
        result["ndvi"] = round(ndvi_raw * 0.0001, 4)  # Scale factor
        result["bands"].append("NDVI")
        result["source"] = "MODIS"
        logger.info(f"MODIS NDVI for ({latitude},{longitude}): {result['ndvi']}")
    except Exception as e:
        logger.warning(f"MODIS NDVI fetch failed: {e}")
        result["ndvi"] = None
        result["ndvi_error"] = str(e)

    # --- Soil moisture from Open-Meteo ERA5-Land (real API) ---
    try:
        sm_url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}&longitude={longitude}"
            f"&current=soil_moisture_0_to_7cm,soil_moisture_7_to_28cm,soil_moisture_28_to_100cm"
            f"&forecast_days=0"
        )
        sm_req = urllib.request.Request(sm_url, headers={"Accept": "application/json"})
        sm_resp = urllib.request.urlopen(sm_req, timeout=20)
        sm_data = json.loads(sm_resp.read())
        current = sm_data.get("current", {})
        sm_shallow = current.get("soil_moisture_0_to_7cm")
        sm_mid = current.get("soil_moisture_7_to_28cm")
        sm_deep = current.get("soil_moisture_28_to_100cm")
        # Weighted average across depths
        vals = [v for v in [sm_shallow, sm_mid, sm_deep] if v is not None]
        if vals:
            result["soil_moisture"] = round(sum(vals) / len(vals), 4)
            result["soil_moisture_depths"] = {
                "0_7cm": sm_shallow, "7_28cm": sm_mid, "28_100cm": sm_deep
            }
            result["bands"].append("SoilMoisture")
            result["source"] = result.get("source", "") + "+Open-Meteo"
            logger.info(f"Open-Meteo soil moisture for ({latitude},{longitude}): {result['soil_moisture']}")
        else:
            result["soil_moisture"] = None
            result["soil_moisture_error"] = "Open-Meteo returned no soil moisture values"
    except Exception as e:
        logger.warning(f"Open-Meteo soil moisture fetch failed: {e}")
        result["soil_moisture"] = None
        result["soil_moisture_error"] = str(e)

    # --- Precipitation from NASA POWER API (real long-term climatology) ---
    try:
        power_url = (
            f"https://power.larc.nasa.gov/api/temporal/climatology/point"
            f"?parameters=PRECTOTCORR&community=AG&longitude={longitude}&latitude={latitude}&format=JSON"
        )
        power_req = urllib.request.Request(power_url, headers={"Accept": "application/json"})
        power_resp = urllib.request.urlopen(power_req, timeout=30)
        power_data = json.loads(power_resp.read())
        daily_precip = power_data.get("properties", {}).get("parameter", {}).get("PRECTOTCORR", {}).get("ANN")
        if daily_precip is not None:
            result["annual_precipitation_mm"] = round(daily_precip * 365, 1)
            result["bands"].append("Precipitation")
            result["source"] = result.get("source", "") + "+NASA-POWER"
            logger.info(f"NASA POWER precipitation for ({latitude},{longitude}): {result['annual_precipitation_mm']} mm/yr")
        else:
            result["annual_precipitation_mm"] = None
            result["precipitation_error"] = "NASA POWER returned no precipitation data"
    except Exception as e:
        logger.warning(f"NASA POWER precipitation fetch failed: {e}")
        result["annual_precipitation_mm"] = None
        result["precipitation_error"] = str(e)

    result["resolution_m"] = 250
    logger.info(f"Satellite data for ({latitude},{longitude}): {len(result['bands'])} bands")
    return result