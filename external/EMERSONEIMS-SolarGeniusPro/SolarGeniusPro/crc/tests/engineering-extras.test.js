// Unit tests for engineering-extras.js — golden-value & invariants
const ext = require('../server/engineering-extras');

describe('lightningRiskClass (IEC 62305)', () => {
  test('residential rural low-density → Class III or IV', () => {
    const r = ext.lightningRiskClass({
      occupancyType: 'residential', flashDensityPerKm2Year: 4,
      buildingHeightM: 4, buildingFootprintM2: 80,
      metallicServicesEntering: false,
    });
    expect(['III', 'IV']).toContain(r.lpsClass);
    expect([45, 60]).toContain(r.rollingSphereRadiusM);
    expect(r.spdRecommendation.dcSide).toMatch(/Type 2/);
  });
  test('hospital high-density → upgraded class', () => {
    const r = ext.lightningRiskClass({
      occupancyType: 'hospital', flashDensityPerKm2Year: 12,
      buildingHeightM: 15, buildingFootprintM2: 2000,
    });
    expect(['I', 'II']).toContain(r.lpsClass);
    expect(r.spdRecommendation.dcSide).toMatch(/Type 1/);
  });
  test('returns provenance', () => {
    const r = ext.lightningRiskClass({});
    expect(r.provenance).toBeDefined();
    expect(r.provenance.reference).toMatch(/IEC 62305/);
  });
});

describe('batterySizing (IEEE 1561)', () => {
  test('5 kWh daily, 1-day autonomy, LiFePO4', () => {
    const r = ext.batterySizing({ dailyCriticalLoadKwh: 5, autonomyDays: 1 });
    expect(r.energyRequiredKwh).toBeGreaterThan(5);
    expect(r.energyRequiredKwh).toBeLessThan(10);
    expect(r.installedCapacityKwh).toBeGreaterThanOrEqual(r.energyRequiredKwh);
    expect(r.moduleSizeKwh).toBe(5);
  });
  test('lead-acid uses smaller modules and lower DoD', () => {
    const r = ext.batterySizing({ dailyCriticalLoadKwh: 5, chemistry: 'lead-acid', depthOfDischarge: 0.5, roundTripEfficiency: 0.80 });
    expect(r.moduleSizeKwh).toBe(2.4);
    expect(r.energyRequiredKwh).toBeGreaterThan(12); // 5 / (0.80 * 0.5 * 0.85) ≈ 14.7
  });
  test('higher autonomy scales linearly', () => {
    const a = ext.batterySizing({ dailyCriticalLoadKwh: 5, autonomyDays: 1 });
    const b = ext.batterySizing({ dailyCriticalLoadKwh: 5, autonomyDays: 2 });
    expect(b.energyRequiredKwh / a.energyRequiredKwh).toBeCloseTo(2, 1);
  });
});

describe('netMeteringKenya (EPRA 2024)', () => {
  test('export credit < self-use saving', () => {
    const r = ext.netMeteringKenya({ annualPvKwh: 8000, annualLoadKwh: 6000 });
    expect(r.exportCreditKes).toBeLessThan(r.billSavingFromSelfUseKes);
  });
  test('overstatement at retail rate is positive', () => {
    const r = ext.netMeteringKenya({ annualPvKwh: 10000, annualLoadKwh: 5000, exportCreditFraction: 0.65 });
    expect(r.overstatementIfNaiveKes).toBeGreaterThan(0);
  });
  test('100 % self-consumption → no exports', () => {
    const r = ext.netMeteringKenya({ annualPvKwh: 5000, annualLoadKwh: 10000, selfConsumptionFraction: 1.0 });
    expect(r.exportedKwh).toBe(0);
    expect(r.exportCreditKes).toBe(0);
  });
});

describe('generatorDisplacement', () => {
  test('30 kVA running 6 h/day saves significant fuel', () => {
    const r = ext.generatorDisplacement({ gensetRatedKva: 30, gensetRunHoursPerDay: 6 });
    expect(r.annualLitresDieselSaved).toBeGreaterThan(2000);
    expect(r.annualFuelKesSaved).toBeGreaterThan(400000);
    expect(r.annualCO2KgAvoided).toBeGreaterThan(5000);
  });
  test('zero hours → zero savings', () => {
    const r = ext.generatorDisplacement({ gensetRatedKva: 30, gensetRunHoursPerDay: 0 });
    expect(r.annualLitresDieselSaved).toBe(0);
    expect(r.totalAnnualKesSaved).toBe(0);
  });
});

describe('tariffSensitivity', () => {
  test('returns scenarios with monotonic IRR vs escalation', () => {
    const r = ext.tariffSensitivity({
      capexKes: 1000000, year1SavingKes: 150000,
      escalationDeltas: [-3, 0, 3],
    });
    expect(r.scenarios).toHaveLength(3);
    const irrs = r.scenarios.map(s => s.irrPct);
    expect(irrs[0]).toBeLessThan(irrs[2]); // higher escalation → higher IRR
  });
  test('zero capex → IRR is null or huge', () => {
    const r = ext.tariffSensitivity({ capexKes: 1, year1SavingKes: 100000 });
    expect(r.scenarios.every(s => s.npvKes > 0)).toBe(true);
  });
});

describe('oAndMSchedule (IEC 62446-1)', () => {
  test('tropical climate has wash every 3 months', () => {
    const r = ext.oAndMSchedule({ systemKw: 5, climate: 'tropical' });
    expect(r.panelWashIntervalMonths).toBe(3);
    const washes = r.tasksYear1.filter(t => t.task.includes('wash'));
    expect(washes).toHaveLength(4); // months 3,6,9,12
  });
  test('arid climate washes monthly', () => {
    const r = ext.oAndMSchedule({ systemKw: 5, climate: 'arid' });
    expect(r.panelWashIntervalMonths).toBe(1);
  });
  test('battery system adds battery tasks', () => {
    const withBat = ext.oAndMSchedule({ systemKw: 5, hasBattery: true });
    const noBat = ext.oAndMSchedule({ systemKw: 5, hasBattery: false });
    expect(withBat.tasksYear1.length).toBeGreaterThan(noBat.tasksYear1.length);
  });
});

describe('pricedBoq', () => {
  test('5 kW + 10 kWh battery returns positive total with VAT', () => {
    const r = ext.pricedBoq({ systemKw: 5, batteryKwh: 10 });
    expect(r.totals.totalIncVatKes).toBeGreaterThan(0);
    expect(r.totals.vatKes).toBeCloseTo(r.totals.sellingPriceExVatKes * 0.16, 0);
    expect(r.lineItems.length).toBeGreaterThanOrEqual(7);
    expect(r.summary.panelCount).toBeGreaterThan(0);
  });
  test('no battery removes battery line item', () => {
    const r = ext.pricedBoq({ systemKw: 5, batteryKwh: 0 });
    const hasBattery = r.lineItems.some(l => l.item.toLowerCase().includes('battery'));
    expect(hasBattery).toBe(false);
  });
  test('price per watt is in plausible KE range', () => {
    const r = ext.pricedBoq({ systemKw: 10, batteryKwh: 0 });
    expect(r.totals.kesPerWatt).toBeGreaterThan(60);
    expect(r.totals.kesPerWatt).toBeLessThan(250);
  });
});

describe('threePhaseImbalance', () => {
  test('balanced load → 0 % unbalance', () => {
    const r = ext.threePhaseImbalance({ loadL1Kw: 5, loadL2Kw: 5, loadL3Kw: 5 });
    expect(r.currentUnbalancePct).toBe(0);
    expect(r.estimatedVoltageUnbalancePct).toBe(0);
    expect(r.verdict).toMatch(/OK/);
  });
  test('severe unbalance → fail verdict', () => {
    const r = ext.threePhaseImbalance({ loadL1Kw: 10, loadL2Kw: 1, loadL3Kw: 1 });
    expect(r.estimatedVoltageUnbalancePct).toBeGreaterThan(4);
    expect(r.verdict).toMatch(/Fail/);
  });
});

describe('geoRisk', () => {
  test('Nairobi → interior plateau wind zone', () => {
    const r = ext.geoRisk({ lat: -1.2865, lon: 36.8172 });
    expect(r.windZone.category).toMatch(/Zone II/);
  });
  test('Mombasa → coastal wind zone', () => {
    const r = ext.geoRisk({ lat: -4.05, lon: 39.65 });
    expect(r.windZone.category).toMatch(/coastal/i);
  });
  test('always returns provenance', () => {
    const r = ext.geoRisk({ lat: 0, lon: 37 });
    expect(r.provenance.reference).toMatch(/KS EAS 162/);
  });
});

describe('clientPortalLink', () => {
  test('produces a deterministic url and WhatsApp link', () => {
    const r = ext.clientPortalLink({ projectId: 'PRJ-123', clientName: 'Jane' });
    expect(r.portalUrl).toMatch(/portal/);
    expect(r.whatsappShareUrl).toMatch(/wa\.me/);
    expect(r.token).toBeTruthy();
    expect(r.expiresOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
