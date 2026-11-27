/**
 * Reviewer re-review probes for 221d977a (M1-M4, R1-R3). TEST values only; fetch stubbed.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import { buildSld } from '@/lib/solar/design/sld';
import { cableStringCurrentCheck, checkGenerator, type Module, type Inverter, type Battery, type CableRun } from '@/lib/solar/design/validate';
import { sldPreviewFromForm, formToProposalInput, cableKindFromForm, WORKED_EXAMPLE_FORM } from '@/lib/solar/design/proposalForm';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

beforeAll(() => { vi.stubGlobal('fetch', () => { throw new Error('network disabled'); }); });

const MOD: Module = { model: 'TEST-module-550', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'TEST module rev A' };
const INV: Inverter = { model: 'TEST-inverter-15', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 45, maxIscA: 60, generatorCompatibility: 'TEST statement', datasheet: 'TEST inverter rev B' };
const BAT: Battery = { model: 'TEST-LFP-5', nominalKwh: 5, usableDoD: 0.9, dischargeEfficiency: 0.95, maxDischargeC: 0.5, maxChargeC: 0.5, datasheet: 'TEST battery rev C' };
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', verifiedBy: 'test-2', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['TEST year'], engineVersion: 'solar-hourly test' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'TEST source' });
const design = (o: Record<string, unknown> = {}): ProposalInput => ({
  reference: 'TEST-RR', client: { name: 'TEST', siteAddress: 'TEST', lat: -1.29, lon: 36.82 },
  module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  design: { modulesPerString: 16, stringsPerMppt: [3, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'TEST' },
  cables: [], production,
  bom: [{ item: 'PV', model: 'TEST', quantity: 64, unit: 'No', rate: { valueKes: 1, source: 'q', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
  ...o,
} as unknown as ProposalInput);
const log = (n: string, v: unknown) => console.log(`RPROBE ${n} ${JSON.stringify(v)}`);
const viaApi = (input: ProposalInput) => {
  const parsed = checkProposalRequest(JSON.parse(JSON.stringify({ input, format: 'json' })));
  if ('error' in parsed) return { http: 400, error: parsed.error.slice(0, 120) };
  try { const p = buildProposal(parsed.input); return { http: 200, status: p.status, designValid: p.sld.designValid }; } catch (e) { return { http: 400, error: (e as Error).message.slice(0, 120) }; }
};
const cable = (o: Partial<CableRun>): CableRun => ({ name: 'S1', lengthM: 10, csaMm2: 4, designCurrentA: 25, systemV: 600, tabulatedAmpacityA: 32, ambientFactor: 1, groupingFactor: 1, maxDropPct: 3, kind: 'dc-string', ...o });
const D3 = { modulesPerString: 16, stringsPerMppt: [3, 1] };

describe('R1 dc-string rule (hand: Isc 13.9; 1.25 Isc 17.375; window 20.85 < In <= min(33.36, 25) = 25; unfused N=3 -> 2 x 17.375 = 34.75)', () => {
  const rows: [string, Partial<CableRun>, string, number | null][] = [
    ['fused 25 A at 25 A', { stringFuseA: 25, designCurrentA: 25 }, 'PASS', 25],
    ['fused 25 A at 24.9 A', { stringFuseA: 25, designCurrentA: 24.9 }, 'REFUSE', 25],
    ['fused 21 A at 21 A', { stringFuseA: 21, designCurrentA: 21 }, 'PASS', 21],
    ['fuse 20.85 (= 1.5 Isc, not >)', { stringFuseA: 20.85, designCurrentA: 30 }, 'REFUSE', null],
    ['fuse 25.01 (> module max)', { stringFuseA: 25.01, designCurrentA: 30 }, 'REFUSE', null],
    ['fuse 0', { stringFuseA: 0, designCurrentA: 30 }, 'REFUSE', null],
    ['fuse -10', { stringFuseA: -10, designCurrentA: 30 }, 'REFUSE', null],
    ['fuse NaN', { stringFuseA: Number.NaN, designCurrentA: 30 }, 'REFUSE', null],
    // Updated after this re-review's S2 fix: on N = 3 fuses are required, so an unfused string cable is refused.
    ['unfused N=3 at 34.75', { designCurrentA: 34.75 }, 'REFUSE', 34.75],
    ['unfused N=3 at 34.7', { designCurrentA: 34.7 }, 'REFUSE', 34.75],
    ['unfused on MPPT 2 (N=1) at 17.4', { mppt: 2, designCurrentA: 17.4 }, 'PASS', 17.38],
    ['unfused on MPPT 2 (N=1) at 17.3', { mppt: 2, designCurrentA: 17.3 }, 'REFUSE', 17.38],
  ];
  for (const [n, o, v, lim] of rows) it(n, () => {
    const k = cableStringCurrentCheck(cable(o), MOD, D3)!;
    log(`R1 ${n}`, { verdict: k.verdict, limit: k.limit, ref: k.reference });
    expect(k.verdict).toBe(v); if (lim !== null) expect(k.limit).toBe(lim);
  });
  it('module max series fuse 20 A: window empty, any fuse refused', () => {
    const k = cableStringCurrentCheck(cable({ stringFuseA: 21 }), { ...MOD, maxSeriesFuseA: 20 }, D3)!;
    log('R1 empty window', k.verdict); expect(k.verdict).toBe('REFUSE');
  });
  it('API: stringFuseA "25" (string) -> 400; non-dc-string with fuse ignored (dc-pv rule)', () => {
    const a = viaApi(design({ cables: [cable({ stringFuseA: '25' as unknown as number })] }));
    const b = viaApi(design({ cables: [cable({ kind: 'dc-pv', stringFuseA: 25, designCurrentA: 25 })] }));
    log('R1 api', { a, b }); expect(a.http).toBe(400); expect(b.designValid).toBe(false);
  });
  it('form: fuse typed with kind blank is dropped (dc-pv, conservative)', () => {
    const r = [cableKindFromForm({ 'k.kind': 'dc-string', 'k.stringFuseA': '25' }), cableKindFromForm({ 'k.stringFuseA': '25' })];
    log('R1 form', r); expect(r[1]).toEqual({});
  });
  it('INFO unfused dc-string on a 3-string MPPT that needs fuses: cable passes; fusing is a WARN only', () => {
    const p = buildProposal(design({ cables: [cable({ designCurrentA: 34.75, csaMm2: 6, tabulatedAmpacityA: 41 })] }));
    log('R1 unfused-but-fuses-required', { status: p.status, designValid: p.sld.designValid, fusing: p.checks.find((c) => c.id === 'fusing-mppt1')?.verdict });
    expect(p).toBeDefined();
  });
});

describe('R3 OEM minimum load', () => {
  const v = (pct: unknown, load: number) => checkGenerator(INV, { ratedKw: 20, oemMinLoadPct: pct as number }, load, false).find((c) => c.id === 'gen-min-load')!;
  it('0, -5, NaN, undefined -> 30 % default (6 kW): 0.5 kW WARN; 20 % real -> 4 kW', () => {
    const r = [0, -5, Number.NaN, undefined, '25', 20].map((p) => { const k = v(p, 0.5); return { p: String(p), verdict: k.verdict, limit: k.limit, ref: k.reference }; });
    log('R3', r);
    for (const x of r.slice(0, 5)) expect(x.verdict).toBe('WARN');
  });
  it('INFO fraction typed as % (0.3 meaning 30 %) -> 0.06 kW limit -> PASS at 0.5 kW', () => {
    const k = v(0.3, 0.5); log('R3 0.3%', { verdict: k.verdict, limit: k.limit }); expect(k).toBeDefined();
  });
});

describe('M2 end to end', () => {
  const bom = [{ item: 'PV modules', model: 'test-module', quantity: '32', unit: 'No', rate: '15000', rateSource: 'q', rateDate: '2026-11-01' }];
  for (const n of ['0', '-1', '1.5', 'abc', '2']) it(`inverterCount ${n}`, () => {
    const f = { ...WORKED_EXAMPLE_FORM, 'd.inverterCount': n };
    const form = formToProposalInput(f, bom, production, null);
    const prev = sldPreviewFromForm(f);
    const nn = Number(n);
    const api = viaApi({ ...design({ design: { modulesPerString: 16, stringsPerMppt: [1, 1] } }), inverterCount: nn } as ProposalInput);
    let engine: string; try { engine = buildProposal({ ...design({ design: { modulesPerString: 16, stringsPerMppt: [1, 1] } }), inverterCount: nn } as ProposalInput).status; } catch (e) { engine = `throw: ${(e as Error).message}`; }
    const sld = buildSld({ reference: 'T', module: MOD, inverter: INV, design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: nn, temps: { recordLowC: 10, maxAmbientC: 35 }, cables: [] }).designValid;
    const r = { formInput: !!form.input, formErr: form.errors.filter((e) => /nverter count/.test(e)), preview: prev.model ? prev.model.designValid : `null: ${prev.errors.join('; ')}`, api, engine, sldDirect: sld };
    log(`M2 ${n}`, r);
    if (n === '2') { expect(r.formInput).toBe(true); expect(sld).toBe(true); }
    else { expect(r.formInput).toBe(false); expect(prev.model).toBeNull(); expect(api.http).toBe(400); expect(engine).toMatch(/^throw/); expect(sld).toBe(false); }
  });
});

describe('M4 completeness: preview with a battery', () => {
  const bat = { 'b.manufacturer': 'TEST', 'b.datasheetUrl': 'https://example.com/b.pdf', 'b.datasheetRevision': 'A', 'b.datasheetDate': '2026-01-01', 'b.enteredBy': 'test', 'b.enteredOn': '2026-11-20',
    'b.model': 'TEST-LFP-5', 'b.nominalKwh': '5', 'b.usableDoD': '0.9', 'b.dischargeEfficiency': '0.95', 'b.maxDischargeC': '0.5', 'b.maxChargeC': '0.5' };
  it('units given, need blank -> not valid', () => {
    const m = sldPreviewFromForm({ ...WORKED_EXAMPLE_FORM, ...bat, 'b.units': '1' }).model!;
    const box = m.boxes.find((b) => b.id === 'battery');
    log('M4 need blank', { designValid: m.designValid, batteryBox: box?.lines.find((l) => /Energy check/.test(l)) });
    expect(m.designValid).toBe(false);
  });
  it('units BLANK (battery datasheet entered) -> preview?', () => {
    const r = sldPreviewFromForm({ ...WORKED_EXAMPLE_FORM, ...bat, 'b.requiredUsableAcKwh': '10' });
    log('M4 units blank', { model: r.model ? { designValid: r.model.designValid, hasBatteryBox: r.model.boxes.some((b) => b.id === 'battery') } : null, errors: r.errors });
    expect(r).toBeDefined();
  });
  it('units "0" / "1.5" -> preview?', () => {
    const r = ['0', '1.5'].map((u) => { const x = sldPreviewFromForm({ ...WORKED_EXAMPLE_FORM, ...bat, 'b.units': u, 'b.requiredUsableAcKwh': '10' }); return { u, designValid: x.model?.designValid, errors: x.errors }; });
    log('M4 units 0/1.5', r); expect(r).toBeDefined();
  });
});

describe('M1/M3 API', () => {
  it('mpptCount missing / 0 / 1.5; datasheet blanks', () => {
    const out = [undefined, 0, 1.5].map((m) => { const inp = design(); (inp.inverter.data as unknown as Record<string, unknown>).mpptCount = m; return viaApi(inp); });
    const ds = viaApi(design({ module: entry({ ...MOD, datasheet: ' \t' }, 'module') }));
    const bds = viaApi(design({ inverter: entry({ ...INV, batteryMaxDischargeKw: 8, batteryMaxChargeKw: 8 }, 'inverter'), battery: { entry: entry({ ...BAT, datasheet: '  ' }, 'battery'), units: 4, requiredUsableAcKwh: 10 } }));
    log('M1', out); log('M3', { ds, bds });
    for (const r of [...out, ds, bds]) expect(r.http === 400 || r.designValid === false).toBe(true);
  });
});
