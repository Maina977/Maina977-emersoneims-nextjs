/**
 * API Middleware Utilities
 * Rate limiting, authentication, and request validation for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { limiter } from '@/lib/rate-limiter';
import { timingSafeEqual } from 'crypto';

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
  // Try various headers (handles proxies, load balancers, Vercel)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  const xClientIp = request.headers.get('x-client-ip');
  
  // X-Forwarded-For can contain multiple IPs, take the first one
  const ip = forwardedFor?.split(',')[0]?.trim() || 
             realIp || 
             cfConnectingIp || 
             xClientIp || 
             'unknown';
  
  return ip;
}

// Re-export for convenience
export { getClientIP as getIP };

/**
 * Check API authentication (optional)
 * Uses timing-safe comparison to prevent timing attacks
 */
export function checkApiAuth(request: NextRequest): { authorized: boolean; error?: string } {
  // Only check if API_KEY is set in environment
  const envKey = process.env.API_KEY;
  if (!envKey) {
    // No API key required in dev mode
    return { authorized: true };
  }

  const apiKey = request.headers.get('x-api-key')?.trim();

  if (!apiKey) {
    return {
      authorized: false,
      error: 'API key required. Provide X-API-Key header.'
    };
  }

  // Timing-safe comparison to prevent timing attacks
  const apiKeyBuf = Buffer.from(apiKey, 'utf8');
  const envKeyBuf = Buffer.from(envKey, 'utf8');

  // Length check first (constant time for different lengths)
  if (apiKeyBuf.length !== envKeyBuf.length) {
    return {
      authorized: false,
      error: 'Invalid API key'
    };
  }

  // Timing-safe equality check
  if (!timingSafeEqual(apiKeyBuf, envKeyBuf)) {
    return {
      authorized: false,
      error: 'Invalid API key'
    };
  }

  return { authorized: true };
}

/**
 * Apply rate limiting to request
 */
export function applyRateLimit(
  request: NextRequest, 
  limit: number = 100 // requests per minute
): { success: boolean; remaining: number; reset: number; error?: string } {
  const ip = getClientIP(request);
  const result = limiter.check(limit, ip);

  if (!result.success) {
    return {
      success: false,
      remaining: result.remaining,
      reset: result.reset,
      error: `Rate limit exceeded. Try again after ${new Date(result.reset).toISOString()}`,
    };
  }

  return {
    success: true,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(remaining: number, reset: number): NextResponse {
  const resetDate = new Date(reset).toISOString();
  
  return NextResponse.json(
    { 
      success: false, 
      error: 'Rate limit exceeded',
      retryAfter: resetDate,
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    }
  );
}

/**
 * Create unauthorized error response
 */
export function createUnauthorizedResponse(error: string): NextResponse {
  return NextResponse.json(
    { success: false, error },
    { status: 401 }
  );
}

// Allowed origins for CORS - whitelist approach for security
const ALLOWED_ORIGINS = [
  'https://www.emersoneims.com',
  'https://emersoneims.com',
  'https://generator-oracle.vercel.app',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:3010'] : []),
];

/**
 * Add CORS headers to response
 * Uses whitelist approach instead of wildcard for security
 */
export function addCorsHeaders(response: NextResponse, origin?: string | null): NextResponse {
  // Only allow whitelisted origins
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  response.headers.set('Vary', 'Origin');
  return response;
}

