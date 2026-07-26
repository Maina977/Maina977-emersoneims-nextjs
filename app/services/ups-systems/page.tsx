'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UPSSystemsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const errorCodes = {
    'Online UPS (Double-Conversion)': [
      { code: 'F01', meaning: 'Inverter Failure', solution: 'Check inverter board connections, verify DC bus voltage 400V±10%, test isolation transformer' },
      { code: 'F02', meaning: 'Rectifier Failure', solution: 'Check AC input, test diode bridges with multimeter, verify mains voltage 220/380V±10%' },
      { code: 'F03', meaning: 'Battery Charger Malfunction', solution: 'Verify charger voltage setting, check battery connections, test charging current' },
      { code: 'F04', meaning: 'Bypass Contactor Fault', solution: 'Check contactor coil, verify control voltage, test contactor contacts for continuity' },
      { code: 'F05', meaning: 'Static Transfer Switch (STS) Failed', solution: 'Verify mains voltage before attempting bypass, check STS relay, test switching logic' },
    ],
    'Line-Interactive UPS': [
      { code: 'B01', meaning: 'Battery Low Voltage Alarm', solution: 'Check battery connections, measure battery voltage (should match rating), check for battery damage' },
      { code: 'B02', meaning: 'Battery Over Temperature', solution: 'Improve ventilation, check charger settings (float voltage), test battery temperature sensor' },
      { code: 'B03', meaning: 'Battery Fault Detected', solution: 'Run battery self-test, verify battery age <3 years, check battery cable resistance' },
      { code: 'O01', meaning: 'Output Overload', solution: 'Check connected devices, verify load is within UPS capacity, check for short circuits' },
    ],
    'Offline/Standby UPS': [
      { code: 'S01', meaning: 'Mains Voltage Out of Range', solution: 'Check utility voltage with multimeter, verify input wiring, contact utility provider' },
      { code: 'S02', meaning: 'Battery Backup Failed', solution: 'Test battery with load, check battery terminals, verify battery age <5 years' },
      { code: 'S03', meaning: 'Transfer Switch Failure', solution: 'Check switch contacts, verify changeover voltage setting, test with load simulation' },
    ],
  };

  const makes = {
    'Enterprise Solutions (>20kVA)': [
      { name: 'Eaton 93PM', models: '10-500 kVA', specialty: 'High efficiency 96%, three-phase, modular' },
      { name: 'Schneider Electric Galaxy', models: '10-800 kVA', specialty: 'Industry leader, scalable architecture' },
      { name: 'ABB PowerWare', models: '15-700 kVA', specialty: 'High availability, fast switchover' },
      { name: 'Vertiv Mitsubishi', models: '20-1000 kVA', specialty: 'Cooling integration, compact design' },
    ],
    'Commercial/Mid-Range (3-20kVA)': [
      { name: 'APC Smart-UPS', models: '3-15 kVA', specialty: 'Most popular, excellent support' },
      { name: 'Riello UPS', models: '2-20 kVA', specialty: 'Italian engineering, reliable' },
      { name: 'SOCOMEC', models: '1-20 kVA', specialty: 'Hybrid UPS, scalable' },
      { name: 'Legrand Keor', models: '2-10 kVA', specialty: 'Compact, efficient design' },
    ],
    'Residential/Small Office (0.5-3kVA)': [
      { name: 'Luminous Zelio', models: '0.5-3 kVA', specialty: 'Indian brand, affordable, good warranty' },
      { name: 'CyberPower Pro', models: '0.65-3 kVA', specialty: 'US brand, budget-friendly' },
      { name: 'Microtek Hybrid', models: '0.8-5 kVA', specialty: 'Solar hybrid capability' },
      { name: 'Kuvera Plus', models: '1-5 kVA', specialty: 'Affordable, local support' },
    ],
  };

  const upsTypes = [
    {
      name: 'Offline/Standby UPS',
      power: '0.5-5 kVA',
      efficiency: '85-90%',
      transfer: '5-10ms',
      cost: '$100-500',
      best: 'Small offices, homes, non-critical loads',
      description: 'UPS monitor mains and switch to battery only on power failure. Transfer time may cause brief power loss to sensitive equipment.'
    },
    {
      name: 'Line-Interactive UPS',
      power: '1-10 kVA',
      efficiency: '92-95%',
      transfer: '2-4ms',
      cost: '$300-2000',
      best: 'Mid-size offices, servers, retail',
      description: 'Automatic voltage regulation (AVR) stabilizes utility voltage without battery drain. Faster switchover than standby models.'
    },
    {
      name: 'Online/Double-Conversion UPS',
      power: '3-500+ kVA',
      efficiency: '93-96%',
      transfer: '0ms (zero)',
      cost: '$2000-50000+',
      best: 'Data centers, hospitals, critical infrastructure',
      description: 'Continuous conversion ensures zero transfer time and perfect power quality. Highest cost but essential for mission-critical loads.'
    },
    {
      name: 'Modular/Parallel UPS',
      power: '10-1000+ kVA',
      efficiency: '96%+',
      transfer: 'Configurable',
      cost: '$20000-200000+',
      best: 'Large enterprises, carrier-grade infrastructure',
      description: 'Multiple UPS modules operate in parallel for redundancy and scalability. Hot-swappable modules for no downtime upgrades.'
    },
  ];

  const troubleshooting = [
    {
      title: 'UPS Not Providing Backup Power',
      steps: [
        'Check if battery is present and connected (look for battery terminal connections)',
        'Verify battery age - lithium <10 years, AGM <5 years, lead-acid <3 years',
        'Test battery voltage with multimeter (should show ±5% of rated voltage)',
        'Check if "mains failed" indicator lights up when you cut power to the UPS',
        'Verify load is within UPS capacity (check nameplate kVA rating)',
        'Test battery disconnect switch - ensure it is turned ON',
        'Perform battery self-test (available on most UPS models via display menu)',
      ],
    },
    {
      title: 'Backup Runtime is Too Short',
      steps: [
        'Calculate actual connected load - subtract low-priority devices first',
        'Battery capacity decreases with age - 3-year-old battery provides ~80% original capacity',
        'Cold temperature reduces battery capacity - <10°C reduces output by 20-30%',
        'Check battery connections for corrosion or loose terminals',
        'Verify charger is properly charging (check LED indicator on charger)',
        'For lithium batteries, check internal fuse is not blown (no output)',
        'Consider upgrading to larger UPS or additional battery modules',
      ],
    },
    {
      title: 'UPS Beeping Constantly',
      steps: [
        'One beep every 30s = battery mode (running on battery, check mains connection)',
        'Continuous rapid beeping = critical battery low (save data, shutdown immediately)',
        'Beeping on power-up = may indicate fault - check error code display',
        'For network-managed UPS, check if alarm mute button is activated',
        'Verify mains voltage is not too low (input <180V or >260V on 220V system)',
        'Check for overload condition - reduce load below UPS capacity',
      ],
    },
    {
      title: 'UPS Not Charging Battery',
      steps: [
        'Verify mains supply is available and correct voltage (check with multimeter)',
        'Check if charger circuit breaker is tripped (toggle breaker OFF then ON)',
        'Look for green "charging" LED indicator on charger module',
        'Test battery terminal voltage - should increase over 1-2 hours of charging',
        'Check battery connections for loose terminals or corrosion',
        'Verify UPS is in correct mode (not in discharge test mode)',
        'For some UPS models, charging current may be limited if battery voltage is very low',
      ],
    },
  ];

  const maintenance = [
    {
      period: 'Monthly',
      tasks: [
        'Visual inspection for dust, fluid leaks, or corrosion',
        'Check all LED indicators are green (normal operation)',
        'Verify battery terminal connections are tight',
        'Listen for abnormal fan noises',
        'Check UPS is running cool to touch (not hot)',
      ],
    },
    {
      period: 'Quarterly',
      tasks: [
        'Clean air filters and intake/exhaust vents',
        'Test battery backup by simulating mains failure (brief test)',
        'Check UPS display for battery health percentage',
        'Verify alarm test by holding test button for 3 seconds',
        'Clean battery terminals with baking soda if corrosion appears',
      ],
    },
    {
      period: 'Semi-Annually',
      tasks: [
        'Perform full battery load test (ensure runtime meets expectations)',
        'Check electrical continuity of ground connections',
        'Verify UPS input/output voltage with multimeter',
        'Inspect cables for damage, wear, or improper routing',
        'Update UPS firmware if patches are available',
      ],
    },
    {
      period: 'Annually',
      tasks: [
        'Professional load bank test (discharge battery fully, measure capacity)',
        'Battery capacity analysis - if <80% original, plan replacement',
        'Thermal imaging inspection for hot spots in inverter/rectifier',
        'Complete firmware update and settings audit',
        'Verify warranty status and compliance documentation',
        'Service engineer inspection for large enterprise UPS (>10kVA)',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-b border-red-600/30 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">Uninterruptible Power Supply (UPS) Systems</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl">
            Complete technical guide to UPS installation, configuration, troubleshooting, and battery management. Coverage spans standalone systems to modular data center solutions.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg text-red-300 text-sm">
              0.5kVA - 1000+ kVA
            </span>
            <span className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg text-red-300 text-sm">
              All UPS Topologies
            </span>
            <span className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg text-red-300 text-sm">
              Battery Management
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* UPS Types */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-red-400">UPS Architectures: Topologies Explained</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6 mb-8">
            <p className="text-lg leading-relaxed">
              Uninterruptible Power Supplies are mission-critical devices that provide emergency backup power during utility outages while conditioning power quality for sensitive equipment. Four distinct UPS topologies serve different applications, from home office protection to enterprise data center infrastructure. Understanding the technical differences between offline, line-interactive, online, and modular architectures is essential for selecting appropriate protection for specific loads and budgets. Each topology presents trade-offs between cost, efficiency, power quality, and infrastructure requirements—selection depends on load criticality, budget constraints, and environmental conditions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upsTypes.map((type, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-red-600/30 transition">
                <h3 className="text-xl font-bold text-red-400 mb-3">{type.name}</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Power Range:</span>
                    <span className="text-white font-semibold">{type.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Efficiency:</span>
                    <span className="text-white font-semibold">{type.efficiency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transfer Time:</span>
                    <span className="text-white font-semibold">{type.transfer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cost Range:</span>
                    <span className="text-white font-semibold">{type.cost}</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{type.description}</p>
                <p className="text-red-300 text-sm">✓ Best for: {type.best}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fundamentals */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-red-400">Power Quality & Battery Technology</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">
              Battery chemistry represents the foundation of UPS performance and reliability. Lead-acid batteries (traditional and AGM) remain the most cost-effective option for emergency backup, with sealed AGM batteries offering superior performance in mobile and compact applications. AGM batteries can tolerate deeper discharge cycles (80% depth) and wider operating temperatures (-20°C to +60°C) compared to flooded lead-acid, making them ideal for Kenya's variable climate. However, battery lifespan depends critically on operating conditions: a 5-year rated battery achieves full lifespan only if maintained between 20-25°C; every 10°C above this reduces lifespan by 50%, meaning a battery in a hot server room may deliver only 2.5 years effective life.
            </p>

            <p className="text-lg leading-relaxed">
              Lithium-iron-phosphate (LiFePO4) batteries have emerged as premium alternatives offering 3-5x lifespan (10+ years typical) with better depth-of-discharge tolerance (up to 95% usable capacity vs. 50-80% for lead-acid). While initial cost is 2-3x higher, the total cost of ownership often favors lithium for applications where battery replacement labor costs and downtime are significant. LiFePO4 requires integrated battery management systems (BMS) to protect against overcharge, over-discharge, and thermal runaway—these integrated electronics add cost but ensure safety and extend usable battery life.
            </p>

            <p className="text-lg leading-relaxed">
              Power quality issues beyond simple outages include voltage sag (brief voltage reductions), harmonics (non-sinusoidal voltage waveforms), and frequency deviation—all of which can damage sensitive electronics even during utility operation. Online UPS topology eliminates these issues by continuously converting mains to DC, then DC back to AC, ensuring perfect waveform quality regardless of utility conditions. For computing equipment, network infrastructure, and medical devices, online UPS may be mandatory despite higher cost, as power quality problems cause more equipment damage than simple outages.
            </p>

            <p className="text-lg leading-relaxed">
              Transfer time—the interval when UPS switches from mains to battery—must be sufficiently fast to prevent equipment shutdown. Most modern computers and network equipment require <4ms transfer time (less than one cycle of 50Hz power). Offline UPS models typically transfer in 5-10ms, causing brief power loss that can trigger UPS disconnection in some sensitive equipment. Line-interactive and online UPS achieve <4ms transfer, making them mandatory for production servers and critical infrastructure. For Kenya's grid infrastructure with frequent brownouts and sags, line-interactive UPS provides excellent protection without the cost premium of online models.
            </p>

            <p className="text-lg leading-relaxed">
              Scalability and parallel operation enable enterprise UPS installations to provide redundancy without a single point of failure. Modern modular UPS systems allow N+1 architecture (where a single module failure does not disrupt service) by operating multiple UPS units in parallel. This requires sophisticated synchronization logic, automatic load sharing, and hot-swappable architecture—features found only in enterprise-grade systems. For critical applications (hospitals, telecoms, data centers), modular UPS with redundancy is often mandatory by regulatory or organizational standards, despite significantly higher capital cost.
            </p>

            <p className="text-lg leading-relaxed">
              Environmental conditions profoundly impact UPS reliability. Temperature extremes reduce battery capacity and inverter efficiency; humidity promotes corrosion on battery terminals and contact points; and altitude above 2000m reduces cooling efficiency, requiring derating or additional ventilation. Kenya's data center environments at sea level (Nairobi coast) and 1600m elevation (Nairobi) present different cooling challenges. Inland locations with ambient temperatures frequently >40°C require either oversized cooling systems or lower-capacity units to ensure safe operation within temperature ratings.
            </p>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-red-400">Troubleshooting Guide</h2>

          <div className="space-y-6">
            {troubleshooting.map((issue, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden hover:border-red-600/30 transition"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === `ts-${idx}` ? null : `ts-${idx}`)}
                  className="w-full p-6 text-left hover:bg-slate-800/50 transition flex justify-between items-center"
                >
                  <h3 className="text-xl font-bold text-red-400">{issue.title}</h3>
                  <span className={`text-2xl transition ${expandedSection === `ts-${idx}` ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {expandedSection === `ts-${idx}` && (
                  <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                    <ol className="space-y-3">
                      {issue.steps.map((step, sidx) => (
                        <li key={sidx} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold text-sm">
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

        {/* Error Codes */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-red-400">Error Codes & Diagnostics</h2>

          <div className="space-y-8">
            {Object.entries(errorCodes).map(([category, codes]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-red-300 mb-4">{category}</h3>
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

        {/* Maintenance */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-red-400">Maintenance & Testing Schedules</h2>

          <div className="space-y-8">
            {maintenance.map((schedule, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-red-600/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-red-300 mb-4">{schedule.period}</h3>
                <ul className="space-y-3">
                  {schedule.tasks.map((task, tidx) => (
                    <li key={tidx} className="flex gap-3 text-gray-300">
                      <span className="text-red-400 text-xl flex-shrink-0">✓</span>
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
          <h2 className="text-4xl font-bold mb-8 text-red-400">Leading UPS Manufacturers</h2>

          <div className="space-y-12">
            {Object.entries(makes).map(([category, manufacturers]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-red-300 mb-6">{category}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {manufacturers.map((mfg, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-red-600/50 transition">
                      <h4 className="text-xl font-bold text-white mb-2">{mfg.name}</h4>
                      <p className="text-sm text-red-300 mb-3 font-mono">{mfg.models}</p>
                      <p className="text-gray-300 text-sm">{mfg.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-600/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">UPS System Design & Support</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Proper UPS sizing and configuration prevents silent failures that leave critical infrastructure unprotected. Our team designs systems for server rooms, medical facilities, and telecommunications infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-red-500 text-black font-bold rounded-lg hover:bg-red-400 transition"
            >
              Request Design Consultation
            </Link>
            <Link
              href="/marketplace/parts"
              className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition"
            >
              Browse UPS Components
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
