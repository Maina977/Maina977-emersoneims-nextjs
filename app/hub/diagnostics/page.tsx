import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import DiagnosticsClient from '@/components/hub/DiagnosticsClient';

export const metadata = {
  title: 'Safety & Diagnostics — Solar & UPS Intelligence Hub',
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
