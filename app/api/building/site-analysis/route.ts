/**
 * COMPLETE Site Analysis API
 * Combines ALL real data sources for comprehensive building site assessment
 *
 * Data Sources:
 * - Open-Elevation API (terrain)
 * - ISRIC SoilGrids (soil)
 * - NASA POWER (climate)
 * - /api/building/flood (NASA POWER rainfall + SRTM elevation + OSM water)
 * - OpenStreetMap Overpass (water bodies, utilities, amenities)
 * - OpenStreetMap Nominatim (geocoding)
 */

import { NextRequest, NextResponse } from 'next/server';

interface SiteAnalysisRequest {
  latitude: number;
  longitude: number;
  plotSize?: number;      // sqm
  buildingType?: string;
  country?: string;
}

interface CompleteSiteAnalysis {
  location: {
    latitude: number;
    longitude: number;
    address: string;
    county: string;
    country: string;
  };
  // A section is null when its source did not answer (2026-11-14): it used to
  // be filled with fixed stand-ins (1500 m, 5° slope, loam, 100 kPa bearing,
  // 10 m water table, low flood risk), which read as site findings.
  terrain: {
    elevation: number;
    slope: number;
    aspect: string;
    terrainType: string;
    accessibility: string | null; // null when the source gave no slope
  } | null;
  soil: {
    type: string;
    classification: string;
    bearingCapacity: number;
    waterTable: number;
    expansive: boolean;
    corrosivity: string;
    foundationRecommendation: string;
    excavationDifficulty: string;
    properties: {
      clay: number;
      sand: number;
      silt: number;
      ph: number;
    };
  } | null;
  climate: {
    zone: string;
    temperature: { annual: number; max: number; min: number };
    rainfall: { annual: number; maxMonthly: number };
    wind: { avgSpeed: number; maxSpeed: number; designPressure: null };
    solar: { irradiance: number; sunHours: null };
    buildingCode: string;
  } | null;
  flood: {
    riskLevel: string;
    riskScore: number;
    floodZone: string;
    nearestWaterBody: { name: string; distance: number } | null;
    mitigations: string[];
  } | null;
  seismic: {
    zone: number;
    riskLevel: string;
    pga: number;
    requirements: string[];
  };
  // null when OpenStreetMap did not answer; "available" = mapped within the radius.
  infrastructure: {
    source: string;
    roadAccess: { available: boolean; type: string | null; distance: number | null; searchRadiusM: number };
    electricity: { available: boolean; distance: number | null; voltage: null; searchRadiusM: number };
    water: { available: boolean; type: string; distance: number | null; searchRadiusM: number };
    sewer: { available: boolean; type: string; distance: number | null; searchRadiusM: number };
    telecom: null;
  } | null;
  amenities: {
    hospital: number | null;
    school: number | null;
    shopping: number | null;
    police: number | null;
    publicTransport: number | null;
  } | null;
  legal: {
    zoning: string;
    maxHeight: number;
    maxCoverage: number;
    setbacks: { front: number; rear: number; side: number };
  };
  overallScore: number | null;     // null unless terrain, soil and flood all answered
  buildingSuitability: string;
  insufficientEvidence: string[];  // sections whose source did not answer
  recommendations: string[];
  risks: Array<{ type: string; level: string; description: string }>;
  dataSources: string[];
  analysisTimestamp: string;
}

// Helper to call internal APIs
async function callInternalAPI(endpoint: string, body: any): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`[Site Analysis] Failed to call ${endpoint}:`, error);
    return null;
  }
}

// Reverse geocoding
async function reverseGeocode(lat: number, lng: number): Promise<{
  address: string;
  county: string;
  country: string;
}> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: { 'User-Agent': 'ProBuildingSuite/1.0' },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        address: data.display_name || '',
        county: data.address?.county || data.address?.state_district || data.address?.state || '',
        country: data.address?.country_code?.toUpperCase() || 'KE',
      };
    }
  } catch (error) {
    console.error('[Geocode] Failed:', error);
  }

  return { address: '', county: '', country: 'KE' };
}

// Fetch nearby amenities from OpenStreetMap
// Distances in metres to the nearest mapped feature; null = none mapped within
// the search radius. The whole result is null when OpenStreetMap did not answer
// (2026-11-14: fixed defaults such as hospital 5000 m were returned instead).
type Amenities = { hospital: number | null; school: number | null; shopping: number | null; police: number | null; publicTransport: number | null };

async function fetchNearbyAmenities(lat: number, lng: number): Promise<Amenities | null> {
  try {
    const query = `
      [out:json][timeout:20];
      (
        node["amenity"="hospital"](around:10000,${lat},${lng});
        node["amenity"="school"](around:5000,${lat},${lng});
        node["shop"](around:5000,${lat},${lng});
        node["amenity"="police"](around:10000,${lat},${lng});
        node["highway"="bus_stop"](around:2000,${lat},${lng});
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(20000),
    });

    if (response.ok) {
      const data = await response.json();
      const elements = data.elements || [];

      // A tag "key=value" must match exactly; a bare "key" needs the key present.
      // (The old test matched every non-shop element as a shop.)
      const matches = (el: any, t: string) => {
        const [k, v] = t.split('=');
        return v === undefined ? el.tags?.[k] !== undefined : el.tags?.[k] === v;
      };
      const findClosest = (tag: string): number | null => {
        let min: number | null = null;
        for (const el of elements) {
          if (!matches(el, tag) || typeof el.lat !== 'number' || typeof el.lon !== 'number') continue;
          const d = calculateDistance(lat, lng, el.lat, el.lon);
          if (min === null || d < min) min = d;
        }
        return min === null ? null : Math.round(min);
      };

      return {
        hospital: findClosest('amenity=hospital'),
        school: findClosest('amenity=school'),
        shopping: findClosest('shop'),
        police: findClosest('amenity=police'),
        publicTransport: findClosest('highway=bus_stop'),
      };
    }
  } catch (error) {
    console.error('[Amenities] Fetch failed:', error);
  }

  return null;
}

// Fetch infrastructure from OpenStreetMap
async function fetchInfrastructure(lat: number, lng: number): Promise<any> {
  try {
    const query = `
      [out:json][timeout:15];
      (
        way["highway"](around:500,${lat},${lng});
        node["power"="pole"](around:500,${lat},${lng});
        node["man_made"="water_tap"](around:1000,${lat},${lng});
        node["man_made"="manhole"](around:500,${lat},${lng});
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const data = await response.json();
      const elements = data.elements || [];

      // "available" means mapped in OpenStreetMap within the search radius, and
      // the distance is to the nearest mapped feature (2026-11-14: distances were
      // fixed numbers such as 50 / 500 m, and fibre and "Good (4G)" were always shown).
      const nearest = (list: any[]): number | null => {
        let best: number | null = null;
        for (const e of list) {
          const la = e.center?.lat ?? e.lat, lo = e.center?.lon ?? e.lon;
          if (typeof la !== 'number' || typeof lo !== 'number') continue;
          const d = Math.round(calculateDistance(lat, lng, la, lo));
          if (best === null || d < best) best = d;
        }
        return best;
      };
      const roads = elements.filter((e: any) => e.tags?.highway);
      const power = elements.filter((e: any) => e.tags?.power);
      const water = elements.filter((e: any) => e.tags?.man_made === 'water_tap');
      const sewer = elements.filter((e: any) => e.tags?.man_made === 'manhole');

      return {
        source: 'OpenStreetMap Overpass (mapped features only)',
        roadAccess: { available: roads.length > 0, type: roads[0]?.tags?.highway ?? null, distance: nearest(roads), searchRadiusM: 500 },
        electricity: { available: power.length > 0, distance: nearest(power), voltage: null, searchRadiusM: 500 },
        water: { available: water.length > 0, type: water.length > 0 ? 'Mapped water tap' : 'No water tap mapped within 1 km: confirm with the water company', distance: nearest(water), searchRadiusM: 1000 },
        sewer: { available: sewer.length > 0, type: sewer.length > 0 ? 'Mapped manhole' : 'No sewer manhole mapped within 500 m: confirm with the county', distance: nearest(sewer), searchRadiusM: 500 },
        telecom: null, // no coverage data source
      };
    }
  } catch (error) {
    console.error('[Infrastructure] Fetch failed:', error);
  }

  // No answer → no infrastructure claims (it used to report a tarmac road at
  // 100 m and power at 200 m for any site).
  return null;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getSeismicData(lat: number, lng: number, country: string): {
  zone: number;
  riskLevel: string;
  pga: number;
  requirements: string[];
} {
  // Simplified seismic zones for Africa
  let zone = 1;
  let pga = 0.05;

  // East African Rift increases seismic activity
  if ((lat >= -4 && lat <= 4 && lng >= 35 && lng <= 40) ||
    (lat >= 0 && lat <= 4 && lng >= 29 && lng <= 35)) {
    zone = 2;
    pga = 0.15;
  }

  // Ethiopia has higher seismic activity
  if (country === 'ET') {
    zone = 3;
    pga = 0.25;
  }

  const riskLevel = zone >= 3 ? 'High' : zone >= 2 ? 'Moderate' : 'Low';
  const requirements = zone >= 2 ? [
    'Seismic detailing required',
    'Ductile beam-column connections',
    'Minimum reinforcement ratios per seismic code',
  ] : [];

  return { zone, riskLevel, pga, requirements };
}

function getZoningDefaults(buildingType: string): {
  zoning: string;
  maxHeight: number;
  maxCoverage: number;
  setbacks: { front: number; rear: number; side: number };
} {
  const zoningMap: Record<string, any> = {
    residential: { zoning: 'R1 - Low Density Residential', maxHeight: 12, maxCoverage: 50, setbacks: { front: 6, rear: 3, side: 1.5 } },
    apartment: { zoning: 'R3 - High Density Residential', maxHeight: 30, maxCoverage: 60, setbacks: { front: 6, rear: 4, side: 3 } },
    commercial: { zoning: 'C1 - Commercial', maxHeight: 45, maxCoverage: 80, setbacks: { front: 3, rear: 3, side: 0 } },
    industrial: { zoning: 'I1 - Light Industrial', maxHeight: 20, maxCoverage: 70, setbacks: { front: 10, rear: 6, side: 3 } },
  };

  return zoningMap[buildingType] || zoningMap.residential;
}

// A missing value must not pass a threshold test: in JavaScript `null < 75` is
// true, so a null bearing capacity read as "low bearing". NaN fails every comparison.
const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : NaN);

function calculateOverallScore(
  terrain: any,
  soil: any,
  flood: any,
  infrastructure: any
): number {
  let score = 50;

  // Terrain factors
  if (num(terrain?.slope) < 5) score += 10;
  else if (num(terrain?.slope) > 15) score -= 10;

  // Soil factors
  if (num(soil?.bearingCapacity) > 150) score += 10;
  else if (num(soil?.bearingCapacity) < 75) score -= 15;

  if (soil?.expansive) score -= 10;

  // Flood risk
  if (flood?.riskLevel === 'low') score += 10;
  else if (flood?.riskLevel === 'high') score -= 15;
  else if (flood?.riskLevel === 'critical') score -= 25;

  // Infrastructure
  if (infrastructure?.roadAccess?.available) score += 5;
  if (infrastructure?.electricity?.available) score += 5;
  if (infrastructure?.water?.available) score += 5;
  if (infrastructure?.sewer?.available) score += 5;

  return Math.max(20, Math.min(95, score));
}

function generateRecommendations(
  terrain: any,
  soil: any,
  flood: any,
  seismic: any,
  infrastructure: any
): string[] {
  const recommendations: string[] = [];

  // Foundation
  if (soil?.foundationRecommendation) {
    recommendations.push(`Foundation: ${soil.foundationRecommendation}`);
  }

  // Slope
  if (num(terrain?.slope) > 10) {
    recommendations.push('Site requires cut and fill earthworks - budget for retaining walls');
  }

  // Flood
  if (flood?.riskLevel === 'high' || flood?.riskLevel === 'critical') {
    recommendations.push('Elevate ground floor minimum 0.6m above natural ground level');
    recommendations.push('Install comprehensive drainage system');
  }

  // Seismic
  if (seismic?.zone >= 2) {
    recommendations.push('Use seismic design provisions per building code');
  }

  // Infrastructure
  // Utility advice only from a real lookup: an unanswered lookup is not "no water".
  if (infrastructure && !infrastructure.water?.available) {
    recommendations.push('Plan for borehole drilling - include in budget');
  }

  if (infrastructure && !infrastructure.electricity?.available) {
    recommendations.push('Budget for power connection or consider solar + generator');
  }

  if (infrastructure && !infrastructure.sewer?.available) {
    recommendations.push('Design septic system with biodigester');
  }

  return recommendations;
}

function identifyRisks(
  terrain: any,
  soil: any,
  flood: any,
  seismic: any
): Array<{ type: string; level: string; description: string }> {
  const risks: Array<{ type: string; level: string; description: string }> = [];

  if (soil?.expansive) {
    risks.push({
      type: 'Geological',
      level: 'high',
      description: 'Expansive soil detected - special foundation required',
    });
  }

  if (num(soil?.bearingCapacity) < 75) {
    risks.push({
      type: 'Geological',
      level: 'high',
      description: 'Low bearing capacity - pile foundation may be required',
    });
  }

  if (flood?.riskLevel === 'high' || flood?.riskLevel === 'critical') {
    risks.push({
      type: 'Flood',
      level: flood.riskLevel,
      description: `Site in ${flood.floodZone} - flood mitigation required`,
    });
  }

  if (seismic?.zone >= 2) {
    risks.push({
      type: 'Seismic',
      level: seismic.zone >= 3 ? 'high' : 'medium',
      description: `Seismic Zone ${seismic.zone} - enhanced structural design required`,
    });
  }

  if (num(terrain?.slope) > 15) {
    risks.push({
      type: 'Terrain',
      level: 'medium',
      description: 'Steep slope - erosion control and retaining structures needed',
    });
  }

  return risks;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: SiteAnalysisRequest = await request.json();
    const { latitude, longitude, buildingType = 'residential', country = 'KE' } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    console.log(`[Complete Site Analysis] Starting for ${latitude}, ${longitude}`);

    const dataSources: string[] = [];

    // Parallel API calls for maximum speed
    const [
      geocode,
      elevation,
      soil,
      climate,
      flood,
      infrastructure,
      amenities,
    ] = await Promise.all([
      reverseGeocode(latitude, longitude),
      callInternalAPI('/api/building/elevation', { latitude, longitude }),
      callInternalAPI('/api/building/soil', { latitude, longitude }),
      callInternalAPI('/api/building/climate', { latitude, longitude }),
      callInternalAPI('/api/building/flood', { latitude, longitude }),
      fetchInfrastructure(latitude, longitude),
      fetchNearbyAmenities(latitude, longitude),
    ]);

    if (geocode.address) dataSources.push('OpenStreetMap Nominatim');
    if (elevation?.source) dataSources.push(elevation.source);
    if (soil?.source) dataSources.push(soil.source);
    if (climate?.source) dataSources.push(climate.source);
    if (flood?.source) dataSources.push(flood.source);
    if (infrastructure || amenities) dataSources.push('OpenStreetMap Overpass');

    // Get seismic and zoning data
    const seismic = getSeismicData(latitude, longitude, geocode.country);
    const zoning = getZoningDefaults(buildingType);

    // No overall score from missing inputs: an absent soil or flood answer used
    // to count as neither good nor bad, so a gap could still read "Good".
    const insufficientEvidence: string[] = [];
    if (!elevation) insufficientEvidence.push('terrain: elevation service did not answer');
    if (!soil) insufficientEvidence.push('soil: soil service did not answer');
    if (!climate) insufficientEvidence.push('climate: climate service did not answer');
    if (!flood) insufficientEvidence.push('flood: no flood screening (rainfall, elevation or water-body data unavailable)');
    if (!infrastructure) insufficientEvidence.push('infrastructure: OpenStreetMap lookup did not answer');
    if (!amenities) insufficientEvidence.push('amenities: OpenStreetMap lookup did not answer');
    const scorable = Boolean(elevation && soil && flood);
    const overallScore = scorable ? calculateOverallScore(elevation, soil, flood, infrastructure) : null;
    const buildingSuitability = overallScore === null ? 'INSUFFICIENT EVIDENCE' :
      overallScore >= 70 ? 'Excellent' :
        overallScore >= 55 ? 'Good' :
          overallScore >= 40 ? 'Moderate' : 'Challenging';

    // Generate recommendations and risks
    const recommendations = generateRecommendations(elevation, soil, flood, seismic, infrastructure);
    const risks = identifyRisks(elevation, soil, flood, seismic);

    const processingTime = Date.now() - startTime;
    console.log(`[Complete Site Analysis] Done in ${processingTime}ms`);

    const result: { success: boolean; data: CompleteSiteAnalysis } = {
      success: true,
      data: {
        location: {
          latitude,
          longitude,
          address: geocode.address,
          county: geocode.county,
          country: geocode.country,
        },
        // Values pass through as the source gave them (?? keeps a real 0);
        // a missing section is null, never a stand-in.
        terrain: elevation ? {
          elevation: elevation.elevation ?? null,
          slope: elevation.slope ?? null,
          aspect: elevation.aspect ?? null,
          terrainType: elevation.terrainType ?? null,
          accessibility: typeof elevation.slope === 'number' ? (elevation.slope < 10 ? 'Good' : 'Moderate') : null,
        } : null,
        soil: soil ? {
          type: soil.soilType ?? null,
          classification: soil.classification ?? null,
          bearingCapacity: soil.bearingCapacity ?? null,
          waterTable: soil.waterTable ?? null,
          expansive: soil.expansive ?? null,
          corrosivity: soil.corrosivity ?? null,
          foundationRecommendation: soil.foundationRecommendation ?? null,
          excavationDifficulty: soil.excavationDifficulty ?? null,
          properties: soil.properties ?? null,
        } : null,
        climate: climate ? {
          zone: climate.climateZone ?? null,
          temperature: climate.temperature ?? null,
          rainfall: climate.rainfall ?? null,
          wind: climate.wind ?? null,
          solar: climate.solar ?? null,
          buildingCode: climate.buildingDesignCode ?? null,
        } : null,
        flood: flood ? {
          riskLevel: flood.riskLevel,
          riskScore: flood.riskScore,
          floodZone: flood.floodZone,
          nearestWaterBody: flood.factors?.nearestWaterBody ?? null,
          mitigations: flood.mitigations ?? [],
        } : null,
        insufficientEvidence,
        seismic,
        infrastructure,
        amenities,
        legal: zoning,
        overallScore,
        buildingSuitability,
        recommendations,
        risks,
        dataSources: [...new Set(dataSources)],
        analysisTimestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Complete Site Analysis] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Site analysis failed' },
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
