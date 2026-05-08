/**
 * Services Index Page — EmersonEIMS (Server Component for instant SSR)
 *
 * Layout principles (per user requirements):
 *  • No huge gap below navbar (hero starts tight under the fixed nav).
 *  • Services GROUPED by category section so every UPS sub-service sits
 *    under UPS, every Generator sub-service sits under Generator, etc.
 *  • Each category has an anchor id for direct linking
 *    (/services#cat-power, /services#cat-renewable, …).
 *  • No `'use client'` — this is a static page; rendering server-side
 *    skips the loading.tsx fallback that previously made the page look
 *    broken while the bundle downloaded.
 */

import Link from 'next/link';
import {
  ALL_SERVICES,
  SERVICE_CATEGORIES,
  TRUST_BADGES,
  BUSINESS_CONTACT,
  type Service,
} from '@/lib/services/allServices';

const CATEGORY_META: Record<
  string,
  { tagline: string; accent: string; order: number }
> = {
  power: {
    tagline:
      'Diesel, gas & hybrid generators — sales, installation, ATS, repairs and 24/7 maintenance.',
    accent: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    order: 1,
  },
  renewable: {
    tagline:
      'Solar PV, hybrid systems, battery storage and grid-tie installations across East Africa.',
    accent: 'from-yellow-500/20 to-lime-500/20 border-yellow-500/30',
    order: 2,
  },
  electrical: {
    tagline:
      'UPS systems, distribution boards, motor rewinding and full electrical contracting.',
    accent: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
    order: 3,
  },
  hvac: {
    tagline:
      'Air-conditioning, ventilation, cold-room and chiller installation & service.',
    accent: 'from-sky-500/20 to-indigo-500/20 border-sky-500/30',
    order: 4,
  },
  water: {
    tagline:
      'Borehole drilling, pump installation, treatment plants and water management.',
    accent: 'from-blue-500/20 to-teal-500/20 border-blue-500/30',
    order: 5,
  },
  waste: {
    tagline:
      'Hospital, municipal and industrial incinerators — supply, install, maintain.',
    accent: 'from-rose-500/20 to-red-500/20 border-rose-500/30',
    order: 6,
  },
  fabrication: {
    tagline:
      'Custom enclosures, sound-attenuated canopies and steel fabrication.',
    accent: 'from-slate-500/20 to-zinc-500/20 border-slate-500/30',
    order: 7,
  },
};

const ORDERED_CATEGORIES = [...SERVICE_CATEGORIES].sort(
  (a, b) =>
    (CATEGORY_META[a.id]?.order ?? 99) - (CATEGORY_META[b.id]?.order ?? 99),
);

/**
 * SERVICE → CALCULATOR map.
 * Every entry below points at a calculator that lives under
 * `/diagnostics` (the legacy "diagnostic" hub). The deep link
 * `/diagnostics?service=<slug>#calculator` pre-selects the
 * matching service and scrolls to its Advanced Calculator.
 *
 * Keep these slugs in sync with `lib/services/allServices.ts`.
 */
const SERVICE_CALCULATOR_SLUGS: ReadonlySet<string> = new Set([
  'cummins-generators',
  'generator-repairs',
  'ats-changeover',
  'distribution-boards',
  'solar-energy',
  'motor-rewinding',
  'ac-installation',
  'ups-systems',
  'borehole-pumps',
  'hospital-incinerators',
]);

function calculatorHref(slug: string): string | null {
  return SERVICE_CALCULATOR_SLUGS.has(slug)
    ? `/services/${slug}#calculator`
    : null;
}

function ServiceCard({ service }: { service: Service }) {
  const calcHref = calculatorHref(service.slug);
  return (
    <div className="group h-full bg-slate-800/40 border border-slate-700/70 rounded-xl overflow-hidden hover:border-cyan-500/60 hover:bg-slate-800/70 transition-colors duration-200 flex flex-col">
      <Link
        href={`/services/${service.slug}`}
        prefetch={false}
        className="block p-5 flex-1"
      >
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl leading-none" aria-hidden="true">
            {service.icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
              {service.name}
            </h3>
            <p className="text-xs text-amber-400/80 mt-0.5">
              {service.startingPrice}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
          {service.description}
        </p>
        <ul className="space-y-1 mb-3">
          {service.benefits.slice(0, 2).map((b) => (
            <li
              key={b.title}
              className="flex items-center gap-2 text-xs text-slate-300"
            >
              <span className="text-cyan-400">✓</span>
              <span className="line-clamp-1">{b.title}</span>
            </li>
          ))}
        </ul>
        <div className="text-xs font-medium text-cyan-400 group-hover:text-cyan-300">
          View details →
        </div>
      </Link>
      {calcHref && (
        <Link
          href={calcHref}
          prefetch={false}
          className="block px-5 py-2.5 border-t border-slate-700/70 bg-slate-900/40 text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-slate-900/70 transition-colors"
          aria-label={`Open ${service.name} calculator`}
        >
          🧮 Open {service.shortName} Calculator →
        </Link>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative px-4 pt-8 pb-12 sm:pt-10 sm:pb-16 border-b border-slate-800/60 overflow-hidden">
        {/* Ambient decoration */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        />
        <div className="relative max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-400">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white">Services</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 text-xs font-medium mb-4">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                B2B Engineering Services · {ALL_SERVICES.length} services · {ORDERED_CATEGORIES.length} disciplines
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-4">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-amber-200 bg-clip-text text-transparent">
                  B2B power &amp; engineering services for Kenyan industry
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300/90 max-w-3xl leading-relaxed">
                EmersonEiMS is an engineering solutions partner for
                <span className="text-white font-medium"> hospitals, manufacturers, telecom operators, commercial property and construction</span>.
                We design, install and maintain generators, solar, UPS, motor
                systems, HVAC, boreholes and incinerators &mdash; backed by our{' '}
                <span className="text-amber-400 font-semibold">3-year warranty</span>,
                an SLA-backed maintenance team and 24/7 emergency response
                across all 47 counties.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch lg:min-w-[220px]">
              <a
                href={`tel:${BUSINESS_CONTACT.phoneIntl}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow"
              >
                <span aria-hidden="true">📞</span>
                <span>{BUSINESS_CONTACT.phoneDisplay}</span>
              </a>
              <a
                href={BUSINESS_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <span aria-hidden="true">💬</span>
                <span>WhatsApp Us</span>
              </a>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-600 text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                <span aria-hidden="true">📅</span>
                <span>Book a site visit</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────── */}
      <section className="px-4 py-5 bg-slate-900/40 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRUST_BADGES.map((b) => (
            <div
              key={b.title}
              className="flex items-center gap-3 px-3 py-2 bg-slate-800/40 rounded-lg"
            >
              <span className="text-2xl" aria-hidden="true">
                {b.icon}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {b.title}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {b.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Industries we serve (B2B positioning) ────────────────── */}
      <section className="px-4 py-12 sm:py-14 border-b border-slate-800/60" aria-labelledby="industries-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-2">Industries we serve</p>
            <h2 id="industries-heading" className="text-2xl sm:text-3xl font-bold">
              Built for the operators who can&rsquo;t afford downtime
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl">
              Our service contracts are written around uptime SLAs, regulator
              compliance and lifecycle cost &mdash; not just installation.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { href: '/industries/manufacturing', icon: '🏭', name: 'Manufacturing', tag: 'Production-line uptime, motor & VFD support' },
              { href: '/industries/hospitals-healthcare', icon: '🏥', name: 'Hospitals & Healthcare', tag: 'Critical-care backup, NEMA-compliant incineration' },
              { href: '/industries/banks-financial', icon: '🏦', name: 'Telecom & Financial', tag: 'Branch UPS, data-room cooling, ATM uptime' },
              { href: '/industries/real-estate', icon: '🏢', name: 'Commercial Buildings', tag: 'BMS-ready gensets, solar PV, fuel management' },
              { href: '/industries/hotels-hospitality', icon: '🏨', name: 'Hotels & Hospitality', tag: 'Silent canopies, HVAC, hot-water automation' },
              { href: '/industries/schools-universities', icon: '🎓', name: 'Schools & Campuses', tag: 'Hostel solar, lab UPS, lecture-hall cooling' },
              { href: '/industries/flower-farms', icon: '🌸', name: 'Agribusiness & Farms', tag: 'Borehole pumping, cold-room, irrigation power' },
              { href: '/industries/government-ngo', icon: '🏛️', name: 'Government & NGO', tag: 'Tendered installs, training, regulatory reporting' },
              { href: '/industries', icon: '🚧', name: 'Construction & Sites', tag: 'Rental gensets, distribution, fabrication' },
              { href: '/industries', icon: '🔋', name: 'Data Centres', tag: 'Online UPS, N+1 backup, power quality' },
            ].map((i) => (
              <Link
                key={i.name}
                href={i.href}
                className="group block p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-cyan-500/50 hover:bg-slate-800/70 transition-colors"
              >
                <div className="text-2xl mb-2" aria-hidden="true">{i.icon}</div>
                <div className="text-sm font-semibold text-white group-hover:text-cyan-300">{i.name}</div>
                <div className="mt-1 text-xs text-slate-400 leading-snug">{i.tag}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we engage (Problem → Solution → Outcome) ─────────── */}
      <section className="px-4 py-12 sm:py-14 bg-slate-900/30 border-b border-slate-800/60" aria-labelledby="engagement-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold mb-2">How we engage</p>
            <h2 id="engagement-heading" className="text-2xl sm:text-3xl font-bold">From problem to outcome &mdash; engineered, not improvised</h2>
          </div>
          <ol className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Audit & specify',
                problem: 'You have downtime, an undersized system, a failed audit or a new build to power.',
                action: 'Site survey, load study, single-line diagram, BOQ and lifecycle-cost comparison.',
                outcome: 'A defensible spec your board, insurer and regulator can sign off on.',
              },
              {
                step: '02',
                title: 'Install & commission',
                problem: 'Cheap installs cost more in 3 years than they save on day one.',
                action: 'Authorised Cummins/Voltka kit, IEC-grade panels, ATS, earthing, SPDs, full commissioning records.',
                outcome: '3-year warranty, 1-year free service and a complete documentation pack.',
              },
              {
                step: '03',
                title: 'Maintain & monitor',
                problem: 'Reactive call-outs are 4&times; more expensive than scheduled service.',
                action: 'SLA-backed planned maintenance, remote monitoring, fuel polishing, spare-parts cover.',
                outcome: 'Measured uptime &gt;98.7% &mdash; and a single accountable engineering partner.',
              },
            ].map((s) => (
              <li key={s.step} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-xs font-mono text-cyan-400">{s.step}</span>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                </div>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-rose-400/80">Problem</dt>
                    <dd className="text-slate-300">{s.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-cyan-400/80">What we do</dt>
                    <dd className="text-slate-300">{s.action}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-emerald-400/80">Outcome</dt>
                    <dd className="text-slate-300" dangerouslySetInnerHTML={{ __html: s.outcome }} />
                  </div>
                </dl>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/case-studies" className="px-5 py-2.5 bg-slate-800 text-slate-100 text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
              See real project outcomes →
            </Link>
            <Link href="/booking" className="px-5 py-2.5 bg-cyan-500 text-black text-sm font-semibold rounded-lg hover:bg-cyan-400 transition-colors">
              Book a site audit
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sticky category jumplinks ─────────────────────────────── */}
      <nav
        aria-label="Service categories"
        className="px-4 py-3 sticky top-16 lg:top-[72px] z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/60"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {ORDERED_CATEGORIES.map((cat) => {
            const count = ALL_SERVICES.filter(
              (s) => s.category === cat.id,
            ).length;
            return (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-slate-800 text-slate-300 hover:bg-cyan-500 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="opacity-70">({count})</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* ── Category sections — every sub-service under its parent ── */}
      {ORDERED_CATEGORIES.map((cat) => {
        const services = ALL_SERVICES.filter((s) => s.category === cat.id);
        if (services.length === 0) return null;
        const meta = CATEGORY_META[cat.id];
        return (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            className="px-4 py-12 scroll-mt-32"
          >
            <div className="max-w-7xl mx-auto">
              <div
                className={`mb-6 p-5 rounded-2xl border bg-gradient-to-r ${meta?.accent ?? 'from-slate-800/40 to-slate-900/40 border-slate-700/40'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold">{cat.name}</h2>
                  <span className="ml-auto text-xs px-2 py-1 bg-slate-900/50 rounded-full text-slate-300">
                    {services.length}{' '}
                    {services.length === 1 ? 'service' : 'services'}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-300/90">
                  {meta?.tagline}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {services.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Featured: Cummins 3-Year Warranty ──────────────────────── */}
      <section className="px-4 py-14 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-y border-amber-500/20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-medium mb-3">
              Featured
            </span>
            <h2 className="text-3xl font-bold mb-3">
              Cummins Generators with{' '}
              <span className="text-amber-400">3-Year Warranty</span>
            </h2>
            <p className="text-slate-300 mb-5">
              Authorised Cummins dealer. Premium 10 kVA – 2000 kVA generators,
              professional installation, genuine parts, 24/7 support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/services/cummins-generators"
                className="px-5 py-2.5 bg-amber-500 text-black text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
              >
                View Cummins Range
              </Link>
              <a
                href={`tel:${BUSINESS_CONTACT.phoneIntl}`}
                className="px-5 py-2.5 border border-amber-500 text-amber-400 text-sm font-semibold rounded-lg hover:bg-amber-500/10 transition-colors"
              >
                Get a quote
              </a>
            </div>
          </div>
          <div className="aspect-video bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl border border-amber-500/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl mb-2">⚡</div>
              <div className="text-5xl font-bold text-amber-400">3</div>
              <div className="text-lg font-semibold">Year Warranty</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA strip ──────────────────────────────────────────────── */}
      <section className="px-4 py-12 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Ready to get started?
          </h2>
          <p className="text-slate-300 mb-6">
            Free consultation and quote. We respond within minutes on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={`tel:${BUSINESS_CONTACT.phoneIntl}`}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-shadow"
            >
              📞 {BUSINESS_CONTACT.phoneDisplay}
            </a>
            <a
              href={BUSINESS_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              💬 WhatsApp
            </a>
            <a
              href={`mailto:${BUSINESS_CONTACT.email}`}
              className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
            >
              ✉ Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
