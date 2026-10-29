/**
 * Open groundwater data that replaced six retired endpoints (2026-10-29).
 *
 *   Retired endpoint                  Replacement (all open, no key or account)
 *   BGS Africa Atlas ArcGIS service   BGS / MacDonald et al. (2012) quantitative maps of
 *                                     groundwater in Africa: depth to groundwater (V2,
 *                                     2023), productivity, storage; 5 km grid cut to
 *                                     Kenya, shipped as /data/kenya-gw-maps.json
 *   GEMStat station API (account)     Measured groundwater chemistry and water levels
 *                                     from open UNESCO IHP-WINS datasets (Acacia Water /
 *                                     Kenya RAPID+, Rural Focus / TMAM, UNICEF Turkana)
 *                                     and NERC Groundwater2030 Kisumu, shipped as
 *                                     /data/kenya-gw-measured.json
 *   IGRAC ggis:groundwater_monitoring IGRAC GGIS layer groundwater:Groundwater_Well
 *   _stations (404)                   (live WFS; lon,lat bbox in WFS 1.0.0)
 *   ISRIC WoSIS REST (404)            ISRIC WoSIS GraphQL (live)
 *   mWater API (account)              The mWater -> UNESCO IHP-WINS Kenya extract already
 *                                     shipped in /data/gov-wells-kenya.json
 *   BGS GeoIndex WFS                  Covers Great Britain only; not used for Kenya
 *
 * Everything here is evidence near the site, labelled with its source and
 * distance. Continental maps are context, never a substitute for field records.
 */
import { loadLocalJson } from './localData';

function haversineKm(a: number, b: number, c: number, d: number): number {
  const R = 6371, dLa = ((c - a) * Math.PI) / 180, dLo = ((d - b) * Math.PI) / 180;
  const x = Math.sin(dLa / 2) ** 2 + Math.cos((a * Math.PI) / 180) * Math.cos((c * Math.PI) / 180) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
const median = (v: number[]): number | null => {
  if (!v.length) return null;
  const s = [...v].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const round = (v: number | null, dp = 1): number | null => (v == null ? null : Math.round(v * 10 ** dp) / 10 ** dp);

// ─── BGS / MacDonald quantitative maps ───────────────────────────────────
interface GridSet { source: string; grids: Record<string, { unit: string; version: string; classes: string[]; lon0: number; lat0: number; step: number; nx: number; ny: number; rows: string[] }> }

export interface BgsGroundwaterMaps {
  depthToGroundwater: string | null;
  /** Productivity class and the yield it means, in m3/h (1 L/s = 3.6 m3/h). */
  productivity: string | null;
  productivityRange_m3h: [number, number] | null;
  storage: string | null;
  /** Distance to the grid cell used, when the site's own cell is empty (coast, lakes). */
  cellOffset_km: number;
  source: string;
}

const PROD_M3H: [number, number][] = [[0, 0.36], [0.36, 1.8], [1.8, 3.6], [3.6, 18], [18, 72], [72, 200]];

export async function bgsGroundwaterMaps(lat: number, lon: number): Promise<BgsGroundwaterMaps | null> {
  const g = await loadLocalJson<GridSet>('/data/kenya-gw-maps.json');
  if (!g?.grids) return null;
  // The site's cell, else the nearest filled cell within 3 cells (~15 km).
  const pick = (key: string): { idx: number; km: number } | null => {
    const G = g.grids[key];
    if (!G) return null;
    const i0 = Math.round((lon - G.lon0) / G.step), j0 = Math.round((lat - G.lat0) / G.step);
    let best: { idx: number; km: number } | null = null;
    for (let r = 0; r <= 3 && !best; r++) {
      for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
        if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
        const c = G.rows[j0 + dj]?.[i0 + di];
        if (c == null || c === '.') continue;
        const km = haversineKm(lat, lon, G.lat0 + (j0 + dj) * G.step, G.lon0 + (i0 + di) * G.step);
        if (!best || km < best.km) best = { idx: Number(c), km };
      }
    }
    return best;
  };
  const d = pick('depth'), p = pick('productivity'), s = pick('storage');
  if (!d && !p && !s) return null;
  const offset = Math.max(d?.km ?? 0, p?.km ?? 0, s?.km ?? 0);
  return {
    depthToGroundwater: d ? g.grids.depth.classes[d.idx] : null,
    productivity: p ? g.grids.productivity.classes[p.idx] : null,
    productivityRange_m3h: p ? PROD_M3H[p.idx] : null,
    storage: s ? g.grids.storage.classes[s.idx] : null,
    cellOffset_km: Math.round(offset),
    source: 'BGS / MacDonald et al. (2012), Quantitative maps of groundwater resources in Africa (5 km; depth to groundwater V2 2023). Continental-scale classes: context for the site, not a site measurement. Contains data supplied by permission of the Natural Environment Research Council [2023] (Open Government Licence).',
  };
}

// ─── Measured groundwater chemistry and water levels ─────────────────────
interface MeasuredFile {
  sources: string[];
  records: [number, number, number | null, number | null, number | null, number | null, number | null, number | null, number | null, number | null, string | null, number][];
  areaSummaries?: any[];
}

export interface MeasuredGroundwater {
  radius_km: number;
  boreholes: number;
  nearest_km: number | null;
  /** Electrical conductivity, uS/cm, and the salinity it means. */
  ec: { n: number; median: number | null; p75: number | null; over1500: number; over3000: number } | null;
  /** TDS estimated from EC (x0.65) where TDS was not measured; measured TDS kept as is. */
  tdsMedian_mgL: number | null;
  fluoride: { n: number; median: number | null; max: number | null; over1_5: number } | null;
  nitrate: { n: number; median: number | null; over50: number } | null;
  restWaterLevel: { n: number; median: number | null; p25: number | null; p75: number | null } | null;
  firstStrike: { n: number; median: number | null } | null;
  salinityClasses: Record<string, number>;
  sources: string[];
  /** City surveys without coordinates (e.g. Kisumu 2014), when the site is inside their area. */
  areaSurveys: any[];
}

const pct = (s: number[], q: number) => (s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : null);

/** Measured groundwater near the site, or null when none lies within the radius. */
export async function measuredGroundwaterNear(lat: number, lon: number, radiusKm = 25): Promise<MeasuredGroundwater | null> {
  const f = await loadLocalJson<MeasuredFile>('/data/kenya-gw-measured.json');
  if (!f?.records) return null;
  const near = f.records.map((r) => ({ r, km: haversineKm(lat, lon, r[0], r[1]) })).filter((x) => x.km <= radiusKm);
  const areas = (f.areaSummaries ?? []).filter((a) => haversineKm(lat, lon, a.lat, a.lon) <= a.radiusKm);
  if (!near.length && !areas.length) return null;
  const col = (i: number) => near.map((x) => x.r[i]).filter((v): v is number => typeof v === 'number').sort((a, b) => a - b);
  const ec = col(2), tds = col(3), fl = col(4), no3 = col(6), swl = col(8), strike = col(9);
  const tdsAll = tds.length >= 3 ? tds : ec.map((v) => v * 0.65);
  const sal: Record<string, number> = {};
  near.forEach((x) => { if (x.r[10]) sal[x.r[10]] = (sal[x.r[10]] || 0) + 1; });
  const srcIdx = [...new Set(near.map((x) => x.r[11]))];
  return {
    radius_km: radiusKm,
    boreholes: near.length,
    nearest_km: near.length ? round(Math.min(...near.map((x) => x.km))) : null,
    ec: ec.length ? { n: ec.length, median: round(median(ec), 0), p75: round(pct(ec, 0.75), 0), over1500: ec.filter((v) => v > 1500).length, over3000: ec.filter((v) => v > 3000).length } : null,
    tdsMedian_mgL: tdsAll.length ? round(median(tdsAll), 0) : null,
    fluoride: fl.length ? { n: fl.length, median: round(median(fl), 2), max: round(fl[fl.length - 1], 2), over1_5: fl.filter((v) => v > 1.5).length } : null,
    nitrate: no3.length ? { n: no3.length, median: round(median(no3), 1), over50: no3.filter((v) => v > 50).length } : null,
    restWaterLevel: swl.length ? { n: swl.length, median: round(median(swl), 1), p25: round(pct(swl, 0.25), 1), p75: round(pct(swl, 0.75), 1) } : null,
    firstStrike: strike.length ? { n: strike.length, median: round(median(strike), 1) } : null,
    salinityClasses: sal,
    sources: srcIdx.map((i) => f.sources[i]).filter(Boolean),
    areaSurveys: areas,
  };
}

// ─── ISRIC WoSIS soil profiles (live, GraphQL) ───────────────────────────
export interface WosisProfile { profileId: number; lat: number; lon: number; distance_km: number; soilGroup: string | null; dataset: string | null; year: number | null }

/** Measured soil profiles near the site (soil evidence, not boreholes). */
export async function fetchWosisProfiles(lat: number, lon: number, radiusKm = 25, timeoutMs = 15000): Promise<WosisProfile[] | null> {
  const d = radiusKm / 111;
  const query = `{ wosisLatestProfiles(first: 40, filter: { latitude: { greaterThan: ${(lat - d).toFixed(4)}, lessThan: ${(lat + d).toFixed(4)} }, longitude: { greaterThan: ${(lon - d).toFixed(4)}, lessThan: ${(lon + d).toFixed(4)} } }) { profileId latitude longitude wrbReferenceSoilGroup faoMajorGroup datasetCode year } }`;
  try {
    const res = await fetch('https://graphql.isric.org/wosis/graphql', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }), signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const j = await res.json();
    const rows: any[] = j?.data?.wosisLatestProfiles ?? [];
    return rows
      .map((p) => ({
        profileId: p.profileId, lat: p.latitude, lon: p.longitude,
        distance_km: round(haversineKm(lat, lon, p.latitude, p.longitude)) as number,
        soilGroup: p.wrbReferenceSoilGroup || p.faoMajorGroup || null,
        dataset: p.datasetCode ?? null, year: p.year ?? null,
      }))
      .filter((p) => p.distance_km <= radiusKm)
      .sort((a, b) => a.distance_km - b.distance_km);
  } catch {
    return null;
  }
}

// ─── IGRAC GGIS groundwater wells (live WFS) ─────────────────────────────
export interface IgracWell { id: string; name: string; lat: number; lon: number; distance_km: number; purpose: string | null; organisation: string | null; levelRecords: number; qualityRecords: number; lastMeasurement: string | null }

export async function fetchIgracWells(lat: number, lon: number, radiusKm = 50, timeoutMs = 15000): Promise<IgracWell[] | null> {
  const d = radiusKm / 111;
  // WFS 1.0.0 takes the bbox as lon,lat (2.0.0 with EPSG:4326 swaps the axes).
  const bbox = `${(lon - d).toFixed(4)},${(lat - d).toFixed(4)},${(lon + d).toFixed(4)},${(lat + d).toFixed(4)}`;
  const url = `https://ggis.un-igrac.org/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${encodeURIComponent('groundwater:Groundwater_Well')}&maxFeatures=200&outputFormat=${encodeURIComponent('application/json')}&bbox=${bbox}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    const j = await res.json();
    return (j?.features ?? [])
      .map((f: any) => {
        const [wLon, wLat] = f.geometry?.coordinates ?? [];
        const p = f.properties ?? {};
        return {
          id: String(p.ggis_uid ?? p.id), name: String(p.name ?? p.original_id ?? 'IGRAC well'),
          lat: wLat, lon: wLon, distance_km: round(haversineKm(lat, lon, wLat, wLon)) as number,
          purpose: p.purpose ?? null, organisation: p.organisation ?? null,
          levelRecords: Number(p.groundwater_level_data) || 0, qualityRecords: Number(p.groundwater_quality_data) || 0,
          lastMeasurement: p.last_recorded_measurement ? String(p.last_recorded_measurement).slice(0, 10) : null,
        };
      })
      .filter((w: IgracWell) => Number.isFinite(w.lat) && Number.isFinite(w.lon) && w.distance_km <= radiusKm)
      .sort((a: IgracWell, b: IgracWell) => a.distance_km - b.distance_km);
  } catch {
    return null;
  }
}

// Fetched with the other shipped files, after the page's own first load.
if (typeof window !== 'undefined') {
  setTimeout(() => {
    void loadLocalJson('/data/kenya-gw-maps.json');
    void loadLocalJson('/data/kenya-gw-measured.json');
    void loadLocalJson('/data/kenya-grace.json');
  }, 5000);
}
