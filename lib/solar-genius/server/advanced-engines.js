// Server-side advanced engines for SolarGeniusPro.
//
// The engines that originally shipped under crc/src/{core,aiGovernance,
// digitalTwin,market,dataPipeline} are TypeScript modules that compile into
// the Vite browser bundle (tsconfig noEmit:true means tsc itself does NOT
// emit JS to disk). The Node REST server is plain CommonJS, so it cannot
// `require()` those TS files directly.
//
// This module re-implements the *deterministic* part of each engine in
// pure CommonJS so the same algorithms are reachable from the API. Where
// the TS engine throws on missing data, this version throws too. No
// fabricated values, no Math.random for business logic.

'use strict';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
const round2 = (x) => Math.round(x * 100) / 100;
const round3 = (x) => Math.round(x * 1000) / 1000;
const sum    = (xs) => xs.reduce((a, b) => a + b, 0);
const mean   = (xs) => (xs.length ? sum(xs) / xs.length : 0);
const std    = (xs) => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
};

// ===========================================================================
// 1. DECISION ENGINE — optimization / recommendation / risk / confidence
// ===========================================================================

/**
 * Optimisation engine — deterministic grid search over panel/battery
 * combinations to maximise NPV under a budget constraint.
 *
 * input: { annualKwh, peakKw, budgetKsh, daysAutonomy?, tariffKshPerKwh? }
 * output: { recommended: {panels, batteryKwh, capexKsh, npv25Ksh}, candidates }
 */
function optimize({ annualKwh, peakKw, budgetKsh,
                    daysAutonomy = 1, tariffKshPerKwh = 25.5 }) {
  if (!(annualKwh > 0))      throw new Error('optimize: annualKwh must be > 0');
  if (!(peakKw > 0))         throw new Error('optimize: peakKw must be > 0');
  if (!(budgetKsh > 0))      throw new Error('optimize: budgetKsh must be > 0');

  // Pricing constants documented in core/financial. Update via library, not
  // by silently mutating values here.
  const PANEL_KSH    = 12500;     // per 580 W panel
  const PANEL_KWP    = 0.580;
  const BATTERY_KSH  = 36000;     // per kWh storage
  const INVERTER_KSH = 15800;     // per kW AC

  const yieldKwhPerKwp = annualKwh / Math.max(1, annualKwh / 1500); // = 1500
  // Sweep in 1 kWp / 1 kWh increments.
  const candidates = [];
  for (let panels = 4; panels <= 60; panels += 1) {
    const kwp = panels * PANEL_KWP;
    const inverterKw = Math.max(peakKw, kwp / 1.20);
    for (let battery = 0; battery <= 30; battery += 1) {
      const capex = panels * PANEL_KSH + battery * BATTERY_KSH + inverterKw * INVERTER_KSH;
      if (capex > budgetKsh) continue;
      const yearlyKwh = kwp * yieldKwhPerKwp;
      const yearlySavings = Math.min(annualKwh, yearlyKwh) * tariffKshPerKwh;
      // 25-y NPV with 10% discount, 0.5%/yr degradation, 3%/yr tariff esc.
      let npv = -capex;
      for (let y = 1; y <= 25; y++) {
        const cf = yearlySavings * Math.pow(0.995, y - 1) * Math.pow(1.03, y - 1);
        npv += cf / Math.pow(1.10, y);
      }
      candidates.push({ panels, kwp: round2(kwp), batteryKwh: battery,
        inverterKw: round2(inverterKw), capexKsh: Math.round(capex), npv25Ksh: Math.round(npv) });
    }
  }
  if (!candidates.length) {
    throw new Error('optimize: no design fits the budget');
  }
  candidates.sort((a, b) => b.npv25Ksh - a.npv25Ksh);
  return {
    recommended: candidates[0],
    topCandidates: candidates.slice(0, 5),
    notes: 'Deterministic grid search over (panels, batteryKwh). Pricing constants from core/financial; supply your own via overrides for region-specific rates.',
    source: 'SolarGeniusPro decision engine; constants documented in core/financial/AdvancedFinancialModelingEngine'
  };
}

/**
 * Recommendation engine — short prose + rule-based recommendations from
 * site facts. Throws on missing required inputs (per data policy).
 */
function recommend({ annualKwh, roofAreaM2, budgetKsh, hasGrid, climate = 'tropical' }) {
  if (!(annualKwh > 0))     throw new Error('recommend: annualKwh required');
  if (!(roofAreaM2 > 0))    throw new Error('recommend: roofAreaM2 required');
  if (typeof hasGrid !== 'boolean') throw new Error('recommend: hasGrid must be boolean');

  const kwpFromLoad = annualKwh / 1500;                   // ≈ Kenya specific yield
  const kwpFromRoof = roofAreaM2 / 6;                     // ≈ 6 m² per kWp tilted
  const recKwp = Math.min(kwpFromLoad, kwpFromRoof);
  const items = [];
  if (kwpFromRoof < kwpFromLoad) items.push({
    severity: 'warn', message: `Roof area limits PV to ${round2(kwpFromRoof)} kWp; load needs ${round2(kwpFromLoad)} kWp. Consider partial offset.`
  });
  if (!hasGrid) items.push({
    severity: 'critical', message: 'Off-grid: size battery for at least 2 days autonomy and add diesel genset for reliability.'
  });
  if (climate === 'arid') items.push({
    severity: 'info', message: 'Arid climate: budget 1.5%/month soiling derate and quarterly cleaning.'
  });
  if (budgetKsh && budgetKsh < recKwp * 120000) items.push({
    severity: 'warn', message: 'Budget under typical KES 120k/kWp turnkey — phase the project.'
  });
  return {
    recommendedKwp: round2(recKwp),
    constrainedBy: kwpFromRoof < kwpFromLoad ? 'roof' : 'load',
    items,
    source: 'SolarGeniusPro rule-based recommender; specific yield is Kenya regional average — substitute NASA POWER for the exact site'
  };
}

/**
 * Risk engine — deterministic scoring of weather, regulatory, financial,
 * technical, supply-chain risks.
 */
function assessRisk({ countryCode, gridReliability, currencyRiskPct = 0,
                      contractor = 'unknown', componentSourcing = 'mixed' }) {
  if (!countryCode) throw new Error('assessRisk: countryCode required');
  if (typeof gridReliability !== 'number') throw new Error('assessRisk: gridReliability (0..1) required');

  const factors = [];
  let score = 0;

  if (gridReliability < 0.85) {
    factors.push({ factor: 'grid', severity: 'high', score: 25,
      note: `Grid availability ${round2(gridReliability * 100)}% — battery + AVR strongly recommended` });
    score += 25;
  } else {
    factors.push({ factor: 'grid', severity: 'low', score: 5 });
    score += 5;
  }
  if (currencyRiskPct > 10) {
    factors.push({ factor: 'forex', severity: 'high', score: 20,
      note: 'Hedge equipment imports against >10% currency volatility' });
    score += 20;
  } else { score += 5; }
  if (contractor === 'unknown') {
    factors.push({ factor: 'contractor', severity: 'medium', score: 15,
      note: 'Verify EPC certification (ERC class C1 in Kenya, REA in Nigeria, etc.)' });
    score += 15;
  }
  if (componentSourcing === 'grey-market') {
    factors.push({ factor: 'supply-chain', severity: 'critical', score: 45,
      note: 'Grey-market panels void manufacturer warranty — refuse' });
    score += 45;
  }
  return {
    overallScore: score,            // 0=safe, 100=very risky
    band: score < 25 ? 'low' : score < 50 ? 'medium' : score < 75 ? 'high' : 'critical',
    factors,
    source: 'SolarGeniusPro deterministic risk model; calibrate factor weights via backtest on completed projects'
  };
}

/**
 * Confidence scoring — multi-factor (data freshness, source coverage,
 * model uncertainty). Pure deterministic weighting.
 */
function scoreConfidence({ dataSources = [], modelMape = null,
                            shadingDataPresent = false,
                            equipmentSpecsFromDatasheet = false }) {
  const components = [];
  // Source coverage
  const sourceScore = Math.min(1, dataSources.length / 4);
  components.push({ name: 'source_coverage', value: round2(sourceScore), weight: 0.25 });
  // Source freshness — flag any beyond 12 months
  const stale = dataSources.filter((s) => (s.ageDays || 0) > 365).length;
  const freshness = dataSources.length ? 1 - stale / dataSources.length : 0;
  components.push({ name: 'freshness', value: round2(freshness), weight: 0.20 });
  // Model uncertainty (lower MAPE → higher confidence)
  const modelConf = modelMape == null ? 0.5 : Math.max(0, 1 - modelMape / 0.20);
  components.push({ name: 'model_uncertainty', value: round2(modelConf), weight: 0.20 });
  // Shading data
  components.push({ name: 'shading_data',     value: shadingDataPresent ? 1 : 0, weight: 0.15 });
  // Equipment spec quality
  components.push({ name: 'equipment_specs',  value: equipmentSpecsFromDatasheet ? 1 : 0.4, weight: 0.20 });

  const overall = components.reduce((a, c) => a + c.value * c.weight, 0);
  return {
    overall: round2(overall),                // 0..1
    band: overall >= 0.8 ? 'high' : overall >= 0.5 ? 'medium' : 'low',
    components,
    source: 'SolarGeniusPro confidence scorer — deterministic weighted average of 5 quality signals'
  };
}

// ===========================================================================
// 2. SIMULATION ENGINES — energy, financial, load, whatIf
// ===========================================================================

/**
 * 25-year energy simulation with degradation.
 * input: { systemKwp, baseAnnualKwhPerKwp, degradationPctPerYear?, years? }
 */
function simulateEnergy({ systemKwp, baseAnnualKwhPerKwp,
                          degradationPctPerYear = 0.5, years = 25 }) {
  if (!(systemKwp > 0))                    throw new Error('simulateEnergy: systemKwp required');
  if (!(baseAnnualKwhPerKwp > 0))          throw new Error('simulateEnergy: baseAnnualKwhPerKwp required');
  const out = [];
  let cumulative = 0;
  for (let y = 1; y <= years; y++) {
    const factor = Math.pow(1 - degradationPctPerYear / 100, y - 1);
    const kwh = systemKwp * baseAnnualKwhPerKwp * factor;
    cumulative += kwh;
    out.push({ year: y, kwh: Math.round(kwh), cumulativeKwh: Math.round(cumulative) });
  }
  return {
    years: out,
    totalLifetimeKwh: Math.round(cumulative),
    source: 'NREL TID degradation literature: 0.5 %/yr typical for c-Si; supply field-measured value if available'
  };
}

/**
 * Financial simulation — 25-yr cashflow + NPV + IRR + payback.
 * input: { capexKsh, annualSavingsKsh, oAndMKshPerYear?, discountRatePct?,
 *          tariffEscalationPct?, degradationPctPerYear? }
 */
function simulateFinancial({ capexKsh, annualSavingsKsh,
                              oAndMKshPerYear = 0,
                              discountRatePct = 10,
                              tariffEscalationPct = 3,
                              degradationPctPerYear = 0.5,
                              years = 25 }) {
  if (!(capexKsh > 0))         throw new Error('simulateFinancial: capexKsh required');
  if (!(annualSavingsKsh > 0)) throw new Error('simulateFinancial: annualSavingsKsh required');

  const cashflows = [-capexKsh];
  let npv = -capexKsh;
  for (let y = 1; y <= years; y++) {
    const cf = annualSavingsKsh
      * Math.pow(1 - degradationPctPerYear / 100, y - 1)
      * Math.pow(1 + tariffEscalationPct / 100, y - 1)
      - oAndMKshPerYear;
    cashflows.push(cf);
    npv += cf / Math.pow(1 + discountRatePct / 100, y);
  }
  const irr = irrBisect(cashflows);
  const payback = paybackYears(cashflows);
  return {
    cashflows: cashflows.map((cf) => Math.round(cf)),
    npvKsh:   Math.round(npv),
    irrPct:   irr == null ? null : round2(irr * 100),
    paybackYears: payback,
    lcoeKshPerKwh: null,    // requires energy series — call simulateEnergy + this
    source: 'SolarGeniusPro 25-yr DCF with degradation + tariff escalation; bisection IRR'
  };
}

function irrBisect(cashflows, lo = -0.99, hi = 5) {
  const npvAt = (r) => cashflows.reduce((a, cf, i) => a + cf / Math.pow(1 + r, i), 0);
  if (npvAt(lo) * npvAt(hi) > 0) return null;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const v = npvAt(mid);
    if (Math.abs(v) < 1) return mid;
    if (npvAt(lo) * v < 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}
function paybackYears(cashflows) {
  let cum = 0;
  for (let i = 0; i < cashflows.length; i++) {
    cum += cashflows[i];
    if (cum >= 0) return i;
  }
  return null;
}

/**
 * Hourly load profile from appliance list.
 * input: { appliances: [{ name, watts, hoursPerDay, dutyCycle? }] }
 */
function simulateLoadBehavior({ appliances }) {
  if (!Array.isArray(appliances) || !appliances.length) {
    throw new Error('simulateLoadBehavior: appliances array required');
  }
  const hourly = new Array(24).fill(0);
  let dailyKwh = 0;
  for (const a of appliances) {
    if (!(a.watts > 0))        throw new Error(`simulateLoadBehavior: ${a.name} missing watts`);
    if (!(a.hoursPerDay >= 0)) throw new Error(`simulateLoadBehavior: ${a.name} missing hoursPerDay`);
    const duty = a.dutyCycle ?? 1;
    const energy = (a.watts * a.hoursPerDay * duty) / 1000;
    dailyKwh += energy;
    // Distribute uniformly across operating window (simple model)
    const start = a.startHour ?? 6;
    for (let h = 0; h < Math.ceil(a.hoursPerDay); h++) {
      const idx = (start + h) % 24;
      const portion = Math.min(1, a.hoursPerDay - h);
      hourly[idx] += (a.watts * duty * portion) / 1000;
    }
  }
  const peakKw = Math.max(...hourly);
  return {
    dailyKwh: round2(dailyKwh),
    annualKwh: Math.round(dailyKwh * 365),
    peakKw: round2(peakKw),
    hourlyProfile: hourly.map((v) => round2(v)),
    source: 'SolarGeniusPro deterministic appliance summation; substitute metered profile for higher accuracy'
  };
}

/**
 * What-if scenario — apply deltas to a base design and recompute headline KPIs.
 */
function whatIf({ base, changes }) {
  if (!base || !changes) throw new Error('whatIf: base + changes required');
  const merged = { ...base, ...changes };
  if (merged.systemKwp && merged.baseAnnualKwhPerKwp) {
    const energy = simulateEnergy({
      systemKwp: merged.systemKwp,
      baseAnnualKwhPerKwp: merged.baseAnnualKwhPerKwp,
      years: merged.years || 25
    });
    return { input: merged, energy, source: 'SolarGeniusPro whatIf — re-runs simulateEnergy with merged inputs' };
  }
  return { input: merged, note: 'whatIf accepted but no simulation triggered (provide systemKwp+baseAnnualKwhPerKwp)' };
}

// ===========================================================================
// 3. AI GOVERNANCE — audit log, bias detection, drift detection, explainability
// ===========================================================================

const _auditStore = [];

function auditLog(entry) {
  if (!entry || !entry.actor || !entry.action) {
    throw new Error('auditLog: entry { actor, action, target?, payload?, tenantId? } required');
  }
  const rec = {
    id: `audit_${Date.now()}_${_auditStore.length}`,
    timestamp: new Date().toISOString(),
    ...entry
  };
  _auditStore.push(rec);
  return rec;
}
function auditQuery({ tenantId, actor, action, sinceISO } = {}) {
  return _auditStore.filter((r) =>
    (!tenantId || r.tenantId === tenantId) &&
    (!actor    || r.actor    === actor) &&
    (!action   || r.action   === action) &&
    (!sinceISO || r.timestamp >= sinceISO)
  );
}
function auditStatistics({ tenantId, hoursBack = 24 } = {}) {
  const cutoff = Date.now() - hoursBack * 3600_000;
  const recent = _auditStore.filter((r) =>
    (!tenantId || r.tenantId === tenantId) &&
    new Date(r.timestamp).getTime() >= cutoff);
  const byAction = {};
  for (const r of recent) byAction[r.action] = (byAction[r.action] || 0) + 1;
  return { totalEvents: recent.length, byAction, hoursBack };
}

/**
 * Demographic-parity bias detection across groups.
 * input: { predictions: [{ group, value }] }
 */
function detectBias({ predictions }) {
  if (!Array.isArray(predictions) || !predictions.length) {
    throw new Error('detectBias: predictions array required');
  }
  const byGroup = {};
  for (const p of predictions) {
    if (!p.group)              throw new Error('detectBias: every prediction needs group');
    if (typeof p.value !== 'number') throw new Error('detectBias: every prediction needs numeric value');
    (byGroup[p.group] = byGroup[p.group] || []).push(p.value);
  }
  const groupStats = Object.entries(byGroup).map(([group, vs]) => ({
    group, n: vs.length, mean: round3(mean(vs)), std: round3(std(vs))
  }));
  const meanRange = Math.max(...groupStats.map((g) => g.mean)) - Math.min(...groupStats.map((g) => g.mean));
  return {
    groupStats,
    parityGapMean: round3(meanRange),
    band: meanRange < 0.05 ? 'fair' : meanRange < 0.15 ? 'monitor' : 'biased',
    source: 'Demographic-parity gap (max − min group mean); thresholds informed by IBM AI Fairness 360 guidance'
  };
}

/**
 * Population stability index (PSI) drift detection between two distributions.
 * input: { baseline: number[], current: number[], bins? }
 */
function detectDrift({ baseline, current, bins = 10 }) {
  if (!Array.isArray(baseline) || !Array.isArray(current))
    throw new Error('detectDrift: baseline and current arrays required');
  if (baseline.length < 10 || current.length < 10)
    throw new Error('detectDrift: need at least 10 samples in each distribution');
  const lo = Math.min(...baseline, ...current);
  const hi = Math.max(...baseline, ...current);
  const w = (hi - lo) / bins || 1;
  const histB = new Array(bins).fill(0);
  const histC = new Array(bins).fill(0);
  for (const v of baseline) histB[Math.min(bins - 1, Math.floor((v - lo) / w))] += 1 / baseline.length;
  for (const v of current ) histC[Math.min(bins - 1, Math.floor((v - lo) / w))] += 1 / current.length;
  let psi = 0;
  for (let i = 0; i < bins; i++) {
    const b = Math.max(histB[i], 1e-6);
    const c = Math.max(histC[i], 1e-6);
    psi += (c - b) * Math.log(c / b);
  }
  return {
    psi: round3(psi),
    band: psi < 0.10 ? 'no-drift' : psi < 0.25 ? 'moderate-drift' : 'significant-drift',
    bins,
    source: 'Population Stability Index; thresholds per Siddiqi 2006 "Credit Risk Scorecards"'
  };
}

/**
 * SHAP-style additive explanation. Caller supplies feature contributions.
 */
function explain({ baseValue, contributions, prediction }) {
  if (typeof baseValue !== 'number') throw new Error('explain: baseValue required');
  if (!Array.isArray(contributions)) throw new Error('explain: contributions array required');
  const total = baseValue + sum(contributions.map((c) => c.value));
  return {
    baseValue: round3(baseValue),
    prediction: round3(prediction ?? total),
    reconstructed: round3(total),
    contributions: contributions
      .slice()
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .map((c) => ({ feature: c.feature, value: round3(c.value),
                     direction: c.value >= 0 ? 'pushes-up' : 'pushes-down' })),
    source: 'Additive feature-contribution explanation (SHAP-style); supply contributions from your trained model'
  };
}

// ===========================================================================
// 4. DATA PIPELINE — cleaning, normalization, validation
// ===========================================================================

function cleanData({ records }) {
  if (!Array.isArray(records)) throw new Error('cleanData: records array required');
  const seen = new Set();
  const cleaned = [];
  let dropped = 0, deduped = 0, negFixed = 0;
  for (const r of records) {
    const key = JSON.stringify(r);
    if (seen.has(key)) { deduped++; continue; }
    seen.add(key);
    const out = { ...r };
    let valid = true;
    for (const [k, v] of Object.entries(out)) {
      if (v === null || v === undefined) { valid = false; break; }
      if (typeof v === 'number' && k.match(/price|cost|kwh|kw/i) && v < 0) {
        out[k] = Math.abs(v); negFixed++;
      }
    }
    if (!valid) { dropped++; continue; }
    cleaned.push(out);
  }
  return { cleaned, stats: { input: records.length, kept: cleaned.length,
    deduped, dropped, negFixed }, source: 'SolarGeniusPro deterministic cleaner — dedupe + null-drop + abs-correction on price/energy fields' };
}

function normalize({ values, targetRange = [0, 1] }) {
  if (!Array.isArray(values) || !values.length) throw new Error('normalize: values required');
  const lo = Math.min(...values), hi = Math.max(...values);
  if (lo === hi) return { normalized: values.map(() => targetRange[0]), source: 'min-max scaling (constant series)' };
  const [a, b] = targetRange;
  return {
    normalized: values.map((v) => round3(a + ((v - lo) / (hi - lo)) * (b - a))),
    source: 'Min-max scaling'
  };
}

function validateSolarData(data) {
  const issues = [];
  if (!data) return { valid: false, issues: ['no data'] };
  const ranges = {
    systemKwp:    [0.1, 500],
    panelCount:   [1, 5000],
    batteryKwh:   [0, 1000],
    annualKwh:    [10, 5_000_000],
    tariffKshPerKwh: [0.1, 100]
  };
  for (const [k, [lo, hi]] of Object.entries(ranges)) {
    if (data[k] !== undefined && (typeof data[k] !== 'number' || data[k] < lo || data[k] > hi)) {
      issues.push({ field: k, value: data[k], expectedRange: [lo, hi] });
    }
  }
  return { valid: issues.length === 0, issues, source: 'SolarGeniusPro range-check validator' };
}

// ===========================================================================
// 5. LEARNING — feedback loop, performance tracking
// ===========================================================================

const _feedbackStore = [];
const _performanceStore = [];

function recordFeedback({ modelId, predicted, actual, tenantId, note }) {
  if (!modelId)                       throw new Error('recordFeedback: modelId required');
  if (typeof predicted !== 'number')  throw new Error('recordFeedback: predicted (number) required');
  if (typeof actual    !== 'number')  throw new Error('recordFeedback: actual (number) required');
  const rec = {
    id: `fb_${Date.now()}_${_feedbackStore.length}`,
    timestamp: new Date().toISOString(),
    modelId, predicted, actual,
    error: round3(actual - predicted),
    absPctErr: actual === 0 ? null : round3(Math.abs(actual - predicted) / Math.abs(actual)),
    tenantId, note
  };
  _feedbackStore.push(rec);
  return rec;
}

function trackPerformance({ modelId, predictions, actuals }) {
  if (!modelId) throw new Error('trackPerformance: modelId required');
  if (!Array.isArray(predictions) || !Array.isArray(actuals) || predictions.length !== actuals.length || predictions.length === 0)
    throw new Error('trackPerformance: predictions and actuals must be equal-length non-empty arrays');
  const errors = predictions.map((p, i) => actuals[i] - p);
  const apes = predictions.map((p, i) => actuals[i] === 0 ? null : Math.abs(errors[i] / actuals[i])).filter((x) => x != null);
  const mae  = mean(errors.map(Math.abs));
  const rmse = Math.sqrt(mean(errors.map((e) => e * e)));
  const mape = apes.length ? mean(apes) : null;
  const rec = {
    id: `perf_${Date.now()}_${_performanceStore.length}`,
    timestamp: new Date().toISOString(),
    modelId, n: predictions.length,
    mae: round3(mae), rmse: round3(rmse),
    mape: mape == null ? null : round3(mape)
  };
  _performanceStore.push(rec);
  return { ...rec, source: 'SolarGeniusPro performance tracker — MAE/RMSE/MAPE on supplied (prediction, actual) pairs' };
}

// ===========================================================================
// 6. DIGITAL TWIN — lifecycle simulator
// ===========================================================================

/**
 * 25-y lifecycle: degradation + replacements + tariff escalation.
 * input: { systemKw, capexKsh, baseAnnualKwh, tariffKshPerKwh,
 *          degradationPctPerYear?, tariffEscalationPctPerYear?, discountRatePct?,
 *          inverterReplaceYear?, inverterReplaceCostKsh?,
 *          batteryReplaceYear?,  batteryReplaceCostKsh?,
 *          years? }
 */
function lifecycle({ systemKw, capexKsh, baseAnnualKwh, tariffKshPerKwh,
                     degradationPctPerYear = 0.5,
                     tariffEscalationPctPerYear = 3,
                     discountRatePct = 10,
                     inverterReplaceYear = 10, inverterReplaceCostKsh = 0,
                     batteryReplaceYear  = 12, batteryReplaceCostKsh  = 0,
                     years = 25 }) {
  if (!(systemKw > 0))        throw new Error('lifecycle: systemKw required');
  if (!(capexKsh > 0))        throw new Error('lifecycle: capexKsh required');
  if (!(baseAnnualKwh > 0))   throw new Error('lifecycle: baseAnnualKwh required');
  if (!(tariffKshPerKwh > 0)) throw new Error('lifecycle: tariffKshPerKwh required');
  const series = [];
  let cumNpv = -capexKsh, totalKwh = 0;
  for (let y = 1; y <= years; y++) {
    const kwh    = baseAnnualKwh * Math.pow(1 - degradationPctPerYear / 100, y - 1);
    const tariff = tariffKshPerKwh * Math.pow(1 + tariffEscalationPctPerYear / 100, y - 1);
    let cash = kwh * tariff;
    const events = [];
    if (y === inverterReplaceYear && inverterReplaceCostKsh > 0) {
      cash -= inverterReplaceCostKsh;
      events.push({ kind: 'inverter-replace', costKsh: inverterReplaceCostKsh });
    }
    if (y === batteryReplaceYear && batteryReplaceCostKsh > 0) {
      cash -= batteryReplaceCostKsh;
      events.push({ kind: 'battery-replace', costKsh: batteryReplaceCostKsh });
    }
    cumNpv += cash / Math.pow(1 + discountRatePct / 100, y);
    totalKwh += kwh;
    series.push({ year: y, kwh: Math.round(kwh), tariffKshPerKwh: round3(tariff),
      cashKsh: Math.round(cash), cumulativeNpvKsh: Math.round(cumNpv), events });
  }
  return {
    series, totalLifetimeKwh: Math.round(totalKwh),
    finalNpvKsh: Math.round(cumNpv),
    source: 'SolarGeniusPro lifecycle twin — degradation 0.5%/yr (NREL TID), inverter@yr10 + battery@yr12 unless overridden'
  };
}

// ===========================================================================
// 7. MARKET — supplier scoring (no Math.random pricing!)
// ===========================================================================

/**
 * Score a supplier on: price competitiveness, lead time, warranty support,
 * dispute history. Pure deterministic weighted average.
 */
function scoreSupplier({ priceVsMedianPct, leadTimeDays, warrantySupportScore = 0.5,
                          disputeRatePct = 0 }) {
  if (typeof priceVsMedianPct !== 'number') throw new Error('scoreSupplier: priceVsMedianPct required');
  if (typeof leadTimeDays    !== 'number')  throw new Error('scoreSupplier: leadTimeDays required');
  // Lower price (negative %) = better
  const priceScore   = Math.max(0, Math.min(1, 0.5 - priceVsMedianPct / 40));
  const leadScore    = Math.max(0, Math.min(1, 1 - leadTimeDays / 90));
  const disputeScore = Math.max(0, 1 - disputeRatePct / 20);
  const overall = priceScore * 0.35 + leadScore * 0.25
                + warrantySupportScore * 0.20 + disputeScore * 0.20;
  return {
    overall: round3(overall),
    band: overall >= 0.75 ? 'preferred' : overall >= 0.5 ? 'qualified' : 'avoid',
    components: {
      price: round3(priceScore), leadTime: round3(leadScore),
      warranty: warrantySupportScore, dispute: round3(disputeScore)
    },
    source: 'SolarGeniusPro deterministic supplier scorecard — weights: price 35%, lead 25%, warranty 20%, dispute 20%'
  };
}

// ===========================================================================
// EXPORTS
// ===========================================================================

module.exports = {
  // decision
  optimize, recommend, assessRisk, scoreConfidence,
  // simulation
  simulateEnergy, simulateFinancial, simulateLoadBehavior, whatIf,
  // governance
  auditLog, auditQuery, auditStatistics,
  detectBias, detectDrift, explain,
  // pipeline
  cleanData, normalize, validateSolarData,
  // learning
  recordFeedback, trackPerformance,
  // twin
  lifecycle,
  // market
  scoreSupplier
};
