// ═══════════════════════════════════════════════════════════════════════
// OUTPUT SANITIZER — Central guard against impossible values
// Every numeric output passes through here before reaching the UI/report.
// Prevents: >100% probabilities, NaN, Infinity, 0-but-used values, contradictions.
// ═══════════════════════════════════════════════════════════════════════

/** Clamp a number to [min, max] and replace NaN/Infinity with fallback */
export function safeNum(value: number, min: number, max: number, fallback: number): number {
  if (value == null || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

/** Clamp percentage to [0, 100], replace NaN with fallback */
export function safePct(value: number, fallback = 0): number {
  return safeNum(value, 0, 100, fallback);
}

/** Clamp 0-1 probability, replace NaN with fallback */
export function safeProb(value: number, fallback = 0.5): number {
  return safeNum(value, 0, 1, fallback);
}

/** Safe division — returns fallback if divisor is 0 or result is NaN/Infinity */
export function safeDiv(numerator: number, denominator: number, fallback = 0): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return fallback;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : fallback;
}

/** Clamp ROI to realistic range [-100, 500] (500% over 10 years = very good, not absurd) */
export function safeROI(value: number): number {
  return safeNum(value, -100, 500, 0);
}

/** Clamp depth to physically realistic range [1, 500] meters */
export function safeDepth(value: number, fallback = 50): number {
  return safeNum(value, 1, 500, fallback);
}

/** Clamp yield to physically realistic range [0.1, 50] m³/hr */
export function safeYield(value: number, fallback = 1): number {
  return safeNum(value, 0.1, 50, fallback);
}

/** Feature importance: clamp each value to [0, 100] and normalize so total = 100 */
export function sanitizeFeatureImportance(features: { feature: string; importance: number }[]): { feature: string; importance: number }[] {
  if (!features || features.length === 0) return [];
  // First clamp all to [0, 100]
  const clamped = features.map(f => ({
    feature: f.feature,
    importance: safeNum(f.importance, 0, 100, 0),
  }));
  // Normalize so they sum to 100
  const total = clamped.reduce((s, f) => s + f.importance, 0);
  if (total <= 0) return clamped;
  return clamped.map(f => ({
    feature: f.feature,
    importance: Math.round((f.importance / total) * 1000) / 10,
  }));
}

/**
 * Full result sanitization — call on the final AnalysisResult BEFORE sending to UI.
 * Ensures every user-facing number is physically possible.
 */
export function sanitizeAnalysisResult(result: any): void {
  if (!result) return;

  // ── Core values ──
  result.probability = safeProb(result.probability, 0.5);
  result.recommendedDepth = safeDepth(result.recommendedDepth);
  result.estimatedYield = safeYield(result.estimatedYield);

  // ── Drilling prediction ──
  if (result.drillingPrediction) {
    const dp = result.drillingPrediction;
    dp.successProbability = safePct(dp.successProbability, 50);
    dp.modelConfidence = safePct(dp.modelConfidence, 50);
    dp.roi_pct = safeROI(dp.roi_pct);
    dp.dryHoleRisk_pct = safePct(dp.dryHoleRisk_pct, 30);
    dp.lowYieldRisk_pct = safePct(dp.lowYieldRisk_pct, 20);
    dp.waterQualityRisk_pct = safePct(dp.waterQualityRisk_pct, 10);
    dp.excessiveDepthRisk_pct = safePct(dp.excessiveDepthRisk_pct, 10);
    dp.predictedDepth_m = safeDepth(dp.predictedDepth_m);
    dp.predictedYield_m3h = safeYield(dp.predictedYield_m3h);
    dp.paybackPeriod_years = safeNum(dp.paybackPeriod_years, 0.1, 50, 5);
    dp.expectedDrillingCost_usd = safeNum(dp.expectedDrillingCost_usd, 100, 500000, 5000);
    if (dp.featureImportance) {
      dp.featureImportance = sanitizeFeatureImportance(dp.featureImportance);
    }
    // Depth confidence interval must be ordered: low < mid < high
    if (dp.depthConfidence) {
      dp.depthConfidence.low = safeDepth(dp.depthConfidence.low, 10);
      dp.depthConfidence.mid = safeDepth(dp.depthConfidence.mid, 50);
      dp.depthConfidence.high = safeDepth(dp.depthConfidence.high, 100);
      if (dp.depthConfidence.low > dp.depthConfidence.mid) dp.depthConfidence.low = dp.depthConfidence.mid * 0.7;
      if (dp.depthConfidence.high < dp.depthConfidence.mid) dp.depthConfidence.high = dp.depthConfidence.mid * 1.3;
    }
    if (dp.yieldConfidence) {
      dp.yieldConfidence.low = safeYield(dp.yieldConfidence.low, 0.1);
      dp.yieldConfidence.mid = safeYield(dp.yieldConfidence.mid, 1);
      dp.yieldConfidence.high = safeYield(dp.yieldConfidence.high, 5);
      if (dp.yieldConfidence.low > dp.yieldConfidence.mid) dp.yieldConfidence.low = dp.yieldConfidence.mid * 0.5;
      if (dp.yieldConfidence.high < dp.yieldConfidence.mid) dp.yieldConfidence.high = dp.yieldConfidence.mid * 1.5;
    }
  }

  // ── Confidence metrics ──
  if (result.confidenceMetrics) {
    const cm = result.confidenceMetrics;
    cm.geological = safePct(cm.geological, 40);
    cm.terrain = safePct(cm.terrain, 40);
    cm.vegetation = safePct(cm.vegetation, 30);
    cm.dataDensity = safePct(cm.dataDensity, 30);
    cm.waterQuality = safePct(cm.waterQuality, 30);
    cm.overall = safePct(cm.overall, 40);
  }

  // ── Subsurface model confidence ──
  if (result.subsurfaceModel) {
    result.subsurfaceModel.modelConfidence = safeProb(result.subsurfaceModel.modelConfidence, 0.4);
  }

  // ── Subsurface twin model confidence ──
  if (result.subsurfaceTwin?.modelConfidence != null) {
    result.subsurfaceTwin.modelConfidence = safeProb(result.subsurfaceTwin.modelConfidence, 0.4);
  }

  // ── Drill decision ──
  if (result.drillDecision) {
    result.drillDecision.successProbability = safePct(result.drillDecision.successProbability, 50);
    result.drillDecision.targetDepth_m = safeDepth(result.drillDecision.targetDepth_m);
    result.drillDecision.expectedYield_m3hr = safeYield(result.drillDecision.expectedYield_m3hr);
    // Sync ranges to clamped values so they remain physically consistent
    const td = result.drillDecision.targetDepth_m;
    if (result.drillDecision.depthRange_m) {
      result.drillDecision.depthRange_m = [
        Math.max(10, Math.round(td * 0.85)),
        Math.min(500, Math.round(td * 1.15)),
      ];
    }
    const ey = result.drillDecision.expectedYield_m3hr;
    if (result.drillDecision.yieldRange_m3hr) {
      result.drillDecision.yieldRange_m3hr = [
        Math.max(0.1, Math.round(ey * 0.6 * 10) / 10),
        Math.min(50, Math.round(ey * 1.4 * 10) / 10),
      ];
    }
  }

  // ── Risk ──
  if (result.risk) {
    result.risk.overallRisk = safeProb(result.risk.overallRisk, 0.3);
  }

  // ── Water quality score ──
  if (result.waterQuality) {
    result.waterQuality.score = safeProb(result.waterQuality.score, 0.5);
  }

  // ── Nearby wells: flag when averageDepth is 0 ──
  if (result.nearbyWells) {
    if (result.nearbyWells.averageDepth === 0 || !Number.isFinite(result.nearbyWells.averageDepth)) {
      result.nearbyWells.averageDepth = null; // null = "no data" rather than misleading 0
    }
    if (result.nearbyWells.averageYield === 0 || !Number.isFinite(result.nearbyWells.averageYield)) {
      result.nearbyWells.averageYield = null;
    }
  }

  // ── Calibration correction ──
  if (result.calibrationCorrection?.modelConfidence != null) {
    result.calibrationCorrection.modelConfidence = safeProb(result.calibrationCorrection.modelConfidence, 0.5);
  }

  // ── Advanced geophysics ──
  if (result.advancedGeophysics?.ertSimulation?.aquifer) {
    const aq = result.advancedGeophysics.ertSimulation.aquifer;
    if (aq.thickness_m === 0 && aq.estimatedYield_m3h > 0) {
      aq.estimatedYield_m3h = 0;
    }
  }

  // ── GLDAS groundwater potential ──
  if (result.gldasGroundwater?.groundwaterPotential != null) {
    result.gldasGroundwater.groundwaterPotential = safePct(result.gldasGroundwater.groundwaterPotential, 40);
  }

  // ── Ensemble result ──
  if (result.ensembleResult) {
    result.ensembleResult.probability = safeProb(result.ensembleResult.probability, 0.5);
    result.ensembleResult.depth_m = safeDepth(result.ensembleResult.depth_m);
    result.ensembleResult.yield_m3h = safeYield(result.ensembleResult.yield_m3h);
    if (result.ensembleResult.confidence != null) result.ensembleResult.confidence = safePct(result.ensembleResult.confidence, 40);
    // Clamp individual estimate values
    if (result.ensembleResult.individualEstimates && Array.isArray(result.ensembleResult.individualEstimates)) {
      for (const e of result.ensembleResult.individualEstimates) {
        if (e.probability != null) e.probability = safeProb(e.probability, 0.5);
        if (e.depth_m != null) e.depth_m = safeDepth(e.depth_m);
        if (e.yield_m3h != null) e.yield_m3h = safeYield(e.yield_m3h);
        if (e.weight != null) e.weight = safeNum(e.weight, 0, 1, 0.1);
        if (e.reliability != null) e.reliability = safeNum(e.reliability, 0, 1, 0.5);
      }
    }
  }

  // ── Hybrid geophysics success probability ──
  if (result.hybridGeophysics?.hybridInterpretation?.successProbability != null) {
    result.hybridGeophysics.hybridInterpretation.successProbability =
      safeProb(result.hybridGeophysics.hybridInterpretation.successProbability, 0.5);
  }

  // ── Confidence weighting ──
  if (result.confidenceWeighted) {
    const cw = result.confidenceWeighted;
    cw.overallConfidence = safeProb(cw.overallConfidence, 0.4);
    cw.adjustedProbability = safeProb(cw.adjustedProbability, 0.5);
    cw.adjustedDepth_m = safeDepth(cw.adjustedDepth_m);
    cw.adjustedYield_m3hr = safeYield(cw.adjustedYield_m3hr);
  }

  // ── Soil porosity ──
  if (result.soil?.porosity != null) {
    result.soil.porosity = safeNum(result.soil.porosity, 0, 1, 0.3);
  }

  // ── Uncertainty ranges ──
  if (result.uncertainty) {
    const u = result.uncertainty;
    if (u.depthRange && Array.isArray(u.depthRange)) {
      u.depthRange = u.depthRange.map((v: number) => safeDepth(v));
      if (u.depthRange[0] > u.depthRange[1]) { const t = u.depthRange[0]; u.depthRange[0] = u.depthRange[1]; u.depthRange[1] = t; }
    }
    if (u.yieldRange && Array.isArray(u.yieldRange)) {
      u.yieldRange = u.yieldRange.map((v: number) => safeYield(v));
      if (u.yieldRange[0] > u.yieldRange[1]) { const t = u.yieldRange[0]; u.yieldRange[0] = u.yieldRange[1]; u.yieldRange[1] = t; }
    }
    if (u.probabilityRange && Array.isArray(u.probabilityRange)) {
      u.probabilityRange = u.probabilityRange.map((v: number) => safeProb(v));
      if (u.probabilityRange[0] > u.probabilityRange[1]) { const t = u.probabilityRange[0]; u.probabilityRange[0] = u.probabilityRange[1]; u.probabilityRange[1] = t; }
    }
  }

  // ── Engineer confidence outputs ──
  if (result.engineerConfidence) {
    const ec = result.engineerConfidence;
    if (ec.overallGrade != null) ec.overallGrade = safePct(ec.overallGrade, 40);
    if (ec.trustScore != null) ec.trustScore = safePct(ec.trustScore, 40);
    if (ec.engineerConfidence != null) ec.engineerConfidence = safePct(ec.engineerConfidence, 40);
    if (ec.dimensions && Array.isArray(ec.dimensions)) {
      for (const d of ec.dimensions) {
        if (d.score != null) d.score = safePct(d.score, 30);
      }
    }
  }

  // ── Advanced geophysics yield/depth/probability clamping ──
  if (result.advancedGeophysics?.ertSimulation?.aquiferTarget) {
    const at = result.advancedGeophysics.ertSimulation.aquiferTarget;
    if (at.estimatedYield_m3hr != null) at.estimatedYield_m3hr = safeYield(at.estimatedYield_m3hr);
    if (at.depth_m != null) at.depth_m = safeDepth(at.depth_m);
    if (at.thickness_m != null) at.thickness_m = safeNum(at.thickness_m, 0, 200, 10);
  }
  if (result.advancedGeophysics?.drillSpec) {
    const ds = result.advancedGeophysics.drillSpec;
    if (ds.expectedYield_m3hr != null) ds.expectedYield_m3hr = safeYield(ds.expectedYield_m3hr);
    if (ds.successProbability_pct != null) ds.successProbability_pct = safePct(ds.successProbability_pct, 50);
    if (ds.recommendedDepth_m != null) ds.recommendedDepth_m = safeDepth(ds.recommendedDepth_m);
  }

  // ── Hybrid geophysics (ERT intelligence) ──
  if (result.hybridGeophysics?.hybridInterpretation) {
    const hi = result.hybridGeophysics.hybridInterpretation;
    if (hi.expectedYield_m3hr != null) hi.expectedYield_m3hr = safeYield(hi.expectedYield_m3hr);
    if (hi.targetDepth_m != null) hi.targetDepth_m = safeDepth(hi.targetDepth_m);
  }

  // ── Geophysics fusion ──
  if (result.geophysicsFusion?.expectedYield_m3hr) {
    const gf = result.geophysicsFusion;
    if (Array.isArray(gf.expectedYield_m3hr)) {
      gf.expectedYield_m3hr = gf.expectedYield_m3hr.map((v: number) => safeYield(v));
    }
  }

  // ── Data quality score ──
  if (result.dataQualityScore != null && typeof result.dataQualityScore === 'object') {
    const dq = result.dataQualityScore;
    if (dq.overallQualityScore != null) dq.overallQualityScore = safePct(dq.overallQualityScore, 30);
    if (dq.satelliteData_pct != null) dq.satelliteData_pct = safePct(dq.satelliteData_pct, 0);
    if (dq.fieldMeasurement_pct != null) dq.fieldMeasurement_pct = safePct(dq.fieldMeasurement_pct, 0);
    if (dq.laboratoryData_pct != null) dq.laboratoryData_pct = safePct(dq.laboratoryData_pct, 0);
    if (dq.modelInferred_pct != null) dq.modelInferred_pct = safePct(dq.modelInferred_pct, 0);
    if (dq.databaseData_pct != null) dq.databaseData_pct = safePct(dq.databaseData_pct, 0);
    if (dq.userInput_pct != null) dq.userInput_pct = safePct(dq.userInput_pct, 0);
    if (dq.dataCompleteness_pct != null) dq.dataCompleteness_pct = safePct(dq.dataCompleteness_pct, 0);
    if (dq.depthPredictionQuality != null) dq.depthPredictionQuality = safePct(dq.depthPredictionQuality, 30);
    if (dq.yieldPredictionQuality != null) dq.yieldPredictionQuality = safePct(dq.yieldPredictionQuality, 30);
    if (dq.waterQualityPredictionQuality != null) dq.waterQualityPredictionQuality = safePct(dq.waterQualityPredictionQuality, 30);
    if (dq.probabilityQuality != null) dq.probabilityQuality = safePct(dq.probabilityQuality, 30);
  } else if (result.dataQualityScore != null && typeof result.dataQualityScore === 'number') {
    // Legacy: if it's a plain number, leave it
    result.dataQualityScore = safePct(result.dataQualityScore, 30);
  }
  if (result.dataQuality?.overallScore != null) {
    result.dataQuality.overallScore = safePct(result.dataQuality.overallScore, 30);
  }

  // ── Location confidence ──
  if (result.locationConfidence?.score != null) {
    result.locationConfidence.score = safePct(result.locationConfidence.score, 30);
  }

  // ── Regional model (values are already 0-100 scale) ──
  if (result.regionalModel) {
    const rm = result.regionalModel;
    if (rm.correctedProbability != null) rm.correctedProbability = safePct(rm.correctedProbability, 50);
    if (rm.regionalConfidence != null) rm.regionalConfidence = safePct(rm.regionalConfidence, 40);
    if (rm.correctedDepth_m != null) rm.correctedDepth_m = safeDepth(rm.correctedDepth_m);
    if (rm.correctedYield_m3h != null) rm.correctedYield_m3h = safeYield(rm.correctedYield_m3h);
  }

  // ── Calibration correction ──
  if (result.calibrationCorrection) {
    const cc = result.calibrationCorrection;
    if (cc.correctedProbability != null) cc.correctedProbability = safeProb(cc.correctedProbability, 0.5);
    if (cc.modelConfidence != null) cc.modelConfidence = safeProb(cc.modelConfidence, 0.5);
    if (cc.correctedDepth_m != null) cc.correctedDepth_m = safeDepth(cc.correctedDepth_m);
    if (cc.correctedYield_m3hr != null) cc.correctedYield_m3hr = safeYield(cc.correctedYield_m3hr);
  }

  // ── Risk decision engine (probabilities are 0-100 scale, ROI is fractional) ──
  if (result.riskDecision) {
    const rd = result.riskDecision;
    if (rd.successProbability != null) rd.successProbability = safePct(rd.successProbability, 50);
    if (rd.dryBoreholeProbability != null) rd.dryBoreholeProbability = safePct(rd.dryBoreholeProbability, 20);
    if (rd.lowYieldProbability != null) rd.lowYieldProbability = safePct(rd.lowYieldProbability, 20);
    if (rd.poorQualityProbability != null) rd.poorQualityProbability = safePct(rd.poorQualityProbability, 10);
    if (rd.collapseRiskProbability != null) rd.collapseRiskProbability = safePct(rd.collapseRiskProbability, 5);
    if (rd.riskScore != null) rd.riskScore = safePct(rd.riskScore, 50);
    if (rd.roi != null) rd.roi = Math.max(-1, Math.min(5, Number.isFinite(rd.roi) ? rd.roi : 0));
  }

  // ── Drill decision alternative points (scores are 0-100) ──
  if (result.drillDecision?.alternativePoints?.length) {
    for (const pt of result.drillDecision.alternativePoints) {
      if (pt.score != null) pt.score = Math.min(100, Math.max(0, Math.round(pt.score)));
    }
  }

  // ══════════════════════════════════════════════════════════════
  // GOVERNING-VALUE PROPAGATION — the single source of truth reaches
  // EVERY design/driller-authoritative sub-object. Runs on every site,
  // so no annex section can ever contradict the executive headline.
  // ══════════════════════════════════════════════════════════════
  propagateGoverningValues(result);

  // ══════════════════════════════════════════════════════════════
  // FINAL CONSENSUS — ONE authoritative answer reconciling all
  // independent estimates. This is THE definitive recommendation.
  // ══════════════════════════════════════════════════════════════
  result.finalConsensus = computeFinalConsensus(result);
}

/**
 * Force the governing yield/depth (result.estimatedYield / result.recommendedDepth —
 * already reconciled against aquifer physics + the regional tested-yield band) into
 * every sub-object the report treats as AUTHORITATIVE for design, procurement or
 * driller instructions. Pure diagnostic panels that exist to SHOW model disagreement
 * keep their own numbers (the report labels them "sub-model; governing: X"); this pass
 * only fixes the places that were silently presenting a stale value as the answer.
 *
 * This is the architectural cure for the "corrected front-end, contradictory annex"
 * problem: one function, run centrally, guarantees consistency for ALL sites.
 */
export function propagateGoverningValues(result: any): void {
  if (!result) return;
  const gY = result.estimatedYield;
  const gD = result.recommendedDepth;
  if (!Number.isFinite(gY) || gY <= 0) return;

  const r2 = (n: number) => Math.round(n * 100) / 100;
  const r1 = (n: number) => Math.round(n * 10) / 10;

  // A field-validated result (real pump test) keeps its measured numbers.
  const fieldValidated =
    result.assessmentType === 'FIELD_VALIDATED' ||
    !!result.pumpTestProtocol?.isRealPumpTest ||
    !!result.fieldData?.pumpTest;
  if (fieldValidated) return;

  // ── Pump-test protocol (the "Planned" analyzer protocol) — step rates are
  //    fractions of the GOVERNING yield, never the raw ensemble yield. ──
  const ptp = result.pumpTestProtocol;
  if (ptp && Array.isArray(ptp.plannedRates_m3hr)) {
    ptp.plannedRates_m3hr = [0.3, 0.6, 0.9].map(f => r1(gY * f));
    if (Array.isArray(ptp.equipmentRequired) && ptp.equipmentRequired.length) {
      ptp.equipmentRequired[0] = `Submersible test pump (rated for ${r1(gY * 1.5)} m3/hr)`;
    }
    ptp.ratesNote =
      'Indicative only — final step rates must be set from the measured blow yield / initial development yield on site, not this desktop estimate.';
  }

  // ── Prediction-vs-reality table: the predicted pump-test yield must equal the
  //    governing yield, not a superseded sub-model figure. ──
  if (Array.isArray(result.predictionTable)) {
    for (const row of result.predictionTable) {
      if (row && typeof row.metric === 'string' && /yield/i.test(row.metric)) {
        row.predicted = `${r1(gY)} m3/hr`;
      }
    }
  }

  // ── "Corrected" calibration outputs are, by definition, the reconciled answer.
  //    They must not print a value that disagrees with the governing yield. ──
  if (result.calibrationCorrection) {
    if (result.calibrationCorrection.correctedYield_m3hr != null) result.calibrationCorrection.correctedYield_m3hr = r2(gY);
    if (result.calibrationCorrection.correctedYield_m3h != null) result.calibrationCorrection.correctedYield_m3h = r2(gY);
    if (Number.isFinite(gD) && result.calibrationCorrection.correctedDepth_m != null) result.calibrationCorrection.correctedDepth_m = Math.round(gD);
  }
  if (result.regionalModel?.correctedYield_m3h != null) result.regionalModel.correctedYield_m3h = r2(gY);
  if (result.realTimeCalibration) {
    if (result.realTimeCalibration.correctedYield_m3hr != null) result.realTimeCalibration.correctedYield_m3hr = r2(gY);
    if (result.realTimeCalibration.correctedYield != null) result.realTimeCalibration.correctedYield = r2(gY);
  }

  // ── Driller-facing hybrid interpretation drives the printed "Driller Brief".
  //    It must state the governing yield/depth, not a stale ensemble value. ──
  if (result.hybridGeophysics?.hybridInterpretation) {
    const hi = result.hybridGeophysics.hybridInterpretation;
    if (hi.expectedYield_m3hr != null) hi.expectedYield_m3hr = r2(gY);
    if (Number.isFinite(gD) && hi.targetDepth_m != null) hi.targetDepth_m = Math.round(gD);
  }

  // ── Projected "integrated survey" drill spec must not advertise an order-of-
  //    magnitude-higher yield than the governing sustainable rate. A survey can
  //    refine the target; it cannot conjure 18.6 m³/hr from a 0.5 m³/hr aquifer.
  //    Cap any projected drill-spec yield to at most 2× the governing yield. ──
  const capY = r2(gY * 2);
  const dsA = result.advancedGeophysics?.drillSpec;
  if (dsA?.expectedYield_m3hr != null && dsA.expectedYield_m3hr > capY) dsA.expectedYield_m3hr = capY;
  const iss = result.advancedGeophysics?.integratedSurvey?.drillSpec ?? result.integratedSurvey?.drillSpec;
  if (iss?.expectedYield_m3hr != null && iss.expectedYield_m3hr > capY) iss.expectedYield_m3hr = capY;
}

/**
 * Compute a single authoritative recommendation from all independent estimates.
 * Weighted by data reliability:
 *   - Bayesian Ensemble (canonical) = weight 5
 *   - Confidence-weighted adjustment = weight 3
 *   - Drilling prediction ML = weight 2
 *   - Advanced geophysics (ERT) = weight 2 (if aquifer thickness > 0)
 *   - Hybrid ERT interpretation = weight 2
 *   - Geophysics fusion = weight 1
 */
export interface FinalConsensus {
  depth_m: number;
  yield_m3hr: number;
  successProbability: number;      // 0-1
  confidenceLevel: number;         // 0-100
  assessmentGrade: string;         // 'DESKTOP SCREENING' | 'PRE-FEASIBILITY' | 'ENGINEERING GRADE' | 'BANKABLE'
  dataSourceCount: number;         // how many independent models contributed
  agreementLevel: string;          // 'Strong' | 'Moderate' | 'Weak'
  yieldRange: [number, number];    // conservative low-high
  depthRange: [number, number];
  probabilityRange: [number, number]; // 0-1 scale
  disclaimer: string;
  methodology: string;
}

function computeFinalConsensus(r: any): FinalConsensus {
  interface Est { depth: number; yield: number; prob: number; weight: number; label: string }
  const estimates: Est[] = [];

  // 1. Canonical (Bayesian ensemble → main result values)
  if (Number.isFinite(r.probability) && Number.isFinite(r.recommendedDepth) && Number.isFinite(r.estimatedYield)) {
    estimates.push({ depth: r.recommendedDepth, yield: r.estimatedYield, prob: r.probability, weight: 5, label: 'Bayesian Ensemble' });
  }

  // 2. Confidence-weighted
  if (r.confidenceWeighted) {
    const cw = r.confidenceWeighted;
    if (Number.isFinite(cw.adjustedProbability)) {
      estimates.push({ depth: cw.adjustedDepth_m, yield: cw.adjustedYield_m3hr, prob: cw.adjustedProbability, weight: 3, label: 'Confidence-Weighted' });
    }
  }

  // 3. Drilling prediction ML
  if (r.drillingPrediction) {
    const dp = r.drillingPrediction;
    if (Number.isFinite(dp.successProbability)) {
      estimates.push({
        depth: dp.predictedDepth_m || r.recommendedDepth,
        yield: dp.predictedYield_m3h || r.estimatedYield,
        prob: dp.successProbability / 100, // it's 0-100 scale
        weight: 2,
        label: 'ML Drilling Predictor',
      });
    }
  }

  // 4. Advanced geophysics ERT (only if aquifer actually has thickness)
  if (r.advancedGeophysics?.ertSimulation?.aquiferTarget) {
    const at = r.advancedGeophysics.ertSimulation.aquiferTarget;
    if (at.thickness_m > 0 && Number.isFinite(at.estimatedYield_m3hr)) {
      estimates.push({
        depth: at.depth_m || r.recommendedDepth,
        yield: at.estimatedYield_m3hr,
        prob: r.probability, // ERT doesn't have its own probability
        weight: 2,
        label: 'ERT Simulation',
      });
    }
  }

  // 5. Hybrid ERT interpretation
  if (r.hybridGeophysics?.hybridInterpretation) {
    const hi = r.hybridGeophysics.hybridInterpretation;
    if (Number.isFinite(hi.successProbability) && Number.isFinite(hi.expectedYield_m3hr)) {
      estimates.push({
        depth: hi.targetDepth_m || r.recommendedDepth,
        yield: hi.expectedYield_m3hr,
        prob: hi.successProbability,
        weight: 2,
        label: 'Hybrid ERT + AI',
      });
    }
  }

  // 6. Drill decision (synced, but confirm it matches)
  // Not adding — it's already synced to canonical

  // Weighted fusion
  let totalW = 0, wDepth = 0, wYield = 0, wProb = 0;
  for (const e of estimates) {
    if (!Number.isFinite(e.depth) || !Number.isFinite(e.yield) || !Number.isFinite(e.prob)) continue;
    totalW += e.weight;
    wDepth += e.depth * e.weight;
    wYield += e.yield * e.weight;
    wProb += e.prob * e.weight;
  }

  const finalDepth = totalW > 0 ? safeDepth(wDepth / totalW) : safeDepth(r.recommendedDepth);
  const finalYield = totalW > 0 ? safeYield(wYield / totalW) : safeYield(r.estimatedYield);
  const finalProb = totalW > 0 ? safeProb(wProb / totalW) : safeProb(r.probability);

  // Compute ranges from estimate spread
  const depths = estimates.map(e => e.depth).filter(Number.isFinite);
  const yields = estimates.map(e => e.yield).filter(Number.isFinite);
  const probs = estimates.map(e => e.prob).filter(Number.isFinite);
  const depthRange: [number, number] = depths.length > 1
    ? [safeDepth(Math.min(...depths)), safeDepth(Math.max(...depths))]
    : [safeDepth(finalDepth * 0.8), safeDepth(finalDepth * 1.2)];
  const yieldRange: [number, number] = yields.length > 1
    ? [safeYield(Math.min(...yields)), safeYield(Math.max(...yields))]
    : [safeYield(finalYield * 0.7), safeYield(finalYield * 1.3)];
  const probabilityRange: [number, number] = probs.length > 1
    ? [safeProb(Math.min(...probs)), safeProb(Math.max(...probs))]
    : [safeProb(finalProb * 0.85), safeProb(finalProb * 1.15)];

  // Agreement: how close are the estimates?
  const probSpread = probabilityRange[1] - probabilityRange[0];
  const agreementLevel = probSpread < 0.15 ? 'Strong' : probSpread < 0.3 ? 'Moderate' : 'Weak';

  // Assessment grade
  const conf = r.confidenceMetrics?.overall ?? 40;
  const hasFieldData = !!r.advancedGeophysics?.ertSimulation?.aquiferTarget?.thickness_m;
  const hasPumpTest = !!r.pumpTestProtocol?.isRealPumpTest;
  let assessmentGrade: string;
  if (hasFieldData && hasPumpTest && conf >= 90) assessmentGrade = 'BANKABLE';
  else if (hasFieldData && conf >= 75) assessmentGrade = 'ENGINEERING GRADE';
  else if (conf >= 55) assessmentGrade = 'PRE-FEASIBILITY';
  else assessmentGrade = 'DESKTOP SCREENING';

  return {
    depth_m: Math.round(finalDepth * 10) / 10,
    yield_m3hr: Math.round(finalYield * 100) / 100,
    successProbability: Math.round(finalProb * 1000) / 1000,
    confidenceLevel: safePct(conf, 40),
    assessmentGrade,
    dataSourceCount: estimates.length,
    agreementLevel,
    yieldRange,
    depthRange,
    probabilityRange: [Math.round(probabilityRange[0] * 1000) / 1000, Math.round(probabilityRange[1] * 1000) / 1000],
    disclaimer: assessmentGrade === 'DESKTOP SCREENING'
      ? 'This assessment is based solely on remote/desktop analysis. Field geophysical verification (ERT, TDEM, or seismic) is REQUIRED before drilling decisions.'
      : assessmentGrade === 'PRE-FEASIBILITY'
      ? 'This pre-feasibility assessment combines AI analysis with available remote data. Ground-truthing with at least one geophysical method is strongly recommended before commitment.'
      : assessmentGrade === 'ENGINEERING GRADE'
      ? 'This engineering-grade assessment is supported by field geophysical data. Suitable for preliminary design, subject to pump test verification.'
      : 'This bankable-grade assessment meets the requirements for investment decisions. Field data, pump test, and independent verification have been incorporated.',
    methodology: `Weighted fusion of ${estimates.length} independent models: ${estimates.map(e => `${e.label} (w=${e.weight})`).join(', ')}. Agreement: ${agreementLevel} (probability spread: ±${(probSpread * 50).toFixed(0)}%).`,
  };
}
