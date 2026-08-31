/**
 * Per-brand generator engine fault-code reference — /faults/engine/<brand>
 *
 * Ten pages carrying 2,127 verified codes that had no public URL at all. See
 * lib/faults/engineBrandGroups.ts for why this is one page per BRAND and not
 * one per code: the average description across the registry is thirty
 * characters, so a page per code would be 2,145 database rows with URLs, which
 * is the scaled-content pattern this project has already had to undo twice.
 *
 * The structure mirrors /faults/plant/[brand], which made 1,799 plant codes
 * crawlable the same way, so both halves of the fault library behave alike.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QuickInquiryForm from '@/components/forms/QuickInquiryForm';
import {
  ENGINE_BRAND_GROUPS,
  getEngineBrandGroup,
  type EngineBrandGroup,
} from '@/lib/faults/engineBrandGroups';

interface Props {
  params: Promise<{ brand: string }>;
}

export async function generateStaticParams() {
  return ENGINE_BRAND_GROUPS.map((g) => ({ brand: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const g = getEngineBrandGroup(brand);
  // Next 16 does not set a 404 status from notFound() inside a matched dynamic
  // route, so middleware remains the authority; this still stops the page
  // rendering and keeps the metadata honest.
  if (!g) return { title: 'Fault codes', robots: { index: false, follow: false } };

  const url = `https://www.emersoneims.com/faults/engine/${g.slug}`;
  return {
    // Budget is ~45 characters — the root layout appends " | EmersonEIMS Kenya".
    title: `${g.brand} Generator Fault Codes`,
    description: `All ${g.codes.length} ${g.brand} generator engine fault codes, with the fault, its likely causes and the remedy. Free reference from EmersonEIMS, Nairobi.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${g.brand} generator fault codes — ${g.codes.length} codes`,
      description: `Complete ${g.brand} engine fault-code reference with causes and remedies.`,
      url,
      type: 'article',
    },
  };
}

function jsonLd(g: EngineBrandGroup) {
  const url = `https://www.emersoneims.com/faults/engine/${g.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
          { '@type': 'ListItem', position: 2, name: 'Fault Codes', item: 'https://www.emersoneims.com/faults' },
          { '@type': 'ListItem', position: 3, name: `${g.brand} engine codes`, item: url },
        ],
      },
      {
        // TechArticle: a reference document, which is what this is. Not
        // FAQPage — these are not questions — and not Product.
        '@type': 'TechArticle',
        headline: `${g.brand} generator engine fault codes`,
        description: `Reference list of ${g.codes.length} verified ${g.brand} engine fault codes with causes and remedies.`,
        url,
        author: { '@type': 'Organization', name: 'EmersonEIMS' },
        publisher: { '@id': 'https://www.emersoneims.com/#organization' },
      },
    ],
  };
}

export default async function EngineFaultCodesPage({ params }: Props) {
  const { brand } = await params;
  const g = getEngineBrandGroup(brand);
  if (!g) notFound();

  const others = ENGINE_BRAND_GROUPS.filter((x) => x.slug !== g.slug);

  return (
    <div className="eims-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(g)) }}
      />

      <div className="eims-shell">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <Link href="/faults" className="hover:text-amber-400">Fault codes</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-white/80">{g.brand}</span>
        </nav>

        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white lg:text-5xl">
          {g.brand} generator fault codes
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">
          Every {g.brand} engine fault code in our verified reference &mdash;{' '}
          <strong className="text-white">{g.codes.length} codes</strong>, {g.withRemedy} of them
          with a documented remedy. Find your code in the table, read the likely
          causes, then work the remedy. If it is beyond a field fix, our workshop
          in Embakasi repairs {g.brand} controllers and engines at board level.
        </p>

        {g.models.length > 0 && (
          <p className="mt-4 max-w-3xl text-sm text-white/50">
            Covers: {g.models.join(' · ')}
          </p>
        )}

        {/* The table is the page. Horizontal scroll is on the table's own
            container so the page body never scrolls sideways on a phone. */}
        <div className="mt-12 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">
              {g.brand} generator engine fault codes with causes and remedies
            </caption>
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/60">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Code</th>
                <th scope="col" className="px-4 py-3 font-semibold">Fault</th>
                <th scope="col" className="px-4 py-3 font-semibold">Likely cause</th>
                <th scope="col" className="px-4 py-3 font-semibold">Remedy</th>
              </tr>
            </thead>
            <tbody>
              {g.codes.map((c, i) => (
                <tr
                  key={`${c.code}-${i}`}
                  className="border-t border-white/[0.06] align-top"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-amber-400"
                  >
                    {c.code}
                  </th>
                  <td className="px-4 py-3 text-white/85">{c.description}</td>
                  <td className="px-4 py-3 text-white/60">
                    {c.causes.length ? c.causes.join('; ') : <span className="text-white/30">&mdash;</span>}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {c.remedies.length ? c.remedies.join('; ') : <span className="text-white/30">&mdash;</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/45">
          Codes and descriptions are industry-standard identifiers reproduced for
          identification only. This reference is not affiliated with or endorsed
          by {g.brand}; for official procedures always refer to the
          manufacturer&rsquo;s service manual for your specific engine. A dash
          means our registry holds no verified entry for that column &mdash; we
          publish the gap rather than fill it in.
        </p>

        <section className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-2xl font-semibold text-white">
            Cannot clear the fault?
          </h2>
          <p className="mt-4 max-w-2xl text-white/65">
            Send us the code and the engine serial. We diagnose {g.brand} sets on
            site across all 47 counties, and repair controllers at board level on
            the bench in Embakasi.
          </p>
          <div className="mt-8 max-w-xl">
            <QuickInquiryForm />
          </div>
        </section>

        {others.length > 0 && (
          <nav aria-labelledby="other-brands" className="mt-16 border-t border-white/10 pt-10">
            <h2 id="other-brands" className="text-lg font-semibold text-white">
              Fault codes for other engines
            </h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/faults/engine/${o.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition hover:border-amber-400/40 hover:text-white"
                  >
                    {o.brand}
                    <span className="font-mono text-xs text-white/40">{o.codes.length}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
