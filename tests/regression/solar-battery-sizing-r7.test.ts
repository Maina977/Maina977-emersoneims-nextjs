/**
 * R7 (P0 audit 2026-11-13): battery sizing used the 95% ROUND-TRIP efficiency
 * as if it were the battery-to-load path, left out the inverter, and the DoD
 * and efficiency could not be entered.
 */
import { describe, it, expect } from 'vitest';
import { nominalBatteryKwh, sizeSolar, DISCHARGE_PATH_EFFICIENCY, BATTERY_DOD } from '@/lib/solar/sizing';

describe('battery sizing', () => {
  it('directive benchmark: 20 kWh AC, 80% DoD, 90% discharge path → 27.78 kWh nominal', () => {
    expect(nominalBatteryKwh(20, 0.8, 0.9)).toBeCloseTo(27.78, 2);
  });
  it('rejects impossible inputs instead of guessing', () => {
    expect(() => nominalBatteryKwh(20, 0, 0.9)).toThrow();
    expect(() => nominalBatteryKwh(20, 0.8, 1.2)).toThrow();
    expect(() => nominalBatteryKwh(-1, 0.8, 0.9)).toThrow();
  });
  it('sizeSolar uses the entered datasheet DoD and efficiency', () => {
    const base = { monthlyKwh: 600, pshAnnual: 5.5, systemType: 'off-grid' as const, autonomyDays: 1 };
    const r = sizeSolar({ ...base, batteryDod: 0.8, dischargePathEfficiency: 0.9 });
    // 600/30 = 20 kWh a day for 1 day → 27.8 kWh (rounded to 0.1)
    expect(r.batteryKwh).toBeCloseTo(27.8, 1);
    expect(r.assumptions.join(' ')).toMatch(/80% usable depth, 90% battery-to-load efficiency including the inverter;/);
  });
  it('defaults are stated as assumed', () => {
    const r = sizeSolar({ monthlyKwh: 600, pshAnnual: 5.5, systemType: 'off-grid', autonomyDays: 1 });
    expect(r.batteryKwh).toBeCloseTo(20 / (BATTERY_DOD * DISCHARGE_PATH_EFFICIENCY), 1);
    expect(r.assumptions.join(' ')).toMatch(/\(assumed\)[^]*\(assumed\)/);
  });
});
