import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { REPAIR_HUBS, getRepairHub, getArticlesForHub } from '@/lib/repair-centre';

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
      title: `${hub.title} | EmersonEIMS`,
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
      <Script id={`hub-ld-${hub.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <main className="min-h-screen bg-slate-950">
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

          <h2 className="mt-10 text-xl font-bold text-white mb-4">Scope</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {hub.scope.map(s => (
              <li key={s} className="flex gap-3 text-slate-300">
                <span className="text-cyan-400 mt-1.5 shrink-0" aria-hidden="true">▪</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>

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
        </div>
      </main>
    </>
  );
}
