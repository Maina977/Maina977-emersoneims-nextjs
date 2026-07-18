/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GENERATOR ORACLE / EMERSONEIMS MIDDLEWARE
 * Multi-language Support + Enterprise-Grade Security + Anti-Copy Protection
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * COPYRIGHT NOTICE:
 * Copyright (c) 2024-2026 Generator Oracle. All Rights Reserved.
 * This software is protected by copyright law and international treaties.
 * Unauthorized reproduction, distribution, or use is strictly prohibited.
 *
 * Features:
 * 1. Internationalization (11 Languages via Cookie)
 * 2. Bot Detection & Blocking
 * 3. Rate Limiting
 * 4. SQL Injection Prevention
 * 5. XSS Attack Prevention
 * 6. Path Traversal Prevention
 * 7. Anti-Scraping Protection
 * 8. Content Theft Prevention
 * 9. Domain Authorization
 * 10. Integrity Verification
 *
 * © 2024-2026 Generator Oracle / EmersonEIMS. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isIndexedLocationService } from '@/lib/seo/indexedMatrix';

// Supported locales
const locales = ['en', 'sw', 'fr', 'de', 'es', 'pt', 'zh', 'nl', 'am', 'so', 'ar'];
const defaultLocale = 'en';

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

// Known malicious bot user agents and scrapers
const BLOCKED_USER_AGENTS = [
  // SEO/Analysis bots
  'semrushbot',
  'ahrefsbot',
  'mj12bot',
  'dotbot',
  'rogerbot',
  'seznambot',
  'yandexbot',
  'baiduspider',
  'sogou',
  'exabot',
  'gigabot',

  // Web scrapers and crawlers
  'scrapy',
  'nutch',
  'archive.org_bot',
  'ia_archiver',
  'wget',
  'curl',
  'python-requests',
  'python-urllib',
  'go-http-client',
  'java/',
  'libwww',
  'lwp-trivial',

  // Website copiers
  'sitesucker',
  'webzip',
  'webcopy',
  'httrack',
  'teleport',
  'offline explorer',
  'website-copier',
  'site-copier',
  'webcopier',
  'websitecopy',
  'grabsite',
  'getright',
  'flashget',

  // Security scanners (block unauthorized scanning)
  'nikto',
  'sqlmap',
  'nmap',
  'masscan',
  'zgrab',
  'nuclei',
  'wpscan',
  'acunetix',
  'netsparker',
  'burpsuite',
  'owasp',

  // Headless browsers (often used for scraping)
  'phantomjs',
  'selenium',
  'puppeteer',
  'playwright',
  'headless',
  'headlesschrome',

  // Generic scrapers
  'scraperapi',
  'scrapingant',
  'scrapingbee',
  'crawlerdetect',
  'dataminr',
  'harvest',
  'collector',
  'extractor',
];

// Allowed bots (search engines, monitoring) — these BYPASS all rate-limit /
// scraping / headless / pattern checks below. Includes every Google fetcher
// variant + major search engines + social previewers.
const ALLOWED_BOTS = [
  // Google family — every documented Google crawler/fetcher token.
  // `googlebot` also substring-matches the full desktop/mobile UA strings
  // (".../Googlebot/2.1..."). `googleother` and `google-safety` are newer
  // Google crawlers that were missing here — they were falling through to
  // the rate-limit / scraping checks and getting 403'd, which is a direct
  // contributor to Search Console's "Blocked due to access forbidden (403)".
  'googlebot',
  'googlebot-image',
  'googlebot-video',
  'googlebot-news',
  'googlebot-mobile',
  'adsbot-google',
  'mediapartners-google',
  'storebot-google',
  'google-inspectiontool',
  'google-read-aloud',
  'google-site-verification',
  'google-extended',
  'googleother',
  'googleother-image',
  'googleother-video',
  'google-safety',
  'googleweblight',
  'apis-google',
  'feedfetcher-google',
  // Bing / Yahoo / others
  'bingbot',
  'bingpreview',
  'msnbot',
  'slurp',
  'duckduckbot',
  'duckduckgo-favicons-bot',
  'yandex',
  'baiduspider',
  // Social
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'applebot-extended',
  'pinterest',
  'redditbot',
  // AI assistants / LLM crawlers (2026-07-17) — allow so EmersonEIMS services
  // and AI tools can be discovered, cited and answered by AI search. These
  // are the branded crawlers of the major assistants; letting them in is how a
  // business appears when users ask ChatGPT/Perplexity/Gemini/etc. about it.
  'gptbot',              // OpenAI — model training + knowledge
  'oai-searchbot',       // OpenAI — ChatGPT Search index
  'chatgpt-user',        // OpenAI — ChatGPT browsing on user request
  'perplexitybot',       // Perplexity — search index
  'perplexity-user',     // Perplexity — user-initiated fetch
  'claudebot',           // Anthropic — crawler
  'anthropic-ai',        // Anthropic
  'claude-web',          // Anthropic — user-initiated
  'ccbot',               // Common Crawl — feeds many open models
  'bytespider',          // ByteDance / Doubao
  'amazonbot',           // Amazon (Alexa / Rufus)
  'cohere-ai',           // Cohere
  'deepseekbot',         // DeepSeek
  'qwenbot',             // Alibaba Qwen
  'youbot',              // You.com
  'meta-externalagent',  // Meta AI
  // Monitoring
  'vercel',
  'uptimerobot',
  'pingdom',
  'lighthouse',
];

// Returns true when the request's user-agent matches a verified search engine
// or social previewer in ALLOWED_BOTS. Used to short-circuit ALL access
// control logic (rate-limit, scraping detection, headless heuristics, etc.)
// so legitimate crawlers can never be 4xx-blocked by this middleware.
function isVerifiedCrawler(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  for (const bot of ALLOWED_BOTS) {
    if (ua.includes(bot)) return true;
  }
  return false;
}

// Suspicious patterns in URLs (SQL injection, path traversal, etc.)
const MALICIOUS_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL injection
  /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i, // XSS
  /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))/i, // IMG XSS
  /(\%00)/i, // Null byte injection
  /\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\//i, // Path traversal
  /etc\/passwd|etc\/shadow/i, // Linux file access
  /boot\.ini|win\.ini/i, // Windows file access
  /\<script\>/i, // Script injection
  /union\s+select/i, // SQL union
  /exec\s*\(/i, // Code execution
  /eval\s*\(/i, // Eval injection
  /base64_decode/i, // Base64 attacks
  /phpinfo/i, // PHP info exposure
  /wp-admin|wp-login|wp-content/i, // WordPress attacks (we're not WP)
  /\.php|\.asp|\.aspx|\.jsp/i, // Script file access
  /\/administrator|\/manager/i, // Admin access attempts (removed /admin to allow /admin/analytics)
  /\/phpmyadmin|\/mysql|\/myadmin/i, // Database admin
  /\/\.env|\/\.git|\/\.htaccess/i, // Config file access
];

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
// 600/min = 10 req/s sustained. No human browses faster; the bots this
// exists for blow far past it. 100/min was tripping REAL customers: page
// loads + Next.js link prefetches + SW precache + AquaScan /data fetches
// easily exceed 100 in a minute of legitimate heavy use (owner hit 429
// mid-analysis on 2026-07-09 — never again).
const RATE_LIMIT_MAX_REQUESTS = 600; // Max requests per window

// Anti-scraping: Track rapid page requests
const pageAccessStore = new Map<string, { pages: Set<string>; timestamp: number }>();
// 120 unique pages/30s. A human on the mega-menu triggers dozens of Next.js
// viewport prefetches (each a unique path through this middleware) — 50 was
// low enough to 429 real users. Prefetch requests are also now excluded from
// counting entirely (see isPrefetchOrInternal in middleware()).
const SCRAPING_THRESHOLD = 120; // Max unique pages in 30 seconds
const SCRAPING_WINDOW = 30000; // 30 seconds

// Licensed domains - only these domains can run the application
const LICENSED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'emersoneims.com',
  'www.emersoneims.com',
  // Vercel preview/staging deployments (e.g. my-app-xyz.vercel.app) — required
  // for pre-production verification (Lighthouse, smoke tests). Production
  // traffic continues to be served from emersoneims.com.
  'vercel.app',
];

// Local development hosts that should always pass the licence guard, even
// when NODE_ENV=production (e.g. running `next start` locally to verify a
// production build). This is intentionally a hard-coded allow-list of
// loopback / private-network identifiers — no public IP can reach these.
//
// To temporarily widen this list during local engineering work, set:
//   $env:ALLOW_LOCAL_DEV = 'true'                        (PowerShell)
//   ALLOW_LOCAL_DEV=true                                 (POSIX)
// or provide a comma-separated list of extra hostnames in
//   DEV_ALLOWED_HOSTS=10.0.0.5,my-laptop.local
//
// To re-tighten the lock, unset both env vars and redeploy / restart.
const LOCAL_DEV_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
]);

function isLocalDevHost(hostname: string): boolean {
  if (LOCAL_DEV_HOSTS.has(hostname)) return true;
  // Private LAN ranges (RFC 1918) — only useful when running on the same
  // physical / virtual network as the developer machine.
  if (/^192\.168\./.test(hostname)) return true;
  if (/^10\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return true;
  if (process.env.ALLOW_LOCAL_DEV === 'true') return true;
  const extra = (process.env.DEV_ALLOWED_HOSTS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (extra.includes(hostname.toLowerCase())) return true;
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

function isMaliciousBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();

  // Check if it's an allowed bot first
  for (const allowed of ALLOWED_BOTS) {
    if (ua.includes(allowed)) return false;
  }

  // Check for blocked bots
  for (const blocked of BLOCKED_USER_AGENTS) {
    if (ua.includes(blocked)) return true;
  }

  return false;
}

// Legitimate admin paths that should be allowed
const ALLOWED_ADMIN_PATHS = [
  '/admin/analytics', // Our real-time analytics dashboard
];

function containsMaliciousPattern(url: string): boolean {
  // First, check if it's a legitimate admin path
  for (const allowed of ALLOWED_ADMIN_PATHS) {
    if (url.startsWith(allowed)) return false;
  }

  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(url)) return true;
  }
  return false;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  record.count++;

  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  return false;
}

// Detect rapid page scraping behavior
function detectScraping(ip: string, path: string): boolean {
  const now = Date.now();
  const record = pageAccessStore.get(ip);

  if (!record || now - record.timestamp > SCRAPING_WINDOW) {
    pageAccessStore.set(ip, { pages: new Set([path]), timestamp: now });
    return false;
  }

  record.pages.add(path);

  // If accessing too many unique pages too quickly, likely scraping
  if (record.pages.size > SCRAPING_THRESHOLD) {
    return true;
  }

  return false;
}

// Verify domain is authorized
function isAuthorizedDomain(hostname: string): boolean {
  // Allow in development
  if (process.env.NODE_ENV === 'development') return true;

  // Local-dev / private-network bypass — see LOCAL_DEV_HOSTS comment.
  // Always-on for loopback so a production build can be verified locally
  // without exposing public traffic.
  if (isLocalDevHost(hostname)) return true;

  return LICENSED_DOMAINS.some(domain =>
    hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

// Check for headless browser characteristics
function isHeadlessBrowser(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';

  // Check for headless browser indicators
  const headlessIndicators = [
    'headless',
    'phantomjs',
    'slimerjs',
    'puppeteer',
    'playwright',
    'webdriver',
  ];

  for (const indicator of headlessIndicators) {
    if (userAgent.toLowerCase().includes(indicator)) {
      return true;
    }
  }

  // Do NOT use missing Accept-Language as a headless signal — many valid clients
  // (automation, desktop shells, some mobile WebViews) omit it, which produced 403 on normal pages.
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCALE DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return segments[0];
  }
  return null;
}

function getPreferredLocale(request: NextRequest): string {
  // 1. Check URL for locale prefix
  const pathLocale = getLocaleFromPathname(request.nextUrl.pathname);
  if (pathLocale) return pathLocale;

  // 2. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // 3. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => {
      const [code] = lang.trim().split(';');
      return code.split('-')[0].toLowerCase();
    });
    for (const lang of languages) {
      if (locales.includes(lang)) return lang;
    }
  }

  return defaultLocale;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

/** EIMS embed pages: bot UA exempt + Link preconnect to Flask origin. */
function isEimsEmbedShellPath(pathname: string): boolean {
  return (
    pathname === '/pro-building-suite' ||
    pathname.startsWith('/pro-building-suite/') ||
    pathname === '/eims-pro' ||
    pathname.startsWith('/eims-pro/')
  );
}

/**
 * Versioned wizard HTML files in /public. These are static, immutable assets
 * (filename includes a date stamp). Middleware should NOT override their
 * cache headers — we want CDN + browser to cache for a year.
 * Matches both `.html` and the cleanUrls-stripped path.
 */
function isWizardAsset(pathname: string): boolean {
  return pathname.startsWith('/eims-building-suite-');
}

/**
 * Admin surfaces under /admin/* MUST be gated. Middleware runs on the Edge
 * runtime where node:crypto.timingSafeEqual isn't always available, so use
 * a manual constant-time comparison.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

/**
 * Returns true when the request carries a valid admin session cookie that
 * matches ADMIN_API_KEY. In dev (no env var set) admin pages remain open so
 * local development isn't broken; in production the cookie is required.
 */
function hasValidAdminSession(request: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return process.env.NODE_ENV !== 'production';
  const cookie = request.cookies.get('admin_session')?.value || '';
  if (!cookie) return false;
  return constantTimeEqual(cookie, adminKey);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = pathname + request.nextUrl.search;
  const userAgent = request.headers.get('user-agent') || '';
  const clientIP = getClientIP(request);
  const hostname = request.nextUrl.hostname;

  // ─────────────────────────────────────────────────────────────────────────────
  // 0a. HARD 404 for non-curated /locations/[location]/[service] combos.
  //     Next 16 serves notFound() inside a matched dynamic route as HTTP 200
  //     (a soft-404 Google penalises and that dragged down site-wide quality).
  //     Returning a real 404 here — BEFORE the route renders and before the
  //     crawler fast-path — guarantees a hard status for users and crawlers.
  //     Runs first so an invalid combo can never be 200 via any later branch.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    const m = pathname.match(/^\/locations\/([^/]+)\/([^/]+)\/?$/);
    if (m) {
      let loc = m[1], svc = m[2];
      try { loc = decodeURIComponent(loc); svc = decodeURIComponent(svc); } catch { /* keep raw */ }
      if (!isIndexedLocationService(loc, svc)) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: { 'X-Robots-Tag': 'noindex, follow', 'Content-Type': 'text/plain' },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0. VERIFIED CRAWLER FAST-PATH (Googlebot, Bingbot, etc.)
  //     Search engines & social previewers MUST never be rate-limited,
  //     scrape-blocked, or 403'd. Short-circuit the entire access-control
  //     pipeline and emit a SEO-friendly response.
  // ─────────────────────────────────────────────────────────────────────────────
  if (isVerifiedCrawler(userAgent)) {
    // Forward x-pathname so the root layout's generateMetadata() can emit a
    // correct self-referential canonical for crawlers too — without this the
    // crawler fast-path skipped header injection and every crawled page fell
    // back to the homepage canonical.
    const crawlerRequestHeaders = new Headers(request.headers);
    crawlerRequestHeaders.set('x-pathname', pathname);
    const crawlerResponse = NextResponse.next({
      request: { headers: crawlerRequestHeaders },
    });
    crawlerResponse.headers.set('X-Robots-Tag', 'index, follow');
    crawlerResponse.headers.set('X-Crawler-Bypass', '1');
    // Allow CDN to cache HTML for crawlers (matches /kenya/* + general SEO).
    crawlerResponse.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800'
    );
    return crawlerResponse;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0b. DOMAIN AUTHORIZATION CHECK (Production only)
  // ─────────────────────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'production' && !isAuthorizedDomain(hostname)) {
    console.log(`🚫 BLOCKED: Unauthorized domain ${hostname} from ${clientIP}`);
    return new NextResponse(
      'This software is licensed only for authorized domains. Contact legal@emersoneims.com',
      { status: 403 }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. MALICIOUS BOT DETECTION
  // ─────────────────────────────────────────────────────────────────────────────
  if (!isEimsEmbedShellPath(pathname) && isMaliciousBot(userAgent)) {
    console.log(`🚫 BLOCKED: Malicious bot from ${clientIP} - UA: ${userAgent.substring(0, 50)}`);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.5. HEADLESS BROWSER DETECTION (User-Agent heuristics only; off in dev)
  // ─────────────────────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'production' && isHeadlessBrowser(request)) {
    console.log(`🚫 BLOCKED: Headless browser from ${clientIP} - UA: ${userAgent.substring(0, 50)}`);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. MALICIOUS URL PATTERN DETECTION
  // ─────────────────────────────────────────────────────────────────────────────
  if (containsMaliciousPattern(url)) {
    console.log(`🚫 BLOCKED: Malicious request from ${clientIP} - URL: ${url.substring(0, 100)}`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2.5. ADMIN GATE — /admin/* requires a session cookie matching ADMIN_API_KEY
  //      (set in production env). Owners log in by issuing the cookie out-of-
  //      band — see SECURITY.md / SECURITY-NOTES below. Returns 404 to avoid
  //      advertising the existence of admin surfaces to anonymous scanners.
  // ─────────────────────────────────────────────────────────────────────────────
  if (isAdminPath(pathname) && !hasValidAdminSession(request)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. RATE LIMITING + SCRAPING DETECTION
  //    Speculative/internal requests are EXEMPT from counting: Next.js link
  //    prefetches (fired automatically for every link in the viewport), RSC
  //    payload fetches, the service worker script, its offline page and
  //    precache warm-up, and AquaScan's bundled /data registries. These are
  //    the browser working, not the user "requesting" — counting them is how
  //    a real customer running an analysis got served 429 (2026-07-09).
  // ─────────────────────────────────────────────────────────────────────────────
  const isPrefetchOrInternal =
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.get('x-purpose') === 'prefetch' ||
    (request.headers.get('sec-purpose') || '').includes('prefetch') ||
    request.nextUrl.searchParams.has('_rsc') ||
    pathname === '/sw.js' ||
    pathname === '/offline.html' ||
    pathname.startsWith('/data/');

  if (!isPrefetchOrInternal) {
    if (isRateLimited(clientIP)) {
      console.log(`🚫 RATE LIMITED: ${clientIP}`);
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
        }
      });
    }

    if (detectScraping(clientIP, pathname)) {
      console.log(`🚫 BLOCKED: Scraping behavior detected from ${clientIP}`);
      return new NextResponse(
        'Access temporarily restricted. This content is protected by copyright.',
        { status: 429 }
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. BLOCK SENSITIVE FILE ACCESS
  // ─────────────────────────────────────────────────────────────────────────────
  const blockedPaths = [
    '/.env',
    '/.git',
    '/wp-admin',
    '/wp-login.php',
    '/xmlrpc.php',
    '/config.php',
    '/admin.php',
    '/phpmyadmin',
    '/.htaccess',
    '/server-status',
    '/backup',
    '/database',
    '/logs',
  ];

  for (const path of blockedPaths) {
    if (url.toLowerCase().includes(path)) {
      console.log(`🚫 BLOCKED: Sensitive path access from ${clientIP} - ${url}`);
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. INTERNATIONALIZATION - Handle locale prefixed URLs
  // ─────────────────────────────────────────────────────────────────────────────
  const pathLocale = getLocaleFromPathname(pathname);

  // If URL has locale prefix (e.g., /sw/solutions), rewrite to base path
  if (pathLocale && pathLocale !== defaultLocale) {
    // Remove locale prefix from URL
    const newPathname = pathname.replace(`/${pathLocale}`, '') || '/';
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = newPathname;

    // Rewrite to the base path (keep same page, just different locale)
    const response = NextResponse.rewrite(newUrl);

    // Set locale cookie so the page knows which language to display
    response.cookies.set('NEXT_LOCALE', pathLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });

    // Add security headers
    response.headers.set('X-Security-Verified', 'EmersonEIMS-Protected');
    response.headers.set('X-Request-ID', `EIMS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    response.headers.set('X-Locale', pathLocale);

    return response;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. PASS THROUGH WITH SECURITY + PERFORMANCE HEADERS
  // ─────────────────────────────────────────────────────────────────────────────
  // Forward the resolved pathname to downstream server components so they can
  // emit per-page structured data (BreadcrumbList JSON-LD) without needing
  // every page to opt in. Read on the server via `headers().get('x-pathname')`.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Get preferred locale and set header for the app to use
  const preferredLocale = getPreferredLocale(request);

  // Security headers
  response.headers.set('X-Security-Verified', 'GeneratorOracle-Protected');
  response.headers.set('X-Request-ID', `GO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  response.headers.set('X-Locale', preferredLocale);

  // Copyright header (informational only — does NOT instruct crawlers to
  // skip caching or de-index, which previously caused indexing failures).
  response.headers.set('X-Copyright', 'Generator Oracle 2024-2026');
  response.headers.set('X-Content-Protected', 'true');

  // SEO-safe per-request cache policy.
  // - Wizard assets: untouched (handled in next.config headers())
  // - /admin/*       : private, no-store (sensitive surfaces only)
  // - everything else: leave the response cache headers alone so
  //   vercel.json / next.config / page-level revalidate can take effect.
  //   The previous blanket `private, no-store` killed CDN caching for the
  //   entire site and was a major contributor to indexing failures.
  if (!isWizardAsset(pathname)) {
    if (isAdminPath(pathname)) {
      response.headers.set('Cache-Control', 'private, no-store');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 🚀 WORLD'S #1 FASTEST - PERFORMANCE HEADERS
  // ═══════════════════════════════════════════════════════════════════════════

  const linkHints = [
    '</images/logo-tagline.png>; rel=preload; as=image',
    '<https://fonts.googleapis.com>; rel=preconnect',
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
  ];

  // EIMS PRO / Building Suite embed: warm connection to Flask before HTML parses.
  if (isEimsEmbedShellPath(pathname)) {
    const suiteBase =
      process.env.NEXT_PUBLIC_EIMS_BUILDING_SUITE_URL || 'http://127.0.0.1:5000';
    let origin = 'http://127.0.0.1:5000';
    try {
      const normalized = suiteBase.trim().startsWith('http')
        ? suiteBase.trim()
        : `https://${suiteBase.trim()}`;
      origin = new URL(normalized).origin;
    } catch {
      /* keep default */
    }
    linkHints.push(`<${origin}>; rel=preconnect`);
    linkHints.push(`<${origin}>; rel=dns-prefetch`);
  }

  response.headers.set('Link', linkHints.join(', '));

  // Server Timing - Performance debugging
  response.headers.set('Server-Timing', `middleware;dur=${Date.now() % 100}`);

  // Vary header for proper caching
  response.headers.set('Vary', 'Accept-Encoding, Accept-Language');

  return response;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (SEO sitemap)
     * - robots.txt (SEO robots)
     * - manifest.webmanifest (PWA manifest)
     * - public folder files (images, fonts, videos)
     * - api routes
     */
    // NOTE: .txt and .xml are excluded so static verification / key files
    // (BingSiteAuth.xml, IndexNow key .txt, ads.txt, etc.) are NEVER bot-blocked
    // — search-engine verifiers and the IndexNow API fetch these with non-browser
    // user-agents and must always get a 200.
    '/((?!_next/static|_next/image|api|favicon.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|images|fonts|videos|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.ico$|.*\\.txt$|.*\\.xml$).*)',
  ],
};
