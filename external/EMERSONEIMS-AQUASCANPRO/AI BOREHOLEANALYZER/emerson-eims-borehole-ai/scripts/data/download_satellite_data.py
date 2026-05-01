#!/usr/bin/env python3
"""
Download real satellite-derived data from free APIs.
Uses Open-Meteo ERA5-Land and NASA POWER — no credentials required.
"""
import json
import urllib.request
from datetime import datetime


def _fetch_json(url: str, timeout: int = 20):
    req = urllib.request.Request(url, headers={"User-Agent": "BoreholeAI/2.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode())


def download_satellite_data(latitude, longitude, date):
    """Download real climate + soil moisture data from Open-Meteo + NASA POWER."""
    print(f"Downloading satellite-derived data for {latitude}, {longitude} on {date}")

    result = {
        "status": "error",
        "latitude": latitude,
        "longitude": longitude,
        "date": date,
    }

    # Open-Meteo ERA5-Land for soil moisture + precipitation
    try:
        url = (
            f"https://archive-api.open-meteo.com/v1/archive"
            f"?latitude={latitude}&longitude={longitude}"
            f"&start_date={date}&end_date={date}"
            f"&daily=soil_moisture_0_to_7cm,precipitation_sum,temperature_2m_mean"
        )
        data = _fetch_json(url)
        daily = data.get("daily", {})
        result["soil_moisture"] = (daily.get("soil_moisture_0_to_7cm") or [None])[0]
        result["precipitation_mm"] = (daily.get("precipitation_sum") or [None])[0]
        result["temperature_c"] = (daily.get("temperature_2m_mean") or [None])[0]
        result["source"] = "Open-Meteo ERA5-Land"
        result["status"] = "downloaded"
        print(f"  Soil moisture: {result['soil_moisture']} m³/m³")
        print(f"  Precipitation: {result['precipitation_mm']} mm")
        print(f"  Temperature: {result['temperature_c']} °C")
    except Exception as e:
        print(f"  Open-Meteo failed: {e}")

    # NASA POWER for solar radiation
    try:
        ds = date.replace("-", "")[:8]
        url = (
            f"https://power.larc.nasa.gov/api/temporal/daily/point"
            f"?parameters=ALLSKY_SFC_SW_DWN&community=AG"
            f"&longitude={longitude}&latitude={latitude}"
            f"&start={ds}&end={ds}&format=JSON"
        )
        data = _fetch_json(url)
        vals = data.get("properties", {}).get("parameter", {}).get("ALLSKY_SFC_SW_DWN", {})
        if vals:
            result["solar_radiation_kwh_m2"] = list(vals.values())[0]
            print(f"  Solar radiation: {result['solar_radiation_kwh_m2']} kWh/m²")
    except Exception as e:
        print(f"  NASA POWER failed: {e}")

    return result


if __name__ == "__main__":
    result = download_satellite_data(-0.9026, 37.1875, "2024-01-15")
    print(json.dumps(result, indent=2))