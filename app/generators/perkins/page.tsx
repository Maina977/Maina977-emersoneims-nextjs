'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const OptimizedImage = dynamic(() => import('@/components/media/OptimizedImage'), { ssr: false });

export const metadata: Metadata = {
  title: 'Perkins Diesel Generators Kenya | Industrial Power | EmersonEIMS',
  description: 'Perkins diesel generators 20-1000kVA for Kenya. Fuel-efficient, low-hour units. Sales, service, spare parts. Factory-trained technicians.',
  alternates: {
    canonical: 'https://www.emersoneims.com/generators/perkins',
  },
};

export default function PerkinsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                  Perkins
                </span>
                <br />
                Diesel Power
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Perkins generators deliver proven reliability and fuel efficiency for commercial and industrial applications across Kenya. Range from 20 kVA to 1000 kVA with expert local support.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact?type=perkins-quote"
                  className="px-6 py-3 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-400 transition"
                >
                  Get Quotation
                </Link>
                <Link
                  href="/generators"
                  className="px-6 py-3 border border-orange-500 text-orange-400 font-semibold rounded-lg hover:bg-orange-500/10 transition"
                >
                  View All Products
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
              <OptimizedImage
                src="/images/enhanced/ST AUSTINS ACADEMY 50KVA PERKINS ENGINE-4K-CINEMATIC.jpg"
                alt="Perkins Generator"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Perkins Generator Advantages</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-slate-700 rounded-lg hover:border-orange-500 transition">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">Fuel Efficiency</h3>
              <p className="text-gray-300 leading-relaxed">
                Perkins engines deliver exceptional fuel economy, reducing operating costs compared to competitor generators. Ideal for commercial operations requiring maximum ROI.
              </p>
            </div>
            <div className="p-6 border border-slate-700 rounded-lg hover:border-orange-500 transition">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">Proven Reliability</h3>
              <p className="text-gray-300 leading-relaxed">
                Decades of proven performance in diverse climates. Perkins engines are preferred for demanding applications where downtime is not an option.
              </p>
            </div>
            <div className="p-6 border border-slate-700 rounded-lg hover:border-orange-500 transition">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">Global Parts Network</h3>
              <p className="text-gray-300 leading-relaxed">
                Genuine Perkins spare parts available worldwide. EmersonEIMS maintains stock of critical components for same-day replacement.
              </p>
            </div>
            <div className="p-6 border border-slate-700 rounded-lg hover:border-orange-500 transition">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">Low Operating Hours</h3>
              <p className="text-gray-300 leading-relaxed">
                Our pre-owned Perkins units are carefully selected for low running hours and exceptional condition. Fully serviced before delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specification */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Perkins Engine Series</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { series: '400 Series', range: '20-100 kVA', apps: 'Light commercial, standby power' },
              { series: '1000 Series', range: '50-500 kVA', apps: 'Industrial, manufacturing' },
              { series: '1100 Series', range: '200-1000 kVA', apps: 'Heavy industrial, infrastructure' },
            ].map((engine, idx) => (
              <div key={idx} className="p-6 border border-slate-700 rounded-lg">
                <h3 className="text-xl font-bold text-orange-400 mb-3">{engine.series}</h3>
                <p className="text-gray-300 mb-3"><strong>Range:</strong> {engine.range}</p>
                <p className="text-gray-300"><strong>Applications:</strong> {engine.apps}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-900 to-red-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Reliable Power for Your Business</h2>
          <p className="text-xl text-gray-200 mb-10">Perkins generators engineered for Kenya's toughest environments.</p>
          <Link
            href="/contact?type=perkins-quote"
            className="inline-block px-8 py-4 bg-white text-orange-900 font-bold rounded-lg hover:bg-gray-200 transition"
          >
            Request Quotation Today
          </Link>
        </div>
      </section>
    </main>
  );
}
