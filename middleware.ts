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
      // Inlined (no import) so the edge bundle can't fail and fall open to 200.
      // Keep in sync with lib/seo/indexedMatrix.ts.
      const OK_LOC = new Set(['nairobi','mombasa','kisumu','nakuru','eldoret','thika','westlands','karen','kilimani','industrial-area','embakasi','ruaraka','kasarani','kiambu','machakos','kajiado','uasin-gishu','kakamega','meru','nyeri','kericho','kisii','kilifi','bungoma','kitui','nyandarua']);
      const OK_SVC = new Set(['generators','solar','ups','electrical','generator-diagnostics','spare-parts','borehole','ac']);
      if (!(OK_LOC.has(loc) && OK_SVC.has(svc))) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: { 'X-Robots-Tag': 'noindex, follow', 'Content-Type': 'text/plain', 'X-Loc-Guard': '404' },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0b. HARD 404 for clearly-invalid /kenya/[county]/[...] combos.
  //     Same Next-16 soft-404 quirk (notFound() -> HTTP 200 + indexable "Not
  //     Found" page + self-canonical = "Duplicate without user-selected
  //     canonical" in Search Console). CONSERVATIVE by design: only 404 combos
  //     that are DEFINITELY invalid, never a real page. Valid /kenya set =
  //     county (47) + county×core-service, plus constituency pages for the 10
  //     PRIORITY counties only. Single-segment /kenya/[county] is a separate
  //     route — left untouched here.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    const km = pathname.match(/^\/kenya\/([^/]+)\/(.+?)\/?$/);
    if (km) {
      let county = km[1];
      const rest = km[2].split('/').filter(Boolean);
      try { county = decodeURIComponent(county); } catch { /* keep raw */ }
      const KENYA_COUNTIES = new Set(['nairobi','mombasa','kwale','kilifi','tana-river','lamu','taita-taveta','garissa','wajir','mandera','marsabit','isiolo','meru','tharaka-nithi','embu','kitui','machakos','makueni','nyandarua','nyeri','kirinyaga','muranga','kiambu','turkana','west-pokot','samburu','trans-nzoia','uasin-gishu','elgeyo-marakwet','nandi','baringo','laikipia','nakuru','narok','kajiado','kericho','bomet','kakamega','vihiga','bungoma','busia','siaya','kisumu','homa-bay','migori','kisii','nyamira']);
      const CORE_SVC = new Set(['generator-companies','generators','generator-repairs','generator-maintenance','generator-spare-parts','solar-installation','solar-companies','motor-rewinding','ups-systems','electrical-services']);
      const PRIORITY = new Set(['nairobi','mombasa','kisumu','nakuru','kiambu','machakos','kajiado','nyeri','meru','uasin-gishu']);
      let invalid = false;
      if (!KENYA_COUNTIES.has(county)) {
        invalid = true;                                   // unknown county → definitely invalid
      } else if (rest.length === 1) {
        // /kenya/[county]/[x]: valid if x is a core service, OR (priority county)
        // x may be a constituency — allow those through to the page.
        if (!CORE_SVC.has(rest[0]) && !PRIORITY.has(county)) invalid = true;
      } else if (rest.length === 2) {
        // /kenya/[county]/[constituency]/[service]: only priority counties have these.
        if (!PRIORITY.has(county)) invalid = true;
      } else {
        invalid = true;                                   // 3+ deep segments → never valid
      }
      if (invalid) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: { 'X-Robots-Tag': 'noindex, follow', 'Content-Type': 'text/plain', 'X-Loc-Guard': 'kenya-404' },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0e. HARD 404 for unknown /generators/spare-parts/engine/[model] slugs.
  //     Same Next 16 + Vercel behaviour as guards 0a-0d: notFound() inside an
  //     already-matched dynamic route still answers 200, so the allowlist must
  //     live here. Kept in sync by hand with lib/parts/engineIndex.ts
  //     (engines with >= 5 real parts).
  {
    const em = pathname.match(/^\/generators\/spare-parts\/engine\/([^/]+)\/?$/);
    if (em) {
      const OK_ENGINES = new Set(['6bt5-9','6bta5-9','4bt3-9','1104c-44','1106c-e66t','4bta3-9','isbe6','isbe4','6ct8-3','1104c-44t','6cta8-3','3054c','3056e','c6-6','403c-15','404c-22','qsb6-7','c7-1','403d-15','404d-22','qsb4-5','nt855','1104c-e44t']);
      if (!OK_ENGINES.has(decodeURIComponent(em[1]).toLowerCase())) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': 'engine-404',
          },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0d. HARD 404 for unknown /generators/spare-parts/[category] slugs.
  //
  //     The category route sets dynamicParams=false, which correctly stops
  //     unknown slugs rendering a parts table — but Next 16 on Vercel still
  //     answers HTTP 200 when notFound() fires inside an already-matched
  //     dynamic route, so /generators/spare-parts/notreal was a soft-404.
  //     Same reason guards 0a, 0b and 0c exist.
  //
  //     Inlined deliberately: importing the 1.2 MB parts JSON into the edge
  //     runtime is both too heavy and fails open. Keep in sync by hand with
  //     the subcategory ids in app/data/spare-parts-database-COMPLETE.json.
  {
    const m = pathname.match(/^\/generators\/spare-parts\/([^/]+)\/?$/);
    if (m) {
      const OK_PART_CATS = new Set(['filters','pistons-rings','injectors-fuel','cooling-system','alternators','electrical-components','control-panels','turbochargers','bearings-seals','valves-train','crankshafts-rods','cylinder-liners','engine-block','timing-gears','oil-pumps','exhaust-system','belts-pulleys','hoses-clamps','batteries','gauges','hardware','fuel-tanks','lubricants','tools','enclosures','wiring-electrical','safety-fire']);
      if (!OK_PART_CATS.has(decodeURIComponent(m[1]).toLowerCase())) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': 'parts-cat-404',
          },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0f. HARD 404 for unknown /repair-centre/[hub] and /repair-centre/[hub]/[slug].
  //
  //     Verified live 2026-07-27: /repair-centre/nonsense-hub and
  //     /repair-centre/ups/this-article-does-not-exist-xyz both answered
  //     HTTP 200 with a "Not found" body. Setting dynamicParams=false on both
  //     routes did NOT fix it — same Next-16-on-Vercel quirk as guards 0a–0e,
  //     where notFound() inside an already-matched dynamic route still returns
  //     200. Only a middleware 404 is authoritative.
  //
  //     Inlined deliberately: a cross-module '@/lib' import has been proven to
  //     fail open in the edge runtime here (see guard 0a). Keep in sync by hand
  //     with the registry in lib/repair-centre/index.ts — hubs are REPAIR_HUBS,
  //     and each entry below maps an article slug to its owning hub, which also
  //     404s a real article requested under the wrong hub.
  {
    // '/repair-centre/' is the index with a trailing slash — left to the normal
    // trailing-slash redirect, not 404'd here.
    if (pathname.startsWith('/repair-centre/') && pathname !== '/repair-centre/') {
      const OK_REPAIR_HUBS = new Set(['generators', 'inverters', 'ups', 'controllers', 'pcb-motherboards', 'ats-changeover', 'motors', 'pumps', 'solar', 'industrial-electronics', 'safety', 'fuel-systems', 'testing-tools', 'fault-codes', 'engine-systems']);
      const OK_REPAIR_ARTICLES: Record<string, string> = {
        'generator-cranks-but-will-not-start': 'generators',
        'generator-starts-then-stops': 'generators',
        'generator-low-oil-pressure-shutdown': 'generators',
        'generator-produces-no-voltage-output': 'generators',
        'generator-unstable-voltage': 'generators',
        'generator-overheating': 'generators',
        'generator-avr-fault-diagnosis': 'generators',
        'starter-motor-clicks-but-will-not-crank': 'generators',
        'ups-bypass-fault': 'ups',
        'pcb-short-circuit-diagnosis': 'pcb-motherboards',
        'motherboard-power-rail-diagnosis': 'pcb-motherboards',
        'pcb-reset-supervisor-clock-faults': 'pcb-motherboards',
        'pcb-cleaning-track-repair-contamination': 'pcb-motherboards',
        'pcb-repair-or-replace-decision': 'pcb-motherboards',
        'ats-not-changing-over': 'ats-changeover',
        'generator-battery-not-charging': 'generators',
        'ups-inverter-fault-diagnosis': 'ups',
        'controller-alarm-interpretation': 'controllers',
        'three-phase-motor-failure-diagnosis': 'motors',
        'borehole-pump-no-water-delivery': 'pumps',
        'solar-system-underperforming': 'solar',
        'vfd-drive-fault-diagnosis': 'industrial-electronics',
        'drive-thermal-derating-and-cooling': 'industrial-electronics',
        'drive-motor-cable-screening-earth-leakage': 'industrial-electronics',
        'drive-capacitor-ageing-and-storage': 'industrial-electronics',
        'safe-isolation-and-proving-dead': 'safety',
        'generator-excessive-smoke': 'fuel-systems',
        'test-instruments-and-measurement-errors': 'testing-tools',
        'j1939-spn-fmi-explained': 'fault-codes',
        'diesel-engine-abnormal-noise': 'engine-systems',
        'diesel-valve-train-and-clearances': 'engine-systems',
        'turbocharger-mechanical-condition': 'engine-systems',
        'solar-charge-controller-not-charging': 'solar',
        'solar-string-fault-diagnosis': 'solar',
        'solar-module-degradation-bypass-diodes': 'solar',
        'motor-overload-tripping': 'motors',
        'pump-runs-continuously': 'pumps',
        'pump-hydraulic-wear-sand-abrasion': 'pumps',
        'inverter-overheating-diagnosis': 'inverters',
        'insulation-testing-protecting-electronics': 'testing-tools',
        'controller-communication-faults': 'controllers',
        'generator-starts-in-manual-not-auto': 'controllers',
        'ups-battery-replacement': 'ups',
        'ats-will-not-return-to-mains': 'ats-changeover',
        'ats-contactor-interlock-faults': 'ats-changeover',
        'ats-position-indication-auxiliary-contacts': 'ats-changeover',
        'diesel-fuel-contamination': 'fuel-systems',
        'generator-air-restriction-turbocharger': 'fuel-systems',
        'generator-altitude-ambient-derating': 'fuel-systems',
        'inverter-switches-off-under-load': 'inverters',
        'inverter-will-not-switch-on': 'inverters',
        'inverter-not-charging-batteries': 'inverters',
        'inverter-mosfet-failure-diagnosis': 'inverters',
        'inverter-igbt-testing-and-failure': 'inverters',
        'solar-inverter-dc-bus-fault': 'inverters',
        'ups-not-charging-batteries': 'ups',
        'ups-on-battery-with-mains-present': 'ups',
        'ups-will-not-power-on': 'ups',
        'motor-bearing-failure-diagnosis': 'motors',
        'borehole-drop-cable-and-motor-testing': 'pumps',
      };
      const rm = pathname.match(/^\/repair-centre\/([^/]+)(?:\/([^/]+))?\/?$/);
      let ok = false;
      if (rm) {
        const hub = decodeURIComponent(rm[1]).toLowerCase();
        const slug = rm[2] ? decodeURIComponent(rm[2]).toLowerCase() : undefined;
        ok = slug === undefined ? OK_REPAIR_HUBS.has(hub) : OK_REPAIR_ARTICLES[slug] === hub;
      }
      // Anything deeper than /repair-centre/[hub]/[slug] never matches rm and
      // is rejected here too.
      if (!ok) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': 'repair-centre-404',
          },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0g. HARD 404 for unknown /brands/[brand]/kenya/[county] and
  //     /sectors/[sector]/kenya/[county] combos.
  //
  //     Verified live 2026-07-27: /brands/nonexistent-brand-xyz/kenya/nairobi
  //     and /sectors/nonexistent-sector-xyz/kenya/nairobi both answered
  //     HTTP 200 with a "Not Found" title. Both routes keep dynamicParams=true
  //     so legitimate combos outside generateStaticParams still render; this
  //     guard supplies the status the route cannot.
  //
  //     The three sets below are COMPLETE, extracted by executing the same
  //     modules the pages import (getAllBrandSlugs, getAllSectorSlugs,
  //     getAllCounties): 17 brands, 27 sectors, 47 counties. An incomplete list
  //     here would 404 real pages, which is worse than the soft-404 — so
  //     regenerate them the same way rather than editing by hand.
  {
    const bm = pathname.match(/^\/(brands|sectors)\/([^/]+)\/kenya\/([^/]+)\/?$/);
    if (bm) {
      const OK_BRANDS = new Set(['cummins','perkins','sdmo','volvo-penta','volvo','honda','lister-petter','doosan','caterpillar','iveco','man','gesan','himoinsa','weichai','john-deere','olympian','leyland']);
      const OK_SECTORS = new Set(['schools','private-schools','private-colleges','private-universities','hospitals','private-hospitals','banks','private-offices','supermarkets','hotels','tourist-hotels','restaurants','ngos','ngo-offices','embassies','consulates','industries','quarries','flower-farms','apartments','real-estates','homes','farms','ranches','churches','masai-mara','tourist-destinations']);
      const OK_COUNTIES = new Set(['nairobi','kiambu','muranga','nyeri','kirinyaga','nyandarua','mombasa','kilifi','kwale','taita-taveta','tana-river','lamu','machakos','makueni','kitui','embu','tharaka-nithi','meru','isiolo','kisumu','siaya','homa-bay','kisii','nyamira','migori','nakuru','narok','kajiado','kericho','bomet','uasin-gishu','elgeyo-marakwet','nandi','baringo','laikipia','samburu','trans-nzoia','turkana','west-pokot','kakamega','bungoma','busia','vihiga','garissa','wajir','mandera','marsabit']);
      const kind = bm[1];
      const key = decodeURIComponent(bm[2]).toLowerCase();
      const county = decodeURIComponent(bm[3]).toLowerCase();
      const keyOk = kind === 'brands' ? OK_BRANDS.has(key) : OK_SECTORS.has(key);
      if (!keyOk || !OK_COUNTIES.has(county)) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': `${kind}-county-404`,
          },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0h. HARD 404 for unknown /services/[service] and /blog/[slug].
  //
  //     Verified live 2026-07-27: /services/__no_such_service__ and
  //     /blog/__no_such_post__ both answered HTTP 200 with a "Not Found" body.
  //     Neither route sets dynamicParams and both rely on notFound(), which does
  //     not produce a 404 STATUS on Next 16 + Vercel once a dynamic route has
  //     matched — the same quirk behind guards 0a-0g. /services is the
  //     commercial core, so this was live SEO damage on the most valuable pages.
  //
  //     Each set below is the UNION of two things, and both parts matter:
  //       - the dynamic slugs, extracted by executing the same modules the pages
  //         import (getAllServiceSlugs, BLOG_ARTICLES) — these match the sitemap
  //         exactly, 10 services and 22 posts
  //       - the STATIC route folders under app/services and app/blog, which are
  //         real pages that middleware sees before routing and would otherwise
  //         be 404'd here even though they render perfectly
  //
  //     Cross-checked before deploy: every /services/* redirect destination in
  //     next.config is present in OK_SERVICES, so no redirect lands on a 404.
  //     Regenerate by execution rather than editing by hand.
  {
    const sm = pathname.match(/^\/(services|blog)\/([^/]+)\/?$/);
    if (sm) {
      const OK_SERVICES = new Set([
        // dynamic, from getAllServiceSlugs()
        'ac-installation','ats-changeover','borehole-pumps','cummins-generators','distribution-boards',
        'generator-repairs','hospital-incinerators','motor-rewinding','solar-energy','ups-systems',
        // static route folders under app/services
        'air-conditioning','borehole-drilling','solar-inverters',
      ]);
      const OK_BLOG = new Set([
        // dynamic, from BLOG_ARTICLES
        'borehole-pump-selection-kenya','diesel-generator-best-practices','diy-generator-maintenance-home',
        'earthing-lightning-protection-kenya','generator-altitude-derating-kenya','generator-buying-guide-kenya',
        'generator-cost-saving-strategies','generator-fire-safety-prevention','generator-maintenance-tips-kenya',
        'generator-procurement-kenya','generator-roi-analysis-kenya','generator-safety-tips-kenya',
        'generator-servicing-cost-kenya','hv-intake-upgrade-kenya','hvac-cooling-load-sizing-kenya',
        'power-factor-correction-kenya','solar-battery-chemistries-kenya','solar-energy-solutions-kenya',
        'solar-installation-tips-kenya','true-cost-per-kwh-kenya','ups-sizing-runtime-kenya',
        'weather-impact-generators-kenya-counties',
        // static route folders under app/blog
        'borehole-drilling-avoid-dry-holes','electrical-load-management','emergency-response-plan',
        'generator-fuel-efficiency-reduce-costs','generator-roi','generator-wont-start-5-fixes',
        'grid-reliability-africa','high-voltage-systems-industrial-power','hvac-sizing-kenya-climate',
        'incinerator-systems-waste-management','maintenance-contracts-roi','motor-rewinding-repair-vs-replace',
        'solar-generator-hybrid-integration','solar-roi-kenya-real-numbers','three-phase-power-explained',
        'ups-vs-generator-which-is-right','water-pump-maintenance-5-checks',
      ]);
      const kind = sm[1];
      const slug = decodeURIComponent(sm[2]).toLowerCase();
      const ok = kind === 'services' ? OK_SERVICES.has(slug) : OK_BLOG.has(slug);
      if (!ok) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': `${kind}-404`,
          },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0c. HARD 404 for the root-level /[country]/[city] catch-all.
  //
  //     app/[country]/[city] matches ANY two-segment URL that no more specific
  //     route claims. It previously answered HTTP 200 for every one of them,
  //     rendering a page whose heading and title were built from the URL text:
  //
  //       /regions/uganda -> 200, /notarealsection/foo -> 200, /xyz/abc -> 200
  //
  //     Setting dynamicParams=false removed the fabricated CONTENT (those URLs
  //     now render "Page Not Found" and are noindex), but Next 16 on Vercel
  //     still returns HTTP 200 when notFound() fires inside an already-matched
  //     dynamic route. Only a middleware guard can produce a real 404 — the
  //     same reason sections 0a and 0b above exist.
  //
  //     Inverse allowlist: a two-segment path is legitimate only if its FIRST
  //     segment is a real top-level route directory or a real East African
  //     country. Anything else is the catch-all and gets a hard 404.
  //
  //     The sets are INLINED deliberately. Importing from @/lib inside the edge
  //     runtime fails open (proven when the /locations guard silently did
  //     nothing), so these must be kept in sync by hand with the app directory
  //     and lib/data/east-africa-locations.ts.
  {
    const seg = pathname.split('/').filter(Boolean);
    if (seg.length === 2 && !pathname.startsWith('/api/')) {
      //     2026-07-31: eight segments below were MISSING from this set even
      //     though app/<segment>/<child>/page.tsx exists for each, so the guard
      //     hard-404'd real published pages. A live crawl found them all
      //     returning 404 with X-Loc-Guard: catchall-404 — including the entire
      //     /marketplace checkout, orders, parts and returns flow, and all of
      //     /east-africa, whose hub page linked to three of its own 404s.
      //     Only segments that genuinely own child routes are added; listing a
      //     segment with no children would let /that/anything fall through to
      //     [country]/[city] and soft-404 at HTTP 200, which is the defect this
      //     whole block exists to prevent.
      const ROUTE_SEGMENTS = new Set(['about-us','repair-centre','admin','africa','ai-tools','all-tools','alltools','analytics','api','aquascan-pro','aquascan-pro-v3','blog','booking','brands','calculators','careers','case-studies','case-study','collab','components','console','contact','counties','curation','dashboard','data','diagnostics','east-africa','eims-pro','fabrication','faq','faults','gallery','generator','generator-oracle','generator-parts','generator-problems','generator-services','generators','guides','healthcare','high-rise','hub','industries','industry-solutions','innovations','interior','kenya','knowledge-base','lib','locations','maintenance-hub','marketplace','mep-clash','podcasts','privacy','pro-building-suite','pro-console','products','qs','resources','safety','sectors','service','services','solar','solar-design-studio','solar-genius-pro','solar-genius-pro-futuristic','solar-genius-pro-tools','solution','solutions','specs','styles','swoosh-preview','swoosh-x','technical-bible','terms','tools','troubleshooting']);
      const EA_COUNTRIES = new Set(['uganda','tanzania','rwanda','south-sudan','drc','ethiopia','djibouti','eritrea','somaliland']);
      const first = seg[0].toLowerCase();
      if (!ROUTE_SEGMENTS.has(first) && !EA_COUNTRIES.has(first)) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': 'catchall-404',
          },
        });
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 0i. HARD 404 for unknown single-segment slugs on the dynamic hub routes.
  //
  //     WHY (measured from Search Console, 2026-08-01)
  //     Google reported 145,024 URLs for a site that publishes 2,077:
  //       63,201 indexed · 81,823 not indexed, of which
  //       40,103 "Excluded by noindex"  ·  26,161 "Blocked by 403"
  //       11,075 "Crawled - currently not indexed"
  //
  //     Cause: eight dynamic routes accepted ANY slug and answered HTTP 200.
  //     Verified live before writing this guard:
  //       /faults/zzz999              200 + noindex  "Fault Code Not Found"
  //       /brands/zzz999              200 + noindex
  //       /sectors/zzz999             200 + noindex
  //       /industries/zzz999          200 + noindex
  //       /locations/zzz999           200 + noindex
  //       /kenya/zzz999               200 + noindex
  //       /generator-problems/zzz999  200, NO noindex, self-canonical  <-- indexable
  //       /solutions/zzz999           200, NO noindex, self-canonical  <-- indexable
  //
  //     The last two are the damaging ones: they are fully indexable soft-404s
  //     that canonicalise to themselves, so every URL Google invents becomes a
  //     thin page in the index. The rest burn crawl budget and inflate the
  //     "excluded by noindex" pile.
  //
  //     notFound() cannot fix this — Next 16 on Vercel still answers 200 once a
  //     dynamic route has matched. Only middleware yields a real 404, which is
  //     why guards 0a-0g exist. This guard MUST stay above the verified-crawler
  //     fast-path below, or Googlebot skips it entirely.
  //
  //     The sets are INLINED deliberately: importing from @/lib inside the edge
  //     runtime fails open (proven when the /locations guard silently did
  //     nothing). Regenerate them from the registries rather than editing by
  //     hand — see the generator noted in the commit for this guard.
  // ───────────────────────────────────────────────────────────────────────────
  {
    const seg = pathname.split('/').filter(Boolean);
    if (seg.length === 2 && !pathname.startsWith('/api/')) {
      const OK_FAULTS = new Set(['comap-a001','comap-a015','comap-a020','comap-a030','comap-a040','comap-a050','comap-a060','dse-e020','dse-e040','dse-e070','dse-e090','dse-e100','dse-e110','dse-e120','dse-e125','dse-e130','dse-e140','perkins-100','perkins-110','perkins-111','perkins-115','perkins-190','perkins-2387','perkins-94','spn-100','spn-102','spn-105','spn-110','spn-111','spn-115','spn-1514','spn-157','spn-190','spn-3556','spn-639','spn-94']);
      const OK_BRANDS = new Set(['caterpillar','cummins','doosan','gesan','himoinsa','honda','iveco','john-deere','leyland','lister-petter','man','olympian','perkins','sdmo','volvo','volvo-penta','weichai']);
      const OK_SECTORS = new Set(['apartments','banks','churches','consulates','embassies','farms','flower-farms','homes','hospitals','hotels','industries','masai-mara','ngo-offices','ngos','private-colleges','private-hospitals','private-offices','private-schools','private-universities','quarries','ranches','real-estates','restaurants','schools','supermarkets','tourist-destinations','tourist-hotels']);
      const OK_INDUSTRIES = new Set(['banks-financial','churches-religious','commercial-property','flower-farms','government-ngos','healthcare','hospitals-healthcare','hotels-hospitality','manufacturing','manufacturing-industries','real-estate-construction','schools-universities','telecommunications']);
      const OK_COUNTIES = new Set(['baringo','bomet','bungoma','busia','elgeyo-marakwet','embu','garissa','homa-bay','isiolo','kajiado','kakamega','kericho','kiambu','kilifi','kirinyaga','kisii','kisumu','kitui','kwale','laikipia','lamu','machakos','makueni','mandera','marsabit','meru','migori','mombasa','muranga','nairobi','nakuru','nandi','narok','nyamira','nyandarua','nyeri','samburu','siaya','taita-taveta','tana-river','tharaka-nithi','trans-nzoia','turkana','uasin-gishu','vihiga','wajir','west-pokot']);
      const OK_LOCATIONS = new Set(['ahero','ainabkoi','ainamoi','aldai','alego-usonga','archer-post','athi-river','awendo','bahati','balambala','bamburi','banana','banissa','baragoi','baringo','baringo-central','baringo-north','baringo-south','belgut','bissil','bobasi','bomachoge-borabu','bomachoge-chache','bombolulu','bomet','bomet-central','bomet-east','bonchari','bondo','borabu','brooke','budalangi','bumula','bungoma','bura','bureti','burnt-forest','buruburu','busia','bute','butere','butula','buuri','cbd','central-imenti','changamwe','chavakali','chepalungu','chepareria','chepkorio','cherangany','chesumei','chogoria','chuka','chuka-igambangombe','chwele','dadaab','dagoretti-north','dagoretti-south','diani','doldol','donholm','eastleigh','ekerenyo','el-wak','eldama-ravine','eldas','eldoret','elementaita','elgeyo-marakwet','elwak','emali','embakasi','embakasi-central','embakasi-east','embakasi-north','embakasi-south','embakasi-west','embu','emgwen','emuhaya','emurua-dikirr','endebess','engineer','ewaso-nyiro','fafi','faza','funyula','galole','ganjoni','ganze','garbatulla','garissa','garissa-township','garsen','gatanga','gatundu','gatundu-north','gatundu-south','gem','gichugu','gigiri','gilgil','githunguri','githurai','griftu','habaswein','hamisi','hindi','hola','homa-bay','homa-bay-town','hurlingham','igembe-central','igembe-north','igembe-south','ijara','ikolomani','industrial-area','isebania','ishiara','isiolo','isiolo-north','isiolo-south','iten','jamhuri','jomvu','juja','kaanwa','kabarnet','kabartonjo','kabete','kabondo-kasipul','kabuchai','kacheliba','kagio','kahawa','kahawa-sukari','kaiti','kajiado','kajiado-central','kajiado-east','kajiado-north','kajiado-south','kajiado-west','kakamega','kakuma','kalokol','kaloleni','kamiti','kamukunji','kandara','kanduyi','kangari','kangema','kangemi','kangundo','kapenguria','kapsabet','kapseret','kapsowar','karachuonyo','karatina','karen','karuri','kasarani','kasipul','kathiani','kawangware','kehancha','keiyo-north','keiyo-south','kendu-bay','kenol','kenyatta-road','kericho','keroka','kerugoya','kesses','khwisero','kiambaa','kiambu','kianjai','kianyaga','kibera','kibra','kibwezi','kibwezi-east','kibwezi-west','kieni','kigumo','kiharu','kikuyu','kileleshwa','kilgoris','kilifi','kilifi-north','kilifi-south','kilimani','kilome','kimana','kimilili','kiminini','kinamba','kinango','kinangop','kinna','kinoo','kipini','kipipiri','kipkelion','kipkelion-east','kipkelion-west','kirinyaga','kirinyaga-central','kiritiri','kisauni','kiserian','kisii','kisumu','kisumu-central','kisumu-east','kisumu-west','kitale','kitengela','kitisuru','kitui','kitui-central','kitui-east','kitui-rural','kitui-south','kitui-west','kitutu-chache-north','kitutu-chache-south','kitutu-masaba','kizingo','kobujoi','kombewa','kondele','kongowea','konoin','kuresoi-north','kuresoi-south','kuria-east','kuria-west','kutus','kwale','kwanza','kyuso','laare','lafey','lagdera','laikipia','laikipia-east','laikipia-north','laikipia-west','laisamis','lamu','lamu-east','lamu-west','langata','lari','lavington','likoni','likuyani','limuru','litein','lodwar','loima','loitokitok','lokichar','lokichoggio','lokitaung','lolgorian','londiani','longisa','loresho','luanda','lugari','lunga-lunga','lurambi','maara','machakos','machakos-town','madogo','magadi','magarini','magutuni','mai-mahiu','majengo','makadara','makindu','makueni','makutano','makuyu','malaba','malakisi','malava','malindi','mandera','mandera-east','mandera-north','mandera-south','mandera-west','manga','manyatta','maragua','maragwa','marakwet-east','marakwet-west','maralal','marani','mariakani','marigat','marimanti','marsabit','masalani','maseno','masinga','matayos','mathare','mathioya','mathira','matuga','matungu','matungulu','matuu','maua','maungu','mavoko','mazeras','mbale','mbeere-north','mbeere-south','mbita','mbooni','membley','merti','meru','migori','migwani','mikindani','milimani','miritini','mlolongo','modogashe','mogotio','moi-bridge','moiben','mokowe','molo','mombasa','mombasa-cbd','mombasa-road','mosop','mosoriot','mount-elgon','mountain-view','moyale','mpeketoni','msambweni','mtito-andei','mtwapa','muhoroni','muhuru','mukurweini','mulot','mumias','mumias-east','mumias-west','muranga','muthaiga','mutomo','mvita','mwala','mwatate','mwea','mweiga','mwingi','mwingi-central','mwingi-north','mwingi-west','nairobi','nairobi-west','naivasha','nakuru','nakuru-town-east','nakuru-town-west','namanga','nambale','nandi','nandi-hills','nanyuki','narok','narok-east','narok-junction','narok-north','narok-south','narok-west','narumoru','navakholo','ndanai','ndaragwa','ndenderu','ndhiwa','ndia','ngara','ngong','ngong-road','ngumo','njabini','njoro','nkubu','north-horr','north-imenti','north-mugirango','nuu','nyahururu','nyakach','nyali','nyamache','nyamira','nyandarua','nyando','nyansiongo','nyaribari-chache','nyaribari-masaba','nyatike','nyeri','nyeri-town','ogembo','ol-jorok','ol-kalou','old-town','oloitokitok','ololulunga','ongata-rongai','ortum','othaya','oyugis','parklands','pokot-south','port-reitz','port-victoria','rabai','rangwe','rarieda','rhamu','rongai','rongo','roysambu','ruaraka','ruiru','rumuruti','runda','runyenjes','sabatia','saboti','sagana','saku','salgaa','samburu','samburu-east','samburu-north','samburu-west','seme','serem','shanzu','shimanzi','shimba-hills','shinyalu','siakago','siaya','sigor','sigowet-soin','silibwet','sirisia','sololo','sosiot','sotik','south-b','south-c','south-imenti','south-kinangop','south-mugirango','soy','spring-valley','starehe','suba-north','suba-south','subukia','suguta-marmar','sultan-hamud','suna-east','suna-west','suneka','suswa','syokimau','taita-taveta','takaba','takaungu','tala','tambach','tana-river','tarbaj','taveta','teso-north','teso-south','tetu','tharaka','tharaka-nithi','thika','thika-road','thika-town','tiaty','tigania-east','tigania-west','timau','tinderet','tongaren','trans-nzoia','tsavo','tudor','turbo','turkana','turkana-central','turkana-east','turkana-north','turkana-south','turkana-west','uasin-gishu','ugenya','ugunja','ukunda','ukwala','umoja','upperhill','uriri','usenge','vihiga','vipingo','voi','wajir','wajir-east','wajir-north','wajir-south','wajir-west','wamba','wamunyu','wangige','wanguru','watamu','webuye','webuye-east','webuye-west','west-mugirango','west-pokot','westlands','witu','woodley','wote','wundanyi','yala','yatta','zambezi','zimmerman','ziwa']);
      const OK_PROBLEMS = new Set(['exhaust-smoke','low-oil-pressure','overheating','voltage-frequency-unstable','wont-start']);
      const OK_SOLUTIONS = new Set(['ac','borehole-pumps','building','contact','controls','diesel-automation','fabrication','factories','farms','generators','high-voltage','hospitals','hotels','incinerators','motor-rewinding','motors','power-interruptions','real-estate','schools','solar','solar-sizing','ups']);

      const SLUG_GUARDS: Record<string, Set<string>> = {
        faults: OK_FAULTS,
        brands: OK_BRANDS,
        sectors: OK_SECTORS,
        industries: OK_INDUSTRIES,
        kenya: OK_COUNTIES,
        locations: OK_LOCATIONS,
        'generator-problems': OK_PROBLEMS,
        solutions: OK_SOLUTIONS,
      };

      const allowed = SLUG_GUARDS[seg[0].toLowerCase()];
      if (allowed && !allowed.has(decodeURIComponent(seg[1]).toLowerCase())) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': 'slug-404',
          },
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
