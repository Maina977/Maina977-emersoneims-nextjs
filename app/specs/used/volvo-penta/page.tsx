import { Metadata } from "next";
import OptimizedImage from "@/components/media/OptimizedImage";
import { SectionLead } from "@/components/generators";

export const metadata: Metadata = {
  title: "Used Volvo Penta Generator Specifications",
  description: "Marine-grade Volvo Penta generators (50–1500 kVA) with low emissions, 2,500–7,500 running hours, and closed-loop cooling for remote operations.",
};

export default function VolvoPentaSpecsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="eims-shell py-16">
        <SectionLead
          title="Volvo Penta Used Generators"
          subtitle="Marine-grade reliability for harsh remote environments"
          centered
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <OptimizedImage
                src="/images/gen00011.jpg"
                alt="Volvo Penta Generator"
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
                  <p className="text-gray-300">50 – 1500 kVA</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Running Hours</h3>
                  <p className="text-gray-300">2,500 – 7,500 hours</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Engine Type</h3>
                  <p className="text-gray-300">4-stroke, turbocharged marine diesel</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Fuel Consumption</h3>
                  <p className="text-gray-300">0.20 – 0.25 L/kWh @ 75% load</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Cooling System</h3>
                  <p className="text-gray-300">Closed-loop water cooling with expansion tank</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Noise Level</h3>
                  <p className="text-gray-300">68 – 78 dB @ 1 meter (naturally quiet)</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Emission Standard</h3>
                  <p className="text-gray-300">BS-IV compliant (low NOx emissions)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Available Models</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> D3-110</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> D4-115</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> D5-200</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> D9-400</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> D11-350</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> D13-550</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> D16-735</li>
              </ul>
            </div>

            <div className="pt-6">
              <h3 className="text-2xl font-bold mb-4 text-white">Key Advantages</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Biodiesel compatible</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Low emission standards</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Quiet operation</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Future-proof technology</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-10 rounded-xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-white">Marine Excellence on Land</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Volvo Penta engines are designed for the harshest maritime conditions, making them ideal for remote Kenya operations with limited support infrastructure. Closed-loop cooling systems eliminate dust and corrosion issues common in high-temperature environments.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Low emission standards position Volvo Penta generators as future-proof investments, meeting Kenya's evolving environmental regulations while delivering exceptional reliability and quiet operation.
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
