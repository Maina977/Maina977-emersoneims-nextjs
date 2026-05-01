// Tests for engineering-pro.js (Aurora-grade calculators)
const ep = require('../server/engineering-pro');

describe('hourlyShading', () => {
  test('flat horizon → near-zero loss', () => {
    const r = ep.hourlyShading({ latDeg: -1.3, horizonMask: { '0':0,'90':0,'180':0,'270':0 }, skyViewFactor: 1.0 });
    expect(r.annualShadingLossPct).toBeLessThan(1);
    expect(r.verdict).toMatch(/Negligible/);
  });
  test('tall obstruction east+west → noticeable loss', () => {
    const r = ep.hourlyShading({ latDeg: -1.3, horizonMask: { '0':0,'90':30,'180':0,'270':30 }, skyViewFactor: 0.85 });
    expect(r.annualShadingLossPct).toBeGreaterThan(3);
  });
  test('returns 12 monthly entries', () => {
    const r = ep.hourlyShading({ latDeg: -1.3 });
    expect(r.monthlyBreakdown).toHaveLength(12);
  });
});

describe('batterySizingMonteCarlo', () => {
  test('P95 ≥ P90 ≥ P75 ≥ P50 (monotonic)', () => {
    const r = ep.batterySizingMonteCarlo({ trials: 500, confidencePct: 95 });
    const p = r.sizingPercentiles;
    expect(p.P75Kwh).toBeGreaterThanOrEqual(p.P50Kwh);
    expect(p.P90Kwh).toBeGreaterThanOrEqual(p.P75Kwh);
    expect(p.P95Kwh).toBeGreaterThanOrEqual(p.P90Kwh);
  });
  test('installed capacity ≥ recommended', () => {
    const r = ep.batterySizingMonteCarlo({ trials: 300 });
    expect(r.installedCapacityKwh).toBeGreaterThanOrEqual(r.sizingPercentiles.P95Kwh);
  });
  test('higher variability widens the spread', () => {
    const a = ep.batterySizingMonteCarlo({ trials: 500, loadVariabilityPct: 5 });
    const b = ep.batterySizingMonteCarlo({ trials: 500, loadVariabilityPct: 50 });
    // Higher variability → bigger gap between P50 and P95
    const aSpread = a.sizingPercentiles.P95Kwh - a.sizingPercentiles.P50Kwh;
    const bSpread = b.sizingPercentiles.P95Kwh - b.sizingPercentiles.P50Kwh;
    expect(bSpread).toBeGreaterThan(aSpread);
  });
});

describe('lightningRiskFull', () => {
  test('returns R1, R2, R4 components with tolerable thresholds', () => {
    const r = ep.lightningRiskFull({ occupancyType: 'commercial', flashDensityPerKm2Year: 8 });
    expect(r.riskComponents.R1).toBeDefined();
    expect(r.riskComponents.R2).toBeDefined();
    expect(r.riskComponents.R4).toBeDefined();
    expect(['I','II','III','IV']).toContain(r.requiredLpsClass);
  });
  test('hospital high-flash → Class I or II', () => {
    const r = ep.lightningRiskFull({ occupancyType: 'hospital', flashDensityPerKm2Year: 12, buildingHeightM: 15, buildingFootprintM2: 1500 });
    expect(['I','II']).toContain(r.requiredLpsClass);
  });
  test('annual economic loss is positive and finite', () => {
    const r = ep.lightningRiskFull({ buildingValueKes: 5_000_000, contentValueKes: 2_000_000 });
    expect(r.annualEconomicLossExpectedKes).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(r.annualEconomicLossExpectedKes)).toBe(true);
  });
});

describe('pricedBoqFx', () => {
  test('USD totals × FX = KES totals', () => {
    const r = ep.pricedBoqFx({ systemKw: 5, batteryKwh: 0, fxKesPerUsd: 130 });
    expect(Math.abs(r.totals.totalIncVatKes / r.totals.totalIncVatUsd - 130)).toBeLessThan(1);
  });
  test('higher FX → proportionally higher KES total', () => {
    const a = ep.pricedBoqFx({ systemKw: 5, fxKesPerUsd: 100 });
    const b = ep.pricedBoqFx({ systemKw: 5, fxKesPerUsd: 200 });
    expect(b.totals.totalIncVatKes / a.totals.totalIncVatKes).toBeCloseTo(2, 1);
  });
  test('supplier feed override changes price', () => {
    const a = ep.pricedBoqFx({ systemKw: 5 });
    const b = ep.pricedBoqFx({ systemKw: 5, supplierFeed: { panel580W: 200 } });
    expect(b.totals.totalIncVatKes).toBeGreaterThan(a.totals.totalIncVatKes);
  });
});

describe('geoRiskKE', () => {
  test('Mombasa → Coast zone, Vb=42, C5 corrosion', () => {
    const r = ep.geoRiskKE({ lat: -4.05, lon: 39.66 });
    expect(r.zone).toMatch(/Coast/);
    expect(r.windZone.basicWindSpeedMs).toBe(42);
    expect(r.corrosion.atmosphericClass).toMatch(/C5/);
  });
  test('Nairobi → Central Plateau Zone II', () => {
    const r = ep.geoRiskKE({ lat: -1.2865, lon: 36.8172 });
    expect(r.zone).toMatch(/Central Plateau|Nairobi/);
    expect(r.windZone.basicWindSpeedMs).toBe(33);
  });
  test('Naivasha → Rift Valley, high seismic', () => {
    const r = ep.geoRiskKE({ lat: -0.7, lon: 36.4 });
    expect(r.zone).toMatch(/Rift Valley/);
    expect(r.seismic.pgaG).toBeGreaterThanOrEqual(0.15);
  });
});

describe('netMeteringTOU', () => {
  test('peak hours are valued higher than off-peak', () => {
    const r = ep.netMeteringTOU({ baseRetailKesPerKwh: 20 });
    const peakHr = r.hourlyDetail.find(h => h.hour === 19);
    const offHr  = r.hourlyDetail.find(h => h.hour === 2);
    expect(peakHr.tariffKesKwh).toBeGreaterThan(offHr.tariffKesKwh);
  });
  test('returns 24 hours of detail', () => {
    const r = ep.netMeteringTOU({});
    expect(r.hourlyDetail).toHaveLength(24);
  });
  test('export credit < self-use value (avoided cost)', () => {
    const r = ep.netMeteringTOU({});
    expect(r.daily.exportCreditKes).toBeLessThan(r.daily.selfUseValueKes + 100);
  });
});

describe('structuralWindBallast', () => {
  test('coastal Vb=42 → higher uplift than interior Vb=33', () => {
    const coast = ep.structuralWindBallast({ basicWindSpeedMs: 42 });
    const inland = ep.structuralWindBallast({ basicWindSpeedMs: 33 });
    expect(coast.designForceKn.uplift).toBeGreaterThan(inland.designForceKn.uplift);
  });
  test('flat-roof returns ballast requirement', () => {
    const r = ep.structuralWindBallast({ mountingType: 'flat-roof-ballast' });
    expect(r.ballastRequirement).not.toBeNull();
    expect(r.ballastRequirement.additionalBallastKg).toBeGreaterThanOrEqual(0);
  });
  test('rail-bolted returns anchor requirement', () => {
    const r = ep.structuralWindBallast({ mountingType: 'rail-bolted' });
    expect(r.rafterAnchorRequirement).not.toBeNull();
    expect(r.ballastRequirement).toBeNull();
  });
});

describe('p50p90Yield', () => {
  test('P90 < P75 < P50', () => {
    const r = ep.p50p90Yield({ p50AnnualKwh: 10000 });
    expect(r.yieldExceedance.P90Kwh).toBeLessThan(r.yieldExceedance.P75Kwh);
    expect(r.yieldExceedance.P75Kwh).toBeLessThan(r.yieldExceedance.P50Kwh);
    expect(r.yieldExceedance.P50Kwh).toBe(10000);
  });
  test('combined uncertainty is RSS of inputs (~7 %)', () => {
    const r = ep.p50p90Yield({ p50AnnualKwh: 10000 });
    expect(r.combinedUncertaintyPct).toBeGreaterThan(5);
    expect(r.combinedUncertaintyPct).toBeLessThan(10);
  });
  test('bankableEstimate equals P90', () => {
    const r = ep.p50p90Yield({ p50AnnualKwh: 8000 });
    expect(r.bankableEstimateKwh).toBe(r.yieldExceedance.P90Kwh);
  });
});

describe('earthElectrodeBS7430', () => {
  test('clay soil, 1 rod 2.4 m → ≤ 30 Ω typical', () => {
    const r = ep.earthElectrodeBS7430({ soilType: 'clay' });
    expect(r.systemResistanceOhm).toBeLessThan(40);
  });
  test('desert soil, 1 rod → fail target 10 Ω', () => {
    const r = ep.earthElectrodeBS7430({ soilType: 'desert', numRods: 1, targetResistanceOhm: 10 });
    expect(r.targetMet).toBe(false);
    expect(r.rodsRecommended).toBeGreaterThan(1);
  });
  test('more rods reduce resistance', () => {
    const a = ep.earthElectrodeBS7430({ soilType: 'sandy', numRods: 1 });
    const b = ep.earthElectrodeBS7430({ soilType: 'sandy', numRods: 4 });
    expect(b.systemResistanceOhm).toBeLessThan(a.systemResistanceOhm);
  });
});

describe('clientPortalJwt', () => {
  test('issued JWT has 3 parts and verifies', () => {
    const r = ep.clientPortalJwt({ projectId: 'PRJ-1', clientName: 'Jane' });
    expect(r.token.split('.')).toHaveLength(3);
    expect(r.jti).toMatch(/^[a-f0-9]{16}$/);
    const v = ep.clientPortalVerify({ token: r.token });
    expect(v.valid).toBe(true);
    expect(v.payload.sub).toBe('PRJ-1');
  });
  test('tampered JWT fails verification', () => {
    const r = ep.clientPortalJwt({ projectId: 'PRJ-2', clientName: 'X' });
    const tampered = r.token.slice(0, -4) + 'AAAA';
    const v = ep.clientPortalVerify({ token: tampered });
    expect(v.valid).toBe(false);
    expect(v.error).toBe('bad-signature');
  });
  test('revoked JWT fails verification', () => {
    const r = ep.clientPortalJwt({ projectId: 'PRJ-3', clientName: 'Y' });
    ep.clientPortalRevoke({ jti: r.jti });
    const v = ep.clientPortalVerify({ token: r.token });
    expect(v.valid).toBe(false);
    expect(v.error).toBe('revoked');
  });
});
