'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TelemetryData {
  voltage: number;
  frequency: number;
  temperature: number;
  oilPressure: number;
  fuelLevel: number;
  rpm: number;
  loadPercentage: number;
  runtime: number;
}

interface SystemStatus {
  engine: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  electrical: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  cooling: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  fuel: 'NOMINAL' | 'WARNING' | 'CRITICAL';
}

export default function AerospaceCockpit() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    voltage: 415,
    frequency: 50.2,
    temperature: 87,
    oilPressure: 45,
    fuelLevel: 78,
    rpm: 1500,
    loadPercentage: 65,
    runtime: 12450
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    engine: 'NOMINAL',
    electrical: 'NOMINAL',
    cooling: 'NOMINAL',
    fuel: 'NOMINAL'
  });

  const [missionTime, setMissionTime] = useState(0);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Simulate real-time telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        voltage: prev.voltage + (Math.random() - 0.5) * 2,
        frequency: 50 + (Math.random() - 0.5) * 0.3,
        temperature: prev.temperature + (Math.random() - 0.5),
        oilPressure: prev.oilPressure + (Math.random() - 0.5) * 2,
        fuelLevel: Math.max(0, prev.fuelLevel - 0.01),
        rpm: 1500 + (Math.random() - 0.5) * 20,
        loadPercentage: Math.min(100, Math.max(0, prev.loadPercentage + (Math.random() - 0.5) * 5)),
        runtime: prev.runtime + 1
      }));
      setMissionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOMINAL': return 'text-green-400';
      case 'WARNING': return 'text-yellow-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'NOMINAL': return 'bg-green-500/20 border-green-500/50';
      case 'WARNING': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'CRITICAL': return 'bg-red-500/20 border-red-500/50';
      default: return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Mission Control Header */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-[1920px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xl font-bold tracking-widest text-cyan-400">
                  EMERSON EIMS MISSION CONTROL
                </span>
              </div>
              <div className="text-sm text-gray-400">
                GENERATOR DIAGNOSTIC SUITE v4.0
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-gray-500">MISSION ELAPSED TIME</div>
                <div className="text-2xl font-bold text-cyan-400 tabular-nums">
                  {formatTime(missionTime)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">SYSTEM TIME</div>
                <div className="text-lg text-white tabular-nums">
                  {new Date().toLocaleTimeString('en-US', { hour12: false })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto p-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Panel - System Status */}
          <div className="col-span-3 space-y-6">
            <div className="border border-cyan-500/30 bg-black/50 backdrop-blur-sm">
              <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-4 py-2">
                <h2 className="text-sm font-bold tracking-wider text-cyan-400">SYSTEM STATUS</h2>
              </div>
              <div className="p-4 space-y-3" role="list" aria-label="Generator system status indicators">
                {Object.entries(systemStatus).map(([system, status]) => (
                  <motion.div
                    key={system}
                    className={`border p-3 ${getStatusBg(status)}`}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    role="listitem"
                    aria-label={`${system} status: ${status}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase text-gray-400">{system}</span>
                      <span className={`text-xs font-bold ${getStatusColor(status)}`} aria-live="polite">
                        {status}
                      </span>
                    </div>
                    <div className="mt-2 h-1 bg-black/50 rounded-full overflow-hidden" role="progressbar" aria-valuenow={status === 'NOMINAL' ? 100 : status === 'WARNING' ? 60 : 30} aria-valuemin={0} aria-valuemax={100}>
                      <motion.div
                        className={`h-full ${status === 'NOMINAL' ? 'bg-green-400' : status === 'WARNING' ? 'bg-yellow-400' : 'bg-red-400'}`}
                        initial={{ width: 0 }}
                        animate={{ width: status === 'NOMINAL' ? '100%' : status === 'WARNING' ? '60%' : '30%' }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fault Code Registry */}
            <div className="border border-orange-500/30 bg-black/50 backdrop-blur-sm">
              <div className="bg-orange-500/10 border-b border-orange-500/30 px-4 py-2">
                <h2 className="text-sm font-bold tracking-wider text-orange-400">ACTIVE FAULTS</h2>
              </div>
              <div className="p-4">
                <div className="text-center text-green-400 text-sm py-4">
                  NO ACTIVE FAULTS DETECTED
                </div>
                <div className="text-xs text-gray-500 text-center">
                  4,000+ CODES MONITORED
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-purple-500/30 bg-black/50 backdrop-blur-sm">
              <div className="bg-purple-500/10 border-b border-purple-500/30 px-4 py-2">
                <h2 className="text-sm font-bold tracking-wider text-purple-400">QUICK ACTIONS</h2>
              </div>
              <div className="p-4 space-y-2" role="group" aria-label="Quick diagnostic actions">
                <button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 py-2 px-3 text-xs text-cyan-400 font-bold transition-all focus-visible-enhanced" aria-label="Run full system diagnostics">
                  RUN DIAGNOSTICS
                </button>
                <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 py-2 px-3 text-xs text-green-400 font-bold transition-all focus-visible-enhanced" aria-label="Generate diagnostic report">
                  GENERATE REPORT
                </button>
                <button className="w-full bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 py-2 px-3 text-xs text-orange-400 font-bold transition-all focus-visible-enhanced" aria-label="Dispatch maintenance technician">
                  DISPATCH TECHNICIAN
                </button>
              </div>
            </div>
          </div>

          {/* Center Panel - Main Display */}
          <div className="col-span-6 space-y-6">
            {/* Primary Telemetry Display */}
            <div className="border border-cyan-500/30 bg-black/50 backdrop-blur-sm">
              <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-4 py-2">
                <h2 className="text-sm font-bold tracking-wider text-cyan-400">PRIMARY TELEMETRY</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {/* Voltage Gauge */}
                  <div className="text-center" role="img" aria-label={`Voltage gauge showing ${telemetry.voltage.toFixed(1)} volts`}>
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-full h-full transform -rotate-90" role="presentation" aria-hidden="true">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#1f2937"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - telemetry.voltage / 500) }}
                          transition={{ duration: 0.5 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-cyan-400 tabular-nums">
                          {telemetry.voltage.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">VOLTS</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">ELECTRICAL</div>
                  </div>

                  {/* Frequency Gauge */}
                  <div className="text-center" role="img" aria-label={`Frequency gauge showing ${telemetry.frequency.toFixed(1)} hertz, target 50 Hz`}>
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-full h-full transform -rotate-90" role="presentation" aria-hidden="true">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#1f2937"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - telemetry.frequency / 60) }}
                          transition={{ duration: 0.5 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-green-400 tabular-nums">
                          {telemetry.frequency.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">Hz</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">FREQUENCY</div>
                  </div>

                  {/* Temperature Gauge */}
                  <div className="text-center" role="img" aria-label={`Temperature gauge showing ${telemetry.temperature.toFixed(0)} degrees Celsius`}>
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-full h-full transform -rotate-90" role="presentation" aria-hidden="true">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#1f2937"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - telemetry.temperature / 120) }}
                          transition={{ duration: 0.5 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-orange-400 tabular-nums">
                          {telemetry.temperature.toFixed(0)}
                        </span>
                        <span className="text-xs text-gray-400">°C</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">COOLANT TEMP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-4 gap-4" role="group" aria-label="Secondary engine metrics">
              <div className="border border-cyan-500/30 bg-black/50 backdrop-blur-sm p-4" role="status" aria-label={`Oil pressure: ${telemetry.oilPressure.toFixed(1)} PSI`}>
                <div className="text-xs text-gray-400 mb-2">OIL PRESSURE</div>
                <div className="text-2xl font-bold text-cyan-400 tabular-nums" aria-live="polite">
                  {telemetry.oilPressure.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">PSI</div>
              </div>

              <div className="border border-green-500/30 bg-black/50 backdrop-blur-sm p-4" role="status" aria-label={`Fuel level: ${telemetry.fuelLevel.toFixed(0)} percent`}>
                <div className="text-xs text-gray-400 mb-2">FUEL LEVEL</div>
                <div className="text-2xl font-bold text-green-400 tabular-nums" aria-live="polite">
                  {telemetry.fuelLevel.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">%</div>
              </div>

              <div className="border border-purple-500/30 bg-black/50 backdrop-blur-sm p-4" role="status" aria-label={`Engine RPM: ${telemetry.rpm.toFixed(0)} rotations per minute`}>
                <div className="text-xs text-gray-400 mb-2">ENGINE RPM</div>
                <div className="text-2xl font-bold text-purple-400 tabular-nums" aria-live="polite">
                  {telemetry.rpm.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">RPM</div>
              </div>

              <div className="border border-orange-500/30 bg-black/50 backdrop-blur-sm p-4" role="status" aria-label={`Load: ${telemetry.loadPercentage.toFixed(0)} percent capacity`}>
                <div className="text-xs text-gray-400 mb-2">LOAD</div>
                <div className="text-2xl font-bold text-orange-400 tabular-nums" aria-live="polite">
                  {telemetry.loadPercentage.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500">%</div>
              </div>
            </div>

            {/* Live Data Stream */}
            <div className="border border-green-500/30 bg-black/50 backdrop-blur-sm">
              <div className="bg-green-500/10 border-b border-green-500/30 px-4 py-2 flex items-center justify-between">
                <h2 className="text-sm font-bold tracking-wider text-green-400">LIVE DATA STREAM</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400">STREAMING</span>
                </div>
              </div>
              <div className="p-4 h-48 overflow-y-auto font-mono text-xs space-y-1 bg-black/80">
                <div className="text-green-400">[{new Date().toISOString()}] VOLTAGE: {telemetry.voltage.toFixed(2)}V | FREQUENCY: {telemetry.frequency.toFixed(2)}Hz</div>
                <div className="text-cyan-400">[{new Date().toISOString()}] TEMP: {telemetry.temperature.toFixed(1)}°C | OIL: {telemetry.oilPressure.toFixed(1)}PSI</div>
                <div className="text-purple-400">[{new Date().toISOString()}] RPM: {telemetry.rpm.toFixed(0)} | LOAD: {telemetry.loadPercentage.toFixed(1)}%</div>
                <div className="text-gray-500">[{new Date().toISOString()}] ALL SYSTEMS NOMINAL</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Diagnostics */}
          <div className="col-span-3 space-y-6">
            {/* Controller Status */}
            <div className="border border-cyan-500/30 bg-black/50 backdrop-blur-sm">
              <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-4 py-2">
                <h2 className="text-sm font-bold tracking-wider text-cyan-400">CONTROLLER</h2>
              </div>
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-cyan-400">DeepSea 8660</div>
                  <div className="text-xs text-gray-500">MULTI-SET CONTROLLER</div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">FIRMWARE:</span>
                    <span className="text-white">v4.2.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">UPTIME:</span>
                    <span className="text-white">{formatTime(telemetry.runtime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">COMMS:</span>
                    <span className="text-green-400">ONLINE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Code Database */}
            <div className="border border-purple-500/30 bg-black/50 backdrop-blur-sm">
              <div className="bg-purple-500/10 border-b border-purple-500/30 px-4 py-2">
                <h2 className="text-sm font-bold tracking-wider text-purple-400">DATABASE STATUS</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">PowerWizard Codes:</span>
                  <span className="text-cyan-400 font-bold">2,000</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">DeepSea Codes:</span>
                  <span className="text-green-400 font-bold">2,000</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Diagnostic Flows:</span>
                  <span className="text-purple-400 font-bold">269</span>
                </div>
                <div className="border-t border-purple-500/30 pt-3 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">TOTAL COVERAGE:</span>
                    <span className="text-yellow-400 font-bold">4,000+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Log */}
            <div className="border border-orange-500/30 bg-black/50 backdrop-blur-sm">
              <div className="bg-orange-500/10 border-b border-orange-500/30 px-4 py-2">
                <h2 className="text-sm font-bold tracking-wider text-orange-400">MISSION LOG</h2>
              </div>
              <div className="p-4 h-64 overflow-y-auto text-xs space-y-2">
                <div className="flex gap-2">
                  <span className="text-green-400">[OK]</span>
                  <span className="text-gray-400">System initialized</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">[OK]</span>
                  <span className="text-gray-400">Telemetry active</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400">[INFO]</span>
                  <span className="text-gray-400">4000+ codes loaded</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">[OK]</span>
                  <span className="text-gray-400">All systems nominal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HUD Overlay Corners */}
      <div className="fixed top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50 pointer-events-none" />
      <div className="fixed top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50 pointer-events-none" />
    </div>
  );
}
