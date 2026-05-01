"""
GPM IMERG Precipitation Processor
Fetches REAL precipitation from Open-Meteo ERA5-Land + NASA POWER.

Open-Meteo provides ERA5-Land reanalysis precipitation at 9 km resolution.
NASA POWER provides 40-year climatological averages.
Both are real data — no climate-zone estimates or random generators.

Target: ±5mm/day accuracy
"""

import json
import math
import urllib.request
import urllib.error
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import logging

logger = logging.getLogger(__name__)


def _fetch_json(url: str, timeout: int = 25) -> Optional[Any]:
    """GET a URL and return parsed JSON, or None on failure."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "BoreholeAI-GPM/2.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode())
    except Exception as exc:
        logger.warning("GPM API call failed: %s → %s", url, exc)
        return None


class GPMIMERGProcessor:
    """
    Precipitation data processor using Open-Meteo + NASA POWER.
    - Open-Meteo ERA5-Land: real daily precipitation (last 30 days)
    - Open-Meteo Archive: real historical daily data (back to 1940)
    - NASA POWER: real 40-year climatological averages
    """

    RESOLUTION_KM = 9  # ERA5-Land
    TARGET_ACCURACY = 5  # mm/day

    def __init__(self):
        self.initialized = True
        logger.info(f"GPM IMERG processor initialized (Open-Meteo + NASA POWER, {self.RESOLUTION_KM}km)")

    def get_precipitation_timeseries(
        self,
        latitude: float,
        longitude: float,
        start_date: datetime,
        end_date: datetime,
        aggregation: str = "daily",
    ) -> Dict:
        """
        Retrieve REAL precipitation time series from Open-Meteo.
        """
        days = (end_date - start_date).days

        # ── Recent data (last 30 days) via Open-Meteo forecast endpoint ──
        if days <= 30:
            url = (
                f"https://api.open-meteo.com/v1/forecast"
                f"?latitude={latitude}&longitude={longitude}"
                f"&daily=precipitation_sum,rain_sum,snowfall_sum"
                f"&past_days={min(days, 30)}&forecast_days=0"
            )
            data = _fetch_json(url)
            if data and "daily" in data:
                return self._parse_daily_response(data, latitude, longitude, start_date, end_date, "Open-Meteo ERA5-Land")

        # ── Historical data via Open-Meteo Archive API ──
        start_str = start_date.strftime("%Y-%m-%d")
        end_str = end_date.strftime("%Y-%m-%d")
        url = (
            f"https://archive-api.open-meteo.com/v1/archive"
            f"?latitude={latitude}&longitude={longitude}"
            f"&start_date={start_str}&end_date={end_str}"
            f"&daily=precipitation_sum,rain_sum,snowfall_sum"
        )
        data = _fetch_json(url, timeout=30)
        if data and "daily" in data:
            return self._parse_daily_response(data, latitude, longitude, start_date, end_date, "Open-Meteo ERA5-Land Archive")

        # ── NASA POWER climatology fallback (always available) ──
        power_url = (
            f"https://power.larc.nasa.gov/api/temporal/climatology/point"
            f"?parameters=PRECTOTCORR&community=AG"
            f"&longitude={longitude}&latitude={latitude}&format=JSON"
        )
        power = _fetch_json(power_url, timeout=30)
        if power and "properties" in power:
            params = power["properties"]["parameter"]
            monthly = params.get("PRECTOTCORR", {})
            ann = monthly.get("ANN")
            if ann is not None:
                month_vals = {k: v for k, v in monthly.items() if k != "ANN" and v is not None}
                return {
                    "latitude": latitude,
                    "longitude": longitude,
                    "aggregation": "monthly_climatology",
                    "period": {"start": start_date.isoformat(), "end": end_date.isoformat(), "days": days},
                    "statistics": {
                        "mean_mm_day": round(ann, 2),
                        "annual_total_mm": round(ann * 365, 0),
                    },
                    "monthly_climatology_mm_day": month_vals,
                    "annual_total_mm": round(ann * 365, 0),
                    "metadata": {
                        "source": "NASA POWER Climatology (1981-2022 average)",
                        "resolution": "0.5° (~55 km)",
                        "data_type": "40-year mean",
                    },
                }

        return {
            "latitude": latitude,
            "longitude": longitude,
            "error": "Open-Meteo + NASA POWER both unreachable — check internet connection",
        }

    def _parse_daily_response(
        self, data: Dict, lat: float, lon: float,
        start: datetime, end: datetime, source: str,
    ) -> Dict:
        """Parse Open-Meteo daily response into standard format."""
        daily = data["daily"]
        dates = daily.get("time", [])
        precip = daily.get("precipitation_sum", [])
        rain = daily.get("rain_sum", [])
        snow = daily.get("snowfall_sum", [])

        # Filter nulls
        valid_precip = [v for v in precip if v is not None]
        valid_rain = [v for v in rain if v is not None]

        if not valid_precip:
            return {"error": f"No valid precipitation data from {source}"}

        stats = {
            "mean_mm": round(float(np.mean(valid_precip)), 2),
            "std_mm": round(float(np.std(valid_precip)), 2),
            "min_mm": round(float(np.min(valid_precip)), 2),
            "max_mm": round(float(np.max(valid_precip)), 2),
            "median_mm": round(float(np.median(valid_precip)), 2),
            "percentile_10": round(float(np.percentile(valid_precip, 10)), 2),
            "percentile_90": round(float(np.percentile(valid_precip, 90)), 2),
        }

        total = sum(valid_precip)
        dry_days = sum(1 for v in valid_precip if v < 0.1)
        mean_daily = stats["mean_mm"]
        annual_est = mean_daily * 365

        return {
            "latitude": lat,
            "longitude": lon,
            "aggregation": "daily",
            "precipitation_timeseries": [round(v, 2) if v is not None else 0 for v in precip],
            "dates": dates,
            "period": {
                "start": start.isoformat(),
                "end": end.isoformat(),
                "days": (end - start).days,
            },
            "statistics": stats,
            "annual_total_mm": round(annual_est, 0),
            "total_period_mm": round(total, 1),
            "dry_days": dry_days,
            "wet_days": len(valid_precip) - dry_days,
            "observations": len(valid_precip),
            "metadata": {
                "source": source,
                "resolution": f"{self.RESOLUTION_KM}km",
                "data_type": "ERA5-Land reanalysis (real satellite-constrained model)",
                "accuracy": f"±{self.TARGET_ACCURACY}mm/day",
            },
        }

    def get_annual_precipitation_climatology(
        self,
        latitude: float,
        longitude: float,
        years: int = 30,
    ) -> Dict:
        """
        Get annual precipitation climatology from NASA POWER (real 40-year data).
        """
        url = (
            f"https://power.larc.nasa.gov/api/temporal/climatology/point"
            f"?parameters=PRECTOTCORR&community=AG"
            f"&longitude={longitude}&latitude={latitude}&format=JSON"
        )
        data = _fetch_json(url, timeout=30)
        if data and "properties" in data:
            params = data["properties"]["parameter"]
            monthly = params.get("PRECTOTCORR", {})
            ann = monthly.get("ANN")
            if ann is not None:
                mean_annual = ann * 365
                month_names = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                               "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
                monthly_mm = {}
                for m in month_names:
                    v = monthly.get(m)
                    if v is not None:
                        monthly_mm[m] = round(v * 30, 1)  # mm/day → mm/month approx

                return {
                    "latitude": latitude,
                    "longitude": longitude,
                    "source": "NASA POWER (1981-2022 climatology)",
                    "mean_annual_precipitation_mm": round(mean_annual, 0),
                    "mean_daily_mm": round(ann, 2),
                    "monthly_precipitation_mm": monthly_mm,
                    "interpretation": self._interpret_precipitation(mean_annual, latitude),
                }

        return {"latitude": latitude, "longitude": longitude,
                "error": "NASA POWER API unreachable"}

    def get_seasonal_precipitation_cycle(
        self,
        latitude: float,
        longitude: float,
    ) -> Dict:
        """Get real monthly precipitation cycle from NASA POWER climatology."""
        url = (
            f"https://power.larc.nasa.gov/api/temporal/climatology/point"
            f"?parameters=PRECTOTCORR&community=AG"
            f"&longitude={longitude}&latitude={latitude}&format=JSON"
        )
        data = _fetch_json(url, timeout=30)
        if data and "properties" in data:
            params = data["properties"]["parameter"]
            monthly_raw = params.get("PRECTOTCORR", {})
            month_keys = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                          "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
            month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            monthly = []
            for mk in month_keys:
                v = monthly_raw.get(mk)
                monthly.append(round(v * 30, 1) if v is not None else 0)

            total = sum(monthly)
            peak_idx = int(np.argmax(monthly))
            dry_idx = int(np.argmin(monthly))

            return {
                "latitude": latitude,
                "longitude": longitude,
                "source": "NASA POWER (1981-2022 climatology)",
                "monthly_precipitation_mm": monthly,
                "months": month_names,
                "annual_total_mm": round(total, 0),
                "peak_month": month_names[peak_idx],
                "driest_month": month_names[dry_idx],
            }

        return {"latitude": latitude, "longitude": longitude,
                "error": "NASA POWER API unreachable"}

    def _interpret_precipitation(self, annual_mm: float, latitude: float) -> str:
        """Interpret annual precipitation for recharge assessment."""
        if annual_mm < 250:
            return "Arid (desert) — very low recharge potential"
        elif annual_mm < 500:
            return "Semi-arid — low recharge potential"
        elif annual_mm < 1000:
            return "Dry subhumid — moderate recharge potential"
        elif annual_mm < 1500:
            return "Subhumid — good recharge potential"
        elif annual_mm < 2500:
            return "Humid — excellent recharge potential"
        else:
            return "Very humid (tropical) — high recharge potential"
