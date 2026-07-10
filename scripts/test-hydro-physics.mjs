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

const files = ['hydroPhysics.ts', 'dynamicRechargeModel.ts', 'engineerConfidenceEngine.ts', 'advancedHydroEngine.ts'];
execSync(
  `node "${join(ROOT, 'node_modules', 'typescript', 'lib', 'tsc.js')}" ` +
  files.map(f => `"${join(SRC, f)}"`).join(' ') +
  ` --outDir "${OUT}" --module commonjs --target es2020 --lib es2020,dom --skipLibCheck --esModuleInterop --noResolve`,
  { stdio: 'pipe' },
);

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

rmSync(OUT, { recursive: true, force: true });
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
