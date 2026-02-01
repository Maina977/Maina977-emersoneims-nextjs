'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModuleSelector, { ModuleId } from './ModuleSelector';
import ModeSelector, { UserMode } from './ModeSelector';
import PredictiveAnalyzer from './PredictiveAnalyzer';
import EfficiencyCalculator from './EfficiencyCalculator';
import RepairGuideLibrary from './RepairGuideLibrary';
import PartsCatalog from './PartsCatalog';
import SchematicExplorer from './SchematicExplorer';
import FinancialDashboard from './FinancialDashboard';

export default function MainCompanionModule() {
  const [activeModule, setActiveModule] = useState<ModuleId>('analyzer');
  const [userMode, setUserMode] = useState<UserMode>('technician');
  const [targetGuideId, setTargetGuideId] = useState<string | undefined>();
  const [targetPartNumber, setTargetPartNumber] = useState<string | undefined>();

  const handleViewGuide = (guideId: string) => {
    setTargetGuideId(guideId);
    setActiveModule('repairs');
  };

  const handleViewPart = (partNumber: string) => {
    setTargetPartNumber(partNumber);
    setActiveModule('parts');
  };

  // Reset target when module changes
  const handleModuleChange = (module: ModuleId) => {
    if (module !== 'repairs') setTargetGuideId(undefined);
    if (module !== 'parts') setTargetPartNumber(undefined);
    setActiveModule(module);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            AI-Powered Maintenance Intelligence
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Generator Maintenance Companion
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Your complete guide to generator maintenance, troubleshooting, and optimization.
            Repair manuals, parts catalog, predictive AI, and financial analysis in one platform.
          </p>
        </motion.div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <ModuleSelector
            activeModule={activeModule}
            onModuleChange={handleModuleChange}
          />
          <ModeSelector mode={userMode} onModeChange={setUserMode} />
        </div>

        {/* Quick Stats (Owner Mode) */}
        {userMode === 'owner' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <span className="text-slate-500 text-xs block mb-1">Next Service</span>
              <span className="text-emerald-400 font-mono text-lg font-bold">250 hrs</span>
              <span className="text-slate-500 text-xs block">or 30 days</span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <span className="text-slate-500 text-xs block mb-1">Generator Health</span>
              <span className="text-cyan-400 font-mono text-lg font-bold">92%</span>
              <span className="text-slate-500 text-xs block">Good condition</span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <span className="text-slate-500 text-xs block mb-1">Monthly Cost</span>
              <span className="text-amber-400 font-mono text-lg font-bold">KES 45K</span>
              <span className="text-slate-500 text-xs block">fuel + maintenance</span>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <span className="text-slate-500 text-xs block mb-1">Efficiency</span>
              <span className="text-white font-mono text-lg font-bold">78%</span>
              <span className="text-emerald-400 text-xs block">↑ 3% vs last month</span>
            </div>
          </motion.div>
        )}

        {/* Main Content Area */}
        <motion.div
          layout
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 md:p-8"
        >
          <AnimatePresence mode="wait">
            {activeModule === 'analyzer' && (
              <motion.div
                key="analyzer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PredictiveAnalyzer
                  onViewGuide={handleViewGuide}
                  onViewPart={handleViewPart}
                />
              </motion.div>
            )}

            {activeModule === 'efficiency' && (
              <motion.div
                key="efficiency"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <EfficiencyCalculator />
              </motion.div>
            )}

            {activeModule === 'repairs' && (
              <motion.div
                key="repairs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RepairGuideLibrary
                  initialGuideId={targetGuideId}
                  isTechnicianMode={userMode === 'technician'}
                />
              </motion.div>
            )}

            {activeModule === 'parts' && (
              <motion.div
                key="parts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PartsCatalog initialPartNumber={targetPartNumber} />
              </motion.div>
            )}

            {activeModule === 'schematics' && (
              <motion.div
                key="schematics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SchematicExplorer
                  onViewGuide={handleViewGuide}
                  onViewPart={handleViewPart}
                />
              </motion.div>
            )}

            {activeModule === 'financials' && (
              <motion.div
                key="financials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <FinancialDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Integration Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <a
            href="/generator-oracle"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Have a fault code? Try Generator Oracle for instant diagnostics
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
