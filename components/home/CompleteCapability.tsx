import Link from 'next/link';
import { SERVICE_DIVISIONS } from '@/lib/services/serviceDivisions';

/**
 * COMPLETE ENGINEERING CAPABILITY — the homepage's link into the twelve
 * divisions.
 *
 * WHY IT EXISTS. /services was rebuilt around twelve divisions on 2026-09-26
 * and the homepage did not follow. Read as a crawler sees it, the homepage said
 * "GENERATORS · SOLAR · UPS SOLD & SERVICED IN KENYA" and named no plumbing, no
 * boreholes, no fabrication, no incinerators and no industrial electronics. The
 * services page had moved ahead of the page that carries the site's authority,
 * so none of that authority reached the new architecture.
 *
 * THE GENERATOR-FIRST HERO IS DELIBERATELY UNTOUCHED. Generators are the
 * strongest commercial and search position this business has, and burying that
 * to look broader would trade a winning page for a vaguer one. This sits
 * further down, where a reader who has already seen the generator proposition
 * learns the rest of it exists.
 *
 * DRIVEN BY SERVICE_DIVISIONS so it cannot drift from /services. Adding a
 * division there adds it here; every href is checked by
 * scripts/check-divisions.mjs on every build.
 *
 * Server-rendered, because the whole point is that a crawler reads it.
 */
export default function CompleteCapability() {
  return (
    <section
      id="complete-capability"
      aria-labelledby="complete-capability-heading"
      className="scroll-mt-24 border-y border-white/10 bg-black px-4 py-16"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-3xl">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
            Beyond power
          </p>
          <h2
            id="complete-capability-heading"
            className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          >
            Complete engineering capability
          </h2>
          <p className="text-base leading-relaxed text-slate-300">
            Generators are where EmersonEIMS started and still the largest part
            of the business. They are not the whole of it — the same engineers
            maintain the water, cooling, electrical and building systems on the
            sites they already serve.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_DIVISIONS.map((d) => (
            <li key={d.id}>
              <Link
                href={d.hub.href}
                prefetch={false}
                className="flex h-full items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-amber-400/50 hover:bg-white/10"
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  {d.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">
                    {d.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-400">
                    {d.strapline.slice(0, 3).join(' · ')}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link
            href="/services"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-amber-400"
          >
            All twelve divisions
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
