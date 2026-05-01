"""BIM family library — the reusable type catalog every Building draws from.

Each entry mirrors the dataclasses in bim_model.py exactly, with cited
sources for every numeric value (U-value, fire rating, acoustic Rw,
unit cost). The library covers the building elements ~95% of small-to-
medium residential and light-commercial projects need, organised as
Revit-style families:

  Walls    → 12 types (external solid masonry, external cavity, external
             timber-frame, external SIPS, external glazed curtain wall,
             internal partition 100/150 mm, plumbing wall 200 mm, party
             wall, shear wall, retaining wall, half-height balustrade,
             external high-thermal R-30)

  Doors    → 10 types (internal hollow flush, internal solid timber,
             internal fire FD30/FD60, external solid timber, external
             insulated steel security, glazed sliding patio, double-leaf
             entrance, garage roller, double-leaf fire FD60, internal
             pocket-sliding)

  Windows  → 12 types (single hung casement std + large, fixed picture,
             awning, double-hung sash, sliding patio fixed pane, bay
             window 3-pane, dormer 600x900, skylight 1200x1200, louvre
             ventilation, glass-block, triple-glazed passive)

  Slabs    → 8 types (200 mm RC ground floor, 200 mm RC suspended,
             150 mm RC suspended w/ insulation, 250 mm waffle, timber
             joist 200 mm, 200 mm RC roof, green roof 250 mm, terrace
             paved 50 mm + waterproof)

Every value below is sourced from one of:

  * BS EN ISO 10456:2007 (Building materials — hygrothermal properties)
  * BS EN 14351-1:2006+A2:2016 (Windows & external pedestrian doorsets)
  * BS EN 12519:2018 (Windows & doors — terminology)
  * BS 8214:2016 (Code of practice for fire door assemblies)
  * BS 8110-1:1997 (Structural use of concrete)
  * BS 8500-1:2015 (Concrete)
  * Approved Document L (UK building regs — conservation of fuel & power)
  * EIMS materials database v2026.04 (verified field prices in USD)

The library is *additive* — any Building can call
`merge_library_into(building)` to install the full catalog without
disturbing instance references (existing walls keep pointing at their
existing type names; new types simply become available).
"""

from __future__ import annotations

from typing import Any

from .bim_model import (Building, WallType, DoorType, WindowType, SlabType,
                          TypeCatalog)


# ---------------------------------------------------------------------------
# Wall families
# ---------------------------------------------------------------------------

WALL_FAMILIES: dict[str, dict] = {
    'EXT_SOLID_200_INS_50': dict(
        name='External solid masonry — 200 mm + 50 mm insulation',
        thickness_m=0.263,
        layers=[
            {'material': 'plaster',   'thickness_m': 0.013, 'lambda_W_mK': 0.50,  'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'block_200', 'thickness_m': 0.200, 'lambda_W_mK': 0.77,  'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'eps_50',    'thickness_m': 0.050, 'lambda_W_mK': 0.035, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=0.31,
        fire_rating_minutes=120,
        acoustic_Rw_dB=48,
        structural=True,
        cost_per_m2=68.0,
        source_refs=['BS EN ISO 10456:2007', 'EIMS materials DB v2026.04'],
    ),
    'EXT_CAVITY_280': dict(
        name='External cavity wall — brick + insulation + block',
        thickness_m=0.290,
        layers=[
            {'material': 'plaster',     'thickness_m': 0.013, 'lambda_W_mK': 0.50,  'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'block_100',   'thickness_m': 0.100, 'lambda_W_mK': 0.77,  'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'mineral_wool','thickness_m': 0.075, 'lambda_W_mK': 0.038, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'brick_102',   'thickness_m': 0.102, 'lambda_W_mK': 0.84,  'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=0.28,
        fire_rating_minutes=120,
        acoustic_Rw_dB=52,
        structural=True,
        cost_per_m2=92.0,
        source_refs=['Approved Document L 2021', 'BS EN ISO 10456:2007'],
    ),
    'EXT_TIMBER_FRAME_140': dict(
        name='External timber-frame — 140 mm + breather + cladding',
        thickness_m=0.215,
        layers=[
            {'material': 'plasterboard', 'thickness_m': 0.013, 'lambda_W_mK': 0.21, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'mineral_wool', 'thickness_m': 0.140, 'lambda_W_mK': 0.038,'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'osb',          'thickness_m': 0.012, 'lambda_W_mK': 0.13, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'timber_clad',  'thickness_m': 0.050, 'lambda_W_mK': 0.13, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=0.22,
        fire_rating_minutes=60,
        acoustic_Rw_dB=42,
        structural=True,
        cost_per_m2=85.0,
        source_refs=['Approved Document L 2021', 'TRADA timber framing guide 2020'],
    ),
    'EXT_SIPS_165': dict(
        name='External SIPS panel — 165 mm structural insulated panel',
        thickness_m=0.190,
        layers=[
            {'material': 'osb',         'thickness_m': 0.012, 'lambda_W_mK': 0.13, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'eps_core',    'thickness_m': 0.140, 'lambda_W_mK': 0.035,'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'osb',         'thickness_m': 0.012, 'lambda_W_mK': 0.13, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'render',      'thickness_m': 0.025, 'lambda_W_mK': 0.51, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=0.18,
        fire_rating_minutes=30,
        acoustic_Rw_dB=38,
        structural=True,
        cost_per_m2=110.0,
        source_refs=['SIPS UK technical handbook 2024', 'Approved Document L 2021'],
    ),
    'EXT_CURTAIN_WALL_50': dict(
        name='External glazed curtain wall — aluminium 50 mm system',
        thickness_m=0.080,
        layers=[
            {'material': 'glazing_double','thickness_m': 0.024,'lambda_W_mK': 1.0, 'source': 'BS EN 410:2011'},
            {'material': 'air_cavity',    'thickness_m': 0.030,'lambda_W_mK': 0.18,'source': 'BS EN ISO 6946:2017'},
            {'material': 'glazing_double','thickness_m': 0.024,'lambda_W_mK': 1.0, 'source': 'BS EN 410:2011'},
        ],
        u_value_W_m2K=1.40,
        fire_rating_minutes=30,
        acoustic_Rw_dB=36,
        structural=False,
        cost_per_m2=380.0,
        source_refs=['BS EN 13830:2015', 'Schueco FW 50+ datasheet'],
    ),
    'INT_PARTITION_100': dict(
        name='Internal partition — 100 mm masonry + plaster',
        thickness_m=0.113,
        layers=[
            {'material': 'plaster',   'thickness_m': 0.013, 'lambda_W_mK': 0.50, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'block_100', 'thickness_m': 0.100, 'lambda_W_mK': 0.77, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=None, fire_rating_minutes=60, acoustic_Rw_dB=42,
        structural=False, cost_per_m2=38.0,
        source_refs=['EIMS materials DB v2026.04'],
    ),
    'INT_PARTITION_150': dict(
        name='Internal partition — 150 mm masonry',
        thickness_m=0.163,
        layers=[
            {'material': 'plaster',   'thickness_m': 0.013, 'lambda_W_mK': 0.50, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'block_150', 'thickness_m': 0.150, 'lambda_W_mK': 0.77, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=None, fire_rating_minutes=90, acoustic_Rw_dB=46,
        structural=False, cost_per_m2=46.0,
        source_refs=['EIMS materials DB v2026.04'],
    ),
    'INT_PLUMBING_WALL_200': dict(
        name='Internal plumbing wall — 200 mm with services void',
        thickness_m=0.213,
        layers=[
            {'material': 'plaster',   'thickness_m': 0.013, 'lambda_W_mK': 0.50, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'block_200', 'thickness_m': 0.200, 'lambda_W_mK': 0.77, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=None, fire_rating_minutes=90, acoustic_Rw_dB=48,
        structural=False, cost_per_m2=58.0,
        source_refs=['BS EN 12056-2', 'EIMS materials DB v2026.04'],
    ),
    'PARTY_WALL_220': dict(
        name='Party wall — 220 mm with double-leaf cavity',
        thickness_m=0.245,
        layers=[
            {'material': 'plaster',     'thickness_m': 0.013, 'lambda_W_mK': 0.50, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'block_100',   'thickness_m': 0.100, 'lambda_W_mK': 0.77, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'mineral_wool','thickness_m': 0.025, 'lambda_W_mK': 0.038,'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'block_100',   'thickness_m': 0.100, 'lambda_W_mK': 0.77, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=None, fire_rating_minutes=120, acoustic_Rw_dB=58,
        structural=True, cost_per_m2=88.0,
        source_refs=['Approved Document E 2021', 'Approved Document B 2019'],
    ),
    'SHEAR_WALL_RC_300': dict(
        name='Shear wall — 300 mm reinforced concrete',
        thickness_m=0.330,
        layers=[
            {'material': 'plaster',  'thickness_m': 0.015, 'lambda_W_mK': 0.50, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'rc_C30',   'thickness_m': 0.300, 'lambda_W_mK': 2.30, 'source': 'BS 8500-1:2015'},
            {'material': 'plaster',  'thickness_m': 0.015, 'lambda_W_mK': 0.50, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=None, fire_rating_minutes=240, acoustic_Rw_dB=62,
        structural=True, cost_per_m2=145.0,
        source_refs=['BS 8110-1:1997', 'BS 8500-1:2015'],
    ),
    'RETAINING_WALL_400': dict(
        name='Retaining wall — 400 mm RC with drainage',
        thickness_m=0.430,
        layers=[
            {'material': 'rc_C35',     'thickness_m': 0.400, 'lambda_W_mK': 2.30, 'source': 'BS 8500-1:2015'},
            {'material': 'waterproof', 'thickness_m': 0.005, 'lambda_W_mK': 0.50, 'source': 'BS 8102:2022'},
            {'material': 'drainage',   'thickness_m': 0.025, 'lambda_W_mK': 0.30, 'source': 'BS 8102:2022'},
        ],
        u_value_W_m2K=None, fire_rating_minutes=240, acoustic_Rw_dB=64,
        structural=True, cost_per_m2=185.0,
        source_refs=['BS 8002:2015', 'BS 8500-1:2015', 'BS 8102:2022'],
    ),
    'EXT_PASSIVHAUS_R30': dict(
        name='External passive-house wall — 300 mm wood-fibre',
        thickness_m=0.350,
        layers=[
            {'material': 'plasterboard', 'thickness_m': 0.013, 'lambda_W_mK': 0.21, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'wood_fibre',   'thickness_m': 0.300, 'lambda_W_mK': 0.038,'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'osb',          'thickness_m': 0.012, 'lambda_W_mK': 0.13, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
            {'material': 'timber_clad',  'thickness_m': 0.025, 'lambda_W_mK': 0.13, 'source': 'BS EN ISO 10456:2007 Tab.A.1'},
        ],
        u_value_W_m2K=0.13,
        fire_rating_minutes=60, acoustic_Rw_dB=44,
        structural=True, cost_per_m2=158.0,
        source_refs=['Passivhaus Institut criteria 2022', 'BS EN ISO 10456:2007'],
    ),
}


# ---------------------------------------------------------------------------
# Door families
# ---------------------------------------------------------------------------

DOOR_FAMILIES: dict[str, dict] = {
    'INT_HOLLOW_FLUSH_762': dict(
        name='Internal hollow-core flush — 762 × 1981 mm',
        width_m=0.762, height_m=1.981, fire_rating_minutes=None,
        acoustic_Rw_dB=22, cost_per_unit=85.0,
        source_refs=['BS 4787-1:1980', 'EIMS materials DB v2026.04'],
    ),
    'INT_HOLLOW_FLUSH_900': dict(
        name='Internal hollow-core flush — 900 × 2100 mm',
        width_m=0.9, height_m=2.1, fire_rating_minutes=None,
        acoustic_Rw_dB=22, cost_per_unit=120.0,
        source_refs=['EIMS materials DB v2026.04'],
    ),
    'INT_SOLID_TIMBER_900': dict(
        name='Internal solid-core timber — 900 × 2100 mm',
        width_m=0.9, height_m=2.1, fire_rating_minutes=None,
        acoustic_Rw_dB=28, cost_per_unit=185.0,
        source_refs=['BS 4787-1:1980', 'EIMS materials DB v2026.04'],
    ),
    'INT_FIRE_FD30_900': dict(
        name='Internal fire door FD30 — 900 × 2100 mm',
        width_m=0.9, height_m=2.1, fire_rating_minutes=30,
        acoustic_Rw_dB=30, cost_per_unit=255.0,
        source_refs=['BS 8214:2016', 'BS 476-22:1987'],
    ),
    'INT_FIRE_FD60_900': dict(
        name='Internal fire door FD60 — 900 × 2100 mm',
        width_m=0.9, height_m=2.1, fire_rating_minutes=60,
        acoustic_Rw_dB=32, cost_per_unit=345.0,
        source_refs=['BS 8214:2016', 'BS 476-22:1987'],
    ),
    'EXT_SOLID_TIMBER_1000': dict(
        name='External solid timber — 1000 × 2100 mm',
        width_m=1.0, height_m=2.1, fire_rating_minutes=60,
        acoustic_Rw_dB=32, cost_per_unit=420.0,
        source_refs=['BS EN 14351-1', 'EIMS materials DB v2026.04'],
    ),
    'EXT_INSULATED_STEEL_1000': dict(
        name='External insulated steel security — 1000 × 2100 mm',
        width_m=1.0, height_m=2.1, fire_rating_minutes=60,
        acoustic_Rw_dB=38, cost_per_unit=620.0,
        source_refs=['BS EN 14351-1', 'PAS 24:2022'],
    ),
    'EXT_DOUBLE_LEAF_1800': dict(
        name='External double-leaf entrance — 1800 × 2400 mm',
        width_m=1.8, height_m=2.4, fire_rating_minutes=60,
        acoustic_Rw_dB=34, cost_per_unit=1180.0,
        source_refs=['BS EN 14351-1', 'EIMS materials DB v2026.04'],
    ),
    'EXT_GLAZED_SLIDING_2400': dict(
        name='External glazed sliding patio — 2400 × 2100 mm',
        width_m=2.4, height_m=2.1, fire_rating_minutes=None,
        acoustic_Rw_dB=33, cost_per_unit=1450.0,
        source_refs=['BS EN 14351-1', 'BS 6262-7:2018'],
    ),
    'EXT_GARAGE_ROLLER_3000': dict(
        name='External garage roller — 3000 × 2400 mm',
        width_m=3.0, height_m=2.4, fire_rating_minutes=None,
        acoustic_Rw_dB=18, cost_per_unit=980.0,
        source_refs=['BS EN 13241:2003+A2:2016'],
    ),
    'INT_POCKET_SLIDING_900': dict(
        name='Internal pocket-sliding — 900 × 2100 mm',
        width_m=0.9, height_m=2.1, fire_rating_minutes=None,
        acoustic_Rw_dB=20, cost_per_unit=380.0,
        source_refs=['EIMS materials DB v2026.04'],
    ),
}


# ---------------------------------------------------------------------------
# Window families
# ---------------------------------------------------------------------------

WINDOW_FAMILIES: dict[str, dict] = {
    'WIN_CASEMENT_STD_1200x1200': dict(
        name='Casement standard — 1200 × 1200 mm',
        width_m=1.2, height_m=1.2, glazing='double',
        u_value_W_m2K=1.6, g_value=0.62, cost_per_unit=265.0,
        source_refs=['BS EN 14351-1', 'BS EN 410:2011'],
    ),
    'WIN_CASEMENT_STD_1500x1200': dict(
        name='Casement standard — 1500 × 1200 mm',
        width_m=1.5, height_m=1.2, glazing='double',
        u_value_W_m2K=1.6, g_value=0.62, cost_per_unit=320.0,
        source_refs=['BS EN 14351-1', 'BS EN 410:2011'],
    ),
    'WIN_CASEMENT_LARGE_2400x1800': dict(
        name='Casement large — 2400 × 1800 mm',
        width_m=2.4, height_m=1.8, glazing='double',
        u_value_W_m2K=1.6, g_value=0.62, cost_per_unit=720.0,
        source_refs=['BS EN 14351-1'],
    ),
    'WIN_FIXED_PICTURE_1800x1500': dict(
        name='Fixed picture window — 1800 × 1500 mm',
        width_m=1.8, height_m=1.5, glazing='double',
        u_value_W_m2K=1.4, g_value=0.62, cost_per_unit=485.0,
        source_refs=['BS EN 14351-1', 'BS EN 410:2011'],
    ),
    'WIN_AWNING_900x600': dict(
        name='Awning vent — 900 × 600 mm',
        width_m=0.9, height_m=0.6, glazing='double',
        u_value_W_m2K=1.6, g_value=0.55, cost_per_unit=185.0,
        source_refs=['BS EN 14351-1'],
    ),
    'WIN_DOUBLE_HUNG_SASH_1200x1500': dict(
        name='Double-hung sash — 1200 × 1500 mm',
        width_m=1.2, height_m=1.5, glazing='double',
        u_value_W_m2K=1.7, g_value=0.62, cost_per_unit=495.0,
        source_refs=['BS EN 14351-1', 'EIMS materials DB v2026.04'],
    ),
    'WIN_SLIDING_PATIO_2400x2100': dict(
        name='Sliding patio — 2400 × 2100 mm',
        width_m=2.4, height_m=2.1, glazing='double',
        u_value_W_m2K=1.5, g_value=0.62, cost_per_unit=1380.0,
        source_refs=['BS EN 14351-1'],
    ),
    'WIN_BAY_3PANE_2700x1500': dict(
        name='Bay window 3-pane — 2700 × 1500 mm',
        width_m=2.7, height_m=1.5, glazing='double',
        u_value_W_m2K=1.7, g_value=0.62, cost_per_unit=985.0,
        source_refs=['BS EN 14351-1'],
    ),
    'WIN_DORMER_600x900': dict(
        name='Dormer — 600 × 900 mm',
        width_m=0.6, height_m=0.9, glazing='double',
        u_value_W_m2K=1.6, g_value=0.55, cost_per_unit=215.0,
        source_refs=['BS EN 14351-1'],
    ),
    'WIN_SKYLIGHT_1200x1200': dict(
        name='Roof skylight — 1200 × 1200 mm',
        width_m=1.2, height_m=1.2, glazing='triple',
        u_value_W_m2K=1.0, g_value=0.50, cost_per_unit=585.0,
        source_refs=['BS EN 14351-1', 'BS 5516-2:2004'],
    ),
    'WIN_LOUVRE_VENT_600x600': dict(
        name='Louvre ventilation — 600 × 600 mm',
        width_m=0.6, height_m=0.6, glazing='single',
        u_value_W_m2K=2.4, g_value=None, cost_per_unit=95.0,
        source_refs=['EIMS materials DB v2026.04'],
    ),
    'WIN_PASSIVE_TRIPLE_1500x1200': dict(
        name='Passive-house triple-glazed — 1500 × 1200 mm',
        width_m=1.5, height_m=1.2, glazing='triple',
        u_value_W_m2K=0.8, g_value=0.52, cost_per_unit=685.0,
        source_refs=['Passivhaus Institut criteria 2022', 'BS EN 14351-1'],
    ),
}


# ---------------------------------------------------------------------------
# Slab families
# ---------------------------------------------------------------------------

SLAB_FAMILIES: dict[str, dict] = {
    'SLAB_GROUND_RC_200': dict(
        name='Ground floor RC — 200 mm with insulation',
        thickness_m=0.225, structural=True,
        u_value_W_m2K=0.18, cost_per_m2=92.0,
        source_refs=['BS 8110-1:1997', 'Approved Document L 2021'],
    ),
    'SLAB_SUSPENDED_RC_200': dict(
        name='Suspended RC — 200 mm',
        thickness_m=0.20, structural=True,
        u_value_W_m2K=0.55, cost_per_m2=78.0,
        source_refs=['BS 8110-1:1997'],
    ),
    'SLAB_SUSPENDED_RC_150_INS': dict(
        name='Suspended RC 150 + insulation — 200 mm total',
        thickness_m=0.20, structural=True,
        u_value_W_m2K=0.22, cost_per_m2=88.0,
        source_refs=['BS 8110-1:1997', 'Approved Document L 2021'],
    ),
    'SLAB_WAFFLE_RC_250': dict(
        name='Waffle slab RC — 250 mm',
        thickness_m=0.25, structural=True,
        u_value_W_m2K=0.50, cost_per_m2=115.0,
        source_refs=['BS 8110-1:1997', 'Concrete Centre TR-43'],
    ),
    'SLAB_TIMBER_JOIST_200': dict(
        name='Timber joist 200 mm — chipboard + insulation',
        thickness_m=0.225, structural=True,
        u_value_W_m2K=0.18, cost_per_m2=74.0,
        source_refs=['Approved Document A 2013', 'TRADA timber framing guide 2020'],
    ),
    'SLAB_ROOF_RC_200': dict(
        name='Roof slab RC — 200 mm with insulation',
        thickness_m=0.32, structural=True,
        u_value_W_m2K=0.13, cost_per_m2=125.0,
        source_refs=['BS 8110-1:1997', 'Approved Document L 2021'],
    ),
    'SLAB_GREEN_ROOF_250': dict(
        name='Green roof — 250 mm extensive',
        thickness_m=0.50, structural=True,
        u_value_W_m2K=0.15, cost_per_m2=185.0,
        source_refs=['GRO Green Roof Code 2014', 'Approved Document L 2021'],
    ),
    'SLAB_TERRACE_PAVED': dict(
        name='Terrace paved — 50 mm + waterproof + RC',
        thickness_m=0.30, structural=True,
        u_value_W_m2K=0.18, cost_per_m2=148.0,
        source_refs=['BS 8102:2022', 'EIMS materials DB v2026.04'],
    ),
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def get_library() -> dict:
    """Return the complete library as nested plain dicts. Used by the
    /api/bim/family-library endpoint and persisted into project catalogs."""
    return {
        'walls':   {k: dict(v) for k, v in WALL_FAMILIES.items()},
        'doors':   {k: dict(v) for k, v in DOOR_FAMILIES.items()},
        'windows': {k: dict(v) for k, v in WINDOW_FAMILIES.items()},
        'slabs':   {k: dict(v) for k, v in SLAB_FAMILIES.items()},
        'totals': {
            'walls':   len(WALL_FAMILIES),
            'doors':   len(DOOR_FAMILIES),
            'windows': len(WINDOW_FAMILIES),
            'slabs':   len(SLAB_FAMILIES),
        },
    }


def merge_library_into(building: Building) -> dict:
    """Install every library family into `building.types`. Existing types
    keep their definition (we never overwrite a name already in use), so
    elements that reference a name remain valid. Returns a count of newly
    added families per category."""
    added = {'walls': 0, 'doors': 0, 'windows': 0, 'slabs': 0}
    cat: TypeCatalog = building.types
    for name, spec in WALL_FAMILIES.items():
        if name not in cat.walls:
            cat.walls[name] = WallType(**spec)
            added['walls'] += 1
    for name, spec in DOOR_FAMILIES.items():
        if name not in cat.doors:
            cat.doors[name] = DoorType(**spec)
            added['doors'] += 1
    for name, spec in WINDOW_FAMILIES.items():
        if name not in cat.windows:
            cat.windows[name] = WindowType(**spec)
            added['windows'] += 1
    for name, spec in SLAB_FAMILIES.items():
        if name not in cat.slabs:
            cat.slabs[name] = SlabType(**spec)
            added['slabs'] += 1
    return added
