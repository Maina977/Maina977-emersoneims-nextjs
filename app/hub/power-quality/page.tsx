import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import PowerQualityClient from '@/components/hub/PowerQualityClient';

export const metadata = {
  title: 'Power Quality — Solar & UPS Intelligence Hub',
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
