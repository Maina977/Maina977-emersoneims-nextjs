// =====================================================================
// architecture-approval.test.js — Tier-7 Architect / Building Surveyor pack
// =====================================================================
const aa = require('../server/architecture-approval');

describe('architecture-approval — Tier-7 Architect pack', () => {
  test('windUpliftAsce7 — exposure C corner ≥ field uplift, min 0.77 kPa floor', () => {
    const field = aa.windUpliftAsce7({ basicWindSpeedMps: 50, exposureCategory: 'C', arrayLocationOnRoof: 'field' });
    const corner = aa.windUpliftAsce7({ basicWindSpeedMps: 50, exposureCategory: 'C', arrayLocationOnRoof: 'corner' });
    expect(corner.designUpliftPressurePa).toBeGreaterThan(field.designUpliftPressurePa);
    expect(field.designUpliftPressureKpaWithMin).toBeGreaterThanOrEqual(0.77);
    expect(field.provenance.method).toMatch(/ASCE 7-22/);
  });

  test('snowLoadCombination — ASCE slippery glass tilt 60° gives near-zero load + sliding flag', () => {
    const out = aa.snowLoadCombination({
      groundSnowLoadKnPerM2: 1.0, panelTiltDeg: 60,
      panelSurfaceFriction: 'slippery', code: 'ASCE',
    });
    expect(out.designSnowLoadKnPerM2).toBeLessThan(0.2);
    expect(out.sliding).toMatch(/Sliding snow LIKELY/);
  });

  test('snowLoadCombination — Eurocode flat tilt gives μ1 = 0.8', () => {
    const out = aa.snowLoadCombination({
      groundSnowLoadKnPerM2: 1.0, panelTiltDeg: 10, code: 'Eurocode',
    });
    expect(out.breakdown.mu1).toBeCloseTo(0.8, 2);
  });

  test('ballastSchedule — corner zone uses more blocks than field', () => {
    const field = aa.ballastSchedule({ designUpliftKnPerM2: 1.5, numberOfPanels: 10, arrayLocationOnRoof: 'field' });
    const corner = aa.ballastSchedule({ designUpliftKnPerM2: 1.5, numberOfPanels: 10, arrayLocationOnRoof: 'corner' });
    expect(corner.array.totalBlocks).toBeGreaterThan(field.array.totalBlocks);
    expect(field.perPanel.requiredBallastKg).toBeGreaterThan(0);
  });

  test('roofReserveCapacity — small added load passes 5% rule', () => {
    const out = aa.roofReserveCapacity({
      existingRoofDeadLoadKpa: 1.0, existingDesignDeadLoadAllowanceKpa: 1.5,
      newPvAddedDeadLoadKpa: 0.04, ballastAddedDeadLoadKpa: 0,
      conditionRating: 'good',
    });
    expect(out.fivePctRuleSatisfied).toBe(true);
    expect(out.passes).toBe(true);
    expect(out.verdict).toMatch(/PASS/);
  });

  test('roofReserveCapacity — heavy ballast on poor old roof fails', () => {
    const out = aa.roofReserveCapacity({
      existingRoofDeadLoadKpa: 0.6, existingDesignDeadLoadAllowanceKpa: 0.7,
      newPvAddedDeadLoadKpa: 0.15, ballastAddedDeadLoadKpa: 0.5,
      buildingAgeYears: 60, conditionRating: 'poor',
    });
    expect(out.passesWithCondition).toBe(false);
    expect(out.remediation.length).toBeGreaterThan(0);
  });

  test('rooftopFireSetback — pitched roof with full-coverage array fails ridge setback', () => {
    const out = aa.rooftopFireSetback({
      roofType: 'pitched', roofPlanLengthM: 8, roofPlanWidthM: 6,
      arrayPlanLengthM: 8, arrayPlanWidthM: 6,
    });
    expect(out.overallCompliant).toBe(false);
    expect(out.nonComplianceItems.some(i => i.id === 'FIRE-1')).toBe(true);
  });

  test('rooftopFireSetback — flat roof with adequate perimeter passes', () => {
    const out = aa.rooftopFireSetback({
      roofType: 'flat', roofPlanLengthM: 30, roofPlanWidthM: 20,
      arrayPlanLengthM: 20, arrayPlanWidthM: 12, numberOfPvSubarrays: 1,
    });
    expect(out.overallCompliant).toBe(true);
  });

  test('flashingPenetration — sealant-only fails compliance', () => {
    const out = aa.flashingPenetration({
      roofCovering: 'asphalt-shingle', flashingMaterial: 'sealant-only',
    });
    expect(out.overallCompliant).toBe(false);
    expect(out.billOfMaterials.length).toBeGreaterThan(0);
  });

  test('flashingPenetration — proper aluminium on shingle is compliant', () => {
    const out = aa.flashingPenetration({
      roofCovering: 'asphalt-shingle', flashingMaterial: 'aluminium-stamped',
      attachmentType: 'L-foot-lag',
    });
    expect(out.overallCompliant).toBe(true);
    expect(out.verdict).toMatch(/APPROVED/);
  });

  test('neighbourShadow — far neighbour gets GREEN', () => {
    const out = aa.neighbourShadow({
      arrayLatDeg: -1.32, arrayLonDeg: 36.92, arrayHeightAboveGroundM: 6, arrayWidthM: 6,
      neighbourLatDeg: -1.30, neighbourLonDeg: 36.94,    // ~3 km away
    });
    expect(out.category).toMatch(/GREEN/);
    expect(out.bre25RuleBreach).toBe(false);
  });

  test('neighbourShadow — close tall array breaches 25° rule', () => {
    const out = aa.neighbourShadow({
      arrayLatDeg: -1.32, arrayLonDeg: 36.92, arrayHeightAboveGroundM: 12, arrayWidthM: 10,
      neighbourLatDeg: -1.32, neighbourLonDeg: 36.92005,   // ~5 m away
      neighbourWindowHeightAboveGroundM: 1.5,
    });
    expect(out.bre25RuleBreach).toBe(true);
  });

  test('ifcBimExport — produces valid IFC4 STEP header', () => {
    const out = aa.ifcBimExport({ projectId: 'IFC-1', arrayPlanLengthM: 10, arrayPlanWidthM: 6 });
    expect(out.ifcStep).toMatch(/^ISO-10303-21;/);
    expect(out.ifcStep).toMatch(/FILE_SCHEMA\(\('IFC4'\)\)/);
    expect(out.ifcStep).toMatch(/IFCBUILDINGELEMENTPROXY/);
    expect(out.ifcStep).toMatch(/END-ISO-10303-21;/);
    expect(out.ifcDataUri).toMatch(/^data:application\/x-step;base64,/);
  });

  test('planningNarrative — UK ordinary house gets PD', () => {
    const out = aa.planningNarrative({
      jurisdiction: 'UK', buildingHeritageStatus: 'none',
      arrayHeightAboveExistingRoofM: 0.15, visibleFromPublicHighway: true,
    });
    expect(out.permittedDevelopment).toBe(true);
    expect(out.narrativeMarkdown).toMatch(/Permitted Development/);
    expect(out.publicBenefit.lifetime25yrCo2OffsetTonnes).toBeGreaterThan(0);
  });

  test('planningNarrative — listed building loses PD', () => {
    const out = aa.planningNarrative({
      jurisdiction: 'UK', buildingHeritageStatus: 'grade-II',
      arrayHeightAboveExistingRoofM: 0.15,
    });
    expect(out.permittedDevelopment).toBe(false);
    expect(out.planningRequired).toBe(true);
  });

  test('planningNarrative — projection > 200mm loses PD', () => {
    const out = aa.planningNarrative({
      jurisdiction: 'UK', buildingHeritageStatus: 'none',
      arrayHeightAboveExistingRoofM: 0.30,
    });
    expect(out.permittedDevelopment).toBe(false);
  });

  test('all functions return provenance metadata', () => {
    const fns = [
      () => aa.windUpliftAsce7({}),
      () => aa.snowLoadCombination({}),
      () => aa.ballastSchedule({}),
      () => aa.roofReserveCapacity({}),
      () => aa.rooftopFireSetback({}),
      () => aa.flashingPenetration({}),
      () => aa.neighbourShadow({}),
      () => aa.ifcBimExport({}),
      () => aa.planningNarrative({}),
    ];
    for (const f of fns) {
      const out = f();
      expect(out.provenance).toBeDefined();
      expect(out.provenance.method).toBeTruthy();
      expect(out.provenance.reference).toBeTruthy();
      expect(out.provenance.limits).toBeTruthy();
    }
  });
});
