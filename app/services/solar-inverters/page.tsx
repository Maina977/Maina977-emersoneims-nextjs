'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TechnicalDiagrams, {
  DCtoACCircuitDiagram,
  TemperatureDeratingCurve,
  MPPTEfficiencyGauge,
  EfficiencyComparisonChart,
  ErrorCodeSeverityMatrix,
  MaintenanceTimeline
} from '@/components/visualizations/TechnicalDiagrams';

export default function SolarInvertersPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const errorCodes = {
    'MPPT Models': [
      { code: 'E001', meaning: 'PV Input Voltage Too High', solution: 'Check panel connections, reduce string length, verify voltage rating' },
      { code: 'E002', meaning: 'PV Input Voltage Too Low', solution: 'Check for loose connections, damaged cables, insufficient irradiance' },
      { code: 'E003', meaning: 'Grid Voltage Abnormal', solution: 'Verify utility connection, check transformer, contact grid operator' },
      { code: 'E004', meaning: 'Grid Frequency Out of Range', solution: 'Grid frequency issue - wait for stabilization, check utility connection' },
      { code: 'E005', meaning: 'Inverter Temperature Too High', solution: 'Improve ventilation, reduce load, check cooling fans, clean filters' },
      { code: 'E006', meaning: 'Ground Fault Detected', solution: 'Check insulation, inspect cables for damage, verify grounding connections' },
    ],
    'Hybrid Models': [
      { code: 'B001', meaning: 'Battery Voltage Low', solution: 'Charge battery bank, check charger connection, verify battery health' },
      { code: 'B002', meaning: 'Battery Over Temperature', solution: 'Improve ventilation, check charger settings, inspect battery connections' },
      { code: 'B003', meaning: 'Battery Disconnect Failure', solution: 'Check disconnect switch, verify wiring, test contactor' },
      { code: 'I001', meaning: 'Inverter Overload', solution: 'Reduce load, check connected devices, verify battery capacity' },
      { code: 'I002', meaning: 'GFCI Trip', solution: 'Locate ground fault, repair or replace affected equipment, reset GFCI' },
    ],
    'String Inverters': [
      { code: 'S001', meaning: 'DC String Mismatch', solution: 'Check panel connections, ensure same panel models per string, verify wiring' },
      { code: 'S002', meaning: 'Communication Error', solution: 'Check display cable, verify network settings, restart inverter' },
      { code: 'S003', meaning: 'Fan Failure', solution: 'Clean fan, check motor, replace if damaged, verify power supply' },
      { code: 'S004', meaning: 'Data Storage Error', solution: 'Restart inverter, check SD card if equipped, contact manufacturer' },
    ],
  };

  const makes = {
    'Tier-1 Global': [
      { name: 'SMA Sunny Boy', models: '3.0 - 10.0 kW', specialty: 'String inverters, highest efficiency 98.2%' },
      { name: 'Fronius Symo', models: '3.0 - 24.0 kW', specialty: 'Hybrid capable, excellent grid support' },
      { name: 'ABB TRIO', models: '5.8 - 20.0 kW', specialty: 'Three-phase, industrial applications' },
      { name: 'Huawei SUN2000', models: '3.68 - 100+ kW', specialty: 'Smart energy management, battery-ready' },
    ],
    'Asian Leading': [
      { name: 'GoodWe', models: '1.0 - 50+ kW', specialty: 'Budget-friendly, reliable, good warranty' },
      { name: 'GROWATT', models: '2.0 - 60+ kW', specialty: 'Fast response, wide voltage range' },
      { name: 'Deye', models: '1.5 - 48+ kW', specialty: 'Hybrid focus, battery integration' },
      { name: 'Solis', models: '1.5 - 100+ kW', specialty: 'Fast frequency response, grid codes compliance' },
    ],
    'Local/Regional': [
      { name: 'Infini Solar', models: '3K - 60K VA', specialty: 'African-optimized, handles unstable grids' },
      { name: 'Victron Energy', models: '1.2 - 48 kW', specialty: 'Reliable, excellent for remote installations' },
      { name: 'Sunrise', models: '2 - 10 kW', specialty: 'East African distributor, local support' },
    ],
  };

  const troubleshooting = [
    {
      title: 'No Power Output Despite Sunlight',
      steps: [
        'Check DC switch is ON and AC disconnect is closed',
        'Verify PV voltage display shows 100V+ on display',
        'Check for error codes on LCD screen - note any blinking LEDs',
        'Inspect all cable connections for loose terminals or corrosion',
        'Verify grid connection light is green (if grid-tied)',
        'For battery systems, check battery voltage is above minimum (typically 48V for 48V systems)',
      ],
    },
    {
      title: 'Low Power Output in Good Sun',
      steps: [
        'Compare actual output to rated capacity at current irradiance',
        'Check panel cleanliness - dust/dirt reduces output 15-25%',
        'Verify no shading on panels (trees, buildings, clouds)',
        'Check cable sizes are correct (undersized reduces efficiency)',
        'Test string voltage match - imbalance causes string bypass',
        'Check inverter input voltage is within operating range (200-1000V typical)',
      ],
    },
    {
      title: 'Inverter Keeps Shutting Down',
      steps: [
        'Check ambient temperature - overheating at &gt;50°C causes auto-shutdown',
        'Verify cooling fans are running (listen for fan noise)',
        'Check inlet/outlet for dust blockage - clean filters monthly',
        'Ensure proper ventilation space around inverter (10cm minimum)',
        'Check for grid issues causing shutdown (voltage sags, frequency drift)',
        'Review error log history for patterns',
      ],
    },
    {
      title: 'Battery Not Charging (Hybrid Systems)',
      steps: [
        'Check battery disconnect switch is ON',
        'Verify battery voltage is below float voltage setting',
        'Check charging current in inverter menus - should show positive value',
        'Inspect battery cables for loose connections',
        'Verify battery temperature sensor reading is accurate',
        'Check charger settings match battery specifications exactly',
      ],
    },
  ];

  const maintenance = [
    {
      period: 'Monthly',
      tasks: [
        'Visual inspection of inverter for dust/debris accumulation',
        'Check all LED indicators for normal operation',
        'Inspect PV array for dust, bird droppings, or damage',
        'Review energy production data for unusual dips',
        'Check all accessible cable connections for corrosion',
      ],
    },
    {
      period: 'Quarterly',
      tasks: [
        'Clean PV panels with soft brush and distilled water (no pressure washers)',
        'Clean inverter intake/exhaust filters',
        'Check battery terminals for corrosion (if battery backup)',
        'Verify ground resistance measurement (should be &lt;5Ω)',
        'Test GFCI protection functionality',
        'Review and backup inverter settings/data',
      ],
    },
    {
      period: 'Annually',
      tasks: [
        'Professional thermal imaging inspection of panels and connections',
        'Full string voltage/current balancing check',
        'Battery load test (if battery system)',
        'Inverter firmware update if available',
        'Comprehensive safety inspection per IEC 61730',
        'Insurance documentation update with current system status',
        'Service engineer inspection (recommended for &gt;10kW systems)',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-b border-yellow-600/30 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Solar Inverters</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl">
            Professional installation, maintenance, troubleshooting, and optimization guides for solar photovoltaic inverter systems. Covering string inverters, hybrid inverters, and advanced energy management solutions.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-yellow-600/20 border border-yellow-600/50 rounded-lg text-yellow-300 text-sm">
              3kW - 100+ kW Systems
            </span>
            <span className="px-4 py-2 bg-yellow-600/20 border border-yellow-600/50 rounded-lg text-yellow-300 text-sm">
              15+ Manufacturer Models
            </span>
            <span className="px-4 py-2 bg-yellow-600/20 border border-yellow-600/50 rounded-lg text-yellow-300 text-sm">
              Grid-Tied & Hybrid
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Section 1: Fundamentals */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">Solar Inverter Fundamentals & Technology</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">
              A solar inverter is the critical component that converts the direct current (DC) electricity generated by photovoltaic (PV) panels into alternating current (AC) electricity suitable for household appliances and grid injection. Modern inverters are far more than simple converters—they are intelligent power management devices equipped with advanced software, monitoring capabilities, and protective systems that ensure safe, efficient operation of solar energy systems. In Kenya's climate with variable grid conditions, temperature extremes, and dust exposure, understanding inverter selection, installation, and maintenance is crucial for maximizing return on investment.
            </p>

            <p className="text-lg leading-relaxed">
              The three primary inverter categories—string inverters, micro-inverters, and hybrid (battery-capable) inverters—each serve different applications and budgets. String inverters, the most common and cost-effective option, connect multiple solar panels in series and are ideal for residential (3-10kW) and commercial (10-100kW) installations where shading is minimal and panel orientation is uniform. Hybrid inverters combine solar power with battery storage and grid connection, providing backup power during grid outages while maximizing self-consumption in time-of-use rate structures. Understanding the technical specifications—maximum DC input voltage (typically 600-1000V), AC output capability (3-phase or single-phase), efficiency ratings (typically 96-98%), and temperature derating curves—is essential for proper system design and troubleshooting.
            </p>

            <p className="text-lg leading-relaxed">
              Inverter efficiency directly impacts system energy yield and financial returns. High-efficiency inverters (&gt;97%) reduce power losses to heat, while European efficiency ratings (which average efficiency across multiple operating points) better reflect real-world performance than peak efficiency ratings. Temperature plays a critical role—every 10°C above the 25°C standard test condition reduces inverter efficiency by approximately 0.3-0.5%, a significant factor in East African climates where ambient temperatures regularly exceed 40°C. Proper ventilation, cable sizing, and installation location are therefore not cosmetic choices but engineering requirements that directly affect system profitability.
            </p>

            <p className="text-lg leading-relaxed">
              Grid-tied inverters include sophisticated anti-islanding protection, ensuring they automatically disconnect from the grid if utility power fails, preventing dangerous backfeeding to power lines. This protection is implemented through both hardware (DC switch, contactor) and software (frequency monitoring, voltage monitoring) layers. In Kenya's context, where power factor penalties are applied to large consumers and harmonics can interfere with utility equipment, modern inverters include power factor correction and harmonic filtering capabilities that benefit both the system owner and the grid operator.
            </p>

            <p className="text-lg leading-relaxed">
              Hybrid inverters add battery charge/discharge management, creating energy independence from grid fluctuations. These systems integrate MPPT (Maximum Power Point Tracking) functionality for solar optimization with sophisticated battery management algorithms that maximize battery lifespan. Lithium batteries typically accept 5000+ charge cycles, but this depends on operating within temperature ranges (typically 0-45°C), state-of-charge windows, and charge rates specified by the battery manufacturer. Professional hybrid system design requires detailed load analysis, backup power duration calculations, and battery sizing that balances cost with resilience requirements.
            </p>

            <p className="text-lg leading-relaxed">
              Installation quality directly determines system longevity and safety. All DC components operate at voltages up to 1000V, requiring specialized high-voltage DC cable sizing, waterproof connectors rated for solar applications, and proper grounding that protects against lightning strike damage. AC output circuits must be sized according to the inverter's maximum output current, typically requiring 2.5-6mm² cables for residential systems and 10-50mm² for commercial installations. Improper grounding is responsible for approximately 30% of solar system fire incidents—grounding resistance must be verified professionally and cannot be assumed.
            </p>
          </div>

          {/* VISUAL: DC-to-AC Circuit Diagram */}
          <DCtoACCircuitDiagram />

          {/* VISUAL: Temperature Derating Curve */}
          <TemperatureDeratingCurve />

          {/* VISUAL: MPPT Efficiency Gauge */}
          <MPPTEfficiencyGauge current={82} />

          {/* Video Section */}
          <div className="bg-slate-900/50 rounded-lg p-8 mt-8 border border-slate-800">
            <h3 className="text-2xl font-bold mb-4">Educational Video: Inverter Principles</h3>
            <p className="text-gray-400 mb-4">Understanding DC-to-AC conversion, MPPT algorithms, and grid synchronization</p>
            <div className="aspect-video bg-slate-950 rounded flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl mb-3">▶️ Video Placeholder</p>
                <p className="text-sm text-gray-500">15-minute educational video covering inverter principles</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">Comprehensive Troubleshooting Guide</h2>

          <div className="space-y-6">
            {troubleshooting.map((issue, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden hover:border-yellow-600/30 transition"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === `ts-${idx}` ? null : `ts-${idx}`)}
                  className="w-full p-6 text-left hover:bg-slate-800/50 transition flex justify-between items-center"
                >
                  <h3 className="text-xl font-bold text-yellow-400">{issue.title}</h3>
                  <span className={`text-2xl transition ${expandedSection === `ts-${idx}` ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {expandedSection === `ts-${idx}` && (
                  <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                    <ol className="space-y-3">
                      {issue.steps.map((step, sidx) => (
                        <li key={sidx} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center font-bold text-sm">
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

          <p className="text-gray-400 mt-8 text-sm">
            ⚠️ <strong>Safety Note:</strong> Work on inverter DC circuits requires specialized training. Contact a professional before attempting any high-voltage repair.
          </p>
        </section>

        {/* Section 3: Error Codes */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">Error Code Database & Solutions</h2>

          {/* VISUAL: Error Code Severity Matrix */}
          <ErrorCodeSeverityMatrix />

          <div className="space-y-8">
            {Object.entries(errorCodes).map(([category, codes]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">{category}</h3>
                <div className="grid gap-4">
                  {codes.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <span className="bg-red-600/20 text-red-300 px-3 py-1 rounded font-mono text-sm font-bold flex-shrink-0">
                          {item.code}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-white mb-2">{item.meaning}</p>
                          <p className="text-gray-400 text-sm">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Maintenance */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">Maintenance Schedules & Best Practices</h2>

          {/* VISUAL: Maintenance Timeline */}
          <MaintenanceTimeline />

          {/* VISUAL: Efficiency Comparison */}
          <EfficiencyComparisonChart />

          <div className="space-y-8">
            {maintenance.map((schedule, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-yellow-600/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">{schedule.period} Maintenance</h3>
                <ul className="space-y-3">
                  {schedule.tasks.map((task, tidx) => (
                    <li key={tidx} className="flex gap-3 text-gray-300">
                      <span className="text-yellow-400 text-xl flex-shrink-0">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Manufacturer Specifications */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">Leading Inverter Manufacturers & Models</h2>

          <div className="space-y-12">
            {Object.entries(makes).map(([tier, manufacturers]) => (
              <div key={tier}>
                <h3 className="text-2xl font-bold text-yellow-300 mb-6">{tier}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {manufacturers.map((mfg, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-yellow-600/50 transition">
                      <h4 className="text-xl font-bold text-white mb-2">{mfg.name}</h4>
                      <p className="text-sm text-yellow-300 mb-3 font-mono">{mfg.models}</p>
                      <p className="text-gray-300 text-sm">{mfg.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-8 mt-8">
            <h4 className="text-xl font-bold text-blue-300 mb-3">Local Availability in Kenya</h4>
            <p className="text-gray-300 mb-4">
              SMA, Fronius, and Huawei maintain direct dealer networks in Kenya with spare parts availability and after-sales support. GoodWe and GROWATT are increasingly popular due to cost competitiveness and expanding local service. Victron and Infini serve the off-grid and backup power segments with excellent reliability records in challenging environments.
            </p>
          </div>
        </section>

        {/* Section 6: Advanced Optimization */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">Advanced Performance Optimization</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">
              Maximum Power Point Tracking (MPPT) is the core optimization algorithm that continuously adjusts inverter input impedance to extract maximum power from solar panels under all conditions. Modern inverters use sophisticated MPPT algorithms that update thousands of times per second, responding to cloud cover, temperature changes, and dust accumulation. The "efficiency" of MPPT implementation varies among manufacturers—premium inverters achieve 99.5% MPPT efficiency while budget models may reach only 97%, representing a 2-3% annual energy loss that compounds over the system's 25-year lifespan.
            </p>

            <p className="text-lg leading-relaxed">
              Temperature derating is a critical but often overlooked factor in system design. Every inverter has a temperature-dependent output curve: at 50°C ambient, most inverters operate at only 80-85% of their rated power. In Kenya's climate where summer temperatures regularly exceed 45°C, system designers must account for this derating—a 10kW inverter may effectively produce only 8.5kW during peak summer temperatures. This is not a defect but a thermal limitation of semiconductor switches; proper system design accounts for this physics by either oversizing the solar array by 15-20% or accepting reduced peak output during hottest months.
            </p>

            <p className="text-lg leading-relaxed">
              String voltage optimization involves balancing panel voltage, cable sizing, and inverter input range to minimize losses. PV cable losses follow I²R principles: a 50-meter string with 10 amps current dissipates 50W, while 20 amps dissipates 200W. Professional system design calculates optimal string configuration based on panel wattage, available roof space, and cable run distances. This is not academic theory—improper string design can reduce annual energy yield by 8-12%, directly impacting financial returns.
            </p>
          </div>
        </section>

        {/* Section 7: Installation Standards */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">Installation Standards & Safety Compliance</h2>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-yellow-300 mb-3">International Standards</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>IEC 61730:</strong> Safety qualification of photovoltaic modules and systems</li>
                  <li>• <strong>IEC 61936:</strong> Power systems and equipment—High-voltage direct current</li>
                  <li>• <strong>IEEE 1547:</strong> Standard for interconnection and interoperability with distributed energy resources</li>
                  <li>• <strong>IEC 60364-7-712:</strong> Requirements for solar PV installations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-300 mb-3">Kenya-Specific Requirements</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Energy and Petroleum Regulatory Authority (EPRA) grid-connection approval for &gt;100kW systems</li>
                  <li>• Local building permits and electrical inspection compliance</li>
                  <li>• Kenya Bureau of Standards (KEBS) certification verification for imported equipment</li>
                  <li>• Utility company interconnection agreements and technical specifications</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-300 mb-3">Critical Installation Practices</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• DC disconnect switches must be accessible and clearly labeled</li>
                  <li>• All DC and AC circuits require appropriate overcurrent protection</li>
                  <li>• Grounding system verification (resistance &lt;5Ω) by licensed electrician</li>
                  <li>• Lightning surge protection for inverter inputs and outputs</li>
                  <li>• Proper ventilation ensuring 10cm clearance around inverter on all sides</li>
                  <li>• Fire-rated wiring isolation requirements in commercial installations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Professional Solar Inverter Services</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Need expert installation, maintenance, troubleshooting, or system optimization? Our team has logged over 500+ solar installations across Kenya with 99.2% uptime performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
            >
              Request Consultation
            </Link>
            <Link
              href="/marketplace/parts"
              className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition"
            >
              Browse Spare Parts
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
