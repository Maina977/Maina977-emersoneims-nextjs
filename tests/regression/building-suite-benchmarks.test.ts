/**
 * Building Suite Pro (Engineering Apps directive §6, §10), P0 audit 2026-11-13.
 * Expected values worked by hand from the stated formulas, independently of the code.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as calcs from '@/lib/wizard-api/buildingCalcs';
import { POST as reportPost } from '@/app/api/building/comprehensive-report/route';

type R = Record<string, unknown>;
const run = (fn: (b: calcs.Body) => unknown, b: calcs.Body) => fn(b) as R;

describe('BS-QS-01 slab concrete take-off (directive benchmark)', () => {
  it('12 m × 8 m × 0.15 m = 14.40 m³ net', () => {
    const x = run(calcs.slabConcrete, { length_m: 12, width_m: 8, thickness_m: 0.15 });
    expect(x.net_volume_m3).toBe(14.4);
    expect(x.deductions_m3).toBe(0);
  });
  it('openings are deducted: a 2 × 1.5 m stair void and two 0.6 × 0.6 m shafts → 14.40 − 0.558 = 13.842 m³', () => {
    // 2 × 1.5 = 3.00 m²; 2 × 0.36 = 0.72 m²; 3.72 m² × 0.15 = 0.558 m³
    const x = run(calcs.slabConcrete, { length_m: 12, width_m: 8, thickness_m: 0.15, openings: [{ description: 'Stair', length_m: 2, width_m: 1.5 }, { description: 'Shaft', length_m: 0.6, width_m: 0.6, count: 2 }] });
    expect(x.deductions_m3).toBe(0.558);
    expect(x.net_volume_m3).toBe(13.842);
    expect(x.net_area_m2).toBe(92.28);
  });
  it('reinforcement and formwork are not invented', () => {
    const x = run(calcs.slabConcrete, { length_m: 12, width_m: 8, thickness_m: 0.15 });
    expect((x.not_included as string[]).join(' ')).toMatch(/Reinforcement[^]*Formwork/);
    expect(JSON.stringify(x)).not.toMatch(/Y1[02-6]|BRC|kg\/m/);
  });
  it('rejects invalid dimensions instead of guessing', () => {
    expect(run(calcs.slabConcrete, { length_m: 12, width_m: 8 }).error).toBeTruthy();
    expect(String(run(calcs.slabConcrete, { length_m: 12, width_m: 8, thickness_m: 150 }).error)).toMatch(/thickness_m/); // mm typed as m
    expect(String(run(calcs.slabConcrete, { length_m: -12, width_m: 8, thickness_m: 0.15 }).error)).toMatch(/greater than 0/);
    expect(String(run(calcs.slabConcrete, { length_m: 12, width_m: 8, thickness_m: 0.15, openings: [{ length_m: 13, width_m: 9 }] }).error)).toMatch(/larger than the slab/);
    expect(String(run(calcs.slabConcrete, { length_m: 2, width_m: 2, thickness_m: 0.15, openings: [{ length_m: 2, width_m: 2 }] }).error)).toMatch(/leave no slab/);
    expect(String(run(calcs.slabConcrete, { length_m: 12, width_m: 8, thickness_m: 0.15, openings: [{ length_m: 1, width_m: 1, count: 1.5 }] }).error)).toMatch(/whole number/);
  });
});

describe('BS-ENG benchmarks against hand calculations', () => {
  it('RC beam 300 × 500, As 1500 mm², C30, B500 → x 159.8 mm, z 436.1 mm, M_Rd 284.4 kNm (±0.1)', () => {
    // fcd = 0.85×30/1.5 = 17; fyd = 434.78; x = 1500×434.78/(0.8×300×17) = 159.847; z = 500 − 0.4x = 436.06; M = 1500×434.78×436.06/1e6 = 284.39
    const x = run(calcs.rcBeam, { b_mm: 300, d_mm: 500, As_mm2: 1500, fck_MPa: 30, fyk_MPa: 500 });
    expect(x.x_mm).toBeCloseTo(159.8, 1); expect(x.z_mm).toBeCloseTo(436.1, 1); expect(x.M_Rd_kNm).toBeCloseTo(284.4, 1);
  });
  it('simply supported 6 m beam, 20 kN/m → M 90 kNm, V 60 kN', () => {
    const x = run(calcs.rcBeam, { w_kN_m: 20, L_m: 6 });
    expect(x.M_kNm).toBe(90); expect(x.V_kN).toBe(60);
  });
  it('EC2 shear 300 × 500, C30, ρ 1 % → V_Rd,c 91.3 kN (±0.2)', () => {
    // k = 1 + √(200/500) = 1.632; v = 0.12 × 1.632 × (100 × 0.01 × 30)^(1/3) = 0.609 MPa; V = 0.609 × 300 × 500 / 1000 = 91.3
    const x = run(calcs.ec2Shear, { bw_mm: 300, d_mm: 500, fck_MPa: 30, Asl_mm2: 1500 });
    expect(x.size_factor_k).toBeCloseTo(1.632, 3); expect(x.V_Rd_c_kN as number).toBeCloseTo(91.3, 1);
  });
  it('U-value: 200 mm block (λ 1.0) + 50 mm insulation (λ 0.035), Rsi 0.13, Rse 0.04 → U 0.556 W/m²K', () => {
    // R = 0.13 + 0.04 + 0.2 + 1.4286 = 1.7986
    const x = run(calcs.uValue, { layers: [{ thickness_m: 0.2, lambda_W_mK: 1.0 }, { thickness_m: 0.05, lambda_W_mK: 0.035 }] });
    expect(x.R_total_m2K_W).toBeCloseTo(1.799, 3); expect(x.U_W_m2K).toBeCloseTo(0.556, 3);
  });
  it('rational method: C 0.7, i 60 mm/h, A 2 ha → 0.233 m³/s', () => {
    expect(run(calcs.rationalRunoff, { runoff_c: 0.7, rainfall_intensity_mm_hr: 60, area_ha: 2 }).Q_m3_s).toBeCloseTo(0.233, 3);
  });
});

describe('no invented building reports', () => {
  it('the description-only report API is withdrawn (501, not invented quantities)', async () => {
    const res = await reportPost();
    expect(res.status).toBe(501);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(JSON.stringify(body)).not.toMatch(/boq|6Y16|columns/i);
  });
  it('the wizard shows the server\'s explanation, not a bare error code', () => {
    const html = readFileSync(join(__dirname, '..', '..', 'public', 'eims-building-suite-v20261105.html'), 'utf8');
    expect(html).toMatch(/report&&report\.message/);
  });
});
