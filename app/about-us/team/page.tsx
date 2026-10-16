import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

// Own canonical so this page does not inherit the one hard-coded in
// app/about-us/layout.tsx (scripts/check-canonical-inheritance.mjs).
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.emersoneims.com/team' },
};

/*
 * /about-us/team -> /team (308), 2026-10-16.
 *
 * This page named six engineers and six technicians, with certificates such
 * as "Cummins Factory Certification" and "Cummins ISBe/ISLe Certified", and
 * listed Cummins and Perkins academies as certifying bodies. The owner
 * confirmed none of those people or certificates are real, so all of it was
 * removed. /team already describes the real teams (engineering,
 * installation, maintenance, solar, water, AC) without inventing anyone, so
 * this address now sends visitors there rather than repeating it.
 *
 * Do not add named staff here again unless the owner supplies the names.
 */
export default function AboutUsTeamPage() {
  permanentRedirect('/team');
}
