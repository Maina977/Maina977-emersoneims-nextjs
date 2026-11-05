/** Auto-design supply phase and inverter count (audit 2026-11-05). */
import { describe, it, expect } from 'vitest';
import { autoDesign } from '@/lib/solar-genius/server/autoDesigner.js';

const run = (kwh: number, extra: any = {}) => autoDesign({ annualConsumptionKwh: kwh, ambientMinC: 8, ambientMaxC: 35, tiltDeg: 10, azimuthDeg: 0, targetSpecificYieldKwhPerKwp: 1600, needsBattery: true, ...extra });

describe('solar auto-design', () => {
  it('a home is single-phase unless a three-phase supply is stated', () => {
    for (const kwh of [5400, 12000]) expect(run(kwh).equipment.inverter.acPhases).toBe(1);
    expect(run(12000, { supplyPhases: 3 }).equipment.inverter.acPhases).toBe(3);
  });
  it('never puts an array above DC/AC 1.35 on too few inverters', () => {
    for (const kwh of [5400, 12000, 30000, 60000]) {
      const r = run(kwh, kwh >= 30000 ? { supplyPhases: 3 } : {});
      const ratio = r.summary.arrayKwp / r.summary.inverterTotalAcKw;
      expect(ratio).toBeLessThanOrEqual(1.35);
      expect(ratio).toBeGreaterThanOrEqual(0.7);
    }
  });
});
