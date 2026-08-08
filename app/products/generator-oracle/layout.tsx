import type { Metadata } from 'next';

/*
 * Metadata for /products/generator-oracle.
 *
 * page.tsx here is a 'use client' component and cannot export metadata, so
 * this page was inheriting the ROOT DEFAULT title — the homepage's
 * "EmersonEIMS | B2B Power & Engineering Partner...". Four separate sections
 * were shipping that same generic title, competing with the homepage and
 * telling a searcher nothing about the page they were being offered.
 *
 * A server-side layout is the supported way to give a client page metadata.
 * No canonical here on purpose — a layout canonical is inherited by every
 * child route and has silently de-indexed pages on this site before.
 */
export const metadata: Metadata = {
  title: 'Generator Oracle — Diagnostic Platform',
  description:
    'Generator Oracle is the EmersonEIMS diagnostic platform: fault-code lookup across major controller brands, wiring references and guided fault diagnosis.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
