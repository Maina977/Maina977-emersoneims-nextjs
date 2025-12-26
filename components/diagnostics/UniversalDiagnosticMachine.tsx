'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMockTelemetry, GeneratorTelemetry, PredictiveFailure } from '@/lib/diagnostics/mock-data';

interface UniversalDiagnosticMachineProps {
  onSeverityUpdate?: (service: string, severity: string) => void;
}

export default function UniversalDiagnosticMachine({ onSeverityUpdate }: UniversalDiagnosticMachineProps) {
  const [selectedGenerator, setSelectedGenerator] = useState<string>('');
  const [telemetry, setTelemetry] = useState<GeneratorTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generators = getMockTelemetry() as GeneratorTelemetry[];

  useEffect(() => {
    if (selectedGenerator) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const data = getMockTelemetry(selectedGenerator) as GeneratorTelemetry;
        setTelemetry(data);
        setIsLoading(false);
      }, 800);
    }
  }, [selectedGenerator]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-blue-700 bg-blue-100 border-blue-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Universal Diagnostic Machine</h3>
        <p className="text-gray-600">Real-time generator telemetry & predictive maintenance</p>
      </div>

      <div className="space-y-6">
        {/* Generator Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Generator
          </label>
          <select
            value={selectedGenerator}
            onChange={(e) => setSelectedGenerator(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Choose a generator...</option>
            {generators.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.id} - {gen.model} ({gen.location})
              </option>
            ))}
          </select>
        </div>

        {/* Telemetry Display */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading telemetry...</span>
            </motion.div>
          )}

          {telemetry && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Status Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(telemetry.status)}`}>
                    {telemetry.status.toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Status</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{telemetry.uptime}h</p>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{telemetry.powerOutput}kW</p>
                  <p className="text-sm text-gray-600">Output</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{telemetry.efficiency}%</p>
                  <p className="text-sm text-gray-600">Efficiency</p>
                </div>
              </div>

              {/* Predictive Failures */}
              {telemetry.predictiveFailures.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Predictive Maintenance Alerts</h4>
                  <div className="space-y-3">
                    {telemetry.predictiveFailures.map((failure: PredictiveFailure, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 ${getSeverityColor(failure.severity)}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-gray-900">{failure.component}</h5>
                            <p className="text-sm text-gray-700 mt-1">{failure.recommendation}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{failure.probability}%</p>
                            <p className="text-xs text-gray-600">risk in {failure.estimatedDays} days</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Alerts */}
              {telemetry.alerts.filter(alert => !alert.resolved).length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h4>
                  <div className="space-y-2">
                    {telemetry.alerts.filter(alert => !alert.resolved).map((alert, index) => (
                      <div key={index} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-800">{alert.message}</p>
                          <p className="text-xs text-red-600 mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Fuel Level</p>
                  <p className="text-2xl font-bold text-blue-900">{telemetry.fuelLevel}%</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Battery Health</p>
                  <p className="text-2xl font-bold text-green-900">{telemetry.batteryHealth}%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Oil Pressure</p>
                  <p className="text-2xl font-bold text-purple-900">{telemetry.oilPressure} PSI</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Coolant Temp</p>
                  <p className="text-2xl font-bold text-orange-900">{telemetry.coolantTemp}°C</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-600 font-medium">Voltage</p>
                  <p className="text-2xl font-bold text-indigo-900">{telemetry.voltage}V</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-600 font-medium">Current</p>
                  <p className="text-2xl font-bold text-pink-900">{telemetry.current}A</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}