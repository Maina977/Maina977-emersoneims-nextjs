/**
 * Generator Oracle guided fault-finding: types (P1-A, 2026-11-14).
 *
 * A fault family is a deterministic decision procedure: questions (measured
 * values with units, or observations), causes with the observations that
 * support or contradict them, and stop rules that override everything.
 * Numeric limits are never invented: anything machine-specific (for example
 * the OEM minimum oil pressure) is a question the technician answers from the
 * manual, and rules compare against that answer.
 */

export type Answer = number | string | boolean;
export type Answers = Record<string, Answer | undefined>;

export interface NumberQuestion {
  id: string;
  kind: 'number';
  text: string;
  unit: string;
  /** Physically possible range; outside it the answer is refused, never clipped. */
  min: number;
  max: number;
  help?: string;
  /** Answering needs the engine running or circuits live: never offered as the next check while a STOP is active. */
  needsRunning?: boolean;
  /**
   * This question holds an OEM figure typed from the manual or settings sheet.
   * Two companion answers go with it: `<id>.class` (shutdown / warning /
   * not-stated) and `<id>.source` (manual ID, revision, page). `direction`
   * says which side is the limit: a reading reaches a 'min' limit at or below
   * it, a 'max' limit at or above it.
   */
  oemLimit?: { direction: 'min' | 'max'; parameter: string };
  /** A rating-plate value (not an OEM limit): compared with, never classified. */
  ratingPlate?: boolean;
}
export interface ChoiceQuestion {
  id: string;
  kind: 'choice';
  text: string;
  options: Array<{ value: string; label: string }>;
  help?: string;
  /** Answering needs the engine running or circuits live: never offered as the next check while a STOP is active. */
  needsRunning?: boolean;
}
export type Question = NumberQuestion | ChoiceQuestion;

/** A condition on the answers. `ref` compares with another answer (e.g. an OEM limit). */
export type Condition =
  | { q: string; op: 'lt' | 'le' | 'gt' | 'ge'; value: number }
  /** ltRef/gtRef: strictly inside a limit. leRef/geRef: the limit is reached (equality counts as reaching). */
  | { q: string; op: 'ltRef' | 'gtRef' | 'leRef' | 'geRef'; ref: string; factor?: number }
  | { q: string; op: 'is'; value: string | string[] }
  | { all: Condition[] }
  | { any: Condition[] };

export interface EvidenceRule {
  when: Condition;
  /** supports: +1, strongly: +3, contradicts: −1, excludes: removes the cause. */
  effect: 'supports' | 'strongly' | 'contradicts' | 'excludes';
  because: string;
}

export interface Cause {
  id: string;
  title: string;
  evidence: EvidenceRule[];
  /** Ordered checks or repairs done with the set stopped and isolated; safe actions only. */
  actions: string[];
  /**
   * Checks that need the engine running or circuits live (for example a
   * supervised test run). The engine withholds them whenever any STOP rule is
   * active, so they can never follow a STOP.
   */
  runningChecks?: string[];
  /** Where this cause and its checks come from. */
  reference: string;
}

export interface StopRule {
  when: Condition;
  /** STOP: do not run; CAUTION: run only as described. */
  level: 'STOP' | 'CAUTION';
  message: string;
}

/** Classification of an OEM limit entered by the technician. */
export type LimitClass = 'shutdown' | 'warning' | 'not-stated';
export const LIMIT_CLASS_OPTIONS: Array<{ value: LimitClass; label: string }> = [
  { value: 'shutdown', label: 'Shutdown / stop value (the manual says stop or the controller trips)' },
  { value: 'warning', label: 'Warning / pre-alarm value' },
  { value: 'not-stated', label: 'Not stated in the source' },
];

/**
 * A measured reading compared with an OEM limit question (exact-threshold rule,
 * 2026-11-25): reaching the limit (equality included) gives a STOP only when
 * the limit is classified 'shutdown'; 'warning' gives a CAUTION; unclassified
 * gives a CAUTION that says so and never clears any STOP. A reading within the
 * measurement tolerance entered for it (`<reading>.tol`) but not at the limit
 * is shown as "at or near the limit".
 */
export interface LimitRule {
  id: string;
  reading: string;
  limit: string;
  /**
   * Protective parameter (management correction 2026-11-25): violating the limit risks
   * immediate engine damage or personal hazard. Reached with the classification not
   * stated or unanswered → STOP ("treated as a shutdown limit because it has not been
   * classified"). An explicit 'warning' classification still gives CAUTION only.
   * Non-protective limits keep the CAUTION for an unclassified value.
   */
  protective: boolean;
  /** Message when a limit classified 'shutdown' is reached (shown as STOP). */
  shutdown: string;
  /** Message when a limit classified 'warning' is reached (shown as CAUTION). */
  warning: string;
}

export interface LimitStatus {
  id: string;
  reading: string;
  limit: string;
  direction: 'min' | 'max';
  /** not-verified: no limit entered; inside: strictly inside it; near: within the tolerance entered; reached: at or beyond it. */
  status: 'not-verified' | 'inside' | 'near' | 'reached';
  classification: LimitClass | null;
  source: string | null;
  value: number | null;
  limitValue: number | null;
  tolerance: number | null;
  /** The level shown for this status, or null when none (inside / not verified). */
  level: 'STOP' | 'CAUTION' | null;
  text: string;
}

export interface FaultFamily {
  id: string;
  title: string;
  /** Symptom words that route a description to this family. */
  keywords: RegExp;
  questions: Question[];
  stopRules: StopRule[];
  causes: Cause[];
  /**
   * Safety instructions shown first in every result of this family, before any
   * question or check (stop the engine, isolate, lock off, hot or pressurised parts).
   */
  mandatorySafety?: string[];
  /**
   * Checks between answers (plausibility, not OEM limits). When `when` is true
   * the listed answers are refused with `reason` and take no part in the result.
   */
  crossChecks?: Array<{ when: Condition; refuse: string[]; reason: string }>;
  /** Readings compared with classified OEM limits (exact-threshold rule). */
  limits?: LimitRule[];
  /** Verifiable general references for the family as a whole (by title only). */
  references?: string[];
  /** Review status of this family's content. */
  review: 'technician review pending' | 'reviewed';
}

export interface RankedCause {
  id: string;
  title: string;
  score: number;
  for: string[];
  against: string[];
  actions: string[];
  /** Running/live checks withheld because a STOP is active (empty when none). */
  withheld: string[];
  reference: string;
}

export interface DiagnosisResult {
  family: string;
  engineVersion: string;
  /** STOP rules that fired, then the family's mandatory safety, then CAUTION rules that fired. */
  stops: Array<{ level: StopRule['level']; message: string }>;
  /** True when any STOP rule fired: running checks are withheld from every cause. */
  stopActive: boolean;
  /** Every limit rule of the family with its status (exact-threshold rule). */
  limits: LimitStatus[];
  /** Answers refused because they are outside the physical range. */
  invalid: Array<{ q: string; reason: string }>;
  ranked: RankedCause[];
  excluded: Array<{ id: string; title: string; because: string }>;
  /** The unanswered question that best separates the leading causes. */
  nextQuestion: Question | null;
  answered: number;
  review: FaultFamily['review'];
  disclaimer: string;
}
