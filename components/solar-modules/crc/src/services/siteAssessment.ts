/**
 * Maps the three site-assessment answers used by the Solar dashboard to the
 * values it stores and shows.
 *
 * 2026-11-14: the dashboard read `.data…` on bodies that have no `.data`
 * wrapper (the API client returns the JSON body itself), and the weather field
 * is `current.temperature`, not `temp`. As a result irradiance, temperature
 * and roof area were never shown.
 *
 * Nothing is substituted. A value the source did not give stays null, and a
 * roof area is used only when a footprint was actually found.
 */
export interface SiteAssessment {
  irradianceKwhPerM2Day: number | null;
  temperatureC: number | null;
  roofAreaM2: number | null;
  roofPerimeterM: number | null;
  roofAzimuthDeg: number | null;
  roofProvenance: string;
  roofNote: string;
}

const body = (r: any) => (r && typeof r === 'object' && r.data && typeof r.data === 'object' ? r.data : r);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

export interface GeoHit { lat: number; lon: number; displayName: string }

/**
 * /api/geocode answers a plain array of { displayName, lat, lon }; an older
 * { success, data } shape is also accepted. Returns null when the answer is
 * not a list (service unavailable), [] when nothing matched.
 */
export function parseGeocodeHits(r: unknown): GeoHit[] | null {
  const x: any = r;
  const list = Array.isArray(x) ? x : x?.success ? x.data : null;
  if (!Array.isArray(list)) return null;
  return list.filter((h: any) => Number.isFinite(h?.lat) && Number.isFinite(h?.lon) && typeof h?.displayName === 'string');
}

export function mapSiteAssessment(nasaR: unknown, weatherR: unknown, roofR: unknown): SiteAssessment {
  // /api/nasa/solar → { status, parameters, summary.averageDailyGHI (null if no valid days) }
  const n: any = body(nasaR);
  let irr = num(n?.summary?.averageDailyGHI);
  if (irr === null) {
    const daily = n?.parameters?.ALLSKY_SFC_SW_DWN ?? n?.properties?.parameter?.ALLSKY_SFC_SW_DWN;
    const vals = daily ? (Object.values(daily).filter((v) => typeof v === 'number' && v > -900) as number[]) : [];
    if (vals.length) irr = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
  }

  // /api/weather → { current: { temperature }, source }
  const w: any = body(weatherR);
  const temperatureC = num(w?.current?.temperature ?? w?.temp);

  // /api/solar/roof-autofill → { found, roofAreaM2, source: 'osm', attribution } or { found:false, roofAreaM2:null, note }
  const rd: any = body(roofR);
  const found = !!rd && rd.found !== false && !rd.error;
  const prov = found ? rd.provenance : undefined;
  return {
    irradianceKwhPerM2Day: irr,
    temperatureC,
    roofAreaM2: found ? num(rd.areaM2 ?? rd.roofAreaM2) : null,
    roofPerimeterM: found ? num(rd.perimeterM) : null,
    roofAzimuthDeg: found ? num(rd.suggestedArrayAzimuthDeg ?? rd.azimuthDeg) : null,
    roofProvenance: !found ? '' : typeof prov === 'string' ? prov
      : (prov?.source || prov?.label || prov?.dataset || (rd.source === 'osm' ? `OpenStreetMap building footprint (${rd.attribution || '© OpenStreetMap contributors'})` : '')),
    roofNote: rd && rd.found === false && typeof rd.note === 'string' ? rd.note : '',
  };
}
