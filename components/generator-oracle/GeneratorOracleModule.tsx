'use client';

/**
 * Generator Oracle - Ultra-Premium Cockpit Interface
 * Inspired by: Mercedes EQS Hyperscreen, Tesla Model S Plaid, Airbus A380, Gulfstream G700
 * The most advanced generator diagnostic interface in East Africa
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllFaultCodes,
  searchFaultCodes,
  getFaultCodesByBrand,
  getFaultCodesByModel,
  getTotalFaultCodeCount,
  CONTROLLER_BRANDS,
  type ControllerFaultCode,
} from '@/lib/generator-oracle/controllerFaultCodes';
import {
  getOracleTranslation,
  SUPPORTED_ORACLE_LANGUAGES,
  type OracleTranslations,
} from '@/lib/generator-oracle/oracleTranslations';
import {
  initDatabase,
  getSetting,
  saveSetting,
  isDatabaseAvailable,
  initializeOfflineData,
  getDiagnosisHistory,
  saveDiagnosisHistory,
  saveFeedback,
  type DiagnosisHistoryEntry,
} from '@/lib/generator-oracle/indexedDBService';
import LicenseGate from './LicenseGate';
import InstallPrompt from './InstallPrompt';
import EnginePanel from './panels/EnginePanel';
import ElectricalPanel from './panels/ElectricalPanel';
import FaultDiagnosticsPanel from './panels/FaultDiagnosticsPanel';

// ==================== TYPES ====================
interface GeneratorParameters {
  // Engine
  rpm: number | null;
  oilPressure: number | null;
  oilTemperature: number | null;
  coolantTemp: number | null;
  coolantPressure: number | null;
  fuelPressure: number | null;
  engineHours: number | null;
  intakeAirTemp: number | null;
  exhaustTemp: number | null;
  turboBoostPressure: number | null;
  // Electrical
  voltageL1N: number | null;
  voltageL2N: number | null;
  voltageL3N: number | null;
  voltageL1L2: number | null;
  voltageL2L3: number | null;
  voltageL3L1: number | null;
  currentL1: number | null;
  currentL2: number | null;
  currentL3: number | null;
  currentNeutral: number | null;
  activePowerKw: number | null;
  reactivePowerKvar: number | null;
  apparentPowerKva: number | null;
  powerFactor: number | null;
  frequency: number | null;
  // Generator
  loadPercent: number | null;
  runningHours: number | null;
  startAttempts: number | null;
  // Battery
  batteryVoltage: number | null;
  chargerCurrent: number | null;
  chargerStatus: 'charging' | 'float' | 'off' | null;
  // Fuel
  fuelLevel: number | null;
  fuelConsumptionRate: number | null;
  fuelUsedTotal: number | null;
  // Environment
  ambientTemp: number | null;
  controllerTemp: number | null;
}

const DEFAULT_PARAMETERS: GeneratorParameters = {
  rpm: null, oilPressure: null, oilTemperature: null, coolantTemp: null, coolantPressure: null,
  fuelPressure: null, engineHours: null, intakeAirTemp: null, exhaustTemp: null, turboBoostPressure: null,
  voltageL1N: null, voltageL2N: null, voltageL3N: null, voltageL1L2: null, voltageL2L3: null, voltageL3L1: null,
  currentL1: null, currentL2: null, currentL3: null, currentNeutral: null,
  activePowerKw: null, reactivePowerKvar: null, apparentPowerKva: null, powerFactor: null, frequency: null,
  loadPercent: null, runningHours: null, startAttempts: null,
  batteryVoltage: null, chargerCurrent: null, chargerStatus: null,
  fuelLevel: null, fuelConsumptionRate: null, fuelUsedTotal: null,
  ambientTemp: null, controllerTemp: null,
};

// ==================== AMBIENT COCKPIT BACKGROUND ====================
function CockpitBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050508]">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d14] via-[#050508] to-[#020203]" />

      {/* Holographic grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(245,158,11,0.05),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(139,92,246,0.05),transparent_40%)]" />

      {/* Scanning beam */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        animate={{ top: ['-5%', '105%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{ boxShadow: '0 0 30px 10px rgba(6,182,212,0.3)' }}
      />

      {/* Corner HUD elements */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          className={`absolute w-32 h-32 ${
            corner === 'top-left' ? 'top-4 left-4' :
            corner === 'top-right' ? 'top-4 right-4 rotate-90' :
            corner === 'bottom-left' ? 'bottom-4 left-4 -rotate-90' :
            'bottom-4 right-4 rotate-180'
          }`}
        >
          <svg className="w-full h-full text-cyan-500/20">
            <path d="M0 60 L0 0 L60 0" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M0 80 L0 0 L80 0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      ))}

      {/* Floating particles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-cyan-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -30, -60],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// ==================== STATUS LED ====================
function StatusLED({ status, label }: { status: 'online' | 'offline' | 'warning' | 'error'; label: string }) {
  const colors = {
    online: { bg: 'bg-green-500', glow: '#22c55e' },
    offline: { bg: 'bg-slate-600', glow: 'transparent' },
    warning: { bg: 'bg-amber-500', glow: '#f59e0b' },
    error: { bg: 'bg-red-500', glow: '#ef4444' },
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-2 h-2 rounded-full ${colors[status].bg}`}
        animate={status !== 'offline' ? { opacity: [1, 0.4, 1] } : {}}
        transition={{ duration: status === 'error' ? 0.5 : 1.5, repeat: Infinity }}
        style={{ boxShadow: `0 0 8px ${colors[status].glow}` }}
      />
      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ==================== GLASS PANEL ====================
function GlassPanel({
  children,
  className = '',
  title,
  icon,
  accentColor = 'cyan',
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  accentColor?: 'cyan' | 'amber' | 'purple' | 'green' | 'red';
}) {
  const borderColors = {
    cyan: 'border-cyan-500/30',
    amber: 'border-amber-500/30',
    purple: 'border-purple-500/30',
    green: 'border-green-500/30',
    red: 'border-red-500/30',
  };

  const titleColors = {
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Glass background */}
      <div
        className={`absolute inset-0 rounded-2xl backdrop-blur-xl bg-slate-950/80 border ${borderColors[accentColor]}`}
        style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        {title && (
          <div className="flex items-center gap-3 mb-4">
            {icon && <span className="text-2xl">{icon}</span>}
            <h3 className={`text-sm font-bold uppercase tracking-[0.2em] ${titleColors[accentColor]}`}>
              {title}
            </h3>
          </div>
        )}
        {children}
      </div>

      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${borderColors[accentColor].replace('/30', '/50')} rounded-tl-2xl`} />
      <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${borderColors[accentColor].replace('/30', '/50')} rounded-tr-2xl`} />
      <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${borderColors[accentColor].replace('/30', '/50')} rounded-bl-2xl`} />
      <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${borderColors[accentColor].replace('/30', '/50')} rounded-br-2xl`} />
    </motion.div>
  );
}

// ==================== NAVIGATION TAB ====================
function NavTab({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-4 py-3 rounded-xl transition-all ${
        active
          ? 'bg-cyan-500/20 border border-cyan-500/50'
          : 'hover:bg-slate-800/50 border border-transparent'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className={`text-sm font-medium uppercase tracking-wider ${active ? 'text-cyan-400' : 'text-slate-400'}`}>
          {label}
        </span>
      </div>

      {badge !== undefined && badge > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {badge}
        </motion.span>
      )}

      {active && (
        <motion.div
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-cyan-500"
          layoutId="activeTab"
          style={{ boxShadow: '0 0 10px rgba(6,182,212,0.5)' }}
        />
      )}
    </motion.button>
  );
}

// ==================== MAIN MODULE ====================
export default function GeneratorOracleModule() {
  // Core state
  const [language, setLanguage] = useState('en');
  const [t, setT] = useState<OracleTranslations>(getOracleTranslation('en'));
  const [isRTL, setIsRTL] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'command' | 'engine' | 'electrical' | 'faults' | 'history' | 'settings'>('command');

  // Controller selection
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Parameters
  const [parameters, setParameters] = useState<GeneratorParameters>(DEFAULT_PARAMETERS);
  const [generatorStatus, setGeneratorStatus] = useState<'running' | 'standby' | 'fault' | 'off'>('standby');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ControllerFaultCode[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // System
  const [systemTime, setSystemTime] = useState(new Date());
  const [isOffline, setIsOffline] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [totalCodes, setTotalCodes] = useState(0);
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistoryEntry[]>([]);

  // System clock
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize
  useEffect(() => {
    const init = async () => {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', () => setIsOffline(false));
      window.addEventListener('offline', () => setIsOffline(true));

      setTotalCodes(getTotalFaultCodeCount());

      if (isDatabaseAvailable()) {
        try {
          await initDatabase();
          const savedLang = await getSetting('language');
          if (savedLang) {
            setLanguage(savedLang);
            setT(getOracleTranslation(savedLang));
            setIsRTL(SUPPORTED_ORACLE_LANGUAGES.find(l => l.code === savedLang)?.rtl || false);
          }

          const savedBrand = await getSetting('lastSelectedBrand');
          const savedModel = await getSetting('lastSelectedModel');
          if (savedBrand) setSelectedBrand(savedBrand);
          if (savedModel) setSelectedModel(savedModel);

          const offlineLoaded = await getSetting('offlineDataLoaded');
          if (offlineLoaded) {
            setOfflineReady(true);
          } else {
            await initializeOfflineData(getAllFaultCodes(), () => {});
            setOfflineReady(true);
          }

          const history = await getDiagnosisHistory(20);
          setDiagnosisHistory(history);
        } catch (error) {
          console.error('Failed to initialize:', error);
        }
      }
    };

    init();
  }, []);

  // Handlers
  const handleLanguageChange = useCallback(async (langCode: string) => {
    setLanguage(langCode);
    setT(getOracleTranslation(langCode));
    setIsRTL(SUPPORTED_ORACLE_LANGUAGES.find(l => l.code === langCode)?.rtl || false);
    if (isDatabaseAvailable()) {
      await saveSetting('language', langCode);
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      let results: ControllerFaultCode[];
      if (selectedModel) {
        const modelCodes = getFaultCodesByModel(selectedModel);
        const q = query.toLowerCase();
        results = modelCodes.filter(code =>
          code.code.toLowerCase().includes(q) ||
          code.title.toLowerCase().includes(q) ||
          code.description.toLowerCase().includes(q)
        );
      } else if (selectedBrand) {
        const brandCodes = getFaultCodesByBrand(selectedBrand);
        const q = query.toLowerCase();
        results = brandCodes.filter(code =>
          code.code.toLowerCase().includes(q) ||
          code.title.toLowerCase().includes(q) ||
          code.description.toLowerCase().includes(q)
        );
      } else {
        results = searchFaultCodes(query);
      }
      setSearchResults(results.slice(0, 100));
    } finally {
      setIsSearching(false);
    }
  }, [selectedBrand, selectedModel]);

  const handleBrandSelect = useCallback(async (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    if (isDatabaseAvailable()) {
      await saveSetting('lastSelectedBrand', brand);
    }
  }, []);

  const handleModelSelect = useCallback(async (model: string) => {
    setSelectedModel(model);
    if (isDatabaseAvailable()) {
      await saveSetting('lastSelectedModel', model);
    }
  }, []);

  const updateParameter = useCallback(<K extends keyof GeneratorParameters>(key: K, value: GeneratorParameters[K]) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  }, []);

  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    const brand = Object.values(CONTROLLER_BRANDS).find(b =>
      b.name.toLowerCase().includes(selectedBrand.toLowerCase())
    );
    return brand?.models || [];
  }, [selectedBrand]);

  return (
    <LicenseGate>
      <div className={`min-h-screen text-white overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
        <CockpitBackground />
        <InstallPrompt />

        {/* Copy protection */}
        <style jsx global>{`
          .protected-content { user-select: none; -webkit-user-select: none; }
          input, button, textarea, a { user-select: auto !important; -webkit-user-select: auto !important; }
        `}</style>

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* ==================== COMMAND HEADER ==================== */}
          <header className="flex-shrink-0 bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
              {/* Top Status Bar */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800/50 text-xs">
                <div className="flex items-center gap-4 lg:gap-6">
                  <StatusLED status={generatorStatus === 'running' ? 'online' : generatorStatus === 'fault' ? 'error' : 'offline'} label="Generator" />
                  <StatusLED status={isOffline ? 'offline' : 'online'} label="Network" />
                  <StatusLED status={offlineReady ? 'online' : 'warning'} label="Database" />
                </div>

                <div className="flex items-center gap-4">
                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-4 px-3 py-1 bg-slate-900/50 rounded border border-slate-700/50">
                    <div className="text-center">
                      <span className="text-slate-500 text-[10px] uppercase">Codes</span>
                      <div className="font-mono text-cyan-400">{totalCodes.toLocaleString()}</div>
                    </div>
                    <div className="w-px h-6 bg-slate-700" />
                    <div className="text-center">
                      <span className="text-slate-500 text-[10px] uppercase">Controller</span>
                      <div className="font-mono text-cyan-400">{selectedModel || 'None'}</div>
                    </div>
                  </div>

                  {/* Language */}
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-slate-900/50 text-cyan-400 px-2 py-1 rounded border border-slate-700/50 text-xs"
                  >
                    {SUPPORTED_ORACLE_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.flag} {lang.code.toUpperCase()}</option>
                    ))}
                  </select>

                  {/* Time */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded border border-slate-700/50">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-mono text-cyan-400">
                      {systemTime.toLocaleTimeString('en-US', { hour12: false })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Header */}
              <div className="flex items-center justify-between py-4">
                {/* Logo */}
                <div className="flex items-center gap-4">
                  <motion.div
                    className="relative w-12 h-12 lg:w-14 lg:h-14"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700 flex items-center justify-center"
                      style={{ boxShadow: '0 0 30px rgba(6,182,212,0.5)' }}
                    >
                      <span className="text-2xl">⚡</span>
                    </div>
                  </motion.div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold tracking-wider">
                      <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                        GENERATOR ORACLE
                      </span>
                    </h1>
                    <p className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-[0.25em]">Professional Diagnostic System</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <NavTab icon="🎛️" label="Command" active={activeScreen === 'command'} onClick={() => setActiveScreen('command')} />
                  <NavTab icon="⚙️" label="Engine" active={activeScreen === 'engine'} onClick={() => setActiveScreen('engine')} />
                  <NavTab icon="⚡" label="Electrical" active={activeScreen === 'electrical'} onClick={() => setActiveScreen('electrical')} />
                  <NavTab icon="🔧" label="Faults" active={activeScreen === 'faults'} onClick={() => setActiveScreen('faults')} badge={2} />
                  <NavTab icon="📋" label="History" active={activeScreen === 'history'} onClick={() => setActiveScreen('history')} />
                  <NavTab icon="⚙️" label="Settings" active={activeScreen === 'settings'} onClick={() => setActiveScreen('settings')} />
                </nav>

                {/* Mobile nav */}
                <div className="lg:hidden">
                  <select
                    value={activeScreen}
                    onChange={(e) => setActiveScreen(e.target.value as typeof activeScreen)}
                    className="bg-slate-900/50 text-cyan-400 px-3 py-2 rounded-lg border border-cyan-500/30"
                  >
                    <option value="command">🎛️ Command</option>
                    <option value="engine">⚙️ Engine</option>
                    <option value="electrical">⚡ Electrical</option>
                    <option value="faults">🔧 Faults</option>
                    <option value="history">📋 History</option>
                    <option value="settings">⚙️ Settings</option>
                  </select>
                </div>

                {/* Emergency */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:flex px-4 py-2 bg-gradient-to-br from-red-600 to-red-800 rounded-xl font-bold uppercase tracking-wider text-white shadow-lg shadow-red-500/30 items-center gap-2"
                >
                  <span>⚠️</span>
                  <span className="text-sm">E-STOP</span>
                </motion.button>
              </div>
            </div>
          </header>

          {/* ==================== MAIN CONTENT ==================== */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="max-w-[1920px] mx-auto">
              <AnimatePresence mode="wait">
                {/* COMMAND CENTER */}
                {activeScreen === 'command' && (
                  <motion.div
                    key="command"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Controller Selection */}
                    <GlassPanel title="Controller Selection" icon="🎛️" accentColor="cyan">
                      <div className="space-y-4">
                        {/* Brands */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {Object.entries(CONTROLLER_BRANDS).map(([key, brand]) => (
                            <motion.button
                              key={key}
                              onClick={() => handleBrandSelect(brand.name)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-4 rounded-xl transition-all ${
                                selectedBrand === brand.name
                                  ? 'bg-cyan-500/20 border-2 border-cyan-500'
                                  : 'bg-slate-900/50 border border-slate-700 hover:border-cyan-500/50'
                              }`}
                              style={{
                                boxShadow: selectedBrand === brand.name ? '0 0 20px rgba(6,182,212,0.3)' : 'none'
                              }}
                            >
                              <div className="text-2xl mb-2">
                                {key === 'DSE' && '⚡'}
                                {key === 'COMAP' && '🔴'}
                                {key === 'WOODWARD' && '🟢'}
                                {key === 'SMARTGEN' && '🟣'}
                                {key === 'POWERWIZARD' && '🟡'}
                              </div>
                              <div className={`text-sm font-medium ${selectedBrand === brand.name ? 'text-cyan-300' : 'text-slate-400'}`}>
                                {brand.name}
                              </div>
                              <div className="text-xs text-slate-600">{brand.models.length} models</div>
                            </motion.button>
                          ))}
                        </div>

                        {/* Models */}
                        {selectedBrand && availableModels.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-4 border-t border-slate-700"
                          >
                            <div className="text-xs text-cyan-500 uppercase tracking-wider mb-3">Select Model</div>
                            <div className="flex flex-wrap gap-2">
                              {availableModels.map(model => (
                                <motion.button
                                  key={model}
                                  onClick={() => handleModelSelect(model)}
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-4 py-2 rounded-lg font-mono text-sm ${
                                    selectedModel === model
                                      ? 'bg-cyan-500 text-white'
                                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-cyan-500/50'
                                  }`}
                                >
                                  {model}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </GlassPanel>

                    {/* Quick Search */}
                    <GlassPanel title="Quick Fault Search" icon="🔍" accentColor="purple">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                          placeholder="Enter fault code or description..."
                          className="flex-1 px-4 py-3 bg-slate-950/80 border border-purple-500/30 rounded-xl text-cyan-300 font-mono placeholder-slate-600"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSearch(searchQuery)}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl"
                        >
                          Search
                        </motion.button>
                      </div>

                      {/* Search Results */}
                      {searchResults.length > 0 && (
                        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                          {searchResults.slice(0, 10).map((fault) => (
                            <div
                              key={fault.id}
                              className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 cursor-pointer hover:border-cyan-500/50"
                              onClick={() => setActiveScreen('faults')}
                            >
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-1 bg-slate-800 rounded font-mono text-cyan-400">{fault.code}</span>
                                <span className="text-white">{fault.title}</span>
                                <span className={`ml-auto px-2 py-0.5 rounded text-xs ${
                                  fault.severity === 'shutdown' ? 'bg-red-500/20 text-red-400' :
                                  fault.severity === 'critical' ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {fault.severity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </GlassPanel>

                    {/* Status Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <GlassPanel title="System Status" icon="📊" accentColor="green">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                            <span className="text-slate-400">Generator</span>
                            <span className={`font-medium ${
                              generatorStatus === 'running' ? 'text-green-400' :
                              generatorStatus === 'fault' ? 'text-red-400' :
                              'text-blue-400'
                            }`}>
                              {generatorStatus.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                            <span className="text-slate-400">Offline Data</span>
                            <span className={offlineReady ? 'text-green-400' : 'text-amber-400'}>
                              {offlineReady ? 'READY' : 'SYNCING...'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                            <span className="text-slate-400">Total Codes</span>
                            <span className="text-cyan-400 font-mono">{totalCodes.toLocaleString()}</span>
                          </div>
                        </div>
                      </GlassPanel>

                      <GlassPanel title="Quick Actions" icon="⚡" accentColor="amber">
                        <div className="grid grid-cols-2 gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveScreen('faults')}
                            className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-amber-500/50 text-center"
                          >
                            <div className="text-2xl mb-2">🔍</div>
                            <div className="text-sm text-slate-300">Search Faults</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveScreen('engine')}
                            className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-amber-500/50 text-center"
                          >
                            <div className="text-2xl mb-2">⚙️</div>
                            <div className="text-sm text-slate-300">Engine Panel</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveScreen('electrical')}
                            className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-amber-500/50 text-center"
                          >
                            <div className="text-2xl mb-2">⚡</div>
                            <div className="text-sm text-slate-300">Electrical</div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveScreen('history')}
                            className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-amber-500/50 text-center"
                          >
                            <div className="text-2xl mb-2">📋</div>
                            <div className="text-sm text-slate-300">History</div>
                          </motion.button>
                        </div>
                      </GlassPanel>

                      <GlassPanel title="Support" icon="💬" accentColor="purple">
                        <div className="space-y-3">
                          <a
                            href="tel:+254782914717"
                            className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20"
                          >
                            <span className="text-xl">📞</span>
                            <div>
                              <div className="text-sm text-blue-400">Call Support</div>
                              <div className="text-xs text-slate-500">+254 782 914 717</div>
                            </div>
                          </a>
                          <a
                            href="https://wa.me/254768860665"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20"
                          >
                            <span className="text-xl">💬</span>
                            <div>
                              <div className="text-sm text-green-400">WhatsApp</div>
                              <div className="text-xs text-slate-500">Quick response</div>
                            </div>
                          </a>
                        </div>
                      </GlassPanel>
                    </div>
                  </motion.div>
                )}

                {/* ENGINE PANEL */}
                {activeScreen === 'engine' && (
                  <motion.div
                    key="engine"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <EnginePanel
                      parameters={{
                        rpm: parameters.rpm,
                        oilPressure: parameters.oilPressure,
                        oilTemperature: parameters.oilTemperature,
                        coolantTemp: parameters.coolantTemp,
                        coolantPressure: parameters.coolantPressure,
                        fuelPressure: parameters.fuelPressure,
                        engineHours: parameters.engineHours,
                        intakeAirTemp: parameters.intakeAirTemp,
                        exhaustTemp: parameters.exhaustTemp,
                        turboBoostPressure: parameters.turboBoostPressure,
                      }}
                      onParameterChange={updateParameter}
                    />
                  </motion.div>
                )}

                {/* ELECTRICAL PANEL */}
                {activeScreen === 'electrical' && (
                  <motion.div
                    key="electrical"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ElectricalPanel
                      parameters={{
                        voltageL1N: parameters.voltageL1N,
                        voltageL2N: parameters.voltageL2N,
                        voltageL3N: parameters.voltageL3N,
                        voltageL1L2: parameters.voltageL1L2,
                        voltageL2L3: parameters.voltageL2L3,
                        voltageL3L1: parameters.voltageL3L1,
                        currentL1: parameters.currentL1,
                        currentL2: parameters.currentL2,
                        currentL3: parameters.currentL3,
                        currentNeutral: parameters.currentNeutral,
                        activePowerKw: parameters.activePowerKw,
                        reactivePowerKvar: parameters.reactivePowerKvar,
                        apparentPowerKva: parameters.apparentPowerKva,
                        powerFactor: parameters.powerFactor,
                        frequency: parameters.frequency,
                      }}
                      onParameterChange={updateParameter}
                    />
                  </motion.div>
                )}

                {/* FAULTS PANEL */}
                {activeScreen === 'faults' && (
                  <motion.div
                    key="faults"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FaultDiagnosticsPanel
                      onSearch={handleSearch}
                      searchResults={searchResults as any}
                      isSearching={isSearching}
                    />
                  </motion.div>
                )}

                {/* HISTORY */}
                {activeScreen === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <GlassPanel title="Diagnosis History" icon="📋" accentColor="purple">
                      {diagnosisHistory.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-4xl mb-4">📋</div>
                          <div className="text-slate-400">No diagnosis history yet</div>
                          <div className="text-sm text-slate-600 mt-2">Diagnosed faults will appear here</div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {diagnosisHistory.map((entry, idx) => (
                            <div key={entry.id || idx} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-mono text-cyan-400">{entry.faultCode}</span>
                                  <span className="text-white ml-3">{entry.faultTitle}</span>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {new Date(entry.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </GlassPanel>
                  </motion.div>
                )}

                {/* SETTINGS */}
                {activeScreen === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <GlassPanel title="System Settings" icon="⚙️" accentColor="cyan">
                      <div className="space-y-6">
                        <div className="p-4 bg-slate-900/50 rounded-lg">
                          <div className="text-sm text-slate-400 mb-2">Language</div>
                          <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          >
                            {SUPPORTED_ORACLE_LANGUAGES.map(lang => (
                              <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-4 bg-slate-900/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Offline Mode</span>
                            <span className={offlineReady ? 'text-green-400' : 'text-amber-400'}>
                              {offlineReady ? `${totalCodes.toLocaleString()} codes cached` : 'Syncing...'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-amber-400 mb-2">
                            <span>🎁</span>
                            <span className="font-medium">FREE Access Period</span>
                          </div>
                          <div className="text-sm text-slate-400">
                            Full access until March 1st, 2026. After that: KES 20,000/year
                          </div>
                        </div>
                      </div>
                    </GlassPanel>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* ==================== FOOTER ==================== */}
          <footer className="flex-shrink-0 bg-slate-950/90 backdrop-blur-xl border-t border-cyan-500/20 py-2 px-4 lg:px-6">
            <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span>Generator Oracle v2.0</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Compatible with DSE, ComAp, Woodward, SmartGen, PowerWizard</span>
              </div>
              <div className="flex items-center gap-3">
                <span>FREE until March 1, 2026</span>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">TRIAL ACTIVE</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </LicenseGate>
  );
}
