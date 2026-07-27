import type { Metadata } from 'next';
import Link from 'next/link';
import { REPAIR_HUBS, REPAIR_ARTICLES, getArticlesForHub } from '@/lib/repair-centre';

export const metadata: Metadata = {
  title: 'Repair Centre | Generator, Inverter & UPS Fault Diagnosis | EmersonEIMS',
  description:
    'Technical fault diagnosis and repair guidance for diesel generators, inverters, UPS systems and generator controllers. Ranked causes, ordered diagnostic steps with expected readings, and the safety constraints stated rather than assumed.',
  keywords: [
    'generator repair Kenya', 'generator troubleshooting', 'inverter repair Kenya',
    'UPS repair Nairobi', 'generator fault diagnosis', 'generator will not start',
    'controller fault codes', 'diesel generator diagnosis',
  ],
  alternates: { canonical: 'https://www.emersoneims.com/repair-centre' },
  openGraph: {
    title: 'EmersonEIMS Repair Centre — Fault Diagnosis & Repair Guidance',
    description: 'Diagnosis guides for generators, inverters, UPS systems and controllers, written for technicians working on real plant.',
    url: 'https://www.emersoneims.com/repair-centre',
    type: 'website',
  },
};

export default function RepairCentrePage() {
  const written = REPAIR_ARTICLES.length;

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.emersoneims.com/repair-centre#page',
        name: 'EmersonEIMS Repair Centre',
        description: 'Fault diagnosis and repair guidance for generators, inverters, UPS systems and controllers.',
        url: 'https://www.emersoneims.com/repair-centre',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
          { '@type': 'ListItem', position: 2, name: 'Repair Centre', item: 'https://www.emersoneims.com/repair-centre' },
        ],
      },
    ],
  };

  return (
    <>
      <script id="repair-centre-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <main className="min-h-screen bg-slate-950">
        <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-3">Technical Reference</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">Repair Centre</h1>
            <p className="mt-5 text-lg text-slate-300 max-w-3xl leading-relaxed">
              Fault diagnosis and repair guidance for diesel generating sets, inverters, UPS systems and generator
              controllers. Every guide ranks its causes by likelihood, gives an ordered diagnostic sequence with the
              reading expected at each step, and states the safety constraints rather than assuming them.
            </p>
            <p className="mt-4 text-slate-400 max-w-3xl">
              Where a value is specific to your model, the guide says so and tells you what to confirm against the
              manufacturer&apos;s documentation. We would rather send you to the service manual than invent a number.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-bold text-white mb-6">Equipment categories</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {REPAIR_HUBS.map(hub => {
              const count = getArticlesForHub(hub.slug).length;
              return (
                <Link
                  key={hub.slug}
                  href={`/repair-centre/${hub.slug}`}
                  className="group rounded-2xl border border-slate-700 bg-slate-900/50 p-6 hover:border-cyan-500/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{hub.title}</h3>
                    <span className="shrink-0 text-xs px-2 py-1 rounded-full border border-slate-600 text-slate-400">
                      {count > 0 ? `${count} guide${count === 1 ? '' : 's'}` : 'in progress'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{hub.intro}</p>
                  <ul className="flex flex-wrap gap-2">
                    {hub.scope.slice(0, 5).map(s => (
                      <li key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{s}</li>
                    ))}
                  </ul>
                </Link>
              );
            })}
          </div>
        </section>

        {written > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Published guides</h2>
            <ul className="space-y-3">
              {REPAIR_ARTICLES.map(a => (
                <li key={a.slug}>
                  <Link
                    href={`/repair-centre/${a.hub}/${a.slug}`}
                    className="block rounded-xl border border-slate-700 bg-slate-900/50 p-5 hover:border-cyan-500/60 transition-colors"
                  >
                    <h3 className="text-lg font-bold text-white mb-1">{a.header.title}</h3>
                    <p className="text-sm text-slate-400">{a.header.appliesTo}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl font-bold text-white mb-3">Diagnostic tools</h2>
            <p className="text-slate-400 mb-5 max-w-3xl">
              Looking up a specific controller alarm rather than reading a guide? The Generator Oracle carries the
              fault-code database with reset pathways.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/generator-oracle" className="px-5 py-2.5 rounded-lg border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/10">
                Generator Oracle
              </Link>
              <Link href="/faults" className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:border-cyan-500">
                Fault code search
              </Link>
              <Link href="/services" className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:border-cyan-500">
                Our services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
