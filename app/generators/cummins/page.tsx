'use client';


import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const OptimizedImage = dynamic(() => import('@/components/media/OptimizedImage'), { ssr: false });


export default function CumminsPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'used' | 'maintenance' | 'parts'>('new');

  const cumminsProducts = {
    new: [
      { range: '10-50 kVA', use: 'Residential & Small Commercial', features: ['Silent operation', 'Fuel efficient', 'Compact design'] },
      { range: '50-200 kVA', use: 'Commercial & Light Industrial', features: ['Industrial grade', 'Load bank tested', 'Extended warranty'] },
      { range: '200-500 kVA', use: 'Industrial & Data Centers', features: ['Heavy-duty', 'Parallel capable', 'Advanced controls'] },
      { range: '500-2000 kVA', use: 'Utility-Scale Power', features: ['Mission-critical', 'Containerized', 'Remote monitoring'] },
    ],
    maintenance: [
      { service: 'Planned Maintenance', desc: 'Oil/filter changes, cooling system service, fuel system inspection', interval: 'Every 500-1000 hours' },
      { service: 'Predictive Maintenance', desc: 'Load bank testing, vibration analysis, thermal imaging', interval: 'Quarterly' },
      { service: 'Emergency Repairs', desc: 'Breakdown diagnostics, on-site troubleshooting, rapid parts supply', interval: '24/7 available' },
      { service: 'Overhaul Services', desc: 'Complete engine rebuild, alternator service, controller upgrade', interval: 'Every 5-10 years' },
    ],
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                  Cummins Power
                </span>
                <br />
                Solutions
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Cummins diesel generators engineered for reliability, performance, and efficiency. From 10 kVA portable units to 2000 kVA industrial systems, EmersonEIMS delivers complete solutions with specialist installation and 24/7 support.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact?type=cummins-quote"
                  className="px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition"
                >
                  Get Quotation
                </Link>
                <Link
                  href="/generators#cummins-faq"
                  className="px-6 py-3 border border-cyan-500 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-500/10 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
              <OptimizedImage
                src="/images/enhanced/KIVUKONI SCHOOL CUMMINS GENERATOR -4K-CINEMATIC.jpg"
                alt="Cummins Generator Installation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Range Tabs */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Cummins Product Range</h2>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {[
              { id: 'new', label: 'New Generators' },
              { id: 'used', label: 'Pre-Owned' },
              { id: 'maintenance', label: 'Services' },
              { id: 'parts', label: 'Spare Parts' },
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

          {/* Tab Content */}
          <div className="grid md:grid-cols-2 gap-6">
            {activeTab === 'new' &&
              cumminsProducts.new.map((product, idx) => (
                <div key={idx} className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500 transition">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">{product.range}</h3>
                  <p className="text-gray-300 mb-4">{product.use}</p>
                  <ul className="space-y-2">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            {activeTab === 'maintenance' &&
              cumminsProducts.maintenance.map((service, idx) => (
                <div key={idx} className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500 transition">
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">{service.service}</h3>
                  <p className="text-gray-300 mb-4">{service.desc}</p>
                  <p className="text-sm text-cyan-300 font-semibold">Interval: {service.interval}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Cummins Technical Specifications</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Engine Series</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Cummins ISBe (5-15L)</li>
                <li>• Cummins ISLe (8-9L)</li>
                <li>• Cummins NTA/KTA (12-20L)</li>
                <li>• Cummins QSX (15-21L)</li>
                <li>• Cummins QSZ (12-20L)</li>
              </ul>
            </div>

            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Fuel Efficiency</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 0.185-0.210 L/kWh</li>
                <li>• DGEN technology</li>
                <li>• Tier 4 Final compliant</li>
                <li>• Low emissions</li>
                <li>• Extended fuel intervals</li>
              </ul>
            </div>

            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Support & Warranty</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 2-year comprehensive warranty</li>
                <li>• Specialist Cummins technicians</li>
                <li>• Genuine spare parts</li>
                <li>• Remote diagnostic support</li>
                <li>• Extended maintenance packages</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Cummins Section */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Why Choose Cummins?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">Global Leader in Power Generation</h3>
                <p className="text-gray-300">
                  Cummins is a Fortune 500 company with 100+ years of engine manufacturing excellence. Trusted by industries worldwide for reliability under extreme conditions.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">Proven in African Conditions</h3>
                <p className="text-gray-300">
                  Cummins engines are tested and validated in Kenya's harsh operating conditions: high dust, extreme temperatures, and demanding industrial loads.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">Superior Fuel Economy</h3>
                <p className="text-gray-300">
                  DGEN technology reduces fuel consumption by 10-15% vs competitors, delivering significant operating cost savings over generator lifespan.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">Local Expert Support</h3>
                <p className="text-gray-300">
                  EmersonEIMS technicians work across every Cummins platform we supply, to manufacturer service specifications. 24/7 emergency hotline with rapid parts availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Power Your Operations?</h2>
          <p className="text-xl text-gray-200 mb-10">
            Get a customized Cummins solution tailored to your exact power requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact?type=cummins-quote"
              className="px-8 py-4 bg-white text-cyan-900 font-bold rounded-lg hover:bg-gray-200 transition text-lg"
            >
              Request Quotation
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition text-lg"
            >
              Contact Sales
            </Link>
          </div>
          <p className="text-gray-300 mt-8">
            Call: +254 768 860 665 | WhatsApp: +254 782 914 717 | Email: sales@emersoneims.com
          </p>
        </div>
      </section>
    </main>
  );
}
