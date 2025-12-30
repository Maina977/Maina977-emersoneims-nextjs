'use client';

import { useEffect, useMemo, useState } from 'react';
import MetalBezel from './MetalBezel';
import RadarScope from './RadarScope';
import { GENERATOR_SERVICES } from '@/lib/data/diagnosticServices';
import comprehensiveErrorCodes from '@/app/data/diagnostic/comprehensiveErrorCodes.json';
import { allControllerErrorCodes } from '@/app/data/diagnostic/allControllerErrorCodes';

/**
 * GeneratorControlDiagnosticHub - Specialized diagnostic tool for Generators, Controls, DeepSea, and PowerWizard
 * This is the generator-specific diagnostic tool, separate from the Universal Diagnostic Machine
 * @param {Object} props
 * @param {((service: string, severity: string) => void) | null | undefined} [props.onSeverityUpdate] - Optional callback for severity updates
 */
export default function GeneratorControlDiagnosticHub({ onSeverityUpdate = null }) {
  const [activeService, setActiveService] = useState(GENERATOR_SERVICES[0]);
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

  const clearAlerts = () => setAlerts([]);

  return (
    <MetalBezel title="Generator Control Diagnostic Hub (Generators, Controls, DeepSea, PowerWizard)">
      {/* SpaceX Crew Dragon Style Interface */}
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* SpaceX Blue Header Bar */}
        <div className="bg-gradient-to-r from-[#005288] to-[#0066AA] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-semibold">CREW DRAGON DIAGNOSTIC INTERFACE</h2>
              <p className="text-blue-100 text-sm mt-1">Generator Control Systems • DeepSea • PowerWizard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white text-sm font-medium">MISSION TIME</div>
                <div className="text-blue-100 text-xs font-mono">{new Date().toLocaleTimeString()}</div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            </div>
          </div>
        </div>

        {/* Main Content Area - Clean White Background */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 xl:grid-cols-[320px,1fr,280px] gap-6">
            {/* Left Panel - Touchscreen Style */}
            <div className="space-y-4">
              {/* Service Status - Crew Dragon Style */}
              <CrewDragonPanel title="System Status">
                <ServiceStatusLights activeService={activeService} health={health} />
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">System Health</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      health === 'green' ? 'bg-green-100 text-green-700' :
                      health === 'amber' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {health.toUpperCase()}
                    </span>
                  </div>
                </div>
              </CrewDragonPanel>

              {/* Service Selector - Touchscreen Buttons */}
              <CrewDragonPanel title="Service Selection">
                <div className="space-y-2">
                  {GENERATOR_SERVICES.map((service) => (
                    <button
                      key={service}
                      onClick={() => setActiveService(service)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 font-medium ${
                        activeService === service
                          ? 'bg-[#005288] text-white shadow-lg transform scale-[1.02]'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{service}</span>
                        {activeService === service && (
                          <span className="text-white">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CrewDragonPanel>

              {/* Diagnostic Logs - Clean Style */}
              <CrewDragonPanel title="Diagnostic Logs">
                <div className="bg-white rounded-lg border border-gray-200 p-3 h-48 overflow-y-auto font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">No logs available</div>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="text-gray-700 mb-1 py-1 border-b border-gray-100 last:border-0">
                        <span className="text-[#005288] font-semibold">[{log.split(']')[0]}]</span>
                        <span className="ml-2">{log.split(']')[1]}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {logs.length}/50 entries
                </div>
              </CrewDragonPanel>
            </div>

            {/* Center Panel - Main Display */}
            <div className="space-y-4">
              {/* Radar Display - Crew Dragon Style */}
              <CrewDragonPanel title={`System Monitor — ${activeService}`}>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <RadarScope size={400} sweepSpeed={0.024} blipCount={blipCount} />
                </div>
                <ServiceHint activeService={activeService} />
              </CrewDragonPanel>

              {/* Alerts - Clean Card Style */}
              <CrewDragonPanel title="Alerts & Recommendations">
                {alerts.length === 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-green-600 font-semibold mb-1">✓ All Systems Nominal</div>
                    <div className="text-green-500 text-sm">No active alerts</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          alert.level === 'HIGH'
                            ? 'bg-red-50 border-red-500'
                            : 'bg-yellow-50 border-yellow-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className={`font-semibold text-sm ${
                              alert.level === 'HIGH' ? 'text-red-700' : 'text-yellow-700'
                            }`}>
                              {alert.title}
                            </div>
                            <div className={`text-xs mt-1 ${
                              alert.level === 'HIGH' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {alert.message}
                            </div>
                          </div>
                          <button
                            onClick={clearAlerts}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CrewDragonPanel>
            </div>

            {/* Right Panel - System Metrics */}
            <div className="space-y-4">
              {/* Quick Metrics */}
              <CrewDragonPanel title="System Metrics">
                <SystemMetrics activeService={activeService} />
              </CrewDragonPanel>

              {/* Communication Status */}
              <CrewDragonPanel title="Communication">
                <CommStatus />
              </CrewDragonPanel>

              {/* Power Status */}
              <CrewDragonPanel title="Power Status">
                <PowerStatus />
              </CrewDragonPanel>
            </div>
          </div>
        </div>
      </div>
    </MetalBezel>
  );
}

/* ---------- Helpers & small subcomponents ---------- */

// SpaceX Crew Dragon Style Panel
function CrewDragonPanel({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-[#005288] mb-4 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ServiceStatusLights({ activeService, health }) {
  // Clean Crew Dragon style status indicators
  return (
    <div className="space-y-3">
      {/* Active service indicator */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            health === 'green' ? 'bg-green-500' : 
            health === 'amber' ? 'bg-yellow-400' : 
            'bg-red-500'
          }`} />
          <span className="text-sm font-medium text-gray-700">{activeService}</span>
        </div>
        <span className="text-xs text-gray-500 font-mono">ACTIVE</span>
      </div>
      {/* System heartbeat */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#005288] animate-pulse" />
          <span className="text-sm font-medium text-gray-700">System Heartbeat</span>
        </div>
        <span className="text-xs text-[#005288] font-mono font-semibold">ONLINE</span>
      </div>
    </div>
  );
}

// System Metrics Component
function SystemMetrics({ activeService }) {
  const metrics = {
    'Diesel Generators': { load: '72%', temp: '185°F', pressure: '45 PSI' },
    'Generator Controls': { load: '85%', temp: 'N/A', pressure: 'N/A' },
    'DeepSea Controllers': { load: '78%', temp: 'N/A', pressure: 'N/A' },
    'PowerWizard Systems': { load: '82%', temp: 'N/A', pressure: 'N/A' },
  };
  
  const metric = metrics[activeService] || { load: 'N/A', temp: 'N/A', pressure: 'N/A' };
  
  return (
    <div className="space-y-4">
      <MetricCard label="Load Factor" value={metric.load} color="blue" />
      {metric.temp !== 'N/A' && <MetricCard label="Temperature" value={metric.temp} color="orange" />}
      {metric.pressure !== 'N/A' && <MetricCard label="Pressure" value={metric.pressure} color="green" />}
    </div>
  );
}

function MetricCard({ label, value, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    green: 'bg-green-50 border-green-200 text-green-700',
  };
  
  return (
    <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-xs font-medium opacity-70 mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

// Communication Status Component
function CommStatus() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-700">Primary Link</span>
        </div>
        <span className="text-xs text-green-600 font-semibold">ACTIVE</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-700">Backup Link</span>
        </div>
        <span className="text-xs text-gray-500">STANDBY</span>
      </div>
      <div className="pt-2 border-t border-gray-200 text-xs text-gray-500 text-center">
        Latency: 8ms
      </div>
    </div>
  );
}

// Power Status Component
function PowerStatus() {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 mb-2">Main Power</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#005288] rounded-full" style={{ width: '95%' }} />
          </div>
          <span className="text-sm font-semibold text-[#005288]">95%</span>
        </div>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 mb-2">Backup Power</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
          </div>
          <span className="text-sm font-semibold text-green-600">100%</span>
        </div>
      </div>
    </div>
  );
}

function ServiceHint({ activeService }) {
  const copy = {
    'Diesel Generators': 'Check load factor, fuel rate, coolant temp, oil pressure, start logs, and engine diagnostics.',
    'Generator Controls': 'Inspect controller alarms, inputs/outputs, sensor scaling, firmware revision, and control logic.',
    'DeepSea Controllers': 'Verify DeepSea firmware version, alarm codes, sensor readings, and communication status.',
    'PowerWizard Systems': 'Check PowerWizard configuration, load sharing, synchronization, and system integration.',
  };
  return (
    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-[#005288] rounded-r-lg">
      <div className="flex items-start gap-2">
        <span className="text-[#005288] font-bold">ℹ</span>
        <p className="text-sm text-gray-700 leading-relaxed">{copy[activeService]}</p>
      </div>
    </div>
  );
}

function getBlipCount(service) {
  const base = 18;
  const map = {
    'Diesel Generators': base + 8,
    'Generator Controls': base + 6,
    'DeepSea Controllers': base + 7,
    'PowerWizard Systems': base + 9,
  };
  return map[service] ?? base;
}

function initialLogs() {
  return [
    '[INIT] Generator Control Diagnostic Hub online',
    '[CHECK] Generator systems synced, heartbeat nominal',
    '[INFO] DeepSea and PowerWizard controllers detected',
    '[INFO] Awaiting service selection...',
  ];
}

function generateDiagnosticLine(service) {
  const ts = new Date().toLocaleTimeString();
  
  // Map service names to match error code service names
  const serviceMap = {
    'Diesel Generators': 'Diesel Generators',
    'Generator Controls': 'Controls',
    'DeepSea Controllers': 'DeepSea Controllers',
    'PowerWizard Systems': 'PowerWizard Systems'
  };
  
  const mappedService = serviceMap[service] || service;
  
  // Filter comprehensive error codes for the active service
  const serviceCodes = comprehensiveErrorCodes.filter(code => 
    code.service === mappedService || 
    (mappedService === 'Generator Controls' && code.code.startsWith('CTRL-')) ||
    (mappedService === 'DeepSea Controllers' && code.code.startsWith('DS-')) ||
    (mappedService === 'PowerWizard Systems' && code.code.startsWith('PW-'))
  );
  
  if (serviceCodes.length === 0) {
    return { line: `[${ts}] ${service}: All systems nominal`, severity: 'LOW', details: null };
  }
  
  // Pick a random error code
  const errorCode = serviceCodes[Math.floor(Math.random() * serviceCodes.length)];
  
  // Create detailed diagnostic line
  const line = `[${ts}] ${errorCode.code} - ${errorCode.issue} | Downtime: ${errorCode.downtime} | ${errorCode.recommendation}`;
  
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

