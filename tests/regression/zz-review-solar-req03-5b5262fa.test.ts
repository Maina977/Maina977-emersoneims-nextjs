/**
 * Independent review probes for 5b5262fa (REQ-03 load details). TEST data only.
 * Tests named "FINDING" assert what the company rules require.
 */
import { describe, it, expect } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import type { Module, Inverter, Battery } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';
import type { HybridResult } from '@/lib/solar/design/hybrid';
import { loadFromForm, formToProposalInput } from '@/lib/solar/design/proposalForm';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';

const MOD: Module = { model: 'R-mod', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'R' };
const INV: Inverter = { model: 'R-inv', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8, generatorCompatibility: null, datasheet: 'R' };
const BAT: Battery = { model: 'R-bat', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, datasheet: 'R' };
const prov = { manufacturer: 'R', datasheetUrl: 'https://example.com/r.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string) => ({ kind, id: `${kind}-r`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['R'], engineVersion: 'r' } as unknown as HourlyResult;
const s = (value: number, source = 'R') => ({ value, source });
const input = (o: Partial<ProposalInput> = {}, battery = true): ProposalInput => ({
  reference: 'R-3', client: { name: 'R', siteAddress: 'R', lat: -1.29, lon: 36.82 }, module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  ...(battery ? { battery: { entry: entry(BAT, 'battery'), units: 4, requiredUsableAcKwh: 10 } } : {}),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'R' }, cables: [], production,
  bom: [{ item: 'PV', model: 'R', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'R quote', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
  ...o,
});
const chk = (p: ReturnType<typeof buildProposal>, id: string) => p.checks.find((k) => k.id === id);

describe('REQ-03: hand-worked checks', () => {
  it('peak 15 kW on 1 × 15 kW passes (equal); 15.1 kW is refused; 2 inverters carry 30 kW', () => {
    expect(chk(buildProposal(input({ load: { peakKw: 15, source: 'R logger' } })), 'inverter-peak')?.verdict).toBe('PASS');
    const p = buildProposal(input({ load: { peakKw: 15.1, source: 'R logger' } }));
    expect(chk(p, 'inverter-peak')?.verdict).toBe('REFUSE');
    expect(p.status).toBe('REFUSED');
    expect(chk(buildProposal(input({ inverterCount: 2, design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, load: { peakKw: 30, source: 'R' } })), 'inverter-peak')?.verdict).toBe('PASS');
  });
  it('critical backup: 5 × 4 × 0.9 × 0.95 = 17.1 kWh; 3 kW × 5.7 h = 17.1 passes; 3 × 6 = 18 warns', () => {
    expect(chk(buildProposal(input({ load: { criticalLoadKw: 3, outageHoursPerDay: 5.7, source: 'R' } })), 'critical-backup')).toMatchObject({ verdict: 'PASS', value: 17.1, limit: 17.1 });
    expect(chk(buildProposal(input({ load: { criticalLoadKw: 3, outageHoursPerDay: 6, source: 'R' } })), 'critical-backup')).toMatchObject({ verdict: 'WARN', limit: 18 });
  });
  it('annual from bills = sum of 12 months', () => {
    const p = buildProposal(input({ load: { monthlyKwh: [1500, 1500, 1600, 1600, 1600, 1600, 1600, 1600, 1700, 1700, 1600, 1600], source: 'KPLC bills' } }));
    expect(p.load?.annualKwhFromBills).toBe(19200);
  });
});

describe('REQ-03: missing / zero / negative / unsourced', () => {
  it('diesel price without a source, blank source, 0 or negative is refused, never used', () => {
    expect(() => buildProposal(input({ load: { dieselKesPerLitre: s(180, ''), source: 'R' } }))).toThrow(/Diesel/);
    expect(() => buildProposal(input({ load: { dieselKesPerLitre: s(180, '  '), source: 'R' } }))).toThrow(/Diesel/);
    expect(() => buildProposal(input({ load: { dieselKesPerLitre: s(0, 'pump'), source: 'R' } }))).toThrow(/Diesel/);
    expect(() => buildProposal(input({ load: { dieselKesPerLitre: s(-180, 'pump'), source: 'R' } }))).toThrow(/Diesel/);
    const e: string[] = [];
    const l = loadFromForm({ 'l.diesel': '180', 'l.source': 'R' }, e);
    expect(l?.dieselKesPerLitre).toBeUndefined();
    expect(e.join(' ')).toMatch(/Diesel price needs/);
  });
  it('diesel without a hybrid generator: no fuel cost line is invented', () => {
    const p = buildProposal(input({ load: { dieselKesPerLitre: s(180, 'pump receipt'), source: 'R' } }));
    expect(p.disclosures.join(' ')).not.toMatch(/Generator fuel in the hybrid balance/);
  });
  it('fuel cost: 300 L × 180 = KES 54,000 at the customer price', () => {
    const hybrid = { totals: { generatorFuelL: 300, generatorKwh: 0, generatorHours: 0, pvToLoadKwh: 10000, batteryToLoadKwh: 0, pvToBatteryKwh: 0, generatorToBatteryKwh: 0, gridExportKwh: 0 } } as unknown as HybridResult;
    const p = buildProposal(input({ hybrid, load: { dieselKesPerLitre: s(180, 'pump receipt'), source: 'R' } }));
    expect(p.disclosures.join(' ')).toContain('300 L × KES 180/L = KES 54,000');
  });
  it('negative peak, outage over 24 h, 11 monthly values, NaN critical load, no source: refused', () => {
    expect(() => buildProposal(input({ load: { peakKw: -1, source: 'R' } }))).toThrow(/Peak/);
    expect(() => buildProposal(input({ load: { outageHoursPerDay: 25, source: 'R' } }))).toThrow(/Outage/);
    expect(() => buildProposal(input({ load: { monthlyKwh: Array(11).fill(100), source: 'R' } }))).toThrow(/12/);
    expect(() => buildProposal(input({ load: { monthlyKwh: [...Array(11).fill(100), -1], source: 'R' } }))).toThrow(/12/);
    expect(() => buildProposal(input({ load: { criticalLoadKw: NaN, source: 'R' } }))).toThrow(/Critical/);
    expect(() => buildProposal(input({ load: { peakKw: 5, source: '' } }))).toThrow(/source/);
  });
  it('nothing is filled in: a blank load group gives no load; a source alone gives no load', () => {
    const e: string[] = [];
    expect(loadFromForm({}, e)).toBeUndefined();
    expect(loadFromForm({ 'l.source': 'bills' }, e)).toBeUndefined();
    expect(e).toEqual([]);
    const p = buildProposal(input());
    expect(p.load).toBeNull();
    for (const id of ['inverter-peak', 'motor-start', 'critical-backup']) expect(chk(p, id)).toBeUndefined();
    const r = formToProposalInput({} as never, [], null as never, null as never);
    expect(r.input === null || r.input.load === undefined).toBe(true);
  });
  it('motor start is WARN "not checked", never PASS, even at 0 kVA', () => {
    expect(chk(buildProposal(input({ load: { motorStartingKva: 0, source: 'R' } })), 'motor-start')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('grid-tied without a battery: peak is not compared (inverter is not the supply) — no check, no pass', () => {
    expect(chk(buildProposal(input({ load: { peakKw: 99, source: 'R' }, connections: { grid: true, generator: false } }, false)), 'inverter-peak')).toBeUndefined();
  });
  it('the request validator rejects a string peak and a diesel price with no source field', () => {
    expect('error' in checkProposalRequest({ format: 'json', input: input({ load: { peakKw: '5' as unknown as number, source: 'R' } }) })).toBe(true);
    expect('error' in checkProposalRequest({ format: 'json', input: input({ load: { dieselKesPerLitre: { value: 180 } as never, source: 'R' } }) })).toBe(true);
  });
  it('FINDING: critical load given but outage hours missing → a visible "not checked", not silence', () => {
    const p = buildProposal(input({ load: { criticalLoadKw: 3, source: 'R' } }));
    expect(chk(p, 'critical-backup'), 'critical-backup silently omitted when outage hours are missing').toBeDefined();
  });
  it('FINDING: critical load and outages stated but no battery → the proposal says it is not backed up', () => {
    const p = buildProposal(input({ load: { criticalLoadKw: 3, outageHoursPerDay: 6, source: 'R' }, connections: { grid: true, generator: false } }, false));
    expect(chk(p, 'critical-backup'), 'no check and no warning that 18 kWh of critical outage load has no backup').toBeDefined();
  });
});
