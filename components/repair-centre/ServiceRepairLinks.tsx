import Link from 'next/link';
import { REPAIR_HUBS, getArticlesForHub } from '@/lib/repair-centre';

/**
 * Contextual links from a commercial service page into the matching Repair
 * Centre content.
 *
 * WHY THIS EXISTS: an SEO audit on 2026-07-27 found the Repair Centre had
 * exactly ONE inbound internal link from the whole rest of the site — the main
 * navigation. 54 routes and ~115,000 words were sitting in an island. Almost no
 * internal authority reached them, and a customer reading a service page had no
 * path to the diagnostic guide that would answer their actual question.
 *
 * Articles are pulled from the registry rather than hardcoded, so a link here
 * can never point at an article that has been renamed or removed.
 *
 * Server component: the links are in the initial HTML where crawlers see them.
 */

/** Service slug -> Repair Centre hub. Only mappings that are genuinely relevant. */
const SERVICE_TO_HUB: Record<string, string> = {
  'generator-repairs': 'generators',
  'cummins-generators': 'generators',
  'ats-changeover': 'ats-changeover',
  'solar-energy': 'solar',
  'motor-rewinding': 'motors',
  'ups-systems': 'ups',
  'borehole-pumps': 'pumps',
  'distribution-boards': 'safety',
};

export default function ServiceRepairLinks({ slug }: { slug: string }) {
  const hubSlug = SERVICE_TO_HUB[slug];
  if (!hubSlug) return null;

  const hub = REPAIR_HUBS.find(h => h.slug === hubSlug);
  const articles = getArticlesForHub(hubSlug);
  if (!hub || articles.length === 0) return null;

  return (
    <section className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-2">
          Free diagnostic guides
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          Diagnosing it yourself first? Start here.
        </h2>
        <p className="mt-3 text-slate-300 leading-relaxed max-w-3xl">
          {hub.intro}
        </p>

        <ul className="mt-6 grid sm:grid-cols-2 gap-3">
          {articles.slice(0, 6).map(a => (
            <li key={a.slug}>
              <Link
                href={`/repair-centre/${a.hub}/${a.slug}`}
                className="block h-full rounded-xl border border-slate-700 bg-slate-900/50 p-4 hover:border-cyan-500/60 transition-colors"
              >
                <h3 className="text-base font-bold text-white mb-1">{a.header.title}</h3>
                <p className="text-sm text-slate-400">
                  {a.diagnosis.length} diagnostic steps · {a.header.difficulty} · {a.header.competence.replace(/-/g, ' ')}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/repair-centre/${hub.slug}`}
            className="px-5 py-2.5 rounded-lg border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            All {hub.title.toLowerCase()} guides
          </Link>
          <Link
            href="/repair-centre"
            className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors"
          >
            Repair Centre
          </Link>
        </div>
      </div>
    </section>
  );
}
