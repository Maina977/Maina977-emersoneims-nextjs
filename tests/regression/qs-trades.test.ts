import { describe, it, expect } from 'vitest';
import { masonry, plaster, roofing, roomFinishes, stripFoundation, openingSchedule, toBoqItems, TradeError, type Param, type Opening } from '@/lib/qs/trades';
import { buildBoq } from '@/lib/qs/boq';
import type { Quantity } from '@/lib/qs/takeoff';

// Hand-calculated cases. Parameters are TEST values with test sources, not project data.
const p = (value: number, source = 'test drawing A-201') => ({ value, source }) as Param;
const lin = (id: string, net: number): Quantity => ({ id, kind: 'linear', unit: 'm', gross: net, deductions: 0, net, holes: [] });
const area = (id: string, net: number): Quantity => ({ id, kind: 'area', unit: 'm²', gross: net, deductions: 0, net, holes: [] });
const openings: Opening[] = [
  { mark: 'D1', type: 'door', widthM: p(0.9), heightM: p(2.1), count: 2 },   // 1.89 m² each → deducted, 3.78
  { mark: 'W1', type: 'window', widthM: p(1.2), heightM: p(1.2), count: 3 }, // 1.44 m² each → deducted, 4.32
  { mark: 'V1', type: 'other', widthM: p(0.3), heightM: p(0.3), count: 4 },  // 0.09 m² each → not deducted
];
const rule = p(0.5, 'measurement rule: voids < 0.5 m² not deducted (test)');

describe('masonry', () => {
  it('20 m × 3 m wall, 200 mm, openings ≥ 0.5 m² deducted → 51.9 m², 10.38 m³, 633 blocks', () => {
    const l = masonry({ code: 'M1', description: 'External wall', wallLength: lin('T1', 20), heightM: p(3), thicknessM: p(0.2), openings, minDeductedOpeningM2: rule,
      block: { lengthM: p(0.4), heightM: p(0.2), jointM: p(0.01), wastagePct: p(5, 'specification clause 4.2 (test)') } });
    expect(l[0].quantity).toBe(51.9);          // 60 − 3.78 − 4.32
    expect(l[1].quantity).toBe(10.38);         // 51.9 × 0.2
    expect(l[2].quantity).toBe(633);           // 51.9 / (0.41 × 0.21) = 602.79 × 1.05 = 632.93 → 633
    expect(l[0].inputs.join(' ')).toMatch(/not deducted .* 0\.36 m²/);
  });
});

describe('plaster', () => {
  it('both faces 103.8 m²; reveals Σ(2h+w)·n = 21 m × 0.2 m × 2 faces = 8.4 m²', () => {
    const l = plaster({ code: 'P1', description: 'Wall plaster', wallLength: lin('T1', 20), heightM: p(3), faces: 2, openings, minDeductedOpeningM2: rule, revealDepthM: p(0.2) });
    expect(l[0].quantity).toBe(103.8);
    expect(l[1].quantity).toBe(8.4);
  });
});

describe('roofing', () => {
  it('120 m² on plan at 25° → 120 / 0.9063078 = 132.405 m² slope; 0.762 × (3.0 − 0.15) sheets + 5 % → 65; ridge 12 m', () => {
    const l = roofing({ code: 'R1', description: 'Main roof', planArea: area('A1', 120), pitchDeg: p(25, 'roof section B-B'), ridge: lin('T9', 12),
      sheet: { effectiveCoverWidthM: p(0.762, 'sheet datasheet (test)'), lengthM: p(3), endLapM: p(0.15), wastagePct: p(5) } });
    expect(l[0].quantity).toBe(132.405);
    expect(l[1].quantity).toBe(65);            // 132.405 / 2.1717 = 60.97 × 1.05 = 64.02 → 65
    expect(l[2].quantity).toBe(12);
  });
});

describe('room finishes', () => {
  it('4 × 4 m room: floor 16, ceiling 16, skirting 16 − 0.9 door = 15.1 m', () => {
    const l = roomFinishes('F1', [{ name: 'Bedroom 1', area: area('A2', 16), perimeter: lin('T2', 16), doorWidthsM: [p(0.9)] }], { skirting: true, ceiling: true });
    expect(l.map((x) => x.quantity)).toEqual([16, 16, 15.1]);
  });
});

describe('strip foundation', () => {
  it('40 m × 0.6 × 1.0 m: excavation 24 m³, concrete 0.2 m → 4.8 m³, backfill 24 − 4.8 − 40×0.2×0.8 = 12.8 m³', () => {
    const l = stripFoundation({ code: 'S1', description: 'Strip footing', trenchLength: lin('T3', 40), trenchWidthM: p(0.6), trenchDepthM: p(1.0), concreteThicknessM: p(0.2),
      wallBelowGround: { thicknessM: p(0.2), heightM: p(0.8) } });
    expect(l.map((x) => x.quantity)).toEqual([24, 4.8, 12.8]);
  });
  it('refuses a section that does not close (concrete + wall ≠ depth)', () => {
    expect(() => stripFoundation({ code: 'S2', description: 'x', trenchLength: lin('T3', 40), trenchWidthM: p(0.6), trenchDepthM: p(1.0), concreteThicknessM: p(0.2),
      wallBelowGround: { thicknessM: p(0.2), heightM: p(0.5) } })).toThrow(/should equal the trench depth/);
  });
});

describe('integrity', () => {
  it('a parameter without a source is refused; implausible values are refused; a wrong measurement kind is refused', () => {
    expect(() => masonry({ code: 'M', description: 'x', wallLength: lin('T', 10), heightM: { value: 3, source: '' }, thicknessM: p(0.2), openings: [], minDeductedOpeningM2: rule })).toThrow(/give its source/);
    expect(() => masonry({ code: 'M', description: 'x', wallLength: lin('T', 10), heightM: p(30), thicknessM: p(0.2), openings: [], minDeductedOpeningM2: rule })).toThrow(/outside/);
    expect(() => roofing({ code: 'R', description: 'x', planArea: lin('T', 10), pitchDeg: p(20) })).toThrow(/expected a area measurement/);
    expect(() => masonry({ code: 'M', description: 'x', wallLength: lin('T', 2), heightM: p(2), thicknessM: p(0.2), openings: [{ mark: 'D', type: 'door', widthM: p(1), heightM: p(2.1), count: 3 }], minDeductedOpeningM2: rule })).toThrow(TradeError);
  });
  it('door and window schedule counts by mark', () => {
    expect(openingSchedule(openings).map((l) => `${l.description}=${l.quantity}`)).toEqual(['Door D1, 0.9 × 2.1 m=2', 'Window W1, 1.2 × 1.2 m=3', 'Opening V1, 0.3 × 0.3 m=4']);
  });
  it('lines flow into the BOQ with their trace as quantity source and "rate required" until priced', () => {
    const items = toBoqItems(masonry({ code: 'M1', description: 'External wall', wallLength: lin('T1', 20), heightM: p(3), thicknessM: p(0.2), openings, minDeductedOpeningM2: rule }), 'Masonry');
    const boq = buildBoq(items, new Map(), { preliminaries: { kind: 'percent', pct: 0 }, contingencyPct: 0, overheadsProfitPct: 0, vat: { pct: 16, effectiveFrom: '2026-01-01' } }, 'A');
    expect(boq.lines[0].quantity).toBe(51.9);
    expect(boq.lines[0].quantitySource).toMatch(/length × height − deducted openings/);
    expect(boq.grandTotal).toBeNull();
    expect(boq.unpricedItems.length).toBe(2);
  });
});
