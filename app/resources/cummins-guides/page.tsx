
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cummins Generator Technical Guides | Fault Codes & Maintenance | EmersonEIMS',
  description: 'Comprehensive Cummins technical library: fault codes, maintenance schedules, troubleshooting guides, filter specifications, fuel consumption data.',
  alternates: {
    canonical: 'https://www.emersoneims.com/resources/cummins-guides',
  },
};

export default function CumminsGuidesPage() {
  const guides = [
    {
      title: 'Cummins Fault Code Reference',
      desc: 'Complete fault code decoder for ISBe, ISLe, QSX, and KTA engines. Diagnosis procedures and recommended actions.',
      categories: ['Electrical', 'Engine', 'Fuel System', 'Cooling'],
      download: true,
    },
    {
      title: 'Maintenance Schedules by Engine Series',
      desc: 'Manufacturer-recommended maintenance intervals for all Cummins platforms. Parts specifications and service procedures.',
      categories: ['ISBe Series', 'QSX Series', 'NTA/KTA Series'],
      download: true,
    },
    {
      title: 'Fuel Consumption Guide',
      desc: 'Fuel consumption tables by load, RPM, and environmental conditions. Helps with budgeting and efficiency analysis.',
      categories: ['Load Profile', 'Climate Impact', 'Efficiency Optimization'],
      download: true,
    },
    {
      title: 'Filter & Fluid Specifications',
      desc: 'Complete OEM filter, oil, coolant, and fuel specifications. Compatibility matrix with part numbers.',
      categories: ['Oil Filters', 'Air Filters', 'Fuel Filters', 'Coolants'],
      download: true,
    },
    {
      title: 'Troubleshooting Guide',
      desc: 'Step-by-step diagnostic procedures for common issues. Cold start, overheating, loss of power, battery problems.',
      categories: ['Engine Won\'t Start', 'Overheating', 'Power Loss', 'Electrical'],
    },
    {
      title: 'Generator Sizing Worksheet',
      desc: 'Workbook to calculate proper generator size for your load. Includes motor starting recommendations.',
      categories: ['Load Calculation', 'Power Factor', 'Starting Requirements'],
      download: true,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Cummins
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Technical Library
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive technical resources for Cummins generator operation, maintenance, and troubleshooting. OEM specifications and expert guidance.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {guides.map((guide, idx) => (
              <div key={idx} className="p-8 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-cyan-500 transition flex flex-col">
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">{guide.title}</h3>
                <p className="text-gray-300 mb-6 flex-grow">{guide.desc}</p>

                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-400 mb-2">Covers:</p>
                  <div className="flex flex-wrap gap-2">
                    {guide.categories.map((cat, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-800 text-cyan-300 text-sm rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {guide.download && (
                    <Link
                      href="/contact?type=technical-guide"
                      className="flex-1 px-4 py-2 bg-cyan-500 text-black font-semibold rounded hover:bg-cyan-400 transition text-center text-sm"
                    >
                      Download
                    </Link>
                  )}
                  <button className="flex-1 px-4 py-2 border border-cyan-500 text-cyan-400 font-semibold rounded hover:bg-cyan-500/10 transition text-sm">
                    View Online
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Reference Tables */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Quick Reference</h2>

          {/* Maintenance Intervals Table */}
          <div className="mb-12 overflow-x-auto">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">Standard Maintenance Intervals</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3 text-cyan-400">Service</th>
                  <th className="text-center p-3 text-cyan-400">Interval (Hours)</th>
                  <th className="text-center p-3 text-cyan-400">Interval (Months)</th>
                  <th className="text-left p-3 text-cyan-400">Part Replacement</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: 'Oil & Filter Change', hours: '250-500', months: '3', parts: 'Oil filter, Engine oil' },
                  { service: 'Air Filter Inspection', hours: '500', months: '6', parts: 'Inspect, replace if dirty' },
                  { service: 'Fuel Filter Change', hours: '1000', months: '12', parts: 'Primary & secondary filters' },
                  { service: 'Coolant Flush', hours: '2000', months: '24', parts: 'Coolant, gaskets' },
                  { service: 'Battery Service', hours: '250', months: '3', parts: 'Terminals, fluid level' },
                  { service: 'Load Bank Test', hours: '500', months: '6', parts: 'None (diagnostic)' },
                  { service: 'Overhaul', hours: '10000', months: '120', parts: 'Engine rebuild kit' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-700 hover:bg-slate-800/50">
                    <td className="p-3 text-gray-300">{row.service}</td>
                    <td className="p-3 text-center text-gray-300">{row.hours}</td>
                    <td className="p-3 text-center text-gray-300">{row.months}</td>
                    <td className="p-3 text-gray-300">{row.parts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Filter Specifications */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">OEM Filter Specifications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  type: 'Oil Filters',
                  specs: [
                    'Fleetguard LF16035 (ISBe)',
                    'Fleetguard LF9076 (QSX)',
                    'Change interval: 250-500 hrs',
                  ],
                },
                {
                  type: 'Air Filters',
                  specs: [
                    'Fleetguard AF25371 (ISBe)',
                    'Fleetguard AF25384 (QSX)',
                    'Change interval: 500-1000 hrs',
                  ],
                },
                {
                  type: 'Fuel Filters',
                  specs: [
                    'Fleetguard FF5388 Primary',
                    'Fleetguard FF5334 Secondary',
                    'Change interval: 1000 hrs or yearly',
                  ],
                },
                {
                  type: 'Coolant',
                  specs: [
                    'Cummins Coolant Technology (CCT)',
                    '50/50 mix with distilled water',
                    'Flush interval: 2000 hours',
                  ],
                },
              ].map((filter, i) => (
                <div key={i} className="p-6 border border-slate-700 rounded-lg">
                  <h4 className="text-lg font-bold text-cyan-400 mb-3">{filter.type}</h4>
                  <ul className="space-y-2">
                    {filter.specs.map((spec, j) => (
                      <li key={j} className="text-gray-300 text-sm">• {spec}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common Fault Codes */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Common Cummins Fault Codes</h2>

          <div className="space-y-4">
            {[
              {
                code: 'SPN 98',
                desc: 'Battery Voltage Low',
                causes: 'Dead battery, loose connections, alternator failure',
                fix: 'Check battery charge, test alternator output',
              },
              {
                code: 'SPN 111',
                desc: 'Engine Coolant Temperature',
                causes: 'Thermostat stuck, low coolant, fan not operating',
                fix: 'Check coolant level, test thermostat, verify fan operation',
              },
              {
                code: 'SPN 157',
                desc: 'Engine Oil Pressure',
                causes: 'Low oil, worn pump, blocked filter',
                fix: 'Add oil, replace filter, verify pressure gauge',
              },
              {
                code: 'SPN 190',
                desc: 'Fuel Temperature',
                causes: 'Fuel heater malfunction, cold fuel, filter restriction',
                fix: 'Test fuel heater, check fuel quality, replace filter',
              },
              {
                code: 'SPN 251',
                desc: 'Engine Retarder Disable',
                causes: 'Electrical fault, wiring issue, module failure',
                fix: 'Check wiring harness, test connector continuity',
              },
              {
                code: 'SPN 520',
                desc: 'Boost Pressure Low',
                causes: 'Air leak, turbo issue, boost sensor fault',
                fix: 'Check turbo, test boost sensor, verify air intake',
              },
            ].map((fault, i) => (
              <div key={i} className="p-6 border border-slate-700 rounded-lg hover:border-cyan-500 transition">
                <div className="grid md:grid-cols-4 gap-4 items-start">
                  <div>
                    <p className="text-sm text-gray-400">CODE</p>
                    <p className="text-2xl font-bold text-cyan-400">{fault.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">DESCRIPTION</p>
                    <p className="text-gray-300 font-semibold">{fault.desc}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">LIKELY CAUSES</p>
                    <p className="text-gray-300 text-sm">{fault.causes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">DIAGNOSIS</p>
                    <p className="text-gray-300 text-sm">{fault.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Need Expert Technical Support?</h2>
          <p className="text-lg text-gray-200 mb-10">
            Our factory-trained technicians can help diagnose and resolve any Cummins generator issue.
          </p>
          <Link
            href="/contact?type=technical-support"
            className="inline-block px-8 py-4 bg-white text-cyan-900 font-bold rounded-lg hover:bg-gray-200 transition text-lg"
          >
            Request Technical Support
          </Link>
        </div>
      </section>
    </main>
  );
}
