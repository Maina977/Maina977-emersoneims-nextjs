'use client';

/**
 * Solar Maintenance Hub
 * Complete solar system maintenance with weather integration
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AnalogClock, AnalogCalendar, WeatherWidget, WidgetBar } from '@/components/ui/AnalogWidgets';

// Kenya locations for weather
const KENYA_LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
  'Malindi', 'Kilifi', 'Karen', 'Embakasi', 'Thika',
  'Nyeri', 'Machakos', 'Garissa', 'Meru', 'Kakamega'
];

// Solar System Types
const SOLAR_SYSTEMS = [
  {
    id: 'residential',
    name: 'Residential Solar',
    icon: '🏠',
    capacity: '1-10 kW',
    description: 'Home solar systems with battery backup for reliable power supply.',
    components: ['Solar Panels', 'Inverter', 'Battery Bank', 'Charge Controller', 'Distribution Board'],
    maintenanceTasks: [
      'Panel cleaning and inspection',
      'Battery water level check',
      'Connection tightening',
      'Inverter ventilation check',
      'Performance monitoring'
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial Solar',
    icon: '🏢',
    capacity: '10-100 kW',
    description: 'Medium-scale solar installations for businesses and institutions.',
    components: ['Solar Array', 'String Inverters', 'Battery Storage', 'Monitoring System', 'Grid Tie'],
    maintenanceTasks: [
      'Array inspection and cleaning',
      'String voltage verification',
      'Inverter performance check',
      'Battery state of health',
      'Grid synchronization test'
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial Solar',
    icon: '🏭',
    capacity: '100+ kW',
    description: 'Large-scale solar farms and industrial installations.',
    components: ['Solar Farm', 'Central Inverters', 'SCADA System', 'Transformers', 'Substation'],
    maintenanceTasks: [
      'Thermal imaging inspection',
      'IV curve tracing',
      'Transformer oil analysis',
      'SCADA calibration',
      'Grid compliance testing'
    ]
  },
  {
    id: 'hybrid',
    name: 'Hybrid Systems',
    icon: '⚡',
    capacity: '5-500 kW',
    description: 'Solar-generator-battery hybrid systems for maximum reliability.',
    components: ['Solar Array', 'Generator', 'Hybrid Inverter', 'Battery Bank', 'ATS Panel'],
    maintenanceTasks: [
      'Solar-generator synchronization',
      'Battery cycling test',
      'ATS operation check',
      'Fuel optimization review',
      'System efficiency audit'
    ]
  },
  {
    id: 'offgrid',
    name: 'Off-Grid Systems',
    icon: '🏕️',
    capacity: '0.5-50 kW',
    description: 'Standalone systems for remote locations without grid access.',
    components: ['Solar Panels', 'MPPT Controller', 'Battery Bank', 'Off-Grid Inverter', 'Load Controller'],
    maintenanceTasks: [
      'Battery equalization',
      'Charge controller calibration',
      'Load priority configuration',
      'System autonomy test',
      'Backup assessment'
    ]
  },
  {
    id: 'solar-pump',
    name: 'Solar Water Pumps',
    icon: '💧',
    capacity: '0.5-50 HP',
    description: 'Solar-powered water pumping for irrigation and domestic use.',
    components: ['Solar Array', 'VFD/Controller', 'Submersible Pump', 'Water Tank', 'Level Sensors'],
    maintenanceTasks: [
      'Pump efficiency test',
      'VFD parameter check',
      'Water quality analysis',
      'Tank inspection',
      'Irrigation schedule optimization'
    ]
  }
];

// Common Solar Faults
const SOLAR_FAULTS = [
  {
    code: 'SOL-001',
    title: 'Low Solar Production',
    severity: 'warning',
    description: 'Solar panels producing below expected output. This could indicate soiling, shading, degradation, or equipment malfunction. Check panel surface for dirt, bird droppings, or debris. Verify no new shading sources (trees, buildings). Inspect connections and wiring for damage or corrosion.',
    causes: ['Panel soiling', 'Partial shading', 'Panel degradation', 'Faulty connections', 'Inverter issues'],
    solutions: ['Clean panels with soft brush and water', 'Remove shading obstacles', 'Check all DC connections', 'Verify inverter operation', 'Test individual string voltages']
  },
  {
    code: 'SOL-002',
    title: 'Battery Overcharge',
    severity: 'critical',
    description: 'Battery voltage exceeding safe limits. This dangerous condition can cause battery damage, reduced lifespan, or in extreme cases, thermal runaway. Immediately reduce charging current and verify charge controller settings. Check battery temperature and ventilation.',
    causes: ['Charge controller malfunction', 'Wrong voltage settings', 'Temperature sensor failure', 'Oversized solar array'],
    solutions: ['Reduce charging current', 'Verify charge controller settings', 'Check temperature sensors', 'Inspect battery ventilation', 'Consider load diversion']
  },
  {
    code: 'SOL-003',
    title: 'Grid Sync Failure',
    severity: 'critical',
    description: 'Inverter unable to synchronize with utility grid. System cannot export power or provide grid-tied operation. Check grid voltage and frequency at connection point. Verify inverter grid parameters match utility requirements. Inspect anti-islanding protection settings.',
    causes: ['Grid voltage out of range', 'Frequency deviation', 'Ground fault detected', 'Anti-islanding trip', 'Communication failure'],
    solutions: ['Check utility supply quality', 'Verify grid parameters', 'Clear ground faults', 'Reset anti-islanding', 'Update inverter firmware']
  },
  {
    code: 'SOL-004',
    title: 'MPPT Tracking Error',
    severity: 'warning',
    description: 'Maximum Power Point Tracker not optimizing panel output. System losing potential energy harvest. The MPPT algorithm should continuously adjust to find optimal voltage/current combination. Erratic tracking suggests hardware or software issues.',
    causes: ['Rapid irradiance changes', 'Partial shading', 'Controller malfunction', 'Wiring issues', 'Panel mismatch'],
    solutions: ['Check for shading patterns', 'Verify string configuration', 'Update controller firmware', 'Inspect DC wiring', 'Test individual panels']
  },
  {
    code: 'SOL-005',
    title: 'Battery Low State of Charge',
    severity: 'warning',
    description: 'Battery bank below minimum recommended charge level. Continued discharge may damage batteries and reduce lifespan. System should enter low-voltage disconnect mode to protect batteries. Review load consumption and solar production balance.',
    causes: ['Insufficient solar input', 'Excessive load demand', 'Battery degradation', 'Charge controller fault', 'Weather conditions'],
    solutions: ['Reduce non-essential loads', 'Check solar production', 'Verify charge controller', 'Test battery capacity', 'Consider backup charging']
  },
  {
    code: 'SOL-006',
    title: 'Inverter Overtemperature',
    severity: 'critical',
    description: 'Inverter temperature exceeding safe operating limits. Unit will derate or shut down to prevent damage. Check cooling system, ambient temperature, and ventilation. Ensure inverter is not enclosed in unventilated space. Clean any dust from heat sinks and fans.',
    causes: ['Blocked ventilation', 'Fan failure', 'High ambient temperature', 'Overloading', 'Dust accumulation'],
    solutions: ['Improve ventilation', 'Clean heat sinks', 'Replace cooling fans', 'Reduce load', 'Relocate if needed']
  }
];

// Maintenance Schedule
const MAINTENANCE_SCHEDULE = [
  { task: 'Visual inspection', frequency: 'Weekly', duration: '15 min', priority: 'routine' },
  { task: 'Panel cleaning', frequency: 'Monthly', duration: '1-2 hours', priority: 'routine' },
  { task: 'Battery water check', frequency: 'Monthly', duration: '30 min', priority: 'important' },
  { task: 'Connection tightening', frequency: 'Quarterly', duration: '1 hour', priority: 'important' },
  { task: 'Performance audit', frequency: 'Quarterly', duration: '2-3 hours', priority: 'important' },
  { task: 'Inverter service', frequency: 'Annually', duration: '4-6 hours', priority: 'critical' },
  { task: 'Battery load test', frequency: 'Annually', duration: '4 hours', priority: 'critical' },
  { task: 'Full system inspection', frequency: 'Annually', duration: '1 day', priority: 'critical' },
];

export default function SolarMaintenanceHub() {
  const [selectedSystem, setSelectedSystem] = useState(SOLAR_SYSTEMS[0]);
  const [selectedLocation, setSelectedLocation] = useState('nairobi');
  const [activeTab, setActiveTab] = useState<'overview' | 'faults' | 'maintenance' | 'calculator'>('overview');
  const [solarInput, setSolarInput] = useState({
    panelWatts: 550,
    panelCount: 10,
    batteryAh: 200,
    batteryCount: 4,
    batteryVoltage: 12,
    dailyLoad: 15,
  });

  // Calculate solar system metrics
  const calculateMetrics = () => {
    const totalPanelWatts = solarInput.panelWatts * solarInput.panelCount;
    const totalBatteryWh = solarInput.batteryAh * solarInput.batteryCount * solarInput.batteryVoltage;
    const dailyLoadWh = solarInput.dailyLoad * 1000;
    const autonomyDays = totalBatteryWh / dailyLoadWh;
    const avgSunHours = 5; // Kenya average
    const dailyProduction = totalPanelWatts * avgSunHours * 0.8; // 80% efficiency
    const productionRatio = dailyProduction / dailyLoadWh;

    return {
      totalPanelWatts,
      totalBatteryWh: totalBatteryWh / 1000, // kWh
      dailyLoadWh: dailyLoadWh / 1000, // kWh
      autonomyDays: autonomyDays.toFixed(1),
      dailyProduction: dailyProduction / 1000, // kWh
      productionRatio: (productionRatio * 100).toFixed(0),
      systemStatus: productionRatio >= 1.2 ? 'optimal' : productionRatio >= 1 ? 'adequate' : 'undersized'
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Widgets */}
      <header className="bg-slate-900/80 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-amber-500 hover:text-amber-400 transition-colors">
                ← Home
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  ☀️ Solar Maintenance Hub
                </h1>
                <p className="text-slate-400 text-sm">Complete solar system diagnostics & maintenance</p>
              </div>
            </div>

            {/* Widgets */}
            <div className="hidden lg:flex items-center gap-3">
              <AnalogClock size={60} />
              <AnalogCalendar />
              <WeatherWidget location={selectedLocation} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Location Selector */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <span className="text-slate-400 text-sm">Your Location:</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            {KENYA_LOCATIONS.map(loc => (
              <option key={loc} value={loc.toLowerCase().replace(/[^a-z]/g, '')}>{loc}</option>
            ))}
          </select>
          <span className="text-green-400 text-sm">
            ☀️ Weather affects solar production - select your location for accurate recommendations
          </span>
        </div>

        {/* System Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {SOLAR_SYSTEMS.map(system => (
            <motion.button
              key={system.id}
              onClick={() => setSelectedSystem(system)}
              className={`p-4 rounded-xl border transition-all text-left ${
                selectedSystem.id === system.id
                  ? 'bg-amber-500/20 border-amber-500 text-white'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{system.icon}</div>
              <div className="font-medium text-sm">{system.name}</div>
              <div className="text-xs text-slate-500">{system.capacity}</div>
            </motion.button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'System Overview', icon: '📊' },
            { id: 'faults', label: 'Fault Diagnostics', icon: '⚠️' },
            { id: 'maintenance', label: 'Maintenance Schedule', icon: '🔧' },
            { id: 'calculator', label: 'System Calculator', icon: '🧮' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Selected System Details */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{selectedSystem.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedSystem.name}</h2>
                    <p className="text-slate-400 mb-4">{selectedSystem.description}</p>
                    <div className="text-amber-400 font-medium">Typical Capacity: {selectedSystem.capacity}</div>
                  </div>
                </div>
              </div>

              {/* Components & Tasks */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">📦 System Components</h3>
                  <ul className="space-y-2">
                    {selectedSystem.components.map((comp, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">🔧 Maintenance Tasks</h3>
                  <ul className="space-y-2">
                    {selectedSystem.maintenanceTasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <span className="text-green-400">✓</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/generator-oracle" className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 hover:from-blue-500 hover:to-blue-600 transition-all">
                  <div className="text-2xl mb-2">🔌</div>
                  <div className="font-bold text-white">Generator Oracle</div>
                  <div className="text-blue-200 text-sm">Backup generator diagnostics</div>
                </Link>
                <Link href="/services" className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 hover:from-green-500 hover:to-green-600 transition-all">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-bold text-white">General Services</div>
                  <div className="text-green-200 text-sm">Pumps, motors, AC & more</div>
                </Link>
                <Link href="/spare-parts" className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 hover:from-purple-500 hover:to-purple-600 transition-all">
                  <div className="text-2xl mb-2">🛒</div>
                  <div className="font-bold text-white">Spare Parts</div>
                  <div className="text-purple-200 text-sm">Solar components & accessories</div>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div
              key="faults"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-white mb-4">⚠️ Common Solar System Faults</h2>
              {SOLAR_FAULTS.map(fault => (
                <div key={fault.code} className={`bg-slate-800/50 border rounded-xl p-6 ${
                  fault.severity === 'critical' ? 'border-red-500/50' : 'border-yellow-500/50'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`px-3 py-1 rounded-lg text-sm font-mono ${
                      fault.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {fault.code}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{fault.title}</h3>
                      <p className="text-slate-400 mb-4">{fault.description}</p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Possible Causes:</h4>
                          <ul className="space-y-1">
                            {fault.causes.map((cause, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                <span className="text-red-400">•</span> {cause}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Solutions:</h4>
                          <ul className="space-y-1">
                            {fault.solutions.map((sol, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                <span className="text-green-400">✓</span> {sol}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">📅 Maintenance Schedule</h2>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left p-4 text-slate-300">Task</th>
                      <th className="text-left p-4 text-slate-300">Frequency</th>
                      <th className="text-left p-4 text-slate-300">Duration</th>
                      <th className="text-left p-4 text-slate-300">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MAINTENANCE_SCHEDULE.map((item, i) => (
                      <tr key={i} className="border-t border-slate-700">
                        <td className="p-4 text-white">{item.task}</td>
                        <td className="p-4 text-slate-400">{item.frequency}</td>
                        <td className="p-4 text-slate-400">{item.duration}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                            item.priority === 'important' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">🧮 Solar System Calculator</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
                  <h3 className="font-bold text-white mb-4">Enter Your System Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Panel Watts</label>
                      <input
                        type="number"
                        value={solarInput.panelWatts}
                        onChange={(e) => setSolarInput({...solarInput, panelWatts: +e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Panel Count</label>
                      <input
                        type="number"
                        value={solarInput.panelCount}
                        onChange={(e) => setSolarInput({...solarInput, panelCount: +e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Battery Ah</label>
                      <input
                        type="number"
                        value={solarInput.batteryAh}
                        onChange={(e) => setSolarInput({...solarInput, batteryAh: +e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Battery Count</label>
                      <input
                        type="number"
                        value={solarInput.batteryCount}
                        onChange={(e) => setSolarInput({...solarInput, batteryCount: +e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Battery Voltage</label>
                      <select
                        value={solarInput.batteryVoltage}
                        onChange={(e) => setSolarInput({...solarInput, batteryVoltage: +e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value={12}>12V</option>
                        <option value={24}>24V</option>
                        <option value={48}>48V</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Daily Load (kWh)</label>
                      <input
                        type="number"
                        value={solarInput.dailyLoad}
                        onChange={(e) => setSolarInput({...solarInput, dailyLoad: +e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4">System Analysis</h3>

                  <div className={`mb-4 p-4 rounded-lg ${
                    metrics.systemStatus === 'optimal' ? 'bg-green-500/20 border border-green-500/50' :
                    metrics.systemStatus === 'adequate' ? 'bg-yellow-500/20 border border-yellow-500/50' :
                    'bg-red-500/20 border border-red-500/50'
                  }`}>
                    <div className="text-lg font-bold text-white">
                      System Status: {metrics.systemStatus === 'optimal' ? '✅ Optimal' :
                                      metrics.systemStatus === 'adequate' ? '⚠️ Adequate' : '❌ Undersized'}
                    </div>
                    <div className="text-sm text-slate-300">
                      Production covers {metrics.productionRatio}% of daily load
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="text-slate-400 text-xs">Total Panel Capacity</div>
                      <div className="text-xl font-bold text-amber-400">{(metrics.totalPanelWatts / 1000).toFixed(1)} kW</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="text-slate-400 text-xs">Battery Storage</div>
                      <div className="text-xl font-bold text-blue-400">{metrics.totalBatteryWh.toFixed(1)} kWh</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="text-slate-400 text-xs">Daily Production</div>
                      <div className="text-xl font-bold text-green-400">{metrics.dailyProduction.toFixed(1)} kWh</div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="text-slate-400 text-xs">Battery Autonomy</div>
                      <div className="text-xl font-bold text-purple-400">{metrics.autonomyDays} days</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Need Professional Solar Maintenance?</h3>
          <p className="text-amber-100 mb-4">Our certified technicians are available across Kenya</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="tel:+254782914717" className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg text-white font-medium transition-colors">
              📞 0782 914 717
            </a>
            <a href="https://wa.me/254782914717" className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-white font-medium transition-colors">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Emerson Industrial Maintenance Services Limited. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/generator-oracle" className="text-slate-400 hover:text-amber-400">Generator Oracle</Link>
            <Link href="/services" className="text-slate-400 hover:text-amber-400">General Services</Link>
            <Link href="/spare-parts" className="text-slate-400 hover:text-amber-400">Spare Parts</Link>
            <Link href="/contact" className="text-slate-400 hover:text-amber-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
