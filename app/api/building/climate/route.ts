/**
 * REAL Climate Data API
 * Uses NASA POWER API (free, no key needed)
 * https://power.larc.nasa.gov/docs/services/api/
 */

import { NextRequest, NextResponse } from 'next/server';
import { ipHeaders, limitPaidKeyRoute } from '@/lib/security/requestGuard';

interface ClimateRequest {
  latitude: number;
  longitude: number;
}

interface ClimateResponse {
  success: boolean;
  data?: {
    temperature: {
      annual: number;
      summer: number;
      winter: number;
      max: number;
      min: number;
    };
    humidity: {
      annual: number;
      max: number;
      min: number;
    };
    rainfall: {
      annual: number;      // mm/year
      wetSeason: null;     // not derived (was a fixed 70 % share)
      drySeason: null;
      maxMonthly: number;
      rainyDays: null;
    };
    wind: {
      avgSpeed: number;    // m/s
      maxSpeed: number;
      prevailingDirection: null;
      designPressure: null; // use the code basic wind speed
      designNote: string;
    };
    solar: {
      irradiance: number;  // kWh/m²/day
      sunHours: null;
      uvIndex: number;
    };
    extremes: {
      frostDays: null;
      hotDays: null;
      stormDays: null;
      hailRisk: null;
    };
    climateZone: string;
    buildingDesignCode: string;
    source: string;
  };
  error?: string;
}

// NASA POWER API
const NASA_POWER_URL = 'https://power.larc.nasa.gov/api/temporal/climatology/point';

async function fetchNASAPowerData(lat: number, lng: number): Promise<any | null> {
  try {
    const params = new URLSearchParams({
      parameters: 'T2M,T2M_MAX,T2M_MIN,RH2M,PRECTOTCORR,WS10M,WS10M_MAX,ALLSKY_SFC_SW_DWN,ALLSKY_SFC_UV_INDEX',
      community: 'RE',
      longitude: lng.toString(),
      latitude: lat.toString(),
      format: 'JSON',
    });

    const response = await fetch(`${NASA_POWER_URL}?${params}`, {
      signal: AbortSignal.timeout(20000),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('[NASA POWER] Fetch failed:', error);
  }
  return null;
}

// OpenWeatherMap for current conditions (if key available)
async function fetchOpenWeatherData(lat: number, lng: number): Promise<any | null> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('[OpenWeather] Fetch failed:', error);
  }
  return null;
}

function calculateAnnualAverage(monthlyData: Record<string, number>): number {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  let sum = 0;
  let count = 0;

  for (const month of months) {
    if (monthlyData[month] !== undefined && monthlyData[month] !== -999) {
      sum += monthlyData[month];
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}

function calculateSeasonalAverage(monthlyData: Record<string, number>, months: string[]): number {
  let sum = 0;
  let count = 0;

  for (const month of months) {
    if (monthlyData[month] !== undefined && monthlyData[month] !== -999) {
      sum += monthlyData[month];
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}

function getMax(monthlyData: Record<string, number>): number {
  return Math.max(...Object.values(monthlyData).filter(v => v !== -999));
}

function getMin(monthlyData: Record<string, number>): number {
  return Math.min(...Object.values(monthlyData).filter(v => v !== -999 && v > -100));
}

function classifyClimateZone(avgTemp: number, rainfall: number, lat: number): string {
  // Simplified Köppen classification
  if (rainfall < 250) return 'BWh (Hot Desert)';
  if (rainfall < 500) return 'BSh (Hot Semi-Arid)';
  if (avgTemp > 22 && rainfall > 1500) return 'Af (Tropical Rainforest)';
  if (avgTemp > 20 && rainfall > 800) return 'Aw (Tropical Savanna)';
  if (avgTemp > 18 && avgTemp < 25 && rainfall > 500) return 'Cwb (Subtropical Highland)';
  if (avgTemp < 18 && rainfall > 800) return 'Cfb (Oceanic)';
  return 'Cwa (Humid Subtropical)';
}

function getBuildingDesignCode(country: string, climateZone: string): string {
  // Building codes based on region
  const codes: Record<string, string> = {
    KE: 'BS EN 1991 (Eurocode) / Kenya Building Code',
    NG: 'National Building Code of Nigeria',
    ZA: 'SANS 10160',
    UG: 'Uganda Building Code (BS based)',
    TZ: 'Tanzania Building Code',
    US: 'IBC / ASCE 7',
    GB: 'BS EN Eurocode',
    AE: 'UAE Fire and Life Safety Code',
  };

  return codes[country] || 'BS EN 1991 (Eurocode)';
}

export async function POST(request: NextRequest) {
  // Paid/quota API key behind this route: per-IP limit (security sweep 2026-11-26; lib/security/requestGuard.ts).
  const limited = limitPaidKeyRoute(request, 'building-climate', 60);
  if (limited) return limited;
  try {
    const body: ClimateRequest = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    console.log(`[Climate API] Fetching for ${latitude}, ${longitude}`);

    // Fetch NASA POWER data
    const nasaData = await fetchNASAPowerData(latitude, longitude);
    const weatherData = await fetchOpenWeatherData(latitude, longitude);

    const source = 'NASA POWER Climatology';

    let tempData: Record<string, number> = {};
    let tempMaxData: Record<string, number> = {};
    let tempMinData: Record<string, number> = {};
    let humidityData: Record<string, number> = {};
    let precipData: Record<string, number> = {};
    let windData: Record<string, number> = {};
    let windMaxData: Record<string, number> = {};
    let solarData: Record<string, number> = {};
    let uvData: Record<string, number> = {};

    if (nasaData?.properties?.parameter) {
      const params = nasaData.properties.parameter;
      tempData = params.T2M || {};
      tempMaxData = params.T2M_MAX || {};
      tempMinData = params.T2M_MIN || {};
      humidityData = params.RH2M || {};
      precipData = params.PRECTOTCORR || {};
      windData = params.WS10M || {};
      windMaxData = params.WS10M_MAX || {};
      solarData = params.ALLSKY_SFC_SW_DWN || {};
      uvData = params.ALLSKY_SFC_UV_INDEX || {};
    } else {
      // NASA POWER or nothing (2026-11-14): the "Regional Model (Kenya)" was one
      // fixed monthly table (17-21 °C, 65 % humidity, 3 m/s wind) for every site
      // between 5° S and 5° N, and empty data (NaN) elsewhere.
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT EVIDENCE: NASA POWER climatology did not answer for this location.' },
        { status: 503 }
      );
    }

    // Calculate aggregates
    const annualTemp = calculateAnnualAverage(tempData);
    const summerTemp = calculateSeasonalAverage(tempData, ['DEC', 'JAN', 'FEB']); // Southern hemisphere summer
    const winterTemp = calculateSeasonalAverage(tempData, ['JUN', 'JUL', 'AUG']);
    const maxTemp = getMax(tempMaxData);
    const minTemp = getMin(tempMinData);

    const annualHumidity = calculateAnnualAverage(humidityData);
    const maxHumidity = getMax(humidityData);
    const minHumidity = getMin(humidityData);

    // Rainfall
    const monthlyRain = Object.entries(precipData)
      .filter(([k, v]) => ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].includes(k))
      .map(([k, v]) => v as number);
    const annualRainfall = monthlyRain.reduce((a, b) => a + b, 0);
    const maxMonthlyRain = Math.max(...monthlyRain);


    // Wind
    const avgWind = calculateAnnualAverage(windData);
    const maxWind = getMax(windMaxData);

    // Solar
    const avgSolar = calculateAnnualAverage(solarData);
    const avgUV = calculateAnnualAverage(uvData);

    // Climate zone
    const climateZone = classifyClimateZone(annualTemp, annualRainfall, latitude);

    // Determine country for building code
    let country = 'KE';
    if (longitude >= 39 && longitude <= 42 && latitude >= -5 && latitude <= 5) country = 'KE';
    else if (longitude >= 2 && longitude <= 15 && latitude >= 4 && latitude <= 14) country = 'NG';
    else if (longitude >= 16 && longitude <= 33 && latitude >= -35 && latitude <= -22) country = 'ZA';

    const result: ClimateResponse = {
      success: true,
      data: {
        temperature: {
          annual: Math.round(annualTemp * 10) / 10,
          summer: Math.round(summerTemp * 10) / 10,
          winter: Math.round(winterTemp * 10) / 10,
          max: Math.round(maxTemp * 10) / 10,
          min: Math.round(minTemp * 10) / 10,
        },
        humidity: {
          annual: Math.round(annualHumidity),
          max: Math.round(maxHumidity),
          min: Math.round(minHumidity),
        },
        // 2026-11-14: figures that were rules of thumb, not data, are null:
        // wet/dry split (fixed 70/30), rainy days (annual ÷ 15), storm days,
        // frost/hot days, hail risk, sun hours (irradiance ÷ 0.8), wind
        // direction by latitude band, and a "design pressure" from monthly
        // maximum wind × 1.2, which is not a code basic wind speed.
        rainfall: {
          annual: Math.round(annualRainfall),
          wetSeason: null,
          drySeason: null,
          maxMonthly: Math.round(maxMonthlyRain),
          rainyDays: null,
        },
        wind: {
          avgSpeed: Math.round(avgWind * 10) / 10,
          maxSpeed: Math.round(maxWind * 10) / 10,
          prevailingDirection: null,
          designPressure: null,
          designNote: 'For structural design use the basic wind speed from the national annex / building code, not these climatology values.',
        },
        solar: {
          irradiance: Math.round(avgSolar * 100) / 100,
          sunHours: null,
          uvIndex: Math.round(avgUV * 10) / 10,
        },
        extremes: {
          frostDays: null,
          hotDays: null,
          stormDays: null,
          hailRisk: null,
        },
        climateZone,
        buildingDesignCode: getBuildingDesignCode(country, climateZone),
        source,
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Climate API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch climate data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { success: false, error: 'Missing lat and lng parameters' },
      { status: 400 }
    );
  }

  const mockRequest = new Request(request.url, {
    method: 'POST',
    body: JSON.stringify({ latitude: parseFloat(lat), longitude: parseFloat(lng) }),
    headers: { 'Content-Type': 'application/json', ...ipHeaders(request) },
  });

  return POST(mockRequest as NextRequest);
}
