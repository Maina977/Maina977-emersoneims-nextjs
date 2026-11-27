/**
 * P1-B §2/§3 Finance — REQ-06 (component replacement costs, quoted) and
 * REQ-17 (sensitivity: tariff ±, cost ±, yield ±). TEST data only.
 *
 * Base case, worked by hand (the same fixture as solar-proposal.test.ts):
 *   capex = 32 × 15,000 + 320,000 = 800,000 KES
 *   savings = 20,000 kWh × 0.8 used × 25 KES = 400,000; O&M 20,000 → net 380,000 a year for 20 years
 *   discount 10 %: annuity factor (1 − 1.1^−20) / 0.1 = 8.513564
 *   NPV = 380,000 × 8.513564 − 800,000 = 2,435,154
 */
import { describe, it, expect } from 'vitest';
import { buildProposal, SENSITIVITY_STEP_PCT, type ProposalInput } from '@/lib/solar/design/proposal';
import type { Module, Inverter } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';
import { parseReplacements } from '@/lib/solar/design/proposalForm';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';

const MOD: Module = { model: 'test-module', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'test datasheet rev A' };
const INV: Inverter = { model: 'test-inverter', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, datasheet: 'test inverter rev B' };
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', verifiedBy: 'test-2', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: 'module' | 'inverter'): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: prov, status: 'verified', warnings: [] });
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 50, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['Weather: test year.'], engineVersion: 'solar-hourly test' } as unknown as HourlyResult;
const s = (value: number, source = 'test source') => ({ value, source });
const base = (repl?: ProposalInput['finance']['replacements']): ProposalInput => ({
  reference: 'TEST-FIN', client: { name: 'Test client', siteAddress: 'Test site', lat: -1.29, lon: 36.82 },
  module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'test station record' },
  cables: [], production,
  bom: [{ item: 'PV modules', model: 'test-module', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'test supplier quote Q-1', date: '2026-11-01' } },
        { item: 'Inverter', model: 'test-inverter', quantity: 1, unit: 'No', rate: { valueKes: 320000, source: 'test supplier quote Q-1', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25, 'customer bill (test)'), selfConsumedFraction: s(0.8, 'load logger (test)'), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20, ...(repl ? { replacements: repl } : {}) },
});
const A20 = (1 - 1.1 ** -20) / 0.1; // 8.513564
const near = (a: number, b: number, tol = 2) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThanOrEqual(tol);

describe('REQ-17: sensitivity of NPV / IRR / payback to tariff, cost and yield (±10 %)', () => {
  it('the base case and the step are as worked by hand', () => {
    expect(A20).toBeCloseTo(8.513564, 6);
    const p = buildProposal(base());
    near(p.finance!.npvKes, 380000 * A20 - 800000); // 2,435,154
    expect(p.finance!.sensitivity.stepPct).toBe(SENSITIVITY_STEP_PCT);
    expect(SENSITIVITY_STEP_PCT).toBe(10);
    expect(p.finance!.sensitivity.note).toMatch(/not a forecast/);
  });
  it('six rows: tariff, installed cost, energy yield, each −10 % and +10 %', () => {
    const rows = buildProposal(base()).finance!.sensitivity.rows;
    const get = (v: string, c: number) => rows.find((r) => r.variable === v && r.changePct === c)!;
    expect(rows.map((r) => `${r.variable} ${r.changePct}`)).toEqual(['tariff -10', 'tariff 10', 'installed cost -10', 'installed cost 10', 'energy yield -10', 'energy yield 10']);
    // Tariff −10 %: savings 360,000 → net 340,000: NPV 340,000 × 8.513564 − 800,000 = 2,094,612; payback 800,000 / 340,000 = 2.35
    near(get('tariff', -10).npvKes, 340000 * A20 - 800000);
    expect(get('tariff', -10).simplePaybackYears).toBe(2.35);
    // Tariff +10 %: net 420,000: NPV 2,775,697; payback 1.90
    near(get('tariff', 10).npvKes, 420000 * A20 - 800000);
    expect(get('tariff', 10).simplePaybackYears).toBe(1.9);
    // Cost +10 %: capex 880,000: NPV 2,355,154; payback 880,000 / 380,000 = 2.32
    near(get('installed cost', 10).npvKes, 380000 * A20 - 880000);
    expect(get('installed cost', 10).simplePaybackYears).toBe(2.32);
    // Cost −10 %: 720,000: NPV 2,515,154; payback 1.89
    near(get('installed cost', -10).npvKes, 380000 * A20 - 720000);
    // Yield −10 % with no escalation and no export moves savings as tariff −10 % does: same NPV
    near(get('energy yield', -10).npvKes, get('tariff', -10).npvKes, 0);
  });
  it('no financial result → no sensitivity (an unpriced line)', () => {
    const i = base(); i.bom[1].rate = null;
    expect(buildProposal(i).finance).toBeNull();
  });
});

describe('REQ-06: quoted component replacements over the project life', () => {
  it('an inverter replacement in year 10 at a quoted 320,000 KES', () => {
    // NPV falls by 320,000 / 1.1^10 = 320,000 / 2.593742 = 123,374 → 2,435,154 − 123,374 = 2,311,781
    const p = buildProposal(base([{ item: 'Inverter', year: 10, costKes: 320000, source: 'test supplier quote Q-7', date: '2026-11-01' }]));
    near(p.finance!.npvKes, 380000 * A20 - 800000 - 320000 / 1.1 ** 10);
    const y10 = p.finance!.cashflows[9];
    expect(y10).toMatchObject({ year: 10, replacementKes: 320000, netKes: 60000 });
    expect(p.finance!.cashflows[8].replacementKes).toBe(0);
    // LCOE = (capex + PV O&M + PV replacement) / PV energy = (800,000 + 170,271 + 123,374) / 170,271 = 6.42 (5.70 without)
    expect(p.finance!.lcoeKesPerKwh).toBe(6.42);
    expect(buildProposal(base()).finance!.lcoeKesPerKwh).toBe(5.7);
    expect(p.disclosures.join(' ')).toMatch(/Inverter in year 10, KES 320,000 \(test supplier quote Q-7, 2026-11-01\)/);
  });
  it('without entries nothing is costed, and the proposal says so (no invented replacement price)', () => {
    const p = buildProposal(base());
    expect(p.finance!.cashflows.every((c) => c.replacementKes === 0)).toBe(true);
    expect(p.disclosures.join(' ')).toMatch(/No component replacement costs were entered/);
  });
  it('a replacement without its source or date, or outside the life, is refused', () => {
    expect(() => buildProposal(base([{ item: 'Battery', year: 12, costKes: 400000, source: '', date: '2026-11-01' }]))).toThrow(/source and date/);
    expect(() => buildProposal(base([{ item: 'Battery', year: 25, costKes: 400000, source: 'q', date: '2026-11-01' }]))).toThrow(/1–20/);
  });
  it('the form parses "item; year; cost; source; date | …" and reports bad entries', () => {
    const errors: string[] = [];
    expect(parseReplacements('Inverter; 12; 320,000; Supplier quote Q-7; 2026-11-01 | Battery; 10; 450000; Quote B-2; 2026-10-15', errors))
      .toEqual([{ item: 'Inverter', year: 12, costKes: 320000, source: 'Supplier quote Q-7', date: '2026-11-01' }, { item: 'Battery', year: 10, costKes: 450000, source: 'Quote B-2', date: '2026-10-15' }]);
    expect(errors).toEqual([]);
    parseReplacements('Inverter; twelve; 320000; Q; 2026-11-01 | Battery; 10; 450000', errors);
    expect(errors).toHaveLength(2);
  });
  it('the request validator accepts replacements and rejects a malformed list', () => {
    const good = checkProposalRequest({ format: 'json', input: base([{ item: 'Inverter', year: 10, costKes: 320000, source: 'q', date: '2026-11-01' }]) } as never);
    expect('error' in good && good.error).toBeFalsy();
    const bad = checkProposalRequest({ format: 'json', input: { ...base(), finance: { ...base().finance, replacements: [{ item: 'x' }] } } } as never);
    expect('error' in bad ? bad.error : '').toMatch(/finance.replacements/);
  });
});
