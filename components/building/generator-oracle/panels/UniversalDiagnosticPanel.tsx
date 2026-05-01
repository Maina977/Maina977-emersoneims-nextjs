'use client';

/**
 * UNIVERSAL DIAGNOSTIC INTERFACE PANEL
 *
 * The complete Generator Oracle diagnostic and programming interface.
 * Replaces the need for CAT ET, Cummins INSITE, Volvo VODIA, and all other
 * proprietary OEM diagnostic tools.
 *
 * ONE TOOL FOR ALL GENERATORS
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GOUDI_ADAPTER,
  ADAPTER_CABLES,
  ECM_DATABASE,
  SECURITY_LEVELS,
  autoDetectECM,
  getECMByModel,
  getAdapterCableForECM,
  getAllSupportedManufacturers,
  type ECMDatabase,
  type ECMInfo,
  type DetectionResult,
  type ProgrammingSession,
  type AdapterCable,
  type FaultCode,
  type ParameterData,
} from '@/lib/generator-oracle/universalDiagnosticInterface';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function GlassCard({ children, className = '', glow = false }: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative backdrop-blur-xl rounded-2xl border overflow-hidden ${
        glow ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/20' : 'border-slate-700/50 shadow-lg shadow-black/20'
      } ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
      }}
    >
      {children}
    </motion.div>
  );
}

function StatusIndicator({ status, label }: {
  status: 'connected' | 'disconnected' | 'detecting' | 'error';
  label: string
}) {
  const colors = {
    connected: 'bg-green-500',
    disconnected: 'bg-slate-500',
    detecting: 'bg-amber-500',
    error: 'bg-red-500'
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-3 h-3 rounded-full ${colors[status]}`}
        animate={status === 'detecting' ? { opacity: [1, 0.3, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ boxShadow: status === 'connected' ? '0 0 10px rgba(34, 197, 94, 0.5)' : undefined }}
      />
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  );
}

function ProgressBar({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children, icon }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
        active
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
          : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
      }`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function UniversalDiagnosticPanel({ className = '' }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<'connect' | 'parameters' | 'faults' | 'program' | 'database'>('connect');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'detecting' | 'connected' | 'error'>('disconnected');
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [selectedECM, setSelectedECM] = useState<ECMDatabase | null>(null);
  const [securityLevel, setSecurityLevel] = useState(0);
  const [parameters, setParameters] = useState<ParameterData[]>([]);
  const [faultCodes, setFaultCodes] = useState<FaultCode[]>([]);
  const [programmingSession, setProgrammingSession] = useState<ProgrammingSession | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);

  const manufacturers = getAllSupportedManufacturers();

  // Simulate auto-detection
  const handleConnect = useCallback(async () => {
    setConnectionStatus('detecting');

    // Simulate detection delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const result = await autoDetectECM();
      setDetectionResult(result);

      if (result.detected && result.ecmInfo) {
        setConnectionStatus('connected');
        const ecm = getECMByModel(result.ecmInfo.model);
        if (ecm) {
          setSelectedECM(ecm);
          // Simulate loading parameters
          setParameters(ecm.parameterList.map(p => ({
            spn: p.spn,
            name: p.name,
            value: Math.random() * (p.max - p.min) + p.min,
            unit: p.unit,
            rawValue: 0,
            status: 'valid'
          })));
          // Simulate loading fault codes
          setFaultCodes([
            {
              spn: 100,
              fmi: 1,
              occurrenceCount: 3,
              lampStatus: 'amber',
              description: 'Engine Oil Pressure Low - Warning',
              active: true,
              lastOccurrence: new Date()
            }
          ]);
        }
      } else {
        setConnectionStatus('error');
      }
    } catch {
      setConnectionStatus('error');
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnectionStatus('disconnected');
    setDetectionResult(null);
    setSelectedECM(null);
    setParameters([]);
    setFaultCodes([]);
  }, []);

  const handleClearFaults = useCallback(() => {
    setFaultCodes([]);
  }, []);

  // Render connection tab
  const renderConnectionTab = () => (
    <div className="space-y-6">
      {/* Hardware Adapter Info */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-3xl">🔌</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{GOUDI_ADAPTER.name}</h3>
              <p className="text-sm text-slate-400">Version {GOUDI_ADAPTER.version}</p>
            </div>
          </div>
          <StatusIndicator
            status={connectionStatus}
            label={
              connectionStatus === 'connected' ? 'Connected' :
              connectionStatus === 'detecting' ? 'Detecting ECM...' :
              connectionStatus === 'error' ? 'Error' : 'Disconnected'
            }
          />
        </div>

        {/* Supported Protocols */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-400 mb-2">Supported Protocols</h4>
          <div className="flex flex-wrap gap-2">
            {GOUDI_ADAPTER.protocols.map(protocol => (
              <span key={protocol.name} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-cyan-400 border border-cyan-500/30">
                {protocol.name}
              </span>
            ))}
          </div>
        </div>

        {/* Communication Interfaces */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-400 mb-2">Communication</h4>
          <div className="flex flex-wrap gap-2">
            {GOUDI_ADAPTER.communication.interfaces.map(iface => (
              <span key={iface} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-green-400 border border-green-500/30">
                {iface}
              </span>
            ))}
          </div>
        </div>

        {/* Connect/Disconnect Button */}
        <div className="flex gap-3">
          {connectionStatus === 'disconnected' || connectionStatus === 'error' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnect}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <span>🔍</span> Auto-Detect ECM
            </motion.button>
          ) : connectionStatus === 'detecting' ? (
            <button disabled className="flex-1 py-3 bg-slate-700 text-slate-400 font-medium rounded-xl flex items-center justify-center gap-2">
              <motion.div
                className="w-5 h-5 border-2 border-slate-500 border-t-cyan-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Detecting...
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDisconnect}
              className="flex-1 py-3 bg-red-500/20 border border-red-500/50 text-red-400 font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <span>⏏️</span> Disconnect
            </motion.button>
          )}
        </div>
      </GlassCard>

      {/* Connected ECM Info */}
      {connectionStatus === 'connected' && detectionResult?.ecmInfo && (
        <GlassCard className="p-6" glow>
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <span>✅</span> ECM Detected
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Manufacturer', value: detectionResult.ecmInfo.manufacturer },
              { label: 'Model', value: detectionResult.ecmInfo.model },
              { label: 'Serial Number', value: detectionResult.ecmInfo.serialNumber },
              { label: 'Firmware', value: detectionResult.ecmInfo.firmwareVersion },
              { label: 'Hardware Rev', value: detectionResult.ecmInfo.hardwareVersion },
              { label: 'Calibration', value: detectionResult.ecmInfo.calibrationId },
              { label: 'Engine Type', value: detectionResult.ecmInfo.engineType },
              { label: 'Production Date', value: detectionResult.ecmInfo.productionDate },
              { label: 'Total Hours', value: detectionResult.ecmInfo.totalHours.toLocaleString() },
            ].map(item => (
              <div key={item.label} className="p-3 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="text-sm text-white font-medium">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span>📡</span>
              <span>Protocol: {detectionResult.protocol} | Adapter: {ADAPTER_CABLES.find(c => c.id === detectionResult.adapterCable)?.name}</span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Adapter Cable Selection (when not connected) */}
      {connectionStatus === 'disconnected' && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Available Adapter Cables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ADAPTER_CABLES.map(cable => (
              <div key={cable.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🔗</span>
                  <div>
                    <h4 className="text-white font-medium text-sm">{cable.name}</h4>
                    <p className="text-xs text-slate-500">{cable.oem}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {cable.compatibleModels.slice(0, 3).join(', ')}
                  {cable.compatibleModels.length > 3 && ` +${cable.compatibleModels.length - 3} more`}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {cable.protocols.map(p => (
                    <span key={p} className="px-2 py-0.5 bg-slate-700 rounded text-[10px] text-slate-400">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );

  // Render parameters tab
  const renderParametersTab = () => (
    <div className="space-y-6">
      {connectionStatus !== 'connected' ? (
        <GlassCard className="p-8 text-center">
          <span className="text-4xl mb-4 block">🔌</span>
          <h3 className="text-lg font-bold text-white mb-2">Not Connected</h3>
          <p className="text-slate-400">Connect to an ECM to view parameters</p>
        </GlassCard>
      ) : (
        <>
          {/* Security Level */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔐</span>
                <div>
                  <h4 className="text-white font-medium">Security Level: {SECURITY_LEVELS[securityLevel].name}</h4>
                  <p className="text-xs text-slate-500">{SECURITY_LEVELS[securityLevel].description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {SECURITY_LEVELS.map((level, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSecurityLevel(idx)}
                    className={`w-8 h-8 rounded-lg font-bold text-sm ${
                      securityLevel === idx
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-slate-800 text-slate-500 hover:text-white'
                    }`}
                  >
                    {idx}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Parameters Grid */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📊</span> Live Parameters
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {parameters.map(param => (
                <div key={param.spn} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-1">SPN {param.spn}</div>
                  <div className="text-sm text-slate-300 mb-2">{param.name}</div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {param.value.toFixed(1)}
                    <span className="text-sm text-slate-500 ml-1">{param.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Parameter Editor */}
          {securityLevel >= 2 && selectedECM && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                <span>⚙️</span> Parameter Editor (Level 2+ Required)
              </h3>
              <div className="space-y-3">
                {selectedECM.parameterList.filter(p => !p.readOnly).map(param => (
                  <div key={param.spn} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex-1">
                      <div className="text-white font-medium">{param.name}</div>
                      <div className="text-xs text-slate-500">{param.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={param.defaultValue}
                        min={param.min}
                        max={param.max}
                        step={param.resolution}
                        className="w-24 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-right"
                      />
                      <span className="text-slate-500 text-sm w-12">{param.unit}</span>
                      <button className="px-3 py-2 bg-amber-500/20 border border-amber-500/50 text-amber-400 rounded-lg text-sm hover:bg-amber-500/30">
                        Write
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );

  // Render faults tab
  const renderFaultsTab = () => (
    <div className="space-y-6">
      {connectionStatus !== 'connected' ? (
        <GlassCard className="p-8 text-center">
          <span className="text-4xl mb-4 block">🔌</span>
          <h3 className="text-lg font-bold text-white mb-2">Not Connected</h3>
          <p className="text-slate-400">Connect to an ECM to view fault codes</p>
        </GlassCard>
      ) : (
        <>
          {/* Fault Summary */}
          <div className="grid grid-cols-4 gap-4">
            <GlassCard className="p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{faultCodes.filter(f => f.active).length}</div>
              <div className="text-xs text-slate-500">Active Faults</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{faultCodes.filter(f => f.lampStatus === 'amber').length}</div>
              <div className="text-xs text-slate-500">Warnings</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-3xl font-bold text-red-500">{faultCodes.filter(f => f.lampStatus === 'red').length}</div>
              <div className="text-xs text-slate-500">Shutdown</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-3xl font-bold text-slate-400">{faultCodes.length}</div>
              <div className="text-xs text-slate-500">Total Stored</div>
            </GlassCard>
          </div>

          {/* Fault List */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>⚠️</span> Fault Codes
              </h3>
              <button
                onClick={handleClearFaults}
                className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm hover:bg-red-500/30 flex items-center gap-2"
              >
                <span>🗑️</span> Clear All
              </button>
            </div>

            {faultCodes.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <span className="text-4xl mb-2 block">✅</span>
                No fault codes stored
              </div>
            ) : (
              <div className="space-y-3">
                {faultCodes.map((fault, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${
                    fault.active
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-slate-800/50 border-slate-700/50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          fault.lampStatus === 'red' ? 'bg-red-500/20 text-red-400' :
                          fault.lampStatus === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          SPN {fault.spn} / FMI {fault.fmi}
                        </span>
                        {fault.active && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {fault.occurrenceCount} occurrences
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{fault.description}</p>
                    {fault.lastOccurrence && (
                      <p className="text-xs text-slate-500">
                        Last: {fault.lastOccurrence.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );

  // Render programming tab
  const renderProgrammingTab = () => (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
          <span>💾</span> ECM Programming Center
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Firmware Update */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📦</span>
              <div>
                <h4 className="text-white font-medium">Firmware Update</h4>
                <p className="text-xs text-slate-500">Upload new ECM firmware</p>
              </div>
            </div>
            <button
              disabled={connectionStatus !== 'connected' || securityLevel < 3}
              className="w-full py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select Firmware File
            </button>
          </div>

          {/* Calibration Upload */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📐</span>
              <div>
                <h4 className="text-white font-medium">Calibration Update</h4>
                <p className="text-xs text-slate-500">Upload engine calibration</p>
              </div>
            </div>
            <button
              disabled={connectionStatus !== 'connected' || securityLevel < 3}
              className="w-full py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select Calibration File
            </button>
          </div>

          {/* Factory Reset */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="text-white font-medium">Factory Reset</h4>
                <p className="text-xs text-slate-500">Reset ECM to defaults</p>
              </div>
            </div>
            <button
              disabled={connectionStatus !== 'connected' || securityLevel < 3}
              className="w-full py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset to Factory
            </button>
          </div>

          {/* Export Data */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💾</span>
              <div>
                <h4 className="text-white font-medium">Export ECM Data</h4>
                <p className="text-xs text-slate-500">Backup configuration</p>
              </div>
            </div>
            <button
              disabled={connectionStatus !== 'connected'}
              className="w-full py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export Configuration
            </button>
          </div>
        </div>

        {securityLevel < 3 && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
            ⚠️ Security Level 3 (Master) required for firmware and calibration operations
          </div>
        )}
      </GlassCard>

      {/* Available Firmware Versions */}
      {selectedECM && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Available Firmware for {selectedECM.model}</h3>
          <div className="space-y-3">
            {selectedECM.firmwareVersions.map((fw, idx) => (
              <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-bold">
                      v{fw.version}
                    </span>
                    <span className="text-slate-400 text-sm">{fw.releaseDate}</span>
                  </div>
                  <span className="text-xs text-slate-500">{(fw.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
                <div className="text-sm text-slate-300 mb-2">{fw.releaseNotes.join(', ')}</div>
                <div className="flex flex-wrap gap-1">
                  {fw.compatibility.map(c => (
                    <span key={c} className="px-2 py-0.5 bg-slate-700 rounded text-[10px] text-slate-400">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );

  // Render database tab
  const renderDatabaseTab = () => (
    <div className="space-y-6">
      {/* Manufacturer Filter */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-400">Filter by manufacturer:</span>
          <button
            onClick={() => setSelectedManufacturer(null)}
            className={`px-3 py-1 rounded-lg text-sm ${
              !selectedManufacturer ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-slate-800 text-slate-400'
            }`}
          >
            All
          </button>
          {manufacturers.map(mfr => (
            <button
              key={mfr}
              onClick={() => setSelectedManufacturer(mfr)}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedManufacturer === mfr ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {mfr}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* ECM Database */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ECM_DATABASE
          .filter(ecm => !selectedManufacturer || ecm.manufacturer === selectedManufacturer)
          .map(ecm => (
            <GlassCard key={ecm.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-2xl">
                  🔧
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold">{ecm.manufacturer} {ecm.model}</h4>
                  <p className="text-xs text-slate-500 mb-2">{ecm.engineModels.slice(0, 4).join(', ')}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ecm.protocols.map(p => (
                      <span key={p} className="px-2 py-0.5 bg-slate-700 rounded text-[10px] text-cyan-400">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500">
                    {ecm.firmwareVersions.length} firmware versions | {ecm.calibrationFiles.length} calibrations
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          animate={{
            boxShadow: ['0 0 20px rgba(168,85,247,0.5)', '0 0 40px rgba(236,72,153,0.5)', '0 0 20px rgba(168,85,247,0.5)'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-3xl">🔧</span>
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Universal Diagnostic Interface
          </h2>
          <p className="text-slate-400">One tool for ALL generator ECMs - Replaces CAT ET, INSITE, VODIA, and more</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 flex-wrap">
        <TabButton active={activeTab === 'connect'} onClick={() => setActiveTab('connect')} icon="🔌">
          Connection
        </TabButton>
        <TabButton active={activeTab === 'parameters'} onClick={() => setActiveTab('parameters')} icon="📊">
          Parameters
        </TabButton>
        <TabButton active={activeTab === 'faults'} onClick={() => setActiveTab('faults')} icon="⚠️">
          Fault Codes
        </TabButton>
        <TabButton active={activeTab === 'program'} onClick={() => setActiveTab('program')} icon="💾">
          Programming
        </TabButton>
        <TabButton active={activeTab === 'database'} onClick={() => setActiveTab('database')} icon="📚">
          ECM Database
        </TabButton>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'connect' && renderConnectionTab()}
          {activeTab === 'parameters' && renderParametersTab()}
          {activeTab === 'faults' && renderFaultsTab()}
          {activeTab === 'program' && renderProgrammingTab()}
          {activeTab === 'database' && renderDatabaseTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
