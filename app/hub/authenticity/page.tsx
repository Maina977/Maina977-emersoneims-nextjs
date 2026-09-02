import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import AuthenticityClient from '@/components/hub/AuthenticityClient';

export const metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/hub/authenticity' },
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Authenticity Verification',
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
