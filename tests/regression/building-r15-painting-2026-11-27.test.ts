/**
 * Register R-15 (P1-D §4): finishes — painting and decoration were missing
 * (plaster and room finishes were already measured).
 */
import { describe, it, expect } from 'vitest';
import { measuredWorks, WORKS_CATALOGUES } from '@/lib/qs/works';
import { calibrate, quantify, type Measurement, type Quantity } from '@/lib/qs/takeoff';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'linear' ? 'm' : kind === 'area' ? 'm²' : 'No', gross: net, deductions: 0, net, holes: [] });

describe('R-15 painting and decoration', () => {
  it('hand-worked: a 4 × 3 m wall elevation with a 0.9 × 2.1 m door measured as an area → 12 − 1.89 = 10.11 m²', () => {
    const SHEET = 'TEST';
    const cal = calibrate(SHEET, [{ a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, knownM: 10 }, { a: { x: 0, y: 0 }, b: { x: 0, y: 100 }, knownM: 10 }]);
    const m: Measurement = { id: 'E1', kind: 'area', sheetId: SHEET, label: 'TEST elevation', points: [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 40, y: 30 }, { x: 0, y: 30 }], holes: [[{ x: 5, y: 0.5 }, { x: 14, y: 0.5 }, { x: 14, y: 21.5 }, { x: 5, y: 21.5 }]], metresPerUnit: cal.metresPerUnit, user: 'TEST', at: '2026-11-27T00:00:00Z', revision: 'A' };
    const area = quantify(m);
    expect(area.net).toBe(10.11);
    // MF-4: the door (1.89 m² > 0.5) is deducted under the small-void rule, as in masonry and plaster.
    const out = measuredWorks({ code: 'PD', description: 'TEST', trade: 'painting', voidRule: { value: 0.5, source: 'TEST rule: NRM2 voids ≤ 0.50 m²' }, rows: [{ item: 'wallArea', spec: 'TEST 1 mist + 2 coats emulsion', measurement: area, dims: [] }] });
    expect([out[0].unit, out[0].quantity]).toEqual(['m²', 10.11]);
  });
  it('hand-worked: 24 m of wall × 2.7 m = 64.8 m²; ceiling 36 m²; 24 m skirting; 3 doors — coats are described, not multiplied', () => {
    const out = measuredWorks({ code: 'PD', description: 'TEST room', trade: 'painting', rows: [
      { item: 'wallLength', spec: 'TEST 2 coats emulsion', measurement: q('L1', 'linear', 24), dims: [{ value: 2.7, source: 'TEST section A-A' }] },
      { item: 'ceiling', spec: 'TEST 2 coats matt', measurement: q('A1', 'area', 36), dims: [] },
      { item: 'trim', spec: 'TEST primer + 2 gloss', measurement: q('L2', 'linear', 24), dims: [] },
      { item: 'door', spec: 'TEST 900 × 2100 flush, both sides', measurement: q('C1', 'count', 3), dims: [] },
    ] });
    expect(out.map((l) => [l.unit, l.quantity])).toEqual([['m²', 64.8], ['m²', 36], ['m', 24], ['No', 3]]);
    expect(out[0].description).toMatch(/2 coats emulsion/);
    expect(WORKS_CATALOGUES.painting.note).toMatch(/coats is stated in the description, not multiplied/);
  });
});
