'use client';

// Dev/preview helper: unregister any service worker and clear its caches so a
// stale cached build can't keep serving old chunks (which caused the recurring
// hydration mismatch on the preview). Runs once on mount.
import { useEffect } from 'react';

export default function FreshBoot() {
  useEffect(() => {
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
      }
      if (typeof caches !== 'undefined') {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
      }
    } catch { /* no-op */ }
  }, []);
  return null;
}
