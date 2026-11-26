/**
 * Building Quotations API: RETIRED (2026-11-26). See lib/security/retiredRoute.ts.
 * It had no authentication: anyone could list every quotation (with the
 * user's name and email once a database is connected), read any by id, create
 * one, or overwrite any field of one, totals included, without recomputing
 * them. Its POST also computed VAT wrongly (a VAT of 0 became 16 %; VAT was
 * added to a total with no subtotal; the discount came off after VAT). No page
 * used it. Same retirement as /api/building/projects (2026-11-24, 3f6669ea).
 * The previous handlers are in git history (bf2c7500).
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This quotations API');
export const GET = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
