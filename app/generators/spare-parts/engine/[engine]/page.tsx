/**
 * Engine-model parts pages — /generators/spare-parts/engine/<model>
 *
 * WHY (owner, 2026-07-21): "we have over 200 generator makes — so many
 * different makes and models."
 *
 * The catalogue could only be browsed by PART TYPE. A customer who knows they
 * have a Cummins 6BT5.9 had no way to ask "what do you stock for my engine?",
 * even though the fitment data to answer that already existed on 75 parts.
 *
 * These pages pivot the EXISTING real compatibility data by engine. Nothing is
 * generated: every engine listed is one that real parts already claim to fit,
 * and every part shown is already in the catalogue. Engines with fewer than 5
 * parts get no page, so none of these are thin.
 *
 * dynamicParams=false, matching every other route fixed in this audit — unknown
 * engines must 404 rather than render an empty shell.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEngineIndex, getEngineBySlug } from '@/lib/parts/engineIndex';
import { fitmentLabel } from '@/lib/parts/partsQuality';
import PartsDeliveryNationwide from '@/components/parts/PartsDeliveryNationwide';

const BASE = 'https://www.emersoneims.com';

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getEngineIndex().map((e) => ({ engine: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ engine: string }>;
}): Promise<Metadata> {
  const { engine } = await params;
  const e = getEngineBySlug(engine);
  if (!e) return { title: 'Page Not Found | EmersonEIMS', robots: { index: false, follow: false } };

  const label = e.make ? `${e.make} ${e.model}` : e.model;
  return {
    title: `${label} Generator Spare Parts Kenya | EmersonEIMS`,
    description: `${e.parts.length} spare parts for ${label} generator engines in Kenya — filters, injectors, bearings, gaskets and electrical components with verified fitment. Quotation on request, dispatched nationwide.`,
    alternates: { canonical: `${BASE}/generators/spare-parts/engine/${e.slug}` },
    openGraph: {
      title: `${label} Generator Spare Parts — Kenya`,
      description: `${e.parts.length} parts verified to fit ${label}. Nationwide dispatch from Nairobi.`,
      type: 'website',
    },
  };
}

export default async function EnginePartsPage({
  params,
}: {
  params: Promise<{ engine: string }>;
}) {
  const { engine } = await params;
  const e = getEngineBySlug(engine);
  if (!e) notFound();

  const label = e.make ? `${e.make} ${e.model}` : e.model;
  const others = getEngineIndex().filter((x) => x.slug !== e.slug).slice(0, 24);

  // Group by part category so the page reads like a parts list, not a dump.
  const byCat = new Map<string, typeof e.parts>();
  for (const p of e.parts) {
    if (!byCat.has(p.categoryId)) byCat.set(p.categoryId, []);
    byCat.get(p.categoryId)!.push(p);
  }

  const wa = (partNo: string, name: string) =>
    'https://wa.me/254768860665?text=' +
    encodeURIComponent(
      `Hello EmersonEIMS, I need part ${partNo} (${name}) for my ${label} generator. Serial number: , deliver to: `
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
                { '@type': 'ListItem', position: 2, name: 'Generators', item: `${BASE}/generators` },
                { '@type': 'ListItem', position: 3, name: 'Spare Parts', item: `${BASE}/generators/spare-parts` },
                { '@type': 'ListItem', position: 4, name: label, item: `${BASE}/generators/spare-parts/engine/${e.slug}` },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${label} generator spare parts — EmersonEIMS Kenya`,
              numberOfItems: e.parts.length,
              itemListElement: e.parts.slice(0, 50).map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `${p.partNo} — ${p.name}`,
              })),
            },
          ]),
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-slate-400">
            <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/generators" className="hover:text-amber-400">Generators</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/generators/spare-parts" className="hover:text-amber-400">Spare Parts</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-white">{label}</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-white md:text-5xl">
          Spare parts for {label} generators
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
          {e.parts.length} parts in our catalogue are listed as fitting the {e.model}
          {e.make ? ` (${e.make})` : ''}. Fitment can still vary between builds of the same
          engine, so send us your engine and alternator serial numbers and we will confirm
          the exact part before quoting.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`https://wa.me/254768860665?text=${encodeURIComponent(
              `Hello EmersonEIMS, I need spare parts for a ${label} generator. Serial number: , parts needed: , deliver to: `
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
          >
            Request a quotation on WhatsApp
          </a>
          <a
            href="tel:+254768860665"
            className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Call +254 768 860 665
          </a>
        </div>

        {[...byCat.entries()].map(([catId, list]) => (
          <section key={catId} className="mt-12">
            <h2 className="text-xl font-bold text-white">
              <Link href={`/generators/spare-parts/${catId}`} className="hover:text-amber-400">
                {catId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Link>{' '}
              <span className="text-base font-normal text-slate-500">({list.length})</span>
            </h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-700">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-900/80 text-slate-300">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Part No.</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Description</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Brand</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Also fits</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Enquire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {list.map((p) => (
                    <tr key={p.partNo} className="align-top hover:bg-slate-900/40">
                      <td className="px-4 py-3 font-mono text-amber-400">{p.partNo}</td>
                      <td className="px-4 py-3 text-slate-200">{p.name}</td>
                      <td className="px-4 py-3 text-slate-400">{p.brand ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-400">{fitmentLabel(p)}</td>
                      <td className="px-4 py-3">
                        <a
                          href={wa(p.partNo, p.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-green-400 hover:underline"
                        >
                          Quote
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <p className="mt-6 text-sm leading-relaxed text-slate-400">
          Availability and current price are confirmed per enquiry — we do not ask for
          payment on a part we have not verified against your serial number.
        </p>

        <h2 className="mt-14 text-2xl font-bold text-white">Other engines we stock parts for</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/generators/spare-parts/engine/${o.slug}`}
              className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-500 hover:text-amber-400"
            >
              {o.make ? `${o.make} ${o.model}` : o.model}{' '}
              <span className="text-slate-500">({o.parts.length})</span>
            </Link>
          ))}
        </div>
      </div>

      <PartsDeliveryNationwide />
    </main>
  );
}
