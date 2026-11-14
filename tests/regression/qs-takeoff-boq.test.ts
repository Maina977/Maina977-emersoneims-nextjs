import { describe, it, expect } from 'vitest';
import ExcelJS from 'exceljs';
import { calibrate, quantify, ruleQuantity, polygonArea, TakeoffError, type Measurement, type Pt } from '@/lib/qs/takeoff';
import { buildBoq, compareRevisions, type BoqItem, type Adjustments, type Rate } from '@/lib/qs/boq';
import { boqToXlsx } from '@/lib/qs/export';

// A 1:100 sheet in PDF points: 1 pt on paper = 0.3528 mm → 0.03528 m on site.
const MPP = (0.0254 / 72) * 100;
const toPt = (m: number) => m / MPP;
const P = (xm: number, ym: number): Pt => ({ x: toPt(xm), y: toPt(ym) });
const meas = (p: Partial<Measurement>): Measurement => ({ id: 'M1', kind: 'area', sheetId: 'A-101', label: 'Slab', points: [], metresPerUnit: MPP, user: 'qs', at: '2026-11-14T10:00:00Z', revision: 'A', ...p });

describe('scale calibration', () => {
  it('two agreeing dimensions calibrate; stated 1:100 cross-checks within 2 %', () => {
    const c = calibrate('A-101', [{ a: P(0, 0), b: P(12, 0), knownM: 12 }, { a: P(0, 0), b: P(0, 8), knownM: 8 }], { ratio: 100, unit: 'pt' });
    expect(c.metresPerUnit).toBeCloseTo(MPP, 10);
    expect(c.statedScale!.differencePct).toBeLessThan(0.01);
    expect(c.statedScale!.warning).toBeUndefined();
  });
  it('dimensions disagreeing by more than 1 % are refused (distorted scan)', () => {
    expect(() => calibrate('A-101', [{ a: P(0, 0), b: P(12, 0), knownM: 12 }, { a: P(0, 0), b: P(0, 8), knownM: 8.2 }])).toThrow(/disagree by 2\.47 %/); // (1.025 − 1) ÷ mean 1.0125
  });
  it('a sheet printed at a different size warns against the stated scale', () => {
    const c = calibrate('A-101', [{ a: P(0, 0), b: P(12, 0), knownM: 12 * 1.05 }, { a: P(0, 0), b: P(0, 8), knownM: 8 * 1.05 }], { ratio: 100, unit: 'pt' });
    expect(c.statedScale!.warning).toMatch(/differs from the stated 1:100 by 5/);
  });
  it('one reference only, zero length, or pixels without DPI → refused', () => {
    expect(() => calibrate('A', [{ a: P(0, 0), b: P(1, 0), knownM: 1 }])).toThrow(TakeoffError);
    expect(() => calibrate('A', [{ a: P(0, 0), b: P(0, 0), knownM: 1 }, { a: P(0, 0), b: P(0, 1), knownM: 1 }])).toThrow(/same point/);
    expect(() => calibrate('A', [{ a: P(0, 0), b: P(1, 0), knownM: 1 }, { a: P(0, 0), b: P(0, 1), knownM: 1 }], { ratio: 50, unit: 'px' })).toThrow(/DPI/);
  });
  it('pixels at 150 dpi, 1:50: expected 0.0254/150 × 50 = 0.008467 m per px', () => {
    const mpp = (0.0254 / 150) * 50;
    const c = calibrate('B', [{ a: { x: 0, y: 0 }, b: { x: 1000, y: 0 }, knownM: 1000 * mpp }, { a: { x: 0, y: 0 }, b: { x: 0, y: 500 }, knownM: 500 * mpp }], { ratio: 50, unit: 'px', dpi: 150 });
    expect(c.statedScale!.differencePct).toBeLessThan(0.01);
  });
});

describe('measurements', () => {
  const slab = [P(0, 0), P(12, 0), P(12, 8), P(0, 8)];
  it('slab benchmark: 12 × 8 × 0.15 = 14.40 m³', () => {
    expect(quantify(meas({ kind: 'volume', points: slab, depthM: 0.15 })).net).toBeCloseTo(14.4, 3);
  });
  it('with a 2 × 1 m opening: 14.40 − 0.30 = 14.10 m³; deduction shown separately', () => {
    const q = quantify(meas({ kind: 'volume', points: slab, depthM: 0.15, holes: [[P(1, 1), P(3, 1), P(3, 2), P(1, 2)]] }));
    expect(q.gross).toBeCloseTo(14.4, 3); expect(q.deductions).toBeCloseTo(0.3, 3); expect(q.net).toBeCloseTo(14.1, 3);
  });
  it('L-shaped polygon: 10×6 − 4×3 = 48 m²', () => {
    expect(quantify(meas({ points: [P(0, 0), P(10, 0), P(10, 3), P(6, 3), P(6, 6), P(0, 6)] })).net).toBeCloseTo(48, 3);
  });
  it('polyline 3-4-5: 3 + 4 = 7 m (path, not chord)', () => {
    expect(quantify(meas({ kind: 'linear', points: [P(0, 0), P(3, 0), P(3, 4)] })).net).toBeCloseTo(7, 3);
  });
  it('count', () => expect(quantify(meas({ kind: 'count', points: [P(1, 1), P(2, 2), P(3, 3)] })).net).toBe(3));
  it('shoelace is orientation independent', () => {
    const cw = [{ x: 0, y: 0 }, { x: 0, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 0 }];
    expect(polygonArea(cw)).toBe(6); expect(polygonArea([...cw].reverse())).toBe(6);
  });
  it.each([
    [{ metresPerUnit: 0 }, /not calibrated/],
    [{ kind: 'volume' as const, points: [P(0, 0), P(1, 0), P(1, 1)], depthM: 150 }, /0\.15 = 150 mm/],
    [{ kind: 'volume' as const, points: [P(0, 0), P(1, 0), P(1, 1)], depthM: -1 }, /depth/],
    [{ points: [P(0, 0), P(1, 0)] }, /three points/],
    [{ points: [P(0, 0), P(1, 0), P(2, 0)] }, /zero area/],
    [{ points: slab, holes: [[P(20, 20), P(21, 20), P(21, 21)]] }, /not inside/],
    [{ kind: 'linear' as const, points: [P(1, 1)] }, /two points/],
  ] as Array<[Partial<Measurement>, RegExp]>)('refuses %o', (patch, msg) => {
    expect(() => quantify(meas({ points: slab, ...patch }))).toThrow(msg);
  });
});

describe('measurement rule vs geometric net', () => {
  const wall = meas({ points: [P(0, 0), P(10, 0), P(10, 3), P(0, 3)], holes: [[P(1, 1), P(1.6, 1), P(1.6, 1.5), P(1, 1.5)], [P(4, 0.5), P(6, 0.5), P(6, 2.5), P(4, 2.5)]] });
  it('small void (0.3 m²) not deducted under a 0.5 m² rule; the 4 m² window is', () => {
    const q = quantify(wall);
    expect(q.net).toBeCloseTo(30 - 0.3 - 4, 3);
    const r = ruleQuantity(q, { name: 'Client rule', edition: '2026', voidNotDeductedUpToM2: 0.5 });
    expect(r.ruleQuantity).toBeCloseTo(26, 3);
    expect(r.geometricNet).toBeCloseTo(25.7, 3);
    expect(r.voidsNotDeducted).toBe(1);
  });
});

const RATE = (v: number): Rate => ({ value: v, currency: 'KES', source: 'Test rate library', date: '2026-10-01', location: 'Nairobi', kind: 'rate-library' });
const ADJ: Adjustments = { preliminaries: { kind: 'percent', pct: 10 }, contingencyPct: 5, overheadsProfitPct: 10, vat: { pct: 16, effectiveFrom: '2023-07-01' } };
const Q = new Map([
  ['M1', quantify(meas({ id: 'M1', kind: 'volume', points: [P(0, 0), P(12, 0), P(12, 8), P(0, 8)], depthM: 0.15 }))],
  ['M2', quantify(meas({ id: 'M2', kind: 'area', points: [P(0, 0), P(10, 0), P(10, 3), P(0, 3)] }))],
  ['M3', quantify(meas({ id: 'M3', kind: 'count', points: [P(1, 1), P(2, 2)] }))],
]);
const ITEMS: BoqItem[] = [
  { code: 'C1', section: 'Concrete', trade: 'concrete', description: 'Slab C25/30', unit: 'm³', links: [{ measurementId: 'M1', factor: 1 }], rate: RATE(18000) },
  { code: 'C2', section: 'Concrete', trade: 'reinforcement', description: 'Y12 bars', unit: 'kg', links: [], scheduledQuantity: { value: 1250, source: 'Bar schedule BS-01 rev A' }, rate: RATE(160) },
  { code: 'M1', section: 'Masonry', trade: 'masonry', description: 'Wall, both faces plaster', unit: 'm²', links: [{ measurementId: 'M2', factor: 2 }], rate: RATE(850) },
  { code: 'D1', section: 'Doors', trade: 'doors', description: 'Door sets', unit: 'No', links: [{ measurementId: 'M3', factor: 1 }], rate: RATE(25000) },
];

describe('BOQ totals (hand calculation)', () => {
  // 14.4 × 18000 = 259200; 1250 × 160 = 200000; 60 × 850 = 51000; 2 × 25000 = 50000
  // measured 560200; prelims 56020; contingency 5 % × 616220 = 30811; OH&P 10 % × 647031 = 64703.10
  // before VAT 711734.10; VAT 16 % = 113877.46 (113877.456); total 825611.56
  const b = buildBoq(ITEMS, Q, ADJ, 'A');
  it('line amounts and section subtotals', () => {
    expect(b.errors).toEqual([]);
    expect(b.lines.map((l) => l.amount)).toEqual([259200, 200000, 51000, 50000]);
    expect(b.sections).toEqual([{ section: 'Concrete', subtotal: 459200, unpriced: 0 }, { section: 'Masonry', subtotal: 51000, unpriced: 0 }, { section: 'Doors', subtotal: 50000, unpriced: 0 }]);
  });
  it('adjustments and VAT, each computed once', () => {
    expect(b.measuredWorks).toBe(560200); expect(b.preliminaries).toBe(56020); expect(b.contingency).toBe(30811);
    expect(b.overheadsProfit).toBe(64703.1); expect(b.subtotalBeforeVat).toBe(711734.1); expect(b.vat).toBe(113877.46); expect(b.grandTotal).toBe(825611.56);
  });
  it('no double counting: grand total = lines + adjustments exactly', () => {
    const lines = b.lines.reduce((a, l) => a + l.amount!, 0);
    expect(Math.round((lines + b.preliminaries! + b.contingency! + b.overheadsProfit! + b.vat!) * 100) / 100).toBe(b.grandTotal);
  });
  it('itemised preliminaries replace the percentage', () => {
    const x = buildBoq(ITEMS, Q, { ...ADJ, preliminaries: { kind: 'itemised', items: [{ description: 'Site set-up', amount: 40000 }] } }, 'A');
    expect(x.preliminaries).toBe(40000);
  });
});

describe('BOQ refuses what it cannot support', () => {
  it('unpriced item → "rate required", no grand total, priced subtotal labelled separately', () => {
    const b = buildBoq(ITEMS.map((i) => (i.code === 'D1' ? { ...i, rate: null } : i)), Q, ADJ, 'A');
    expect(b.lines.find((l) => l.code === 'D1')!.rateNote).toBe('rate required');
    expect(b.grandTotal).toBeNull();
    expect(b.pricedSubtotal).toBe(510200);
    expect(b.unpricedItems).toEqual(['D1']);
    expect(b.sections.find((s) => s.section === 'Doors')!.subtotal).toBeNull();
  });
  it.each([
    [[{ ...ITEMS[0], unit: 'm²' as const }], /does not match/],
    [[{ ...ITEMS[0], links: [{ measurementId: 'M1', factor: 1 }, { measurementId: 'M1', factor: 1 }] }], /linked twice/],
    [[{ ...ITEMS[0], links: [{ measurementId: 'MX', factor: 1 }] }], /not found/],
    [[ITEMS[0], ITEMS[0]], /code repeated/],
    [[{ ...ITEMS[1], links: [{ measurementId: 'M1', factor: 1 }] }], /double counting/],
    [[{ ...ITEMS[1], scheduledQuantity: { value: 1250, source: '' } }], /source/],
    [[{ ...ITEMS[0], links: [] }], /no measurement linked/],
    [[{ ...ITEMS[0], rate: { ...RATE(100), date: 'soon' } }], /source and a date/],
  ] as Array<[BoqItem[], RegExp]>)('error %#', (items, msg) => {
    const b = buildBoq(items, Q, ADJ, 'A');
    expect(b.errors.join(' ')).toMatch(msg);
    expect(b.grandTotal).toBeNull();
  });
  it('VAT without its effective date → error', () => {
    expect(buildBoq(ITEMS, Q, { ...ADJ, vat: { pct: 16, effectiveFrom: '' } }, 'A').errors.join(' ')).toMatch(/VAT/);
  });
});

describe('revisions', () => {
  it('variation shows the changed, added and omitted items and the total change', () => {
    const a = buildBoq(ITEMS, Q, ADJ, 'A');
    const b = buildBoq([...ITEMS.slice(0, 2), { ...ITEMS[2], rate: RATE(900) }, { code: 'W1', section: 'Doors', trade: 'windows', description: 'Windows', unit: 'No', links: [{ measurementId: 'M3', factor: 1 }], rate: RATE(15000) }], Q, ADJ, 'B');
    const v = compareRevisions(a, b);
    expect(v.rows.find((r) => r.code === 'M1')).toMatchObject({ status: 'changed', amountChange: 3000 });
    expect(v.rows.find((r) => r.code === 'D1')).toMatchObject({ status: 'omitted', amountChange: -50000 });
    expect(v.rows.find((r) => r.code === 'W1')).toMatchObject({ status: 'added', amountChange: 30000 });
    expect(v.grandTotalChange).toBe(Math.round((b.grandTotal! - a.grandTotal!) * 100) / 100);
  });
});

describe('Excel export', () => {
  it('formulas reproduce the engine totals; values stored match', async () => {
    const b = buildBoq(ITEMS, Q, ADJ, 'A');
    const buf = await boqToXlsx(b, ADJ, 'Test project');
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf as unknown as Parameters<typeof wb.xlsx.load>[0]);
    const ws = wb.getWorksheet('BOQ')!;
    const cells: Record<string, { formula?: string; result?: unknown }> = {};
    ws.eachRow((row) => { const label = String(row.getCell(2).value ?? ''); const v = row.getCell(6).value as { formula?: string; result?: unknown }; if (v && typeof v === 'object' && 'formula' in v) cells[label] = v; });
    expect(cells['TOTAL'].result).toBe(825611.56);
    expect(cells['Measured works'].result).toBe(560200);
    expect(cells['VAT 16 % (from 2023-07-01)'].formula).toMatch(/ROUND\(F\d+\*16\/100,2\)/);
    // Evaluate the formulas independently from the cell values in the sheet.
    const val = (ref: string): number => {
      const c = ws.getCell(ref).value as unknown;
      if (typeof c === 'number') return c;
      if (c && typeof c === 'object' && 'formula' in (c as object)) return evalF((c as { formula: string }).formula);
      return 0;
    };
    const evalF = (f: string): number => {
      const sum = f.replace(/SUM\(F(\d+):F(\d+)\)/g, (_, a, z) => { let s = 0; for (let i = +a; i <= +z; i++) s += val(`F${i}`); return String(s); });
      const refs = sum.replace(/([A-F]\d+)/g, (m) => String(val(m)));
      const js = refs.replace(/ROUND\(/g, 'R(');
      return new Function('R', `return ${js}`)((x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d) as number;
    };
    const totalRow = ws.getColumn(2).values.findIndex((v) => v === 'TOTAL');
    expect(val(`F${totalRow}`)).toBeCloseTo(825611.56, 2);
  });
  it('an incomplete bill is not exported as priced', async () => {
    const b = buildBoq(ITEMS.map((i) => ({ ...i, rate: null })), Q, ADJ, 'A');
    await expect(boqToXlsx(b, ADJ, 'x')).rejects.toThrow(/incomplete/);
  });
});
