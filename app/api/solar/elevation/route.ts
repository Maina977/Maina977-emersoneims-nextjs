/**
 * Elevation / LiDAR Data API
 * Uses Open-Elevation API (free) or Google Elevation API
 *
 * Provides terrain elevation for slope analysis and shading calculations
 */

import { NextRequest, NextResponse } from 'next/server';

interface ElevationRequest {
  latitude: number;
  longitude: number;
  includeSlope?: boolean;
  gridSize?: number;  // meters, for slope calculation
}

interface ElevationPoint {
  latitude: number;
  longitude: number;
  elevation: number;  // meters
}

interface ElevationResponse {
  success: boolean;
  data?: {
    location: ElevationPoint;
    terrain: {
      slope: number;           // degrees
      aspect: number;          // degrees from north
      slopeDirection: string;  // N, NE, E, SE, S, SW, W, NW
      terrainType: 'flat' | 'gentle' | 'moderate' | 'steep' | 'very_steep';
    };
    solarImpact: {
      suitability: 'excellent' | 'good' | 'moderate' | 'challenging';
      shadeRisk: 'low' | 'medium' | 'high';
      optimalOrientation: string;
      recommendations: string[];
    };
    surroundingElevations?: ElevationPoint[];
  };
  error?: string;
}

// Open-Elevation API (free, no key required)
const OPEN_ELEVATION_API = 'https://api.open-elevation.com/api/v1/lookup';
// Open Topo Data (alternative free API)
const OPEN_TOPO_API = 'https://api.opentopodata.org/v1/srtm30m';

function getTerrainType(slope: number): 'flat' | 'gentle' | 'moderate' | 'steep' | 'very_steep' {
  if (slope < 2) return 'flat';
  if (slope < 5) return 'gentle';
  if (slope < 15) return 'moderate';
  if (slope < 30) return 'steep';
  return 'very_steep';
}

function getAspectDirection(aspect: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(aspect / 45) % 8;
  return directions[index];
}

function getSolarSuitability(slope: number, aspect: number, latitude: number): 'excellent' | 'good' | 'moderate' | 'challenging' {
  const isNorthernHemisphere = latitude >= 0;
  const idealAspect = isNorthernHemisphere ? 180 : 0; // South-facing in NH, North-facing in SH

  // Calculate aspect deviation from ideal (0-180)
  let aspectDeviation = Math.abs(aspect - idealAspect);
  if (aspectDeviation > 180) aspectDeviation = 360 - aspectDeviation;

  if (slope < 5 && aspectDeviation < 45) return 'excellent';
  if (slope < 15 && aspectDeviation < 90) return 'good';
  if (slope < 30 && aspectDeviation < 135) return 'moderate';
  return 'challenging';
}

async function fetchElevation(lat: number, lon: number): Promise<number | null> {
  // Try Open-Elevation first
  try {
    const response = await fetch(OPEN_ELEVATION_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locations: [{ latitude: lat, longitude: lon }]
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.results?.[0]?.elevation !== undefined) {
        return data.results[0].elevation;
      }
    }
  } catch (error) {
    console.log('[Elevation] Open-Elevation failed, trying OpenTopoData...');
  }

  // Fallback to OpenTopoData
  try {
    const response = await fetch(
      `${OPEN_TOPO_API}?locations=${lat},${lon}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.results?.[0]?.elevation !== undefined) {
        return data.results[0].elevation;
      }
    }
  } catch (error) {
    console.log('[Elevation] OpenTopoData also failed');
  }

  // Try Google Elevation if API key available
  const googleKey = process.env.GOOGLE_ELEVATION_API_KEY;
  if (googleKey) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lon}&key=${googleKey}`,
        { signal: AbortSignal.timeout(10000) }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results?.[0]?.elevation !== undefined) {
          return data.results[0].elevation;
        }
      }
    } catch (error) {
      console.log('[Elevation] Google Elevation also failed');
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body: ElevationRequest = await request.json();
    const { latitude, longitude, includeSlope = true, gridSize = 30 } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    console.log(`[Elevation] Fetching data for ${latitude}, ${longitude}`);

    // Fetch center point elevation
    const centerElevation = await fetchElevation(latitude, longitude);

    if (centerElevation === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to fetch elevation data. All elevation services unavailable.',
        },
        { status: 503 }
      );
    }

    const result: ElevationResponse = {
      success: true,
      data: {
        location: {
          latitude,
          longitude,
          elevation: Math.round(centerElevation * 10) / 10,
        },
        terrain: {
          slope: 0,
          aspect: 0,
          slopeDirection: 'N',
          terrainType: 'flat',
        },
        solarImpact: {
          suitability: 'excellent',
          shadeRisk: 'low',
          optimalOrientation: latitude >= 0 ? 'South-facing' : 'North-facing',
          recommendations: [],
        },
      },
    };

    // Calculate slope if requested
    if (includeSlope) {
      // Fetch surrounding points for slope calculation
      // 1 degree ≈ 111km, so gridSize meters ≈ gridSize/111000 degrees
      const offset = gridSize / 111000;

      const [northElev, southElev, eastElev, westElev] = await Promise.all([
        fetchElevation(latitude + offset, longitude),
        fetchElevation(latitude - offset, longitude),
        fetchElevation(latitude, longitude + offset),
        fetchElevation(latitude, longitude - offset),
      ]);

      if (northElev !== null && southElev !== null && eastElev !== null && westElev !== null) {
        // Calculate slope using gradient
        const dz_dx = (eastElev - westElev) / (2 * gridSize);
        const dz_dy = (northElev - southElev) / (2 * gridSize);

        const slope = Math.atan(Math.sqrt(dz_dx * dz_dx + dz_dy * dz_dy)) * (180 / Math.PI);
        const aspect = Math.atan2(dz_dx, dz_dy) * (180 / Math.PI);
        const normalizedAspect = aspect < 0 ? aspect + 360 : aspect;

        result.data!.terrain = {
          slope: Math.round(slope * 10) / 10,
          aspect: Math.round(normalizedAspect),
          slopeDirection: getAspectDirection(normalizedAspect),
          terrainType: getTerrainType(slope),
        };

        result.data!.surroundingElevations = [
          { latitude: latitude + offset, longitude, elevation: northElev },
          { latitude: latitude - offset, longitude, elevation: southElev },
          { latitude, longitude: longitude + offset, elevation: eastElev },
          { latitude, longitude: longitude - offset, elevation: westElev },
        ];

        // Update solar suitability based on terrain
        result.data!.solarImpact.suitability = getSolarSuitability(slope, normalizedAspect, latitude);

        // Add recommendations
        const recommendations: string[] = [];

        if (slope > 20) {
          recommendations.push('Steep terrain - specialized mounting required');
          result.data!.solarImpact.shadeRisk = 'high';
        } else if (slope > 10) {
          recommendations.push('Moderate slope - tilted racking recommended');
          result.data!.solarImpact.shadeRisk = 'medium';
        }

        // Check aspect for optimal orientation
        const isNorthernHemisphere = latitude >= 0;
        const idealAspect = isNorthernHemisphere ? 180 : 0;
        let aspectDeviation = Math.abs(normalizedAspect - idealAspect);
        if (aspectDeviation > 180) aspectDeviation = 360 - aspectDeviation;

        if (aspectDeviation > 90) {
          recommendations.push('Suboptimal orientation - consider adjustable mounts');
        } else if (aspectDeviation > 45) {
          recommendations.push('Slightly off ideal orientation - minor efficiency impact');
        } else {
          recommendations.push('Good orientation for solar panel placement');
        }

        if (centerElevation > 2000) {
          recommendations.push('High altitude - increased UV, may improve efficiency');
        }

        result.data!.solarImpact.recommendations = recommendations;
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Elevation] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch elevation data'
      },
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

  const body: ElevationRequest = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    includeSlope: searchParams.get('slope') !== 'false',
  };

  const mockRequest = new Request(request.url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  return POST(mockRequest as NextRequest);
}
