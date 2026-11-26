/**
 * Building Suite Pro calculation audit, 2026-11-26 (BOQ / quantity take-off /
 * MEP / cost). Every number below is worked by hand in the comment beside it.
 * Rates are TEST values with TEST sources, never prices.
 *
 * References: SMM7 / RICS NRM2 general approach (walling and finishes in m²
 * net of deducted openings, enumerated items in No, runs in m); blocks per m²
 * = 1 / ((l + j)(h + j)); roof slope area = plan area / cos(pitch); EN 1992-1-1
 * §3.1.7 and §6.2.2; Kenya VAT Act 2013 s.5(2)(a) (16 %).
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { masonry, plaster, roofing, roomFinishes, stripFoundation, ceilCount, type Param } from '@/lib/qs/trades';
import { electrical, plumbing } from '@/lib/qs/mep';
import { buildBoq, type BoqItem, type Adjustments } from '@/lib/qs/boq';
import { computeBuildUp } from '@/lib/qs/rateBuildUp';
import { calibrate, quantify, type Measurement, type Quantity } from '@/lib/qs/takeoff';
import { emptyForm, calculateTrade, tradeBoqItems, type RoofingForm } from '@/lib/qs/tradeForms';
import { draftBoq, buildProject, restoreProject, type ItemDraft } from '@/lib/qs/project';
import * as c from '@/lib/wizard-api/buildingCalcs';

vi.mock('@/lib/prisma/client', () => ({ prisma: { quotation: { create: () => Promise.reject(new Error('TEST: no database')) } } }));

const p = (value: number, source = 'TEST drawing A-201'): Param => ({ value, source });
const lin = (id: string, net: number): Quantity => ({ id, kind: 'linear', unit: 'm', gross: net, deductions: 0, net, holes: [] });
const area = (id: string, net: number): Quantity => ({ id, kind: 'area', unit: 'm²', gross: net, deductions: 0, net, holes: [] });
const cnt = (id: string, net: number): Quantity => ({ id, kind: 'count', unit: 'No', gross: net, deductions: 0, net, holes: [] });
const door = { mark: 'D1', type: 'door' as const, widthM: p(0.9), heightM: p(2.1), count: 2 };

describe('masonry walling (hand-worked)', () => {
  it('A: 20 m × 3 m, two 0.9 × 2.1 doors deducted, a 0.2 m² vent not deducted, 390 × 190 blocks, 10 mm joints, 5 %', () => {
    // gross 20 × 3 = 60 m²; doors 0.9 × 2.1 = 1.89 m² each ≥ 0.5 → deducted 3.78; vent 0.4 × 0.5 = 0.2 < 0.5 → not deducted.
    // net 56.22 m²; volume 56.22 × 0.2 = 11.244 m³; blocks 1/(0.40 × 0.20) = 12.5 /m² × 56.22 = 702.75 × 1.05 = 737.89 → 738.
    const out = masonry({ code: 'W', description: 'TEST wall', wallLength: lin('M1', 20), heightM: p(3), thicknessM: p(0.2),
      openings: [door, { mark: 'V1', type: 'other', widthM: p(0.4), heightM: p(0.5), count: 1 }], minDeductedOpeningM2: p(0.5, 'TEST rule'),
      block: { lengthM: p(0.39), heightM: p(0.19), jointM: p(0.01), wastagePct: p(5, 'TEST spec') } });
    expect(out.map((l) => l.quantity)).toEqual([56.22, 11.244, 738]);
  });
  it('B (DEFECT fixed): an exact whole number of blocks is not rounded up by one', () => {
    // 6.75 m × 3 m = 20.25 m²; 440 × 215 blocks, 10 mm joints: 1/(0.45 × 0.225) = 9.8765… /m²;
    // 20.25 × 9.8765… = 200 exactly; × 1.10 = 220. Before the fix floating point gave 220.00000000000003 → 221.
    const out = masonry({ code: 'W', description: 'TEST wall', wallLength: lin('M1', 6.75), heightM: p(3), thicknessM: p(0.215),
      openings: [], minDeductedOpeningM2: p(0.5, 'TEST rule'),
      block: { lengthM: p(0.44), heightM: p(0.215), jointM: p(0.01), wastagePct: p(10, 'TEST spec') } });
    expect(out[2].quantity).toBe(220);
  });
});

describe('plaster, roofing, room finishes, strip foundation (hand-worked)', () => {
  it('plaster both faces with reveals', () => {
    // (20 × 2.8 − 3.78) × 2 = 104.44 m²; reveals (2 × 2.1 + 0.9) × 2 = 10.2 m × 0.1 m × 2 faces = 2.04 m².
    const out = plaster({ code: 'P', description: 'TEST plaster', wallLength: lin('M1', 20), heightM: p(2.8), faces: 2, openings: [door], minDeductedOpeningM2: p(0.5, 'TEST rule'), revealDepthM: p(0.1) });
    expect(out.map((l) => l.quantity)).toEqual([104.44, 2.04]);
  });
  it('roof A: 100 m² on plan at 30°, 0.76 m cover, 3.0 m sheets, 150 mm end lap, 5 %', () => {
    // slope 100 / cos 30° = 115.470 m²; per sheet 0.76 × 2.85 = 2.166 m²; 115.470 / 2.166 = 53.31 × 1.05 = 55.98 → 56.
    const out = roofing({ code: 'R', description: 'TEST roof', planArea: area('M2', 100), pitchDeg: p(30), sheet: { effectiveCoverWidthM: p(0.76), lengthM: p(3), endLapM: p(0.15), wastagePct: p(5, 'TEST spec') } });
    expect(out.map((l) => l.quantity)).toEqual([115.47, 56]);
  });
  it('roof B (DEFECT fixed): 42 m² flat, 1.0 m cover, 3.0 m sheets, 0.2 m lap is exactly 15 sheets, not 16', () => {
    // 42 / (1.0 × 2.8) = 15 exactly; floating point gave 15.000000000000002 → 16 before the fix.
    const out = roofing({ code: 'R', description: 'TEST roof', planArea: area('M2', 42), pitchDeg: p(0), sheet: { effectiveCoverWidthM: p(1), lengthM: p(3), endLapM: p(0.2), wastagePct: p(0, 'TEST spec') } });
    expect(out[1].quantity).toBe(15);
    expect(ceilCount(15.000000000000002)).toBe(15);
    expect(ceilCount(15.0004)).toBe(16); // a real fraction of a sheet still rounds up
  });
  it('room: floor, ceiling and skirting', () => {
    // floor 12 m², ceiling 12 m², skirting 14 − 0.9 = 13.1 m.
    const out = roomFinishes('F', [{ name: 'TEST bedroom', area: area('A1', 12), perimeter: lin('L1', 14), doorWidthsM: [p(0.9)] }], { skirting: true, ceiling: true });
    expect(out.map((l) => l.quantity)).toEqual([12, 12, 13.1]);
  });
  it('strip foundation: excavation, concrete, backfill', () => {
    // excavation 30 × 0.6 × 1.0 = 18 m³; concrete 30 × 0.6 × 0.2 = 3.6 m³; wall 30 × 0.2 × 0.8 = 4.8 m³; backfill 18 − 3.6 − 4.8 = 9.6 m³.
    const out = stripFoundation({ code: 'S', description: 'TEST strip', trenchLength: lin('T1', 30), trenchWidthM: p(0.6), trenchDepthM: p(1), concreteThicknessM: p(0.2), wallBelowGround: { thicknessM: p(0.2), heightM: p(0.8) } });
    expect(out.map((l) => l.quantity)).toEqual([18, 3.6, 9.6]);
  });
});

describe('MEP runs (hand-worked)', () => {
  it('electrical: (25 + 6 × 1.2) × 1.05 = 33.81 m conduit, × 3 conductors = 101.43 m cable', () => {
    const out = electrical({ code: 'E', description: 'TEST', points: [], enumerated: [],
      runs: [{ label: 'TEST ring', plan: lin('R1', 25), points: cnt('C1', 6), dropM: p(1.2), allowancePct: p(5), conductors: p(3), cableSpec: 'TEST 2.5 mm²', conduitSpec: 'TEST 20 mm' }] });
    expect(out.map((l) => l.quantity)).toEqual([33.81, 101.43]);
  });
  it('plumbing: 12 + 3 × 0.6 = 13.8 m; fittings ceil(13.8 × 0.5 = 6.9) = 7', () => {
    const out = plumbing({ code: 'PL', description: 'TEST', fixtures: [],
      pipes: [{ label: 'TEST supply', service: 'supply', material: 'TEST PPR', diameterMm: p(20), plan: lin('R2', 12), points: cnt('C2', 3), dropM: p(0.6), fittingsPerM: p(0.5) }] });
    expect(out.map((l) => l.quantity)).toEqual([13.8, 7]);
  });
});

describe('BOQ totals and VAT once (hand-worked)', () => {
  it('lines = qty × rate, sections sum, adjustments compound, VAT on the subtotal once', () => {
    // 56.22 × 1,250 = 70,275.00; 11.244 × 15,000 = 168,660.00; measured works 238,935.00
    // prelims 5 % = 11,946.75; contingency 5 % × 250,881.75 = 12,544.09; O&P 10 % × 263,425.84 = 26,342.58
    // subtotal 289,768.42; VAT 16 % = 46,362.95; total 336,131.37.
    const rate = (value: number) => ({ value, currency: 'KES' as const, source: 'TEST rate library', date: '2026-11-01', location: 'TEST', kind: 'rate-library' as const, tier: 'verified' as const });
    const items: BoqItem[] = [
      { code: '1', section: 'TEST', trade: '', description: 'TEST walling', unit: 'm²', links: [], scheduledQuantity: { value: 56.22, source: 'TEST' }, rate: rate(1250) },
      { code: '2', section: 'TEST', trade: '', description: 'TEST volume', unit: 'm³', links: [], scheduledQuantity: { value: 11.244, source: 'TEST' }, rate: rate(15000) },
    ];
    const adj: Adjustments = { preliminaries: { kind: 'percent', pct: 5 }, contingencyPct: 5, overheadsProfitPct: 10, vat: { pct: 16, effectiveFrom: '2026-01-01' } };
    const b = buildBoq(items, new Map(), adj, 'A');
    expect(b.lines.map((l) => l.amount)).toEqual([70275, 168660]);
    expect([b.measuredWorks, b.preliminaries, b.contingency, b.overheadsProfit, b.subtotalBeforeVat, b.vat, b.grandTotal])
      .toEqual([238935, 11946.75, 12544.09, 26342.58, 289768.42, 46362.95, 336131.37]);
  });
  it('rate build-up: 0.25 bag × 800 × 1.05 + 0.5 h × 300 = 360; + 10 % = 396', () => {
    const r = computeBuildUp({ ohpPct: 10, ohpSource: 'TEST policy', location: 'TEST', resources: [
      { kind: 'material', description: 'TEST cement', unit: 'bag', quantity: 0.25, price: 800, tier: 'verified', wastePct: 5, source: 'TEST quote', date: '2026-11-01' },
      { kind: 'labour', description: 'TEST mason', unit: 'h', quantity: 0.5, price: 300, tier: 'verified', wastePct: 0, source: 'TEST wage', date: '2026-11-01' },
    ] }, 'm²');
    expect([r.materials, r.labour, r.net, r.ohp, r.rate]).toEqual([210, 150, 360, 36, 396]);
  });
});

describe('DEFECT fixed: a trade item follows its measurement when it changes', () => {
  // Roof plan area M1 = 10 m × 10 m = 100 m² at pitch 0 → 100 m². Then a 2 m × 2 m opening is added to M1:
  // the roof is 96 m². Before the fix the BOQ kept 100 m² (the quantity frozen when the trade was added).
  const SHEET = 'TEST-sheet';
  const refs = [{ a: { x: 0, y: 0 }, b: { x: 100, y: 0 }, knownM: 10 }, { a: { x: 0, y: 0 }, b: { x: 0, y: 100 }, knownM: 10 }];
  const cal = calibrate(SHEET, refs);
  const sq = (x0: number, y0: number, s: number) => [{ x: x0, y: y0 }, { x: x0 + s, y: y0 }, { x: x0 + s, y: y0 + s }, { x: x0, y: y0 + s }];
  const m1: Measurement = { id: 'M1', kind: 'area', sheetId: SHEET, label: 'TEST roof plan', points: sq(0, 0, 100), metresPerUnit: cal.metresPerUnit, user: 'TEST', at: '2026-11-26T00:00:00Z', revision: 'A' };
  const form: RoofingForm = { ...(emptyForm('roofing') as RoofingForm), code: 'R', description: 'TEST roof', planAreaId: 'M1', pitch: { value: '0', source: 'TEST section' } };
  const before = new Map([['M1', quantify(m1)]]);
  const [bi] = tradeBoqItems(calculateTrade(form, before), 'TEST', []);
  const item: ItemDraft = { code: bi.code, section: 'TEST', description: bi.description, measurementId: '', factor: '', rate: '', rateKind: '', source: '', date: '', location: '',
    trade: { name: bi.trade, unit: bi.unit, scheduled: bi.scheduledQuantity!, lineCode: bi.code, form } };
  const m1Holed: Measurement = { ...m1, holes: [sq(40, 40, 20)] };
  const after = new Map([['M1', quantify(m1Holed)]]);

  it('the bill uses the quantity from the current measurement (96 m², not 100 m²)', () => {
    expect(bi.scheduledQuantity!.value).toBe(100);
    expect(draftBoq([item], after, { prelims: '', contingency: '', ohp: '', vat: '', vatFrom: '' }, 'A')!.boq.lines[0].quantity).toBe(96);
  });
  it('a saved project stores and reopens the current quantity without a spurious difference', () => {
    const file = buildProject({ drawing: { name: 'T.pdf', size: 1, sha256: 'ab'.repeat(32), type: 'application/pdf' }, page: 1, stated: { ratio: '', dpi: '' },
      refs: { [SHEET]: refs }, cals: { [SHEET]: cal }, measurements: [m1Holed], items: [item], adj: { prelims: '', contingency: '', ohp: '', vat: '', vatFrom: '' }, revision: 'A' }, { savedAt: '2026-11-26T00:00:00Z' });
    expect(file.items[0].trade!.scheduled.value).toBe(96);
    expect(restoreProject(file).differences).toEqual([]);
  });
  it('a trade that can no longer be computed blocks the bill total with the reason', () => {
    const b = draftBoq([item], new Map(), { prelims: '0', contingency: '0', ohp: '0', vat: '16', vatFrom: '2026-01-01' }, 'A')!.boq;
    expect(b.grandTotal).toBeNull();
    expect(b.errors.join(' ')).toMatch(/cannot be recomputed from the current measurements/);
  });
});

describe('slab concrete and structural desk checks (hand-worked, unchanged code)', () => {
  it('slab: 12 × 8 × 0.15 = 14.40 m³; two 1 × 1 openings deduct 0.30 → 14.10', () => {
    const out = c.slabConcrete({ length_m: 12, width_m: 8, thickness_m: 0.15, openings: [{ length_m: 1, width_m: 1, count: 2 }] }) as unknown as Record<string, number>;
    expect([out.gross_volume_m3, out.deductions_m3, out.net_volume_m3]).toEqual([14.4, 0.3, 14.1]);
  });
  it('slab: 5 × 4 × 0.2 = 4.000; 0.6 × 0.6 opening 0.072 → 3.928 m³', () => {
    const out = c.slabConcrete({ length_m: 5, width_m: 4, thickness_m: 0.2, openings: [{ length_m: 0.6, width_m: 0.6 }] }) as unknown as Record<string, number>;
    expect(out.net_volume_m3).toBe(3.928);
  });
  it('RC beam M_Rd (EC2 §3.1.7): 300 × 450, As 1000, C25, B500 → 173.4 kNm; 250 × 400, As 600, C30 → 96.3 kNm', () => {
    // fcd = 0.85 × 25 / 1.5 = 14.17; fyd = 434.78; x = 1000 × 434.78 / (0.8 × 300 × 14.17) = 127.9; z = 450 − 0.4x = 398.8;
    // M = 1000 × 434.78 × 398.8 = 173.4 kNm. Second: fcd 17.0, x = 76.7, z = 369.3, M = 600 × 434.78 × 369.3 = 96.3 kNm.
    expect((c.rcBeam({ b_mm: 300, d_mm: 450, As_mm2: 1000, fck_MPa: 25, fyk_MPa: 500 }) as unknown as Record<string, number>).M_Rd_kNm).toBe(173.4);
    expect((c.rcBeam({ b_mm: 250, d_mm: 400, As_mm2: 600, fck_MPa: 30, fyk_MPa: 500 }) as unknown as Record<string, number>).M_Rd_kNm).toBe(96.3);
  });
  it('RC shear V_Rd,c (EC2 §6.2.2): 300 × 450, Asl 942, C25 → 70.0 kN; 200 × 300, Asl 402, C30 → 35.6 kN', () => {
    // k = 1 + √(200/450) = 1.667; ρ = 942/135000 = 0.00698; 0.12 × 1.667 × (100 × 0.00698 × 25)^⅓ = 0.519 MPa × 135000 = 70.0 kN.
    // k = 1.816; ρ = 0.0067; 0.12 × 1.816 × 20.1^⅓ = 0.593 MPa (> vmin 0.469) × 60000 = 35.6 kN.
    expect((c.ec2Shear({ bw_mm: 300, d_mm: 450, fck_MPa: 25, Asl_mm2: 942 }) as unknown as Record<string, number>).V_Rd_c_kN).toBe(70);
    expect((c.ec2Shear({ bw_mm: 200, d_mm: 300, fck_MPa: 30, Asl_mm2: 402 }) as unknown as Record<string, number>).V_Rd_c_kN).toBe(35.6);
  });
});

describe('DEFECT fixed: the floor-plan API returns no quantities, cost, foundation or electrical sizing from a description', () => {
  beforeAll(() => { vi.stubGlobal('fetch', () => Promise.reject(new Error('TEST: no network'))); });
  // lib/building/** may only be imported by the three routes (eslint.config.mjs), so this is checked through the route.
  it('POST /api/building/floor-plan (full and json) carries none of them, and keeps the layout', async () => {
    const { POST } = await import('@/app/api/building/floor-plan/route');
    for (const outputFormat of ['full', 'json']) {
      const res = await POST(new NextRequest('http://localhost/api/building/floor-plan', { method: 'POST', body: JSON.stringify({ description: 'TEST three bedroom bungalow', outputFormat }), headers: { 'content-type': 'application/json' } }));
      const j = await res.json();
      const text = JSON.stringify(j);
      expect(j.success).toBe(true);
      expect(text).not.toMatch(/"(concrete|cement|steel)":\d/);
      expect(text).not.toMatch(/"estimatedCost":\d/);
      expect(text).not.toMatch(/Y1[26]@/);
      expect(text).not.toMatch(/"mainPanel"/);
      const plan = outputFormat === 'json' ? j.data : j.data.plan;
      expect([plan.boqSummary, plan.estimatedCost, plan.foundation, plan.electrical]).toEqual([null, null, null, null]);
      expect(plan.floorPlans.length).toBeGreaterThan(0);
      expect(Object.keys(plan.notAvailable)).toEqual(['boq', 'estimatedCost', 'foundation', 'electrical']);
    }
  });
});

describe('DEFECT fixed: quotation totals charge VAT once, after the discount', () => {
  const post = async (body: Record<string, unknown>) => {
    const { POST } = await import('@/app/api/building/quotations/route');
    const res = await POST(new NextRequest('http://localhost/api/building/quotations', { method: 'POST', body: JSON.stringify({ projectId: 'TEST', items: [{ d: 'TEST' }], ...body }), headers: { 'content-type': 'application/json' } }));
    return { status: res.status, j: await res.json() };
  };
  it('subtotal 100,000, discount 10,000, VAT not given → VAT 16 % × 90,000 = 14,400; total 104,400', async () => {
    const { status, j } = await post({ subtotal: 100000, discount: 10000 });
    expect(status).toBe(201);
    expect([j.data.subtotal, j.data.discount, j.data.vat, j.data.total]).toEqual([100000, 10000, 14400, 104400]);
  });
  it('VAT 0 (exempt) stays 0: total = 90,000 (was 16 % added: 106,000)', async () => {
    const { j } = await post({ subtotal: 100000, discount: 10000, vat: 0 });
    expect([j.data.vat, j.data.total]).toEqual([0, 90000]);
  });
  it('a stated total that disagrees, or no subtotal, is refused (no VAT on a VAT-inclusive total)', async () => {
    expect((await post({ subtotal: 100000, total: 116000, discount: 10000 })).status).toBe(400);
    expect((await post({ total: 116000 })).status).toBe(400);
  });
});
