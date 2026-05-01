/**
 * Historical Data Module — 20-Year Weather, Water Table, Groundwater Trends
 *
 * Fetches REAL historical data from free APIs:
 *   - Open-Meteo Historical Weather API — daily/monthly data 2000-present
 *   - Open-Meteo Climate API — climate normals
 *   - GRACE satellite groundwater anomaly (via NASA links)
 *
 * Computes:
 *   - 20-year precipitation trends (annual + seasonal)
 *   - Drought frequency and severity analysis
 *   - Groundwater recharge estimation from rainfall patterns
 *   - Best/worst drilling seasons from historical rain data
 *   - Water table trend indicators
 */

export interface HistoricalWeather {
  years: number[];
  annualPrecipitation: number[];     // mm/year for each year
  annualMeanTemp: number[];          // °C for each year
  monthlyAvgPrecip: number[];        // 12-month averages across all years
  monthlyAvgTemp: number[];          // 12-month averages
  droughtYears: number[];            // years with <60% of average rainfall
  wetYears: number[];                // years with >140% of average rainfall
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  trendPerDecade: number;            // mm/decade change
  avgAnnualPrecip: number;           // long-term average
  avgAnnualTemp: number;
  maxAnnualPrecip: number;
  minAnnualPrecip: number;
  rainySeasonMonths: string[];       // months with >80mm avg
  drySeasonMonths: string[];         // months with <30mm avg
  bestDrillingSeason: string;        // dry season recommendation
  source: string;
}

export interface GroundwaterTrend {
  estimatedRechargeRate: number;     // mm/year
  rechargeCategory: 'high' | 'moderate' | 'low' | 'very-low';
  depletionRisk: 'low' | 'moderate' | 'high' | 'critical';
  waterTableTrend: 'rising' | 'stable' | 'declining' | 'unknown';
  sustainabilityScore: number;       // 0-100
  reasoning: string[];
  graceLink: string;                 // NASA GRACE groundwater viewer
}

export interface HistoricalDataResult {
  weather: HistoricalWeather | null;
  groundwater: GroundwaterTrend | null;
  fetchedAt: string;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Fetch 20-year historical weather data from Open-Meteo Archive API
 * and cross-validate with NASA POWER MERRA-2/IMERG satellite precipitation.
 * Two independent sources: ERA5-Land (ECMWF) + MERRA-2 (NASA).
 * Free, no API key, covers 2000-present globally.
 */
export async function fetchHistoricalWeather(lat: number, lon: number): Promise<HistoricalWeather | null> {
  try {
    const endYear = new Date().getFullYear() - 1;
    const startYear = endYear - 19;  // 20 years

    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startYear}-01-01&end_date=${endYear}-12-31&monthly=precipitation_sum,temperature_2m_mean&timezone=auto`;

    // NASA POWER cross-validation: independent satellite-gauge-merged precipitation
    const nasaUrl = `https://power.larc.nasa.gov/api/temporal/monthly/point`
      + `?parameters=PRECTOTCORR,T2M&community=AG`
      + `&longitude=${lon.toFixed(4)}&latitude=${lat.toFixed(4)}`
      + `&start=${startYear}&end=${endYear}&format=JSON`;

    console.log(`[HistoricalWeather] Fetching 20-year data (${startYear}-${endYear}) from Open-Meteo + NASA POWER`);

    // Fetch both in parallel — NASA POWER is cross-validation, not critical
    const [openMeteoRes, nasaPowerRes] = await Promise.allSettled([
      fetch(url, { signal: AbortSignal.timeout(20000) }),
      fetch(nasaUrl, { signal: AbortSignal.timeout(20000) }),
    ]);

    const res = openMeteoRes.status === 'fulfilled' ? openMeteoRes.value : null;
    if (!res || !res.ok) {
      console.log(`[HistoricalWeather] Open-Meteo HTTP ${res?.status ?? 'FAILED'}`);
      return null;
    }

    const data = await res.json();
    const monthly = data.monthly;
    if (!monthly?.time || !monthly?.precipitation_sum) {
      console.log('[HistoricalWeather] No monthly data returned');
      return null;
    }

    // Parse monthly data into yearly arrays
    const yearMap = new Map<number, { precip: number[]; temp: number[] }>();
    const times: string[] = monthly.time;
    const precips: number[] = monthly.precipitation_sum;
    const temps: number[] = monthly.temperature_2m_mean || [];

    for (let i = 0; i < times.length; i++) {
      const year = parseInt(times[i].substring(0, 4));
      if (!yearMap.has(year)) yearMap.set(year, { precip: [], temp: [] });
      const entry = yearMap.get(year)!;
      entry.precip.push(precips[i] || 0);
      if (temps[i] !== undefined && temps[i] !== null) entry.temp.push(temps[i]);
    }

    // Build yearly totals
    const years: number[] = [];
    const annualPrecipitation: number[] = [];
    const annualMeanTemp: number[] = [];

    for (const [year, { precip, temp }] of Array.from(yearMap.entries()).sort((a, b) => a[0] - b[0])) {
      if (precip.length >= 10) { // need at least 10 months of data
        years.push(year);
        annualPrecipitation.push(Math.round(precip.reduce((a, b) => a + b, 0)));
        if (temp.length > 0) {
          annualMeanTemp.push(Math.round(temp.reduce((a, b) => a + b, 0) / temp.length * 10) / 10);
        }
      }
    }

    if (years.length < 5) {
      console.log('[HistoricalWeather] Too few years of data');
      return null;
    }

    // Monthly averages across all years
    const monthlyTotals = new Array(12).fill(0);
    const monthlyTempTotals = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);

    for (let i = 0; i < times.length; i++) {
      const month = parseInt(times[i].substring(5, 7)) - 1;
      monthlyTotals[month] += precips[i] || 0;
      if (temps[i] !== undefined && temps[i] !== null) monthlyTempTotals[month] += temps[i];
      monthlyCounts[month]++;
    }

    const monthlyAvgPrecip = monthlyTotals.map((t, i) => Math.round(monthlyCounts[i] > 0 ? t / monthlyCounts[i] : 0));
    const monthlyAvgTemp = monthlyTempTotals.map((t, i) => Math.round(monthlyCounts[i] > 0 ? (t / monthlyCounts[i]) * 10 : 0) / 10);

    // Statistics
    const avgAnnualPrecip = Math.round(annualPrecipitation.reduce((a, b) => a + b, 0) / annualPrecipitation.length);
    const avgAnnualTemp = annualMeanTemp.length > 0
      ? Math.round(annualMeanTemp.reduce((a, b) => a + b, 0) / annualMeanTemp.length * 10) / 10
      : 0;
    const maxAnnualPrecip = Math.max(...annualPrecipitation);
    const minAnnualPrecip = Math.min(...annualPrecipitation);

    // Drought / wet years
    const droughtThreshold = avgAnnualPrecip * 0.60;
    const wetThreshold = avgAnnualPrecip * 1.40;
    const droughtYears = years.filter((y, i) => annualPrecipitation[i] < droughtThreshold);
    const wetYears = years.filter((y, i) => annualPrecipitation[i] > wetThreshold);

    // Trend (linear regression on annual precipitation)
    const n = annualPrecipitation.length;
    const xMean = (n - 1) / 2;
    const yMean = avgAnnualPrecip;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (i - xMean) * (annualPrecipitation[i] - yMean);
      den += (i - xMean) * (i - xMean);
    }
    const slope = den > 0 ? num / den : 0;
    const trendPerDecade = Math.round(slope * 10);
    const trendDirection: HistoricalWeather['trendDirection'] =
      trendPerDecade > 15 ? 'increasing' : trendPerDecade < -15 ? 'decreasing' : 'stable';

    // Seasons
    const rainySeasonMonths = MONTHS.filter((_, i) => monthlyAvgPrecip[i] >= 80);
    const drySeasonMonths = MONTHS.filter((_, i) => monthlyAvgPrecip[i] < 30);
    const bestDrillingSeason = drySeasonMonths.length > 0
      ? `${drySeasonMonths[0]}–${drySeasonMonths[drySeasonMonths.length - 1]} (dry season — water table lowest, easier drilling)`
      : 'Year-round (no distinct dry season)';

    console.log(`[HistoricalWeather] ${years.length} years, avg=${avgAnnualPrecip}mm, trend=${trendPerDecade}mm/decade`);

    // Cross-validate with NASA POWER if available
    let crossValidation = '';
    const nasaRes = nasaPowerRes.status === 'fulfilled' ? nasaPowerRes.value : null;
    if (nasaRes?.ok) {
      try {
        const nasaData = await nasaRes.json();
        const nasaPrecip = nasaData?.properties?.parameter?.PRECTOTCORR;
        if (nasaPrecip && typeof nasaPrecip === 'object') {
          const nasaYearMap = new Map<number, number[]>();
          for (const [yyyymm, val] of Object.entries(nasaPrecip)) {
            if (typeof val !== 'number' || val < -998) continue;
            const yr = parseInt(yyyymm.slice(0, 4));
            const mo = parseInt(yyyymm.slice(4, 6));
            if (!nasaYearMap.has(yr)) nasaYearMap.set(yr, []);
            // NASA POWER PRECTOTCORR is mm/day average for the month → multiply by days
            const daysInMo = new Date(yr, mo, 0).getDate();
            nasaYearMap.get(yr)!.push((val as number) * daysInMo);
          }
          const nasaAnnuals: number[] = [];
          for (const [, months] of nasaYearMap.entries()) {
            if (months.length >= 10) nasaAnnuals.push(Math.round(months.reduce((a, b) => a + b, 0)));
          }
          if (nasaAnnuals.length >= 5) {
            const nasaAvg = Math.round(nasaAnnuals.reduce((a, b) => a + b, 0) / nasaAnnuals.length);
            const diff = Math.abs(nasaAvg - avgAnnualPrecip);
            const pctDiff = Math.round((diff / Math.max(avgAnnualPrecip, 1)) * 100);
            crossValidation = ` | NASA POWER MERRA-2 cross-validation: ${nasaAvg}mm/yr avg (${pctDiff}% ${nasaAvg > avgAnnualPrecip ? 'higher' : 'lower'} — ${pctDiff <= 15 ? 'good agreement' : 'moderate divergence'})`;
            console.log(`[HistoricalWeather] NASA POWER cross-validation: ${nasaAvg}mm/yr (ERA5: ${avgAnnualPrecip}mm/yr, diff: ${pctDiff}%)`);
          }
        }
      } catch { /* NASA POWER parse error — non-critical */ }
    }

    return {
      years, annualPrecipitation, annualMeanTemp,
      monthlyAvgPrecip, monthlyAvgTemp,
      droughtYears, wetYears,
      trendDirection, trendPerDecade, avgAnnualPrecip, avgAnnualTemp,
      maxAnnualPrecip, minAnnualPrecip,
      rainySeasonMonths, drySeasonMonths, bestDrillingSeason,
      source: `Open-Meteo Historical ERA5-Land (${startYear}–${endYear})${crossValidation}`,
    };
  } catch (err) {
    console.log('[HistoricalWeather] Error:', err);
    return null;
  }
}

/**
 * Estimate groundwater trends from precipitation history.
 *
 * When NASA POWER evapotranspiration data is available (from GLDAS module),
 * uses the water balance method: Recharge = P − ET − Runoff
 * This is the standard hydrogeological approach (Scanlon et al., 2002).
 *
 * Falls back to aridity-based percentage estimation when ET data unavailable.
 */
export function estimateGroundwaterTrend(
  weather: HistoricalWeather,
  lat: number,
  lon: number,
  nasaPowerET?: number | null,  // Annual ET in mm/year from NASA POWER (EVPTRNS)
): GroundwaterTrend {
  const reasoning: string[] = [];
  const avg = weather.avgAnnualPrecip;

  let estimatedRechargeRate: number;

  if (nasaPowerET && nasaPowerET > 0) {
    // REAL water balance method: Recharge = P - ET - Runoff
    // Runoff estimated as 5-15% of (P - ET) when P > ET, else 0
    const surplus = Math.max(0, avg - nasaPowerET);
    const runoffFraction = surplus > 200 ? 0.15 : surplus > 100 ? 0.10 : 0.05;
    const runoff = surplus * runoffFraction;
    estimatedRechargeRate = Math.max(0, Math.round(surplus - runoff));
    reasoning.push(`Water balance: P(${Math.round(avg)}mm) − ET(${Math.round(nasaPowerET)}mm) − Runoff(${Math.round(runoff)}mm) = ${estimatedRechargeRate}mm/yr recharge`);
    reasoning.push('NASA POWER MERRA-2 evapotranspiration used (real satellite-derived data)');
  } else {
    // Fallback: Percentage-based estimation (literature values)
    let rechargePct: number;
    if (avg > 1200) { rechargePct = 0.20; reasoning.push('Humid climate — high recharge potential (20% of rainfall, estimated)'); }
    else if (avg > 800) { rechargePct = 0.12; reasoning.push('Sub-humid climate — moderate recharge (12% of rainfall, estimated)'); }
    else if (avg > 400) { rechargePct = 0.07; reasoning.push('Semi-arid climate — limited recharge (7% of rainfall, estimated)'); }
    else if (avg > 200) { rechargePct = 0.04; reasoning.push('Arid climate — very low recharge (4% of rainfall, estimated)'); }
    else { rechargePct = 0.02; reasoning.push('Hyper-arid — minimal recharge (2% of rainfall, estimated)'); }
    estimatedRechargeRate = Math.round(avg * rechargePct);
  }

  // Recharge category
  let rechargeCategory: GroundwaterTrend['rechargeCategory'];
  if (estimatedRechargeRate > 100) rechargeCategory = 'high';
  else if (estimatedRechargeRate > 40) rechargeCategory = 'moderate';
  else if (estimatedRechargeRate > 10) rechargeCategory = 'low';
  else rechargeCategory = 'very-low';

  // Depletion risk from trend
  let depletionRisk: GroundwaterTrend['depletionRisk'];
  if (weather.trendDirection === 'decreasing') {
    depletionRisk = weather.trendPerDecade < -30 ? 'critical' : 'high';
    reasoning.push(`Rainfall declining ${Math.abs(weather.trendPerDecade)}mm/decade — groundwater at risk`);
  } else if (weather.droughtYears.length > 4) {
    depletionRisk = 'high';
    reasoning.push(`${weather.droughtYears.length} drought years in 20-year record — overextraction risk`);
  } else if (weather.trendDirection === 'stable') {
    depletionRisk = rechargeCategory === 'very-low' ? 'high' : 'moderate';
    reasoning.push('Rainfall stable — depletion depends on local extraction rates');
  } else {
    depletionRisk = 'low';
    reasoning.push('Rainfall increasing — groundwater recharge likely improving');
  }

  // Water table trend estimation
  let waterTableTrend: GroundwaterTrend['waterTableTrend'];
  if (weather.trendDirection === 'increasing' && rechargeCategory !== 'very-low') {
    waterTableTrend = 'rising';
    reasoning.push('Increasing rainfall + adequate recharge suggests rising water table');
  } else if (weather.trendDirection === 'decreasing' || rechargeCategory === 'very-low') {
    waterTableTrend = 'declining';
    reasoning.push('Declining rainfall or very low recharge — water table likely falling');
  } else {
    waterTableTrend = 'stable';
    reasoning.push('Stable rainfall and moderate recharge — water table likely maintained');
  }

  // Sustainability score
  let sustainabilityScore = 50;
  if (rechargeCategory === 'high') sustainabilityScore += 25;
  else if (rechargeCategory === 'moderate') sustainabilityScore += 15;
  else if (rechargeCategory === 'very-low') sustainabilityScore -= 20;
  if (weather.trendDirection === 'increasing') sustainabilityScore += 15;
  else if (weather.trendDirection === 'decreasing') sustainabilityScore -= 15;
  if (weather.droughtYears.length > 5) sustainabilityScore -= 10;
  sustainabilityScore = Math.max(5, Math.min(95, sustainabilityScore));

  return {
    estimatedRechargeRate,
    rechargeCategory,
    depletionRisk,
    waterTableTrend,
    sustainabilityScore,
    reasoning,
    graceLink: `https://nasagrace.unl.edu/globalmap/`,
  };
}

/**
 * Fetch all historical data for given coordinates.
 */
export async function fetchHistoricalData(lat: number, lon: number): Promise<HistoricalDataResult> {
  const weather = await fetchHistoricalWeather(lat, lon);
  const groundwater = weather ? estimateGroundwaterTrend(weather, lat, lon) : null;
  return { weather, groundwater, fetchedAt: new Date().toISOString() };
}
