/**
 * Server-side OpenStreetMap Overpass client.
 *
 * 2026-11-14: overpass-api.de answers 406 Not Acceptable to requests without an
 * identifying User-Agent, which is what Node's fetch sends. Every server-side
 * Overpass call therefore failed. Five routes then reported "no water within
 * 2 km", "no boreholes nearby" or a default 120 m² roof.
 *
 * This client:
 * - sends an identifying User-Agent;
 * - on overload (429 / 502 / 503 / 504) or a timeout, tries the public
 *   community mirrors;
 * - reports failure as null, never as an empty result.
 *
 * OSM data is © OpenStreetMap contributors, ODbL 1.0. Credit it wherever
 * results are shown.
 */
export const OVERPASS_USER_AGENT = 'EmersonEIMS-website/1.0 (+https://www.emersoneims.com)';
export const OSM_ATTRIBUTION = '© OpenStreetMap contributors (ODbL)';

export const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

export interface OverpassResult<E = any> {
  elements: E[];
  endpoint: string;
}

/**
 * Runs an Overpass QL query. Returns null when no endpoint answered with valid
 * JSON. An answered query with no matches returns `elements: []`.
 */
export async function overpassQuery<E = any>(
  query: string,
  opts: { timeoutMs?: number; budgetMs?: number; fetchImpl?: typeof fetch; endpoints?: string[]; revalidateS?: number } = {},
): Promise<OverpassResult<E> | null> {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? 15000;
  // Whole-call budget across all servers (2026-11-14 preview: three sequential
  // 15 s attempts during an Overpass-wide overload ran past the ~30 s function
  // limit and the caller got a 504 instead of its INSUFFICIENT EVIDENCE answer).
  const deadline = Date.now() + (opts.budgetMs ?? 18000);
  for (const endpoint of opts.endpoints ?? OVERPASS_ENDPOINTS) {
    const remaining = deadline - Date.now();
    if (remaining < 1500) break;
    try {
      const r = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': OVERPASS_USER_AGENT,
          Accept: 'application/json',
        },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(Math.min(timeoutMs, remaining)),
        // Next.js data cache for repeat lookups of the same place (optional).
        ...(opts.revalidateS ? { next: { revalidate: opts.revalidateS } } : {}),
      } as RequestInit);
      if (!r.ok) continue; // 406 / 429 / 5xx: try the next server
      const j = await r.json();
      if (j && Array.isArray(j.elements)) return { elements: j.elements as E[], endpoint };
    } catch {
      // timeout or network: next server
    }
  }
  return null;
}
