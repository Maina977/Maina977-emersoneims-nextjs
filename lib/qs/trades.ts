/**
 * Building Suite Pro: measured QS trades (P1, 2026-11-20).
 *
 * Trade quantities derived from take-off measurements (lib/qs/takeoff) and from
 * parameters read off the drawings or specification. Every parameter carries
 * its source, such as "Section A-A, drawing A-201 rev C". A missing or
 * implausible parameter is refused. Nothing is assumed.
 *
 * Each line records its formula and inputs, so a quantity surveyor can check it
 * by hand. Lines feed the BOQ as `scheduledQuantity` with that trace as source.
 *
 * Trades: masonry walling, plaster/render (with reveals), roofing (slope area,
 * sheets, ridge), floor/ceiling finishes and skirting, strip-foundation
 * earthworks and concrete, door and window schedule.
 *
 * Wastage is applied only when stated with a source, and is shown on its own line.
 * Deduction of openings follows the measurement rule chosen by the QS: the
 * threshold for "voids not deducted" is a parameter, never a hidden default.
 */
import type { Quantity } from './takeoff';
import type { BoqItem } from './boq';

export const TRADES_ENGINE_VERSION = 'qs-trades 1.0.0 (2026-11-20)';

export interface Param { value: number; source: string }
export interface TradeLine {
  code: string; trade: string; description: string;
  unit: 'm' | 'm²' | 'm³' | 'No';
  quantity: number;
  formula: string;
  inputs: string[];
}
export class TradeError extends Error {}

const r3 = (x: number) => Math.round(x * 1000) / 1000;
/**
 * Whole units needed, rounded UP — but not past an exact whole number that
 * binary arithmetic misses by a hair. 42 m² ÷ (1.0 × (3.0 − 0.2)) m² is exactly
 * 15 sheets; in floating point it is 15.000000000000002 and Math.ceil gave 16
 * (audit 2026-11-26). The quotient is cleaned to 6 decimals first, far below
 * any measurable quantity, then rounded up.
 */
export const ceilCount = (x: number) => Math.ceil(Math.round(x * 1e6) / 1e6);
function need(name: string, p: Param | undefined, min: number, max: number, unit: string): number {
  if (!p || !Number.isFinite(p.value)) throw new TradeError(`${name} is required (${unit})`);
  if (!p.source?.trim()) throw new TradeError(`${name}: give its source (drawing, section, schedule or specification)`);
  if (!(p.value >= min && p.value <= max)) throw new TradeError(`${name} = ${p.value} ${unit} is outside ${min}–${max} ${unit}; check the drawing`);
  return p.value;
}
function measured(name: string, q: Quantity | undefined, kind: Quantity['kind']): number {
  if (!q) throw new TradeError(`${name}: a ${kind} measurement from the take-off is required`);
  if (q.kind !== kind) throw new TradeError(`${name}: expected a ${kind} measurement, got ${q.kind} (${q.id})`);
  if (!(q.net > 0)) throw new TradeError(`${name}: measurement ${q.id} is zero`);
  return q.net;
}
const src = (label: string, p: Param, unit: string) => `${label} ${p.value} ${unit} (${p.source})`;

// ---------------------------------------------------------------- openings
export interface Opening { mark: string; type: 'door' | 'window' | 'other'; widthM: Param; heightM: Param; count: number }
function openingArea(o: Opening) {
  const w = need(`${o.mark} width`, o.widthM, 0.2, 12, 'm');
  const h = need(`${o.mark} height`, o.heightM, 0.2, 8, 'm');
  if (!(Number.isInteger(o.count) && o.count >= 1)) throw new TradeError(`${o.mark}: count must be a whole number ≥ 1`);
  return { w, h, each: w * h, total: w * h * o.count };
}

/** Door and window schedule: count by mark (from the drawings' schedule). */
export function openingSchedule(openings: Opening[], codePrefix = 'DW'): TradeLine[] {
  return openings.map((o, i) => {
    const a = openingArea(o);
    return {
      code: `${codePrefix}.${i + 1}`, trade: 'Doors & windows', unit: 'No' as const, quantity: o.count,
      description: `${o.type === 'door' ? 'Door' : o.type === 'window' ? 'Window' : 'Opening'} ${o.mark}, ${a.w} × ${a.h} m`,
      formula: `count from schedule`, inputs: [src('width', o.widthM, 'm'), src('height', o.heightM, 'm'), `count ${o.count}`],
    };
  });
}

// ---------------------------------------------------------------- masonry
export interface MasonryInput {
  code: string; description: string;
  wallLength: Quantity;            // centreline length, linear take-off
  heightM: Param; thicknessM: Param;
  openings: Opening[];
  /**
   * Openings of this area or less (each) are NOT deducted; larger ones are (measurement rule; give the rule as source).
   * Same convention as ruleQuantity() in lib/qs/takeoff (voidNotDeductedUpToM2) and the NRM2 / SMM7 wording
   * "voids not exceeding 0.50 m²": an opening of exactly the threshold is not deducted (2026-11-26; it was
   * deducted here while ruleQuantity did not deduct it). The field name is kept for saved projects.
   */
  minDeductedOpeningM2: Param;
  block?: { lengthM: Param; heightM: Param; jointM: Param; wastagePct: Param };
}
export function masonry(i: MasonryInput): TradeLine[] {
  const L = measured('Wall length', i.wallLength, 'linear');
  const H = need('Wall height', i.heightM, 0.3, 12, 'm');
  const T = need('Wall thickness', i.thicknessM, 0.05, 0.6, 'm');
  const minDed = need('Openings not deducted up to', i.minDeductedOpeningM2, 0, 2, 'm²');
  let deducted = 0, notDeducted = 0;
  for (const o of i.openings) { const a = openingArea(o); if (r3(a.each) > minDed) deducted += a.total; else notDeducted += a.total; }
  const gross = L * H;
  if (deducted >= gross) throw new TradeError('Openings exceed the wall area: check lengths, heights and counts');
  const net = gross - deducted;
  const inputs = [`length ${r3(L)} m (take-off ${i.wallLength.id})`, src('height', i.heightM, 'm'), src('thickness', i.thicknessM, 'm'), `openings deducted ${r3(deducted)} m²; not deducted (≤ ${minDed} m² each, ${i.minDeductedOpeningM2.source}) ${r3(notDeducted)} m²`];
  const lines: TradeLine[] = [
    { code: `${i.code}.1`, trade: 'Masonry', unit: 'm²', quantity: r3(net), description: `${i.description}: walling, ${T * 1000} mm`, formula: 'length × height − deducted openings', inputs },
    { code: `${i.code}.2`, trade: 'Masonry', unit: 'm³', quantity: r3(net * T), description: `${i.description}: walling volume`, formula: 'net area × thickness', inputs },
  ];
  if (i.block) {
    const bl = need('Block length', i.block.lengthM, 0.1, 1, 'm'), bh = need('Block height', i.block.heightM, 0.05, 0.5, 'm');
    const j = need('Joint', i.block.jointM, 0, 0.03, 'm'), w = need('Block wastage', i.block.wastagePct, 0, 20, '%');
    const perM2 = 1 / ((bl + j) * (bh + j));
    lines.push({
      code: `${i.code}.3`, trade: 'Masonry', unit: 'No', quantity: ceilCount(net * perM2 * (1 + w / 100)),
      description: `${i.description}: blocks ${bl * 1000} × ${bh * 1000} mm incl. ${w} % wastage`,
      formula: `net area × 1/((l+j)(h+j)) = ${r3(perM2)} /m², × (1 + wastage)`,
      inputs: [...inputs, src('block length', i.block.lengthM, 'm'), src('block height', i.block.heightM, 'm'), src('joint', i.block.jointM, 'm'), src('wastage', i.block.wastagePct, '%')],
    });
  }
  return lines;
}

// ---------------------------------------------------------------- plaster / render
export interface PlasterInput {
  code: string; description: string;
  wallLength: Quantity; heightM: Param; faces: 1 | 2;
  openings: Opening[]; minDeductedOpeningM2: Param;
  /** Reveal (jamb + head) depth to plaster around each deducted opening, per face. Omit when not plastered. */
  revealDepthM?: Param;
}
export function plaster(i: PlasterInput): TradeLine[] {
  const L = measured('Wall length', i.wallLength, 'linear');
  const H = need('Plaster height', i.heightM, 0.3, 12, 'm');
  const minDed = need('Openings not deducted up to', i.minDeductedOpeningM2, 0, 2, 'm²');
  if (i.faces !== 1 && i.faces !== 2) throw new TradeError('faces must be 1 or 2');
  let deducted = 0, revealLen = 0;
  for (const o of i.openings) { const a = openingArea(o); if (r3(a.each) > minDed) { deducted += a.total; revealLen += (2 * a.h + a.w) * o.count; } }
  const net = (L * H - deducted) * i.faces;
  if (!(net > 0)) throw new TradeError('Openings exceed the plastered area');
  const lines: TradeLine[] = [{
    code: `${i.code}.1`, trade: 'Finishes', unit: 'm²', quantity: r3(net), description: `${i.description}: ${i.faces === 2 ? 'both faces' : 'one face'}`,
    formula: '(length × height − deducted openings) × faces',
    inputs: [`length ${r3(L)} m (take-off ${i.wallLength.id})`, src('height', i.heightM, 'm'), `faces ${i.faces}`, `openings deducted ${r3(deducted)} m² (rule: ${i.minDeductedOpeningM2.source})`],
  }];
  if (i.revealDepthM) {
    const d = need('Reveal depth', i.revealDepthM, 0.01, 0.6, 'm');
    lines.push({ code: `${i.code}.2`, trade: 'Finishes', unit: 'm²', quantity: r3(revealLen * d * i.faces), description: `${i.description}: reveals`, formula: 'Σ (2 × height + width) × count × reveal depth × faces', inputs: [src('reveal depth', i.revealDepthM, 'm'), `reveal length ${r3(revealLen)} m`] });
  }
  return lines;
}

// ---------------------------------------------------------------- roofing
export interface RoofInput {
  code: string; description: string;
  planArea: Quantity;               // roof plan area on plan (horizontal projection), area take-off
  pitchDeg: Param;                  // from the roof section
  ridge?: Quantity;                 // ridge length, linear take-off
  sheet?: { effectiveCoverWidthM: Param; lengthM: Param; endLapM: Param; wastagePct: Param };
}
export function roofing(i: RoofInput): TradeLine[] {
  const A = measured('Roof plan area', i.planArea, 'area');
  const pitch = need('Roof pitch', i.pitchDeg, 0, 60, '°');
  const slope = A / Math.cos((pitch * Math.PI) / 180);
  const base = [`plan area ${r3(A)} m² (take-off ${i.planArea.id})`, src('pitch', i.pitchDeg, '°')];
  const lines: TradeLine[] = [{ code: `${i.code}.1`, trade: 'Roofing', unit: 'm²', quantity: r3(slope), description: `${i.description}: roof covering (slope area)`, formula: 'plan area ÷ cos(pitch)', inputs: base }];
  if (i.sheet) {
    const c = need('Sheet effective cover width', i.sheet.effectiveCoverWidthM, 0.3, 1.5, 'm');
    const len = need('Sheet length', i.sheet.lengthM, 0.5, 15, 'm');
    const lap = need('End lap', i.sheet.endLapM, 0, 0.5, 'm');
    const w = need('Sheet wastage', i.sheet.wastagePct, 0, 20, '%');
    if (!(len > lap)) throw new TradeError('Sheet length must exceed the end lap');
    lines.push({
      code: `${i.code}.2`, trade: 'Roofing', unit: 'No', quantity: ceilCount((slope / (c * (len - lap))) * (1 + w / 100)),
      description: `${i.description}: sheets ${len} m, cover ${c} m, incl. ${w} % wastage`,
      formula: 'slope area ÷ (cover width × (length − end lap)) × (1 + wastage); a QS sheet layout per roof slope can be smaller',
      inputs: [...base, src('cover width', i.sheet.effectiveCoverWidthM, 'm'), src('sheet length', i.sheet.lengthM, 'm'), src('end lap', i.sheet.endLapM, 'm'), src('wastage', i.sheet.wastagePct, '%')],
    });
  }
  if (i.ridge) lines.push({ code: `${i.code}.3`, trade: 'Roofing', unit: 'm', quantity: r3(measured('Ridge', i.ridge, 'linear')), description: `${i.description}: ridge capping`, formula: 'measured ridge length', inputs: [`ridge (take-off ${i.ridge.id})`] });
  return lines;
}

// ---------------------------------------------------------------- floor / ceiling finishes
export interface RoomInput { name: string; area: Quantity; perimeter: Quantity; doorWidthsM: Param[] }
export function roomFinishes(code: string, rooms: RoomInput[], opts: { skirting: boolean; ceiling: boolean }): TradeLine[] {
  if (!rooms.length) throw new TradeError('At least one room is required');
  const out: TradeLine[] = [];
  let k = 1;
  for (const rm of rooms) {
    const a = measured(`${rm.name} area`, rm.area, 'area');
    const p = measured(`${rm.name} perimeter`, rm.perimeter, 'linear');
    out.push({ code: `${code}.${k++}`, trade: 'Finishes', unit: 'm²', quantity: r3(a), description: `${rm.name}: floor finish`, formula: 'measured room area', inputs: [`area (take-off ${rm.area.id})`] });
    if (opts.ceiling) out.push({ code: `${code}.${k++}`, trade: 'Finishes', unit: 'm²', quantity: r3(a), description: `${rm.name}: ceiling finish`, formula: 'measured room area (flat ceiling)', inputs: [`area (take-off ${rm.area.id})`] });
    if (opts.skirting) {
      const doors = rm.doorWidthsM.reduce((s, d, i) => s + need(`${rm.name} door ${i + 1} width`, d, 0.5, 4, 'm'), 0);
      if (doors >= p) throw new TradeError(`${rm.name}: door widths exceed the perimeter`);
      out.push({ code: `${code}.${k++}`, trade: 'Finishes', unit: 'm', quantity: r3(p - doors), description: `${rm.name}: skirting`, formula: 'perimeter − door widths', inputs: [`perimeter (take-off ${rm.perimeter.id})`, ...rm.doorWidthsM.map((d) => src('door width', d, 'm'))] });
    }
  }
  return out;
}

// ---------------------------------------------------------------- strip foundations
export interface StripFoundationInput {
  code: string; description: string;
  trenchLength: Quantity;           // centreline length, linear take-off
  trenchWidthM: Param; trenchDepthM: Param; concreteThicknessM: Param;
  /** Masonry below ground in the trench, to compute backfill. Omit to leave backfill to the QS. */
  wallBelowGround?: { thicknessM: Param; heightM: Param };
}
export function stripFoundation(i: StripFoundationInput): TradeLine[] {
  const L = measured('Trench length', i.trenchLength, 'linear');
  const W = need('Trench width', i.trenchWidthM, 0.2, 3, 'm');
  const D = need('Trench depth', i.trenchDepthM, 0.2, 4, 'm');
  const Tc = need('Concrete thickness', i.concreteThicknessM, 0.05, 1.5, 'm');
  if (Tc >= D) throw new TradeError('Concrete thickness must be less than trench depth');
  const base = [`length ${r3(L)} m (take-off ${i.trenchLength.id})`, src('width', i.trenchWidthM, 'm'), src('depth', i.trenchDepthM, 'm'), src('concrete', i.concreteThicknessM, 'm')];
  const exc = L * W * D, conc = L * W * Tc;
  const lines: TradeLine[] = [
    { code: `${i.code}.1`, trade: 'Earthworks', unit: 'm³', quantity: r3(exc), description: `${i.description}: excavate trench`, formula: 'length × width × depth (bulked volume is not included)', inputs: base },
    { code: `${i.code}.2`, trade: 'Concrete', unit: 'm³', quantity: r3(conc), description: `${i.description}: strip footing concrete`, formula: 'length × width × concrete thickness', inputs: base },
  ];
  if (i.wallBelowGround) {
    const wt = need('Wall thickness below ground', i.wallBelowGround.thicknessM, 0.05, 0.6, 'm');
    const wh = need('Wall height below ground', i.wallBelowGround.heightM, 0, 4, 'm');
    if (wt > W) throw new TradeError('Wall below ground is wider than the trench');
    if (Math.abs(Tc + wh - D) > 0.01) throw new TradeError(`Concrete (${Tc}) + wall below ground (${wh}) should equal the trench depth (${D}); check the section`);
    lines.push({ code: `${i.code}.3`, trade: 'Earthworks', unit: 'm³', quantity: r3(exc - conc - L * wt * wh), description: `${i.description}: backfill`, formula: 'excavation − footing concrete − wall below ground', inputs: [...base, src('wall thickness', i.wallBelowGround.thicknessM, 'm'), src('wall height below ground', i.wallBelowGround.heightM, 'm')] });
  }
  return lines;
}

// ---------------------------------------------------------------- to the BOQ
/** Turns trade lines into BOQ items; the quantity source is the full trace. Rates are added separately (null = rate required). */
export function toBoqItems(lines: TradeLine[], section: string): BoqItem[] {
  return lines.map((l) => ({
    code: l.code, section, trade: l.trade, description: l.description, unit: l.unit, links: [],
    scheduledQuantity: { value: l.quantity, source: `${l.formula}; ${l.inputs.join('; ')} [${TRADES_ENGINE_VERSION}]` },
    rate: null,
  }));
}
