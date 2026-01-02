'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLead from "../../components/generators/SectionLead";
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const TABS = [
  { id: 'amf', label: '⚡ AMF Panels', color: 'blue' },
  { id: 'ats', label: '🔄 ATS Systems', color: 'green' },
  { id: 'remote', label: '📡 Remote Monitoring', color: 'purple' },
  { id: 'installation', label: '🔧 Installation', color: 'amber' },
  { id: 'faults', label: '⚠️ Troubleshooting', color: 'red' },
];

const AMF_TYPES = [
  { type: 'Basic AMF', features: ['Auto start/stop on mains fail', 'Fixed time delays', 'Manual override'], controller: 'DSE4520', capacity: 'Up to 100kVA', cost: 'KES 150,000-300,000' },
  { type: 'Standard AMF', features: ['Multiple mains monitoring', 'Configurable delays', 'RS232 communication', 'Event logging'], controller: 'DSE7310', capacity: '100-500kVA', cost: 'KES 300,000-600,000' },
  { type: 'Advanced AMF', features: ['Dual mains changeover', 'Load shedding', 'Generator synchronization', 'Remote monitoring ready'], controller: 'DSE7320', capacity: '500kVA+', cost: 'KES 600,000-1,500,000' },
  { type: 'Parallel/Sync AMF', features: ['Multiple generator sync', 'Load sharing', 'Peak shaving', 'Island mode'], controller: 'DSE8610', capacity: 'Multi-MW', cost: 'KES 1,500,000+' },
];

const ATS_SPECS = [
  { rating: '63A', type: 'Motorized 3-pole', transfer: '5-8s', application: 'Small office/home', cost: 'KES 25,000-50,000' },
  { rating: '100A', type: 'Motorized 4-pole', transfer: '5-8s', application: 'Small commercial', cost: 'KES 45,000-80,000' },
  { rating: '200A', type: 'Motorized 4-pole', transfer: '5-8s', application: 'Medium commercial', cost: 'KES 80,000-150,000' },
  { rating: '400A', type: 'Motorized 4-pole', transfer: '5-8s', application: 'Large commercial', cost: 'KES 150,000-280,000' },
  { rating: '630A', type: 'Motorized 4-pole', transfer: '8-12s', application: 'Industrial', cost: 'KES 280,000-450,000' },
  { rating: '1000A+', type: 'ACB with motorized', transfer: '10-15s', application: 'Heavy industrial', cost: 'KES 500,000+' },
];

const REMOTE_FEATURES = [
  { platform: 'DSE WebNet', features: ['Real-time monitoring', 'Email/SMS alerts', 'Historical data', 'Multiple sites'], connectivity: 'Ethernet/WiFi', monthly: 'Free', setup: 'KES 50,000-100,000' },
  { platform: 'ComAp WebSupervisor', features: ['Cloud-based SCADA', 'Mobile app', 'Multi-generator', 'Advanced analytics'], connectivity: '3G/4G/WiFi', monthly: 'USD 15-50', setup: 'KES 80,000-200,000' },
  { platform: 'Custom SCADA', features: ['Full customization', 'Site-specific HMI', 'PLC integration', 'Enterprise ready'], connectivity: 'Any', monthly: 'Varies', setup: 'KES 300,000+' },
];

const INSTALLATION_STEPS = [
  { step: 'Site Survey', details: 'Assess generator, mains configuration, load requirements, cable routes', time: '2-4 hours' },
  { step: 'Design & Planning', details: 'Single line diagram, control philosophy, equipment specifications', time: '1-2 days' },
  { step: 'Panel Fabrication', details: 'AMF panel construction, wiring, component mounting, testing', time: '3-7 days' },
  { step: 'Installation', details: 'Mount panel, run control cables, power connections', time: '1-2 days' },
  { step: 'Commissioning', details: 'Configure controller, test mains fail scenarios, verify transfer times', time: '4-8 hours' },
  { step: 'Training', details: 'Operator training on panel use, basic troubleshooting', time: '1-2 hours' },
];

const FAULT_CODES = [
  { code: 'Mains High Voltage', cause: 'Utility voltage above set threshold', solution: 'Adjust setpoint or install AVR. If frequent, check utility supply.', severity: 'warning' },
  { code: 'Mains Low Voltage', cause: 'Utility voltage below threshold', solution: 'Adjust setpoint, verify cable sizing, check utility supply.', severity: 'warning' },
  { code: 'Generator Fail to Start', cause: 'Battery weak, fuel empty, mechanical fault', solution: 'Check battery voltage (>24V for 24V system), fuel level, starter motor.', severity: 'critical' },
  { code: 'Generator Fail to Stop', cause: 'Stop solenoid fault, controller output fault', solution: 'Test stop solenoid manually. Check controller stop output.', severity: 'high' },
  { code: 'ATS Transfer Fail', cause: 'Motor fault, position sensor, mechanical jam', solution: 'Manual transfer, check motor power, verify position feedback.', severity: 'critical' },
  { code: 'Over Speed', cause: 'Governor fault, load rejection', solution: 'Check governor actuator, verify speed sensing, inspect mechanical governor.', severity: 'critical' },
  { code: 'Under Speed', cause: 'Overloaded, fuel starvation, actuator fault', solution: 'Reduce load, check fuel supply, verify actuator movement.', severity: 'high' },
  { code: 'Communication Lost', cause: 'Cable fault, address mismatch, module fault', solution: 'Check RS485/Ethernet cables, verify addresses, restart devices.', severity: 'warning' },
];

export default function DieselAutomationHub() {
  const [activeTab, setActiveTab] = useState('amf');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);

  return (
    <main className="bg-black min-h-screen">
      <SectionLead
        title="Diesel Automation Solutions"
        subtitle="Complete automation for diesel generators: AMF panels, ATS systems, and remote monitoring solutions."
      />

      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-amber-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'amf' && (
            <motion.div key="amf" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">AMF Panel Types</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Automatic Mains Failure panels ensure seamless power transfer when utility fails.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {AMF_TYPES.map((amf) => (
                  <div key={amf.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-amber-500/30 p-6">
                    <h3 className="text-xl font-bold text-amber-400 mb-4">{amf.type}</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-400 text-sm">Features:</span>
                        <ul className="mt-2 space-y-1">
                          {amf.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{f}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div><span className="text-gray-400 block">Controller</span><span className="text-white">{amf.controller}</span></div>
                        <div><span className="text-gray-400 block">Capacity</span><span className="text-white">{amf.capacity}</span></div>
                        <div><span className="text-gray-400 block">Cost</span><span className="text-green-400">{amf.cost}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ats' && (
            <motion.div key="ats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">ATS Systems Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Automatic Transfer Switches for reliable power source changeover.</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-green-500/30 p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Rating</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Type</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Transfer Time</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Application</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-400">Cost Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ATS_SPECS.map((ats) => (
                      <tr key={ats.rating}>
                        <td className="px-4 py-3 text-white font-bold">{ats.rating}</td>
                        <td className="px-4 py-3 text-gray-300">{ats.type}</td>
                        <td className="px-4 py-3 text-amber-400">{ats.transfer}</td>
                        <td className="px-4 py-3 text-gray-300">{ats.application}</td>
                        <td className="px-4 py-3 text-green-400">{ats.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'remote' && (
            <motion.div key="remote" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Remote Monitoring Solutions</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Monitor your generators anywhere, anytime.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {REMOTE_FEATURES.map((platform) => (
                  <div key={platform.platform} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
                    <h3 className="text-lg font-bold text-purple-400 mb-4">{platform.platform}</h3>
                    <ul className="space-y-2 mb-4">
                      {platform.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{f}</li>
                      ))}
                    </ul>
                    <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                      <div><span className="text-gray-400">Connectivity:</span> <span className="text-white">{platform.connectivity}</span></div>
                      <div><span className="text-gray-400">Monthly:</span> <span className="text-white">{platform.monthly}</span></div>
                      <div><span className="text-gray-400">Setup:</span> <span className="text-green-400">{platform.setup}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'installation' && (
            <motion.div key="installation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Installation Process</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Professional AMF panel installation from survey to commissioning.</p>
              </div>
              <div className="space-y-4">
                {INSTALLATION_STEPS.map((item, idx) => (
                  <div key={item.step} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-amber-500/30 p-6 flex items-start gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center">{idx + 1}</span>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white">{item.step}</h4>
                      <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                    </div>
                    <span className="text-amber-400 text-sm">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Troubleshooting Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Common AMF/ATS faults and solutions.</p>
              </div>
              <div className="space-y-4">
                {FAULT_CODES.map((fault) => (
                  <div key={fault.code} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden">
                    <button onClick={() => setExpandedFault(expandedFault === fault.code ? null : fault.code)} className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5">
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${fault.severity === 'critical' ? 'bg-red-500' : fault.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'} text-white`}>
                          {fault.severity.toUpperCase()}
                        </span>
                        <span className="text-white font-medium">{fault.code}</span>
                      </div>
                      <span className="text-gray-400">▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedFault === fault.code && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden">
                          <div className="p-6 space-y-4">
                            <div><span className="text-amber-400 font-bold">Cause: </span><span className="text-gray-300">{fault.cause}</span></div>
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                              <span className="text-green-400 font-bold">✅ Solution: </span><span className="text-gray-300">{fault.solution}</span>
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
          <h2 className="text-3xl font-bold text-white mb-4">Need AMF/ATS Installation?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Our automation experts design and install custom AMF panels for any generator setup.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
