import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/solutions/generators/kakamega' },
  title: 'Generator Service in Kakamega',
  description: 'Backup power solutions in Kakamega. Installation, emergency repair, maintenance. Western Kenya coverage.',
};

export default function KakamegaGeneratorPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Generator Service in Kakamega</h1>
          <p className="text-xl text-gray-300">Professional backup power for Kakamega. 14-hour emergency response. Western Kenya regional center.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Kakamega Power Landscape</h2>
          <div className="space-y-4 text-gray-300">
            <p>• Sugar cane processing factories</p>
            <p>• Agricultural cooperative operations</p>
            <p>• Growing retail and commercial sector</p>
            <p>• Regional service hub for surrounding counties</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Our Kakamega Services</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-lime-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-lime-400 mb-3">Installation</h3>
              <p className="text-sm text-gray-300">KES 150K-2M. 3-7 day turnaround.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-lime-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-lime-400 mb-3">Emergency Repair</h3>
              <p className="text-sm text-gray-300">KES 50K-200K. 14-hour response guarantee.</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-lime-500/20 rounded-lg">
            <h3 className="text-lg font-bold text-lime-400 mb-3">Maintenance Contracts</h3>
            <p className="text-sm text-gray-300">KES 50K-300K/month. Quarterly service + priority response.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-lime-900/30 to-green-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get Kakamega Service</h2>
          <a href="tel:+254768860665" className="inline-block px-8 py-4 bg-gradient-to-r from-lime-500 to-green-600 text-white font-bold rounded-lg">
            Call: +254 768 860 665
          </a>
        </div>
      </section>
    </div>
  );
}
