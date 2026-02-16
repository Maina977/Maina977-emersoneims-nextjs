'use client';

/**
 * Controller Repair Manuals Panel
 * Comprehensive repair guides for all 9 generator controller brands
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CONTROLLER_MANUALS,
  getControllerManual,
  MANUAL_STATS,
  type ControllerManual,
  type RepairProcedure,
  type WiringConnection,
} from '@/lib/generator-oracle/controller-repair-manuals';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type ManualSection = 'overview' | 'wiring' | 'config' | 'repair' | 'faults' | 'maintenance' | 'parts';

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ControllerCard({
  manual,
  isSelected,
  onClick
}: {
  manual: ControllerManual;
  isSelected: boolean;
  onClick: () => void;
}) {
  const brandColors: Record<string, string> = {
    dse: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
    comap: 'from-red-500/20 to-red-600/20 border-red-500/50',
    woodward: 'from-green-500/20 to-green-600/20 border-green-500/50',
    smartgen: 'from-orange-500/20 to-orange-600/20 border-orange-500/50',
    powerwizard: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50',
    datakom: 'from-purple-500/20 to-purple-600/20 border-purple-500/50',
    lovato: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/50',
    siemens: 'from-teal-500/20 to-teal-600/20 border-teal-500/50',
    enko: 'from-pink-500/20 to-pink-600/20 border-pink-500/50',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-xl cursor-pointer transition-all border-2
        bg-gradient-to-br ${brandColors[manual.id] || 'from-slate-500/20 to-slate-600/20 border-slate-500/50'}
        ${isSelected ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">⚙️</span>
        <div>
          <h3 className="font-bold text-white">{manual.brand}</h3>
          <p className="text-xs text-slate-400">{manual.models.length} models</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 line-clamp-2">{manual.description}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        <span className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-cyan-400">
          {manual.repairProcedures.length} repairs
        </span>
        <span className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-amber-400">
          {manual.commonFaults.length} faults
        </span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIRING DIAGRAM SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function WiringDiagramSection({ manual }: { manual: ControllerManual }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/30">
        <h4 className="text-lg font-bold text-cyan-400 mb-4">🔌 Wiring Connections</h4>
        <p className="text-slate-400 text-sm mb-4">{manual.wiringDiagram.description}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 px-3 text-slate-400">Terminal</th>
                <th className="text-left py-2 px-3 text-slate-400">Function</th>
                <th className="text-left py-2 px-3 text-slate-400">Wire Color</th>
                <th className="text-left py-2 px-3 text-slate-400">Size</th>
                <th className="text-left py-2 px-3 text-slate-400">Notes</th>
              </tr>
            </thead>
            <tbody>
              {manual.wiringDiagram.connections.map((conn, i) => (
                <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-2 px-3 font-mono text-amber-400">{conn.terminal}</td>
                  <td className="py-2 px-3 text-white">{conn.function}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {conn.wireColor}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-cyan-400">{conn.wireSize}</td>
                  <td className="py-2 px-3 text-slate-400">{conn.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wire Color Legend */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/30">
        <h4 className="text-lg font-bold text-green-400 mb-3">🎨 Wire Color Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(manual.wiringDiagram.wireColors).map(([key, color]) => (
            <div key={key} className="bg-slate-900/50 rounded p-2">
              <div className="text-slate-400 text-xs">{key}</div>
              <div className="text-white font-medium">{color}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wiring Notes */}
      <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
        <h4 className="text-lg font-bold text-amber-400 mb-3">⚠️ Important Wiring Notes</h4>
        <ul className="space-y-2">
          {manual.wiringDiagram.notes.map((note, i) => (
            <li key={i} className="text-slate-300 flex gap-2">
              <span className="text-amber-400">•</span> {note}
            </li>
          ))}
        </ul>
      </div>

      {/* Terminal Pinouts */}
      {manual.terminalPinouts.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/30">
          <h4 className="text-lg font-bold text-purple-400 mb-3">📍 Communication Pinouts</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {manual.terminalPinouts.map((pin, i) => (
              <div key={i} className="bg-slate-900/50 rounded p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-amber-400 font-mono">{pin.connector}</span>
                  <span className="text-cyan-400 text-sm">Pin {pin.pinNumber}</span>
                </div>
                <div className="text-white font-medium">{pin.function}</div>
                {pin.voltage && <div className="text-slate-400 text-sm">Voltage: {pin.voltage}</div>}
                {pin.notes && <div className="text-slate-500 text-xs mt-1">{pin.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPAIR PROCEDURES SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function RepairProceduresSection({ manual }: { manual: ControllerManual }) {
  const [expandedProcedure, setExpandedProcedure] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {manual.repairProcedures.map((procedure) => (
        <div key={procedure.id} className="bg-slate-800/50 rounded-xl border border-amber-500/30 overflow-hidden">
          <button
            onClick={() => setExpandedProcedure(expandedProcedure === procedure.id ? null : procedure.id)}
            className="w-full px-4 py-3 flex items-start justify-between text-left"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg font-bold text-amber-400">{procedure.title}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  procedure.difficultyLevel === 'beginner' ? 'bg-green-500/20 text-green-400' :
                  procedure.difficultyLevel === 'intermediate' ? 'bg-amber-500/20 text-amber-400' :
                  procedure.difficultyLevel === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {procedure.difficultyLevel.toUpperCase()}
                </span>
                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs">
                  {procedure.estimatedTime}
                </span>
              </div>
              <p className="text-slate-400 text-sm">Symptom: {procedure.symptom}</p>
            </div>
            <span className={`text-slate-400 transition-transform ${expandedProcedure === procedure.id ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          <AnimatePresence>
            {expandedProcedure === procedure.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  {/* Possible Causes */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-red-400 font-bold text-sm mb-2">🔍 Possible Causes</h5>
                    <ul className="space-y-1">
                      {procedure.possibleCauses.map((cause, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-red-400">•</span> {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Diagnostic Steps */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-cyan-400 font-bold text-sm mb-2">🔬 Diagnostic Steps</h5>
                    <ol className="space-y-1">
                      {procedure.diagnosticSteps.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-cyan-400">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Repair Steps */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-green-400 font-bold text-sm mb-2">🔧 Repair Steps</h5>
                    <ol className="space-y-1">
                      {procedure.repairSteps.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-green-400">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Test Procedure */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-purple-400 font-bold text-sm mb-2">✅ Test Procedure</h5>
                    <ol className="space-y-1">
                      {procedure.testProcedure.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-purple-400">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Safety Precautions */}
                  <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                    <h5 className="text-red-400 font-bold text-sm mb-2">⚠️ Safety Precautions</h5>
                    <ul className="space-y-1">
                      {procedure.safetyPrecautions.map((precaution, i) => (
                        <li key={i} className="text-red-300 text-sm flex gap-2">
                          <span className="text-red-400">!</span> {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Parts and Tools */}
                  <div className="flex flex-wrap gap-2">
                    {procedure.partsNeeded.map((part, j) => (
                      <span key={j} className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs">
                        📦 {part}
                      </span>
                    ))}
                    {procedure.specialTools.map((tool, j) => (
                      <span key={j} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                        🔧 {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {manual.repairProcedures.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <div className="text-4xl mb-2">📋</div>
          <p>Detailed repair procedures coming soon</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON FAULTS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function CommonFaultsSection({ manual }: { manual: ControllerManual }) {
  const [expandedFault, setExpandedFault] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {manual.commonFaults.map((fault) => (
        <div
          key={fault.code}
          className={`bg-slate-800/50 rounded-xl border overflow-hidden ${
            fault.severity === 'critical' ? 'border-red-500/50' :
            fault.severity === 'shutdown' ? 'border-orange-500/50' :
            'border-yellow-500/50'
          }`}
        >
          <button
            onClick={() => setExpandedFault(expandedFault === fault.code ? null : fault.code)}
            className="w-full px-4 py-3 flex items-start justify-between text-left"
          >
            <div className="flex items-start gap-3">
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                fault.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                fault.severity === 'shutdown' ? 'bg-orange-500/20 text-orange-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {fault.code}
              </span>
              <div>
                <div className="text-white font-medium">{fault.title}</div>
                <div className="text-slate-400 text-sm mt-1">{fault.description}</div>
              </div>
            </div>
            <span className={`text-slate-400 transition-transform ${expandedFault === fault.code ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          <AnimatePresence>
            {expandedFault === fault.code && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-amber-400 font-bold text-sm mb-2">🔍 Causes</h5>
                    <ul className="space-y-1">
                      {fault.causes.map((cause, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-amber-400">•</span> {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-green-400 font-bold text-sm mb-2">✅ Solutions</h5>
                    <ul className="space-y-1">
                      {fault.solutions.map((solution, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-green-400">{i + 1}.</span> {solution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/30">
                    <h5 className="text-cyan-400 font-bold text-sm mb-2">🔄 Reset Procedure</h5>
                    <ol className="space-y-1">
                      {fault.resetProcedure.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                          <span className="text-cyan-400">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {manual.commonFaults.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Fault code database for this controller coming soon</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPARE PARTS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function SparePartsSection({ manual }: { manual: ControllerManual }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30">
      <h4 className="text-lg font-bold text-amber-400 mb-4">📦 Spare Parts Catalog</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-3 text-slate-400">Part Number</th>
              <th className="text-left py-2 px-3 text-slate-400">Description</th>
              <th className="text-left py-2 px-3 text-slate-400">Price</th>
              <th className="text-left py-2 px-3 text-slate-400">Availability</th>
            </tr>
          </thead>
          <tbody>
            {manual.spareParts.map((part, i) => (
              <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-2 px-3 text-cyan-400 font-mono">{part.partNumber}</td>
                <td className="py-2 px-3 text-white">{part.description}</td>
                <td className="py-2 px-3 text-amber-400 font-bold">{part.price}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    part.availability === 'in-stock' ? 'bg-green-500/20 text-green-400' :
                    part.availability === 'order' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {part.availability === 'in-stock' ? 'In Stock' :
                     part.availability === 'order' ? `Order (${part.leadTime || '2-4 weeks'})` : 'Discontinued'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ControllerRepairManualsPanel() {
  const [selectedController, setSelectedController] = useState<ControllerManual | null>(null);
  const [activeSection, setActiveSection] = useState<ManualSection>('overview');

  const sections: { id: ManualSection; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'wiring', label: 'Wiring Diagrams', icon: '🔌' },
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'repair', label: 'Repair Procedures', icon: '🔧' },
    { id: 'faults', label: 'Fault Codes', icon: '⚠️' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔄' },
    { id: 'parts', label: 'Spare Parts', icon: '📦' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-cyan-500/30">
          <div className="text-2xl font-bold text-cyan-400">{MANUAL_STATS.totalControllers}</div>
          <div className="text-slate-400 text-xs">Controller Brands</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">{MANUAL_STATS.totalModels}</div>
          <div className="text-slate-400 text-xs">Total Models</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-amber-500/30">
          <div className="text-2xl font-bold text-amber-400">{MANUAL_STATS.totalRepairProcedures}</div>
          <div className="text-slate-400 text-xs">Repair Procedures</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-red-500/30">
          <div className="text-2xl font-bold text-red-400">{MANUAL_STATS.totalFaults}</div>
          <div className="text-slate-400 text-xs">Fault Codes</div>
        </div>
      </div>

      {!selectedController ? (
        // Controller Selection Grid
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Select Controller Brand</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CONTROLLER_MANUALS.map((manual) => (
              <ControllerCard
                key={manual.id}
                manual={manual}
                isSelected={false}
                onClick={() => setSelectedController(manual)}
              />
            ))}
          </div>
        </div>
      ) : (
        // Selected Controller Manual
        <div>
          <button
            onClick={() => { setSelectedController(null); setActiveSection('overview'); }}
            className="text-cyan-400 hover:text-cyan-300 mb-4 flex items-center gap-2"
          >
            ← Back to Controller Selection
          </button>

          {/* Manual Header */}
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-cyan-500/30">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedController.brand}</h3>
                <p className="text-slate-400">{selectedController.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedController.models.slice(0, 5).map((model) => (
                    <span key={model} className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">
                      {model}
                    </span>
                  ))}
                  {selectedController.models.length > 5 && (
                    <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">
                      +{selectedController.models.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                <span>{section.icon}</span> {section.label}
              </button>
            ))}
          </div>

          {/* Section Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {activeSection === 'overview' && (
                <div className="space-y-4">
                  {/* Specifications */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/30">
                    <h4 className="text-lg font-bold text-cyan-400 mb-4">📊 Technical Specifications</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Power Supply</span>
                          <span className="text-white">{selectedController.specifications.powerSupply}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Operating Temp</span>
                          <span className="text-white">{selectedController.specifications.operatingTemp}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Protection</span>
                          <span className="text-white">{selectedController.specifications.protection}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Dimensions</span>
                          <span className="text-white">{selectedController.specifications.dimensions}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Display</span>
                          <span className="text-white">{selectedController.specifications.display}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700">
                          <span className="text-slate-400">Weight</span>
                          <span className="text-white">{selectedController.specifications.weight}</span>
                        </div>
                        <div className="py-2 border-b border-slate-700">
                          <span className="text-slate-400 block mb-1">Communication</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedController.specifications.communication.map((comm, i) => (
                              <span key={i} className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs">
                                {comm}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Software Info */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/30">
                    <h4 className="text-lg font-bold text-purple-400 mb-4">💻 Configuration Software</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-white font-bold">{selectedController.softwareInfo.configSoftware}</div>
                        <div className="text-slate-400 text-sm">Version: {selectedController.softwareInfo.version}</div>
                        <div className="text-slate-400 text-sm">Protocol: {selectedController.softwareInfo.protocol}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm mb-2">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedController.softwareInfo.features.map((feature, i) => (
                            <span key={i} className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tools Required */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/30">
                    <h4 className="text-lg font-bold text-green-400 mb-3">🧰 Tools Required</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedController.toolsRequired.map((tool, i) => (
                        <span key={i} className="bg-slate-700 text-slate-300 px-3 py-1 rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'wiring' && <WiringDiagramSection manual={selectedController} />}

              {activeSection === 'config' && (
                <div className="space-y-4">
                  {selectedController.configurationGuide.map((step) => (
                    <div key={step.step} className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/30">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-8 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </span>
                        <h4 className="text-lg font-bold text-white">{step.title}</h4>
                      </div>
                      <p className="text-slate-400 mb-4">{step.description}</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {step.parameters.map((param, i) => (
                          <div key={i} className="bg-slate-900/50 rounded-lg p-3">
                            <div className="text-amber-400 font-bold">{param.name}</div>
                            <div className="text-white">Default: {param.defaultValue}</div>
                            <div className="text-slate-400 text-sm">Range: {param.range}</div>
                            <div className="text-slate-500 text-xs mt-1">{param.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'repair' && <RepairProceduresSection manual={selectedController} />}

              {activeSection === 'faults' && <CommonFaultsSection manual={selectedController} />}

              {activeSection === 'maintenance' && (
                <div className="space-y-4">
                  {selectedController.maintenanceSchedule.map((item, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-green-500/30">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-bold text-green-400">{item.task}</h4>
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-bold">
                          {item.interval}
                        </span>
                      </div>
                      <ol className="space-y-2">
                        {item.procedure.map((step, j) => (
                          <li key={j} className="text-slate-300 flex gap-2">
                            <span className="text-green-400 font-bold">{j + 1}.</span> {step}
                          </li>
                        ))}
                      </ol>
                      {item.parts && item.parts.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.parts.map((part, j) => (
                            <span key={j} className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs">
                              {part}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Safety Warnings */}
                  <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                    <h4 className="text-lg font-bold text-red-400 mb-3">⚠️ Safety Warnings</h4>
                    <ul className="space-y-2">
                      {selectedController.safetyWarnings.map((warning, i) => (
                        <li key={i} className="text-red-300 flex gap-2">
                          <span className="text-red-400">⚠️</span> {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'parts' && <SparePartsSection manual={selectedController} />}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
