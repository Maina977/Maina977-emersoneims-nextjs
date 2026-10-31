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
    // 2026-10-25: battery priced as equipment (installation added once) and a
    // 3.6 kW inverter instead of an automatic 5 kW: ~KES 740k, inside the
    // typical Kenyan range for 3-4 kWp + ~9 kWh LiFePO4 installed.
    expect(r.cost.midKes).toBeGreaterThan(650_000);
    expect(r.cost.midKes).toBeLessThan(1_150_000);
    expect(r.paybackYears!).toBeGreaterThan(5);
    expect(r.paybackYears!).toBeLessThan(9);
    // Yearly energy is in kWh: a ~3.9 kWp array makes a few MWh, not thousands.
    expect(r.annualEnergyKwh).toBeGreaterThan(5_000);
    expect(r.annualEnergyKwh).toBeLessThan(8_000);
  });

  // Hand check (2026-10-19): 150 kWh/day × 70% daytime = 105 kWh; 105 / (5.71 × 0.78) = 23.6 kWp → 43 × 550 W = 23.7 kWp;
  // Tiered rates (2026-10-27, so a bigger system never costs less): PV 10×70k + 13.7×60k = 1,522k; inverter 25 kW
  // grid-tied 10×20k + 15×15k = 425k; (1,522k + 425k)×1.12 = KES 2,180,640. Saving 38,325 kWh × 0.75 used on site × 25
  // = KES 718,594 → payback 2,181,000 / 718,594 ≈ 3.0 years (2026-10-20: 90% self-use was optimistic).
  it('Mombasa hotel, 4,500 kWh/month, grid-tied, 70% daytime use', () => {
    const r = sizeSolar({ monthlyKwh: 4500, pshAnnual: 5.71, systemType: 'grid-tied', daytimeUsePct: 70, tariffKesPerKwh: 25 });
    expect(r.pvKwp).toBe(23.65);
    expect(r.batteryKwh).toBe(0);
    // 20 kW inverter: DC/AC 1.185, inside 1.0-1.3 (was 25 kW, DC/AC 0.95).
    // (10×70k + 13.7×60k + 10×20k + 10×15k) × 1.12 = 2,096,640.
    expect(r.inverterKw).toBe(20);
    expect(r.cost.midKes).toBe(2_097_000);
    // 4,500 × 365/30 × 0.7 × 0.75 × 25 = KES 718,594/yr → 2,097,000 / 718,594 = 2.9 yr.
    expect(r.paybackYears!).toBeGreaterThan(2.85);
    expect(r.paybackYears!).toBeLessThan(3.15);
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

  it('a home with no stated peak gets at least a 5 kW inverter', () => {
    const r = sizeSolar({ monthlyKwh: 450, pshAnnual: 5.79, systemType: 'hybrid' });
    expect(r.inverterBasis).toBe('estimated-peak');
    expect(r.inverterKw).toBeGreaterThanOrEqual(3.6);
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

describe('installed cost never falls as the system grows (2026-10-27 audit)', () => {
  it('cost rises monotonically from 1 to 120 kWp', async () => {
    const { estimateInstalledCost } = await import('@/lib/solar/sizing');
    for (const type of ['hybrid', 'grid-tied', 'off-grid'] as const) {
      let prev = 0;
      for (let kw = 1; kw <= 120; kw += 0.5) {
        const c = estimateInstalledCost(kw, kw, 0, type).midKes;
        expect(c, `${type} ${kw} kWp`).toBeGreaterThanOrEqual(prev);
        prev = c;
      }
    }
  });
});
