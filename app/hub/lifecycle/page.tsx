import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import LifecycleClient from '@/components/hub/LifecycleClient';

export const metadata = {
  title: 'Lifecycle Cost Calculator — Solar & UPS Intelligence Hub',
  description:
    '25-year discounted cashflow comparison of grid-only, grid + diesel, and solar/UPS hybrid strategies. Returns NPV, payback, and a cumulative cost chart with a transparent methodology.',
};

export default function LifecyclePage() {
  return (
    <HubShell
      active="/hub/lifecycle"
      title="Lifecycle Cost Calculator"
      caption="Capex + tariff + diesel + O&M, escalated and discounted across a 25-year horizon. Sample defaults — replace with your own numbers."
    >
      <LifecycleClient />
    </HubShell>
  );
}
