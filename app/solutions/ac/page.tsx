'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLead from "../../components/generators/SectionLead";
import UnifiedCTA from "@/components/cta/UnifiedCTA";

// =====================================================
// COMPREHENSIVE AC SOLUTIONS HUB
// Installation, Maintenance, Troubleshooting & Repairs
// =====================================================

const AC_TABS = [
  { id: 'installation', label: '🔧 Installation', color: 'blue' },
  { id: 'maintenance', label: '🛠️ Maintenance', color: 'green' },
  { id: 'faults', label: '⚠️ Troubleshooting', color: 'red' },
  { id: 'sizing', label: '📊 BTU Sizing', color: 'amber' },
  { id: 'refrigerant', label: '❄️ Refrigerants', color: 'cyan' },
];

// BTU SIZING GUIDE
const BTU_GUIDE = [
  { area: '9-14 m²', btu: '9,000 BTU (0.75 Ton)', description: 'Small bedroom, small office' },
  { area: '15-22 m²', btu: '12,000 BTU (1 Ton)', description: 'Standard bedroom, small living room' },
  { area: '23-32 m²', btu: '18,000 BTU (1.5 Ton)', description: 'Large bedroom, medium living room' },
  { area: '33-45 m²', btu: '24,000 BTU (2 Ton)', description: 'Large living room, small shop' },
  { area: '46-65 m²', btu: '36,000 BTU (3 Ton)', description: 'Large office, conference room' },
  { area: '66-90 m²', btu: '48,000 BTU (4 Ton)', description: 'Large commercial space' },
];

// ADJUSTMENT FACTORS
const BTU_FACTORS = [
  { factor: 'Sunny room/west facing', adjustment: '+10%' },
  { factor: 'Shaded room', adjustment: '-10%' },
  { factor: 'Kitchen', adjustment: '+4,000 BTU' },
  { factor: 'Each additional person', adjustment: '+600 BTU' },
  { factor: 'High ceiling (>3m)', adjustment: '+10-20%' },
  { factor: 'Many windows', adjustment: '+10%' },
  { factor: 'Top floor/roof exposure', adjustment: '+20%' },
  { factor: 'Poor insulation', adjustment: '+20-30%' },
];

// INSTALLATION GUIDES
const INSTALLATION_GUIDES = [
  {
    title: 'Split AC Installation',
    icon: '❄️',
    steps: [
      { step: 'Select indoor unit location: 2.1-2.4m height, away from heat sources', critical: true },
      { step: 'Mount indoor bracket level, minimum 15cm from ceiling', critical: true },
      { step: 'Drill 65-75mm hole for pipe passage (slight downward slope)', critical: true },
      { step: 'Select outdoor unit location: good airflow, away from direct sun', critical: true },
      { step: 'Mount outdoor unit on vibration-free surface/brackets', critical: false },
      { step: 'Connect refrigerant pipes: Flare joints must be tight, use torque wrench', critical: true },
      { step: 'Connect drain pipe with proper slope (1:100 minimum)', critical: true },
      { step: 'Vacuum system to -755mmHg for 15+ minutes', critical: true },
      { step: 'Release refrigerant from outdoor unit slowly', critical: true },
      { step: 'Connect electrical wiring per diagram', critical: true },
      { step: 'Test all functions: cooling, fan speeds, swing', critical: false },
    ],
    warnings: [
      'Never release refrigerant to atmosphere - illegal and harmful',
      'Improper flaring causes refrigerant leaks',
      'Inadequate vacuum causes moisture contamination',
    ],
  },
  {
    title: 'Electrical Requirements',
    icon: '⚡',
    steps: [
      { step: 'Determine power requirement: 9000 BTU ≈ 900W, 24000 BTU ≈ 2500W', critical: true },
      { step: 'Install dedicated circuit from DB', critical: true },
      { step: 'Size cable: 9000-12000 BTU = 2.5mm², 18000-24000 BTU = 4mm²', critical: true },
      { step: 'Install appropriate MCB: 9000-12000 BTU = 16A, 18000-24000 BTU = 25A', critical: true },
      { step: 'Install isolator switch within 1m of outdoor unit', critical: true },
      { step: 'Ensure proper earthing of both units', critical: true },
      { step: 'Install surge protection for inverter ACs', critical: false },
    ],
    warnings: [
      'Never connect AC to shared circuit or extension cord',
      'Voltage fluctuations damage compressor',
      'Earth fault can cause electrocution',
    ],
  },
  {
    title: 'Pipe Installation',
    icon: '🔧',
    steps: [
      { step: 'Use correct pipe sizes: 9000-12000 BTU = 1/4" + 3/8", 18000-24000 = 1/4" + 1/2"', critical: true },
      { step: 'Keep pipe runs as short as possible (max 15m typical)', critical: false },
      { step: 'Maximum height difference: Indoor above = 15m, Outdoor above = 5m', critical: true },
      { step: 'Insulate both liquid and suction lines', critical: true },
      { step: 'Avoid kinks and sharp bends (min radius 4x pipe diameter)', critical: true },
      { step: 'Use proper flaring tool - deburr before flaring', critical: true },
      { step: 'Apply refrigerant oil to flare before connection', critical: false },
      { step: 'Torque nuts to specification (do not overtighten)', critical: true },
    ],
    warnings: [
      'Improper flaring is #1 cause of refrigerant leaks',
      'Undersized pipes reduce capacity and damage compressor',
      'Uninsulated pipes cause condensation and efficiency loss',
    ],
  },
];

// MAINTENANCE SCHEDULES
const MAINTENANCE_SCHEDULES = [
  {
    interval: 'Every 2 Weeks',
    icon: '📋',
    color: 'green',
    tasks: [
      { task: 'Clean indoor unit filters (wash if reusable)', time: '10 min' },
      { task: 'Check for unusual noises or vibrations', time: '2 min' },
      { task: 'Verify temperature is reaching setpoint', time: '2 min' },
    ],
    totalTime: '15 minutes',
  },
  {
    interval: 'Monthly',
    icon: '📅',
    color: 'blue',
    tasks: [
      { task: 'Clean indoor unit housing with damp cloth', time: '10 min' },
      { task: 'Check drain pan and pipe for blockage', time: '5 min' },
      { task: 'Inspect outdoor unit for debris around condenser', time: '5 min' },
      { task: 'Check remote control batteries', time: '2 min' },
    ],
    totalTime: '25 minutes',
  },
  {
    interval: 'Quarterly',
    icon: '🔧',
    color: 'amber',
    tasks: [
      { task: 'Deep clean indoor evaporator coil with foam cleaner', time: '30 min' },
      { task: 'Clean outdoor condenser coil with water jet (low pressure)', time: '20 min' },
      { task: 'Check refrigerant pressure (should be done by technician)', time: '15 min' },
      { task: 'Inspect electrical connections', time: '10 min' },
      { task: 'Check and clean drain pump if equipped', time: '10 min' },
    ],
    totalTime: '1.5 hours',
  },
  {
    interval: 'Annually',
    icon: '⚙️',
    color: 'orange',
    tasks: [
      { task: 'Full system inspection by qualified technician', time: '60 min' },
      { task: 'Check compressor amp draw', time: '10 min' },
      { task: 'Verify refrigerant charge (add if needed)', time: '30 min' },
      { task: 'Test all safety controls', time: '15 min' },
      { task: 'Check fan motor bearings', time: '10 min' },
      { task: 'Inspect insulation on refrigerant pipes', time: '10 min' },
      { task: 'Calibrate thermostat if needed', time: '10 min' },
    ],
    totalTime: '2-3 hours',
  },
];

// FAULT DATABASE
const FAULTS_DATABASE = [
  {
    category: 'No Cooling',
    icon: '🌡️',
    faults: [
      {
        symptom: 'AC runs but no cold air',
        causes: ['Low refrigerant', 'Dirty evaporator', 'Compressor not running', 'Faulty expansion valve'],
        diagnosis: [
          'Check if compressor is running (vibration, amp draw)',
          'Feel suction line - should be cold',
          'Check for ice formation on evaporator or pipes',
          'Measure refrigerant pressures',
        ],
        solution: 'If suction line is warm, likely low refrigerant (leak). If compressor runs but both lines are same temp, expansion valve stuck. Ice formation indicates low refrigerant or restricted airflow.',
        severity: 'high',
      },
      {
        symptom: 'Compressor not starting',
        causes: ['Electrical fault', 'Capacitor failure', 'Overload tripped', 'Low voltage', 'Control board issue'],
        diagnosis: [
          'Check voltage at outdoor unit (should be 220-240V)',
          'Listen for clicking or humming at startup',
          'Test capacitor (microfarad should match rating)',
          'Check if overload is tripped (red reset button)',
        ],
        solution: 'Humming without start = bad capacitor or seized compressor. No sound = electrical issue or control board. Clicking repeatedly = overload protection.',
        severity: 'high',
      },
    ],
  },
  {
    category: 'Water Leaks',
    icon: '💧',
    faults: [
      {
        symptom: 'Water dripping from indoor unit',
        causes: ['Blocked drain pipe', 'Dirty evaporator', 'Drain pan cracked', 'Drain pump failure', 'Low refrigerant'],
        diagnosis: [
          'Check drain pipe outlet for water flow',
          'Inspect drain pan for cracks or overflow',
          'Check if evaporator is frozen (indicates low refrigerant)',
          'Test drain pump operation if equipped',
        ],
        solution: 'Most common cause is blocked drain. Use wet/dry vacuum or nitrogen to clear. If ice present, defrost and check refrigerant charge.',
        severity: 'medium',
      },
      {
        symptom: 'Water at outdoor unit',
        causes: ['Normal in humid conditions', 'Heat mode defrost', 'Indoor drain connected to outdoor', 'Refrigerant leak'],
        diagnosis: [
          'Check if drain from indoor is routed to outdoor (normal)',
          'Observe if water only during defrost cycle (normal in heat mode)',
          'Check for oil stains indicating refrigerant leak',
        ],
        solution: 'Some condensation at outdoor unit is normal. Oil stains indicate refrigerant leak requiring repair.',
        severity: 'low',
      },
    ],
  },
  {
    category: 'Strange Noises',
    icon: '🔊',
    faults: [
      {
        symptom: 'Loud rattling or vibration',
        causes: ['Loose panels', 'Fan blade imbalance', 'Compressor mounts worn', 'Debris in unit', 'Pipe vibration'],
        diagnosis: [
          'Remove front panel and check for loose parts',
          'Inspect fan blade for damage or dirt buildup',
          'Check if noise is from indoor or outdoor unit',
          'Look for contact between pipes and structure',
        ],
        solution: 'Tighten all screws and panels. Clean fan blades. Isolate vibrating pipes with rubber grommets. Worn compressor mounts may need replacement.',
        severity: 'medium',
      },
      {
        symptom: 'Hissing or bubbling sound',
        causes: ['Refrigerant leak', 'Normal expansion valve sound', 'Restricted liquid line'],
        diagnosis: [
          'Locate source of sound',
          'Check for oil stains near connections',
          'Mild hissing at indoor unit during startup is normal',
        ],
        solution: 'Loud continuous hissing indicates leak. Use leak detector or soap bubbles to locate. Professional repair required.',
        severity: 'high',
      },
      {
        symptom: 'Clicking sounds',
        causes: ['Relay cycling', 'Compressor overload', 'Electrical issue', 'Control board fault'],
        diagnosis: [
          'Count time between clicks',
          'Check if compressor attempts to start',
          'Measure voltage during clicking',
        ],
        solution: 'Rapid clicking (seconds apart) = compressor protection. May indicate bad capacitor, low voltage, or overheating.',
        severity: 'high',
      },
    ],
  },
  {
    category: 'Electrical Issues',
    icon: '⚡',
    faults: [
      {
        symptom: 'AC trips breaker',
        causes: ['Overloaded circuit', 'Short circuit', 'Compressor ground fault', 'Faulty breaker'],
        diagnosis: [
          'Check if breaker trips immediately or after running',
          'Measure amp draw of unit',
          'Test compressor windings to ground (should be >1MΩ)',
          'Try resetting breaker after cooling period',
        ],
        solution: 'Immediate trip = short circuit, check wiring. Trip after running = overload, check amp draw vs breaker rating. Ground fault in compressor requires replacement.',
        severity: 'high',
      },
      {
        symptom: 'Display shows error code',
        causes: ['Sensor fault', 'Communication error', 'Component failure', 'Voltage issue'],
        diagnosis: [
          'Note exact error code displayed',
          'Check unit manual for code meaning',
          'Power cycle unit and observe if code returns',
        ],
        solution: 'Common codes: E1/F1 = Indoor sensor fault, E2/F2 = Outdoor sensor, E4 = Compressor overload, E5 = Communication error. Refer to specific brand manual.',
        severity: 'medium',
      },
    ],
  },
  {
    category: 'Poor Performance',
    icon: '📉',
    faults: [
      {
        symptom: 'Room not reaching setpoint',
        causes: ['Undersized unit', 'Dirty filters/coils', 'Refrigerant low', 'Poor insulation', 'Heat sources'],
        diagnosis: [
          'Calculate required BTU for room size',
          'Check filter and coil cleanliness',
          'Measure supply and return air temperature (delta should be 8-12°C)',
          'Check room for heat sources or air leaks',
        ],
        solution: 'Clean system first. If proper temp differential but room warm, unit may be undersized or room has excessive heat load.',
        severity: 'medium',
      },
      {
        symptom: 'High electricity bills',
        causes: ['Dirty system', 'Refrigerant low', 'Running 24/7', 'Thermostat issues', 'Old inefficient unit'],
        diagnosis: [
          'Check if unit cycles on/off properly',
          'Verify thermostat accuracy',
          'Measure actual power consumption',
          'Check EER/SEER rating of unit',
        ],
        solution: 'Dirty coils increase consumption 20-30%. Low refrigerant causes compressor to work harder. Consider inverter upgrade for old units.',
        severity: 'low',
      },
    ],
  },
];

// REFRIGERANT REFERENCE
const REFRIGERANTS = [
  {
    type: 'R22 (HCFC)',
    status: 'Phased out',
    pressure: { low: '4.8 bar', high: '17 bar' },
    temp: '-41°C boiling',
    notes: 'Being phased out globally. Do not recharge - convert system to R410A or R32.',
    color: 'Green',
  },
  {
    type: 'R410A (HFC)',
    status: 'Current standard',
    pressure: { low: '8 bar', high: '25 bar' },
    temp: '-51°C boiling',
    notes: 'Most common in new units. Requires POE oil. Higher pressure than R22.',
    color: 'Pink',
  },
  {
    type: 'R32 (HFC)',
    status: 'Modern/Future',
    pressure: { low: '7 bar', high: '24 bar' },
    temp: '-52°C boiling',
    notes: 'More efficient than R410A. Mildly flammable (A2L). Requires proper training.',
    color: 'Light Blue',
  },
  {
    type: 'R134a (HFC)',
    status: 'Automotive/Chillers',
    pressure: { low: '2 bar', high: '12 bar' },
    temp: '-26°C boiling',
    notes: 'Common in car AC and water chillers. Not used in split ACs.',
    color: 'Light Blue',
  },
];

export default function ACSolutionHub() {
  const [activeTab, setActiveTab] = useState('installation');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>('Split AC Installation');

  return (
    <main className="bg-black min-h-screen">
      <SectionLead
        title="Air Conditioning Solutions Hub"
        subtitle="Complete guide to AC installation, maintenance, and troubleshooting. From BTU sizing to refrigerant handling - professional knowledge at your fingertips."
      />

      {/* Tab Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {AC_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
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
          {/* INSTALLATION SECTION */}
          {activeTab === 'installation' && (
            <motion.div
              key="installation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">AC Installation Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Professional installation procedures for split and multi-split air conditioning systems.
                </p>
              </div>

              {INSTALLATION_GUIDES.map((guide, idx) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-cyan-500/20 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedGuide(expandedGuide === guide.title ? null : guide.title)}
                    className="w-full text-left p-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{guide.icon}</span>
                        <h3 className="text-xl font-bold text-white">{guide.title}</h3>
                      </div>
                      <motion.span
                        animate={{ rotate: expandedGuide === guide.title ? 180 : 0 }}
                        className="text-gray-400 text-xl"
                      >
                        ▼
                      </motion.span>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedGuide === guide.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-cyan-500/20"
                      >
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
                                  step.critical ? 'bg-red-500 text-white' : 'bg-cyan-500 text-black'
                                }`}>
                                  {stepIdx + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="text-gray-300 text-sm">{step.step}</p>
                                  {step.critical && (
                                    <span className="text-red-400 text-xs mt-1 block">⚠️ Critical - errors cause system failure</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                            <h4 className="text-red-400 font-bold mb-2">⚠️ Warnings:</h4>
                            {guide.warnings.map((warning, widx) => (
                              <p key={widx} className="text-gray-300 text-sm">• {warning}</p>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* MAINTENANCE SECTION */}
          {activeTab === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">AC Maintenance Schedules</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Regular maintenance extends AC life by 5-10 years and reduces energy consumption by 15-30%.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
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
                      'bg-orange-500/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{schedule.icon}</span>
                        <span className={`font-bold ${
                          schedule.color === 'green' ? 'text-green-400' :
                          schedule.color === 'blue' ? 'text-blue-400' :
                          schedule.color === 'amber' ? 'text-amber-400' :
                          'text-orange-400'
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
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FAULTS SECTION */}
          {activeTab === 'faults' && (
            <motion.div
              key="faults"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">AC Troubleshooting Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Diagnose and fix common air conditioning problems. Click any fault for detailed solutions.
                </p>
              </div>

              {FAULTS_DATABASE.map((category) => (
                <div key={category.category} className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    {category.category}
                  </h3>
                  
                  {category.faults.map((fault, faultIdx) => (
                    <motion.div
                      key={fault.symptom}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: faultIdx * 0.05 }}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFault(expandedFault === fault.symptom ? null : fault.symptom)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            fault.severity === 'high' ? 'bg-red-500 text-white' :
                            fault.severity === 'medium' ? 'bg-yellow-500 text-black' :
                            'bg-green-500 text-white'
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
                            <div className="p-6 space-y-4">
                              <div>
                                <h4 className="text-amber-400 font-bold mb-2">Possible Causes:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {fault.causes.map((cause, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                                      {cause}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-cyan-400 font-bold mb-2">Diagnosis Steps:</h4>
                                <div className="space-y-1">
                                  {fault.diagnosis.map((step, idx) => (
                                    <p key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                      <span className="text-cyan-400">{idx + 1}.</span>
                                      {step}
                                    </p>
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
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}

          {/* BTU SIZING SECTION */}
          {activeTab === 'sizing' && (
            <motion.div
              key="sizing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">BTU Sizing Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Select the right AC capacity for your room. Undersized = poor cooling. Oversized = humidity problems &amp; wasted energy.
                </p>
              </div>

              {/* Quick Reference */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-amber-500/30 p-6">
                <h3 className="text-xl font-bold text-amber-400 mb-4">📊 Quick BTU Reference</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Room Area</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">BTU Rating</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Typical Application</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {BTU_GUIDE.map((row) => (
                        <tr key={row.area}>
                          <td className="px-4 py-3 text-white font-mono">{row.area}</td>
                          <td className="px-4 py-3 text-amber-400 font-bold">{row.btu}</td>
                          <td className="px-4 py-3 text-gray-400">{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Adjustment Factors */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-blue-500/30 p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">⚖️ Adjustment Factors</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {BTU_FACTORS.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300 text-sm">{factor.factor}</span>
                      <span className={`font-mono font-bold ${
                        factor.adjustment.startsWith('+') ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {factor.adjustment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formula */}
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border border-amber-500/30">
                <h3 className="text-2xl font-bold text-amber-400 mb-4">🧮 Calculation Formula</h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <p className="text-white font-mono text-lg mb-4">
                    BTU Required = Room Area (m²) × 600 BTU/m² × Adjustment Factors
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="text-white font-bold mb-2">Example:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Room: 25 m²</li>
                        <li>• West-facing (+10%)</li>
                        <li>• Top floor (+20%)</li>
                        <li>• 3 regular occupants</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2">Result:</h4>
                      <p className="text-amber-400 font-mono">= 25 × 600 × 1.1 × 1.2 + 1800</p>
                      <p className="text-amber-400 text-2xl font-bold mt-2">= 21,600 BTU</p>
                      <p className="text-gray-400 text-sm mt-1">→ 24,000 BTU (2 Ton) unit recommended</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* REFRIGERANT SECTION */}
          {activeTab === 'refrigerant' && (
            <motion.div
              key="refrigerant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Refrigerant Reference Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Understanding refrigerant types, pressures, and handling requirements for AC service.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {REFRIGERANTS.map((ref, idx) => (
                  <motion.div
                    key={ref.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-cyan-500/30 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{ref.type}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        ref.status === 'Phased out' ? 'bg-red-500/20 text-red-400' :
                        ref.status === 'Current standard' ? 'bg-green-500/20 text-green-400' :
                        ref.status === 'Modern/Future' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {ref.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cylinder Color:</span>
                        <span className="text-white">{ref.color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Boiling Point:</span>
                        <span className="text-cyan-400 font-mono">{ref.temp}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-1">Operating Pressures (@ 35°C):</span>
                        <div className="flex justify-between bg-white/5 rounded p-2">
                          <span className="text-blue-400">Low: {ref.pressure.low}</span>
                          <span className="text-red-400">High: {ref.pressure.high}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-gray-300 text-xs">{ref.notes}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Safety Warning */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ Refrigerant Safety</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <p className="text-gray-300">• Never mix different refrigerants</p>
                    <p className="text-gray-300">• Do not release to atmosphere (illegal)</p>
                    <p className="text-gray-300">• Use recovery machine for all service</p>
                    <p className="text-gray-300">• Refrigerant displaces oxygen in enclosed spaces</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-300">• R32 is mildly flammable - no sparks/flames</p>
                    <p className="text-gray-300">• Wear safety glasses and gloves</p>
                    <p className="text-gray-300">• Frostbite risk from liquid contact</p>
                    <p className="text-gray-300">• Proper EPA certification required</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-3xl p-8 md:p-12 border border-cyan-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need AC Service or Installation?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Our certified AC technicians handle everything from installation to complex repairs. 
            Fast response, quality work, fair prices.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request AC Assessment" />
          </div>
        </div>
      </section>
    </main>
  );
}
