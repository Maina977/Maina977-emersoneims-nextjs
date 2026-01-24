'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicHeroImage from "@/components/hero/CinematicHeroImage";
import UnifiedCTA from "@/components/cta/UnifiedCTA";
import Link from 'next/link';

// =====================================================
// COMPREHENSIVE SOLAR POWER SOLUTIONS HUB
// Installation, Maintenance, Troubleshooting & Repairs
// =====================================================

const SOLAR_TABS = [
  { id: 'installation', label: '🔧 Installation', color: 'amber' },
  { id: 'maintenance', label: '🛠️ Maintenance', color: 'green' },
  { id: 'faults', label: '⚠️ Faults &amp; Diagnostics', color: 'red' },
  { id: 'inverters', label: '📟 Inverters', color: 'blue' },
  { id: 'batteries', label: '🔋 Batteries', color: 'purple' },
];

// INSTALLATION GUIDES
const INSTALLATION_GUIDES = [
  {
    title: 'Site Assessment &amp; Design',
    icon: '📐',
    steps: [
      { step: 'Measure roof/ground area available for solar installation', critical: true },
      { step: 'Assess shading: Track sun path from 9AM to 4PM, note obstacles', critical: true },
      { step: 'Check roof structural integrity: Minimum 15 kg/m² load capacity', critical: true },
      { step: 'Determine optimal tilt angle: Latitude ±15° for year-round performance', critical: false },
      { step: 'Calculate daily energy consumption from utility bills (kWh/day)', critical: true },
      { step: 'Size system: Daily consumption ÷ Peak sun hours (4-5 for Kenya)', critical: true },
      { step: 'Design string configuration: Match to inverter MPPT voltage window', critical: true },
      { step: 'Create single-line diagram and layout drawing', critical: false },
    ],
    proTip: 'In Kenya, optimal tilt is 0-15° facing North. Each 1% shading can reduce output by 10-30% depending on system design.',
  },
  {
    title: 'Panel Mounting &amp; Installation',
    icon: '⚡',
    steps: [
      { step: 'Install mounting rails with proper spacing (check panel dimensions)', critical: true },
      { step: 'Ensure mounting is waterproof - use flashing for roof penetrations', critical: true },
      { step: 'Maintain minimum 100mm clearance under panels for cooling airflow', critical: false },
      { step: 'Install panels with correct polarity orientation (check junction box)', critical: true },
      { step: 'Torque all mounting hardware to specification (typically 8-12 Nm)', critical: true },
      { step: 'Install mid and end clamps per manufacturer requirements', critical: true },
      { step: 'Leave access space for maintenance (minimum 600mm walkways)', critical: false },
      { step: 'Bond all frames to common earth conductor', critical: true },
    ],
    proTip: 'Panel temperature coefficient: Typically -0.35% to -0.45% per °C above 25°C. Expect 10-15% less output in hot afternoons.',
  },
  {
    title: 'DC Wiring &amp; Connections',
    icon: '🔌',
    steps: [
      { step: 'Size DC cables: Max 3% voltage drop from panels to inverter', critical: true },
      { step: 'Use solar-rated (PV1-F or H1Z2Z2-K) cables only', critical: true },
      { step: 'Install MC4 connectors properly - crimped, not soldered', critical: true },
      { step: 'Route positive and negative in separate conduits where possible', critical: false },
      { step: 'Install DC isolator within 1m of inverter', critical: true },
      { step: 'Install string fuses if parallel strings >2 (typically 15A per string)', critical: true },
      { step: 'Install DC surge protection (SPD) Type 2 at combiner/inverter', critical: true },
      { step: 'Label all cables: String number, polarity, voltage', critical: false },
    ],
    proTip: 'Cable sizing: For 100m run at 10A, use minimum 6mm² for <3% drop. Voltage drop = (2 × L × I × ρ) / A',
  },
  {
    title: 'Inverter Installation',
    icon: '📟',
    steps: [
      { step: 'Mount inverter in shaded, ventilated location (avoid direct sun)', critical: true },
      { step: 'Maintain clearances: 300mm above, 200mm sides, 500mm below', critical: true },
      { step: 'Verify DC string voltage within inverter MPPT range', critical: true },
      { step: 'Connect DC input with power OFF (isolator open)', critical: true },
      { step: 'Connect AC output through dedicated circuit breaker', critical: true },
      { step: 'Install AC surge protection if not built into inverter', critical: false },
      { step: 'Configure grid parameters per utility requirements', critical: true },
      { step: 'Commission and test all protection functions', critical: true },
    ],
    proTip: 'Inverter derating starts at 45°C typically. Install where ambient stays below 40°C for optimal performance.',
  },
  {
    title: 'Battery System Installation',
    icon: '🔋',
    steps: [
      { step: 'Install batteries in ventilated room (lead-acid produce hydrogen)', critical: true },
      { step: 'Use battery rack rated for weight (48V 200Ah ≈ 120kg)', critical: true },
      { step: 'Install on non-conductive surface, minimum 100mm off floor', critical: false },
      { step: 'Size battery cables: Max 2% voltage drop at peak discharge', critical: true },
      { step: 'Install battery fuse/breaker at battery positive terminal', critical: true },
      { step: 'Configure charge controller for battery type (AGM, Gel, Lithium)', critical: true },
      { step: 'Set temperature compensation if applicable (-3mV/°C/cell lead-acid)', critical: false },
      { step: 'Install battery management system for lithium batteries', critical: true },
    ],
    proTip: 'Battery sizing: (Daily load × Autonomy days) / (DOD × System voltage). For 10kWh daily load, 2 days autonomy, 50% DOD: 40kWh battery bank.',
  },
  {
    title: 'Earthing &amp; Protection',
    icon: '⚡',
    steps: [
      { step: 'Install dedicated earth electrode for solar system', critical: true },
      { step: 'Earth resistance should be <10Ω (lower in lightning-prone areas)', critical: true },
      { step: 'Bond all panel frames with minimum 6mm² green/yellow conductor', critical: true },
      { step: 'Install equipotential bonding bar in DC combiner', critical: false },
      { step: 'Connect inverter earth terminal to main earth', critical: true },
      { step: 'Install DC and AC surge protection devices (SPD)', critical: true },
      { step: 'Consider lightning protection for exposed rooftop systems', critical: false },
      { step: 'Test earth continuity and insulation before energizing', critical: true },
    ],
    proTip: 'In lightning-prone areas, install Type 1+2 SPD on both DC and AC sides. SPD should be rated for VOC × 1.25.',
  },
];

// MAINTENANCE SCHEDULES
const MAINTENANCE_SCHEDULES = [
  {
    interval: 'Monthly Checks',
    icon: '📋',
    color: 'green',
    tasks: [
      { task: 'Visual inspection of panels for damage, soiling, bird droppings', time: '15 min' },
      { task: 'Check inverter display for fault codes or warnings', time: '5 min' },
      { task: 'Verify system production matches expected output', time: '5 min' },
      { task: 'Check battery state of charge (if applicable)', time: '5 min' },
      { task: 'Inspect visible wiring for damage or pest interference', time: '10 min' },
    ],
    totalTime: '30-45 minutes',
  },
  {
    interval: 'Quarterly Service',
    icon: '📅',
    color: 'blue',
    tasks: [
      { task: 'Clean panels with soft brush and water (early morning/evening)', time: '30 min' },
      { task: 'Check all MC4 connectors for heat damage or looseness', time: '20 min' },
      { task: 'Inspect mounting hardware for corrosion or loosening', time: '15 min' },
      { task: 'Clean inverter ventilation filters if equipped', time: '10 min' },
      { task: 'Check battery terminals and electrolyte levels (flooded)', time: '15 min' },
      { task: 'Review monitoring data for performance trends', time: '15 min' },
    ],
    totalTime: '1.5-2 hours',
  },
  {
    interval: 'Annual Service',
    icon: '🔧',
    color: 'amber',
    tasks: [
      { task: 'Perform infrared thermography scan of all panels and connections', time: '60 min' },
      { task: 'Test string voltages and currents (compare to commissioning)', time: '30 min' },
      { task: 'Measure insulation resistance of DC wiring (>1MΩ)', time: '20 min' },
      { task: 'Test earth continuity and resistance', time: '15 min' },
      { task: 'Verify all protection device operation', time: '20 min' },
      { task: 'Update inverter firmware if available', time: '30 min' },
      { task: 'Full battery capacity test (discharge to 80% DOD)', time: '120 min' },
      { task: 'Generate annual performance report', time: '30 min' },
    ],
    totalTime: '6-8 hours',
    parts: ['Cleaning supplies', 'IR camera rental', 'Test equipment'],
  },
  {
    interval: 'Every 5 Years',
    icon: '⚙️',
    color: 'orange',
    tasks: [
      { task: 'IV curve tracing of representative strings', time: '90 min' },
      { task: 'Detailed inspection of all electrical connections', time: '60 min' },
      { task: 'Replace AC/DC surge protection devices (preventive)', time: '30 min' },
      { task: 'Replace cooling fans in inverter (if applicable)', time: '30 min' },
      { task: 'Battery bank assessment/replacement planning', time: '30 min' },
      { task: 'Structural inspection of mounting system', time: '45 min' },
      { task: 'Full system re-commissioning test', time: '60 min' },
    ],
    totalTime: '1-2 days',
    parts: ['Replacement SPDs', 'Cooling fans', 'New terminals/connectors'],
  },
];

// FAULT DIAGNOSIS DATABASE
const FAULTS_DATABASE = [
  {
    category: 'Panel Issues',
    icon: '☀️',
    faults: [
      {
        symptom: 'Low power output from string/system',
        causes: ['Soiling/dirt on panels', 'Partial shading', 'Panel degradation', 'Bypass diode failure', 'Connection issues'],
        diagnosis: [
          'Compare string voltages - should be within 5% of each other',
          'Measure individual panel voltages to isolate faulty panel',
          'Check for hot spots using IR camera',
          'Verify no shading during peak sun hours',
          'Clean panels and retest',
        ],
        solution: 'If one panel shows significantly lower voltage, check bypass diodes and junction box connections. Soiling typically reduces output 5-25%.',
        severity: 'medium',
      },
      {
        symptom: 'Hot spots visible on IR scan',
        causes: ['Cell damage', 'Bypass diode failure', 'Delamination', 'Snail trails/PID', 'Connection resistance'],
        diagnosis: [
          'IR scan during peak irradiance (>800 W/m²)',
          'Hot spot >10°C above ambient indicates problem',
          'Check corresponding cell visually for damage',
          'Test bypass diodes with multimeter',
        ],
        solution: 'Hot spots can cause fire risk. Replace affected panel if cell damage confirmed. Junction box hot spots often indicate loose connections.',
        severity: 'high',
      },
      {
        symptom: 'Panel glass cracked',
        causes: ['Thermal stress', 'Hail damage', 'Installation damage', 'Frame stress'],
        diagnosis: [
          'Inspect for moisture ingress',
          'Check if crack extends to cells',
          'Verify frame is not bent or stressed',
        ],
        solution: 'Minor edge cracks may be monitored. Cracks over cells require replacement to prevent moisture damage and electrical faults.',
        severity: 'medium',
      },
    ],
  },
  {
    category: 'Inverter Faults',
    icon: '📟',
    faults: [
      {
        symptom: 'Inverter not producing power',
        causes: ['DC voltage out of range', 'Grid fault detected', 'Internal fault', 'Overtemperature', 'Isolation fault'],
        diagnosis: [
          'Check inverter display for fault code',
          'Measure DC input voltage - within MPPT range?',
          'Check grid voltage and frequency at AC output',
          'Verify AC breaker is ON',
          'Check inverter temperature',
        ],
        solution: 'Most inverter shutdowns are grid-related or thermal. Reset after identifying cause. Isolation faults require DC wiring inspection.',
        severity: 'high',
      },
      {
        symptom: 'Inverter clipping (limiting output)',
        causes: ['DC/AC ratio too high', 'Grid voltage high', 'Inverter overheating', 'Reactive power demand'],
        diagnosis: [
          'Compare DC input power to AC output power',
          'Measure grid voltage during peak production',
          'Check inverter temperature',
          'Review clipping hours in monitoring data',
        ],
        solution: 'Some clipping (2-3%) is normal with 1.2-1.3 DC/AC ratio. Excessive clipping indicates oversized array or grid voltage issues.',
        severity: 'low',
      },
      {
        symptom: 'MPPT not tracking properly',
        causes: ['Partial shading', 'String mismatch', 'MPPT algorithm issue', 'Wide voltage variation'],
        diagnosis: [
          'Check if voltage oscillates widely',
          'Verify all strings have same number of panels',
          'Check for shading pattern changes',
          'Update inverter firmware',
        ],
        solution: 'MPPT struggles with partial shading. Consider panel-level optimizers for shaded installations. String matching is critical.',
        severity: 'medium',
      },
      {
        symptom: 'Ground/Earth fault alarm',
        causes: ['Insulation failure', 'Moisture in junction box', 'Cable damage', 'Rodent damage'],
        diagnosis: [
          'Measure insulation resistance of each string (should be >1MΩ)',
          'Disconnect strings one by one to isolate fault',
          'Inspect junction boxes for moisture',
          'Check cable runs for physical damage',
        ],
        solution: 'Earth faults are safety critical. System should not operate until fault is located and repaired. Check MC4 connectors and junction boxes first.',
        severity: 'critical',
      },
    ],
  },
  {
    category: 'Battery Issues',
    icon: '🔋',
    faults: [
      {
        symptom: 'Battery not holding charge',
        causes: ['Sulfation (lead-acid)', 'Cell imbalance (lithium)', 'Overcharge damage', 'Age/cycle wear', 'Incorrect charge settings'],
        diagnosis: [
          'Measure individual cell/battery voltages',
          'Perform capacity test (discharge at known rate)',
          'Check charge controller settings match battery type',
          'Inspect for physical damage or swelling',
        ],
        solution: 'Lead-acid batteries typically last 3-7 years depending on usage. Lithium 10-15 years. Deep discharge accelerates degradation.',
        severity: 'high',
      },
      {
        symptom: 'Battery overheating',
        causes: ['Overcharging', 'High discharge rate', 'Internal short', 'Poor ventilation', 'BMS failure (lithium)'],
        diagnosis: [
          'Measure charging voltage - should not exceed rated max',
          'Check ambient temperature and ventilation',
          'Monitor charge/discharge current',
          'Inspect BMS operation for lithium batteries',
        ],
        solution: 'Battery temperature should not exceed 45°C. Reduce charge rate or improve ventilation. Swelling lithium cells are dangerous - replace immediately.',
        severity: 'critical',
      },
      {
        symptom: 'Low battery backup time',
        causes: ['Reduced capacity (age)', 'Increased loads', 'Charge not completing', 'Temperature effects'],
        diagnosis: [
          'Compare current capacity to original spec',
          'Review load consumption patterns',
          'Verify charging is reaching 100% SOC',
          'Check battery temperature during operation',
        ],
        solution: 'Battery capacity reduces over time. At 70-80% original capacity, plan replacement. Ensure loads have not increased beyond design.',
        severity: 'medium',
      },
    ],
  },
  {
    category: 'Connection Issues',
    icon: '🔌',
    faults: [
      {
        symptom: 'MC4 connector hot/melted',
        causes: ['Poor crimp connection', 'Mixed connector brands', 'Moisture ingress', 'Overcurrent'],
        diagnosis: [
          'IR scan to identify hot connections',
          'Check connector matching (same brand)',
          'Inspect crimp quality',
          'Verify current is within connector rating',
        ],
        solution: 'Hot MC4 connectors are fire hazards. Replace both male and female. Never mix different MC4 brands. Use proper crimping tool.',
        severity: 'critical',
      },
      {
        symptom: 'High resistance at terminal',
        causes: ['Loose connection', 'Corrosion', 'Undersized cable', 'Over-torqued (damaged thread)'],
        diagnosis: [
          'IR scan during peak current',
          'Check torque against specifications',
          'Inspect for discoloration or corrosion',
          'Measure voltage drop across connection',
        ],
        solution: 'Re-torque to specification. If terminal is damaged, replace. Apply anti-oxidant compound for aluminum connections.',
        severity: 'high',
      },
    ],
  },
];

// INVERTER REFERENCE
const INVERTER_FAULTS = [
  {
    brand: 'SMA',
    models: 'Sunny Boy, Sunny Tripower',
    commonCodes: [
      { code: '3501', fault: 'Grid fault - frequency', action: 'Check grid frequency, wait for auto-reset' },
      { code: '3601', fault: 'Grid fault - voltage', action: 'Check grid voltage, adjust grid parameters if allowed' },
      { code: '6001-6438', fault: 'Self-diagnosis error', action: 'Check DC input, restart inverter' },
      { code: '7001-7012', fault: 'Ground fault', action: 'Measure insulation resistance of strings' },
      { code: '8003', fault: 'String fault', action: 'Check string voltage and connections' },
    ],
  },
  {
    brand: 'Fronius',
    models: 'Primo, Symo, GEN24',
    commonCodes: [
      { code: '102', fault: 'AC voltage too high', action: 'Check grid voltage, utility may need adjustment' },
      { code: '103', fault: 'AC voltage too low', action: 'Check grid connection, cable sizing' },
      { code: '301', fault: 'DC overvoltage', action: 'Check string configuration, cool down panels' },
      { code: '306', fault: 'DC overcurrent', action: 'Check for short circuit in DC wiring' },
      { code: '502', fault: 'Insulation fault', action: 'Test DC insulation resistance' },
    ],
  },
  {
    brand: 'Huawei',
    models: 'SUN2000',
    commonCodes: [
      { code: '2001', fault: 'PV string fault', action: 'Check string voltage, connections' },
      { code: '2011', fault: 'DC arc detected', action: 'Inspect all DC connections for damage' },
      { code: '2026', fault: 'PV string reversed', action: 'Check polarity of DC connections' },
      { code: '5001', fault: 'Grid abnormality', action: 'Check grid voltage and frequency' },
      { code: '5035', fault: 'Leakage current high', action: 'Check panel and wiring insulation' },
    ],
  },
  {
    brand: 'GoodWe',
    models: 'DNS, SDT, SMT Series',
    commonCodes: [
      { code: 'E004', fault: 'No grid connection', action: 'Check AC wiring and breaker' },
      { code: 'E006', fault: 'Grid frequency error', action: 'Verify grid frequency, adjust settings' },
      { code: 'E008', fault: 'DC bus overvoltage', action: 'Check string voltage, shading' },
      { code: 'E019', fault: 'ISO fault', action: 'Measure DC insulation to ground' },
      { code: 'E022', fault: 'Ground fault', action: 'Check panel frame earthing' },
    ],
  },
  {
    brand: 'Growatt',
    models: 'MIN, MIC, MOD Series',
    commonCodes: [
      { code: '101', fault: 'Grid overvoltage', action: 'Check grid voltage, contact utility if persistent' },
      { code: '102', fault: 'Grid undervoltage', action: 'Check AC cable sizing, grid connection' },
      { code: '201', fault: 'PV overvoltage', action: 'Verify string design, check Voc in cold morning' },
      { code: '401', fault: 'Insulation fault', action: 'Test each string insulation separately' },
      { code: '501', fault: 'DC injection high', action: 'Internal fault, may need service' },
    ],
  },
];

export default function SolarSolutionHub() {
  const [activeTab, setActiveTab] = useState('installation');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const [expandedInverter, setExpandedInverter] = useState<string | null>(null);

  return (
    <main className="bg-black min-h-screen">
      <CinematicHeroImage
        src="/images/1 (1).png"
        alt="Solar Power Solutions"
        title="Solar Power Solutions Hub"
        subtitle="Complete guide to solar installation, maintenance, and troubleshooting. From panel selection to inverter fault codes - everything you need to maximize your solar investment."
        colorGrade="hollywood"
        height="h-[50vh]"
      />

      {/* Tab Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {SOLAR_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 text-black'
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
                <h2 className="text-3xl font-bold text-white mb-4">Solar Installation Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Professional-grade installation procedures from site assessment to final commissioning. 
                  These guidelines ensure safe, efficient, and code-compliant solar installations.
                </p>
              </div>

              {INSTALLATION_GUIDES.map((guide, idx) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-yellow-500/20 overflow-hidden"
                >
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{guide.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{guide.title}</h3>
                        <p className="text-yellow-400 text-sm">Phase {idx + 1} of {INSTALLATION_GUIDES.length}</p>
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
                            step.critical ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                          }`}>
                            {stepIdx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm">{step.step}</p>
                            {step.critical && (
                              <span className="text-red-400 text-xs mt-1 block">⚠️ Critical - affects system safety or performance</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                      <p className="text-yellow-400 text-sm">
                        <strong>💡 Pro Tip:</strong> {guide.proTip}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Link to Sizing Hub */}
              <div className="mt-12">
                <Link href="/solutions/solar-sizing" className="block group">
                  <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-8 border border-yellow-500/30 hover:border-yellow-400 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">📊 Need Help Sizing Your System?</h3>
                        <p className="text-gray-400 mt-2">Visit our Solar Sizing Solutions Hub for detailed load calculations, battery sizing, and panel configuration guides.</p>
                      </div>
                      <span className="text-4xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </div>
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
                <h2 className="text-3xl font-bold text-white mb-4">Solar Maintenance Schedules</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Proper maintenance extends system life and maximizes energy production. 
                  Follow these schedules to protect your solar investment.
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
                      {schedule.parts && (
                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                          <p className="text-gray-400 text-xs font-medium mb-2">Equipment/Parts Needed:</p>
                          <p className="text-gray-300 text-xs">{schedule.parts.join(' • ')}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Cleaning Tips */}
              <div className="mt-12 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-2xl p-8 border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-6">🧹 Panel Cleaning Best Practices</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-bold">When to Clean</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Early morning or evening (cool panels)</li>
                      <li>• After dust storms or heavy bird activity</li>
                      <li>• When output drops 10%+ from baseline</li>
                      <li>• Minimum quarterly in dusty areas</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-white font-bold">How to Clean</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Use soft brush or squeegee</li>
                      <li>• Clean water only (deionized if hard water)</li>
                      <li>• No abrasive materials or harsh chemicals</li>
                      <li>• Work from top to bottom</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-white font-bold">Safety</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Never walk on panels</li>
                      <li>• Use appropriate fall protection</li>
                      <li>• Turn off system if cleaning accessible areas</li>
                      <li>• Consider professional cleaning for large systems</li>
                    </ul>
                  </div>
                </div>
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
                <h2 className="text-3xl font-bold text-white mb-4">Solar Fault Diagnosis</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Systematic troubleshooting for all solar system components. 
                  Click any fault for detailed diagnostic procedures and solutions.
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
                      transition={{ delay: faultIdx * 0.05 }}
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
                                <div className="space-y-2">
                                  {fault.diagnosis.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                      <span className="text-cyan-400">{idx + 1}.</span>
                                      <span className="text-gray-300">{step}</span>
                                    </div>
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

          {/* INVERTERS SECTION */}
          {activeTab === 'inverters' && (
            <motion.div
              key="inverters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Inverter Fault Code Reference</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Quick reference for common fault codes across major inverter brands. 
                  Click any brand to see fault codes and recommended actions.
                </p>
              </div>

              <div className="grid gap-6">
                {INVERTER_FAULTS.map((inverter, idx) => (
                  <motion.div
                    key={inverter.brand}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-2xl border border-blue-500/30 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedInverter(expandedInverter === inverter.brand ? null : inverter.brand)}
                      className="w-full text-left p-6 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">{inverter.brand}</h3>
                          <p className="text-gray-400 text-sm">{inverter.models}</p>
                        </div>
                        <motion.span
                          animate={{ rotate: expandedInverter === inverter.brand ? 180 : 0 }}
                          className="text-gray-400 text-xl"
                        >
                          ▼
                        </motion.span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedInverter === inverter.brand && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-blue-500/20"
                        >
                          <div className="p-6">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-white/10">
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">Code</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">Fault</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {inverter.commonCodes.map((fault, fidx) => (
                                  <tr key={fidx}>
                                    <td className="px-3 py-2">
                                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded font-mono text-xs">
                                        {fault.code}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-white text-sm">{fault.fault}</td>
                                    <td className="px-3 py-2 text-gray-400 text-sm">{fault.action}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* BATTERIES SECTION */}
          {activeTab === 'batteries' && (
            <motion.div
              key="batteries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Battery Systems Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Complete guide to solar battery systems including selection, installation, and maintenance.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Lead-Acid Batteries */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-amber-500/30 p-6">
                  <h3 className="text-xl font-bold text-amber-400 mb-4">🔋 Lead-Acid Batteries</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Types:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• <strong>Flooded:</strong> Lowest cost, requires maintenance (water top-up)</li>
                        <li>• <strong>AGM:</strong> Sealed, maintenance-free, faster charging</li>
                        <li>• <strong>Gel:</strong> Best deep cycle life, temperature tolerant</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Charging Parameters (12V):</h4>
                      <div className="text-gray-300 text-sm space-y-1">
                        <p>• Bulk charge: 14.4-14.8V</p>
                        <p>• Float charge: 13.2-13.6V</p>
                        <p>• Equalization: 15.0-15.5V (flooded only)</p>
                        <p>• Temperature comp: -3mV/°C/cell</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Expected Life:</h4>
                      <p className="text-gray-300 text-sm">3-7 years / 500-1500 cycles at 50% DOD</p>
                    </div>
                  </div>
                </div>

                {/* Lithium Batteries */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 p-6">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">⚡ Lithium Batteries</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Types:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• <strong>LiFePO4:</strong> Safest, longest life, lower energy density</li>
                        <li>• <strong>NMC:</strong> Higher energy density, requires careful BMS</li>
                        <li>• <strong>LTO:</strong> Fastest charging, extreme cycle life</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">LiFePO4 Parameters (48V):</h4>
                      <div className="text-gray-300 text-sm space-y-1">
                        <p>• Full charge: 58.4V (3.65V/cell)</p>
                        <p>• Nominal: 51.2V (3.2V/cell)</p>
                        <p>• Low cutoff: 44.8V (2.8V/cell)</p>
                        <p>• Charge rate: 0.5-1C typical</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Expected Life:</h4>
                      <p className="text-gray-300 text-sm">10-15 years / 3000-6000 cycles at 80% DOD</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Battery Sizing */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-6">📊 Battery Sizing Formula</h3>
                <div className="bg-black/30 rounded-lg p-6">
                  <p className="text-white font-mono text-lg mb-4">
                    Battery Capacity (Ah) = (Daily Load × Autonomy Days) ÷ (DOD × System Voltage × Efficiency)
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="text-white font-bold mb-2">Example Calculation:</h4>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Daily load: 10 kWh</li>
                        <li>• Autonomy: 2 days</li>
                        <li>• DOD: 50% (lead-acid)</li>
                        <li>• System voltage: 48V</li>
                        <li>• Efficiency: 85%</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2">Result:</h4>
                      <p className="text-green-400 text-lg font-mono">
                        = (10,000 × 2) ÷ (0.5 × 48 × 0.85)
                      </p>
                      <p className="text-green-400 text-2xl font-bold mt-2">
                        = 980 Ah @ 48V
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        (5 × 200Ah batteries in parallel)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-3xl p-8 md:p-12 border border-yellow-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Solar System Support?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            From system design to troubleshooting underperforming installations, our solar experts 
            have the knowledge and equipment to maximize your solar investment.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Solar Assessment" />
          </div>
        </div>
      </section>
    </main>
  );
}
