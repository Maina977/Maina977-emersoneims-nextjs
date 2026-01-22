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

      {/* Cinematic Video Showcase Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Hollywood-style gradient overlay background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-4 tracking-wider">
              SEE IT IN ACTION
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Solutions <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">In Motion</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Watch how we deliver world-class power solutions across Kenya and East Africa
            </p>
          </motion.div>

          {/* Cinematic Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Outer glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-50" />
            
            {/* Video wrapper with Hollywood color grading */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10">
              {/* Top cinematic bar */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
              
              {/* Bottom cinematic bar */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
              
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-amber-500/50 rounded-tl-lg z-20 pointer-events-none" />
              <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-amber-500/50 rounded-tr-lg z-20 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-orange-500/50 rounded-bl-lg z-20 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-orange-500/50 rounded-br-lg z-20 pointer-events-none" />
              
              {/* Hollywood color grading overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none mix-blend-color" 
                   style={{ background: 'linear-gradient(135deg, rgba(255,165,0,0.05) 0%, transparent 50%, rgba(0,150,255,0.05) 100%)' }} />
              
              {/* Contrast enhancement overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-10"
                   style={{ background: 'linear-gradient(to bottom, rgba(255,200,100,0.1), transparent, rgba(50,100,150,0.1))' }} />
              
              {/* The Video */}
              <video
                className="w-full aspect-video object-cover"
                controls
                preload="none"
                poster="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
                playsInline
                style={{ filter: 'contrast(1.05) saturate(1.1)' }}
              >
                <source src="/videos/Solution(1).mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video caption */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-slate-400 text-sm">
                <span className="text-amber-400 font-medium">Featured:</span> Complete power solutions installation and commissioning
              </p>
            </motion.div>
          </motion.div>

          {/* Additional video highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: '🎬', label: 'HD Quality', value: '1080p' },
              { icon: '⚡', label: 'Fast Loading', value: 'Optimized' },
              { icon: '🌍', label: 'Projects', value: 'Kenya & EA' },
              { icon: '✅', label: 'Verified', value: 'Real Work' },
            ].map((item, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <div className="text-white font-semibold text-sm">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
