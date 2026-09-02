/**
 * Plant & equipment fault-code reference — /faults/plant/<brand-family>
 *
 * WHY THIS ROUTE EXISTS
 * 1,799 OEM fault codes lived only inside a client-side search box on
 * /plant-equipment-oracle, which means Google could see none of them. These
 * pages make the whole set crawlable.
 *
 * WHY SEVEN PAGES AND NOT 1,799
 * The records carry brand, family, code and a description averaging 37
 * characters. One page per code would be a database row with a URL, and 1,799
 * of them is the scaled-content pattern this site has already been damaged by.
 * A complete code table for one engine family is a real reference a technician
 * searches for; 1,300 pages each holding one row is not. See the note in
 * lib/plant-oracle/brandGroups.ts.
 *
 * ROUTE SHAPE. This sits three segments deep on purpose. The two-segment slug
 * guard in middleware checks /faults/<slug> against OK_FAULTS and fires only
 * for seg.length === 2, so /faults/plant/<brand> passes it untouched and gets
 * its own guard (0e-plant) instead. 'plant' is added to OK_FAULTS so the index
 * at /faults/plant resolves.
 *
 * Server component throughout — a reference page a crawler cannot read would
 * defeat the entire purpose of building it.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QuickInquiryForm from '@/components/forms/QuickInquiryForm';
import {
  BRAND_GROUPS,
  getBrandGroup,
  type BrandGroup,
} from '@/lib/plant-oracle/brandGroups';

interface Props {
  params: Promise<{ brand: string }>;
}

export async function generateStaticParams() {
  return BRAND_GROUPS.map((g) => ({ brand: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const g = getBrandGroup(brand);
  if (!g) notFound();

  /*
   * Titles are budgeted at 40 characters because the root layout appends
   * "| EmersonEIMS Kenya" — 20 more. Authoring to 60 here is what put 41 of 57
   * page families over the limit before.
   */
  return {
    title: `${g.brand} Fault Codes — Full List`,
    description:
      `Complete ${g.brand} ${g.family} fault code list — ${g.codes.length} codes with descriptions. ` +
      `What each code means and what to check. Free reference from EmersonEIMS engineers.`,
    alternates: { canonical: `https://www.emersoneims.com/faults/plant/${g.slug}` },
    openGraph: {
      title: `${g.brand} fault codes — all ${g.codes.length}`,
      description: `${g.family}. Every code, what it means, and where to start diagnosing.`,
      type: 'article',
      url: `https://www.emersoneims.com/faults/plant/${g.slug}`,
    },
  };
}

/**
 * Group codes by the subsystem their description implies, so the table can be
 * read by someone diagnosing rather than only by someone who already knows
 * their code. Keyword matching on the OEM's own wording — nothing invented.
 */
function subsystemOf(description: string): string {
  const d = description.toLowerCase();
  if (/fuel|injector|rail|lift pump/.test(d)) return 'Fuel system';
  if (/oil|lubric/.test(d)) return 'Lubrication';
  if (/coolant|temperature|thermostat|overheat/.test(d)) return 'Cooling';
  if (/boost|turbo|intake|manifold|air filter|charge air/.test(d)) return 'Air & boost';
  if (/exhaust|dpf|egr|scr|nox|def|urea|aftertreat|soot/.test(d)) return 'Exhaust & aftertreatment';
  if (/volt|current|battery|alternator|charg|circuit|open|short|ground/.test(d)) return 'Electrical';
  if (/sensor|signal|calibrat|out of range|plausib/.test(d)) return 'Sensors & signals';
  if (/speed|overspeed|rpm|crank|cam|timing/.test(d)) return 'Speed & timing';
  if (/hydraul|pressure|valve|pump/.test(d)) return 'Hydraulics';
  if (/can|bus|communication|ecu|controller|module|datalink/.test(d)) return 'Communications & ECU';
  return 'Other';
}

function jsonLd(g: BrandGroup) {
  const url = `https://www.emersoneims.com/faults/plant/${g.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
          { '@type': 'ListItem', position: 2, name: 'Fault Codes', item: 'https://www.emersoneims.com/faults' },
          { '@type': 'ListItem', position: 3, name: `${g.brand} plant codes`, item: url },
        ],
      },
      {
        // A reference document, which is what this is. Not FAQPage — these are
        // not questions — and not Product, which it plainly is not.
        '@type': 'TechArticle',
        headline: `${g.brand} ${g.family} fault codes`,
        description: `Complete list of ${g.codes.length} ${g.brand} fault codes with descriptions.`,
        url,
        author: { '@type': 'Organization', name: 'EmersonEIMS' },
        publisher: { '@type': 'Organization', name: 'EmersonEIMS' },
      },
    ],
  };
}

export default async function PlantFaultCodesPage({ params }: Props) {
  const { brand } = await params;
  const g = getBrandGroup(brand);
  if (!g) notFound();

  const bySubsystem = new Map<string, { code: string; description: string }[]>();
  for (const c of g.codes) {
    const s = subsystemOf(c.description);
    if (!bySubsystem.has(s)) bySubsystem.set(s, []);
    bySubsystem.get(s)!.push(c);
  }
  const subsystems = [...bySubsystem.entries()].sort((a, b) => b[1].length - a[1].length);
  const others = BRAND_GROUPS.filter((x) => x.slug !== g.slug);

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
          <Link href="/faults" className="hover:text-amber-400">Fault codes</Link>
        </nav>

        <p className="eims-kicker mt-8">{g.family}</p>
        <h1 className="eims-title">{g.brand} fault codes — the full list</h1>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">
          All <strong>{g.codes.length}</strong> {g.brand} codes we hold for {g.family}, in{' '}
          {g.codeShape} format, with the manufacturer&rsquo;s own description of each. Grouped by
          subsystem so you can work from a symptom as well as from a code.
        </p>

        {/* What a code can and cannot tell you — the honest framing */}
        <section className="eims-card mt-10 p-7">
          <h2 className="text-lg font-semibold text-white">Read this before you act on a code</h2>
          <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-white/70">
            <p>
              A fault code records <em>what the controller measured</em>, not what is broken. A
              low fuel-rail-pressure code is raised by the ECU seeing pressure below target — the
              cause might be a failing pump, a blocked filter, a leaking injector return, air in
              the fuel, or the sensor itself lying. The code narrows the search; it does not end it.
            </p>
            <p>
              Two practical consequences. First, clear the code and reproduce the fault before
              replacing anything, because an intermittent code and a hard failure need different
              work. Second, check the cheap and common causes in order — filters, connectors,
              earths and looms account for more of these than component failure does, and a
              corroded pin will raise the same code as a dead sensor.
            </p>
            <p className="text-white/50">
              This list is a reference. It is not a repair manual for your machine, and it does not
              replace the manufacturer&rsquo;s diagnostic procedure or the torque, pressure and
              safety figures in it.
            </p>
          </div>
        </section>

        {/* The codes, by subsystem */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white">
            All {g.codes.length} codes, by subsystem
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Subsystems are derived from each code&rsquo;s own description. Use your browser&rsquo;s
            find (Ctrl+F / ⌘F) to jump straight to a code.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {subsystems.map(([name, list]) => (
              <span key={name} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                {name} · {list.length}
              </span>
            ))}
          </div>

          {subsystems.map(([name, list]) => (
            <div key={name} className="mt-10">
              <h3 className="text-base font-semibold text-amber-300">
                {name} <span className="font-normal text-white/40">({list.length} codes)</span>
              </h3>
              <div className="eims-card mt-4 overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <caption className="sr-only">
                    {g.brand} {name} fault codes
                  </caption>
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                      <th scope="col" className="px-5 py-3 font-medium">Code</th>
                      <th scope="col" className="px-5 py-3 font-medium">Manufacturer description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr key={c.code} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                        <th scope="row" className="whitespace-nowrap px-5 py-2.5 font-mono font-medium text-amber-300">
                          {c.code}
                        </th>
                        <td className="px-5 py-2.5 text-white/70">{c.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* Enquiry */}
        <section className="eims-card mt-14 p-7 sm:p-10">
          <h2 className="text-xl font-semibold text-white">Code showing and the machine is down?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            Send us the code and the machine and an engineer will tell you what it usually means on
            that model before anyone is dispatched. Mobile workshop covers all 47 counties.
          </p>
          <div className="mt-7 max-w-xl">
            <QuickInquiryForm
              service="Plant & Equipment Repair"
              ctaLabel="Ask an engineer"
              source={`plant-faults-${g.slug}`}
            />
          </div>
          <p className="mt-6 text-sm text-white/50">
            Or call{' '}
            <a href="tel:+254768860665" className="text-amber-400 hover:underline">+254 768 860 665</a>.
          </p>
        </section>

        {/* Other brands */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">Other equipment</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/faults/plant/${o.slug}`}
                className="eims-card px-5 py-4 text-sm text-white/80 transition hover:border-amber-400/40 hover:text-white"
              >
                <span className="font-semibold text-white">{o.brand}</span>
                <span className="mt-1 block text-xs text-white/50">
                  {o.codes.length} codes · {o.family}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plant-equipment-oracle" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Search every code →
            </Link>
            <Link href="/faults" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Generator fault codes →
            </Link>
            <Link href="/repair-centre" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Repair guides →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
