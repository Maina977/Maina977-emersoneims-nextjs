import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Service in Murang\'a | 7-Hour Response',
  description: 'Backup power solutions in Murang\'a. Installation, emergency repair, maintenance. Central Kenya coverage.',
};

export default function MurangaGeneratorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Generator Service in Murang'a</h1>
          <p className="text-xl text-gray-300">Professional backup power. 7-hour response. Central Kenya regional coverage.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-lime-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-lime-400 mb-3">Installation</h3>
              <p className="text-sm text-gray-300">KES 150K-2M. 3-7 days.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-lime-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-lime-400 mb-3">Emergency</h3>
              <p className="text-sm text-gray-300">KES 50K-200K. 7-hour response.</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-lime-500/20 rounded-lg">
            <h3 className="text-lg font-bold text-lime-400 mb-3">Maintenance</h3>
            <p className="text-sm text-gray-300">KES 50K-300K/month. Full service included.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-lime-900/30 to-green-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get Murang'a Service</h2>
          <a href="tel:+254768860665" className="inline-block px-8 py-4 bg-gradient-to-r from-lime-500 to-green-600 text-white font-bold rounded-lg">
            Call: +254 768 860 665
          </a>
        </div>
      </section>
    </main>
  );
}
