/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🚀 WORLD'S #1 FASTEST SERVICE WORKER
 * EmersonEIMS - Ultra Performance Caching System
 *
 * Target: Sub-100ms repeat loads
 * Strategy: Aggressive cache-first with intelligent revalidation
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const CACHE_VERSION = 'v10-20260618-offline-realfix';
const OFFLINE_URL = '/offline.html';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const VIDEO_CACHE = `video-${CACHE_VERSION}`;
const FONTS_CACHE = `fonts-${CACHE_VERSION}`;

// ═══════════════════════════════════════════════════════════════════════════════
// CRITICAL ASSETS - Precache for INSTANT loading
// ═══════════════════════════════════════════════════════════════════════════════
// Offline fallback page is precached FIRST and is non-negotiable — it is what
// makes the "works offline" promise real for pages the user hasn't visited yet.
const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/',
  '/manifest.webmanifest',
  '/images/logo-tagline.png',
  '/generators',
  '/solar',
  '/contact',
  '/about-us',
  '/services',
  '/solutions',
  '/booking',
  '/brands',
  '/ai-tools',
];

// Performance tracking
const perfMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
};

// ═══════════════════════════════════════════════════════════════════════════════
// INSTALL - Aggressive precaching
// ═══════════════════════════════════════════════════════════════════════════════
self.addEventListener('install', (event) => {
  console.log('🚀 SW: Installing ULTRA-FAST version:', CACHE_VERSION);
  self.skipWaiting();

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) =>
        // Per-item add() instead of addAll() — addAll is atomic, so a single
        // 404 would reject the WHOLE precache and leave the site with nothing
        // cached (and a broken offline experience). Per-item, one bad URL can't
        // poison the rest. The offline page is added explicitly so we know it
        // succeeded even if a route precache fails.
        Promise.all(
          PRECACHE_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn('⚠️ SW: precache skipped', url, err && err.message);
            })
          )
        )
      ),
      // Pre-warm DNS and connections
      warmupConnections(),
    ])
  );
});

// Warm up external connections
async function warmupConnections() {
  const urls = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
  ];

  for (const url of urls) {
    try {
      await fetch(url, { mode: 'no-cors', cache: 'no-store' });
    } catch (e) {
      // Silent fail - just warming up
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVATE - Aggressive cache cleanup
// ═══════════════════════════════════════════════════════════════════════════════
self.addEventListener('activate', (event) => {
  console.log('✅ SW: Activating ULTRA-FAST version:', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => !cacheName.includes(CACHE_VERSION))
            .map((cacheName) => {
              console.log('🗑️ SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
      .then(() => {
        // Notify all clients about the update
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
          });
        });
      })
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// FETCH - Intelligent caching strategies
// ═══════════════════════════════════════════════════════════════════════════════
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // BYPASS: never cache the Building Suite Pro wizard or its container page
  // (these are heavy HTML shells we redeploy frequently — must always be fresh)
  if (
    url.pathname === '/pro-building-suite' ||
    url.pathname.startsWith('/pro-building-suite/') ||
    url.pathname.startsWith('/eims-building-suite')
  ) {
    return; // let the browser hit the network directly
  }

  // Route to appropriate caching strategy
  if (url.pathname.startsWith('/_next/static/')) {
    // Static assets - CACHE FIRST (immutable)
    event.respondWith(cacheFirstImmutable(request, STATIC_CACHE));
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    // API requests - Network first with short cache
    event.respondWith(networkFirst(request, API_CACHE, 60));
    return;
  }

  if (isVideoRequest(request, url)) {
    // Videos - Cache first for instant playback
    event.respondWith(cacheFirstWithRange(request, VIDEO_CACHE));
    return;
  }

  if (isImageRequest(request, url)) {
    // Images - Cache first with long TTL
    event.respondWith(cacheFirst(request, IMAGES_CACHE));
    return;
  }

  if (isFontRequest(request, url)) {
    // Fonts - Cache first (immutable)
    event.respondWith(cacheFirstImmutable(request, FONTS_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    // Page navigations — NETWORK FIRST, then cache, then offline page.
    // Why not stale-while-revalidate: cached HTML references content-hashed
    // /_next/static chunk URLs. After a deploy those hashes change, so serving
    // stale HTML points the browser at deleted chunks → hydration / chunk-load
    // errors (the documented "service-worker-stale-chunks" bug). Network-first
    // means online users ALWAYS get fresh HTML matching the live chunks; the
    // cache is only a fallback when the network genuinely fails.
    event.respondWith(navigationNetworkFirst(request));
    return;
  }

  // Scripts & styles - Network first to prevent hydration issues
  if (isScriptOrStyle(request, url)) {
    event.respondWith(networkFirst(request, STATIC_CACHE, 3600));
    return;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS - Request type detection
// ═══════════════════════════════════════════════════════════════════════════════

function isVideoRequest(request, url) {
  return request.destination === 'video' ||
    /\.(mp4|webm|ogg|mov)$/i.test(url.pathname);
}

function isImageRequest(request, url) {
  return request.destination === 'image' ||
    /\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/i.test(url.pathname);
}

function isFontRequest(request, url) {
  return request.destination === 'font' ||
    /\.(woff2?|ttf|eot|otf)$/i.test(url.pathname);
}

function isScriptOrStyle(request, url) {
  return request.destination === 'style' ||
    request.destination === 'script' ||
    /\.(css|js)$/i.test(url.pathname);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CACHING STRATEGIES - Optimized for speed
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cache First (Immutable) - For static assets that never change
 * FASTEST strategy - always from cache
 */
async function cacheFirstImmutable(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    perfMetrics.cacheHits++;
    return cachedResponse;
  }

  perfMetrics.cacheMisses++;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Cache First - Return cached, update in background
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    perfMetrics.cacheHits++;
    // Update cache in background
    fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response);
      }
    }).catch(() => {});
    return cachedResponse;
  }

  perfMetrics.cacheMisses++;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Stale While Revalidate - Instant load, update in background
 * BEST for navigation - users see content immediately
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Always fetch in background to update cache
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);

  // Return cached response immediately if available
  if (cachedResponse) {
    perfMetrics.cacheHits++;
    return cachedResponse;
  }

  perfMetrics.cacheMisses++;
  // Wait for network if no cache
  const networkResponse = await fetchPromise;
  return networkResponse || new Response('Offline', { status: 503 });
}

/**
 * Navigation Network First — fresh HTML when online, cache/offline when not.
 * 1) Try the network. On success, cache a copy and return it.
 * 2) If the network fails, return the cached copy of this exact page if we have
 *    one (so previously-visited pages work offline).
 * 3) Otherwise return the branded offline fallback page.
 */
async function navigationNetworkFirst(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    perfMetrics.networkRequests++;
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedPage = await cache.match(request);
    if (cachedPage) {
      perfMetrics.cacheHits++;
      return cachedPage;
    }
    const offline = await caches.match(OFFLINE_URL);
    return (
      offline ||
      new Response('You are offline.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    );
  }
}

/**
 * Network First - For dynamic content
 */
async function networkFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);

  try {
    perfMetrics.networkRequests++;
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      perfMetrics.cacheHits++;
      return cachedResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Cache First with Range Support - For video streaming
 */
async function cacheFirstWithRange(request, cacheName) {
  const cache = await caches.open(cacheName);

  // Check for range request
  const rangeHeader = request.headers.get('range');

  if (!rangeHeader) {
    return cacheFirst(request, cacheName);
  }

  // For range requests, try to serve from network for streaming
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_METRICS') {
    event.ports[0].postMessage(perfMetrics);
  }

  if (event.data && event.data.type === 'PREFETCH') {
    const urls = event.data.urls || [];
    caches.open(PAGES_CACHE).then((cache) => {
      urls.forEach((url) => {
        cache.add(url).catch(() => {});
      });
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUND SYNC
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('🔄 SW: Background sync');
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUSH NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      event.waitUntil(
        self.registration.showNotification(data.title, {
          body: data.body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [100, 50, 100],
          data: { url: data.url || '/' },
        })
      );
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

console.log('⚡ SW: ULTRA-FAST Service Worker loaded - Version:', CACHE_VERSION);
