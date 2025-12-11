import SectionLead from "../componets/generators/SectionLead";

export const metadata = {
  title: "Used Generators — EmersonEIMS",
  description: "Fully serviced used generators from Cummins, Perkins, Caterpillar, Volvo Penta with 1-year warranty.",
};

const usedGenerators = [
  {
    brand: "Cummins",
    kvaRange: "50–2000 kVA",
    warranty: "1 year comprehensive",
    priceRange: "KSh 800,000 – 15M",
    features: ["Fully serviced", "Load tested", "OEM parts", "6-month service history"],
    status: "In Stock",
    statusColor: "bg-green-500",
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/IMG-20250804-WA0006.jpg",
  },
  {
    brand: "Perkins",
    kvaRange: "20–1000 kVA",
    warranty: "1 year engine & alternator",
    priceRange: "KSh 500,000 – 8M",
    features: ["Fuel efficient", "Low hours", "New filters", "Painted"],
    status: "Limited Stock",
    statusColor: "bg-yellow-500",
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-5-scaled.png",
  },
  {
    brand: "Caterpillar",
    kvaRange: "100–2000 kVA",
    warranty: "1 year comprehensive",
    priceRange: "KSh 1.2M – 20M",
    features: ["Heavy-duty", "Low hours", "Full service", "Canopy available"],
    status: "In Stock",
    statusColor: "bg-green-500",
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/80-scaled.png",
  },
  {
    brand: "Volvo Penta",
    kvaRange: "50–1500 kVA",
    warranty: "1 year engine",
    priceRange: "KSh 700,000 – 12M",
    features: ["Low emissions", "Advanced controls", "Soundproofed", "Containerized"],
    status: "Available Soon",
    statusColor: "bg-blue-500",
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/77.png",
  },
  {
    brand: "SDMO",
    kvaRange: "30–1200 kVA",
    warranty: "1 year",
    priceRange: "KSh 400,000 – 10M",
    features: ["French engineered", "Robust design", "Easy maintenance", "Export ready"],
    status: "In Stock",
    statusColor: "bg-green-500",
  },
  {
    brand: "Wei Chai",
    kvaRange: "50–1000 kVA",
    warranty: "6 months",
    priceRange: "KSh 300,000 – 6M",
    features: ["Cost effective", "Fully tested", "New batteries", "Serviced"],
    status: "In Stock",
    statusColor: "bg-green-500",
  },
];

export default function UsedGeneratorsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionLead
          title="Used Generators"
          subtitle="Fully serviced, tested, and warrantied generators from leading global brands."
          centered
        />

        {/* Warning Banner */}
        <div className="mt-8 bg-yellow-900/30 border border-yellow-700 rounded-xl p-6">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-yellow-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-white">Important Notice</h3>
              <p className="text-white/70">All used generators undergo comprehensive 21-point inspection and load testing. Prices vary based on condition and hours.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usedGenerators.map((gen) => (
            <article
              key={gen.brand}
              className="p-6 rounded-xl border border-gray-800 bg-black/50 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{gen.brand}</h2>
                <span className={`${gen.statusColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {gen.status}
                </span>
              </div>
              
              <p className="text-brand-gold font-semibold">{gen.kvaRange}</p>
              <p className="text-white/80 mt-2">Warranty: {gen.warranty}</p>
              <p className="text-white font-bold mt-2">{gen.priceRange}</p>
              
              {gen.image && (
                <div className="mt-6 overflow-hidden rounded-lg">
                  <img
                    src={gen.image}
                    alt={`${gen.brand} used generator`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              
              <ul className="mt-6 space-y-2">
                {gen.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-white/80">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a 
                  href="/generator/contact" 
                  className="sci-fi-button flex-1 text-center py-3"
                >
                  Request Quote
                </a>
                <a 
                  href={`/specs/used/${gen.brand.toLowerCase()}`}
                  className="sci-fi-outline flex-1 text-center py-3"
                >
                  View Details
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Inspection Process */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Our 21-Point Inspection Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border border-gray-700 bg-black/30">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Mechanical Inspection</h3>
              <p className="mt-4 text-white/70">Engine compression test, turbo inspection, coolant system check, and vibration analysis.</p>
            </div>
            
            <div className="p-8 rounded-xl border border-gray-700 bg-black/30">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Electrical Testing</h3>
              <p className="mt-4 text-white/70">Alternator output test, AVR function, controller diagnostics, and insulation resistance.</p>
            </div>
            
            <div className="p-8 rounded-xl border border-gray-700 bg-black/30">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Load Bank Testing</h3>
              <p className="mt-4 text-white/70">Full load test for 4+ hours, thermal imaging, voltage stability, and harmonic analysis.</p>
            </div>
          </div>
        </div>

        {/* Trade-In Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-10 rounded-2xl border border-blue-500/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Trade-In Your Old Generator</h3>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Get credit towards a new Cummins generator when you trade in your old unit. Free collection and valuation.
            </p>
            <a 
              href="/generator/contact?type=tradein" 
              className="inline-block sci-fi-button px-10 py-4"
            >
              Get Trade-In Value
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}