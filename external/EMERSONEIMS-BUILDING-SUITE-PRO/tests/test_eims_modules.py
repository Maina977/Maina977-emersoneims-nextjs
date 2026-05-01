"""End-to-end test suite for all eims_modules.

Run: .\.venv\Scripts\python.exe -m pytest tests\test_eims_modules.py -v

Tests are network-free (FX/PPI tests use the cached fallback path) so
they pass in CI. Each test asserts a numeric reference value or a
documented compliance band.
"""

from __future__ import annotations

import os
import sys
import tempfile

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

# Use a tempdir so audit/variations/cache writes don't pollute uploads/
os.environ['EIMS_UPLOAD_FOLDER'] = tempfile.mkdtemp(prefix='eims_test_')


# -------------------- engineering --------------------

def test_wind_loads_kz_matches_table():
    from eims_modules.wind_loads import asce_7_22
    r = asce_7_22(V_mph=115, height_ft=30, length_ft=60, width_ft=40,
                   exposure='C', enclosure='enclosed')
    assert r['success'] is True
    # ASCE 7-22 Table 26.10-1, Exposure C, z=30 ft -> Kz approx 0.98
    assert 0.95 < r['intermediate']['Kz'] < 1.00
    assert r['code'].startswith('ASCE 7-22')
    assert r['intermediate']['qz_psf'] > 0


def test_seismic_asce_elf_returns_valid_base_shear():
    from eims_modules.seismic import asce_7_22_elf
    r = asce_7_22_elf(SDS=1.0, SD1=0.5, R=8, Ie=1.0, W_kN=8896,
                       height_ft=48, structure_type='steel_moment_frame',
                       T_user=0.5, stories=4)
    assert r['success'] is True
    assert r['intermediate']['Cs'] > 0
    assert r['base_shear_kN'] > 0
    assert len(r['vertical_distribution']) == 4


def test_seismic_eurocode8_spectrum_monotone():
    from eims_modules.seismic import en_1998_spectrum
    r = en_1998_spectrum(ag_g=0.25, soil_class='C', spectrum_type=1, q=3.5)
    assert r['success'] is True
    assert 'elastic_spectrum' in r and 'design_spectrum' in r


def test_geotech_terzaghi_strip():
    from eims_modules.geotech import terzaghi
    r = terzaghi(c_kPa=10, phi_deg=30, gamma_kN_m3=18, B_m=2, Df_m=1.5,
                  shape='strip')
    assert r['success'] is True
    # phi=30 -> Nq~18.4, Nc~30.1 ; reasonable range
    assert 18 < r['factors']['Nq'] < 19
    assert r['qu_kPa'] > 0


def test_geotech_spt_phi():
    from eims_modules.geotech import spt_friction_angle
    r = spt_friction_angle(N60=15)
    assert r['success'] is True
    # Wolff: 27.1 + 0.3*15 - 0.00054*225 = 31.48 deg
    assert abs(r['phi_deg'] - 31.48) < 0.05


def test_rc_beam_passes_at_low_load():
    from eims_modules.rc_design import beam_singly_reinforced
    r = beam_singly_reinforced(b_mm=300, h_mm=500, d_mm=450,
                                 As_mm2=1500, fck_MPa=30, fyk_MPa=500,
                                 Med_kNm=180)
    assert r['success'] is True
    assert r['Mrd_kNm'] > 180
    assert r['pass'] is True


def test_rc_column_axial():
    from eims_modules.rc_design import column_axial_only
    r = column_axial_only(b_mm=400, h_mm=400, As_mm2=2454,
                            fck_MPa=30, fyk_MPa=500, Ned_kN=2500)
    assert r['success'] is True
    assert r['NRd_kN'] > 2500
    assert r['utilization'] < 1


def test_steel_bolt_capacity():
    from eims_modules.steel_connections import bolt_capacity
    r = bolt_capacity(designation='M20', grade='8.8', shear_planes=1,
                       threads_in_shear=True, t_ply_mm=10, fu_ply_MPa=410,
                       e1_mm=30, p1_mm=60, d_hole_mm=22,
                       Fv_Ed_kN=50, Ft_Ed_kN=10)
    assert r['success'] is True
    # M20 8.8 single-shear thread Fv,Rd = 0.6 * 800 * 245 / 1.25 / 1000 = 94.08 kN
    assert abs(r['Fv_Rd_kN'] - 94.08) < 0.1


# -------------------- QS --------------------

def test_nrm1_cost_plan_summary_keys():
    from eims_modules.nrm1_costplan import build_cost_plan, empty_template
    els = empty_template()
    for el in els:
        el['rate_per_m2'] = 100
        el['rate_source'] = 'unit-test'
    r = build_cost_plan(gifa_m2=1000, elements=els)
    assert r['success'] is True
    s = r['summary']
    assert s['cost_limit'] > s['works_cost_estimate']
    assert s['cost_per_m2_gifa'] > 0


def test_rate_buildup_algebra():
    from eims_modules.rate_buildup import build_rate
    r = build_rate(item_description='x', unit_of_measure='m3',
                    labour=[{'description': 'a', 'unit': 'hr',
                              'quantity': 2, 'rate': 25, 'source': 't'}],
                    plant=[],
                    material=[{'description': 'b', 'unit': 'm3',
                                'quantity': 1, 'rate': 100, 'source': 't'}],
                    waste_pct=0.05, overheads_pct=0.10, profit_pct=0.05)
    # direct = 50 + 100 = 150 ; *1.05 = 157.5 ; *1.10 = 173.25 ; *1.05 = 181.9125
    assert r['success'] is True
    assert abs(r['unit_rate'] - 181.9125) < 1e-6


def test_cashflow_s_curve_50pct_at_midpoint():
    from eims_modules.cashflow import cashflow_s_curve
    r = cashflow_s_curve(contract_value=1_000_000, duration_months=10,
                           k=6.0, t0=0.5)
    assert r['success'] is True
    # symmetric logistic with t0=0.5 should hit 50% at month 5
    assert abs(r['monthly_forecast'][4]['cumulative_spend'] - 500_000) < 1


def test_interim_valuation_arithmetic():
    from eims_modules.cashflow import interim_valuation
    r = interim_valuation(gross_value_to_date=1_000_000,
                            previously_certified=400_000,
                            retention_pct=0.05, vat_pct=0.20)
    # net to date = 1,000,000 - 50,000 = 950,000 ; due = 550,000 ; VAT = 110,000
    c = r['certificate']
    assert c['amount_due_excl_vat'] == 550_000
    assert c['amount_due_incl_vat'] == 660_000


def test_variations_register_round_trip():
    from eims_modules import variations
    import importlib
    importlib.reload(variations)  # pick up tempdir EIMS_UPLOAD_FOLDER
    r = variations.add_variation(project_id='UT', title='v1', description='d',
                                    cost_impact=1000, time_impact_days=2,
                                    contract_form='JCT_SBC_2016')
    assert r['success'] is True
    s = variations.project_summary('UT', original_contract_sum=100_000)
    assert s['counts']['total'] == 1


def test_tender_compare_flags_low_bidder():
    from eims_modules.tender_compare import compare_tenders
    bidders = [
        {'name': 'A', 'total': 1_000_000, 'items': []},
        {'name': 'B', 'total': 1_050_000, 'items': []},
        {'name': 'C', 'total': 1_020_000, 'items': []},
        {'name': 'D', 'total':   700_000, 'items': []},  # abnormally low
    ]
    r = compare_tenders(bidders=bidders)
    assert r['success'] is True
    flagged_names = [f['bidder'] for f in r['abnormally_low_flags']]
    assert 'D' in flagged_names


def test_monte_carlo_seeded_repeatable():
    from eims_modules.risk_montecarlo import monte_carlo
    risks = [{'name': 'r1', 'probability': 0.5,
               'cost_distribution': {'type': 'triangular',
                                       'min': 100, 'mode': 200, 'max': 400}}]
    r1 = monte_carlo(base_cost=1000, risks=risks, iterations=2000, seed=42)
    r2 = monte_carlo(base_cost=1000, risks=risks, iterations=2000, seed=42)
    assert r1['cost']['percentiles']['P50'] == r2['cost']['percentiles']['P50']
    assert '[MODEL OUTPUT' in r1['data_label']


def test_evm_classic_indices():
    from eims_modules.evm import evm_report
    r = evm_report(BAC=5_000_000, PV=2_500_000, EV=2_300_000, AC=2_400_000)
    assert abs(r['performance_indices']['SPI'] - 0.92) < 0.001
    assert abs(r['performance_indices']['CPI'] - 0.9583) < 0.001
    # EAC2 uses the unrounded CPI = EV/AC = 0.958333... -> 5,217,391.30
    expected_eac2 = 5_000_000 * 2_400_000 / 2_300_000
    assert abs(r['forecast']['EAC_method2_current_CPI'] - expected_eac2) < 1


def test_carbon_flags_missing_source():
    from eims_modules.carbon import assess
    r = assess(materials=[{'name': 'X', 'quantity': 1, 'unit': 'kg',
                              'factor_kgCO2e_per_unit': 5,
                              'factor_source': '',  # missing
                              'stage': 'A1-A3'}])
    assert r['success'] is True
    assert r['data_provenance']['items_missing_source'] == ['X']


# -------------------- architecture --------------------

def test_daylight_adf_band():
    from eims_modules.daylight import average_daylight_factor
    r = average_daylight_factor(T_glass=0.68, window_area_m2=10,
                                  sky_angle_deg=65,
                                  total_internal_surface_m2=120,
                                  avg_reflectance=0.5,
                                  maintenance_factor=0.9, frame_factor=0.7)
    assert r['success'] is True
    assert r['ADF_pct'] > 0
    assert r['EN17037_compliance_band'] in ('Below minimum', 'Minimum',
                                              'Medium', 'High')


def test_acoustics_sabine_known_value():
    from eims_modules.acoustics import reverberation
    # V=200 m3, S=200 m2 with alpha 0.2 -> A=40 sabines
    # T60 = 0.161*200/40 = 0.805 s
    r = reverberation(volume_m3=200,
                        surfaces=[{'area_m2': 200, 'alpha': 0.2,
                                     'description': 'all'}],
                        method='sabine')
    assert r['success'] is True
    assert abs(r['T60_seconds'] - 0.805) < 0.01


def test_uvalue_two_layer_wall():
    from eims_modules.uvalue import u_value
    # 100 mm conc lambda 1.13 + 100 mm EPS lambda 0.038
    # R = 0.13 + 0.0885 + 2.6316 + 0.04 = 2.890 ; U = 0.346
    r = u_value(layers=[
        {'description': 'concrete', 'thickness_m': 0.1,
          'lambda_W_mK': 1.13, 'source': 'EN ISO 10456'},
        {'description': 'EPS',      'thickness_m': 0.1,
          'lambda_W_mK': 0.038, 'source': 'EN ISO 10456'},
    ], heat_flow='horizontal')
    assert r['success'] is True
    assert abs(r['U_value_W_m2K'] - 0.346) < 0.005


def test_egress_office_calc():
    from eims_modules.egress import egress_capacity
    # 1500 m2 office, B occupancy load factor 14 -> N=107
    r = egress_capacity(occupancy_type='business', floor_area_m2=1500,
                          sprinklered=True, voice_notification=True)
    assert r['success'] is True
    assert r['occupant_load'] == round(1500 / 14)
    assert r['minimum_number_of_exits'] == 2  # 50..500 -> 2 exits


def test_accessibility_strictest_rejects_thin_door():
    from eims_modules.accessibility import check
    r = check(jurisdiction='strictest',
                measurements={'door_clear_width_mm': 800})
    assert r['success'] is True
    assert r['overall_pass'] is False  # 800 < 850 strictest threshold


def test_boq_format_renders_nrm2():
    from eims_modules.boq_format import render
    r = render(items=[{'ref': 'A.1', 'description': 'Excavate', 'unit': 'm3',
                         'quantity': 100, 'rate': 25}],
                format_name='NRM2')
    assert r['success'] is True
    assert r['grand_total'] == 2500
    assert 'NRM2' in r['format']


# -------------------- platform --------------------

def test_health_light_ok():
    from eims_modules.healthcheck import light, deep
    L = light()
    assert L['status'] == 'ok'
    D = deep()
    assert D['modules_total'] >= 20
    assert D['modules_ok'] >= 20


def test_audit_log_round_trip():
    from eims_modules import audit_log
    import importlib
    importlib.reload(audit_log)
    audit_log.log_event(user='u', action='POST /api/test', ok=True)
    recs = audit_log.query(limit=5)
    assert recs and recs[-1]['user'] == 'u'


def test_openapi_spec_has_paths():
    # Build a minimal Flask app with a couple of registered modules
    import flask
    from eims_modules import openapi as oa, healthcheck as hc
    app = flask.Flask(__name__)
    hc.register(app)
    oa.register(app)
    spec = oa.build_spec(app)
    assert spec['openapi'] == '3.0.3'
    assert any(p.startswith('/api/health') for p in spec['paths'])


def test_pdf_report_collects_sources():
    from eims_modules.pdf_report import _collect_sources, build_pdf
    payload = {
        'title': 'Test', 'project': 'X', 'author': 'Y',
        'findings': [{'item': 'foo', 'value': 1, 'unit': 'x',
                       'source': 'BCIS Q1 2024', 'clause': 'n/a'}],
        'calculations': [{'label': 'wind', 'standard': 'ASCE 7-22',
                            'reference': 'Table 26.10-1'}],
    }
    srcs = _collect_sources(payload)
    assert 'ASCE 7-22' in srcs and 'BCIS Q1 2024' in srcs
    blob = build_pdf(payload=payload)
    assert isinstance(blob, (bytes, bytearray)) and len(blob) > 100


def test_rate_limit_blocks_after_burst():
    import flask
    from eims_modules import rate_limit as rl
    # _settings() applies max(1,burst), so effective threshold = rpm+max(1,burst).
    # With rpm=2 burst=0 -> threshold = 3 ; 4th request must be 429.
    os.environ['EIMS_RATELIMIT_PER_MINUTE'] = '2'
    os.environ['EIMS_RATELIMIT_BURST'] = '0'
    rl._BUCKETS.clear()
    app = flask.Flask(__name__)
    rl.register(app)
    @app.route('/api/x')
    def _x():
        return 'ok'
    c = app.test_client()
    codes = [c.get('/api/x').status_code for _ in range(4)]
    assert codes[:3] == [200, 200, 200], codes
    assert codes[3] == 429, codes
    del os.environ['EIMS_RATELIMIT_PER_MINUTE']
    del os.environ['EIMS_RATELIMIT_BURST']
