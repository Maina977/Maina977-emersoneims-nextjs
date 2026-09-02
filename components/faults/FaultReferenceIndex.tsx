import Link from 'next/link';
import { ENGINE_BRAND_GROUPS, ENGINE_CODES_PUBLISHED } from '@/lib/faults/engineBrandGroups';
import { BRAND_GROUPS } from '@/lib/plant-oracle/brandGroups';

/**
 * Crawlable index of every fault-code reference page.
 *
 * WHY IT EXISTS
 * app/faults/page.tsx is a 'use client' component whose codes live behind a
 * search box, and it links to none of the brand reference pages. So the plant
 * references — seven pages carrying 1,799 codes, built precisely to make those
 * codes crawlable — had no internal link from the hub that owns them, and the
 * ten new engine pages would have shipped the same way.
 *
 * A page Google cannot reach by following links is a page Google discovers
 * late and trusts less, sitemap entry or not. This is a SERVER component for
 * that reason: rendered into the HTML, no scroll or hydration required. It is
 * the same failure this project has already fixed three times — testimonials
 * inside a client carousel, breadcrumb JSON-LD injected via next/script, and
 * the AI tool pages that were indexed with nothing to rank on.
 *
 * Counts are read from the registries rather than typed, so they cannot drift
 * from what the pages actually contain.
 */
export default function FaultReferenceIndex() {
  const plantCodes = BRAND_GROUPS.reduce((n, g) => n + g.codes.length, 0);

  return (
    <section
      aria-labelledby="fault-reference-index"
      className="border-t border-white/10 bg-black px-4 py-16"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.24em] text-white/50">
          Complete references
        </p>
        <h2
          id="fault-reference-index"
          className="mt-4 text-3xl font-semibold tracking-tight text-white lg:text-4xl"
        >
          Every fault code we hold, by make
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-white/60">
          {(ENGINE_CODES_PUBLISHED + plantCodes).toLocaleString('en-KE')} verified
          codes across {ENGINE_BRAND_GROUPS.length + BRAND_GROUPS.length} makes,
          free to read. Generator engines carry the fault, its likely causes and
          the remedy; plant and machinery carry the fault and its description.
        </p>

        <h3 className="mt-12 text-sm font-semibold uppercase tracking-wider text-amber-400">
          Generator engines &middot; {ENGINE_CODES_PUBLISHED.toLocaleString('en-KE')} codes
        </h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINE_BRAND_GROUPS.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/faults/engine/${g.slug}`}
                className="flex items-baseline justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition hover:border-amber-400/40 hover:bg-white/[0.05]"
              >
                <span className="font-medium text-white/85">{g.brand}</span>
                <span className="font-mono text-xs text-white/45">{g.codes.length}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="mt-12 text-sm font-semibold uppercase tracking-wider text-amber-400">
          Plant &amp; machinery &middot; {plantCodes.toLocaleString('en-KE')} codes
        </h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BRAND_GROUPS.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/faults/plant/${g.slug}`}
                className="flex items-baseline justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition hover:border-amber-400/40 hover:bg-white/[0.05]"
              >
                <span className="font-medium text-white/85">
                  {g.brand} <span className="text-white/45">{g.family}</span>
                </span>
                <span className="font-mono text-xs text-white/45">{g.codes.length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
