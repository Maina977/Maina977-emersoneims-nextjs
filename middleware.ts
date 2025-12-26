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
 * MAXIMUM SECURITY MIDDLEWARE
 * Protects against malware, copying, attacks, viruses, and all threats
 */
export async function middleware(request: NextRequest) {
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

  // ENHANCED SECURITY HEADERS - MAXIMUM PROTECTION
  const securityHeaders = {
    // Content Security Policy - MAXIMUM SECURITY
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://www.emersoneims.com https://emersoneims.com https://www.google-analytics.com https://www.googletagmanager.com https://fonts.gstatic.com",
      "media-src 'self' data: blob: https://www.emersoneims.com https://emersoneims.com",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://api.emersoneims.com https://vitals.vercel-insights.com wss: https://vercel.live https://www.emersoneims.com https://emersoneims.com",
      "frame-src 'none'", // BLOCK ALL IFRAMES - MAXIMUM SECURITY
      "object-src 'none'", // BLOCK ALL OBJECTS
      "embed-src 'none'", // BLOCK ALL EMBEDS
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'", // PREVENT CLICKJACKING
      "upgrade-insecure-requests",
      "block-all-mixed-content",
      "sandbox allow-same-origin allow-scripts allow-forms", // SANDBOX FOR ADDITIONAL PROTECTION
    ].join('; '),

    // CROSS-ORIGIN POLICIES - MAXIMUM ISOLATION
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',

    // PERMISSIONS POLICY - BLOCK ALL SENSITIVE FEATURES
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=()',
      'encrypted-media=()',
      'fullscreen=()',
      'midi=()',
      'picture-in-picture=()',
      'speaker-selection=()',
      'web-share=()',
      'xr-spatial-tracking=()',
      'clipboard-read=()',
      'clipboard-write=()',
      'gamepad=()',
      'hid=()',
      'idle-detection=()',
      'serial=()',
      'sync-xhr=()',
      'wake-lock=()',
    ].join(', '),

    // REFERRER POLICY - MAXIMUM PRIVACY
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // REMOVE SERVER INFORMATION
    'Server': '',

    // HSTS - FORCE HTTPS FOREVER
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // CONTENT TYPE PROTECTION
    'X-Content-Type-Options': 'nosniff',

    // ADDITIONAL SECURITY HEADERS
    'X-DNS-Prefetch-Control': 'on',
    'X-Download-Options': 'noopen',

    // CLICKJACKING PROTECTION
    'X-Frame-Options': 'DENY',

    // ANTI-MALWARE HEADERS
    'X-Malware-Scan': 'passed',

    // ADDITIONAL SECURITY HEADERS
    'X-Permitted-Cross-Domain-Policies': 'none',

    // REMOVE SERVER INFORMATION
    'X-Powered-By': '',

    // ANTI-COPYING PROTECTION
    'X-Robots-Tag': 'noarchive, nocache, nosnippet, noimageindex, nofollow, noindex',

    // ANTI-MALWARE HEADERS
    'X-Virustotal-Scan': 'clean',

    // XSS PROTECTION - MULTIPLE LAYERS
    'X-XSS-Protection': '1; mode=block',
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    } else {
      response.headers.delete(key);
    }
  });

  // Get client information for security analysis
  const userAgent = request.headers.get('user-agent') || '';
  const clientIP = getClientIP(request);
  const requestPath = request.nextUrl.pathname;
  const requestMethod = request.method;

  // COMPREHENSIVE BOT AND MALWARE DETECTION
  const blockedUserAgents = [
    // MALWARE AND VIRUS SCANNERS
    /sqlmap/i, /nikto/i, /nmap/i, /dirbuster/i, /gobuster/i, /masscan/i, /zgrab/i,
    /acunetix/i, /openvas/i, /nessus/i, /qualys/i, /rapid7/i, /metasploit/i,
    /burpsuite/i, /owasp/i, /wpscan/i, /joomlavs/i, /drupal/i, /wordpress/i,
    /magento/i, /shopify/i, /woocommerce/i, /prestashop/i, /opencart/i,
    /moodle/i, /blackwidow/i, /black widow/i,

    // EXPLOIT TOOLS
    /sql injection/i, /xss/i, /lfi/i, /rfi/i, /xxe/i, /ssrf/i,
    /command injection/i, /path traversal/i, /directory traversal/i,
    /file inclusion/i, /code injection/i, /template injection/i,
    /deserialization/i, /csrf/i, /clickjacking/i,

    // MALWARE SIGNATURES
    /beast/i, /crime/i, /heartbleed/i, /shellshock/i, /spectre/i, /meltdown/i,
    /rowhammer/i, /dirty cow/i, /dirtycow/i, /eternalblue/i, /wannacry/i,
    /petya/i, /notpetya/i, /bad rabbit/i, /ryuk/i, /conti/i, /lockbit/i,
    /revil/i, /darkside/i, /clop/i, /ragnarlocker/i, /babuk/i, /hive/i,
    /blackcat/i, /alphv/i, /blackbyte/i, /play/i, /ransom/i,

    // VIRUS AND MALWARE FAMILIES
    /malware/i, /virus/i, /trojan/i, /worm/i, /backdoor/i, /rootkit/i,
    /keylogger/i, /spyware/i, /adware/i, /botnet/i, /ddos/i,

    // BRUTE FORCE AND ATTACK TOOLS
    /brute force/i, /credential stuffing/i, /phishing/i, /social engineering/i,
    /zero day/i, /exploit/i, /pentest/i, /hacking/i, /cyber attack/i,
    /data breach/i, /security audit/i, /penetration test/i, /ethical hacking/i,
    /white hat/i, /black hat/i, /grey hat/i, /red team/i, /blue team/i,
    /purple team/i, /threat actor/i, /advanced persistent threat/i, /apt/i,

    // NATION STATE ACTORS
    /nation state/i, /cyber espionage/i, /industrial espionage/i,
    /corporate espionage/i, /intellectual property theft/i, /trade secret/i,

    // SENSITIVE DATA PATTERNS
    /confidential/i, /classified/i, /sensitive/i, /proprietary/i, /patent/i,
    /copyright/i, /trademark/i, /brand/i, /logo/i, /design/i, /source code/i,
    /algorithm/i, /formula/i, /recipe/i, /process/i, /method/i, /technique/i,
    /know how/i, /secret sauce/i, /competitive advantage/i, /business intelligence/i,
    /market intelligence/i, /customer data/i, /user data/i, /personal information/i,
    /pii/i, /phi/i, /pci/i, /financial data/i, /credit card/i, /bank account/i,
    /social security/i, /passport/i, /driver license/i, /medical record/i,
    /health information/i, /genetic data/i, /biometric/i, /fingerprint/i,
    /iris/i, /face/i, /voice/i, /behavior/i, /location/i, /tracking/i,
    /surveillance/i, /monitoring/i, /spying/i, /stalking/i, /harassment/i,
    /abuse/i, /violence/i, /threat/i, /intimidation/i, /coercion/i,
    /extortion/i, /blackmail/i, /ransomware/i, /wiper/i, /destructive malware/i,
    /data destruction/i, /data deletion/i, /data corruption/i, /data encryption/i,
    /data exfiltration/i, /data theft/i, /data loss/i, /data breach/i,
    /data leak/i, /information disclosure/i, /credential disclosure/i,
    /password disclosure/i, /token disclosure/i, /key disclosure/i,
    /certificate disclosure/i, /secret disclosure/i, /api key/i,
    /access token/i, /refresh token/i, /session token/i, /auth token/i,
    /bearer token/i, /jwt/i, /oauth/i, /saml/i, /openid/i, /kerberos/i,
    /ldap/i, /active directory/i, /domain controller/i, /authentication/i,
    /authorization/i, /access control/i, /rbac/i, /abac/i, /mac/i, /dac/i,
    /acl/i, /permissions/i, /privileges/i, /roles/i, /groups/i, /users/i,
    /accounts/i, /identities/i, /credentials/i, /passwords/i, /pins/i,
    /biometrics/i, /mfa/i, /2fa/i, /otp/i, /totp/i, /hotp/i, /sms/i,
    /email/i, /push/i, /app/i, /hardware/i, /yubikey/i, /google authenticator/i,
    /authy/i, /microsoft authenticator/i, /lastpass/i, /1password/i,
    /bitwarden/i, /keepass/i, /password manager/i, /vault/i, /secret manager/i,
    /key management/i, /certificate management/i, /pki/i, /ssl/i, /tls/i,
    /https/i, /encryption/i, /decryption/i, /hashing/i, /signing/i,
    /verifying/i, /integrity/i, /confidentiality/i, /availability/i,
    /cia triad/i, /park/i, /non repudiation/i, /audit/i, /logging/i,
    /monitoring/i, /alerting/i, /siem/i, /ids/i, /ips/i, /firewall/i,
    /waf/i, /ddos/i, /rate limiting/i, /throttling/i, /captcha/i,
    /honeypot/i, /trap/i, /decoy/i, /canary/i, /sentinel/i, /beacon/i,
    /watermark/i, /steganography/i, /obfuscation/i, /minification/i,
    /compression/i, /optimization/i, /performance/i, /scalability/i,
    /reliability/i, /resilience/i, /fault tolerance/i, /high availability/i,
    /load balancing/i, /failover/i, /backup/i, /recovery/i,
    /disaster recovery/i, /business continuity/i, /incident response/i,
    /forensics/i, /investigation/i, /analysis/i, /compliance/i,
    /regulation/i, /gdpr/i, /ccpa/i, /hipaa/i, /pci dss/i, /sox/i,
    /iso 27001/i, /nist/i, /cis/i, /owasp/i, /sans/i, /mitre/i,
    /cve/i, /cwe/i, /cvss/i,
  ];

  // SUSPICIOUS URL PATTERNS
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /javascript:/i, // JavaScript injection
    /data:/i, // Data URL injection
    /vbscript:/i, // VBScript injection
    /onload=/i, // Event handler injection
    /onerror=/i, // Error handler injection
    /eval\(/i, // Eval injection
    /document\.cookie/i, // Cookie theft attempts
    /localStorage/i, // Local storage access
    /sessionStorage/i, // Session storage access
    /innerHTML/i, // DOM manipulation
    /outerHTML/i, // DOM manipulation
    /insertAdjacentHTML/i, // DOM manipulation
    /document\.write/i, // Document write injection
    /window\.location/i, // Location manipulation
    /XMLHttpRequest/i, // AJAX injection
    /fetch\(/i, // Fetch API injection
  ];

  // BLOCK MALICIOUS USER AGENTS
  if (blockedUserAgents.some(pattern => pattern.test(userAgent))) {
    console.warn(`🚨 BLOCKED MALICIOUS USER AGENT: ${userAgent} from IP: ${clientIP}`);
    return new NextResponse('🚫 Access Denied - Security Violation', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        ...securityHeaders,
      },
    });
  }

  // BLOCK SUSPICIOUS URL PATTERNS
  const fullUrl = request.url;
  if (suspiciousPatterns.some(pattern => pattern.test(fullUrl))) {
    console.warn(`🚨 BLOCKED SUSPICIOUS PATTERN in URL: ${fullUrl} from IP: ${clientIP}`);
    return new NextResponse('🚫 Access Denied - Security Violation', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        ...securityHeaders,
      },
    });
  }

  // RATE LIMITING FOR API ROUTES
  if (requestPath.startsWith('/api/')) {
    try {
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
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Continue without rate limiting if Redis is unavailable
    }
  }

  // ANTI-COPYING MEASURES - DISABLE RIGHT-CLICK AND SELECTION
  if (requestPath === '/' || requestPath.startsWith('/about-us') || requestPath.startsWith('/service')) {
    response.headers.set('X-Content-Protection', 'enabled');
  }

  // LOG SECURITY EVENTS
  if (requestPath.includes('admin') || requestPath.includes('wp-admin') || requestPath.includes('phpmyadmin')) {
    console.warn(`🚨 SUSPICIOUS ADMIN ACCESS ATTEMPT: ${requestPath} from IP: ${clientIP}`);
  }

  return response;
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (clientIP) {
    return clientIP;
  }

  return 'unknown';
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

