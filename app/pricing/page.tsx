import Link from 'next/link';
import { Metadata } from 'next';
import { PRICE_GUIDES } from '@/lib/pricing/publishedPrices';
import QuickInquiryForm from '@/components/forms/QuickInquiryForm';

export const metadata: Metadata = {
  /*
   * Title rewritten 2026-08-25. The previous one was
   *   "EmersonEIMS Service Pricing | Transparent Costs in KES | Kenya"
   * and the root layout appends "| EmersonEIMS Kenya", so the served title ran
   * 82 characters and carried the brand three times over — well past what a
   * SERP displays, with the useful words at the truncated end. This one leads
   * with the words a buyer searches and lets the template supply the brand once.
   */
  title: 'Service Prices & Costs in Kenya (2026)',
  description:
    'What our work costs in Kenya: generator installation and servicing, solar, UPS, borehole pumps, motor rewinding and incinerators — published ranges in KES, no hidden fees.',
  alternates: {
    canonical: 'https://www.emersoneims.com/pricing',
  },
};

export default function PricingPage() {
  const services = [
    {
      category: 'Diesel Generators',
      items: [
        { service: 'Installation (10-100 kVA)', cost: 'KES 150K - 500K', timeframe: '3-7 days' },
        { service: 'Installation (100-500 kVA)', cost: 'KES 500K - 2M', timeframe: '1-2 weeks' },
        { service: 'Regular maintenance (per visit)', cost: 'KES 25K - 100K', timeframe: '2-4 hours' },
        { service: 'Emergency repair call-out', cost: 'KES 50K - 200K', timeframe: 'Same day' },
        { service: 'Annual service package', cost: 'KES 100K - 400K', timeframe: 'Quarterly visits' },
      ],
    },
    {
      category: 'Solar Systems',
      items: [
        { service: 'Residential solar (3-5 kW)', cost: 'KES 400K - 800K', timeframe: '5-10 days' },
        { service: 'Commercial solar (10-50 kW)', cost: 'KES 2M - 8M', timeframe: '2-3 weeks' },
        { service: 'System diagnostics & optimization', cost: 'KES 20K - 50K', timeframe: '1-2 days' },
        { service: 'Panel cleaning & maintenance', cost: 'KES 15K - 50K', timeframe: '2-4 hours' },
        { service: 'ROI assessment & design', cost: 'KES 10K - 30K', timeframe: '1-2 days' },
      ],
    },
    {
      category: 'UPS & Backup Power',
      items: [
        { service: 'UPS installation (5-20 kVA)', cost: 'KES 200K - 600K', timeframe: '2-4 days' },
        { service: 'UPS installation (20-100 kVA)', cost: 'KES 800K - 3M', timeframe: '1-2 weeks' },
        { service: 'Battery testing & replacement', cost: 'KES 50K - 300K', timeframe: '1-3 days' },
        { service: 'Monthly UPS maintenance', cost: 'KES 20K - 80K', timeframe: '2-3 hours' },
        { service: 'Emergency UPS repair', cost: 'KES 40K - 150K', timeframe: 'Same day' },
      ],
    },
    {
      category: 'Controls & Automation',
      items: [
        { service: 'Control panel installation', cost: 'KES 100K - 400K', timeframe: '3-5 days' },
        { service: 'ATS (Auto Transfer Switch) setup', cost: 'KES 80K - 300K', timeframe: '2-4 days' },
        { service: 'Remote monitoring setup', cost: 'KES 50K - 200K', timeframe: '1-2 days' },
        { service: 'Controller configuration', cost: 'KES 40K - 100K', timeframe: '1 day' },
        { service: 'System testing & commissioning', cost: 'KES 50K - 150K', timeframe: '1-2 days' },
      ],
    },
    {
      category: 'Borehole & Water Systems',
      items: [
        { service: 'Pump installation (1-3 HP)', cost: 'KES 100K - 400K', timeframe: '2-3 days' },
        { service: 'Pump installation (5-10 HP)', cost: 'KES 400K - 1.2M', timeframe: '3-5 days' },
        { service: 'Water system diagnostics', cost: 'KES 30K - 80K', timeframe: '1-2 days' },
        { service: 'Pump maintenance & servicing', cost: 'KES 25K - 100K', timeframe: '2-4 hours' },
        { service: 'Predictive maintenance (AquaScan)', cost: 'KES 50K - 200K', timeframe: 'Ongoing' },
      ],
    },
    {
      category: 'AC & Climate Control',
      items: [
        { service: 'AC unit installation (2-3 ton)', cost: 'KES 150K - 400K', timeframe: '2-3 days' },
        { service: 'AC repair & diagnostics', cost: 'KES 40K - 150K', timeframe: '1 day' },
        { service: 'Refrigerant refill', cost: 'KES 30K - 80K', timeframe: '2-4 hours' },
        { service: 'Annual AC maintenance', cost: 'KES 40K - 100K', timeframe: '3-4 hours' },
        { service: 'Emergency AC repair', cost: 'KES 60K - 200K', timeframe: 'Same day' },
      ],
    },
    {
      category: 'Motors & Rewinding',
      items: [
        { service: 'Motor rewinding (5-15 HP)', cost: 'KES 50K - 150K', timeframe: '3-5 days' },
        { service: 'Motor rewinding (20-75 HP)', cost: 'KES 150K - 500K', timeframe: '5-7 days' },
        { service: 'Motor repair & testing', cost: 'KES 40K - 120K', timeframe: '2-4 days' },
        { service: 'Motor efficiency analysis', cost: 'KES 20K - 50K', timeframe: '1 day' },
      ],
    },
    {
      category: 'High-Voltage Systems',
      items: [
        { service: 'HV installation & commissioning', cost: 'KES 500K - 5M+', timeframe: '2-4 weeks' },
        { service: 'HV system maintenance', cost: 'KES 200K - 1M', timeframe: '1-2 weeks' },
        { service: 'Cable testing & diagnostics', cost: 'KES 100K - 300K', timeframe: '2-3 days' },
      ],
    },
    {
      category: 'Incinerators & Waste',
      items: [
        { service: 'Incinerator installation', cost: 'KES 300K - 2M', timeframe: '1-2 weeks' },
        { service: 'Incinerator maintenance & repair', cost: 'KES 50K - 300K', timeframe: '2-5 days' },
      ],
    },
    {
      category: 'Fabrication & Custom Work',
      items: [
        { service: 'Custom fabrication (per project)', cost: 'KES 100K - 1M+', timeframe: 'Variable' },
        { service: 'Equipment modifications', cost: 'KES 50K - 500K', timeframe: 'Variable' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Transparent</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">
              Service Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            No hidden fees. No surprise costs. Clear pricing for every service in Kenyan Shillings.
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            All prices are typical ranges based on scope of work. Your actual cost depends on specific requirements, location, and complexity. Get a personalized quote for your exact needs.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {services.map((service, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg p-8">
                <h2 className="text-3xl font-bold text-emerald-400 mb-8">{service.category}</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {service.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      <h3 className="text-white font-bold mb-3">{item.service}</h3>
                      <div className="space-y-2">
                        <p className="text-emerald-400 font-bold text-lg">{item.cost}</p>
                        <p className="text-gray-400 text-sm">Timeframe: {item.timeframe}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        Detailed price guides.
        Added 2026-08-25. This page prices the WORK — installation, servicing,
        call-outs. It has never priced the EQUIPMENT, and "how much is a 30 kVA
        generator" is the question buyers actually type. The guides below carry
        the per-unit figures already published on the service pages, on URLs a
        price search can reach. Nothing on this page was changed to add them.
      */}
      <section className="py-20 px-4 bg-black border-t border-emerald-500/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Detailed price guides</h2>
          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-12">
            The table above is the summary. These go line by line — what a generator costs by kVA,
            what a borehole costs per drilled metre, what a rewind costs by horsepower, and in each
            case what moves the price and what the figure leaves out.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {PRICE_GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/pricing/${g.slug}`}
                className="group p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg hover:border-emerald-500/50 transition-colors"
              >
                <h3 className="text-xl font-bold text-emerald-400 mb-3 group-hover:text-emerald-300">
                  {g.h1.charAt(0).toUpperCase() + g.h1.slice(1)}
                </h3>
                <p className="text-gray-300 text-sm mb-4">{g.description}</p>
                <p className="text-emerald-400 font-bold text-sm">
                  {/*
                    cardNote, not rows[0]. The drilling guide opens with a
                    KES 65,000 survey line, and "From KES 65,000" beside
                    "borehole drilling" reads as the price of a borehole.
                  */}
                  {g.cardNote ?? `From ${g.rows[0].price}`}
                  <span className="ml-2 font-normal text-gray-500">
                    · {g.rows.length} price points
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How Pricing Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">💰</span> Transparent Breakdown
              </h3>
              <p className="text-gray-300 text-sm">
                Every quote includes equipment cost, labor, travel, and support. No hidden markup.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span> Location Adjustments
              </h3>
              <p className="text-gray-300 text-sm">
                Nairobi pricing shown. Mombasa, Kisumu, and remote areas may have +10-20% travel adjustment.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">⏰</span> Scope Determines Cost
              </h3>
              <p className="text-gray-300 text-sm">
                Complex installations or difficult access may increase cost. We'll confirm before proceeding.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-500/20 rounded-lg">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Quotation Accuracy</h3>
            <p className="text-gray-300 mb-4">
              Any variation to a quoted price is agreed with you in writing before the work proceeds. You are not billed for a change you did not approve.
            </p>
            <p className="text-gray-400 text-sm">
              This applies to installations and major service work. Emergency call-outs are quoted separately.
            </p>
          </div>
        </div>
      </section>

      {/* Package Deals */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Save with Service Packages</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">Silver Package</h3>
              <p className="text-gray-300 mb-6">Best for small to medium facilities</p>
              <div className="space-y-3 mb-8">
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> Quarterly maintenance
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> 24-hour emergency response
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> 10% discount on repairs
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> Monthly monitoring reports
                </p>
              </div>
              <p className="text-emerald-400 font-bold text-lg mb-6">KES 120K - 300K/month</p>
              <Link href="/contact?type=package-silver" className="block w-full px-6 py-3 bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold rounded-lg text-center hover:bg-emerald-500/30">
                Get Silver Package
              </Link>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-emerald-500 rounded-lg ring-2 ring-emerald-500/30">
              <div className="mb-6 text-center">
                <span className="px-4 py-1 bg-emerald-500/30 text-emerald-400 text-sm font-bold rounded-full">MOST POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">Gold Package</h3>
              <p className="text-gray-300 mb-6">Best for most commercial facilities</p>
              <div className="space-y-3 mb-8">
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> Monthly maintenance
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> 12-hour emergency response
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> 15% discount on repairs
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> Weekly monitoring reports
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> Free emergency parts (up to 50K)
                </p>
              </div>
              <p className="text-emerald-400 font-bold text-lg mb-6">KES 250K - 600K/month</p>
              <Link href="/contact?type=package-gold" className="block w-full px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg text-center hover:bg-emerald-600">
                Get Gold Package
              </Link>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-2xl font-bold text-emerald-400 mb-6">Platinum Package</h3>
              <p className="text-gray-300 mb-6">Best for critical infrastructure</p>
              <div className="space-y-3 mb-8">
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> Weekly maintenance + monitoring
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> 4-hour emergency response
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> 20% discount on all work
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> Daily automated reports
                </p>
                <p className="text-gray-300 flex items-center gap-3">
                  <span>✓</span> 99.5% uptime SLA guarantee
                </p>
              </div>
              <p className="text-emerald-400 font-bold text-lg mb-6">KES 500K - 2M+/month</p>
              <Link href="/contact?type=package-platinum" className="block w-full px-6 py-3 bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold rounded-lg text-center hover:bg-emerald-500/30">
                Get Platinum Package
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Need a Custom Quote?</h2>
          <p className="text-lg text-gray-300 mb-10">
            Contact us with your specific needs. We'll provide an honest estimate within 24 hours.
          </p>

          {/*
            Quote form, added 2026-08-25.
            The section promised "an honest estimate within 24 hours" and then
            offered a phone number and a link to go and find a form elsewhere.
            This is the page price searches land on; asking someone who has just
            read a price table to navigate away and retype their requirement is
            where the enquiry is lost. Both existing buttons are untouched.
          */}
          <div className="max-w-xl mx-auto mb-10 text-left">
            <QuickInquiryForm
              service="Quotation Request"
              ctaLabel="Get my estimate"
              source="pricing-index"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-emerald-500 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/10 transition-all"
            >
              Get Quote Form
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
