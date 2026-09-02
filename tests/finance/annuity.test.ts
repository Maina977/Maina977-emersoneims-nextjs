import { describe, it, expect } from 'vitest';
import { monthlyRepayment, totalRepayable, costOfCredit } from '@/lib/finance/annuity';

/*
 * These tests exist because the homepage published a monthly repayment that
 * was wrong by a factor of about 3.6 — see lib/finance/annuity.ts for the
 * defective expression and how it failed. The first block below pins the exact
 * case that was wrong, so it cannot come back silently.
 */

describe('monthlyRepayment — the regression that shipped', () => {
  const brokenCase = { principal: 996_000, annualRate: 0.14, months: 24 };

  it('returns the correct annuity payment for the case the site got wrong', () => {
    // Reducing balance, i = 0.14/12, n = 24. Verified independently:
    //   compounded = 1.0116666667^24 = 1.3209871...
    //   PMT = 996000 * 0.0116666667 * 1.3209871 / 0.3209871 = 47,820.83...
    expect(monthlyRepayment(brokenCase)).toBeCloseTo(47_820.83, 1);
  });

  it('does NOT return the old wrong figure of ~13,104', () => {
    expect(monthlyRepayment(brokenCase)).not.toBeCloseTo(13_104, 0);
  });

  it('repays more than the principal over the full term', () => {
    // The old formula failed this: 13,104 x 24 = 314,496 on a 996,000 loan.
    // Any correct amortisation must total MORE than the sum borrowed.
    expect(totalRepayable(brokenCase)).toBeGreaterThan(brokenCase.principal);
  });

  it('reports a positive cost of credit', () => {
    expect(costOfCredit(brokenCase)).toBeGreaterThan(0);
  });
});

describe('monthlyRepayment — interest rates', () => {
  it('treats a zero rate as an interest-free instalment plan', () => {
    // The annuity formula divides by zero here, so this path is special-cased.
    expect(monthlyRepayment({ principal: 240_000, annualRate: 0, months: 24 })).toBe(10_000);
  });

  it('costs nothing extra at a zero rate', () => {
    expect(costOfCredit({ principal: 240_000, annualRate: 0, months: 24 })).toBe(0);
  });

  it('charges more per month as the rate rises', () => {
    const low = monthlyRepayment({ principal: 1_000_000, annualRate: 0.10, months: 36 });
    const high = monthlyRepayment({ principal: 1_000_000, annualRate: 0.20, months: 36 });
    expect(high).toBeGreaterThan(low);
  });

  it('refuses a negative rate rather than inventing a discount', () => {
    expect(monthlyRepayment({ principal: 500_000, annualRate: -0.05, months: 12 })).toBe(0);
  });
});

describe('monthlyRepayment — terms', () => {
  it('lowers the monthly payment as the term lengthens', () => {
    const short = monthlyRepayment({ principal: 1_000_000, annualRate: 0.14, months: 12 });
    const long = monthlyRepayment({ principal: 1_000_000, annualRate: 0.14, months: 48 });
    expect(long).toBeLessThan(short);
  });

  it('raises the total cost as the term lengthens', () => {
    const short = totalRepayable({ principal: 1_000_000, annualRate: 0.14, months: 12 });
    const long = totalRepayable({ principal: 1_000_000, annualRate: 0.14, months: 48 });
    expect(long).toBeGreaterThan(short);
  });

  it('charges the whole principal in one instalment over a single month', () => {
    const one = monthlyRepayment({ principal: 100_000, annualRate: 0.12, months: 1 });
    expect(one).toBeCloseTo(101_000, 0); // principal + one month at 1%
  });
});

describe('monthlyRepayment — invalid and missing input', () => {
  it('returns zero for a zero principal', () => {
    expect(monthlyRepayment({ principal: 0, annualRate: 0.14, months: 24 })).toBe(0);
  });

  it('returns zero for a negative principal', () => {
    expect(monthlyRepayment({ principal: -500_000, annualRate: 0.14, months: 24 })).toBe(0);
  });

  it('returns zero for a zero or negative term', () => {
    expect(monthlyRepayment({ principal: 500_000, annualRate: 0.14, months: 0 })).toBe(0);
    expect(monthlyRepayment({ principal: 500_000, annualRate: 0.14, months: -6 })).toBe(0);
  });

  it('returns zero rather than NaN for missing values', () => {
    // A calculator with an empty field must render nothing, not "KES NaN".
    expect(monthlyRepayment({ principal: NaN, annualRate: 0.14, months: 24 })).toBe(0);
    expect(monthlyRepayment({ principal: 500_000, annualRate: NaN, months: 24 })).toBe(0);
    expect(monthlyRepayment({ principal: 500_000, annualRate: 0.14, months: NaN })).toBe(0);
  });

  it('returns zero rather than Infinity for non-finite input', () => {
    expect(monthlyRepayment({ principal: Infinity, annualRate: 0.14, months: 24 })).toBe(0);
  });

  it('never returns NaN for any of the guarded cases', () => {
    const cases = [
      { principal: 0, annualRate: 0, months: 0 },
      { principal: -1, annualRate: -1, months: -1 },
      { principal: NaN, annualRate: NaN, months: NaN },
    ];
    for (const c of cases) expect(Number.isNaN(monthlyRepayment(c))).toBe(false);
  });
});

describe('monthlyRepayment — magnitude and precision', () => {
  it('handles a 3,000 kVA-scale balance without losing precision', () => {
    const big = monthlyRepayment({ principal: 250_000_000, annualRate: 0.14, months: 60 });
    expect(Number.isFinite(big)).toBe(true);
    expect(big).toBeGreaterThan(5_000_000);
  });

  it('handles decimal principals', () => {
    const v = monthlyRepayment({ principal: 1_000_000.55, annualRate: 0.135, months: 30 });
    expect(Number.isFinite(v)).toBe(true);
    expect(v).toBeGreaterThan(0);
  });

  it('scales linearly with the principal', () => {
    // Doubling the amount financed must exactly double the instalment.
    const single = monthlyRepayment({ principal: 500_000, annualRate: 0.14, months: 24 });
    const double = monthlyRepayment({ principal: 1_000_000, annualRate: 0.14, months: 24 });
    expect(double).toBeCloseTo(single * 2, 6);
  });
});
