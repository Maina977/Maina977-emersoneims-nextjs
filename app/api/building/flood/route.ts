/**
 * Flood screening API (not a flood study).
 * Rainfall history (NASA POWER, or Open-Meteo only when licensed) + SRTM ground
 * elevation + OpenStreetMap water bodies. Any missing input → INSUFFICIENT EVIDENCE.
 */

import { NextRequest, NextResponse } from 'next/server';
import { licensedOpenMeteoUrl, OPEN_METEO_DISABLED_MESSAGE } from '@/lib/data-sources/openMeteo';
import { fetchNasaPowerPrecipitation } from '@/lib/data-sources/nasaPower';
import { fetchPointElevation } from '@/lib/data-sources/elevation';
import { overpassQuery, OSM_ATTRIBUTION } from '@/lib/data-sources/overpass';

interface FloodRequest {
  latitude: number;
  longitude: number;
}

interface FloodResponse {
  success: boolean;
  data?: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;        // 0-100
    floodZone: string;        // screening category, not a mapped flood zone
    method: string;
    factors: {
      elevation: number;      // m above sea level (SRTM)
      elevationSource: string;
      nearestWaterBody: { name: string; type: string; distance: number } | null; // null = none within 2 km
      historicalPrecipitation: number;  // mm/year
      maxDailyPrecipitation: number;    // mm
      drainageCapacity: null;  // not assessed: no drainage data
      urbanization: null;      // not assessed: no land-use data
    };
    historicalEvents: number;
    // No hydraulic or hydrological model is run, so no return-period depths are given.
    projectedDepth: null;
    projectedDepthNote: string;
    mitigations: string[];
    insuranceCategory: null;   // not an insurer's assessment
    limitations: string[];
    buildingRecommendations: string[];
    source: string;
  };
  error?: string;
}

// Open-Meteo Historical API
const OPEN_METEO_HISTORICAL_URL = 'https://archive-api.open-meteo.com/v1/archive';


async function fetchHistoricalPrecipitation(lat: number, lng: number): Promise<{
  annual: number;
  maxDaily: number;
  extremeDays: number;
  source?: string;
  note?: string;
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

    // Licence gate (2026-11-14): Open-Meteo only when licensed; otherwise NASA
    // POWER daily corrected precipitation (MERRA-2 bias-corrected, 0.5° x 0.625°).
    const url = licensedOpenMeteoUrl(`${OPEN_METEO_HISTORICAL_URL}?${params}`);
    if (!url) {
      console.warn(OPEN_METEO_DISABLED_MESSAGE);
      return await fetchNasaPowerPrecipitation(lat, lng, startDate, endDate);
    }
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });

    if (response?.ok) {
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
        source: 'Open-Meteo Historical (licensed)',
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

// 'failed' (lookup did not answer) is kept apart from 'none' (no water within
// the radius): a failed lookup used to score like a site far from water.
type WaterBodyLookup =
  | { status: 'found'; body: { name: string; type: string; distance: number } }
  | { status: 'none' }
  | { status: 'failed' };

async function fetchNearbyWaterBodies(lat: number, lng: number, radiusKm: number = 2): Promise<WaterBodyLookup> {
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

    // Identifying User-Agent + mirror fallback (overpass-api.de refuses Node's default with 406).
    const data = await overpassQuery(query, { timeoutMs: 12000 });

    if (data) {
      if (data.elements.length > 0) {
        // Find closest water body
        let closest: { name: string; type: string; distance: number } | null = null;
        let minDistance = Infinity;

        for (const element of data.elements) {
          const elLat = element.center?.lat || element.lat;
          const elLng = element.center?.lon || element.lon;

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

        return closest ? { status: 'found', body: closest } : { status: 'none' };
      }
      return { status: 'none' };
    }
  } catch (error) {
    console.error('[Flood] Water bodies fetch failed:', error);
  }
  return { status: 'failed' };
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
  } else {
    score += 5; // none mapped within 2 km: same as the farthest band, never lower
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

// FEMA zone names (AE, A, X500…) were shown here, but they come from mapped US
// flood studies; no such map exists for these sites. A plain screening label only.
function getFloodZone(riskLevel: string, _waterBodyDistance: number | null): string {
  if (riskLevel === 'critical') return 'Screening: very high flood concern (not a mapped flood zone)';
  if (riskLevel === 'high') return 'Screening: high flood concern (not a mapped flood zone)';
  if (riskLevel === 'medium') return 'Screening: moderate flood concern (not a mapped flood zone)';
  return 'Screening: low flood concern (not a mapped flood zone)';
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
    const [precipData, waterLookup, ground] = await Promise.all([
      fetchHistoricalPrecipitation(latitude, longitude),
      fetchNearbyWaterBodies(latitude, longitude),
      fetchPointElevation(latitude, longitude),
    ]);

    // No rainfall history → no flood rating (2026-11-14): the former 900 mm/yr and
    // 80 mm/day stand-ins produced a rating from invented rainfall.
    if (!precipData) {
      return NextResponse.json({ success: false, status: 'INSUFFICIENT EVIDENCE', error: 'INSUFFICIENT EVIDENCE: rainfall history unavailable for this location, so no flood rating is given.' }, { status: 503 });
    }
    // Measured ground elevation or no rating (2026-11-14): the former latitude-box
    // guess (1500 / 50 / 1100 m) decided up to 40 of the 100 points.
    if (!ground) {
      return NextResponse.json({ success: false, status: 'INSUFFICIENT EVIDENCE', error: 'INSUFFICIENT EVIDENCE: ground elevation unavailable for this location, so no flood rating is given.' }, { status: 503 });
    }
    if (waterLookup.status === 'failed') {
      return NextResponse.json({ success: false, status: 'SERVICE UNAVAILABLE', error: 'SERVICE UNAVAILABLE: the OpenStreetMap water-body lookup did not answer, so no flood rating is given. Try again later.' }, { status: 503 });
    }
    const waterBody = waterLookup.status === 'found' ? waterLookup.body : null;
    const elevation = ground.elevationM;
    const source = `${precipData.source ?? 'Rainfall history'} + ${ground.source} + water bodies ${OSM_ATTRIBUTION}${precipData.note ? `. ${precipData.note}` : ''}`;

    const annualPrecip = precipData.annual;
    const maxDailyPrecip = precipData.maxDaily;

    // Calculate risk
    const { riskLevel, score } = calculateFloodRisk(
      elevation,
      waterBody?.distance || null,
      annualPrecip,
      maxDailyPrecip
    );

    // Return-period depths were score × 0.3 / 0.6 / 1.0 m: invented, removed
    // (2026-11-14). So were the insurance band, drainage and urbanisation labels.
    const result: FloodResponse = {
      success: true,
      data: {
        riskLevel,
        riskScore: score,
        floodZone: getFloodZone(riskLevel, waterBody ? waterBody.distance : null),
        method: 'Screening score from ground elevation, distance to mapped water and rainfall history. Not a flood study.',
        factors: {
          elevation,
          elevationSource: ground.source,
          nearestWaterBody: waterBody,
          historicalPrecipitation: annualPrecip,
          maxDailyPrecipitation: maxDailyPrecip,
          drainageCapacity: null,
          urbanization: null,
        },
        historicalEvents: precipData.extremeDays || 0,
        projectedDepth: null,
        projectedDepthNote: 'No flood depths are given: that needs a hydraulic model with surveyed levels and river flows.',
        mitigations: getMitigations(riskLevel, waterBody ? waterBody.distance : null),
        insuranceCategory: null,
        limitations: [
          'Elevation above sea level matters mainly near the coast; inland river and flash flooding depend on local low points, which this screen does not see.',
          'Water bodies are those mapped in OpenStreetMap within 2 km; unmapped streams and drains are missed.',
          'Rainfall is a gridded record, coarser than the site.',
          'For design, confirm with a site survey, the county flood records and a qualified engineer.',
        ],
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
