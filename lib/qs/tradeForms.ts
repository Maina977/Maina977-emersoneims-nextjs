/**
 * Building Suite Pro: form state for the Trades panel → trade engine inputs (P1, 2026-11-20).
 *
 * Pure mapping, no React. The form holds what the user typed (strings); this
 * module turns it into the `lib/qs/trades` inputs, picks the take-off
 * quantities by id, and lets the engine refuse anything missing, implausible
 * or unsourced. Nothing is defaulted: an empty value stays empty (NaN) and the
 * engine says what is required. Optional groups (block count, roof sheets,
 * reveals, wall below ground) are used only when the user switches them on.
 *
 * Wastage is the one optional value: left blank (value and source), no
 * wastage is applied and the trace says so ("0 %, none entered"). A value
 * without a source, or a source without a value, is refused.
 */
import type { MeasureKind, Quantity } from './takeoff';
import {
  masonry, plaster, roofing, roomFinishes, stripFoundation, openingSchedule, toBoqItems,
  TradeError, type Opening, type Param, type TradeLine,
} from './trades';
import type { BoqItem } from './boq';

export interface ParamForm { value: string; source: string }
export interface OpeningForm { mark: string; type: Opening['type']; width: ParamForm; height: ParamForm; count: string }

export type TradeKind = 'masonry' | 'plaster' | 'roofing' | 'rooms' | 'strip' | 'openings';
export const TRADE_LABELS: Record<TradeKind, string> = {
  masonry: 'Masonry walling',
  plaster: 'Plaster / render',
  roofing: 'Roofing',
  rooms: 'Room finishes',
  strip: 'Strip foundation',
  openings: 'Door & window schedule',
};

export interface MasonryForm {
  trade: 'masonry'; code: string; description: string;
  wallLengthId: string; height: ParamForm; thickness: ParamForm; minDeducted: ParamForm;
  openings: OpeningForm[];
  block: { enabled: boolean; length: ParamForm; height: ParamForm; joint: ParamForm; wastage: ParamForm };
}
export interface PlasterForm {
  trade: 'plaster'; code: string; description: string;
  wallLengthId: string; height: ParamForm; faces: '' | '1' | '2'; minDeducted: ParamForm;
  openings: OpeningForm[];
  reveal: { enabled: boolean; depth: ParamForm };
}
export interface RoofingForm {
  trade: 'roofing'; code: string; description: string;
  planAreaId: string; pitch: ParamForm; ridgeId: string;
  sheet: { enabled: boolean; coverWidth: ParamForm; length: ParamForm; endLap: ParamForm; wastage: ParamForm };
}
export interface RoomForm { name: string; areaId: string; perimeterId: string; doorWidths: ParamForm[] }
export interface RoomsForm { trade: 'rooms'; code: string; rooms: RoomForm[]; skirting: boolean; ceiling: boolean }
export interface StripForm {
  trade: 'strip'; code: string; description: string;
  trenchLengthId: string; width: ParamForm; depth: ParamForm; concrete: ParamForm;
  wall: { enabled: boolean; thickness: ParamForm; height: ParamForm };
}
export interface OpeningsForm { trade: 'openings'; code: string; openings: OpeningForm[] }
export type TradeForm = MasonryForm | PlasterForm | RoofingForm | RoomsForm | StripForm | OpeningsForm;

const P = (): ParamForm => ({ value: '', source: '' });
export const emptyOpening = (): OpeningForm => ({ mark: '', type: 'door', width: P(), height: P(), count: '' });
export const emptyRoom = (): RoomForm => ({ name: '', areaId: '', perimeterId: '', doorWidths: [] });

/** A blank form for a trade: every value and source empty, every option off. */
export function emptyForm(trade: TradeKind): TradeForm {
  switch (trade) {
    case 'masonry': return { trade, code: '', description: '', wallLengthId: '', height: P(), thickness: P(), minDeducted: P(), openings: [], block: { enabled: false, length: P(), height: P(), joint: P(), wastage: P() } };
    case 'plaster': return { trade, code: '', description: '', wallLengthId: '', height: P(), faces: '', minDeducted: P(), openings: [], reveal: { enabled: false, depth: P() } };
    case 'roofing': return { trade, code: '', description: '', planAreaId: '', pitch: P(), ridgeId: '', sheet: { enabled: false, coverWidth: P(), length: P(), endLap: P(), wastage: P() } };
    case 'rooms': return { trade, code: '', rooms: [emptyRoom()], skirting: false, ceiling: false };
    case 'strip': return { trade, code: '', description: '', trenchLengthId: '', width: P(), depth: P(), concrete: P(), wall: { enabled: false, thickness: P(), height: P() } };
    case 'openings': return { trade, code: '', openings: [emptyOpening()] };
  }
}

/** Which take-off measurement kind each measurement slot accepts. */
export const SLOT_KIND = {
  wallLength: 'linear', planArea: 'area', ridge: 'linear', roomArea: 'area', roomPerimeter: 'linear', trenchLength: 'linear',
} as const satisfies Record<string, MeasureKind>;

/** Measurements of one kind, for a picker. */
export function measurementOptions(quantities: Map<string, Quantity>, kind: MeasureKind): Quantity[] {
  return [...quantities.values()].filter((q) => q.kind === kind);
}

/** Parses a typed number: blank → NaN (the engine then says it is required); text that is not a number is refused here. */
function num(label: string, s: string): number {
  const t = s.trim();
  if (t === '') return NaN;
  const n = Number(t);
  if (!Number.isFinite(n)) throw new TradeError(`${label}: "${s}" is not a number (use a decimal point, e.g. 0.2)`);
  return n;
}
function param(label: string, f: ParamForm): Param {
  return { value: num(label, f.value), source: f.source.trim() };
}
/** Optional wastage: both blank → 0 % with the trace saying none was entered; half-filled → refused. */
function wastage(label: string, f: ParamForm): Param {
  const v = f.value.trim(), s = f.source.trim();
  if (v === '' && s === '') return { value: 0, source: 'none entered: no wastage applied' };
  if (v === '') throw new TradeError(`${label}: enter the percentage, or clear its source to apply no wastage`);
  return param(label, f);
}
/** Picks a take-off quantity by id; the engine checks it is present and of the right kind. */
function pick(label: string, id: string, quantities: Map<string, Quantity>): Quantity | undefined {
  if (!id) return undefined;
  const q = quantities.get(id);
  if (!q) throw new TradeError(`${label}: measurement ${id} is not in this take-off`);
  return q;
}
function pickKind(label: string, id: string, quantities: Map<string, Quantity>, kind: MeasureKind): Quantity {
  const q = pick(label, id, quantities);
  if (!q) throw new TradeError(`${label}: a ${kind} measurement from the take-off is required`);
  if (q.kind !== kind) throw new TradeError(`${label}: expected a ${kind} measurement, got ${q.kind} (${q.id})`);
  return q;
}
function text(label: string, s: string): string {
  const t = s.trim();
  if (!t) throw new TradeError(`${label} is required`);
  return t;
}
function openings(fs: OpeningForm[]): Opening[] {
  return fs.map((o, i) => {
    const mark = text(`Opening ${i + 1}: mark`, o.mark);
    const count = num(`${mark} count`, o.count);
    return { mark, type: o.type, widthM: param(`${mark} width`, o.width), heightM: param(`${mark} height`, o.height), count };
  });
}

/** Form → trade lines. Throws TradeError with the engine's (or the form's) message. */
export function calculateTrade(f: TradeForm, quantities: Map<string, Quantity>): TradeLine[] {
  const code = text('Item code', f.code);
  switch (f.trade) {
    case 'masonry': {
      const description = text('Description', f.description);
      const wallLength = pickKind('Wall length', f.wallLengthId, quantities, SLOT_KIND.wallLength);
      const block = f.block.enabled
        ? { lengthM: param('Block length', f.block.length), heightM: param('Block height', f.block.height), jointM: param('Joint', f.block.joint), wastagePct: wastage('Block wastage', f.block.wastage) }
        : undefined;
      return masonry({ code, description, wallLength, heightM: param('Wall height', f.height), thicknessM: param('Wall thickness', f.thickness), openings: openings(f.openings), minDeductedOpeningM2: param('Minimum deducted opening', f.minDeducted), block });
    }
    case 'plaster': {
      const description = text('Description', f.description);
      const wallLength = pickKind('Wall length', f.wallLengthId, quantities, SLOT_KIND.wallLength);
      if (f.faces !== '1' && f.faces !== '2') throw new TradeError('Faces: choose one face or both faces');
      return plaster({ code, description, wallLength, heightM: param('Plaster height', f.height), faces: f.faces === '2' ? 2 : 1, openings: openings(f.openings), minDeductedOpeningM2: param('Minimum deducted opening', f.minDeducted), revealDepthM: f.reveal.enabled ? param('Reveal depth', f.reveal.depth) : undefined });
    }
    case 'roofing': {
      const description = text('Description', f.description);
      const planArea = pickKind('Roof plan area', f.planAreaId, quantities, SLOT_KIND.planArea);
      const ridge = f.ridgeId ? pickKind('Ridge', f.ridgeId, quantities, SLOT_KIND.ridge) : undefined;
      const sheet = f.sheet.enabled
        ? { effectiveCoverWidthM: param('Sheet effective cover width', f.sheet.coverWidth), lengthM: param('Sheet length', f.sheet.length), endLapM: param('End lap', f.sheet.endLap), wastagePct: wastage('Sheet wastage', f.sheet.wastage) }
        : undefined;
      return roofing({ code, description, planArea, pitchDeg: param('Roof pitch', f.pitch), ridge, sheet });
    }
    case 'rooms': {
      const rooms = f.rooms.map((r, i) => {
        const name = text(`Room ${i + 1}: name`, r.name);
        return {
          name,
          area: pickKind(`${name} area`, r.areaId, quantities, SLOT_KIND.roomArea),
          perimeter: pickKind(`${name} perimeter`, r.perimeterId, quantities, SLOT_KIND.roomPerimeter),
          doorWidthsM: f.skirting ? r.doorWidths.map((d, j) => param(`${name} door ${j + 1} width`, d)) : [],
        };
      });
      return roomFinishes(code, rooms, { skirting: f.skirting, ceiling: f.ceiling });
    }
    case 'strip': {
      const description = text('Description', f.description);
      const trenchLength = pickKind('Trench length', f.trenchLengthId, quantities, SLOT_KIND.trenchLength);
      return stripFoundation({
        code, description, trenchLength, trenchWidthM: param('Trench width', f.width), trenchDepthM: param('Trench depth', f.depth), concreteThicknessM: param('Concrete thickness', f.concrete),
        wallBelowGround: f.wall.enabled ? { thicknessM: param('Wall thickness below ground', f.wall.thickness), heightM: param('Wall height below ground', f.wall.height) } : undefined,
      });
    }
    case 'openings': {
      if (!f.openings.length) throw new TradeError('Add at least one door or window to the schedule');
      return openingSchedule(openings(f.openings), code);
    }
  }
}

/** Codes in `incoming` that already exist in the BOQ or repeat within `incoming`. */
export function duplicateCodes(existing: string[], incoming: string[]): string[] {
  const have = new Set(existing.map((c) => c.trim()));
  const seen = new Set<string>(), dup = new Set<string>();
  for (const raw of incoming) {
    const c = raw.trim();
    if (have.has(c) || seen.has(c)) dup.add(c);
    seen.add(c);
  }
  return [...dup];
}

/** Lines → BOQ items for a section, refusing codes already in the BOQ. */
export function tradeBoqItems(lines: TradeLine[], section: string, existingCodes: string[]): BoqItem[] {
  const s = text('BOQ section', section);
  if (!lines.length) throw new TradeError('Calculate the trade first');
  const dup = duplicateCodes(existingCodes, lines.map((l) => l.code));
  if (dup.length) throw new TradeError(`Item code${dup.length > 1 ? 's' : ''} already in the BOQ: ${dup.join(', ')}. Change the trade code and calculate again`);
  return toBoqItems(lines, s);
}
