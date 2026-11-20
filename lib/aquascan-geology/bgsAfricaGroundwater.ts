/**
 * AquaScan Pro: regional groundwater context from the BGS quantitative
 * groundwater maps of Africa (P1, 2026-11-20).
 *
 * Source: MacDonald, A.M., Bonsor, H.C., Ó Dochartaigh, B.É., Taylor, R.G.
 * (2012). Quantitative maps of groundwater resources in Africa. Environmental
 * Research Letters 7, 024009. Dataset DOI 10.5285/e37d09e7-6388-494b-99c8-10958d6d78c4.
 *
 * Licence: Open Government Licence (NGDC catalogue, checked 2026-11-20), with
 * the acknowledgement "Contains data supplied by permission of the Natural
 * Environment Research Council". Only the three layers of that dataset are
 * used: depth to groundwater, storage and productivity. Other layers on the
 * same map service (recharge, contamination probabilities and others) come
 * from other work under terms not yet checked, and are not used.
 *
 * Scale: 5 km grids designed for continental and regional use (nominally
 * 1:20 million). This is CONTEXT for a site assessment. It does not predict
 * the depth or yield of a borehole at a site; only local evidence (a
 * geophysical survey, nearby completion records, a hydrogeologist) can.
 *
 * Classes and ranges are the service's own legend (read 2026-11-20 from
 * map.bgs.ac.uk Africa_Groundwater_v2 MapServer legend).
 */
export const BGS_GW_VERSION = 'bgs-africa-groundwater 1.0.0 (2026-11-20)';
export const BGS_GW_SERVICE = 'https://map.bgs.ac.uk/ArcGIS/rest/services/Africa_Groundwater/Africa_Groundwater_v2/MapServer';
export const BGS_ACKNOWLEDGEMENT = `Contains data supplied by permission of the Natural Environment Research Council (${new Date().getUTCFullYear()}). MacDonald et al. (2012), Quantitative maps of groundwater resources in Africa, Environ. Res. Lett. 7 024009. Open Government Licence.`;
const UA = 'EmersonEIMS-website/1.0 (+https://www.emersoneims.com)';

export const DEPTH_CLASSES: Record<string, { label: string; minM: number; maxM: number | null }> = {
  VS: { label: 'Very shallow', minM: 0, maxM: 7 }, S: { label: 'Shallow', minM: 7, maxM: 25 }, SM: { label: 'Shallow–moderate', minM: 25, maxM: 50 },
  M: { label: 'Moderate', minM: 50, maxM: 100 }, D: { label: 'Deep', minM: 100, maxM: 250 }, VD: { label: 'Very deep', minM: 250, maxM: null },
};
export const STORAGE_CLASSES: Record<string, { label: string; minMm: number; maxMm: number | null }> = {
  L: { label: 'Low', minMm: 0, maxMm: 1000 }, LM: { label: 'Low–moderate', minMm: 1000, maxMm: 10000 }, M: { label: 'Moderate', minMm: 10000, maxMm: 25000 },
  H: { label: 'High', minMm: 25000, maxMm: 50000 }, VH: { label: 'Very high', minMm: 50000, maxMm: null },
};
export const PRODUCTIVITY_CLASSES: Record<string, { label: string; minLs: number; maxLs: number | null }> = {
  VL: { label: 'Very low', minLs: 0, maxLs: 0.1 }, L: { label: 'Low', minLs: 0.1, maxLs: 0.5 }, LM: { label: 'Low–moderate', minLs: 0.5, maxLs: 1 },
  M: { label: 'Moderate', minLs: 1, maxLs: 5 }, H: { label: 'High', minLs: 5, maxLs: 20 }, VH: { label: 'Very high', minLs: 20, maxLs: null },
};

export interface GroundwaterContext {
  status: 'OK' | 'NO DATA' | 'SERVICE UNAVAILABLE';
  depthToGroundwater: { code: string; label: string; rangeM: string } | null;
  storage: { code: string; label: string; rangeMm: string } | null;
  productivity: { code: string; label: string; rangeLs: string } | null;
  scale: string; use: string; acknowledgement: string; version: string; reason?: string;
}

const range = (min: number, max: number | null, unit: string) => (max === null ? `> ${min} ${unit}` : `${min}–${max} ${unit}`);
const base = (status: GroundwaterContext['status'], reason?: string): GroundwaterContext => ({
  status, depthToGroundwater: null, storage: null, productivity: null,
  scale: '5 km grid, continental scale (nominally 1:20 million)',
  use: 'Regional context only. It does not give the depth or yield of a borehole at this site; a geophysical survey, nearby completion records and a hydrogeologist do.',
  acknowledgement: BGS_ACKNOWLEDGEMENT, version: BGS_GW_VERSION, reason,
});

const cache = new Map<string, { at: number; v: GroundwaterContext }>();

export async function groundwaterContext(lat: number, lon: number, fetchImpl: typeof fetch = fetch): Promise<GroundwaterContext> {
  if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180)) throw new Error('Invalid coordinates');
  // The maps cover Africa only.
  if (lat < -36 || lat > 38 || lon < -26 || lon > 64) return base('NO DATA', 'Outside the African groundwater maps');
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`; // ~110 m: far finer than the 5 km grid
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < 7 * 86400e3) return hit.v;
  const p = new URLSearchParams({
    geometry: `${lon},${lat}`, geometryType: 'esriGeometryPoint', sr: '4326', layers: 'all:1,2,3', tolerance: '0',
    mapExtent: `${lon - 1},${lat - 1},${lon + 1},${lat + 1}`, imageDisplay: '400,400,96', returnGeometry: 'false', f: 'json',
  });
  let j: any;
  try {
    const r = await fetchImpl(`${BGS_GW_SERVICE}/identify?${p}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(12000) });
    if (!r.ok) return base('SERVICE UNAVAILABLE', `BGS map service HTTP ${r.status}`);
    j = await r.json();
  } catch (e) {
    return base('SERVICE UNAVAILABLE', e instanceof Error ? e.message : 'BGS map service did not answer');
  }
  if (j?.error) return base('SERVICE UNAVAILABLE', `BGS map service: ${j.error.message ?? 'error'}`);
  const pick = (layerId: number, field: string) => {
    const res = (j?.results ?? []).find((x: any) => x.layerId === layerId);
    const v = res?.attributes?.[`Raster.${field}`];
    return typeof v === 'string' && v.trim() ? v.trim() : null;
  };
  const d = pick(1, 'DTWAFRICA_'), s = pick(2, 'GWSTOR_V2'), pr = pick(3, 'GWPROD_V2');
  const out = base('OK');
  if (d && DEPTH_CLASSES[d]) out.depthToGroundwater = { code: d, label: DEPTH_CLASSES[d].label, rangeM: range(DEPTH_CLASSES[d].minM, DEPTH_CLASSES[d].maxM, 'm below ground') };
  if (s && STORAGE_CLASSES[s]) out.storage = { code: s, label: STORAGE_CLASSES[s].label, rangeMm: range(STORAGE_CLASSES[s].minMm, STORAGE_CLASSES[s].maxMm, 'mm of water') };
  if (pr && PRODUCTIVITY_CLASSES[pr]) out.productivity = { code: pr, label: PRODUCTIVITY_CLASSES[pr].label, rangeLs: range(PRODUCTIVITY_CLASSES[pr].minLs, PRODUCTIVITY_CLASSES[pr].maxLs, 'L/s') };
  const unknown = [d && !DEPTH_CLASSES[d] ? `depth "${d}"` : null, s && !STORAGE_CLASSES[s] ? `storage "${s}"` : null, pr && !PRODUCTIVITY_CLASSES[pr] ? `productivity "${pr}"` : null].filter(Boolean);
  if (!out.depthToGroundwater && !out.storage && !out.productivity) {
    const v = base('NO DATA', unknown.length ? `Unrecognised class codes: ${unknown.join(', ')}` : 'No mapped value at this point (water body or outside the map)');
    cache.set(key, { at: Date.now(), v });
    return v;
  }
  if (unknown.length) out.reason = `Unrecognised class codes ignored: ${unknown.join(', ')}`;
  if (cache.size > 2000) cache.delete(cache.keys().next().value as string);
  cache.set(key, { at: Date.now(), v: out });
  return out;
}

export function _clearBgsCache() { cache.clear(); }
