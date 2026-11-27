/**
 * Trades review of 47e0256f (BUILDING-47e0256f-TRADES-REVIEW.md): MF-3, MF-4
 * (volume), MF-5, SF-1..SF-3 and the advisories. MF-1 / MF-2 hand-worked
 * examples are in building-r09-earthworks-2026-11-27.test.ts; the reviewer's
 * own test, with its findings inverted, is zz-review-building-47e0256f.test.ts.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { measuredWorks, WORKS_CATALOGUES } from '@/lib/qs/works';
import { calibrate, quantify, type Measurement, type Quantity } from '@/lib/qs/takeoff';
import * as c from '@/lib/wizard-api/buildingCalcs';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'linear' ? 'm' : kind === 'area' ? 'm²' : 'No', gross: net, deductions: 0, net, holes: [] });
const p = (value: number) => ({ value, source: 'TEST drawing S-201' });
const root = join(__dirname, '..', '..');

describe('MF-3: one beam / column intersection convention in concrete and formwork', () => {
  it('hand-worked: a 10 m grid line (centres) with 3 columns 300 × 300 → beam between faces 10 − 0.15 − 0.30 − 0.15 = 9.4 m', () => {
    // Concrete: beam 9.4 × 0.23 × 0.30 = 0.6486 → 0.649 m³; columns 3 × 0.3 × 0.3 × 2.85 = 0.7695 → 0.77 m³ (to slab soffit, through the beam depth).
    // Measuring the beam centre to centre (10 m) would add 0.6 × 0.23 × 0.30 = 0.0414 m³ that is already in the columns.
    const conc = measuredWorks({ code: 'C', description: 'TEST', trade: 'concrete', rows: [
      { item: 'beam', spec: 'TEST 230 × 450', measurement: q('L1', 'linear', 9.4), dims: [p(0.23), p(0.3)] },
      { item: 'column', spec: 'TEST 300 × 300', measurement: q('N1', 'count', 3), dims: [p(0.3), p(0.3), p(2.85)] },
    ] });
    expect(conc.map((l) => l.quantity)).toEqual([0.649, 0.77]);
    // Formwork: beam 9.4 × (0.23 + 2 × 0.30) = 7.802 m² (no soffit over the column heads); columns 3 × 2 × 0.6 × 2.85 = 10.26 m².
    const fw = measuredWorks({ code: 'F', description: 'TEST', trade: 'formwork', rows: [
      { item: 'beam', spec: 'TEST', measurement: q('L1', 'linear', 9.4), dims: [p(0.23), p(0.3)] },
      { item: 'column', spec: 'TEST', measurement: q('N1', 'count', 3), dims: [p(0.3), p(0.3), p(2.85)] },
    ] });
    expect(fw.map((l) => l.quantity)).toEqual([7.802, 10.26]);
  });
  it('the convention is stated in both trades and in the item labels', () => {
    expect(WORKS_CATALOGUES.concrete.note).toMatch(/BETWEEN COLUMN FACES; columns are measured to the slab soffit, through the beam depth\. So no slab–beam or beam–column volume is counted twice/);
    expect(WORKS_CATALOGUES.concrete.items.beam.label).toMatch(/BETWEEN COLUMN FACES/);
    expect(WORKS_CATALOGUES.formwork.items.beam.label).toMatch(/BETWEEN COLUMN FACES/);
    expect(WORKS_CATALOGUES.formwork.note).toMatch(/Concrete trade's convention/);
  });
});

describe('MF-4: the small-void rule for volume measurements too', () => {
  it('hand-worked: slab 10 × 8 × 0.15 with a 0.6 × 0.6 = 0.36 m² hole: geometric 11.946 m³; rule ≤ 0.5 m² → 12 m³ (hole not deducted)', () => {
    const SHEET = 'TEST';
    const cal = calibrate(SHEET, [{ a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, knownM: 10 }, { a: { x: 0, y: 0 }, b: { x: 0, y: 100 }, knownM: 10 }]);
    const m: Measurement = { id: 'V', kind: 'volume', sheetId: SHEET, label: 'TEST slab', depthM: 0.15, points: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 80 }, { x: 0, y: 80 }], holes: [[{ x: 10, y: 10 }, { x: 16, y: 10 }, { x: 16, y: 16 }, { x: 10, y: 16 }]], metresPerUnit: cal.metresPerUnit, user: 'TEST', at: '2026-11-27T00:00:00Z', revision: 'A' };
    const vol = quantify(m);
    expect(vol.net).toBe(11.946); // 12 − 0.36 × 0.15 = 12 − 0.054
    const out = measuredWorks({ code: 'E', description: 'TEST', trade: 'earthworks', voidRule: { value: 0.5, source: 'TEST NRM2 voids ≤ 0.50 m²' }, rows: [{ item: 'basementExcavation', spec: 'TEST', measurement: vol, dims: [] }] });
    expect(out[0].quantity).toBe(12);
    expect(out[0].inputs.join(' ')).toMatch(/1 of 1 opening\(s\) not deducted; geometric net 11\.946 m³, rule quantity 12 m³/);
    expect(measuredWorks({ code: 'E', description: 'TEST', trade: 'earthworks', voidRule: { value: 0, source: 'TEST: deduct all' }, rows: [{ item: 'basementExcavation', spec: 'TEST', measurement: vol, dims: [] }] })[0].quantity).toBe(11.946);
  });
});

describe('MF-5, SF-1..SF-3 and advisories', () => {
  it('MF-5: the Rw result says it is an estimate; SF-2: the 1,500 kg/m² limit is the tool’s own; EN ISO 12354-1:2017 supersession stated', () => {
    const o = c.soundInsulation({ layers: [{ thickness_m: 0.2, density_kg_m3: 2300 }] }) as { basis: string; method: string };
    expect(o.basis).toBe('Estimate: EN 12354-1 Annex B empirical mass law, not a tested or in-situ value');
    expect(o.method).toMatch(/superseded by EN ISO 12354-1:2017/);
    expect((c.soundInsulation({ layers: [{ thickness_m: 1, density_kg_m3: 2400 }, { thickness_m: 0.1, density_kg_m3: 2400 }] }) as { error: string }).error).toMatch(/this tool's own upper limit of 1,500 kg\/m² \(not a limit of EN 12354-1 Annex B\)/);
  });
  it('SF-1: the column form leaves As, N_Ed and l0 blank', () => {
    const html = readFileSync(join(root, 'public', 'eims-building-suite-v20261105.html'), 'utf8');
    const i = html.indexOf("{id:'en_col'");
    const block = html.slice(i, html.indexOf(']},', i));
    for (const k of ['As_mm2', 'NEd_kN', 'l0_m']) expect(block).toContain(`{k:'${k}',type:'number',def:'',`);
  });
  it('SF-3: the drainage note no longer points to an Earthworks backfill item that does not exist', () => {
    expect(WORKS_CATALOGUES.drainage.notMeasured.join(' ')).not.toContain('Backfilling and disposal of surplus (use Earthworks)');
    expect(WORKS_CATALOGUES.drainage.notMeasured[0]).toMatch(/add as your own item.*Disposal off site/);
  });
  it('advisories: the 150 mm column limit is the tool’s range; reverberation() has its doc comment back', () => {
    expect((c.rcColumn({ b_mm: 120, h_mm: 300, As_mm2: 400, fck_MPa: 25, fyk_MPa: 500, NEd_kN: 100, l0_m: 3 }) as { error: string }).error).toMatch(/this tool's range for a column section, not an EN 1992-1-1 clause/);
    const src = readFileSync(join(root, 'lib', 'wizard-api', 'buildingCalcs.ts'), 'utf8');
    expect(src).toMatch(/\/\*\* Reverberation time: Sabine T = 0\.161 V \/ ΣSα; Eyring T = 0\.161 V \/ \(−S·ln\(1 − ᾱ\)\)\. \*\/\r?\nexport function reverberation\(/);
  });
});
