/**
 * ONE drilling cost basis for the on-screen cost card and the PDF/Word/Excel
 * reports (2026-10-20 audit: the card priced rocky ground at $115/m and the
 * PDF at $62/m, and the card's mobilisation grew with depth, so Nairobi CBD
 * cost more to reach than Lodwar).
 *
 * Rates (2026-11-05): the EmersonEIMS signed tender, EIMS_RATES_KES below.
 * Earlier basis, kept for reference: Kenya market, July 2026 — Nairobi/Kiambu/Kajiado ≈ KSh 6,500–9,500/m
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
/** USD per metre by formation, i.e. by drilling method: the midpoints of the
 *  report's own B.3 table (DTH in hard rock 62-72, mud rotary in sediments
 *  82-100). The formation sets the method and the rate; the topsoil, which
 *  was the key, was almost always unknown, so every site got 75 (2026-10-29 audit). */
export function formationRatePerM(rockType: string | undefined): number | null {
  const r = String(rockType || '').toLowerCase();
  if (!r || /unknown/.test(r)) return null;
  if (/basalt|phonolite|trachyte|tuff|volcanic|lava|rhyolite|andesite|nephelinite|granite|gneiss|schist|quartzite|migmatite|basement|crystalline|dolerite/.test(r)) return 67;
  if (/limestone|coral|karst|dolomite|marble|chalk/.test(r)) return 80;
  if (/sand|shale|mud|silt|alluv|sediment|clay|gravel|laterite/.test(r)) return 91;
  return null;
}

/**
 * EMERSONEIMS RATES (owner instruction 2026-11-05): the signed and stamped
 * EmersonEIMS tender for borehole drilling in Baringo County, 16 Oct 2026
 * (accepted by the State Department for Housing and Urban Development,
 * 19 Oct 2026), per borehole, KES, before VAT. Drilling beyond 300 m and in
 * hard rock are the rates from the company's researched pricing draft of the
 * same date (the signed BOQ carried them at zero quantity).
 */
export const EIMS_RATES_KES = {
  source: 'EmersonEIMS signed tender, Baringo County, 16 Oct 2026',
  drillSoftBandsPerM: [[100, 6800], [200, 7300], [300, 8200], [Infinity, 9500]] as [number, number][],
  drillHardRockPerM: 10500,
  steelCasing6inPerM: 4200,
  gravelPackPerTon: 6500,
  gravelTonsPerMetre: 25 / 217,          // the tender's 25 t for a 217 m hole
  developmentPerHour: 12500, developmentHours: 12,
  testPumpingPerHour: 9500, testPumpingHours: 24,
  waterQualityLab: 28000,
  capAndSiteFinishing: 85000,
  mobilisation: 240000,
  hydrogeologicalSurvey: 85000,
  wraDrillingPermit: 80000, abstractionPermit: 30000, countyFees: 25000, nemaReport: 105000,
} as const;
const HARD_ROCK = /basalt|phonolite|trachyte|tuff|volcanic|lava|rhyolite|andesite|nephelinite|granite|gneiss|schist|quartzite|migmatite|basement|crystalline|dolerite/;

/** Drilling cost in KES for a hole of `depth` metres at the EmersonEIMS rates. */
export function drillingCostKES(depth: number, rockType?: string): number {
  const d = Math.max(0, depth);
  if (HARD_ROCK.test(String(rockType || '').toLowerCase())) return d * EIMS_RATES_KES.drillHardRockPerM;
  let cost = 0, from = 0;
  for (const [to, rate] of EIMS_RATES_KES.drillSoftBandsPerM) {
    if (d <= from) break;
    cost += (Math.min(d, to) - from) * rate;
    from = to;
  }
  return cost;
}

/** Average drilling rate in USD/m over the hole, at the EmersonEIMS rates. */
export function drillRatePerM(_soilType: string | undefined, _countyBand?: [number, number] | null, rockType?: string, depth = 100): number {
  const d = Math.max(1, depth);
  return drillingCostKES(d, rockType) / d / KES_PER_USD;
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
  // Beyond 100 km the rig, compressor and crew mobilisation is at least the
  // EmersonEIMS tender's KES 240,000 (Baringo, 2026-11-05 owner rates).
  const floor = km > 100 ? Math.round(EIMS_RATES_KES.mobilisation / KES_PER_USD) : 0;
  const out = Math.max(usd, floor);
  // A few extra kilometres are absorbed in the drilling rate; a "$15" line is
  // noise (2026-10-25 audit, Machakos).
  return out < 100 ? 0 : out;
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
