/**
 * Legacy sign-in: RETIRED (security review 2026-11-24). See lib/security/retiredRoute.ts.
 * It checked unsalted SHA-256 password hashes and set an unsigned userId cookie. No page used it.
 */
import { retired } from '@/lib/security/retiredRoute';

export const POST = () => retired('This sign-in endpoint');
