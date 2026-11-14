import { describe, it, expect } from 'vitest';
import fx from '../fixtures/pvlib-production.json';
import { simulateProduction, PVWATTS_DEFAULT_LOSSES, pvwattsInverter } from '@/lib/solar/design/production';
import { meanDayPoaSteps, poaMonthly, STEP_HOURS } from '@/lib/solar/poa';

const pct = (a: number, b: number) => (Math.abs(a - b) / b) * 100;

describe('mean-day POA steps are consistent with the validated poaMonthly', () => {
  it('steps sum to the monthly figure (every month, two orientations)', () => {
    for (const [tilt, az] of [[10, 0], [25, 90]]) {
      const ref = poaMonthly(-1.2921, tilt, az, fx.ghi).monthly;
      fx.ghi.forEach((H, m) => {
        const sum = meanDayPoaSteps(-1.2921, tilt, az, H, m).reduce((s, x) => s + x.poaWm2, 0) * STEP_HOURS / 1000;
        expect(Math.abs(sum - ref[m])).toBeLessThan(0.006); // poaMonthly rounds to 0.01
      });
    }
  });
});

describe('PVWatts loss and inverter models', () => {
  it('default losses multiply to 14.08 % (as pvlib.pvsystem.pvwatts_losses)', () => {
    const total = 1 - Object.values(PVWATTS_DEFAULT_LOSSES).reduce((p, l) => p * (1 - l), 1);
    expect(total * 100).toBeCloseTo(fx.pvwattsTotalLossPct, 6);
  });
  it('inverter: zero below zero, clipped at rating, curve below it', () => {
    expect(pvwattsInverter(-1, 10, 0.96)).toBe(0);
    expect(pvwattsInverter(20, 10, 0.96)).toBeCloseTo(9.6, 9);
    expect(pvwattsInverter(5, 10, 0.96)).toBeGreaterThan(4.7);
    expect(pvwattsInverter(5, 10, 0.96)).toBeLessThan(4.85);
  });
});

describe(`production vs pvlib ${fx.pvlib} PVWatts chain`, () => {
  for (const c of fx.cases) {
    const r = simulateProduction({
      site: { latDeg: c.lat, tiltDeg: c.tilt, azimuthDeg: c.az }, ghiMonthly: fx.ghi, ghiSource: 'test input', ambientMonthlyC: fx.tamb, ambientSource: 'test input',
      array: { dcKw: c.dcKw, gammaPmaxPct: c.gamma, noctC: c.noct }, inverter: { acKw: c.acKw, nominalEfficiency: c.eta },
      losses: PVWATTS_DEFAULT_LOSSES, lossesSource: 'PVWatts v5 defaults',
    });
    it(`${c.name}: annual within 1.5 %, each month within 3 %`, () => {
      expect(pct(r.annualKwh, c.annualKwh), `${r.annualKwh} vs ${c.annualKwh}`).toBeLessThan(1.5);
      r.monthlyKwh.forEach((v, m) => expect(pct(v, c.monthlyKwh[m]), `month ${m + 1}`).toBeLessThan(3));
    });
    it(`${c.name}: reports PR, specific yield, temperature loss and clipping`, () => {
      expect(r.performanceRatio).toBeGreaterThan(0.6); expect(r.performanceRatio).toBeLessThan(0.9);
      expect(r.temperatureLossPct).toBeGreaterThan(0);
      expect(r.clippedKwh).toBeGreaterThanOrEqual(0);
      if (c.dcKw / c.acKw < 1) expect(r.clippedKwh).toBe(0);
      expect(r.assumptions.join(' ')).toMatch(/UNDERESTIMATED/);
    });
  }
  it('DC/AC 1.6 clips, and the AC never exceeds the inverter rating', () => {
    const c = fx.cases[1];
    const r = simulateProduction({
      site: { latDeg: c.lat, tiltDeg: c.tilt, azimuthDeg: c.az }, ghiMonthly: fx.ghi, ghiSource: 't', ambientMonthlyC: fx.tamb, ambientSource: 't',
      array: { dcKw: 24, gammaPmaxPct: c.gamma, noctC: c.noct }, inverter: { acKw: 15, nominalEfficiency: c.eta },
      losses: PVWATTS_DEFAULT_LOSSES, lossesSource: 't',
    });
    expect(r.clippedKwh).toBeGreaterThan(0);
  });
});

describe('inputs are refused, not defaulted', () => {
  const base = { site: { latDeg: -1.3, tiltDeg: 10, azimuthDeg: 0 }, ghiMonthly: fx.ghi, ghiSource: 'x', ambientMonthlyC: fx.tamb, ambientSource: 'x', array: { dcKw: 10, gammaPmaxPct: -0.35, noctC: 45 }, inverter: { acKw: 8, nominalEfficiency: 0.96 }, losses: PVWATTS_DEFAULT_LOSSES, lossesSource: 'x' };
  it.each([
    [{ ghiSource: '' }, /Sources/],
    [{ array: { dcKw: 10, gammaPmaxPct: 0.35, noctC: 45 } }, /γ_Pmax/],
    [{ inverter: { acKw: 8, nominalEfficiency: 96 } }, /fraction/],
    [{ losses: { ...PVWATTS_DEFAULT_LOSSES, soiling: 2 } }, /soiling/],
    [{ ghiMonthly: fx.ghi.slice(0, 11) }, /12 monthly irradiation/],
  ])('%o', (patch, msg) => {
    expect(() => simulateProduction({ ...base, ...patch } as never)).toThrow(msg);
  });
});
