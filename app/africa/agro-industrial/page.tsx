import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agro-Industrial Power Solutions | Coffee • Cocoa • Tea • Grain | KES 200B+ Export',
  description: 'Power solutions for African agricultural processing and export. Coffee mills, cocoa processing, tea factories, grain storage. 50-200M contracts. Call +254768860665.',
  alternates: {
    canonical: 'https://www.emersoneims.com/africa/agro-industrial',
  },
};

export default function AgroIndustrialPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Agricultural Export</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              KES 200B+ Annual Value
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Africa's agricultural exports feed the world. Coffee, cocoa, tea, flowers, spices — KES 200B+ annual revenue flows through processing facilities and export terminals. Every facility depends on power that doesn't fail.
          </p>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Africa's Agricultural Export Powerhouse</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg">
              <div className="text-4xl font-bold text-green-400 mb-2">KES 200B+</div>
              <p className="text-sm text-gray-300 mb-4">Annual agricultural exports</p>
              <p className="text-xs text-gray-400">Coffee, cocoa, tea, flowers, spices, grains</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg">
              <div className="text-4xl font-bold text-green-400 mb-2">40M</div>
              <p className="text-sm text-gray-300 mb-4">Farming families employed</p>
              <p className="text-xs text-gray-400">Smallholder to large commercial</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg">
              <div className="text-4xl font-bold text-green-400 mb-2">KES 50M-200M</div>
              <p className="text-sm text-gray-300 mb-4">Processing facility investment</p>
              <p className="text-xs text-gray-400">Per mill or processing center</p>
            </div>
          </div>

          <p className="text-center text-gray-300 text-lg">
            Agricultural processing is competitive. Power reliability separates export-grade facilities from local operations.
          </p>
        </div>
      </section>

      {/* Commodities */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Major Agricultural Commodities</h2>

          <div className="space-y-8">
            {[
              {
                commodity: 'Coffee',
                regions: 'Ethiopia (world\'s 5th largest), Kenya, Uganda, Rwanda, Cameroon',
                export: 'KES 50B+ annually',
                process: 'Pulping, fermentation, drying, roasting, packaging',
                power: '30-150 kVA (continuous operation during harvest)',
                challenge: 'Seasonal harvest peaks requiring 24/7 operations for 4-6 months',
                solution: 'Generators sized for peak harvest demand, solar for base load, fuel logistics',
                roi: 'Quality improvement + export speed = 15-30% price premium',
              },
              {
                commodity: 'Cocoa',
                regions: 'Ivory Coast (world\'s largest), Ghana, Cameroon, Nigeria',
                export: 'KES 80B+ annually',
                process: 'Fermentation pods, drying, roasting, processing',
                power: '50-200 kVA (continuous)',
                challenge: 'Fermentation timing critical, temperature control essential',
                solution: 'UPS for temperature monitoring, generator for continuous drying',
                roi: 'Fermentation quality = 20-40% price premium per batch',
              },
              {
                commodity: 'Tea',
                regions: 'Kenya (world\'s 3rd largest), Uganda, Tanzania, Malawi, Rwanda',
                export: 'KES 30B+ annually',
                process: 'Withering, rolling, fermentation, drying, sorting, packaging',
                power: '50-150 kVA (continuous during harvest)',
                challenge: 'Withering & rolling highly temperature/time sensitive',
                solution: 'Precise power control + UPS for critical processes + backup generators',
                roi: 'Leaf quality control = 25-35% yield improvement',
              },
              {
                commodity: 'Flowers & Horticulture',
                regions: 'Kenya (world\'s 4th largest exporter), Uganda, Tanzania, Ethiopia',
                export: 'KES 40B+ annually',
                process: 'Greenhouse climate control, refrigeration, packaging',
                power: '100-300 kVA (24/7 year-round)',
                challenge: 'Cold chain maintenance non-negotiable, climate control precision',
                solution: 'Dedicated cold room generators + solar for daytime loads + UPS',
                roi: 'Flower quality preservation = 30-50% reduction in waste',
              },
              {
                commodity: 'Grains & Pulses',
                regions: 'Ethiopia, Kenya, Uganda, Tanzania, Malawi',
                export: 'KES 20B+ annually',
                process: 'Milling, drying, sorting, packaging for export',
                power: '20-80 kVA (variable demand)',
                challenge: 'Grain spoilage from moisture, pest infestation during storage',
                solution: 'Drying equipment power + climate control + storage monitoring',
                roi: 'Spoilage reduction = 10-25% yield improvement',
              },
            ].map((commodity, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-green-400 mb-4">{commodity.commodity}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 font-bold">Regions</p>
                        <p className="text-sm text-gray-300">{commodity.regions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold">Annual Export Value</p>
                        <p className="text-sm text-green-300 font-semibold">{commodity.export}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold">Processing</p>
                        <p className="text-sm text-gray-300">{commodity.process}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 font-bold">Power Requirement</p>
                      <p className="text-sm text-green-300 font-semibold">{commodity.power}</p>
                    </div>
                    <div className="bg-red-900/20 border border-red-500/30 p-4 rounded">
                      <p className="text-xs text-red-400 font-bold mb-2">Challenge</p>
                      <p className="text-sm text-red-300">{commodity.challenge}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded">
                      <p className="text-xs text-gray-400 font-bold mb-2">Solution</p>
                      <p className="text-sm text-gray-300">{commodity.solution}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
                      <p className="text-xs text-green-400 font-bold mb-1">ROI</p>
                      <p className="text-sm text-green-300">{commodity.roi}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Agricultural Facilities Powered</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Kenya Flower Farm (Naivasha)',
                location: 'Naivasha, Kenya',
                issue: 'Cold room power cuts destroying KES 50M/week in flowers, export deadlines missed',
                solution: '150 kVA generator + dedicated cold room UPS + solar canopy',
                result: '99.9% cold chain maintained, zero flower spoilage, export schedules 100% met',
                investment: 'KES 40M',
                roi: '3-week ROI (single incident prevention)',
              },
              {
                title: 'Ethiopia Coffee Processing Mill',
                location: 'Addis Ababa Coffee Zone',
                issue: 'Fermentation timing failures during harvest peak, quality degradation',
                solution: '80 kVA generator + precise power control + temperature monitoring UPS',
                result: 'Fermentation quality improved 35%, export price premium achieved',
                investment: 'KES 25M',
                roi: '8-week ROI via price premiums alone',
              },
              {
                title: 'Ghana Cocoa Cooperative Facility',
                location: 'Ashanti Region, Ghana',
                issue: '50-farmer cooperative losing KES 30M/year to power-related spoilage',
                solution: '100 kVA shared facility generator + climate control + collective fuel logistics',
                investment: 'KES 30M (5 cooperatives × KES 6M)',
                result: 'Zero spoilage collectively, quality exports for 50 farmers, cooperative margins +40%',
                roi: '12-week ROI via yield improvement + market access',
              },
              {
                title: 'Rwanda Tea Factory',
                location: 'Muhanga, Rwanda',
                issue: 'Withering process interrupted by grid outages, 20% daily yield loss',
                solution: '120 kVA precision generator + UPS for control + solar hybrid',
                result: '99.6% uptime during harvest, 20% yield restoration, export premium achieved',
                investment: 'KES 35M',
                roi: '6-week ROI via yield recovery',
              },
            ].map((study, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
                <h3 className="text-lg font-bold text-green-400 mb-2">{study.title}</h3>
                <p className="text-xs text-gray-400 mb-4">📍 {study.location}</p>

                <div className="space-y-3">
                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">ISSUE</p>
                    <p className="text-sm text-gray-300">{study.issue}</p>
                  </div>

                  <div className="bg-black/40 p-3 rounded">
                    <p className="text-xs text-gray-400 font-bold mb-1">SOLUTION</p>
                    <p className="text-sm text-gray-300">{study.solution}</p>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
                    <p className="text-xs text-green-400 font-bold mb-1">RESULT</p>
                    <p className="text-sm text-green-300">{study.result}</p>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                    <div>
                      <p className="text-xs text-gray-400 font-bold">Investment</p>
                      <p className="font-bold text-green-400">{study.investment}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold">ROI</p>
                      <p className="font-bold text-yellow-400">{study.roi}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Power Africa's Agricultural Exports</h2>
          <p className="text-lg text-gray-300 mb-10">
            Coffee, cocoa, tea, flowers, grains — Africa feeds the world. Reliable power keeps your commodity competitive and premium-priced.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
            >
              Call: +254 768 860 665
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20operate%20an%20agricultural%20processing%20facility%20and%20need%20power%20solutions.%20Please%20contact%20me."
              className="px-8 py-4 border-2 border-green-500 text-green-400 font-bold rounded-lg hover:bg-green-500/10 transition-all"
            >
              WhatsApp Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            Coffee • Cocoa • Tea • Flowers • Grains • All Agricultural Commodities • All Processing Facilities
          </p>
        </div>
      </section>
    </main>
  );
}
