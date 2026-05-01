"""BIM-native SVG renderers — projections of the Building model.

This is the FIRST renderer in the new world: it consumes a `Building` object
and emits SVG. Replaces the ad-hoc, params-driven `SVGDrawingEngine` for
floor plans (eventually). Every wall, door, window, room is drawn from
the model's actual geometry, not a parametric guess at draw time.

Output looks like a CAD floor plan:
  - 2-line walls (true thickness drawn from WallType.thickness_m)
  - Door swings shown as quarter-circles
  - Window symbols (3-line muntins on the wall)
  - Room labels with name + area
  - Dimension strings on the bounding rectangle
  - Title block at the bottom

Each drawn element gets `data-element-id="..."` so the front-end can hit-test
and edit. This is the foundation of bi-directional editing.
"""

from __future__ import annotations

import math
from typing import Optional

from .bim_model import Building, Storey, Wall, Opening, Space, Point2D


# ============================================================================
# Internal geometry helpers
# ============================================================================

def _wall_normal(w: Wall) -> tuple[float, float]:
    """Unit normal (left of direction) for a 2-point wall. Used to offset
    each side line to draw 2-line walls at true thickness."""
    if len(w.points) < 2:
        return 0.0, 0.0
    dx = w.points[-1].x - w.points[0].x
    dy = w.points[-1].y - w.points[0].y
    L = math.hypot(dx, dy) or 1.0
    return -dy / L, dx / L


def _wall_dir(w: Wall) -> tuple[float, float]:
    if len(w.points) < 2:
        return 1.0, 0.0
    dx = w.points[-1].x - w.points[0].x
    dy = w.points[-1].y - w.points[0].y
    L = math.hypot(dx, dy) or 1.0
    return dx / L, dy / L


def _bbox(b: Building, storey: Storey) -> tuple[float, float, float, float]:
    """min_x, min_y, max_x, max_y across all geometry of one storey."""
    xs, ys = [], []
    for w in storey.walls:
        for p in w.points:
            xs.append(p.x); ys.append(p.y)
    for sl in storey.slabs:
        for p in sl.boundary:
            xs.append(p.x); ys.append(p.y)
    if not xs:
        return 0, 0, 10, 10
    return min(xs), min(ys), max(xs), max(ys)


# ============================================================================
# Floor plan
# ============================================================================

def floor_plan_svg(b: Building, *, storey_index: int = 0,
                   width_px: int = 900, padding_mm: int = 5500) -> str:
    """Render one storey of `b` as an SVG CAD floor plan.

    Coordinate system in the SVG is mm (1m = 1000 SVG units pre-viewBox);
    the viewBox handles fit-to-page and the user's CSS handles screen scaling.
    """
    if not b.storeys:
        return _empty_svg('No storeys in model')
    if storey_index >= len(b.storeys):
        return _empty_svg(f'Storey {storey_index} out of range')

    storey = b.storeys[storey_index]
    minx, miny, maxx, maxy = _bbox(b, storey)
    # Pad
    pad = padding_mm / 1000.0  # m
    minx -= pad; miny -= pad; maxx += pad; maxy += pad
    bbox_w = maxx - minx
    bbox_h = maxy - miny

    # mm units in the viewBox
    vw = bbox_w * 1000
    vh = bbox_h * 1000
    height_px = int(width_px * (vh / vw)) if vw > 0 else 600

    parts: list[str] = []
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="{minx*1000:.1f} {miny*1000:.1f} {vw:.1f} {vh:.1f}" '
        f'width="{width_px}" height="{height_px}" '
        f'style="background:#fff;font-family:Arial,sans-serif" '
        f'data-bim-storey="{storey.id}">'
    )
    parts.append(_styles())
    # Flip Y so +y is up (architect convention)
    parts.append(f'<g transform="translate(0,{(miny + maxy)*1000:.1f}) scale(1,-1)">')

    # 1. Slabs (light hatched fill so the room footprint reads instantly)
    for sl in storey.slabs:
        if sl.role != 'floor':
            continue
        pts = ' '.join(f'{p.x*1000:.1f},{p.y*1000:.1f}' for p in sl.boundary)
        parts.append(f'<polygon class="slab" points="{pts}" '
                      f'data-element-id="{sl.id}"/>')

    # 2. Spaces (room fills + labels)
    for sp in storey.spaces:
        pts = ' '.join(f'{p.x*1000:.1f},{p.y*1000:.1f}' for p in sp.boundary)
        col = _space_colour(sp.program)
        parts.append(f'<polygon class="space" fill="{col}" points="{pts}" '
                      f'data-element-id="{sp.id}"/>')

    # 3. Walls — drawn as filled rectangles (2-line walls) at true thickness
    for w in storey.walls:
        thickness = (b.types.walls.get(w.type_name).thickness_m
                      if w.type_name in b.types.walls else 0.1)
        rect_path = _wall_rect_path(w, thickness)
        css = 'wall-ext' if w.structural_role == 'external' else 'wall-int'
        parts.append(f'<path class="{css}" d="{rect_path}" '
                      f'data-element-id="{w.id}" '
                      f'data-type="{w.type_name}"/>')

    # 4. Openings — door swings + window symbols
    wall_by_id = {w.id: w for w in storey.walls}
    for o in storey.openings:
        host = wall_by_id.get(o.wall_id)
        if not host:
            continue
        if o.kind == 'door':
            t = b.types.doors.get(o.type_name)
            width = t.width_m if t else 0.9
            parts.append(_door_symbol(host, o, width))
        elif o.kind == 'window':
            t = b.types.windows.get(o.type_name)
            width = t.width_m if t else 1.5
            parts.append(_window_symbol(host, o, width))

    # 5. Room labels (name + area)
    for sp in storey.spaces:
        cx = sum(p.x for p in sp.boundary) / max(len(sp.boundary), 1)
        cy = sum(p.y for p in sp.boundary) / max(len(sp.boundary), 1)
        # Counter-flip the Y so text renders right-side-up after the parent flip
        parts.append(
            f'<g transform="translate({cx*1000:.1f},{cy*1000:.1f}) scale(1,-1)">'
            f'<text class="label" text-anchor="middle">'
            f'<tspan x="0" dy="-8">{_esc(sp.name)}</tspan>'
            f'<tspan x="0" dy="14" class="sublabel">{sp.area_m2:.1f} m²</tspan>'
            f'</text></g>'
        )

    # 6. Auto-derived grid system (named A/B/C × 1/2/3) — drawn under marks
    grid = _derive_grid(b, storey)
    parts.append(_grid_strings(grid, minx, miny, maxx, maxy))

    # 7. Dimension chains: overall + bay + opening offsets, on south & east
    parts.append(_dimension_chains(b, storey, grid, minx, miny, maxx, maxy))

    # 8. Door / window mark callouts (D-001, W-001) keyed back to schedules
    parts.append(_mark_callouts(b, storey))

    # 9. Section reference markers (where named cut lines pass through this storey)
    parts.append(_section_markers(b, storey, minx, miny, maxx, maxy))

    parts.append('</g>')

    # Title block (drawn after the flipped group so it's right-side-up)
    parts.append(_title_block(b, storey, minx, miny, maxx, maxy))

    parts.append('</svg>')
    return '\n'.join(parts)


# ============================================================================
# SVG building blocks
# ============================================================================

def _styles() -> str:
    return '''<style>
      .wall-ext { fill:#222; stroke:#000; stroke-width:6; }
      .wall-int { fill:#444; stroke:#000; stroke-width:3; }
      .slab     { fill:#f5f5f0; stroke:#bbb; stroke-width:1; }
      .space    { stroke:#888; stroke-width:1; opacity:0.55; }
      .door-line   { stroke:#000; stroke-width:5; }
      .door-arc    { fill:none; stroke:#666; stroke-width:2; stroke-dasharray:4,3; }
      .window-line { stroke:#1565c0; stroke-width:3; }
      .window-mid  { stroke:#1565c0; stroke-width:1; }
      .label    { font-size:90px; font-weight:600; fill:#222; }
      .sublabel { font-size:68px; font-weight:400; fill:#666; }
      /* Dimension chain styling (architects use thinner lines + crossed ticks) */
      .dim-line   { stroke:#666; stroke-width:1.2; fill:none; }
      .dim-tick   { stroke:#666; stroke-width:1.2; }
      .dim-cross  { stroke:#666; stroke-width:1.2; }
      .dim-text   { font-size:62px; fill:#333; text-anchor:middle; font-weight:500; }
      .dim-text-overall { font-size:76px; fill:#0c2461; font-weight:700; text-anchor:middle; }
      /* Grid system (Revit-style coloured letter/number bubbles) */
      .grid-line  { stroke:#c62828; stroke-width:1; stroke-dasharray:18,8,3,8; opacity:0.7; }
      .grid-bubble{ fill:#fff; stroke:#c62828; stroke-width:2.5; }
      .grid-text  { font-size:80px; fill:#c62828; font-weight:700; text-anchor:middle; dominant-baseline:central; }
      /* Door / window mark callouts */
      .mark-leader{ stroke:#1565c0; stroke-width:1.2; fill:none; }
      .mark-bubble-door  { fill:#fff3e0; stroke:#e65100; stroke-width:2; }
      .mark-bubble-window{ fill:#e3f2fd; stroke:#1565c0; stroke-width:2; }
      .mark-text  { font-size:54px; font-weight:700; text-anchor:middle; dominant-baseline:central; }
      .mark-door  { fill:#e65100; }
      .mark-window{ fill:#1565c0; }
      /* Section reference markers */
      .sec-line   { stroke:#000; stroke-width:2; stroke-dasharray:30,12,4,12; }
      .sec-bubble { fill:#000; stroke:#000; }
      .sec-text   { font-size:80px; fill:#fff; font-weight:700; text-anchor:middle; dominant-baseline:central; }
      .title-bg { fill:#0c2461; }
      .title-tx { font-size:78px; fill:#fff; font-weight:700; }
      .title-sub{ font-size:60px; fill:#bbdefb; }
    </style>'''


def _wall_rect_path(w: Wall, thickness: float) -> str:
    """Walls are drawn as filled polygons at true thickness — equivalent to
    Revit's 2-line wall display. The polygon is the wall centreline offset
    by ±thickness/2 along the wall normal."""
    if len(w.points) < 2:
        return ''
    nx, ny = _wall_normal(w)
    h = thickness / 2.0
    p0, p1 = w.points[0], w.points[-1]
    a = (p0.x + nx * h, p0.y + ny * h)
    b = (p1.x + nx * h, p1.y + ny * h)
    c = (p1.x - nx * h, p1.y - ny * h)
    d = (p0.x - nx * h, p0.y - ny * h)
    pts = [a, b, c, d]
    cmds = [f'M {pts[0][0]*1000:.1f} {pts[0][1]*1000:.1f}']
    for px, py in pts[1:]:
        cmds.append(f'L {px*1000:.1f} {py*1000:.1f}')
    cmds.append('Z')
    return ' '.join(cmds)


def _door_symbol(host: Wall, o: Opening, width_m: float) -> str:
    """Standard architectural door: a thick line for the leaf + a quarter-circle
    arc for the swing. Centred on `position_m` along the host wall."""
    dx, dy = _wall_dir(host)
    nx, ny = _wall_normal(host)
    p0 = host.points[0]
    cx = p0.x + dx * o.position_m
    cy = p0.y + dy * o.position_m
    # Door leaf — pivots around the start of the opening on the wall side
    half = width_m / 2.0
    # Open side is "interior" — choose the +n direction by convention
    # Hinge at one end of the opening; leaf swings 90° into the room
    hinge_x = cx - dx * half
    hinge_y = cy - dy * half
    # Leaf end (90° into the +n direction)
    leaf_end_x = hinge_x + nx * width_m
    leaf_end_y = hinge_y + ny * width_m
    # Arc end (the closed-door tip)
    closed_x = hinge_x + dx * width_m
    closed_y = hinge_y + dy * width_m

    # rx/ry = width_m * 1000 (in viewBox mm)
    r = width_m * 1000
    # Determine sweep flag: the cross product (dx,dy) × (nx,ny) determines
    # CCW vs CW in our flipped Y system. Simpler: just always sweep large=0.
    return (
        # The leaf
        f'<line class="door-line" '
        f'x1="{hinge_x*1000:.1f}" y1="{hinge_y*1000:.1f}" '
        f'x2="{leaf_end_x*1000:.1f}" y2="{leaf_end_y*1000:.1f}" '
        f'data-element-id="{o.id}" data-kind="door"/>'
        # The swing arc
        f'<path class="door-arc" '
        f'd="M {leaf_end_x*1000:.1f} {leaf_end_y*1000:.1f} '
        f'A {r:.1f} {r:.1f} 0 0 1 {closed_x*1000:.1f} {closed_y*1000:.1f}"/>'
    )


def _window_symbol(host: Wall, o: Opening, width_m: float) -> str:
    """Standard window: 3 parallel lines spanning the wall thickness."""
    dx, dy = _wall_dir(host)
    nx, ny = _wall_normal(host)
    p0 = host.points[0]
    cx = p0.x + dx * o.position_m
    cy = p0.y + dy * o.position_m
    half = width_m / 2.0
    sx = cx - dx * half
    sy = cy - dy * half
    ex = cx + dx * half
    ey = cy + dy * half
    # Approximate the wall thickness for the window outer/inner offset
    t = 0.05
    return (
        f'<line class="window-line" '
        f'x1="{(sx + nx*t)*1000:.1f}" y1="{(sy + ny*t)*1000:.1f}" '
        f'x2="{(ex + nx*t)*1000:.1f}" y2="{(ey + ny*t)*1000:.1f}" '
        f'data-element-id="{o.id}" data-kind="window"/>'
        f'<line class="window-mid" '
        f'x1="{sx*1000:.1f}" y1="{sy*1000:.1f}" '
        f'x2="{ex*1000:.1f}" y2="{ey*1000:.1f}"/>'
        f'<line class="window-line" '
        f'x1="{(sx - nx*t)*1000:.1f}" y1="{(sy - ny*t)*1000:.1f}" '
        f'x2="{(ex - nx*t)*1000:.1f}" y2="{(ey - ny*t)*1000:.1f}"/>'
    )


def _derive_grid(b: Building, storey: Storey) -> dict:
    """Auto-derive a Revit-style grid from the storey's geometry.

    For now we use the unique x-values of internal partition walls + the
    external footprint corners to generate vertical grid lines (named
    A, B, C, ... left-to-right) and the unique y-values for horizontal
    lines (numbered 1, 2, 3, ... bottom-to-top). This gives a sensible
    default grid that matches where things actually meet — which is what
    grids exist for.

    Returns:
        {
          'verticals':   [{'name': 'A', 'x': 0.0}, ...],   # vertical (N-S) grid lines
          'horizontals': [{'name': '1', 'y': 0.0}, ...],   # horizontal (E-W) grid lines
        }
    """
    # Grid v1 is the *external* footprint only: one vertical line at each
    # outer x, one horizontal at each outer y. Internal partitions are
    # visible as walls; cluttering the plan with a grid bubble for every
    # partition produces an unreadable drawing — Revit users add grids
    # selectively for the major structural axes, and that's the convention
    # we follow. A future v2 can promote junctions of 3+ walls to grids.
    if not storey.walls:
        return {'verticals': [], 'horizontals': []}
    ext_walls = [w for w in storey.walls if w.structural_role == 'external']
    if not ext_walls:
        ext_walls = storey.walls       # fall back to all if no role tagged
    xs_all: list[float] = []
    ys_all: list[float] = []
    for w in ext_walls:
        for p in w.points:
            xs_all.append(round(p.x, 2))
            ys_all.append(round(p.y, 2))

    def _consolidate(vals: list[float], tol: float = 0.05) -> list[float]:
        if not vals:
            return []
        vals = sorted(set(vals))
        out = [vals[0]]
        for v in vals[1:]:
            if v - out[-1] < tol:
                continue
            out.append(v)
        return out

    xs_sorted = _consolidate(xs_all)
    ys_sorted = _consolidate(ys_all)
    # Letter naming: A, B, C, ..., AA, AB, ...
    def _letter(i: int) -> str:
        out = ''
        i += 1                              # 1-indexed for the math
        while i > 0:
            i, rem = divmod(i - 1, 26)
            out = chr(65 + rem) + out
        return out

    return {
        'verticals':   [{'name': _letter(i), 'x': x} for i, x in enumerate(xs_sorted)],
        'horizontals': [{'name': str(i + 1),  'y': y} for i, y in enumerate(ys_sorted)],
    }


def _grid_strings(grid: dict, minx, miny, maxx, maxy) -> str:
    """Render grid lines + the round letter/number bubbles at their ends."""
    parts: list[str] = []
    # Extension beyond the bounding rectangle so grid lines stick out
    ext = 1.2  # metres
    bubble_r = 360                          # mm in viewBox space

    # Vertical grid lines (named A, B, C — drawn top-to-bottom)
    for v in grid['verticals']:
        x = v['x'] * 1000
        parts.append(
            f'<line class="grid-line" x1="{x:.1f}" y1="{(miny - ext)*1000:.1f}" '
            f'x2="{x:.1f}" y2="{(maxy + ext)*1000:.1f}"/>'
        )
        # Bubble at the top of the line
        cy_top = (maxy + ext) * 1000 + bubble_r
        parts.append(
            f'<circle class="grid-bubble" cx="{x:.1f}" cy="{cy_top:.1f}" r="{bubble_r}"/>'
            f'<g transform="translate({x:.1f},{cy_top:.1f}) scale(1,-1)">'
            f'<text class="grid-text">{_esc(v["name"])}</text></g>'
        )
        # Bubble at the bottom
        cy_bot = (miny - ext) * 1000 - bubble_r
        parts.append(
            f'<circle class="grid-bubble" cx="{x:.1f}" cy="{cy_bot:.1f}" r="{bubble_r}"/>'
            f'<g transform="translate({x:.1f},{cy_bot:.1f}) scale(1,-1)">'
            f'<text class="grid-text">{_esc(v["name"])}</text></g>'
        )

    # Horizontal grid lines (named 1, 2, 3 — left-to-right)
    for h in grid['horizontals']:
        y = h['y'] * 1000
        parts.append(
            f'<line class="grid-line" x1="{(minx - ext)*1000:.1f}" y1="{y:.1f}" '
            f'x2="{(maxx + ext)*1000:.1f}" y2="{y:.1f}"/>'
        )
        cx_l = (minx - ext) * 1000 - bubble_r
        parts.append(
            f'<circle class="grid-bubble" cx="{cx_l:.1f}" cy="{y:.1f}" r="{bubble_r}"/>'
            f'<g transform="translate({cx_l:.1f},{y:.1f}) scale(1,-1)">'
            f'<text class="grid-text">{_esc(h["name"])}</text></g>'
        )
        cx_r = (maxx + ext) * 1000 + bubble_r
        parts.append(
            f'<circle class="grid-bubble" cx="{cx_r:.1f}" cy="{y:.1f}" r="{bubble_r}"/>'
            f'<g transform="translate({cx_r:.1f},{y:.1f}) scale(1,-1)">'
            f'<text class="grid-text">{_esc(h["name"])}</text></g>'
        )
    return '\n'.join(parts)


def _dim_chain(values: list[float], y_or_x: float, axis: str,
                offset_levels: list[float], chain_levels: int = 3) -> list[str]:
    """Generate one dimension string set along an axis. `values` are the
    cut points (sorted); we draw three rows of dim chains stacked outside:

      Row 0 (closest in):  individual segment dims (between adjacent values)
      Row 1 (middle):      "bay" dims (between selected anchors — here, the
                            outermost values, identical to row 2 for a single bay)
      Row 2 (outermost):   overall dim
    """
    if len(values) < 2:
        return []
    parts: list[str] = []

    def _render(level_idx: int, segments: list[tuple[float, float, str]]):
        """Draw one dim chain row at `offset_levels[level_idx]`."""
        off = offset_levels[level_idx]
        if axis == 'horizontal':
            # Drawn below the building (y = y_or_x - off)
            y = (y_or_x - off) * 1000
            for v_start, v_end, label in segments:
                x1 = v_start * 1000
                x2 = v_end * 1000
                parts.append(f'<line class="dim-line" x1="{x1:.1f}" y1="{y:.1f}" '
                              f'x2="{x2:.1f}" y2="{y:.1f}"/>')
                # Slash ticks at each end (architectural convention)
                for xt in (x1, x2):
                    parts.append(f'<line class="dim-cross" x1="{xt-90:.1f}" y1="{y-90:.1f}" '
                                  f'x2="{xt+90:.1f}" y2="{y+90:.1f}"/>')
                cx = (x1 + x2) / 2
                cls = 'dim-text-overall' if level_idx == len(offset_levels) - 1 else 'dim-text'
                parts.append(f'<g transform="translate({cx:.1f},{y - 110:.1f}) scale(1,-1)">'
                              f'<text class="{cls}">{label}</text></g>')
        else:                               # vertical (right of building)
            x = (y_or_x + off) * 1000
            for v_start, v_end, label in segments:
                y1 = v_start * 1000
                y2 = v_end * 1000
                parts.append(f'<line class="dim-line" x1="{x:.1f}" y1="{y1:.1f}" '
                              f'x2="{x:.1f}" y2="{y2:.1f}"/>')
                for yt in (y1, y2):
                    parts.append(f'<line class="dim-cross" x1="{x-90:.1f}" y1="{yt-90:.1f}" '
                                  f'x2="{x+90:.1f}" y2="{yt+90:.1f}"/>')
                cy = (y1 + y2) / 2
                cls = 'dim-text-overall' if level_idx == len(offset_levels) - 1 else 'dim-text'
                parts.append(f'<g transform="translate({x + 220:.1f},{cy:.1f}) scale(1,-1) rotate(90)">'
                              f'<text class="{cls}">{label}</text></g>')

    # Row 0: every adjacent segment
    seg0 = []
    for i in range(len(values) - 1):
        d = values[i + 1] - values[i]
        if d < 0.001:
            continue
        seg0.append((values[i], values[i + 1], f'{d:.2f}'))
    if seg0:
        _render(0, seg0)

    # Row 1: bay dims (skip middle ticks). For a rectangle this often == row 2;
    # rendered anyway as the layout matures.
    if len(values) >= 3:
        anchors = [values[0]] + [values[len(values) // 2]] + [values[-1]]
        seg1 = []
        for i in range(len(anchors) - 1):
            d = anchors[i + 1] - anchors[i]
            if d < 0.001:
                continue
            seg1.append((anchors[i], anchors[i + 1], f'{d:.2f}'))
        if seg1:
            _render(1, seg1)

    # Row 2: overall
    overall = values[-1] - values[0]
    if overall > 0.001:
        _render(len(offset_levels) - 1, [(values[0], values[-1], f'{overall:.2f} m')])

    return parts


def _dimension_chains(b: Building, storey: Storey, grid: dict,
                       minx, miny, maxx, maxy) -> str:
    """Three-tier dimension chains on the south (running x) and east (running y)
    of the building. Tier 0 = segments between adjacent grid lines. Tier 1 =
    bay groupings. Tier 2 = overall dimension."""
    parts: list[str] = []
    # Pull the grid x-values + opening positions on the south wall for tier 0
    xs = sorted({round(v['x'], 2) for v in grid['verticals']} |
                  {round(p.x, 2) for w in storey.walls for p in w.points})
    ys = sorted({round(v['y'], 2) for v in grid['horizontals']} |
                  {round(p.y, 2) for w in storey.walls for p in w.points})

    # Add opening positions on the south & east walls so dims include
    # door/window centrelines (architect convention).
    south_wall = next((w for w in storey.walls
                        if len(w.points) == 2
                        and abs(w.points[0].y) < 0.01
                        and abs(w.points[1].y) < 0.01), None)
    if south_wall:
        for o in storey.openings:
            if o.wall_id != south_wall.id:
                continue
            # Position on wall along x (south wall is along +x)
            p0x = south_wall.points[0].x
            xs.append(round(p0x + o.position_m, 2))
        xs = sorted(set(xs))

    east_wall = next((w for w in storey.walls
                       if len(w.points) == 2
                       and abs(w.points[0].x - w.points[1].x) < 0.01
                       and w.points[0].x > 0.01), None)
    if east_wall:
        for o in storey.openings:
            if o.wall_id != east_wall.id:
                continue
            p0y = east_wall.points[0].y
            ys.append(round(p0y + o.position_m, 2))
        ys = sorted(set(ys))

    # Three offset levels stacked outside the building
    offset_levels = [1.6, 2.6, 3.8]         # metres (closest, middle, overall)

    parts.extend(_dim_chain(xs, miny, 'horizontal', offset_levels))
    parts.extend(_dim_chain(ys, maxx, 'vertical',   offset_levels))
    return '\n'.join(parts)


def _mark_callouts(b: Building, storey: Storey) -> str:
    """Door / window mark callouts: a leader line from the opening centre to a
    coloured circle with the mark text (D-001, W-001) — keyed back to the door
    and window schedules so a reader can cross-reference."""
    parts: list[str] = []
    wall_by_id = {w.id: w for w in storey.walls}

    door_idx = window_idx = 0
    bubble_r = 380          # mm
    leader_len = 1.4        # m

    # Sort openings by storey order so D-001/W-001 are stable across renders
    sorted_openings = sorted(storey.openings, key=lambda o: (o.kind, o.id))

    for o in sorted_openings:
        host = wall_by_id.get(o.wall_id)
        if not host or len(host.points) < 2:
            continue
        p0, p1 = host.points[0], host.points[-1]
        L = math.hypot(p1.x - p0.x, p1.y - p0.y) or 1.0
        dx = (p1.x - p0.x) / L
        dy = (p1.y - p0.y) / L
        nx, ny = _wall_normal(host)
        cx = p0.x + dx * o.position_m
        cy = p0.y + dy * o.position_m

        # Bubble offset INTO the room (i.e. along +n, but pick the side that
        # heads toward the interior — south wall has +n pointing inward)
        bcx = cx + nx * leader_len
        bcy = cy + ny * leader_len

        if o.kind == 'door':
            door_idx += 1
            mark = f'D-{door_idx:03d}'
            bubble_cls = 'mark-bubble-door'
            text_cls = 'mark-door'
        else:
            window_idx += 1
            mark = f'W-{window_idx:03d}'
            bubble_cls = 'mark-bubble-window'
            text_cls = 'mark-window'

        # Leader line from opening centre to bubble
        parts.append(
            f'<line class="mark-leader" x1="{cx*1000:.1f}" y1="{cy*1000:.1f}" '
            f'x2="{bcx*1000:.1f}" y2="{bcy*1000:.1f}"/>'
        )
        parts.append(
            f'<circle class="{bubble_cls}" cx="{bcx*1000:.1f}" cy="{bcy*1000:.1f}" r="{bubble_r}"/>'
            f'<g transform="translate({bcx*1000:.1f},{bcy*1000:.1f}) scale(1,-1)">'
            f'<text class="mark-text {text_cls}">{_esc(mark)}</text></g>'
        )

    return '\n'.join(parts)


def _section_markers(b: Building, storey: Storey, minx, miny, maxx, maxy) -> str:
    """Render any named section cut lines stored on Building.metadata.sections.
    Default: the building has none (the user adds them later via UI). For a
    sensible default, emit one A-A horizontal cut through the middle so the
    plan demonstrably looks like a construction document.
    """
    sections = b.metadata.get('sections')
    if not isinstance(sections, list) or not sections:
        # Default: a single A-A cut through the building centre, parallel to the x-axis
        sections = [{'name': 'A',
                      'p1': {'x': minx - 0.6, 'y': (miny + maxy) / 2.0},
                      'p2': {'x': maxx + 0.6, 'y': (miny + maxy) / 2.0}}]

    parts: list[str] = []
    bubble_r = 380
    for sec in sections:
        try:
            name = str(sec.get('name', '?'))
            p1 = sec['p1']; p2 = sec['p2']
            x1, y1, x2, y2 = float(p1['x']), float(p1['y']), float(p2['x']), float(p2['y'])
        except Exception:
            continue
        # The cut line itself
        parts.append(
            f'<line class="sec-line" x1="{x1*1000:.1f}" y1="{y1*1000:.1f}" '
            f'x2="{x2*1000:.1f}" y2="{y2*1000:.1f}"/>'
        )
        # End bubbles labelled "A-A"
        for (bx, by) in ((x1, y1), (x2, y2)):
            parts.append(
                f'<circle class="sec-bubble" cx="{bx*1000:.1f}" cy="{by*1000:.1f}" r="{bubble_r}"/>'
                f'<g transform="translate({bx*1000:.1f},{by*1000:.1f}) scale(1,-1)">'
                f'<text class="sec-text">{_esc(name)}-{_esc(name)}</text></g>'
            )
    return '\n'.join(parts)


def _title_block(b: Building, storey: Storey, minx, miny, maxx, maxy) -> str:
    """Bottom-of-sheet title block with project, storey, scale, date."""
    # Anchor in viewBox space: full-width strip below the floor plan.
    vw = (maxx - minx) * 1000
    vh = (maxy - miny) * 1000
    band_h = 240
    return (
        f'<g transform="translate({minx*1000:.1f},{(maxy + 0.3)*1000:.1f})">'
        f'<rect class="title-bg" x="0" y="0" width="{vw}" height="{band_h}"/>'
        f'<text class="title-tx" x="40" y="120">{_esc(b.name)}</text>'
        f'<text class="title-sub" x="40" y="200">'
        f'{_esc(storey.name)}  ·  GFA {b.gross_floor_area_m2:.1f} m²  ·  '
        f'{_esc(b.metadata.get("style","").replace("_"," "))}'
        f'</text>'
        f'<text class="title-sub" x="{vw - 40}" y="120" text-anchor="end">EMERSON EIMS</text>'
        f'<text class="title-sub" x="{vw - 40}" y="200" text-anchor="end">'
        f'BIM model · schema v{b.schema_version}</text>'
        f'</g>'
    )


def _space_colour(program: str) -> str:
    return {
        'living':   '#fff3e0',
        'kitchen':  '#fff9c4',
        'dining':   '#fce4ec',
        'bedroom':  '#e3f2fd',
        'bathroom': '#e0f7fa',
        'corridor': '#f5f5f5',
    }.get(program, '#fafafa')


def _esc(s: str) -> str:
    return (str(s).replace('&', '&amp;').replace('<', '&lt;')
                  .replace('>', '&gt;').replace('"', '&quot;'))


def _empty_svg(msg: str) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" '
             f'width="400" height="200"><text x="200" y="100" '
             f'text-anchor="middle" font-family="Arial" font-size="14" '
             f'fill="#999">{_esc(msg)}</text></svg>')
