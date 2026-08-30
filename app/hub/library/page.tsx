import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import LibraryClient from '@/components/hub/LibraryClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/library' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Solar & UPS Case Library',
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
