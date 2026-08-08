import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import AbuseClient from '@/components/hub/AbuseClient';

export const metadata = {
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Abuse / Misuse Predictor',
  description:
    'What happens when batteries are over-discharged, AVR is bypassed, motors are run undervoltage, or PV is left dirty: degradation curves, failure modes, early warnings and 10-year cost penalty.',
};

export default function AbusePage() {
  return (
    <HubShell
      active="/hub/abuse"
      title="Abuse / Misuse Predictor"
      caption="Pick a scenario; see how fast state-of-health falls, what actually breaks, what the early warnings are and how much extra it costs over 10 years."
    >
      <AbuseClient />
    </HubShell>
  );
}
