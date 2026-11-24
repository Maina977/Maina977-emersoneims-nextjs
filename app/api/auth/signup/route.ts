/**
 * Legacy sign-up: RETIRED (security review 2026-11-24). See lib/security/retiredRoute.ts.
 * It stored passwords as unsalted SHA-256. No page used it.
 */
import { retired } from '@/lib/security/retiredRoute';

export const POST = () => retired('This sign-up endpoint');
