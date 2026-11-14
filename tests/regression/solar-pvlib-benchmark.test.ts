import { describe, it, expect } from 'vitest';
import fixture from '../fixtures/pvlib-benchmark.json';
import { poaMonthly } from '@/lib/solar/poa';
import { cellTemperature } from '@/lib/solar/design/validate';

// Independent reference: pvlib-python (scripts/benchmarks/pvlib_poa_benchmark.py).
// Method A = same method, independent implementation (NREL SPA sun position, pvlib
// transposition). Method B = pvlib hourly Erbs decomposition (model uncertainty).
const pct = (a: number, b: number) => (Math.abs(a - b) / b) * 100;

describe(`plane-of-array irradiation vs pvlib ${fixture.pvlib}`, () => {
  for (const c of fixture.cases) {
    const ts = poaMonthly(c.lat, c.tilt, c.az, fixture.ghiMonthly);
    it(`${c.name}: annual within 1.5 % of pvlib (method A), every month within 3 %`, () => {
      expect(pct(ts.annual, c.methodA_annual)).toBeLessThan(1.5);
      ts.monthly.forEach((v, m) => expect(pct(v, c.methodA_monthly[m]), `month ${m + 1}: ${v} vs ${c.methodA_monthly[m]}`).toBeLessThan(3));
    });
    it(`${c.name}: within 3 % of pvlib's hourly Erbs model (model uncertainty)`, () => {
      expect(pct(ts.annual, c.methodB_annual)).toBeLessThan(3);
    });
  }
});

describe('cell temperature vs pvlib.temperature.ross (identical model)', () => {
  for (const r of fixture.ross) {
    it(`${r.poa} W/m², ${r.tAmb} °C, NOCT ${r.noct}: ${r.tCell.toFixed(2)} °C`, () => {
      expect(cellTemperature(r.tAmb, r.noct, r.poa)).toBeCloseTo(r.tCell, 9);
    });
  }
});
