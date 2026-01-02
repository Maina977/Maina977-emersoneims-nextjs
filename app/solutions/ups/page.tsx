'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLead from "../../components/generators/SectionLead";
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const UPS_TABS = [
  { id: 'installation', label: '🔧 Installation', color: 'blue' },
  { id: 'maintenance', label: '🛠️ Maintenance', color: 'green' },
  { id: 'faults', label: '⚠️ Troubleshooting', color: 'red' },
  { id: 'batteries', label: '🔋 Battery Care', color: 'purple' },
  { id: 'sizing', label: '📊 Sizing Guide', color: 'amber' },
];

const INSTALLATION_STEPS = [
  { step: 'Verify electrical supply matches UPS input voltage rating (220V/380V)', critical: true },
  { step: 'Ensure circuit breaker capacity ≥ 1.25 × UPS input current', critical: true },
  { step: 'Install UPS on level surface with 150mm+ clearance for ventilation', critical: true },
  { step: 'Connect input power cable to dedicated circuit', critical: true },
  { step: 'Connect battery bank with correct polarity (positive to positive)', critical: true },
  { step: 'Connect critical loads to UPS output - never exceed 80% rated capacity', critical: true },
  { step: 'Install external maintenance bypass for systems >10kVA', critical: false },
  { step: 'Configure UPS parameters via display or software', critical: false },
  { step: 'Perform test: Simulate mains failure, verify transfer time', critical: true },
  { step: 'Document installation: Photos, serial numbers, configuration', critical: false },
];

const MAINTENANCE_SCHEDULES = [
  {
    interval: 'Monthly',
    icon: '📋',
    color: 'green',
    tasks: [
      { task: 'Check UPS display for alarms or warnings', time: '2 min' },
      { task: 'Verify battery voltage and charge status', time: '3 min' },
      { task: 'Inspect air filters, clean if dusty', time: '5 min' },
      { task: 'Check ambient temperature (<25°C optimal)', time: '1 min' },
      { task: 'Review event log for anomalies', time: '5 min' },
    ],
  },
  {
    interval: 'Quarterly',
    icon: '📅',
    color: 'blue',
    tasks: [
      { task: 'Perform battery test under load (automatic if supported)', time: '15 min' },
      { task: 'Check all cable connections for tightness', time: '10 min' },
      { task: 'Clean UPS exterior and ventilation openings', time: '10 min' },
      { task: 'Verify transfer to battery mode and back', time: '5 min' },
      { task: 'Update firmware if new version available', time: '20 min' },
    ],
  },
  {
    interval: 'Annually',
    icon: '🔧',
    color: 'amber',
    tasks: [
      { task: 'Full load test by certified technician', time: '60 min' },
      { task: 'Battery capacity test (discharge to 80%)', time: '90 min' },
      { task: 'Internal inspection and cleaning', time: '45 min' },
      { task: 'Torque check on all terminals', time: '30 min' },
      { task: 'Replace air filters', time: '15 min' },
      { task: 'Calibrate meters if drift detected', time: '30 min' },
    ],
  },
];

const FAULT_DATABASE = [
  {
    symptom: 'UPS not providing output',
    causes: ['Output breaker tripped', 'Overload condition', 'Internal fault', 'DC bus undervoltage'],
    solution: 'Check output breaker, reduce load below 80%, check battery voltage. If persistent, internal fault requires service.',
    severity: 'critical',
  },
  {
    symptom: 'Continuous beeping',
    causes: ['On battery (mains fail)', 'Low battery', 'Overload warning', 'Fault condition'],
    solution: 'Check mains power, verify battery condition, reduce load. Refer to beep pattern: 1 beep/4s = battery mode, continuous = low battery.',
    severity: 'high',
  },
  {
    symptom: 'Battery not charging',
    causes: ['Charger fault', 'Battery dead', 'Thermal limit', 'Fuse blown'],
    solution: 'Check battery voltage (should be 13.5-14.5V per 12V battery). If below 10V, battery likely dead. Check charger fuse.',
    severity: 'high',
  },
  {
    symptom: 'Short runtime on battery',
    causes: ['Aged batteries', 'Overloaded', 'High temperature', 'Battery not fully charged'],
    solution: 'Perform capacity test. Batteries below 80% capacity should be replaced. Check actual load vs UPS rating.',
    severity: 'medium',
  },
  {
    symptom: 'Frequent transfers to battery',
    causes: ['Unstable mains', 'Input voltage out of range', 'Loose input connection'],
    solution: 'Install line conditioner if mains unstable. Check input voltage range settings. Tighten all connections.',
    severity: 'medium',
  },
  {
    symptom: 'Overload alarm',
    causes: ['Load exceeds capacity', 'Inrush current', 'Short circuit downstream'],
    solution: 'Calculate actual connected load. Check for faulty equipment. Use soft-start for high inrush loads.',
    severity: 'high',
  },
  {
    symptom: 'Fan running constantly at high speed',
    causes: ['High ambient temperature', 'Internal overheating', 'Fan sensor fault', 'Blocked ventilation'],
    solution: 'Improve room cooling. Clean air filters. Ensure minimum clearances. Check for internal dust buildup.',
    severity: 'medium',
  },
];

const BATTERY_INFO = [
  {
    type: 'VRLA/AGM',
    life: '3-5 years',
    replacement: 'Replace when capacity drops below 80%',
    voltage: '12V nominal, 13.6V float, 14.4V charge',
    care: 'Keep <25°C, avoid deep discharge, maintain float charge',
  },
  {
    type: 'Gel',
    life: '5-8 years',
    replacement: 'Replace when capacity drops below 80%',
    voltage: '12V nominal, 13.5V float, 14.1V charge',
    care: 'Lower charge voltage than AGM, temperature tolerant',
  },
  {
    type: 'Lithium (LiFePO4)',
    life: '10-15 years',
    replacement: 'Replace at 70% capacity retention',
    voltage: '12.8V nominal, 14.6V full, requires BMS',
    care: 'Do not overcharge, built-in BMS protects cells',
  },
];

const SIZING_GUIDE = [
  { load: '500-1000W', ups: '1 kVA', battery: '12V 7Ah internal', runtime: '5-10 min' },
  { load: '1000-2000W', ups: '2-3 kVA', battery: '24V 9Ah internal', runtime: '5-10 min' },
  { load: '2000-4000W', ups: '5 kVA', battery: '96V external', runtime: '15-30 min' },
  { load: '4000-8000W', ups: '10 kVA', battery: '192V external', runtime: '15-30 min' },
  { load: '8000-16000W', ups: '20 kVA', battery: '240V external', runtime: '15-30 min' },
];

export default function UPSSolutionHub() {
  const [activeTab, setActiveTab] = useState('installation');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);

  return (
    <main className="bg-black min-h-screen">
      <SectionLead
        title="UPS Solutions Hub"
        subtitle="Complete guide to UPS installation, maintenance, and troubleshooting. Protect your critical equipment with expert knowledge."
      />

      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {UPS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
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
                <h2 className="text-3xl font-bold text-white mb-4">UPS Installation Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Professional installation ensures reliable protection for your critical equipment.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/20 p-6">
                <div className="space-y-3">
                  {INSTALLATION_STEPS.map((item, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg ${item.critical ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5'}`}>
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${item.critical ? 'bg-red-500 text-white' : 'bg-purple-500 text-white'}`}>
                        {idx + 1}
                      </span>
                      <p className="text-gray-300 text-sm">{item.step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Maintenance Schedules</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Regular maintenance extends UPS life and ensures reliability when you need it most.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {MAINTENANCE_SCHEDULES.map((schedule) => (
                  <div key={schedule.interval} className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-${schedule.color}-500/30 overflow-hidden`}>
                    <div className={`p-4 bg-${schedule.color}-500/20 border-b border-white/10`}>
                      <span className="text-3xl">{schedule.icon}</span>
                      <h3 className="text-lg font-bold text-white mt-2">{schedule.interval}</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {schedule.tasks.map((task, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300 flex-1">{task.task}</span>
                          <span className="text-gray-500 text-xs">{task.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Troubleshooting Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Diagnose and resolve common UPS problems quickly.</p>
              </div>
              <div className="space-y-4">
                {FAULT_DATABASE.map((fault) => (
                  <div key={fault.symptom} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden">
                    <button onClick={() => setExpandedFault(expandedFault === fault.symptom ? null : fault.symptom)} className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5">
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${fault.severity === 'critical' ? 'bg-red-500' : fault.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'} text-white`}>
                          {fault.severity.toUpperCase()}
                        </span>
                        <span className="text-white font-medium">{fault.symptom}</span>
                      </div>
                      <span className="text-gray-400">▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedFault === fault.symptom && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden">
                          <div className="p-6 space-y-4">
                            <div>
                              <h4 className="text-amber-400 font-bold mb-2">Possible Causes:</h4>
                              <div className="flex flex-wrap gap-2">
                                {fault.causes.map((cause, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{cause}</span>
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

          {activeTab === 'batteries' && (
            <motion.div key="batteries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Battery Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Batteries are the heart of your UPS. Proper care ensures maximum life and runtime.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {BATTERY_INFO.map((battery) => (
                  <div key={battery.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">{battery.type}</h3>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-gray-400">Expected Life:</span> <span className="text-white">{battery.life}</span></div>
                      <div><span className="text-gray-400">Voltage:</span> <span className="text-white">{battery.voltage}</span></div>
                      <div><span className="text-gray-400">Replacement:</span> <span className="text-white">{battery.replacement}</span></div>
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-gray-400">Care Tips:</span>
                        <p className="text-gray-300 mt-1">{battery.care}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">🔋 Runtime Calculator</h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <p className="text-white font-mono text-lg mb-4">Runtime (minutes) = (Battery AH × Battery Volts × 0.8 × 60) ÷ Load Watts</p>
                  <p className="text-gray-400 text-sm">Example: 100Ah × 48V × 0.8 × 60 ÷ 3000W = 76 minutes</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sizing' && (
            <motion.div key="sizing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Sizing Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Select the right UPS capacity for your critical loads.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-amber-500/30 p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Load Range</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">UPS Capacity</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Battery Config</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Typical Runtime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {SIZING_GUIDE.map((row) => (
                      <tr key={row.load}>
                        <td className="px-4 py-3 text-white">{row.load}</td>
                        <td className="px-4 py-3 text-amber-400 font-bold">{row.ups}</td>
                        <td className="px-4 py-3 text-gray-300">{row.battery}</td>
                        <td className="px-4 py-3 text-green-400">{row.runtime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border border-amber-500/30">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">📊 Sizing Formula</h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <p className="text-white font-mono text-lg mb-4">UPS kVA = Total Load Watts ÷ (Power Factor × 1000) × 1.25</p>
                  <p className="text-gray-400 text-sm">Add 25% safety margin. Power factor typically 0.8 for IT loads.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-8 md:p-12 border border-purple-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need UPS Service or Installation?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Our power protection experts handle everything from battery replacement to complete UPS installations.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
