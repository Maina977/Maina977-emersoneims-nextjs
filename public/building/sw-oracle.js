/**
 * GENERATOR ORACLE - SERVICE WORKER
 * Handles push notifications and background sync
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

const CACHE_NAME = 'generator-oracle-v1';
const OFFLINE_URL = '/offline';

// Files to cache for offline access
const STATIC_CACHE = [
  '/',
  '/generator-oracle',
  '/images/oracle-icon-192.png',
  '/images/oracle-icon-512.png',
];

// ═══════════════════════════════════════════════════════════════════════════════
// INSTALLATION
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Generator Oracle Service Worker');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_CACHE).catch((err) => {
        console.warn('[SW] Some static assets failed to cache:', err);
      });
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVATION
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Generator Oracle Service Worker');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );

  // Take control of all clients
  self.clients.claim();
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
    } catch (e) {
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
// FETCH HANDLING (Offline support)
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip API calls and external resources
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/') || url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Offline', { status: 503 });
        });
    })
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
