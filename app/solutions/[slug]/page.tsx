import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  SECTOR_CONFIG,
  SECTOR_SLUGS,
  SECTOR_LIST,
  isValidSectorSlug,
  type SectorSlug,
} from '@/lib/sectors/config';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SECTOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidSectorSlug(slug)) return { title: 'Sector Not Found' };
  const s = SECTOR_CONFIG[slug];
  const url = `https://www.emersoneims.com/solutions/${s.slug}`;
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: s.seoTitle,
      description: s.seoDescription,
      type: 'website',
      url,
      locale: 'en_KE',
      siteName: 'EmersonEIMS',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.seoTitle,
      description: s.seoDescription,
    },
  };
}

export default async function SectorSolutionPage({ params }: Props) {
  const { slug } = await params;
  if (!isValidSectorSlug(slug)) notFound();

  const sectorSlug = slug as SectorSlug;
  const s = SECTOR_CONFIG[sectorSlug];

  // Pick 3 "also used in" sectors (deterministic, excludes self)
  const alsoUsedIn = SECTOR_LIST.filter((x) => x.slug !== s.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.h1,
    description: s.seoDescription,
    provider: {
      '@type': 'Organization',
      name: 'EmersonEIMS',
      url: 'https://www.emersoneims.com',
      telephone: '+254768860665',
    },
    areaServed: { '@type': 'Country', name: 'Kenya' },
    url: `https://www.emersoneims.com/solutions/${s.slug}`,
    serviceType: s.solutionList.map((x) => x.label),
  };

  return (
    <main className="bg-black min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="pt-28 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-content mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-amber-500 mb-4">
            Solutions for {s.slug.replace('-', ' ')}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {s.h1}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl leading-relaxed">
            {s.painStatement}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href={s.ctaHref}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
            >
              {s.ctaText}
            </Link>
            <a
              href="tel:+254768860665"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-white hover:border-amber-400/50 transition-colors font-semibold"
            >
              📞 +254 768 860 665
            </a>
          </div>
        </div>
      </section>

      {/* Solutions grid */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-content mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-8">
            What we deliver
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {s.solutionList.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group block h-full rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-amber-500/40 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="block text-base font-semibold text-white group-hover:text-amber-300">
                    {item.label}
                  </span>
                  <span className="block text-xs text-amber-400 mt-2 uppercase tracking-wider">
                    Learn more →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Single clear CTA */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-content mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to brief our engineers?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Tell us your facility, current setup and biggest pain — we'll come back with
            a sector-specific proposal, not a generic quote.
          </p>
          <Link
            href={s.ctaHref}
            className="inline-flex items-center px-8 py-4 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
          >
            {s.ctaText} →
          </Link>
        </div>
      </section>

      {/* Internal linking footer */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-content mx-auto">
          <p className="text-sm text-gray-400">
            Also used in:{' '}
            {alsoUsedIn.map((x, i) => (
              <span key={x.slug}>
                <Link
                  href={`/solutions/${x.slug}`}
                  className="text-amber-400 hover:text-amber-300 capitalize"
                >
                  {x.slug.replace('-', ' ')}
                </Link>
                {i < alsoUsedIn.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </p>
        </div>
      </section>
    </main>
  );
}
