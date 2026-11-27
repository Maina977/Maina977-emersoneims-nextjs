/**
 * Review of 57fb8acc / 5b5262fa (REVIEW-SOLAR-REQ-57fb8acc.md): Q1–Q5 and
 * advisories A1–A3. Missing or nonsensical data is shown as "not checked",
 * never as a pass. TEST values only.
 */
import { describe, it, expect } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { componentChecks, MODULE_DIM_MM, type Module, type Inverter, type Battery } from '@/lib/solar/design/validate';
import { importModule, importBattery } from '@/lib/solar/design/datasheet';
import { formToProposalInput, WORKED_EXAMPLE_FORM } from '@/lib/solar/design/proposalForm';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';
import type { HybridResult } from '@/lib/solar/design/hybrid';

const MOD: Module = { model: 'T', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, lengthMm: 2278, widthMm: 1134, datasheet: 'T' };
const INV: Inverter = { model: 'T', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8, batteryMinV: 40, batteryMaxV: 60, batteryMaxDischargeA: 150, batteryMaxChargeA: 150, generatorCompatibility: null, datasheet: 'T' };
const BAT: Battery = { model: 'T', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, nominalV: 51.2, datasheet: 'T' };
const prov = { manufacturer: 'T', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string) => ({ kind, id: `${kind}-t`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['T'], engineVersion: 't' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'T' });
const input = (o: Partial<ProposalInput> = {}): ProposalInput => ({
  reference: 'T-Q', client: { name: 'T', siteAddress: 'T', lat: -1.29, lon: 36.82 }, module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'T' }, cables: [], production,
  bom: [{ item: 'PV', model: 'T', quantity: 32, unit: 'No', rate: { valueKes: 1, source: 'T', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(1), lifetimeYears: 20 },
  ...o,
} as ProposalInput);
const cc = (o: Partial<Parameters<typeof componentChecks>[0]> = {}) => componentChecks({ module: MOD, inverter: INV, modules: 32, temps: { recordLowC: 10, maxAmbientC: 35 }, grid: null, ...o });
const find = (c: ReturnType<typeof cc>, id: string) => c.find((k) => k.id === id);

describe('Q1/Q2: module dimensions must be plausible millimetres', () => {
  it('a negative length (JSON) is not checked, never a pass', () => {
    expect(find(cc({ module: { ...MOD, lengthMm: -2278 }, usableAreaM2: 10 }), 'array-area')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('metres typed as mm (2.278 × 1.134) are refused at import and not checked in the engine', () => {
    expect(MODULE_DIM_MM).toEqual({ min: 300, max: 3500 });
    const P = { manufacturer: 'T', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20' };
    const r = importModule({ ...P, model: 'M', pmaxW: '550', vocV: '49.5', iscA: '13.9', vmpV: '41.95', impA: '13.11', betaVocPct: '-0.27', betaVmpPct: '-0.35', alphaIscPct: '0.048', gammaPmaxPct: '-0.35', noctC: '45', maxSystemV: '1500', maxSeriesFuseA: '25', lengthMm: '2.278', widthMm: '1.134' });
    expect(r.errors.join(' ')).toMatch(/lengthMm 2.278 mm is outside 300–3500 mm: enter the module size in millimetres/);
    expect(find(cc({ module: { ...MOD, lengthMm: 2.278, widthMm: 1.134 }, usableAreaM2: 10 }), 'array-area')?.verdict).toBe('WARN');
  });
  it('the area check is labelled gross area, before row spacing (32 × 2.278 × 1.134 = 82.66 m²)', () => {
    const a = find(cc({ usableAreaM2: 90 }), 'array-area')!;
    expect(a).toMatchObject({ verdict: 'PASS', value: 82.66, title: 'Gross module area (before row spacing and access) fits the usable area' });
    expect(a.formula).toMatch(/a PASS does not mean the layout fits/);
  });
});

describe('Q3: missing battery voltage or inverter battery current → "not checked", not silence', () => {
  it('no inverter battery currents: both current checks shown as WARN not checked', () => {
    const c = cc({ inverter: { ...INV, batteryMaxDischargeA: undefined, batteryMaxChargeA: undefined }, battery: { data: BAT, units: 4 } });
    for (const d of ['discharge', 'charge']) expect(find(c, `battery-${d}-current`)).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('no battery nominal voltage: voltage and both currents shown as not checked', () => {
    const c = cc({ battery: { data: { ...BAT, nominalV: undefined }, units: 4 } });
    expect(find(c, 'battery-voltage')?.verdict).toBe('WARN');
    for (const d of ['discharge', 'charge']) expect(find(c, `battery-${d}-current`)?.note).toMatch(/nominal voltage not entered/);
  });
});

describe('A2: charge and cut-off voltages checked against the inverter window', () => {
  // 16S LFP unit (here one 51.2 V unit): charge 57.6 V, cut-off 44.8 V; window 40–60 V → passes.
  it('57.6 / 44.8 V inside 40–60 V passes; a 56 V maximum window refuses the 57.6 V charge', () => {
    expect(find(cc({ battery: { data: { ...BAT, chargeV: 57.6, cutoffV: 44.8 }, units: 4 } }), 'battery-voltage-range')?.verdict).toBe('PASS');
    expect(find(cc({ inverter: { ...INV, batteryMaxV: 56 }, battery: { data: { ...BAT, chargeV: 57.6, cutoffV: 44.8 }, units: 4 } }), 'battery-voltage-range')).toMatchObject({ verdict: 'REFUSE', value: 57.6, limit: 56 });
    // Nominal 51.2 V alone still PASSes the nominal check in that 40–56 V window: the range check is what catches it.
    expect(find(cc({ inverter: { ...INV, batteryMaxV: 56 }, battery: { data: { ...BAT, chargeV: 57.6, cutoffV: 44.8 }, units: 4 } }), 'battery-voltage')?.verdict).toBe('PASS');
  });
  it('not entered → WARN not checked; import validates cut-off < charge', () => {
    expect(find(cc({ battery: { data: BAT, units: 4 } }), 'battery-voltage-range')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
    const P = { manufacturer: 'T', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20' };
    const b = { ...P, model: 'B', nominalKwh: '5', usableDoD: '0.9', dischargeEfficiency: '0.95', maxDischargeC: '0.5', maxChargeC: '0.5' };
    expect(importBattery({ ...b, chargeV: '57.6', cutoffV: '44.8' }).entry?.data).toMatchObject({ chargeV: 57.6, cutoffV: 44.8 });
    expect(importBattery({ ...b, chargeV: '44', cutoffV: '57' }).errors.join(' ')).toMatch(/cutoffV must be below chargeV/);
  });
});

describe('Q4: units in series must be a whole number', () => {
  it('2.5 and 0 are reported by the form, not replaced by 1', () => {
    for (const v of ['2.5', '0']) {
      const r = formToProposalInput({ ...WORKED_EXAMPLE_FORM, 'b.seriesPerString': v }, [], production, null);
      expect(r.errors.join(' '), v).toMatch(/units in series per string must be a whole number/);
    }
  });
});

describe('Q5: the critical-backup check never disappears', () => {
  it('critical load without outage hours → WARN not checked', () => {
    const p = buildProposal(input({ load: { criticalLoadKw: 3, source: 'T' } }));
    expect(p.checks.find((c) => c.id === 'critical-backup')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('critical 3 kW × 6 h with no battery → WARN: 18 kWh NOT backed up', () => {
    const k = buildProposal(input({ load: { criticalLoadKw: 3, outageHoursPerDay: 6, source: 'T' } })).checks.find((c) => c.id === 'critical-backup')!;
    expect(k).toMatchObject({ verdict: 'WARN', value: 0, limit: 18 });
    expect(k.note).toMatch(/18 kWh of critical load during outages is NOT backed up/);
  });
});

describe('A3: diesel fuel cost is stated as outside the cash flow', () => {
  it('the disclosure says the fuel cost is not in the NPV', () => {
    const hybrid = { hours: 8760, totals: { loadKwh: 1, pvKwh: 1, pvToLoadKwh: 1, pvToBatteryKwh: 0, batteryToLoadKwh: 0, gridImportKwh: 0, gridExportKwh: 0, generatorKwh: 800, generatorToBatteryKwh: 0, generatorDumpedKwh: 0, generatorHours: 120, generatorFuelL: 300, generatorStarts: 1, curtailedKwh: 0, unservedKwh: 0, batteryLossKwh: 0 }, renewableFraction: 0, unservedHours: 0, finalSocFrac: null, balanceErrorKwh: 0, assumptions: [], engineVersion: 't' } as HybridResult;
    const p = buildProposal(input({ hybrid, load: { dieselKesPerLitre: { value: 180, source: 'receipt' }, source: 'T' } }));
    expect(p.disclosures.join(' ')).toMatch(/KES 54,000 a year at the customer's diesel price\. This fuel cost is NOT in the cash flow, NPV, IRR or payback/);
  });
});
