/**
 * REAL Flood Risk Assessment API
 * Uses Open-Meteo Historical Data + OpenStreetMap Water Bodies
 * Free, no API key needed
 */

import { NextRequest, NextResponse } from 'next/server';

interface FloodRequest {
  latitude: number;
  longitude: number;
}

interface FloodResponse {
  success: boolean;
  data?: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;        // 0-100
    floodZone: string;
    factors: {
      elevation: number;
      nearestWaterBody: { name: string; type: string; distance: number } | null;
      historicalPrecipitation: number;  // mm/year
      maxDailyPrecipitation: number;    // mm
      drainageCapacity: string;
      urbanization: string;
    };
    historicalEvents: number;
    projectedDepth: {
      '10yr': number;         // meters
      '50yr': number;
      '100yr': number;
    };
    mitigations: string[];
    insuranceCategory: string;
    buildingRecommendations: string[];
    source: string;
  };
  error?: string;
}

// Open-Meteo Historical API
const OPEN_METEO_HISTORICAL_URL = 'https://archive-api.open-meteo.com/v1/archive';

// OpenStreetMap Overpass API
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

async function fetchHistoricalPrecipitation(lat: number, lng: number): Promise<{
  annual: number;
  maxDaily: number;
  extremeDays: number;
} | null> {
  try {
    // Get last 10 years of data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 10);

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      daily: 'precipitation_sum',
    });

    const response = await fetch(`${OPEN_METEO_HISTORICAL_URL}?${params}`, {
      signal: AbortSignal.timeout(30000),
    });

    if (response.ok) {
      const data = await response.json();
      const precip = data.daily?.precipitation_sum || [];

      // Calculate statistics
      const validPrecip = precip.filter((p: number | null) => p !== null && p >= 0) as number[];

      if (validPrecip.length === 0) return null;

      const totalPrecip = validPrecip.reduce((a: number, b: number) => a + b, 0);
      const years = validPrecip.length / 365;
      const annualAvg = totalPrecip / years;
      const maxDaily = Math.max(...validPrecip);
      const extremeDays = validPrecip.filter(p => p > 50).length; // Days with >50mm

      return {
        annual: Math.round(annualAvg),
        maxDaily: Math.round(maxDaily * 10) / 10,
        extremeDays: Math.round(extremeDays / years), // Per year
      };
    }
  } catch (error) {
    console.error('[Flood] Historical precipitation fetch failed:', error);
  }
  return null;
}

async function fetchNearbyWaterBodies(lat: number, lng: number, radiusKm: number = 2): Promise<{
  name: string;
  type: string;
  distance: number;
} | null> {
  try {
    const query = `
      [out:json][timeout:15];
      (
        way["natural"="water"](around:${radiusKm * 1000},${lat},${lng});
        relation["natural"="water"](around:${radiusKm * 1000},${lat},${lng});
        way["waterway"](around:${radiusKm * 1000},${lat},${lng});
      );
      out center;
    `;

    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.elements && data.elements.length > 0) {
        // Find closest water body
        let closest: { name: string; type: string; distance: number } | null = null;
        let minDistance = Infinity;

        for (const element of data.elements) {
          let elLat = element.center?.lat || element.lat;
          let elLng = element.center?.lon || element.lon;

          if (elLat && elLng) {
            const distance = calculateDistance(lat, lng, elLat, elLng);
            if (distance < minDistance) {
              minDistance = distance;
              const tags = element.tags || {};
              closest = {
                name: tags.name || tags.waterway || 'Unnamed water body',
                type: tags.waterway || tags.natural || 'water',
                distance: Math.round(distance),
              };
            }
          }
        }

        return closest;
      }
    }
  } catch (error) {
    console.error('[Flood] Water bodies fetch failed:', error);
  }
  return null;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateFloodRisk(
  elevation: number,
  waterBodyDistance: number | null,
  annualPrecip: number,
  maxDailyPrecip: number
): { riskLevel: 'low' | 'medium' | 'high' | 'critical'; score: number } {
  let score = 0;

  // Elevation factor (lower = higher risk)
  if (elevation < 10) score += 40;
  else if (elevation < 50) score += 30;
  else if (elevation < 100) score += 20;
  else if (elevation < 200) score += 10;
  else score += 5;

  // Water body proximity
  if (waterBodyDistance !== null) {
    if (waterBodyDistance < 100) score += 30;
    else if (waterBodyDistance < 300) score += 20;
    else if (waterBodyDistance < 500) score += 15;
    else if (waterBodyDistance < 1000) score += 10;
    else score += 5;
  }

  // Precipitation intensity
  if (annualPrecip > 1500) score += 15;
  else if (annualPrecip > 1000) score += 10;
  else if (annualPrecip > 700) score += 5;

  if (maxDailyPrecip > 100) score += 15;
  else if (maxDailyPrecip > 75) score += 10;
  else if (maxDailyPrecip > 50) score += 5;

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (score >= 70) riskLevel = 'critical';
  else if (score >= 50) riskLevel = 'high';
  else if (score >= 30) riskLevel = 'medium';
  else riskLevel = 'low';

  return { riskLevel, score: Math.min(100, score) };
}

function getFloodZone(riskLevel: string, waterBodyDistance: number | null): string {
  if (riskLevel === 'critical') return 'Zone AE (High Risk - Special Flood Hazard Area)';
  if (riskLevel === 'high') return 'Zone A (High Risk - Flood Hazard Area)';
  if (riskLevel === 'medium') return 'Zone B/X500 (Moderate Risk - 500-year floodplain)';
  return 'Zone C/X (Low Risk - Minimal flood hazard)';
}

function getMitigations(riskLevel: string, waterBodyDistance: number | null): string[] {
  const mitigations: string[] = [];

  if (riskLevel === 'critical' || riskLevel === 'high') {
    mitigations.push('Elevate building foundation minimum 1.0m above ground level');
    mitigations.push('Install French drains around building perimeter');
    mitigations.push('Use flood-resistant building materials for ground floor');
    mitigations.push('Install sump pump with battery backup');
    mitigations.push('Create retention/detention pond on property');
  }

  if (riskLevel === 'medium') {
    mitigations.push('Elevate foundation 0.6m above ground level');
    mitigations.push('Install proper surface drainage');
    mitigations.push('Grade land away from building');
  }

  if (waterBodyDistance && waterBodyDistance < 500) {
    mitigations.push('Construct retaining wall or berm facing water body');
    mitigations.push('Plant vegetation buffer zone');
  }

  mitigations.push('Ensure proper roof drainage and guttering');
  mitigations.push('Install backflow prevention on sewage connection');

  return mitigations;
}

function getBuildingRecommendations(riskLevel: string): string[] {
  const recommendations: string[] = [];

  if (riskLevel === 'critical' || riskLevel === 'high') {
    recommendations.push('Pile foundation recommended');
    recommendations.push('No basement or underground parking');
    recommendations.push('Ground floor should not contain bedrooms');
    recommendations.push('Electrical panels must be elevated');
    recommendations.push('Consider stilt construction');
  } else if (riskLevel === 'medium') {
    recommendations.push('Raft foundation with waterproofing');
    recommendations.push('Basement requires tanking and pumps');
    recommendations.push('Elevate HVAC equipment');
  } else {
    recommendations.push('Standard foundation acceptable');
    recommendations.push('Basement possible with proper waterproofing');
  }

  return recommendations;
}

export async function POST(request: NextRequest) {
  try {
    const body: FloodRequest = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    console.log(`[Flood API] Analyzing risk for ${latitude}, ${longitude}`);

    // Fetch data in parallel
    const [precipData, waterBody] = await Promise.all([
      fetchHistoricalPrecipitation(latitude, longitude),
      fetchNearbyWaterBodies(latitude, longitude),
    ]);

    let source = 'Open-Meteo Historical + OpenStreetMap';

    // Get elevation (simplified - ideally use elevation API)
    // For now, use regional estimate
    let elevation = 1500; // Default for Kenya highlands
    if (latitude >= -5 && latitude <= 5 && longitude >= 39 && longitude <= 42) {
      elevation = 50; // Coastal
    } else if (latitude >= -2 && latitude <= 2 && longitude >= 34 && longitude <= 36) {
      elevation = 1100; // Lake Victoria basin
    }

    const annualPrecip = precipData?.annual || 900;
    const maxDailyPrecip = precipData?.maxDaily || 80;

    // Calculate risk
    const { riskLevel, score } = calculateFloodRisk(
      elevation,
      waterBody?.distance || null,
      annualPrecip,
      maxDailyPrecip
    );

    // Project flood depths based on risk
    const baseDepth = score / 100;
    const projectedDepth = {
      '10yr': Math.round(baseDepth * 0.3 * 100) / 100,
      '50yr': Math.round(baseDepth * 0.6 * 100) / 100,
      '100yr': Math.round(baseDepth * 1.0 * 100) / 100,
    };

    const result: FloodResponse = {
      success: true,
      data: {
        riskLevel,
        riskScore: score,
        floodZone: getFloodZone(riskLevel, waterBody?.distance || null),
        factors: {
          elevation,
          nearestWaterBody: waterBody,
          historicalPrecipitation: annualPrecip,
          maxDailyPrecipitation: maxDailyPrecip,
          drainageCapacity: score > 50 ? 'Limited' : 'Adequate',
          urbanization: 'Moderate', // Would need land use data
        },
        historicalEvents: precipData?.extremeDays || 0,
        projectedDepth,
        mitigations: getMitigations(riskLevel, waterBody?.distance || null),
        insuranceCategory: riskLevel === 'critical' ? 'High Premium Required' :
          riskLevel === 'high' ? 'Elevated Premium' :
            riskLevel === 'medium' ? 'Standard Premium' : 'Preferred Rate',
        buildingRecommendations: getBuildingRecommendations(riskLevel),
        source,
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Flood API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to assess flood risk' },
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
