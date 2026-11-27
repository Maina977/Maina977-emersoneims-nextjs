/**
 * REQ-03 (P1-B §2 Load): monthly kWh from the bills, peak kW, largest motor
 * starting kVA, critical load, outage hours per day and the customer's
 * diesel price — entered with their source, carried to the proposal and used
 * by the checks they allow. TEST values only; nothing is filled in.
 */
import { describe, it, expect } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { loadFromForm } from '@/lib/solar/design/proposalForm';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import type { Module, Inverter, Battery } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';
import type { HybridResult } from '@/lib/solar/design/hybrid';

const MOD: Module = { model: 'T-mod', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'T' };
const INV: Inverter = { model: 'T-inv', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8, generatorCompatibility: null, datasheet: 'T' };
const BAT: Battery = { model: 'T-bat', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, datasheet: 'T' };
const prov = { manufacturer: 'T', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string) => ({ kind, id: `${kind}-t`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['T'], engineVersion: 't' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'T' });
const input = (o: Partial<Omit<ProposalInput, "battery">> & { withBattery?: boolean } = {}): ProposalInput => {
  const { withBattery = true, ...rest } = o;
  return {
    reference: 'T-03', client: { name: 'T', siteAddress: 'T', lat: -1.29, lon: 36.82 }, module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
    ...(withBattery ? { battery: { entry: entry(BAT, 'battery'), units: 4, requiredUsableAcKwh: 10 } } : {}),
    design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'T' }, cables: [], production,
    bom: [{ item: 'PV', model: 'T', quantity: 32, unit: 'No', rate: { valueKes: 1, source: 'T', date: '2026-11-01' } }],
    finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(1), lifetimeYears: 20 },
    ...rest,
  } as ProposalInput;
};
const chk = (p: ReturnType<typeof buildProposal>, id: string) => p.checks.find((k) => k.id === id);
const BILLS = [1600, 1550, 1700, 1650, 1600, 1500, 1450, 1500, 1600, 1700, 1650, 1700]; // Σ = 19,200 kWh

describe('REQ-03: load details', () => {
  it('annual consumption from 12 monthly bills: Σ = 19,200 kWh, disclosed with the source', () => {
    const p = buildProposal(input({ load: { monthlyKwh: BILLS, source: 'KPLC bills 2025 (T)' } }));
    expect(p.load?.annualKwhFromBills).toBe(19200);
    expect(p.disclosures.join(' ')).toContain('Load (KPLC bills 2025 (T)): 19,200 kWh a year from 12 monthly bills.');
  });
  it('backup inverter must carry the peak: 12 kW ≤ 15 kW passes; 18 kW is refused', () => {
    expect(chk(buildProposal(input({ load: { peakKw: 12, source: 'logger' } })), 'inverter-peak')?.verdict).toBe('PASS');
    const p = buildProposal(input({ load: { peakKw: 18, source: 'logger' } }));
    expect(chk(p, 'inverter-peak')?.verdict).toBe('REFUSE');
    expect(p.status).toBe('REFUSED');
    // A grid-tied system without a battery is not asked to carry the peak.
    expect(chk(buildProposal(input({ withBattery: false, load: { peakKw: 18, source: 'logger' } })), 'inverter-peak')).toBeUndefined();
  });
  it('critical backup: usable 5 × 4 × 0.9 × 0.95 = 17.1 kWh vs 3 kW × 5 h = 15 kWh passes; 3 kW × 6 h = 18 kWh warns', () => {
    expect(chk(buildProposal(input({ load: { criticalLoadKw: 3, outageHoursPerDay: 5, source: 'outage log' } })), 'critical-backup')).toMatchObject({ verdict: 'PASS', value: 17.1, limit: 15 });
    expect(chk(buildProposal(input({ load: { criticalLoadKw: 3, outageHoursPerDay: 6, source: 'outage log' } })), 'critical-backup')?.verdict).toBe('WARN');
  });
  it('a motor start on a backup inverter is shown as NOT checked (no surge rating in the library)', () => {
    expect(chk(buildProposal(input({ load: { motorStartingKva: 7.5, source: 'survey' } })), 'motor-start')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('the customer diesel price prices the hybrid generator fuel: 300 L × KES 180 = KES 54,000 a year', () => {
    const hybrid = { hours: 8760, totals: { loadKwh: 1, pvKwh: 1, pvToLoadKwh: 1, pvToBatteryKwh: 0, batteryToLoadKwh: 0, gridImportKwh: 0, gridExportKwh: 0, generatorKwh: 800, generatorToBatteryKwh: 0, generatorDumpedKwh: 0, generatorHours: 120, generatorFuelL: 300, generatorStarts: 1, curtailedKwh: 0, unservedKwh: 0, batteryLossKwh: 0 }, renewableFraction: 0, unservedHours: 0, finalSocFrac: null, balanceErrorKwh: 0, assumptions: [], engineVersion: 't' } as HybridResult;
    const p = buildProposal(input({ hybrid, load: { dieselKesPerLitre: { value: 180, source: 'customer receipt (T)' }, source: 'survey' } }));
    expect(p.disclosures.join(' ')).toContain('300 L × KES 180/L = KES 54,000 a year');
  });
  it('invalid or unsourced load details are refused', () => {
    expect(() => buildProposal(input({ load: { peakKw: 5, source: '' } }))).toThrow(/source/);
    expect(() => buildProposal(input({ load: { monthlyKwh: [1, 2, 3], source: 'bills' } }))).toThrow(/12 values/);
    expect(() => buildProposal(input({ load: { outageHoursPerDay: 30, source: 'log' } }))).toThrow(/0–24/);
  });
  it('form and request validation', () => {
    const errors: string[] = [];
    expect(loadFromForm({ 'l.monthlyKwh': BILLS.join(', '), 'l.peakKw': '12', 'l.diesel': '180', 'l.dieselSource': 'receipt', 'l.source': 'bills' }, errors))
      .toEqual({ source: 'bills', monthlyKwh: BILLS, peakKw: 12, dieselKesPerLitre: { value: 180, source: 'receipt' } });
    expect(errors).toEqual([]);
    expect(loadFromForm({}, errors)).toBeUndefined();
    loadFromForm({ 'l.monthlyKwh': '1 2 3', 'l.diesel': '180' }, errors);
    expect(errors.length).toBe(3); // source, 12 months, diesel source
    expect('error' in checkProposalRequest({ format: 'json', input: input({ load: { peakKw: 12, source: 'logger' } }) })).toBe(false);
    const bad = checkProposalRequest({ format: 'json', input: { ...input(), load: { peakKw: 'x', source: 'logger' } } });
    expect('error' in bad ? bad.error : '').toMatch(/load must be/);
  });
});
