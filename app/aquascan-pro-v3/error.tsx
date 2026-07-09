'use client';

/**
 * Route-scoped error boundary for AquaScan Pro.
 *
 * AquaScan Pro is a large, code-split (ssr:false) client bundle. The #1 cause of
 * the recurring "Oops! Error" on this page is a ChunkLoadError: a browser holding
 * a stale service-worker-cached HTML document (or a chunk that 404/403'd mid-deploy)
 * tries to import a /_next/static chunk that no longer exists. A clean browser never
 * reproduces it — but the affected device keeps hitting it on every visit because the
 * bad cache survives. The global error.tsx just shows a dead-end "Oops" screen, so the
 * user is stuck.
 *
 * This boundary turns that into a one-time, automatic self-heal: clear the SW + caches
 * and hard-reload ONCE (guarded by sessionStorage so we can never loop). If the error
 * still happens after the heal, we show a manual recovery UI with the real message.
 */

import * as Sentry from '@sentry/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Bump the suffix whenever the heal logic gets stronger, so devices that already
// ran an older (weaker) heal get fresh automatic attempts with the new logic.
// v4: purge the service worker BEFORE re-fetching chunks — v3 fetched first, so
// the still-registered SW intercepted the repair and served the poisoned copy.
// v5: probe the network BEFORE healing/reloading — v4 burned both heals in
// two instant reloads while the connection was momentarily down, then dumped
// the user on the technical screen for what was just a network blip.
const HEAL_COUNT = 'aquascan-self-heal-count-v5';
const MAX_HEALS = 2;

function getHealCount(): number {
  try { return parseInt(sessionStorage.getItem(HEAL_COUNT) || '0', 10) || 0; } catch { return 0; }
}
function setHealCount(n: number): void {
  try { sessionStorage.setItem(HEAL_COUNT, String(n)); } catch {/* ignore */}
}

/**
 * Pull every /_next/static asset URL out of the error so we can repair them.
 * A ChunkLoadError message looks like:
 *   "Failed to load chunk /_next/static/chunks/5962c3274b2602e3.css?dpl=… from module …"
 */
function extractChunkUrls(err: Error & { digest?: string }): string[] {
  const text = `${err?.message || ''}\n${err?.stack || ''}`;
  const out = new Set<string>();
  const re = /\/_next\/static\/[^\s"')]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.add(m[0]);
  return [...out];
}

/**
 * THE actual repair: a browser will keep serving a broken `immutable` chunk from
 * its HTTP cache forever — clearing the service worker or Cache API does NOT touch
 * that cache, which is why a normal reload stays broken. `fetch(url,{cache:'reload'})`
 * bypasses the HTTP cache, hits the network, and OVERWRITES the cached entry with a
 * good copy. After this, the next reload loads the chunk successfully.
 */
async function repairChunks(err: Error & { digest?: string }): Promise<void> {
  const urls = extractChunkUrls(err);
  await Promise.all(
    urls.map((u) => fetch(u, { cache: 'reload', credentials: 'same-origin' }).catch(() => {})),
  );
}

/**
 * Is the failed asset actually fetchable from this device RIGHT NOW?
 * Probes the failed chunk itself (server-verified assets fail here only when
 * the device's network path is down). Waits for the browser's `online` event
 * when offline, and retries with backoff — a 3-second Wi-Fi blip should cost
 * the user 3 seconds, not a crash screen.
 */
async function chunkReachable(err: Error & { digest?: string }): Promise<boolean> {
  const probe = extractChunkUrls(err)[0] ?? '/manifest.webmanifest';
  for (let i = 0; i < 4; i++) {
    if (i) await new Promise((r) => setTimeout(r, 1200 * i));
    if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
      // Browser says offline — wait up to 8s for connectivity to return.
      const cameBack = await new Promise<boolean>((resolve) => {
        const t = setTimeout(() => resolve(navigator.onLine), 8000);
        window.addEventListener('online', () => { clearTimeout(t); resolve(true); }, { once: true });
      });
      if (!cameBack) continue;
    }
    try {
      const res = await fetch(probe, { cache: 'reload', credentials: 'same-origin' });
      if (res.ok) return true;
    } catch { /* still unreachable — retry */ }
  }
  return false;
}

function isChunkLoadError(err: Error): boolean {
  const name = err?.name || '';
  const msg = err?.message || '';
  return (
    name === 'ChunkLoadError' ||
    /Loading chunk [\d]+ failed/i.test(msg) ||
    /Loading CSS chunk/i.test(msg) ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg)
  );
}

/**
 * Remove every AquaScan-saved blob from localStorage/sessionStorage. The engine
 * persists report history, drilling outcomes, calibration and regional models
 * under `aquascan_*` keys; if any one is corrupt or from an incompatible older
 * schema, it can throw when the engine reads it — and that crash survives a cache
 * clear, so it only hits devices that have USED the tool. We scope to `aquascan_`
 * so unrelated site data (and the self-heal flag) is preserved.
 */
function clearAquaScanStorage(): void {
  for (const store of [globalThis.localStorage, globalThis.sessionStorage]) {
    try {
      const keys: string[] = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (k && k.startsWith('aquascan_')) keys.push(k);
      }
      keys.forEach((k) => store.removeItem(k));
    } catch {/* ignore */}
  }
}

async function purgeCachesAndSW(): Promise<void> {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch {/* ignore */}
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {/* ignore */}
  clearAquaScanStorage();
}

export default function AquaScanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [healing, setHealing] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    Sentry.captureException(error, {
      tags: { errorType: 'aquascan-pro-v3', chunkLoad: String(isChunkLoadError(error)) },
    });
    console.error('AquaScan Pro error:', error);

    let cancelled = false;

    const healAndReload = async () => {
      await purgeCachesAndSW();
      await repairChunks(error);
      if (cancelled) return;
      const u = new URL(window.location.href);
      u.searchParams.set('_fresh', String(Date.now()));
      window.location.replace(u.toString());
    };

    // Auto-recover up to MAX_HEALS times. ORDER MATTERS: (1) verify the network
    // path actually works — if the asset is unreachable this is a connectivity
    // blip, not a bad cache, so we show the offline screen and resume when the
    // connection returns WITHOUT spending a heal attempt (v4 burned both heals
    // reloading into a dead network). (2) Unregister the service worker and drop
    // its caches BEFORE re-fetching — a registered SW intercepts fetch() and
    // would answer the repair from the poisoned cache. (3) Re-fetch the failed
    // chunk with cache:'reload' to overwrite the HTTP-cache copy, then reload.
    // Counter-guarded so it can never loop — after MAX_HEALS, manual UI.
    const attempts = getHealCount();
    if (attempts < MAX_HEALS) {
      setHealing(true);
      (async () => {
        const reachable = await chunkReachable(error);
        if (cancelled) return;
        if (!reachable) {
          // Network is down. Don't reload into failure — wait for it to return,
          // then run the full heal automatically.
          setHealing(false);
          setOffline(true);
          window.addEventListener('online', () => {
            if (!cancelled) { setOffline(false); setHealing(true); void healAndReload(); }
          }, { once: true });
          return;
        }
        setHealCount(attempts + 1);
        await healAndReload();
      })();
    }

    return () => { cancelled = true; };
  }, [error]);

  if (healing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-5" />
          <p className="text-slate-300 text-sm">Refreshing AquaScan Pro to the latest version…</p>
        </div>
      </div>
    );
  }

  if (offline) {
    // The asset exists on the server but this device can't reach it — a
    // connection problem, not an AquaScan fault. Resumes automatically.
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-6">📡</div>
          <h2 className="text-2xl font-bold mb-3">
            Connection <span className="text-amber-400">dropped</span>
          </h2>
          <p className="text-gray-400 mb-6">
            Your internet connection interrupted while AquaScan Pro was loading.
            The moment it comes back, this page will reload itself — nothing to fix on our side.
          </p>
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-6" />
          <button
            onClick={() => {
              const u = new URL(window.location.href);
              u.searchParams.set('_fresh', String(Date.now()));
              window.location.replace(u.toString());
            }}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Retry now
          </button>
        </div>
      </div>
    );
  }

  // Healed once already and still failing — show manual recovery + the real message.
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="w-20 h-20 mx-auto mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-sky-600/20 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">💧</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4">
          AquaScan Pro <span className="text-cyan-400">couldn’t load</span>
        </h2>
        <p className="text-gray-400 mb-6">
          The button below clears this device’s AquaScan data &amp; cache and reloads the
          latest version. If it keeps failing, copy the technical details below to support.
        </p>

        {/* Always shown (prod included) so a persistent crash is finally diagnosable. */}
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
          <p className="text-red-300 text-xs uppercase tracking-wider mb-1">Technical details</p>
          <p className="text-red-400 text-sm font-mono break-all">
            {error?.name ? `${error.name}: ` : ''}{error?.message || 'Unknown error'}
          </p>
          {error?.digest && (
            <p className="text-red-400/70 text-xs font-mono mt-1 break-all">digest: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={async () => {
              setHealing(true);
              setHealCount(0);
              await purgeCachesAndSW();
              await repairChunks(error);
              const u = new URL(window.location.href);
              u.searchParams.set('_fresh', String(Date.now()));
              window.location.replace(u.toString());
            }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 rounded-lg font-semibold hover:opacity-90 transition"
          >
            🔄 Repair & reload
          </button>

          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Try again
          </button>

          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            🏠 Go Home
          </Link>
        </div>

        <p className="mt-8 text-gray-500 text-sm">
          Still stuck? Call{' '}
          <a href="tel:+254768860665" className="text-cyan-400 hover:underline">
            +254 768 860 665
          </a>
        </p>
      </div>
    </div>
  );
}
