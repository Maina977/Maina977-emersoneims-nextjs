/**
 * PDF drawing sheets for measured take-off (P1-D, 2026-11-14).
 *
 * Coordinates: every measured point is stored in PDF user space (points,
 * 1/72 inch on the printed sheet, origin bottom-left, page rotation removed).
 * Rendering resolution, zoom and the displayed rotation therefore never
 * change a stored measurement, and each point can be traced back to the
 * exact position on the original file (file SHA-256 + page number).
 *
 * Accuracy: rendering a page does not make it measurable. Vector sheets keep
 * the drawing's own geometry; scanned sheets are limited by the scan
 * resolution, which is measured here from the image placement on the page
 * and reported with every measurement as a resolution limit.
 */
import type { Pt } from './takeoff';

export const PDF_SHEET_VERSION = 'qs-pdfsheet 1.0.0 (2026-11-14)';

/** The parts of pdfjs-dist this module uses (passed in, so it runs in the browser and in tests). */
export interface PdfjsLike {
  OPS: Record<string, number>;
}
export interface PdfPageLike {
  pageNumber: number;
  rotate: number;
  view: number[]; // [x0, y0, x1, y1] in PDF points
  userUnit?: number;
  getOperatorList(): Promise<{ fnArray: number[]; argsArray: unknown[][] }>;
  getTextContent(): Promise<{ items: unknown[] }>;
  getViewport(o: { scale: number; rotation?: number }): ViewportLike;
}
export interface ViewportLike {
  width: number; height: number; rotation: number; scale: number;
  convertToPdfPoint(x: number, y: number): number[];
  convertToViewportPoint(x: number, y: number): number[];
}

export type SheetKind = 'vector' | 'raster' | 'mixed' | 'empty';
export interface SheetInfo {
  file: string;
  sha256: string;
  page: number;
  pageCount: number;
  /** Page size in PDF points after UserUnit, before rotation. */
  widthPt: number; heightPt: number;
  /** Page rotation stored in the file (degrees). */
  fileRotation: number;
  /** Printed sheet size in mm (for checking against the title block, e.g. A1 = 841 × 594). */
  widthMm: number; heightMm: number;
  kind: SheetKind;
  pathOps: number; images: number; textItems: number;
  /** Lowest effective resolution of the images that cover most of the page (dpi), or null. */
  rasterDpi: number | null;
  /** Size of one scan pixel on the printed sheet (mm), or null for vector sheets. */
  rasterPixelMm: number | null;
  notes: string[];
  version: string;
}

export async function sha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const d = await globalThis.crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

type M = [number, number, number, number, number, number];
const mul = (m: M, n: M): M => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
];

/** Classify a page and measure scan resolution from the image placement (current transformation matrix). */
export async function analysePage(pdfjs: PdfjsLike, page: PdfPageLike, file: { name: string; sha256: string; pageCount: number }): Promise<SheetInfo> {
  const { OPS } = pdfjs;
  const ops = await page.getOperatorList();
  const text = await page.getTextContent();
  const unit = page.userUnit ?? 1;
  const widthPt = (page.view[2] - page.view[0]) * unit;
  const heightPt = (page.view[3] - page.view[1]) * unit;
  const pageArea = widthPt * heightPt;
  let ctm: M = [1, 0, 0, 1, 0, 0];
  const stack: M[] = [];
  let pathOps = 0;
  const images: Array<{ px: number; py: number; wPt: number; hPt: number }> = [];
  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    const args = ops.argsArray[i] as unknown[];
    if (fn === OPS.save) stack.push(ctm);
    else if (fn === OPS.restore) ctm = stack.pop() ?? [1, 0, 0, 1, 0, 0];
    else if (fn === OPS.transform) ctm = mul(ctm, args as unknown as M);
    else if (fn === OPS.constructPath) pathOps++;
    else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) {
      // Image space is the unit square mapped by the CTM.
      let px: number, py: number;
      if (fn === OPS.paintImageXObject) { px = Number(args[1]); py = Number(args[2]); }
      else { const img = args[0] as { width?: number; height?: number }; px = Number(img?.width); py = Number(img?.height); }
      const wPt = Math.hypot(ctm[0], ctm[1]) * unit, hPt = Math.hypot(ctm[2], ctm[3]) * unit;
      if (px > 0 && py > 0 && wPt > 0 && hPt > 0) images.push({ px, py, wPt, hPt });
    }
  }
  // Images covering at least half the page are treated as the drawing itself (a scan).
  const covering = images.filter((im) => im.wPt * im.hPt >= 0.5 * pageArea);
  const dpis = covering.map((im) => Math.min(im.px / (im.wPt / 72), im.py / (im.hPt / 72)));
  const rasterDpi = dpis.length ? Math.round(Math.min(...dpis)) : null;
  const kind: SheetKind = covering.length && pathOps < 20 ? 'raster' : covering.length ? 'mixed' : pathOps > 0 ? 'vector' : 'empty';
  const notes: string[] = [];
  if (kind === 'raster') notes.push('Scanned sheet: measurements are limited by the scan resolution and by any stretch in the scan; calibrate in both directions.');
  if (kind === 'mixed') notes.push('Sheet combines a full-page image with vector content: check which layer carries the dimensions.');
  if (kind === 'empty') notes.push('No drawing content found on this page.');
  if (rasterDpi !== null && rasterDpi < 150) notes.push(`Low scan resolution (${rasterDpi} dpi): one pixel is ${(25.4 / rasterDpi).toFixed(2)} mm on the sheet.`);
  if (page.rotate % 360 !== 0) notes.push(`Page is stored rotated ${page.rotate}°: points are recorded in unrotated PDF coordinates.`);
  return {
    file: file.name, sha256: file.sha256, page: page.pageNumber, pageCount: file.pageCount,
    widthPt, heightPt, fileRotation: page.rotate,
    widthMm: Math.round((widthPt / 72) * 25.4), heightMm: Math.round((heightPt / 72) * 25.4),
    kind, pathOps, images: images.length, textItems: text.items.length,
    rasterDpi, rasterPixelMm: rasterDpi ? Math.round((25.4 / rasterDpi) * 1000) / 1000 : null,
    notes, version: PDF_SHEET_VERSION,
  };
}

/** Screen (viewport) position → PDF point; independent of zoom and displayed rotation. */
export function viewportToPdf(viewport: ViewportLike, x: number, y: number): Pt {
  const [px, py] = viewport.convertToPdfPoint(x, y);
  return { x: px, y: py };
}
export function pdfToViewport(viewport: ViewportLike, p: Pt): Pt {
  const [x, y] = viewport.convertToViewportPoint(p.x, p.y);
  return { x, y };
}

/**
 * Resolution limit of a length measured on a sheet, in metres on site:
 * a vector sheet is limited by the user's click precision (set by the zoom),
 * a scanned sheet by its pixel size, whichever is larger. Reported, not hidden.
 */
export function resolutionLimitM(sheet: SheetInfo, metresPerPt: number, displayPxPerPt: number): number {
  const clickPt = 1 / displayPxPerPt; // one screen pixel
  const scanPt = sheet.rasterDpi ? 72 / sheet.rasterDpi : 0;
  return Math.max(clickPt, scanPt) * metresPerPt;
}
