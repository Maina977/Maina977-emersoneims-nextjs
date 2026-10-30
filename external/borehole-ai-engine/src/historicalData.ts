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
  /** Alias read by the analyzer and the UI (they never matched avgAnnualPrecip; 2026-10-20). */
  averageAnnualPrecipitation?: number;
  averageTemperature?: number;
  /** Set when ERA5 and NASA POWER disagree by more than 30%. */
  precipitationNote?: string;
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
 * One consistent daily series from the two models Open-Meteo returns.
 * ECMWF IFS (9 km, from 2017) is used where it exists. Earlier days come from
 * ERA5, scaled by the calendar-month ratio IFS/ERA5 over the years both cover
 * (linear-scaling bias correction), so the record is on one footing and the
 * trend and drought years are not artefacts of the change of model.
 * Temperature is ERA5 throughout. With no IFS overlap, ERA5 is used as it is.
 */
export function spliceEra5ToIfs(daily: any): any {
  const time: string[] = daily?.time ?? [];
  const ifs: (number | null)[] | undefined = daily?.precipitation_sum_ecmwf_ifs;
  const era: (number | null)[] | undefined = daily?.precipitation_sum_era5;
  if (!Array.isArray(ifs) && !Array.isArray(era)) return daily; // single-model shape
  const tEra: (number | null)[] = daily?.temperature_2m_mean_era5 ?? [];
  const tIfs: (number | null)[] = daily?.temperature_2m_mean_ecmwf_ifs ?? [];
  const sumI = Array(12).fill(0), sumE = Array(12).fill(0);
  let totI = 0, totE = 0;
  time.forEach((d, i) => {
    const a = ifs?.[i], b = era?.[i];
    if (typeof a === 'number' && typeof b === 'number') {
      const m = Number(d.slice(5, 7)) - 1;
      sumI[m] += a; sumE[m] += b; totI += a; totE += b;
    }
  });
  const overall = totE > 0 ? totI / totE : 1;
  // A month with almost no ERA5 rain in the overlap gives an unstable ratio;
  // the overall ratio is used for it instead.
  const factor = sumE.map((e, m) => (e >= 20 ? sumI[m] / e : overall));
  const precipitation_sum = time.map((d, i) => {
    const a = ifs?.[i];
    if (typeof a === 'number') return a;
    const b = era?.[i];
    return typeof b === 'number' ? b * (totE > 0 ? factor[Number(d.slice(5, 7)) - 1] : 1) : null;
  });
  const temperature_2m_mean = time.map((_, i) => (typeof tEra[i] === 'number' ? tEra[i] : tIfs[i] ?? null));
  return { time, precipitation_sum, temperature_2m_mean, era5ScaleToIfs: Math.round(overall * 100) / 100 };
}

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

    // DAILY, summed to months below: the archive API answers HTTP 400 to
    // "monthly=" (measured 2026-10-19), so the Climate tab was always empty.
    // Two named models (2026-10-29): the default "best_match" series is ERA5
    // (0.25 deg) up to 2016 and ECMWF IFS (9 km) from 2017, joined with no
    // adjustment. In the Kenyan highlands ERA5 rains far more (Eldoret ~1,930
    // mm/yr against ~1,015 from IFS and a station normal near 1,100), so the
    // 20-year mean was inflated and the "trend" was the join. See
    // spliceEra5ToIfs below.
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startYear}-01-01&end_date=${endYear}-12-31&daily=precipitation_sum,temperature_2m_mean&models=ecmwf_ifs,era5&timezone=auto`;

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

    // NASA POWER is read once here: it is the cross-check when Open-Meteo answers,
    // and the SOURCE when Open-Meteo does not (2026-10-19 re-audit: a 20-year daily
    // request is heavy on Open-Meteo's free quota and was rate-limited (429), so the
    // Climate tab said "NO DATA" even though NASA had answered).
    const nasaResp = nasaPowerRes.status === 'fulfilled' && nasaPowerRes.value.ok ? nasaPowerRes.value : null;
    const nasaJson: any = nasaResp ? await nasaResp.json().catch(() => null) : null;

    const res = openMeteoRes.status === 'fulfilled' ? openMeteoRes.value : null;
    let usedNasaOnly = false;
    let data: any = null;
    if (res && res.ok) {
      data = await res.json().catch(() => null);
      if (data?.daily) data.daily = spliceEra5ToIfs(data.daily);
    } else {
      console.log(`[HistoricalWeather] Open-Meteo HTTP ${res?.status ?? 'FAILED'} — trying NASA POWER monthly instead`);
    }
    if (!data?.daily && nasaJson?.properties?.parameter?.PRECTOTCORR) {
      // Rebuild a "daily" shape from NASA monthly means (mm/day × days in month),
      // skipping the YYYY13 annual means.
      const P = nasaJson.properties.parameter.PRECTOTCORR as Record<string, number>;
      const T = (nasaJson.properties.parameter.T2M || {}) as Record<string, number>;
      const time: string[] = [];
      const precipitation_sum: number[] = [];
      const temperature_2m_mean: (number | null)[] = [];
      for (const k of Object.keys(P).sort()) {
        const mo = parseInt(k.slice(4, 6));
        if (mo < 1 || mo > 12 || !(P[k] > -998)) continue;
        const yr = parseInt(k.slice(0, 4));
        time.push(`${k.slice(0, 4)}-${k.slice(4, 6)}-01`);
        precipitation_sum.push(P[k] * new Date(yr, mo, 0).getDate());
        temperature_2m_mean.push(T[k] > -998 ? T[k] : null);
      }
      data = { daily: { time, precipitation_sum, temperature_2m_mean } };
      usedNasaOnly = true;
    }
    if (!data?.daily) return null;
    const daily = data.daily;
    // Sum daily rain (and average daily temperature) into calendar months.
    const monthly: { time: string[]; precipitation_sum: number[]; temperature_2m_mean: number[] } | null =
      daily?.time && daily?.precipitation_sum ? (() => {
        const order: string[] = [];
        const acc = new Map<string, { p: number; t: number; n: number }>();
        for (let i = 0; i < daily.time.length; i++) {
          const ym = String(daily.time[i]).substring(0, 7);
          if (!acc.has(ym)) { acc.set(ym, { p: 0, t: 0, n: 0 }); order.push(ym); }
          const a = acc.get(ym)!;
          a.p += Number(daily.precipitation_sum[i]) || 0;
          const tv = daily.temperature_2m_mean?.[i];
          if (tv !== null && tv !== undefined) { a.t += Number(tv); a.n++; }
        }
        return {
          time: order,
          precipitation_sum: order.map((m) => Math.round(acc.get(m)!.p * 10) / 10),
          temperature_2m_mean: order.map((m) => (acc.get(m)!.n ? Math.round((acc.get(m)!.t / acc.get(m)!.n) * 10) / 10 : (null as unknown as number))),
        };
      })() : null;
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

    // Seasons (rainy/dry month lists are set after reconciliation, below).
    // The four driest months, listed — the same rule as the web page. A
    // first-to-last range ("Jan-Oct") swallowed the rains between them
    // (2026-10-25 audit).
    const driest = MONTHS.map((m, i) => ({ m, i, mm: monthlyAvgPrecip[i] }))
      .sort((a, b) => a.mm - b.mm).slice(0, 4).sort((a, b) => a.i - b.i).map((x) => x.m);
    const bestDrillingSeason = monthlyAvgPrecip.some((v) => v > 0)
      ? `Drier months: ${driest.join(', ')} (easier site access; water table usually lowest)`
      : 'No monthly rainfall record';

    console.log(`[HistoricalWeather] ${years.length} years, avg=${avgAnnualPrecip}mm, trend=${trendPerDecade}mm/decade`);

    // Cross-validate with NASA POWER if available
    let crossValidation = '';
    let nasaAvgForCheck = 0;
    if (nasaJson && !usedNasaOnly) {
      try {
        const nasaData = nasaJson;
        const nasaPrecip = nasaData?.properties?.parameter?.PRECTOTCORR;
        if (nasaPrecip && typeof nasaPrecip === 'object') {
          const nasaYearMap = new Map<number, number[]>();
          for (const [yyyymm, val] of Object.entries(nasaPrecip)) {
            if (typeof val !== 'number' || val < -998) continue;
            const yr = parseInt(yyyymm.slice(0, 4));
            const mo = parseInt(yyyymm.slice(4, 6));
            if (mo < 1 || mo > 12) continue; // YYYY13 is NASA's annual mean, not a month (it doubled rainfall; 2026-10-19)
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
            // Median, not mean: single NASA years of 2,150-2,264 mm at semi-arid
            // sites dragged the mean far above the reanalysis (2026-10-30 audit).
            const sorted = [...nasaAnnuals].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            const nasaAvg = Math.round(sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2);
            nasaAvgForCheck = nasaAvg;
            const diff = Math.abs(nasaAvg - avgAnnualPrecip);
            const pctDiff = Math.round((diff / Math.max(avgAnnualPrecip, 1)) * 100);
            crossValidation = ` | NASA POWER MERRA-2 cross-check: ${nasaAvg} mm/yr median year (${pctDiff}% ${nasaAvg > avgAnnualPrecip ? 'higher' : 'lower'} — ${pctDiff <= 15 ? 'good agreement' : pctDiff <= 35 ? 'moderate divergence' : 'large divergence: the two sources disagree, so rainfall here is uncertain'})`;
            console.log(`[HistoricalWeather] NASA POWER cross-validation: ${nasaAvg}mm/yr (ERA5: ${avgAnnualPrecip}mm/yr, diff: ${pctDiff}%)`);
          }
        }
      } catch { /* NASA POWER parse error — non-critical */ }
    }

    // Two sources, one figure (2026-10-20 audit: Lodwar showed 442 mm/yr from
    // ERA5 while NASA POWER gave 297; the long-term mean is near 200). When they
    // differ by more than 30%, the LOWER is used — rainfall drives recharge and
    // the sustainable yield, so the cautious figure is the safe one — and the
    // spread is stated. The yearly and monthly series are scaled to match.
    let scale = 1;
    let precipitationNote: string | undefined;
    if (nasaAvgForCheck > 0 && avgAnnualPrecip > 0 && Math.max(nasaAvgForCheck, avgAnnualPrecip) / Math.min(nasaAvgForCheck, avgAnnualPrecip) > 1.3) {
      const lo = Math.min(nasaAvgForCheck, avgAnnualPrecip);
      scale = lo / avgAnnualPrecip;
      const hi = Math.max(nasaAvgForCheck, avgAnnualPrecip);
      // Beyond 1.6x the higher figure is not offered as a plausible bound
      // (2026-10-30 audit: Kisumu's NASA 2,264 mm was shown as one).
      precipitationNote = `Rainfall sources disagree: ECMWF reanalysis ${avgAnnualPrecip} mm/yr, NASA POWER ${nasaAvgForCheck} mm/yr (median year). ${hi / lo > 1.6 ? `The higher figure is likely an overestimate here; ${lo} mm/yr is used` : `Long-term rainfall here is probably between ${lo} and ${hi} mm/yr; the lower figure is used for recharge as the cautious choice`}.${lo < 450 ? ' In arid areas both can overstate rainfall; a local weather-station record is the better reference.' : ''}`;
    }
    const sc = (v: number) => Math.round(v * scale);
    const avgP = sc(avgAnnualPrecip);
    // Rainy and dry months from the reconciled series (2026-10-30 audit: the
    // 80/30 mm thresholds were applied before scaling, so a month the page
    // showed at 60 mm was listed as rainy).
    const scaledMonthly = monthlyAvgPrecip.map(sc);
    return {
      years, annualPrecipitation: annualPrecipitation.map(sc), annualMeanTemp,
      monthlyAvgPrecip: scaledMonthly, monthlyAvgTemp,
      droughtYears, wetYears,
      trendDirection, trendPerDecade: sc(trendPerDecade), avgAnnualPrecip: avgP, avgAnnualTemp,
      averageAnnualPrecipitation: avgP, averageTemperature: avgAnnualTemp, precipitationNote,
      maxAnnualPrecip: sc(maxAnnualPrecip), minAnnualPrecip: sc(minAnnualPrecip),
      rainySeasonMonths: MONTHS.filter((_, i) => scaledMonthly[i] >= 80),
      drySeasonMonths: MONTHS.filter((_, i) => scaledMonthly[i] < 30),
      bestDrillingSeason,
      source: usedNasaOnly
        ? `NASA POWER monthly (${startYear}–${endYear}); Open-Meteo ECMWF reanalysis did not answer`
        : `Open-Meteo ECMWF reanalysis (${startYear}–${endYear}): IFS 9 km from 2017; ERA5 before 2017, scaled to IFS month by month${daily.era5ScaleToIfs != null ? ` (ERA5 x${daily.era5ScaleToIfs} here)` : ''}${crossValidation}`,
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
  const hw = await fetchHistoricalWeather(lat, lon);
  const groundwater = hw ? estimateGroundwaterTrend(hw, lat, lon) : null;
  // The report, the Climate tab and the analyzer read the AnalysisResult shape
  // (types.ts): a year count, {year,total} rows, seasonal sums and
  // averageAnnualPrecipitation. This module returned a different shape, so the
  // analyzer ran on its 600-800 mm defaults and the Climate tab showed NaN
  // (2026-10-20). The original fields are kept alongside.
  const weather: any = hw ? {
    ...hw,
    years: hw.years.length,
    yearList: hw.years,
    annualPrecipitation: hw.years.map((y, i) => ({ year: y, total: hw.annualPrecipitation[i] })),
    annualTemperature: hw.years.map((y, i) => ({ year: y, avg: hw.annualMeanTemp[i] })).filter((r) => Number.isFinite(r.avg)),
    seasonalAnalysis: [
      { season: "Dec-Feb", months: "Dec, Jan, Feb", m: [11, 0, 1] },
      { season: "Mar-May", months: "Mar, Apr, May", m: [2, 3, 4] },
      { season: "Jun-Aug", months: "Jun, Jul, Aug", m: [5, 6, 7] },
      { season: "Sep-Nov", months: "Sep, Oct, Nov", m: [8, 9, 10] },
    ].map((s) => ({ season: s.season, months: s.months, avgPrecipitation: s.m.reduce((acc, k) => acc + (hw.monthlyAvgPrecip[k] || 0), 0) })),
    averageAnnualPrecipitation: hw.avgAnnualPrecip,
    averageTemperature: hw.avgAnnualTemp,
  } : null;
  return { weather, groundwater, fetchedAt: new Date().toISOString() };
}
