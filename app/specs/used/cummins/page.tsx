import { Metadata } from "next";
import { motion } from "framer-motion";
import OptimizedImage from "@/components/media/OptimizedImage";
import { SectionLead } from "@/components/generators";

export const metadata: Metadata = {
  title: "Used Cummins Generator Specifications",
  description: "Detailed specifications for pre-owned Cummins generators (50–2000 kVA) including running hours, fuel consumption, and service details.",
};

export default function CumminsSpecsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="eims-shell py-16">
        <SectionLead
          title="Cummins Used Generators"
          subtitle="Industry-standard power for mission-critical applications across Kenya"
          centered
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <OptimizedImage
                src="/images/enhanced/KIVUKONI SCHOOL CUMMINS GENERATOR -4K-CINEMATIC.jpg"
                alt="Cummins Generator"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-brand-gold">Specifications</h2>

              <div className="space-y-4">
                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Power Range</h3>
                  <p className="text-gray-300">50 – 2000 kVA</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Running Hours</h3>
                  <p className="text-gray-300">2,000 – 8,500 hours (low-hour units)</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Engine Type</h3>
                  <p className="text-gray-300">4-stroke, turbocharged diesel</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Fuel Consumption</h3>
                  <p className="text-gray-300">0.18 – 0.22 L/kWh @ 75% load</p>
                </div>

                <div className="border-l-4 border-brand-gold pl-4">
                  <h3 className="text-lg font-semibold text-white">Cooling System</h3>
                  <p className="text-gray-300">Radiator-cooled with electric fan</p>
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
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C50D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C100D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C250D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C500D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C750D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C1000D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C1500D5</li>
                <li className="flex items-center"><span className="text-brand-gold mr-2">→</span> C2000D5</li>
              </ul>
            </div>

            <div className="pt-6">
              <h3 className="text-2xl font-bold mb-4 text-white">Service & Support</h3>
              <p className="text-gray-300 mb-4">Nationwide authorized service centers provide:</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> OEM spare parts availability</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Factory-trained technicians</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Preventive maintenance programs</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Emergency breakdown support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-10 rounded-xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-white">Why Cummins?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Cummins generators are the industry standard for power generation across Kenya, trusted by government agencies, hospitals, schools, and manufacturing facilities. Our pre-owned units are sourced from verified installations and undergo comprehensive load testing before delivery.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Each unit includes a detailed 6-month service history and OEM parts compatibility, ensuring you can maintain your generator at any authorized service center nationwide.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a href="/contact" className="inline-block sci-fi-button px-8 py-4">
            Request a Quote
          </a>
        </div>
      </div>
    </main>
  );
}
