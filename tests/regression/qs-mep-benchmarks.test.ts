/**
 * Building Suite Pro MEP + rate build-up BENCHMARK PROGRAMME (2026-11-25).
 *
 * EVERY CASE HERE IS SYNTHETIC: invented geometry for testing the engine
 * against an independent hand calculation. None is a real customer project and
 * none is field validation (see docs/engineering/building-evidence-package.md).
 *
 * Each case: problem, inputs, principle, hand calculation, expected result,
 * tolerance, the application output (computed here) and pass/fail (the assert),
 * and the source of any price used. Prices are either TEST values or INDICATIVE
 * values from data/building/rates/ppra-mprg-2026-06.json (PPRA June 2026).
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import type { Quantity } from '@/lib/qs/takeoff';
import { calculateTrade, type ElectricalForm, type ParamForm, type PlumbingForm } from '@/lib/qs/tradeForms';
import { computeBuildUp, buildUpFromDraft, parseRatesFile, resourceFromRates, roundMoney, type ResourceDraft } from '@/lib/qs/rateBuildUp';
import { buildBoq, PRELIMINARY_NOTICE, type Adjustments, type BoqItem } from '@/lib/qs/boq';
import { tradeBoqItems } from '@/lib/qs/tradeForms';

const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'linear' ? 'm' : 'No', gross: net, deductions: 0, net, holes: [] });
const f = (value: string, source = 'SYNTHETIC drawing'): ParamForm => ({ value, source });
const blank = (): ParamForm => ({ value: '', source: '' });
const ADJ: Adjustments = { preliminaries: { kind: 'percent', pct: 0 }, contingencyPct: 0, overheadsProfitPct: 0, vat: { pct: 16, effectiveFrom: '2023-07-01' } };
const PPRA = parseRatesFile(fs.readFileSync('data/building/rates/ppra-mprg-2026-06.json', 'utf8'));

interface Case { id: string; kind: 'simple' | 'complex' | 'boundary' | 'invalid' | 'missing evidence'; problem: string; principle: string; hand: string; expected: unknown; tolerance: number; source: string; run: () => unknown }

const elec = (runs: ElectricalForm['runs'], enumerated: ElectricalForm['enumerated'] = [], Q?: Map<string, Quantity>) =>
  calculateTrade({ trade: 'electrical', code: 'E', description: 'SYNTHETIC', points: [], runs, enumerated }, Q ?? new Map([['R', q('R', 'linear', 10)], ['N', q('N', 'count', 4)]]));
const run = (p: Partial<ElectricalForm['runs'][number]> = {}): ElectricalForm['runs'][number] => ({ label: 'circuit', runId: 'R', pointsId: 'N', drop: f('0.3'), allowance: blank(), conductors: f('3'), cableSpec: '1.5 mm²', conduitSpec: '20 mm', ...p });
const pipe = (p: Partial<PlumbingForm['pipes'][number]> = {}, net = 10) => calculateTrade({ trade: 'plumbing', code: 'P', description: 'SYNTHETIC', fixtures: [], pipes: [{ label: 'supply', service: 'supply', material: 'PPR', diameter: f('20'), runId: 'R', pointsId: '', drop: blank(), allowance: blank(), fittings: blank(), ...p }] }, new Map([['R', q('R', 'linear', net)]]));
const refused = (fn: () => unknown) => { try { fn(); return 'accepted'; } catch (e) { return `refused: ${(e as Error).message}`; } };
const fromPpra = (code: string, quantity: string): ResourceDraft => resourceFromRates(PPRA, code, quantity);

// PPR DN20 supply pipe per m, materials only, INDICATIVE (PPRA June 2026 national averages):
//   pipe 20 mm × 4 m length: 0.25 length/m × 234.46 × 1.05 waste = 61.54575 → 61.55
//   tee 20 mm: 0.5 No/m × 24.28 = 12.14;  elbow 20 mm: 0.5 No/m × 36.87 = 18.435 → 18.44 (decimal half-up, as Excel ROUND;
//   naive binary Math.round(x*100)/100 gives 18.43 — this case found that defect, fixed by roundMoney)
//   net = 61.55 + 12.14 + 18.44 = 92.13;  O&P 0 % → unit rate 92.13 KES/m, INDICATIVE
const PPR_BUILDUP = () => buildUpFromDraft({ resources: [{ ...fromPpra('PPRA012-45', '0.25'), waste: '5' }, fromPpra('PPRA012-34', '0.5'), fromPpra('PPRA012-40', '0.5')], ohp: '0', ohpSource: 'SYNTHETIC: none in a materials-only budget', location: 'Kenya' });

const CASES: Case[] = [
  {
    id: 'B1', kind: 'simple', problem: 'One room: lighting circuit, plan run 10 m serving 4 points', principle: 'run = (plan + drops × points) × (1 + allowance); cable = run × conductors',
    hand: 'conduit = 10 + 4 × 0.3 = 11.2 m; cable = 11.2 × 3 = 33.6 m', expected: [11.2, 33.6], tolerance: 0.001, source: 'SYNTHETIC geometry',
    run: () => elec([run()]).map((l) => l.quantity),
  },
  {
    id: 'B2', kind: 'complex', problem: 'PPR DN20 cold supply, 21.6 m, materials-only unit rate from PPRA June 2026 indicative prices', principle: 'material = qty per m × price × (1 + waste); weakest input sets the status',
    hand: 'rate = 61.55 + 12.14 + 18.44 = 92.13 KES/m (indicative); amount = 21.6 × 92.13 = 1 990.01 KES', expected: { rate: 92.13, amount: 1990.01, tier: 'indicative' }, tolerance: 0.005,
    source: 'PPRA Market Price Reference Guide June 2026, PPRA012 items 45, 34, 40 (indicative; VAT and delivery not stated)',
    run: () => {
      const r = computeBuildUp(PPR_BUILDUP(), 'm');
      const items: BoqItem[] = tradeBoqItems(pipe({}, 21.6), 'Plumbing', []).map((it) => ({ ...it, buildUp: PPR_BUILDUP() }));
      const b = buildBoq(items, new Map(), ADJ, 'A');
      return { rate: r.rate, amount: b.lines[0].amount, tier: b.lines[0].tier, preliminary: b.priceStatus.preliminary };
    },
  },
  {
    id: 'B3', kind: 'boundary', problem: 'Limits accepted: allowance 25 %, 12 conductors, DN300, fittings giving an exact integer', principle: 'stated ranges are inclusive; ceil(5.0) = 5, not 6',
    hand: 'run = 10 × 1.25 = 12.5 m (no points); cable = 12.5 × 12 = 150 m; DN300 pipe 10 m; fittings ceil(10 × 0.5) = 5', expected: [[12.5, 150], [10, 5]], tolerance: 0.001, source: 'SYNTHETIC',
    run: () => [elec([run({ pointsId: '', drop: blank(), allowance: f('25'), conductors: f('12') })]).map((l) => l.quantity), pipe({ diameter: f('300'), fittings: f('0.5') }).map((l) => l.quantity)],
  },
  {
    id: 'B4', kind: 'invalid', problem: 'Just outside the limits, or nonsense values', principle: 'invalid inputs are refused with the reason, never clipped',
    hand: 'allowance 25.01 %, DN301, 0 conductors, drop −0.1 m, conductors 2.5: all refused', expected: [true, true, true, true, true], tolerance: 0, source: 'SYNTHETIC',
    run: () => [
      refused(() => elec([run({ allowance: f('25.01') })])), refused(() => pipe({ diameter: f('301') })), refused(() => elec([run({ conductors: f('0') })])),
      refused(() => elec([run({ drop: f('-0.1') })])), refused(() => elec([run({ conductors: f('2.5') })])),
    ].map((x) => x.startsWith('refused')),
  },
  {
    id: 'B5', kind: 'missing evidence', problem: 'A board with no count source; labour with no public price; an unmeasured run', principle: 'no measurable basis → refused; no defensible price → quotation required; bill is a preliminary budget',
    hand: 'DB row refused; build-up with the unverified electrician record has no rate; BOQ line unpriced, PRELIMINARY notice', expected: { db: true, run: true, rate: null, tier: 'unpriced', notice: true }, tolerance: 0, source: 'data/building/rates/ppra-mprg-2026-06.json record GAP-LAB-ELEC (unverified)',
    run: () => {
      const bu = buildUpFromDraft({ resources: [fromPpra('TRONIC-TWE-1.5', '1'), fromPpra('GAP-LAB-ELEC', '0.05')], ohp: '0', ohpSource: 'SYNTHETIC', location: '' });
      const lines = elec([run()]);
      const b = buildBoq(tradeBoqItems(lines, 'Electrical', []).map((it) => ({ ...it, buildUp: bu })), new Map(), ADJ, 'A');
      return {
        db: refused(() => elec([], [{ label: 'DB', count: { value: '1', source: '' } }])).includes('no measurable basis'),
        run: refused(() => elec([run({ runId: '' })])).includes('no measurable basis'),
        rate: computeBuildUp(bu, 'm').rate, tier: b.lines[0].tier, notice: b.priceStatus.notice?.startsWith(PRELIMINARY_NOTICE) ?? false,
      };
    },
  },
];

const close = (a: unknown, b: unknown, tol: number): boolean => {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= tol;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => close(x, b[i], tol));
  if (a && b && typeof a === 'object' && typeof b === 'object') return Object.keys(b).every((k) => close((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], tol));
  return a === b;
};

describe('MEP and rate build-up benchmarks (SYNTHETIC cases, not field validation)', () => {
  for (const c of CASES) {
    it(`${c.id} [${c.kind}] ${c.problem} — expected ${JSON.stringify(c.expected)} ±${c.tolerance}`, () => {
      const out = c.run();
      // pass/fail = the application output against the independent hand calculation, within the stated tolerance
      expect(close(out, c.expected, c.tolerance), `${c.id}: ${c.hand}; got ${JSON.stringify(out)}`).toBe(true);
    });
  }
  it('B2 detail: every input is INDICATIVE with its PPRA source and date', () => {
    const r = computeBuildUp(PPR_BUILDUP(), 'm');
    expect(r.lines.map((l) => [l.tier, l.date])).toEqual([['indicative', '2026-06-06'], ['indicative', '2026-06-06'], ['indicative', '2026-06-06']]);
    expect(r.lines[0].source).toMatch(/^PPRA Market Price Reference Guide, June 2026, PPRA012 item 45 \[PPRA012-45\]/);
    expect(r.lines[0].amount).toBe(61.55);
    expect(r.lines[1].amount).toBe(12.14);
    expect(r.lines[2].amount).toBe(18.44); // Excel ROUND(0.5*36.87,2) = 18.44
    expect(r.rate).toBe(92.13);
  });
  it('rounding is decimal half-up like Excel ROUND, not binary', () => {
    expect([roundMoney(18.435), roundMoney(1.005), roundMoney(2.675), roundMoney(-18.435), roundMoney(0.125), roundMoney(7759.752)]).toEqual([18.44, 1.01, 2.68, -18.44, 0.13, 7759.75]);
    expect(Math.round(18.435 * 100) / 100).toBe(18.43); // the naive method this replaces
  });
  it('every case is labelled synthetic or cites its price source', () => {
    for (const c of CASES) expect(c.source).toMatch(/SYNTHETIC|PPRA|ppra-mprg/);
  });
});
