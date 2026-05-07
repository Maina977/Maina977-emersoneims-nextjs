import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import VerifierClient from '@/components/hub/VerifierClient';

export const metadata = {
  title: 'Combination Verifier — Solar & UPS Intelligence Hub',
  description:
    'Quote + Load + Combination Verifier. Check whether a vendor proposal will actually power your appliances, expose missing items and risks, and compare 10-year cost against a cheaper-but-safe and a premium alternative.',
};

export default function VerifierPage() {
  return (
    <HubShell
      active="/hub/verifier"
      title="Combination Verifier"
      caption="Enter your appliances, the quote you received and your budget. Get a verdict, find what is missing, and compare 10-year cost against a cheaper-safe and a premium alternative."
    >
      <VerifierClient />
    </HubShell>
  );
}
