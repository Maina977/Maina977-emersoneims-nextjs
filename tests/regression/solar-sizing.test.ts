/**
 * Solar Genius Pro sizing — pinned to the 2026-10-18 audit's hand calculations.
 * Sun-hours are the NASA POWER yearly averages the auditor measured.
 */
import { describe, it, expect } from 'vitest';
import { sizeSolar } from '@/lib/solar/sizing';

describe('sizeSolar', () => {
  it('Nairobi home, 450 kWh/month, hybrid', () => {
    const r = sizeSolar({ monthlyKwh: 450, pshAnnual: 5.79, systemType: 'hybrid', tariffKesPerKwh: 25 });
    expect(r.pvKwp).toBeGreaterThanOrEqual(3.3);
    expect(r.pvKwp).toBeLessThanOrEqual(4.4);
    expect(r.batteryKwh).toBeGreaterThanOrEqual(8);
    expect(r.batteryKwh).toBeLessThanOrEqual(10);
    expect(r.cost.midKes).toBeGreaterThan(800_000);
    expect(r.cost.midKes).toBeLessThan(1_150_000);
    expect(r.paybackYears!).toBeGreaterThan(5);
    expect(r.paybackYears!).toBeLessThan(9);
    // Yearly energy is in kWh: a ~3.9 kWp array makes a few MWh, not thousands.
    expect(r.annualEnergyKwh).toBeGreaterThan(5_000);
    expect(r.annualEnergyKwh).toBeLessThan(8_000);
  });

  // Hand check (2026-10-19): 150 kWh/day × 70% daytime = 105 kWh; 105 / (5.71 × 0.78) = 23.6 kWp → 43 × 550 W = 23.7 kWp;
  // cost (23.7×60k + 25 kW×15k)×1.12 ≈ KES 2.01M; saving 38,325 kWh × 0.9 used on site × 25 = KES 862k → payback ≈ 2.3 years.
  it('Mombasa hotel, 4,500 kWh/month, grid-tied, 70% daytime use', () => {
    const r = sizeSolar({ monthlyKwh: 4500, pshAnnual: 5.71, systemType: 'grid-tied', daytimeUsePct: 70, tariffKesPerKwh: 25 });
    expect(r.pvKwp).toBe(23.7);
    expect(r.batteryKwh).toBe(0);
    expect(r.cost.midKes).toBeGreaterThan(1_950_000);
    expect(r.cost.midKes).toBeLessThan(2_080_000);
    expect(r.paybackYears!).toBeGreaterThan(2.2);
    expect(r.paybackYears!).toBeLessThan(2.45);
  });

  it('Machakos farm, 600 kWh/month, off-grid, compared with diesel', () => {
    const r = sizeSolar({ monthlyKwh: 600, pshAnnual: 5.53, pshWorstMonth: 4.8, systemType: 'off-grid', dieselKesPerLitre: 175 });
    expect(r.pvKwp).toBeGreaterThan(5);
    expect(r.pvKwp).toBeLessThan(7);
    expect(r.batteryKwh).toBeGreaterThan(20);
    expect(r.batteryKwh).toBeLessThan(26);
    expect(r.savingBasis).toBe('diesel');
    expect(r.monthlySavingKes).toBeGreaterThan(30_000);
    expect(r.monthlySavingKes).toBeLessThan(45_000);
    expect(r.co2AvoidedKgPerYear).toBeGreaterThan(0);
  });

  it('battery follows the backup asked for, not a fixed 1.5 days of the whole load', () => {
    const small = sizeSolar({ monthlyKwh: 450, pshAnnual: 5.5, systemType: 'hybrid', nightUsePct: 20 });
    const big = sizeSolar({ monthlyKwh: 450, pshAnnual: 5.5, systemType: 'hybrid', nightUsePct: 80 });
    expect(big.batteryKwh).toBeGreaterThan(small.batteryKwh * 3);
  });

  it('uses the stated peak load for the inverter', () => {
    const r = sizeSolar({ monthlyKwh: 600, pshAnnual: 5.5, systemType: 'off-grid', peakLoadKw: 7.5 });
    expect(r.inverterBasis).toBe('peak-load');
    expect(r.inverterKw).toBeGreaterThanOrEqual(7.5 * 1.25);
  });

  it('rejects impossible inputs instead of guessing', () => {
    expect(() => sizeSolar({ monthlyKwh: 0, pshAnnual: 5.5, systemType: 'hybrid' })).toThrow();
    expect(() => sizeSolar({ monthlyKwh: 300, pshAnnual: 0, systemType: 'hybrid' })).toThrow();
  });

  it('lists its assumptions for the customer', () => {
    const r = sizeSolar({ monthlyKwh: 450, pshAnnual: 5.79, systemType: 'hybrid' });
    expect(r.assumptions.length).toBeGreaterThan(3);
    expect(r.assumptions.join(' ')).toMatch(/not a quotation/);
  });
});
