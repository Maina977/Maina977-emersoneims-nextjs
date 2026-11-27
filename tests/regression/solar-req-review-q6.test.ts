/**
 * REQ re-review of f735c88f, Q6: swapped charge / cut-off voltages sent as
 * JSON passed the battery window check; and the API path never ran the
 * datasheet import's rules. TEST values only.
 *
 * Hand-worked: 16S LFP unit, full charge 57.6 V, cut-off 44.8 V, window 40–56 V.
 *   correct: 57.6 > 56 → REFUSE (charge above the window);
 *   swapped (charge 44.8, cut-off 57.6): 44.8 ≤ 56 and 57.6 ≥ 40 "fit" → was PASS; now REFUSE (cut-off not below charge).
 */
import { describe, it, expect } from 'vitest';
import { componentChecks, type Module, type Inverter, type Battery } from '@/lib/solar/design/validate';
import { moduleDataErrors, inverterDataErrors, batteryDataErrors } from '@/lib/solar/design/datasheet';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

const MOD: Module = { model: 'T', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'T' };
const INV: Inverter = { model: 'T', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8, batteryMinV: 40, batteryMaxV: 56, generatorCompatibility: null, datasheet: 'T' };
const BAT: Battery = { model: 'T', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, nominalV: 51.2, chargeV: 57.6, cutoffV: 44.8, datasheet: 'T' };
const prov = { manufacturer: 'T', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string) => ({ kind, id: `${kind}-t`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['T'], engineVersion: 't' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'T' });
const body = (o: { mod?: Partial<Module>; inv?: Partial<Inverter>; bat?: Partial<Battery> } = {}) => JSON.parse(JSON.stringify({ format: 'json', input: {
  reference: 'T', client: { name: 'T', siteAddress: 'T', lat: -1.29, lon: 36.82 }, module: entry({ ...MOD, ...o.mod }, 'module'), inverter: entry({ ...INV, ...o.inv }, 'inverter'),
  battery: { entry: entry({ ...BAT, ...o.bat }, 'battery'), units: 4, requiredUsableAcKwh: 10 },
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'T' }, cables: [], production,
  bom: [{ item: 'PV', model: 'T', quantity: 32, unit: 'No', rate: { valueKes: 1, source: 'T', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(1), lifetimeYears: 20 },
} }));
const err = (b: unknown) => { const r = checkProposalRequest(b); return 'error' in r ? r.error : ''; };

describe('Q6: swapped charge / cut-off voltages', () => {
  it('engine: the correct pair is refused on the 57.6 V charge; the swapped pair is refused, never passed', () => {
    const cc = (bat: Battery) => componentChecks({ module: MOD, inverter: INV, modules: 32, temps: { recordLowC: 10, maxAmbientC: 35 }, grid: null, battery: { data: bat, units: 4 } }).find((k) => k.id === 'battery-voltage-range')!;
    expect(cc(BAT)).toMatchObject({ verdict: 'REFUSE', value: 57.6, limit: 56 });
    expect(cc({ ...BAT, chargeV: 44.8, cutoffV: 57.6 })).toMatchObject({ verdict: 'REFUSE', note: 'battery cut-off voltage must be below its full-charge voltage' });
    expect(cc({ ...BAT, chargeV: 50, cutoffV: 50 }).verdict).toBe('REFUSE');
  });
  it('API: the swapped pair is a 400 with the reason', () => {
    expect(err(body({ bat: { chargeV: 44.8, cutoffV: 57.6 } }))).toMatch(/battery cut-off voltage must be below its full-charge voltage/);
    expect(err(body())).toBe('');
  });
});

describe('Q6 (general): the import rules also apply to API entries', () => {
  // Added to checkProposalRequest: module — every required number, Vmp < Voc, Imp < Isc, negative and
  // ≤ 1 %/°C coefficients, α_Isc 0–0.2, Vmp × Imp = Pmax ± 3 %, dimensions 300–3,500 mm;
  // inverter — every required number, MPPT min < max ≤ max DC V, whole MPPT count ≥ 1, max Isc ≥ max input A,
  // battery kW / V window / A > 0, window min < max, anti-islanding text;
  // battery — every required number, DoD and efficiency fractions, C-rates > 0, nominal V / charge V /
  // cut-off V / cycle life / warranty > 0, cycle-life DoD 0–1, min temp < max temp, cut-off < charge, chemistry text.
  const cases: Array<[string, Parameters<typeof body>[0], RegExp]> = [
    ['module Vmp ≥ Voc', { mod: { vmpV: 50 } }, /module: Vmp must be below Voc/],
    ['module positive β', { mod: { betaVocPct: 0.27 } }, /temperature coefficients must be negative/],
    ['module length 2.278', { mod: { lengthMm: 2.278 } }, /module.lengthMm must be 300–3500 mm/],
    ['module Pmax mismatch', { mod: { pmaxW: 600 } }, /Vmp × Imp does not match Pmax/],
    ['inverter MPPT max > max DC', { inv: { mpptMaxV: 1100 } }, /MPPT min < MPPT max ≤ max DC voltage/],
    ['inverter MPPT count 1.5', { inv: { mpptCount: 1.5 } }, /MPPT count must be a whole number/],
    ['inverter window reversed', { inv: { batteryMinV: 60, batteryMaxV: 40 } }, /batteryMinV must be below batteryMaxV/],
    ['inverter negative port A', { inv: { batteryMaxChargeA: -1 } }, /inverter.batteryMaxChargeA must be a positive number/],
    ['battery DoD 90', { bat: { usableDoD: 90 } }, /usableDoD is a fraction/],
    ['battery temps reversed', { bat: { minTempC: 50, maxTempC: 0 } }, /minTempC must be below maxTempC/],
    ['battery nominal V −51.2', { bat: { nominalV: -51.2 } }, /battery.nominalV must be a positive number/],
  ];
  for (const [name, o, re] of cases) it(name, () => expect(err(body(o))).toMatch(re));
  it('the validators report nothing for good data', () => {
    expect(moduleDataErrors(MOD as unknown as Record<string, unknown>)).toEqual([]);
    expect(inverterDataErrors(INV as unknown as Record<string, unknown>)).toEqual([]);
    expect(batteryDataErrors(BAT as unknown as Record<string, unknown>)).toEqual([]);
  });
});
