/**
 * Register R-12 (P1-D §4): formwork FROM MEASURED CONTACT AREAS ONLY (it
 * was "not measured here"). Same frame as the R-10 concrete test.
 */
import { describe, it, expect } from 'vitest';
import { measuredWorks, WORKS_CATALOGUES } from '@/lib/qs/works';
import type { Quantity } from '@/lib/qs/takeoff';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'linear' ? 'm' : kind === 'area' ? 'm²' : 'No', gross: net, deductions: 0, net, holes: [] });
const p = (value: number) => ({ value, source: 'TEST drawing S-201' });

describe('R-12 formwork contact areas', () => {
  it('hand-worked frame: soffit 96 m²; edges 40 m × 0.15 = 6 m²; beams 40 × (0.23 + 2 × 0.30) = 33.2 m²; 9 columns × 2 × (0.3 + 0.3) × 2.85 = 30.78 m²', () => {
    const out = measuredWorks({ code: 'F', description: 'TEST first floor', trade: 'formwork', rows: [
      { item: 'soffit', spec: 'TEST plywood, propping ≤ 3.5 m', measurement: q('A1', 'area', 96), dims: [] },
      { item: 'slabEdge', spec: 'TEST edge of 150 slab', measurement: q('L1', 'linear', 40), dims: [p(0.15)] },
      { item: 'beam', spec: 'TEST 230 × 450 beam', measurement: q('L2', 'linear', 40), dims: [p(0.23), p(0.3)] },
      { item: 'column', spec: 'TEST 300 × 300', measurement: q('N1', 'count', 9), dims: [p(0.3), p(0.3), p(2.85)] },
    ] });
    expect(out.map((l) => [l.unit, l.quantity])).toEqual([['m²', 96], ['m²', 6], ['m²', 33.2], ['m²', 30.78]]);
    expect(out[2].formula).toBe('measured linear × (beam width + 2 × downstand)');
    expect(out[3].formula).toBe('measured count × 2 × (column width + column depth) × height');
  });
  it('hand-worked: wall 15 m × 3.0 × 2 faces = 90 m²; ground beam 48 m × 2 × 0.45 = 43.2 m²', () => {
    const out = measuredWorks({ code: 'F2', description: 'TEST', trade: 'formwork', rows: [
      { item: 'wall', spec: 'TEST both faces', measurement: q('L3', 'linear', 15), dims: [p(3), p(2)] },
      { item: 'groundBeamSides', spec: 'TEST both sides', measurement: q('L4', 'linear', 48), dims: [p(0.45)] },
    ] });
    expect(out.map((l) => l.quantity)).toEqual([90, 43.2]);
  });
  it('faces must be 1 or 2, a whole number; contact areas only, temporary works not designed', () => {
    expect(() => measuredWorks({ code: 'X', description: 'TEST', trade: 'formwork', rows: [{ item: 'wall', spec: 'TEST', measurement: q('L', 'linear', 5), dims: [p(3), p(1.5)] }] })).toThrow(/must be a whole number/);
    expect(() => measuredWorks({ code: 'X', description: 'TEST', trade: 'formwork', rows: [{ item: 'wall', spec: 'TEST', measurement: q('L', 'linear', 5), dims: [p(3), p(3)] }] })).toThrow(/outside 1–2/);
    expect(WORKS_CATALOGUES.formwork.note).toMatch(/contact areas only/);
    expect(WORKS_CATALOGUES.formwork.notMeasured.join(' ')).toMatch(/temporary works designer/);
  });
});
