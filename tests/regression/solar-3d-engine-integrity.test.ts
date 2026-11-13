/**
 * Solar 3D design engine (/solar), P0 audit 2026-11-13:
 *  - shading was a random 85-100% per hour and each panel a random 85-95%
 *    efficiency, so the same roof gave a different kWh/year on every run;
 *  - the loss list shown was not the one applied to production;
 *  - "IRR" was simple yield + tariff inflation;
 *  - every system was priced at KES 25,000/panel with a KES 22/kWh tariff.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateRoof3D, optimizePanelPlacement, calculatePerformance, calculateFinancials, internalRateOfReturn, performanceRatioFrom, DEFAULT_LOSSES_PCT, DEFAULT_INVERTER_EFFICIENCY } from '@/lib/solar/solar3DDesignEngine';

const PANEL = { width: 1134, height: 2278, wattage: 545 };
const design = () => {
  const roof = generateRoof3D('kenyan_bungalow', undefined, 'nairobi');
  const panels = optimizePanelPlacement(roof, PANEL, 5);
  return { roof, panels, perf: calculatePerformance(panels, roof) };
};

describe('production is deterministic and self-consistent', () => {
  it('the same roof and panels give the same kWh/year every time', () => {
    const a = design(), b = design();
    expect(a.panels.length).toBeGreaterThan(0);
    expect(b.perf.annualProduction).toBe(a.perf.annualProduction);
    expect(new Set(a.panels.map((p) => p.efficiencyFactor)).size).toBe(1);
  });

  it('kWh/year = Σ kWp × irradiance × the performance ratio shown', () => {
    const { roof, panels, perf } = design();
    const pr = perf.performanceRatio / 100;
    const expected = panels.reduce((s, p) => s + (p.wattage! / 1000) * roof.segments.find((g) => g.id === p.segmentId)!.annualIrradiance * pr, 0);
    expect(perf.annualProduction).toBeCloseTo(expected, 6);
    expect(perf.losses.total).toBeCloseTo(100 - perf.performanceRatio, 9);
    expect(pr).toBeCloseTo(performanceRatioFrom(DEFAULT_LOSSES_PCT, DEFAULT_INVERTER_EFFICIENCY), 12);
  });

  it('shading is reported as not assessed (0%), not invented', () => {
    expect(design().perf.losses.shading).toBe(0);
  });

  it('kWp comes from the placed panels', () => {
    const { panels, perf } = design();
    expect(perf.peakPower).toBeCloseTo(panels.length * 0.545, 9);
  });
});

describe('financials', () => {
  it('IRR is solved from the cash flows: -1000 then 5 × 300 → 15.24 %', () => {
    expect((internalRateOfReturn([-1000, 300, 300, 300, 300, 300]) as number) * 100).toBeCloseTo(15.24, 2);
  });
  it('a project that loses money has a negative IRR; one with no sign change has none', () => {
    // -1000 then 3 × 10: NPV(r) = 0 at r ≈ -76.55 % (checked by hand: 10/x + 10/x² + 10/x³ = 1000, x = 1 + r ≈ 0.2345)
    expect((internalRateOfReturn([-1000, 10, 10, 10]) as number) * 100).toBeCloseTo(-76.55, 1);
    expect(internalRateOfReturn([-1000, -10])).toBeNull();
  });
  it('IRR in the projection makes the NPV of its own savings zero', () => {
    const f = calculateFinancials(1_000_000, 8000, 25, 0.05, 0.005, 0.1);
    const r = f.irr / 100;
    const npv = -1_000_000 + f.yearlyProjection.reduce((s, y) => s + y.savings / (1 + r) ** y.year, 0);
    expect(Math.abs(npv)).toBeLessThan(1_000_000 * 0.002); // within rounding of the yearly savings
  });
  it('refuses to run without a cost or tariff (no default prices)', () => {
    expect(() => calculateFinancials(0, 8000, 25, 0)).toThrow();
    expect(() => calculateFinancials(1_000_000, 8000, 0, 0)).toThrow();
  });
  it('the studio no longer prices panels or assumes a tariff', () => {
    const ui = readFileSync(join(__dirname, '..', '..', 'components', 'solar', 'Solar3DDesignStudio.tsx'), 'utf8');
    expect(ui).not.toMatch(/\* 25000/);
    expect(ui).not.toMatch(/calculateFinancials\([^)]*\b22\b/);
    expect(ui).not.toMatch(/World&apos;s Most Advanced/);
  });
});
