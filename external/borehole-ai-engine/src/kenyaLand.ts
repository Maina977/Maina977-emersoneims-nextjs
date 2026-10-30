/**
 * Is a point on Kenyan land? One check for every way a site reaches the
 * engine: typed coordinates, "Find & Re-analyze", place search and photo GPS
 * (2026-10-27 audit: re-analysis ran a full Kampala analysis, and points in
 * Lake Turkana and ~3-4 km offshore got full "drill" results).
 */

import { KENYA_RINGS } from './kenyaOutline';

/**
 * Kenya's land outline (kenyaOutline.ts, ~550 m accuracy) with a ~3 km
 * tolerance for border wells and the simplification (2026-10-30 audit: the
 * coarse 40-point outline needed ~8 km and accepted points that far offshore).
 * Checked 2026-10-30: all 22,820 registry points, 27 border, coastal and
 * island towns, and 3,445 of 3,446 field records are accepted (the one
 * refused is geocoded 43 km inside Ethiopia); points 7 km off Mombasa,
 * Malindi and Lamu, and Tororo, Busia (Uganda side), Arusha, Tanga and Kismayo
 * are refused.
 */
const TOLERANCE_DEG = 0.03;

export function inKenya(lat: number, lon: number): boolean {
  let minD = Infinity;
  for (const R of KENYA_RINGS) {
    let inside = false;
    for (let i = 0, j = R.length - 1; i < R.length; j = i++) {
      const [xi, yi] = R[i], [xj, yj] = R[j];
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
      const dx = xi - xj, dy = yi - yj;
      const s = Math.max(0, Math.min(1, ((lon - xj) * dx + (lat - yj) * dy) / (dx * dx + dy * dy)));
      minD = Math.min(minD, Math.hypot(lon - (xj + s * dx), lat - (yj + s * dy)));
    }
    if (inside) return true;
  }
  return minD < TOLERANCE_DEG;
}

/**
 * Open water at the point? The Copernicus DEM (via Open-Meteo) holds water
 * bodies at one constant level and the sea at 0 m, while land is never
 * perfectly flat over a few km. Measured 2026-10-27 on a 3x3 grid at ~1.7 km
 * spacing: Lake Turkana 9/9 points at 362 m, Winam Gulf 9/9 at 1,133 m; the
 * flattest land (Lodwar) had at most 2 equal heights and a 14 m range.
 * Returns null when the elevation service does not answer (not checked).
 */
export async function openWaterAt(lat: number, lon: number): Promise<'sea' | 'lake' | false | null> {
  const d = 0.015;
  const pts: [number, number][] = [];
  for (const dy of [-d, 0, d]) for (const dx of [-d, 0, d]) pts.push([lat + dy, lon + dx]);
  try {
    const la = pts.map((p) => p[0].toFixed(5)).join(',');
    const lo = pts.map((p) => p[1].toFixed(5)).join(',');
    const r = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${la}&longitude=${lo}`, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) return null;
    const el: unknown = (await r.json())?.elevation;
    if (!Array.isArray(el) || el.length !== 9 || !el.every((v) => typeof v === 'number')) return null;
    const centre = el[4] as number;
    if (centre <= 0) return 'sea';
    const same = (el as number[]).filter((v) => v === centre).length;
    return same >= 5 ? 'lake' : false;
  } catch {
    return null;
  }
}

/** A clear refusal, or null when the point is on Kenyan land. */
export async function siteRefusal(lat: number, lon: number): Promise<string | null> {
  if (!inKenya(lat, lon)) {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)} is outside Kenya's land area (sea or a neighbouring country). AquaScan uses Kenyan borehole records, rainfall and costs, so it only runs for sites in Kenya.`;
  }
  const water = await openWaterAt(lat, lon);
  if (water === 'sea') return `${lat.toFixed(4)}, ${lon.toFixed(4)} is in the sea (0 m elevation). Move the pin onto land.`;
  if (water === 'lake') return `${lat.toFixed(4)}, ${lon.toFixed(4)} is on open water (a lake surface). Move the pin onto land.`;
  return null;
}
