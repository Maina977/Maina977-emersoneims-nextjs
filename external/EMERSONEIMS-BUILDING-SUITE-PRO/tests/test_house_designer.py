"""Tests for in-house villa designer (Sprint-5)."""
from __future__ import annotations

import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from eims_modules import house_designer as hd


# ---------- pure design logic ----------

def test_brief_marbella_defaults():
    b = hd.design_brief(plot_w_m=25, plot_d_m=35, bedrooms=4,
                          budget_eur=2_500_000, style='marbella_modern',
                          lifestyle=['wellness', 'entertain'])
    assert b['success']
    assert b['storeys'] == 2
    assert b['style'] == 'marbella_modern'
    assert 'infinity_pool' in b['features']
    assert 'flat_roof' in b['features']
    assert 'gym' in b['features']            # wellness lifestyle
    assert b['tier'] in ('premium', 'luxury', 'ultra_luxury')
    # rationale must be human-readable and non-empty
    assert isinstance(b['rationale'], list) and len(b['rationale']) >= 3


def test_brief_rejects_bad_inputs():
    bad = hd.design_brief(plot_w_m=0, plot_d_m=10)
    assert bad['success'] is False
    bad2 = hd.design_brief(plot_w_m=20, plot_d_m=20, style='bauhaus')
    assert bad2['success'] is False


def test_design_villa_layout_and_estimate():
    brief = hd.design_brief(plot_w_m=30, plot_d_m=40, bedrooms=5,
                              budget_eur=4_000_000, style='marbella_modern',
                              lifestyle=['wellness', 'cars'])
    d = hd.design_villa(brief)
    assert d.storeys == 2
    assert d.gia_m2 > 200            # generous 5-bed villa
    # ground + first floor populated
    assert any(r.level == 0 for r in d.rooms)
    assert any(r.level == 1 for r in d.rooms)
    # master suite present
    assert any(r.name == 'Master bedroom' for r in d.rooms)
    # pool present (Marbella idiom)
    assert d.pool is not None and d.pool['type'] == 'infinity'
    est = d.estimate()
    assert est['cost_eur'] > 0 and est['embodied_carbon_kgco2e'] > 0
    assert 'BCIS' in est['cost_source']
    assert 'ICE' in est['carbon_source']


def test_dxf_floorplan_bytes():
    brief = hd.design_brief(plot_w_m=25, plot_d_m=35, bedrooms=4)
    d = hd.design_villa(brief)
    blob = hd.floorplan_dxf(d, level=0)
    assert isinstance(blob, (bytes, bytearray))
    head = blob[:200].decode('utf-8', errors='ignore')
    assert 'SECTION' in head           # DXF header marker
    blob1 = hd.floorplan_dxf(d, level=1)
    assert b'SECTION' in blob1


def test_obj_3d_model_bytes():
    brief = hd.design_brief(plot_w_m=25, plot_d_m=35, bedrooms=4)
    d = hd.design_villa(brief)
    blob = hd.model_obj(d)
    text = blob.decode('utf-8')
    assert text.startswith('# EmersonEIMS villa massing')
    # OBJ must have vertices and faces
    assert '\nv ' in text and '\nf ' in text
    # storeys, roof, terrace and pool groups present
    for grp in ('storey_0', 'roof', 'terrace_L0', 'pool'):
        assert f'g {grp}' in text


def test_svg_elevation_marbella_has_glazing():
    brief = hd.design_brief(plot_w_m=25, plot_d_m=35, bedrooms=4,
                              style='marbella_modern')
    d = hd.design_villa(brief)
    svg_front = hd.elevation_svg(d, side='front').decode('utf-8')
    assert svg_front.startswith('<svg') and svg_front.endswith('</svg>')
    # glazing band fill colour appears
    assert '#bfd9e6' in svg_front
    svg_side = hd.elevation_svg(d, side='side').decode('utf-8')
    assert '<svg' in svg_side


def test_spec_sheet_has_provenance():
    brief = hd.design_brief(plot_w_m=25, plot_d_m=35, bedrooms=4)
    d = hd.design_villa(brief)
    spec = hd.spec_sheet(d)
    assert spec['success']
    assert 'data_provenance' in spec and len(spec['data_provenance']) >= 4
    assert spec['estimate']['cost_eur'] > 0


# ---------- Flask wiring ----------

@pytest.fixture(scope='module')
def client():
    import app_professional
    app_professional.app.config['TESTING'] = True
    return app_professional.app.test_client()


def test_villa_routes_registered(client):
    rules = {str(r) for r in client.application.url_map.iter_rules()}
    for r in ('/api/design/villa/styles', '/api/design/villa/brief',
                '/api/design/villa/generate', '/api/design/villa/floorplan',
                '/api/design/villa/model', '/api/design/villa/elevation'):
        assert r in rules, f'missing {r}'


def test_villa_brief_endpoint(client):
    r = client.post('/api/design/villa/brief', json={
        'plot_w_m': 25, 'plot_d_m': 35, 'bedrooms': 4,
        'budget_eur': 3_000_000, 'style': 'marbella_modern',
        'lifestyle': ['wellness', 'entertain'],
    })
    assert r.status_code == 200
    body = r.get_json()
    assert body['success'] and body['storeys'] >= 1


def test_villa_generate_endpoint(client):
    r = client.post('/api/design/villa/generate', json={
        'plot_w_m': 30, 'plot_d_m': 40, 'bedrooms': 5,
        'style': 'marbella_modern', 'lifestyle': ['wellness']
    })
    assert r.status_code == 200
    body = r.get_json()
    assert body['success']
    assert body['estimate']['cost_eur'] > 0
    assert body['pool'] is not None


def test_villa_dxf_endpoint(client):
    r = client.post('/api/design/villa/floorplan',
                      json={'plot_w_m': 25, 'plot_d_m': 35, 'level': 0})
    assert r.status_code == 200
    assert r.mimetype == 'application/dxf'
    assert b'SECTION' in r.data


def test_villa_obj_endpoint(client):
    r = client.post('/api/design/villa/model',
                      json={'plot_w_m': 25, 'plot_d_m': 35})
    assert r.status_code == 200
    assert r.data.startswith(b'# EmersonEIMS villa massing')


def test_villa_svg_endpoint(client):
    r = client.post('/api/design/villa/elevation',
                      json={'plot_w_m': 25, 'plot_d_m': 35, 'side': 'front'})
    assert r.status_code == 200
    assert r.data.startswith(b'<svg')


# ---------- Sprint 5b: glTF / GLB / site plan / finishes / viewer ----------

def test_finishes_palette_marbella():
    pal = hd.finishes('marbella_modern')
    assert pal['success']
    assert 'White micro-cement render' in pal['palette']['external_walls']['material']
    # Each finish item must carry a source citation
    for k in ('external_walls', 'roof', 'floors', 'glazing',
                'kitchen_worktop', 'bathroom', 'pool', 'landscape'):
        assert 'source' in pal['palette'][k], f'{k} missing source citation'
    assert pal['palette']['glazing']['u_value_w_m2k'] < 1.5


def test_finishes_rejects_unknown_style():
    bad = hd.finishes('bauhaus')
    assert bad['success'] is False


def test_glb_binary_signature_and_chunks():
    brief = hd.design_brief(plot_w_m=25, plot_d_m=35, bedrooms=4)
    d = hd.design_villa(brief)
    blob = hd.model_glb(d)
    # glTF binary header: magic 'glTF', version 2
    assert blob[:4] == b'glTF'
    import struct
    magic, version, length = struct.unpack('<III', blob[:12])
    assert version == 2
    assert length == len(blob)
    # JSON chunk header at offset 12
    json_len, json_type = struct.unpack('<II', blob[12:20])
    assert json_type == 0x4E4F534A  # 'JSON'
    # JSON should be valid and reference a single buffer
    import json as _json
    gltf = _json.loads(blob[20:20 + json_len].rstrip(b' '))
    assert gltf['asset']['version'] == '2.0'
    assert gltf['scene'] == 0
    assert len(gltf['meshes']) >= 4   # at least storey, roof, terrace, site
    assert len(gltf['buffers']) == 1
    # BIN chunk follows
    bin_off = 20 + json_len
    bin_len, bin_type = struct.unpack('<II', blob[bin_off:bin_off + 8])
    assert bin_type == 0x004E4942  # 'BIN\0'
    assert bin_len == gltf['buffers'][0]['byteLength']


def test_siteplan_dxf_has_landscape_layers():
    brief = hd.design_brief(plot_w_m=30, plot_d_m=40, bedrooms=4,
                              style='marbella_modern')
    d = hd.design_villa(brief)
    blob = hd.siteplan_dxf(d)
    text = blob.decode('utf-8', errors='ignore')
    assert 'SECTION' in text
    # Landscape layers must all be present
    for layer in ('PLOT', 'HOUSE', 'DRIVE', 'PAVER', 'LAWN',
                    'TREE', 'POOL', 'ENTRY'):
        assert layer in text, f'layer {layer} missing from site plan'


def test_viewer_html_is_three_js_page():
    html = hd.viewer_html()
    assert html.startswith(b'<!doctype html>')
    assert b'three.module.js' in html
    assert b'GLTFLoader' in html
    assert b'/api/design/villa/model_glb' in html
    assert b'/api/design/villa/generate' in html


# ---------- Endpoint smoke tests for the new routes ----------

def test_glb_endpoint(client):
    r = client.post('/api/design/villa/model_glb',
                      json={'plot_w_m': 25, 'plot_d_m': 35, 'bedrooms': 4})
    assert r.status_code == 200
    assert r.mimetype == 'model/gltf-binary'
    assert r.data[:4] == b'glTF'


def test_siteplan_endpoint(client):
    r = client.post('/api/design/villa/siteplan',
                      json={'plot_w_m': 30, 'plot_d_m': 40, 'bedrooms': 4})
    assert r.status_code == 200
    assert r.mimetype == 'application/dxf'
    assert b'SECTION' in r.data


def test_finishes_endpoint(client):
    r = client.get('/api/design/villa/finishes?style=marbella_modern')
    assert r.status_code == 200
    body = r.get_json()
    assert body['success']
    assert 'palette' in body


def test_viewer_endpoint(client):
    r = client.get('/api/design/villa/viewer')
    assert r.status_code == 200
    assert r.mimetype.startswith('text/html')
    assert b'EmersonEIMS' in r.data
    assert b'GLTFLoader' in r.data
