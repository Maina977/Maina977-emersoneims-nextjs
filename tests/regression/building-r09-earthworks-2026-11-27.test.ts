/**
 * Register R-09 (P1-D §4): earthworks beyond strip-foundation trenches —
 * site strip, bulk excavation and filling to LEVELS, and disposal.
 * Trades review of 47e0256f: MF-1 (the strip was counted twice in bulk
 * excavation) and MF-2 (disposal must be bank m³) are fixed here.
 */
import { describe, it, expect } from 'vitest';
import { measuredWorks } from '@/lib/qs/works';
import type { Quantity } from '@/lib/qs/takeoff';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'area' ? 'm²' : kind === 'volume' ? 'm³' : 'm', gross: net, deductions: 0, net, holes: [] });
const p = (value: number, source = 'TEST level survey LS-01 / section A-A') => ({ value, source });

describe('R-09 earthworks to levels', () => {
  it('hand-worked: 600 m² site, strip 0.15 → 90 m³; reduce from mean 1,642.35 (before strip) to formation 1,641.80 = 600 × (1,642.35 − 0.15 − 1,641.80) = 600 × 0.40 = 240 m³', () => {
    // Mean existing ground level of the area from the level survey: (1,642.10 + 1,642.40 + 1,642.70 + 1,642.20) / 4 = 1,642.35 m.
    // Before MF-1 the bulk excavation was 600 × 0.55 = 330 m³: the top 0.15 m (90 m³) was also in the site strip.
    // Strip + bulk = 90 + 240 = 330 m³ = 600 × (1,642.35 − 1,641.80): the whole depth is measured once.
    const out = measuredWorks({ code: 'EW', description: 'TEST site', trade: 'earthworks', rows: [
      { item: 'topsoil', spec: 'TEST 150 mm topsoil, stockpile', measurement: q('A1', 'area', 600), dims: [p(0.15)] },
      { item: 'bulkExcavation', spec: 'TEST soft material', measurement: q('A2', 'area', 600), dims: [p(1642.35), p(0.15, 'TEST spec: 150 mm strip'), p(1641.8)] },
      { item: 'disposal', spec: 'TEST surplus to licensed tip', measurement: q('A3', 'area', 600), dims: [p(0.4), p(1.25, 'TEST site investigation SI-02, bulking 25 %')] },
    ] });
    // Disposal is bank m³: 600 × 0.40 = 240; the loose volume 240 × 1.25 = 300 m³ is recorded beside it, not in it.
    expect(out.map((l) => [l.unit, l.quantity])).toEqual([['m³', 90], ['m³', 240], ['m³', 240]]);
    expect(out[1].formula).toBe('measured area × (mean existing ground level − strip depth − formation level)');
    expect(out[2].inputs.join(' ')).toMatch(/loose volume for haulage, information only: 300 m³ at bulking 1\.25 \(not in the BOQ quantity, which is bank m³\)/);
  });
  it('the other way: levels already surveyed after the strip → strip depth 0, bulk = 600 × 0.55 = 330 m³ (no strip item)', () => {
    const out = measuredWorks({ code: 'EW', description: 'TEST site', trade: 'earthworks', rows: [
      { item: 'bulkExcavation', spec: 'TEST', measurement: q('A2', 'area', 600), dims: [p(1642.35, 'TEST survey after strip'), p(0, 'TEST: levels taken after the strip'), p(1641.8)] },
    ] });
    expect(out[0].quantity).toBe(330);
  });
  it('hand-worked: filling 120 m² from mean 98.40 (before a 0.15 strip) up to formation 98.85 = 120 × (98.85 − 98.25) = 72 m³ (was 54: the strip was not made good); a volume take-off passes through', () => {
    const out = measuredWorks({ code: 'F', description: 'TEST', trade: 'earthworks', rows: [
      { item: 'fill', spec: 'TEST murram in 150 layers', measurement: q('A4', 'area', 120), dims: [p(98.4), p(0.15), p(98.85)] },
      { item: 'basementExcavation', spec: 'TEST 1.5–3 m band', measurement: q('V1', 'volume', 187.5), dims: [] },
    ] });
    expect(out.map((l) => l.quantity)).toEqual([72, 187.5]);
    expect(out[1].inputs[0]).toBe('volume 187.5 m³ (take-off V1)');
  });
  it('levels the wrong way round, or a bulking factor below 1, are refused', () => {
    expect(() => measuredWorks({ code: 'X', description: 'TEST', trade: 'earthworks', rows: [{ item: 'bulkExcavation', spec: 'TEST', measurement: q('A', 'area', 10), dims: [p(10), p(0), p(11)] }] })).toThrow(/must be above the formation level/);
    expect(() => measuredWorks({ code: 'X', description: 'TEST', trade: 'earthworks', rows: [{ item: 'bulkExcavation', spec: 'TEST', measurement: q('A', 'area', 10), dims: [p(10.1), p(0.15), p(10)] }] })).toThrow(/level after the topsoil strip \(10\.1 − 0\.15 = 9\.95 m\) must be above/);
    expect(() => measuredWorks({ code: 'X', description: 'TEST', trade: 'earthworks', rows: [{ item: 'fill', spec: 'TEST', measurement: q('A', 'area', 10), dims: [p(11), p(0), p(10)] }] })).toThrow(/must be above the level after the topsoil strip/);
    expect(() => measuredWorks({ code: 'X', description: 'TEST', trade: 'earthworks', rows: [{ item: 'disposal', spec: 'TEST', measurement: q('A', 'area', 10), dims: [p(1), p(0.9)] }] })).toThrow(/outside 1–1.6/);
  });
});
