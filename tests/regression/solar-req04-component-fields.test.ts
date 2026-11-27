/**
 * REQ-04 (P1-B §2 Components) and the battery arrangement of REQ-05: module
 * dimensions; inverter battery voltage window, battery-port currents and
 * anti-islanding; battery chemistry, nominal voltage, cycle life, temperature
 * window and warranty — imported from the datasheet, carried to the proposal,
 * and used by the checks they make possible. TEST values only.
 */
import { describe, it, expect } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { importModule, importInverter, importBattery } from '@/lib/solar/design/datasheet';
import type { Module, Inverter, Battery } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

const MOD: Module = { model: 'T-mod', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, lengthMm: 2278, widthMm: 1134, datasheet: 'T' };
const INV: Inverter = { model: 'T-inv', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8, batteryMinV: 40, batteryMaxV: 60, batteryMaxDischargeA: 150, batteryMaxChargeA: 150, generatorCompatibility: null, datasheet: 'T' };
const BAT: Battery = { model: 'T-bat', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, chemistry: 'LiFePO4', nominalV: 51.2, cycleLife: 6000, cycleLifeDoD: 0.9, minTempC: 0, maxTempC: 45, warrantyYears: 10, datasheet: 'T' };
const prov = { manufacturer: 'T', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string) => ({ kind, id: `${kind}-t`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['T'], engineVersion: 't' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'T' });
type O = Partial<ProposalInput> & { mod?: Partial<Module>; inv?: Partial<Inverter>; bat?: Partial<Battery>; units?: number; series?: number; noBattery?: boolean };
const input = (o: O = {}): ProposalInput => {
  const { mod, inv, bat, units = 4, series, noBattery, ...rest } = o;
  return {
    reference: 'T-04', client: { name: 'T', siteAddress: 'T', lat: -1.29, lon: 36.82 }, module: entry({ ...MOD, ...mod }, 'module'), inverter: entry({ ...INV, ...inv }, 'inverter'),
    ...(noBattery ? {} : { battery: { entry: entry({ ...BAT, ...bat }, 'battery'), units, requiredUsableAcKwh: 10, ...(series ? { seriesPerString: series } : {}) } }),
    design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'T' }, cables: [], production,
    bom: [{ item: 'PV', model: 'T', quantity: 32, unit: 'No', rate: { valueKes: 1, source: 'T', date: '2026-11-01' } }],
    finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(1), lifetimeYears: 20 },
    ...rest,
  } as ProposalInput;
};
const chk = (p: ReturnType<typeof buildProposal>, id: string) => p.checks.find((k) => k.id === id);

describe('REQ-04: checks the new datasheet fields make possible', () => {
  it('array area: 32 × 2,278 mm × 1,134 mm = 82.66 m² — fits 90 m², refused on 80 m²', () => {
    expect(chk(buildProposal(input({ site: { usableAreaM2: 90, source: 'T survey' } })), 'array-area')).toMatchObject({ verdict: 'PASS', value: 82.66 });
    const p = buildProposal(input({ site: { usableAreaM2: 80, source: 'T survey' } }));
    expect(chk(p, 'array-area')?.verdict).toBe('REFUSE');
    expect(p.status).toBe('REFUSED');
    expect(p.sld.designValid).toBe(false);
    // Dimensions missing: shown as NOT checked, never as a pass.
    expect(chk(buildProposal(input({ mod: { lengthMm: undefined, widthMm: undefined }, site: { usableAreaM2: 80, source: 'T' } })), 'array-area')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('battery voltage: 51.2 V × 1 in series inside 40–60 V passes; 2 in series = 102.4 V is refused', () => {
    expect(chk(buildProposal(input()), 'battery-voltage')).toMatchObject({ verdict: 'PASS', value: 51.2 });
    expect(chk(buildProposal(input({ series: 2 })), 'battery-voltage')).toMatchObject({ verdict: 'REFUSE', value: 102.4 });
    expect(chk(buildProposal(input({ bat: { nominalV: undefined } })), 'battery-voltage')?.verdict).toBe('WARN');
  });
  it('battery current: 0.5 C × (5,000 Wh ÷ 51.2 V = 97.66 Ah) × 4 parallel = 195.3 A ≥ 150 A passes; 200 A is refused', () => {
    expect(chk(buildProposal(input()), 'battery-discharge-current')).toMatchObject({ verdict: 'PASS', limit: 195.31 });
    expect(chk(buildProposal(input({ inv: { batteryMaxDischargeA: 200 } })), 'battery-discharge-current')?.verdict).toBe('REFUSE');
  });
  it('REQ-05 arrangement: 4 units in strings of 3 is refused', () => {
    expect(chk(buildProposal(input({ series: 3 })), 'battery-arrangement')?.verdict).toBe('REFUSE');
  });
  it('battery temperature: 0–45 °C covers a 10–35 °C site; a 48 °C site warns (house it indoors)', () => {
    expect(chk(buildProposal(input()), 'battery-temperature')?.verdict).toBe('PASS');
    expect(chk(buildProposal(input({ temps: { recordLowC: 10, maxAmbientC: 48, source: 'T' } })), 'battery-temperature')?.verdict).toBe('WARN');
  });
  it('anti-islanding: grid-connected without a statement warns; with one passes; off-grid not checked', () => {
    expect(chk(buildProposal(input({ noBattery: true, connections: { grid: true, generator: false } })), 'anti-islanding')?.verdict).toBe('WARN');
    expect(chk(buildProposal(input({ noBattery: true, inv: { antiIslanding: 'IEC 62116 certificate T-1' }, connections: { grid: true, generator: false } })), 'anti-islanding')?.verdict).toBe('PASS');
    expect(chk(buildProposal(input({ noBattery: true })), 'anti-islanding')).toBeUndefined();
  });
  it('the battery datasheet facts are disclosed in the proposal', () => {
    expect(buildProposal(input()).disclosures.join(' ')).toContain('Battery (datasheet): LiFePO4, 51.2 V per unit, 6000 cycles at 90 % DoD, 10-year warranty; 4 units.');
  });
});

describe('REQ-04: datasheet import of the optional fields', () => {
  const P = { manufacturer: 'T', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20' };
  it('module dimensions', () => {
    const r = importModule({ ...P, model: 'M', pmaxW: '550', vocV: '49.5', iscA: '13.9', vmpV: '41.95', impA: '13.11', betaVocPct: '-0.27', betaVmpPct: '-0.35', alphaIscPct: '0.048', gammaPmaxPct: '-0.35', noctC: '45', maxSystemV: '1500', maxSeriesFuseA: '25', lengthMm: '2278', widthMm: '1134' });
    expect(r.errors).toEqual([]);
    expect(r.entry?.data).toMatchObject({ lengthMm: 2278, widthMm: 1134 });
  });
  it('inverter battery window, currents and anti-islanding; window order checked', () => {
    const base = { ...P, model: 'I', acKw: '15', maxDcV: '1000', mpptMinV: '200', mpptMaxV: '850', mpptCount: '2', maxInputA: '26', maxIscA: '40', batteryMaxDischargeKw: '', batteryMaxChargeKw: '', generatorCompatibility: '' };
    const r = importInverter({ ...base, batteryMinV: '40', batteryMaxV: '60', batteryMaxChargeA: '150', batteryMaxDischargeA: '150', antiIslanding: ' IEC 62116 ' });
    expect(r.errors).toEqual([]);
    expect(r.entry?.data).toMatchObject({ batteryMinV: 40, batteryMaxV: 60, batteryMaxChargeA: 150, batteryMaxDischargeA: 150, antiIslanding: 'IEC 62116' });
    expect(importInverter({ ...base, batteryMinV: '60', batteryMaxV: '40' }).errors.join(' ')).toMatch(/batteryMinV must be below/);
  });
  it('battery chemistry, voltage, cycle life, temperatures, warranty; bad values reported', () => {
    const base = { ...P, model: 'B', nominalKwh: '5', usableDoD: '0.9', dischargeEfficiency: '0.95', maxDischargeC: '0.5', maxChargeC: '0.5' };
    const r = importBattery({ ...base, chemistry: 'LiFePO4', nominalV: '51.2', cycleLife: '6000', cycleLifeDoD: '0.9', minTempC: '-10', maxTempC: '50', warrantyYears: '10' });
    expect(r.errors).toEqual([]);
    expect(r.entry?.data).toMatchObject({ chemistry: 'LiFePO4', nominalV: 51.2, cycleLife: 6000, cycleLifeDoD: 0.9, minTempC: -10, maxTempC: 50, warrantyYears: 10 });
    expect(importBattery({ ...base, cycleLifeDoD: '90' }).errors.join(' ')).toMatch(/cycleLifeDoD is a fraction/);
    expect(importBattery({ ...base, nominalV: 'abc' }).errors.join(' ')).toMatch(/nominalV/);
  });
});
