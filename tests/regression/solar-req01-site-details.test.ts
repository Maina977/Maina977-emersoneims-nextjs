/**
 * REQ-01 (P1-B §2 Site): elevation, roof or ground mounting and usable area
 * are entered with their source, carried into the proposal, shown on the
 * screen and in Excel/PDF; nothing is assumed when they are blank. TEST data.
 */
import { describe, it, expect } from 'vitest';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { siteFromForm } from '@/lib/solar/design/proposalForm';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import type { Module, Inverter } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

const MOD: Module = { model: 'test-module', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'test datasheet rev A' };
const INV: Inverter = { model: 'test-inverter', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, datasheet: 'test inverter rev B' };
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', verifiedBy: 'test-2', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: 'module' | 'inverter'): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: prov, status: 'verified', warnings: [] });
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['TEST'], engineVersion: 'test' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'TEST' });
const input = (site?: ProposalInput['site']): ProposalInput => ({
  reference: 'TEST-SITE', client: { name: 'T', siteAddress: 'T', lat: -1.29, lon: 36.82 }, ...(site ? { site } : {}), module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'TEST' }, cables: [], production,
  bom: [{ item: 'PV modules', model: 'test-module', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'TEST quote', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
});
const SITE = { mounting: 'roof' as const, elevationM: 1661, usableAreaM2: 120, source: 'TEST roof survey 2026-11-20' };

describe('REQ-01: site elevation, mounting and usable area', () => {
  it('carried into the proposal and its disclosures with the source', () => {
    const p = buildProposal(input(SITE));
    expect(p.site).toEqual(SITE);
    // Review M2: each value is shown with its provenance category; one shared source given here = customer-entered for each.
    expect(p.disclosures.join(' ')).toContain('Site: elevation 1661 m (customer-entered: TEST roof survey 2026-11-20); roof-mounted (customer-entered: TEST roof survey 2026-11-20); usable area 120 m² (customer-entered: TEST roof survey 2026-11-20).');
  });
  it('blank → null, and the proposal says the layout is not checked against the area (nothing assumed)', () => {
    const p = buildProposal(input());
    expect(p.site).toBeNull();
    expect(p.disclosures.join(' ')).toMatch(/were not entered: the layout is not checked against the available area/);
  });
  it('invalid or unsourced site details are refused', () => {
    expect(() => buildProposal(input({ ...SITE, elevationM: 9000 }))).toThrow(/elevation/);
    expect(() => buildProposal(input({ ...SITE, mounting: 'wall' as unknown as 'roof' }))).toThrow(/roof or ground/);
    expect(() => buildProposal(input({ ...SITE, usableAreaM2: 0 }))).toThrow(/Usable area/);
    expect(() => buildProposal(input({ ...SITE, source: ' ' }))).toThrow(/source/);
  });
  it('the form reads the fields and reports bad ones', () => {
    const errors: string[] = [];
    // Review M2: the elevation has its own source field; each value carries its provenance.
    const cust = { category: 'customer', source: 'site plan' };
    expect(siteFromForm({ 's.mounting': 'Ground', 's.elevationM': '1200', 's.elevationSource': 'site plan', 's.usableAreaM2': '300', 's.source': 'site plan' }, errors)).toEqual({ mounting: 'ground', elevationM: 1200, usableAreaM2: 300, source: 'site plan', provenance: { elevationM: cust, mounting: cust, usableAreaM2: cust } });
    expect(errors).toEqual([]);
    expect(siteFromForm({}, errors)).toBeUndefined();
    siteFromForm({ 's.mounting': 'pole', 's.usableAreaM2': '-1' }, errors);
    expect(errors).toHaveLength(3); // mounting, area, source
  });
  it('the request validator accepts site and rejects a wrong shape; Excel shows it', async () => {
    expect('error' in checkProposalRequest({ format: 'json', input: input(SITE) })).toBe(false);
    const bad = checkProposalRequest({ format: 'json', input: { ...input(), site: { mounting: 'wall', source: 'x' } } });
    expect('error' in bad ? bad.error : '').toMatch(/site must be/);
    const { proposalToXlsx } = await import('@/lib/solar/design/proposalExport');
    const ExcelJS = (await import('exceljs')).default;
    const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await proposalToXlsx(buildProposal(input(SITE))) as unknown as ArrayBuffer);
    const vals: string[] = []; wb.getWorksheet('Summary')!.eachRow((r) => vals.push(`${r.getCell(1).value}=${r.getCell(2).value}`));
    expect(vals).toEqual(expect.arrayContaining(['Mounting=roof', 'Elevation (m)=1661', 'Usable area (m²)=120', 'Site details source=TEST roof survey 2026-11-20']));
  }, 30000);
});
