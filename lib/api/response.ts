// src/lib/api/response.ts
import { NextResponse } from 'next/server';

export function createErrorResponse(
  status: number,
  error: string,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function createRateLimitResponse(
  remaining: number,
  reset: number,
  limit: number = 100
): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  
  return NextResponse.json(
    {
      success: false,
      error: 'Rate limit exceeded',
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.floor(reset / 1000).toString(),
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

export function createUnauthorizedResponse(error: string): NextResponse {
  return createErrorResponse(401, error);
}

// Allowed origins for CORS - whitelist approach for security
const ALLOWED_ORIGINS = [
  'https://www.emersoneims.com',
  'https://emersoneims.com',
  'https://generator-oracle.vercel.app',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:3010'] : []),
];

export function addCorsHeaders(response: NextResponse, origin?: string | null): NextResponse {
  // Only allow whitelisted origins
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  response.headers.set('Vary', 'Origin');
  return response;
}