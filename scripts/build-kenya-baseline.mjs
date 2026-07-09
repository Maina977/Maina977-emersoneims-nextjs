/**
 * KENYA NATIONAL BASELINE BUILDER
 * ───────────────────────────────
 * Pre-computes REAL measured environmental data for Kenyan administrative
 * units by querying the authoritative APIs once per unit and storing the
 * results in public/data/kenya-baseline.json. This becomes EmersonEIMS's own
 * verified national database:
 *   - soil texture (clay/sand/silt %) + pH        ← ISRIC SoilGrids v2.0
 *   - annual precipitation + mean temperature      ← Open-Meteo ERA5 archive
 *   - elevation                                    ← Open-Elevation (SRTM 30m)
 *
 * Level 1 (this run): 47 county seats.
 * Level 2+ (extend):  pass a CSV of units as argv[2] with
 *                     name,level,county,lat,lon  (constituencies, towns,
 *                     villages) — the script appends/refreshes them in
 *                     batches, respecting API rate limits.
 *
 * Usage:  node scripts/build-kenya-baseline.mjs [units.csv]
 */
import fs from 'node:fs';

const COUNTIES = [
  ['Mombasa', -4.05, 39.67], ['Kwale', -4.17, 39.45], ['Kilifi', -3.63, 39.85],
  ['Tana River', -1.50, 40.03], ['Lamu', -2.27, 40.90], ['Taita-Taveta', -3.40, 38.56],
  ['Garissa', -0.45, 39.65], ['Wajir', 1.75, 40.06], ['Mandera', 3.94, 41.86],
  ['Marsabit', 2.33, 37.98], ['Isiolo', 0.35, 37.58], ['Meru', 0.05, 37.65],
  ['Tharaka-Nithi', -0.30, 37.85], ['Embu', -0.53, 37.45], ['Kitui', -1.37, 38.02],
  ['Machakos', -1.52, 37.26], ['Makueni', -1.78, 37.62], ['Nyandarua', -0.27, 36.37],
  ['Nyeri', -0.42, 36.95], ['Kirinyaga', -0.50, 37.28], ["Murang'a", -0.72, 37.15],
  ['Kiambu', -1.17, 36.83], ['Turkana', 3.12, 35.60], ['West Pokot', 1.24, 35.11],
  ['Samburu', 1.10, 36.70], ['Trans-Nzoia', 1.02, 35.00], ['Uasin Gishu', 0.52, 35.27],
  ['Elgeyo-Marakwet', 0.67, 35.51], ['Nandi', 0.20, 35.10], ['Baringo', 0.49, 35.74],
  ['Laikipia', 0.02, 36.36], ['Nakuru', -0.30, 36.07], ['Narok', -1.08, 35.87],
  ['Kajiado', -1.85, 36.78], ['Kericho', -0.37, 35.28], ['Bomet', -0.78, 35.34],
  ['Kakamega', 0.28, 34.75], ['Vihiga', 0.05, 34.72], ['Bungoma', 0.57, 34.56],
  ['Busia', 0.46, 34.11], ['Siaya', 0.06, 34.29], ['Kisumu', -0.09, 34.77],
  ['Homa Bay', -0.53, 34.46], ['Migori', -1.06, 34.47], ['Kisii', -0.68, 34.77],
  ['Nyamira', -0.57, 34.94], ['Nairobi', -1.29, 36.82],
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const OUT = 'public/data/kenya-baseline.json';

async function fetchJson(url, timeoutMs = 25000, tries = 3) {
  for (let a = 1; a <= tries; a++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
      if (res.ok) return await res.json();
      if (res.status === 429) { await sleep(4000 * a); continue; }
    } catch { /* retry */ }
    await sleep(1500 * a);
  }
  return null;
}

async function soilGrids(lat, lon) {
  const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=clay&property=sand&property=silt&property=phh2o&depth=0-30cm&value=mean`;
  const j = await fetchJson(url);
  if (!j?.properties?.layers) return null;
  const get = (name) => {
    const layer = j.properties.layers.find((l) => l.name === name);
    const v = layer?.depths?.[0]?.values?.mean;
    return v == null ? null : v;
  };
  const clay = get('clay'), sand = get('sand'), silt = get('silt'), ph = get('phh2o');
  if (clay == null && sand == null) return null;
  return {
    clay_pct: clay != null ? +(clay / 10).toFixed(1) : null,   // g/kg → %
    sand_pct: sand != null ? +(sand / 10).toFixed(1) : null,
    silt_pct: silt != null ? +(silt / 10).toFixed(1) : null,
    pH: ph != null ? +(ph / 10).toFixed(1) : null,             // pH*10 → pH
  };
}

async function climate(lat, lon) {
  // 10-year ERA5 climatology (2015-2024) — annual precip + mean temperature
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=2015-01-01&end_date=2024-12-31&daily=precipitation_sum,temperature_2m_mean&timezone=UTC`;
  const j = await fetchJson(url, 30000);
  const p = j?.daily?.precipitation_sum, t = j?.daily?.temperature_2m_mean;
  if (!Array.isArray(p) || !p.length) return null;
  const years = 10;
  const precipAnnual = p.reduce((s, v) => s + (v ?? 0), 0) / years;
  const tVals = (t ?? []).filter((v) => v != null);
  const tMean = tVals.length ? tVals.reduce((s, v) => s + v, 0) / tVals.length : null;
  return {
    precip_mm_yr: Math.round(precipAnnual),
    temp_mean_c: tMean != null ? +tMean.toFixed(1) : null,
    period: '2015-2024 (ERA5)',
  };
}

async function elevation(lat, lon) {
  const j = await fetchJson(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`);
  const e = j?.results?.[0]?.elevation;
  return e != null ? Math.round(e) : null;
}

// Optional extension file: name,level,county,lat,lon
function loadExtraUnits(csvPath) {
  if (!csvPath || !fs.existsSync(csvPath)) return [];
  return fs.readFileSync(csvPath, 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map((l) => {
    const [name, level, county, lat, lon] = l.split(',');
    return { name: name?.trim(), level: level?.trim() || 'town', county: county?.trim(), lat: +lat, lon: +lon };
  }).filter((u) => u.name && isFinite(u.lat) && isFinite(u.lon));
}

const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { v: 1, units: [] };
const byKey = new Map(existing.units.map((u) => [`${u.level}|${u.name.toLowerCase()}`, u]));

const units = [
  ...COUNTIES.map(([name, lat, lon]) => ({ name, level: 'county', county: name, lat, lon })),
  ...loadExtraUnits(process.argv[2]),
];

let done = 0, ok = 0;
for (const u of units) {
  const key = `${u.level}|${u.name.toLowerCase()}`;
  if (byKey.get(key)?.soil && byKey.get(key)?.climate) { done++; continue; } // already computed
  process.stdout.write(`[${++done}/${units.length}] ${u.name} (${u.level}) ... `);
  const [soil, clim, elev] = [await soilGrids(u.lat, u.lon), await climate(u.lat, u.lon), await elevation(u.lat, u.lon)];
  const rec = {
    name: u.name, level: u.level, county: u.county, lat: u.lat, lon: u.lon,
    elevation_m: elev, soil, climate: clim,
    fetched: new Date().toISOString().slice(0, 10),
    sources: ['ISRIC SoilGrids v2.0', 'Open-Meteo ERA5 archive 2015-2024', 'Open-Elevation SRTM'],
  };
  byKey.set(key, rec);
  if (soil || clim) ok++;
  console.log(`soil:${soil ? 'OK' : '—'} climate:${clim ? clim.precip_mm_yr + 'mm' : '—'} elev:${elev ?? '—'}m`);
  await sleep(1200); // be polite to SoilGrids
}

const out = {
  v: 1,
  generated: new Date().toISOString().slice(0, 10),
  description: 'EmersonEIMS Kenya national environmental baseline — REAL measured values per administrative unit (no estimates). Extend with constituencies/towns/villages via CSV.',
  count: byKey.size,
  units: [...byKey.values()],
};
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`\nWROTE ${OUT}: ${out.count} units (${ok} fetched fresh)`);
