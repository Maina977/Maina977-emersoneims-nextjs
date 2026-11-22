import { describe, it, expect } from 'vitest';
import { npv, irr, simplePayback, buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import type { Module, Inverter } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';
import { APPROVAL_UNAVAILABLE_REASON, TYPED_APPROVAL_IGNORED_REASON, proposalRevisionHash } from '@/lib/solar/design/proposalApproval';

// TEST components, prices, tariffs and approvals only — never project data.
const MOD: Module = { model: 'test-module', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'test datasheet rev A' };
const INV: Inverter = { model: 'test-inverter', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, datasheet: 'test inverter rev B' };
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20' };
const entry = <T,>(data: T, kind: 'module' | 'inverter', verified = true): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: verified ? { ...prov, verifiedBy: 'test-2', verifiedOn: '2026-11-20' } : prov, status: verified ? 'verified' : 'unverified', warnings: [] });
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 50, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['Weather: test year (8760 hours). Losses: test.'], engineVersion: 'solar-hourly test' } as unknown as HourlyResult;
const s = (value: number, source = 'test source') => ({ value, source });
const base = (): ProposalInput => ({
  reference: 'TEST-001', client: { name: 'Test client', siteAddress: 'Test site', lat: -1.29, lon: 36.82 },
  module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'test station record' },
  cables: [], production,
  bom: [{ item: 'PV modules', model: 'test-module', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'test supplier quote Q-1', date: '2026-11-01' } },
        { item: 'Inverter', model: 'test-inverter', quantity: 1, unit: 'No', rate: { valueKes: 320000, source: 'test supplier quote Q-1', date: '2026-11-01' } }],
  finance: { tariffKesPerKwh: s(25, 'customer bill (test)'), selfConsumedFraction: s(0.8, 'load logger (test)'), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
});

describe('proposal exports', () => {
  it('Excel: summary marked DRAFT, capex and year-1 cash flow match the proposal', async () => {
    const { proposalToXlsx } = await import('@/lib/solar/design/proposalExport');
    const ExcelJS = (await import('exceljs')).default;
    const p = buildProposal(base());
    const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await proposalToXlsx(p) as unknown as ArrayBuffer);
    expect(wb.worksheets.map((w) => w.name)).toEqual(['Summary', 'Design checks', 'Equipment & costs', 'Cash flow']);
    const sum = wb.getWorksheet('Summary')!;
    expect(String(sum.getCell('A2').value)).toMatch(/DRAFT: NOT FOR ISSUE/);
    expect(sum.getCell('B3').value).toBe(p.revisionHash);
    expect(String(sum.getCell('B4').value)).toMatch(/not available yet .* All proposals remain DRAFT/);
    const cells: string[] = [];
    sum.eachRow((row) => row.eachCell((c) => { cells.push(String(c.value)); }));
    expect(cells.filter((c) => /FOR ISSUE/.test(c) && !/NOT FOR ISSUE/.test(c))).toEqual([]);
    expect(wb.getWorksheet('Cash flow')!.getCell('E2').value).toBe(380000);
  }, 30000); // ExcelJS import + round trip exceeds 5 s under full-suite load
  it('PDF: a valid document whose TEXT (read with pdfjs, not raw bytes) is DRAFT with the revision hash', async () => {
    const { proposalToPdf } = await import('@/lib/solar/design/proposalExport');
    const p = buildProposal(base());
    const pdf = proposalToPdf(p);
    expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe('%PDF-');
    // 2026-11-22: a raw-byte search only works if the PDF is uncompressed; read the text instead.
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const { pathToFileURL } = await import('node:url'); const path = await import('node:path');
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
    const doc = await pdfjs.getDocument({ data: pdf.slice() }).promise;
    let text = '';
    for (let n = 1; n <= doc.numPages; n++) text += (await (await doc.getPage(n)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + '\n';
    text = text.replace(/\s+/g, ' ');
    expect(text).toContain('TEST-001');
    expect(text).toMatch(/800,?000/); // capex 32 × 15,000 + 320,000
    expect(text).toContain(p.revisionHash);
    expect(text).toContain('DRAFT: NOT FOR ISSUE');
    expect(text).not.toContain('(FOR ISSUE)');
  });
});

describe('finance functions (hand checks)', () => {
  it('NPV at 10 % of −1000 then +1100 is 0; IRR is 10 %', () => {
    expect(npv(10, [-1000, 1100])).toBeCloseTo(0, 9);
    expect(irr([-1000, 1100])).toBeCloseTo(10, 4);
  });
  it('payback −1000, +400 ×3 → 2.5 years; never → null; no sign change → IRR null', () => {
    expect(simplePayback([-1000, 400, 400, 400])).toBe(2.5);
    expect(simplePayback([-1000, 100, 100])).toBeNull();
    expect(irr([100, 100])).toBeNull();
  });
});

describe('design-to-proposal', () => {
  it('32 × 550 W = 17.6 kWp; capex 32 × 15,000 + 320,000 = 800,000; year 1 net = 20,000 × 0.8 × 25 − 20,000 = 380,000', () => {
    const p = buildProposal(base());
    expect(p.system.dcKwp).toBe(17.6);
    expect(p.costing.capexKes).toBe(800000);
    expect(p.finance!.cashflows[0]).toMatchObject({ savingsKes: 400000, netKes: 380000 });
    expect(p.finance!.simplePaybackYears).toBeCloseTo(800000 / 380000, 2);
    // 20 equal 380,000 inflows at 10 %: annuity factor 8.5136 → NPV 3,235,170 − 800,000
    expect(p.finance!.npvKes).toBeCloseTo(380000 * 8.513564 - 800000, -1);
  });
  it('without a verified approval it stays DRAFT, failing closed with the stated reason', () => {
    const p = buildProposal(base());
    expect(p.status).toBe('DRAFT');
    expect(p.approval).toBeNull();
    expect(p.statusReasons).toEqual([APPROVAL_UNAVAILABLE_REASON]);
    expect(p.revisionHash).toBe(proposalRevisionHash(base()));
    expect(p.revisionHash).toMatch(/^[0-9a-f]{64}$/);
  });
  it('a typed approval (name, registration, date) never grants FOR ISSUE', () => {
    const typed = { ...base(), approval: { engineer: 'TEST ENGINEER', registration: 'TEST-REG', date: '2026-11-20' } } as unknown as ProposalInput;
    const p = buildProposal(typed);
    expect(p.status).toBe('DRAFT');
    expect(p.approval).toBeNull();
    expect(p.statusReasons).toContain(TYPED_APPROVAL_IGNORED_REASON);
    expect(p.statusReasons).toContain(APPROVAL_UNAVAILABLE_REASON);
    // The typed approval is not part of the revision.
    expect(p.revisionHash).toBe(buildProposal(base()).revisionHash);
  });
  it('an unsafe string (20 modules: cold Voc > 1000 V) refuses the proposal', () => {
    const p = buildProposal({ ...base(), design: { modulesPerString: 20, stringsPerMppt: [1] } });
    expect(p.status).toBe('REFUSED');
  });
  it('an unpriced item: no capex, no financial result, "rate required"', () => {
    const i = base(); i.bom.push({ item: 'Mounting structure', model: 'TBD', quantity: 1, unit: 'item', rate: null });
    const p = buildProposal(i);
    expect(p.costing.capexKes).toBeNull();
    expect(p.finance).toBeNull();
    expect(p.statusReasons.join(' ')).toMatch(/Rate required: Mounting structure/);
  });
  it('an unverified datasheet keeps it DRAFT', () => {
    const p = buildProposal({ ...base(), module: entry(MOD, 'module', false) });
    expect(p.status).toBe('DRAFT');
    expect(p.statusReasons.join(' ')).toMatch(/not verified/);
  });
  it('refuses unsourced finance inputs; always carries uncertainty disclosures', () => {
    const i = base(); i.finance.tariffKesPerKwh = { value: 25, source: '' };
    expect(() => buildProposal(i)).toThrow(/Tariff/);
    expect(buildProposal(base()).disclosures.join(' ')).toMatch(/not a guarantee/);
  });
});
