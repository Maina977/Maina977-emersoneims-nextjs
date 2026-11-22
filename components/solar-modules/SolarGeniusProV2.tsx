'use client';

/**
 * SOLAR GENIUS PRO V2 — mounts the Solar Genius Pro SPA (crc/src/App, HashRouter)
 * inside Next.js, client-only.
 *
 * Loading (2026-11-21, management directive "Solar loading"). Profiling a cold
 * load showed the workspace code (~800 KB of JS) only started downloading
 * ~3.7 s in, because it sat behind a second on-demand chunk (page → this
 * wrapper → App), and then competed with menu-link prefetches and analytics.
 * One production load took 38.7 s, and a failed chunk left the spinner on
 * screen for ever. Now:
 *  - the download starts as soon as this module is evaluated (preloadSolarApp),
 *    so the page no longer waits for a second chunk first;
 *  - a failed download (ChunkLoadError, network drop) is retried twice with
 *    back-off before an error with a Retry button is shown;
 *  - after 12 s a plain "still loading" note says what is happening.
 * The mechanism is shared with the other engineering modules since
 * 2026-11-21 (lib/loading/ResilientModule.tsx). The Quote Checker (#/quote-check)
 * and Pro Tools reports (#/pro) are part of this workspace download.
 * The engineering code itself is unchanged.
 */

import { ToolLoadingState } from '@/components/tools/ToolAppShell';
import { resilient } from '@/lib/loading/ResilientModule';

export { importWithRetry, SLOW_NOTE_AFTER_MS } from '@/lib/loading/resilientImport';

const SolarApp = resilient(() => import('./crc/src/App'), {
  name: 'Solar Genius Pro',
  subject: 'the workspace',
  eager: true, // start downloading as soon as this module runs in the browser
  loading: () => <ToolLoadingState name="Solar Genius Pro" />,
  failedTitle: 'The Solar Genius Pro workspace did not download.',
  failedBody: 'This is usually a dropped or slow connection. Nothing you entered is lost: drafts are kept in this browser.',
});

/** Starts (once) the download of the Solar workspace; safe to call repeatedly. */
export const preloadSolarApp = SolarApp.preload;

export default function SolarGeniusProV2() {
  // Same reserved height as the loader (ToolLoadingState is min-h-[100dvh]): the
  // workspace first frame on a phone was ~500 px tall for one commit, which pulled
  // the bands below into view and out again (CLS 0.085 at 390 px, 2026-11-22).
  return <div className="min-h-[100dvh]"><SolarApp /></div>;
}
