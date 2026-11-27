/**
 * Register R-10 (P1-D §4): a concrete trade for slabs, beams, columns (and
 * walls, ground beams) from measured quantities and drawn member sizes.
 */
import { describe, it, expect } from 'vitest';
import { measuredWorks, WORKS_CATALOGUES } from '@/lib/qs/works';
import type { Quantity } from '@/lib/qs/takeoff';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'linear' ? 'm' : kind === 'area' ? 'm²' : 'No', gross: net, deductions: 0, net, holes: [] });
const p = (value: number) => ({ value, source: 'TEST drawing S-201' });

describe('R-10 concrete: slabs, beams, columns', () => {
  it('hand-worked frame: slab 12 × 8 = 96 m² × 0.15 = 14.4 m³; beams 40 m × 0.23 × 0.30 = 2.76 m³; 9 columns × 0.3 × 0.3 × 2.85 = 2.309 m³', () => {
    // Beam 230 × 450 overall under a 150 slab: downstand 0.30 m (the slab is measured through, so no overlap).
    const out = measuredWorks({ code: 'C', description: 'TEST first floor', trade: 'concrete', rows: [
      { item: 'slab', spec: 'TEST C25/30', measurement: q('A1', 'area', 96), dims: [p(0.15)] },
      { item: 'beam', spec: 'TEST C25/30 230 × 450', measurement: q('L1', 'linear', 40), dims: [p(0.23), p(0.3)] },
      { item: 'column', spec: 'TEST C30/37 300 × 300', measurement: q('N1', 'count', 9), dims: [p(0.3), p(0.3), p(2.85)] },
    ] });
    expect(out.map((l) => [l.unit, l.quantity])).toEqual([['m³', 14.4], ['m³', 2.76], ['m³', 2.309]]);
    // 9 × 0.3 × 0.3 × 2.85 = 2.3085 → 2.309 (3 dp).
    expect(out[2].formula).toBe('measured count × column width × column depth × height to slab soffit');
  });
  it('hand-worked: RC wall 15 m × 0.2 × 3.0 = 9 m³; ground beam 48 m × 0.23 × 0.45 = 4.968 m³', () => {
    const out = measuredWorks({ code: 'C2', description: 'TEST substructure', trade: 'concrete', rows: [
      { item: 'wall', spec: 'TEST C30/37 200 wall', measurement: q('L2', 'linear', 15), dims: [p(0.2), p(3)] },
      { item: 'groundBeam', spec: 'TEST C25/30 230 × 450', measurement: q('L3', 'linear', 48), dims: [p(0.23), p(0.45)] },
    ] });
    expect(out.map((l) => l.quantity)).toEqual([9, 4.968]);
  });
  it('reinforcement and wastage are not computed, and said so', () => {
    expect(WORKS_CATALOGUES.concrete.notMeasured.join(' ')).toMatch(/Reinforcement .*bar bending schedule/);
    expect(WORKS_CATALOGUES.concrete.note).toMatch(/downstand below the slab/);
    expect(() => measuredWorks({ code: 'X', description: 'TEST', trade: 'concrete', rows: [{ item: 'column', spec: 'TEST', measurement: q('N', 'count', 2), dims: [p(0.3), p(0.3), undefined] }] })).toThrow(/height to slab soffit is required/);
  });
});
