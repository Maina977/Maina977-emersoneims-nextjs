import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import MaintenanceClient from '@/components/hub/MaintenanceClient';

export const metadata = {
  title: 'Maintenance Planner — Solar & UPS Intelligence Hub',
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
