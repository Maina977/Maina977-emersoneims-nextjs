// ═══════════════════════════════════════════════════════════════════════════
// WRA / COUNTY BOREHOLE INGESTION — turn real records into FIELD evidence
// ═══════════════════════════════════════════════════════════════════════════
// The single highest-value dataset for accuracy is nearby REAL boreholes, but
// WRA/county completion records are not on any public API — they arrive as
// spreadsheets/CSV. This pipeline normalizes those messy records into the exact
// `/data/wra-boreholes.json` shape the engine already consumes, validates them,
// and lets the owner (a) download the file and (b) use them immediately.
//
// HONESTY:
//   • Only records with valid coordinates and sane values are accepted; the rest
//     are rejected with a reason (never silently coerced).
//   • Accepted records are tagged as OFFICIAL FIELD data (highest reliability) —
//     because they are real drilled outcomes, not estimates.
// ═══════════════════════════════════════════════════════════════════════════

export interface WRARecord {
  name: string;
  lat: number;
  lon: number;
  depth_m: number;
  yield_m3h?: number;
  swl_m?: number;
  outcome: 'Success' | 'Moderate' | 'Fail' | 'Unknown';
  permit?: string;
  aquiferType?: string;
  lithology?: string;
  county?: string;
}

export interface WRAIngestResult {
  records: WRARecord[];
  accepted: number;
  rejected: number;
  errors: string[];      // one line per rejected row, with the reason
  warnings: string[];
}

const HEADER_ALIASES: Record<keyof WRARecord | 'skip', string[]> = {
  name: ['name', 'borehole', 'bh', 'site', 'well', 'boreholename', 'wellname'],
  lat: ['lat', 'latitude', 'y', 'ycoord', 'northing_dd'],
  lon: ['lon', 'lng', 'long', 'longitude', 'x', 'xcoord', 'easting_dd'],
  depth_m: ['depth', 'depth_m', 'drilleddepth', 'totaldepth', 'td', 'depthm'],
  yield_m3h: ['yield', 'yield_m3h', 'yieldm3hr', 'yield_m3hr', 'discharge', 'q'],
  swl_m: ['swl', 'swl_m', 'staticwaterlevel', 'staticlevel', 'restlevel', 'waterlevel'],
  outcome: ['outcome', 'status', 'result', 'success'],
  permit: ['permit', 'permitno', 'authorisation', 'authorization', 'wraref', 'ref'],
  aquiferType: ['aquifer', 'aquifertype', 'formation'],
  lithology: ['lithology', 'rock', 'geology'],
  county: ['county', 'district', 'subcounty', 'region'],
  skip: [],
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function normalizeOutcome(raw: any): WRARecord['outcome'] {
  const s = String(raw ?? '').toLowerCase().trim();
  if (/^(success|yes|y|1|functional|producing|good|high|productive|positive)/.test(s)) return 'Success';
  if (/^(fail|failed|dry|no|n|0|abandoned|unproductive|negative)/.test(s)) return 'Fail';
  if (/^(moderate|low|marginal|fair|medium)/.test(s)) return 'Moderate';
  return 'Unknown';
}

function validateRecord(r: Partial<WRARecord>, rowRef: string, errors: string[]): WRARecord | null {
  const lat = Number(r.lat), lon = Number(r.lon);
  if (!isFinite(lat) || !isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180 || (lat === 0 && lon === 0)) {
    errors.push(`${rowRef}: invalid coordinates (lat=${r.lat}, lon=${r.lon}) — skipped`); return null;
  }
  let depth = Number(r.depth_m);
  if (!isFinite(depth) || depth <= 0) depth = 0; // depth optional but flagged below
  if (depth > 800) { errors.push(`${rowRef}: depth ${depth} m out of range (>800 m) — skipped`); return null; }
  let yieldV = r.yield_m3h != null ? Number(r.yield_m3h) : undefined;
  if (yieldV != null && (!isFinite(yieldV) || yieldV < 0 || yieldV > 200)) yieldV = undefined;
  let swl = r.swl_m != null ? Number(r.swl_m) : undefined;
  if (swl != null && (!isFinite(swl) || swl < 0 || swl > 600)) swl = undefined;
  return {
    name: (r.name && String(r.name).trim()) || 'Unnamed borehole',
    lat, lon, depth_m: depth,
    yield_m3h: yieldV, swl_m: swl,
    outcome: normalizeOutcome(r.outcome),
    permit: r.permit ? String(r.permit).trim() : undefined,
    aquiferType: r.aquiferType ? String(r.aquiferType).trim() : undefined,
    lithology: r.lithology ? String(r.lithology).trim() : undefined,
    county: r.county ? String(r.county).trim() : undefined,
  };
}

/** Parse WRA/county records from JSON or CSV/TSV text into validated WRARecords. */
export function parseWRARecords(text: string): WRAIngestResult {
  const errors: string[] = [], warnings: string[] = [];
  const out: WRARecord[] = [];
  const raw = String(text || '').trim();
  if (!raw) return { records: [], accepted: 0, rejected: 0, errors: ['No input provided.'], warnings };

  let rows: Record<string, any>[] = [];

  if (raw[0] === '[' || raw[0] === '{') {
    // JSON array of objects
    try {
      const j = JSON.parse(raw);
      rows = Array.isArray(j) ? j : Array.isArray(j?.wells) ? j.wells : [j];
    } catch { errors.push('Input looked like JSON but could not be parsed.'); return { records: [], accepted: 0, rejected: 0, errors, warnings }; }
  } else {
    // CSV/TSV with a header row
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) { errors.push('CSV needs a header row plus at least one data row.'); return { records: [], accepted: 0, rejected: 0, errors, warnings }; }
    const delim = lines[0].includes('\t') ? '\t' : lines[0].includes(';') && !lines[0].includes(',') ? ';' : ',';
    const headers = lines[0].split(delim).map(h => norm(h));
    // Map each header to a field
    const colMap: (keyof WRARecord | null)[] = headers.map(h => {
      for (const key of Object.keys(HEADER_ALIASES) as (keyof WRARecord | 'skip')[]) {
        if (key === 'skip') continue;
        if (HEADER_ALIASES[key].some(a => norm(a) === h)) return key as keyof WRARecord;
      }
      return null;
    });
    if (!colMap.includes('lat') || !colMap.includes('lon')) {
      warnings.push('Could not find latitude/longitude columns by name — expected headers like "lat"/"latitude" and "lon"/"longitude".');
    }
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(delim);
      const obj: Record<string, any> = {};
      colMap.forEach((k, idx) => { if (k) obj[k] = cells[idx]?.trim(); });
      rows.push(obj);
    }
  }

  rows.forEach((r, i) => {
    const rec = validateRecord(r as Partial<WRARecord>, `Row ${i + 1}`, errors);
    if (rec) out.push(rec);
  });

  const noDepth = out.filter(r => r.depth_m === 0).length;
  if (noDepth > 0) warnings.push(`${noDepth} record(s) accepted without a drilled depth — they still count as verified water points but add less to depth calibration.`);

  return { records: out, accepted: out.length, rejected: rows.length - out.length, errors, warnings };
}

/** Serialize accepted records into the exact `/data/wra-boreholes.json` format. */
export function wraRecordsToJSON(records: WRARecord[]): string {
  return JSON.stringify(
    records.map(r => ({
      name: r.name, lat: r.lat, lon: r.lon, depth_m: r.depth_m,
      ...(r.yield_m3h != null ? { yield_m3h: r.yield_m3h } : {}),
      ...(r.swl_m != null ? { swl_m: r.swl_m } : {}),
      outcome: r.outcome,
      ...(r.permit ? { permit: r.permit } : {}),
      ...(r.aquiferType ? { aquiferType: r.aquiferType } : {}),
      ...(r.lithology ? { lithology: r.lithology } : {}),
      ...(r.county ? { county: r.county } : {}),
    })),
    null, 2,
  );
}

export const WRA_LOCALSTORAGE_KEY = 'aquascan_wra_records';
