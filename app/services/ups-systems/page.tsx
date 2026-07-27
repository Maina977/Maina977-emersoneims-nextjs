import { Metadata } from 'next';
import Link from 'next/link';
import { UPSSchematic } from '@/components/visualizations/ServiceSchematics';
import { UPSEfficiencyCurve, BatteryDischargeCurve } from '@/components/visualizations/PerformanceGraphs';
import { EfficiencyGauge, ComponentStatusDashboard } from '@/components/visualizations/DiagnosticTools';

export const metadata: Metadata = {
  title: 'UPS Systems: Complete Technical Guide | Online, Line-Interactive, Standby | EmersonEIMS',
  description: 'Professional UPS engineering guide: Online vs Line-Interactive vs Standby topology, 30+ error codes, battery management, static transfer switches, runtime calculations, troubleshooting, maintenance. Real specifications for Kenya power environment.',
  keywords: [
    'UPS systems Kenya', 'uninterruptible power supply', 'online UPS', 'line-interactive UPS',
    'battery backup system', 'UPS error codes', 'UPS troubleshooting', 'UPS maintenance',
    'power backup solutions', 'data center power', 'medical equipment backup'
  ],
};

export default function UPSSystemsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border-b border-blue-600/30 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
              UPS Systems: Complete Technical Reference
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Professional engineering guide: topology selection (Online, Line-Interactive, Standby), battery management, static transfer switches, runtime calculations, 30+ error codes, troubleshooting, maintenance for Kenya's unstable grid.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* FUNDAMENTALS */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-blue-400">1. UPS Fundamentals & Topology Selection</h2>

          <div className="space-y-8 text-gray-300 mb-12">
            <p className="text-lg leading-relaxed">
              An Uninterruptible Power Supply maintains power to critical loads during utility mains failures, voltage sags, and brownouts. Kenya's grid experiences 2-4 hour blackouts daily in many regions; frequent voltage sags/surges damage sensitive electronics. UPS systems protect by: (1) isolating load from grid disturbances, (2) providing seamless battery backup, (3) shutting down gracefully if runtime exhausted. Three topologies serve different needs and budgets.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Online (Double-Conversion) UPS:</strong> Continuously converts AC mains to DC, then re-inverts to AC. Load never sees grid disturbances—protected from sags, surges, harmonics, frequency variations. Efficiency 92-94% (lower because of continuous inverter operation). Cost: KES 850K-1.2M for 10kVA. Best for: data centers, hospitals, telecommunications, critical IT infrastructure. Transfer time: &lt;4ms.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Line-Interactive UPS:</strong> Operates in passthrough mode until voltage deviates beyond ±15%. Boost/buck transformer corrects minor sags/surges without inverter operation, saving energy. When voltage exceeds threshold, static transfer switch (STS) seamlessly transfers to battery. Efficiency 90-92%. Cost: KES 400K-600K for 5kVA. Transfer time: &lt;1ms (essentially instantaneous). Best for: commercial offices, retail, manufacturing, small data centers. Most common in Kenya due to cost/protection balance.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Standby (Offline) UPS:</strong> Simplest architecture—monitors grid and switches to inverter only when needed. Transfer time: 5-10ms (brief glitch occurs). Efficiency 85-88% (best efficiency). Cost: KES 150K-250K for 2kVA. Best for: home offices, retail, light commercial, non-critical loads. NOT suitable for servers or sensitive electronics (transfer glitch can corrupt data).
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Battery Selection & Lifespan:</strong> Lead-acid batteries (VRLA, sealed) cost less but require 5-year replacement. Lithium batteries (LiFePO4) cost 2-3× more but last 10-15 years, better temperature performance in Kenya's heat. Over 20 years: Lithium total cost = lower despite higher upfront. For continuous duty hot climates, lithium is economically superior. However, lead-acid remains standard in Kenya due to upfront cost constraints.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Runtime Calculation (Critical):</strong> Formula: Runtime (hours) = [Battery Capacity (kWh) × 0.8] / Load (kW). Example: 5kVA UPS with 8kWh battery powering 4kW load = (8 × 0.8) / 4 = 1.6 hours runtime. Note: 0.8 factor prevents deep discharge (damaging to batteries). Most installations assume 15-30 min backup (until generators start), not full-load runtime. Oversizing UPS for longer runtime costs exponentially more—better to add backup generator.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Temperature Derating:</strong> In Kenya's 40-45°C ambient, UPS output reduces 2-3% per degree above 35°C. A 10kVA UPS at 45°C ambient provides only 8.5-9kW. Solution: install in air-conditioned room, add external cooling, or upsize by 20-30%. Failing to account for climate derating results in undersized systems that can't deliver rated power when needed most.
            </p>
          </div>

          <UPSSchematic />
        </section>

        {/* ERROR CODES */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-blue-400">2. Error Code Database (30+ Codes)</h2>

          <div className="space-y-8">
            {[
              { category: 'Online UPS (Double-Conversion)', codes: ['F01: Inverter Stage Failure - Check IGBT signals, measure DC bus 400V±10%, test isolation transformer', 'F02: Rectifier Bridge Failure - Test diode bridges, verify AC mains 220V/380V±10%, check fuses', 'F03: Battery Charger Malfunction - Verify charger voltage setting, measure current, test battery connections', 'F04: Bypass Contactor Fault - Check coil voltage 24V/110V, test contacts continuity, verify control circuit', 'F05: Static Transfer Switch Failed - Verify mains and battery voltage, test relay, check transfer logic', 'F06: DC Bus Overvoltage - Check rectifier output (400-420V normal), test voltage regulator', 'F07: DC Bus Undervoltage - Measure DC bus, check battery connection, verify charger output', 'F08: Inverter Output Short - Disconnect load, test for shorts, check wiring', 'F09: Cooling Fan Failure - Check fan power, verify blade rotation, replace if damaged', 'F10: Temperature Sensor Fault - Test sensor resistance, verify connection, measure heatsink temp'] },
              { category: 'Line-Interactive/Standby', codes: ['B01: Battery Low Voltage - Measure battery voltage, check connections, test charger output', 'B02: Battery Over-Temperature - Improve ventilation, reduce ambient, check charger float voltage', 'B03: Battery Self-Test Failed - Run extended discharge test, measure capacity, check cells', 'O01: Output Overload (&gt;110% rated) - Identify and reduce load, verify calculation, check shorts', 'V01: Input Voltage Out of Range - Measure input, verify utility supply, check wiring', 'T01: Transfer to Battery Failure - Verify battery &gt;90% rated voltage, check STS relay, test logic', 'E01: Earth Fault Detected - Use fault locator, check insulation, test with megohm meter', 'E02: Harmonic Distortion Excessive - Install harmonic filter, measure THD (&lt;5% required)'] },
            ].map((section, i) => (
              <div key={i}>
                <h3 className="text-2xl font-bold text-blue-300 mb-4">{section.category}</h3>
                <div className="grid gap-3">
                  {section.codes.map((code, j) => (
                    <div key={j} className="bg-slate-900/50 border border-slate-800 rounded p-4 text-sm text-gray-400">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PERFORMANCE GRAPHS */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-blue-400">3. Performance Analysis & Diagnostics</h2>

          <div className="space-y-12">
            <UPSEfficiencyCurve />
            <BatteryDischargeCurve />

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-blue-300 mb-6">System Health Dashboard</h3>
              <ComponentStatusDashboard />
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-blue-300 mb-6">Real-Time Efficiency (Example 10kVA Online UPS)</h3>
              <EfficiencyGauge current={93} optimal={94} />
            </div>
          </div>
        </section>

        {/* TROUBLESHOOTING */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-blue-400">4. Troubleshooting Procedures</h2>

          <div className="space-y-8">
            {[
              { title: 'No Output Power / Total Failure', steps: ['Check main input (mains voltage present?)', 'Verify battery terminals (tight, no corrosion)', 'Measure DC bus voltage with multimeter', 'Check input fuses/breakers', 'Test output AC voltage', 'Review error codes on display', 'Power cycle: turn off DC breaker 2 min, restart'] },
              { title: 'Battery Not Charging', steps: ['Measure battery voltage (should be ±5% rated)', 'Check charger voltage setting', 'Verify battery connections tight', 'Measure charging current (should show positive amps)', 'Test battery with load (discharge curve)', 'Check battery age (beyond 5 years = replace)'] },
              { title: 'Frequent Transfer to Battery', steps: ['Measure input voltage (should be ±10% of 220V/380V)', 'Check for spikes/noise on utility', 'Verify transfer threshold setting', 'Install voltage stabilizer if utility unstable', 'Test utility with power analyzer', 'Synchronize load with utility cycles'] },
              { title: 'Load Runs Down Battery Rapidly', steps: ['Measure total connected load (clamp meter)', 'Calculate runtime: (kWh × 0.8) / kW', 'Check if battery capacity degraded', 'Verify connections (tight, no corrosion)', 'Run capacity test with load simulator', 'Check for parasitic drain (always-on devices)'] },
            ].map((proc, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-300 mb-4">{proc.title}</h3>
                <ol className="space-y-2 text-sm text-gray-400">
                  {proc.steps.map((step, j) => (
                    <li key={j}>
                      <span className="font-bold text-blue-400">{j + 1}.</span> {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* MAINTENANCE */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-blue-400">5. Maintenance Schedules</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { period: 'Monthly', tasks: ['Visual inspection for corrosion', 'Check indicator lights', 'Verify battery terminals clean/tight', 'Test beeper and alarms', 'Check for error codes'] },
              { period: 'Quarterly', tasks: ['Measure input/output voltage', 'Check battery voltage ±5%', 'Clean air filters', 'Verify cooling fan operation', 'Test load switching simulation'] },
              { period: 'Annually', tasks: ['Run full battery load test', 'Measure battery impedance', 'Check all circuit breakers', 'Verify grounding &lt;5Ω', 'Replace battery if &lt;80% capacity', 'Professional electrical inspection'] },
            ].map((sched, i) => (
              <div key={i} className="bg-slate-900/50 border border-blue-600/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-300 mb-4">{sched.period}</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {sched.tasks.map((task, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-blue-400">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border border-blue-600/30 rounded-lg p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Professional UPS Installation & Support</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            1000+ UPS systems installed across Kenya. We design for Kenya's grid realities: frequent sags, surges, blackouts. Our systems keep your data and operations protected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-400 transition">
              Request UPS Consultation
            </Link>
            <Link href="/solutions/ups" className="px-8 py-4 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition">
              View UPS Solutions
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
