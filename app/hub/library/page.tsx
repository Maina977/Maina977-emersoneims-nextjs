import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import LibraryClient from '@/components/hub/LibraryClient';

export const metadata = {
  title: 'Library — Solar & UPS Intelligence Hub',
  description:
    'Documentation, training tracks and customer case studies in one indexed library.',
};

export default function LibraryPage() {
  return (
    <HubShell
      active="/hub/library"
      title="Documentation, Training & Cases"
      caption="Manuals, training tracks and case studies. Freshness badges share the same status palette as the rest of the hub."
    >
      <LibraryClient />
    </HubShell>
  );
}
