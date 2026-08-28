import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Maintenance Contracts: Real ROI Analysis',
  description: 'Why maintenance contracts save money. Preventive maintenance vs emergency repairs. Cost analysis and payback periods.',
};

export default function MaintenanceContractsROIBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <header className="mb-12">
          <div className="mb-4">
            <Link href="/blog" className="text-green-400 hover:text-green-300 text-sm">
              ← Back to Blog
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-4">Generator Maintenance Contracts: Real ROI Analysis</h1>
          <p className="text-gray-400 text-sm">Published: July 24, 2026 | Read time: 7 minutes</p>
        </header>

        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Your generator fails. Power is out. Business stops. Customers frustrated. Then you call a technician. He says: "I need parts. Can't come until tomorrow." That outage costs you more than a year of maintenance contracts.
          </p>

          <p>
            Maintenance contracts prevent this. But most facilities skip them because they "cost too much." Let's do the math.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">The Two Approaches</h2>

          <p>
            <strong>Approach A: Reactive Maintenance</strong>
          </p>
          <p className="text-sm mt-2">
            Run generator until it breaks. Call technician. Wait for parts. Pay emergency fees. Deal with downtime losses.
          </p>

          <p className="mt-4">
            <strong>Approach B: Preventive Maintenance</strong>
          </p>
          <p className="text-sm mt-2">
            Service generator monthly. Replace parts before failure. Prevent emergencies. Predictable cost.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Cost Comparison (Real Numbers)</h2>

          <div className="bg-slate-800/50 border border-green-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-green-400 mb-4">20 kVA Generator, 3-Year Period</p>

            <p className="font-bold text-gray-300 mt-6 mb-3">REACTIVE (No Maintenance Contract)</p>
            <div className="space-y-2 text-sm ml-4">
              <div className="flex justify-between"><span>Year 1: No issues</span><span>KES 0</span></div>
              <div className="flex justify-between"><span>Year 2: Minor repair (fuel system)</span><span>KES 150K</span></div>
              <div className="flex justify-between"><span>Year 2: Emergency call (extra fee)</span><span>KES 50K</span></div>
              <div className="flex justify-between"><span>Year 3: Major failure (starter motor)</span><span>KES 500K</span></div>
              <div className="flex justify-between"><span>Year 3: Downtime cost (est. 12 hours)</span><span>KES 500K</span></div>
              <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between font-bold">
                <span>Total:</span><span className="text-red-400">KES 1.2M</span>
              </div>
            </div>

            <p className="font-bold text-gray-300 mt-6 mb-3">PREVENTIVE (Maintenance Contract)</p>
            <div className="space-y-2 text-sm ml-4">
              <div className="flex justify-between"><span>Year 1: Monthly service (12 × KES 30K)</span><span>KES 360K</span></div>
              <div className="flex justify-between"><span>Year 2: Monthly service</span><span>KES 360K</span></div>
              <div className="flex justify-between"><span>Year 2: Parts replacement (battery)</span><span>KES 100K (included)</span></div>
              <div className="flex justify-between"><span>Year 3: Monthly service</span><span>KES 360K</span></div>
              <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between font-bold">
                <span>Total:</span><span className="text-green-400">KES 1.08M</span>
              </div>
            </div>
          </div>

          <p className="mt-4 font-bold text-green-400">
            Preventive approach saves KES 120K over 3 years. PLUS zero downtime emergencies.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">The Real Savings: Downtime Prevention</h2>

          <p>
            Above analysis ignores biggest cost: <strong>business downtime</strong>.
          </p>

          <div className="bg-slate-800/50 border border-green-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-green-400 mb-4">Downtime Impact Examples</p>

            <p className="font-bold text-gray-300 mb-2">Hospital (8-hour power outage):</p>
            <p className="text-sm ml-4">Surgical suite down. Lost surgeries = KES 500K-1M lost revenue. Zero acceptable.</p>

            <p className="font-bold text-gray-300 mb-2 mt-4">Manufacturing (4-hour outage):</p>
            <p className="text-sm ml-4">Production line stops. Lost output = KES 200-400K. Plus overtime restart costs = KES 100K.</p>

            <p className="font-bold text-gray-300 mb-2 mt-4">Retail (3-hour outage):</p>
            <p className="text-sm ml-4">Stores close. Lost sales = KES 50-150K. Customer frustration = future lost sales.</p>

            <p className="font-bold text-gray-300 mb-2 mt-4">Data center (6-hour outage):</p>
            <p className="text-sm ml-4">Customers see site down. Lost trust = KES 500K+ in future business.</p>
          </div>

          <p className="mt-4">
            <strong>Most facilities lose more in ONE downtime event than they pay for 2+ years of maintenance.</strong>
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">What Maintenance Contracts Include</h2>

          <div className="bg-slate-800/50 border border-green-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-green-400 mb-4">Typical Monthly Service (KES 30-50K)</p>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Oil and filter change</li>
              <li>Fuel system inspection</li>
              <li>Battery check and cleaning</li>
              <li>Coolant level/quality verification</li>
              <li>Start test (verify it starts reliably)</li>
              <li>30-minute operational run</li>
              <li>Documentation/log update</li>
              <li>Priority scheduling (get service before non-contract customers)</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-green-500/20 rounded-lg p-6 my-6">
            <p className="font-bold text-green-400 mb-4">Quarterly Deep Service (KES 100-200K, included)</p>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Spark plug inspection/replacement</li>
              <li>Air filter cleaning/replacement</li>
              <li>Fuel injector cleaning</li>
              <li>Generator output test under load</li>
              <li>Wiring/connection inspection</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">Real-World Scenario</h2>

          <p>
            <strong>Hospital with 50 kVA Backup Generator</strong>
          </p>

          <p className="mt-3 font-bold">Without Maintenance Contract:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Year 1: No service. Generator works fine.</li>
            <li>Year 2: Grid fails for 6 hours. Generator starts... then shuts down after 20 minutes (fuel line clogged, nobody noticed because no maintenance).</li>
            <li>Surgeries cancelled. Emergency diversion to other hospitals. Lost revenue: KES 2M+. Reputation damage: ongoing.</li>
            <li>Emergency technician called (premium fee). Fuel system repair: KES 400K.</li>
            <li>Total cost: KES 2.4M+ from one incident</li>
          </ul>

          <p className="mt-4 font-bold">With Maintenance Contract:</p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Year 1: Monthly service (KES 600K/year). Technician catches and cleans fuel line during routine check.</li>
            <li>Year 2: Grid fails for 6 hours. Generator starts instantly and runs flawlessly for entire duration.</li>
            <li>All surgeries completed on schedule. Zero downtime.</li>
            <li>Total cost: KES 600K/year (preventive)</li>
            <li>Result: KES 2.4M+ saved by spending KES 600K on maintenance</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">When Maintenance Contracts Make Sense</h2>

          <p>
            <strong>ESSENTIAL (Non-negotiable):</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Hospitals, medical clinics, critical care</li>
            <li>Data centers, server rooms</li>
            <li>Banks, financial institutions</li>
            <li>Manufacturing with continuous production</li>
            <li>Any business where downtime = major losses</li>
          </ul>

          <p className="mt-4">
            <strong>RECOMMENDED:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Retail stores, restaurants</li>
            <li>Offices with customer-facing operations</li>
            <li>Facilities with large generators (30+ kVA)</li>
          </ul>

          <p className="mt-4">
            <strong>OPTIONAL:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2 ml-2">
            <li>Small offices with minimal customer impact</li>
            <li>Backup power for home office</li>
            <li>Rural facilities with rare outages</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">ROI Calculation</h2>

          <p>
            Most facilities break even on maintenance contracts within 18-24 months by avoiding one emergency repair.
          </p>

          <p className="mt-3">
            <strong>Example:</strong> Maintenance contract = KES 35K/month = KES 420K/year. One emergency generator repair = KES 300-500K. One prevented downtime = KES 500K-2M+. ROI is immediate.
          </p>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mt-8">
            <p className="text-green-300 mb-4">
              <strong>Your generator deserves maintenance.</strong> Monthly service prevents failures, extends equipment life, and protects your business. Don't wait for emergency.
            </p>
            <Link href="/contact?type=maintenance" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all">
              Start Maintenance Contract
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
