'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLead from "../../components/generators/SectionLead";
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const TABS = [
  { id: 'power-quality', label: '⚡ Power Quality', color: 'blue' },
  { id: 'surge-protection', label: '🛡️ Surge Protection', color: 'amber' },
  { id: 'voltage-issues', label: '📉 Voltage Issues', color: 'red' },
  { id: 'solutions', label: '✅ Solutions', color: 'green' },
  { id: 'equipment', label: '🔧 Equipment Guide', color: 'purple' },
];

const POWER_PROBLEMS = [
  { name: 'Voltage Sag/Brownout', description: 'Voltage drop below 90% for >1 cycle', cause: 'Heavy load starts, utility problems', impact: 'Equipment shutdown, data loss', icon: '📉' },
  { name: 'Voltage Surge', description: 'Voltage spike above 110% for >1 cycle', cause: 'Load switching, lightning', impact: 'Component damage, fires', icon: '📈' },
  { name: 'Transient/Spike', description: 'Microsecond high-voltage spike', cause: 'Lightning, switching', impact: 'Electronic damage, data corruption', icon: '⚡' },
  { name: 'Harmonics', description: 'Distorted waveform from non-linear loads', cause: 'VFDs, computers, LED lights', impact: 'Overheating, false trips', icon: '〰️' },
  { name: 'Frequency Variation', description: 'Deviation from 50Hz standard', cause: 'Generator problems, grid instability', impact: 'Motor speed changes, clock drift', icon: '🔄' },
  { name: 'Electrical Noise', description: 'High-frequency interference on power line', cause: 'Motors, radio transmitters', impact: 'Data errors, equipment malfunction', icon: '📻' },
];

const SURGE_PROTECTION_TYPES = [
  { type: 'Type 1 (Main Panel)', rating: '50-200 kA', location: 'Main service entrance', protects: 'Whole building from direct lightning', cost: 'KES 25,000-100,000' },
  { type: 'Type 2 (Sub-Panel)', rating: '20-80 kA', location: 'Distribution boards', protects: 'Branch circuits, equipment', cost: 'KES 15,000-50,000' },
  { type: 'Type 3 (Point of Use)', rating: '3-15 kA', location: 'At equipment', protects: 'Sensitive electronics', cost: 'KES 3,000-15,000' },
];

const VOLTAGE_ISSUES = [
  { problem: 'Undervoltage (<200V)', symptoms: ['Lights dim', 'Motors overheat', 'Appliances fail to start', 'Compressors trip'], solutions: ['Install AVR/voltage stabilizer', 'Check for undersized cables', 'Report to utility', 'Upgrade transformer tap'] },
  { problem: 'Overvoltage (>250V)', symptoms: ['Lights very bright', 'Electronics burn out', 'Motors run hot', 'Premature bulb failure'], solutions: ['Install AVR/stabilizer', 'Check transformer tap setting', 'Install buck transformer', 'Report to utility'] },
  { problem: 'Voltage Imbalance', symptoms: ['3-phase motor vibration', 'Phase overheating', 'Reduced motor torque', 'Premature bearing failure'], solutions: ['Balance loads across phases', 'Check for open neutral', 'Install phase balancer', 'Report to utility'] },
];

const SOLUTION_EQUIPMENT = [
  { name: 'AVR (Automatic Voltage Regulator)', function: 'Maintains stable output voltage', input: '160-280V', output: '220V ±3%', capacity: '500VA-500kVA', best: 'General voltage stabilization' },
  { name: 'Online UPS', function: 'Complete power conditioning + backup', input: 'Any (regenerates)', output: 'Pure sine wave', capacity: '1-500kVA', best: 'Critical electronics, data centers' },
  { name: 'Line Interactive UPS', function: 'AVR + battery backup', input: '165-280V', output: '220V regulated', capacity: '500VA-10kVA', best: 'Computers, small servers' },
  { name: 'Isolation Transformer', function: 'Noise filtering, safety isolation', input: 'Any', output: 'Clean isolated power', capacity: '500VA-500kVA', best: 'Medical equipment, sensitive instruments' },
  { name: 'Active Harmonic Filter', function: 'Cancels harmonic distortion', input: 'Distorted', output: 'Clean sine wave', capacity: '25-1000A', best: 'VFD installations, industrial' },
];

export default function PowerInterruptionsHub() {
  const [activeTab, setActiveTab] = useState('power-quality');
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  return (
    <main className="bg-black min-h-screen">
      <SectionLead
        title="Power Interruptions Solutions"
        subtitle="Comprehensive guide to power quality problems, surge protection, and voltage issues. Protect your equipment and operations."
      />

      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'power-quality' && (
            <motion.div key="power-quality" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Power Quality Problems</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Understanding power problems is the first step to protecting your equipment.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {POWER_PROBLEMS.map((problem) => (
                  <div key={problem.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-blue-500/30 p-6">
                    <div className="text-4xl mb-4">{problem.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{problem.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{problem.description}</p>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-amber-400">Cause:</span> <span className="text-gray-300">{problem.cause}</span></div>
                      <div><span className="text-red-400">Impact:</span> <span className="text-gray-300">{problem.impact}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'surge-protection' && (
            <motion.div key="surge-protection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Surge Protection Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Layered surge protection provides comprehensive defense against voltage spikes.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {SURGE_PROTECTION_TYPES.map((spd) => (
                  <div key={spd.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-amber-500/30 p-6">
                    <h3 className="text-lg font-bold text-amber-400 mb-4">{spd.type}</h3>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-gray-400">Rating:</span> <span className="text-white font-bold">{spd.rating}</span></div>
                      <div><span className="text-gray-400">Location:</span> <span className="text-gray-300">{spd.location}</span></div>
                      <div><span className="text-gray-400">Protects:</span> <span className="text-gray-300">{spd.protects}</span></div>
                      <div><span className="text-gray-400">Cost Range:</span> <span className="text-green-400">{spd.cost}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border border-amber-500/30">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">🛡️ Best Practice: Cascaded Protection</h3>
                <div className="text-gray-300 space-y-2">
                  <p><strong>Level 1:</strong> Type 1 SPD at main panel (catches large surges)</p>
                  <p><strong>Level 2:</strong> Type 2 SPD at distribution boards (catches medium surges)</p>
                  <p><strong>Level 3:</strong> Type 3 SPD at critical equipment (catches remaining surges)</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'voltage-issues' && (
            <motion.div key="voltage-issues" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Voltage Issues & Solutions</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Identify voltage problems and implement the right solutions.</p>
              </div>
              <div className="space-y-4">
                {VOLTAGE_ISSUES.map((issue) => (
                  <div key={issue.problem} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden">
                    <button onClick={() => setExpandedIssue(expandedIssue === issue.problem ? null : issue.problem)} className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5">
                      <span className="text-white font-bold text-lg">{issue.problem}</span>
                      <span className="text-gray-400">▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedIssue === issue.problem && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden">
                          <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-red-400 font-bold mb-3">Symptoms:</h4>
                              <ul className="space-y-2">
                                {issue.symptoms.map((s, i) => (
                                  <li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-red-400">⚠</span> {s}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-green-400 font-bold mb-3">Solutions:</h4>
                              <ul className="space-y-2">
                                {issue.solutions.map((s, i) => (
                                  <li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span> {s}</li>
                                ))}
                              </ul>
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

          {activeTab === 'solutions' && (
            <motion.div key="solutions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Power Quality Solutions</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Match the right solution to your power quality problem.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-green-500/30 p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Problem</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Best Solution</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Alternative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr><td className="px-4 py-3 text-white">Voltage Sag/Surge</td><td className="px-4 py-3 text-green-400">AVR/Stabilizer</td><td className="px-4 py-3 text-gray-400">Online UPS</td></tr>
                    <tr><td className="px-4 py-3 text-white">Lightning/Transients</td><td className="px-4 py-3 text-green-400">Surge Protector (SPD)</td><td className="px-4 py-3 text-gray-400">Online UPS</td></tr>
                    <tr><td className="px-4 py-3 text-white">Power Outage</td><td className="px-4 py-3 text-green-400">UPS + Generator</td><td className="px-4 py-3 text-gray-400">Solar + Battery</td></tr>
                    <tr><td className="px-4 py-3 text-white">Harmonics</td><td className="px-4 py-3 text-green-400">Active Harmonic Filter</td><td className="px-4 py-3 text-gray-400">Passive Filter</td></tr>
                    <tr><td className="px-4 py-3 text-white">Electrical Noise</td><td className="px-4 py-3 text-green-400">Isolation Transformer</td><td className="px-4 py-3 text-gray-400">EMI Filter</td></tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'equipment' && (
            <motion.div key="equipment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Power Conditioning Equipment</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Detailed specifications for power protection equipment.</p>
              </div>
              <div className="space-y-6">
                {SOLUTION_EQUIPMENT.map((eq) => (
                  <div key={eq.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 p-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">{eq.name}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                      <div><span className="text-gray-400 block">Function</span><span className="text-white">{eq.function}</span></div>
                      <div><span className="text-gray-400 block">Input Range</span><span className="text-white">{eq.input}</span></div>
                      <div><span className="text-gray-400 block">Output</span><span className="text-white">{eq.output}</span></div>
                      <div><span className="text-gray-400 block">Capacity</span><span className="text-white">{eq.capacity}</span></div>
                      <div><span className="text-gray-400 block">Best For</span><span className="text-green-400">{eq.best}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 md:p-12 border border-blue-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Power Quality Problems?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Our engineers will assess your power quality issues and recommend the right protection solution.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
