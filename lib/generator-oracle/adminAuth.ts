import type { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Admin check for the Generator Oracle licence endpoints (security hotfix
 * 2026-11-13). Requires a configured ADMIN_API_KEY of at least 16 characters
 * and a matching Bearer token, compared in constant time. Never true when the
 * key is not configured: the old check compared with `Bearer ${ADMIN_API_KEY}`,
 * which became "Bearer undefined" when the variable was unset.
 */
export function isAdminRequest(request: Pick<NextRequest, 'headers'>, env: Record<string, string | undefined> = process.env): boolean {
  const adminKey = env.ADMIN_API_KEY?.trim();
  if (!adminKey || adminKey.length < 16) return false;
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return false;
  const provided = Buffer.from(header.slice(7).trim());
  const expected = Buffer.from(adminKey);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}
