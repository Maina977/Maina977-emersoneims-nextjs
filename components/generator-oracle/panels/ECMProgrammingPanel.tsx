'use client';

/**
 * ECM PROGRAMMING PANEL
 *
 * Comprehensive ECM reprogramming interface:
 * - Firmware version tracking and updates
 * - Calibration file management
 * - Reprogramming event logging
 * - Compatibility checking
 * - Rollback capabilities
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ECM_REGISTRY,
  CONTROLLER_REGISTRY,
  checkECMControllerCompatibility,
  getFirmwareRecommendations,
  type ECMRegistryEntry
} from '@/lib/generator-oracle/unifiedMappingMatrix';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ReprogrammingEvent {
  id: string;
  timestamp: string;
  ecmId: string;
  ecmSerial: string;
  previousVersion: string;
  newVersion: string;
  technician: string;
  status: 'success' | 'failed' | 'rollback';
  notes: string;
}

interface CalibrationFile {
  id: string;
  name: string;
  version: string;
  ecmModels: string[];
  engineModels: string[];
  fileSize: string;
  checksum: string;
  uploadDate: string;
}

type ProgrammingStep = 'select' | 'verify' | 'backup' | 'program' | 'validate' | 'complete';

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA - In production, this would come from database/API
// ═══════════════════════════════════════════════════════════════════════════════

const MOCK_REPROGRAMMING_HISTORY: ReprogrammingEvent[] = [
  {
    id: 'RP-001',
    timestamp: '2026-03-01T10:30:00Z',
    ecmId: 'cummins-cm2150',
    ecmSerial: '73456789',
    previousVersion: '4.4.1',
    newVersion: '4.5.2',
    technician: 'John Maina',
    status: 'success',
    notes: 'Routine firmware update for DEF quality detection improvement'
  },
  {
    id: 'RP-002',
    timestamp: '2026-02-15T14:45:00Z',
    ecmId: 'cat-adem-a4',
    ecmSerial: 'CAT789012',
    previousVersion: '3.1.0',
    newVersion: '3.2.1',
    technician: 'James Otieno',
    status: 'success',
    notes: 'Emissions compliance update'
  },
  {
    id: 'RP-003',
    timestamp: '2026-02-01T09:15:00Z',
    ecmId: 'perkins-epm',
    ecmSerial: 'PK345678',
    previousVersion: '2.2.0',
    newVersion: '2.3.0',
    technician: 'Peter Njoroge',
    status: 'rollback',
    notes: 'Update failed, rolled back to previous version'
  }
];

const MOCK_CALIBRATION_FILES: CalibrationFile[] = [
  {
    id: 'CAL-001',
    name: 'QSK23_G5_500kVA_50Hz',
    version: '4.5.2',
    ecmModels: ['CM2150', 'CM2350'],
    engineModels: ['QSK23-G5'],
    fileSize: '2.4 MB',
    checksum: 'A3B4C5D6E7F8',
    uploadDate: '2026-01-15'
  },
  {
    id: 'CAL-002',
    name: 'C18_ACERT_600kVA_60Hz',
    version: '3.2.1',
    ecmModels: ['ADEM A4'],
    engineModels: ['C18 ACERT'],
    fileSize: '3.1 MB',
    checksum: 'F8E7D6C5B4A3',
    uploadDate: '2026-01-20'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ECMProgrammingPanel() {
  // State
  const [activeTab, setActiveTab] = useState<'program' | 'history' | 'calibration' | 'compatibility'>('program');
  const [selectedECM, setSelectedECM] = useState<ECMRegistryEntry | null>(null);
  const [selectedController, setSelectedController] = useState<string>('');
  const [ecmSerial, setEcmSerial] = useState('');
  const [currentFirmware, setCurrentFirmware] = useState('');
  const [targetFirmware, setTargetFirmware] = useState('');
  const [programmingStep, setProgrammingStep] = useState<ProgrammingStep>('select');
  const [programmingProgress, setProgrammingProgress] = useState(0);

  // Derived data
  const ecmManufacturers = useMemo(() =>
    [...new Set(ECM_REGISTRY.map(e => e.manufacturer))],
    []
  );

  const compatibility = useMemo(() => {
    if (!selectedECM || !selectedController) return null;
    return checkECMControllerCompatibility(selectedECM.id, selectedController);
  }, [selectedECM, selectedController]);

  const firmwareRecommendation = useMemo(() => {
    if (!selectedECM || !currentFirmware || !selectedController) return null;
    return getFirmwareRecommendations(selectedECM.id, currentFirmware, selectedController);
  }, [selectedECM, currentFirmware, selectedController]);

  // Simulate programming process
  const startProgramming = useCallback(() => {
    setProgrammingStep('verify');
    setProgrammingProgress(0);

    const steps: { step: ProgrammingStep; delay: number; progress: number }[] = [
      { step: 'verify', delay: 2000, progress: 20 },
      { step: 'backup', delay: 3000, progress: 40 },
      { step: 'program', delay: 5000, progress: 80 },
      { step: 'validate', delay: 2000, progress: 95 },
      { step: 'complete', delay: 1000, progress: 100 }
    ];

    let currentIndex = 0;
    const runStep = () => {
      if (currentIndex < steps.length) {
        const { step, delay, progress } = steps[currentIndex];
        setProgrammingStep(step);
        setProgrammingProgress(progress);
        currentIndex++;
        setTimeout(runStep, delay);
      }
    };
    runStep();
  }, []);

  const resetProgramming = useCallback(() => {
    setProgrammingStep('select');
    setProgrammingProgress(0);
    setTargetFirmware('');
  }, []);

  // Render Programming Tab
  const renderProgrammingTab = () => (
    <div className="space-y-6">
      {/* ECM Selection */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-amber-400 mb-4">ECM Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">ECM Manufacturer</label>
            <select
              value={selectedECM?.manufacturer || ''}
              onChange={(e) => {
                const ecm = ECM_REGISTRY.find(ecm => ecm.manufacturer === e.target.value);
                setSelectedECM(ecm || null);
              }}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="">Select Manufacturer</option>
              {ecmManufacturers.map(mfr => (
                <option key={mfr} value={mfr}>{mfr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">ECM Model</label>
            <select
              value={selectedECM?.id || ''}
              onChange={(e) => {
                const ecm = ECM_REGISTRY.find(ecm => ecm.id === e.target.value);
                setSelectedECM(ecm || null);
              }}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
              disabled={!selectedECM?.manufacturer}
            >
              <option value="">Select Model</option>
              {ECM_REGISTRY.filter(e => e.manufacturer === selectedECM?.manufacturer).map(ecm => (
                <option key={ecm.id} value={ecm.id}>{ecm.model}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">ECM Serial Number</label>
            <input
              type="text"
              value={ecmSerial}
              onChange={(e) => setEcmSerial(e.target.value.toUpperCase())}
              placeholder="Enter serial number"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Firmware Version</label>
            <select
              value={currentFirmware}
              onChange={(e) => setCurrentFirmware(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
              disabled={!selectedECM}
            >
              <option value="">Select Current Version</option>
              {selectedECM?.firmwareVersions.map(fw => (
                <option key={fw.version} value={fw.version}>
                  {fw.version} {fw.isLatest && '(Latest)'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Controller Selection for Compatibility Check */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Controller Compatibility</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Controller</label>
            <select
              value={selectedController}
              onChange={(e) => setSelectedController(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="">Select Controller</option>
              {CONTROLLER_REGISTRY.map(ctrl => (
                <option key={ctrl.id} value={ctrl.id}>
                  {ctrl.brand} {ctrl.model}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            {compatibility && (
              <div className={`px-4 py-2 rounded-lg w-full text-center ${
                compatibility.compatible
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {compatibility.compatible ? '✓ Compatible' : '✗ Incompatible'}
                <p className="text-xs mt-1">{compatibility.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Firmware Update Section */}
      {selectedECM && currentFirmware && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Firmware Update</h3>

          {firmwareRecommendation && (
            <div className={`mb-4 p-3 rounded-lg ${
              firmwareRecommendation.needsUpdate
                ? 'bg-amber-500/20 border border-amber-500/30'
                : 'bg-green-500/20 border border-green-500/30'
            }`}>
              {firmwareRecommendation.needsUpdate ? (
                <>
                  <p className="text-amber-400 font-medium">Update Available</p>
                  <p className="text-sm text-gray-400">
                    Current: {firmwareRecommendation.currentVersion} →
                    Recommended: {firmwareRecommendation.recommendedVersion}
                  </p>
                </>
              ) : (
                <p className="text-green-400">Firmware is up to date</p>
              )}
              {firmwareRecommendation.compatibilityIssues.length > 0 && (
                <ul className="mt-2 text-sm text-amber-400">
                  {firmwareRecommendation.compatibilityIssues.map((issue, i) => (
                    <li key={i}>⚠ {issue}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Target Firmware Version</label>
              <select
                value={targetFirmware}
                onChange={(e) => setTargetFirmware(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                disabled={programmingStep !== 'select'}
              >
                <option value="">Select Target Version</option>
                {selectedECM.firmwareVersions
                  .filter(fw => fw.version !== currentFirmware)
                  .map(fw => (
                    <option key={fw.version} value={fw.version}>
                      {fw.version} - {fw.releaseDate} {fw.isLatest && '(Latest)'}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Programming Progress */}
          {programmingStep !== 'select' && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Programming Progress</span>
                <span className="text-amber-400">{programmingProgress}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${programmingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {(['verify', 'backup', 'program', 'validate', 'complete'] as ProgrammingStep[]).map((step) => (
                  <div
                    key={step}
                    className={`py-2 px-1 rounded ${
                      step === programmingStep
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : programmingStep === 'complete' ||
                          (['verify', 'backup', 'program', 'validate', 'complete'].indexOf(step) <
                           ['verify', 'backup', 'program', 'validate', 'complete'].indexOf(programmingStep))
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </div>
                ))}
              </div>

              {programmingStep === 'complete' && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 font-semibold text-lg">Programming Complete!</p>
                  <p className="text-gray-400 text-sm mt-1">
                    ECM {ecmSerial} updated from {currentFirmware} to {targetFirmware}
                  </p>
                  <button
                    onClick={resetProgramming}
                    className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                  >
                    Start New Programming
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Start Button */}
          {programmingStep === 'select' && targetFirmware && (
            <button
              onClick={startProgramming}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all"
            >
              Start Firmware Programming
            </button>
          )}
        </div>
      )}

      {/* Selected ECM Info */}
      {selectedECM && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">ECM Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Pin Configuration</p>
              <p className="text-white">{selectedECM.pinConfiguration}</p>
            </div>
            <div>
              <p className="text-gray-500">CAN Baud Rate</p>
              <p className="text-white">{selectedECM.canBaudRate.toLocaleString()} bps</p>
            </div>
            <div>
              <p className="text-gray-500">J1939 Address</p>
              <p className="text-white">{selectedECM.j1939Address}</p>
            </div>
            <div>
              <p className="text-gray-500">Reprogrammable</p>
              <p className="text-white">{selectedECM.reprogrammingCapability ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm mb-2">Diagnostic Software</p>
            <div className="flex flex-wrap gap-2">
              {selectedECM.diagnosticSoftware.map(sw => (
                <span key={sw} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                  {sw}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm mb-2">Supported Engines</p>
            <div className="flex flex-wrap gap-2">
              {selectedECM.supportedEngines.map(eng => (
                <span key={eng} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                  {eng}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render History Tab
  const renderHistoryTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Reprogramming History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-3 px-2">Date</th>
              <th className="text-left py-3 px-2">ECM</th>
              <th className="text-left py-3 px-2">Serial</th>
              <th className="text-left py-3 px-2">Version Change</th>
              <th className="text-left py-3 px-2">Technician</th>
              <th className="text-left py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REPROGRAMMING_HISTORY.map(event => (
              <tr key={event.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-2 text-gray-300">
                  {new Date(event.timestamp).toLocaleDateString()}
                </td>
                <td className="py-3 px-2 text-white">
                  {ECM_REGISTRY.find(e => e.id === event.ecmId)?.model || event.ecmId}
                </td>
                <td className="py-3 px-2 text-gray-400 font-mono">{event.ecmSerial}</td>
                <td className="py-3 px-2">
                  <span className="text-gray-400">{event.previousVersion}</span>
                  <span className="text-gray-500 mx-2">→</span>
                  <span className="text-green-400">{event.newVersion}</span>
                </td>
                <td className="py-3 px-2 text-gray-300">{event.technician}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.status === 'success' ? 'bg-green-500/20 text-green-400' :
                    event.status === 'rollback' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Calibration Tab
  const renderCalibrationTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-amber-400">Calibration Files</h3>
        <button className="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors">
          Upload New File
        </button>
      </div>
      <div className="grid gap-4">
        {MOCK_CALIBRATION_FILES.map(file => (
          <div key={file.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-medium">{file.name}</h4>
                <p className="text-gray-400 text-sm">Version {file.version}</p>
              </div>
              <span className="text-gray-500 text-sm">{file.fileSize}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {file.ecmModels.map(model => (
                <span key={model} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                  {model}
                </span>
              ))}
              {file.engineModels.map(model => (
                <span key={model} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                  {model}
                </span>
              ))}
            </div>
            <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
              <span>Checksum: {file.checksum}</span>
              <span>Uploaded: {file.uploadDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Compatibility Tab
  const renderCompatibilityTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">ECM-Controller Compatibility Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-3 px-2">ECM</th>
              {CONTROLLER_REGISTRY.slice(0, 5).map(ctrl => (
                <th key={ctrl.id} className="text-center py-3 px-2">
                  {ctrl.brand} {ctrl.model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ECM_REGISTRY.map(ecm => (
              <tr key={ecm.id} className="border-b border-gray-800">
                <td className="py-3 px-2 text-white">
                  {ecm.manufacturer} {ecm.model}
                </td>
                {CONTROLLER_REGISTRY.slice(0, 5).map(ctrl => {
                  const compat = checkECMControllerCompatibility(ecm.id, ctrl.id);
                  return (
                    <td key={ctrl.id} className="py-3 px-2 text-center">
                      {compat.compatible ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">ECM Programming Center</h2>
          <p className="text-gray-400 text-sm">Firmware updates, calibration, and reprogramming</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
        {[
          { id: 'program', label: 'Program ECM', icon: '🔧' },
          { id: 'history', label: 'History', icon: '📋' },
          { id: 'calibration', label: 'Calibration', icon: '📁' },
          { id: 'compatibility', label: 'Compatibility', icon: '🔗' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'program' && renderProgrammingTab()}
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'calibration' && renderCalibrationTab()}
          {activeTab === 'compatibility' && renderCompatibilityTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
