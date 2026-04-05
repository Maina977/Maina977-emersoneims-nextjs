/**
 * NASA POWER API - Real Solar Irradiance Data
 * https://power.larc.nasa.gov/docs/services/api/
 *
 * This API provides REAL solar radiation data from NASA satellites
 * No API key required, but rate limited
 */

import { NextRequest, NextResponse } from 'next/server';

interface NASAPowerRequest {
  latitude: number;
  longitude: number;
  startDate?: string;  // YYYYMMDD
  endDate?: string;    // YYYYMMDD
  parameters?: string[];
}

interface NASAPowerResponse {
  success: boolean;
  data?: {
    location: { latitude: number; longitude: number; elevation: number };
    parameters: {
      ALLSKY_SFC_SW_DWN: Record<string, number>;  // Global Horizontal Irradiance (kWh/m²/day)
      ALLSKY_SFC_SW_DNI: Record<string, number>;  // Direct Normal Irradiance
      ALLSKY_SFC_SW_DIFF: Record<string, number>; // Diffuse Irradiance
      T2M: Record<string, number>;                 // Temperature at 2m (°C)
      T2M_MAX: Record<string, number>;            // Max Temperature
      T2M_MIN: Record<string, number>;            // Min Temperature
      RH2M: Record<string, number>;               // Relative Humidity
      WS10M: Record<string, number>;              // Wind Speed at 10m
      PRECTOTCORR: Record<string, number>;        // Precipitation
    };
    summary: {
      annualGHI: number;           // kWh/m²/year
      averageDailyGHI: number;     // kWh/m²/day
      peakSunHours: number;        // hours/day
      optimalTiltAngle: number;    // degrees
      temperatureCoefficient: number;
    };
  };
  error?: string;
}

const NASA_POWER_API = 'https://power.larc.nasa.gov/api/temporal/daily/point';

// Default parameters for solar analysis
const DEFAULT_PARAMETERS = [
  'ALLSKY_SFC_SW_DWN',   // All Sky Surface Shortwave Downward Irradiance (GHI)
  'ALLSKY_SFC_SW_DNI',   // Direct Normal Irradiance
  'ALLSKY_SFC_SW_DIFF',  // Diffuse Horizontal Irradiance
  'CLRSKY_SFC_SW_DWN',   // Clear Sky GHI
  'T2M',                  // Temperature at 2m
  'T2M_MAX',             // Max Temperature
  'T2M_MIN',             // Min Temperature
  'RH2M',                // Relative Humidity at 2m
  'WS10M',               // Wind Speed at 10m
  'WS10M_MAX',           // Max Wind Speed
  'PRECTOTCORR',         // Precipitation Corrected
];

export async function POST(request: NextRequest) {
  try {
    const body: NASAPowerRequest = await request.json();
    const { latitude, longitude, startDate, endDate, parameters } = body;

    // Validate coordinates
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates. Latitude and longitude must be numbers.' },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { success: false, error: 'Coordinates out of range.' },
        { status: 400 }
      );
    }

    // Default to last year of data
    const end = endDate || new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const startDateObj = new Date();
    startDateObj.setFullYear(startDateObj.getFullYear() - 1);
    const start = startDate || startDateObj.toISOString().slice(0, 10).replace(/-/g, '');

    // Build NASA POWER API URL
    const params = new URLSearchParams({
      parameters: (parameters || DEFAULT_PARAMETERS).join(','),
      community: 'RE',  // Renewable Energy community
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      start: start,
      end: end,
      format: 'JSON',
    });

    console.log(`[NASA POWER] Fetching data for ${latitude}, ${longitude}`);

    const response = await fetch(`${NASA_POWER_API}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // NASA POWER can be slow, allow 30 seconds
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[NASA POWER] API error: ${response.status}`, errorText);
      return NextResponse.json(
        { success: false, error: `NASA POWER API error: ${response.status}` },
        { status: response.status }
      );
    }

    const nasaData = await response.json();

    // Process and summarize the data
    const ghiValues = Object.values(nasaData.properties?.parameter?.ALLSKY_SFC_SW_DWN || {}) as number[];
    const validGHI = ghiValues.filter((v: number) => v > -900); // NASA uses -999 for missing data

    const averageDailyGHI = validGHI.length > 0
      ? validGHI.reduce((a, b) => a + b, 0) / validGHI.length
      : 0;

    const annualGHI = averageDailyGHI * 365;
    const peakSunHours = averageDailyGHI; // GHI in kWh/m²/day ≈ Peak Sun Hours

    // Calculate optimal tilt angle (rough approximation: latitude * 0.76 + 3.1)
    const optimalTiltAngle = Math.abs(latitude) * 0.76 + 3.1;

    // Temperature coefficient calculation
    const tempValues = Object.values(nasaData.properties?.parameter?.T2M || {}) as number[];
    const validTemp = tempValues.filter((v: number) => v > -900);
    const avgTemp = validTemp.length > 0
      ? validTemp.reduce((a, b) => a + b, 0) / validTemp.length
      : 25;
    const temperatureCoefficient = 1 - ((avgTemp - 25) * 0.004); // -0.4%/°C above 25°C

    const result: NASAPowerResponse = {
      success: true,
      data: {
        location: {
          latitude,
          longitude,
          elevation: nasaData.geometry?.coordinates?.[2] || 0,
        },
        parameters: nasaData.properties?.parameter || {},
        summary: {
          annualGHI: Math.round(annualGHI),
          averageDailyGHI: Math.round(averageDailyGHI * 100) / 100,
          peakSunHours: Math.round(peakSunHours * 100) / 100,
          optimalTiltAngle: Math.round(optimalTiltAngle),
          temperatureCoefficient: Math.round(temperatureCoefficient * 1000) / 1000,
        },
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[NASA POWER] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch NASA POWER data'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for simple queries
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

  // Create a POST-like request body
  const body: NASAPowerRequest = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
  };

  // Reuse POST logic
  const mockRequest = new Request(request.url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  return POST(mockRequest as NextRequest);
}
