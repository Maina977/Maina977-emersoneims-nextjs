'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLead from "../../components/generators/SectionLead";
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const TABS = [
  { id: 'types', label: '🔥 Incinerator Types', color: 'orange' },
  { id: 'installation', label: '🔧 Installation', color: 'blue' },
  { id: 'operation', label: '⚡ Operation', color: 'green' },
  { id: 'maintenance', label: '🛠️ Maintenance', color: 'purple' },
  { id: 'compliance', label: '📋 Emissions', color: 'red' },
];

const INCINERATOR_TYPES = [
  { type: 'Medical Waste Incinerator', capacity: '10-500 kg/hr', temp: '850-1200°C', application: 'Hospitals, clinics, labs', features: ['Dual chamber', 'Auto ash removal', 'Air pollution control'] },
  { type: 'General Waste Incinerator', capacity: '50-2000 kg/hr', temp: '800-1000°C', application: 'Municipal, industrial', features: ['Continuous feed', 'Heat recovery optional', 'Large capacity'] },
  { type: 'Pet/Animal Cremator', capacity: '50-200 kg/load', temp: '800-1100°C', application: 'Vet clinics, farms', features: ['Batch operation', 'Clean burn', 'Ash collection'] },
  { type: 'Industrial Hazardous', capacity: '100-1000 kg/hr', temp: '1100-1400°C', application: 'Chemical, pharmaceutical', features: ['High temp', 'Scrubbers', 'Strict controls'] },
];

const INSTALLATION_REQUIREMENTS = [
  { category: 'Site Requirements', items: ['Minimum 50m from residential areas', 'Concrete pad with drainage', 'Fire-rated structure or open-air', 'Access for fuel delivery and ash removal'] },
  { category: 'Electrical', items: ['3-phase 415V supply for controls', 'Backup power for emission controls', 'Proper earthing and lightning protection', 'Control panel rated for temperature'] },
  { category: 'Fuel System', items: ['Diesel storage tank (min 1000L)', 'Fuel pump and filter system', 'Secondary containment for spills', 'Vent system for tank'] },
  { category: 'Emissions', items: ['Stack height as per NEMA guidelines', 'Emission monitoring ports', 'Scrubber system if required', 'Opacity monitor installation point'] },
];

const OPERATION_GUIDE = [
  { phase: 'Start-Up', steps: ['Pre-heat primary chamber to 600°C (30-45 min)', 'Verify secondary chamber reaches 850°C minimum', 'Check all safety interlocks', 'Confirm emission controls active'] },
  { phase: 'Loading', steps: ['Load waste when chamber ready', 'Do not exceed rated capacity', 'Ensure waste door seals properly', 'Maintain negative pressure'] },
  { phase: 'Burn Cycle', steps: ['Monitor primary chamber temp 800-1000°C', 'Secondary chamber >850°C for gas destruction', 'Residence time minimum 2 seconds', 'Adjust air flow as needed'] },
  { phase: 'Shutdown', steps: ['Stop waste loading', 'Burn down remaining waste', 'Allow gradual cool-down', 'Do not quench with water'] },
];

const MAINTENANCE_TASKS = [
  { interval: 'Daily', tasks: ['Remove ash from primary chamber', 'Check burner ignition', 'Inspect door seals', 'Log temperatures and run hours'] },
  { interval: 'Weekly', tasks: ['Clean air intake filters', 'Inspect refractory for cracks', 'Check stack condition', 'Clean fuel filters'] },
  { interval: 'Monthly', tasks: ['Service combustion burners', 'Calibrate temperature sensors', 'Test safety interlocks', 'Check door mechanisms'] },
  { interval: 'Annually', tasks: ['Full refractory inspection', 'Burner overhaul', 'Emission stack test', 'Replace worn components'] },
];

const EMISSION_STANDARDS = [
  { parameter: 'Particulate Matter', limit: '<50 mg/Nm³', requirement: 'Bag filter or scrubber', test: 'Stack test annually' },
  { parameter: 'Carbon Monoxide (CO)', limit: '<100 mg/Nm³', requirement: 'Proper combustion', test: 'Continuous monitor' },
  { parameter: 'Hydrogen Chloride (HCl)', limit: '<100 mg/Nm³', requirement: 'Wet scrubber', test: 'For PVC waste' },
  { parameter: 'Dioxins/Furans', limit: '<0.1 ng TEQ/Nm³', requirement: 'Temperature >850°C', test: 'Annual specialized' },
  { parameter: 'Opacity', limit: '<20%', requirement: 'Good combustion', test: 'Visual/continuous' },
];

export default function IncineratorsHub() {
  const [activeTab, setActiveTab] = useState('types');

  return (
    <main className="bg-black min-h-screen">
      <SectionLead
        title="Incinerator Solutions"
        subtitle="Complete guide to waste incineration systems: types, installation, operation, and compliance."
      />

      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'types' && (
            <motion.div key="types" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Incinerator Types</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Choose the right incinerator for your waste management needs.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {INCINERATOR_TYPES.map((inc) => (
                  <div key={inc.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-orange-500/30 p-6">
                    <h3 className="text-xl font-bold text-orange-400 mb-4">{inc.type}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div><span className="text-gray-400">Capacity:</span> <span className="text-white">{inc.capacity}</span></div>
                      <div><span className="text-gray-400">Temperature:</span> <span className="text-white">{inc.temp}</span></div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{inc.application}</p>
                    <div className="flex flex-wrap gap-2">
                      {inc.features.map((f, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">{f}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'installation' && (
            <motion.div key="installation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Installation Requirements</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Essential requirements for proper incinerator installation.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {INSTALLATION_REQUIREMENTS.map((req) => (
                  <div key={req.category} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-blue-500/30 p-6">
                    <h3 className="text-lg font-bold text-blue-400 mb-4">{req.category}</h3>
                    <ul className="space-y-2">
                      {req.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-blue-400">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'operation' && (
            <motion.div key="operation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Operation Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Safe and efficient incinerator operation procedures.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {OPERATION_GUIDE.map((phase) => (
                  <div key={phase.phase} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-green-500/30 p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">{phase.phase}</h3>
                    <div className="space-y-2">
                      {phase.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-black text-xs font-bold flex items-center justify-center">{i + 1}</span>
                          <span className="text-gray-300 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl p-8 border border-red-500/30">
                <h3 className="text-2xl font-bold text-red-400 mb-4">⚠️ Critical Safety Rules</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2"><span className="text-red-400">•</span>Never operate below 850°C secondary chamber temperature</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">•</span>Never open loading door while under negative pressure</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">•</span>Never bypass safety interlocks</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">•</span>Never leave operating incinerator unattended</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Maintenance Schedules</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Regular maintenance ensures safe, efficient, and compliant operation.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MAINTENANCE_TASKS.map((schedule) => (
                  <div key={schedule.interval} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 p-6">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">{schedule.interval}</h3>
                    <ul className="space-y-2">
                      {schedule.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-purple-400">✓</span>{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div key="compliance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Emission Standards & Compliance</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">NEMA emission requirements for incinerators in Kenya.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-red-500/30 p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Parameter</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Limit</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Requirement</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Testing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {EMISSION_STANDARDS.map((std) => (
                      <tr key={std.parameter}>
                        <td className="px-4 py-3 text-white">{std.parameter}</td>
                        <td className="px-4 py-3 text-red-400 font-bold">{std.limit}</td>
                        <td className="px-4 py-3 text-gray-300 text-sm">{std.requirement}</td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{std.test}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-8 border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-4">📋 Compliance Checklist</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="text-white font-bold mb-2">Before Commissioning</h4>
                    <ul className="space-y-1 text-gray-300">
                      <li>✓ NEMA Environmental Impact Assessment</li>
                      <li>✓ Site approval from county government</li>
                      <li>✓ Emission control system installed</li>
                      <li>✓ Stack test scheduled</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">Ongoing</h4>
                    <ul className="space-y-1 text-gray-300">
                      <li>✓ Annual NEMA license renewal</li>
                      <li>✓ Annual emission stack testing</li>
                      <li>✓ Maintain operation logs</li>
                      <li>✓ Train operators periodically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-3xl p-8 md:p-12 border border-orange-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Incinerator Services?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Installation, maintenance, and emission compliance services for all incinerator types.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
