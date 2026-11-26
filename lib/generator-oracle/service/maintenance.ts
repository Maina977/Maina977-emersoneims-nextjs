/**
 * Generator Oracle: maintenance planning and workshop job cards (P1, 2026-11-20).
 *
 * - Intervals are never built in. Each plan task cites the OEM manual
 *   (document, edition, page) it comes from.
 * - Due status uses engine hours or calendar months, whichever comes first.
 *   A task with no recorded history is DUE (status unknown), never "OK".
 * - Job cards follow a fixed status flow. Completion needs test-run readings,
 *   and sign-off needs a named supervisor other than the technician.
 * - Parts list their compatibility source (OEM parts book / page). Without one
 *   a part is flagged "compatibility unverified" and blocks sign-off.
 * - Readings outside the limits given for that set (from its rating plate or
 *   manual) are flagged. The engine does not invent limits.
 * - There are no user accounts yet. Every name (technician, status steps,
 *   supervisor sign-off) is TYPED and NOT verified. The last step is therefore
 *   called SIGN-OFF RECORDED — NOT VERIFIED (typed name) everywhere, including
 *   the saved data; it is never an approval, a signature or a certified record.
 * - A card at that step is locked. It changes only through reopenJobCard(),
 *   which needs who, when and a reason, starts a new revision and needs a fresh
 *   sign-off. The earlier sign-off stays in the card's history.
 * - A SHA-256 hash of the card content is recorded at sign-off, so a later
 *   change shows as "changed after sign-off". Anyone can recompute a hash, so
 *   it detects changes but proves nothing about who signed.
 */
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { UNIT_OPTIONS, unitKindOf } from '@/lib/generator-oracle/diagnostics/units';
import type { Question } from '@/lib/generator-oracle/diagnostics/types';
import { sha256Hex } from './sha256';

export const SERVICE_ENGINE_VERSION = 'oracle-service 1.1.0 (2026-11-21)';

/** Shown on the screen and in every job-card report and export. */
export const TYPED_SIGNOFF_NOTICE = 'Sign-off recorded by typed name — not an authenticated signature. Not valid as a certified record until reviewer accounts exist.';
export const TYPED_NAMES_NOTICE = 'All names on this card (technician, status steps, sign-off) are typed in and not verified.';
/**
 * Safety withdrawal 2026-11-25 (review finding S9): the Guided Diagnosis STOP latch
 * is not carried onto the card. Wording only: shown at the top of the job-card
 * screen and as the first notice of every .txt / PDF report.
 */
/**
 * Review R1 (2026-11-25): a set with an unresolved STOP must not be test-run, so a card whose
 * findings record this phrase completes and signs off without test-run readings.
 */
/** The old free-text phrase. F10-R3: it satisfies NOTHING any more (kept so tests can prove that). Never generated. */
export const READINGS_NOT_TAKEN_STOP = 'Readings not taken: STOP in force';
/** True when the card records an unresolved STOP (the phrase above in its findings). */
/**
 * F10-R3 (2026-11-26): "readings not taken — STOP in force" is a STRUCTURED technician action on the
 * card (typed name + confirmation, UNVERIFIED, append-only in guidedSafety, in the sign-off hash). The
 * phrase appearing anywhere in the findings text (typed, pasted or generated) satisfies nothing.
 * Imported card: only an entry recorded on this device after the import counts.
 */
export const NOT_TAKEN_ACTION = 'readings not taken — STOP in force';
export const NOT_TAKEN_PROMPT = `record "${NOT_TAKEN_ACTION}" on the job card`;
export function recordsStopInForce(card: Pick<JobCard, 'findings'> & Partial<Pick<JobCard, 'guidedSafety' | 'imported'>>): boolean {
  const all = card.guidedSafety?.notTaken ?? [];
  const imp = card.imported;
  const fresh = imp ? all.slice(imp.notTaken ?? 0).filter((e) => e.at >= imp.at) : all;
  return fresh.length > 0;
}
/** Appends the structured action (typed name, confirmation; UNVERIFIED). */
export function recordNotTaken(prev: GuidedSafety | undefined, r: { at: string; by: string; confirmed: boolean }): GuidedSafety {
  const by = r.by.trim();
  if (!r.confirmed) throw new Error(`Not recorded: confirm "${NOT_TAKEN_ACTION}" (no test-run readings were taken because a STOP is in force)`);
  if (!by) throw new Error('Not recorded: enter the name or initials of the technician');
  if (Number.isNaN(Date.parse(r.at))) throw new Error('When is required');
  const g: GuidedSafety = prev ? { ...prev } : { stops: [], clearances: [], holds: [] };
  g.notTaken = [...(prev?.notTaken ?? []), { at: r.at, by: by.slice(0, 60), confirmed: true }];
  return g;
}
export function notTakenLine(e: { at: string; by: string }): string {
  return `Recorded: ${NOT_TAKEN_ACTION} — by ${e.by} (typed name, UNVERIFIED) at ${e.at} (UTC). No test-run readings were taken.`;
}
/**
 * Integration 2026-11-26: every STOP latched on the Guided Diagnosis screen (and every recorded
 * clearance) is carried onto the card by "Record a guided diagnosis", one line each. The lines
 * start with "STOP" so the report repeats them in its first SAFETY section.
 */
export const LATCHED_STOP_PREFIX = 'STOP — still latched — no recorded clearance.';
export const CLEARANCE_RECORD_PREFIX = 'STOP CLEARANCE RECORDED — UNVERIFIED';
export interface LatchedStopRef { from: string; since: string; message: string }
/**
 * `automatic` (2026-11-26): a refused-value hold released because a valid value was entered. It is
 * NOT a clearance by a person: it prints as its own line type and resolves only that hold.
 */
export interface AutoRelease { automatic?: true; field?: string; entered?: string; canonical?: string }
export interface ClearanceRef extends LatchedStopRef, AutoRelease { clearedAt: string; by: string; reason: string }
export const AUTO_RELEASE_PREFIX = 'Refused-value hold released automatically';
/** The line for an automatic release (panel, job card, .txt, PDF). Never worded as a clearance. */
export function autoReleaseLine(c: ClearanceRef): string {
  return `${AUTO_RELEASE_PREFIX}: a valid value was entered (${oneLine(c.field ?? '')} = ${oneLine(c.entered ?? '')}, converted ${oneLine(c.canonical ?? '')}) at ${c.clearedAt}. No person recorded a clearance. Source: ${oneLine(c.from)} tab. Since: ${c.since} (UTC).`;
}
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();
export function latchedStopLine(l: LatchedStopRef): string {
  return `${LATCHED_STOP_PREFIX} Source: ${oneLine(l.from)} tab. Since: ${l.since} (UTC). ${oneLine(l.message)}`;
}
export function clearanceLine(c: ClearanceRef): string {
  if (c.automatic) return autoReleaseLine(c);
  return `${CLEARANCE_RECORD_PREFIX} (typed name, not authenticated; NOT authorisation to restart the generator): Source: ${oneLine(c.from)} tab. Since: ${c.since} (UTC). Cleared: ${c.clearedAt} (UTC) by ${oneLine(c.by)}. Reason: ${oneLine(c.reason) || '(not recorded)'}. STOP was: ${oneLine(c.message)}`;
}
const LATCH_ID = /^STOP — still latched — no recorded clearance\. Source: (.+?) tab\. Since: (\S+) \(UTC\)\./;
const CLEAR_ID = /^STOP CLEARANCE RECORDED — UNVERIFIED .*?: Source: (.+?) tab\. Since: (\S+) \(UTC\)\./;
/** An automatic release resolves only a refused-value hold line (its own STOP text says so). */
const AUTO_ID = /^Refused-value hold released automatically: .* Source: (.+?) tab\. Since: (\S+) \(UTC\)\.$/;
/** Latched STOPs recorded in the findings with no clearance line for the same STOP (source + since). */
export function unresolvedLatchedStops(card: Pick<JobCard, 'findings'>): string[] {
  const lines = (card.findings || '').split(/\r?\n/);
  const cleared = new Set(lines.map((l) => CLEAR_ID.exec(l)).filter(Boolean).map((m) => `${m![1]}|${m![2]}`));
  const auto = new Set(lines.map((l) => AUTO_ID.exec(l)).filter(Boolean).map((m) => `${m![1]}|${m![2]}`));
  const out: string[] = [];
  for (const l of lines) {
    const m = LATCH_ID.exec(l);
    const autoReleased = !!m && auto.has(`${m[1]}|${m[2]}`) && /protective value refused \(.*\): value removed or refused/.test(l);
    if (m && !cleared.has(`${m[1]}|${m[2]}`) && !autoReleased && !out.includes(l)) out.push(l);
  }
  return out;
}
/**
 * Integration review R-INT-2 (2026-11-26): the Guided Diagnosis safety state carried onto a card
 * as structured data that the card editor cannot change (it is not part of CardUpdate; the
 * store only ever adds to it). Completion and sign-off read THIS, not the editable findings text.
 */
/**
 * `fromRecord` (review R-INT-6): a STOP that the record's own diagnosis showed when the card was
 * made (it may not have been latched in the browser yet). It is resolved by any later recorded
 * clearance of the same STOP (same key), made at or after it was recorded.
 */
export interface GuidedSafetyStop {
  key: string; from: string; since: string; message: string; label?: string; fromRecord?: true;
  /**
   * F10-REMAINING (2026-11-26): a STOP raised because a protective value was refused (no unit, not a
   * number, out of range or band). It blocks completion and sign-off until a later guided-diagnosis
   * record on this card no longer shows it (the value was corrected) — `correctedAt` — or the phrase.
   */
  refusedInput?: true; correctedAt?: string;
  /** F10-R2: the field(s) whose refused value raised it; it is corrected only when a later record holds them all valid. */
  fields?: string[];
}
export interface GuidedSafetyClearance extends GuidedSafetyStop, AutoRelease { clearedAt: string; by: string; reason: string }
/** R-INT-3: the SAFETY HOLD (browser storage blocked) is its own record, never worded as a STOP. */
export interface GuidedSafetyHold { since: string; text: string; why: string; resolvedAt?: string }
/**
 * Review R-INT-7: the only way (besides recording "readings not taken — STOP in force") to resolve a SAFETY
 * HOLD on a card: an in-person reassessment recorded ON THE CARD. Typed name, UNVERIFIED.
 */
export interface GuidedSafetyReassessment { at: string; by: string; reason: string; confirmed: true }
export interface GuidedSafety {
  stops: GuidedSafetyStop[]; clearances: GuidedSafetyClearance[]; holds: GuidedSafetyHold[]; reassessments?: GuidedSafetyReassessment[];
  /** F10-R3: the structured "readings not taken — STOP in force" actions (append-only). */
  notTaken?: Array<{ at: string; by: string; confirmed: true }>;
}
/** What one "Record a guided diagnosis" adds: the browser's latched STOPs, the record's own STOPs, its clearances, and the hold if storage was blocked. */
export interface GuidedSafetyAdd {
  stops: GuidedSafetyStop[]; clearances: GuidedSafetyClearance[]; hold: { text: string; why: string } | null;
  /** The fault family the record was made for. */ family?: string;
  /** F10-R2: the protective fields of that family that hold a VALID value in this record. */ validFields?: string[];
}
export const HOLD_REASSESSMENT_LABEL = "A qualified technician has reassessed the machine's condition in person";
export const HOLD_REASSESSMENT_NOTICE = 'Recorded on this card by typed name: UNVERIFIED (the person is not authenticated). It releases the SAFETY HOLD on this card only; it is NOT authorisation to restart the generator.';
const sameGuidedStop = (a: GuidedSafetyStop, b: GuidedSafetyStop) => a.key === b.key && a.since === b.since;
/** An automatic release is not a person's clearance: it resolves only the refused-value hold it was made for. */
const isRefusedHoldKey = (k: string) => k.includes('|refused-value|');
const clears = (c: GuidedSafetyClearance, s: GuidedSafetyStop) => (c.automatic
  ? isRefusedHoldKey(s.key) && sameGuidedStop(c, s)
  : sameGuidedStop(c, s) || (!!s.fromRecord && c.key === s.key && c.clearedAt >= s.since));
/** A refused-input STOP is resolved when a later record on the card no longer shows it (the value was corrected). */
const corrected = (s: GuidedSafetyStop, since?: string) => !!s.refusedInput && !!s.correctedAt && (!since || s.correctedAt >= since);
/**
 * Merge-only: nothing already on the card is removed. A hold stays until an in-person
 * reassessment is recorded on the card (R-INT-7: a later record never resolves it).
 */
export function mergeGuidedSafety(prev: GuidedSafety | undefined, add: GuidedSafetyAdd, at: string): GuidedSafety {
  const stops = [...(prev?.stops ?? [])];
  const clearances = [...(prev?.clearances ?? [])];
  for (const c of add.clearances) if (!clearances.some((x) => sameGuidedStop(x, c) && x.clearedAt === c.clearedAt)) clearances.push({ ...c });
  const open = (x: GuidedSafetyStop) => !clearances.some((c) => clears(c, x));
  // A record's own STOP is not added again while the card already holds that STOP unresolved.
  // F10-REMAINING: a refused-input STOP that a later record no longer shows was corrected (append-only mark).
  for (let i = 0; i < stops.length; i++) {
    const x = stops[i];
    // Only a later record for the same fault family can show the value was corrected.
    // F10-R2: corrected only when the later record holds THAT field again with a valid value (a blank,
    // missing or still-refused field never counts).
    if (x.refusedInput && !x.correctedAt && add.family && x.key.startsWith(`${add.family}|`) && x.fields?.length && x.fields.every((f) => add.validFields?.includes(f)) && !add.stops.some((s) => s.key === x.key)) stops[i] = { ...x, correctedAt: at };
  }
  for (const s of add.stops) if (!stops.some((x) => sameGuidedStop(x, s) || (s.fromRecord && x.key === s.key && open(x) && !corrected(x)))) stops.push({ ...s });
  // A clearance always comes with its STOP, so a card never shows a clearance for a STOP it does not list.
  for (const c of add.clearances) if (!stops.some((x) => sameGuidedStop(x, c))) stops.push({ key: c.key, from: c.from, since: c.since, message: c.message, ...(c.label ? { label: c.label } : {}) });
  const holds = (prev?.holds ?? []).map((h) => ({ ...h }));
  if (add.hold && !holds.some((h) => !h.resolvedAt)) holds.push({ since: at, text: add.hold.text, why: add.hold.why });
  return { stops, clearances, holds, ...(prev?.reassessments ? { reassessments: prev.reassessments.map((r) => ({ ...r })) } : {}), ...(prev?.notTaken ? { notTaken: prev.notTaken.map((e) => ({ ...e })) } : {}) };
}
/** R-INT-7: an in-person reassessment recorded on the card resolves its open SAFETY HOLD (append-only). */
export function recordHoldReassessment(prev: GuidedSafety | undefined, r: { at: string; by: string; reason: string; confirmed: boolean }, opts: { imported?: CardImport } = {}): GuidedSafety {
  const g: GuidedSafety = prev ? { ...prev, holds: prev.holds.map((h) => ({ ...h })) } : { stops: [], clearances: [], holds: [] };
  // Safety review (imported cards): an imported card needs a fresh in-person reassessment on this device, hold or not.
  if (!opts.imported && !g.holds.some((h) => !h.resolvedAt)) throw new Error('No unresolved SAFETY HOLD is recorded on this card');
  const by = r.by.trim(); const reason = r.reason.trim();
  if (!r.confirmed) throw new Error(`Not released: confirm that "${HOLD_REASSESSMENT_LABEL}"`);
  if (!by) throw new Error('Not released: enter the name or initials of the qualified technician');
  if (reason.length < 10) throw new Error('Not released: state what was checked (at least 10 characters)');
  if (Number.isNaN(Date.parse(r.at))) throw new Error('When is required to record the reassessment');
  g.holds = g.holds.map((h) => (h.resolvedAt ? h : { ...h, resolvedAt: r.at }));
  g.reassessments = [...(prev?.reassessments ?? []), { at: r.at, by: by.slice(0, 60), reason: reason.slice(0, 500), confirmed: true }];
  return g;
}
/**
 * The card's latched STOPs with no recorded clearance, and whether a SAFETY HOLD is unresolved.
 * Imported card (safety review, imported job cards): a clearance, a reassessment or a resolved hold
 * that came in the imported file is NOT proof here. Only a clearance recorded on this device after
 * the import resolves a STOP (same STOP key), and only a reassessment recorded on this device after
 * the import resolves a hold. Imported STOPs only add restrictions. `asRecorded` gives the card's
 * own record as written (used by the file-consistency check, never for completion or sign-off).
 */
export function unresolvedGuidedSafety(card: Pick<JobCard, 'guidedSafety'> & Partial<Pick<JobCard, 'imported'>>, opts: { asRecorded?: boolean } = {}): { stops: GuidedSafetyStop[]; hold: GuidedSafetyHold | null } {
  const g = card.guidedSafety;
  if (!g) return { stops: [], hold: null };
  const imp = opts.asRecorded ? undefined : card.imported;
  if (!imp) return { stops: g.stops.filter((s) => !corrected(s) && !g.clearances.some((c) => clears(c, s))), hold: g.holds.find((h) => !h.resolvedAt) ?? null };
  // Only a PERSON's clearance recorded on this device after the import resolves an imported STOP.
  const fresh = g.clearances.slice(imp.clearances).filter((c) => !c.automatic);
  const freshReassessed = (g.reassessments ?? []).slice(imp.reassessments).some((r) => r.at >= imp.at);
  const stops = g.stops.filter((s, i) => {
    if (i < imp.stops) return !corrected(s, imp.at) && !fresh.some((c) => c.key === s.key && c.clearedAt >= imp.at);
    return !corrected(s) && !fresh.some((c) => clears(c, s));
  });
  const hold = g.holds.find((h, i) => (i < imp.holds ? !freshReassessed : !h.resolvedAt)) ?? null;
  return { stops, hold };
}

/**
 * Safety review (imported job cards, CRITICAL): an imported file is never proof that a STOP was
 * resolved. Every card read from an imported file is marked here (outside the signed content, so
 * the file's own consistency checks are unchanged). Completion and sign-off then need a FRESH
 * assessment on this device after the import: a new Guided Diagnosis record with no unresolved STOP
 * or SAFETY HOLD, or the recorded "readings not taken — STOP in force" action; AND a fresh in-person reassessment.
 */
export interface CardImport {
  at: string;
  /** How many of each were on the card when it was imported (they stay visible as IMPORTED — UNVERIFIED). */
  stops: number; clearances: number; holds: number; reassessments: number;
  /** F10-R3: structured "readings not taken" actions in the file (never counted here). */
  notTaken?: number;
  /** The card was at the sign-off step (or had a sign-off) in the imported file. */
  signedOff: boolean;
  /** A Guided Diagnosis record added on this device after the import, and whether it carried no unresolved STOP or hold. */
  freshRecordAt?: string; freshRecordClean?: boolean;
  /** A fresh in-person reassessment recorded on this device after the import. */
  reassessedAt?: string;
}
export const IMPORTED_NOTICE = 'IMPORTED — UNVERIFIED: this card came from an imported file. Its STOPs, clearances and reassessments are shown as imported and unverified; an imported file is never proof that a STOP was resolved.';
export const DEVICE_ONLY_NOTICE = 'Safety status is held on this device only. A clearance recorded on another device is not known here and is not established.';
export const SIGNED_OFF_ELSEWHERE = 'signed off on another device — UNVERIFIED here';
export function markImported(card: JobCard, at: string): JobCard {
  const g = card.guidedSafety;
  return {
    ...card,
    imported: {
      at,
      stops: g?.stops.length ?? 0, clearances: g?.clearances.length ?? 0, holds: g?.holds.length ?? 0, reassessments: g?.reassessments?.length ?? 0, notTaken: g?.notTaken?.length ?? 0,
      signedOff: card.status === SIGNOFF || card.log.some((l) => l.to === SIGNOFF),
    },
  };
}
const importedBlocker = (card: Pick<JobCard, 'findings' | 'imported'>): string | null => {
  const imp = card.imported;
  if (!imp) return null;
  const e: string[] = [];
  if (!(imp.freshRecordClean || recordsStopInForce(card))) e.push(`a fresh Guided Diagnosis record added on this device with no unresolved STOP or SAFETY HOLD, or ${NOT_TAKEN_PROMPT} on this device`);
  if (!imp.reassessedAt) e.push('a fresh in-person reassessment recorded on this card on this device');
  return e.length ? `${e.join(', and ')} (IMPORTED — UNVERIFIED card: an imported file is never proof that a STOP was resolved)` : null;
};
const latchedStopBlocker = (card: Pick<JobCard, 'findings' | 'guidedSafety'> & Partial<Pick<JobCard, 'imported'>>, opts: { asRecorded?: boolean } = {}): string | null => {
  if (recordsStopInForce(card)) return null;
  const u = unresolvedGuidedSafety(card, opts);
  if (u.stops.length) return `${NOT_TAKEN_PROMPT.replace(/^record /, 'the recorded action ')} (${u.stops.length} Guided Diagnosis STOP(s) recorded on this card are still latched with no recorded clearance; record the clearance on Guided Diagnosis and record the diagnosis again, or record that action)`;
  if (u.hold) return `${NOT_TAKEN_PROMPT.replace(/^record /, 'the recorded action ')} (a SAFETY HOLD is recorded on this card: the previous diagnostic safety status could not be verified; record an in-person reassessment on this card, or record that action)`;
  // Also the findings text (8041e0b0): a latched line in the findings without a clearance line still blocks.
  return unresolvedLatchedStops(card).length
    ? `${NOT_TAKEN_PROMPT.replace(/^record /, 'the recorded action ')} (a Guided Diagnosis STOP is still latched with no recorded clearance; record the clearance, or record that action)`
    : null;
};
export const STOP_NOT_CARRIED_NOTICE = 'Generator Oracle cannot confirm a set is safe to run. A STOP from Guided Diagnosis is kept only in this browser — record it on this card. Do not test-run a set with an unresolved STOP.';

/**
 * Real-project test D6 (2026-11-26): the job-specific test-run checklist. Completion used to accept
 * any single reading (even one with no limit). Now the card needs, unless the structured
 * "readings not taken — STOP in force" action is recorded:
 *  - the engine test-run readings every generator test run takes, from the Guided Diagnosis question
 *    definitions: oil pressure, coolant temperature, output voltage and frequency;
 *  - for every fault family diagnosed on this card (its Guided Diagnosis record or its STOPs), that
 *    family's protective readings (the readings of its protective limits).
 * Each needs a value and a unit of the right kind. No limit is invented: a reading without a limit is
 * printed "NOT VERIFIED, not a pass". The file-consistency check of saved cards is unchanged.
 */
interface RequiredReading { family: string; id: string; text: string; units: string[]; match?: RegExp }
/** The engine test-run readings, with the words a technician uses for them on a card. */
const BASE_TEST_RUN: Array<[string, string, RegExp]> = [['low-oil-pressure', 'oilPressure', /oil\s*pressure/i], ['overheating', 'coolantTemp', /coolant/i], ['no-voltage', 'voltage', /volt/i], ['no-voltage', 'frequency', /freq|\bhz\b/i]];
const unitsOf = (q: Question): string[] => {
  const kind = unitKindOf(q);
  return kind ? [...UNIT_OPTIONS[kind]] : q.kind === 'number' ? [q.unit] : [];
};
const required = (familyId: string, id: string): RequiredReading | null => {
  const q = FAMILIES.find((f) => f.id === familyId)?.questions.find((x) => x.id === id);
  return q && q.kind === 'number' ? { family: familyId, id, text: q.text, units: unitsOf(q) } : null;
};
/** Fault families diagnosed on this card: its Guided Diagnosis records ("[family-id]") and its structured STOPs. */
export function cardFamilies(card: Pick<JobCard, 'findings' | 'guidedSafety'>): string[] {
  const ids = new Set<string>();
  for (const m of card.findings.matchAll(/^GUIDED DIAGNOSIS: .* \[([a-z0-9-]+)\] —/gm)) ids.add(m[1]);
  for (const st of card.guidedSafety?.stops ?? []) ids.add(st.key.split('|')[0]);
  return [...ids].filter((id) => FAMILIES.some((f) => f.id === id));
}
export function requiredTestRunReadings(card: Pick<JobCard, 'findings' | 'guidedSafety'>): RequiredReading[] {
  const out: RequiredReading[] = [];
  const add = (r: RequiredReading | null) => { if (r && !out.some((x) => x.id === r.id)) out.push(r); };
  for (const [f, id, match] of BASE_TEST_RUN) { const r = required(f, id); add(r ? { ...r, match } : null); }
  for (const fid of cardFamilies(card)) {
    const fam = FAMILIES.find((f) => f.id === fid)!;
    for (const l of (fam.limits ?? []).filter((x) => x.protective)) add(required(fid, l.reading));
  }
  return out;
}
const words = (t: string) => t.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
/** A card reading matches a required one when its name holds the question text or its first two words. */
const readingMatches = (r: Reading, q: RequiredReading) => {
  const name = r.name.toLowerCase();
  const w = words(q.text);
  return (q.match ? q.match.test(r.name) : false) || name.includes(q.text.toLowerCase()) || (w.length >= 2 ? name.includes(`${w[0]} ${w[1]}`) : name.includes(w[0]));
};
export function missingTestRunReadings(card: Pick<JobCard, 'findings' | 'guidedSafety' | 'readings'>): string[] {
  return requiredTestRunReadings(card).filter((q) => !card.readings.some((r) => readingMatches(r, q) && Number.isFinite(r.value) && q.units.some((u) => u.toLowerCase() === r.unit.trim().toLowerCase())))
    .map((q) => `${q.text} (${q.units.join(' / ')})`);
}

export interface ManualRef { document: string; edition: string; page: string }
export interface Asset { id: string; make: string; model: string; engine: string; controller: string; serial: string; ratedKva: number }
export interface PlanTask { id: string; task: string; intervalHours?: number; intervalMonths?: number; source: ManualRef }
export interface ServiceRecord { date: string; engineHours: number; taskIds: string[]; jobCardId: string; technician: string }

export type DueStatus = 'OVERDUE' | 'DUE SOON' | 'OK' | 'DUE (NO HISTORY)';
export interface DueItem { taskId: string; task: string; status: DueStatus; lastDone: { date: string; engineHours: number } | null; nextDueHours: number | null; nextDueDate: string | null; reason: string; source: string }

const refText = (r: ManualRef) => `${r.document}, ${r.edition}, p. ${r.page}`;
function checkRef(where: string, r: ManualRef | undefined) {
  if (!r || !r.document?.trim() || !r.edition?.trim() || !r.page?.trim()) throw new Error(`${where}: cite the OEM manual (document, edition, page)`);
}
/**
 * Calendar months, clamped to the last day of the target month:
 * 31 Jan + 1 month = 28 (or 29) Feb, never 3 Mar (setUTCMonth alone overflows).
 */
export function addMonths(iso: string, m: number): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear(), mo = d.getUTCMonth() + m, day = d.getUTCDate();
  const lastDay = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, mo, Math.min(day, lastDay))).toISOString().slice(0, 10);
}

export function validatePlan(plan: PlanTask[]): void {
  const ids = new Set<string>();
  for (const t of plan) {
    if (ids.has(t.id)) throw new Error(`Plan task ${t.id} repeated`);
    ids.add(t.id);
    checkRef(`Plan task ${t.id}`, t.source);
    if (!(t.intervalHours! > 0) && !(t.intervalMonths! > 0)) throw new Error(`Plan task ${t.id}: give an hours and/or months interval from the manual`);
  }
}

/**
 * What is due now. "Soon" means within `soon.hours` engine hours or
 * `soon.days` days, both set by the workshop.
 */
export function dueList(plan: PlanTask[], history: ServiceRecord[], now: { date: string; engineHours: number }, soon: { hours: number; days: number }): DueItem[] {
  validatePlan(plan);
  if (!(now.engineHours >= 0) || Number.isNaN(Date.parse(now.date))) throw new Error('Current date and engine-hour reading are required');
  const sorted = [...history].sort((a, b) => a.engineHours - b.engineHours || Date.parse(a.date) - Date.parse(b.date));
  for (let k = 1; k < sorted.length; k++) if (Date.parse(sorted[k].date) < Date.parse(sorted[k - 1].date)) throw new Error(`Service history inconsistent: hours rise while dates go back (${sorted[k].jobCardId})`);
  if (sorted.length && now.engineHours < sorted[sorted.length - 1].engineHours) throw new Error('Current engine hours are below the last recorded service: check the hour meter (replaced?)');
  const nowMs = Date.parse(now.date);
  return plan.map((t) => {
    const last = [...sorted].reverse().find((r) => r.taskIds.includes(t.id)) ?? null;
    const src = refText(t.source);
    if (!last) return { taskId: t.id, task: t.task, status: 'DUE (NO HISTORY)' as const, lastDone: null, nextDueHours: null, nextDueDate: null, reason: 'No record of this task: treat as due until a record is found', source: src };
    const nextH = t.intervalHours ? last.engineHours + t.intervalHours : null;
    const nextD = t.intervalMonths ? addMonths(last.date, t.intervalMonths) : null;
    const overH = nextH !== null && now.engineHours >= nextH;
    const overD = nextD !== null && nowMs >= Date.parse(nextD);
    const soonH = nextH !== null && now.engineHours >= nextH - soon.hours;
    const soonD = nextD !== null && nowMs >= Date.parse(nextD) - soon.days * 86400e3;
    const status: DueStatus = overH || overD ? 'OVERDUE' : soonH || soonD ? 'DUE SOON' : 'OK';
    const parts = [nextH !== null ? `${nextH} h (now ${now.engineHours} h)` : null, nextD ? `${nextD}` : null].filter(Boolean).join(' or ');
    return { taskId: t.id, task: t.task, status, lastDone: { date: last.date, engineHours: last.engineHours }, nextDueHours: nextH, nextDueDate: nextD, reason: `Next due at ${parts}, whichever comes first`, source: src };
  });
}

// ---------------------------------------------------------------- job cards
/** The last step. Never shown as an approval: there are no reviewer accounts. */
export const SIGNOFF = 'SIGN-OFF RECORDED — NOT VERIFIED (typed name)' as const;
export type JobStatus = 'OPEN' | 'IN PROGRESS' | 'AWAITING PARTS' | 'COMPLETED' | typeof SIGNOFF;
const FLOW: Record<JobStatus, JobStatus[]> = {
  OPEN: ['IN PROGRESS'], 'IN PROGRESS': ['AWAITING PARTS', 'COMPLETED'], 'AWAITING PARTS': ['IN PROGRESS'], COMPLETED: [SIGNOFF, 'IN PROGRESS'], [SIGNOFF]: [],
};
/** The steps a card may move to next (for the UI status bar; same table transition() enforces). */
export function nextStatuses(s: JobStatus): JobStatus[] { return [...(FLOW[s] ?? [])]; }
export const JOB_STATUSES: JobStatus[] = ['OPEN', 'IN PROGRESS', 'AWAITING PARTS', 'COMPLETED', SIGNOFF];

export interface PartLine { partNo: string; description: string; qty: number; compatibility: ManualRef | null }
export interface Reading { name: string; value: number; unit: string; min?: number; max?: number; limitSource?: string }
export interface JobCard {
  id: string; assetId: string; opened: string; reportedFault: string; faultCodes: string[];
  technician: string; status: JobStatus; tasks: string[]; parts: PartLine[]; labourHours: number;
  engineHoursAtJob: number | null; readings: Reading[]; findings: string;
  completedOn: string | null;
  /** Starts at 1; every reopen (or failed import check) starts a new revision that needs a fresh sign-off. */
  revision: number;
  /** Typed, not verified. Set only while status is SIGNOFF. */
  signOffTypedName: string | null; signOffRecordedOn: string | null;
  /** SHA-256 of the card content at sign-off; set only while status is SIGNOFF. */
  signOffHash: string | null;
  log: LogEntry[];
  /** Guided Diagnosis safety state carried onto the card (R-INT-2); merge-only, not editable. */
  guidedSafety?: GuidedSafety;
  /** Set when the card was read from an imported file (never from this device's own saved data). */
  imported?: CardImport;
}
/** One status step. Sign-off steps carry `hash` and `revision`; a step from SIGNOFF cancels that sign-off. */
export interface LogEntry { at: string; from: JobStatus; to: JobStatus; by: string; note?: string; hash?: string; revision?: number }

/** JSON with sorted keys and no undefined values, so the hash does not depend on key order. */
function canonical(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o).filter((k) => o[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canonical(o[k])}`).join(',')}}`;
  }
  return JSON.stringify(v ?? null);
}

/**
 * Hash of what was signed: the work content of the card, its revision, and the
 * typed sign-off name and time. Status and history are not part of it.
 */
export function cardContentHash(card: JobCard, typedName: string, recordedOn: string, revision = card.revision): string {
  const { id, assetId, opened, reportedFault, faultCodes, technician, tasks, parts, labourHours, engineHoursAtJob, readings, findings, completedOn, guidedSafety } = card;
  // guidedSafety (R-INT-2) is signed too; absent on older cards, so their hashes are unchanged (canonical drops undefined).
  return sha256Hex(canonical({ id, assetId, opened, reportedFault, faultCodes, technician, tasks, parts, labourHours, engineHoursAtJob, readings, findings, completedOn, revision, typedName, recordedOn, guidedSafety }));
}

export type SignOffCheck =
  | { kind: 'never' }
  | { kind: 'no-hash'; by: string; at: string; cancelled: boolean }
  | { kind: 'unchanged' | 'changed'; by: string; at: string; cancelled: boolean; recorded: string; current: string };

/** Compares the card with the hash recorded at its latest sign-off. */
export function signOffCheck(card: JobCard): SignOffCheck {
  const idx = card.log.map((l) => l.to).lastIndexOf(SIGNOFF);
  if (idx < 0) return card.status === SIGNOFF ? { kind: 'no-hash', by: card.signOffTypedName ?? '', at: card.signOffRecordedOn ?? '', cancelled: false } : { kind: 'never' };
  const e = card.log[idx];
  const cancelled = card.status !== SIGNOFF;
  if (!e.hash) return { kind: 'no-hash', by: e.by, at: e.at, cancelled };
  const current = cardContentHash(card, e.by, e.at, e.revision ?? card.revision);
  const consistent = cancelled || (idx === card.log.length - 1 && e.revision === card.revision && card.signOffHash === e.hash && card.signOffTypedName === e.by && card.signOffRecordedOn === e.at);
  return { kind: current === e.hash && consistent ? 'unchanged' : 'changed', by: e.by, at: e.at, cancelled, recorded: e.hash, current };
}

export function openJobCard(j: { id: string; assetId: string; opened: string; reportedFault: string; faultCodes?: string[]; technician: string }): JobCard {
  if (!j.id?.trim() || !j.assetId?.trim() || !j.technician?.trim() || !j.reportedFault?.trim()) throw new Error('Job card needs an id, asset, technician and the reported fault');
  if (Number.isNaN(Date.parse(j.opened))) throw new Error('Job card needs the date opened');
  return { id: j.id, assetId: j.assetId, opened: j.opened, reportedFault: j.reportedFault.trim(), faultCodes: j.faultCodes ?? [], technician: j.technician, status: 'OPEN', tasks: [], parts: [], labourHours: 0, engineHoursAtJob: null, readings: [], findings: '', completedOn: null, revision: 1, signOffTypedName: null, signOffRecordedOn: null, signOffHash: null, log: [] };
}

/** Readings outside the limits supplied for this set; a reading with no limit is not judged. */
export function readingFlags(r: Reading[]): string[] {
  const f: string[] = [];
  for (const x of r) {
    if (!Number.isFinite(x.value)) { f.push(`${x.name}: no value`); continue; }
    if ((x.min !== undefined || x.max !== undefined) && !x.limitSource?.trim()) f.push(`${x.name}: limit given without its source`);
    if (x.min !== undefined && x.value < x.min) f.push(`${x.name} ${x.value} ${x.unit} is below ${x.min} ${x.unit} (${x.limitSource})`);
    if (x.max !== undefined && x.value > x.max) f.push(`${x.name} ${x.value} ${x.unit} is above ${x.max} ${x.unit} (${x.limitSource})`);
    // Exact-threshold rule (2026-11-25): a reading equal to a limit has reached it; it is never shown as within limits.
    if (x.min !== undefined && x.value === x.min) f.push(`${x.name} ${x.value} ${x.unit} is AT the minimum ${x.min} ${x.unit} — equality counts as reaching the limit (${x.limitSource})`);
    if (x.max !== undefined && x.value === x.max) f.push(`${x.name} ${x.value} ${x.unit} is AT the maximum ${x.max} ${x.unit} — equality counts as reaching the limit (${x.limitSource})`);
  }
  return f;
}

/** Why a sign-off by `by` is not allowed on this card content (empty = allowed). */
export function signOffBlockers(card: JobCard, by: string): string[] {
  const out: string[] = [];
  if (by.trim().toLowerCase() === card.technician.trim().toLowerCase()) out.push('Sign-off must be by a supervisor other than the technician');
  const unverified = card.parts.filter((p) => !p.compatibility || !p.compatibility.document?.trim());
  if (unverified.length) out.push(`Compatibility unverified for: ${unverified.map((p) => p.partNo).join(', ')}; cite the OEM parts book`);
  const flags = readingFlags(card.readings);
  if (flags.length) out.push(`Readings need attention before sign-off: ${flags.join('; ')}`);
  const latched = latchedStopBlocker(card);
  if (latched) out.push(`Before sign-off, record ${latched}`);
  const imported = importedBlocker(card);
  if (imported) out.push(`Before sign-off, record ${imported}`);
  return out;
}

export function transition(card: JobCard, to: JobStatus, by: string, at: string, update: Partial<Pick<JobCard, 'tasks' | 'parts' | 'labourHours' | 'engineHoursAtJob' | 'readings' | 'findings'>> = {}, note?: string): JobCard {
  if (!FLOW[card.status].includes(to)) throw new Error(`A job card cannot go from ${card.status} to ${to}`);
  if (!by?.trim() || Number.isNaN(Date.parse(at))) throw new Error('Who and when are required for every status change');
  const next: JobCard = { ...card, ...update, log: [...card.log, { at, from: card.status, to, by, note }], status: to };
  if (to === 'COMPLETED') {
    const e: string[] = [];
    if (!next.findings.trim()) e.push('findings');
    if (!next.tasks.length) e.push('work done');
    if (!(next.engineHoursAtJob !== null && next.engineHoursAtJob >= 0)) e.push('engine-hour reading');
    if (!recordsStopInForce(next)) {
      // Real-project test D6 (2026-11-26): not "any reading" — the test-run readings THIS job needs.
      const missing = missingTestRunReadings(next);
      if (missing.length) e.push(`test-run readings for this job: ${missing.join('; ')} (or, if a STOP is unresolved, ${NOT_TAKEN_PROMPT})`);
    } else if (next.readings.length) {
      // F10-R3 MINOR: the card cannot say both "no test-run readings were taken" and carry test-run readings.
      e.push(`one consistent record: "${NOT_TAKEN_ACTION}" is recorded but the card also carries ${next.readings.length} test-run reading(s); remove the readings, or use a new job card for the test run`);
    }
    const latched = latchedStopBlocker(next);
    if (latched) e.push(latched);
    const imported = importedBlocker(next);
    if (imported) e.push(imported);
    if (e.length) throw new Error(`To complete, record: ${e.join(', ')}`);
    next.completedOn = at;
  }
  if (to === SIGNOFF) {
    const blockers = signOffBlockers(next, by);
    if (blockers.length) throw new Error(blockers.join('; '));
    next.signOffTypedName = by; next.signOffRecordedOn = at;
    const hash = cardContentHash(next, by, at);
    next.signOffHash = hash;
    next.log = [...card.log, { at, from: card.status, to, by, note, hash, revision: next.revision }];
  }
  return next;
}

/** Cancels the current sign-off: new revision, back to `to`, entry kept in the history. */
function cancelSignOff(card: JobCard, to: JobStatus, by: string, at: string, why: string): JobCard {
  const prior = `sign-off of revision ${card.revision} recorded by typed name ${card.signOffTypedName ?? '?'} on ${card.signOffRecordedOn ?? '?'}${card.signOffHash ? ` (content hash ${card.signOffHash})` : ' (no content hash)'}`;
  return {
    ...card, status: to, revision: card.revision + 1, signOffTypedName: null, signOffRecordedOn: null, signOffHash: null,
    log: [...card.log, { at, from: card.status, to, by, note: `${why} Cancels the ${prior}. Revision ${card.revision + 1} needs a fresh sign-off.` }],
  };
}

/** History note on a version-1 sign-off that had no content hash and was moved back to COMPLETED on upgrade. */
export const V1_UNCHECKED_SIGNOFF_NOTE = 'Sign-off from a version-1 file could not be checked (no content hash); sign-off must be recorded again';
/** `by` on that history step: the upgrade did it, not a person. */
export const V1_UPGRADE_BY = 'Generator Oracle (version-1 upgrade)';

const isV1Void = (e: LogEntry | undefined) => !!e && e.from === SIGNOFF && e.to === 'COMPLETED' && e.by === V1_UPGRADE_BY && !!e.note?.startsWith(V1_UNCHECKED_SIGNOFF_NOTE);

/**
 * Version-1 upgrade only: a card at the sign-off step whose sign-off has no
 * content hash goes back to COMPLETED with a history note. The old sign-off
 * step stays in the history; the card starts a new revision that needs a
 * fresh sign-off. `extra` is added to the note (e.g. a service record removed).
 */
export function voidUncheckedSignOff(card: JobCard, at: string, extra?: string): JobCard {
  const last = card.log[card.log.length - 1];
  if (card.status !== SIGNOFF || !last || last.to !== SIGNOFF || last.hash) throw new Error(`Job card ${card.id}: only a sign-off without a content hash can be moved back this way`);
  const note = `${V1_UNCHECKED_SIGNOFF_NOTE}. It was recorded by typed name ${last.by} on ${last.at}.${extra ? ` ${extra}` : ''}`;
  return {
    ...card, status: 'COMPLETED', revision: card.revision + 1, signOffTypedName: null, signOffRecordedOn: null, signOffHash: null,
    log: [...card.log, { at, from: SIGNOFF, to: 'COMPLETED', by: V1_UPGRADE_BY, note }],
  };
}

/**
 * The only way to change a card after sign-off. Needs who, when and a reason;
 * starts a new revision that needs a fresh sign-off. The earlier sign-off
 * stays in the history.
 */
export function reopenJobCard(card: JobCard, by: string, at: string, reason: string): JobCard {
  if (card.status !== SIGNOFF) throw new Error(`Only a card at ${SIGNOFF} can be reopened (this one is ${card.status})`);
  if (!by?.trim() || Number.isNaN(Date.parse(at))) throw new Error('Who and when are required to reopen a job card');
  if (!reason?.trim()) throw new Error('Give the reason for reopening the job card after sign-off');
  return cancelSignOff(card, 'IN PROGRESS', by.trim(), at, `REOPENED. Reason: ${reason.trim()}.`);
}

/**
 * For loaded or imported cards (never trusted). Replays the history through
 * the same status flow transition() enforces, re-derives status and revision
 * from it, re-applies the completion and sign-off rules, and checks the
 * content hash of a current sign-off. Returns every problem; the store
 * refuses a card with any.
 */
export function cardIntegrityProblems(card: JobCard): string[] {
  const out: string[] = [];
  const tech = card.technician.trim().toLowerCase();
  let at: JobStatus = 'OPEN';
  let reopens = 0;
  card.log.forEach((e, i) => {
    const n = `history step ${i + 1}`;
    if (e.from !== at) out.push(`${n} starts from ${e.from} but the card was at ${at}`);
    // A version-1 sign-off with no hash, moved back to COMPLETED on upgrade: allowed only as that exact pair of steps.
    const voided = e.to === SIGNOFF && !e.hash && isV1Void(card.log[i + 1]);
    const v1Void = at === SIGNOFF && isV1Void(e) && i > 0 && !card.log[i - 1].hash;
    const reopen = (at === SIGNOFF && e.to === 'IN PROGRESS') || v1Void;
    if (!reopen && !FLOW[at].includes(e.to)) out.push(`${n}: ${at} → ${e.to} is not an allowed step`);
    if (!e.by.trim() || Number.isNaN(Date.parse(e.at))) out.push(`${n} has no who or when`);
    if (e.to === SIGNOFF && !voided) {
      if (e.by.trim().toLowerCase() === tech) out.push(`${n}: sign-off by the technician`);
      if (!e.hash) out.push(`${n}: no content hash was recorded at sign-off`);
      if (e.revision !== reopens + 1) out.push(`${n}: sign-off revision does not match the history`);
    }
    if (reopen) reopens++;
    at = e.to;
  });
  if (at !== card.status) out.push(`its status ${card.status} does not match its history (${at})`);
  if (card.revision !== reopens + 1) out.push(`revision ${card.revision} does not match its history (${reopens + 1})`);
  if (card.status === 'COMPLETED' || card.status === SIGNOFF) {
    const miss = [!card.findings.trim() && 'findings', !card.tasks.length && 'work done', !(card.engineHoursAtJob !== null && card.engineHoursAtJob >= 0) && 'engine-hour reading', !card.readings.length && !recordsStopInForce(card) && 'test-run readings', !card.completedOn && 'completion date', latchedStopBlocker(card, { asRecorded: true })].filter(Boolean);
    if (miss.length) out.push(`completed without: ${miss.join(', ')}`);
  }
  if (card.status === SIGNOFF) {
    const c = signOffCheck(card);
    if (c.kind === 'changed') out.push('CHANGED AFTER SIGN-OFF: the content does not match the hash recorded at sign-off');
    if (c.kind === 'no-hash' && !out.some((p) => p.includes('no content hash'))) out.push('no content hash was recorded at sign-off');
    out.push(...signOffBlockers(card, card.signOffTypedName ?? '').filter((b) => !b.startsWith('Sign-off must be') || !out.some((p) => p.includes('sign-off by the technician'))));
  }
  return out;
}

/** Service record from a card with a recorded sign-off (feeds dueList). */
export function toServiceRecord(card: JobCard, planTaskIds: string[]): ServiceRecord {
  if (card.status !== SIGNOFF) throw new Error(`Only a job card at ${SIGNOFF} becomes service history`);
  return { date: card.completedOn!.slice(0, 10), engineHours: card.engineHoursAtJob!, taskIds: planTaskIds, jobCardId: card.id, technician: card.technician };
}

/** Lines describing the sign-off state, for the report and the screen. */
export function signOffSummary(card: JobCard): string[] {
  const c = signOffCheck(card);
  if (c.kind === 'never') return [`No sign-off recorded (revision ${card.revision}).`];
  const out: string[] = [];
  if (c.cancelled) out.push(`No current sign-off (revision ${card.revision}). An earlier sign-off recorded by typed name ${c.by} on ${c.at} was cancelled — see the status history for who, when and why.`);
  else out.push(`${SIGNOFF}: typed name ${c.by}, recorded ${c.at}, revision ${card.revision}. Not an authenticated signature, not an approval.`);
  if (card.imported?.signedOff) out.push(`Sign-off ${SIGNED_OFF_ELSEWHERE}: this sign-off came in an imported file; its content hash can be recomputed by anyone, so it is not verified on this device.`);
  if (c.kind === 'no-hash') out.push('CHANGED AFTER SIGN-OFF / NOT VERIFIED: no content hash was recorded at that sign-off, so changes cannot be ruled out.');
  else {
    out.push(`Content hash at sign-off (SHA-256): ${c.recorded}`);
    out.push(c.kind === 'unchanged'
      ? (card.imported ? `Card content matches the hash in the imported file (${SIGNED_OFF_ELSEWHERE}; the hash does not prove the file was not edited).` : 'Card content matches the hash recorded at sign-off (this detects later edits; it does not prove who signed).')
      : `CHANGED AFTER SIGN-OFF: the card no longer matches the hash recorded at sign-off (now ${c.current}).`);
  }
  return out;
}

const fmtLimits = (r: Reading) => {
  if (r.min === undefined && r.max === undefined) return 'no limit given — NOT VERIFIED, not a pass';
  const range = r.min !== undefined && r.max !== undefined ? `${r.min}–${r.max} ${r.unit}` : r.min !== undefined ? `min ${r.min} ${r.unit}` : `max ${r.max} ${r.unit}`;
  return `limits ${range}, source: ${r.limitSource?.trim() || 'NOT GIVEN'}`;
};

/** One section of the job card report: a heading and its lines (already indented/bulleted). */
export interface ReportSection { heading: string; lines: string[] }

/**
 * The job card report as a title, notices and sections. The .txt and the PDF
 * are both built from this, so they always carry the same content.
 */
export function jobCardReportParts(card: JobCard, asset: Asset): { title: string; notices: string[]; sections: ReportSection[]; footer: string } {
  const list = (xs: string[], empty: string) => (xs.length ? xs.map((x) => `  - ${x}`) : [`  ${empty}`]);
  const flags = readingFlags(card.readings);
  // Safety review F6: every STOP in the findings, with the lines that belong to it (its
  // safeguard label and its "(Raised in …)" source line), is repeated as the FIRST section
  // of the report, before the asset and the work.
  const fl = (card.findings || '').split(/\r?\n/);
  const stopLines: string[] = [];
  const belongs = (l: string | undefined) => !!l && (/^This is a conservative software safeguard/.test(l) || /^\(Raised in the ".*" diagnosis of this session\.\)$/.test(l));
  // R-INT-3: SAFETY HOLD lines get their own section, never the STOP heading.
  const holdLines: string[] = [];
  fl.forEach((l, i) => {
    if (/^SAFETY HOLD\b/.test(l)) {
      holdLines.push(`  ${l}`);
      if (/^Why: /.test(fl[i + 1] ?? '')) holdLines.push(`  ${fl[i + 1]}`);
      return;
    }
    if (!/^STOP\b/.test(l)) return;
    stopLines.push(`  ${l}`);
    for (let j = i + 1; belongs(fl[j]); j++) stopLines.push(`  ${fl[j]}`);
  });
  // R-INT-2: the structured safety record held on the card (not editable), first.
  const g = card.guidedSafety;
  const unresolved = unresolvedGuidedSafety(card);
  const structured: ReportSection[] = [];
  if (g?.holds.length) {
    structured.push({ heading: 'SAFETY HOLD — previous diagnostic safety status could not be verified (held on this card)', lines: [...g.holds.flatMap((h) => [
      `  ${h.text}`, `  ${h.why}`,
      `  Recorded ${h.since} (UTC). ${h.resolvedAt ? `Resolved ${h.resolvedAt} (UTC) by an in-person reassessment recorded on this card.` : `NOT RESOLVED: completion needs an in-person reassessment recorded on this card, or the action ${NOT_TAKEN_PROMPT}.`}`,
    ]), ...(g.reassessments ?? []).map((r) => `  Reassessment recorded ${r.at} (UTC) by ${oneLine(r.by)} (typed name, UNVERIFIED): ${oneLine(r.reason)}. ${HOLD_REASSESSMENT_NOTICE}`)] });
  }
  if (g?.stops.length) {
    structured.push({ heading: 'SAFETY — GUIDED DIAGNOSIS STOP RECORD (held on this card)', lines: [
      ...g.stops.flatMap((s) => {
        const open = unresolved.stops.includes(s);
        const auto = !open && g.clearances.some((c) => c.automatic && clears(c, s)) && !g.clearances.some((c) => !c.automatic && clears(c, s));
        return [`  ${open ? latchedStopLine(s) : auto ? `STOP — ${AUTO_RELEASE_PREFIX.toLowerCase()} (a valid value was entered; no person recorded a clearance). Source: ${oneLine(s.from)} tab. Since: ${s.since} (UTC). ${oneLine(s.message)}` : `STOP — cleared by a recorded clearance (UNVERIFIED). Source: ${oneLine(s.from)} tab. Since: ${s.since} (UTC). ${oneLine(s.message)}`}`, ...(s.fromRecord ? ['  (Shown by the recorded diagnosis itself when this card was made.)'] : []), ...(s.label ? [`  ${s.label}`] : [])];
      }),
      ...g.clearances.map((c) => `  ${clearanceLine(c)}`),
    ] });
  }
  const imp = card.imported;
  if (imp) {
    const ib = importedBlocker(card);
    structured.unshift({ heading: 'SAFETY — IMPORTED CARD (UNVERIFIED on this device)', lines: [
      `  ${IMPORTED_NOTICE}`,
      `  Imported ${imp.at} (UTC): ${imp.stops} STOP(s), ${imp.clearances} clearance(s), ${imp.holds} SAFETY HOLD(s) and ${imp.reassessments} reassessment(s) came in the file — imported, unverified, never established here.`,
      ...(imp.signedOff ? [`  Sign-off in the file: ${SIGNED_OFF_ELSEWHERE}.`] : []),
      `  Fresh Guided Diagnosis record on this device: ${imp.freshRecordAt ? `${imp.freshRecordAt} (${imp.freshRecordClean ? 'no unresolved STOP or hold' : 'carries an unresolved STOP or hold'})` : 'none'}. Fresh in-person reassessment on this device: ${imp.reassessedAt ?? 'none'}.`,
      ...(ib ? [`  Completion and sign-off need: ${ib}.`] : []),
    ] });
  }
  if (g?.notTaken?.length) {
    structured.push({ heading: 'SAFETY — READINGS NOT TAKEN, STOP IN FORCE (recorded action, held on this card)', lines: g.notTaken.map((e, i) => `  ${notTakenLine(e)}${card.imported && (i < (card.imported.notTaken ?? 0) || e.at < card.imported.at) ? ' IMPORTED — not counted on this device.' : ''}`) });
  }
  const safety: ReportSection[] = [
    ...structured,
    ...(holdLines.length ? [{ heading: 'SAFETY HOLD (repeated from the findings below)', lines: holdLines }] : []),
    ...(stopLines.length ? [{ heading: 'SAFETY — STOP (repeated from the findings below)', lines: stopLines }] : []),
  ];
  return {
    title: `JOB CARD ${card.id} (revision ${card.revision}) — ${card.status}`,
    notices: [`SAFETY: ${STOP_NOT_CARRIED_NOTICE}`, `SAFETY: ${DEVICE_ONLY_NOTICE}`, ...(card.imported ? [`SAFETY: ${IMPORTED_NOTICE}`] : []), `NOTICE: ${TYPED_SIGNOFF_NOTICE}`, `NOTICE: ${TYPED_NAMES_NOTICE}`],
    sections: [
      ...safety,
      { heading: 'ASSET', lines: [`  ${asset.id}: ${asset.make} ${asset.model} (${asset.ratedKva} kVA), engine ${asset.engine || '—'}, controller ${asset.controller || '—'}, serial ${asset.serial}`] },
      { heading: 'FAULT', lines: [
        `  Reported fault: ${card.reportedFault}`,
        `  Fault codes: ${card.faultCodes.join(', ') || 'none'}`,
        `  Opened ${card.opened}; technician (typed name): ${card.technician}`,
      ] },
      { heading: 'WORK DONE', lines: [
        ...list(card.tasks, '(none recorded)'),
        `  Engine hours at job: ${card.engineHoursAtJob === null ? '—' : `${card.engineHoursAtJob} h`}. Labour: ${card.labourHours} h.`,
      ] },
      { heading: 'PARTS', lines: list(card.parts.map((p) => `${p.qty} × ${p.partNo}${p.description ? ` ${p.description}` : ''} — ${p.compatibility ? `parts book: ${refText(p.compatibility)}` : 'compatibility unverified (no parts-book reference)'}`), 'none') },
      { heading: 'TEST READINGS', lines: [
        ...list(card.readings.map((r) => `${r.name}: ${r.value} ${r.unit} (${fmtLimits(r)})`), !card.readings.length && recordsStopInForce(card) ? `none: ${NOT_TAKEN_ACTION} (recorded action, see SAFETY)` : '(none recorded)'),
        ...flags.map((f) => `  ! ${f}`),
      ] },
      // One report line per findings line (a guided-diagnosis record is several lines).
      { heading: 'FINDINGS', lines: (card.findings || '—').split(/\r?\n/).map((l) => `  ${l}`) },
      { heading: 'SIGN-OFF', lines: [...signOffSummary(card).map((x) => `  ${x}`), `  Completed: ${card.completedOn ?? '—'}`] },
      { heading: 'STATUS HISTORY (who = typed name, not verified)', lines: list(card.log.map((l) => `${l.at}  ${l.from} → ${l.to}  by ${l.by}${l.revision ? ` (revision ${l.revision})` : ''}${l.note ? ` — ${l.note}` : ''}${l.hash ? ` [content hash ${l.hash}]` : ''}`), '(no status changes yet)') },
    ],
    footer: `[${SERVICE_ENGINE_VERSION}]`,
  };
}

/** Plain-text job card report for the customer file. Not a certified record (typed names). */
export function jobCardReport(card: JobCard, asset: Asset): string {
  const p = jobCardReportParts(card, asset);
  return [p.title, ...p.notices, ...p.sections.flatMap((s) => ['', s.heading, ...s.lines]), '', p.footer].join('\n');
}
