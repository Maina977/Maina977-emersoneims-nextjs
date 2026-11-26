/**
 * A guided diagnosis as a job-card record (2026-11-25).
 *
 * diagnosisRecord() runs the same diagnose() as the Guided Diagnosis tab and
 * writes its result as text (for the job card findings, and for the .txt
 * download on the Guided Diagnosis tab) plus test readings (measured numeric
 * answers). The job-card .txt and PDF are built from the card, so the screen,
 * the download, the card and its exports all carry the same words.
 *
 * STOP-first (safety review F6): STOP lines — including STOPs raised in other
 * families of the session (F3) — are the first lines of the record, and a
 * record with a STOP goes to the top of the card's findings.
 *
 * Provenance: every OEM figure used by a rule is written with its parameter,
 * value and units, its classification, the source the technician typed and
 * the equipment it applies to. An unclassified protective limit is written as
 * "treated as STOP (conservative software safeguard)" (F5). A published
 * model-specific limit whose model is no longer selected (or whose typed plate
 * disagrees) is refused, never applied (F7).
 */
import { classKey, diagnose, NO_VERIFIED_LEAD, protectiveLimitIds, sourceKey, tolKey, UNVERIFIED_CAUSE_LABEL } from './engine';
import { answersFromRaw, mergedRaw, type RawAnswers } from './session';
import { convertUnits, unitKindOf, unitLine } from './units';
import { refusedProtectiveStops } from './refusedProtective';
export { REFUSED_UNIT_ALL, REFUSED_UNIT_SOME, refusedProtectiveText } from './refusedProtective';
import { externalStopsFor, type ExternalStop } from './sessionSafety';
import { NOT_VERIFIED, publishedEntryOf, publishedLimitFor, referencesFor, type Equipment } from './oemReferences';
import { isScreenKey } from './safetyScreen';
import { FAMILIES } from './families';
import type { Answers, DiagnosisResult, FaultFamily, LimitClass, NumberQuestion, Question } from './types';
import { mergeGuidedSafety, type GuidedSafety, type GuidedSafetyAdd, type JobCard, type Reading } from '@/lib/generator-oracle/service/maintenance';
import type { CardUpdate } from '@/lib/generator-oracle/service/store';

export const RECORD_HEADER = 'GUIDED DIAGNOSIS';

/** What a record was built from (R-INT-1); see recordInputs(). */
export interface RecordInputs { family: FaultFamily; raw: Record<string, string> | undefined; equipment: Equipment; session?: RawAnswers; extraStops: ExternalStop[] }
const RECORD_INPUTS = Symbol.for('eims.oracle.recordInputs');
const RECORD_SAFETY = Symbol.for('eims.oracle.recordSafety');
export function recordInputs(rec: DiagnosisRecord): RecordInputs | undefined {
  return (rec as unknown as Record<symbol, RecordInputs | undefined>)[RECORD_INPUTS];
}
/** The safety state a guarded record was made under (R-INT-2/3): what the card's structured safety record gets, and whether only the SAFETY HOLD applies. */
export interface RecordSafety { add: GuidedSafetyAdd; holdOnly: boolean }
export function withRecordSafety<T extends DiagnosisRecord>(rec: T, safety: RecordSafety): T {
  Object.defineProperty(rec, RECORD_SAFETY, { value: safety, enumerable: false });
  return rec;
}
export function recordSafety(rec: DiagnosisRecord): RecordSafety | undefined {
  return (rec as unknown as Record<symbol, RecordSafety | undefined>)[RECORD_SAFETY];
}

/** Ids of questions that hold an OEM / settings-sheet figure. */
export function refQuestions(family: FaultFamily): Set<string> {
  return new Set(family.questions.filter((q) => q.kind === 'number' && q.oemLimit).map((q) => q.id));
}

const answerText = (q: Question, v: string | number | boolean): string =>
  q.kind === 'number' ? `${v} ${q.unit}` : (q.options.find((o) => o.value === v)?.label ?? String(v));

/** How a classification is written on the card; an unclassified protective limit is a STOP (F5). */
export function classText(cls: LimitClass, protective: boolean): string {
  if (cls === 'shutdown') return 'SHUTDOWN value';
  if (cls === 'warning') return 'WARNING value';
  return protective ? 'classification NOT STATED — treated as STOP (conservative software safeguard)' : 'classification NOT STATED (treated as CAUTION)';
}

/** The equipment an entered limit applies to, as typed by the technician. */
export function equipmentText(eq: Equipment): string {
  return [`manufacturer ${eq.manufacturer ?? 'NOT GIVEN'}`, `model ${eq.model ?? 'NOT GIVEN'}`, `variant/configuration ${eq.variant ?? 'NOT GIVEN'}`].join('; ');
}

/**
 * F7: a limit entered with "Use published value" names its dataset entry in the
 * source. If that entry no longer applies to the selected equipment, the limit,
 * its classification and its source are taken out and the refusal is reported.
 */
export function guardPublished(family: FaultFamily, answers: Answers, equipment: Equipment): { answers: Answers; refused: DiagnosisResult['invalid'] } {
  const out: Answers = { ...answers };
  const refused: DiagnosisResult['invalid'] = [];
  for (const q of family.questions) {
    if (q.kind !== 'number' || !q.oemLimit) continue;
    const entry = publishedEntryOf(answers[sourceKey(q.id)] as string | undefined);
    if (!entry) continue;
    const pub = publishedLimitFor(equipment, family.id, q.id);
    if (pub && pub.ref.entry.id === entry) continue;
    delete out[q.id]; delete out[classKey(q.id)]; delete out[sourceKey(q.id)];
    refused.push({ q: q.id, reason: `${q.oemLimit.parameter}: the published value (dataset entry ${entry}) applies only to the model it was published for, and that model is no longer selected or the typed plate disagrees. Not applied — enter the limit for this set from its own manual (${NOT_VERIFIED}).` });
  }
  return { answers: out, refused };
}

export interface DiagnosisRecord {
  result: DiagnosisResult;
  /** One entry per line, as written to the job card findings and the .txt download. */
  lines: string[];
  findings: string;
  readings: Reading[];
}

/**
 * @param raw the answers this family sees (the shared safety screen merged in — see session.mergedRaw)
 * @param session the whole guided session, so STOPs raised in other families are carried in (F3)
 * @param extraStops further STOPs that apply to this machine (integration review R-INT-1: every
 *   uncleared latched STOP and the SAFETY HOLD), so running checks and running-only questions are withheld

 */
export function diagnosisRecord(family: FaultFamily, raw: Record<string, string> | undefined, equipment: Equipment = {}, session?: RawAnswers, extraStops: ExternalStop[] = []): DiagnosisRecord {
  const typed = answersFromRaw(family, raw);
  const units = convertUnits(family, raw);
  const { answers, refused } = guardPublished(family, typed, equipment);
  const base = diagnose(family, answers, { externalStops: [...externalStopsFor(FAMILIES, session, family.id), ...extraStops] });
  let result: DiagnosisResult = { ...base, invalid: [...units.refused, ...refused, ...base.invalid] };
  // F10-REMAINING (2026-11-26): a refused PROTECTIVE value (reading or limit: no unit, unknown unit,
  // not a number, out of range, or out of band) is never safer than a typed one. It raises a STOP
  // first (a labelled safeguard), withholds running checks and blocks the job card until corrected.
  const refusedStops = refusedProtectiveStops(family, answers, units.refused, result.invalid);
  if (refusedStops.length) {
    result = { ...result, stops: [...refusedStops, ...result.stops], stopActive: true };
  }
  // Safety review F10: a refused pressure or temperature (no unit, unknown unit, not a number, or out
  // of the physical range after conversion) never clears or avoids a STOP: running checks are
  // withheld and the refused question stays the next check until it is entered correctly.
  const refusedUnitQs = family.questions.filter((q) => (unitKindOf(q) || refusedStops.length) && result.invalid.some((i) => i.q === q.id));
  if (refusedUnitQs.length || refusedStops.length) {
    result = {
      ...result,
      runningWithheld: true,
      // Never a running-only question as the next check (R-INT-1): those stay withheld.
      nextQuestion: refusedUnitQs.find((q) => !q.needsRunning) ?? (result.nextQuestion && !result.nextQuestion.needsRunning ? result.nextQuestion : null),
      ranked: result.ranked.map((c) => {
        const cause = family.causes.find((x) => x.id === c.id);
        const running = cause?.runningChecks ?? [];
        return { ...c, actions: c.actions.filter((a) => !running.includes(a)), withheld: [...new Set([...c.withheld, ...running])] };
      }),
    };
  }
  const valid = new Map(Object.entries(answers).filter(([k]) => !result.invalid.some((i) => i.q === k)));
  const oemQs = refQuestions(family);
  const protective = protectiveLimitIds(family);

  const lines: string[] = [];
  // STOP lines first (F6), each followed by its label line where it has one.
  for (const s of result.stops.filter((x) => x.level === 'STOP')) {
    lines.push(`STOP: ${s.message}`);
    if (s.label) lines.push(s.label);
    if (s.from) lines.push(`(Raised in the "${s.from}" diagnosis of this session.)`);
  }
  lines.push(`${RECORD_HEADER}: ${family.title} [${family.id}] — ${result.engineVersion}; content status: ${result.review}.`);
  lines.push(`Not a manufacturer procedure. ${result.disclaimer}`);
  for (const s of result.stops.filter((x) => x.level === 'CAUTION')) { lines.push(`CAUTION: ${s.message}`); if (s.label) lines.push(s.label); }
  lines.push(`Equipment (typed by the technician; any OEM figure below applies only to it): ${equipmentText(equipment)}.`);
  lines.push(`Equipment selected for published references: engine ${equipment.engine ?? 'none / not listed'}; controller ${equipment.controller ?? 'none / not listed'}.`);
  const published = referencesFor(equipment, family.id);
  if (published.length) {
    lines.push('Published references shown (context only; entered as a limit only if the technician pressed "Use published value"):');
    for (const r of published) lines.push(`- ${r.text}`);
  } else lines.push(`Published references: none held for the selected equipment — machine limits ${NOT_VERIFIED}.`);

  const entered = family.questions.filter((q): q is NumberQuestion => oemQs.has(q.id) && valid.has(q.id));
  lines.push(entered.length ? 'OEM figures entered (not verified by EmersonEIMS):' : `OEM figures entered: none — every OEM-dependent rule is ${NOT_VERIFIED} and applies no threshold.`);
  for (const q of entered) {
    const cls = (valid.get(classKey(q.id)) as LimitClass | undefined) ?? 'not-stated';
    lines.push(`- ${q.oemLimit!.parameter}: ${valid.get(q.id)} ${q.unit} (${q.oemLimit!.direction === 'min' ? 'minimum' : 'maximum'}); ${classText(cls, protective.has(q.id))}; source (manual ID, revision, page): ${valid.get(sourceKey(q.id)) ?? 'NOT GIVEN'}; applies only to: ${equipmentText(equipment)}.`);
  }
  if (result.limits.length) {
    lines.push('Limit checks (equality counts as reaching the limit):');
    for (const l of result.limits) lines.push(`- ${l.status.toUpperCase()}${l.level ? ` (${l.level})` : ''}: ${l.text}`);
  }

  lines.push(`Answers (${result.answered} of ${family.questions.length}):`);
  for (const q of family.questions) {
    const v = valid.get(q.id);
    if (v === undefined || oemQs.has(q.id)) continue;
    const tol = valid.get(tolKey(q.id));
    lines.push(`- ${q.text}: ${answerText(q, v)}${tol !== undefined && q.kind === 'number' ? ` (measurement tolerance ±${tol} ${q.unit})` : ''}`);
  }
  for (const i of result.invalid) lines.push(`- REFUSED: ${i.reason}`);
  if (units.entered.length) {
    lines.push('Units as entered (pressures and temperatures; the checks use kPa and °C):');
    for (const e of units.entered) lines.push(`- ${unitLine(e)}`);
  }
  lines.push('Likely causes, most supported first:');
  if (result.ranked[0]?.unverified) lines.push(NO_VERIFIED_LEAD);
  result.ranked.forEach((c, i) => {
    const why = [...c.for.map((x) => `+ ${x}`), ...c.against.map((x) => `− ${x}`)].join('; ');
    lines.push(`${i + 1}. ${c.title} (evidence ${c.score >= 0 ? '+' : ''}${c.score}${why ? `: ${why}` : ''})${c.unverified ? ` [${UNVERIFIED_CAUSE_LABEL}]` : ''}`);
    if (i < 3 && c.score > 0) for (const a of c.actions) lines.push(`   - ${a}`);
    if (i < 3 && c.score > 0 && c.withheld.length) lines.push(`   - Withheld (${result.stopActive ? 'a STOP is active' : 'a leading cause says do not run'}): ${c.withheld.length} check(s) that need the engine running.`);
  });
  if (result.excluded.length) {
    lines.push('Ruled out:');
    for (const e of result.excluded) lines.push(`- ${e.title}: ${e.because}`);
  }
  lines.push(result.nextQuestion
    ? `Next check: ${result.nextQuestion.text}${result.nextQuestion.kind === 'number' ? ` (${result.nextQuestion.unit})` : ''}`
    : (result.stopActive ? 'Next check: none offered while a STOP is active beyond the stopped-and-isolated checks above.' : 'Next check: all questions answered.'));

  // Test readings: measured numbers only (not OEM figures, not rating-plate values, not the safety screen).
  const readings: Reading[] = [];
  for (const q of family.questions) {
    const v = valid.get(q.id);
    if (q.kind !== 'number' || v === undefined || oemQs.has(q.id) || q.ratingPlate || isScreenKey(q.id)) continue;
    const ent = units.entered.find((e) => e.q === q.id);
    const r: Reading = { name: ent && ent.unit !== ent.canonicalUnit ? `${q.text} (entered ${ent.entered} ${ent.unit})` : q.text, value: Number(v), unit: q.unit };
    const srcs: string[] = [];
    for (const l of (family.limits ?? []).filter((x) => x.reading === q.id)) {
      const L = valid.get(l.limit);
      if (L === undefined) continue;
      const lq = family.questions.find((x) => x.id === l.limit) as NumberQuestion;
      const cls = (valid.get(classKey(l.limit)) as LimitClass | undefined) ?? 'not-stated';
      if (lq.oemLimit!.direction === 'min') r.min = Number(L); else r.max = Number(L);
      srcs.push(`${lq.oemLimit!.parameter} — ${classText(cls, l.protective)}, source: ${valid.get(sourceKey(l.limit)) ?? 'NOT GIVEN'}; entered by the technician — NOT VERIFIED; equality counts as reaching it`);
    }
    if (srcs.length) r.limitSource = srcs.join(' | ');
    readings.push(r);
  }
  const rec: DiagnosisRecord = { result, lines, findings: lines.join('\n'), readings };
  // Integration review R-INT-1: the inputs travel with the record (not enumerable, so the record's
  // data is unchanged), so a record combined with the latch can be rebuilt under the latched STOPs.
  const inputs: RecordInputs = { family, raw, equipment, session, extraStops };
  Object.defineProperty(rec, RECORD_INPUTS, { value: inputs, enumerable: false });
  return rec;
}

/** The record for one family of a session (screen merged, other families' STOPs carried in). */
export function sessionRecord(family: FaultFamily, session: RawAnswers, equipment: Equipment = {}, extraStops: ExternalStop[] = []): DiagnosisRecord {
  return diagnosisRecord(family, mergedRaw(session, family.id), equipment, session, extraStops);
}

/**
 * The card update that adds this record. A record with a STOP goes FIRST in the
 * findings (F6); otherwise it is appended. Readings are appended; work done is not touched.
 */
export function recordToCardUpdate(card: Pick<JobCard, 'findings' | 'readings'> & Partial<Pick<JobCard, 'guidedSafety'>>, rec: DiagnosisRecord): CardUpdate & { guidedSafety?: GuidedSafety } {
  const old = card.findings.trim();
  const safety = recordSafety(rec);
  // Review R8: earlier records stay, below the STOP record, marked as made before it.
  // R-INT-3: below a hold-only record they are marked as made before the SAFETY HOLD, never "this STOP".
  const below = safety?.holdOnly
    ? 'NOTE: The findings below were recorded before this SAFETY HOLD. None of their running checks may be done while the hold stands.'
    : 'NOTE: The findings below were recorded before this STOP. None of their running checks may be done while the STOP stands.';
  const findings = !old ? rec.findings : rec.result.stopActive ? `${rec.findings}\n\n${below}\n\n${old}` : `${old}\n\n${rec.findings}`;
  // R-INT-2: a record made under the browser's safety state carries it as structured data (merge-only).
  // The store never takes this from a card edit: the recordGuidedSafety action sets it.
  return { findings, readings: [...card.readings, ...rec.readings], ...(safety ? { guidedSafety: mergeGuidedSafety(card.guidedSafety, safety.add, new Date().toISOString()) } : {}) };
}
