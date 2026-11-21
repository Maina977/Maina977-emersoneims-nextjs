import { describe, it, expect } from 'vitest';
import { calculateTrade, duplicateCodes, emptyForm, measurementOptions, tradeBoqItems, type MasonryForm, type OpeningForm, type ParamForm, type RoofingForm, type OpeningsForm } from '@/lib/qs/tradeForms';
import { masonry, TradeError, type Param } from '@/lib/qs/trades';
import { buildBoq } from '@/lib/qs/boq';
import type { Quantity } from '@/lib/qs/takeoff';

// TEST values with test sources, typed as a user would (strings), not project data.
const f = (value: string, source = 'test drawing A-201'): ParamForm => ({ value, source });
const p = (value: number, source = 'test drawing A-201') => ({ value, source }) as Param;
const lin = (id: string, net: number): Quantity => ({ id, kind: 'linear', unit: 'm', gross: net, deductions: 0, net, holes: [] });
const area = (id: string, net: number): Quantity => ({ id, kind: 'area', unit: 'm²', gross: net, deductions: 0, net, holes: [] });
const quantities = new Map<string, Quantity>([['M1', lin('M1', 20)], ['M2', area('M2', 120)], ['M3', lin('M3', 12)]]);
const openingForms: OpeningForm[] = [
  { mark: 'D1', type: 'door', width: f('0.9'), height: f('2.1'), count: '2' },
  { mark: 'W1', type: 'window', width: f('1.2'), height: f('1.2'), count: '3' },
  { mark: 'V1', type: 'other', width: f('0.3'), height: f('0.3'), count: '4' },
];
const rule = f('0.5', 'measurement rule: voids < 0.5 m² not deducted (test)');

function masonryForm(): MasonryForm {
  return {
    trade: 'masonry', code: 'M1', description: 'External wall', wallLengthId: 'M1',
    height: f('3'), thickness: f('0.2'), minDeducted: rule, openings: openingForms,
    block: { enabled: true, length: f('0.4'), height: f('0.2'), joint: f('0.01'), wastage: f('5', 'specification clause 4.2 (test)') },
  };
}

describe('trade forms: masonry', () => {
  it('a valid form gives the engine hand-case: 51.9 m², 10.38 m³, 633 blocks, same as calling the engine directly', () => {
    const lines = calculateTrade(masonryForm(), quantities);
    expect(lines.map((l) => l.quantity)).toEqual([51.9, 10.38, 633]);
    const direct = masonry({
      code: 'M1', description: 'External wall', wallLength: lin('M1', 20), heightM: p(3), thicknessM: p(0.2), minDeductedOpeningM2: p(0.5, 'measurement rule: voids < 0.5 m² not deducted (test)'),
      openings: [
        { mark: 'D1', type: 'door', widthM: p(0.9), heightM: p(2.1), count: 2 },
        { mark: 'W1', type: 'window', widthM: p(1.2), heightM: p(1.2), count: 3 },
        { mark: 'V1', type: 'other', widthM: p(0.3), heightM: p(0.3), count: 4 },
      ],
      block: { lengthM: p(0.4), heightM: p(0.2), jointM: p(0.01), wastagePct: p(5, 'specification clause 4.2 (test)') },
    });
    expect(lines).toEqual(direct);
  });
  it('block option off → no block line; blank wastage → no wastage applied and the trace says so', () => {
    const off = { ...masonryForm(), block: { ...masonryForm().block, enabled: false } };
    expect(calculateTrade(off, quantities).map((l) => l.code)).toEqual(['M1.1', 'M1.2']);
    const noWaste = { ...masonryForm(), block: { ...masonryForm().block, wastage: f('', '') } };
    const l = calculateTrade(noWaste, quantities);
    expect(l[2].quantity).toBe(603); // 51.9 / (0.41 × 0.21) = 602.79 → 603
    expect(l[2].inputs.join(' ')).toMatch(/none entered: no wastage applied/);
    expect(() => calculateTrade({ ...masonryForm(), block: { ...masonryForm().block, wastage: f('', 'spec 4.2') } }, quantities)).toThrow(/enter the percentage/);
  });
  it('a blank form has no values: nothing is defaulted', () => {
    const e = emptyForm('masonry') as MasonryForm;
    expect([e.height, e.thickness, e.minDeducted, e.block.wastage].every((x) => x.value === '' && x.source === '')).toBe(true);
    expect(() => calculateTrade({ ...e, code: 'M9', description: 'x', wallLengthId: 'M1' }, quantities)).toThrow('Wall height is required (m)');
  });
});

describe('trade forms: refusals', () => {
  it('a value without its source is refused with the engine message', () => {
    const fm = { ...masonryForm(), height: f('3', '  ') };
    expect(() => calculateTrade(fm, quantities)).toThrow(TradeError);
    expect(() => calculateTrade(fm, quantities)).toThrow('Wall height: give its source (drawing, section, schedule or specification)');
    expect(() => calculateTrade({ ...masonryForm(), openings: [{ ...openingForms[0], width: f('0.9', '') }] }, quantities)).toThrow(/D1 width: give its source/);
  });
  it('a measurement of the wrong kind is refused', () => {
    expect(() => calculateTrade({ ...masonryForm(), wallLengthId: 'M2' }, quantities)).toThrow('Wall length: expected a linear measurement, got area (M2)');
    const roof: RoofingForm = { ...(emptyForm('roofing') as RoofingForm), code: 'R1', description: 'Main roof', planAreaId: 'M1', pitch: f('25', 'roof section B-B') };
    expect(() => calculateTrade(roof, quantities)).toThrow(/expected a area measurement, got linear/);
    expect(calculateTrade({ ...roof, planAreaId: 'M2', ridgeId: 'M3' }, quantities).map((l) => l.quantity)).toEqual([132.405, 12]);
  });
  it('missing measurement, unknown measurement, missing code and non-numeric text are refused', () => {
    expect(() => calculateTrade({ ...masonryForm(), wallLengthId: '' }, quantities)).toThrow(/a linear measurement from the take-off is required/);
    expect(() => calculateTrade({ ...masonryForm(), wallLengthId: 'M99' }, quantities)).toThrow(/M99 is not in this take-off/);
    expect(() => calculateTrade({ ...masonryForm(), code: ' ' }, quantities)).toThrow('Item code is required');
    expect(() => calculateTrade({ ...masonryForm(), height: f('3,0') }, quantities)).toThrow(/is not a number/);
  });
  it('measurement pickers are filtered by kind', () => {
    expect(measurementOptions(quantities, 'linear').map((q) => q.id)).toEqual(['M1', 'M3']);
    expect(measurementOptions(quantities, 'area').map((q) => q.id)).toEqual(['M2']);
  });
});

describe('trade forms: to the BOQ', () => {
  it('duplicate codes are detected against the BOQ and within the new lines', () => {
    expect(duplicateCodes(['1', 'M1.1'], ['M1.1', 'M1.2'])).toEqual(['M1.1']);
    expect(duplicateCodes([], ['A', 'B', 'A'])).toEqual(['A']);
    expect(duplicateCodes(['1'], ['M1.1'])).toEqual([]);
    const lines = calculateTrade(masonryForm(), quantities);
    expect(() => tradeBoqItems(lines, 'Masonry', ['M1.2'])).toThrow(/already in the BOQ: M1\.2/);
  });
  it('items carry the scheduled quantity with its trace and need a rate', () => {
    const items = tradeBoqItems(calculateTrade(masonryForm(), quantities), 'Masonry', ['1']);
    expect(items.map((i) => i.scheduledQuantity?.value)).toEqual([51.9, 10.38, 633]);
    expect(items.every((i) => i.rate === null && i.links.length === 0 && i.section === 'Masonry')).toBe(true);
    const boq = buildBoq(items, new Map(), { preliminaries: { kind: 'percent', pct: 0 }, contingencyPct: 0, overheadsProfitPct: 0, vat: { pct: 16, effectiveFrom: '2026-01-01' } }, 'A');
    expect(boq.errors).toEqual([]);
    expect(boq.lines[0].quantitySource).toMatch(/^schedule: length × height − deducted openings; length 20 m \(take-off M1\)/);
    expect(boq.lines.map((l) => l.rateNote)).toEqual(['rate required', 'rate required', 'rate required']);
    expect(() => tradeBoqItems([], 'Masonry', [])).toThrow(/Calculate the trade first/);
    expect(() => tradeBoqItems(calculateTrade(masonryForm(), quantities), ' ', [])).toThrow('BOQ section is required');
  });
  it('door and window schedule needs no measurement', () => {
    const fm: OpeningsForm = { trade: 'openings', code: 'DW', openings: openingForms.slice(0, 2) };
    expect(calculateTrade(fm, new Map()).map((l) => `${l.code}=${l.quantity}`)).toEqual(['DW.1=2', 'DW.2=3']);
    expect(() => calculateTrade({ ...fm, openings: [{ ...openingForms[0], count: '1.5' }] }, new Map())).toThrow(/whole number/);
  });
});
