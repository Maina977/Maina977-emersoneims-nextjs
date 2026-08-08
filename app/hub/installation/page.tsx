import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import InstallationClient from '@/components/hub/InstallationClient';

export const metadata = {
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Installation Visualizer',
  description:
    'Single-line diagram, breaker chain, earthing, SPD coordination, ventilation and cable schedule for residential, SME and small data-centre architectures.',
};

export default function InstallationPage() {
  return (
    <HubShell
      active="/hub/installation"
      title="Installation Visualizer"
      caption="Pick the architecture, see the single-line diagram, the breaker chain, the earthing target, the SPD class and the cable schedule. Sample reference data — confirm against the site survey."
    >
      <InstallationClient />
    </HubShell>
  );
}
