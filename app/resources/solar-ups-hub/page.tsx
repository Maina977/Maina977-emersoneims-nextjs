import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Solar / UPS Hub | EmersonEIMS',
  description:
    'Solar & UPS Intelligence Hub — sizing, audit, product intelligence, diagnostics, and the case library, in one workspace.',
  alternates: { canonical: '/hub' },
};

// Alias route so /resources/solar-ups-hub deep-links to the live hub.
export default function SolarUpsHubAlias() {
  redirect('/hub');
}
