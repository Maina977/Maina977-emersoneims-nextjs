import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import SolarUpsClient from '@/components/hub/SolarUpsClient';

export const metadata = {
  title: 'Solar & UPS — Solar & UPS Intelligence Hub',
  description:
    'Solar PV section and UPS section: sizing, instruments, topology guidance.',
};

export default function SolarUpsPage() {
  return (
    <HubShell
      active="/hub/solar-ups"
      title="Solar & UPS"
      caption="Two sections, one toolkit. Generation profile, isolation gauges, autonomy and topology guidance."
    >
      <SolarUpsClient />
    </HubShell>
  );
}
