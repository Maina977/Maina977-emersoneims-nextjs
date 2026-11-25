/**
 * GENERATOR ORACLE - SERVICE WORKER
 * Handles push notifications and background sync
 *
 * SAFETY WITHDRAWAL 2026-11-25 (independent withdrawal review R4). Version 1 answered every
 * same-origin GET (pages and /_next chunks) cache-first from a cache name that never changed
 * ('generator-oracle-v1') and pre-cached '/' and '/generator-oracle', so a returning visitor
 * could be served the PRE-withdrawal Oracle page and scripts after a deploy. This version:
 *   - never caches or answers pages (navigations), scripts, styles or /_next/ files: those
 *     requests are not intercepted, so they always come from the network as usual;
 *   - caches only the two notification icons (all that offline alerts need);
 *   - uses a new cache name and, on activate, deletes every older 'generator-oracle-*' cache;
 *   - after taking control, reloads any open window that an old version controlled, so a
 *     stale page served by version 1 is replaced at once.
 * How an existing visitor's old worker is replaced: on the next navigation in scope the
 * browser re-fetches /sw-oracle.js (bypassing the HTTP cache for the script itself), sees the
 * bytes changed and installs this version; install calls skipWaiting(), activate calls
 * clients.claim(), deletes 'generator-oracle-v1' and reloads the windows it now controls.
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

const CACHE_PREFIX = 'generator-oracle-';
const CACHE_NAME = 'generator-oracle-v2';

// Only what offline notifications need. No pages, no scripts.
const STATIC_CACHE = [
  '/images/oracle-icon-192.png',
  '/images/oracle-icon-512.png',
];

/** True for the only requests this worker answers from its cache. */
function isCachedAsset(url) {
  return url.origin === self.location.origin && STATIC_CACHE.includes(url.pathname);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INSTALLATION
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_CACHE).catch((err) => {
        console.warn('[SW] Some notification icons failed to cache:', err);
      })
    )
  );

  // Activate immediately
  self.skipWaiting();
});

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVATION
// ═══════════════════════════════════════════════════════════════════════════════

/** Deletes older Generator Oracle caches only (other workers' caches are left alone). Resolves to how many were deleted. */
async function deleteOldOracleCaches() {
  const names = await caches.keys();
  const old = names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME);
  await Promise.all(old.map((name) => caches.delete(name)));
  return old.length;
}

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const deleted = await deleteOldOracleCaches();
    await self.clients.claim();
    // An older version may have served these windows a cached (pre-withdrawal) page: reload them.
    if (deleted > 0) {
      const windows = await self.clients.matchAll({ type: 'window' });
      await Promise.all(windows.map((client) => (client.navigate ? client.navigate(client.url).catch(() => undefined) : undefined)));
    }
  })());
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUSH NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let data = {
    title: 'Generator Oracle',
    body: 'New notification',
    icon: '/images/oracle-icon-192.png',
    badge: '/images/oracle-badge.png',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/images/oracle-icon-192.png',
    badge: data.badge || '/images/oracle-badge.png',
    tag: data.tag || 'default',
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    actions: data.actions || [],
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION CLICK HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);

  event.notification.close();

  const data = event.notification.data || {};
  let targetUrl = '/generator-oracle';

  // Handle different notification types
  switch (data.type) {
    case 'fault_alert':
      if (data.faultCode) {
        targetUrl = `/generator-oracle?fault=${data.faultCode}`;
      }
      break;
    case 'sync_complete':
      targetUrl = '/generator-oracle?tab=settings';
      break;
    case 'maintenance_reminder':
      targetUrl = '/generator-oracle?tab=maintenance';
      break;
    case 'parts_update':
      targetUrl = '/generator-oracle?tab=parts';
      break;
    default:
      targetUrl = data.url || '/generator-oracle';
  }

  // Handle action buttons
  if (event.action) {
    switch (event.action) {
      case 'view':
        // Default behavior - open the URL
        break;
      case 'dismiss':
        return; // Just close the notification
      case 'snooze':
        // Could implement snooze logic here
        return;
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes('/generator-oracle') && 'focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_CLICK', data });
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION CLOSE
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event.notification.tag);

  // Could track notification dismissals here
});

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUND SYNC
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'oracle-fault-sync') {
    event.waitUntil(syncFaultDatabase());
  }

  if (event.tag === 'oracle-feedback-sync') {
    event.waitUntil(syncFeedbackQueue());
  }
});

async function syncFaultDatabase() {
  try {
    const response = await fetch('/api/generator-oracle/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromVersion: '0.0.0' }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[SW] Fault database synced:', data.version);

      // Notify clients
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          version: data.version,
          faultCount: data.faultCount,
        });
      });
    }
  } catch (error) {
    console.error('[SW] Fault sync failed:', error);
    throw error; // Retry later
  }
}

async function syncFeedbackQueue() {
  // This would sync pending feedback from IndexedDB
  console.log('[SW] Feedback sync - not implemented');
}

// ═══════════════════════════════════════════════════════════════════════════════
// FETCH HANDLING (notification icons only)
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Pages, scripts, styles, /_next/ files and API calls are not intercepted: the network answers them.
  if (event.request.mode === 'navigate' || !isCachedAsset(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
        if (response.status === 200) cache.put(event.request, response.clone());
        return response;
      }))
    )
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options);
  }
});
