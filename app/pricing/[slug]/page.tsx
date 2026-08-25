/**
 * Price guide pages — /pricing/<slug>
 *
 * WHY THESE EXIST
 * The audit on 2026-08-17 found the site had 1,385 indexable URLs and exactly
 * three that targeted price or cost intent, all of them blog posts. Buyers in
 * this market do not search "generator engineering services". They search
 * "generator price in Kenya 30kva" and "borehole drilling cost in Kenya", and
 * the pages that win those searches say the cost in the title and the URL.
 *
 * The figures were already published on the service pages. What was missing was
 * a page whose title answers the question the buyer typed. That is all this is:
 * an existing, honest set of numbers put on a page the query can reach.
 *
 * NOTHING IS INVENTED HERE. Every number comes from lib/pricing/publishedPrices.ts,
 * which records the live page it was read from, and each guide links back to it.
 *
 * Server component throughout, deliberately: JSON-LD injected client-side never
 * reaches a crawler, and a price page that a crawler cannot read defeats its own
 * purpose. The form is the one island of interactivity.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QuickInquiryForm from '@/components/forms/QuickInquiryForm';
import {
  PRICE_GUIDES,
  getPriceGuide,
  type PriceGuide,
} from '@/lib/pricing/publishedPrices';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRICE_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPriceGuide(slug);

  // notFound() in generateMetadata, not just in the component: without it a
  // missing slug can still serve HTTP 200 with a "not found" body, which is the
  // soft-404 pattern that damaged this site before.
  if (!guide) notFound();

  return {
    // No brand suffix — the root layout appends "| EmersonEIMS Kenya". Adding it
    // here ships it twice and eats the characters Google actually displays.
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `https://www.emersoneims.com/pricing/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      url: `https://www.emersoneims.com/pricing/${guide.slug}`,
    },
  };
}

/**
 * Structured data.
 *
 * BreadcrumbList and FAQPage only — deliberately NOT Product/Offer. A price
 * range covering several brands and configurations is not one product with one
 * offer, and Search Console has previously flagged this site for exactly that
 * kind of over-claimed Product markup. Describing the page as what it is (a
 * page that answers questions) is both accurate and eligible.
 */
function priceJsonLd(guide: PriceGuide) {
  const url = `https://www.emersoneims.com/pricing/${guide.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
          { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://www.emersoneims.com/pricing' },
          { '@type': 'ListItem', position: 3, name: guide.h1, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: guide.h1.charAt(0).toUpperCase() + guide.h1.slice(1) + '?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                guide.rows
                  .slice(0, 6)
                  .map((r) => `${r.item}: ${r.price}`)
                  .join('. ') + '.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is not included in the price?',
            acceptedAnswer: { '@type': 'Answer', text: guide.excludes.join('. ') },
          },
          {
            '@type': 'Question',
            name: 'What changes the price?',
            acceptedAnswer: { '@type': 'Answer', text: guide.drivers.join(' ') },
          },
        ],
      },
    ],
  };
}

export default async function PricingGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getPriceGuide(slug);
  if (!guide) notFound();

  const others = PRICE_GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <main className="eims-section">
      <script
        type="application/ld+json"
        // Inline, server-rendered. next/script injects after hydration and the
        // crawler never sees it — this site has shipped invisible schema before.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(priceJsonLd(guide)) }}
      />

      <div className="eims-shell">
        {/* Header */}
        <nav aria-label="Breadcrumb" className="text-xs text-white/50">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/pricing" className="hover:text-amber-400">Pricing</Link>
        </nav>

        <p className="eims-kicker mt-8">Published price guide · 2026</p>
        <h1 className="eims-title">{guide.h1}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">{guide.intro}</p>

        <p className="mt-4 max-w-3xl text-sm text-white/50">
          Every figure below is already published on{' '}
          <Link href={guide.source} className="text-amber-400 underline underline-offset-4">
            {guide.sourceLabel}
          </Link>
          . We put it here so it can be found by the question you actually asked.
        </p>

        {/* The table. Scrolls in its own container so the page body never does. */}
        <div className="eims-card mt-12 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">{guide.h1} — indicative ranges in Kenyan shillings</caption>
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                <th scope="col" className="px-5 py-4 font-medium">Item</th>
                <th scope="col" className="px-5 py-4 font-medium">Price range</th>
                <th scope="col" className="px-5 py-4 font-medium">Typical use</th>
              </tr>
            </thead>
            <tbody>
              {guide.rows.map((row) => (
                <tr key={row.item} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <th scope="row" className="px-5 py-4 font-medium text-white">
                    {row.item}
                    {row.popular && (
                      <span className="ml-2 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-300">
                        Common choice
                      </span>
                    )}
                  </th>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-amber-300">{row.price}</td>
                  <td className="px-5 py-4 text-white/60">{row.note ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Two columns of the thing buyers ask next */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="eims-card p-7">
            <h2 className="text-lg font-semibold text-white">What moves the price</h2>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/70">
              {guide.drivers.map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="eims-card p-7">
            <h2 className="text-lg font-semibold text-white">What the figure excludes</h2>
            {/*
              Stated plainly and up front. Omitting it is how a quotation ends up
              surprising someone, and a surprised buyer does not come back.
            */}
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/70">
              {guide.excludes.map((x) => (
                <li key={x} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* The form. Every price page has one — the audit found four money pages
            with none at all, which is a searcher arriving and leaving. */}
        <section id="quote" className="eims-card mt-12 p-7 sm:p-10">
          <h2 className="text-xl font-semibold text-white">Get a firm figure for your site</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            A range is honest but it is not a quotation. Tell us the load and the location and
            you get a specific number, from an engineer, not a call centre.
          </p>
          <div className="mt-7 max-w-xl">
            <QuickInquiryForm
              service={guide.service}
              ctaLabel="Request my quotation"
              source={`pricing-${guide.slug}`}
            />
          </div>
          <p className="mt-6 text-sm text-white/50">
            Or call{' '}
            <a href="tel:+254768860665" className="text-amber-400 hover:underline">
              +254 768 860 665
            </a>{' '}
            — Embakasi workshop, engineers across all 47 counties.
          </p>
        </section>

        {/* Onward links, including back to the source page */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">Related</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(guide.related ?? []).map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="eims-card px-5 py-4 text-sm text-white/80 transition hover:border-amber-400/40 hover:text-white"
              >
                {r.label} <span aria-hidden="true">→</span>
              </Link>
            ))}
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/pricing/${o.slug}`}
                className="eims-card px-5 py-4 text-sm text-white/80 transition hover:border-amber-400/40 hover:text-white"
              >
                {o.h1.charAt(0).toUpperCase() + o.h1.slice(1)} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
