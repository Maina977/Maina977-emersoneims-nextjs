import { describe, it, expect } from 'vitest';
import { simulateHybrid, type HybridInput } from '@/lib/solar/design/hybrid';

// Hand-checkable hybrid cases. Fuel curve and battery figures below are TEST
// values, not product data: real designs must use the datasheet values.
const day = <T,>(f: (h: number) => T): T[] => Array.from({ length: 24 }, (_, h) => f(h));
const pv = day((h) => (h >= 8 && h < 16 ? 5 : 0));      // 40 kWh/day, 08:00–16:00
const load = day(() => 2);                               // 48 kWh/day flat
const battery = { usableKwh: 20, maxChargeKw: 5, maxDischargeKw: 5, roundTripEfficiency: 0.81, minSocFrac: 0.1, initialSocFrac: 0.5, source: 'test values' };
const gen = { ratedKw: 10, minLoadFrac: 0.3, fuelA_LperHperKwRated: 0.08, fuelB_LperKwh: 0.25, fuelCurveSource: 'test values' };
const base: HybridInput = { pvAcKwh: pv, loadKwh: load, loadSource: 'test flat 2 kW' };

describe('hybrid energy balance', () => {
  it('PV only: direct use, curtailment and unserved add up', () => {
    const r = simulateHybrid(base);
    expect(r.totals.pvToLoadKwh).toBe(16);      // 8 h × 2 kWh
    expect(r.totals.curtailedKwh).toBe(24);     // 8 h × 3 kWh
    expect(r.totals.unservedKwh).toBe(32);      // 16 h × 2 kWh
    expect(r.unservedHours).toBe(16);
    expect(r.balanceErrorKwh).toBeLessThan(1e-6);
  });
  it('battery: charge/discharge with √0.81 = 0.9 each way, SOC limits respected, losses accounted', () => {
    const r = simulateHybrid({ ...base, battery });
    // Start 10 kWh stored; min 2 kWh. Night before 08:00: 8 h × 2 kWh needed; available (10−2)·0.9 = 7.2 kWh.
    expect(r.totals.batteryToLoadKwh).toBeGreaterThan(0);
    expect(r.finalSocFrac).toBeGreaterThanOrEqual(0.1);
    expect(r.totals.batteryLossKwh).toBeGreaterThan(0);
    expect(r.balanceErrorKwh).toBeLessThan(1e-6);
  });
  it('generator: minimum load enforced, excess to battery, fuel from the linear curve, starts counted', () => {
    const r = simulateHybrid({ ...base, battery, generator: gen });
    expect(r.totals.unservedKwh).toBe(0);
    expect(r.totals.generatorHours).toBeGreaterThan(0);
    // Every running hour produces at least 3 kWh (30 % of 10 kW); fuel = 0.08·10·h + 0.25·kWh
    expect(r.totals.generatorKwh).toBeGreaterThanOrEqual(3 * r.totals.generatorHours - 1e-6);
    expect(r.totals.generatorFuelL).toBeCloseTo(0.8 * r.totals.generatorHours + 0.25 * r.totals.generatorKwh, 1);
    expect(r.totals.generatorStarts).toBeGreaterThanOrEqual(1);
    expect(r.balanceErrorKwh).toBeLessThan(1e-6);
  });
  it('grid: imports only in available hours, export only if allowed', () => {
    const avail = day((h) => h >= 18); // grid present 18:00–24:00 only
    const r = simulateHybrid({ ...base, grid: { availableHours: avail, exportAllowed: false, source: 'test outage pattern' } });
    expect(r.totals.gridImportKwh).toBe(12);   // 6 h × 2 kWh
    expect(r.totals.gridExportKwh).toBe(0);
    expect(r.totals.unservedKwh).toBe(20);     // remaining night hours 00–08 and 16–18
    const x = simulateHybrid({ ...base, grid: { exportAllowed: true, exportLimitKw: 2, source: 'test' } });
    expect(x.totals.gridExportKwh).toBe(16);   // 8 h × min(3, 2)
    expect(x.totals.curtailedKwh).toBe(8);
    expect(x.balanceErrorKwh).toBeLessThan(1e-6);
  });
  it('a year of random hours conserves energy exactly', () => {
    let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const n = 8760;
    const r = simulateHybrid({
      pvAcKwh: Array.from({ length: n }, () => rnd() * 8), loadKwh: Array.from({ length: n }, () => rnd() * 6), loadSource: 'random test',
      battery, generator: gen, grid: { availableHours: Array.from({ length: n }, () => rnd() > 0.3), exportAllowed: true, exportLimitKw: 3, source: 'random test' },
    });
    expect(r.balanceErrorKwh).toBeLessThan(1e-3);
  });
  it('refuses unsourced or inconsistent inputs instead of assuming', () => {
    expect(() => simulateHybrid({ ...base, loadSource: '' })).toThrow(/load profile/);
    expect(() => simulateHybrid({ ...base, loadKwh: load.slice(1) })).toThrow(/same length/);
    expect(() => simulateHybrid({ ...base, generator: { ...gen, fuelCurveSource: '' } })).toThrow(/fuel curve source/);
    expect(() => simulateHybrid({ ...base, battery: { ...battery, roundTripEfficiency: 90 } })).toThrow(/round-trip/);
  });
});
