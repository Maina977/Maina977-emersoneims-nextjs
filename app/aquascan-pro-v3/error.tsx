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
const HEAL_COUNT = 'aquascan-self-heal-count-v3';
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

  useEffect(() => {
    Sentry.captureException(error, {
      tags: { errorType: 'aquascan-pro-v3', chunkLoad: String(isChunkLoadError(error)) },
    });
    console.error('AquaScan Pro error:', error);

    let cancelled = false;
    const attempts = getHealCount();

    // Auto-recover up to MAX_HEALS times: re-fetch the failed chunk with
    // cache:'reload' to OVERWRITE the broken HTTP-cache copy, drop SW/Cache-API
    // state, then hard-reload onto the repaired assets. Counter-guarded so it can
    // never loop forever — after MAX_HEALS it falls through to the manual UI.
    if (attempts < MAX_HEALS) {
      setHealing(true);
      setHealCount(attempts + 1);
      (async () => {
        await repairChunks(error);
        await purgeCachesAndSW();
      })().finally(() => {
        if (!cancelled) {
          const u = new URL(window.location.href);
          u.searchParams.set('_fresh', String(Date.now()));
          window.location.replace(u.toString());
        }
      });
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
              await repairChunks(error);
              await purgeCachesAndSW();
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
