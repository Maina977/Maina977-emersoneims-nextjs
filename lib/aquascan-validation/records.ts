/**
 * AquaScan historical borehole validation: records, checks and the frozen
 * spatial split (P1-C, 2026-11-14). Offline and deterministic.
 */

export const VALIDATION_FRAMEWORK_VERSION = 'aquascan-validation 1.0.0 (2026-11-14)';

export type Setting = 'basement' | 'volcanic' | 'sedimentary' | 'alluvial' | 'unknown';
export type Outcome = 'productive' | 'low-yield' | 'dry';

export interface BoreholeRecord {
  id: string;
  lat: number; lon: number;
  positionSource: 'gps' | 'address' | 'map';
  elevationM?: number;
  drilledOn: string; // ISO date
  county: string;
  setting: Setting;
  drilledDepthM: number;
  staticWaterLevelM?: number;
  waterStrikesM?: number[];
  testedYieldM3h: number | null; // null when not tested; 0 when dry
  pumpTest?: { rateM3h: number; durationH: number; drawdownM: number; recoveryPct?: number };
  outcome: Outcome;
  /** The yield threshold (m³/h) used for "productive" in the source. */
  productiveThresholdM3h: number;
  quality?: { ecUsCm?: number; fluorideMgL?: number; ironMgL?: number; nitrateMgL?: number };
  contractor?: string;
  sourceDocument: string;
  verification: 'verified' | 'unverified';
  licence: string;
}

export interface RecordIssue { id: string; level: 'reject' | 'flag'; message: string }

/** Kenya bounding box (approximate national extent). Inside it is necessary, not sufficient. */
export const KENYA_BBOX = { latMin: -4.72, latMax: 5.03, lonMin: 33.9, lonMax: 41.91 };

export function distanceM(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371008.8; // mean Earth radius, m
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Rejects records that cannot be used; flags those usable with care. Duplicates: < 50 m apart and the same depth and date. */
export function checkRecords(records: BoreholeRecord[]): { accepted: BoreholeRecord[]; issues: RecordIssue[] } {
  const issues: RecordIssue[] = [];
  const accepted: BoreholeRecord[] = [];
  const seen = new Set<string>();
  for (const r of records) {
    const rej = (m: string) => issues.push({ id: r.id, level: 'reject', message: m });
    const flag = (m: string) => issues.push({ id: r.id, level: 'flag', message: m });
    const before = issues.filter((i) => i.level === 'reject').length;
    if (!r.id || seen.has(r.id)) rej('Missing or repeated ID');
    seen.add(r.id);
    if (!(Number.isFinite(r.lat) && Number.isFinite(r.lon))) rej('Coordinates missing');
    else if (r.lat < KENYA_BBOX.latMin || r.lat > KENYA_BBOX.latMax || r.lon < KENYA_BBOX.lonMin || r.lon > KENYA_BBOX.lonMax) rej('Coordinates outside Kenya (check for swapped latitude/longitude or a missing minus sign)');
    if (!(r.drilledDepthM > 0 && r.drilledDepthM <= 1500)) rej(`Drilled depth ${r.drilledDepthM} m is not plausible (0–1500 m); check the units (feet?)`);
    if (r.testedYieldM3h !== null && !(r.testedYieldM3h >= 0 && r.testedYieldM3h <= 500)) rej(`Tested yield ${r.testedYieldM3h} m³/h is not plausible; check the units (m³/day or L/s?)`);
    if (r.staticWaterLevelM !== undefined && r.staticWaterLevelM > r.drilledDepthM) rej('Static water level deeper than the borehole');
    if (r.waterStrikesM?.some((s) => s > r.drilledDepthM || s < 0)) rej('A water strike lies outside the drilled depth');
    if (r.outcome === 'dry' && r.testedYieldM3h !== null && r.testedYieldM3h > 0) rej('Outcome "dry" with a positive tested yield');
    if (r.outcome === 'productive' && r.testedYieldM3h !== null && r.testedYieldM3h < r.productiveThresholdM3h) rej('Outcome "productive" below its own threshold');
    if (!(r.productiveThresholdM3h > 0)) rej('The productive-yield threshold used is required');
    if (!r.sourceDocument) rej('Source document required');
    if (!r.licence) rej('Licence or consent to use required');
    if (Number.isNaN(Date.parse(r.drilledOn))) rej('Drilling date not a valid date');
    if (r.positionSource !== 'gps') flag('Position not from GPS: location error may exceed a model cell');
    if (r.verification !== 'verified') flag('Record not verified against the source');
    if (r.setting === 'unknown') flag('Geological setting unknown: excluded from per-setting metrics');
    if (r.testedYieldM3h === null) flag('No pumping test: yield metrics skip this record');
    if (issues.filter((i) => i.level === 'reject').length === before) accepted.push(r);
  }
  // Duplicates among accepted records: keep the first.
  const out: BoreholeRecord[] = [];
  for (const r of accepted) {
    const dup = out.find((o) => distanceM(o, r) < 50 && Math.abs(o.drilledDepthM - r.drilledDepthM) < 0.5 && o.drilledOn === r.drilledOn);
    if (dup) issues.push({ id: r.id, level: 'reject', message: `Duplicate of ${dup.id} (under 50 m apart, same depth and date)` });
    else out.push(r);
  }
  return { accepted: out, issues };
}

/** FNV-1a 32-bit: stable across platforms. */
export function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

/** 10 km block (approximate equal-distance grid) that a point falls in. */
export function blockId(lat: number, lon: number, blockKm = 10): string {
  const yKm = lat * 110.574;
  const xKm = lon * 111.32 * Math.cos((lat * Math.PI) / 180);
  return `${Math.floor(xKm / blockKm)}:${Math.floor(yKm / blockKm)}`;
}

export interface SplitManifest {
  version: string;
  seed: string;
  blockKm: number;
  testFraction: number;
  testIds: string[];
  trainIds: string[];
  /** Hash of the sorted IDs in each part, to prove the split was not changed. */
  fingerprint: string;
  frozenOn: string;
}

/**
 * Spatial split: whole 10 km blocks go to train or test, so no test borehole
 * has a training neighbour in the same block. Deterministic for a given seed.
 */
export function spatialSplit(records: BoreholeRecord[], opts: { seed: string; testFraction: number; blockKm?: number; frozenOn: string }): SplitManifest {
  const blockKm = opts.blockKm ?? 10;
  const testIds: string[] = [], trainIds: string[] = [];
  for (const r of records) {
    const u = fnv1a(`${opts.seed}|${blockId(r.lat, r.lon, blockKm)}`) / 0x100000000;
    (u < opts.testFraction ? testIds : trainIds).push(r.id);
  }
  testIds.sort(); trainIds.sort();
  return { version: VALIDATION_FRAMEWORK_VERSION, seed: opts.seed, blockKm, testFraction: opts.testFraction, testIds, trainIds, fingerprint: fingerprint(testIds, trainIds), frozenOn: opts.frozenOn };
}

export function fingerprint(testIds: string[], trainIds: string[]): string {
  return fnv1a(`test:${[...testIds].sort().join(',')}|train:${[...trainIds].sort().join(',')}`).toString(16).padStart(8, '0');
}

/** A frozen split is used only if its fingerprint still matches its lists. */
export function verifyManifest(m: SplitManifest): boolean {
  if (m.testIds.some((id) => m.trainIds.includes(id))) return false;
  return fingerprint(m.testIds, m.trainIds) === m.fingerprint;
}
