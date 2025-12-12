'use client';

import { useEffect, useMemo, useState } from 'react';
import MetalBezel from './MetalBezel';
import RadarScope from './RadarScope';
import SystemLogs from './SystemLogs';
import CockpitSwitches from './CockpitSwitches';
import PopUps from './PopUps';

const SERVICES = [
  'Solar Systems',
  'Diesel Generators',
  'Controls',
  'AC & UPS',
  'Automation',
  'Pumps',
  'Incinerators',
  'Motors/Rewinding',
  'Diagnostics Hub',
];

/**
 * UniversalDiagnosticMachine - Awwwards-winning diagnostics cockpit
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
    <MetalBezel title="Universal Diagnostic Machine (All 9 Services)">
      <div className="grid grid-cols-1 xl:grid-cols-[380px,1fr] gap-6">
        {/* Left instrument stack */}
        <div className="space-y-6">
          {/* Status lights reflect health */}
          <Panel title="SERVICE STATUS">
            <ServiceStatusLights activeService={activeService} health={health} />
          </Panel>

          {/* Service selector via cockpit switches */}
          <Panel title="SERVICE SELECTOR">
            <CockpitSwitches
              labels={SERVICES}
              onToggle={onSwitchToggle}
              // Preselect current service (optional)
              initialState={SERVICES.reduce((acc, s) => ({ ...acc, [s]: s === activeService }), {})}
            />
          </Panel>

          {/* Logs */}
          <Panel title="DIAGNOSTIC LOGS">
            <SystemLogs initialLogs={logs} />
          </Panel>
        </div>

        {/* Right main display: radar + contextual helper */}
        <div className="space-y-6">
          <Panel title={`RADAR — ${activeService}`}>
            <RadarScope size={400} sweepSpeed={0.024} blipCount={blipCount} />
            <ServiceHint activeService={activeService} />
          </Panel>

          {/* Popups for alerts/tips */}
          <Panel title="ALERTS / RECOMMENDATIONS">
            <PopUps alerts={alerts} onClear={clearAlerts} />
          </Panel>
        </div>
      </div>
    </MetalBezel>
  );
}

/* ---------- Helpers & small subcomponents ---------- */

function Panel({ title, children }) {
  return (
    <div className="p-3 bg-gray-900 border-2 border-gray-600 rounded-lg">
      <h3 className="text-xs font-bold text-gray-300 tracking-widest mb-2">{title}</h3>
      {children}
    </div>
  );
}

function ServiceStatusLights({ activeService, health }) {
  // Map health to lamp color
  const color =
    health === 'green' ? 'bg-green-500' : health === 'amber' ? 'bg-yellow-400' : 'bg-red-600';

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Active service lamp */}
      <div className="flex items-center gap-2 p-2 border border-gray-700 rounded">
        <div className={`w-5 h-5 rounded-full ${color} animate-pulse`} />
        <span className="text-sm font-mono text-gray-200">{activeService}</span>
      </div>
      {/* Fleet heartbeat */}
      <div className="flex items-center gap-2 p-2 border border-gray-700 rounded">
        <div className="w-5 h-5 rounded-full bg-blue-500 animate-ping" />
        <span className="text-sm font-mono text-gray-200">HEARTBEAT</span>
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
    <div className="mt-3 p-2 bg-black border border-gray-700 rounded text-xs text-gray-300 font-mono">
      {copy[activeService]}
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
  const msgs = {
    'Solar Systems': [
      'String voltage imbalance detected; recommend IV sweep',
      'Irradiance below threshold, PSH recalibration recommended',
      'MPPT tracking nominal',
    ],
    'Diesel Generators': [
      'Oil pressure transient observed; check filter',
      'Load factor stable at 0.72',
      'Fuel rate high; inspect injector calibration',
    ],
    Controls: [
      'Controller alarm A12: Sensor scaling mismatch',
      'Firmware OK; CRC verified',
      'I/O mapping updated',
    ],
    'AC & UPS': [
      'Runtime estimate 42 min at current load',
      'PF low; corrective tuning advised',
      'Bus voltage ripple within tolerance',
    ],
    Automation: [
      'Cycle time trending up; bottleneck at Step 2',
      'Interlock confirmed; safety loop closed',
      'Throughput stable at 180 u/h',
    ],
    Pumps: [
      'NPSH margin tight; cavitation risk',
      'Motor current nominal',
      'Head/flow within curve',
    ],
    Incinerators: [
      'AFR drift; burner tuning required',
      'Chamber temperature stable',
      'LHV variability detected',
    ],
    'Motors/Rewinding': [
      'Insulation resistance borderline; schedule IR test',
      'Vibration spike at 48 Hz; check bearing',
      'Slip within expected limits',
    ],
    'Diagnostics Hub': [
      'Resolution rate improved to 0.86',
      'Avg time to resolve: 1.9 h',
      'New error codes ingested',
    ],
  };
  const pool = msgs[service] || ['System check OK'];
  const pick = pool[Math.floor(Math.random() * pool.length)];

  // Severity heuristic
  let severity = 'LOW';
  if (pick.toLowerCase().includes('risk') || pick.toLowerCase().includes('critical')) severity = 'HIGH';
  else if (pick.toLowerCase().includes('borderline') || pick.toLowerCase().includes('drift')) severity = 'MED';

  return { line: `[${ts}] ${service}: ${pick}`, severity };
}