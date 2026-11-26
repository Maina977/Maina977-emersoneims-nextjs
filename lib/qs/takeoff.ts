/**
 * Building Suite Pro measured take-off (P1-D, 2026-11-14).
 *
 * Measurements are made on a drawing sheet in sheet units (PDF points or
 * pixels) and converted with a scale the user calibrated on that sheet.
 * Nothing is estimated from text: every quantity comes from points measured
 * on a drawing, and every measurement records how it was made.
 */

export const TAKEOFF_ENGINE_VERSION = 'qs-takeoff 1.0.0 (2026-11-14)';

export interface Pt { x: number; y: number }

export interface Calibration {
  sheetId: string;
  /** Metres per sheet unit. */
  metresPerUnit: number;
  references: Array<{ a: Pt; b: Pt; knownM: number; metresPerUnit: number }>;
  mismatchPct: number;
  statedScale?: { ratio: number; unit: 'pt' | 'px'; dpi?: number; differencePct: number; warning?: string };
}

const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
const r = (x: number, d = 3) => Math.round(x * 10 ** d) / 10 ** d;

export class TakeoffError extends Error {}

/**
 * Calibrate a sheet from two known dimensions, ideally one horizontal and one
 * vertical. They must agree within 1 %, or the sheet is refused (a distorted
 * scan or a wrong dimension). Optional cross-check with the title-block scale.
 */
export function calibrate(sheetId: string, refs: Array<{ a: Pt; b: Pt; knownM: number }>, stated?: { ratio: number; unit: 'pt' | 'px'; dpi?: number }): Calibration {
  if (refs.length < 2) throw new TakeoffError('Two reference dimensions are needed (one in each direction) to calibrate a sheet');
  const references = refs.map((x) => {
    const d = dist(x.a, x.b);
    if (!(x.knownM > 0)) throw new TakeoffError('A reference dimension must be greater than 0 m');
    if (!(d > 0)) throw new TakeoffError('The two points of a reference dimension are the same point');
    return { ...x, metresPerUnit: x.knownM / d };
  });
  const v = references.map((x) => x.metresPerUnit);
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const mismatchPct = ((Math.max(...v) - Math.min(...v)) / mean) * 100;
  if (mismatchPct > 1) throw new TakeoffError(`The reference dimensions disagree by ${r(mismatchPct, 2)} % (limit 1 %): the sheet may be distorted or a dimension is wrong`);
  const cal: Calibration = { sheetId, metresPerUnit: mean, references, mismatchPct: r(mismatchPct, 3) };
  if (stated) {
    if (!(stated.ratio > 0)) throw new TakeoffError('Stated scale ratio must be positive (e.g. 100 for 1:100)');
    // A PDF point is 1/72 inch = 0.3527… mm on paper; a pixel is 1/dpi inch.
    const paperMPerUnit = stated.unit === 'pt' ? 0.0254 / 72 : stated.dpi ? 0.0254 / stated.dpi : NaN;
    if (!Number.isFinite(paperMPerUnit)) throw new TakeoffError('A pixel sheet needs its DPI to cross-check the stated scale');
    const expected = paperMPerUnit * stated.ratio;
    const differencePct = r((Math.abs(mean - expected) / expected) * 100, 2);
    cal.statedScale = { ...stated, differencePct, warning: differencePct > 2 ? `Calibration differs from the stated 1:${stated.ratio} by ${differencePct} %: the sheet may have been printed or scanned to a different size; the calibration is used` : undefined };
  }
  return cal;
}

export type MeasureKind = 'linear' | 'area' | 'count' | 'volume';
export interface Measurement {
  id: string;
  kind: MeasureKind;
  sheetId: string;
  label: string;
  points: Pt[];
  /** Area deductions (openings) as polygons. */
  holes?: Pt[][];
  /** Volume: depth or thickness, m. */
  depthM?: number;
  metresPerUnit: number;
  user: string;
  at: string;
  revision: string;
  /** How each point was placed: snapped to drawing geometry (exact) or a free click (resolution-limited). */
  snaps?: Array<'endpoint' | 'intersection' | 'on-line' | 'none'>;
}
export interface Quantity {
  id: string; kind: MeasureKind; unit: 'm' | 'm²' | 'm³' | 'No';
  gross: number; deductions: number; net: number;
  holes: Array<{ areaM2: number }>;
}

/** Shoelace area of a polygon in sheet units². */
export function polygonArea(p: Pt[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a.x * b.y - b.x * a.y; }
  return Math.abs(s) / 2;
}

function pointInPolygon(pt: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > pt.y) !== (b.y > pt.y) && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

export function quantify(m: Measurement): Quantity {
  if (!(m.metresPerUnit > 0)) throw new TakeoffError(`${m.label}: the sheet is not calibrated`);
  const k = m.metresPerUnit;
  switch (m.kind) {
    case 'count':
      if (m.points.length < 1) throw new TakeoffError(`${m.label}: no items counted`);
      return { id: m.id, kind: 'count', unit: 'No', gross: m.points.length, deductions: 0, net: m.points.length, holes: [] };
    case 'linear': {
      if (m.points.length < 2) throw new TakeoffError(`${m.label}: a length needs at least two points`);
      let s = 0;
      for (let i = 1; i < m.points.length; i++) s += dist(m.points[i - 1], m.points[i]);
      if (!(s > 0)) throw new TakeoffError(`${m.label}: zero length`);
      return { id: m.id, kind: 'linear', unit: 'm', gross: r(s * k), deductions: 0, net: r(s * k), holes: [] };
    }
    case 'area':
    case 'volume': {
      if (m.points.length < 3) throw new TakeoffError(`${m.label}: an area needs at least three points`);
      const gross = polygonArea(m.points) * k * k;
      if (!(gross > 0)) throw new TakeoffError(`${m.label}: zero area`);
      const holes = (m.holes ?? []).map((h, i) => {
        if (h.length < 3) throw new TakeoffError(`${m.label}: opening ${i + 1} needs at least three points`);
        if (!h.every((p) => pointInPolygon(p, m.points))) throw new TakeoffError(`${m.label}: opening ${i + 1} is not inside the measured area`);
        return { areaM2: polygonArea(h) * k * k };
      });
      const ded = holes.reduce((a, h) => a + h.areaM2, 0);
      if (!(ded < gross)) throw new TakeoffError(`${m.label}: the openings leave no area`);
      if (m.kind === 'area') return { id: m.id, kind: 'area', unit: 'm²', gross: r(gross), deductions: r(ded), net: r(gross - ded), holes: holes.map((h) => ({ areaM2: r(h.areaM2) })) };
      const d = m.depthM;
      if (!(d !== undefined && d > 0 && d <= 30)) throw new TakeoffError(`${m.label}: depth/thickness must be between 0 and 30 m (in metres: 0.15 = 150 mm)`);
      return { id: m.id, kind: 'volume', unit: 'm³', gross: r(gross * d), deductions: r(ded * d), net: r((gross - ded) * d), holes: holes.map((h) => ({ areaM2: r(h.areaM2) })) };
    }
  }
}

/**
 * The quantity under a contract measurement rule. Rules differ on small
 * voids, so the threshold is part of the rule the user selects, entered from
 * the rule document; the geometric net stays visible beside it.
 */
export interface MeasurementRule { name: string; edition: string; voidNotDeductedUpToM2: number }
export function ruleQuantity(q: Quantity, rule: MeasurementRule, depthM?: number): { geometricNet: number; ruleQuantity: number; voidsNotDeducted: number; rule: string } {
  if (q.kind !== 'area' && q.kind !== 'volume') return { geometricNet: q.net, ruleQuantity: q.net, voidsNotDeducted: 0, rule: `${rule.name} ${rule.edition}` };
  // Each void of this area or less (3 dp) is not deducted; the same convention as the trades (lib/qs/trades, masonry/plaster) since 2026-11-26.
  const small = q.holes.filter((h) => h.areaM2 <= rule.voidNotDeductedUpToM2);
  const addBack = small.reduce((a, h) => a + h.areaM2, 0) * (q.kind === 'volume' ? depthM ?? NaN : 1);
  if (!Number.isFinite(addBack)) throw new TakeoffError('Volume rule quantity needs the depth');
  return { geometricNet: q.net, ruleQuantity: r(q.net + addBack), voidsNotDeducted: small.length, rule: `${rule.name} ${rule.edition}` };
}
