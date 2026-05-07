import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import DocPackClient from '@/components/hub/DocPackClient';

export const metadata = {
  title: 'Documentation Pack — Solar & UPS Intelligence Hub',
  description:
    'Printable installer & commissioning bundle: SLD reference, commissioning checklist, acceptance test record, and sign-off. Print → Save as PDF.',
};

export default function DocPackPage() {
  return (
    <HubShell
      active="/hub/doc-pack"
      title="Documentation Pack"
      caption="A field-ready installer / commissioning bundle. Fill the header, print, and hand over with the as-built drawings."
    >
      <DocPackClient />
    </HubShell>
  );
}
