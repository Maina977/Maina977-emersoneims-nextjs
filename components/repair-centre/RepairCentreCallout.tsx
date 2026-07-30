import Link from 'next/link';

/**
 * Compact entry point into the Repair Centre, for pages that carry traffic but
 * had no path to it.
 *
 * WHY: a funnel audit on 2026-07-30 checked the fourteen pages with real Kenyan
 * visitors against first-party analytics. Only four linked to the Repair Centre
 * at all — the service pages wired earlier. The rest, including the single
 * best-performing page on the site and the homepage, offered no route to 54
 * diagnostic guides. That is traffic arriving and leaving past content written
 * for exactly those readers.
 *
 * Deliberately hardcoded links to HUB pages only, never to individual articles.
 * Hubs are enumerated in the registry and guarded in middleware, so these links
 * cannot rot when an article is renamed — which matters because this component
 * is dropped into large client-side pages that do not import the registry and
 * would otherwise ship the whole article set to the browser.
 *
 * Server component, plain links: in the initial HTML, crawlable, no JavaScript.
 */

interface Props {
  /** Repair Centre hub slug, or omit for the Repair Centre index. */
  hub?: 'generators' | 'solar' | 'ups' | 'inverters' | 'motors' | 'pumps' | 'controllers';
  /** Override the default heading where the page context calls for it. */
  heading?: string;
  /** Override the default body copy. */
  body?: string;
  /** Visual accent, to sit correctly on differently-themed pages. */
  accent?: 'cyan' | 'amber' | 'emerald';
}

const HUB_LABEL: Record<string, string> = {
  generators: 'Generator diagnosis & repair guides',
  solar: 'Solar PV diagnosis & repair guides',
  ups: 'UPS diagnosis & repair guides',
  inverters: 'Inverter diagnosis & repair guides',
  motors: 'Motor diagnosis & rewinding guides',
  pumps: 'Pump diagnosis & repair guides',
  controllers: 'Controller diagnostic guides',
};

const ACCENT = {
  cyan: { text: 'text-cyan-400', border: 'border-cyan-500/60', hover: 'hover:bg-cyan-500/10', ring: 'border-cyan-500/30' },
  amber: { text: 'text-amber-400', border: 'border-amber-500/60', hover: 'hover:bg-amber-500/10', ring: 'border-amber-500/30' },
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/60', hover: 'hover:bg-emerald-500/10', ring: 'border-emerald-500/30' },
};

export default function RepairCentreCallout({ hub, heading, body, accent = 'cyan' }: Props) {
  const a = ACCENT[accent];
  const href = hub ? `/repair-centre/${hub}` : '/repair-centre';
  const label = hub ? HUB_LABEL[hub] : 'Browse all diagnostic guides';

  return (
    <section className={`border-y border-slate-800 bg-slate-950`}>
      <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-12`}>
        <p className={`text-xs uppercase tracking-[0.2em] ${a.text} font-semibold mb-2`}>
          Free diagnostic guides
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          {heading ?? 'Something already installed and playing up?'}
        </h2>
        <p className="mt-3 text-slate-300 leading-relaxed max-w-3xl">
          {body ??
            'Our engineers have written up the diagnostic sequences they use on site — ranked causes, ordered steps with the reading expected at each one, and the point at which to stop and call someone. Free to read, no sign-up.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={href}
            className={`px-6 py-3 rounded-lg border ${a.border} ${a.text} ${a.hover} transition-colors font-semibold`}
          >
            {label}
          </Link>
          {hub && (
            <Link
              href="/repair-centre"
              className="px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 transition-colors"
            >
              All categories
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
