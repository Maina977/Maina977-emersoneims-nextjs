/**
 * Offline Kenya point-feature index (P1, 2026-11-20).
 *
 * Built by scripts/osm/build_kenya_points.py from the Geofabrik Kenya extract
 * (ODbL 1.0). It stands in for the public Overpass servers, which timed out
 * for six days, for point features inside Kenya: water points, taps, power
 * poles, manholes and amenities. The data are only what mappers recorded.
 *
 * Returns null when the index is missing or fails its checksum, so callers
 * fall back to Overpass. An empty result means NO MATCH FOUND within the
 * radius, and says nothing about whether features exist on the ground.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

export type PointKind = 'water_well' | 'borehole' | 'hand_pump' | 'powered_pump' | 'water_tap' | 'power_pole' | 'manhole' | 'hospital' | 'school' | 'shop' | 'police' | 'bus_stop';
export type Row = [number, number, PointKind, string | null, Record<string, string> | null];
export interface Manifest { dataset: string; sourceMd5: string; sourceLastModified: string; builtOn: string; points: number; outputSha256: string; attribution: string; licence: string }
export interface Found { lat: number; lon: number; kind: PointKind; name: string | null; extra: Record<string, string> | null; distanceM: number }

const CELL = 0.05; // degrees (~5.5 km)
const KENYA = { minLat: -4.9, maxLat: 5.1, minLon: 33.8, maxLon: 42.0 };
let loaded: { manifest: Manifest; grid: Map<string, Row[]> } | null | undefined;

export function insideKenyaBox(lat: number, lon: number) {
  return lat >= KENYA.minLat && lat <= KENYA.maxLat && lon >= KENYA.minLon && lon <= KENYA.maxLon;
}

export function loadKenyaPoints(dir = path.join(process.cwd(), 'data', 'osm', 'kenya-points-v1')) {
  if (loaded !== undefined) return loaded;
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')) as Manifest;
    const gz = fs.readFileSync(path.join(dir, 'points.json.gz'));
    if (crypto.createHash('sha256').update(gz).digest('hex') !== manifest.outputSha256) throw new Error('checksum mismatch');
    const rows = JSON.parse(zlib.gunzipSync(gz).toString('utf8')) as Row[];
    const grid = new Map<string, Row[]>();
    for (const r of rows) {
      const k = `${Math.floor(r[0] / CELL)},${Math.floor(r[1] / CELL)}`;
      (grid.get(k) ?? grid.set(k, []).get(k)!).push(r);
    }
    loaded = { manifest, grid };
  } catch {
    loaded = null;
  }
  return loaded;
}
export function _resetKenyaPoints() { loaded = undefined; }

const toRad = (d: number) => (d * Math.PI) / 180;
export function haversineM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Points of the given kinds within radiusM, nearest first; null = index unavailable or outside Kenya. */
export function pointsNear(lat: number, lon: number, radiusM: number, kinds: PointKind[], idx = loadKenyaPoints()): { found: Found[]; manifest: Manifest } | null {
  if (!idx || !insideKenyaBox(lat, lon)) return null;
  const want = new Set(kinds);
  const dLat = radiusM / 111320, dLon = radiusM / (111320 * Math.max(0.2, Math.cos(toRad(lat))));
  const out: Found[] = [];
  for (let i = Math.floor((lat - dLat) / CELL); i <= Math.floor((lat + dLat) / CELL); i++) {
    for (let j = Math.floor((lon - dLon) / CELL); j <= Math.floor((lon + dLon) / CELL); j++) {
      for (const r of idx.grid.get(`${i},${j}`) ?? []) {
        if (!want.has(r[2])) continue;
        const d = haversineM(lat, lon, r[0], r[1]);
        if (d <= radiusM) out.push({ lat: r[0], lon: r[1], kind: r[2], name: r[3], extra: r[4], distanceM: Math.round(d) });
      }
    }
  }
  out.sort((a, b) => a.distanceM - b.distanceM);
  return { found: out, manifest: idx.manifest };
}
