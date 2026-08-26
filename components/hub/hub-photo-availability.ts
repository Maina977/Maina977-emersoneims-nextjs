import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Which Hub photos actually exist on disk.
 *
 * WHY THIS EXISTS
 * hub-photos.ts is a manifest of 18 slots to be filled with real site photos.
 * public/images/hub/ currently holds only its README, so every slot points at a
 * file that is not there.
 *
 * HubPhoto already degrades gracefully — it carries onError and swaps to a
 * gradient captioned "Photo coming soon", so nobody ever sees a broken image
 * icon. That part of the design works and is left alone.
 *
 * What it does NOT avoid is the request. Measured on the live site 2026-08-26:
 * /hub fired 17 image requests that each returned 404, one of them a `priority`
 * preload on the hero. A visitor on a Kenyan mobile connection pays the round
 * trip for all of them before the fallback renders. That is latency and data
 * spent fetching nothing.
 *
 * So availability is resolved on the SERVER, at render time, and a missing file
 * means the <Image> is never emitted. The placeholder renders directly instead.
 *
 * Node-only — import from server components. HubPhoto is 'use client' and must
 * receive the answer as a prop rather than calling this itself.
 */

const PUBLIC_DIR = join(process.cwd(), 'public');

/** True when the file behind a manifest `src` is present in /public. */
export function hubPhotoExists(src: string): boolean {
  // The manifest guarantees a leading slash; guard anyway rather than
  // accidentally resolving outside /public.
  if (!src.startsWith('/')) return false;
  try {
    return existsSync(join(PUBLIC_DIR, src.replace(/^\//, '')));
  } catch {
    // A filesystem error must not take the page down — fall back to rendering
    // the image and let HubPhoto's onError handle it, which is the old
    // behaviour and is safe.
    return true;
  }
}
