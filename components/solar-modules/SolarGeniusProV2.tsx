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
 * The engineering code itself is unchanged.
 */

import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { ToolLoadingState } from '@/components/tools/ToolAppShell';

type AppComponent = ComponentType<Record<string, never>>;

let appPromise: Promise<AppComponent> | null = null;

export async function importWithRetry<T>(load: () => Promise<T>, attempts = 3, wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))): Promise<T> {
  for (let i = 0; ; i++) {
    try { return await load(); }
    catch (e) {
      if (i >= attempts - 1) throw e;
      await wait(1000 * 2 ** i); // 1 s, then 2 s
    }
  }
}

/** Starts (once) the download of the Solar workspace; safe to call repeatedly. */
export function preloadSolarApp(): Promise<AppComponent> {
  if (!appPromise) {
    appPromise = importWithRetry(() => import('./crc/src/App').then((m) => m.default as AppComponent))
      .catch((e) => { appPromise = null; throw e; }); // allow a later Retry
  }
  return appPromise;
}

// Start downloading as soon as this module runs in the browser.
if (typeof window !== 'undefined') preloadSolarApp().catch(() => { /* surfaced by the component */ });

export const SLOW_NOTE_AFTER_MS = 12_000;

export default function SolarGeniusProV2() {
  const [App, setApp] = useState<AppComponent | null>(null);
  const [failed, setFailed] = useState(false);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    setFailed(false); setSlow(false);
    const t = setTimeout(() => { if (live) setSlow(true); }, SLOW_NOTE_AFTER_MS);
    preloadSolarApp()
      .then((C) => { if (live) setApp(() => C); })
      .catch(() => { if (live) setFailed(true); })
      .finally(() => clearTimeout(t));
    return () => { live = false; clearTimeout(t); };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // Same reserved height as the loader (ToolLoadingState is min-h-[100dvh]). The
  // workspace's first frame on a phone was ~500 px tall for one commit before its
  // pages laid out, which pulled the bands below the tool into view and pushed
  // them out again (CLS 0.085 at 390 px, 2026-11-22). Keeping at least the
  // loader's height means content below never moves up into view.
  if (App) return <div className="min-h-[100dvh]"><App /></div>;
  if (failed) {
    return (
      <div className="min-h-[60dvh] flex items-center justify-center bg-gradient-to-b from-slate-950 to-black" role="alert">
        <div className="text-center px-4 max-w-md">
          <p className="text-slate-100 text-base font-medium">The Solar Genius Pro workspace did not download.</p>
          <p className="text-slate-300 text-sm mt-2">This is usually a dropped or slow connection. Nothing you entered is lost: drafts are kept in this browser.</p>
          <button type="button" onClick={retry} className="mt-4 rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">Try again</button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <ToolLoadingState name="Solar Genius Pro" />
      {/* A stalled download never fails, so the automatic retry cannot start (seen once in
          the 2026-11-21 release run: no load after 98 s). A full reload fetches everything again. */}
      {slow ? (
        <div role="status" className="-mt-24 pb-24 text-center text-sm text-slate-300 px-4">
          <p>Still downloading the workspace — the connection is slow or a download stalled.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-3 rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">Reload page</button>
        </div>
      ) : null}
    </div>
  );
}
