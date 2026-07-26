'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UPSSystemsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const errorCodes = {
    'Online UPS (Double-Conversion)': [
      { code: 'F01', meaning: 'Inverter Stage Failure', severity: 'High', solution: 'Check inverter IGBT gate drive signals, measure DC bus voltage (400V±10%), test isolation transformer continuity' },
      { code: 'F02', meaning: 'Rectifier Bridge Failure', severity: 'High', solution: 'Test diode bridges with multimeter, verify AC mains voltage 220V/380V±10%, check for blown fuses' },
      { code: 'F03', meaning: 'Battery Charger Malfunction', severity: 'Medium', solution: 'Verify charger output voltage setting, measure charging current, test battery connections for resistance' },
      { code: 'F04', meaning: 'Bypass Contactor Fault', severity: 'High', solution: 'Check contactor coil voltage 24V/110V, test contactor contacts for continuity, verify control circuit supply' },
      { code: 'F05', meaning: 'Static Transfer Switch (STS) Failed', severity: 'High', solution: 'Verify mains and battery voltage before STS operation, test switching relay, check transfer logic' },
      { code: 'F06', meaning: 'DC Bus Overvoltage', severity: 'High', solution: 'Check rectifier output voltage (should be 400-420V), test voltage regulator, verify load rejection' },
      { code: 'F07', meaning: 'DC Bus Undervoltage', severity: 'High', solution: 'Measure DC bus voltage with multimeter, check battery connection, verify charger output' },
      { code: 'F08', meaning: 'Inverter Output Short Circuit', severity: 'High', solution: 'Disconnect output load, test for short circuits with multimeter, check output wiring' },
      { code: 'F09', meaning: 'Cooling Fan Failure', severity: 'Medium', solution: 'Check fan motor power supply, verify fan blade rotation, replace if damaged, clean intake' },
      { code: 'F10', meaning: 'Temperature Sensor Fault', severity: 'Medium', solution: 'Test temperature sensor resistance (typically 10kΩ at 25°C), verify sensor connection, measure actual heatsink temp' },
    ],
    'Line-Interactive UPS': [
      { code: 'B01', meaning: 'Battery Low Voltage Alarm', severity: 'High', solution: 'Measure battery voltage (should match UPS rating), check battery connections, test battery charger output' },
      { code: 'B02', meaning: 'Battery Over-Temperature', severity: 'High', solution: 'Improve ventilation around batteries, reduce ambient temperature, check charger float voltage setting' },
      { code: 'B03', meaning: 'Battery Self-Test Failed', severity: 'Medium', solution: 'Run extended battery load test, measure battery capacity with discharge curve, check for failed cells' },
      { code: 'B04', meaning: 'Battery BMS Communication Loss', severity: 'Medium', solution: 'Check RS485/CAN communication cable, verify battery pack firmware, test BMS board power' },
      { code: 'O01', meaning: 'Output Overload (>110% rated)', severity: 'High', solution: 'Identify and reduce connected load, verify load power calculation, check for short circuits' },
      { code: 'O02', meaning: 'Output Short Circuit', severity: 'High', solution: 'Disconnect all loads immediately, test output wiring with multimeter, check for damaged cables' },
      { code: 'V01', meaning: 'Input Voltage Out of Range', severity: 'Medium', solution: 'Measure input voltage with multimeter, verify utility supply, check input wiring connections' },
      { code: 'V02', meaning: 'Input Voltage Unstable', severity: 'Medium', solution: 'Check for load dump events on utility, install voltage stabilizer, verify power line quality' },
      { code: 'T01', meaning: 'Transfer to Battery Failure', severity: 'High', solution: 'Verify battery voltage is sufficient (>90% rated), check STS relay, test transfer switching logic' },
      { code: 'C01', meaning: 'Communication/Display Error', severity: 'Low', solution: 'Check display cable connections, restart UPS, verify serial/ethernet port configuration' },
    ],
    'Offline/Standby UPS': [
      { code: 'S01', meaning: 'Mains Voltage Out of Range (<180V or >280V)', severity: 'Medium', solution: 'Measure voltage at input, verify utility supply, check input wiring for loose connections' },
      { code: 'S02', meaning: 'Battery Backup Unavailable', severity: 'High', solution: 'Test battery with load simulator, measure battery voltage, verify battery age <5 years' },
      { code: 'S03', meaning: 'Transfer Switch Malfunction', severity: 'High', solution: 'Check relay contacts for pitting, measure changeover voltage threshold, test with load simulation' },
      { code: 'S04', meaning: 'Charger Output Abnormal', severity: 'Medium', solution: 'Measure charger output voltage (should be float voltage setting), check charging current, verify battery connections' },
      { code: 'S05', meaning: 'Output Frequency Unstable', severity: 'Medium', solution: 'Check output transformer, verify inverter oscillator frequency, test with frequency meter' },
      { code: 'S06', meaning: 'Battery Standby Monitoring Failed', severity: 'Low', solution: 'Restart battery self-test, verify battery monitoring circuit, check for corroded battery terminals' },
    ],
    'Power Distribution & Control': [
      { code: 'P01', meaning: 'Overload on Single Phase (3-phase systems)', severity: 'High', solution: 'Measure current on each phase, rebalance load distribution, verify cable sizing for each phase' },
      { code: 'P02', meaning: 'Phase Sequence Incorrect', severity: 'High', solution: 'Verify ABC phase connection, swap any two phases to correct sequence, test with phase rotation meter' },
      { code: 'P03', meaning: 'Neutral-Ground Voltage Abnormal', severity: 'High', solution: 'Check grounding resistance (<5Ω required), measure neutral continuity, verify grounding system integrity' },
      { code: 'E01', meaning: 'Earth Fault Detected', severity: 'High', solution: 'Use earth fault locator to find fault location, check cable insulation, test with megohm meter' },
      { code: 'E02', meaning: 'Harmonic Distortion Excessive', severity: 'Medium', solution: 'Install active harmonic filter, measure THD with analyzer (should be <5%), check for non-linear loads' },
    ],
  };

  const specifications = [
    { type: 'Online 10kVA', efficiency: '92-94%', transfer: '<4ms', battery: '20min@full', cost: 'KES 850K-1.2M', warranty: '3 years' },
    { type: 'Online 20kVA', efficiency: '93-95%', transfer: '<4ms', battery: '15min@full', cost: 'KES 1.5M-2.0M', warranty: '3 years' },
    { type: 'Line-Interactive 5kVA', efficiency: '90-92%', transfer: '0ms', battery: '30min@half', cost: 'KES 400K-600K', warranty: '2 years' },
    { type: 'Standby 2kVA', efficiency: '85-88%', transfer: '5-10ms', battery: '60min@half', cost: 'KES 150K-250K', warranty: '1 year' },
  ];

  const troubleshooting = [
    { title: 'No Output Power / Total Failure', steps: ['1. Check main power input (mains voltage present?)', '2. Verify battery voltage at terminals', '3. Measure DC bus voltage with multimeter', '4. Check for blown input fuses or breakers', '5. Test output with multimeter (AC voltage)', '6. Review error code display or LED indicators'] },
    { title: 'Battery Not Charging', steps: ['1. Measure battery voltage (should be within ±5% rated)', '2. Check charger output voltage setting', '3. Verify battery connections are tight', '4. Measure charging current (should show positive amps)', '5. Test battery with load (discharge curve)', '6. Check battery age - beyond 5 years needs replacement'] },
    { title: 'Frequent Transfer to Battery', steps: ['1. Measure input voltage (should be ±10% of 220V or 380V)', '2. Check for voltage spikes or noise on utility line', '3. Verify transfer threshold voltage setting', '4. Install voltage stabilizer if utility unstable', '5. Test utility supply quality with power analyzer', '6. Consider load synchronization with utility cycles'] },
    { title: 'Load Runs Down Battery Rapidly', steps: ['1. Measure total connected load with multimeter clamp', '2. Calculate expected runtime: Runtime = (Battery_kWh × 0.8) / Load_kW', '3. Check if battery capacity has degraded', '4. Verify battery connections (tight, no corrosion)', '5. Run battery capacity test with load simulator', '6. Check for parasitic drain (always-on devices)'] },
    { title: 'High Beeping/Alarms', steps: ['1. Identify alarm type (continuous = overload, pulsing = battery low)', '2. Check current draw with clamp meter', '3. Reduce load if overloaded (>110% capacity)', '4. Measure battery voltage if low battery alarm', '5. Check input voltage for mains fail alarm', '6. Review UPS manual for alarm code meanings'] },
  ];

  const maintenance = [
    { period: 'Monthly', tasks: ['Visual inspection of UPS case and connections for corrosion', 'Check all indicator lights (should be green/normal)', 'Verify battery terminals are clean and tight', 'Test UPS beeper and alarm function', 'Monitor UPS display for error codes or warnings'] },
    { period: 'Quarterly', tasks: ['Measure input and output voltage with multimeter', 'Check battery voltage (should be within ±5% rated)', 'Clean air intake filters (clogged filters reduce cooling)', 'Verify cooling fan operation (listen for normal sound)', 'Test load switching simulation (brief to battery mode)'] },
    { period: 'Annually', tasks: ['Run full battery capacity load test with load simulator', 'Measure battery impedance (indication of aging)', 'Check all circuit breaker/disconnect switches', 'Verify grounding resistance (<5Ω required)', 'Battery replacement if capacity dropped below 80%', 'Professional electrical safety inspection'] },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-b border-blue-600/30 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">UPS Systems: Complete Technical Reference</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl">
            Comprehensive engineering guide for Online, Line-Interactive, and Standby UPS systems. Covers topology selection, battery management, transfer switching, error codes, troubleshooting, maintenance, and safety standards for Kenya's power environment.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* FUNDAMENTALS SECTION */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">1. UPS Fundamentals & Topology Selection</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">An Uninterruptible Power Supply (UPS) maintains continuous power to critical loads during utility mains failures. Three primary topologies serve different requirements: Online (double-conversion) systems provide superior protection through continuous inverter operation; Line-Interactive systems offer cost-effective voltage regulation with battery backup; Standby systems provide basic backup at lowest cost. In Kenya's grid environment with frequent brownouts, voltage sags, and blackouts, UPS selection depends on load criticality, budget, and required runtime duration.</p>

            <p className="text-lg leading-relaxed">Online UPS systems continuously convert AC mains to DC, then re-invert to AC through the inverter stage. This double-conversion architecture completely isolates the load from utility disturbances—voltage sags, surges, harmonic distortion, and frequency variations never reach connected equipment. However, continuous inverter operation generates heat and has lower efficiency (92-94%) compared to standby systems (85-88%). For critical loads like data centers, medical equipment, and telecommunications, the protection justifies the efficiency penalty.</p>

            <p className="text-lg leading-relaxed">Line-Interactive UPS maintains a more efficient architecture by operating in passthrough mode until mains voltage deviates beyond acceptable range (typically ±15%). A boost/buck transformer corrects minor voltage variations without inverter operation, reducing efficiency losses. When mains voltage exceeds threshold, the static transfer switch (STS) seamlessly transfers to inverter-supplied power from the battery. Transfer time is essentially zero in modern designs (under 1ms), making line-interactive suitable for most commercial and industrial loads. This topology has become dominant for 3-10kVA commercial systems.</p>

            <p className="text-lg leading-relaxed">Standby (offline) UPS represents the simplest, lowest-cost architecture: the UPS monitors mains voltage and switches to battery-powered inverter only when mains fails or voltage drops below threshold. Transfer time is 5-10ms, which is acceptable for most loads but may cause brief glitches in sensitive electronics. Standby UPS is ideal for small office, retail, and residential applications where brief interruptions are tolerable and battery runtime requirements are modest (under 1 hour typical).</p>

            <p className="text-lg leading-relaxed">Battery selection is critical to UPS reliability. Lead-acid batteries are cost-effective but require proper ventilation, regular maintenance, and replacement every 5 years. Lithium batteries offer 10-15 year lifespan, higher energy density, and better performance in hot climates like Kenya, but cost 2-3× more. The decision depends on total cost of ownership: lithium's longer life may be more economical despite higher initial cost, especially in hot environments where lead-acid lifespan is shortened.</p>

            <p className="text-lg leading-relaxed">Static Transfer Switch (STS) technology is critical for seamless battery switchover. Modern STS uses zero-transfer-time solid-state switching that transfers between mains and inverter without load interruption. This requires precise synchronization: the inverter output must match mains voltage, frequency, and phase angle within milliseconds. Any synchronization error causes current spikes and potential load disruption. This is why UPS transfer time specifications matter—slower transfers indicate less sophisticated synchronization.</p>

            <p className="text-lg leading-relaxed">Runtime calculation is essential for proper UPS sizing. Formula: Runtime (hours) = Battery Capacity (kWh) × Usable Percentage (80%) / Load (kW). Example: A 5kVA Online UPS with battery capacity 8kWh powering 4kW load: Runtime = (8 × 0.80) / 4 = 1.6 hours runtime. Note that usable capacity is typically 80% to prevent deep discharge damage. Many installations specify 15-30 minute runtime assuming additional generators provide extended backup.</p>

            <p className="text-lg leading-relaxed">Efficiency variations across load levels are critical for operational cost. A 10kVA UPS operating at 20% load efficiency (~88%) versus 100% load efficiency (~93%) shows significant difference. Proper UPS sizing ensures operation in the 50-80% load range where efficiency is optimal. Undersized UPS (always overloaded) or oversized UPS (always underloaded) both waste energy. Professional system design right-sizes the UPS to expected typical load levels.</p>

            <p className="text-lg leading-relaxed">Three-phase UPS systems (15kVA and larger) distribute load across three phases, requiring phase balance monitoring and load distribution discipline. Single-phase overload (&gt;110% of capacity on one phase) triggers shutdown even if other phases are underutilized. This makes three-phase UPS installation more complex but necessary for industrial applications with three-phase loads like motors and large compressors.</p>

            <p className="text-lg leading-relaxed">Harmonic distortion in UPS output depends on inverter topology and battery charger design. PWM (Pulse Width Modulation) inverters produce 2-5% THD; older square-wave inverters produce 10-15% THD. High THD causes transformer overheating, motor noise, and utility penalties in Kenya where large commercial users face harmonic compliance requirements. Modern UPS typically provides &lt;3% THD through sophisticated PWM control.</p>

            <p className="text-lg leading-relaxed">Power factor correction (PFC) on the mains input side ensures the UPS doesn't draw reactive power from the utility. A UPS without input PFC appears as an inductive load and may trigger power factor penalties in Kenya. Modern UPS includes active PFC that maintains unity power factor, avoiding these penalties and improving overall power quality.</p>

            <p className="text-lg leading-relaxed">Thermal management directly impacts UPS lifespan. Semiconductor junction temperatures above 125°C degrade rapidly; UPS automatically derates output power if internal temperature exceeds safe limits (typically 80-85°C heatsink). Proper installation with adequate ventilation (minimum 10cm clearance on sides, unrestricted airflow) is essential. In Kenya's 40-45°C climate, many installations require mechanical cooling or larger UPS to maintain safe operating temperatures.</p>

            <p className="text-lg leading-relaxed">Modular redundancy for mission-critical applications uses multiple smaller UPS units in parallel, each capable of supporting the full load. If one UPS fails, others continue uninterrupted. This N+1 redundancy approach protects against single-point failure but costs approximately 1.5× the single UPS approach. Data centers and telecommunications facilities typically employ this architecture.</p>
          </div>
        </section>

        {/* SPECIFICATIONS TABLE */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">2. UPS Specifications & Selection Matrix</h2>

          <div className="overflow-x-auto bg-slate-900/50 rounded-lg border border-slate-800 p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-600/30">
                  <th className="text-left py-3 px-2 text-blue-300">Type</th>
                  <th className="text-left py-3 px-2 text-blue-300">Efficiency</th>
                  <th className="text-left py-3 px-2 text-blue-300">Transfer Time</th>
                  <th className="text-left py-3 px-2 text-blue-300">Battery Runtime</th>
                  <th className="text-left py-3 px-2 text-blue-300">Est. Cost</th>
                  <th className="text-left py-3 px-2 text-blue-300">Warranty</th>
                </tr>
              </thead>
              <tbody>
                {specifications.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/30">
                    <td className="py-3 px-2 text-white font-semibold">{row.type}</td>
                    <td className="py-3 px-2 text-gray-300">{row.efficiency}</td>
                    <td className="py-3 px-2 text-gray-400">{row.transfer}</td>
                    <td className="py-3 px-2 text-gray-400">{row.battery}</td>
                    <td className="py-3 px-2 text-green-300">{row.cost}</td>
                    <td className="py-3 px-2 text-gray-400">{row.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FORMULAS */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">3. Engineering Formulas & Calculations</h2>

          <div className="space-y-6">
            <div className="bg-slate-900/50 border-l-4 border-blue-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-3">UPS Battery Runtime Calculation</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">Runtime (hours) = (Battery_kWh × 0.80) / Load_kW</div>
              <p className="text-gray-400">Example: 5kVA UPS, 8kWh battery, 4kW load = (8 × 0.80) / 4 = 1.6 hours. Note: 80% usable capacity prevents deep discharge damage.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-blue-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-3">Battery Charge Time</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">Charge_Time (hours) = Battery_kWh / (Charger_Voltage × Charger_Current) × 1000</div>
              <p className="text-gray-400">Example: 48V battery, 100A charger = 8kWh / (48 × 100) × 1000 = 1.67 hours to full charge from 0%.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-blue-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-3">Transfer Time Impact on Load</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">Load_Glitch = Transfer_Time × Load_Transient_Current</div>
              <p className="text-gray-400">Example: 10ms transfer with 1000A inductive load spike = 10ms × 1000A = 10A·s transient. Modern PCs tolerate &lt;4ms; sensitive equipment requires &lt;1ms.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-blue-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-3">UPS Cooling Requirement</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">Heat_Loss_W = UPS_Power_W × (1 - Efficiency)</div>
              <p className="text-gray-400">Example: 10kW Online UPS @ 93% efficiency: Heat = 10,000 × (1 - 0.93) = 700W dissipated as heat. Adequate ventilation required to keep heatsink &lt;60°C.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-blue-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-3">Phase Current Balance (3-phase)</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">Phase_Imbalance = (Max_Phase_Current - Min_Phase_Current) / Average × 100</div>
              <p className="text-gray-400">Example: Phase A=80A, B=75A, C=70A: Imbalance = (80-70)/75 = 13.3%. Acceptable: &lt;10%. Rebalance loads if &gt;10%.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-blue-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-3">Battery Aging Factor (Lead-Acid)</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">Capacity_Remaining = Original_Capacity × (1 - Age_Years × 0.15)</div>
              <p className="text-gray-400">Example: 10-year-old battery: Capacity = 100% × (1 - 10 × 0.15) = 100% × 0.85 = 85% capacity. At 5 years: 25% capacity loss.</p>
            </div>
          </div>
        </section>

        {/* ERROR CODES */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-blue-400">4. Error Code Database (30+ Codes)</h2>

          <div className="space-y-8">
            {Object.entries(errorCodes).map(([category, codes]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-blue-300 mb-4">{category}</h3>
                <div className="grid gap-4">
                  {codes.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-blue-600/30 transition">
                      <div className="flex items-start gap-4">
                        <span className={`px-3 py-1 rounded font-mono text-sm font-bold flex-shrink-0 ${
                          item.severity === 'High' ? 'bg-red-600/20 text-red-300' :
                          item.severity === 'Medium' ? 'bg-amber-600/20 text-amber-300' :
                          'bg-green-600/20 text-green-300'
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
          <h2 className="text-4xl font-bold mb-8 text-blue-400">5. Troubleshooting Procedures</h2>

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
                  <span className={`text-2xl transition ${expandedSection === `ts-${idx}` ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {expandedSection === `ts-${idx}` && (
                  <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                    <ol className="space-y-3">
                      {issue.steps.map((step, sidx) => (
                        <li key={sidx} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm text-black">
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
          <h2 className="text-4xl font-bold mb-8 text-blue-400">6. Maintenance Schedules</h2>

          <div className="space-y-8">
            {maintenance.map((schedule, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-blue-600/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">{schedule.period} Maintenance</h3>
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

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-600/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Professional UPS Services</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            500+ UPS installations across Kenya. 24/7 emergency support. Full maintenance contracts available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-3 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-400 transition">
              Request Consultation
            </Link>
            <Link href="/generators/spare-parts" className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition">
              Browse Spare Parts
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
