/**
 * Building Quotations API: RETIRED (security hotfix 2026-11-26, CA-27). See lib/security/retiredRoute.ts.
 *
 * It had no authentication and no caller in the site: anyone could list every stored quotation (from the
 * database whenever one is connected), read any quotation, create quotations, and overwrite a quotation's
 * VAT and total without recalculation (the independent review set VAT to 999 and the total to 1). It is
 * retired the same way as /api/building/projects (2026-11-24). Every method answers 410 Gone; nothing is
 * read from or written to storage. The previous handler is preserved in git history
 * (`git show bf2c7500:app/api/building/quotations/route.ts`).
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This quotations API');
export const GET = gone;
export const HEAD = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
export const OPTIONS = gone;
