'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const TABS = [
  { id: 'installation', label: '🔧 Installation', color: 'blue' },
  { id: 'vfd', label: '⚡ VFD Systems', color: 'purple' },
  { id: 'maintenance', label: '🛠️ Maintenance', color: 'green' },
  { id: 'faults', label: '⚠️ Troubleshooting', color: 'red' },
  { id: 'sizing', label: '📊 Pump Sizing', color: 'amber' },
];

const PUMP_TYPES = [
  { type: 'Submersible Pump', depth: 'Up to 500m', flow: '1-200 m³/hr', power: '0.5-200kW', application: 'Deep boreholes, standard choice' },
  { type: 'Jet Pump', depth: 'Up to 25m', flow: '1-10 m³/hr', power: '0.5-3kW', application: 'Shallow wells, surface mounted' },
  { type: 'Helical Rotor', depth: 'Up to 150m', flow: '0.5-20 m³/hr', power: '0.5-15kW', application: 'Low yield wells, sandy water' },
  { type: 'Solar Pump', depth: 'Up to 200m', flow: '1-50 m³/hr', power: '1-15kW DC', application: 'Off-grid locations, livestock' },
];

const INSTALLATION_STEPS = [
  { phase: 'Pre-Installation', tasks: ['Review borehole test pumping data', 'Calculate Total Dynamic Head (TDH)', 'Select pump capacity (80% of tested yield)', 'Size cable for <5% voltage drop', 'Verify borehole casing diameter'] },
  { phase: 'Physical Installation', tasks: ['Assemble pump, motor, and cable', 'Install safety rope (stainless steel)', 'Lower pump slowly (max 1m/s)', 'Position pump 2m above screen/bottom', 'Secure wellhead with seal plate'] },
  { phase: 'Electrical', tasks: ['Install control panel with overload', 'Connect VFD if specified', 'Install lightning arrester', 'Ground system properly', 'Install phase monitor (3-phase)'] },
  { phase: 'Commissioning', tasks: ['Measure insulation resistance (>2MΩ)', 'Start pump, verify rotation', 'Measure current vs nameplate', 'Check flow rate and pressure', 'Test protection trip settings'] },
];

const VFD_BENEFITS = [
  { benefit: 'Energy Savings', description: 'Reduce energy consumption 20-50% by running pump at optimal speed', icon: '💰' },
  { benefit: 'Soft Start', description: 'Eliminate water hammer and mechanical stress from hard starts', icon: '🔄' },
  { benefit: 'Constant Pressure', description: 'Maintain constant water pressure regardless of demand', icon: '📊' },
  { benefit: 'Extended Pump Life', description: 'Reduce wear by avoiding frequent starts and full-speed operation', icon: '⏰' },
  { benefit: 'Dry Run Protection', description: 'Detect low current indicating dry running and stop pump', icon: '🛡️' },
  { benefit: 'Multiple Pump Control', description: 'Stage pumps based on demand for maximum efficiency', icon: '⚙️' },
];

const MAINTENANCE_SCHEDULE = [
  { interval: 'Monthly', tasks: ['Check current draw vs baseline', 'Verify flow rate and pressure', 'Inspect wellhead seal', 'Check VFD display for alarms'] },
  { interval: 'Quarterly', tasks: ['Measure insulation resistance', 'Clean control panel', 'Check surge arrester', 'Verify pressure tank pre-charge'] },
  { interval: 'Annually', tasks: ['Full pump performance test', 'Water level measurement', 'Cable insulation test', 'VFD parameter verification'] },
  { interval: 'Every 3-5 Years', tasks: ['Pull pump for inspection', 'Check impeller wear', 'Replace worn seals/bearings', 'Rehabilitate borehole if needed'] },
];

const FAULT_DATABASE = [
  { fault: 'Pump runs but no water', causes: ['Air lock', 'Low water level', 'Impeller worn', 'Check valve stuck'], solution: 'Check water level, prime pump if needed, verify foot valve, inspect impeller.' },
  { fault: 'Reduced flow rate', causes: ['Impeller wear', 'Screen clogging', 'Pipe leak', 'Aquifer decline'], solution: 'Compare to original performance, check for leaks, test water level, may need rehabilitation.' },
  { fault: 'Pump trips on overload', causes: ['Voltage low', 'Mechanical seizure', 'Phase loss', 'Overloaded'], solution: 'Check voltage at pump, verify all 3 phases, measure current, check for sand binding.' },
  { fault: 'VFD fault - Overcurrent', causes: ['Pump seized', 'Cable short', 'Wrong parameters', 'Motor fault'], solution: 'Disconnect motor, test insulation, verify VFD settings match motor.' },
  { fault: 'VFD fault - Ground fault', causes: ['Cable damage', 'Motor winding fault', 'Water ingress'], solution: 'Megger test cable and motor, check cable terminations, may need to pull pump.' },
  { fault: 'Water hammer / surging', causes: ['No VFD', 'Check valve worn', 'Air in system', 'Wrong pump sizing'], solution: 'Install VFD for soft start/stop, replace check valve, install air release valve.' },
];

const SIZING_GUIDE = {
  formula: 'TDH = Static Level + Drawdown + Friction Loss + Delivery Head + 10%',
  factors: [
    { factor: 'Static Water Level', description: 'Depth from surface to resting water level' },
    { factor: 'Drawdown', description: 'Water level drop during pumping (from test data)' },
    { factor: 'Friction Loss', description: 'Pipe friction based on flow, diameter, length' },
    { factor: 'Delivery Head', description: 'Height above ground to tank + tank pressure' },
  ],
  powerFormula: 'Power (kW) = (Flow m³/hr × TDH m × 9.81) ÷ (3600 × Efficiency)',
};

export default function BoreholePumpsHub() {
  const [activeTab, setActiveTab] = useState('installation');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="bg-black min-h-screen">
      {/* Cinematic Hero Section with Hollywood Color Grading */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {/* Background Image with Cinematic Scale */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <Image
            src="/images/16.png"
            alt="Borehole Pump Systems"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          {/* Hollywood Cinematic Color Grading Overlays */}
          {/* Teal/Blue Color Grade - Water & Depth Theme */}
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(0, 50, 100, 0.35) 0%, rgba(0, 180, 200, 0.2) 100%)' }} />

          {/* Deep Contrast Enhancement */}
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)' }} />

          {/* Deep Blue Shadow Tint - Aquatic Cinematic Feel */}
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(to bottom, rgba(0, 20, 50, 0.5) 0%, rgba(0, 30, 40, 0.4) 100%)' }} />

          {/* Cool Cyan Highlight Push - Water Reflection */}
          <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(0, 180, 220, 0.3) 0%, transparent 60%)' }} />

          {/* Film Grain Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette Effect */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Cinematic Letterbox Gradient - Top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />

          {/* Cinematic Letterbox Gradient - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        {/* Animated Water Shimmer Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(0, 200, 255, 0.12) 50%, transparent 60%)' }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
          style={{ opacity: heroOpacity, y: textY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-5xl"
          >
            {/* Cinematic Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">Water Solutions Experts</span>
            </motion.div>

            {/* Main Title with Cinematic Typography */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                Borehole Pump
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed"
            >
              Complete guide to borehole pump installation, VFD systems, maintenance, and troubleshooting.
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
              <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-cyan-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cinematic Anamorphic Lens Flare */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-sm" />
      </section>

      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'installation' && (
            <motion.div key="installation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Pump Installation Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Professional borehole pump installation for reliable water supply.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {PUMP_TYPES.map((pump) => (
                  <div key={pump.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-blue-500/30 p-4">
                    <h3 className="text-lg font-bold text-blue-400 mb-3">{pump.type}</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-400">Depth:</span> <span className="text-white">{pump.depth}</span></div>
                      <div><span className="text-gray-400">Flow:</span> <span className="text-white">{pump.flow}</span></div>
                      <div><span className="text-gray-400">Power:</span> <span className="text-white">{pump.power}</span></div>
                      <p className="text-gray-400 text-xs pt-2 border-t border-white/10">{pump.application}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {INSTALLATION_STEPS.map((phase) => (
                  <div key={phase.phase} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-blue-500/30 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">{phase.phase}</h3>
                    <ul className="space-y-2">
                      {phase.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-blue-400">✓</span>{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'vfd' && (
            <motion.div key="vfd" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">VFD Systems for Pumps</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Variable Frequency Drives optimize pump performance and save energy.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VFD_BENEFITS.map((item) => (
                  <div key={item.benefit} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 p-6">
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">{item.benefit}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">VFD Sizing Rule</h3>
                <p className="text-white text-lg">VFD kW rating = Motor kW × 1.2 (20% safety margin)</p>
                <p className="text-gray-400 mt-4">Match VFD voltage and phases to motor. Use submersible-rated VFD or output filter for long cable runs.</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Maintenance Schedules</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Regular maintenance ensures long pump life and reliable operation.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MAINTENANCE_SCHEDULE.map((schedule) => (
                  <div key={schedule.interval} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-green-500/30 p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">{schedule.interval}</h3>
                    <ul className="space-y-2">
                      {schedule.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Troubleshooting Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Diagnose and solve common borehole pump problems.</p>
              </div>
              <div className="space-y-4">
                {FAULT_DATABASE.map((fault) => (
                  <div key={fault.fault} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden">
                    <button onClick={() => setExpandedFault(expandedFault === fault.fault ? null : fault.fault)} className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5">
                      <span className="text-white font-medium">{fault.fault}</span>
                      <span className="text-gray-400">▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedFault === fault.fault && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden">
                          <div className="p-6 space-y-4">
                            <div>
                              <h4 className="text-amber-400 font-bold mb-2">Possible Causes:</h4>
                              <div className="flex flex-wrap gap-2">
                                {fault.causes.map((c, i) => (
                                  <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{c}</span>
                                ))}
                              </div>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                              <h4 className="text-green-400 font-bold mb-2">✅ Solution</h4>
                              <p className="text-gray-300 text-sm">{fault.solution}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'sizing' && (
            <motion.div key="sizing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Pump Sizing Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Calculate the right pump for your borehole.</p>
              </div>
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border border-amber-500/30">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">Total Dynamic Head (TDH) Formula</h3>
                <div className="bg-black/30 rounded-lg p-6 mb-6">
                  <p className="text-white font-mono text-lg">{SIZING_GUIDE.formula}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {SIZING_GUIDE.factors.map((f) => (
                    <div key={f.factor} className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-amber-400 font-bold">{f.factor}</h4>
                      <p className="text-gray-300 text-sm">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">Power Calculation</h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <p className="text-white font-mono text-lg">{SIZING_GUIDE.powerFormula}</p>
                  <p className="text-gray-400 mt-4 text-sm">Typical pump efficiency: 50-70%. Use manufacturer curves for accurate selection.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-3xl p-8 md:p-12 border border-blue-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Borehole Pump Services?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Installation, VFD setup, maintenance, and repair services for all borehole pump systems.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
