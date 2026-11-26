/**
 * Generator Oracle suppliers API (/api/generator-oracle/suppliers): RETIRED
 * (security sweep 2026-11-26), the same treatment as the Building suppliers
 * API (67107788). See lib/security/retiredRoute.ts.
 *
 * With no database it served a built-in supplier directory
 * (lib/generator-oracle/supplierService.ts getDefaultSuppliers) of firms
 * marked `isVerified: true` with ratings 4.0-4.9 and response times such as
 * "< 30 minutes", none of it sourced, all using the company's own phone.
 * POST created parts requests and PATCH changed any parts request by id, with
 * no sign-in. Its only UI (components/generator-oracle/PartsOrderPanel.tsx)
 * is not mounted on any page. The previous code (9eb9ead2) is in git history.
 * All 7 methods answer 410 Gone.
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This suppliers API');
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
