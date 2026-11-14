/**
 * Soil description from SoilGrids 2.0 (ISRIC, CC BY 4.0), 30-60 cm.
 * No answer → INSUFFICIENT EVIDENCE. Bearing capacity and water table are not
 * given: a soil map cannot supply them.
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
    // Each value is null when SoilGrids did not report it (never 0 or a stand-in).
    properties: {
      clay: number;        // %
      sand: number;        // %
      silt: number;        // %
      organicCarbon: number | null; // g/kg
      ph: number | null;
      bulkDensity: number | null; // kg/dm³
      coarseFragments: number | null; // %
      nitrogen: number | null;    // g/kg
      cationExchange: number | null; // cmol(c)/kg
    };
    // 2026-11-14: bearing capacity was a texture rule of thumb (75-200 kPa) and
    // the water table a formula of clay % and longitude. Neither can be read from
    // a 250 m soil map; both are null and need a site investigation.
    bearingCapacity: null;
    waterTable: null;
    permeability: string;
    expansive: boolean;       // indicative only: clay-rich texture at 30-60 cm
    corrosivity: string | null;
    foundationRecommendation: string;
    excavationDifficulty: string | null;
    source: string;
    depths: string;
    limitations: string[];
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

// null when the layer or depth is missing: a missing clay value used to read as 0 % clay.
function extractProperty(data: any, property: string, depth: string = '30-60cm'): number | null {
  try {
    const prop = data.properties.layers.find((l: any) => l.name === property);
    const v = prop?.depths?.find((d: any) => d.label === depth)?.values?.mean;
    return typeof v === 'number' && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}
const scaled = (v: number | null, div: number) => (v === null ? null : v / div);
const round = (v: number | null, dp: number) => (v === null ? null : Math.round(v * 10 ** dp) / 10 ** dp);

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

// No foundation type is chosen from a soil map (2026-11-14): it used to follow
// from the texture-rule bearing capacity. The map can only flag what to look for.
function getFoundationRecommendation(expansive: boolean): string {
  const si = 'Foundation type and bearing pressure need a geotechnical site investigation (trial pits or boreholes with in-situ tests) and an engineer\'s design.';
  return expansive
    ? `${si} The soil map suggests clay-rich soil that may shrink and swell (for example black cotton soil): ask the investigation to test for it.`
    : si;
}

function getExcavationDifficulty(clay: number, sand: number, coarseFragments: number | null): string | null {
  if (coarseFragments === null) return null;
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

function getCorrosivity(ph: number | null, clay: number): string | null {
  // Soil corrosivity based on pH and clay content
  if (ph === null) return null;
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
    const source = 'ISRIC SoilGrids 2.0 (250 m, CC BY 4.0)';

    // SoilGrids or nothing (2026-11-14): the "Regional Model (Kenya)" fallback
    // returned one of four fixed soils chosen by a latitude/longitude box.
    const layer = (p: string) => (soilData?.properties?.layers ? extractProperty(soilData, p, '30-60cm') : null);
    const clayG = layer('clay'), sandG = layer('sand'), siltG = layer('silt');
    if (clayG === null || sandG === null || siltG === null) {
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT EVIDENCE: SoilGrids gave no clay/sand/silt for this location, so no soil description is given.' },
        { status: 503 }
      );
    }
    let clay = clayG / 10, sand = sandG / 10, silt = siltG / 10; // g/kg → %
    const ph = scaled(layer('phh2o'), 10);           // stored as pH × 10
    const organicCarbon = scaled(layer('soc'), 10);  // dg/kg → g/kg
    const bulkDensity = scaled(layer('bdod'), 100);  // cg/cm³ → kg/dm³
    const coarseFragments = scaled(layer('cfvo'), 10);
    const nitrogen = scaled(layer('nitrogen'), 100);
    const cationExchange = scaled(layer('cec'), 10);

    // Normalize percentages
    const total = clay + sand + silt;
    if (total > 0 && Math.abs(total - 100) > 5) {
      const factor = 100 / total;
      clay *= factor;
      sand *= factor;
      silt *= factor;
    }

    const soilType = classifySoilType(clay, sand, silt);
    const expansive = clay > 40 && soilType.includes('Clay');

    const result: SoilResponse = {
      success: true,
      data: {
        soilType,
        classification: `${soilType} (USDA texture class from SoilGrids)`,
        properties: {
          clay: Math.round(clay * 10) / 10,
          sand: Math.round(sand * 10) / 10,
          silt: Math.round(silt * 10) / 10,
          organicCarbon: round(organicCarbon, 2),
          ph: round(ph, 1),
          bulkDensity: round(bulkDensity, 2),
          coarseFragments: round(coarseFragments, 0),
          nitrogen: round(nitrogen, 3),
          cationExchange: round(cationExchange, 1),
        },
        bearingCapacity: null,
        waterTable: null,
        permeability: getPermeability(clay, sand),
        expansive,
        corrosivity: getCorrosivity(ph, clay),
        foundationRecommendation: getFoundationRecommendation(expansive),
        excavationDifficulty: getExcavationDifficulty(clay, sand, coarseFragments),
        source,
        depths: '30-60cm analysis depth',
        limitations: [
          'SoilGrids is a 250 m predicted map, not a test of this plot; local fill, rock and made ground are not seen.',
          'Bearing capacity and groundwater level are not given: they need a site investigation.',
          'Shrink-swell, permeability and corrosivity are indicative from texture and pH only.',
        ],
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
