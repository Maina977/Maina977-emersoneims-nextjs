import Link from 'next/link';
import { getPublishedCaseStudies, type CaseStudy } from '@/data/caseStudies';

/**
 * Client proof on the location pages.
 *
 * WHY IT EXISTS. A crawl on 2026-08-08 found that EmersonEIMS's earned
 * reputation was confined almost entirely to the homepage: /services, /contact
 * and all the /kenya/* pages carried NO client proof. Those pages are where
 * search traffic lands and where a buyer decides whether to trust the firm.
 *
 * WHY IT WAS REWRITTEN, 2026-09-11. The previous version kept its own
 * hand-copied list of three projects, under a comment saying they were "copied
 * verbatim in substance from the records on /case-studies". Checked against
 * data/caseStudies.ts, two of the three were not:
 *
 *   Bigot Flowers   shown as "300 kVA + 100 kVA redundant sets" in Naivasha.
 *                   The PUBLISHED record — backed by a load-test report,
 *                   cold-chain logs and a photograph of the actual set — is a
 *                   single 30 kVA Caterpillar C30D in Nairobi. Ten times the
 *                   real capacity, in the wrong county, on every location page.
 *   Maua Methodist  "200 kVA ... 99.95% uptime, no surgery ever interrupted".
 *   Hospital        Not in the registry at all — not published, not even a
 *                   draft — so there was no evidence behind any of it.
 *
 * Rendered across roughly 1,900 location pages, an inflated capacity is not a
 * typo; it is the same false claim published 1,900 times, and it contradicted
 * this site's own /case-studies page for any buyer who clicked through.
 *
 * THE RULE NOW: this component has no data of its own. It reads
 * getPublishedCaseStudies(), which returns only entries marked PUBLISHED that
 * carry evidence documents — the same gate /case-studies applies. Every word on
 * a card comes from that record. To show a project here, publish it there, with
 * its evidence; to correct a figure, correct it there and every page follows.
 *
 * WHICH PROJECTS, AND WHY IT VARIES BY PAGE. Local work first, because a
 * project in the reader's own county is the strongest proof there is. Then work
 * in the same trade as the page — a buyer reading about solar installation is
 * better served by a solar project than a generator one. Capped at three.
 * Choosing by county and trade also means different pages show different
 * projects, where the old block printed the same three on every page: roughly
 * 150 identical words across ~1,900 URLs, on pages Search Console had begun
 * reporting as "Duplicate, Google chose different canonical than user".
 *
 * NO Review OR AggregateRating SCHEMA, and that is a considered decision.
 * Google excludes self-serving reviews about your own business from rich
 * results, so marking these up would earn no stars and risk a manual action.
 */

/** SEO_SERVICES.category -> CaseStudy.category, where the trades line up. */
const SERVICE_TO_CASE_CATEGORY: Record<string, CaseStudy['category'][]> = {
  generators: ['Generator', 'Hybrid'],
  solar: ['Solar', 'Hybrid'],
  ups: ['UPS', 'Hybrid'],
  electrical: ['Generator', 'UPS'],
  automation: ['Generator', 'Diagnostics'],
};

/** "Trans Nzoia" -> "trans-nzoia", so registry names compare with route slugs. */
function slugOf(name: string): string {
  return name.toLowerCase().replace(/county/g, '').trim().replace(/\s+/g, '-');
}

/** First sentence only — the card is a pointer to the full study, not a copy. */
function firstSentence(text: string): string {
  const m = /^(.+?[.!?])(\s|$)/.exec(text.trim());
  return m ? m[1] : text.trim();
}

interface Props {
  /** County slug of the page this renders on, used to lead with local work. */
  countySlug: string;
  /** County or constituency name, for the heading. */
  locationName: string;
  /** SEO_SERVICES.category of the page, when it is about one trade. */
  serviceCategory?: string;
}

export default function LocationProof({ countySlug, locationName, serviceCategory }: Props) {
  // Released names only. A study whose client has not agreed to be named does
  // not belong on a page whose whole point is "named clients, not anonymous".
  const published = getPublishedCaseStudies().filter((cs) => cs.clientNameReleased !== false);
  if (!published.length) return null;

  const wanted = serviceCategory ? SERVICE_TO_CASE_CATEGORY[serviceCategory] ?? [] : [];
  const isLocal = (cs: CaseStudy) => slugOf(cs.county) === countySlug;
  const isTrade = (cs: CaseStudy) => wanted.includes(cs.category);

  // Stable ordering: local, then same trade, then everything else — each group
  // keeping registry order, so the same page always renders the same cards.
  const rank = (cs: CaseStudy) => (isLocal(cs) ? 0 : isTrade(cs) ? 1 : 2);
  const shown = [...published]
    .map((cs, i) => ({ cs, i }))
    .sort((a, b) => rank(a.cs) - rank(b.cs) || a.i - b.i)
    .slice(0, 3)
    .map(({ cs }) => cs);

  const local = shown.filter(isLocal);
  const hasLocal = local.length > 0;

  return (
    <section className="mb-16" aria-labelledby="proof-heading">
      <h2 id="proof-heading" className="text-2xl md:text-3xl font-bold mb-3">
        {hasLocal ? `Work we have delivered in ${locationName}` : 'Work we have delivered'}
      </h2>
      <p className="text-gray-400 max-w-3xl mb-6">
        {hasLocal
          ? `These are named clients, not anonymous case studies. ${local[0].client} is in ${local[0].location}.`
          : `We have not published a project in ${locationName} yet. These are named clients elsewhere in Kenya — our mobile workshop covers all 47 counties, so the same team does the work here.`}
      </p>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {shown.map((cs) => {
          const headline = cs.results[0];
          return (
            <div
              key={cs.id}
              className={`rounded-xl border p-5 ${
                isLocal(cs) ? 'border-amber-500/40 bg-amber-400/5' : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                {cs.category}
                {cs.technical?.capacity ? ` · ${cs.technical.capacity}` : ''}
              </div>
              <div className="text-lg font-semibold text-white mb-1">{cs.client}</div>
              <div className="text-sm text-amber-300/90 mb-3">{cs.location}</div>
              <p className="text-sm text-gray-400 mb-3">{firstSentence(cs.solution)}</p>
              {headline ? (
                <p className="text-sm text-gray-300 font-medium">
                  {headline.metric}: {headline.before} → {headline.after}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <Link
        href="/case-studies"
        className="inline-block text-amber-300 hover:text-amber-200 font-semibold"
      >
        Read the full case studies, with their evidence &rarr;
      </Link>
    </section>
  );
}
