/**
 * Generic proxy (/api/src/app/api/proxy/...): RETIRED (security hotfix 2026-11-26).
 * See lib/security/retiredRoute.ts.
 *
 * It forwarded GET/POST/PUT/DELETE to any ?target= that *started with* an
 * allowed origin, so https://api.nasa.gov.attacker.example passed the check
 * and the site acted as an open proxy with CORS enabled. Nothing in the site
 * called it (template code added 2025-12-27, commit 3728661d). The previous
 * code is in git history; every method now answers 410 Gone and fetches nothing.
 */
import { retired } from '@/lib/security/retiredRoute';

const gone = () => retired('This proxy API');
export const GET = gone;
export const POST = gone;
export const PUT = gone;
export const DELETE = gone;
export const PATCH = gone;
