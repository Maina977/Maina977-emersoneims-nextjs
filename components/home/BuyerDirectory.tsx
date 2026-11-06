import Link from 'next/link';

/**
 * "What are you looking for?" — the purchasing directory the external audit
 * (November 2026, §3) asked for directly under the hero: three obvious routes
 * (buy equipment, get a service, talk to an engineer) so a buyer of solar,
 * UPS, pumps or incinerators is not left scrolling a generator-led page.
 *
 * Server component, plain links, no client JavaScript. Every href is a route
 * that exists in the sitemap (checked 2026-11-06, pinned by
 * tests/components/buyer-directory.test.tsx). Labels name what we sell or do;
 * nothing here claims stock, prices or response times.
 */

export interface DirectoryLink {
  href: string;
  label: string;
  note: string;
}

export const BUY_LINKS: readonly DirectoryLink[] = [
  { href: '/generators', label: 'New generators', note: 'VOLTKA, 10–3000 kVA, published prices' },
  { href: '/generators/used', label: 'Used generators', note: 'Cummins, Perkins, CAT and more' },
  { href: '/generators/spare-parts', label: 'Generator spare parts', note: 'Filters, controllers, AVRs, parts' },
  { href: '/solar', label: 'Solar systems', note: 'Home, commercial and hybrid' },
  { href: '/services/solar-inverters', label: 'Solar inverters', note: 'Hybrid and off-grid' },
  { href: '/services/ups-systems', label: 'UPS and batteries', note: 'Sizing, supply and installation' },
  { href: '/services/ats-changeover', label: 'ATS and changeover panels', note: 'Automatic mains–generator transfer' },
  { href: '/services/distribution-boards', label: 'Distribution boards', note: 'Panels and power distribution' },
  { href: '/services/borehole-pumps', label: 'Borehole pumps', note: 'Submersible and solar pumping' },
  { href: '/services/hospital-incinerators', label: 'Incinerators', note: 'Medical and industrial waste' },
];

export const SERVICE_LINKS: readonly DirectoryLink[] = [
  { href: '/services/generator-repairs', label: 'Generator repairs', note: 'Faults, overhauls, controllers' },
  { href: '/booking', label: 'Book a technician', note: 'Pick a service and a time' },
  { href: '/services/motor-rewinding', label: 'Motor rewinding', note: 'Electric motors, tested on the bench' },
  { href: '/services/borehole-drilling', label: 'Borehole drilling', note: 'Survey, drilling and test pumping' },
  { href: '/services/ac-installation', label: 'Air conditioning', note: 'Installation and servicing' },
  { href: '/services/plumbing', label: 'Plumbing', note: 'Installations and repairs' },
];

function Card({ l }: { l: DirectoryLink }) {
  return (
    <Link
      href={l.href}
      className="group block rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-amber-400/50 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
    >
      <span className="block font-semibold text-white group-hover:text-amber-300">{l.label}</span>
      <span className="mt-0.5 block text-xs text-white/60">{l.note}</span>
    </Link>
  );
}

export default function BuyerDirectory() {
  return (
    <section aria-labelledby="buyer-directory-heading" className="bg-black py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="buyer-directory-heading" className="text-center text-3xl font-semibold text-white sm:text-4xl">
          What are you looking for?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-white/70">
          Buy equipment, book a service, or talk to an engineer.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Buy equipment</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {BUY_LINKS.map((l) => <Card key={l.href} l={l} />)}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Get a service</h3>
            <div className="grid gap-3">
              {SERVICE_LINKS.map((l) => <Card key={l.href} l={l} />)}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="w-full rounded-full bg-amber-500 px-8 py-3 text-center font-semibold text-black hover:bg-amber-400 sm:w-auto">
            Request a quote
          </Link>
          <a href="tel:+254768860665" className="w-full rounded-full border border-white/25 px-8 py-3 text-center font-semibold text-white hover:border-amber-400 sm:w-auto">
            Talk to an engineer: +254 768 860 665
          </a>
        </div>
      </div>
    </section>
  );
}
