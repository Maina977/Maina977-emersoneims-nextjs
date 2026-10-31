/**
 * Building Suite, round-5 audit (2026-10-29): blank demands are stated, EC8 λ
 * needs a storey count, footing punching scans every perimeter, EC7 undrained
 * uses the total overburden and the minimum V for inclination, deflection
 * respects As,min, strict dates and room geometry.
 */
import { describe, it, expect } from 'vitest';
import * as c from '@/lib/wizard-api/buildingCalcs';

const run = (fn: (b: c.Body) => unknown, b: c.Body) => c.runCalc(fn, b) as Record<string, unknown>;
const isErr = (fn: (b: c.Body) => unknown, b: c.Body) => c.isCalcError(c.runCalc(fn, b));
const num = (v: unknown) => Number(v);

describe('round 5', () => {
  it('a blank M_Ed or bolt load is named beside the verdict', () => {
    const r = run(c.rcBeam, { b_mm: 300, d_mm: 450, As_mm2: 1500, fck_MPa: 30, fyk_MPa: 500 });
    expect(String(r.overall)).toMatch(/not checked: M_Ed not given/);
    const b = run(c.steelBolt, { designation: 'M20', grade: '8.8' });
    expect(JSON.stringify(b.not_checked)).toMatch(/Fv,Ed not given/);
  });

  it('EC8: λ = 1.0 without a storey count, 0.85 for 3+ storeys, and it is stated', () => {
    const base = { agR_g: 0.15, q: 3.9, W_kN: 10000, ground_type: 'C', height_m: 6 };
    const none = run(c.seismicEc8, base);
    expect(none.lambda).toBe(1);
    expect((none.assumptions as string[]).join(' ')).toMatch(/storeys not given/);
    expect(run(c.seismicEc8, { ...base, storeys: 4 }).lambda).toBe(0.85);
    expect(run(c.seismicEc8, { ...base, storeys: 2 }).lambda).toBe(1);
  });

  it('pad footing punching scans a < 2d and finds the auditor\'s worse perimeter', () => {
    // Auditor case: N 1200/1680, q 100, column 230, h 600, C20: worst ratio about 1.03 near a ≈ d.
    const r = run(c.padFooting, { N_sls_kN: 1200, N_uls_kN: 1680, q_allow_kPa: 100, column_mm: 230, h_mm: 600, fck_MPa: 20 });
    const chk = (r.checks as Array<{ check: string; pass: boolean }>).find((x) => /Punching, worst perimeter/.test(x.check))!;
    expect(chk).toBeTruthy();
    expect(num(r.punching_perimeter_a_mm)).toBeLessThan(2 * num(r.d_mm));
    expect(chk.pass).toBe(false);
  });

  it('pad footing refuses a footing deeper than it is wide', () => {
    expect(isErr(c.padFooting, { N_sls_kN: 50, q_allow_kPa: 300, column_mm: 300, h_mm: 3000, fck_MPa: 25 })).toBe(true);
  });

  it('EC7 undrained uses the total overburden (water table at the surface)', () => {
    // Df 2, γ 19: total q = 38 kPa (not 2·(19 − 9.81) = 18.4).
    const r = run(c.bearingEc7, { condition: 'undrained', cu_kPa: 50, gamma_kN_m3: 19, B_m: 2, L_m: 2, Df_m: 2, water_depth_m: 0 });
    const c1 = (r.combinations as Array<Record<string, number>>)[0];
    expect(c1.q_Rd_kPa).toBeCloseTo((Math.PI + 2) * 50 * 1.2 + 38, 0);
  });

  it('EC7 inclination uses the minimum vertical load (G only)', () => {
    // Drained φ 30, c 0, 2×2, Df 1, Gk 800, Qk 300, H 100: C1 base = 1 − 135/800 (not /1530).
    const r = run(c.bearingEc7, { condition: 'drained', c_kPa: 0, phi_deg: 30, gamma_kN_m3: 18, B_m: 2, L_m: 2, Df_m: 1, Gk_kN: 800, Qk_kN: 300, H_kN: 100, H_type: 'permanent' });
    const c1 = (r.combinations as Array<Record<string, number>>)[0];
    expect(c1.iq).toBeCloseTo(Math.pow(1 - 135 / 800, 1.5), 3);
  });

  it('deflection uses at least the minimum steel ratio', () => {
    const r = run(c.ec2Deflection, { span_m: 5, d_mm: 200, b_mm: 1000, As_req_mm2: 50, fck_MPa: 30, system: 'simply_supported' });
    // ρ raised to ρmin = max(0.26·fctm/fyk, 0.0013) = 0.00151; Eq. 7.16a at that ρ.
    const fck = 30, rho0 = Math.sqrt(fck) / 1000, rhoMin = Math.max(0.26 * 0.3 * Math.pow(fck, 2 / 3) / 500, 0.0013);
    const eq = 11 + 1.5 * Math.sqrt(fck) * rho0 / rhoMin + 3.2 * Math.sqrt(fck) * Math.pow(rho0 / rhoMin - 1, 1.5);
    expect(num(r.l_over_d_allowed)).toBeCloseTo(eq, 0); // about 116, not 1867
    expect(String(r.warning)).toMatch(/below As,min/);
    expect(String(r.warning)).toMatch(/calculated deflection/);
  });

  it('strict dates and room geometry', () => {
    expect(isErr(c.sunPosition, { lat: -1.29, lng: 36.82, datetime_utc: '2026-02-31T12:00:00Z' })).toBe(true);
    expect(isErr(c.sunPosition, { lat: -1.29, lng: 36.82, datetime_utc: 12 })).toBe(true);
    expect(isErr(c.sunPosition, { lat: -1.29, lng: 36.82, datetime_utc: '2026-06-21T12:00:00Z' })).toBe(false);
    expect(isErr(c.daylightAdf, { T_glass: 0.7, window_area_m2: 4, sky_angle_deg: 65, total_internal_surface_m2: 100, avg_reflectance: 0.99, maintenance_factor: 0.9 })).toBe(true);
    expect(isErr(c.reverberation, { volume_m3: 0.001, surfaces: [{ area_m2: 90000, alpha: 0.1 }] })).toBe(true);
    expect(isErr(c.reverberation, { volume_m3: 200, surfaces: [{ area_m2: 100, alpha: 0.1 }, { area_m2: 80, alpha: 0.3 }, { area_m2: 60, alpha: 0.05 }] })).toBe(false);
  });
});
