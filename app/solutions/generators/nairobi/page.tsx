import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Installation & Emergency Repair in Nairobi | 4-Hour Response',
  description: 'Emergency generator repair in Nairobi. Installation, maintenance, 24/7 support. KES 50K-200K emergency call-out. Transparent pricing.',
  alternates: {
    canonical: 'https://www.emersoneims.com/solutions/generators/nairobi',
  },
};

export default function NairobiGeneratorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Generator Installation & Emergency Repair<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">in Nairobi</span>
          </h1>
          <p className="text-xl text-gray-300">Backup power solutions for Nairobi businesses. Installation, emergency repair, maintenance. Response within 4 hours guaranteed.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Why Nairobi Needs Backup Power</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <p className="text-3xl font-bold text-cyan-400 mb-2">3-5 hours</p>
              <p className="text-gray-300">Average grid downtime per week in Nairobi</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <p className="text-3xl font-bold text-cyan-400 mb-2">KES 100K-2M</p>
              <p className="text-gray-300">Cost per hour of business downtime</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <p className="text-3xl font-bold text-cyan-400 mb-2">47 counties</p>
              <p className="text-gray-300">Our nationwide coverage</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Our Nairobi Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Generator Installation</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ 10-100 kVA: KES 150K-500K</li>
                <li>✓ 100-500 kVA: KES 500K-2M</li>
                <li>✓ Site assessment + design</li>
                <li>✓ Professional installation</li>
                <li>✓ Testing & commissioning</li>
                <li>✓ 3-7 day turnaround</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Emergency Repair</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ 4-hour guaranteed response</li>
                <li>✓ KES 50K-200K emergency call-out</li>
                <li>✓ 24/7 availability</li>
                <li>✓ Diagnostic included</li>
                <li>✓ Same-day repair (most cases)</li>
                <li>✓ WhatsApp emergency hotline</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Maintenance Packages</h3>
            <ul className="space-y-2 text-gray-300">
              <li>✓ Monthly service: KES 40K-100K</li>
              <li>✓ Quarterly deep maintenance: KES 100K-300K</li>
              <li>✓ Annual maintenance plan: KES 200K-600K</li>
              <li>✓ Parts & labor covered</li>
              <li>✓ Priority emergency response</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Nairobi Coverage Map</h2>
          <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg text-center">
            <p className="text-cyan-400 font-bold text-lg mb-4">Nairobi - 4 Hour Response Guarantee</p>
            <p className="text-gray-300 mb-4">Westlands, Karen, Industrial Area, CBD, Parklands, Embakasi, Athi River, Kitengela</p>
            <p className="text-emerald-400">✓ Fastest response in Nairobi</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get Emergency Service Now</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+254768860665" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
              Call: +254 768 860 665
            </a>
            <Link href="/contact?location=nairobi" className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all">
              Schedule Service
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
