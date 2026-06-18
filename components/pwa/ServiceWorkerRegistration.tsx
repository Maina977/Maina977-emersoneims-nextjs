'use client';

/**
 * SERVICE WORKER REGISTRATION
 * PWA offline support
 */

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    // Never register on localhost dev — the SW caching layer masks code
    // changes and has historically faked hydration/stale-chunk bugs.
    if (
      process.env.NODE_ENV !== 'production' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    ) {
      return;
    }

    let refreshing = false;
    // Auto-reload ONCE when a new SW takes control, so users silently get the
    // latest deploy without a blocking confirm() dialog. The guard prevents
    // reload loops (skipWaiting + clients.claim can fire controllerchange).
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // When an updated SW finishes installing alongside an existing one,
        // activate it immediately (no user prompt). sw.js uses network-first
        // for HTML, so there is no stale-content risk in doing this silently.
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch((error) => {
        console.warn('Service Worker registration failed:', error);
      });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return null;
}
