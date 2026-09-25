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
import RepairCentreCallout from '@/components/repair-centre/RepairCentreCallout';
import MobileWorkshopBand from '@/components/trust/MobileWorkshopBand';
import ServiceDivisions from '@/components/services/ServiceDivisions';
import { SERVICE_DIVISIONS } from '@/lib/services/serviceDivisions';
import dynamic from 'next/dynamic';
import { TRUST_BADGES, BUSINESS_CONTACT } from '@/lib/services/allServices';
// Below-the-fold WebGL galaxy gallery. Code-split out of the page entry bundle.
// Server component, so ssr stays on (default) — its grid fallback renders for
// crawlers/no-WebGL; only the client chunk is deferred.
const OrbitalGallery = dynamic(() => import('@/components/galleries/OrbitalGallery'));
const ServiceCTASection = dynamic(() => import('@/components/cta/ServiceCTASection'));

// Distinct image per service discipline (no recycling across pages) — drawn
// from the freshly curated Desktop field photography + graded marketing set.
const SERVICES_ORBIT = [
  { src: '/images/desktop/generators/cummins-teal-canopy.jpg', title: 'Cummins & Voltka Generators', subtitle: 'Sales · Install · ATS · 10–2000 kVA' },
  { src: '/images/solar power farms.png', title: 'Solar PV & Hybrid', subtitle: 'Grid-tie, off-grid & storage' },
  { src: '/images/ups-power-protection-system.png', title: 'UPS Power Protection', subtitle: 'Enterprise N+1 systems' },
  { src: '/images/desktop/motor/rewinding-1.png', title: 'Motor Rewinding', subtitle: 'All sizes · load tested' },
  { src: '/images/desktop/changeovers/changeover-board-1.jpg', title: 'Changeovers & Distribution', subtitle: 'ATS & IEC-grade boards' },
  { src: '/images/desktop/hvac/air-conditioner-1.png', title: 'Air Conditioning & HVAC', subtitle: 'Split, VRF & cold rooms' },
  { src: '/images/desktop/borehole/drilling-1.png', title: 'Borehole Drilling', subtitle: 'Survey to commissioning' },
  { src: '/images/desktop/borehole/pumps-1.png', title: 'Borehole Pumps', subtitle: 'Solar-ready submersibles' },
  { src: '/images/desktop/incinerator/incinerator-1.png', title: 'Incinerators', subtitle: 'NEMA-compliant, medical-grade' },
  { src: '/images/desktop/waterheaters/heater-1.png', title: 'Water Heating', subtitle: 'Solar & commercial systems' },
  { src: '/images/desktop/overhaul/engine-liner-overhaul.jpg', title: 'Generator Overhauls', subtitle: 'Factory-spec engine rebuilds' },
  { src: '/images/steel-fabrication-workshop.png', title: 'Steel Fabrication', subtitle: 'Canopies, frames & enclosures' },
];

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
                B2B Engineering Services · {SERVICE_DIVISIONS.length} divisions · 100+ capabilities
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
                systems, HVAC, boreholes and incinerators &mdash; backed by{' '}
                <span className="text-amber-400 font-semibold">warranty terms set out in your quotation</span>,
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
                {/* No truncate: these four lines are the trust claims a buyer
                    reads before calling, and on a narrow screen the clip cut
                    "Round-the-clock emergency service" mid-word. min-w-0 on the
                    wrapper already lets them wrap without disturbing the row. */}
                <div className="text-sm font-semibold text-white">
                  {b.title}
                </div>
                <div className="text-xs text-slate-400">
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
              // Was /industries/real-estate — not a real slug, served "Industry
              // Not Found" at HTTP 200. /industries/commercial-property is a
              // published page and matches this card exactly.
              { href: '/industries/commercial-property', icon: '🏢', name: 'Commercial Buildings', tag: 'BMS-ready gensets, solar PV, fuel management' },
              { href: '/industries/hotels-hospitality', icon: '🏨', name: 'Hotels & Hospitality', tag: 'Silent canopies, HVAC, hot-water automation' },
              { href: '/industries/schools-universities', icon: '🎓', name: 'Schools & Campuses', tag: 'Hostel solar, lab UPS, lecture-hall cooling' },
              { href: '/industries/flower-farms', icon: '🌸', name: 'Agribusiness & Farms', tag: 'Borehole pumping, cold-room, irrigation power' },
              // Was /industries/government-ngo (singular) — the registry slug is
              // 'government-ngos'. The singular form soft-404'd at HTTP 200.
              { href: '/industries/government-ngos', icon: '🏛️', name: 'Government & NGO', tag: 'Tendered installs, training, regulatory reporting' },
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
                action: 'Cummins/Voltka generators, IEC-grade panels, ATS, earthing, SPDs, full commissioning records. Specialist installation.',
                outcome: 'Warranty and service-package terms in writing, with a complete documentation pack.',
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

      {/* ── Universe gallery: every service, rotating like a galaxy ── */}
      <OrbitalGallery
        items={SERVICES_ORBIT}
        eyebrow="Every Service We Deliver — In Orbit"
        heading="One Universe of Engineering"
        ctaHref="#cat-power"
        ctaLabel="Browse All Services"
      />

      {/*
        ── THE TWELVE DIVISIONS ──────────────────────────────────────
        Replaces the category grid that stood here. That grid grouped the
        eleven ALL_SERVICES entries by the 'category' union — 'power',
        'renewable', 'waste' — which is a field in a TypeScript interface, not
        a way a buyer describes their problem. It also showed only what was in
        ALL_SERVICES, so the repair centre's fifteen hubs, the eleven
        maintenance hubs, the parts marketplace and the workshop were absent
        from the page that is supposed to be the index of everything.

        The divisions carry 76 links across twelve trades, all of them routes
        that exist, all server-rendered, and every one of the eleven service
        pages is reachable from one. See lib/services/serviceDivisions.ts.
      */}
      <ServiceDivisions />

      {/* ── Featured: Cummins 2-Year Warranty ──────────────────────── */}
      <section className="px-4 py-14 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-y border-amber-500/20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-medium mb-3">
              Featured
            </span>
            <h2 className="text-3xl font-bold mb-3">
              Cummins Generators with{' '}
              <span className="text-amber-400">2-Year Warranty</span>
            </h2>
            <p className="text-slate-300 mb-5">
              Cummins specialist. Premium 10 kVA – 2000 kVA generators,
              professional installation, genuine parts, 24/7 expert support.
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
              <div className="text-5xl font-bold text-amber-400">2</div>
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

      {/* Quick Service CTA */}
      <ServiceCTASection
        title="What Service Do You Need?"
        subtitle="Generators, Solar, UPS, Maintenance, Installation, Fabrication, and more — pick your service and get a quote within 2 hours."
        primaryService="General Inquiry"
        primaryLabel="Get Started"
        secondaryServices={[
          { label: 'Generator Quote', service: 'Generator Quote' },
          { label: 'Solar Design', service: 'Solar Design' },
          { label: 'UPS Solutions', service: 'UPS Solutions' },
        ]}
        backgroundColor="from-slate-900/50 to-amber-900/50"
        icon="🎯"
      />

      {/* Nationwide mobile workshop — owner-confirmed capability that was
          effectively invisible on the site before 2026-07-20. Placed after the
          service list so a visitor who has just read WHAT we do immediately
          learns WHERE we can do it. */}
      {/* Funnel into the Repair Centre from the services index. A visitor who
          has just read what we do is the right reader for the guides on how
          the faults are actually diagnosed. */}
      <RepairCentreCallout
        heading="Want to understand the fault before you call us?"
        body="Our engineers have published the diagnostic sequences they use on site across 15 equipment categories — generators, inverters, UPS, solar, motors, pumps, drives and control boards. Free to read, no sign-up."
      />

      <MobileWorkshopBand />

      {/*
        The capability index that stood here listed 33 phrases across 22
        destinations. Every one of them is now inside a division above, and the
        five it had that the divisions lacked — alternator rewinding, starter
        motors, radiator recoring, injector pumps, turbochargers — were folded
        into division 01 rather than dropped. Rendering both would have put the
        same links on the same page twice.
      */}
    </div>
  );
}
