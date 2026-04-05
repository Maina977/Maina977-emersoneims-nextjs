/**
 * REAL Soil Data API
 * Uses SoilGrids API (ISRIC - World Soil Information)
 * Free, no API key needed
 * https://rest.isric.org/soilgrids/v2.0/docs
 */

import { NextRequest, NextResponse } from 'next/server';

interface SoilRequest {
  latitude: number;
  longitude: number;
}

interface SoilResponse {
  success: boolean;
  data?: {
    soilType: string;
    classification: string;
    properties: {
      clay: number;        // %
      sand: number;        // %
      silt: number;        // %
      organicCarbon: number; // g/kg
      ph: number;
      bulkDensity: number; // kg/dm³
      coarseFragments: number; // %
      nitrogen: number;    // g/kg
      cationExchange: number; // cmol(c)/kg
    };
    bearingCapacity: number;  // kN/m² (calculated)
    waterTable: number;       // estimated depth in meters
    permeability: string;
    expansive: boolean;
    corrosivity: string;
    foundationRecommendation: string;
    excavationDifficulty: string;
    source: string;
    depths: string;
  };
  error?: string;
}

// SoilGrids API endpoint
const SOILGRIDS_URL = 'https://rest.isric.org/soilgrids/v2.0/properties/query';

// Soil properties to fetch
const SOIL_PROPERTIES = ['clay', 'sand', 'silt', 'phh2o', 'soc', 'bdod', 'cfvo', 'nitrogen', 'cec'];
const SOIL_DEPTHS = ['0-5cm', '5-15cm', '15-30cm', '30-60cm', '60-100cm', '100-200cm'];

async function fetchSoilGridsData(lat: number, lng: number): Promise<any | null> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      property: SOIL_PROPERTIES.join(','),
      depth: SOIL_DEPTHS.join(','),
      value: 'mean',
    });

    const response = await fetch(`${SOILGRIDS_URL}?${params}`, {
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('[SoilGrids] Response not OK:', response.status);
    }
  } catch (error) {
    console.error('[SoilGrids] Fetch failed:', error);
  }
  return null;
}

function extractProperty(data: any, property: string, depth: string = '30-60cm'): number {
  try {
    const prop = data.properties.layers.find((l: any) => l.name === property);
    if (!prop) return 0;

    const depthData = prop.depths.find((d: any) => d.label === depth);
    if (!depthData) return 0;

    return depthData.values.mean || 0;
  } catch {
    return 0;
  }
}

function classifySoilType(clay: number, sand: number, silt: number): string {
  // USDA Soil Texture Triangle classification
  if (clay >= 40) {
    if (silt >= 40) return 'Silty Clay';
    if (sand >= 45) return 'Sandy Clay';
    return 'Clay';
  }
  if (clay >= 27 && clay < 40) {
    if (sand >= 20 && sand < 45) return 'Clay Loam';
    if (silt >= 28 && silt < 50) return 'Silty Clay Loam';
    return 'Sandy Clay Loam';
  }
  if (silt >= 50) {
    if (silt >= 80) return 'Silt';
    return 'Silty Loam';
  }
  if (sand >= 85) return 'Sand';
  if (sand >= 70) return 'Loamy Sand';
  if (sand >= 52) return 'Sandy Loam';
  return 'Loam';
}

function calculateBearingCapacity(clay: number, sand: number, bulkDensity: number): number {
  // Simplified bearing capacity estimation (kN/m²)
  // Based on soil composition and density
  let baseBearing = 100;

  if (sand >= 70) baseBearing = 200;  // Sandy soils have higher bearing
  else if (clay >= 50) baseBearing = 75;  // High clay reduces bearing
  else if (clay >= 30) baseBearing = 100;
  else baseBearing = 150;

  // Adjust for bulk density (higher density = higher bearing)
  const densityFactor = bulkDensity / 1.4; // 1.4 is typical
  baseBearing *= densityFactor;

  return Math.round(baseBearing);
}

function estimateWaterTable(lat: number, lng: number, clay: number): number {
  // Simplified water table estimation
  // Kenya/East Africa typically 5-30m depending on location
  let baseDepth = 10;

  // Higher clay = shallower water table
  if (clay > 50) baseDepth = 3;
  else if (clay > 30) baseDepth = 5;
  else baseDepth = 10;

  // Adjust for location (coastal areas shallower)
  const distanceFromCoast = Math.abs(lng - 40); // Approximate for Kenya
  baseDepth += distanceFromCoast * 0.3;

  return Math.round(baseDepth);
}

function getFoundationRecommendation(soilType: string, bearingCapacity: number, expansive: boolean): string {
  if (expansive) {
    if (bearingCapacity < 75) return 'Pile Foundation (Under-ream type recommended due to expansive soil)';
    return 'Raft Foundation with moisture barrier or Pile Foundation';
  }

  if (bearingCapacity >= 200) return 'Strip Foundation or Pad Foundation';
  if (bearingCapacity >= 100) return 'Strip Foundation or Raft Foundation';
  if (bearingCapacity >= 50) return 'Raft Foundation';
  return 'Pile Foundation (deep foundations required)';
}

function getExcavationDifficulty(clay: number, sand: number, coarseFragments: number): string {
  if (coarseFragments > 35) return 'Difficult (high rock content)';
  if (clay > 50) return 'Moderate (cohesive soil)';
  if (sand > 80) return 'Easy (loose sandy soil)';
  return 'Moderate';
}

function getPermeability(clay: number, sand: number): string {
  if (sand >= 70) return 'High (rapid drainage)';
  if (clay >= 50) return 'Very Low (poor drainage)';
  if (clay >= 30) return 'Low';
  return 'Moderate';
}

function getCorrosivity(ph: number, clay: number): string {
  // Soil corrosivity based on pH and clay content
  if (ph < 5.5 || ph > 9) return 'High';
  if (clay > 40 && (ph < 6 || ph > 8)) return 'Moderate';
  return 'Low';
}

export async function POST(request: NextRequest) {
  try {
    const body: SoilRequest = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    console.log(`[Soil API] Fetching for ${latitude}, ${longitude}`);

    // Fetch real data from SoilGrids
    const soilData = await fetchSoilGridsData(latitude, longitude);
    let source = 'ISRIC SoilGrids';

    let clay: number, sand: number, silt: number, ph: number;
    let organicCarbon: number, bulkDensity: number, coarseFragments: number;
    let nitrogen: number, cationExchange: number;

    if (soilData && soilData.properties?.layers) {
      // Extract values from SoilGrids response
      clay = extractProperty(soilData, 'clay', '30-60cm') / 10; // Convert from g/kg to %
      sand = extractProperty(soilData, 'sand', '30-60cm') / 10;
      silt = extractProperty(soilData, 'silt', '30-60cm') / 10;
      ph = extractProperty(soilData, 'phh2o', '30-60cm') / 10; // pH is stored as pH * 10
      organicCarbon = extractProperty(soilData, 'soc', '30-60cm') / 10; // g/kg / 10
      bulkDensity = extractProperty(soilData, 'bdod', '30-60cm') / 100; // Convert to kg/dm³
      coarseFragments = extractProperty(soilData, 'cfvo', '30-60cm') / 10;
      nitrogen = extractProperty(soilData, 'nitrogen', '30-60cm') / 100;
      cationExchange = extractProperty(soilData, 'cec', '30-60cm') / 10;
    } else {
      // Regional fallback for Kenya
      source = 'Regional Model (Kenya)';

      // Common soil types in different Kenya regions
      if (latitude >= -1 && latitude <= 1 && longitude >= 36 && longitude <= 38) {
        // Central Kenya (Red volcanic soils - Nitisols)
        clay = 45; sand = 25; silt = 30; ph = 5.8;
        organicCarbon = 2.5; bulkDensity = 1.2; coarseFragments = 10;
        nitrogen = 0.2; cationExchange = 25;
      } else if (latitude <= -2 && longitude >= 39) {
        // Coastal Kenya (Sandy soils)
        clay = 15; sand = 70; silt = 15; ph = 7.2;
        organicCarbon = 0.8; bulkDensity = 1.5; coarseFragments = 5;
        nitrogen = 0.1; cationExchange = 8;
      } else if (latitude >= -1 && latitude <= 2 && longitude >= 34 && longitude <= 36) {
        // Western Kenya (Black cotton soil - Vertisols)
        clay = 55; sand = 20; silt = 25; ph = 6.5;
        organicCarbon = 1.5; bulkDensity = 1.3; coarseFragments = 5;
        nitrogen = 0.15; cationExchange = 35;
      } else {
        // Default (Loam)
        clay = 25; sand = 40; silt = 35; ph = 6.2;
        organicCarbon = 1.2; bulkDensity = 1.4; coarseFragments = 15;
        nitrogen = 0.12; cationExchange = 15;
      }
    }

    // Normalize percentages
    const total = clay + sand + silt;
    if (total > 0 && Math.abs(total - 100) > 5) {
      const factor = 100 / total;
      clay *= factor;
      sand *= factor;
      silt *= factor;
    }

    const soilType = classifySoilType(clay, sand, silt);
    const bearingCapacity = calculateBearingCapacity(clay, sand, bulkDensity || 1.4);
    const expansive = clay > 40 && soilType.includes('Clay');
    const waterTable = estimateWaterTable(latitude, longitude, clay);

    const result: SoilResponse = {
      success: true,
      data: {
        soilType,
        classification: `${soilType} (USDA Classification)`,
        properties: {
          clay: Math.round(clay * 10) / 10,
          sand: Math.round(sand * 10) / 10,
          silt: Math.round(silt * 10) / 10,
          organicCarbon: Math.round(organicCarbon * 100) / 100,
          ph: Math.round(ph * 10) / 10,
          bulkDensity: Math.round((bulkDensity || 1.4) * 100) / 100,
          coarseFragments: Math.round(coarseFragments),
          nitrogen: Math.round(nitrogen * 1000) / 1000,
          cationExchange: Math.round(cationExchange * 10) / 10,
        },
        bearingCapacity,
        waterTable,
        permeability: getPermeability(clay, sand),
        expansive,
        corrosivity: getCorrosivity(ph, clay),
        foundationRecommendation: getFoundationRecommendation(soilType, bearingCapacity, expansive),
        excavationDifficulty: getExcavationDifficulty(clay, sand, coarseFragments),
        source,
        depths: '30-60cm analysis depth',
      },
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Soil API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch soil data' },
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
