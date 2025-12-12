import SectionLead from "../components/generators/SectionLead";

export const metadata = {
  title: "Industries Served — EmersonEIMS",
  description: "Cummins generators powering homes, banks, schools, hospitals, data centers, and more across Kenya.",
};

const industries = [
  { 
    name: "Homes & Residential Estates", 
    icon: "🏠", 
    description: "Reliable backup power for households and gated communities.",
    solutions: ["20-200 kVA", "ATS integration", "Silent canopies", "Smart monitoring"],
    color: "from-blue-400 to-cyan-400"
  },
  { 
    name: "Banks & Financial Institutions", 
    icon: "🏦", 
    description: "Uninterrupted power for ATMs, branches, and data centers.",
    solutions: ["100-1000 kVA", "Dual redundancy", "UPS integration", "24/7 monitoring"],
    color: "from-green-400 to-emerald-400"
  },
  { 
    name: "Schools & Universities", 
    icon: "🎓", 
    description: "Powering classrooms, labs, dormitories, and administrative buildings.",
    solutions: ["50-500 kVA", "Load management", "Fuel management", "Remote start"],
    color: "from-purple-400 to-violet-400"
  },
  { 
    name: "Malls & Retail", 
    icon: "🛍", 
    description: "Ensuring seamless shopping experiences with uninterrupted power.",
    solutions: ["200-2000 kVA", "Multiple units", "Load sharing", "Energy management"],
    color: "from-pink-400 to-rose-400"
  },
  { 
    name: "Hospitals & Clinics", 
    icon: "🏥", 
    description: "Critical power for operating theaters, ICUs, and medical equipment.",
    solutions: ["100-1500 kVA", "N+1 redundancy", "Fast start", "Medical grade"],
    color: "from-red-400 to-orange-400"
  },
  { 
    name: "Farms & Agro‑processing", 
    icon: "🌾", 
    description: "Powering irrigation, cold storage, and processing plants.",
    solutions: ["30-300 kVA", "Dust-proof", "Remote locations", "Fuel efficiency"],
    color: "from-amber-400 to-yellow-400"
  },
  { 
    name: "Data Centers", 
    icon: "💻", 
    description: "High‑availability power for servers and cloud infrastructure.",
    solutions: ["500-2000 kVA", "Tier III/IV", "Parallel operation", "Precision cooling"],
    color: "from-gray-400 to-slate-400"
  },
  { 
    name: "Hotels & Resorts", 
    icon: "🏨", 
    description: "Luxury hospitality powered by Cummins reliability.",
    solutions: ["100-800 kVA", "Silent operation", "Automatic start", "Guest comfort"],
    color: "from-indigo-400 to-blue-400"
  },
  { 
    name: "Industries & Factories", 
    icon: "🏭", 
    description: "Heavy‑duty power for manufacturing and production lines.",
    solutions: ["200-2000 kVA", "High load factor", "Durability", "Continuous operation"],
    color: "from-orange-400 to-red-400"
  },
  { 
    name: "Ships & Boats", 
    icon: "🚢", 
    description: "Marine‑grade Cummins generators for vessels and ports.",
    solutions: ["50-800 kVA", "Marine certified", "Corrosion resistant", "Vibration control"],
    color: "from-cyan-400 to-blue-400"
  },
  { 
    name: "Petrol Stations", 
    icon: "⛽", 
    description: "Ensuring pumps and POS systems stay online 24/7.",
    solutions: ["30-150 kVA", "Explosion proof", "High reliability", "Remote monitoring"],
    color: "from-yellow-400 to-amber-400"
  },
  { 
    name: "Government Institutions", 
    icon: "🏛", 
    description: "Reliable power for offices, ministries, and public services.",
    solutions: ["100-1000 kVA", "Secure operation", "Compliance", "Long-term support"],
    color: "from-slate-400 to-gray-400"
  },
];

export default function IndustriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionLead
          title="Industries Served"
          subtitle="From homes to hospitals, data centers to yachts — Cummins generators power every sector."
          centered
        />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry) => (
            <article
              key={industry.name}
              className="group p-8 rounded-xl border border-gray-800 bg-black/50 hover:bg-black/70 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center text-2xl`}>
                  {industry.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{industry.name}</h2>
                  <p className="mt-2 text-white/70">{industry.description}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h4 className="text-sm font-semibold text-brand-gold mb-3">TYPICAL SOLUTIONS</h4>
                <div className="flex flex-wrap gap-2">
                  {industry.solutions.map((solution, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-900 rounded-full text-xs text-white/80">
                      {solution}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <a 
                  href="/generator/contact" 
                  className="sci-fi-button flex-1 text-center py-3"
                >
                  Get Solution
                </a>
                <a 
                  href={`/case-studies/${industry.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="sci-fi-outline flex-1 text-center py-3"
                >
                  Case Studies
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Industry Statistics */}
        <div className="mt-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Industry Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-gold">500+</div>
              <p className="text-white/70 mt-2">Hospitals Powered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-gold">2,000+</div>
              <p className="text-white/70 mt-2">Schools & Universities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-gold">300+</div>
              <p className="text-white/70 mt-2">Data Centers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-gold">10,000+</div>
              <p className="text-white/70 mt-2">Businesses Served</p>
            </div>
          </div>
        </div>

        {/* Industry-Specific Solutions */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Industry-Specific Solutions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl border border-gray-700 bg-black/30">
              <h3 className="text-xl font-bold text-white mb-4">Healthcare Sector Solutions</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-white/80">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  N+1 redundancy for critical care units
                </li>
                <li className="flex items-center text-white/80">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  10-second transfer time for ICU equipment
                </li>
                <li className="flex items-center text-white/80">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Medical-grade grounding and protection
                </li>
              </ul>
            </div>
            
            <div className="p-8 rounded-xl border border-gray-700 bg-black/30">
              <h3 className="text-xl font-bold text-white mb-4">Data Center Solutions</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-white/80">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Parallel operation for N+1 redundancy
                </li>
                <li className="flex items-center text-white/80">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Precision cooling integration
                </li>
                <li className="flex items-center text-white/80">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  SCADA integration for remote monitoring
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
