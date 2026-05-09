'use client';

/**
 * COMPREHENSIVE SOLAR MAINTENANCE HUB
 * Complete DIY repair guides for inverters, panels, and batteries
 * 20+ brands with error codes, wiring diagrams, and troubleshooting
 *
 * SEO Optimized for: solar repair Kenya, inverter troubleshooting,
 * battery maintenance, panel cleaning, solar wiring diagrams
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench, Zap, Battery, Sun, AlertTriangle, CheckCircle2,
  Search, ChevronDown, ChevronRight, BookOpen, Shield,
  Thermometer, Cable, Lightbulb, HelpCircle, Phone, FileText,
  Download, ExternalLink, Play
} from 'lucide-react';

import {
  INVERTER_BRANDS,
  INVERTER_ERRORS,
  WIRING_GUIDES,
  BATTERY_TYPES,
  PANEL_MAINTENANCE,
  REPAIR_PARTS,
  TROUBLESHOOTING_TREES,
  InverterBrand,
  InverterError,
  BatteryType
} from '@/lib/solar/solarMaintenanceDatabase';

type MaintenanceTab = 'inverters' | 'batteries' | 'panels' | 'wiring' | 'troubleshooting' | 'parts';

export default function SolarMaintenanceHub() {
  const [activeTab, setActiveTab] = useState<MaintenanceTab>('inverters');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<InverterBrand | null>(null);
  const [selectedBattery, setSelectedBattery] = useState<BatteryType | null>(null);
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const [troubleshootingPath, setTroubleshootingPath] = useState<string[]>([]);

  const tabs = [
    { id: 'inverters', label: 'Inverters', icon: <Zap className="w-4 h-4" />, count: INVERTER_BRANDS.length },
    { id: 'batteries', label: 'Batteries', icon: <Battery className="w-4 h-4" />, count: BATTERY_TYPES.length },
    { id: 'panels', label: 'Panels', icon: <Sun className="w-4 h-4" />, count: PANEL_MAINTENANCE.length },
    { id: 'wiring', label: 'Wiring & Calculations', icon: <Cable className="w-4 h-4" /> },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'parts', label: 'Parts & Repairs', icon: <Wrench className="w-4 h-4" />, count: REPAIR_PARTS.length },
  ];

  // Filter errors by search and brand
  const filteredErrors = useMemo(() => {
    let errors = INVERTER_ERRORS;
    if (selectedBrand) {
      errors = errors.filter(e => e.brand.toLowerCase() === selectedBrand.name.toLowerCase() ||
        e.brand.toLowerCase().includes(selectedBrand.id.toLowerCase()));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      errors = errors.filter(e =>
        e.code.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.brand.toLowerCase().includes(query)
      );
    }
    return errors;
  }, [selectedBrand, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Wrench className="w-8 h-8 text-amber-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              Solar Maintenance & Repair Center
            </h2>
            <p className="text-slate-300">
              Complete DIY guides for inverters, panels, and batteries. Error codes, wiring diagrams,
              troubleshooting trees, and repair instructions for 20+ brands sold in Kenya.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search error codes, brands, symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as MaintenanceTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count && (
              <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* INVERTERS TAB */}
        {activeTab === 'inverters' && (
          <motion.div
            key="inverters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Brand Selector */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Select Your Inverter Brand ({INVERTER_BRANDS.length} Brands)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                <button
                  onClick={() => setSelectedBrand(null)}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    !selectedBrand
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All Brands
                </button>
                {INVERTER_BRANDS.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand)}
                    className={`p-3 rounded-lg text-sm transition-all text-left ${
                      selectedBrand?.id === brand.id
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className="font-medium">{brand.name}</div>
                    <div className="text-xs opacity-70">{brand.country}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Brand Details */}
            {selectedBrand && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedBrand.name}</h3>
                    <p className="text-slate-400">{selectedBrand.country} • {selectedBrand.powerRange}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedBrand.popularity === 'high' ? 'bg-green-500/20 text-green-400' :
                    selectedBrand.popularity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {selectedBrand.popularity === 'high' ? 'Popular in Kenya' :
                     selectedBrand.popularity === 'medium' ? 'Available' : 'Limited'}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">Features</h4>
                    <ul className="space-y-1">
                      {selectedBrand.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Common Issues</h4>
                    <ul className="space-y-1">
                      {selectedBrand.commonIssues.map((issue, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Warranty:</span>
                    <p className="text-white font-medium">{selectedBrand.warranty}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Price Range:</span>
                    <p className="text-white font-medium">{selectedBrand.priceRange}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Types:</span>
                    <p className="text-white font-medium">{selectedBrand.types.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Kenya Support:</span>
                    <p className={selectedBrand.supportInKenya ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                      {selectedBrand.supportInKenya ? 'Available' : 'Limited'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Codes */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Error Codes & Solutions ({filteredErrors.length} errors)
              </h3>

              {filteredErrors.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  No error codes found. Try adjusting your search or selecting a different brand.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredErrors.map((error) => (
                    <div
                      key={`${error.brand}-${error.code}`}
                      className="bg-slate-900/50 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedError(
                          expandedError === `${error.brand}-${error.code}` ? null : `${error.brand}-${error.code}`
                        )}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full ${
                            error.severity === 'critical' ? 'bg-red-500' :
                            error.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-400 font-mono">{error.code}</span>
                              <span className="text-slate-500">|</span>
                              <span className="text-slate-400 text-sm">{error.brand}</span>
                            </div>
                            <p className="text-white font-medium">{error.description}</p>
                          </div>
                        </div>
                        {expandedError === `${error.brand}-${error.code}` ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedError === `${error.brand}-${error.code}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4">
                              {error.safetyWarning && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                  <div className="flex items-center gap-2 text-red-400 font-medium mb-1">
                                    <Shield className="w-4 h-4" />
                                    Safety Warning
                                  </div>
                                  <p className="text-red-300 text-sm">{error.safetyWarning}</p>
                                </div>
                              )}

                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-amber-400 font-medium mb-2">Possible Causes</h4>
                                  <ul className="space-y-1">
                                    {error.causes.map((cause, i) => (
                                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                        <span className="text-amber-500 mt-1">•</span>
                                        {cause}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-green-400 font-medium mb-2">Solutions</h4>
                                  <ol className="space-y-1">
                                    {error.solutions.map((solution, i) => (
                                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                                        <span className="text-green-500 font-medium">{i + 1}.</span>
                                        {solution}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-blue-400 font-medium mb-2">Tools Required</h4>
                                <div className="flex flex-wrap gap-2">
                                  {error.tools.map((tool, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* BATTERIES TAB */}
        {activeTab === 'batteries' && (
          <motion.div
            key="batteries"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Battery Type Selector */}
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {BATTERY_TYPES.map((battery) => (
                <button
                  key={battery.id}
                  onClick={() => setSelectedBattery(selectedBattery?.id === battery.id ? null : battery)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedBattery?.id === battery.id
                      ? 'bg-amber-500/20 border-amber-500'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <Battery className={`w-8 h-8 mb-2 ${
                    selectedBattery?.id === battery.id ? 'text-amber-400' : 'text-slate-400'
                  }`} />
                  <h4 className="text-white font-medium">{battery.name}</h4>
                  <p className="text-slate-400 text-xs">{battery.chemistry}</p>
                  <p className="text-green-400 text-xs mt-1">{battery.lifespan}</p>
                </button>
              ))}
            </div>

            {/* Selected Battery Details */}
            {selectedBattery && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedBattery.name}</h3>
                    <p className="text-slate-400">{selectedBattery.chemistry} • {selectedBattery.lifespan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-medium">{selectedBattery.priceRange}</p>
                    <p className="text-slate-400 text-sm">Efficiency: {selectedBattery.efficiency}</p>
                  </div>
                </div>

                {/* Charging Voltages */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h4 className="text-amber-400 font-medium mb-3">Charging Voltages (12V Equivalent)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Bulk</p>
                      <p className="text-white font-mono">{selectedBattery.chargingVoltages.bulk}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Absorption</p>
                      <p className="text-white font-mono">{selectedBattery.chargingVoltages.absorption}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Float</p>
                      <p className="text-white font-mono">{selectedBattery.chargingVoltages.float}</p>
                    </div>
                    {selectedBattery.chargingVoltages.equalization && (
                      <div>
                        <p className="text-slate-400 text-sm">Equalization</p>
                        <p className="text-white font-mono">{selectedBattery.chargingVoltages.equalization}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-2">
                    DoD: {selectedBattery.dod} | Available voltages: {selectedBattery.voltages.join(', ')}
                  </p>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="text-white font-medium mb-2">Common Brands in Kenya</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBattery.brands.map((brand, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Maintenance */}
                  <div>
                    <h4 className="text-green-400 font-medium mb-2">Maintenance Tasks</h4>
                    <ul className="space-y-2">
                      {selectedBattery.maintenance.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Warnings */}
                  <div>
                    <h4 className="text-red-400 font-medium mb-2">Important Warnings</h4>
                    <ul className="space-y-2">
                      {selectedBattery.warnings.map((warning, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ideal For */}
                <div>
                  <h4 className="text-blue-400 font-medium mb-2">Ideal Applications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBattery.idealFor.map((use, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!selectedBattery && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                <Battery className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Select a Battery Type</h3>
                <p className="text-slate-400">
                  Click on any battery type above to see detailed maintenance guides,
                  charging parameters, and important safety information.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* PANELS TAB */}
        {activeTab === 'panels' && (
          <motion.div
            key="panels"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PANEL_MAINTENANCE.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Sun className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{guide.task}</h3>
                      <p className="text-amber-400 text-sm">{guide.frequency}</p>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4">{guide.description}</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2 text-sm">Steps</h4>
                      <ol className="space-y-1">
                        {guide.steps.slice(0, 5).map((step, i) => (
                          <li key={i} className="text-slate-400 text-xs flex items-start gap-2">
                            <span className="text-amber-500 font-medium">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                        {guide.steps.length > 5 && (
                          <li className="text-amber-400 text-xs">
                            +{guide.steps.length - 5} more steps...
                          </li>
                        )}
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2 text-sm">Tools</h4>
                      <div className="flex flex-wrap gap-1">
                        {guide.tools.map((tool, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {guide.warnings.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <h4 className="text-red-400 font-medium mb-1 text-sm">Safety</h4>
                        <ul className="space-y-1">
                          {guide.warnings.slice(0, 2).map((warning, i) => (
                            <li key={i} className="text-red-300 text-xs">• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* WIRING TAB */}
        {activeTab === 'wiring' && (
          <motion.div
            key="wiring"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {WIRING_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Cable className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{guide.title}</h3>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-sm">
                      {guide.systemType}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 mb-6">{guide.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Components */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Required Components</h4>
                    <ul className="space-y-1">
                      {guide.components.map((comp, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          {comp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Wiring Steps */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Wiring Steps</h4>
                    <ol className="space-y-1">
                      {guide.steps.map((step, i) => (
                        <li key={i} className="text-slate-300 text-sm">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Calculations */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                  <h4 className="text-amber-400 font-medium mb-3">Calculations & Formulas</h4>
                  <div className="space-y-4">
                    {guide.calculations.map((calc, i) => (
                      <div key={i} className="bg-slate-900/50 rounded-lg p-3">
                        <code className="text-green-400 text-sm block mb-2">{calc.formula}</code>
                        <p className="text-slate-300 text-sm mb-1">{calc.description}</p>
                        <p className="text-amber-300 text-xs">Example: {calc.example}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cable Sizing Table */}
                <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                  <h4 className="text-white font-medium mb-3">Cable Sizing Guide (Copper)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-400 border-b border-slate-700">
                          <th className="py-2 px-3">Current</th>
                          <th className="py-2 px-3">Cable Size</th>
                          <th className="py-2 px-3">Max Length (3% drop)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guide.cableSizes.map((size, i) => (
                          <tr key={i} className="border-b border-slate-800">
                            <td className="py-2 px-3 text-white">{size.current}</td>
                            <td className="py-2 px-3 text-amber-400">{size.cableSize}</td>
                            <td className="py-2 px-3 text-slate-300">{size.maxLength}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Safety Notes */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Safety Notes
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {guide.safetyNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-red-300 text-sm">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TROUBLESHOOTING TAB */}
        {activeTab === 'troubleshooting' && (
          <motion.div
            key="troubleshooting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(TROUBLESHOOTING_TREES).map(([key, nodes]) => (
                <TroubleshootingWizard key={key} title={key} nodes={nodes} />
              ))}
            </div>
          </motion.div>
        )}

        {/* PARTS TAB */}
        {activeTab === 'parts' && (
          <motion.div
            key="parts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {REPAIR_PARTS.map((part) => (
                <div
                  key={part.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        part.category === 'inverter' ? 'bg-amber-500/20' :
                        part.category === 'battery' ? 'bg-green-500/20' :
                        part.category === 'panel' ? 'bg-blue-500/20' :
                        part.category === 'wiring' ? 'bg-purple-500/20' :
                        'bg-red-500/20'
                      }`}>
                        <Wrench className={`w-6 h-6 ${
                          part.category === 'inverter' ? 'text-amber-400' :
                          part.category === 'battery' ? 'text-green-400' :
                          part.category === 'panel' ? 'text-blue-400' :
                          part.category === 'wiring' ? 'text-purple-400' :
                          'text-red-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{part.name}</h3>
                        <span className="text-slate-400 text-sm capitalize">{part.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 font-medium">{part.estimatedCost}</p>
                      <span className={`text-xs ${
                        part.repairDifficulty === 'easy' ? 'text-green-400' :
                        part.repairDifficulty === 'moderate' ? 'text-amber-400' :
                        part.repairDifficulty === 'difficult' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {part.repairDifficulty.charAt(0).toUpperCase() + part.repairDifficulty.slice(1)} DIY
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4">{part.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-amber-400 text-sm font-medium mb-1">Symptoms of Failure</h4>
                      <div className="flex flex-wrap gap-1">
                        {part.symptoms.map((symptom, i) => (
                          <span key={i} className="px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded text-xs">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    {part.diyPossible && (
                      <div>
                        <h4 className="text-green-400 text-sm font-medium mb-1">Replacement Steps</h4>
                        <ol className="space-y-1">
                          {part.replacementSteps.map((step, i) => (
                            <li key={i} className="text-slate-400 text-xs flex items-start gap-2">
                              <span className="text-green-500 font-medium">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Need Professional Help?</h3>
            <p className="text-slate-300">
              Our expert technicians are available 24/7 for emergency repairs, complex troubleshooting,
              and professional maintenance services across Kenya.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:+254768860665"
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href="https://wa.me/254768860665?text=Hi,%20I%20need%20help%20with%20my%20solar%20system"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#20BD5A] transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Troubleshooting Wizard Component
function TroubleshootingWizard({ title, nodes }: { title: string; nodes: any[] }) {
  const [currentNode, setCurrentNode] = useState(nodes[0]);
  const [history, setHistory] = useState<any[]>([]);
  const [solution, setSolution] = useState<{ text: string; severity: string } | null>(null);

  const handleAnswer = (option: any) => {
    if (option.solution) {
      setSolution({ text: option.solution, severity: option.severity || 'info' });
    } else if (option.nextNodeId) {
      setHistory([...history, currentNode]);
      const nextNode = nodes.find(n => n.id === option.nextNodeId);
      if (nextNode) setCurrentNode(nextNode);
    }
  };

  const reset = () => {
    setCurrentNode(nodes[0]);
    setHistory([]);
    setSolution(null);
  };

  const goBack = () => {
    if (history.length > 0) {
      setCurrentNode(history[history.length - 1]);
      setHistory(history.slice(0, -1));
      setSolution(null);
    }
  };

  const titleText = title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-amber-400" />
        {titleText}
      </h3>

      {solution ? (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            solution.severity === 'critical' ? 'bg-red-500/10 border border-red-500/30' :
            solution.severity === 'warning' ? 'bg-amber-500/10 border border-amber-500/30' :
            'bg-green-500/10 border border-green-500/30'
          }`}>
            <div className={`font-medium mb-2 ${
              solution.severity === 'critical' ? 'text-red-400' :
              solution.severity === 'warning' ? 'text-amber-400' :
              'text-green-400'
            }`}>
              Solution Found
            </div>
            <p className="text-slate-300">{solution.text}</p>
          </div>
          <button
            onClick={reset}
            className="w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-white">{currentNode.question}</p>
          <div className="space-y-2">
            {currentNode.options.map((option: any, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                className="w-full p-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-left text-sm"
              >
                {option.answer}
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <button
              onClick={goBack}
              className="text-slate-400 text-sm hover:text-white transition-colors"
            >
              ← Go Back
            </button>
          )}
        </div>
      )}
    </div>
  );
}
