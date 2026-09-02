import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/solutions/generators/kisumu' },
  title: 'Generator Service in Kisumu',
  description: 'Backup power solutions in Kisumu. Installation, repair, maintenance. Lake Victoria region power specialists.',
};

export default function KisumuGeneratorPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Generator Service in Kisumu</h1>
          <p className="text-xl text-gray-300">Professional backup power for Kisumu businesses. 12-hour emergency response. Lake Victoria region coverage.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Kisumu Power Solutions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 border border-cyan-500/20 rounded">
              <p className="text-cyan-400 font-bold">Installation: KES 150K-2M</p>
              <p className="text-sm text-gray-300">3-7 day delivery</p>
            </div>
            <div className="p-4 bg-slate-800/50 border border-cyan-500/20 rounded">
              <p className="text-cyan-400 font-bold">Emergency Response: 12 hours</p>
              <p className="text-sm text-gray-300">KES 50K-200K call-out</p>
            </div>
            <div className="p-4 bg-slate-800/50 border border-cyan-500/20 rounded">
              <p className="text-cyan-400 font-bold">Maintenance: KES 50K-300K/month</p>
              <p className="text-sm text-gray-300">Quarterly service included</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black text-center">
        <a href="tel:+254768860665" className="inline-block px-8 py-4 bg-cyan-500 text-white font-bold rounded-lg">
          Call: +254 768 860 665
        </a>
      </section>
    </div>
  );
}
