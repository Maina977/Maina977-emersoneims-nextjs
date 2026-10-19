/**
 * Real site context from OpenStreetMap via the Overpass API (server-side).
 *
 * Replaces the /api/site/buildings and /api/site/obstacles stubs that answered
 * success:true with no data (2026-10-18 tool audit). Every building and tree
 * comes from OSM; where OSM has no height the value is a stated default and
 * `heightSource` says so. Nothing is invented: an unreachable Overpass server
 * is reported as an error, not papered over.
 */

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const R = 6371000;
const toRad = (d: number) => (d * Math.PI) / 180;

export interface OsmBuilding {
  id: number;
  heightM: number;
  heightSource: string;
  ring: { x: number; y: number }[];
  centerXY: { x: number; y: number };
  tags: { name?: string | null; building?: string };
}

export interface OsmObstacle {
  type: 'building' | 'tree';
  lat: number;
  lon: number;
  heightM: number;
  widthM: number;
  source: string;
}

export interface OsmSite {
  buildings: OsmBuilding[];
  obstacles: OsmObstacle[];
  count: number;
  provenance: { source: string; radiusMeters: number };
}

function parseHeight(tags: Record<string, string>, fallback: number, kind: 'building' | 'tree'): { h: number; src: string } {
  const h = parseFloat(String(tags.height ?? '').replace(/[^0-9.]/g, ''));
  if (Number.isFinite(h) && h > 0 && h < 400) return { h, src: 'OSM height tag' };
  if (kind === 'building') {
    const lv = parseFloat(String(tags['building:levels'] ?? ''));
    if (Number.isFinite(lv) && lv > 0 && lv < 150) return { h: Math.round(lv * 3 * 10) / 10, src: `OSM building:levels (${lv}) × 3 m` };
  }
  return { h: fallback, src: `default ${fallback} m (no height in OSM)` };
}

export async function fetchOsmSite(lat: number, lon: number, radiusMeters = 80): Promise<OsmSite> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) throw new Error('Invalid coordinates');
  const radius = Math.max(10, Math.min(300, Math.round(radiusMeters)));
  const q = `[out:json][timeout:20];(way["building"](around:${radius},${lat},${lon});node["natural"="tree"](around:${radius},${lat},${lon}););out geom tags;`;
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(q),
    signal: AbortSignal.timeout(15000),
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!res.ok) throw new Error(`OpenStreetMap (Overpass) HTTP ${res.status}`);
  const j = (await res.json()) as { elements?: Array<{ type: string; id: number; lat?: number; lon?: number; tags?: Record<string, string>; geometry?: { lat: number; lon: number }[] }> };

  const local = (pLat: number, pLon: number) => ({
    x: Math.round(toRad(pLon - lon) * R * Math.cos(toRad(lat)) * 100) / 100,
    y: Math.round(toRad(pLat - lat) * R * 100) / 100,
  });

  const buildings: OsmBuilding[] = [];
  const obstacles: OsmObstacle[] = [];
  for (const el of j.elements ?? []) {
    const tags = el.tags ?? {};
    if (el.type === 'way' && el.geometry && el.geometry.length >= 3) {
      const { h, src } = parseHeight(tags, 6, 'building');
      const ring = el.geometry.map((g) => local(g.lat, g.lon));
      const cLat = el.geometry.reduce((s, g) => s + g.lat, 0) / el.geometry.length;
      const cLon = el.geometry.reduce((s, g) => s + g.lon, 0) / el.geometry.length;
      const xs = ring.map((p) => p.x);
      const ys = ring.map((p) => p.y);
      const width = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
      buildings.push({ id: el.id, heightM: h, heightSource: src, ring, centerXY: local(cLat, cLon), tags: { name: tags.name ?? null, building: tags.building } });
      obstacles.push({ type: 'building', lat: cLat, lon: cLon, heightM: h, widthM: Math.round(width * 10) / 10 || 8, source: `OSM way ${el.id}; ${src}` });
    } else if (el.type === 'node' && el.lat !== undefined && el.lon !== undefined) {
      const { h, src } = parseHeight(tags, 8, 'tree');
      obstacles.push({ type: 'tree', lat: el.lat, lon: el.lon, heightM: h, widthM: 4, source: `OSM node ${el.id}; ${src}` });
    }
  }
  return {
    buildings,
    obstacles,
    count: buildings.length,
    provenance: { source: '© OpenStreetMap contributors (Overpass API)', radiusMeters: radius },
  };
}
