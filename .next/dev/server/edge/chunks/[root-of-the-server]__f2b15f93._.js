(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
function middleware(request) {
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    // Security Headers
    const securityHeaders = {
        // Content Security Policy - Balanced security for Next.js
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: https: blob:",
            "media-src 'self' data: https: blob:",
            "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://api.emersoneims.com https://vitals.vercel-insights.com wss: https://vercel.live",
            "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "upgrade-insecure-requests",
            "block-all-mixed-content"
        ].join('; '),
        // XSS Protection
        'X-XSS-Protection': '1; mode=block',
        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',
        // Prevent clickjacking
        'X-Frame-Options': 'DENY',
        // Referrer Policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        // Permissions Policy (formerly Feature Policy)
        'Permissions-Policy': [
            'camera=()',
            'microphone=()',
            'geolocation=()',
            'interest-cohort=()',
            'payment=()',
            'usb=()',
            'magnetometer=()',
            'gyroscope=()',
            'accelerometer=()'
        ].join(', '),
        // Strict Transport Security (HSTS)
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        // Cross-Origin Policies (relaxed for Next.js compatibility)
        // Note: COEP 'require-corp' can break some Next.js features
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        // Additional Security Headers
        'X-DNS-Prefetch-Control': 'on',
        'X-Download-Options': 'noopen',
        'X-Permitted-Cross-Domain-Policies': 'none',
        // Remove server information
        'X-Powered-By': ''
    };
    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value])=>{
        if (value) {
            response.headers.set(key, value);
        } else {
            response.headers.delete(key);
        }
    });
    // Cache static assets aggressively
    if (request.nextUrl.pathname.startsWith('/_next/static') || request.nextUrl.pathname.startsWith('/images/') || request.nextUrl.pathname.startsWith('/media/') || request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|avif|woff|woff2|ttf|eot)$/i)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // Cache API responses (if needed)
    if (request.nextUrl.pathname.startsWith('/api/')) {
        // Add rate limiting headers (basic)
        // Get IP from headers (X-Forwarded-For or X-Real-IP)
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const rateLimitKey = forwardedFor?.split(',')[0] || realIp || 'unknown';
        // In production, use Redis or similar for rate limiting
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', '99');
    }
    // Security: Block common attack patterns
    const userAgent = request.headers.get('user-agent') || '';
    const suspiciousPatterns = [
        /bot/i,
        /crawler/i,
        /scanner/i,
        /sqlmap/i,
        /nikto/i,
        /nmap/i
    ];
    // Allow legitimate bots (Google, Bing, etc.) but block suspicious ones
    const isLegitimateBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver/i.test(userAgent);
    if (!isLegitimateBot && suspiciousPatterns.some((pattern)=>pattern.test(userAgent))) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Forbidden', {
            status: 403
        });
    }
    return response;
}
const config = {
    matcher: [
        /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */ '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map