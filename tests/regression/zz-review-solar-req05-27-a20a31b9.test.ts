/**
 * Independent review probes, REQ-05 (01244af9) and REQ-27 (a20a31b9).
 * TEST data only; no network (fetch stubbed). "FINDING" = what the company rules require.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import { importInverter } from '@/lib/solar/design/datasheet';
import { checkCable, acProtectionChecks, type Module, type Inverter, type CableRun, type AcProtection, type Check } from '@/lib/solar/design/validate';
import { formToProposalInput, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, siteFromForm } from '@/lib/solar/design/proposalForm';
import { readProject, serializeProject } from '@/lib/solar/design/proposalSave';
import { proposalRevisionHash } from '@/lib/solar/design/proposalApproval';
import { buildSiteHandoff, readSiteHandoff, applySiteHandoff, takeSiteHandoff, storeSiteHandoff, PLACE_SEARCH_SOURCE, SITE_HANDOFF_KEY, type SiteHandoff } from '@/lib/solar/design/siteHandoff';
import { parseElevationAnswer } from '@/components/solar-modules/crc/src/services/siteAssessment';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

beforeAll(() => { vi.stubGlobal('fetch', () => { throw new Error('network disabled in tests'); }); });

const MOD: Module = { model: 'R-mod', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'R' };
const INV: Inverter = { model: 'R-inv', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, maxAcOutputA: 24, rcdTypeRequired: 'A', datasheet: 'R' };
const prov = { manufacturer: 'R', datasheetUrl: 'https://example.com/r.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', verifiedBy: 'b', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: string) => ({ kind, id: `${kind}-r`, data, provenance: prov, status: 'verified', warnings: [] } as unknown as LibraryEntry<T>);
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['R'], engineVersion: 'r' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'R' });
const AC1: CableRun = { name: 'AC 1', from: 'Inverter', to: 'Main DB', kind: 'ac', lengthM: 25, method: 'C', conductor: 'copper', csaMm2: 6, designCurrentA: 24, systemV: 400, tabulatedAmpacityA: 41, ambientFactor: 0.94, groupingFactor: 1, maxDropPct: 3 };
// Engineer, fix of this review (A1): a PASS on I_n ≤ I_z now needs the device stated as a circuit-breaker.
const AP: AcProtection = { breakerA: 32, device: 'MCB C 4P', deviceType: 'circuit-breaker', cable: 'AC 1', rcdType: 'B' };
const design = (o: Partial<ProposalInput> = {}, inv: Partial<Inverter> = {}): ProposalInput => ({
  reference: 'R-05', client: { name: 'R', siteAddress: 'R', lat: -1.29, lon: 36.82 }, module: entry(MOD, 'module'), inverter: entry({ ...INV, ...inv }, 'inverter'),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'R' }, cables: [AC1], acProtection: AP, production,
  bom: [{ item: 'PV', model: 'R', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'R quote', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
  ...o,
});
const ap = (inv: Partial<Inverter> = {}, a: AcProtection | undefined = AP, cables: CableRun[] = [AC1], n = 1) => acProtectionChecks({ ...INV, ...inv }, a, cables, n);
const by = (c: Check[], id: string) => c.find((k) => k.id === id);
function viaApi(input: unknown) {
  const parsed = checkProposalRequest(JSON.parse(JSON.stringify({ input, format: 'json' })));
  if ('error' in parsed) return { http: 400 as const, error: parsed.error };
  try { return { http: 200 as const, p: buildProposal(parsed.input, null) }; } catch (e) { return { http: 400 as const, error: (e as Error).message }; }
}

describe('1. hand checks', () => {
  it('H1–H3 re-worked: Iz = 41 × 0.94 = 38.54; 24 ≤ 32 ≤ 38.54 PASS; Cg 0.7 → 26.98 REFUSE; 20 A breaker REFUSE', () => {
    expect(by(ap(), 'ac-breaker-current')).toMatchObject({ verdict: 'PASS', value: 32, limit: 24 });
    expect(by(ap(), 'ac-breaker-cable')).toMatchObject({ verdict: 'PASS', limit: 38.54 });
    expect(by(ap({}, AP, [{ ...AC1, groupingFactor: 0.7 }]), 'ac-breaker-cable')).toMatchObject({ verdict: 'REFUSE', limit: 26.98 });
    expect(by(ap({}, { ...AP, breakerA: 20 }), 'ac-breaker-current')?.verdict).toBe('REFUSE');
    const vd = checkCable(AC1).checks.find((k) => k.id === 'vdrop-AC 1')!;
    expect(vd).toMatchObject({ verdict: 'PASS', value: 1.13 }); // 2 × 25 × 24 × 0.0225 ÷ 6 = 4.5 V; 4.5 / 400 = 1.125 %
  });
  it('breaker exactly equal to the output (24 A = 24 A) and exactly equal to Iz (38.54 = 38.54): both PASS (≤ is inclusive)', () => {
    expect(by(ap({}, { ...AP, breakerA: 24 }), 'ac-breaker-current')?.verdict).toBe('PASS');
    // Iz = 40 × 1 × 1 = 40 A exactly
    const c40 = { ...AC1, tabulatedAmpacityA: 40, ambientFactor: 1 };
    expect(by(ap({}, { ...AP, breakerA: 40 }, [c40]), 'ac-breaker-cable')).toMatchObject({ verdict: 'PASS', limit: 40 });
    expect(by(ap({}, { ...AP, breakerA: 40.01 }, [c40]), 'ac-breaker-cable')?.verdict).toBe('REFUSE');
    // design current exactly equal to I_B
    expect(by(ap(), 'ac-cable-current-AC 1')?.verdict).toBe('PASS');
    expect(by(ap({}, AP, [{ ...AC1, designCurrentA: 23.99 }]), 'ac-cable-current-AC 1')?.verdict).toBe('REFUSE');
  });
  it('three-phase 15 kW inverter, 400 V: I_B = 15,000 / (√3 × 400) = 21.65 A per phase (datasheet 21.7 A); 25 A 4-pole MCB on 6 mm² PASS, 20 A REFUSE', () => {
    const ib = 15000 / (Math.sqrt(3) * 400);
    expect(ib).toBeCloseTo(21.65, 2);
    expect(by(ap({ maxAcOutputA: 21.7 }, { ...AP, breakerA: 25 }, [{ ...AC1, designCurrentA: 21.7 }]), 'ac-breaker-current')?.verdict).toBe('PASS');
    expect(by(ap({ maxAcOutputA: 21.7 }, { ...AP, breakerA: 20 }, [{ ...AC1, designCurrentA: 21.7 }]), 'ac-breaker-current')?.verdict).toBe('REFUSE');
    // Voltage drop uses the single-phase 2 × L form: conservative for three-phase by 2/√3 = 1.155 (advisory, not a pass of a wrong figure).
    const vd = checkCable({ ...AC1, designCurrentA: 21.7 }).checks.find((k) => k.id === 'vdrop-AC 1')!;
    expect(vd.value).toBeCloseTo((2 * 25 * 21.7 * 0.0225 / 6) / 400 * 100, 2);
  });
  it('maxAcOutputA missing, 0, negative or NaN: never PASS (engine), and the API refuses 0 / −1', () => {
    for (const v of [undefined, 0, -5, NaN]) {
      const c = ap({ maxAcOutputA: v as number });
      expect(by(c, 'ac-breaker-current')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
      expect(by(c, 'ac-cable-current-AC 1')?.verdict).not.toBe('PASS');
    }
    expect(viaApi(design({}, { maxAcOutputA: 0 })).http).toBe(400);
    expect(viaApi(design({}, { maxAcOutputA: -1 })).http).toBe(400);
    expect(importInverter({ manufacturer: 'R', datasheetUrl: 'https://e.com/a.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'a', enteredOn: '2026-11-20', model: 'I', acKw: '15', maxDcV: '1000', mpptMinV: '200', mpptMaxV: '850', mpptCount: '2', maxInputA: '26', maxIscA: '40', maxAcOutputA: '0' }).errors.join(' ')).toMatch(/maxAcOutputA/);
  });
  it('RCD: requirement missing → WARN; unknown requirement / fitted type → REFUSE (engine) and 400 (API); none fitted vs A → REFUSE; F fitted vs B → REFUSE; B vs F → PASS', () => {
    expect(by(ap({ rcdTypeRequired: undefined }), 'ac-rcd-type')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
    expect(by(ap({ rcdTypeRequired: 'X' as never }), 'ac-rcd-type')?.verdict).toBe('REFUSE');
    expect(by(ap({}, { ...AP, rcdType: 'Z' as never }), 'ac-rcd-type')?.verdict).toBe('REFUSE');
    expect(viaApi(design({}, { rcdTypeRequired: 'b' as never })).http).toBe(400);
    expect(viaApi(design({ acProtection: { ...AP, rcdType: 'Z' as never } })).http).toBe(400);
    expect(by(ap({}, { ...AP, rcdType: 'none' }), 'ac-rcd-type')?.verdict).toBe('REFUSE');
    expect(by(ap({}, { ...AP, rcdType: undefined }), 'ac-rcd-type')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
    expect(by(ap({ rcdTypeRequired: 'B' }, { ...AP, rcdType: 'F' }), 'ac-rcd-type')?.verdict).toBe('REFUSE');
    expect(by(ap({ rcdTypeRequired: 'F' }, { ...AP, rcdType: 'B' }), 'ac-rcd-type')?.verdict).toBe('PASS');
    expect(by(ap({ rcdTypeRequired: 'AC' }, { ...AP, rcdType: 'A' }), 'ac-rcd-type')?.verdict).toBe('PASS');
  });
});

describe('2. missing or contradictory data: no PASS through form or API', () => {
  it('no AC protection at all → one WARN "not checked"', () => {
    expect(acProtectionChecks(INV, undefined, [AC1], 1)).toEqual([expect.objectContaining({ id: 'ac-protection', verdict: 'WARN', formula: 'not checked' })]);
  });
  it('old API request: cable with no method and no conductor → accepted, ampacity / vdrop / breaker-cable WARN, never PASS', () => {
    const old = { ...AC1 } as Record<string, unknown>; delete old.method; delete old.conductor; delete old.from; delete old.to;
    const r = viaApi(design({ cables: [old as unknown as CableRun] }));
    expect(r.http).toBe(200);
    const ids = ['ampacity-AC 1', 'vdrop-AC 1', 'ac-breaker-cable'];
    for (const id of ids) expect(r.p!.checks.find((k) => k.id === id)?.verdict, id).toBe('WARN');
  });
  it('contradictions: breaker names a missing run or a DC run; duplicate / blank run names; unknown acProtection key → 400 at the API, REFUSE / throw in the engine', () => {
    expect(viaApi(design({ acProtection: { ...AP, cable: 'Nope' } })).http).toBe(400);
    expect(by(ap({}, { ...AP, cable: 'Nope' }), 'ac-breaker-cable')?.verdict).toBe('REFUSE');
    const dc = { ...AC1, kind: 'dc-pv' as const };
    expect(viaApi(design({ cables: [dc] })).http).toBe(400);
    expect(by(ap({}, AP, [dc]), 'ac-breaker-cable')?.verdict).toBe('REFUSE');
    expect(viaApi(design({ cables: [AC1, AC1] })).http).toBe(400);
    expect(viaApi(design({ cables: [{ ...AC1, name: ' ' }] , acProtection: undefined })).http).toBe(400);
    expect(() => buildProposal(design({ cables: [AC1, AC1] }))).toThrow(/unique/);
    expect(viaApi(design({ acProtection: { ...AP, extra: 1 } as never })).http).toBe(400);
    expect(viaApi(design({ cables: [{ ...AC1, conductor: 'gold' as never }] })).http).toBe(400);
  });
  it('aluminium: voltage drop WARN not checked (form and API)', () => {
    const r = viaApi(design({ cables: [{ ...AC1, conductor: 'aluminium' }] }));
    expect(r.p!.checks.find((k) => k.id === 'vdrop-AC 1')).toMatchObject({ verdict: 'WARN', formula: 'not checked' });
  });
  it('form: a started cable run with missing fields and a bad breaker are reported, not defaulted', () => {
    const f = { ...WORKED_EXAMPLE_FORM, 'k2.name': 'AC 2', 'k2.kind': 'ac', 'ap.breakerA': '-3', 'ap.rcdType': 'Q' };
    const r = formToProposalInput(f, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
    const e = r.errors.join(' | ');
    expect(e).toMatch(/Cable run AC 2: .* is required/);
    expect(e).toMatch(/AC breaker rating must be a positive number/);
    expect(e).toMatch(/RCD fitted must be none, AC, A, F or B/);
  });
});

describe('3. listed not-checked items are never a PASS', () => {
  it('FINDING: two inverters, one AC cable named for the breaker: the cable current check must not PASS on one inverter\'s current alone', () => {
    // inverterCount 2, cable design current 24 A = one inverter. If the cable is shared it carries 48 A.
    // The engine cannot tell shared from per-inverter, so a PASS here treats missing data as compliant.
    const c = ap({}, AP, [AC1], 2);
    const k = by(c, 'ac-cable-current-AC 1')!;
    expect(k.verdict, `verdict ${k.verdict}, note: ${k.note}`).not.toBe('PASS');
  });
  it('I2 ≤ 1.45 Iz: only a note on the In ≤ Iz check; SPD and DC switch-disconnector are "to be specified" text, not checks', () => {
    const k = by(ap(), 'ac-breaker-cable')!;
    expect(k.note).toMatch(/I_2 ≤ 1.45 × I_z\) is not worked out/);
    const p = buildProposal(design());
    expect(p.checks.some((x) => /spd|surge|disconnector/i.test(x.id + x.title) && x.verdict === 'PASS')).toBe(false);
  });
});

describe('5. REQ-27 hand-off', () => {
  const NOW = new Date('2026-11-27T09:30:00Z');
  // Engineer, fix of this review (management provenance (a)): an elevation is carried only with its retrieval time.
  const SITE = { lat: -1.2921, lon: 36.8219, displayName: 'R place, Nairobi', elevationM: 1661, elevationSource: 'OpenTopoData SRTM 30 m lookup at the coordinates', elevationRetrievedAt: '2026-11-27T09:29:00.000Z' };
  const mem = () => { const m = new Map<string, string>(); return { m, getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v); }, removeItem: (k: string) => { m.delete(k); } }; };
  it('elevation without a source, NaN, out of range, or unticked: not carried', () => {
    expect(buildSiteHandoff({ ...SITE, elevationSource: '' }, true, NOW).handoff).toBeNull();
    expect(buildSiteHandoff({ ...SITE, elevationM: NaN }, true, NOW).handoff).toBeNull();
    expect(buildSiteHandoff({ ...SITE, elevationM: 9000 }, true, NOW).handoff).toBeNull();
    expect(buildSiteHandoff(SITE, false, NOW).handoff).not.toHaveProperty('elevationM');
    expect(parseElevationAnswer({ success: true, data: { location: { elevation: 1661 } } })).toBeNull();
    expect(parseElevationAnswer({ success: true, data: { location: { elevation: 1661, source: '  ' } } })).toBeNull();
    expect(readSiteHandoff(JSON.stringify({ v: 1, confirmedAt: NOW.toISOString(), address: 'x', lat: 0, lon: 0, coordinatesSource: 'x', elevationM: 1000 }))).toBeNull();
  });
  it('the hand-off holds only the site: address, coordinates, their sources, optional elevation, time', () => {
    const h = buildSiteHandoff(SITE, true, NOW).handoff!;
    expect(Object.keys(h).sort()).toEqual(['address', 'confirmedAt', 'coordinatesSource', 'elevationM', 'elevationRetrievedAt', 'elevationSource', 'lat', 'lon', 'v']);
    // A stored record with extra fields (e.g. a client name) is not passed on.
    const r = readSiteHandoff(JSON.stringify({ ...h, clientName: 'Jane', phone: '0700' }))!;
    expect(Object.keys(r)).not.toContain('clientName');
  });
  it('never overwrites; differences listed; read once and deleted', () => {
    const h = buildSiteHandoff(SITE, true, NOW).handoff!;
    const out = applySiteHandoff({ 'c.lat': '-1.3', 'c.address': '' }, h);
    expect(out.form['c.lat']).toBe('-1.3');
    expect(out.differences.map((d) => d.key)).toContain('c.lat');
    expect(out.form['c.address']).toBe(SITE.displayName);
    const st = mem(); storeSiteHandoff(st, h);
    expect(takeSiteHandoff(st)).not.toBeNull();
    expect(st.m.has(SITE_HANDOFF_KEY)).toBe(false);
    expect(takeSiteHandoff(st)).toBeNull();
  });
  it('the revision hash is the same whether the site values were typed or pre-filled', () => {
    const blank = { ...WORKED_EXAMPLE_FORM, 'c.address': '', 'c.lat': '', 'c.lon': '' };
    const h: SiteHandoff = { v: 1, confirmedAt: NOW.toISOString(), address: WORKED_EXAMPLE_FORM['c.address'], lat: Number(WORKED_EXAMPLE_FORM['c.lat']), lon: Number(WORKED_EXAMPLE_FORM['c.lon']), coordinatesSource: PLACE_SEARCH_SOURCE };
    const pre = applySiteHandoff(blank, h).form;
    expect(pre['hand.site']).toBeTruthy();
    const a = formToProposalInput(WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null).input!;
    const b = formToProposalInput(pre, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null).input!;
    expect(proposalRevisionHash(b)).toBe(proposalRevisionHash(a));
  });
  it('FINDING: the pre-filled elevation source must not become the source of a usable area or mounting typed later', () => {
    const h = buildSiteHandoff(SITE, true, NOW).handoff!;
    const f = applySiteHandoff({}, h).form;
    f['s.usableAreaM2'] = '120'; f['s.mounting'] = 'roof'; // typed by the designer, no source of their own
    const errors: string[] = [];
    const site = siteFromForm(f, errors);
    // Rule: every figure traceable. The area/mounting would be stated with "Elevation: OpenTopoData …" as their source.
    expect(errors.join(' ') + ' ' + (site?.source ?? ''), `site source = "${site?.source}"`).toMatch(/source .*(area|mounting)|area.*source/i);
  });
});

describe('6. saved-form key pattern', () => {
  const doc = (form: Record<string, string>) => serializeProject({ form, bom: [], production: { kind: 'none', label: '' } } as never, null, new Date('2026-11-27T00:00:00Z'));
  it('legitimate keys open; prototype keys and odd keys are refused', () => {
    const good = readProject(doc({ ref: 'x', 'k.csaMm2': '6', 'k2.name': 'AC 2', 'k8.lengthM': '3', 'hand.site': '{}', 'ap.breakerA': '32' }));
    expect(good.ok, JSON.stringify(good)).toBe(true);
    const template = doc({ zzzz: 'x' });
    expect(readProject(template).ok).toBe(true);
    for (const bad of ['__proto__', 'constructor', 'prototype', 'k1.name', 'k9x.name', 'k.__proto__', 'k.2x', 'K.name', 'k.na-me', 'toString', 'valueOf', 'hasOwnProperty']) {
      const r = readProject(template.replace('"zzzz"', JSON.stringify(bad)));
      expect(r.ok, bad).toBe(false);
    }
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});
