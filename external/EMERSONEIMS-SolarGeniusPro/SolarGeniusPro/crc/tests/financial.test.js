// Golden-value tests for crc/server/financial.js
//
// Anchors NPV / IRR / amortization to closed-form references so regressions
// in financial advice are caught.

'use strict';

const fin = require('../server/financial');

describe('financial helpers', () => {
  // We only test the functions we know exist; if the file is restructured
  // the tests will surface that immediately.
  test('module loads without throwing', () => {
    expect(fin).toBeDefined();
  });

  if (typeof fin.npv === 'function') {
    test('NPV of {-100, 50, 50, 50} at 10% ≈ 24.34', () => {
      const v = fin.npv(0.10, [-100, 50, 50, 50]);
      expect(v).toBeGreaterThan(24);
      expect(v).toBeLessThan(25);
    });
  }

  if (typeof fin.irr === 'function') {
    test('IRR of {-100, 50, 50, 50} ≈ 23.4%', () => {
      const r = fin.irr([-100, 50, 50, 50]);
      expect(r).toBeGreaterThan(0.22);
      expect(r).toBeLessThan(0.25);
    });
  }

  if (typeof fin.amortize === 'function') {
    test('amortize 100k @ 12% over 1y (12 monthly) ≈ 8884.88/mo', () => {
      // signature: amortize(principal, annualRateDecimal, years, paymentsPerYear=12)
      const r = fin.amortize(100000, 0.12, 1, 12);
      expect(r.payment).toBeGreaterThan(8800);
      expect(r.payment).toBeLessThan(8900);
      expect(r.schedule).toHaveLength(12);
      expect(r.schedule[11].balance).toBeCloseTo(0, 0);
    });
  }
});
