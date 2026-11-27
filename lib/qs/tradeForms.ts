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
import { electrical, plumbing, FIXTURE_LABELS, POINT_LABELS, SERVICE_LABELS, type FixtureKind, type PipeService, type PointKind } from './mep';
import { measuredWorks, WORKS_CATALOGUES, type WorksTrade } from './works';

export interface ParamForm { value: string; source: string }
export interface OpeningForm { mark: string; type: Opening['type']; width: ParamForm; height: ParamForm; count: string }

export type TradeKind = 'masonry' | 'plaster' | 'roofing' | 'rooms' | 'strip' | 'openings' | 'electrical' | 'plumbing' | WorksTrade;
export const TRADE_LABELS: Record<TradeKind, string> = {
  masonry: 'Masonry walling',
  plaster: 'Plaster / render',
  roofing: 'Roofing',
  rooms: 'Room finishes',
  strip: 'Strip foundation',
  openings: 'Door & window schedule',
  electrical: 'Electrical installation',
  plumbing: 'Plumbing & sanitary',
  external: 'External works',
  hvac: 'HVAC (quantities only)',
  drainage: 'Below-ground drainage',
  painting: 'Painting & decoration',
  concrete: 'Concrete (slabs, beams, columns, walls)',
  formwork: 'Formwork (contact areas)',
  earthworks: 'Earthworks (strip, excavation, fill, disposal)',
};

// ---- MEP rows (lib/qs/mep). Measurement ids are take-off ids; '' = none chosen.
export interface PointRowForm { kind: PointKind | ''; label: string; countId: string }
export interface CircuitRunForm { label: string; runId: string; pointsId: string; drop: ParamForm; allowance: ParamForm; conductors: ParamForm; cableSpec: string; conduitSpec: string }
export interface EnumeratedRowForm { label: string; count: ParamForm }
export interface FixtureRowForm { kind: FixtureKind | ''; label: string; countId: string }
export interface PipeRunForm { label: string; service: PipeService | ''; material: string; diameter: ParamForm; runId: string; pointsId: string; drop: ParamForm; allowance: ParamForm; fittings: ParamForm }
export const emptyPointRow = (): PointRowForm => ({ kind: '', label: '', countId: '' });
export const emptyCircuitRun = (): CircuitRunForm => ({ label: '', runId: '', pointsId: '', drop: P(), allowance: P(), conductors: P(), cableSpec: '', conduitSpec: '' });
export const emptyEnumeratedRow = (): EnumeratedRowForm => ({ label: '', count: P() });
export const emptyFixtureRow = (): FixtureRowForm => ({ kind: '', label: '', countId: '' });
export const emptyPipeRun = (): PipeRunForm => ({ label: '', service: '', material: '', diameter: P(), runId: '', pointsId: '', drop: P(), allowance: P(), fittings: P() });

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
export interface ElectricalForm { trade: 'electrical'; code: string; description: string; points: PointRowForm[]; runs: CircuitRunForm[]; enumerated: EnumeratedRowForm[] }
export interface PlumbingForm { trade: 'plumbing'; code: string; description: string; fixtures: FixtureRowForm[]; pipes: PipeRunForm[] }
/** Measured-item trades (lib/qs/works): one row per item; d1, d2, d3 are the catalogue's dimensions in order. */
export interface WorksRowForm { item: string; spec: string; measurementId: string; d1: ParamForm; d2: ParamForm; d3: ParamForm }
export const emptyWorksRow = (): WorksRowForm => ({ item: '', spec: '', measurementId: '', d1: P(), d2: P(), d3: P() });
export interface WorksForm { trade: WorksTrade; code: string; description: string; works: WorksRowForm[] }
export type TradeForm = MasonryForm | PlasterForm | RoofingForm | RoomsForm | StripForm | OpeningsForm | ElectricalForm | PlumbingForm | WorksForm;

function P(): ParamForm { return { value: '', source: '' }; }
export const emptyOpening = (): OpeningForm => ({ mark: '', type: 'door', width: P(), height: P(), count: '' });
export const emptyRoom = (): RoomForm => ({ name: '', areaId: '', perimeterId: '', doorWidths: [] });

/**
 * For validating saved forms (lib/qs/project): the blank element of every list
 * field, and the allowed values of every choice field inside a list element.
 */
export const FORM_LIST_ELEMENTS: Record<string, () => object> = {
  openings: emptyOpening, rooms: emptyRoom, doorWidths: P,
  points: emptyPointRow, runs: emptyCircuitRun, enumerated: emptyEnumeratedRow, fixtures: emptyFixtureRow, pipes: emptyPipeRun, works: emptyWorksRow,
};
export const FORM_LIST_CHOICES: Record<string, Record<string, readonly string[]>> = {
  openings: { type: ['door', 'window', 'other'] },
  points: { kind: ['', ...Object.keys(POINT_LABELS)] },
  fixtures: { kind: ['', ...Object.keys(FIXTURE_LABELS)] },
  pipes: { service: ['', ...Object.keys(SERVICE_LABELS)] },
  works: { item: ['', ...new Set(Object.values(WORKS_CATALOGUES).flatMap((c) => Object.keys(c.items)))] },
};

/** A blank form for a trade: every value and source empty, every option off. */
export function emptyForm(trade: TradeKind): TradeForm {
  switch (trade) {
    case 'masonry': return { trade, code: '', description: '', wallLengthId: '', height: P(), thickness: P(), minDeducted: P(), openings: [], block: { enabled: false, length: P(), height: P(), joint: P(), wastage: P() } };
    case 'plaster': return { trade, code: '', description: '', wallLengthId: '', height: P(), faces: '', minDeducted: P(), openings: [], reveal: { enabled: false, depth: P() } };
    case 'roofing': return { trade, code: '', description: '', planAreaId: '', pitch: P(), ridgeId: '', sheet: { enabled: false, coverWidth: P(), length: P(), endLap: P(), wastage: P() } };
    case 'rooms': return { trade, code: '', rooms: [emptyRoom()], skirting: false, ceiling: false };
    case 'strip': return { trade, code: '', description: '', trenchLengthId: '', width: P(), depth: P(), concrete: P(), wall: { enabled: false, thickness: P(), height: P() } };
    case 'openings': return { trade, code: '', openings: [emptyOpening()] };
    case 'electrical': return { trade, code: '', description: '', points: [], runs: [], enumerated: [] };
    case 'plumbing': return { trade, code: '', description: '', fixtures: [], pipes: [] };
    default: return { trade, code: '', description: '', works: [] };
  }
}

/** Which take-off measurement kind each measurement slot accepts. */
export const SLOT_KIND = {
  wallLength: 'linear', planArea: 'area', ridge: 'linear', roomArea: 'area', roomPerimeter: 'linear', trenchLength: 'linear',
  pointCount: 'count', runLength: 'linear', fixtureCount: 'count',
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
      return masonry({ code, description, wallLength, heightM: param('Wall height', f.height), thicknessM: param('Wall thickness', f.thickness), openings: openings(f.openings), minDeductedOpeningM2: param('Openings not deducted up to', f.minDeducted), block });
    }
    case 'plaster': {
      const description = text('Description', f.description);
      const wallLength = pickKind('Wall length', f.wallLengthId, quantities, SLOT_KIND.wallLength);
      if (f.faces !== '1' && f.faces !== '2') throw new TradeError('Faces: choose one face or both faces');
      return plaster({ code, description, wallLength, heightM: param('Plaster height', f.height), faces: f.faces === '2' ? 2 : 1, openings: openings(f.openings), minDeductedOpeningM2: param('Openings not deducted up to', f.minDeducted), revealDepthM: f.reveal.enabled ? param('Reveal depth', f.reveal.depth) : undefined });
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
    case 'electrical': {
      const description = text('Description', f.description);
      return electrical({
        code, description,
        points: f.points.map((p, i) => ({ kind: p.kind as PointKind, label: p.label, count: optPick(`Point row ${i + 1}: count`, p.countId, quantities, SLOT_KIND.pointCount) })),
        runs: f.runs.map((r, i) => ({
          label: r.label, plan: optPick(`Run ${i + 1}: run length`, r.runId, quantities, SLOT_KIND.runLength),
          points: optPick(`Run ${i + 1}: points served`, r.pointsId, quantities, SLOT_KIND.pointCount),
          dropM: optional(`Run ${i + 1}: drop per point`, r.drop), allowancePct: optional(`Run ${i + 1}: allowance`, r.allowance),
          conductors: param(`Run ${i + 1}: conductors per run`, r.conductors), cableSpec: r.cableSpec, conduitSpec: r.conduitSpec,
        })),
        enumerated: f.enumerated.map((e, i) => ({ label: e.label, count: param(`Enumerated item ${i + 1} count`, e.count) })),
      });
    }
    case 'plumbing': {
      const description = text('Description', f.description);
      return plumbing({
        code, description,
        fixtures: f.fixtures.map((x, i) => ({ kind: x.kind as FixtureKind, label: x.label, count: optPick(`Fixture row ${i + 1}: count`, x.countId, quantities, SLOT_KIND.fixtureCount) })),
        pipes: f.pipes.map((p, i) => ({
          label: p.label, service: p.service as PipeService, material: p.material, diameterMm: param(`Pipe run ${i + 1}: nominal diameter`, p.diameter),
          plan: optPick(`Pipe run ${i + 1}: run length`, p.runId, quantities, SLOT_KIND.runLength),
          points: optPick(`Pipe run ${i + 1}: fixtures served`, p.pointsId, quantities, SLOT_KIND.fixtureCount),
          dropM: optional(`Pipe run ${i + 1}: rise per fixture`, p.drop), allowancePct: optional(`Pipe run ${i + 1}: allowance`, p.allowance),
          fittingsPerM: optional(`Pipe run ${i + 1}: fittings allowance`, p.fittings),
        })),
      });
    }
    default: {
      // Measured-item trades (lib/qs/works): external works and the trades that follow its pattern.
      const description = text('Description', f.description);
      const cat = WORKS_CATALOGUES[f.trade];
      return measuredWorks({
        code, description, trade: f.trade,
        rows: f.works.map((w, i) => {
          const c = Object.prototype.hasOwnProperty.call(cat.items, w.item) ? cat.items[w.item] : undefined;
          return {
            item: w.item, spec: w.spec,
            measurement: c ? optPick(`Item ${i + 1}: measurement`, w.measurementId, quantities, c.takes) : undefined,
            dims: (c?.dims ?? []).map((d, k) => param(`Item ${i + 1}: ${d.label}`, k === 0 ? w.d1 : k === 1 ? w.d2 : w.d3)),
          };
        }),
      });
    }
  }
}

/** An optional parameter: value and source both blank → not used; half-filled → the engine refuses it. */
function optional(label: string, f: ParamForm): Param | undefined {
  if (f.value.trim() === '' && f.source.trim() === '') return undefined;
  return param(label, f);
}
/** A measurement slot that may be empty (the engine then says what is missing); a chosen id must exist and be of the right kind. */
function optPick(label: string, id: string, quantities: Map<string, Quantity>, kind: MeasureKind): Quantity | undefined {
  return id ? pickKind(label, id, quantities, kind) : undefined;
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
