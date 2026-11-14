import { describe, it, expect, beforeAll } from 'vitest';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { deflateSync } from 'node:zlib';
import { jsPDF } from 'jspdf';
import { extractGeometry, SnapIndex, snap } from '@/lib/qs/snap';
import { analysePage, pdfToViewport, viewportToPdf, type PdfPageLike } from '@/lib/qs/pdfSheet';
import { calibrate, quantify, TakeoffError, type Measurement, type Pt } from '@/lib/qs/takeoff';
import { buildBoq, compareRevisions, type Adjustments, type BoqItem } from '@/lib/qs/boq';

// SYNTHETIC drawings with known true geometry (generated here). Real company
// drawings are collected per EVIDENCE-COLLECTION-CHECKLIST section D.
type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const MM = 72 / 25.4;
async function load(bytes: Uint8Array) {
  const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  const page = await doc.getPage(1);
  const ops = await page.getOperatorList();
  return { page, H: page.view[3] - page.view[1], idx: new SnapIndex(extractGeometry(pdfjs.OPS, ops).segments) };
}
const pdf = (draw: (d: jsPDF) => void, fmt = 'a3') => { const d = new jsPDF({ unit: 'mm', format: fmt, orientation: 'landscape' }); draw(d); return new Uint8Array(d.output('arraybuffer')); };
// Snap a point given in paper mm (from the top-left), clicked 1 mm off.
const at = (H: number, idx: SnapIndex, x: number, y: number): Pt => snap({ x: (x + 0.8) * MM, y: H - (y - 0.6) * MM }, idx, 2.5 * MM).point;
const area = (pts: Pt[], mpu: number, holes?: Pt[][]) => quantify({ id: 'M', kind: 'area', sheetId: 's', label: 'x', points: pts, holes, metresPerUnit: mpu, user: 't', at: '2026-11-14', revision: 'A' } as Measurement).net;

describe('unusual scales', () => {
  it('1:20 detail: a 1.2 m × 0.8 m pad drawn 60 × 40 mm measures exactly 0.96 m²; stated 1:20 agrees', async () => {
    const { H, idx } = await load(pdf((d) => d.rect(40, 40, 60, 40)));
    const c = [at(H, idx, 40, 40), at(H, idx, 100, 40), at(H, idx, 100, 80), at(H, idx, 40, 80)];
    const cal = calibrate('s', [{ a: c[0], b: c[1], knownM: 1.2 }, { a: c[1], b: c[2], knownM: 0.8 }], { ratio: 20, unit: 'pt' });
    expect(cal.statedScale!.differencePct).toBeLessThan(0.01);
    expect(area(c, cal.metresPerUnit)).toBe(0.96);
  });
  it('1:500 site plan: a 60 m × 40 m plot drawn 120 × 80 mm measures exactly 2400 m²', async () => {
    const { H, idx } = await load(pdf((d) => d.rect(30, 30, 120, 80)));
    const c = [at(H, idx, 30, 30), at(H, idx, 150, 30), at(H, idx, 150, 110), at(H, idx, 30, 110)];
    const cal = calibrate('s', [{ a: c[0], b: c[1], knownM: 60 }, { a: c[1], b: c[2], knownM: 40 }], { ratio: 500, unit: 'pt' });
    expect(area(c, cal.metresPerUnit)).toBe(2400);
  });
  it('a sheet printed at the wrong scale (dimension says 12 m, title block says 1:50) is flagged', async () => {
    const { H, idx } = await load(pdf((d) => d.rect(50, 50, 120, 80))); // drawn at 1:100
    const c = [at(H, idx, 50, 50), at(H, idx, 170, 50), at(H, idx, 170, 130)];
    const cal = calibrate('s', [{ a: c[0], b: c[1], knownM: 12 }, { a: c[1], b: c[2], knownM: 8 }], { ratio: 50, unit: 'pt' });
    expect(cal.statedScale!.warning).toMatch(/differs from the stated 1:50 by 100/);
  });
});

describe('rotated pages', () => {
  it('a page stored with /Rotate 90: measured through the rotated view, the slab is still exactly 96 m²', async () => {
    const raw = Buffer.from(pdf((d) => d.rect(50, 50, 120, 80))).toString('latin1').replace('/Type /Page\n', '/Type /Page\n/Rotate 90\n');
    const { page, H, idx } = await load(new Uint8Array(Buffer.from(raw, 'latin1')));
    const vp = page.getViewport({ scale: 1.7, rotation: page.rotate });
    // Clicks happen on the rotated screen; points go back to PDF space and are snapped there.
    const screen = [[50, 50], [170, 50], [170, 130], [50, 130]].map(([x, y]) => pdfToViewport(vp, { x: (x + 0.8) * MM, y: H - (y - 0.6) * MM }));
    const pts = screen.map((s) => snap(viewportToPdf(vp, s.x, s.y), idx, 2.5 * MM).point);
    const cal = calibrate('s', [{ a: pts[0], b: pts[1], knownM: 12 }, { a: pts[1], b: pts[2], knownM: 8 }]);
    expect(area(pts, cal.metresPerUnit)).toBe(96);
  });
});

describe('small details', () => {
  it('a 100 × 100 mm service hole at 1:100 (1 mm on paper) is deducted exactly when snapped', async () => {
    const { H, idx } = await load(pdf((d) => { d.rect(50, 50, 120, 80); d.rect(100, 90, 1, 1); }));
    const c = [at(H, idx, 50, 50), at(H, idx, 170, 50), at(H, idx, 170, 130), at(H, idx, 50, 130)];
    const cal = calibrate('s', [{ a: c[0], b: c[1], knownM: 12 }, { a: c[1], b: c[2], knownM: 8 }]);
    // Click precisely on the tiny hole's corners (a 1 mm feature needs zoom; snapping radius kept small).
    const s = (x: number, y: number) => snap({ x: (x + 0.05) * MM, y: H - (y - 0.05) * MM }, idx, 0.3 * MM).point;
    const hole = [s(100, 90), s(101, 90), s(101, 91), s(100, 91)];
    expect(area(c, cal.metresPerUnit, [hole])).toBeCloseTo(96 - 0.01, 6);
  });
});

describe('scanned sheets', () => {
  // Minimal greyscale PNG.
  const png = (w: number, h: number) => {
    const crc = (b: Buffer) => { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return ~c >>> 0; };
    const chunk = (t: string, d: Buffer) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
    const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8;
    const raw = Buffer.alloc((w + 1) * h, 255); for (let y = 0; y < h; y++) raw[y * (w + 1)] = 0;
    return new Uint8Array(Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
  };
  it('a scan has no vector geometry to snap to, and its resolution limit is reported', async () => {
    const d = new jsPDF({ unit: 'mm', format: 'a4' });
    d.addImage(png(827, 1170), 'PNG', 0, 0, 210, 297); // 100 dpi scan
    const bytes = new Uint8Array(d.output('arraybuffer'));
    const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
    const page = await doc.getPage(1);
    const info = await analysePage(pdfjs, page as unknown as PdfPageLike, { name: 'scan.pdf', sha256: 'x', pageCount: 1 });
    expect(info.kind).toBe('raster');
    expect(info.rasterDpi).toBe(100);
    expect(info.notes.join(' ')).toMatch(/Low scan resolution \(100 dpi\)/);
    expect(extractGeometry(pdfjs.OPS, await page.getOperatorList()).segments).toHaveLength(0);
  });
});

describe('missing dimensions', () => {
  it('a sheet with only one known dimension cannot be calibrated: measurement stays blocked', () => {
    expect(() => calibrate('s', [{ a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, knownM: 5 }])).toThrow(/Two reference dimensions/);
  });
  it('an uncalibrated measurement is refused', () => {
    expect(() => quantify({ id: 'M', kind: 'linear', sheetId: 's', label: 'x', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }], metresPerUnit: 0, user: 't', at: 'x', revision: 'A' })).toThrow(TakeoffError);
  });
});

describe('drawing revisions', () => {
  it('rev A slab 12 × 8 m → rev B 12 × 9 m: re-measured quantities give the variation', async () => {
    const meas = async (h: number) => {
      const { H, idx } = await load(pdf((d) => d.rect(50, 50, 120, h)));
      const c = [at(H, idx, 50, 50), at(H, idx, 170, 50), at(H, idx, 170, 50 + h), at(H, idx, 50, 50 + h)];
      const cal = calibrate('s', [{ a: c[0], b: c[1], knownM: 12 }, { a: c[1], b: c[2], knownM: h / 10 }]);
      return quantify({ id: 'M1', kind: 'volume', sheetId: 's', label: 'slab', points: c, depthM: 0.15, metresPerUnit: cal.metresPerUnit, user: 't', at: 'x', revision: h === 80 ? 'A' : 'B' });
    };
    const adj: Adjustments = { preliminaries: { kind: 'percent', pct: 0 }, contingencyPct: 0, overheadsProfitPct: 0, vat: { pct: 16, effectiveFrom: '2023-07-01' } };
    const item: BoqItem = { code: 'C1', section: 'Concrete', trade: '', description: 'Slab', unit: 'm³', links: [{ measurementId: 'M1', factor: 1 }], rate: { value: 18000, currency: 'KES', source: 'test', date: '2026-10-01', location: 'Nairobi', kind: 'rate-library' } };
    const a = buildBoq([item], new Map([['M1', await meas(80)]]), adj, 'A');
    const b = buildBoq([item], new Map([['M1', await meas(90)]]), adj, 'B');
    expect(a.lines[0].quantity).toBe(14.4);
    expect(b.lines[0].quantity).toBe(16.2);
    const v = compareRevisions(a, b);
    expect(v.rows[0]).toMatchObject({ status: 'changed', quantityFrom: 14.4, quantityTo: 16.2, amountChange: 32400 });
  });
});
