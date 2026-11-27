/**
 * Re-review probes at f735c88f: the fixes for M1–M5 (Q1–Q5) and advisories
 * A1–A4. TEST data only; no network. "FINDING" = what the company rules require.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { importModule, importBattery } from '@/lib/solar/design/datasheet';
import { componentChecks, type Module, type Inverter, type Battery } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';
import type { HybridResult } from '@/lib/solar/design/hybrid';
import { formToProposalInput } from '@/lib/solar/design/proposalForm';

const MOD: Module = { model: 'R-mod', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, lengthMm: 2278, widthMm: 1134, datasheet: 'R' };
const INV: Inverter = { model: 'R-inv', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8, batteryMinV: 40, batteryMaxV: 60, batteryMaxDischargeA: 150, batteryMaxChargeA: 150, generatorCompatibility: null, datasheet: 'R' };
// 16S LFP: 16 × 3.2 = 51.2 V nominal, 16 × 3.6 = 57.6 V charge, 16 × 2.8 = 44.8 V cut-off. One unit = one 16S module.
const LFP16: Battery = { model: 'R-16S', nominalKwh: 5.12, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, nominalV: 51.2, chargeV: 57.6, cutoffV: 44.8, datasheet: 'R' };
const prov = { manufacturer: 'R', datasheetUrl: 'https://example.com/r.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const P = { manufacturer: 'R', datasheetUrl: 'https://example.com/r.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string) => ({ kind, id: `${kind}-r`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['R'], engineVersion: 'r' } as unknown as HourlyResult;
const s = (value: number, source = 'R') => ({ value, source });
const input = (o: Partial<ProposalInput> = {}, battery = true): ProposalInput => ({
  reference: 'R-RR', client: { name: 'R', siteAddress: 'R', lat: -1.29, lon: 36.82 }, module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  ...(battery ? { battery: { entry: entry(LFP16, 'battery'), units: 2, requiredUsableAcKwh: 5 } } : {}),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'R' }, cables: [], production,
  bom: [{ item: 'PV', model: 'R', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'R quote', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
  ...o,
});
const cc = (o: Partial<Parameters<typeof componentChecks>[0]> = {}) => componentChecks({ module: MOD, inverter: INV, modules: 32, temps: { recordLowC: 10, maxAmbientC: 35 }, grid: null, battery: { data: LFP16, units: 2 }, ...o });
const get = (c: ReturnType<typeof componentChecks>, id: string) => c.find((k) => k.id === id);

describe('A2 hand check: 16S LFP 57.6 V / 44.8 V', () => {
  it('40–60 V window: nominal 51.2 V, charge 57.6 V ≤ 60, cut-off 44.8 V ≥ 40 → both PASS', () => {
    const c = cc();
    expect(get(c, 'battery-voltage')).toMatchObject({ verdict: 'PASS', value: 51.2, title: 'Nominal bank voltage inside the inverter battery window' });
    expect(get(c, 'battery-voltage-range')).toMatchObject({ verdict: 'PASS' });
    expect(get(c, 'battery-voltage-range')!.formula).toContain('57.6 V ≤ 60 V');
    expect(get(c, 'battery-voltage-range')!.formula).toContain('44.8 V ≥ 40 V');
  });
  it('40–56 V window: nominal 51.2 V still PASSES, but charge 57.6 V > 56 V → REFUSE (value 57.6, limit 56)', () => {
    const c = cc({ inverter: { ...INV, batteryMaxV: 56 } });
    expect(get(c, 'battery-voltage')?.verdict).toBe('PASS');
    expect(get(c, 'battery-voltage-range')).toMatchObject({ verdict: 'REFUSE', value: 57.6, limit: 56 });
    const p = buildProposal(input({ inverter: entry({ ...INV, batteryMaxV: 56 }, 'inverter') }));
    expect(p.status).toBe('REFUSED');
  });
  it('cut-off below the window minimum: 46–60 V window refuses 44.8 V', () => {
    expect(get(cc({ inverter: { ...INV, batteryMinV: 46 } }), 'battery-voltage-range')).toMatchObject({ verdict: 'REFUSE', value: 44.8, limit: 46 });
  });
  it('charge / cut-off missing → WARN not checked (never PASS)', () => {
    expect(get(cc({ battery: { data: { ...LFP16, chargeV: undefined }, units: 2 } }), 'battery-voltage-range')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
    expect(get(cc({ battery: { data: { ...LFP16, cutoffV: -1 }, units: 2 } }), 'battery-voltage-range')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('import refuses cut-off ≥ charge', () => {
    const base = { ...P, model: 'B', nominalKwh: '5.12', usableDoD: '0.9', dischargeEfficiency: '0.95', maxDischargeC: '0.5', maxChargeC: '0.5', nominalV: '51.2' };
    expect(importBattery({ ...base, chargeV: '44.8', cutoffV: '57.6' }).errors.join(' ')).toMatch(/cutoffV must be below chargeV/);
    expect(importBattery({ ...base, chargeV: '57.6', cutoffV: '44.8' }).errors).toEqual([]);
  });
  it('FINDING: swapped charge/cut-off sent as JSON must not PASS a 40–56 V window', () => {
    // The import refuses the swap, but the JSON request path does not re-run the import.
    const c = cc({ inverter: { ...INV, batteryMaxV: 56 }, battery: { data: { ...LFP16, chargeV: 44.8, cutoffV: 57.6 }, units: 2 } });
    expect(get(c, 'battery-voltage-range')?.verdict, 'swapped values: 57.6 V is above 56 V, yet the check passes').not.toBe('PASS');
  });
});

describe('Q1–Q5 fixed (spot checks beyond the zz probes)', () => {
  it('Q1/Q2: width NaN / Infinity / 3,501 mm → not checked; 300 and 3,500 mm accepted', () => {
    for (const w of [NaN, Infinity, 3501, 299]) expect(get(cc({ module: { ...MOD, widthMm: w }, usableAreaM2: 100 }), 'array-area')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
    expect(get(cc({ module: { ...MOD, lengthMm: 3500, widthMm: 300 }, usableAreaM2: 100 }), 'array-area')?.verdict).toBe('PASS');
    const r = importModule({ ...P, model: 'M', pmaxW: '550', vocV: '49.5', iscA: '13.9', vmpV: '41.95', impA: '13.11', betaVocPct: '-0.27', betaVmpPct: '-0.35', alphaIscPct: '0.048', gammaPmaxPct: '-0.35', noctC: '45', maxSystemV: '1500', maxSeriesFuseA: '25', lengthMm: '2278', widthMm: '1.134' });
    expect(r.errors.join(' ')).toMatch(/widthMm/);
  });
  it('Q3: both current checks shown as not checked when nominal V is missing; each when its current is missing', () => {
    const c = cc({ battery: { data: { ...LFP16, nominalV: undefined }, units: 2 } });
    expect(get(c, 'battery-discharge-current')?.verdict).toBe('WARN');
    expect(get(c, 'battery-charge-current')?.verdict).toBe('WARN');
    const d = cc({ inverter: { ...INV, batteryMaxChargeA: 0 } });
    expect(get(d, 'battery-charge-current')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
    expect(get(d, 'battery-discharge-current')?.formula).not.toBe('not checked'); // the other direction is still worked out
  });
  it('Q3 hand check: 5.12 kWh / 51.2 V = 100 Ah; 0.5 C × 100 Ah × 2 strings = 100 A < 150 A inverter port → REFUSE', () => {
    expect(get(cc(), 'battery-discharge-current')).toMatchObject({ verdict: 'REFUSE', value: 150, limit: 100 });
    expect(get(cc({ battery: { data: LFP16, units: 4 } }), 'battery-discharge-current')).toMatchObject({ verdict: 'PASS', limit: 200 });
  });
  it('Q4: series "0" and "2.5" are reported; blank is not', () => {
    for (const v of ['0', '2.5', '-2']) expect(formToProposalInput({ 'b.model': 'B', 'b.seriesPerString': v } as never, [], null as never, null as never).errors.join(' ')).toMatch(/units in series per string must be a whole number/);
    expect(formToProposalInput({ 'b.model': 'B' } as never, [], null as never, null as never).errors.join(' ')).not.toMatch(/units in series/);
  });
  it('Q5: critical load 0 with no battery → nothing claimed; 3 kW × 6 h with no battery → WARN NOT backed up 18 kWh', () => {
    const p = buildProposal(input({ load: { criticalLoadKw: 3, outageHoursPerDay: 6, source: 'R' } }, false));
    expect(p.checks.find((k) => k.id === 'critical-backup')).toMatchObject({ verdict: 'WARN', limit: 18 });
    expect(p.checks.find((k) => k.id === 'critical-backup')!.note).toMatch(/18 kWh of critical load during outages is NOT backed up/);
    expect(buildProposal(input({ load: { criticalLoadKw: 0, outageHoursPerDay: 6, source: 'R' } }, false)).checks.find((k) => k.id === 'critical-backup')).toBeUndefined();
  });
});

describe('A1, A3, A4 wording', () => {
  it('A1: Excel capital cost names the unquoted items', async () => {
    const i = input(); i.bom.push({ item: 'Mounting', model: 'R', quantity: 1, unit: 'lot', rate: null });
    const { proposalToXlsx } = await import('@/lib/solar/design/proposalExport');
    const ExcelJS = (await import('exceljs')).default;
    const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await proposalToXlsx(buildProposal(i)) as unknown as ArrayBuffer);
    const cells: string[] = []; wb.getWorksheet('Equipment & costs')!.eachRow((r) => r.eachCell((c) => { cells.push(String(c.value)); }));
    expect(cells).toContain('No total: request a quotation for Mounting');
  }, 30000);
  it('A2 label: the area check says gross and before row spacing', () => {
    const a = get(cc({ usableAreaM2: 100 }), 'array-area')!;
    expect(a.title).toBe('Gross module area (before row spacing and access) fits the usable area');
    expect(a.formula).toMatch(/a PASS does not mean the layout fits/);
  });
  it('A3: the fuel-cost disclosure says it is not in NPV / IRR / payback', () => {
    const hybrid = { totals: { generatorFuelL: 300, generatorKwh: 0, generatorHours: 0, pvToLoadKwh: 10000, batteryToLoadKwh: 0, pvToBatteryKwh: 0, generatorToBatteryKwh: 0, gridExportKwh: 0 } } as unknown as HybridResult;
    const d = buildProposal(input({ hybrid, load: { dieselKesPerLitre: s(180, 'pump receipt'), source: 'R' } })).disclosures.join(' ');
    expect(d).toContain('300 L × KES 180/L = KES 54,000');
    expect(d).toMatch(/NOT in the (cash flow|NPV)/i);
    expect(d).toMatch(/IRR/);
    expect(d).toMatch(/payback/i);
  });
  it('A4: the DoD table is labelled assumed practice on screen (both uses)', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'components/hub/SimulatorClient.tsx'), 'utf8');
    expect(src).toMatch(/ASSUMED PRACTICE, not a cited source/);
    expect(src).toContain('label="Usable DoD (assumed practice; use the datasheet)"');
    expect(src).toMatch(/% usable \(assumed practice\)/);
    // every other on-screen use of CHEM_DOD (bank runtime) is not a labelled figure; listed for the record
    const uses = src.split('\n').filter((l) => /CHEM_DOD\[/.test(l)).length;
    expect(uses).toBeGreaterThanOrEqual(3);
  });
});
