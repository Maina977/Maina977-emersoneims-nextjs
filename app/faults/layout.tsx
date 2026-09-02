import type { Metadata } from 'next';

/*
 * Metadata for /faults.
 *
 * page.tsx here is a 'use client' component and cannot export metadata, so
 * this page was inheriting the ROOT DEFAULT title — the homepage's
 * "EmersonEIMS | B2B Power & Engineering Partner...". Four separate sections
 * were shipping that same generic title, competing with the homepage and
 * telling a searcher nothing about the page they were being offered.
 *
 * A server-side layout is the supported way to give a client page metadata.
 *
 * ABOUT THE CANONICAL BELOW. This comment previously read "no canonical here
 * on purpose", because a layout's alternates.canonical is inherited by every
 * child route and that has silently de-indexed pages on this site before. One
 * was added when the root layout stopped deriving canonicals from headers()
 * (that call forced all ~3,400 pages to render dynamically and disabled
 * browser caching everywhere), and every route then had to declare its own.
 *
 * It is safe HERE, and only because every child of /faults declares its own
 * canonical which overrides this one — verified against the live site as
 * Googlebot across /faults, /faults/plant, /faults/plant/<brand> and
 * /faults/<code>, each of which self-canonicalises correctly.
 *
 * THE TRAP IS STILL LIVE: add a child route under /faults without its own
 * alternates.canonical and it will silently canonicalise to /faults and drop
 * out of the index. Give every new route its own.
 */
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.emersoneims.com/faults' },
  title: 'Generator Fault Code Database',
  description:
    'Search generator fault codes by brand and controller — DSE, SmartGen, Datakom, ComAp and more, with likely causes and what to check first. Free, no signup.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
