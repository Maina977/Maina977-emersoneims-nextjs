import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import SimulatorClient from '@/components/hub/SimulatorClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/simulator' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Smart Sizing Simulator',
  description:
    'Generator, fuel and UPS sizing with site derate, runtime and load profile.',
};

export default function SimulatorPage() {
  return (
    <HubShell
      active="/hub/simulator"
      title="Smart Sizing Simulator"
      caption="Set load and site conditions; get a transparent recommendation in kVA, L/h and kWh. Heuristics shown — replace with authoritative tables before quoting."
      wide
    >
      <SimulatorClient />
    </HubShell>
  );
}
