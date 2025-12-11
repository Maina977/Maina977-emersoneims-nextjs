import SectionLead from "../componets/generators/SectionLead";

export const metadata = {
  title: "Testimonials & Guarantees — EmersonEIMS",
  description: "Customer testimonials, warranty badges, and uptime guarantees for Cummins generators.",
};

const testimonials = [
  {
    name: "Dr. Achieng",
    position: "Hospital Director, St. Mary Hospital",
    quote: "Our ICU has never experienced downtime since installing Cummins. EmersonEIMS delivered beyond expectations with 24/7 support.",
    rating: 5,
    project: "750kVA Installation",
    image: "👨‍⚕️",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Mr. Otieno",
    position: "Operations Manager, Manufacturing Plant",
    quote: "Production losses dropped to zero. The ROI calculator was accurate, and the generator paid for itself in 18 months.",
    rating: 5,
    project: "1500kVA Parallel System",
    image: "👷",
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "Mrs. Wanjiru",
    position: "Farm Exporter, Nakuru",
    quote: "Cold storage reliability improved dramatically. We now export confidently knowing power is guaranteed 24/7.",
    rating: 5,
    project: "350kVA Farm Solution",
    image: "👩‍🌾",
    color: "from-amber-500 to-orange-500"
  },
  {
    name: "Mr. Chovu",
    position: "IT Director, Kivukoni International School",
    quote: "Cummins gave us Tier III uptime compliance. EmersonEIMS is our trusted partner for all power needs.",
    rating: 5,
    project: "2000kVA Data Center",
    image: "👨‍💼",
    color: "from-purple-500 to-violet-500"
  },
];

const guarantees = [
  {
    title: "Warranty Guarantee",
    description: "New generators: 2–5 years. Used generators: 1 year. OEM parts guaranteed.",
    badge: "🛡",
    details: ["Comprehensive coverage", "Includes labor", "Nationwide support", "Fast claim processing"]
  },
  {
    title: "Uptime Guarantee",
    description: "99.9% uptime backed by preventive maintenance contracts and 24/7 support.",
    badge: "⚡",
    details: ["SLA-backed", "Performance monitoring", "Rapid response", "Compensation for downtime"]
  },
  {
    title: "Service Guarantee",
    description: "2-hour response time for emergencies across all 47 counties in Kenya.",
    badge: "⏱",
    details: ["24/7 hotline", "Mobile workshops", "Parts on truck", "Remote diagnostics"]
  },
  {
    title: "Design Accuracy",
    description: "Load sizing, ROI, and MTBF calculations verified by certified engineers.",
    badge: "📐",
    details: ["Engineering sign-off", "3D modeling", "Load flow analysis", "Compliance assurance"]
  },
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionLead
          title="Testimonials & Guarantees"
          subtitle="Hear from our clients and explore the guarantees that make EmersonEIMS the trusted leader."
          centered
        />

        {/* Testimonials */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Client Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="p-8 rounded-2xl border border-gray-800 bg-black/50 hover:border-gray-600 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-3xl`}>
                    {t.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">{t.name}</h3>
                        <p className="text-white/60">{t.position}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(t.rating)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="mt-6 text-lg italic text-white/80">"{t.quote}"</p>
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <span className="px-4 py-2 bg-gray-900 rounded-full text-sm text-white/80">
                        {t.project}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Video Testimonials Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Video Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-black/50 rounded-xl border border-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white/60">Client Testimonial Video {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Our Guarantees</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {guarantees.map((g) => (
              <div
                key={g.title}
                className="p-8 rounded-xl border border-gray-800 bg-black/50 text-center hover:border-brand-gold/50 transition-all duration-300"
              >
                <div className="text-4xl mb-6">{g.badge}</div>
                <h3 className="text-xl font-bold text-white">{g.title}</h3>
                <p className="mt-4 text-white/70">{g.description}</p>
                <ul className="mt-6 space-y-2">
                  {g.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-white/60">
                      • {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Badges */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Certifications & Accreditations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Cummins Certified", "KEBS Approved", "NEMA Compliant", "ISO 9001:2015"].map((cert) => (
              <div key={cert} className="p-6 rounded-xl border border-gray-800 bg-black/30 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white font-semibold">{cert}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-brand-gold/10 to-yellow-500/10 p-12 rounded-2xl border border-brand-gold/30">
            <h2 className="text-3xl font-bold text-white mb-6">Join 10,000+ Satisfied Clients</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Experience the EmersonEIMS difference. Get the same reliability, support, and performance that our clients trust.
            </p>
            <a 
              href="/generator/contact" 
              className="inline-block sci-fi-button px-12 py-4 text-lg"
            >
              Get Your Cummins Generator Today
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}