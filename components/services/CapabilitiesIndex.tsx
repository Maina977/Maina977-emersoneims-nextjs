import Link from 'next/link';

/**
 * EVERYTHING WE SELL AND SERVICE — one crawlable index.
 *
 * WHY IT EXISTS
 * The site covers far more than its ten service pages suggest. Generator
 * component repair — alternators, starters, radiators, injectors,
 * turbochargers — is real work described in a single paragraph on
 * /generators/workshop-services. Fuel-tank automation and exhaust fabrication
 * appear in one list on the same page. Nothing points a searcher at them.
 *
 * Someone typing "injector pump repair Nairobi" or "generator radiator repair
 * Kenya" is a customer with a specific fault and a budget, and the site had no
 * text aimed at that query even though the work is done every week. This page
 * names each capability in the words a buyer uses and links to the page that
 * covers it.
 *
 * WHAT THIS IS NOT. It is not a set of new thin pages, which is the pattern
 * this project has twice had to undo (fabricated village-tier location pages,
 * and 1,832 fault-code pages proposed and correctly retracted). It is one
 * index over content that already exists — the same approach that made 2,137
 * engine fault codes crawlable through ten brand pages rather than 2,137 thin
 * ones.
 *
 * EVERY LINK WAS VERIFIED 200 AS GOOGLEBOT before being written. Nothing is
 * claimed that is not already described on the destination page.
 *
 * SERVER-RENDERED, because an index a crawler cannot read indexes nothing.
 */

interface Group {
  heading: string;
  blurb: string;
  items: { label: string; href: string }[];
}

const GROUPS: Group[] = [
  {
    heading: 'Generators',
    blurb:
      'VOLTKA sets built on Cummins engines, from 10 kVA single-phase to megawatt-class plant — supplied, installed, commissioned and maintained.',
    items: [
      { label: 'VOLTKA generators with Cummins engines', href: '/services/cummins-generators' },
      { label: 'Generator repair and servicing', href: '/services/generator-repairs' },
      { label: 'Generator spare parts', href: '/generators/spare-parts' },
      { label: 'Automatic transfer switches and changeover panels', href: '/services/ats-changeover' },
      { label: 'Scheduled maintenance contracts', href: '/maintenance-hub' },
    ],
  },
  {
    heading: 'Engine and component overhaul',
    blurb:
      'Component-level repair on the bench in Embakasi, rather than replacing a whole assembly because one part failed. This is usually a fraction of the cost of new.',
    items: [
      { label: 'Alternator repair and rewinding', href: '/generators/workshop-services' },
      { label: 'Starter motor repair', href: '/generators/workshop-services' },
      { label: 'Radiator repair and recoring', href: '/generators/workshop-services' },
      { label: 'Injector and injector-pump service', href: '/generators/workshop-services' },
      { label: 'Turbocharger repair', href: '/generators/workshop-services' },
      { label: 'Electric motor rewinding', href: '/services/motor-rewinding' },
    ],
  },
  {
    heading: 'Solar, UPS and stored power',
    blurb:
      'Panels, batteries and inverters supplied and installed, and the electronics repaired at board level when they fail.',
    items: [
      { label: 'Solar panels, batteries and inverters', href: '/services/solar-energy' },
      { label: 'UPS systems and critical power', href: '/services/ups-systems' },
      { label: 'Inverter and UPS board-level repair', href: '/repair-centre/industrial-electronics' },
      { label: 'Fault diagnosis by symptom', href: '/repair-centre' },
    ],
  },
  {
    heading: 'Electrical and controls',
    blurb:
      'From a distribution board to a high-voltage intake, including the control and automation that ties plant together.',
    items: [
      { label: 'Distribution boards and panels', href: '/services/distribution-boards' },
      { label: 'Controls, switchgear and automation', href: '/solutions/controls' },
      { label: 'High-voltage systems', href: '/solutions/high-voltage' },
      { label: 'Electrical fault-finding and repair', href: '/maintenance-hub' },
    ],
  },
  {
    heading: 'Water, cooling and waste',
    blurb:
      'Pumping, air conditioning and incineration — specified against the actual load, not a catalogue guess.',
    items: [
      { label: 'Borehole and submersible pumps', href: '/services/borehole-pumps' },
      { label: 'Air conditioning installation and repair', href: '/services/ac-installation' },
      { label: 'Hospital and industrial incinerators', href: '/services/hospital-incinerators' },
    ],
  },
  {
    heading: 'Fabrication',
    blurb:
      'Built to the site, not to a standard drawing — measured, made and installed by the same team that commissions the plant.',
    items: [
      { label: 'Generator canopies and enclosures', href: '/fabrication' },
      { label: 'Exhaust systems', href: '/fabrication' },
      { label: 'Fuel tanks and fuel automation', href: '/generators/workshop-services' },
      { label: 'Steel fabrication', href: '/fabrication' },
    ],
  },
];

export default function CapabilitiesIndex() {
  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);

  return (
    <section
      aria-labelledby="capabilities-index"
      className="border-t border-white/10 bg-black px-4 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.24em] text-white/50">
          Full capability list
        </p>
        <h2
          id="capabilities-index"
          className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white lg:text-4xl"
        >
          Everything we sell, install and repair
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-white/60">
          {total} capabilities across six disciplines, all delivered by one team
          from our Embakasi workshop and mobile units &mdash; nationwide, across
          all 47 counties.
        </p>

        <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <div key={g.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                {g.heading}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{g.blurb}</p>
              <ul className="mt-5 space-y-2.5">
                {g.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      className="group flex items-start gap-2 text-sm leading-snug text-white/80 transition hover:text-amber-300"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-400/60"
                      />
                      <span>{it.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-3 border-t border-white/10 pt-10">
          <Link
            href="/contact"
            className="rounded-full bg-amber-500 px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-amber-400"
          >
            Tell us what you need
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/80 transition hover:border-amber-400/40 hover:text-white"
          >
            See published prices
          </Link>
        </div>
      </div>
    </section>
  );
}
