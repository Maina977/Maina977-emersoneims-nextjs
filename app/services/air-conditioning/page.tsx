'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AirConditioningPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const errorCodes = {
    'Refrigeration Cycle': [
      { code: 'F01', meaning: 'Compressor Not Starting', severity: 'High', solution: 'Check power supply (230V/380V present?), test capacitor (run + start), verify thermal overload reset' },
      { code: 'F02', meaning: 'Low Pressure (Low Refrigerant Charge)', severity: 'High', solution: 'Measure pressure gauge (LP should be 2-4 bar), check for leaks (soap test), recharge if no leaks' },
      { code: 'F03', meaning: 'High Pressure (Overcharge or Blocked Condenser)', severity: 'High', solution: 'Check condenser coil (clean if blocked), verify discharge pressure (8-12 bar normal), measure liquid line temp' },
      { code: 'F04', meaning: 'Liquid Line Freeze-Up', severity: 'High', solution: 'Indicates low charge, expansion device malfunction, or moisture (water ice), evacuate system' },
      { code: 'F05', meaning: 'Evaporator Coil Freeze', severity: 'High', solution: 'Insufficient airflow or low charge, clean filter, verify fan operation, defrost cycle' },
      { code: 'F06', meaning: 'Oil Shortage in Compressor', severity: 'High', solution: 'Compressor noise increase, oil circulation issue, may require oil injection or compressor replacement' },
      { code: 'F07', meaning: 'Refrigerant Leakage', severity: 'High', solution: 'Use soap solution to find leaks, repair via brazing or replacement, recharge system' },
      { code: 'F08', meaning: 'Moisture (Water) in System', severity: 'High', solution: 'Acidic smell, bubbling in sight glass, requires system evacuation and drying' },
      { code: 'F09', meaning: 'Expansion Device Blockage', severity: 'High', solution: 'Thermostatic valve sticking or capillary tube clogged, replacement required' },
      { code: 'F10', meaning: 'Compressor Valve Damage', severity: 'High', solution: 'High current draw, low pressure/high pressure together, compressor replacement needed' },
    ],
    'Air-Side Problems': [
      { code: 'A01', meaning: 'Indoor Fan Motor Failure', severity: 'High', solution: 'No air from indoor unit, check motor power supply, verify capacitor, test for bearing damage' },
      { code: 'A02', meaning: 'Outdoor Condenser Fan Not Running', severity: 'High', solution: 'High discharge pressure, check fan motor winding, verify relay operation' },
      { code: 'A03', meaning: 'Clogged Air Filter', severity: 'Medium', solution: 'Reduced airflow, replace filter (every 3 months), clean permanent filters' },
      { code: 'A04', meaning: 'Blocked Outdoor Condenser', severity: 'High', solution: 'High discharge pressure, high noise, clean fins and coils with soft brush' },
      { code: 'A05', meaning: 'Improper Airflow (Closed Vents)', severity: 'Medium', solution: 'Insufficient cooling, verify all supply/return vents open, check thermostat sensor location' },
      { code: 'A06', meaning: 'Humidification Issue', severity: 'Medium', solution: 'Humidity &gt;60%, cooling capacity adequate, low capacity causes excessive dehumidification' },
    ],
    'Electrical & Control': [
      { code: 'E01', meaning: 'Compressor Hard-Start Failure', severity: 'High', solution: 'Won\'t start even with capacitor, test relay/contactor, verify start winding' },
      { code: 'E02', meaning: 'Thermal Overload Trip', severity: 'Medium', solution: 'Compressor shuts down after 5-30 min, high ambient or high discharge temp, allow cooling' },
      { code: 'E03', meaning: 'Capacitor Failure', severity: 'High', solution: 'No start attempt or hum only, bulging/leaking capacitor, dangerous—replace immediately' },
      { code: 'E04', meaning: 'Contactor Chatter', severity: 'Medium', solution: 'Intermittent operation, pitted contacts, low control voltage, replace contactor' },
      { code: 'E05', meaning: 'Relay Malfunction', severity: 'Medium', solution: 'Start relay clicks but doesn\'t engage, verify 230V at relay, test with new relay' },
      { code: 'E06', meaning: 'Thermostat Malfunction', severity: 'Medium', solution: 'Won\'t turn on/off, measure voltage at thermostat, verify temperature sensor resistance' },
      { code: 'E07', meaning: 'PCB Component Failure', severity: 'High', solution: 'Multiple functions failing, burned components visible, replacement of control board needed' },
    ],
    'Communication & Display': [
      { code: 'C01', meaning: 'Remote Control Not Working', severity: 'Low', solution: 'Replace batteries, check IR receiver, verify line-of-sight, test on manual switch' },
      { code: 'C02', meaning: 'Display Shows Fault Code', severity: 'High', solution: 'Reference manual for code meaning, most codes indicate sensor failure or electrical issue' },
      { code: 'C03', meaning: 'WiFi Connection Lost', severity: 'Low', solution: 'Reconnect to network, verify signal strength, reset WiFi module' },
      { code: 'C04', meaning: 'Communication Error (Indoor-Outdoor)', severity: 'High', solution: 'Check wiring between units, verify continuity with multimeter, test connector corrosion' },
    ],
  };

  const troubleshooting = [
    { title: 'AC Not Cooling or Cooling Ineffectively', steps: ['1. Check thermostat: is temp setting below room temp?', '2. Inspect air filter: replace if dusty (reduces airflow 20-30%)', '3. Check outdoor unit: is fan running, any noise/vibration?', '4. Measure temperatures: suction line should be cold, liquid line warm', '5. Check refrigerant sight glass: if bubbles, low refrigerant charge', '6. If all normal: compressor may be failing or capacity insufficient'] },
    { title: 'Water Leaking from Indoor Unit', steps: ['1. Check drain hose: should be connected at bottom of unit', '2. Verify hose slopes downward at 1% grade minimum', '3. If blocked: use compressed air or drain cleaner to clear', '4. Check drain pan: if cracked, condensate leaks into room', '5. If evaporator coil frozen: reduce thermostat or reduce capacity'] },
    { title: 'Loud Noise or Vibration', steps: ['1. Identify noise type: rattling=loose part, squealing=bearing, humming=motor', '2. Check outdoor unit mounting: bolts tight, isolators intact', '3. Inspect fan blades: any damage or debris', '4. Check for refrigerant leaks (hissing sound)', '5. If grinding inside compressor: bearing failure, replacement needed'] },
    { title: 'High Electricity Consumption', steps: ['1. Measure compressor current: should be within ±10% of nameplate', '2. Check evaporator coil: ice buildup indicates high load', '3. Verify thermostat: short cycling causes high consumption', '4. Measure efficiency: capacity/power consumption should match rating', '5. Clean filters and outdoor coil: improper airflow increases load'] },
  ];

  const maintenance = [
    { period: 'Monthly', tasks: ['Check air filter condition: replace if airflow reduced', 'Listen for unusual noises: grinding, squealing, hissing', 'Verify both indoor & outdoor units have power', 'Spot-check if outdoor unit is clean: no leaves/debris covering coils'] },
    { period: 'Quarterly', tasks: ['Clean/replace air filter if not monthly', 'Wash outdoor unit fins: use water spray (never pressure wash)', 'Clean indoor unit louvers with soft brush', 'Test remote control and all modes', 'Measure suction line temperature: should be 8-12°C below room temp'] },
    { period: 'Annually', tasks: ['Professional service: measure superheat & subcooling', 'Refrigerant charge verification: use gauge manifold', 'Electrical safety inspection: measure insulation resistance', 'Bearing lubrication if applicable', 'Check drain pan for algae/mold: clean if needed'] },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-b border-cyan-600/30 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Air Conditioning: Complete Technical Reference</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl">
            Comprehensive engineering guide for split, central, and VRF air conditioning systems. Refrigeration cycles, error codes, thermal management, troubleshooting, and maintenance for Kenya's tropical climate.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">1. Air Conditioning Fundamentals & System Design</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">Air conditioning operates on the vapor-compression refrigeration cycle: liquid refrigerant evaporates in the indoor coil (absorbing heat), gas is compressed, condenses in outdoor coil (rejecting heat), then expands back to liquid. This cycle repeats 60-120 times per hour. Efficiency depends on temperature difference between indoor and outdoor: a 20°C difference yields COP (Coefficient of Performance) ~3.5; a 35°C difference yields COP ~2.0. In Kenya's 45°C climate, AC operates at inherent efficiency penalty—proper system design and sizing accounts for climate stress.</p>

            <p className="text-lg leading-relaxed">Refrigerant charge is critical: undercharge reduces cooling capacity and increases compressor current; overcharge increases pressure and reduces efficiency. Proper charge verified by superheat (10-15°C at evaporator outlet) and subcooling (8-12°C at condenser outlet) measurements using a gauge manifold. Many systems operate at ±20% incorrect charge, wasting energy and risking compressor damage. Annual professional verification prevents this inefficiency.</p>

            <p className="text-lg leading-relaxed">Airflow velocity is essential for heat transfer: evaporator velocity should be 2-4 m/s, condenser velocity 2-3 m/s. Undersized ducts or clogged filters increase velocity, causing temperature drop across the coil but with increased friction losses and noise. Oversized ducts reduce velocity and heat transfer effectiveness. Proper ductwork design balances heat-transfer rate with pressure drop and noise.</p>

            <p className="text-lg leading-relaxed">Thermal management in 45°C ambient requires larger condenser than in temperate climates. AC capacity derates 10-15% per 5°C above 35°C ambient. A 10kW AC rated at 35°C provides only 8-9kW at 45°C. This climate derating must be included in load calculations; oversizing by 20-30% ensures adequate capacity in peak summer. Undersized AC never achieves set-point temperature during heat waves.</p>

            <p className="text-lg leading-relaxed">Humidity control is as important as temperature: AC systems remove ~0.7 liters water per kW cooling capacity daily. Oversized AC cycles on/off without sufficient runtime to remove humidity, leaving spaces feeling damp despite low temperature (below 50% RH is uncomfortable). Proper sizing ensures adequate runtime for dehumidification. Extremely hot/humid climates benefit from separate dehumidification.</p>

            <p className="text-lg leading-relaxed">Electrical requirements for AC are substantial: a 10kW AC draws approximately 43A at 230V single-phase (or 17A per phase at 380V 3-phase). Cable must be sized correctly: undersized cables increase voltage drop and reduce starting ability. A 50-meter run at 43A in 2.5mm² cable incurs 4V drop (2% of 230V), acceptable limit. Proper breaker sizing protects against short circuits without nuisance tripping during compressor start transients (5-8× FLA inrush current).</p>

            <p className="text-lg leading-relaxed">Installation quality directly impacts efficiency: poor duct sealing wastes 15-25% cooling; improper insulation causes condensation and mold; incorrect refrigerant lines (too small or too long) increase friction losses. Professional installation includes pressure testing (400 psi for 30 min) to verify zero leakage, evacuation to remove moisture, and charging to design specifications. DIY or rushed installation often fails within 2-3 years.</p>

            <p className="text-lg leading-relaxed">Maintenance extends lifespan and preserves efficiency: filters replaced every 3 months prevent 20-30% efficiency loss; condenser coil cleaning every 6 months prevents pressure rise and efficiency degradation; annual professional service with superheat/subcooling measurement ensures optimal operation. Most AC failures result from poor maintenance, not design defects.</p>

            <p className="text-lg leading-relaxed">Noise from AC includes: compressor noise (40-50dB normal, 60+ dB indicates wear), fan noise (proportional to blade speed), refrigerant flow noise. Newer inverter compressors run quieter than fixed-speed units. Installation location and vibration isolation affect perceived noise: same AC in a bedroom sounds annoying, in a workshop unnoticed. Proper installation with isolators and acoustic enclosures reduces noise 5-10dB.</p>

            <p className="text-lg leading-relaxed">Seasonal maintenance is essential: pre-cooling season: verify refrigerant charge, clean filters/coils, check electrical connections. Pre-heating season (for VRF systems): verify heat pump operation, test reversing valve. Post-season: store equipment properly, drain water from drains, verify isolation valves. Climate extremes (45°C or monsoon humidity) accelerate component aging; maintenance frequency should increase in harsh conditions.</p>

            <p className="text-lg leading-relaxed">Energy efficiency ratings (SEER, EER, COP) are measured under standard 35°C ambient; African systems operating at 40-45°C ambient achieve 20-30% lower real efficiency. A unit rated SEER 18 in North America may perform at SEER 12-14 in Kenya. Load calculations must account for this climate penalty or result in undersized systems. The cheapest AC (lowest upfront cost) becomes expensive when operating costs are calculated over 10+ year lifespan.</p>
          </div>
        </section>

        {/* ERROR CODES */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">2. Error Code Database (30+ Codes)</h2>

          <div className="space-y-8">
            {Object.entries(errorCodes).map(([category, codes]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">{category}</h3>
                <div className="grid gap-4">
                  {codes.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-cyan-600/30 transition">
                      <div className="flex items-start gap-4">
                        <span className={`px-3 py-1 rounded font-mono text-sm font-bold flex-shrink-0 ${
                          item.severity === 'High' ? 'bg-red-600/20 text-red-300' : 'bg-amber-600/20 text-amber-300'
                        }`}>
                          {item.code}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-white mb-1">{item.meaning}</p>
                          <p className="text-gray-400 text-sm mb-2">Severity: {item.severity}</p>
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

        {/* TROUBLESHOOTING */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">3. Troubleshooting Procedures</h2>

          <div className="space-y-6">
            {troubleshooting.map((issue, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === `ts-${idx}` ? null : `ts-${idx}`)}
                  className="w-full p-6 text-left hover:bg-slate-800/50 transition flex justify-between items-center"
                >
                  <h3 className="text-xl font-bold text-cyan-400">{issue.title}</h3>
                  <span className={`text-2xl transition ${expandedSection === `ts-${idx}` ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {expandedSection === `ts-${idx}` && (
                  <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                    <ol className="space-y-3">
                      {issue.steps.map((step, sidx) => (
                        <li key={sidx} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-sm text-black">
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

        {/* MAINTENANCE */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">4. Maintenance Schedules</h2>

          <div className="space-y-8">
            {maintenance.map((schedule, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-cyan-600/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">{schedule.period} Maintenance</h3>
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

        {/* CTA */}
        <section className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-600/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Professional AC Services</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            2000+ AC installations across Kenya. Professional maintenance, energy audits, and custom system design for tropical climate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition">
              Request Consultation
            </Link>
            <Link href="/generators/spare-parts" className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition">
              Browse Parts
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
