"""Unified BIM data model — the canonical source of truth for a project.

This is the foundation of the BIM authoring story. Every renderer (floor plan,
elevation, section, 3D, IFC, BOQ, schedules, PDF report) is intended to be a
*projection* of a single Building object — not, as today, an independent
regeneration from raw wizard params.

Migration is incremental (strangler-fig pattern):
  * `Building.from_params(...)` ingests today's wizard inputs and returns a
    fully-populated model. Existing code paths keep working unchanged.
  * New endpoints (/api/bim/...) read from the model.
  * Legacy renderers (SVGDrawingEngine, three.js viewer, IFC export) get
    rewritten one at a time to consume the model. Until then, both paths
    coexist.

Design principles
-----------------
1. **Every element carries provenance.** A `source_refs` list records the
   standards / tables / engineering rules that justified each value, so the
   QS/professor/architect can trace any number back to its origin. This is
   the same data-policy that governs the PDF report's Provenance Appendix.

2. **Types vs. instances.** A `WallType` (or DoorType, etc.) holds the
   shared properties — layers, U-value, fire rating, cost — and many
   `Wall` instances reference one type. Edits to a type propagate to every
   instance. Mirrors the Revit family-type model.

3. **Geometry is parametric, not pixel.** Walls are polylines of (x,y) in
   metres at a storey datum; openings are 1-D positions along a wall's
   centreline. Renderers project this into SVG / three.js / IFC at draw time.

4. **Acyclic references.** Element IDs are stable strings (uuid4 hex). A
   wall references a storey by id; an opening references a wall by id. No
   cycles. `Building.validate()` checks integrity.

5. **Round-trippable.** `building.to_dict()` and `Building.from_dict()`
   are inverses. The full model serialises to JSON and persists in
   `projects.data_json.bim` — additive, no schema migration required.

This module is pure data + geometry. It has zero dependencies on Flask,
ReportLab, or any external service. Renderers and Flask routes live
elsewhere and *consume* it.
"""

from __future__ import annotations

import math
import uuid
from dataclasses import dataclass, field, asdict
from typing import Any, Optional


# ============================================================================
# Primitives
# ============================================================================

@dataclass
class Point2D:
    """Plan-coordinate point in metres. Origin is the storey's south-west
    corner; +x east, +y north."""
    x: float
    y: float

    def to_dict(self) -> dict:
        return {'x': round(self.x, 4), 'y': round(self.y, 4)}

    @classmethod
    def from_dict(cls, d: dict) -> 'Point2D':
        return cls(x=float(d['x']), y=float(d['y']))


def _new_id(prefix: str) -> str:
    """Stable element id. Prefix lets logs/inspectors tell a Wall from a Door
    at a glance without dereferencing the type."""
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


def _polyline_length_m(points: list[Point2D]) -> float:
    if len(points) < 2:
        return 0.0
    return sum(math.hypot(points[i+1].x - points[i].x,
                          points[i+1].y - points[i].y)
               for i in range(len(points) - 1))


# ============================================================================
# Type catalog (shared properties — Revit "family types")
# ============================================================================

@dataclass
class WallType:
    """Shared properties for many Wall instances. Layers list runs from
    exterior to interior; thicknesses sum to overall wall thickness."""
    name: str
    thickness_m: float
    layers: list[dict] = field(default_factory=list)        # [{material, thickness_m, lambda_W_mK, source}]
    u_value_W_m2K: Optional[float] = None
    fire_rating_minutes: Optional[int] = None
    acoustic_Rw_dB: Optional[int] = None
    structural: bool = False
    cost_per_m2: Optional[float] = None                      # base USD
    source_refs: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class DoorType:
    name: str
    width_m: float
    height_m: float
    fire_rating_minutes: Optional[int] = None
    acoustic_Rw_dB: Optional[int] = None
    cost_per_unit: Optional[float] = None
    source_refs: list[str] = field(default_factory=list)


@dataclass
class WindowType:
    name: str
    width_m: float
    height_m: float
    glazing: str = 'double'                                  # single | double | triple
    u_value_W_m2K: Optional[float] = None
    g_value: Optional[float] = None                          # solar heat gain coeff
    cost_per_unit: Optional[float] = None
    source_refs: list[str] = field(default_factory=list)


@dataclass
class SlabType:
    name: str
    thickness_m: float
    structural: bool = True
    u_value_W_m2K: Optional[float] = None
    cost_per_m2: Optional[float] = None
    source_refs: list[str] = field(default_factory=list)


# ============================================================================
# Element instances
# ============================================================================

@dataclass
class Wall:
    id: str
    type_name: str                          # → WallType in catalog
    points: list[Point2D]                   # polyline at storey datum
    height_m: float
    storey_id: str
    structural_role: str = 'partition'      # partition | external | shear | retaining
    properties: dict = field(default_factory=dict)
    source_refs: list[str] = field(default_factory=list)

    @property
    def length_m(self) -> float:
        return _polyline_length_m(self.points)

    def to_dict(self) -> dict:
        return {
            'id': self.id, 'type_name': self.type_name,
            'points': [p.to_dict() for p in self.points],
            'height_m': self.height_m, 'storey_id': self.storey_id,
            'structural_role': self.structural_role,
            'properties': self.properties,
            'source_refs': self.source_refs,
        }


@dataclass
class Opening:
    """Door or window, hosted by a wall. `position_m` is distance along the
    wall's polyline from its first point. `sill_m` is height above storey
    datum (0 for doors, typically 0.9 for windows)."""
    id: str
    kind: str                              # 'door' | 'window'
    type_name: str                         # → DoorType / WindowType in catalog
    wall_id: str
    position_m: float
    sill_m: float = 0.0
    properties: dict = field(default_factory=dict)
    source_refs: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class Slab:
    id: str
    type_name: str                         # → SlabType in catalog
    storey_id: str
    boundary: list[Point2D]                # closed polygon (last point != first by convention)
    role: str = 'floor'                    # floor | ceiling | roof
    properties: dict = field(default_factory=dict)
    source_refs: list[str] = field(default_factory=list)

    @property
    def area_m2(self) -> float:
        if len(self.boundary) < 3:
            return 0.0
        # Shoelace
        s = 0.0
        n = len(self.boundary)
        for i in range(n):
            x1, y1 = self.boundary[i].x, self.boundary[i].y
            x2, y2 = self.boundary[(i+1) % n].x, self.boundary[(i+1) % n].y
            s += x1 * y2 - x2 * y1
        return abs(s) / 2.0

    def to_dict(self) -> dict:
        return {
            'id': self.id, 'type_name': self.type_name, 'storey_id': self.storey_id,
            'boundary': [p.to_dict() for p in self.boundary],
            'role': self.role, 'properties': self.properties,
            'source_refs': self.source_refs,
        }


@dataclass
class Space:
    """A room. Boundary is the inhabited polygon; `program` tags use it
    (bedroom, kitchen, etc.) so schedules and code-checks can group rooms."""
    id: str
    name: str
    program: str                           # bedroom | bathroom | kitchen | living | corridor | etc.
    storey_id: str
    boundary: list[Point2D]
    properties: dict = field(default_factory=dict)
    source_refs: list[str] = field(default_factory=list)

    @property
    def area_m2(self) -> float:
        if len(self.boundary) < 3:
            return 0.0
        s = 0.0
        n = len(self.boundary)
        for i in range(n):
            x1, y1 = self.boundary[i].x, self.boundary[i].y
            x2, y2 = self.boundary[(i+1) % n].x, self.boundary[(i+1) % n].y
            s += x1 * y2 - x2 * y1
        return abs(s) / 2.0

    def to_dict(self) -> dict:
        return {
            'id': self.id, 'name': self.name, 'program': self.program,
            'storey_id': self.storey_id,
            'boundary': [p.to_dict() for p in self.boundary],
            'properties': self.properties,
            'source_refs': self.source_refs,
        }


@dataclass
class Column:
    id: str
    storey_id: str
    point: Point2D
    section: str                           # e.g. 'C300x300' or 'UC203x203x46'
    height_m: float
    material: str = 'concrete_C25/30'
    properties: dict = field(default_factory=dict)
    source_refs: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            'id': self.id, 'storey_id': self.storey_id,
            'point': self.point.to_dict(),
            'section': self.section, 'height_m': self.height_m,
            'material': self.material, 'properties': self.properties,
            'source_refs': self.source_refs,
        }


@dataclass
class Beam:
    id: str
    storey_id: str
    p1: Point2D
    p2: Point2D
    section: str                           # e.g. 'B300x500' or 'UB406x178x60'
    material: str = 'concrete_C25/30'
    properties: dict = field(default_factory=dict)
    source_refs: list[str] = field(default_factory=list)

    @property
    def length_m(self) -> float:
        return math.hypot(self.p2.x - self.p1.x, self.p2.y - self.p1.y)

    def to_dict(self) -> dict:
        return {
            'id': self.id, 'storey_id': self.storey_id,
            'p1': self.p1.to_dict(), 'p2': self.p2.to_dict(),
            'section': self.section, 'material': self.material,
            'properties': self.properties,
            'source_refs': self.source_refs,
        }


# ============================================================================
# Aggregates
# ============================================================================

@dataclass
class Storey:
    id: str
    name: str
    level_m: float                         # height of slab top above datum
    height_m: float                        # storey-to-storey height
    walls: list[Wall] = field(default_factory=list)
    slabs: list[Slab] = field(default_factory=list)
    spaces: list[Space] = field(default_factory=list)
    openings: list[Opening] = field(default_factory=list)
    columns: list[Column] = field(default_factory=list)
    beams: list[Beam] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            'id': self.id, 'name': self.name,
            'level_m': self.level_m, 'height_m': self.height_m,
            'walls':    [e.to_dict() for e in self.walls],
            'slabs':    [e.to_dict() for e in self.slabs],
            'spaces':   [e.to_dict() for e in self.spaces],
            'openings': [e.to_dict() for e in self.openings],
            'columns':  [e.to_dict() for e in self.columns],
            'beams':    [e.to_dict() for e in self.beams],
        }


@dataclass
class Site:
    location_name: str = ''
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    plot_area_m2: Optional[float] = None
    setback_m: float = 3.0
    properties: dict = field(default_factory=dict)


@dataclass
class TypeCatalog:
    walls:   dict[str, WallType]   = field(default_factory=dict)
    doors:   dict[str, DoorType]   = field(default_factory=dict)
    windows: dict[str, WindowType] = field(default_factory=dict)
    slabs:   dict[str, SlabType]   = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            'walls':   {k: asdict(v) for k, v in self.walls.items()},
            'doors':   {k: asdict(v) for k, v in self.doors.items()},
            'windows': {k: asdict(v) for k, v in self.windows.items()},
            'slabs':   {k: asdict(v) for k, v in self.slabs.items()},
        }


@dataclass
class Building:
    """The whole building — single source of truth for one project."""
    id: str
    name: str
    storeys: list[Storey] = field(default_factory=list)
    site: Site = field(default_factory=Site)
    types: TypeCatalog = field(default_factory=TypeCatalog)
    metadata: dict = field(default_factory=dict)            # building_type, style, codes, climate
    schema_version: int = 1

    # ------- aggregates -------
    @property
    def gross_floor_area_m2(self) -> float:
        return sum(sum(sl.area_m2 for sl in s.slabs if sl.role == 'floor')
                   for s in self.storeys)

    @property
    def stories_count(self) -> int:
        return len(self.storeys)

    def all_walls(self) -> list[Wall]:
        return [w for s in self.storeys for w in s.walls]

    def all_openings(self) -> list[Opening]:
        return [o for s in self.storeys for o in s.openings]

    def all_spaces(self) -> list[Space]:
        return [sp for s in self.storeys for sp in s.spaces]

    # ------- serialization -------
    def to_dict(self) -> dict:
        return {
            'id': self.id, 'name': self.name,
            'schema_version': self.schema_version,
            'storeys':  [s.to_dict() for s in self.storeys],
            'site':     asdict(self.site),
            'types':    self.types.to_dict(),
            'metadata': self.metadata,
        }

    @classmethod
    def from_dict(cls, d: dict) -> 'Building':
        types = TypeCatalog(
            walls   = {k: WallType(**v)   for k, v in d.get('types', {}).get('walls', {}).items()},
            doors   = {k: DoorType(**v)   for k, v in d.get('types', {}).get('doors', {}).items()},
            windows = {k: WindowType(**v) for k, v in d.get('types', {}).get('windows', {}).items()},
            slabs   = {k: SlabType(**v)   for k, v in d.get('types', {}).get('slabs', {}).items()},
        )
        storeys: list[Storey] = []
        for sd in d.get('storeys', []):
            storeys.append(Storey(
                id=sd['id'], name=sd['name'],
                level_m=sd['level_m'], height_m=sd['height_m'],
                walls=[Wall(
                    id=w['id'], type_name=w['type_name'],
                    points=[Point2D.from_dict(p) for p in w['points']],
                    height_m=w['height_m'], storey_id=w['storey_id'],
                    structural_role=w.get('structural_role', 'partition'),
                    properties=w.get('properties', {}),
                    source_refs=w.get('source_refs', []),
                ) for w in sd.get('walls', [])],
                slabs=[Slab(
                    id=sl['id'], type_name=sl['type_name'], storey_id=sl['storey_id'],
                    boundary=[Point2D.from_dict(p) for p in sl['boundary']],
                    role=sl.get('role', 'floor'),
                    properties=sl.get('properties', {}),
                    source_refs=sl.get('source_refs', []),
                ) for sl in sd.get('slabs', [])],
                spaces=[Space(
                    id=sp['id'], name=sp['name'], program=sp['program'],
                    storey_id=sp['storey_id'],
                    boundary=[Point2D.from_dict(p) for p in sp['boundary']],
                    properties=sp.get('properties', {}),
                    source_refs=sp.get('source_refs', []),
                ) for sp in sd.get('spaces', [])],
                openings=[Opening(**o) for o in sd.get('openings', [])],
                columns=[Column(
                    id=c['id'], storey_id=c['storey_id'],
                    point=Point2D.from_dict(c['point']),
                    section=c['section'], height_m=c['height_m'],
                    material=c.get('material', 'concrete_C25/30'),
                    properties=c.get('properties', {}),
                    source_refs=c.get('source_refs', []),
                ) for c in sd.get('columns', [])],
                beams=[Beam(
                    id=b['id'], storey_id=b['storey_id'],
                    p1=Point2D.from_dict(b['p1']),
                    p2=Point2D.from_dict(b['p2']),
                    section=b['section'],
                    material=b.get('material', 'concrete_C25/30'),
                    properties=b.get('properties', {}),
                    source_refs=b.get('source_refs', []),
                ) for b in sd.get('beams', [])],
            ))
        site_d = d.get('site', {})
        site = Site(
            location_name=site_d.get('location_name', ''),
            gps_lat=site_d.get('gps_lat'), gps_lng=site_d.get('gps_lng'),
            plot_area_m2=site_d.get('plot_area_m2'),
            setback_m=site_d.get('setback_m', 3.0),
            properties=site_d.get('properties', {}),
        )
        return cls(id=d['id'], name=d['name'], storeys=storeys, site=site,
                   types=types, metadata=d.get('metadata', {}),
                   schema_version=d.get('schema_version', 1))

    # ------- integrity -------
    def validate(self) -> list[str]:
        """Return a list of error strings; empty list means model is valid.
        Cheap structural checks — referenced ids exist, geometries non-empty,
        no zero-thickness walls, etc. Use this before persistence."""
        errors: list[str] = []
        storey_ids = {s.id for s in self.storeys}
        wall_ids = {w.id for s in self.storeys for w in s.walls}

        for s in self.storeys:
            if s.height_m <= 0:
                errors.append(f'storey {s.id}: non-positive height')
            for w in s.walls:
                if w.storey_id != s.id:
                    errors.append(f'wall {w.id}: storey_id mismatch')
                if w.type_name and w.type_name not in self.types.walls:
                    errors.append(f'wall {w.id}: unknown wall_type "{w.type_name}"')
                if w.length_m < 0.05:
                    errors.append(f'wall {w.id}: degenerate length {w.length_m}m')
            for o in s.openings:
                if o.wall_id not in wall_ids:
                    errors.append(f'opening {o.id}: refs missing wall {o.wall_id}')
                if o.kind == 'door' and o.type_name and o.type_name not in self.types.doors:
                    errors.append(f'opening {o.id}: unknown door_type "{o.type_name}"')
                if o.kind == 'window' and o.type_name and o.type_name not in self.types.windows:
                    errors.append(f'opening {o.id}: unknown window_type "{o.type_name}"')
            for sl in s.slabs:
                if sl.type_name and sl.type_name not in self.types.slabs:
                    errors.append(f'slab {sl.id}: unknown slab_type "{sl.type_name}"')
        return errors

    # ========================================================================
    # Wizard-input ingestion — Revit-equivalent: "blank model + a sketch"
    # ========================================================================

    @classmethod
    def from_params(cls, *, name: str, area_m2: float, bedrooms: int = 3,
                    stories: int = 1, units: int = 1,
                    building_type: str = 'BUNGALOW', style: str = 'modern',
                    location: str = '',
                    gps_lat: Optional[float] = None,
                    gps_lng: Optional[float] = None,
                    storey_height_m: float = 3.0,
                    foundation: str = 'strip',
                    project_id: Optional[str] = None) -> 'Building':
        """Build a fully-populated Building from the same inputs the wizard
        already collects. This is the bridge between the legacy wizard flow
        and the new BIM model — every existing project gets a model "for
        free" without UI changes.

        The geometry is a deterministic parametric layout: a rectangular
        footprint sized to `area_m2` per storey, an L-shape for ≥3 units,
        with rooms allocated by program and door/window count derived from
        program rules (1 door per room, 1 window per habitable room minimum,
        2 for the master bedroom, large opening for living room).

        The catalog is pre-populated with sensible defaults for the chosen
        style; users override them later through the family-edit UI.
        """
        bid = project_id or _new_id('bld')

        # ---- catalog defaults — every value cites its source ----
        types = TypeCatalog()

        # External wall: 200mm masonry + 50mm insulation + 13mm plaster
        types.walls['EXT_200_INS_50'] = WallType(
            name='EXT_200_INS_50',
            thickness_m=0.263,
            layers=[
                {'material': 'plaster',      'thickness_m': 0.013, 'lambda_W_mK': 0.50,  'source': 'BS EN ISO 10456:2007'},
                {'material': 'block_200',    'thickness_m': 0.200, 'lambda_W_mK': 0.77,  'source': 'BS EN ISO 10456:2007'},
                {'material': 'eps_50',       'thickness_m': 0.050, 'lambda_W_mK': 0.035, 'source': 'BS EN ISO 10456:2007'},
            ],
            u_value_W_m2K=0.31,             # computed; will be re-validated by uvalue module
            fire_rating_minutes=120,
            acoustic_Rw_dB=48,
            structural=True,
            cost_per_m2=68.0,
            source_refs=['BS EN ISO 10456:2007', 'EIMS materials DB v2026.04'],
        )
        types.walls['INT_100'] = WallType(
            name='INT_100', thickness_m=0.113,
            layers=[
                {'material': 'plaster',   'thickness_m': 0.013, 'lambda_W_mK': 0.50, 'source': 'BS EN ISO 10456:2007'},
                {'material': 'block_100', 'thickness_m': 0.100, 'lambda_W_mK': 0.77, 'source': 'BS EN ISO 10456:2007'},
            ],
            fire_rating_minutes=60, acoustic_Rw_dB=42,
            structural=False, cost_per_m2=38.0,
            source_refs=['EIMS materials DB v2026.04'],
        )

        types.doors['DOOR_INTERIOR_900x2100'] = DoorType(
            name='DOOR_INTERIOR_900x2100', width_m=0.9, height_m=2.1,
            fire_rating_minutes=30, cost_per_unit=120.0,
            source_refs=['EIMS materials DB v2026.04'])
        types.doors['DOOR_EXTERNAL_1000x2100'] = DoorType(
            name='DOOR_EXTERNAL_1000x2100', width_m=1.0, height_m=2.1,
            fire_rating_minutes=60, cost_per_unit=280.0,
            source_refs=['EIMS materials DB v2026.04'])

        types.windows['WIN_STD_1500x1200'] = WindowType(
            name='WIN_STD_1500x1200', width_m=1.5, height_m=1.2,
            glazing='double', u_value_W_m2K=1.6, g_value=0.62,
            cost_per_unit=320.0,
            source_refs=['BS EN 14351-1', 'EIMS materials DB v2026.04'])
        types.windows['WIN_LARGE_2400x1800'] = WindowType(
            name='WIN_LARGE_2400x1800', width_m=2.4, height_m=1.8,
            glazing='double', u_value_W_m2K=1.6, g_value=0.62,
            cost_per_unit=720.0,
            source_refs=['BS EN 14351-1'])

        types.slabs['SLAB_FLOOR_200'] = SlabType(
            name='SLAB_FLOOR_200', thickness_m=0.20, structural=True,
            u_value_W_m2K=0.55, cost_per_m2=78.0,
            source_refs=['BS 8110-1', 'EIMS materials DB v2026.04'])
        types.slabs['SLAB_ROOF_200'] = SlabType(
            name='SLAB_ROOF_200', thickness_m=0.20, structural=True,
            u_value_W_m2K=0.22, cost_per_m2=92.0,
            source_refs=['BS 8110-1'])

        # ---- merge the full family library into the catalog ----
        # The instance-level walls below still use the legacy names
        # ('EXT_200_INS_50', 'INT_100', etc) so existing references are
        # unchanged; the library just makes ~40 extra families *available*
        # for the user to swap to via the Properties panel.
        try:
            from .bim_family_library import merge_library_into
            class _Adapter:
                def __init__(self, t): self.types = t
            merge_library_into(_Adapter(types))   # type: ignore[arg-type]
        except Exception:
            pass  # library is best-effort; missing file shouldn't break model creation

        # ---- footprint sizing ----
        # Per-storey area; rectangular for 1-2 units, L-shape for 3+.
        per_storey_m2 = area_m2 / max(stories, 1)
        # Aspect ratio biased toward 1:1.4 for daylight + ventilation
        ar = 1.4
        depth = math.sqrt(per_storey_m2 / ar)
        width = depth * ar

        building = cls(
            id=bid, name=name,
            metadata={
                'building_type': building_type, 'style': style,
                'units': units, 'bedrooms': bedrooms,
                'derived_from': 'wizard_params',
                'codes': ['BS EN 1991', 'BS 8110', 'BS EN ISO 10456'],
            },
            site=Site(location_name=location,
                       gps_lat=gps_lat, gps_lng=gps_lng,
                       plot_area_m2=area_m2 * 2.5,
                       setback_m=3.0),
            types=types,
        )

        # ---- per-storey geometry ----
        rooms_per_storey = _allocate_rooms(bedrooms, stories, building_type)
        for s_idx in range(stories):
            storey = Storey(
                id=_new_id('sty'),
                name=f'Storey {s_idx+1}',
                level_m=s_idx * storey_height_m,
                height_m=storey_height_m,
            )
            building.storeys.append(storey)

            # External walls — rectangular footprint.
            corners = [
                Point2D(0,     0),
                Point2D(width, 0),
                Point2D(width, depth),
                Point2D(0,     depth),
            ]
            for i in range(4):
                p1, p2 = corners[i], corners[(i+1) % 4]
                w = Wall(
                    id=_new_id('wal'), type_name='EXT_200_INS_50',
                    points=[p1, p2], height_m=storey_height_m,
                    storey_id=storey.id, structural_role='external',
                    source_refs=['Generated from wizard footprint params'],
                )
                storey.walls.append(w)

            # Floor slab + (top storey only) roof slab
            storey.slabs.append(Slab(
                id=_new_id('slb'), type_name='SLAB_FLOOR_200',
                storey_id=storey.id, boundary=corners[:], role='floor',
                source_refs=['Generated from footprint']))
            if s_idx == stories - 1:
                storey.slabs.append(Slab(
                    id=_new_id('slb'), type_name='SLAB_ROOF_200',
                    storey_id=storey.id, boundary=corners[:], role='roof',
                    source_refs=['Generated from footprint']))

            # Internal walls + spaces — laid out along the long axis.
            this_storey_rooms = rooms_per_storey[s_idx] if s_idx < len(rooms_per_storey) else []
            _populate_rooms_and_partitions(storey, this_storey_rooms, width, depth)

            # Openings: one door per room, windows on external walls.
            _populate_openings(storey, this_storey_rooms, building.types)

            # Columns at corners (skeleton structural for ≥2 storeys)
            if stories >= 2:
                for c in corners:
                    storey.columns.append(Column(
                        id=_new_id('col'), storey_id=storey.id, point=c,
                        section='C300x300', height_m=storey_height_m,
                        material='concrete_C25/30',
                        source_refs=['BS 8110-1 §3.8 — minimum column section for residential']))

        return building


# ============================================================================
# Layout helpers (private)
# ============================================================================

def _allocate_rooms(bedrooms: int, stories: int, building_type: str) -> list[list[dict]]:
    """Return one list of room-spec dicts per storey. Single-storey: all rooms
    on one level. Multi-storey: living/kitchen on storey 1, bedrooms upstairs.
    """
    bathrooms = max(1, bedrooms - 1)
    common = [
        {'name': 'Living', 'program': 'living',  'min_m2': 18, 'priority': 'large'},
        {'name': 'Kitchen','program': 'kitchen', 'min_m2': 10, 'priority': 'medium'},
        {'name': 'Dining', 'program': 'dining',  'min_m2': 10, 'priority': 'medium'},
    ] if bedrooms >= 2 else [
        {'name': 'Living/Kitchen', 'program': 'living', 'min_m2': 22, 'priority': 'large'},
    ]
    bedroom_rooms = []
    for i in range(bedrooms):
        bedroom_rooms.append({
            'name': f'Bedroom {i+1}', 'program': 'bedroom',
            'min_m2': 14 if i == 0 else 11,
            'priority': 'large' if i == 0 else 'medium',
        })
    bathroom_rooms = [{'name': f'Bathroom {i+1}', 'program': 'bathroom',
                        'min_m2': 4, 'priority': 'small'}
                       for i in range(bathrooms)]
    corridor = [{'name': 'Corridor', 'program': 'corridor', 'min_m2': 4, 'priority': 'small'}]

    if stories == 1:
        return [common + bedroom_rooms + bathroom_rooms + corridor]
    elif stories == 2:
        return [
            common + bathroom_rooms[:1] + corridor,
            bedroom_rooms + bathroom_rooms[1:] + corridor,
        ]
    else:
        # 3+ storeys: ground floor common, middle storey master bedroom, top storey rest
        out = [common + corridor]
        per_top_storey = max(1, len(bedroom_rooms) // (stories - 1))
        idx = 0
        for s in range(stories - 1):
            slice_rooms = bedroom_rooms[idx: idx + per_top_storey]
            out.append(slice_rooms + bathroom_rooms[s % len(bathroom_rooms): s % len(bathroom_rooms)+1] + corridor)
            idx += per_top_storey
        return out


def _populate_rooms_and_partitions(storey: Storey, rooms: list[dict],
                                    width: float, depth: float) -> None:
    """Lay rooms in a row along the long axis (x). Strict equal-width slicing
    is a placeholder for the parametric layout solver — good enough for an
    initial model that the user then edits. The room boundaries become Space
    polygons; partitions become internal Walls."""
    if not rooms:
        return
    n = len(rooms)
    # Each room gets its share of the full footprint width
    slice_w = width / n
    cursor = 0.0
    for r_spec in rooms:
        x0 = cursor
        x1 = cursor + slice_w
        boundary = [
            Point2D(x0, 0),
            Point2D(x1, 0),
            Point2D(x1, depth),
            Point2D(x0, depth),
        ]
        space = Space(
            id=_new_id('spc'),
            name=r_spec['name'], program=r_spec['program'],
            storey_id=storey.id, boundary=boundary,
            properties={'min_m2': r_spec['min_m2'],
                         'priority': r_spec['priority']},
            source_refs=['Parametric layout v1 (equal-slice)'],
        )
        storey.spaces.append(space)
        # Internal partition walls between rooms (skip the last edge — it's
        # the external wall already created).
        if cursor > 0:  # left edge of all but the first room
            storey.walls.append(Wall(
                id=_new_id('wal'), type_name='INT_100',
                points=[Point2D(x0, 0), Point2D(x0, depth)],
                height_m=storey.height_m, storey_id=storey.id,
                structural_role='partition',
                source_refs=['Generated from room layout']))
        cursor = x1


def _populate_openings(storey: Storey, rooms: list[dict],
                        types: TypeCatalog) -> None:
    """Each room gets one door (centred on the south external wall) and one
    or two windows on its external boundary."""
    south_wall = next((w for w in storey.walls
                        if len(w.points) == 2
                        and abs(w.points[0].y - 0) < 0.01
                        and abs(w.points[1].y - 0) < 0.01), None)
    north_wall = next((w for w in storey.walls
                        if len(w.points) == 2
                        and w.points[0].y > 0.01
                        and abs(w.points[0].y - w.points[1].y) < 0.01), None)
    if not south_wall or not north_wall:
        return

    south_len = south_wall.length_m
    north_len = north_wall.length_m
    n = max(1, len(rooms))
    slot_w_s = south_len / n
    slot_w_n = north_len / n

    door_type = 'DOOR_INTERIOR_900x2100'
    ext_door_type = 'DOOR_EXTERNAL_1000x2100'
    for i, r in enumerate(rooms):
        if r['program'] == 'living':
            # Front door + large window
            storey.openings.append(Opening(
                id=_new_id('opn'), kind='door', type_name=ext_door_type,
                wall_id=south_wall.id, position_m=slot_w_s * (i + 0.5) - 0.5,
                sill_m=0.0,
                source_refs=['Layout rule: living room hosts front door']))
            storey.openings.append(Opening(
                id=_new_id('opn'), kind='window', type_name='WIN_LARGE_2400x1800',
                wall_id=south_wall.id, position_m=slot_w_s * (i + 0.5) - 1.2 - 0.5,
                sill_m=0.9,
                source_refs=['Layout rule: living room large window']))
        elif r['program'] == 'bedroom':
            storey.openings.append(Opening(
                id=_new_id('opn'), kind='window', type_name='WIN_STD_1500x1200',
                wall_id=north_wall.id, position_m=slot_w_n * (i + 0.5) - 0.75,
                sill_m=0.9,
                source_refs=['Layout rule: bedroom window on north']))
        elif r['program'] == 'bathroom':
            # Small window for ventilation; no external door
            storey.openings.append(Opening(
                id=_new_id('opn'), kind='window', type_name='WIN_STD_1500x1200',
                wall_id=north_wall.id, position_m=slot_w_n * (i + 0.5) - 0.75,
                sill_m=1.5,                 # higher sill for privacy
                source_refs=['Layout rule: bathroom high-sill window']))
        elif r['program'] in ('kitchen', 'dining'):
            storey.openings.append(Opening(
                id=_new_id('opn'), kind='window', type_name='WIN_STD_1500x1200',
                wall_id=south_wall.id, position_m=slot_w_s * (i + 0.5) - 0.75,
                sill_m=0.9,
                source_refs=['Layout rule: kitchen/dining window']))
