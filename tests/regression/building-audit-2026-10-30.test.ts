/**
 * Building Suite, round-6 audit (2026-10-30): no PASS on an undefined or
 * cannot-fail check, EC7 governing combination by utilisation and a sliding
 * check, EC8 base shear only where the method is permitted, input bounds.
 */
import { describe, it, expect } from 'vitest';
import * as c from '@/lib/wizard-api/buildingCalcs';

const run = (fn: (b: c.Body) => unknown, b: c.Body) => c.runCalc(fn, b) as Record<string, unknown>;
const isErr = (fn: (b: c.Body) => unknown, b: c.Body) => c.isCalcError(c.runCalc(fn, b));

describe('round 6', () => {
  it('span/depth refuses compression steel at or above the tension steel (Eq. 7.16b undefined)', () => {
    expect(isErr(c.ec2Deflection, { span_m: 6, d_mm: 450, b_mm: 300, As_req_mm2: 1200, Asc_mm2: 1200, fck_MPa: 30, system: 'simply_supported' })).toBe(true);
    expect(isErr(c.ec2Deflection, { span_m: 6, d_mm: 450, b_mm: 300, As_req_mm2: 1e9, fck_MPa: 30, system: 'simply_supported' })).toBe(true);
    const ok = run(c.ec2Deflection, { span_m: 6, d_mm: 450, b_mm: 300, As_req_mm2: 1200, As_prov_mm2: 1473, fck_MPa: 30, system: 'simply_supported' });
    expect(Number(ok.l_over_d_allowed)).toBeCloseTo(19.7, 1);
  });

  it('pad footing without N_uls is "sized only", never PASS', () => {
    const r = run(c.padFooting, { N_sls_kN: 1000, q_allow_kPa: 200, column_mm: 400, h_mm: 600, fck_MPa: 30 });
    expect(String(r.overall)).toMatch(/^SIZED ONLY/);
    expect(r.all_checks_pass).toBe(false);
    expect(isErr(c.padFooting, { N_sls_kN: 1000, N_uls_kN: 1400, q_allow_kPa: 200, column_mm: 400, h_mm: 600, fck_MPa: 30, As_prov_mm2_per_m: -5 })).toBe(true);
  });

  it('EC7 names the more highly utilised combination as governing, with its utilisation', () => {
    const r = run(c.bearingEc7, { condition: 'undrained', B_m: 2, L_m: 2, Df_m: 3, gamma_kN_m3: 18, cu_kPa: 30, Gk_kN: 700 });
    const combos = r.combinations as Array<Record<string, number | string>>;
    const top = combos.reduce((a, x) => (Number(x.utilisation) > Number(a.utilisation) ? x : a));
    expect(r.governing_combination).toBe(top.combination);
    expect(Number(r.utilisation)).toBe(Number(top.utilisation));
  });

  it('EC7 checks sliding when a horizontal load is given (§6.5.3)', () => {
    // Drained C1: R = 700·tan30° = 404.1 kN; H_Ed = 1.35·300 = 405 kN → fails.
    const r = run(c.bearingEc7, { condition: 'drained', c_kPa: 0, phi_deg: 30, B_m: 3, L_m: 3, Df_m: 1, gamma_kN_m3: 18, Gk_kN: 700, H_kN: 300 });
    const checks = r.checks as Array<{ check: string; pass: boolean }>;
    const slide = checks.filter((x) => /Sliding/.test(x.check));
    expect(slide.length).toBe(2);
    expect(slide[0].pass).toBe(false);
    expect(r.all_checks_pass).toBe(false);
  });

  it('EC7 refuses absurd geometry and loads', () => {
    expect(isErr(c.bearingEc7, { condition: 'drained', c_kPa: 0, phi_deg: 30, B_m: 2, L_m: 1e9, Df_m: 1, gamma_kN_m3: 18 })).toBe(true);
    expect(isErr(c.bearingEc7, { condition: 'drained', c_kPa: 0, phi_deg: 30, B_m: 2, L_m: 2, Df_m: 1, gamma_kN_m3: 18, Gk_kN: 1e12 })).toBe(true);
  });

  it('EC8 gives no base shear where the lateral force method is not permitted', () => {
    const r = run(c.seismicEc8, { agR_g: 0.15, ground_type: 'D', importance_class: 'II', q: 3, W_kN: 10000, T1_s: 3, structure_type: 'concrete_moment_frame' });
    expect(r.method_permitted).toBe(false);
    expect(r.F_b_kN).toBeUndefined();
    expect(String(r.overall)).toMatch(/^NOT PERMITTED/);
  });

  it('EC8 states defaulted inputs', () => {
    const r = run(c.seismicEc8, { agR_g: 0.15, ground_type: 'C', q: 3.9, W_kN: 10000, height_m: 12 });
    const a = JSON.stringify(r.assumptions);
    expect(a).toMatch(/importance_class not given/);
    expect(a).toMatch(/structure_type not given/);
  });

  it('shear caps the link area at the Eq. 6.12 maximum and refuses absurd areas', () => {
    expect(isErr(c.ec2Shear, { bw_mm: 300, d_mm: 500, fck_MPa: 30, Asl_mm2: 1473, Asw_mm2: 1e9, s_mm: 200 })).toBe(true);
  });

  it('daylight factor needs a room surface consistent with the window', () => {
    expect(isErr(c.daylightAdf, { T_glass: 0.7, window_area_m2: 4, sky_angle_deg: 65, total_internal_surface_m2: 5, avg_reflectance: 0.5, maintenance_factor: 0.9 })).toBe(true);
  });

  it('reverberation refuses times no room can have', () => {
    expect(isErr(c.reverberation, { volume_m3: 200, absorption_m2_sabin: 0.5 })).toBe(true);
  });
});
