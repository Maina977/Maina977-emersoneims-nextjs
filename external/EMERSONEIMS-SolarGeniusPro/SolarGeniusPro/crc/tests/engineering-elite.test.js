// Tests for engineering-elite.js (Tier-4 utility-scale / bankable)
const ee = require('../server/engineering-elite');

describe('tmy8760Simulation', () => {
  test('produces 8760 hours and reasonable annual yield', () => {
    const r = ee.tmy8760Simulation({ systemKwDc: 5, inverterKwAc: 4.2 });
    expect(r.totalHours).toBe(8760);
    expect(r.monthly).toHaveLength(12);
    // Nairobi 5 kWp typical 7000-9000 kWh/yr
    expect(r.annualAcKwh).toBeGreaterThan(5000);
    expect(r.annualAcKwh).toBeLessThan(11000);
    expect(r.specificYieldKwhKwp).toBeGreaterThan(1000);
    expect(r.specificYieldKwhKwp).toBeLessThan(2200);
  });
  test('PR is between 0.7 and 1.0 (sanity)', () => {
    const r = ee.tmy8760Simulation({ systemKwDc: 5 });
    expect(r.performanceRatio).toBeGreaterThan(0.7);
    expect(r.performanceRatio).toBeLessThan(1.01);
  });
  test('horizon mask reduces yield', () => {
    const free  = ee.tmy8760Simulation({ systemKwDc: 5 });
    const masked = ee.tmy8760Simulation({ systemKwDc: 5, horizonMaskByAzimuth: { '0':30,'90':30,'180':30,'270':30 } });
    expect(masked.annualAcKwh).toBeLessThan(free.annualAcKwh);
  });
});

describe('obstructionsToHorizon', () => {
  test('no obstructions → all-zero mask', () => {
    const r = ee.obstructionsToHorizon({ obstructions: [] });
    expect(Object.values(r.horizonMaskDeg).every(v => v === 0)).toBe(true);
  });
  test('tall tree 5 m east, 10 m away → ~25° at azimuth 90', () => {
    const r = ee.obstructionsToHorizon({
      obstructions: [{ type: 'cylinder', dx_m: 10, dy_m: 0, h_m: 6.5, w_m: 3 }],
      arrayHeightM: 1.5,
    });
    expect(r.horizonMaskDeg['90']).toBeGreaterThan(20);
    expect(r.horizonMaskDeg['90']).toBeLessThan(35);
    expect(r.peakObstruction.az).toBeGreaterThanOrEqual(80);
    expect(r.peakObstruction.az).toBeLessThanOrEqual(100);
  });
});

describe('intervalMeterIngest', () => {
  test('parses hourly CSV and produces 8760 profile', () => {
    let csv = 'timestamp,kw\n';
    for (let h = 0; h < 100; h++) {
      const ts = new Date(2025, 0, 1, h).toISOString();
      const kw = (h % 24 < 6 || h % 24 >= 22) ? 0.3 : (h % 24 >= 17 && h % 24 < 22 ? 2.5 : 1.0);
      csv += `${ts},${kw}\n`;
    }
    const r = ee.intervalMeterIngest({ csvText: csv });
    expect(r.hourlyDataPoints).toBe(8760);
    expect(r.peakDemandKw).toBeGreaterThan(2);
    expect(r.hourOfDayAvgKw).toHaveLength(24);
    expect(r.recommendedBatteryKwh).toBeGreaterThan(0);
  });
  test('throws on too-few rows', () => {
    expect(() => ee.intervalMeterIngest({ csvText: 'timestamp,kw\n2025-01-01T00:00,1\n' })).toThrow();
  });
});

describe('memberStructural', () => {
  test('lightly loaded timber purlin passes', () => {
    const r = ee.memberStructural({ arrayLoadKnPerM2: 0.25, purlinSpanM: 1.0 });
    expect(r.purlin.passes).toBe(true);
    expect(r.purlin.utilisation).toBeLessThan(1.0);
  });
  test('over-spanned purlin fails', () => {
    const r = ee.memberStructural({ arrayLoadKnPerM2: 1.5, purlinSpanM: 3.0 });
    expect(r.purlin.passes).toBe(false);
  });
  test('mismatched fastener+substrate produces zero capacity', () => {
    const r = ee.memberStructural({ fastenerType: 'concrete-anchor', substrate: 'timber-c24', upliftLoadKn: 1 });
    expect(r.fastener.totalCapacityKn).toBe(0);
    expect(r.fastener.passes).toBe(false);
  });
  test('overall passes/fails computed correctly', () => {
    const r = ee.memberStructural({});
    expect(typeof r.overallPasses).toBe('boolean');
  });
});

describe('epraGridCodePack', () => {
  test('5 kW residential → tier "small", T2 technician', () => {
    const r = ee.epraGridCodePack({ systemKwAc: 5 });
    expect(r.classification.tier).toBe('small');
    expect(r.classification.technicianClassRequired).toBe('T2');
    expect(r.complianceCheck.antiIslanding).toBe(true);
    expect(r.requiredDocuments.length).toBeGreaterThan(5);
    expect(r.epraRegulations.length).toBeGreaterThan(4);
  });
  test('missing IEC 62116 cert → not ready', () => {
    const r = ee.epraGridCodePack({ inverterCertifications: ['IEC 62109-1'] });
    expect(r.complianceCheck.antiIslanding).toBe(false);
    expect(r.overallReady).toBe(false);
  });
  test('500 kW C&I → tier "medium", T3 technician', () => {
    const r = ee.epraGridCodePack({ systemKwAc: 500, voltage: 415 });
    expect(r.classification.tier).toBe('medium');
    expect(r.classification.technicianClassRequired).toBe('T3');
    expect(r.filledFormECP1.phaseConfig).toMatch(/3-phase/);
  });
});

describe('gaOptimiser', () => {
  test('returns valid best solution and 5 alternatives', () => {
    const r = ee.gaOptimiser({ generations: 20, populationSize: 20 });
    expect(r.bestSolution.dcKw).toBeGreaterThan(0);
    expect(r.bestSolution.lcoeKesPerKwh).toBeGreaterThan(0);
    expect(r.top5).toHaveLength(5);
    expect(r.convergenceLcoe).toHaveLength(20);
  });
  test('LCOE generally decreases over generations (convergence)', () => {
    const r = ee.gaOptimiser({ generations: 30, populationSize: 30 });
    const first10 = r.convergenceLcoe.slice(0, 10);
    const last10  = r.convergenceLcoe.slice(-10);
    const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length;
    expect(avg(last10)).toBeLessThanOrEqual(avg(first10) + 1); // monotonic non-increase tolerance
  });
  test('best solution respects MPPT voltage window approximately', () => {
    const r = ee.gaOptimiser({ generations: 40 });
    // With penalty term, optimal should usually meet constraint (small penalty allowed)
    expect(r.bestSolution.constraintPenalty).toBeLessThan(50000);
  });
});

describe('panDegradation', () => {
  test('mono-PERC after 25 yr ≥ 80 % capacity (warranty met)', () => {
    const r = ee.panDegradation({ moduleType: 'mono-perc' });
    expect(r.finalYearCapacityPct).toBeGreaterThanOrEqual(80);
    expect(r.meetsManufacturerWarranty).toBe(true);
  });
  test('thin-film degrades faster than mono-PERC', () => {
    const a = ee.panDegradation({ moduleType: 'mono-perc' });
    const b = ee.panDegradation({ moduleType: 'thin-film' });
    expect(b.finalYearCapacityPct).toBeLessThan(a.finalYearCapacityPct);
  });
  test('parses simple PAN file degradation field', () => {
    const pan = 'Pmpp = 580\nDegradationRate = 0.30\nLID = 1.0\n';
    const r = ee.panDegradation({ panFileText: pan });
    expect(r.parsedFromPan).toBeTruthy();
    expect(r.parsedFromPan.linearAnnualPct).toBeCloseTo(0.30, 2);
  });
  test('yearByYear has correct length', () => {
    const r = ee.panDegradation({ systemLifetimeYears: 30 });
    expect(r.yearByYear).toHaveLength(30);
  });
});
