/**
 * BOQ Excel and PDF exports with trade items (P1 building QA, 2026-11-21).
 *
 * The workbook is loaded back with ExcelJS and its formulas are evaluated here,
 * independently of the stored results, to prove the sheet computes the same
 * totals as the app. Every rate below is a TEST value, not a price.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import ExcelJS from 'exceljs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { buildBoq, DRAFT_NOTICE, rateFromInput, type Adjustments, type Boq, type BoqItem, type Rate } from '@/lib/qs/boq';
import { boqToXlsx } from '@/lib/qs/export';
import { boqToPdf, pdfSafe } from '@/lib/qs/pdfReport';
import { calculateTrade, tradeBoqItems, type ParamForm } from '@/lib/qs/tradeForms';
import type { TradeLine } from '@/lib/qs/trades';
import type { Quantity } from '@/lib/qs/takeoff';

const f = (value: string, source = 'TEST drawing A-201'): ParamForm => ({ value, source });
const qty = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'area' ? 'm²' : kind === 'volume' ? 'm³' : kind === 'linear' ? 'm' : 'No', gross: net, deductions: 0, net, holes: [] });
const Q = new Map<string, Quantity>([['M1', qty('M1', 'linear', 20)], ['M2', qty('M2', 'area', 120)], ['M3', qty('M3', 'linear', 12)]]);
const TEST_RATE = (v: number): Rate => ({ value: v, currency: 'KES', source: 'TEST rate, not a price', date: '2026-01-01', location: 'TEST', kind: 'rate-library' });
const ADJ: Adjustments = { preliminaries: { kind: 'percent', pct: 10 }, contingencyPct: 5, overheadsProfitPct: 10, vat: { pct: 16, effectiveFrom: '2023-07-01' } };
const rule = f('0.5', 'TEST rule: voids < 0.5 m² not deducted');
const openings = [
  { mark: 'D1', type: 'door' as const, width: f('0.9'), height: f('2.1'), count: '2' },
  { mark: 'W1', type: 'window' as const, width: f('1.2'), height: f('1.2'), count: '3' },
];

const masonry = calculateTrade({
  trade: 'masonry', code: 'MW', description: 'External wall', wallLengthId: 'M1', height: f('3'), thickness: f('0.2'), minDeducted: rule, openings,
  block: { enabled: true, length: f('0.4'), height: f('0.2'), joint: f('0.01'), wastage: f('5', 'TEST spec clause') },
}, Q);
const plaster = calculateTrade({
  trade: 'plaster', code: 'PL', description: 'Wall plaster', wallLengthId: 'M1', height: f('3'), faces: '2', minDeducted: rule, openings, reveal: { enabled: true, depth: f('0.1') },
}, Q);
const strip = calculateTrade({
  trade: 'strip', code: 'SF', description: 'Strip footing', trenchLengthId: 'M3', width: f('0.6'), depth: f('1'), concrete: f('0.2'),
  wall: { enabled: true, thickness: f('0.2'), height: f('0.8') },
}, Q);
const TRADE_LINES: TradeLine[] = [...masonry, ...plaster, ...strip];
const tradeItems: BoqItem[] = [
  ...tradeBoqItems(masonry, 'Masonry walling', []),
  ...tradeBoqItems(plaster, 'Plaster / render', masonry.map((l) => l.code)),
  ...tradeBoqItems(strip, 'Strip foundation', [...masonry, ...plaster].map((l) => l.code)),
];
const measured: BoqItem = { code: 'X1', section: 'Floors', trade: '', description: 'Floor screed', unit: 'm²', links: [{ measurementId: 'M2', factor: 1 }], rate: TEST_RATE(500) };
const priceAll = (items: BoqItem[]) => items.map((it, i) => ({ ...it, rate: it.rate ?? TEST_RATE(100 + 10 * i) }));

async function load(boq: Boq) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load((await boqToXlsx(boq, ADJ, 'TEST project')) as unknown as Parameters<typeof wb.xlsx.load>[0]);
  const ws = wb.getWorksheet('BOQ')!;
  const rowOf = (code: string) => { let r: ExcelJS.Row | undefined; ws.eachRow((row) => { if (row.getCell(1).value === code) r = row; }); return r; };
  const rowLabelled = (re: RegExp) => { let r: ExcelJS.Row | undefined; ws.eachRow((row) => { if (!r && re.test(String(row.getCell(2).value ?? ''))) r = row; }); return r; };
  const allText = () => { const t: string[] = []; ws.eachRow((row) => row.eachCell((c) => t.push(String(typeof c.value === 'object' && c.value && 'formula' in c.value ? '' : c.value)))); return t.join('\n'); };
  // Independent formula evaluation (ROUND, SUM over a range, + - * /, cell references). SUM skips text, as Excel does.
  const val = (ref: string): number | null => {
    const c = ws.getCell(ref).value as unknown;
    if (typeof c === 'number') return c;
    if (c && typeof c === 'object' && 'formula' in c) return evalF((c as { formula: string }).formula);
    return null;
  };
  const evalF = (formula: string): number => {
    const sums = formula.replace(/SUM\(([A-H])(\d+):\1(\d+)\)/g, (_, col: string, a: string, z: string) => { let s = 0; for (let i = +a; i <= +z; i++) s += val(`${col}${i}`) ?? 0; return `(${s})`; });
    const refs = sums.replace(/\b([A-H]\d+)\b/g, (m) => { const v = val(m); if (v === null) throw new Error(`#VALUE! ${m} is not a number`); return `(${v})`; });
    if (!/^[\d.()+\-*/,\sR]*$/.test(refs.replace(/ROUND/g, 'R'))) throw new Error(`unexpected formula ${formula}`);
    return new Function('R', `return ${refs.replace(/ROUND\(/g, 'R(')}`)((x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d) as number;
  };
  const evalCell = (row: ExcelJS.Row | undefined) => { expect(row).toBeDefined(); return val(`F${row!.number}`); };
  return { ws, rowOf, rowLabelled, allText, evalCell };
}

// Loaded once, before the tests, with a long timeout: the first import is slow when the suite runs in parallel.
let pdfjs: typeof import('pdfjs-dist/legacy/build/pdf.mjs');
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
}, 60_000);
const pdfText = async (bytes: Uint8Array) => {
  const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  let t = '';
  for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + '\n';
  return t.replace(/\s+/g, ' ');
};

// No export may claim approval, certification or tender/issue status: nobody is authenticated as reviewer.
// The DRAFT notice itself ("Not checked or approved …") is the negation, so it is removed before scanning.
const CLAIM_RE = /\b(approved|certified by|certificate|for tender|tender issue|issued for|for issue|for construction|signed off)\b/i;
const CLAIM = { [Symbol.match]: (t: string) => t.split(DRAFT_NOTICE).join(' ').match(CLAIM_RE) } as unknown as RegExp;

describe('trade items in the BOQ', () => {
  it('the test set really includes every trade line, with its trace as the quantity source', () => {
    expect(TRADE_LINES.length).toBe(8); // masonry 3 + plaster 2 + strip 3
    const b = buildBoq(priceAll([...tradeItems, measured]), Q, ADJ, 'A');
    expect(b.errors).toEqual([]);
    for (const l of TRADE_LINES) {
      const line = b.lines.find((x) => x.code === l.code)!;
      expect(line.quantity).toBe(l.quantity);
      expect(line.quantitySource).toContain(l.formula);
    }
  });
});

describe('rate kind is the one the user chose', () => {
  const typed = { value: '450', source: 'TEST supplier quote Q-001', date: '2026-01-01', location: 'TEST' };
  const one = (kind: string) => buildBoq([{ ...measured, rate: rateFromInput({ ...typed, kind }) }], Q, ADJ, 'A');
  it('a supplier quote is labelled a supplier quote (not a rate library), in the engine and the export', async () => {
    const b = one('supplier-quote');
    expect(b.errors).toEqual([]);
    expect(b.lines[0].rateNote).toBe('Supplier quote: TEST supplier quote Q-001, 2026-01-01, TEST');
    const x = await load(b);
    expect(x.rowOf('X1')!.getCell(8).value).toBe('Supplier quote: TEST supplier quote Q-001, 2026-01-01, TEST');
  });
  it('rate library and other source keep their own labels', () => {
    expect(one('rate-library').lines[0].rateNote).toMatch(/^Rate library: /);
    expect(one('other').lines[0].rateNote).toMatch(/^Other source: /);
  });
  it('a rate with no kind chosen is refused, not defaulted', () => {
    const b = one('');
    expect(b.errors.join(' ')).toMatch(/X1: choose where the rate comes from/);
    expect(b.lines[0].rate).toBeNull();
    expect(b.grandTotal).toBeNull();
  });
  it('a blank rate stays "rate required"', () => {
    expect(rateFromInput({ ...typed, value: ' ', kind: 'supplier-quote' })).toBeNull();
  });
});

describe('Excel export with trade items: complete bill', () => {
  const boq = buildBoq(priceAll([...tradeItems, measured]), Q, ADJ, 'A');
  let x: Awaited<ReturnType<typeof load>>;
  beforeAll(async () => { x = await load(boq); });

  it('every trade line appears with code, description, quantity, unit and its calculation trace', () => {
    for (const l of TRADE_LINES) {
      const row = x.rowOf(l.code)!;
      expect(row, l.code).toBeDefined();
      expect(row.getCell(2).value).toBe(l.description);
      expect(row.getCell(3).value).toBe(l.unit);
      expect(row.getCell(4).value).toBe(l.quantity);
      const source = String(row.getCell(7).value);
      expect(source).toContain(l.formula);
      for (const input of l.inputs) expect(source).toContain(input);
    }
    expect(String(x.rowOf('X1')!.getCell(7).value)).toBe('M2'); // a measured item names its measurement
  });
  it('the formulas compute the same line amounts, subtotals and totals as the app', () => {
    for (const l of boq.lines) expect(x.evalCell(x.rowOf(l.code))).toBe(l.amount);
    for (const s of boq.sections) expect(x.evalCell(x.rowLabelled(new RegExp(`^Subtotal: ${s.section.replace(/[/]/g, '\\/')}$`)))).toBe(s.subtotal);
    expect(x.evalCell(x.rowLabelled(/^Measured works$/))).toBe(boq.measuredWorks);
    expect(x.evalCell(x.rowLabelled(/^Preliminaries/))).toBe(boq.preliminaries);
    expect(x.evalCell(x.rowLabelled(/^Contingency/))).toBe(boq.contingency);
    expect(x.evalCell(x.rowLabelled(/^Overheads/))).toBe(boq.overheadsProfit);
    expect(x.evalCell(x.rowLabelled(/^Subtotal before VAT$/))).toBe(boq.subtotalBeforeVat);
    expect(x.evalCell(x.rowLabelled(/^VAT /))).toBe(boq.vat);
    expect(x.evalCell(x.rowLabelled(/^TOTAL$/))).toBe(boq.grandTotal);
    expect(boq.grandTotal).toBeGreaterThan(0);
  });
  it('is marked DRAFT, not certified, and claims no approval', () => {
    const t = x.allText();
    expect(t).toContain(DRAFT_NOTICE);
    expect(t).not.toMatch(CLAIM);
  });
});

describe('Excel export with trade items: unpriced lines', () => {
  // Strip-foundation lines left without a rate; everything else priced with TEST rates.
  const unpricedCodes = strip.map((l) => l.code);
  const items = [...priceAll(tradeItems.filter((i) => !unpricedCodes.includes(i.code))), ...tradeItems.filter((i) => unpricedCodes.includes(i.code)), measured];
  const boq = buildBoq(items, Q, ADJ, 'A');
  let x: Awaited<ReturnType<typeof load>>;
  beforeAll(async () => { x = await load(boq); });

  it('unpriced lines show "rate required" and no rate or amount is invented', () => {
    expect(boq.unpricedItems).toEqual(unpricedCodes);
    for (const code of unpricedCodes) {
      const row = x.rowOf(code)!;
      expect(row.getCell(4).value).toBe(strip.find((l) => l.code === code)!.quantity); // the quantity is still there
      expect(row.getCell(5).value ?? null).toBeNull();
      expect(row.getCell(6).value).toBe('rate required');
      expect(row.getCell(8).value).toBe('rate required');
    }
  });
  it('totals exclude unpriced lines and are marked INCOMPLETE; no bill total', () => {
    const t = x.allText();
    expect(t).toMatch(/INCOMPLETE — 3 item\(s\) need a rate \(SF\.1, SF\.2, SF\.3\)/);
    expect(x.rowLabelled(/^TOTAL$/)).toBeUndefined();
    expect(x.rowLabelled(/^Measured works$/)).toBeUndefined();
    expect(x.rowLabelled(/^TOTAL: not available/)!.getCell(6).value ?? null).toBeNull();
    expect(x.evalCell(x.rowLabelled(/^Priced items only \(INCOMPLETE/))).toBe(boq.pricedSubtotal);
    expect(x.evalCell(x.rowLabelled(/^Subtotal: Strip foundation \(priced items only — INCOMPLETE, 3 unpriced\)$/))).toBe(0);
    expect(x.evalCell(x.rowLabelled(/^Subtotal: Masonry walling$/))).toBe(boq.sections.find((s) => s.section === 'Masonry walling')!.subtotal);
    const pricedSum = Math.round(boq.lines.reduce((a, l) => a + (l.amount ?? 0), 0) * 100) / 100;
    expect(boq.pricedSubtotal).toBe(pricedSum);
    expect(t).not.toMatch(CLAIM);
  });
  it('an export with errors lists them and stays INCOMPLETE', async () => {
    const bad = buildBoq([...priceAll(tradeItems), measured], Q, { ...ADJ, vat: { pct: 16, effectiveFrom: '' } }, 'A');
    const y = await load(bad);
    expect(y.allText()).toMatch(/Error: The VAT rate needs the date it applies from/);
    expect(y.rowLabelled(/^TOTAL$/)).toBeUndefined();
  });
});

describe('PDF export with trade items', { timeout: 30_000 }, () => {
  it('complete bill: a real PDF with every trade line, its trace, and the engine total', async () => {
    const boq = buildBoq(priceAll([...tradeItems, measured]), Q, ADJ, 'A');
    const bytes = boqToPdf(boq, { project: 'TEST project', preparedBy: 'TEST user', date: '2026-11-21' });
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-');
    expect(bytes.length).toBeGreaterThan(5000);
    const t = await pdfText(bytes);
    for (const l of TRADE_LINES) { expect(t).toContain(l.code); expect(t).toContain(pdfSafe(l.formula)); }
    expect(t).toContain(boq.grandTotal!.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    expect(t).toContain('DRAFT — not certified');
    expect(t).not.toMatch(CLAIM);
  });
  it('formula symbols the standard PDF font cannot draw are spelled out, not garbled', async () => {
    expect(pdfSafe('length × height − deducted openings; Σ (2 × h); ≥ 1; m² 45°')).toBe('length × height - deducted openings; sum (2 × h); >= 1; m² 45°');
    const boq = buildBoq(priceAll([...tradeItems, measured]), Q, ADJ, 'A');
    const t = await pdfText(boqToPdf(boq, { project: 'TEST', preparedBy: 'TEST', date: '2026-11-21' }));
    expect(t).toContain('length × height - deducted openings');
    expect(t).toContain('sum (2 × height + width)');
    expect(t).not.toMatch(/[£"]/); // what U+2212 and Σ turned into before the fix
  });
  it('unpriced lines print "rate required"; the summary has no total and says INCOMPLETE', async () => {
    const items = tradeItems.map((i, k) => (k < 3 ? { ...i, rate: TEST_RATE(200) } : i));
    const boq = buildBoq(items, Q, ADJ, 'A');
    const t = await pdfText(boqToPdf(boq, { project: 'TEST', preparedBy: 'TEST', date: '2026-11-21' }));
    expect(t).toMatch(/rate required/);
    expect(t).toMatch(/INCOMPLETE — 5 item\(s\) need a rate/);
    expect(t).toMatch(/Priced items only \(INCOMPLETE — not a bill total\)/);
    expect(t).toContain(boq.pricedSubtotal.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    expect(t).toMatch(/TOTAL: not available/);
    expect(t).not.toMatch(/Measured works/);
  });
  it('a typed "prepared by" name never certifies: the report still says DRAFT, not certified', async () => {
    const boq = buildBoq(priceAll([...tradeItems, measured]), Q, ADJ, 'A');
    const t = await pdfText(boqToPdf(boq, { project: 'TEST', preparedBy: 'TEST Registered QS', date: '2026-11-21' }));
    expect(t).toContain('DRAFT — not certified');
    expect(t).toMatch(/Not a professional certification until reviewed by a registered quantity surveyor/);
  });
});
