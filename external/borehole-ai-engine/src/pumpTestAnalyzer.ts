// ═══════════════════════════════════════════════════════════════════════════
// PUMP TEST ANALYZER — Full Theis / Cooper-Jacob / Recovery Analysis
// Real hydrogeological pump test interpretation with transmissivity,
// storativity, specific capacity, well efficiency, and sustainable yield
// ═══════════════════════════════════════════════════════════════════════════

export interface PumpTestReading {
  time_min: number;       // minutes since pump start
  drawdown_m: number;     // water level drop in meters
  recovery?: boolean;     // true if this reading is during recovery phase
}

export interface PumpTestInput {
  pumpingRate_m3hr: number;       // Q in m³/hr
  boreholeRadius_m?: number;      // well radius (default 0.076m = 6" well)
  casingDiameter_mm?: number;
  staticWaterLevel_m: number;     // SWL before pumping
  readings: PumpTestReading[];    // time-drawdown data
  observationWellDistance_m?: number; // distance to observation well (if any)
  aquiferThickness_m?: number;    // b — if known
  pumpDuration_min?: number;      // total pumping duration before recovery
  rockType?: string;
  aquiferType?: 'confined' | 'unconfined' | 'semi-confined' | 'unknown';
}

export interface PumpTestResult {
  // Core hydraulic parameters
  transmissivity_m2day: number;      // T
  storativity: number;               // S (dimensionless)
  hydraulicConductivity_m_day: number; // K = T/b
  specificCapacity_m3hr_m: number;   // Q/s
  
  // Well performance
  wellEfficiency_pct: number;
  wellLossFactor: number;            // C in Jacob equation s = BQ + CQ²
  maxRecommendedYield_m3hr: number;
  sustainableYield_m3hr: number;     // 2/3 of safe yield
  safeYield_m3hr: number;
  
  // Drawdown analysis
  maxDrawdown_m: number;
  availableDrawdown_m: number;       // SWL to pump intake
  drawdownAtSafeYield_m: number;
  recoveryPct: number;               // % recovery after pumping stops
  recoveryTime_min: number;          // time to 90% recovery
  
  // Cooper-Jacob analysis
  cooperJacob: {
    T_m2day: number;
    S: number;
    drawdownPerLogCycle_m: number;   // Δs
    validAfter_min: number;          // u < 0.01 threshold
    r_squared: number;               // fit quality
  };
  
  // Theis analysis
  theis: {
    T_m2day: number;
    S: number;
    typeMatchQuality: number;        // 0-1 match to Theis curve
  };
  
  // Recovery analysis (Theis recovery)
  recovery: {
    T_m2day: number;
    residualDrawdown_m: number;
    recoveryEfficiency_pct: number;
    boundaryEffects: string;         // 'none' | 'recharge' | 'barrier'
  } | null;
  
  // Aquifer classification
  aquiferType: 'confined' | 'unconfined' | 'semi-confined' | 'leaky';
  aquiferTypeEvidence: string[];
  
  // Sustainability
  sustainabilityRating: 'excellent' | 'good' | 'moderate' | 'poor' | 'unsustainable';
  sustainabilityFactors: string[];
  longTermDecline_m_year: number;    // predicted annual decline
  
  // Quality metrics
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  dataQualityIssues: string[];
  confidence: number;                // 0-1
  
  // Recommendations
  recommendations: string[];
  warnings: string[];
  
  // Raw computed data for plotting
  drawdownCurve: { time_min: number; drawdown_m: number; fitted_m: number }[];
  semilogSlope: number;              // slope on semi-log plot
}

// Well function W(u) — Theis well function using series approximation
export function wellFunction(u: number): number {
  if (u <= 0) return 20; // cap
  if (u > 5) return 0;   // negligible
  
  // For small u, use Cooper-Jacob approximation
  if (u < 0.01) return -0.5772 - Math.log(u);
  
  // Series expansion: W(u) = -γ - ln(u) + u - u²/(2·2!) + u³/(3·3!) - ...
  // AUDIT FIX (2026-07-10): the first term is +u (was -u) and the recurrence
  // is term *= -u (an extra /(n+1) had crept in). The old version returned
  // ZERO drawdown for u > ~0.4 (physically impossible) and biased every
  // Theis-fitted T/S from real pump tests. Verified: W(0.05)=2.468,
  // W(0.5)=0.560, W(1)=0.219 (Abramowitz & Stegun table values).
  const euler = 0.5772156649;
  let sum = -euler - Math.log(u);
  let term = u;
  for (let n = 1; n <= 50; n++) {
    const contrib = term / (n * factorial(n));
    sum += contrib;
    if (Math.abs(contrib) < 1e-12) break;
    term *= -u;
  }
  return Math.max(0, sum);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// Linear regression helper
function linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number } {
  const n = x.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, xi, i) => a + xi * y[i], 0);
  const sumX2 = x.reduce((a, xi) => a + xi * xi, 0);
  const sumY2 = y.reduce((a, yi) => a + yi * yi, 0);
  
  const denom = n * sumX2 - sumX * sumX;
  if (Math.abs(denom) < 1e-12) return { slope: 0, intercept: sumY / n, r2: 0 };
  
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  
  const ssRes = y.reduce((a, yi, i) => a + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
  const ssTot = y.reduce((a, yi) => a + Math.pow(yi - sumY / n, 2), 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  
  return { slope, intercept, r2: Math.max(0, r2) };
}

export function analyzePumpTest(input: PumpTestInput): PumpTestResult {
  const Q_m3day = input.pumpingRate_m3hr * 24;
  const Q_m3min = input.pumpingRate_m3hr / 60;
  const r = input.observationWellDistance_m || (input.boreholeRadius_m || 0.076);
  const b = input.aquiferThickness_m || 30; // default aquifer thickness
  
  // Separate pumping and recovery readings
  const pumpReadings = input.readings.filter(r => !r.recovery && r.time_min > 0);
  const recoveryReadings = input.readings.filter(r => r.recovery);
  
  // Sort by time
  pumpReadings.sort((a, b) => a.time_min - b.time_min);
  recoveryReadings.sort((a, b) => a.time_min - b.time_min);
  
  // Data quality assessment
  const dataQualityIssues: string[] = [];
  if (pumpReadings.length < 5) dataQualityIssues.push('Fewer than 5 pumping readings — unreliable');
  if (pumpReadings.length < 10) dataQualityIssues.push('Fewer than 10 readings — reduced accuracy');
  if (!pumpReadings.some(r => r.time_min < 5)) dataQualityIssues.push('No early-time data (< 5 min) — storativity unreliable');
  if (!pumpReadings.some(r => r.time_min > 120)) dataQualityIssues.push('Pumping < 2 hours — long-term yield uncertain');
  if (pumpReadings.length >= 3) {
    // Check for non-monotonic drawdown (should increase or plateau)
    let nonMono = 0;
    for (let i = 2; i < pumpReadings.length; i++) {
      if (pumpReadings[i].drawdown_m < pumpReadings[i - 1].drawdown_m - 0.02) nonMono++;
    }
    if (nonMono > pumpReadings.length * 0.2) dataQualityIssues.push('Non-monotonic drawdown detected — check for measurement errors');
  }
  
  const dataQuality: PumpTestResult['dataQuality'] = 
    dataQualityIssues.length === 0 ? 'excellent' :
    dataQualityIssues.length <= 1 ? 'good' :
    dataQualityIssues.length <= 2 ? 'fair' : 'poor';
  
  // ═══ COOPER-JACOB ANALYSIS ═══
  // Plot drawdown vs log(time), find straight-line segment
  const logTime = pumpReadings.map(r => Math.log10(r.time_min));
  const drawdowns = pumpReadings.map(r => r.drawdown_m);
  
  // Find the late-time linear segment (skip first 3 readings or first 10 min)
  const lateStart = Math.max(3, pumpReadings.findIndex(r => r.time_min >= 10));
  const lateLogTime = logTime.slice(lateStart >= 0 ? lateStart : 0);
  const lateDrawdown = drawdowns.slice(lateStart >= 0 ? lateStart : 0);
  
  const cjRegression = linearRegression(lateLogTime, lateDrawdown);
  
  // T = 2.303 × Q / (4π × Δs)  where Δs = drawdown per log cycle
  const deltaS_cj = cjRegression.slope * 1; // slope = drawdown per unit log10(time)
  const T_cj = deltaS_cj > 0.001 ? (2.303 * Q_m3day) / (4 * Math.PI * deltaS_cj) : 500;
  
  // S = 2.25 × T × t0 / r²  where t0 = time at zero drawdown (x-intercept)
  const t0_min = deltaS_cj > 0.001 ? Math.pow(10, -cjRegression.intercept / cjRegression.slope) : 1;
  const t0_day = t0_min / 1440;
  const S_cj = (2.25 * T_cj * t0_day) / (r * r);
  
  // Valid when u < 0.01 → t > r²S / (4T × 0.01)
  const validAfter_cj = (r * r * Math.max(S_cj, 1e-6)) / (4 * T_cj * 0.01) * 1440; // convert to minutes
  
  // ═══ THEIS CURVE MATCHING ═══
  // Simplified: use mid-time data point for matching
  const midIdx = Math.floor(pumpReadings.length / 2);
  const midTime_day = pumpReadings[midIdx]?.time_min / 1440 || 0.01;
  const midDrawdown = pumpReadings[midIdx]?.drawdown_m || 1;
  
  // Iterate to find T and S that best fit Theis curve
  let bestT_theis = T_cj;
  let bestS_theis = Math.max(S_cj, 1e-6);
  let bestMatch = 0;
  
  // Grid search around Cooper-Jacob estimates
  for (let tMult = 0.5; tMult <= 2.0; tMult += 0.1) {
    for (let sMult = 0.1; sMult <= 10; sMult *= 1.5) {
      const tryT = T_cj * tMult;
      const tryS = Math.max(S_cj, 1e-6) * sMult;
      
      let ssRes = 0;
      let ssTot = 0;
      const meanDD = drawdowns.reduce((a, b) => a + b, 0) / drawdowns.length;
      
      for (let i = 0; i < pumpReadings.length; i++) {
        const t_day = pumpReadings[i].time_min / 1440;
        const u = (r * r * tryS) / (4 * tryT * t_day);
        const predicted = (Q_m3day / (4 * Math.PI * tryT)) * wellFunction(u);
        ssRes += Math.pow(drawdowns[i] - predicted, 2);
        ssTot += Math.pow(drawdowns[i] - meanDD, 2);
      }
      
      const match = ssTot > 0 ? 1 - ssRes / ssTot : 0;
      if (match > bestMatch) {
        bestMatch = match;
        bestT_theis = tryT;
        bestS_theis = tryS;
      }
    }
  }
  
  // ═══ RECOVERY ANALYSIS ═══
  let recoveryResult: PumpTestResult['recovery'] = null;
  
  if (recoveryReadings.length >= 3 && input.pumpDuration_min) {
    const tp = input.pumpDuration_min; // pumping duration
    
    // Theis recovery: plot residual drawdown vs log(t/t')
    // t' = time since pump stopped, t = total time since pump started
    const recLogRatio: number[] = [];
    const recResidual: number[] = [];
    
    for (const rec of recoveryReadings) {
      const tPrime = rec.time_min; // time since pump stopped
      if (tPrime <= 0) continue;
      const totalT = tp + tPrime;
      recLogRatio.push(Math.log10(totalT / tPrime));
      recResidual.push(rec.drawdown_m);
    }
    
    if (recLogRatio.length >= 2) {
      const recReg = linearRegression(recLogRatio, recResidual);
      const deltaS_rec = recReg.slope;
      const T_recovery = deltaS_rec > 0.001 ? (2.303 * Q_m3day) / (4 * Math.PI * deltaS_rec) : T_cj;
      
      const lastRecDrawdown = recoveryReadings[recoveryReadings.length - 1]?.drawdown_m || 0;
      const maxDrawdownVal = Math.max(...pumpReadings.map(r => r.drawdown_m), 0.1);
      const recoveryEff = (1 - lastRecDrawdown / maxDrawdownVal) * 100;
      
      // Boundary detection
      let boundary = 'none';
      if (T_recovery > T_cj * 1.5) boundary = 'recharge'; // recharge boundary → faster recovery
      else if (T_recovery < T_cj * 0.5) boundary = 'barrier'; // barrier boundary → slower recovery
      
      recoveryResult = {
        T_m2day: Math.max(0.1, T_recovery),
        residualDrawdown_m: lastRecDrawdown,
        recoveryEfficiency_pct: Math.min(100, Math.max(0, recoveryEff)),
        boundaryEffects: boundary
      };
    }
  }
  
  // ═══ FINAL PARAMETER ESTIMATES ═══
  // Weight Cooper-Jacob and Theis (CJ more reliable for late-time data)
  const T_final = recoveryResult
    ? (T_cj * 0.3 + bestT_theis * 0.3 + recoveryResult.T_m2day * 0.4)
    : (T_cj * 0.5 + bestT_theis * 0.5);
  
  const S_final = Math.min(0.3, Math.max(1e-7, (S_cj * 0.5 + bestS_theis * 0.5)));
  const K_final = T_final / b;
  
  const maxDrawdown = Math.max(...pumpReadings.map(r => r.drawdown_m), 0.1);
  const specificCapacity = input.pumpingRate_m3hr / maxDrawdown;
  
  // ═══ WELL PERFORMANCE ═══
  // Jacob well loss: s = BQ + CQ²
  // B = aquifer loss component, C = well loss component
  // Estimate from early vs late specific capacity
  const earlyReadings = pumpReadings.filter(r => r.time_min <= 10);
  const lateReadings = pumpReadings.filter(r => r.time_min >= 60);
  
  let wellEfficiency = 70; // default
  let wellLossFactor = 0;
  
  if (earlyReadings.length > 0 && lateReadings.length > 0) {
    const earlyDD = earlyReadings[earlyReadings.length - 1]?.drawdown_m || 0;
    const lateDD = lateReadings[lateReadings.length - 1]?.drawdown_m || maxDrawdown;
    
    if (lateDD > 0) {
      // Theoretical drawdown increases with log(time)
      const theoreticalRatio = Math.log(lateReadings[lateReadings.length - 1].time_min) / 
                               Math.log(Math.max(earlyReadings[earlyReadings.length - 1].time_min, 1));
      const expectedLateDD = earlyDD * (theoreticalRatio > 0 ? theoreticalRatio : 1.5);
      
      if (lateDD > expectedLateDD * 1.1) {
        // Excess drawdown = well losses
        wellLossFactor = (lateDD - expectedLateDD) / (input.pumpingRate_m3hr * input.pumpingRate_m3hr);
        wellEfficiency = Math.max(20, Math.min(100, (expectedLateDD / lateDD) * 100));
      } else {
        wellEfficiency = Math.min(95, 75 + (1 - lateDD / (expectedLateDD * 1.1)) * 20);
      }
    }
  }
  
  // ═══ SAFE AND SUSTAINABLE YIELD ═══
  const availableDrawdown = Math.max(1, (b > input.staticWaterLevel_m ? b : b * 0.67) - input.staticWaterLevel_m);
  const safeDrawdown = availableDrawdown * 0.67; // use 2/3 of available drawdown
  
  // Safe yield from T and safe drawdown: Q = 2πT × safeDrawdown / ln(R/r)
  const influenceRadius = Math.sqrt(2.25 * T_final * 1 / Math.max(S_final, 1e-6)); // at t = 1 day
  const safeYield_m3day = (2 * Math.PI * T_final * safeDrawdown) / Math.log(Math.max(influenceRadius, 10) / r);
  const safeYield_m3hr = safeYield_m3day / 24;
  const sustainableYield = safeYield_m3hr * 0.67; // conservative: 2/3 of safe yield
  
  const maxRecYield = Math.min(
    input.pumpingRate_m3hr * (wellEfficiency / 100),
    safeYield_m3hr
  );
  
  // ═══ RECOVERY METRICS ═══
  let recoveryPct = 0;
  let recoveryTime = 0;
  
  if (recoveryReadings.length > 0) {
    const finalRecDD = recoveryReadings[recoveryReadings.length - 1].drawdown_m;
    recoveryPct = Math.max(0, (1 - finalRecDD / maxDrawdown) * 100);
    
    // Estimate time to 90% recovery
    const target90 = maxDrawdown * 0.1;
    const recMatch = recoveryReadings.find(r => r.drawdown_m <= target90);
    recoveryTime = recMatch?.time_min || (recoveryReadings[recoveryReadings.length - 1].time_min * 2);
  } else {
    // Estimate from transmissivity
    recoveryPct = T_final > 100 ? 95 : T_final > 50 ? 85 : T_final > 10 ? 70 : 50;
    recoveryTime = T_final > 100 ? 30 : T_final > 50 ? 60 : T_final > 10 ? 120 : 360;
  }
  
  // ═══ AQUIFER TYPE CLASSIFICATION ═══
  const aquiferEvidence: string[] = [];
  let classifiedType: PumpTestResult['aquiferType'] = 'confined';
  
  if (S_final > 0.05) {
    classifiedType = 'unconfined';
    aquiferEvidence.push(`Storativity ${S_final.toExponential(2)} > 0.05 → unconfined`);
  } else if (S_final > 0.001) {
    classifiedType = 'semi-confined';
    aquiferEvidence.push(`Storativity ${S_final.toExponential(2)} in 0.001–0.05 → semi-confined/leaky`);
  } else if (S_final > 1e-5) {
    classifiedType = 'confined';
    aquiferEvidence.push(`Storativity ${S_final.toExponential(2)} in 1e-5–1e-3 → confined`);
  } else {
    classifiedType = 'confined';
    aquiferEvidence.push(`Very low storativity ${S_final.toExponential(2)} → strongly confined`);
  }
  
  // Check for leaky behavior (drawdown plateaus)
  if (pumpReadings.length >= 10) {
    const lastThird = pumpReadings.slice(Math.floor(pumpReadings.length * 0.67));
    const ddRange = Math.max(...lastThird.map(r => r.drawdown_m)) - Math.min(...lastThird.map(r => r.drawdown_m));
    if (ddRange < maxDrawdown * 0.05) {
      classifiedType = 'leaky';
      aquiferEvidence.push('Drawdown plateau in late-time → leaky/recharge boundary');
    }
  }
  
  if (input.aquiferType && input.aquiferType !== 'unknown') {
    aquiferEvidence.push(`User-specified: ${input.aquiferType}`);
  }
  
  // ═══ SUSTAINABILITY RATING ═══
  const sustainFactors: string[] = [];
  let sustainScore = 50;
  
  if (T_final > 200) { sustainScore += 15; sustainFactors.push('High transmissivity (> 200 m²/day) — good aquifer'); }
  else if (T_final > 50) { sustainScore += 8; sustainFactors.push('Moderate transmissivity'); }
  else { sustainScore -= 10; sustainFactors.push('Low transmissivity — limited capacity'); }
  
  if (recoveryPct > 90) { sustainScore += 15; sustainFactors.push('Excellent recovery (> 90%)'); }
  else if (recoveryPct > 70) { sustainScore += 8; sustainFactors.push('Good recovery'); }
  else { sustainScore -= 15; sustainFactors.push('Poor recovery — over-extraction risk'); }
  
  if (specificCapacity > 1.0) { sustainScore += 10; sustainFactors.push('High specific capacity'); }
  else if (specificCapacity < 0.1) { sustainScore -= 10; sustainFactors.push('Very low specific capacity'); }
  
  if (wellEfficiency > 80) { sustainScore += 5; sustainFactors.push('Good well efficiency'); }
  else if (wellEfficiency < 50) { sustainScore -= 5; sustainFactors.push('Poor well efficiency — consider redevelopment'); }
  
  const sustainRating: PumpTestResult['sustainabilityRating'] =
    sustainScore >= 80 ? 'excellent' :
    sustainScore >= 60 ? 'good' :
    sustainScore >= 40 ? 'moderate' :
    sustainScore >= 20 ? 'poor' : 'unsustainable';
  
  // Long-term decline estimate (from specific storage and pumping rate)
  const annualPumping_m3 = sustainableYield * 24 * 365 * 0.8; // 80% duty cycle
  const storageVolume_m3 = S_final * Math.PI * Math.pow(influenceRadius, 2) * b;
  const longTermDecline = storageVolume_m3 > 0 ? (annualPumping_m3 / storageVolume_m3) * b * 0.1 : 0.5;
  
  // ═══ FITTED CURVE FOR PLOTTING ═══
  const drawdownCurve = pumpReadings.map(reading => {
    const t_day = reading.time_min / 1440;
    const u = (r * r * S_final) / (4 * T_final * t_day);
    const fitted = (Q_m3day / (4 * Math.PI * T_final)) * wellFunction(u);
    return {
      time_min: reading.time_min,
      drawdown_m: reading.drawdown_m,
      fitted_m: Math.max(0, fitted)
    };
  });
  
  // ═══ RECOMMENDATIONS ═══
  const recommendations: string[] = [];
  const warnings: string[] = [];
  
  if (sustainableYield < input.pumpingRate_m3hr * 0.5) {
    warnings.push(`Sustainable yield (${sustainableYield.toFixed(2)} m³/hr) is much less than test rate — reduce pumping`);
  }
  if (wellEfficiency < 50) {
    recommendations.push('Well efficiency below 50% — consider well development (surging, jetting)');
  }
  if (recoveryPct < 70) {
    warnings.push('Slow recovery indicates aquifer depletion risk — use intermittent pumping');
  }
  if (T_final < 10) {
    warnings.push('Very low transmissivity (< 10 m²/day) — limited borehole potential');
  }
  if (S_final > 0.1) {
    recommendations.push('High storativity suggests unconfined aquifer — protect from surface contamination');
  }
  if (dataQuality === 'poor') {
    warnings.push('Data quality is poor — repeat pump test with more readings and longer duration');
  }
  
  recommendations.push(`Recommended pump setting: ${Math.max(1, Math.round(input.staticWaterLevel_m + safeDrawdown))}m below ground level`);
  recommendations.push(`Maximum continuous pumping: ${sustainableYield.toFixed(2)} m³/hr (${(sustainableYield * 1000 / 60).toFixed(0)} L/min)`);
  
  if (classifiedType === 'unconfined') {
    recommendations.push('Screen the full saturated zone for maximum yield');
  } else if (classifiedType === 'confined') {
    recommendations.push('Seal the confining layer properly to maintain artesian pressure');
  }
  
  // Confidence
  let confidence = 0.5;
  if (pumpReadings.length >= 10) confidence += 0.1;
  if (pumpReadings.length >= 20) confidence += 0.1;
  if (recoveryReadings.length >= 5) confidence += 0.1;
  if (cjRegression.r2 > 0.9) confidence += 0.1;
  if (bestMatch > 0.8) confidence += 0.05;
  if (dataQuality === 'excellent') confidence += 0.05;
  confidence = Math.min(0.95, confidence);
  
  const drawdownAtSafe = safeDrawdown; // safe drawdown is already computed
  
  return {
    transmissivity_m2day: Math.max(0.1, T_final),
    storativity: S_final,
    hydraulicConductivity_m_day: Math.max(0.001, K_final),
    specificCapacity_m3hr_m: specificCapacity,
    wellEfficiency_pct: Math.round(wellEfficiency),
    wellLossFactor: wellLossFactor,
    maxRecommendedYield_m3hr: Math.max(0.01, maxRecYield),
    sustainableYield_m3hr: Math.max(0.01, sustainableYield),
    safeYield_m3hr: Math.max(0.01, safeYield_m3hr),
    maxDrawdown_m: maxDrawdown,
    availableDrawdown_m: availableDrawdown,
    drawdownAtSafeYield_m: drawdownAtSafe,
    recoveryPct: Math.round(recoveryPct),
    recoveryTime_min: Math.round(recoveryTime),
    cooperJacob: {
      T_m2day: Math.max(0.1, T_cj),
      S: Math.max(1e-7, S_cj),
      drawdownPerLogCycle_m: deltaS_cj,
      validAfter_min: Math.max(0, validAfter_cj),
      r_squared: cjRegression.r2
    },
    theis: {
      T_m2day: Math.max(0.1, bestT_theis),
      S: Math.max(1e-7, bestS_theis),
      typeMatchQuality: Math.max(0, bestMatch)
    },
    recovery: recoveryResult,
    aquiferType: classifiedType,
    aquiferTypeEvidence: aquiferEvidence,
    sustainabilityRating: sustainRating,
    sustainabilityFactors: sustainFactors,
    longTermDecline_m_year: Math.max(0, Math.min(5, longTermDecline)),
    dataQuality,
    dataQualityIssues,
    confidence,
    recommendations,
    warnings,
    drawdownCurve,
    semilogSlope: cjRegression.slope
  };
}

// Generate quick pump test estimate from minimal data (no time-drawdown curve)
export function quickPumpEstimate(
  yield_m3hr: number,
  drawdown_m: number,
  staticWaterLevel_m: number,
  aquiferThickness_m?: number
): { specificCapacity: number; estimatedT: number; estimatedSafeYield: number; rating: string } {
  const sc = yield_m3hr / Math.max(drawdown_m, 0.1);
  // Logan equation: T ≈ 1.22 × Q/s (for confined, units m²/day when Q/s in m²/day)
  const T = 1.22 * sc * 24; // convert to m²/day
  const b = aquiferThickness_m || 30;
  const availDD = Math.max(1, b * 0.67 - staticWaterLevel_m);
  const safeYield = sc * availDD * 0.67;
  
  const rating = sc > 2 ? 'Excellent' : sc > 0.5 ? 'Good' : sc > 0.1 ? 'Moderate' : 'Poor';
  
  return {
    specificCapacity: sc,
    estimatedT: T,
    estimatedSafeYield: Math.max(0.01, safeYield),
    rating
  };
}
