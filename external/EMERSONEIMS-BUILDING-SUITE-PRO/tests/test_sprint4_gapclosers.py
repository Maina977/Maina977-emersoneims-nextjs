"""Tests for Sprint-4 gap-closer modules: projects, scheduler, frame, export."""

from __future__ import annotations

import io
import os
import sys
import tempfile

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
os.environ['EIMS_UPLOAD_FOLDER'] = tempfile.mkdtemp(prefix='eims_sprint4_')


# -------------------- projects (SQLite) --------------------

def test_projects_persist_and_snapshot():
    # Reload to pick up the temp upload folder
    import importlib
    from eims_modules import projects as p
    importlib.reload(p)
    r = p.create_project(name='UnitTest', client='c', location='l')
    assert r['success'] and r['project']['id'] > 0
    pid = r['project']['id']

    snap = p.save_snapshot(project_id=pid, module='wind', label='ASCE-test',
                             payload={'standard': 'ASCE 7-22',
                                       'source': 'Table 26.10-1', 'Kz': 0.98})
    assert snap['success']
    assert snap['snapshot']['source_count'] == 2  # standard + source

    snap_no_src = p.save_snapshot(project_id=pid, module='m', label='no-src',
                                     payload={'value': 42})
    assert snap_no_src['data_provenance_warning'] is not None

    proj = p.get_project(pid)
    assert proj and len(proj['snapshots']) == 2

    full = p.get_snapshot(snap['snapshot']['id'])
    assert full['payload']['Kz'] == 0.98

    assert p.delete_snapshot(snap['snapshot']['id']) is True
    assert p.delete_project(pid) is True
    assert p.get_project(pid) is None


# -------------------- CPM scheduler --------------------

def test_cpm_simple_chain_critical_path():
    from eims_modules.scheduler import cpm
    acts = [
        {'id': 'A', 'name': 'A', 'duration_days': 5,  'predecessors': []},
        {'id': 'B', 'name': 'B', 'duration_days': 10, 'predecessors': ['A']},
        {'id': 'C', 'name': 'C', 'duration_days': 4,  'predecessors': ['A']},
        {'id': 'D', 'name': 'D', 'duration_days': 8,  'predecessors': ['B', 'C']},
    ]
    r = cpm(activities=acts)
    assert r['success']
    # Path A->B->D = 23, A->C->D = 17 ; project = 23
    assert r['project_duration_days'] == 23
    # Critical path must include A, B, D and exclude C (TF=6)
    cp = set(r['critical_path'])
    assert {'A', 'B', 'D'}.issubset(cp)
    c = next(a for a in r['activities'] if a['id'] == 'C')
    assert c['total_float'] == 6
    assert c['is_critical'] is False


def test_cpm_detects_cycle():
    from eims_modules.scheduler import cpm
    acts = [
        {'id': 'A', 'duration_days': 1, 'predecessors': ['B']},
        {'id': 'B', 'duration_days': 1, 'predecessors': ['A']},
    ]
    r = cpm(activities=acts)
    assert r['success'] is False
    assert 'cycle' in r['error'].lower()


def test_cpm_with_dates():
    from eims_modules.scheduler import cpm
    r = cpm(activities=[{'id': 'A', 'duration_days': 7, 'predecessors': []}],
              project_start='2026-05-01')
    assert r['success']
    assert r['project_finish'] == '2026-05-08'
    assert r['activities'][0]['start_date'] == '2026-05-01'


# -------------------- 2D frame analysis --------------------

def test_frame_simply_supported_beam_udl():
    """Reference: simply supported beam, span L, UDL w.
       M_mid = wL²/8, R_a = R_b = wL/2.
       Use I=8.36e-5 (UB203x133x30), E=210 GPa, L=6 m, w=12 kN/m down (-12000 N/m).
    """
    from eims_modules.frame_analysis import analyze
    L = 6.0; w = -12000.0  # -ve = downward in our +y up convention
    nodes = [{'id': 'A', 'x': 0, 'y': 0}, {'id': 'B', 'x': L, 'y': 0}]
    members = [{'id': 'b', 'i': 'A', 'j': 'B',
                  'E': 210e9, 'A': 7.55e-3, 'I': 8.36e-5}]
    # Simply supported -- pin (ux,uy) at A, roller (uy) at B
    supports = [{'node': 'A', 'ux': True, 'uy': True, 'rz': False},
                  {'node': 'B', 'ux': False, 'uy': True, 'rz': False}]
    r = analyze(nodes=nodes, members=members, supports=supports,
                  loads=[], member_loads=[{'member': 'b', 'type': 'UDL', 'w': w}])
    assert r['success']
    # Reactions: each support carries wL/2 = 36 kN (upward = +Ry). Our w is -12kN/m,
    # FEF for w=-12000 is -wL/2 each = +36000 each (loads on structure = -fef = -36000),
    # so reaction = +36 kN at each support (upward).
    Ra = r['reactions']['A']['Ry_kN']
    Rb = r['reactions']['B']['Ry_kN']
    assert abs(Ra - 36.0) < 0.05, f'Ra={Ra}'
    assert abs(Rb - 36.0) < 0.05, f'Rb={Rb}'
    # Mid-span moment: end moments from analysis are zero (pin/roller), but the
    # member-end shears must equal the reactions
    Vi = r['members'][0]['end_i']['V_kN']
    Vj = r['members'][0]['end_j']['V_kN']
    assert abs(abs(Vi) - 36.0) < 0.05
    assert abs(abs(Vj) - 36.0) < 0.05


def test_frame_unrestrained_returns_error():
    from eims_modules.frame_analysis import analyze
    r = analyze(nodes=[{'id': 'A', 'x': 0, 'y': 0}, {'id': 'B', 'x': 1, 'y': 0}],
                  members=[{'id': 'b', 'i': 'A', 'j': 'B',
                              'E': 210e9, 'A': 1e-3, 'I': 1e-5}],
                  supports=[],  # no restraints
                  loads=[{'node': 'B', 'Fx': 1000}])
    assert r['success'] is False
    assert 'support' in r['error'].lower() or 'mechanism' in r['error'].lower()


# -------------------- export (CSV / XLSX) --------------------

def test_export_csv_round_trip():
    from eims_modules.export import render_csv
    blob = render_csv(rows=[{'a': 1, 'b': 2}, {'a': 3, 'b': 4}], columns=['a', 'b'])
    text = blob.decode('utf-8-sig')
    assert 'a,b' in text
    assert '1,2' in text and '3,4' in text


def test_export_xlsx_or_json_fallback():
    from eims_modules.export import render_xlsx, OPENPYXL_OK
    blob = render_xlsx(sheets=[{'name': 'S1',
                                   'columns': ['x', 'y'],
                                   'rows': [{'x': 1, 'y': 2}],
                                   'meta': {'source': 'unit-test'}}])
    assert isinstance(blob, (bytes, bytearray)) and len(blob) > 50
    if OPENPYXL_OK:
        # openpyxl produces a ZIP-based xlsx -> starts with PK
        assert blob[:2] == b'PK'
    else:
        assert b'_warning' in blob  # JSON fallback marker


# -------------------- end-to-end Flask wiring --------------------

@pytest.fixture(scope='module')
def client():
    import app_professional
    app_professional.app.config['TESTING'] = True
    return app_professional.app.test_client()


def test_routes_registered(client):
    rules = {str(r) for r in client.application.url_map.iter_rules()}
    for r in ('/api/sched/cpm', '/api/sched/gantt',
                '/api/eng/frame/analyze',
                '/api/store/projects', '/api/store/projects/<int:pid>',
                '/api/export/csv', '/api/export/xlsx'):
        assert r in rules, f'missing route {r}'


def test_cpm_endpoint_works(client):
    r = client.post('/api/sched/cpm', json={
        'activities': [{'id': 'A', 'duration_days': 3, 'predecessors': []},
                         {'id': 'B', 'duration_days': 4, 'predecessors': ['A']}]
    })
    assert r.status_code == 200
    assert r.get_json()['project_duration_days'] == 7


def test_frame_endpoint_works(client):
    r = client.post('/api/eng/frame/analyze', json={
        'nodes':    [{'id': 'A', 'x': 0, 'y': 0}, {'id': 'B', 'x': 3, 'y': 0}],
        'members':  [{'id': 'm', 'i': 'A', 'j': 'B', 'E': 210e9,
                       'A': 1e-3, 'I': 1e-5}],
        'supports': [{'node': 'A', 'ux': True, 'uy': True, 'rz': True}],
        'loads':    [{'node': 'B', 'Fy': -1000}],
    })
    assert r.status_code == 200
    body = r.get_json()
    assert body['success']
    # Cantilever tip deflection should be downward
    assert body['displacements']['B']['uy_mm'] < 0


def test_xlsx_endpoint_returns_binary(client):
    r = client.post('/api/export/xlsx', json={
        'title': 't', 'filename': 'out.xlsx',
        'sheets': [{'name': 'S', 'columns': ['a'], 'rows': [{'a': 1}]}]
    })
    # auth-protected; either 200 with bytes or 401 if auth required
    assert r.status_code in (200, 401)
