import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AirConditioningPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const acTypes = [
    {
      type: 'Window/Portable Units',
      capacity: '0.75 - 2 kW',
      seer: '8-10',
      cost: '$200-800',
      best: 'Single rooms, temporary cooling, budget installations',
      efficiency: 'Lowest',
    },
    {
      type: 'Split Systems (Wall-Mounted)',
      capacity: '1 - 5 kW',
      seer: '13-18',
      cost: '$500-2500',
      best: 'Residential, small offices, efficient single-room cooling',
      efficiency: 'High',
    },
    {
      type: 'Multi-Split Systems',
      capacity: '3 - 25 kW',
      seer: '14-20',
      cost: '$2000-15000',
      best: 'Homes with multiple zones, commercial buildings',
      efficiency: 'High',
    },
    {
      type: 'Central HVAC',
      capacity: '5 - 150+ kW',
      seer: '14-19',
      cost: '$5000-100000+',
      best: 'Large buildings, hotels, commercial spaces',
      efficiency: 'Moderate-High',
    },
    {
      type: 'VRF (Variable Refrigerant Flow)',
      capacity: '10 - 500+ kW',
      seer: '17-22',
      cost: '$30000-500000+',
      best: 'Large commercial, hospitals, complex buildings',
      efficiency: 'Highest',
    },
  ];

  const errorCodes = {
    'Daikin/Hitachi Models': [
      { code: 'F1', meaning: 'Indoor Unit Malfunction', solution: 'Check filters, verify thermistor connection, inspect PCB for damage' },
      { code: 'F2', meaning: 'Outdoor Unit Issue', solution: 'Check condenser fans, verify DC voltage, test compressor contactor' },
      { code: 'C2', meaning: 'Communication Error', solution: 'Check wiring between units, verify power supply, restart system' },
      { code: 'H4', meaning: 'Refrigerant Low/High Pressure', solution: 'Check for leaks, verify charge amount, test compressor discharge' },
      { code: 'J2', meaning: 'Compressor Overload', solution: 'Reduce ambient temperature, check airflow, clean condenser' },
    ],
    'LG/Samsung Models': [
      { code: 'CH', meaning: 'Check Heater', solution: 'Verify heating element connections, test continuity, check thermostat' },
      { code: 'CO', meaning: 'Communication Error', solution: 'Check RS485 wiring, verify cable integrity, restart units' },
      { code: 'FH', meaning: 'Fan Error', solution: 'Inspect fan motor, clean blades, check capacitor voltage' },
      { code: 'TH', meaning: 'Temperature Sensor Error', solution: 'Test thermistor resistance, check wiring, replace if damaged' },
    ],
    'General Split Unit Codes': [
      { code: 'E0', meaning: 'Indoor Temperature Sensor Failure', solution: 'Test sensor with multimeter (10kΩ ±5% at 25°C), replace thermistor' },
      { code: 'E1', meaning: 'Outdoor Temperature Sensor Issue', solution: 'Verify sensor wiring, check for loose connections, test resistance' },
      { code: 'E2', meaning: 'Compressor Over-Current', solution: 'Check voltage supply (±10%), test compressor winding resistance' },
      { code: 'E3', meaning: 'Fan Motor Malfunction', solution: 'Inspect motor windings, test capacitor, check rotor freedom' },
    ],
  };

  const manufacturers = {
    'Premium Brands (Global)': [
      { name: 'Daikin', models: '1-100+ kW', strength: 'Reliability, efficiency, smart features' },
      { name: 'Mitsubishi Heavy', models: '1-80+ kW', strength: 'Quiet operation, heating performance' },
      { name: 'Fujitsu', models: '1-60+ kW', strength: 'Efficiency, compact design' },
      { name: 'Toshiba', models: '1-50+ kW', strength: 'Quality, competitive pricing' },
    ],
    'Value Brands (Asian)': [
      { name: 'LG', models: '0.75-50+ kW', strength: 'Price, features, local warranty' },
      { name: 'Samsung', models: '1-40+ kW', strength: 'Innovation, design, warranty' },
      { name: 'Gree', models: '0.75-100+ kW', strength: 'Affordability, growing support' },
      { name: 'Midea', models: '1-60+ kW', strength: 'Budget-friendly, reliable' },
    ],
    'Africa-Optimized': [
      { name: 'Innovex', models: '1-5 kW', strength: 'Designed for unstable power' },
      { name: 'Nitel', models: '0.75-3 kW', strength: 'Local support, maintenance service' },
    ],
  ];

  const troubleshooting = [
    {
      title: 'AC Not Cooling or Cooling Ineffectively',
      steps: [
        'Check thermostat setting - ensure temperature setting is below room temperature',
        'Inspect air filter - clogged filters reduce cooling by 20-30%, replace if dusty',
        'Verify outdoor unit fan is running (check for vibration and noise)',
        'Check refrigerant lines for ice formation on suction line (indicates low charge)',
        'Verify indoor evaporator coil is not frozen (turn off for 2 hours, check)',
        'Test compressor operation - should be warm/hot to touch (not cold)',
        'Check air duct blockages - verify cold air flows freely from indoor unit',
        'Low refrigerant charge (leak) requires professional service - do not add yourself',
      ],
    },
    {
      title: 'Water Leaking from Indoor Unit',
      steps: [
        'Check drain hose connection at indoor unit - should be secure and not kinked',
        'Verify drain hose slopes downward at 1:100 minimum gradient',
        'Clear drain hose blockage using compressed air or drain cleaner',
        'Inspect drain pan for cracks or corrosion - replace if damaged',
        'Check indoor unit is level - tilting prevents proper drainage',
        'Verify condensate pump (if elevated installation) is working',
        'For frozen evaporator coil causing excessive condensation - check refrigerant charge',
      ],
    },
    {
      title: 'AC Making Loud Noises',
      steps: [
        'Identify noise type: rattling (loose mounting), whistling (refrigerant flow), clicking (contactor)',
        'Check outdoor unit mounting - bolts should be tight, rubber isolators intact',
        'Inspect fan blades for damage or debris - clean or replace as needed',
        'Listen for refrigerant hissing (possible leak) or compressor grinding (bearing failure)',
        'Verify all electrical connections are tight (loose wire causes humming)',
        'Check if noise occurs during compressor startup (normal brief surge)',
        'Unusual grinding noise indicates compressor failure - requires replacement',
      ],
    },
    {
      title: 'Remote Control Not Working',
      steps: [
        'Replace batteries in remote (even if showing bars, battery voltage may be low)',
        'Check for obstacles between remote and indoor unit IR receiver',
        'Verify LED on remote lights when button pressed (if not, remote is dead)',
        'Test IR receiver visibility on unit (should show red light when signal sent)',
        'Try using manual power switch on indoor unit (usually small button)',
        'Restart both indoor and outdoor units (turn off mains for 5 minutes)',
        'Check wireless connectivity if app-controlled (verify Wi-Fi signal strength)',
      ],
    },
  ];

  const maintenance = [
    {
      period: 'Monthly',
      tasks: [
        'Visual inspection - look for water leaks, unusual corrosion, dust accumulation',
        'Check air filter condition - hold to light, replace if light doesn\'t show through',
        'Listen for unusual noises during normal operation',
        'Verify both indoor and outdoor units have power (check LED indicators)',
      ],
    },
    {
      period: 'Every 3 Months',
      tasks: [
        'Clean/replace air filter (more frequently in dusty climates)',
        'Inspect drain hose for blockages or pest entry (use water flush test)',
        'Clean indoor unit louvers with soft brush or vacuum',
        'Check outdoor unit for debris (leaves, dust) - clean if needed',
        'Test remote control functionality',
      ],
    },
    {
      period: 'Annually',
      tasks: [
        'Professional filter replacement (HEPA/premium filters recommended)',
        'Indoor coil cleaning (removes mold and bacteria buildup)',
        'Outdoor unit deep cleaning - remove compacted dust blocking airflow',
        'Refrigerant charge verification (can drift over time)',
        'Electrical connection inspection and tightening',
        'Fan motor lubrication if applicable',
        'Drain system flushing with disinfectant',
      ],
    },
    {
      period: 'Every 2-3 Years',
      tasks: [
        'Professional AC system vacuum test (checks for air/moisture in system)',
        'Compressor oil analysis (indicates bearing wear)',
        'Capacitor replacement (electrolytic degradation)',
        'Fan blade replacement if showing wear',
        'Complete PCB/contactor inspection',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-b border-cyan-600/30 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Air Conditioning & HVAC Systems</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl">
            Complete technical reference for AC installation, troubleshooting, maintenance, and optimization. Covers all system types from residential splits to commercial VRF systems.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg text-cyan-300 text-sm">
              0.75kW - 500+ kW
            </span>
            <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg text-cyan-300 text-sm">
              All Architectures
            </span>
            <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg text-cyan-300 text-sm">
              Thermal Comfort
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* AC Types */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">Air Conditioning System Types</h2>

          <div className="space-y-6">
            {acTypes.map((system, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-cyan-600/30 transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-cyan-400">{system.type}</h3>
                  <span className="px-3 py-1 bg-cyan-600/20 text-cyan-300 text-sm rounded">{system.efficiency}</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-400">Capacity</p>
                    <p className="text-white font-semibold">{system.capacity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">SEER Rating</p>
                    <p className="text-white font-semibold">{system.seer}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Cost Range</p>
                    <p className="text-white font-semibold">{system.cost}</p>
                  </div>
                </div>
                <p className="text-gray-300">✓ {system.best}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fundamentals */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">Cooling Technology & Thermodynamics</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">
              Air conditioning operates on the vapor-compression refrigeration cycle, a thermodynamic process that transfers heat from indoor spaces to outdoor environments using refrigerant circulation. Modern systems typically use R32 or R290 refrigerants (replacing older R22 which damages ozone layer), operating at pressures of 1.6-4.2 MPa depending on refrigerant type and temperature conditions. The compressor pressurizes low-pressure liquid refrigerant into high-pressure gas, which flows through the outdoor condenser coil where it releases heat to outside air and condenses back to liquid. This liquid then flows through an expansion device (thermostatic valve or capillary tube) where pressure drops suddenly, causing flash evaporation that creates the cold effect needed for interior cooling.
            </p>

            <p className="text-lg leading-relaxed">
              Cooling capacity depends on refrigerant charge accuracy, airflow optimization, and evaporator-condenser temperature differential. A 10% undercharge reduces cooling output by 20%, while overcharge by 10% increases compressor current by 15%, risking motor burnout. Proper charge verification requires temperature-pressure charts specific to each refrigerant type—incorrect charging by untrained technicians is the most common AC problem, accounting for approximately 40% of service calls in developing markets. Similarly, restricted airflow (dirty filters, blocked condenser) reduces capacity even on perfectly charged units. Kenya's dusty climate means filter maintenance is critical—a filter changed every 3 months performs 30% better than one neglected for a year.
            </p>

            <p className="text-lg leading-relaxed">
              Energy efficiency ratings (SEER, EER, COP) quantify system performance but are often misunderstood. SEER (Seasonal Energy Efficiency Ratio) is calculated under standardized test conditions not representative of actual hot climates—African systems operating in 40°C ambient will have 20-30% lower real efficiency than published SEER ratings. A unit rated SEER 18 in North America may perform as low as SEER 12 in Nairobi's climate, a critical consideration when comparing operating costs. Variable-speed compressors and inverter technology improve real-world efficiency by 15-25%, as they maintain optimal operating points across varying load conditions instead of cycling on/off.
            </p>

            <p className="text-lg leading-relaxed">
              Refrigerant line routing and insulation affect system efficiency and condensation formation. Suction line (low-pressure vapor return) must be heavily insulated and sloped upward to indoor unit to prevent condensate from entering compressor. Liquid line requires less insulation but must not be routed through hot spaces (attics, sun-exposed walls). Improper line routing can cause 10-15% efficiency loss and premature compressor failure. Professional installation includes pipe sizing calculations ensuring refrigerant velocity of 3-5 m/s (too slow causes oil return problems, too fast causes erosive wear).
            </p>

            <p className="text-lg leading-relaxed">
              Thermal comfort depends on more than just temperature—humidity control is equally important. AC systems remove approximately 0.7 liters of water per kW of cooling capacity daily, maintaining humidity around 50-60% for comfort. Oversized AC units cycle on/off frequently without running long enough to remove humidity, leaving spaces feeling damp despite low temperature. Proper sizing (detailed load calculations considering wall insulation, window area, occupancy) is essential for both efficiency and comfort. Many installations use oversized units as "quick fix" to guarantee cooling, sacrificing efficiency and humidity control in the process.
            </p>

            <p className="text-lg leading-relaxed">
              Noise levels from AC units range from 19dB (barely audible) in premium systems to 65dB (similar to conversation volume) in budget models. Indoor units typically generate 25-35dB, while outdoor compressors produce 50-65dB. Poorly installed outdoor units near bedrooms or offices create significant noise pollution. Rubber vibration isolators, acoustic cowls, and sound-absorbing enclosures can reduce outdoor unit noise by 10-15dB, critical for residential applications in noise-sensitive areas. Low-noise operation costs 20-30% more initially but justifies itself through comfort and reduced disturbance complaints.
            </p>
          </div>
        </section>

        {/* Error Codes */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">Error Codes & Diagnostics</h2>

          <div className="space-y-8">
            {Object.entries(errorCodes).map(([category, codes]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">{category}</h3>
                <div className="grid gap-4">
                  {codes.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <span className="bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded font-mono text-sm font-bold flex-shrink-0">
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

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">Troubleshooting Guide</h2>

          <div className="space-y-6">
            {troubleshooting.map((issue, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden hover:border-cyan-600/30 transition"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === `ts-${idx}` ? null : `ts-${idx}`)}
                  className="w-full p-6 text-left hover:bg-slate-800/50 transition flex justify-between items-center"
                >
                  <h3 className="text-xl font-bold text-cyan-400">{issue.title}</h3>
                  <span className={`text-2xl transition ${expandedSection === `ts-${idx}` ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {expandedSection === `ts-${idx}` && (
                  <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                    <ol className="space-y-3">
                      {issue.steps.map((step, sidx) => (
                        <li key={sidx} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-sm">
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
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">Maintenance Schedules</h2>

          <div className="space-y-8">
            {maintenance.map((schedule, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-cyan-600/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">{schedule.period}</h3>
                <ul className="space-y-3">
                  {schedule.tasks.map((task, tidx) => (
                    <li key={tidx} className="flex gap-3 text-gray-300">
                      <span className="text-cyan-400 text-xl flex-shrink-0">✓</span>
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
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">Leading AC Manufacturers</h2>

          <div className="space-y-12">
            {Object.entries(manufacturers).map(([category, brands]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-cyan-300 mb-6">{category}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {brands.map((brand, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-cyan-600/50 transition">
                      <h4 className="text-xl font-bold text-white mb-2">{brand.name}</h4>
                      <p className="text-sm text-cyan-300 mb-3 font-mono">{brand.models}</p>
                      <p className="text-gray-300 text-sm">✓ {brand.strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-600/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Professional AC Services</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Proper AC installation, regular maintenance, and timely repairs ensure optimal cooling, energy efficiency, and 10+ year system lifespan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition"
            >
              Request AC Consultation
            </Link>
            <Link
              href="/marketplace/parts"
              className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition"
            >
              Browse AC Components
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
