import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import PowerQualityClient from '@/components/hub/PowerQualityClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/power-quality' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Power Quality Analysis — Solar & UPS',
  description:
    'Voltage, THD-V, THD-I, frequency, sag/swell and flicker dashboard with EN 50160 / IEEE 519 reference limits and connected workflow into the simulator and diagnostics.',
};

export default function PowerQualityPage() {
  return (
    <HubShell
      active="/hub/power-quality"
      title="Power Quality"
      caption="Enter site readings; the page returns voltage and harmonic compliance against EN 50160 / IEEE 519 with a 24-hour envelope and prioritised recommendations."
    >
      <PowerQualityClient />
    </HubShell>
  );
}
