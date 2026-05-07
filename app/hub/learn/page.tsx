import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import LearnClient from '@/components/hub/LearnClient';

export const metadata = {
  title: 'Learning Mode — Solar & UPS Intelligence Hub',
  description:
    'Short structured lessons. Client track teaches how to buy and own safely; Pro track teaches sizing, commissioning and acceptance. Switch tracks via the Client/Pro toggle in the header.',
};

export default function LearnPage() {
  return (
    <HubShell
      active="/hub/learn"
      title="Learning Mode"
      caption="Audience-aware lessons. The header Client/Pro toggle switches the entire track. Progress is stored in your browser only."
    >
      <LearnClient />
    </HubShell>
  );
}
