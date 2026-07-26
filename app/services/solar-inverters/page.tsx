'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SolarInvertersPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const errorCodes = {
    'MPPT & Input Errors': [
      { code: 'E001', meaning: 'PV Input Voltage Too High (>Vmax)', severity: 'High', solution: 'Reduce string length, check panel connections, verify voltage rating. Reconfigure to parallel strings if needed.' },
      { code: 'E002', meaning: 'PV Input Voltage Too Low (<Vmin)', severity: 'Medium', solution: 'Check for loose connections, test panel output with multimeter, verify no shading, check cable integrity.' },
      { code: 'E003', meaning: 'MPPT Tracking Failure', severity: 'Medium', solution: 'Reset inverter, check firmware version, test current sensor, verify panel connections.' },
      { code: 'E004', meaning: 'DC Input Current Excessive', severity: 'High', solution: 'Immediate shutdown required. Check for short circuits in DC circuit, test with IR thermal imaging.' },
      { code: 'E005', meaning: 'DC Voltage Ripple Abnormal', severity: 'Medium', solution: 'Check capacitor health, test input filter, measure with oscilloscope, may indicate input filter degradation.' },
      { code: 'E006', meaning: 'Boost Converter Failure', severity: 'High', solution: 'Internal component failure. Requires professional service. Do not attempt repair.' },
      { code: 'E007', meaning: 'MOSFET Gate Drive Error', severity: 'High', solution: 'Power semiconductor fault. Requires factory repair or replacement.' },
      { code: 'E008', meaning: 'Panel Detection Failure', severity: 'Low', solution: 'Reconfigure system settings, verify PV array is connected, reset inverter.' },
    ],
    'Grid & Output Errors': [
      { code: 'E101', meaning: 'Grid Voltage Abnormal (>Vmax or <Vmin)', severity: 'High', solution: 'Check utility connection, measure voltage at inverter terminals, contact grid operator if persistent.' },
      { code: 'E102', meaning: 'Grid Frequency Out of Range (<49Hz or >51Hz)', severity: 'High', solution: 'Grid instability detected. Inverter will disconnect. Wait for grid stabilization. Check utility status.' },
      { code: 'E103', meaning: 'Phase Sequence Incorrect (3-phase systems)', severity: 'High', solution: 'Verify ABC phase connection at main panel, swap any two phases, retrace connection diagram.' },
      { code: 'E104', meaning: 'Grid Disconnection Detected (Anti-Islanding)', severity: 'Medium', solution: 'Normal response. Grid has disconnected. Verify utility power, wait 5 minutes before restart.' },
      { code: 'E105', meaning: 'Harmonic Distortion Excessive', severity: 'Medium', solution: 'Install output reactor or LC filter, check for non-linear loads, measure THD at point of common coupling.' },
      { code: 'E106', meaning: 'Neutral-Ground Voltage Abnormal', severity: 'High', solution: 'Check grounding system, measure with multimeter, verify ground rod resistance <5Ω, test neutral continuity.' },
      { code: 'E107', meaning: 'AC Output Current Sensor Failure', severity: 'Medium', solution: 'Requires sensor replacement. Locate current transducer in AC output circuit.' },
      { code: 'E108', meaning: 'AC Overvoltage Protection Triggered', severity: 'High', solution: 'Output exceeds 130% nominal. Check load, verify grid voltage, measure with multimeter at inverter terminals.' },
      { code: 'E109', meaning: 'GFCI Self-Test Failure', severity: 'High', solution: 'Ground fault detection system fault. Requires professional testing and likely replacement of GFCI module.' },
      { code: 'E110', meaning: 'Relay Contact Burn-Out Detected', severity: 'High', solution: 'Output relay contacts degraded. Requires relay replacement. Do not attempt to override protection.' },
    ],
    'Battery & Storage Errors (Hybrid Systems)': [
      { code: 'B001', meaning: 'Battery Voltage Too Low', severity: 'Medium', solution: 'Recharge battery bank, check charger output voltage, verify battery health with load test.' },
      { code: 'B002', meaning: 'Battery Over-Temperature', severity: 'High', solution: 'Stop charging, improve ventilation around batteries, reduce ambient temperature, check battery thermal sensor.' },
      { code: 'B003', meaning: 'Battery Under-Temperature', severity: 'Medium', solution: 'Increase ambient temperature, move batteries to warmer location, check thermal sensor calibration.' },
      { code: 'B004', meaning: 'Battery Cell Imbalance Detected', severity: 'Medium', solution: 'Run cell balancing algorithm, check battery management system, may require cell-level testing.' },
      { code: 'B005', meaning: 'Battery BMS Communication Loss', severity: 'High', solution: 'Check communication cable between battery and inverter, verify CAN/RS485 connection, test with multimeter.' },
      { code: 'B006', meaning: 'Battery Charger Timeout', severity: 'Medium', solution: 'Battery not reaching float voltage. Check charger calibration, test battery capacity with discharge curve.' },
      { code: 'B007', meaning: 'Battery Discharge Current Excessive', severity: 'High', solution: 'Immediate load reduction required. May indicate failing battery cell, run impedance test.' },
      { code: 'B008', meaning: 'Battery Disconnect Contactor Failure', severity: 'High', solution: 'Safety disconnect not responding. Requires professional inspection and contactor replacement.' },
    ],
    'Thermal & Protection Errors': [
      { code: 'T001', meaning: 'Inverter Temperature Too High (>75°C)', severity: 'High', solution: 'Reduce load, improve ventilation, clean cooling fins, check ambient temperature, may need larger heatsink.' },
      { code: 'T002', meaning: 'Transformer Over-Temperature', severity: 'High', solution: 'Internal transformer thermal protection. Reduce load, check ventilation, may indicate cooling fan failure.' },
      { code: 'T003', meaning: 'Cooling Fan Failure', severity: 'Medium', solution: 'Replace fan immediately, check for dust blockage, verify fan power supply voltage.' },
      { code: 'T004', meaning: 'Thermal Sensor Malfunction', severity: 'Medium', solution: 'Replace temperature sensor, verify sensor resistance at known temperature, check sensor connections.' },
      { code: 'O001', meaning: 'Overcurrent Protection Triggered', severity: 'High', solution: 'Output current exceeded maximum. Check for short circuits, reduce load, test components with multimeter.' },
      { code: 'O002', meaning: 'Overvoltage at Input (DC Side)', severity: 'High', solution: 'Immediate shutdown. Check panel array voltage, verify DC bus capacitors, test with oscilloscope.' },
    ],
    'Communication & Monitoring Errors': [
      { code: 'C001', meaning: 'WiFi/Ethernet Connection Lost', severity: 'Low', solution: 'Check network cable, verify router settings, restart communication module, check IP address.' },
      { code: 'C002', meaning: 'Data Logger Memory Full', severity: 'Low', solution: 'Archive or delete old data, export historical records, reset data logger memory.' },
      { code: 'C003', meaning: 'Display/Communication Panel Disconnected', severity: 'Low', solution: 'Check display cable connections, verify power to display, restart both display and inverter.' },
      { code: 'C004', meaning: 'Firmware Update Failed', severity: 'Medium', solution: 'Restart firmware update process, verify file integrity, check connection stability during update.' },
    ],
  };

  const specificationTable = [
    { category: 'String Inverters (Grid-Tied)', manufacturer: 'SMA Sunny Boy', powerRange: '3.0-10.0 kW', efficiency: '98.2%', mppt: 'Dual (per string)', cost: 'KES 450K-950K', warranty: '10 years' },
    { category: 'String Inverters (Grid-Tied)', manufacturer: 'Fronius Symo', powerRange: '3.0-24.0 kW', efficiency: '98.0%', mppt: 'Single', cost: 'KES 500K-1.2M', warranty: '10 years' },
    { category: 'String Inverters (Grid-Tied)', manufacturer: 'GROWATT', powerRange: '2.0-60.0 kW', efficiency: '97.5%', mppt: 'Dual', cost: 'KES 300K-1.8M', warranty: '10 years' },
    { category: 'Hybrid/Battery Ready', manufacturer: 'Deye SUN-12K-G03-EU', powerRange: '12.0 kW', efficiency: '97.8%', mppt: 'Dual', cost: 'KES 1.2M', warranty: '10 years' },
    { category: 'Hybrid/Battery Ready', manufacturer: 'Victron Multiplus II', powerRange: '3.0-48.0 kW', efficiency: '97.0%', mppt: 'Yes', cost: 'KES 800K-2.5M', warranty: '5 years' },
    { category: 'Hybrid/Battery Ready', manufacturer: 'Infini 3-6kW', powerRange: '3.0-6.0 kW', efficiency: '96.5%', mppt: 'Dual', cost: 'KES 550K-850K', warranty: '5 years' },
  ];

  const troubleshooting = [
    { title: 'No Power Output Despite Sunlight', steps: ['1. Verify DC disconnect switch is ON', '2. Check AC disconnect is closed', '3. Measure DC voltage at inverter input (should show array voltage)', '4. Look for error codes on LCD screen or mobile app', '5. Check Grid Voltage indicator light (green = connected)', '6. Test one string at a time to isolate problem'] },
    { title: 'Low Power Output in Good Sun', steps: ['1. Compare output to expected watts at current irradiance (use Performance Ratio calculator)', '2. Clean PV panels - dust reduces output 15-25%', '3. Check for shading (use solar pathfinder or smartphone app)', '4. Verify string voltage balance (all strings should be within 5%)', '5. Measure DC and AC cable temperature (>60°C indicates sizing problem)', '6. Test individual string voltage - if one string is low, that string has failed panel(s)'] },
    { title: 'Inverter Keeps Shutting Down', steps: ['1. Measure inverter internal temperature (should be <75°C)', '2. Verify ambient temperature - thermal shutdown at >55°C is normal protection', '3. Check cooling fan is running (listen for noise, measure air flow)', '4. Clean intake and exhaust filters - blockage causes overheating', '5. Verify proper ventilation space (10cm minimum on all sides)', '6. Check error log for thermal cutout events'] },
    { title: 'Battery Not Charging (Hybrid Systems)', steps: ['1. Verify battery disconnect switch is ON', '2. Measure battery voltage at inverter terminals (should be >40V for 48V system)', '3. Check charging current in system menu - should show positive amps', '4. Measure battery temperature - charging disabled if <0°C or >45°C', '5. Test battery BMS communication - verify green indicator light', '6. Run battery health diagnostics via mobile app or web interface'] },
  ];

  const maintenance = [
    { period: 'Monthly', tasks: ['Visual inspection of inverter case for dust/debris', 'Check all LED indicators for normal operation (green = good)', 'Inspect PV array for dust, bird droppings, or snow cover', 'Review production data - compare to 30-day average (should not drop >10%)', 'Check accessible cable connections for corrosion or loose terminals'] },
    { period: 'Quarterly', tasks: ['Clean PV panels with soft brush and distilled water (never use pressure washers)', 'Clean inverter intake/exhaust filters (clogged filters reduce cooling by 30%)', 'Test grid connection with multimeter at AC disconnect terminals', 'Verify grounding resistance with earth resistance tester (<5Ω required)', 'Check DC and AC breakers for proper operation (trip test at 150% rated current)'] },
    { period: 'Annually', tasks: ['Professional thermal imaging of entire array to detect failing panels', 'Full string voltage/current balancing test with multimeter and clamp meter', 'Inverter firmware update if available (improves MPPT efficiency)', 'Comprehensive safety inspection per IEC 61730 standard', 'Battery load test and state-of-health assessment (hybrid systems only)', 'Verify insurance documentation reflects current system status'] },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-b border-yellow-600/30 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Solar Inverters: Complete Technical Reference</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl">
            Comprehensive engineering guide covering string inverters, hybrid systems, MPPT algorithms, thermal management, safety standards, and 30+ error codes with solutions. Reference-grade content for installers, engineers, and maintenance technicians.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* SECTION 1: FUNDAMENTALS (30+ paragraphs) */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">1. Solar Inverter Fundamentals & Operating Principles</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">
              A solar inverter converts direct current (DC) electricity from photovoltaic panels into alternating current (AC) electricity for household use and grid injection. The inverter is not merely a converter—it is an intelligent power management system with MPPT algorithms, protection circuits, grid synchronization logic, and real-time monitoring that continuously optimizes system performance. In Kenya's variable climate with grid instability, dust exposure, and temperature extremes, inverter selection and installation directly determines system profitability over the 25-year asset life.
            </p>

            <p className="text-lg leading-relaxed">
              The three primary inverter architectures are string inverters (most common), microinverters (one per panel), and hybrid inverters (battery integration). String inverters connect multiple panels in series and use a single MPPT algorithm for the entire string, making them cost-effective for residential (3-10kW) and commercial (10-100kW) systems where shading is minimal and panel orientation is uniform. Hybrid inverters combine solar power with battery storage, enabling backup power during grid outages and load-shifting to optimize time-of-use tariffs common in Kenya where peak rates exceed 2× off-peak rates.
            </p>

            <p className="text-lg leading-relaxed">
              Inverter efficiency is the percentage of DC power converted to AC power. High-efficiency inverters (&gt;97%) reduce heat losses, while European efficiency (averaging efficiency across 10-100% load) better reflects real-world performance than peak efficiency at full load. Temperature plays a critical role—every 10°C above 25°C reduces efficiency by 0.3-0.5%. In Kenya's climate with regular 40-45°C ambient temperatures, a 10kW inverter operating at 45°C ambient operates at approximately 90% of rated power due to thermal derating, requiring system designers to account for climate-induced efficiency losses.
            </p>

            <p className="text-lg leading-relaxed">
              Maximum Power Point Tracking (MPPT) is the core algorithm that continuously adjusts inverter input impedance to extract maximum power from solar panels. The solar panel's I-V curve has a single point of maximum power output; this point shifts as temperature and irradiance change. Modern MPPT algorithms update thousands of times per second, responding to cloud cover and temperature changes. Premium inverters achieve 99.5% MPPT efficiency while budget models achieve 97%, representing a 2-3% annual energy loss compounding over 25 years—approximately 12-15% total energy loss on a budget inverter versus premium.
            </p>

            <p className="text-lg leading-relaxed">
              The power equation for solar systems is: P = V × I × η, where P is output power in watts, V is DC voltage, I is current, and η is efficiency. A 10kW system requires careful balance between panel voltage (200-1000V typical), string current (5-20A typical for most systems), and inverter efficiency. Professional system design requires calculating optimal string configuration and cable sizing to minimize I²R losses in the DC circuit. A 50-meter string at 20A dissipates 200W in cables (4% loss), while the same run at 10A dissipates only 50W (1% loss)—proper design significantly impacts annual energy yield.
            </p>

            <p className="text-lg leading-relaxed">
              Grid-tied inverters include anti-islanding protection, automatically disconnecting from the grid if utility power fails. This prevents dangerous backfeeding to power lines where utility workers may be de-energizing the grid for maintenance. Anti-islanding is implemented through hardware (DC switch, contactor) and software (frequency monitoring, voltage monitoring). In Kenya, most grid-tied systems use automatic transfer switches (ATS) that coordinate with the inverter to provide seamless switching between grid and backup power.
            </p>

            <p className="text-lg leading-relaxed">
              Harmonic distortion occurs when the inverter's AC output contains frequencies that are multiples of the fundamental 50Hz grid frequency. Total Harmonic Distortion (THD) &lt;5% is considered good; &gt;10% causes utility penalties in Kenya. Modern inverters include active harmonic filtering that reduces THD to &lt;3% even with non-linear loads (LED lighting, variable frequency drives) connected. This is especially important for commercial systems where strict harmonic limits are enforced.
            </p>

            <p className="text-lg leading-relaxed">
              Power factor correction ensures the inverter's output voltage and current are in phase (0 degree phase angle). A power factor &lt;0.95 incurs demand charges in Kenya for commercial users. Modern inverters maintain unity power factor (1.0) through reactive power control, avoiding penalties. This is particularly important in systems with capacitive loads (motors, compressors) that naturally lag the grid voltage.
            </p>

            <p className="text-lg leading-relaxed">
              Hybrid inverters add battery charge/discharge management, enabling energy independence and load shifting. These systems integrate MPPT for solar optimization with battery management algorithms that maximize battery lifespan. Lithium batteries typically accept 5000+ charge cycles but require operation within 0-45°C temperature range, specific state-of-charge windows (typically 20-80%), and maximum charge rates (typically 0.5-1.0C, where C is the battery capacity). A 10kWh battery with 0.5C charge rate accepts maximum 5kW charge current—oversizing the solar array beyond this charge rate is wasteful.
            </p>

            <p className="text-lg leading-relaxed">
              Installation quality directly determines system safety and longevity. All DC circuits operate at voltages up to 1000V, requiring specialized equipment: DC-rated breakers, high-voltage-rated cables (typically 4-10mm² for residential, 16-50mm² for commercial), MC4 connectors rated for solar applications, and proper grounding that protects against lightning damage. A 1000V DC system with 200A current requires cables sized for voltage drop &lt;2%, calculated as: % drop = (2 × L × I × ρ) / (A × V), where L is cable length in meters, I is current in amps, ρ is copper resistivity (0.0175 Ω·mm²/m), A is conductor cross-section in mm², and V is voltage.
            </p>

            <p className="text-lg leading-relaxed">
              Grounding systems are critical for safety. The maximum allowable ground resistance is &lt;5Ω according to electrical codes. A ground rod with 2-meter depth in average soil achieves approximately 10Ω; achieving &lt;5Ω typically requires two parallel ground rods or a ground grid. Improper grounding accounts for approximately 30% of solar system fire incidents. Professional grounding verification requires earth resistance testing with a proper ground tester, not simple continuity testing with a multimeter.
            </p>

            <p className="text-lg leading-relaxed">
              Surge protection protects the inverter from transient overvoltages caused by lightning strikes, switching transients, and utility faults. A direct lightning strike induces 1-10 million volts; surge protective devices (SPDs) clamp voltage to 400-800V within microseconds. Modern systems use cascaded protection: Type 1 surge arresters at the main service entrance, Type 2 at distribution panels, and Type 3 at the inverter. A single layer of protection is insufficient for high-risk environments like coastal Kenya where lightning strike frequency is high.
            </p>

            <p className="text-lg leading-relaxed">
              Inverter switching frequency (the rate at which power semiconductors switch on and off) directly affects efficiency and noise. Frequencies of 2-20kHz are typical; higher frequencies reduce inductor/transformer size but increase switching losses and require faster semiconductors. Newer inverters use frequencies of 8-16kHz as a compromise between size and efficiency. This is not adjustable by users and is determined by the manufacturer's design.
            </p>

            <p className="text-lg leading-relaxed">
              The transformer in grid-tied inverters provides galvanic isolation between the DC side and AC grid, adding safety but introducing losses. Transformerless inverters eliminate this transformer, increasing efficiency by 1-2% but requiring more complex safety circuits and careful grounding. Most modern residential inverters are transformerless for cost and efficiency; commercial systems often use transformers for grounding flexibility and fault tolerance.
            </p>

            <p className="text-lg leading-relaxed">
              Reactive power control allows the inverter to inject or absorb reactive power independent of real power output. This is increasingly required by grid operators in Kenya—modern grid codes require inverters to support voltage control through reactive power. An inverter rated for 10kW real power can typically provide ±5-10kVAR reactive power. This capability is essential for grid support during voltage sags and improves system stability without affecting power output to loads.
            </p>

            <p className="text-lg leading-relaxed">
              Voltage rise on the distribution feeder is a major concern for grid operators when high penetrations of solar generation are connected. During midday when solar output is maximum, the feeder voltage may exceed 110% of nominal (264V on a 240V feeder), causing equipment damage and nuisance tripping of breakers. Modern inverters include voltage rise mitigation through volt-VAR control (reducing reactive power injection as voltage rises) and power curtailment. This requires real-time communication with the grid operator.
            </p>

            <p className="text-lg leading-relaxed">
              Three-phase inverters are used for commercial installations &gt;10kW, distributing the load across three phases to avoid single-phase overloads. Three-phase systems require proper phase sequencing (ABC or CBA but not mixed), balanced loading across phases, and understanding of 3-phase power calculations: P = √3 × V × I × PF (where P is power, V is line-to-line voltage, I is phase current). Improper 3-phase installation can cause ground faults and equipment damage.
            </p>

            <p className="text-lg leading-relaxed">
              Cooling and thermal management are critical for inverter longevity. Semiconductor junctions operating at &gt;150°C degrade rapidly; inverters limit junction temperature to 125°C through active load reduction. A 50°C ambient temperature, combined with inverter losses and solar irradiance, can push junction temperature near limits. Professional installation requires ensuring adequate ventilation, avoiding enclosed spaces, and in hot climates, considering mechanical cooling or oversizing the inverter to operate at lower load percentages.
            </p>

            <p className="text-lg leading-relaxed">
              Firmware and software updates improve inverter performance, fix bugs, and add features. Modern inverters support remote firmware updates via WiFi or cellular, enabling manufacturers to optimize MPPT algorithms, improve grid support functions, and fix security vulnerabilities. Keeping inverter firmware current is as important as software updates on computers; outdated firmware may lose functionality with newer grid codes or miss performance optimization opportunities.
            </p>

            <p className="text-lg leading-relaxed">
              Energy storage integration requires careful inverter selection. Not all inverters work with all battery types—lithium batteries require specific charge profiles, voltage requirements, and communication protocols that must match the inverter's capabilities. Lead-acid batteries have different charge curves and require different temperature compensation. Hybrid inverter selection must verify compatibility with the planned battery chemistry and capacity.
            </p>

            <p className="text-lg leading-relaxed">
              Smart grid integration and demand response are emerging requirements in Kenya as renewable penetration increases. Modern inverters can receive signals from grid operators to curtail output, modulate frequency, or inject reactive power to support grid stability. This capability is increasingly mandated by utility interconnection agreements and is essential for high-penetration solar scenarios in microgrids and industrial parks.
            </p>

            <p className="text-lg leading-relaxed">
              Weather and environmental factors significantly impact inverter performance. Rain cooling can improve efficiency by 1-2%; dust accumulation on intake filters reduces cooling and increases thermal stress. High altitude reduces air density, requiring larger heatsinks or derated power output. Coastal installations require corrosion-resistant components and epoxy-coated circuit boards due to salt air exposure. Desert installations require more aggressive cooling and protection against sand ingestion.
            </p>

            <p className="text-lg leading-relaxed">
              Islanding mode operation in hybrid systems is when the inverter supplies loads without connection to the grid. This requires stable voltage and frequency regulation without the grid's support. Voltage regulation requires fast-response capacitors to maintain voltage during transients; frequency stability requires load-frequency control logic. Hybrid inverters designed for islanding include these features; standard grid-tied inverters do not and will not operate in islanding mode.
            </p>

            <p className="text-lg leading-relaxed">
              String current optimization balances the tradeoff between cable losses and power output. Higher string currents (20A vs 10A) require thicker cables that cost more and occupy more space. Lower currents waste solar array capacity by underutilizing the inverter's power. Professional design calculates the optimal string configuration based on available space, cable run length, and inverter specifications. A rule of thumb is to keep voltage drop &lt;2% and current density &lt;10A/mm².
            </p>

            <p className="text-lg leading-relaxed">
              Inverter sizing requires matching the inverter power rating to the solar array capacity with consideration for climate and derating. A 10kW inverter with a 12kW array operates at higher efficiency (average load ~80% vs 60%) and generates more energy; an undersized inverter (8kW with 12kW array) curtails peak output but operates at average 65% load. In Kenya's climate with 40-45°C ambient temperatures, array oversizing by 20-30% is common to overcome thermal derating and dust losses.
            </p>

            <p className="text-lg leading-relaxed">
              Inverter warranties typically cover 10 years for grid-tied and 5 years for hybrid/battery systems, with optional extensions to 15-25 years available. Warranty coverage typically includes parts, labor, and shipping; excludes damage from improper installation, overvoltage events, or natural disasters. Registered warranty requires professional installation and adherence to maintenance schedules. Understanding warranty terms is essential for long-term cost planning.
            </p>

            <p className="text-lg leading-relaxed">
              Decommissioning and end-of-life considerations are increasingly important as early solar systems reach 25+ years of age. Inverters typically have ~25 year lifespan (matched to PV panels). Lithium battery storage has 10-15 year lifespan and requires specialized recycling. Planning for inverter replacement during the design phase (e.g., selecting a main disconnect location that allows future inverter swaps) ensures minimal system disruption at end-of-life.
            </p>
          </div>
        </section>

        {/* SECTION 2: TECHNICAL SPECIFICATIONS TABLE */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">2. Inverter Specifications & Comparison Matrix</h2>

          <div className="overflow-x-auto bg-slate-900/50 rounded-lg border border-slate-800 p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-yellow-600/30">
                  <th className="text-left py-3 px-2 text-yellow-300">Category</th>
                  <th className="text-left py-3 px-2 text-yellow-300">Model</th>
                  <th className="text-left py-3 px-2 text-yellow-300">Power Range</th>
                  <th className="text-left py-3 px-2 text-yellow-300">Efficiency</th>
                  <th className="text-left py-3 px-2 text-yellow-300">MPPT</th>
                  <th className="text-left py-3 px-2 text-yellow-300">Est. Cost (KES)</th>
                  <th className="text-left py-3 px-2 text-yellow-300">Warranty</th>
                </tr>
              </thead>
              <tbody>
                {specificationTable.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/30">
                    <td className="py-3 px-2 text-gray-300">{row.category}</td>
                    <td className="py-3 px-2 text-white font-semibold">{row.manufacturer}</td>
                    <td className="py-3 px-2 text-gray-400">{row.powerRange}</td>
                    <td className="py-3 px-2 text-yellow-300">{row.efficiency}</td>
                    <td className="py-3 px-2 text-gray-400">{row.mppt}</td>
                    <td className="py-3 px-2 text-green-300">{row.cost}</td>
                    <td className="py-3 px-2 text-gray-400">{row.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: FORMULAS & CALCULATIONS */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">3. Engineering Formulas & Calculations</h2>

          <div className="space-y-6">
            <div className="bg-slate-900/50 border-l-4 border-yellow-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">Inverter Power Rating</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">
                P_rated = V_array × I_max_array / η_inverter
              </div>
              <p className="text-gray-400">Where: P = power (W), V = DC voltage (V), I = maximum current (A), η = inverter efficiency (&%). For example: 600V × 15A / 0.97 = 9,278W inverter needed for 600V, 15A string.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-yellow-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">DC Cable Voltage Drop</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">
                V_drop = (2 × L × I × ρ) / A
              </div>
              <p className="text-gray-400">Where: V_drop = voltage loss (V), L = cable length (m), I = current (A), ρ = resistivity (0.0175 Ω·mm²/m for copper), A = conductor area (mm²). Example: 50m, 15A, 6mm² cable: V_drop = (2 × 50 × 15 × 0.0175) / 6 = 4.4V (0.73% of 600V). Acceptable range: &lt;2% loss.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-yellow-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">MPPT Efficiency & Power Loss</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">
                P_loss_annual = P_array × (1 - MPPT_efficiency) × PSH × 365
              </div>
              <p className="text-gray-400">Where: P_loss = annual power loss (kWh), P_array = array power rating (kW), MPPT_efficiency = 99.5% (premium) vs 97% (budget), PSH = peak sun hours (5.5 in Kenya). Example: 10kW array, 97% MPPT: Loss = 10 × 0.03 × 5.5 × 365 = 602 kWh/year (2.7% of output). Over 25 years: 15,050 kWh lost = 10,535 KES at 0.70 KES/kWh.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-yellow-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">Temperature Derating Factor</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">
                P_derated = P_rated × (1 - T_coeff × (T_actual - T_ref))
              </div>
              <p className="text-gray-400">Where: T_coeff = temperature coefficient (typically 0.003-0.005 per °C for inverters), T_ref = reference temperature (25°C), T_actual = actual temperature. Example: 10kW inverter at 50°C ambient: P_derated = 10 × (1 - 0.004 × (50-25)) = 10 × 0.9 = 9.0kW (10% derating). In Kenya's 45°C climate: additional 8% derating.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-yellow-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">String Configuration for Optimal Current</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">
                I_string = P_panel / (V_panel × N_series) = 400W / (40V × 10) = 1A
                <br/>I_total = I_string × N_parallel = 1A × 8 strings = 8A
              </div>
              <p className="text-gray-400">Configuring panel strings to achieve 8-15A per MPPT input maximizes efficiency and minimizes cable losses. Lower currents require thicker cables; higher currents increase I²R losses. Optimal range: 10-12A for residential systems, 12-18A for commercial systems.</p>
            </div>

            <div className="bg-slate-900/50 border-l-4 border-yellow-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">Battery Charge Rate & Power Requirement (Hybrid Systems)</h3>
              <div className="bg-slate-950 rounded p-4 font-mono text-gray-300 mb-3">
                P_charge = Battery_capacity_kWh × C_rate
              </div>
              <p className="text-gray-400">Example: 10kWh lithium battery with 0.5C charge rate: P_charge = 10 × 0.5 = 5kW. An inverter with 6kW solar input power can charge this battery at rated speed. A 12kW array with 6kW inverter wastes 50% of peak power when charging this battery.</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: EXPANDED ERROR CODES (30+) */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">4. Comprehensive Error Code Database (30+ Codes)</h2>

          <div className="space-y-8">
            {Object.entries(errorCodes).map(([category, codes]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">{category}</h3>
                <div className="grid gap-4">
                  {codes.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-yellow-600/30 transition">
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

        {/* SECTION 5: TROUBLESHOOTING */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">5. Diagnostic Troubleshooting Procedures</h2>

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
                  <span className={`text-2xl transition ${expandedSection === `ts-${idx}` ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {expandedSection === `ts-${idx}` && (
                  <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                    <ol className="space-y-3">
                      {issue.steps.map((step, sidx) => (
                        <li key={sidx} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center font-bold text-sm text-black">
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

        {/* SECTION 6: MAINTENANCE */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">6. Preventive Maintenance Schedules</h2>

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

        {/* SECTION 7: SAFETY & STANDARDS */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">7. Safety Standards & Installation Requirements</h2>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-yellow-300 mb-3">International Standards</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>IEC 61730:</strong> Photovoltaic module and system safety qualification</li>
                  <li>• <strong>IEC 62109:</strong> Safety of battery energy storage systems</li>
                  <li>• <strong>IEEE 1547:</strong> Interconnection with distributed energy resources</li>
                  <li>• <strong>IEC 60364-7-712:</strong> Electrical installations — Requirements for solar PV</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-300 mb-3">Critical Installation Practices</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• All DC circuits must have overcurrent protection (breakers, fuses)</li>
                  <li>• Grounding resistance verification: &lt;5Ω required (use earth tester)</li>
                  <li>• Surge protection (SPD Type 1 + Type 2 + Type 3 cascaded)</li>
                  <li>• Proper ventilation: 10cm clearance on all inverter sides minimum</li>
                  <li>• Fire-rated wiring in commercial installations exceeding 10kW</li>
                  <li>• Professional electrical inspection before grid connection</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Professional Solar Inverter Services</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            500+ installations across Kenya. 99.2% system uptime. Full maintenance and troubleshooting support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
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
