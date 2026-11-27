/**
 * Independent reviewer probes for 39fa8535 (CA-32 review G1-G4 fixes).
 * TEST components only; no network (fetch stubbed to throw).
 * Each probe prints one "PROBE ..." JSON line so the log is the evidence.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import { importInverter } from '@/lib/solar/design/datasheet';
import { buildSld } from '@/lib/solar/design/sld';
import { sldPreviewFromForm, formToProposalInput, cableKindFromForm, WORKED_EXAMPLE_FORM } from '@/lib/solar/design/proposalForm';
import type { Module, Inverter, Battery, CableRun } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

beforeAll(() => { vi.stubGlobal('fetch', () => { throw new Error('network disabled in review probes'); }); });

const MOD: Module = { model: 'TEST-module-550', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'TEST module rev A' };
const INV: Inverter = { model: 'TEST-inverter-15', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, datasheet: 'TEST inverter rev B' };
const BAT: Battery = { model: 'TEST-LFP-5', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, datasheet: 'TEST battery rev C' };
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', verifiedBy: 'test-2', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['TEST year'], engineVersion: 'solar-hourly test' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'TEST source' });
const GEN_OK = 'TEST datasheet section 4: generator input supported';
const GEN_CONN = { grid: false, generator: true, generatorRatedKw: 20, generatorMinSiteLoadKw: 8, pvCanBackfeedGenerator: false } as const;

type Over = Record<string, unknown> & { mod?: Partial<Module>; inv?: Record<string, unknown> };
const design = (o: Over = {}): ProposalInput => {
  const { mod, inv, ...rest } = o;
  return {
    reference: 'TEST-REVIEW', client: { name: 'TEST client', siteAddress: 'TEST site', lat: -1.29, lon: 36.82 },
    module: entry({ ...MOD, ...mod }, 'module'), inverter: entry({ ...INV, ...inv }, 'inverter'),
    design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'TEST station record' },
    cables: [], production,
    bom: [{ item: 'PV modules', model: 'TEST', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'TEST quote', date: '2026-11-01' } }],
    finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
    ...rest,
  } as unknown as ProposalInput;
};
const battery = (units: number, need: number) => ({ entry: entry(BAT, 'battery'), units, requiredUsableAcKwh: need });

/** The API path: JSON over the wire (unless raw), checkProposalRequest, then buildProposal (route.ts maps a throw to 400). */
function viaApi(input: ProposalInput, raw = false) {
  const body = raw ? { input, format: 'json' } : JSON.parse(JSON.stringify({ input, format: 'json' }));
  const parsed = checkProposalRequest(body);
  if ('error' in parsed) return { http: 400, error: parsed.error.slice(0, 140) };
  try {
    const p = buildProposal(parsed.input, null);
    return { http: 200, status: p.status, refused: p.checks.filter((k) => k.verdict === 'REFUSE').map((k) => k.id), designValid: p.sld.designValid };
  } catch (e) { return { http: 400, error: String((e as Error).message).slice(0, 140) }; }
}
const summary = (p: ReturnType<typeof buildProposal>) => ({ status: p.status, refused: p.checks.filter((k) => k.verdict === 'REFUSE').map((k) => k.id), designValid: p.sld.designValid });
const log = (name: string, v: unknown) => console.log(`PROBE ${name} ${JSON.stringify(v)}`);

describe('G1: inverter battery power not > 0 is never a pass (API request path)', () => {
  for (const kw of [0, -5, Number.NaN, Number.POSITIVE_INFINITY, '5'] as unknown[]) {
    it(`discharge = charge = ${String(kw)} (JSON) and raw object`, () => {
      const inp = design({ inv: { batteryMaxDischargeKw: kw, batteryMaxChargeKw: kw }, battery: battery(4, 10) });
      const json = viaApi(inp), raw = viaApi(inp, true);
      log(`G1 kw=${String(kw)}`, { json, raw });
      for (const r of [json, raw]) {
        if (r.http === 200) {
          expect(r.status).toBe('REFUSED');
          expect(r.refused).toEqual(expect.arrayContaining(['battery-discharge-c', 'battery-charge-c']));
          expect(r.designValid).toBe(false);
        }
      }
    });
  }
  it('one direction bad only: discharge 8 kW (0.40 C PASS), charge 0 kW → charge refused', () => {
    const r = viaApi(design({ inv: { batteryMaxDischargeKw: 8, batteryMaxChargeKw: 0 }, battery: battery(4, 10) }));
    log('G1 mixed', r);
    expect(r.refused).toEqual(['battery-charge-c']);
  });
  it('control: 8 kW / 20 kWh = 0.40 C both ways is not refused via the API', () => {
    const r = viaApi(design({ inv: { batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8 }, battery: battery(4, 10) }));
    log('G1 control', r);
    expect(r.refused).toEqual([]); expect(r.designValid).toBe(true);
  });
});

describe('G2: blank generator-compatibility statement is no statement', () => {
  for (const g of [' ', '\t', '\n', ' \t\n ']) {
    it(`engine: ${JSON.stringify(g)}`, () => {
      const p = buildProposal(design({ inv: { generatorCompatibility: g }, connections: { ...GEN_CONN } }));
      const r = summary(p); log(`G2 engine ${JSON.stringify(g)}`, r);
      expect(r.status).toBe('REFUSED'); expect(r.refused).toContain('gen-compat'); expect(r.designValid).toBe(false);
      const api = viaApi(design({ inv: { generatorCompatibility: g }, connections: { ...GEN_CONN } }));
      expect(api.refused).toContain('gen-compat');
    });
    it(`importInverter: ${JSON.stringify(g)} stored as null`, () => {
      const r = importInverter({ manufacturer: 'TEST', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', model: 'T', acKw: '15', maxDcV: '1000', mpptMinV: '200', mpptMaxV: '850', mpptCount: '2', maxInputA: '26', maxIscA: '40', batteryMaxDischargeKw: '', batteryMaxChargeKw: '', generatorCompatibility: g });
      log(`G2 import ${JSON.stringify(g)}`, { gc: r.entry?.data.generatorCompatibility, warnings: r.entry?.warnings });
      expect(r.entry?.data.generatorCompatibility).toBeNull();
    });
  }
  it('non-string statement via the API (123, true, {}) is a 400, never valid', () => {
    const out = [123, true, {}].map((g) => viaApi(design({ inv: { generatorCompatibility: g }, connections: { ...GEN_CONN } })));
    log('G2 non-string', out);
    for (const r of out) expect(r.http === 400 || r.designValid === false).toBe(true);
  });
  it('control: a real statement passes gen-compat', () => {
    const r = summary(buildProposal(design({ inv: { generatorCompatibility: GEN_OK }, connections: { ...GEN_CONN } })));
    expect(r.refused).toEqual([]);
  });
});

const cable = (o: Partial<CableRun> = {}): CableRun => ({ name: 'DC', lengthM: 10, csaMm2: 4, designCurrentA: 20, systemV: 600, tabulatedAmpacityA: 32, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3, ...o });
const three = { inv: { maxInputA: 45, maxIscA: 60 }, design: { modulesPerString: 16, stringsPerMppt: [3, 1] } };

describe('G3: PV cable design current tied to strings × Isc × 1.25', () => {
  it('3 × 13.9 × 1.25 = 52.125 A; 20 A entered on 4 mm² (Iz 32 A) → refused (no kind / dc-pv / dc-pv mppt 1)', () => {
    for (const extra of [{}, { kind: 'dc-pv' as const }, { kind: 'dc-pv' as const, mppt: 1 }]) {
      const p = buildProposal(design({ ...three, cables: [cable(extra)] }));
      const k = p.checks.find((c) => c.id === 'cable-current-DC');
      log(`G3 ${JSON.stringify(extra)}`, { ...summary(p), value: k?.value, limit: k?.limit });
      expect(k?.limit).toBe(52.13);
      expect(p.status).toBe('REFUSED'); expect(p.sld.designValid).toBe(false);
    }
  });
  it('MPPT 2 (1 string: 17.375 A) at 20 A passes; MPPT 3 (not in design) refused', () => {
    const ok = summary(buildProposal(design({ ...three, cables: [cable({ kind: 'dc-pv', mppt: 2 })] })));
    const bad = summary(buildProposal(design({ ...three, cables: [cable({ kind: 'dc-pv', mppt: 3 })] })));
    log('G3 mppt2', ok); log('G3 mppt3', bad);
    expect(ok.refused).toEqual([]); expect(bad.refused).toContain('cable-current-DC');
  });
  it('API: kind "DC-PV", "string", mppt 0, 1.5, "1" → 400; NaN design current → never valid', () => {
    const out = [{ kind: 'DC-PV' }, { kind: 'string' }, { mppt: 0 }, { mppt: 1.5 }, { mppt: '1' }].map((x) => viaApi(design({ ...three, cables: [cable(x as Partial<CableRun>)] })));
    const nan = viaApi(design({ ...three, cables: [cable({ designCurrentA: Number.NaN })] }), true);
    log('G3 api', out); log('G3 NaN current', nan);
    for (const r of out) expect(r.http).toBe(400);
    expect(nan.designValid).toBe(false);
  });
  it('form: unknown kind text falls back to PV; bad mppt falls back to largest MPPT (conservative)', () => {
    const r = [cableKindFromForm({ 'k.kind': 'dc pv' }), cableKindFromForm({ 'k.kind': 'AC' }), cableKindFromForm({ 'k.mppt': '0' }), cableKindFromForm({ 'k.mppt': '2' })];
    log('G3 form', r);
    expect(r[0]).toEqual({}); expect(r[1]).toEqual({ kind: 'ac' }); expect(r[2]).toEqual({}); expect(r[3]).toEqual({ mppt: 2 });
  });
  it('INFO: a single-string cable on a 3-string fused MPPT cannot be described (refused unless entered ≥ 52.1 A)', () => {
    // Per-string cable with string fuses: IEC 62548-1 sizes it to the fuse rating I_n (here 21-25 A), not the array current.
    const p = summary(buildProposal(design({ ...three, inv: { maxInputA: 45, maxIscA: 60 }, cables: [cable({ name: 'String 1', designCurrentA: 25, kind: 'dc-pv', mppt: 1 })] })));
    log('G3 string-cable false refusal', p);
    expect(p.refused).toContain('cable-current-String 1');
  });
});

describe('G4: exactly-sized battery', () => {
  it('8.55 kWh usable on 2 × 5 kWh passes; 17.1 kWh on 4 × 5 kWh passes; 8.56 refused', () => {
    const a = summary(buildProposal(design({ inv: { batteryMaxDischargeKw: 5, batteryMaxChargeKw: 5 }, battery: battery(2, 8.55) })));
    const b = summary(buildProposal(design({ inv: { batteryMaxDischargeKw: 10, batteryMaxChargeKw: 10 }, battery: battery(4, 17.1) })));
    const c = summary(buildProposal(design({ inv: { batteryMaxDischargeKw: 5, batteryMaxChargeKw: 5 }, battery: battery(2, 8.56) })));
    log('G4', { a, b, c, raw: [8.55 / (0.9 * 0.95), 17.1 / (0.9 * 0.95)] });
    expect(a.refused).toEqual([]); expect(b.refused).toEqual([]); expect(c.refused).toEqual(['battery-energy']);
  });
});

describe('Other paths: missing or nonsensical data marked valid?', () => {
  it('P1 inverter mpptCount missing (API) with a 3-MPPT design', () => {
    const inp = design({ design: { modulesPerString: 16, stringsPerMppt: [1, 1, 1] } });
    delete (inp.inverter.data as unknown as Record<string, unknown>).mpptCount;
    const r = viaApi(inp); log('P1 mpptCount missing', r);
    const r2 = viaApi(design({ inv: { mpptCount: 2 }, design: { modulesPerString: 16, stringsPerMppt: [1, 1, 1] } })); log('P1 control mpptCount 2', r2);
    expect(r).toBeDefined();
  });
  it('P2 inverterCount 0, -1, 1.5 (API)', () => {
    const r = [0, -1, 1.5].map((n) => viaApi(design({ inverterCount: n }))); log('P2 inverterCount', r);
    expect(r).toBeDefined();
  });
  it('P2b inverterCount 0, -1, 1.5 through the proposal FORM (UI path)', () => {
    const out = ['0', '-1', '1.5'].map((n) => {
      const f = { ...WORKED_EXAMPLE_FORM, 'd.inverterCount': n };
      const r = formToProposalInput(f, [{ item: 'PV modules', model: 'test-module', quantity: '32', unit: 'No', rate: '15000', rateSource: 'q', rateDate: '2026-11-01' }], production, null);
      const p = r.input ? buildProposal(r.input) : null;
      return { n, formErrors: r.errors, status: p?.status, designValid: p?.sld.designValid, system: p?.system, previewValid: sldPreviewFromForm(f).model?.designValid };
    });
    log('P2b form inverterCount', out);
    expect(out).toBeDefined();
  });
  it('P3 whitespace-only datasheet references (API)', () => {
    const r = viaApi(design({ mod: { datasheet: '   ' }, inv: { datasheet: ' ' } })); log('P3 blank datasheet', r);
    const rb = viaApi(design({ inv: { batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8 }, battery: { entry: entry({ ...BAT, datasheet: ' ' }, 'battery'), units: 4, requiredUsableAcKwh: 10 } })); log('P3 blank battery datasheet', rb);
    expect(r).toBeDefined();
  });
  it('P4 SLD preview: battery entered, energy need blank, no inverter battery power', () => {
    const f = { ...WORKED_EXAMPLE_FORM, 'b.manufacturer': 'TEST', 'b.datasheetUrl': 'https://example.com/b.pdf', 'b.datasheetRevision': 'A', 'b.datasheetDate': '2026-01-01', 'b.enteredBy': 'test', 'b.enteredOn': '2026-11-20',
      'b.model': 'TEST-LFP-5', 'b.nominalKwh': '5', 'b.usableDoD': '0.9', 'b.dischargeEfficiency': '0.95', 'b.maxDischargeC': '0.5', 'b.maxChargeC': '0.5', 'b.units': '1' };
    const prev = sldPreviewFromForm(f);
    const direct = buildSld({ reference: 'T', module: MOD, inverter: INV, design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, battery: { data: BAT, units: 1 }, cables: [] });
    const full = formToProposalInput(f, [], production, null);
    log('P4 sld preview', { designValid: prev.model?.designValid, errors: prev.errors, directDesignValid: direct.designValid, formToProposalInputErrors: full.errors });
    expect(prev.model).not.toBeNull();
  });
  it('P5 generator OEM minimum load 0 % (API) hides the light-load warning', () => {
    const r = buildProposal(design({ inv: { generatorCompatibility: GEN_OK }, connections: { ...GEN_CONN, generatorMinSiteLoadKw: 0.5, generatorOemMinLoadPct: 0 } }));
    log('P5 oem 0%', { ...summary(r), minLoad: r.checks.find((c) => c.id === 'gen-min-load')?.verdict });
    expect(r).toBeDefined();
  });
  it('P6 hybrid totals with generator figures as strings (raw object) still trigger generator checks', () => {
    const hy = { hours: 8760, totals: { pvToLoadKwh: 1, pvToBatteryKwh: 0, batteryToLoadKwh: 0, generatorToBatteryKwh: 0, gridExportKwh: 0, generatorKwh: '800', generatorHours: '120' }, assumptions: [], engineVersion: 'x' };
    const r = viaApi(design({ hybrid: hy }), true); log('P6 string generator totals', r);
    expect(r.designValid).toBe(false);
  });
});
