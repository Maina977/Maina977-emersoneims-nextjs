/**
 * ADVANCED SERVICE WORKER FOR MAXIMUM PERFORMANCE
 * Tesla-level caching and offline support
 * 
 * ⚠️ IMPORTANT: Version updated to force cache clear
 */

const CACHE_VERSION = 'v4-20260119-ultrafast';
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-cache-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-cache-${CACHE_VERSION}`;
const API_CACHE = `api-cache-${CACHE_VERSION}`;
const VIDEO_CACHE = `video-cache-${CACHE_VERSION}`;

// Static assets to precache - Critical for instant loading
const PRECACHE_ASSETS = [
  '/manifest.webmanifest',
  '/favicon.ico',
  '/images/logo-tagline.png',
];

// Install event - SKIP WAITING IMMEDIATELY
self.addEventListener('install', (event) => {
  console.log('🔄 SW: Installing new version:', CACHE_VERSION);
  // Skip waiting immediately to take control
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('✅ SW: Precaching minimal assets');
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('⚠️ SW: Some assets failed to precache:', err);
          return Promise.resolve();
        });
      })
  );
});

// Activate event - AGGRESSIVELY clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ SW: Activating new version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        console.log('🗑️ SW: Clearing ALL old caches');
        return Promise.all(
          cacheNames
            .filter((cacheName) => !cacheName.includes(CACHE_VERSION))
            .map((cacheName) => {
              console.log('🗑️ SW: Deleting cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ SW: Taking control of all clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle caching strategies
// CRITICAL FIX: Using network-first for JS/CSS to prevent hydration mismatches
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Skip Next.js internal requests - USE NETWORK FIRST for bundles
  if (url.pathname.startsWith('/_next/')) {
    // CHANGED: Network-first for _next/static to prevent stale JS
    if (url.pathname.includes('/_next/static/')) {
      event.respondWith(networkFirst(request, STATIC_CACHE, 60 * 60));
    }
    return;
  }

  // Handle API requests with network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE, 5 * 60));
    return;
  }

  // Handle videos with cache-first for INSTANT playback
  if (
    request.destination === 'video' ||
    /\.(mp4|webm|ogg|mov)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, VIDEO_CACHE, 365 * 24 * 60 * 60));
    return;
  }

  // Handle images with cache-first (these don't cause hydration issues)
  if (
    request.destination === 'image' ||
    /\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, IMAGES_CACHE, 30 * 24 * 60 * 60));
    return;
  }

  // Handle fonts with cache-first (these don't cause hydration issues)
  if (
    request.destination === 'font' ||
    /\.(woff2?|ttf|eot|otf)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 365 * 24 * 60 * 60));
    return;
  }

  // Handle navigation requests with network-first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGES_CACHE, 60 * 60));
    return;
  }

  // CHANGED: Network-first for JS/CSS to prevent hydration issues
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    /\.(css|js)$/i.test(url.pathname)
  ) {
    event.respondWith(networkFirst(request, STATIC_CACHE, 60 * 60));
    return;
  }
});

// Cache-first strategy helper
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('⚠️ SW: Network request failed:', request.url);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy helper
async function networkFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    console.warn('⚠️ SW: Network and cache failed:', request.url);
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('🔄 Syncing data in background');
  // Handle offline form submissions, analytics, etc.
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
          url: data.url || '/',
        },
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ SW: Service Worker loaded successfully');
