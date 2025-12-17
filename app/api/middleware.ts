/**
 * API Middleware Utilities
 * Rate limiting, authentication, and request validation for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { limiter } from '@/lib/rate-limiter';

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
             request.ip || 
             'unknown';
  
  return ip;
}

// Re-export for convenience
export { getClientIP as getIP };

/**
 * Check API authentication (optional)
 */
export function checkApiAuth(request: NextRequest): { authorized: boolean; error?: string } {
  // Only check if API_KEY is set in environment
  if (!process.env.API_KEY) {
    // No API key required
    return { authorized: true };
  }

  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return { 
      authorized: false, 
      error: 'API key required. Provide X-API-Key header.' 
    };
  }

  if (apiKey !== process.env.API_KEY) {
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

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  return response;
}

