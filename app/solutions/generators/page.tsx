'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import SectionLead from "@/app/components/generators/SectionLead";
import UnifiedCTA from "@/components/cta/UnifiedCTA";
import Link from 'next/link';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import GeneratorTroubleshootingDeepDive from '@/components/solutions/GeneratorTroubleshootingDeepDive';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
import SafetyChecksWithdrawnNotice from '@/components/safety/SafetyChecksWithdrawnNotice';

/** Shown under a withdrawn block so the reader is never left at a dead end. */
function EngineerCallCard() {
  return (
    <div className="max-w-3xl mx-auto text-center bg-white/5 border border-white/10 rounded-xl p-6">
      <p className="text-gray-300 mb-4">Talk to one of our engineers about the fault.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href="tel:+254768860665" className="px-6 py-3 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-colors">
          Call +254 768 860 665
        </a>
        <a
          href="https://wa.me/254768860665"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors"
        >
          WhatsApp an engineer
        </a>
      </div>
    </div>
  );
}

// =====================================================
// COMPREHENSIVE DIESEL GENERATOR SOLUTIONS HUB
// The most detailed generator troubleshooting guide in East Africa
// =====================================================

const SOLUTION_CATEGORIES = [
  { id: 'installation', label: '🔧 Installation', color: 'amber' },
  { id: 'maintenance', label: '🛠️ Maintenance', color: 'green' },
  { id: 'faults', label: '⚠️ Faults &amp; Solutions', color: 'red' },
  { id: 'repairs', label: '🔩 Repairs', color: 'blue' },
  { id: 'controls', label: '🎛️ Control Systems', color: 'purple' },
];

// INSTALLATION GUIDES
const INSTALLATION_GUIDES = [
  {
    title: 'Site Preparation &amp; Foundation',
    icon: '🏗️',
    steps: [
      { step: 'Survey the installation site for proper ventilation (minimum 1.5m clearance all sides)', critical: true },
      { step: 'Calculate foundation requirements: Mass = 2× Generator weight minimum', critical: true },
      { step: 'Ensure concrete curing time: 28 days for full strength, 7 days minimum', critical: false },
      { step: 'Install anti-vibration mounts (AVM) - spring or rubber isolators based on RPM', critical: true },
      { step: 'Verify floor load capacity: Typically 500-1500 kg/m² for generators', critical: false },
      { step: 'Plan exhaust routing: Maximum 3 bends, proper rain cap, thermal expansion allowance', critical: true },
    ],
    proTip: 'Foundation mass should be 2-5× the generator weight. For 500kVA (3,500kg), foundation should be 7,000-17,500kg concrete.',
  },
  {
    title: 'Electrical Connections',
    icon: '⚡',
    steps: [
      { step: 'Size cables using IEE regulations: I = P/(√3 × V × PF × Eff) for 3-phase', critical: true },
      { step: 'Install properly rated circuit breakers: MCCB at generator, ACB at main panel', critical: true },
      { step: 'Connect neutral-earth bond at ONE point only (generator or main panel)', critical: true },
      { step: 'Verify phase sequence (R-Y-B) using phase rotation meter before paralleling', critical: true },
      { step: 'Install surge protection devices (SPD) Type 1+2 at generator output', critical: false },
    ],
    proTip: 'Cable sizing formula: Cross-section (mm²) = (1.732 × I × L × ρ) / (ΔV × 1000) where ρ=0.0175 for copper.',
  },
  {
    title: 'Fuel System Installation',
    icon: '⛽',
    steps: [
      { step: 'Install day tank within 3m of generator, main tank within 30m maximum', critical: false },
      { step: 'Size fuel lines: Minimum 10mm ID for up to 100kVA, 15mm for up to 500kVA', critical: true },
      { step: 'Install fuel water separator and primary filter before engine fuel filter', critical: true },
      { step: 'Ensure return line is larger than supply (prevents vapor lock)', critical: true },
      { step: 'Install emergency fuel shutoff valve accessible from outside generator room', critical: true },
      { step: 'Test fuel system: Prime, check for leaks, verify fuel lift pump pressure per the OEM manual for your model', critical: true },
    ],
    proTip: 'Fuel consumption estimate: 0.25-0.30 liters per kWh. A 200kVA @ 80% load ≈ 40 liters/hour.',
  },
  {
    title: 'Cooling System Setup',
    icon: '❄️',
    steps: [
      { step: 'Calculate radiator airflow: Minimum 8-12 m³/min per 100kW for air-cooled', critical: true },
      { step: 'Install remote radiator if needed: Max head 15m, use glycol mix 30-50%', critical: false },
      { step: 'Size ventilation openings: Intake = 0.5 × radiator area, Exhaust = 1.5 × radiator area', critical: true },
      { step: 'Install motorized louvers with generator start interlock', critical: false },
      { step: 'Fill coolant: 50% water + 50% ethylene glycol, add DCA4 additive', critical: true },
    ],
    proTip: 'Calculate: Heat rejection (kW) = Rated Power × 0.3 for cooling needs.',
  },
  {
    title: 'Exhaust System Installation',
    icon: '💨',
    steps: [
      { step: 'Size exhaust pipe: Minimum equal to engine exhaust outlet, larger for long runs', critical: true },
      { step: 'Install flexible connector at engine to absorb vibration (stainless bellows)', critical: true },
      { step: 'Support exhaust every 1.5-2m, allow for thermal expansion (10mm per 3m)', critical: true },
      { step: 'Install rain cap and spark arrestor (required for enclosed areas)', critical: false },
      { step: 'Wrap exhaust with insulation in occupied areas (surface temp &lt;60°C)', critical: false },
    ],
    proTip: 'Excessive backpressure causes: Power loss (1% per 0.25 kPa over limit), increased fuel consumption, engine damage.',
  },
  {
    title: 'Control Panel &amp; ATS Installation',
    icon: '🎛️',
    steps: [
      { step: 'Mount control panel at eye level, protected from vibration and moisture', critical: false },
      { step: 'Wire all sensors: Oil pressure, water temp, fuel level, battery voltage, RPM pickup', critical: true },
      { step: 'Test emergency stop circuit: Must stop engine and disable start', critical: true },
      { step: 'Commission remote monitoring if required: GSM, Ethernet, Modbus', critical: false },
    ],
    proTip: 'DeepSea &amp; PowerWizard controllers: Always backup configuration before commissioning. Use PC software for parameter changes.',
  },
];

// MAINTENANCE SCHEDULES
const MAINTENANCE_SCHEDULES = [
  {
    interval: 'Daily Checks',
    icon: '📋',
    color: 'green',
    tasks: [
      { task: 'Check engine oil level (between L and H marks when cold)', time: '2 min' },
      { task: 'Inspect coolant level in expansion tank (should be visible)', time: '1 min' },
      { task: 'Verify fuel level - minimum 1/4 tank for standby units', time: '1 min' },
      { task: 'Check for leaks: Oil, fuel, coolant under and around generator', time: '3 min' },
      { task: 'Inspect battery terminals for corrosion, verify voltage per the OEM manual for your model', time: '2 min' },
      { task: 'Review control panel for active alarms or warning lights', time: '1 min' },
      { task: 'Check air filter restriction indicator (if equipped)', time: '1 min' },
    ],
    totalTime: '10-15 minutes',
  },
  {
    interval: 'Weekly Checks',
    icon: '📅',
    color: 'blue',
    tasks: [
      { task: 'Run generator for 30 minutes under 50%+ load (prevents wet stacking)', time: '30 min' },
      { task: 'Check belt tension per the OEM manual for your model', time: '3 min' },
      { task: 'Inspect exhaust system for leaks (white residue indicates leak)', time: '3 min' },
      { task: 'Test battery charger output per the OEM manual for your model', time: '2 min' },
      { task: 'Check fuel water separator, drain if necessary', time: '3 min' },
      { task: 'Verify ATS operation: Simulate mains fail, confirm auto-start', time: '5 min' },
      { task: 'Log all meter readings: Hours, kWh, starts, last service', time: '2 min' },
    ],
    totalTime: '45-60 minutes',
  },
  {
    interval: '250 Hours / 6 Months',
    icon: '🔧',
    color: 'amber',
    tasks: [
      { task: 'Change engine oil (use OEM spec: 15W-40 CI-4 or CJ-4 typically)', time: '30 min' },
      { task: 'Replace oil filter', time: '10 min' },
      { task: 'Replace fuel filter(s) - primary and secondary', time: '20 min' },
      { task: 'Clean/replace air filter element', time: '15 min' },
      { task: 'Check and adjust valve clearances (if due per OEM)', time: '60 min' },
      { task: 'Inspect and clean battery terminals, apply dielectric grease', time: '10 min' },
      { task: 'Test coolant concentration and condition (refractometer)', time: '10 min' },
      { task: 'Check all hose clamps and connections', time: '15 min' },
    ],
    totalTime: '3-4 hours',
    parts: ['Engine oil (15-30L)', 'Oil filter', 'Fuel filters (2)', 'Air filter'],
  },
  {
    interval: '500 Hours / 12 Months',
    icon: '⚙️',
    color: 'orange',
    tasks: [
      { task: 'All 250-hour service items PLUS:', time: '-' },
      { task: 'Replace coolant and flush system', time: '60 min' },
      { task: 'Inspect alternator bearings and brushes (if applicable)', time: '30 min' },
      { task: 'Check injector spray pattern (requires specialized equipment)', time: '45 min' },
      { task: 'Test and calibrate protection relays', time: '30 min' },
      { task: 'Perform load bank test at 100% for 2 hours', time: '120 min' },
      { task: 'Inspect turbocharger for shaft play and oil leaks', time: '20 min' },
      { task: 'Test block heater operation', time: '10 min' },
    ],
    totalTime: '6-8 hours',
    parts: ['Coolant 50L', 'DCA4 additive', 'Belts', 'Thermostat (if needed)'],
  },
  {
    interval: '2000 Hours / 3 Years',
    icon: '🔩',
    color: 'red',
    tasks: [
      { task: 'Complete top-end overhaul assessment', time: '120 min' },
      { task: 'Replace all belts (fan, alternator, water pump)', time: '45 min' },
      { task: 'Replace water pump (preventive)', time: '90 min' },
      { task: 'Inspect/replace injectors', time: '120 min' },
      { task: 'Test compression across all cylinders (limits per the OEM manual for your model)', time: '60 min' },
      { task: 'Overhaul or replace starting motor and alternator', time: '120 min' },
      { task: 'Replace all coolant hoses', time: '60 min' },
      { task: 'Calibrate governor and fuel system', time: '60 min' },
      { task: 'Replace batteries (typical life 3-5 years)', time: '30 min' },
    ],
    totalTime: '2-3 days',
    parts: ['Major service kit', 'Batteries', 'Water pump', 'Injectors', 'Belts', 'Hoses'],
  },
];

// FAULTS AND SOLUTIONS DATABASE
// Content-safety withdrawal 2026-11-25: every other fault entry (14 of 15)
// is withdrawn until corrected and independently reviewed; the Faults tab
// shows SafetyChecksWithdrawnNotice in their place.
const FAULTS_DATABASE = [
  {
    category: 'Running Problems',
    icon: '⚡',
    faults: [
      {
        symptom: 'Excessive black smoke',
        possibleCauses: [
          'Air filter blocked',
          'Overloading',
          'Injector problems (worn nozzles)',
          'Turbocharger issues',
          'Incorrect timing',
          'Low compression',
        ],
        diagnosticSteps: [
          'Check air filter restriction indicator',
          'Monitor actual load vs rated capacity',
          'Inspect turbo: Spin freely? Oil leaks?',
          'Check injector spray pattern',
          'Verify timing marks alignment',
        ],
        solution: 'Black smoke = too much fuel or not enough air. Start with air filter. If clean, check turbo boost pressure. Worn injectors cause poor atomization leading to incomplete combustion.',
        severity: 'medium',
        estimatedRepairTime: '30 min - 6 hours',
      },
    ],
  },
];

// REPAIR PROCEDURES: all five withdrawn (content-safety withdrawal 2026-11-25).
// The Repairs tab shows SafetyChecksWithdrawnNotice and the engineer call.

export default function GeneratorsSolutionHub() {
  const [activeCategory, setActiveCategory] = useState('installation');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);

  return (
    <div className="bg-black min-h-screen">
      <B2BCommercialBand profile={B2B_PROFILES.solutionsGenerators} />
      {/* CINEMATIC HERO SECTION - Hollywood Color Graded */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Hero Image with Cinematic Treatment */}
        <div className="absolute inset-0">
          <Image
            src="/images/70.png"
            alt="Industrial Diesel Generator Solutions - EmersonEIMS Kenya"
            fill
            priority
            className="object-cover object-center"
            style={{
              filter: 'contrast(1.12) saturate(1.2) brightness(0.95) sepia(0.08)',
            }}
            sizes="100vw"
          />
        </div>

        {/* Hollywood Orange/Teal Color Grade Overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(180deg, rgba(255,140,80,0.1) 0%, transparent 40%, rgba(0,80,120,0.15) 100%)',
          }}
        />

        {/* Cinematic Vignette */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Bottom Gradient for Content Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-[3]" />

        {/* Anamorphic Lens Flare */}
        <motion.div
          className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent z-[4]"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scaleX: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hero Content */}
        <div className="absolute inset-0 z-[5] flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-16 md:pb-24 w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 backdrop-blur-sm"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-amber-300 tracking-wider uppercase font-medium">Complete Technical Resource</span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Generator
                <span className="block text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text">
                  Solutions Hub
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed mb-8">
                Installation guides, maintenance schedules, fault diagnosis, and repair procedures.
                <span className="text-amber-400 font-medium"> Detailed generator resource in East Africa.</span>
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-amber-500">✓</span>
                  <span>50+ Fault Codes</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-amber-500">✓</span>
                  <span>Detailed Procedures</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-amber-500">✓</span>
                  <span>Expert Technicians</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[6]"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center pt-2">
              <motion.div
                className="w-1 h-2 bg-amber-400 rounded-full"
                animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Corner Brackets - Cinematic Frame */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-amber-500/40 z-[6] hidden md:block" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-amber-500/40 z-[6] hidden md:block" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-amber-500/40 z-[6] hidden md:block" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-amber-500/40 z-[6] hidden md:block" />
      </section>

      <SectionLead
        title="Diesel Generator Solutions Hub"
        subtitle="Detailed generator troubleshooting, installation, maintenance &amp; repair guide in East Africa. No one else provides this depth of technical knowledge."
      />

      {/* Category Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {SOLUTION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {/* INSTALLATION SECTION */}
          {activeCategory === 'installation' && (
            <motion.div
              key="installation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Generator Installation Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Complete step-by-step installation procedures from site preparation to commissioning. 
                  Following these guidelines ensures safe, reliable operation and warranty compliance.
                </p>
              </div>

              {INSTALLATION_GUIDES.map((guide, idx) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-amber-500/20 overflow-hidden"
                >
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{guide.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{guide.title}</h3>
                        <p className="text-amber-400 text-sm">Step {idx + 1} of {INSTALLATION_GUIDES.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIdx) => (
                        <div 
                          key={stepIdx}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            step.critical ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.critical ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'
                          }`}>
                            {stepIdx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm">{step.step}</p>
                            {step.critical && (
                              <span className="text-red-400 text-xs mt-1 block">⚠️ Critical Step - Do not skip</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      <p className="text-amber-400 text-sm">
                        <strong>💡 Pro Tip:</strong> {guide.proTip}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* MAINTENANCE SECTION */}
          {activeCategory === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Maintenance Schedules &amp; Checklists</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Preventive maintenance is the key to generator reliability. Follow these OEM-based schedules 
                  to maximize lifespan and minimize unexpected failures.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MAINTENANCE_SCHEDULES.map((schedule, idx) => (
                  <motion.div
                    key={schedule.interval}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/20 overflow-hidden"
                  >
                    <div className={`p-4 border-b border-white/10 ${
                      schedule.color === 'green' ? 'bg-green-500/20' :
                      schedule.color === 'blue' ? 'bg-blue-500/20' :
                      schedule.color === 'amber' ? 'bg-amber-500/20' :
                      schedule.color === 'orange' ? 'bg-orange-500/20' :
                      'bg-red-500/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{schedule.icon}</span>
                        <span className={`font-bold ${
                          schedule.color === 'green' ? 'text-green-400' :
                          schedule.color === 'blue' ? 'text-blue-400' :
                          schedule.color === 'amber' ? 'text-amber-400' :
                          schedule.color === 'orange' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>{schedule.totalTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-2">{schedule.interval}</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {schedule.tasks.map((task, taskIdx) => (
                          <div key={taskIdx} className="flex items-start gap-2 text-sm">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <span className="text-gray-300 flex-1">{task.task}</span>
                            <span className="text-gray-500 text-xs">{task.time}</span>
                          </div>
                        ))}
                      </div>
                      {schedule.parts && (
                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                          <p className="text-gray-400 text-xs font-medium mb-2">Required Parts:</p>
                          <p className="text-gray-300 text-xs">{schedule.parts.join(' • ')}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Maintenance Tips */}
              <div className="mt-12 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-2xl p-8 border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-6">🔑 Key Maintenance Principles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🛢️</span>
                      <div>
                        <h4 className="text-white font-bold">Oil is Lifeblood</h4>
                        <p className="text-gray-400 text-sm">Check daily. Change religiously. Use correct grade only. Oil analysis can predict problems before failure.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⛽</span>
                      <div>
                        <h4 className="text-white font-bold">Fuel Quality Matters</h4>
                        <p className="text-gray-400 text-sm">Water is the enemy. Contaminated fuel causes 80% of injector failures. Test and polish regularly.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🌡️</span>
                      <div>
                        <h4 className="text-white font-bold">Temperature Control</h4>
                        <p className="text-gray-400 text-sm">Overheating causes 60% of engine failures. Check coolant, thermostat, and airflow regularly.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🔋</span>
                      <div>
                        <h4 className="text-white font-bold">Battery Reliability</h4>
                        <p className="text-gray-400 text-sm">Dead battery = generator won&apos;t start when you need it most. Test monthly, replace every 3-4 years.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FAULTS & SOLUTIONS SECTION */}
          {activeCategory === 'faults' && (
            <motion.div
              key="faults"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Fault Diagnosis &amp; Solutions</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Click on a fault to see its likely causes, checks and solution.
                </p>
              </div>

              {FAULTS_DATABASE.map((category) => (
                <div key={category.category} className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3 sticky top-20 bg-black py-4 z-40">
                    <span className="text-2xl">{category.icon}</span>
                    {category.category}
                  </h3>
                  
                  {category.faults.map((fault, faultIdx) => (
                    <motion.div
                      key={fault.symptom}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: faultIdx * 0.1 }}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFault(expandedFault === fault.symptom ? null : fault.symptom)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            fault.severity === 'critical' ? 'bg-red-500 text-white' :
                            fault.severity === 'high' ? 'bg-orange-500 text-white' :
                            'bg-yellow-500 text-black'
                          }`}>
                            {fault.severity.toUpperCase()}
                          </span>
                          <span className="text-white font-medium">{fault.symptom}</span>
                        </div>
                        <motion.span
                          animate={{ rotate: expandedFault === fault.symptom ? 180 : 0 }}
                          className="text-gray-400"
                        >
                          ▼
                        </motion.span>
                      </button>
                      
                      <AnimatePresence>
                        {expandedFault === fault.symptom && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/10"
                          >
                            <div className="p-6 space-y-6">
                              {/* Possible Causes */}
                              <div>
                                <h4 className="text-amber-400 font-bold mb-3">🔍 Possible Causes</h4>
                                <div className="grid md:grid-cols-2 gap-2">
                                  {fault.possibleCauses.map((cause, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                      <span className="text-amber-500">•</span>
                                      <span className="text-gray-300">{cause}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Diagnostic Steps */}
                              <div>
                                <h4 className="text-cyan-400 font-bold mb-3">🔧 Diagnostic Steps</h4>
                                <div className="space-y-2">
                                  {fault.diagnosticSteps.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                      </span>
                                      <span className="text-gray-300 text-sm">{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Solution */}
                              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <h4 className="text-green-400 font-bold mb-2">✅ Solution</h4>
                                <p className="text-gray-300 text-sm">{fault.solution}</p>
                              </div>

                              {/* Meta Info */}
                              <div className="flex items-center gap-6 text-sm text-gray-400">
                                <span>⏱️ Estimated repair time: <strong className="text-white">{fault.estimatedRepairTime}</strong></span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ))}

              {/* The other fault guides are withdrawn (content-safety withdrawal 2026-11-25). */}
              <SafetyChecksWithdrawnNotice surface="solutions-generators-faults" />
              <EngineerCallCard />
            </motion.div>
          )}

          {/* REPAIRS SECTION: procedures withdrawn (content-safety withdrawal 2026-11-25) */}
          {activeCategory === 'repairs' && (
            <motion.div
              key="repairs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Repair Procedures</h2>
              </div>
              <SafetyChecksWithdrawnNotice surface="solutions-generators-repairs" className="max-w-3xl mx-auto" />
              <EngineerCallCard />
            </motion.div>
          )}

          {/* CONTROLS SECTION */}
          {activeCategory === 'controls' && (
            <motion.div
              key="controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Control Systems Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  For comprehensive DeepSea and PowerWizard programming, configuration, and troubleshooting, 
                  visit our dedicated Controls Solutions Hub.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/services/ats-changeover" className="group">
                  <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl border border-purple-500/30 p-8 hover:border-purple-400 transition-all duration-300">
                    <span className="text-5xl block mb-4">🎛️</span>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">DeepSea &amp; PowerWizard</h3>
                    <p className="text-gray-400 mb-4">Complete configuration, fault codes, parameter settings, and communication setup for all DSE and PowerWizard controllers.</p>
                    <span className="text-purple-400 font-medium">Explore Control Systems →</span>
                  </div>
                </Link>
                
                <Link href="/solutions/diesel-automation" className="group">
                  <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-2xl border border-cyan-500/30 p-8 hover:border-cyan-400 transition-all duration-300">
                    <span className="text-5xl block mb-4">🤖</span>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Diesel Automation</h3>
                    <p className="text-gray-400 mb-4">AMF panels, auto-start systems, remote monitoring, load sharing, and synchronization configurations.</p>
                    <span className="text-cyan-400 font-medium">Explore Automation →</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ENGINEERING REFERENCE — generator fault diagnosis */}
      <GeneratorTroubleshootingDeepDive />

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-3xl p-8 md:p-12 border border-amber-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Expert Help?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Our team of certified generator technicians is available 24/7 for emergency repairs, 
            scheduled maintenance, and technical consultations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Schedule Site Visit" />
          </div>
        </div>
      </section>
    </div>
  );
}
