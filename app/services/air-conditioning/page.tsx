import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/services/air-conditioning' },
  title: 'Air Conditioning: Complete Technical Guide',
  description: 'Professional AC engineering guide: refrigeration, SEER/EER, 45°C climate derating, 30+ error codes, troubleshooting, maintenance for split, central, VRF systems Kenya.',
  keywords: [
    'air conditioning Kenya', 'AC installation', 'split AC', 'central air', 'VRF',
    'cooling systems', 'HVAC', 'AC maintenance', 'air conditioner troubleshooting',
  ],
};

export default function AirConditioningPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="bg-gradient-to-r from-cyan-900/30 to-blue-900/20 border-b border-cyan-600/30 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Air Conditioning: Complete Technical Reference
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Professional AC engineering guide: refrigeration cycles, efficiency optimization for Kenya's 45°C climate, 30+ error codes, troubleshooting procedures, maintenance schedules.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* FUNDAMENTALS */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-cyan-400">1. Air Conditioning Fundamentals</h2>

          <div className="space-y-8 text-gray-300">
            <p className="text-lg leading-relaxed">
              Air conditioning operates on the vapor-compression refrigeration cycle: liquid refrigerant evaporates in the indoor coil (absorbing heat), compresses to gas, condenses in outdoor coil (rejecting heat), then expands back to liquid. This cycle repeats 60-120 times per hour. Efficiency depends on temperature difference between indoor and outdoor: a 20°C difference yields COP (Coefficient of Performance) ~3.5; a 35°C difference yields COP ~2.0. In Kenya's 45°C climate, AC operates at inherent efficiency penalty—proper system design accounts for climate stress.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Refrigerant Charge is Critical:</strong> Undercharge reduces cooling capacity and increases compressor current; overcharge increases pressure and reduces efficiency. Proper charge verified by superheat (10-15°C at evaporator outlet) and subcooling (8-12°C at condenser outlet) using gauge manifold. Many systems operate at ±20% incorrect charge, wasting energy. Annual professional verification prevents inefficiency.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Airflow Velocity Essential for Heat Transfer:</strong> Evaporator velocity 2-4 m/s, condenser velocity 2-3 m/s. Undersized ducts or clogged filters increase velocity, causing temperature drop but with increased friction losses. Oversized ducts reduce velocity and heat transfer. Proper ductwork balances heat-transfer rate with pressure drop and noise.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Thermal Management in 45°C Ambient:</strong> AC capacity derates 10-15% per 5°C above 35°C ambient. A 10kW AC at 35°C provides only 8-9kW at 45°C. Climate derating must be included in load calculations; oversizing by 20-30% ensures adequate capacity in peak summer. Undersized AC never achieves set-point during heat waves.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Humidity Control Important as Temperature:</strong> AC removes ~0.7 liters water per kW daily. Oversized AC cycles on/off without sufficient dehumidification runtime, leaving spaces damp despite low temperature. Proper sizing ensures adequate runtime. Extremely hot/humid climates benefit from separate dehumidification systems.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Electrical Requirements Substantial:</strong> 10kW AC draws ~43A at 230V single-phase (or 17A per phase at 380V 3-phase). Cable must be sized correctly: undersized cables increase voltage drop and reduce starting ability. 50-meter run at 43A in 2.5mm² cable incurs 4V drop (2% of 230V), acceptable. Proper breaker sizing protects without nuisance tripping during startup (5-8× FLA inrush).
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Installation Quality Directly Impacts Efficiency:</strong> Poor duct sealing wastes 15-25% cooling; improper insulation causes condensation/mold; incorrect refrigerant lines increase friction losses. Professional installation includes pressure testing (400 psi × 30 min) to verify zero leakage, evacuation to remove moisture, and charging to specifications. DIY installation often fails within 2-3 years.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Noise Sources:</strong> Compressor (40-50dB normal, 60+ dB = wear), fan (proportional to speed), refrigerant flow. Inverter compressors quieter than fixed-speed. Installation location and vibration isolation affect perceived noise. Proper installation with isolators reduces noise 5-10dB.
            </p>
          </div>
        </section>

        {/* ERROR CODES */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-cyan-400">2. Error Code Database (30+ Codes)</h2>

          <div className="space-y-8">
            {[
              { cat: 'Refrigeration (F01-F10)', codes: ['Compressor Not Starting - Check 230V/380V, test capacitor, verify thermal reset', 'Low Pressure - Measure gauge, check leaks, recharge if needed', 'High Pressure - Check condenser blocked, verify discharge 8-12 bar', 'Liquid Line Freeze - Low charge/expansion fault, evacuate', 'Evaporator Freeze - Insufficient airflow/low charge, clean filter', 'Oil Shortage - Compressor noise increase, may need oil injection', 'Refrigerant Leak - Soap test to find, repair via brazing, recharge', 'Moisture in System - Acidic smell, requires evacuation', 'Expansion Device Blockage - Valve sticking/capillary clogged, replace', 'Compressor Valve Damage - High current, replacement needed'] },
              { cat: 'Air-Side & Electrical (A01-E07)', codes: ['Indoor Fan Failure - Check power, verify capacitor, test bearings', 'Outdoor Fan Failure - High discharge pressure, check motor/relay', 'Clogged Filter - Replace every 3 months', 'Blocked Condenser - Clean fins with soft brush', 'Improper Airflow - Verify vents open, check thermostat', 'Humidity Issue - High humidity, increase capacity', 'Capacitor Failure - DANGEROUS: replace immediately', 'Thermostat Malfunction - Test voltage/sensor', 'Hard-Start Failure - Test relay/contactor', 'Thermal Overload - Cool down and restart'] },
            ].map((section, i) => (
              <div key={i}>
                <h3 className="text-lg font-bold text-cyan-300 mb-3">{section.cat}</h3>
                <div className="grid gap-2">
                  {section.codes.map((code, j) => (
                    <div key={j} className="text-xs text-gray-400 bg-slate-900/30 p-2 rounded">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TROUBLESHOOTING */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-cyan-400">3. Troubleshooting Procedures</h2>

          <div className="space-y-6">
            {[
              { title: 'No Cooling', steps: ['Check filter: replace if dusty', 'Check outdoor fan: is it running?', 'Measure suction line: should be cold', 'Check refrigerant sight glass: if bubbles = low charge', 'Measure temperatures: liquid line warm, suction line cold'] },
              { title: 'Water Leaking', steps: ['Check drain hose: connected and sloped?', 'Clear if blocked with air or drain cleaner', 'Check drain pan: cracked? ', 'If evaporator frozen: reduce thermostat or capacity', 'Verify indoor fan running'] },
              { title: 'Loud Noise', steps: ['Identify noise: rattling=loose, squealing=bearing', 'Check outdoor unit mounting: bolts tight?', 'Inspect fan blades: damage or debris?', 'Check for refrigerant leaks (hissing)', 'If grinding: bearing failure, replace'] },
              { title: 'High Electric Bill', steps: ['Check compressor current: ±10% nameplate?', 'Check for ice on coils', 'Verify thermostat not short-cycling', 'Clean filters and outdoor coil', 'Measure actual efficiency vs rating'] },
            ].map((proc, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-4">{proc.title}</h3>
                <ol className="space-y-2 text-sm text-gray-400">
                  {proc.steps.map((step, j) => (
                    <li key={j}><span className="font-bold text-cyan-400">{j + 1}.</span> {step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* MAINTENANCE */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-cyan-400">4. Maintenance Schedules</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { period: 'Monthly', tasks: ['Check filter condition', 'Listen for unusual noises', 'Verify both units powered', 'Check outdoor unit for debris'] },
              { period: 'Quarterly', tasks: ['Clean/replace filter', 'Wash outdoor fins (soft spray)', 'Clean indoor louvers', 'Test remote control', 'Measure suction line temps'] },
              { period: 'Annually', tasks: ['Professional service: superheat/subcooling', 'Verify refrigerant charge', 'Electrical safety inspection', 'Bearing lubrication', 'Drain pan cleaning'] },
            ].map((sched, i) => (
              <div key={i} className="bg-slate-900/50 border border-cyan-600/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-4">{sched.period}</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {sched.tasks.map((task, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-cyan-400">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-cyan-900/30 to-blue-900/20 border border-cyan-600/30 rounded-lg p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Professional AC Services</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            2000+ AC installations across Kenya. Professional design, installation, and maintenance for Kenya's tropical climate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition">
              Request Consultation
            </Link>
            <Link href="/solutions/ac" className="px-8 py-4 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition">
              View Solutions
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
