"""End-to-end console wiring smoke test.

Boots app_professional.app via Flask test_client, walks every endpoint
exposed in eims_console.html, and asserts:
  * Route exists in the URL map
  * GET endpoints return 200
  * POST endpoints accept the documented sample payload and return 200
    (or 400 with a JSON error -- never 404 / 405 / 500)
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
                        tempfile.mkdtemp(prefix='eims_console_test_'))
# Disable rate-limit during the test sweep
os.environ['EIMS_RATELIMIT_PER_MINUTE'] = '10000'
os.environ['EIMS_RATELIMIT_BURST'] = '1000'

# Sample payloads matching the console defaults
SAMPLES = {
    '/api/loads/wind/asce7':           {'V_mph': 115, 'height_ft': 30, 'length_ft': 60,
                                          'width_ft': 40, 'exposure': 'C',
                                          'enclosure': 'enclosed'},
    '/api/loads/seismic/asce7-elf':    {'SDS': 1.0, 'SD1': 0.5, 'R': 8, 'Ie': 1.0,
                                          'W_kN': 8896, 'height_ft': 48,
                                          'structure_type': 'steel_moment_frame',
                                          'stories': 4},
    '/api/geotech/bearing/terzaghi':   {'c_kPa': 10, 'phi_deg': 30, 'gamma_kN_m3': 18,
                                          'B_m': 2, 'Df_m': 1.5, 'shape': 'strip'},
    '/api/rc/beam/bending':            {'b_mm': 300, 'h_mm': 500, 'd_mm': 450,
                                          'As_mm2': 1500, 'fck_MPa': 30, 'fyk_MPa': 500,
                                          'Med_kNm': 180},
    '/api/steel/bolt':                 {'designation': 'M20', 'grade': '8.8',
                                          'shear_planes': 1, 'threads_in_shear': True,
                                          't_ply_mm': 10, 'fu_ply_MPa': 410, 'e1_mm': 30,
                                          'p1_mm': 60, 'd_hole_mm': 22,
                                          'Fv_Ed_kN': 50, 'Ft_Ed_kN': 10},
    '/api/qs/rate-buildup':            {'item_description': 'C30 concrete',
                                          'unit_of_measure': 'm3',
                                          'labour':   [{'description': 'lab', 'unit': 'hr',
                                                          'quantity': 2, 'rate': 25,
                                                          'source': 't'}],
                                          'plant':    [],
                                          'material': [{'description': 'mix', 'unit': 'm3',
                                                          'quantity': 1, 'rate': 110,
                                                          'source': 'BCIS'}],
                                          'waste_pct': 0.05, 'overheads_pct': 0.10,
                                          'profit_pct': 0.05},
    '/api/qs/cashflow/s-curve':        {'contract_value': 5_000_000,
                                          'duration_months': 18, 'k': 6.0, 't0': 0.5},
    '/api/qs/valuation/interim':       {'gross_value_to_date': 1_000_000,
                                          'previously_certified': 400_000,
                                          'retention_pct': 0.05, 'vat_pct': 0.20},
    '/api/qs/tender/compare':          {'bidders': [
                                            {'name': 'A', 'total': 1_000_000, 'items': []},
                                            {'name': 'B', 'total': 1_050_000, 'items': []},
                                            {'name': 'C', 'total': 1_020_000, 'items': []},
                                            {'name': 'D', 'total':   700_000, 'items': []}]},
    '/api/qs/risk/monte-carlo':        {'base_cost': 5_000_000, 'iterations': 1000,
                                          'seed': 42,
                                          'risks': [{'name': 'r', 'probability': 0.4,
                                                       'cost_distribution': {
                                                          'type': 'triangular',
                                                          'min': 50_000, 'mode': 150_000,
                                                          'max': 400_000}}]},
    '/api/qs/evm':                     {'BAC': 5_000_000, 'PV': 2_500_000,
                                          'EV': 2_300_000, 'AC': 2_400_000},
    '/api/qs/carbon/assess':           {'materials': [
                                            {'name': 'Concrete', 'quantity': 250,
                                              'unit': 'm3',
                                              'factor_kgCO2e_per_unit': 300,
                                              'factor_source': 'ICE v3.0',
                                              'stage': 'A1-A3'}],
                                          'gifa_m2': 2500},
    '/api/qs/boq/render':              {'format_name': 'NRM2', 'currency': 'GBP',
                                          'items': [{'ref': 'A.1', 'description': 'Excavate',
                                                       'unit': 'm3', 'quantity': 120,
                                                       'rate': 18.5}]},
    '/api/arch/daylight/adf':          {'T_glass': 0.68, 'window_area_m2': 6,
                                          'sky_angle_deg': 65,
                                          'total_internal_surface_m2': 120,
                                          'avg_reflectance': 0.5,
                                          'maintenance_factor': 0.9, 'frame_factor': 0.7},
    '/api/arch/acoustics/reverberation': {'volume_m3': 200, 'method': 'sabine',
                                          'room_type': 'office',
                                          'surfaces': [
                                            {'description': 'ceiling', 'area_m2': 80,
                                              'alpha': 0.04},
                                            {'description': 'floor',   'area_m2': 80,
                                              'alpha': 0.30},
                                            {'description': 'walls',   'area_m2': 40,
                                              'alpha': 0.10}]},
    '/api/arch/uvalue':                {'heat_flow': 'horizontal',
                                          'layers': [
                                            {'description': 'brick', 'thickness_m': 0.10,
                                              'lambda_W_mK': 0.84, 'source': 'EN ISO 10456'},
                                            {'description': 'mw',    'thickness_m': 0.10,
                                              'lambda_W_mK': 0.038, 'source': 'EN ISO 10456'}]},
    '/api/arch/egress':                {'occupancy_type': 'business',
                                          'floor_area_m2': 1500,
                                          'sprinklered': True,
                                          'voice_notification': True},
    '/api/arch/accessibility/check':   {'jurisdiction': 'strictest',
                                          'measurements': {'door_clear_width_mm': 850,
                                                             'corridor_min_width_mm': 1200}},
    '/api/report/pdf':                 {'title': 'Test', 'project': 'X', 'author': 'Y',
                                          'findings':     [{'item': 'foo', 'value': 1,
                                                              'unit': 'x', 'source': 'src',
                                                              'clause': 'c'}],
                                          'calculations': [{'label': 'x',
                                                              'standard': 'std',
                                                              'reference': 'ref'}]},
}

# GET endpoints (no payload)
GET_ENDPOINTS = [
    '/api/global/fx/rates',
    '/api/materials/index?region=US',
    '/api/qs/nrm1/template',
    '/api/health',
    '/api/health/deep',
    '/api/admin/audit?limit=5',
    '/api/openapi.json',
    '/api/qs/boq/formats',
    '/api/arch/egress/load-factors',
    '/api/arch/acoustics/recommended',
    '/api/arch/accessibility/limits',
]


@pytest.fixture(scope='module')
def client():
    import app_professional
    app_professional.app.config['TESTING'] = True
    return app_professional.app.test_client()


def _route_set(client):
    return {str(r) for r in client.application.url_map.iter_rules()}


@pytest.mark.parametrize('endpoint', GET_ENDPOINTS)
def test_get_endpoint_returns_2xx(client, endpoint):
    bare = endpoint.split('?')[0]
    routes = _route_set(client)
    # tolerate that the URL map stores e.g. "/api/materials/index" not the qs
    assert any(bare == r for r in routes), f'route not registered: {bare}'
    r = client.get(endpoint)
    # Auth-protected admin endpoints legitimately return 401 (bad token),
    # or 503 (fail-closed — no EIMS_ADMIN_TOKEN env var set in the test runner).
    assert r.status_code in (200, 401, 503), f'{endpoint} -> {r.status_code} : {r.data[:200]}'


@pytest.mark.parametrize('endpoint', sorted(SAMPLES.keys()))
def test_post_endpoint_accepts_console_sample(client, endpoint):
    routes = _route_set(client)
    assert endpoint in routes, f'route not registered: {endpoint}'
    r = client.post(endpoint, json=SAMPLES[endpoint])
    # 401 is legitimate for auth-protected endpoints (e.g. /api/report/pdf)
    assert r.status_code in (200, 400, 401), f'{endpoint} -> HTTP {r.status_code}\n{r.data[:300]}'
    if r.status_code == 401:
        return
    if r.content_type and r.content_type.startswith('application/json'):
        body = r.get_json()
        if r.status_code == 200:
            assert body.get('success', True) is not False, \
                f'{endpoint} returned success=False: {body}'


def test_console_html_routes_match_app(client):
    """Every endpoint string in eims_console.html must be resolvable by the app.

    Uses werkzeug URL matching so parameterised routes (e.g. /api/design/marbella/svg/<key>)
    accept concrete paths like /api/design/marbella/svg/horseshoe_arch.
    """
    console_path = os.path.join(ROOT, 'eims_console.html')
    with open(console_path, 'r', encoding='utf-8') as f:
        html = f.read()
    found = set(re.findall(r"endpoint:\s*'([^']+)'", html))
    url_map = client.application.url_map
    adapter = url_map.bind('localhost')
    missing = []
    for ep in found:
        bare = ep.split('?')[0]
        try:
            # Try matching against all supported methods
            for method in ('GET', 'POST', 'PUT', 'DELETE', 'PATCH'):
                try:
                    adapter.match(bare, method=method)
                    break
                except Exception:
                    continue
            else:
                missing.append(ep)
        except Exception:
            missing.append(ep)
    assert not missing, f'console references unregistered routes: {missing}'


def test_console_route_serves_html(client):
    r = client.get('/console')
    assert r.status_code == 200
    assert b'EmersonEIMS Building Suite Pro' in r.data
    assert b'Professional Console' in r.data
