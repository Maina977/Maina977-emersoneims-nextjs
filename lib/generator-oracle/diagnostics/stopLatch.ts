/**
 * Guided Diagnosis STOP latch: the browser safety record (latched STOPs, recorded clearances,
 * answers, equipment) and the lines that carry it onto a job card.
 *
 * Moved unchanged from components/generator-oracle/panels/GuidedDiagnosisPanel.tsx (which
 * re-exports it) so the Service & Job Cards screen reads the same record (integration
 * 2026-11-26): "Record a guided diagnosis" carries EVERY latched STOP, including those whose
 * answers have since been cleared and safety-screen STOPs, and every recorded clearance.
 */
import { cleanEquipment } from './session';
import { SAFEGUARD_LABEL, UNCLASSIFIED_PROTECTIVE } from './engine';
import { FAMILIES } from './families';
import type { Equipment } from './oemReferences';
import { diagnosisRecord, recordInputs, recordSafety, recordToCardUpdate, sessionRecord, withRecordSafety, type DiagnosisRecord } from './jobCardRecord';
import type { RawAnswers } from './session';
import type { FaultFamily } from './types';
import type { ExternalStop } from './sessionSafety';
import { clearanceLine, LATCHED_STOP_PREFIX, latchedStopLine, type GuidedSafetyAdd, type GuidedSafetyStop, type JobCard } from '@/lib/generator-oracle/service/maintenance';
import { SCREEN_BUCKET } from './safetyScreen';
import { validProtectiveFields } from './refusedProtective';
import type { CardUpdate } from '@/lib/generator-oracle/service/store';

/** Browser storage key for answers, latched STOPs and the clearance record. */
export const GD_STORE = 'eims-oracle-guided-diagnosis-v1';
/** Shown with every clearance and in the record (management acceptance condition). */
export const CLEARANCE_NOT_RESTART = 'Recording a clearance only removes this software STOP. It is NOT authorisation to restart the generator or return it to service: follow the applicable OEM procedure and have a qualified technician verify the set first. Clearances recorded here are UNVERIFIED: the person is not authenticated.';

/** `label`: the safeguard label shown under the STOP, when it has one (kept from 2026-11-26). */
export type StoredLatched = { key: string; message: string; from: string; since: string; label?: string };
export type StoredClearance = StoredLatched & { clearedAt: string; by: string; reason: string; automatic?: true; field?: string; entered?: string; canonical?: string };
/**
 * Management decision (2026-11-25): when this browser blocks storage, the panel cannot read an
 * earlier unresolved STOP or keep a new one, so it shows a SAFETY HOLD. It is not a fault or
 * STOP condition of the machine. It withholds every running-engine / live instruction and the
 * Next-check prompt, exactly like a STOP hold, until an in-person reassessment by a qualified
 * technician is acknowledged. The acknowledgement lasts only for this page session: it is
 * kept in memory, never stored, and must be repeated after a reload.
 */
export const SAFETY_HOLD_TEXT = "SAFETY HOLD — Previous diagnostic safety status cannot be verified. Do not continue guided operational checks until the machine's condition has been reassessed by a qualified technician.";
export const SAFETY_HOLD_WHY = 'Why: this browser does not allow the safety record to be read or saved, so an earlier unresolved STOP for this machine cannot be ruled out. This hold is about the missing record, not a fault found on the machine.';
export const SAFETY_HOLD_ACK_LABEL = "A qualified technician has reassessed the machine's condition in person";
export const SAFETY_HOLD_SESSION_ONLY = 'This acknowledgement lasts only for this page session. It cannot be stored in this browser and must be repeated after a reload.';
const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const validLatched = (x: unknown): x is StoredLatched => !!x && typeof x === 'object' && isStr((x as StoredLatched).key) && isStr((x as StoredLatched).message) && isStr((x as StoredLatched).from) && isStr((x as StoredLatched).since);
const validClearance = (x: unknown): x is StoredClearance => validLatched(x) && isStr((x as StoredClearance).clearedAt) && isStr((x as StoredClearance).by) && typeof (x as StoredClearance).reason === 'string';
export type StoreRead = { unreadable: boolean; blocked?: true; raw?: Record<string, Record<string, string>>; equipment?: Equipment; latched: StoredLatched[]; cleared: StoredClearance[] };
/** Reads the stored safety state. Any malformed part makes the whole record unreadable (never "cleared"). */
export function readStore(): StoreRead {
  let text: string | null = null;
  // `blocked`: the browser refused the read (storage blocked), as opposed to a record that was read but is malformed.
  try { text = localStorage.getItem(GD_STORE); } catch { return { unreadable: true, blocked: true, latched: [], cleared: [] }; }
  if (text === null) return { unreadable: false, latched: [], cleared: [] };
  try {
    const s = JSON.parse(text);
    // Every part must have the exact shape the panel writes (independent review L3d/L3f: a
    // clearance without clearedAt, or a non-text answer, crashed the panel and hid the STOP).
    const rawOk = s && s.raw && typeof s.raw === 'object' && !Array.isArray(s.raw)
      && Object.values(s.raw).every((fam) => fam && typeof fam === 'object' && !Array.isArray(fam) && Object.values(fam as object).every((v) => typeof v === 'string'));
    const ok = s && typeof s === 'object' && (s.v === 1 || s.v === 2) && rawOk
      && Array.isArray(s.latched) && s.latched.every(validLatched)
      && Array.isArray(s.cleared) && s.cleared.every((c: unknown) => validClearance({ reason: '', ...(c as object) }));
    if (!ok) return { unreadable: true, latched: [], cleared: [] };
    // Equipment (1.3.0) is read in the same read; unknown models and non-text values are dropped.
    return { unreadable: false, raw: s.raw, equipment: cleanEquipment(s), latched: s.latched, cleared: s.cleared.map((c: StoredClearance) => ({ ...c, reason: c.reason ?? '' })) };
  } catch { return { unreadable: true, latched: [], cleared: [] }; }
}
export const sameStop = (a: StoredLatched, b: StoredLatched) => a.key === b.key && a.since === b.since;
/** Union of latched STOPs, minus only those with a recorded clearance for that exact STOP. */
export function mergeLatched(a: StoredLatched[], b: StoredLatched[], cleared: StoredClearance[]): StoredLatched[] {
  const out: StoredLatched[] = [];
  for (const l of [...a, ...b]) if (!out.some((x) => x.key === l.key) && !cleared.some((c) => sameStop(c, l))) out.push(l);
  return out;
}
export function mergeCleared(a: StoredClearance[], b: StoredClearance[]): StoredClearance[] {
  const out = [...a];
  for (const c of b) if (!out.some((x) => sameStop(x, c) && x.clearedAt === c.clearedAt)) out.push(c);
  return out;
}
export const UNREADABLE_STOP = (): StoredLatched => ({ key: 'storage|unreadable', from: 'stored safety record', since: new Date().toISOString(), message: 'The stored safety record in this browser could not be read or was altered, so earlier STOPs cannot be confirmed as cleared. Treat the set as stopped until a qualified technician has checked it.' });

/** Safeguard label for a STOP message: the one stored with it, else the one its rule carries. */
export function labelFor(l: StoredLatched): string | undefined {
  if (typeof l.label === 'string' && l.label.trim()) return l.label;
  if (l.message === UNCLASSIFIED_PROTECTIVE) return SAFEGUARD_LABEL;
  for (const f of FAMILIES) for (const r of f.stopRules) if (r.message === l.message && r.label) return r.label;
  return undefined;
}

/**
 * The job-card lines for the stored safety record: every latched STOP (with source tab, since
 * time, its wording and safeguard label), then every recorded clearance (UNVERIFIED). Blocked
 * storage gives the SAFETY HOLD; an unreadable record gives its STOP.
 */
export function latchRecordLines(s: StoreRead = readStore()): string[] {
  const out: string[] = [];
  if (s.blocked) out.push(SAFETY_HOLD_TEXT, SAFETY_HOLD_WHY);
  else {
    for (const l of s.unreadable ? [UNREADABLE_STOP()] : s.latched) {
      out.push(latchedStopLine(l));
      const label = labelFor(l);
      if (label) out.push(label);
    }
    if (!s.unreadable) for (const c of s.cleared) out.push(clearanceLine(c));
  }
  // R-INT-1: the safety state travels with the lines (not enumerable; a copy of the array drops it),
  // so withLatchedStops() can rebuild the record body under these STOPs.
  Object.defineProperty(out, LINES_STATE, { value: safetyStateOf(s), enumerable: false });
  return out;
}

/** The guided record with the stored safety record first. A latched STOP (or the hold) makes it a STOP record. */
export function withLatchedStops(rec: DiagnosisRecord, lines: string[]): DiagnosisRecord {
  // R-INT-1: lines from latchRecordLines() and a record from diagnosisRecord()/sessionRecord() carry
  // their inputs, so the body is rebuilt with every uncleared latched STOP (and the SAFETY HOLD) as
  // external STOPs: no running check and no running-only Next check under a latch or the hold.
  const st = (lines as unknown as Record<symbol, SafetyState | undefined>)[LINES_STATE];
  const inp = recordInputs(rec);
  if (st && inp) return guardCore((extra) => diagnosisRecord(inp.family, inp.raw, inp.equipment, inp.session, [...inp.extraStops, ...extra]), st, inp.family).record;
  return prefixLines(rec, lines);
}
function prefixLines(rec: DiagnosisRecord, lines: string[]): DiagnosisRecord {
  if (!lines.length) return rec;
  const active = lines.some((l) => l.startsWith(LATCHED_STOP_PREFIX) || l === SAFETY_HOLD_TEXT);
  const out: DiagnosisRecord = {
    ...rec,
    lines: [...lines, ...rec.lines],
    findings: [...lines, rec.findings].join('\n'),
    result: { ...rec.result, stopActive: rec.result.stopActive || active },
  };
  const safety = recordSafety(rec);
  return safety ? withRecordSafety(out, safety) : out;
}

/**
 * Integration review R-INT-1/2/3 (2026-11-26). The safety state a record is made under: every
 * latched STOP, every recorded clearance, and whether the SAFETY HOLD applies (storage blocked).
 */
export interface SafetyState { latched: StoredLatched[]; cleared: StoredClearance[]; hold: boolean }
export function safetyStateOf(s: StoreRead): SafetyState {
  if (s.blocked) return { latched: [], cleared: [], hold: true };
  if (s.unreadable) return { latched: [UNREADABLE_STOP()], cleared: [], hold: false };
  return { latched: s.latched, cleared: s.cleared, hold: false };
}
/** The family name the SAFETY HOLD is passed to the engine under (its lines are then taken out of the record). */
export const HOLD_FROM = 'SAFETY HOLD';
const LINES_STATE = Symbol.for('eims.oracle.latchLinesState');
const HOLD_RAISED = `(Raised in the "${HOLD_FROM}" diagnosis of this session.)`;

export interface GuardedRecord {
  record: DiagnosisRecord;
  /** True when only the SAFETY HOLD (no STOP) applies: the record is worded as a hold, not as a STOP. */
  holdOnly: boolean;
  /** What "Record a guided diagnosis" adds to the card's structured safety record (R-INT-2). */
  safety: GuidedSafetyAdd;
}

/**
 * R-INT-1: the record for one family, made under the safety state. Every latched STOP with no
 * recorded clearance that the answers no longer show (cleared answers, other tabs, the safety
 * screen) and the SAFETY HOLD are passed to diagnose() as external STOPs, so the record body,
 * the job card, the .txt and the PDF offer no running check and no running-only Next check.
 * The latch lines (latched STOPs, clearances, or the hold) are written first.
 */
export function guardedSessionRecord(family: FaultFamily, session: RawAnswers, equipment: Equipment, st: SafetyState): GuardedRecord {
  return guardCore((extra) => sessionRecord(family, session, equipment, extra), st, family);
}

function guardCore(build: (extra: ExternalStop[]) => DiagnosisRecord, st: SafetyState, family: FaultFamily): GuardedRecord {
  const base = build([]);
  const shown = new Set(base.result.stops.filter((s) => s.level === 'STOP').map((s) => s.message));
  const open = st.latched.filter((l) => !st.cleared.some((c) => sameStop(c, l)));
  const extra: ExternalStop[] = open.filter((l) => !shown.has(l.message)).map((l) => {
    const label = labelFor(l);
    return { family: l.from, message: l.message, ...(label ? { label } : {}) };
  });
  if (st.hold) extra.push({ family: HOLD_FROM, message: SAFETY_HOLD_TEXT });
  let rec = extra.length ? build(extra) : base;
  const holdOnly = st.hold && open.length === 0 && !base.result.stopActive;
  if (st.hold) {
    // R-INT-3: the hold is never worded as a STOP: its engine STOP line is taken out (the hold
    // text itself is written first, below), and a hold-only record says "the SAFETY HOLD applies".
    const word = (l: string) => (holdOnly ? l.replace(/a STOP is active/g, 'the SAFETY HOLD applies').replace(/the STOP above applies/g, 'the SAFETY HOLD applies') : l);
    const kept = rec.lines.filter((l) => l !== `STOP: ${SAFETY_HOLD_TEXT}` && l !== HOLD_RAISED).map(word);
    rec = { ...rec, lines: kept, findings: kept.join('\n') };
  }
  // A plain copy (no safety state attached), so prefixLines() only adds the lines.
  const latchLines = [
    ...(st.hold ? [SAFETY_HOLD_TEXT, SAFETY_HOLD_WHY] : []),
    ...latchRecordLines({ unreadable: false, latched: st.latched, cleared: st.cleared }),
  ];
  const strip = (l: StoredLatched) => { const label = labelFor(l); return { key: l.key, from: l.from, since: l.since, message: l.message, ...(label ? { label } : {}) }; };
  const safety: GuidedSafetyAdd = {
    // R-INT-6: the record's own STOPs (from the diagnosis the record is built from) go on the card too,
    // so a card never carries a STOP line without a structured STOP, even if the browser has not latched it.
    stops: [...st.latched.map(strip), ...recordStops(base, family).filter((r) => !st.latched.some((l) => l.key === r.key && !st.cleared.some((c) => sameStop(c, l))))],
    clearances: st.cleared.map((c) => ({ ...strip(c), clearedAt: c.clearedAt, by: c.by, reason: c.reason, ...(c.automatic ? { automatic: true as const, field: c.field, entered: c.entered, canonical: c.canonical } : {}) })),
    hold: st.hold ? { text: SAFETY_HOLD_TEXT, why: SAFETY_HOLD_WHY } : null,
    family: family.id,
    validFields: (() => { const inp = recordInputs(base); return validProtectiveFields(family, inp?.raw, base.result.invalid); })(),
  };
  return { record: withRecordSafety(prefixLines(rec, latchLines), { add: safety, holdOnly }), holdOnly, safety };
}

/** The STOPs a record's own diagnosis shows, keyed as the panel latches them (R-INT-6). */
function recordStops(rec: DiagnosisRecord, family: FaultFamily): GuidedSafetyStop[] {
  const since = new Date().toISOString();
  const out: GuidedSafetyStop[] = [];
  for (const s of rec.result.stops) {
    if (s.level !== 'STOP') continue;
    const other = s.origin === 'other-family' ? FAMILIES.find((f) => f.title === s.from) : undefined;
    const stop: GuidedSafetyStop = s.origin === 'screen'
      ? { key: `${SCREEN_BUCKET}|${s.message}`, from: 'Safety screen', since, message: s.message, fromRecord: true }
      : { key: `${(other ?? family).id}|${s.message}`, from: s.from ?? family.title, since, message: s.message, fromRecord: true };
    if (s.label) stop.label = s.label;
    if (s.refusedInput) stop.refusedInput = true;
    if (s.refusedFields?.length) stop.fields = [...s.refusedFields];
    if (!out.some((x) => x.key === stop.key)) out.push(stop);
  }
  return out;
}

/** The findings/readings update for a guarded record (hold wording for a hold-only record, R-INT-3). */
export function guardedCardUpdate(card: Pick<JobCard, 'findings' | 'readings'> & Partial<Pick<JobCard, 'guidedSafety'>>, g: GuardedRecord): CardUpdate {
  const { guidedSafety: _structured, ...u } = recordToCardUpdate(card, g.record);
  void _structured; // set on the card by the recordGuidedSafety action, never through a card edit
  return u;
}
