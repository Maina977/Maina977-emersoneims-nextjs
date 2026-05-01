"""BIM → three.js mesh list — projection of a Building into the same
{model.objects[], stats} shape the wizard's existing addMesh() consumes.

This is the "B" of bi-directional editing: changes to the Building model
flow into the 3D viewer the same way they flow into the floor plan SVG,
because both renderers are projections of the same source of truth.

Output schema (compatible with existing addMesh in interactive_wizard.html):

    {
      'model': {
        'objects': [
          {
            'type':     'box' | 'cylinder' | 'pyramid' | 'hemisphere' | 'sphere',
            'size':     [w, h, d],
            'position': [x, y, z],          # three.js: Y up, X/Z floor plane
            'rotation': {x, y, z},          # degrees, optional
            'color':    int (0xRRGGBB) or '#hex',
            'material': 'glass' | 'concrete' | 'masonry' | 'roof',
            'transparent': bool,
            'name':     str,
            'bim_element_id': str | None,   # NEW — for click→edit later
          }, ...
        ]
      },
      'stats': {'objects': int, 'storeys': int, 'walls': int, 'openings': int}
    }

Coordinate mapping
------------------
The BIM model uses (x, y) at storey datum (metres) and `level_m` for the
storey base elevation. three.js expects Y up. We map:

    BIM .points[i].x  →  three.js  x
    BIM .points[i].y  →  three.js  z          (negate is optional; we keep +z = +y for clarity)
    BIM level + h/2   →  three.js  y          (centre of geometry)
"""

from __future__ import annotations

import math
from typing import Any

from .bim_model import Building, Wall, Slab, Opening


def _wall_object(b: Building, w: Wall, level_m: float) -> dict:
    """One wall → one box mesh oriented along the wall's direction."""
    if len(w.points) < 2:
        return {}
    p0 = w.points[0]
    p1 = w.points[-1]
    length = math.hypot(p1.x - p0.x, p1.y - p0.y)
    type_def = b.types.walls.get(w.type_name)
    thickness = type_def.thickness_m if type_def else 0.1
    height = w.height_m

    cx = (p0.x + p1.x) / 2.0
    cy_plan = (p0.y + p1.y) / 2.0
    angle_deg = math.degrees(math.atan2(p1.y - p0.y, p1.x - p0.x))

    if w.structural_role == 'external':
        color = 0xeae0d0
        material = 'masonry'
    elif w.structural_role == 'shear':
        color = 0xc7b89c
        material = 'concrete'
    else:
        color = 0xf2eee5
        material = 'masonry'

    return {
        'type': 'box',
        'size': [length, height, thickness],
        'position': [cx, level_m + height / 2.0, cy_plan],
        'rotation': {'x': 0, 'y': -angle_deg, 'z': 0},   # rotate around Y (up)
        'color': color,
        'material': material,
        'transparent': False,
        'name': f'wall_{w.id}',
        'bim_element_id': w.id,
    }


def _slab_object(b: Building, sl: Slab, level_m: float) -> dict:
    """Slab → flat box at the boundary's bbox (parametric layout uses rectangles
    so this is exact; once non-rectangular slabs land, switch to ExtrudeGeometry
    on the client)."""
    if len(sl.boundary) < 3:
        return {}
    xs = [p.x for p in sl.boundary]
    ys = [p.y for p in sl.boundary]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)
    type_def = b.types.slabs.get(sl.type_name)
    thickness = type_def.thickness_m if type_def else 0.2

    if sl.role == 'roof':
        color = 0xa0522d
        y_centre = level_m + thickness / 2.0  # roof slab top sits at storey TOP
    else:
        color = 0xb8b8b8
        y_centre = level_m - thickness / 2.0   # floor slab top sits at storey datum

    return {
        'type': 'box',
        'size': [maxx - minx, thickness, maxy - miny],
        'position': [(minx + maxx) / 2.0, y_centre, (miny + maxy) / 2.0],
        'color': color,
        'material': 'concrete' if sl.role != 'roof' else 'roof',
        'transparent': False,
        'name': f'{sl.role}_{sl.id}',
        'bim_element_id': sl.id,
    }


def _opening_object(b: Building, host: Wall, o: Opening, level_m: float) -> dict | None:
    """Door/window → translucent inset on the host wall. Real openings would
    boolean-subtract the wall mesh; for v1 we add a thin glass-coloured panel
    in the wall plane that reads as an opening at a glance."""
    if len(host.points) < 2:
        return None
    p0 = host.points[0]
    p1 = host.points[-1]
    L = math.hypot(p1.x - p0.x, p1.y - p0.y)
    if L < 0.05:
        return None
    dx = (p1.x - p0.x) / L
    dy = (p1.y - p0.y) / L
    cx = p0.x + dx * o.position_m
    cy = p0.y + dy * o.position_m
    angle_deg = math.degrees(math.atan2(p1.y - p0.y, p1.x - p0.x))

    if o.kind == 'door':
        t = b.types.doors.get(o.type_name)
        width = t.width_m if t else 0.9
        height = t.height_m if t else 2.1
        y_centre = level_m + height / 2.0
        color = 0x5d4037
        material = 'wood'
        transparent = False
    else:
        t = b.types.windows.get(o.type_name)
        width = t.width_m if t else 1.5
        height = t.height_m if t else 1.2
        y_centre = level_m + (o.sill_m or 0.9) + height / 2.0
        color = 0x90caf9
        material = 'glass'
        transparent = True

    type_def = b.types.walls.get(host.type_name)
    thickness = (type_def.thickness_m if type_def else 0.1) * 1.05  # poke through
    return {
        'type': 'box',
        'size': [width, height, thickness],
        'position': [cx, y_centre, cy],
        'rotation': {'x': 0, 'y': -angle_deg, 'z': 0},
        'color': color,
        'material': material,
        'transparent': transparent,
        'name': f'{o.kind}_{o.id}',
        'bim_element_id': o.id,
    }


def _column_object(c, level_m: float) -> dict:
    # Column section like 'C300x300' → 0.3 × 0.3 m
    section = (c.section or '').upper()
    w = h = 0.3
    try:
        if 'X' in section:
            n = section.replace('C', '').replace('B', '').split('X')
            w = float(n[0]) / 1000.0
            h = float(n[1]) / 1000.0
    except Exception:
        pass
    return {
        'type': 'box',
        'size': [w, c.height_m, h],
        'position': [c.point.x, level_m + c.height_m / 2.0, c.point.y],
        'color': 0x9e9e9e,
        'material': 'concrete',
        'transparent': False,
        'name': f'column_{c.id}',
        'bim_element_id': c.id,
    }


def building_to_three(b: Building) -> dict:
    objects: list[dict] = []
    walls_n = openings_n = 0

    for storey in b.storeys:
        # 1. Slabs (floor + roof)
        for sl in storey.slabs:
            obj = _slab_object(b, sl, storey.level_m + storey.height_m
                                if sl.role == 'roof' else storey.level_m)
            if obj:
                objects.append(obj)

        # 2. Walls
        for w in storey.walls:
            obj = _wall_object(b, w, storey.level_m)
            if obj:
                objects.append(obj)
                walls_n += 1

        # 3. Openings (doors + windows) — drawn last so they paint over walls
        wall_by_id = {w.id: w for w in storey.walls}
        for o in storey.openings:
            host = wall_by_id.get(o.wall_id)
            if not host:
                continue
            obj = _opening_object(b, host, o, storey.level_m)
            if obj:
                objects.append(obj)
                openings_n += 1

        # 4. Columns
        for c in storey.columns:
            objects.append(_column_object(c, storey.level_m))

    return {
        'success': True,
        'model': {'objects': objects},
        'stats': {
            'objects':  len(objects),
            'storeys':  len(b.storeys),
            'walls':    walls_n,
            'openings': openings_n,
            'style':    b.metadata.get('style', '?'),
            'name':     b.name,
            'gross_floor_area_m2': round(b.gross_floor_area_m2, 2),
        },
    }
