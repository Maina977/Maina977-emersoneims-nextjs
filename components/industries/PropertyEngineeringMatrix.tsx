import Link from 'next/link';
import { getPropertyProfile } from '@/lib/seo/propertyEngineering';

/**
 * The property-wide view, rendered on an industry page.
 *
 * SERVER-RENDERED, and returns null for any industry with no profile — better
 * to show nothing than a generic filler grid, which would add shared text to
 * pages whose risk is shared text.
 *
 * Contrast and touch targets follow the same rules as ServiceDivisions:
 * slate-300 body, slate-400 meta, every link a block with py-2. The site's
 * existing text-white/45 and text-slate-500 both fail WCAG AA at around 3:1,
 * so neither appears here.
 */
export default function PropertyEngineeringMatrix({
  industrySlug,
}: {
  industrySlug: string;
}) {
  const profile = getPropertyProfile(industrySlug);
  if (!profile) return null;

  return (
    <section
      id="property-engineering"
      aria-labelledby="property-engineering-heading"
      className="scroll-mt-32 bg-slate-950 px-4 py-16"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-3xl">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
            One engineering partner
          </p>
          <h2
            id="property-engineering-heading"
            className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          >
            {profile.heading}
          </h2>
          <p className="text-base leading-relaxed text-slate-300">{profile.lede}</p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {profile.systems.map((sys) => (
            <article
              key={sys.title}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-2xl leading-none" aria-hidden="true">
                  {sys.icon}
                </span>
                <h3 className="text-lg font-bold text-white">{sys.title}</h3>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-slate-400">
                {sys.concern}
              </p>

              <ul className="border-t border-slate-700/60 pt-3">
                {sys.items.map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="block rounded py-2 text-sm leading-snug text-slate-300 transition-colors hover:text-cyan-400"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900/40 p-6 sm:p-8">
          <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">
            One contract for the whole property
          </h3>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-300">
            We will walk the property, list what is installed, and tell you what
            is actually at risk — including the parts we would not change. The
            technician survey carries a fee, deducted in full from the contract
            if you award us the work; talking it through first on the phone or
            WhatsApp costs nothing.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/booking"
              prefetch={false}
              className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
            >
              Book a property survey
            </Link>
            <Link
              href="/contact"
              prefetch={false}
              className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-400"
            >
              Talk to an engineer
            </Link>
            <Link
              href="/maintenance-hub"
              prefetch={false}
              className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-400"
            >
              Maintenance contracts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
