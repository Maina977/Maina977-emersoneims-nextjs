"""Tests for the four disruption modules:
mep_clash, highrise, healthcare, collaboration.

Pure-stdlib tests — no pytest fixtures beyond a tmp DB for collaboration.
Run with: python -m pytest tests/test_disruption_modules.py -v
"""

from __future__ import annotations

import math
import os
import sqlite3
import sys
import tempfile
import time

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from eims_modules import mep_clash, highrise, healthcare, collaboration


# ============================================================================
# MEP clash detection
# ============================================================================

def test_clash_duct_through_column_is_hard():
    column = mep_clash.Element(
        id='C1', system='STRUCTURE', kind='column',
        aabb=mep_clash.AABB(0.0, 0.0, 0.0, 0.4, 0.4, 3.0))
    duct = mep_clash.Element(
        id='D1', system='HVAC', kind='duct',
        aabb=mep_clash.AABB(-0.5, 0.1, 1.5, 0.9, 0.5, 1.9))
    out = mep_clash.detect([column, duct])
    assert out['success'] is True
    assert out['severity_counts']['HARD'] >= 1
    assert any(c['severity'] == 'HARD' for c in out['clashes'])


def test_clash_clean_layout_scores_100():
    a = mep_clash.Element(id='A', system='HVAC', kind='duct',
                          aabb=mep_clash.AABB(0, 0, 0, 1, 1, 1))
    b = mep_clash.Element(id='B', system='PLUMBING', kind='pipe',
                          aabb=mep_clash.AABB(10, 10, 10, 11, 11, 11))
    out = mep_clash.detect([a, b])
    assert out['coordination_score'] == 100
    assert out['severity_counts']['HARD'] == 0


# ============================================================================
# High-rise — P-Delta
# ============================================================================

def test_p_delta_negligible_at_low_theta():
    r = highrise.p_delta_amplifier(P_x_kN=1000, delta_x_m=0.005,
                                   V_x_kN=2000, h_sx_m=4.0, Cd=5.5)
    # theta = 1000*0.005 / (2000*4*5.5) ~= 0.000113 → negligible
    assert r['p_delta_negligible'] is True
    assert r['structure_unstable'] is False


def test_p_delta_unstable_above_limit():
    r = highrise.p_delta_amplifier(P_x_kN=50000, delta_x_m=0.10,
                                   V_x_kN=500, h_sx_m=3.0, Cd=2.5,
                                   theta_max=0.25)
    # theta = 50000*0.1 / (500*3*2.5) = 1.333 → unstable
    assert r['structure_unstable'] is True


# ============================================================================
# High-rise — Modal Response Spectrum (3-storey shear building, equal m & k)
# ============================================================================

def test_modal_rsa_three_storey_known_periods():
    # Equal m and k: ω_n = 2 sin((2n-1)π / (2(2N+1))) sqrt(k/m), N=3
    # For N=3 the dimensionless eigenvalues of K/M are well known:
    # λ ≈ 0.198 k/m, 1.555 k/m, 3.247 k/m
    m = [10.0, 10.0, 10.0]   # tonnes
    k = [5000.0, 5000.0, 5000.0]  # kN/m
    spec = [(0.0, 0.4), (10.0, 0.4)]   # flat 0.4g
    r = highrise.modal_response_spectrum(story_masses_t=m,
                                         story_stiffness_kNpm=k,
                                         spectrum=spec, num_modes=3)
    assert r['success']
    assert len(r['modes']) == 3
    omegas = [2 * math.pi / mode['period_s'] for mode in r['modes']]
    expected = [math.sqrt(0.198 * 500), math.sqrt(1.555 * 500),
                math.sqrt(3.247 * 500)]
    for w, e in zip(omegas, expected):
        assert abs(w - e) / e < 0.05    # within 5 % of analytical
    assert r['cumulative_mass_pct'] > 99


# ============================================================================
# Wind dynamics
# ============================================================================

def test_gust_factor_flexible_in_reasonable_range():
    r = highrise.gust_effect_factor_flexible(
        V_mps=40.0, height_m=150.0, width_m=40.0, depth_m=40.0,
        n1_hz=0.5, beta_damping=0.015, exposure='B')
    assert r['success']
    assert 0.7 < r['gust_effect_factor_Gf'] < 2.0


def test_vortex_lock_in_detected_at_critical_speed():
    # Given b=10, n=0.4 → v_crit = 10*0.4/0.12 = 33.33 m/s.
    # If V_mean=33 m/s lock-in window 27.4..41.7 → triggers.
    r = highrise.vortex_shedding_check(V_mean_mps=33.0, b_m=10.0,
                                       n1_hz=0.4, shape='rectangular')
    assert r['lock_in_likely'] is True


def test_comfort_residential_pass_and_fail():
    p = highrise.occupant_comfort(peak_accel_mps2=0.05, occupancy='residential')
    assert p['pass'] is True
    f = highrise.occupant_comfort(peak_accel_mps2=0.20, occupancy='residential')
    assert f['pass'] is False


# ============================================================================
# Healthcare
# ============================================================================

def test_healthcare_or_room_too_small_fails():
    r = healthcare.audit(rooms=[{
        'id': 'OR-1', 'type': 'operating_room_general',
        'area_m2': 30.0, 'door_clear_mm': 1500,
        'ach': 30, 'pressure': 'positive',
    }])
    assert r['fail_count'] >= 1
    assert any('area' in i['rule'].lower()
               for room in r['rooms'] for i in room['issues'])


def test_healthcare_isolation_room_pressure_check():
    r = healthcare.audit(rooms=[{
        'id': 'ISO-1', 'type': 'isolation_room_airborne',
        'area_m2': 14.0, 'door_clear_mm': 1200,
        'ach': 12, 'pressure': 'positive',  # WRONG — should be negative
    }])
    msgs = [i['rule'] for room in r['rooms'] for i in room['issues']]
    assert any('Pressure' in m for m in msgs)


def test_healthcare_compliant_room_passes():
    r = healthcare.audit(rooms=[{
        'id': 'P-1', 'type': 'patient_room_single',
        'area_m2': 14.0, 'door_clear_mm': 1200,
        'ach': 6, 'pressure': 'neutral', 'en_suite_wc': True,
        'handwash_distance_m': 1.5,
    }])
    assert r['fail_count'] == 0


def test_compartment_too_large_fails():
    r = healthcare.audit(compartments=[{
        'id': 'WARD-A', 'usage': 'inpatient_ward', 'area_m2': 2500,
    }])
    assert r['fail_count'] >= 1


# ============================================================================
# Collaboration — locks, presence, change feed
# ============================================================================

@pytest.fixture()
def tmp_db(tmp_path):
    """Provide a get_db callable backed by a fresh sqlite file."""
    path = tmp_path / 'collab_test.db'

    def get_db():
        c = sqlite3.connect(str(path))
        c.row_factory = sqlite3.Row
        return c

    collaboration._ensure_schema(get_db)
    return get_db


def test_lock_acquire_and_conflict(tmp_db):
    a = collaboration.acquire_lock(tmp_db, project_id='P1',
                                   user_id='alice', user_name='Alice')
    assert a['success']
    b = collaboration.acquire_lock(tmp_db, project_id='P1',
                                   user_id='bob', user_name='Bob')
    assert b['success'] is False
    assert b['error'] == 'locked'
    assert b['held_by']['user_id'] == 'alice'


def test_lock_release_and_reacquire(tmp_db):
    a = collaboration.acquire_lock(tmp_db, project_id='P2', user_id='alice')
    rel = collaboration.release_lock(tmp_db, project_id='P2', token=a['token'])
    assert rel['success'] and rel['released']
    b = collaboration.acquire_lock(tmp_db, project_id='P2', user_id='bob')
    assert b['success']


def test_lock_renew(tmp_db):
    a = collaboration.acquire_lock(tmp_db, project_id='P3', user_id='a', ttl_s=60)
    r = collaboration.renew_lock(tmp_db, project_id='P3',
                                 token=a['token'], ttl_s=600)
    assert r['success']
    assert r['expires_at'] > a['expires_at']


def test_presence_and_purge(tmp_db):
    collaboration.heartbeat(tmp_db, project_id='P4', user_id='alice', view='floor1')
    collaboration.heartbeat(tmp_db, project_id='P4', user_id='bob', view='floor2')
    p = collaboration.presence(tmp_db, project_id='P4')
    assert p['count'] == 2
    ids = {u['user_id'] for u in p['users']}
    assert ids == {'alice', 'bob'}


def test_change_feed_record_and_fetch(tmp_db):
    r1 = collaboration.record_change(tmp_db, project_id='P5', user_id='alice',
                                     op='wall.create',
                                     payload={'id': 'W1', 'len': 5.0})
    r2 = collaboration.record_change(tmp_db, project_id='P5', user_id='bob',
                                     op='wall.update', payload={'id': 'W1'})
    assert r1['success'] and r2['success']
    poll = collaboration.poll_changes(tmp_db, project_id='P5',
                                      since_id=0, timeout_s=0.1)
    assert len(poll['changes']) == 2
    assert poll['changes'][0]['op'] == 'wall.create'
    assert poll['last_id'] == r2['change_id']


def test_change_feed_long_poll_times_out_quickly(tmp_db):
    t0 = time.time()
    poll = collaboration.poll_changes(tmp_db, project_id='EMPTY',
                                      since_id=0, timeout_s=1.0)
    elapsed = time.time() - t0
    assert poll['timed_out'] is True
    assert poll['changes'] == []
    assert elapsed < 2.5
