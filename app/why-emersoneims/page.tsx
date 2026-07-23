import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why EmersonEIMS | Market Leader in AI-Powered Power Solutions | Africa',
  description: 'See why EmersonEIMS is the #1 choice: AI-powered systems, 47-county coverage, full-spectrum solutions, verified engineers. Better than Jua Energy, Fenix, Puma Energy.',
  alternates: {
    canonical: 'https://www.emersoneims.com/why-emersoneims',
  },
};

const WhyEmersonEIMS = () => {
  const competitors = [
    {
      name: 'Jua Energy',
      claim: 'Solar Company',
      weakness: 'Only does solar — you need generator backup',
      ourEdge: 'We handle solar + generator + UPS + automation in one system',
      proof: '500+ integrated installations across 47 counties',
    },
    {
      name: 'Fenix Group',
      claim: 'Battery Platform',
      weakness: 'Batteries alone do not solve power problems',
      ourEdge: 'Our AI optimizes batteries within complete power systems',
      proof: 'Energy Intelligence Hub manages 40-60% efficiency gains',
    },
    {
      name: 'Puma Energy',
      claim: 'Fuel Distribution',
      weakness: 'They sell fuel; we solve power',
      ourEdge: 'Our solutions reduce your fuel consumption by 40-60%',
      proof: 'Generator Oracle AI diagnostics + renewable integration',
    },
    {
      name: 'Kenol Kobil',
      claim: 'Commodity Trader',
      weakness: 'No engineering capability — just distribution',
      ourEdge: 'We design, install, service, and optimize complete systems',
      proof: '18+ years of engineering expertise in East Africa',
    },
    {
      name: 'SunCulture',
      claim: 'Agri-Solar Specialist',
      weakness: 'Limited to agriculture; cannot handle industrial power',
      ourEdge: 'We serve agriculture + commercial + industrial + utilities',
      proof: 'Multi-sector installations (hospitals, factories, farms, data centers)',
    },
    {
      name: 'Blue Planet Group',
      claim: 'Commodity Services',
      weakness: 'Generic offerings with no specialization',
      ourEdge: 'AI-powered specialists in power, engineering, and innovation',
      proof: 'Top 3 ranking in Kenya for technical depth and credibility',
    },
  ];

  const ourAdvantages = [
    {
      category: 'AI Intelligence',
      icon: '🤖',
      points: [
        'Generator Oracle — only diagnostic AI in Africa',
        'Solar Genius Pro — 3D design + voice control',
        'AquaScan Pro — borehole yield prediction',
        'Energy Intelligence Hub — real-time optimization',
      ],
      competitor: 'None have AI tools',
    },
    {
      category: 'Geographic Coverage',
      icon: '📍',
      points: [
        'Present in ALL 47 Kenya counties',
        'Mobile workshop nationwide capability',
        'Same-day emergency response (major cities)',
        'Regional presence (Tanzania, Uganda, Rwanda)',
      ],
      competitor: 'Competitors are Nairobi-centric or scattered',
    },
    {
      category: 'Full-Spectrum Solutions',
      icon: '⚡',
      points: [
        'Generators (10+ brands, 10-2000 kVA)',
        'Solar systems (design + installation + maintenance)',
        'UPS & energy storage',
        'HVAC, boreholes, incinerators, high-voltage, fabrication',
      ],
      competitor: 'Competitors specialize in ONE category',
    },
    {
      category: 'Engineering Credibility',
      icon: '👨‍🔧',
      points: [
        '12 named engineers with certifications',
        'Factory training on Cummins, Perkins, Caterpillar',
        'Published technical guides & fault codes',
        'Real project portfolio (50+ documented installations)',
      ],
      competitor: 'Competitors hide team or have sales-focused staff',
    },
    {
      category: 'Transparency & Trust',
      icon: '✓',
      points: [
        'Published warranty matrix (all categories)',
        'Engineer profiles with credentials',
        'Case studies with metrics (not empty promises)',
        'Technical documentation (not marketing speak)',
      ],
      competitor: 'Competitors use vague terms ("up to", "typically", "estimated")',
    },
    {
      category: 'Speed & Responsiveness',
      icon: '⏱️',
      points: [
        '24/7 emergency hotline (+254 768 860 665)',
        'Mobile workshop for on-site repairs',
        'Diagnostic within hours (not days)',
        'Parts stock across all locations',
      ],
      competitor: 'Competitors require office hours + office visits',
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Why EmersonEIMS is</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Winning Against Every Competitor
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We are not just different. We are better in every way that matters:
            AI intelligence, geographic reach, full-spectrum solutions, and verified expertise.
          </p>
        </div>
      </section>

      {/* Competitive Takedown Table */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Direct Competitor Comparison
          </h2>

          <div className="grid gap-6">
            {competitors.map((comp, idx) => (
              <div
                key={idx}
                className="p-6 border border-slate-700 rounded-lg hover:border-cyan-500 transition bg-slate-900/30"
              >
                <div className="grid md:grid-cols-4 gap-6 items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-400 mb-1">{comp.name}</h3>
                    <p className="text-sm text-gray-400">{comp.claim}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 font-semibold mb-1">THEIR WEAKNESS</p>
                    <p className="text-white">{comp.weakness}</p>
                  </div>

                  <div>
                    <p className="text-sm text-cyan-400 font-semibold mb-1">OUR EDGE</p>
                    <p className="text-white">{comp.ourEdge}</p>
                  </div>

                  <div>
                    <p className="text-sm text-green-400 font-semibold mb-1">PROOF</p>
                    <p className="text-white text-sm">{comp.proof}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Advantages */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Six Reasons We are Unstoppable
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ourAdvantages.map((adv, idx) => (
              <div
                key={idx}
                className="p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700 rounded-lg hover:border-cyan-500 transition"
              >
                <div className="text-4xl mb-4">{adv.icon}</div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">{adv.category}</h3>

                <ul className="space-y-3 mb-6">
                  {adv.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-400 font-bold mt-1">✓</span>
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-slate-700">
                  <p className="text-sm text-gray-400 italic">
                    {adv.competitor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Leadership Statement */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            The #1 Market Position
          </h2>
          <p className="text-lg text-gray-200 mb-10">
            Every competitor is strong in ONE category. We are the ONLY company
            that combines AI intelligence + full-spectrum solutions + nationwide coverage + verified expertise.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-3xl font-bold text-cyan-300 mb-2">47</div>
              <p className="text-gray-300">Counties served (not claimed, OPERATED)</p>
            </div>

            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-3xl font-bold text-cyan-300 mb-2">4</div>
              <p className="text-gray-300">AI tools (no competitor has more than 0)</p>
            </div>

            <div className="p-6 bg-white/10 rounded-lg backdrop-blur">
              <div className="text-3xl font-bold text-cyan-300 mb-2">100%</div>
              <p className="text-gray-300">Of your power needs solved here</p>
            </div>
          </div>

          <Link
            href="/contact?type=market-leader"
            className="inline-block px-8 py-4 bg-white text-cyan-900 font-bold rounded-lg hover:bg-gray-200 transition text-lg"
          >
            Experience Market Leadership
          </Link>
        </div>
      </section>

      {/* Why Customers Choose Us */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            What Customers Are Saying
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: 'We tried Jua for solar, but when we needed a generator backup, we had to call someone else. EmersonEIMS handled everything.',
                author: 'Tech Startup, Nairobi',
              },
              {
                quote: 'EmersonEIMS did a load analysis and found our power was costing us 45% more than it should. AI diagnostics paid for itself in 3 months.',
                author: 'Manufacturing Facility, Kisumu',
              },
              {
                quote: 'What impressed me most: they told me honestly what I needed, not what would maximize their sale. Real engineers, not salespeople.',
                author: 'Hospital Administrator, Mombasa',
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-900/50 border border-slate-700 rounded-lg"
              >
                <p className="text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <p className="text-sm text-gray-400">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience The Difference?
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Stop settling for specialists who only solve part of your problem.
            Get a partner who solves ALL of it with AI intelligence and verified expertise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=consultation"
              className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition text-lg"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/generator-oracle"
              className="px-8 py-4 border border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition text-lg"
            >
              Try Generator Oracle
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WhyEmersonEIMS;
