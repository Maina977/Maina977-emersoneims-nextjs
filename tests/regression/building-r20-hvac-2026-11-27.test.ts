/**
 * Register R-20 (P1-D §4, RS20): HVAC take-off, QUANTITIES ONLY; the design
 * (loads, airflows, sizes, equipment) is labelled as needing an engineer.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createElement } from 'react';
import { measuredWorks, WORKS_CATALOGUES } from '@/lib/qs/works';
import { TRADE_LABELS } from '@/lib/qs/tradeForms';
import TradesPanel from '@/components/qs/TradesPanel';
import type { Quantity } from '@/lib/qs/takeoff';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'linear' ? 'm' : kind === 'area' ? 'm²' : 'No', gross: net, deductions: 0, net, holes: [] });

describe('R-20 HVAC quantities', () => {
  it('hand-worked: 42.5 m of 400 × 250 duct, insulation 42.5 × girth 1.3 = 55.25 m², 18 m refrigerant pair, 12 diffusers, 4 + 1 units', () => {
    // girth of a 400 × 250 mm duct = 2 × (0.40 + 0.25) = 1.30 m (entered from the design, not computed).
    const out = measuredWorks({ code: 'AC', description: 'TEST office AC', trade: 'hvac', rows: [
      { item: 'duct', spec: 'TEST 400 × 250 mm galvanised', measurement: q('L1', 'linear', 42.5), dims: [] },
      { item: 'ductInsulation', spec: 'TEST 25 mm mineral wool', measurement: q('L2', 'linear', 42.5), dims: [{ value: 1.3, source: 'TEST duct 400 × 250, drawing M-201' }] },
      { item: 'refrigerant', spec: 'TEST 6.35 + 12.7 mm pair', measurement: q('L3', 'linear', 18), dims: [] },
      { item: 'grille', spec: 'TEST 600 × 600 4-way', measurement: q('C1', 'count', 12), dims: [] },
      { item: 'indoorUnit', spec: 'TEST cassette per schedule M-01', measurement: q('C2', 'count', 4), dims: [] },
      { item: 'outdoorUnit', spec: 'TEST VRF condenser per M-01', measurement: q('C3', 'count', 1), dims: [] },
    ] });
    expect(out.map((l) => [l.unit, l.quantity])).toEqual([['m', 42.5], ['m²', 55.25], ['m', 18], ['No', 12], ['No', 4], ['No', 1]]);
    expect(out.every((l) => l.trade === 'HVAC')).toBe(true);
  });
  it('the design is labelled as needing a qualified mechanical engineer; nothing is sized', () => {
    expect(WORKS_CATALOGUES.hvac.note).toMatch(/Quantities only.*qualified mechanical engineer.*does not size HVAC/);
    expect(TRADE_LABELS.hvac).toBe('HVAC (quantities only)');
    for (const c of Object.values(WORKS_CATALOGUES.hvac.items)) expect(c.dims.every((d) => d.key === 'girth')).toBe(true);
  });
  it('the Trades panel offers HVAC with the design note', () => {
    render(createElement(TradesPanel, { quantities: new Map(), measurements: [], existingCodes: [], onAdd: () => undefined }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Trade' }), { target: { value: 'hvac' } });
    expect(screen.getByText(/does not size HVAC/)).toBeTruthy();
  });
});
