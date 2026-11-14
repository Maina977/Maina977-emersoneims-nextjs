import type { Metadata } from 'next';
import TakeoffClient from './TakeoffClient';

// P1-D measured take-off (2026-11-14). New route: kept out of search until
// management approves it as a public route.
export const metadata: Metadata = {
  title: 'Measured Take-off and BOQ',
  description: 'Measure quantities on a scaled drawing and build a priced bill of quantities with dated rates.',
  robots: { index: false, follow: false },
  // Own canonical: app/solutions/layout.tsx hard-codes one for its children.
  alternates: { canonical: '/solutions/building/takeoff' },
};

export default function TakeoffPage() {
  return <TakeoffClient />;
}
