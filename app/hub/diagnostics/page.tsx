import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import DiagnosticsClient from '@/components/hub/DiagnosticsClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/diagnostics' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Safety & Diagnostics',
  description:
    'Live cockpit for engine, UPS and PV plant: instruments, asset state, event log.',
};

export default function DiagnosticsPage() {
  return (
    <HubShell
      active="/hub/diagnostics"
      title="Safety & Diagnostics"
      caption="One cockpit for engine, UPS and solar telemetry. Severities and instrument bands match the rest of the hub."
    >
      <DiagnosticsClient />
    </HubShell>
  );
}
