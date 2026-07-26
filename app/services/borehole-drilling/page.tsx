'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BoreholeDrillingPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const drillingMethods = [
    {
      method: 'Percussion/Cable Tool Drilling',
      depth: '0-300m',
      speed: '5-30m/day',
      cost: 'Low ($3000-10000)',
      best: 'Shallow wells, remote areas, low water demands',
      description: 'Traditional impact method using repetitive drop of heavy bit to fracture rock. Slow but proven, excellent for consolidated rock formations.'
    },
    {
      method: 'Rotary Mud Circulation',
      depth: '0-1000m',
      speed: '20-100m/day',
      cost: 'Medium ($8000-50000)',
      best: 'Mid-depth production wells, varied geology',
      description: 'Modern high-speed method using rotating bit with circulating drilling mud. Industry standard for most African boreholes.'
    },
    {
      method: 'Air Percussion/Hammer Drilling',
      depth: '0-500m',
      speed: '50-300m/day',
      cost: 'Medium-High ($15000-40000)',
      best: 'Hard rock, fast penetration required',
      description: 'High-velocity air-driven hammer provides rapid penetration in fractured rock. Excellent for crystalline basement formations.'
    },
    {
      method: 'DTH (Down-Hole Hammer)',
      depth: '0-2000m+',
      speed: '100-400m/day',
      cost: 'High ($40000-150000+)',
      best: 'Deep hard-rock exploration, mine dewatering',
      description: 'Pneumatic hammer positioned at bit for maximum efficiency. Fastest penetration available but requires compressor capability.'
    },
  ];

  const boreholeTypes = [
    { type: 'Domestic Wells', yield: '0.5-2 m³/day', use: 'Single household, small farm', depth: '20-100m', casing: 'Plastic PVC 50-75mm' },
    { type: 'Production Wells', yield: '2-50 m³/day', use: 'Community, commercial, small town', depth: '50-300m', casing: 'Steel 100-150mm' },
    { type: 'Large Public Supply', yield: '50-500+ m³/day', use: 'Towns, industrial facilities', depth: '100-500m+', casing: 'Steel 200-400mm' },
    { type: 'Monitoring Wells', yield: 'Minimal', use: 'Groundwater level tracking, quality monitoring', depth: '10-500m', casing: 'PVC 50mm' },
    { type: 'Mine Dewatering', yield: '100-5000 m³/day', use: 'Mining operations', depth: '50-2000m', casing: 'Steel 150-600mm' },
  ];

  const troubleshooting = [
    {
      title: 'No Water or Very Low Yield During/After Drilling',
      steps: [
        'Check drilling site location - ensure it\'s in identified groundwater zone (not weathered outcrop)',
        'Verify borehole depth reaches water table (confirm via drilling records)',
        'Test static water level before pumping - should show water present',
        'Check for screen clogging - sand or fine particles blocking perforated section',
        'Perform development/well flushing to restore permeability (pump aggressively for 4-8 hours)',
        'Verify aquifer yields at proposed extraction rate (test pump 4-6 hours minimum)',
        'For collapsed zones, may require deepening or relocated hole',
      ],
    },
    {
      title: 'Excessive Sand/Fine Particles in Water',
      steps: [
        'Install/replace filter screens if missing or damaged (120-mesh minimum for fine sands)',
        'Perform aggressive well development using surge block or compressed air',
        'Reduce pump intake velocity - sand production often means over-pumping',
        'Install sand trap (settlement tank) if temporary, consider finer screens if persistent',
        'Check casing integrity - perforation damage allows formation sand intrusion',
        'May require screen slot size reduction or relocating intake section',
      ],
    },
    {
      title: 'Declining Yield Over Weeks/Months',
      steps: [
        'Check for seasonal water table decline (compare to historical patterns)',
        'Inspect screens for bio-fouling (bacterial slime) - chlorine treatment recommended',
        'Verify pump is functioning correctly (head, impeller wear)',
        'Test water chemistry for iron content &gt;0.3mg/L indicates iron bacteria',
        'Check for confined aquifer pressure decline (if artesian borehole)',
        'May indicate over-extraction beyond sustainable yield',
      ],
    },
    {
      title: 'Contaminated Water (Chemical or Bacterial)',
      steps: [
        'Collect samples for lab analysis (E. coli, nitrate, heavy metals)',
        'Check for surface contamination sources (pit latrines, septic systems within 30m)',
        'Verify borehole construction - proper seal between casing and formation required',
        'For bacterial contamination, install UV or chlorination treatment',
        'For chemical contamination, may require: new borehole, deeper section, or point-of-use treatment',
        'Document contamination source and implement protection measures',
      ],
    },
  ];

  const manufacturers = {
    'Large Drilling Companies': [
      { name: 'Mudabikwa Drilling', coverage: 'Kenya-wide', specialties: 'Deep rotary, hard rock' },
      { name: 'Prime Drilling Ltd', coverage: 'East Africa', specialties: 'Production wells, mining' },
      { name: 'African Drill Services', coverage: 'Kenya/Uganda', specialties: 'Air percussion, fast drilling' },
    ],
    'Pump Equipment Suppliers': [
      { name: 'Grundfos East Africa', models: 'SQ/SP/SP-X series', specialties: 'Submersible pumps 0.5-300kW' },
      { name: 'Aqua Solutions', models: 'Local brands + imports', specialties: 'Maintenance, spare parts' },
      { name: 'Godrej Pumps', models: 'Centrifugal/submersible', specialties: 'Reliable, locally available' },
    ],
    'Drilling Equipment Rental': [
      { name: 'Apex Equipment', rigs: 'Percussion + rotary', coverage: 'Nairobi region' },
      { name: 'Crown Drilling', rigs: 'DTH + air compressors', coverage: 'Kenya-wide' },
    ],
  };

  const maintenance = [
    {
      period: 'Monthly',
      tasks: [
        'Visual inspection of wellhead - check for water seepage around casing',
        'Measure water level (static, non-pumping condition)',
        'Check pump operation - listen for unusual noises, vibration',
        'Inspect sanitary seal integrity',
        'Review water production if metered',
      ],
    },
    {
      period: 'Quarterly',
      tasks: [
        'Water quality test (basic parameters: turbidity, color, taste, odor)',
        'Pump performance test - measure discharge rate, compare to baseline',
        'Inspect all above-ground fittings for corrosion, leaks',
        'Clean wellhead area - remove vegetation, debris',
        'Check for new contamination sources in vicinity',
      ],
    },
    {
      period: 'Annual',
      tasks: [
        'Professional water quality analysis (microbial, chemical)',
        'Pump inspection and impeller cleaning if yield declining',
        'Static/dynamic water level measurements (document for trend analysis)',
        'Screen condition assessment if accessible',
        'Infrastructure repairs (concrete pad, fence, apron)',
        'Update borehole record with current status and maintenance performed',
      ],
    },
    {
      period: 'As Needed',
      tasks: [
        'Well development if yield declining or sand production observed',
        'Pump replacement (typically 7-10 year lifespan)',
        'Screen repair/replacement if damaged',
        'Casing repair if corrosion evident',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-b border-blue-600/30 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">Borehole Drilling & Groundwater Development</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl">
            Complete technical guide to groundwater exploration, borehole drilling, well development, and long-term management. Covers domestic wells to large municipal supplies.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg text-blue-300 text-sm">
              0.5 - 5000+ m³/day
            </span>
            <span className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg text-blue-300 text-sm">
              Domestic to Industrial
            </span>
            <span className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg text-blue-300 text-sm">
              All Drilling Methods
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Fundamentals */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">Groundwater Fundamentals & Hydrogeology</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">
              Groundwater represents the most reliable freshwater source for Kenya's growing population, particularly in arid and semi-arid regions where surface water is intermittent or absent. Successful groundwater development requires understanding aquifer types, recharge mechanisms, and sustainable yield limitations—concepts often misunderstood in rural drilling programs leading to over-exploitation and eventual borehole abandonment. Kenya's groundwater occurs in three primary aquifer systems: the shallow weathered basement aquifer (0-100m, highly variable yield), the deeper fractured hard-rock aquifer (100-500m, more consistent but variable), and confined aquifers in sedimentary basins (50-1000m+, often artesian). Each requires different drilling techniques, screening approaches, and yield expectations.
            </p>

            <p className="text-lg leading-relaxed">
              Aquifer recharge in East Africa depends critically on rainfall and geological permeability. In low-rainfall areas (&lt;500mm annually), recharge occurs during episodic storms, creating seasonal water table fluctuations of 10-50m between wet and dry seasons. This climatic variability demands conservative yield estimates: a borehole producing 10m³/day during the rainy season may produce only 2m³/day during dry season, requiring storage tanks or interconnected well networks for year-round supply. Professional aquifer testing (72-hour pumping tests measuring drawdown curves) is essential before finalizing water supply design, yet many rural boreholes are installed without proper yield verification, leading to chronic shortages during dry seasons.
            </p>

            <p className="text-lg leading-relaxed">
              Borehole site selection combines geological, hydrogeological, and socio-economic factors. Successful exploration uses multiple data sources: satellite imagery identifying fracture traces (associated with higher yield potential), geological maps showing aquifer presence and depth, existing borehole data from surrounding areas, and geophysical surveys (vertical electrical sounding) indicating promising zones before drilling commitment. In Kenya's varied geology, site selection can mean the difference between a productive borehole yielding 20m³/day and a failed hole yielding nothing—making professional assessment far less expensive than failed drilling attempts. The cost of unsuccessful drilling (drilling rig mobilization, drilling time, equipment without water production) often equals the cost of proper exploration.
            </p>

            <p className="text-lg leading-relaxed">
              Borehole construction quality directly determines longevity and water quality. Proper design includes: water-tight surface casing (typically 20-50m depth) sealing groundwater from surface contamination; intermediate casing sections isolating unstable formations; and production casing with perforated screens positioned at specific aquifer zones. Screen selection is critical—inappropriate mesh size clogs (too fine) or allows sand production (too coarse). Typical practice uses 120-200 mesh screens in fine sands, 100 mesh in medium sands, and 60 mesh in coarse sands, but this requires site-specific geological assessment. Over-sized boreholes designed for easy drilling often result in poor seal and cross-contamination between aquifer zones.
            </p>

            <p className="text-lg leading-relaxed">
              Water quality testing before supply activation is mandatory but often omitted. Groundwater naturally contains dissolved minerals (hardness, salinity), and may contain bacterial contamination from inadequate surface sealing or iron bacteria from the aquifer. Comprehensive baseline testing should include: bacteria (E. coli), nitrate (indicator of contamination), major ions (calcium, magnesium, sodium, chloride), trace elements (arsenic, fluoride, iron), and pH. East African groundwater commonly contains naturally elevated fluoride (causing dental fluorosis) and iron bacteria (causing discoloration and taste), both requiring treatment before use—factors that must be identified and budgeted for in water supply planning.
            </p>

            <p className="text-lg leading-relaxed">
              Sustainable yield calculations prevent over-extraction and aquifer depletion. The sustainable yield is the long-term extraction rate without exceeding recharge capacity, typically 60-80% of calculated annual recharge. Many productive aquifers are being over-exploited—communities install multiple new boreholes, each individually sustainable, but collectively exceeding aquifer recharge capacity, leading to progressive water-level decline. Proper resource assessment requires aquifer mapping and recharge calculations—engineering exercises rarely performed in rural Kenya, despite their critical importance for long-term water security.
            </p>
          </div>
        </section>

        {/* Drilling Methods */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">Drilling Methods & Technology Comparison</h2>

          <div className="grid gap-6 mb-8">
            {drillingMethods.map((method, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-blue-600/30 transition">
                <h3 className="text-xl font-bold text-blue-400 mb-3">{method.method}</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-400 mb-1">Typical Depth</p>
                    <p className="text-white font-semibold">{method.depth}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Penetration Speed</p>
                    <p className="text-white font-semibold">{method.speed}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Cost Range</p>
                    <p className="text-white font-semibold">{method.cost}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Best For</p>
                    <p className="text-white font-semibold text-sm">{method.best}</p>
                  </div>
                </div>
                <p className="text-gray-300">{method.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Borehole Types */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">Borehole Types & Applications</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-blue-300">Type</th>
                  <th className="text-left p-4 text-blue-300">Yield</th>
                  <th className="text-left p-4 text-blue-300">Application</th>
                  <th className="text-left p-4 text-blue-300">Depth</th>
                  <th className="text-left p-4 text-blue-300">Casing</th>
                </tr>
              </thead>
              <tbody>
                {boreholeTypes.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-800 hover:bg-slate-900/30 transition">
                    <td className="p-4 text-white font-semibold">{item.type}</td>
                    <td className="p-4 text-gray-300">{item.yield}</td>
                    <td className="p-4 text-gray-300">{item.use}</td>
                    <td className="p-4 text-gray-300">{item.depth}</td>
                    <td className="p-4 text-gray-300">{item.casing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">Troubleshooting Common Issues</h2>

          <div className="space-y-6">
            {troubleshooting.map((issue, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden hover:border-blue-600/30 transition"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === `ts-${idx}` ? null : `ts-${idx}`)}
                  className="w-full p-6 text-left hover:bg-slate-800/50 transition flex justify-between items-center"
                >
                  <h3 className="text-xl font-bold text-blue-400">{issue.title}</h3>
                  <span className={`text-2xl transition ${expandedSection === `ts-${idx}` ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {expandedSection === `ts-${idx}` && (
                  <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                    <ol className="space-y-3">
                      {issue.steps.map((step, sidx) => (
                        <li key={sidx} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {sidx + 1}
                          </span>
                          <span className="text-gray-300 pt-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Maintenance */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">Maintenance & Monitoring</h2>

          <div className="space-y-8">
            {maintenance.map((schedule, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-blue-600/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">{schedule.period}</h3>
                <ul className="space-y-3">
                  {schedule.tasks.map((task, tidx) => (
                    <li key={tidx} className="flex gap-3 text-gray-300">
                      <span className="text-blue-400 text-xl flex-shrink-0">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Manufacturers */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">Kenya Drilling & Equipment Providers</h2>

          <div className="space-y-12">
            {Object.entries(manufacturers).map(([category, providers]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-blue-300 mb-6">{category}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {providers.map((provider, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-blue-600/50 transition">
                      <h4 className="text-xl font-bold text-white mb-2">{provider.name}</h4>
                      <p className="text-sm text-blue-300 mb-3 font-semibold">
                        {provider.coverage || provider.models}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {provider.specialties || provider.rigs}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-600/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Expert Borehole Services</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional site selection, drilling, development, and long-term management ensures productive boreholes that serve communities for decades. Avoid costly failures with proper technical assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-400 transition"
            >
              Request Drilling Consultation
            </Link>
            <Link
              href="/marketplace/parts"
              className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition"
            >
              Browse Drilling Equipment
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
