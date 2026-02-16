'use client';

/**
 * OBD-II / CAN PROTOCOL INTERFACE PANEL
 * - Read & Clear DTCs (Diagnostic Trouble Codes)
 * - Live Data Streaming from ECU
 * - Freeze Frame Data capture
 * - Bi-Directional Control for actuator testing
 * - Service Functions (Oil reset, DPF regeneration, etc.)
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== TYPES ====================
interface DiagnosticTroubleCode {
  code: string;
  description: string;
  severity: 'pending' | 'stored' | 'permanent';
  system: 'engine' | 'alternator' | 'fuel' | 'cooling' | 'electrical' | 'control';
  timestamp: string;
  freezeFrame?: FreezeFrameData;
  mileage: number;
  occurrences: number;
}

interface FreezeFrameData {
  rpm: number;
  load: number;
  coolantTemp: number;
  fuelTrim: number;
  oilPressure: number;
  voltage: number;
  frequency: number;
  runTime: number;
}

interface LiveDataParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  icon: string;
  category: string;
}

interface ServiceFunction {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'available' | 'in_progress' | 'completed' | 'failed';
  lastPerformed?: string;
}

interface ActuatorTest {
  id: string;
  name: string;
  description: string;
  icon: string;
  canActivate: boolean;
  isActive: boolean;
}

// ==================== DTC SCANNER ====================
function DTCScanner({ dtcs, onClear, onScan, isScanning }: {
  dtcs: DiagnosticTroubleCode[];
  onClear: (codes: string[]) => void;
  onScan: () => void;
  isScanning: boolean;
}) {
  const [selectedDTCs, setSelectedDTCs] = useState<string[]>([]);
  const [expandedDTC, setExpandedDTC] = useState<string | null>(null);

  const severityColors = {
    pending: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
    stored: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
    permanent: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
  };

  const systemIcons = {
    engine: '🔧',
    alternator: '⚡',
    fuel: '⛽',
    cooling: '❄️',
    electrical: '🔌',
    control: '🎛️',
  };

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-red-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
            animate={{ rotate: isScanning ? 360 : 0 }}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
          >
            <span className="text-2xl">🔍</span>
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-red-400 uppercase tracking-wider">Fault Code Scanner</h3>
            <p className="text-xs text-slate-500">Read & Clear DTCs • OBD-II / CAN Protocol</p>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={onScan}
            disabled={isScanning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${
              isScanning ? 'bg-red-500/20 text-red-400' : 'bg-red-500 text-white'
            }`}
          >
            {isScanning ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Scanning...
              </>
            ) : (
              <>🔎 Scan DTCs</>
            )}
          </motion.button>

          {selectedDTCs.length > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => onClear(selectedDTCs)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm"
            >
              🗑️ Clear Selected ({selectedDTCs.length})
            </motion.button>
          )}
        </div>
      </div>

      {/* DTC Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-amber-500/10 rounded-lg text-center border border-amber-500/30">
          <div className="text-2xl font-bold text-amber-400">{dtcs.filter(d => d.severity === 'pending').length}</div>
          <div className="text-xs text-slate-500 uppercase">Pending</div>
        </div>
        <div className="p-3 bg-red-500/10 rounded-lg text-center border border-red-500/30">
          <div className="text-2xl font-bold text-red-400">{dtcs.filter(d => d.severity === 'stored').length}</div>
          <div className="text-xs text-slate-500 uppercase">Stored</div>
        </div>
        <div className="p-3 bg-purple-500/10 rounded-lg text-center border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">{dtcs.filter(d => d.severity === 'permanent').length}</div>
          <div className="text-xs text-slate-500 uppercase">Permanent</div>
        </div>
      </div>

      {/* DTC List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {dtcs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <span className="text-4xl block mb-2">✅</span>
            No fault codes detected
          </div>
        ) : (
          dtcs.map((dtc, idx) => {
            const colors = severityColors[dtc.severity];
            const isExpanded = expandedDTC === dtc.code;

            return (
              <motion.div
                key={dtc.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden`}
              >
                <div
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedDTC(isExpanded ? null : dtc.code)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedDTCs.includes(dtc.code)}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedDTCs(prev =>
                          prev.includes(dtc.code)
                            ? prev.filter(c => c !== dtc.code)
                            : [...prev, dtc.code]
                        );
                      }}
                      className="w-4 h-4 rounded border-slate-600"
                    />
                    <span className="text-xl">{systemIcons[dtc.system]}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${colors.text}`}>{dtc.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${colors.bg} ${colors.text}`}>
                          {dtc.severity}
                        </span>
                      </div>
                      <div className="text-sm text-slate-300">{dtc.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs text-slate-500">
                      <div>×{dtc.occurrences} occurrences</div>
                      <div>{dtc.timestamp}</div>
                    </div>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-slate-400"
                    >
                      ▼
                    </motion.span>
                  </div>
                </div>

                {/* Expanded Freeze Frame Data */}
                <AnimatePresence>
                  {isExpanded && dtc.freezeFrame && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="p-4 bg-slate-950/50 rounded-lg">
                        <h4 className="text-xs text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span>📸</span> Freeze Frame Data (Snapshot at Fault)
                        </h4>
                        <div className="grid grid-cols-4 gap-3 text-sm">
                          <div className="text-center">
                            <div className="text-lg font-mono text-white">{dtc.freezeFrame.rpm}</div>
                            <div className="text-[10px] text-slate-500">RPM</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-mono text-white">{dtc.freezeFrame.load}%</div>
                            <div className="text-[10px] text-slate-500">Load</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-mono text-white">{dtc.freezeFrame.coolantTemp}°C</div>
                            <div className="text-[10px] text-slate-500">Coolant</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-mono text-white">{dtc.freezeFrame.oilPressure} PSI</div>
                            <div className="text-[10px] text-slate-500">Oil Press</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-mono text-white">{dtc.freezeFrame.voltage}V</div>
                            <div className="text-[10px] text-slate-500">Voltage</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-mono text-white">{dtc.freezeFrame.frequency}Hz</div>
                            <div className="text-[10px] text-slate-500">Frequency</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-mono text-white">{dtc.freezeFrame.fuelTrim}%</div>
                            <div className="text-[10px] text-slate-500">Fuel Trim</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-mono text-white">{dtc.freezeFrame.runTime}h</div>
                            <div className="text-[10px] text-slate-500">Run Time</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ==================== LIVE DATA STREAMING ====================
function LiveDataStreaming({ parameters }: { parameters: LiveDataParameter[] }) {
  const categories = [...new Set(parameters.map(p => p.category))];

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-cyan-500/30">
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-2xl">📡</span>
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider">Live Data Streaming</h3>
          <p className="text-xs text-slate-500">Real-time sensor values from ECU</p>
        </div>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-4">
          <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2">{category}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {parameters.filter(p => p.category === category).map(param => {
              const percentage = ((param.value - param.min) / (param.max - param.min)) * 100;
              const isNormal = percentage >= 20 && percentage <= 80;

              return (
                <div
                  key={param.id}
                  className={`p-3 bg-slate-950/50 rounded-lg border ${
                    isNormal ? 'border-slate-700/50' : 'border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span>{param.icon}</span>
                    <span className="text-[10px] text-slate-400 uppercase truncate">{param.name}</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-white">
                    {param.value.toFixed(1)}
                    <span className="text-xs text-slate-500 ml-1">{param.unit}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                    <motion.div
                      className={`h-full ${isNormal ? 'bg-cyan-500' : 'bg-amber-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== BI-DIRECTIONAL CONTROL ====================
function BiDirectionalControl({ actuators, onActivate }: {
  actuators: ActuatorTest[];
  onActivate: (id: string) => void;
}) {
  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-2xl">🎮</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wider">Bi-Directional Control</h3>
          <p className="text-xs text-slate-500">Actuator testing & component activation</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actuators.map((actuator) => (
          <motion.button
            key={actuator.id}
            onClick={() => actuator.canActivate && onActivate(actuator.id)}
            disabled={!actuator.canActivate}
            whileHover={actuator.canActivate ? { scale: 1.02 } : {}}
            whileTap={actuator.canActivate ? { scale: 0.98 } : {}}
            className={`p-4 rounded-xl border text-left transition-all ${
              actuator.isActive
                ? 'bg-purple-500/30 border-purple-500'
                : actuator.canActivate
                  ? 'bg-slate-950/50 border-slate-700/50 hover:border-purple-500/50'
                  : 'bg-slate-950/30 border-slate-800/50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{actuator.icon}</span>
              {actuator.isActive && (
                <motion.div
                  className="w-3 h-3 bg-purple-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </div>
            <div className="text-sm font-medium text-white">{actuator.name}</div>
            <div className="text-[10px] text-slate-500 mt-1">{actuator.description}</div>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-amber-400 text-sm">
          <span>⚠️</span>
          <span>Ensure generator is OFF before actuator testing. Follow safety procedures.</span>
        </div>
      </div>
    </div>
  );
}

// ==================== SERVICE FUNCTIONS ====================
function ServiceFunctions({ services, onPerform }: {
  services: ServiceFunction[];
  onPerform: (id: string) => void;
}) {
  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-green-500/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <span className="text-2xl">🔧</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-green-400 uppercase tracking-wider">Service Functions</h3>
          <p className="text-xs text-slate-500">Oil reset, DPF regen, battery registration & more</p>
        </div>
      </div>

      <div className="space-y-2">
        {services.map((service) => {
          const statusColors = {
            available: 'border-slate-700/50 hover:border-green-500/50',
            in_progress: 'border-amber-500 bg-amber-500/10',
            completed: 'border-green-500 bg-green-500/10',
            failed: 'border-red-500 bg-red-500/10',
          };

          return (
            <motion.div
              key={service.id}
              className={`p-4 rounded-xl border transition-all ${statusColors[service.status]}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <div className="font-medium text-white">{service.name}</div>
                    <div className="text-xs text-slate-500">{service.description}</div>
                    {service.lastPerformed && (
                      <div className="text-[10px] text-slate-600 mt-1">
                        Last: {service.lastPerformed}
                      </div>
                    )}
                  </div>
                </div>

                {service.status === 'available' && (
                  <motion.button
                    onClick={() => onPerform(service.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium"
                  >
                    Perform
                  </motion.button>
                )}

                {service.status === 'in_progress' && (
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <motion.div
                      className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    In Progress...
                  </div>
                )}

                {service.status === 'completed' && (
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    ✅ Completed
                  </span>
                )}

                {service.status === 'failed' && (
                  <span className="text-red-400 text-sm flex items-center gap-1">
                    ❌ Failed
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== MAIN OBD PROTOCOL PANEL ====================
export default function OBDProtocolPanel() {
  const [activeTab, setActiveTab] = useState<'dtc' | 'live' | 'control' | 'service'>('dtc');
  const [isScanning, setIsScanning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

  const [dtcs, setDTCs] = useState<DiagnosticTroubleCode[]>([
    {
      code: 'P0217',
      description: 'Engine Coolant Over Temperature',
      severity: 'stored',
      system: 'cooling',
      timestamp: '2024-01-15 14:32',
      mileage: 2847,
      occurrences: 3,
      freezeFrame: { rpm: 1520, load: 85, coolantTemp: 108, fuelTrim: 2.1, oilPressure: 42, voltage: 228, frequency: 50.1, runTime: 4.2 },
    },
    {
      code: 'P0563',
      description: 'System Voltage High',
      severity: 'pending',
      system: 'electrical',
      timestamp: '2024-01-14 09:15',
      mileage: 2845,
      occurrences: 1,
      freezeFrame: { rpm: 1500, load: 45, coolantTemp: 82, fuelTrim: 0.5, oilPressure: 48, voltage: 255, frequency: 50.0, runTime: 1.8 },
    },
    {
      code: 'P0093',
      description: 'Fuel System Leak Detected - Large Leak',
      severity: 'stored',
      system: 'fuel',
      timestamp: '2024-01-13 16:45',
      mileage: 2840,
      occurrences: 5,
      freezeFrame: { rpm: 1480, load: 72, coolantTemp: 88, fuelTrim: -8.2, oilPressure: 44, voltage: 230, frequency: 49.8, runTime: 6.5 },
    },
    {
      code: 'P2291',
      description: 'Injector Control Pressure Too Low - Engine Cranking',
      severity: 'permanent',
      system: 'engine',
      timestamp: '2024-01-10 08:00',
      mileage: 2820,
      occurrences: 12,
    },
  ]);

  const [liveData, setLiveData] = useState<LiveDataParameter[]>([
    { id: 'rpm', name: 'Engine RPM', value: 1502, unit: 'RPM', min: 0, max: 2000, icon: '⚙️', category: 'Engine' },
    { id: 'load', name: 'Engine Load', value: 72, unit: '%', min: 0, max: 100, icon: '📊', category: 'Engine' },
    { id: 'coolant', name: 'Coolant Temp', value: 85, unit: '°C', min: 0, max: 120, icon: '🌡️', category: 'Engine' },
    { id: 'oil_temp', name: 'Oil Temp', value: 92, unit: '°C', min: 0, max: 150, icon: '🛢️', category: 'Engine' },
    { id: 'oil_press', name: 'Oil Pressure', value: 45, unit: 'PSI', min: 0, max: 80, icon: '🔴', category: 'Engine' },
    { id: 'fuel_press', name: 'Fuel Pressure', value: 38, unit: 'PSI', min: 0, max: 60, icon: '⛽', category: 'Fuel' },
    { id: 'fuel_rate', name: 'Fuel Rate', value: 18.5, unit: 'L/h', min: 0, max: 50, icon: '💧', category: 'Fuel' },
    { id: 'voltage', name: 'Output Voltage', value: 230.5, unit: 'V', min: 200, max: 260, icon: '⚡', category: 'Electrical' },
    { id: 'frequency', name: 'Frequency', value: 50.02, unit: 'Hz', min: 48, max: 52, icon: '〰️', category: 'Electrical' },
    { id: 'current', name: 'Output Current', value: 125, unit: 'A', min: 0, max: 200, icon: '🔌', category: 'Electrical' },
    { id: 'battery', name: 'Battery Voltage', value: 13.8, unit: 'V', min: 10, max: 15, icon: '🔋', category: 'Electrical' },
    { id: 'exhaust', name: 'Exhaust Temp', value: 420, unit: '°C', min: 0, max: 600, icon: '💨', category: 'Emissions' },
  ]);

  const [actuators, setActuators] = useState<ActuatorTest[]>([
    { id: 'fuel_pump', name: 'Fuel Pump', description: 'Test fuel pump operation', icon: '⛽', canActivate: true, isActive: false },
    { id: 'glow_plugs', name: 'Glow Plugs', description: 'Activate glow plug heating', icon: '🔥', canActivate: true, isActive: false },
    { id: 'starter', name: 'Starter Motor', description: 'Engage starter for testing', icon: '🔌', canActivate: false, isActive: false },
    { id: 'fan', name: 'Cooling Fan', description: 'Activate radiator fan', icon: '🌀', canActivate: true, isActive: false },
    { id: 'solenoid', name: 'Fuel Solenoid', description: 'Test fuel shutoff solenoid', icon: '🔧', canActivate: true, isActive: false },
    { id: 'avr', name: 'AVR Test', description: 'Voltage regulator test mode', icon: '⚡', canActivate: true, isActive: false },
    { id: 'governor', name: 'Governor', description: 'Electronic governor test', icon: '🎚️', canActivate: true, isActive: false },
    { id: 'transfer', name: 'Transfer Switch', description: 'ATS operation test', icon: '🔀', canActivate: false, isActive: false },
    { id: 'alarm', name: 'Alarm Output', description: 'Test alarm relay', icon: '🚨', canActivate: true, isActive: false },
  ]);

  const [services, setServices] = useState<ServiceFunction[]>([
    { id: 'oil_reset', name: 'Oil Service Reset', description: 'Reset oil change service interval', icon: '🛢️', status: 'available', lastPerformed: '2023-10-15' },
    { id: 'air_filter', name: 'Air Filter Reset', description: 'Reset air filter service counter', icon: '💨', status: 'available', lastPerformed: '2023-11-20' },
    { id: 'fuel_filter', name: 'Fuel Filter Reset', description: 'Reset fuel filter service interval', icon: '⛽', status: 'available' },
    { id: 'dpf_regen', name: 'DPF Regeneration', description: 'Force diesel particulate filter regeneration', icon: '🔥', status: 'available' },
    { id: 'battery_reg', name: 'Battery Registration', description: 'Register new battery to controller', icon: '🔋', status: 'available' },
    { id: 'injector_learn', name: 'Injector Coding', description: 'Learn new injector calibration codes', icon: '💉', status: 'available' },
    { id: 'hour_reset', name: 'Hour Meter Reset', description: 'Reset engine hour counter (requires auth)', icon: '⏱️', status: 'available' },
    { id: 'calibrate', name: 'Sensor Calibration', description: 'Calibrate temperature & pressure sensors', icon: '🎯', status: 'available' },
  ]);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => prev.map(param => ({
        ...param,
        value: param.value + (Math.random() - 0.5) * (param.max - param.min) * 0.02,
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const handleClearDTCs = (codes: string[]) => {
    setDTCs(prev => prev.filter(d => !codes.includes(d.code)));
  };

  const handleActivateActuator = (id: string) => {
    setActuators(prev => prev.map(a =>
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  const handlePerformService = (id: string) => {
    setServices(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'in_progress' as const } : s
    ));
    setTimeout(() => {
      setServices(prev => prev.map(s =>
        s.id === id ? { ...s, status: 'completed' as const, lastPerformed: new Date().toLocaleDateString() } : s
      ));
    }, 3000);
  };

  const tabs = [
    { id: 'dtc', label: 'Fault Codes', icon: '🔍', count: dtcs.length },
    { id: 'live', label: 'Live Data', icon: '📡' },
    { id: 'control', label: 'Actuators', icon: '🎮' },
    { id: 'service', label: 'Service', icon: '🔧' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 20px rgba(59,130,246,0.5)', '0 0 40px rgba(59,130,246,0.3)', '0 0 20px rgba(59,130,246,0.5)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-3xl">🔌</span>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-blue-400 uppercase tracking-wider">OBD-II / CAN Protocol</h2>
            <p className="text-sm text-slate-500">ECU Communication • DTC Management • Actuator Control</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' :
            connectionStatus === 'connecting' ? 'bg-amber-500/20 text-amber-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            <motion.div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm font-medium uppercase">
              {connectionStatus === 'connected' ? 'ECU Connected' :
               connectionStatus === 'connecting' ? 'Connecting...' :
               'Disconnected'}
            </span>
          </div>

          <div className="text-xs text-slate-500">
            Protocol: CAN 250kbps
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'dtc' && (
          <motion.div key="dtc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <DTCScanner dtcs={dtcs} onClear={handleClearDTCs} onScan={handleScan} isScanning={isScanning} />
          </motion.div>
        )}
        {activeTab === 'live' && (
          <motion.div key="live" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <LiveDataStreaming parameters={liveData} />
          </motion.div>
        )}
        {activeTab === 'control' && (
          <motion.div key="control" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <BiDirectionalControl actuators={actuators} onActivate={handleActivateActuator} />
          </motion.div>
        )}
        {activeTab === 'service' && (
          <motion.div key="service" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <ServiceFunctions services={services} onPerform={handlePerformService} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
