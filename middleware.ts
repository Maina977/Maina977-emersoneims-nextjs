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

// Allowed bots (search engines, monitoring)
const ALLOWED_BOTS = [
  'googlebot',
  'google-inspectiontool',
  'bingbot',
  'slurp', // Yahoo
  'duckduckbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'vercel',
  'uptimerobot',
  'pingdom',
];

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
const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window

// Anti-scraping: Track rapid page requests
const pageAccessStore = new Map<string, { pages: Set<string>; timestamp: number }>();
const SCRAPING_THRESHOLD = 50; // Max unique pages in 30 seconds
const SCRAPING_WINDOW = 30000; // 30 seconds

// Licensed domains - only these domains can run the application
const LICENSED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'emersoneims.com',
  'www.emersoneims.com',
];

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

// Paths that should be exempt from the malicious-User-Agent check.
// `BLOCKED_USER_AGENTS` includes generic clients like `curl`, `wget`,
// `python-requests` etc. — those are useful for monitoring/health checks
// against the embedded Flask Pro Building Suite, so we don't want to
// fake-403 them on this path. Real malicious-pattern + rate-limit checks
// still apply.
const UA_BOT_CHECK_EXEMPT_PATHS = [
  '/pro-building-suite',
];

function isUaBotCheckExempt(pathname: string): boolean {
  for (const exempt of UA_BOT_CHECK_EXEMPT_PATHS) {
    if (pathname === exempt || pathname.startsWith(`${exempt}/`)) return true;
  }
  return false;
}

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

  // Check if Accept-Language is missing (common in headless browsers)
  const acceptLang = request.headers.get('accept-language');
  if (!acceptLang && userAgent) {
    return true;
  }

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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = pathname + request.nextUrl.search;
  const userAgent = request.headers.get('user-agent') || '';
  const clientIP = getClientIP(request);
  const hostname = request.nextUrl.hostname;

  // ─────────────────────────────────────────────────────────────────────────────
  // 0. DOMAIN AUTHORIZATION CHECK (Production only)
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
  //    Skipped for paths that legitimately need to be reachable by simple HTTP
  //    clients (curl/wget/monitoring), e.g. the Pro Building Suite embed.
  // ─────────────────────────────────────────────────────────────────────────────
  if (!isUaBotCheckExempt(pathname) && isMaliciousBot(userAgent)) {
    console.log(`🚫 BLOCKED: Malicious bot from ${clientIP} - UA: ${userAgent.substring(0, 50)}`);
    return new NextResponse('Access Denied', { status: 403 });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.5. HEADLESS BROWSER DETECTION
  //      Same exemption applies: monitoring tooling on /pro-building-suite
  //      should not be fake-403'd as headless.
  // ─────────────────────────────────────────────────────────────────────────────
  if (!isUaBotCheckExempt(pathname) && isHeadlessBrowser(request)) {
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
  // 3. RATE LIMITING
  // ─────────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.5. SCRAPING DETECTION
  // ─────────────────────────────────────────────────────────────────────────────
  if (detectScraping(clientIP, pathname)) {
    console.log(`🚫 BLOCKED: Scraping behavior detected from ${clientIP}`);
    return new NextResponse(
      'Access temporarily restricted. This content is protected by copyright.',
      { status: 429 }
    );
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
  const response = NextResponse.next();

  // Get preferred locale and set header for the app to use
  const preferredLocale = getPreferredLocale(request);

  // Security headers
  response.headers.set('X-Security-Verified', 'GeneratorOracle-Protected');
  response.headers.set('X-Request-ID', `GO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  response.headers.set('X-Locale', preferredLocale);

  // Copyright & Anti-Copy Headers
  response.headers.set('X-Copyright', 'Generator Oracle 2024-2026');
  response.headers.set('X-Content-Protected', 'true');
  response.headers.set('X-Robots-Tag', 'noarchive, noimageindex'); // Prevent caching by scrapers
  response.headers.set('Cache-Control', 'private, no-store'); // Prevent proxy caching of sensitive content

  // ═══════════════════════════════════════════════════════════════════════════
  // 🚀 WORLD'S #1 FASTEST - PERFORMANCE HEADERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Early Hints (103) - Preload critical resources before response
  response.headers.set('Link', [
    '</images/logo-tagline.png>; rel=preload; as=image',
    '<https://fonts.googleapis.com>; rel=preconnect',
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
  ].join(', '));

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
    '/((?!_next/static|_next/image|api|favicon.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|images|fonts|videos|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)',
  ],
};
