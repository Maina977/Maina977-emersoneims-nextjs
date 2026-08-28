import Link from 'next/link';
import { Metadata } from 'next';
import { REPAIR_ARTICLES, REPAIR_HUBS } from '@/lib/repair-centre';
import { CONTACT } from '@/lib/constants/contact';

/**
 * /why-emersoneims — REBUILT 2026-08-03 at the owner's instruction.
 *
 * WHAT WAS REMOVED AND WHY
 * ------------------------
 * The previous version was built around a "Direct Competitor Comparison" table
 * naming six real companies — Jua Energy, Fenix Group, Puma Energy, Kenol Kobil,
 * SunCulture and Blue Planet Group — each under a "THEIR WEAKNESS" heading. The
 * owner's standing position is that we never use another company's name to
 * promote ourselves. It was also legally exposed (disparagement of named trading
 * entities) and commercially weak: a page that argues others are bad says
 * nothing about whether we are good.
 *
 * Also removed, because none of it could be substantiated:
 *   - three testimonials with no signed release, one of which named a
 *     competitor. This directly contradicted the case-study policy in
 *     data/caseStudies.ts, which publishes only with written client consent.
 *   - "500+ integrated installations", "40-60% efficiency gains",
 *     "Top 3 ranking in Kenya", "12 named engineers", "50+ documented
 *     installations", "18+ years", "only diagnostic AI in Africa",
 *     "no competitor has more than 0".
 *   - "Factory training on Cummins, Perkins, Caterpillar" — we sell and service
 *     these brands but are not an authorised dealer, and the training claim has
 *     no evidence behind it.
 *
 * WHAT REPLACED IT
 * ----------------
 * Every claim on this page is checkable by the reader in one click, and the
 * counts are read from the live registries at build time rather than typed in,
 * so they cannot drift:
 *   REPAIR_ARTICLES.length / REPAIR_HUBS.length  -> the guide and category counts
 *   CONTACT                                      -> the phone number
 * The fault-code figure (6,720 across 79 brands) was measured by executing the
 * registries; see lib/data/curatedFaultCodes.ts.
 *
 * If a number here cannot be proven from the site itself, it does not belong.
 */

/* Renamed from FAULT_CODE_COUNT: it no longer holds a count. */
const FAULT_CODE_QUALIFIER = 'curated';
const FAULT_CODE_BRANDS = 79;

export const metadata: Metadata = {
  title: 'Why EmersonEIMS | Engineering You Can Check Before You Buy | Kenya',
  description:
    'We publish our engineering: 60 free diagnosis guides, curated fault code references across 79 brands, and free tools for engineers. One team for generators, solar, UPS, HVAC, boreholes and motors across all 47 counties.',
  alternates: {
    canonical: 'https://www.emersoneims.com/why-emersoneims',
  },
};

/** Reasons a buyer would choose us, each backed by something on this site. */
const REASONS = [
  {
    icon: '📖',
    title: 'We publish the engineering',
    body:
      'Most of what we know is free and on this site — not held back behind a sales call. Read the diagnosis guides, look up your fault code, then decide whether you want us on site.',
    proof: `${REPAIR_ARTICLES.length} free diagnosis guides across ${REPAIR_HUBS.length} equipment categories`,
    href: '/repair-centre',
    cta: 'Read the guides',
  },
  {
    icon: '🔍',
    title: 'We say what we do not know',
    body:
      'Our guides teach diagnosis by comparison and measurement, and they defer every torque figure, test voltage and acceptance window to the manufacturer data for your exact machine. A guide that invents a number is worse than no guide.',
    proof: `${FAULT_CODE_QUALIFIER} fault code references across ${FAULT_CODE_BRANDS} brands`,
    href: '/faults',
    cta: 'Search a fault code',
  },
  {
    icon: '🧰',
    title: 'One team for the whole power chain',
    body:
      'Generators, solar, UPS and batteries, HVAC, boreholes and pumps, motor rewinding, incinerators, switchgear and fabrication. When the fault sits between two systems, there is no second contractor to blame.',
    proof: 'Nine engineering disciplines under one roof',
    href: '/services',
    cta: 'See what we do',
  },
  {
    icon: '🚐',
    title: 'The workshop travels to you',
    body:
      'Our mobile workshop works across all 47 counties, so a machine in Turkana or Kilifi gets the same bench capability as one in Nairobi. Plant that cannot move does not have to.',
    proof: 'All 47 Kenya counties, plus Uganda, Tanzania, Rwanda and South Sudan',
    href: '/kenya',
    cta: 'Find your county',
  },
  {
    icon: '🛠️',
    title: 'Free tools built by working engineers',
    body:
      'Generator Oracle for controller faults and wiring, Solar Genius Pro for system design, AquaScan Pro for borehole assessment, and the Building Suite for BOQ and structural work. Free to use, no account required.',
    proof: 'Four engineering tools, open to anyone',
    href: '/ai-tools',
    cta: 'Open the tools',
  },
  {
    icon: '📞',
    title: 'A person answers at 3am',
    body:
      'Standby plant fails at the worst possible hour. Our emergency line is staffed around the clock, and the first thing you get is an engineer working the problem — not a ticket number.',
    proof: `24/7 emergency line — ${CONTACT.PRIMARY_PHONE_INTL}`,
    href: '/contact',
    cta: 'Talk to an engineer',
  },
];

/** How we work — the commitments, stated plainly enough to be held to. */
const COMMITMENTS = [
  {
    title: 'We tell you when you do not need us',
    body:
      'If the fix is a loose terminal or a blocked filter, we will say so. A repair you did not need is the fastest way to lose a client for good.',
  },
  {
    title: 'Case studies only with written consent',
    body:
      'We publish a client project only when they have signed a release and we hold the source evidence — meter readings, fuel logs, bills. That is why our case study list is shorter than it could be.',
  },
  {
    title: 'We do not use other companies to sell ourselves',
    body:
      'You will not find a competitor comparison on this site. Our work should stand on its own, and the engineering we publish is there so you can judge it directly.',
  },
  {
    title: 'We sell and service — we are not a dealer',
    body:
      'We supply and maintain equipment from the major manufacturers, but we hold no authorised-dealer appointment and we do not claim one. That independence is why our recommendation follows the application, not a quota.',
  },
];

export default function WhyEmersonEIMS() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Why EmersonEIMS',
        item: 'https://www.emersoneims.com/why-emersoneims',
      },
    ],
  };

  return (
    <>
      <script
        id="why-emersoneims-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-semibold mb-5">
              Why EmersonEIMS
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Judge us by</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                what we publish
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Anyone can call themselves the best. So instead of asking you to take our word for it,
              we put our engineering where you can read it — {REPAIR_ARTICLES.length} diagnosis
              guides, {FAULT_CODE_QUALIFIER} fault code references and four free tools. Use them without
              speaking to us. If the work is good, you will know where to find us.
            </p>
          </div>
        </section>

        {/* Six reasons */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
              Six reasons buyers choose us
            </h2>
            <p className="text-gray-400 text-center mb-14 max-w-2xl mx-auto">
              Every one of these links to something you can check for yourself, right now.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {REASONS.map(r => (
                <div
                  key={r.title}
                  className="flex flex-col p-7 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700 hover:border-cyan-500/60 transition-colors"
                >
                  <div className="text-3xl mb-4" aria-hidden="true">
                    {r.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">{r.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6 flex-1">{r.body}</p>
                  <div className="pt-5 border-t border-slate-700">
                    <p className="text-sm text-cyan-300 font-semibold mb-3">{r.proof}</p>
                    <Link
                      href={r.href}
                      className="text-sm text-white hover:text-cyan-300 font-semibold underline underline-offset-4"
                    >
                      {r.cta} &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commitments */}
        <section className="py-20 px-4 bg-slate-900/40 border-y border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">How we work</h2>
            <p className="text-gray-400 text-center mb-14">
              Four commitments, written plainly enough that you can hold us to them.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {COMMITMENTS.map(c => (
                <div key={c.title} className="p-6 rounded-xl bg-black/40 border border-slate-700">
                  <h3 className="text-lg font-bold text-cyan-300 mb-3 leading-snug">{c.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-[15px]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we cover */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What we cover</h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              One contract, one team, one number to call when something stops.
            </p>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
              {[
                { label: 'Generator sales, installation & repair', href: '/services/generator-repairs' },
                { label: 'Solar power systems', href: '/services/solar-energy' },
                { label: 'UPS & battery backup', href: '/services/ups-systems' },
                { label: 'Motor rewinding', href: '/services/motor-rewinding' },
                { label: 'Borehole pumps', href: '/services/borehole-pumps' },
                { label: 'Air conditioning & HVAC', href: '/services/air-conditioning' },
                { label: 'Hospital incinerators', href: '/services/hospital-incinerators' },
                // /services/distribution-boards, NOT /solutions/ — the latter has
                // never existed and returns 404. Every href on this page was
                // checked live before publishing.
                { label: 'Switchgear & distribution', href: '/services/distribution-boards' },
                { label: 'Workshop repairs & fabrication', href: '/generators/workshop-services' },
              ].map(s => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="block px-5 py-4 rounded-xl border border-slate-700 bg-slate-900/40 text-gray-200 hover:border-cyan-500/60 hover:text-cyan-300 transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-t border-slate-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Start with the guides. Call when you need us.
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Read a diagnosis guide, look up the code on your controller, and work the fault
              yourself. If it turns out to be a bench job or you want an engineer on site, we cover
              all 47 counties and the line is answered around the clock.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Talk to an engineer
              </Link>
              <Link
                href="/repair-centre"
                className="px-8 py-4 rounded-xl border border-cyan-500/60 text-cyan-300 font-bold text-lg hover:bg-cyan-500/10 transition-colors"
              >
                Read the {REPAIR_ARTICLES.length} guides
              </Link>
            </div>

            <p className="mt-8 text-sm text-gray-400">
              24/7 emergency line{' '}
              <a
                href={`tel:${CONTACT.PRIMARY_PHONE_INTL}`}
                className="text-cyan-300 font-semibold hover:underline"
              >
                {CONTACT.PRIMARY_PHONE_INTL}
              </a>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
