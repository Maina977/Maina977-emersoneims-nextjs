/**
 * Versioned soil dataset manifest (P0-C follow-up, 2026-11-14).
 *
 * AquaScan may read soil values only from a frozen, self-hosted extract
 * described by a manifest: the source and its licence terms, the exact
 * files (SHA-256), grid, scaling and the layers present. A lookup records the
 * manifest version with every result, so the same inputs always give the same
 * soil answer. Without a valid manifest the tool reports INSUFFICIENT EVIDENCE.
 */

export interface SoilLayer {
  property: string; // e.g. clay, sand, silt, bdod, soc, phh2o
  depth: string; // e.g. 0-5cm
  statistic: 'mean' | 'Q0.05' | 'Q0.5' | 'Q0.95' | 'uncertainty';
  file: string; // path relative to the dataset root
  sha256: string;
  bytes: number;
  /** Stored integer ÷ divisor = value in `unit` (SoilGrids uses integer scaling). */
  divisor: number;
  unit: string;
  noData: number;
}
export interface SoilManifest {
  datasetId: string; // e.g. kenya-soilgrids-2.0-1km-v1
  version: string;
  source: { name: string; publisher: string; release: string; url: string; retrievedOn: string };
  licence: { id: 'CC-BY-4.0'; url: string; attribution: string; changesMade: string };
  grid: { crs: string; resolutionM: number; bbox: [number, number, number, number]; note: string };
  layers: SoilLayer[];
  createdBy: string; createdOn: string;
}

/** Layers AquaScan's soil summary needs: texture, bulk density, organic carbon and pH at the top three depths. */
export const REQUIRED_LAYERS = ['clay', 'sand', 'silt', 'bdod', 'soc', 'phh2o'].flatMap((p) => ['0-5cm', '5-15cm', '15-30cm'].map((d) => `${p}|${d}|mean`));

export function checkManifest(m: SoilManifest): { ok: boolean; errors: string[] } {
  const e: string[] = [];
  if (!/^[a-z0-9.-]+$/.test(m.datasetId || '')) e.push('datasetId: lower-case letters, digits, dots and hyphens only');
  if (!m.version) e.push('version required');
  for (const k of ['name', 'publisher', 'release', 'url', 'retrievedOn'] as const) if (!m.source?.[k]) e.push(`source.${k} required`);
  if (m.source?.retrievedOn && Number.isNaN(Date.parse(m.source.retrievedOn))) e.push('source.retrievedOn must be a date');
  // CC BY 4.0: attribution, a link to the licence and an indication of changes are required.
  if (m.licence?.id !== 'CC-BY-4.0') e.push('licence.id must be CC-BY-4.0 (SoilGrids licence since 2019); other sources need a separate review');
  if (!/creativecommons\.org\/licenses\/by\/4\.0/.test(m.licence?.url || '')) e.push('licence.url must link to the CC BY 4.0 licence');
  if (!m.licence?.attribution || !/ISRIC/.test(m.licence.attribution)) e.push('licence.attribution must credit ISRIC – World Soil Information (CC BY 4.0 requires attribution)');
  if (!m.licence?.changesMade) e.push('licence.changesMade required (CC BY 4.0: indicate if changes were made, e.g. clipped to Kenya, resampled)');
  if (!m.grid?.crs) e.push('grid.crs required');
  if (!(m.grid?.resolutionM > 0)) e.push('grid.resolutionM required');
  const seen = new Set<string>();
  for (const [i, l] of (m.layers || []).entries()) {
    const key = `${l.property}|${l.depth}|${l.statistic}`;
    if (seen.has(key)) e.push(`layers[${i}]: duplicate ${key}`);
    seen.add(key);
    if (!/^[0-9a-f]{64}$/.test(l.sha256 || '')) e.push(`layers[${i}] ${key}: sha256 must be 64 hex characters`);
    if (!(l.divisor > 0)) e.push(`layers[${i}] ${key}: divisor required (integer scaling)`);
    if (!l.unit) e.push(`layers[${i}] ${key}: unit required`);
    if (!l.file || l.file.includes('..') || l.file.startsWith('/')) e.push(`layers[${i}] ${key}: file must be a relative path inside the dataset`);
    if (!(l.bytes > 0)) e.push(`layers[${i}] ${key}: bytes required`);
  }
  for (const r of REQUIRED_LAYERS) if (!seen.has(r)) e.push(`missing required layer ${r.replace(/\|/g, ' ')}`);
  return { ok: e.length === 0, errors: e };
}

/** Verify downloaded files against the manifest before use. */
export async function verifyFiles(m: SoilManifest, read: (file: string) => Promise<Uint8Array>): Promise<{ ok: boolean; mismatched: string[] }> {
  const mismatched: string[] = [];
  for (const l of m.layers) {
    const bytes = await read(l.file);
    const d = new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', new Uint8Array(bytes)));
    const hex = [...d].map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hex !== l.sha256 || bytes.length !== l.bytes) mismatched.push(l.file);
  }
  return { ok: mismatched.length === 0, mismatched };
}

/** Convert a stored integer to a value with its unit, or null for no-data. */
export function scaled(layer: SoilLayer, raw: number): number | null {
  if (raw === layer.noData || !Number.isFinite(raw)) return null;
  return raw / layer.divisor;
}

/** The text every soil result must carry. */
export function soilCitation(m: SoilManifest): string {
  return `${m.licence.attribution} Licensed under CC BY 4.0 (${m.licence.url}). ${m.licence.changesMade} Dataset ${m.datasetId} version ${m.version}, retrieved ${m.source.retrievedOn}.`;
}
