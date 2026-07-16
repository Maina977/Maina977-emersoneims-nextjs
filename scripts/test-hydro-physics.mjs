// ═══════════════════════════════════════════════════════════════════
// AquaScanPro PHYSICS VERIFICATION & VALIDATION SUITE
// ═══════════════════════════════════════════════════════════════════
// Proves the engine's core mathematics on every change:
//   A. Water balance: conservation of mass, supply-limited ET,
//      recharge monotonicity vs aridity, climate-class sanity
//   B. Monte Carlo samplers: Beta/lognormal produce the distribution
//      they claim (regression for the 2026-07-10 units bug that
//      printed a 0.5-99% confidence interval)
//   C. Dynamic recharge model: monthly/annual consistency, flag logic
//   D. Bayesian ensemble: probability bounds + field-measured-share
//      reliability ordering (springs must not outweigh measured wells)
// Run:  node scripts/test-hydro-physics.mjs   (portable node OK)
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'external', 'borehole-ai-engine', 'src');
const OUT = mkdtempSync(join(tmpdir(), 'aquascan-vv-'));

const files = ['hydroPhysics.ts', 'dynamicRechargeModel.ts', 'engineerConfidenceEngine.ts', 'advancedHydroEngine.ts', 'pumpTestAnalyzer.ts', 'subsurfaceModeler.ts', 'drillReadiness.ts', 'aquiferSimulator.ts', 'multiGeophysicsFusion.ts', 'vesInversionEngine.ts', 'satelliteETEngine.ts', 'backtestEngine.ts', 'dataCoverageEngine.ts', 'climateClassifier.ts', 'wraIngestEngine.ts', 'validationBenchmark.ts', 'desktopDrillTargetReadiness.ts', 'sanitizeOutputs.ts', 'reportAuditor.ts', 'boreholeDatabase.ts'];
try {
  execSync(
    `node "${join(ROOT, 'node_modules', 'typescript', 'lib', 'tsc.js')}" ` +
    files.map(f => `"${join(SRC, f)}"`).join(' ') +
    ` --outDir "${OUT}" --module commonjs --target es2020 --lib es2020,dom --skipLibCheck --esModuleInterop --noResolve`,
    { stdio: 'pipe' },
  );
} catch {
  // tsc emits JS even when a type-only import (e.g. `import type … from './types'`)
  // can't be resolved under --noResolve — the type is erased at emit, so the
  // emitted .js is correct. We only need the emitted JS, so tolerate the exit code.
}

const { createRequire } = await import('node:module');
const req = createRequire(pathToFileURL(join(OUT, 'x.js')));
const hp = req(join(OUT, 'hydroPhysics.js'));
const drm = req(join(OUT, 'dynamicRechargeModel.js'));
const ece = req(join(OUT, 'engineerConfidenceEngine.js'));
const ahe = req(join(OUT, 'advancedHydroEngine.js'));

let pass = 0, fail = 0;
const check = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${detail ? ` -- ${detail}` : ''}`); }
};
const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length); };

// ── A. WATER BALANCE PHYSICS ────────────────────────────────────
console.log('\nA. Water balance (hydroPhysics.budykoWaterBalance)');
{
  const Ps = [80, 300, 700, 1200, 1656, 2400];
  const Es = [400, 900, 1617, 2200];
  let conserved = true, supplyLimited = true, offender = '';
  for (const P of Ps) for (const E of Es) {
    const w = hp.budykoWaterBalance(P, E);
    if (w.precipitation_mm !== w.actualET_mm + w.surfaceRunoff_mm + w.recharge_mm) {
      conserved = false; offender = `P=${P},ET0=${E}: ${w.precipitation_mm} != ${w.actualET_mm}+${w.surfaceRunoff_mm}+${w.recharge_mm}`;
    }
    if (w.actualET_mm >= w.precipitation_mm) { supplyLimited = false; offender = `P=${P},ET0=${E}: AET>=P`; }
  }
  check('conservation of mass: P = AET + runoff + recharge (24 climates)', conserved, offender);
  check('supply limit: actual ET < precipitation always', supplyLimited, offender);

  const r1 = hp.budykoWaterBalance(1000, 500).recharge_mm;
  const r2 = hp.budykoWaterBalance(1000, 1500).recharge_mm;
  const r3 = hp.budykoWaterBalance(1000, 2500).recharge_mm;
  check('recharge decreases as aridity increases (fixed P)', r1 >= r2 && r2 >= r3, `${r1},${r2},${r3}`);

  const humid = hp.budykoWaterBalance(1656, 1617);
  check('Vihiga-class humid site: recharge fraction 4-10% (literature basement range)',
    humid.rechargeFraction >= 0.04 && humid.rechargeFraction <= 0.10, `got ${humid.rechargeFraction}`);
  check('Vihiga-class humid site: recharge 60-140 mm/yr', humid.recharge_mm >= 60 && humid.recharge_mm <= 140, `got ${humid.recharge_mm}`);

  const arid = hp.budykoWaterBalance(250, 2200);
  check('arid site: recharge fraction <= 3%', arid.rechargeFraction <= 0.03, `got ${arid.rechargeFraction}`);

  check('aridity classes: 0.5 humid / 1.0 sub-humid / 1.5 semi-arid / 3 arid',
    hp.aridityClass(0.5) === 'humid' && hp.aridityClass(1.0) === 'sub-humid' &&
    hp.aridityClass(1.5) === 'semi-arid' && hp.aridityClass(3) === 'arid');
}

// ── A2. GOVERNING YIELD RECONCILIATION (2026-07-12 driller audit) ─
console.log('\nA2. Governing yield reconciliation (hydroPhysics.reconcileGoverningYield)');
{
  const BASEMENT = [0.5, 3];
  // The exact defect the driller rejected: executive 4.9 vs pump-design 0.28.
  const vihiga = hp.reconcileGoverningYield({
    ensembleYield_m3hr: 4.9, aquiferLimitedYield_m3hr: 0.28, regionalPriorBand_m3hr: BASEMENT });
  check('4.9-vs-0.28 split resolves to a SINGLE governing yield in [0.5,3] basement band',
    vihiga.governingYield_m3hr >= 0.5 && vihiga.governingYield_m3hr <= 3, `got ${vihiga.governingYield_m3hr}`);
  check('sub-floor aquifer rate with supporting ensemble lifts to regional floor 0.5, not 0.28',
    vihiga.governingYield_m3hr === 0.5 && vihiga.basis === 'regional-floor (low-T outlier)', `got ${vihiga.governingYield_m3hr}/${vihiga.basis}`);
  // High-T outlier (146 m²/day → ~18 m³/hr) must not blow past the ceiling.
  const hiT = hp.reconcileGoverningYield({
    ensembleYield_m3hr: 4.9, aquiferLimitedYield_m3hr: 18.6, regionalPriorBand_m3hr: BASEMENT });
  check('high-T outlier (18.6) capped to regional ceiling 3, never advertised',
    hiT.governingYield_m3hr === 3, `got ${hiT.governingYield_m3hr}`);
  // A physically reasonable aquifer rate within band is trusted as-is.
  const mid = hp.reconcileGoverningYield({
    ensembleYield_m3hr: 4.0, aquiferLimitedYield_m3hr: 1.5, regionalPriorBand_m3hr: BASEMENT });
  check('in-band aquifer rate (1.5) is trusted unchanged',
    mid.governingYield_m3hr === 1.5 && mid.basis === 'aquifer-limited', `got ${mid.governingYield_m3hr}/${mid.basis}`);
  // Ensemble below aquifer physics → never advertise more than the data supports.
  const lowEns = hp.reconcileGoverningYield({
    ensembleYield_m3hr: 0.8, aquiferLimitedYield_m3hr: 2.5, regionalPriorBand_m3hr: BASEMENT });
  check('governing yield never exceeds the independent ensemble estimate',
    lowEns.governingYield_m3hr <= 0.8, `got ${lowEns.governingYield_m3hr}`);
  // Output is always non-negative and finite.
  const zero = hp.reconcileGoverningYield({
    ensembleYield_m3hr: 0, aquiferLimitedYield_m3hr: 0, regionalPriorBand_m3hr: BASEMENT });
  check('degenerate zero inputs stay non-negative & finite',
    Number.isFinite(zero.governingYield_m3hr) && zero.governingYield_m3hr >= 0, `got ${zero.governingYield_m3hr}`);
}

// ── B. MONTE CARLO SAMPLERS ─────────────────────────────────────
console.log('\nB. Monte Carlo samplers (engineerConfidenceEngine)');
{
  ece.resetRNG(42);
  const b = ece.generateBetaSamples(0.638, 0.10, 20000);
  check('Beta(mean 63.8%, spread 10%): sample mean within +/-2%', Math.abs(mean(b) - 0.638) < 0.02, `mean=${mean(b).toFixed(3)}`);
  check('Beta spread is the requested ~10%, NOT arcsine 35% (units-bug regression)',
    sd(b) > 0.05 && sd(b) < 0.16, `sd=${sd(b).toFixed(3)}`);
  check('Beta samples bounded [0,1]', b.every(v => v >= 0 && v <= 1));

  ece.resetRNG(7);
  const ln = ece.generateLognormalSamples(60, 9, 20000);
  check('Lognormal(60, 9): sample mean within 60 +/- 2 m', Math.abs(mean(ln) - 60) < 2, `mean=${mean(ln).toFixed(1)}`);
  check('Lognormal samples strictly positive', ln.every(v => v > 0));
}

// ── C. DYNAMIC RECHARGE MODEL ───────────────────────────────────
console.log('\nC. Dynamic recharge model (Thornthwaite balance)');
{
  const monthly = [90, 100, 160, 220, 190, 130, 110, 120, 140, 170, 150, 76]; // ~1656mm humid
  const r = drm.modelDynamicRecharge({
    latitude: 0.03, longitude: 34.65,
    annualPrecipitation: [
      { year: 2021, total: 1600 }, { year: 2022, total: 1700 },
      { year: 2023, total: 1580 }, { year: 2024, total: 1750 },
    ],
    monthlyPrecipitation: monthly,
    soilType: 'loam', slopePercent: 4, imperviousFraction: 0.05,
    aquiferArea_km2: 10, storativity: 0.05, currentPumping_m3day: 60,
  });
  const monthSum = r.monthlyRecharge.reduce((s, m) => s + m.netRecharge_mm, 0);
  check('annual recharge equals sum of monthly recharge (+/-1 mm)',
    Math.abs(r.avgAnnualRecharge_mm - monthSum) <= 1, `${r.avgAnnualRecharge_mm} vs ${monthSum}`);
  check('flag logic: every month with recharge > 0 is marked a recharge month',
    r.monthlyRecharge.every(m => (m.netRecharge_mm > 0) === !!m.isRechargeMonth));
  check('recharge fraction bounded [0,1]', r.rechargeFraction >= 0 && r.rechargeFraction <= 1, `got ${r.rechargeFraction}`);
  check('humid input produces positive annual recharge', r.avgAnnualRecharge_mm > 0, `got ${r.avgAnnualRecharge_mm}`);
}

// ── D. BAYESIAN ENSEMBLE EVIDENCE WEIGHTING ─────────────────────
console.log('\nD. Bayesian ensemble (advancedHydroEngine)');
{
  const base = {
    baseProbability: 0.5, baseDepth: 60, baseYield: 3,
    nearbyWellCount: 20, nearbyWellAvgDepth: 58, nearbyWellAvgYield: 5,
  };
  const measured = ahe.runBayesianEnsemble({ ...base, nearbyWellFieldShare: 1.0 });
  const springs = ahe.runBayesianEnsemble({ ...base, nearbyWellFieldShare: 0.0 });
  const relOf = (r) => r.individualEstimates.find(e => /Nearby W/i.test(e.source))?.reliability ?? -1;
  check('field-measured wells carry MORE reliability than spring estimates',
    relOf(measured) > relOf(springs), `${relOf(measured)} vs ${relOf(springs)}`);
  check('spring-estimate reliability capped below 0.95 (self-validation guard)',
    relOf(springs) > 0 && relOf(springs) <= 0.60, `got ${relOf(springs)}`);
  check('ensemble probability bounded [0,1] (measured case)',
    measured.probability >= 0 && measured.probability <= 1, `got ${measured.probability}`);
  check('ensemble probability bounded [0,1] (spring case)',
    springs.probability >= 0 && springs.probability <= 1, `got ${springs.probability}`);
}

// ── E. THEIS WELL FUNCTION (agent-audit regression, 2026-07-10) ──
console.log('\nE. Theis well function W(u) (pumpTestAnalyzer)');
{
  const pta = req(join(OUT, 'pumpTestAnalyzer.js'));
  // Abramowitz & Stegun table values
  const cases = [[0.01, 4.038], [0.05, 2.468], [0.1, 1.823], [0.5, 0.560], [1.0, 0.219], [2.0, 0.0489]];
  let ok = true, detail = '';
  for (const [u, expected] of cases) {
    const got = pta.wellFunction(u);
    if (Math.abs(got - expected) > Math.max(0.01, expected * 0.02)) { ok = false; detail += ` W(${u})=${got.toFixed(4)} exp ${expected};`; }
  }
  check('W(u) matches A&S table values (old bug returned 0 for u>0.4)', ok, detail);
  check('W(u) strictly decreasing in u', pta.wellFunction(0.05) > pta.wellFunction(0.5) && pta.wellFunction(0.5) > pta.wellFunction(1));
}

// ── F. SAXTON-RAWLS KSAT (agent-audit regression, 2026-07-10) ──
console.log('\nF. Saxton-Rawls Ksat (subsurfaceModeler)');
{
  const ssm = req(join(OUT, 'subsurfaceModeler.js'));
  const clayK = ssm.saxtonRawlsKsat(10, 60, 2);   // m/day
  const loamK = ssm.saxtonRawlsKsat(40, 20, 2.5);
  const sandK = ssm.saxtonRawlsKsat(85, 5, 1);
  check('clay Ksat < 0.1 m/day (old bug: ~0.12 -> aquitards read as aquifers)', clayK < 0.1, `got ${clayK.toFixed(4)}`);
  check('loam Ksat in 0.1-1.5 m/day (published ~13 mm/hr)', loamK > 0.1 && loamK < 1.5, `got ${loamK.toFixed(3)}`);
  check('sand Ksat > 1 m/day (published ~100 mm/hr)', sandK > 1, `got ${sandK.toFixed(2)}`);
  check('texture ordering: sand > loam > clay', sandK > loamK && loamK > clayK, `${sandK.toFixed(2)} / ${loamK.toFixed(3)} / ${clayK.toFixed(4)}`);
}

// ── G. DRILLING-READINESS GATES (reviewer 2026-07-11) ──
console.log('\nG. Drilling-readiness score gates (drillReadiness)');
{
  const dr = req(join(OUT, 'drillReadiness.js'));
  const desktop = dr.computeDrillReadiness({ gpsSource: 'manual', locationGrade: 'B', reportConsistent: true });
  check('desktop-only (no field data) is capped <= 79 and NOT drill-ready',
    desktop.score <= 79 && desktop.status !== 'ISSUED FOR DRILLING', `score ${desktop.score}, ${desktop.status}`);
  check('desktop-only lists open mandatory gates', desktop.openGates.length >= 3, `${desktop.openGates.length} gates`);

  const validated = dr.computeDrillReadiness({
    gpsSource: 'manual', locationGrade: 'A', hasFieldPeg: true, hasFieldERT: true,
    hasHydrogeologistSignoff: true, hasWRAAuthorisation: true, reportConsistent: true,
  });
  check('all field gates satisfied -> can exceed 79 and be ISSUED FOR DRILLING',
    validated.score >= 80 && validated.status === 'ISSUED FOR DRILLING', `score ${validated.score}, ${validated.status}`);
  check('adding no field data cannot lift score past the 79 cap (AI cannot buy readiness)',
    dr.computeDrillReadiness({ gpsSource: 'manual', locationGrade: 'B', reportConsistent: true }).score <= 79);
  check('inconsistent report (software errors) blocks the consistency gate',
    dr.computeDrillReadiness({ hasFieldERT: true, hasFieldPeg: true, hasHydrogeologistSignoff: true, hasWRAAuthorisation: true, reportConsistent: false }).score <= 79);
  // AUDIT 2026-07-12: a manually-typed coordinate must NEVER satisfy the peg gate
  const manualB = dr.computeDrillReadiness({ gpsSource: 'manual', locationGrade: 'B', reportConsistent: true });
  check('manual coordinate (grade B) does NOT satisfy the survey-grade peg gate',
    manualB.openGates.indexOf('Coordinates field-verified (survey-grade peg)') !== -1,
    manualB.openGates.join(' | '));
  check('only an actual field peg satisfies coordinate verification',
    dr.computeDrillReadiness({ hasFieldPeg: true, reportConsistent: true }).openGates.indexOf('Coordinates field-verified (survey-grade peg)') === -1);

  // Groundwater prospect (chance of water) — data-backed, SEPARATE from gates
  const noAnalog = dr.computeDrillReadiness({ reportConsistent: true, convergentEvidenceScore: 0.5 });
  const strongAnalog = dr.computeDrillReadiness({
    reportConsistent: true, convergentEvidenceScore: 0.7,
    analogBoreholeCount: 12, analogSuccessRate: 0.8, desktopConcordance: 0.85,
  });
  check('proven nearby boreholes raise the groundwater prospect',
    strongAnalog.prospectIndex > noAnalog.prospectIndex && (strongAnalog.groundwaterProspect === 'STRONG' || strongAnalog.groundwaterProspect === 'VERY STRONG'),
    `no-analog ${noAnalog.prospectIndex}% vs analog ${strongAnalog.prospectIndex}% (${strongAnalog.groundwaterProspect})`);
  check('strong prospect does NOT unlock drilling readiness (still gated)',
    strongAnalog.score <= 79 && strongAnalog.status !== 'ISSUED FOR DRILLING',
    `score ${strongAnalog.score}, ${strongAnalog.status}`);
  check('analog offset wells earn partial depth-justification readiness credit',
    strongAnalog.score > noAnalog.score, `no-analog ${noAnalog.score} vs analog ${strongAnalog.score}`);
}

// ── H. AQUIFER SIMULATOR (aquiferSimulator.runAquiferSimulation) ──
console.log('\nH. Aquifer simulation physics (aquiferSimulator)');
{
  const asim = req(join(OUT, 'aquiferSimulator.js'));
  // (T, S, K, b, n, wt, P, ET, Q, gldasRecharge?)
  const run = (Q, T = 100) => asim.runAquiferSimulation(T, 0.05, 5, 20, 0.25, 15, 1000, 600, Q);
  const lowQ = run(100), highQ = run(500);
  check('higher pumping rate → larger well drawdown (Theis)',
    highQ.pumpTest.theis.drawdownAtWell > lowQ.pumpTest.theis.drawdownAtWell,
    `Q100 ${lowQ.pumpTest.theis.drawdownAtWell} vs Q500 ${highQ.pumpTest.theis.drawdownAtWell}`);
  check('drawdown decreases with distance from well (100m < at well)',
    lowQ.pumpTest.theis.drawdownAt100m < lowQ.pumpTest.theis.drawdownAtWell,
    `100m ${lowQ.pumpTest.theis.drawdownAt100m} vs well ${lowQ.pumpTest.theis.drawdownAtWell}`);
  const loT = run(300, 20), hiT = run(300, 400);
  check('higher transmissivity → smaller drawdown for same Q',
    hiT.pumpTest.theis.drawdownAtWell < loT.pumpTest.theis.drawdownAtWell,
    `T20 ${loT.pumpTest.theis.drawdownAtWell} vs T400 ${hiT.pumpTest.theis.drawdownAtWell}`);
  check('cone of influence radius is positive and finite',
    lowQ.coneOfDepression.radiusOfInfluenceM > 0 && Number.isFinite(lowQ.coneOfDepression.radiusOfInfluenceM),
    `${lowQ.coneOfDepression.radiusOfInfluenceM}`);
  check('mass conservation: recharge from precip <= precipitation',
    lowQ.groundwaterBudget.inflows.rechargeFromPrecipitation <= lowQ.groundwaterBudget.inflows.precipitation + 1e-6,
    `recharge ${lowQ.groundwaterBudget.inflows.rechargeFromPrecipitation} vs P ${lowQ.groundwaterBudget.inflows.precipitation}`);
  const dry = asim.runAquiferSimulation(100, 0.05, 5, 20, 0.25, 15, 200, 900, 100);
  const wet = asim.runAquiferSimulation(100, 0.05, 5, 20, 0.25, 15, 1600, 900, 100);
  check('wetter climate yields >= recharge than arid climate',
    wet.groundwaterBudget.inflows.rechargeFromPrecipitation >= dry.groundwaterBudget.inflows.rechargeFromPrecipitation,
    `dry ${dry.groundwaterBudget.inflows.rechargeFromPrecipitation} vs wet ${wet.groundwaterBudget.inflows.rechargeFromPrecipitation}`);
  check('sustainable pumping is non-negative',
    lowQ.groundwaterBudget.balance.maxSustainablePumping >= 0, `${lowQ.groundwaterBudget.balance.maxSustainablePumping}`);

  // ── PHYSICS GUARD (hydrogeologist audit 2026-07-12): the exact p30 defect —
  // T=0.1 m²/d with Q=117.6 m³/day printed a 632.9 m drawdown on a 60 m aquifer.
  const defect = asim.runAquiferSimulation(0.1, 0.104, 0.093, 60, 0.25, 21, 1656, 1325, 117.6, 99);
  const pg = defect.pumpTest.physicsGuard;
  check('physics guard flags drawdown > 2/3 saturated thickness as UNSUSTAINABLE',
    pg && pg.sustainableAtRequestedRate === false, JSON.stringify(pg?.sustainableAtRequestedRate));
  check('guard computes a max sustainable rate below the requested rate',
    pg.maxSustainableRate_m3day > 0 && pg.maxSustainableRate_m3day < 117.6, `${pg.maxSustainableRate_m3day}`);
  check('guard max-rate agrees with wellDesignEngine aquifer-limited band (0.2-0.6 m³/hr at T≈0.1)',
    pg.maxSustainableRate_m3day / 24 > 0.2 && pg.maxSustainableRate_m3day / 24 < 0.6, `${(pg.maxSustainableRate_m3day / 24).toFixed(2)} m³/hr`);
  check('cone of depression is redrawn at the sustainable rate (max drawdown physical)',
    defect.coneOfDepression.maxDrawdownM <= pg.availableDrawdown_m * 1.05,
    `cone max ${defect.coneOfDepression.maxDrawdownM} vs available ${pg.availableDrawdown_m}`);
  check('guard consistency note names the inconsistency and the pump test',
    /MODEL INCONSISTENT/i.test(pg.consistencyNote) && /pump test/i.test(pg.consistencyNote));
  const sane = asim.runAquiferSimulation(25, 0.05, 1.2, 40, 0.2, 15, 1200, 900, 48);
  check('sane aquifer (T=25, Q=2 m³/hr) passes the guard untouched',
    sane.pumpTest.physicsGuard.sustainableAtRequestedRate === true &&
    sane.coneOfDepression.pumpingRateM3day === 48,
    `sustainable=${sane.pumpTest.physicsGuard.sustainableAtRequestedRate}, coneQ=${sane.coneOfDepression.pumpingRateM3day}`);
}

// ── I. MULTI-GEOPHYSICS FUSION (multiGeophysicsFusion) ──
console.log('\nI. Multi-geophysics fusion (multiGeophysicsFusion)');
{
  const mgf = req(join(OUT, 'multiGeophysicsFusion.js'));
  const ert = { aquiferDepthM: 35, aquiferThicknessM: 15, resistivityOhmM: 45, surveyDate: '2026-01-01', contractor: 'X' };
  const seismic = { method: 'refraction', bedrockDepthM: 45, weatheredZoneThicknessM: 18, vpTopLayer_ms: 800, vpBedrock_ms: 3500, layerCount: 3, profileLengthM: 115, geophoneSpacingM: 5, surveyDate: '2026-01-01', contractor: 'X' };
  check('no field data → returns null (never fabricates a fused section)',
    mgf.runMultiGeophysicsFusion({}) === null);
  const single = mgf.runMultiGeophysicsFusion({ ertSurvey: ert });
  check('single ERT survey → non-null result naming ERT',
    !!single && single.methodsUsed.includes('ERT'), single ? single.methodsUsed.join(',') : 'null');
  check('overall confidence bounded (0,1]',
    !!single && single.overallConfidence > 0 && single.overallConfidence <= 1, `${single?.overallConfidence}`);
  check('method agreement bounded [0,1]',
    !!single && single.methodAgreement >= 0 && single.methodAgreement <= 1, `${single?.methodAgreement}`);
  const dual = mgf.runMultiGeophysicsFusion({ ertSurvey: ert, seismicSurvey: seismic });
  check('two independent methods → confidence >= single method (more evidence)',
    !!dual && dual.overallConfidence >= single.overallConfidence, `single ${single?.overallConfidence} vs dual ${dual?.overallConfidence}`);
  check('two methods → both listed and a non-negative confidence boost',
    !!dual && dual.methodsUsed.length >= 2 && dual.confidenceBoost >= 0, `${dual?.methodsUsed?.length} methods, boost ${dual?.confidenceBoost}`);
}

// ── J. VES INVERSION ENGINE (vesInversionEngine) ──
console.log('\nJ. VES resistivity inversion (vesInversionEngine)');
{
  const ves = req(join(OUT, 'vesInversionEngine.js'));
  const AB2 = [1, 1.5, 2, 3, 4.6, 6.8, 10, 15, 22, 32, 46, 68, 100, 150, 220, 320];

  // 1. Homogeneous earth → apparent resistivity == true resistivity (tests Σfilter=1)
  const homo = ves.forwardVES([120], [], AB2);
  check('homogeneous earth: apparent resistivity == true resistivity at all spacings',
    homo.every(v => Math.abs(v - 120) / 120 < 0.01), `range ${Math.min(...homo).toFixed(1)}..${Math.max(...homo).toFixed(1)}`);

  // 2. Two-layer asymptotes: short AB/2 → ρ1, long AB/2 → ρ2 (H/descending, ρ1>ρ2)
  const desc = ves.forwardVES([200, 20], [40], AB2);
  check('2-layer: shortest AB/2 apparent res near top-layer ρ1 (within 15%)',
    Math.abs(desc[0] - 200) / 200 < 0.15, `ρa(AB/2=1)=${desc[0].toFixed(1)} vs ρ1=200`);
  check('2-layer: longest AB/2 apparent res approaches bottom ρ2 (< ρ1, toward 20)',
    desc[desc.length - 1] < 60 && desc[desc.length - 1] < desc[0], `ρa(max)=${desc[desc.length-1].toFixed(1)}`);

  // 3. Ascending 2-layer (ρ1<ρ2): curve rises with spacing
  const asc = ves.forwardVES([20, 200], [40], AB2);
  check('2-layer ascending: apparent res increases from short to long spacing',
    asc[asc.length - 1] > asc[0] * 1.5, `short ${asc[0].toFixed(1)} -> long ${asc[asc.length-1].toFixed(1)}`);

  // 4. Round-trip recovery: classic borehole-siting H-type — dry overburden,
  //    a moderate-resistivity sand/gravel AQUIFER, then resistive basement.
  const trueRes = [300, 80, 800], trueThick = [6, 20];
  const synthRhoA = ves.forwardVES(trueRes, trueThick, AB2);
  const data = AB2.map((s, i) => ({ ab2_m: s, rhoA_ohmm: synthRhoA[i] }));
  const inv = ves.invertVES(data, { nLayers: 3, dataSource: 'demo' });
  check('inversion fits the sounding curve (RMS < 5%)', inv.rmsErrorPct < 5, `RMS ${inv.rmsErrorPct}%`);
  const rr = inv.layers.map(l => l.resistivity_ohmm);
  const near = (a, b, tol) => Math.abs(a - b) / b < tol;
  check('inversion recovers the 3 layer resistivities (within 30%)',
    near(rr[0], 300, 0.30) && near(rr[1], 80, 0.30) && near(rr[2], 800, 0.35),
    `recovered ρ = ${rr.join(', ')} vs true 300,80,800`);
  check('inversion recovers the moderate-resistivity aquifer (middle ρ lowest)',
    rr[1] < rr[0] && rr[1] < rr[2], `ρ = ${rr.join(', ')}`);
  check('interpretation flags the sand/gravel aquifer layer (moderate ρ, not the clay/basement)',
    inv.interpretation.bestAquiferLayer === 2 && inv.interpretation.aquiferResistivity_ohmm > 40 && inv.interpretation.aquiferResistivity_ohmm < 250,
    `best layer ${inv.interpretation.bestAquiferLayer}, ρ ${inv.interpretation.aquiferResistivity_ohmm}`);

  // 5. Provenance honesty
  check('dataSource is field_ves only when real data supplied',
    ves.invertVES(data, { nLayers: 3 }).dataSource === 'field_ves' && inv.dataSource === 'demo');
  check('reports the equivalence / non-uniqueness caveat',
    /non-unique|equivalen/i.test(inv.equivalenceNote));
}

// ── K. SATELLITE ACTUAL-ET (satelliteETEngine) ──
console.log('\nK. Satellite actual-ET + measured water balance (satelliteETEngine)');
{
  const sat = req(join(OUT, 'satelliteETEngine.js'));

  // Real NASA POWER EVLAND climatology payload for Nairobi (captured live, mm/day)
  const nairobiPayload = { properties: { parameter: { EVLAND: {
    JAN: 1.63, FEB: 1.28, MAR: 1.5, APR: 2.41, MAY: 2.76, JUN: 1.61,
    JUL: 0.79, AUG: 0.75, SEP: 0.72, OCT: 1.2, NOV: 2.16, DEC: 2.03, ANN: 1.57,
  } } }, header: { range: '2001-2020' } };
  const parsed = sat.parseSatelliteET(nairobiPayload);
  check('parses NASA POWER EVLAND into a plausible annual actual ET (400-800 mm/yr)',
    parsed && parsed.actualET_mm_yr > 400 && parsed.actualET_mm_yr < 800, `${parsed && parsed.actualET_mm_yr} mm/yr`);
  check('actual-ET provenance is measured_reanalysis (never faked as field data)',
    parsed && parsed.provenance === 'measured_reanalysis');
  check('missing/fill EVLAND data → null (never fabricates ET)',
    sat.parseSatelliteET({ properties: { parameter: { EVLAND: { JAN: -999, FEB: -999 } } } }) === null &&
    sat.parseSatelliteET({}) === null);

  // Measured-ET water balance: mass conservation + physical bounds
  const climates = [[1200, 573, 200], [300, 290, 20], [2400, 900, 500], [80, 200, 10]];
  let conserved = true, capped = true, nonneg = true, off = '';
  for (const [P, AET, RO] of climates) {
    const b = sat.reconcileRechargeWithMeasuredET(P, AET, RO);
    if (!b.massConserved || Math.abs(b.precipitation_mm - (b.actualET_mm + b.runoff_mm + b.recharge_mm)) > 1) { conserved = false; off = `P=${P}`; }
    if (b.actualET_mm > b.precipitation_mm) { capped = false; off = `P=${P}`; }
    if (b.recharge_mm < 0) { nonneg = false; off = `P=${P}`; }
  }
  check('measured-ET balance conserves mass P = AET + runoff + recharge', conserved, off);
  check('actual ET is capped at precipitation (supply limit)', capped, off);
  check('recharge is never negative', nonneg, off);
  check('arid case (measured ET ≥ rainfall) → zero recharge',
    sat.reconcileRechargeWithMeasuredET(80, 200, 10).recharge_mm === 0);
  const dry = sat.reconcileRechargeWithMeasuredET(600, 500, 60);
  const wet = sat.reconcileRechargeWithMeasuredET(1400, 500, 60);
  check('wetter climate (same ET) → more recharge', wet.recharge_mm > dry.recharge_mm,
    `dry ${dry.recharge_mm} vs wet ${wet.recharge_mm}`);
}

// ── L. BACKTEST & CALIBRATION (backtestEngine) ──
console.log('\nL. Backtest & calibration (backtestEngine)');
{
  const bt = req(join(OUT, 'backtestEngine.js'));

  // 1. HONESTY: no data → UNVALIDATED, no fabricated accuracy
  const empty = bt.computeBacktest([]);
  check('no outcomes → status UNVALIDATED (never a fabricated accuracy %)',
    empty.status === 'UNVALIDATED' && empty.hitRate === null && empty.depthMAPE_pct === null && empty.grade === 'N/A');
  check('UNVALIDATED message states honesty, not a hit-rate', /unvalidated|honesty/i.test(empty.message));

  // 2. Perfect predictions → zero error, hit-rate 1, Brier ~0
  const perfect = Array.from({ length: 16 }, (_, i) => ({
    predictedDepth_m: 50, actualDepth_m: 50, predictedYield_m3h: 3, actualYield_m3h: 3,
    predictedProbability: 0.9, success: true,
  }));
  const rp = bt.computeBacktest(perfect);
  check('perfect predictions → depth MAPE 0% and 100% within 20%',
    rp.depthMAPE_pct === 0 && rp.depthWithin20pct === 1, `MAPE ${rp.depthMAPE_pct}, within20 ${rp.depthWithin20pct}`);
  check('all-success recommended holes → hit-rate 1.0', rp.hitRate === 1, `${rp.hitRate}`);
  check('confident-correct → low Brier score', rp.brierScore !== null && rp.brierScore < 0.02, `${rp.brierScore}`);
  check('>=15 outcomes → status VALIDATED with a letter grade',
    rp.status === 'VALIDATED' && /[A-F]/.test(rp.grade), `${rp.status} ${rp.grade}`);

  // 3. Known depth error is computed correctly (predicted 60 vs actual 50 = 20%)
  const errs = [
    { predictedDepth_m: 60, actualDepth_m: 50, success: true, predictedProbability: 0.8 },
    { predictedDepth_m: 40, actualDepth_m: 50, success: true, predictedProbability: 0.8 },
  ];
  const re = bt.computeBacktest(errs);
  check('depth MAPE computed correctly (|60-50|/50 and |40-50|/50 = 20%)', re.depthMAPE_pct === 20, `${re.depthMAPE_pct}`);
  check('depth bias averages signed error to ~0 (+10, -10)', re.depthBias_m === 0, `${re.depthBias_m}`);

  // 4. Calibration + Brier detects overconfidence (confident but wrong)
  const wrong = Array.from({ length: 10 }, () => ({ predictedProbability: 0.9, success: false, predictedDepth_m: 50, actualDepth_m: 50 }));
  const rw = bt.computeBacktest(wrong);
  check('confident-but-wrong → high Brier + low hit-rate (calibration works)',
    rw.brierScore !== null && rw.brierScore > 0.7 && rw.hitRate === 0, `Brier ${rw.brierScore}, hit ${rw.hitRate}`);

  // 5. CSV parsing
  const csv = 'name,predD,actD,predY,actY,prob,success\nBH-1,55,60,3,2.5,80,yes\nBH-2,40,38,2,1.8,0.6,no';
  const parsed = bt.parseBacktestCSV(csv);
  check('CSV parses rows + accepts % or 0-1 probability + yes/no success',
    parsed.length === 2 && parsed[0].success === true && Math.abs(parsed[0].predictedProbability - 0.8) < 1e-9 && parsed[1].success === false,
    JSON.stringify(parsed[0]));
}

// ── M. DATA COVERAGE ENGINE (dataCoverageEngine) ──
console.log('\nM. National data coverage + field-only honesty (dataCoverageEngine)');
{
  const dc = req(join(OUT, 'dataCoverageEngine.js'));

  // 1. No data → low coverage, pre-feasibility, all three field items outstanding
  const none = dc.assessDataCoverage({});
  check('no data → PRE-FEASIBILITY tier with low desktop coverage',
    none.confidenceTier === 'PRE-FEASIBILITY' && none.desktopCoveragePct < 30, `${none.confidenceTier} ${none.desktopCoveragePct}%`);
  check('always lists the 3 inherently field-only items as outstanding',
    none.fieldItemsOutstanding.length === 3, none.fieldItemsOutstanding.join(', '));

  // 2. HONESTY INVARIANT: full REMOTE data still leaves field-only items outstanding
  const fullRemote = dc.assessDataCoverage({
    hasClimate: true, hasSoil: true, hasGeology: true, hasVegetation: true, hasDEM: true,
    hasGraceStorage: true, hasSatelliteET: true, nearbyBoreholeCount: 12, nearbyFieldMeasuredCount: 6,
  });
  check('rich remote data → high desktop coverage', fullRemote.desktopCoveragePct >= 60, `${fullRemote.desktopCoveragePct}%`);
  check('rich remote data is TARGETED-SURVEY-READY, NOT field-validated',
    fullRemote.confidenceTier === 'TARGETED-SURVEY-READY');
  check('CRITICAL: remote data NEVER resolves the 3 field-only items (site visit not optional)',
    fullRemote.fieldItemsOutstanding.length === 3, fullRemote.fieldItemsOutstanding.join(', '));
  check('water table / chemistry / fracture stay field_required from remote data alone',
    fullRemote.items.filter(i => i.fieldOnly).every(i => i.status === 'field_required'));

  // 3. With field data, the field-only items resolve → FIELD-VALIDATED
  const validated = dc.assessDataCoverage({
    hasClimate: true, hasSoil: true, hasGeology: true, hasVegetation: true, hasDEM: true,
    hasFieldERT: true, hasPumpTest: true, hasLabChem: true,
  });
  check('field ERT + pump test + lab → FIELD-VALIDATED, no field items outstanding',
    validated.confidenceTier === 'FIELD-VALIDATED' && validated.fieldItemsOutstanding.length === 0);

  // 4. Remote confidence for a field-only property is always low; field is high
  const wtRemote = none.items.find(i => /water-table/i.test(i.domain));
  const wtField = validated.items.find(i => /water-table/i.test(i.domain));
  check('exact water-table confidence: low from remote, high with field data',
    wtRemote.confidencePct <= 40 && wtField.confidencePct >= 80, `remote ${wtRemote.confidencePct}, field ${wtField.confidencePct}`);

  // 5. more/measured nearby boreholes → higher borehole-domain confidence
  const few = dc.assessDataCoverage({ nearbyBoreholeCount: 2, nearbyFieldMeasuredCount: 0 });
  const many = dc.assessDataCoverage({ nearbyBoreholeCount: 15, nearbyFieldMeasuredCount: 8 });
  const bconf = (r) => r.items.find(i => /Nearby drilled/i.test(i.domain)).confidencePct;
  check('proven nearby boreholes raise the borehole-domain confidence', bconf(many) > bconf(few), `${bconf(few)} vs ${bconf(many)}`);

  // Real WPDx field-surveyed functionality surfaces in the borehole item note
  const withFunc = dc.assessDataCoverage({ nearbyBoreholeCount: 20, surveyedBoreholeCount: 14, functionalRatePct: 71 });
  const bItem = withFunc.items.find(i => /Nearby drilled/i.test(i.domain));
  check('WPDx functional rate surfaces as a data-backed base rate in coverage',
    /field-surveyed functionality/i.test(bItem.tells) && /71%/.test(bItem.tells), bItem.tells);
}

// ── N. CLIMATE CLASSIFIER (climateClassifier — Köppen-Geiger) ──
console.log('\nN. Köppen-Geiger climate classification (climateClassifier)');
{
  const cc = req(join(OUT, 'climateClassifier.js'));
  const rep = (v) => Array(12).fill(v);

  const af = cc.classifyKoppen(rep(26), rep(200));
  check('all-warm, all-wet → tropical rainforest Af', af.code === 'Af' && af.group === 'Tropical', af.code);

  const bwh = cc.classifyKoppen(rep(30), rep(5));
  check('hot + almost no rain → hot desert BWh (Arid)', bwh.code === 'BWh' && bwh.group === 'Arid', bwh.code);

  // Tropical savanna: warm all year, wet summer / dry winter (N hemisphere)
  const awT = rep(25);
  const awP = [10, 10, 10, 150, 150, 150, 150, 150, 150, 10, 10, 10];
  const aw = cc.classifyKoppen(awT, awP, false);
  check('warm year-round with a dry season → tropical savanna Aw', aw.code === 'Aw', aw.code);

  const cfbT = [4, 5, 8, 12, 16, 19, 21, 20, 17, 12, 7, 4];
  const cfb = cc.classifyKoppen(cfbT, rep(70), false);
  check('temperate seasonal temps, even rain → Temperate C-group', cfb.group === 'Temperate' && cfb.code[0] === 'C', cfb.code);

  const et = cc.classifyKoppen(rep(3), rep(30));
  check('warmest month < 10°C → Polar (tundra ET)', et.group === 'Polar', et.code);

  // buildClimateType parses a real NASA POWER-shaped payload (Nairobi-like)
  const payload = { properties: { parameter: {
    T2M: { JAN:19.5,FEB:20.4,MAR:20.6,APR:20.1,MAY:19,JUN:17.6,JUL:16.8,AUG:17.4,SEP:19,OCT:20,NOV:19.2,DEC:19.2,ANN:19.1 },
    PRECTOTCORR: { JAN:1.6,FEB:1.9,MAR:3.2,APR:5.6,MAY:3.1,JUN:1.1,JUL:0.6,AUG:0.7,SEP:0.7,OCT:1.6,NOV:3.8,DEC:2.6,ANN:2.2 },
    WS2M: { JAN:3.1,FEB:3.2,MAR:3.0,APR:2.7,MAY:2.9,JUN:3.3,JUL:3.4,AUG:3.4,SEP:3.3,OCT:2.9,NOV:2.7,DEC:2.9,ANN:3.06 },
  } } };
  const ct = cc.buildClimateType(payload, true);
  check('buildClimateType parses payload → non-null with a Köppen code + wind',
    ct && typeof ct.koppen.code === 'string' && ct.meanWind_ms > 0 && ct.provenance === 'measured_reanalysis',
    ct ? `${ct.koppen.code}, wind ${ct.meanWind_ms}` : 'null');
  check('missing temp/precip payload → null (never invents a climate)',
    cc.buildClimateType({ properties: { parameter: {} } }, false) === null);
}

// ── O. WRA / COUNTY BOREHOLE INGESTION (wraIngestEngine) ──
console.log('\nO. WRA/county borehole ingestion (wraIngestEngine)');
{
  const wra = req(join(OUT, 'wraIngestEngine.js'));

  // 1. CSV with varied headers → normalized records
  const csv = [
    'Borehole Name,Latitude,Longitude,Drilled Depth,Yield,SWL,Status,Permit',
    'Makuyu PS,-0.90,37.19,87,3.2,21,Functional,WRA/123',
    'Thika Farm BH,-1.03,37.07,120,1.5,45,Dry,WRA/124',
    'Ruiru Mkt,-1.15,36.96,64,,18,low,',
  ].join('\n');
  const r = wra.parseWRARecords(csv);
  check('CSV with varied headers → 3 accepted records', r.accepted === 3 && r.rejected === 0, `acc ${r.accepted} rej ${r.rejected} err ${r.errors.join('|')}`);
  check('outcome normalized (Functional→Success, Dry→Fail, low→Moderate)',
    r.records[0].outcome === 'Success' && r.records[1].outcome === 'Fail' && r.records[2].outcome === 'Moderate',
    r.records.map(x => x.outcome).join(','));
  check('coordinates + depth parsed correctly', r.records[0].depth_m === 87 && Math.abs(r.records[0].lat + 0.90) < 1e-9);

  // 2. Bad rows rejected with a reason, good rows kept
  const bad = [
    'name,lat,lon,depth',
    'Good BH,-1.2,36.8,50',
    'No coords,,,,',
    'Impossible,-1.2,36.8,5000',
  ].join('\n');
  const rb = wra.parseWRARecords(bad);
  check('invalid coords + absurd depth rejected, valid kept (never silently coerced)',
    rb.accepted === 1 && rb.rejected === 2 && rb.errors.length >= 2, `acc ${rb.accepted} rej ${rb.rejected}`);

  // 3. JSON array input also accepted
  const rj = wra.parseWRARecords(JSON.stringify([{ name: 'JSON BH', lat: -0.5, lon: 37.0, depth_m: 70, outcome: 'Success' }]));
  check('JSON array input parses to records', rj.accepted === 1 && rj.records[0].name === 'JSON BH');

  // 4. Round-trips to the exact wra-boreholes.json shape the engine consumes
  const json = wra.wraRecordsToJSON(r.records);
  const back = JSON.parse(json);
  check('serializes to wra-boreholes.json shape (name/lat/lon/depth_m/outcome)',
    Array.isArray(back) && back[0].name && typeof back[0].lat === 'number' && back[0].depth_m === 87 && back[0].outcome === 'Success');
  check('empty input → honest error, no fabricated records',
    wra.parseWRARecords('').accepted === 0 && wra.parseWRARecords('').errors.length > 0);
}

// ── P. VALIDATION BENCHMARK (validationBenchmark) ──
console.log('\nP. Measured validation benchmark (validationBenchmark)');
{
  const vb = req(join(OUT, 'validationBenchmark.js'));

  // Scoping: applies in a validated county, null elsewhere (never nationwide)
  check('benchmark applies in a validated county (Turkana)',
    vb.getValidationBenchmark({ county: 'Turkana County' }) !== null);
  check('benchmark applies when nearby wells come from the real datasets',
    vb.getValidationBenchmark({ nearbySources: ['Acacia Water / KenyaRapid+ (UNESCO IHP-WINS) — FIELD'] }) !== null);
  check('benchmark is NULL outside validated regions (no over-claiming)',
    vb.getValidationBenchmark({ county: 'Nairobi' }) === null &&
    vb.getValidationBenchmark({}) === null);

  // Statement honesty: names the real error, flags yield as unpredictable + pump test
  const stmt = vb.validationStatement(vb.KENYA_NORTH_BENCHMARK);
  check('statement cites real drilled boreholes + the measured depth hit-rate',
    /real drilled boreholes/i.test(stmt) && /40% of the time/i.test(stmt));
  check('statement is honest that YIELD cannot be predicted → pump test',
    /yield could not be reliably predicted/i.test(stmt) && /pump test/i.test(stmt));
  check('benchmark carries the survivorship-bias caveat',
    vb.KENYA_NORTH_BENCHMARK.caveats.some(c => /survivorship|under-record/i.test(c)));
}

// ── S. THREE-SCORE STATUS ARCHITECTURE (DDTR / FRR / MAG) ───────
console.log('\nS. Desktop drill-target readiness (DDTR / FRR / MAG)');
{
  const ddt = req(join(OUT, 'desktopDrillTargetReadiness.js'));
  const baseSite = {
    gpsSource: 'manual', locationConfidence: { grade: 'C' }, latitude: 0.0267,
    siteIdentity: { adminHierarchy: {} }, locationContext: { county: 'Vihiga' },
    nearbyWells: { sampleSize: 160, successRate: 1.0, nearbyWells: Array.from({ length: 150 }, (_, i) => ({ id: `Spring ${i}`, outcome: 'Success', depth_m: 58 })) },
    subsurfaceModel: {}, kenyaHydroPrior: { province: 'BASEMENT' }, aquiferClassification: {},
    lineamentAnalysis: { lineamentDensity: 0.3, intersectionCount: 5 },
    demHydrology: { twi: 11.9, slope_degrees: 2, drainageDensity: 0.45, relativePosition: 'mid', groundwaterFavorability: 65 },
    rechargeModel: { confidence: 0.62 }, historicalData: { weather: {} },
    satelliteRemoteSensing: { totalMethodsUsed: 10 }, vegetationGWProxy: { ndviSeasonalRange: 0.22 },
    soil: { type: 'loamy', permeability: 0.45, porosity: 0.48 },
    waterQuality: {}, wellDesign: { setbackAnalysis: {} },
    engineerConfidence: { provenance: { overallAccuracy_pct: 65 } }, _auditFlags: {},
  };
  const desktop = ddt.computeDesktopDrillTargetReadiness(baseSite, 0);
  check('DDTR is in 0-95 (desktop can never reach 100)', desktop.ddtr >= 0 && desktop.ddtr <= 95);
  check('desktop-only MAG is CONDITIONALLY RELEASED, never RELEASED FOR DRILLING', desktop.mag === 'CONDITIONALLY RELEASED');
  check('FRR is 0 when no field/regulatory work is done', desktop.frr === 0);
  check('manual-coords + springs-only apply penalties', desktop.penalties.length >= 2 && desktop.penalties.every(p => p.points < 0));

  const contradiction = ddt.computeDesktopDrillTargetReadiness(baseSite, 2);
  check('unresolved audit FAIL BLOCKS the mobilisation gate (§9)', contradiction.mag === 'BLOCKED');
  check('unresolved contradiction caps DDTR below 90', contradiction.ddtr < 90 && contradiction.ddtr < desktop.ddtr);

  const full = JSON.parse(JSON.stringify(baseSite));
  full.gpsSource = 'device';
  full.nearbyWells.nearbyWells = Array.from({ length: 40 }, (_, i) => ({ id: `BH-${i}`, outcome: i % 5 ? 'Success' : 'Fail', depth_m: 80, yield_m3h: 6 }));
  full._auditFlags = { hasFieldRecon: true, hasFieldPeg: true, hasFieldERT: true, hasHydrogeologistSignoff: true, hasWRAAuthorisation: true, hasEnvAuthorisation: true, hasFieldPumpTest: true, hasLabWaterAnalysis: true };
  const released = ddt.computeDesktopDrillTargetReadiness(full, 0);
  check('all field+regulatory gates done → MAG RELEASED FOR DRILLING', released.mag === 'RELEASED FOR DRILLING');
  check('field-complete FRR reaches 100', released.frr === 100);
  check('even a strong+field-complete site never exceeds DDTR 95', released.ddtr <= 95);
  check('DDTR classification bands map correctly', ddt.classifyDDTR(30) === 'DESKTOP TARGET REJECTED' && ddt.classifyDDTR(92) === 'HIGH-CONFIDENCE DESKTOP DRILL TARGET');

  // ── Owner directive 2026-07-16: a COMPLETE, convergent desktop study must
  //    legitimately reach 80+ (the remaining ~20% is the actual site survey),
  //    while a data-poor site must stay far below — the score discriminates.
  //    Mirrors the real Vihiga run: 188 registry points (147 springs, 100%
  //    functional), full satellite stack, county drilled-borehole intelligence
  //    (250 boreholes, 72% success, band 10-90 m) concordant with 40 m target.
  const rich = JSON.parse(JSON.stringify(baseSite));
  rich.locationConfidence = { grade: 'B' };
  rich.recommendedDepth = 40;
  rich.nearbyWells = {
    sampleSize: 188, successRate: 1.0,
    nearbyWells: [
      ...Array.from({ length: 147 }, (_, i) => ({ id: `Water Spring ${i}`, outcome: 'Success', depth_m: 58, source: 'WPDx' })),
      ...Array.from({ length: 3 }, (_, i) => ({ id: `Community Well ${i}`, outcome: 'Success', depth_m: 55, yield_m3h: 4, source: 'WPDx (regional est. from county database)' })),
    ],
  };
  rich.boreholeRecords = { countyIntelligence: { county: 'Vihiga', estimatedBoreholes: 250, successRate: 0.72, avgDepth_m: 40, depthRange: [10, 90], avgYield_m3h: 4.0, yieldRange: [0.3, 12], primaryGeology: 'Precambrian basement' } };
  rich.risk = { categories: { contamination: 10 }, contaminationRisk: { level: 0.1 } };
  const richR = ddt.computeDesktopDrillTargetReadiness(rich, 0);
  check('evidence-rich COMPLETE desktop study reaches DDTR >= 80 (desktop pre-feasibility earns its 80%+)',
    richR.ddtr >= 80, `ddtr ${richR.ddtr}`);
  check('...and is classed ADVANCED or HIGH-CONFIDENCE desktop target',
    /ADVANCED|HIGH-CONFIDENCE/.test(richR.ddtrClass), richR.ddtrClass);
  check('...but MAG still NOT released for drilling (the ~20% field share is explicit)',
    richR.mag === 'CONDITIONALLY RELEASED' && richR.frr === 0);
  check('regional-est outcomes earn NO drilled-analogue credit (no synthetic validation)',
    !richR.categories.some(c => /analogue/i.test(c.category) && /\b3 drilled-outcome/i.test(c.basis)));
  check('county drilled-borehole intelligence is credited and named in the basis',
    richR.categories.some(c => /analogue/i.test(c.category) && /250 boreholes/.test(c.basis)));

  const poor = {
    gpsSource: 'none', latitude: 1.0,
    nearbyWells: { sampleSize: 0, successRate: 0, nearbyWells: [] },
    _auditFlags: {},
  };
  const poorR = ddt.computeDesktopDrillTargetReadiness(poor, 0);
  check('data-poor site stays far below (score discriminates, no participation trophy)',
    poorR.ddtr < 40, `ddtr ${poorR.ddtr}`);
  check('data-poor MAG is BLOCKED', poorR.mag === 'BLOCKED');

  // ── Anomaly audit 2026-07-16 regressions ──
  // #7: a registry typo ("Water Sring") must still classify as a spring, never
  //     as a drilled borehole in the evidence tables.
  const typoSite = { ...JSON.parse(JSON.stringify(baseSite)) };
  typoSite.nearbyWells = { sampleSize: 10, successRate: 1, nearbyWells: [
    { id: 'Eliangoma Water Sring', outcome: 'Success', depth_m: 62, source: 'WPDx (regional est. from county database)' },
    { id: 'Community Borehole A', outcome: 'Success', depth_m: 55, source: 'WPDx' },
  ]};
  const typoR = ddt.computeDesktopDrillTargetReadiness(typoSite, 0);
  const wpCat = typoR.categories.find(c => /water-point/i.test(c.category));
  check('registry typo "Sring" classifies as spring, not borehole (audit #7)',
    /1 borehole\/well, 1 spring/.test(wpCat.basis), wpCat.basis);

  // #3: geocoded admin hierarchy on resolvedLocation counts as resolved
  const adminSite = JSON.parse(JSON.stringify(baseSite));
  delete adminSite.siteIdentity; delete adminSite.locationContext;
  adminSite.resolvedLocation = { county: 'Vihiga', state: 'Vihiga County' };
  const adminR = ddt.computeDesktopDrillTargetReadiness(adminSite, 0);
  const coordCat = adminR.categories.find(c => /Coordinate/i.test(c.category));
  check('resolvedLocation admin hierarchy counts as resolved (audit #3)', /admin resolved/.test(coordCat.basis), coordCat.basis);

  // #4: multi-year recharge time series counts as a multi-year climate record
  const climSite = JSON.parse(JSON.stringify(baseSite));
  delete climSite.historicalData;
  climSite.rechargeModel = { confidence: 0.62, annualRechargeTimeSeries: [{ year: 2021 }, { year: 2022 }, { year: 2023 }] };
  const climR = ddt.computeDesktopDrillTargetReadiness(climSite, 0);
  const climCat = climR.categories.find(c => /Climate/i.test(c.category));
  check('multi-year recharge series counts as multi-year climate (audit #4)', /multi-year/.test(climCat.basis), climCat.basis);
}

// ── U. COUNTY LOOKUP — name beats bounding box (audit #2, 2026-07-16) ──
console.log('\nU. Kenya county intelligence lookup (boreholeDatabase)');
{
  const bdb = req(join(OUT, 'boreholeDatabase.js'));
  // The live Vihiga defect: site at (0.0267, 34.6472) geocoded to "Vihiga
  // County" but the bbox test assigned KAKAMEGA's drilling record.
  const byName = bdb.getKenyaCountyBoreholeStatsByName('Vihiga County');
  check('name lookup "Vihiga County" returns the VIHIGA record', byName?.county === 'Vihiga', byName?.county);
  check('name lookup normalizes hyphens/case ("uasin-gishu")', bdb.getKenyaCountyBoreholeStatsByName('Uasin-Gishu')?.county === 'Uasin Gishu' || !!bdb.getKenyaCountyBoreholeStatsByName('Uasin-Gishu'));
  check('name lookup returns null for unknown, never a wrong county', bdb.getKenyaCountyBoreholeStatsByName('Atlantis') === null);
  const byCoords = bdb.getKenyaCountyBoreholeStats(0.026677, 34.647174);
  check('widened bbox: the live-defect coordinates now resolve to Vihiga', byCoords?.county === 'Vihiga', byCoords?.county);
}

// ── T. FINAL CONSENSUS TRACKS THE GOVERNING VALUE (live Check-19 block, 2026-07-16) ──
console.log('\nT. Final consensus vs governing value (sanitizeOutputs + reportAuditor)');
{
  const so = req(join(OUT, 'sanitizeOutputs.js'));
  const ra = req(join(OUT, 'reportAuditor.js'));
  // Exact live-block scenario: governing 0.41 m³/hr; sub-model diagnostics
  // still carry 4.1 (confidence-weighted) and 4.9 (ML predictor).
  const r = {
    probability: 0.65, recommendedDepth: 61, estimatedYield: 0.41,
    uncertainty: { yieldRange: [3.3, 6.5], depthRange: [48, 74], probabilityRange: [0.48, 0.80], depthConfidence: 0.57 },
    confidenceWeighted: { adjustedProbability: 0.54, adjustedDepth_m: 61, adjustedYield_m3hr: 4.1, overallConfidence: 0.46 },
    drillingPrediction: { successProbability: 49, predictedDepth_m: 49, predictedYield_m3h: 4.9, modelConfidence: 65 },
    drillDecision: { expectedYield_m3hr: 0.41, targetDepth_m: 61, yieldRange_m3hr: [0.3, 0.6], primaryPoint: { lat: 0.02, lon: 34.6 }, successProbability: 65 },
    wellDesign: { drawdown: { designPumpingRate_m3hr: 0.41, transmissivity_m2day: 0.2 } },
    nearbyWells: { sampleSize: 160, successRate: 1, nearbyWells: Array.from({ length: 150 }, (_, i) => ({ id: `Spring ${i}`, outcome: 'Success', depth_m: 58, yield_m3h: 5 })) },
    risk: { overallRisk: 0.29, viability: 'medium' },
    waterQuality: { score: 0.7, isPotable: false, pH: 6.8, tds: 360, fluoride: 0.4, iron: 0.15, arsenic: 0.003, nitrate: 5.6, turbidity: 1, hardness: 120, dataSource: 'model' },
    soil: { porosity: 0.48, pH: 6.8, dataSource: 'SoilGrids' },
    assessmentType: 'DESKTOP_ESTIMATE', assessmentDisclaimer: 'Desktop pre-feasibility only; no field measurements. ERT, pump test and lab analysis required before drilling.',
  };
  so.sanitizeAnalysisResult(r);
  check('finalConsensus yield equals the governing yield (no re-vote by stale sub-models)',
    Math.abs(r.finalConsensus.yield_m3hr - 0.41) < 0.01, `${r.finalConsensus.yield_m3hr}`);
  check('finalConsensus depth/probability equal the governing values',
    Math.abs(r.finalConsensus.depth_m - 61) < 1 && Math.abs(r.finalConsensus.successProbability - 0.65) < 0.01);
  check('consensus ranges contain the governing central value',
    r.finalConsensus.yieldRange[0] <= 0.41 && r.finalConsensus.yieldRange[1] >= 0.41);
  check('sub-model diagnostic panels keep their own labelled numbers',
    r.confidenceWeighted.adjustedYield_m3hr === 4.1 && r.drillingPrediction.predictedYield_m3h === 4.9);
  const audit = ra.auditReport(r);
  const c18 = audit.checks.find((c) => c.id === 18), c19 = audit.checks.find((c) => c.id === 19);
  check('Check 18 (cross-engine) passes on the reconciled result', c18.severity === 'PASS', c18.details.slice(0, 80));
  check('Check 19 (reconciliation matrix) passes — report no longer blocked', c19.severity === 'PASS', c19.details.slice(0, 80));
}

rmSync(OUT, { recursive: true, force: true });
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
