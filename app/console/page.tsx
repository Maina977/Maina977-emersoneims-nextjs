import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { BSP_CONSOLE_TARGET } from '@/lib/buildingSuitePro/featureRoutes';

/**
 * /console — canonical entry to the Building Suite Pro Console SPA.
 *
 * The Building Suite Pro wizard iframes `/console` (with hash fragments
 * such as `#mep_clash`, `#hr_pdelta`, `#hc_audit`, `#cl_lock_acq`) for
 * the deep-link "Pro Console" mode. The console HTML lives at
 * `/public/eims-pro-console.html`.
 *
 * A `next.config.ts` rewrite previously mapped `/console` → `/eims-pro-console`
 * but proved fragile across Vercel deploys (production was returning 404
 * for `/console` while `/eims-pro-console` returned 200). This explicit
 * App Router redirect is the durable structural fix: it cannot be lost
 * by a config drift, and it preserves the URL hash through the redirect
 * (browsers retain the fragment across HTTP 3xx).
 */
export const metadata: Metadata = {
  title: 'Building Suite Pro · Console',
  robots: { index: false, follow: false },
  alternates: { canonical: BSP_CONSOLE_TARGET },
};

export default function ConsoleEntry() {
  redirect(BSP_CONSOLE_TARGET);
}
