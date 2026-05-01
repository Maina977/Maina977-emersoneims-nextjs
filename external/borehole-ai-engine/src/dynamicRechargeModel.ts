/* ═══════════════════════════════════════════════════════════════════════
   DYNAMIC RECHARGE MODELING ENGINE
   Uses 5-10 years of rainfall → seasonal recharge patterns → sustainable yield
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────── */

export interface RechargeModelInput {
  latitude: number;
  longitude: number;

  // Historical rainfall (from historicalData module)
  annualPrecipitation: { year: number; total: number }[];  // mm/yr
  monthlyPrecipitation?: number[];  // 12 values, Jan-Dec avg

  // Evapotranspiration
  annualET_mm?: number;                 // from GLDAS/NASA POWER
  monthlyET?: number[];                 // 12 values

  // Soil and geology
  soilType?: string;
  rockType?: string;
  slopePercent?: number;
  vegetationCover?: number;       // 0-1
  imperviousFraction?: number;    // 0-1 (urban fraction)

  // Aquifer properties
  aquiferType?: 'unconfined' | 'confined' | 'semi-confined' | 'fractured_rock' | 'perched' | 'karst';
  porosity?: number;
  hydraulicConductivity_m_day?: number;
  aquiferThickness_m?: number;
  aquiferArea_km2?: number;       // estimated catchment area
  storativity?: number;

  // Pumping
  currentPumping_m3day?: number;
  plannedPumping_m3day?: number;
}

export interface MonthlyRecharge {
  month: number;       // 1-12
  monthName: string;
  precipitation_mm: number;
  et_mm: number;
  runoff_mm: number;
  soilMoistureDeficit_mm: number;
  grossRecharge_mm: number;
  netRecharge_mm: number;
  isRechargeMonth: boolean;
}

export interface RechargeModelResult {
  // Annual summary
  avgAnnualPrecipitation_mm: number;
  avgAnnualET_mm: number;
  avgAnnualRunoff_mm: number;
  avgAnnualRecharge_mm: number;
  rechargeFraction: number;          // recharge/precipitation
  rechargeMethod: string;            // which method was used

  // Monthly breakdown
  monthlyRecharge: MonthlyRecharge[];
  rechargeSeasons: { start: number; end: number; months: string }[];
  peakRechargeMonth: number;
  zeroRechargeMonths: number[];

  // Trend analysis (5-10 year)
  annualRechargeTimeSeries: { year: number; recharge_mm: number; precipitation_mm: number }[];
  rechargeTrend_mm_per_decade: number;
  trendDirection: 'increasing' | 'stable' | 'decreasing';
  droughtYears: number[];
  wetYears: number[];
  variabilityCoefficient: number;   // CV of annual recharge

  // Sustainable yield calculation
  sustainableYield_m3day: number;
  sustainableYield_m3hr: number;
  safeYieldFraction: number;        // sustainableYield / totalRecharge
  depletionRisk: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  yearsToDepletion?: number;        // if pumping > recharge

  // Water balance
  waterBalance: {
    totalInput_m3yr: number;
    totalOutput_m3yr: number;
    netChange_m3yr: number;
    surplus: boolean;
  };

  // Projections (climate change)
  projectedRecharge2030_mm: number;
  projectedRecharge2050_mm: number;
  climateRiskLevel: 'low' | 'moderate' | 'high';

  confidence: number;
  methodology: string;
  diagnostics: string[];
}

/* ── Soil-Dependent Recharge Coefficients ─────────────────── */

interface SoilRechargeParams {
  maxInfiltrationRate_mm_day: number;  // saturated infiltration capacity
  fieldCapacity_mm: number;            // per meter of soil
  wiltingPoint_mm: number;             // per meter of soil
  runoffCurveNumber: number;           // SCS-CN method
}

function getSoilRechargeParams(soilType?: string, rockType?: string): SoilRechargeParams {
  const soil = (soilType || '').toLowerCase();
  const rock = (rockType || '').toLowerCase();

  if (soil.includes('sandy') || rock.includes('sandstone') || rock.includes('alluvium'))
    return { maxInfiltrationRate_mm_day: 50, fieldCapacity_mm: 150, wiltingPoint_mm: 50, runoffCurveNumber: 55 };
  if (soil.includes('loam'))
    return { maxInfiltrationRate_mm_day: 25, fieldCapacity_mm: 300, wiltingPoint_mm: 100, runoffCurveNumber: 65 };
  if (soil.includes('clay') || rock.includes('shale'))
    return { maxInfiltrationRate_mm_day: 5, fieldCapacity_mm: 400, wiltingPoint_mm: 200, runoffCurveNumber: 80 };
  if (rock.includes('laterite'))
    return { maxInfiltrationRate_mm_day: 15, fieldCapacity_mm: 250, wiltingPoint_mm: 100, runoffCurveNumber: 72 };
  if (rock.includes('granite') || rock.includes('gneiss') || rock.includes('basalt'))
    return { maxInfiltrationRate_mm_day: 3, fieldCapacity_mm: 100, wiltingPoint_mm: 40, runoffCurveNumber: 85 };
  if (rock.includes('limestone') || rock.includes('karst'))
    return { maxInfiltrationRate_mm_day: 100, fieldCapacity_mm: 80, wiltingPoint_mm: 20, runoffCurveNumber: 45 };
  // Default
  return { maxInfiltrationRate_mm_day: 20, fieldCapacity_mm: 250, wiltingPoint_mm: 100, runoffCurveNumber: 68 };
}

/* ── SCS Curve Number Runoff Method ───────────────────────── */

function scsRunoff(precipitation_mm: number, curveNumber: number, slopePct: number, imperviousFrac: number): number {
  // Adjust CN for slope (Williams 1995)
  const cnAdjusted = Math.min(98, curveNumber * (1 + 0.005 * slopePct));
  // Adjust for impervious fraction
  const cnFinal = Math.min(98, cnAdjusted + (100 - cnAdjusted) * imperviousFrac);

  // SCS-CN equation
  const S = (25400 / cnFinal) - 254;  // Maximum retention (mm)
  const Ia = 0.2 * S;                  // Initial abstraction

  if (precipitation_mm <= Ia) return 0;
  const Q = (precipitation_mm - Ia) ** 2 / (precipitation_mm - Ia + S);
  return Math.max(0, Q);
}

/* ── Thornthwaite Soil Water Balance ──────────────────────── */

function computeMonthlyRecharge(
  monthlyP: number[],
  monthlyET: number[],
  soilParams: SoilRechargeParams,
  slopePct: number,
  imperviousFrac: number,
  vegCover: number,
): MonthlyRecharge[] {
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const rootZoneCapacity = soilParams.fieldCapacity_mm - soilParams.wiltingPoint_mm; // available water capacity
  let soilMoisture = rootZoneCapacity * 0.5; // start at 50% capacity

  const results: MonthlyRecharge[] = [];

  for (let m = 0; m < 12; m++) {
    const P = monthlyP[m] || 0;
    const ET = monthlyET[m] || 0;

    // Step 1: Runoff (SCS-CN)
    const runoff = scsRunoff(P, soilParams.runoffCurveNumber, slopePct, imperviousFrac);

    // Step 2: Effective precipitation (after runoff)
    const Peff = Math.max(0, P - runoff);

    // Step 3: Actual ET (limited by soil moisture)
    // Vegetation adjustment: bare soil ET = 0.4 × PET, full veg = 1.0 × PET
    const vegFactor = 0.4 + 0.6 * vegCover;
    const potentialET = ET * vegFactor;
    const actualET = Math.min(potentialET, Peff + soilMoisture);

    // Step 4: Soil moisture update
    const surplus = Peff - actualET;
    if (surplus > 0) {
      soilMoisture += surplus;
      const recharge = Math.max(0, soilMoisture - rootZoneCapacity);
      soilMoisture = Math.min(soilMoisture, rootZoneCapacity);

      results.push({
        month: m + 1,
        monthName: MONTH_NAMES[m],
        precipitation_mm: Math.round(P),
        et_mm: Math.round(actualET),
        runoff_mm: Math.round(runoff),
        soilMoistureDeficit_mm: Math.round(Math.max(0, rootZoneCapacity - soilMoisture)),
        grossRecharge_mm: Math.round(recharge + surplus * 0.1), // some bypass flow
        netRecharge_mm: Math.round(recharge),
        isRechargeMonth: recharge > 0,
      });
    } else {
      // Deficit period
      soilMoisture = Math.max(0, soilMoisture + surplus);
      results.push({
        month: m + 1,
        monthName: MONTH_NAMES[m],
        precipitation_mm: Math.round(P),
        et_mm: Math.round(actualET),
        runoff_mm: Math.round(runoff),
        soilMoistureDeficit_mm: Math.round(Math.max(0, rootZoneCapacity - soilMoisture)),
        grossRecharge_mm: 0,
        netRecharge_mm: 0,
        isRechargeMonth: false,
      });
    }
  }

  return results;
}

/* ── Annual Recharge Time Series ──────────────────────────── */

function computeAnnualRecharge(
  annualP: { year: number; total: number }[],
  annualET: number,
  soilParams: SoilRechargeParams,
  slopePct: number,
  imperviousFrac: number,
): { year: number; recharge_mm: number; precipitation_mm: number }[] {
  return annualP.map(({ year, total }) => {
    const runoff = scsRunoff(total, soilParams.runoffCurveNumber, slopePct, imperviousFrac);
    const effectiveP = Math.max(0, total - runoff);
    const actualET = Math.min(annualET, effectiveP * 0.8);
    const surplus = effectiveP - actualET;
    const recharge = Math.max(0, surplus * 0.6); // ~60% of surplus percolates
    return { year, recharge_mm: Math.round(recharge), precipitation_mm: total };
  });
}

/* ── Trend Analysis ───────────────────────────────────────── */

function linearTrend(values: number[]): number {
  const n = values.length;
  if (n < 3) return 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope * 10; // per decade (assuming annual data)
}

function coefficientOfVariation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b) / values.length;
  if (mean === 0) return 0;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / mean;
}

/* ── Main Function ────────────────────────────────────────── */

export function modelDynamicRecharge(input: RechargeModelInput): RechargeModelResult {
  const diagnostics: string[] = [];

  // Soil parameters
  const soilParams = getSoilRechargeParams(input.soilType, input.rockType);
  const slopePct = input.slopePercent ?? 5;
  const imperviousFrac = input.imperviousFraction ?? 0;
  const vegCover = input.vegetationCover ?? 0.5;

  // Average precipitation
  const avgP = input.annualPrecipitation.reduce((s, y) => s + y.total, 0) / Math.max(1, input.annualPrecipitation.length);

  // ET: use provided or estimate from precipitation ratio
  const annualET = input.annualET_mm ?? estimateET(avgP, input.latitude);
  diagnostics.push(`Annual P=${Math.round(avgP)} mm, ET=${Math.round(annualET)} mm`);

  // Monthly breakdown
  const monthlyP = input.monthlyPrecipitation ?? estimateMonthlyFromAnnual(avgP, input.latitude);
  const monthlyET = input.monthlyET ?? distributeETMonthly(annualET, input.latitude);

  // Monthly recharge
  const monthlyRecharge = computeMonthlyRecharge(monthlyP, monthlyET, soilParams, slopePct, imperviousFrac, vegCover);
  const avgAnnualRecharge = monthlyRecharge.reduce((s, m) => s + m.netRecharge_mm, 0);
  const avgAnnualRunoff = monthlyRecharge.reduce((s, m) => s + m.runoff_mm, 0);

  diagnostics.push(`Recharge: ${Math.round(avgAnnualRecharge)} mm/yr (${avgP > 0 ? (avgAnnualRecharge / avgP * 100).toFixed(1) : '0.0'}% of P)${avgAnnualRecharge < 20 && avgP > 200 ? ' — Note: Despite low local recharge, sustained yield may be supported by regional groundwater flow through fractured bedrock or lateral aquifer inflow.' : ''}`);

  // Annual time series
  const annualSeries = computeAnnualRecharge(input.annualPrecipitation, annualET, soilParams, slopePct, imperviousFrac);
  const rechargeValues = annualSeries.map(s => s.recharge_mm);
  const trend = linearTrend(rechargeValues);
  const cv = coefficientOfVariation(rechargeValues);
  const avgRechargeFromSeries = rechargeValues.length > 0 ? rechargeValues.reduce((a, b) => a + b) / rechargeValues.length : avgAnnualRecharge;

  // Drought/wet years
  const droughtYears = annualSeries.filter(s => s.recharge_mm < avgRechargeFromSeries * 0.5).map(s => s.year);
  const wetYears = annualSeries.filter(s => s.recharge_mm > avgRechargeFromSeries * 1.5).map(s => s.year);

  // Trend direction
  const trendDirection: RechargeModelResult['trendDirection'] =
    trend > 5 ? 'increasing' : trend < -5 ? 'decreasing' : 'stable';

  // Recharge seasons
  const rechargeMonths = monthlyRecharge.filter(m => m.isRechargeMonth).map(m => m.month);
  const rechargeSeasons = identifySeasons(rechargeMonths);

  // Peak recharge month
  const peakMonth = monthlyRecharge.reduce((best, m) => m.netRecharge_mm > best.netRecharge_mm ? m : best, monthlyRecharge[0]).month;
  const zeroMonths = monthlyRecharge.filter(m => !m.isRechargeMonth).map(m => m.month);

  // ── Sustainable Yield ──────────────────────────────────
  const aquiferArea = input.aquiferArea_km2 ?? 10; // km²
  const totalRecharge_m3yr = avgAnnualRecharge / 1000 * aquiferArea * 1e6; // mm → m × km² → m³
  const safeYieldFraction = input.aquiferType === 'confined' ? 0.3 : input.aquiferType === 'fractured_rock' ? 0.4 : 0.5;
  const sustainableYield_m3day = totalRecharge_m3yr * safeYieldFraction / 365;
  const sustainableYield_m3hr = sustainableYield_m3day / 24;

  // Depletion risk
  const pumping = input.plannedPumping_m3day ?? input.currentPumping_m3day ?? 0;
  let depletionRisk: RechargeModelResult['depletionRisk'] = 'none';
  let yearsToDepletion: number | undefined;

  if (pumping > 0) {
    const ratio = pumping / sustainableYield_m3day;
    if (ratio > 2) { depletionRisk = 'critical'; yearsToDepletion = 2; }
    else if (ratio > 1.5) { depletionRisk = 'high'; yearsToDepletion = 5; }
    else if (ratio > 1) { depletionRisk = 'moderate'; yearsToDepletion = 15; }
    else if (ratio > 0.7) { depletionRisk = 'low'; }
    diagnostics.push(`Pumping/recharge ratio: ${ratio.toFixed(2)} → ${depletionRisk} depletion risk`);
  }

  // Storage estimate
  const storativity = input.storativity ?? (input.aquiferType === 'confined' ? 0.001 : 0.1);
  const thickness = input.aquiferThickness_m ?? 20;
  const totalStorage_m3 = storativity * thickness * aquiferArea * 1e6;
  if (pumping > sustainableYield_m3day && totalStorage_m3 > 0) {
    const netDeficit_m3day = pumping - sustainableYield_m3day;
    yearsToDepletion = Math.round(totalStorage_m3 / (netDeficit_m3day * 365));
  }

  // Water balance
  const totalInput = totalRecharge_m3yr;
  const totalOutput = pumping * 365 + totalRecharge_m3yr * 0.2; // pumping + baseflow
  const waterBalance = {
    totalInput_m3yr: Math.round(totalInput),
    totalOutput_m3yr: Math.round(totalOutput),
    netChange_m3yr: Math.round(totalInput - totalOutput),
    surplus: totalInput > totalOutput,
  };

  // Climate projections (simple scaling)
  const projectedRecharge2030 = avgAnnualRecharge * (1 + trend / avgAnnualRecharge * 0.5);
  const projectedRecharge2050 = avgAnnualRecharge * (1 + trend / avgAnnualRecharge * 2);
  const climateRiskLevel: RechargeModelResult['climateRiskLevel'] =
    trendDirection === 'decreasing' && cv > 0.4 ? 'high'
    : trendDirection === 'decreasing' || cv > 0.3 ? 'moderate'
    : 'low';

  const confidence = Math.min(0.92, 0.4 +
    (input.annualPrecipitation.length >= 10 ? 0.15 : input.annualPrecipitation.length >= 5 ? 0.1 : 0.05) +
    (input.annualET_mm ? 0.15 : 0.05) +
    (input.monthlyPrecipitation ? 0.1 : 0) +
    (input.aquiferType ? 0.05 : 0) +
    (input.storativity ? 0.1 : 0));

  return {
    avgAnnualPrecipitation_mm: Math.round(avgP),
    avgAnnualET_mm: Math.round(annualET),
    avgAnnualRunoff_mm: Math.round(avgAnnualRunoff),
    avgAnnualRecharge_mm: Math.round(avgAnnualRecharge),
    rechargeFraction: avgP > 0 ? Math.max(0, Math.min(1, Math.round(avgAnnualRecharge / avgP * 1000) / 1000)) : 0,
    rechargeMethod: 'Modified Thornthwaite soil-water balance + SCS-CN runoff (Allen et al. 1998, SCS 1972)',
    monthlyRecharge,
    rechargeSeasons,
    peakRechargeMonth: peakMonth,
    zeroRechargeMonths: zeroMonths,
    annualRechargeTimeSeries: annualSeries,
    rechargeTrend_mm_per_decade: Math.round(trend * 10) / 10,
    trendDirection,
    droughtYears,
    wetYears,
    variabilityCoefficient: Math.round(cv * 1000) / 1000,
    sustainableYield_m3day: Math.round(sustainableYield_m3day),
    sustainableYield_m3hr: Math.round(sustainableYield_m3hr * 100) / 100,
    safeYieldFraction,
    depletionRisk,
    yearsToDepletion,
    waterBalance,
    projectedRecharge2030_mm: Math.round(projectedRecharge2030),
    projectedRecharge2050_mm: Math.round(projectedRecharge2050),
    climateRiskLevel,
    confidence,
    methodology: 'Thornthwaite soil-water balance with SCS-CN runoff, monthly time-step, 5-10yr rainfall record (Thornthwaite & Mather 1957)',
    diagnostics,
  };
}

/* ── Helper Functions ─────────────────────────────────────── */

function estimateET(precipitation_mm: number, latitude: number): number {
  // Turc (1961) formula approximation: ET = P / sqrt(0.9 + P²/L²)
  // L = 300 + 25T + 0.05T³ (T = mean annual temperature)
  const T = Math.max(5, 30 - Math.abs(latitude) * 0.5); // rough temp estimate
  const L = 300 + 25 * T + 0.05 * T * T * T;
  return precipitation_mm / Math.sqrt(0.9 + (precipitation_mm * precipitation_mm) / (L * L));
}

function estimateMonthlyFromAnnual(annualP: number, latitude: number): number[] {
  // Seasonal distribution by latitude zone
  const monthly = new Array(12).fill(0);
  const tropicalPattern = [0.05, 0.04, 0.08, 0.12, 0.10, 0.06, 0.05, 0.06, 0.10, 0.12, 0.12, 0.10]; // bimodal
  const temperatePattern = [0.06, 0.06, 0.07, 0.08, 0.09, 0.10, 0.10, 0.10, 0.09, 0.08, 0.08, 0.07]; // uniform
  const sahelPattern = [0.01, 0.01, 0.02, 0.05, 0.10, 0.15, 0.20, 0.20, 0.12, 0.08, 0.04, 0.02]; // unimodal wet season

  let pattern: number[];
  if (Math.abs(latitude) < 10) pattern = tropicalPattern;
  else if (Math.abs(latitude) < 20) pattern = sahelPattern;
  else pattern = temperatePattern;

  // Southern hemisphere: shift by 6 months
  if (latitude < 0) {
    const shifted = [...pattern.slice(6), ...pattern.slice(0, 6)];
    pattern = shifted;
  }

  for (let m = 0; m < 12; m++) {
    monthly[m] = annualP * pattern[m];
  }
  return monthly;
}

function distributeETMonthly(annualET: number, latitude: number): number[] {
  // ET is temperature-driven: peaks in summer
  const monthly = new Array(12).fill(0);
  for (let m = 0; m < 12; m++) {
    // Temperature proxy: sine wave peaking in summer
    const dayOfYear = m * 30 + 15;
    let tempFactor: number;
    if (latitude >= 0) {
      // Northern hemisphere: peak July
      tempFactor = 0.5 + 0.5 * Math.sin((dayOfYear - 81) * 2 * Math.PI / 365);
    } else {
      // Southern hemisphere: peak January
      tempFactor = 0.5 + 0.5 * Math.sin((dayOfYear + 100) * 2 * Math.PI / 365);
    }
    // Tropical: less seasonal variation
    if (Math.abs(latitude) < 15) {
      tempFactor = 0.7 + 0.3 * tempFactor;
    }
    monthly[m] = tempFactor;
  }
  // Normalize to annual total
  const total = monthly.reduce((a, b) => a + b);
  return monthly.map(v => annualET * v / total);
}

function identifySeasons(rechargeMonths: number[]): { start: number; end: number; months: string }[] {
  if (rechargeMonths.length === 0) return [];
  const NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const sorted = [...rechargeMonths].sort((a, b) => a - b);
  const seasons: { start: number; end: number; months: string }[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1 || (end === 12 && sorted[i] === 1)) {
      end = sorted[i];
    } else {
      seasons.push({ start, end, months: `${NAMES[start]}-${NAMES[end]}` });
      start = sorted[i];
      end = sorted[i];
    }
  }
  seasons.push({ start, end, months: `${NAMES[start]}-${NAMES[end]}` });
  return seasons;
}
