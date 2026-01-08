'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface TelemetryData {
  voltage: number;
  frequency: number;
  temperature: number;
  oilPressure: number;
  fuelLevel: number;
  rpm: number;
  loadPercentage: number;
  runtime: number;
  powerOutput: number;
  efficiency: number;
}

interface SystemStatus {
  engine: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  electrical: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  cooling: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  fuel: 'NOMINAL' | 'WARNING' | 'CRITICAL';
}

interface AlertData {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  code?: string;
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
    runtime: 12450,
    powerOutput: 380,
    efficiency: 94.2
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    engine: 'NOMINAL',
    electrical: 'NOMINAL',
    cooling: 'NOMINAL',
    fuel: 'NOMINAL'
  });

  const [missionTime, setMissionTime] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [demoMode, setDemoMode] = useState(true);
  const [showExpertPanel, setShowExpertPanel] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState('GEN-001');

  // Simulate real-time telemetry updates
  useEffect(() => {
    if (!demoMode) return;
    
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        voltage: prev.voltage + (Math.random() - 0.5) * 2,
        frequency: 50 + (Math.random() - 0.5) * 0.3,
        temperature: prev.temperature + (Math.random() - 0.5),
        oilPressure: prev.oilPressure + (Math.random() - 0.5) * 2,
        fuelLevel: Math.max(0, prev.fuelLevel - 0.01),
        rpm: 1500 + (Math.random() - 0.5) * 20,
        loadPercentage: Math.min(100, Math.max(0, prev.loadPercentage + (Math.random() - 0.5) * 5)),
        runtime: prev.runtime + 1,
        powerOutput: 380 + (Math.random() - 0.5) * 10,
        efficiency: 94 + (Math.random() - 0.5) * 2
      }));
      setMissionTime(prev => prev + 1);
      
      // Random alerts for demo
      if (Math.random() > 0.98) {
        const alertTypes: Array<'info' | 'warning'> = ['info', 'warning'];
        const messages = [
          'Scheduled maintenance reminder',
          'Fuel level below 80%',
          'Peak load detected',
          'Auto-sync completed',
          'Remote monitoring active'
        ];
        const newAlert: AlertData = {
          id: Date.now().toString(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date()
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [demoMode]);

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
      {/* Mission Control Header - Enhanced */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-r from-black via-gray-900 to-black sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-lg sm:text-xl font-bold tracking-widest text-cyan-400">
                  EMERSON EIMS MISSION CONTROL
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 hidden md:block">
                GENERATOR DIAGNOSTIC SUITE v4.2
              </div>
              
              {/* Demo Mode Toggle */}
              <button 
                onClick={() => setDemoMode(!demoMode)}
                className={`px-3 py-1 text-xs rounded-full border transition-all ${
                  demoMode 
                    ? 'border-green-500 text-green-400 bg-green-500/20' 
                    : 'border-gray-500 text-gray-400 bg-gray-500/20'
                }`}
              >
                {demoMode ? '● LIVE DEMO' : '○ PAUSED'}
              </button>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Generator Selector */}
              <select 
                value={selectedGenerator}
                onChange={(e) => setSelectedGenerator(e.target.value)}
                className="bg-black/60 border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1.5 rounded"
              >
                <option value="GEN-001">GEN-001 (Primary)</option>
                <option value="GEN-002">GEN-002 (Backup)</option>
                <option value="GEN-003">GEN-003 (Solar Hybrid)</option>
              </select>
              
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-gray-500">MISSION ELAPSED TIME</div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 tabular-nums">
                  {formatTime(missionTime)}
                </div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-[10px] text-gray-500">SYSTEM TIME</div>
                <div className="text-base sm:text-lg text-white tabular-nums">
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

            {/* Secondary Metrics - Enhanced */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4" role="group" aria-label="Secondary engine metrics">
              <div className="border border-cyan-500/30 bg-black/50 backdrop-blur-sm p-3 sm:p-4" role="status" aria-label={`Oil pressure: ${telemetry.oilPressure.toFixed(1)} PSI`}>
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">OIL PRESSURE</div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 tabular-nums" aria-live="polite">
                  {telemetry.oilPressure.toFixed(1)}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500">PSI</div>
              </div>

              <div className="border border-green-500/30 bg-black/50 backdrop-blur-sm p-3 sm:p-4" role="status" aria-label={`Fuel level: ${telemetry.fuelLevel.toFixed(0)} percent`}>
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">FUEL LEVEL</div>
                <div className="text-xl sm:text-2xl font-bold text-green-400 tabular-nums" aria-live="polite">
                  {telemetry.fuelLevel.toFixed(0)}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500">%</div>
              </div>

              <div className="border border-purple-500/30 bg-black/50 backdrop-blur-sm p-3 sm:p-4" role="status" aria-label={`Engine RPM: ${telemetry.rpm.toFixed(0)} rotations per minute`}>
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">ENGINE RPM</div>
                <div className="text-xl sm:text-2xl font-bold text-purple-400 tabular-nums" aria-live="polite">
                  {telemetry.rpm.toFixed(0)}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500">RPM</div>
              </div>

              <div className="border border-orange-500/30 bg-black/50 backdrop-blur-sm p-3 sm:p-4" role="status" aria-label={`Load: ${telemetry.loadPercentage.toFixed(0)} percent capacity`}>
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">LOAD</div>
                <div className="text-xl sm:text-2xl font-bold text-orange-400 tabular-nums" aria-live="polite">
                  {telemetry.loadPercentage.toFixed(0)}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500">%</div>
              </div>
              
              <div className="border border-amber-500/30 bg-black/50 backdrop-blur-sm p-3 sm:p-4" role="status">
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">POWER OUTPUT</div>
                <div className="text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">
                  {telemetry.powerOutput.toFixed(0)}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500">kW</div>
              </div>
              
              <div className="border border-emerald-500/30 bg-black/50 backdrop-blur-sm p-3 sm:p-4" role="status">
                <div className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">EFFICIENCY</div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
                  {telemetry.efficiency.toFixed(1)}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500">%</div>
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
      
      {/* Live Alerts Ticker */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-cyan-500/30 backdrop-blur-sm z-40"
          >
            <div className="max-w-[1920px] mx-auto px-8 py-3">
              <div className="flex items-center gap-4 overflow-x-auto">
                <span className="text-xs text-gray-500 flex-shrink-0">ALERTS:</span>
                {alerts.slice(0, 5).map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 px-3 py-1 rounded text-xs flex-shrink-0 ${
                      alert.type === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    <span>{alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                    <span>{alert.message}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Expert Connect Panel */}
      <AnimatePresence>
        {showExpertPanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-black/95 border-l border-cyan-500/30 backdrop-blur-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-cyan-400">EXPERT CONNECT</h3>
                <button onClick={() => setShowExpertPanel(false)} className="text-gray-400 hover:text-white">
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-xl">
                      👨‍🔧
                    </div>
                    <div>
                      <div className="text-white font-medium">James Kariuki</div>
                      <div className="text-green-400 text-xs">● Online Now</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Senior Diesel Engineer • 12 yrs exp • DeepSea Certified</p>
                  <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 py-2 text-xs text-green-400 font-bold rounded transition-all">
                    📞 CALL NOW
                  </button>
                </div>
                
                <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center text-xl">
                      👩‍💻
                    </div>
                    <div>
                      <div className="text-white font-medium">Sarah Ochieng</div>
                      <div className="text-cyan-400 text-xs">● Available</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Controls Specialist • PowerWizard Expert • Remote Support</p>
                  <button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 py-2 text-xs text-cyan-400 font-bold rounded transition-all">
                    💬 START CHAT
                  </button>
                </div>
                
                <div className="border-t border-gray-800 pt-4">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">QUICK ACTIONS</h4>
                  <div className="space-y-2">
                    <Link href="/contact?type=emergency" className="block w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 py-2 text-xs text-red-400 font-bold rounded text-center transition-all">
                      🚨 EMERGENCY DISPATCH
                    </Link>
                    <Link href="/contact?type=site-survey" className="block w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 py-2 text-xs text-purple-400 font-bold rounded text-center transition-all">
                      📋 REQUEST SITE VISIT
                    </Link>
                    <Link href="/contact?type=quote" className="block w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 py-2 text-xs text-amber-400 font-bold rounded text-center transition-all">
                      💰 GET SERVICE QUOTE
                    </Link>
                  </div>
                </div>
                
                <div className="text-center text-xs text-gray-500 mt-6">
                  24/7 Emergency: +254768860665
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Expert Button */}
      <motion.button
        onClick={() => setShowExpertPanel(!showExpertPanel)}
        className="fixed bottom-24 right-8 w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center text-2xl z-40 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ['0 0 20px rgba(251,191,36,0.3)', '0 0 40px rgba(251,191,36,0.5)', '0 0 20px rgba(251,191,36,0.3)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        👨‍🔧
      </motion.button>
    </div>
  );
}
