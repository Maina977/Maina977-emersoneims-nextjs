/**
 * RETIRED API ROUTES (security review, 2026-11-24).
 *
 * These routes had no authentication and no caller in the site:
 *   - /api/building/projects: anyone could list every project with its
 *     owner's name and email, and read, change or delete any project by id;
 *   - /api/auth/login and /api/auth/signup: an old account system that stored
 *     passwords as unsalted SHA-256 (fast to crack) and was used by no page.
 * Production returned no stored records when checked (no database behind the
 * projects route; no legacy accounts reachable), so nothing was exposed, but
 * connecting a database would have exposed everything. They now answer 410 Gone.
 * Projects are kept in the browser by the Building suite; organisation-scoped
 * project storage with accounts is being built separately (Report B).
 *
 * Security hotfix 2026-11-26, retired the same way:
 *   - /api/src/app/api/proxy/...: an open proxy (prefix-matched ?target=), no caller;
 *   - /api/orders/[orderId] and /api/customers/[customerId]/orders: order and
 *     customer PII by guessable id with no sign-in. No order was ever stored
 *     (/api/orders/create does not persist), so both always answered empty.
 */
import { NextResponse } from 'next/server';

export function retired(what: string): NextResponse {
  return NextResponse.json(
    { success: false, error: `${what} has been retired for security reasons.` },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  );
}
