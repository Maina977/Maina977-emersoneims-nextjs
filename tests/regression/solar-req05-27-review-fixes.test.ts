/**
 * Fixes for the independent review of 01244af9 / a20a31b9
 * (REVIEW-SOLAR-REQ05-27-a20a31b9.md), 2026-11-27, and management's site
 * provenance rule. TEST data only; no network.
 *
 * Hand-worked (M1): two inverters, I_B = 24 A each; AC run "AC 1",
 * I_z = 41 × 0.94 × 1 = 38.54 A.
 *  - inverters carried not stated → WARN "not checked: state whether this run carries one inverter or all of them";
 *  - carries 2: need 2 × 24 = 48 A. Design current 24 A < 48 A → REFUSE; design current 48 A but
 *    I_z 38.54 A < 48 A → REFUSE (and its capacity check refuses 48 > 38.54);
 *  - carries 1: need 1 × 24 = 24 A ≤ 24 A and ≤ 38.54 A → PASS.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { buildProposal, siteProvenanceText, type ProposalInput } from '@/lib/solar/design/proposal';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import { checkCable, acProtectionChecks, COPPER_RHO_BASIS, type Module, type Inverter, type CableRun, type AcProtection, type Check } from '@/lib/solar/design/validate';
import { formToProposalInput, cablesFromForm, acProtectionFromForm, siteFromForm, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, type ProposalForm } from '@/lib/solar/design/proposalForm';
import { applySiteHandoff, buildSiteHandoff } from '@/lib/solar/design/siteHandoff';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

beforeAll(() => { vi.stubGlobal('fetch', () => { throw new Error('network disabled in tests'); }); });

const MOD: Module = { model: 'TEST-module-550', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'TEST module rev A' };
const INV: Inverter = { model: 'TEST-inverter-15', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, maxAcOutputA: 24, rcdTypeRequired: 'A', datasheet: 'TEST inverter rev B' };
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', verifiedBy: 'test-2', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['TEST year'], engineVersion: 'solar-hourly test' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'TEST source' });
const AC1: CableRun = { name: 'AC 1', from: 'Inverters', to: 'Main DB', kind: 'ac', lengthM: 25, method: 'C', conductor: 'copper', csaMm2: 6, designCurrentA: 24, systemV: 400, tabulatedAmpacityA: 41, ambientFactor: 0.94, groupingFactor: 1, maxDropPct: 3 };
const AP: AcProtection = { breakerA: 32, device: 'MCB, C curve, 4-pole', deviceType: 'circuit-breaker', cable: 'AC 1', rcdType: 'B' };
const design = (o: Record<string, unknown> = {}): ProposalInput => ({
  reference: 'TEST-REVIEW-FIX', client: { name: 'TEST', siteAddress: 'TEST', lat: -1.29, lon: 36.82 }, module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 2, temps: { recordLowC: 10, maxAmbientC: 35, source: 'TEST' }, cables: [AC1], acProtection: AP, production,
  bom: [{ item: 'PV modules', model: 'TEST', quantity: 64, unit: 'No', rate: { valueKes: 15000, source: 'TEST quote', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
  ...o,
} as unknown as ProposalInput);
const by = (c: Check[], id: string) => c.find((k) => k.id === id)!;
const ac = (run: Partial<CableRun>, n: number, a: AcProtection = AP) => acProtectionChecks(INV, a, [{ ...AC1, ...run }], n);
function viaApi(input: unknown) {
  const parsed = checkProposalRequest(JSON.parse(JSON.stringify({ input, format: 'json' })));
  if ('error' in parsed) return { http: 400, error: parsed.error };
  try { return { http: 200, p: buildProposal(parsed.input, null) }; } catch (e) { return { http: 400, error: (e as Error).message }; }
}

describe('M1: an AC run with several inverters (hand-worked)', () => {
  it('two inverters, inverters carried not stated: WARN "not checked", never PASS (current and I_n ≤ I_z)', () => {
    const c = ac({}, 2);
    expect(by(c, 'ac-cable-current-AC 1')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
    expect(by(c, 'ac-cable-current-AC 1').note).toMatch(/not checked: state whether this run carries one inverter or all of them/);
    expect(by(c, 'ac-breaker-cable')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('carries 2: 2 × 24 = 48 A against a 24 A design current → REFUSE (limit 48 A)', () => {
    expect(by(ac({ invertersCarried: 2 }, 2), 'ac-cable-current-AC 1')).toMatchObject({ verdict: 'REFUSE', value: 24, limit: 48 });
  });
  it('carries 2 with a 48 A design current: I_z 38.54 A < 48 A → REFUSE, and the capacity check refuses too', () => {
    const k = by(ac({ invertersCarried: 2, designCurrentA: 48 }, 2), 'ac-cable-current-AC 1');
    expect(k).toMatchObject({ verdict: 'REFUSE', value: 38.54, limit: 48 });
    expect(k.note).toMatch(/I_z 38.54 A is below the 48 A/);
    expect(checkCable({ ...AC1, designCurrentA: 48 }).checks.find((x) => x.id === 'ampacity-AC 1')).toMatchObject({ verdict: 'REFUSE', limit: 38.54 });
  });
  it('carries 2: one inverter\'s breaker does not protect the shared run → I_n ≤ I_z WARN with the 48 A requirement', () => {
    const k = by(ac({ invertersCarried: 2, designCurrentA: 48 }, 2), 'ac-breaker-cable');
    expect(k.verdict).toBe('WARN');
    expect(k.note).toMatch(/48 A \(2 × 24 A\)/);
  });
  it('carries 1 of 2: 1 × 24 = 24 A ≤ 24 A and ≤ 38.54 A → PASS; I_n ≤ I_z PASS', () => {
    const c = ac({ invertersCarried: 1 }, 2);
    expect(by(c, 'ac-cable-current-AC 1')).toMatchObject({ verdict: 'PASS', limit: 24 });
    expect(by(c, 'ac-breaker-cable').verdict).toBe('PASS');
  });
  it('one inverter, not stated: treated as 1 (nothing assumed beyond the design)', () => {
    expect(by(ac({}, 1), 'ac-cable-current-AC 1').verdict).toBe('PASS');
  });
  it('inverters carried 0, 1.5 or more than the inverter count: REFUSE (engine), 400 (API), reported (form)', () => {
    for (const n of [0, 1.5, 3]) {
      expect(by(ac({ invertersCarried: n }, 2), 'ac-cable-current-AC 1').verdict).toBe('REFUSE');
      expect(viaApi(design({ cables: [{ ...AC1, invertersCarried: n }] })).http).toBe(400);
    }
    expect(viaApi(design({ cables: [{ ...AC1, invertersCarried: 2 }] })).http).toBe(200);
    for (const v of ['0', '1.5', '3']) {
      const e: string[] = [];
      cablesFromForm({ 'd.inverterCount': '2', 'k.name': 'AC 1', 'k.invertersCarried': v }, e);
      expect(e).toContain('Cable run AC 1: inverters carried must be a whole number from 1 to the inverter count (2)');
    }
    const ok: string[] = [];
    expect(cablesFromForm({ 'd.inverterCount': '2', 'k.name': 'AC 1', 'k.invertersCarried': '2' }, ok)[0].invertersCarried).toBe(2);
  });
  it('the whole proposal with two inverters and nothing stated is never PASS on the AC cable', () => {
    const p = buildProposal(design());
    expect(by(p.checks, 'ac-cable-current-AC 1').verdict).toBe('WARN');
  });
});

describe('A1: I_n ≤ I_z passes only for a stated circuit-breaker', () => {
  it('fuse, or device type not stated: WARN "not checked: fuse I2 condition"', () => {
    for (const deviceType of ['fuse', undefined] as const) {
      const k = by(ac({}, 1, { ...AP, deviceType }), 'ac-breaker-cable');
      expect(k.verdict).toBe('WARN');
      expect(k.note).toMatch(/^not checked: fuse I2 condition/);
    }
    expect(by(ac({}, 1), 'ac-breaker-cable').verdict).toBe('PASS');
  });
  it('a fuse rated above I_z is still REFUSED', () => {
    expect(by(ac({}, 1, { ...AP, deviceType: 'fuse', breakerA: 40 }), 'ac-breaker-cable').verdict).toBe('REFUSE');
  });
  it('API and form refuse a device type that is not circuit-breaker or fuse', () => {
    expect(viaApi(design({ inverterCount: 1, acProtection: { ...AP, deviceType: 'MCB' } })).http).toBe(400);
    const e: string[] = [];
    acProtectionFromForm({ 'ap.deviceType': 'MCB' }, [], e);
    expect(e).toEqual(['AC protective device type must be circuit-breaker or fuse']);
  });
});

describe('A2 / A3: voltage-drop labelling and the copper resistivity citation', () => {
  it('an AC run is labelled single-phase and conservative for three-phase (2/√3); a DC run is not', () => {
    const v = checkCable(AC1).checks.find((x) => x.id === 'vdrop-AC 1')!;
    expect(v.formula.startsWith('single-phase ΔV = 2 × L × I × ρ ÷ A')).toBe(true);
    expect(v.note).toMatch(/overstates the drop by 2\/√3 ≈ 1.155/);
    expect(v.value).toBeCloseTo(1.13, 2); // number unchanged: 4.5 V of 400 V
    const d = checkCable({ ...AC1, name: 'DC', kind: 'dc-pv' }).checks.find((x) => x.id === 'vdrop-DC')!;
    expect(d.formula.startsWith('ΔV')).toBe(true);
  });
  it('ρ = 0.0225 is cited as a value to be confirmed against the purchased standard', () => {
    expect(COPPER_RHO_BASIS).toBe('Copper resistivity at operating temperature 0.0225 Ω·mm²/m (value per IEC 60364-5-52 Annex G, to be confirmed against the purchased standard)');
    expect(checkCable(AC1).checks.find((x) => x.id === 'vdrop-AC 1')!.reference).toBe(COPPER_RHO_BASIS);
  });
});

describe('M2 and management: each site value keeps its own provenance category', () => {
  const NOW = new Date('2026-11-27T09:30:00Z');
  const SITE = { lat: -1.29, lon: 36.82, displayName: 'Test site', elevationM: 1661, elevationSource: 'OpenTopoData SRTM 30 m lookup at the coordinates', elevationRetrievedAt: '2026-11-27T09:29:00.000Z' };
  const handed = (): ProposalForm => applySiteHandoff({ ...WORKED_EXAMPLE_FORM, 'c.address': '', 'c.lat': '', 'c.lon': '' }, buildSiteHandoff(SITE, true, NOW).handoff!).form;
  const disclosure = (f: ProposalForm) => {
    const r = formToProposalInput(f, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
    expect(r.errors).toEqual([]);
    return buildProposal(r.input!).disclosures.find((d) => d.startsWith('Site:'))!;
  };

  it('elevation lookup, then area and mounting typed with no source: (a) for the elevation; area and mounting need their own source', () => {
    const f: ProposalForm = { ...handed(), 's.usableAreaM2': '120', 's.mounting': 'roof' };
    expect(f['s.source']).toBeUndefined(); // the general source is never pre-filled
    const e: string[] = [];
    const site = siteFromForm(f, e)!;
    expect(e).toEqual(['Usable area and mounting need their source (survey, drawing, the customer): a source given for another field does not cover them']);
    expect(site.provenance).toEqual({ elevationM: { category: 'automatic', source: SITE.elevationSource, retrievedOn: '2026-11-27' } });
  });
  it('once their source is entered: area and mounting are (b) customer-entered, the elevation stays (a); nothing says verified', () => {
    const d = disclosure({ ...handed(), 's.usableAreaM2': '120', 's.mounting': 'roof', 's.source': 'customer drawing' });
    expect(d).toBe('Site: elevation 1661 m (automatically obtained: OpenTopoData SRTM 30 m lookup at the coordinates, retrieved 2026-11-27); roof-mounted (customer-entered: customer drawing); usable area 120 m² (customer-entered: customer drawing).');
    expect(d).not.toMatch(/verified/);
  });
  it('(c) independently verified only with a stated survey source and the box ticked, and only for the fields that source covers', () => {
    const d = disclosure({ ...handed(), 's.usableAreaM2': '120', 's.mounting': 'roof', 's.source': 'roof survey by TEST engineer, 2026-11-20', 's.verified': 'yes' });
    expect(d).toContain('roof-mounted (independently verified: roof survey by TEST engineer, 2026-11-20)');
    expect(d).toContain('usable area 120 m² (independently verified: roof survey by TEST engineer, 2026-11-20)');
    expect(d).toContain('elevation 1661 m (automatically obtained:'); // the survey does not make the lookup verified
  });
  it('an edited elevation is no longer the lookup: it needs its own source, and is then (b)', () => {
    const f = { ...handed(), 's.elevationM': '1650' };
    const e: string[] = [];
    siteFromForm(f, e);
    expect(e).toEqual(['Site elevation needs its own source (survey, drawing, map), or use the elevation looked up on the Dashboard']);
    expect(disclosure({ ...f, 's.elevationSource': 'level survey' })).toBe('Site: elevation 1650 m (customer-entered: level survey).');
  });
  it('the mounting/area source never covers the elevation (typed elevation without its own source is reported)', () => {
    const e: string[] = [];
    siteFromForm({ 's.elevationM': '1661', 's.mounting': 'roof', 's.source': 'customer drawing' }, e);
    expect(e).toEqual(['Site elevation needs its own source (survey, drawing, map), or use the elevation looked up on the Dashboard']);
  });
  it('the engine and API: an automatic value needs its retrieval date; provenance only for entered fields; known categories only', () => {
    const site = (o: Record<string, unknown>) => design({ inverterCount: 1, site: { elevationM: 1661, source: '', ...o } });
    expect(viaApi(site({ provenance: { elevationM: { category: 'automatic', source: 'SRTM', retrievedOn: '2026-11-27' } } })).http).toBe(200);
    expect(viaApi(site({ provenance: { elevationM: { category: 'automatic', source: 'SRTM' } } })).http).toBe(400);
    expect(viaApi(site({ provenance: { elevationM: { category: 'checked', source: 'SRTM' } } })).http).toBe(400);
    expect(viaApi(site({ provenance: { usableAreaM2: { category: 'customer', source: 'x' } } })).http).toBe(400);
    expect(viaApi(site({})).http).toBe(400); // elevation with no provenance and no shared source
    expect(() => buildProposal(site({ provenance: { elevationM: { category: 'automatic', source: 'SRTM' } } }))).toThrow(/retrieval date/);
  });
  it('a request with one shared source (older callers) shows each value as customer-entered, never verified', () => {
    expect(siteProvenanceText({ elevationM: 1661, mounting: 'roof', source: 'TEST survey' })).toBe('elevation 1661 m (customer-entered: TEST survey); roof-mounted (customer-entered: TEST survey)');
  });
});
