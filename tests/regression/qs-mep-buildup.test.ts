/**
 * Building Suite Pro: electrical and plumbing trades, unit-rate build-ups,
 * and their exports (2026-11-25).
 *
 * WORKED EXAMPLE (one small house, drawing calibrated at 0.1 m per PDF point).
 * Every quantity below is computed by hand in the comments and asserted.
 * Every price is a TEST value chosen for easy arithmetic, NOT a Kenyan price.
 *
 * Electrical (code E):
 *   counted: 6 lighting points (M10), 8 socket outlets (M11), 4 switches (M12)
 *   run L1 lighting: plan 24.5 m (M20), serves M10 (6 points), drop 0.5 m, allowance 4 %, 3 conductors
 *     conduit = (24.5 + 6 × 0.5) × 1.04 = 27.5 × 1.04 = 28.6 m;  cable = 28.6 × 3 = 85.8 m
 *   run S1 sockets: plan 32.0 m (M21), serves M11 (8 points), drop 1.2 m, no allowance, 3 conductors
 *     conduit = 32 + 8 × 1.2 = 41.6 m;  cable = 41.6 × 3 = 124.8 m
 *   enumerated: distribution board 1 No, MCBs 4 No (TEST DB schedule)
 * Plumbing (code P):
 *   counted: WC 1 (M30), basin 1 (M31), sink 1 (M32), shower 1 (M33)
 *   cold supply PPR DN20: plan 18.4 m (M40), serves 4 supply points (M34), rise 0.8 m, fittings 0.5 /m
 *     pipe = 18.4 + 4 × 0.8 = 21.6 m;  fittings = ceil(21.6 × 0.5) = ceil(10.8) = 11 No
 *   soil uPVC DN110: plan 9.2 m (M41), no rises, fittings 0.3 /m
 *     pipe = 9.2 m;  fittings = ceil(2.76) = 3 No
 *   waste uPVC DN50: plan 6.5 m (M42), serves 3 waste points (M35), rise 0.4 m, no fittings
 *     pipe = 6.5 + 3 × 0.4 = 7.7 m
 * Rate build-up for E.5 (cable 1.5 mm², per m):
 *   material cable 1.00 m × 45.00 × 1.05 = 47.25
 *   labour electrician 0.05 h × 400.00 = 20.00;  labour mate 0.05 h × 250.00 = 12.50
 *   plant tools 0.01 h × 100.00 = 1.00
 *   net = 47.25 + 32.50 + 1.00 = 80.75;  O&P 12 % = 9.69;  unit rate = 90.44 KES/m
 *   item amount = 85.8 m × 90.44 = 7 759.752 → 7 759.75 KES
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { createElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axe from 'axe-core';
import ExcelJS from 'exceljs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { calibrate, quantify, type Measurement, type Pt, type Quantity } from '@/lib/qs/takeoff';
import { buildBoq, DRAFT_NOTICE, incompleteNotice, type Adjustments, type BoqItem, type Rate } from '@/lib/qs/boq';
import { calculateTrade, emptyForm, tradeBoqItems, type ElectricalForm, type ParamForm, type PlumbingForm } from '@/lib/qs/tradeForms';
import { TradeError } from '@/lib/qs/trades';
import { computeBuildUp, buildUpFromDraft, parseRatesFile, resourceFromRates, roundMoney, RatesFileError, RATES_FILE_FORMAT, type BuildUpDraft } from '@/lib/qs/rateBuildUp';
import { boqToXlsx, BUILDUP_SHEET } from '@/lib/qs/export';
import { boqToPdf } from '@/lib/qs/pdfReport';
import { buildProject, parseProject, restoreProject, draftBoq, ProjectError, type ItemDraft, type WorkbenchSnapshot } from '@/lib/qs/project';
import TradesPanel from '@/components/qs/TradesPanel';
import BuildUpEditor from '@/components/qs/BuildUpEditor';

// ------------------------------------------------------------------ drawing: points on a sheet at 0.1 m per point
const SHA = 'cd'.repeat(32);
const SHEET = `${SHA.slice(0, 16)}#p1`;
const P = (x: number, y: number): Pt => ({ x, y });
const REFS = [{ a: P(0, 0), b: P(100, 0), knownM: 10 }, { a: P(0, 0), b: P(0, 50), knownM: 5 }];
const CAL = calibrate(SHEET, REFS);
const base = { sheetId: SHEET, metresPerUnit: CAL.metresPerUnit, user: 'test', at: '2026-11-25T08:00:00.000Z', revision: 'A' };
const count = (id: string, label: string, n: number): Measurement => ({ ...base, id, kind: 'count', label, points: Array.from({ length: n }, (_, i) => P(10 + i, 10)) });
const run = (id: string, label: string, pts: Pt[]): Measurement => ({ ...base, id, kind: 'linear', label, points: pts });
const MS: Measurement[] = [
  count('M10', 'TEST lighting points', 6), count('M11', 'TEST socket outlets', 8), count('M12', 'TEST switches', 4),
  run('M20', 'TEST lighting circuit L1', [P(0, 0), P(150, 0), P(150, 95)]),          // 15 + 9.5 = 24.5 m
  run('M21', 'TEST socket circuit S1', [P(0, 0), P(200, 0), P(200, 120)]),            // 20 + 12 = 32 m
  count('M30', 'TEST WC', 1), count('M31', 'TEST basin', 1), count('M32', 'TEST sink', 1), count('M33', 'TEST shower', 1),
  count('M34', 'TEST supply points', 4), count('M35', 'TEST waste points', 3),
  run('M40', 'TEST cold supply', [P(0, 0), P(100, 0), P(100, 84)]),                   // 10 + 8.4 = 18.4 m
  run('M41', 'TEST soil drain', [P(0, 0), P(92, 0)]),                                  // 9.2 m
  run('M42', 'TEST waste drain', [P(0, 0), P(40, 0), P(40, 25)]),                      // 4 + 2.5 = 6.5 m
];
const Q = new Map<string, Quantity>(MS.map((m) => [m.id, quantify(m)]));
const f = (value: string, source = 'TEST drawing E-101'): ParamForm => ({ value, source });
const blank = (): ParamForm => ({ value: '', source: '' });

const ELEC: ElectricalForm = {
  trade: 'electrical', code: 'E', description: 'TEST house',
  points: [
    { kind: 'lighting', label: 'ceiling rose', countId: 'M10' },
    { kind: 'socket', label: '13 A twin socket', countId: 'M11' },
    { kind: 'switch', label: '1-gang switch', countId: 'M12' },
  ],
  runs: [
    { label: 'lighting L1', runId: 'M20', pointsId: 'M10', drop: f('0.5', 'TEST section A-A'), allowance: f('4', 'TEST spec: terminations'), conductors: f('3', 'TEST circuit schedule'), cableSpec: '1.5 mm² PVC single-core', conduitSpec: '20 mm PVC' },
    { label: 'sockets S1', runId: 'M21', pointsId: 'M11', drop: f('1.2', 'TEST section A-A'), allowance: blank(), conductors: f('3', 'TEST circuit schedule'), cableSpec: '2.5 mm² PVC single-core', conduitSpec: '20 mm PVC' },
  ],
  enumerated: [{ label: '12-way distribution board', count: f('1', 'TEST DB schedule E-301') }, { label: 'MCB 6–32 A', count: f('4', 'TEST DB schedule E-301') }],
};
const PLUMB: PlumbingForm = {
  trade: 'plumbing', code: 'P', description: 'TEST house',
  fixtures: [
    { kind: 'wc', label: 'close-coupled WC', countId: 'M30' }, { kind: 'basin', label: 'basin', countId: 'M31' },
    { kind: 'sink', label: 'kitchen sink', countId: 'M32' }, { kind: 'shower', label: 'shower set', countId: 'M33' },
  ],
  pipes: [
    { label: 'cold supply', service: 'supply', material: 'PPR PN20', diameter: f('20', 'TEST spec'), runId: 'M40', pointsId: 'M34', drop: f('0.8', 'TEST section'), allowance: blank(), fittings: f('0.5', 'TEST allowance rule') },
    { label: 'soil', service: 'drainage', material: 'uPVC', diameter: f('110', 'TEST spec'), runId: 'M41', pointsId: '', drop: blank(), allowance: blank(), fittings: f('0.3', 'TEST allowance rule') },
    { label: 'waste', service: 'drainage', material: 'uPVC', diameter: f('50', 'TEST spec'), runId: 'M42', pointsId: 'M35', drop: f('0.4', 'TEST section'), allowance: blank(), fittings: blank() },
  ],
};

const CABLE_BUILDUP: BuildUpDraft = {
  resources: [
    { kind: 'material', description: 'cable 1.5 mm²', unit: 'm', quantity: '1', price: '45', tier: 'verified', waste: '5', source: 'TEST supplier quote Q-1 (not a price)', date: '2026-11-01' },
    { kind: 'labour', description: 'electrician', unit: 'h', quantity: '0.05', price: '400', tier: 'verified', waste: '', source: 'TEST wage rate (not a price)', date: '2026-10-15' },
    { kind: 'labour', description: 'mate', unit: 'h', quantity: '0.05', price: '250', tier: 'verified', waste: '', source: 'TEST wage rate (not a price)', date: '2026-10-15' },
    { kind: 'plant', description: 'tools', unit: 'h', quantity: '0.01', price: '100', tier: 'verified', waste: '', source: 'TEST hire rate (not a price)', date: '2026-11-01' },
  ],
  ohp: '12', ohpSource: 'TEST company policy', location: 'TEST town',
};
const ADJ0: Adjustments = { preliminaries: { kind: 'percent', pct: 10 }, contingencyPct: 5, overheadsProfitPct: 0, vat: { pct: 16, effectiveFrom: '2023-07-01' } };
const TEST_RATE = (v: number): Rate => ({ value: v, currency: 'KES', source: 'TEST rate, not a price', date: '2026-01-01', location: 'TEST', kind: 'rate-library' });

const elec = calculateTrade(ELEC, Q);
const plumb = calculateTrade(PLUMB, Q);
const qtyOf = (lines: typeof elec) => lines.map((l) => [l.code, l.unit, l.quantity]);

// ------------------------------------------------------------------ quantities
describe('worked example: electrical quantities from the take-off', () => {
  it('the drawn runs measure as stated', () => {
    expect([Q.get('M20')!.net, Q.get('M21')!.net, Q.get('M40')!.net, Q.get('M41')!.net, Q.get('M42')!.net]).toEqual([24.5, 32, 18.4, 9.2, 6.5]);
  });
  it('points, conduit, cable and enumerated items match the hand calculation', () => {
    expect(qtyOf(elec)).toEqual([
      ['E.1', 'No', 6], ['E.2', 'No', 8], ['E.3', 'No', 4],
      ['E.4', 'm', 28.6], ['E.5', 'm', 85.8],
      ['E.6', 'm', 41.6], ['E.7', 'm', 124.8],
      ['E.8', 'No', 1], ['E.9', 'No', 4],
    ]);
  });
  it('each line records its formula and sourced inputs', () => {
    expect(elec[3].formula).toBe('(plan run + drops × points) × (1 + allowance)');
    expect(elec[3].inputs).toEqual(['plan run 24.5 m (take-off M20)', 'points served 6 (take-off M10)', 'drop per point 0.5 m (TEST section A-A)', 'allowance 4 % (TEST spec: terminations)']);
    expect(elec[6].inputs).toContain('allowance 0 % (none entered)');
    expect(elec[4].formula).toBe('run length × conductors = 28.6 × 3');
    expect(elec[7].inputs).toEqual(['count 1 No (TEST DB schedule E-301)']);
  });
  it('a run with no conduit specification gives cable only', () => {
    const lines = calculateTrade({ ...ELEC, points: [], enumerated: [], runs: [{ ...ELEC.runs[1], conduitSpec: '' }] }, Q);
    expect(qtyOf(lines)).toEqual([['E.1', 'm', 124.8]]);
  });
});

describe('worked example: plumbing quantities from the take-off', () => {
  it('fixtures, pipes by diameter and fittings allowance match the hand calculation', () => {
    expect(qtyOf(plumb)).toEqual([
      ['P.1', 'No', 1], ['P.2', 'No', 1], ['P.3', 'No', 1], ['P.4', 'No', 1],
      ['P.5', 'm', 21.6], ['P.6', 'No', 11],
      ['P.7', 'm', 9.2], ['P.8', 'No', 3],
      ['P.9', 'm', 7.7],
    ]);
    expect(plumb[4].description).toBe('TEST house: Supply pipe PPR PN20 DN20, cold supply');
    expect(plumb[5].formula).toMatch(/stated allowance, not counted fittings/);
  });
});

describe('items without a measurable basis are refused, not guessed', () => {
  const refuse = (form: ElectricalForm | PlumbingForm) => { try { calculateTrade(form, Q); } catch (e) { expect(e).toBeInstanceOf(TradeError); return (e as Error).message; } throw new Error('accepted'); };
  it('a point row with no count measurement', () => {
    expect(refuse({ ...ELEC, points: [{ kind: 'lighting', label: 'rose', countId: '' }], runs: [], enumerated: [] })).toMatch(/no measurable basis/);
  });
  it('an enumerated item with no count or no source', () => {
    expect(refuse({ ...ELEC, points: [], runs: [], enumerated: [{ label: 'DB', count: blank() }] })).toMatch(/no measurable basis .* not guessed/);
    expect(refuse({ ...ELEC, points: [], runs: [], enumerated: [{ label: 'DB', count: { value: '1', source: '' } }] })).toMatch(/no measurable basis/);
  });
  it('a pipe run with no length measurement', () => {
    expect(refuse({ ...PLUMB, fixtures: [], pipes: [{ ...PLUMB.pipes[0], runId: '' }] })).toMatch(/run length: no measurable basis/);
  });
  it('a drop without the points it serves, and points without a drop', () => {
    expect(refuse({ ...ELEC, points: [], enumerated: [], runs: [{ ...ELEC.runs[0], pointsId: '' }] })).toMatch(/needs the count measurement of the points/);
    expect(refuse({ ...ELEC, points: [], enumerated: [], runs: [{ ...ELEC.runs[0], drop: blank() }] })).toMatch(/drop per point is required/);
  });
  it('invalid inputs are refused with the reason', () => {
    expect(refuse({ ...ELEC, points: [], enumerated: [], runs: [{ ...ELEC.runs[0], conductors: f('2.5') }] })).toMatch(/whole number/);
    expect(refuse({ ...ELEC, points: [], enumerated: [], runs: [{ ...ELEC.runs[0], allowance: f('40') }] })).toMatch(/outside 0–25 %/);
    expect(refuse({ ...PLUMB, fixtures: [], pipes: [{ ...PLUMB.pipes[0], diameter: f('5') }] })).toMatch(/outside 10–300 mm/);
    expect(refuse({ ...PLUMB, fixtures: [], pipes: [{ ...PLUMB.pipes[0], service: '' }] })).toMatch(/choose supply or drainage/);
    expect(refuse({ ...ELEC, points: [{ kind: 'lighting', label: 'rose', countId: 'M20' }], runs: [], enumerated: [] })).toMatch(/expected a count measurement, got linear/);
    expect(refuse({ ...ELEC, points: [], runs: [], enumerated: [] })).toMatch(/at least one/);
  });
  it('the same measurement counted twice is refused (double counting)', () => {
    expect(refuse({ ...ELEC, runs: [], enumerated: [], points: [ELEC.points[0], { kind: 'other', label: 'again', countId: 'M10' }] })).toMatch(/already used by Point row 1 \(double counting\)/);
    expect(refuse({ ...PLUMB, fixtures: [], pipes: [PLUMB.pipes[0], { ...PLUMB.pipes[1], runId: 'M40' }] })).toMatch(/double counting/);
  });
});

// ------------------------------------------------------------------ rate build-up
describe('worked example: unit-rate build-up', () => {
  const r = computeBuildUp(buildUpFromDraft(CABLE_BUILDUP), 'm');
  it('materials incl. waste + labour + plant + O&P = the hand-computed rate', () => {
    expect(r.errors).toEqual([]);
    expect(r.lines.map((l) => l.amount)).toEqual([47.25, 20, 12.5, 1]);
    expect([r.materials, r.labour, r.plant, r.net, r.ohp, r.rate]).toEqual([47.25, 32.5, 1, 80.75, 9.69, 90.44]);
    expect(r.priceDate).toBe('2026-10-15'); // the oldest price
    expect(r.basis).toBe('Rate build-up per m: materials 47.25 + labour 32.5 + plant 1 + transport 0 = net 80.75; O&P 12 % (TEST company policy) = 9.69; unit rate 90.44 KES. Verified (weakest input). Prices dated from 2026-10-15, TEST town.');
  });
  it('a line without a price keeps "rate required"; nothing is invented', () => {
    const d = { ...CABLE_BUILDUP, resources: CABLE_BUILDUP.resources.map((x, i) => (i === 0 ? { ...x, price: '' } : x)) };
    const x = computeBuildUp(buildUpFromDraft(d), 'm');
    expect(x.rate).toBeNull();
    expect(x.missing).toEqual(['build-up line 1 (cable 1.5 mm²): price required (quotation required)']);
    const items = tradeBoqItems(elec, 'Electrical', []).map((it) => (it.code === 'E.5' ? { ...it, buildUp: buildUpFromDraft(d) } : it));
    const b = buildBoq(items, Q, ADJ0, 'A');
    const line = b.lines.find((l) => l.code === 'E.5')!;
    expect(line.rate).toBeNull();
    expect(line.amount).toBeNull();
    expect(line.rateNote).toBe('rate required (build-up: build-up line 1 (cable 1.5 mm²): price required (quotation required))');
    expect(b.grandTotal).toBeNull();
  });
  it('invalid build-up inputs are refused with reasons', () => {
    const bad = (patch: Partial<BuildUpDraft['resources'][number]>, ohp = '12', ohpSource = 'TEST') => computeBuildUp(buildUpFromDraft({ ...CABLE_BUILDUP, ohp, ohpSource, resources: [{ ...CABLE_BUILDUP.resources[0], ...patch }] }), 'm').errors.join(' | ');
    expect(bad({ quantity: '0' })).toMatch(/quantity per m must be a number greater than 0/);
    expect(bad({ quantity: 'abc' })).toMatch(/quantity per m/);
    expect(bad({ price: '-1' })).toMatch(/price must be a number ≥ 0/);
    expect(bad({ waste: '60' })).toMatch(/waste must be 0–50 %/);
    expect(bad({ kind: 'labour', waste: '5' })).toMatch(/waste applies to materials only/);
    expect(bad({ source: '' })).toMatch(/needs its source/);
    expect(bad({ date: '1/11/2026' })).toMatch(/needs its date/);
    expect(bad({ kind: '' })).toMatch(/choose material, labour, plant or transport/);
    expect(bad({}, '120')).toMatch(/0–100 %/);
    expect(bad({}, '12', '')).toMatch(/state its basis/);
  });
  it('O&P in a build-up and at bill level is refused (charged twice); a single rate and a build-up together are refused', () => {
    const items = tradeBoqItems(elec, 'Electrical', []).map((it) => ({ ...it, rate: TEST_RATE(10), ...(it.code === 'E.5' ? { rate: null, buildUp: buildUpFromDraft(CABLE_BUILDUP) } : {}) }));
    expect(buildBoq(items, Q, { ...ADJ0, overheadsProfitPct: 10 }, 'A').errors.join(' ')).toMatch(/E\.5 and also at bill level \(10 %\): charged twice/);
    const both = items.map((it) => (it.code === 'E.5' ? { ...it, rate: TEST_RATE(90) } : it));
    expect(buildBoq(both, Q, ADJ0, 'A').errors).toContain('E.5: either a single rate or a rate build-up, not both');
  });
});

// ------------------------------------------------------------------ BOQ: reconciliation
const SECTION_E = 'Electrical installation', SECTION_P = 'Plumbing & sanitary';
function pricedItems(): BoqItem[] {
  const e = tradeBoqItems(elec, SECTION_E, []);
  const p = tradeBoqItems(plumb, SECTION_P, e.map((x) => x.code));
  // TEST single rates 100, 110, 120 … for every line except E.5, which is built up.
  return [...e, ...p].map((it, i) => (it.code === 'E.5' ? { ...it, buildUp: buildUpFromDraft(CABLE_BUILDUP) } : { ...it, rate: TEST_RATE(100 + 10 * i) }));
}
describe('BOQ with MEP trades and a built-up rate reconciles', () => {
  const b = buildBoq(pricedItems(), Q, ADJ0, 'A');
  it('the built-up line carries the rate, the amount and its basis', () => {
    expect(b.errors).toEqual([]);
    const l = b.lines.find((x) => x.code === 'E.5')!;
    expect([l.quantity, l.unit, l.rate, l.amount]).toEqual([85.8, 'm', 90.44, 7759.75]);
    expect(l.rateNote).toMatch(/^Rate build-up per m: materials 47.25/);
    expect(l.buildUp?.rate).toBe(90.44);
  });
  it('sum of items = section subtotals = measured works; units are No or m only', () => {
    const sum = (ls: typeof b.lines) => Math.round(ls.reduce((a, l) => a + l.amount!, 0) * 100) / 100;
    expect(b.sections.map((s) => s.section)).toEqual([SECTION_E, SECTION_P]);
    for (const s of b.sections) expect(s.subtotal).toBe(sum(b.lines.filter((l) => l.section === s.section)));
    expect(b.measuredWorks).toBe(sum(b.lines));
    expect(new Set(b.lines.map((l) => l.unit))).toEqual(new Set(['No', 'm']));
    for (const l of b.lines) expect(l.amount).toBe(Math.round(l.quantity * l.rate! * 100) / 100);
    expect(b.grandTotal).toBe(Math.round((b.subtotalBeforeVat! + b.vat!) * 100) / 100);
  });
  it('by hand: electrical section subtotal', () => {
    // E.1..E.9 rates 100,110,120,130,(90.44),150,160,170,180 → 6×100 + 8×110 + 4×120 + 28.6×130 + 7759.75 + 41.6×150 + 124.8×160 + 1×170 + 4×180
    const hand = 600 + 880 + 480 + 3718 + 7759.75 + 6240 + 19968 + 170 + 720;
    expect(b.sections[0].subtotal).toBe(hand); // 40 535.75
    expect(hand).toBe(40535.75);
  });
  it('the bill stays DRAFT, not certified', () => {
    expect(DRAFT_NOTICE).toMatch(/^DRAFT — not certified/);
    expect(incompleteNotice(buildBoq(pricedItems().map((it) => (it.code === 'P.1' ? { ...it, rate: null } : it)), Q, ADJ0, 'A'))).toMatch(/INCOMPLETE — 1 item\(s\) need a rate \(P\.1\)/);
  });
});

// ------------------------------------------------------------------ rates file
const REC = (code: string, kind: 'material' | 'labour', value: number | null, status: 'verified' | 'indicative' | 'unverified', unit: string) => ({
  code, kind, description: `TEST ${code}`, specification: 'TEST spec', unit, currency: 'KES', value,
  source: { title: 'TEST price list (fixture, not real prices)', url: 'https://example.org/test-prices' },
  publicationDate: '2026-09-30', retrievalDate: '2026-11-25', geography: 'TEST town', vat: 'not stated', delivery: 'not stated',
  basis: kind === 'labour' ? 'labour' : 'materials-only', confidence: 'medium', status,
});
const RATES = JSON.stringify({
  format: RATES_FILE_FORMAT, version: 2, dataset: 'TEST dataset (fixture)', licence: 'TEST fixture',
  records: [REC('C15', 'material', 45, 'indicative', 'm'), REC('L-EL', 'labour', 400, 'verified', 'h'), REC('GAP', 'material', null, 'unverified', 'No')],
});
describe('rates dataset: every record cited, dated and with a status', () => {
  it('a record becomes a build-up line carrying its status, source, URL and date', () => {
    const r = parseRatesFile(RATES);
    expect(resourceFromRates(r, 'C15', '1')).toEqual({
      kind: 'material', description: 'TEST C15 (TEST spec)', unit: 'm', quantity: '1', price: '45', tier: 'indicative', waste: '',
      source: 'TEST price list (fixture, not real prices) [C15], TEST town, VAT not stated, delivery not stated, published 2026-09-30, https://example.org/test-prices', date: '2026-09-30',
    });
    expect(() => resourceFromRates(r, 'NOPE')).toThrow(RatesFileError);
  });
  it('an unverified record gives an unpriced line: quotation required', () => {
    const line = resourceFromRates(parseRatesFile(RATES), 'GAP', '1');
    expect([line.price, line.tier]).toEqual(['', '']);
    const x = computeBuildUp(buildUpFromDraft({ resources: [line], ohp: '0', ohpSource: 'TEST', location: '' }), 'No');
    expect(x.rate).toBeNull();
    expect(x.missing[0]).toMatch(/quotation required/);
  });
  it('a file or record missing any required field is refused', () => {
    const o = JSON.parse(RATES);
    const refuse = (patch: Record<string, unknown>) => expect(() => parseRatesFile(JSON.stringify({ ...o, ...patch }))).toThrow(RatesFileError);
    const rec = (p: Record<string, unknown>) => refuse({ records: [{ ...o.records[0], ...p }] });
    refuse({ dataset: '' }); refuse({ licence: '' }); refuse({ version: 1 }); refuse({ format: 'x' }); refuse({ records: [] }); refuse({ records: [o.records[0], o.records[0]] });
    rec({ value: -5 }); rec({ value: null }); rec({ currency: 'USD' }); rec({ kind: 'overhead' }); rec({ status: 'firm' }); rec({ vat: 'maybe' });
    rec({ source: { title: 'x', url: 'http://insecure' } }); rec({ source: { title: '', url: 'https://x.org' } }); rec({ publicationDate: '30/09/2026' }); rec({ retrievalDate: 'not stated' });
    rec({ geography: '' }); rec({ delivery: '' }); rec({ confidence: 'sure' }); rec({ specification: '' });
    refuse({ records: [{ ...o.records[2], value: 10 }] }); // an unverified record may not carry a value
    expect(() => parseRatesFile('{not json')).toThrow(/not valid JSON/);
  });
  it('no prices are written into the engine', async () => {
    const fs = await import('node:fs');
    expect(fs.readFileSync('lib/qs/rateBuildUp.ts', 'utf8')).not.toMatch(/(price|value):\s*\d/);
  });
});

// ------------------------------------------------------------------ price status (verified / indicative / unpriced)
describe('price status: indicative never passes for verified; totals reported separately', () => {
  const ind = (d: BuildUpDraft): BuildUpDraft => ({ ...d, resources: d.resources.map((r, i) => (i === 1 ? { ...r, tier: 'indicative' as const } : r)) });
  it('one indicative input makes the built-up rate indicative', () => {
    expect(computeBuildUp(buildUpFromDraft(CABLE_BUILDUP), 'm').tier).toBe('verified');
    expect(computeBuildUp(buildUpFromDraft(ind(CABLE_BUILDUP)), 'm').tier).toBe('indicative');
  });
  it('a price without a status is refused, not defaulted', () => {
    const d = { ...CABLE_BUILDUP, resources: [{ ...CABLE_BUILDUP.resources[0], tier: '' as const }] };
    expect(computeBuildUp(buildUpFromDraft(d), 'm').errors.join(' ')).toMatch(/choose the price status/);
  });
  it('single rates: stated status is kept; unstated is indicative; "verified" from "other source" is refused', () => {
    const base = tradeBoqItems(elec, SECTION_E, []).slice(0, 3);
    const b = buildBoq([{ ...base[0], rate: { ...TEST_RATE(100), tier: 'verified' } }, { ...base[1], rate: TEST_RATE(110) }, { ...base[2], rate: null }], Q, ADJ0, 'A');
    expect(b.lines.map((l) => l.tier)).toEqual(['verified', 'indicative', 'unpriced']);
    expect(b.lines[1].tierNote).toMatch(/status not stated, so treated as indicative/);
    expect(b.priceStatus).toMatchObject({ verified: 600, indicative: 880, verifiedItems: ['E.1'], indicativeItems: ['E.2'], unpricedItems: ['E.3'], preliminary: true });
    expect(buildBoq([{ ...base[0], rate: { ...TEST_RATE(100), kind: 'other', tier: 'verified' } }], Q, ADJ0, 'A').errors[0]).toMatch(/verified rate is an EmersonEIMS company rate/);
  });
  it('all lines verified → no preliminary notice; any indicative or unpriced → PRELIMINARY BUDGET notice', () => {
    const base = tradeBoqItems(elec, SECTION_E, []).slice(0, 2);
    const all = buildBoq(base.map((it) => ({ ...it, rate: { ...TEST_RATE(100), tier: 'verified' as const } })), Q, ADJ0, 'A');
    expect([all.priceStatus.preliminary, all.priceStatus.notice]).toEqual([false, null]);
    expect(all.grandTotal).not.toBeNull();
    const mixed = buildBoq(base.map((it, i) => ({ ...it, rate: { ...TEST_RATE(100), tier: (i ? 'indicative' : 'verified') as 'verified' | 'indicative' } })), Q, ADJ0, 'A');
    expect(mixed.priceStatus.notice).toMatch(/^PRELIMINARY BUDGET — not a quotation\./);
    expect(mixed.priceStatus.verified + mixed.priceStatus.indicative).toBe(mixed.measuredWorks);
  });
  it('exports: the PRELIMINARY notice and the separate verified / indicative / unpriced figures, in Excel and PDF', async () => {
    const base = tradeBoqItems(elec, SECTION_E, []).slice(0, 3);
    const b = buildBoq([{ ...base[0], rate: { ...TEST_RATE(100), tier: 'verified' } }, { ...base[1], rate: { ...TEST_RATE(110), tier: 'indicative' } }, { ...base[2], rate: null }], Q, ADJ0, 'A');
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load((await boqToXlsx(b, ADJ0, 'TEST')) as unknown as Parameters<typeof wb.xlsx.load>[0]);
    const ws = wb.getWorksheet('BOQ')!;
    const rows: Array<[string, unknown]> = []; ws.eachRow((r) => rows.push([String(r.getCell(2).value ?? r.getCell(1).value ?? ''), r.getCell(6).value]));
    expect(rows.some(([t]) => /^PRELIMINARY BUDGET — not a quotation/.test(t))).toBe(true);
    expect(rows.find(([t]) => /^Verified EmersonEIMS rates \(1 item/.test(t))?.[1]).toBe(600);
    expect(rows.find(([t]) => /^Indicative market rates — preliminary budget only \(1 item/.test(t))?.[1]).toBe(880);
    expect(rows.some(([t]) => /^Unpriced — quotation required \(1 item\(s\): E\.3\)/.test(t))).toBe(true);
    let e2: ExcelJS.Row | undefined; ws.eachRow((r) => { if (r.getCell(1).value === 'E.2') e2 = r; });
    expect(String(e2!.getCell(9).value)).toMatch(/^Indicative market rate/);
    const doc = await pdfjs.getDocument({ data: boqToPdf(b, { project: 'TEST', preparedBy: 'TEST', date: '2026-11-25' }).slice() }).promise;
    let t = ''; for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + ' ';
    t = t.replace(/\s+/g, ' ');
    expect(t).toMatch(/PRELIMINARY BUDGET — not a quotation/);
    expect(t).toMatch(/Priced at verified EmersonEIMS rates \(1 item\(s\), before adjustments\) 600\.00/);
    expect(t).toMatch(/Priced at indicative market rates, preliminary budget only \(1 item\(s\), before adjustments\) 880\.00/);
    expect(t).toMatch(/Unpriced, quotation required: 1 item\(s\) \(E\.3\)/);
  }, 60_000);
});

// ------------------------------------------------------------------ exports = engine
let pdfjs: typeof import('pdfjs-dist/legacy/build/pdf.mjs');
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
}, 60_000);

describe('exports show the build-up basis with the engine figures', { timeout: 60_000 }, () => {
  const b = buildBoq(pricedItems(), Q, ADJ0, 'A');
  it('Excel: the build-up sheet recomputes the rate and the BOQ rate cell refers to it', async () => {
    const wb = new ExcelJS.Workbook();
    const xlsx = await boqToXlsx(b, ADJ0, 'TEST project');
    // Optional: QS_EXPORT_DIR=<folder> keeps the real worked-example files for manual inspection (never written into the repo by default).
    if (process.env.QS_EXPORT_DIR) {
      const fs = await import('node:fs');
      fs.writeFileSync(path.join(process.env.QS_EXPORT_DIR, 'worked-example-boq.xlsx'), xlsx);
      fs.writeFileSync(path.join(process.env.QS_EXPORT_DIR, 'worked-example-boq.pdf'), boqToPdf(b, { project: 'SYNTHETIC worked example', preparedBy: 'test', date: '2026-11-25' }));
    }
    await wb.xlsx.load(xlsx as unknown as Parameters<typeof wb.xlsx.load>[0]);
    const ws = wb.getWorksheet('BOQ')!, bs = wb.getWorksheet(BUILDUP_SHEET)!;
    expect(bs).toBeDefined();
    // Independent evaluator: ROUND, SUM, SUMIF, + - * /, cell refs, one cross-sheet ref.
    const sheetOf = (name: string) => (name === BUILDUP_SHEET ? bs : ws);
    const val = (sh: ExcelJS.Worksheet, ref: string): number | string | null => {
      const c = sh.getCell(ref).value as unknown;
      if (typeof c === 'number' || typeof c === 'string') return c;
      if (c && typeof c === 'object' && 'formula' in c) return evalF(sh, (c as { formula: string }).formula);
      return null;
    };
    const evalF = (sh: ExcelJS.Worksheet, formula: string): number => {
      const cross = /^'(.+)'!([A-Z]+\d+)$/.exec(formula);
      if (cross) return val(sheetOf(cross[1]), cross[2]) as number;
      let s = formula.replace(/SUMIF\(([A-Z])(\d+):\1(\d+),"(\w+)",([A-Z])\2:\5\3\)/g, (_, kc: string, a: string, z: string, kind: string, vc: string) => {
        let t = 0; for (let i = +a; i <= +z; i++) if (val(sh, `${kc}${i}`) === kind) t += Number(val(sh, `${vc}${i}`) ?? 0); return `(${t})`;
      });
      s = s.replace(/SUM\(([A-Z])(\d+):\1(\d+)\)/g, (_, col: string, a: string, z: string) => { let t = 0; for (let i = +a; i <= +z; i++) { const v = val(sh, `${col}${i}`); if (typeof v === 'number') t += v; } return `(${t})`; });
      s = s.replace(/\b([A-Z]\d+)\b/g, (m) => { const v = val(sh, m); if (typeof v !== 'number') throw new Error(`#VALUE! ${m}`); return `(${v})`; });
      if (!/^[\d.()+\-*/,\sR]*$/.test(s.replace(/ROUND/g, 'R'))) throw new Error(`unexpected formula ${formula}`);
      // ROUND(x, 2) as Excel does it: decimal half away from zero (every ROUND here has 2 digits).
      return new Function('R', `return ${s.replace(/ROUND\(/g, 'R(')}`)((x: number, d: number) => { if (d !== 2) throw new Error('ROUND digits'); return roundMoney(x); }) as number;
    };
    let row: ExcelJS.Row | undefined;
    ws.eachRow((r) => { if (r.getCell(1).value === 'E.5') row = r; });
    const rateCell = row!.getCell(5).value as { formula: string; result: number };
    expect(rateCell.formula).toMatch(/^'Rate build-ups'!H\d+$/);
    expect(evalF(ws, rateCell.formula)).toBe(90.44);
    expect(val(ws, `F${row!.number}`)).toBe(7759.75);
    const labelled = (re: RegExp) => { let n = 0; bs.eachRow((r) => { if (!n && re.test(String(r.getCell(3).value ?? ''))) n = r.number; }); return n; };
    expect(val(bs, `H${labelled(/^Materials$/)}`)).toBe(47.25);
    expect(val(bs, `H${labelled(/^Labour$/)}`)).toBe(32.5);
    expect(val(bs, `H${labelled(/^Plant$/)}`)).toBe(1);
    expect(val(bs, `H${labelled(/^Net unit rate$/)}`)).toBe(80.75);
    expect(val(bs, `H${labelled(/^Overheads & profit 12 %/)}`)).toBe(9.69);
    const texts: string[] = []; bs.eachRow((r) => r.eachCell((c) => texts.push(String(c.value))));
    expect(texts.join('\n')).toContain('TEST supplier quote Q-1 (not a price)');
    expect(texts.join('\n')).toContain(DRAFT_NOTICE);
  });
  it('PDF: prints the build-up lines, subtotals and rate, and the same amount', async () => {
    const doc = await pdfjs.getDocument({ data: boqToPdf(b, { project: 'TEST', preparedBy: 'TEST', date: '2026-11-25' }).slice() }).promise;
    let t = '';
    for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + '\n';
    t = t.replace(/\s+/g, ' ');
    expect(t).toMatch(/Rate build-up E\.5/);
    for (const v of ['47.25', '20.00', '12.50', '1.00', '80.75', '9.69', '90.44', '7,759.75']) expect(t).toContain(v);
    expect(t).toMatch(/TEST wage rate \(not a price\), 2026-10-15/);
    expect(t).toMatch(/DRAFT — not certified/);
  });
});

// ------------------------------------------------------------------ project save / open
describe('saved projects keep MEP forms and build-ups, and recompute them', () => {
  const snap = (): WorkbenchSnapshot => {
    const e = tradeBoqItems(elec, SECTION_E, []);
    const items: ItemDraft[] = e.map((b) => ({
      code: b.code, section: b.section, description: b.description, measurementId: '', factor: '', rate: '', rateKind: '', source: '', date: '', location: '',
      trade: { name: b.trade, unit: b.unit, scheduled: b.scheduledQuantity!, lineCode: b.code, form: ELEC },
      ...(b.code === 'E.5' ? { buildUp: CABLE_BUILDUP } : {}),
    }));
    return { drawing: { name: 'TEST.pdf', size: 1000, sha256: SHA, type: 'application/pdf' }, page: 1, stated: { ratio: '', dpi: '' }, refs: { [SHEET]: REFS }, cals: { [SHEET]: CAL }, measurements: MS, items, adj: { prelims: '', contingency: '', ohp: '', vat: '', vatFrom: '' }, revision: 'A' };
  };
  it('round trip: same quantities, same built-up rate and amount', () => {
    const s = snap();
    const file = buildProject(s, { savedAt: '2026-11-25T09:00:00.000Z' });
    const r = restoreProject(parseProject(JSON.stringify(file)));
    expect(r.differences).toEqual([]);
    const before = draftBoq(s.items, Q, s.adj, 'A')!.boq, after = r.boq!.boq;
    expect(after.lines.map((l) => [l.code, l.quantity, l.rate, l.amount])).toEqual(before.lines.map((l) => [l.code, l.quantity, l.rate, l.amount]));
    expect(after.lines.find((l) => l.code === 'E.5')!.amount).toBe(7759.75);
  });
  it('electrical + plumbing trades, a verified build-up and an INDICATIVE build-up from the PPRA dataset: reopened identical, price-status split unchanged', async () => {
    // Corrective-action guard (2026-11-25): the preview check reported a reopen mismatch; the cause was the
    // check reading the open build-up editor's rows, but the product property is pinned here.
    const fs = await import('node:fs');
    const ppra = parseRatesFile(fs.readFileSync('data/building/rates/ppra-mprg-2026-06.json', 'utf8'));
    const P5: BuildUpDraft = {
      resources: [{ ...resourceFromRates(ppra, 'PPRA012-45', '0.25'), waste: '5' }, resourceFromRates(ppra, 'PPRA012-34', '0.5'), resourceFromRates(ppra, 'PPRA012-40', '0.5')],
      ohp: '0', ohpSource: 'TEST: materials-only budget', location: 'Kenya',
    };
    const e = tradeBoqItems(elec, SECTION_E, []);
    const p = tradeBoqItems(plumb, SECTION_P, e.map((x) => x.code));
    const item = (b: BoqItem, form: ElectricalForm | PlumbingForm): ItemDraft => ({
      code: b.code, section: b.section, description: b.description, measurementId: '', factor: '', rate: '', rateKind: '', source: '', date: '', location: '',
      trade: { name: b.trade, unit: b.unit, scheduled: b.scheduledQuantity!, lineCode: b.code, form },
      ...(b.code === 'E.5' ? { buildUp: CABLE_BUILDUP } : b.code === 'P.5' ? { buildUp: P5 } : {}),
    });
    const s: WorkbenchSnapshot = { ...snap(), items: [...e.map((b) => item(b, ELEC)), ...p.map((b) => item(b, PLUMB))] };
    const before = draftBoq(s.items, Q, s.adj, 'A')!.boq;
    const r = restoreProject(parseProject(JSON.stringify(buildProject(s, { savedAt: '2026-11-25T09:00:00.000Z' }))));
    const after = r.boq!.boq;
    expect(r.differences).toEqual([]);
    expect(after.lines).toHaveLength(18);
    expect(after.lines.map((l) => [l.code, l.unit, l.quantity, l.rate, l.amount, l.tier])).toEqual(before.lines.map((l) => [l.code, l.unit, l.quantity, l.rate, l.amount, l.tier]));
    expect(after.priceStatus).toEqual(before.priceStatus);
    expect(after.priceStatus).toMatchObject({ verified: 7759.75, indicative: 1990.01, verifiedItems: ['E.5'], indicativeItems: ['P.5'], preliminary: true });
    expect(after.priceStatus.unpricedItems).toHaveLength(16);
    // Every build-up input keeps its status, source and date through the file.
    const p5 = r.items.find((i) => i.code === 'P.5')!.buildUp!;
    expect(p5.resources.map((x) => [x.tier, x.date, x.source.startsWith('PPRA Market Price Reference Guide, June 2026')])).toEqual([['indicative', '2026-06-06', true], ['indicative', '2026-06-06', true], ['indicative', '2026-06-06', true]]);
  });
  it('a damaged build-up or MEP form is refused; a schema-1 file cannot carry a build-up', () => {
    const file = JSON.parse(JSON.stringify(buildProject(snap(), { savedAt: '2026-11-25T09:00:00.000Z' })));
    const refused = (o: unknown) => { try { parseProject(JSON.stringify(o)); } catch (e) { expect(e).toBeInstanceOf(ProjectError); return (e as ProjectError).kind; } return 'accepted'; };
    const a = structuredClone(file); a.items[4].buildUp.resources[0].kind = 'overhead'; expect(refused(a)).toBe('corrupt');
    const b = structuredClone(file); b.items[0].trade.form.points[0].kind = 'chandelier'; expect(refused(b)).toBe('corrupt');
    const c = structuredClone(file); c.items[0].trade.form.runs[0].extra = 1; expect(refused(c)).toBe('corrupt');
    const d = structuredClone(file); d.schemaVersion = 1; expect(refused(d)).toBe('corrupt');
  });
});

// ------------------------------------------------------------------ UI
const A11Y_RULES = ['label', 'button-name', 'select-name', 'empty-table-header', 'th-has-data-cells', 'aria-allowed-role', 'aria-valid-attr-value'];
const violations = async (el: Element) => (await axe.run(el, { runOnly: { type: 'rule', values: A11Y_RULES } })).violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`);

describe('UI shows the engine figures', { timeout: 30_000 }, () => {
  it('Trades panel: electrical form gives the worked-example quantities, accessibly', async () => {
    const { container } = render(createElement(TradesPanel, { quantities: Q, measurements: MS, existingCodes: [], onAdd: () => {} }));
    const set = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
    set('Trade', 'electrical');
    set('Trade item code', 'E'); set('Trade description', 'TEST house');
    fireEvent.click(screen.getByRole('button', { name: 'Add point' }));
    set('Point row 1 type', 'lighting'); set('Point row 1 description', 'ceiling rose'); set('Point row 1 count', 'M10');
    fireEvent.click(screen.getByRole('button', { name: 'Add circuit run' }));
    set('Run 1 description', 'lighting L1'); set('Run 1 run length', 'M20'); set('Run 1 points served (optional)', 'M10');
    set('Run 1 drop per point value (m)', '0.5'); set('Run 1 drop per point source', 'TEST section A-A');
    set('Run 1 allowance (optional) value (%)', '4'); set('Run 1 allowance (optional) source', 'TEST spec');
    set('Run 1 conductors per run value (No)', '3'); set('Run 1 conductors per run source', 'TEST circuit schedule');
    set('Run 1 cable specification', '1.5 mm² PVC'); set('Run 1 conduit (blank = none)', '20 mm PVC');
    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));
    expect(screen.getByRole('alert')).toHaveTextContent('');
    const rows = screen.getByRole('table', { name: 'Calculated trade quantities' }).querySelectorAll('tbody tr');
    expect([...rows].map((r) => [r.children[0].textContent, r.children[2].textContent, r.children[3].textContent])).toEqual([['E.1', '6', 'No'], ['E.2', '28.6', 'm'], ['E.3', '85.8', 'm']]);
    expect(await violations(container)).toEqual([]);
  });
  it('Trades panel: plumbing refusal is announced', () => {
    render(createElement(TradesPanel, { quantities: Q, measurements: MS, existingCodes: [], onAdd: () => {} }));
    fireEvent.change(screen.getByLabelText('Trade'), { target: { value: 'plumbing' } });
    fireEvent.change(screen.getByLabelText('Trade item code'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('Trade description'), { target: { value: 'TEST' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add fixture' }));
    fireEvent.change(screen.getByLabelText('Fixture row 1 type'), { target: { value: 'wc' } });
    fireEvent.change(screen.getByLabelText('Fixture row 1 description'), { target: { value: 'WC' } });
    fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/no measurable basis/);
  });
  it('Build-up editor shows the same line amounts and rate as the engine and exports', async () => {
    const b = buildBoq(pricedItems(), Q, ADJ0, 'A');
    const l = b.lines.find((x) => x.code === 'E.5')!;
    const { container } = render(createElement(BuildUpEditor, { item: 'Item 5 (E.5)', unit: 'm', draft: CABLE_BUILDUP, result: l.buildUp, rates: parseRatesFile(RATES), onChange: () => {} }));
    const t = container.textContent ?? '';
    for (const v of ['47.25', '20.00', '12.50', '1.00', '80.75', '9.69', 'KES 90.44']) expect(t).toContain(v);
    expect(await violations(container)).toEqual([]);
  });
  it('Build-up editor: a rates-file entry is added with its citation and date', () => {
    let got: BuildUpDraft | null = null;
    render(createElement(BuildUpEditor, { item: 'Item 1', unit: 'm', draft: { resources: [], ohp: '', ohpSource: '', location: '' }, result: undefined, rates: parseRatesFile(RATES), onChange: (d: BuildUpDraft) => { got = d; } }));
    fireEvent.change(screen.getByLabelText('Item 1 rates file entry'), { target: { value: 'L-EL' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add from rates file' }));
    expect(got!.resources[0]).toMatchObject({ kind: 'labour', price: '400', tier: 'verified', unit: 'h', date: '2026-09-30' });
    expect(got!.resources[0].source).toMatch(/^TEST price list \(fixture, not real prices\) \[L-EL\], TEST town/);
  });
});

describe('the empty MEP forms are blank (nothing pre-filled)', () => {
  it('electrical and plumbing', () => {
    expect(emptyForm('electrical')).toEqual({ trade: 'electrical', code: '', description: '', points: [], runs: [], enumerated: [] });
    expect(emptyForm('plumbing')).toEqual({ trade: 'plumbing', code: '', description: '', fixtures: [], pipes: [] });
  });
});
