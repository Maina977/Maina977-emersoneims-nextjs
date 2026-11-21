/**
 * Building Suite Pro take-off project files and autosave (P1, 2026-11-21).
 *
 * There are no accounts and nothing is stored on a server. Work is kept in two
 * places, both under the user's control:
 *  - a project file (.json) the user downloads with "Save project";
 *  - an autosaved draft in this browser's localStorage, keyed by the
 *    drawing's SHA-256 (everything except the drawing bytes).
 *
 * A project file is evidence of what was measured, never of what it amounts
 * to. On open, every quantity is re-derived from the saved points and
 * calibration references (lib/qs/takeoff), every trade quantity from its saved
 * form (lib/qs/tradeForms), and the bill from those (lib/qs/boq). Stored
 * numbers are kept only to show the user where they differ from the
 * recomputed ones; they are never used.
 *
 * Nothing imported can approve or certify anything: a file that carries an
 * approval, certification or sign-off field, a changed draft notice, or a
 * revision label that claims approval is refused. Exports stay DRAFT.
 */
import { calibrate, quantify, TakeoffError, type Calibration, type Measurement, type MeasureKind, type Pt, type Quantity } from './takeoff';
import { buildBoq, rateFromInput, DRAFT_NOTICE, RATE_KIND_LABELS, type Adjustments, type Boq, type BoqItem, type RateKind } from './boq';
import { calculateTrade, emptyForm, emptyOpening, emptyRoom, TRADE_LABELS, type TradeForm, type TradeKind } from './tradeForms';
import { toBoqItems, TradeError } from './trades';
import { sha256Hex } from './pdfSheet';

export const PROJECT_FORMAT = 'building-suite-pro/qs-takeoff-project';
export const PROJECT_SCHEMA_VERSION = 1;
/** Drawings up to this size are embedded in the project file (base64); larger ones are stored by identity only. */
export const EMBED_LIMIT_BYTES = 15 * 1024 * 1024;
/** Longest project file text accepted (an embedded 15 MB drawing is about 20 MB as base64). */
export const MAX_PROJECT_CHARS = 24 * 1024 * 1024;
export const AUTOSAVE_KEY_PREFIX = 'bsp.qs.autosave.v1:';
export const SAVE_NOTICE = 'Saved in this browser only (autosave) — use Save project to keep a file. Accounts and shared storage are not available yet.';

// ------------------------------------------------------------------ types

const UNIT: Record<MeasureKind, BoqItem['unit']> = { linear: 'm', area: 'm²', volume: 'm³', count: 'No' };
const BOQ_UNITS: ReadonlyArray<BoqItem['unit']> = ['m', 'm²', 'm³', 'No', 'kg', 't', 'item'];

/** One BOQ row as typed in the workbench (strings, as entered). */
export interface ItemDraft {
  code: string; section: string; description: string; measurementId: string; factor: string; rate: string; source: string; date: string; location: string;
  /** Where the rate comes from, chosen by the user ('' until chosen; the engine refuses a rate without it). */
  rateKind: RateKind | '';
  /**
   * Items from the Trades panel: a scheduled quantity with its full trace (lib/qs/trades), not a
   * measurement link. `form` and `lineCode` are what the quantity is recomputed from on open.
   */
  trade?: { name: string; unit: BoqItem['unit']; scheduled: { value: number; source: string }; lineCode: string; form: TradeForm };
}
export interface AdjustmentDraft { prelims: string; contingency: string; ohp: string; vat: string; vatFrom: string }
export interface RefDim { a: Pt; b: Pt; knownM: number }
export interface DrawingIdentity { name: string; size: number; sha256: string; type: string }

/** Everything the workbench holds that a project keeps. */
export interface WorkbenchSnapshot {
  drawing: DrawingIdentity;
  page: number;
  stated: { ratio: string; dpi: string };
  refs: Record<string, RefDim[]>;
  cals: Record<string, Calibration>;
  measurements: Measurement[];
  items: ItemDraft[];
  adj: AdjustmentDraft;
  revision: string;
}

type StatedScale = { ratio: number; unit: 'pt' | 'px'; dpi?: number };
export interface ProjectSheet { sheetId: string; references: RefDim[]; stated?: StatedScale }
export interface ProjectMeasurement {
  id: string; kind: MeasureKind; sheetId: string; label: string; points: Pt[]; holes?: Pt[][]; depthM?: number;
  user: string; at: string; revision: string; snaps?: Array<'endpoint' | 'intersection' | 'on-line' | 'none'>;
  /** As computed when saved. Informational only: never used, compared on open. */
  quantity?: { gross: number; deductions: number; net: number };
}
export interface ProjectFile {
  format: typeof PROJECT_FORMAT;
  schemaVersion: number;
  savedAt: string;
  notice: string;
  engines: string[];
  drawing: DrawingIdentity & { embeddedBase64?: string };
  view: { page: number; stated: { ratio: string; dpi: string } };
  sheets: ProjectSheet[];
  measurements: ProjectMeasurement[];
  items: ItemDraft[];
  adjustments: AdjustmentDraft;
  revision: string;
  /** As computed when saved. Informational only: never used, compared on open. */
  computed?: { lines: Array<{ code: string; quantity: number; amount: number | null }>; grandTotal: number | null };
}

export type ProjectErrorKind = 'invalid-json' | 'foreign' | 'newer-version' | 'unsupported-version' | 'corrupt' | 'certification' | 'hash-mismatch' | 'not-recomputable' | 'too-large';
export class ProjectError extends Error {
  constructor(public kind: ProjectErrorKind, message: string) { super(message); }
}

// ------------------------------------------------------------------ BOQ from the drafts (one place, used by the workbench and here)

export function draftAdjustments(adj: AdjustmentDraft): Adjustments {
  // A field left empty is "not entered yet" (no error); a value typed in is checked (2026-11-21).
  const isBlank = (s: string | undefined) => !(s ?? '').trim();
  const notEntered = ([['prelims', 'preliminaries'], ['contingency', 'contingency'], ['ohp', 'overheads and profit'], ['vat', 'VAT'], ['vatFrom', 'VAT date']] as const)
    .filter(([k]) => isBlank(adj[k])).map(([, key]) => key);
  return { preliminaries: { kind: 'percent', pct: Number(adj.prelims || 'NaN') }, contingencyPct: Number(adj.contingency || 'NaN'), overheadsProfitPct: Number(adj.ohp || 'NaN'), vat: { pct: Number(adj.vat || 'NaN'), effectiveFrom: adj.vatFrom }, notEntered };
}
export function draftBoqItems(items: ItemDraft[], quantities: Map<string, Quantity>): BoqItem[] {
  return items.map((d) => {
    const rate = rateFromInput({ value: d.rate, kind: d.rateKind, source: d.source, date: d.date, location: d.location });
    if (d.trade) return { code: d.code, section: d.section || 'General', trade: d.trade.name, description: d.description, unit: d.trade.unit, links: [], scheduledQuantity: d.trade.scheduled, rate };
    const q = quantities.get(d.measurementId);
    return { code: d.code, section: d.section || 'General', trade: '', description: d.description, unit: q ? UNIT[q.kind] : 'item', links: [{ measurementId: d.measurementId, factor: Number(d.factor || '1') }], rate };
  });
}
export function draftBoq(items: ItemDraft[], quantities: Map<string, Quantity>, adj: AdjustmentDraft, revision: string): { boq: Boq; adj: Adjustments } | null {
  if (!items.length) return null;
  const a = draftAdjustments(adj);
  return { boq: buildBoq(draftBoqItems(items, quantities), quantities, a, revision), adj: a };
}

// ------------------------------------------------------------------ revision labels

const CLAIM_WORDS = /certif|approv|sign(?:ed|off|-off|_off|ature)|issued|endors|authori[sz]|for construction|for tender|final account/i;
/** A revision label is a short mark (A, B, P1, Rev 2). It may never claim approval or certification. */
export function revisionProblem(rev: string): string | null {
  if (CLAIM_WORDS.test(rev)) return 'A revision label cannot claim approval or certification: this workbench produces drafts only';
  if (!/^[A-Za-z0-9][A-Za-z0-9 ._-]{0,15}$/.test(rev)) return 'A revision label is 1–16 letters, digits, spaces, dots, dashes or underscores (e.g. A, B, P1)';
  return null;
}

// ------------------------------------------------------------------ base64 (drawing embedding)

export function bytesToBase64(bytes: Uint8Array): string {
  let s = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) s += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return btoa(s);
}
export function base64ToBytes(b64: string): Uint8Array {
  let bin: string;
  try { bin = atob(b64); } catch { throw new ProjectError('corrupt', 'The drawing embedded in the project file is damaged (not valid base64).'); }
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ------------------------------------------------------------------ save

export function sheetIdBelongs(sheetId: string, d: DrawingIdentity): boolean {
  const m = /^([0-9a-f]{16})#p([1-9]\d{0,4})$/.exec(sheetId);
  if (m) return m[1] === d.sha256.slice(0, 16);
  return sheetId === `img:${d.name}:${d.size}`;
}

/** Workbench state → project file. `embeddedBase64` is omitted for autosave drafts and drawings over EMBED_LIMIT_BYTES. */
export function buildProject(s: WorkbenchSnapshot, opts: { savedAt: string; embeddedBase64?: string; engines?: string[] }): ProjectFile {
  const sheetIds = [...new Set([...Object.keys(s.refs), ...Object.keys(s.cals)])];
  const sheets: ProjectSheet[] = sheetIds.map((sheetId) => {
    const cal = s.cals[sheetId];
    const references = (cal ? cal.references : s.refs[sheetId] ?? []).map((r) => ({ a: { x: r.a.x, y: r.a.y }, b: { x: r.b.x, y: r.b.y }, knownM: r.knownM }));
    const st = cal?.statedScale;
    return { sheetId, references, ...(st ? { stated: { ratio: st.ratio, unit: st.unit, ...(st.dpi !== undefined ? { dpi: st.dpi } : {}) } } : {}) };
  }).filter((x) => x.references.length > 0);
  const quantities = new Map<string, Quantity>();
  const measurements: ProjectMeasurement[] = s.measurements.map((m) => {
    const q = quantify(m);
    quantities.set(m.id, q);
    return {
      id: m.id, kind: m.kind, sheetId: m.sheetId, label: m.label, points: m.points.map((p) => ({ x: p.x, y: p.y })),
      ...(m.holes?.length ? { holes: m.holes.map((h) => h.map((p) => ({ x: p.x, y: p.y }))) } : {}),
      ...(m.depthM !== undefined ? { depthM: m.depthM } : {}),
      user: m.user, at: m.at, revision: m.revision,
      ...(m.snaps ? { snaps: [...m.snaps] } : {}),
      quantity: { gross: q.gross, deductions: q.deductions, net: q.net },
    };
  });
  const items: ItemDraft[] = s.items.map((d) => ({
    code: d.code, section: d.section, description: d.description, measurementId: d.measurementId, factor: d.factor,
    rate: d.rate, rateKind: d.rateKind, source: d.source, date: d.date, location: d.location,
    ...(d.trade ? { trade: { name: d.trade.name, unit: d.trade.unit, scheduled: { value: d.trade.scheduled.value, source: d.trade.scheduled.source }, lineCode: d.trade.lineCode, form: JSON.parse(JSON.stringify(d.trade.form)) as TradeForm } } : {}),
  }));
  const b = draftBoq(s.items, quantities, s.adj, s.revision);
  return {
    format: PROJECT_FORMAT,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    savedAt: opts.savedAt,
    notice: DRAFT_NOTICE,
    engines: opts.engines ?? [],
    drawing: { name: s.drawing.name, size: s.drawing.size, sha256: s.drawing.sha256, type: s.drawing.type, ...(opts.embeddedBase64 !== undefined ? { embeddedBase64: opts.embeddedBase64 } : {}) },
    view: { page: s.page, stated: { ratio: s.stated.ratio, dpi: s.stated.dpi } },
    sheets, measurements, items,
    adjustments: { ...s.adj },
    revision: s.revision,
    computed: b ? { lines: b.boq.lines.map((l) => ({ code: l.code, quantity: l.quantity, amount: l.amount })), grandTotal: b.boq.grandTotal } : undefined,
  };
}

// ------------------------------------------------------------------ open: strict validation

type Obj = Record<string, unknown>;
const bad = (path: string, what: string): never => { throw new ProjectError('corrupt', `The project file is damaged or was edited: ${path} ${what}.`); };
function obj(v: unknown, path: string, required: string[], optional: string[] = []): Obj {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return bad(path, 'is not an object');
  const o = v as Obj;
  for (const k of required) if (!(k in o)) bad(`${path}.${k}`, 'is missing');
  for (const k of Object.keys(o)) if (!required.includes(k) && !optional.includes(k)) bad(`${path}.${k}`, 'is not a field of this format');
  return o;
}
function str(v: unknown, path: string, max = 4000): string {
  if (typeof v !== 'string') return bad(path, 'is not text');
  if (v.length > max) bad(path, `is longer than ${max} characters`);
  return v;
}
function num(v: unknown, path: string): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return bad(path, 'is not a finite number');
  return v;
}
function int(v: unknown, path: string, min: number, max: number): number {
  const n = num(v, path);
  if (!Number.isInteger(n) || n < min || n > max) bad(path, `is not a whole number from ${min} to ${max}`);
  return n;
}
function arr(v: unknown, path: string, max: number): unknown[] {
  if (!Array.isArray(v)) return bad(path, 'is not a list');
  if (v.length > max) bad(path, `has more than ${max} entries`);
  return v;
}
function oneOf<T extends string>(v: unknown, path: string, allowed: readonly T[]): T {
  if (typeof v !== 'string' || !allowed.includes(v as T)) return bad(path, `is not one of ${allowed.join(', ')}`);
  return v as T;
}
function pt(v: unknown, path: string): Pt {
  const o = obj(v, path, ['x', 'y']);
  return { x: num(o.x, `${path}.x`), y: num(o.y, `${path}.y`) };
}
const pts = (v: unknown, path: string, max = 20000) => arr(v, path, max).map((p, i) => pt(p, `${path}[${i}]`));

/** Any key that claims an approval, certification or sign-off, anywhere in the file. */
function findClaimKey(v: unknown, path: string): string | null {
  if (Array.isArray(v)) {
    for (let i = 0; i < v.length; i++) { const r = findClaimKey(v[i], `${path}[${i}]`); if (r) return r; }
  } else if (typeof v === 'object' && v !== null) {
    for (const [k, x] of Object.entries(v as Obj)) {
      if (CLAIM_WORDS.test(k)) return `${path}.${k}`;
      const r = findClaimKey(x, `${path}.${k}`); if (r) return r;
    }
  }
  return null;
}
const CERT_REFUSED = 'This project file claims an approval or certification, which a project file can never carry: nothing in this workbench is checked or approved by a registered quantity surveyor. The file was refused.';

/** Checks a saved trade form has exactly the shape of the trade's blank form (same fields, same types). */
function sameShape(v: unknown, template: unknown, path: string): void {
  if (Array.isArray(template)) bad(path, 'has an unexpected shape');
  if (typeof template === 'string') { str(v, path); return; }
  if (typeof template === 'boolean') { if (typeof v !== 'boolean') bad(path, 'is not true/false'); return; }
  const t = template as Obj;
  const o = obj(v, path, Object.keys(t));
  for (const k of Object.keys(t)) {
    const tv = t[k];
    if (Array.isArray(tv)) {
      const el = k === 'openings' ? emptyOpening() : k === 'rooms' ? emptyRoom() : k === 'doorWidths' ? { value: '', source: '' } : null;
      if (!el) bad(`${path}.${k}`, 'is not a field of this format');
      arr(o[k], `${path}.${k}`, 500).forEach((x, i) => {
        sameShape(x, el, `${path}.${k}[${i}]`);
        if (k === 'openings') oneOf((x as Obj).type, `${path}.${k}[${i}].type`, ['door', 'window', 'other'] as const);
      });
    } else if (k === 'trade') {
      if (o[k] !== tv) bad(`${path}.trade`, 'does not match the form');
    } else sameShape(o[k], tv, `${path}.${k}`);
  }
}
function tradeForm(v: unknown, path: string): TradeForm {
  if (typeof v !== 'object' || v === null) return bad(path, 'is not an object');
  const kind = oneOf((v as Obj).trade, `${path}.trade`, Object.keys(TRADE_LABELS) as TradeKind[]);
  sameShape(v, emptyForm(kind), path);
  if (kind === 'plaster') oneOf((v as Obj).faces, `${path}.faces`, ['', '1', '2'] as const);
  return JSON.parse(JSON.stringify(v)) as TradeForm;
}

/**
 * Parses and strictly validates a project file (or an autosaved draft). Refuses
 * text that is not JSON, files of another format, newer or unknown schema
 * versions, unexpected or missing fields, and any approval/certification claim.
 * The result holds only the fields listed here: nothing else is carried over.
 */
export function parseProject(text: string): ProjectFile {
  if (text.length > MAX_PROJECT_CHARS) throw new ProjectError('too-large', `This file is larger than a project file can be (${Math.round(MAX_PROJECT_CHARS / 1048576)} MB of text). It was not opened.`);
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new ProjectError('invalid-json', 'This file is not a readable project file: it is not valid JSON (it may be damaged or truncated).'); }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw) || (raw as Obj).format !== PROJECT_FORMAT) {
    throw new ProjectError('foreign', 'This is not a Building Suite Pro take-off project file. Choose a file saved with "Save project (.json)".');
  }
  const r = raw as Obj;
  if (typeof r.schemaVersion !== 'number' || !Number.isInteger(r.schemaVersion)) bad('schemaVersion', 'is not a whole number');
  const ver = r.schemaVersion as number;
  if (ver > PROJECT_SCHEMA_VERSION) throw new ProjectError('newer-version', `This project was saved by a newer version of the workbench (project schema ${ver}); this page reads schema ${PROJECT_SCHEMA_VERSION}. Reload the page to get the latest version, then open it again. Nothing was changed.`);
  if (ver < 1) throw new ProjectError('unsupported-version', `Project schema ${ver} is not supported.`);
  if (findClaimKey(r, 'project')) throw new ProjectError('certification', CERT_REFUSED);
  const o = obj(r, 'project', ['format', 'schemaVersion', 'savedAt', 'notice', 'engines', 'drawing', 'view', 'sheets', 'measurements', 'items', 'adjustments', 'revision'], ['computed']);
  const notice = str(o.notice, 'notice');
  if (!notice.startsWith('DRAFT — not certified')) throw new ProjectError('certification', CERT_REFUSED);
  const savedAt = str(o.savedAt, 'savedAt', 40);
  if (Number.isNaN(Date.parse(savedAt))) bad('savedAt', 'is not a date');
  const engines = arr(o.engines, 'engines', 20).map((e, i) => str(e, `engines[${i}]`, 200));

  const d = obj(o.drawing, 'drawing', ['name', 'size', 'sha256', 'type'], ['embeddedBase64']);
  const drawing: ProjectFile['drawing'] = {
    name: str(d.name, 'drawing.name', 500), size: int(d.size, 'drawing.size', 1, 2 ** 40), type: str(d.type, 'drawing.type', 200),
    sha256: str(d.sha256, 'drawing.sha256', 64),
  };
  if (!/^[0-9a-f]{64}$/.test(drawing.sha256)) bad('drawing.sha256', 'is not a SHA-256 hash');
  if (d.embeddedBase64 !== undefined) {
    drawing.embeddedBase64 = str(d.embeddedBase64, 'drawing.embeddedBase64', MAX_PROJECT_CHARS);
    if (drawing.size > EMBED_LIMIT_BYTES) bad('drawing.embeddedBase64', 'is present for a drawing over the embedding limit');
  }

  const vw = obj(o.view, 'view', ['page', 'stated']);
  const vs = obj(vw.stated, 'view.stated', ['ratio', 'dpi']);
  const view = { page: int(vw.page, 'view.page', 1, 99999), stated: { ratio: str(vs.ratio, 'view.stated.ratio', 20), dpi: str(vs.dpi, 'view.stated.dpi', 20) } };

  const seenSheets = new Set<string>();
  const sheets: ProjectSheet[] = arr(o.sheets, 'sheets', 2000).map((v, i) => {
    const p = `sheets[${i}]`;
    const s = obj(v, p, ['sheetId', 'references'], ['stated']);
    const sheetId = str(s.sheetId, `${p}.sheetId`, 700);
    if (!sheetIdBelongs(sheetId, drawing)) bad(`${p}.sheetId`, 'does not belong to the project drawing');
    if (seenSheets.has(sheetId)) bad(`${p}.sheetId`, 'is repeated');
    seenSheets.add(sheetId);
    const references = arr(s.references, `${p}.references`, 10).map((x, j) => {
      const q = `${p}.references[${j}]`;
      const rf = obj(x, q, ['a', 'b', 'knownM']);
      return { a: pt(rf.a, `${q}.a`), b: pt(rf.b, `${q}.b`), knownM: num(rf.knownM, `${q}.knownM`) };
    });
    let stated: StatedScale | undefined;
    if (s.stated !== undefined) {
      const st = obj(s.stated, `${p}.stated`, ['ratio', 'unit'], ['dpi']);
      stated = { ratio: num(st.ratio, `${p}.stated.ratio`), unit: oneOf(st.unit, `${p}.stated.unit`, ['pt', 'px'] as const), ...(st.dpi !== undefined ? { dpi: num(st.dpi, `${p}.stated.dpi`) } : {}) };
    }
    return { sheetId, references, ...(stated ? { stated } : {}) };
  });

  const seenIds = new Set<string>();
  const measurements: ProjectMeasurement[] = arr(o.measurements, 'measurements', 5000).map((v, i) => {
    const p = `measurements[${i}]`;
    const m = obj(v, p, ['id', 'kind', 'sheetId', 'label', 'points', 'user', 'at', 'revision'], ['holes', 'depthM', 'snaps', 'quantity']);
    const id = str(m.id, `${p}.id`, 40);
    if (seenIds.has(id)) bad(`${p}.id`, 'is repeated');
    seenIds.add(id);
    const sheetId = str(m.sheetId, `${p}.sheetId`, 700);
    if (!seenSheets.has(sheetId)) bad(`${p}.sheetId`, 'refers to a sheet with no calibration in the file');
    const out: ProjectMeasurement = {
      id, kind: oneOf(m.kind, `${p}.kind`, ['linear', 'area', 'count', 'volume'] as const), sheetId,
      label: str(m.label, `${p}.label`, 500), points: pts(m.points, `${p}.points`),
      user: str(m.user, `${p}.user`, 200), at: str(m.at, `${p}.at`, 40), revision: str(m.revision, `${p}.revision`, 40),
    };
    if (m.holes !== undefined) out.holes = arr(m.holes, `${p}.holes`, 500).map((h, j) => pts(h, `${p}.holes[${j}]`));
    if (m.depthM !== undefined) out.depthM = num(m.depthM, `${p}.depthM`);
    if (m.snaps !== undefined) out.snaps = arr(m.snaps, `${p}.snaps`, 20000).map((x, j) => oneOf(x, `${p}.snaps[${j}]`, ['endpoint', 'intersection', 'on-line', 'none'] as const));
    if (m.quantity !== undefined) {
      const q = obj(m.quantity, `${p}.quantity`, ['gross', 'deductions', 'net']);
      out.quantity = { gross: num(q.gross, `${p}.quantity.gross`), deductions: num(q.deductions, `${p}.quantity.deductions`), net: num(q.net, `${p}.quantity.net`) };
    }
    return out;
  });

  const ITEM_TEXT = ['code', 'section', 'description', 'measurementId', 'factor', 'rate', 'source', 'date', 'location'] as const;
  const items: ItemDraft[] = arr(o.items, 'items', 5000).map((v, i) => {
    const p = `items[${i}]`;
    const it = obj(v, p, [...ITEM_TEXT, 'rateKind'], ['trade']);
    const out = { rateKind: oneOf(it.rateKind, `${p}.rateKind`, ['', ...(Object.keys(RATE_KIND_LABELS) as RateKind[])]) } as ItemDraft;
    for (const k of ITEM_TEXT) out[k] = str(it[k], `${p}.${k}`, k === 'description' || k === 'source' ? 2000 : 200);
    if (it.trade !== undefined) {
      const t = obj(it.trade, `${p}.trade`, ['name', 'unit', 'scheduled', 'lineCode', 'form']);
      const sc = obj(t.scheduled, `${p}.trade.scheduled`, ['value', 'source']);
      out.trade = {
        name: str(t.name, `${p}.trade.name`, 200), unit: oneOf(t.unit, `${p}.trade.unit`, BOQ_UNITS),
        scheduled: { value: num(sc.value, `${p}.trade.scheduled.value`), source: str(sc.source, `${p}.trade.scheduled.source`, 20000) },
        lineCode: str(t.lineCode, `${p}.trade.lineCode`, 200), form: tradeForm(t.form, `${p}.trade.form`),
      };
    }
    return out;
  });

  const a = obj(o.adjustments, 'adjustments', ['prelims', 'contingency', 'ohp', 'vat', 'vatFrom']);
  const adjustments: AdjustmentDraft = { prelims: str(a.prelims, 'adjustments.prelims', 40), contingency: str(a.contingency, 'adjustments.contingency', 40), ohp: str(a.ohp, 'adjustments.ohp', 40), vat: str(a.vat, 'adjustments.vat', 40), vatFrom: str(a.vatFrom, 'adjustments.vatFrom', 40) };
  const revision = str(o.revision, 'revision', 40);
  const rp = revisionProblem(revision);
  if (rp) {
    if (CLAIM_WORDS.test(revision)) throw new ProjectError('certification', CERT_REFUSED);
    bad('revision', `is not a valid revision label (${rp})`);
  }

  let computed: ProjectFile['computed'];
  if (o.computed !== undefined) {
    const c = obj(o.computed, 'computed', ['lines', 'grandTotal']);
    const nullableNum = (x: unknown, p: string) => (x === null ? null : num(x, p));
    computed = {
      lines: arr(c.lines, 'computed.lines', 5000).map((x, i) => { const l = obj(x, `computed.lines[${i}]`, ['code', 'quantity', 'amount']); return { code: str(l.code, `computed.lines[${i}].code`, 200), quantity: num(l.quantity, `computed.lines[${i}].quantity`), amount: nullableNum(l.amount, `computed.lines[${i}].amount`) }; }),
      grandTotal: nullableNum(c.grandTotal, 'computed.grandTotal'),
    };
  }
  return { format: PROJECT_FORMAT, schemaVersion: ver, savedAt, notice, engines, drawing, view, sheets, measurements, items, adjustments, revision, ...(computed ? { computed } : {}) };
}

// ------------------------------------------------------------------ open: re-derive everything

export interface Difference { what: string; stored: number | null; recomputed: number | null }
export interface RestoredProject {
  page: number;
  stated: { ratio: string; dpi: string };
  refs: Record<string, RefDim[]>;
  cals: Record<string, Calibration>;
  measurements: Measurement[];
  quantities: Map<string, Quantity>;
  items: ItemDraft[];
  adj: AdjustmentDraft;
  revision: string;
  savedAt: string;
  /** Where the numbers stored in the file differ from the ones recomputed here (the recomputed ones are used). */
  differences: Difference[];
  boq: { boq: Boq; adj: Adjustments } | null;
}
const same = (a: number | null, b: number | null) => (a === null || b === null ? a === b : Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)));

/**
 * Rebuilds the workbench from a validated project: calibrations from the
 * references, quantities from the points, trade quantities from the saved
 * forms, the bill from those. Throws ProjectError when the saved geometry or
 * forms cannot produce a quantity (the file is then refused, not half-opened).
 */
export function restoreProject(p: ProjectFile): RestoredProject {
  const differences: Difference[] = [];
  const refs: Record<string, RefDim[]> = {};
  const cals: Record<string, Calibration> = {};
  for (const s of p.sheets) {
    refs[s.sheetId] = s.references;
    if (s.references.length >= 2) {
      try { cals[s.sheetId] = calibrate(s.sheetId, s.references, s.stated); }
      catch (e) { throw new ProjectError('not-recomputable', `Sheet ${s.sheetId}: the saved calibration cannot be reproduced (${(e as Error).message}). The file was not opened.`); }
    }
  }
  const quantities = new Map<string, Quantity>();
  const measurements: Measurement[] = p.measurements.map((pm) => {
    const cal = cals[pm.sheetId];
    if (!cal) throw new ProjectError('not-recomputable', `${pm.id} (${pm.label}): its sheet has no complete calibration in the file. The file was not opened.`);
    const m: Measurement = {
      id: pm.id, kind: pm.kind, sheetId: pm.sheetId, label: pm.label, points: pm.points, metresPerUnit: cal.metresPerUnit,
      user: pm.user, at: pm.at, revision: pm.revision,
      ...(pm.holes ? { holes: pm.holes } : {}), ...(pm.depthM !== undefined ? { depthM: pm.depthM } : {}), ...(pm.snaps ? { snaps: pm.snaps } : {}),
    };
    let q: Quantity;
    try { q = quantify(m); } catch (e) { throw new ProjectError('not-recomputable', `${pm.id}: ${e instanceof TakeoffError ? e.message : String(e)}. The file was not opened.`); }
    quantities.set(m.id, q);
    if (pm.quantity) for (const k of ['gross', 'deductions', 'net'] as const) if (!same(pm.quantity[k], q[k])) differences.push({ what: `${pm.id} ${pm.label}: ${k} (${q.unit})`, stored: pm.quantity[k], recomputed: q[k] });
    return m;
  });
  const items: ItemDraft[] = p.items.map((d) => {
    if (!d.trade) return { ...d };
    let lines;
    try { lines = calculateTrade(d.trade.form, quantities); }
    catch (e) { throw new ProjectError('not-recomputable', `Item ${d.code}: its trade quantity cannot be recomputed from the saved measurements (${e instanceof TradeError ? e.message : String(e)}). The file was not opened.`); }
    const line = lines.find((l) => l.code === d.trade!.lineCode);
    if (!line) throw new ProjectError('not-recomputable', `Item ${d.code}: the saved trade form no longer produces line ${d.trade.lineCode}. The file was not opened.`);
    const [bi] = toBoqItems([line], d.section || 'General');
    if (!same(d.trade.scheduled.value, line.quantity)) differences.push({ what: `Item ${d.code} (${line.description}): quantity (${line.unit})`, stored: d.trade.scheduled.value, recomputed: line.quantity });
    return { ...d, trade: { name: bi.trade, unit: bi.unit, scheduled: bi.scheduledQuantity!, lineCode: d.trade.lineCode, form: d.trade.form } };
  });
  const boq = draftBoq(items, quantities, p.adjustments, p.revision);
  if (p.computed) {
    const lines = boq?.boq.lines ?? [];
    p.computed.lines.forEach((st, i) => {
      const l = lines[i];
      if (!l || l.code !== st.code) { differences.push({ what: `BOQ line ${i + 1} (${st.code}): not in the recomputed bill`, stored: st.quantity, recomputed: null }); return; }
      if (!same(st.quantity, l.quantity)) differences.push({ what: `BOQ ${l.code}: quantity (${l.unit})`, stored: st.quantity, recomputed: l.quantity });
      if (!same(st.amount, l.amount)) differences.push({ what: `BOQ ${l.code}: amount (KES)`, stored: st.amount, recomputed: l.amount });
    });
    if (!same(p.computed.grandTotal, boq?.boq.grandTotal ?? null)) differences.push({ what: 'BOQ total (KES)', stored: p.computed.grandTotal, recomputed: boq?.boq.grandTotal ?? null });
  }
  return { page: p.view.page, stated: { ...p.view.stated }, refs, cals, measurements, quantities, items, adj: { ...p.adjustments }, revision: p.revision, savedAt: p.savedAt, differences, boq };
}

/** Refuses a drawing whose SHA-256 differs from the project's. */
export function checkDrawingHash(expected: DrawingIdentity, actualSha256: string): void {
  if (actualSha256 !== expected.sha256) {
    throw new ProjectError('hash-mismatch', `That file is not this project's drawing: its SHA-256 is ${actualSha256.slice(0, 12)}…, the project needs ${expected.sha256.slice(0, 12)}… (${expected.name}, ${expected.size.toLocaleString('en-KE')} bytes). Select the exact file the project was measured on.`);
  }
}

/** The drawing embedded in a project, verified against the recorded size and SHA-256; null when it is not embedded. */
export async function extractEmbeddedDrawing(p: ProjectFile): Promise<Uint8Array | null> {
  if (p.drawing.embeddedBase64 === undefined) return null;
  const bytes = base64ToBytes(p.drawing.embeddedBase64);
  if (bytes.length !== p.drawing.size || (await sha256Hex(bytes)) !== p.drawing.sha256) {
    throw new ProjectError('hash-mismatch', 'The drawing inside the project file does not match its recorded size and SHA-256: the file is damaged or was edited. It was not opened.');
  }
  return bytes;
}

// ------------------------------------------------------------------ browser storage (autosave), every access guarded

export type StorageProblem = 'full' | 'blocked';
export const STORAGE_MESSAGES: Record<StorageProblem, string> = {
  full: "Autosave stopped: this browser's storage for the site is full, so recent changes are not autosaved. Use Save project to keep a file.",
  blocked: 'Autosave is off: this browser blocks site storage (private window or privacy settings), so nothing is autosaved. Use Save project to keep a file.',
};
export type StorageResult<T> = { ok: true; value: T } | { ok: false; problem: StorageProblem; message: string };

/** QuotaExceededError (and the older Firefox/Safari names and codes) → full; anything else (SecurityError, no storage) → blocked. */
export function classifyStorageError(e: unknown): StorageProblem {
  const x = e as { name?: string; code?: number } | null;
  if (x && (x.name === 'QuotaExceededError' || x.name === 'NS_ERROR_DOM_QUOTA_REACHED' || x.code === 22 || x.code === 1014)) return 'full';
  return 'blocked';
}
const fail = <T>(problem: StorageProblem): StorageResult<T> => ({ ok: false, problem, message: STORAGE_MESSAGES[problem] });

/** The page's localStorage; reading the property itself throws when site data is blocked. */
export function browserStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

export function guardedStorage(get: () => Storage | null | undefined = browserStorage) {
  const run = <T>(f: (s: Storage) => T): StorageResult<T> => {
    try {
      const s = get();
      if (!s) return fail('blocked');
      return { ok: true, value: f(s) };
    } catch (e) { return fail(classifyStorageError(e)); }
  };
  return {
    read: (key: string) => run((s) => s.getItem(key)),
    write: (key: string, value: string) => run((s) => { s.setItem(key, value); return undefined; }),
    remove: (key: string) => run((s) => { s.removeItem(key); return undefined; }),
  };
}
export type GuardedStorage = ReturnType<typeof guardedStorage>;

export const autosaveKey = (sha256: string) => `${AUTOSAVE_KEY_PREFIX}${sha256}`;

/** True when the snapshot holds anything worth restoring (an empty workbench never overwrites a draft). */
export function hasWork(s: Pick<WorkbenchSnapshot, 'refs' | 'measurements' | 'items'>): boolean {
  return s.measurements.length > 0 || s.items.length > 0 || Object.values(s.refs).some((r) => r.length > 0);
}

/** Writes the draft (never the drawing bytes). */
export function writeAutosave(store: GuardedStorage, s: WorkbenchSnapshot, savedAt: string, engines: string[] = []): StorageResult<undefined> {
  const p = buildProject(s, { savedAt, engines });
  return store.write(autosaveKey(s.drawing.sha256), JSON.stringify(p));
}

/** Reads the draft for a drawing: null when there is none; `error` when it exists but cannot be used. */
export function readAutosave(store: GuardedStorage, drawing: DrawingIdentity): StorageResult<{ project: ProjectFile } | { error: string } | null> {
  const r = store.read(autosaveKey(drawing.sha256));
  if (!r.ok) return r;
  if (r.value === null) return { ok: true, value: null };
  try {
    const project = parseProject(r.value);
    checkDrawingHash(drawing, project.drawing.sha256);
    return { ok: true, value: { project } };
  } catch (e) {
    return { ok: true, value: { error: e instanceof ProjectError ? e.message : String(e) } };
  }
}
