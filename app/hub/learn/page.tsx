import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import LearnClient from '@/components/hub/LearnClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/learn' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Solar & UPS Learning Mode',
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
