/**
 * Building Suppliers & Material Prices API: RETIRED (independent review
 * 2026-11-26). See lib/security/retiredRoute.ts.
 * It had no authentication and no caller in the site. It listed real Kenyan
 * companies with star ratings (4.4-4.9) and "verified: true" that nobody had
 * verified, claimed certifications on their behalf, attributed material
 * prices to them as "Kenya Market Survey Q1 2026" with no citation, and its
 * POST costed any bill of materials against those prices. Same retirement as
 * /api/building/projects (2026-11-24, 3f6669ea). The previous handlers are
 * in git history (bf2c7500).
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This suppliers API');
export const GET = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
