/**
 * True when an error is a failed download of a page's code (a "chunk"), e.g.
 * after the connection dropped while the page was loading (Phase 2 network
 * test, 2026-11-22: Solar Pro Tools after a 4 s outage reached the global error
 * page). Retrying in place cannot fix it; a full reload fetches the code again.
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const e = error as { name?: unknown; message?: unknown };
  const name = typeof e.name === 'string' ? e.name : '';
  const message = typeof e.message === 'string' ? e.message : String(error);
  return name === 'ChunkLoadError'
    || /Loading (CSS )?chunk [\w-]+ failed|Failed to load chunk|ChunkLoadError|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message);
}
