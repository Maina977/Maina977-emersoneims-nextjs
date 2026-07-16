/**
 * ══════════════════════════════════════════════════════════════════════════════
 *  REPORT AUDITOR — 17-STEP AUTHENTICATION GATE
 * ══════════════════════════════════════════════════════════════════════════════
 *
 *  EVERY report must pass ALL 17 checks before it can be downloaded or shared.
 *  If ANY check fails → report is BLOCKED with a clear explanation of what's wrong.
 *
 *  This exists because: misleading reports destroy client trust and can cause
 *  $5,000–$50,000+ drilling decisions based on wrong data. We will never
 *  allow a report with physics violations, missing disclaimers, or fabricated
 *  precision to reach a customer.
 *
 *  Checks are based on:
 *    - WHO 2022 Drinking-water Quality Guidelines
 *    - Budyko (1974) water balance framework
 *    - USDA Soil Taxonomy validation rules
 *    - ISO 5667 (water sampling) display standards
 *    - RWSN (2014) borehole cost/risk conventions
 *    - Professional hydrogeological reporting standards
 *
 *  Author: EMERSON EIMS AquaScan Pro Audit System
 * ══════════════════════════════════════════════════════════════════════════════
 */

import { AnalysisResult } from './types';

export type AuditSeverity = 'FAIL' | 'WARN' | 'PASS';

export interface AuditCheck {
  id: number;
  name: string;
  category: string;
  description: string;
  severity: AuditSeverity;
  details: string;
  fix?: string;
}

export interface AuditReport {
  passed: boolean;
  score: number;            // 0-100
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  checks: AuditCheck[];
  timestamp: string;
  blockedReason?: string;   // if passed=false, why it was blocked
}

/**
 * Run the full 17-step audit on an AnalysisResult BEFORE any report is generated.
 * Returns an AuditReport. If .passed === false, the report MUST NOT be published.
 */
export function auditReport(result: AnalysisResult): AuditReport {
  const checks: AuditCheck[] = [];

  // ═══════════════════════════════════════════════════════════════
  // CHECK 1: WATER BALANCE PHYSICS — ET must be < Precipitation
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditWaterBalance(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 2: SOIL MOISTURE VALIDATION — No all-zeros, physical bounds
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditSoilMoisture(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 3: SCORE-DISPLAY CONSISTENCY — WQ score in correct scale
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditScoreConsistency(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 4: PROBABILITY-RECHARGE COHERENCE — No high prob with 0 recharge
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditProbabilityRechargeCoherence(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 5: AQUIFER PARAMETER PROVENANCE — Estimates labeled as such
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditAquiferProvenance(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 6: UNCERTAINTY RANGES PRESENT — All key metrics have ± bounds
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditUncertaintyPresent(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 7: CROSS-METRIC CONTRADICTION — Risk vs viability, GW vs depletion
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditCrossMetricContradictions(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 8: UNIT & VALUE BOUNDS — All values within physical limits
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditUnitBounds(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 9: DATA SOURCE TRANSPARENCY — Every section cites sources
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditDataSourceTransparency(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 10: DESKTOP ASSESSMENT DISCLAIMER — Present and correct
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditDesktopDisclaimer(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 11: SITE IDENTITY — GPS, coordinates, site ID present
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditSiteIdentity(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 12: SINGLE DECISION POINT — No contradictions in recommendation
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditDrillDecision(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 13: RISK REGISTER — Explicit risk identification
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditRiskRegister(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 14: BANKABLE READINESS — Package completeness
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditBankableReadiness(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 15: DATA PROVENANCE — Every figure must have a source
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditDataProvenance(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 16: ENGINEER TRUST — Trust score and validation status
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditEngineerTrust(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 17: INTEGRITY REGRESSION GUARD — the 2026-07 audit rules,
  // enforced forever (no synthetic wells, no fake field claims,
  // no verified-looking estimated locations)
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditIntegrityRegressions(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 18: CROSS-ENGINE VALUE RECONCILIATION — the executive yield,
  // the well-design (aquifer-limited) yield, and the aquifer-physics
  // transmissivity must agree. This is the export gate the 2026-07-12
  // driller audit demanded: a report may not print 4.9 m³/hr up front
  // while the pump section designs for 0.28 m³/hr.
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditCrossEngineReconciliation(result));

  // ═══════════════════════════════════════════════════════════════
  // CHECK 19: REPORT-WIDE RECONCILIATION MATRIX — arithmetic & range
  // containment the §35 validator demands: every central value must sit
  // inside its stated range; water-point category counts must not exceed
  // the total; the final consensus must track the governing yield/depth.
  // ═══════════════════════════════════════════════════════════════
  checks.push(auditReconciliationMatrix(result));

  // ── SCORING ──
  const failedChecks = checks.filter(c => c.severity === 'FAIL').length;
  const warningChecks = checks.filter(c => c.severity === 'WARN').length;
  const passedChecks = checks.filter(c => c.severity === 'PASS').length;

  // Score: each PASS = 10pts, each WARN = 5pts, each FAIL = 0pts
  const score = Math.round((passedChecks * 10 + warningChecks * 5) / checks.length * 10);

  // BLOCK if ANY check is FAIL
  const passed = failedChecks === 0;
  const blockedReason = passed
    ? undefined
    : `Quality review: ${failedChecks} item${failedChecks > 1 ? 's' : ''} need attention before publishing. ` +
      checks.filter(c => c.severity === 'FAIL').map(c => `[${c.name}] ${c.details}`).join(' | ');

  return {
    passed,
    score,
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    warningChecks,
    checks,
    timestamp: new Date().toISOString(),
    blockedReason,
  };
}


// ══════════════════════════════════════════════════════════════════
// INDIVIDUAL AUDIT CHECKS
// ══════════════════════════════════════════════════════════════════

function auditWaterBalance(result: AnalysisResult): AuditCheck {
  const base = {
    id: 1,
    name: 'Water Balance Physics',
    category: 'PHYSICS',
    description: 'Evapotranspiration must NEVER exceed precipitation (Budyko 1974 constraint)',
  };

  const wb = result.gldasGroundwater?.waterBudget;
  if (!wb) {
    return { ...base, severity: 'WARN', details: 'No water budget data available — cannot verify water balance. Report should note this gap.' };
  }

  const P = wb.precipitation;
  const ET = wb.evapotranspiration;

  if (ET > P) {
    return {
      ...base,
      severity: 'FAIL',
      details: `PHYSICS VIOLATION: ET (${ET} mm/yr) exceeds Precipitation (${P} mm/yr). This is physically impossible for actual ET. The value may be reference ET (Penman-Monteith atmospheric demand) being used without Budyko correction.`,
      fix: 'Apply Budyko framework: actualET = P × budykoRatio where budykoRatio = f(PET/P). ET must always be < P.',
    };
  }

  if (ET > P * 0.98) {
    return {
      ...base,
      severity: 'WARN',
      details: `ET (${ET} mm/yr) is ${((ET/P)*100).toFixed(1)}% of precipitation (${P} mm/yr) — leaves almost no water for recharge or runoff. Verify this is actual ET, not reference ET.`,
    };
  }

  const rechargeFrac = wb.rechargeFraction;
  if (P > 0 && rechargeFrac >= 0 && rechargeFrac <= 1) {
    return { ...base, severity: 'PASS', details: `Water balance valid: P=${P}, ET=${ET} (${((ET/P)*100).toFixed(0)}% of P), Recharge=${wb.estimatedRecharge} mm/yr (${(rechargeFrac*100).toFixed(1)}% of P). ET < P constraint satisfied.` };
  }

  return { ...base, severity: 'PASS', details: `Water balance valid: P=${P} mm/yr, ET=${ET} mm/yr. ET < P constraint satisfied.` };
}


function auditSoilMoisture(result: AnalysisResult): AuditCheck {
  const base = {
    id: 2,
    name: 'Soil Moisture Validation',
    category: 'DATA INTEGRITY',
    description: 'Soil moisture cannot be zero across all depths — physically impossible even in hyperarid deserts',
  };

  const sm = result.gldasGroundwater?.soilMoisture;
  if (!sm) {
    return { ...base, severity: 'WARN', details: 'No GLDAS soil moisture data available. Report should note data gap.' };
  }

  const layers = [sm.layer_0_7cm, sm.layer_7_28cm, sm.layer_28_100cm, sm.layer_100_255cm];
  const allZero = layers.every(v => v === 0 || v < 0.01);

  if (allZero) {
    return {
      ...base,
      severity: 'FAIL',
      details: `ALL soil moisture layers are zero or near-zero: [${layers.map(v => v.toFixed(3)).join(', ')}] kg/m². This is physically impossible — even the Sahara has >0.5 kg/m² at depth. Data pipeline failure detected.`,
      fix: 'Check ERA5-Land API response. Fall back to NASA POWER GWETROOT or use arid-region minimums [1.4, 4.2, 14.4, 31.0] kg/m².',
    };
  }

  // Check for physically unreasonable values
  if (sm.layer_0_7cm > 35 || sm.layer_7_28cm > 110 || sm.layer_28_100cm > 400 || sm.layer_100_255cm > 800) {
    return {
      ...base,
      severity: 'WARN',
      details: `Soil moisture values exceed theoretical saturation capacity for one or more layers: [${layers.map(v => v.toFixed(1)).join(', ')}] kg/m². Verify data quality.`,
    };
  }

  // Check that deeper layers have more total moisture (they hold thicker soil columns)
  if (sm.layer_100_255cm < sm.layer_0_7cm && sm.layer_100_255cm > 0) {
    return {
      ...base,
      severity: 'WARN',
      details: `Deep layer (100-255cm: ${sm.layer_100_255cm} kg/m²) holds less moisture than surface (0-7cm: ${sm.layer_0_7cm} kg/m²). Unusual — verify data unless this is recently irrigated surface.`,
    };
  }

  return { ...base, severity: 'PASS', details: `Soil moisture values valid: [${layers.map(v => v.toFixed(1)).join(', ')}] kg/m². Total column: ${sm.totalColumn} kg/m². Classification: ${sm.classification}.` };
}


function auditScoreConsistency(result: AnalysisResult): AuditCheck {
  const base = {
    id: 3,
    name: 'Score-Display Consistency',
    category: 'DISPLAY',
    description: 'Water quality score must be on 0-1 internal scale, displayed as 0-100. No "0.90/100" errors.',
  };

  const score = result.waterQuality?.score;
  if (score === undefined || score === null) {
    return { ...base, severity: 'WARN', details: 'No water quality score present in result data.' };
  }

  if (score > 1.0) {
    return {
      ...base,
      severity: 'FAIL',
      details: `WQ score is ${score} — exceeds 1.0 internal scale. If displayed as "${score}/100" this is correct, but internal value should be 0-1. Scoring function may have changed scale.`,
      fix: 'Ensure calculateScore() returns 0-1. Display layer multiplies by 100.',
    };
  }

  if (score < 0) {
    return {
      ...base,
      severity: 'FAIL',
      details: `WQ score is ${score} — negative score is impossible.`,
      fix: 'Clamp score to Math.max(0, Math.min(1, score)).',
    };
  }

  // Check if score and potability are consistent
  if (score >= 0.8 && !result.waterQuality.isPotable) {
    // High score but treatment needed — check if individual parameters justify it
    const wq = result.waterQuality;
    const violations = [];
    if (wq.arsenic > 0.01) violations.push(`arsenic=${wq.arsenic}`);
    if (wq.fluoride > 1.5) violations.push(`fluoride=${wq.fluoride}`);
    if (wq.iron > 0.3) violations.push(`iron=${wq.iron}`);
    if (wq.nitrate > 50) violations.push(`nitrate=${wq.nitrate}`);

    if (violations.length === 0) {
      return {
        ...base,
        severity: 'WARN',
        details: `Score ${(score*100).toFixed(0)}/100 is high but isPotable=false. No WHO parameter violations found. Potability flag may be miscalculated.`,
      };
    }
  }

  if (score < 0.5 && result.waterQuality.isPotable) {
    return {
      ...base,
      severity: 'FAIL',
      details: `Score ${(score*100).toFixed(0)}/100 is LOW but isPotable=true. A score below 50 with potable=true is contradictory and misleading.`,
      fix: 'Review isPotable logic — should be false when score < 0.6 or any health-based parameter is exceeded.',
    };
  }

  return { ...base, severity: 'PASS', details: `WQ score ${(score*100).toFixed(0)}/100 (internal: ${score.toFixed(3)}). Potability: ${result.waterQuality.isPotable ? 'POTABLE' : 'TREATMENT NEEDED'}. Score-display alignment verified.` };
}


function auditProbabilityRechargeCoherence(result: AnalysisResult): AuditCheck {
  const base = {
    id: 4,
    name: 'Probability-Recharge Coherence',
    category: 'LOGIC',
    description: 'High success probability with zero recharge is contradictory — cannot find water where none enters the aquifer',
  };

  const prob = result.probability;
  const recharge = result.gldasGroundwater?.waterBudget?.estimatedRecharge;
  const rechargeFrac = result.gldasGroundwater?.waterBudget?.rechargeFraction;

  if (recharge === undefined || recharge === null) {
    if (prob > 0.80) {
      return { ...base, severity: 'WARN', details: `Probability is ${(prob*100).toFixed(0)}% but no recharge data available. High confidence without water budget verification is risky.` };
    }
    return { ...base, severity: 'PASS', details: 'No recharge data available. Probability not making recharge-dependent claims.' };
  }

  // Critical: zero recharge + high probability
  if (recharge <= 0 && prob > 0.60) {
    return {
      ...base,
      severity: 'FAIL',
      details: `CONTRADICTION: Probability=${(prob*100).toFixed(0)}% but recharge=${recharge} mm/yr. Cannot have >60% success probability with zero groundwater recharge.`,
      fix: 'Recalibrate probability using water budget: if rechargeFraction < 3%, apply -20% penalty. If recharge = 0, apply -30% penalty.',
    };
  }

  // Warning: very low recharge + moderate-high probability
  if (rechargeFrac !== undefined && rechargeFrac < 0.03 && prob > 0.70) {
    return {
      ...base,
      severity: 'WARN',
      details: `Probability=${(prob*100).toFixed(0)}% with recharge fraction only ${(rechargeFrac*100).toFixed(1)}% of rainfall. Consider if this optimism is justified. Low recharge means limited aquifer replenishment.`,
    };
  }

  // Check for opposite: low probability but good recharge
  if (rechargeFrac !== undefined && rechargeFrac > 0.15 && prob < 0.30) {
    return {
      ...base,
      severity: 'WARN',
      details: `Probability only ${(prob*100).toFixed(0)}% despite good recharge (${(rechargeFrac*100).toFixed(1)}% of rainfall). Terrain/soil factors may be undervalued, or image quality is poor. Consider widening site evaluation.`,
    };
  }

  return { ...base, severity: 'PASS', details: `Probability ${(prob*100).toFixed(0)}% is coherent with recharge ${recharge} mm/yr (${rechargeFrac !== undefined ? (rechargeFrac*100).toFixed(1) : '?'}% of rainfall). No contradiction detected.` };
}


function auditAquiferProvenance(result: AnalysisResult): AuditCheck {
  const base = {
    id: 5,
    name: 'Aquifer Parameter Provenance',
    category: 'TRANSPARENCY',
    description: 'Aquifer parameters (T, S, K) must be labeled as ESTIMATED if derived from pedotransfer, not measured from pump tests',
  };

  const sim = result.aquiferSimulation;
  if (!sim) {
    return { ...base, severity: 'PASS', details: 'No aquifer simulation present — nothing to label.' };
  }

  const hasAssessmentType = sim.assessmentType && sim.assessmentType.length > 0;
  const hasConfidenceNote = sim.confidenceNote && sim.confidenceNote.length > 0;
  const methodsLabelEstimated = sim.methodology?.some(m =>
    m.toLowerCase().includes('estimate') || m.toLowerCase().includes('desktop') || m.includes('⚠')
  );

  if (!hasAssessmentType && !methodsLabelEstimated) {
    return {
      ...base,
      severity: 'FAIL',
      details: 'Aquifer simulation has transmissivity, storativity, and hydraulic conductivity values but NO disclaimer that these are estimated from soil texture — not from actual pump tests. This misrepresents field measurements.',
      fix: 'Add assessmentType="DESKTOP_ESTIMATE" and confidenceNote explaining parameters are from pedotransfer functions (Saxton-Rawls), not slug/pump tests.',
    };
  }

  if (hasAssessmentType && !hasConfidenceNote) {
    return { ...base, severity: 'WARN', details: 'Assessment type is set but no confidence note explaining the estimation method. Add a note about pedotransfer uncertainty (±30-50%).' };
  }

  return { ...base, severity: 'PASS', details: `Aquifer parameters labeled as "${sim.assessmentType || 'estimated'}". Methodology includes estimation disclaimers. Provenance is transparent.` };
}


function auditUncertaintyPresent(result: AnalysisResult): AuditCheck {
  const base = {
    id: 6,
    name: 'Uncertainty Ranges Present',
    category: 'PRECISION',
    description: 'Every key prediction (depth, yield, probability) MUST have ± uncertainty bounds. Point estimates without ranges are misleading.',
  };

  if (!result.uncertainty) {
    return {
      ...base,
      severity: 'FAIL',
      details: `Report presents depth=${result.recommendedDepth}m, yield=${result.estimatedYield} m³/hr, probability=${(result.probability*100).toFixed(0)}% as point estimates with NO uncertainty ranges. This implies false precision from a desktop assessment.`,
      fix: 'Add uncertainty field: depthRange=[depth×0.6, depth×1.5], yieldRange=[yield×0.4, yield×1.8], probabilityRange=[p-0.20, p+0.15].',
    };
  }

  const u = result.uncertainty;
  const issues: string[] = [];

  if (!u.depthRange || u.depthRange[0] >= u.depthRange[1]) {
    issues.push('Depth range is invalid or zero-width');
  }
  if (!u.yieldRange || u.yieldRange[0] >= u.yieldRange[1]) {
    issues.push('Yield range is invalid or zero-width');
  }
  if (!u.probabilityRange || u.probabilityRange[0] >= u.probabilityRange[1]) {
    issues.push('Probability range is invalid or zero-width');
  }
  if (u.depthConfidence <= 0 || u.depthConfidence > 1) {
    issues.push(`Depth confidence ${u.depthConfidence} is out of 0-1 range`);
  }

  if (issues.length > 0) {
    return {
      ...base,
      severity: 'WARN',
      details: `Uncertainty ranges present but have issues: ${issues.join('; ')}`,
    };
  }

  return {
    ...base,
    severity: 'PASS',
    details: `Uncertainty ranges verified: Depth ${u.depthRange[0]}-${u.depthRange[1]}m (conf: ${(u.depthConfidence*100).toFixed(0)}%), Yield ${u.yieldRange[0]}-${u.yieldRange[1]} m³/hr, Probability ${(u.probabilityRange[0]*100).toFixed(0)}-${(u.probabilityRange[1]*100).toFixed(0)}%.`,
  };
}


function auditCrossMetricContradictions(result: AnalysisResult): AuditCheck {
  const base = {
    id: 7,
    name: 'Cross-Metric Contradiction Check',
    category: 'LOGIC',
    description: 'Related metrics must not contradict each other (e.g., "high GW potential" + "critical depletion" is incoherent)',
  };

  const contradictions: string[] = [];

  // Risk vs viability
  if (result.risk.overallRisk > 0.7 && result.risk.viability === 'high') {
    contradictions.push(`Overall risk ${(result.risk.overallRisk*100).toFixed(0)}% (HIGH) but viability="high" — should be "low" or "not_recommended"`);
  }
  if (result.risk.overallRisk < 0.3 && result.risk.viability === 'not_recommended') {
    contradictions.push(`Overall risk only ${(result.risk.overallRisk*100).toFixed(0)}% (LOW) but viability="not_recommended" — contradictory`);
  }

  // GW potential vs depletion trend
  const gwPotential = result.gldasGroundwater?.groundwaterPotential;
  const trend = result.gldasGroundwater?.graceAnomaly?.trend;
  if (gwPotential && gwPotential > 70 && trend === 'critically-depleting') {
    contradictions.push(`GW potential ${gwPotential}/100 (high) but storage trend is "critically-depleting" — high potential with critical depletion needs explanation`);
  }

  // Depth vs yield coherence: very shallow depth + extremely high yield is unlikely
  if (result.recommendedDepth < 20 && result.estimatedYield > 5) {
    contradictions.push(`Depth only ${result.recommendedDepth}m but yield ${result.estimatedYield} m³/hr — very shallow wells rarely produce >5 m³/hr`);
  }

  // Probability vs risk coherence
  if (result.probability > 0.85 && result.risk.overallRisk > 0.65) {
    contradictions.push(`Probability ${(result.probability*100).toFixed(0)}% (very high) but risk ${(result.risk.overallRisk*100).toFixed(0)}% (high) — if risk is high, probability should be lower`);
  }

  // Historical depletion vs probability
  const depletion = result.historicalData?.groundwater?.depletionRisk;
  if (depletion === 'critical' && result.probability > 0.70) {
    contradictions.push(`Historical groundwater depletion risk is "critical" but probability is ${(result.probability*100).toFixed(0)}% — overly optimistic for a critically depleting aquifer`);
  }

  if (contradictions.length > 0) {
    const severity = contradictions.length >= 2 ? 'FAIL' : 'WARN';
    return {
      ...base,
      severity,
      details: `${contradictions.length} contradiction${contradictions.length > 1 ? 's' : ''} detected: ${contradictions.join(' | ')}`,
      fix: 'Ensure risk model, probability, and GW assessment are cross-calibrated. High risk should lower probability. Critical depletion should lower GW potential.',
    };
  }

  return { ...base, severity: 'PASS', details: 'No cross-metric contradictions detected. Risk, probability, GW potential, depletion trend, and viability are internally consistent.' };
}


function auditUnitBounds(result: AnalysisResult): AuditCheck {
  const base = {
    id: 8,
    name: 'Unit & Value Bounds',
    category: 'DATA INTEGRITY',
    description: 'All values must be within physically possible ranges — no negative depths, impossible pH, or out-of-range scores',
  };

  const violations: string[] = [];

  // Depth: 0-500m reasonable for most boreholes
  if (result.recommendedDepth < 0) violations.push(`Depth ${result.recommendedDepth}m is negative`);
  if (result.recommendedDepth > 500) violations.push(`Depth ${result.recommendedDepth}m exceeds 500m — unusual for water borehole`);

  // Yield: 0-50 m³/hr reasonable
  if (result.estimatedYield < 0) violations.push(`Yield ${result.estimatedYield} m³/hr is negative`);
  if (result.estimatedYield > 50) violations.push(`Yield ${result.estimatedYield} m³/hr exceeds 50 — extraordinary for borehole`);

  // Probability: 0-1
  if (result.probability < 0 || result.probability > 1) violations.push(`Probability ${result.probability} is outside 0-1 range`);

  // pH: 0-14
  const wqPH = result.waterQuality?.pH;
  if (wqPH !== undefined && (wqPH < 0 || wqPH > 14)) violations.push(`Water pH ${wqPH} is outside 0-14 range`);

  const soilPH = result.soil?.pH;
  if (soilPH !== undefined && (soilPH < 0 || soilPH > 14)) violations.push(`Soil pH ${soilPH} is outside 0-14 range`);

  // WQ parameters: non-negative
  const wq = result.waterQuality;
  if (wq) {
    if (wq.tds < 0) violations.push(`TDS ${wq.tds} is negative`);
    if (wq.fluoride < 0) violations.push(`Fluoride ${wq.fluoride} is negative`);
    if (wq.arsenic < 0) violations.push(`Arsenic ${wq.arsenic} is negative`);
    if (wq.iron < 0) violations.push(`Iron ${wq.iron} is negative`);
    if (wq.nitrate < 0) violations.push(`Nitrate ${wq.nitrate} is negative`);
    if (wq.turbidity < 0) violations.push(`Turbidity ${wq.turbidity} is negative`);
    if (wq.hardness < 0) violations.push(`Hardness ${wq.hardness} is negative`);
    // Unreasonably high
    if (wq.tds > 50000) violations.push(`TDS ${wq.tds} mg/L exceeds sea water (35,000) — verify`);
    if (wq.fluoride > 50) violations.push(`Fluoride ${wq.fluoride} mg/L — extremely high, verify`);
    if (wq.arsenic > 1) violations.push(`Arsenic ${wq.arsenic} mg/L — 100× WHO limit, verify`);
  }

  // Porosity: 0-1
  if (result.soil?.porosity < 0 || result.soil?.porosity > 1) {
    violations.push(`Soil porosity ${result.soil.porosity} is outside 0-1 range`);
  }

  // Risk: 0-1
  if (result.risk?.overallRisk < 0 || result.risk?.overallRisk > 1) {
    violations.push(`Overall risk ${result.risk.overallRisk} is outside 0-1 range`);
  }

  if (violations.length > 0) {
    return {
      ...base,
      severity: violations.some(v => v.includes('negative') || v.includes('outside')) ? 'FAIL' : 'WARN',
      details: `${violations.length} bounds violation${violations.length > 1 ? 's' : ''}: ${violations.join('; ')}`,
      fix: 'Clamp all values to physically valid ranges before report generation.',
    };
  }

  return { ...base, severity: 'PASS', details: 'All values within physically valid ranges. Depth, yield, probability, pH, WQ parameters, porosity, and risk scores verified.' };
}


function auditDataSourceTransparency(result: AnalysisResult): AuditCheck {
  const base = {
    id: 9,
    name: 'Data Source Transparency',
    category: 'TRANSPARENCY',
    description: 'Every data section must cite its source API/method. Unattributed claims erode trust.',
  };

  const missing: string[] = [];

  if (!result.soil?.dataSource) missing.push('Soil analysis missing dataSource');
  if (!result.waterQuality?.dataSource) missing.push('Water quality missing dataSource');
  if (result.gldasGroundwater) {
    if (!result.gldasGroundwater.soilMoisture?.dataSource) missing.push('GLDAS soil moisture missing dataSource');
    if (!result.gldasGroundwater.waterBudget?.dataSource) missing.push('Water budget missing dataSource');
    if (!result.gldasGroundwater.graceAnomaly?.dataSource) missing.push('GRACE anomaly missing dataSource');
  }
  if (result.subsurfaceModel && !result.subsurfaceModel.dataSourceSummary) missing.push('Subsurface model missing dataSourceSummary');
  if (result.historicalData && !result.historicalData.fetchedAt) missing.push('Historical data missing fetchedAt timestamp');

  if (missing.length >= 3) {
    return {
      ...base,
      severity: 'FAIL',
      details: `${missing.length} sections have no data source attribution: ${missing.join('; ')}. Report cannot be published without source transparency.`,
      fix: 'Ensure every analysis module sets a dataSource field citing the API (e.g., "ISRIC SoilGrids v2.0", "NASA POWER API", "ERA5-Land ECMWF").',
    };
  }

  if (missing.length > 0) {
    return {
      ...base,
      severity: 'WARN',
      details: `${missing.length} section${missing.length > 1 ? 's' : ''} missing data source: ${missing.join('; ')}. Consider adding for full transparency.`,
    };
  }

  return { ...base, severity: 'PASS', details: 'All data sections have source attribution. Soil, WQ, GLDAS, subsurface model, and historical data sources verified.' };
}


function auditDesktopDisclaimer(result: AnalysisResult): AuditCheck {
  const base = {
    id: 10,
    name: 'Desktop Assessment Disclaimer',
    category: 'COMPLIANCE',
    description: 'Report MUST declare assessment methodology and data basis. Required for professional and scientific credibility.',
  };

  if (!result.assessmentType) {
    return {
      ...base,
      severity: 'FAIL',
      details: 'No assessmentType field. Report does not declare whether results are from desktop estimation or field validation. This creates liability — recipients may assume field data was collected.',
      fix: 'Set assessmentType="DESKTOP_ESTIMATE" and add assessmentDisclaimer text explaining no field measurements were taken.',
    };
  }

  if (result.assessmentType === 'FIELD_VALIDATED' && !result.assessmentDisclaimer?.includes('field')) {
    return {
      ...base,
      severity: 'WARN',
      details: 'Assessment type is FIELD_VALIDATED but disclaimer doesn\'t mention field validation details. Specify what was validated in the field.',
    };
  }

  if (result.assessmentType === 'DESKTOP_ESTIMATE' && !result.assessmentDisclaimer) {
    return {
      ...base,
      severity: 'FAIL',
      details: 'Assessment type is DESKTOP_ESTIMATE but no disclaimer text provided. Report needs explicit text stating "no field measurements conducted" and "pre-feasibility only".',
      fix: 'Add assessmentDisclaimer with methodology description: data sources used, physics models applied, and confidence tier. Professional hydrogeological review recommended for capital investment.',
    };
  }

  if (result.assessmentDisclaimer && result.assessmentDisclaimer.length < 50) {
    return {
      ...base,
      severity: 'WARN',
      details: `Disclaimer is present but very short (${result.assessmentDisclaimer.length} chars). Should clearly state: no field data, desktop only, pre-feasibility, field validation recommended.`,
    };
  }

  return { ...base, severity: 'PASS', details: `Assessment type: ${result.assessmentType}. Disclaimer present (${result.assessmentDisclaimer?.length || 0} chars). Desktop assessment declaration verified.` };
}

// ═══════════════════════════════════════════════════════════════
// BANKABLE REPORT INTEGRITY CHECKS (11-14)
// ═══════════════════════════════════════════════════════════════

function auditSiteIdentity(result: AnalysisResult): AuditCheck {
  const base = {
    id: 11,
    name: 'Site Identity Verification',
    category: 'BANKABLE',
    description: 'GPS coordinates, site ID, elevation, and coordinate system must be present and consistent.',
  };

  const si = result.siteIdentity;
  if (!si) {
    return { ...base, severity: 'WARN', details: 'No site identity block. Bankable reports require verified GPS, site ID, and datum.' };
  }

  if (si.coordinates.lat === 0 && si.coordinates.lon === 0) {
    return { ...base, severity: 'WARN', details: 'Site coordinates are 0,0 (null island). GPS data missing or not provided.' };
  }

  if (si.locationConfidenceGrade === 'F') {
    return { ...base, severity: 'WARN', details: 'Location confidence grade F. Field GPS verification required for bankable grade.' };
  }

  return { ...base, severity: 'PASS', details: `Site ${si.siteId}: ${si.coordinates.lat.toFixed(4)}, ${si.coordinates.lon.toFixed(4)} (${si.coordinates.datum}). Elevation: ${si.elevation_masl}m. Grade: ${si.locationConfidenceGrade}.` };
}

function auditDrillDecision(result: AnalysisResult): AuditCheck {
  const base = {
    id: 12,
    name: 'Single Decision Point',
    category: 'BANKABLE',
    description: 'Report must have one clear drilling recommendation with no contradictions.',
  };

  const dd = result.drillDecision;
  if (!dd) {
    return { ...base, severity: 'WARN', details: 'No primary drilling recommendation. Bankable reports require a single, clear decision point.' };
  }

  if (dd.targetDepth_m <= 0 || dd.expectedYield_m3hr <= 0) {
    return { ...base, severity: 'WARN', details: 'Drill decision has zero depth or yield. Cannot make a valid recommendation.' };
  }

  // Check for internal contradictions
  if (dd.successProbability < 30 && dd.expectedYield_m3hr > 5) {
    return { ...base, severity: 'WARN', details: `Contradiction: ${dd.successProbability}% success but ${dd.expectedYield_m3hr} m3/hr yield. High yield prediction conflicts with low success probability.` };
  }

  return { ...base, severity: 'PASS', details: `Primary point: ${dd.primaryPoint.lat.toFixed(4)}, ${dd.primaryPoint.lon.toFixed(4)}. Depth: ${dd.targetDepth_m}m. Yield: ${dd.expectedYield_m3hr} m3/hr. Success: ${dd.successProbability}%.` };
}

function auditRiskRegister(result: AnalysisResult): AuditCheck {
  const base = {
    id: 13,
    name: 'Risk Register',
    category: 'BANKABLE',
    description: 'Explicit risk identification with likelihood, impact, and mitigation for each threat.',
  };

  if (!result.riskRegister?.length) {
    return { ...base, severity: 'WARN', details: 'No risk register. Bankable reports require explicit risk identification and mitigation strategies.' };
  }

  if (result.riskRegister.length < 3) {
    return { ...base, severity: 'WARN', details: `Only ${result.riskRegister.length} risks identified. Minimum 3 risks expected for comprehensive assessment.` };
  }

  return { ...base, severity: 'PASS', details: `${result.riskRegister.length} risks identified with likelihood/impact/mitigation. Categories: ${[...new Set(result.riskRegister.map(r => r.category))].join(', ')}.` };
}

function auditBankableReadiness(result: AnalysisResult): AuditCheck {
  const base = {
    id: 14,
    name: 'Bankable Readiness',
    category: 'BANKABLE',
    description: 'Comprehensive package completeness for bankable-grade reporting.',
  };

  if (!result.bankableChecklist?.length) {
    return { ...base, severity: 'WARN', details: 'No bankable checklist generated. Cannot assess package completeness.' };
  }

  const total = result.bankableChecklist.length;
  const present = result.bankableChecklist.filter(c => c.status === 'PRESENT').length;
  const partial = result.bankableChecklist.filter(c => c.status === 'PARTIAL').length;
  const requiredMissing = result.bankableChecklist.filter(c => c.requiredForBankable && (c.status === 'MISSING' || c.status === 'PLANNED')).length;
  const pct = Math.round(((present + partial * 0.5) / total) * 100);

  if (requiredMissing > 0) {
    const missing = result.bankableChecklist.filter(c => c.requiredForBankable && (c.status === 'MISSING' || c.status === 'PLANNED')).map(c => c.item);
    return { ...base, severity: 'WARN', details: `${present}/${total} items present, ${partial} partial (${pct}%). Missing/planned required: ${missing.join(', ')}.` };
  }

  return { ...base, severity: 'PASS', details: `${present}/${total} bankable items present, ${partial} partial (${pct}%). All required items satisfied.` };
}

function auditDataProvenance(result: AnalysisResult): AuditCheck {
  const base = {
    id: 15,
    name: 'Data Provenance',
    category: 'TRUST',
    description: 'Every prediction must be tagged with source, method, accuracy tier, and confidence interval.',
  };

  const ec = result.engineerConfidence;
  if (!ec?.provenance) {
    return { ...base, severity: 'WARN', details: 'Engineer confidence engine did not run. Data provenance unavailable.' };
  }

  const p = ec.provenance;
  const inferredPct = ((p.inferredCount + p.defaultCount) / p.items.length) * 100;
  if (inferredPct > 60) {
    return { ...base, severity: 'WARN', details: `${inferredPct.toFixed(0)}% of parameters are INFERRED/DEFAULT. Field data (ERT/pump test) required to improve accuracy.` };
  }

  if (p.overallAccuracy_pct < 50) {
    return { ...base, severity: 'WARN', details: `Overall data accuracy ${p.overallAccuracy_pct}% is below 50% threshold. ${p.items.length} parameters tracked across ${p.measuredCount} measured, ${p.calibratedCount} calibrated, ${p.estimatedCount} estimated, ${p.inferredCount} inferred.` };
  }

  return { ...base, severity: 'PASS', details: `${p.items.length} parameters with provenance. Accuracy: ${p.overallAccuracy_pct}%. ${p.measuredCount} MEASURED, ${p.calibratedCount} CALIBRATED, ${p.estimatedCount} ESTIMATED. Report grade: ${p.reportGrade}.` };
}

function auditEngineerTrust(result: AnalysisResult): AuditCheck {
  const base = {
    id: 16,
    name: 'Engineer Trust Score',
    category: 'TRUST',
    description: 'Overall engineer confidence assessment: data quality + physics rigor + validation + transparency.',
  };

  const ec = result.engineerConfidence;
  if (!ec) {
    return { ...base, severity: 'WARN', details: 'Engineer confidence engine did not produce results.' };
  }

  if (ec.engineerTrustScore < 35) {
    return { ...base, severity: 'WARN', details: `Trust score ${ec.engineerTrustScore}/100 (Grade ${ec.trustGrade}). Score is below minimum threshold. Data quality: ${ec.trustBreakdown.dataQuality}/25, Validation: ${ec.trustBreakdown.validation}/25.` };
  }

  return { ...base, severity: 'PASS', details: `Trust score ${ec.engineerTrustScore}/100 (Grade ${ec.trustGrade}). Data: ${ec.trustBreakdown.dataQuality}/25, Physics: ${ec.trustBreakdown.physicsRigor}/25, Validation: ${ec.trustBreakdown.validation}/25, Transparency: ${ec.trustBreakdown.transparency}/25. Verdict: ${ec.crossValidation.engineerVerdict}.` };
}

// ═══════════════════════════════════════════════════════════════
// CHECK 17 — INTEGRITY REGRESSION GUARD (B8)
// ═══════════════════════════════════════════════════════════════
// The 2026-07 accuracy audits fixed a family of "confidence theatre"
// defects. Report-layer rules (one economics model, one verdict,
// regional pre-screening locks) live in reportGenerator; every rule
// that is testable on the DATA is asserted here so it can never
// silently regress. Any hit is a FAIL — the report is blocked.
function auditIntegrityRegressions(result: AnalysisResult): AuditCheck {
  const base = {
    id: 17,
    name: 'Integrity Regression Guard',
    category: 'INTEGRITY',
    description: 'Enforces the 2026-07 audit rules: no synthetic wells, no fabricated well statistics, no field-validation claims without field data, no verified-grade location on an estimated GPS.',
  };

  const r = result as any;
  const violations: string[] = [];

  // RULE 1 — NO SYNTHETIC WELLS (commit 29657fd). Fabricated SYN-* records
  // or any well whose source admits being synthetic/estimated must never
  // reach a customer again.
  const wells: any[] = r.nearbyWells?.nearbyWells ?? [];
  const synthetic = wells.filter((w) =>
    /^SYN-/i.test(String(w?.id ?? '')) ||
    /synthetic|fabricated|simulated well/i.test(String(w?.source ?? '')));
  if (synthetic.length > 0) {
    violations.push(`${synthetic.length} synthetic well record(s) present (e.g. "${synthetic[0].id}") — the no-synthetic-wells policy forbids fabricated evidence`);
  }

  // RULE 2 — NO FABRICATED WELL STATISTICS. An empty registry result must
  // stay empty: sampleSize 0 with a non-zero average depth (or vice versa)
  // means someone reintroduced invented statistics.
  const nw = r.nearbyWells;
  if (nw) {
    if ((nw.sampleSize ?? 0) === 0 && ((nw.averageDepth ?? 0) > 0 || (nw.averageYield ?? 0) > 0)) {
      violations.push(`nearbyWells reports sampleSize 0 but averageDepth=${nw.averageDepth}/averageYield=${nw.averageYield} — statistics without records are fabricated`);
    }
    if ((nw.sampleSize ?? 0) > 0 && wells.length === 0) {
      violations.push(`nearbyWells claims sampleSize=${nw.sampleSize} but carries zero well records`);
    }
  }

  // RULE 3 — REGISTRY WELL SANITY BOUNDS (Kenya boreholes 1–400 m; guard at
  // 0–500 m / 100 m³/h). Junk registry rows (3,000 m "hand dams") must be
  // filtered at import, never printed or plotted.
  const junk = wells.filter((w) =>
    (w?.depth_m ?? 0) < 0 || (w?.depth_m ?? 0) > 500 || (w?.yield_m3h ?? 0) > 100);
  if (junk.length > 0) {
    violations.push(`${junk.length} well record(s) outside physical bounds (depth 0–500 m, yield ≤100 m³/h) — import sanity filter regressed`);
  }

  // RULE 4 — NO FIELD-VALIDATION CLAIM WITHOUT FIELD DATA (commit f35cdad).
  // "COMPLETED ERT / calibrated from pump test" on desktop-only runs was the
  // core defect of the July audit.
  if (result.assessmentType === 'FIELD_VALIDATED' && !r.fieldData && !r.fieldValidation) {
    violations.push('assessmentType is FIELD_VALIDATED but no fieldData/fieldValidation object exists — field work is being claimed without field measurements');
  }

  // RULE 5 — ESTIMATED GPS CANNOT WEAR A VERIFIED GRADE. A visual/none GPS
  // source is a ±50 km regional estimate; grading it A/B re-creates the
  // "VERIFIED SITE IDENTITY at 6 decimals" defect.
  const gpsSource = String(r.gpsSource ?? 'none');
  const grade = String(r.locationConfidence?.grade ?? r.siteIdentity?.locationConfidenceGrade ?? '');
  if (!['exif', 'manual', 'device'].includes(gpsSource) && ['A', 'B'].includes(grade)) {
    violations.push(`gpsSource "${gpsSource}" (estimated location) carries location grade ${grade} — estimated positions must grade C or below`);
  }

  // RULE 6 — KENYA PRIOR MUST STAY LABELLED AS A MODEL. The county prior is
  // published literature (reliability 0.65), never field evidence.
  if (r.kenyaHydroPrior && /field|measured/i.test(String(r.kenyaHydroPrior.dataSource ?? r.kenyaHydroPrior.source ?? ''))) {
    violations.push('kenyaHydroPrior presents itself as field/measured data — it is a literature-based county prior and must say so');
  }

  if (violations.length > 0) {
    return {
      ...base,
      severity: 'FAIL',
      details: `${violations.length} integrity regression${violations.length > 1 ? 's' : ''} detected: ${violations.join(' | ')}`,
      fix: 'These rules were established by the 2026-07 accuracy audits (docs/AQUASCAN-ACCURACY-AUDIT-2026-07.md). Fix the offending engine module — do not weaken this check.',
    };
  }

  return {
    ...base,
    severity: 'PASS',
    details: `All integrity rules hold: ${wells.length} well record(s) all verified-source and within physical bounds; field-validation claims ${r.fieldData || r.fieldValidation ? 'backed by field data' : 'absent (desktop run, honestly labelled)'}; location grade consistent with GPS source (${gpsSource}${grade ? ` → grade ${grade}` : ''}).`,
  };
}

// ═══════════════════════════════════════════════════════════════
// CHECK 18 — CROSS-ENGINE VALUE RECONCILIATION (2026-07-12 driller audit)
// ═══════════════════════════════════════════════════════════════
// The surgical driller audit rejected a report that advertised 4.9 m³/hr in the
// executive summary while the pump/well-design section designed for 0.28 m³/hr
// (aquifer-limited). Root cause: the well-design engine independently caps the
// yield to what the modelled transmissivity can sustain, but that capped value is
// never propagated back to the governing result. Until the governing yield is
// reconciled at source, a report whose sections disagree by more than ~1.6× MUST
// NOT export. Same rule for transmissivity across engines (aquifer sim vs
// advanced-geophysics/provenance differing by orders of magnitude).
function auditCrossEngineReconciliation(result: AnalysisResult): AuditCheck {
  const base = {
    id: 18,
    name: 'Cross-Engine Value Reconciliation',
    category: 'INTEGRITY',
    description: 'Executive yield, well-design (aquifer-limited) yield and transmissivity must agree across engines — no 4.9-vs-0.28 split.',
  };

  const r = result as any;
  const violations: string[] = [];

  // ── YIELD: governing (executive/decision) vs well-design design rate ──
  const govYield = Number(
    r.drillDecision?.expectedYield_m3hr ?? r.estimatedYield ?? NaN,
  );
  const designYield = Number(r.wellDesign?.drawdown?.designPumpingRate_m3hr ?? NaN);
  if (Number.isFinite(govYield) && Number.isFinite(designYield) && govYield > 0 && designYield > 0) {
    const ratio = Math.max(govYield, designYield) / Math.min(govYield, designYield);
    if (ratio > 1.6) {
      violations.push(
        `Executive yield ${govYield.toFixed(1)} m³/hr contradicts the well-design/pump rate ${designYield.toFixed(2)} m³/hr (${ratio.toFixed(1)}× apart). ` +
        `The aquifer-limited design rate must become the ONE governing yield fed to the executive, costs, pump and revenue — the report may not advertise a yield the borehole cannot sustain.`,
      );
    }
  }

  // ── TRANSMISSIVITY: aquifer simulation vs any second engine estimate ──
  const tAquiferSim = Number(
    r.aquiferSimulation?.transmissivityM2Day ?? r.aquiferSimulation?.transmissivity_m2day ?? NaN,
  );
  const tOther = Number(
    r.wellDesign?.drawdown?.transmissivity_m2day ??
    r.advancedGeophysics?.transmissivity_m2day ??
    NaN,
  );
  if (Number.isFinite(tAquiferSim) && Number.isFinite(tOther) && tAquiferSim > 0 && tOther > 0) {
    const tRatio = Math.max(tAquiferSim, tOther) / Math.min(tAquiferSim, tOther);
    if (tRatio > 10) {
      violations.push(
        `Transmissivity disagrees across engines: aquifer simulation ${tAquiferSim.toFixed(2)} m²/day vs ${tOther.toFixed(2)} m²/day (${Math.round(tRatio)}× apart). ` +
        `One governing T/K model must feed sustainable yield, drawdown and specific capacity.`,
      );
    }
  }

  // ── GOVERNING SUCCESS PROBABILITY must be a sane, single value (catches the
  //    "1%" provenance-matrix display bug leaking into the decision) ──
  const govProb = Number(r.probability ?? NaN);
  if (Number.isFinite(govProb) && (govProb < 0.05 || govProb > 1)) {
    violations.push(
      `Governing success probability is ${(govProb * 100).toFixed(0)}% — outside the sane 5–100% band. A sub-model/display value has leaked into the governing result.`,
    );
  }

  if (violations.length > 0) {
    return {
      ...base,
      severity: 'FAIL',
      details: `${violations.length} cross-engine contradiction${violations.length > 1 ? 's' : ''} — report blocked until reconciled: ${violations.join(' | ')}`,
      fix: 'Reconcile at source in boreholeAnalyzer: derive ONE governing yield from the aquifer-limited design rate (wellDesignEngine) and feed it to estimatedYield/drillDecision; reconcile transmissivity to a single basement-consistent value. Do not weaken this gate.',
    };
  }

  return {
    ...base,
    severity: 'PASS',
    details: `Cross-engine values reconciled: ` +
      (Number.isFinite(govYield) && Number.isFinite(designYield)
        ? `yield ${govYield.toFixed(1)} vs design ${designYield.toFixed(2)} m³/hr within tolerance; `
        : 'yield comparison not applicable; ') +
      `governing success probability ${Number.isFinite(govProb) ? (govProb * 100).toFixed(0) + '%' : 'n/a'}.`,
  };
}

// ═══════════════════════════════════════════════════════════════
// CHECK 19 — REPORT-WIDE RECONCILIATION MATRIX (§35 acceptance rules)
// ═══════════════════════════════════════════════════════════════
// Enforces the arithmetic/range invariants the surgical spec requires as
// blocking rules. Each is checked ONLY when the underlying data exists, so a
// desktop run with missing sub-objects is not penalised — but a genuine
// contradiction (central value outside its range, category counts exceeding the
// total, consensus disagreeing with the governing value) blocks export.
function auditReconciliationMatrix(result: AnalysisResult): AuditCheck {
  const base = {
    id: 19,
    name: 'Report-Wide Reconciliation Matrix',
    category: 'INTEGRITY',
    description: 'Central values must sit inside their stated ranges; water-point category counts must reconcile to the total; the final consensus must track the governing yield/depth.',
  };

  const r = result as any;
  const violations: string[] = [];
  const passes: string[] = [];
  const near = (a: number, b: number, tol = 0.02) => Math.abs(a - b) <= Math.max(tol, Math.abs(b) * tol);

  // ── RULE 19.1-3 — RANGE CONTAINMENT: prob / depth / yield ──
  const u = r.uncertainty;
  if (u) {
    const p = Number(r.probability);
    if (Array.isArray(u.probabilityRange) && Number.isFinite(p)) {
      const [lo, hi] = u.probabilityRange.map(Number);
      // allow a 1-pt rounding slack
      if (p < lo - 0.01 || p > hi + 0.01) violations.push(`Success probability ${(p * 100).toFixed(0)}% falls outside its stated range ${(lo * 100).toFixed(0)}-${(hi * 100).toFixed(0)}%`);
      else passes.push('prob-in-range');
    }
    const d = Number(r.recommendedDepth);
    if (Array.isArray(u.depthRange) && Number.isFinite(d)) {
      const [lo, hi] = u.depthRange.map(Number);
      if (d < lo - 1 || d > hi + 1) violations.push(`Recommended depth ${d}m falls outside its stated range ${lo}-${hi}m`);
      else passes.push('depth-in-range');
    }
    const yv = Number(r.estimatedYield);
    if (Array.isArray(u.yieldRange) && Number.isFinite(yv)) {
      const [lo, hi] = u.yieldRange.map(Number);
      if (yv < lo - 0.05 || yv > hi + 0.05) violations.push(`Expected yield ${yv} m³/hr falls outside its stated range ${lo}-${hi} m³/hr`);
      else passes.push('yield-in-range');
    }
  }

  // ── RULE 19.4 — WATER-POINT ARITHMETIC: classified records must not exceed
  //    the reported total; status counts must not exceed records-with-status. ──
  const nw = r.nearbyWells;
  const wells: any[] = nw?.nearbyWells ?? [];
  if (nw && Number.isFinite(nw.sampleSize)) {
    const total = Number(nw.sampleSize);
    if (wells.length > total + 0) violations.push(`Water-point records displayed (${wells.length}) exceed the reported total (${total})`);
    else passes.push('waterpoint-total');
    const withStatus = wells.filter((w) => w?.outcome === 'Success' || w?.outcome === 'Fail').length;
    const functional = wells.filter((w) => w?.outcome === 'Success').length;
    if (functional > withStatus) violations.push(`Functional count (${functional}) exceeds records with recorded status (${withStatus})`);
    else if (withStatus > 0) passes.push('waterpoint-status');
  }

  // ── RULE 19.5 — FINAL CONSENSUS tracks the governing yield/depth (the single
  //    source of truth must not fork a second "consensus" number). ──
  const fc = r.finalConsensus;
  if (fc) {
    const gY = Number(r.estimatedYield);
    if (Number.isFinite(fc.yield_m3hr) && Number.isFinite(gY) && gY > 0) {
      const ratio = Math.max(fc.yield_m3hr, gY) / Math.min(fc.yield_m3hr, gY);
      if (ratio > 1.6) violations.push(`Final-consensus yield ${fc.yield_m3hr} m³/hr diverges from governing yield ${gY} m³/hr (${ratio.toFixed(1)}× apart)`);
      else passes.push('consensus-yield');
    }
    const gD = Number(r.recommendedDepth);
    if (Number.isFinite(fc.depth_m) && Number.isFinite(gD) && gD > 0 && !near(fc.depth_m, gD, 0.25)) {
      violations.push(`Final-consensus depth ${fc.depth_m}m diverges >25% from governing depth ${gD}m`);
    } else if (Number.isFinite(fc.depth_m)) passes.push('consensus-depth');
  }

  // ── RULE 19.6 — CONFIDENCE MUST NOT MASQUERADE AS DRILL-READINESS: a desktop
  //    run must never present a DRILL-READY / bankable grade without field data. ──
  const grade = String(r.finalConsensus?.assessmentGrade ?? '');
  const hasFieldERT = !!r._auditFlags?.hasFieldERT || !!r.fieldData?.ert;
  if (/BANKABLE/i.test(grade) && !hasFieldERT) {
    violations.push(`Assessment grade "${grade}" claims bankable without any field ERT/pump data — desktop runs cap at PRE-FEASIBILITY`);
  }

  if (violations.length > 0) {
    return {
      ...base,
      severity: 'FAIL',
      details: `${violations.length} reconciliation failure${violations.length > 1 ? 's' : ''} — report blocked: ${violations.join(' | ')}`,
      fix: 'Feed one governing object to every section: central values must lie inside their ranges, water-point counts must reconcile to the total, and finalConsensus must equal the governing yield/depth. Do not weaken this gate.',
    };
  }

  return {
    ...base,
    severity: 'PASS',
    details: `Reconciliation matrix passed (${passes.length} invariant${passes.length === 1 ? '' : 's'} checked: ${passes.join(', ') || 'none applicable on this dataset'}).`,
  };
}
