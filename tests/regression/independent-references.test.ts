/**
 * Management review 2026-11-13, item 6: checks against INDEPENDENT published
 * references (not our own hand calculations of the same formula).
 * Retrieved 13 Nov 2026. Sources that could not be retrieved are recorded as
 * UNTESTED in docs/engineering-apps/RELEASE-DECISION-2026-11-13.md.
 */
import { describe, it, expect } from 'vitest';
import { internalRateOfReturn } from '@/lib/solar/solar3DDesignEngine';
import { nominalBatteryKwh } from '@/lib/solar/sizing';
import { slabConcrete, uValue } from '@/lib/wizard-api/buildingCalcs';
import { phaseImbalance, type CalcResult } from '@/lib/generator-oracle/calc/electrical';
import { buildFieldPumpTestAnalysis } from '@/external/borehole-ai-engine/src/pumpTestAnalyzer';

describe('independent references', () => {
  it('IRR: Wikipedia "Internal rate of return", Calculation > Example: −123400, 36200, 54800, 48100 → 5.96 %', () => {
    expect((internalRateOfReturn([-123400, 36200, 54800, 48100]) as number) * 100).toBeCloseTo(5.96, 2);
  });
  it('battery: directive benchmark (management) 20 kWh AC, 80 % DoD, 90 % discharge path → 27.78 kWh', () => {
    expect(nominalBatteryKwh(20, 0.8, 0.9)).toBeCloseTo(27.78, 2);
  });
  it('slab: directive benchmark 12 × 8 × 0.15 m → 14.40 m³', () => {
    expect((slabConcrete({ length_m: 12, width_m: 8, thickness_m: 0.15 }) as { net_volume_m3: number }).net_volume_m3).toBe(14.4);
  });
  it('specific capacity: directive benchmark Q 12 m³/h, s 8 m → 1.5 m³/h/m', () => {
    expect(buildFieldPumpTestAnalysis({ sustainableYieldM3Hr: 12, drawdownM: 8, testDurationHrs: 24 }, 80).analysis?.specificCapacity_m3hr_m).toBeCloseTo(1.5, 10);
  });
  // Retrieved 14 Nov 2026 (P0-D).
  it('voltage unbalance: NEMA MG-1 example (as quoted by EASA and others) 460 / 450 / 467 V → average 459 V, max deviation 9 V, 1.96 %', () => {
    const r = phaseImbalance({ values: [460, 450, 467], quantity: 'voltage' }) as CalcResult<{ average: number; maxDeviation: number; imbalancePct: number }>;
    expect(r.value.average).toBe(459);
    expect(r.value.maxDeviation).toBe(9);
    expect(r.value.imbalancePct).toBeCloseTo(1.96, 2);
  });
  it('layer resistance: CIBSE Journal Module 29 — brick 0.105 m at λ 0.77 → R 0.136; light block 0.100 m at λ 0.20 → R 0.500 m²K/W', () => {
    const r = uValue({ layers: [{ thickness_m: 0.105, lambda_W_mK: 0.77 }, { thickness_m: 0.1, lambda_W_mK: 0.2 }] }) as { layers: Array<{ R_m2K_W: number }> };
    expect(r.layers[0].R_m2K_W).toBeCloseTo(0.136, 3);
    expect(r.layers[1].R_m2K_W).toBeCloseTo(0.5, 3);
  });
});
