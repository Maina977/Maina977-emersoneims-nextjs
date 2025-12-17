import SectionLead from "@/componets/generators/SectionLead";

export const metadata = {
  title: "Generator Services — EmersonEIMS",
  description: "Installation, leasing, maintenance, spare parts, and 24/7 support for Cummins generators.",
};

const services = [
  {
    name: "Installation & Commissioning",
    description: "Turnkey installation including site preparation, cabling, plinths, and commissioning with KEBS & NEMA compliance.",
    icon: "⚡",
    features: ["Site assessment", "Civil works", "Electrical installation", "Testing & commissioning"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Leasing & Rental",
    description: "Flexible short‑term and long‑term generator leasing for events, construction, and emergency backup.",
    icon: "🔑",
    features: ["Daily/Monthly rental", "Delivery & setup", "Operator included", "Full maintenance"],
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "Preventive Maintenance",
    description: "Scheduled servicing, oil changes, filter replacements, and diagnostics to maximize uptime.",
    icon: "🛠",
    features: ["Annual contracts", "Remote monitoring", "Predictive maintenance", "MTBF tracking"],
    color: "from-amber-500 to-orange-500"
  },
  {
    name: "Spare Parts Supply",
    description: "OEM parts for Cummins, Perkins, Caterpillar, Volvo Penta — alternators, controllers, filters, injectors.",
    icon: "📦",
    features: ["Genuine OEM parts", "Same-day delivery", "Warranty backed", "Technical support"],
    color: "from-red-500 to-pink-500"
  },
  {
    name: "24/7 Emergency Support",
    description: "Rapid response teams across all 47 counties to restore power and minimize downtime.",
    icon: "⏱",
    features: ["2-hour response time", "Nationwide coverage", "Mobile workshops", "Parts on truck"],
    color: "from-purple-500 to-violet-500"
  },
  {
    name: "Engine Overhauls",
    description: "Complete engine rebuilds using OEM parts and factory specifications for maximum performance.",
    icon: "⚙️",
    features: ["Complete strip-down", "Cylinder honing", "New bearings & seals", "Dyno testing"],
    color: "from-gray-600 to-gray-400"
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionLead
          title="Generator Services"
          subtitle="Installation, leasing, maintenance, spare parts, and 24/7 support — engineered for reliability."
          centered
        />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <article
              key={service.name}
              className="group p-8 rounded-xl border border-gray-800 bg-black/50 hover:bg-black/70 transition-all duration-300"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-6`}>
                {service.icon}
              </div>
              
              <h2 className="text-2xl font-bold text-white">{service.name}</h2>
              <p className="mt-4 text-white/70">{service.description}</p>
              
              <ul className="mt-6 space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-white/80">
                    <svg className="w-4 h-4 text-brand-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 flex gap-4">
                <a 
                  href="/generator/contact" 
                  className="sci-fi-button flex-1 text-center py-3"
                >
                  Request Service
                </a>
                <a 
                  href={`/services/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="sci-fi-outline flex-1 text-center py-3"
                >
                  Learn More
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Service Plans */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Maintenance Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border border-gray-700 bg-black/30 text-center">
              <h3 className="text-2xl font-bold text-white">Basic Plan</h3>
              <p className="mt-4 text-4xl font-bold text-brand-gold">KSh 50,000<span className="text-lg">/year</span></p>
              <ul className="mt-6 space-y-3">
                <li className="text-white/70">2 Scheduled Services</li>
                <li className="text-white/70">Remote Monitoring</li>
                <li className="text-white/70">Email Support</li>
              </ul>
              <button className="mt-8 sci-fi-outline w-full py-3">Select Plan</button>
            </div>
            
            <div className="p-8 rounded-xl border-2 border-brand-gold bg-black/50 text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-gold text-black px-4 py-1 rounded-full text-sm font-bold">POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Professional Plan</h3>
              <p className="mt-4 text-4xl font-bold text-brand-gold">KSh 120,000<span className="text-lg">/year</span></p>
              <ul className="mt-6 space-y-3">
                <li className="text-white">4 Scheduled Services</li>
                <li className="text-white">24/7 Remote Monitoring</li>
                <li className="text-white">Priority Phone Support</li>
                <li className="text-white">10% Discount on Parts</li>
              </ul>
              <button className="mt-8 sci-fi-button w-full py-3">Select Plan</button>
            </div>
            
            <div className="p-8 rounded-xl border border-gray-700 bg-black/30 text-center">
              <h3 className="text-2xl font-bold text-white">Enterprise Plan</h3>
              <p className="mt-4 text-4xl font-bold text-brand-gold">Custom</p>
              <ul className="mt-6 space-y-3">
                <li className="text-white/70">Unlimited Services</li>
                <li className="text-white/70">Dedicated Engineer</li>
                <li className="text-white/70">Same-Day Response</li>
                <li className="text-white/70">20% Discount on Parts</li>
              </ul>
              <button className="mt-8 sci-fi-outline w-full py-3">Contact Sales</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
