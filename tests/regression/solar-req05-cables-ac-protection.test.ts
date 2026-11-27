/**
 * REQ-05 (P1-B §2 Design), 2026-11-27: several cable runs, and the AC
 * protection devices, modelled and checked.
 *
 * TEST components and TEST cable-table values only (the It values below are
 * test inputs, not read from IEC 60364-5-52). No network: fetch is stubbed.
 *
 * Hand-worked examples (worked out by hand before the code was run):
 *
 *  H1. AC circuit, everything coordinated. Inverter maximum AC output
 *      I_B = 24 A; breaker I_n = 32 A; AC cable "AC 1", 6 mm² copper, method C,
 *      I_t = 41 A, C_a = 0.94, C_g = 1, so I_z = 41 × 0.94 × 1 = 38.54 A;
 *      design current 24 A, 25 m one way, 400 V.
 *        I_B ≤ I_n: 24 ≤ 32                         → ac-breaker-current PASS (margin (32 − 24)/24 = 33.33 %)
 *        I_n ≤ I_z: 32 ≤ 38.54                      → ac-breaker-cable PASS (margin (38.54 − 32)/38.54 = 16.97 %)
 *        design current ≥ I_B: 24 ≥ 24              → ac-cable-current-AC 1 PASS
 *        capacity: 38.54 ≥ 24                       → ampacity-AC 1 PASS
 *        ΔV = 2 × 25 × 24 × 0.0225 ÷ 6 = 4.5 V; 4.5 ÷ 400 = 1.125 % ≤ 3 % → vdrop-AC 1 PASS
 *        RCD: inverter states type A, type B fitted (B covers A) → ac-rcd-type PASS
 *  H2. The same, but the AC cable is grouped: C_g = 0.7, so
 *      I_z = 41 × 0.94 × 0.7 = 26.978 A. 32 A > 26.98 A → ac-breaker-cable REFUSE
 *      (the cable itself still carries its 24 A: 26.98 ≥ 24, ampacity PASS). Status REFUSED.
 *  H3. Breaker 20 A on the 24 A inverter: 20 < 24 → ac-breaker-current REFUSE.
 *  H4. Two DC runs on the worked-example array (Isc 13.9 A, one string per MPPT):
 *      required per run = 1 × 13.9 × 1.25 = 17.375 A.
 *        "PV 1" (MPPT 1) at 17.4 A ≥ 17.375 → cable-current-PV 1 PASS;
 *          ΔV = 2 × 30 × 17.4 × 0.0225 ÷ 4 = 5.8725 V; 5.8725 ÷ 664 V = 0.884 % ≤ 1.5 % → PASS.
 *        "PV 2" (MPPT 2) at 15 A < 17.375 → cable-current-PV 2 REFUSE.
 *      Each run is checked on its own: PV 1 passes while PV 2 is refused.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import { importInverter } from '@/lib/solar/design/datasheet';
import { buildSld, sldRows } from '@/lib/solar/design/sld';
import { checkCable, acProtectionChecks, AC_PROTECTION_BASIS, RCD_BASIS, STRING_CABLE_BASIS, type Module, type Inverter, type CableRun, type AcProtection, type Check } from '@/lib/solar/design/validate';
import { formToProposalInput, cablesFromForm, acProtectionFromForm, removeCableRun, cableRunCount, sldPreviewFromForm, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, type ProposalForm } from '@/lib/solar/design/proposalForm';
import { readProject, serializeProject } from '@/lib/solar/design/proposalSave';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

beforeAll(() => { vi.stubGlobal('fetch', () => { throw new Error('network disabled in tests'); }); });

const MOD: Module = { model: 'TEST-module-550', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'TEST module rev A' };
const INV: Inverter = { model: 'TEST-inverter-15', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, maxAcOutputA: 24, rcdTypeRequired: 'A', datasheet: 'TEST inverter rev B' };
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', verifiedBy: 'test-2', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['TEST year'], engineVersion: 'solar-hourly test' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'TEST source' });

const AC1: CableRun = { name: 'AC 1', from: 'Inverter AC terminals', to: 'Main DB', kind: 'ac', lengthM: 25, method: 'C', conductor: 'copper', csaMm2: 6, designCurrentA: 24, systemV: 400, tabulatedAmpacityA: 41, ambientFactor: 0.94, groupingFactor: 1, maxDropPct: 3 };
const PV1: CableRun = { name: 'PV 1', from: 'Array MPPT 1', to: 'Inverter MPPT 1', kind: 'dc-pv', mppt: 1, lengthM: 30, method: 'C', conductor: 'copper', csaMm2: 4, designCurrentA: 17.4, systemV: 664, tabulatedAmpacityA: 32, ambientFactor: 1, groupingFactor: 1, maxDropPct: 1.5 };
const PV2: CableRun = { ...PV1, name: 'PV 2', from: 'Array MPPT 2', to: 'Inverter MPPT 2', mppt: 2, designCurrentA: 15 };
const AP: AcProtection = { breakerA: 32, device: 'MCB, C curve, 4-pole', cable: 'AC 1', rcdType: 'B' };

type Over = Record<string, unknown> & { inv?: Partial<Inverter> };
const design = (o: Over = {}): ProposalInput => {
  const { inv, ...rest } = o;
  return {
    reference: 'TEST-REQ05', client: { name: 'TEST client', siteAddress: 'TEST site', lat: -1.29, lon: 36.82 },
    module: entry(MOD, 'module'), inverter: entry({ ...INV, ...inv }, 'inverter'),
    design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'TEST station record' },
    cables: [PV1, AC1], acProtection: AP, production,
    bom: [{ item: 'PV modules', model: 'TEST', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'TEST quote', date: '2026-11-01' } }],
    finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
    ...rest,
  } as unknown as ProposalInput;
};
const byId = (checks: Check[], id: string) => checks.find((c) => c.id === id)!;
/** The API path: JSON over the wire, checkProposalRequest, then buildProposal (a throw is a 400 in route.ts). */
function viaApi(input: unknown) {
  const parsed = checkProposalRequest(JSON.parse(JSON.stringify({ input, format: 'json' })));
  if ('error' in parsed) return { http: 400, error: parsed.error };
  try { const p = buildProposal(parsed.input, null); return { http: 200, p }; } catch (e) { return { http: 400, error: (e as Error).message }; }
}

describe('H1: AC circuit coordinated (hand-worked)', () => {
  const p = buildProposal(design());
  it('I_B ≤ I_n: 24 ≤ 32 A PASS, margin 33.33 %', () => {
    expect(byId(p.checks, 'ac-breaker-current')).toMatchObject({ verdict: 'PASS', value: 32, limit: 24, unit: 'A', marginPct: 33.33, reference: AC_PROTECTION_BASIS });
  });
  it('I_n ≤ I_z: 32 ≤ 41 × 0.94 × 1 = 38.54 A PASS, margin 16.97 %', () => {
    expect(byId(p.checks, 'ac-breaker-cable')).toMatchObject({ verdict: 'PASS', value: 32, limit: 38.54, marginPct: 16.97 });
  });
  it('AC cable design current 24 A ≥ I_B 24 A PASS; capacity 38.54 ≥ 24 PASS', () => {
    expect(byId(p.checks, 'ac-cable-current-AC 1')).toMatchObject({ verdict: 'PASS', value: 24, limit: 24 });
    expect(byId(p.checks, 'ampacity-AC 1')).toMatchObject({ verdict: 'PASS', limit: 38.54 });
  });
  it('ΔV = 2 × 25 × 24 × 0.0225 ÷ 6 = 4.5 V = 1.125 % → 1.13 % PASS', () => {
    const v = byId(p.checks, 'vdrop-AC 1');
    expect(v.verdict).toBe('PASS');
    expect(v.value).toBeCloseTo(1.13, 2);
    expect(v.formula).toContain('= 4.5 V');
  });
  it('RCD: type A required, type B fitted → PASS', () => {
    expect(byId(p.checks, 'ac-rcd-type')).toMatchObject({ verdict: 'PASS', reference: RCD_BASIS });
  });
  it('no refusal: the design is valid, and the diagram draws the devices with their verdicts', () => {
    expect(p.checks.filter((c) => c.verdict === 'REFUSE')).toEqual([]);
    expect(p.sld.designValid).toBe(true);
    const ac = sldRows(p.sld).find(([t]) => t.startsWith('AC protection'))![1];
    expect(ac).toContain('AC circuit breaker: 32 A, MCB, C curve, 4-pole; inverter maximum AC output 24 A (check ac-breaker-current: PASS)');
    expect(ac).toContain('Protects cable: AC 1 (check ac-breaker-cable: PASS)');
    expect(ac).toContain('RCD: type B; inverter requirement: type A (check ac-rcd-type: PASS)');
    const notes = sldRows(p.sld).find(([t]) => t === 'Notes')![1];
    expect(notes).toContain('Cable AC 1 (Inverter AC terminals → Main DB): ac, copper, 6 mm², 25 m one way, method C');
    expect(notes).toContain('Cable PV 1 (Array MPPT 1 → Inverter MPPT 1)');
  });
});

describe('H2/H3: breaker against cable and inverter (hand-worked)', () => {
  it('H2: grouped cable, I_z = 41 × 0.94 × 0.7 = 26.98 A < 32 A → REFUSE; the cable still carries its 24 A', () => {
    const p = buildProposal(design({ cables: [PV1, { ...AC1, groupingFactor: 0.7 }] }));
    expect(byId(p.checks, 'ac-breaker-cable')).toMatchObject({ verdict: 'REFUSE', value: 32, limit: 26.98 });
    expect(byId(p.checks, 'ampacity-AC 1')).toMatchObject({ verdict: 'PASS', limit: 26.98 });
    expect(p.status).toBe('REFUSED');
    expect(p.sld.designValid).toBe(false);
  });
  it('H3: 20 A breaker on a 24 A inverter output → REFUSE', () => {
    const p = buildProposal(design({ acProtection: { ...AP, breakerA: 20 } }));
    expect(byId(p.checks, 'ac-breaker-current')).toMatchObject({ verdict: 'REFUSE', value: 20, limit: 24 });
    expect(p.status).toBe('REFUSED');
  });
  it('an AC cable whose design current is below the inverter output is refused (it would pass capacity on a low figure)', () => {
    const p = buildProposal(design({ cables: [PV1, { ...AC1, designCurrentA: 16 }] }));
    expect(byId(p.checks, 'ac-cable-current-AC 1')).toMatchObject({ verdict: 'REFUSE', value: 16, limit: 24 });
  });
  it('RCD: type AC fitted where type A is required → REFUSE; none fitted → REFUSE; F and A pass', () => {
    const v = (rcdType: AcProtection['rcdType']) => byId(buildProposal(design({ acProtection: { ...AP, rcdType } })).checks, 'ac-rcd-type').verdict;
    expect(v('AC')).toBe('REFUSE');
    expect(v('none')).toBe('REFUSE');
    expect(v('F')).toBe('PASS');
    expect(v('A')).toBe('PASS');
  });
  it('type B required: only B passes', () => {
    const v = (rcdType: AcProtection['rcdType']) => byId(buildProposal(design({ inv: { rcdTypeRequired: 'B' }, acProtection: { ...AP, rcdType } })).checks, 'ac-rcd-type').verdict;
    expect([v('AC'), v('A'), v('F'), v('B')]).toEqual(['REFUSE', 'REFUSE', 'REFUSE', 'PASS']);
  });
});

describe('H4: several cable runs, each checked on its own (hand-worked)', () => {
  const p = buildProposal(design({ cables: [PV1, PV2, AC1] }));
  it('PV 1 at 17.4 A ≥ 1 × 13.9 × 1.25 = 17.375 A PASS; PV 2 at 15 A REFUSE', () => {
    expect(byId(p.checks, 'cable-current-PV 1')).toMatchObject({ verdict: 'PASS', limit: 17.38 });
    expect(byId(p.checks, 'cable-current-PV 2')).toMatchObject({ verdict: 'REFUSE', value: 15, limit: 17.38 });
  });
  it('PV 1: ΔV = 2 × 30 × 17.4 × 0.0225 ÷ 4 = 5.8725 V = 0.88 % of 664 V PASS', () => {
    const v = byId(p.checks, 'vdrop-PV 1');
    expect(v.verdict).toBe('PASS');
    expect(v.value).toBeCloseTo(0.88, 2);
  });
  it('every run gets its own capacity and voltage-drop checks', () => {
    for (const n of ['PV 1', 'PV 2', 'AC 1']) {
      expect(p.checks.some((c) => c.id === `ampacity-${n}`)).toBe(true);
      expect(p.checks.some((c) => c.id === `vdrop-${n}`)).toBe(true);
    }
    expect(p.status).toBe('REFUSED');
  });
  it('the string-cable basis is still cited without a clause number', () => {
    expect(STRING_CABLE_BASIS).toContain('Clause and edition to be confirmed against the purchased standard');
    expect(AC_PROTECTION_BASIS).toContain('Clause to be confirmed against the purchased standard');
    expect(RCD_BASIS).toContain('Clauses to be confirmed against the purchased standards');
    for (const t of [AC_PROTECTION_BASIS, RCD_BASIS]) expect(t).not.toMatch(/§|\bcl\.\s?\d|[Cc]lause\s\d/);
  });
});

describe('missing data is never compliant (WARN "not checked", or REFUSE; never PASS)', () => {
  const base = { name: 'X', lengthM: 25, csaMm2: 6, designCurrentA: 24, systemV: 400, tabulatedAmpacityA: 41, ambientFactor: 0.94, groupingFactor: 1, maxDropPct: 3 };
  it('no installation method: a capacity that fits is WARN, not PASS; one that does not fit is still REFUSED', () => {
    const fit = checkCable({ ...base, conductor: 'copper' }).checks.find((c) => c.id === 'ampacity-X')!;
    expect(fit.verdict).toBe('WARN');
    expect(fit.note).toMatch(/Installation method not stated/);
    expect(checkCable({ ...base, conductor: 'copper', designCurrentA: 60 }).checks.find((c) => c.id === 'ampacity-X')!.verdict).toBe('REFUSE');
    expect(checkCable({ ...base, conductor: 'copper', method: '   ' }).checks.find((c) => c.id === 'ampacity-X')!.verdict).toBe('WARN');
  });
  it('no conductor: the drop is worked out as copper but is WARN; aluminium is WARN "not checked"', () => {
    const none = checkCable({ ...base, method: 'C' }).checks.find((c) => c.id === 'vdrop-X')!;
    expect(none).toMatchObject({ verdict: 'WARN' });
    expect(none.value).toBeCloseTo(1.13, 2);
    expect(none.note).toMatch(/Conductor not stated/);
    const al = checkCable({ ...base, method: 'C', conductor: 'aluminium' }).checks.find((c) => c.id === 'vdrop-X')!;
    expect(al).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
    expect(Number.isNaN(al.value)).toBe(true);
  });
  it('a conductor that is not copper or aluminium is an input error (engine)', () => {
    expect(checkCable({ ...base, method: 'C', conductor: 'Cu' as never }).errors).toEqual(['X: conductor must be copper or aluminium']);
  });
  it('no AC protection at all: one WARN "not checked", never a pass', () => {
    const p = buildProposal(design({ acProtection: undefined }));
    expect(byId(p.checks, 'ac-protection')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
    expect(p.checks.some((c) => c.id.startsWith('ac-') && c.verdict === 'PASS')).toBe(false);
  });
  it('breaker rating missing, inverter maximum AC current missing, cable not named, RCD requirement or fitted type missing: each WARN', () => {
    const c = (inv: Partial<Inverter>, ap: AcProtection) => acProtectionChecks({ ...INV, ...inv }, ap, [AC1], 1);
    expect(byId(c({}, { ...AP, breakerA: undefined }), 'ac-breaker-current').verdict).toBe('WARN');
    expect(byId(c({}, { ...AP, breakerA: undefined }), 'ac-breaker-cable').verdict).toBe('WARN');
    expect(byId(c({ maxAcOutputA: undefined }, AP), 'ac-breaker-current').verdict).toBe('WARN');
    expect(byId(c({ maxAcOutputA: undefined }, AP), 'ac-cable-current-AC 1').verdict).toBe('WARN');
    expect(byId(c({}, { ...AP, cable: undefined }), 'ac-breaker-cable').verdict).toBe('WARN');
    expect(byId(c({ rcdTypeRequired: undefined }, AP), 'ac-rcd-type').verdict).toBe('WARN');
    expect(byId(c({}, { ...AP, rcdType: undefined }), 'ac-rcd-type').verdict).toBe('WARN');
    for (const bad of [0, -5, Number.NaN, Number.POSITIVE_INFINITY]) expect(byId(c({}, { ...AP, breakerA: bad }), 'ac-breaker-current').verdict).toBe('WARN');
  });
  it('the protected cable without an installation method: I_n ≤ I_z fits but is WARN (I_z not traceable)', () => {
    const k = byId(acProtectionChecks(INV, AP, [{ ...AC1, method: undefined }], 1), 'ac-breaker-cable');
    expect(k.verdict).toBe('WARN');
    expect(k.note).toMatch(/not traceable/);
  });
  it('a breaker naming a cable that is not in the design, or not an AC cable, is REFUSED (engine path)', () => {
    expect(byId(acProtectionChecks(INV, { ...AP, cable: 'nope' }, [AC1], 1), 'ac-breaker-cable').verdict).toBe('REFUSE');
    expect(byId(acProtectionChecks(INV, { ...AP, cable: 'PV 1' }, [PV1, AC1], 1), 'ac-breaker-cable').verdict).toBe('REFUSE');
  });
  it('an RCD type that is not a type never passes', () => {
    expect(byId(acProtectionChecks({ ...INV, rcdTypeRequired: 'Z' as never }, { ...AP, rcdType: 'AC' }, [AC1], 1), 'ac-rcd-type').verdict).toBe('REFUSE');
    expect(byId(acProtectionChecks(INV, { ...AP, rcdType: 'Q' as never }, [AC1], 1), 'ac-rcd-type').verdict).toBe('REFUSE');
  });
  it('"not-required" stated by the manufacturer passes, and says the wiring rules are the engineer\'s decision', () => {
    const k = byId(acProtectionChecks({ ...INV, rcdTypeRequired: 'not-required' }, { ...AP, rcdType: undefined }, [AC1], 1), 'ac-rcd-type');
    expect(k.verdict).toBe('PASS');
    expect(k.note).toMatch(/engineer's decision/);
  });
});

describe('API: checkProposalRequest validates the new fields as strictly as the form', () => {
  it('the full H1 design is accepted and checked as by the engine', () => {
    const r = viaApi(design());
    expect(r.http).toBe(200);
    if (r.http === 200 && 'p' in r) expect(byId(r.p!.checks, 'ac-breaker-cable').verdict).toBe('PASS');
  });
  const bad: Array<[string, Over]> = [
    ['duplicate run names', { cables: [PV1, { ...PV2, name: 'PV 1' }, AC1] }],
    ['a run without a name', { cables: [{ ...PV1, name: '' }, AC1] }],
    ['conductor "Cu"', { cables: [{ ...PV1, conductor: 'Cu' }, AC1] }],
    ['an empty installation method', { cables: [{ ...PV1, method: '  ' }, AC1] }],
    ['from as a number', { cables: [{ ...PV1, from: 5 }, AC1] }],
    ['breaker −32 A', { acProtection: { ...AP, breakerA: -32 } }],
    ['breaker "32" (text)', { acProtection: { ...AP, breakerA: '32' } }],
    ['breaker 0 A', { acProtection: { ...AP, breakerA: 0 } }],
    ['a protected cable that is not a run', { acProtection: { ...AP, cable: 'AC 9' } }],
    ['a protected cable that is not AC', { acProtection: { ...AP, cable: 'PV 1' } }],
    ['RCD "Type B" (not a type value)', { acProtection: { ...AP, rcdType: 'Type B' } }],
    ['an unknown acProtection field', { acProtection: { ...AP, breakerKa: 6 } }],
    ['acProtection not an object', { acProtection: 'MCB 32 A' }],
    ['inverter max AC output 0 A', { inv: { maxAcOutputA: 0 } }],
    ['inverter RCD requirement "Z"', { inv: { rcdTypeRequired: 'Z' as never } }],
  ];
  for (const [what, o] of bad) it(`refuses ${what} (400)`, () => {
    expect(viaApi(design(o)).http).toBe(400);
  });
  it('older requests without route, method or conductor are accepted, but those checks are never a PASS', () => {
    const legacy = { name: 'DC main', lengthM: 20, csaMm2: 16, designCurrentA: 40, systemV: 600, tabulatedAmpacityA: 76, ambientFactor: 0.87, groupingFactor: 0.8, maxDropPct: 3 };
    const r = viaApi(design({ cables: [legacy], acProtection: undefined }));
    expect(r.http).toBe(200);
    if (r.http === 200 && 'p' in r) {
      expect(byId(r.p!.checks, 'ampacity-DC main').verdict).toBe('WARN');
      expect(byId(r.p!.checks, 'vdrop-DC main').verdict).toBe('WARN');
      expect(byId(r.p!.checks, 'ac-protection').verdict).toBe('WARN');
    }
  });
  it('the inverter datasheet import takes the AC current and RCD type, and refuses a type it does not know', () => {
    const row = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/i.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', model: 'TEST-inv', acKw: '15', maxDcV: '1000', mpptMinV: '200', mpptMaxV: '850', mpptCount: '2', maxInputA: '26', maxIscA: '40' };
    const ok = importInverter({ ...row, maxAcOutputA: '24', rcdTypeRequired: 'Type A' });
    expect(ok.errors).toEqual([]);
    expect(ok.entry!.data).toMatchObject({ maxAcOutputA: 24, rcdTypeRequired: 'A' });
    expect(importInverter({ ...row, rcdTypeRequired: 'not required' }).entry!.data.rcdTypeRequired).toBe('not-required');
    expect(importInverter({ ...row, rcdTypeRequired: 'RCD' }).errors.join(' ')).toMatch(/rcdTypeRequired/);
    expect(importInverter({ ...row, maxAcOutputA: '-1' }).errors.join(' ')).toMatch(/maxAcOutputA/);
    expect(importInverter(row).entry!.data).not.toHaveProperty('rcdTypeRequired');
  });
});

// ------------------------------------------------------------------ form
const RUN = (p: string, r: CableRun): ProposalForm => Object.fromEntries(Object.entries(r).map(([k, v]) => [`${p}${k}`, String(v)]));
const FORM: ProposalForm = {
  ...WORKED_EXAMPLE_FORM, 'i.maxAcOutputA': '24', 'i.rcdTypeRequired': 'A',
  ...RUN('k.', PV1), ...RUN('k2.', PV2), ...RUN('k3.', AC1),
  'ap.breakerA': '32', 'ap.device': 'MCB, C curve, 4-pole', 'ap.cable': 'AC 1', 'ap.rcdType': 'B',
};

describe('form: several cable runs and AC protection', () => {
  it('maps three runs and the AC protection to the request; the request passes checkProposalRequest; the engine gives the H1/H4 verdicts', () => {
    const r = formToProposalInput(FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
    expect(r.errors).toEqual([]);
    expect(r.input!.cables.map((c) => [c.name, c.kind, c.mppt, c.method, c.conductor, c.from, c.to])).toEqual([
      ['PV 1', 'dc-pv', 1, 'C', 'copper', 'Array MPPT 1', 'Inverter MPPT 1'],
      ['PV 2', 'dc-pv', 2, 'C', 'copper', 'Array MPPT 2', 'Inverter MPPT 2'],
      ['AC 1', 'ac', undefined, 'C', 'copper', 'Inverter AC terminals', 'Main DB'],
    ]);
    expect(r.input!.acProtection).toEqual(AP);
    expect(r.input!.inverter.data).toMatchObject({ maxAcOutputA: 24, rcdTypeRequired: 'A' });
    const api = viaApi(r.input);
    expect(api.http).toBe(200);
    if (api.http === 200 && 'p' in api) {
      expect(byId(api.p!.checks, 'cable-current-PV 2').verdict).toBe('REFUSE');
      expect(byId(api.p!.checks, 'ac-breaker-cable').verdict).toBe('PASS');
    }
  });
  it('a run with anything in it must be complete: route, method and conductor are required', () => {
    const e: string[] = [];
    cablesFromForm({ 'k2.name': 'PV 2', 'k2.lengthM': '30' }, e);
    for (const k of ['from', 'to', 'method', 'conductor', 'csaMm2', 'designCurrentA', 'systemV', 'tabulatedAmpacityA', 'ambientFactor', 'groupingFactor', 'maxDropPct']) expect(e).toContain(`Cable run PV 2: ${k} is required (or clear the run)`);
  });
  it('bad values are reported, never guessed', () => {
    const e: string[] = [];
    cablesFromForm({ ...RUN('k.', PV1), 'k.lengthM': '-3', 'k.conductor': 'Cu', 'k.kind': 'string', 'k.mppt': '1.5', 'k.ambientFactor': '0' }, e);
    expect(e).toEqual(expect.arrayContaining([
      'Cable run PV 1: lengthM must be a positive number', 'Cable run PV 1: conductor must be copper or aluminium',
      'Cable run PV 1: kind must be dc-pv, dc-string, dc-battery or ac', 'Cable run PV 1: MPPT must be a whole number, 1 or more',
      'Cable run PV 1: ambientFactor must be a positive number from the IEC 60364-5-52 tables',
    ]));
  });
  it('duplicate names are refused in the form', () => {
    const e: string[] = [];
    cablesFromForm({ ...RUN('k.', PV1), ...RUN('k2.', PV1) }, e);
    expect(e).toContain('Cable run PV 1: another run has the same name (names must be unique)');
  });
  it('AC protection in the form: bad rating, unknown cable, non-AC cable and unknown RCD type are reported', () => {
    const cables = cablesFromForm(FORM, []);
    const e = (o: ProposalForm) => { const x: string[] = []; acProtectionFromForm({ ...FORM, ...o }, cables, x); return x; };
    expect(e({ 'ap.breakerA': 'thirty' })).toEqual(['AC breaker rating must be a positive number of A']);
    expect(e({ 'ap.cable': 'AC 9' })).toEqual(['AC breaker: "AC 9" is not one of the cable runs']);
    expect(e({ 'ap.cable': 'PV 1' })).toEqual(['AC breaker: cable run "PV 1" is not an AC cable (set its kind to ac)']);
    expect(e({ 'ap.rcdType': 'Type B' })).toEqual(['RCD fitted must be none, AC, A, F or B']);
    expect(acProtectionFromForm({}, cables, [])).toBeUndefined();
  });
  it('removing run 2 moves run 3 up; the count follows the last filled run', () => {
    expect(cableRunCount(FORM)).toBe(3);
    const f = removeCableRun(FORM, 2);
    expect(cableRunCount(f)).toBe(2);
    expect(f['k2.name']).toBe('AC 1');
    expect(f['k3.name']).toBeUndefined();
    expect(f['k.name']).toBe('PV 1');
    expect(cableRunCount({})).toBe(1);
  });
  it('the diagram preview draws every complete run and the AC protection', () => {
    const r = sldPreviewFromForm(FORM);
    expect(r.errors).toEqual([]);
    const rows = sldRows(r.model!);
    const notes = rows.find(([t]) => t === 'Notes')![1];
    for (const n of ['PV 1', 'PV 2', 'AC 1']) expect(notes).toContain(`Cable ${n} (`);
    expect(rows.find(([t]) => t.startsWith('AC protection'))![1]).toContain('AC circuit breaker: 32 A');
  });
  it('a saved project with runs 2 and 3 opens again (k2., k3. and the digit in k.csaMm2 were refused before this fix)', () => {
    const text = serializeProject({ form: FORM, bom: [], production: { kind: 'none', label: '' } }, null, new Date('2026-11-27T10:00:00Z'));
    const r = readProject(text);
    expect((r as { message?: string }).message ?? 'ok').toBe('ok');
    if (r.ok) expect(r.project.form['k.csaMm2']).toBe('4');
    if (r.ok) expect(r.project.form['k3.name']).toBe('AC 1');
  });
  it('the SLD without AC protection still says it is to be specified and not checked', () => {
    const sld = buildSld({ reference: 'T', module: MOD, inverter: INV, design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, cables: [] });
    expect(sldRows(sld).find(([t]) => t.startsWith('AC protection'))![1]).toContain('AC protection not entered: not checked');
  });
});
