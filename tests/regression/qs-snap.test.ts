import { describe, it, expect, beforeAll } from 'vitest';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { jsPDF } from 'jspdf';
import { extractGeometry, SnapIndex, snap, type Segment } from '@/lib/qs/snap';
import { calibrate, quantify, type Measurement } from '@/lib/qs/takeoff';

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const MM = 72 / 25.4;
const geometryOf = async (draw: (d: jsPDF) => void, format: string | number[] = 'a3') => {
  const d = new jsPDF({ unit: 'mm', format, orientation: 'landscape' });
  draw(d);
  const doc = await pdfjs.getDocument({ data: new Uint8Array(d.output('arraybuffer')) }).promise;
  const page = await doc.getPage(1);
  const H = page.view[3] - page.view[1];
  return { g: extractGeometry(pdfjs.OPS, await page.getOperatorList()), H };
};
const near = (a: { x: number; y: number }, b: { x: number; y: number }, eps = 1e-3) => Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps;

describe('vector geometry extraction', () => {
  it('a rectangle gives 4 segments with exact corner coordinates (PDF points)', async () => {
    const { g, H } = await geometryOf((d) => d.rect(50, 50, 120, 80));
    expect(g.segments.length).toBe(4);
    const corners = [[50, 50], [170, 50], [170, 130], [50, 130]].map(([x, y]) => ({ x: x * MM, y: H - y * MM }));
    for (const c of corners) expect(g.segments.some((s) => near(s.a, c, 0.01) || near(s.b, c, 0.01))).toBe(true);
  });
  it('a line and a circle: the circle is approximated by chords and counted', async () => {
    const { g } = await geometryOf((d) => { d.line(10, 10, 60, 10); d.circle(100, 100, 5); });
    expect(g.curvesApproximated).toBe(4);
    expect(g.segments.length).toBe(1 + 4 * 8);
  });
  it('a transformed path (scale 2, offset) is mapped into page space', () => {
    const OPS = pdfjs.OPS;
    const ops = { fnArray: [OPS.save, OPS.transform, OPS.constructPath, OPS.restore, OPS.constructPath],
      argsArray: [[], [2, 0, 0, 2, 100, 50], [20, [new Float32Array([0, 0, 0, 1, 10, 0])], null], [], [20, [new Float32Array([0, 0, 0, 1, 10, 0])], null]] };
    const g = extractGeometry(OPS, ops as never);
    expect(near(g.segments[0].a, { x: 100, y: 50 })).toBe(true);
    expect(near(g.segments[0].b, { x: 120, y: 50 })).toBe(true);
    // After restore, the identity transform applies again.
    expect(near(g.segments[1].b, { x: 10, y: 0 })).toBe(true);
  });
  it('an unknown path code stops reading that path instead of misreading it', () => {
    const OPS = pdfjs.OPS;
    const g = extractGeometry(OPS, { fnArray: [OPS.constructPath], argsArray: [[20, [new Float32Array([0, 0, 0, 1, 10, 0, 9, 5, 5])], null]] } as never);
    expect(g.segments.length).toBe(1);
  });
});

describe('snapping', () => {
  const segs: Segment[] = [
    { a: { x: 0, y: 0 }, b: { x: 100, y: 0 } },
    { a: { x: 100, y: 0 }, b: { x: 100, y: 50 } },
    { a: { x: 50, y: -20 }, b: { x: 50, y: 20 } }, // crosses the first line at (50, 0)
  ];
  const idx = new SnapIndex(segs);
  it('endpoint first', () => expect(snap({ x: 98.5, y: 1.2 }, idx, 3)).toMatchObject({ kind: 'endpoint', point: { x: 100, y: 0 } }));
  it('intersection next', () => {
    const r = snap({ x: 51, y: 1 }, idx, 3);
    expect(r.kind).toBe('intersection');
    expect(near(r.point, { x: 50, y: 0 })).toBe(true);
  });
  it('then the nearest point on a line', () => {
    const r = snap({ x: 25, y: 2 }, idx, 3);
    expect(r.kind).toBe('on-line');
    expect(near(r.point, { x: 25, y: 0 })).toBe(true);
  });
  it('nothing within tolerance: the click stays where it was', () => {
    expect(snap({ x: 25, y: 10 }, idx, 3)).toMatchObject({ kind: 'none', point: { x: 25, y: 10 } });
  });
});

describe('snapped take-off is exact to the drawing', () => {
  it('slab corners clicked 1.5 mm off on paper snap to the drawn corners: 96.000 m² and 94.000 m² net', async () => {
    const { g, H } = await geometryOf((d) => { d.rect(50, 50, 120, 80); d.rect(60, 60, 20, 10); });
    const idx = new SnapIndex(g.segments);
    const P = (x: number, y: number) => ({ x: x * MM, y: H - y * MM });
    const tol = 3 * MM; // 3 mm on paper
    const click = (x: number, y: number) => snap(P(x + 1.5, y - 1.2), idx, tol);
    const outer = [[50, 50], [170, 50], [170, 130], [50, 130]].map(([x, y]) => click(x, y));
    const hole = [[60, 60], [80, 60], [80, 70], [60, 70]].map(([x, y]) => click(x, y));
    expect(outer.every((r) => r.kind === 'endpoint') && hole.every((r) => r.kind === 'endpoint')).toBe(true);
    const cal = calibrate('s', [{ a: outer[0].point, b: outer[1].point, knownM: 12 }, { a: outer[1].point, b: outer[2].point, knownM: 8 }], { ratio: 100, unit: 'pt' });
    const m: Measurement = { id: 'M1', kind: 'area', sheetId: 's', label: 'slab', points: outer.map((r) => r.point), holes: [hole.map((r) => r.point)], metresPerUnit: cal.metresPerUnit, user: 't', at: '2026-11-14', revision: 'A', snaps: outer.map((r) => r.kind) };
    const q = quantify(m);
    expect(q.gross).toBe(96);
    expect(q.net).toBe(94);
  });
});
