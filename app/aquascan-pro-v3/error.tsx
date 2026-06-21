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

const HEAL_FLAG = 'aquascan-self-heal-attempted';

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
    const alreadyHealed = (() => {
      try { return sessionStorage.getItem(HEAL_FLAG) === '1'; } catch { return false; }
    })();

    // Auto self-heal once for ANY first failure: clear the stale SW/cache that
    // points at dead chunks, then hard-reload to fetch the live build. A stale
    // cache is by far the dominant cause here, and the heal is harmless for other
    // errors. Guarded by sessionStorage so it can never loop.
    if (!alreadyHealed) {
      setHealing(true);
      try { sessionStorage.setItem(HEAL_FLAG, '1'); } catch {/* ignore */}
      purgeCachesAndSW().finally(() => {
        if (!cancelled) {
          // Cache-busting reload so even an intermediary cache can't re-serve stale HTML.
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
          This is almost always an out-of-date cached copy on this device. The button below
          clears it and reloads the latest version.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
            <p className="text-red-400 text-sm font-mono break-all">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={async () => {
              setHealing(true);
              try { sessionStorage.removeItem(HEAL_FLAG); } catch {/* ignore */}
              await purgeCachesAndSW();
              const u = new URL(window.location.href);
              u.searchParams.set('_fresh', String(Date.now()));
              window.location.replace(u.toString());
            }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-sky-600 rounded-lg font-semibold hover:opacity-90 transition"
          >
            🔄 Clear cache & reload
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
