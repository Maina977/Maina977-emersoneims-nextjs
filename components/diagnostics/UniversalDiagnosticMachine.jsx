'use client';

import { useEffect, useMemo, useState } from 'react';
import MetalBezel from './MetalBezel';
import RadarScope from './RadarScope';
import SystemLogs from './SystemLogs';
import CockpitSwitches from './CockpitSwitches';
import PopUps from './PopUps';
import { UNIVERSAL_SERVICES } from '@/lib/data/diagnosticServices';
import comprehensiveErrorCodes from '@/app/data/diagnostic/comprehensiveErrorCodes.json';
import { allControllerErrorCodes } from '@/app/data/diagnostic/allControllerErrorCodes';

const SERVICES = UNIVERSAL_SERVICES;

/**
 * UniversalDiagnosticMachine - Awwwards-winning universal diagnostics cockpit
 * Covers all 9 services: Solar, Generators, Controls, AC/UPS, Automation, Pumps, Incinerators, Motors, Diagnostics Hub
 * 
 * NOTE: This is the UNIVERSAL tool. For generator-specific diagnostics (Generators, Controls, DeepSea, PowerWizard),
 * use the GeneratorControlDiagnosticHub component instead.
 * 
 * @param {Object} props
 * @param {((service: string, severity: string) => void) | null | undefined} [props.onSeverityUpdate] - Optional callback for severity updates
 */
export default function UniversalDiagnosticMachine({ onSeverityUpdate = null }) {
  const [activeService, setActiveService] = useState(SERVICES[0]);
  const [health, setHealth] = useState('green'); // green | amber | red
  const [logs, setLogs] = useState(initialLogs());
  const [alerts, setAlerts] = useState([]);

  // Derived radar blip density per service (purely visual; replace with real data later)
  const blipCount = useMemo(() => getBlipCount(activeService), [activeService]);

  // Simulate diagnostics: append log lines and adjust health state
  useEffect(() => {
    const interval = setInterval(() => {
      const { line, severity } = generateDiagnosticLine(activeService);
      setLogs((prev) => [...prev.slice(-49), line]);

      // Health rule-of-thumb: escalate if severity is high
      setHealth((prev) => {
        if (severity === 'HIGH') return 'red';
        if (severity === 'MED') return prev === 'green' ? 'amber' : prev;
        return prev;
      });

      // Call onSeverityUpdate callback if provided
      if (onSeverityUpdate && typeof onSeverityUpdate === 'function') {
        onSeverityUpdate(activeService, severity);
      }

      // Optional popup alerts
      if (severity !== 'LOW') {
        setAlerts((prev) => [
          ...prev.slice(-2),
          {
            id: Date.now(),
            title: severity === 'HIGH' ? 'CRITICAL ALERT' : 'ATTENTION',
            message: line,
            level: severity,
          },
        ]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [activeService, onSeverityUpdate]);

  const onSwitchToggle = (label, state) => {
    // Use CockpitSwitches to choose service mode; map switches to services
    // Example mapping: just set active service when a switch flips ON
    if (state) setActiveService(label);
  };

  const clearAlerts = () => setAlerts([]);

  return (
    <MetalBezel title="Universal Diagnostic Machine (All 9 Services - Universal Tool)">
      {/* Enhanced Sci-Fi Cockpit Interface */}
      <div className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 rounded-xl border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] p-6">
        {/* Holographic Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
        
        {/* Glowing Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-400 opacity-50" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400 opacity-50" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400 opacity-50" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-400 opacity-50" />

        <div className="grid grid-cols-1 xl:grid-cols-[380px,1fr,300px] gap-6 relative z-10">
          {/* Left instrument stack - Enhanced */}
          <div className="space-y-4">
            {/* Status lights with enhanced sci-fi styling */}
            <SciFiPanel title="SERVICE STATUS" glowColor="cyan">
              <ServiceStatusLights activeService={activeService} health={health} />
              <div className="mt-3 pt-3 border-t border-cyan-500/20">
                <div className="flex justify-between text-xs text-cyan-300/80 font-mono">
                  <span>FLEET STATUS</span>
                  <span className="text-green-400 animate-pulse">ONLINE</span>
                </div>
              </div>
            </SciFiPanel>

            {/* Service selector with enhanced styling */}
            <SciFiPanel title="SERVICE SELECTOR" glowColor="cyan">
              <CockpitSwitches
                labels={SERVICES}
                onToggle={onSwitchToggle}
                initialState={SERVICES.reduce((acc, s) => ({ ...acc, [s]: s === activeService }), {})}
              />
            </SciFiPanel>

            {/* Enhanced Logs Panel */}
            <SciFiPanel title="DIAGNOSTIC LOGS" glowColor="cyan">
              <SystemLogs initialLogs={logs} />
              <div className="mt-2 flex justify-between text-xs text-cyan-400/60 font-mono">
                <span>LOG BUFFER: {logs.length}/50</span>
                <span className="animate-pulse">● LIVE</span>
              </div>
            </SciFiPanel>

            {/* Additional Sci-Fi Data Panel */}
            <SciFiPanel title="SYSTEM METRICS" glowColor="cyan">
              <div className="space-y-2">
                <MetricBar label="CPU" value={78} color="cyan" />
                <MetricBar label="MEMORY" value={65} color="cyan" />
                <MetricBar label="NETWORK" value={92} color="cyan" />
                <MetricBar label="STORAGE" value={45} color="cyan" />
              </div>
            </SciFiPanel>
          </div>

          {/* Center main display: radar + contextual helper */}
          <div className="space-y-4">
            <SciFiPanel title={`RADAR — ${activeService}`} glowColor="cyan">
              <div className="relative">
                <RadarScope size={400} sweepSpeed={0.024} blipCount={blipCount} />
                <div className="absolute top-2 right-2 text-xs text-cyan-400 font-mono">
                  SWEEP: {blipCount} TARGETS
                </div>
              </div>
              <ServiceHint activeService={activeService} />
            </SciFiPanel>

            {/* Enhanced Alerts Panel */}
            <SciFiPanel title="ALERTS / RECOMMENDATIONS" glowColor="cyan">
              <PopUps alerts={alerts} onClear={clearAlerts} />
              {alerts.length === 0 && (
                <div className="text-center py-4 text-cyan-400/50 text-xs font-mono">
                  NO ACTIVE ALERTS
                </div>
              )}
            </SciFiPanel>
          </div>

          {/* Right side panel - Additional Sci-Fi Features */}
          <div className="space-y-4">
            <SciFiPanel title="ENERGY FLOW" glowColor="cyan">
              <EnergyFlowDiagram />
            </SciFiPanel>

            <SciFiPanel title="QUICK STATS" glowColor="cyan">
              <QuickStats activeService={activeService} />
            </SciFiPanel>

            <SciFiPanel title="COMM LINK" glowColor="cyan">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-cyan-300">PRIMARY LINK</span>
                  <span className="ml-auto text-green-400">ACTIVE</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-cyan-300">BACKUP LINK</span>
                  <span className="ml-auto text-green-400">STANDBY</span>
                </div>
                <div className="pt-2 border-t border-cyan-500/20 text-xs text-cyan-400/60 font-mono">
                  LATENCY: 12ms
                </div>
              </div>
            </SciFiPanel>
          </div>
        </div>
      </div>
    </MetalBezel>
  );
}

/* ---------- Helpers & small subcomponents ---------- */

// Enhanced Sci-Fi Panel with glow effects
function SciFiPanel({ title, children, glowColor = 'cyan' }) {
  const glowClass = glowColor === 'cyan' ? 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]';
  const textClass = glowColor === 'cyan' ? 'text-cyan-300' : 'text-purple-300';
  
  return (
    <div className={`p-4 bg-black/60 border-2 ${glowClass} rounded-lg backdrop-blur-sm relative overflow-hidden`}>
      {/* Subtle inner glow */}
        <div className={`absolute inset-0 pointer-events-none ${
          glowColor === 'cyan' ? 'bg-gradient-to-br from-cyan-500/5 to-transparent' : 'bg-gradient-to-br from-purple-500/5 to-transparent'
        }`} />
      <h3 className={`text-xs font-bold ${textClass} tracking-widest mb-3 font-mono relative z-10 flex items-center gap-2`}>
        <span className={`w-1 h-4 bg-${glowColor}-400`} />
        {title}
      </h3>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Metric Bar Component
function MetricBar({ label, value, color = 'cyan' }) {
  const colorClass = color === 'cyan' ? 'bg-cyan-500' : 'bg-purple-500';
  const textClass = color === 'cyan' ? 'text-cyan-300' : 'text-purple-300';
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-mono">
        <span className={textClass}>{label}</span>
        <span className="text-gray-400">{value}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} rounded-full transition-all duration-500 relative`}
          style={{ width: `${value}%` }}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" 
            style={{ 
              animation: 'shimmer 2s infinite',
              transform: 'translateX(-100%)'
            }} 
          />
        </div>
      </div>
    </div>
  );
}

// Energy Flow Diagram
function EnergyFlowDiagram() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-cyan-300">INPUT</span>
        <div className="flex-1 mx-2 h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 animate-pulse" />
        <span className="text-cyan-300">OUTPUT</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {['SOURCE', 'PROCESS', 'LOAD'].map((label, i) => (
          <div key={i} className="p-2 bg-gray-900/50 border border-cyan-500/30 rounded">
            <div className="text-xs text-cyan-400 font-mono">{label}</div>
            <div className="text-lg font-bold text-cyan-300 mt-1">
              {i === 0 ? '100%' : i === 1 ? '95%' : '90%'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Quick Stats Component
function QuickStats({ activeService }) {
  const stats = {
    'Solar Systems': { uptime: '99.2%', efficiency: '87%', alerts: 2 },
    'Diesel Generators': { uptime: '98.7%', efficiency: '82%', alerts: 1 },
    Controls: { uptime: '99.5%', efficiency: '94%', alerts: 0 },
    'AC & UPS': { uptime: '99.1%', efficiency: '89%', alerts: 1 },
    Automation: { uptime: '98.9%', efficiency: '91%', alerts: 0 },
    Pumps: { uptime: '97.8%', efficiency: '85%', alerts: 3 },
    Incinerators: { uptime: '98.2%', efficiency: '88%', alerts: 1 },
    'Motors/Rewinding': { uptime: '99.0%', efficiency: '86%', alerts: 1 },
    'Diagnostics Hub': { uptime: '100%', efficiency: '100%', alerts: 0 },
  };
  
  const stat = stats[activeService] || { uptime: 'N/A', efficiency: 'N/A', alerts: 0 };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-cyan-300">UPTIME</span>
        <span className="text-green-400">{stat.uptime}</span>
      </div>
      <div className="flex justify-between text-xs font-mono">
        <span className="text-cyan-300">EFFICIENCY</span>
        <span className="text-cyan-400">{stat.efficiency}</span>
      </div>
      <div className="flex justify-between text-xs font-mono">
        <span className="text-cyan-300">ALERTS</span>
        <span className={stat.alerts > 0 ? 'text-yellow-400' : 'text-green-400'}>{stat.alerts}</span>
      </div>
    </div>
  );
}

function ServiceStatusLights({ activeService, health }) {
  // Map health to lamp color with enhanced sci-fi glow
  const color =
    health === 'green' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 
    health === 'amber' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]' : 
    'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.6)]';

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Active service lamp with enhanced styling */}
      <div className="flex items-center gap-2 p-3 border border-cyan-500/30 rounded-lg bg-black/40 backdrop-blur-sm">
        <div className={`w-5 h-5 rounded-full ${color} animate-pulse`} />
        <span className="text-sm font-mono text-cyan-200 truncate">{activeService}</span>
      </div>
      {/* Fleet heartbeat with enhanced styling */}
      <div className="flex items-center gap-2 p-3 border border-cyan-500/30 rounded-lg bg-black/40 backdrop-blur-sm">
        <div className="w-5 h-5 rounded-full bg-cyan-500 animate-ping shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        <span className="text-sm font-mono text-cyan-200">HEARTBEAT</span>
      </div>
    </div>
  );
}

function ServiceHint({ activeService }) {
  const copy = {
    'Solar Systems': 'Check array voltage, MPPT status, string balance, and irradiance vs PSH.',
    'Diesel Generators': 'Review load factor, fuel rate, coolant temp, oil pressure, and start logs.',
    Controls: 'Inspect controller alarms, inputs/outputs, sensor scaling, and firmware revision.',
    'AC & UPS': 'Verify battery bus voltage, runtime estimates, PF, and inverter thermal status.',
    Automation: 'Confirm cycle steps, interlocks, safety PLC states, and throughput targets.',
    Pumps: 'Validate flow, head, NPSH, motor current, and cavitation risk indicators.',
    Incinerators: 'Check chamber temp, LHV inputs, air-fuel ratio, and burner ignition cycles.',
    'Motors/Rewinding': 'Measure phase current, vibration, insulation resistance, and slip.',
    'Diagnostics Hub': 'Aggregate error codes, resolution rate, and average time to resolve.',
  };
  return (
    <div className="mt-3 p-3 bg-black/60 border border-cyan-500/30 rounded-lg text-xs text-cyan-200/90 font-mono backdrop-blur-sm">
      <div className="flex items-start gap-2">
        <span className="text-cyan-400 mt-0.5">▶</span>
        <span>{copy[activeService]}</span>
      </div>
    </div>
  );
}

function getBlipCount(service) {
  const base = 16;
  const map = {
    'Solar Systems': base + 6,
    'Diesel Generators': base + 8,
    Controls: base + 4,
    'AC & UPS': base + 5,
    Automation: base + 7,
    Pumps: base + 5,
    Incinerators: base + 3,
    'Motors/Rewinding': base + 6,
    'Diagnostics Hub': base + 10,
  };
  return map[service] ?? base;
}

function initialLogs() {
  return [
    '[INIT] Universal Diagnostic Machine online',
    '[CHECK] Sensors synced, heartbeat nominal',
    '[INFO] Awaiting service selection...',
  ];
}

function generateDiagnosticLine(service) {
  const ts = new Date().toLocaleTimeString();
  
  // Filter comprehensive error codes for the active service
  const serviceCodes = comprehensiveErrorCodes.filter(code => code.service === service);
  
  if (serviceCodes.length === 0) {
    return { line: `[${ts}] ${service}: All systems nominal`, severity: 'LOW', details: null };
  }
  
  // Pick a random error code
  const errorCode = serviceCodes[Math.floor(Math.random() * serviceCodes.length)];
  
  // Create detailed diagnostic line with technical information
  const line = `[${ts}] ${errorCode.code} - ${errorCode.issue} | ${errorCode.recommendation}`;
  
  return { 
    line, 
    severity: errorCode.severity,
    details: {
      code: errorCode.code,
      issue: errorCode.issue,
      symptoms: errorCode.symptoms,
      causes: errorCode.causes,
      solution: errorCode.solution,
      parts: errorCode.parts,
      tools: errorCode.tools,
      downtime: errorCode.downtime
    }
  };
}