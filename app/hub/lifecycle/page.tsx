import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import LifecycleClient from '@/components/hub/LifecycleClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/lifecycle' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Lifecycle Cost Calculator',
  description:
    '25-year discounted cashflow comparison of grid-only, grid + diesel, and solar/UPS hybrid strategies. Returns NPV, payback, and a cumulative cost chart with a transparent methodology.',
};

export default function LifecyclePage() {
  return (
    <HubShell
      active="/hub/lifecycle"
      title="Lifecycle Cost Calculator"
      caption="Capex + tariff + diesel + O&M, escalated and discounted across a 25-year horizon. Sample defaults — replace with your own numbers."
    >
      <LifecycleClient />
    </HubShell>
  );
}
