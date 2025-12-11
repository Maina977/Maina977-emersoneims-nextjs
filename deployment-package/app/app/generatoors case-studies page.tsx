import SectionLead from "../componets/generators/SectionLead";

export const metadata = {
  title: "Generator Case Studies — EmersonEIMS",
  description: "Real projects powered by Cummins generators across Kenya with proven ROI and uptime.",
};

const caseStudies = [
  {
    title: "Nairobi Hospital Power Reliability",
    sector: "Healthcare",
    location: "Nairobi, Kenya",
    generator: "Cummins 750kVA + 500kVA redundant",
    before: "Frequent blackouts disrupted surgeries and ICU operations, risking patient lives.",
    solution: "Installed dual Cummins generators with N+1 redundancy and 10-second ATS.",
    results: ["99.99% uptime achieved", "Zero surgery interruptions in 2 years", "ROI: 18 months", "Annual savings: KSh 15M"],
    metrics: { uptime: "99.99%", savings: "15M/year", roi: "18 months" },
    image: "/media/case-hospital.jpg",
  },
  {
    title: "Bamburi Cement Factory",
    sector: "Manufacturing",
    location: "Mombasa, Kenya",
    generator: "Cummins 1500kVA parallel operation",
    before: "Production halted 3–4 times weekly due to unstable grid, costing KSh 2M daily.",
    solution: "Two 750kVA Cummins generators in parallel with load sharing and SCADA control.",
    results: ["Production increased by 42%", "Maintenance costs reduced by 35%", "Payback: 14 months", "Uptime: 99.8%"],
    metrics: { uptime: "99.8%", production: "+42%", roi: "14 months" },
    image: "/media/case-factory.jpg",
  },
  {
    title: "Teso Farm Cold Storage",
    sector: "Agriculture",
    location: "Busia, Kenya",
    generator: "Cummins 350kVA with automated fuel system",
    before: "30% produce spoilage due to unreliable refrigeration during power outages.",
    solution: "Cummins generator with automated fuel management and remote monitoring.",
    results: ["Spoilage reduced to 2%", "Export revenue increased by 60%", "ROI: 22 months", "Fuel savings: 25%"],
    metrics: { spoilage: "2%", revenue: "+60%", fuel: "25% savings" },
    image: "/media/case-farm.jpg",
  },
  {
    title: "Safaricom Data Center",
    sector: "Technology",
    location: "Nairobi, Kenya",
    generator: "Cummins 2000kVA x3 parallel",
    before: "Server crashes during outages risked major client contracts and SLA violations.",
    solution: "Three 2000kVA Cummins generators in parallel with Tier IV redundancy.",
    results: ["Zero downtime in 36 months", "Customer retention increased 40%", "Energy efficiency improved 22%", "Tier IV certification"],
    metrics: { uptime: "100%", efficiency: "+22%", retention: "+40%" },
    image: "/media/case-datacenter.jpg",
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionLead
          title="Generator Case Studies"
          subtitle="Real projects across Kenya — hospitals, factories, farms, and data centers powered by Cummins."
          centered
        />

        <div className="mt-12 space-y-12">
          {caseStudies.map((cs, index) => (
            <article
              key={cs.title}
              className="p-8 rounded-2xl border border-gray-800 bg-black/50 hover:bg-black/70 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-brand-gold">0{index + 1}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{cs.title}</h2>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                          {cs.sector}
                        </span>
                        <span className="px-3 py-1 bg-gray-800 text-white/80 rounded-full text-sm">
                          {cs.location}
                        </span>
                        <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-sm">
                          {cs.generator}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">The Challenge</h3>
                      <p className="text-white/70">{cs.before}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Our Solution</h3>
                      <p className="text-white/70">{cs.solution}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Key Results</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(cs.metrics).map(([key, value]) => (
                        <div key={key} className="text-center p-4 bg-gray-900/50 rounded-lg">
                          <div className="text-2xl font-bold text-brand-gold">{value}</div>
                          <div className="text-sm text-white/60 mt-1 capitalize">{key.replace(/_/g, ' ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ul className="mt-8 grid md:grid-cols-2 gap-3">
                    {cs.results.map((result, idx) => (
                      <li key={idx} className="flex items-center text-white/80">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:w-1/3">
                  <div className="h-full bg-gray-900 rounded-xl p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">Project Highlights</h3>
                    <div className="space-y-4 flex-1">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-sm text-white/60">Duration</div>
                        <div className="text-white font-semibold">4-6 Weeks</div>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-sm text-white/60">Team Size</div>
                        <div className="text-white font-semibold">8 Engineers</div>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-sm text-white/60">Warranty</div>
                        <div className="text-white font-semibold">5 Years</div>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-sm text-white/60">Support Level</div>
                        <div className="text-white font-semibold">24/7 Premium</div>
                      </div>
                    </div>
                    <div className="mt-8 space-y-3">
                      <a 
                        href="/generator/contact" 
                        className="block sci-fi-button text-center py-3"
                      >
                        Request Similar Project
                      </a>
                      <a 
                        href={`/case-studies/${cs.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block sci-fi-outline text-center py-3"
                      >
                        Read Full Case Study
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ROI Calculator CTA */}
        <div className="mt-20 bg-gradient-to-r from-brand-gold/10 to-yellow-500/10 p-10 rounded-2xl border border-brand-gold/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">What's Your Potential ROI?</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Use our calculator to estimate your savings and payback period based on your specific needs.
            </p>
            <a 
              href="/generator#calculator" 
              className="inline-block sci-fi-button px-10 py-4"
            >
              Calculate Your ROI
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}