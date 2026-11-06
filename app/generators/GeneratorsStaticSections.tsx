/**
 * Static sections of /generators, rendered on the SERVER (2026-11-06).
 *
 * These eight sections have no state, effects or handlers. While they lived
 * inside the 'use client' page, React had to download and hydrate them in the
 * browser, which Lighthouse measured as 1.3 s of blocking time on a phone.
 * Moved here verbatim; app/generators/page.tsx renders them and passes them to
 * the client page (GeneratorsPageClient.tsx) as ready-made nodes, so the HTML
 * is unchanged.
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { GENERATOR_SIZES } from '@/lib/products/generatorSizes';
import { GENERATOR_BRANDS } from '@/lib/data/generator-brands';
import {
  VOLTKA_CONFIRMED_PRICES,
  VOLTKA_PRICE_BASIS,
  VOLTKA_PRICES_AS_OF_LABEL,
  confirmedBoundsFor,
  kesMillions,
} from '@/lib/pricing/voltkaConfirmedPrices';

const GENERATOR_HUB_SECTIONS = [
  {
    id: 'new-generators',
    title: 'New Generators',
    icon: '⚡',
    href: '#new-generators',
    color: 'amber',
    description: 'Cummins & Voltka - 10kVA to 3000kVA',
    badge: 'HOT'
  },
  {
    id: 'used-generators',
    title: 'Used Generators',
    icon: '🔄',
    href: '/generators/used',
    color: 'green',
    description: 'Certified pre-owned with warranty'
  },
  {
    id: 'rental',
    title: 'Rental & Leasing',
    icon: '📅',
    href: '/generators/rental',
    color: 'blue',
    description: 'Short & long-term power solutions'
  },
  {
    id: 'spare-parts',
    title: 'Spare Parts',
    icon: '🔧',
    href: '/generators/spare-parts',
    color: 'orange',
    description: '2000+ OEM & aftermarket parts'
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    icon: '🛠️',
    href: '/generators/maintenance',
    color: 'cyan',
    description: 'Scheduled & emergency service'
  },
  {
    id: 'installation',
    title: 'Installation',
    icon: '🏗️',
    href: '/generators/installation',
    color: 'purple',
    description: 'Professional eight-stage installation and commissioning'
  },
  // Workshop Repairs & Fabrication — added 2026-07-21 (owner brief). Placed
  // alongside the existing service cards; nothing was removed or reordered.
  {
    id: 'workshop-services',
    title: 'Workshop Repairs & Fabrication',
    icon: '🏭',
    href: '/generators/workshop-services',
    color: 'amber',
    description: 'Radiators, starters, alternators, injectors, turbos, engine overhauls, UPS, pumps, canopies, tanks & fabrication'
  },
  {
    id: 'ai-diagnostic',
    title: 'Visual Fault Checklist',
    icon: '👀',
    href: '#ai-diagnostic',
    color: 'pink',
    description: 'Tick what you can see and get the matching diagnostic guides',
    badge: 'Free'
  },
  {
    id: 'maintenance-hub',
    title: 'Maintenance Hub',
    icon: '📊',
    href: '/maintenance-hub/generators',
    color: 'red',
    description: 'Engine Room Command Center'
  },
];

export const GeneratorBibleHub = () => {
  return (
    <section id="bible-hub" className="py-16 bg-gradient-to-b from-black via-slate-900/50 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-4">
            📖 The Complete Generator Resource
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bible of Generators
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need - from sales to service, spare parts to AI diagnostics.
            Your complete generator resource in Kenya.
          </p>
        </div>

        {/* Quick Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {GENERATOR_HUB_SECTIONS.map((section, index) => (
            <a
              key={section.id}
              href={section.href}
              
              
              
              
              
              className={`relative group p-5 rounded-2xl bg-gradient-to-br from-${section.color}-500/10 to-${section.color}-600/5 border border-${section.color}-500/20 hover:border-${section.color}-500/50 transition-all`}
            >
              {section.badge && (
                <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold rounded-full ${section.badge === 'Free' ? 'bg-pink-500' : 'bg-red-500'} text-white`}>
                  {section.badge}
                </span>
              )}
              <div className="text-3xl mb-3">{section.icon}</div>
              <h3 className="text-white font-semibold mb-1">{section.title}</h3>
              <p className="text-gray-400 text-xs">{section.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export const GeneratorLeasingSection = () => {
  const leasingPlans = [
    { duration: '6 Months', discount: '5%', ideal: 'Construction projects' },
    { duration: '1 Year', discount: '10%', ideal: 'Business expansion' },
    { duration: '2 Years', discount: '15%', ideal: 'Established operations' },
    { duration: '3+ Years', discount: '20%', ideal: 'Lease-to-own option' },
  ];

  return (
    <section id="leasing" className="py-20 bg-gradient-to-b from-black via-emerald-900/10 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
            💰 Flexible Power Solutions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generator Leasing Programs
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't want to buy? Lease a generator with maintenance included.
            Flexible terms from 6 months to lease-to-own options.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {leasingPlans.map((plan, index) => (
            <div
              key={plan.duration}
              
              
              
              
              className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-6 border border-emerald-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.duration}</h3>
              <div className="text-3xl font-bold text-emerald-400 mb-2">{plan.discount} OFF</div>
              <p className="text-gray-400 text-sm">Ideal for: {plan.ideal}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-4">Leasing Benefits</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="text-white font-semibold">No Capital Outlay</h4>
                <p className="text-gray-400 text-sm">Preserve your cash flow for core business</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔧</span>
              <div>
                <h4 className="text-white font-semibold">Maintenance Included</h4>
                <p className="text-gray-400 text-sm">All service and repairs covered</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="text-white font-semibold">Upgrade Anytime</h4>
                <p className="text-gray-400 text-sm">Scale up or down as needed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/contact?subject=leasing" className="cta-button-primary">
            Get Leasing Quote →
          </a>
        </div>
      </div>
    </section>
  );
};

export const TransparentPricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-black via-amber-900/10 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-4">
            Published prices
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generator Prices in Kenya 2026
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {VOLTKA_PRICE_BASIS}
          </p>
        </div>

        <div className="mb-10 p-6 md:p-8 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 to-orange-500/5">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full mb-3">
              VOLTKA — NEW, OUR OWN BRAND
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              VOLTKA prices, {VOLTKA_CONFIRMED_PRICES[0].kva}–{VOLTKA_CONFIRMED_PRICES[VOLTKA_CONFIRMED_PRICES.length - 1].kva} kVA
            </h3>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Open frame and silent (canopied) sets, prime rated. Confirmed {VOLTKA_PRICES_AS_OF_LABEL}.
              Other sizes from 10 kVA to 3000 kVA: request the current price.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {VOLTKA_CONFIRMED_PRICES.map((p) => (
              <div key={p.kva} className="rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-center">
                <span className="block font-bold text-white">{p.kva} kVA</span>
                <span className="mt-1 block text-xs text-gray-300">
                  {p.openKes ? `Open ${kesMillions(p.openKes)}` : 'Silent only'}
                </span>
                {p.silentKes && (
                  <span className="block text-xs text-gray-300">Silent {kesMillions(p.silentKes)}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href="/contact?generator=VOLTKA"
              className="inline-block px-6 py-2.5 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-all"
            >
              Get my VOLTKA quote
            </a>
          </div>
        </div>

        {/*
          Per-size pages, added 2026-08-26. Buyers search "30 kva generator
          price in kenya", not "generator range". Each tile shows the confirmed
          price, or says the price is on request.
        */}
        <div className="mb-10">
          <h3 className="text-center text-lg font-semibold text-white mb-2">By exact size</h3>
          <p className="text-center text-gray-400 text-sm mb-6">
            What each size runs, how site altitude changes the answer, and the price where we publish one.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {GENERATOR_SIZES.map((g) => {
              const b = confirmedBoundsFor(g.kva);
              return (
                <a
                  key={g.slug}
                  href={`/generators/sizes/${g.slug}`}
                  className="block rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-center transition hover:border-amber-400/40"
                >
                  <span className="block font-bold text-white">{g.kva} kVA</span>
                  <span className="mt-1 block text-xs text-gray-400">
                    {b
                      ? b.high > b.low
                        ? `${kesMillions(b.low)} – ${kesMillions(b.high).replace('KES ', '')}`
                        : kesMillions(b.low)
                      : 'Price on request'}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm space-y-1">
          <p>* Prices are for the generator only, ex-warehouse, excluding VAT (16%).</p>
          <p>* Delivery, installation, ATS, cabling, civil works and commissioning are quoted separately.</p>
          <p>* Used Cummins, Perkins and Caterpillar sets are priced per machine.</p>
        </div>
      </div>
    </section>
  );
};

export const BrandComparisonTable = () => {
  const brands = [
    { name: 'Cummins', origin: 'USA', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐⭐', parts: '⭐⭐⭐⭐⭐', price: '$$$$', best: 'Reliability & support' },
    { name: 'Perkins', origin: 'UK', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐', parts: '⭐⭐⭐⭐⭐', price: '$$$', best: 'Value for money' },
    { name: 'Caterpillar', origin: 'USA', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐', parts: '⭐⭐⭐⭐', price: '$$$$$', best: 'Heavy industrial' },
    { name: 'FG Wilson', origin: 'UK', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐', parts: '⭐⭐⭐⭐', price: '$$$', best: 'Commercial use' },
    { name: 'Atlas Copco', origin: 'Sweden', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐⭐', parts: '⭐⭐⭐', price: '$$$$', best: 'Quiet operation' },
    { name: 'Voltka', origin: 'China/Cummins', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐', parts: '⭐⭐⭐⭐⭐', price: '$$', best: 'Budget + quality' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-4">
            📊 Compare Brands
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generator Brand Comparison
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We service all brands. Here's how they compare:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-700 bg-slate-900/50">
                <th className="text-left p-4 text-amber-400">Brand</th>
                <th className="text-left p-4 text-gray-400">Origin</th>
                <th className="text-left p-4 text-gray-400">Warranty</th>
                <th className="text-left p-4 text-gray-400">Fuel Efficiency</th>
                <th className="text-left p-4 text-gray-400">Parts Availability</th>
                <th className="text-left p-4 text-gray-400">Price Range</th>
                <th className="text-left p-4 text-gray-400">Best For</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand, index) => (
                <tr
                  key={brand.name}
                  
                  
                  
                  
                  className="border-b border-gray-800 hover:bg-slate-900/50"
                >
                  <td className="p-4 font-semibold text-white">{brand.name}</td>
                  <td className="p-4 text-gray-400">{brand.origin}</td>
                  <td className="p-4 text-green-400">{brand.warranty}</td>
                  <td className="p-4">{brand.fuelEff}</td>
                  <td className="p-4">{brand.parts}</td>
                  <td className="p-4 text-amber-400">{brand.price}</td>
                  <td className="p-4 text-gray-300">{brand.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Not sure which brand? <a href="/contact" className="text-amber-400 hover:underline">Talk to our engineers</a> for a free recommendation.
        </p>

        {/*
          EVERY BRAND WE HAVE A PAGE FOR, LINKED — added 2026-09-20.

          The table above names six brands as plain text and links none of
          them. Measured on the live site that day: this hub linked 13 of 13
          size pages and 0 of 17 brand pages. The only route into
          /brands/<slug> was the /brands index, itself linked once from the
          homepage, plus /site-directory — so seventeen commercial pages sat
          two clicks down a single path, off the one hub whose whole subject
          they are.

          They are worth linking on their merits rather than for the link:
          measured the same day, the brand pages are 47-55% alike at their
          closest, which is genuine per-brand content, not one template with
          the name swapped.

          Driven from GENERATOR_BRANDS so the list cannot drift from the
          pages that exist — every slug here is a route app/brands/[brand]
          builds. Three of the six in the table (FG Wilson, Atlas Copco,
          Voltka) have no brand page, which is why the table itself is left
          as text rather than half-linked.
        */}
        {/*
          THE BRAND WE ACTUALLY SELL GOES ABOVE THE ONES WE SERVICE.

          Owner, 2026-09-21: EmersonEIMS sells VOLTKA, its own Cummins-powered
          brand. Every other make below it is maintenance, repairs and parts.
          The list underneath was linking seventeen brands we service while the
          one we sell had no page at all, which is the wrong way round on the
          hub where a buyer decides.
        */}
        <div className="mt-14 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-7 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold">
            The generators we sell
          </p>
          <h3 className="mt-3 text-2xl font-bold text-white">VOLTKA — our own brand, Cummins-powered</h3>
          <p className="mx-auto mt-3 max-w-2xl text-gray-400 leading-relaxed">
            New sets, open frame or silent. Published prices for 100–750 kVA; other sizes on request.
            Delivered and commissioned across all 47 counties.
          </p>
          <Link
            href="/voltka"
            className="mt-6 inline-block rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 font-bold text-black transition-all hover:shadow-lg hover:shadow-amber-500/30"
          >
            See the VOLTKA range
          </Link>
        </div>

        <nav aria-label="Generator brands" className="mt-14 border-t border-gray-800 pt-10">
          <h3 className="text-center text-sm uppercase tracking-[0.2em] text-amber-400 font-semibold mb-6">
            Brands we supply, service and stock parts for
          </h3>
          <ul className="flex flex-wrap justify-center gap-3">
            {GENERATOR_BRANDS.map(brand => (
              <li key={brand.slug}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="inline-block rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2 text-sm text-gray-300 transition-colors hover:border-amber-500/60 hover:text-amber-300"
                >
                  {brand.name} generators
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export const DownloadsSection = () => {
  const downloads = [
    { name: 'Cummins Generator Catalog 2026', type: 'PDF', size: 'Sent on request', icon: '📕' },
    { name: 'VOLTKA price list (November 2026)', type: 'PDF', size: 'Sent on request', icon: '💰' },
    { name: 'Generator Sizing Guide', type: 'PDF', size: 'Sent on request', icon: '📐' },
    { name: 'Maintenance Schedule Template', type: 'PDF', size: 'Sent on request', icon: '🔧' },
    { name: 'ATS Installation Manual', type: 'PDF', size: 'Sent on request', icon: '🔀' },
    { name: 'Warranty Terms & Conditions', type: 'PDF', size: 'Sent on request', icon: '🛡️' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-5xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-4">
            📄 Free Downloads
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Brochures & Spec Sheets
          </h2>
          <p className="text-xl text-gray-400">
            Download detailed information for your planning
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {downloads.map((doc, index) => (
            <a
              key={doc.name}
              href="/contact?download=brochure"
              
              
              
              
              className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all group"
            >
              <span className="text-3xl">{doc.icon}</span>
              <div className="flex-1">
                <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">{doc.name}</p>
                <p className="text-gray-500 text-sm">{doc.type} • {doc.size}</p>
              </div>
              <span className="text-blue-400 group-hover:translate-x-1 transition-transform">↓</span>
            </a>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          * Enter your email to receive download links. We respect your privacy.
        </p>
      </div>
    </section>
  );
};

export const WhyChooseUs = () => {
  const reasons = [
    {
      icon: '🏆',
      title: 'Cummins Specialist',
      // "Factory-trained" removed here and in the two places below. The claim
      // has no evidence behind it on file (see app/why-emersoneims/page.tsx),
      // and an unverifiable badge is worth less than a specific one. If
      // training certificates DO exist, this is worth restoring with the
      // certificate named — say so and it goes back.
      description: 'Technicians who work these platforms daily. Genuine parts in stock. Multi-brand capability across Cummins, Perkins, Caterpillar and FG Wilson.',
      highlight: 'EXPERT'
    },
    {
      icon: '⚡',
      title: 'Nationwide Emergency Support',
      /*
       * "Technicians stationed across all 47 counties" was removed 2026-08-31.
       * The nationwide reach is real — the mobile workshop does travel to all
       * 47 counties — but "stationed" asserts staff permanently based in each
       * one, which would mean 47 depots we do not have. The true version is
       * stronger anyway, because it is the one we can honour on the phone.
       */
      description: 'Nationwide mobile service, coordinated from our Embakasi workshop in Nairobi. Response is mobilised during business hours, with remote site coordination by phone and WhatsApp.',
      highlight: 'NATIONWIDE'
    },
    /*
     * A "Price Match Guarantee — found a lower price? We'll match it and give
     * you 5% extra discount. No questions asked." card stood here. Nothing
     * defines who approves a match, what proof is required, which products
     * qualify or who authorises 5% off a quoted price, so it was a binding
     * commercial undertaking with no terms behind it and no way to honour it
     * consistently. Replaced with the part that is real and checkable.
     */
    {
      icon: '💰',
      title: 'Priced Against the Load',
      description: 'We size the set to your measured load before quoting, so you are not paying for kVA you will never draw. The quotation itemises the set, ATS, cabling, installation and commissioning separately.',
      highlight: 'NO OVERSIZING'
    },
    {
      icon: '🔧',
      title: '11+ Years Track Record',
      description: 'Our senior technicians have serviced generators across Kenya since 2011, on Cummins, Perkins, Caterpillar and 10+ other brands.',
      highlight: 'PROVEN EXPERTISE'
    },
    {
      icon: '📦',
      /*
       * Was: "2,000+ parts in stock in our Nairobi warehouse. Most parts
       * delivered within 4 hours." Both halves were unevidenced. No inventory
       * system in this repository produces a stock count, so "2,000+ in stock"
       * would be wrong the first time a shelf emptied; and no delivery matrix
       * defines a four-hour window, which cannot hold for an up-country site
       * regardless. The parts CATALOGUE is real and searchable on this site —
       * that is what is claimed now, with availability confirmed per order.
       */
      title: 'Parts Sourced and Supplied',
      description: 'Filters, belts, sensors, AVRs, controllers, starters, alternators, and fuel and cooling components. Availability and delivery time are confirmed against your engine and serial number when you order.',
      highlight: 'PARTS SUPPLY'
    },
    {
      icon: '🛡️',
      title: '2-Year Warranty',
      description: 'Cover on new generators includes parts, labour and emergency service. The term and its conditions are stated in your written quotation.',
      highlight: 'PEACE OF MIND'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why <span className="text-amber-400">Leading Businesses</span> Choose Us
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We don't just sell generators. We deliver reliability, peace of mind, and a partnership that lasts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              
              
              
              
              
              className="relative group p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-slate-800 hover:border-amber-500/50 transition-all"
            >
              {/* Highlight Badge */}
              <span className="absolute -top-3 right-4 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                {reason.highlight}
              </span>

              <span className="text-4xl block mb-4">{reason.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
              <p className="text-gray-400 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const GuaranteeSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-500/10 via-black to-emerald-500/10 border-y border-emerald-500/20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <span className="text-5xl">🛡️</span>
          </div>

          {/*
            REWRITTEN 2026-08-29. The section is kept — its design, its slot and
            its purpose are unchanged — but every promise in it is now one the
            site can stand behind. What was here, and why each item went:

              "Iron-Clad Guarantee" / "one of the strongest guarantees
                available in Kenya" — a comparative superlative about the
                Kenyan market that nothing evidences.
              "30-Day Money-Back Guarantee — full refund, no questions asked"
                — a binding refund undertaking that appears nowhere else on
                this site and was never confirmed as a real policy. A refund
                promise is contractual; publishing one we have not agreed is
                the most exposed thing on this page.
              "Lifetime Technical Support ... forever" — an unlimited,
                perpetual commitment with no stated boundary.
              "If your generator doesn't perform as promised, we'll fix it or
                replace it. Period." — John Emerson, Founder — an invented
                quotation attributed to an invented person. "John Emerson"
                appears nowhere else in this codebase; the business is
                EmersonEIMS and no such founder is named anywhere on the site.

            The three cards below are each backed elsewhere: the two-year
            warranty is owner-confirmed and now published site-wide, 24/7
            emergency response is stated across the site, and the
            all-47-counties mobile workshop is the owner's own description of
            the capability.
          */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What you get <span className="text-emerald-400">in writing</span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Every set we supply is quoted, installed and commissioned on these terms:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/*
              The two-year term is KEPT here and is owner-confirmed, but it is
              now SCOPED. This card sits under "every set we supply", i.e. new
              sets, which is what that confirmation covered. The same figure was
              additionally published as a blanket site-wide badge — homepage
              trust strip, metadata and JSON-LD — where it also covered used and
              refurbished equipment and repairs, for which it cannot hold. Those
              blanket instances were removed 2026-08-31; see
              lib/commercial/policy.ts. The qualifier below is what was missing,
              not the number.
            */}
            <div className="p-6 rounded-xl bg-black/50 border border-emerald-500/30">
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">2-Year</h3>
              <p className="text-white font-semibold">Warranty on New Sets</p>
              <p className="text-gray-400 text-sm mt-2">Engine, alternator and control system. Used and refurbished sets carry different terms, stated in your quotation.</p>
            </div>
            <div className="p-6 rounded-xl bg-black/50 border border-emerald-500/30">
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">24/7</h3>
              <p className="text-white font-semibold">Emergency Response</p>
              <p className="text-gray-400 text-sm mt-2">Breakdowns attended day or night</p>
            </div>
            <div className="p-6 rounded-xl bg-black/50 border border-emerald-500/30">
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">47</h3>
              <p className="text-white font-semibold">Counties Served</p>
              <p className="text-gray-400 text-sm mt-2">Mobile workshop travels to your site</p>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            Commissioning includes the changeover panel, wired and tested on load.
          </p>
        </div>
      </div>
    </section>
  );
};

export const UrgencySection = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-red-500/20 via-black to-red-500/20 border-y border-red-500/30">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-400 font-bold uppercase tracking-wider text-sm">24/7 Emergency Line</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Generator down? <span className="text-red-400">Call now</span>
            </h3>
            <p className="text-gray-400">Breakdowns attended day or night, in all 47 counties.</p>
          </div>

          <a
            href="tel:+254768860665"
            className="text-2xl md:text-3xl font-bold text-white hover:text-red-300 transition-colors"
          >
            +254 768 860 665
          </a>

          <a
            href="/contact?type=emergency"
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30"
          >
            Request a callout &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};

export interface GeneratorStaticSections {
  GeneratorBibleHub: ReactNode;
  UrgencySection: ReactNode;
  TransparentPricing: ReactNode;
  WhyChooseUs: ReactNode;
  BrandComparisonTable: ReactNode;
  GeneratorLeasingSection: ReactNode;
  DownloadsSection: ReactNode;
  GuaranteeSection: ReactNode;
}
