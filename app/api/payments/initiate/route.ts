/**
 * Payment initiate API (/api/payments/initiate): RETIRED (security sweep review 2026-11-27, SW-8 / S1).
 * See lib/security/retiredRoute.ts.
 *
 * It sent an M-Pesa STK prompt to any phone for any amount, with no sign-in and no rate limit, and returned the
 * provider's error message to the caller. It has no caller anywhere in the site, and it could not work in
 * production (hard-coded sandbox shortcode against the live host; M-Pesa credentials not set). Payments are parked
 * by management; the order-token-guarded /api/payments/mpesa is the only STK path. The previous code is in git
 * history. All 7 methods answer 410 Gone and call nothing.
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This payment API');
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
