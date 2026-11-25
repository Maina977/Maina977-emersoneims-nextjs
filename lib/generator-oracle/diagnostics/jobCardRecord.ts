/**
 * A guided diagnosis as a job-card record (2026-11-25).
 *
 * diagnosisRecord() runs the same diagnose() as the Guided Diagnosis tab and
 * writes its result as text (for the job card findings, and for the .txt
 * download on the Guided Diagnosis tab) plus test readings (measured numeric
 * answers). The job-card .txt and PDF are built from the card, so the screen,
 * the download, the card and its exports all carry the same words.
 *
 * Reading limits: only an OEM figure that a STOP rule compares the reading
 * against (q < ref → minimum, q > ref → maximum, factor 1) is attached, with the
 * source "entered by the technician … — NOT VERIFIED". Nothing else is judged.
 */
import { diagnose } from './engine';
import { answersFromRaw } from './session';
import { NOT_VERIFIED, referencesFor, type Equipment } from './oemReferences';
import type { Condition, DiagnosisResult, FaultFamily, Question } from './types';
import type { JobCard, Reading } from '@/lib/generator-oracle/service/maintenance';
import type { CardUpdate } from '@/lib/generator-oracle/service/store';

export const RECORD_HEADER = 'GUIDED DIAGNOSIS';

/** q → { min?: refId, max?: refId } from simple STOP comparisons (factor 1 only). */
function stopLimits(family: FaultFamily): Map<string, { min?: string; max?: string }> {
  const m = new Map<string, { min?: string; max?: string }>();
  const walk = (c: Condition): void => {
    if ('all' in c) return c.all.forEach(walk);
    if ('any' in c) return c.any.forEach(walk);
    if ((c.op === 'ltRef' || c.op === 'gtRef') && (c.factor ?? 1) === 1) {
      const e = m.get(c.q) ?? {};
      if (c.op === 'ltRef') e.min = c.ref; else e.max = c.ref;
      m.set(c.q, e);
    }
  };
  family.stopRules.filter((s) => s.level === 'STOP').forEach((s) => walk(s.when));
  return m;
}

/** Ids of questions that hold an OEM / settings-sheet figure (used as a `ref`). */
export function refQuestions(family: FaultFamily): Set<string> {
  const out = new Set<string>();
  const walk = (c: Condition): void => {
    if ('all' in c) return c.all.forEach(walk);
    if ('any' in c) return c.any.forEach(walk);
    if ('ref' in c) out.add(c.ref);
  };
  family.stopRules.forEach((s) => walk(s.when));
  family.causes.forEach((c) => c.evidence.forEach((e) => walk(e.when)));
  (family.crossChecks ?? []).forEach((x) => walk(x.when));
  return out;
}

const answerText = (q: Question, v: string | number | boolean): string =>
  q.kind === 'number' ? `${v} ${q.unit}` : (q.options.find((o) => o.value === v)?.label ?? String(v));

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
  const refs = refQuestions(family);
  const limits = stopLimits(family);

  const lines: string[] = [];
  lines.push(`${RECORD_HEADER}: ${family.title} [${family.id}] — ${result.engineVersion}; content status: ${result.review}.`);
  lines.push(`Not a manufacturer procedure. ${result.disclaimer}`);
  for (const s of result.stops) lines.push(`${s.level}: ${s.message}`);
  lines.push(`Equipment selected for published references: engine ${equipment.engine ?? 'none / not listed'}; controller ${equipment.controller ?? 'none / not listed'}.`);
  const published = referencesFor(equipment, family.id);
  if (published.length) {
    lines.push('Published references shown (context only; not entered as answers, not used by any rule):');
    for (const r of published) lines.push(`- ${r.text}`);
  } else lines.push(`Published references: none held for the selected equipment — machine limits ${NOT_VERIFIED}.`);
  lines.push(`Answers (${valid.size} of ${family.questions.length}):`);
  for (const q of family.questions) {
    const v = valid.get(q.id);
    if (v === undefined) continue;
    const oem = refs.has(q.id) ? ' [OEM / settings-sheet figure entered by the technician — NOT VERIFIED]' : '';
    lines.push(`- ${q.text}: ${answerText(q, v)}${oem}`);
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

  const readings: Reading[] = [];
  for (const q of family.questions) {
    const v = valid.get(q.id);
    if (q.kind !== 'number' || v === undefined || refs.has(q.id)) continue;
    const r: Reading = { name: q.text, value: Number(v), unit: q.unit };
    const lim = limits.get(q.id);
    const src = (refId: string) => {
      const rq = family.questions.find((x) => x.id === refId)!;
      return `OEM figure entered by the technician in Guided Diagnosis (${rq.text}) — NOT VERIFIED`;
    };
    const minV = lim?.min !== undefined ? valid.get(lim.min) : undefined;
    const maxV = lim?.max !== undefined ? valid.get(lim.max) : undefined;
    if (minV !== undefined) r.min = Number(minV);
    if (maxV !== undefined) r.max = Number(maxV);
    if (minV !== undefined || maxV !== undefined) r.limitSource = [minV !== undefined ? src(lim!.min!) : null, maxV !== undefined ? src(lim!.max!) : null].filter(Boolean).join('; ');
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
