import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manufacturing Power Solutions | EmersonEIMS Kenya | Production Continuity',
  description: 'Backup power for factories and manufacturing. Production loss prevention, load management, energy cost optimization. Complete industrial solutions.',
};

export default function ManufacturingSolutionsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Manufacturing Power Solutions</h1>
          <p className="text-xl text-gray-300">Eliminate production losses from power outages. Load management for cost optimization. Continuous operations across all equipment types.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Manufacturing Power Challenges</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-orange-800/20 to-slate-900/50 border border-orange-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-400 mb-6">Production Downtime Cost</h3>
              <p className="text-gray-300 mb-4">Even brief power outages destroy production schedules and create cascading losses:</p>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>• Lost revenue from halted production</li>
                <li>• Equipment damage from sudden shutdown</li>
                <li>• Raw material spoilage (food, chemical processing)</li>
                <li>• Production quality degradation after restart</li>
                <li>• Delayed customer deliveries and penalties</li>
                <li>• Staff idle time costs</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-800/20 to-slate-900/50 border border-green-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-green-400 mb-6">EmersonEIMS Solution</h3>
              <p className="text-gray-300 mb-4">Complete industrial power reliability system:</p>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>• Automatic failover backup systems</li>
                <li>• Load prioritization to protect critical equipment</li>
                <li>• Energy cost optimization through smart management</li>
                <li>• Peak shaving to reduce electricity bills</li>
                <li>• Redundant power circuits for key production lines</li>
                <li>• Real-time monitoring and predictive maintenance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Integrated Manufacturing Power System</h2>

          <div className="space-y-6">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">System Architecture</h3>
              <div className="space-y-4 text-gray-300">
                <p className="font-bold">Layer 1: Main Power Supply</p>
                <p className="text-sm ml-4">Large backup generator (500-2000kVA) for complete facility power. Automatic Transfer Switch (ATS) seamlessly switches from mains to generator within 5-10 seconds.</p>

                <p className="font-bold">Layer 2: Critical Load UPS</p>
                <p className="text-sm ml-4">UPS systems (30-100kVA) protect production control systems, PLC equipment, and critical pumps from momentary power glitches. Zero-transfer-time protection.</p>

                <p className="font-bold">Layer 3: Load Management</p>
                <p className="text-sm ml-4">Smart load management system sheds non-essential loads during peak demand, reducing electricity bills and preventing generator overload.</p>

                <p className="font-bold">Layer 4: Monitoring & Control</p>
                <p className="text-sm ml-4">Real-time monitoring of power consumption, generator status, and system health. Predictive maintenance alerts prevent unexpected failures.</p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Cost Optimization Strategies</h3>
              <div className="grid md:grid-cols-2 gap-6 text-gray-300 text-sm">
                <div>
                  <p className="font-bold text-blue-400 mb-2">Peak Shaving</p>
                  <p>Use generator during peak electricity hours to reduce KPLC consumption and lower bills by 15-30%.</p>
                </div>
                <div>
                  <p className="font-bold text-blue-400 mb-2">Load Shifting</p>
                  <p>Shift non-critical production to off-peak hours when electricity rates are lower.</p>
                </div>
                <div>
                  <p className="font-bold text-blue-400 mb-2">Energy Efficiency</p>
                  <p>Monitor equipment power consumption and eliminate waste. Solar integration for additional cost reduction.</p>
                </div>
                <div>
                  <p className="font-bold text-blue-400 mb-2">Maintenance Savings</p>
                  <p>Predictive maintenance prevents costly equipment breakdowns and production stops.</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Motor & Drive Integration</h3>
              <p className="text-gray-300 text-sm mb-4">Manufacturing typically relies on large motors for production equipment. Our solutions include:</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Soft starters to reduce inrush current and equipment stress</li>
                <li>✓ Variable Frequency Drives (VFD) for energy savings 15-50%</li>
                <li>✓ Motor control centers with selective load shedding</li>
                <li>✓ Emergency pump protection for facility systems</li>
                <li>✓ Preventive motor maintenance to extend equipment life</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Manufacturing Solution Economics</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-red-400 mb-4">Downtime Cost Analysis</h3>
              <p className="text-gray-300 text-sm mb-4">Example: Food Processing Plant</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>Production capacity: KES 500K/hour</li>
                <li>1-hour downtime cost: KES 500K lost revenue</li>
                <li>Equipment restart cost: KES 50K-150K</li>
                <li>Product spoilage: KES 100K-300K</li>
                <li>Delayed deliveries: KES 200K+ penalties</li>
                <li><strong>Total 1-hour outage cost: KES 1-2M</strong></li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-green-400 mb-4">Solution ROI</h3>
              <p className="text-gray-300 text-sm mb-4">Complete manufacturing solution investment</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>Generator system: KES 3-8M</li>
                <li>UPS systems: KES 800K-2M</li>
                <li>Load management: KES 500K-1M</li>
                <li>Installation: KES 500K-1M</li>
                <li><strong>Total Investment: KES 5-12M</strong></li>
                <li className="pt-2"><strong>Payback Period: 1-2 years</strong></li>
                <li>Based on prevented downtime & energy savings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Why EmersonEIMS for Manufacturing</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-yellow-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Industrial Expertise</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>15+ years of factory power solutions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Experience with all equipment types</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Understanding of production workflows</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-yellow-400 font-bold">✓</span>
                  <span>Energy optimization expertise</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">Production Continuity</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>24/7 emergency response</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Predictive maintenance prevents breakdowns</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Load management optimization</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Energy cost reduction (15-30%)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-orange-900/30 to-emerald-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Protect Your Production</h2>
          <p className="text-lg text-gray-300 mb-10">
            Power outages cost factories thousands per hour. Our manufacturing solutions eliminate downtime risk and reduce energy costs. Free facility assessment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <a href="/contact?type=manufacturing-solution" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              Free Factory Assessment
            </a>
            <a href="tel:+254768860665" className="inline-block px-8 py-4 border-2 border-orange-500 text-orange-400 font-bold rounded-lg hover:bg-orange-500/10 transition-all">
              Call: +254 768 860 665
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
