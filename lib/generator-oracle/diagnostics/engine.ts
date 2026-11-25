/**
 * Generator Oracle guided fault-finding engine (P1-A, 2026-11-14).
 * Deterministic: the same family, answers and engine version give the same
 * result. No AI, no random numbers, no invented limits.
 */
import type { Answers, Condition, DiagnosisResult, FaultFamily, Question, RankedCause } from './types';

export const DIAGNOSTIC_ENGINE_VERSION = 'oracle-diagnostics 1.1.0 (2026-11-25)';
const DISCLAIMER = 'A guided check list, not a manufacturer procedure. Confirm limits and procedures in the engine and controller manuals for this machine before replacing parts.';

/** Valid answers only: numbers inside the question's physical range, options that exist. */
export function validateAnswers(family: FaultFamily, raw: Answers): { answers: Answers; invalid: DiagnosisResult['invalid'] } {
  const answers: Answers = {};
  const invalid: DiagnosisResult['invalid'] = [];
  for (const q of family.questions) {
    const v = raw[q.id];
    if (v === undefined || v === '' || v === null) continue;
    if (q.kind === 'number') {
      const n = typeof v === 'number' ? v : Number(v);
      if (!Number.isFinite(n)) { invalid.push({ q: q.id, reason: `${q.text}: not a number` }); continue; }
      if (n < q.min || n > q.max) { invalid.push({ q: q.id, reason: `${q.text}: ${n} ${q.unit} is outside the possible range ${q.min}–${q.max} ${q.unit}; check the reading and the units` }); continue; }
      answers[q.id] = n;
    } else {
      const s = String(v);
      if (!q.options.some((o) => o.value === s)) { invalid.push({ q: q.id, reason: `${q.text}: "${s}" is not one of the options` }); continue; }
      answers[q.id] = s;
    }
  }
  // Cross-checks run on the single-answer-valid set; a refused pair is removed together.
  const refused = new Set<string>();
  for (const x of family.crossChecks ?? []) {
    if (evaluate(x.when, answers) !== true) continue;
    for (const id of x.refuse) if (answers[id] !== undefined && !refused.has(id)) { refused.add(id); invalid.push({ q: id, reason: x.reason }); }
  }
  for (const id of refused) delete answers[id];
  return { answers, invalid };
}

/** true / false, or null when the condition needs an unanswered question. */
export function evaluate(c: Condition, a: Answers): boolean | null {
  if ('all' in c) {
    const r = c.all.map((x) => evaluate(x, a));
    if (r.includes(false)) return false;
    return r.includes(null) ? null : true;
  }
  if ('any' in c) {
    const r = c.any.map((x) => evaluate(x, a));
    if (r.includes(true)) return true;
    return r.includes(null) ? null : false;
  }
  const v = a[c.q];
  if (v === undefined) return null;
  switch (c.op) {
    case 'is': return Array.isArray(c.value) ? c.value.includes(String(v)) : String(v) === c.value;
    case 'lt': return Number(v) < c.value;
    case 'le': return Number(v) <= c.value;
    case 'gt': return Number(v) > c.value;
    case 'ge': return Number(v) >= c.value;
    case 'ltRef':
    case 'gtRef': {
      const ref = a[c.ref];
      if (ref === undefined) return null;
      const limit = Number(ref) * (c.factor ?? 1);
      return c.op === 'ltRef' ? Number(v) < limit : Number(v) > limit;
    }
  }
}

/** Question ids a condition depends on. */
function questionsOf(c: Condition): string[] {
  if ('all' in c) return c.all.flatMap(questionsOf);
  if ('any' in c) return c.any.flatMap(questionsOf);
  return 'ref' in c ? [c.q, c.ref] : [c.q];
}

const WEIGHT = { supports: 1, strongly: 3, contradicts: -1, excludes: 0 } as const;

export function diagnose(family: FaultFamily, raw: Answers): DiagnosisResult {
  const { answers, invalid } = validateAnswers(family, raw);

  // Stop rules first; they are reported whatever else the evidence says.
  // Order: STOPs that fired, the family's mandatory safety, then CAUTIONs that fired.
  const fired = family.stopRules.filter((s) => evaluate(s.when, answers) === true);
  const stops = [
    ...fired.filter((s) => s.level === 'STOP').map((s) => ({ level: s.level, message: s.message })),
    ...(family.mandatorySafety ?? []).map((message) => ({ level: 'CAUTION' as const, message })),
    ...fired.filter((s) => s.level === 'CAUTION').map((s) => ({ level: s.level, message: s.message })),
  ];
  // A STOP withholds every check that needs the engine running or circuits live.
  const stopActive = fired.some((s) => s.level === 'STOP');

  const ranked: RankedCause[] = [];
  const excluded: DiagnosisResult['excluded'] = [];
  for (const cause of family.causes) {
    let score = 0;
    const pro: string[] = [];
    const con: string[] = [];
    let out: string | null = null;
    for (const e of cause.evidence) {
      if (evaluate(e.when, answers) !== true) continue;
      if (e.effect === 'excludes') { out = e.because; break; }
      score += WEIGHT[e.effect];
      (WEIGHT[e.effect] > 0 ? pro : con).push(e.because);
    }
    if (out) { excluded.push({ id: cause.id, title: cause.title, because: out }); continue; }
    const running = cause.runningChecks ?? [];
    ranked.push({
      id: cause.id, title: cause.title, score, for: pro, against: con,
      actions: stopActive ? [...cause.actions] : [...cause.actions, ...running],
      withheld: stopActive ? [...running] : [],
      reference: cause.reference,
    });
  }
  // Highest score first; ties keep the family's order (the usual-first order).
  const order = new Map(family.causes.map((c, i) => [c.id, i]));
  ranked.sort((x, y) => y.score - x.score || (order.get(x.id)! - order.get(y.id)!));

  // Next question: the unanswered one that appears in the evidence of the most
  // leading causes (the top three), so answering it separates them.
  const top = ranked.slice(0, 3).map((r) => family.causes.find((c) => c.id === r.id)!);
  const count = new Map<string, number>();
  for (const c of top) {
    const qs = new Set(c.evidence.flatMap((e) => questionsOf(e.when)).filter((q) => answers[q] === undefined));
    for (const q of qs) count.set(q, (count.get(q) ?? 0) + 1);
  }
  // Stop-rule questions come first when unanswered: safety before diagnosis.
  const stopQs = new Set(family.stopRules.flatMap((s) => questionsOf(s.when)).filter((q) => answers[q] === undefined));
  const byOrder = (a: string, b: string) => family.questions.findIndex((q) => q.id === a) - family.questions.findIndex((q) => q.id === b);
  const candidates = [...stopQs].sort(byOrder).concat([...count.entries()].sort((a, b) => b[1] - a[1] || byOrder(a[0], b[0])).map(([q]) => q).filter((q) => !stopQs.has(q)));
  // While a STOP is active, never offer a check that needs the engine running or circuits live.
  const nextId = candidates.find((q) => { const x = family.questions.find((y) => y.id === q); return !!x && !(stopActive && x.needsRunning); });
  const nextQuestion: Question | null = nextId ? family.questions.find((q) => q.id === nextId)! : null;

  return {
    family: family.id,
    engineVersion: DIAGNOSTIC_ENGINE_VERSION,
    stops,
    stopActive,
    invalid,
    ranked,
    excluded,
    nextQuestion,
    answered: Object.keys(answers).length,
    review: family.review,
    disclaimer: DISCLAIMER,
  };
}
