
import Link from 'next/link';
import { Metadata } from 'next';


export default function VolvoPentaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Volvo Penta
            </span>
            <br />
            Advanced Power
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl">
            Volvo Penta generators deliver advanced technology, low emissions, and smart monitoring capabilities. 50-1500 kVA systems engineered for modern applications.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact?type=volvo-quote"
              className="px-6 py-3 bg-blue-500 text-black font-semibold rounded-lg hover:bg-blue-400 transition"
            >
              Get Quotation
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Why Volvo Penta Generators?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-4">✓ Smart Technology</h3>
              <p className="text-gray-300">Advanced digital controls with real-time monitoring. Remote diagnostics and predictive maintenance capabilities built-in.</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-4">✓ Environmental</h3>
              <p className="text-gray-300">Tier 4 Final compliant engines. Low-emission technology reduces environmental impact without sacrificing performance.</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-4">✓ Containerized Options</h3>
              <p className="text-gray-300">Containerized, soundproofed units available. Perfect for remote locations or noise-sensitive installations.</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400 mb-4">✓ Integration Ready</h3>
              <p className="text-gray-300">Compatible with solar, wind, and grid systems. Smart load management and seamless switching capabilities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Volvo Penta Range</h2>
          <div className="space-y-6">
            {[
              { range: '50-200 kVA', use: 'Commercial backup power, small industrial' },
              { range: '200-800 kVA', use: 'Industrial operations, hybrid systems' },
              { range: '800-1500 kVA', use: 'Utility-scale, advanced monitoring applications' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 border border-slate-700 rounded-lg hover:border-blue-500 transition flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">{item.range}</h3>
                  <p className="text-gray-300">{item.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Advanced Power for Tomorrow</h2>
          <p className="text-lg text-gray-200 mb-10">Smart technology meets reliable engineering in Volvo Penta generators.</p>
          <Link
            href="/contact?type=volvo-quote"
            className="inline-block px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-200 transition"
          >
            Request Quotation
          </Link>
        </div>
      </section>
    </main>
  );
}
