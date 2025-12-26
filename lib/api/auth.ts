// src/lib/api/auth.ts
import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';

export interface AuthResult {
  authorized: boolean;
  error?: string;
  keyId?: string; // e.g., for multi-key support later
}

/**
 * Check API key auth (header: X-API-Key).
 * Falls back to permissive mode if no API_KEY set (dev-friendly).
 */
export function checkApiAuth(request: NextRequest): AuthResult {
  const envKey = process.env.API_KEY;
  if (!envKey) {
    // Dev mode: no auth required
    return { authorized: true };
  }

  const clientKey = request.headers.get('x-api-key')?.trim();
  if (!clientKey) {
    return {
      authorized: false,
      error: 'Missing X-API-Key header',
    };
  }

  // Timing-safe comparison (avoid leaking via timing attacks)
  const clientKeyBuf = Buffer.from(clientKey, 'utf8');
  const envKeyBuf = Buffer.from(envKey, 'utf8');
  
  if (clientKeyBuf.length !== envKeyBuf.length) {
    return {
      authorized: false,
      error: 'Invalid API key',
    };
  }

  const valid = timingSafeEqual(clientKeyBuf, envKeyBuf);

  if (!valid) {
    return {
      authorized: false,
      error: 'Invalid API key',
    };
  }

  return { authorized: true };
}