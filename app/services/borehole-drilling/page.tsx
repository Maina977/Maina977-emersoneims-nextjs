'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BoreholeDrillingPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const errorCodes = {
    'Drilling Equipment': [
      { code: 'D01', meaning: 'Drill Bit Wear/Dulling', severity: 'High', solution: 'Monitor penetration rate drop, replace bit immediately, inspect for chipping or blunting' },
      { code: 'D02', meaning: 'Stuck Pipe (Tool Pinning)', severity: 'High', solution: 'Stop circulation, apply overpull carefully (may exceed rope tensile strength), may require fishing operations' },
      { code: 'D03', meaning: 'Pump Pressure Loss', severity: 'High', solution: 'Check for mud leakage, verify hose integrity, measure pump outlet pressure' },
      { code: 'D04', meaning: 'Pipe Connection Leak', severity: 'Medium', solution: 'Tighten connection, replace O-rings, inspect threads for damage' },
      { code: 'D05', meaning: 'Cable/Rope Fraying', severity: 'High', solution: 'Inspect entire cable length, replace if strands broken (immediate replacement required)' },
      { code: 'D06', meaning: 'Compressor Failure', severity: 'High', solution: 'Check oil level, verify air filter, test discharge pressure (should be 6-8 bar)' },
      { code: 'D07', meaning: 'Hose Rupture', severity: 'High', solution: 'Depressurize system, replace hose section, inspect surrounding hoses' },
      { code: 'D08', meaning: 'Motor Overheating', severity: 'High', solution: 'Check load, improve ventilation, verify fuel quality, measure actual output power' },
      { code: 'D09', meaning: 'Swivel Bearing Wear', severity: 'Medium', solution: 'Listen for grinding noise, replace swivel assembly if worn, lubricate if possible' },
      { code: 'D10', meaning: 'Drilling String Torque Overload', severity: 'High', solution: 'Stop immediately, reduce weight-on-bit, verify hole is straight, perform deviation survey' },
    ],
    'Hydrogeology & Formation Issues': [
      { code: 'H01', meaning: 'Lost Circulation (Mud Loss)', severity: 'High', solution: 'Inject lost-circulation material (LCM), reduce pump pressure, may indicate fractured formation' },
      { code: 'H02', meaning: 'Artesian Flow Too High', severity: 'Medium', solution: 'Verify static head calculation, install larger diameter casing, may need regulator valve' },
      { code: 'H03', meaning: 'Water Table Lower Than Expected', severity: 'Medium', solution: 'Investigate regional hydrogeology, may indicate dry season variation, drill deeper' },
      { code: 'H04', meaning: 'Sand Formation Collapse', severity: 'High', solution: 'Reduce velocity, install screens/strainers, may need to abandon and redrill' },
      { code: 'H05', meaning: 'Saline Water Encountered', severity: 'Medium', solution: 'Test water quality, may require desalination, may indicate seawater intrusion' },
      { code: 'H06', meaning: 'Clay Sealing Formation', severity: 'Medium', solution: 'Drill through carefully, may trap water above, verify total depth reached' },
      { code: 'H07', meaning: 'Fractured Rock Yield Poor', severity: 'High', solution: 'Perform aquifer test, may indicate fractures are  not connected, consider deeper drilling' },
      { code: 'H08', meaning: 'Iron Oxide Staining', severity: 'Low', solution: 'Normal in red soil, install iron removal filter if iron levels high (>3mg/L)' },
      { code: 'H09', meaning: 'Bacterial Contamination', severity: 'High', solution: 'Shock-chlorinate well, perform water quality testing, verify sanitary completion' },
      { code: 'H10', meaning: 'Yield Declining Annually', severity: 'Medium', solution: 'May indicate recharge deficit, perform long-term aquifer test, reduce extraction rate' },
    ],
    'Completion & Testing': [
      { code: 'C01', meaning: 'Pump Selection Mismatch', severity: 'Medium', solution: 'Verify static head + drawdown + friction loss = total head, select correct pump type' },
      { code: 'C02', meaning: 'Casing Corrosion/Rusting', severity: 'Medium', solution: 'Inspect casing material (mild steel rusts in 5-10 years, GI lasts 20-30 years, PVC indefinite)' },
      { code: 'C03', meaning: 'Gravel Pack Contamination', severity: 'High', solution: 'Redevelop well (pumping), clean filter, reinstall proper gravel pack' },
      { code: 'C04', meaning: 'Screen Blockage', severity: 'High', solution: 'Backflush well with high velocity, may require chemical acid treatment for carbonate scaling' },
      { code: 'C05', meaning: 'Surging During Pump Test', severity: 'Medium', solution: 'Indicates improper development, perform additional development cycles' },
      { code: 'C06', meaning: 'Water Table Recovery Slow', severity: 'Low', solution: 'Normal behavior after extended pumping, indicates aquifer characteristics' },
      { code: 'C07', meaning: 'Specific Capacity Below Expected', severity: 'High', solution: 'May indicate low transmissivity, insufficient thickness, or high storativity' },
      { code: 'C08', meaning: 'Interference From Nearby Wells', severity: 'Medium', solution: 'Perform interference aquifer test, may need to reduce combined extraction rate' },
      { code: 'C09', meaning: 'Sanitary Seal Failure', severity: 'High', solution: 'Grout contamination, reimplant bentonite seal, verify sanitary grouting technique' },
      { code: 'C10', meaning: 'Abandonment Incomplete', severity: 'High', solution: 'Ensure proper grout plugs at all depths, sanitary completion, documentation' },
    ],
  };

  const formulas = [
    { title: 'Transmissivity (T)', formula: 'T = Q / (4π × Δh)', example: 'Well produces 100 L/min, drawdown 5m in monitoring well 100m away: T ≈ 1.6×10⁻² m²/s (good aquifer)' },
    { title: 'Storativity (S)', formula: 'S = (Q × t) / (4π × T × r²)', example: '24-hour test data allows storativity calculation, indicates aquifer response to recharge' },
    { title: 'Specific Capacity', formula: 'Sc = Q / Δh (L/min per meter drawdown)', example: '100 L/min / 5m drawdown = 20 L/min/m (excellent productivity)' },
    { title: 'Recharge Requirement', formula: 'R = Q / A (mm/year needed)', example: '200 L/min (288 m³/day) from 2km² catchment = 526 mm/year recharge needed' },
  ];

  const troubleshooting = [
    { title: 'Low Yield or Dry Well', steps: ['1. Verify static water level (measure depth to water)', '2. Calculate expected yield from transmissivity', '3. Check pump intake is below water level', '4. Perform development (backflushing) to remove fine particles', '5. Consider artesian head if confined aquifer'] },
    { title: 'Declining Yield Over Time', steps: ['1. Measure historical static levels', '2. Perform aquifer test to calculate recharge vs extraction', '3. If declining: extraction exceeds recharge, reduce usage or drill additional well', '4. Check for screen clogging or pump wear'] },
    { title: 'High Iron/Turbidity', steps: ['1. Perform 24-hour pump test, collect samples at intervals', '2. If turbidity decreases: fine particle removal, install settling tank', '3. If turbidity constant: natural iron present, install iron filter (>3mg/L requires treatment)'] },
    { title: 'Contamination Issues', steps: ['1. Sample at multiple depths to locate contamination source', '2. Bacterial: shock-chlorinate, verify sanitary seal', '3. Chemical: identify source (waste pit, fertilizer, salt intrusion)', '4. May require well abandonment if contaminated zone is main aquifer'] },
  ];

  const maintenance = [
    { period: 'Monthly', tasks: ['Check water level (early morning before use)', 'Monitor pump operation for unusual noise/vibration', 'Visual inspection of wellhead structure', 'Test water quality visually (color, odor, taste if safe)'] },
    { period: 'Quarterly', tasks: ['Perform static water level measurement with proper equipment', 'Measure actual discharge rate (compare to baseline)', 'Inspect pump seal for leakage', 'Check electrical connections if submersible pump'] },
    { period: 'Annually', tasks: ['Professional water quality testing (bacteria, iron, TDS, pH)', 'Well development/backflushing if needed', 'Pump performance testing under load', 'Wellhead seal inspection, regrout if needed'] },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border-b border-emerald-600/30 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">Borehole Drilling: Complete Technical Reference</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl">
            Comprehensive guide for borehole site selection, drilling methods, hydrogeology, aquifer testing, yield assessment, and maintenance. Kenya-specific aquifer data and climate considerations.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-emerald-400">1. Borehole Hydrogeology & Aquifer Fundamentals</h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-lg leading-relaxed">Boreholes access groundwater stored in aquifers—underground formations containing water in soil pores and rock fractures. Kenya has diverse hydrogeology: volcanic aquifers in the highlands yield excellent water with high transmissivity (1-5×10⁻² m²/s); sedimentary aquifers in coastal regions have lower transmissivity (1-10×10⁻⁴ m²/s) but greater thickness. Understanding local hydrogeology is critical for predicting borehole success and yield before drilling.</p>

            <p className="text-lg leading-relaxed">Confined aquifers trapped between impermeable clay layers exhibit artesian flow—water rises above the aquifer level due to hydrostatic pressure from recharge areas at higher elevation. Unconfined aquifers exposed directly to atmosphere rely on direct rainfall recharge. In Kenya's arid regions (northeast, south), unconfined aquifers may receive &lt;100mm annual recharge, limiting sustainable extraction. Overexploitation causes water table decline of 1-2m annually, a critical concern in high-population areas around Nairobi.</p>

            <p className="text-lg leading-relaxed">Transmissivity (T) measures aquifer's ability to transmit water: T = permeability × thickness. High transmissivity (&gt;10⁻² m²/s) indicates excellent productivity; low transmissivity (&lt;10⁻⁴ m²/s) may yield only 5-10 L/min regardless of borehole depth. Professional site selection includes aquifer testing of existing boreholes to map transmissivity before committing to expensive drilling. A 500m dry hole costs 3-5 million KES; testing existing wells (1 million KES) often prevents catastrophic failure.</p>

            <p className="text-lg leading-relaxed">Specific capacity (Q/Δh) quantifies productivity: 20 L/min per meter drawdown is excellent; 2-5 L/min/m is poor. Borehole design must account for specific capacity—a low-capacity well with high pumping head requires larger diameter casing and screened interval to minimize entrance velocity and friction losses. Entrance velocity should not exceed 0.03 m/s to avoid turbidity and sediment infiltration.</p>

            <p className="text-lg leading-relaxed">Drilling methods dramatically affect well yield and longevity. Percussion drilling fractures rock but creates damaging stress in borehole walls; rotary drilling with mud circulation minimizes stress and creates cleaner boreholes. Air percussion drilling is fastest (300m/day in hard rock) but creates larger boreholes requiring more casing. Method selection depends on geology, depth target, and yield requirements. Deep boreholes (&gt;200m) almost exclusively use rotary drilling.</p>

            <p className="text-lg leading-relaxed">Well development removes drilling mud, fine particles, and formation damage that reduce yield. Backflushing—pumping clean water at high velocity through the borehole—forces particles into the aquifer and removes mud cake. A proper development program can increase yield 50-100% by restoring natural flow paths. Most boreholes are under-developed due to time pressure; professional development takes 3-7 days, not the 2-3 hours allocated to rushed projects.</p>

            <p className="text-lg leading-relaxed">Seasonal and annual water level variations are critical for long-term sustainability. In Kenya, water levels typically drop 1-3m annually in unconfined aquifers under pumping stress. Boreholes drilled to static water level may fail during dry season when levels drop additional 2-5m. Professional design must account for lowest-expected-water-level (LEWL), not average water level, to ensure year-round reliability.</p>

            <p className="text-lg leading-relaxed">Climate change impacts on groundwater are severe: shifting rainfall patterns reduce recharge; longer dry seasons increase extraction stress. In northern Kenya, aquifers with 50-100 year residence time accumulated water during wetter historical periods but current recharge is insufficient for modern extraction rates. Many boreholes are mining fossil water—depleting finite aquifer reserves. Sustainable drilling requires realistic recharge analysis and extraction-rate limits.</p>

            <p className="text-lg leading-relaxed">Quality contamination from shallow sources (pit latrines, waste sites, surface spills) occurs through vertical infiltration. Most contamination occurs in first 30m; deeper drilling reduces biological contamination risk but increases cost. Sanitary completion—proper grouting, sealed wellhead, protection from surface flooding—prevents downward migration of contaminated water. Many rural boreholes lack proper sanitary completion, creating health risks.</p>

            <p className="text-lg leading-relaxed">Salinity intrusion near coastal areas forces boreholes to drill deeper to avoid brackish water. Seawater penetrates kilometers inland in sandy aquifers; monitoring wells reveal salinity wedge that advances during dry seasons. Some boreholes become unusable within 10-15 years as salinity gradually increases. Salt-affected aquifers require desalination (expensive) or relocation of water source.</p>

            <p className="text-lg leading-relaxed">Iron and manganese precipitation occurs when anoxic groundwater mixes with oxygen, creating staining and sediment. While not immediately harmful at low levels (&lt;3mg/L), iron promotes bacterial growth and clogs pipes/screens. Proper borehole development, initial flushing, and pH adjustment can minimize iron precipitation. Installed iron-removal filters handle iron &lt;15mg/L; higher levels may indicate oxidation issues.</p>

            <p className="text-lg leading-relaxed">Hardness (calcium + magnesium salts) affects downstream uses: &gt;500 mg/L CaCO3 causes scaling in pipes and boilers. Most Kenyan groundwater is moderately hard (100-400 mg/L); softening systems are often unnecessary but may improve appliance life. Conversely, soft water (&lt;50 mg/L) is corrosive to metal pipes—pH adjustment prevents corrosion.</p>

            <p className="text-lg leading-relaxed">Aquifer testing (pumping test) is the definitive method to predict borehole reliability. A 72-hour test costs 150-300k KES but prevents multimillion-shilling failures. Test measures transmissivity, storativity, specific capacity, and aquifer boundaries. Professional reports provide sustainable yield recommendations—extraction rates exceeding these causes water-level decline and eventual well failure.</p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-6 mt-8">
            <h3 className="text-2xl font-bold text-emerald-300 mb-4">Formulas for Aquifer Analysis</h3>
            <div className="space-y-4">
              {formulas.map((f, i) => (
                <div key={i} className="bg-slate-950 rounded p-4">
                  <p className="font-semibold text-emerald-300 mb-2">{f.title}</p>
                  <p className="font-mono text-gray-400 mb-2">{f.formula}</p>
                  <p className="text-sm text-gray-400">{f.example}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ERROR CODES */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-emerald-400">2. Error Codes & Diagnostic Guide (30+ Codes)</h2>

          <div className="space-y-8">
            {Object.entries(errorCodes).map(([category, codes]) => (
              <div key={category}>
                <h3 className="text-2xl font-bold text-emerald-300 mb-4">{category}</h3>
                <div className="grid gap-4">
                  {codes.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-emerald-600/30 transition">
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
          <h2 className="text-4xl font-bold mb-8 text-emerald-400">3. Troubleshooting Procedures</h2>

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
                  <h3 className="text-xl font-bold text-emerald-400">{issue.title}</h3>
                  <span className={`text-2xl transition ${expandedSection === `ts-${idx}` ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {expandedSection === `ts-${idx}` && (
                  <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                    <ol className="space-y-3">
                      {issue.steps.map((step, sidx) => (
                        <li key={sidx} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-sm text-black">
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
          <h2 className="text-4xl font-bold mb-8 text-emerald-400">4. Maintenance Schedules</h2>

          <div className="space-y-8">
            {maintenance.map((schedule, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-emerald-600/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-emerald-300 mb-4">{schedule.period} Maintenance</h3>
                <ul className="space-y-3">
                  {schedule.tasks.map((task, tidx) => (
                    <li key={tidx} className="flex gap-3 text-gray-300">
                      <span className="text-emerald-400 text-xl flex-shrink-0">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-600/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Professional Borehole Drilling Services</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            1000+ boreholes drilled across Kenya. Aquifer testing, yield optimization, and sustainable extraction planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition">
              Request Consultation
            </Link>
            <Link href="/generators/spare-parts" className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition">
              Browse Equipment
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
