/**
 * Independent review of fix/building-2026-11-26 trades + R-31 + R-39 at 47e0256f.
 * Worked example: 10 m x 8 m single storey, 200 mm walls, 3.0 m storey,
 * 150 mm suspended slab, 2 columns 300 x 300, ground beam 200 x 450.
 * Copied into fix/building with the findings INVERTED (MF-1, MF-2, MF-4, MF-5 fixed):
 * each former `it.fails` / "recorded" case now asserts that the finding is gone.
 */
import { describe, it, expect } from 'vitest';
import { measuredWorks, WORKS_CATALOGUES, type WorksRow } from '@/lib/qs/works';
import { calibrate, quantify, ruleQuantity, type Measurement, type Quantity } from '@/lib/qs/takeoff';
import { TradeError } from '@/lib/qs/trades';
import * as c from '@/lib/wizard-api/buildingCalcs';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'linear' ? 'm' : kind === 'area' ? 'm²' : kind === 'volume' ? 'm³' : 'No', gross: net, deductions: 0, net, holes: [] });
const p = (value: number, source = 'REVIEW dwg S-01') => ({ value, source });
const run = (trade: Parameters<typeof measuredWorks>[0]['trade'], rows: WorksRow[]) => measuredWorks({ code: 'RV', description: 'REVIEW', trade, rows });

describe('Worked building 10 x 8 m: concrete (R-10)', () => {
  it('slab 80 x 0.15 = 12; beam 8 x 0.2 x 0.3 = 0.48; 2 cols 0.3 x 0.3 x 2.85 = 0.513; ground beam 36 x 0.2 x 0.45 = 3.24; RC wall 5 x 0.2 x 3 = 3 (m3)', () => {
    const out = run('concrete', [
      { item: 'slab', spec: 'C25/30', measurement: q('A1', 'area', 80), dims: [p(0.15)] },
      { item: 'beam', spec: 'C25/30 200x450', measurement: q('L1', 'linear', 8), dims: [p(0.2), p(0.3)] },
      { item: 'column', spec: 'C30/37 300x300', measurement: q('C1', 'count', 2), dims: [p(0.3), p(0.3), p(2.85)] },
      { item: 'groundBeam', spec: 'C25/30 200x450', measurement: q('L2', 'linear', 36), dims: [p(0.2), p(0.45)] },
      { item: 'wall', spec: 'C30/37 200', measurement: q('L3', 'linear', 5), dims: [p(0.2), p(3)] },
    ]);
    expect(out.map((l) => [l.unit, l.quantity])).toEqual([['m³', 12], ['m³', 0.48], ['m³', 0.513], ['m³', 3.24], ['m³', 3]]);
    expect(out[2].formula).toBe('measured count × column width × column depth × height to slab soffit');
  });
});

describe('Worked building: formwork (R-12)', () => {
  it('soffit 80; edge 36 x 0.15 = 5.4; beam 8 x (0.2 + 0.6) = 6.4; cols 2 x 2 x 0.6 x 2.85 = 6.84; ground beam 36 x 0.9 = 32.4; wall 5 x 3 x 2 = 30 (m2)', () => {
    const out = run('formwork', [
      { item: 'soffit', spec: 'ply', measurement: q('A1', 'area', 80), dims: [] },
      { item: 'slabEdge', spec: '150 edge', measurement: q('L0', 'linear', 36), dims: [p(0.15)] },
      { item: 'beam', spec: '200x450', measurement: q('L1', 'linear', 8), dims: [p(0.2), p(0.3)] },
      { item: 'column', spec: '300x300', measurement: q('C1', 'count', 2), dims: [p(0.3), p(0.3), p(2.85)] },
      { item: 'groundBeamSides', spec: 'both sides', measurement: q('L2', 'linear', 36), dims: [p(0.45)] },
      { item: 'wall', spec: 'both faces', measurement: q('L3', 'linear', 5), dims: [p(3), p(2)] },
    ]);
    expect(out.map((l) => [l.unit, l.quantity])).toEqual([['m²', 80], ['m²', 5.4], ['m²', 6.4], ['m²', 6.84], ['m²', 32.4], ['m²', 30]]);
  });
  it('faces must be a whole 1 or 2: 1.5 and 3 refused', () => {
    expect(() => run('formwork', [{ item: 'wall', spec: 'x', measurement: q('L', 'linear', 5), dims: [p(3), p(1.5)] }])).toThrow(/whole number/);
    expect(() => run('formwork', [{ item: 'wall', spec: 'x', measurement: q('L', 'linear', 5), dims: [p(3), p(3)] }])).toThrow(/outside 1–2/);
  });
});

describe('Worked building: earthworks (R-09)', () => {
  it('strip 80 x 0.15 = 12; bulk 80 x (100.50 - 100.20) = 24; fill 80 x (100.25 - 100.00) = 20; disposal 80 x 0.30 x 1.25 = 30 (m3)', () => {
    const out = run('earthworks', [
      { item: 'topsoil', spec: 'x', measurement: q('A1', 'area', 80), dims: [p(0.15)] },
      // MF-1: 80 × (100.50 − 0.15 strip − 100.20) = 80 × 0.15 = 12 (was 24: the strip was in it too).
      { item: 'bulkExcavation', spec: 'x', measurement: q('A2', 'area', 80), dims: [p(100.5), p(0.15), p(100.2)] },
      // 80 × (100.25 − (100.00 − 0)) = 20 with no strip on that area.
      { item: 'fill', spec: 'x', measurement: q('A3', 'area', 80), dims: [p(100.0), p(0), p(100.25)] },
      { item: 'disposal', spec: 'x', measurement: q('A4', 'area', 80), dims: [p(0.3), p(1.25, 'REVIEW SI report')] },
    ]);
    expect(out.map((l) => l.quantity)).toEqual([12, 12, 20, 24]);
    expect(out[3].inputs.join(' ')).toMatch(/loose volume for haulage, information only: 30 m³ at bulking 1\.25/);
  });
  it('equal levels refused for both cut and fill (no zero line); bulking 1.00 accepted (= bank)', () => {
    expect(() => run('earthworks', [{ item: 'bulkExcavation', spec: 'x', measurement: q('A', 'area', 10), dims: [p(5), p(0), p(5)] }])).toThrow(/must be above/);
    expect(() => run('earthworks', [{ item: 'fill', spec: 'x', measurement: q('A', 'area', 10), dims: [p(5), p(0), p(5)] }])).toThrow(/must be above/);
    expect(run('earthworks', [{ item: 'disposal', spec: 'x', measurement: q('A', 'area', 10), dims: [p(0.3), p(1)] }])[0].quantity).toBe(3);
  });
  it('FIXED (MF-1): strip and bulk excavation to levels no longer overlap - the catalogue must say levels are taken after the strip (or deduct the strip depth)', () => {
    const e = WORKS_CATALOGUES.earthworks;
    const text = [e.note, e.items.bulkExcavation.label, e.items.fill.label].join(' ');
    expect(text).toMatch(/strip(ped)? level|after (the )?(topsoil )?strip|less the strip|minus the strip/i);
  });
  it('FIXED (MF-2): disposal is measured as bank volume; bulking only records the loose volume', () => {
    expect(WORKS_CATALOGUES.earthworks.note).toMatch(/bank volumes/);
    expect(WORKS_CATALOGUES.earthworks.items.disposal.combine!.fn([0.3, 1.25])).toBeCloseTo(0.3, 9);
  });
});

describe('Worked building: painting, drainage, HVAC, external (R-15, R-18, R-20, R-21)', () => {
  it('painting by area takes the take-off net; coats not multiplied; length x height labelled gross', () => {
    const out = run('painting', [
      { item: 'wallArea', spec: '2 coats', measurement: q('A1', 'area', 98.4), dims: [] },
      { item: 'wallLength', spec: '2 coats', measurement: q('L1', 'linear', 34.4), dims: [p(2.85)] },
      { item: 'door', spec: '1+2 gloss', measurement: q('C1', 'count', 3), dims: [] },
    ]);
    expect(out.map((l) => [l.unit, l.quantity])).toEqual([['m²', 98.4], ['m²', 98.04], ['No', 3]]);
    expect(out[1].description).toMatch(/openings not deducted/);
  });
  it('drainage: trench 20 x 0.6 x 1.0 = 12 m3; bed 20 x 0.6 x 0.15 = 1.8 m3; 3 manholes', () => {
    const out = run('drainage', [
      { item: 'trench', spec: 'x', measurement: q('L1', 'linear', 20), dims: [p(0.6), p(1.0)] },
      { item: 'bedding', spec: 'x', measurement: q('L2', 'linear', 20), dims: [p(0.6), p(0.15)] },
      { item: 'manhole', spec: 'x', measurement: q('C1', 'count', 3), dims: [] },
    ]);
    expect(out.map((l) => l.quantity)).toEqual([12, 1.8, 3]);
  });
  it('HVAC: insulation 10 x 1.3 = 13 m2; no sizing outputs; external: 50 m2 paving, 50 x 0.2 = 10 m3 sub-base', () => {
    expect(run('hvac', [{ item: 'ductInsulation', spec: 'x', measurement: q('L1', 'linear', 10), dims: [p(1.3)] }])[0].quantity).toBe(13);
    expect(WORKS_CATALOGUES.hvac.note).toMatch(/does not size HVAC/);
    expect(run('external', [
      { item: 'paving', spec: 'x', measurement: q('A1', 'area', 50), dims: [] },
      { item: 'roadBase', spec: 'x', measurement: q('A2', 'area', 50), dims: [p(0.2)] },
    ]).map((l) => l.quantity)).toEqual([50, 10]);
  });
  it('FIXED (MF-4): works trades apply the same small-void rule as masonry/plaster (ruleQuantity)', () => {
    const refs = [{ a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, knownM: 10 }, { a: { x: 0, y: 0 }, b: { x: 0, y: 100 }, knownM: 10 }];
    const cal = calibrate('S', refs);
    // 10 x 3 m wall elevation with a 0.5 x 0.5 = 0.25 m2 grille hole.
    const m: Measurement = { id: 'W', kind: 'area', sheetId: 'S', label: 'wall', points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 30 }, { x: 0, y: 30 }], holes: [[{ x: 10, y: 10 }, { x: 15, y: 10 }, { x: 15, y: 15 }, { x: 10, y: 15 }]], metresPerUnit: cal.metresPerUnit, user: 'R', at: '2026-11-27T00:00:00Z', revision: 'A' };
    const qq = quantify(m);
    expect(qq.net).toBeCloseTo(29.75, 3);
    expect(ruleQuantity(qq, { name: 'SMM7', edition: '1998', voidNotDeductedUpToM2: 0.5 }).ruleQuantity).toBeCloseTo(30, 3);
    // Without the rule an area with openings is refused; with it, the 0.25 m² grille (≤ 0.5) is not deducted: 30 m².
    expect(() => run('painting', [{ item: 'wallArea', spec: 'x', measurement: qq, dims: [] }])).toThrow(/Voids not deducted up to is required/);
    expect(measuredWorks({ code: 'RV', description: 'REVIEW', trade: 'painting', rows: [{ item: 'wallArea', spec: 'x', measurement: qq, dims: [] }], voidRule: { value: 0.5, source: 'SMM7 1998' } })[0].quantity).toBeCloseTo(30, 3);
  });
});

describe('Works engine edge probes', () => {
  const ok = (dims: WorksRow['dims']) => () => run('concrete', [{ item: 'slab', spec: 'x', measurement: q('A', 'area', 10), dims }]);
  it('zero / negative / NaN / missing / unsourced dimension refused; zero measurement refused; prototype keys refused', () => {
    expect(ok([p(0)])).toThrow(/outside/);
    expect(ok([p(-0.15)])).toThrow(/outside/);
    expect(ok([p(Number.NaN)])).toThrow(/required/);
    expect(ok([undefined])).toThrow(/required/);
    expect(ok([{ value: 0.15, source: '  ' }])).toThrow(/give its source/);
    expect(() => run('concrete', [{ item: 'slab', spec: 'x', measurement: q('A', 'area', 0), dims: [p(0.15)] }])).toThrow(/zero/);
    expect(() => run('concrete', [{ item: 'slab', spec: 'x', measurement: q('A', 'area', -5), dims: [p(0.15)] }])).toThrow(/zero/);
    for (const k of ['constructor', '__proto__', 'toString']) expect(() => run('concrete', [{ item: k, spec: 'x', measurement: q('A', 'area', 10), dims: [] }])).toThrow(TradeError);
    expect(() => run('concrete', [])).toThrow(/at least one/);
    expect(() => run('concrete', [{ item: 'slab', spec: 'x', measurement: q('A', 'linear', 10), dims: [p(0.15)] }])).toThrow(/expected a area/);
  });
  it('one measurement cannot feed two items in the same trade', () => {
    expect(() => run('formwork', [
      { item: 'soffit', spec: 'x', measurement: q('A', 'area', 10), dims: [] },
      { item: 'soffit', spec: 'y', measurement: q('A', 'area', 10), dims: [] },
    ])).toThrow(/double counting/);
  });
  it('no line carries a rate or amount', () => {
    const [l] = run('external', [{ item: 'paving', spec: 'x', measurement: q('A1', 'area', 50), dims: [] }]);
    expect(Object.keys(l).sort()).toEqual(['code', 'description', 'formula', 'inputs', 'quantity', 'trade', 'unit']);
  });
});

type Col = Record<string, unknown> & { checks: Array<{ check: string; pass: boolean }>; overall: string; not_checked: string[]; error?: string; missing?: string[] };
const col = (b: Record<string, unknown>) => c.runCalc(c.rcColumn, b) as Col;

describe('R-31 RC column, EN 1992-1-1:2004 (independent hand calc)', () => {
  it('300 x 300, 4H16 = 804, C25/30, B500, N_Ed 800 kN, l0 3.0 m', () => {
    // fcd = 0.85 x 25 / 1.5 = 14.167; sigma_s = min(434.8, 0.002 x 200000) = 400 (6.1(5)).
    // N_Rd = 14.167 x 89,196 + 400 x 804 = 1,263,610 + 321,600 = 1,585.2 kN.
    // (BS 8110-style 0.567 fck Ac + 0.87 fyk As = 1,625.5 kN: the code's strain-limited form is 2.5 % more conservative.)
    // i = 300/sqrt12 = 86.60; lambda = 34.6; n = 800,000/(90,000 x 14.167) = 0.6275; lambda_lim = 20x0.7x1.1x0.7/sqrt(0.6275) = 13.6 -> slender.
    // As,min = max(0.1 x 800,000/434.78 = 184.0, 0.002 x 90,000 = 180) = 184; As,max = 3,600.
    const o = col({ b_mm: 300, h_mm: 300, As_mm2: 804, fck_MPa: 25, fyk_MPa: 500, NEd_kN: 800, l0_m: 3.0 });
    expect([o.N_Rd_kN, o.fcd_MPa, o.sigma_s_MPa, o.lambda, o.lambda_lim, o.As_max_mm2]).toEqual([1585.2, 14.17, 400, 34.6, 13.6, 3600]);
    expect(o.n).toBeCloseTo(0.627, 3);
    expect([184, 185]).toContain(o.As_min_mm2);
    expect(o.overall).toMatch(/^FAIL: 1 of 4/);
    expect(o.not_checked.join(' ')).toMatch(/second-order/);
  });
  it('fyk 400: sigma_s = fyd = 347.8 (yield governs, not the strain limit)', () => {
    const o = col({ b_mm: 400, h_mm: 400, As_mm2: 1257, fck_MPa: 30, fyk_MPa: 400, NEd_kN: 600, l0_m: 2.4 });
    expect(o.sigma_s_MPa).toBe(347.8);
  });
  it('a short, adequately reinforced column is PARTIAL, never PASS (e0 bending not checked)', () => {
    const o = col({ b_mm: 400, h_mm: 400, As_mm2: 1257, fck_MPa: 30, fyk_MPa: 500, NEd_kN: 600, l0_m: 2.4 });
    expect(o.overall).toMatch(/^PARTIAL/);
    expect(o.all_checks_pass).toBe(false);
  });
  it('As > 0.04 Ac fails 9.5.2(3); As below 0.002 Ac fails 9.5.2(2)', () => {
    expect(col({ b_mm: 300, h_mm: 300, As_mm2: 3700, fck_MPa: 30, fyk_MPa: 500, NEd_kN: 500, l0_m: 1.5 }).checks.find((x) => /As,max/.test(x.check))!.pass).toBe(false);
    expect(col({ b_mm: 300, h_mm: 300, As_mm2: 170, fck_MPa: 30, fyk_MPa: 500, NEd_kN: 200, l0_m: 1.5 }).checks.find((x) => /As,min/.test(x.check))!.pass).toBe(false);
  });
  it('missing / zero / negative / non-numeric / out-of-range inputs refused, never a verdict', () => {
    const base = { b_mm: 300, h_mm: 300, As_mm2: 804, fck_MPa: 25, fyk_MPa: 500, NEd_kN: 800, l0_m: 3.0 };
    for (const [k, v] of [['NEd_kN', undefined], ['NEd_kN', 0], ['NEd_kN', -10], ['l0_m', 0], ['As_mm2', 0], ['As_mm2', 90000], ['fck_MPa', 55], ['b_mm', '300abc'], ['h_mm', ''], ['fyk_MPa', null], ['l0_m', 'NaN']] as const) {
      const o = col({ ...base, [k]: v });
      expect(o.error, `${k}=${String(v)}`).toBeTruthy();
      expect(o.overall).toBeUndefined();
    }
  });
});

type Snd = { mass_kg_m2: number; Rw_dB: number; overall?: string; error?: string; checks?: unknown[] } & Record<string, unknown>;
const snd = (b: Record<string, unknown>) => c.runCalc(c.soundInsulation, b) as Snd;

describe('R-39 single-leaf airborne sound, EN 12354-1:2000 Annex B', () => {
  it('200 mm concrete at 2,300 = 460 kg/m2: Rw = 37.5 lg 460 - 42 = 57.9 dB; layers as JSON string accepted', () => {
    const o = snd({ layers: JSON.stringify([{ description: 'RC', thickness_m: 0.2, density_kg_m3: 2300 }]) });
    expect([o.mass_kg_m2, o.Rw_dB]).toEqual([460, 57.9]);
    expect(o.overall).toBeUndefined();
  });
  it('boundary: exactly 150 kg/m2 accepted (39.6 dB); 149.9 refused; above 1,500 refused', () => {
    expect(snd({ layers: [{ thickness_m: 0.1, density_kg_m3: 1500 }] }).Rw_dB).toBe(39.6);
    expect(snd({ layers: [{ thickness_m: 0.1, density_kg_m3: 1499 }] }).error).toMatch(/valid from 150/);
    expect(snd({ layers: [{ thickness_m: 0.7, density_kg_m3: 2400 }] }).error).toMatch(/1,500/);
  });
  it('missing / zero / negative / out-of-range layers refused; blank target = no check; passing target is PARTIAL', () => {
    expect(snd({}).error).toBeTruthy();
    expect(snd({ layers: [] }).error).toBeTruthy();
    expect(snd({ layers: [{ thickness_m: 0, density_kg_m3: 2000 }] }).error).toBeTruthy();
    expect(snd({ layers: [{ thickness_m: -0.2, density_kg_m3: 2000 }] }).error).toBeTruthy();
    expect(snd({ layers: [{ thickness_m: 0.2 }] }).error).toBeTruthy();
    expect(snd({ layers: [{ thickness_m: 0.2, density_kg_m3: 50 }] }).error).toBeTruthy();
    expect(snd({ layers: [{ thickness_m: 0.2, density_kg_m3: 2300 }], target_Rw_dB: '' }).checks).toBeUndefined();
    expect(snd({ layers: [{ thickness_m: 0.2, density_kg_m3: 2300 }], target_Rw_dB: 'abc' }).error).toBeTruthy();
    expect(snd({ layers: [{ thickness_m: 0.2, density_kg_m3: 2300 }], target_Rw_dB: 50 }).overall).toMatch(/^PARTIAL/);
  });
  it('FIXED (MF-5): without a target, the result says the Rw is an estimate (Annex B is an empirical estimate)', () => {
    const o = snd({ layers: [{ thickness_m: 0.2, density_kg_m3: 2300 }] });
    const { disclaimer: _d, ...rest } = o as Record<string, unknown>;
    expect(JSON.stringify(rest)).toMatch(/estimate/i);
  });
});
