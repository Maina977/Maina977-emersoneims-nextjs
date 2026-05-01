"""
Andalusian / Marbella architectural-details catalog.

Curated library of traditional Spanish + Moorish architectural elements --
all descriptive (dimensions, proportions, typical finishes, historical
references). Returns machine-readable specs plus SVG motifs for use in
drawings/visualisations.

All patterns are drawn from public-domain historical sources (Alhambra,
Medina Azahara, Ronda vernacular); no copyrighted imagery is used.
"""
from __future__ import annotations
from typing import Any
import logging
import math

logger = logging.getLogger('eims')

_DETAILS: dict[str, dict[str, Any]] = {
    'horseshoe_arch': {
        'category': 'Openings',
        'name': 'Horseshoe arch (arco de herradura)',
        'origin': 'Visigothic; adopted + refined in Al-Andalus 8th-10th c.',
        'typical_use': 'Doorways, wall niches, internal arcades in entrance halls',
        'proportions': {
            'rise_to_span_ratio': '0.55 - 0.60',
            'keystone_depth_min_mm': 250,
            'voussoir_count_typical': '9 to 13 (odd number preferred)',
        },
        'finish': 'Lime render + ochre wash, or exposed brick (brick = red-orange ladrillo visto)',
        'references': ['Great Mosque of Cordoba (Mihrab)', 'Medina Azahara',
                        'Ronda vernacular 16th c.'],
        'cad_svg_hint': 'svg:horseshoe_arch',
    },
    'multifoil_arch': {
        'category': 'Openings',
        'name': 'Multifoil / lobed arch (arco polilobulado)',
        'origin': 'Caliphate of Cordoba (10th c.); refined at Alhambra (14th c.)',
        'typical_use': 'Decorative arcades, internal courtyards, loggias',
        'proportions': {
            'lobe_count': '5, 7, or 9 (odd; most commonly 7)',
            'rise_to_span': '0.45 - 0.50',
        },
        'finish': 'Carved plaster (yeseria), limewash, or hand-painted tile surround',
        'cad_svg_hint': 'svg:multifoil_arch',
    },
    'azulejo_zellige_tile': {
        'category': 'Surfaces',
        'name': 'Azulejo / Zellige tile panel',
        'origin': 'Hispano-Moresque tilework; modern Marbella revival common since 1980s',
        'typical_use': 'Wainscot dado (1.2-1.5 m), fountain walls, kitchen splashbacks',
        'proportions': {
            'base_module_mm': 100,
            'border_width_mm': 80,
            'typical_dado_height_m': 1.3,
        },
        'palette': ['Cobalt blue', 'Moroccan green', 'Amber yellow', 'White glaze', 'Burnt umber'],
        'pattern_names': ['Estrella de 8 puntas (8-point star)', 'Lacería geométrica',
                           'Arabesque', 'Mudéjar interlace'],
        'cad_svg_hint': 'svg:eight_point_star',
    },
    'pool_mosaic_emerald': {
        'category': 'Surfaces',
        'name': 'Pool mosaic (emerald/turquoise gradient)',
        'origin': 'Moorish pool traditions; adapted from Roman opus tessellatum',
        'typical_use': 'Pool lining, water features, hammam',
        'proportions': {
            'tessera_mm': 20,
            'sheet_size_mm': 300,
            'slope_to_deep_end_min': '1:30',
        },
        'palette_gradient': ['Pale aqua (#9ED6DE)', 'Turquoise (#3FB7C4)',
                              'Mediterranean (#1E7F99)', 'Emerald (#1C6B4C)'],
        'cad_svg_hint': 'svg:mosaic_gradient',
    },
    'rejeria_wrought_iron': {
        'category': 'Metalwork',
        'name': 'Rejería (wrought-iron grille)',
        'origin': 'Gothic + Mudéjar Spanish ironwork, 14th-17th c.',
        'typical_use': 'Window grilles, balcony railings, pergola infill',
        'proportions': {
            'bar_square_section_mm': 16,
            'vertical_spacing_mm': 120,
            'scroll_diameter_mm': 140,
        },
        'finish': 'Hand-forged; phosphate + oil patina (never zinc-plated)',
        'cad_svg_hint': 'svg:rejeria_scroll',
    },
    'cachucho_window': {
        'category': 'Openings',
        'name': 'Cachucho window (deep-reveal punched window)',
        'origin': 'Andalusian vernacular; thick wall = thermal mass',
        'typical_use': 'External facades, bedroom windows',
        'proportions': {
            'wall_thickness_min_mm': 450,
            'reveal_depth_mm': 250,
            'opening_width_mm_typ': [700, 900, 1100],
            'opening_height_mm_typ': [1400, 1800, 2000],
        },
        'finish': 'Lime-rendered reveal + timber shutter + wrought-iron grille',
        'cad_svg_hint': 'svg:cachucho_section',
    },
    'patio_courtyard': {
        'category': 'Planning',
        'name': 'Patio / interior courtyard',
        'origin': 'Roman atrium + Arab riyad; Andalusian domestic archetype',
        'typical_use': 'Central light + ventilation core of the villa',
        'proportions': {
            'width_to_wall_height_ratio': '1:1 to 1.5:1',
            'central_fountain_diameter_m': '1.2 to 2.4',
            'surrounding_colonnade_column_spacing_m': '2.4 to 3.6',
        },
        'planting': ['Orange + lemon trees', 'Jasmine', 'Bougainvillea', 'Mediterranean herbs'],
        'cad_svg_hint': 'svg:patio_plan',
    },
    'whitewash_limewash': {
        'category': 'Finishes',
        'name': 'Whitewash (encalado) / lime wash',
        'origin': 'Andalusian pueblos blancos; hygroscopic + anti-microbial',
        'typical_use': 'All external walls + most internal walls in villa',
        'spec': {
            'base': 'Slaked lime CL 90 (EN 459-1)',
            'aggregate_addition': '5-10% fine silica sand for key coat',
            'coats': 3,
            'colour': 'Natural white or tinted with natural earth pigment ≤ 10%',
        },
        'maintenance': 'Recoat every 2-4 years on south-facing walls',
        'cad_svg_hint': 'svg:wall_section_lime',
    },
    'terracotta_floor': {
        'category': 'Surfaces',
        'name': 'Terracotta floor tile (baldosa de barro cocido)',
        'origin': 'Vernacular Andalusian; hand-made in provinces of Malaga + Jaen',
        'typical_use': 'Main floor finish throughout villa ground floor',
        'proportions': {
            'tile_mm': [300, 400],
            'thickness_mm': 18,
            'grout_joint_mm': '4-6 natural lime grout',
        },
        'finish': 'Linseed-oil sealed; waxed + buffed twice yearly',
        'cad_svg_hint': 'svg:terracotta_layout',
    },
    'roof_curved_tile': {
        'category': 'Roofing',
        'name': 'Curved clay pan-and-cover tile (teja arabe)',
        'origin': 'Roman imbrex + tegula; preserved through Moorish + Christian periods',
        'typical_use': 'Primary roofing throughout Andalusia',
        'spec': {
            'tile_dimensions_mm': [480, 170, 25],
            'pitch_range_deg': [20, 35],
            'lap_mm': 80,
            'tile_per_sqm': 32,
        },
        'cad_svg_hint': 'svg:roof_tile_detail',
    },
    'timber_shutter': {
        'category': 'Openings',
        'name': 'Louvred timber shutter (contraventana)',
        'origin': 'Andalusian sun-control; moveable louvre adjusts for sun angle',
        'typical_use': 'External to all openings on south + west facades',
        'spec': {
            'timber': 'Spanish cedar or pine, preservative-treated',
            'louvre_width_mm': 60,
            'louvre_angle_deg': 45,
            'frame_section_mm': '45 x 45 mortised + pinned',
        },
        'finish': 'Linseed-oil + dark green or oxide-red enamel',
        'cad_svg_hint': 'svg:shutter_elevation',
    },
}


def _svg_horseshoe_arch(span_mm: int = 1200, pier_height_mm: int = 2000,
                         stroke_mm: int = 25) -> str:
    """Hand-constructed horseshoe-arch SVG. Span = opening width at imposts."""
    cx = span_mm / 2
    cy = pier_height_mm
    r = span_mm / 2 * 1.15  # the horseshoe extends below the spring line
    total_h = pier_height_mm + r + 100
    # Approximate horseshoe: full circle minus lower ~30 deg sector
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {span_mm + 400} {total_h}" '
        f'width="100%" stroke="currentColor" stroke-width="{stroke_mm}" fill="none">'
        f'<rect x="{200 - 150}" y="0" width="150" height="{pier_height_mm}"/>'
        f'<rect x="{200 + span_mm}" y="0" width="150" height="{pier_height_mm}"/>'
        f'<path d="M {200} {cy} '
        f'A {r} {r} 0 1 1 {200 + span_mm} {cy}" />'
        f'<line x1="0" y1="{pier_height_mm}" x2="{span_mm + 400}" y2="{pier_height_mm}" '
        f'stroke-dasharray="20,20" stroke-width="3"/>'
        f'</svg>'
    )


def _svg_eight_point_star(size: int = 400) -> str:
    """8-point Islamic geometric star."""
    cx = cy = size / 2
    r_outer = size * 0.48
    r_inner = r_outer * 0.45
    pts = []
    for i in range(16):
        angle = math.pi / 8 * i - math.pi / 2
        r = r_outer if i % 2 == 0 else r_inner
        pts.append(f'{cx + r * math.cos(angle):.1f},{cy + r * math.sin(angle):.1f}')
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
        f'width="100%" stroke="currentColor" stroke-width="2" fill="none">'
        f'<polygon points="{" ".join(pts)}"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r_inner * 0.9}"/>'
        f'</svg>'
    )


def _svg_rejeria_scroll(w: int = 600, h: int = 900) -> str:
    """Simplified rejería grille motif: vertical bars + scrolled cap."""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="100%" stroke="currentColor" stroke-width="10" fill="none">'
        f'<rect x="40" y="100" width="{w - 80}" height="{h - 200}" />'
        + ''.join(f'<line x1="{40 + i * 60}" y1="100" x2="{40 + i * 60}" y2="{h - 100}"/>'
                   for i in range(1, int((w - 80) / 60)))
        + f'<path d="M 40 100 Q {w / 2} 20 {w - 40} 100" />'
        f'<path d="M 40 {h - 100} Q {w / 2} {h - 20} {w - 40} {h - 100}" />'
        f'</svg>'
    )


_SVG_RENDERERS = {
    'horseshoe_arch':     _svg_horseshoe_arch,
    'azulejo_zellige_tile': _svg_eight_point_star,
    'rejeria_wrought_iron': _svg_rejeria_scroll,
}


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request, Response

    @app.route('/api/design/marbella/catalog', methods=['GET'])
    def _catalog():
        return jsonify({
            'success': True,
            'style_name': 'Marbella / Andalusian / Al-Andalus',
            'count': len(_DETAILS),
            'categories': sorted({v['category'] for v in _DETAILS.values()}),
            'items': [{'id': k,
                       'name': v['name'],
                       'category': v['category'],
                       'has_svg': k in _SVG_RENDERERS}
                      for k, v in _DETAILS.items()],
        })

    @app.route('/api/design/marbella/detail/<key>', methods=['GET'])
    def _detail(key):
        if key not in _DETAILS:
            return jsonify({'success': False,
                             'error': f'unknown detail: {key}',
                             'available': list(_DETAILS)}), 404
        return jsonify({'success': True, 'id': key, 'detail': _DETAILS[key]})

    @app.route('/api/design/marbella/svg/<key>', methods=['GET'])
    def _svg(key):
        if key not in _SVG_RENDERERS:
            return jsonify({'success': False,
                             'error': f'no SVG motif for {key}',
                             'available': list(_SVG_RENDERERS)}), 404
        svg = _SVG_RENDERERS[key]()
        return Response(svg, mimetype='image/svg+xml')

    logger.info('Marbella/Andalusian details module registered (%d curated details, %d SVG motifs)',
                 len(_DETAILS), len(_SVG_RENDERERS))
