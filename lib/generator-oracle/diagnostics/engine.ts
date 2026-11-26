/**
 * Generator Oracle guided fault-finding engine (P1-A, 2026-11-14; 1.3.0 2026-11-25).
 * Deterministic: the same family, answers and engine version give the same
 * result. No AI, no random numbers, no invented limits.
 *
 * Exact-threshold rule (management decision 2026-11-25): equality with a limit
 * counts as REACHING it. A reading strictly inside the limit entered is the
 * only "inside" case; at or beyond it the limit's classification decides:
 * shutdown → STOP, warning → CAUTION (never escalated), not stated → the
 * conservative software STOP for a protective parameter and CAUTION for a
 * non-protective one. A reading within the measurement tolerance of a shutdown
 * (or unclassified protective) limit is treated as reaching it: STOP.
 * With no limit entered the status is NOT VERIFIED and no threshold is applied.
 *
 * STOP-first (independent safety review 2026-11-25): while any STOP is active —
 * from this family, the shared safety screen, or another family of the same
 * session — running checks and running-only questions are withheld, and no
 * CAUTION that implies continued running is shown (it is replaced by its
 * stopped-engine wording or dropped).
 */
import { LIMIT_CLASS_OPTIONS } from './types';
import type { Answers, Condition, DiagnosisResult, FaultFamily, LimitClass, LimitStatus, NumberQuestion, Question, RankedCause } from './types';

export const DIAGNOSTIC_ENGINE_VERSION = 'oracle-diagnostics 1.3.0 (2026-11-25)';
const DISCLAIMER = 'A guided check list, not a manufacturer procedure. Confirm limits and procedures in the engine and controller manuals for this machine before replacing parts.';
const NOT_VERIFIED = 'per OEM manual — NOT VERIFIED';
const SOURCE_MAX = 300;
// Wording set by management (2026-11-25), used verbatim on screen, in the job-card findings, .txt and PDF.
export const UNCLASSIFIED_PROTECTIVE = 'STOP — Protective threshold classification not verified. Do not continue operating until the applicable manufacturer limits have been confirmed by a qualified technician.';
export const SAFEGUARD_LABEL = 'This is a conservative software safeguard, not a manufacturer instruction.';

/** Companion answer keys of an OEM-limit question and of a limit reading. */
export const classKey = (limitId: string) => `${limitId}.class`;
export const sourceKey = (limitId: string) => `${limitId}.source`;
export const tolKey = (readingId: string) => `${readingId}.tol`;

/** Reading questions that have a tolerance companion (those used in a limit rule). */
export function limitReadings(family: FaultFamily): Set<string> {
  return new Set((family.limits ?? []).map((l) => l.reading));
}

/** OEM-limit question ids used by a protective limit rule. */
export function protectiveLimitIds(family: FaultFamily): Set<string> {
  return new Set((family.limits ?? []).filter((l) => l.protective).map((l) => l.limit));
}

const DECIMAL = /^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;
/**
 * A plain decimal number. Accepts "." or a single "," as the decimal mark.
 * Refuses hexadecimal, exponents, Infinity, spaces inside the number, and a
 * comma followed by exactly three digits ("1,500" could be 1.5 or 1500).
 */
export function parseDecimal(v: unknown): { ok: true; n: number } | { ok: false; why: string } {
  if (typeof v === 'number') return Number.isFinite(v) ? { ok: true, n: v } : { ok: false, why: 'not a finite number' };
  const s = String(v).trim();
  if (/^[+-]?\d+,\d{3}$/.test(s)) return { ok: false, why: `"${s}" is ambiguous (a thousands separator or a decimal comma?): type it without the comma, or with "." as the decimal mark` };
  if (!DECIMAL.test(s)) return { ok: false, why: `"${s}" is not a plain decimal number (digits with "." or "," as the decimal mark; no hexadecimal, exponents or units)` };
  return { ok: true, n: Number(s.replace(',', '.')) };
}

/** Valid answers only: numbers inside the question's physical range, options that exist. */
export function validateAnswers(family: FaultFamily, raw: Answers): { answers: Answers; invalid: DiagnosisResult['invalid'] } {
  const answers: Answers = {};
  const invalid: DiagnosisResult['invalid'] = [];
  const blank = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
  const readings = limitReadings(family);
  for (const q of family.questions) {
    const v = raw[q.id];
    if (!blank(v)) {
      if (q.kind === 'number') {
        const p = parseDecimal(v);
        if (!p.ok) invalid.push({ q: q.id, reason: `${q.text} (${q.unit}): ${p.why}` });
        else if (p.n < q.min || p.n > q.max) invalid.push({ q: q.id, reason: `${q.text}: ${p.n} ${q.unit} is outside the possible range ${q.min}–${q.max} ${q.unit}; check the reading and the units` });
        else answers[q.id] = p.n;
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
        else answers[sourceKey(q.id)] = t;
      }
    }
    if (q.kind === 'number' && readings.has(q.id)) {
      const t = raw[tolKey(q.id)];
      if (!blank(t)) {
        const p = parseDecimal(t);
        if (!p.ok || p.n < 0 || p.n > q.max - q.min) invalid.push({ q: tolKey(q.id), reason: `${q.text}: measurement tolerance must be a plain decimal number from 0 to ${q.max - q.min} ${q.unit}` });
        else answers[tolKey(q.id)] = p.n;
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
    const base = { id: l.id, reading: l.reading, limit: l.limit, direction, parameter: lq.oemLimit!.parameter, unit: rq.unit, classification, source, tolerance, value: v ?? null, limitValue: L ?? null, alert: null as string | null, label: null as string | null };
    const u = rq.unit;
    const cmp = direction === 'min' ? '≤' : '≥';
    const prov = `${param} ${L} ${u} (${direction === 'min' ? 'minimum' : 'maximum'}), classified ${classification === 'shutdown' ? 'SHUTDOWN' : classification === 'warning' ? 'WARNING' : 'NOT STATED'}, source: ${source ?? 'NOT GIVEN'}; entered by the technician — not verified by EmersonEIMS`;
    if (L === undefined) return { ...base, status: 'not-verified', level: null, text: `${param}: no limit entered — ${NOT_VERIFIED}. No threshold is applied to ${rq.text.toLowerCase()}.` };
    if (v === undefined) return { ...base, status: 'not-verified', level: null, text: `${param} entered (${L} ${u}) but no reading yet: nothing is judged.` };
    const reached = direction === 'min' ? v <= L : v >= L;
    const near = !reached && tolerance !== null && Math.abs(v - L) <= tolerance;
    const unclassified = classification !== 'shutdown' && classification !== 'warning';
    if (reached || near) {
      const where = reached ? `Reading ${v} ${u} ${cmp}` : `Reading ${v} ${u} is within the measurement tolerance entered (±${tolerance} ${u}) of`;
      if (unclassified && l.protective) {
        return { ...base, status: reached ? 'reached' : 'near', level: 'STOP', alert: UNCLASSIFIED_PROTECTIVE, label: SAFEGUARD_LABEL, text: `${UNCLASSIFIED_PROTECTIVE} ${SAFEGUARD_LABEL} [${where} ${param} ${L} ${u} entered, classification not stated, source: ${source ?? 'NOT GIVEN'}.]` };
      }
      if (classification === 'shutdown') {
        const t = reached
          ? `${l.shutdown} [${where} ${prov}.]`
          : `STOP — AT OR NEAR A SHUTDOWN LIMIT: the reading is within the measurement tolerance entered, so the shutdown value may already have been reached; it is treated as reached. ${l.shutdown} [${where} ${prov}.]`;
        return { ...base, status: reached ? 'reached' : 'near', level: 'STOP', text: t, alert: t };
      }
      if (classification === 'warning') {
        const t = reached ? `${l.warning} [${where} ${prov}.]` : `AT OR NEAR A WARNING VALUE: the warning value may already have been reached; check the instrument and its calibration. [${where} ${prov}.]`;
        return { ...base, status: reached ? 'reached' : 'near', level: 'CAUTION', text: t, alert: t };
      }
      const t = `LIMIT ${reached ? 'REACHED' : 'AT OR NEAR'} — NOT CLASSIFIED: ${rq.text} ${v} ${u} ${reached ? 'has reached' : 'is at or near'} the ${param.toLowerCase()} entered (${L} ${u}), but the source does not say whether it is a warning or a shutdown value. Shown as CAUTION, not as a confirmed shutdown; this does not clear any STOP. Confirm the classification in the manual with a qualified technician. [${where} ${prov}.]`;
      return { ...base, status: reached ? 'reached' : 'near', level: 'CAUTION', text: t, alert: t };
    }
    return { ...base, status: 'inside', level: null, text: `${rq.text} ${v} ${u} is inside the ${param.toLowerCase()} entered (${prov}); no limit alarm from this reading.` };
  });
}

/** Wording for a limit CAUTION while a STOP is active: a record only, nothing that implies running. */
const cautionUnderStop = (l: LimitStatus, why: string) => `Also recorded for the investigation (${why}): ${l.parameter} ${l.limitValue} ${l.unit} (${l.classification === 'warning' ? 'warning value' : 'classification not stated'}) ${l.status === 'near' ? 'is within the measurement tolerance of' : 'has been reached by'} the reading ${l.value} ${l.unit}; source: ${l.source ?? 'NOT GIVEN'}.`;

export interface DiagnoseOptions {
  /** STOPs raised in other families of the same session (see sessionSafety.ts). */
  externalStops?: Array<{ family: string; message: string; label?: string }>;
}

/** Why running is withheld, for the record-only caution wording. */
const withheldWhy = (stopActive: boolean) => (stopActive ? 'the STOP above applies' : 'running is withheld: a leading cause says do not run');

/** A cause reference that is general service practice only (no published source, edition or page). */
const GENERAL_PRACTICE = /^General (diesel generator|alternator) service practice\b/;
export const isGeneralPracticeOnly = (reference: string) => GENERAL_PRACTICE.test(reference.trim());
/** A reference that says it was not verified (e.g. a standard "cited by title only; clauses and values NOT VERIFIED"). */
const MARKED_NOT_VERIFIED = /\bnot verified\b|\bunverified\b|\bcited by title only\b/i;
/** A specific clause, section, table or page ... */
const CLAUSE_OR_PAGE = /\b(clause|cl\.|section|sect\.|table|page|p\.|pp\.)\s*[A-Z]?\d/i;
/** ... and the edition or year it applies to. */
const EDITION = /\b(edition|ed\.|rev(ision)?\.?)\s*\S|\b(19|20)\d{2}\b/i;
/**
 * Management rule (2026-11-27): an unverified source is never presented as confirmed. A cause reference counts
 * as a verified published source only when it names a specific clause/section/table/page AND an edition or
 * year, and is not marked NOT VERIFIED. General practice, a source marked NOT VERIFIED, and a title-only
 * citation without clause/page and edition are all UNVERIFIED.
 */
export const isUnverifiedReference = (reference: string) => {
  const r = reference.trim();
  return isGeneralPracticeOnly(r) || MARKED_NOT_VERIFIED.test(r) || !CLAUSE_OR_PAGE.test(r) || !EDITION.test(r);
};
/** Shown wherever an unverified cause is listed. */
export const UNVERIFIED_CAUSE_LABEL = 'UNVERIFIED — no verified source (general practice, or a source not verified to clause or page and edition); not a recommendation';
/** Shown when no cause with a verified published source is supported by the answers. */
export const NO_VERIFIED_LEAD = 'No cause with a verified published source (clause or page, and edition) is supported by these answers: the causes below are UNVERIFIED (general practice, or a standard or guide cited by title only and not verified). They are listed by evidence for information, not recommended; confirm with the OEM manual.';

export function diagnose(family: FaultFamily, raw: Answers, opts: DiagnoseOptions = {}): DiagnosisResult {
  const { answers, invalid } = validateAnswers(family, raw);

  const fired = family.stopRules.filter((s) => evaluate(s.when, answers) === true);
  const raw0 = limitStatuses(family, answers);
  const external = opts.externalStops ?? [];
  const stopActive = external.length > 0 || fired.some((s) => s.level === 'STOP') || raw0.some((l) => l.level === 'STOP');

  const ranked: RankedCause[] = [];
  const excluded: DiagnosisResult['excluded'] = [];
  const scored: Array<{ cause: FaultFamily['causes'][number]; score: number; pro: string[]; con: string[] }> = [];
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
    scored.push({ cause, score, pro, con });
  }
  // Highest score first; ties keep the family's order (the usual-first order).
  const order = new Map(family.causes.map((c, i) => [c.id, i]));
  scored.sort((x, y) => y.score - x.score || (order.get(x.cause.id)! - order.get(y.cause.id)!));
  // A leading "do not run" cause withholds running checks as firmly as a STOP does.
  const runningWithheld = stopActive || scored.slice(0, 3).some((s) => s.score > 0 && s.cause.doNotRun);
  // Whenever running is withheld (a STOP, or a leading "do not run" cause — review R3), a limit
  // CAUTION is a record only, everywhere it is shown: nothing that implies running (F2).
  const why = withheldWhy(stopActive);
  const limits = runningWithheld ? raw0.map((l) => (l.level === 'CAUTION' ? { ...l, text: cautionUnderStop(l, why), alert: cautionUnderStop(l, why) } : l)) : raw0;
  // CA-31 quarantine: a supported cause with a verified published source is listed before every
  // unverified cause (isUnverifiedReference); otherwise the evidence order is kept (running checks and the next
  // question above still use the evidence order, so the STOP-first behaviour is unchanged).
  const sourcedLead = (s: (typeof scored)[number]) => (s.score > 0 && !isUnverifiedReference(s.cause.reference) ? 1 : 0);
  const listed = [...scored].sort((x, y) => sourcedLead(y) - sourcedLead(x));
  for (const { cause, score, pro, con } of listed) {
    const running = cause.runningChecks ?? [];
    ranked.push({
      id: cause.id, title: cause.title, score, for: pro, against: con,
      actions: runningWithheld ? [...cause.actions] : [...cause.actions, ...running],
      withheld: runningWithheld ? [...running] : [],
      reference: cause.reference,
      unverified: isUnverifiedReference(cause.reference),
    });
  }

  // Safety messages. STOPs first (screen, family rules, limits, then other families),
  // the family's mandatory safety, then CAUTIONs — rewritten or dropped under a STOP.
  type Msg = DiagnosisResult['stops'][number];
  const stops: Msg[] = [];
  for (const s of fired.filter((x) => x.level === 'STOP')) stops.push({ level: 'STOP', message: s.message, ...(s.label ? { label: s.label } : {}), origin: s.screen ? 'screen' : 'family' });
  for (const l of limits.filter((x) => x.level === 'STOP')) stops.push({ level: 'STOP', message: l.alert ?? l.text, ...(l.label ? { label: l.label } : {}), origin: 'family' });
  // Review R7: a STOP from another family keeps its exact wording; where it was raised is a separate line.
  for (const e of external) stops.push({ level: 'STOP', message: e.message, ...(e.label ? { label: e.label } : {}), origin: 'other-family', from: e.family });
  for (const m of family.mandatorySafety ?? []) stops.push({ level: 'CAUTION', message: m, origin: 'family' });
  for (const s of fired.filter((x) => x.level === 'CAUTION')) {
    if (!runningWithheld) stops.push({ level: 'CAUTION', message: s.message, origin: s.screen ? 'screen' : 'family' });
    else if (s.underStop === undefined) stops.push({ level: 'CAUTION', message: s.message, origin: s.screen ? 'screen' : 'family' });
    else if (s.underStop !== null) stops.push({ level: 'CAUTION', message: s.underStop, origin: s.screen ? 'screen' : 'family' });
  }
  for (const l of limits.filter((x) => x.level === 'CAUTION')) stops.push({ level: 'CAUTION', message: l.alert ?? l.text, origin: 'family' });

  // Next question: the unanswered one that appears in the evidence of the most
  // leading causes (the top three), so answering it separates them.
  const top = scored.slice(0, 3).map((r) => r.cause);
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
  // While running is withheld, never offer a check that needs the engine running or circuits live.
  const nextId = candidates.find((q) => { const x = family.questions.find((y) => y.id === q); return !!x && !(runningWithheld && x.needsRunning); });
  const nextQuestion: Question | null = nextId ? family.questions.find((q) => q.id === nextId)! : null;

  return {
    family: family.id,
    engineVersion: DIAGNOSTIC_ENGINE_VERSION,
    stops,
    stopActive,
    runningWithheld,
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
