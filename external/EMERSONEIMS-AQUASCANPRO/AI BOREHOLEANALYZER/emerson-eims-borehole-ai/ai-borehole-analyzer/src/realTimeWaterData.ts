/**
 * Real-Time Water Data — USGS Groundwater + Open-Meteo Flood/River Discharge
 *
 * Fetches REAL-TIME data from free, no-auth, global/national APIs:
 *
 *   1. USGS Groundwater Levels Service (waterservices.usgs.gov)
 *      - Free, no API key, JSON, CORS enabled
 *      - Real measured groundwater depths from monitoring wells
 *      - bBox query: finds all active wells within ±0.5° of target coordinates
 *      - Parameter 72019: Depth to water level (feet below land surface)
 *      - US coverage only — returns null for non-US locations
 *      - Source: USGS National Water Information System (NWIS)
 *
 *   2. Open-Meteo Flood API (flood-api.open-meteo.com)
 *      - Free, no API key, unlimited
 *      - Global river discharge forecasts from GloFAS (Copernicus)
 *      - Real-time + 7-day forecast
 *      - Source: GloFAS v4 — Global Flood Awareness System (ECMWF/Copernicus)
 *
 *   3. Open-Meteo Weather API — Current conditions
 *      - Free, no API key, global
 *      - Real-time soil moisture, precipitation, evapotranspiration
 *      - Source: ERA5-Land reanalysis + IFS forecast
 */

// ═══ TYPES ═══

export interface USGSWellData {
  siteNumber: string;
  siteName: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  wellDepthFt: number | null;
  holeDepthFt: number | null;
  aquiferCode: string | null;
  measurements: {
    date: string;
    depthToWaterFt: number;
    depthToWaterM: number;
    qualifier: string;
  }[];
  latestDepthToWaterM: number | null;
  latestDepthToWaterFt: number | null;
  latestDate: string | null;
}

export interface USGSGroundwaterResult {
  available: boolean;
  wells: USGSWellData[];
  nearestWell: USGSWellData | null;
  averageDepthToWaterM: number | null;
  medianDepthToWaterM: number | null;
  minDepthToWaterM: number | null;
  maxDepthToWaterM: number | null;
  wellCount: number;
  searchRadiusKm: number;
  source: string;
  note: string;
}

export interface FloodRiverData {
  available: boolean;
  dailyDischarge: { date: string; discharge_m3s: number }[];
  currentDischarge: number | null;
  maxDischarge7Day: number | null;
  minDischarge7Day: number | null;
  averageDischarge: number | null;
  floodRiskLevel: 'none' | 'low' | 'moderate' | 'high' | 'extreme';
  source: string;
}

export interface CurrentWeatherHydro {
  available: boolean;
  soilMoisture0to7cm: number | null;   // m³/m³
  soilMoisture7to28cm: number | null;
  soilMoisture28to100cm: number | null;
  soilMoisture100to255cm: number | null;
  precipitation24h: number | null;      // mm
  evapotranspiration24h: number | null; // mm
  temperature: number | null;           // °C
  relativeHumidity: number | null;      // %
  windSpeed: number | null;             // km/h
  isRaining: boolean;
  weatherCode: number | null;
  lastUpdated: string;
  source: string;
}

export interface RealTimeWaterResult {
  usgsGroundwater: USGSGroundwaterResult | null;
  floodRiver: FloodRiverData | null;
  currentWeather: CurrentWeatherHydro | null;
  fetchedAt: string;
  apiStatus: {
    usgs: 'success' | 'failed' | 'not-applicable';
    flood: 'success' | 'failed';
    weather: 'success' | 'failed';
  };
}

// ═══ HELPER FUNCTIONS ═══

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Check if coordinates are likely in the US (simple bounding box) */
function isLikelyUS(lat: number, lon: number): boolean {
  // Continental US + Alaska + Hawaii + territories
  if (lat >= 24.5 && lat <= 49.5 && lon >= -125 && lon <= -66.5) return true; // CONUS
  if (lat >= 51 && lat <= 71.5 && lon >= -180 && lon <= -130) return true; // Alaska
  if (lat >= 18.5 && lat <= 22.5 && lon >= -160 && lon <= -154) return true; // Hawaii
  if (lat >= 17.5 && lat <= 18.6 && lon >= -67.5 && lon <= -65) return true; // Puerto Rico
  return false;
}

// ═══ API 1: USGS GROUNDWATER LEVELS ═══

/**
 * Fetch real groundwater level measurements from USGS monitoring wells
 * near the given coordinates. Uses bBox (bounding box) filter.
 *
 * Free, no API key, JSON format, CORS enabled.
 * Returns null if location is outside the US.
 *
 * API Docs: https://waterservices.usgs.gov/docs/groundwater-levels/
 */
export async function fetchUSGSGroundwater(lat: number, lon: number): Promise<USGSGroundwaterResult | null> {
  if (!isLikelyUS(lat, lon)) {
    console.log('[USGS] Coordinates outside US — skipping USGS query');
    return {
      available: false,
      wells: [],
      nearestWell: null,
      averageDepthToWaterM: null,
      medianDepthToWaterM: null,
      minDepthToWaterM: null,
      maxDepthToWaterM: null,
      wellCount: 0,
      searchRadiusKm: 0,
      source: 'USGS NWIS (US-only)',
      note: 'USGS groundwater data is only available for the United States. For this location, other data sources (NASA POWER, SoilGrids, ERA5-Land) provide groundwater estimates.',
    };
  }

  const SEARCH_DEGREES = 0.25; // ~28km radius
  const bBox = `${(lon - SEARCH_DEGREES).toFixed(4)},${(lat - SEARCH_DEGREES).toFixed(4)},${(lon + SEARCH_DEGREES).toFixed(4)},${(lat + SEARCH_DEGREES).toFixed(4)}`;

  try {
    // Fetch recent groundwater levels (last 2 years) in JSON
    const url = `https://waterservices.usgs.gov/nwis/gwlevels/?format=json&bBox=${bBox}&siteType=GW&siteStatus=active&period=P730D&parameterCd=72019`;

    console.log(`[USGS] Querying groundwater wells near ${lat.toFixed(4)},${lon.toFixed(4)} (bBox: ${bBox})`);

    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'Accept-Encoding': 'gzip, deflate' },
      signal: AbortSignal.timeout(20000),
    });

    if (res.status === 404) {
      console.log('[USGS] No wells found in area');
      return {
        available: false, wells: [], nearestWell: null,
        averageDepthToWaterM: null, medianDepthToWaterM: null,
        minDepthToWaterM: null, maxDepthToWaterM: null,
        wellCount: 0, searchRadiusKm: Math.round(SEARCH_DEGREES * 111),
        source: 'USGS NWIS Groundwater Levels Service',
        note: 'No active USGS monitoring wells found within search radius.',
      };
    }

    if (!res.ok) {
      console.log(`[USGS] HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    const timeSeries = data?.value?.timeSeries || [];

    if (timeSeries.length === 0) {
      return {
        available: false, wells: [], nearestWell: null,
        averageDepthToWaterM: null, medianDepthToWaterM: null,
        minDepthToWaterM: null, maxDepthToWaterM: null,
        wellCount: 0, searchRadiusKm: Math.round(SEARCH_DEGREES * 111),
        source: 'USGS NWIS Groundwater Levels Service',
        note: 'No groundwater level data available from USGS wells in this area.',
      };
    }

    const wells: USGSWellData[] = [];

    for (const ts of timeSeries) {
      const si = ts.sourceInfo;
      if (!si?.geoLocation?.geogLocation) continue;

      const wellLat = parseFloat(si.geoLocation.geogLocation.latitude);
      const wellLon = parseFloat(si.geoLocation.geogLocation.longitude);
      const dist = haversineKm(lat, lon, wellLat, wellLon);

      const measurements: USGSWellData['measurements'] = [];
      const values = ts.values?.[0]?.value || [];

      for (const v of values) {
        const depth = parseFloat(v.value);
        if (isNaN(depth) || depth < 0) continue;
        measurements.push({
          date: v.dateTime?.substring(0, 10) || 'unknown',
          depthToWaterFt: depth,
          depthToWaterM: Math.round(depth * 0.3048 * 100) / 100,
          qualifier: v.qualifiers?.[0]?.qualifierCode || '',
        });
      }

      if (measurements.length === 0) continue;

      // Sort by date descending
      measurements.sort((a, b) => b.date.localeCompare(a.date));

      const wellDepthProp = si.siteProperty?.find((p: any) => p.name === 'wellDepthVa');
      const holeDepthProp = si.siteProperty?.find((p: any) => p.name === 'holeDepthVa');
      const aquiferProp = si.siteProperty?.find((p: any) => p.name === 'natAqfrCd');

      wells.push({
        siteNumber: si.siteCode?.[0]?.value || 'unknown',
        siteName: si.siteName || 'Unnamed Well',
        latitude: wellLat,
        longitude: wellLon,
        distanceKm: Math.round(dist * 10) / 10,
        wellDepthFt: wellDepthProp?.value ? parseFloat(wellDepthProp.value) : null,
        holeDepthFt: holeDepthProp?.value ? parseFloat(holeDepthProp.value) : null,
        aquiferCode: aquiferProp?.value || null,
        measurements: measurements.slice(0, 10), // Keep last 10
        latestDepthToWaterM: measurements[0]?.depthToWaterM ?? null,
        latestDepthToWaterFt: measurements[0]?.depthToWaterFt ?? null,
        latestDate: measurements[0]?.date ?? null,
      });
    }

    // Sort by distance
    wells.sort((a, b) => a.distanceKm - b.distanceKm);

    // Statistics from latest readings
    const latestDepths = wells
      .map(w => w.latestDepthToWaterM)
      .filter((d): d is number => d !== null && d > 0);

    let avg: number | null = null;
    let median: number | null = null;
    let min: number | null = null;
    let max: number | null = null;

    if (latestDepths.length > 0) {
      avg = Math.round(latestDepths.reduce((a, b) => a + b, 0) / latestDepths.length * 100) / 100;
      const sorted = [...latestDepths].sort((a, b) => a - b);
      median = sorted[Math.floor(sorted.length / 2)];
      min = sorted[0];
      max = sorted[sorted.length - 1];
    }

    console.log(`[USGS] Found ${wells.length} wells, avg depth-to-water: ${avg}m`);

    return {
      available: wells.length > 0,
      wells: wells.slice(0, 20), // Top 20 nearest wells
      nearestWell: wells[0] || null,
      averageDepthToWaterM: avg,
      medianDepthToWaterM: median,
      minDepthToWaterM: min,
      maxDepthToWaterM: max,
      wellCount: wells.length,
      searchRadiusKm: Math.round(SEARCH_DEGREES * 111),
      source: 'USGS NWIS Groundwater Levels Service (real-time, no API key)',
      note: `${wells.length} USGS monitoring well(s) found within ~${Math.round(SEARCH_DEGREES * 111)}km. Water levels measured by USGS field technicians.`,
    };
  } catch (err) {
    console.log('[USGS] Error:', err);
    return null;
  }
}

// ═══ API 2: OPEN-METEO FLOOD / RIVER DISCHARGE ═══

/**
 * Fetch real-time river discharge and flood risk from GloFAS (Copernicus).
 * Free, no API key, global coverage.
 *
 * API Docs: https://open-meteo.com/en/docs/flood-api
 */
export async function fetchFloodRiverData(lat: number, lon: number): Promise<FloodRiverData | null> {
  try {
    const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lon}&daily=river_discharge&past_days=7&forecast_days=7`;

    console.log(`[Flood] Querying river discharge for ${lat.toFixed(4)},${lon.toFixed(4)}`);

    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) {
      console.log(`[Flood] HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    const daily = data.daily;

    if (!daily?.time || !daily?.river_discharge) {
      return { available: false, dailyDischarge: [], currentDischarge: null,
        maxDischarge7Day: null, minDischarge7Day: null, averageDischarge: null,
        floodRiskLevel: 'none', source: 'GloFAS v4 (Copernicus) via Open-Meteo' };
    }

    const entries: FloodRiverData['dailyDischarge'] = [];
    const validDischarges: number[] = [];

    for (let i = 0; i < daily.time.length; i++) {
      const d = daily.river_discharge[i];
      if (d !== null && d !== undefined && d >= 0) {
        entries.push({ date: daily.time[i], discharge_m3s: Math.round(d * 100) / 100 });
        validDischarges.push(d);
      }
    }

    if (validDischarges.length === 0) {
      return { available: false, dailyDischarge: [], currentDischarge: null,
        maxDischarge7Day: null, minDischarge7Day: null, averageDischarge: null,
        floodRiskLevel: 'none', source: 'GloFAS v4 (Copernicus) via Open-Meteo' };
    }

    const current = validDischarges[Math.floor(validDischarges.length / 2)] || validDischarges[0];
    const avg = validDischarges.reduce((a, b) => a + b, 0) / validDischarges.length;
    const maxD = Math.max(...validDischarges);
    const minD = Math.min(...validDischarges);

    // Flood risk: based on discharge magnitude relative to average
    let floodRiskLevel: FloodRiverData['floodRiskLevel'] = 'none';
    if (maxD > avg * 5) floodRiskLevel = 'extreme';
    else if (maxD > avg * 3) floodRiskLevel = 'high';
    else if (maxD > avg * 2) floodRiskLevel = 'moderate';
    else if (maxD > avg * 1.5) floodRiskLevel = 'low';

    console.log(`[Flood] Discharge: current=${current.toFixed(1)} m³/s, max7d=${maxD.toFixed(1)}, risk=${floodRiskLevel}`);

    return {
      available: true,
      dailyDischarge: entries,
      currentDischarge: Math.round(current * 100) / 100,
      maxDischarge7Day: Math.round(maxD * 100) / 100,
      minDischarge7Day: Math.round(minD * 100) / 100,
      averageDischarge: Math.round(avg * 100) / 100,
      floodRiskLevel,
      source: 'GloFAS v4 (Copernicus/ECMWF) via Open-Meteo Flood API — free, no API key',
    };
  } catch (err) {
    console.log('[Flood] Error:', err);
    return null;
  }
}

// ═══ API 3: OPEN-METEO CURRENT WEATHER + SOIL MOISTURE ═══

/**
 * Fetch CURRENT real-time weather and soil moisture conditions.
 * Free, no API key, global coverage, updated every 15 minutes.
 */
export async function fetchCurrentWeatherHydro(lat: number, lon: number): Promise<CurrentWeatherHydro | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,soil_moisture_0_to_7cm,soil_moisture_7_to_28cm,soil_moisture_28_to_100cm,soil_moisture_100_to_255cm&daily=precipitation_sum,et0_fao_evapotranspiration&timezone=auto&past_days=1&forecast_days=1`;

    console.log(`[Weather] Querying current conditions for ${lat.toFixed(4)},${lon.toFixed(4)}`);

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
      console.log(`[Weather] HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    if (!current) return null;

    // Get today's ET and precipitation from daily
    const todayPrecip = daily?.precipitation_sum?.[daily.precipitation_sum.length - 1] ?? null;
    const todayET = daily?.et0_fao_evapotranspiration?.[daily.et0_fao_evapotranspiration.length - 1] ?? null;

    // Determine if raining from weather codes (51-67 = drizzle/rain, 71-77 = snow, 80-82 = showers, 95-99 = thunderstorm)
    const wc = current.weather_code ?? -1;
    const isRaining = (wc >= 51 && wc <= 67) || (wc >= 80 && wc <= 82) || (wc >= 95 && wc <= 99);

    console.log(`[Weather] Temp=${current.temperature_2m}°C, SM_0-7=${current.soil_moisture_0_to_7cm}, precip=${todayPrecip}mm`);

    return {
      available: true,
      soilMoisture0to7cm: current.soil_moisture_0_to_7cm ?? null,
      soilMoisture7to28cm: current.soil_moisture_7_to_28cm ?? null,
      soilMoisture28to100cm: current.soil_moisture_28_to_100cm ?? null,
      soilMoisture100to255cm: current.soil_moisture_100_to_255cm ?? null,
      precipitation24h: todayPrecip,
      evapotranspiration24h: todayET,
      temperature: current.temperature_2m ?? null,
      relativeHumidity: current.relative_humidity_2m ?? null,
      windSpeed: current.wind_speed_10m ?? null,
      isRaining,
      weatherCode: wc >= 0 ? wc : null,
      lastUpdated: current.time || new Date().toISOString(),
      source: 'Open-Meteo IFS + ERA5-Land (real-time, 15-min update, free, no API key)',
    };
  } catch (err) {
    console.log('[Weather] Error:', err);
    return null;
  }
}

// ═══ COMBINED FETCH ═══

/**
 * Fetch all real-time water data in parallel.
 * All APIs are free, no authentication required.
 */
export async function fetchRealTimeWaterData(lat: number, lon: number): Promise<RealTimeWaterResult> {
  const [usgsResult, floodResult, weatherResult] = await Promise.allSettled([
    fetchUSGSGroundwater(lat, lon),
    fetchFloodRiverData(lat, lon),
    fetchCurrentWeatherHydro(lat, lon),
  ]);

  const usgs = usgsResult.status === 'fulfilled' ? usgsResult.value : null;
  const flood = floodResult.status === 'fulfilled' ? floodResult.value : null;
  const weather = weatherResult.status === 'fulfilled' ? weatherResult.value : null;

  return {
    usgsGroundwater: usgs,
    floodRiver: flood,
    currentWeather: weather,
    fetchedAt: new Date().toISOString(),
    apiStatus: {
      usgs: usgs?.available ? 'success' : (usgs ? 'not-applicable' : 'failed'),
      flood: flood?.available ? 'success' : 'failed',
      weather: weather?.available ? 'success' : 'failed',
    },
  };
}
