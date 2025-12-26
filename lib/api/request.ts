// src/lib/api/request.ts
import { NextRequest } from 'next/server';

/**
 * Extract client IP with Vercel/Cloudflare/Proxy support.
 * Safe for Edge Runtime (no Node.js APIs).
 */
export function getClientIP(request: NextRequest): string {
  // Order matters: prioritize more trusted headers first
  const ip =
    request.headers.get('x-vercel-forwarded-for') ?? // Vercel-specific (most trusted)
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('cf-connecting-ip') ?? // Cloudflare
    request.headers.get('x-client-ip') ??
    '127.0.0.1'; // fallback (never "unknown" for logging safety)

  // Sanitize: remove port if present (e.g., "192.168.1.1:54321")
  return ip.split(':')[0].trim();
}

export const getIP = getClientIP; // alias