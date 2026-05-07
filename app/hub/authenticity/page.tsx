import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import AuthenticityClient from '@/components/hub/AuthenticityClient';

export const metadata = {
  title: 'Authenticity Verification — Solar & UPS Intelligence Hub',
  description:
    'Verify the brand and model on your invoice match the unit delivered: serial portals, BIS/CE markings, seal photos, weight checks, and field-verification cautions by brand.',
};

export default function AuthenticityPage() {
  return (
    <HubShell
      active="/hub/authenticity"
      title="Authenticity Verification"
      caption="Pick the brand, walk the weighted checklist, get an authenticity-confidence score and the manufacturer portal to verify the serial. Reject any delivery scoring below 60."
    >
      <AuthenticityClient />
    </HubShell>
  );
}
