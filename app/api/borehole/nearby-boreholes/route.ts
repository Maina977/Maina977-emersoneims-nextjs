/**
 * Nearby water points API: OpenStreetMap only.
 *
 * 2026-11-14 the route returned invented boreholes, and they were removed. When
 * fewer than `limit` real points were found it made up "Borehole A, B, C…":
 * coordinates on a ring around the site, plus depth, yield, year, status and
 * water quality varied by sine/cosine around an unsourced county table labelled
 * "real data from WRA reports". It then recommended a drilling depth "based on
 * N nearby boreholes".
 *
 * Now:
 * - Only mapped OSM water points are returned, with only the values their tags
 *   state. A missing tag is null.
 * - Statistics are computed from those values or are null.
 * - A failed lookup is INSUFFICIENT EVIDENCE, not "none nearby".
 * - No drilling depth is recommended from map points.
 */

import { NextRequest, NextResponse } from 'next/server';
import { overpassQuery, OSM_ATTRIBUTION } from '@/lib/data-sources/overpass';

interface NearbyBoreholesRequest {
  latitude: number;
  longitude: number;
  radius?: number;  // km, default 10
  limit?: number;   // max results, default 20
}

interface BoreholeRecord {
  id: string;
  name: string | null;
  kind: string;           // OSM feature type (water_well, borehole, hand pump…)
  distance: number;       // km from query point
  coordinates: { latitude: number; longitude: number };
  depth: number | null;   // m, from the OSM depth tag only
  yield: number | null;   // m³/h, from pump:output only
  staticWaterLevel: number | null;
  year: number | null;
  status: 'active' | 'unknown';
  waterQuality: 'unknown';
  source: string;
}

interface NearbyBoreholesResponse {
  success: boolean;
  data?: {
    location: { latitude: number; longitude: number };
    searchRadius: number;
    totalFound: number;
    boreholes: BoreholeRecord[];
    statistics: {
      pointsWithDepth: number;
      pointsWithYield: number;
      averageDepth: number | null;
      averageYield: number | null;
      successRate: null;    // OSM does not record dry holes
      commonDepthRange: { min: number; max: number } | null;
      commonYieldRange: { min: number; max: number } | null;
    };
    recommendations: string[];
    limitations: string[];
    dataSources: string[];
  };
  error?: string;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** A positive number from an OSM tag ("45", "45 m", "3.5"), else null. */
function tagNumber(v: unknown): number | null {
  if (typeof v !== 'string') return null;
  const m = v.trim().match(/^(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function kindOf(tags: Record<string, string>): string {
  if (tags.man_made === 'water_well') return 'water well';
  if (tags.waterway === 'borehole') return 'borehole';
  if (tags.pump === 'manual') return 'hand pump';
  if (tags.pump === 'powered') return 'powered pump';
  return 'water point';
}

export async function POST(request: NextRequest) {
  try {
    const body: NearbyBoreholesRequest = await request.json();
    const { latitude, longitude } = body;
    const radius = Math.max(0.5, Math.min(25, Number(body.radius ?? 10)));
    const limit = Math.max(1, Math.min(100, Math.round(Number(body.limit ?? 20))));

    if (typeof latitude !== 'number' || typeof longitude !== 'number' || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
    }

    const r = radius * 1000;
    const query = `[out:json][timeout:25];(
      node["man_made"="water_well"](around:${r},${latitude},${longitude});
      node["waterway"="borehole"](around:${r},${latitude},${longitude});
      node["pump"="manual"](around:${r},${latitude},${longitude});
      node["pump"="powered"](around:${r},${latitude},${longitude});
    );out body;`;
    const osm = await overpassQuery<{ id: number; lat: number; lon: number; tags?: Record<string, string> }>(query, { timeoutMs: 15000 });
    if (!osm) {
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT EVIDENCE: the OpenStreetMap water-point lookup did not answer, so no nearby boreholes can be listed.' },
        { status: 503 }
      );
    }

    const boreholes: BoreholeRecord[] = osm.elements
      .filter((p) => typeof p.lat === 'number' && typeof p.lon === 'number')
      .map((p) => {
        const tags = p.tags ?? {};
        const year = tags.start_date?.match(/^(\d{4})/)?.[1];
        return {
          id: `OSM-node-${p.id}`,
          name: tags.name ?? null,
          kind: kindOf(tags),
          distance: Math.round(calculateDistance(latitude, longitude, p.lat, p.lon) * 100) / 100,
          coordinates: { latitude: p.lat, longitude: p.lon },
          depth: tagNumber(tags.depth),
          yield: tagNumber(tags['pump:output']),
          staticWaterLevel: tagNumber(tags.water_level),
          year: year ? parseInt(year, 10) : null,
          status: tags.operational_status === 'operational' || tags.operational === 'yes' ? 'active' as const : 'unknown' as const,
          waterQuality: 'unknown' as const,
          source: `OpenStreetMap (${OSM_ATTRIBUTION})`,
        };
      })
      .filter((b) => b.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    const depths = boreholes.map((b) => b.depth).filter((v): v is number => v !== null);
    const yields = boreholes.map((b) => b.yield).filter((v): v is number => v !== null);
    const mean = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);

    const recommendations: string[] = [];
    if (boreholes.length === 0) {
      recommendations.push(`No water points are mapped in OpenStreetMap within ${radius} km. That does not mean there are none: ask the Water Resources Authority (WRA) for borehole completion records in the area.`);
    } else {
      recommendations.push(`${boreholes.length} mapped water point(s) within ${radius} km; ${depths.length} state a depth and ${yields.length} a yield.`);
    }
    recommendations.push('Drilling depth and expected yield need WRA completion records and a hydrogeological survey; they are not set from map points.');

    const result: NearbyBoreholesResponse = {
      success: true,
      data: {
        location: { latitude, longitude },
        searchRadius: radius,
        totalFound: boreholes.length,
        boreholes,
        statistics: {
          pointsWithDepth: depths.length,
          pointsWithYield: yields.length,
          averageDepth: mean(depths),
          averageYield: mean(yields),
          successRate: null,
          commonDepthRange: depths.length ? { min: Math.min(...depths), max: Math.max(...depths) } : null,
          commonYieldRange: yields.length ? { min: Math.min(...yields), max: Math.max(...yields) } : null,
        },
        recommendations,
        limitations: [
          'OpenStreetMap holds only the water points volunteers have mapped; most Kenyan boreholes are not in it.',
          'Depth and yield appear only where a mapper recorded them, and are not verified.',
          'Dry or failed boreholes are not recorded, so no success rate is given.',
        ],
        dataSources: [`OpenStreetMap Overpass (${OSM_ATTRIBUTION})`],
      },
    };
    return NextResponse.json(result);
  } catch (error) {
    console.error('[Boreholes] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const radius = searchParams.get('radius');

  if (!lat || !lon) {
    return NextResponse.json(
      { success: false, error: 'Missing lat and lon parameters' },
      { status: 400 }
    );
  }

  const mockRequest = new Request(request.url, {
    method: 'POST',
    body: JSON.stringify({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      radius: radius ? parseFloat(radius) : 10,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  return POST(mockRequest as NextRequest);
}
