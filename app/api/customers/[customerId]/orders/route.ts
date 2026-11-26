/**
 * Customer order history: RETIRED (security hotfix 2026-11-26). See lib/security/retiredRoute.ts.
 *
 * It listed every order (name, phone, email, items) for any customer id in the
 * URL, with no sign-in. Checkout makes customer ids from the clock
 * (CUST-<milliseconds>), so they can be enumerated. Nothing was exposed:
 * /api/orders/create has never stored an order, so the list was always empty.
 * There is no account system on the site to prove whose history it is, so the
 * route is retired; /marketplace/orders explains how to check an order instead.
 */
import { retired } from '@/lib/security/retiredRoute';

export const GET = () => retired('Online order history');
