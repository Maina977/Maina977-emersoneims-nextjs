import SectionLead from "../components/generators/SectionLead";

export const metadata = {
  title: "Generator Accessories — EmersonEIMS",
  description: "ATS, canopies, exhausts, sheds, plinths, and automated reservoir tanks for Cummins generators.",
};

const accessories = [
  {
    name: "Automatic Transfer Switch (ATS)",
    specs: "30A – 4000A, 3‑phase, configurable delays",
    description: "Seamless power transfer between grid and generator with UL/IEC compliance.",
    icon: "🔄",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Canopies",
    specs: "Weatherproof, sound‑attenuated, powder‑coated",
    description: "Protects generators from harsh environments while reducing noise levels.",
    icon: "🏗️",
    color: "from-gray-600 to-gray-400"
  },
  {
    name: "Exhaust Systems",
    specs: "Custom silencers, catalytic converters",
    description: "Engineered for reduced emissions and environmental compliance.",
    icon: "💨",
    color: "from-gray-800 to-gray-600"
  },
  {
    name: "Generator Sheds",
    specs: "Concrete/steel structures, ventilated",
    description: "Permanent housing solutions for large‑scale installations.",
    icon: "🏠",
    color: "from-amber-700 to-amber-500"
  },
  {
    name: "Plinths & Foundations",
    specs: "Reinforced concrete, vibration‑dampened",
    description: "Stable base designed to reduce vibration and noise.",
    icon: "⚓",
    color: "from-stone-700 to-stone-500"
  },
  {
    name: "Automated Reservoir Tanks",
    specs: "500L – 20,000L, level sensors, pumps",
    description: "Ensures continuous fuel supply with automation and safety.",
    icon: "🛢️",
    color: "from-yellow-700 to-yellow-500"
  },
];

export default function AccessoriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionLead
          title="Generator Accessories"
          subtitle="ATS, canopies, exhausts, sheds, plinths, and automated reservoir tanks — engineered for reliability."
          centered
        />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accessories.map((item) => (
            <article
              key={item.name}
              className="group p-6 rounded-xl border border-gray-800 bg-black/50 hover:bg-black/70 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-6`}>
                {item.icon}
              </div>
              
              <h2 className="text-2xl font-bold text-white">{item.name}</h2>
              <p className="mt-2 text-brand-gold font-semibold">{item.specs}</p>
              <p className="mt-4 text-white/70">{item.description}</p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a 
                  href="/generator/contact" 
                  className="sci-fi-button flex-1 text-center py-3"
                >
                  Request Quote
                </a>
                <a 
                  href={`/specs/accessories/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="sci-fi-outline flex-1 text-center py-3"
                >
                  Specifications
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 rounded-2xl border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Need Custom Solutions?</h3>
            <p className="text-white/70 max-w-2xl mx-auto">
              We engineer custom accessories tailored to your specific requirements and site conditions.
            </p>
            <a 
              href="/generator/contact" 
              className="inline-block mt-6 sci-fi-button px-10 py-4 text-lg"
            >
              Get Custom Quote
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
