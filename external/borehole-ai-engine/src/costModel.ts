/**
 * ONE drilling cost basis for the on-screen cost card and the PDF/Word/Excel
 * reports (2026-10-20 audit: the card priced rocky ground at $115/m and the
 * PDF at $62/m, and the card's mobilisation grew with depth, so Nairobi CBD
 * cost more to reach than Lodwar).
 *
 * Rates: Kenya market, July 2026 — Nairobi/Kiambu/Kajiado ≈ KSh 6,500–9,500/m
 * for air/DTH drilling in consolidated ground; mud rotary in loose ground up to
 * ≈ KSh 13,000/m. Loose ground costs MORE than hard rock in Kenya (mud vs air).
 * Those all-in contractor rates include mobilisation around the Nairobi base;
 * sites further away carry a distance surcharge for the rig and support trucks.
 */

/** USD per metre by ground type. */
/** One KSh/USD rate for the web page and the PDF (2026-10-25 audit: 130 vs 129). Indicative; update annually. */
export const KES_PER_USD = 129;

export const DRILL_RATE_USD_PER_M: Record<string, number> = {
  sandy: 100, silty: 88, clay: 82, loamy: 72, laterite: 66, rocky: 62, unknown: 75,
};

/**
 * Per-metre rate for the ground type, kept inside the county's recorded rate
 * band where the county record has one.
 */
export function drillRatePerM(soilType: string | undefined, countyBand?: [number, number] | null): number {
  const base = DRILL_RATE_USD_PER_M[(soilType || 'unknown').toLowerCase()] ?? DRILL_RATE_USD_PER_M.unknown;
  if (!countyBand || !(countyBand[0] > 0) || !(countyBand[1] >= countyBand[0])) return base;
  return Math.min(countyBand[1], Math.max(countyBand[0], base));
}

const BASE_LAT = -1.2921, BASE_LON = 36.8219; // Nairobi

/** Straight-line km from the Nairobi base, or null without coordinates. */
export function kmFromBase(lat?: number, lon?: number): number | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const R = 6371, rad = Math.PI / 180;
  const la = lat as number, lo = lon as number;
  const dLa = (la - BASE_LAT) * rad, dLo = (lo - BASE_LON) * rad;
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(BASE_LAT * rad) * Math.cos(la * rad) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Mobilisation surcharge (USD) beyond the 50 km the per-metre rates already
 * cover: about $3 per km of straight-line distance (rig, compressor and
 * support trucks out and back). Without coordinates, 250 km is assumed.
 */
export function mobilisationUSD(lat?: number, lon?: number): number {
  const km = kmFromBase(lat, lon) ?? 250;
  const usd = Math.round(3 * Math.max(0, km - 50));
  // A few extra kilometres are absorbed in the drilling rate; a "$15" line is
  // noise (2026-10-25 audit, Machakos).
  return usd < 100 ? 0 : usd;
}

/** County rate band from an analysis result, if the county record has one. */
export function countyRateBand(result: any): [number, number] | null {
  const b = result?.boreholeRecords?.countyIntelligence?.drillingCostPerM_USD;
  return Array.isArray(b) && b.length === 2 && Number(b[0]) > 0 ? [Number(b[0]), Number(b[1])] : null;
}

/** Ground type for costing: only a measured (ISRIC SoilGrids) soil type, never photo colours. */
export function costSoilType(result: any): string | undefined {
  return result?.soil?.realSoilGrids ? result?.soil?.type : undefined;
}
