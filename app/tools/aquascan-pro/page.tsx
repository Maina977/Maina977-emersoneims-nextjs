import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AquaScan Pro | Borehole & Water System Analysis',
  description: 'Borehole analysis, water quality testing, yield estimation, drilling location optimization. AI-powered hydrogeology for Kenya.',
};

export default function AquaScanProPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">AquaScan Pro</h1>
          <p className="text-2xl text-gray-300 mb-8">Borehole & Water System Analysis</p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Professional-grade water analysis. Drilling location optimization, yield prediction, water quality testing, cost estimation. All in one platform.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">What AquaScan Pro Analyzes</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <p className="text-5xl mb-4">💧</p>
              <h3 className="text-xl font-bold text-blue-400 mb-3">Water Quality</h3>
              <p className="text-gray-300">pH, hardness, salinity, bacteria, turbidity. Compare against WHO and Kenya standards.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-blue-400 mb-3">Drilling Site Analysis</h3>
              <p className="text-gray-300">Geological surveys, aquifer mapping, optimal drilling depth prediction, groundwater flow patterns.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <p className="text-5xl mb-4">📈</p>
              <h3 className="text-xl font-bold text-blue-400 mb-3">Yield Estimation</h3>
              <p className="text-gray-300">Predict borehole yield (liters per hour) based on geological and hydrological data. Avoid dry holes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">AquaScan Pro Capabilities</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 flex-shrink-0">🗺️</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Geological Mapping</h3>
                <p className="text-gray-300">Satellite imagery + geological layers analysis. Identify aquifer boundaries and optimal drilling locations.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 flex-shrink-0">🧪</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Water Quality Testing</h3>
                <p className="text-gray-300">Complete water analysis: hardness, pH, bacteria count, salinity, trace metals. WHO standards compliance check.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 flex-shrink-0">💰</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Cost Estimation</h3>
                <p className="text-gray-300">Predicted drilling depth × regional rates. Budget estimates for drilling, casing, testing, treatment if needed.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 flex-shrink-0">🎯</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Pump Sizing</h3>
                <p className="text-gray-300">Based on yield and required flow rate. Recommends submersible pump size, power requirements, and maintenance schedule.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Use Cases</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-blue-400 mb-4">🏭 Industrial Facilities</h3>
              <p className="text-gray-300">Plan drilling before construction begins. Avoid costly dry holes. Ensure sufficient water for operations.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-blue-400 mb-4">🌾 Agricultural Projects</h3>
              <p className="text-gray-300">Irrigation feasibility studies. Predict water availability throughout dry season. Optimize pump sizing for crops.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-blue-400 mb-4">🏘️ Community Water Supply</h3>
              <p className="text-gray-300">Ensure sustainable water for villages and rural areas. Assess existing boreholes for maintenance needs.</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-blue-400 mb-4">🏥 Hospitals & Schools</h3>
              <p className="text-gray-300">Backup water system planning. Quality assurance testing. Treatment system recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Typical Borehole Analysis Results</h2>

          <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-6">Geological Report Includes:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>✓ Recommended drilling depth (m)</li>
                  <li>✓ Aquifer type and layer composition</li>
                  <li>✓ Groundwater flow direction</li>
                  <li>✓ Transmissivity estimate</li>
                  <li>✓ Seasonal variation patterns</li>
                  <li>✓ Risk assessment for drilling</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-6">Water Quality Report Includes:</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>✓ pH & hardness levels</li>
                  <li>✓ Bacteria/pathogen presence</li>
                  <li>✓ Salinity & conductivity</li>
                  <li>✓ Trace metals (Fe, Mn, As)</li>
                  <li>✓ WHO/Kenya standards comparison</li>
                  <li>✓ Treatment recommendations if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Get Professional Water Analysis</h2>
          <p className="text-lg text-gray-300 mb-10">
            Avoid dry holes. Ensure water quality. Plan drilling with confidence using real geological and hydrological data.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools/aquascan-pro?action=launch" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              Launch AquaScan Pro
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-blue-500 text-blue-400 font-bold rounded-lg hover:bg-blue-500/10 transition-all">
              Book Borehole Analysis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
