import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/solutions/generators/kericho' },
  title: 'Generator Service in Kericho',
  description: 'Backup power solutions in Kericho. Installation, emergency repair, maintenance. Tea country power specialists.',
};

export default function KerichoGeneratorPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Generator Service in Kericho</h1>
          <p className="text-xl text-gray-300">Professional backup power for Kericho businesses. 14-hour emergency response. Tea growing region coverage.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Kericho's Power Landscape</h2>
          <div className="space-y-4 text-gray-300">
            <p>• Tea estates require continuous processing power</p>
            <p>• Factory operations in high-altitude climate</p>
            <p>• Hotels serving visitors to the tea plantations</p>
            <p>• Agricultural equipment needs reliable power supply</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Our Kericho Services</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-green-400 mb-3">Installation</h3>
              <p className="text-sm text-gray-300">KES 150K-2M depending on size. 3-7 day turnaround.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-green-400 mb-3">Emergency Repair</h3>
              <p className="text-sm text-gray-300">KES 50K-200K call-out. 14-hour response guarantee.</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg">
            <h3 className="text-lg font-bold text-green-400 mb-3">Maintenance Contracts</h3>
            <p className="text-sm text-gray-300">KES 50K-300K/month. Includes quarterly service + priority response.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get Kericho Service</h2>
          <a href="tel:+254768860665" className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg">
            Call: +254 768 860 665
          </a>
        </div>
      </section>
    </div>
  );
}
