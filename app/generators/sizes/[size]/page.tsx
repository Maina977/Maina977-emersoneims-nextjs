/**
 * Per-size generator pages — /generators/sizes/<n>-kva
 *
 * WHY THIS ROUTE SHAPE
 * The dynamic segment sits under a STATIC child ('sizes') deliberately.
 * Middleware guard 0i enumerates the first-level children of /generators to
 * hard-404 invented URLs, and scripts/segment-children.mjs refuses to enumerate
 * any segment holding a dynamic first-level child. Putting [size] directly
 * under /generators would therefore have silently removed guard 0i from the
 * whole /generators segment and reopened the soft-404 it was added to close.
 * One level deeper, the guard stays intact and this route gets its own.
 *
 * Server component throughout: JSON-LD injected after hydration never reaches
 * a crawler, and a product page a crawler cannot read defeats its own purpose.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import GeneratorQuoteForm from '@/components/forms/GeneratorQuoteForm';
import {
  GENERATOR_SIZES,
  getGeneratorSize,
  kwFromKva,
  nextSizeUp,
  photosForSize,
  type GeneratorSize,
} from '@/lib/products/generatorSizes';
import { CUMMINS_BRAND_INFO } from '@/lib/brands/cumminsData';
import {
  confirmedBoundsFor,
  VOLTKA_PRICE_BASIS,
  VOLTKA_PRICE_BASIS_SHORT,
  VOLTKA_PRICES_AS_OF_LABEL,
} from '@/lib/pricing/voltkaConfirmedPrices';

interface Props {
  params: Promise<{ size: string }>;
}

export async function generateStaticParams() {
  return GENERATOR_SIZES.map((g) => ({ size: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { size } = await params;
  const g = getGeneratorSize(size);
  if (!g) notFound();

  const priced = confirmedBoundsFor(g.kva) !== null;
  // A page with no confirmed price must not be titled as a price page.
  const title = priced
    ? `${g.kva} kVA Generator Price in Kenya (2026)`
    : `${g.kva} kVA Generator in Kenya: Sizing and Quotation`;
  const description = priced
    ? `${g.kva} kVA VOLTKA generator price in Kenya: ${g.priceRange} (${VOLTKA_PRICE_BASIS_SHORT}). ` +
      `${kwFromKva(g.kva)} kW at 0.8 power factor, ${g.phase}-phase. What it runs and what the price excludes.`
    : `${g.kva} kVA diesel generator in Kenya: ${kwFromKva(g.kva)} kW at 0.8 power factor, ${g.phase}-phase. ` +
      `What it runs, what derating does to it, and how to request the current price.`;
  return {
    // No brand suffix — the root layout appends "| EmersonEIMS Kenya".
    title,
    description,
    alternates: { canonical: `https://www.emersoneims.com/generators/sizes/${g.slug}` },
    openGraph: {
      title,
      description: priced
        ? `${g.priceRange}: ${VOLTKA_PRICE_BASIS_SHORT}. ${g.suits}.`
        : `${g.suits}. Request the current price for a ${g.kva} kVA set.`,
      type: 'website',
      url: `https://www.emersoneims.com/generators/sizes/${g.slug}`,
    },
  };
}

/**
 * BreadcrumbList + FAQPage + Product/AggregateOffer.
 *
 * PRODUCT MARKUP WAS PREVIOUSLY OMITTED HERE, and the reasoning was sound as
 * far as it went: Product/Offer wants a specific product at a specific price,
 * while what we can honestly publish is a size class spanning brands and
 * configurations. Search Console has flagged this site for over-claimed
 * Product markup before.
 *
 * AggregateOffer is the schema.org type built for exactly that situation — a
 * lowPrice/highPrice band rather than one number — so the page can be
 * identified as a purchasable product without asserting a price it does not
 * have. Without it these pages were unidentifiable as products to Google and
 * to AI assistants, despite carrying real published prices in the body text.
 *
 * WHAT IS DELIBERATELY ABSENT, and must stay absent:
 *   - `availability`: we publish no live stock, and the shop section was
 *     changed to "Ask for availability" for that reason. InStock here would
 *     be a warehouse claim nothing backs.
 *   - `brand`: these sizes span Cummins, Perkins, FG Wilson and others. Naming
 *     one would be false for the rest.
 *   - `aggregateRating` / `review`: we hold no verified review corpus.
 *     Fabricated review markup is a manual-action offence, and this project
 *     has already had to refuse invented testimonials once.
 * The prices come from GENERATOR_SIZES, the same source the visible page
 * renders, so the markup and the text cannot disagree.
 */
function jsonLd(g: GeneratorSize) {
  const url = `https://www.emersoneims.com/generators/sizes/${g.slug}`;
  const bounds = confirmedBoundsFor(g.kva);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: `${g.kva} kVA Diesel Generator`,
        // `suits` is stored capitalised and without a full stop ("Shops, small
        // offices and homes"), so it is lowercased and punctuated here rather
        // than dropped mid-sentence.
        description: `${g.kva} kVA (${kwFromKva(g.kva)} kW at 0.8 power factor), ${g.phase}-phase diesel generator for ${g.suits.charAt(0).toLowerCase()}${g.suits.slice(1)}. Supplied, installed and commissioned in Kenya with a 2-year warranty.`,
        category: 'Diesel generator',
        url,
        // Owner-confirmed VOLTKA prices only (open frame to silent set,
        // prime, ex-warehouse, excl. VAT). Sizes without a confirmed figure
        // carry no offer at all rather than a guessed number.
        ...(bounds
          ? {
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'KES',
                lowPrice: bounds.low,
                highPrice: bounds.high,
                // Search Console flagged the missing offerCount on 2026-09-06.
                // Open frame and silent set are two offers; a size sold only
                // as a silent set is one.
                offerCount: bounds.high > bounds.low ? '2' : '1',
                seller: { '@id': 'https://www.emersoneims.com/#organization' },
                areaServed: { '@type': 'Country', name: 'Kenya' },
              },
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
          { '@type': 'ListItem', position: 2, name: 'Generators', item: 'https://www.emersoneims.com/generators' },
          { '@type': 'ListItem', position: 3, name: `${g.kva} kVA`, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How much does a ${g.kva} kVA generator cost in Kenya?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: bounds
                ? `A new ${g.kva} kVA VOLTKA generator is ${g.priceRange}. ${VOLTKA_PRICE_BASIS}`
                : `We do not publish a fixed price for ${g.kva} kVA. Ask for the current price and an engineer sends a written quotation for the set; delivery and installation are quoted separately.`,
            },
          },
          {
            '@type': 'Question',
            name: `How many kW is a ${g.kva} kVA generator?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${kwFromKva(g.kva)} kW at the 0.8 power factor gensets are rated to. kVA is apparent power and kW is real power; the load that matters for sizing is the kW figure plus the surge your largest motor draws when it starts.`,
            },
          },
          {
            '@type': 'Question',
            name: `What can a ${g.kva} kVA generator run?`,
            acceptedAnswer: { '@type': 'Answer', text: g.loadExample },
          },
        ],
      },
    ],
  };
}

export default async function GeneratorSizePage({ params }: Props) {
  const { size } = await params;
  const g = getGeneratorSize(size);
  if (!g) notFound();

  const kw = kwFromKva(g.kva);
  const bigger = nextSizeUp(g);
  const photos = photosForSize(g.kva);
  const others = GENERATOR_SIZES.filter((x) => x.slug !== g.slug);

  return (
    <div className="eims-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(g)) }}
      />

      <div className="eims-shell">
        <nav aria-label="Breadcrumb" className="text-xs text-white/50">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/generators" className="hover:text-amber-400">Generators</Link>
        </nav>

        <p className="eims-kicker mt-8">Diesel generator · {g.phase}-phase</p>
        <h1 className="eims-title">
          {g.openKes || g.silentKes ? `${g.kva} kVA generator price in Kenya` : `${g.kva} kVA generator in Kenya`}
        </h1>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          {g.openKes || g.silentKes ? (
            <p className="text-3xl font-semibold text-amber-300">{g.priceRange}</p>
          ) : (
            <a href="#quote" className="text-3xl font-semibold text-amber-300 underline underline-offset-8">
              {g.priceRange}
            </a>
          )}
          {g.popular && (
            <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs uppercase tracking-wider text-amber-300">
              Common choice
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-white/50">
          {g.openKes || g.silentKes
            ? `${VOLTKA_PRICE_BASIS} Prices confirmed ${VOLTKA_PRICES_AS_OF_LABEL}.`
            : 'We do not publish a fixed price for this size. Ask and an engineer sends the current price in writing.'}{' '}
          Installation costs: see{' '}
          <Link href="/pricing/generator-service-cost-kenya" className="text-amber-400 underline underline-offset-4">
            installation and servicing costs
          </Link>
          .
        </p>

        {/*
          Real photography, added 2026-08-26.
          A design review measured one image per product page — a generator
          seller showing no generators. These files already existed in the repo,
          unused on commercial pages. Captions say what each photograph SHOWS
          and never claim the machine pictured is this page's size; the note
          below the strip states that plainly, because an implied specification
          is still a specification.
        */}
        <section className="mt-12">
          <div className="grid gap-4 sm:grid-cols-3">
            {photos.map((p) => (
              <figure key={p.src} className="eims-card overflow-hidden">
                <div className="relative aspect-[4/3] bg-black/40">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs leading-relaxed text-white/60">
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">
            Photographs of equipment we supply and install. They illustrate build, enclosure and
            delivery rather than this exact rating — the machine offered is confirmed on your
            quotation.
          </p>
        </section>

        {/* The specification we can actually stand behind */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Rating', `${g.kva} kVA`, `${kw} kW at 0.8 pf`],
            ['Phase', g.phase === 'three' ? 'Three phase' : 'Single phase', g.phase === 'three' ? '415 V' : '240 V'],
            ['Suits', g.suits, ''],
            ['Warranty', `${CUMMINS_BRAND_INFO.warranty.years} years`, `+ ${CUMMINS_BRAND_INFO.freeService.years} year free service`],
          ].map(([label, value, note]) => (
            <div key={label} className="eims-card p-5">
              <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
              {note && <p className="mt-1 text-xs text-white/50">{note}</p>}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="eims-card p-7">
            <h2 className="text-lg font-semibold text-white">What a {g.kva} kVA set actually runs</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{g.loadExample}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              The number that matters is <strong>{kw} kW</strong>, not {g.kva} kVA. kVA is apparent
              power; kW is the work done. Size against your real kW load plus the surge your largest
              motor draws when it starts &mdash; a motor can pull six times its running current for
              a second or two, and a set chosen on running load alone will trip on it.
            </p>
          </section>

          <section className="eims-card p-7">
            <h2 className="text-lg font-semibold text-white">Where it will be installed changes the size</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              A diesel engine loses roughly 1% of its output per 100 m above 300 m, and about 2% per
              5 &deg;C above 25 &deg;C. In Nairobi at about 1,700 m that is close to 14% before heat
              is counted &mdash; so this {g.kva} kVA set delivers nearer{' '}
              <strong>{Math.round(g.kva * 0.86)} kVA</strong> on the highland plateau.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {bigger ? (
                <>
                  If your load is close to {kw} kW and the site is inland, the honest answer is often
                  the{' '}
                  <Link href={`/generators/sizes/${bigger.slug}`} className="text-amber-400 underline underline-offset-4">
                    {bigger.kva} kVA
                  </Link>{' '}
                  instead. That is a real cost difference and we would rather say it before you buy
                  than after.
                </>
              ) : (
                <>
                  At this rating the specification is driven by your load study rather than the
                  catalogue, and we would size it against measured demand before quoting.
                </>
              )}
            </p>
          </section>
        </div>

        {/* Honesty about what we have not published */}
        <section className="eims-card mt-8 p-7">
          <h2 className="text-lg font-semibold text-white">Specification confirmed on quotation</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70">
            We supply Cummins sets through {CUMMINS_BRAND_INFO.supplier} alongside other makes, from{' '}
            {CUMMINS_BRAND_INFO.powerRange.min} to {CUMMINS_BRAND_INFO.powerRange.max} kVA. Engine
            and alternator model, fuel consumption at load, dimensions, weight and sound level all
            depend on the specific set and configuration offered, so we confirm them in writing on
            the quotation rather than publishing figures here that might not match what arrives.
            Ask and we will send the manufacturer datasheet for the exact machine.
          </p>
          <p className="mt-4 text-xs text-white/40">
            EmersonEIMS supplies and services Cummins equipment. We are not an authorised Cummins
            dealer and do not represent the manufacturer.
          </p>
        </section>

        {/* Enquiry */}
        <section id="quote" className="eims-card mt-8 p-7 sm:p-10">
          <h2 className="text-xl font-semibold text-white">Get a firm price for a {g.kva} kVA set</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            Tell us the load and the location. You get a specific figure and the datasheet for the
            actual machine, from an engineer.
          </p>
          <div className="mt-7 max-w-3xl">
            <GeneratorQuoteForm defaultKva={g.kva} source={`generator-size-${g.slug}`} />
          </div>
          <p className="mt-6 text-sm text-white/50">
            Or call{' '}
            <a href="tel:+254768860665" className="text-amber-400 hover:underline">+254 768 860 665</a>{' '}
            &mdash; Embakasi workshop, engineers across all 47 counties.
          </p>
        </section>

        {/* Other sizes — the internal linking the audit asked for */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">Other sizes</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/generators/sizes/${o.slug}`}
                className="eims-card px-4 py-3 text-sm text-white/80 transition hover:border-amber-400/40 hover:text-white"
              >
                <span className="font-semibold text-white">{o.kva} kVA</span>
                <span className="mt-1 block text-xs text-white/50">{o.priceRange}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/generators" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Full generator range →
            </Link>
            <Link href="/pricing/generator-prices-kenya" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              All generator prices →
            </Link>
            {/* Change Set D (2026-11-12): the used alternative to a new set of this size. */}
            <Link href="/generators/used" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Used generators, unit by unit →
            </Link>
            <Link href="/generators/spare-parts" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Spare parts →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
