import Link from 'next/link';

/**
 * Client proof on the location pages.
 *
 * WHY. A crawl on 2026-08-08 found that EmersonEIMS's earned reputation was
 * confined almost entirely to the homepage: /services, /contact and all 1,474
 * /kenya/* pages carried NO client proof of any kind. Those location pages are
 * where search traffic lands and where a buyer decides whether to trust the
 * firm, and they were making the case on capability alone.
 *
 * NOTHING HERE IS NEW OR INVENTED. Every client, capacity and figure below is
 * copied from records already published on /case-studies. This component
 * redistributes existing published proof to the pages that need it; it does
 * not author claims. If a figure is wrong, it is wrong on /case-studies too
 * and should be corrected at that source.
 *
 * DELIBERATELY OMITTED — the testimonial quotes. They are attributed only to
 * roles ("Principal", "Farm Manager"), and an anonymous quote amplified across
 * a thousand pages reads as marketing rather than evidence. Named clients and
 * concrete outcomes carry the weight honestly. Once the owner confirms which
 * quotes are genuine client words and whether they can be attributed to a
 * person or organisation, the quotes belong here too.
 *
 * NO Review OR AggregateRating SCHEMA, and that is a considered decision.
 * Google excludes self-serving reviews about your own business from rich
 * results, so marking these up would earn no stars and would risk a manual
 * action. Genuine Google reviews belong on the Business Profile, which is
 * where that signal actually counts.
 */

interface Project {
  client: string;
  where: string;
  /** County slug this project sits in, for local matching. */
  countySlug: string;
  sector: string;
  work: string;
  outcome: string;
}

/** Copied verbatim in substance from the records on /case-studies. */
const PROJECTS: Project[] = [
  {
    client: 'St. Austins Academy',
    where: 'Nairobi',
    countySlug: 'nairobi',
    sector: 'Education',
    work: '50 kVA standby set with automatic transfer and surge protection for the computer labs',
    outcome: 'Zero teaching disruptions since 2023, transfer under 5 seconds',
  },
  {
    client: 'Bigot Flowers',
    where: 'Naivasha',
    countySlug: 'nakuru',
    sector: 'Horticulture / export',
    work: '300 kVA + 100 kVA redundant sets with automatic load management and temperature monitoring',
    outcome: 'Cold chain held at 100%, crop losses down 95%, payback in 18 months',
  },
  {
    client: 'Maua Methodist Hospital',
    where: 'Meru',
    countySlug: 'meru',
    sector: 'Healthcare',
    work: '200 kVA medical-grade set with UPS backup on critical equipment and 24/7 remote monitoring',
    outcome: '99.95% uptime, no surgery ever interrupted',
  },
];

interface Props {
  /** County slug of the page this renders on, used to lead with local work. */
  countySlug: string;
  /** County or constituency name, for the heading. */
  locationName: string;
}

export default function LocationProof({ countySlug, locationName }: Props) {
  const local = PROJECTS.filter((p) => p.countySlug === countySlug);
  const others = PROJECTS.filter((p) => p.countySlug !== countySlug);
  const ordered = [...local, ...others];
  const hasLocal = local.length > 0;

  return (
    <section className="mb-16" aria-labelledby="proof-heading">
      <h2 id="proof-heading" className="text-2xl md:text-3xl font-bold mb-3">
        {hasLocal ? `Work we have delivered in ${locationName}` : 'Work we have delivered'}
      </h2>
      <p className="text-gray-400 max-w-3xl mb-6">
        {hasLocal
          ? `These are named clients, not anonymous case studies. ${local[0].client} is in ${local[0].where}.`
          : `We have not published a project in ${locationName} yet. These are named clients elsewhere in Kenya — our mobile workshop covers all 47 counties, so the same team does the work here.`}
      </p>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {ordered.map((p) => (
          <div
            key={p.client}
            className={`rounded-xl border p-5 ${
              p.countySlug === countySlug
                ? 'border-amber-500/40 bg-amber-400/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              {p.sector}
            </div>
            <div className="text-lg font-semibold text-white mb-1">{p.client}</div>
            <div className="text-sm text-amber-300/90 mb-3">{p.where}</div>
            <p className="text-sm text-gray-400 mb-3">{p.work}</p>
            <p className="text-sm text-gray-300 font-medium">{p.outcome}</p>
          </div>
        ))}
      </div>

      <Link
        href="/case-studies"
        className="inline-block text-amber-300 hover:text-amber-200 font-semibold"
      >
        Read the full case studies &rarr;
      </Link>
    </section>
  );
}
