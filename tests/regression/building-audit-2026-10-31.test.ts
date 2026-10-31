/**
 * Building Suite independent audit, 2026-10-31: results that showed PASS when
 * they were unsafe or unchecked, each against the auditor's hand calculation.
 */
import { describe, it, expect } from 'vitest';
import * as c from '@/lib/wizard-api/buildingCalcs';

const run = (fn: (b: c.Body) => unknown, b: c.Body) => c.runCalc(fn, b) as Record<string, any>;

describe('EC7 horizontal load', () => {
  const wind = { condition: 'drained', c_kPa: 0, phi_deg: 30, gamma_kN_m3: 18, B_m: 2, L_m: 2, Df_m: 1.2, Gk_kN: 800, Qk_kN: 300, H_kN: 150 };
  it('is variable by default, so the wind case fails (hand: 1.12)', () => {
    const r = run(c.bearingEc7, wind);
    const c2 = r.combinations.find((x: any) => x.combination === 'DA1-C2');
    expect(c2.H_Ed_kN).toBe(195);
    expect(c2.R_Rd_kN).toBeGreaterThan(1050);
    expect(c2.R_Rd_kN).toBeLessThan(1070);
    expect(r.all_checks_pass).toBe(false);
    expect(r.utilisation).toBeCloseTo(1.12, 1);
    expect(r.assumptions.join(' ')).toMatch(/treated as variable/);
  });
  it('can be declared permanent', () => {
    const r = run(c.bearingEc7, { ...wind, H_type: 'permanent' });
    expect(r.combinations.find((x: any) => x.combination === 'DA1-C2').H_Ed_kN).toBe(150);
  });
  it('a variable load with no permanent load is refused, not ignored', () => {
    expect(run(c.bearingEc7, { condition: 'drained', c_kPa: 0, phi_deg: 30, gamma_kN_m3: 18, B_m: 2, L_m: 2, Df_m: 1.2, Qk_kN: 50000 }).error).toMatch(/Gk_kN/);
  });
});

describe('no bare PASS on a partial check', () => {
  it('shear with a blank V_Ed', () => {
    const r = run(c.ec2Shear, { bw_mm: 300, d_mm: 450, fck_MPa: 30, Asl_mm2: 942, Asw_mm2: 157, s_mm: 200 });
    expect(r.overall).toMatch(/^PARTIAL/);
    expect(r.overall).toMatch(/V_Ed not given/);
  });
  it('bolt shear with no plate data', () => {
    const r = run(c.steelBolt, { designation: 'M20', grade: '8.8', Fv_Ed_kN: 90, Ft_Ed_kN: 0 });
    expect(r.overall).toMatch(/^PARTIAL/);
    expect(r.overall).toMatch(/plate bearing/);
  });
  it('a failed check still reads FAIL', () => {
    const r = run(c.steelBolt, { designation: 'M20', grade: '8.8', Fv_Ed_kN: 900, Ft_Ed_kN: 0 });
    expect(r.overall).toMatch(/^FAIL/);
  });
  it('a blank link area with a left-over spacing means no links', () => {
    const r = run(c.ec2Shear, { bw_mm: 300, d_mm: 450, fck_MPa: 30, Asl_mm2: 942, VEd_kN: 50, s_mm: 200 });
    expect(r.error).toBeUndefined();
    expect(r.V_Rd_s_kN).toBeUndefined();
  });
});

describe('bearing and deflection limits', () => {
  it('single-lap one-row bolt is limited (hand: 118.1 kN)', () => {
    const r = run(c.steelBolt, { designation: 'M24', grade: '10.9', threads_in_shear: 'false', shear_planes: 1, t_ply_mm: 10, fu_ply_MPa: 410, e1_mm: 90, e2_mm: 60, Fv_Ed_kN: 150, Ft_Ed_kN: 0 });
    expect(r.Fb_Rd_kN).toBeCloseTo(118.1, 1);
    expect(r.all_checks_pass).toBe(false);
  });
  it('the limit can be switched off when it is not a single-lap joint', () => {
    const r = run(c.steelBolt, { designation: 'M24', grade: '10.9', threads_in_shear: 'false', shear_planes: 1, t_ply_mm: 10, fu_ply_MPa: 410, e1_mm: 90, e2_mm: 60, single_lap_one_row: 'false' });
    expect(r.Fb_Rd_kN).toBeGreaterThan(190);
  });
  it('a grossly slender slab fails the 40K cap', () => {
    const r = run(c.ec2Deflection, { system: 'end_span', span_m: 6.5, d_mm: 90, b_mm: 1000, As_req_mm2: 150, fck_MPa: 25 });
    expect(r.all_checks_pass).toBe(false);
  });
  it('legacy 10.9 bolt path uses alpha 0.5 (hand: 98 kN)', () => {
    expect(run(c.steelBolt, { fub_MPa: 1000, As_mm2: 245 }).Fv_Rd_kN).toBeCloseTo(98, 1);
  });
});

describe('impossible inputs', () => {
  it('a daylight factor above any real room is refused', () => {
    expect(run(c.daylightAdf, { T_glass: 1, window_area_m2: 40, sky_angle_deg: 90, total_internal_surface_m2: 120, avg_reflectance: 0.85, maintenance_factor: 1 }).error).toBeTruthy();
  });
  it('a factor of safety of 1 is refused', () => {
    expect(run(c.bearingCapacity, { c_kPa: 10, phi_deg: 30, gamma_kN_m3: 18, B_m: 2, Df_m: 1, shape: 'square', FS: 1 }).error).toMatch(/FS/);
  });
  it('square with L different from B is refused', () => {
    expect(run(c.bearingEc7, { condition: 'drained', c_kPa: 0, phi_deg: 30, gamma_kN_m3: 18, B_m: 2, L_m: 5, Df_m: 1, shape: 'square' }).error).toMatch(/square/);
  });
});
