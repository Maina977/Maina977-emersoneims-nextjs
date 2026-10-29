/**
 * Building Suite, 2026-10-27 audit: input bounds, strict optional fields,
 * bolt Table 3.3/3.4 fixes, EN 1991-1-4 assumptions, and the new EC7, EC2
 * shear/deflection, pad footing and EN 1998 checks. Expected values are
 * worked by hand from the cited clauses.
 */
import { describe, it, expect } from 'vitest';
import * as c from '@/lib/wizard-api/buildingCalcs';

const run = (fn: (b: c.Body) => unknown, b: c.Body) => c.runCalc(fn, b) as Record<string, unknown>;
const isErr = (fn: (b: c.Body) => unknown, b: c.Body) => c.isCalcError(c.runCalc(fn, b));
const num = (v: unknown) => Number(v);

describe('absurd magnitudes are refused', () => {
  it('rational area, seismic R and W, legacy bolt, room volume, ASCE height', () => {
    expect(isErr(c.rationalRunoff, { area_ha: 1e300, runoff_c: 0.5, rainfall_intensity_mm_hr: 50 })).toBe(true);
    expect(isErr(c.seismicElf, { SDS: 1, SD1: 0.5, R: 0.001, Ie: 1, W_kN: 1000, height_m: 10 })).toBe(true);
    expect(isErr(c.seismicElf, { SDS: 1, SD1: 0.5, R: 8, Ie: 1, W_kN: 1e9, height_m: 10 })).toBe(true);
    expect(isErr(c.steelBolt, { fub_MPa: 99999, As_mm2: 1e9 })).toBe(true);
    expect(isErr(c.steelBolt, { fub_MPa: 800, As_mm2: 245, alpha_v: 0.55 })).toBe(true);
    expect(isErr(c.reverberation, { volume_m3: 1e9, absorption_m2_sabin: 100 })).toBe(true);
    expect(isErr(c.windAsce7, { V_mph: 100, height_ft: 1e7, exposure: 'B' })).toBe(true);
  });
});

describe('a mistyped optional field is an error, not a vanished check', () => {
  it('RC beam M_Ed and h, bolt loads and plate, seismic height', () => {
    const beam = { b_mm: 300, d_mm: 450, As_mm2: 1500, fck_MPa: 30, fyk_MPa: 500 };
    expect(isErr(c.rcBeam, { ...beam, Med_kNm: 'abc' })).toBe(true);
    expect(isErr(c.rcBeam, { ...beam, h_mm: 'abc' })).toBe(true);
    expect(isErr(c.rcBeam, { ...beam, Med_kNm: '' })).toBe(false); // blank = not given
    expect(isErr(c.steelBolt, { designation: 'M20', grade: '8.8', Fv_Ed_kN: '5O' })).toBe(true);
    expect(isErr(c.steelBolt, { designation: 'M20', grade: '8.8', t_ply_mm: 'abc' })).toBe(true);
    expect(isErr(c.seismicElf, { SDS: 1, SD1: 0.5, R: 8, Ie: 1, W_kN: 1000, height_m: 'abc', T: 0.5 })).toBe(true);
  });
  it('results with checks carry one overall verdict', () => {
    const r = run(c.rcBeam, { b_mm: 300, d_mm: 450, As_mm2: 100, fck_MPa: 30, fyk_MPa: 500, Med_kNm: 180 });
    expect(r.all_checks_pass).toBe(false);
    expect(String(r.overall)).toMatch(/^FAIL: /);
  });
});

describe('bolt, EN 1993-1-8 Tables 3.3 and 3.4', () => {
  const base = { designation: 'M20', grade: '8.8', t_ply_mm: 10, fu_ply_MPa: 430, e1_mm: 100 };
  it('no e1 maximum for indoor steel; 4t + 40 for exposed steel', () => {
    const indoor = run(c.steelBolt, base);
    expect(JSON.stringify(indoor.checks)).not.toMatch(/e1 ≤ 4t/);
    const outdoor = run(c.steelBolt, { ...base, exposed_to_weather: true });
    const e1 = (outdoor.checks as Array<{ check: string; pass: boolean }>).find((x) => /e1 ≤ 4t/.test(x.check))!;
    expect(e1.pass).toBe(false); // 100 > 80
  });
  it('k1 from e2: e2 = 1.2·d0 gives k1 = 1.66, Fb,Rd 34% below the k1 = 2.5 value', () => {
    // M20, d0 = 22, e1 = 66 (αd = 1), t 10, fu 430: Fb = k1·1·430·20·10/1.25.
    const wide = run(c.steelBolt, { ...base, e1_mm: 66 });
    const edge = run(c.steelBolt, { ...base, e1_mm: 66, e2_mm: 26.4 });
    expect(num(wide.Fb_Rd_kN)).toBeCloseTo(2.5 * 430 * 20 * 10 / 1.25 / 1000, 1); // 172.0
    expect(num(edge.k1)).toBeCloseTo(1.66, 2);
    expect(num(edge.Fb_Rd_kN)).toBeCloseTo(1.66 * 430 * 20 * 10 / 1.25 / 1000, 1); // 114.2
  });
  it('end and inner bolts are reported separately', () => {
    // e1 40: αd,end = 40/66 = 0.606; p1 70: αd,inner = 70/66 − 0.25 = 0.811.
    const r = run(c.steelBolt, { ...base, e1_mm: 40, p1_mm: 70 });
    expect(num(r.Fb_Rd_end_bolt_kN)).toBeCloseTo(2.5 * (40 / 66) * 430 * 20 * 10 / 1.25 / 1000, 1);
    expect(num(r.Fb_Rd_inner_bolt_kN)).toBeCloseTo(2.5 * (70 / 66 - 0.25) * 430 * 20 * 10 / 1.25 / 1000, 1);
    expect(num(r.Fb_Rd_kN)).toBe(num(r.Fb_Rd_end_bolt_kN));
  });
});

describe('EN 1991-1-4 states its assumptions', () => {
  it('ρ default, z below zmin, and ρ = 1.0 lowers qp by 20%', () => {
    const r = run(c.windEurocode, { vb_ms: 24, height_m: 3, terrain_category: 'IV' });
    const a = (r.assumptions as string[]).join(' ');
    expect(a).toMatch(/1\.25 kg\/m³/);
    expect(a).toMatch(/below zmin = 10 m/);
    const lo = run(c.windEurocode, { vb_ms: 24, height_m: 3, terrain_category: 'IV', rho_kg_m3: 1.0 });
    expect(num(lo.qp_Pa) / num(r.qp_Pa)).toBeCloseTo(0.8, 2);
  });
});

describe('EC7 Annex D bearing (DA1)', () => {
  it('drained square footing, C1 characteristic = 1459 kPa (auditor\'s EC7 figure)', () => {
    // Nq 18.40, Nc 30.14, Nγ 20.09; sq 1.5, sγ 0.7, sc 1.529:
    // 10·30.14·1.529 + 27·18.40·1.5 + 0.5·18·2·20.09·0.7 = 1459.
    const r = run(c.bearingEc7, { condition: 'drained', c_kPa: 10, phi_deg: 30, gamma_kN_m3: 18, B_m: 2, L_m: 2, Df_m: 1.5 });
    const c1 = (r.combinations as Array<Record<string, number | string>>).find((x) => x.combination === 'DA1-C1')!;
    expect(num(c1.q_Rd_kPa)).toBeCloseTo(1459, -1);
    expect(r.governing_combination).toBe('DA1-C2'); // factored strength governs
  });
  it('undrained square: (π+2)·cu·1.2 + q; C2 divides cu by 1.4', () => {
    const r = run(c.bearingEc7, { condition: 'undrained', cu_kPa: 50, gamma_kN_m3: 18, B_m: 1.5, L_m: 1.5, Df_m: 1 });
    const [c1, c2] = r.combinations as Array<Record<string, number>>;
    expect(c1.q_Rd_kPa).toBeCloseTo((Math.PI + 2) * 50 * 1.2 + 18, 0); // 326.4
    expect(c2.q_Rd_kPa).toBeCloseTo((Math.PI + 2) * (50 / 1.4) * 1.2 + 18, 0);
  });
  it('loads give a utilisation check per combination', () => {
    const r = run(c.bearingEc7, { condition: 'undrained', cu_kPa: 50, gamma_kN_m3: 18, B_m: 1.5, L_m: 1.5, Df_m: 1, Gk_kN: 300, Qk_kN: 100 });
    expect((r.checks as unknown[]).length).toBe(2);
    expect(typeof r.all_checks_pass).toBe('boolean');
  });
});

describe('EC2 shear', () => {
  it('VRd,c for 300 × 450, 3T20 (942 mm²), C30', () => {
    // k = 1 + √(200/450) = 1.667; ρ = 942/135000 = 0.00698;
    // vRd,c = 0.12·1.667·(100·0.00698·30)^(1/3) = 0.551 MPa → 74.4 kN.
    const r = run(c.ec2Shear, { bw_mm: 300, d_mm: 450, fck_MPa: 30, Asl_mm2: 942 });
    expect(num(r.V_Rd_c_kN)).toBeCloseTo(74.4, 0);
  });
  it('links: VRd,s = Asw/s·z·fywd·cotθ', () => {
    // 2 legs T10 = 157 mm² at 200: 0.785·405·434.8·2.5/1000 = 345.6 kN.
    const r = run(c.ec2Shear, { bw_mm: 300, d_mm: 450, fck_MPa: 30, Asl_mm2: 942, VEd_kN: 200, Asw_mm2: 157, s_mm: 200 });
    expect(num(r.cot_theta)).toBe(2.5);
    expect(num(r.V_Rd_s_kN)).toBeCloseTo(157 / 200 * 405 * (500 / 1.15) * 2.5 / 1000, 0);
    expect(r.all_checks_pass).toBe(false); // V_Ed > V_Rd,c is reported as failing that row
  });
});

describe('EC2 span/depth', () => {
  it('simply supported slab, ρ = ρ0 gives K·(11 + 1.5√fck)', () => {
    // fck 25: ρ0 = 0.005; As,req = 0.005·1000·150 = 750 → l/d = 11 + 7.5 = 18.5.
    const r = run(c.ec2Deflection, { span_m: 4, d_mm: 150, b_mm: 1000, As_req_mm2: 750, fck_MPa: 25, system: 'simply_supported' });
    expect(num(r.basic_l_over_d)).toBeCloseTo(18.5, 1);
    expect(num(r.l_over_d_actual)).toBeCloseTo(26.7, 1);
    expect(r.all_checks_pass).toBe(false);
  });
});

describe('pad footing', () => {
  it('plan size from the allowable pressure, then ULS checks', () => {
    // 800 kN SLS, q 200 kPa, h 500: net = 200 − 12 = 188 → B = √(800/188) = 2.06 → 2.10 m.
    const r = run(c.padFooting, { N_sls_kN: 800, q_allow_kPa: 200, column_mm: 300, h_mm: 500, fck_MPa: 25, N_uls_kN: 1120 });
    expect(num(r.B_m)).toBeCloseTo(2.1, 2);
    // pu = 1120/4.41 = 254.0; l = 0.9; m = 254·0.81/2 = 102.9 kNm/m.
    expect(num(r.M_Ed_kNm_per_m)).toBeCloseTo(102.9, 0);
    expect((r.checks as unknown[]).length).toBeGreaterThanOrEqual(4);
  });
});

describe('EN 1998-1 lateral force method', () => {
  it('ground C, Type 1, agR 0.15, class II, q 3.9, 12 m RC frame', () => {
    // T1 = 0.075·12^0.75 = 0.483 s (TB 0.2 < T ≤ TC 0.6): Sd = 0.15·1.15·2.5/3.9 = 0.1106 g;
    // λ = 0.85 (T ≤ 2TC, 4 storeys): Fb = 0.1106·10000·0.85 = 940 kN.
    const r = run(c.seismicEc8, { agR_g: 0.15, ground_type: 'C', importance_class: 'II', q: 3.9, W_kN: 10000, height_m: 12, structure_type: 'concrete_moment_frame', storeys: 4 });
    expect(num(r.T1_s)).toBeCloseTo(0.075 * Math.pow(12, 0.75), 3);
    expect(num(r.Sd_g)).toBeCloseTo(0.15 * 1.15 * 2.5 / 3.9, 4);
    expect(num(r.F_b_kN)).toBeCloseTo(0.15 * 1.15 * 2.5 / 3.9 * 10000 * 0.85, 0);
  });
});
