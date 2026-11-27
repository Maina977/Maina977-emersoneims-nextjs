/**
 * Register R-18 (P1-D §4): drainage. Above-ground runs were measured
 * (lib/qs/mep); below-ground drainage was excluded. Now measured.
 */
import { describe, it, expect } from 'vitest';
import { measuredWorks, WORKS_CATALOGUES } from '@/lib/qs/works';
import { MEP_NOT_MEASURED } from '@/lib/qs/mep';
import type { Quantity } from '@/lib/qs/takeoff';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'linear' ? 'm' : 'No', gross: net, deductions: 0, net, holes: [] });
const p = (value: number) => ({ value, source: 'TEST drawing D-301' });

describe('R-18 below-ground drainage', () => {
  it('hand-worked: 36 m of 110 mm pipe; trench 36 × 0.6 × 1.2 = 25.92 m³; bed 36 × 0.6 × 0.15 = 3.24 m³; 4 chambers, 3 gullies, 1 septic tank', () => {
    const out = measuredWorks({ code: 'DR', description: 'TEST foul drain', trade: 'drainage', rows: [
      { item: 'pipe', spec: 'TEST 110 mm uPVC, invert 0.75–1.5 m', measurement: q('L1', 'linear', 36), dims: [] },
      { item: 'trench', spec: 'TEST soft material', measurement: q('L2', 'linear', 36), dims: [p(0.6), p(1.2)] },
      { item: 'bedding', spec: 'TEST 150 mm granular', measurement: q('L3', 'linear', 36), dims: [p(0.6), p(0.15)] },
      { item: 'manhole', spec: 'TEST 600 × 450 mm, 0.9 m', measurement: q('C1', 'count', 4), dims: [] },
      { item: 'gully', spec: 'TEST 100 mm trapped', measurement: q('C2', 'count', 3), dims: [] },
      { item: 'tank', spec: 'TEST as approved design', measurement: q('C3', 'count', 1), dims: [] },
    ] });
    expect(out.map((l) => [l.unit, l.quantity])).toEqual([['m', 36], ['m³', 25.92], ['m³', 3.24], ['No', 4], ['No', 3], ['No', 1]]);
    expect(out[1].formula).toBe('measured linear × trench width × average trench depth');
  });
  it('hand-worked 2: 12.5 m surface-water drain, trench 12.5 × 0.45 × 0.8 = 4.5 m³', () => {
    const out = measuredWorks({ code: 'SW', description: 'TEST', trade: 'drainage', rows: [{ item: 'trench', spec: 'TEST', measurement: q('L4', 'linear', 12.5), dims: [p(0.45), p(0.8)] }] });
    expect(out[0].quantity).toBe(4.5);
  });
  it('a trench needs both dimensions with sources; the design is required for sizes', () => {
    expect(() => measuredWorks({ code: 'X', description: 'TEST', trade: 'drainage', rows: [{ item: 'trench', spec: 'TEST', measurement: q('L', 'linear', 5), dims: [p(0.6), undefined] }] })).toThrow(/average trench depth is required/);
    expect(WORKS_CATALOGUES.drainage.note).toMatch(/drainage design approved by the county.*percolation test/);
    expect(MEP_NOT_MEASURED.join(' ')).toMatch(/Below-ground drainage: measured in the Below-ground drainage trade/);
  });
});
