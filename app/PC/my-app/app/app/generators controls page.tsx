import SectionLead from "@/componets/generators/SectionLead";
import ErrorFrequencyChart from "@/componets/generators/ErrorFrequencyChart";

export const metadata = {
  title: "Generator Controls & Automation — EmersonEIMS",
  description: "DeepSea and PowerWizard controllers, ATS, power factor correction, and error code database.",
};

const controls = [
  {
    name: "DeepSea Controllers",
    models: "DSE7320, DSE8610, DSE4520",
    features: ["CANbus integration", "Remote monitoring", "Advanced protection", "Synchronization"],
    icon: "🎮",
    brandColor: "from-blue-600 to-blue-400"
  },
  {
    name: "PowerWizard Controllers",
    models: "PW1.1, PW2.1, PW3.1",
    features: ["Intuitive interface", "Built-in diagnostics", "Cummins engineered", "Superior reliability"],
    icon: "⚡",
    brandColor: "from-yellow-600 to-yellow-400"
  },
  {
    name: "Automatic Changeovers",
    models: "30A – 4000A ATS",
    features: ["Configurable delays", "UL/IEC compliant", "Seamless transfer", "Multi-source"],
    icon: "🔄",
    brandColor: "from-green-600 to-green-400"
  },
  {
    name: "Power Factor Correction",
    models: "Capacitor banks, Harmonic filters",
    features: ["Smart controllers", "Energy optimization", "Reduces losses", "Utility compliance"],
    icon: "📊",
    brandColor: "from-purple-600 to-purple-400"
  },
];

export default function ControlsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionLead
          title="Generator Controls & Automation"
          subtitle="DeepSea, PowerWizard, ATS, and power factor correction — engineered for precision and reliability."
          centered
        />

        {/* Controls Grid */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {controls.map((item) => (
            <article
              key={item.name}
              className="p-8 rounded-xl border border-gray-800 bg-black/50 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.brandColor} flex items-center justify-center text-3xl`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                  <p className="mt-2 text-brand-gold font-semibold">{item.models}</p>
                  <ul className="mt-4 space-y-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-white/70">
                        <span className="w-2 h-2 bg-brand-gold rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <a 
                  href="/generator/contact" 
                  className="sci-fi-button flex-1 text-center py-3"
                >
                  Request Quote
                </a>
                <a 
                  href={`/specs/controls/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="sci-fi-outline flex-1 text-center py-3"
                >
                  Technical Specs
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Error Frequency Chart Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Error Frequency Comparison</h2>
          <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
            <ErrorFrequencyChart />
            <p className="mt-6 text-white/60 text-center text-sm">
              DeepSea controllers show 20-30% fewer error occurrences compared to standard controllers
            </p>
          </div>
        </div>

        {/* Integration Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-10 rounded-2xl border border-blue-500/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Smart Integration Services</h3>
            <p className="text-white/70 max-w-3xl mx-auto mb-8">
              We integrate generator controls with building management systems, SCADA, and remote monitoring platforms for complete visibility and control.
            </p>
            <a 
              href="/generator/contact" 
              className="inline-block sci-fi-button px-10 py-4"
            >
              Schedule Integration Consultation
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
