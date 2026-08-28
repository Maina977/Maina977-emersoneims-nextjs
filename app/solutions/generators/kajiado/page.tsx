import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Service in Kajiado',
  description: 'Backup power solutions in Kajiado. Installation, emergency repair, maintenance. Growing commercial hub.',
};

export default function KajiadoGeneratorPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Generator Service in Kajiado</h1>
          <p className="text-xl text-gray-300">Professional backup power for Kajiado. 8-hour emergency response. Growing commercial center coverage.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Kajiado Power Needs</h2>
          <div className="space-y-4 text-gray-300">
            <p>• Rapidly growing commercial sector</p>
            <p>• Hospitality and tourism facilities</p>
            <p>• Livestock trading operations</p>
            <p>• Agricultural processing centers</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Our Kajiado Services</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-rose-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-rose-400 mb-3">Installation</h3>
              <p className="text-sm text-gray-300">KES 150K-2M. 3-7 day turnaround.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-rose-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-rose-400 mb-3">Emergency Repair</h3>
              <p className="text-sm text-gray-300">KES 50K-200K. 8-hour response guarantee.</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-rose-500/20 rounded-lg">
            <h3 className="text-lg font-bold text-rose-400 mb-3">Maintenance Contracts</h3>
            <p className="text-sm text-gray-300">KES 50K-300K/month. Quarterly service + priority response.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-rose-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get Kajiado Service</h2>
          <a href="tel:+254768860665" className="inline-block px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-600 text-white font-bold rounded-lg">
            Call: +254 768 860 665
          </a>
        </div>
      </section>
    </div>
  );
}
