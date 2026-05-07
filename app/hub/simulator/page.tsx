import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import SimulatorClient from '@/components/hub/SimulatorClient';

export const metadata = {
  title: 'Smart Sizing Simulator — Solar & UPS Intelligence Hub',
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
