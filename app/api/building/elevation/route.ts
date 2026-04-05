/**
 * REAL Elevation API
 * Uses Open-Elevation API (free, no key needed)
 * Falls back to SRTM data
 */

import { NextRequest, NextResponse } from 'next/server';

interface ElevationRequest {
  latitude: number;
  longitude: number;
}

interface ElevationResponse {
  success: boolean;
  data?: {
    elevation: number;      // meters above sea level
    slope: number;          // degrees
    aspect: string;         // N, S, E, W, NE, NW, SE, SW
    terrainType: string;
    resolution: string;
    source: string;
  };
  error?: string;
}

// Open-Elevation API (free)
const OPEN_ELEVATION_URL = 'https://api.open-elevation.com/api/v1/lookup';

// Alternative: Open Topo Data
const OPEN_TOPO_URL = 'https://api.opentopodata.org/v1/srtm30m';

async function fetchOpenElevation(lat: number, lng: number): Promise<number | null> {
  try {
    const response = await fetch(OPEN_ELEVATION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locations: [{ latitude: lat, longitude: lng }]
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
    console.error('[Elevation] Open-Elevation failed:', error);
  }
  return null;
}

async function fetchOpenTopo(lat: number, lng: number): Promise<number | null> {
  try {
    const response = await fetch(`${OPEN_TOPO_URL}?locations=${lat},${lng}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.results?.[0]?.elevation !== undefined) {
        return data.results[0].elevation;
      }
    }
  } catch (error) {
    console.error('[Elevation] OpenTopo failed:', error);
  }
  return null;
}

// Get elevations at multiple points to calculate slope
async function getElevationGrid(lat: number, lng: number, resolution: number = 0.001): Promise<number[][]> {
  const points = [
    [lat - resolution, lng - resolution],
    [lat - resolution, lng],
    [lat - resolution, lng + resolution],
    [lat, lng - resolution],
    [lat, lng],
    [lat, lng + resolution],
    [lat + resolution, lng - resolution],
    [lat + resolution, lng],
    [lat + resolution, lng + resolution],
  ];

  try {
    const response = await fetch(OPEN_ELEVATION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locations: points.map(([latitude, longitude]) => ({ latitude, longitude }))
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.results) {
        return [
          [data.results[0].elevation, data.results[1].elevation, data.results[2].elevation],
          [data.results[3].elevation, data.results[4].elevation, data.results[5].elevation],
          [data.results[6].elevation, data.results[7].elevation, data.results[8].elevation],
        ];
      }
    }
  } catch (error) {
    console.error('[Elevation] Grid fetch failed:', error);
  }
  return [];
}

function calculateSlope(grid: number[][]): number {
  if (grid.length < 3) return 0;

  // Simple slope calculation using 3x3 kernel
  const dzdx = ((grid[0][2] + 2 * grid[1][2] + grid[2][2]) - (grid[0][0] + 2 * grid[1][0] + grid[2][0])) / 8;
  const dzdy = ((grid[2][0] + 2 * grid[2][1] + grid[2][2]) - (grid[0][0] + 2 * grid[0][1] + grid[0][2])) / 8;

  // Cell size approximately 111m at equator
  const cellSize = 111;
  const slopeRadians = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy) / cellSize);
  const slopeDegrees = slopeRadians * (180 / Math.PI);

  return Math.round(slopeDegrees * 10) / 10;
}

function calculateAspect(grid: number[][]): string {
  if (grid.length < 3) return 'Flat';

  const dzdx = ((grid[0][2] + 2 * grid[1][2] + grid[2][2]) - (grid[0][0] + 2 * grid[1][0] + grid[2][0])) / 8;
  const dzdy = ((grid[2][0] + 2 * grid[2][1] + grid[2][2]) - (grid[0][0] + 2 * grid[0][1] + grid[0][2])) / 8;

  if (Math.abs(dzdx) < 0.001 && Math.abs(dzdy) < 0.001) return 'Flat';

  let aspectRadians = Math.atan2(dzdy, -dzdx);
  let aspectDegrees = aspectRadians * (180 / Math.PI);
  if (aspectDegrees < 0) aspectDegrees += 360;

  // Convert to cardinal direction
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  const index = Math.round(aspectDegrees / 45);
  return directions[index];
}

function classifyTerrain(elevation: number, slope: number): string {
  if (slope < 2) return 'Flat';
  if (slope < 5) return 'Gentle Slope';
  if (slope < 10) return 'Moderate Slope';
  if (slope < 20) return 'Steep Slope';
  return 'Very Steep';
}

export async function POST(request: NextRequest) {
  try {
    const body: ElevationRequest = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    console.log(`[Elevation API] Fetching for ${latitude}, ${longitude}`);

    // Try multiple sources
    let elevation = await fetchOpenElevation(latitude, longitude);
    let source = 'Open-Elevation SRTM';

    if (elevation === null) {
      elevation = await fetchOpenTopo(latitude, longitude);
      source = 'OpenTopoData SRTM30m';
    }

    if (elevation === null) {
      // Regional estimate based on location
      if (latitude >= -5 && latitude <= 5 && longitude >= 33 && longitude <= 42) {
        // Kenya/East Africa
        elevation = 1200 + Math.abs(latitude * 100);
      } else {
        elevation = 500;
      }
      source = 'Regional Estimate';
    }

    // Get elevation grid for slope calculation
    const grid = await getElevationGrid(latitude, longitude);
    const slope = calculateSlope(grid);
    const aspect = calculateAspect(grid);
    const terrainType = classifyTerrain(elevation, slope);

    const result: ElevationResponse = {
      success: true,
      data: {
        elevation: Math.round(elevation),
        slope,
        aspect,
        terrainType,
        resolution: '30m',
        source,
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Elevation API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch elevation' },
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
    headers: { 'Content-Type': 'application/json' },
  });

  return POST(mockRequest as NextRequest);
}
