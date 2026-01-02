'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLead from "../../components/generators/SectionLead";
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const TABS = [
  { id: 'diagnostics', label: '🔍 Diagnostics', color: 'blue' },
  { id: 'rewinding', label: '🔧 Rewinding', color: 'amber' },
  { id: 'vfd', label: '⚡ VFD Integration', color: 'purple' },
  { id: 'maintenance', label: '🛠️ Maintenance', color: 'green' },
  { id: 'faults', label: '⚠️ Troubleshooting', color: 'red' },
];

const MOTOR_TESTS = [
  { test: 'Insulation Resistance', method: 'Megger test at 500V/1000V', pass: '>5 MΩ for new, >1 MΩ acceptable', fail: '<1 MΩ indicates winding damage', tool: 'Megger/Insulation tester' },
  { test: 'Winding Resistance', method: 'Ohm test each phase', pass: 'All phases within 5%', fail: 'Imbalance >5% indicates shorted turns', tool: 'Low resistance ohmmeter' },
  { test: 'Polarization Index (PI)', method: '10-minute insulation test', pass: 'PI >2 for Class B/F', fail: 'PI <1.5 indicates contamination', tool: 'Megger with PI function' },
  { test: 'Surge Test', method: 'High voltage pulse comparison', pass: 'Matching waveforms all phases', fail: 'Waveform differences = turn faults', tool: 'Surge tester' },
  { test: 'Vibration Analysis', method: 'Measure vibration velocity', pass: '<4.5 mm/s (good)', fail: '>7 mm/s requires attention', tool: 'Vibration meter' },
  { test: 'Bearing Check', method: 'Temperature and noise', pass: '<80°C, no grinding', fail: 'High temp or noise = replace', tool: 'IR thermometer, stethoscope' },
];

const REWINDING_PROCESS = [
  { step: 'Inspection & Testing', description: 'Document nameplate, test windings, check core, assess damage extent', time: '1-2 hours' },
  { step: 'Stripping', description: 'Heat stator to soften varnish, remove old windings, clean slots', time: '2-4 hours' },
  { step: 'Core Testing', description: 'Core loss test to verify laminations not shorted', time: '30 min' },
  { step: 'Coil Winding', description: 'Wind new coils to original spec (turns, wire gauge, span)', time: '4-8 hours' },
  { step: 'Inserting', description: 'Place coils in slots with proper insulation class', time: '2-4 hours' },
  { step: 'Connecting', description: 'Connect coils per original diagram, form and tie connections', time: '1-2 hours' },
  { step: 'VPI/Dipping', description: 'Vacuum Pressure Impregnation or varnish dip, bake at 150°C', time: '8-12 hours' },
  { step: 'Final Testing', description: 'Hi-pot, megger, resistance, surge test, no-load run', time: '2-3 hours' },
];

const VFD_CONSIDERATIONS = [
  { issue: 'Bearing Currents', problem: 'VFD switching causes shaft voltage, bearing pitting', solution: 'Install shaft grounding ring, insulated bearings, or both' },
  { issue: 'Insulation Stress', problem: 'Voltage spikes from PWM damage windings', solution: 'Use inverter-duty motor (Class H) or install dV/dt filter' },
  { issue: 'Overheating', problem: 'Reduced cooling at low speeds', solution: 'Derate motor or add forced cooling for <40% speed operation' },
  { issue: 'Cable Reflections', problem: 'Long cables cause voltage doubling', solution: 'Keep cable <15m or install output filter/reactor' },
  { issue: 'Motor Noise', problem: 'Audible whine from PWM frequency', solution: 'Increase carrier frequency (watch heat) or accept noise' },
];

const MAINTENANCE_SCHEDULE = [
  { interval: 'Monthly', tasks: ['Check terminal connections', 'Measure current (compare to baseline)', 'Listen for unusual sounds', 'Feel for vibration', 'Clean exterior'] },
  { interval: 'Quarterly', tasks: ['Measure insulation resistance', 'Check bearing temperature', 'Inspect couplings and alignment', 'Clean or replace air filters', 'Check belt tension (if belt-driven)'] },
  { interval: 'Annually', tasks: ['Full electrical testing (megger, resistance)', 'Vibration analysis', 'Grease or replace bearings', 'Check cooling system', 'Thermal imaging survey'] },
];

const FAULT_DATABASE = [
  { fault: 'Motor runs hot', causes: ['Overloaded', 'Low voltage', 'Poor ventilation', 'Single phasing', 'Bearing failure'], solution: 'Check load current, verify voltage, clean cooling, check all 3 phases, inspect bearings.' },
  { fault: 'Motor won\'t start', causes: ['No power', 'Mechanical bind', 'Open circuit', 'Starter fault', 'Low voltage'], solution: 'Check power supply, rotate shaft by hand, test windings, check contactor, verify voltage.' },
  { fault: 'Excessive vibration', causes: ['Misalignment', 'Unbalanced load', 'Bearing wear', 'Loose mounting', 'Electrical imbalance'], solution: 'Laser align, balance coupling, replace bearings, tighten bolts, check phase currents.' },
  { fault: 'Bearing failure', causes: ['Over-greasing', 'Under-greasing', 'Misalignment', 'Overloading', 'Bearing currents (VFD)'], solution: 'Follow grease schedule exactly, align properly, reduce load, install shaft grounding.' },
  { fault: 'Low insulation resistance', causes: ['Moisture', 'Contamination', 'Age deterioration', 'Overheating damage'], solution: 'Dry motor (heat lamp), clean windings, if <1MΩ after drying, rewind required.' },
  { fault: 'Tripping on overload', causes: ['Overloaded', 'Worn bearings', 'High ambient', 'Wrong relay setting', 'Voltage imbalance'], solution: 'Reduce load, check bearings, improve cooling, verify OL setting at 105% FLA.' },
];

export default function MotorsRewindingHub() {
  const [activeTab, setActiveTab] = useState('diagnostics');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);

  return (
    <main className="bg-black min-h-screen">
      <SectionLead
        title="Motors & Rewinding Solutions"
        subtitle="Complete guide to motor diagnostics, rewinding procedures, VFD integration, and maintenance."
      />

      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-amber-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'diagnostics' && (
            <motion.div key="diagnostics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Motor Diagnostic Tests</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Professional testing to assess motor condition and predict failures.</p>
              </div>
              <div className="space-y-4">
                {MOTOR_TESTS.map((test) => (
                  <div key={test.test} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-blue-500/30 p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <h3 className="text-lg font-bold text-blue-400">{test.test}</h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">{test.tool}</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div><span className="text-gray-400 block mb-1">Method</span><span className="text-gray-300">{test.method}</span></div>
                      <div><span className="text-green-400 block mb-1">Pass Criteria</span><span className="text-gray-300">{test.pass}</span></div>
                      <div><span className="text-red-400 block mb-1">Fail Indicates</span><span className="text-gray-300">{test.fail}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'rewinding' && (
            <motion.div key="rewinding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Motor Rewinding Process</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Professional rewinding restores motor to original specifications.</p>
              </div>
              <div className="space-y-4">
                {REWINDING_PROCESS.map((step, idx) => (
                  <div key={step.step} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-amber-500/30 p-6 flex items-start gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center">{idx + 1}</span>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white">{step.step}</h4>
                      <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                    </div>
                    <span className="text-amber-400 text-sm">{step.time}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border border-amber-500/30">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">⚠️ Quality Indicators</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Same wire gauge and turns as original</li>
                  <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Insulation class equal or better (Class F or H)</li>
                  <li className="flex items-start gap-2"><span className="text-green-400">✓</span>VPI treatment for harsh environments</li>
                  <li className="flex items-start gap-2"><span className="text-green-400">✓</span>Full test report with baseline values</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'vfd' && (
            <motion.div key="vfd" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">VFD Integration Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Properly integrate motors with Variable Frequency Drives.</p>
              </div>
              <div className="space-y-4">
                {VFD_CONSIDERATIONS.map((item) => (
                  <div key={item.issue} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 p-6">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">{item.issue}</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-red-500/10 rounded-lg p-4">
                        <span className="text-red-400 font-bold block mb-2">Problem</span>
                        <span className="text-gray-300">{item.problem}</span>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-4">
                        <span className="text-green-400 font-bold block mb-2">Solution</span>
                        <span className="text-gray-300">{item.solution}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Motor Maintenance Schedules</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Preventive maintenance extends motor life and prevents failures.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
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
                <h2 className="text-3xl font-bold text-white mb-4">Motor Troubleshooting Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Diagnose and resolve common motor problems.</p>
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
        </AnimatePresence>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-3xl p-8 md:p-12 border border-amber-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Motor Services?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Professional motor rewinding, repair, and diagnostic services for all motor types.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
