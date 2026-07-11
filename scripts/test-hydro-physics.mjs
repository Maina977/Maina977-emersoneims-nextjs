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

const files = ['hydroPhysics.ts', 'dynamicRechargeModel.ts', 'engineerConfidenceEngine.ts', 'advancedHydroEngine.ts', 'pumpTestAnalyzer.ts', 'subsurfaceModeler.ts', 'drillReadiness.ts', 'aquiferSimulator.ts', 'multiGeophysicsFusion.ts', 'vesInversionEngine.ts'];
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

rmSync(OUT, { recursive: true, force: true });
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
