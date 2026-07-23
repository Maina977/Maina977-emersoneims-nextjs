import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commercial Real Estate Power Solutions | Office Parks & Shopping Centers | EmersonEIMS Kenya',
  description: 'Reliable power infrastructure for office buildings, shopping centers, residential towers, and industrial parks across Kenya. Backup generators, solar integration, energy cost reduction, 24/7 support.',
  alternates: {
    canonical: 'https://www.emersoneims.com/industries/commercial-property',
  },
};

export default function CommercialPropertyIndustriesPage() {
  const solutions = [
    {
      icon: '🏢',
      title: 'Office & Corporate Buildings',
      description: 'Multi-floor office towers requiring uninterrupted power for business continuity',
      power: '200-800 kVA',
      features: [
        '3-phase industrial generator + automatic transfer switch',
        'Solar canopy on roofing (20-40% grid reduction)',
        'UPS for server rooms and data centers',
        'Smart load shedding (non-critical floors during outages)',
        'Real-time energy monitoring dashboard',
        'Preventive maintenance SLA',
      ],
      applications: 'Office spaces, server rooms, HVAC systems, emergency lighting, elevator backup',
      reliability: '99.5% uptime SLA',
      cost: 'KES 2.5M - 8M (installed)',
      timeline: '6-8 weeks',
      savings: '25-35% energy cost reduction typical',
    },
    {
      icon: '🛍️',
      title: 'Shopping Centers & Malls',
      description: 'High-footfall retail spaces with critical HVAC, lighting, and security demands',
      power: '300-1200 kVA',
      features: [
        '500-1000 kVA redundant generators',
        'Multi-zone load management (keep retail powered, reduce non-essential zones)',
        'UPS for security systems and access control',
        'Solar + battery storage (reduce grid spikes)',
        'Night-time load optimization (lower fuel consumption)',
        '24/7 monitoring and emergency response',
      ],
      applications: 'Retail shops, food courts, HVAC, security systems, parking lot lighting, elevators',
      reliability: '99.7% uptime SLA',
      cost: 'KES 5M - 15M (installed)',
      timeline: '8-12 weeks',
      savings: '30-50% energy cost reduction (depending on mall footprint)',
    },
    {
      icon: '🏠',
      title: 'Residential Towers & Apartments',
      description: 'Apartment blocks and residential complexes prioritizing tenant comfort and safety',
      power: '150-600 kVA',
      features: [
        '2-3 redundant generators (never leave residents without power)',
        'UPS for emergency lighting, elevators, water pumps',
        'Solar for common areas (balconies, corridors)',
        'Tenant communication system (WhatsApp alerts during outages)',
        'Preventive maintenance (no surprise failures)',
        'Access to backup water tank during power loss',
      ],
      applications: 'Elevators, water pumps, emergency lighting, HVAC, security, common area lighting',
      reliability: '99.6% uptime SLA',
      cost: 'KES 2M - 6M (installed)',
      timeline: '4-6 weeks',
      savings: '20-30% energy cost reduction',
    },
    {
      icon: '🏭',
      title: 'Industrial Parks & Logistics',
      description: 'Large-footprint industrial estates with manufacturing and warehousing tenants',
      power: '500-2000 kVA',
      features: [
        'Multi-building distribution network (main + secondary backup)',
        'Fuel supply management (bulk storage, delivery schedule)',
        'Tenant billing system (charge by consumption)',
        'Solar canopies on warehouses (20-40% reduction)',
        'Forklift charging stations (powered by hybrid)',
        'Predictive maintenance across all buildings',
      ],
      applications: 'Manufacturing zones, warehousing, office blocks, security, lighting, forklifts',
      reliability: '99.5% uptime SLA',
      cost: 'KES 8M - 25M (depending on scale)',
      timeline: '10-14 weeks',
      savings: '35-45% energy cost reduction (economies of scale)',
    },
  ];

  const caseStudies = [
    {
      property: 'Nairobi CBD Tower (15-floor office complex)',
      issue: 'Daily 2-4 hour outages causing tenant complaints, business disruption, KES 150K/hour productivity loss',
      solution: 'Installed 400 kVA generator + solar canopy + UPS for data centers + predictive maintenance SLA',
      result: '99.7% uptime, zero tenant complaints, 35% electricity cost reduction, KES 2.5M annual savings',
      investment: 'KES 3.8M',
      roi: 'Break-even in 14-16 months',
    },
    {
      property: 'Nairobi Shopping Mall (50,000 sq m)',
      issue: 'Power cuts causing retail closures, spoiled cold-chain food, frustrated shoppers, KES 500K per outage',
      solution: '800 kVA dual-redundant generators + solar + smart load management + 24/7 support',
      result: '99.8% uptime, zero retail closures, 40% energy savings despite 30% traffic increase',
      investment: 'KES 8.2M',
      roi: 'Break-even in 18-20 months',
    },
    {
      property: 'Westlands Residential Complex (200-unit apartment tower)',
      issue: 'Elevator outages causing tenant churn, water pump failures leaving residents without water',
      solution: 'Installed redundant 200 kVA generators + UPS for critical systems + preventive maintenance',
      result: '99.6% uptime, zero elevator downtime, full tenant satisfaction score improvement to 4.8/5',
      investment: 'KES 2.1M',
      roi: 'Paid back through tenant retention (prevented 5-6 vacancy months)',
    },
    {
      property: 'Industrial Park Authority (12-building complex, 8 hectares)',
      issue: 'Multiple manufacturer tenants losing KES 50-100K per outage, fuel costs rising (KES 300K/month)',
      solution: 'Multi-building power network with 1200 kVA capacity, solar canopies, fuel management, tenant billing',
      result: '99.5% uptime, 42% energy cost reduction, 8 manufacturers renewed 3-year leases',
      investment: 'KES 15M',
      roi: 'Break-even in 28-32 months, but increased lease renewals worth KES 50M+',
    },
  ];

  const benefits = [
    {
      metric: '15-30%',
      label: 'Building Operating Cost Reduction',
      explanation: 'Energy typically represents 15-30% of commercial property operating costs. Smart power + solar can reduce this by 25-50%.',
    },
    {
      metric: '99.5-99.8%',
      label: 'Uptime SLA Guarantee',
      explanation: 'Contractual uptime keeps tenants happy, enables premium rent, and protects your reputation.',
    },
    {
      metric: '2-3 years',
      label: 'Typical ROI',
      explanation: 'Most commercial properties break even on power infrastructure investment within 2-3 years through energy savings + tenant satisfaction.',
    },
    {
      metric: '20-40%',
      label: 'Tenant Satisfaction Improvement',
      explanation: 'Zero power outages = zero complaints = higher rent prices, faster leasing, premium positioning vs competitors.',
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Commercial Property Power</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Zero Downtime, Maximum ROI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Office towers, shopping centers, residential complexes, and industrial parks across Kenya depend on reliable power.
            We design energy infrastructure that reduces costs, keeps tenants happy, and protects your investment.
          </p>
        </div>
      </section>

      {/* The Business Case */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Property Owners Choose EmersonEIMS</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-red-900/20 border border-red-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-4">❌ The Problem</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> Frequent power cuts = tenant complaints + lease cancellations
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> Energy costs = 15-30% of operating budget (sky-high bills every month)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> Elevator outages, water pump failures damage reputation + vacancy
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> No power optimization = burning money on oversized generators
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-red-400">✗</span> Reactive maintenance = surprise failures during business hours
                </li>
              </ul>
            </div>

            <div className="p-8 bg-green-900/20 border border-green-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-green-400 mb-4">✓ The EmersonEIMS Solution</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> 99.5-99.8% uptime SLA (contractual guarantee, backed by 24/7 support)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> Solar + smart load management (25-50% energy cost reduction)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> Redundant systems (never leave building without power)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> Preventive maintenance SLA (catch issues before failure)
                </li>
                <li className="flex gap-3 text-gray-300">
                  <span className="text-green-400">✓</span> Tenant satisfaction + premium rent positioning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions by Property Type */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Power Solutions by Property Type</h2>

          <div className="space-y-8">
            {solutions.map((solution, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
                <div className="flex items-start gap-6 mb-6">
                  <span className="text-4xl">{solution.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{solution.title}</h3>
                    <p className="text-gray-300">{solution.description}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-sm text-gray-400">Typical Power</div>
                    <div className="text-lg font-bold text-amber-400">{solution.power}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-bold text-amber-400 mb-2">FEATURES</p>
                    <ul className="space-y-1">
                      {solution.features.map((feature, i) => (
                        <li key={i} className="text-sm text-gray-300 flex gap-2">
                          <span className="text-amber-400">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">APPLICATIONS</p>
                        <p className="text-sm text-gray-300">{solution.applications}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">UPTIME SLA</p>
                        <p className="text-sm font-bold text-amber-400">{solution.reliability}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">Investment</p>
                      <p className="text-lg font-bold text-amber-400">{solution.cost}</p>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-xs text-gray-400 font-bold mb-1">Timeline</p>
                      <p className="text-sm text-gray-300">{solution.timeline}</p>
                    </div>
                    <div className="border-t border-white/10 pt-3 bg-green-900/20 -mx-4 -mb-4 px-4 py-3 rounded-b">
                      <p className="text-xs text-green-400 font-bold mb-1">TYPICAL SAVINGS</p>
                      <p className="text-sm font-bold text-green-300">{solution.savings}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">The Financial Impact</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
                <div className="text-3xl font-bold text-amber-400 mb-2">{benefit.metric}</div>
                <p className="font-bold text-white mb-3">{benefit.label}</p>
                <p className="text-sm text-gray-300">{benefit.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Real Results Across Nairobi</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-amber-400 mb-4">{study.property}</h3>

                <div className="space-y-3">
                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">THE PROBLEM</p>
                    <p className="text-sm text-gray-300">{study.issue}</p>
                  </div>

                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">OUR SOLUTION</p>
                    <p className="text-sm text-gray-300">{study.solution}</p>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
                    <p className="text-xs text-green-400 font-bold mb-1">RESULT</p>
                    <p className="text-sm text-green-300">{study.result}</p>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Investment:</span>
                      <span className="font-bold text-amber-400">{study.investment}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">ROI:</span>
                      <span className="font-bold text-green-400">{study.roi}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">How We Build Your Power Infrastructure</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Energy Audit',
                details: 'We analyze your building\'s power consumption patterns, peak loads, and historical outages. AI-powered load analysis identifies optimization opportunities.',
              },
              {
                step: '2',
                title: 'Design',
                details: 'Custom solution: right-sized generators, solar potential, battery storage, UPS for critical zones. Designed for YOUR building, not generic templates.',
              },
              {
                step: '3',
                title: 'Installation',
                details: 'Professional installation with zero disruption to tenants. Equipment tested. Documentation complete for audits and compliance reviews.',
              },
              {
                step: '4',
                title: 'Maintenance SLA',
                details: 'Preventive maintenance schedule, 24/7 emergency support, predictive alerts, fuel management. We own the uptime risk.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-lg text-center">
                <div className="text-4xl font-bold text-amber-400 mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Maximize Your Property's Value</h2>
          <p className="text-lg text-gray-300 mb-10">
            Every day without reliable power costs your business money. Get a free energy audit to see how much you could save
            and how much tenant satisfaction you could improve.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=commercial-property"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-lg hover:scale-105 transition-all"
            >
              Get Free Energy Audit
            </Link>
            <a
              href="tel:+254768860665"
              className="px-8 py-4 border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/10 transition-all"
            >
              Call: +254 768 860 665
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
