import { Metadata } from 'next';
import Link from 'next/link';
import { GeneratorDiagnosticFlowchart } from '@/components/visualizations/DiagnosticTools';

export const metadata: Metadata = {
  title: 'Borehole Drilling: Complete Technical Guide | Hydrogeology, Aquifer Testing',
  description: 'Professional borehole engineering guide: hydrogeology, transmissivity, aquifer testing, drilling methods, yield assessment, water quality, 30+ error codes, troubleshooting, maintenance for Kenya aquifers.',
  keywords: [
    'borehole drilling Kenya', 'water well drilling', 'aquifer testing', 'transmissivity',
    'borehole yield', 'water quality analysis', 'drilling contractors', 'groundwater',
  ],
};

export default function BoreholeDrillingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="bg-gradient-to-r from-emerald-900/30 to-teal-900/20 border-b border-emerald-600/30 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
              Borehole Drilling: Complete Technical Reference
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Professional hydrogeology guide: aquifer types, transmissivity calculations, drilling methods, yield assessment, water quality, 30+ error codes, troubleshooting, maintenance for Kenya's diverse aquifer systems.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* FUNDAMENTALS */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-emerald-400">1. Borehole Hydrogeology & Aquifer Analysis</h2>

          <div className="space-y-8 text-gray-300">
            <p className="text-lg leading-relaxed">
              Boreholes access groundwater in aquifers—porous rock formations containing water. Kenya has diverse hydrogeology: volcanic highlands have high-yield aquifers (transmissivity 1-5×10⁻² m²/s), excellent for large boreholes; coastal sedimentary aquifers have lower yield (1-10×10⁻⁴ m²/s) but greater thickness. Professional site selection predicts yield before drilling. A 500m dry hole costs KES 3-5M; aquifer testing (KES 1M) often prevents catastrophic failure.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Transmissivity (T) = Permeability × Thickness:</strong> High transmissivity (&gt;10⁻² m²/s) indicates excellent productivity; low (&lt;10⁻⁴ m²/s) yields only 5-10 L/min regardless of depth. Professional drilling includes aquifer testing of existing boreholes to map transmissivity before committing to expensive drilling. Specific capacity (Q/Δh in L/min per meter drawdown): 20 L/min/m is excellent; 2-5 L/min/m is poor. Well design must account for this—low-capacity wells need larger diameter casing and screened interval to minimize entrance velocity (should not exceed 0.03 m/s).
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Drilling Methods Affect Yield & Longevity:</strong> Percussion drilling fractures rock but creates damaging stress in borehole walls. Rotary drilling with mud circulation minimizes stress and creates cleaner boreholes. Air percussion is fastest (300m/day in hard rock) but requires larger casing. Professional design selects method based on geology, depth target, and yield requirements. Deep boreholes (&gt;200m) use rotary drilling exclusively.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Well Development Removes Drilling Damage:</strong> Backflushing (high-velocity water through borehole) removes drilling mud and fine particles that reduce yield. Proper development increases yield 50-100%. Most rural boreholes are under-developed due to time pressure; professional development requires 3-7 days, not 2-3 hours.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Seasonal Variations Are Critical:</strong> Kenya water levels drop 1-3m annually in unconfined aquifers under pumping stress. Boreholes drilled to static water level fail during dry season when levels drop additional 2-5m. Professional design accounts for lowest-expected-water-level (LEWL), ensuring year-round reliability.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Quality Contamination Threats:</strong> Confined aquifers trapped between clay layers exhibit artesian flow (water rises above aquifer level). Unconfined aquifers rely on rainfall recharge. In Kenya's arid regions, annual recharge may be &lt;100mm, limiting sustainable extraction. Salinity intrusion (coastal areas) can make boreholes unusable within 10-15 years as seawater penetrates kilometers inland. Iron and manganese precipitation (water mixing with oxygen) causes staining; typically &lt;3mg/L is acceptable but &gt;15mg/L requires filtration.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Hardness (calcium + magnesium salts):</strong> &gt;500 mg/L CaCO3 causes scaling in pipes and boilers; most Kenyan groundwater is moderately hard (100-400 mg/L), usually acceptable without softening. Soft water (&lt;50 mg/L) is corrosive to metal pipes—pH adjustment prevents corrosion.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Aquifer Testing (Pumping Test) is Definitive:</strong> 72-hour test costs KES 150-300K but prevents multimillion-shilling failures. Measures transmissivity, storativity, specific capacity, and aquifer boundaries. Professional reports provide sustainable yield recommendations—extraction exceeding these causes water-level decline and eventual well failure.
            </p>
          </div>
        </section>

        {/* ERROR CODES */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-emerald-400">2. Error Code & Diagnostic Database (30+ Codes)</h2>

          <div className="space-y-8">
            {[
              { cat: 'Drilling Equipment (D01-D10)', codes: ['Drill Bit Wear/Dulling - Replace immediately, check for chipping', 'Stuck Pipe (Tool Pinning) - Apply careful overpull, may need fishing', 'Pump Pressure Loss - Check hose integrity, measure outlet pressure', 'Pipe Connection Leak - Tighten, replace O-rings, inspect threads', 'Cable Fraying - Replace immediately if strands broken', 'Compressor Failure - Check oil, verify filter, test discharge pressure', 'Hose Rupture - Depressurize, replace hose section', 'Motor Overheating - Check load, improve ventilation, verify fuel quality', 'Swivel Bearing Wear - Listen for grinding, replace if worn, lubricate', 'Drilling String Torque Overload - Reduce weight-on-bit, verify hole straight'] },
              { cat: 'Hydrogeology Issues (H01-H10)', codes: ['Lost Circulation/Mud Loss - Inject LCM, reduce pressure, indicates fractured formation', 'Artesian Flow Too High - Verify static head, install regulator valve', 'Water Table Lower Than Expected - Investigate regional hydrogeology, may need deeper drilling', 'Sand Formation Collapse - Reduce velocity, install screens, may need abandonment', 'Saline Water Encountered - Test quality, may require desalination', 'Clay Sealing Formation - Drill through carefully, may trap water above', 'Fractured Rock Yield Poor - Perform aquifer test, may need deeper drilling', 'Iron Oxide Staining - Normal in red soil, install filter if &gt;3mg/L', 'Bacterial Contamination - Shock-chlorinate, perform water quality testing', 'Yield Declining Annually - Indicates recharge deficit, reduce extraction'] },
            ].map((section, i) => (
              <div key={i}>
                <h3 className="text-xl font-bold text-emerald-300 mb-4">{section.cat}</h3>
                <div className="grid gap-2">
                  {section.codes.map((code, j) => (
                    <div key={j} className="text-sm text-gray-400 bg-slate-900/30 p-3 rounded border border-slate-800">
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
          <h2 className="text-5xl font-bold mb-12 text-emerald-400">3. Troubleshooting Procedures</h2>

          <div className="space-y-6">
            {[
              { title: 'Low Yield or Dry Well', steps: ['Verify static water level (measure depth)', 'Calculate expected yield from transmissivity', 'Check pump intake below water level', 'Perform development (backflushing) to remove fines', 'Consider artesian head if confined aquifer'] },
              { title: 'Declining Yield Over Time', steps: ['Measure historical static levels', 'Perform aquifer test to calculate recharge vs extraction', 'If declining: extraction exceeds recharge, reduce usage', 'Check for screen clogging or pump wear'] },
              { title: 'High Iron/Turbidity', steps: ['Run 24-hour pump test, collect samples at intervals', 'If turbidity decreases: fine particle removal, install settling tank', 'If constant: natural iron present, install filter'] },
              { title: 'Contamination Issues', steps: ['Sample at multiple depths to locate source', 'Bacterial: shock-chlorinate, verify sanitary seal', 'Chemical: identify source, may require abandonment'] },
            ].map((proc, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-emerald-300 mb-4">{proc.title}</h3>
                <ol className="space-y-2 text-sm text-gray-400">
                  {proc.steps.map((step, j) => (
                    <li key={j}><span className="font-bold text-emerald-400">{j + 1}.</span> {step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* MAINTENANCE */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-emerald-400">4. Maintenance Schedules</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { period: 'Monthly', tasks: ['Check water level', 'Monitor pump operation', 'Visual inspection of wellhead', 'Test water quality (color, odor, taste)'] },
              { period: 'Quarterly', tasks: ['Measure static water level formally', 'Measure discharge rate vs baseline', 'Inspect pump seal for leakage', 'Check electrical connections if submersible'] },
              { period: 'Annually', tasks: ['Professional water quality testing (bacteria, iron, TDS, pH)', 'Well development/backflushing if needed', 'Pump performance testing under load', 'Wellhead seal inspection, regrout if needed'] },
            ].map((sched, i) => (
              <div key={i} className="bg-slate-900/50 border border-emerald-600/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-emerald-300 mb-4">{sched.period}</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  {sched.tasks.map((task, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-emerald-900/30 to-teal-900/20 border border-emerald-600/30 rounded-lg p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Professional Borehole Drilling & Assessment</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            500+ boreholes across Kenya. We perform aquifer testing before drilling, ensuring yield predictions are real. No dry holes, no surprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition">
              Request Borehole Assessment
            </Link>
            <Link href="/solutions/borehole-pumps" className="px-8 py-4 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition">
              View Borehole Solutions
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
