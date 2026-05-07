/**
 * GENERATOR ORACLE — Confidence verifier.
 *
 * The reasoning model produces a draft diagnosis. The verifier rewrites
 * the confidence label according to the blueprint's deterministic rules:
 *
 *   - verified              — citations present AND applicability confirmed
 *                             AND no rule violations
 *   - probable              — citations present, no applicability confirm
 *                             AND no rule violations
 *   - generic               — no citations AND no rule violations
 *   - verification_required — any rule warning, or any rule block
 *
 * The model is NOT trusted to set its own label. Whatever it returned is
 * overwritten by `labelConfidence(...)`.
 */

import type { ConfidenceLabel, EvidenceCitation } from './schemas';
import type { RuleViolation } from './rules';

export interface LabellingInput {
  citations: EvidenceCitation[];
  ruleViolations: RuleViolation[];
}

export function labelConfidence({
  citations,
  ruleViolations,
}: LabellingInput): ConfidenceLabel {
  if (ruleViolations.some((v) => v.severity === 'block')) {
    return 'verification_required';
  }
  if (ruleViolations.some((v) => v.severity === 'warn')) {
    return 'verification_required';
  }
  if (!citations.length) {
    return 'generic';
  }
  const applicabilityConfirmed = citations.some(
    (c) => c.applicabilityConfirmed,
  );
  if (applicabilityConfirmed) return 'verified';
  return 'probable';
}

export function summarizeViolations(violations: RuleViolation[]): string[] {
  return violations.map((v) => `${v.rule} (${v.severity}): ${v.message}`);
}
