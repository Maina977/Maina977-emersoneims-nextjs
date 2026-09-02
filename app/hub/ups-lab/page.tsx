import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import UpsLabClient from '@/components/hub/UpsLabClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/ups-lab' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'UPS Live Lab',
  description:
    'Interactive UPS engineering cockpit. Pick a UPS, add real-world loads (servers, computers, fridges, motors), and watch input vs output, headroom, runtime and alarms update live.',
};

export default function UpsLabPage() {
  return (
    <HubShell
      active="/hub/ups-lab"
      title="UPS Live Lab"
      caption="Add UPS units and loads. The cockpit shows live input vs output, headroom, runtime, mismatch, overload and alarms in real time — same engineering family as the Smart Sizing simulator."
    >
      <UpsLabClient />
    </HubShell>
  );
}
