// ═══════════════════════════════════════════════════════════════════════════
// TEMPORAL DROUGHT ANALYSIS ENGINE
// Multi-year rainfall trends, SPI drought index, NDVI vegetation trends,
// drought cycle detection, sustainable yield under climate variability
// ═══════════════════════════════════════════════════════════════════════════

export interface MonthlyRecord {
  year: number;
  month: number;        // 1-12
  rainfall_mm: number;
  temperature_c?: number;
  et_mm?: number;       // evapotranspiration
  ndvi?: number;        // 0-1 vegetation index
  soilMoisture?: number; // 0-1
}

export interface TemporalAnalysisInput {
  monthlyData: MonthlyRecord[];
  latitude: number;
  longitude: number;
  currentYear?: number;
  aquiferStorageEstimate_mm?: number;   // total aquifer storage in mm
  currentPumping_m3day?: number;
  catchmentArea_km2?: number;
}

export interface DroughtEvent {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  duration_months: number;
  severity: 'mild' | 'moderate' | 'severe' | 'extreme';
  minSPI: number;                 // lowest SPI during drought
  rainfallDeficit_mm: number;     // cumulative deficit below average
  estimatedRechargeImpact_pct: number; // % reduction in recharge
}

export interface TemporalAnalysisResult {
  // Time series statistics
  yearsAnalyzed: number;
  totalMonths: number;
  meanAnnualRainfall_mm: number;
  rainfallTrend_mm_decade: number;      // mm/decade change
  rainfallTrendDirection: 'increasing' | 'decreasing' | 'stable';
  rainfallCV: number;                    // coefficient of variation
  
  // SPI Drought Index
  spiTimeSeries: { year: number; month: number; spi: number }[];
  currentSPI: number;                    // latest SPI value
  currentDroughtStatus: 'none' | 'mild' | 'moderate' | 'severe' | 'extreme';
  
  // Drought events
  droughtEvents: DroughtEvent[];
  droughtFrequency_perDecade: number;
  averageDroughtDuration_months: number;
  longestDrought_months: number;
  droughtReturnPeriod_years: number;     // average years between droughts
  currentlyInDrought: boolean;
  
  // Seasonal patterns
  wetSeason: { startMonth: number; endMonth: number; rainfall_pct: number };
  drySeason: { startMonth: number; endMonth: number; months: number };
  rainyMonths: number;                   // months with > 50mm
  
  // Vegetation / NDVI trends (if available)
  ndviTrend: number | null;             // change per decade
  ndviCorrelationWithRainfall: number | null;
  vegetationStress: boolean;
  
  // Recharge impact
  averageAnnualRecharge_mm: number;
  rechargeInDroughtYear_mm: number;
  rechargeInWetYear_mm: number;
  rechargeTrend_mm_decade: number;
  
  // Sustainable yield assessment
  sustainableYield_m3day: number;
  yieldDuringDrought_m3day: number;      // yield available during worst drought
  yieldReliability_pct: number;           // % of years yield is achievable
  depletionRiskUnderDrought: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  yearsToDepletionInDrought: number | null;
  
  // Climate projections
  projectedRainfall2030_mm: number;
  projectedRainfall2050_mm: number;
  projectedDroughtFrequency2050: string;
  
  // Recommendations
  recommendations: string[];
  warnings: string[];
  
  // Summary
  narrative: string;
}

// ═══ STANDARDIZED PRECIPITATION INDEX (SPI) ═══
// SPI is THE standard drought index (McKee et al. 1993)
function calculateSPI(monthlyRainfall: number[], windowMonths: number = 12): number[] {
  const n = monthlyRainfall.length;
  if (n < windowMonths + 6) return monthlyRainfall.map(() => 0);
  
  const spi: number[] = new Array(n).fill(0);
  
  for (let i = windowMonths - 1; i < n; i++) {
    // Accumulate rainfall over window
    let accumulated = 0;
    for (let j = 0; j < windowMonths; j++) {
      accumulated += monthlyRainfall[i - j];
    }
    
    // Calculate SPI using gamma distribution approximation
    // Simplified: z-score of accumulated rainfall vs long-term average for that window
    const windowValues: number[] = [];
    for (let k = windowMonths - 1; k < n; k++) {
      let val = 0;
      for (let j = 0; j < windowMonths; j++) val += monthlyRainfall[k - j];
      windowValues.push(val);
    }
    
    const mean = windowValues.reduce((a, b) => a + b, 0) / windowValues.length;
    const std = Math.sqrt(windowValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / windowValues.length);
    
    spi[i] = std > 0 ? (accumulated - mean) / std : 0;
  }
  
  return spi;
}

// ═══ DROUGHT EVENT DETECTION ═══
function detectDroughtEvents(spiValues: number[], records: MonthlyRecord[]): DroughtEvent[] {
  const events: DroughtEvent[] = [];
  let inDrought = false;
  let startIdx = 0;
  
  for (let i = 0; i < spiValues.length; i++) {
    if (spiValues[i] < -1.0 && !inDrought) {
      // Start of drought (SPI < -1.0)
      inDrought = true;
      startIdx = i;
    } else if ((spiValues[i] >= -0.5 || i === spiValues.length - 1) && inDrought) {
      // End of drought (SPI recovers above -0.5)
      inDrought = false;
      
      const duration = i - startIdx;
      if (duration >= 3) { // minimum 3 months to count as drought
        const minSPI = Math.min(...spiValues.slice(startIdx, i + 1));
        
        // Calculate rainfall deficit
        const droughtRainfall = records.slice(startIdx, i + 1).reduce((s, r) => s + r.rainfall_mm, 0);
        const avgMonthlyRainfall = records.reduce((s, r) => s + r.rainfall_mm, 0) / records.length;
        const expectedRainfall = avgMonthlyRainfall * duration;
        const deficit = expectedRainfall - droughtRainfall;
        
        const severity: DroughtEvent['severity'] = 
          minSPI < -2.0 ? 'extreme' :
          minSPI < -1.5 ? 'severe' :
          minSPI < -1.0 ? 'moderate' : 'mild';
        
        // Recharge impact (simplified: recharge drops proportionally to deficit)
        const rechargeImpact = Math.min(90, Math.abs(deficit / expectedRainfall) * 100);
        
        events.push({
          startYear: records[startIdx]?.year || 0,
          startMonth: records[startIdx]?.month || 0,
          endYear: records[i]?.year || 0,
          endMonth: records[i]?.month || 0,
          duration_months: duration,
          severity,
          minSPI: Math.round(minSPI * 100) / 100,
          rainfallDeficit_mm: Math.round(deficit),
          estimatedRechargeImpact_pct: Math.round(rechargeImpact)
        });
      }
    }
  }
  
  return events;
}

// ═══ LINEAR TREND ═══
function linearTrend(x: number[], y: number[]): { slope: number; r2: number } {
  const n = x.length;
  if (n < 2) return { slope: 0, r2: 0 };
  
  const sx = x.reduce((a, b) => a + b, 0);
  const sy = y.reduce((a, b) => a + b, 0);
  const sxy = x.reduce((a, xi, i) => a + xi * y[i], 0);
  const sx2 = x.reduce((a, xi) => a + xi * xi, 0);
  const sy2 = y.reduce((a, yi) => a + yi * yi, 0);
  
  const denom = n * sx2 - sx * sx;
  if (Math.abs(denom) < 1e-12) return { slope: 0, r2: 0 };
  
  const slope = (n * sxy - sx * sy) / denom;
  
  const ssRes = y.reduce((a, yi, i) => a + Math.pow(yi - (slope * x[i] + (sy - slope * sx) / n), 2), 0);
  const ssTot = y.reduce((a, yi) => a + Math.pow(yi - sy / n, 2), 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  
  return { slope, r2: Math.max(0, r2) };
}

// ═══ MAIN ANALYSIS ═══
export function analyzeTemporalDrought(input: TemporalAnalysisInput): TemporalAnalysisResult {
  const { monthlyData, latitude } = input;
  const currentYear = input.currentYear || new Date().getFullYear();
  
  if (monthlyData.length < 24) {
    return emptyResult('Insufficient data — need at least 24 months of records');
  }
  
  // Sort chronologically
  const sorted = [...monthlyData].sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month));
  
  // ═══ BASIC STATISTICS ═══
  const years = [...new Set(sorted.map(r => r.year))];
  const annualTotals = years.map(y => ({
    year: y,
    total: sorted.filter(r => r.year === y).reduce((s, r) => s + r.rainfall_mm, 0)
  }));
  
  const meanAnnual = annualTotals.reduce((s, a) => s + a.total, 0) / annualTotals.length;
  const stdAnnual = Math.sqrt(annualTotals.reduce((s, a) => s + Math.pow(a.total - meanAnnual, 2), 0) / annualTotals.length);
  const cv = meanAnnual > 0 ? stdAnnual / meanAnnual : 0;
  
  // Rainfall trend (mm per decade)
  const trendResult = linearTrend(annualTotals.map(a => a.year), annualTotals.map(a => a.total));
  const rainfallTrend = trendResult.slope * 10; // per decade
  const trendDirection: TemporalAnalysisResult['rainfallTrendDirection'] = 
    rainfallTrend > 10 ? 'increasing' : rainfallTrend < -10 ? 'decreasing' : 'stable';
  
  // ═══ SPI CALCULATION ═══
  const monthlyRainfall = sorted.map(r => r.rainfall_mm);
  const spiValues = calculateSPI(monthlyRainfall, 12);
  
  const spiTimeSeries = sorted.map((r, i) => ({
    year: r.year, month: r.month, spi: Math.round(spiValues[i] * 100) / 100
  }));
  
  const currentSPI = spiValues[spiValues.length - 1] || 0;
  const droughtStatus: TemporalAnalysisResult['currentDroughtStatus'] =
    currentSPI < -2.0 ? 'extreme' :
    currentSPI < -1.5 ? 'severe' :
    currentSPI < -1.0 ? 'moderate' :
    currentSPI < -0.5 ? 'mild' : 'none';
  
  // ═══ DROUGHT EVENTS ═══
  const droughtEvents = detectDroughtEvents(spiValues, sorted);
  const droughtFreq = years.length > 0 ? (droughtEvents.length / years.length) * 10 : 0;
  const avgDuration = droughtEvents.length > 0 ? droughtEvents.reduce((s, d) => s + d.duration_months, 0) / droughtEvents.length : 0;
  const maxDuration = droughtEvents.length > 0 ? Math.max(...droughtEvents.map(d => d.duration_months)) : 0;
  const returnPeriod = droughtEvents.length > 1 ? years.length / droughtEvents.length : years.length;
  const currentlyInDrought = currentSPI < -1.0;
  
  // ═══ SEASONAL PATTERNS ═══
  const monthlyAvg = Array.from({ length: 12 }, (_, m) => {
    const vals = sorted.filter(r => r.month === m + 1).map(r => r.rainfall_mm);
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  });
  
  const totalAvg = monthlyAvg.reduce((a, b) => a + b, 0);
  const wetThreshold = totalAvg / 12 * 1.2;
  const rainyMonths = monthlyAvg.filter(m => m > 50).length;
  
  // Find wet season (consecutive months above average)
  let maxWetStart = 0, maxWetLen = 0;
  for (let start = 0; start < 12; start++) {
    let len = 0;
    for (let j = 0; j < 12; j++) {
      if (monthlyAvg[(start + j) % 12] >= wetThreshold) len++;
      else if (len > 0) break;
    }
    if (len > maxWetLen) { maxWetLen = len; maxWetStart = start; }
  }
  
  const wetRainfall = Array.from({ length: maxWetLen }, (_, i) => monthlyAvg[(maxWetStart + i) % 12]).reduce((a, b) => a + b, 0);
  const wetPct = totalAvg > 0 ? (wetRainfall / totalAvg) * 100 : 0;
  
  const dryStart = (maxWetStart + maxWetLen) % 12;
  const dryLen = 12 - maxWetLen;
  
  // ═══ NDVI TRENDS ═══
  let ndviTrend: number | null = null;
  let ndviCorr: number | null = null;
  let vegStress = false;
  
  const ndviRecords = sorted.filter(r => r.ndvi !== undefined);
  if (ndviRecords.length >= 24) {
    const ndviYears = [...new Set(ndviRecords.map(r => r.year))];
    const annualNDVI = ndviYears.map(y => {
      const vals = ndviRecords.filter(r => r.year === y).map(r => r.ndvi!);
      return { year: y, avg: vals.reduce((a, b) => a + b, 0) / vals.length };
    });
    
    const ndviTrendResult = linearTrend(annualNDVI.map(a => a.year), annualNDVI.map(a => a.avg));
    ndviTrend = ndviTrendResult.slope * 10; // per decade
    
    // NDVI-rainfall correlation
    if (annualNDVI.length >= 5) {
      const matchedPairs = annualNDVI.filter(n => annualTotals.some(a => a.year === n.year));
      if (matchedPairs.length >= 3) {
        const rx = matchedPairs.map(p => annualTotals.find(a => a.year === p.year)!.total);
        const ry = matchedPairs.map(p => p.avg);
        const corrResult = linearTrend(rx, ry);
        ndviCorr = Math.sqrt(Math.max(0, corrResult.r2)) * Math.sign(corrResult.slope);
      }
    }
    
    // Vegetation stress: recent NDVI below long-term average
    const recentNDVI = annualNDVI.slice(-3).map(a => a.avg);
    const longTermNDVI = annualNDVI.map(a => a.avg).reduce((a, b) => a + b, 0) / annualNDVI.length;
    vegStress = recentNDVI.length > 0 && recentNDVI.every(v => v < longTermNDVI * 0.9);
  }
  
  // ═══ RECHARGE ESTIMATION ═══
  // Simplified recharge = rainfall × recharge fraction (climate-adjusted)
  const rechargeFraction = latitude > 0 
    ? Math.max(0.02, 0.25 - Math.abs(latitude) * 0.003) 
    : Math.max(0.02, 0.25 - Math.abs(latitude) * 0.003);
  
  const avgRecharge = meanAnnual * rechargeFraction;
  
  // Recharge in drought year (worst drought)
  const worstDrought = droughtEvents.sort((a, b) => a.minSPI - b.minSPI)[0];
  const droughtRecharge = worstDrought 
    ? avgRecharge * (1 - worstDrought.estimatedRechargeImpact_pct / 100)
    : avgRecharge * 0.5;
  
  // Recharge in wet year (top 10% rainfall year)
  const sortedAnnuals = annualTotals.map(a => a.total).sort((a, b) => b - a);
  const wetYearRainfall = sortedAnnuals[Math.floor(sortedAnnuals.length * 0.1)] || meanAnnual * 1.3;
  const wetRecharge = wetYearRainfall * rechargeFraction * 1.2;
  
  // Recharge trend
  const annualRecharges = annualTotals.map(a => a.total * rechargeFraction);
  const rechargeTrendResult = linearTrend(annualTotals.map(a => a.year), annualRecharges);
  const rechargeTrend = rechargeTrendResult.slope * 10;
  
  // ═══ SUSTAINABLE YIELD ═══
  const catchment = input.catchmentArea_km2 || 1; // km²
  const dailyRecharge = (avgRecharge * catchment * 1000) / 365; // m³/day
  const sustainableYield = dailyRecharge * 0.4; // safe fraction = 40%
  const droughtYield = (droughtRecharge * catchment * 1000) / 365 * 0.3; // more conservative in drought
  
  // Reliability: % of years where recharge > minimum needed
  const minNeeded = sustainableYield * 365 / (catchment * 1000);
  const reliableYears = annualRecharges.filter(r => r > minNeeded).length;
  const reliability = annualRecharges.length > 0 ? (reliableYears / annualRecharges.length) * 100 : 50;
  
  // Depletion risk
  const aquiferStorage = input.aquiferStorageEstimate_mm || meanAnnual * 2;
  const pumping = input.currentPumping_m3day || sustainableYield;
  const annualPumping_mm = (pumping * 365) / (catchment * 1000);
  
  let depletionRisk: TemporalAnalysisResult['depletionRiskUnderDrought'] = 'none';
  let yearsToDepletion: number | null = null;
  
  if (annualPumping_mm > avgRecharge) {
    const deficit = annualPumping_mm - droughtRecharge;
    yearsToDepletion = deficit > 0 ? aquiferStorage / deficit : null;
    depletionRisk = yearsToDepletion !== null && yearsToDepletion < 5 ? 'critical' :
                    yearsToDepletion !== null && yearsToDepletion < 10 ? 'high' :
                    yearsToDepletion !== null && yearsToDepletion < 20 ? 'moderate' : 'low';
  } else if (annualPumping_mm > droughtRecharge) {
    const droughtDeficit = annualPumping_mm - droughtRecharge;
    yearsToDepletion = droughtDeficit > 0 ? aquiferStorage / droughtDeficit : null;
    depletionRisk = yearsToDepletion !== null && yearsToDepletion < 10 ? 'moderate' : 'low';
  }
  
  // ═══ CLIMATE PROJECTIONS ═══
  // IPCC AR6 simplified: African rainfall ±10% by 2050
  // AUDIT FIX (2026-07-10): rainfallTrend is per-DECADE; use the true number
  // of decades to each horizon (was hard-coded 0.5/1.5, understating 2050 by
  // ~40% and disagreeing with the recharge model's projection horizon).
  const _nowYear = new Date().getFullYear();
  const _trendRatio = meanAnnual > 0 ? rainfallTrend / meanAnnual : 0;
  const projected2030 = meanAnnual * (1 + _trendRatio * Math.max(0, (2030 - _nowYear) / 10));
  const projected2050 = meanAnnual * (1 + _trendRatio * Math.max(0, (2050 - _nowYear) / 10));
  
  const projectedDroughtFreq = droughtFreq > 0 
    ? `${(droughtFreq * 1.3).toFixed(1)} events/decade (${((droughtFreq * 1.3 / droughtFreq - 1) * 100).toFixed(0)}% increase)`
    : 'Unknown';
  
  // ═══ RECOMMENDATIONS ═══
  const recommendations: string[] = [];
  const warnings: string[] = [];
  
  if (currentlyInDrought) {
    warnings.push(`Currently in ${droughtStatus} drought (SPI = ${currentSPI.toFixed(2)}). Reduce pumping to drought yield: ${droughtYield.toFixed(1)} m³/day.`);
  }
  
  if (trendDirection === 'decreasing') {
    warnings.push(`Declining rainfall trend: ${rainfallTrend.toFixed(0)} mm/decade. Long-term yield will decrease.`);
    recommendations.push('Install rainwater harvesting to supplement groundwater during dry spells');
  }
  
  if (cv > 0.3) {
    warnings.push(`High rainfall variability (CV = ${cv.toFixed(2)}). Yields will be unreliable year-to-year.`);
    recommendations.push('Design pumping scheme for drought conditions, not average conditions');
  }
  
  if (depletionRisk === 'critical' || depletionRisk === 'high') {
    warnings.push(`${depletionRisk.toUpperCase()} depletion risk under drought: ${yearsToDepletion?.toFixed(0) || '?'} years to depletion.`);
    recommendations.push('Reduce pumping rate or develop multiple boreholes to spread extraction');
  }
  
  if (vegStress) {
    warnings.push('Vegetation stress detected from NDVI trends — possible long-term drying');
  }
  
  recommendations.push(`Sustainable yield: ${sustainableYield.toFixed(1)} m³/day (drought-safe: ${droughtYield.toFixed(1)} m³/day)`);
  recommendations.push(`Design for ${dryLen > 0 ? dryLen : 4}-month dry season storage capacity`);
  
  if (maxDuration > 12) {
    recommendations.push(`Longest drought was ${maxDuration} months — plan for multi-year storage or alternative supply`);
  }
  
  // ═══ NARRATIVE ═══
  const narrative = [
    `Temporal analysis of ${years.length} years of data (${years[0]}–${years[years.length - 1]}).`,
    `Mean annual rainfall: ${meanAnnual.toFixed(0)} mm (CV: ${cv.toFixed(2)}, trend: ${rainfallTrend.toFixed(0)} mm/decade).`,
    `${droughtEvents.length} drought events detected (avg duration: ${avgDuration.toFixed(0)} months, return period: ${returnPeriod.toFixed(1)} years).`,
    currentlyInDrought ? `CURRENTLY IN ${droughtStatus.toUpperCase()} DROUGHT.` : 'No current drought.',
    `Estimated sustainable yield: ${sustainableYield.toFixed(1)} m³/day (${(reliability).toFixed(0)}% reliable).`,
    depletionRisk !== 'none' ? `Depletion risk: ${depletionRisk}.` : 'No significant depletion risk.',
  ].join(' ');
  
  return {
    yearsAnalyzed: years.length,
    totalMonths: sorted.length,
    meanAnnualRainfall_mm: Math.round(meanAnnual),
    rainfallTrend_mm_decade: Math.round(rainfallTrend),
    rainfallTrendDirection: trendDirection,
    rainfallCV: Math.round(cv * 100) / 100,
    spiTimeSeries,
    currentSPI: Math.round(currentSPI * 100) / 100,
    currentDroughtStatus: droughtStatus,
    droughtEvents,
    droughtFrequency_perDecade: Math.round(droughtFreq * 10) / 10,
    averageDroughtDuration_months: Math.round(avgDuration),
    longestDrought_months: maxDuration,
    droughtReturnPeriod_years: Math.round(returnPeriod * 10) / 10,
    currentlyInDrought,
    wetSeason: { startMonth: maxWetStart + 1, endMonth: ((maxWetStart + maxWetLen - 1) % 12) + 1, rainfall_pct: Math.round(wetPct) },
    drySeason: { startMonth: dryStart + 1, endMonth: ((dryStart + dryLen - 1) % 12) + 1, months: dryLen },
    rainyMonths,
    ndviTrend: ndviTrend !== null ? Math.round(ndviTrend * 1000) / 1000 : null,
    ndviCorrelationWithRainfall: ndviCorr !== null ? Math.round(ndviCorr * 100) / 100 : null,
    vegetationStress: vegStress,
    averageAnnualRecharge_mm: Math.round(avgRecharge),
    rechargeInDroughtYear_mm: Math.round(droughtRecharge),
    rechargeInWetYear_mm: Math.round(wetRecharge),
    rechargeTrend_mm_decade: Math.round(rechargeTrend),
    sustainableYield_m3day: Math.round(sustainableYield * 10) / 10,
    yieldDuringDrought_m3day: Math.round(droughtYield * 10) / 10,
    yieldReliability_pct: Math.round(reliability),
    depletionRiskUnderDrought: depletionRisk,
    yearsToDepletionInDrought: yearsToDepletion !== null ? Math.round(yearsToDepletion) : null,
    projectedRainfall2030_mm: Math.round(projected2030),
    projectedRainfall2050_mm: Math.round(projected2050),
    projectedDroughtFrequency2050: projectedDroughtFreq,
    recommendations,
    warnings,
    narrative
  };
}

function emptyResult(reason: string): TemporalAnalysisResult {
  return {
    yearsAnalyzed: 0, totalMonths: 0, meanAnnualRainfall_mm: 0,
    rainfallTrend_mm_decade: 0, rainfallTrendDirection: 'stable', rainfallCV: 0,
    spiTimeSeries: [], currentSPI: 0, currentDroughtStatus: 'none',
    droughtEvents: [], droughtFrequency_perDecade: 0, averageDroughtDuration_months: 0,
    longestDrought_months: 0, droughtReturnPeriod_years: 0, currentlyInDrought: false,
    wetSeason: { startMonth: 0, endMonth: 0, rainfall_pct: 0 },
    drySeason: { startMonth: 0, endMonth: 0, months: 0 }, rainyMonths: 0,
    ndviTrend: null, ndviCorrelationWithRainfall: null, vegetationStress: false,
    averageAnnualRecharge_mm: 0, rechargeInDroughtYear_mm: 0, rechargeInWetYear_mm: 0,
    rechargeTrend_mm_decade: 0,
    sustainableYield_m3day: 0, yieldDuringDrought_m3day: 0, yieldReliability_pct: 0,
    depletionRiskUnderDrought: 'none', yearsToDepletionInDrought: null,
    projectedRainfall2030_mm: 0, projectedRainfall2050_mm: 0, projectedDroughtFrequency2050: 'unknown',
    recommendations: [reason], warnings: [reason], narrative: reason
  };
}
