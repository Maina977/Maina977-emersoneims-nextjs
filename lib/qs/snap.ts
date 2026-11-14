/**
 * Snapping to drawing geometry for measured take-off (P1-D, 2026-11-14).
 *
 * Vector PDF sheets carry the drawing's own lines. They are extracted from the
 * pdf.js operator list (paths, with the current transformation matrix applied)
 * into PDF user-space segments, indexed on a grid, and a click is snapped to
 * the nearest endpoint, intersection or line within a screen-pixel tolerance.
 * A snapped point is exact to the drawing; the snap kind is recorded with the
 * measurement so the precision of every point is traceable.
 */
import type { Pt } from './takeoff';

export type SnapKind = 'endpoint' | 'intersection' | 'on-line' | 'none';
export interface Segment { a: Pt; b: Pt }
export interface Geometry { segments: Segment[]; truncated: boolean; curvesApproximated: number }
export interface SnapResult { point: Pt; kind: SnapKind; distance: number }

type M = [number, number, number, number, number, number];
const mul = (m: M, n: M): M => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
];
const apply = (m: M, x: number, y: number): Pt => ({ x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] });

/** pdf.js path drawing codes inside constructPath data (v5+). */
const MOVE = 0, LINE = 1, CURVE = 2, QUAD = 3, CLOSE = 4;
const MAX_SEGMENTS = 250_000;
const CURVE_STEPS = 8;

export function extractGeometry(
  OPS: Record<string, number>,
  ops: { fnArray: number[]; argsArray: unknown[][] },
  userUnit = 1,
): Geometry {
  const segments: Segment[] = [];
  let ctm: M = [userUnit, 0, 0, userUnit, 0, 0];
  const stack: M[] = [];
  let truncated = false, curves = 0;
  const push = (a: Pt, b: Pt) => {
    if (segments.length >= MAX_SEGMENTS) { truncated = true; return; }
    if (Math.hypot(b.x - a.x, b.y - a.y) > 1e-6) segments.push({ a, b });
  };
  for (let i = 0; i < ops.fnArray.length && !truncated; i++) {
    const fn = ops.fnArray[i];
    const args = ops.argsArray[i] as unknown[];
    if (fn === OPS.save) stack.push(ctm);
    else if (fn === OPS.restore) ctm = stack.pop() ?? ctm;
    else if (fn === OPS.transform) ctm = mul(ctm, args as unknown as M);
    else if (fn === OPS.constructPath) {
      const groups = args[1] as ArrayLike<ArrayLike<number> | null> | undefined;
      if (!groups) continue;
      for (let g = 0; g < groups.length; g++) {
        const d = groups[g];
        if (!d) continue;
        // cur: current point on the page; u0: the same point in path (user) space.
        let cur: Pt | null = null, start: Pt | null = null, u0: Pt = { x: 0, y: 0 }, uStart: Pt = u0;
        for (let k = 0; k < d.length;) {
          const op = d[k++];
          if (op === MOVE) { u0 = { x: d[k], y: d[k + 1] }; uStart = u0; cur = apply(ctm, u0.x, u0.y); start = cur; k += 2; }
          else if (op === LINE) { u0 = { x: d[k], y: d[k + 1] }; const p = apply(ctm, u0.x, u0.y); if (cur) push(cur, p); cur = p; k += 2; }
          else if (op === CURVE || op === QUAD) {
            const n = op === CURVE ? 6 : 4;
            const c = Array.from({ length: n }, (_, j) => d[k + j]); k += n;
            if (!cur) continue;
            // Approximate the Bezier by chords in path space, then transform each point.
            let prev: Pt = cur;
            for (let s = 1; s <= CURVE_STEPS; s++) {
              const t = s / CURVE_STEPS, mt = 1 - t;
              let x: number, y: number;
              if (op === CURVE) { x = mt ** 3 * u0.x + 3 * mt * mt * t * c[0] + 3 * mt * t * t * c[2] + t ** 3 * c[4]; y = mt ** 3 * u0.y + 3 * mt * mt * t * c[1] + 3 * mt * t * t * c[3] + t ** 3 * c[5]; }
              else { x = mt * mt * u0.x + 2 * mt * t * c[0] + t * t * c[2]; y = mt * mt * u0.y + 2 * mt * t * c[1] + t * t * c[3]; }
              const p = apply(ctm, x, y);
              push(prev, p); prev = p;
            }
            u0 = { x: c[n - 2], y: c[n - 1] };
            cur = prev; curves++;
          } else if (op === CLOSE) { if (cur && start) push(cur, start); cur = start; u0 = uStart; }
          else break; // unknown code: stop reading this path rather than misread it
        }
      }
    }
  }
  return { segments, truncated, curvesApproximated: curves };
}

/** Uniform grid index over segments for nearest-geometry queries. */
export class SnapIndex {
  private cells = new Map<string, number[]>();
  constructor(public segments: Segment[], private cell = 20) {
    segments.forEach((s, i) => {
      const x0 = Math.floor(Math.min(s.a.x, s.b.x) / cell), x1 = Math.floor(Math.max(s.a.x, s.b.x) / cell);
      const y0 = Math.floor(Math.min(s.a.y, s.b.y) / cell), y1 = Math.floor(Math.max(s.a.y, s.b.y) / cell);
      // Long segments: register in every cell of their bounding box, capped to keep memory bounded.
      if ((x1 - x0 + 1) * (y1 - y0 + 1) > 4000) return this.add('big', i);
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) this.add(`${x}:${y}`, i);
    });
  }
  private add(k: string, i: number) { const a = this.cells.get(k); if (a) a.push(i); else this.cells.set(k, [i]); }
  near(p: Pt, r: number): Segment[] {
    const out = new Set<number>(this.cells.get('big') ?? []);
    for (let x = Math.floor((p.x - r) / this.cell); x <= Math.floor((p.x + r) / this.cell); x++)
      for (let y = Math.floor((p.y - r) / this.cell); y <= Math.floor((p.y + r) / this.cell); y++)
        for (const i of this.cells.get(`${x}:${y}`) ?? []) out.add(i);
    return [...out].map((i) => this.segments[i]);
  }
}

const d2 = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
function project(p: Pt, s: Segment): Pt {
  const vx = s.b.x - s.a.x, vy = s.b.y - s.a.y;
  const t = Math.max(0, Math.min(1, ((p.x - s.a.x) * vx + (p.y - s.a.y) * vy) / (vx * vx + vy * vy)));
  return { x: s.a.x + t * vx, y: s.a.y + t * vy };
}
function intersect(s: Segment, u: Segment): Pt | null {
  const r = { x: s.b.x - s.a.x, y: s.b.y - s.a.y }, q = { x: u.b.x - u.a.x, y: u.b.y - u.a.y };
  const den = r.x * q.y - r.y * q.x;
  if (Math.abs(den) < 1e-9) return null; // parallel
  const t = ((u.a.x - s.a.x) * q.y - (u.a.y - s.a.y) * q.x) / den;
  const w = ((u.a.x - s.a.x) * r.y - (u.a.y - s.a.y) * r.x) / den;
  if (t < -1e-9 || t > 1 + 1e-9 || w < -1e-9 || w > 1 + 1e-9) return null;
  return { x: s.a.x + t * r.x, y: s.a.y + t * r.y };
}

/** Snap a point (PDF units) to geometry within `tol` (PDF units). Priority: endpoint, intersection, on-line. */
export function snap(p: Pt, index: SnapIndex, tol: number): SnapResult {
  const cand = index.near(p, tol);
  let best: SnapResult = { point: p, kind: 'none', distance: Infinity };
  for (const s of cand) for (const e of [s.a, s.b]) { const d = d2(p, e); if (d <= tol && d < best.distance) best = { point: e, kind: 'endpoint', distance: d }; }
  if (best.kind === 'endpoint') return best;
  const close = cand.filter((s) => d2(p, project(p, s)) <= tol);
  for (let i = 0; i < close.length; i++) for (let j = i + 1; j < close.length; j++) {
    const x = intersect(close[i], close[j]);
    if (x) { const d = d2(p, x); if (d <= tol && d < best.distance) best = { point: x, kind: 'intersection', distance: d }; }
  }
  if (best.kind === 'intersection') return best;
  for (const s of close) { const q = project(p, s); const d = d2(p, q); if (d < best.distance) best = { point: q, kind: 'on-line', distance: d }; }
  return best.kind === 'none' ? { point: p, kind: 'none', distance: 0 } : best;
}
