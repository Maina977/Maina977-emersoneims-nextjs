import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import MaintenanceClient from '@/components/hub/MaintenanceClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/maintenance' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Maintenance Planner',
  description:
    'Scheduled maintenance tasks for batteries, inverters, PV, UPS, gensets, earthing and SPDs — with intervals, consumables, user-safe vs pro split and a 12-month battery health projection.',
};

export default function MaintenancePage() {
  return (
    <HubShell
      active="/hub/maintenance"
      title="Maintenance Planner"
      caption="Every asset family with the task, interval, consumable and what-good-looks-like. Sample dataset — replace 'last done' with the real site log before going live."
    >
      <MaintenanceClient />
    </HubShell>
  );
}
