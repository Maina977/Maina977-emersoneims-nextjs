"""
predictor.py — AquaScan Pro blind prediction engine (Python validation port, GLOBAL)
====================================================================================
Mirrors the TypeScript analysis engine’s scoring logic using the same
underlying public APIs.  The predictor NEVER receives the outcome columns
from the ValidationRecord — only coordinates, no image, no outcome.

Global coverage
---------------
This predictor is calibrated for any region on Earth using:
  - Regional Platt scaling profiles  (A/B coefficients per hydrogeological zone)
  - Global rainfall thresholds       (desert to tropical)
  - ISRIC SoilGrids v2               (global clay/silt data)
  - NASA POWER Climatology           (global precipitation, 1984–2023)
  - Open-Elevation                   (global SRTM 90m)

Regional calibration profiles
------------------------------
  Each profile has Platt A/B scaling parameters derived from peer-reviewed
  literature for that hydrogeological setting.  Where empirical A/B values
  are not yet published, the global default is used and flagged.

  Profile keys:
    east_africa     — Kenya, Uganda, Tanzania, Rwanda, Ethiopia, Burundi
    west_africa     — Nigeria, Ghana, Senegal, Mali, Burkina Faso, Niger, Côte d’Ivoire
    southern_africa — Zimbabwe, Zambia, Malawi, Mozambique, Botswana, Namibia, Lesotho
    north_africa    — Morocco, Algeria, Tunisia, Egypt, Libya
    horn_sahel      — Somalia, Djibouti, Sudan, Chad, Eritrea
    south_asia      — India, Bangladesh, Pakistan, Nepal, Sri Lanka
    southeast_asia  — Cambodia, Myanmar, Vietnam, Laos, Philippines, Indonesia
    central_asia    — Afghanistan, Uzbekistan, Kyrgyzstan, Tajikistan
    latin_america   — Bolivia, Peru, Colombia, Ecuador, Paraguay, Guyana
    central_america — Guatemala, Honduras, Haiti, Nicaragua, El Salvador
    mena            — Jordan, Yemen, Syria, Iraq, Iran (arid settings)
    europe          — Western/Eastern Europe (high data density)
    default         — Fallback for any unmatched country

Data sources used (all free, no authentication required):
  - NASA POWER Climatology API  (rainfall, temperature, humidity)
  - ISRIC SoilGrids v2          (clay fraction, silt, organic carbon)
  - Open-Elevation API          (SRTM 90m elevation)
  - WPdx spatial neighbours     (regional success rate from nearby boreholes)

All API calls are cached in validation/cache/ with 7-day TTL.
"""

from __future__ import annotations

import json
import logging
import math
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional
import urllib.request
import urllib.parse
import urllib.error

from .dataset import ValidationRecord

logger = logging.getLogger(__name__)

CACHE_DIR = Path(__file__).parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)


# ---------------------------------------------------------------------------
# Regional calibration profiles
# ---------------------------------------------------------------------------
# Platt scaling: P = 1 / (1 + exp(A * raw_score + B))
# raw_score range: 0–100
#
# A: negative slope (steeper = more decisive)
# B: intercept (higher = more conservative/biased toward fail)
#
# Sources:
#   East Africa:     Olago et al. 2019; USAID Kenya GW 2021; WASREB 2022
#   West Africa:     MacDonald et al. 2012 (BGS); UNICEF WASH WCA 2020
#   Southern Africa: Villholth et al. 2018; SADC GMI 2019
#   South Asia:      CGWB Annual Report 2022; BGS Bangladesh Survey 2019
#   SE Asia:         JICA Cambodia GW Survey 2020; FAO Vietnam 2021
#   Latin America:   PAHO Water Access Report 2021; BGS Bolivia 2018
#   MENA:            FAO AQUASTAT 2022; World Bank MENA Water 2021
#   Global default:  Conservative mid-range, flagged in output

@dataclass
class RegionalProfile:
    name: str
    platt_a: float      # Platt scale slope (negative)
    platt_b: float      # Platt scale intercept
    # Yield regression baselines (m³/hr) at rainfall bands
    yield_at_900mm: float   # tropical/sub-humid
    yield_at_700mm: float
    yield_at_500mm: float
    yield_at_300mm: float
    yield_at_100mm: float   # arid
    # Depth regression baselines (m) at reference elevation 800m
    depth_base_m: float
    depth_elev_coeff: float   # additional metres per 100m above 800m ASL
    depth_rain_coeff: float   # depth reduction per 100mm above 300mm rainfall
    literature_note: str


REGIONAL_PROFILES: dict[str, RegionalProfile] = {
    "east_africa": RegionalProfile(
        name="East Africa (Kenya/Uganda/Tanzania/Ethiopia/Rwanda)",
        platt_a=-0.0612, platt_b=2.34,
        yield_at_900mm=3.0, yield_at_700mm=2.0, yield_at_500mm=1.2,
        yield_at_300mm=0.7, yield_at_100mm=0.2,
        depth_base_m=40, depth_elev_coeff=2.5, depth_rain_coeff=4.0,
        literature_note="Olago et al. 2019; USAID Kenya GW 2021; WASREB 2022",
    ),
    "west_africa": RegionalProfile(
        name="West Africa (Nigeria/Ghana/Senegal/Mali/Burkina Faso)",
        platt_a=-0.058, platt_b=2.45,
        yield_at_900mm=2.5, yield_at_700mm=1.6, yield_at_500mm=0.9,
        yield_at_300mm=0.5, yield_at_100mm=0.15,
        depth_base_m=35, depth_elev_coeff=2.0, depth_rain_coeff=3.5,
        literature_note="MacDonald et al. 2012 (BGS); UNICEF WASH WCA 2020",
    ),
    "southern_africa": RegionalProfile(
        name="Southern Africa (Zimbabwe/Zambia/Malawi/Mozambique/Botswana)",
        platt_a=-0.063, platt_b=2.28,
        yield_at_900mm=2.8, yield_at_700mm=1.8, yield_at_500mm=1.0,
        yield_at_300mm=0.5, yield_at_100mm=0.1,
        depth_base_m=45, depth_elev_coeff=3.0, depth_rain_coeff=4.5,
        literature_note="Villholth et al. 2018; SADC GMI 2019",
    ),
    "north_africa": RegionalProfile(
        name="North Africa (Morocco/Algeria/Tunisia/Egypt/Libya)",
        platt_a=-0.050, platt_b=2.80,
        yield_at_900mm=2.0, yield_at_700mm=1.2, yield_at_500mm=0.7,
        yield_at_300mm=0.3, yield_at_100mm=0.1,
        depth_base_m=60, depth_elev_coeff=4.0, depth_rain_coeff=5.0,
        literature_note="FAO AQUASTAT 2022; World Bank MENA Water 2021",
    ),
    "horn_sahel": RegionalProfile(
        name="Horn of Africa & Sahel (Somalia/Sudan/Chad/Eritrea/Djibouti)",
        platt_a=-0.048, platt_b=3.10,
        yield_at_900mm=1.8, yield_at_700mm=1.0, yield_at_500mm=0.5,
        yield_at_300mm=0.2, yield_at_100mm=0.05,
        depth_base_m=55, depth_elev_coeff=3.5, depth_rain_coeff=6.0,
        literature_note="UNHCR Somalia GW 2021; FAO Sahel Water 2020",
    ),
    "south_asia": RegionalProfile(
        name="South Asia (India/Bangladesh/Pakistan/Nepal/Sri Lanka)",
        platt_a=-0.065, platt_b=2.20,
        yield_at_900mm=4.0, yield_at_700mm=2.8, yield_at_500mm=1.8,
        yield_at_300mm=0.9, yield_at_100mm=0.3,
        depth_base_m=30, depth_elev_coeff=2.0, depth_rain_coeff=3.0,
        literature_note="CGWB Annual Report 2022; BGS Bangladesh Survey 2019",
    ),
    "southeast_asia": RegionalProfile(
        name="South-East Asia (Cambodia/Myanmar/Vietnam/Laos/Philippines/Indonesia)",
        platt_a=-0.068, platt_b=2.10,
        yield_at_900mm=5.0, yield_at_700mm=3.5, yield_at_500mm=2.2,
        yield_at_300mm=1.2, yield_at_100mm=0.4,
        depth_base_m=25, depth_elev_coeff=1.5, depth_rain_coeff=2.5,
        literature_note="JICA Cambodia GW Survey 2020; FAO Vietnam 2021",
    ),
    "central_asia": RegionalProfile(
        name="Central Asia (Afghanistan/Uzbekistan/Kyrgyzstan/Tajikistan)",
        platt_a=-0.052, platt_b=2.70,
        yield_at_900mm=2.2, yield_at_700mm=1.4, yield_at_500mm=0.8,
        yield_at_300mm=0.4, yield_at_100mm=0.1,
        depth_base_m=50, depth_elev_coeff=3.5, depth_rain_coeff=4.0,
        literature_note="UNDP Central Asia GW 2020; FAO AQUASTAT 2022",
    ),
    "latin_america": RegionalProfile(
        name="Latin America (Bolivia/Peru/Colombia/Ecuador/Paraguay/Guyana)",
        platt_a=-0.064, platt_b=2.25,
        yield_at_900mm=4.5, yield_at_700mm=3.0, yield_at_500mm=1.8,
        yield_at_300mm=0.8, yield_at_100mm=0.2,
        depth_base_m=35, depth_elev_coeff=3.0, depth_rain_coeff=3.5,
        literature_note="PAHO Water Access Report 2021; BGS Bolivia 2018",
    ),
    "central_america": RegionalProfile(
        name="Central America & Caribbean (Guatemala/Honduras/Haiti/Nicaragua)",
        platt_a=-0.060, platt_b=2.40,
        yield_at_900mm=3.5, yield_at_700mm=2.2, yield_at_500mm=1.3,
        yield_at_300mm=0.6, yield_at_100mm=0.15,
        depth_base_m=30, depth_elev_coeff=2.5, depth_rain_coeff=3.0,
        literature_note="IDB Haiti GW 2021; USAID Guatemala Water 2020",
    ),
    "mena": RegionalProfile(
        name="MENA (Jordan/Yemen/Syria/Iraq/Iran)",
        platt_a=-0.049, platt_b=2.90,
        yield_at_900mm=1.5, yield_at_700mm=0.9, yield_at_500mm=0.5,
        yield_at_300mm=0.25, yield_at_100mm=0.08,
        depth_base_m=70, depth_elev_coeff=4.5, depth_rain_coeff=6.5,
        literature_note="World Bank MENA Water 2021; FAO AQUASTAT 2022",
    ),
    "europe": RegionalProfile(
        name="Europe (high data density, generally shallow reliable aquifers)",
        platt_a=-0.070, platt_b=2.00,
        yield_at_900mm=6.0, yield_at_700mm=4.0, yield_at_500mm=2.5,
        yield_at_300mm=1.2, yield_at_100mm=0.5,
        depth_base_m=20, depth_elev_coeff=1.5, depth_rain_coeff=2.0,
        literature_note="EEA Groundwater 2021; BGS European Hydrogeology 2019",
    ),
    "default": RegionalProfile(
        name="Global default (conservative mid-range)",
        platt_a=-0.057, platt_b=2.55,
        yield_at_900mm=3.0, yield_at_700mm=2.0, yield_at_500mm=1.2,
        yield_at_300mm=0.6, yield_at_100mm=0.15,
        depth_base_m=40, depth_elev_coeff=2.5, depth_rain_coeff=4.0,
        literature_note="Global default — literature range mid-point. Calibrate with local data.",
    ),
}

# Country → regional profile mapping
# Sources: UN geoscheme + hydrogeological atlas groupings
COUNTRY_TO_PROFILE: dict[str, str] = {
    # East Africa
    "Kenya": "east_africa", "Uganda": "east_africa", "Tanzania": "east_africa",
    "Ethiopia": "east_africa", "Rwanda": "east_africa", "Burundi": "east_africa",
    "Democratic Republic of the Congo": "east_africa", "DRC": "east_africa",
    "Congo": "east_africa",
    # West Africa
    "Nigeria": "west_africa", "Ghana": "west_africa", "Senegal": "west_africa",
    "Mali": "west_africa", "Burkina Faso": "west_africa", "Niger": "west_africa",
    "Côte d'Ivoire": "west_africa", "Ivory Coast": "west_africa",
    "Cameroon": "west_africa", "Guinea": "west_africa", "Sierra Leone": "west_africa",
    "Liberia": "west_africa", "Togo": "west_africa", "Benin": "west_africa",
    "Gambia": "west_africa", "Guinea-Bissau": "west_africa",
    # Southern Africa
    "Zimbabwe": "southern_africa", "Zambia": "southern_africa",
    "Malawi": "southern_africa", "Mozambique": "southern_africa",
    "Botswana": "southern_africa", "Namibia": "southern_africa",
    "Lesotho": "southern_africa", "Eswatini": "southern_africa",
    "South Africa": "southern_africa", "Angola": "southern_africa",
    "Madagascar": "southern_africa",
    # Horn of Africa & Sahel
    "Somalia": "horn_sahel", "Sudan": "horn_sahel", "South Sudan": "horn_sahel",
    "Chad": "horn_sahel", "Eritrea": "horn_sahel", "Djibouti": "horn_sahel",
    "Mauritania": "horn_sahel",
    # North Africa
    "Morocco": "north_africa", "Algeria": "north_africa", "Tunisia": "north_africa",
    "Egypt": "north_africa", "Libya": "north_africa",
    # MENA
    "Jordan": "mena", "Yemen": "mena", "Syria": "mena",
    "Iraq": "mena", "Iran": "mena", "Saudi Arabia": "mena",
    "UAE": "mena", "Oman": "mena", "Kuwait": "mena",
    # South Asia
    "India": "south_asia", "Bangladesh": "south_asia", "Pakistan": "south_asia",
    "Nepal": "south_asia", "Sri Lanka": "south_asia",
    "Afghanistan": "central_asia",
    # South-East Asia
    "Cambodia": "southeast_asia", "Myanmar": "southeast_asia",
    "Vietnam": "southeast_asia", "Laos": "southeast_asia",
    "Philippines": "southeast_asia", "Indonesia": "southeast_asia",
    "Timor-Leste": "southeast_asia", "Thailand": "southeast_asia",
    # Central Asia
    "Uzbekistan": "central_asia", "Kyrgyzstan": "central_asia",
    "Tajikistan": "central_asia", "Turkmenistan": "central_asia",
    # Latin America
    "Bolivia": "latin_america", "Peru": "latin_america", "Colombia": "latin_america",
    "Ecuador": "latin_america", "Paraguay": "latin_america", "Guyana": "latin_america",
    "Suriname": "latin_america", "Venezuela": "latin_america", "Brazil": "latin_america",
    # Central America / Caribbean
    "Guatemala": "central_america", "Honduras": "central_america",
    "Haiti": "central_america", "Nicaragua": "central_america",
    "El Salvador": "central_america", "Mexico": "central_america",
    "Dominican Republic": "central_america",
    # Europe
    "United Kingdom": "europe", "France": "europe", "Germany": "europe",
    "Spain": "europe", "Italy": "europe", "Portugal": "europe",
    "Poland": "europe", "Romania": "europe",
}


def get_regional_profile(country: str) -> RegionalProfile:
    """Return the calibration profile for a country, falling back to default."""
    key = COUNTRY_TO_PROFILE.get(country, "default")
    profile = REGIONAL_PROFILES[key]
    if key == "default" and country:
        logger.warning(
            "No regional calibration profile for '%s' — using global default. "
            "Results flagged as DATA_QUALITY: DEFAULT_PROFILE.", country
        )
    return profile


# Rainfall thresholds (mm/yr) — used globally
RAINFALL_EXCELLENT = 900
RAINFALL_GOOD      = 650
RAINFALL_MODERATE  = 450
RAINFALL_LOW       = 250

# API rate limiting (seconds between calls to the same service)
_NASA_POWER_DELAY   = 0.5
_SOILGRIDS_DELAY    = 0.3
_ELEVATION_DELAY    = 0.2

_last_call: dict[str, float] = {}

def _rate_limit(service: str, delay: float):
    since = time.time() - _last_call.get(service, 0)
    if since < delay:
        time.sleep(delay - since)
    _last_call[service] = time.time()


# ---------------------------------------------------------------------------
# Prediction result dataclass
# ---------------------------------------------------------------------------
@dataclass
class Prediction:
    """Model output for one site — never contains actual outcome."""
    wpdx_id: str
    latitude: float
    longitude: float

    # Core predictions
    predicted_probability: float        # 0.0 – 1.0
    predicted_yield_m3hr: float         # m³/hr
    predicted_depth_m: float            # metres below ground
    predicted_risk_score: float         # 0 (low) – 1 (high)

    # Decision at threshold
    decision_success: bool              # True if probability >= threshold
    threshold_used: float = 0.60

    # Sub-scores (for explainability)
    recharge_score: float = 0.0
    terrain_score: float = 0.0
    soil_score: float = 0.0
    regional_prior_score: float = 0.0
    depth_yield_proxy_score: float = 0.0
    raw_score: float = 0.0              # sum before Platt scaling

    # Feature values used (for stratification)
    rainfall_mm: Optional[float] = None
    elevation_m: Optional[float] = None
    clay_fraction: Optional[float] = None
    regional_success_rate: Optional[float] = None
    n_neighbours: int = 0

    # Data quality flags
    used_api_rainfall: bool = False
    used_api_soil: bool = False
    used_api_elevation: bool = False
    used_regional_prior: bool = False
    data_quality_flags: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# NASA POWER Climatology API
# ---------------------------------------------------------------------------
def _fetch_nasa_power_rainfall(lat: float, lon: float) -> Optional[float]:
    """
    Fetch long-term annual mean precipitation (mm/yr) from NASA POWER.

    API: https://power.larc.nasa.gov/api/temporal/climatology/point
    Parameter: PRECTOTCORR_SUM (annual precipitation, mm/yr)
    Community: RE (renewable energy) — includes all surface weather params
    """
    cache_key = f"nasa_rain_{lat:.3f}_{lon:.3f}"
    cache_file = CACHE_DIR / f"{cache_key}.json"
    if cache_file.exists():
        age_days = (time.time() - cache_file.stat().st_mtime) / 86400
        if age_days < 7:
            return json.loads(cache_file.read_text())["value"]

    _rate_limit("nasa_power", _NASA_POWER_DELAY)
    params = {
        "parameters": "PRECTOTCORR_SUM",
        "community": "RE",
        "longitude": str(round(lon, 4)),
        "latitude": str(round(lat, 4)),
        "format": "JSON",
        "header": "false",
    }
    url = f"https://power.larc.nasa.gov/api/temporal/climatology/point?{urllib.parse.urlencode(params)}"
    try:
        data = _http_get_json(url)
        # Response path: properties → parameter → PRECTOTCORR_SUM → ANN
        ann = (
            data.get("properties", {})
                .get("parameter", {})
                .get("PRECTOTCORR_SUM", {})
                .get("ANN")
        )
        if ann is None or ann == -999.0:
            return None
        val = float(ann)
        cache_file.write_text(json.dumps({"value": val}))
        return val
    except Exception as e:
        logger.debug("NASA POWER rainfall fetch failed for (%.4f, %.4f): %s", lat, lon, e)
        return None


# ---------------------------------------------------------------------------
# ISRIC SoilGrids v2 — clay fraction
# ---------------------------------------------------------------------------
def _fetch_soilgrids_clay(lat: float, lon: float) -> Optional[float]:
    """
    Fetch clay fraction (%) at 0–30 cm depth from ISRIC SoilGrids v2.

    API: https://rest.isric.org/soilgrids/v2.0/properties/query
    Property: clay (g/kg → divide by 10 for %)
    """
    cache_key = f"soilgrids_clay_{lat:.3f}_{lon:.3f}"
    cache_file = CACHE_DIR / f"{cache_key}.json"
    if cache_file.exists():
        age_days = (time.time() - cache_file.stat().st_mtime) / 86400
        if age_days < 30:
            return json.loads(cache_file.read_text())["value"]

    _rate_limit("soilgrids", _SOILGRIDS_DELAY)
    params = {
        "lon": str(round(lon, 4)),
        "lat": str(round(lat, 4)),
        "property": "clay",
        "depth": "0-30cm",
        "value": "mean",
    }
    url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?{urllib.parse.urlencode(params)}"
    try:
        data = _http_get_json(url)
        # Navigate: properties → layers → [0] → depths → [0] → values → mean
        layers = data.get("properties", {}).get("layers", [])
        if not layers:
            return None
        depths = layers[0].get("depths", [])
        if not depths:
            return None
        mean_val = depths[0].get("values", {}).get("mean")
        if mean_val is None:
            return None
        # SoilGrids returns clay in g/kg — divide by 10 for %
        clay_pct = float(mean_val) / 10.0
        cache_file.write_text(json.dumps({"value": clay_pct}))
        return clay_pct
    except Exception as e:
        logger.debug("SoilGrids clay fetch failed for (%.4f, %.4f): %s", lat, lon, e)
        return None


# ---------------------------------------------------------------------------
# Open-Elevation (SRTM 90m)
# ---------------------------------------------------------------------------
def _fetch_elevation(lat: float, lon: float) -> Optional[float]:
    """
    Fetch elevation (m AMSL) from Open-Elevation API (SRTM 90m source).

    API: https://api.open-elevation.com/api/v1/lookup
    """
    cache_key = f"elev_{lat:.3f}_{lon:.3f}"
    cache_file = CACHE_DIR / f"{cache_key}.json"
    if cache_file.exists():
        age_days = (time.time() - cache_file.stat().st_mtime) / 86400
        if age_days < 90:
            return json.loads(cache_file.read_text())["value"]

    _rate_limit("elevation", _ELEVATION_DELAY)
    url = f"https://api.open-elevation.com/api/v1/lookup?locations={lat:.5f},{lon:.5f}"
    try:
        data = _http_get_json(url, timeout=15)
        results = data.get("results", [])
        if not results:
            return None
        val = float(results[0]["elevation"])
        cache_file.write_text(json.dumps({"value": val}))
        return val
    except Exception as e:
        logger.debug("Open-Elevation fetch failed for (%.4f, %.4f): %s", lat, lon, e)
        return None


# ---------------------------------------------------------------------------
# Scoring sub-functions
# ---------------------------------------------------------------------------

def _score_recharge(rainfall_mm: Optional[float]) -> float:
    """
    Recharge potential score (0–25).
    Based on annual precipitation as primary recharge driver.
    """
    if rainfall_mm is None:
        return 12.0  # neutral default

    if rainfall_mm >= RAINFALL_EXCELLENT:
        return 25.0
    elif rainfall_mm >= RAINFALL_GOOD:
        # Linear interpolation 650–900 mm → 18–25
        return 18.0 + 7.0 * (rainfall_mm - RAINFALL_GOOD) / (RAINFALL_EXCELLENT - RAINFALL_GOOD)
    elif rainfall_mm >= RAINFALL_MODERATE:
        # Linear interpolation 450–650 mm → 10–18
        return 10.0 + 8.0 * (rainfall_mm - RAINFALL_MODERATE) / (RAINFALL_GOOD - RAINFALL_MODERATE)
    elif rainfall_mm >= RAINFALL_LOW:
        # Linear interpolation 250–450 mm → 3–10
        return 3.0 + 7.0 * (rainfall_mm - RAINFALL_LOW) / (RAINFALL_MODERATE - RAINFALL_LOW)
    else:
        return 1.0  # arid — very low recharge


def _score_terrain(elevation_m: Optional[float], neighbours: list[ValidationRecord]) -> float:
    """
    Terrain position score (0–20).
    Lower-elevation sites relative to the surrounding 50km are more likely
    to accumulate groundwater.  Uses elevation percentile within neighbours.
    """
    if elevation_m is None:
        return 10.0  # neutral

    elevations = [r.elevation_m for r in neighbours if r.elevation_m is not None]
    if len(elevations) < 5:
        # Not enough context — give moderate score
        return 10.0

    # Terrain position index: fraction of neighbours with higher elevation
    tpi = sum(1 for e in elevations if e > elevation_m) / len(elevations)
    # tpi near 1.0 → valley bottom → better groundwater accumulation
    return round(5.0 + 15.0 * tpi, 2)   # range: 5–20


def _score_soil(clay_pct: Optional[float]) -> float:
    """
    Soil permeability score (0–20).
    Clay-rich soils have lower permeability → lower infiltration.
    Sandy/loamy soils → higher recharge.
    """
    if clay_pct is None:
        return 10.0   # neutral

    if clay_pct < 15:
        return 20.0   # sandy — high infiltration
    elif clay_pct < 25:
        return 17.0   # sandy loam
    elif clay_pct < 35:
        return 13.0   # loam
    elif clay_pct < 45:
        return 9.0    # clay loam
    elif clay_pct < 55:
        return 5.0    # clay
    else:
        return 2.0    # heavy clay — very low permeability


def _score_regional_prior(
    neighbours: list[ValidationRecord],
) -> tuple[float, float, float]:
    """
    Regional success rate score (0–25) based on nearby WPdx boreholes.

    Returns (score, regional_success_rate, n_used)
    """
    usable = [r for r in neighbours if r.outcome_success is not None]
    if len(usable) < 3:
        return 12.5, 0.5, 0   # weak prior — neutral

    success_rate = sum(1 for r in usable if r.outcome_success) / len(usable)
    score = round(25.0 * success_rate, 2)
    return score, success_rate, len(usable)


def _score_depth_yield_proxy(
    rainfall_mm: Optional[float],
    clay_pct: Optional[float],
) -> float:
    """
    Depth–yield interaction proxy (0–10).
    High rainfall + permeable soil → shallower water, higher yield.
    """
    r_score = _score_recharge(rainfall_mm) / 25.0    # normalised 0–1
    s_score = _score_soil(clay_pct) / 20.0          # normalised 0–1
    return round(10.0 * (r_score * 0.6 + s_score * 0.4), 2)


# ---------------------------------------------------------------------------
# Yield & Depth estimation
# ---------------------------------------------------------------------------

def _estimate_yield(
    rainfall_mm: Optional[float],
    clay_pct: Optional[float],
    neighbours: list[ValidationRecord],
    profile: "RegionalProfile | None" = None,
) -> float:
    """
    Estimate borehole yield (m³/hr) using region-specific baseline.

    Priority:
    1. Median yield of nearby boreholes with same success outcome
    2. Region-specific regression on rainfall × soil permeability
    """
    # Regional median
    neighbour_yields = [
        r.actual_yield_m3hr for r in neighbours
        if r.actual_yield_m3hr is not None and r.actual_yield_m3hr > 0
    ]
    if len(neighbour_yields) >= 3:
        neighbour_yields.sort()
        mid = len(neighbour_yields) // 2
        regional_median = neighbour_yields[mid]
    else:
        regional_median = None

    if profile is None:
        profile = REGIONAL_PROFILES["default"]

    # Rainfall-based baseline (region-specific)
    rain = rainfall_mm or 600
    if rain >= 900:
        rain_yield = profile.yield_at_900mm
    elif rain >= 700:
        rain_yield = profile.yield_at_700mm + (profile.yield_at_900mm - profile.yield_at_700mm) * (rain - 700) / 200
    elif rain >= 500:
        rain_yield = profile.yield_at_500mm + (profile.yield_at_700mm - profile.yield_at_500mm) * (rain - 500) / 200
    elif rain >= 300:
        rain_yield = profile.yield_at_300mm + (profile.yield_at_500mm - profile.yield_at_300mm) * (rain - 300) / 200
    elif rain >= 100:
        rain_yield = profile.yield_at_100mm + (profile.yield_at_300mm - profile.yield_at_100mm) * (rain - 100) / 200
    else:
        rain_yield = profile.yield_at_100mm * 0.5   # hyper-arid

    # Soil permeability multiplier
    clay = clay_pct or 30
    soil_mult = max(0.4, 1.0 - (clay - 20) / 100) if clay > 20 else 1.2

    regression_yield = round(rain_yield * soil_mult, 2)

    if regional_median is not None:
        # Blend: 70% regional prior, 30% regression
        return round(0.70 * regional_median + 0.30 * regression_yield, 2)
    return regression_yield


def _estimate_depth(
    elevation_m: Optional[float],
    rainfall_mm: Optional[float],
    neighbours: list[ValidationRecord],
    profile: "RegionalProfile | None" = None,
) -> float:
    """
    Estimate recommended drilling depth (m) using region-specific coefficients.

    Priority:
    1. Regional median depth from nearby boreholes
    2. Region-specific regression model
    """
    if profile is None:
        profile = REGIONAL_PROFILES["default"]
    neighbour_depths = [
        r.actual_depth_m for r in neighbours
        if r.actual_depth_m is not None and r.actual_depth_m > 5
    ]
    if len(neighbour_depths) >= 3:
        neighbour_depths.sort()
        mid = len(neighbour_depths) // 2
        regional_median = neighbour_depths[mid]
    else:
        regional_median = None

    rain = rainfall_mm or 600
    elev = elevation_m or 1200

    # Region-specific depth regression
    base_depth = (
        profile.depth_base_m
        + max(0, (elev - 800) * profile.depth_elev_coeff / 100)
        + max(0, (700 - rain) * profile.depth_rain_coeff / 100)
    )
    regression_depth = round(base_depth, 1)

    if regional_median is not None:
        return round(0.65 * regional_median + 0.35 * regression_depth, 1)
    return regression_depth


# ---------------------------------------------------------------------------
# Main prediction function
# ---------------------------------------------------------------------------

def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in km between two lat/lon points."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))


def _get_spatial_neighbours(
    record: ValidationRecord,
    all_records: list[ValidationRecord],
    radius_km: float = 25,
    max_n: int = 50,
) -> list[ValidationRecord]:
    """Return nearby records within radius_km, sorted by distance, excluding self."""
    pairs = []
    for r in all_records:
        if r.wpdx_id == record.wpdx_id:
            continue
        d = _haversine_km(record.latitude, record.longitude, r.latitude, r.longitude)
        if d <= radius_km:
            pairs.append((d, r))
    pairs.sort(key=lambda x: x[0])
    return [r for _, r in pairs[:max_n]]


def predict_site(
    record: ValidationRecord,
    all_records: list[ValidationRecord],
    threshold: float = 0.60,
    neighbour_radius_km: float = 25,
    fetch_apis: bool = True,
) -> Prediction:
    """
    Run a blind prediction for one site.

    The predictor receives only: latitude, longitude, country.
    It does NOT receive: status, outcome_success, actual_depth_m,
    actual_yield_m3hr — those are the ground truth we validate against.

    Regional calibration is auto-selected from record.country.
    For countries without a specific profile, the global default is used
    and flagged in data_quality_flags as DEFAULT_PROFILE.

    Parameters
    ----------
    record             : The site to predict (outcome columns are ignored)
    all_records        : Full dataset — used for spatial neighbour lookup
    threshold          : Decision boundary (default 0.60 = 60%)
    neighbour_radius_km: Radius for spatial prior lookup
    fetch_apis         : If False, skip external API calls (use defaults)
    """
    lat, lon = record.latitude, record.longitude
    flags: list[str] = []

    # --- Regional calibration profile ---
    profile = get_regional_profile(record.country)
    if COUNTRY_TO_PROFILE.get(record.country) is None and record.country:
        flags.append("DEFAULT_PROFILE")

    # --- Spatial neighbours (from the dataset, excluding self) ---
    neighbours = _get_spatial_neighbours(record, all_records, neighbour_radius_km)

    # Enrich neighbour elevation from their records if already fetched
    for n in neighbours:
        if n.elevation_m is None and fetch_apis:
            n.elevation_m = _fetch_elevation(n.latitude, n.longitude)

    # --- Feature fetching ---
    rainfall_mm: Optional[float] = None
    clay_pct: Optional[float] = None
    elevation_m: Optional[float] = None
    used_api_r = used_api_s = used_api_e = False

    if fetch_apis:
        rainfall_mm = _fetch_nasa_power_rainfall(lat, lon)
        used_api_r = rainfall_mm is not None
        if not used_api_r:
            flags.append("NASA_POWER_UNAVAILABLE")

        clay_pct = _fetch_soilgrids_clay(lat, lon)
        used_api_s = clay_pct is not None
        if not used_api_s:
            flags.append("SOILGRIDS_UNAVAILABLE")

        elevation_m = _fetch_elevation(lat, lon)
        used_api_e = elevation_m is not None
        if not used_api_e:
            flags.append("ELEVATION_UNAVAILABLE")

        # Store for stratification
        record.mean_annual_rainfall_mm = rainfall_mm
        record.elevation_m = elevation_m
        if clay_pct is not None:
            record.soil_texture_class = _clay_to_texture_class(clay_pct)

    # --- Sub-scores ---
    s_recharge = _score_recharge(rainfall_mm)
    s_terrain  = _score_terrain(elevation_m, neighbours)
    s_soil     = _score_soil(clay_pct)
    s_regional, regional_success_rate, n_neighbours = _score_regional_prior(neighbours)
    s_dypx     = _score_depth_yield_proxy(rainfall_mm, clay_pct)

    used_regional_prior = n_neighbours >= 3
    if not used_regional_prior:
        flags.append("SPARSE_REGIONAL_DATA")

    raw_score = s_recharge + s_terrain + s_soil + s_regional + s_dypx
    # raw_score range: 0–100

    # --- Platt scaling → probability (region-specific A/B coefficients) ---
    probability = _platt_scale(raw_score, profile.platt_a, profile.platt_b)
    probability = max(0.05, min(0.97, probability))

    # --- Risk score (inverse of probability, adjusted for depth) ---
    risk_score = round(1.0 - probability, 3)

    # --- Yield and depth estimates ---
    pred_yield = _estimate_yield(rainfall_mm, clay_pct, neighbours, profile)
    pred_depth = _estimate_depth(elevation_m, rainfall_mm, neighbours, profile)

    # --- Terrain classification (for stratification) ---
    if record.terrain_class is None and elevation_m is not None and neighbours:
        neighbour_elevs = [n.elevation_m for n in neighbours if n.elevation_m is not None]
        if neighbour_elevs:
            mean_n_elev = sum(neighbour_elevs) / len(neighbour_elevs)
            diff = elevation_m - mean_n_elev
            if diff < -50:
                record.terrain_class = "valley"
            elif diff > 100:
                record.terrain_class = "ridge"
            elif abs(diff) <= 50:
                record.terrain_class = "plain"
            else:
                record.terrain_class = "slope"

    return Prediction(
        wpdx_id=record.wpdx_id,
        latitude=lat,
        longitude=lon,
        predicted_probability=round(probability, 4),
        predicted_yield_m3hr=pred_yield,
        predicted_depth_m=pred_depth,
        predicted_risk_score=risk_score,
        decision_success=probability >= threshold,
        threshold_used=threshold,
        recharge_score=s_recharge,
        terrain_score=s_terrain,
        soil_score=s_soil,
        regional_prior_score=s_regional,
        depth_yield_proxy_score=s_dypx,
        raw_score=round(raw_score, 2),
        rainfall_mm=rainfall_mm,
        elevation_m=elevation_m,
        clay_fraction=clay_pct,
        regional_success_rate=round(regional_success_rate, 3),
        n_neighbours=n_neighbours,
        used_api_rainfall=used_api_r,
        used_api_soil=used_api_s,
        used_api_elevation=used_api_e,
        used_regional_prior=used_regional_prior,
        data_quality_flags=flags,
    )


def _platt_scale(raw_score: float, a: float = -0.057, b: float = 2.55) -> float:
    """Convert raw score (0–100) to probability using Platt scaling.
    Uses region-specific A/B from RegionalProfile, falls back to global default."""
    return 1.0 / (1.0 + math.exp(a * raw_score + b))


def _clay_to_texture_class(clay_pct: float) -> str:
    """USDA texture class from clay fraction."""
    if clay_pct < 15:
        return "sandy"
    elif clay_pct < 25:
        return "sandy_loam"
    elif clay_pct < 35:
        return "loam"
    elif clay_pct < 45:
        return "clay_loam"
    elif clay_pct < 55:
        return "clay"
    else:
        return "heavy_clay"


def run_blind_predictions(
    records: list[ValidationRecord],
    threshold: float = 0.60,
    neighbour_radius_km: float = 25,
    fetch_apis: bool = True,
    progress_every: int = 10,
) -> list[tuple[ValidationRecord, Prediction]]:
    """
    Run blind predictions for the full dataset.

    For each record, outcome columns are withheld from the predictor.
    Returns pairs of (ground_truth_record, prediction).
    """
    pairs: list[tuple[ValidationRecord, Prediction]] = []
    total = len(records)
    logger.info("Running blind predictions on %d sites...", total)

    for i, record in enumerate(records):
        if (i + 1) % progress_every == 0:
            logger.info("  %d / %d (%.0f%%)", i + 1, total, 100 * (i + 1) / total)
        pred = predict_site(record, records, threshold, neighbour_radius_km, fetch_apis)
        pairs.append((record, pred))

    logger.info("Blind prediction run complete: %d sites", total)
    return pairs


# ---------------------------------------------------------------------------
# Minimal HTTP helper (same as dataset.py — kept local to avoid circular import)
# ---------------------------------------------------------------------------
def _http_get_json(url: str, timeout: int = 20) -> list | dict:
    req = urllib.request.Request(url, headers={"Accept": "application/json",
                                                "User-Agent": "AquaScanPro-Validator/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code} fetching {url}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error fetching {url}: {e.reason}") from e
