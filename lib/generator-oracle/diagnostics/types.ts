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
}
export interface ChoiceQuestion {
  id: string;
  kind: 'choice';
  text: string;
  options: Array<{ value: string; label: string }>;
  help?: string;
}
export type Question = NumberQuestion | ChoiceQuestion;

/** A condition on the answers. `ref` compares with another answer (e.g. an OEM limit). */
export type Condition =
  | { q: string; op: 'lt' | 'le' | 'gt' | 'ge'; value: number }
  | { q: string; op: 'ltRef' | 'gtRef'; ref: string; factor?: number }
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
  /** Ordered checks or repairs; safe actions only. */
  actions: string[];
  /** Where this cause and its checks come from. */
  reference: string;
}

export interface StopRule {
  when: Condition;
  /** STOP: do not run; CAUTION: run only as described. */
  level: 'STOP' | 'CAUTION';
  message: string;
}

export interface FaultFamily {
  id: string;
  title: string;
  /** Symptom words that route a description to this family. */
  keywords: RegExp;
  questions: Question[];
  stopRules: StopRule[];
  causes: Cause[];
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
  reference: string;
}

export interface DiagnosisResult {
  family: string;
  engineVersion: string;
  stops: Array<{ level: StopRule['level']; message: string }>;
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
