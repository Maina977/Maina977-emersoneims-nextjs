/**
 * Shared loader for the engine's own data files in /public/data.
 *
 * 2026-10-27: these files were fetched in the middle of an analysis with a
 * 6-8 s timeout, alongside dozens of external requests, and sometimes timed
 * out; the same site then got a different answer (no yield evidence band).
 * Now each file is requested once, as soon as the engine loads, with a
 * longer timeout and one retry, and every caller shares that one download.
 */
const pending = new Map<string, Promise<any>>();

async function fetchOnce(path: string, timeoutMs: number): Promise<any> {
  const res = await fetch(path, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`${path} HTTP ${res.status}`);
  return res.json();
}

/** The parsed JSON, or null when it could not be loaded (retried next call). */
export function loadLocalJson<T = any>(path: string): Promise<T | null> {
  let p = pending.get(path);
  if (!p) {
    p = fetchOnce(path, 30000)
      .catch(() => new Promise((r) => setTimeout(r, 1000)).then(() => fetchOnce(path, 30000)))
      .catch(() => { pending.delete(path); return null; });
    pending.set(path, p);
  }
  return p as Promise<T | null>;
}

// Start the downloads when the engine loads, before an analysis opens its
// external requests (browser only).
// The 2 MB registry follows a moment later so it does not compete with the
// page's own first load.
if (typeof window !== 'undefined') {
  void loadLocalJson('/data/wra-boreholes.json');
  setTimeout(() => { void loadLocalJson('/data/gov-wells-kenya.json'); }, 3000);
}
