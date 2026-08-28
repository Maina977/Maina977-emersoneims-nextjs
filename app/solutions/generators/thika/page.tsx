import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Service in Thika | 6-Hour Response',
  description: 'Backup power solutions in Thika. Installation, emergency repair, maintenance. Industrial hub coverage.',
};

export default function ThikaGeneratorPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Generator Service in Thika</h1>
          <p className="text-xl text-gray-300">Professional backup power for Thika businesses. 6-hour emergency response. Industrial zone coverage.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Thika Industrial Power Solutions</h2>
          <div className="space-y-4 text-gray-300">
            <p>• Manufacturing hub requiring constant power</p>
            <p>• Food processing facilities with strict uptime needs</p>
            <p>• Textile industry operations</p>
            <p>• Quick response for high-traffic business district</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Our Thika Services</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-purple-400 mb-3">Installation</h3>
              <p className="text-sm text-gray-300">KES 150K-2M depending on size. 3-7 day turnaround.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-purple-400 mb-3">Emergency Repair</h3>
              <p className="text-sm text-gray-300">KES 50K-200K call-out. 6-hour response guarantee.</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg">
            <h3 className="text-lg font-bold text-purple-400 mb-3">Maintenance Contracts</h3>
            <p className="text-sm text-gray-300">KES 50K-300K/month. Includes quarterly service + priority response.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get Thika Service</h2>
          <a href="tel:+254768860665" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-lg">
            Call: +254 768 860 665
          </a>
        </div>
      </section>
    </div>
  );
}
