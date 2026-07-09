/**
 * EMERSONEIMS KENYA NATIONAL BASELINE — loader
 * ────────────────────────────────────────────
 * Reads public/data/kenya-baseline.json — REAL measured environmental values
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

let cache: BaselineUnit[] | null = null;
let loadTried = false;

async function loadBaseline(): Promise<BaselineUnit[]> {
  if (cache || loadTried) return cache ?? [];
  loadTried = true;
  try {
    const res = await fetch('/data/kenya-baseline.json', { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const j = await res.json();
      if (Array.isArray(j?.units)) cache = j.units;
    }
  } catch { /* baseline not available — callers keep their own behaviour */ }
  return cache ?? [];
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
