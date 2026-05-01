"""
dataset.py — Real borehole validation dataset fetcher (GLOBAL)
==============================================================
Fetches borehole records from authoritative open-access sources.
Covers 80+ countries worldwide — not limited to any single region.

Primary source
--------------
  Water Point Data Exchange (WPdx+)
  URL:     https://data.waterpointdata.org (Socrata API)
  Dataset: eqje-vguj  — ~1.1 million water points, 80+ countries
  License: Creative Commons Attribution 4.0 (CC BY 4.0)
  Used by: UNICEF, World Bank, AfDB, WHO/UNICEF JMP

Supplementary authoritative sources (for local CSV imports)
-----------------------------------------------------------
  IGRAC GGMN  — Global Groundwater Monitoring Network (UN)
               https://www.un-igrac.org/ggmn
               Aquifer/monitoring data, 100+ countries

  BGS Africa Groundwater Atlas
               https://www.bgs.ac.uk/research/groundwater/international/africanGroundwater/
               Borehole yield & geology for 54 African countries

  FAO AQUASTAT — Country-level groundwater resource statistics
               https://www.fao.org/aquastat

  WHYMAP      — World-wide Hydrogeological Mapping & Assessment
               https://www.whymap.org

  USGS NWIS   — National Water Information System (USA)
               https://waterdata.usgs.gov/nwis/gw

  India CGWB  — Central Ground Water Board, India
               https://cgwb.gov.in/wris

  SADC-GMI    — Southern Africa Groundwater Information Portal
               https://www.sadc.int/themes/natural-resources-environment/water/groundwater

  WHO/UNICEF JMP — Joint Monitoring Programme water point data
               https://washdata.org

A ValidationRecord is a ground-truth row: we know what actually happened.
The predictor (predictor.py) is run BLIND — it never sees the outcome columns.
"""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Optional
import urllib.request
import urllib.parse
import urllib.error

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# WPdx+ Socrata REST endpoint (no API key required for public read)
# ---------------------------------------------------------------------------
WPDX_ENDPOINT = "https://data.waterpointdata.org/resource/eqje-vguj.json"
# Fallback if the primary dataset is slow: WPdx Standard (gihr-buz6)
WPDX_FALLBACK  = "https://data.waterpointdata.org/resource/gihr-buz6.json"

CACHE_DIR = Path(__file__).parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)

# Minimum yield to call a borehole "successful" (m³/hr, converted from L/s)
SUCCESS_YIELD_M3HR_MIN = 0.3   # 0.083 L/s — basic community threshold


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------
@dataclass
class ValidationRecord:
    """One real borehole with known outcome — ground truth."""
    # Identity
    wpdx_id: str
    source: str = "WPdx+"

    # Location
    latitude: float = 0.0
    longitude: float = 0.0
    country: str = ""
    county: str = ""        # adm1
    sub_county: str = ""    # adm2

    # Borehole measurements (actual field data)
    actual_depth_m: Optional[float] = None
    actual_yield_m3hr: Optional[float] = None      # converted from L/s
    static_water_level_m: Optional[float] = None
    install_year: Optional[int] = None
    drill_method: Optional[str] = None

    # Water quality
    water_quality_flag: Optional[str] = None       # "acceptable", "no", "unknown"
    conductivity_us_cm: Optional[float] = None

    # Outcome (ground truth — NEVER shown to predictor until after scoring)
    status: str = "unknown"          # "functional" | "non_functional" | "unknown"
    outcome_success: Optional[bool] = None  # True=success, False=fail, None=unknown

    # Geology context (from WPdx record if available)
    aquifer_type: Optional[str] = None
    geology_description: Optional[str] = None

    # Stratification labels (filled during enrichment)
    soil_texture_class: Optional[str] = None       # from SoilGrids
    terrain_class: Optional[str] = None            # "valley" | "slope" | "ridge" | "plain"
    mean_annual_rainfall_mm: Optional[float] = None # from NASA POWER
    elevation_m: Optional[float] = None

    # Raw WPdx fields preserved for audit
    raw_wpdx: dict = field(default_factory=dict, repr=False)


def _http_get_json(url: str, timeout: int = 30) -> list | dict:
    """Minimal HTTP GET returning parsed JSON. No third-party deps."""
    req = urllib.request.Request(url, headers={"Accept": "application/json",
                                                "User-Agent": "AquaScanPro-Validator/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code} fetching {url}") from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error fetching {url}: {e.reason}") from e


def _fetch_wpdx_page(
    country: Optional[str],
    county_filter: Optional[str],
    offset: int,
    limit: int,
    endpoint: str = WPDX_ENDPOINT,
    adm1_filter: Optional[str] = None,
    adm2_filter: Optional[str] = None,
) -> list[dict]:
    """Fetch one page of WPdx borehole records (global — country=None fetches all)."""
    # Build Socrata SoQL query
    where_clauses = [
        "water_source_category='Groundwater'",
    ]
    # WPdx uses 'facility_type' or 'water_source' for borehole identification
    # Both datasets use slightly different field names — handle both
    where_clauses.append(
        "(water_source='Borehole' OR water_source='Borehole (Motorized)' "
        "OR water_source='Borehole (Hand Pump)' OR facility_type='borehole')"
    )
    if country:
        where_clauses.append(f"country_name='{country}'")
    if county_filter or adm1_filter:
        val = county_filter or adm1_filter
        where_clauses.append(f"adm1='{val}'")
    if adm2_filter:
        where_clauses.append(f"adm2='{adm2_filter}'")

    params = {
        "$where": " AND ".join(where_clauses),
        "$limit": str(limit),
        "$offset": str(offset),
        "$select": (
            "row_id,lat_deg,lon_deg,country_name,adm1,adm2,"
            "status_id,water_source,water_source_category,"
            "yield_in_liters_per_second,depth_to_water_m,"
            "install_year,water_quality,management,notes,"
            "photo_lnk,activity_id,data_lnk"
        ),
    }
    url = f"{endpoint}?{urllib.parse.urlencode(params)}"
    logger.debug("WPdx GET: %s", url)
    data = _http_get_json(url)
    if not isinstance(data, list):
        raise RuntimeError(f"Unexpected WPdx response type: {type(data)}")
    return data


def _parse_wpdx_record(row: dict) -> Optional[ValidationRecord]:
    """Parse one WPdx API row into a ValidationRecord."""
    # --- Coordinates ---
    try:
        lat = float(row["lat_deg"])
        lon = float(row["lon_deg"])
    except (KeyError, ValueError, TypeError):
        return None   # skip records with no coordinates

    # --- Yield ---
    yield_ls = None
    yield_m3hr = None
    raw_yield = row.get("yield_in_liters_per_second") or row.get("yield_lpm")
    if raw_yield not in (None, "", "N/A"):
        try:
            yield_ls = float(raw_yield)
            yield_m3hr = round(yield_ls * 3.6, 3)   # L/s → m³/hr
        except (ValueError, TypeError):
            pass

    # --- Depth ---
    depth_m = None
    raw_depth = row.get("depth_to_water_m")
    if raw_depth not in (None, "", "N/A"):
        try:
            depth_m = float(raw_depth)
        except (ValueError, TypeError):
            pass

    # --- Status / Outcome ---
    status_raw = (row.get("status_id") or row.get("status") or "unknown").lower().strip()
    if status_raw in ("yes", "functional", "working"):
        status = "functional"
    elif status_raw in ("no", "non functional", "non_functional", "broken"):
        status = "non_functional"
    else:
        status = "unknown"

    # Classify success:
    #   functional + adequate yield => TRUE
    #   non-functional => FALSE
    #   functional but yield unknown => TRUE (assume working)
    #   unknown => None (excluded from binary metrics)
    if status == "functional":
        if yield_m3hr is not None:
            outcome_success = yield_m3hr >= SUCCESS_YIELD_M3HR_MIN
        else:
            outcome_success = True  # functional but yield not recorded
    elif status == "non_functional":
        outcome_success = False
    else:
        outcome_success = None

    # --- Water quality ---
    wq = (row.get("water_quality") or "unknown").lower().strip()

    # --- Install year ---
    yr = None
    raw_yr = row.get("install_year")
    if raw_yr not in (None, "", "N/A"):
        try:
            yr = int(float(raw_yr))
        except (ValueError, TypeError):
            pass

    rec_id = row.get("row_id") or row.get("activity_id") or f"{lat:.5f},{lon:.5f}"

    return ValidationRecord(
        wpdx_id=str(rec_id),
        latitude=lat,
        longitude=lon,
        country=row.get("country_name", ""),
        county=row.get("adm1", ""),
        sub_county=row.get("adm2", ""),
        actual_depth_m=depth_m,
        actual_yield_m3hr=yield_m3hr,
        install_year=yr,
        water_quality_flag=wq,
        status=status,
        outcome_success=outcome_success,
        raw_wpdx=row,
    )


def fetch_dataset(
    country: Optional[str] = None,
    county: Optional[str] = None,
    adm1: Optional[str] = None,
    adm2: Optional[str] = None,
    max_records: int = 500,
    force_refresh: bool = False,
) -> list[ValidationRecord]:
    """
    Fetch borehole records from WPdx+ — GLOBAL coverage, 80+ countries.

    Parameters
    ----------
    country      : Country name as used in WPdx (e.g. "Kenya", "Nigeria",
                   "India", "Bangladesh", "Ethiopia", "Bolivia", "Cambodia").
                   Pass None (default) to fetch records from ALL countries
                   (use with a tight adm1/adm2 filter or raise max_records).
    county       : Alias for adm1 (kept for backwards compatibility).
    adm1         : First-level administrative unit (state/province/county/region).
                   Examples: "Murang'a" (Kenya), "Oyo" (Nigeria),
                   "Rajasthan" (India), "Amhara" (Ethiopia).
    adm2         : Second-level admin unit (district/sub-county).
    max_records  : Hard cap on total records fetched. Default: 500.
                   Use 1000–5000 for national-scale analysis.
    force_refresh: Ignore local cache and re-fetch from API.

    Returns
    -------
    List of ValidationRecord objects with known outcomes.
    Records with status="unknown" are included but flagged — they
    are excluded from binary classification metrics but used for
    yield/depth accuracy metrics if measured values exist.

    Examples
    --------
    # Murang'a County, Kenya (target geology for initial validation)
    fetch_dataset(country="Kenya", adm1="Murang'a")

    # All of Nigeria
    fetch_dataset(country="Nigeria", max_records=1000)

    # Rajasthan state, India
    fetch_dataset(country="India", adm1="Rajasthan", max_records=500)

    # All countries — top 2000 borehole records globally
    fetch_dataset(country=None, max_records=2000)

    # West Africa multi-country (run separately and combine)
    # records = fetch_dataset("Ghana") + fetch_dataset("Senegal") + fetch_dataset("Mali")
    """
    adm1 = adm1 or county   # backwards compat
    slug = f"{country or 'global'}_{adm1 or 'all'}_{adm2 or ''}_{max_records}".replace("'", "").replace(" ", "_").lower()
    cache_path = CACHE_DIR / f"wpdx_{slug}.json"

    # --- Cache hit ---
    if cache_path.exists() and not force_refresh:
        age_hours = (time.time() - cache_path.stat().st_mtime) / 3600
        if age_hours < 72:   # cache valid for 3 days
            logger.info("Loading WPdx cache: %s (%.0fh old)", cache_path.name, age_hours)
            raw_records = json.loads(cache_path.read_text(encoding="utf-8"))
            records = [ValidationRecord(**r) for r in raw_records]
            logger.info("Loaded %d records from cache", len(records))
            return records

    # --- Fetch from API ---
    logger.info("Fetching WPdx data — country=%s adm1=%s adm2=%s max=%d",
                country or 'ALL', adm1 or 'all', adm2 or '', max_records)
    all_rows: list[dict] = []
    page_size = 200
    offset = 0

    # Try primary endpoint first, fall back to secondary
    for endpoint in (WPDX_ENDPOINT, WPDX_FALLBACK):
        try:
            while len(all_rows) < max_records:
                page = _fetch_wpdx_page(country, adm1, offset, page_size, endpoint, adm2_filter=adm2)
                if not page:
                    break
                all_rows.extend(page)
                logger.info("  Fetched %d records (total so far: %d)", len(page), len(all_rows))
                if len(page) < page_size:
                    break   # last page
                offset += page_size
                time.sleep(0.5)   # polite rate limiting
            break   # success
        except RuntimeError as e:
            logger.warning("Endpoint %s failed: %s — trying fallback", endpoint, e)
            all_rows = []
            offset = 0

    if not all_rows:
        raise RuntimeError(
            "Could not fetch any WPdx records. Check network connectivity "
            "and that data.waterpointdata.org is reachable."
        )

    # --- Parse ---
    records: list[ValidationRecord] = []
    skipped = 0
    for row in all_rows[:max_records]:
        rec = _parse_wpdx_record(row)
        if rec is None:
            skipped += 1
        else:
            records.append(rec)

    logger.info(
        "Parsed %d valid records (%d skipped — missing coordinates)",
        len(records), skipped
    )

    # --- Summary statistics (data provenance log) ---
    functional = sum(1 for r in records if r.status == "functional")
    non_functional = sum(1 for r in records if r.status == "non_functional")
    unknown_status = sum(1 for r in records if r.status == "unknown")
    has_yield = sum(1 for r in records if r.actual_yield_m3hr is not None)
    has_depth = sum(1 for r in records if r.actual_depth_m is not None)

    logger.info("Dataset summary:")
    logger.info("  Functional (success):     %d", functional)
    logger.info("  Non-functional (failure): %d", non_functional)
    logger.info("  Unknown status:           %d", unknown_status)
    logger.info("  With yield measurement:   %d", has_yield)
    logger.info("  With depth measurement:   %d", has_depth)

    # --- Cache to disk ---
    cache_path.write_text(
        json.dumps([asdict(r) for r in records], default=str, indent=2),
        encoding="utf-8"
    )
    logger.info("Cached to %s", cache_path)

    return records


def load_local_csv(csv_path: str | Path) -> list[ValidationRecord]:
    """
    Load a locally-collected borehole dataset (e.g. from a drilling contractor
    or county water department) provided as a CSV file.

    Expected CSV columns (flexible — unmapped columns are stored in raw_wpdx):
        lat, lon, depth_m, yield_m3hr, status (functional/non_functional),
        county, install_year, water_quality, notes

    Usage:
        records = load_local_csv("data/muranga_county_boreholes.csv")
    """
    import csv
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"CSV not found: {path}")

    COLUMN_MAP = {
        "lat": "latitude", "latitude": "latitude",
        "lon": "longitude", "longitude": "longitude",
        "depth_m": "actual_depth_m", "total_depth_m": "actual_depth_m",
        "depth": "actual_depth_m",
        "yield_m3hr": "actual_yield_m3hr", "yield": "actual_yield_m3hr",
        "status": "status", "outcome": "status",
        "county": "county", "adm1": "county",
        "sub_county": "sub_county", "adm2": "sub_county",
        "install_year": "install_year", "year": "install_year",
        "water_quality": "water_quality_flag",
        "notes": "geology_description",
    }

    records = []
    with open(path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for i, row in enumerate(reader):
            mapped: dict = {}
            for raw_col, val in row.items():
                col = raw_col.strip().lower().replace(" ", "_")
                target = COLUMN_MAP.get(col)
                if target:
                    mapped[target] = val.strip() if val else None

            try:
                lat = float(mapped.get("latitude") or 0)
                lon = float(mapped.get("longitude") or 0)
            except (ValueError, TypeError):
                logger.warning("Row %d: invalid coordinates — skipping", i + 1)
                continue

            # Coerce numeric fields
            for num_field in ("actual_depth_m", "actual_yield_m3hr", "elevation_m"):
                if mapped.get(num_field):
                    try:
                        mapped[num_field] = float(mapped[num_field])
                    except (ValueError, TypeError):
                        mapped[num_field] = None

            if mapped.get("install_year"):
                try:
                    mapped["install_year"] = int(float(mapped["install_year"]))
                except (ValueError, TypeError):
                    mapped["install_year"] = None

            # Normalise status
            status_raw = (mapped.get("status") or "unknown").lower().strip()
            if status_raw in ("yes", "functional", "working", "success", "1", "true"):
                status = "functional"
                outcome = True
            elif status_raw in ("no", "non_functional", "failure", "dry", "0", "false"):
                status = "non_functional"
                outcome = False
            else:
                status = "unknown"
                outcome = None

            records.append(ValidationRecord(
                wpdx_id=f"local_{i+1}",
                source=str(path.name),
                latitude=lat,
                longitude=lon,
                country=mapped.get("country", "Kenya"),
                county=mapped.get("county", ""),
                sub_county=mapped.get("sub_county", ""),
                actual_depth_m=mapped.get("actual_depth_m"),
                actual_yield_m3hr=mapped.get("actual_yield_m3hr"),
                install_year=mapped.get("install_year"),
                water_quality_flag=mapped.get("water_quality_flag"),
                geology_description=mapped.get("geology_description"),
                status=status,
                outcome_success=outcome,
                raw_wpdx=row,
            ))

    logger.info("Loaded %d records from local CSV: %s", len(records), path.name)
    return records
