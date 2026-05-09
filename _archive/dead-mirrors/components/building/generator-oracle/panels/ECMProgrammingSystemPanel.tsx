'use client';

/**
 * ECM PROGRAMMING SYSTEM PANEL - Generator Oracle ODI
 *
 * Complete ECM programming interface with:
 * - Full ECM Programming (Firmware, Calibration)
 * - Reprogramming & Recovery
 * - Fault Code Erasing & Management
 * - Configuration & Tuning
 * - Hardware & Software Modes
 * - Works WITH or WITHOUT hardware
 *
 * © 2026 Generator Oracle. All Rights Reserved.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Wifi,
  WifiOff,
  Usb,
  Settings,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Lock,
  Unlock,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Shield,
  FileCode,
  Wrench,
  Activity,
  Terminal,
  ChevronRight,
  ChevronDown,
  Search,
  Save,
  AlertCircle,
  Info,
  HardDrive,
  Cloud,
  Monitor,
  Copy,
  Code,
  Layers,
  Gauge,
  Power,
  Thermometer,
  Droplet,
  Wind,
} from 'lucide-react';
import {
  ecmProgrammingEngine,
  ECM_SOFTWARE_PROFILES,
  getSupportedECMManufacturers,
  getECMModels,
  getECMSoftwareInfo,
  type ECMConnection,
  type ProgrammingSession,
  type ECMSoftwareProfile,
  type ECMCapability,
  type ParameterBackup,
  type FaultCodeBackup,
  type ConnectionMode,
  type ECMParameter,
  type ParameterGroup,
  type ConfigurationOption,
  type SpecialFunction,
  type DiagnosticFunction,
} from '@/lib/generator-oracle/odi/ecmProgrammingSystem';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type TabType = 'connect' | 'program' | 'faults' | 'parameters' | 'config' | 'special' | 'realtime' | 'logs';

interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error' | 'success';
  message: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ECMProgrammingSystemPanel() {
  // Connection State
  const [activeTab, setActiveTab] = useState<TabType>('connect');
  const [connection, setConnection] = useState<ECMConnection | null>(null);
  const [session, setSession] = useState<ProgrammingSession | null>(null);
  const [softwareProfile, setSoftwareProfile] = useState<ECMSoftwareProfile | null>(null);

  // Form State
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('simulation');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data State
  const [faultCodes, setFaultCodes] = useState<FaultCodeBackup[]>([]);
  const [parameters, setParameters] = useState<ParameterBackup[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [realtimeData, setRealtimeData] = useState<Record<string, number>>({});

  // UI State
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedFaults, setSelectedFaults] = useState<Set<string>>(new Set());

  const manufacturers = getSupportedECMManufacturers();
  const models = selectedManufacturer ? getECMModels(selectedManufacturer) : [];

  // ─────────────────────────────────────────────────────────────────────────────
  // Logging Helper
  // ─────────────────────────────────────────────────────────────────────────────

  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs(prev => [{ timestamp: new Date(), level, message }, ...prev.slice(0, 199)]);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Real-time Data Simulation
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!connection || activeTab !== 'realtime') return;

    const interval = setInterval(() => {
      setRealtimeData({
        rpm: Math.floor(1750 + Math.random() * 100),
        coolantTemp: Math.floor(82 + Math.random() * 8),
        oilPressure: Math.floor(350 + Math.random() * 50),
        boostPressure: Math.floor(175 + Math.random() * 30),
        fuelPressure: Math.floor(42000 + Math.random() * 3000),
        fuelRate: Math.floor(25 + Math.random() * 10),
        batteryVoltage: 27.5 + Math.random() * 0.5,
        loadPercent: Math.floor(65 + Math.random() * 20),
        exhaustTemp: Math.floor(420 + Math.random() * 60),
        intakeTemp: Math.floor(35 + Math.random() * 10),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [connection, activeTab]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Connection Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const handleConnect = async () => {
    if (!selectedManufacturer || !selectedModel) {
      addLog('error', 'Please select ECM manufacturer and model');
      return;
    }

    setIsConnecting(true);
    addLog('info', `Connecting to ${selectedManufacturer} ${selectedModel} in ${connectionMode} mode...`);

    try {
      const conn = await ecmProgrammingEngine.connect({
        mode: connectionMode,
        ecmManufacturer: selectedManufacturer,
        ecmModel: selectedModel,
      });

      setConnection(conn);
      setSoftwareProfile(ecmProgrammingEngine.getSoftwareProfile());
      addLog('success', `Connected to ${selectedManufacturer} ${selectedModel}`);

      // Auto-unlock basic security level
      await ecmProgrammingEngine.unlockSecurityLevel(1);
      setConnection(ecmProgrammingEngine.getConnectionStatus());
      addLog('info', 'Security Level 1 unlocked (Read Access)');

    } catch (error) {
      addLog('error', `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    addLog('info', 'Disconnecting...');
    await ecmProgrammingEngine.disconnect();
    setConnection(null);
    setSoftwareProfile(null);
    setFaultCodes([]);
    setParameters([]);
    setRealtimeData({});
    addLog('success', 'Disconnected');
  };

  const handleUnlockSecurity = async (level: number) => {
    addLog('info', `Unlocking Security Level ${level}...`);
    try {
      const success = await ecmProgrammingEngine.unlockSecurityLevel(level);
      if (success) {
        setConnection(ecmProgrammingEngine.getConnectionStatus());
        addLog('success', `Security Level ${level} unlocked`);
      }
    } catch (error) {
      addLog('error', `Unlock failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Fault Code Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const handleReadFaults = async () => {
    if (!connection) return;
    setIsProcessing(true);
    addLog('info', 'Reading fault codes...');

    try {
      const codes = await ecmProgrammingEngine.readFaultCodes();
      setFaultCodes(codes);
      addLog('success', `Read ${codes.length} fault code(s)`);
    } catch (error) {
      addLog('error', `Read failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEraseFaults = async (eraseAll: boolean = false) => {
    if (!connection) return;
    setIsProcessing(true);

    const codes = eraseAll ? undefined : Array.from(selectedFaults);
    addLog('info', eraseAll ? 'Erasing all fault codes...' : `Erasing ${codes?.length} fault code(s)...`);

    try {
      const result = await ecmProgrammingEngine.eraseFaultCodes({ eraseAll, codes });
      if (result.success) {
        addLog('success', result.message);
        setSelectedFaults(new Set());
        await handleReadFaults();
      }
    } catch (error) {
      addLog('error', `Erase failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Parameter Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const handleReadParameters = async () => {
    if (!connection) return;
    setIsProcessing(true);
    addLog('info', 'Reading parameters...');

    try {
      const params = await ecmProgrammingEngine.readParameters();
      setParameters(params);
      addLog('success', `Read ${params.length} parameter(s)`);
    } catch (error) {
      addLog('error', `Read failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWriteParameter = async (id: string, value: number) => {
    if (!connection) return;
    addLog('info', `Writing parameter ${id}...`);

    try {
      const result = await ecmProgrammingEngine.writeParameter(id, value);
      if (result.success) {
        addLog('success', result.message);
        await handleReadParameters();
      }
    } catch (error) {
      addLog('error', `Write failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Programming Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const handleCreateBackup = async () => {
    if (!connection) return;
    setIsProcessing(true);
    addLog('info', 'Creating ECM backup...');

    try {
      const backup = await ecmProgrammingEngine.createBackup();
      addLog('success', `Backup created: ${backup.id}`);
      // In production: save to file/storage
    } catch (error) {
      addLog('error', `Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpecialFunction = async (funcId: string) => {
    if (!connection) return;
    const func = softwareProfile?.specialFunctions.find(f => f.id === funcId);
    setIsProcessing(true);
    addLog('info', `Executing: ${func?.name}...`);

    try {
      const result = await ecmProgrammingEngine.executeSpecialFunction(funcId);
      if (result.success) {
        addLog('success', result.result);
      }
    } catch (error) {
      addLog('error', `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // UI Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  const tabs: { id: TabType; label: string; icon: React.ReactNode; requiresConn: boolean }[] = [
    { id: 'connect', label: 'Connect', icon: <Wifi className="w-4 h-4" />, requiresConn: false },
    { id: 'program', label: 'Program', icon: <Cpu className="w-4 h-4" />, requiresConn: true },
    { id: 'faults', label: 'Fault Codes', icon: <AlertTriangle className="w-4 h-4" />, requiresConn: true },
    { id: 'parameters', label: 'Parameters', icon: <Settings className="w-4 h-4" />, requiresConn: true },
    { id: 'config', label: 'Config', icon: <Wrench className="w-4 h-4" />, requiresConn: true },
    { id: 'special', label: 'Special', icon: <Zap className="w-4 h-4" />, requiresConn: true },
    { id: 'realtime', label: 'Real-Time', icon: <Activity className="w-4 h-4" />, requiresConn: true },
    { id: 'logs', label: 'Logs', icon: <Terminal className="w-4 h-4" />, requiresConn: false },
  ];

  const getModeIcon = (mode: ConnectionMode) => {
    switch (mode) {
      case 'hardware': return <Usb className="w-5 h-5" />;
      case 'simulation': return <Monitor className="w-5 h-5" />;
      case 'emulation': return <HardDrive className="w-5 h-5" />;
      case 'cloud': return <Cloud className="w-5 h-5" />;
    }
  };

  const getModeDescription = (mode: ConnectionMode) => {
    switch (mode) {
      case 'hardware': return 'Connect via USB/CAN adapter to physical ECM';
      case 'simulation': return 'Simulate ECM responses for training (No Hardware)';
      case 'emulation': return 'Full ECM emulation with virtual responses';
      case 'cloud': return 'Connect via cloud programming service';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-black/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ECM Programming System</h2>
              <p className="text-sm text-gray-400">Program, Configure, Erase Codes - Hardware Optional</p>
            </div>
          </div>

          {/* Connection Status */}
          {connection ? (
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Connected</span>
              </div>
              <div className="text-sm text-gray-400">
                {connection.ecmManufacturer} {connection.ecmModel}
              </div>
              <div className="flex items-center gap-1" title="Security Levels">
                {[1, 2, 3].map(level => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      connection.securityLevel >= level ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                    title={`Level ${level}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-700/50 border border-gray-600/30">
              <WifiOff className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-black/30 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.requiresConn && !connection}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap min-w-max
              ${activeTab === tab.id
                ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-500/10'
                : tab.requiresConn && !connection
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 min-h-[600px]">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════════════
              CONNECT TAB
          ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {!connection ? (
                <>
                  {/* Mode Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Connection Mode</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {(['simulation', 'hardware', 'emulation', 'cloud'] as ConnectionMode[]).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setConnectionMode(mode)}
                          className={`p-4 rounded-xl border transition-all ${
                            connectionMode === mode
                              ? 'border-violet-500 bg-violet-500/20 ring-2 ring-violet-500/30'
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={connectionMode === mode ? 'text-violet-400' : 'text-gray-400'}>
                              {getModeIcon(mode)}
                            </div>
                            <span className={`text-sm font-medium capitalize ${connectionMode === mode ? 'text-violet-300' : 'text-white'}`}>
                              {mode}
                            </span>
                            {mode === 'simulation' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">No Hardware</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {getModeDescription(connectionMode)}
                    </p>
                  </div>

                  {/* ECM Selection */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">ECM Manufacturer</label>
                      <select
                        value={selectedManufacturer}
                        onChange={e => {
                          setSelectedManufacturer(e.target.value);
                          setSelectedModel('');
                        }}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      >
                        <option value="">Select Manufacturer</option>
                        {manufacturers.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">ECM Model</label>
                      <select
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value)}
                        disabled={!selectedManufacturer}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                      >
                        <option value="">Select Model</option>
                        {models.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Software Info */}
                  {selectedManufacturer && (
                    <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                      <h4 className="text-sm font-medium text-violet-300 mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Software Information
                      </h4>
                      {(() => {
                        const info = getECMSoftwareInfo(selectedManufacturer);
                        if (!info) return <p className="text-gray-500">No software profile available</p>;
                        return (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="p-3 rounded-lg bg-black/30">
                              <span className="text-gray-500 block mb-1">Software</span>
                              <span className="text-white font-medium">{info.softwareName}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-black/30">
                              <span className="text-gray-500 block mb-1">Version</span>
                              <span className="text-white font-medium">{info.version}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-black/30">
                              <span className="text-gray-500 block mb-1">Capabilities</span>
                              <span className="text-white font-medium">{info.capabilities} features</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Connect Button */}
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting || !selectedManufacturer || !selectedModel}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-violet-500/25"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wifi className="w-5 h-5" />
                        Connect to ECM
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Connected View */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <span className="text-xl font-bold text-green-400">Connected</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          <p><span className="text-gray-400">Manufacturer:</span> <span className="text-white font-medium">{connection.ecmManufacturer}</span></p>
                          <p><span className="text-gray-400">Model:</span> <span className="text-white font-medium">{connection.ecmModel}</span></p>
                          <p><span className="text-gray-400">Mode:</span> <span className="text-white font-medium capitalize">{connection.mode}</span></p>
                          <p><span className="text-gray-400">Protocol:</span> <span className="text-white font-medium">{connection.protocol}</span></p>
                          <p><span className="text-gray-400">Baud Rate:</span> <span className="text-white font-medium">{connection.baudRate.toLocaleString()} bps</span></p>
                          <p><span className="text-gray-400">Security:</span> <span className="text-white font-medium">Level {connection.securityLevel}</span></p>
                        </div>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                      >
                        <WifiOff className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>
                  </div>

                  {/* Security Levels */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-violet-400" />
                      Security Access Levels
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {softwareProfile?.securityFeatures.map(sec => (
                        <div
                          key={sec.id}
                          className={`p-4 rounded-xl border transition-all ${
                            connection.securityLevel >= sec.level
                              ? 'border-green-500/50 bg-green-500/10'
                              : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-bold ${connection.securityLevel >= sec.level ? 'text-green-400' : 'text-gray-400'}`}>
                              Level {sec.level}
                            </span>
                            {connection.securityLevel >= sec.level ? (
                              <Unlock className="w-5 h-5 text-green-400" />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <p className="text-sm text-white mb-1">{sec.name}</p>
                          <p className="text-xs text-gray-500">{sec.description}</p>
                          {connection.securityLevel < sec.level && (
                            <button
                              onClick={() => handleUnlockSecurity(sec.level)}
                              className="mt-3 w-full py-2 rounded-lg bg-violet-500/20 text-violet-400 text-sm font-medium hover:bg-violet-500/30 transition-colors"
                            >
                              Unlock Level {sec.level}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capabilities Grid */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Available Capabilities
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {softwareProfile?.capabilities.map(cap => (
                        <div key={cap.id} className="p-3 rounded-lg bg-black/30 border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-white">{cap.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{cap.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              cap.requiresHardware ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                              {cap.requiresHardware ? 'Hardware' : 'No Hardware'}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">
                              Level {cap.securityLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              FAULT CODES TAB
          ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'faults' && connection && (
            <motion.div
              key="faults"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleReadFaults}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Read Fault Codes
                </button>
                <button
                  onClick={() => handleEraseFaults(false)}
                  disabled={isProcessing || connection.securityLevel < 2 || selectedFaults.size === 0}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Erase Selected ({selectedFaults.size})
                </button>
                <button
                  onClick={() => handleEraseFaults(true)}
                  disabled={isProcessing || connection.securityLevel < 2}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Erase All
                </button>
                {connection.securityLevel < 2 && (
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Level 2 required to erase
                  </span>
                )}
              </div>

              {/* Fault Codes */}
              {faultCodes.length === 0 ? (
                <div className="p-12 rounded-xl bg-white/5 border border-white/10 text-center">
                  <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">No fault codes read yet</p>
                  <p className="text-sm text-gray-500">Click "Read Fault Codes" to retrieve codes from the ECM</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {faultCodes.map((code, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        const newSelected = new Set(selectedFaults);
                        if (newSelected.has(code.code)) {
                          newSelected.delete(code.code);
                        } else {
                          newSelected.add(code.code);
                        }
                        setSelectedFaults(newSelected);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedFaults.has(code.code)
                          ? 'border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30'
                          : code.status === 'active'
                            ? 'border-red-500/30 bg-red-500/10 hover:border-red-500/50'
                            : code.status === 'pending'
                              ? 'border-amber-500/30 bg-amber-500/10 hover:border-amber-500/50'
                              : 'border-gray-500/30 bg-gray-500/10 hover:border-gray-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-bold text-lg text-white">{code.code}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                              code.status === 'active' ? 'bg-red-500/30 text-red-300' :
                              code.status === 'pending' ? 'bg-amber-500/30 text-amber-300' :
                              'bg-gray-500/30 text-gray-300'
                            }`}>
                              {code.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Occurrences:</span>
                              <span className="ml-2 text-white">{code.occurrenceCount}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">First:</span>
                              <span className="ml-2 text-white">{code.firstOccurrence.toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Last:</span>
                              <span className="ml-2 text-white">{code.lastOccurrence.toLocaleDateString()}</span>
                            </div>
                          </div>
                          {code.freezeFrameData && (
                            <div className="mt-3 p-3 rounded-lg bg-black/30">
                              <p className="text-xs text-gray-400 mb-2">Freeze Frame Data:</p>
                              <div className="grid grid-cols-4 gap-3 text-xs">
                                {Object.entries(code.freezeFrameData).map(([key, val]) => (
                                  <div key={key}>
                                    <span className="text-gray-500">{key}:</span>
                                    <span className="ml-1 text-white font-mono">{val}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedFaults.has(code.code)
                            ? 'border-violet-500 bg-violet-500'
                            : 'border-gray-500'
                        }`}>
                          {selectedFaults.has(code.code) && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              PARAMETERS TAB
          ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'parameters' && connection && (
            <motion.div
              key="parameters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReadParameters}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Read All Parameters
                </button>
              </div>

              {softwareProfile?.parameterGroups.map(group => (
                <div key={group.id} className="rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => {
                      const newExpanded = new Set(expandedGroups);
                      newExpanded.has(group.id) ? newExpanded.delete(group.id) : newExpanded.add(group.id);
                      setExpandedGroups(newExpanded);
                    }}
                    className="w-full px-4 py-3 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-violet-400" />
                      <span className="font-medium text-white">{group.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">{group.parameters.length} params</span>
                    </div>
                    {expandedGroups.has(group.id) ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </button>
                  <AnimatePresence>
                    {expandedGroups.has(group.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 grid gap-3">
                          {group.parameters.map(param => {
                            const currentValue = parameters.find(p => p.id === param.id)?.value ?? param.defaultValue;
                            return (
                              <div key={param.id} className="p-4 rounded-lg bg-black/30 border border-white/5">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span className="font-medium text-white">{param.name}</span>
                                      <span className="text-xs text-gray-500 font-mono bg-gray-800 px-1.5 py-0.5 rounded">{param.shortName}</span>
                                      {param.criticalParameter && <span title="Critical Parameter"><AlertCircle className="w-4 h-4 text-red-400" /></span>}
                                      {param.affectsEmissions && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Emissions</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{param.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span>Min: {param.minValue}</span>
                                      <span>Max: {param.maxValue}</span>
                                      <span>Default: {param.defaultValue}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      defaultValue={currentValue as number}
                                      min={param.minValue}
                                      max={param.maxValue}
                                      step={param.step}
                                      disabled={!param.editable || connection.securityLevel < 2}
                                      className="w-28 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-right font-mono focus:border-violet-500 focus:outline-none disabled:opacity-50"
                                    />
                                    <span className="text-sm text-gray-400 w-16">{param.unit}</span>
                                    {param.editable && connection.securityLevel >= 2 && (
                                      <button
                                        onClick={() => handleWriteParameter(param.id, currentValue as number)}
                                        className="px-3 py-2 rounded-lg bg-violet-500/20 text-violet-400 text-sm font-medium hover:bg-violet-500/30"
                                      >
                                        Write
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              PROGRAM TAB
          ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'program' && connection && (
            <motion.div
              key="program"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={handleCreateBackup}
                  disabled={isProcessing}
                  className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors text-left disabled:opacity-50"
                >
                  <Download className="w-10 h-10 text-blue-400 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Create Backup</h4>
                  <p className="text-sm text-gray-400">Backup ECM firmware, calibration, and parameters</p>
                </button>

                <button
                  disabled={connection.securityLevel < 3}
                  className="p-6 rounded-xl bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-10 h-10 text-violet-400 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Program Firmware</h4>
                  <p className="text-sm text-gray-400">Flash new firmware to ECM</p>
                  {connection.securityLevel < 3 && <p className="text-xs text-amber-400 mt-2">Level 3 required</p>}
                </button>

                <button
                  disabled={connection.securityLevel < 3}
                  className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileCode className="w-10 h-10 text-green-400 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">Program Calibration</h4>
                  <p className="text-sm text-gray-400">Update engine calibration data</p>
                  {connection.securityLevel < 3 && <p className="text-xs text-amber-400 mt-2">Level 3 required</p>}
                </button>
              </div>

              {/* Protocols */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Programming Protocols
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {softwareProfile?.programmingProtocols.map(proto => (
                    <div key={proto.id} className="p-4 rounded-lg bg-black/30 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{proto.name}</span>
                        <span className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 uppercase font-mono">{proto.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <p>Baud: {proto.baudRates.map(b => `${b/1000}k`).join(', ')}</p>
                        <p>Format: {proto.messageFormat}</p>
                        <p>Addressing: {proto.addressingMode}</p>
                        <p>Security: {proto.securityAccess ? 'Required' : 'None'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SPECIAL FUNCTIONS TAB
          ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'special' && connection && (
            <motion.div
              key="special"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {softwareProfile?.specialFunctions.map(func => (
                  <div key={func.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white">{func.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{func.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${
                        func.category === 'reset' ? 'bg-red-500/20 text-red-400' :
                        func.category === 'calibration' ? 'bg-blue-500/20 text-blue-400' :
                        func.category === 'test' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {func.category}
                      </span>
                    </div>

                    {func.warningMessage && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-400">{func.warningMessage}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {func.requiresEngineOff && <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">Engine OFF</span>}
                      {func.requiresEngineRunning && <span className="text-xs px-2 py-1 rounded bg-green-700 text-green-300">Engine Running</span>}
                      <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">Level {func.securityLevel}</span>
                    </div>

                    <button
                      onClick={() => handleSpecialFunction(func.id)}
                      disabled={isProcessing || connection.securityLevel < func.securityLevel}
                      className="w-full py-2.5 rounded-lg bg-violet-500/20 text-violet-400 font-medium hover:bg-violet-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4" />
                      Execute
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              REAL-TIME TAB
          ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'realtime' && connection && (
            <motion.div
              key="realtime"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'rpm', label: 'Engine RPM', icon: <Gauge className="w-5 h-5" />, unit: 'RPM', color: 'text-blue-400' },
                  { key: 'coolantTemp', label: 'Coolant Temp', icon: <Thermometer className="w-5 h-5" />, unit: '°C', color: 'text-cyan-400' },
                  { key: 'oilPressure', label: 'Oil Pressure', icon: <Droplet className="w-5 h-5" />, unit: 'kPa', color: 'text-amber-400' },
                  { key: 'boostPressure', label: 'Boost', icon: <Wind className="w-5 h-5" />, unit: 'kPa', color: 'text-green-400' },
                  { key: 'fuelPressure', label: 'Fuel Pressure', icon: <Gauge className="w-5 h-5" />, unit: 'kPa', color: 'text-red-400' },
                  { key: 'loadPercent', label: 'Load', icon: <Power className="w-5 h-5" />, unit: '%', color: 'text-violet-400' },
                  { key: 'batteryVoltage', label: 'Battery', icon: <Zap className="w-5 h-5" />, unit: 'V', color: 'text-yellow-400' },
                  { key: 'exhaustTemp', label: 'Exhaust Temp', icon: <Thermometer className="w-5 h-5" />, unit: '°C', color: 'text-orange-400' },
                ].map(item => (
                  <div key={item.key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold font-mono ${item.color}`}>
                        {realtimeData[item.key]?.toLocaleString() ?? '--'}
                      </span>
                      <span className="text-sm text-gray-500">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              LOGS TAB
          ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Activity Log ({logs.length})
                </h4>
                <button onClick={() => setLogs([])} className="text-sm text-gray-400 hover:text-white">Clear</button>
              </div>

              <div className="h-[500px] overflow-y-auto rounded-xl bg-black/50 border border-white/10 p-4 font-mono text-sm">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No log entries</p>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-gray-600 text-xs w-20 flex-shrink-0">{log.timestamp.toLocaleTimeString()}</span>
                      <span className={`text-xs uppercase w-16 flex-shrink-0 ${
                        log.level === 'error' ? 'text-red-400' :
                        log.level === 'warning' ? 'text-amber-400' :
                        log.level === 'success' ? 'text-green-400' :
                        log.level === 'debug' ? 'text-gray-500' : 'text-blue-400'
                      }`}>
                        [{log.level}]
                      </span>
                      <span className="text-gray-300">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CONFIG TAB
          ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'config' && connection && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {softwareProfile?.configurationOptions.map(opt => (
                <div key={opt.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-white">{opt.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{opt.description}</p>
                      {opt.requiresReboot && (
                        <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" />
                          Requires ECM reboot
                        </p>
                      )}
                    </div>
                    {opt.type === 'toggle' && (
                      <button className="w-14 h-7 rounded-full bg-green-500 relative p-1">
                        <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white shadow" />
                      </button>
                    )}
                    {opt.type === 'select' && (
                      <select className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white">
                        {opt.options?.map(o => (
                          <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}

              {(!softwareProfile?.configurationOptions || softwareProfile.configurationOptions.length === 0) && (
                <div className="p-12 rounded-xl bg-white/5 border border-white/10 text-center">
                  <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No configuration options available</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
