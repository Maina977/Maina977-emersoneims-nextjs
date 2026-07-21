/**
 * PartsCategoryLinks — crawlable links to every spare-parts category page.
 *
 * WHY (audit 2026-07-21): the category pages are useless if nothing links to
 * them. This audit already found two page sets — 27 /sectors/* and 68 East
 * African city pages — that were live, valid and completely invisible because
 * they had zero internal links and zero sitemap entries. Shipping new pages
 * without links would repeat that exact mistake.
 *
 * Server component: plain anchors, no client JS, so the links are in the HTML
 * for crawlers rather than being rendered after hydration.
 *
 * Counts are read from the same JSON the pages render from, so they cannot
 * drift out of sync.
 */
import Link from 'next/link';
import partsDb from '@/app/data/spare-parts-database-COMPLETE.json';

type Sub = { id: string; name: string; parts?: unknown[] };

function getSubcategories(): Sub[] {
  const root = partsDb as unknown as Record<string, unknown>;
  const cats = (Array.isArray(root) ? root : Object.values(root).find((v) => Array.isArray(v))) as
    | Array<{ subcategories?: Sub[] }>
    | undefined;
  return (cats?.[0]?.subcategories ?? []).filter((s) => s.id && (s.parts?.length ?? 0) > 0);
}

export default function PartsCategoryLinks({ className = '' }: { className?: string }) {
  const subs = getSubcategories();
  const total = subs.reduce((n, s) => n + (s.parts?.length ?? 0), 0);

  return (
    <section
      aria-labelledby="parts-categories-heading"
      className={`border-t border-slate-800 bg-slate-950 py-14 md:py-20 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
          Browse by category
        </span>
        <h2
          id="parts-categories-heading"
          className="mt-3 text-3xl font-bold text-white md:text-4xl"
        >
          Generator spare parts by category
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
          {total.toLocaleString('en-KE')} parts across {subs.length} categories, each listed
          with its manufacturer part number and the engines it fits. Open a category to see
          the parts and request a quotation.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subs.map((s) => (
            <Link
              key={s.id}
              href={`/generators/spare-parts/${s.id}`}
              className="group rounded-xl border border-slate-700/70 bg-slate-900/50 p-4 transition-colors hover:border-amber-500/50"
            >
              <span className="block font-semibold text-white group-hover:text-amber-400">
                {s.name.split(' - ')[0].split(',')[0]}
              </span>
              <span className="mt-1 block text-sm text-slate-400">
                {(s.parts?.length ?? 0).toLocaleString('en-KE')} parts
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
