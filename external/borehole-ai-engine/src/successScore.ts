/**
 * S46 (2026-11-26, P1-C §4 "only if calibrated may it later be called a
 * probability"): the success score has not been calibrated against recorded
 * drilling outcomes (validation/metrics.ts has no calibration result for it),
 * so it is never shown as a probability, a frequency, a percentage or
 * "CALIBRATED". It is a qualitative screening class with its score out of 100
 * and this note, on screen and in every export. No imports: the engines use it.
 */
export const SCORE_NOT_PROBABILITY = 'not a probability of success — not calibrated against drilled outcomes';

/** The class of the uncalibrated score; the same thresholds as the verdict (verdict.ts). */
export function screeningClass(p: number): 'favourable' | 'mixed' | 'unfavourable' {
  return p >= 0.65 ? 'favourable' : p >= 0.5 ? 'mixed' : 'unfavourable';
}

/** The uncalibrated score out of 100 (never a percentage). */
export const scoreOutOf100 = (p: number) => `${Math.round(Math.max(0, Math.min(1, p)) * 100)}/100`;

/** "Favourable screening indicator (score 68/100; not a probability of success — not calibrated against drilled outcomes)". */
export function screeningIndicator(p: number): string {
  const c = screeningClass(p);
  return `${c[0].toUpperCase()}${c.slice(1)} screening indicator (score ${scoreOutOf100(p)}; ${SCORE_NOT_PROBABILITY})`;
}

/** A modelled risk figure from the same uncalibrated model: a score out of 100, never a chance. */
export const modelledRiskText = (what: string, p01: number) =>
  `Modelled ${what} risk score ${Math.round(Math.max(0, Math.min(1, p01)) * 100)}/100 (uncalibrated screening indicator, not a probability)`;
