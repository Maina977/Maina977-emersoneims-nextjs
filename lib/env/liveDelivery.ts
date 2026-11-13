/**
 * Live message delivery is allowed ONLY on the production deployment
 * (management decision 2026-11-13: no preview or test activity may email real
 * customers, the sales inbox or external contacts).
 *
 * Vercel sets VERCEL_ENV to 'production' on production deployments (confirmed
 * on the live /api/health, build 079d0188), 'preview' on preview deployments,
 * and nothing on a local build. Previews and local runs therefore get a clearly
 * marked mock: nothing is sent and no lead is written.
 *
 * Why a guard and not just missing keys: FormSubmit needs no key and delivers
 * to the sales inbox from any environment, and a local .env can hold real keys.
 */
export function liveDeliveryAllowed(env: Record<string, string | undefined> = process.env): boolean {
  return env.VERCEL_ENV === 'production';
}

export const TEST_ENVIRONMENT_NOTICE =
  'Test environment: nothing was sent and nothing was stored. Enquiries are delivered only on the live site, www.emersoneims.com.';

/** The JSON a form endpoint returns instead of delivering, outside production. */
export function mockDeliveryResponse(extra: Record<string, unknown> = {}) {
  return { success: true, mock: true, delivered: false, environment: process.env.VERCEL_ENV || 'local', message: TEST_ENVIRONMENT_NOTICE, ...extra };
}
