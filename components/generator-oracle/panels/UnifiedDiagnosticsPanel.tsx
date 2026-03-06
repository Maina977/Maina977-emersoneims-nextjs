'use client';

/**
 * UNIFIED DIAGNOSTICS PANEL
 *
 * The central diagnostic interface that integrates:
 * - ECM Selection & Information
 * - Controller Selection
 * - Fault Code Input & Lookup
 * - Symptom Description
 * - Live Readings Input
 * - AI-Powered Analysis
 * - Comprehensive Solution Display
 *
 * One seamless flow: Input → Diagnosis → Solution
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  performIntegratedDiagnosis,
  getECMManufacturers,
  getControllerBrands,
  getECMsByManufacturer,
  searchECMs,
  ECM_DATABASE,
  CONTROLLER_DATABASE,
  type TechnicianInput,
  type IntegratedDiagnosisResult,
  type ECMEntry
} from '@/lib/generator-oracle/integratedDiagnosticService';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface UnifiedDiagnosticsPanelProps {
  className?: string;
}

type DiagnosticStep = 'input' | 'analyzing' | 'results';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function UnifiedDiagnosticsPanel({ className = '' }: UnifiedDiagnosticsPanelProps) {
  // Step state
  const [currentStep, setCurrentStep] = useState<DiagnosticStep>('input');

  // Input state
  const [faultCodeInput, setFaultCodeInput] = useState('');
  const [faultCodes, setFaultCodes] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState('');
  const [ecmManufacturer, setEcmManufacturer] = useState('');
  const [ecmModel, setEcmModel] = useState('');
  const [controllerBrand, setControllerBrand] = useState('');
  const [controllerModel, setControllerModel] = useState('');
  const [engineBrand, setEngineBrand] = useState('');
  const [engineModel, setEngineModel] = useState('');
  const [generatorKva, setGeneratorKva] = useState<number | undefined>();
  const [engineHours, setEngineHours] = useState<number | undefined>();

  // Live readings state (optional)
  const [showReadings, setShowReadings] = useState(false);
  const [rpm, setRpm] = useState<number | undefined>();
  const [oilPressure, setOilPressure] = useState<number | undefined>();
  const [coolantTemp, setCoolantTemp] = useState<number | undefined>();
  const [batteryVoltage, setBatteryVoltage] = useState<number | undefined>();
  const [frequency, setFrequency] = useState<number | undefined>();
  const [loadPercent, setLoadPercent] = useState<number | undefined>();

  // Results state
  const [results, setResults] = useState<IntegratedDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived data
  const ecmManufacturers = useMemo(() => getECMManufacturers(), []);
  const controllerBrands = useMemo(() => getControllerBrands(), []);
  const availableECMs = useMemo(() =>
    ecmManufacturer ? getECMsByManufacturer(ecmManufacturer) : ECM_DATABASE,
    [ecmManufacturer]
  );

  // Selected ECM details
  const selectedECM = useMemo(() => {
    if (!ecmModel) return null;
    return ECM_DATABASE.find(e =>
      e.id === ecmModel || e.name.toLowerCase().includes(ecmModel.toLowerCase())
    );
  }, [ecmModel]);

  // Add fault code
  const addFaultCode = useCallback(() => {
    const code = faultCodeInput.trim().toUpperCase();
    if (code && !faultCodes.includes(code)) {
      setFaultCodes([...faultCodes, code]);
      setFaultCodeInput('');
    }
  }, [faultCodeInput, faultCodes]);

  // Remove fault code
  const removeFaultCode = useCallback((code: string) => {
    setFaultCodes(faultCodes.filter(c => c !== code));
  }, [faultCodes]);

  // Handle key press in fault code input
  const handleFaultCodeKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFaultCode();
    }
  }, [addFaultCode]);

  // Run diagnosis
  const runDiagnosis = useCallback(async () => {
    setCurrentStep('analyzing');
    setError(null);

    try {
      const input: TechnicianInput = {
        faultCodes: faultCodes.length > 0 ? faultCodes : undefined,
        symptoms: symptoms || undefined,
        ecmManufacturer: ecmManufacturer || undefined,
        ecmModel: ecmModel || undefined,
        controllerBrand: controllerBrand || undefined,
        controllerModel: controllerModel || undefined,
        engineBrand: engineBrand || undefined,
        engineModel: engineModel || undefined,
        generatorKva,
        engineHours,
        readings: showReadings ? {
          rpm,
          oilPressure,
          coolantTemp,
          batteryVoltage,
          frequency,
          loadPercent
        } : undefined
      };

      const result = await performIntegratedDiagnosis(input);
      setResults(result);
      setCurrentStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Diagnosis failed');
      setCurrentStep('input');
    }
  }, [
    faultCodes, symptoms, ecmManufacturer, ecmModel,
    controllerBrand, controllerModel, engineBrand, engineModel,
    generatorKva, engineHours, showReadings,
    rpm, oilPressure, coolantTemp, batteryVoltage, frequency, loadPercent
  ]);

  // Reset and start new diagnosis
  const resetDiagnosis = useCallback(() => {
    setCurrentStep('input');
    setResults(null);
    setFaultCodes([]);
    setSymptoms('');
    setError(null);
  }, []);

  // Render input form
  const renderInputForm = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Unified Generator Diagnostics
        </h2>
        <p className="text-gray-400">
          Enter fault codes, symptoms, or equipment info for comprehensive diagnosis
        </p>
      </div>

      {/* Fault Codes Section */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center text-sm">1</span>
          Fault Codes
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={faultCodeInput}
            onChange={(e) => setFaultCodeInput(e.target.value.toUpperCase())}
            onKeyPress={handleFaultCodeKeyPress}
            placeholder="Enter fault code (e.g., P0335, SPN-629, E151)"
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
          <button
            onClick={addFaultCode}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
        {faultCodes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {faultCodes.map(code => (
              <span
                key={code}
                className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm flex items-center gap-2"
              >
                {code}
                <button
                  onClick={() => removeFaultCode(code)}
                  className="hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Symptoms Section */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-sm">2</span>
          Symptoms / Problem Description
        </h3>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe the problem (e.g., 'Engine cranks but won't start, black smoke on startup, intermittent power loss under load')"
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
          rows={3}
        />
      </div>

      {/* Equipment Selection */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-sm">3</span>
          Equipment Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ECM Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">ECM Manufacturer</label>
            <select
              value={ecmManufacturer}
              onChange={(e) => {
                setEcmManufacturer(e.target.value);
                setEcmModel('');
              }}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
            >
              <option value="">Select ECM Manufacturer</option>
              {ecmManufacturers.map(mfr => (
                <option key={mfr} value={mfr}>{mfr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">ECM Model</label>
            <select
              value={ecmModel}
              onChange={(e) => setEcmModel(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
              disabled={!ecmManufacturer}
            >
              <option value="">Select ECM Model</option>
              {availableECMs.map(ecm => (
                <option key={ecm.id} value={ecm.id}>{ecm.name}</option>
              ))}
            </select>
          </div>

          {/* Controller Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Controller Brand</label>
            <select
              value={controllerBrand}
              onChange={(e) => setControllerBrand(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
            >
              <option value="">Select Controller Brand</option>
              {controllerBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Controller Model</label>
            <input
              type="text"
              value={controllerModel}
              onChange={(e) => setControllerModel(e.target.value)}
              placeholder="e.g., DSE 7320, InteliGen NTC"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Engine Info */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Engine Brand</label>
            <input
              type="text"
              value={engineBrand}
              onChange={(e) => setEngineBrand(e.target.value)}
              placeholder="e.g., Cummins, Perkins, CAT"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Engine Model</label>
            <input
              type="text"
              value={engineModel}
              onChange={(e) => setEngineModel(e.target.value)}
              placeholder="e.g., QSX15, 1306D-E87TAG"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Generator Specs */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Generator Size (kVA)</label>
            <input
              type="number"
              value={generatorKva || ''}
              onChange={(e) => setGeneratorKva(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g., 500"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Engine Hours</label>
            <input
              type="number"
              value={engineHours || ''}
              onChange={(e) => setEngineHours(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="e.g., 15000"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Selected ECM Quick Info */}
      {selectedECM && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
        >
          <h4 className="text-green-400 font-semibold mb-2">Selected ECM: {selectedECM.name}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {Object.entries(selectedECM.specifications).slice(0, 4).map(([key, value]) => (
              <div key={key} className="text-gray-400">
                <span className="text-gray-500">{key}:</span> {value}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            <span className="text-gray-500">Compatible Engines:</span>{' '}
            {selectedECM.compatibleEngines.slice(0, 5).join(', ')}
            {selectedECM.compatibleEngines.length > 5 && '...'}
          </div>
        </motion.div>
      )}

      {/* Live Readings Toggle */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <button
          onClick={() => setShowReadings(!showReadings)}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-sm">4</span>
          <span className="font-semibold">Live Readings (Optional)</span>
          <span className="text-gray-500">{showReadings ? '▼' : '▶'}</span>
        </button>

        <AnimatePresence>
          {showReadings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">RPM</label>
                  <input
                    type="number"
                    value={rpm || ''}
                    onChange={(e) => setRpm(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="1500"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Oil Pressure (psi)</label>
                  <input
                    type="number"
                    value={oilPressure || ''}
                    onChange={(e) => setOilPressure(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="45"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Coolant Temp (°C)</label>
                  <input
                    type="number"
                    value={coolantTemp || ''}
                    onChange={(e) => setCoolantTemp(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="85"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Battery Voltage (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={batteryVoltage || ''}
                    onChange={(e) => setBatteryVoltage(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="27.5"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Frequency (Hz)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={frequency || ''}
                    onChange={(e) => setFrequency(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="50"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Load (%)</label>
                  <input
                    type="number"
                    value={loadPercent || ''}
                    onChange={(e) => setLoadPercent(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="75"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={runDiagnosis}
        disabled={faultCodes.length === 0 && !symptoms && !ecmModel}
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
      >
        Run Comprehensive Diagnosis
      </button>
    </div>
  );

  // Render analyzing state
  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-amber-500/30 rounded-full" />
        <div className="absolute inset-0 w-24 h-24 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">Analyzing...</h3>
      <p className="mt-2 text-gray-400 text-center max-w-md">
        Cross-referencing ECM data, controller fault codes, and AI diagnostic patterns...
      </p>
      <div className="mt-6 flex gap-2">
        {['ECM Database', 'Fault Codes', 'AI Analysis'].map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
            className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-400"
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render results
  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-6">
        {/* Header with diagnosis ID */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Diagnosis Complete</h2>
            <p className="text-gray-400 text-sm">ID: {results.diagnosisId}</p>
          </div>
          <button
            onClick={resetDiagnosis}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            New Diagnosis
          </button>
        </div>

        {/* Primary Diagnosis */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔧</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{results.solution.primaryDiagnosis}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${results.solution.confidence}%` }}
                  />
                </div>
                <span className="text-amber-400 text-sm">{results.solution.confidence}% confidence</span>
              </div>
            </div>
          </div>
        </div>

        {/* ECM Information */}
        {results.ecmInfo && (
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-green-400 mb-3">ECM Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white font-medium">{results.ecmInfo.ecm.name}</p>
                <p className="text-gray-400 text-sm">{results.ecmInfo.ecm.manufacturer}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Diagnostic Software</p>
                <p className="text-white">{results.ecmInfo.diagnosticSoftware.join(', ')}</p>
              </div>
            </div>
            {results.ecmInfo.relevantFaultCodes.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">ECM-Specific Fault Codes:</p>
                <div className="flex flex-wrap gap-2">
                  {results.ecmInfo.relevantFaultCodes.map(fc => (
                    <span
                      key={fc.code}
                      className={`px-2 py-1 rounded text-xs ${
                        fc.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        fc.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {fc.code}: {fc.description}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fault Code Analysis */}
        {results.faultCodeAnalysis.codeDetails.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              Fault Code Analysis ({results.faultCodeAnalysis.codesFound} found)
            </h3>
            <div className="space-y-3">
              {results.faultCodeAnalysis.codeDetails.map(detail => (
                <div key={detail.code} className="bg-gray-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-white">{detail.code}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      detail.severity === 'critical' || detail.severity === 'shutdown' ? 'bg-red-500/20 text-red-400' :
                      detail.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {detail.severity}
                    </span>
                  </div>
                  {detail.faultInfo && (
                    <p className="text-gray-400 text-sm mt-1">{detail.faultInfo.title}</p>
                  )}
                  {detail.ecmSpecificInfo && (
                    <p className="text-green-400 text-sm mt-1">
                      ECM: {detail.ecmSpecificInfo.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Root Cause Probability */}
            {results.faultCodeAnalysis.rootCauseProbability.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-2">Root Cause Analysis</h4>
                {results.faultCodeAnalysis.rootCauseProbability.map((rc, i) => (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <div className="w-16 text-right">
                      <span className={`font-bold ${
                        rc.probability >= 80 ? 'text-red-400' :
                        rc.probability >= 60 ? 'text-amber-400' :
                        'text-blue-400'
                      }`}>
                        {Math.round(rc.probability)}%
                      </span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          rc.probability >= 80 ? 'bg-red-500' :
                          rc.probability >= 60 ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${rc.probability}%` }}
                      />
                    </div>
                    <span className="text-gray-300 text-sm flex-1">{rc.cause}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Immediate Actions */}
        {results.solution.immediateActions.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-red-400 mb-3">Immediate Actions Required</h3>
            <ul className="space-y-2">
              {results.solution.immediateActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-white">
                  <span className="text-red-400 font-bold">{i + 1}.</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step-by-Step Procedure */}
        {results.solution.stepByStepProcedure.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Repair Procedure</h3>
            <div className="space-y-4">
              {results.solution.stepByStepProcedure.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{step.action}</h4>
                    <p className="text-gray-400 text-sm mt-1">{step.details}</p>
                    {step.safetyWarning && (
                      <p className="text-amber-400 text-sm mt-1">⚠️ {step.safetyWarning}</p>
                    )}
                    {step.tools && step.tools.length > 0 && (
                      <p className="text-gray-500 text-xs mt-1">
                        Tools: {step.tools.join(', ')}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      Est. time: {step.timeEstimate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parts Required */}
        {results.solution.partsRequired.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Parts Required</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left py-2">Part</th>
                    <th className="text-left py-2">Part Number</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Est. Cost (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.solution.partsRequired.map((part, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="py-2 text-white">{part.name}</td>
                      <td className="py-2 text-gray-400 font-mono">{part.partNumber}</td>
                      <td className="py-2 text-center text-gray-400">{part.quantity}</td>
                      <td className="py-2 text-right text-green-400">
                        {part.estimatedCostKES.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cost & Time Estimates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Estimated Repair Time</p>
            <p className="text-2xl font-bold text-white">{results.solution.estimatedRepairTime}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
            <p className="text-gray-400 text-sm">Estimated Cost (KES)</p>
            <p className="text-2xl font-bold text-green-400">
              {results.solution.estimatedCostKES.min.toLocaleString()} - {results.solution.estimatedCostKES.max.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Preventive Measures */}
        {results.solution.preventiveMeasures.length > 0 && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-green-400 mb-3">Prevention & Maintenance</h3>
            <ul className="space-y-2">
              {results.solution.preventiveMeasures.map((measure, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {measure}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resources */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Resources & Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-medium mb-2">Service Manuals</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                {results.resources.serviceManuals.map((manual, i) => (
                  <li key={i}>📖 {manual}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Support Contacts</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                {results.resources.supportContacts.map((contact, i) => (
                  <li key={i}>📞 {contact.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gray-900 rounded-2xl p-6 ${className}`}>
      <AnimatePresence mode="wait">
        {currentStep === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderInputForm()}
          </motion.div>
        )}
        {currentStep === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderAnalyzing()}
          </motion.div>
        )}
        {currentStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
