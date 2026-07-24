import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthcare Power Solutions | EmersonEIMS Kenya | Mission-Critical Backup',
  description: 'Complete backup power solutions for hospitals, clinics, and medical facilities. Uninterrupted operations, patient safety, emergency response. 24/7 support.',
};

export default function HealthcareSolutionsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Healthcare Power Solutions</h1>
          <p className="text-xl text-gray-300">Mission-critical backup power for hospitals, clinics, and medical facilities. Zero downtime. Patient safety guaranteed.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Why Healthcare Facilities Need Backup Power</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 bg-gradient-to-br from-red-800/20 to-slate-900/50 border border-red-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-6">The Risks of Power Loss</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-4">
                  <span className="text-3xl">🏥</span>
                  <span><strong>Life Support Interruption:</strong> Operating rooms, ICUs, and emergency departments depend on continuous power for patient care.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-3xl">💻</span>
                  <span><strong>Data Systems Crash:</strong> Patient records, billing systems, and diagnostic equipment become unavailable.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-3xl">🔬</span>
                  <span><strong>Equipment Damage:</strong> Sensitive medical equipment can be permanently damaged by power fluctuations.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-3xl">⚖️</span>
                  <span><strong>Legal Liability:</strong> Power outages causing patient harm create significant legal and financial exposure.</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-800/20 to-slate-900/50 border border-green-500/30 rounded-lg">
              <h3 className="text-2xl font-bold text-green-400 mb-6">EmersonEIMS Solution</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-4">
                  <span className="text-3xl">⚡</span>
                  <span><strong>Backup Generators:</strong> Automatic failover within seconds. Large capacity systems for all hospital loads.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-3xl">🔋</span>
                  <span><strong>UPS Systems:</strong> Critical loads protected with zero-transfer-time battery backup. Smooth power conditioning.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-3xl">🏗️</span>
                  <span><strong>ATS Automation:</strong> Seamless automatic transfer switch prevents service interruption or equipment damage.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-3xl">📊</span>
                  <span><strong>Monitoring:</strong> Real-time system monitoring ensures backup power is always ready when needed.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Integrated Solution Architecture</h2>

          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🏥</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">Operating Rooms & ICU</h3>
                  <p className="text-gray-300 mb-4">Critical loads requiring absolute zero downtime and perfect power quality.</p>
                </div>
              </div>
              <div className="ml-20 space-y-3 text-gray-300">
                <p><strong>System:</strong> Online UPS (15-50kVA) + Backup generator with automatic transfer</p>
                <p><strong>Failover Time:</strong> 0 seconds (UPS absorbs transition)</p>
                <p><strong>Services Included:</strong> UPS systems, distribution boards, ATS installation, 24/7 monitoring</p>
                <p><strong>Budget:</strong> KES 1.5M - 5M depending on OR size and load</p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🛏️</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">Ward Floors & General Areas</h3>
                  <p className="text-gray-300 mb-4">Patient rooms and general areas where brief outages are acceptable but extended outages are dangerous.</p>
                </div>
              </div>
              <div className="ml-20 space-y-3 text-gray-300">
                <p><strong>System:</strong> Automatic changeover system + Backup generator (200-500kVA)</p>
                <p><strong>Failover Time:</strong> 5-10 seconds (UPS protects critical equipment)</p>
                <p><strong>Services Included:</strong> Generator installation, ATS, distribution panels, monthly maintenance</p>
                <p><strong>Budget:</strong> KES 3M - 8M</p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">💻</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">Data & IT Systems</h3>
                  <p className="text-gray-300 mb-4">Server rooms, patient records, billing systems, and diagnostic equipment.</p>
                </div>
              </div>
              <div className="ml-20 space-y-3 text-gray-300">
                <p><strong>System:</strong> Online UPS (10-30kVA) with extended battery runtime</p>
                <p><strong>Protection:</strong> Surge protection, voltage regulation, EMI filtering</p>
                <p><strong>Services Included:</strong> UPS supply, installation, network monitoring, battery replacement</p>
                <p><strong>Budget:</strong> KES 800K - 2M</p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🧬</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">Lab Equipment</h3>
                  <p className="text-gray-300 mb-4">Diagnostic equipment, incubators, refrigeration units requiring stable power.</p>
                </div>
              </div>
              <div className="ml-20 space-y-3 text-gray-300">
                <p><strong>System:</strong> Dedicated UPS for sensitive equipment + Stabilizers</p>
                <p><strong>Protection:</strong> Prevents equipment damage from surges and fluctuations</p>
                <p><strong>Services Included:</strong> Equipment assessment, UPS sizing, custom installation</p>
                <p><strong>Budget:</strong> KES 500K - 1.5M</p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🚑</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">Emergency Department</h3>
                  <p className="text-gray-300 mb-4">Trauma bays, monitoring equipment, surgical lights requiring immediate backup.</p>
                </div>
              </div>
              <div className="ml-20 space-y-3 text-gray-300">
                <p><strong>System:</strong> Hybrid: Emergency UPS + Fast-start backup generator</p>
                <p><strong>Failover Time:</strong> < 2 seconds (UPS priority, generator backup)</p>
                <p><strong>Services Included:</strong> UPS, generator, ATS, emergency lighting integration</p>
                <p><strong>Budget:</strong> KES 2M - 6M</p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <div className="flex gap-6 mb-6">
                <div className="text-4xl">🧤</div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">Medical Waste Incinerator</h3>
                  <p className="text-gray-300 mb-4">Compliance-critical medical waste disposal system requiring reliable power.</p>
                </div>
              </div>
              <div className="ml-20 space-y-3 text-gray-300">
                <p><strong>System:</strong> Dedicated power circuit + UPS for controller</p>
                <p><strong>Protection:</strong> NEMA compliance with uninterrupted operation capability</p>
                <p><strong>Services Included:</strong> Distribution board, UPS, startup sequence automation</p>
                <p><strong>Budget:</strong> KES 200K - 500K</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Complete Hospital Power Solution</h2>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg p-12">
            <h3 className="text-2xl font-bold text-emerald-400 mb-8">Typical Hospital Installation Package</h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-emerald-400 font-bold mb-4">Equipment & Services</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>✓ Main backup generator (500-1000kVA)</li>
                  <li>✓ Main Automatic Transfer Switch</li>
                  <li>✓ UPS systems (OR, ICU, Data center)</li>
                  <li>✓ Sub-distribution boards</li>
                  <li>✓ Motor control for backup systems</li>
                  <li>✓ Emergency lighting circuits</li>
                  <li>✓ Professional installation (2-4 weeks)</li>
                  <li>✓ Staff training</li>
                  <li>✓ Testing and commissioning</li>
                </ul>
              </div>

              <div>
                <h4 className="text-emerald-400 font-bold mb-4">Annual Maintenance Included</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>✓ Quarterly maintenance visits</li>
                  <li>✓ Monthly load testing</li>
                  <li>✓ Battery health monitoring</li>
                  <li>✓ Generator oil/filter changes</li>
                  <li>✓ ATS functional testing</li>
                  <li>✓ 24/7 emergency response</li>
                  <li>✓ Priority spare parts availability</li>
                  <li>✓ Performance reporting</li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded">
              <p className="text-emerald-400 font-bold mb-2">Typical Hospital Total Investment</p>
              <p className="text-2xl font-bold text-white mb-2">KES 8M - 20M</p>
              <p className="text-gray-300 text-sm">Complete system covering all critical loads. Investment pays for itself through avoided downtime, prevented equipment damage, and staff productivity gains.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Why EmersonEIMS for Healthcare</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-6">Healthcare Expertise</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>10+ years of hospital & clinic installations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Understanding of medical equipment requirements</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Compliance with healthcare standards</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>Experience with mission-critical systems</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">Patient Safety Commitment</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>24/7 emergency response team</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Predictive maintenance prevents failures</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Real-time system monitoring</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Guaranteed uptime SLA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-emerald-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Protect Your Patients & Operations</h2>
          <p className="text-lg text-gray-300 mb-10">
            Power outages can cost lives and millions in liability. A robust backup power system is not an expense—it's essential infrastructure. Contact us for a free consultation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <a href="/contact?type=healthcare-solution" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              Free Healthcare Consultation
            </a>
            <a href="tel:+254768860665" className="inline-block px-8 py-4 border-2 border-blue-500 text-blue-400 font-bold rounded-lg hover:bg-blue-500/10 transition-all">
              Call: +254 768 860 665
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
