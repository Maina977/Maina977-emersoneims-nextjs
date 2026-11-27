/**
 * Independent reviewer probes for CA-32 @ ccdb2404, added as given (only an unused checkBattery import removed for eslint).
 * Hand-worked values in REVIEW-SOLAR-CA32.md. TEST components only.
 */
import { describe, it, expect } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { validateStrings, generatorConnectionChecks, type Module, type Inverter, type Battery } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

const MOD: Module = { model: 'R-mod', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'R mod' };
const INV: Inverter = { model: 'R-inv', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, datasheet: 'R inv' };
const BAT: Battery = { model: 'R-bat', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, datasheet: 'R bat' };
const prov = { manufacturer: 'R', datasheetUrl: 'https://example.com/r.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string) => ({ kind, id: `${kind}-r`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['R'], engineVersion: 'r' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'R' });
const base = (o: Partial<ProposalInput> & { mod?: Partial<Module>; inv?: Partial<Inverter> } = {}): ProposalInput => {
  const { mod, inv, ...rest } = o;
  return {
    reference: 'R', client: { name: 'R', siteAddress: 'R', lat: -1.29, lon: 36.82 }, module: entry({ ...MOD, ...mod }, 'module'), inverter: entry({ ...INV, ...inv }, 'inverter'),
    design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'R' }, cables: [], production,
    bom: [{ item: 'PV', model: 'R', quantity: 32, unit: 'No', rate: { valueKes: 1, source: 'R', date: '2026-11-01' } }],
    finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(1), lifetimeYears: 20 },
    ...rest,
  } as ProposalInput;
};
const ids = (p: ReturnType<typeof buildProposal>) => p.checks.filter((k) => k.verdict === 'REFUSE').map((k) => k.id);
const val = (p: ReturnType<typeof buildProposal>, id: string) => p.checks.find((k) => k.id === id)?.value;

describe('hand-derived values agree with the engine', () => {
  it('16-module string: cold Voc 824.08 V, hot Vmp 568.13 V, cold Vmp 698.86 V', () => {
    const r = validateStrings(MOD, INV, { modulesPerString: 16, stringsPerMppt: [1, 1] }, { recordLowC: 10, maxAmbientC: 35 });
    const v = (id: string) => r.checks.find((c) => c.id === id)!.value;
    expect(v('cold-voc')).toBeCloseTo(49.5 * 1.0405 * 16, 1); // 824.08
    expect(v('hot-vmp')).toBeCloseTo(41.5 * (1 - 0.0035 * 41.25) * 16, 1); // 568.13
    expect(v('cold-vmp')).toBeCloseTo(41.5 * 1.0525 * 16, 1); // 698.86
  });
  it('boundary: 19 modules at 10 C = 978.6 V passes; at -5 C = 1,016.7 V refuses; 20 at 10 C refuses', () => {
    expect(ids(buildProposal(base({ design: { modulesPerString: 19, stringsPerMppt: [1, 1] } })))).not.toContain('cold-voc');
    expect(ids(buildProposal(base({ design: { modulesPerString: 19, stringsPerMppt: [1, 1] }, temps: { recordLowC: -5, maxAmbientC: 35, source: 'R' } })))).toContain('cold-voc');
    expect(val(buildProposal(base({ design: { modulesPerString: 20, stringsPerMppt: [1, 1] } })), 'cold-voc')).toBeCloseTo(1030.1, 1);
  });
  it('Isc x 1.25: 2 strings 34.75 A passes 40 A; 3 strings 52.13 A refuses', () => {
    expect(ids(buildProposal(base({ design: { modulesPerString: 16, stringsPerMppt: [2, 1] } })))).not.toContain('isc-mppt1');
    expect(val(buildProposal(base({ design: { modulesPerString: 16, stringsPerMppt: [3, 1] } })), 'isc-mppt1')).toBeCloseTo(52.13, 1);
  });
  it('fuse window: 1.5 x 13.9 = 20.85 A vs max series fuse 21 A passes, 20 A refuses', () => {
    const d = { design: { modulesPerString: 16, stringsPerMppt: [3, 1] }, inv: { maxInputA: 45, maxIscA: 60 } };
    expect(ids(buildProposal(base({ ...d, mod: { maxSeriesFuseA: 21 } })))).not.toContain('fuse-window-mppt1');
    expect(ids(buildProposal(base({ ...d, mod: { maxSeriesFuseA: 20 } })))).toContain('fuse-window-mppt1');
  });
  it('C-rate boundary: 10 kW on 20 kWh = 0.5 C passes; 10.1 kW refuses', () => {
    expect(ids(buildProposal(base({ inv: { batteryMaxDischargeKw: 10, batteryMaxChargeKw: 10 }, battery: { entry: entry(BAT, 'battery'), units: 4, requiredUsableAcKwh: 10 } })))).toEqual([]);
    expect(ids(buildProposal(base({ inv: { batteryMaxDischargeKw: 10.1, batteryMaxChargeKw: 10 }, battery: { entry: entry(BAT, 'battery'), units: 4, requiredUsableAcKwh: 10 } })))).toContain('battery-discharge-c');
  });
  it('battery energy boundary: need 8.55 kWh usable = 10 kWh nominal exactly passes on 2 units', () => {
    const p = buildProposal(base({ inv: { batteryMaxDischargeKw: 5, batteryMaxChargeKw: 5 }, battery: { entry: entry(BAT, 'battery'), units: 2, requiredUsableAcKwh: 8.55 } }));
    expect(ids(p)).not.toContain('battery-energy');
  });
  it('OEM minimum load given: 25 % of 20 = 5 kW; 4.9 kW site load warns', () => {
    const c = generatorConnectionChecks({ ...INV, generatorCompatibility: 'x' }, { generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 4.9, generatorOemMinLoadPct: 25, pvCanBackfeedGenerator: false });
    expect(c.find((k) => k.id === 'gen-min-load')).toMatchObject({ verdict: 'WARN', limit: 5 });
  });
});

describe('adversarial probes (findings are reported, not asserted as pass)', () => {
  const run = (inv: Partial<Inverter>) => buildProposal(base({ inv, battery: { entry: entry(BAT, 'battery'), units: 4, requiredUsableAcKwh: 10 } }));
  it('PROBE-1 inverter battery power 0 or negative', () => {
    const out = [0, -5].map((kw) => { const p = run({ batteryMaxDischargeKw: kw, batteryMaxChargeKw: kw }); return { kw, status: p.status, refused: ids(p), valid: p.sld.designValid }; });
    console.log('PROBE-1', JSON.stringify(out));
  });
  it('PROBE-2 generator compatibility "   " or "not supported"', () => {
    const out = ['   ', 'NOT supported'].map((g) => {
      const p = buildProposal(base({ inv: { generatorCompatibility: g }, connections: { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 8, pvCanBackfeedGenerator: false } }));
      return { g, refused: ids(p), valid: p.sld.designValid };
    });
    console.log('PROBE-2', JSON.stringify(out));
  });
  it('PROBE-3 generator: false explicitly while the hybrid runs one', () => {
    const hybrid = { hours: 8760, totals: { generatorKwh: 10, generatorHours: 2 }, engineVersion: 'r' } as never;
    const p = buildProposal(base({ hybrid, connections: { grid: true, generator: false } }));
    console.log('PROBE-3', JSON.stringify({ status: p.status, refused: ids(p), valid: p.sld.designValid }));
    expect(p.status).toBe('REFUSED');
  });
  it('PROBE-4 battery datasheet invalid (units 0): not marked valid', () => {
    const p = buildProposal(base({ inv: { batteryMaxDischargeKw: 5, batteryMaxChargeKw: 5 }, battery: { entry: entry(BAT, 'battery'), units: 0, requiredUsableAcKwh: 10 } }));
    console.log('PROBE-4', JSON.stringify({ status: p.status, valid: p.sld.designValid, reasons: p.statusReasons.filter((r) => /Battery/.test(r)) }));
    expect(p.sld.designValid).toBe(false);
    expect(p.status).not.toBe('FOR ISSUE');
  });
  it('PROBE-5 cable design current entered below the string current it carries', () => {
    // 3 strings x 13.9 x 1.25 = 52.1 A would need It*Ca*Cg >= 52.1; the engine takes the designer's 20 A.
    const p = buildProposal(base({ inv: { maxInputA: 45, maxIscA: 60 }, design: { modulesPerString: 16, stringsPerMppt: [3, 1] }, cables: [{ name: 'DC', lengthM: 10, csaMm2: 4, designCurrentA: 20, systemV: 600, tabulatedAmpacityA: 32, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3 }] }));
    console.log('PROBE-5', JSON.stringify({ refused: ids(p), valid: p.sld.designValid }));
  });
});
