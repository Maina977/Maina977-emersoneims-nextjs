import { timingSafeEqual } from 'crypto';

/**
 * Admin check for API routes (which sit outside middleware.ts).
 *
 * Accepts either `Authorization: Bearer <ADMIN_API_KEY>` (server-to-server)
 * or the `admin_session` cookie that middleware's admin gate already uses for
 * /admin and /dashboard pages — so a dashboard opened in the browser can call
 * its own APIs. In production with no ADMIN_API_KEY set, everything is denied.
 *
 * Added 2026-10-18 after an audit found /api/notifications (sends email/SMS to
 * any address supplied) and /api/reviews/moderation/* (approve/reject reviews)
 * open to anyone on the internet.
 */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function isAdminRequest(request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return process.env.NODE_ENV !== 'production';

  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ') && safeEqual(auth.slice(7).trim(), adminKey)) return true;

  const cookie = (request.headers.get('cookie') || '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('admin_session='));
  if (cookie && safeEqual(decodeURIComponent(cookie.slice('admin_session='.length)), adminKey)) return true;

  return false;
}

/** 404 rather than 401/403, matching middleware: do not advertise admin surfaces. */
export function adminNotFound(): Response {
  return new Response('Not Found', { status: 404 });
}
