import type { Metadata } from 'next';

/*
 * Metadata for /maintenance-hub/fabrication.
 *
 * page.tsx here is a 'use client' component, and a client component cannot
 * export metadata — which is why this page, and its ten siblings, all shipped
 * the SAME title and description inherited from app/maintenance-hub/layout.tsx.
 * Eleven URLs competing on one 84-character title is a duplicate-title problem
 * and a truncation problem at once. A server-side layout is the supported way
 * to give a client page its own metadata.
 *
 * No canonical is set here on purpose: a canonical in a layout is inherited by
 * every child route beneath it, which has silently de-indexed pages on this
 * site before. The root layout emits a correct self-referential canonical.
 */
export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/maintenance-hub/fabrication' },
  title: 'Generator Canopy, Exhaust & Tank Fabrication',
  description:
    'Fabrication for power installations in Kenya — generator exhausts, acoustic canopies, fuel tanks, enclosures and electrical panels, built and fitted.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
