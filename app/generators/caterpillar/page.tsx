import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const OptimizedImage = dynamic(() => import('@/components/media/OptimizedImage'), { ssr: false });

export const metadata: Metadata = {
  title: 'Caterpillar Generators Kenya | Industrial & Heavy-Duty Power | EmersonEIMS',
  description: 'Caterpillar Cat generators 100-2000kVA for Kenya. Heavy-duty industrial power, mining, construction. Expert installation and 24/7 maintenance support.',
  alternates: {
    canonical: 'https://www.emersoneims.com/generators/caterpillar',
  },
};

export default function CaterpillarPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
                  Caterpillar
                </span>
                <br />Heavy-Duty Power
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Caterpillar generators trusted by mining, construction, and heavy industrial operations. 100-2000 kVA units engineered for mission-critical applications.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact?type=cat-quote"
                  className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
                >
                  Get Quotation
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
              <OptimizedImage
                src="/images/enhanced/BIGOT CATERPILLAR 30KVA-4K-CINEMATIC.jpg"
                alt="Caterpillar Generator"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Why Choose Caterpillar?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Industrial-Grade Construction</h3>
              <p className="text-gray-300">Built for extreme conditions. Caterpillar generators handle demanding loads in mining, construction, and industrial settings with minimal downtime.</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Parallel & Container Ready</h3>
              <p className="text-gray-300">Advanced control systems enable parallel operation and containerized deployment. Perfect for large-scale projects requiring redundancy.</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Heavy-Load Capability</h3>
              <p className="text-gray-300">Superior overload capacity and thermal management. Caterpillar engines handle sustained high-load operations without derating.</p>
            </div>
            <div className="p-6 border border-slate-700 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Global Support Network</h3>
              <p className="text-gray-300">Backed by Caterpillar's worldwide dealer network and EmersonEIMS field expertise. Parts and service available 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Caterpillar Power Solutions Range</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { capacity: '100-300 kVA', use: 'Large commercial, light industrial' },
              { capacity: '300-800 kVA', use: 'Manufacturing, data centers, hospitals' },
              { capacity: '800-2000 kVA', use: 'Mining, utilities, large infrastructure' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 border border-slate-700 rounded-lg hover:border-yellow-500 transition">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{item.capacity}</h3>
                <p className="text-gray-300">{item.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-yellow-900 to-orange-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Industrial Power You Can Trust</h2>
          <Link
            href="/contact?type=cat-quote"
            className="inline-block px-8 py-4 bg-white text-yellow-900 font-bold rounded-lg hover:bg-gray-200 transition"
          >
            Request Technical Specifications
          </Link>
        </div>
      </section>
    </main>
  );
}
