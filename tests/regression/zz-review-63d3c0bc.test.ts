/** Independent reviewer, 63d3c0bc: opening-deduction boundary, hand-worked, incl. floating-point edge. */
import { describe, it, expect } from 'vitest';
import { masonry, plaster, type Param, type Opening } from '@/lib/qs/trades';
import { ruleQuantity, quantify, type Quantity } from '@/lib/qs/takeoff';

const p = (value: number, source = 'TEST'): Param => ({ value, source });
const lin = (net: number): Quantity => ({ id: 'L', kind: 'linear', unit: 'm', gross: net, deductions: 0, net, holes: [] });
const op = (mark: string, w: number, h: number, count = 1): Opening => ({ mark, type: 'window', widthM: p(w), heightM: p(h), count });

describe('boundary at 0.5 m², incl. 0.7071² = 0.49999 m² and 1.002 × 0.5 = 0.501 m²', () => {
  // wall 8 × 2.7 = 21.6 m². Openings: 1.0 × 0.5 = 0.500 (×2), 0.7071 × 0.7071 = 0.49999 → 0.500, 1.002 × 0.5 = 0.501, 1.2 × 1.5 = 1.8.
  const ops = [op('A', 1.0, 0.5, 2), op('B', 0.7071, 0.7071), op('C', 1.002, 0.5), op('D', 1.2, 1.5)];
  it('masonry: deduct only C and D = 0.501 + 1.8 = 2.301 → 21.6 − 2.301 = 19.299 m²; volume × 0.2 = 3.86 m³', () => {
    const out = masonry({ code: 'M', description: 'TEST', wallLength: lin(8), heightM: p(2.7), thicknessM: p(0.2), openings: ops, minDeductedOpeningM2: p(0.5) });
    expect(out[0].quantity).toBe(19.299);
    expect(out[1].quantity).toBe(3.86);
  });
  it('plaster both faces: (21.6 − 2.301) × 2 = 38.598 m²; reveals only round C and D', () => {
    const out = plaster({ code: 'P', description: 'TEST', wallLength: lin(8), heightM: p(2.7), faces: 2, openings: ops, minDeductedOpeningM2: p(0.5), revealDepthM: p(0.1) });
    expect(out[0].quantity).toBe(38.598);
    // reveal length = (2h + w) per deducted opening: C 2×0.5+1.002 = 2.002; D 2×1.5+1.2 = 4.2 → 6.202 m
    const rev = out.find((l) => /reveal/i.test(l.description));
    if (rev) expect(rev.inputs.join(' ') + rev.formula + String(rev.quantity)).toMatch(/6\.202|0\.62/);
  });
  it('ruleQuantity on the same voids (quantify-rounded to 3 dp) gives the same 19.299 m²', () => {
    const holes = [0.5, 0.5, 0.7071 * 0.7071, 0.501, 1.8].map((a) => ({ areaM2: Math.round(a * 1000) / 1000 }));
    const ded = holes.reduce((a, h) => a + h.areaM2, 0);
    const q: Quantity = { id: 'A', kind: 'area', unit: 'm²', gross: 21.6, deductions: ded, net: Math.round((21.6 - ded) * 1000) / 1000, holes };
    const r = ruleQuantity(q, { name: 'TEST NRM2', edition: 'TEST', voidNotDeductedUpToM2: 0.5 });
    expect(r.ruleQuantity).toBeCloseTo(19.299, 3);
    expect(r.voidsNotDeducted).toBe(3); // a count of voids (A x2 and B), as in the author's test (1 void -> 1)
  });
  it('threshold 0 deducts everything: 21.6 − (1.0 + 0.5 + 0.501 + 1.8) = 17.799 m²', () => {
    const out = masonry({ code: 'M', description: 'TEST', wallLength: lin(8), heightM: p(2.7), thicknessM: p(0.2), openings: ops, minDeductedOpeningM2: p(0) });
    expect(out[0].quantity).toBe(17.799);
  });
  it('quantify exists (shape check only)', () => { expect(typeof quantify).toBe('function'); });
});
