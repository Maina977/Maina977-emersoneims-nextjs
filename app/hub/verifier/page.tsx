import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import VerifierClient from '@/components/hub/VerifierClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/verifier' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Combination Verifier',
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
