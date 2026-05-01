"""MEP clash detection — 3D AABB collision between MEP runs and structure.

Revit users pay for Navisworks Manage (~$2,500/yr) to get clash detection.
This module gives every EIMS project clash-detection out of the box.

Algorithm
---------
1. Build axis-aligned bounding boxes (AABB) for every structural and MEP
   element from the unified BIM model.
2. Sweep-and-prune candidate pairs by overlapping x-extents (O(n log n)
   instead of O(n²)).
3. For each candidate pair, test full 3D AABB intersection.
4. Classify each clash by severity:
   - HARD: solid-vs-solid (e.g. duct through column) → must reroute
   - SOFT: clearance violation (e.g. cable tray <50 mm from beam) → review
   - INFO: same-system or expected (e.g. cable in conduit) → ignored
5. Suggest a re-route direction (above/below/around).

References
----------
- BS 1192-1:2007 — clash classification levels
- AIA E202-2008 / LOD 350 — clash detection at coordination stage
- BSRIA BG 6/2018 — Design Framework for Building Services
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Any, Iterable

from eims_modules import logger


# ============================================================================
# Geometry primitives
# ============================================================================

@dataclass
class AABB:
    """Axis-aligned bounding box in metres."""
    xmin: float; ymin: float; zmin: float
    xmax: float; ymax: float; zmax: float

    def intersects(self, other: 'AABB', clearance_m: float = 0.0) -> bool:
        c = clearance_m
        return not (
            self.xmax + c < other.xmin or other.xmax + c < self.xmin or
            self.ymax + c < other.ymin or other.ymax + c < self.ymin or
            self.zmax + c < other.zmin or other.zmax + c < self.zmin
        )

    def overlap_volume_m3(self, other: 'AABB') -> float:
        dx = max(0.0, min(self.xmax, other.xmax) - max(self.xmin, other.xmin))
        dy = max(0.0, min(self.ymax, other.ymax) - max(self.ymin, other.ymin))
        dz = max(0.0, min(self.zmax, other.zmax) - max(self.zmin, other.zmin))
        return dx * dy * dz

    def centre(self) -> tuple[float, float, float]:
        return ((self.xmin + self.xmax) / 2,
                (self.ymin + self.ymax) / 2,
                (self.zmin + self.zmax) / 2)


@dataclass
class Element:
    id: str
    system: str           # 'STRUCTURE' | 'ELECTRICAL' | 'PLUMBING' | 'HVAC'
    kind: str             # 'beam' | 'column' | 'slab' | 'duct' | 'pipe' | 'cable_tray'
    aabb: AABB
    label: str = ''
    properties: dict = field(default_factory=dict)


# ============================================================================
# Element factories
# ============================================================================

def _section_to_dims(section: str, default_mm: float = 300.0) -> tuple[float, float]:
    """Parse 'C300x300', 'UC203x203x46', 'B300x500' to (width_m, depth_m).

    Falls back to default for unknown formats. Always positive.
    """
    if not section:
        return default_mm / 1000, default_mm / 1000
    s = section.upper().replace('UC', '').replace('UB', '').replace('B', '').replace('C', '')
    parts = [p for p in s.split('X') if p.strip().replace('.', '').isdigit()]
    if len(parts) >= 2:
        try:
            w = float(parts[0])
            d = float(parts[1])
            return w / 1000, d / 1000
        except ValueError:
            pass
    return default_mm / 1000, default_mm / 1000


def aabb_for_column(point_xy: tuple[float, float], section: str,
                    z_base: float, height_m: float) -> AABB:
    w, d = _section_to_dims(section, 300.0)
    cx, cy = point_xy
    return AABB(cx - w/2, cy - d/2, z_base, cx + w/2, cy + d/2, z_base + height_m)


def aabb_for_beam(p1: tuple[float, float], p2: tuple[float, float],
                  section: str, z_top: float) -> AABB:
    w, d = _section_to_dims(section, 300.0)
    x1, y1 = p1; x2, y2 = p2
    # Beam runs along centreline; bounding box covers the span + half-width
    half = max(w, d) / 2
    xmin = min(x1, x2) - half
    xmax = max(x1, x2) + half
    ymin = min(y1, y2) - half
    ymax = max(y1, y2) + half
    return AABB(xmin, ymin, z_top - d, xmax, ymax, z_top)


def aabb_for_slab(polygon_xy: list[tuple[float, float]],
                  z_top: float, thickness_m: float) -> AABB:
    if not polygon_xy:
        return AABB(0, 0, z_top - thickness_m, 0, 0, z_top)
    xs = [p[0] for p in polygon_xy]
    ys = [p[1] for p in polygon_xy]
    return AABB(min(xs), min(ys), z_top - thickness_m,
                max(xs), max(ys), z_top)


def aabb_for_run(p1: tuple[float, float, float], p2: tuple[float, float, float],
                 cross_section_w_m: float, cross_section_h_m: float) -> AABB:
    """Bounding box for a duct/pipe/tray run between two 3D points."""
    half_w = cross_section_w_m / 2
    half_h = cross_section_h_m / 2
    xs = (p1[0], p2[0]); ys = (p1[1], p2[1]); zs = (p1[2], p2[2])
    return AABB(
        min(xs) - half_w, min(ys) - half_w, min(zs) - half_h,
        max(xs) + half_w, max(ys) + half_w, max(zs) + half_h,
    )


# ============================================================================
# Clearance rules (BSRIA BG 6/2018 + Eurocode coordination)
# ============================================================================

# Minimum clear distance (m) between two systems for service access /
# fire / electromagnetic separation.
CLEARANCE_RULES: dict[tuple[str, str], float] = {
    ('ELECTRICAL', 'PLUMBING'): 0.150,   # 150 mm — water away from cable trays
    ('ELECTRICAL', 'HVAC'):     0.075,
    ('PLUMBING',   'HVAC'):     0.050,
    ('STRUCTURE',  'ELECTRICAL'): 0.025, # 25 mm cover from concrete face
    ('STRUCTURE',  'PLUMBING'):   0.025,
    ('STRUCTURE',  'HVAC'):       0.025,
}


def required_clearance(s1: str, s2: str) -> float:
    return (CLEARANCE_RULES.get((s1, s2))
            or CLEARANCE_RULES.get((s2, s1))
            or 0.0)


# ============================================================================
# Sweep-and-prune broad-phase
# ============================================================================

def _broad_phase(elements: list[Element]) -> Iterable[tuple[Element, Element]]:
    """O(n log n + k) candidate-pair generator using sweep-and-prune on x.

    Sorts by xmin, then for each element advances a window of currently-active
    elements whose xmax >= current xmin. Yields all (i, j) candidate pairs.
    """
    n = len(elements)
    if n < 2:
        return
    sorted_els = sorted(enumerate(elements), key=lambda kv: kv[1].aabb.xmin)
    active: list[tuple[int, Element]] = []
    for idx, el in sorted_els:
        # Drop active elements that finished before this one started
        active = [(i, e) for (i, e) in active if e.aabb.xmax >= el.aabb.xmin]
        for j, other in active:
            yield (el, other)
        active.append((idx, el))


# ============================================================================
# Clash classification
# ============================================================================

@dataclass
class Clash:
    a_id: str; a_system: str; a_kind: str; a_label: str
    b_id: str; b_system: str; b_kind: str; b_label: str
    severity: str                  # HARD | SOFT | INFO
    overlap_m3: float
    clearance_required_m: float
    location_xyz: tuple[float, float, float]
    suggestion: str

    def to_dict(self) -> dict:
        x, y, z = self.location_xyz
        return {
            'a': {'id': self.a_id, 'system': self.a_system,
                  'kind': self.a_kind, 'label': self.a_label},
            'b': {'id': self.b_id, 'system': self.b_system,
                  'kind': self.b_kind, 'label': self.b_label},
            'severity': self.severity,
            'overlap_m3': round(self.overlap_m3, 6),
            'clearance_required_m': self.clearance_required_m,
            'location': {'x': round(x, 3), 'y': round(y, 3), 'z': round(z, 3)},
            'suggestion': self.suggestion,
        }


def _suggest_route(a: Element, b: Element) -> str:
    """Heuristic re-route suggestion for the offending MEP element.

    Prefer routing the smaller MEP element around the larger structural one.
    Direction = whichever face has the most clearance.
    """
    # If both are structure, a redesign is needed — not a re-route
    if a.system == 'STRUCTURE' and b.system == 'STRUCTURE':
        return 'Structural conflict — review framing layout'

    mep, struct = (a, b) if b.system == 'STRUCTURE' else (b, a)
    if struct.system != 'STRUCTURE':
        return f'Reroute {mep.kind} ({mep.id[:8]}) to maintain clearance'

    # Decide above/below by comparing element centre Z
    mz = mep.aabb.centre()[2]; sz = struct.aabb.centre()[2]
    if struct.kind == 'beam':
        if mz > sz:
            return f'Drop {mep.kind} below beam soffit (penetration sleeve required)'
        return f'Raise {mep.kind} above beam top (slab penetration required)'
    if struct.kind == 'column':
        return f'Route {mep.kind} around column (offset 100 mm minimum)'
    if struct.kind == 'slab':
        if mz > sz:
            return f'Use core hole / sleeve through slab — coordinate with structural'
        return f'Drop service zone — increase ceiling void'
    return f'Reroute {mep.kind} away from {struct.kind}'


def _classify(a: Element, b: Element, overlap: float, clearance: float) -> str:
    if overlap > 0.0:
        return 'HARD'
    if clearance > 0.0:
        return 'SOFT'
    return 'INFO'


def detect(elements: list[Element]) -> dict[str, Any]:
    """Run the full clash detection sweep on a list of elements.

    Returns a dict with a clash list, severity counts, and a quality score.
    """
    pairs_seen: set[tuple[str, str]] = set()
    clashes: list[Clash] = []

    for a, b in _broad_phase(elements):
        # Same-element pair sanity
        if a.id == b.id:
            continue
        # Same system + same kind = expected adjacency (e.g. two beams meeting)
        if a.system == b.system and a.kind == b.kind:
            continue
        # Skip duplicates (a,b) vs (b,a)
        key = tuple(sorted((a.id, b.id)))
        if key in pairs_seen:
            continue
        pairs_seen.add(key)

        clearance = required_clearance(a.system, b.system)
        if not a.aabb.intersects(b.aabb, clearance_m=clearance):
            continue

        overlap = a.aabb.overlap_volume_m3(b.aabb)
        sev = _classify(a, b, overlap, clearance)
        if sev == 'INFO':
            continue

        # Mid-point of the two element centres = approximate clash location
        ax, ay, az = a.aabb.centre()
        bx, by, bz = b.aabb.centre()
        loc = ((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2)

        clashes.append(Clash(
            a_id=a.id, a_system=a.system, a_kind=a.kind, a_label=a.label,
            b_id=b.id, b_system=b.system, b_kind=b.kind, b_label=b.label,
            severity=sev,
            overlap_m3=overlap,
            clearance_required_m=clearance,
            location_xyz=loc,
            suggestion=_suggest_route(a, b),
        ))

    counts = {'HARD': 0, 'SOFT': 0}
    for c in clashes:
        counts[c.severity] = counts.get(c.severity, 0) + 1

    # Quality score: 100 - 5*HARD - 1*SOFT, floored at 0.
    score = max(0.0, 100.0 - 5.0 * counts['HARD'] - 1.0 * counts['SOFT'])

    return {
        'success': True,
        'method': 'sweep-and-prune AABB',
        'standards': ['BS 1192-1:2007', 'BSRIA BG 6/2018', 'AIA E202-2008 LOD 350'],
        'element_count': len(elements),
        'pairs_tested': len(pairs_seen),
        'clash_count': len(clashes),
        'severity_counts': counts,
        'coordination_score': round(score, 1),
        'clashes': [c.to_dict() for c in clashes],
    }


# ============================================================================
# Building -> elements adapter
# ============================================================================

def elements_from_building(building_dict: dict) -> list[Element]:
    """Convert a `Building.to_dict()` payload + any MEP overlay into Elements.

    Accepts `building_dict` with optional keys:
      - storeys[].columns / .beams / .slabs (from BIM model)
      - mep_runs: list of {system, kind, p1:[x,y,z], p2:[x,y,z], width_m, height_m}
    Missing data is skipped silently — clash detection always returns an
    answer even on partial models.
    """
    elements: list[Element] = []
    storeys = building_dict.get('storeys') or []

    # Build a level lookup so columns/beams/slabs get the right z
    level_by_id: dict[str, dict] = {}
    for s in storeys:
        level_by_id[s.get('id', '')] = {
            'level_m': float(s.get('level_m', 0.0)),
            'height_m': float(s.get('height_m', 3.0)),
        }

    for s in storeys:
        z_base = float(s.get('level_m', 0.0))
        h = float(s.get('height_m', 3.0))
        z_top = z_base + h

        for col in s.get('columns', []) or []:
            pt = col.get('point') or {}
            section = col.get('section', 'C300x300')
            elements.append(Element(
                id=col.get('id', f'col-{len(elements)}'),
                system='STRUCTURE', kind='column',
                aabb=aabb_for_column((float(pt.get('x', 0)), float(pt.get('y', 0))),
                                     section, z_base, h),
                label=f"Column {section}",
            ))

        for bm in s.get('beams', []) or []:
            p1 = bm.get('p1') or {}; p2 = bm.get('p2') or {}
            section = bm.get('section', 'B300x500')
            elements.append(Element(
                id=bm.get('id', f'beam-{len(elements)}'),
                system='STRUCTURE', kind='beam',
                aabb=aabb_for_beam(
                    (float(p1.get('x', 0)), float(p1.get('y', 0))),
                    (float(p2.get('x', 0)), float(p2.get('y', 0))),
                    section, z_top),
                label=f"Beam {section}",
            ))

        for sl in s.get('slabs', []) or []:
            poly = [(float(p.get('x', 0)), float(p.get('y', 0)))
                    for p in (sl.get('boundary') or [])]
            thk = float((sl.get('properties') or {}).get('thickness_m', 0.2))
            elements.append(Element(
                id=sl.get('id', f'slab-{len(elements)}'),
                system='STRUCTURE', kind='slab',
                aabb=aabb_for_slab(poly, z_top, thk),
                label=f"Slab t={int(thk*1000)}mm",
            ))

    for run in building_dict.get('mep_runs') or []:
        try:
            p1 = run['p1']; p2 = run['p2']
            p1t = (float(p1[0]), float(p1[1]), float(p1[2]))
            p2t = (float(p2[0]), float(p2[1]), float(p2[2]))
            elements.append(Element(
                id=run.get('id', f"mep-{len(elements)}"),
                system=str(run.get('system', 'HVAC')).upper(),
                kind=str(run.get('kind', 'duct')),
                aabb=aabb_for_run(p1t, p2t,
                                  float(run.get('width_m', 0.3)),
                                  float(run.get('height_m', 0.3))),
                label=run.get('label', f"{run.get('system','')} {run.get('kind','')}"),
            ))
        except (KeyError, TypeError, ValueError, IndexError) as e:
            logger.warning('Skipping malformed MEP run: %s', e)

    return elements


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/mep/clash-detect', methods=['POST'])
    def _clash_detect():
        """Run clash detection on a BIM model + optional MEP runs.

        Body:
          {
            "building": <Building.to_dict() output, or {storeys:[...]}>,
            "mep_runs": [{
              "system":"HVAC", "kind":"duct",
              "p1":[x,y,z], "p2":[x,y,z],
              "width_m":0.4, "height_m":0.3, "label":"AHU-1 supply"
            }, ...]
          }
        """
        data = request.get_json(silent=True) or {}
        building = data.get('building') or {}
        mep_runs = data.get('mep_runs') or []
        if mep_runs:
            building = {**building, 'mep_runs': mep_runs}
        try:
            els = elements_from_building(building)
        except Exception as e:
            logger.exception('clash detection failed')
            return jsonify({'success': False, 'error': str(e)}), 400
        result = detect(els)
        return jsonify(result), 200

    @app.route('/api/mep/clash/clearance-rules', methods=['GET'])
    def _clash_rules():
        return jsonify({
            'success': True,
            'standards': ['BSRIA BG 6/2018', 'BS 1192-1:2007'],
            'rules_m': {f'{a}↔{b}': v for (a, b), v in CLEARANCE_RULES.items()},
        }), 200

    logger.info('mep_clash module registered: /api/mep/clash-detect, /api/mep/clash/clearance-rules')
