/**
 * OpenWeatherMap API - Real Weather Data
 * https://openweathermap.org/api
 *
 * Provides current weather, forecast, and historical data
 * Free tier: 1,000 calls/day
 */

import { NextRequest, NextResponse } from 'next/server';

interface WeatherRequest {
  latitude: number;
  longitude: number;
  type?: 'current' | 'forecast' | 'hourly';
}

interface WeatherResponse {
  success: boolean;
  data?: {
    location: {
      name: string;
      country: string;
      latitude: number;
      longitude: number;
    };
    current?: {
      temperature: number;        // °C
      feelsLike: number;         // °C
      humidity: number;          // %
      pressure: number;          // hPa
      windSpeed: number;         // m/s
      windDirection: number;     // degrees
      cloudCover: number;        // %
      visibility: number;        // meters
      uvIndex: number;
      description: string;
      icon: string;
      sunrise: string;
      sunset: string;
    };
    forecast?: Array<{
      date: string;
      temperature: { min: number; max: number };
      humidity: number;
      cloudCover: number;
      precipitation: number;     // mm
      windSpeed: number;
      description: string;
      solarImpact: 'excellent' | 'good' | 'moderate' | 'poor';
    }>;
    solarAnalysis: {
      currentCondition: 'excellent' | 'good' | 'moderate' | 'poor';
      estimatedEfficiency: number;  // % of optimal
      daylightHours: number;
      recommendedActions: string[];
    };
  };
  error?: string;
}

const OPENWEATHERMAP_API = 'https://api.openweathermap.org/data/2.5';

function getSolarCondition(cloudCover: number): 'excellent' | 'good' | 'moderate' | 'poor' {
  if (cloudCover <= 10) return 'excellent';
  if (cloudCover <= 30) return 'good';
  if (cloudCover <= 60) return 'moderate';
  return 'poor';
}

function getEfficiencyFromClouds(cloudCover: number): number {
  // Approximate efficiency based on cloud cover
  // Clear sky = 100%, overcast = ~25%
  return Math.round(100 - (cloudCover * 0.75));
}

export async function POST(request: NextRequest) {
  try {
    const body: WeatherRequest = await request.json();
    const { latitude, longitude, type = 'current' } = body;

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenWeatherMap API key not configured. Add OPENWEATHERMAP_API_KEY to your environment variables.',
          configRequired: true,
        },
        { status: 503 }
      );
    }

    // Validate coordinates
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    console.log(`[OpenWeatherMap] Fetching ${type} weather for ${latitude}, ${longitude}`);

    // Fetch current weather
    const currentResponse = await fetch(
      `${OPENWEATHERMAP_API}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!currentResponse.ok) {
      if (currentResponse.status === 401) {
        return NextResponse.json(
          { success: false, error: 'Invalid OpenWeatherMap API key' },
          { status: 401 }
        );
      }
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    // Build response
    const result: WeatherResponse = {
      success: true,
      data: {
        location: {
          name: currentData.name || 'Unknown',
          country: currentData.sys?.country || '',
          latitude,
          longitude,
        },
        current: {
          temperature: Math.round(currentData.main?.temp * 10) / 10,
          feelsLike: Math.round(currentData.main?.feels_like * 10) / 10,
          humidity: currentData.main?.humidity || 0,
          pressure: currentData.main?.pressure || 0,
          windSpeed: Math.round(currentData.wind?.speed * 10) / 10,
          windDirection: currentData.wind?.deg || 0,
          cloudCover: currentData.clouds?.all || 0,
          visibility: currentData.visibility || 10000,
          uvIndex: 0, // Requires separate API call
          description: currentData.weather?.[0]?.description || '',
          icon: currentData.weather?.[0]?.icon || '',
          sunrise: new Date(currentData.sys?.sunrise * 1000).toISOString(),
          sunset: new Date(currentData.sys?.sunset * 1000).toISOString(),
        },
        solarAnalysis: {
          currentCondition: getSolarCondition(currentData.clouds?.all || 0),
          estimatedEfficiency: getEfficiencyFromClouds(currentData.clouds?.all || 0),
          daylightHours: Math.round(
            ((currentData.sys?.sunset - currentData.sys?.sunrise) / 3600) * 10
          ) / 10,
          recommendedActions: [],
        },
      },
    };

    // Add recommendations based on conditions
    const cloudCover = currentData.clouds?.all || 0;
    const temp = currentData.main?.temp || 25;

    if (cloudCover > 70) {
      result.data!.solarAnalysis.recommendedActions.push(
        'High cloud cover - solar production will be reduced today'
      );
    }
    if (temp > 35) {
      result.data!.solarAnalysis.recommendedActions.push(
        'High temperature - panel efficiency reduced by ~' + Math.round((temp - 25) * 0.4) + '%'
      );
    }
    if (currentData.wind?.speed > 10) {
      result.data!.solarAnalysis.recommendedActions.push(
        'High winds - check panel mounting stability'
      );
    }

    // Fetch forecast if requested
    if (type === 'forecast') {
      const forecastResponse = await fetch(
        `${OPENWEATHERMAP_API}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`,
        { signal: AbortSignal.timeout(10000) }
      );

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();

        // Group by day
        const dailyForecasts = new Map<string, any[]>();
        (forecastData.list || []).forEach((item: any) => {
          const date = item.dt_txt.split(' ')[0];
          if (!dailyForecasts.has(date)) {
            dailyForecasts.set(date, []);
          }
          dailyForecasts.get(date)!.push(item);
        });

        result.data!.forecast = Array.from(dailyForecasts.entries())
          .slice(0, 7) // 7-day forecast
          .map(([date, items]) => {
            const temps = items.map((i: any) => i.main.temp);
            const clouds = items.map((i: any) => i.clouds.all);
            const avgCloud = clouds.reduce((a: number, b: number) => a + b, 0) / clouds.length;

            return {
              date,
              temperature: {
                min: Math.round(Math.min(...temps) * 10) / 10,
                max: Math.round(Math.max(...temps) * 10) / 10,
              },
              humidity: Math.round(
                items.reduce((a: number, i: any) => a + i.main.humidity, 0) / items.length
              ),
              cloudCover: Math.round(avgCloud),
              precipitation: items.reduce((a: number, i: any) => a + (i.rain?.['3h'] || 0), 0),
              windSpeed: Math.round(
                items.reduce((a: number, i: any) => a + i.wind.speed, 0) / items.length * 10
              ) / 10,
              description: items[Math.floor(items.length / 2)]?.weather?.[0]?.description || '',
              solarImpact: getSolarCondition(avgCloud),
            };
          });
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('[OpenWeatherMap] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch weather data'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const type = searchParams.get('type') || 'current';

  if (!lat || !lon) {
    return NextResponse.json(
      { success: false, error: 'Missing lat and lon parameters' },
      { status: 400 }
    );
  }

  const body: WeatherRequest = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    type: type as 'current' | 'forecast' | 'hourly',
  };

  const mockRequest = new Request(request.url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  return POST(mockRequest as NextRequest);
}
