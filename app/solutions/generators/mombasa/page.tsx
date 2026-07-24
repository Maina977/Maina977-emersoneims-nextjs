import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Service in Mombasa | 8-Hour Emergency Response',
  description: 'Backup power solutions in Mombasa. Installation, emergency repair, maintenance. Coastal facility expertise. 24/7 support.',
};

export default function MombasaGeneratorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Generator Service in Mombasa</h1>
          <p className="text-xl text-gray-300">Professional backup power. Emergency response within 8 hours. Specialized in coastal facility power challenges.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Why Mombasa Needs Reliable Backup Power</h2>
          <div className="space-y-4 text-gray-300">
            <p>• Port operations require 24/7 power continuity</p>
            <p>• Tourism & hospitality cannot afford outages</p>
            <p>• Coastal climate challenges (salt corrosion, humidity)</p>
            <p>• Emergency response must be reliable</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Our Services in Mombasa</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">Installation</h3>
              <p className="text-sm text-gray-300">KES 150K-2M depending on size. 3-7 day turnaround.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">Emergency Repair</h3>
              <p className="text-sm text-gray-300">KES 50K-200K call-out. 8-hour response guarantee.</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-lg">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">Maintenance Contracts</h3>
            <p className="text-sm text-gray-300">KES 50K-300K/month. Includes quarterly service + priority response.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get Mombasa Service</h2>
          <a href="tel:+254768860665" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg">
            Call: +254 768 860 665
          </a>
        </div>
      </section>
    </main>
  );
}
