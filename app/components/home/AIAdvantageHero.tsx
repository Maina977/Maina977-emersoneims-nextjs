'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AIAdvantageHero() {
  const aiTools = [
    {
      icon: '🤖',
      name: 'Generator Oracle',
      desc: 'AI diagnostics for any generator issue — fault codes, troubleshooting, predictive maintenance',
      link: '/generator-oracle',
      color: 'from-cyan-600 to-blue-600',
    },
    {
      icon: '☀️',
      name: 'Solar Genius Pro',
      desc: '3D AI solar design, voice control, 25-year production forecasts, site analysis',
      link: '/solar-genius-pro',
      color: 'from-amber-600 to-orange-600',
    },
    {
      icon: '💧',
      name: 'AquaScan Pro',
      desc: 'AI borehole diagnostics — yield prediction, aquifer analysis, drilling optimization',
      link: '/aquascan-pro',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: '⚡',
      name: 'Energy Intelligence Hub',
      desc: 'Real-time system optimization across generators, solar, UPS, and storage',
      link: '/energy-intelligence',
      color: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden">
      {/* Background animated grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(99,255,218,.2)_25%,rgba(99,255,218,.2)_50%,transparent_50%,transparent_75%,rgba(99,255,218,.2)_75%,rgba(99,255,218,.2))] bg-[length:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-cyan-300 tracking-wider uppercase font-medium">
                Only AI-Powered Platform in Africa
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="text-white">The AI That </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Makes Power Smarter
              </span>
            </h2>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              While competitors sell generators, we engineer intelligence into them.
              Our AI suite diagnoses issues, designs optimal systems, and optimizes performance
              in real-time — across generators, solar, UPS, and boreholes.
            </p>
          </motion.div>
        </div>

        {/* AI Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {aiTools.map((tool, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link href={tool.link}>
                <div className={`group relative p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-gray-900/60 transition-all duration-300 cursor-pointer h-full`}>
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 bg-gradient-to-br ${tool.color} transition-opacity duration-300 pointer-events-none`} />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{tool.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-3">{tool.name}</h3>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">{tool.desc}</p>

                    <div className="flex items-center text-cyan-400 text-sm font-semibold group-hover:gap-2 transition-all">
                      <span>Try Now</span>
                      <span className="opacity-0 group-hover:opacity-100">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Why This Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-8 md:p-10"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-cyan-400 font-bold mb-2">Better Diagnostics</h4>
              <p className="text-gray-300 text-sm">
                AI identifies issues in minutes that humans take hours to find — reducing downtime and repair costs
              </p>
            </div>
            <div>
              <h4 className="text-cyan-400 font-bold mb-2">Smarter Design</h4>
              <p className="text-gray-300 text-sm">
                3D AI modeling shows exactly how your system will perform before installation — zero surprises
              </p>
            </div>
            <div>
              <h4 className="text-cyan-400 font-bold mb-2">Optimized Performance</h4>
              <p className="text-gray-300 text-sm">
                Real-time intelligence cuts fuel costs by 20-40% through automated load balancing and efficiency tuning
              </p>
            </div>
          </div>
        </motion.div>

        {/* Competitive Positioning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 pt-12 border-t border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Why We're Different From Every Other Power Company
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-3">🔍</div>
              <h4 className="text-white font-bold mb-2">vs Jua Energy (Solar-Only)</h4>
              <p className="text-gray-400 text-sm">
                They sell panels. We design intelligent systems that integrate generators, solar, UPS, and automation with AI optimization.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-3">🌍</div>
              <h4 className="text-white font-bold mb-2">vs Fenix (Battery-Focused)</h4>
              <p className="text-gray-400 text-sm">
                They sell batteries. We design systems that make batteries 40-60% more efficient through AI power management.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-3">📍</div>
              <h4 className="text-white font-bold mb-2">vs All Others (Nairobi-Only)</h4>
              <p className="text-gray-400 text-sm">
                They're in Nairobi. We're in ALL 47 counties with mobile workshop capability and same-day emergency response.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">
            Ready to experience intelligence-powered power solutions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generator-oracle"
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Try Generator Oracle Free
            </Link>
            <Link
              href="/contact?type=ai-consultation"
              className="px-8 py-3 border border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all"
            >
              Get AI System Design
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
