/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMERSONEIMS SECURITY MIDDLEWARE
 * Enterprise-Grade Protection Against Attacks, Bots, and Malicious Activity
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Protection Layers:
 * 1. Bot Detection & Blocking
 * 2. Rate Limiting
 * 3. SQL Injection Prevention
 * 4. XSS Attack Prevention
 * 5. Suspicious User-Agent Blocking
 * 6. Path Traversal Prevention
 * 7. Malicious Request Filtering
 * 8. DDoS Basic Protection
 * 
 * © 2026 EmersonEIMS. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

// Known malicious bot user agents
const BLOCKED_USER_AGENTS = [
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
  'scrapy',
  'nutch',
  'archive.org_bot',
  'ia_archiver',
  'wget',
  'curl',
  'python-requests',
  'go-http-client',
  'java/',
  'libwww',
  'lwp-trivial',
  'sitesucker',
  'webzip',
  'nikto',
  'sqlmap',
  'nmap',
  'masscan',
  'zgrab',
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
  /\/admin|\/administrator|\/manager/i, // Admin access attempts
  /\/phpmyadmin|\/mysql|\/myadmin/i, // Database admin
  /\/\.env|\/\.git|\/\.htaccess/i, // Config file access
];

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window

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

function containsMaliciousPattern(url: string): boolean {
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

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname + request.nextUrl.search;
  const userAgent = request.headers.get('user-agent') || '';
  const clientIP = getClientIP(request);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. MALICIOUS BOT DETECTION
  // ─────────────────────────────────────────────────────────────────────────────
  if (isMaliciousBot(userAgent)) {
    console.log(`🚫 BLOCKED: Malicious bot from ${clientIP} - UA: ${userAgent.substring(0, 50)}`);
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
  // 5. ADD SECURITY HEADERS TO RESPONSE
  // ─────────────────────────────────────────────────────────────────────────────
  const response = NextResponse.next();
  
  // Add security tracking header
  response.headers.set('X-Security-Verified', 'EmersonEIMS-Protected');
  response.headers.set('X-Request-ID', `EIMS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
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
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|videos|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)',
  ],
};
