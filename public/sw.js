/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🚀 WORLD'S #1 FASTEST SERVICE WORKER
 * EmersonEIMS - Ultra Performance Caching System
 *
 * Target: Sub-100ms repeat loads
 * Strategy: Aggressive cache-first with intelligent revalidation
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const CACHE_VERSION = 'v5-20260223-ultrafast';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const VIDEO_CACHE = `video-${CACHE_VERSION}`;
const FONTS_CACHE = `fonts-${CACHE_VERSION}`;

// ═══════════════════════════════════════════════════════════════════════════════
// CRITICAL ASSETS - Precache for INSTANT loading
// ═══════════════════════════════════════════════════════════════════════════════
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/images/logo-tagline.png',
  '/generators',
  '/solar',
  '/contact',
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
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('⚠️ SW: Some assets failed to precache:', err);
          return Promise.resolve();
        });
      }),
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
    // Page navigations - Stale while revalidate for instant loads
    event.respondWith(staleWhileRevalidate(request, PAGES_CACHE));
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
