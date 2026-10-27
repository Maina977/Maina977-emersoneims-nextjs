/**
 * Is a point on Kenyan land? One check for every way a site reaches the
 * engine: typed coordinates, "Find & Re-analyze", place search and photo GPS
 * (2026-10-27 audit: re-analysis ran a full Kampala analysis, and points in
 * Lake Turkana and ~3-4 km offshore got full "drill" results).
 */

/**
 * Coarse outline of Kenya's land border (lon, lat) with a ~8 km tolerance:
 * enough to refuse the sea and neighbouring countries (2026-10-20 audit).
 * Checked against all 3,446 shipped field records and 22,820 registry points
 * (none fall outside) and 22 towns including border and coastal ones.
 */
const KENYA_OUTLINE: [number, number][] = [[33.95,0.15],[34.09,0.45],[34.24,0.65],[34.4,0.8],[34.6,1.2],[34.58,1.6],[34.97,1.95],[35,2.5],[34.45,2.95],[34.15,3.6],[33.99,4.22],[34.39,4.61],[34.4,4.98],[35,5.1],[35.95,5.45],[36.04,4.45],[37.05,4.36],[38.2,4.2],[38.95,3.6],[39.5,3.55],[39.86,3.84],[40.77,4.27],[41.17,3.94],[41.89,3.98],[41,2.78],[40.99,-0.85],[41.6,-1.65],[41.35,-1.95],[41.1,-2.25],[40.4,-2.62],[40.25,-3.1],[39.95,-3.6],[39.75,-4.05],[39.65,-4.4],[39.4,-4.72],[39.2,-4.68],[38.95,-4.45],[37.6,-3.45],[37.6,-3.05],[33.95,-1]];

export function inKenya(lat: number, lon: number): boolean {
  let inside = false;
  let minD = Infinity;
  for (let i = 0, j = KENYA_OUTLINE.length - 1; i < KENYA_OUTLINE.length; j = i++) {
    const [xi, yi] = KENYA_OUTLINE[i], [xj, yj] = KENYA_OUTLINE[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    const dx = xi - xj, dy = yi - yj;
    const s = Math.max(0, Math.min(1, ((lon - xj) * dx + (lat - yj) * dy) / (dx * dx + dy * dy)));
    minD = Math.min(minD, Math.hypot(lon - (xj + s * dx), lat - (yj + s * dy)));
  }
  return inside || minD < 0.07;
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
