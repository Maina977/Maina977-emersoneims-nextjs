import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import InstallationClient from '@/components/hub/InstallationClient';

export const metadata = {
  title: 'Installation Visualizer — Solar & UPS Intelligence Hub',
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
