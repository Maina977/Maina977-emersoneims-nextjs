/**
 * Generator Oracle calculators: independent hand-calculation benchmarks
 * (Engineering Apps directive §3, §10). Each expected value was worked by hand
 * from the stated formula, not taken from the code. Tolerance stated per case.
 */
import { describe, it, expect } from 'vitest';
import { powerFromVI, currentFromPower, sizeFromLoadSchedule, voltageDrop, phaseImbalance, motorStartDip, fuelAndRuntime, derate, type CalcResult } from '@/lib/generator-oracle/calc/electrical';

const v = <T,>(c: { ok: boolean }) => { expect(c.ok, JSON.stringify(c)).toBe(true); return (c as CalcResult<T>).value; };
const errs = (c: { ok: boolean }) => { expect(c.ok).toBe(false); return (c as unknown as { errors: string[] }).errors.join(' '); };

describe('GO-CALC-01 power triangle', () => {
  it('3-phase 400 V, 100 A, PF 0.8 → 69.28 kVA, 55.43 kW, 41.57 kVAr (±0.01)', () => {
    const x = v<{ kVA: number; kW: number; kVAr: number }>(powerFromVI({ phases: 3, voltageV: 400, currentA: 100, powerFactor: 0.8 }));
    expect(x.kVA).toBeCloseTo(69.28, 2); expect(x.kW).toBeCloseTo(55.43, 2); expect(x.kVAr).toBeCloseTo(41.57, 2);
  });
  it('1-phase 230 V, 10 A, PF 1 → 2.30 kVA, 2.30 kW, 0 kVAr', () => {
    const x = v<{ kVA: number; kW: number; kVAr: number }>(powerFromVI({ phases: 1, voltageV: 230, currentA: 10, powerFactor: 1 }));
    expect(x).toEqual({ kVA: 2.3, kW: 2.3, kVAr: 0 });
  });
  it('rejects PF above 1, zero voltage and 2 phases', () => {
    expect(errs(powerFromVI({ phases: 3, voltageV: 400, currentA: 10, powerFactor: 1.2 }))).toMatch(/Power factor/);
    expect(errs(powerFromVI({ phases: 3, voltageV: 0, currentA: 10, powerFactor: 0.8 }))).toMatch(/Voltage/);
    expect(errs(powerFromVI({ phases: 2 as 1, voltageV: 400, currentA: 10, powerFactor: 0.8 }))).toMatch(/Phases/);
  });
});

describe('GO-CALC-02 current', () => {
  it('500 kVA at 400 V 3-phase → 721.7 A (±0.1)', () => {
    expect(v<{ currentA: number }>(currentFromPower({ phases: 3, voltageV: 400, kVA: 500 })).currentA).toBeCloseTo(721.7, 1);
  });
  it('100 kW at PF 0.8, 230 V 1-phase → 125 kVA, 543.5 A', () => {
    const x = v<{ currentA: number; kVA: number }>(currentFromPower({ phases: 1, voltageV: 230, kW: 100, powerFactor: 0.8 }));
    expect(x.kVA).toBe(125); expect(x.currentA).toBeCloseTo(543.5, 1);
  });
  it('kW without a power factor is rejected, not assumed', () => {
    expect(errs(currentFromPower({ phases: 3, voltageV: 400, kW: 100 }))).toMatch(/Power factor/);
  });
});

describe('GO-CALC-03 load schedule', () => {
  it('2 × 50 kW PF 0.8 DF 0.9 + 30 kW PF 1 → 120 kW, 67.5 kVAr, 137.68 kVA, PF 0.872; 172.10 kVA at 80% loading', () => {
    const x = v<{ runningKW: number; runningKVAr: number; runningKVA: number; overallPF: number; minimumGeneratorKVA: number }>(sizeFromLoadSchedule({
      maxLoading: 0.8,
      loads: [{ name: 'Pumps', kW: 50, powerFactor: 0.8, quantity: 2, demandFactor: 0.9 }, { name: 'Heaters', kW: 30, powerFactor: 1, quantity: 1, demandFactor: 1 }],
    }));
    expect(x.runningKW).toBe(120); expect(x.runningKVAr).toBe(67.5);
    expect(x.runningKVA).toBeCloseTo(137.68, 2); expect(x.overallPF).toBeCloseTo(0.872, 3); expect(x.minimumGeneratorKVA).toBeCloseTo(172.1, 1);
  });
  it('rejects an empty schedule, a demand factor of 0 and a fractional quantity', () => {
    expect(errs(sizeFromLoadSchedule({ maxLoading: 0.8, loads: [] }))).toMatch(/at least one load/);
    expect(errs(sizeFromLoadSchedule({ maxLoading: 0.8, loads: [{ name: 'x', kW: 5, powerFactor: 0.8, quantity: 1.5, demandFactor: 0 }] }))).toMatch(/demand factor[^]*whole number|whole number[^]*demand factor/);
  });
});

describe('GO-CALC-04 voltage drop (IEC 60364-5-52 Annex G)', () => {
  it('3-phase Cu 95 mm², 100 m, 150 A, PF 0.85, 400 V → 1.53% (u = 3.525 V per phase, 6.10 V line)', () => {
    const x = v<{ dropV: number; dropPct: number; withinLimit: boolean | null }>(voltageDrop({ phases: 3, material: 'copper', csaMm2: 95, lengthM: 100, currentA: 150, powerFactor: 0.85, nominalVoltageV: 400, limitPct: 5 }));
    expect(x.dropPct).toBeCloseTo(1.53, 2); expect(x.dropV).toBeCloseTo(6.10, 2); expect(x.withinLimit).toBe(true);
  });
  it('single-phase uses b = 2 (twice the 3-phase per-phase drop for the same circuit)', () => {
    const one = v<{ dropPct: number }>(voltageDrop({ phases: 1, material: 'copper', csaMm2: 4, lengthM: 30, currentA: 20, powerFactor: 1, nominalVoltageV: 230 }));
    // 2 × 0.02155 × 30 / 4 × 20 = 6.465 V → 2.81 % of 230 V
    expect(one.dropPct).toBeCloseTo(2.81, 2);
  });
  it('aluminium uses its own resistivity; a missing length is rejected', () => {
    const al = v<{ dropPct: number }>(voltageDrop({ phases: 1, material: 'aluminium', csaMm2: 16, lengthM: 50, currentA: 40, powerFactor: 1, nominalVoltageV: 230 }));
    // 2 × 1.25 × 0.028264 × 50 / 16 × 40 = 8.8325 V → 3.84 %
    expect(al.dropPct).toBeCloseTo(3.84, 2);
    expect(errs(voltageDrop({ phases: 3, material: 'copper', csaMm2: 16, lengthM: NaN, currentA: 40, powerFactor: 1, nominalVoltageV: 400 }))).toMatch(/length/);
  });
});

describe('GO-CALC-05 phase imbalance (NEMA MG-1)', () => {
  it('410 / 400 / 390 V → 2.5 %, with the motor-derating warning', () => {
    const c = phaseImbalance({ values: [410, 400, 390], quantity: 'voltage' });
    expect(v<{ imbalancePct: number }>(c).imbalancePct).toBe(2.5);
    expect((c as CalcResult<unknown>).warnings.join(' ')).toMatch(/derates three-phase motors/);
  });
});

describe('GO-CALC-06 motor starting dip', () => {
  it('500 kVA, X = 0.15 pu, 300 kVA starting → 8.3 %', () => {
    expect(v<{ dipPct: number }>(motorStartDip({ generatorKVA: 500, reactancePU: 0.15, motorStartingKVA: 300, allowedDipPct: 15 })).dipPct).toBe(8.3);
  });
  it('the reactance must come from the datasheet: missing is rejected', () => {
    expect(errs(motorStartDip({ generatorKVA: 500, reactancePU: undefined as unknown as number, motorStartingKVA: 300 }))).toMatch(/reactance/i);
  });
});

describe('GO-CALC-07 fuel and runtime (datasheet only)', () => {
  it('50 % → 60 L/h and 100 % → 110 L/h: 75 % → 85 L/h; 1000 L → 11.8 h', () => {
    expect(v<{ litresPerHour: number; runtimeHours: number | null }>(fuelAndRuntime({ datasheet: [{ loadPct: 100, litresPerHour: 110 }, { loadPct: 50, litresPerHour: 60 }], loadPct: 75, usableFuelL: 1000 })))
      .toEqual({ litresPerHour: 85, runtimeHours: 11.8 });
  });
  it('no datasheet → rejected; outside the datasheet range → rejected, not extrapolated', () => {
    expect(errs(fuelAndRuntime({ datasheet: [], loadPct: 75 }))).toMatch(/datasheet/);
    expect(errs(fuelAndRuntime({ datasheet: [{ loadPct: 50, litresPerHour: 60 }, { loadPct: 100, litresPerHour: 110 }], loadPct: 25 }))).toMatch(/outside the datasheet/);
    expect(errs(fuelAndRuntime({ datasheet: [{ loadPct: 50, litresPerHour: 80 }, { loadPct: 100, litresPerHour: 60 }], loadPct: 75 }))).toMatch(/must not fall/);
  });
});

describe('GO-CALC-08 derating (datasheet factors only)', () => {
  it('400 kW; 1800 m vs 1000 m at 3.5 %/300 m; 40 °C vs 25 °C at 2 %/5 °C → 340.91 kW', () => {
    const x = v<{ availableKW: number; altitudeDeratePct: number; temperatureDeratePct: number }>(derate({ ratedKW: 400, siteAltitudeM: 1800, altitudeThresholdM: 1000, altitudePctPerStep: 3.5, altitudeStepM: 300, siteTempC: 40, tempThresholdC: 25, tempPctPerStep: 2, tempStepC: 5 }));
    expect(x.altitudeDeratePct).toBeCloseTo(9.33, 2); expect(x.temperatureDeratePct).toBe(6); expect(x.availableKW).toBeCloseTo(340.91, 2);
  });
  it('below both thresholds there is no derating', () => {
    expect(v<{ availableKW: number }>(derate({ ratedKW: 400, siteAltitudeM: 500, altitudeThresholdM: 1000, altitudePctPerStep: 3.5, altitudeStepM: 300, siteTempC: 20, tempThresholdC: 25, tempPctPerStep: 2, tempStepC: 5 })).availableKW).toBe(400);
  });
});

describe('every result is documented', () => {
  it('carries formula, inputs, assumptions, reference and engine version', () => {
    const c = powerFromVI({ phases: 3, voltageV: 400, currentA: 100, powerFactor: 0.8 }) as CalcResult<unknown>;
    expect(c.formula).toMatch(/√3/); expect(Object.keys(c.inputs).length).toBeGreaterThan(2);
    expect(c.assumptions.length).toBeGreaterThan(0); expect(c.reference).toBeTruthy(); expect(c.engine).toMatch(/oracle-calc/);
  });
});
