import { describe, it, expect, beforeAll } from 'vitest';
import { deflateSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import { analysePage, sha256Hex, viewportToPdf, pdfToViewport, resolutionLimitM, type PdfPageLike } from '@/lib/qs/pdfSheet';
import { calibrate, quantify, type Measurement } from '@/lib/qs/takeoff';

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const open = async (bytes: Uint8Array) => pdfjs.getDocument({ data: bytes.slice(), useSystemFonts: false }).promise;
const MM = 72 / 25.4; // points per mm

/** A3 landscape vector sheet at 1:100 with a 12 m × 8 m slab outline (120 × 80 mm) at (50, 50) mm. */
function vectorSheet(pages = 1): Uint8Array {
  const doc = new jsPDF({ unit: 'mm', format: 'a3', orientation: 'landscape' });
  for (let p = 0; p < pages; p++) {
    if (p) doc.addPage('a3', 'landscape');
    doc.rect(50, 50, 120, 80);
    doc.line(50, 140, 170, 140); // dimension line 12 m
    doc.text(`SLAB PLAN 1:100 sheet ${p + 1}`, 50, 40);
  }
  return new Uint8Array(doc.output('arraybuffer'));
}

/** Minimal greyscale PNG (white), for a scanned-sheet test. */
function png(w: number, h: number): Uint8Array {
  const crc = (b: Buffer) => { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return ~c >>> 0; };
  const chunk = (t: string, d: Buffer) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 0;
  const raw = Buffer.alloc((w + 1) * h, 255); for (let y = 0; y < h; y++) raw[y * (w + 1)] = 0;
  return new Uint8Array(Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}
/** A4 portrait "scan": one image filling the page, 1240 × 1754 px = 150 dpi. */
function scannedSheet(): Uint8Array {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.addImage(png(1240, 1754), 'PNG', 0, 0, 210, 297);
  return new Uint8Array(doc.output('arraybuffer'));
}
/** Same vector sheet stored with /Rotate 90 (pdfjs rebuilds the cross-reference table). */
function rotatedSheet(): Uint8Array {
  const s = Buffer.from(vectorSheet()).toString('latin1').replace('/Type /Page\n', '/Type /Page\n/Rotate 90\n');
  return new Uint8Array(Buffer.from(s, 'latin1'));
}

const info = async (bytes: Uint8Array, n = 1) => {
  const doc = await open(bytes);
  const page = await doc.getPage(n);
  return { doc, page, sheet: await analysePage(pdfjs, page as unknown as PdfPageLike, { name: 'test.pdf', sha256: await sha256Hex(bytes), pageCount: doc.numPages }) };
};

describe('sheet analysis', () => {
  it('vector A3 sheet: size 420 × 297 mm, classified vector, no raster limit', async () => {
    const { sheet } = await info(vectorSheet());
    expect([sheet.widthMm, sheet.heightMm]).toEqual([420, 297]);
    expect(sheet.kind).toBe('vector');
    expect(sheet.rasterDpi).toBeNull();
    expect(sheet.textItems).toBeGreaterThan(0);
  });
  it('scanned A4 sheet: classified raster, 150 dpi measured from the image placement, pixel 0.169 mm', async () => {
    const { sheet } = await info(scannedSheet());
    expect(sheet.kind).toBe('raster');
    expect(sheet.rasterDpi).toBe(150);
    expect(sheet.rasterPixelMm).toBeCloseTo(0.169, 3);
  });
  it('multi-page: every page analysed, page numbers and page count recorded', async () => {
    const bytes = vectorSheet(3);
    const doc = await open(bytes);
    expect(doc.numPages).toBe(3);
    const s3 = await analysePage(pdfjs, (await doc.getPage(3)) as unknown as PdfPageLike, { name: 'x.pdf', sha256: await sha256Hex(bytes), pageCount: doc.numPages });
    expect(s3.page).toBe(3); expect(s3.pageCount).toBe(3); expect(s3.kind).toBe('vector');
  });
  it('file identity: SHA-256 changes when one byte changes', async () => {
    const a = vectorSheet(); const b = a.slice(); b[b.length - 10] ^= 1;
    expect(await sha256Hex(a)).not.toBe(await sha256Hex(b));
    expect(await sha256Hex(a)).toMatch(/^[0-9a-f]{64}$/);
  });
  it('stored rotation is reported', async () => {
    const { sheet } = await info(rotatedSheet());
    expect(sheet.fileRotation).toBe(90);
    expect(sheet.notes.join(' ')).toMatch(/rotated 90/);
  });
});

describe('coordinates are independent of zoom and rotation', () => {
  it('a PDF point maps back to itself through any viewport', async () => {
    const { page } = await info(vectorSheet());
    const P = { x: 50 * MM, y: 200 * MM };
    for (const [scale, rotation] of [[1, 0], [2.5, 0], [1.5, 90], [3, 180], [0.75, 270]]) {
      const vp = page.getViewport({ scale, rotation });
      const back = viewportToPdf(vp, ...(Object.values(pdfToViewport(vp, P)) as [number, number]));
      expect(back.x).toBeCloseTo(P.x, 6); expect(back.y).toBeCloseTo(P.y, 6);
    }
  });
  it('12 m × 8 m slab measured through a rotated, zoomed viewport = 96.000 m² at 1:100', async () => {
    const { page } = await info(vectorSheet());
    const vp = page.getViewport({ scale: 2.2, rotation: 90 });
    // The slab corners in PDF space (jsPDF y is from the top; PDF y from the bottom).
    const H = 297 * MM;
    const cornersPdf = [[50, 50], [170, 50], [170, 130], [50, 130]].map(([x, y]) => ({ x: x * MM, y: H - y * MM }));
    // Simulate the user's clicks on screen, then convert back as the workbench does.
    const clicks = cornersPdf.map((p) => pdfToViewport(vp, p));
    const pts = clicks.map((c) => viewportToPdf(vp, c.x, c.y));
    const cal = calibrate('test.pdf#1', [{ a: pts[0], b: pts[1], knownM: 12 }, { a: pts[1], b: pts[2], knownM: 8 }], { ratio: 100, unit: 'pt' });
    expect(cal.statedScale!.differencePct).toBeLessThan(0.01);
    const m: Measurement = { id: 'M1', kind: 'area', sheetId: 'test.pdf#1', label: 'slab', points: pts, metresPerUnit: cal.metresPerUnit, user: 't', at: '2026-11-14', revision: 'A' };
    expect(quantify(m).net).toBeCloseTo(96, 3);
    expect(quantify({ ...m, kind: 'volume', depthM: 0.15 }).net).toBeCloseTo(14.4, 3);
  });
});

describe('resolution limit is reported, not hidden', () => {
  it('scanned 150 dpi sheet at 1:100: one scan pixel ≈ 16.9 mm on site', async () => {
    const { sheet } = await info(scannedSheet());
    const mPerPt = (0.0254 / 72) * 100;
    expect(resolutionLimitM(sheet, mPerPt, 4)).toBeCloseTo((72 / 150) * mPerPt, 6);
    expect(resolutionLimitM(sheet, mPerPt, 4) * 1000).toBeCloseTo(16.93, 1);
  });
  it('vector sheet: limited by the zoom (1 screen pixel)', async () => {
    const { sheet } = await info(vectorSheet());
    const mPerPt = (0.0254 / 72) * 100;
    expect(resolutionLimitM(sheet, mPerPt, 2)).toBeCloseTo(0.5 * mPerPt, 9);
  });
});
