import { Metadata } from "next";
import OptimizedImage from "@/components/media/OptimizedImage";
import { SectionLead } from "@/components/generators";

export const metadata: Metadata = {
  title: "Used Caterpillar Generator Specifications",
  description: "Industrial-grade Caterpillar generators (100–2000 kVA) for heavy-duty mining and manufacturing with 3,000–12,000 running hours and comprehensive inspection.",
};

export default function CaterpillarSpecsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="eims-shell py-16">
        <SectionLead
          title="Caterpillar Used Generators"
          subtitle="Heavy-duty industrial power for mining and manufacturing operations"
          centered
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <OptimizedImage
                src="/images/enhanced/BIGOT CATERPILLAR 30KVA-4K-CINEMATIC.jpg"
                alt="Caterpillar Generator"
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
                  <p className="text-gray-300">100 – 2000 kVA</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Running Hours</h3>
                  <p className="text-gray-300">3,000 – 12,000 hours (industrial-grade units)</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Engine Type</h3>
                  <p className="text-gray-300">4-stroke, turbocharged with aftercooler</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Fuel Consumption</h3>
                  <p className="text-gray-300">0.19 – 0.24 L/kWh @ 75% load</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Cooling System</h3>
                  <p className="text-gray-300">Radiator with thermostat control</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Noise Level</h3>
                  <p className="text-gray-300">74 – 86 dB @ 1 meter (soundproofing available)</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Emission Standard</h3>
                  <p className="text-gray-300">BS-III & BS-IV compliant options</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Available Models</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C100D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C130D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C150D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C250D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C500D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C750D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C1000D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C2000D5</li>
              </ul>
            </div>

            <div className="pt-6">
              <h3 className="text-2xl font-bold mb-4 text-white">Inspection Process</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Bearing condition assessment</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Compression testing</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Load simulation testing</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Full service & reconditioning</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-10 rounded-xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-white">Built for Heavy Industry</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Caterpillar generators are engineered for demanding mining, manufacturing, and construction environments across Kenya. Our pre-owned units have been operated in the toughest conditions and are selected based on proven track records.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Each machine undergoes comprehensive 21-point inspection including bearing assessment, compression testing, and extended load simulation. We offer canopy and containerized options for turnkey deployment.
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
