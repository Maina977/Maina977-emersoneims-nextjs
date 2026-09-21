import type { Metadata } from 'next';

/**
 * NOINDEX FOR THE WHOLE /dashboard TREE.
 *
 * /dashboard/analytics and /dashboard/reviews are internal operational
 * screens. Audited 2026-09-21 against production: both answered 200 with
 * "index, follow", and both served the generic site-wide title
 * ("EmersonEIMS | B2B Power & Engineering Partner...") because neither
 * declares metadata of its own. So they were crawlable, indexable, and
 * competing with the real pages on a duplicate title.
 *
 * The rule lives in a layout because both pages are client components, and a
 * client component cannot export metadata. A layout is a server component, so
 * it can — and it covers any screen added to this tree later, which a fix
 * applied page-by-page would not.
 *
 * robots.txt already disallows /admin/ but says nothing about /dashboard/, so
 * nothing else was keeping these out. Neither is in sitemap.xml and nothing
 * links to them, so this introduces no conflicting signal.
 *
 * NOT A SUBSTITUTE FOR ACCESS CONTROL. noindex asks well-behaved crawlers not
 * to list these URLs; it does not stop anyone who has the address from opening
 * them. If these screens show real operational data they need authentication,
 * and that is a separate piece of work from this one.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
