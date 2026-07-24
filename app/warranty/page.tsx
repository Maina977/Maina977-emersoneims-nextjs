'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WarrantyPage() {
  const [activeTab, setActiveTab] = useState<'generators' | 'solar' | 'ups' | 'services'>('generators');

  const warranties = {
    generators: {
      standard: {
        title: 'Standard Warranty',
        duration: '3 Years',
        coverage: ['Engine defects', 'Alternator defects', 'Controller faults', 'Manufacturing defects', 'Factory parts replacement'],
        conditions: ['Professional installation by EmersonEIMS', 'Regular maintenance per schedule', 'Original batteries', 'Genuine spare parts only'],
        exclusions: ['User damage or misuse', 'Unauthorized repairs', 'Fuel contamination', 'Acts of nature', 'Normal wear and tear'],
      },
      labor: {
        title: 'Installation Workmanship',
        duration: '1 Year',
        coverage: ['Electrical connections', 'Mechanical assembly', 'ATS integration', 'Commissioning and testing'],
        conditions: ['Installation by EmersonEIMS technicians', 'No modifications to original design'],
      },
      fuel: {
        title: 'Fuel System Warranty',
        duration: '2 Years',
        coverage: ['Fuel tank manufacturing defects', 'Fuel pump defects', 'Fuel filter system'],
        conditions: ['Quality fuel used (per spec)', 'Regular filter maintenance'],
      },
    },
    solar: {
      panels: {
        title: 'Solar Panel Warranty',
        duration: '25 Years (Performance)',
        coverage: ['Manufacturing defects', 'Power output guarantee (minimum 80% after 25 years)', 'Frame and junction box defects'],
        conditions: ['Professional installation', 'No physical damage', 'Proper maintenance'],
      },
      inverter: {
        title: 'Inverter Warranty',
        duration: '5-10 Years',
        coverage: ['Component defects', 'Power electronics', 'Software issues'],
        conditions: ['Registered with manufacturer', 'Within voltage/frequency specs'],
      },
      battery: {
        title: 'Battery Storage Warranty',
        duration: '5-10 Years',
        coverage: ['Cell defects', 'BMS (Battery Management System)', 'Capacity loss coverage (after 3 years)'],
        conditions: ['Proper installation and ventilation', 'Temperature monitoring', 'Regular maintenance'],
      },
    },
    ups: {
      battery: {
        title: 'UPS Battery Warranty',
        duration: '3-5 Years',
        coverage: ['Cell failure', 'Battery capacity (minimum 80%)', 'Replacement costs', 'Installation labor (Year 1)'],
        conditions: ['Proper installation environment', 'Temperature 15-25°C', 'No physical damage'],
      },
      equipment: {
        title: 'UPS Equipment Warranty',
        duration: '2-3 Years',
        coverage: ['Inverter/charger', 'Power electronics', 'Control circuits', 'Cooling systems'],
        conditions: ['Within specifications', 'Professional maintenance', 'Original parts only'],
      },
    },
    services: {
      maintenance: {
        title: 'Maintenance Package Warranty',
        duration: 'Per Contract (6-12 months)',
        coverage: ['Service labor', 'Routine parts (filters, belts)', 'Oil and lubricants', 'System diagnostics'],
        conditions: ['Scheduled maintenance compliance', 'Emergency response SLA'],
      },
      repair: {
        title: 'Emergency Repair Warranty',
        duration: '6-12 Months',
        coverage: ['Diagnostic service', 'Repair labor', 'Replaced components (30 days)', 'Follow-up testing'],
        conditions: ['Genuine parts used', 'Certified technicians', 'Operating within specs'],
      },
    },
  };

  const getWarrantyData = () => {
    switch (activeTab) {
      case 'generators':
        return warranties.generators;
      case 'solar':
        return warranties.solar;
      case 'ups':
        return warranties.ups;
      case 'services':
        return warranties.services;
      default:
        return warranties.generators;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Comprehensive
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Warranty Coverage
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            EmersonEIMS backs every generator, solar system, and UPS with transparent warranty terms, professional support, and genuine spare parts availability.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-12 px-4 border-b border-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'generators', label: 'Generators' },
              { id: 'solar', label: 'Solar Systems' },
              { id: 'ups', label: 'UPS Systems' },
              { id: 'services', label: 'Services' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Warranty Details */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(getWarrantyData()).map(([key, warranty]: any) => (
              <div key={key} className="p-8 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-cyan-500 transition">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">{warranty.title}</h3>
                  <div className="text-3xl font-bold text-white">{warranty.duration}</div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      What's Covered
                    </h4>
                    <ul className="space-y-2">
                      {warranty.coverage.map((item: string, idx: number) => (
                        <li key={idx} className="text-gray-300 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-blue-400">ℹ</span>
                      Conditions
                    </h4>
                    <ul className="space-y-2">
                      {warranty.conditions.map((item: string, idx: number) => (
                        <li key={idx} className="text-gray-300 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>

                  {warranty.exclusions && (
                    <div>
                      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-amber-400">✕</span>
                        Not Covered
                      </h4>
                      <ul className="space-y-2">
                        {warranty.exclusions.map((item: string, idx: number) => (
                          <li key={idx} className="text-gray-400 text-sm">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warranty Process */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Warranty Claim Process</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Contact Support',
                desc: 'Call +254 768 860 665 or email support@emersoneims.com with warranty details and issue description.',
              },
              {
                step: '2',
                title: 'Technical Diagnosis',
                desc: 'Our technicians diagnose the issue via phone/remote assessment to determine warranty eligibility.',
              },
              {
                step: '3',
                title: 'Service Approval',
                desc: 'Warranty claim approved and service scheduled. Repair covered 100% if within warranty terms.',
              },
              {
                step: '4',
                title: 'Completion & Follow-Up',
                desc: 'Unit repaired, tested, and returned with completion report. 30-day follow-up verification.',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extended Warranty & Maintenance Packages */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Extended Maintenance Programs</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Silver Package',
                features: ['Quarterly inspections', 'Oil & filter changes', 'Battery testing', 'Load bank testing annually', 'Priority response'],
                price: 'From KES 45,000/year',
              },
              {
                name: 'Gold Package',
                features: ['Monthly inspections', 'All Silver features', 'Fuel system cleaning', '24/7 emergency response', 'Spare parts discount (10%)', 'Free transport'],
                price: 'From KES 85,000/year',
                highlight: true,
              },
              {
                name: 'Platinum Package',
                features: ['Weekly inspections', 'All Gold features', 'Predictive maintenance', 'Remote monitoring', 'Parts included (routine)', 'Warranty extension'],
                price: 'Custom pricing',
              },
            ].map((pkg, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-lg border transition ${
                  pkg.highlight
                    ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500'
                    : 'bg-slate-900/50 border-slate-700 hover:border-cyan-500'
                }`}
              >
                <h3 className="text-2xl font-bold mb-4 text-cyan-400">{pkg.name}</h3>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xl font-bold text-white mb-6">{pkg.price}</div>
                <Link
                  href="/contact?type=maintenance"
                  className="w-full block text-center px-4 py-2 bg-cyan-500 text-black font-semibold rounded hover:bg-cyan-400 transition"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Warranty FAQ</h2>

          <div className="space-y-6">
            {[
              {
                q: 'Does the warranty cover fuel system problems?',
                a: 'Yes, manufacturing defects in fuel tanks, pumps, and filters are covered for 2 years. Fuel contamination damage is not covered.',
              },
              {
                q: 'What if I need repairs outside the standard warranty?',
                a: 'Extended maintenance packages and repair plans are available. Emergency repairs are covered on a time-and-materials basis with priority response.',
              },
              {
                q: 'Are replacement parts guaranteed original?',
                a: 'Yes, all warranty replacements use genuine OEM parts from manufacturers. We never use counterfeit or aftermarket parts in warranty work.',
              },
              {
                q: 'How long does warranty service take?',
                a: 'Most repairs complete within 2-5 business days. Emergency repairs can be expedited. Warranty claim approval typically takes 24 hours.',
              },
              {
                q: 'Can I transfer warranty to a new owner?',
                a: 'Warranties are non-transferable unless explicitly agreed in writing and registered with EmersonEIMS before transfer.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 border border-slate-700 rounded-lg">
                <h4 className="font-bold text-cyan-400 mb-3">{faq.q}</h4>
                <p className="text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Questions About Your Warranty?</h2>
          <p className="text-lg text-gray-200 mb-10">Our team is ready to help. Contact us for warranty support or to upgrade your maintenance plan.</p>
          <Link
            href="/contact?type=warranty"
            className="inline-block px-8 py-4 bg-white text-cyan-900 font-bold rounded-lg hover:bg-gray-200 transition text-lg"
          >
            Contact Warranty Support
          </Link>
        </div>
      </section>
    </main>
  );
}
