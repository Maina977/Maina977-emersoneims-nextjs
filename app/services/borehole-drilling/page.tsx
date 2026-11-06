import { Metadata } from 'next';
import Link from 'next/link';
import RfqForm from '@/components/forms/RfqForm';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/services/borehole-drilling' },
  title: 'Borehole Drilling: Complete Technical Guide',
  description: 'Professional borehole engineering guide: hydrogeology, transmissivity, aquifer testing, drilling methods, yield assessment, water quality, common drilling problems, troubleshooting and maintenance for Kenya aquifers.',
  keywords: [
    'borehole drilling Kenya', 'water well drilling', 'aquifer testing', 'transmissivity',
    'borehole yield', 'water quality analysis', 'drilling contractors', 'groundwater',
  ],
};

export default function BoreholeDrillingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="bg-gradient-to-r from-emerald-900/30 to-teal-900/20 border-b border-emerald-600/30 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
              Borehole Drilling: Complete Technical Reference
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Professional hydrogeology guide: aquifer types, transmissivity calculations, drilling methods, yield assessment, water quality, common drilling problems, troubleshooting and maintenance for Kenya's diverse aquifer systems.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* FUNDAMENTALS */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-emerald-400">1. Borehole Hydrogeology & Aquifer Analysis</h2>

          <div className="space-y-8 text-gray-300">
            <p className="text-lg leading-relaxed">
              Boreholes access groundwater in aquifers: porous or fractured rock that holds and passes water. Kenya's hydrogeology is varied. Volcanic aquifers around Nairobi and in the Rift can be productive; the crystalline basement that covers much of eastern and northern Kenya usually yields water only from fractures and weathered zones, so yields range from very low to moderate. Local borehole records are the best guide to what a site can give. A hydrogeological survey reduces the risk of a dry or low-yield hole, but no survey can guarantee water: yield is known only after drilling and test pumping.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Transmissivity (T) = Permeability × Thickness:</strong> High transmissivity (&gt;10⁻² m²/s) indicates excellent productivity; low (&lt;10⁻⁴ m²/s) yields only 5-10 L/min regardless of depth. Professional drilling includes aquifer testing of existing boreholes to map transmissivity before committing to expensive drilling. Specific capacity (Q/Δh in L/min per meter drawdown): 20 L/min/m is excellent; 2-5 L/min/m is poor. Well design must account for this—low-capacity wells need larger diameter casing and screened interval to minimize entrance velocity (should not exceed 0.03 m/s).
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Drilling Methods Affect Yield & Longevity:</strong> In hard rock, most Kenyan boreholes are drilled with down-the-hole (DTH) air hammers, which are fast and keep the hole clean. Mud rotary drilling suits loose sediments that need support while drilling, but the mud must be removed afterwards or it clogs the aquifer. Penetration rate depends on the rock and the rig. The method is chosen for the geology, the target depth and the yield required.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Well Development Removes Drilling Damage:</strong> Development (air-lifting, surging or backflushing) removes drilling mud and fine particles from around the screen. It continues until the water runs clear and sand-free; our signed 2026 tender specification allows 12 hours. Under-developed boreholes give less water and wear pumps faster.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Seasonal Variations Are Critical:</strong> Water levels fall in the dry season and under heavy pumping, and in some areas they decline year on year. A borehole and pump set for the wet-season level can fail in the dry season. Design for the lowest expected water level, with the pump set safely below it.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Quality Contamination Threats:</strong> Confined aquifers trapped between clay layers exhibit artesian flow (water rises above aquifer level). Unconfined aquifers rely on rainfall recharge. In Kenya's arid regions recharge can be very low, which limits how much can be pumped sustainably. Near the coast, over-pumping can draw saline water into the aquifer. Iron and manganese come out of solution when the water meets air and cause staining and taste problems: drinking-water standards put iron at about 0.3 mg/L and manganese lower still, so water above these needs treatment such as aeration and filtration.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Hardness (calcium + magnesium salts):</strong> WHO notes that hardness above about 200 mg/L as CaCO3 tends to scale pipes, heaters and boilers, while very soft water (below about 100 mg/L) can be corrosive to metal pipes. Hardness has no health-based limit; a laboratory test tells you whether softening or pH adjustment is worth it.
            </p>

            <p className="text-lg leading-relaxed">
              <strong>Aquifer Testing (Pumping Test) is Definitive:</strong> A constant-rate test, typically 24 hours and longer for large or public supplies, followed by recovery measurements. Our signed 2026 tender priced 24-hour test pumping at about KES 228,000. It measures transmissivity, specific capacity and, with observation wells, storativity and aquifer boundaries. Professional reports provide sustainable yield recommendations—extraction exceeding these causes water-level decline and eventual well failure.
            </p>
          </div>
        </section>

        {/* ERROR CODES */}
        <section className="mb-20">
          <h2 className="text-5xl font-bold mb-12 text-emerald-400">2. Common Drilling and Borehole Problems</h2>

          <div className="space-y-8">
            {[
              { cat: 'Drilling equipment', codes: ['Drill Bit Wear/Dulling - Replace immediately, check for chipping', 'Stuck Pipe (Tool Pinning) - Apply careful overpull, may need fishing', 'Pump Pressure Loss - Check hose integrity, measure outlet pressure', 'Pipe Connection Leak - Tighten, replace O-rings, inspect threads', 'Cable Fraying - Replace immediately if strands broken', 'Compressor Failure - Check oil, verify filter, test discharge pressure', 'Hose Rupture - Depressurize, replace hose section', 'Motor Overheating - Check load, improve ventilation, verify fuel quality', 'Swivel Bearing Wear - Listen for grinding, replace if worn, lubricate', 'Drilling String Torque Overload - Reduce weight-on-bit, verify hole straight'] },
              { cat: 'Hydrogeology', codes: ['Lost Circulation/Mud Loss - Inject LCM, reduce pressure, indicates fractured formation', 'Artesian Flow Too High - Verify static head, install regulator valve', 'Water Table Lower Than Expected - Investigate regional hydrogeology, may need deeper drilling', 'Sand Formation Collapse - Reduce velocity, install screens, may need abandonment', 'Saline Water Encountered - Test quality, may require desalination', 'Clay Sealing Formation - Drill through carefully, may trap water above', 'Fractured Rock Yield Poor - Perform aquifer test, may need deeper drilling', 'Iron Oxide Staining - Normal in red soil, install filter if &gt;3mg/L', 'Bacterial Contamination - Shock-chlorinate, perform water quality testing', 'Yield Declining Annually - Indicates recharge deficit, reduce extraction'] },
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
            We survey before you commit and test-pump after drilling, so you know the yield before the pump is sized.
            A desktop assessment is preliminary; siting, depth and yield are confirmed in the field.
          </p>
          <div className="mx-auto mb-8 max-w-2xl text-left">
            <RfqForm kind="borehole-assessment" source="service-borehole-drilling" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition">
              Request Borehole Assessment
            </Link>
            <Link href="/services/borehole-pumps" className="px-8 py-4 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition">
              View Borehole Solutions
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
