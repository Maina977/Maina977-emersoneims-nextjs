/**
 * EMERSONEIMS KENYA NATIONAL BASELINE — loader
 * ────────────────────────────────────────────
 * Bundles public/data/kenya-baseline.json — REAL measured environmental values
 * pre-computed per administrative unit (counties now; constituencies, towns
 * and villages appended in batches by scripts/build-kenya-baseline.mjs).
 *
 * PURPOSE: kill latitude-based guesswork. When a live API fails during an
 * analysis inside Kenya, the engine falls back to the nearest pre-computed
 * MEASURED unit (labelled as such) instead of inventing values from latitude.
 */

export interface BaselineUnit {
  name: string;
  level: 'county' | 'constituency' | 'town' | 'village' | string;
  county?: string;
  lat: number;
  lon: number;
  elevation_m: number | null;
  soil: { clay_pct: number | null; sand_pct: number | null; silt_pct: number | null; pH: number | null } | null;
  climate: { precip_mm_yr: number; temp_mean_c: number | null; period: string } | null;
  fetched: string;
  sources: string[];
}

// Bundled with the engine, not fetched (2026-10-27): during an analysis the
// browser has dozens of data requests open, the 14 KB fetch sometimes timed
// out, and Garissa then fell to a latitude guess (~1,400 mm/yr of rain for a
// ~300 mm/yr site). The same input now always uses the same measured baseline.
import baselineData from '../../../public/data/kenya-baseline.json';

const BASELINE_UNITS: BaselineUnit[] = Array.isArray((baselineData as any)?.units) ? (baselineData as any).units : [];

async function loadBaseline(): Promise<BaselineUnit[]> {
  return BASELINE_UNITS;
}

const KENYA_BBOX = { latMin: -5, latMax: 5.5, lonMin: 33, lonMax: 42.5 };

function haversineKm(a: number, b: number, c: number, d: number): number {
  const R = 6371, dLa = ((c - a) * Math.PI) / 180, dLo = ((d - b) * Math.PI) / 180;
  const x = Math.sin(dLa / 2) ** 2 + Math.cos((a * Math.PI) / 180) * Math.cos((c * Math.PI) / 180) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/**
 * Nearest pre-computed unit within maxKm (default 80 km — county-scale).
 * Returns null outside Kenya or when no unit is close enough: the caller must
 * then say "no data" rather than guess.
 */
export async function nearestKenyaBaseline(lat: number, lon: number, maxKm = 80): Promise<(BaselineUnit & { distance_km: number }) | null> {
  if (lat < KENYA_BBOX.latMin || lat > KENYA_BBOX.latMax || lon < KENYA_BBOX.lonMin || lon > KENYA_BBOX.lonMax) return null;
  const units = await loadBaseline();
  let best: BaselineUnit | null = null, bestD = Infinity;
  for (const u of units) {
    const d = haversineKm(lat, lon, u.lat, u.lon);
    if (d < bestD) { bestD = d; best = u; }
  }
  if (!best || bestD > maxKm) return null;
  return { ...best, distance_km: Math.round(bestD * 10) / 10 };
}
