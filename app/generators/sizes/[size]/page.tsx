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
import QuickInquiryForm from '@/components/forms/QuickInquiryForm';
import {
  GENERATOR_SIZES,
  getGeneratorSize,
  kwFromKva,
  nextSizeUp,
  photosForSize,
  type GeneratorSize,
} from '@/lib/products/generatorSizes';
import { CUMMINS_BRAND_INFO } from '@/lib/brands/cumminsData';

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

  return {
    // No brand suffix — the root layout appends "| EmersonEIMS Kenya".
    title: `${g.kva} kVA Generator Price in Kenya (2026)`,
    description:
      `What a ${g.kva} kVA diesel generator costs in Kenya: ${g.priceRange}. ` +
      `${kwFromKva(g.kva)} kW at 0.8 power factor, ${g.phase}-phase. What it runs, ` +
      `what derating does to it, and what the price excludes.`,
    alternates: { canonical: `https://www.emersoneims.com/generators/sizes/${g.slug}` },
    openGraph: {
      title: `${g.kva} kVA Generator Price in Kenya (2026)`,
      description: `${g.priceRange} — ${g.suits}. Supply, installation and 2-year warranty.`,
      type: 'website',
      url: `https://www.emersoneims.com/generators/sizes/${g.slug}`,
    },
  };
}

/**
 * BreadcrumbList + FAQPage only — deliberately NOT Product/Offer.
 *
 * Product markup requires a specific product with a specific price. What we can
 * honestly publish is a size class with a range, across brands and
 * configurations. Search Console has flagged this site for over-claimed Product
 * markup before; describing the page as what it is stays eligible and stays true.
 */
function jsonLd(g: GeneratorSize) {
  const url = `https://www.emersoneims.com/generators/sizes/${g.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
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
              text: `A ${g.kva} kVA diesel generator runs ${g.priceRange} depending on brand, enclosure and controller. That is the set itself; installation, cabling and civil works are quoted separately.`,
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
        <h1 className="eims-title">{g.kva} kVA generator price in Kenya</h1>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <p className="text-3xl font-semibold text-amber-300">{g.priceRange}</p>
          {g.popular && (
            <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs uppercase tracking-wider text-amber-300">
              Common choice
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-white/50">
          Price of the set. Installation, cabling and civil works are quoted separately &mdash; see{' '}
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
          <div className="mt-7 max-w-xl">
            <QuickInquiryForm
              service={`${g.kva} kVA Generator`}
              ctaLabel="Request my quotation"
              source={`generator-size-${g.slug}`}
            />
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
            <Link href="/generators/spare-parts" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Spare parts →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
