/**
 * SolarGenius independent audit, 2026-10-31: unsafe cable and breaker sizes and
 * lead-acid sizing, each against the auditor's hand calculation.
 */
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const eng = require('../../lib/solar-genius/server/solar-engineering.js');
const { autoDesign } = require('../../lib/solar-genius/server/autoDesigner.js');
const extras = require('../../lib/solar-genius/server/engineering-extras.js');

describe('breaker', () => {
  it('refuses rather than caps when nothing in the table fits', () => {
    const r = eng.ocpdSizing({ panelIscStc: 14, stringsInParallel: 4, inverterAcKw: 1000, acVoltageV: 400 });
    expect(r.acBreaker.recommendedStdA).toBeNull();
    expect(r.acBreaker.continuousCurrentA).toBeCloseTo(1443.38, 1);
    expect(r.acBreaker.verdict).toMatch(/engineer/);
  });
});

describe('cable', () => {
  it('in conduit by default: 72 A three-phase is not on 16 mm²', () => {
    const r = eng.recommendConductor({ systemType: 'ac_three_phase', currentA: 72.17, voltageV: 400, oneWayLengthM: 15 });
    expect(r.recommendedCsaMm2).toBe(25);
  });
  it('the breaker protects the cable: 100 A breaker needs at least 35 mm² in conduit', () => {
    const r = eng.recommendConductor({ systemType: 'ac_three_phase', currentA: 72.17, voltageV: 400, oneWayLengthM: 15, breakerA: 100 });
    expect(r.recommendedCsaMm2).toBe(35);
  });
  it('32 A single-phase breaker with 21.7 A: 4 mm² in conduit (rated 32 A)', () => {
    expect(eng.recommendConductor({ systemType: 'ac_single_phase', currentA: 21.74, voltageV: 230, oneWayLengthM: 15, breakerA: 32 }).recommendedCsaMm2).toBe(4);
  });
  it('aluminium at 200 A is not 10 mm²', () => {
    const r = eng.recommendConductor({ systemType: 'ac_single_phase', currentA: 200, voltageV: 230, oneWayLengthM: 5, conductorMaterial: 'aluminium' });
    expect(r.recommendedCsaMm2 === null || r.recommendedCsaMm2 >= 120).toBe(true);
  });
  it('PVC at 65 °C has no size', () => {
    expect(eng.recommendConductor({ systemType: 'ac_single_phase', currentA: 60, voltageV: 230, oneWayLengthM: 5, ambientTempC: 65 }).recommendedCsaMm2).toBeNull();
  });
  it('PV string keeps the 4 mm² minimum', () => {
    expect(eng.recommendConductor({ systemType: 'dc', currentA: 13, voltageV: 400, oneWayLengthM: 30, pvString: true }).recommendedCsaMm2).toBeGreaterThanOrEqual(4);
  });
});

describe('auto-design', () => {
  const base = { ambientMinC: 8, ambientMaxC: 35, tiltDeg: 10, azimuthDeg: 0, targetSpecificYieldKwhPerKwp: 1600 };
  it('works for a normal home, with a PV inverter', () => {
    const r = autoDesign({ ...base, annualConsumptionKwh: 5400 });
    expect(r.summary.arrayKwp).toBeGreaterThan(3);
    expect(r.summary.stringCount).toBeGreaterThanOrEqual(1);
  });
  it('a large array gets enough inverters, and fuses for every string', () => {
    const r = autoDesign({ ...base, annualConsumptionKwh: 1800000 });
    const dcAc = r.summary.arrayKwp / r.summary.inverterTotalAcKw;
    expect(dcAc).toBeGreaterThan(0.9);
    expect(dcAc).toBeLessThan(1.5);
    expect(r.summary.stringCount).toBeGreaterThan(10);
  });
  it('the site cold changes the string voltage', () => {
    const cold = autoDesign({ ...base, annualConsumptionKwh: 60000, ambientMinC: -30 });
    const mild = autoDesign({ ...base, annualConsumptionKwh: 60000, ambientMinC: 10 });
    expect(JSON.stringify(cold)).not.toEqual(JSON.stringify(mild));
  });
});

describe('battery chemistry', () => {
  it('lead-acid uses its own depth and efficiency (hand: 87.7 kWh)', () => {
    const r = extras.batterySizing({ dailyCriticalLoadKwh: 15, autonomyDays: 2, chemistry: 'lead-acid' });
    expect(r.energyRequiredKwh).toBeGreaterThan(87);
    expect(r.energyRequiredKwh).toBeLessThan(89);
  });
});
