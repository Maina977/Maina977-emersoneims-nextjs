import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PilotsClient from './PilotsClient';

/**
 * Pilot comparison page (Phase 2, 2026-11-22). Management: "Prepare import and
 * comparison workflows for one real project per application", using company
 * project records only with permission and confidentiality safeguards.
 *
 * NON-PRODUCTION ONLY. Production answers 404 (this guard, plus guard 0-PILOT
 * in middleware.ts for the status code). Never indexed and never in the
 * sitemap (tests/validation-pilots/route-guard.test.ts).
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pilot comparison (reviewer tool)',
  description: 'Preview-only tool: compare one real project per application against the tested engines, in the browser.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function PilotsPage() {
  if (process.env.VERCEL_ENV === 'production') notFound();
  return <PilotsClient />;
}
