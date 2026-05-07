import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import QuoteAuditClient from '@/components/hub/QuoteAuditClient';

export const metadata = {
  title: 'Quotation Audit — Solar & UPS Intelligence Hub',
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
