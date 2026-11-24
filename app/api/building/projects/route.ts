/**
 * Building Projects API: RETIRED (security review 2026-11-24). See lib/security/retiredRoute.ts.
 * It had no authentication: anyone could list every project with its owner's
 * email, and read, change or delete any project. No page used it.
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This projects API');
export const GET = gone;
export const POST = gone;
export const PUT = gone;
export const DELETE = gone;
