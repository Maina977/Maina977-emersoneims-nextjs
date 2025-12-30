// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getClientIP } from '@/lib/api/request';
import { checkApiAuth } from '@/lib/api/auth';
import { applyRateLimit } from '@/lib/api/rate-limiter';
import { createRateLimitResponse, createUnauthorizedResponse, addCorsHeaders } from '@/lib/api/response';

// Paths to protect (regex). Adjust as needed.
const PROTECTED_PATHS = /^\/api(\/|$)/;

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // CORS preflight handling
  if (request.method === 'OPTIONS') {
    const response = NextResponse.json({ success: true });
    return addCorsHeaders(response);
  }

  // Skip non-API routes
  if (!PROTECTED_PATHS.test(url.pathname)) {
    return NextResponse.next();
  }

  // 1. Auth check
  const auth = checkApiAuth(request);
  if (!auth.authorized) {
    return createUnauthorizedResponse(auth.error!);
  }

  // 2. Rate limiting (use IP + optional key ID for granularity)
  const ip = getClientIP(request);
  const rateResult = await applyRateLimit(ip);

  if (!rateResult.success) {
    return createRateLimitResponse(
      rateResult.remaining,
      rateResult.reset,
      rateResult.limit
    );
  }

  // 3. Proceed with request
  const response = NextResponse.next();

  // Add debug headers (remove in prod if desired)
  response.headers.set('X-Client-IP', ip);
  response.headers.set('X-RateLimit-Remaining', rateResult.remaining.toString());

  return addCorsHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all API routes
     * Exclude static assets, _next, etc.
     */
    '/api/:path*',
    // Optionally include sensitive app routes:
    // '/dashboard/:path*',
  ],
};