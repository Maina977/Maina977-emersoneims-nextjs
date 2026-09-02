import { Metadata } from "next";
import OptimizedImage from "@/components/media/OptimizedImage";
import { SectionLead } from "@/components/generators";

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/specs/used/sdmo' },
  title: "Used SDMO Generator Specifications",
  description: "SDMO Kohler Power generators (30–1200 kVA) with French engineering, 2,000–8,000 running hours, ideal for farming and remote operations.",
};

export default function SDMOSpecsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="eims-shell py-16">
        <SectionLead
          title="SDMO Used Generators"
          subtitle="French-engineered reliability for farming and remote operations"
          centered
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <OptimizedImage
                src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
                alt="SDMO Generator"
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
                  <p className="text-gray-300">30 – 1200 kVA</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Running Hours</h3>
                  <p className="text-gray-300">2,000 – 8,000 hours</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Engine Type</h3>
                  <p className="text-gray-300">4-stroke, turbocharged diesel</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Fuel Consumption</h3>
                  <p className="text-gray-300">0.18 – 0.21 L/kWh @ 75% load</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Cooling System</h3>
                  <p className="text-gray-300">Fan-cooled radiator</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Noise Level</h3>
                  <p className="text-gray-300">70 – 80 dB @ 1 meter</p>
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
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> AIRDOSER 60</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> AIRDOSER 80</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> AIRDOSER 110</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> AIRDOSER 150</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> POWER FOCUS</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> MDX series</li>
              </ul>
            </div>

            <div className="pt-6">
              <h3 className="text-2xl font-bold mb-4 text-white">Simple Maintenance</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Easy service procedures</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> No specialized technicians needed</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Affordable spare parts</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Robust design</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-10 rounded-xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-white">African Reliability</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            SDMO generators combine French engineering precision with proven reliability across Africa's farming, manufacturing, and commercial sectors. These units are popular in remote mining and agricultural operations where simplicity and uptime matter most.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Unlike complex systems requiring factory technicians, SDMO generators feature straightforward maintenance procedures that local mechanics can handle, reducing downtime and keeping operational costs low.
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
