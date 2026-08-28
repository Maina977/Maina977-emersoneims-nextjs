import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { REPAIR_HUBS, REPAIR_ARTICLES, getRepairHub, getArticlesForHub } from '@/lib/repair-centre';
import { getHubCoverage } from '@/lib/repair-centre/hubCoverage';
import HubScopeDiagram from '@/components/repair-centre/HubScopeDiagram';

interface Props { params: Promise<{ hub: string }> }

// The hub set is a fixed registry, so every valid path is enumerable below.
// Anything else must be a hard 404, not a 200 carrying a "Not found" body.
export const dynamicParams = false;

export async function generateStaticParams() {
  return REPAIR_HUBS.map(h => ({ hub: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub: slug } = await params;
  const hub = getRepairHub(slug);

  // Unknown hubs must not render. Note that neither this call nor
  // dynamicParams=false actually produces a 404 STATUS on Next 16 + Vercel —
  // both were tried and /repair-centre/nonsense-hub still answered HTTP 200.
  // The authoritative 404 comes from guard 0f in middleware.ts; keep the hub
  // list there in sync with REPAIR_HUBS.
  if (!hub) notFound();

  return {
    title: `${hub.title} | EmersonEIMS Repair Centre`,
    description: hub.intro.slice(0, 300),
    alternates: { canonical: `https://www.emersoneims.com/repair-centre/${hub.slug}` },
    openGraph: {
      title: `${hub.title}`,
      description: hub.intro.slice(0, 300),
      url: `https://www.emersoneims.com/repair-centre/${hub.slug}`,
      type: 'website',
    },
  };
}

export default async function RepairHubPage({ params }: Props) {
  const { hub: slug } = await params;
  const hub = getRepairHub(slug);
  if (!hub) notFound();

  const articles = getArticlesForHub(hub.slug);

  // Split the declared scope into what genuinely has a guide behind it and what
  // does not. See lib/repair-centre/hubCoverage.ts for why this exists.
  const coverage = getHubCoverage(hub.slug);
  const bySlug = new Map(REPAIR_ARTICLES.map(a => [a.slug, a]));
  const covered = hub.scope
    .map(label => ({
      label,
      articles: (coverage?.covers[label] ?? [])
        .map(s => bySlug.get(s))
        .filter((a): a is NonNullable<typeof a> => Boolean(a)),
    }))
    .filter(x => x.articles.length > 0);
  const uncovered = hub.scope.filter(
    label => !(coverage?.covers[label] ?? []).some(s => bySlug.has(s)),
  );
  // Same source as the text above, so the diagram can never show coverage the
  // page does not actually have.
  const coveredCounts: Record<string, number> = Object.fromEntries(
    hub.scope.map(label => [
      label,
      (coverage?.covers[label] ?? []).filter(s => bySlug.has(s)).length,
    ]),
  );

  // Guides that live in another hub but genuinely belong on this page — the
  // orphan case: /repair-centre/solar advertised "DC bus and isolation faults"
  // while the article covering it sat in the inverters hub, linked from nowhere.
  const ownSlugs = new Set(articles.map(a => a.slug));
  const crossHub = [
    ...new Set(Object.values(coverage?.covers ?? {}).flat()),
  ]
    .filter(s => !ownSlugs.has(s))
    .map(s => bySlug.get(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const siblings = (coverage?.siblings ?? [])
    .map(s => REPAIR_HUBS.find(h => h.slug === s))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
      { '@type': 'ListItem', position: 2, name: 'Repair Centre', item: 'https://www.emersoneims.com/repair-centre' },
      { '@type': 'ListItem', position: 3, name: hub.title, item: `https://www.emersoneims.com/repair-centre/${hub.slug}` },
    ],
  };

  return (
    <>
      <script id={`hub-ld-${hub.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="min-h-screen bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400 mb-6">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-cyan-400">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/repair-centre" className="hover:text-cyan-400">Repair Centre</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-300" aria-current="page">{hub.title}</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{hub.title}</h1>
          <p className="mt-4 text-slate-300 leading-relaxed max-w-3xl">{hub.intro}</p>

          {/*
            Scope used to be a plain bullet list. Ten of the fifteen hubs listed
            more topics than they had guides for, so the list read as a promise
            the page did not keep — /repair-centre/solar advertised six topics
            over two articles. Each topic now either links to the guide that
            covers it, or is declared unwritten below. Nothing is implied.
          */}
          <HubScopeDiagram hub={hub} coveredCounts={coveredCounts} />

          <h2 className="mt-10 text-xl font-bold text-white mb-4">What this covers</h2>
          <ul className="space-y-3">
            {covered.map(({ label, articles: hits }) => (
              <li key={label} className="flex gap-3 text-slate-300">
                <span className="text-cyan-400 mt-1.5 shrink-0" aria-hidden="true">▪</span>
                <span>
                  {label}
                  {' — '}
                  {hits.map((a, i) => (
                    <span key={a.slug}>
                      {i > 0 && ', '}
                      <Link
                        href={`/repair-centre/${a.hub}/${a.slug}`}
                        className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                      >
                        {a.header.title.split(' — ')[0]}
                      </Link>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>

          {uncovered.length > 0 && (
            <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/40 p-5">
              <h3 className="text-base font-bold text-white mb-2">
                Also in this category — guide not yet published
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                We work on these, but the written guide is not finished. We would rather say so than
                publish a thin page. If you have one of these faults now, an engineer will work it
                with you directly.
              </p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {uncovered.map(s => (
                  <li key={s} className="flex gap-3 text-slate-400 text-sm">
                    <span className="text-slate-600 mt-1.5 shrink-0" aria-hidden="true">▫</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="mt-12 text-xl font-bold text-white mb-4">Diagnosis guides</h2>
          {articles.length > 0 ? (
            <ul className="space-y-3">
              {articles.map(a => (
                <li key={a.slug}>
                  <Link
                    href={`/repair-centre/${hub.slug}/${a.slug}`}
                    className="block rounded-xl border border-slate-700 bg-slate-900/50 p-5 hover:border-cyan-500/60 transition-colors"
                  >
                    <h3 className="text-lg font-bold text-white mb-1">{a.header.title}</h3>
                    <p className="text-sm text-slate-400 mb-2">{a.header.appliesTo}</p>
                    <p className="text-sm text-slate-500">
                      {a.diagnosis.length} diagnostic steps · {a.header.difficulty} · {a.header.competence.replace(/-/g, ' ')}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
              <p className="text-slate-300">
                Guides for this category are being written. We publish them when they are technically complete and
                reviewed, rather than publishing thin pages to fill a category.
              </p>
              <p className="mt-3 text-slate-400">
                If you have a fault on this equipment now, contact us directly and an engineer will work it with you.
              </p>
              <Link href="/contact" className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold">
                Contact an engineer
              </Link>
            </div>
          )}

          {/* Guides held in another hub that cover this category's scope. */}
          {crossHub.length > 0 && (
            <>
              <h2 className="mt-12 text-xl font-bold text-white mb-2">Related guides</h2>
              <p className="text-sm text-slate-400 mb-4">
                Filed under another category, but they cover part of the scope above.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {crossHub.map(a => (
                  <li key={a.slug}>
                    <Link
                      href={`/repair-centre/${a.hub}/${a.slug}`}
                      className="block h-full rounded-xl border border-slate-700 bg-slate-900/40 p-4 hover:border-cyan-500/60 transition-colors"
                    >
                      <h3 className="text-sm font-bold text-white mb-1">{a.header.title}</h3>
                      <p className="text-xs text-slate-500">
                        in {REPAIR_HUBS.find(h => h.slug === a.hub)?.title ?? a.hub} ·{' '}
                        {a.diagnosis.length} diagnostic steps
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* A reader who wants it done rather than explained needs a route out. */}
          {coverage?.servicePath && (
            <div className="mt-12 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6">
              <h2 className="text-lg font-bold text-white mb-2">Want us to do the work?</h2>
              <p className="text-slate-300 text-sm mb-4">
                These guides are written so you can diagnose the fault yourself. If you would rather
                an engineer handled it, our mobile workshop covers all 47 counties.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={coverage.servicePath}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold"
                >
                  {hub.title.replace(/ — .*/, '')} services
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors"
                >
                  Talk to an engineer
                </Link>
              </div>
            </div>
          )}

          {/* A thin hub must not be a dead end. */}
          {siblings.length > 0 && (
            <>
              <h2 className="mt-12 text-xl font-bold text-white mb-4">Related categories</h2>
              <ul className="flex flex-wrap gap-3">
                {siblings.map(s => (
                  <li key={s.slug}>
                    <Link
                      href={`/repair-centre/${s.slug}`}
                      className="inline-block px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-white transition-colors text-sm"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}
