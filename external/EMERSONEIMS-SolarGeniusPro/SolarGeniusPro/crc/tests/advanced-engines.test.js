// Golden-value tests for crc/server/advanced-engines.js
// Each test exercises a single engine and pins behaviour to a deterministic
// expectation. No randomness; no synthetic inputs.

'use strict';

const adv = require('../server/advanced-engines');

describe('decision.optimize', () => {
  test('returns a recommended design within budget for a typical SME load', () => {
    const r = adv.optimize({
      annualKwh: 18000, peakKw: 6, budgetKsh: 1_500_000,
      tariffKshPerKwh: 25.5
    });
    expect(r.recommended).toBeDefined();
    expect(r.recommended.capexKsh).toBeLessThanOrEqual(1_500_000);
    expect(r.recommended.npv25Ksh).toBeGreaterThan(0);
    expect(r.topCandidates.length).toBeGreaterThan(0);
  });

  test('throws on missing required fields', () => {
    expect(() => adv.optimize({ annualKwh: 1000 })).toThrow();
  });
});

describe('decision.recommend', () => {
  test('flags off-grid sites as critical', () => {
    const r = adv.recommend({ annualKwh: 6000, roofAreaM2: 60, hasGrid: false });
    expect(r.items.some((i) => i.severity === 'critical')).toBe(true);
  });
  test('warns when roof limits PV', () => {
    const r = adv.recommend({ annualKwh: 60000, roofAreaM2: 30, hasGrid: true });
    expect(r.constrainedBy).toBe('roof');
    expect(r.items.some((i) => i.severity === 'warn')).toBe(true);
  });
});

describe('decision.assessRisk', () => {
  test('flags grey-market sourcing as critical', () => {
    const r = adv.assessRisk({
      countryCode: 'KE', gridReliability: 0.95,
      contractor: 'certified', componentSourcing: 'grey-market'
    });
    expect(r.band).toBe('high');
    expect(r.factors.some((f) => f.severity === 'critical')).toBe(true);
  });
  test('clean inputs → low risk', () => {
    const r = adv.assessRisk({
      countryCode: 'KE', gridReliability: 0.97,
      currencyRiskPct: 5, contractor: 'certified', componentSourcing: 'authorised'
    });
    expect(r.band).toBe('low');
  });
});

describe('decision.scoreConfidence', () => {
  test('high-quality inputs → high band', () => {
    const r = adv.scoreConfidence({
      dataSources: [{ name: 'NASA POWER', ageDays: 30 }, { name: 'PVGIS', ageDays: 90 }, { name: 'utility-bill', ageDays: 30 }, { name: 'datasheet', ageDays: 60 }],
      modelMape: 0.05, shadingDataPresent: true, equipmentSpecsFromDatasheet: true
    });
    expect(r.band).toBe('high');
  });
});

describe('simulation.energy', () => {
  test('25-yr lifetime kWh = sum of degraded series', () => {
    const r = adv.simulateEnergy({ systemKwp: 5, baseAnnualKwhPerKwp: 1500 });
    expect(r.years).toHaveLength(25);
    expect(r.years[0].kwh).toBe(7500);              // 5 × 1500
    // Year-25 must be less than year-1 due to degradation
    expect(r.years[24].kwh).toBeLessThan(r.years[0].kwh);
    expect(r.totalLifetimeKwh).toBe(r.years.reduce((a, y) => a + y.kwh, 0));
  });
});

describe('simulation.financial', () => {
  test('NPV positive for sensible Kenya numbers', () => {
    const r = adv.simulateFinancial({
      capexKsh: 800_000, annualSavingsKsh: 200_000
    });
    expect(r.npvKsh).toBeGreaterThan(0);
    expect(r.irrPct).toBeGreaterThan(15);
    expect(r.paybackYears).toBeLessThan(8);
  });
});

describe('simulation.loadBehavior', () => {
  test('summed daily kWh = sum of appliance energies', () => {
    const r = adv.simulateLoadBehavior({
      appliances: [
        { name: 'fridge', watts: 150, hoursPerDay: 24, dutyCycle: 0.4 },
        { name: 'tv',     watts: 100, hoursPerDay: 4 }
      ]
    });
    // 150 W × 24 h × 0.4 = 1.44 kWh ; 100 W × 4 h = 0.40 kWh ; sum = 1.84
    expect(r.dailyKwh).toBeCloseTo(1.84, 2);
    expect(r.peakKw).toBeGreaterThan(0);
    expect(r.hourlyProfile).toHaveLength(24);
  });
});

describe('governance.audit', () => {
  test('log → query → stats round-trip', () => {
    adv.auditLog({ actor: 'user-1', action: 'design.create', tenantId: 't1' });
    adv.auditLog({ actor: 'user-1', action: 'design.export', tenantId: 't1' });
    const q = adv.auditQuery({ tenantId: 't1' });
    expect(q.length).toBeGreaterThanOrEqual(2);
    const s = adv.auditStatistics({ tenantId: 't1', hoursBack: 1 });
    expect(s.totalEvents).toBeGreaterThanOrEqual(2);
    expect(s.byAction['design.create']).toBeGreaterThanOrEqual(1);
  });
});

describe('governance.bias', () => {
  test('detects parity gap across groups', () => {
    const r = adv.detectBias({
      predictions: [
        { group: 'A', value: 0.50 }, { group: 'A', value: 0.55 }, { group: 'A', value: 0.52 },
        { group: 'B', value: 0.80 }, { group: 'B', value: 0.78 }, { group: 'B', value: 0.82 }
      ]
    });
    expect(r.parityGapMean).toBeGreaterThan(0.20);
    expect(r.band).toBe('biased');
  });
});

describe('governance.drift (PSI)', () => {
  test('identical distributions → no-drift', () => {
    const xs = Array.from({ length: 100 }, (_, i) => i / 100);
    const r = adv.detectDrift({ baseline: xs, current: xs.slice() });
    expect(r.psi).toBeLessThan(0.10);
    expect(r.band).toBe('no-drift');
  });
  test('shifted distribution → significant drift', () => {
    const baseline = Array.from({ length: 100 }, (_, i) => i / 100);
    const current  = Array.from({ length: 100 }, (_, i) => i / 100 + 0.5);
    const r = adv.detectDrift({ baseline, current });
    expect(r.psi).toBeGreaterThan(0.25);
    expect(r.band).toBe('significant-drift');
  });
});

describe('governance.explain', () => {
  test('contributions sum to prediction − base', () => {
    const r = adv.explain({
      baseValue: 0.5, prediction: 0.8,
      contributions: [
        { feature: 'irradiance', value: 0.20 },
        { feature: 'tilt',       value: 0.05 },
        { feature: 'shading',    value: 0.05 }
      ]
    });
    expect(r.reconstructed).toBeCloseTo(0.80, 2);
    expect(r.contributions[0].feature).toBe('irradiance');  // sorted by |value|
  });
});

describe('pipeline.cleanData', () => {
  test('dedupes and fixes negative prices', () => {
    const r = adv.cleanData({
      records: [
        { id: 1, priceKsh: -100 },
        { id: 1, priceKsh: -100 },             // duplicate
        { id: 2, priceKsh: 200 }
      ]
    });
    expect(r.cleaned).toHaveLength(2);
    expect(r.stats.deduped).toBe(1);
    expect(r.stats.negFixed).toBeGreaterThanOrEqual(1);
    expect(r.cleaned[0].priceKsh).toBe(100);
  });
});

describe('pipeline.normalize', () => {
  test('min-max scales to [0,1]', () => {
    const r = adv.normalize({ values: [10, 20, 30] });
    expect(r.normalized).toEqual([0, 0.5, 1]);
  });
});

describe('pipeline.validateSolar', () => {
  test('rejects out-of-range systemKwp', () => {
    const r = adv.validateSolarData({ systemKwp: 9999 });
    expect(r.valid).toBe(false);
    expect(r.issues[0].field).toBe('systemKwp');
  });
});

describe('learning.feedback + performance', () => {
  test('feedback computes errors deterministically', () => {
    const r = adv.recordFeedback({ modelId: 'm1', predicted: 90, actual: 100 });
    expect(r.error).toBe(10);
    expect(r.absPctErr).toBe(0.1);
  });
  test('performance computes MAE/RMSE/MAPE', () => {
    const r = adv.trackPerformance({
      modelId: 'm1',
      predictions: [100, 110, 90],
      actuals:     [105, 100, 95]
    });
    expect(r.mae).toBeCloseTo(6.667, 2);
    expect(r.rmse).toBeGreaterThan(r.mae);
    expect(r.mape).toBeGreaterThan(0);
  });
});

describe('digitalTwin.lifecycle', () => {
  test('25-yr series + replacement events', () => {
    const r = adv.lifecycle({
      systemKw: 5, capexKsh: 800_000,
      baseAnnualKwh: 7500, tariffKshPerKwh: 25.5,
      inverterReplaceCostKsh: 80_000, batteryReplaceCostKsh: 120_000
    });
    expect(r.series).toHaveLength(25);
    const yr10 = r.series.find((y) => y.year === 10);
    expect(yr10.events.some((e) => e.kind === 'inverter-replace')).toBe(true);
    const yr12 = r.series.find((y) => y.year === 12);
    expect(yr12.events.some((e) => e.kind === 'battery-replace')).toBe(true);
  });
});

describe('market.scoreSupplier', () => {
  test('low price + fast lead + good warranty → preferred', () => {
    const r = adv.scoreSupplier({
      priceVsMedianPct: -10, leadTimeDays: 14,
      warrantySupportScore: 0.9, disputeRatePct: 1
    });
    expect(r.band).toBe('preferred');
  });
  test('grey-market profile → avoid', () => {
    const r = adv.scoreSupplier({
      priceVsMedianPct: 30, leadTimeDays: 90,
      warrantySupportScore: 0.1, disputeRatePct: 25
    });
    expect(r.band).toBe('avoid');
  });
});

describe('equipment library expansion', () => {
  const lib = require('../server/equipment-library');
  test('library has 20 panels, 15 inverters, 10 batteries', () => {
    expect(lib.PANELS.length).toBe(20);
    expect(lib.INVERTERS.length).toBe(15);
    expect(lib.BATTERIES.length).toBe(10);
  });
  test('every entry has a datasheet URL and a revision date', () => {
    for (const arr of [lib.PANELS, lib.INVERTERS, lib.BATTERIES]) {
      for (const e of arr) {
        expect(typeof e.datasheetUrl).toBe('string');
        expect(e.datasheetUrl).toMatch(/^https?:\/\//);
        expect(typeof e.revision).toBe('string');
        expect(e.revision).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
});
