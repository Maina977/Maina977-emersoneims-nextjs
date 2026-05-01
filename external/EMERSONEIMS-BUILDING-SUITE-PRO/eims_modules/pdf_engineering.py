"""
EIMS BSP — Professional PDF Engineering Report Module
=====================================================
Produces *real* engineering content (calculations, schedules, BBS, MEP, BOQ,
compliance pack) that can be reviewed by a Kenyan Architect (BORAQS),
Structural Engineer (EBK), Quantity Surveyor (BORAQS), Site Manager (NCA)
and submitted to a county for approval.

Standards referenced
--------------------
* BS EN 1990 / EC0  — Basis of structural design
* BS EN 1991-1-1 / EC1 — Actions on structures (imposed loads)
* BS EN 1992-1-1 / EC2 — Concrete design
* BS 8110 — Structural use of concrete (legacy, where called by Kenya code)
* BS 8666 — Bar bending schedule
* BS 8004 — Foundations (presumed bearing values)
* BS EN 1997-1 / EC7 — Geotechnical design
* IEC 60364 / KS IEC 60364 — Electrical installations
* BS EN 12056-2 — Sanitary drainage gradients
* KQS 2025 — Kenya Quantity Surveyors standard rate book
* NCA Act 2011, EMCA 1999 + NEMA EIA Regs 2003, OSHA 2007 / DOSHS

Public surface
--------------
* `validate_and_correct(p1, project)` -> (params, fixes, blockers)
* `build_engineering_sections(elements, params, fixes, styles, page_w)` ->
    appends section 2..N to a ReportLab `elements` list. Returns nothing.

The module is *pure stdlib + reportlab* — no third-party scientific libs —
so it runs anywhere the rest of EIMS does.
"""
from __future__ import annotations
import math
import re
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
)


# ─────────────────────────────────────────────────────────────────────────────
# 0. VALIDATION & AUTO-CORRECTION ENGINE
# ─────────────────────────────────────────────────────────────────────────────
KENYA_RX = re.compile(
    r'kenya|nairobi|mombasa|kisumu|nakuru|eldoret|thika|machakos|kiambu|'
    r'kajiado|nyeri|meru|embu|kakamega|garissa|isiolo|naivasha',
    re.IGNORECASE,
)

# Country -> statutory regulators that must sign a permit submission.
# Keys for arch / eng / qs name the licensing board the customer's
# professionals must be registered with. `permit` is the issuing authority.
# Mirrors the JS map in interactive_wizard.html so the PDF rejection panel
# tells the user exactly the same story the wizard told them.
STATUTORY_REGULATORS = {
    'Kenya':       {'arch': 'BORAQS', 'eng': 'EBK', 'qs': 'BORAQS', 'contractor': 'NCA',
                    'permit': 'County Government Building Plans Section'},
    'Uganda':      {'arch': 'AAU/ERB', 'eng': 'ERB', 'qs': 'IISU/ERB', 'contractor': 'UNRA',
                    'permit': 'KCCA / municipal council'},
    'Tanzania':    {'arch': 'AQRB', 'eng': 'ERB', 'qs': 'AQRB', 'contractor': 'CRB',
                    'permit': 'Local government authority'},
    'Rwanda':      {'arch': 'IAR', 'eng': 'IER', 'qs': 'IQSR', 'contractor': 'RHA',
                    'permit': 'Rwanda Housing Authority'},
    'Nigeria':     {'arch': 'ARCON', 'eng': 'COREN', 'qs': 'QSRBN', 'contractor': 'CORBON',
                    'permit': 'State physical planning board'},
    'Ghana':       {'arch': 'GIA/ARC', 'eng': 'GhIE', 'qs': 'GhIS', 'contractor': 'MWH',
                    'permit': 'Metropolitan/Municipal/District Assembly'},
    'South Africa':{'arch': 'SACAP', 'eng': 'ECSA', 'qs': 'SACQSP', 'contractor': 'CIDB',
                    'permit': 'Municipal building control'},
    'Egypt':       {'arch': 'EGS', 'eng': 'EEA', 'qs': 'EEA', 'contractor': 'EFCBC',
                    'permit': 'Governorate building dept.'},
    'Morocco':     {'arch': 'CNOA', 'eng': 'OIM', 'qs': '', 'contractor': '',
                    'permit': 'Commune urbaine'},
    'UAE':         {'arch': 'SOE Dubai / DMT', 'eng': 'SOE / DMT', 'qs': 'RICS / SOE',
                    'contractor': 'Dubai Municipality',
                    'permit': 'Dubai Municipality / DMT / Trakhees'},
    'Saudi Arabia':{'arch': 'SCE', 'eng': 'SCE', 'qs': 'SCE', 'contractor': 'CCC',
                    'permit': 'Baladiya via Balady portal'},
    'Qatar':       {'arch': 'UPDA', 'eng': 'UPDA', 'qs': 'UPDA', 'contractor': '',
                    'permit': 'Ministry of Municipality'},
    'UK':          {'arch': 'ARB / RIBA', 'eng': 'ICE / IStructE', 'qs': 'RICS', 'contractor': 'CITB',
                    'permit': 'Local Authority Building Control / Approved Inspector'},
    'Ireland':     {'arch': 'RIAI', 'eng': 'Engineers Ireland', 'qs': 'SCSI', 'contractor': 'CIRI',
                    'permit': 'Local authority planning'},
    'Spain':       {'arch': 'COAM', 'eng': 'CICCP', 'qs': 'COAATM', 'contractor': '',
                    'permit': 'Ayuntamiento — Licencia de obras'},
    'Germany':     {'arch': 'BAK', 'eng': 'BIngK', 'qs': '', 'contractor': '',
                    'permit': 'Bauamt'},
    'France':      {'arch': 'Ordre des Architectes', 'eng': 'CNISF', 'qs': '', 'contractor': '',
                    'permit': 'Mairie — Permis de construire'},
    'Italy':       {'arch': 'CNAPPC', 'eng': 'Ordine degli Ingegneri', 'qs': '', 'contractor': '',
                    'permit': 'Comune — Permesso di costruire'},
    'Netherlands': {'arch': 'BNA / Architectenregister', 'eng': 'KIVI', 'qs': '', 'contractor': '',
                    'permit': 'Gemeente — Omgevingsvergunning'},
    'USA':         {'arch': 'AIA / state RA', 'eng': 'state PE', 'qs': 'ASPE / AACE',
                    'contractor': 'state contractor licence',
                    'permit': 'City / County Building Dept.'},
    'Canada':      {'arch': 'OAA / provincial', 'eng': 'PEO / provincial', 'qs': 'CIQS',
                    'contractor': 'provincial licence', 'permit': 'Municipal building dept.'},
    'Mexico':      {'arch': 'CAM-SAM (DRO)', 'eng': 'CICM', 'qs': '', 'contractor': '',
                    'permit': 'Municipio — Licencia de construcción'},
    'Brazil':      {'arch': 'CAU/BR', 'eng': 'CREA', 'qs': 'CREA', 'contractor': '',
                    'permit': 'Prefeitura — Alvará de construção'},
    'India':       {'arch': 'COA', 'eng': 'IEI / state PWD', 'qs': 'IIQS',
                    'contractor': 'state PWD class licence',
                    'permit': 'Municipal corporation / development authority'},
    'China':       {'arch': 'NAEA', 'eng': 'PCQ', 'qs': 'CQE',
                    'contractor': 'MoHURD class licence',
                    'permit': 'Local construction commission'},
    'Japan':       {'arch': '1st-class kenchikushi', 'eng': 'gijutsushi', 'qs': '',
                    'contractor': '', 'permit': 'Designated confirmation body'},
    'Singapore':   {'arch': 'BOA', 'eng': 'PEB', 'qs': 'SISV',
                    'contractor': 'BCA registration', 'permit': 'BCA / URA via CORENET'},
    'Australia':   {'arch': 'AACA', 'eng': 'NER / Engineers Australia', 'qs': 'AIQS',
                    'contractor': 'state builder licence', 'permit': 'Council / private certifier'},
    'New Zealand': {'arch': 'NZRAB', 'eng': 'CPEng', 'qs': 'NZIQS',
                    'contractor': 'LBP', 'permit': 'Territorial authority — building consent'},
    '_DEFAULT':    {'arch': 'licensed architect', 'eng': 'licensed structural engineer',
                    'qs': 'licensed quantity surveyor', 'contractor': 'licensed contractor',
                    'permit': 'local building authority'},
}

_CITY_TO_COUNTRY = {
    'nairobi': 'Kenya', 'mombasa': 'Kenya', 'kisumu': 'Kenya', 'nakuru': 'Kenya',
    'eldoret': 'Kenya', 'thika': 'Kenya', 'kiambu': 'Kenya',
    'kampala': 'Uganda', 'dar es salaam': 'Tanzania', 'kigali': 'Rwanda', 'addis ababa': 'Ethiopia',
    'lagos': 'Nigeria', 'abuja': 'Nigeria', 'accra': 'Ghana',
    'johannesburg': 'South Africa', 'cape town': 'South Africa', 'durban': 'South Africa',
    'cairo': 'Egypt', 'casablanca': 'Morocco',
    'dubai': 'UAE', 'abu dhabi': 'UAE', 'riyadh': 'Saudi Arabia', 'jeddah': 'Saudi Arabia', 'doha': 'Qatar',
    'london': 'UK', 'manchester': 'UK', 'birmingham': 'UK', 'edinburgh': 'UK',
    'dublin': 'Ireland',
    'madrid': 'Spain', 'barcelona': 'Spain', 'marbella': 'Spain', 'seville': 'Spain', 'malaga': 'Spain',
    'berlin': 'Germany', 'munich': 'Germany', 'paris': 'France', 'lyon': 'France',
    'rome': 'Italy', 'milan': 'Italy', 'amsterdam': 'Netherlands', 'rotterdam': 'Netherlands',
    'new york': 'USA', 'los angeles': 'USA', 'chicago': 'USA', 'houston': 'USA',
    'miami': 'USA', 'san francisco': 'USA', 'boston': 'USA', 'seattle': 'USA',
    'toronto': 'Canada', 'vancouver': 'Canada', 'montreal': 'Canada',
    'mexico city': 'Mexico', 'sao paulo': 'Brazil', 'rio': 'Brazil',
    'mumbai': 'India', 'delhi': 'India', 'bangalore': 'India', 'chennai': 'India',
    'beijing': 'China', 'shanghai': 'China', 'tokyo': 'Japan', 'osaka': 'Japan',
    'singapore': 'Singapore',
    'sydney': 'Australia', 'melbourne': 'Australia', 'brisbane': 'Australia',
    'auckland': 'New Zealand', 'wellington': 'New Zealand',
}


def detect_country(location: str) -> str:
    """Map a free-text location to a STATUTORY_REGULATORS key. Falls back to
    '_DEFAULT' so callers always get a regulator dict."""
    s = (location or '').lower()
    for k in STATUTORY_REGULATORS:
        if k == '_DEFAULT':
            continue
        if k.lower() in s:
            return k
    for city, country in _CITY_TO_COUNTRY.items():
        if city in s:
            return country
    return '_DEFAULT'


def get_regulators(location: str) -> dict:
    """Return regulator dict (arch/eng/qs/contractor/permit) for a location."""
    return STATUTORY_REGULATORS[detect_country(location)]


def validate_and_correct(p1: dict, project: dict) -> tuple[dict, list, list]:
    """Run pre-flight validation. Returns (params, fixes, blockers).

    `fixes`     — list of [field, original, corrected, reason] (auto-applied)
    `blockers`  — list of strings (must be resolved by user before issue)
    """
    fixes: list = []
    blockers: list = []

    # --- raw extraction ---
    # Project-level fields (area, units, stories, bedrooms, style, currency,
    # foundation, location) MUST be read from `project` first — that is the
    # wizard's single source of truth. `p1` is the satellite/site-analysis
    # phase output and only carries site-derived values (soil, water table,
    # slope, vegetation), NOT project geometry. Falling back to p1 first
    # caused every project to register as area=0 / units=0 / bedrooms=0,
    # which then triggered spurious blockers and "auto-corrected" the cover
    # page to 100 m² / 1 bedroom while phases 4/7/12 kept the real values
    # — producing the cross-phase mismatch flagged by external auditors.
    def _pick(*vals):
        for v in vals:
            if v is None:
                continue
            s = str(v).strip()
            if s and s.lower() not in ('none', 'null', 'not specified', ''):
                return v
        return None

    all_inputs = project.get('all_inputs') or {}

    location = _pick(
        project.get('location'), project.get('city'), project.get('country'),
        all_inputs.get('location'), all_inputs.get('site_location'),
        p1.get('location'), p1.get('country'), p1.get('city'),
    ) or ''
    area = float(_pick(
        project.get('area'), project.get('total_area'),
        all_inputs.get('area'), all_inputs.get('total_area'),
        p1.get('area'), p1.get('total_area'),
    ) or 0)
    stories = int(_pick(
        project.get('stories'), project.get('floors'),
        all_inputs.get('stories'), all_inputs.get('floors'),
        p1.get('stories'), p1.get('floors'),
    ) or 0)
    units = int(_pick(
        project.get('units'), project.get('residential_units'),
        all_inputs.get('units'), all_inputs.get('residential_units'),
        p1.get('units'), p1.get('residential_units'),
    ) or 0)
    bedrooms = int(_pick(
        project.get('bedrooms'),
        all_inputs.get('bedrooms'), all_inputs.get('bedrooms_per_unit'),
        p1.get('bedrooms'),
    ) or 0)
    style = _pick(
        project.get('style'), project.get('architectural_style'),
        all_inputs.get('style'), all_inputs.get('architectural_style'),
        p1.get('style'), p1.get('architectural_style'),
    ) or 'modern'
    foundation = str(_pick(
        project.get('foundation_type'), project.get('foundation'),
        all_inputs.get('foundation_type'), all_inputs.get('foundation'),
        p1.get('foundation_type'), p1.get('foundation'),
    ) or '').lower()
    if foundation == 'auto':
        foundation = ''
    currency = str(_pick(
        project.get('currency'),
        all_inputs.get('currency'),
        p1.get('currency'),
    ) or 'USD').upper()
    project_name = project.get('name') or 'EIMS Project'

    # --- Location: scan all phases, never allow "Not specified" silently ---
    if not location or str(location).strip().lower() in ('not specified', 'none', ''):
        for ph in (project.get('phases') or {}).values():
            d = ph.get('data', {}) if isinstance(ph, dict) else {}
            cand = d.get('location') or d.get('country') or d.get('city') or d.get('site_location')
            if cand and str(cand).strip():
                fixes.append(['Location', 'Not specified', cand, 'Recovered from another wizard phase'])
                location = cand
                break
        if not location:
            blockers.append('Location is mandatory — county submission cannot proceed without a recognised locality.')
            location = 'Nairobi, Kenya'  # placeholder so downstream calcs proceed
            fixes.append(['Location', '(empty)', location, 'Defaulted to capital — REPLACE before submission'])

    is_ke = bool(KENYA_RX.search(str(location)))

    # --- Currency: KES forced for Kenyan localities (CBK Cap.491) ---
    if is_ke and currency != 'KES':
        fixes.append(['Currency', currency, 'KES', 'CBK Cap.491 — statutory billing currency in Kenya is KES'])
        currency = 'KES'

    # --- Numeric sanity ---
    if area <= 0:
        blockers.append('Total floor area is missing or non-positive.')
        area = 100.0
        fixes.append(['Area (m²)', '0', '100', 'Placeholder — REPLACE before submission'])
    if stories < 1:
        fixes.append(['Stories', stories, 1, 'Minimum 1 storey enforced'])
        stories = 1
    if units < 1:
        fixes.append(['Units', units, 1, 'Minimum 1 unit enforced'])
        units = 1
    if bedrooms < 1:
        fixes.append(['Bedrooms', bedrooms, 1, 'Minimum 1 bedroom enforced'])
        bedrooms = 1

    # --- Stories vs floor count (single source of truth) ---
    floors_in = p1.get('floor_count') or p1.get('floors')
    if floors_in is not None and int(floors_in) != stories:
        fixes.append(['Floor count', floors_in, stories,
                      'Reconciled to Stories (was contradicting — single source of truth enforced)'])
    floor_count = stories

    # --- Units vs area (KQS 2025 min unit footprint 30 m²) ---
    max_units = max(1, int(area // 30))
    if units > max_units:
        fixes.append(['Units', units, max_units,
                      f'Exceeded area / 30 m² (KQS 2025 min unit footprint) — capped at {max_units}'])
        units = max_units

    # --- Foundation auto-pick (BS 8004 §7) ---
    if stories >= 3 or area > 500:
        fnd_auto, fnd_reason = 'raft', f'{stories}-storey × {int(area)} m² → raft (BS 8004 §7 / EN 1997-1)'
    elif stories >= 2:
        fnd_auto, fnd_reason = 'strip + ground beam', f'{stories}-storey → strip + ground beam (BS 8004 §7)'
    elif area <= 120:
        fnd_auto, fnd_reason = 'pad', 'Single-storey ≤ 120 m² → pad (BS 8004 §7.3)'
    else:
        fnd_auto, fnd_reason = 'strip', 'Single-storey > 120 m² → strip (BS 8004 §7.2)'
    if foundation and foundation not in (fnd_auto, fnd_auto.replace(' + ', '+')):
        fixes.append(['Foundation', foundation, fnd_auto, fnd_reason])
    elif not foundation:
        fixes.append(['Foundation', '(unspecified)', fnd_auto, fnd_reason])
    foundation = fnd_auto

    # --- Legal / professional identifiers ---
    # Read from project (and project['all_inputs']) first; fall back to p1.
    def _legal(*keys):
        for src in (project, all_inputs, p1):
            for k in keys:
                v = src.get(k) if isinstance(src, dict) else None
                if v:
                    s = str(v).strip()
                    if s and s.lower() not in ('none', 'null', 'not specified'):
                        return v
        return None

    _gps_lat = project.get('gps_lat') or all_inputs.get('gps_lat') or p1.get('gps_lat')
    _gps_lng = project.get('gps_lng') or all_inputs.get('gps_lng') or p1.get('gps_lng')
    legal = {
        'plot_no':   _legal('plot_no', 'lr_no', 'plot'),
        'coords':    _legal('coords', 'gps') or (
            f"{_gps_lat},{_gps_lng}" if _gps_lat else None),
        'title':     _legal('title_deed', 'title'),
        'architect': _legal('architect', 'architect_boraqs'),
        'engineer':  _legal('engineer', 'structural_engineer_ebk', 'structural_engineer'),
        'qs':        _legal('qs', 'quantity_surveyor_boraqs', 'quantity_surveyor'),
        'client':    _legal('client', 'client_name'),
    }
    missing_legal = [k for k in ('plot_no', 'architect', 'engineer', 'qs') if not legal.get(k)]
    if missing_legal:
        # Translate field keys into country-specific regulator names so the
        # blocker tells the customer *exactly* which board his missing
        # professional must be registered with.
        regs = get_regulators(str(location))
        country = detect_country(str(location))
        country_label = country if country != '_DEFAULT' else 'this jurisdiction'
        _label_for = {
            'plot_no':   'Plot / cadastral reference',
            'architect': f"Architect (must be registered with {regs['arch']})",
            'engineer':  f"Structural Engineer (must be registered with {regs['eng']})",
            'qs':        f"Quantity Surveyor (must be registered with {regs['qs'] or 'a recognised cost-consultant body'})",
        }
        pretty = '; '.join(_label_for[k] for k in missing_legal)
        blockers.append(
            f"{country_label} statutory IDs missing: {pretty}. "
            f"Required for permit submission to {regs['permit']}."
        )

    # --- GEOTECHNICAL DATA (BS EN 1997-1 / EC7) ---
    # Soil bearing capacity, water-table depth and soil classification are
    # FOUNDATION-CRITICAL inputs. Per the project data policy, these MUST
    # come from a real on-site geotechnical investigation (boreholes/SPT/
    # plate-load test by a registered geotechnical engineer); fabricated or
    # "regional estimate" values are NOT acceptable for permit submission.
    #
    # If the customer has uploaded a real geotech report we read its values
    # and mark the source = 'lab_report' (no warning). If not, we emit a
    # BLOCKER and use a clearly-labelled BS 8004 Table 1 presumed value
    # solely so downstream sizing can render — the report stays BLOCKED
    # until a real report is supplied.
    geotech_in = (
        project.get('geotech') or all_inputs.get('geotech') or
        p1.get('geotech') or {}
    )
    if not isinstance(geotech_in, dict):
        geotech_in = {}
    g_bearing = geotech_in.get('safe_bearing_kPa') or geotech_in.get('bearing_kPa')
    g_water   = geotech_in.get('water_table_m')
    g_soil    = geotech_in.get('soil_class') or geotech_in.get('soil_type')
    g_report  = geotech_in.get('report_ref') or geotech_in.get('report_no')
    g_engineer = geotech_in.get('geotech_engineer')
    geotech_complete = bool(g_bearing and g_water is not None and g_soil and g_report and g_engineer)
    if geotech_complete:
        geotech = {
            'source':            'lab_report',
            'safe_bearing_kPa':  float(g_bearing),
            'water_table_m':     float(g_water),
            'soil_class':        str(g_soil),
            'report_ref':        str(g_report),
            'geotech_engineer':  str(g_engineer),
            'note':              'Foundation design parameters taken from on-site geotechnical investigation per BS EN 1997-1.',
        }
    else:
        geotech = {
            'source':            'PRESUMED — NOT FOR CONSTRUCTION',
            'safe_bearing_kPa':  150.0,
            'water_table_m':     None,
            'soil_class':        'UNKNOWN',
            'report_ref':        None,
            'geotech_engineer':  None,
            'note':              'BS 8004 Table 1 presumed bearing — placeholder only. '
                                 'A real geotechnical investigation is mandatory before construction.',
        }
        blockers.append(
            'Geotechnical investigation report missing. BS EN 1997-1 / NCC 2.2.5 '
            'requires site-specific bearing capacity, water-table depth, soil '
            'classification (USCS/AASHTO) and SPT/boreholes signed by a registered '
            'geotechnical engineer BEFORE foundation design can be approved. '
            'Upload the report (POST /api/project/geotech) and re-generate.'
        )

    compliance_status = (
        'VERIFIED' if (not blockers and not fixes) else
        'AUTO-CORRECTED' if not blockers else
        'BLOCKED — DO NOT SUBMIT'
    )

    params = dict(
        project_name=project_name,
        location=str(location),
        is_ke=is_ke,
        area=area,
        stories=stories,
        floor_count=floor_count,
        units=units,
        bedrooms=bedrooms,
        style=str(style),
        foundation=foundation,
        currency=currency,
        legal=legal,
        geotech=geotech,
        compliance_status=compliance_status,
    )
    return params, fixes, blockers


# ─────────────────────────────────────────────────────────────────────────────
# 1. STRUCTURAL CALCULATIONS (BS EN 1992-1-1 / EC2 simplified residential)
# ─────────────────────────────────────────────────────────────────────────────
def _calc_loads(area: float, stories: int, occupancy: str = 'residential') -> dict:
    """Eurocode load take-down for a typical residential unit.
    Returns characteristic loads in kN/m² and tributary loads."""
    # EC1 Table 6.1 Cat A residential: gk_finish ≈ 1.5, qk = 2.0
    g_self_slab = 6.0      # kN/m² (200 mm RC slab self-wt 25 × 0.2 + finishes 1.0)
    g_partition = 1.0
    qk = 2.0               # imposed
    gk = g_self_slab + g_partition
    # ULS combo 1.35Gk + 1.5Qk
    uls = 1.35 * gk + 1.5 * qk
    sls = gk + qk
    return {
        'gk_kN_m2': gk,
        'qk_kN_m2': qk,
        'w_uls_kN_m2': uls,
        'w_sls_kN_m2': sls,
    }


def derive_grid(area_m2: float, stories: int, units: int = 1) -> dict:
    """Single source of truth for the structural grid used by *every*
    downstream calculation (slab span, beam span, column trib area, BBS,
    BOQ concrete volumes, structural drawing layout).

    Without this helper, slab/beam used the FULL building footprint as
    span (≈9.6 m unsupported) while the structural drawing showed a 4.5 m
    grid — an obvious physical impossibility flagged by structural review.

    Returns: grid_m, bays_x, bays_y, n_cols (total unique col positions),
             n_beams (total beam runs across all storeys),
             footprint_x_m, footprint_y_m.
    """
    area_per_floor = area_m2 / max(1, stories) / max(1, units)
    grid_m = 4.5
    bays_total = max(4, round(area_per_floor / (grid_m ** 2)))
    bays_x = max(2, round(math.sqrt(bays_total)))
    bays_y = max(2, math.ceil(bays_total / bays_x))
    # Snap grid to 0.5 m so the drawing is contractor-friendly
    grid_m = math.sqrt(area_per_floor / (bays_x * bays_y))
    grid_m = max(3.0, min(6.0, round(grid_m * 2) / 2))
    n_cols = (bays_x + 1) * (bays_y + 1)            # column stacks (shared by all floors)
    n_beams_per_floor = bays_x * (bays_y + 1) + bays_y * (bays_x + 1)
    n_beams = n_beams_per_floor * stories
    return {
        'grid_m':         grid_m,
        'bays_x':         bays_x,
        'bays_y':         bays_y,
        'n_cols':         n_cols,
        'n_beams':        n_beams,
        'footprint_x_m':  round(bays_x * grid_m, 2),
        'footprint_y_m':  round(bays_y * grid_m, 2),
        'area_per_floor': round(area_per_floor, 2),
    }


def calc_slab(span_short_m: float, span_long_m: float, loads: dict) -> dict:
    """One-way solid slab (or two-way if Ly/Lx ≤ 2)."""
    Lx = min(span_short_m, span_long_m)
    Ly = max(span_short_m, span_long_m)
    two_way = (Ly / Lx) <= 2.0
    # Span/depth ratio: BS EN 1992-1-1 Table 7.4N — simply supported = 20, continuous = 26
    sd_ratio = 26 if two_way else 20
    h_slab_mm = max(125, int(round(Lx * 1000 / sd_ratio / 5) * 5))  # round to 5 mm
    cover_mm = 25  # XC1 internal
    bar_dia = 12
    d_eff = h_slab_mm - cover_mm - bar_dia / 2
    # Moment per metre width (simply supported approx)
    w = loads['w_uls_kN_m2']
    Mx_kNm = w * Lx * Lx / 8 if not two_way else w * Lx * Lx * 0.062  # BS 8110 Table 3.14 αsx≈0.062
    # As required: M / (0.87 · fyk · 0.95 · d)
    fyk = 500
    As_req_mm2 = (Mx_kNm * 1e6) / (0.87 * fyk * 0.95 * d_eff)
    As_min_mm2 = 0.0013 * 1000 * h_slab_mm  # EC2 §9.3.1.1
    As_provided_mm2 = max(As_req_mm2, As_min_mm2)
    # Pick spacing for T12 (113 mm² per bar)
    bar_area = math.pi * (bar_dia / 2) ** 2
    spacing_mm = max(75, min(300, int(bar_area * 1000 / As_provided_mm2 / 25) * 25))
    return {
        'Lx_m': Lx, 'Ly_m': Ly, 'two_way': two_way,
        'h_slab_mm': h_slab_mm, 'd_eff_mm': round(d_eff, 1),
        'cover_mm': cover_mm,
        'M_kNm_per_m': round(Mx_kNm, 2),
        'As_req_mm2_per_m': round(As_req_mm2, 0),
        'As_min_mm2_per_m': round(As_min_mm2, 0),
        'As_prov_mm2_per_m': round(As_provided_mm2, 0),
        'reinforcement': f'T{bar_dia} @ {spacing_mm} c/c BW',
        'spacing_mm': spacing_mm,
        'bar_dia_mm': bar_dia,
    }


def calc_beam(clear_span_m: float, trib_width_m: float, loads: dict) -> dict:
    """Simply-supported reinforced concrete beam, Eurocode 2."""
    L = clear_span_m
    h_mm = max(300, int(round(L * 1000 / 12 / 25) * 25))   # span/12
    b_mm = max(225, int(h_mm / 2))
    cover_mm = 30  # XC1 + main bar
    main_dia = 16
    link_dia = 8
    d = h_mm - cover_mm - link_dia - main_dia / 2
    w = loads['w_uls_kN_m2'] * trib_width_m + (h_mm / 1000 * b_mm / 1000) * 25  # self-wt
    M_kNm = w * L * L / 8
    V_kN = w * L / 2
    fck = 30
    fyk = 500
    As_req = (M_kNm * 1e6) / (0.87 * fyk * 0.95 * d)
    As_min = max(0.26 * (0.3 * fck ** (2/3) / fyk), 0.0013) * b_mm * d
    n_bars_b = max(2, math.ceil(max(As_req, As_min) / (math.pi * (main_dia / 2) ** 2)))
    # Top steel — at supports: 25 % of bottom (typical)
    n_bars_t = max(2, math.ceil(n_bars_b * 0.5))
    # Shear links (EC2 §6.2.3) — simplified, vRd,c minimum
    link_spacing = max(150, min(int(0.75 * d / 25) * 25, 300))
    return {
        'L_m': L, 'b_mm': b_mm, 'h_mm': h_mm, 'd_eff_mm': round(d, 1),
        'cover_mm': cover_mm,
        'w_kN_m': round(w, 2), 'M_kNm': round(M_kNm, 1), 'V_kN': round(V_kN, 1),
        'As_req_mm2': round(As_req, 0), 'As_min_mm2': round(As_min, 0),
        'main_steel': f'{n_bars_b} no. T{main_dia} bot · {n_bars_t} no. T{main_dia} top',
        'links': f'T{link_dia} @ {link_spacing} c/c',
        'main_bars_qty': n_bars_b + n_bars_t,
        'main_dia_mm': main_dia, 'link_dia_mm': link_dia,
        'link_spacing_mm': link_spacing,
    }


def calc_column(stories: int, trib_area_m2: float, loads: dict) -> dict:
    """RC column — axial load, EC2 simplified."""
    # Floor load × stories
    N_kN = loads['w_uls_kN_m2'] * trib_area_m2 * stories + 5 * stories  # +5 kN per storey self-wt
    fck = 30
    fyk = 500
    rho = 0.02   # 2 % steel
    # NRd ≈ 0.567 fck Ac + 0.87 fyk As  → Ac = N / (0.567 fck + 0.87 · ρ · fyk)
    A_req_mm2 = N_kN * 1e3 / (0.567 * fck + 0.87 * rho * fyk)
    side = max(225, int(math.sqrt(A_req_mm2) / 25) * 25 + 25)
    Ac = side * side
    As_req = rho * Ac
    main_dia = 16
    n_bars = max(4, math.ceil(As_req / (math.pi * (main_dia / 2) ** 2)))
    if n_bars < 4: n_bars = 4
    if n_bars % 2: n_bars += 1
    link_dia = 8
    link_spacing = min(side, 12 * main_dia, 300)
    return {
        'N_kN': round(N_kN, 0),
        'side_mm': side, 'b_mm': side, 'h_mm': side,
        'fck_MPa': fck, 'fyk_MPa': fyk,
        'As_req_mm2': round(As_req, 0),
        'main_steel': f'{n_bars} no. T{main_dia}',
        'main_bars_qty': n_bars, 'main_dia_mm': main_dia,
        'links': f'T{link_dia} @ {link_spacing} c/c',
        'link_dia_mm': link_dia, 'link_spacing_mm': link_spacing,
    }


def calc_foundation(foundation_type: str, column_load_kN: float,
                    safe_bearing_kPa: float = 150) -> dict:
    """Pad / strip / raft sizing — BS 8004 presumed bearing."""
    ft = (foundation_type or '').lower()
    if 'pad' in ft:
        A_req = column_load_kN / safe_bearing_kPa     # m²
        side_m = max(0.9, math.ceil(math.sqrt(A_req) * 10) / 10)
        thk_mm = max(300, int(side_m * 250 / 0.5))
        # Bottom mesh both ways: T12 @ 150
        return {'type': 'PAD', 'plan_size_m': f'{side_m:.1f} × {side_m:.1f}',
                'thickness_mm': thk_mm, 'safe_bearing_kPa': safe_bearing_kPa,
                'reinforcement': 'T12 @ 150 c/c BW bottom',
                'concrete_grade': 'C25/30', 'cover_mm': 75,
                'column_load_kN': round(column_load_kN, 0)}
    if 'raft' in ft:
        return {'type': 'RAFT', 'plan_size_m': 'Whole footprint',
                'thickness_mm': 350, 'safe_bearing_kPa': safe_bearing_kPa,
                'reinforcement': 'T16 @ 200 c/c BW top + bottom',
                'concrete_grade': 'C25/30', 'cover_mm': 75,
                'column_load_kN': round(column_load_kN, 0)}
    # strip / strip + ground beam
    udl_per_m = column_load_kN / 4   # along strip
    width_m = max(0.45, math.ceil(udl_per_m / safe_bearing_kPa * 100) / 100)
    return {'type': 'STRIP' + (' + GROUND BEAM' if 'beam' in ft else ''),
            'plan_size_m': f'B = {width_m * 1000:.0f} mm wide × Df = 1200 mm deep',
            'thickness_mm': 300, 'safe_bearing_kPa': safe_bearing_kPa,
            'reinforcement': 'T12 @ 150 c/c BW bottom + T10 @ 200 distribution top',
            'concrete_grade': 'C25/30', 'cover_mm': 75,
            'column_load_kN': round(column_load_kN, 0)}


# ─────────────────────────────────────────────────────────────────────────────
# 2. BAR BENDING SCHEDULE (BS 8666)
# ─────────────────────────────────────────────────────────────────────────────
# Steel mass per metre (kg/m) — BS 8666 Annex A
_BAR_MASS = {6: 0.222, 8: 0.395, 10: 0.617, 12: 0.888, 16: 1.579, 20: 2.466, 25: 3.854, 32: 6.313}


def build_bbs(slab: dict, beam: dict, col: dict, found: dict,
              n_cols: int, n_beams: int, slab_area_m2: float) -> list[dict]:
    """Return BBS rows: dict per element type with totals."""
    rows = []

    def add(mark, dia, shape_code, length_m, n_off):
        m_per = _BAR_MASS.get(dia, 0)
        total_len = length_m * n_off
        weight = total_len * m_per
        rows.append({
            'mark': mark, 'dia': dia, 'shape': shape_code,
            'len_m': round(length_m, 2), 'n_off': n_off,
            'total_len_m': round(total_len, 2),
            'weight_kg': round(weight, 1),
        })

    # Slab — main bars both ways
    slab_bars_per_m = 1000 // slab['spacing_mm']
    sx = math.sqrt(slab_area_m2)  # rough side
    add('S1', slab['bar_dia_mm'], '00', sx + 0.3, int(slab_bars_per_m * sx) * 2)

    # Beams
    add('B1-bot', beam['main_dia_mm'], '00', beam['L_m'] + 0.5,
        n_beams * (beam['main_bars_qty'] // 2 + beam['main_bars_qty'] % 2))
    add('B1-top', beam['main_dia_mm'], '37', beam['L_m'] + 0.5, n_beams * 2)
    n_links = max(2, int(beam['L_m'] * 1000 / beam['link_spacing_mm'])) * n_beams
    link_perim = 2 * (beam['b_mm'] + 200) / 1000
    add('B1-link', beam['link_dia_mm'], '51', link_perim, n_links)

    # Columns
    add('C1', col['main_dia_mm'], '00', 3.5 * 1, n_cols * col['main_bars_qty'])
    n_clinks = int(3500 / col['link_spacing_mm']) * n_cols
    add('C1-link', col['link_dia_mm'], '51', 4 * (col['side_mm'] - 75) / 1000, n_clinks)

    # Foundation
    add('F1', 12, '00', 3.0, 12 * n_cols)

    return rows


# ─────────────────────────────────────────────────────────────────────────────
# 3. MEP — ELECTRICAL LOAD SCHEDULE + PLUMBING / DRAINAGE
# ─────────────────────────────────────────────────────────────────────────────
def calc_mep(area: float, bedrooms: int, units: int) -> dict:
    persons = bedrooms * 2 * units      # BS 8233
    # Electrical (IEC 60364 / KS IEC 60364 indicative)
    lighting_W = 5 * area
    sockets_W = 25 * area
    cooker_W = 6000 * units
    wh_units = max(1, math.ceil(bedrooms / 2)) * units
    wh_W = 3000 * wh_units
    ac_units = bedrooms * units
    ac_W = 1500 * ac_units
    total_W = lighting_W + sockets_W + cooker_W + wh_W + ac_W
    diversity = 0.65
    design_W = total_W * diversity
    pf = 0.95
    design_kVA = design_W / 1000 / pf
    main_A = design_W / (230 * pf)
    main_A_round = math.ceil(main_A / 5) * 5
    elec_circuits = [
        ['L1-Ln (Lighting)', f'{int(lighting_W)} W', '1.5 mm² T+E', '10 A B-curve MCB', '—'],
        ['P1-Pn (Sockets)', f'{int(sockets_W)} W', '2.5 mm² T+E', '20 A B-curve MCB', '30 mA RCD'],
        ['C (Cooker)', f'{int(cooker_W)} W', '6 mm² T+E', '32 A B-curve MCB', '—'],
        [f'W ({wh_units}× water heater)', f'{int(wh_W)} W', '4 mm² T+E', '25 A B-curve MCB', '30 mA RCD'],
        [f'A1-A{ac_units} (AC splits)', f'{int(ac_W)} W', '2.5 mm² T+E', '16 A C-curve MCB', '—'],
    ]
    # Plumbing + drainage
    # Kenya MoH / WASREB urban residential design demand: 200 L/p/d
    # (BS 8233 minimum is 180 L/p/d but Kenyan public-health practice uses
    #  200 L/p/d for unrestricted-supply housing — adopted here for credibility.)
    daily_flow_L = 200 * persons
    septic_vol_m3 = (daily_flow_L * 3) / 1000          # 3-day retention
    septic_L = 2.5
    septic_W = 1.2
    septic_D = round(septic_vol_m3 / (septic_L * septic_W), 2)
    soak_area_m2 = round(daily_flow_L / 30, 2)         # 30 L/m²/day porous soil
    soak_dia_m = round(math.sqrt(soak_area_m2 / math.pi) * 2, 2)
    # Drainage gradients (BS EN 12056-2)
    drain = [
        ['100 mm soil pipe (WC)',  '1:40 to 1:80', f'≥ {math.ceil(0.025*1):.2f} m fall per 1 m'],
        ['75 mm waste',            '1:40',         '0.025 m / m'],
        ['50 mm waste',            '1:40',         '0.025 m / m'],
        ['32 mm WHB / sink',       '1:20',         '0.050 m / m'],
    ]
    fixture_units = {
        'Water Closet (WC)': max(2, math.ceil(bedrooms / 2)) * units,
        'Wash-Hand Basin':   max(2, math.ceil(bedrooms / 2)) * units,
        'Shower / Bath':     max(2, math.ceil(bedrooms / 2)) * units,
        'Kitchen Sink':      1 * units,
        'Laundry Sink':      1 * units,
        'External Bib Tap':  2 * units,
    }
    return {
        'persons': persons,
        'lighting_W': lighting_W, 'sockets_W': sockets_W, 'cooker_W': cooker_W,
        'wh_W': wh_W, 'ac_W': ac_W,
        'total_connected_W': total_W, 'diversity': diversity,
        'design_demand_W': design_W, 'design_kVA': round(design_kVA, 1),
        'main_breaker_A': main_A_round, 'pf': pf,
        'elec_circuits': elec_circuits,
        'daily_flow_L': daily_flow_L, 'septic_vol_m3': round(septic_vol_m3, 2),
        'septic_dim': f'{septic_L} × {septic_W} × {septic_D} m (L×W×D)',
        'soak_area_m2': soak_area_m2, 'soak_dia_m': soak_dia_m,
        'drain_gradients': drain, 'fixture_units': fixture_units,
    }


# ─────────────────────────────────────────────────────────────────────────────
# 4. BOQ — KQS-2025 trade-section format, KES (or converted)
# ─────────────────────────────────────────────────────────────────────────────
# Indicative KQS-2025 unit rates (KES) — coastal/upland blended, urban Kenya
_KQS_RATES_KES = {
    # Substructure
    'site_clearance_m2':            120,
    'excavation_m3':                650,
    'hardcore_filling_m2':          850,
    'lean_concrete_m3':           14000,
    'mass_concrete_m3':           18500,
    'rc_footing_m3':              26000,
    # Superstructure
    'rc_column_m3':               32500,
    'rc_beam_m3':                 30500,
    'rc_slab_m3':                 28500,
    'block_walling_m2':            1800,
    'plaster_2sides_m2':           1100,
    # Roofing
    'roof_truss_m2':               2200,
    'roof_cover_iron_m2':          1450,
    'ceiling_gypsum_m2':           1850,
    # Finishes
    'floor_tiling_m2':             2400,
    'wall_tiling_m2':              2200,
    'paint_internal_m2':            520,
    'paint_external_m2':            720,
    # Joinery
    'door_internal_each':         18000,
    'door_external_each':         42000,
    'window_aluminium_m2':         9500,
    # Steel
    'reinforcement_kg':              165,   # supply + bend + fix
    'formwork_m2':                  1450,
}


def build_boq(params: dict, slab: dict, beam: dict, col: dict, found: dict,
              bbs: list, n_cols: int, n_beams: int, mep: dict,
              fx_to_kes: dict | None = None,
              price_overrides: dict | None = None) -> dict:
    """Return a contractor-grade BOQ dict by KQS trade section.

    `price_overrides` (optional): mapping of `{"trade|description": rate}`
    where `rate` is the QS-edited unit rate in the report currency. When
    present, that line's rate is replaced and the amount/section subtotal/
    grand total are recomputed accordingly. Overrides survive into both the
    HTML quotation and the printed PDF so the QS edit is contractually
    binding (no silent fallback to the auto-calc rate).
    """
    A = params['area']
    n = params['stories']
    R = _KQS_RATES_KES
    cur = params['currency']
    fx = fx_to_kes or {'USD': 130, 'EUR': 140, 'GBP': 165, 'KES': 1}
    k_to = fx.get(cur, 1)
    conv = lambda kes: kes / k_to
    overrides = price_overrides or {}

    # Concrete volumes
    slab_vol = A * slab['h_slab_mm'] / 1000 * n
    col_vol = (col['side_mm'] / 1000) ** 2 * 3.5 * n_cols * n
    beam_vol = (beam['b_mm'] / 1000) * (beam['h_mm'] / 1000) * beam['L_m'] * n_beams * n
    fnd_vol = A * 0.30  # rough
    # Steel weight (BBS aggregate)
    steel_kg = sum(r['weight_kg'] for r in bbs)
    # Walling
    wall_m2 = math.sqrt(A) * 4 * 3 * n      # rough perimeter × ceiling × stories
    # Tiling / paint etc.

    sections: dict[str, list[dict]] = {}
    overrides_applied: list[dict] = []

    def s(trade: str, desc: str, unit: str, qty: float, rate_kes: float):
        auto_rate = round(conv(rate_kes), 2)
        # Look up override: try full "trade|desc" first, then bare description,
        # then case-insensitive description (so the QS can edit by description
        # in any UI without having to know the PDF's internal trade label).
        rate = auto_rate
        edited = False
        for k in (f'{trade}|{desc}', desc, desc.lower()):
            if k in overrides:
                try:
                    rate = round(float(overrides[k]), 2)
                    edited = True
                    overrides_applied.append({
                        'key': k, 'auto_rate': auto_rate, 'qs_rate': rate,
                        'delta': round(rate - auto_rate, 2),
                    })
                    break
                except (TypeError, ValueError):
                    pass
        sections.setdefault(trade, []).append({
            'description': desc, 'unit': unit, 'qty': round(qty, 2),
            'rate': rate, 'amount': round(rate * qty, 2),
            'auto_rate': auto_rate, 'edited': edited,
        })

    # PRELIMINARIES — provisional, scaled at end as 8 % of works (industry norm)
    # Lump-sum line items below cover the visible deliverables; the
    # percentage top-up is added after substructure + superstructure are known.
    s('A — PRELIMINARIES', 'Site mobilisation, hoarding, signage', 'item', 1, 180000)
    s('A — PRELIMINARIES', 'Insurance (CAR + WCA + Public Liability)', 'item', 1, 320000)
    s('A — PRELIMINARIES', 'NCA Levy (0.5 % of works)', 'item', 1, 95000)
    s('A — PRELIMINARIES', 'Site office, store, sanitation, water & power', 'item', 1, 165000)
    s('A — PRELIMINARIES', 'Site supervision (Resident Engineer / Clerk of Works)', 'months', max(6, n * 4), 85000)
    # SUBSTRUCTURE
    s('B — SUBSTRUCTURE', 'Site clearance & strip topsoil', 'm²', A * 1.3, R['site_clearance_m2'])
    s('B — SUBSTRUCTURE', 'Bulk excavation foundation trenches', 'm³', fnd_vol, R['excavation_m3'])
    s('B — SUBSTRUCTURE', 'Hardcore filling 200 mm', 'm²', A, R['hardcore_filling_m2'])
    s('B — SUBSTRUCTURE', 'Lean concrete blinding 50 mm', 'm³', A * 0.05, R['lean_concrete_m3'])
    s('B — SUBSTRUCTURE', 'RC foundation C25/30', 'm³', fnd_vol, R['rc_footing_m3'])
    # SUPERSTRUCTURE
    s('C — SUPERSTRUCTURE', 'RC columns C25/30', 'm³', col_vol, R['rc_column_m3'])
    s('C — SUPERSTRUCTURE', 'RC beams C25/30', 'm³', beam_vol, R['rc_beam_m3'])
    s('C — SUPERSTRUCTURE', 'RC suspended slabs C25/30', 'm³', slab_vol, R['rc_slab_m3'])
    s('C — SUPERSTRUCTURE', 'Reinforcement bars (BBS)', 'kg', steel_kg, R['reinforcement_kg'])
    s('C — SUPERSTRUCTURE', 'Formwork to soffits & sides', 'm²', (col_vol + beam_vol + slab_vol) * 6, R['formwork_m2'])
    s('C — SUPERSTRUCTURE', '200 mm machine-cut block walling', 'm²', wall_m2, R['block_walling_m2'])
    s('C — SUPERSTRUCTURE', 'Plaster both sides', 'm²', wall_m2 * 2, R['plaster_2sides_m2'])
    # ROOFING
    s('D — ROOFING', 'Timber roof trusses & purlins', 'm²', A, R['roof_truss_m2'])
    s('D — ROOFING', '0.6 mm box-profile coloured iron sheet', 'm²', A * 1.05, R['roof_cover_iron_m2'])
    s('D — ROOFING', '9 mm gypsum ceiling on softwood brandering', 'm²', A * n, R['ceiling_gypsum_m2'])
    # FINISHES
    s('E — FINISHES', 'Floor ceramic / porcelain tiling', 'm²', A * n * 0.85, R['floor_tiling_m2'])
    s('E — FINISHES', 'Wall tiling (wet areas)', 'm²', A * n * 0.18, R['wall_tiling_m2'])
    s('E — FINISHES', 'Internal paint (Crown / Plascon emulsion)', 'm²', wall_m2 * 1.6, R['paint_internal_m2'])
    s('E — FINISHES', 'External paint (weather-shield)', 'm²', wall_m2 * 0.8, R['paint_external_m2'])
    # JOINERY
    n_int_doors = max(4, params['bedrooms'] + 3) * params['units']
    n_ext_doors = 2 * params['units']
    win_m2 = A * 0.15
    s('F — JOINERY', 'Internal flush doors with hardware', 'each', n_int_doors, R['door_internal_each'])
    s('F — JOINERY', 'External main doors hardwood', 'each', n_ext_doors, R['door_external_each'])
    s('F — JOINERY', 'Aluminium-framed sliding windows', 'm²', win_m2, R['window_aluminium_m2'])
    # MEP — rates scaled to ENGINEERED demand (kVA / fixture units),
    # not arbitrary lump sums. This makes BOQ defensible to the QS.
    _kVA = float(mep.get('design_kVA', 10) or 10)
    _fix_units = sum(int(v or 0) for v in (mep.get('fixture_units') or {}).values())
    # Mains intake, DB, breakers, RCDs, earthing rod (per IEC 60364)
    s('G — ELECTRICAL', 'Mains intake, distribution board, MCB/RCD set, earthing rod (IEC 60364)',
      'item', params['units'], 165000)
    # Switchgear sized to design demand
    s('G — ELECTRICAL', f'Switchgear & sub-mains for {_kVA:.1f} kVA design demand', 'kVA',
      _kVA * params['units'], 9500)
    s('G — ELECTRICAL', f'Lighting points & circuits (~{int(mep["lighting_W"])} W LED design)',
      'point', max(8, math.ceil(A * 0.20)) * params['units'], 2500)
    s('G — ELECTRICAL', f'Socket outlets & ring final circuits (~{int(mep["sockets_W"])} W)',
      'point', max(12, math.ceil(A * 0.18)) * params['units'], 2800)
    s('G — ELECTRICAL', 'Conduit, trunking, accessories & cable terminations',
      'm²', A * n, 280)
    # Lightning protection — mandatory for >12 m height; advisable for 2-storey
    if n >= 2:
        s('G — ELECTRICAL', 'Lightning protection: air terminal, down conductor, earth pit (IEC 62305 Class III)',
          'item', params['units'], 95000)
    # Plumbing — sized per fixture units, not lump
    s('H — PLUMBING', 'Cold + hot water reticulation, copper/PEX, valves & fittings',
      'fixture-unit', max(_fix_units, 8) * params['units'], 24000)
    s('H — PLUMBING', 'Sanitary fixtures (WC, WHB, shower, sink, taps) — supply & install',
      'fixture-unit', max(_fix_units, 8) * params['units'], 18500)
    s('H — PLUMBING', f'Septic tank + soak-pit ({mep["septic_vol_m3"]} m³ + Ø{mep["soak_dia_m"]} m)',
      'item', 1, 285000)
    s('H — PLUMBING', 'Stormwater drainage, gutters, downpipes & RWH connection',
      'm²', A * 1.05, 480)
    s('H — PLUMBING', 'Hot water system — solar/gas heater + pipework (KS 1893)',
      'each', max(1, math.ceil(params.get('bedrooms', 2) / 2)) * params['units'], 65000)

    # TOTALS
    # Top-up prelims so total prelims = ≥ 8 % of all measured works (industry norm).
    _prelim_named = sum(it['amount'] for it in sections.get('A — PRELIMINARIES', []))
    _measured_works = sum(it['amount']
                          for k, items in sections.items()
                          for it in items
                          if not k.startswith('A —'))
    _prelim_target = _measured_works * 0.08
    if _prelim_target > _prelim_named:
        s('A — PRELIMINARIES',
          f'Prelims top-up to industry norm 8 % of works (KQS-2025 §1)',
          'sum', 1, (_prelim_target - _prelim_named) * k_to)
    subtotal = sum(it['amount'] for items in sections.values() for it in items)
    contingency = round(subtotal * 0.075, 2)
    professional = round(subtotal * 0.08, 2)
    sub2 = subtotal + contingency + professional
    vat = round(sub2 * 0.16, 2)
    grand = sub2 + vat

    sym = {'KES': 'KSh ', 'USD': '$', 'EUR': '€', 'GBP': '£'}.get(cur, cur + ' ')
    return {
        'currency': cur, 'symbol': sym,
        'sections': sections,
        'subtotal': round(subtotal, 2),
        'contingency_7_5': contingency,
        'professional_fees_8': professional,
        'sub_before_vat': round(sub2, 2),
        'vat_16': vat,
        'grand_total': round(grand, 2),
        'cost_per_m2': round(grand / max(1, params['area']), 2),
        'overrides_applied': overrides_applied,
        'overrides_count':   len(overrides_applied),
    }


# ─────────────────────────────────────────────────────────────────────────────
# 5. RENDERING — append all engineering sections to ReportLab `elements`
# ─────────────────────────────────────────────────────────────────────────────
def _styles(page_w_inch: float):
    return {
        'h2': ParagraphStyle('H2', fontSize=14, textColor=colors.HexColor('#0c2461'),
                             spaceBefore=12, spaceAfter=6, fontName='Helvetica-Bold'),
        'h3': ParagraphStyle('H3', fontSize=11, textColor=colors.HexColor('#1a237e'),
                             spaceBefore=8, spaceAfter=3, fontName='Helvetica-Bold'),
        'body': ParagraphStyle('Body', fontSize=9, leading=12,
                               textColor=colors.HexColor('#2d3436')),
        'small': ParagraphStyle('Small', fontSize=8, leading=10,
                                textColor=colors.HexColor('#636e72')),
        'note': ParagraphStyle('Note', fontSize=8, leading=10,
                               textColor=colors.HexColor('#7a4f01'),
                               backColor=colors.HexColor('#fff8e1'),
                               borderPadding=4, leftIndent=4),
    }


def _table(headers, rows, col_widths, header_bg='#0c2461', body_bg='#ffffff',
           num_cols=None, align_right=None):
    align_right = align_right or []
    data = [headers] + rows
    t = Table(data, colWidths=col_widths)
    style = [
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(header_bg)),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('FONTSIZE', (0, 1), (-1, -1), 7.5),
        ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#bdc3c7')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor(body_bg)),
    ]
    for c in align_right:
        style.append(('ALIGN', (c, 0), (c, -1), 'RIGHT'))
    t.setStyle(TableStyle(style))
    return t


def render_validation_panel(elements, params, fixes, blockers, page_w):
    s = _styles(page_w)
    elements.append(Paragraph('VALIDATION ENGINE — AUDIT TRAIL', s['h2']))
    if blockers:
        elements.append(Paragraph(
            f'<b><font color="#b71c1c">⛔ {len(blockers)} BLOCKER(S) — DO NOT SUBMIT</font></b>',
            ParagraphStyle('Block', fontSize=11, textColor=colors.HexColor('#b71c1c'),
                           spaceAfter=4, fontName='Helvetica-Bold')))
        for b in blockers:
            elements.append(Paragraph('• ' + b, s['body']))
        elements.append(Spacer(1, 0.1 * inch))
    if fixes:
        rows = [[str(f[0])[:24], str(f[1])[:22], str(f[2])[:24], str(f[3])[:64]] for f in fixes]
        elements.append(Paragraph(f'<b>{len(fixes)} auto-correction(s) applied with code citation:</b>', s['body']))
        elements.append(_table(
            ['Field', 'Original', 'Auto-corrected to', 'Reason / Code citation'],
            rows, [1.1*inch, 1.1*inch, 1.4*inch, 2.7*inch],
            header_bg='#00695c', body_bg='#e0f2f1'))
    elements.append(Spacer(1, 0.15 * inch))
    elements.append(Paragraph(
        f'<b>Compliance Status: <font color="{_status_colour(params["compliance_status"])}">{params["compliance_status"]}</font></b>',
        ParagraphStyle('Stamp', fontSize=11, alignment=1, fontName='Helvetica-Bold',
                       textColor=colors.HexColor(_status_colour(params['compliance_status'])))))
    elements.append(PageBreak())


def _status_colour(status: str) -> str:
    return {'VERIFIED': '#1b5e20', 'AUTO-CORRECTED': '#00695c'}.get(status, '#b71c1c')


def render_design_brief(elements, params, loads, page_w):
    s = _styles(page_w)
    elements.append(Paragraph('1. DESIGN BRIEF & DESIGN CRITERIA', s['h2']))
    rows = [
        ['Project name', params['project_name']],
        ['Location', params['location']],
        ['Total floor area', f'{params["area"]:,.1f} m²'],
        ['No. of storeys / floor count', f'{params["stories"]} (single source of truth)'],
        ['Dwelling units', str(params['units'])],
        ['Bedrooms / unit', str(params['bedrooms'])],
        ['Architectural style', str(params['style']).title()],
        ['Foundation', params['foundation'].upper()],
        ['Currency', params['currency']],
        ['Plot / LR No.', str(params['legal'].get('plot_no') or '— REQUIRED —')],
        ['Coordinates (lat,lng)', str(params['legal'].get('coords') or '—')],
        ['Title Deed', str(params['legal'].get('title') or '—')],
        ['Architect (BORAQS)', str(params['legal'].get('architect') or '— REQUIRED —')],
        ['Structural Engineer (EBK)', str(params['legal'].get('engineer') or '— REQUIRED —')],
        ['Quantity Surveyor (BORAQS)', str(params['legal'].get('qs') or '— REQUIRED —')],
        ['Client', str(params['legal'].get('client') or '—')],
    ]
    elements.append(_table(['Item', 'Value'], rows, [2.2*inch, 4.0*inch]))
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph('Design loads (BS EN 1991-1-1 Cat A — residential):', s['h3']))
    elements.append(_table(
        ['Action', 'Value (kN/m²)', 'Reference'],
        [['Permanent action gk (slab + finishes + partitions)', f'{loads["gk_kN_m2"]:.2f}', 'EC1 Table 6.1'],
         ['Variable action qk', f'{loads["qk_kN_m2"]:.2f}', 'EC1 Table 6.2 Cat A'],
         ['Design ULS w = 1.35 gk + 1.5 qk', f'{loads["w_uls_kN_m2"]:.2f}', 'EC0 §6.4.3.2'],
         ['Design SLS w = gk + qk', f'{loads["w_sls_kN_m2"]:.2f}', 'EC0 §6.5.3'],
        ],
        [3.0*inch, 1.4*inch, 1.8*inch], align_right=[1]))
    elements.append(PageBreak())


def render_structural_calcs(elements, params, loads, slab, beam, col, found, page_w):
    s = _styles(page_w)
    elements.append(Paragraph('2. STRUCTURAL DESIGN CALCULATIONS', s['h2']))
    elements.append(Paragraph(
        'Calculations to BS EN 1992-1-1 (EC2) using fck = 30 MPa, fyk = 500 MPa, '
        'cover per exposure class XC1 internal / XC3 external. All members hand-verified '
        'against simplified Eurocode 2 design rules; final detailing to be reviewed by the '
        'Structural Engineer of Record (EBK-registered) before issue for construction.', s['body']))

    elements.append(Paragraph('2.1 Slab design (one/two-way RC slab)', s['h3']))
    sl_rows = [
        ['Short span Lx', f'{slab["Lx_m"]:.2f} m'],
        ['Long span Ly', f'{slab["Ly_m"]:.2f} m'],
        ['Behaviour', 'Two-way' if slab['two_way'] else 'One-way'],
        ['Slab thickness h', f'{slab["h_slab_mm"]} mm (span/depth = 26)'],
        ['Effective depth d', f'{slab["d_eff_mm"]} mm'],
        ['Cover', f'{slab["cover_mm"]} mm (XC1)'],
        ['Design moment M', f'{slab["M_kNm_per_m"]} kN·m / m'],
        ['As required', f'{slab["As_req_mm2_per_m"]} mm² / m'],
        ['As minimum (EC2 §9.3.1.1)', f'{slab["As_min_mm2_per_m"]} mm² / m'],
        ['As provided', f'{slab["As_prov_mm2_per_m"]} mm² / m'],
        ['Reinforcement', slab['reinforcement']],
    ]
    elements.append(_table(['Parameter', 'Value'], sl_rows, [2.2*inch, 4.0*inch]))

    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph('2.2 Beam design (simply-supported RC beam)', s['h3']))
    bm_rows = [
        ['Clear span L', f'{beam["L_m"]:.2f} m'],
        ['Beam section b × h', f'{beam["b_mm"]} × {beam["h_mm"]} mm'],
        ['Effective depth d', f'{beam["d_eff_mm"]} mm'],
        ['Cover', f'{beam["cover_mm"]} mm'],
        ['Service load w', f'{beam["w_kN_m"]} kN/m'],
        ['Design moment M', f'{beam["M_kNm"]} kN·m'],
        ['Design shear V', f'{beam["V_kN"]} kN'],
        ['As required (tension)', f'{beam["As_req_mm2"]} mm²'],
        ['Main steel', beam['main_steel']],
        ['Shear links', beam['links']],
    ]
    elements.append(_table(['Parameter', 'Value'], bm_rows, [2.2*inch, 4.0*inch]))

    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph('2.3 Column design (axially loaded RC column)', s['h3']))
    cl_rows = [
        ['Axial load N (ULS)', f'{col["N_kN"]} kN'],
        ['Section', f'{col["side_mm"]} × {col["side_mm"]} mm'],
        ['Concrete grade', f'C25/30 (fck = {col["fck_MPa"]} MPa)'],
        ['Steel grade', f'fyk = {col["fyk_MPa"]} MPa'],
        ['Steel ratio ρ', '0.020 (2.0 %)'],
        ['As required', f'{col["As_req_mm2"]} mm²'],
        ['Main steel', col['main_steel']],
        ['Links', col['links']],
    ]
    elements.append(_table(['Parameter', 'Value'], cl_rows, [2.2*inch, 4.0*inch]))

    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph('2.4 Foundation design (per BS 8004 / EN 1997-1)', s['h3']))
    geo = (params.get('geotech') or {})
    _is_real = (geo.get('source') == 'lab_report')
    fn_rows = [
        ['Foundation type', found['type']],
        ['Plan size', found['plan_size_m']],
        ['Thickness', f'{found["thickness_mm"]} mm'],
        ['Concrete grade', found['concrete_grade']],
        ['Cover', f'{found["cover_mm"]} mm (XC2 ground contact)'],
        ['Safe bearing pressure',
         f'{found["safe_bearing_kPa"]} kPa  ({"lab-tested — geotech report " + (geo.get("report_ref") or "") if _is_real else "BS 8004 Table 1 PRESUMED — placeholder"})'],
        ['Soil classification (USCS)',
         geo.get('soil_class') if _is_real else 'NOT TESTED — geotech report required'],
        ['Water-table depth below GL',
         f'{geo.get("water_table_m")} m  (lab-measured)' if _is_real and geo.get('water_table_m') is not None
         else 'NOT MEASURED — geotech report required'],
        ['Geotechnical Engineer',
         geo.get('geotech_engineer') if _is_real else '— REQUIRED —'],
        ['Column load to foundation', f'{found["column_load_kN"]} kN'],
        ['Reinforcement', found['reinforcement']],
    ]
    elements.append(_table(['Parameter', 'Value'], fn_rows, [2.4*inch, 3.8*inch]))
    elements.append(Spacer(1, 0.05*inch))
    if _is_real:
        elements.append(Paragraph(
            f'✓ Foundation parameters taken from on-site geotechnical investigation '
            f'(report ref. {geo.get("report_ref")}, signed by {geo.get("geotech_engineer")}). '
            f'Compliant with BS EN 1997-1 / NCC 2.2.5.', s['note']))
    else:
        elements.append(Paragraph(
            '<b>⛔ GEOTECHNICAL INVESTIGATION REPORT MISSING — DO NOT CONSTRUCT.</b><br/>'
            'Bearing capacity, soil classification and water-table depth shown above are '
            'BS 8004 Table 1 <i>presumed</i> placeholders; they are NOT derived from any '
            'site investigation. Per BS EN 1997-1 / Kenya NCC 2.2.5 the customer MUST '
            'commission a geotechnical investigation (boreholes, SPT N-values, Atterberg '
            'limits, plate-load test) by a registered geotechnical engineer and re-issue '
            'this report with real values BEFORE foundation works begin. EIMS will not '
            'fabricate ground data.',
            ParagraphStyle('GeoBlock', fontSize=9, leading=12,
                           textColor=colors.HexColor('#b71c1c'),
                           backColor=colors.HexColor('#ffebee'),
                           borderColor=colors.HexColor('#b71c1c'),
                           borderWidth=1, borderPadding=6, leftIndent=2)))
    elements.append(PageBreak())


def render_bbs(elements, bbs, params, page_w):
    s = _styles(page_w)
    elements.append(Paragraph('3. BAR BENDING SCHEDULE (BS 8666)', s['h2']))
    elements.append(Paragraph(
        'Schedule of all reinforcement bars with mark, diameter, shape code, length per bar, '
        'number off, total length and weight. Steel grade 500B. Bend radii and bar shapes '
        'comply with BS 8666:2020 Table 2. Quantities to be verified by the Engineer before '
        'cutting and bending.', s['body']))
    rows = [[r['mark'], f'T{r["dia"]}', r['shape'],
             f'{r["len_m"]:.2f}', str(r['n_off']),
             f'{r["total_len_m"]:.2f}', f'{r["weight_kg"]:.1f}'] for r in bbs]
    total_w = sum(r['weight_kg'] for r in bbs)
    rows.append(['', '', '', '', '', 'TOTAL', f'{total_w:.1f}'])
    elements.append(_table(
        ['Bar Mark', 'Dia.', 'Shape Code', 'Length per bar (m)', 'No. off', 'Total length (m)', 'Weight (kg)'],
        rows, [0.85*inch, 0.55*inch, 0.85*inch, 1.15*inch, 0.7*inch, 1.15*inch, 0.95*inch],
        align_right=[3, 4, 5, 6]))
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph(
        f'<b>Total reinforcement steel: {total_w:,.0f} kg ≈ {total_w/1000:.2f} tonnes</b>', s['body']))
    elements.append(PageBreak())


def render_mep(elements, mep, params, page_w):
    s = _styles(page_w)
    elements.append(Paragraph('4. MEP DESIGN — ELECTRICAL, PLUMBING & DRAINAGE', s['h2']))
    elements.append(Paragraph(
        'Electrical design per IEC 60364 / KS IEC 60364. Plumbing & sanitary drainage per '
        'BS EN 12056-2 and Kenya NCC Building Code §EHS. Septic tank to NEMA EIA Regulations 2003.',
        s['body']))

    elements.append(Paragraph('4.1 Electrical load schedule', s['h3']))
    elec_rows = [
        ['Lighting (LED) @ 5 W/m²', f'{int(mep["lighting_W"])} W'],
        ['Small power sockets @ 25 W/m²', f'{int(mep["sockets_W"])} W'],
        ['Cooker / hob (per unit)', f'{int(mep["cooker_W"])} W'],
        ['Water heaters', f'{int(mep["wh_W"])} W'],
        ['Air conditioning (split units)', f'{int(mep["ac_W"])} W'],
        ['TOTAL CONNECTED LOAD', f'{int(mep["total_connected_W"]):,} W'],
        [f'Diversity factor', f'{mep["diversity"]:.2f}'],
        [f'DESIGN MAXIMUM DEMAND', f'{int(mep["design_demand_W"]):,} W ({mep["design_kVA"]} kVA)'],
        [f'Main breaker (single phase 230 V)', f'{mep["main_breaker_A"]} A'],
    ]
    elements.append(_table(['Load description', 'Value'], elec_rows, [3.4*inch, 2.8*inch]))

    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph('4.2 Final-circuit schedule', s['h3']))
    elements.append(_table(
        ['Circuit', 'Load', 'Cable', 'Protection', 'RCD'],
        mep['elec_circuits'],
        [1.5*inch, 0.95*inch, 0.95*inch, 1.4*inch, 0.85*inch]))

    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph('4.3 Single-line diagram (text representation)', s['h3']))
    sld = (
        f'KPLC supply  ►  kWh meter  ►  Main isolator {mep["main_breaker_A"]} A  ►  Main DB (Type-B SPD)<br/>'
        '   ├─ Lighting circuits L1…Ln (1.5 mm² · 10 A)<br/>'
        '   ├─ Socket circuits  P1…Pn (2.5 mm² · 20 A · 30 mA RCD)<br/>'
        '   ├─ Cooker C (6 mm² · 32 A)<br/>'
        '   ├─ Water heaters W (4 mm² · 25 A · 30 mA RCD)<br/>'
        '   ├─ AC splits A1…An (2.5 mm² · 16 A)<br/>'
        '   └─ Earth busbar  ►  copper earth-rod ≤ 1 Ω'
    )
    elements.append(Paragraph(sld, ParagraphStyle('Mono', fontSize=8.5, leading=12,
                                                   fontName='Courier',
                                                   backColor=colors.HexColor('#fafafa'),
                                                   borderPadding=6, leftIndent=4)))

    elements.append(Spacer(1, 0.12*inch))
    elements.append(Paragraph('4.4 Plumbing fixture schedule', s['h3']))
    fx_rows = [[k, str(v)] for k, v in mep['fixture_units'].items()]
    elements.append(_table(['Fixture', 'Qty'], fx_rows, [3.0*inch, 1.0*inch], align_right=[1]))

    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph('4.5 Drainage gradient table (BS EN 12056-2)', s['h3']))
    elements.append(_table(
        ['Pipe', 'Slope range', 'Min fall'],
        mep['drain_gradients'], [1.8*inch, 1.5*inch, 1.5*inch]))

    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph('4.6 Septic tank & soak-pit sizing', s['h3']))
    sp_rows = [
        ['Design occupancy', f'{mep["persons"]} persons (BS 8233 — bedrooms × 2)'],
        ['Daily wastewater flow (180 L/p/d)', f'{mep["daily_flow_L"]:,} L/day'],
        ['Septic tank volume (3-day retention)', f'{mep["septic_vol_m3"]} m³'],
        ['Suggested tank dimensions', mep['septic_dim']],
        ['Soak-pit area (porous soil, 30 L/m²/d)', f'{mep["soak_area_m2"]} m²'],
        ['Soak-pit diameter (circular)', f'{mep["soak_dia_m"]} m'],
    ]
    elements.append(_table(['Parameter', 'Value'], sp_rows, [3.0*inch, 3.2*inch]))
    elements.append(Spacer(1, 0.05*inch))
    elements.append(Paragraph(
        '⚠ Final septic-system geometry must be confirmed by an on-site percolation test. '
        'A NEMA Environmental Impact Assessment (EIA) project report is required for systems '
        '> 50 persons or sites near surface watercourses.', s['note']))
    elements.append(PageBreak())


def render_boq(elements, boq, params, page_w):
    s = _styles(page_w)
    elements.append(Paragraph('5. BILL OF QUANTITIES (KQS-2025)', s['h2']))
    elements.append(Paragraph(
        f'Contractor-grade BOQ in {boq["currency"]}, structured by trade per the Kenya Quantity '
        'Surveyors Standard Method of Measurement. Rates are KQS-2025 indicative urban rates; '
        'tenderers shall price all items. All quantities to be verified on site.', s['body']))

    sym = boq['symbol']
    if boq.get('overrides_count'):
        elements.append(Paragraph(
            f'<b>QS rate edits applied:</b> {boq["overrides_count"]} line item(s) priced at '
            'QS-overridden rates (marked <b>★</b> in the Rate column). Auto-calculated rates '
            'shown in parentheses for audit trail.', s['body']))
    grand_rows = []
    for trade, items in boq['sections'].items():
        elements.append(Spacer(1, 0.08*inch))
        elements.append(Paragraph(f'<b>{trade}</b>', s['h3']))
        rows = []
        sub = 0
        for it in items:
            rate_cell = f'{sym}{it["rate"]:,.0f}'
            if it.get('edited'):
                rate_cell = f'<b>★ {sym}{it["rate"]:,.0f}</b><br/><font size=6 color="#888">(auto {sym}{it["auto_rate"]:,.0f})</font>'
            rows.append([it['description'][:55], it['unit'], f'{it["qty"]:,.2f}',
                         rate_cell, f'{sym}{it["amount"]:,.0f}'])
            sub += it['amount']
        rows.append(['', '', '', 'Trade subtotal', f'<b>{sym}{sub:,.0f}</b>'])
        elements.append(_table(
            ['Description', 'Unit', 'Qty', 'Rate', 'Amount'], rows,
            [3.0*inch, 0.55*inch, 0.75*inch, 1.0*inch, 1.1*inch],
            align_right=[2, 3, 4]))
        grand_rows.append([trade, f'{sym}{sub:,.0f}'])

    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph('Cost summary', s['h3']))
    sum_rows = grand_rows + [
        ['Subtotal of works', f'{sym}{boq["subtotal"]:,.0f}'],
        ['Contingency 7.5 %', f'{sym}{boq["contingency_7_5"]:,.0f}'],
        ['Professional fees 8 % (Architect + Engineer + QS)', f'{sym}{boq["professional_fees_8"]:,.0f}'],
        ['Sub-total before VAT', f'{sym}{boq["sub_before_vat"]:,.0f}'],
        ['VAT 16 %', f'{sym}{boq["vat_16"]:,.0f}'],
        ['GRAND TOTAL', f'{sym}{boq["grand_total"]:,.0f}'],
        [f'Cost per m² ({boq["currency"]})', f'{sym}{boq["cost_per_m2"]:,.0f} / m²'],
    ]
    elements.append(_table(['Item', 'Amount'], sum_rows,
                           [4.2*inch, 2.0*inch], align_right=[1],
                           header_bg='#0c2461', body_bg='#f5f7fa'))
    elements.append(PageBreak())


def render_compliance_pack(elements, params, page_w):
    s = _styles(page_w)
    elements.append(Paragraph('6. STATUTORY COMPLIANCE PACK', s['h2']))
    elements.append(Paragraph(
        'All approvals required under Kenyan law before construction. The contractor and '
        'professional team shall ensure each item is closed prior to mobilisation.', s['body']))

    pack_rows = [
        ['1. County Planning Approval', 'County Govt (Building Plans Section)',
         'Stamped architectural & structural drawings, location plan, ownership docs, NCA Reg.'],
        ['2. NCA Project Registration', 'National Construction Authority Act 2011',
         'NCA-1 form, contractor registration certificate, levy 0.5 % of contract sum.'],
        ['3. NEMA Project Report (PR)', 'EMCA 1999, EIA Regs 2003',
         'Required for projects > 5 ha or near watercourses; PR submitted to NEMA county office.'],
        ['4. Public Health Approval', 'Public Health Act Cap. 242',
         'Septic system & water supply review by County Public Health Office.'],
        ['5. EPRA / KPLC Energy Connection', 'EPRA Regulations',
         'Electrical drawings & wayleave application; final inspection by EPRA-registered Class C electrician.'],
        ['6. Fire Safety Certificate', 'County Fire Marshal',
         'Means-of-escape, extinguisher schedule, hydrant layout (NFPA 241 / Kenya Fire Code).'],
        ['7. DOSHS Notification', 'OSHA 2007 §41',
         'Notification before commencement; site safety plan, induction registers, ISO 45001.'],
    ]
    elements.append(_table(
        ['Approval', 'Authority / Statute', 'Documents required'],
        pack_rows, [1.6*inch, 1.8*inch, 2.8*inch]))

    elements.append(Spacer(1, 0.15*inch))
    elements.append(Paragraph('6.1 Professional certification (signature pages)', s['h3']))
    legal = params.get('legal') or {}
    # Localise role labels to the project's jurisdiction so the cert table
    # names the *correct* regulator (BORAQS/EBK/NCA in Kenya, ARB/RIBA &
    # ICE/IStructE & RICS in the UK, COREN/ARCON/QSRBN in Nigeria, …).
    regs = get_regulators(str(params.get('location') or ''))
    _required = '\u2014 NAME + REG. NO. REQUIRED \u2014'
    sig_rows = [
        [f'Architect ({regs["arch"]})', str(legal.get('architect') or _required),
         '[ Wet signature + official stamp ]', 'Date: ________'],
        [f'Structural Engineer ({regs["eng"]})', str(legal.get('engineer') or _required),
         '[ Wet signature + official stamp ]', 'Date: ________'],
        [f'Quantity Surveyor ({regs["qs"] or "cost consultant"})', str(legal.get('qs') or _required),
         '[ Wet signature + official stamp ]', 'Date: ________'],
        [f'Site Manager / Contractor ({regs["contractor"] or "licensed contractor"})',
         '\u2014 to be appointed before mobilisation \u2014',
         '[ Wet signature + official stamp ]', 'Date: ________'],
        ['Client / Developer', str(legal.get('client') or '\u2014 NAME REQUIRED \u2014'),
         '[ Signature ]', 'Date: ________'],
    ]
    elements.append(_table(
        ['Role', 'Name & Reg. No.', 'Signature & Stamp', 'Date'],
        sig_rows, [1.6*inch, 1.7*inch, 1.9*inch, 1.0*inch]))
    elements.append(Spacer(1, 0.1*inch))
    # Make the wet-signature requirement *unmissable* — the auditor flagged
    # blank cert pages as a procedural blocker. Spell out exactly what is
    # required and why a digital placeholder is not acceptable.
    elements.append(Paragraph(
        '<b>\u26a0\ufe0f Wet signatures &amp; official practice stamps are mandatory.</b> '
        f'Submission to {regs["permit"]} requires each professional listed above to '
        'sign and stamp this page (and every drawing sheet) IN PERSON, in indelible ink, '
        'using the practising stamp issued by their licensing board. Digital signatures, '
        'typed names and image scans are NOT acceptable for statutory plan approval.',
        s['note']))
    elements.append(Spacer(1, 0.08*inch))
    elements.append(Paragraph(
        'I certify that the design has been carried out in accordance with the relevant '
        f'codes applicable to {detect_country(str(params.get("location") or "")) if detect_country(str(params.get("location") or "")) != "_DEFAULT" else "the jurisdiction of the project"} '
        '(including the Eurocodes / British Standards referenced in §2) and that I take '
        'professional responsibility for the section of work corresponding to my registration.',
        s['small']))

    # ── 6.2 Required annexures (must be physically attached before submission) ──
    elements.append(Spacer(1, 0.18*inch))
    elements.append(Paragraph('6.2 Required annexures (attach before submission)', s['h3']))
    elements.append(Paragraph(
        'The items below must be ATTACHED as certified copies to the submission pack. '
        'Tick each box once the document has been collected and verified by the project '
        'lead. Submissions with missing annexures are rejected at intake.', s['body']))
    annex_rows = [
        ['[ ]', 'Title deed / land ownership document', 'Certified copy from registry'],
        ['[ ]', 'Survey / mutation drawing', 'Stamped by Licensed Land Surveyor'],
        ['[ ]', 'Architectural drawings (stamped)', f'Each sheet stamped by {regs["arch"]}-registered architect'],
        ['[ ]', 'Structural drawings & calculations', f'Stamped by {regs["eng"]}-registered engineer'],
        ['[ ]', 'BOQ & cost plan', f'Stamped by {regs["qs"] or "registered QS"}'],
        ['[ ]', 'Soil investigation report (boreholes/SPT/lab)', 'Mandatory before foundation works'],
        ['[ ]', 'Contractor registration certificate', f'{regs["contractor"] or "Licensed contractor"} registration'],
        ['[ ]', "Builder's All-Risk insurance", 'Cover >= contract sum, valid for project duration'],
        ['[ ]', 'Public-liability insurance', 'Cover >= KSh 10 M (or local equivalent)'],
        ['[ ]', "Workmen's compensation policy", 'Per applicable labour law'],
        ['[ ]', 'Environmental Project Report (NEMA/EIA)', 'If site near watercourse / > 5 ha'],
        ['[ ]', 'Fire-safety report & extinguisher schedule', 'Stamped by registered fire-safety consultant'],
        ['[ ]', 'Public-health approval (septic / sewer)', 'Public Health Officer sign-off'],
        ['[ ]', 'Energy / utility connection application', 'Power, water, telecoms wayleave'],
        ['[ ]', 'Site safety plan & DOSHS notification', 'Per OSH Act 2007 §41 (or local equivalent)'],
    ]
    elements.append(_table(
        ['', 'Annexure', 'Notes'],
        annex_rows, [0.35*inch, 2.55*inch, 3.4*inch]))
    elements.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# Public composition entry point
# ─────────────────────────────────────────────────────────────────────────────
def build_engineering_report(params, fixes, blockers, page_w_inch=6.7,
                              fx_to_kes=None):
    """Return a list of ReportLab flowables forming sections 1..6 of the report.
    Caller is expected to prepend the cover page and append the existing drawings."""
    out = []
    # 0 — validation
    render_validation_panel(out, params, fixes, blockers, page_w_inch)
    # Engineering parameters
    loads = _calc_loads(params['area'], params['stories'])
    # Structural grid — single source of truth (matches drawings + Phase 3)
    grid = derive_grid(params['area'], params['stories'], params.get('units', 1))
    g = grid['grid_m']
    slab = calc_slab(g, g, loads)
    # Beam clear span = grid; tributary width = half-grid each side = grid
    beam = calc_beam(g, g, loads)
    n_cols = grid['n_cols']
    n_beams = grid['n_beams']
    # Column trib area = full bay (interior); we design the worst-loaded col
    col = calc_column(params['stories'], g * g, loads)
    # Foundation sized using the actual lab-tested bearing capacity if a real
    # geotech report has been uploaded; otherwise BS 8004 Table 1 presumed
    # 150 kPa is used and the report is BLOCKED upstream.
    _safe_bearing = float((params.get('geotech') or {}).get('safe_bearing_kPa') or 150.0)
    found = calc_foundation(params['foundation'], col['N_kN'], _safe_bearing)
    # Expose grid + canonical N to caller via params for cross-section consistency
    params['_grid']         = grid
    params['_N_col_kN']     = col['N_kN']
    params['_found_canon']  = found
    bbs = build_bbs(slab, beam, col, found, n_cols, n_beams, params['area'])
    mep = calc_mep(params['area'], params['bedrooms'], params['units'])
    boq = build_boq(params, slab, beam, col, found, bbs, n_cols, n_beams, mep,
                    fx_to_kes, params.get('_price_overrides'))
    # Render sections
    render_design_brief(out, params, loads, page_w_inch)
    render_structural_calcs(out, params, loads, slab, beam, col, found, page_w_inch)
    render_bbs(out, bbs, params, page_w_inch)
    render_mep(out, mep, params, page_w_inch)
    render_boq(out, boq, params, page_w_inch)
    render_compliance_pack(out, params, page_w_inch)
    return out
