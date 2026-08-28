import { Metadata } from "next";
import OptimizedImage from "@/components/media/OptimizedImage";
import { SectionLead } from "@/components/generators";

export const metadata: Metadata = {
  title: "Used Perkins Generator Specifications",
  description: "Pre-owned Perkins generators (20–1000 kVA) with running hours 1,500–6,000 hrs, fuel-efficient engines, and comprehensive warranty coverage.",
};

export default function PerkinsSpecsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="eims-shell py-16">
        <SectionLead
          title="Perkins Used Generators"
          subtitle="Fuel-efficient power trusted by hospitals and schools across Kenya"
          centered
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <OptimizedImage
                src="/images/enhanced/ST AUSTINS ACADEMY 50KVA PERKINS ENGINE-4K-CINEMATIC.jpg"
                alt="Perkins Generator"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-brand-gold">Specifications</h2>

              <div className="space-y-4">
                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Power Range</h3>
                  <p className="text-gray-300">20 – 1000 kVA</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Running Hours</h3>
                  <p className="text-gray-300">1,500 – 6,000 hours (very low-hour stock)</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Engine Type</h3>
                  <p className="text-gray-300">4-stroke, naturally aspirated & turbocharged</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Fuel Consumption</h3>
                  <p className="text-gray-300">0.17 – 0.19 L/kWh @ 75% load</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Cooling System</h3>
                  <p className="text-gray-300">Water-cooled radiator with fan</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Noise Level</h3>
                  <p className="text-gray-300">70 – 78 dB @ 1 meter</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Emission Standard</h3>
                  <p className="text-gray-300">BS-III compliant</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Popular Models</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> 1104A-44G</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> 1104C-44G</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> 1106A-70G</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> 1106C-70G</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> 1500A-60G</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> 2000A-60G</li>
              </ul>
            </div>

            <div className="pt-6">
              <h3 className="text-2xl font-bold mb-4 text-white">Why Choose Perkins?</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Exceptional fuel efficiency</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Ideal for 24/7 operations</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Direct factory support</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Low running hours stock</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-10 rounded-xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-white">Trusted by Institutions</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Perkins engines power critical infrastructure across Kenya — hospitals depend on them for emergency backup power, schools rely on them for reliable electricity, and government facilities trust them for essential operations.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Our pre-owned Perkins units come from verified institutional sources with documented maintenance records, ensuring consistent performance and reliability.
          </p>
        </div>

        <div className="mt-16 text-center">
          <a href="/contact" className="inline-block sci-fi-button px-8 py-4">
            Request a Quote
          </a>
        </div>
      </div>
    </div>
  );
}
