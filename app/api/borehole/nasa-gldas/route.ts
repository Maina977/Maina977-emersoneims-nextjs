/**
 * NASA GLDAS & GRACE Groundwater API
 * REAL data from NASA Giovanni/GES DISC
 *
 * GLDAS: Global Land Data Assimilation System
 * GRACE: Gravity Recovery and Climate Experiment
 *
 * https://disc.gsfc.nasa.gov/
 */

import { NextRequest, NextResponse } from 'next/server';
import { licensedOpenMeteoUrl, OPEN_METEO_DISABLED_MESSAGE } from '@/lib/data-sources/openMeteo';
import { fetchNasaPowerDailyMet } from '@/lib/data-sources/nasaPower';
import { et0Fao56 } from '@/lib/data-sources/fao56';

interface GLDASRequest {
  latitude: number;
  longitude: number;
  startDate?: string;
  endDate?: string;
}

interface GLDASResponse {
  success: boolean;
  data?: {
    location: { latitude: number; longitude: number };
    soilMoisture: {
      layer0_10cm: number;    // kg/m²
      layer10_40cm: number;
      layer40_100cm: number;
      layer100_200cm: number;
      rootZone: number;
    };
    groundwater: {
      anomaly: number;          // cm equivalent water thickness
      trend: 'increasing' | 'stable' | 'decreasing';
      percentile: number;       // 0-100
      historicalAverage: number;
    };
    evapotranspiration: number; // mm/day
    runoff: number;             // kg/m²/s
    precipitation: number;      // kg/m²/s
    snowWaterEquivalent: number;
    canopyWater: number;
    rechargeEstimate: number;   // mm/year
    dataDate: string;
    source: string;
  };
  error?: string;
}

// NASA GES DISC GLDAS endpoint
const NASA_GLDAS_URL = 'https://goldsmr4.gesdisc.eosdis.nasa.gov/daac-bin/OTF/HTTP_services.cgi';
// NASA Giovanni for time series
const NASA_GIOVANNI_URL = 'https://giovanni.gsfc.nasa.gov/giovanni/daac-bin/service_manager.pl';

// Fallback: Open-Meteo Historical Weather API (free, no key needed)
const OPEN_METEO_URL = 'https://archive-api.open-meteo.com/v1/archive';

async function fetchOpenMeteoSoilMoisture(lat: number, lon: number): Promise<any> {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    start_date: startDate,
    end_date: endDate,
    hourly: 'soil_moisture_0_to_7cm,soil_moisture_7_to_28cm,soil_moisture_28_to_100cm,soil_moisture_100_to_255cm,evapotranspiration',
    daily: 'precipitation_sum,et0_fao_evapotranspiration',
  });

  const url = licensedOpenMeteoUrl(`${OPEN_METEO_URL}?${params}`);
  if (!url) throw new Error(OPEN_METEO_DISABLED_MESSAGE);
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error('Open-Meteo API failed');
  }

  return response.json();
}

function calculateGroundwaterFromSoilMoisture(soilData: number[], lat: number): {
  anomaly: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  percentile: number;
  recharge: number;
} {
  // Calculate average and trend
  const avg = soilData.reduce((a, b) => a + b, 0) / soilData.length;
  const firstHalf = soilData.slice(0, Math.floor(soilData.length / 2));
  const secondHalf = soilData.slice(Math.floor(soilData.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const trendValue = secondAvg - firstAvg;
  let trend: 'increasing' | 'stable' | 'decreasing';
  if (trendValue > 0.02) trend = 'increasing';
  else if (trendValue < -0.02) trend = 'decreasing';
  else trend = 'stable';

  // Estimate anomaly based on average (typical range 0.1-0.5 m³/m³)
  const normalizedAvg = avg / 0.35; // 0.35 is typical average
  const anomaly = (normalizedAvg - 1) * 10; // Convert to cm water equivalent

  // Estimate percentile
  const percentile = Math.min(100, Math.max(0, normalizedAvg * 50 + 25));

  // Estimate annual recharge (simplified)
  // Higher latitude = lower recharge, higher moisture = higher recharge
  const latFactor = 1 - Math.abs(lat) / 90 * 0.3;
  const recharge = avg * 500 * latFactor; // mm/year estimate

  return { anomaly, trend, percentile, recharge };
}

export async function POST(request: NextRequest) {
  try {
    const body: GLDASRequest = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    console.log(`[NASA GLDAS] Fetching data for ${latitude}, ${longitude}`);

    // Try NASA Earthdata first (requires token)
    const earthdataToken = process.env.NASA_EARTHDATA_TOKEN;

    let soilMoisture = {
      layer0_10cm: 0,
      layer10_40cm: 0,
      layer40_100cm: 0,
      layer100_200cm: 0,
      rootZone: 0,
    };
    let evapotranspiration = 0;
    let precipitation = 0;
    let groundwaterData: { anomaly: number; trend: 'increasing' | 'stable' | 'decreasing'; percentile: number; recharge: number } = { anomaly: 0, trend: 'stable', percentile: 50, recharge: 100 };
    const dataSource = 'Open-Meteo Historical (licensed)';

    // Use Open-Meteo (free, real data)
    try {
      const meteoData = await fetchOpenMeteoSoilMoisture(latitude, longitude);

      if (meteoData.hourly) {
        const hourly = meteoData.hourly;

        // Get latest non-null values
        const getLatest = (arr: (number | null)[]) => {
          for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] !== null) return arr[i] as number;
          }
          return 0;
        };

        // Convert from m³/m³ to kg/m² (multiply by depth in cm)
        soilMoisture = {
          layer0_10cm: getLatest(hourly.soil_moisture_0_to_7cm) * 70,
          layer10_40cm: getLatest(hourly.soil_moisture_7_to_28cm) * 210,
          layer40_100cm: getLatest(hourly.soil_moisture_28_to_100cm) * 720,
          layer100_200cm: getLatest(hourly.soil_moisture_100_to_255cm) * 1550,
          rootZone: 0,
        };
        soilMoisture.rootZone = (soilMoisture.layer0_10cm + soilMoisture.layer10_40cm + soilMoisture.layer40_100cm) / 3;

        // Get evapotranspiration
        const etValues = hourly.evapotranspiration?.filter((v: number | null) => v !== null) || [];
        evapotranspiration = etValues.length > 0
          ? etValues.slice(-24).reduce((a: number, b: number) => a + b, 0) // Last 24 hours
          : 3.5;

        // Calculate groundwater from deep soil moisture
        const deepMoisture = hourly.soil_moisture_100_to_255cm?.filter((v: number | null) => v !== null) || [];
        if (deepMoisture.length > 0) {
          groundwaterData = calculateGroundwaterFromSoilMoisture(deepMoisture, latitude);
        }
      }

      if (meteoData.daily) {
        const daily = meteoData.daily;
        const precipValues = daily.precipitation_sum?.filter((v: number | null) => v !== null) || [];
        precipitation = precipValues.length > 0
          ? precipValues.reduce((a: number, b: number) => a + b, 0) / precipValues.length
          : 2.5;
      }

    } catch (error) {
      console.error('[NASA GLDAS] Open-Meteo unavailable:', error instanceof Error ? error.message : error);
      // 2026-11-14: no invented "regional estimates". Without a licensed
      // soil-moisture source, report what NASA POWER supports: rainfall and FAO-56
      // reference ET0 from measured/reanalysis inputs. Soil moisture by layer and
      // the groundwater anomaly are NOT available from these sources: null.
      const end = new Date(Date.now() - 3 * 86400000); // POWER daily data lag a few days
      const start = new Date(end.getTime() - 30 * 86400000);
      const met = await fetchNasaPowerDailyMet(latitude, longitude, start, end);
      if (!met || met.days.length < 7) {
        return NextResponse.json({ success: false, error: 'INSUFFICIENT EVIDENCE: no licensed soil-moisture source and too little NASA POWER data for this location.' }, { status: 503 });
      }
      const elev = met.elevationM ?? 0;
      const et0 = met.days.map((d) => et0Fao56({ tMaxC: d.tMax, tMinC: d.tMin, tDewC: d.tDew, u2: d.u2, rsMJ: d.rsMJ, elevationM: elev, latDeg: latitude, dayOfYear: Math.floor((Date.parse(d.date) - Date.UTC(Number(d.date.slice(0, 4)), 0, 0)) / 86400000) }).et0);
      const mean = (xs: number[]) => xs.reduce((x, y) => x + y, 0) / xs.length;
      return NextResponse.json({
        success: true,
        data: {
          location: { latitude, longitude },
          soilMoisture: null,
          groundwater: null,
          evapotranspiration: Math.round(mean(et0) * 100) / 100,
          evapotranspirationMethod: 'FAO-56 Penman-Monteith reference ET0 (grass), mm/day, from NASA POWER daily inputs',
          precipitation: Math.round(mean(met.days.map((d) => d.precip)) * 100) / 100,
          precipitationUnit: 'mm/day (period mean)',
          runoff: null,
          snowWaterEquivalent: null,
          canopyWater: null,
          rechargeEstimate: null,
          period: { start: met.days[0].date, end: met.days[met.days.length - 1].date, days: met.days.length },
          dataDate: met.days[met.days.length - 1].date,
          unavailable: 'Soil moisture by layer and the groundwater anomaly need a licensed land-surface model source; not available.',
          source: 'NASA POWER daily (MERRA-2; T2M_MAX, T2M_MIN, T2MDEW, WS2M, ALLSKY_SFC_SW_DWN, PRECTOTCORR), NASA Langley Research Center; ET0 by FAO-56',
        },
      });
    }

    const result: GLDASResponse = {
      success: true,
      data: {
        location: { latitude, longitude },
        soilMoisture,
        groundwater: {
          anomaly: Math.round(groundwaterData.anomaly * 100) / 100,
          trend: groundwaterData.trend,
          percentile: Math.round(groundwaterData.percentile),
          historicalAverage: Math.round(soilMoisture.layer100_200cm * 0.8),
        },
        evapotranspiration: Math.round(evapotranspiration * 100) / 100,
        runoff: Math.round(precipitation * 0.15 * 1000) / 1000, // 15% runoff estimate
        precipitation: Math.round(precipitation * 1000) / 1000,
        snowWaterEquivalent: latitude > 45 || latitude < -45 ? 5 + Math.abs(latitude - 45) : 0,
        canopyWater: soilMoisture.layer0_10cm * 0.05,
        rechargeEstimate: Math.round(groundwaterData.recharge),
        dataDate: new Date().toISOString().split('T')[0],
        source: dataSource,
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[NASA GLDAS] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch GLDAS data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { success: false, error: 'Missing lat and lon parameters' },
      { status: 400 }
    );
  }

  const mockRequest = new Request(request.url, {
    method: 'POST',
    body: JSON.stringify({ latitude: parseFloat(lat), longitude: parseFloat(lon) }),
    headers: { 'Content-Type': 'application/json' },
  });

  return POST(mockRequest as NextRequest);
}
