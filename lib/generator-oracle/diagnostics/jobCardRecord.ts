/**
 * A guided diagnosis as a job-card record (2026-11-25).
 *
 * diagnosisRecord() runs the same diagnose() as the Guided Diagnosis tab and
 * writes its result as text (for the job card findings, and for the .txt
 * download on the Guided Diagnosis tab) plus test readings (measured numeric
 * answers). The job-card .txt and PDF are built from the card, so the screen,
 * the download, the card and its exports all carry the same words.
 *
 * Provenance: every OEM figure used by a rule is written with its parameter,
 * value and units, its classification (shutdown / warning / not stated), the
 * source the technician typed (manual ID, revision, page) and the equipment it
 * applies to (manufacturer, model, variant as typed). Reading limits on the
 * card come only from the family's limit rules, with that same source text.
 */
import { classKey, diagnose, sourceKey, tolKey } from './engine';
import { answersFromRaw } from './session';
import { NOT_VERIFIED, referencesFor, type Equipment } from './oemReferences';
import type { DiagnosisResult, FaultFamily, LimitClass, NumberQuestion, Question } from './types';
import type { JobCard, Reading } from '@/lib/generator-oracle/service/maintenance';
import type { CardUpdate } from '@/lib/generator-oracle/service/store';

export const RECORD_HEADER = 'GUIDED DIAGNOSIS';

/** Ids of questions that hold an OEM / settings-sheet figure. */
export function refQuestions(family: FaultFamily): Set<string> {
  return new Set(family.questions.filter((q) => q.kind === 'number' && q.oemLimit).map((q) => q.id));
}

const answerText = (q: Question, v: string | number | boolean): string =>
  q.kind === 'number' ? `${v} ${q.unit}` : (q.options.find((o) => o.value === v)?.label ?? String(v));

const CLASS_TEXT: Record<LimitClass, string> = { shutdown: 'SHUTDOWN value', warning: 'WARNING value', 'not-stated': 'classification NOT STATED (treated as CAUTION)' };

/** The equipment an entered limit applies to, as typed by the technician. */
export function equipmentText(eq: Equipment): string {
  const parts = [`manufacturer ${eq.manufacturer ?? 'NOT GIVEN'}`, `model ${eq.model ?? 'NOT GIVEN'}`, `variant/configuration ${eq.variant ?? 'NOT GIVEN'}`];
  return parts.join('; ');
}

export interface DiagnosisRecord {
  result: DiagnosisResult;
  /** One entry per line, as written to the job card findings and the .txt download. */
  lines: string[];
  findings: string;
  readings: Reading[];
}

export function diagnosisRecord(family: FaultFamily, raw: Record<string, string> | undefined, equipment: Equipment = {}): DiagnosisRecord {
  const answers = answersFromRaw(family, raw);
  const result = diagnose(family, answers);
  const valid = new Map(Object.entries(answers).filter(([k]) => !result.invalid.some((i) => i.q === k)));
  const oemQs = refQuestions(family);

  const lines: string[] = [];
  lines.push(`${RECORD_HEADER}: ${family.title} [${family.id}] — ${result.engineVersion}; content status: ${result.review}.`);
  lines.push(`Not a manufacturer procedure. ${result.disclaimer}`);
  for (const s of result.stops) { lines.push(`${s.level}: ${s.message}`); if (s.label) lines.push(s.label); }
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
    lines.push(`- ${q.oemLimit!.parameter}: ${valid.get(q.id)} ${q.unit} (${q.oemLimit!.direction === 'min' ? 'minimum' : 'maximum'}); ${CLASS_TEXT[cls]}; source (manual ID, revision, page): ${valid.get(sourceKey(q.id)) ?? 'NOT GIVEN'}; applies only to: ${equipmentText(equipment)}.`);
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
  lines.push('Likely causes, most supported first:');
  result.ranked.forEach((c, i) => {
    const why = [...c.for.map((x) => `+ ${x}`), ...c.against.map((x) => `− ${x}`)].join('; ');
    lines.push(`${i + 1}. ${c.title} (evidence ${c.score >= 0 ? '+' : ''}${c.score}${why ? `: ${why}` : ''})`);
    if (i < 3 && c.score > 0) for (const a of c.actions) lines.push(`   - ${a}`);
    if (i < 3 && c.score > 0 && c.withheld.length) lines.push(`   - Withheld while a STOP is active: ${c.withheld.length} check(s) that need the engine running.`);
  });
  if (result.excluded.length) {
    lines.push('Ruled out:');
    for (const e of result.excluded) lines.push(`- ${e.title}: ${e.because}`);
  }
  lines.push(result.nextQuestion
    ? `Next check: ${result.nextQuestion.text}${result.nextQuestion.kind === 'number' ? ` (${result.nextQuestion.unit})` : ''}`
    : (result.stopActive ? 'Next check: none offered while a STOP is active beyond the stopped-and-isolated checks above.' : 'Next check: all questions answered.'));

  // Test readings: measured numbers only (not OEM figures, not rating-plate values).
  const readings: Reading[] = [];
  for (const q of family.questions) {
    const v = valid.get(q.id);
    if (q.kind !== 'number' || v === undefined || oemQs.has(q.id) || q.ratingPlate) continue;
    const r: Reading = { name: q.text, value: Number(v), unit: q.unit };
    const srcs: string[] = [];
    for (const l of (family.limits ?? []).filter((x) => x.reading === q.id)) {
      const L = valid.get(l.limit);
      if (L === undefined) continue;
      const lq = family.questions.find((x) => x.id === l.limit) as NumberQuestion;
      const cls = (valid.get(classKey(l.limit)) as LimitClass | undefined) ?? 'not-stated';
      if (lq.oemLimit!.direction === 'min') r.min = Number(L); else r.max = Number(L);
      srcs.push(`${lq.oemLimit!.parameter} — ${CLASS_TEXT[cls]}, source: ${valid.get(sourceKey(l.limit)) ?? 'NOT GIVEN'}; entered by the technician — NOT VERIFIED; equality counts as reaching it`);
    }
    if (srcs.length) r.limitSource = srcs.join(' | ');
    readings.push(r);
  }
  return { result, lines, findings: lines.join('\n'), readings };
}

/** The card update that adds this record: findings appended, readings appended. Work done is not touched. */
export function recordToCardUpdate(card: Pick<JobCard, 'findings' | 'readings'>, rec: DiagnosisRecord): CardUpdate {
  return {
    findings: card.findings.trim() ? `${card.findings.trim()}\n\n${rec.findings}` : rec.findings,
    readings: [...card.readings, ...rec.readings],
  };
}
