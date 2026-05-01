"""Wizard integration smoke test.

Boots the Flask app via test_client, extracts the PRO_CATALOG from
interactive_wizard.html, and hits every endpoint with the tile's own
default field values — matching what a user sees when they click
▶ Run on a new panel without editing any input.

The PRO_CATALOG is the source of truth for which calculators the main
wizard exposes; this test guarantees none of them regress to 404, 500,
or broken-default-500 states.
"""
from __future__ import annotations

import json
import os
import re
import sys
import tempfile

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
os.environ.setdefault('EIMS_UPLOAD_FOLDER',
                        tempfile.mkdtemp(prefix='eims_wizard_test_'))
os.environ['EIMS_RATELIMIT_PER_MINUTE'] = '10000'
os.environ['EIMS_RATELIMIT_BURST'] = '1000'

WIZARD = os.path.join(ROOT, 'interactive_wizard.html')

# Tiles whose 400 is semantically correct (genuinely require user upload /
# data a default can't provide).  Verified by hand — these MUST 400 when
# invoked with empty defaults.
EXPECTED_400 = {
    # image-from-upload — base64 image must be supplied by the user
    '/api/interior/palette/extract',
}


def _extract_catalog():
    """Parse the PRO_CATALOG array literal out of interactive_wizard.html."""
    with open(WIZARD, 'r', encoding='utf-8') as f:
        html = f.read()
    start = html.index('const PRO_CATALOG = [')
    arr_start = html.index('[', start)
    depth, end = 0, -1
    for i in range(arr_start, len(html)):
        c = html[i]
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                end = i
                break
    assert end > 0, 'Could not locate PRO_CATALOG end'
    src = html[arr_start:end + 1]

    # Split into tile blocks {...}
    tiles, depth, tstart = [], 0, None
    for i, c in enumerate(src):
        if c == '{':
            if depth == 0:
                tstart = i
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                tiles.append(src[tstart:i + 1])
    return tiles


def _build_payload(tile_src: str):
    """Build {body, qs} from a tile literal using each field's def value."""
    ep_m = re.search(r"ep:'([^']+)'", tile_src)
    mth_m = re.search(r"mth:'([^']+)'", tile_src)
    id_m = re.search(r"id:'([^']+)'", tile_src)
    endpoint = ep_m.group(1)
    method = mth_m.group(1) if mth_m else 'POST'
    tile_id = id_m.group(1) if id_m else '?'

    body, qs = {}, {}
    # Locate the fields array  f:[ ... ]
    fm = re.search(r"f\s*:\s*\[", tile_src)
    if not fm:
        return tile_id, endpoint, method, body, qs
    arr_s = fm.end() - 1
    depth, arr_e = 0, -1
    for i in range(arr_s, len(tile_src)):
        c = tile_src[i]
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                arr_e = i
                break
    if arr_e < 0:
        return tile_id, endpoint, method, body, qs
    farr = tile_src[arr_s + 1:arr_e]

    # Walk each field object
    depth, fstart = 0, None
    for i, c in enumerate(farr):
        if c == '{':
            if depth == 0:
                fstart = i
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                fsrc = farr[fstart:i + 1]
                k_m = re.search(r"k\s*:\s*'([^']+)'", fsrc)
                t_m = re.search(r"type\s*:\s*'([^']+)'", fsrc)
                def_m = re.search(r"def\s*:\s*(?:'((?:[^'\\]|\\.)*)'|([^,}\n]+))", fsrc)
                qs_m = re.search(r"qs\s*:\s*true", fsrc)
                if not k_m or not t_m or not def_m:
                    continue
                k = k_m.group(1)
                ftype = t_m.group(1)
                raw = def_m.group(1) if def_m.group(1) is not None else def_m.group(2)
                raw = raw.strip()
                # Unescape JS string escapes
                raw = raw.replace("\\n", "\n").replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")
                v = _coerce(raw, ftype)
                (qs if qs_m else body)[k] = v
    return tile_id, endpoint, method, body, qs


def _coerce(raw: str, ftype: str):
    raw = raw.strip()
    if ftype == 'number':
        try:
            return float(raw) if '.' in raw or 'e' in raw.lower() else int(raw)
        except Exception:
            return None
    if ftype == 'select':
        if raw in ('true', 'false'):
            return raw == 'true'
        try:
            return float(raw) if '.' in raw else int(raw)
        except Exception:
            return raw
    if ftype == 'textarea':
        if raw in ('', 'null'):
            return None
        try:
            return json.loads(raw)
        except Exception:
            return raw
    return raw


TILES = _extract_catalog()


@pytest.fixture(scope='module')
def client():
    import app_professional
    app_professional.app.config['TESTING'] = True
    return app_professional.app.test_client()


def test_catalog_extracted_correctly():
    assert len(TILES) >= 55, f'expected >=55 tiles in PRO_CATALOG, got {len(TILES)}'


@pytest.mark.parametrize('tile_src', TILES, ids=lambda s: re.search(r"id:'([^']+)'", s).group(1))
def test_wizard_tile_works_with_defaults(client, tile_src):
    tile_id, endpoint, method, body, qs = _build_payload(tile_src)
    # Pollinations tiles generate images client-side via pollinations.ai —
    # the ep is a sentinel (POLLINATIONS_EXTERIOR etc.), not a Flask route.
    if method == 'POLLINATIONS' or endpoint.startswith('POLLINATIONS_'):
        return
    url = endpoint
    if qs:
        from urllib.parse import urlencode
        url += ('&' if '?' in url else '?') + urlencode(qs)
    if method == 'GET':
        r = client.get(url)
    else:
        r = client.post(url, json=body)
    if endpoint in EXPECTED_400:
        assert r.status_code in (400, 401), \
            f'{tile_id} expected 400/401 but got {r.status_code}'
        return
    assert r.status_code in (200, 401), (
        f'{tile_id} ({method} {endpoint}) -> HTTP {r.status_code}\n'
        f'  payload: {json.dumps(body)[:200]}\n'
        f'  response: {r.data[:300]!r}'
    )
