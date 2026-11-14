import { describe, it, expect } from 'vitest';
import fx from '../fixtures/pvlib-hourly.json';
import { simulateHourly, solarPosition, erbs, extraterrestrial } from '@/lib/solar/design/hourly';
import { simulateProduction, PVWATTS_DEFAULT_LOSSES } from '@/lib/solar/design/production';

// Reference: pvlib (scripts/benchmarks/pvlib_hourly_benchmark.py) on a synthetic
// test year, identical inputs. Simulation-to-simulation: NOT field validation.
const pct = (a: number, b: number) => (Math.abs(a - b) / b) * 100;
const run = (dcKw: number, acKw: number) => simulateHourly({
  site: { latDeg: fx.site.lat, lonDeg: fx.site.lon, tiltDeg: fx.site.tilt, azimuthDeg: fx.site.az },
  start: fx.start, ghiWm2: fx.ghi, tempC: fx.tamb, weatherSource: 'synthetic test year (pvlib clear sky × seeded clearness)',
  array: { dcKw, gammaPmaxPct: fx.gamma, noctC: fx.noct }, inverter: { acKw, nominalEfficiency: fx.eta },
  losses: PVWATTS_DEFAULT_LOSSES, lossesSource: 'PVWatts v5 defaults',
});

describe('building blocks', () => {
  it('sun near overhead at Nairobi local noon around the March equinox', () => {
    const s = solarPosition(Date.parse('2026-03-20T09:40:00Z'), -1.2921, 36.8219); // solar noon incl. equation of time
    expect(s.zenith).toBeLessThan(1.8); // |lat − declination| ≈ 1.3°
  });
  it('Spencer extraterrestrial irradiance: perihelion > aphelion, ~1366 mean', () => {
    expect(extraterrestrial(3)).toBeGreaterThan(1405);
    expect(extraterrestrial(185)).toBeLessThan(1325);
  });
  it('Erbs: overcast sky is all diffuse; night gives nothing', () => {
    expect(erbs(50, 30, 1400).dhi).toBeCloseTo(50 * (1 - 0.09 * (50 / (1400 * Math.cos(30 * Math.PI / 180)))), 6);
    expect(erbs(10, 89, 1400)).toEqual({ dni: 0, dhi: 10 });
  });
});

describe(`hourly production vs pvlib ${fx.pvlib}`, () => {
  for (const c of fx.cases) {
    const r = run(c.dcKw, c.acKw);
    it(`DC/AC ${c.dcKw / c.acKw}: annual within 1 %, each month within 2 %`, () => {
      expect(pct(r.annualKwh, c.annualKwh), `${r.annualKwh} vs ${c.annualKwh}`).toBeLessThan(1);
      r.monthlyKwh.forEach((v, m) => expect(pct(v, c.monthlyKwh[m]), `month ${m + 1}: ${v} vs ${c.monthlyKwh[m]}`).toBeLessThan(2));
    });
    it(`DC/AC ${c.dcKw / c.acKw}: clipping ${c.clippedKwh} kWh reproduced (±10 % or ±5 kWh)`, () => {
      expect(Math.abs(r.clippedKwh - c.clippedKwh)).toBeLessThanOrEqual(Math.max(5, 0.1 * c.clippedKwh));
    });
  }
  it('the hourly model removes the mean-day overestimate at DC/AC 1.6', () => {
    const c = fx.cases[2];
    const monthlyGhi = Array.from({ length: 12 }, (_, m) => {
      const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
      const startH = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][m] * 24;
      return fx.ghi.slice(startH, startH + days * 24).reduce((a, b) => a + b, 0) / 1000 / days;
    });
    const meanDay = simulateProduction({ site: { latDeg: fx.site.lat, tiltDeg: fx.site.tilt, azimuthDeg: fx.site.az }, ghiMonthly: monthlyGhi, ghiSource: 't', ambientMonthlyC: [24, 25, 25, 23, 22, 21, 20, 21, 23, 24, 23, 23], ambientSource: 't', array: { dcKw: c.dcKw, gammaPmaxPct: fx.gamma, noctC: fx.noct }, inverter: { acKw: c.acKw, nominalEfficiency: fx.eta }, losses: PVWATTS_DEFAULT_LOSSES, lossesSource: 't' });
    const hourly = run(c.dcKw, c.acKw);
    expect(meanDay.annualKwh).toBeGreaterThan(c.annualKwh * 1.02); // mean-day overestimates
    expect(pct(hourly.annualKwh, c.annualKwh)).toBeLessThan(1); // hourly does not
  });
  it('gaps are refused, not filled', () => {
    const ghi = [...fx.ghi]; ghi[100] = NaN;
    expect(() => simulateHourly({ site: { latDeg: 0, lonDeg: 37, tiltDeg: 10, azimuthDeg: 0 }, start: fx.start, ghiWm2: ghi, tempC: fx.tamb, weatherSource: 'x', array: { dcKw: 10, gammaPmaxPct: -0.35, noctC: 45 }, inverter: { acKw: 10, nominalEfficiency: 0.96 }, losses: PVWATTS_DEFAULT_LOSSES, lossesSource: 'x' })).toThrow(/no gaps/);
  });
});
