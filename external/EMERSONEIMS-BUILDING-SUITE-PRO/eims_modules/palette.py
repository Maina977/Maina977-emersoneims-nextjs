"""
Palette-from-photo + mood-board material matcher (interior-design tool).

Upload a base64-encoded inspiration image (PNG/JPEG); returns dominant
5-7 color palette and suggested material matches from the EIMS
materials database.

Uses Pillow (BSD) and colorthief (MIT). No external APIs.
"""
from __future__ import annotations
from typing import Any
import base64
import io
import logging

logger = logging.getLogger('eims')

try:
    from PIL import Image  # noqa: F401 (used inside _extract)
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

try:
    from colorthief import ColorThief
    HAS_CT = True
except ImportError:
    HAS_CT = False

# Curated interior-finish colour anchors — each mapped to material suggestions.
# Colours are RGB 0-255 tuples.  Matching is simple Euclidean distance in RGB.
_ANCHORS: list[dict[str, Any]] = [
    {'name': 'Warm white',            'rgb': (244, 239, 228),
     'materials': ['Limewash paint', 'Travertine', 'Bleached oak', 'Linen upholstery']},
    {'name': 'Cool white',            'rgb': (238, 242, 246),
     'materials': ['Satin acrylic paint', 'Carrara marble', 'White oak',
                    'Brushed stainless']},
    {'name': 'Sand / taupe',          'rgb': (210, 195, 170),
     'materials': ['Natural linen', 'Tumbled travertine', 'Polished concrete',
                    'Rattan']},
    {'name': 'Terracotta',            'rgb': (197, 107, 72),
     'materials': ['Terracotta tile', 'Clay plaster', 'Tadelakt',
                    'Saltillo tile', 'Patinated copper']},
    {'name': 'Ochre / mustard',       'rgb': (202, 149, 58),
     'materials': ['Ochre venetian plaster', 'Mustard velvet',
                    'Aged brass', 'Hand-glazed tile']},
    {'name': 'Olive / sage',          'rgb': (138, 144, 102),
     'materials': ['Sage-green linen', 'Olive velvet',
                    'Patinated bronze', 'Matte-green zellige']},
    {'name': 'Deep forest green',     'rgb': (52, 80, 58),
     'materials': ['Forest-green lacquer', 'Verde alpi marble',
                    'Deep-stained walnut', 'Emerald velvet']},
    {'name': 'Mediterranean blue',    'rgb': (36, 94, 130),
     'materials': ['Majolica tile', 'Navy linen', 'Patinated blue zellige',
                    'Hand-painted porcelain']},
    {'name': 'Aqua / pool blue',      'rgb': (120, 182, 198),
     'materials': ['Pool mosaic tile', 'Turquoise zellige',
                    'Oxidised copper roof']},
    {'name': 'Soft pink / plaster',   'rgb': (226, 194, 179),
     'materials': ['Pink lime wash', 'Rose marble', 'Blush velvet',
                    'Aged pink zellige']},
    {'name': 'Charcoal',              'rgb': (65, 62, 60),
     'materials': ['Basalt slab', 'Smoked oak', 'Charcoal linen',
                    'Patinated blackened steel']},
    {'name': 'Black',                 'rgb': (25, 25, 25),
     'materials': ['Nero Marquina marble', 'Ebonised wood',
                    'Matte black metal', 'Obsidian ceramic']},
    {'name': 'Warm brown / walnut',   'rgb': (96, 63, 40),
     'materials': ['Walnut veneer', 'Leather upholstery',
                    'Aged bronze', 'Dark oak flooring']},
    {'name': 'Golden / brass',        'rgb': (182, 146, 82),
     'materials': ['Polished brass', 'Honey onyx', 'Golden travertine']},
]


def _dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def _nearest_anchor(rgb: tuple[int, int, int]) -> dict[str, Any]:
    anchors_sorted = sorted(_ANCHORS, key=lambda a: _dist(rgb, a['rgb']))
    return anchors_sorted[0]


def _rgb_to_hex(r: int, g: int, b: int) -> str:
    return f'#{r:02x}{g:02x}{b:02x}'


def extract(image_bytes: bytes, n_colors: int = 6) -> dict[str, Any]:
    if not HAS_PIL or not HAS_CT:
        return {'success': False, 'error': 'Pillow + colorthief must be installed'}
    buf = io.BytesIO(image_bytes)
    try:
        ct = ColorThief(buf)
        dominant = ct.get_color(quality=3)
        palette  = ct.get_palette(color_count=max(2, n_colors), quality=3)
    except Exception as e:
        return {'success': False, 'error': f'could not parse image: {e}'}

    colors = []
    seen = set()
    for rgb in [dominant] + palette:
        key = rgb
        if key in seen:
            continue
        seen.add(key)
        anchor = _nearest_anchor(rgb)
        colors.append({
            'rgb':             list(rgb),
            'hex':             _rgb_to_hex(*rgb),
            'closest_anchor':  anchor['name'],
            'suggested_materials': anchor['materials'],
        })
        if len(colors) >= n_colors:
            break

    return {
        'success': True,
        'method': 'ColorThief (Modified Median Cut Quantization)',
        'dominant_color': {'rgb': list(dominant), 'hex': _rgb_to_hex(*dominant)},
        'palette_size':   len(colors),
        'palette':        colors,
        'disclaimer':     ('Material suggestions are drawn from interior-finish anchor '
                            'set. Always sample actual materials before specifying.'),
    }


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/interior/palette/extract', methods=['POST'])
    def _pal():
        data = request.get_json(silent=True) or {}
        b64 = data.get('image_base64') or ''
        n   = int(data.get('n_colors', 6) or 6)
        if not b64:
            return jsonify({'success': False,
                             'error': 'image_base64 required (data URL or raw base64)'}), 400
        # Strip data URL prefix if present
        if ',' in b64:
            b64 = b64.split(',', 1)[1]
        try:
            img_bytes = base64.b64decode(b64)
        except Exception as e:
            return jsonify({'success': False, 'error': f'bad base64: {e}'}), 400
        if len(img_bytes) > 8 * 1024 * 1024:
            return jsonify({'success': False, 'error': 'image > 8 MB'}), 413
        return jsonify(extract(img_bytes, n_colors=n))

    @app.route('/api/interior/palette/anchors', methods=['GET'])
    def _anchors():
        return jsonify({'success': True, 'count': len(_ANCHORS),
                         'anchors': [{'name': a['name'], 'hex': _rgb_to_hex(*a['rgb']),
                                      'materials': a['materials']} for a in _ANCHORS]})

    logger.info('Interior palette module registered (pillow=%s, colorthief=%s)',
                 HAS_PIL, HAS_CT)
