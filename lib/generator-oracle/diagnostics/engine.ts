/**
 * Generator Oracle guided fault-finding engine (P1-A, 2026-11-14; 1.2.0 2026-11-25).
 * Deterministic: the same family, answers and engine version give the same
 * result. No AI, no random numbers, no invented limits.
 *
 * Exact-threshold rule (management decision 2026-11-25): equality with a limit
 * counts as REACHING it. A reading strictly inside the limit entered is the
 * only "inside" case; at or beyond it the limit's classification decides:
 * shutdown → STOP, warning → CAUTION (never escalated), not stated → STOP for a
 * protective parameter ("treated as a shutdown limit because it has not been
 * classified") and CAUTION for a non-protective one (never clearing any STOP).
 * With no limit entered the status is NOT VERIFIED and no threshold is applied.
 */
import { LIMIT_CLASS_OPTIONS } from './types';
import type { Answers, Condition, DiagnosisResult, FaultFamily, LimitClass, LimitStatus, NumberQuestion, Question, RankedCause } from './types';

export const DIAGNOSTIC_ENGINE_VERSION = 'oracle-diagnostics 1.2.0 (2026-11-25)';
const DISCLAIMER = 'A guided check list, not a manufacturer procedure. Confirm limits and procedures in the engine and controller manuals for this machine before replacing parts.';
const NOT_VERIFIED = 'per OEM manual — NOT VERIFIED';
const SOURCE_MAX = 300;
/** Wording for a protective limit reached without a classification (management correction 2026-11-25). */
export const UNCLASSIFIED_PROTECTIVE = 'STOP — LIMIT REACHED, NOT CLASSIFIED: Treated as a shutdown limit because it has not been classified; confirm against the OEM manual.';

/** Companion answer keys of an OEM-limit question and of a limit reading. */
export const classKey = (limitId: string) => `${limitId}.class`;
export const sourceKey = (limitId: string) => `${limitId}.source`;
export const tolKey = (readingId: string) => `${readingId}.tol`;

/** Reading questions that have a tolerance companion (those used in a limit rule). */
export function limitReadings(family: FaultFamily): Set<string> {
  return new Set((family.limits ?? []).map((l) => l.reading));
}

/** Valid answers only: numbers inside the question's physical range, options that exist. */
export function validateAnswers(family: FaultFamily, raw: Answers): { answers: Answers; invalid: DiagnosisResult['invalid'] } {
  const answers: Answers = {};
  const invalid: DiagnosisResult['invalid'] = [];
  const blank = (v: unknown) => v === undefined || v === '' || v === null;
  const readings = limitReadings(family);
  for (const q of family.questions) {
    const v = raw[q.id];
    if (!blank(v)) {
      if (q.kind === 'number') {
        const n = typeof v === 'number' ? v : Number(v);
        if (!Number.isFinite(n)) invalid.push({ q: q.id, reason: `${q.text}: not a number` });
        else if (n < q.min || n > q.max) invalid.push({ q: q.id, reason: `${q.text}: ${n} ${q.unit} is outside the possible range ${q.min}–${q.max} ${q.unit}; check the reading and the units` });
        else answers[q.id] = n;
      } else {
        const s = String(v);
        if (!q.options.some((o) => o.value === s)) invalid.push({ q: q.id, reason: `${q.text}: "${s}" is not one of the options` });
        else answers[q.id] = s;
      }
    }
    if (q.kind === 'number' && q.oemLimit) {
      const c = raw[classKey(q.id)];
      if (!blank(c)) {
        if (LIMIT_CLASS_OPTIONS.some((o) => o.value === String(c))) answers[classKey(q.id)] = String(c);
        else invalid.push({ q: classKey(q.id), reason: `${q.text}: classification "${String(c)}" is not shutdown, warning or not stated` });
      }
      const s = raw[sourceKey(q.id)];
      if (!blank(s)) {
        const t = String(s).trim();
        if (t.length > SOURCE_MAX) invalid.push({ q: sourceKey(q.id), reason: `${q.text}: source is longer than ${SOURCE_MAX} characters` });
        else if (t) answers[sourceKey(q.id)] = t;
      }
    }
    if (q.kind === 'number' && readings.has(q.id)) {
      const t = raw[tolKey(q.id)];
      if (!blank(t)) {
        const n = typeof t === 'number' ? t : Number(t);
        if (!Number.isFinite(n) || n < 0 || n > q.max - q.min) invalid.push({ q: tolKey(q.id), reason: `${q.text}: measurement tolerance must be a number from 0 to ${q.max - q.min} ${q.unit}` });
        else answers[tolKey(q.id)] = n;
      }
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
    case 'gtRef':
    case 'leRef':
    case 'geRef': {
      const ref = a[c.ref];
      if (ref === undefined) return null;
      const limit = Number(ref) * (c.factor ?? 1);
      const n = Number(v);
      return c.op === 'ltRef' ? n < limit : c.op === 'gtRef' ? n > limit : c.op === 'leRef' ? n <= limit : n >= limit;
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

/** Status of every limit rule (exact-threshold rule). */
export function limitStatuses(family: FaultFamily, answers: Answers): LimitStatus[] {
  return (family.limits ?? []).map((l): LimitStatus => {
    const rq = family.questions.find((q) => q.id === l.reading) as NumberQuestion;
    const lq = family.questions.find((q) => q.id === l.limit) as NumberQuestion;
    const direction = lq.oemLimit!.direction;
    const param = lq.oemLimit!.parameter;
    const v = answers[l.reading] as number | undefined;
    const L = answers[l.limit] as number | undefined;
    const classification = (answers[classKey(l.limit)] as LimitClass | undefined) ?? null;
    const source = (answers[sourceKey(l.limit)] as string | undefined) ?? null;
    const tolerance = (answers[tolKey(l.reading)] as number | undefined) ?? null;
    const base = { id: l.id, reading: l.reading, limit: l.limit, direction, classification, source, tolerance, value: v ?? null, limitValue: L ?? null };
    const u = rq.unit;
    const cmp = direction === 'min' ? '≤' : '≥';
    const prov = `${param} ${L} ${u} (${direction === 'min' ? 'minimum' : 'maximum'}), classified ${classification === 'shutdown' ? 'SHUTDOWN' : classification === 'warning' ? 'WARNING' : 'NOT STATED'}, source: ${source ?? 'NOT GIVEN'}; entered by the technician — not verified by EmersonEIMS`;
    if (L === undefined) return { ...base, status: 'not-verified', level: null, text: `${param}: no limit entered — ${NOT_VERIFIED}. No threshold is applied to ${rq.text.toLowerCase()}.` };
    if (v === undefined) return { ...base, status: 'not-verified', level: null, text: `${param} entered (${L} ${u}) but no reading yet: nothing is judged.` };
    const reached = direction === 'min' ? v <= L : v >= L;
    if (reached) {
      if (classification === 'shutdown') return { ...base, status: 'reached', level: 'STOP', text: `${l.shutdown} [Reading ${v} ${u} ${cmp} ${prov}.]` };
      if (classification === 'warning') return { ...base, status: 'reached', level: 'CAUTION', text: `${l.warning} [Reading ${v} ${u} ${cmp} ${prov}.]` };
      if (l.protective) return { ...base, status: 'reached', level: 'STOP', text: `${UNCLASSIFIED_PROTECTIVE} ${l.shutdown} [Reading ${v} ${u} ${cmp} ${prov}.]` };
      return { ...base, status: 'reached', level: 'CAUTION', text: `LIMIT REACHED — NOT CLASSIFIED: ${rq.text} ${v} ${u} has reached the ${param.toLowerCase()} entered (${L} ${u}), but the source does not say whether it is a warning or a shutdown value. Shown as CAUTION, not as a confirmed shutdown; this does not clear any STOP. Confirm the classification in the manual now. If it is the shutdown value: ${l.shutdown} [Reading ${v} ${u} ${cmp} ${prov}.]` };
    }
    if (tolerance !== null && Math.abs(v - L) <= tolerance) {
      return { ...base, status: 'near', level: 'CAUTION', text: `AT OR NEAR THE LIMIT: ${rq.text} ${v} ${u} is within the measurement tolerance entered (±${tolerance} ${u}) of the ${param.toLowerCase()} (${L} ${u}); the true value may already have reached it. Re-measure with a calibrated or mechanical instrument before relying on it.${classification === 'shutdown' ? ` This is a shutdown value: if the re-measurement confirms it — ${l.shutdown}` : ''} [${prov}.]` };
    }
    return { ...base, status: 'inside', level: null, text: `${rq.text} ${v} ${u} is inside the ${param.toLowerCase()} entered (${prov}); no limit alarm from this reading.` };
  });
}

export function diagnose(family: FaultFamily, raw: Answers): DiagnosisResult {
  const { answers, invalid } = validateAnswers(family, raw);

  // Stop rules first; they are reported whatever else the evidence says.
  // Order: STOPs (rules, then limits), the family's mandatory safety, then CAUTIONs (rules, then limits).
  const fired = family.stopRules.filter((s) => evaluate(s.when, answers) === true);
  const limits = limitStatuses(family, answers);
  const stops = [
    ...fired.filter((s) => s.level === 'STOP').map((s) => ({ level: s.level, message: s.message })),
    ...limits.filter((l) => l.level === 'STOP').map((l) => ({ level: 'STOP' as const, message: l.text })),
    ...(family.mandatorySafety ?? []).map((message) => ({ level: 'CAUTION' as const, message })),
    ...fired.filter((s) => s.level === 'CAUTION').map((s) => ({ level: s.level, message: s.message })),
    ...limits.filter((l) => l.level === 'CAUTION').map((l) => ({ level: 'CAUTION' as const, message: l.text })),
  ];
  // A STOP withholds every check that needs the engine running or circuits live.
  const stopActive = stops.some((s) => s.level === 'STOP');

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
  // Safety before diagnosis: a reached limit without its classification is asked
  // first, then unanswered stop-rule and limit questions, in question order.
  const unclassified = (family.limits ?? []).filter((l) => answers[l.limit] !== undefined && answers[l.reading] !== undefined && answers[classKey(l.limit)] === undefined).map((l) => l.limit);
  const stopQs = new Set([
    ...family.stopRules.flatMap((s) => questionsOf(s.when)),
    ...(family.limits ?? []).flatMap((l) => [l.reading, l.limit]),
  ].filter((q) => answers[q] === undefined));
  const byOrder = (a: string, b: string) => family.questions.findIndex((q) => q.id === a) - family.questions.findIndex((q) => q.id === b);
  const candidates = [...new Set([...unclassified, ...[...stopQs].sort(byOrder), ...[...count.entries()].sort((a, b) => b[1] - a[1] || byOrder(a[0], b[0])).map(([q]) => q)])];
  // While a STOP is active, never offer a check that needs the engine running or circuits live.
  const nextId = candidates.find((q) => { const x = family.questions.find((y) => y.id === q); return !!x && !(stopActive && x.needsRunning); });
  const nextQuestion: Question | null = nextId ? family.questions.find((q) => q.id === nextId)! : null;

  return {
    family: family.id,
    engineVersion: DIAGNOSTIC_ENGINE_VERSION,
    stops,
    stopActive,
    limits,
    invalid,
    ranked,
    excluded,
    nextQuestion,
    answered: family.questions.filter((q) => answers[q.id] !== undefined).length,
    review: family.review,
    disclaimer: DISCLAIMER,
  };
}
