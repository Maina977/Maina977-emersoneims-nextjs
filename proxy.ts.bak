import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Rate limiter configuration
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});

/**
 * SECURE PROXY MIDDLEWARE
 * Provides essential security without blocking legitimate users
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Domain redirect configuration
  const REDIRECT_WWW_TO_NON_WWW = process.env.REDIRECT_WWW === 'true';

  // Redirect www to non-www (optional - can be disabled)
  if (REDIRECT_WWW_TO_NON_WWW && hostname.startsWith('www.')) {
    url.hostname = hostname.replace('www.', '');
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();

  // ESSENTIAL SECURITY HEADERS - BALANCED APPROACH
  const securityHeaders = {
    // Content Security Policy - SECURE BUT PRACTICAL
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: https://www.emersoneims.com https://emersoneims.com https://www.google-analytics.com https://www.googletagmanager.com https://fonts.gstatic.com",
      "media-src 'self' data: blob: https: https://www.emersoneims.com https://emersoneims.com",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://api.emersoneims.com https://vitals.vercel-insights.com wss: https://vercel.live https://www.emersoneims.com https://emersoneims.com",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
      "object-src 'none'",
      "embed-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
      "block-all-mixed-content",
    ].join('; '),

    // CROSS-ORIGIN POLICIES - COMPATIBLE SETTINGS
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Resource-Policy': 'cross-origin',

    // PERMISSIONS POLICY - ESSENTIAL BLOCKS ONLY
    'Permissions-Policy': [
      'camera=(), microphone=(), geolocation=()',
      'autoplay=(self), fullscreen=(self)',
      'clipboard-read=(self), clipboard-write=(self)',
    ].join(', '),

    // REFERRER POLICY
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // SERVER INFO REMOVAL
    'Server': '',

    // HSTS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

    // CONTENT TYPE PROTECTION
    'X-Content-Type-Options': 'nosniff',

    // DNS PREFETCH
    'X-DNS-Prefetch-Control': 'on',

    // CLICKJACKING PROTECTION
    'X-Frame-Options': 'DENY',

    // SERVER INFO REMOVAL
    'X-Powered-By': '',

    // ROBOTS TAG
    'X-Robots-Tag': 'index, follow',

    // XSS PROTECTION
    'X-XSS-Protection': '1; mode=block',
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });

  // BASIC BOT DETECTION - ONLY KNOWN MALICIOUS TOOLS
  const userAgent = request.headers.get('user-agent') || '';
  const blockedUserAgents = [
    /sqlmap/i, /nikto/i, /nmap/i, /dirbuster/i, /gobuster/i,
    /acunetix/i, /openvas/i, /nessus/i, /metasploit/i,
    /burpsuite/i, /owasp.*zap/i, /wpscan/i,
  ];

  // BLOCK MALICIOUS USER AGENTS
  if (blockedUserAgents.some(pattern => pattern.test(userAgent))) {
    console.warn(`🚨 BLOCKED MALICIOUS USER AGENT: ${userAgent}`);
    return new NextResponse('🚫 Access Denied - Security Violation', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        ...securityHeaders,
      },
    });
  }

  // BASIC URL PATTERN CHECKING
  const fullUrl = request.url;
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script[^>]*>.*?<\/script>/i, // Script tags with content
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(fullUrl))) {
    console.warn(`🚨 BLOCKED SUSPICIOUS PATTERN in URL: ${fullUrl}`);
    return new NextResponse('🚫 Access Denied - Security Violation', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        ...securityHeaders,
      },
    });
  }

  // RATE LIMITING FOR API ROUTES
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                      request.headers.get('x-real-ip') ||
                      request.headers.get('x-client-ip') ||
                      'unknown';

      if (process.env.NODE_ENV === 'production') {
        const { success } = await ratelimit.limit(clientIP);

        if (!success) {
          console.warn(`🚨 RATE LIMIT EXCEEDED for IP: ${clientIP}`);
          return new NextResponse('🚫 Too Many Requests - Rate Limited', {
            status: 429,
            headers: {
              'Content-Type': 'text/plain',
              'Retry-After': '60',
              ...securityHeaders,
            },
          });
        }
      }
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Continue without rate limiting if Redis is unavailable
    }
  }

  return response;
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
  ],
};

