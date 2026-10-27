/**
 * Terrain elevations for one or more points.
 *
 * Open-Meteo's elevation API (Copernicus DEM 90 m, no key, up to 100 points
 * per request) is asked first: it answers reliably, so the same site uses the
 * same terrain on every run. Open-Elevation (SRTM 30 m) is the second source;
 * it is usually rate-limited (HTTP 429: 56 of 56 requests failed in the
 * 2026-10-27 audit), which is why it no longer goes first.
 *
 * Before any of this a failed lookup became a fixed 500 m or a grid of zeros,
 * and the same site gave different depths on different runs (2026-10-25).
 * Returns null when neither source answers, so callers can say so rather than
 * compute terrain from made-up numbers.
 */
export interface ElevationLookup {
  elevations: number[];
  source: string;
}

async function openMeteo(points: { lat: number; lon: number }[], timeoutMs: number): Promise<ElevationLookup | null> {
  try {
    const out: number[] = [];
    for (let i = 0; i < points.length; i += 100) {
      const chunk = points.slice(i, i + 100);
      const la = chunk.map((p) => p.lat.toFixed(5)).join(',');
      const lo = chunk.map((p) => p.lon.toFixed(5)).join(',');
      const resp = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${la}&longitude=${lo}`, { signal: AbortSignal.timeout(timeoutMs) });
      if (!resp.ok) return null;
      const data = await resp.json();
      const el = data?.elevation;
      if (!Array.isArray(el) || el.length !== chunk.length || !el.every((v) => typeof v === 'number' && isFinite(v))) return null;
      out.push(...el);
    }
    return { elevations: out, source: 'Open-Meteo elevation API (Copernicus DEM 90m)' };
  } catch {
    return null;
  }
}

async function openElevation(points: { lat: number; lon: number }[], timeoutMs: number): Promise<ElevationLookup | null> {
  try {
    const resp = await fetch('https://api.open-elevation.com/api/v1/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations: points.map((p) => ({ latitude: p.lat, longitude: p.lon })) }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const el = (data?.results ?? []).map((r: any) => r?.elevation);
    if (el.length === points.length && el.every((v: unknown) => typeof v === 'number' && isFinite(v as number))) {
      return { elevations: el as number[], source: 'Open-Elevation API (SRTM 30m)' };
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchElevations(
  points: { lat: number; lon: number }[],
  timeoutMs = 15000,
): Promise<ElevationLookup | null> {
  if (points.length === 0) return null;
  return (await openMeteo(points, timeoutMs)) ?? (await openElevation(points, timeoutMs));
}
