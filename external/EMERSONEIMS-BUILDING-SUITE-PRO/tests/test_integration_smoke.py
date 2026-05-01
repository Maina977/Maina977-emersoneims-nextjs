"""
End-to-end integration smoke test — exercises the live user journey.
Hits a running server (default http://localhost:5000) as a real client would.

Run:  python -m pytest tests/test_integration_smoke.py -v
Or:   python tests/test_integration_smoke.py
"""
import os
import sys
import time
import json
import uuid
from typing import Any

BASE_URL = os.environ.get('EIMS_TEST_URL', 'http://localhost:5000')

try:
    import requests
except ImportError:
    print('pip install requests')
    sys.exit(1)

s = requests.Session()


def _req(method: str, path: str, **kw) -> tuple[int, Any]:
    url = f'{BASE_URL}{path}'
    kw.setdefault('timeout', 30)
    r = s.request(method, url, **kw)
    try:
        body = r.json()
    except ValueError:
        body = r.text[:200]
    return r.status_code, body


RESULTS: list[tuple[str, bool, str]] = []


def check(label: str, ok: bool, detail: str = '') -> None:
    RESULTS.append((label, ok, detail))
    mark = 'PASS' if ok else 'FAIL'
    print(f'  [{mark}] {label}  {detail if not ok else ""}')


def run() -> int:
    print(f'\n=== Integration smoke — {BASE_URL} ===\n')

    # 1. Platform
    print('--- Platform ---')
    code, body = _req('GET', '/api/health')
    check('GET /api/health', code == 200, f'code={code}')

    code, body = _req('GET', '/api/health/deep')
    check('GET /api/health/deep', code == 200, f'code={code}')

    code, body = _req('GET', '/api/openapi.json')
    check('GET /api/openapi.json', code == 200 and isinstance(body, dict) and 'openapi' in body,
          f'code={code}')

    code, body = _req('GET', '/api/templates')
    check('GET /api/templates', code == 200, f'code={code}')

    # 2. Public pages
    print('\n--- Public pages ---')
    code, body = _req('GET', '/')
    check('GET / (landing)', code == 200, f'code={code}')

    code, body = _req('GET', '/console')
    check('GET /console', code == 200, f'code={code}')

    # 3. Global / localization
    print('\n--- Global ---')
    code, body = _req('GET', '/api/global/countries')
    check('GET /api/global/countries', code == 200, f'code={code}')

    code, body = _req('GET', '/api/global/fx/rates')
    check('GET /api/global/fx/rates', code == 200, f'code={code}')

    # 4. Structural engineering
    print('\n--- Structural engineering ---')
    code, body = _req('POST', '/api/loads/wind/asce7', json={
        'V': 50.0, 'Kzt': 1.0, 'Kd': 0.85, 'Ke': 1.0,
        'exposure': 'C', 'height_m': 10, 'building_class': 'II',
    })
    check('POST /api/loads/wind/asce7', code == 200, f'code={code}, body={str(body)[:120]}')

    code, body = _req('POST', '/api/loads/seismic/asce7-elf', json={
        'SDS': 0.5, 'SD1': 0.25, 'R': 8.0, 'Ie': 1.0, 'W_kN': 10000.0,
        'height_ft': 30.0, 'structure_type': 'all_other', 'stories': 3,
    })
    check('POST /api/loads/seismic/asce7-elf', code == 200, f'code={code}, body={str(body)[:120]}')

    code, body = _req('POST', '/api/geotech/bearing/terzaghi', json={
        'c': 20.0, 'gamma': 18.0, 'Df': 1.5, 'B': 2.0, 'phi_deg': 30,
        'shape': 'strip',
    })
    check('POST /api/geotech/bearing/terzaghi', code == 200, f'code={code}, body={str(body)[:120]}')

    code, body = _req('POST', '/api/rc/beam/bending', json={
        'b_mm': 300, 'h_mm': 500, 'd_mm': 450,
        'As_mm2': 1200, 'fck_MPa': 30, 'fyk_MPa': 500, 'Med_kNm': 150,
    })
    check('POST /api/rc/beam/bending', code == 200, f'code={code}, body={str(body)[:120]}')

    # 5. Architecture
    print('\n--- Architecture ---')
    code, body = _req('POST', '/api/arch/uvalue', json={
        'layers': [
            {'description': 'plaster',    'thickness_m': 0.013, 'lambda_W_mK': 0.50,  'source': 'BS EN ISO 10456:2007'},
            {'description': 'brick',      'thickness_m': 0.100, 'lambda_W_mK': 0.77,  'source': 'BS EN ISO 10456:2007'},
            {'description': 'insulation', 'thickness_m': 0.050, 'lambda_W_mK': 0.035, 'source': 'BS EN ISO 10456:2007'},
            {'description': 'brick',      'thickness_m': 0.100, 'lambda_W_mK': 0.77,  'source': 'BS EN ISO 10456:2007'},
        ],
        'heat_flow': 'horizontal',
    })
    check('POST /api/arch/uvalue', code == 200, f'code={code}, body={str(body)[:120]}')

    code, body = _req('POST', '/api/arch/daylight/adf', json={
        'window_area_m2': 4.0, 'total_internal_surface_m2': 60.0,
        'T_glass': 0.68, 'sky_angle_deg': 65,
        'maintenance_factor': 0.9, 'avg_reflectance': 0.5, 'frame_factor': 0.7,
    })
    check('POST /api/arch/daylight/adf', code == 200, f'code={code}, body={str(body)[:120]}')

    # 6. Quantity surveying
    print('\n--- Quantity surveying ---')
    code, body = _req('GET', '/api/qs/nrm1/template')
    check('GET /api/qs/nrm1/template', code == 200, f'code={code}')

    code, body = _req('GET', '/api/qs/variations/clauses')
    check('GET /api/qs/variations/clauses', code == 200, f'code={code}')

    code, body = _req('GET', '/api/qs/carbon/stages')
    check('GET /api/qs/carbon/stages', code == 200, f'code={code}')

    code, body = _req('GET', '/api/qs/boq/formats')
    check('GET /api/qs/boq/formats', code == 200, f'code={code}')

    # 7. (Auth cycle removed — product is anonymous-only when embedded in
    # www.emersoneims.com; there are no /api/auth/* endpoints to exercise.)

    # 8. Project end-to-end (the one that had the owner_id bug)
    print('\n--- Project lifecycle ---')
    code, body = _req('POST', '/api/generate', json={
        'name': f'Smoke-{uuid.uuid4().hex[:6]}',
        'building_type': 'BUNGALOW',
        'location': 'Nairobi, Kenya',
        'area': 120, 'stories': 1, 'units': 1, 'bedrooms': 3,
        'gps_lat': -1.29, 'gps_lng': 36.82, 'style': 'modern',
    })
    project_id = body.get('project_id') or body.get('id') if isinstance(body, dict) else None
    check('POST /api/generate', code == 200, f'code={code}, body={str(body)[:140]}')

    code, body = _req('POST', '/api/boq/generate', json={
        'area': 120, 'stories': 1, 'units': 1, 'building_type': 'BUNGALOW',
        'location': 'Nairobi, Kenya',
    })
    check('POST /api/boq/generate', code == 200, f'code={code}, body={str(body)[:140]}')

    code, body = _req('POST', '/api/design/generate-floor-plan', json={
        'area': 120, 'bedrooms': 3, 'style': 'modern', 'building_type': 'BUNGALOW',
    })
    check('POST /api/design/generate-floor-plan', code == 200, f'code={code}, body={str(body)[:140]}')

    # 9. (Logout removed — anonymous-only deployment.)

    # Summary
    print('\n=== SUMMARY ===')
    passed = sum(1 for _, ok, _ in RESULTS if ok)
    failed = sum(1 for _, ok, _ in RESULTS if not ok)
    print(f'  passed: {passed} / {len(RESULTS)}')
    print(f'  failed: {failed}')
    if failed:
        print('\n  Failures:')
        for label, ok, detail in RESULTS:
            if not ok:
                print(f'    - {label}: {detail}')
    return 0 if failed == 0 else 1


if __name__ == '__main__':
    sys.exit(run())
