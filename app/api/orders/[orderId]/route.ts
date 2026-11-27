/**
 * Order lookup by id: RETIRED (security hotfix 2026-11-26). See lib/security/retiredRoute.ts.
 *
 * It returned the whole order (customer name, phone, email, items) to anyone
 * who supplied the order id, with no sign-in or secret. Order ids are
 * ORD-YYYYMMDD-NNNN (10,000 per day, Math.random), so they can be guessed.
 * Nothing was exposed: /api/orders/create has never stored an order, so the
 * in-memory store behind this route was always empty and it always answered
 * 404. It is retired so that storing orders later cannot expose them. The
 * order tracker shows a notice instead.
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('Online order lookup');
// All 7 methods answer 410.
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
