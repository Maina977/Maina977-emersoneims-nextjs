import 'server-only';
/**
 * Kenya soil lookup from the self-hosted, versioned SoilGrids 2.0 1 km extract
 * (data/aquascan/soil/<datasetId>/). No network call: the same coordinates and
 * dataset version always return the same values.
 *
 * Grid: ISRIC's native Interrupted Goode Homolosine 1 km grid, clipped to
 * Kenya, values unchanged (scripts/soil/extract_kenya_soilgrids.py). In
 * Kenya's latitudes the projection is the sinusoidal part of the northern
 * (central meridian 30°) or southern (20°) lobe; checked against GDAL to
 * within 0.06 m (tests/regression/aquascan-kenya-soil.test.ts).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { checkManifest, scaled, soilCitation, type SoilManifest, type SoilLayer } from '@/lib/aquascan-validation/soilManifest';

export const KENYA_SOIL_DATASET = 'kenya-soilgrids-2.0-1km-v1';
const R = 6378137; // WGS84 semi-major axis used by ISRIC's Homolosine grid
const DEG = Math.PI / 180;

interface KenyaManifest extends SoilManifest {
  grid: SoilManifest['grid'] & { origin: [number, number]; pixel: [number, number]; width: number; height: number };
  equivalenceProof?: { layer: string; fullFileSha256Verified: boolean; windowIdentical?: boolean } | null;
}

/** Interrupted Goode Homolosine forward projection, sinusoidal zone (|lat| < 40.73°). */
export function homolosineSinusoidal(lat: number, lon: number): { x: number; y: number } {
  if (!(Math.abs(lat) < 40.73)) throw new Error('Outside the sinusoidal zone of the Homolosine projection');
  // Lobe central meridians (ISRIC/PROJ igh): north −100°/30° split at −40°; south −160°/−60°/20°/140° split at −100°/−20°/80°.
  const lam0 = lat >= 0 ? (lon < -40 ? -100 : 30) : lon < -100 ? -160 : lon < -20 ? -60 : lon < 80 ? 20 : 140;
  return { x: R * lam0 * DEG + R * (lon - lam0) * DEG * Math.cos(lat * DEG), y: R * lat * DEG };
}

/** Verified grids are kept in memory (18 × ~2 MB): a lookup is then 18 array reads, no file I/O. */
let cache: { dir: string; manifest: KenyaManifest; verified: boolean; problems: string[]; grids: Map<string, Buffer> } | null = null;

/** Load and verify the dataset once: manifest checks and the SHA-256 of every grid file. */
export function loadKenyaSoil(root = path.join(process.cwd(), 'data', 'aquascan', 'soil')) {
  const dir = path.join(root, KENYA_SOIL_DATASET);
  if (cache && cache.dir === dir) return cache;
  const problems: string[] = [];
  let manifest: KenyaManifest;
  try { manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')); }
  catch { cache = { dir, manifest: null as unknown as KenyaManifest, verified: false, problems: ['Soil dataset manifest not found'], grids: new Map() }; return cache; }
  const chk = checkManifest(manifest);
  problems.push(...chk.errors);
  const grids = new Map<string, Buffer>();
  for (const l of manifest.layers ?? []) {
    try {
      const buf = fs.readFileSync(path.join(dir, l.file));
      if (buf.length !== l.bytes || crypto.createHash('sha256').update(buf).digest('hex') !== l.sha256) problems.push(`${l.file}: file does not match the manifest`);
      if (buf.length !== manifest.grid.width * manifest.grid.height * 2) problems.push(`${l.file}: size does not match the grid`);
      grids.set(l.file, buf);
    } catch { problems.push(`${l.file}: missing`); }
  }
  cache = { dir, manifest, verified: problems.length === 0, problems, grids: problems.length === 0 ? grids : new Map() };
  return cache;
}

export interface SoilPoint {
  /** PARTIAL: some properties are masked in this cell (e.g. urban areas mask texture); they are listed in `missing`. */
  status: 'OK' | 'PARTIAL' | 'INSUFFICIENT EVIDENCE';
  reason?: string;
  missing?: string[];
  /** Values by property and depth, in the unit given; null where the grid has no data. */
  values: Record<string, Record<string, number | null>>;
  units: Record<string, string>;
  /** Thickness-weighted 0–30 cm means (5/10/15 cm), in the same units; null if any depth is missing. */
  mean0to30: Record<string, number | null>;
  cell: { col: number; row: number; centreX: number; centreY: number };
  dataset: { id: string; version: string; resolutionM: number; crs: string; retrievedOn: string };
  citation: string;
  note: string;
}

const DEPTHS: Array<[string, number]> = [['0-5cm', 5], ['5-15cm', 10], ['15-30cm', 15]];

export function soilAt(lat: number, lon: number, root?: string): SoilPoint {
  const ds = loadKenyaSoil(root);
  const empty = (reason: string): SoilPoint => ({
    status: 'INSUFFICIENT EVIDENCE', reason, values: {}, units: {}, mean0to30: {},
    cell: { col: -1, row: -1, centreX: NaN, centreY: NaN },
    dataset: ds.manifest ? { id: ds.manifest.datasetId, version: ds.manifest.version, resolutionM: ds.manifest.grid.resolutionM, crs: ds.manifest.grid.crs, retrievedOn: ds.manifest.source.retrievedOn } : { id: KENYA_SOIL_DATASET, version: '?', resolutionM: 1000, crs: '?', retrievedOn: '?' },
    citation: ds.manifest ? soilCitation(ds.manifest) : '', note: '',
  });
  if (!ds.verified) return empty(`Soil dataset failed verification: ${ds.problems.slice(0, 3).join('; ')}`);
  if (!(Number.isFinite(lat) && Number.isFinite(lon))) return empty('Coordinates are not numbers');
  const [lon0, lat0, lon1, lat1] = ds.manifest.grid.bbox;
  if (lat < lat0 || lat > lat1 || lon < lon0 || lon > lon1) return empty('Outside the Kenya soil dataset (no soil data is fetched from the internet)');
  const g = ds.manifest.grid;
  const { x, y } = homolosineSinusoidal(lat, lon);
  const col = Math.floor((x - g.origin[0]) / g.pixel[0]);
  const row = Math.floor((y - g.origin[1]) / g.pixel[1]);
  if (col < 0 || row < 0 || col >= g.width || row >= g.height) return empty('Outside the Kenya soil grid');
  const values: SoilPoint['values'] = {}, units: SoilPoint['units'] = {};
  const read = (l: SoilLayer): number | null => scaled(l, ds.grids.get(l.file)!.readInt16LE((row * g.width + col) * 2));
  for (const l of ds.manifest.layers) {
    (values[l.property] ??= {})[l.depth] = read(l);
    units[l.property] = l.unit;
  }
  const mean0to30: SoilPoint['mean0to30'] = {};
  for (const p of Object.keys(values)) {
    const vs = DEPTHS.map(([d, t]) => [values[p][d], t] as const);
    mean0to30[p] = vs.every(([v]) => v !== null) ? Math.round((vs.reduce((s, [v, t]) => s + (v as number) * t, 0) / 30) * 100) / 100 : null;
  }
  const out: SoilPoint = {
    ...empty(''), status: 'OK', reason: undefined, values, units, mean0to30,
    cell: { col, row, centreX: g.origin[0] + (col + 0.5) * g.pixel[0], centreY: g.origin[1] + (row + 0.5) * g.pixel[1] },
    note: '1 km aggregate of SoilGrids 250 m model predictions: regional context only, not a site measurement. Confirm by drilling or a site soil test.',
  };
  if (Object.values(mean0to30).every((v) => v === null)) return { ...out, status: 'INSUFFICIENT EVIDENCE', reason: 'No soil mapped in this cell (water body, rock or urban mask)' };
  const missing = Object.entries(mean0to30).filter(([, v]) => v === null).map(([p]) => p);
  if (missing.length) return { ...out, status: 'PARTIAL', missing, reason: `Not mapped in this cell: ${missing.join(', ')} (SoilGrids masks some properties, e.g. in built-up areas)` };
  return out;
}
