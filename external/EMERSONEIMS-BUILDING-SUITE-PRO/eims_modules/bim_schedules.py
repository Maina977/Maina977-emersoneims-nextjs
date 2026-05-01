"""BIM schedule generators — Revit-equivalent schedules derived from a Building.

A schedule is a tabular projection of the BIM model: door schedules, window
schedules, wall schedules, material take-offs, space schedules, structural
element schedules. Every row is keyed back to the model element by id, so
clicking a row in the UI can highlight that element in plan/3D once those
views become BIM-aware.

Each schedule returns:

    {
      'name':    'Door schedule',
      'columns': ['Mark', 'Type', 'Width', 'Height', 'Storey', 'Hosted by', ...],
      'rows':    [{'mark': 'D-001', 'element_id': 'opn_...', ...}, ...],
      'totals':  {'count': 12, 'total_cost_USD': 1440.00},
      'sources': ['BS EN 14351-1', ...],     # for the data-provenance pipe
    }

This module is the foundation for the "professional schedules" feature
Revit charges $2,675/year for. We build it once, every project gets it.
"""

from __future__ import annotations

from typing import Any
from collections import defaultdict

from .bim_model import Building, Wall, Slab, Opening, Space, Column, Beam


def _mark(prefix: str, idx: int) -> str:
    """Schedule mark — Revit convention: D-001, W-001, etc."""
    return f'{prefix}-{idx:03d}'


def _collect_sources(*lists) -> list[str]:
    out = set()
    for li in lists:
        for s in li:
            if isinstance(s, str) and s.strip():
                out.add(s.strip())
    return sorted(out)


# ----------------------------------------------------------------------------
# Door schedule
# ----------------------------------------------------------------------------

def door_schedule(b: Building) -> dict:
    rows = []
    storey_by_id = {s.id: s for s in b.storeys}
    wall_by_id = {w.id: w for s in b.storeys for w in s.walls}
    sources_acc: list[str] = []
    total_cost = 0.0
    type_counts: dict[str, int] = defaultdict(int)

    doors = [o for o in b.all_openings() if o.kind == 'door']
    for i, d in enumerate(doors, 1):
        dt = b.types.doors.get(d.type_name)
        host = wall_by_id.get(d.wall_id)
        storey = next((s for s in b.storeys if any(w.id == d.wall_id for w in s.walls)), None)
        cost = (dt.cost_per_unit or 0.0) if dt else 0.0
        total_cost += cost
        type_counts[d.type_name] += 1
        rows.append({
            'mark':       _mark('D', i),
            'element_id': d.id,
            'type_name':  d.type_name,
            'width_m':    dt.width_m if dt else None,
            'height_m':   dt.height_m if dt else None,
            'fire_rating_min': dt.fire_rating_minutes if dt else None,
            'storey':     storey.name if storey else '',
            'wall_host':  host.id if host else '',
            'position_m': round(d.position_m, 2),
            'cost_USD':   cost,
            'sources':    list(d.source_refs) + (list(dt.source_refs) if dt else []),
        })
        if dt:
            sources_acc.extend(dt.source_refs)
        sources_acc.extend(d.source_refs)

    return {
        'name': 'Door schedule',
        'columns': ['Mark', 'Type', 'Width (m)', 'Height (m)',
                     'Fire rating (min)', 'Storey', 'Position on wall (m)', 'Cost (USD)'],
        'rows': rows,
        'totals': {
            'count': len(rows),
            'total_cost_USD': round(total_cost, 2),
            'by_type': dict(type_counts),
        },
        'sources': _collect_sources(sources_acc),
    }


# ----------------------------------------------------------------------------
# Window schedule
# ----------------------------------------------------------------------------

def window_schedule(b: Building) -> dict:
    rows = []
    wall_by_id = {w.id: w for s in b.storeys for w in s.walls}
    sources_acc: list[str] = []
    total_cost = 0.0
    type_counts: dict[str, int] = defaultdict(int)

    windows = [o for o in b.all_openings() if o.kind == 'window']
    for i, w in enumerate(windows, 1):
        wt = b.types.windows.get(w.type_name)
        host = wall_by_id.get(w.wall_id)
        storey = next((s for s in b.storeys if any(ww.id == w.wall_id for ww in s.walls)), None)
        cost = (wt.cost_per_unit or 0.0) if wt else 0.0
        total_cost += cost
        type_counts[w.type_name] += 1
        rows.append({
            'mark':       _mark('W', i),
            'element_id': w.id,
            'type_name':  w.type_name,
            'width_m':    wt.width_m if wt else None,
            'height_m':   wt.height_m if wt else None,
            'glazing':    wt.glazing if wt else '',
            'u_value_W_m2K': wt.u_value_W_m2K if wt else None,
            'g_value':    wt.g_value if wt else None,
            'sill_m':     round(w.sill_m, 2),
            'storey':     storey.name if storey else '',
            'wall_host':  host.id if host else '',
            'position_m': round(w.position_m, 2),
            'cost_USD':   cost,
        })
        if wt:
            sources_acc.extend(wt.source_refs)
        sources_acc.extend(w.source_refs)

    return {
        'name': 'Window schedule',
        'columns': ['Mark', 'Type', 'Width (m)', 'Height (m)', 'Glazing',
                     'U-value (W/m²K)', 'g-value', 'Sill (m)', 'Storey', 'Cost (USD)'],
        'rows': rows,
        'totals': {
            'count': len(rows),
            'total_cost_USD': round(total_cost, 2),
            'by_type': dict(type_counts),
        },
        'sources': _collect_sources(sources_acc),
    }


# ----------------------------------------------------------------------------
# Wall schedule
# ----------------------------------------------------------------------------

def wall_schedule(b: Building) -> dict:
    """Per-instance wall schedule. Each row is one wall with its length, area,
    type, U-value, fire rating, and cost contribution."""
    rows = []
    sources_acc: list[str] = []
    total_cost = 0.0
    total_area = 0.0
    by_type_area: dict[str, float] = defaultdict(float)

    for i, w in enumerate(b.all_walls(), 1):
        wt = b.types.walls.get(w.type_name)
        storey = next((s for s in b.storeys if w in s.walls), None)
        area = w.length_m * w.height_m
        total_area += area
        by_type_area[w.type_name] += area
        cost = area * (wt.cost_per_m2 or 0.0) if wt else 0.0
        total_cost += cost
        rows.append({
            'mark':       _mark('WAL', i),
            'element_id': w.id,
            'type_name':  w.type_name,
            'role':       w.structural_role,
            'length_m':   round(w.length_m, 2),
            'height_m':   round(w.height_m, 2),
            'area_m2':    round(area, 2),
            'thickness_m': wt.thickness_m if wt else None,
            'u_value_W_m2K': wt.u_value_W_m2K if wt else None,
            'fire_rating_min': wt.fire_rating_minutes if wt else None,
            'storey':     storey.name if storey else '',
            'cost_USD':   round(cost, 2),
        })
        if wt:
            sources_acc.extend(wt.source_refs)
        sources_acc.extend(w.source_refs)

    return {
        'name': 'Wall schedule',
        'columns': ['Mark', 'Type', 'Role', 'Length (m)', 'Height (m)',
                     'Area (m²)', 'Thickness (m)', 'U (W/m²K)',
                     'Fire (min)', 'Storey', 'Cost (USD)'],
        'rows': rows,
        'totals': {
            'count':         len(rows),
            'total_area_m2': round(total_area, 2),
            'total_cost_USD': round(total_cost, 2),
            'by_type_area_m2': {k: round(v, 2) for k, v in by_type_area.items()},
        },
        'sources': _collect_sources(sources_acc),
    }


# ----------------------------------------------------------------------------
# Space (room) schedule
# ----------------------------------------------------------------------------

def space_schedule(b: Building) -> dict:
    rows = []
    by_program: dict[str, list[Space]] = defaultdict(list)
    total_area = 0.0
    for sp in b.all_spaces():
        by_program[sp.program].append(sp)
        total_area += sp.area_m2

    for i, sp in enumerate(b.all_spaces(), 1):
        storey = next((s for s in b.storeys if sp in s.spaces), None)
        rows.append({
            'mark':       _mark('SP', i),
            'element_id': sp.id,
            'name':       sp.name,
            'program':    sp.program,
            'area_m2':    round(sp.area_m2, 2),
            'storey':     storey.name if storey else '',
            'min_required_m2': sp.properties.get('min_m2'),
            'meets_minimum':   (sp.properties.get('min_m2') is None
                                 or sp.area_m2 >= sp.properties.get('min_m2', 0)),
        })

    return {
        'name': 'Space (room) schedule',
        'columns': ['Mark', 'Name', 'Program', 'Area (m²)',
                     'Min required (m²)', 'Meets min', 'Storey'],
        'rows': rows,
        'totals': {
            'count': len(rows),
            'total_area_m2': round(total_area, 2),
            'by_program_count': {k: len(v) for k, v in by_program.items()},
            'by_program_area_m2': {k: round(sum(s.area_m2 for s in v), 2)
                                     for k, v in by_program.items()},
        },
        'sources': ['EIMS parametric layout v1'],
    }


# ----------------------------------------------------------------------------
# Material take-off — the QS's favourite output
# ----------------------------------------------------------------------------

def material_takeoff(b: Building) -> dict:
    """Aggregate material quantities + cost across all wall, slab, door, and
    window instances. The bridge between the BIM model and the QS BOQ flow."""
    materials: dict[str, dict] = defaultdict(lambda: {'qty': 0.0, 'unit': '',
                                                        'cost_USD': 0.0,
                                                        'sources': set()})

    # Walls — per layer
    for w in b.all_walls():
        wt = b.types.walls.get(w.type_name)
        if not wt:
            continue
        area = w.length_m * w.height_m
        for layer in wt.layers:
            mat = layer['material']
            volume = area * layer['thickness_m']
            materials[mat]['qty'] += volume
            materials[mat]['unit'] = 'm³'
            for src in [layer.get('source')] + (wt.source_refs or []):
                if src:
                    materials[mat]['sources'].add(src)

    # Slabs — by area × thickness
    for s in b.storeys:
        for sl in s.slabs:
            st = b.types.slabs.get(sl.type_name)
            if not st:
                continue
            volume = sl.area_m2 * st.thickness_m
            mat = sl.type_name
            materials[mat]['qty'] += volume
            materials[mat]['unit'] = 'm³'
            for src in st.source_refs:
                materials[mat]['sources'].add(src)
            if st.cost_per_m2:
                materials[mat]['cost_USD'] += sl.area_m2 * st.cost_per_m2

    # Doors and windows — per unit
    for o in b.all_openings():
        bag = b.types.doors if o.kind == 'door' else b.types.windows
        t = bag.get(o.type_name)
        if not t:
            continue
        materials[o.type_name]['qty'] += 1
        materials[o.type_name]['unit'] = 'unit'
        if t.cost_per_unit:
            materials[o.type_name]['cost_USD'] += t.cost_per_unit
        for src in t.source_refs:
            materials[o.type_name]['sources'].add(src)

    rows = []
    total_cost = 0.0
    for name, agg in sorted(materials.items()):
        total_cost += agg['cost_USD']
        rows.append({
            'material':  name,
            'quantity':  round(agg['qty'], 2),
            'unit':      agg['unit'],
            'cost_USD':  round(agg['cost_USD'], 2),
            'sources':   sorted(agg['sources']),
        })

    return {
        'name': 'Material take-off',
        'columns': ['Material', 'Quantity', 'Unit', 'Cost (USD)', 'Sources'],
        'rows': rows,
        'totals': {
            'distinct_materials': len(rows),
            'total_cost_USD': round(total_cost, 2),
        },
        'sources': _collect_sources(*[r['sources'] for r in rows]),
    }


# ----------------------------------------------------------------------------
# Structural element schedule
# ----------------------------------------------------------------------------

def structural_schedule(b: Building) -> dict:
    rows = []
    sources_acc: list[str] = []
    for s in b.storeys:
        for c in s.columns:
            rows.append({
                'mark':       _mark('COL', len(rows) + 1),
                'element_id': c.id,
                'kind':       'column',
                'storey':     s.name,
                'section':    c.section,
                'material':   c.material,
                'length_m':   round(c.height_m, 2),
                'sources':    c.source_refs,
            })
            sources_acc.extend(c.source_refs)
        for be in s.beams:
            rows.append({
                'mark':       _mark('BEM', len(rows) + 1),
                'element_id': be.id,
                'kind':       'beam',
                'storey':     s.name,
                'section':    be.section,
                'material':   be.material,
                'length_m':   round(be.length_m, 2),
                'sources':    be.source_refs,
            })
            sources_acc.extend(be.source_refs)

    by_kind = defaultdict(int)
    for r in rows:
        by_kind[r['kind']] += 1

    return {
        'name': 'Structural element schedule',
        'columns': ['Mark', 'Kind', 'Storey', 'Section', 'Material', 'Length (m)'],
        'rows': rows,
        'totals': {
            'count': len(rows),
            'by_kind': dict(by_kind),
            'total_length_m': round(sum(r['length_m'] for r in rows), 2),
        },
        'sources': _collect_sources(sources_acc),
    }


# ----------------------------------------------------------------------------
# Public entry point
# ----------------------------------------------------------------------------

ALL_SCHEDULES = {
    'doors':       door_schedule,
    'windows':     window_schedule,
    'walls':       wall_schedule,
    'spaces':      space_schedule,
    'materials':   material_takeoff,
    'structural':  structural_schedule,
}


def all_schedules(b: Building) -> dict:
    """Compute every schedule for a Building and return them keyed by id."""
    return {key: fn(b) for key, fn in ALL_SCHEDULES.items()}
