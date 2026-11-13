/**
 * Solar Genius Pro stochastic engines (P0 audit 2026-11-13): the Monte Carlo
 * battery sizer and the genetic design optimiser used Math.random(), so the same
 * request returned a different battery size or "best" design each time. The
 * Monte Carlo also sized with the ROUND-TRIP efficiency (R7) and silently used a
 * typical load profile when none was given.
 */
import { describe, it, expect } from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pro = require('../../lib/solar-genius/server/engineering-pro.js');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const elite = require('../../lib/solar-genius/server/engineering-elite.js');

describe('reproducible stochastic engines', () => {
  it('Monte Carlo: same inputs, same percentiles', () => {
    const inp = { autonomyDays: 1, loadVariabilityPct: 25, trials: 500 };
    expect(pro.batterySizingMonteCarlo(inp).sizingPercentiles).toEqual(pro.batterySizingMonteCarlo(inp).sizingPercentiles);
  });
  it('Monte Carlo: different inputs can differ (still random across inputs)', () => {
    const a = pro.batterySizingMonteCarlo({ loadVariabilityPct: 25 }).sizingPercentiles.P95Kwh;
    const b = pro.batterySizingMonteCarlo({ loadVariabilityPct: 40 }).sizingPercentiles.P95Kwh;
    expect(a).not.toBe(b);
  });
  it('Monte Carlo sizes with the discharge-path efficiency and flags an assumed profile', () => {
    const flat = Array(24).fill(1); // 24 kWh/day, no noise
    const r = pro.batterySizingMonteCarlo({ hourlyLoadProfileKw: flat, loadVariabilityPct: 0, ageingDeratingPct: 0, depthOfDischarge: 0.8, dischargePathEfficiency: 0.9, trials: 10 });
    expect(r.sizingPercentiles.P50Kwh).toBeCloseTo(24 / (0.8 * 0.9), 2); // 33.33 kWh
    expect(r.profileAssumed).toBe(false);
    expect(pro.batterySizingMonteCarlo({}).profileAssumed).toBe(true);
    expect(pro.batterySizingMonteCarlo({}).profileNote).toMatch(/typical residential profile was assumed/);
  });
  it('genetic optimiser: same inputs, same best design', () => {
    expect(elite.gaOptimiser({}).bestSolution).toEqual(elite.gaOptimiser({}).bestSolution);
  });
});
