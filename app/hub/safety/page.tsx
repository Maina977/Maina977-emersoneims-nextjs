import * as React from 'react';
import { HubShell } from '@/components/hub/HubShell';
import SafetyClient from '@/components/hub/SafetyClient';

export const metadata = {
  /*
   * Dropped the ' — Solar & UPS Intelligence Hub' suffix. It spent ~30
   * characters of every search result repeating branding nobody types —
   * /hub ranked at position 34.7 for exactly that phrase. The root
   * template supplies ' | EmersonEIMS Kenya' instead, which at least
   * names the company. Visible Hub branding on the page is untouched.
   */
  title: 'Safety & Fire Prevention',
  description:
    'Battery-room safety: thermal-runaway risk by chemistry, ventilation calculation, clearance, smoke alarms, fire separation and the fire-class extinguisher matrix.',
};

export default function SafetyPage() {
  return (
    <HubShell
      active="/hub/safety"
      title="Safety & Fire Prevention"
      caption="Score the battery room before commissioning. Pick chemistry and dimensions; the page returns a 0–100 fire-safety compliance score, the chemistry profile and the extinguisher matrix."
    >
      <SafetyClient />
    </HubShell>
  );
}
