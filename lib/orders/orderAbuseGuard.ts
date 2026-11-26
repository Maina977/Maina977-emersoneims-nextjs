/**
 * Abuse protection for /api/orders/create (order-abuse hotfix 2026-11-26).
 *
 * The route sends a confirmation email to the address in the request, so
 * without limits anyone could make the site email any address repeatedly.
 * Free, in-app measures only (no paid service, no store, no env change):
 *
 *  - honeypot: the checkout sends an empty hidden `website` field; bots that
 *    fill every input fill it too;
 *  - minimum fill time: the checkout sends `formStartedAt` (ms, when the
 *    shipping form was opened); an order sent < MIN_FILL_MS after it, or
 *    without it, or with a future/ancient value, is refused;
 *  - per-IP limit: IP_LIMIT accepted orders per IP per 10 minutes;
 *  - per-recipient limit: RECIPIENT_LIMIT confirmation emails per address per
 *    hour (keyed by a SHA-256 of the normalised address, see recipientKey;
 *    the address itself is never kept).
 *
 * Every refusal gets the same generic 429 body, which does not reveal which
 * check failed or what the limits are.
 *
 * LIMITATION (honest): the counters live in the memory of one serverless
 * instance. Vercel can run several instances at once and recycles them, so a
 * determined sender spread across instances or waiting for a cold start can
 * exceed these numbers. They stop casual and single-instance abuse; they are
 * not a guarantee. A Vercel Firewall rate-limit rule on POST
 * /api/orders/create is the recommended extra layer.
 */
import { createHash } from 'crypto';
import { rateLimit } from '@/lib/rate-limiter';

export const MIN_FILL_MS = 3_000;
export const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
export const IP_LIMIT = 5; // accepted orders per IP per 10 minutes
export const RECIPIENT_LIMIT = 3; // confirmation emails per address per hour

const ipWindow = rateLimit({ interval: 10 * 60, uniqueTokenPerInterval: 5000 });
const recipientWindow = rateLimit({ interval: 60 * 60, uniqueTokenPerInterval: 5000 });

export const TOO_MANY = { error: 'We could not take this order right now. Please wait a few minutes and try again, or contact us.' };

/**
 * The client IP. Prefers x-real-ip, which Vercel sets to the connecting
 * client's address (review 2026-11-26: the first x-forwarded-for entry could
 * be rotated by a client if the site were ever behind another proxy); then the
 * first x-forwarded-for entry; then one shared "unknown" bucket (fails safe:
 * requests without any address share one limit). @vercel/functions
 * ipAddress() reads the same header and is not installed, so it is not used.
 */
export function clientIp(req: Request): string {
  const real = req.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const first = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return first || 'unknown';
}

/**
 * One key per inbox (review 2026-11-26, blocking): NFKC, lower-case, any
 * "+tag" removed from the local part, and for gmail.com / googlemail.com the
 * dots removed from the local part and googlemail.com treated as gmail.com.
 * victim+1@gmail.com, v.ictim@gmail.com and Victim@googlemail.com all reach
 * the same inbox and now share one per-recipient limit.
 */
export function recipientKey(email: string): string {
  const e = email.normalize('NFKC').trim().toLowerCase();
  const at = e.lastIndexOf('@');
  if (at <= 0) return e;
  let local = e.slice(0, at);
  let domain = e.slice(at + 1);
  const plus = local.indexOf('+');
  if (plus >= 0) local = local.slice(0, plus);
  if (domain === 'googlemail.com') domain = 'gmail.com';
  if (domain === 'gmail.com') local = local.replace(/\./g, '');
  return `${local}@${domain}`;
}

/** True when the submission looks automated (honeypot filled or form filled too fast / no timestamp). */
export function looksAutomated(body: Record<string, unknown>, now = Date.now()): boolean {
  const hp = body.website;
  if (hp !== undefined && hp !== null && hp !== '') return true;
  const started = body.formStartedAt;
  if (typeof started !== 'number' || !Number.isFinite(started)) return true;
  const elapsed = now - started;
  return elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS;
}

/** Counts one accepted order for this IP; false when over the limit. */
export function allowIp(ip: string): boolean {
  return ipWindow.check(IP_LIMIT, `ip:${ip}`).success;
}

/** Counts one confirmation email for this address; false when over the limit. */
export function allowRecipient(email: string): boolean {
  const key = createHash('sha256').update(recipientKey(email)).digest('hex');
  return recipientWindow.check(RECIPIENT_LIMIT, `to:${key}`).success;
}
