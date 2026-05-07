import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import AbuseClient from '@/components/hub/AbuseClient';

export const metadata = {
  title: 'Abuse / Misuse Predictor — Solar & UPS Intelligence Hub',
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
