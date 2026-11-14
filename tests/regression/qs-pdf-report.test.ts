import { describe, it, expect, beforeAll } from 'vitest';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { buildBoq, type BoqItem, type Adjustments, type Rate } from '@/lib/qs/boq';
import { boqToPdf } from '@/lib/qs/pdfReport';
import type { Quantity } from '@/lib/qs/takeoff';

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const textOf = async (bytes: Uint8Array) => {
  const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  let t = '';
  for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + '\n';
  return t;
};
const q = (id: string, kind: Quantity['kind'], net: number): Quantity => ({ id, kind, unit: kind === 'area' ? 'm²' : kind === 'volume' ? 'm³' : kind === 'linear' ? 'm' : 'No', gross: net, deductions: 0, net, holes: [] });
const RATE = (v: number): Rate => ({ value: v, currency: 'KES', source: 'Test rate list', date: '2026-10-01', location: 'Nairobi', kind: 'rate-library' });
const ADJ: Adjustments = { preliminaries: { kind: 'percent', pct: 10 }, contingencyPct: 5, overheadsProfitPct: 10, vat: { pct: 16, effectiveFrom: '2023-07-01' } };
const Q = new Map([['M1', q('M1', 'volume', 14.4)], ['M2', q('M2', 'area', 30)]]);
const ITEMS: BoqItem[] = [
  { code: 'C1', section: 'Concrete', trade: '', description: 'Slab C25/30', unit: 'm³', links: [{ measurementId: 'M1', factor: 1 }], rate: RATE(18000) },
  { code: 'W1', section: 'Masonry', trade: '', description: 'Wall plaster both faces', unit: 'm²', links: [{ measurementId: 'M2', factor: 2 }], rate: RATE(850) },
];

describe('PDF BOQ report', () => {
  it('prints exactly the engine figures: every line, subtotal and the total', async () => {
    const boq = buildBoq(ITEMS, Q, ADJ, 'B');
    const t = await textOf(boqToPdf(boq, { project: 'Test house', preparedBy: 'QS test', date: '2026-11-14', drawings: ['A-101 rev B (sha 1234abcd)'] }));
    for (const v of [boq.lines[0].amount, boq.lines[1].amount, boq.measuredWorks, boq.vat, boq.grandTotal]) {
      expect(t).toContain(v!.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
    expect(t).toMatch(/Revision B/);
    expect(t).toMatch(/A-101 rev B/);
    expect(t).toMatch(/Test rate list, 2026-10-01/);
    expect(t).toMatch(/VAT = 16 %/);
    expect(t).toMatch(/registered quantity surveyor/);
  });
  it('an incomplete bill is refused', () => {
    const boq = buildBoq(ITEMS.map((i) => ({ ...i, rate: null })), Q, ADJ, 'B');
    expect(() => boqToPdf(boq, { project: 'x', preparedBy: 'x', date: '2026-11-14' })).toThrow(/incomplete/);
  });
});
