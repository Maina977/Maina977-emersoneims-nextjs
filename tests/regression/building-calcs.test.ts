/**
 * Building Suite calculators — hand-checked values (2026-10-19 tool audit).
 * Before this audit every calculator ignored the keys the screens send and
 * computed from defaults, so the answer never changed with the input.
 * Each expected value below was worked by hand from the cited clause.
 */
import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import * as c from '@/lib/wizard-api/buildingCalcs';
import { dispatch } from '@/lib/wizard-api/dispatcher';

const ok = <T,>(v: T) => {
  expect(c.isCalcError(v)).toBe(false);
  return v as Exclude<T, c.CalcError> & Record<string, number>;
};

describe('building calculators — hand checks', () => {
  it('bolt M12 grade 4.6, one shear plane through threads: Fv,Rd = 0.6·400·84.3/1.25 = 16.2 kN', () => {
    const r = ok(c.steelBolt({ designation: 'M12', grade: '4.6', shear_planes: 1, threads_in_shear: true }));
    expect(r.Fv_Rd_kN).toBeCloseTo(16.19, 2);
  });

  it('bolt M20 8.8: Fv,Rd 94.08 kN, Ft,Rd 141.12 kN; input changes the answer', () => {
    const r = ok(c.steelBolt({ designation: 'M20', grade: '8.8' }));
    expect(r.Fv_Rd_kN).toBeCloseTo(94.08, 2);
    expect(r.Ft_Rd_kN).toBeCloseTo(141.12, 2);
    const two = ok(c.steelBolt({ designation: 'M20', grade: '8.8', shear_planes: 2 }));
    expect(two.Fv_Rd_kN).toBeCloseTo(188.16, 2);
  });

  it('rational method: 2 ha, C 0.9, 120 mm/h → 0.600 m³/s', () => {
    expect(ok(c.rationalRunoff({ area_ha: 2, runoff_c: 0.9, rainfall_intensity_mm_hr: 120 })).Q_m3_s).toBeCloseTo(0.6, 3);
  });

  it('RC beam 300×450 (d), As 1500, C30, B500: M_Rd ≈ 251.8 kNm', () => {
    const r = ok(c.rcBeam({ b_mm: 300, h_mm: 500, d_mm: 450, As_mm2: 1500, fck_MPa: 30, fyk_MPa: 500, Med_kNm: 180 }));
    expect(r.M_Rd_kNm).toBeCloseTo(251.8, 1);
    expect(r.utilisation).toBeCloseTo(0.715, 2);
  });

  it('bearing, φ 30°, c 0, γ 18, B 1 m, Df 1 m, strip: Nq 18.40, Nγ 22.40, qu ≈ 532.8 kPa', () => {
    const r = ok(c.bearingCapacity({ c_kPa: 0, phi_deg: 30, gamma_kN_m3: 18, B_m: 1, Df_m: 1, shape: 'strip' }));
    expect(r.Nq).toBeCloseTo(18.4, 1);
    expect(r.Ngamma).toBeCloseTo(22.4, 1);
    expect(r.qu_kPa).toBeCloseTo(532.8, 0);
  });

  it('bearing reads Df_m (the form key) — deeper footing, higher capacity', () => {
    const a = ok(c.bearingCapacity({ c_kPa: 10, phi_deg: 30, gamma_kN_m3: 18, B_m: 2, Df_m: 0.5, shape: 'strip' }));
    const b = ok(c.bearingCapacity({ c_kPa: 10, phi_deg: 30, gamma_kN_m3: 18, B_m: 2, Df_m: 1.5, shape: 'strip' }));
    expect(b.qu_kPa).toBeGreaterThan(a.qu_kPa);
  });

  it('ASCE 7-22 wind, 115 mph, 33 ft, exposure C: Kz ≈ 1.00, qz ≈ 33.9 psf', () => {
    const r = ok(c.windAsce7({ V_mph: 115, height_ft: 33, exposure: 'C', enclosure: 'enclosed' }));
    expect(r.Kz).toBeCloseTo(1.0, 2);
    expect(r.qz_psf).toBeCloseTo(33.9, 0);
  });

  it('EN 1991-1-4 wind, vb 24 m/s, 10 m, terrain II: qp ≈ 847 Pa (ce ≈ 2.35)', () => {
    const r = ok(c.windEurocode({ vb_ms: 24, height_m: 10, terrain_category: 'II' }));
    expect(r.qp_Pa).toBeGreaterThan(840);
    expect(r.qp_Pa).toBeLessThan(855);
  });

  it('ASCE 7 ELF, steel MF 48 ft: Ta 0.618 s, Cs governed by period limit, V ≈ 900 kN', () => {
    const r = ok(c.seismicElf({ SDS: 1, SD1: 0.5, R: 8, Ie: 1, W_kN: 8896, height_ft: 48, structure_type: 'steel_moment_frame' }));
    expect(r.T_s).toBeCloseTo(0.618, 2);
    expect(r.V_kN).toBeGreaterThan(890);
    expect(r.V_kN).toBeLessThan(910);
  });

  it('average daylight factor: 6 m² window, ff 0.7, T 0.68, θ 65°, M 0.9, A 120, R 0.5 → 1.86%', () => {
    expect(ok(c.daylightAdf({ T_glass: 0.68, window_area_m2: 6, sky_angle_deg: 65, total_internal_surface_m2: 120, avg_reflectance: 0.5, maintenance_factor: 0.9, frame_factor: 0.7 })).ADF_pct).toBeCloseTo(1.86, 2);
  });

  it('U-value: 100 brick + 100 mineral wool, horizontal flow → 0.342 W/m²K', () => {
    const r = ok(c.uValue({ heat_flow: 'horizontal', layers: '[{"thickness_m":0.1,"lambda_W_mK":0.84},{"thickness_m":0.1,"lambda_W_mK":0.038}]' }));
    expect(r.U_W_m2K).toBeCloseTo(0.342, 3);
  });

  it('Sabine: 200 m³, ΣSα 31.2 → T60 1.03 s', () => {
    const r = ok(c.reverberation({ volume_m3: 200, method: 'sabine', surfaces: [{ area_m2: 80, alpha: 0.04 }, { area_m2: 80, alpha: 0.3 }, { area_m2: 40, alpha: 0.1 }] }));
    expect(r.T60_s).toBeCloseTo(1.03, 2);
  });

  it('Kirpich: 300 m at 2% → 7.1 min', () => {
    expect(ok(c.kirpich({ length_m: 300, slope_m_per_m: 0.02 })).Tc_min).toBeCloseTo(7.1, 1);
  });

  it('sun position at the equator, June solstice, noon UTC on Greenwich: altitude ≈ 66.6°, sun to the north', () => {
    const r = ok(c.sunPosition({ lat: 0, lng: 0, datetime_utc: '2026-06-21T12:00:00Z' }));
    expect(r.altitude_deg).toBeGreaterThan(66);
    expect(r.altitude_deg).toBeLessThan(67);
    expect(r.azimuth_deg < 5 || r.azimuth_deg > 355).toBe(true);
  });
});

describe('building calculators — missing input is refused, never defaulted', () => {
  it.each([
    ['rational without area', () => c.rationalRunoff({ runoff_c: 0.9, rainfall_intensity_mm_hr: 120 }), 'area_ha'],
    ['wind without exposure', () => c.windAsce7({ V_mph: 115, height_ft: 30 }), 'exposure'],
    ['bolt without grade', () => c.steelBolt({ designation: 'M20' }), 'grade'],
    ['bearing without Df', () => c.bearingCapacity({ c_kPa: 0, phi_deg: 30, gamma_kN_m3: 18, B_m: 1 }), 'Df_m'],
    ['RC beam without As', () => c.rcBeam({ b_mm: 300, d_mm: 450, fck_MPa: 30, fyk_MPa: 500 }), 'As_mm2'],
  ])('%s', (_n, fn, field) => {
    const r = fn();
    expect(c.isCalcError(r)).toBe(true);
    expect((r as c.CalcError).missing).toContain(field);
  });

  it('dispatcher answers 400 naming the field', async () => {
    const req = new NextRequest('http://localhost/api/hydro/rational', {
      method: 'POST', body: JSON.stringify({ runoff_c: 0.9 }), headers: { 'content-type': 'application/json' },
    });
    const res = await dispatch(req, ['rational'], 'hydro');
    expect(res.status).toBe(400);
    const j = await res.json();
    expect(j.success).toBe(false);
    expect(j.missing).toEqual(expect.arrayContaining(['area_ha', 'rainfall_intensity_mm_hr']));
  });

  it.each([
    ['/api/eng/frame/analyze', 'eng', ['frame', 'analyze']],
    ['/api/bim/build', 'bim', ['build']],
    ['/api/generate', 'generate', []],
    ['/api/unknown/thing', 'unknown', ['thing']],
  ])('%s is 501, not a fake success', async (path, prefix, segs) => {
    const req = new NextRequest(`http://localhost${path}`, { method: 'POST', body: '{}', headers: { 'content-type': 'application/json' } });
    const res = await dispatch(req, segs as string[], prefix as string);
    expect(res.status).toBe(501);
  });
});

describe('building calculators — report fields', () => {
  it('RC beam As,req for 120 kNm on 300×450 C30/B500: K 0.0658, z 0.938d = 422.2 mm, As = 120e6/(434.8·422.2) ≈ 654 mm²', () => {
    const r = c.rcBeam({ b_mm: 300, h_mm: 500, d_mm: 450, As_mm2: 1500, fck_MPa: 30, fyk_MPa: 500, Med_kNm: 120 }) as unknown as Record<string, number>;
    expect(r.K).toBeCloseTo(0.0658, 3);
    expect(r.As_required_mm2).toBeGreaterThanOrEqual(653);
    expect(r.As_required_mm2).toBeLessThanOrEqual(655);
  });
  it('Eurocode wind also reports qp in kPa', () => {
    const r = c.windEurocode({ vb_ms: 24, height_m: 10, terrain_category: 'II' }) as unknown as Record<string, number>;
    expect(r.qp_kPa).toBeCloseTo(r.qp_Pa / 1000, 2);
  });
});

describe('building calculators — supplied-but-invalid optional inputs are refused (2026-10-19 re-audit)', () => {
  it.each([
    ['blank shear_planes', () => c.runCalc(c.steelBolt, { designation: 'M20', grade: '8.8', shear_planes: '' }), 'shear_planes'],
    ['Kzt below 1', () => c.runCalc(c.windAsce7, { V_mph: 115, height_ft: 30, exposure: 'C', Kzt: 0.5 }), 'Kzt'],
    ['unknown structure_type', () => c.runCalc(c.seismicElf, { SDS: 1, SD1: 0.5, R: 8, Ie: 1, W_kN: 1000, height_ft: 48, structure_type: 'timber' }), 'structure_type'],
    ['unknown enclosure', () => c.runCalc(c.windAsce7, { V_mph: 115, height_ft: 30, exposure: 'C', enclosure: 'tent' }), 'enclosure'],
    ['unknown reverberation method', () => c.runCalc(c.reverberation, { volume_m3: 100, method: 'magic', surfaces: [{ area_m2: 10, alpha: 0.5 }] }), 'method'],
  ])('%s', (_n, fn, field) => {
    const r = fn();
    expect(c.isCalcError(r)).toBe(true);
    expect((r as c.CalcError).missing).toContain(field);
  });

  it('a user period above Cu·Ta is capped (ASCE 7-22 §12.8.2): steel MF 48 ft, SD1 0.5 → T ≤ 1.4 × 0.618', () => {
    const r = c.runCalc(c.seismicElf, { SDS: 1, SD1: 0.5, R: 8, Ie: 1, W_kN: 8896, height_ft: 48, structure_type: 'steel_moment_frame', T: 3 }) as Record<string, number>;
    expect(r.T_s).toBeCloseTo(1.4 * 0.618, 2);
  });
});

describe('seismic period input (2026-10-19 re-audit 2)', () => {
  it('a non-numeric T is refused', () => {
    const r = c.runCalc(c.seismicElf, { SDS: 1, SD1: 0.5, R: 8, Ie: 1, W_kN: 1000, height_ft: 48, structure_type: 'steel_moment_frame', T: 'abc' });
    expect(c.isCalcError(r)).toBe(true);
  });
  it('Cu interpolates: SD1 0.25 → 1.45', () => {
    // Ta = 0.028·48^0.8 = 0.6178 s; cap = 1.45 × 0.6178 = 0.896 s
    const r = c.runCalc(c.seismicElf, { SDS: 1, SD1: 0.25, R: 8, Ie: 1, W_kN: 1000, height_ft: 48, structure_type: 'steel_moment_frame', T: 3 }) as unknown as Record<string, number>;
    expect(r.T_s).toBeCloseTo(0.896, 2);
  });
});

describe('blank optional inputs (2026-10-20)', () => {
  it('a cleared shear_planes box (null) is refused, not defaulted to 1', () => {
    const r = c.runCalc(c.steelBolt, { designation: 'M20', grade: '8.8', shear_planes: null });
    expect(c.isCalcError(r)).toBe(true);
    expect((r as c.CalcError).missing).toContain('shear_planes');
  });
});

describe('physical bounds (2026-10-20 audit)', () => {
  const err = (fn: (b: c.Body) => unknown, b: c.Body) => expect(c.isCalcError(c.runCalc(fn, b))).toBe(true);
  it('daylight: transmittance > 1, sky angle > 90° and maintenance > 1 are refused', () => {
    const base = { T_glass: 0.7, window_area_m2: 4, sky_angle_deg: 65, total_internal_surface_m2: 120, avg_reflectance: 0.5, maintenance_factor: 0.9 };
    err(c.daylightAdf, { ...base, T_glass: 5 });
    err(c.daylightAdf, { ...base, sky_angle_deg: 200 });
    err(c.daylightAdf, { ...base, maintenance_factor: 3 });
  });
  it('seismic: negative spectral accelerations are refused', () => {
    err(c.seismicElf, { SDS: -1, SD1: 0.5, R: 8, Ie: 1, W_kN: 1000, height_ft: 48, structure_type: 'other' });
  });
  it('RC beam: d ≥ h and a compression zone below the steel are refused', () => {
    err(c.rcBeam, { b_mm: 300, d_mm: 600, h_mm: 500, As_mm2: 1000, fck_MPa: 30, fyk_MPa: 500 });
    err(c.rcBeam, { b_mm: 300, d_mm: 450, h_mm: 500, As_mm2: 15000, fck_MPa: 30, fyk_MPa: 500 });
  });
  it('bolt: negative plate thickness or edge distance is refused', () => {
    err(c.steelBolt, { designation: 'M20', grade: '8.8', t_ply_mm: -10, fu_ply_MPa: 430, e1_mm: 40, d_hole_mm: 22 });
    err(c.steelBolt, { designation: 'M20', grade: '8.8', t_ply_mm: 10, fu_ply_MPa: 430, e1_mm: -40, d_hole_mm: 22 });
  });
  it('bearing: negative soil unit weight is refused', () => {
    err(c.bearingCapacity, { c_kPa: 10, phi_deg: 30, gamma_kN_m3: -18, B_m: 2, Df_m: 1 });
  });
  it('ASCE 7 Kz never exceeds 2.41 (z capped at zg)', () => {
    const r = c.runCalc(c.windAsce7, { V_mph: 115, height_ft: 5000, exposure: 'C' }) as Record<string, number>;
    expect(r.Kz).toBeLessThanOrEqual(2.41);
  });
  it('EN 1991-1-4 refuses heights above 200 m', () => {
    err(c.windEurocode, { vb_ms: 30, height_m: 350, terrain_category: 'II' });
  });
});

describe('physical bounds, round 2 (2026-10-20)', () => {
  const isErr = (fn: (b: c.Body) => unknown, b: c.Body) => c.isCalcError(c.runCalc(fn, b));
  it('RC beam refuses a negative M_Ed', () => {
    expect(isErr(c.rcBeam, { b_mm: 300, d_mm: 450, h_mm: 500, As_mm2: 1000, fck_MPa: 30, fyk_MPa: 500, Med_kNm: -100 })).toBe(true);
  });
  it('bolt refuses e1 below 1.2·d0, p1 below 2.2·d0 and negative loads', () => {
    const base = { designation: 'M20', grade: '8.8', t_ply_mm: 10, fu_ply_MPa: 430, e1_mm: 40, p1_mm: 60, d_hole_mm: 22 };
    expect(isErr(c.steelBolt, { ...base, e1_mm: 5 })).toBe(true);
    expect(isErr(c.steelBolt, { ...base, p1_mm: 30 })).toBe(true);
    expect(isErr(c.steelBolt, { ...base, Fv_Ed_kN: -10 })).toBe(true);
    expect(isErr(c.steelBolt, base)).toBe(false);
  });
  it('rational method warns above 80 ha; Kirpich refuses slope ≥ 1 and warns outside 3–10%', () => {
    const q = c.runCalc(c.rationalRunoff, { runoff_c: 0.5, rainfall_intensity_mm_hr: 50, area_ha: 5000 }) as Record<string, unknown>;
    expect(String(q.warning)).toMatch(/80 ha/);
    expect(isErr(c.kirpich, { length_m: 500, slope_m_per_m: 2 })).toBe(true);
    const k = c.runCalc(c.kirpich, { length_m: 500, slope_m_per_m: 0.2 }) as Record<string, unknown>;
    expect(String(k.warning)).toMatch(/3–10%/);
  });
});

describe('metric inputs (2026-10-20)', () => {
  it('seismic ELF accepts height in metres: 14.63 m ≈ 48 ft gives the same Ta', () => {
    const ft = c.runCalc(c.seismicElf, { SDS: 1, SD1: 0.5, R: 8, Ie: 1, W_kN: 8896, height_ft: 48, structure_type: 'steel_moment_frame' }) as Record<string, number>;
    const m = c.runCalc(c.seismicElf, { SDS: 1, SD1: 0.5, R: 8, Ie: 1, W_kN: 8896, height_m: 14.6304, structure_type: 'steel_moment_frame' }) as Record<string, number>;
    expect(m.T_s).toBeCloseTo(ft.T_s, 3);
    expect(m.V_kN).toBeCloseTo(ft.V_kN, 0);
  });
  it('ASCE wind accepts m/s and metres', () => {
    const imp = c.runCalc(c.windAsce7, { V_mph: 115, height_ft: 30, exposure: 'C' }) as Record<string, number>;
    const si = c.runCalc(c.windAsce7, { V_ms: 115 * 0.44704, height_m: 30 * 0.3048, exposure: 'C' }) as Record<string, number>;
    expect(si.qz_psf).toBeCloseTo(imp.qz_psf, 1);
  });
});

describe('round 3 bounds (2026-10-20)', () => {
  const isErr = (fn: (b: c.Body) => unknown, b: c.Body) => c.isCalcError(c.runCalc(fn, b));
  it('RC beam refuses a section whose steel would not yield (x/d > 0.617 for B500)', () => {
    // b 300, d 450, fck 30, fyk 500, As 3000 → x = 3000·434.8/(0.8·300·17) = 319.7 mm, x/d = 0.71
    expect(isErr(c.rcBeam, { b_mm: 300, d_mm: 450, h_mm: 500, As_mm2: 3000, fck_MPa: 30, fyk_MPa: 500 })).toBe(true);
    // As 1000 → x/d 0.237: still a normal result
    expect(isErr(c.rcBeam, { b_mm: 300, d_mm: 450, h_mm: 500, As_mm2: 1000, fck_MPa: 30, fyk_MPa: 500 })).toBe(false);
  });
  it('reverberation refuses a negative surface area', () => {
    expect(isErr(c.reverberation, { volume_m3: 200, surfaces: [{ area_m2: -50, alpha: 0.1 }, { area_m2: 80, alpha: 0.3 }] })).toBe(true);
  });
  it('legacy RC and bolt inputs are validated', () => {
    expect(isErr(c.rcBeam, { w_kN_m: -10, L_m: 5 })).toBe(true);
    expect(isErr(c.steelBolt, { fub_MPa: -800, As_mm2: 245 })).toBe(true);
  });
  it('a metric wind error names the metric fields', () => {
    const r = c.runCalc(c.windAsce7, { V_ms: 0, height_m: 9, exposure: 'C' }) as c.CalcError;
    expect(r.error).toMatch(/V_ms|m\/s/);
  });
});

describe('bolt hole default (2026-10-20)', () => {
  it('M24 with no hole given uses the 26 mm normal clearance hole', () => {
    const r = c.runCalc(c.steelBolt, { designation: 'M24', grade: '8.8', t_ply_mm: 12, fu_ply_MPa: 430, e1_mm: 50, p1_mm: 70, d_hole_mm: null }) as Record<string, unknown>;
    expect(c.isCalcError(r)).toBe(false);
    expect((r.assumptions as string[]).join(' ')).toMatch(/26 mm/);
  });
});

describe('Building Suite audit round 4 (2026-10-25)', () => {
  const run = (fn: (b: Record<string, unknown>) => unknown, b: Record<string, unknown>) => c.runCalc(fn as never, b) as Record<string, unknown>;
  it('every successful result carries the desk-check disclaimer', () => {
    const r = run(c.rationalRunoff, { runoff_c: 0.8, rainfall_intensity_mm_hr: 100, area_ha: 2 });
    expect(String(r.disclaimer)).toMatch(/not a design/i);
    expect(run(c.rationalRunoff, { runoff_c: 0.8 }).disclaimer).toBeUndefined();
  });
  it('refuses implausible inputs', () => {
    expect(run(c.seismicElf, { SDS: 1, SD1: 0.6, R: 500, Ie: 1, W_kN: 1000, height_ft: 60 }).error).toMatch(/R above 8/);
    expect(run(c.seismicElf, { SDS: 1, SD1: 0.6, R: 8, Ie: 9, W_kN: 1000, height_ft: 60 }).error).toMatch(/Ie must be/);
    expect(run(c.windEurocode, { vb_ms: 900, height_m: 10, terrain_category: 'II' }).error).toMatch(/70 m\/s/);
    expect(run(c.rationalRunoff, { runoff_c: 0.8, rainfall_intensity_mm_hr: 100000, area_ha: 2 }).error).toMatch(/500 mm\/h/);
    expect(run(c.kirpich, { length_m: 5_000_000, slope_m_per_m: 0.05 }).error).toMatch(/100 km/);
    expect(run(c.uValue, { layers: [{ thickness_m: 200, lambda_W_mK: 0.04 }] }).error).toMatch(/metres/);
    expect(run(c.rcBeam, { b_mm: 300, d_mm: 450, As_mm2: 1257, fck_MPa: 30, fyk_MPa: 50000 }).error).toMatch(/fyk_MPa/);
  });
  it('warns when ELF may not be permitted and when T60 is implausible', () => {
    expect(String(run(c.seismicElf, { SDS: 1, SD1: 0.6, R: 8, Ie: 1, W_kN: 1000, height_ft: 900 }).warning)).toMatch(/3\.5·Ts/);
    expect(String(run(c.reverberation, { volume_m3: 200, absorption_m2_sabin: 1 }).warning)).toMatch(/longer than any furnished room/);
    expect(String(run(c.reverberation, { volume_m3: 200, absorption_m2_sabin: 46, method: 'eyring' }).note)).toMatch(/Sabine was used/);
  });
  it('checks bolt punching shear and the Table 3.3 maxima', () => {
    const r = run(c.steelBolt, { designation: 'M20', grade: '8.8', t_ply_mm: 10, fu_ply_MPa: 430, e1_mm: 40, p1_mm: 70, Ft_Ed_kN: 50 });
    // 0.6·π·(1.6·20)·10·430/1.25 = 207.5 kN
    expect(Number(r.Bp_Rd_kN)).toBeCloseTo(207.5, 0);
    const checks = (r.checks as Array<{ check: string }>).map((x) => x.check).join(' | ');
    expect(checks).toMatch(/punching/);
    expect(checks).toMatch(/e1 ≤ 4t \+ 40/);
  });
});
