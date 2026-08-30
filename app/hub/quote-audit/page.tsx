import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import QuoteAuditClient from '@/components/hub/QuoteAuditClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/quote-audit' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Quotation Audit',
  description:
    'Line-by-line review of supplier quotations against catalogue prices and engineering rules.',
};

export default function QuoteAuditPage() {
  return (
    <HubShell
      active="/hub/quote-audit"
      title="Quotation Audit"
      caption="Compare every quotation line against the catalogue and engineering rules. Severities use the same status palette as the rest of the hub."
    >
      <QuoteAuditClient />
    </HubShell>
  );
}
