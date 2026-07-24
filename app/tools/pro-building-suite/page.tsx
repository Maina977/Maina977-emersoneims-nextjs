import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pro Building Suite | HVAC & Electrical Load Calculator',
  description: 'Building load calculation tool for HVAC, electrical systems, backup power design. Accurate sizing for Kenya commercial buildings.',
};

export default function ProBuildingSuitePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Pro Building Suite</h1>
          <p className="text-2xl text-gray-300 mb-8">HVAC & Electrical Load Calculator</p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Professional building load calculations for accurate HVAC sizing, electrical design, and backup power planning. Designed for Kenya's climate and standards.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Key Features</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <p className="text-5xl mb-4">❄️</p>
              <h3 className="text-xl font-bold text-orange-400 mb-3">HVAC Load Calculation</h3>
              <p className="text-gray-300">Cooling/heating load (kW), AC unit sizing, ductwork design, ventilation requirements. Accounts for Kenya's climate.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <p className="text-5xl mb-4">⚡</p>
              <h3 className="text-xl font-bold text-orange-400 mb-3">Electrical Load Profile</h3>
              <p className="text-gray-300">Lighting, equipment, motors, office loads. Total connected load and demand factor calculation.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <p className="text-5xl mb-4">🔋</p>
              <h3 className="text-xl font-bold text-orange-400 mb-3">Backup Power Sizing</h3>
              <p className="text-gray-300">Generator size (kVA), UPS capacity (kWh), runtime calculations for different scenarios.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">What Pro Building Suite Calculates</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <div className="text-4xl font-bold text-orange-400 flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Building Envelope Analysis</h3>
                <p className="text-gray-300">Floor area, window area, insulation levels, occupancy type. Calculates heat gain/loss for your building type.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <div className="text-4xl font-bold text-orange-400 flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Climate-Adjusted Load</h3>
                <p className="text-gray-300">Uses Kenya weather data (Nairobi, Mombasa, Kisumu, etc.). Accounts for outdoor temp, humidity, solar radiation.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <div className="text-4xl font-bold text-orange-400 flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Electrical Load Schedule</h3>
                <p className="text-gray-300">Different loads at peak hours vs. off-peak. Calculates demand factor and diversified load for generator sizing.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <div className="text-4xl font-bold text-orange-400 flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Equipment Recommendations</h3>
                <p className="text-gray-300">Specific AC unit models, tonnage, electrical panel size, breaker ratings, wire gauges, generator brand recommendations.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <div className="text-4xl font-bold text-orange-400 flex-shrink-0">5</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Cost Estimation</h3>
                <p className="text-gray-300">HVAC installation costs, electrical work, generator purchase & installation. Complete project budget.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Building Types Supported</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-orange-400 mb-4">Commercial</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Office buildings</li>
                <li>✓ Retail malls</li>
                <li>✓ Restaurants</li>
                <li>✓ Banks</li>
                <li>✓ Call centers</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-orange-400 mb-4">Industrial</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Factories</li>
                <li>✓ Warehouses</li>
                <li>✓ Data centers</li>
                <li>✓ Manufacturing</li>
                <li>✓ Processing plants</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-orange-400 mb-4">Institutional</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Hospitals</li>
                <li>✓ Schools</li>
                <li>✓ Hotels</li>
                <li>✓ Government</li>
                <li>✓ Universities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Typical Calculation Outputs</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-orange-400 mb-6">HVAC Design Report</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Sensible heat load: 45 kW</li>
                <li>✓ Latent heat load: 12 kW</li>
                <li>✓ Total cooling needed: 57 kW</li>
                <li>✓ Recommended AC units: 2× 30kW split-type</li>
                <li>✓ Ductwork size & CFM</li>
                <li>✓ Thermostat placement</li>
                <li>✓ Operating costs: KES 45K/month</li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-orange-400 mb-6">Electrical & Backup Report</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Connected load: 85 kW</li>
                <li>✓ Demand factor: 70%</li>
                <li>✓ Diversified load: 60 kW</li>
                <li>✓ Generator size: 80 kVA</li>
                <li>✓ Panel upgrade: 200A main breaker</li>
                <li>✓ Cable sizing: 35mm² for main run</li>
                <li>✓ Estimated budget: KES 2.5M</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-orange-900/30 to-red-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Get Professional Building Design</h2>
          <p className="text-lg text-gray-300 mb-10">
            Accurate load calculations = right-sized equipment = lower costs + better performance. Design your building systems with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools/pro-building-suite?action=launch" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              Launch Pro Building Suite
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-orange-500 text-orange-400 font-bold rounded-lg hover:bg-orange-500/10 transition-all">
              Get Design Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
