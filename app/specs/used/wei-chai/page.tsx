import { Metadata } from "next";
import OptimizedImage from "@/components/media/OptimizedImage";
import { SectionLead } from "@/components/generators";

export const metadata: Metadata = {
  title: "Used Wei Chai Generator Specifications",
  description: "Budget-friendly Wei Chai generators (30–1000 kVA) with 3,000–10,000 running hours, ideal for SMEs and agricultural backup power.",
};

export default function WeiChaiSpecsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="eims-shell py-16">
        <SectionLead
          title="Wei Chai Used Generators"
          subtitle="Cost-effective power for small business and farm operations"
          centered
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <OptimizedImage
                src="/images/voltka/voltka-warehouse-fleet.webp"
                alt="Wei Chai Generator"
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
                  <p className="text-gray-300">30 – 1000 kVA</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Running Hours</h3>
                  <p className="text-gray-300">3,000 – 10,000 hours</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Engine Type</h3>
                  <p className="text-gray-300">4-stroke, turbocharged diesel</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Fuel Consumption</h3>
                  <p className="text-gray-300">0.21 – 0.26 L/kWh @ 75% load</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Cooling System</h3>
                  <p className="text-gray-300">Water-cooled radiator</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Noise Level</h3>
                  <p className="text-gray-300">72 – 82 dB @ 1 meter</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Emission Standard</h3>
                  <p className="text-gray-300">BS-III compliant</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">Available Models</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> WP2.9D</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> WP4D</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> WP5D</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> WP6D</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> WP7D</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> WP10D</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> WP13D</li>
              </ul>
            </div>

            <div className="pt-6">
              <h3 className="text-2xl font-bold mb-4 text-white">Budget-Friendly Benefits</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Lower upfront cost</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Mechanically sound</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Thoroughly tested</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> New batteries included</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-10 rounded-xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-white">Value Without Compromise</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Wei Chai engines deliver exceptional value for cost-sensitive operations across Kenya. Popular with smallholder farmers, SMEs, and businesses requiring dependable backup power without premium pricing.
          </p>
          <p className="text-gray-300 leading-relaxed">
            While running hours may be higher than newer units, all Wei Chai generators in our inventory are mechanically sound, comprehensively tested, and come with new batteries and full servicing. Perfect for budget-conscious buyers who prioritize functionality over low hours.
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
