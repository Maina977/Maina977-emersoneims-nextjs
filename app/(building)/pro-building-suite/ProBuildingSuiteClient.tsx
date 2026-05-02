'use client';

/**
 * PRO BUILDING SUITE — NEW INTERACTIVE WIZARD
 *
 * Mounts the full 540 KB "Global Construction Intelligence Platform" UI
 * (28 countries, BIM, 3D, drawings, BOQ, permits, frame analysis, etc.)
 * from G:\EMERSONEIMS BUILDING SUITE PRO\interactive_wizard.html as a
 * SAME-ORIGIN iframe so its embedded fetch() calls to /api/* reach the
 * Next.js API routes we are progressively porting from the original Flask
 * backend (lib/building/wizardApi/*).
 */

import { useEffect, useState } from 'react';

// One-shot stale-cache kicker. If a visitor still has the OLD service worker
// (which stale-while-revalidates this page back to the previous wizard URL),
// nuke ALL caches + unregister, then reload once. Marked in sessionStorage so
// it never loops. Bump the KEY date whenever the wizard file is replaced.
function killOldServiceWorkerOnce() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  const KEY = 'eims-bs-cache-cleared-20260503';
  if (sessionStorage.getItem(KEY)) return;
  Promise.all([
    navigator.serviceWorker.getRegistrations().then((regs) =>
      Promise.all(regs.map((r) => r.unregister()))
    ),
    'caches' in window
      ? caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      : Promise.resolve(),
  ]).then(() => {
    sessionStorage.setItem(KEY, '1');
    location.reload();
  });
}

export default function ProBuildingSuiteClient() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    killOldServiceWorkerOnce();
    const t = window.setTimeout(() => setLoaded(true), 6000); // safety hide (wizard typically ready in 2-3s)
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        // 100dvh handles iOS Safari's collapsing URL bar correctly on mobile/tablet
        // (100vh would leave a blank strip when the bar retracts). 4rem accounts for the global fixed nav.
        height: 'calc(100dvh - 4rem)',
        minHeight: 'calc(100vh - 4rem)',
        background: '#0a0e27',
        overflow: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64b5f6',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: '3px solid rgba(100,181,246,0.25)',
              borderTopColor: '#64b5f6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ marginTop: 16, fontSize: 14, fontWeight: 600 }}>Loading Building Suite Pro…</p>
          <p style={{ marginTop: 4, fontSize: 12, opacity: 0.7 }}>
            Global Construction Intelligence Platform · 28 Countries
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <iframe
        src="/eims-building-suite-v20260503.html"
        title="EMERSON EIMS Building Suite Pro"
        onLoad={() => setLoaded(true)}
        loading="eager"
        // @ts-expect-error fetchpriority is a valid HTML attr but not yet typed in React 19
        fetchpriority="high"
        allow="accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; microphone; payment *; web-share"
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      />
    </div>
  );
}
