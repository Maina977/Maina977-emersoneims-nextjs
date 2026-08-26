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
  // 0-HOST. CONSOLIDATE power.emersoneims.com INTO www.emersoneims.com.
  //
  //     THE PROBLEM THIS SOLVES
  //     Measured 2026-08-26: power.emersoneims.com served 1,157 crawlable,
  //     self-canonical URLs selling the same generators in the same market as
  //     www — including /blog/generator-price-kenya, competing directly with
  //     our own /pricing/generator-prices-kenya. Google has to pick one of the
  //     two for every query, and every backlink either site earns is split
  //     between them. Consolidating hands all of it to one domain.
  //
  //     The subdomain is a flat .html doorway grid: 20 service families across
  //     55 towns, plus ~54 genuine blog articles. Each family maps to the www
  //     page that covers that service nationally.
  //
  //     PAGE-TO-PAGE, NOT A BLANKET REDIRECT. Sending everything to the www
  //     homepage is read by Google as a soft 404 — the destination does not
  //     answer what the URL promised — which discards the very authority the
  //     consolidation exists to preserve. The town is dropped deliberately:
  //     www already has a real, differentiated /kenya structure, and pointing
  //     55 near-identical doorway pages into it would import the duplication
  //     we are removing.
  //
  //     INERT UNTIL DNS POINTS HERE. This only fires for that hostname, so it
  //     costs nothing while the subdomain is still served from Netlify. The
  //     moment power.emersoneims.com is added to this Vercel project and its
  //     DNS re-pointed, the consolidation goes live and is testable from here.
  //     docs/subdomain-consolidation/_redirects carries the same map for
  //     Netlify if the site stays there instead.
  // ─────────────────────────────────────────────────────────────────────────────
  /*
   * Read the HOST HEADER, not request.nextUrl.hostname.
   *
   * Verified locally on 2026-08-26: with `Host: power.emersoneims.com` sent to
   * a production build, request.nextUrl.hostname still reported `localhost`,
   * so a check against it never fired and the whole block was a silent no-op
   * that would have looked deployed and done nothing. x-forwarded-host is what
   * Vercel populates behind its proxy; `host` is the fallback. Port stripped
   * because a local host header can carry one.
   */
  const requestHost = (
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    hostname ||
    ''
  ).toLowerCase().split(':')[0];

  /*
   * APEX -> WWW. One canonical hostname, enforced rather than suggested.
   *
   * Measured 2026-08-26: https://emersoneims.com/ served the FULL site at
   * HTTP 200 — /, /generators, /pricing, /kenya/nairobi all rendered. Every
   * page did declare canonical https://www.emersoneims.com/..., which is why
   * this was not doing visible harm, but a canonical is a hint Google may
   * disregard while a 301 is definitive. Two hostnames serving identical
   * content also doubles the crawl cost of the whole site for nothing.
   *
   * The path and query ARE preserved here, unlike the subdomain block below:
   * the apex serves the same application, so every path has an exact www
   * equivalent. Redirecting to the bare homepage would throw that away.
   *
   * Runs before the subdomain rule purely for readability; the two hostnames
   * are mutually exclusive.
   */
  if (requestHost === 'emersoneims.com' && !pathname.startsWith('/api/')) {
    /*
     * /api/ IS DELIBERATELY EXEMPT — this nearly broke payments.
     *
     * lib/payments/mpesaService.ts falls back to
     * https://emersoneims.com/api/payments/callback when MPESA_CALLBACK_URL is
     * unset, and M-Pesa POSTs to it. A 301 on a POST is permitted to become a
     * GET and drop the body, and third-party webhook senders frequently do not
     * follow redirects at all — so redirecting this host would silently lose
     * payment callbacks. Search engines never index /api/, so exempting it
     * costs nothing in the SEO this redirect exists for.
     *
     * The fallback URLs themselves have also been corrected to www, but the
     * exemption stays: an integration configured with the apex years ago must
     * keep working regardless of what our defaults say today.
     */
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://www.emersoneims.com');
    return NextResponse.redirect(target, {
      status: 301,
      headers: { 'X-Loc-Guard': 'apex-to-www' },
    });
  }

  if (requestHost === 'power.emersoneims.com') {
    const WWW = 'https://www.emersoneims.com';

    /** Longest matching prefix wins, so generator-spare-parts beats generator-. */
    const SUBDOMAIN_MAP: [string, string][] = [
      // Blog — real articles. Direct equivalents first.
      ['/blog/generator-price', '/pricing/generator-prices-kenya'],
      ['/blog/100kva-vs', '/pricing/generator-prices-kenya'],
      ['/blog/second-hand-generators', '/generators/used'],
      ['/blog/cummins-generator', '/services/cummins-generators'],
      ['/blog/generator-maintenance', '/pricing/generator-service-cost-kenya'],
      ['/blog/generator-overhaul', '/generators/workshop-services'],
      ['/blog/generator-hire', '/generators/rental'],
      ['/blog/generator-sizing', '/hub'],
      ['/blog/solar-installation', '/pricing/solar-installation-cost-kenya'],
      ['/blog/solar', '/services/solar-energy'],
      ['/blog/borehole-pump', '/pricing/borehole-cost-kenya'],
      ['/blog/ups', '/pricing/ups-price-kenya'],
      ['/blog/automatic-transfer-switch', '/solutions/diesel-automation'],
      ['/blog/fuel-filters', '/generators/spare-parts'],
      ['/blog', '/blog'],
      ['/updates', '/blog'],

      // The doorway grid: 20 service families across 55 towns.
      ['/generator-spare-parts-', '/generators/spare-parts'],
      ['/generator-installation-', '/generators/installation'],
      ['/generator-repair-', '/services/generator-repairs'],
      ['/generator-sales-', '/generators'],
      ['/generator-hire-', '/generators/rental'],
      ['/engine-overhaul-', '/generators/workshop-services'],
      ['/amf-ats-installation-', '/solutions/diesel-automation'],
      ['/diesel-automation-', '/solutions/diesel-automation'],
      ['/distribution-boards-', '/services/distribution-boards'],
      ['/hv-systems-', '/solutions/high-voltage'],
      ['/motor-rewinding-', '/services/motor-rewinding'],
      ['/motors-drives-', '/services/motor-rewinding'],
      ['/steel-fabrication-', '/solutions/fabrication'],
      ['/hospital-incinerators-', '/services/hospital-incinerators'],
      ['/hvac-installation-', '/services/ac-installation'],
      ['/borehole-pumps-', '/services/borehole-pumps'],
      ['/ups-systems-', '/services/ups-systems'],
      ['/solar-installation-', '/services/solar-energy'],
      ['/commercial-solar-', '/solar'],
      ['/solar-sizing-', '/solutions/solar-sizing'],

      // One-offs.
      ['/sizing.html', '/solutions/solar-sizing'],
      ['/sitemap.xml', '/sitemap.xml'],
    ];

    const lower = pathname.toLowerCase();
    let target = '/';
    let longest = 0;
    for (const [prefix, dest] of SUBDOMAIN_MAP) {
      if (lower.startsWith(prefix) && prefix.length > longest) {
        longest = prefix.length;
        target = dest;
      }
    }
    /*
     * Unmatched paths fall to the www homepage WITHOUT carrying the old path.
     * www has no /some-old-page.html, so preserving it would redirect straight
     * into a 404 — worse than a homepage, which at least answers.
     */
    return NextResponse.redirect(new URL(target, WWW), {
      status: 301,
      headers: { 'X-Loc-Guard': 'subdomain-consolidation' },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  // 0a-pre. HARD 404 for a single-segment /locations/<slug> that is not a real
  //     place. Verified 2026-08-17: /locations/zzz999 returned HTTP 200 with two
  //     words of body and no noindex — an indexable empty page, produced for any
  //     string a crawler cares to try. That is a soft-404 generator, and
  //     site-wide quality is precisely what "crawled - currently not indexed"
  //     was about. Runs BEFORE the two-segment guard so ordering is explicit.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    const one = pathname.match(/^\/locations\/([^/]+)\/?$/);
    if (one) {
      let loc = one[1];
      try { loc = decodeURIComponent(loc); } catch { /* keep raw */ }
      // Inlined for the same reason as the sets below — no import can fail open.
      const REAL_LOC_ONE = new Set(['ahero','ainabkoi','ainamoi','aldai','alego-usonga','archer-post','athi-river','awendo','bahati','balambala','bamburi','banana','banissa','baragoi','baringo','baringo-central','baringo-north','baringo-south','belgut','bissil','bobasi','bomachoge-borabu','bomachoge-chache','bombolulu','bomet','bomet-central','bomet-east','bonchari','bondo','borabu','brooke','budalangi','bumula','bungoma','bura','bureti','burnt-forest','buruburu','busia','bute','butere','butula','buuri','cbd','central-imenti','changamwe','chavakali','chepalungu','chepareria','chepkorio','cherangany','chesumei','chogoria','chuka','chuka-igambangombe','chwele','dadaab','dagoretti-north','dagoretti-south','diani','doldol','donholm','eastleigh','ekerenyo','el-wak','eldama-ravine','eldas','eldoret','elementaita','elgeyo-marakwet','elwak','emali','embakasi','embakasi-central','embakasi-east','embakasi-north','embakasi-south','embakasi-west','embu','emgwen','emuhaya','emurua-dikirr','endebess','engineer','ewaso-nyiro','fafi','faza','funyula','galole','ganjoni','ganze','garbatulla','garissa','garissa-township','garsen','gatanga','gatundu','gatundu-north','gatundu-south','gem','gichugu','gigiri','gilgil','githunguri','githurai','griftu','habaswein','hamisi','hindi','hola','homa-bay','homa-bay-town','hurlingham','igembe-central','igembe-north','igembe-south','ijara','ikolomani','industrial-area','isebania','ishiara','isiolo','isiolo-north','isiolo-south','iten','jamhuri','jomvu','juja','kaanwa','kabarnet','kabartonjo','kabete','kabondo-kasipul','kabuchai','kacheliba','kagio','kahawa','kahawa-sukari','kaiti','kajiado','kajiado-central','kajiado-east','kajiado-north','kajiado-south','kajiado-west','kakamega','kakuma','kalokol','kaloleni','kamiti','kamukunji','kandara','kanduyi','kangari','kangema','kangemi','kangundo','kapenguria','kapsabet','kapseret','kapsowar','karachuonyo','karatina','karen','karuri','kasarani','kasipul','kathiani','kawangware','kehancha','keiyo-north','keiyo-south','kendu-bay','kenol','kenyatta-road','kericho','keroka','kerugoya','kesses','khwisero','kiambaa','kiambu','kianjai','kianyaga','kibera','kibra','kibwezi','kibwezi-east','kibwezi-west','kieni','kigumo','kiharu','kikuyu','kileleshwa','kilgoris','kilifi','kilifi-north','kilifi-south','kilimani','kilome','kimana','kimilili','kiminini','kinamba','kinango','kinangop','kinna','kinoo','kipini','kipipiri','kipkelion','kipkelion-east','kipkelion-west','kirinyaga','kirinyaga-central','kiritiri','kisauni','kiserian','kisii','kisumu','kisumu-central','kisumu-east','kisumu-west','kitale','kitengela','kitisuru','kitui','kitui-central','kitui-east','kitui-rural','kitui-south','kitui-west','kitutu-chache-north','kitutu-chache-south','kitutu-masaba','kizingo','kobujoi','kombewa','kondele','kongowea','konoin','kuresoi-north','kuresoi-south','kuria-east','kuria-west','kutus','kwale','kwanza','kyuso','laare','lafey','lagdera','laikipia','laikipia-east','laikipia-north','laikipia-west','laisamis','lamu','lamu-east','lamu-west','langata','lari','lavington','likoni','likuyani','limuru','litein','lodwar','loima','loitokitok','lokichar','lokichoggio','lokitaung','lolgorian','londiani','longisa','loresho','luanda','lugari','lunga-lunga','lurambi','maara','machakos','machakos-town','madogo','magadi','magarini','magutuni','mai-mahiu','majengo','makadara','makindu','makueni','makutano','makuyu','malaba','malakisi','malava','malindi','mandera','mandera-east','mandera-north','mandera-south','mandera-west','manga','manyatta','maragua','maragwa','marakwet-east','marakwet-west','maralal','marani','mariakani','marigat','marimanti','marsabit','masalani','maseno','masinga','matayos','mathare','mathioya','mathira','matuga','matungu','matungulu','matuu','maua','maungu','mavoko','mazeras','mbale','mbeere-north','mbeere-south','mbita','mbooni','membley','merti','meru','migori','migwani','mikindani','milimani','miritini','mlolongo','modogashe','mogotio','moi-bridge','moiben','mokowe','molo','mombasa','mombasa-cbd','mombasa-road','mosop','mosoriot','mount-elgon','mountain-view','moyale','mpeketoni','msambweni','mtito-andei','mtwapa','muhoroni','muhuru','mukurweini','mulot','mumias','mumias-east','mumias-west','muranga','muthaiga','mutomo','mvita','mwala','mwatate','mwea','mweiga','mwingi','mwingi-central','mwingi-north','mwingi-west','nairobi','nairobi-west','naivasha','nakuru','nakuru-town-east','nakuru-town-west','namanga','nambale','nandi','nandi-hills','nanyuki','narok','narok-east','narok-junction','narok-north','narok-south','narok-west','narumoru','navakholo','ndanai','ndaragwa','ndenderu','ndhiwa','ndia','ngara','ngong','ngong-road','ngumo','njabini','njoro','nkubu','north-horr','north-imenti','north-mugirango','nuu','nyahururu','nyakach','nyali','nyamache','nyamira','nyandarua','nyando','nyansiongo','nyaribari-chache','nyaribari-masaba','nyatike','nyeri','nyeri-town','ogembo','ol-jorok','ol-kalou','old-town','oloitokitok','ololulunga','ongata-rongai','ortum','othaya','oyugis','parklands','pokot-south','port-reitz','port-victoria','rabai','rangwe','rarieda','rhamu','rongai','rongo','roysambu','ruaraka','ruiru','rumuruti','runda','runyenjes','sabatia','saboti','sagana','saku','salgaa','samburu','samburu-east','samburu-north','samburu-west','seme','serem','shanzu','shimanzi','shimba-hills','shinyalu','siakago','siaya','sigor','sigowet-soin','silibwet','sirisia','sololo','sosiot','sotik','south-b','south-c','south-imenti','south-kinangop','south-mugirango','soy','spring-valley','starehe','suba-north','suba-south','subukia','suguta-marmar','sultan-hamud','suna-east','suna-west','suneka','suswa','syokimau','taita-taveta','takaba','takaungu','tala','tambach','tana-river','tarbaj','taveta','teso-north','teso-south','tetu','tharaka','tharaka-nithi','thika','thika-road','thika-town','tiaty','tigania-east','tigania-west','timau','tinderet','tongaren','trans-nzoia','tsavo','tudor','turbo','turkana','turkana-central','turkana-east','turkana-north','turkana-south','turkana-west','uasin-gishu','ugenya','ugunja','ukunda','ukwala','umoja','upperhill','uriri','usenge','vihiga','vipingo','voi','wajir','wajir-east','wajir-north','wajir-south','wajir-west','wamba','wamunyu','wangige','wanguru','watamu','webuye','webuye-east','webuye-west','west-mugirango','west-pokot','westlands','witu','woodley','wote','wundanyi','yala','yatta','zambezi','zimmerman','ziwa']);
      if (!REAL_LOC_ONE.has(loc)) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': '404-single',
          },
        });
      }
    }
  }

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
      /*
       * REAL_LOC — every slug getAllLocations() produces (counties, their
       * constituencies and their major towns). Inlined for the same reason
       * OK_LOC is: the edge bundle must not depend on an import that could
       * fail and fall open to 200.
       */
      const REAL_LOC = new Set(['ahero','ainabkoi','ainamoi','aldai','alego-usonga','archer-post','athi-river','awendo','bahati','balambala','bamburi','banana','banissa','baragoi','baringo','baringo-central','baringo-north','baringo-south','belgut','bissil','bobasi','bomachoge-borabu','bomachoge-chache','bombolulu','bomet','bomet-central','bomet-east','bonchari','bondo','borabu','brooke','budalangi','bumula','bungoma','bura','bureti','burnt-forest','buruburu','busia','bute','butere','butula','buuri','cbd','central-imenti','changamwe','chavakali','chepalungu','chepareria','chepkorio','cherangany','chesumei','chogoria','chuka','chuka-igambangombe','chwele','dadaab','dagoretti-north','dagoretti-south','diani','doldol','donholm','eastleigh','ekerenyo','el-wak','eldama-ravine','eldas','eldoret','elementaita','elgeyo-marakwet','elwak','emali','embakasi','embakasi-central','embakasi-east','embakasi-north','embakasi-south','embakasi-west','embu','emgwen','emuhaya','emurua-dikirr','endebess','engineer','ewaso-nyiro','fafi','faza','funyula','galole','ganjoni','ganze','garbatulla','garissa','garissa-township','garsen','gatanga','gatundu','gatundu-north','gatundu-south','gem','gichugu','gigiri','gilgil','githunguri','githurai','griftu','habaswein','hamisi','hindi','hola','homa-bay','homa-bay-town','hurlingham','igembe-central','igembe-north','igembe-south','ijara','ikolomani','industrial-area','isebania','ishiara','isiolo','isiolo-north','isiolo-south','iten','jamhuri','jomvu','juja','kaanwa','kabarnet','kabartonjo','kabete','kabondo-kasipul','kabuchai','kacheliba','kagio','kahawa','kahawa-sukari','kaiti','kajiado','kajiado-central','kajiado-east','kajiado-north','kajiado-south','kajiado-west','kakamega','kakuma','kalokol','kaloleni','kamiti','kamukunji','kandara','kanduyi','kangari','kangema','kangemi','kangundo','kapenguria','kapsabet','kapseret','kapsowar','karachuonyo','karatina','karen','karuri','kasarani','kasipul','kathiani','kawangware','kehancha','keiyo-north','keiyo-south','kendu-bay','kenol','kenyatta-road','kericho','keroka','kerugoya','kesses','khwisero','kiambaa','kiambu','kianjai','kianyaga','kibera','kibra','kibwezi','kibwezi-east','kibwezi-west','kieni','kigumo','kiharu','kikuyu','kileleshwa','kilgoris','kilifi','kilifi-north','kilifi-south','kilimani','kilome','kimana','kimilili','kiminini','kinamba','kinango','kinangop','kinna','kinoo','kipini','kipipiri','kipkelion','kipkelion-east','kipkelion-west','kirinyaga','kirinyaga-central','kiritiri','kisauni','kiserian','kisii','kisumu','kisumu-central','kisumu-east','kisumu-west','kitale','kitengela','kitisuru','kitui','kitui-central','kitui-east','kitui-rural','kitui-south','kitui-west','kitutu-chache-north','kitutu-chache-south','kitutu-masaba','kizingo','kobujoi','kombewa','kondele','kongowea','konoin','kuresoi-north','kuresoi-south','kuria-east','kuria-west','kutus','kwale','kwanza','kyuso','laare','lafey','lagdera','laikipia','laikipia-east','laikipia-north','laikipia-west','laisamis','lamu','lamu-east','lamu-west','langata','lari','lavington','likoni','likuyani','limuru','litein','lodwar','loima','loitokitok','lokichar','lokichoggio','lokitaung','lolgorian','londiani','longisa','loresho','luanda','lugari','lunga-lunga','lurambi','maara','machakos','machakos-town','madogo','magadi','magarini','magutuni','mai-mahiu','majengo','makadara','makindu','makueni','makutano','makuyu','malaba','malakisi','malava','malindi','mandera','mandera-east','mandera-north','mandera-south','mandera-west','manga','manyatta','maragua','maragwa','marakwet-east','marakwet-west','maralal','marani','mariakani','marigat','marimanti','marsabit','masalani','maseno','masinga','matayos','mathare','mathioya','mathira','matuga','matungu','matungulu','matuu','maua','maungu','mavoko','mazeras','mbale','mbeere-north','mbeere-south','mbita','mbooni','membley','merti','meru','migori','migwani','mikindani','milimani','miritini','mlolongo','modogashe','mogotio','moi-bridge','moiben','mokowe','molo','mombasa','mombasa-cbd','mombasa-road','mosop','mosoriot','mount-elgon','mountain-view','moyale','mpeketoni','msambweni','mtito-andei','mtwapa','muhoroni','muhuru','mukurweini','mulot','mumias','mumias-east','mumias-west','muranga','muthaiga','mutomo','mvita','mwala','mwatate','mwea','mweiga','mwingi','mwingi-central','mwingi-north','mwingi-west','nairobi','nairobi-west','naivasha','nakuru','nakuru-town-east','nakuru-town-west','namanga','nambale','nandi','nandi-hills','nanyuki','narok','narok-east','narok-junction','narok-north','narok-south','narok-west','narumoru','navakholo','ndanai','ndaragwa','ndenderu','ndhiwa','ndia','ngara','ngong','ngong-road','ngumo','njabini','njoro','nkubu','north-horr','north-imenti','north-mugirango','nuu','nyahururu','nyakach','nyali','nyamache','nyamira','nyandarua','nyando','nyansiongo','nyaribari-chache','nyaribari-masaba','nyatike','nyeri','nyeri-town','ogembo','ol-jorok','ol-kalou','old-town','oloitokitok','ololulunga','ongata-rongai','ortum','othaya','oyugis','parklands','pokot-south','port-reitz','port-victoria','rabai','rangwe','rarieda','rhamu','rongai','rongo','roysambu','ruaraka','ruiru','rumuruti','runda','runyenjes','sabatia','saboti','sagana','saku','salgaa','samburu','samburu-east','samburu-north','samburu-west','seme','serem','shanzu','shimanzi','shimba-hills','shinyalu','siakago','siaya','sigor','sigowet-soin','silibwet','sirisia','sololo','sosiot','sotik','south-b','south-c','south-imenti','south-kinangop','south-mugirango','soy','spring-valley','starehe','suba-north','suba-south','subukia','suguta-marmar','sultan-hamud','suna-east','suna-west','suneka','suswa','syokimau','taita-taveta','takaba','takaungu','tala','tambach','tana-river','tarbaj','taveta','teso-north','teso-south','tetu','tharaka','tharaka-nithi','thika','thika-road','thika-town','tiaty','tigania-east','tigania-west','timau','tinderet','tongaren','trans-nzoia','tsavo','tudor','turbo','turkana','turkana-central','turkana-east','turkana-north','turkana-south','turkana-west','uasin-gishu','ugenya','ugunja','ukunda','ukwala','umoja','upperhill','uriri','usenge','vihiga','vipingo','voi','wajir','wajir-east','wajir-north','wajir-south','wajir-west','wamba','wamunyu','wangige','wanguru','watamu','webuye','webuye-east','webuye-west','west-mugirango','west-pokot','westlands','witu','woodley','wote','wundanyi','yala','yatta','zambezi','zimmerman','ziwa']);

      if (!(OK_LOC.has(loc) && OK_SVC.has(svc))) {
        /*
         * REDIRECT RATHER THAN 404 WHEN THE PLACE IS REAL.
         *
         * Only 26 locations x 8 services render, but Google indexed the wider
         * set and still ranks it. Verified 2026-08-17: a site: search returned
         * /locations/kilome/generator-diagnostics and
         * /locations/nandi/generator-diagnostics as live results, and BOTH
         * returned this 404. Someone searching "generator diagnostics Nandi"
         * found us, clicked, and got a plain-text "Not Found".
         *
         * The parent page is real and substantial — 12 of 12 sampled
         * /locations/<slug> pages rendered 500+ words — so sending the visitor
         * there keeps them on the site and passes the ranking signal on,
         * instead of throwing the click away.
         *
         * 308 keeps it permanent and method-safe. A bogus location still 404s:
         * we redirect because the PLACE exists, not merely because a URL was
         * requested.
         */
        if (REAL_LOC.has(loc)) {
          const to = new URL('/locations/' + loc, request.url);
          return NextResponse.redirect(to, {
            status: 308,
            headers: { 'X-Loc-Guard': 'redirect-to-location' },
          });
        }
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
      // RETAINED (no longer used by the logic below, kept for reference)
      const CORE_SVC = new Set(['generator-companies','generators','generator-repairs','generator-maintenance','generator-spare-parts','solar-installation','solar-companies','motor-rewinding','ups-systems','electrical-services']);
      const PRIORITY = new Set(['nairobi','mombasa','kisumu','nakuru','kiambu','machakos','kajiado','nyeri','meru','uasin-gishu']);
      const OK_KENYA_PATHS = new Set(['baringo/electrical-services','baringo/generator-companies','baringo/generator-maintenance','baringo/generator-repairs','baringo/generator-spare-parts','baringo/generators','baringo/motor-rewinding','baringo/solar-companies','baringo/solar-installation','baringo/ups-systems','bomet/electrical-services','bomet/generator-companies','bomet/generator-maintenance','bomet/generator-repairs','bomet/generator-spare-parts','bomet/generators','bomet/motor-rewinding','bomet/solar-companies','bomet/solar-installation','bomet/ups-systems','bungoma/electrical-services','bungoma/generator-companies','bungoma/generator-maintenance','bungoma/generator-repairs','bungoma/generator-spare-parts','bungoma/generators','bungoma/motor-rewinding','bungoma/solar-companies','bungoma/solar-installation','bungoma/ups-systems','busia/electrical-services','busia/generator-companies','busia/generator-maintenance','busia/generator-repairs','busia/generator-spare-parts','busia/generators','busia/motor-rewinding','busia/solar-companies','busia/solar-installation','busia/ups-systems','elgeyo-marakwet/electrical-services','elgeyo-marakwet/generator-companies','elgeyo-marakwet/generator-maintenance','elgeyo-marakwet/generator-repairs','elgeyo-marakwet/generator-spare-parts','elgeyo-marakwet/generators','elgeyo-marakwet/motor-rewinding','elgeyo-marakwet/solar-companies','elgeyo-marakwet/solar-installation','elgeyo-marakwet/ups-systems','embu/electrical-services','embu/generator-companies','embu/generator-maintenance','embu/generator-repairs','embu/generator-spare-parts','embu/generators','embu/motor-rewinding','embu/solar-companies','embu/solar-installation','embu/ups-systems','garissa/electrical-services','garissa/generator-companies','garissa/generator-maintenance','garissa/generator-repairs','garissa/generator-spare-parts','garissa/generators','garissa/motor-rewinding','garissa/solar-companies','garissa/solar-installation','garissa/ups-systems','homa-bay/electrical-services','homa-bay/generator-companies','homa-bay/generator-maintenance','homa-bay/generator-repairs','homa-bay/generator-spare-parts','homa-bay/generators','homa-bay/motor-rewinding','homa-bay/solar-companies','homa-bay/solar-installation','homa-bay/ups-systems','isiolo/electrical-services','isiolo/generator-companies','isiolo/generator-maintenance','isiolo/generator-repairs','isiolo/generator-spare-parts','isiolo/generators','isiolo/motor-rewinding','isiolo/solar-companies','isiolo/solar-installation','isiolo/ups-systems','kajiado/electrical-services','kajiado/generator-companies','kajiado/generator-maintenance','kajiado/generator-repairs','kajiado/generator-spare-parts','kajiado/generators','kajiado/kajiado-central','kajiado/kajiado-central/electrical-services','kajiado/kajiado-central/generator-companies','kajiado/kajiado-central/generator-maintenance','kajiado/kajiado-central/generator-repairs','kajiado/kajiado-central/generator-spare-parts','kajiado/kajiado-central/generators','kajiado/kajiado-central/motor-rewinding','kajiado/kajiado-central/solar-companies','kajiado/kajiado-central/solar-installation','kajiado/kajiado-central/ups-systems','kajiado/kajiado-east','kajiado/kajiado-east/electrical-services','kajiado/kajiado-east/generator-companies','kajiado/kajiado-east/generator-maintenance','kajiado/kajiado-east/generator-repairs','kajiado/kajiado-east/generator-spare-parts','kajiado/kajiado-east/generators','kajiado/kajiado-east/motor-rewinding','kajiado/kajiado-east/solar-companies','kajiado/kajiado-east/solar-installation','kajiado/kajiado-east/ups-systems','kajiado/kajiado-north','kajiado/kajiado-north/electrical-services','kajiado/kajiado-north/generator-companies','kajiado/kajiado-north/generator-maintenance','kajiado/kajiado-north/generator-repairs','kajiado/kajiado-north/generator-spare-parts','kajiado/kajiado-north/generators','kajiado/kajiado-north/motor-rewinding','kajiado/kajiado-north/solar-companies','kajiado/kajiado-north/solar-installation','kajiado/kajiado-north/ups-systems','kajiado/kajiado-south','kajiado/kajiado-south/electrical-services','kajiado/kajiado-south/generator-companies','kajiado/kajiado-south/generator-maintenance','kajiado/kajiado-south/generator-repairs','kajiado/kajiado-south/generator-spare-parts','kajiado/kajiado-south/generators','kajiado/kajiado-south/motor-rewinding','kajiado/kajiado-south/solar-companies','kajiado/kajiado-south/solar-installation','kajiado/kajiado-south/ups-systems','kajiado/kajiado-west','kajiado/kajiado-west/electrical-services','kajiado/kajiado-west/generator-companies','kajiado/kajiado-west/generator-maintenance','kajiado/kajiado-west/generator-repairs','kajiado/kajiado-west/generator-spare-parts','kajiado/kajiado-west/generators','kajiado/kajiado-west/motor-rewinding','kajiado/kajiado-west/solar-companies','kajiado/kajiado-west/solar-installation','kajiado/kajiado-west/ups-systems','kajiado/motor-rewinding','kajiado/solar-companies','kajiado/solar-installation','kajiado/ups-systems','kakamega/electrical-services','kakamega/generator-companies','kakamega/generator-maintenance','kakamega/generator-repairs','kakamega/generator-spare-parts','kakamega/generators','kakamega/motor-rewinding','kakamega/solar-companies','kakamega/solar-installation','kakamega/ups-systems','kericho/electrical-services','kericho/generator-companies','kericho/generator-maintenance','kericho/generator-repairs','kericho/generator-spare-parts','kericho/generators','kericho/motor-rewinding','kericho/solar-companies','kericho/solar-installation','kericho/ups-systems','kiambu/electrical-services','kiambu/gatundu-north','kiambu/gatundu-north/electrical-services','kiambu/gatundu-north/generator-companies','kiambu/gatundu-north/generator-maintenance','kiambu/gatundu-north/generator-repairs','kiambu/gatundu-north/generator-spare-parts','kiambu/gatundu-north/generators','kiambu/gatundu-north/motor-rewinding','kiambu/gatundu-north/solar-companies','kiambu/gatundu-north/solar-installation','kiambu/gatundu-north/ups-systems','kiambu/gatundu-south','kiambu/gatundu-south/electrical-services','kiambu/gatundu-south/generator-companies','kiambu/gatundu-south/generator-maintenance','kiambu/gatundu-south/generator-repairs','kiambu/gatundu-south/generator-spare-parts','kiambu/gatundu-south/generators','kiambu/gatundu-south/motor-rewinding','kiambu/gatundu-south/solar-companies','kiambu/gatundu-south/solar-installation','kiambu/gatundu-south/ups-systems','kiambu/generator-companies','kiambu/generator-maintenance','kiambu/generator-repairs','kiambu/generator-spare-parts','kiambu/generators','kiambu/githunguri','kiambu/githunguri/electrical-services','kiambu/githunguri/generator-companies','kiambu/githunguri/generator-maintenance','kiambu/githunguri/generator-repairs','kiambu/githunguri/generator-spare-parts','kiambu/githunguri/generators','kiambu/githunguri/motor-rewinding','kiambu/githunguri/solar-companies','kiambu/githunguri/solar-installation','kiambu/githunguri/ups-systems','kiambu/juja','kiambu/juja/electrical-services','kiambu/juja/generator-companies','kiambu/juja/generator-maintenance','kiambu/juja/generator-repairs','kiambu/juja/generator-spare-parts','kiambu/juja/generators','kiambu/juja/motor-rewinding','kiambu/juja/solar-companies','kiambu/juja/solar-installation','kiambu/juja/ups-systems','kiambu/kabete','kiambu/kabete/electrical-services','kiambu/kabete/generator-companies','kiambu/kabete/generator-maintenance','kiambu/kabete/generator-repairs','kiambu/kabete/generator-spare-parts','kiambu/kabete/generators','kiambu/kabete/motor-rewinding','kiambu/kabete/solar-companies','kiambu/kabete/solar-installation','kiambu/kabete/ups-systems','kiambu/kiambaa','kiambu/kiambaa/electrical-services','kiambu/kiambaa/generator-companies','kiambu/kiambaa/generator-maintenance','kiambu/kiambaa/generator-repairs','kiambu/kiambaa/generator-spare-parts','kiambu/kiambaa/generators','kiambu/kiambaa/motor-rewinding','kiambu/kiambaa/solar-companies','kiambu/kiambaa/solar-installation','kiambu/kiambaa/ups-systems','kiambu/kiambu-town','kiambu/kiambu-town/electrical-services','kiambu/kiambu-town/generator-companies','kiambu/kiambu-town/generator-maintenance','kiambu/kiambu-town/generator-repairs','kiambu/kiambu-town/generator-spare-parts','kiambu/kiambu-town/generators','kiambu/kiambu-town/motor-rewinding','kiambu/kiambu-town/solar-companies','kiambu/kiambu-town/solar-installation','kiambu/kiambu-town/ups-systems','kiambu/kikuyu','kiambu/kikuyu/electrical-services','kiambu/kikuyu/generator-companies','kiambu/kikuyu/generator-maintenance','kiambu/kikuyu/generator-repairs','kiambu/kikuyu/generator-spare-parts','kiambu/kikuyu/generators','kiambu/kikuyu/motor-rewinding','kiambu/kikuyu/solar-companies','kiambu/kikuyu/solar-installation','kiambu/kikuyu/ups-systems','kiambu/lari','kiambu/lari/electrical-services','kiambu/lari/generator-companies','kiambu/lari/generator-maintenance','kiambu/lari/generator-repairs','kiambu/lari/generator-spare-parts','kiambu/lari/generators','kiambu/lari/motor-rewinding','kiambu/lari/solar-companies','kiambu/lari/solar-installation','kiambu/lari/ups-systems','kiambu/limuru','kiambu/limuru/electrical-services','kiambu/limuru/generator-companies','kiambu/limuru/generator-maintenance','kiambu/limuru/generator-repairs','kiambu/limuru/generator-spare-parts','kiambu/limuru/generators','kiambu/limuru/motor-rewinding','kiambu/limuru/solar-companies','kiambu/limuru/solar-installation','kiambu/limuru/ups-systems','kiambu/motor-rewinding','kiambu/ruiru','kiambu/ruiru/electrical-services','kiambu/ruiru/generator-companies','kiambu/ruiru/generator-maintenance','kiambu/ruiru/generator-repairs','kiambu/ruiru/generator-spare-parts','kiambu/ruiru/generators','kiambu/ruiru/motor-rewinding','kiambu/ruiru/solar-companies','kiambu/ruiru/solar-installation','kiambu/ruiru/ups-systems','kiambu/solar-companies','kiambu/solar-installation','kiambu/thika-town','kiambu/thika-town/electrical-services','kiambu/thika-town/generator-companies','kiambu/thika-town/generator-maintenance','kiambu/thika-town/generator-repairs','kiambu/thika-town/generator-spare-parts','kiambu/thika-town/generators','kiambu/thika-town/motor-rewinding','kiambu/thika-town/solar-companies','kiambu/thika-town/solar-installation','kiambu/thika-town/ups-systems','kiambu/ups-systems','kilifi/electrical-services','kilifi/generator-companies','kilifi/generator-maintenance','kilifi/generator-repairs','kilifi/generator-spare-parts','kilifi/generators','kilifi/motor-rewinding','kilifi/solar-companies','kilifi/solar-installation','kilifi/ups-systems','kirinyaga/electrical-services','kirinyaga/generator-companies','kirinyaga/generator-maintenance','kirinyaga/generator-repairs','kirinyaga/generator-spare-parts','kirinyaga/generators','kirinyaga/motor-rewinding','kirinyaga/solar-companies','kirinyaga/solar-installation','kirinyaga/ups-systems','kisii/electrical-services','kisii/generator-companies','kisii/generator-maintenance','kisii/generator-repairs','kisii/generator-spare-parts','kisii/generators','kisii/motor-rewinding','kisii/solar-companies','kisii/solar-installation','kisii/ups-systems','kisumu/electrical-services','kisumu/generator-companies','kisumu/generator-maintenance','kisumu/generator-repairs','kisumu/generator-spare-parts','kisumu/generators','kisumu/kisumu-central','kisumu/kisumu-central/electrical-services','kisumu/kisumu-central/generator-companies','kisumu/kisumu-central/generator-maintenance','kisumu/kisumu-central/generator-repairs','kisumu/kisumu-central/generator-spare-parts','kisumu/kisumu-central/generators','kisumu/kisumu-central/motor-rewinding','kisumu/kisumu-central/solar-companies','kisumu/kisumu-central/solar-installation','kisumu/kisumu-central/ups-systems','kisumu/kisumu-east','kisumu/kisumu-east/electrical-services','kisumu/kisumu-east/generator-companies','kisumu/kisumu-east/generator-maintenance','kisumu/kisumu-east/generator-repairs','kisumu/kisumu-east/generator-spare-parts','kisumu/kisumu-east/generators','kisumu/kisumu-east/motor-rewinding','kisumu/kisumu-east/solar-companies','kisumu/kisumu-east/solar-installation','kisumu/kisumu-east/ups-systems','kisumu/kisumu-west','kisumu/kisumu-west/electrical-services','kisumu/kisumu-west/generator-companies','kisumu/kisumu-west/generator-maintenance','kisumu/kisumu-west/generator-repairs','kisumu/kisumu-west/generator-spare-parts','kisumu/kisumu-west/generators','kisumu/kisumu-west/motor-rewinding','kisumu/kisumu-west/solar-companies','kisumu/kisumu-west/solar-installation','kisumu/kisumu-west/ups-systems','kisumu/motor-rewinding','kisumu/muhoroni','kisumu/muhoroni/electrical-services','kisumu/muhoroni/generator-companies','kisumu/muhoroni/generator-maintenance','kisumu/muhoroni/generator-repairs','kisumu/muhoroni/generator-spare-parts','kisumu/muhoroni/generators','kisumu/muhoroni/motor-rewinding','kisumu/muhoroni/solar-companies','kisumu/muhoroni/solar-installation','kisumu/muhoroni/ups-systems','kisumu/nyakach','kisumu/nyakach/electrical-services','kisumu/nyakach/generator-companies','kisumu/nyakach/generator-maintenance','kisumu/nyakach/generator-repairs','kisumu/nyakach/generator-spare-parts','kisumu/nyakach/generators','kisumu/nyakach/motor-rewinding','kisumu/nyakach/solar-companies','kisumu/nyakach/solar-installation','kisumu/nyakach/ups-systems','kisumu/nyando','kisumu/nyando/electrical-services','kisumu/nyando/generator-companies','kisumu/nyando/generator-maintenance','kisumu/nyando/generator-repairs','kisumu/nyando/generator-spare-parts','kisumu/nyando/generators','kisumu/nyando/motor-rewinding','kisumu/nyando/solar-companies','kisumu/nyando/solar-installation','kisumu/nyando/ups-systems','kisumu/seme','kisumu/seme/electrical-services','kisumu/seme/generator-companies','kisumu/seme/generator-maintenance','kisumu/seme/generator-repairs','kisumu/seme/generator-spare-parts','kisumu/seme/generators','kisumu/seme/motor-rewinding','kisumu/seme/solar-companies','kisumu/seme/solar-installation','kisumu/seme/ups-systems','kisumu/solar-companies','kisumu/solar-installation','kisumu/ups-systems','kitui/electrical-services','kitui/generator-companies','kitui/generator-maintenance','kitui/generator-repairs','kitui/generator-spare-parts','kitui/generators','kitui/motor-rewinding','kitui/solar-companies','kitui/solar-installation','kitui/ups-systems','kwale/electrical-services','kwale/generator-companies','kwale/generator-maintenance','kwale/generator-repairs','kwale/generator-spare-parts','kwale/generators','kwale/motor-rewinding','kwale/solar-companies','kwale/solar-installation','kwale/ups-systems','laikipia/electrical-services','laikipia/generator-companies','laikipia/generator-maintenance','laikipia/generator-repairs','laikipia/generator-spare-parts','laikipia/generators','laikipia/motor-rewinding','laikipia/solar-companies','laikipia/solar-installation','laikipia/ups-systems','lamu/electrical-services','lamu/generator-companies','lamu/generator-maintenance','lamu/generator-repairs','lamu/generator-spare-parts','lamu/generators','lamu/motor-rewinding','lamu/solar-companies','lamu/solar-installation','lamu/ups-systems','machakos/electrical-services','machakos/generator-companies','machakos/generator-maintenance','machakos/generator-repairs','machakos/generator-spare-parts','machakos/generators','machakos/kangundo','machakos/kangundo/electrical-services','machakos/kangundo/generator-companies','machakos/kangundo/generator-maintenance','machakos/kangundo/generator-repairs','machakos/kangundo/generator-spare-parts','machakos/kangundo/generators','machakos/kangundo/motor-rewinding','machakos/kangundo/solar-companies','machakos/kangundo/solar-installation','machakos/kangundo/ups-systems','machakos/kathiani','machakos/kathiani/electrical-services','machakos/kathiani/generator-companies','machakos/kathiani/generator-maintenance','machakos/kathiani/generator-repairs','machakos/kathiani/generator-spare-parts','machakos/kathiani/generators','machakos/kathiani/motor-rewinding','machakos/kathiani/solar-companies','machakos/kathiani/solar-installation','machakos/kathiani/ups-systems','machakos/machakos-town','machakos/machakos-town/electrical-services','machakos/machakos-town/generator-companies','machakos/machakos-town/generator-maintenance','machakos/machakos-town/generator-repairs','machakos/machakos-town/generator-spare-parts','machakos/machakos-town/generators','machakos/machakos-town/motor-rewinding','machakos/machakos-town/solar-companies','machakos/machakos-town/solar-installation','machakos/machakos-town/ups-systems','machakos/masinga','machakos/masinga/electrical-services','machakos/masinga/generator-companies','machakos/masinga/generator-maintenance','machakos/masinga/generator-repairs','machakos/masinga/generator-spare-parts','machakos/masinga/generators','machakos/masinga/motor-rewinding','machakos/masinga/solar-companies','machakos/masinga/solar-installation','machakos/masinga/ups-systems','machakos/matungulu','machakos/matungulu/electrical-services','machakos/matungulu/generator-companies','machakos/matungulu/generator-maintenance','machakos/matungulu/generator-repairs','machakos/matungulu/generator-spare-parts','machakos/matungulu/generators','machakos/matungulu/motor-rewinding','machakos/matungulu/solar-companies','machakos/matungulu/solar-installation','machakos/matungulu/ups-systems','machakos/mavoko','machakos/mavoko/electrical-services','machakos/mavoko/generator-companies','machakos/mavoko/generator-maintenance','machakos/mavoko/generator-repairs','machakos/mavoko/generator-spare-parts','machakos/mavoko/generators','machakos/mavoko/motor-rewinding','machakos/mavoko/solar-companies','machakos/mavoko/solar-installation','machakos/mavoko/ups-systems','machakos/motor-rewinding','machakos/mwala','machakos/mwala/electrical-services','machakos/mwala/generator-companies','machakos/mwala/generator-maintenance','machakos/mwala/generator-repairs','machakos/mwala/generator-spare-parts','machakos/mwala/generators','machakos/mwala/motor-rewinding','machakos/mwala/solar-companies','machakos/mwala/solar-installation','machakos/mwala/ups-systems','machakos/solar-companies','machakos/solar-installation','machakos/ups-systems','machakos/yatta','machakos/yatta/electrical-services','machakos/yatta/generator-companies','machakos/yatta/generator-maintenance','machakos/yatta/generator-repairs','machakos/yatta/generator-spare-parts','machakos/yatta/generators','machakos/yatta/motor-rewinding','machakos/yatta/solar-companies','machakos/yatta/solar-installation','machakos/yatta/ups-systems','makueni/electrical-services','makueni/generator-companies','makueni/generator-maintenance','makueni/generator-repairs','makueni/generator-spare-parts','makueni/generators','makueni/motor-rewinding','makueni/solar-companies','makueni/solar-installation','makueni/ups-systems','mandera/electrical-services','mandera/generator-companies','mandera/generator-maintenance','mandera/generator-repairs','mandera/generator-spare-parts','mandera/generators','mandera/motor-rewinding','mandera/solar-companies','mandera/solar-installation','mandera/ups-systems','marsabit/electrical-services','marsabit/generator-companies','marsabit/generator-maintenance','marsabit/generator-repairs','marsabit/generator-spare-parts','marsabit/generators','marsabit/motor-rewinding','marsabit/solar-companies','marsabit/solar-installation','marsabit/ups-systems','meru/buuri','meru/buuri/electrical-services','meru/buuri/generator-companies','meru/buuri/generator-maintenance','meru/buuri/generator-repairs','meru/buuri/generator-spare-parts','meru/buuri/generators','meru/buuri/motor-rewinding','meru/buuri/solar-companies','meru/buuri/solar-installation','meru/buuri/ups-systems','meru/central-imenti','meru/central-imenti/electrical-services','meru/central-imenti/generator-companies','meru/central-imenti/generator-maintenance','meru/central-imenti/generator-repairs','meru/central-imenti/generator-spare-parts','meru/central-imenti/generators','meru/central-imenti/motor-rewinding','meru/central-imenti/solar-companies','meru/central-imenti/solar-installation','meru/central-imenti/ups-systems','meru/electrical-services','meru/generator-companies','meru/generator-maintenance','meru/generator-repairs','meru/generator-spare-parts','meru/generators','meru/igembe-central','meru/igembe-central/electrical-services','meru/igembe-central/generator-companies','meru/igembe-central/generator-maintenance','meru/igembe-central/generator-repairs','meru/igembe-central/generator-spare-parts','meru/igembe-central/generators','meru/igembe-central/motor-rewinding','meru/igembe-central/solar-companies','meru/igembe-central/solar-installation','meru/igembe-central/ups-systems','meru/igembe-north','meru/igembe-north/electrical-services','meru/igembe-north/generator-companies','meru/igembe-north/generator-maintenance','meru/igembe-north/generator-repairs','meru/igembe-north/generator-spare-parts','meru/igembe-north/generators','meru/igembe-north/motor-rewinding','meru/igembe-north/solar-companies','meru/igembe-north/solar-installation','meru/igembe-north/ups-systems','meru/igembe-south','meru/igembe-south/electrical-services','meru/igembe-south/generator-companies','meru/igembe-south/generator-maintenance','meru/igembe-south/generator-repairs','meru/igembe-south/generator-spare-parts','meru/igembe-south/generators','meru/igembe-south/motor-rewinding','meru/igembe-south/solar-companies','meru/igembe-south/solar-installation','meru/igembe-south/ups-systems','meru/motor-rewinding','meru/north-imenti','meru/north-imenti/electrical-services','meru/north-imenti/generator-companies','meru/north-imenti/generator-maintenance','meru/north-imenti/generator-repairs','meru/north-imenti/generator-spare-parts','meru/north-imenti/generators','meru/north-imenti/motor-rewinding','meru/north-imenti/solar-companies','meru/north-imenti/solar-installation','meru/north-imenti/ups-systems','meru/solar-companies','meru/solar-installation','meru/south-imenti','meru/south-imenti/electrical-services','meru/south-imenti/generator-companies','meru/south-imenti/generator-maintenance','meru/south-imenti/generator-repairs','meru/south-imenti/generator-spare-parts','meru/south-imenti/generators','meru/south-imenti/motor-rewinding','meru/south-imenti/solar-companies','meru/south-imenti/solar-installation','meru/south-imenti/ups-systems','meru/tigania-east','meru/tigania-east/electrical-services','meru/tigania-east/generator-companies','meru/tigania-east/generator-maintenance','meru/tigania-east/generator-repairs','meru/tigania-east/generator-spare-parts','meru/tigania-east/generators','meru/tigania-east/motor-rewinding','meru/tigania-east/solar-companies','meru/tigania-east/solar-installation','meru/tigania-east/ups-systems','meru/tigania-west','meru/tigania-west/electrical-services','meru/tigania-west/generator-companies','meru/tigania-west/generator-maintenance','meru/tigania-west/generator-repairs','meru/tigania-west/generator-spare-parts','meru/tigania-west/generators','meru/tigania-west/motor-rewinding','meru/tigania-west/solar-companies','meru/tigania-west/solar-installation','meru/tigania-west/ups-systems','meru/ups-systems','migori/electrical-services','migori/generator-companies','migori/generator-maintenance','migori/generator-repairs','migori/generator-spare-parts','migori/generators','migori/motor-rewinding','migori/solar-companies','migori/solar-installation','migori/ups-systems','mombasa/changamwe','mombasa/changamwe/electrical-services','mombasa/changamwe/generator-companies','mombasa/changamwe/generator-maintenance','mombasa/changamwe/generator-repairs','mombasa/changamwe/generator-spare-parts','mombasa/changamwe/generators','mombasa/changamwe/motor-rewinding','mombasa/changamwe/solar-companies','mombasa/changamwe/solar-installation','mombasa/changamwe/ups-systems','mombasa/electrical-services','mombasa/generator-companies','mombasa/generator-maintenance','mombasa/generator-repairs','mombasa/generator-spare-parts','mombasa/generators','mombasa/jomvu','mombasa/jomvu/electrical-services','mombasa/jomvu/generator-companies','mombasa/jomvu/generator-maintenance','mombasa/jomvu/generator-repairs','mombasa/jomvu/generator-spare-parts','mombasa/jomvu/generators','mombasa/jomvu/motor-rewinding','mombasa/jomvu/solar-companies','mombasa/jomvu/solar-installation','mombasa/jomvu/ups-systems','mombasa/kisauni','mombasa/kisauni/electrical-services','mombasa/kisauni/generator-companies','mombasa/kisauni/generator-maintenance','mombasa/kisauni/generator-repairs','mombasa/kisauni/generator-spare-parts','mombasa/kisauni/generators','mombasa/kisauni/motor-rewinding','mombasa/kisauni/solar-companies','mombasa/kisauni/solar-installation','mombasa/kisauni/ups-systems','mombasa/likoni','mombasa/likoni/electrical-services','mombasa/likoni/generator-companies','mombasa/likoni/generator-maintenance','mombasa/likoni/generator-repairs','mombasa/likoni/generator-spare-parts','mombasa/likoni/generators','mombasa/likoni/motor-rewinding','mombasa/likoni/solar-companies','mombasa/likoni/solar-installation','mombasa/likoni/ups-systems','mombasa/motor-rewinding','mombasa/mvita','mombasa/mvita/electrical-services','mombasa/mvita/generator-companies','mombasa/mvita/generator-maintenance','mombasa/mvita/generator-repairs','mombasa/mvita/generator-spare-parts','mombasa/mvita/generators','mombasa/mvita/motor-rewinding','mombasa/mvita/solar-companies','mombasa/mvita/solar-installation','mombasa/mvita/ups-systems','mombasa/nyali','mombasa/nyali/electrical-services','mombasa/nyali/generator-companies','mombasa/nyali/generator-maintenance','mombasa/nyali/generator-repairs','mombasa/nyali/generator-spare-parts','mombasa/nyali/generators','mombasa/nyali/motor-rewinding','mombasa/nyali/solar-companies','mombasa/nyali/solar-installation','mombasa/nyali/ups-systems','mombasa/solar-companies','mombasa/solar-installation','mombasa/ups-systems','muranga/electrical-services','muranga/generator-companies','muranga/generator-maintenance','muranga/generator-repairs','muranga/generator-spare-parts','muranga/generators','muranga/motor-rewinding','muranga/solar-companies','muranga/solar-installation','muranga/ups-systems','nairobi/dagoretti-north','nairobi/dagoretti-north/electrical-services','nairobi/dagoretti-north/generator-companies','nairobi/dagoretti-north/generator-maintenance','nairobi/dagoretti-north/generator-repairs','nairobi/dagoretti-north/generator-spare-parts','nairobi/dagoretti-north/generators','nairobi/dagoretti-north/motor-rewinding','nairobi/dagoretti-north/solar-companies','nairobi/dagoretti-north/solar-installation','nairobi/dagoretti-north/ups-systems','nairobi/dagoretti-south','nairobi/dagoretti-south/electrical-services','nairobi/dagoretti-south/generator-companies','nairobi/dagoretti-south/generator-maintenance','nairobi/dagoretti-south/generator-repairs','nairobi/dagoretti-south/generator-spare-parts','nairobi/dagoretti-south/generators','nairobi/dagoretti-south/motor-rewinding','nairobi/dagoretti-south/solar-companies','nairobi/dagoretti-south/solar-installation','nairobi/dagoretti-south/ups-systems','nairobi/electrical-services','nairobi/embakasi-central','nairobi/embakasi-central/electrical-services','nairobi/embakasi-central/generator-companies','nairobi/embakasi-central/generator-maintenance','nairobi/embakasi-central/generator-repairs','nairobi/embakasi-central/generator-spare-parts','nairobi/embakasi-central/generators','nairobi/embakasi-central/motor-rewinding','nairobi/embakasi-central/solar-companies','nairobi/embakasi-central/solar-installation','nairobi/embakasi-central/ups-systems','nairobi/embakasi-east','nairobi/embakasi-east/electrical-services','nairobi/embakasi-east/generator-companies','nairobi/embakasi-east/generator-maintenance','nairobi/embakasi-east/generator-repairs','nairobi/embakasi-east/generator-spare-parts','nairobi/embakasi-east/generators','nairobi/embakasi-east/motor-rewinding','nairobi/embakasi-east/solar-companies','nairobi/embakasi-east/solar-installation','nairobi/embakasi-east/ups-systems','nairobi/embakasi-north','nairobi/embakasi-north/electrical-services','nairobi/embakasi-north/generator-companies','nairobi/embakasi-north/generator-maintenance','nairobi/embakasi-north/generator-repairs','nairobi/embakasi-north/generator-spare-parts','nairobi/embakasi-north/generators','nairobi/embakasi-north/motor-rewinding','nairobi/embakasi-north/solar-companies','nairobi/embakasi-north/solar-installation','nairobi/embakasi-north/ups-systems','nairobi/embakasi-south','nairobi/embakasi-south/electrical-services','nairobi/embakasi-south/generator-companies','nairobi/embakasi-south/generator-maintenance','nairobi/embakasi-south/generator-repairs','nairobi/embakasi-south/generator-spare-parts','nairobi/embakasi-south/generators','nairobi/embakasi-south/motor-rewinding','nairobi/embakasi-south/solar-companies','nairobi/embakasi-south/solar-installation','nairobi/embakasi-south/ups-systems','nairobi/embakasi-west','nairobi/embakasi-west/electrical-services','nairobi/embakasi-west/generator-companies','nairobi/embakasi-west/generator-maintenance','nairobi/embakasi-west/generator-repairs','nairobi/embakasi-west/generator-spare-parts','nairobi/embakasi-west/generators','nairobi/embakasi-west/motor-rewinding','nairobi/embakasi-west/solar-companies','nairobi/embakasi-west/solar-installation','nairobi/embakasi-west/ups-systems','nairobi/generator-companies','nairobi/generator-maintenance','nairobi/generator-repairs','nairobi/generator-spare-parts','nairobi/generators','nairobi/kamukunji','nairobi/kamukunji/electrical-services','nairobi/kamukunji/generator-companies','nairobi/kamukunji/generator-maintenance','nairobi/kamukunji/generator-repairs','nairobi/kamukunji/generator-spare-parts','nairobi/kamukunji/generators','nairobi/kamukunji/motor-rewinding','nairobi/kamukunji/solar-companies','nairobi/kamukunji/solar-installation','nairobi/kamukunji/ups-systems','nairobi/kasarani','nairobi/kasarani/electrical-services','nairobi/kasarani/generator-companies','nairobi/kasarani/generator-maintenance','nairobi/kasarani/generator-repairs','nairobi/kasarani/generator-spare-parts','nairobi/kasarani/generators','nairobi/kasarani/motor-rewinding','nairobi/kasarani/solar-companies','nairobi/kasarani/solar-installation','nairobi/kasarani/ups-systems','nairobi/kibra','nairobi/kibra/electrical-services','nairobi/kibra/generator-companies','nairobi/kibra/generator-maintenance','nairobi/kibra/generator-repairs','nairobi/kibra/generator-spare-parts','nairobi/kibra/generators','nairobi/kibra/motor-rewinding','nairobi/kibra/solar-companies','nairobi/kibra/solar-installation','nairobi/kibra/ups-systems','nairobi/langata','nairobi/langata/electrical-services','nairobi/langata/generator-companies','nairobi/langata/generator-maintenance','nairobi/langata/generator-repairs','nairobi/langata/generator-spare-parts','nairobi/langata/generators','nairobi/langata/motor-rewinding','nairobi/langata/solar-companies','nairobi/langata/solar-installation','nairobi/langata/ups-systems','nairobi/makadara','nairobi/makadara/electrical-services','nairobi/makadara/generator-companies','nairobi/makadara/generator-maintenance','nairobi/makadara/generator-repairs','nairobi/makadara/generator-spare-parts','nairobi/makadara/generators','nairobi/makadara/motor-rewinding','nairobi/makadara/solar-companies','nairobi/makadara/solar-installation','nairobi/makadara/ups-systems','nairobi/mathare','nairobi/mathare/electrical-services','nairobi/mathare/generator-companies','nairobi/mathare/generator-maintenance','nairobi/mathare/generator-repairs','nairobi/mathare/generator-spare-parts','nairobi/mathare/generators','nairobi/mathare/motor-rewinding','nairobi/mathare/solar-companies','nairobi/mathare/solar-installation','nairobi/mathare/ups-systems','nairobi/motor-rewinding','nairobi/roysambu','nairobi/roysambu/electrical-services','nairobi/roysambu/generator-companies','nairobi/roysambu/generator-maintenance','nairobi/roysambu/generator-repairs','nairobi/roysambu/generator-spare-parts','nairobi/roysambu/generators','nairobi/roysambu/motor-rewinding','nairobi/roysambu/solar-companies','nairobi/roysambu/solar-installation','nairobi/roysambu/ups-systems','nairobi/ruaraka','nairobi/ruaraka/electrical-services','nairobi/ruaraka/generator-companies','nairobi/ruaraka/generator-maintenance','nairobi/ruaraka/generator-repairs','nairobi/ruaraka/generator-spare-parts','nairobi/ruaraka/generators','nairobi/ruaraka/motor-rewinding','nairobi/ruaraka/solar-companies','nairobi/ruaraka/solar-installation','nairobi/ruaraka/ups-systems','nairobi/solar-companies','nairobi/solar-installation','nairobi/starehe','nairobi/starehe/electrical-services','nairobi/starehe/generator-companies','nairobi/starehe/generator-maintenance','nairobi/starehe/generator-repairs','nairobi/starehe/generator-spare-parts','nairobi/starehe/generators','nairobi/starehe/motor-rewinding','nairobi/starehe/solar-companies','nairobi/starehe/solar-installation','nairobi/starehe/ups-systems','nairobi/ups-systems','nairobi/westlands','nairobi/westlands/electrical-services','nairobi/westlands/generator-companies','nairobi/westlands/generator-maintenance','nairobi/westlands/generator-repairs','nairobi/westlands/generator-spare-parts','nairobi/westlands/generators','nairobi/westlands/motor-rewinding','nairobi/westlands/solar-companies','nairobi/westlands/solar-installation','nairobi/westlands/ups-systems','nakuru/bahati','nakuru/bahati/electrical-services','nakuru/bahati/generator-companies','nakuru/bahati/generator-maintenance','nakuru/bahati/generator-repairs','nakuru/bahati/generator-spare-parts','nakuru/bahati/generators','nakuru/bahati/motor-rewinding','nakuru/bahati/solar-companies','nakuru/bahati/solar-installation','nakuru/bahati/ups-systems','nakuru/electrical-services','nakuru/generator-companies','nakuru/generator-maintenance','nakuru/generator-repairs','nakuru/generator-spare-parts','nakuru/generators','nakuru/gilgil','nakuru/gilgil/electrical-services','nakuru/gilgil/generator-companies','nakuru/gilgil/generator-maintenance','nakuru/gilgil/generator-repairs','nakuru/gilgil/generator-spare-parts','nakuru/gilgil/generators','nakuru/gilgil/motor-rewinding','nakuru/gilgil/solar-companies','nakuru/gilgil/solar-installation','nakuru/gilgil/ups-systems','nakuru/kuresoi-north','nakuru/kuresoi-north/electrical-services','nakuru/kuresoi-north/generator-companies','nakuru/kuresoi-north/generator-maintenance','nakuru/kuresoi-north/generator-repairs','nakuru/kuresoi-north/generator-spare-parts','nakuru/kuresoi-north/generators','nakuru/kuresoi-north/motor-rewinding','nakuru/kuresoi-north/solar-companies','nakuru/kuresoi-north/solar-installation','nakuru/kuresoi-north/ups-systems','nakuru/kuresoi-south','nakuru/kuresoi-south/electrical-services','nakuru/kuresoi-south/generator-companies','nakuru/kuresoi-south/generator-maintenance','nakuru/kuresoi-south/generator-repairs','nakuru/kuresoi-south/generator-spare-parts','nakuru/kuresoi-south/generators','nakuru/kuresoi-south/motor-rewinding','nakuru/kuresoi-south/solar-companies','nakuru/kuresoi-south/solar-installation','nakuru/kuresoi-south/ups-systems','nakuru/molo','nakuru/molo/electrical-services','nakuru/molo/generator-companies','nakuru/molo/generator-maintenance','nakuru/molo/generator-repairs','nakuru/molo/generator-spare-parts','nakuru/molo/generators','nakuru/molo/motor-rewinding','nakuru/molo/solar-companies','nakuru/molo/solar-installation','nakuru/molo/ups-systems','nakuru/motor-rewinding','nakuru/naivasha','nakuru/naivasha/electrical-services','nakuru/naivasha/generator-companies','nakuru/naivasha/generator-maintenance','nakuru/naivasha/generator-repairs','nakuru/naivasha/generator-spare-parts','nakuru/naivasha/generators','nakuru/naivasha/motor-rewinding','nakuru/naivasha/solar-companies','nakuru/naivasha/solar-installation','nakuru/naivasha/ups-systems','nakuru/nakuru-town-east','nakuru/nakuru-town-east/electrical-services','nakuru/nakuru-town-east/generator-companies','nakuru/nakuru-town-east/generator-maintenance','nakuru/nakuru-town-east/generator-repairs','nakuru/nakuru-town-east/generator-spare-parts','nakuru/nakuru-town-east/generators','nakuru/nakuru-town-east/motor-rewinding','nakuru/nakuru-town-east/solar-companies','nakuru/nakuru-town-east/solar-installation','nakuru/nakuru-town-east/ups-systems','nakuru/nakuru-town-west','nakuru/nakuru-town-west/electrical-services','nakuru/nakuru-town-west/generator-companies','nakuru/nakuru-town-west/generator-maintenance','nakuru/nakuru-town-west/generator-repairs','nakuru/nakuru-town-west/generator-spare-parts','nakuru/nakuru-town-west/generators','nakuru/nakuru-town-west/motor-rewinding','nakuru/nakuru-town-west/solar-companies','nakuru/nakuru-town-west/solar-installation','nakuru/nakuru-town-west/ups-systems','nakuru/njoro','nakuru/njoro/electrical-services','nakuru/njoro/generator-companies','nakuru/njoro/generator-maintenance','nakuru/njoro/generator-repairs','nakuru/njoro/generator-spare-parts','nakuru/njoro/generators','nakuru/njoro/motor-rewinding','nakuru/njoro/solar-companies','nakuru/njoro/solar-installation','nakuru/njoro/ups-systems','nakuru/rongai','nakuru/rongai/electrical-services','nakuru/rongai/generator-companies','nakuru/rongai/generator-maintenance','nakuru/rongai/generator-repairs','nakuru/rongai/generator-spare-parts','nakuru/rongai/generators','nakuru/rongai/motor-rewinding','nakuru/rongai/solar-companies','nakuru/rongai/solar-installation','nakuru/rongai/ups-systems','nakuru/solar-companies','nakuru/solar-installation','nakuru/subukia','nakuru/subukia/electrical-services','nakuru/subukia/generator-companies','nakuru/subukia/generator-maintenance','nakuru/subukia/generator-repairs','nakuru/subukia/generator-spare-parts','nakuru/subukia/generators','nakuru/subukia/motor-rewinding','nakuru/subukia/solar-companies','nakuru/subukia/solar-installation','nakuru/subukia/ups-systems','nakuru/ups-systems','nandi/electrical-services','nandi/generator-companies','nandi/generator-maintenance','nandi/generator-repairs','nandi/generator-spare-parts','nandi/generators','nandi/motor-rewinding','nandi/solar-companies','nandi/solar-installation','nandi/ups-systems','narok/electrical-services','narok/generator-companies','narok/generator-maintenance','narok/generator-repairs','narok/generator-spare-parts','narok/generators','narok/motor-rewinding','narok/solar-companies','narok/solar-installation','narok/ups-systems','nyamira/electrical-services','nyamira/generator-companies','nyamira/generator-maintenance','nyamira/generator-repairs','nyamira/generator-spare-parts','nyamira/generators','nyamira/motor-rewinding','nyamira/solar-companies','nyamira/solar-installation','nyamira/ups-systems','nyandarua/electrical-services','nyandarua/generator-companies','nyandarua/generator-maintenance','nyandarua/generator-repairs','nyandarua/generator-spare-parts','nyandarua/generators','nyandarua/motor-rewinding','nyandarua/solar-companies','nyandarua/solar-installation','nyandarua/ups-systems','nyeri/electrical-services','nyeri/generator-companies','nyeri/generator-maintenance','nyeri/generator-repairs','nyeri/generator-spare-parts','nyeri/generators','nyeri/kieni','nyeri/kieni/electrical-services','nyeri/kieni/generator-companies','nyeri/kieni/generator-maintenance','nyeri/kieni/generator-repairs','nyeri/kieni/generator-spare-parts','nyeri/kieni/generators','nyeri/kieni/motor-rewinding','nyeri/kieni/solar-companies','nyeri/kieni/solar-installation','nyeri/kieni/ups-systems','nyeri/mathira','nyeri/mathira/electrical-services','nyeri/mathira/generator-companies','nyeri/mathira/generator-maintenance','nyeri/mathira/generator-repairs','nyeri/mathira/generator-spare-parts','nyeri/mathira/generators','nyeri/mathira/motor-rewinding','nyeri/mathira/solar-companies','nyeri/mathira/solar-installation','nyeri/mathira/ups-systems','nyeri/motor-rewinding','nyeri/mukurweini','nyeri/mukurweini/electrical-services','nyeri/mukurweini/generator-companies','nyeri/mukurweini/generator-maintenance','nyeri/mukurweini/generator-repairs','nyeri/mukurweini/generator-spare-parts','nyeri/mukurweini/generators','nyeri/mukurweini/motor-rewinding','nyeri/mukurweini/solar-companies','nyeri/mukurweini/solar-installation','nyeri/mukurweini/ups-systems','nyeri/nyeri-town','nyeri/nyeri-town/electrical-services','nyeri/nyeri-town/generator-companies','nyeri/nyeri-town/generator-maintenance','nyeri/nyeri-town/generator-repairs','nyeri/nyeri-town/generator-spare-parts','nyeri/nyeri-town/generators','nyeri/nyeri-town/motor-rewinding','nyeri/nyeri-town/solar-companies','nyeri/nyeri-town/solar-installation','nyeri/nyeri-town/ups-systems','nyeri/othaya','nyeri/othaya/electrical-services','nyeri/othaya/generator-companies','nyeri/othaya/generator-maintenance','nyeri/othaya/generator-repairs','nyeri/othaya/generator-spare-parts','nyeri/othaya/generators','nyeri/othaya/motor-rewinding','nyeri/othaya/solar-companies','nyeri/othaya/solar-installation','nyeri/othaya/ups-systems','nyeri/solar-companies','nyeri/solar-installation','nyeri/tetu','nyeri/tetu/electrical-services','nyeri/tetu/generator-companies','nyeri/tetu/generator-maintenance','nyeri/tetu/generator-repairs','nyeri/tetu/generator-spare-parts','nyeri/tetu/generators','nyeri/tetu/motor-rewinding','nyeri/tetu/solar-companies','nyeri/tetu/solar-installation','nyeri/tetu/ups-systems','nyeri/ups-systems','samburu/electrical-services','samburu/generator-companies','samburu/generator-maintenance','samburu/generator-repairs','samburu/generator-spare-parts','samburu/generators','samburu/motor-rewinding','samburu/solar-companies','samburu/solar-installation','samburu/ups-systems','siaya/electrical-services','siaya/generator-companies','siaya/generator-maintenance','siaya/generator-repairs','siaya/generator-spare-parts','siaya/generators','siaya/motor-rewinding','siaya/solar-companies','siaya/solar-installation','siaya/ups-systems','taita-taveta/electrical-services','taita-taveta/generator-companies','taita-taveta/generator-maintenance','taita-taveta/generator-repairs','taita-taveta/generator-spare-parts','taita-taveta/generators','taita-taveta/motor-rewinding','taita-taveta/solar-companies','taita-taveta/solar-installation','taita-taveta/ups-systems','tana-river/electrical-services','tana-river/generator-companies','tana-river/generator-maintenance','tana-river/generator-repairs','tana-river/generator-spare-parts','tana-river/generators','tana-river/motor-rewinding','tana-river/solar-companies','tana-river/solar-installation','tana-river/ups-systems','tharaka-nithi/electrical-services','tharaka-nithi/generator-companies','tharaka-nithi/generator-maintenance','tharaka-nithi/generator-repairs','tharaka-nithi/generator-spare-parts','tharaka-nithi/generators','tharaka-nithi/motor-rewinding','tharaka-nithi/solar-companies','tharaka-nithi/solar-installation','tharaka-nithi/ups-systems','trans-nzoia/electrical-services','trans-nzoia/generator-companies','trans-nzoia/generator-maintenance','trans-nzoia/generator-repairs','trans-nzoia/generator-spare-parts','trans-nzoia/generators','trans-nzoia/motor-rewinding','trans-nzoia/solar-companies','trans-nzoia/solar-installation','trans-nzoia/ups-systems','turkana/electrical-services','turkana/generator-companies','turkana/generator-maintenance','turkana/generator-repairs','turkana/generator-spare-parts','turkana/generators','turkana/motor-rewinding','turkana/solar-companies','turkana/solar-installation','turkana/ups-systems','uasin-gishu/ainabkoi','uasin-gishu/ainabkoi/electrical-services','uasin-gishu/ainabkoi/generator-companies','uasin-gishu/ainabkoi/generator-maintenance','uasin-gishu/ainabkoi/generator-repairs','uasin-gishu/ainabkoi/generator-spare-parts','uasin-gishu/ainabkoi/generators','uasin-gishu/ainabkoi/motor-rewinding','uasin-gishu/ainabkoi/solar-companies','uasin-gishu/ainabkoi/solar-installation','uasin-gishu/ainabkoi/ups-systems','uasin-gishu/electrical-services','uasin-gishu/generator-companies','uasin-gishu/generator-maintenance','uasin-gishu/generator-repairs','uasin-gishu/generator-spare-parts','uasin-gishu/generators','uasin-gishu/kapseret','uasin-gishu/kapseret/electrical-services','uasin-gishu/kapseret/generator-companies','uasin-gishu/kapseret/generator-maintenance','uasin-gishu/kapseret/generator-repairs','uasin-gishu/kapseret/generator-spare-parts','uasin-gishu/kapseret/generators','uasin-gishu/kapseret/motor-rewinding','uasin-gishu/kapseret/solar-companies','uasin-gishu/kapseret/solar-installation','uasin-gishu/kapseret/ups-systems','uasin-gishu/kesses','uasin-gishu/kesses/electrical-services','uasin-gishu/kesses/generator-companies','uasin-gishu/kesses/generator-maintenance','uasin-gishu/kesses/generator-repairs','uasin-gishu/kesses/generator-spare-parts','uasin-gishu/kesses/generators','uasin-gishu/kesses/motor-rewinding','uasin-gishu/kesses/solar-companies','uasin-gishu/kesses/solar-installation','uasin-gishu/kesses/ups-systems','uasin-gishu/moiben','uasin-gishu/moiben/electrical-services','uasin-gishu/moiben/generator-companies','uasin-gishu/moiben/generator-maintenance','uasin-gishu/moiben/generator-repairs','uasin-gishu/moiben/generator-spare-parts','uasin-gishu/moiben/generators','uasin-gishu/moiben/motor-rewinding','uasin-gishu/moiben/solar-companies','uasin-gishu/moiben/solar-installation','uasin-gishu/moiben/ups-systems','uasin-gishu/motor-rewinding','uasin-gishu/solar-companies','uasin-gishu/solar-installation','uasin-gishu/soy','uasin-gishu/soy/electrical-services','uasin-gishu/soy/generator-companies','uasin-gishu/soy/generator-maintenance','uasin-gishu/soy/generator-repairs','uasin-gishu/soy/generator-spare-parts','uasin-gishu/soy/generators','uasin-gishu/soy/motor-rewinding','uasin-gishu/soy/solar-companies','uasin-gishu/soy/solar-installation','uasin-gishu/soy/ups-systems','uasin-gishu/turbo','uasin-gishu/turbo/electrical-services','uasin-gishu/turbo/generator-companies','uasin-gishu/turbo/generator-maintenance','uasin-gishu/turbo/generator-repairs','uasin-gishu/turbo/generator-spare-parts','uasin-gishu/turbo/generators','uasin-gishu/turbo/motor-rewinding','uasin-gishu/turbo/solar-companies','uasin-gishu/turbo/solar-installation','uasin-gishu/turbo/ups-systems','uasin-gishu/ups-systems','vihiga/electrical-services','vihiga/generator-companies','vihiga/generator-maintenance','vihiga/generator-repairs','vihiga/generator-spare-parts','vihiga/generators','vihiga/motor-rewinding','vihiga/solar-companies','vihiga/solar-installation','vihiga/ups-systems','wajir/electrical-services','wajir/generator-companies','wajir/generator-maintenance','wajir/generator-repairs','wajir/generator-spare-parts','wajir/generators','wajir/motor-rewinding','wajir/solar-companies','wajir/solar-installation','wajir/ups-systems','west-pokot/electrical-services','west-pokot/generator-companies','west-pokot/generator-maintenance','west-pokot/generator-repairs','west-pokot/generator-spare-parts','west-pokot/generators','west-pokot/motor-rewinding','west-pokot/solar-companies','west-pokot/solar-installation','west-pokot/ups-systems']);
      /*
       * EXACT allowlist, replacing the previous heuristic.
       *
       * The old rule allowed ANY single segment through for the 10 "priority"
       * counties, on the assumption it might be a constituency:
       *     if (!CORE_SVC.has(rest[0]) && !PRIORITY.has(county)) invalid = true;
       * That left 10 counties x unlimited slugs answering HTTP 200 with a
       * noindex "not found" body. Verified live 2026-08-01: /kenya/nairobi/zzz999,
       * /kenya/kisumu/xyz123 and /kenya/mombasa/not-a-thing all returned
       * 200 + noindex. Search Console was holding 40,103 URLs under
       * "Excluded by 'noindex' tag" — this route is the largest contributor.
       *
       * OK_KENYA_PATHS is generated from getIndexableKenyaParams(), the same
       * registry app/kenya/[county]/[...slug] builds generateStaticParams from,
       * so the guard and the route cannot disagree. 1,427 entries, "county/slug"
       * lowercased. Regenerate it rather than editing by hand.
       */
      let invalid = false;
      const countyIsReal = KENYA_COUNTIES.has(county);
      if (!countyIsReal) {
        invalid = true;                                   // unknown county → definitely invalid
      } else {
        const key = `${county}/${rest.join('/')}`.toLowerCase();
        if (!OK_KENYA_PATHS.has(key)) invalid = true;
      }
      if (invalid) {
        /*
         * REDIRECT RATHER THAN 404 WHEN THE COUNTY IS REAL.
         *
         * An external audit on 2026-08-26 found Google still surfacing removed
         * pages such as /kenya/nakuru/new-nakuru-town-west-village and
         * .../upper-funyula-estate. Those belonged to the FABRICATED village
         * tier and were correctly deleted — but they had been indexed, so a
         * hard 404 throws away both the click and the accumulated authority,
         * and grows the "Not found (404)" report in Search Console.
         *
         * The county page above them is real and substantial, so send the
         * visitor there instead. 308 keeps it permanent and method-safe. A
         * bogus COUNTY still 404s: we redirect because the PLACE exists, not
         * merely because a URL was requested — the same rule the /locations
         * guard already applies for the same reason.
         */
        if (countyIsReal) {
          return NextResponse.redirect(new URL(`/kenya/${county}`, request.url), {
            status: 308,
            headers: { 'X-Loc-Guard': 'kenya-redirect-to-county' },
          });
        }
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
  // 0e-size. HARD 404 for unknown /generators/sizes/[size].
  //
  //     Guard 0i checks only the FIRST child of a segment, so it clears
  //     /generators/sizes and stops there. Without this block
  //     /generators/sizes/999-kva would render the 404 page at HTTP 200 —
  //     the soft-404 pattern, on the product URLs we are trying to rank.
  //
  //     Kept in sync with GENERATOR_SIZES by scripts/check-size-routes.mjs.
  //     Inlined because a cross-module @/lib import fails open in this runtime.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    if (pathname.startsWith('/generators/sizes/') && pathname !== '/generators/sizes/') {
      const OK_GEN_SIZES = new Set(['10-kva','15-kva','20-kva','30-kva','50-kva','60-kva','80-kva','100-kva','150-kva','200-kva','250-kva','300-kva','500-kva']);
      let sizeSlug = pathname.slice('/generators/sizes/'.length).replace(/\/$/, '');
      try { sizeSlug = decodeURIComponent(sizeSlug); } catch { /* keep raw */ }
      if (sizeSlug.includes('/') || !OK_GEN_SIZES.has(sizeSlug.toLowerCase())) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': '404-generator-size',
          },
        });
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 0e-price. HARD 404 for unknown /pricing/[slug].
  //
  //     Same Next-16 quirk as guards 0a-0f, confirmed again for this route on
  //     2026-08-25 against a local production build: /pricing/does-not-exist-zzz
  //     rendered the 404 page but answered HTTP 200. notFound() is called in
  //     BOTH generateMetadata and the component and neither sets the status, so
  //     the guard has to live here.
  //
  //     This matters more than usual for pricing. Adding 'pricing' to
  //     ROUTE_SEGMENTS below (required, or every real /pricing/* page hard-404s)
  //     also stops the catch-all guard from covering the segment — so without
  //     this block the site would answer 200 to any /pricing/<anything> a
  //     crawler invented, on the very URLs we are trying to rank.
  //
  //     Inlined by hand for the same reason as the other guards: a '@/lib'
  //     import has been proven to fail open in this edge runtime. Keep in sync
  //     with PRICE_GUIDES in lib/pricing/publishedPrices.ts.
  {
    if (pathname.startsWith('/pricing/') && pathname !== '/pricing/') {
      const OK_PRICE_GUIDES = new Set([
        'generator-prices-kenya',
        'solar-installation-cost-kenya',
        'borehole-cost-kenya',
        'ups-price-kenya',
        'borehole-drilling-cost-kenya',
        'generator-service-cost-kenya',
        'motor-rewinding-cost-kenya',
        'incinerator-price-kenya',
      ]);
      let slug = pathname.slice('/pricing/'.length).replace(/\/$/, '');
      try { slug = decodeURIComponent(slug); } catch { /* keep raw */ }
      // Only one level deep is ever valid; /pricing/a/b is not a page.
      if (slug.includes('/') || !OK_PRICE_GUIDES.has(slug)) {
        return new NextResponse('Not Found', {
          status: 404,
          headers: {
            'X-Robots-Tag': 'noindex, follow',
            'Content-Type': 'text/plain',
            'X-Loc-Guard': '404-pricing',
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
  // ─────────────────────────────────────────────────────────────────────────────
  // 0i. HARD 404 for a KNOWN segment with an UNKNOWN child.
  //
  //     The catch-all block immediately below checks only that the FIRST
  //     segment is real. Once it is, /generators/anything falls through to a
  //     route that renders the 404 page at HTTP 200 — a soft-404. Scanned live
  //     on 2026-08-25: 40 of 53 top-level segments answered 200 to an invented
  //     child URL, including /generators, /solar, /hub and /maintenance-hub.
  //     That is an unbounded supply of success-returning URLs that do not
  //     exist, which is exactly what makes Google discount a site's crawl
  //     budget and report "crawled - currently not indexed".
  //
  //     Only segments whose first-level children are entirely STATIC are
  //     listed. scripts/segment-children.mjs derives them from the app/
  //     directory and refuses any segment holding a dynamic child (aquascan-pro
  //     was excluded on exactly that basis), because listing one would 404 real
  //     slugs — and a guard that over-blocks is worse than the soft-404 it
  //     replaces. scripts/check-segment-guard.mjs re-derives on every build and
  //     fails if this literal drifts from the filesystem.
  //
  //     Deeper paths are intentionally NOT checked here: /generators/spare-parts
  //     is allowed, so /generators/spare-parts/<category> passes through to its
  //     dynamic route. Guarding that level needs the category list and is a
  //     smaller surface; this block removes the bulk of it.
  //
  //     Inlined, like every other guard, because a cross-module '@/lib' import
  //     has been proven to fail open in this edge runtime.
  // ─────────────────────────────────────────────────────────────────────────────
  {
    const segsFor0i = pathname.split('/').filter(Boolean);
    if (segsFor0i.length >= 2 && !pathname.startsWith('/api/')) {
      const SEG_CHILDREN: Record<string, string[]> = {'about-us':['team'],'africa':['agro-industrial','infrastructure','mining','oil-gas','southern','utilities','western'],'ai-tools':['capabilities'],'all-tools':[],'analytics':[],'booking':[],'calculators':[],'careers':[],'case-studies':[],'diagnostics':[],'east-africa':['rwanda','tanzania','uganda'],'eims-pro':[],'fabrication':[],'faq':[],'gallery':[],'generator':['controls','service'],'generator-oracle':['purchase','tools'],'generator-parts':[],'generator-services':[],'generators':['caterpillar','cummins','installation','leasing','maintenance','maintenance-companion','perkins','rental','sizes','spare-parts','systems','used','volvo-penta','workshop-services'],'guides':['emergency-response'],'healthcare':[],'high-rise':[],'hub':['abuse','authenticity','diagnostics','doc-pack','installation','learn','library','lifecycle','maintenance','power-quality','product-intelligence','quote-audit','safety','simulator','solar-ups','ups-lab','verifier'],'industry-solutions':['healthcare','manufacturing','telecom'],'innovations':[],'knowledge-base':[],'maintenance-hub':['borehole','electrical','fabrication','general','generators','hvac','incinerators','motors','solar','welding'],'marketplace':['checkout','orders','partners','parts','returns'],'podcasts':['episodes'],'products':['generator-oracle'],'resources':['buying-guides','cummins-guides','solar-ups-hub'],'safety':[],'service':['generators'],'solar':[],'specs':['used'],'technical-bible':[],'tools':['aquascan-pro','generator-oracle','pro-building-suite','solar-genius-pro'],'troubleshooting':[]};
      const parent = segsFor0i[0].toLowerCase();
      const allowedKids = SEG_CHILDREN[parent];
      if (allowedKids) {
        let child = segsFor0i[1];
        try { child = decodeURIComponent(child); } catch { /* keep raw */ }
        if (!allowedKids.includes(child.toLowerCase())) {
          return new NextResponse('Not Found', {
            status: 404,
            headers: {
              'X-Robots-Tag': 'noindex, follow',
              'Content-Type': 'text/plain',
              'X-Loc-Guard': '404-segment-child',
            },
          });
        }
      }
    }
  }

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
      const ROUTE_SEGMENTS = new Set(['about-us','repair-centre','admin','africa','ai-tools','all-tools','alltools','analytics','api','aquascan-pro','aquascan-pro-v3','blog','booking','brands','calculators','careers','case-studies','case-study','collab','components','console','contact','counties','curation','dashboard','data','diagnostics','east-africa','eims-pro','fabrication','faq','faults','gallery','generator','generator-oracle','generator-parts','generator-problems','generator-services','generators','guides','healthcare','high-rise','hub','industries','industry-solutions','innovations','interior','kenya','knowledge-base','lib','locations','maintenance-hub','marketplace','mep-clash','podcasts','pricing','privacy','pro-building-suite','pro-console','products','qs','resources','safety','sectors','service','services','solar','solar-design-studio','solar-genius-pro','solar-genius-pro-futuristic','solar-genius-pro-tools','solution','solutions','specs','styles','swoosh-preview','swoosh-x','technical-bible','terms','tools','troubleshooting']);
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
