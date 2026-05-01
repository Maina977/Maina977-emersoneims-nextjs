// =====================================================================
// engineering-approval.test.js — Tier-6 PE/Chartered-Engineer sign-off
// =====================================================================
const ea = require('../server/engineering-approval');

describe('engineering-approval — Tier-6 PE sign-off pack', () => {
  // -------------------------------------------------------------------
  test('iec62446CommissioningReport — passes with within-spec measurements', () => {
    const out = ea.iec62446CommissioningReport({
      projectId: 'TEST-1', vocMeasuredV: 480, vocExpectedV: 492,
      iscMeasuredA: 9.6, iscExpectedA: 9.8,
      insulationResistanceMOhm: 50, earthResistanceOhm: 5,
    });
    expect(out.overallVerdict).toMatch(/PASS/);
    expect(out.testing.allPass).toBe(true);
    expect(out.signatureBlock.reportHash).toMatch(/^[a-f0-9]{16}$/);
    expect(out.provenance.method).toMatch(/IEC 62446-1/);
  });

  test('iec62446CommissioningReport — fails with out-of-tolerance Voc', () => {
    const out = ea.iec62446CommissioningReport({
      vocMeasuredV: 400, vocExpectedV: 492,
      insulationResistanceMOhm: 50, earthResistanceOhm: 5,
    });
    expect(out.overallVerdict).toMatch(/FAIL/);
    expect(out.failedItems.length).toBeGreaterThan(0);
  });

  test('iec62446CommissioningReport — fails when earth resistance > 10Ω', () => {
    const out = ea.iec62446CommissioningReport({ earthResistanceOhm: 15 });
    expect(out.overallVerdict).toMatch(/FAIL/);
  });

  // -------------------------------------------------------------------
  test('singleLineDiagramSvg — produces SVG containing array + grid', () => {
    const out = ea.singleLineDiagramSvg({
      projectId: 'SLD-1', stringCount: 4, modulesPerString: 12,
      modulePmaxW: 550, inverterKwAc: 25,
    });
    expect(out.sldSvg).toMatch(/^<svg/);
    expect(out.sldSvg).toMatch(/UTILITY GRID/);
    expect(out.sldSvg).toMatch(/String 1/);
    expect(out.sldDataUri).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(out.totalDcKwp).toBeCloseTo(26.4, 1);
    expect(out.standardSymbolsUsed.length).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------
  test('ncec690ArcRsCompliance — NEC 2020 rooftop with AFCI+RSD passes', () => {
    const out = ea.ncec690ArcRsCompliance({
      jurisdiction: 'NEC2020', systemDcVoltage: 600, arrayLocation: 'rooftop',
      inverterHasIntegratedAfci: true, inverterHasModuleRapidShutdown: true,
      rsdControllerPresent: true, rsdInitiatorAtServiceDisconnect: true,
    });
    expect(out.overallCompliant).toBe(true);
    expect(out.verdict).toMatch(/COMPLIANT/);
  });

  test('ncec690ArcRsCompliance — NEC 2020 rooftop missing RSD fails', () => {
    const out = ea.ncec690ArcRsCompliance({
      jurisdiction: 'NEC2020', arrayLocation: 'rooftop',
      inverterHasIntegratedAfci: true,
      inverterHasModuleRapidShutdown: false,
      rsdControllerPresent: false, rsdInitiatorAtServiceDisconnect: false,
    });
    expect(out.overallCompliant).toBe(false);
    expect(out.nonComplianceItems.length).toBeGreaterThan(0);
  });

  test('ncec690ArcRsCompliance — none jurisdiction returns no requirement', () => {
    const out = ea.ncec690ArcRsCompliance({ jurisdiction: 'none' });
    expect(out.complianceRequired).toBe(false);
  });

  // -------------------------------------------------------------------
  test('cableAmpacityDerated — 6mm² Cu method C ambient 30°C grouping 1 ≈ 46A', () => {
    const out = ea.cableAmpacityDerated({
      conductorMaterial: 'copper', csaMm2: 6, installationMethod: 'C',
      ambientC: 30, groupedCircuits: 1, insulationType: 'XLPE',
    });
    expect(out.baseAmpacityA).toBeCloseTo(46, 0);
    expect(out.deratedAmpacityA).toBeCloseTo(46, 0);
    expect(out.correctionFactors.overall).toBeCloseTo(1.0, 2);
  });

  test('cableAmpacityDerated — high ambient + grouping derates significantly', () => {
    const out = ea.cableAmpacityDerated({
      conductorMaterial: 'copper', csaMm2: 25, installationMethod: 'C',
      ambientC: 50, groupedCircuits: 4, insulationType: 'PVC',
    });
    expect(out.deratedAmpacityA).toBeLessThan(out.baseAmpacityA * 0.6);
    expect(out.deratingPct).toBeGreaterThan(40);
  });

  test('cableAmpacityDerated — buried method D applies soil correction', () => {
    const out = ea.cableAmpacityDerated({
      csaMm2: 50, installationMethod: 'D', soilThermalResistivityKMPerW: 2.5,
    });
    expect(out.correctionFactors.soilThermalResistivity).toBeLessThan(1.0);
  });

  // -------------------------------------------------------------------
  test('nfpa855BatteryFireSafety — 30 kWh LFP residential bedroom is non-compliant', () => {
    const out = ea.nfpa855BatteryFireSafety({
      batteryChemistry: 'LFP', totalEnergyKwh: 30,
      installationLocation: 'residential-bedroom',
      buildingOccupancyType: 'residential',
      propertyLineDistanceM: 1, egressDistanceM: 0.5,
      hasFireSuppression: false, hasGasDetection: false,
    });
    expect(out.overallCompliant).toBe(false);
    expect(out.nonComplianceItems.length).toBeGreaterThan(0);
    expect(out.exceedsTq).toBe(true);
  });

  test('nfpa855BatteryFireSafety — small outdoor LFP system compliant', () => {
    const out = ea.nfpa855BatteryFireSafety({
      batteryChemistry: 'LFP', totalEnergyKwh: 10,
      installationLocation: 'outdoor', propertyLineDistanceM: 5,
      egressDistanceM: 2,
    });
    expect(out.exceedsTq).toBe(false);
    expect(out.overallCompliant).toBe(true);
  });

  // -------------------------------------------------------------------
  test('faaGlareAnalysis — returns SGHAT category and provenance', () => {
    const out = ea.faaGlareAnalysis({
      arrayLatDeg: -1.32, arrayLonDeg: 36.92,
      arrayTiltDeg: 10, arrayAzimuthDeg: 180,
      observerLatDeg: -1.32, observerLonDeg: 36.93,
      observerHeightM: 30, arrayHeightM: 5,
      observerType: 'atc-tower',
    });
    expect(['GREEN', 'YELLOW', 'RED']).toContain(out.sghatCategory);
    expect(out.geometry.distanceM).toBeGreaterThan(0);
    expect(out.provenance.reference).toMatch(/SGHAT|FAA/);
  });

  // -------------------------------------------------------------------
  test('peSignOffPackage — empty evidence → blockers + not ready', () => {
    const out = ea.peSignOffPackage({
      projectId: 'SO-1', engineerName: 'Test', engineerLicence: 'TEST-001',
      evidenceManifest: {},
    });
    expect(out.readyForSignature).toBe(false);
    expect(out.mandatoryBlockers.length).toBeGreaterThan(0);
    expect(out.signatureManifest.sha256Hash).toMatch(/^[a-f0-9]{64}$/);
  });

  test('peSignOffPackage — full evidence pack → ready for stamp', () => {
    const out = ea.peSignOffPackage({
      projectId: 'SO-2', jurisdiction: 'KE',
      engineerName: 'J. Eng', engineerLicence: 'EPRA-A1-001',
      evidenceManifest: {
        iec62446CommissioningReport: true,
        singleLineDiagramSvg: true,
        cableAmpacityDerated: true,
        gridCodePack: true,
        memberStructural: true,
        lightningRiskFull: true,
        earthElectrodeBS7430: true,
      },
    });
    expect(out.readyForSignature).toBe(true);
    expect(out.verdict).toMatch(/READY FOR PE STAMP/);
  });

  test('peSignOffPackage — US jurisdiction makes arc-rs mandatory', () => {
    const out = ea.peSignOffPackage({
      jurisdiction: 'US',
      evidenceManifest: {
        iec62446CommissioningReport: true,
        singleLineDiagramSvg: true,
        cableAmpacityDerated: true,
        gridCodePack: true,
        memberStructural: true,
        lightningRiskFull: true,
        earthElectrodeBS7430: true,
      },
    });
    expect(out.readyForSignature).toBe(false);
    expect(out.mandatoryBlockers.some(b => b.key === 'arcRsCompliance')).toBe(true);
  });

  // -------------------------------------------------------------------
  test('all functions return provenance metadata', () => {
    const fns = [
      () => ea.iec62446CommissioningReport({}),
      () => ea.singleLineDiagramSvg({}),
      () => ea.ncec690ArcRsCompliance({ jurisdiction: 'NEC2020' }),
      () => ea.cableAmpacityDerated({}),
      () => ea.nfpa855BatteryFireSafety({}),
      () => ea.faaGlareAnalysis({}),
      () => ea.peSignOffPackage({}),
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
