'use client';

import SectionLead from "../components/generators/SectionLead";
import Link from "next/link";
import { motion } from "framer-motion";
import UnifiedCTA, { CTASection } from "@/components/cta/UnifiedCTA";

const SOLUTIONS_LINKS = [
  { href: "/solutions/generators", label: "Diesel generators", icon: "⚡", description: "Troubleshooting & maintenance" },
  { href: "/solutions/controls", label: "Controls (DeepSea & PowerWizard)", icon: "🎛️", description: "Configuration & monitoring" },
  { href: "/solutions/solar", label: "Solar technical issues", icon: "☀️", description: "Panel diagnostics & optimization" },
  { href: "/solutions/solar-sizing", label: "Solar sizing", icon: "📐", description: "System design & calculations" },
  { href: "/solutions/power-interruptions", label: "Power interruptions", icon: "🔌", description: "Backup & UPS solutions" },
  { href: "/solutions/ac", label: "AC systems", icon: "❄️", description: "HVAC diagnostics & repair" },
  { href: "/solutions/ups", label: "UPS systems", icon: "🔋", description: "Battery backup solutions" },
  { href: "/solutions/diesel-automation", label: "Diesel automation", icon: "🤖", description: "Auto-start & remote control" },
  { href: "/solutions/borehole-pumps", label: "Borehole pumps", icon: "💧", description: "Water system solutions" },
  { href: "/solutions/incinerators", label: "Incinerators", icon: "🔥", description: "Waste management systems" },
  { href: "/solutions/motors", label: "Motors & rewinding", icon: "⚙️", description: "Motor repair & services" },
] as const;

export default function SolutionsHome() {
  return (
    <main className="bg-black min-h-screen">
      <SectionLead
        title="Solutions: your engineering bible"
        subtitle="Authoritative guides for diesel generators, controls, solar, power quality, AC, UPS, automation, pumps, incinerators, and motors."
      />

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS_LINKS.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <Link
                href={link.href}
                prefetch
                className="group relative block p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-black/80 to-gray-900/40 hover:border-amber-500/30 transition-all duration-500 overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-500/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                    {link.label}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                    {link.description}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center gap-2 text-amber-500/50 group-hover:text-amber-400 transition-colors duration-300">
                    <span className="text-sm">Learn more</span>
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <UnifiedCTA action="consultation" size="lg" label="Talk to an Expert" />
          <UnifiedCTA action="diagnostic" variant="secondary" size="lg" label="Try Diagnostic Suite" />
        </motion.div>
      </section>
      
      {/* Apple-style clean CTA section */}
      <CTASection 
        title="Need Help Choosing?"
        subtitle="Our engineering team can help you find the right solution for your power needs."
        primaryAction="site-survey"
        secondaryAction="get-quote"
      />
    </main>
  );
}
