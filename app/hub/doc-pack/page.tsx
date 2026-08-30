import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import DocPackClient from '@/components/hub/DocPackClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/doc-pack' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Documentation Pack',
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
