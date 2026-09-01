/*
 * REPAYMENT MATHS — ONE IMPLEMENTATION, TESTED.
 *
 * Created 2026-08-31 after the homepage trade-in calculator was found
 * publishing a monthly repayment that was wrong by a factor of about 3.6.
 *
 * The expression it used was:
 *
 *   (gap * 0.14 / 12 * Math.pow(1.14 / 12 + 1, 24)) / (Math.pow(1.14 / 12 + 1, 24) - 1)
 *
 * Two different rates appear in that one line. The leading coefficient uses
 * 0.14/12 — the correct monthly rate. The compounding base uses 1.14/12 + 1,
 * which evaluates to 1.095, i.e. a 9.5% MONTHLY rate: it divides (1 + annual)
 * by twelve instead of dividing the annual rate alone. On a KES 996,000
 * balance it returned KES 13,104/month. Twenty-four such payments come to
 * KES 314,496 — less than a third of the sum borrowed, before any interest at
 * all. The correct figure is KES 47,821.
 *
 * The failure was possible because the formula was written inline in JSX,
 * where nothing could test it and no reviewer would read it as arithmetic.
 * Putting it here, behind a named function with tests, is the actual fix; the
 * corrected digits are only the symptom.
 *
 * These functions compute an ILLUSTRATION. EmersonEIMS does not lend. Nothing
 * in this repository evidences a lender, a product or an approved rate, so any
 * figure derived here must be presented as indicative and never as an offer of
 * credit or a quotation.
 */

export interface RepaymentInput {
  /** Amount financed, in KES. Values <= 0 yield a zero repayment. */
  principal: number;
  /** Nominal ANNUAL rate as a decimal fraction: 0.14 means 14% a year. */
  annualRate: number;
  /** Number of monthly instalments. Must be a positive whole number of months. */
  months: number;
}

/**
 * Monthly repayment on a reducing-balance (amortising) loan.
 *
 * This is the standard annuity formula:
 *
 *     PMT = P * i * (1 + i)^n / ((1 + i)^n - 1)      where i = annualRate / 12
 *
 * Returns 0 rather than throwing for input that cannot describe a loan
 * (missing, negative, zero or non-finite). A calculator on a marketing page
 * should degrade to showing nothing, not crash the section or render NaN.
 *
 * A zero rate is a legitimate input, not an error: it is an interest-free
 * instalment plan, and the annuity formula divides by zero there, so it is
 * handled as a straight division of principal across the term.
 */
export function monthlyRepayment({ principal, annualRate, months }: RepaymentInput): number {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(months)) return 0;
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate < 0) return 0; // a negative interest rate is not a product we offer

  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / months;

  const compounded = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * compounded) / (compounded - 1);
}

/**
 * Total of all repayments over the full term. Useful for showing the cost of
 * credit, which is this value minus the principal.
 */
export function totalRepayable(input: RepaymentInput): number {
  const monthly = monthlyRepayment(input);
  if (monthly === 0) return 0;
  return monthly * input.months;
}

/**
 * The interest portion only — what the credit costs on top of the goods.
 */
export function costOfCredit(input: RepaymentInput): number {
  const total = totalRepayable(input);
  if (total === 0) return 0;
  return total - input.principal;
}
