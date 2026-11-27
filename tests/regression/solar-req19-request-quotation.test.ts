/**
 * REQ-19 (P1-B §4 BOQ): prices only from a verified list or a customer quote;
 * otherwise "Request a quotation" (the company wording, lib/solar/sizing.ts
 * REQUEST_QUOTATION), not "rate required". TEST data only.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { REQUEST_QUOTATION } from '@/lib/solar/sizing';
import type { Module, Inverter } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

const MOD: Module = { model: 'test-module', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'test datasheet rev A' };
const INV: Inverter = { model: 'test-inverter', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, datasheet: 'test inverter rev B' };
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', verifiedBy: 'test-2', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: 'module' | 'inverter'): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: prov, status: 'verified', warnings: [] });
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 0, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['TEST'], engineVersion: 'test' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'TEST' });
const input = (): ProposalInput => ({
  reference: 'TEST-Q', client: { name: 'T', siteAddress: 'T', lat: -1.29, lon: 36.82 }, module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'),
  design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35, source: 'TEST' }, cables: [], production,
  bom: [{ item: 'PV modules', model: 'test-module', quantity: 32, unit: 'No', rate: { valueKes: 15000, source: 'TEST quote', date: '2026-11-01' } },
        { item: 'Inverter', model: 'test-inverter', quantity: 1, unit: 'No', rate: null }],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
});

describe('REQ-19: an unquoted line says "Request a quotation"', () => {
  it('the proposal reason, total and finance', () => {
    expect(REQUEST_QUOTATION).toBe('Request a quotation');
    const p = buildProposal(input());
    expect(p.costing.capexKes).toBeNull();
    expect(p.costing.unpriced).toEqual(['Inverter']);
    expect(p.finance).toBeNull();
    expect(p.statusReasons.some((r) => r.startsWith('Request a quotation for: Inverter'))).toBe(true);
    expect(p.statusReasons.some((r) => /rate required/i.test(r))).toBe(false);
  });
  it('the Excel line and capital cost', async () => {
    const { proposalToXlsx } = await import('@/lib/solar/design/proposalExport');
    const ExcelJS = (await import('exceljs')).default;
    const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await proposalToXlsx(buildProposal(input())) as unknown as ArrayBuffer);
    const sh = wb.getWorksheet('Equipment & costs')!;
    expect(sh.getRow(3).getCell(5).value).toBe('Request a quotation');
    expect(String(wb.getWorksheet('Summary')!.getColumn(2).values.find((v) => v === 'Request a quotation'))).toBe('Request a quotation');
  }, 30000);
  it('no solar proposal screen or export still says "rate required"', () => {
    for (const f of ['lib/solar/design/proposal.ts', 'lib/solar/design/proposalExport.ts', 'components/solar-modules/crc/src/pages/ProposalPage.tsx']) {
      const src = fs.readFileSync(path.join(process.cwd(), f), 'utf8').split('\n').filter((l) => !/^\s*(\*|\/\/)/.test(l)).join('\n');
      expect(src, f).not.toMatch(/'rate required'|"rate required"|`Rate required|rate required for/);
    }
  });
});
