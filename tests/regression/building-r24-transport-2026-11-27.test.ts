/**
 * Register R-24 (P1-D §5, RS20 "rate build-ups"): a build-up has materials,
 * labour, plant, TRANSPORT and wastage %. Transport was missing.
 * Every price below is a TEST value with a TEST source.
 */
import { describe, it, expect } from 'vitest';
import ExcelJS from 'exceljs';
import { computeBuildUp, parseRatesFile, RESOURCE_LABELS, type Resource } from '@/lib/qs/rateBuildUp';
import { buildBoq } from '@/lib/qs/boq';
import { boqToXlsx } from '@/lib/qs/export';

const R = (kind: Resource['kind'], unit: string, quantity: number, price: number | null, wastePct = 0): Resource =>
  ({ kind, description: `TEST ${kind}`, unit, quantity, price, tier: price === null ? null : 'verified', wastePct, source: 'TEST quote', date: '2026-11-01' });

describe('R-24: transport line in the rate build-up', () => {
  it('hand-worked: blockwork per m², materials + labour + plant + transport', () => {
    // material 12.5 No × 60 × 1.05 = 787.50; labour 0.8 h × 250 = 200.00; plant 0.05 h × 1,200 = 60.00;
    // transport 0.20 t per m² × 950 per t = 190.00; net = 1,237.50; O&P 10 % = 123.75; rate = 1,361.25.
    const b = computeBuildUp({ ohpPct: 10, ohpSource: 'TEST policy', location: 'TEST', resources: [R('material', 'No', 12.5, 60, 5), R('labour', 'h', 0.8, 250), R('plant', 'h', 0.05, 1200), R('transport', 't', 0.2, 950)] }, 'm²');
    expect([b.materials, b.labour, b.plant, b.transport, b.net, b.ohp, b.rate]).toEqual([787.5, 200, 60, 190, 1237.5, 123.75, 1361.25]);
    expect(b.lines[3].formula).toBe('0.2 t × 950 /t');
    expect(b.basis).toMatch(/plant 60 \+ transport 190 = net 1237\.5/);
  });
  it('hand-worked: per trip — 1 trip per 6 m³ of ready-mix, 4,500 per trip → 750.00 per m³', () => {
    const b = computeBuildUp({ ohpPct: 0, ohpSource: 'TEST: none', location: 'TEST', resources: [R('transport', 'trip', 1 / 6, 4500)] }, 'm³');
    expect([b.transport, b.net, b.rate]).toEqual([750, 750, 750]);
  });
  it('transport takes no waste, and an unpriced transport line leaves the rate as "rate required"', () => {
    expect(computeBuildUp({ ohpPct: 0, ohpSource: 'x', location: '', resources: [R('transport', 't', 1, 100, 5)] }, 'm³').errors.join(' ')).toMatch(/waste applies to materials only/);
    const u = computeBuildUp({ ohpPct: 0, ohpSource: 'x', location: '', resources: [R('material', 'No', 1, 10), R('transport', 't', 1, null)] }, 'm³');
    expect(u.rate).toBeNull();
    expect(u.missing.join(' ')).toMatch(/quotation required/);
    expect(RESOURCE_LABELS.transport).toBe('Transport');
  });
  it('a rates file may carry transport records', () => {
    const f = parseRatesFile(JSON.stringify({ format: 'building-suite-pro/rates', version: 2, dataset: 'TEST', licence: 'TEST', records: [{
      code: 'T1', kind: 'transport', description: 'TEST haulage', specification: 'TEST 7 t lorry', unit: 'trip', currency: 'KES', value: 4500,
      source: { title: 'TEST', url: 'https://example.test' }, publicationDate: '2026-11-01', retrievalDate: '2026-11-02', geography: 'TEST', vat: 'exclusive', delivery: 'TEST', basis: 'transport', confidence: 'low', status: 'indicative' }] }));
    expect(f.records[0].kind).toBe('transport');
  });
  it('the Excel build-up sheet has a Transport subtotal row that equals the engine', async () => {
    const buildUp = { ohpPct: 10, ohpSource: 'TEST policy', location: 'TEST', resources: [R('material', 'No', 12.5, 60, 5), R('labour', 'h', 0.8, 250), R('plant', 'h', 0.05, 1200), R('transport', 't', 0.2, 950)] };
    const adj = { preliminaries: { kind: 'percent' as const, pct: 0 }, contingencyPct: 0, overheadsProfitPct: 0, vat: { pct: 16, effectiveFrom: '2026-01-01' } };
    const boq = buildBoq([{ code: '1', section: 'TEST', trade: '', description: 'TEST blockwork', unit: 'm²', links: [], scheduledQuantity: { value: 10, source: 'TEST' }, rate: null, buildUp }], new Map(), adj, 'A');
    expect(boq.lines[0].amount).toBe(13612.5); // 10 m² × 1,361.25
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load((await boqToXlsx(boq, adj, 'TEST')) as unknown as ArrayBuffer);
    const ws = wb.getWorksheet('Rate build-ups')!;
    let found: unknown = null;
    ws.eachRow((row) => { if (row.getCell(3).value === 'Transport') found = (row.getCell(8).value as { result: number }).result; });
    expect(found).toBe(190);
  });
});
