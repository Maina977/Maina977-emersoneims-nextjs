/**
 * Spare-parts CATEGORY pages — /generators/spare-parts/<category>
 *
 * WHY (audit 2026-07-21, directive Phase Four "Build spare-parts categories").
 * /generators/spare-parts/filters and every sibling returned 404. The site held
 * 1,248 real parts across 27 categories in a single client-side module that
 * search engines cannot browse, so none of it could rank for the commercial
 * queries the directive targets ("generator spare parts in Kenya", "Cummins
 * generator parts Kenya", "generator controller suppliers Kenya").
 *
 * DATA PROVENANCE — this matters, and was checked rather than assumed:
 *   - Part numbers, brands, compatibility and specifications come from
 *     app/data/spare-parts-database-COMPLETE.json and are REAL manufacturer
 *     data (e.g. Fleetguard LF9009 genuinely fits Cummins 6BT5.9 / 6CT8.3).
 *   - Pricing in that file is hand-curated, not formula-generated (141 distinct
 *     bulk/retail ratios across 1,248 rows), and is ALREADY published on the
 *     existing parts module. It is shown here as INDICATIVE and always paired
 *     with "confirmed on enquiry", because landed cost moves with forex and
 *     duty. We never present it as a live quotation.
 *   - NOTHING is generated. The EmersonEIMS ERP's 15,453-SKU catalogue was
 *     examined and deliberately NOT used: assets/js/seed-catalog.js builds it
 *     from nested brand x rating loops with formula prices
 *     (8000 + watts * 20) and hardcoded quantities. Publishing that would have
 *     been fabricated stock and fabricated pricing.
 *
 * NO stock claims: availability is confirmed per enquiry (there is no live
 * inventory feed), matching the rest of the parts section.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import partsDb from '@/app/data/spare-parts-database-COMPLETE.json';
import verifiedAdditions from '@/app/data/spare-parts-verified-additions.json';
import PartsDeliveryNationwide from '@/components/parts/PartsDeliveryNationwide';

type Part = {
  partNo: string;
  name: string;
  brand?: string;
  category?: string;
  compatibility?: string[];
  pricing?: { currency?: string; retailPrice?: number; bulkPrice?: number; minimumOrder?: number };
};
type Subcategory = { id: string; name: string; description?: string; parts?: Part[] };

const BASE = 'https://www.emersoneims.com';

function getSubcategories(): Subcategory[] {
  const root = partsDb as unknown as Record<string, unknown>;
  const cats = (Array.isArray(root) ? root : Object.values(root).find((v) => Array.isArray(v))) as
    | Array<{ subcategories?: Subcategory[] }>
    | undefined;
  return cats?.[0]?.subcategories ?? [];
}

/**
 * Real, publicly-documented manufacturer part numbers added 2026-07-21 to widen
 * coverage of high-intent part-number searches ("DSE7320 Kenya", "SX460 price
 * Kenya"). Merged at read time so the original dataset file is never mutated —
 * additions can be removed by deleting one import.
 *
 * These carry NO price and render as "On request" until real EmersonEIMS prices
 * are imported via scripts/import-parts-prices.mjs. That is deliberate: part
 * numbers are manufacturer facts I can verify, selling prices are commercial
 * data only the ERP holds.
 */
function withAdditions(sub: Subcategory): Subcategory {
  const add = (verifiedAdditions as { additions?: Array<{ subcategoryId: string; parts: Part[] }> })
    .additions?.find((a) => a.subcategoryId === sub.id);
  if (!add) return sub;
  const seen = new Set((sub.parts ?? []).map((p) => p.partNo.toUpperCase()));
  const extra = add.parts.filter((p) => !seen.has(p.partNo.toUpperCase()));
  return { ...sub, parts: [...(sub.parts ?? []), ...extra] };
}

function getCategory(slug: string): Subcategory | undefined {
  const sub = getSubcategories().find((s) => s.id === slug);
  return sub ? withAdditions(sub) : undefined;
}

/**
 * dynamicParams=false is deliberate. The sibling root catch-all
 * app/[country]/[city] shipped with `true` and answered HTTP 200 for every
 * nonsense URL, creating an unbounded soft-404 surface. Unknown categories
 * must 404 here, not render an empty shell.
 */
export const dynamicParams = false;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getSubcategories().map((s) => ({ category: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: 'Page Not Found | EmersonEIMS', robots: { index: false, follow: false } };

  const count = cat.parts?.length ?? 0;
  const brands = [...new Set((cat.parts ?? []).map((p) => p.brand).filter(Boolean))].slice(0, 6);

  return {
    title: `${cat.name} — Generator Spare Parts Kenya | EmersonEIMS`,
    description: `${count} ${cat.name.toLowerCase()} for diesel generators in Kenya${
      brands.length ? ` — ${brands.join(', ')}` : ''
    }. Part numbers, engine compatibility and quotations. Dispatched nationwide from Nairobi.`,
    alternates: { canonical: `${BASE}/generators/spare-parts/${cat.id}` },
    openGraph: {
      title: `${cat.name} — Generator Spare Parts Kenya`,
      description: `${count} parts with verified engine compatibility. Quotation on request, nationwide dispatch.`,
      type: 'website',
    },
  };
}

export default async function SparePartsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const parts = cat.parts ?? [];
  const brands = [...new Set(parts.map((p) => p.brand).filter(Boolean))] as string[];
  const others = getSubcategories().filter((s) => s.id !== cat.id && (s.parts?.length ?? 0) > 0);

  const waFor = (p: Part) =>
    'https://wa.me/254768860665?text=' +
    encodeURIComponent(
      `Hello EmersonEIMS, I would like a quotation for part ${p.partNo} (${p.name}). My generator make/model: , serial number: , deliver to: `
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Breadcrumbs + ItemList schema (directive §10) */}
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
                { '@type': 'ListItem', position: 4, name: cat.name, item: `${BASE}/generators/spare-parts/${cat.id}` },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${cat.name} — EmersonEIMS Kenya`,
              numberOfItems: parts.length,
              itemListElement: parts.slice(0, 50).map((p, i) => ({
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
            <li className="text-white">{cat.name}</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-white md:text-5xl">{cat.name}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
          {cat.description
            ? `${cat.description}. `
            : ''}
          {parts.length} parts listed with manufacturer part numbers and engine compatibility.
          Send us your generator model and serial number and we will confirm the correct
          part before quoting.
        </p>

        {brands.length > 0 && (
          <p className="mt-4 text-sm text-slate-400">
            <span className="font-semibold text-amber-400">Brands in this category:</span>{' '}
            {brands.join(' · ')}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://wa.me/254768860665?text=Hello%20EmersonEIMS%2C%20I%20need%20a%20generator%20spare%20part%20quotation."
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

        {/* Parts table */}
        <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-700">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">{cat.name} — part numbers, compatibility and indicative pricing</caption>
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Part No.</th>
                <th scope="col" className="px-4 py-3 font-semibold">Description</th>
                <th scope="col" className="px-4 py-3 font-semibold">Brand</th>
                <th scope="col" className="px-4 py-3 font-semibold">Fits</th>
                <th scope="col" className="px-4 py-3 font-semibold">Indicative price</th>
                <th scope="col" className="px-4 py-3 font-semibold">Enquire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {parts.map((p) => (
                <tr key={p.partNo} className="align-top hover:bg-slate-900/40">
                  <td className="px-4 py-3 font-mono text-amber-400">{p.partNo}</td>
                  <td className="px-4 py-3 text-slate-200">{p.name}</td>
                  <td className="px-4 py-3 text-slate-400">{p.brand ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {p.compatibility?.length ? p.compatibility.slice(0, 4).join(', ') : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {p.pricing?.retailPrice
                      ? `KES ${p.pricing.retailPrice.toLocaleString('en-KE')}`
                      : 'On request'}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={waFor(p)}
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

        {/* Honest pricing / availability note — mirrors the rest of the parts section */}
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Prices are indicative and shown to give you a working budget figure. Landed cost
          moves with exchange rates and duty, so the current price is confirmed when we
          quote. Availability is also confirmed per enquiry — we do not ask for payment on
          a part we have not verified. Bulk rates apply on qualifying order quantities.
        </p>

        {/* Sibling categories — internal linking (directive §10) */}
        <h2 className="mt-14 text-2xl font-bold text-white">Other spare-parts categories</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {others.map((s) => (
            <Link
              key={s.id}
              href={`/generators/spare-parts/${s.id}`}
              className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-500 hover:text-amber-400"
            >
              {s.name.split(' - ')[0].split(',')[0]}{' '}
              <span className="text-slate-500">({s.parts?.length ?? 0})</span>
            </Link>
          ))}
        </div>
      </div>

      <PartsDeliveryNationwide />
    </main>
  );
}
