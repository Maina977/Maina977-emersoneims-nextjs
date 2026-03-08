'use client';

/**
 * ORACLE DIAGNOSTIC INTERFACE (ODI) - MAIN DASHBOARD
 *
 * Complete diagnostic and programming interface that replaces
 * all proprietary OEM tools (CAT ET, INSITE, VODIA, etc.)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createDriver,
  getSupportedProtocols,
  J1939_PGNS,
  J1939_SPN_DEFINITIONS,
  type ProtocolDriver,
  type SensorReading,
  type FaultCode,
  type ECMIdentification,
  type ProtocolType
} from '@/lib/generator-oracle/odi/protocolDrivers';
import {
  ECM_MODELS,
  getECMById,
  getECMsByManufacturer,
  getAllManufacturers,
  searchECMs,
  getCompatibleControllers,
  checkCompatibility,
  getAllProgrammingEvents,
  type ECMModel,
  type ProgrammingEvent
} from '@/lib/generator-oracle/odi/ecmDatabase';
import {
  ProgrammingEngine,
  formatDuration,
  getLogLevelColor,
  type ProgrammingSession,
  type ProgrammingLog,
  type ProgrammingOptions
} from '@/lib/generator-oracle/odi/programmingModule';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function GlassCard({ children, className = '', title, icon, glow = false }: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  glow?: boolean;
}) {
  return (
    <div className={`relative backdrop-blur-xl rounded-2xl border overflow-hidden ${
      glow ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/20' : 'border-slate-700/50'
    } ${className}`}
    style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)' }}>
      {title && (
        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="text-white font-bold">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'connected' | 'disconnected' | 'error' | 'programming' }) {
  const configs = {
    connected: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', label: 'Connected' },
    disconnected: { bg: 'bg-slate-500/20', border: 'border-slate-500/50', text: 'text-slate-400', label: 'Disconnected' },
    error: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', label: 'Error' },
    programming: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', label: 'Programming' }
  };
  const cfg = configs[status];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

function SensorGauge({ reading }: { reading: SensorReading }) {
  const spnDef = J1939_SPN_DEFINITIONS[reading.spn];
  const percentage = spnDef
    ? ((reading.value - (spnDef.offset || 0)) / ((spnDef.resolution || 1) * 255)) * 100
    : 50;

  return (
    <div className="p-3 bg-slate-800/50 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400">{reading.name}</span>
        <span className="text-xs text-slate-500">SPN {reading.spn}</span>
      </div>
      <div className="text-2xl font-bold text-cyan-400">
        {reading.value.toFixed(1)}
        <span className="text-sm text-slate-500 ml-1">{reading.unit}</span>
      </div>
      <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
}

function ProgrammingConsole({ session, onAbort }: {
  session: ProgrammingSession;
  onAbort: () => void;
}) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.logs]);

  return (
    <GlassCard title="Programming Console" icon="💻" className="h-full">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white">{session.currentStep}</span>
          <span className="text-sm text-cyan-400">{session.progress.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              session.status === 'error' ? 'bg-red-500' :
              session.status === 'complete' ? 'bg-green-500' :
              'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            animate={{ width: `${session.progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/50 rounded-lg">
        <div>
          <span className="text-xs text-slate-500">Status:</span>
          <span className={`ml-2 text-sm font-bold ${
            session.status === 'error' ? 'text-red-400' :
            session.status === 'complete' ? 'text-green-400' :
            'text-amber-400'
          }`}>
            {session.status.toUpperCase().replace('_', ' ')}
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Step {session.currentStepIndex + 1} / {session.totalSteps}
        </div>
      </div>

      {/* Log Output */}
      <div className="h-64 overflow-y-auto bg-slate-900/80 rounded-lg p-3 font-mono text-xs">
        {session.logs.map((log, idx) => (
          <div key={idx} className="flex gap-2 mb-1">
            <span className="text-slate-600">
              {log.timestamp.toLocaleTimeString()}
            </span>
            <span style={{ color: getLogLevelColor(log.level) }}>
              [{log.level.toUpperCase()}]
            </span>
            <span className="text-slate-300">{log.message}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Abort Button */}
      {session.status !== 'complete' && session.status !== 'error' && (
        <button
          onClick={onAbort}
          className="mt-4 w-full py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 font-medium"
        >
          Abort Programming
        </button>
      )}
    </GlassCard>
  );
}

function ECMSelector({ onSelect }: { onSelect: (ecm: ECMModel) => void }) {
  const [search, setSearch] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);

  const manufacturers = getAllManufacturers();
  const filteredECMs = search
    ? searchECMs(search)
    : selectedManufacturer
    ? getECMsByManufacturer(selectedManufacturer)
    : ECM_MODELS;

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search ECM models..."
        className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
      />

      {/* Manufacturer Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedManufacturer(null)}
          className={`px-3 py-1 rounded-lg text-xs ${
            !selectedManufacturer ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-slate-800 text-slate-400'
          }`}
        >
          All
        </button>
        {manufacturers.map(mfr => (
          <button
            key={mfr}
            onClick={() => setSelectedManufacturer(mfr)}
            className={`px-3 py-1 rounded-lg text-xs ${
              selectedManufacturer === mfr ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {mfr}
          </button>
        ))}
      </div>

      {/* ECM List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filteredECMs.map(ecm => (
          <button
            key={ecm.id}
            onClick={() => onSelect(ecm)}
            className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <span className="text-lg">🔧</span>
              </div>
              <div>
                <h4 className="text-white font-medium">{ecm.manufacturer} {ecm.model}</h4>
                <p className="text-xs text-slate-500">
                  {ecm.engineApplications.map(a => a.engineModel).join(', ')}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FaultCodeList({ faults, onClear }: { faults: FaultCode[]; onClear: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-bold">Fault Codes ({faults.length})</h4>
        {faults.length > 0 && (
          <button
            onClick={onClear}
            className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-xs hover:bg-red-500/30"
          >
            Clear All
          </button>
        )}
      </div>

      {faults.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          <span className="text-4xl mb-2 block">✅</span>
          No fault codes
        </div>
      ) : (
        <div className="space-y-2">
          {faults.map((fault, idx) => (
            <div key={idx} className={`p-3 rounded-lg border ${
              fault.active
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  fault.lampStatus === 'red' ? 'bg-red-500/20 text-red-400' :
                  fault.lampStatus === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  SPN {fault.spn} / FMI {fault.fmi}
                </span>
                {fault.active && (
                  <span className="text-xs text-red-400 animate-pulse">ACTIVE</span>
                )}
              </div>
              <p className="text-sm text-white">{fault.description}</p>
              <p className="text-xs text-slate-500 mt-1">
                {fault.occurrenceCount} occurrences
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ODIDashboardPanel({ className = '' }: { className?: string }) {
  // State
  const [activeTab, setActiveTab] = useState<'connect' | 'monitor' | 'faults' | 'program' | 'database' | 'history'>('connect');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'error' | 'programming'>('disconnected');
  const [selectedECM, setSelectedECM] = useState<ECMModel | null>(null);
  const [ecmInfo, setEcmInfo] = useState<ECMIdentification | null>(null);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [faultCodes, setFaultCodes] = useState<FaultCode[]>([]);
  const [programmingSession, setProgrammingSession] = useState<ProgrammingSession | null>(null);
  const [programmingEvents, setProgrammingEvents] = useState<ProgrammingEvent[]>([]);

  const driverRef = useRef<ProtocolDriver | null>(null);
  const engineRef = useRef<ProgrammingEngine | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load programming history
  useEffect(() => {
    setProgrammingEvents(getAllProgrammingEvents());
  }, []);

  // Connect to ECM
  const handleConnect = useCallback(async () => {
    if (!selectedECM) return;

    try {
      // Create driver based on ECM protocols
      const protocolType = selectedECM.protocols[0] as ProtocolType;
      const driver = createDriver(protocolType);
      driverRef.current = driver;

      await driver.initialize();

      const result = await driver.connect({
        interface: 'USB',
        canBitrate: 250000,
        timeout: 5000
      });

      if (result.success) {
        setConnectionStatus('connected');
        setEcmInfo(result.ecmInfo || null);

        // Create programming engine
        engineRef.current = new ProgrammingEngine(driver);

        // Start sensor stream simulation
        startSensorStream();

        // Read fault codes
        if (driver instanceof Object && 'readDTCs' in driver) {
          const dtcs = await (driver as { readDTCs: () => Promise<FaultCode[]> }).readDTCs();
          setFaultCodes(dtcs);
        }
      } else {
        setConnectionStatus('error');
      }
    } catch {
      setConnectionStatus('error');
    }
  }, [selectedECM]);

  // Disconnect
  const handleDisconnect = useCallback(async () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }

    if (driverRef.current) {
      await driverRef.current.disconnect();
      driverRef.current = null;
    }

    setConnectionStatus('disconnected');
    setEcmInfo(null);
    setSensorReadings([]);
    setFaultCodes([]);
  }, []);

  // Start sensor stream
  const startSensorStream = useCallback(() => {
    // Simulate real-time sensor data
    streamIntervalRef.current = setInterval(() => {
      setSensorReadings([
        { spn: 190, name: 'Engine Speed', value: 1500 + Math.random() * 50, unit: 'rpm', rawValue: 0, status: 'valid', timestamp: Date.now() },
        { spn: 100, name: 'Oil Pressure', value: 45 + Math.random() * 5, unit: 'psi', rawValue: 0, status: 'valid', timestamp: Date.now() },
        { spn: 110, name: 'Coolant Temp', value: 85 + Math.random() * 3, unit: 'C', rawValue: 0, status: 'valid', timestamp: Date.now() },
        { spn: 92, name: 'Engine Load', value: 60 + Math.random() * 10, unit: '%', rawValue: 0, status: 'valid', timestamp: Date.now() },
        { spn: 168, name: 'Battery Voltage', value: 13.6 + Math.random() * 0.4, unit: 'V', rawValue: 0, status: 'valid', timestamp: Date.now() },
        { spn: 183, name: 'Fuel Rate', value: 15 + Math.random() * 2, unit: 'L/h', rawValue: 0, status: 'valid', timestamp: Date.now() },
        { spn: 102, name: 'Boost Pressure', value: 18 + Math.random() * 2, unit: 'psi', rawValue: 0, status: 'valid', timestamp: Date.now() },
        { spn: 96, name: 'Fuel Level', value: 75 + Math.random() * 2, unit: '%', rawValue: 0, status: 'valid', timestamp: Date.now() },
      ]);
    }, 1000);
  }, []);

  // Clear fault codes
  const handleClearFaults = useCallback(async () => {
    if (!engineRef.current || !selectedECM) return;

    setConnectionStatus('programming');

    const options: ProgrammingOptions = {
      verifyAfterWrite: true,
      backupBeforeWrite: false,
      clearFaultsAfter: true,
      resetAdaptationsAfter: false,
      preserveTrips: true,
      technicianId: 'TECH001',
      technicianName: 'Demo Technician'
    };

    await engineRef.current.clearFaultCodes(
      selectedECM,
      options,
      (session) => setProgrammingSession(session)
    );

    setFaultCodes([]);
    setConnectionStatus('connected');
    setProgrammingEvents(getAllProgrammingEvents());
  }, [selectedECM]);

  // Start firmware update
  const handleFirmwareUpdate = useCallback(async () => {
    if (!engineRef.current || !selectedECM) return;

    setConnectionStatus('programming');
    setActiveTab('program');

    const firmware = selectedECM.firmwareVersions.find(fw => fw.status === 'current');
    if (!firmware) return;

    const options: ProgrammingOptions = {
      verifyAfterWrite: true,
      backupBeforeWrite: true,
      clearFaultsAfter: true,
      resetAdaptationsAfter: true,
      preserveTrips: true,
      technicianId: 'TECH001',
      technicianName: 'Demo Technician'
    };

    // Create dummy firmware data
    const firmwareData = new ArrayBuffer(firmware.fileSize);

    await engineRef.current.updateFirmware(
      selectedECM,
      {
        ecmModel: selectedECM.model,
        version: firmware.version,
        data: firmwareData,
        checksum: firmware.checksum,
        blockSize: 256,
        metadata: {
          releaseDate: firmware.releaseDate,
          minimumHardware: firmware.minimumHardwareRevision,
          compatibleCalibrations: firmware.compatibleCalibrations,
          releaseNotes: firmware.releaseNotes,
          encrypted: false,
          compressed: false
        }
      },
      options,
      (session) => setProgrammingSession(session)
    );

    setConnectionStatus('connected');
    setProgrammingEvents(getAllProgrammingEvents());
  }, [selectedECM]);

  // Abort programming
  const handleAbort = useCallback(() => {
    engineRef.current?.abort();
  }, []);

  // Render tabs
  const renderTab = () => {
    switch (activeTab) {
      case 'connect':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard title="Select ECM" icon="🔧">
              <ECMSelector onSelect={(ecm) => {
                setSelectedECM(ecm);
              }} />
            </GlassCard>

            <GlassCard title="Connection" icon="🔌" glow={connectionStatus === 'connected'}>
              {selectedECM ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <h4 className="text-white font-bold mb-2">{selectedECM.manufacturer} {selectedECM.model}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">Protocols:</span>
                        <span className="text-cyan-400 ml-2">{selectedECM.protocols.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Connector:</span>
                        <span className="text-cyan-400 ml-2">{selectedECM.connectorType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <StatusBadge status={connectionStatus} />
                    {connectionStatus === 'disconnected' ? (
                      <button
                        onClick={handleConnect}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl"
                      >
                        Connect
                      </button>
                    ) : (
                      <button
                        onClick={handleDisconnect}
                        className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>

                  {ecmInfo && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <h4 className="text-green-400 font-bold mb-2">ECM Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-slate-500">Serial:</span> <span className="text-white">{ecmInfo.serialNumber}</span></div>
                        <div><span className="text-slate-500">Firmware:</span> <span className="text-white">{ecmInfo.softwareVersion}</span></div>
                        <div><span className="text-slate-500">Hardware:</span> <span className="text-white">{ecmInfo.hardwareVersion}</span></div>
                        <div><span className="text-slate-500">Calibration:</span> <span className="text-white">{ecmInfo.calibrationId}</span></div>
                        <div><span className="text-slate-500">Hours:</span> <span className="text-white">{ecmInfo.totalHours?.toLocaleString() ?? 'N/A'}</span></div>
                        <div><span className="text-slate-500">Engine:</span> <span className="text-white">{ecmInfo.engineType ?? 'N/A'}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <span className="text-4xl mb-2 block">👈</span>
                  Select an ECM model to continue
                </div>
              )}
            </GlassCard>
          </div>
        );

      case 'monitor':
        return (
          <GlassCard title="Live Sensor Data" icon="📊" glow>
            {connectionStatus === 'connected' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sensorReadings.map(reading => (
                  <SensorGauge key={reading.spn} reading={reading} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                Connect to ECM to view live data
              </div>
            )}
          </GlassCard>
        );

      case 'faults':
        return (
          <GlassCard title="Diagnostic Trouble Codes" icon="⚠️">
            <FaultCodeList faults={faultCodes} onClear={handleClearFaults} />
          </GlassCard>
        );

      case 'program':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard title="Programming Operations" icon="💾">
              <div className="space-y-3">
                <button
                  onClick={handleFirmwareUpdate}
                  disabled={connectionStatus !== 'connected'}
                  className="w-full p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-left hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📦</span>
                    <div>
                      <h4 className="text-white font-medium">Firmware Update</h4>
                      <p className="text-xs text-slate-500">Upload new ECM firmware</p>
                    </div>
                  </div>
                </button>

                <button
                  disabled={connectionStatus !== 'connected'}
                  className="w-full p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-left hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📐</span>
                    <div>
                      <h4 className="text-white font-medium">Calibration Update</h4>
                      <p className="text-xs text-slate-500">Change engine calibration</p>
                    </div>
                  </div>
                </button>

                <button
                  disabled={connectionStatus !== 'connected'}
                  className="w-full p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚙️</span>
                    <div>
                      <h4 className="text-white font-medium">Parameter Editor</h4>
                      <p className="text-xs text-slate-500">Adjust ECM parameters</p>
                    </div>
                  </div>
                </button>

                <button
                  disabled={connectionStatus !== 'connected'}
                  className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-left hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <h4 className="text-white font-medium">Factory Reset</h4>
                      <p className="text-xs text-slate-500">Reset ECM to defaults</p>
                    </div>
                  </div>
                </button>
              </div>
            </GlassCard>

            {programmingSession && (
              <ProgrammingConsole session={programmingSession} onAbort={handleAbort} />
            )}
          </div>
        );

      case 'database':
        return (
          <GlassCard title="ECM Database" icon="📚">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ECM_MODELS.map(ecm => (
                <div key={ecm.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-white font-bold">{ecm.manufacturer} {ecm.model}</h4>
                  <p className="text-xs text-slate-500 mb-2">{ecm.engineApplications.map(a => a.engineModel).join(', ')}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ecm.protocols.map(p => (
                      <span key={p} className="px-2 py-0.5 bg-slate-700 rounded text-[10px] text-cyan-400">{p}</span>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500">
                    {ecm.firmwareVersions.length} firmware | {ecm.calibrations.length} calibrations
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        );

      case 'history':
        return (
          <GlassCard title="Programming History" icon="📋">
            {programmingEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No programming events recorded
              </div>
            ) : (
              <div className="space-y-3">
                {programmingEvents.map(evt => (
                  <div key={evt.id} className={`p-4 rounded-xl border ${
                    evt.result === 'success'
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{evt.ecmModel} - {evt.eventType.replace('_', ' ')}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        evt.result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {evt.result.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {evt.timestamp.toLocaleString()} | {evt.technicianName} | {formatDuration(evt.duration)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center"
          animate={{
            boxShadow: ['0 0 20px rgba(249,115,22,0.5)', '0 0 40px rgba(239,68,68,0.5)', '0 0 20px rgba(249,115,22,0.5)'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-3xl">🔧</span>
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
            Oracle Diagnostic Interface (ODI)
          </h2>
          <p className="text-slate-400">Complete ECM diagnostics & programming - Replaces CAT ET, INSITE, VODIA</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'connect', label: 'Connection', icon: '🔌' },
          { id: 'monitor', label: 'Live Data', icon: '📊' },
          { id: 'faults', label: 'Fault Codes', icon: '⚠️' },
          { id: 'program', label: 'Programming', icon: '💾' },
          { id: 'database', label: 'ECM Database', icon: '📚' },
          { id: 'history', label: 'History', icon: '📋' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
