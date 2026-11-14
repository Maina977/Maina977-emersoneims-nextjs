/**
 * Server-side entitlement check for paid functions (P1, 2026-11-15).
 *
 * - Free mode (NEXT_PUBLIC_AI_TOOLS_PAID not 'true', today's setting):
 *   everything is allowed, exactly as now.
 * - Paid mode: a request to a paid function is allowed only if all of these hold:
 *     1. it carries a valid, unexpired entitlement token (x-eims-entitlement header);
 *     2. the token grants the feature;
 *     3. the licence row still exists, is 'active', is not past expires_at, and
 *        is still bound to the token's device.
 *   Anything else is refused. That includes a missing signing key or an
 *   unavailable database (fail closed).
 *
 * Which routes are paid is a management decision (PAID_FEATURES is empty until
 * it is made). Server logic never trusts the browser's stored licence.
 */
import { verifyEntitlement } from './token';
import { getLicenseById } from '@/lib/generator-oracle/db';

export const ENTITLEMENT_HEADER = 'x-eims-entitlement';

/** Features that need a paid entitlement once paid mode is on. Empty until management decides. */
export const PAID_FEATURES: ReadonlySet<string> = new Set<string>([]);

export type EntitlementDecision =
  | { allowed: true; mode: 'free' | 'paid'; licenceId?: number }
  | { allowed: false; status: 401 | 403 | 503; reason: string };

export function paidModeOn(env: Record<string, string | undefined> = process.env): boolean {
  return env.NEXT_PUBLIC_AI_TOOLS_PAID === 'true';
}

export async function checkEntitlement(
  headers: Headers,
  feature: string,
  deps: {
    env?: Record<string, string | undefined>;
    now?: number;
    getLicense?: typeof getLicenseById;
    paidFeatures?: ReadonlySet<string>;
  } = {},
): Promise<EntitlementDecision> {
  const env = deps.env ?? process.env;
  if (!paidModeOn(env)) return { allowed: true, mode: 'free' };
  const paid = deps.paidFeatures ?? PAID_FEATURES;
  if (!paid.has(feature)) return { allowed: true, mode: 'paid' }; // not a paid function

  const v = verifyEntitlement(headers.get(ENTITLEMENT_HEADER), { env, now: deps.now });
  if (!v.ok) {
    if (v.reason === 'no-key') return { allowed: false, status: 503, reason: 'Paid features are not configured on this server.' };
    return { allowed: false, status: 401, reason: v.reason === 'expired' ? 'Entitlement expired: re-validate the licence.' : 'A valid licence entitlement is required.' };
  }
  if (!v.payload.feat.includes(feature)) return { allowed: false, status: 403, reason: 'This licence does not include this feature.' };

  const lic = await (deps.getLicense ?? getLicenseById)(v.payload.lic).catch(() => null);
  if (!lic) return { allowed: false, status: 503, reason: 'Licence could not be confirmed right now.' };
  const now = deps.now ?? Date.now();
  if (lic.status !== 'active') return { allowed: false, status: 403, reason: `Licence is ${lic.status}.` };
  if (lic.expires_at && new Date(lic.expires_at).getTime() <= now) return { allowed: false, status: 403, reason: 'Licence has expired.' };
  if (lic.device_fingerprint !== v.payload.dev) return { allowed: false, status: 403, reason: 'Licence is bound to a different device.' };
  return { allowed: true, mode: 'paid', licenceId: lic.id };
}
