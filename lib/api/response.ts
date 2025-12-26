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

export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}