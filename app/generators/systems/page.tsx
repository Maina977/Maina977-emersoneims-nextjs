'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Complete Generator Systems Data
const GENERATOR_SYSTEMS = [
  {
    id: 'engine-system',
    name: 'Engine System',
    icon: '🔥',
    color: 'orange',
    description: 'The heart of your generator - converts fuel into mechanical energy through combustion',
    overview: 'The diesel engine is the primary power source, converting chemical energy in fuel to mechanical rotation that drives the alternator. Understanding engine operation is crucial for proper maintenance and troubleshooting.',
    components: [
      { name: 'Cylinder Block', desc: 'Main structure housing pistons and crankshaft' },
      { name: 'Cylinder Head', desc: 'Contains valves, injectors, and combustion chambers' },
      { name: 'Pistons', desc: 'Convert combustion pressure to rotational force' },
      { name: 'Crankshaft', desc: 'Transforms piston motion to rotational output' },
      { name: 'Camshaft', desc: 'Controls valve timing for intake and exhaust' },
      { name: 'Valves', desc: 'Inlet and exhaust valves control gas flow' },
      { name: 'Turbocharger', desc: 'Forces more air into cylinders for more power' },
      { name: 'Oil System', desc: 'Lubricates and cools internal components' },
    ],
    commonIssues: [
      { issue: 'Overheating', causes: 'Low coolant, blocked radiator, failed thermostat', severity: 'critical' },
      { issue: 'Low Oil Pressure', causes: 'Oil leak, worn bearings, clogged filter', severity: 'critical' },
      { issue: 'White Smoke', causes: 'Coolant leak into cylinders, head gasket failure', severity: 'high' },
      { issue: 'Black Smoke', causes: 'Excess fuel, clogged air filter, injector issues', severity: 'medium' },
      { issue: 'Hard Starting', causes: 'Weak batteries, glow plug failure, fuel issues', severity: 'medium' },
      { issue: 'Knocking', causes: 'Injector timing, worn bearings, low oil', severity: 'high' },
    ],
    maintenanceSchedule: [
      { interval: '250 Hours', tasks: 'Oil & filter change, visual inspection' },
      { interval: '500 Hours', tasks: 'Air filter, fuel filter, valve clearance check' },
      { interval: '1000 Hours', tasks: 'Injector service, turbo inspection' },
      { interval: '2000 Hours', tasks: 'Major service, timing belt/chain check' },
    ],
  },
  {
    id: 'fuel-system',
    name: 'Fuel System',
    icon: '⛽',
    color: 'yellow',
    description: 'Stores, filters, and delivers clean fuel to the engine for optimal combustion',
    overview: 'The fuel system ensures a consistent supply of clean, properly pressurized fuel to the injectors. Contaminated or air-mixed fuel is the leading cause of generator failures.',
    components: [
      { name: 'Fuel Tank', desc: 'Stores diesel fuel with level sensor and drain' },
      { name: 'Fuel Lines', desc: 'Supply and return lines connecting components' },
      { name: 'Primary Filter', desc: 'First stage filtration, removes water and large particles' },
      { name: 'Secondary Filter', desc: 'Fine filtration before injection pump' },
      { name: 'Lift/Transfer Pump', desc: 'Draws fuel from tank to injection system' },
      { name: 'Injection Pump', desc: 'High pressure pump for injector supply' },
      { name: 'Fuel Injectors', desc: 'Atomize fuel into combustion chamber' },
      { name: 'Return System', desc: 'Returns excess fuel to tank' },
    ],
    commonIssues: [
      { issue: 'Contaminated Fuel', causes: 'Water, dirt, biological growth in tank', severity: 'high' },
      { issue: 'Clogged Filters', causes: 'Normal wear, dirty fuel, water contamination', severity: 'medium' },
      { issue: 'Air in Fuel Lines', causes: 'Loose connections, filter change without priming', severity: 'medium' },
      { issue: 'Injector Failure', causes: 'Dirty fuel, high hours, poor atomization', severity: 'high' },
      { issue: 'Fuel Pump Failure', causes: 'Contamination, wear, electrical issues', severity: 'critical' },
    ],
    maintenanceSchedule: [
      { interval: '250 Hours', tasks: 'Drain water separator, check fuel level' },
      { interval: '500 Hours', tasks: 'Replace fuel filters, inspect lines' },
      { interval: '2000 Hours', tasks: 'Injector cleaning/testing, pump inspection' },
      { interval: 'Annually', tasks: 'Tank cleaning, fuel quality test' },
    ],
  },
  {
    id: 'cooling-system',
    name: 'Cooling System',
    icon: '❄️',
    color: 'cyan',
    description: 'Maintains optimal engine temperature by removing excess heat from combustion',
    overview: 'The cooling system removes approximately 30% of the heat energy produced during combustion. Proper cooling prevents overheating damage and maintains optimal operating temperature for efficiency.',
    components: [
      { name: 'Radiator', desc: 'Heat exchanger that dissipates heat to air' },
      { name: 'Water Pump', desc: 'Circulates coolant through the system' },
      { name: 'Thermostat', desc: 'Regulates coolant flow based on temperature' },
      { name: 'Coolant Hoses', desc: 'Connect radiator, engine, and heater core' },
      { name: 'Cooling Fan', desc: 'Draws air through radiator for heat removal' },
      { name: 'Fan Belt', desc: 'Drives water pump and fan from engine' },
      { name: 'Temperature Sensors', desc: 'Monitor coolant temperature for control/alarm' },
      { name: 'Expansion Tank', desc: 'Accommodates coolant expansion when hot' },
    ],
    commonIssues: [
      { issue: 'Coolant Leaks', causes: 'Failed hoses, radiator damage, pump seal', severity: 'high' },
      { issue: 'Thermostat Stuck', causes: 'Age, corrosion, debris', severity: 'medium' },
      { issue: 'Radiator Blockage', causes: 'External debris, internal scale/deposits', severity: 'medium' },
      { issue: 'Fan Belt Failure', causes: 'Wear, tension issues, pulley misalignment', severity: 'critical' },
      { issue: 'Water Pump Failure', causes: 'Bearing wear, seal failure, cavitation', severity: 'critical' },
    ],
    maintenanceSchedule: [
      { interval: 'Daily', tasks: 'Check coolant level, visual inspection' },
      { interval: '500 Hours', tasks: 'Inspect hoses, check belt tension' },
      { interval: '1000 Hours', tasks: 'Test coolant condition, check thermostat' },
      { interval: '2 Years', tasks: 'Flush and replace coolant' },
    ],
  },
  {
    id: 'electrical-system',
    name: 'Electrical System',
    icon: '🔌',
    color: 'blue',
    description: 'Generates AC power and manages all electrical control functions',
    overview: 'The electrical system includes both the power generation (alternator) and control systems. Understanding voltage regulation and protection systems is essential for reliable operation.',
    components: [
      { name: 'Alternator/Generator', desc: 'Converts mechanical rotation to AC electricity' },
      { name: 'AVR (Automatic Voltage Regulator)', desc: 'Maintains stable output voltage' },
      { name: 'Exciter', desc: 'Provides initial field current to alternator' },
      { name: 'Batteries', desc: 'Provides starting power and control backup' },
      { name: 'Starter Motor', desc: 'Cranks engine for starting' },
      { name: 'Control Panel', desc: 'Monitoring, protection, and control interface' },
      { name: 'Circuit Breakers', desc: 'Protects against overload and short circuit' },
      { name: 'Wiring Harness', desc: 'Connects all electrical components' },
    ],
    commonIssues: [
      { issue: 'Low Voltage Output', causes: 'AVR failure, loose connections, overload', severity: 'high' },
      { issue: 'Voltage Fluctuation', causes: 'AVR adjustment, speed hunting, load changes', severity: 'medium' },
      { issue: 'No Output', causes: 'Loss of residual magnetism, AVR failure, wiring', severity: 'critical' },
      { issue: 'Battery Failure', causes: 'Age, charger failure, parasitic drain', severity: 'medium' },
      { issue: 'Starter Problems', causes: 'Battery, solenoid, motor wear', severity: 'high' },
    ],
    maintenanceSchedule: [
      { interval: 'Weekly', tasks: 'Check battery voltage, visual inspection' },
      { interval: '250 Hours', tasks: 'Clean connections, check belt tension' },
      { interval: '1000 Hours', tasks: 'Test AVR, inspect brushes, check bearings' },
      { interval: 'Annually', tasks: 'Insulation resistance test, load bank test' },
    ],
  },
  {
    id: 'ats-system',
    name: 'ATS (Auto Transfer Switch)',
    icon: '🔀',
    color: 'purple',
    description: 'Automatically transfers load between mains power and generator',
    overview: 'The ATS monitors mains power and automatically starts the generator and transfers load when mains fails. It ensures seamless power continuity for critical loads.',
    components: [
      { name: 'Mains Contactor', desc: 'Connects load to utility power' },
      { name: 'Generator Contactor', desc: 'Connects load to generator power' },
      { name: 'Control Module', desc: 'Logic controller for transfer sequencing' },
      { name: 'Voltage Sensors', desc: 'Monitor mains and generator voltage' },
      { name: 'Time Delay Relays', desc: 'Sequence transfer timing safely' },
      { name: 'Neutral Switching', desc: 'Transfers neutral for isolated systems' },
      { name: 'Manual Override', desc: 'Allows manual transfer when needed' },
      { name: 'Status Indicators', desc: 'Shows current power source and status' },
    ],
    commonIssues: [
      { issue: 'Delayed Transfer', causes: 'Time delay settings, sensor calibration', severity: 'medium' },
      { issue: 'Contactor Stuck', causes: 'Mechanical wear, coil failure, debris', severity: 'critical' },
      { issue: 'No Auto Start', causes: 'Control module, wiring, generator fault', severity: 'high' },
      { issue: 'False Transfer', causes: 'Voltage settings, transient sensitivity', severity: 'medium' },
      { issue: 'Parallel Operation', causes: 'Interlock failure - CRITICAL HAZARD', severity: 'critical' },
    ],
    maintenanceSchedule: [
      { interval: 'Monthly', tasks: 'Test transfer operation, check indicators' },
      { interval: 'Quarterly', tasks: 'Exercise full transfer sequence' },
      { interval: 'Annually', tasks: 'Clean contacts, check all connections' },
      { interval: '5 Years', tasks: 'Replace contactors if showing wear' },
    ],
  },
  {
    id: 'exhaust-system',
    name: 'Exhaust System',
    icon: '💨',
    color: 'gray',
    description: 'Safely expels combustion gases and reduces noise levels',
    overview: 'The exhaust system removes combustion gases from the engine, reduces noise through silencers, and may include emission controls. Proper exhaust is critical for safety and environmental compliance.',
    components: [
      { name: 'Exhaust Manifold', desc: 'Collects exhaust from all cylinders' },
      { name: 'Turbo Outlet', desc: 'Connection from turbocharger' },
      { name: 'Flexible Connector', desc: 'Absorbs vibration and thermal expansion' },
      { name: 'Silencer/Muffler', desc: 'Reduces exhaust noise levels' },
      { name: 'Exhaust Piping', desc: 'Routes gases away from enclosure' },
      { name: 'Rain Cap', desc: 'Prevents water entry when not running' },
      { name: 'Lagging/Insulation', desc: 'Protects from burns, reduces radiated heat' },
    ],
    commonIssues: [
      { issue: 'Exhaust Leak', causes: 'Gasket failure, crack, loose connections', severity: 'high' },
      { issue: 'Excessive Backpressure', causes: 'Blocked silencer, restricted pipe', severity: 'medium' },
      { issue: 'Excessive Noise', causes: 'Silencer failure, leaks, loose parts', severity: 'low' },
      { issue: 'Corrosion', causes: 'Condensation, salt air, poor drainage', severity: 'medium' },
      { issue: 'Heat Damage', causes: 'Missing insulation, blocked airflow', severity: 'high' },
    ],
    maintenanceSchedule: [
      { interval: '250 Hours', tasks: 'Visual inspection for leaks and damage' },
      { interval: '1000 Hours', tasks: 'Check hangers, inspect silencer internals' },
      { interval: '2000 Hours', tasks: 'Replace flexible connector if worn' },
      { interval: 'As Needed', tasks: 'Replace corroded sections' },
    ],
  },
  {
    id: 'canopy-enclosure',
    name: 'Canopy & Enclosure',
    icon: '🏠',
    color: 'slate',
    description: 'Protects generator from weather while reducing noise emissions',
    overview: 'The enclosure provides weather protection, security, and noise attenuation. Proper ventilation is critical for cooling and must be maintained for reliable operation.',
    components: [
      { name: 'Sound Panels', desc: 'Absorb and block engine noise' },
      { name: 'Ventilation Louvers', desc: 'Allow airflow for cooling' },
      { name: 'Access Doors', desc: 'Provide maintenance access' },
      { name: 'Door Seals', desc: 'Maintain sound and weather integrity' },
      { name: 'Lifting Points', desc: 'Safe crane attachment locations' },
      { name: 'Base Frame', desc: 'Structural support and vibration isolation' },
      { name: 'Locks & Latches', desc: 'Secure doors and panels' },
      { name: 'Emergency Stop', desc: 'External shutdown access' },
    ],
    commonIssues: [
      { issue: 'Corrosion', causes: 'Coastal environment, paint damage, pooled water', severity: 'medium' },
      { issue: 'Seal Deterioration', causes: 'Age, UV exposure, mechanical wear', severity: 'low' },
      { issue: 'Blocked Ventilation', causes: 'Debris, bird nests, vegetation', severity: 'high' },
      { issue: 'Door Misalignment', causes: 'Settlement, impact damage, hinge wear', severity: 'low' },
      { issue: 'Panel Damage', causes: 'Impact, vandalism, corrosion', severity: 'medium' },
    ],
    maintenanceSchedule: [
      { interval: 'Monthly', tasks: 'Clear debris from louvers, check locks' },
      { interval: 'Quarterly', tasks: 'Inspect seals, lubricate hinges' },
      { interval: 'Annually', tasks: 'Touch up paint, check structural integrity' },
      { interval: 'As Needed', tasks: 'Replace damaged panels or seals' },
    ],
  },
  {
    id: 'fuel-tank-automation',
    name: 'Fuel Tank Automation',
    icon: '🤖',
    color: 'emerald',
    description: 'Automatic fuel level monitoring, alerts, and refill management',
    overview: 'Automated fuel systems ensure continuous generator operation by monitoring fuel levels, triggering alerts, and managing automatic refilling from bulk storage or delivery scheduling.',
    components: [
      { name: 'Level Sensors', desc: 'Continuous fuel level monitoring' },
      { name: 'Float Switches', desc: 'High/low level alarm triggers' },
      { name: 'Auto-Fill Valve', desc: 'Solenoid-controlled fuel inlet' },
      { name: 'Transfer Pump', desc: 'Moves fuel from bulk storage' },
      { name: 'Remote Monitoring', desc: 'GSM/IP communication for alerts' },
      { name: 'Leak Detection', desc: 'Monitors for fuel spills/leaks' },
      { name: 'Overfill Prevention', desc: 'High-high cutoff protection' },
      { name: 'Flow Meter', desc: 'Tracks fuel consumption' },
    ],
    commonIssues: [
      { issue: 'Sensor Drift', causes: 'Calibration, contamination, damage', severity: 'medium' },
      { issue: 'Pump Failure', causes: 'Motor failure, blockage, electrical', severity: 'high' },
      { issue: 'Communication Loss', causes: 'Network, power, module failure', severity: 'medium' },
      { issue: 'Overfill Event', causes: 'Sensor failure, valve stuck open', severity: 'critical' },
      { issue: 'Low Fuel Alarm', causes: 'Delivery delay, consumption spike', severity: 'high' },
    ],
    maintenanceSchedule: [
      { interval: 'Weekly', tasks: 'Verify readings against dipstick' },
      { interval: 'Monthly', tasks: 'Test alarms, check communication' },
      { interval: 'Quarterly', tasks: 'Calibrate sensors, test pumps' },
      { interval: 'Annually', tasks: 'Full system test including overfill protection' },
    ],
  },
];

export default function GeneratorSystemsPage() {
  const [activeSystem, setActiveSystem] = useState<string | null>(null);

  const selectedSystem = GENERATOR_SYSTEMS.find(s => s.id === activeSystem);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
              📚 Educational Content
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Generator <span className="text-cyan-400">Systems Guide</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Complete guide to every generator system. Learn components, common issues,
              and maintenance schedules. Click any system to explore in detail.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Systems Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {GENERATOR_SYSTEMS.map((system, index) => (
              <motion.button
                key={system.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveSystem(activeSystem === system.id ? null : system.id)}
                className={`text-left p-6 rounded-2xl border transition-all ${
                  activeSystem === system.id
                    ? 'bg-cyan-500/20 border-cyan-500'
                    : 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                <span className="text-4xl block mb-3">{system.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{system.name}</h3>
                <p className="text-gray-400 text-sm">{system.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected System Detail */}
      <AnimatePresence>
        {selectedSystem && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="py-12 bg-slate-900/50"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl">{selectedSystem.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedSystem.name}</h2>
                  <p className="text-gray-400">{selectedSystem.overview}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Components */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Components</h3>
                  <div className="space-y-3">
                    {selectedSystem.components.map(comp => (
                      <div key={comp.name} className="border-b border-slate-700 pb-2">
                        <p className="text-cyan-400 font-medium">{comp.name}</p>
                        <p className="text-gray-400 text-sm">{comp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Issues */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Common Issues</h3>
                  <div className="space-y-3">
                    {selectedSystem.commonIssues.map(issue => (
                      <div key={issue.issue} className="border-b border-slate-700 pb-2">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium">{issue.issue}</p>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            issue.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>{issue.severity}</span>
                        </div>
                        <p className="text-gray-400 text-sm">Causes: {issue.causes}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance Schedule */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Maintenance Schedule</h3>
                  <div className="space-y-3">
                    {selectedSystem.maintenanceSchedule.map(item => (
                      <div key={item.interval} className="border-b border-slate-700 pb-2">
                        <p className="text-emerald-400 font-medium">{item.interval}</p>
                        <p className="text-gray-400 text-sm">{item.tasks}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Diagnostic CTA */}
              <div className="mt-8 text-center">
                <a
                  href="/generator-oracle"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl"
                >
                  🔍 Diagnose {selectedSystem.name} Issues with AI
                </a>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Back Link */}
      <div className="py-12 text-center">
        <Link href="/generators" className="text-amber-400 hover:text-amber-300 underline">
          ← Back to Generators Bible
        </Link>
      </div>
    </main>
  );
}
