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
export const STOP_NOT_CARRIED_NOTICE = 'Generator Oracle cannot confirm a set is safe to run. A STOP from Guided Diagnosis is kept only in this browser — record it on this card. Do not test-run a set with an unresolved STOP.';

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
  const { id, assetId, opened, reportedFault, faultCodes, technician, tasks, parts, labourHours, engineHoursAtJob, readings, findings, completedOn } = card;
  return sha256Hex(canonical({ id, assetId, opened, reportedFault, faultCodes, technician, tasks, parts, labourHours, engineHoursAtJob, readings, findings, completedOn, revision, typedName, recordedOn }));
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
    if (!next.readings.length) e.push('test-run readings');
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
    const miss = [!card.findings.trim() && 'findings', !card.tasks.length && 'work done', !(card.engineHoursAtJob !== null && card.engineHoursAtJob >= 0) && 'engine-hour reading', !card.readings.length && 'test-run readings', !card.completedOn && 'completion date'].filter(Boolean);
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
  if (c.kind === 'no-hash') out.push('CHANGED AFTER SIGN-OFF / NOT VERIFIED: no content hash was recorded at that sign-off, so changes cannot be ruled out.');
  else {
    out.push(`Content hash at sign-off (SHA-256): ${c.recorded}`);
    out.push(c.kind === 'unchanged'
      ? 'Card content matches the hash recorded at sign-off (this detects later edits; it does not prove who signed).'
      : `CHANGED AFTER SIGN-OFF: the card no longer matches the hash recorded at sign-off (now ${c.current}).`);
  }
  return out;
}

const fmtLimits = (r: Reading) => {
  if (r.min === undefined && r.max === undefined) return 'no limit given, not judged';
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
  return {
    title: `JOB CARD ${card.id} (revision ${card.revision}) — ${card.status}`,
    notices: [`SAFETY: ${STOP_NOT_CARRIED_NOTICE}`, `NOTICE: ${TYPED_SIGNOFF_NOTICE}`, `NOTICE: ${TYPED_NAMES_NOTICE}`],
    sections: [
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
        ...list(card.readings.map((r) => `${r.name}: ${r.value} ${r.unit} (${fmtLimits(r)})`), '(none recorded)'),
        ...flags.map((f) => `  ! ${f}`),
      ] },
      { heading: 'FINDINGS', lines: [`  ${card.findings || '—'}`] },
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
