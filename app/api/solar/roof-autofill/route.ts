import { NextRequest, NextResponse } from 'next/server';
import { overpassQuery, OSM_ATTRIBUTION } from '@/lib/data-sources/overpass';

// Building footprints near a coordinate from OSM Overpass. No footprint, or no
// answer, gives roofAreaM2 null (2026-11-14: a default 120 m² "typical Kenyan
// residential" roof, or 80 m² for an unmeasurable footprint, was returned instead).
const notFound = (assumedPitchDegrees: number, note: string, status: 'NO MATCH FOUND' | 'SERVICE UNAVAILABLE' | 'INSUFFICIENT EVIDENCE' = 'NO MATCH FOUND') => ({
  status,
  found: false,
  roofAreaM2: null,
  usableRoofM2: null,
  pitchDegrees: assumedPitchDegrees,
  roofType: 'unknown',
  source: 'none',
  note,
});

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

    const data = await overpassQuery(query, { timeoutMs: 12000 });
    if (!data) {
      return NextResponse.json(notFound(assumedPitchDegrees, 'SERVICE UNAVAILABLE: OpenStreetMap did not answer. Measure or draw the roof.', 'SERVICE UNAVAILABLE'));
    }
    const elements: any[] = data.elements;

    if (elements.length === 0) {
      return NextResponse.json(notFound(assumedPitchDegrees, `No building footprint is mapped within ${searchRadiusM} m: measure or draw the roof.`));
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

    if (!(bestArea > 0)) {
      return NextResponse.json(notFound(assumedPitchDegrees, 'A building is mapped here but without a usable outline: measure or draw the roof.', 'INSUFFICIENT EVIDENCE'));
    }
    const roofAreaM2 = Math.round(bestArea);
    const usableRoofM2 = Math.round(roofAreaM2 * 0.7); // planning assumption: 70 % usable after setbacks

    const tags = bestElement.tags ?? {};
    const roofType: string =
      tags['roof:shape'] ?? tags['building:roof'] ?? 'unknown';

    return NextResponse.json({
      status: 'OK',
      found: true,
      roofAreaM2,
      usableRoofM2,
      pitchDegrees: assumedPitchDegrees,
      roofType,
      levels: tags['building:levels'] ? parseInt(tags['building:levels']) : null,
      osmId: bestElement.id,
      osmType: bestElement.type,
      source: 'osm',
      attribution: OSM_ATTRIBUTION,
      usableNote: 'Usable area assumes 70 % of the footprint after edge setbacks; confirm on site.',
    });
  } catch (err) {
    console.error('[solar/roof-autofill]', err);
    return NextResponse.json(notFound(15, err instanceof Error ? err.message : 'Roof lookup failed: measure or draw the roof.', 'SERVICE UNAVAILABLE'));
  }
}
