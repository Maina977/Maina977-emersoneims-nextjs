import { NextRequest, NextResponse } from 'next/server';

// OSM Overpass API: query building footprints near a coordinate
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

function computePolygonAreaM2(coords: [number, number][]): number {
  // Shoelace formula on (lon, lat) approximated to metres via cos-corrected degrees
  if (coords.length < 3) return 0;
  const R = 6371000; // Earth radius metres
  const latRad = (coords.reduce((s, c) => s + c[1], 0) / coords.length) * (Math.PI / 180);
  const mPerLat = (Math.PI / 180) * R;
  const mPerLon = mPerLat * Math.cos(latRad);

  let area = 0;
  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const xi = coords[i][0] * mPerLon;
    const yi = coords[i][1] * mPerLat;
    const xj = coords[j][0] * mPerLon;
    const yj = coords[j][1] * mPerLat;
    area += xi * yj - xj * yi;
  }
  return Math.abs(area / 2);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lon, searchRadiusM = 50, assumedPitchDegrees = 15 } = body;

    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return NextResponse.json({ error: 'lat and lon must be numbers' }, { status: 400 });
    }

    const query = `
[out:json][timeout:15];
(
  way["building"](around:${searchRadiusM},${lat},${lon});
  relation["building"](around:${searchRadiusM},${lat},${lon});
);
out geom;
`;

    const res = await fetch(OVERPASS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);

    const data = await res.json();
    const elements: any[] = data.elements ?? [];

    if (elements.length === 0) {
      // Fallback: return a reasonable default for a typical Kenyan residential building
      const defaultAreaM2 = 120;
      return NextResponse.json({
        found: false,
        roofAreaM2: defaultAreaM2,
        usableRoofM2: Math.round(defaultAreaM2 * 0.7),
        pitchDegrees: assumedPitchDegrees,
        roofType: 'unknown',
        source: 'default',
      });
    }

    // Take the closest / largest building
    let bestElement = elements[0];
    let bestArea = 0;

    for (const el of elements) {
      if (el.geometry && Array.isArray(el.geometry)) {
        const coords: [number, number][] = el.geometry.map((g: any) => [g.lon, g.lat]);
        const area = computePolygonAreaM2(coords);
        if (area > bestArea) {
          bestArea = area;
          bestElement = el;
        }
      }
    }

    const roofAreaM2 = bestArea > 0 ? Math.round(bestArea) : 80;
    const usableRoofM2 = Math.round(roofAreaM2 * 0.7); // 70% usable after setbacks

    const tags = bestElement.tags ?? {};
    const roofType: string =
      tags['roof:shape'] ?? tags['building:roof'] ?? 'unknown';

    return NextResponse.json({
      found: true,
      roofAreaM2,
      usableRoofM2,
      pitchDegrees: assumedPitchDegrees,
      roofType,
      levels: tags['building:levels'] ? parseInt(tags['building:levels']) : null,
      osmId: bestElement.id,
      osmType: bestElement.type,
      source: 'osm',
    });
  } catch (err) {
    console.error('[solar/roof-autofill]', err);
    // Graceful degradation: never fail hard; return safe defaults so calculator can proceed
    const defaultAreaM2 = 120;
    return NextResponse.json({
      found: false,
      roofAreaM2: defaultAreaM2,
      usableRoofM2: Math.round(defaultAreaM2 * 0.7),
      pitchDegrees: 15,
      roofType: 'unknown',
      source: 'default',
      note: err instanceof Error ? err.message : 'Overpass unavailable',
    });
  }
}
