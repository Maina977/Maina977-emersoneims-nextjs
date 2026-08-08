import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import SolarUpsClient from '@/components/hub/SolarUpsClient';

export const metadata = {
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Solar & UPS System Comparison',
  description:
    'Solar PV section and UPS section: sizing, instruments, topology guidance.',
};

export default function SolarUpsPage() {
  return (
    <HubShell
      active="/hub/solar-ups"
      title="Solar & UPS"
      caption="Two sections, one toolkit. Generation profile, isolation gauges, autonomy and topology guidance."
    >
      <SolarUpsClient />
    </HubShell>
  );
}
