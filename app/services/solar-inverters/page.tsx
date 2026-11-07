import { Metadata } from 'next';
import Link from 'next/link';
import { SolarInverterSchematic } from '@/components/visualizations/ServiceSchematics';
import { SolarInverterTemperatureDerating } from '@/components/visualizations/PerformanceGraphs';
import { EfficiencyGauge } from '@/components/visualizations/DiagnosticTools';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/services/solar-inverters' },
  title: 'Solar Inverters: Complete Technical Guide',
  description: 'Solar inverter engineering guide: MPPT, temperature derating, string voltage, grid-tie vs hybrid, common fault categories, troubleshooting and maintenance, with the figures checked for Kenyan conditions.',
  keywords: [
    'solar inverter', 'MPPT inverter', 'hybrid inverter', 'grid-tie inverter',
    'solar power inverter Kenya', 'inverter error codes', 'solar system troubleshooting',
    'inverter efficiency', 'solar installation guide', 'inverter maintenance',
    'renewable energy Kenya', 'solar panel controller'
  ],
  openGraph: {
    title: 'Solar Inverters: Complete Technical Reference Guide',
    description: 'Professional engineering guide for solar inverters: design, operation, error codes, troubleshooting, maintenance',
    type: 'article',
    url: 'https://www.emersoneims.com/services/solar-inverters',
    images: [
      {
        url: 'https://www.emersoneims.com/images/solar-inverter-schematic.jpg',
        width: 1200,
        height: 630,
        alt: 'Solar Inverter System Diagram'
      }
    ]
  }
};

export default function SolarInvertersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="bg-gradient-to-r from-amber-900/30 to-yellow-900/20 border-b border-amber-600/30 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
              Solar Inverters: Complete Technical Reference
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Engineering guide covering MPPT, efficiency, grid-tie vs hybrid systems, common fault categories, troubleshooting and maintenance. Fault codes differ between manufacturers: always check the code in your inverter&apos;s own manual.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* SECTION 1: FUNDAMENTALS */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-amber-400">1. Solar Inverter Fundamentals & System Architecture</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-8 mb-12">
            <p className="text-lg leading-relaxed">
              A solar inverter converts DC electricity from photovoltaic panels into AC electricity for grid injection or home use. This appears simple but involves sophisticated electronics: the inverter must continuously track the optimal operating point of the solar array (MPPT), stabilize voltage and frequency, isolate the load from grid disturbances, and shut down instantly if the grid fails (anti-islanding protection). Professional understanding requires knowledge of power electronics, control theory, and electrical safety.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Three primary inverter topologies exist:</strong> (1) Grid-tie inverters inject all power to the utility grid; no battery storage. (2) Hybrid inverters support both grid and battery storage, automatically switching between modes. (3) Off-grid inverters power standalone systems without grid connection. Each topology has different hardware, control algorithms, and safety requirements. Grid-tie is most common in Kenya due to low cost; hybrid is growing as battery prices decline.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>MPPT (Maximum Power Point Tracking)</strong> is the core intelligence of a modern inverter. Solar panel output varies continuously with irradiance (sun intensity) and temperature. At any given condition, there exists one voltage where power output is maximum. MPPT algorithms measure panel voltage and current, calculate power, and adjust the DC-DC converter to operate at this optimal point. Without MPPT, panels might operate 20-30% below maximum power. Modern inverters achieve 98-99% MPPT efficiency: panels deliver 99% of theoretical maximum power, losing only 1% to algorithm overshooting and transient responses.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Temperature derating depends on where the inverter is mounted, not only on the weather.</strong> Most inverters deliver full rated power up to a stated ambient temperature, commonly about 45°C (check the derating curve on the datasheet), and reduce output above it. Outdoor air in Kenya rarely reaches that: Nairobi afternoons are typically 24–29°C, the coast around 30–33°C and the hottest northern lowlands the high 30s. The air around an inverter in an unventilated plant room, a sealed cabinet or a metal enclosure in direct sun can be 10–15°C hotter than outside, and that is where derating and overheating trips usually come from. PV modules are a separate effect: they lose roughly 0.3–0.4% of power per °C of cell temperature above 25°C, and cells on a sunny roof run 20–30°C above the air. Proper installation requires: (1) minimum 10cm clearance on all sides, (2) unrestricted airflow, (3) shaded location if possible, (4) internal fans functioning at load. If not addressed, inverters overheat, derating output or shutting down during peak sunshine—exactly when power is needed most.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>String voltage and current configuration directly affects system efficiency.</strong> Solar panels can be connected in series (voltage adds) or parallel (current adds). High-voltage strings (400-500V DC) allow smaller cable sizes and lower resistive losses. A 10kW array at 400V DC carries 25A; at 120V it carries 83A. On the same cable the current is 3.3 times higher and the resistive loss (I²R) about 11 times higher. Professional design keeps the string voltage inside the inverter&apos;s MPPT window at the hottest cell temperature, and below its maximum DC input voltage at the coldest (cold mornings raise Voc). Undersized conductors not only lose energy as heat but can also start fires if proper fusing isn't installed.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Grid-tie inverters include sophisticated anti-islanding protection.</strong> If the grid fails (blackout), the inverter must stop exporting to prevent backfeed into utility lines, a hazard to line workers. The IEC 62116 anti-islanding test requires disconnection within 2 seconds. Inverters test for grid presence by measuring voltage, frequency, and phase angle. A healthy grid shows stable 230V at 50Hz with tight phase control. The voltage and frequency trip settings are set to the utility&apos;s connection requirements (Kenya Power for grid-connected systems), and they must be checked at commissioning.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Harmonic distortion in inverter output affects utility power quality.</strong> A square-wave output has roughly 48% THD (Total Harmonic Distortion) and a modified-sine output around 24%. Grid-tie and hybrid inverters produce a PWM pure-sine current, typically under 3% THD at rated output. IEC 61727 and IEEE 1547 limit current THD from grid-connected inverters to 5% at rated output.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Hybrid inverters add battery management complexity.</strong> Unlike grid-tie inverters that simply maximize power output, hybrid inverters must manage three power sources (solar, battery, grid) and two loads (consumption, charging). During peak sun, excess power charges the battery. At night or cloud cover, the battery supplies power. When battery is full and consumption is low, power flows to the grid. This requires constant load forecasting and battery state estimation. Charge and discharge limits are set to the battery maker&apos;s figures; a shallower depth of discharge generally gives more cycles, and the battery datasheet states the cycle life at each depth.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Read the efficiency figure for what it is.</strong> "Maximum efficiency" is the single best point. CEC efficiency and European efficiency (EN 50530) are weighted averages across several load levels at nominal DC voltage, and are usually 0.5–1.5 points below the maximum. Efficiency falls at very light load and changes with DC voltage, so compare the efficiency curve at your typical load and string voltage rather than the headline number.
            </p>
          </div>

          {/* SCHEMATIC */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-amber-300 mb-6">System Architecture Diagram</h3>
            <SolarInverterSchematic />
          </div>
        </section>

        {/* SECTION 2: ERROR CODES */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-6 text-amber-400">2. Common Fault Categories</h2>
          <p className="text-gray-400 mb-12 max-w-4xl">The codes below (E001, B001, T001 and so on) are numbered for this guide only; they are not any manufacturer&apos;s codes. Growatt, Deye, Huawei, SMA, Victron and others each use their own numbering, so look up the exact code in your inverter&apos;s manual before acting on it.</p>

          <div className="space-y-12">
            {/* MPPT Errors */}
            <div>
              <h3 className="text-2xl font-bold text-amber-300 mb-6">MPPT & Input Errors (E001-E008)</h3>
              <div className="grid gap-4">
                {[
                  { code: 'E001', title: 'PV Input Voltage Too High (>Vmax)', severity: 'High', solution: 'String voltage exceeds inverter maximum. Reconfigure: reduce panels per string or add parallel strings. Size the string on Voc at the coldest expected cell temperature, not at 25°C: Voc_max = Voc_STC × (1 + β × (T_min − 25)), with β (the Voc temperature coefficient, typically −0.25 to −0.30 %/°C) from the module datasheet. Example: a 49.5V Voc module at a 5°C highland dawn gives 49.5 × (1 + 0.0028 × 20) ≈ 52.3V, so a 500V inverter takes at most 9 in series. Measure with multimeter in sunlight.' },
                  { code: 'E002', title: 'PV Input Voltage Too Low (<Vmin)', severity: 'Medium', solution: 'Panel output below MPPT minimum (~80V). Check for loose MC4 connections, test panel output with multimeter (compare with the module&apos;s datasheet Voc), verify no shading, clean panels if dusty.' },
                  { code: 'E003', title: 'MPPT Tracking Failure', severity: 'Medium', solution: 'MPPT algorithm not optimizing power output. Reset inverter (power down 2 min), check firmware version (update if available), verify current sensor reading with external clamp meter, test panel connections for high resistance.' },
                  { code: 'E004', title: 'DC Input Current Excessive (>Imax)', severity: 'High', solution: 'IMMEDIATE SHUTDOWN REQUIRED. Measure DC current with clamp meter—should not exceed rated input current by more than 10%. Indicates internal short circuit or converter failure. Use thermal imaging to locate hot components. Do not restart until professionally inspected.' },
                  { code: 'E005', title: 'DC Voltage Ripple Abnormal', severity: 'Medium', solution: 'Measured with oscilloscope at DC input. Should show &lt;5V ripple at 400V (1.25%). Higher ripple indicates aging input filter capacitor. Measure capacitor ESR (equivalent series resistance): replace if it has risen to about twice its rated value.' },
                  { code: 'E006', title: 'Boost Converter Failure', severity: 'High', solution: 'Internal power stage failure. Requires factory repair or board replacement. Component-level diagnostics needed: measure MOSFET drain-source resistance (should be &lt;1Ω when on, &gt;MΩ when off), check gate drive voltage signal with oscilloscope.' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-amber-600/50 transition">
                    <div className="flex gap-4">
                      <span className={`px-4 py-2 rounded font-mono font-bold text-sm flex-shrink-0 ${
                        item.severity === 'High' ? 'bg-red-600/20 text-red-300' : 'bg-amber-600/20 text-amber-300'
                      }`}>
                        {item.code}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-lg mb-2">{item.title}</p>
                        <p className="text-gray-400 text-sm mb-3">{item.solution}</p>
                        <p className="text-xs text-gray-500">Severity: <span className={item.severity === 'High' ? 'text-red-400' : 'text-amber-400'}>{item.severity}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid Errors (condensed for token efficiency) */}
            <div>
              <h3 className="text-2xl font-bold text-amber-300 mb-6">Grid Connection Errors (E101-E110)</h3>
              <p className="text-sm text-gray-400 mb-6">E101: Grid voltage abnormal (measure 230V±10% at terminals). E102: Frequency out of range (grid instability 48-52Hz normal). E103: Phase sequence incorrect (verify ABC, swap if needed). E104: Grid disconnect detected (normal anti-islanding response). E105-E110: Various protection systems (harmonic filtering, GFCI, relay diagnostics).</p>
              <p className="text-sm text-gray-400"><strong>Professional Approach:</strong> Use clamp meter + multimeter to measure grid voltage, frequency counter for 50Hz verification, record any error occurrences in a logbook to identify patterns (e.g., recurring at certain times suggests load-related grid disturbances).</p>
            </div>

            {/* Battery Errors */}
            <div>
              <h3 className="text-2xl font-bold text-amber-300 mb-6">Battery & Storage Errors (B001-B008)</h3>
              <p className="text-sm text-gray-400">Hybrid inverters with battery storage report errors for: low battery voltage (below 42V for 48V system), over-temperature (&gt;55°C), cell imbalance (voltage drift between cells), BMS communication loss (CAN/RS485 cable issue), charging timeout (battery not reaching float voltage within expected time), excessive discharge current (load exceeding battery capability).</p>
              <p className="text-sm text-gray-400 mt-3"><strong>Diagnostic Method:</strong> Test battery voltage at terminals (should show 48V±2% for 48V system), measure charging current with clamp meter (should taper as voltage approaches float voltage 54-56V), listen for BMS contactor clicks (if missing, CAN communication lost). Modern battery systems include built-in BMS that reports fault codes to the inverter—cross-reference inverter error with battery pack's internal display.</p>
            </div>

            {/* Thermal & Protection */}
            <div>
              <h3 className="text-2xl font-bold text-amber-300 mb-6">Thermal & Protection (T001-O002)</h3>
              <p className="text-sm text-gray-400">T001: Over-temperature or thermal derating. The inverter protects itself by reducing output at its internal thermal limit (stated in the manual). It usually means the air around it is too hot: verify fans running, clean intake filters, restore the clearances in the installation manual, and ventilate or shade the location. T002-T004: Transformer and sensor faults (component-level diagnostics). O001-O002: Overcurrent and overvoltage protections (indicate either short circuits or grid disturbances).</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: PERFORMANCE GRAPHS */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-amber-400">3. Performance Analysis & Temperature Derating</h2>

          <div className="space-y-12">
            <SolarInverterTemperatureDerating />

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-amber-300 mb-6">Efficiency Gauge (Real-World Example)</h3>
              <EfficiencyGauge current={92} optimal={95} />
              <p className="text-sm text-gray-400 mt-6">
                Worked example: a 10kW array in Nairobi at about 5.5 peak-sun-hours a day produces roughly 20,000 kWh a year. Two percentage points of inverter efficiency are worth about 400 kWh a year, or 8,000 kWh over 20 years: around KES 200,000 at an assumed KES 25/kWh. That is the scale to weigh a more efficient inverter against.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: TROUBLESHOOTING */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-amber-400">4. Professional Troubleshooting Procedures</h2>

          <div className="space-y-8">
            {[
              {
                title: 'No Power Output (Inverter Dead)',
                steps: [
                  '1. Check DC input: Measure voltage between positive/negative on inverter input terminal (multimeter DC setting). Should read 100-500V depending on array configuration.',
                  '2. If no DC voltage: Check breaker at solar array (may be tripped). Verify MC4 connectors at inverter (clean if corroded). Measure panel output in sunlight with multimeter.',
                  '3. If DC voltage present: Check inverter display for error codes. Press reset button and observe if display lights up. If no display, check 24V auxiliary power supply (check fuse).',
                  '4. If display lights but no output: Check AC breaker at inverter output (verify switch position). Measure AC voltage at output terminals—should read 230V or 380V depending on configuration.',
                  '5. If all voltages present but no grid output: Inverter may be in standby (normal at night/dawn). Force grid connection by pressing "Run" button if available. If error persists, check anti-islanding test function (verify grid connected, not isolated).',
                  '6. Last resort: Power cycle by switching off main DC breaker for 2 minutes, then restart. Check error log in inverter menu for timestamp of shutdown.'
                ]
              },
              {
                title: 'Low Power Output (Producing 30-50% Expected)',
                steps: [
                  '1. Check time of day: At 9AM or 3PM, sun angle is lower, output naturally reduces. Check actual irradiance (ideally 800+ W/m² for rated power).',
                  '2. Check for shading: Walk around entire solar array at same time every day for 1 week. Even small shadows (roof edge, trees, poles) reduce output 15-30%. Use shade analysis software or observe shadows on array.',
                  '3. Clean panels: Dust, bird droppings, and pollen reduce output 5-20% depending on density. Use soft brush and distilled water (not tap water, minerals leave residue). Clean panels monthly in dry season, after every rain in rainy season.',
                  '4. Check panel voltage: Measure with multimeter at peak sun time (11AM-2PM). Compare with the module&apos;s datasheet Vmp (times the panels in series); a module far below its neighbours may be damaged (delamination, crack, cell failure).',
                  '5. Check string configuration: Verify series strings are correct length (mismatch causes power loss). Use clamp meter to measure DC current—low current indicates voltage imbalance between strings.',
                  '6. Temperature check: if the display or log shows thermal derating, improve ventilation, clean cooling fins and verify fans running. The derating temperature is in the manual.'
                ]
              },
              {
                title: 'High Temperature / Derating Occurring',
                steps: [
                  '1. Measure the air temperature right beside the inverter with a thermometer (not the weather forecast) and compare it with the full-power limit on the datasheet derating curve.',
                  '2. Check cooling fans: Listen for fan noise at inverter. If silent during high load, fan motor may have failed. Measure 24V aux power to fan (should read 24V DC±10%).',
                  '3. Clean cooling fins: Dust buildup acts as insulation. Use compressed air to blow out accumulated dust. Check for spider webs or debris blocking airflow.',
                  '4. Verify clearance: Measure distance from inverter to walls/cabinets. Minimum 10cm clearance on all sides required. If enclosed, add external cooling fan blowing ambient air past heatsink.',
                  '5. Check load profile: If power output remains constant but temperature climbing, verify load is actually at rated power (use clamp meter on AC output). System may be misdiagnosed as "derating" when actually operating normally at lower load.',
                  '6. Reduce ambient temperature: Install inverter in shaded location (not direct sun). Consider relocating from enclosed room to ventilated area. Install awning/shade structure if mounted outdoors.'
                ]
              }
            ].map((proc, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
                <h3 className="text-xl font-bold text-amber-300 mb-6">{proc.title}</h3>
                <ol className="space-y-3 text-sm text-gray-400">
                  {proc.steps.map((step, j) => (
                    <li key={j} className="flex gap-4">
                      <span className="flex-shrink-0 font-bold text-amber-400 min-w-fit">{step.split('.')[0]}.</span>
                      <span>{step.split('.').slice(1).join('.')}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: MAINTENANCE */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-amber-400">5. Professional Maintenance Schedules</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                period: 'MONTHLY',
                tasks: ['Visual inspection of solar array for damage/tilting', 'Check inverter for error codes on display', 'Listen for cooling fan operation at peak load', 'Record daily energy production in logbook', 'Monitor for unusual noises or odors']
              },
              {
                period: 'QUARTERLY (Every 3 Months)',
                tasks: ['Clean solar panels (dust, bird droppings, salt spray)', 'Measure DC input voltage (verify no drift)', 'Check AC output voltage and frequency (should be 230V±5%, 50Hz±0.1Hz)', 'Inspect cooling fins for dust/debris', 'Review production logs for anomalies']
              },
              {
                period: 'ANNUALLY (Every 12 Months)',
                tasks: ['Professional electrical inspection (check all connections for corrosion)', 'Thermal imaging of inverter heatsink (identify hot spots)', 'Test anti-islanding protection (grid disconnect function)', 'Check AC breaker and disconnect switches for operation', 'Measure earth electrode resistance and compare with the design value', 'Full system performance test under rated load']
              }
            ].map((sched, i) => (
              <div key={i} className="bg-slate-900/50 border border-amber-600/30 rounded-lg p-8">
                <h3 className="text-xl font-bold text-amber-300 mb-4">{sched.period}</h3>
                <ul className="space-y-3">
                  {sched.tasks.map((task, j) => (
                    <li key={j} className="flex gap-3 text-sm text-gray-300">
                      <span className="text-amber-400 flex-shrink-0">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-amber-900/30 to-yellow-900/20 border border-amber-600/30 rounded-lg p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Professional Solar Installation & Support</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Design, installation, monitoring and maintenance across Kenya, with 1 year on installation workmanship. We size systems for the site&apos;s real temperatures, shading and loads, not brochure conditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition text-lg">
              Request Solar Consultation
            </Link>
            <Link href="/solar" className="px-8 py-4 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition text-lg">
              View Solar Solutions
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
