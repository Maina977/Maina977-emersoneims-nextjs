import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import UpsLabClient from '@/components/hub/UpsLabClient';

export const metadata = {
  title: 'UPS Live Lab — Solar & UPS Intelligence Hub',
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
