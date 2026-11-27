/**
 * Register R-21 (P1-D §4): external works measured from the take-off.
 * Hand-worked examples; every source is a TEST source.
 */
import { describe, it, expect } from 'vitest';
import { measuredWorks, EXTERNAL_WORKS } from '@/lib/qs/works';
import { calculateTrade, emptyForm, emptyWorksRow, tradeBoqItems, type WorksForm } from '@/lib/qs/tradeForms';
import { buildProject, restoreProject, type ItemDraft } from '@/lib/qs/project';
import { calibrate, quantify, type Measurement, type Quantity } from '@/lib/qs/takeoff';
import { TradeError } from '@/lib/qs/trades';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'linear' ? 'm' : kind === 'area' ? 'm²' : kind === 'volume' ? 'm³' : 'No', gross: net, deductions: 0, net, holes: [] });
const p = (value: number, source = 'TEST drawing EW-101') => ({ value, source });

describe('R-21 external works', () => {
  it('hand-worked: parking 18 × 12.5 = 225 m² paving and 225 × 0.2 = 45 m³ sub-base; 2 × (18 + 12.5) = 61 m kerb; 1 gate', () => {
    const out = measuredWorks({ code: 'EW', description: 'TEST car park', trade: 'external', rows: [
      { item: 'paving', spec: 'TEST 80 mm concrete blocks', measurement: q('A1', 'area', 225), dims: [] },
      { item: 'roadBase', spec: 'TEST 200 mm murram', measurement: q('A2', 'area', 225), dims: [p(0.2)] },
      { item: 'kerb', spec: 'TEST 125 × 250 mm precast', measurement: q('L1', 'linear', 61), dims: [] },
      { item: 'gate', spec: 'TEST 4.0 × 2.1 m sliding', measurement: q('C1', 'count', 1), dims: [] },
    ] });
    expect(out.map((l) => [l.code, l.unit, l.quantity])).toEqual([['EW.1', 'm²', 225], ['EW.2', 'm³', 45], ['EW.3', 'm', 61], ['EW.4', 'No', 1]]);
    expect(out[1].formula).toBe('measured area × thickness');
    expect(out[1].inputs).toEqual(['area 225 m² (take-off A2)', 'thickness 0.2 m (TEST drawing EW-101)']);
  });
  it('hand-worked: boundary 2 × (30 + 20) = 100 m fencing; 600 m² grassing; 14 trees', () => {
    const out = measuredWorks({ code: 'B', description: 'TEST boundary', trade: 'external', rows: [
      { item: 'fencing', spec: 'TEST 2.1 m chain-link', measurement: q('L2', 'linear', 100), dims: [] },
      { item: 'grassing', spec: 'TEST 150 mm topsoil + grass', measurement: q('A3', 'area', 600), dims: [] },
      { item: 'trees', spec: 'TEST 1.5 m shade trees', measurement: q('C2', 'count', 14), dims: [] },
    ] });
    expect(out.map((l) => l.quantity)).toEqual([100, 600, 14]);
  });
  it('refuses: no measurement, wrong kind, a measurement used twice, a dimension without source or out of range', () => {
    const base = { code: 'X', description: 'TEST', trade: 'external' as const };
    const t = (rows: Parameters<typeof measuredWorks>[0]['rows']) => () => measuredWorks({ ...base, rows });
    expect(t([{ item: 'paving', spec: 'TEST', measurement: undefined, dims: [] }])).toThrow(/no measurable basis/);
    expect(t([{ item: 'paving', spec: 'TEST', measurement: q('L', 'linear', 5), dims: [] }])).toThrow(/expected a area measurement/);
    expect(t([{ item: 'kerb', spec: 'TEST', measurement: q('L', 'linear', 5), dims: [] }, { item: 'channel', spec: 'TEST', measurement: q('L', 'linear', 5), dims: [] }])).toThrow(/double counting/);
    expect(t([{ item: 'roadBase', spec: 'TEST', measurement: q('A', 'area', 5), dims: [{ value: 0.2, source: '' }] }])).toThrow(/give its source/);
    expect(t([{ item: 'roadBase', spec: 'TEST', measurement: q('A', 'area', 5), dims: [p(3)] }])).toThrow(/outside/);
    expect(t([{ item: 'nope', spec: 'TEST', measurement: q('A', 'area', 5), dims: [] }])).toThrow(TradeError);
    expect(t([{ item: 'paving', spec: ' ', measurement: q('A', 'area', 5), dims: [] }])).toThrow(/describe it/);
  });
  it('the form maps to the engine and to BOQ items; a saved project reopens it identically', () => {
    const SHEET = 'TEST-sheet';
    const refs = [{ a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, knownM: 10 }, { a: { x: 0, y: 0 }, b: { x: 0, y: 100 }, knownM: 10 }];
    const cal = calibrate(SHEET, refs);
    const m: Measurement = { id: 'M1', kind: 'area', sheetId: SHEET, label: 'TEST paving', points: [{ x: 0, y: 0 }, { x: 150, y: 0 }, { x: 150, y: 100 }, { x: 0, y: 100 }], metresPerUnit: cal.metresPerUnit, user: 'TEST', at: '2026-11-27T00:00:00Z', revision: 'A' };
    const quantities = new Map([['M1', quantify(m)]]); // 15 × 10 = 150 m²
    const form: WorksForm = { ...(emptyForm('external') as WorksForm), code: 'EW', description: 'TEST yard', works: [{ ...emptyWorksRow(), item: 'paving', spec: 'TEST blocks', measurementId: 'M1' }] };
    const lines = calculateTrade(form, quantities);
    expect(lines[0].quantity).toBe(150);
    const [bi] = tradeBoqItems(lines, 'TEST External works', []);
    const item: ItemDraft = { code: bi.code, section: bi.section, description: bi.description, measurementId: '', factor: '', rate: '', rateKind: '', source: '', date: '', location: '', trade: { name: bi.trade, unit: bi.unit, scheduled: bi.scheduledQuantity!, lineCode: bi.code, form } };
    const file = buildProject({ drawing: { name: 'T.pdf', size: 1, sha256: 'ab'.repeat(32), type: 'application/pdf' }, page: 1, stated: { ratio: '', dpi: '' }, refs: { [SHEET]: refs }, cals: { [SHEET]: cal }, measurements: [m], items: [item], adj: { prelims: '', contingency: '', ohp: '', vat: '', vatFrom: '' }, revision: 'A' }, { savedAt: '2026-11-27T00:00:00Z' });
    const back = restoreProject(JSON.parse(JSON.stringify(file)));
    expect(back.differences).toEqual([]);
    expect(back.boq!.boq.lines[0].quantity).toBe(150);
  });
  it('every catalogue entry names its unit and the measurement it takes', () => {
    for (const [k, c] of Object.entries(EXTERNAL_WORKS)) { expect(['area', 'linear', 'count'], k).toContain(c.takes); expect(c.specHint.length, k).toBeGreaterThan(3); }
  });
});
