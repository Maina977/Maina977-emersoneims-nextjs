import { getCountyServiceDepth } from '@/lib/seo/countyServiceDepth';
import type { SEOService } from '@/lib/data/seo-services';

/**
 * The one block on /kenya/<county>/<service> that is about the SERVICE rather
 * than the county. See lib/seo/countyServiceDepth.ts for why it exists and why
 * it renders a different slice per service instead of one shared block.
 *
 * Server-rendered on purpose: this is the text the page needs a crawler to read,
 * and anything mounted client-side would not be in the HTML response.
 */
export default function CountyServiceDepth({
  service,
  countyName,
}: {
  service: SEOService;
  countyName: string;
}) {
  const depth = getCountyServiceDepth(service, countyName);
  if (!depth) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-14" aria-labelledby="service-depth">
      <h2 id="service-depth" className="text-2xl font-bold text-white">
        {depth.heading}
      </h2>
      <p className="mt-3 leading-relaxed text-slate-300">{depth.lede}</p>

      <dl className="mt-8 space-y-6">
        {depth.entries.map((entry) => (
          <div key={entry.term} className="border-l-2 border-cyan-500/40 pl-5">
            <dt className="flex flex-wrap items-baseline gap-3">
              <span className="text-lg font-semibold text-white">{entry.term}</span>
              {entry.tag ? (
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs uppercase tracking-wide text-cyan-300">
                  {entry.tag}
                </span>
              ) : null}
            </dt>
            <dd className="mt-2">
              <ul className="space-y-1.5 text-slate-300">
                {entry.lines.map((line) => (
                  <li key={line} className="leading-relaxed">
                    {line}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>

      {depth.references.length ? (
        <p className="mt-8 text-sm text-slate-400">
          Worked to: {depth.references.join(' · ')}
        </p>
      ) : null}
    </section>
  );
}
