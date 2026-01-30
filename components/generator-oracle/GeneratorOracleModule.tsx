'use client';

/**
 * Generator Oracle - Sci-Fi Control Center Interface
 * Futuristic diagnostic cockpit with 20,000+ fault codes
 * Features: Holographic displays, analog gauges, glowing controls, power grid aesthetics
 * Licensed product with copy protection and PWA support
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  CONTROLLER_THRESHOLDS,
  getControllerThresholds,
  getDefaultThresholds,
  analyzeParameters,
  type LiveParameters,
  DEFAULT_LIVE_PARAMETERS,
  type ParameterAnalysis,
} from '@/lib/generator-oracle/parameterThresholds';
import {
  initDatabase,
  saveFaultCodes,
  getAllFaultCodes as getOfflineFaultCodes,
  getFaultCodeCount,
  saveDiagnosisHistory,
  getDiagnosisHistory,
  saveFeedback,
  getSetting,
  saveSetting,
  isDatabaseAvailable,
  initializeOfflineData,
  type DiagnosisHistoryEntry,
} from '@/lib/generator-oracle/indexedDBService';
import LicenseGate from './LicenseGate';
import InstallPrompt from './InstallPrompt';

// Contact info
const CONTACT_INFO = {
  whatsapp: '+254768860665',
  phone: '+254782914717',
  email: 'support@emersoneims.com',
};

// ==================== ANIMATED BACKGROUND ====================
function HolographicBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Scanning Line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        style={{ boxShadow: '0 0 20px 5px rgba(0,255,255,0.5)' }}
        animate={{ top: ['-5%', '105%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner Decorations */}
      <svg className="absolute top-0 left-0 w-32 h-32 text-cyan-500/20">
        <path d="M0 50 L0 0 L50 0" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M0 80 L0 0 L80 0" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute top-0 right-0 w-32 h-32 text-cyan-500/20 rotate-90">
        <path d="M0 50 L0 0 L50 0" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M0 80 L0 0 L80 0" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-32 h-32 text-cyan-500/20 -rotate-90">
        <path d="M0 50 L0 0 L50 0" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M0 80 L0 0 L80 0" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-32 h-32 text-cyan-500/20 rotate-180">
        <path d="M0 50 L0 0 L50 0" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M0 80 L0 0 L80 0" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// ==================== POWER RING ====================
function PowerRing({ value, max, color = 'cyan', size = 120, label }: { value: number; max: number; color?: string; size?: number; label: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray * (1 - percentage / 100);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Ring */}
        <circle
          cx={size/2}
          cy={size/2}
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        {/* Tick Marks */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1={size/2}
            y1="5"
            x2={size/2}
            y2="15"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            transform={`rotate(${i * 30} ${size/2} ${size/2})`}
          />
        ))}
        {/* Progress Ring */}
        <motion.circle
          cx={size/2}
          cy={size/2}
          r="45"
          fill="none"
          stroke={`var(--color-${color}-500)`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: strokeDasharray }}
          animate={{ strokeDashoffset }}
          style={{
            filter: `drop-shadow(0 0 10px var(--color-${color}-500))`,
          }}
        />
        {/* Glow Effect */}
        <circle
          cx={size/2}
          cy={size/2}
          r="45"
          fill="none"
          stroke={`var(--color-${color}-400)`}
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          opacity="0.5"
          style={{
            filter: `blur(4px)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold text-${color}-400 font-mono`}>
          {value.toFixed(0)}
        </span>
      </div>
      <span className="text-xs text-slate-400 mt-1">{label}</span>
    </div>
  );
}

// ==================== GLOWING KNOB ====================
function GlowingKnob({
  value,
  onChange,
  min = 0,
  max = 100,
  label,
  unit,
  color = 'amber'
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  min?: number;
  max?: number;
  label: string;
  unit: string;
  color?: string;
}) {
  const percentage = value !== null ? ((value - min) / (max - min)) * 100 : 0;
  const rotation = -135 + (percentage * 2.7); // 270 degree range

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>

      {/* Knob Container */}
      <div className="relative w-20 h-20">
        {/* Outer Ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-${color}-500/30`}
          style={{
            boxShadow: `0 0 20px rgba(245, 158, 11, 0.2), inset 0 0 20px rgba(0,0,0,0.5)`,
          }}
        />

        {/* Tick Marks */}
        <svg className="absolute inset-0 w-full h-full">
          {[...Array(11)].map((_, i) => {
            const angle = -135 + (i * 27);
            const rad = (angle * Math.PI) / 180;
            const innerR = 32;
            const outerR = 38;
            return (
              <line
                key={i}
                x1={40 + innerR * Math.cos(rad)}
                y1={40 + innerR * Math.sin(rad)}
                x2={40 + outerR * Math.cos(rad)}
                y2={40 + outerR * Math.sin(rad)}
                stroke={i <= percentage / 10 ? `var(--color-${color}-400)` : 'rgba(255,255,255,0.3)'}
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Knob Body */}
        <motion.div
          className={`absolute inset-2 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-${color}-500/50 cursor-pointer`}
          style={{
            boxShadow: `0 0 15px rgba(245, 158, 11, 0.3)`,
          }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Indicator Line */}
          <div className={`absolute top-2 left-1/2 w-0.5 h-4 bg-${color}-400 -translate-x-1/2`} />

          {/* Center Dot */}
          <div className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-${color}-500 -translate-x-1/2 -translate-y-1/2`} />
        </motion.div>
      </div>

      {/* Value Input */}
      <div className="relative">
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
          className={`w-24 px-2 py-1 bg-slate-900/80 border border-${color}-500/30 rounded text-center text-${color}-400 font-mono text-sm focus:outline-none focus:border-${color}-500`}
          style={{
            boxShadow: `0 0 10px rgba(245, 158, 11, 0.1)`,
          }}
          placeholder="--"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

// ==================== HEXAGONAL BUTTON ====================
function HexButton({
  children,
  onClick,
  active = false,
  color = 'cyan',
  size = 'md'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-16 h-14 text-xs',
    md: 'w-24 h-20 text-sm',
    lg: 'w-32 h-28 text-base',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative ${sizeClasses[size]} flex items-center justify-center transition-all`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Hexagon Shape */}
      <svg viewBox="0 0 100 87" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`hex-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={active ? 'rgba(0,255,255,0.3)' : 'rgba(30,41,59,0.8)'} />
            <stop offset="100%" stopColor={active ? 'rgba(0,200,255,0.2)' : 'rgba(15,23,42,0.8)'} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <polygon
          points="50,0 100,25 100,75 50,100 0,75 0,25"
          transform="translate(0,-6.5)"
          fill={`url(#hex-grad-${color})`}
          stroke={active ? 'rgba(0,255,255,0.8)' : 'rgba(100,116,139,0.5)'}
          strokeWidth="2"
          filter={active ? 'url(#glow)' : undefined}
        />
      </svg>

      {/* Content */}
      <span className={`relative z-10 font-medium ${active ? 'text-cyan-300' : 'text-slate-400'}`}>
        {children}
      </span>

      {/* Active Glow */}
      {active && (
        <motion.div
          className="absolute inset-0 bg-cyan-500/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}

// ==================== STATUS LED ====================
function StatusLED({ status, label }: { status: 'ok' | 'warning' | 'critical' | 'offline'; label: string }) {
  const colors = {
    ok: { bg: 'bg-green-500', glow: 'shadow-green-500/50' },
    warning: { bg: 'bg-yellow-500', glow: 'shadow-yellow-500/50' },
    critical: { bg: 'bg-red-500', glow: 'shadow-red-500/50' },
    offline: { bg: 'bg-slate-600', glow: '' },
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-3 h-3 rounded-full ${colors[status].bg} shadow-lg ${colors[status].glow}`}
        animate={status !== 'offline' ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: status === 'critical' ? 0.5 : 1.5, repeat: Infinity }}
      />
      <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
    </div>
  );
}

// ==================== HOLOGRAPHIC PANEL ====================
function HoloPanel({ children, title, className = '', glow = 'cyan' }: { children: React.ReactNode; title?: string; className?: string; glow?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Panel Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 rounded-xl"
        style={{
          boxShadow: `0 0 30px rgba(0,255,255,0.1), inset 0 0 30px rgba(0,0,0,0.5)`,
        }}
      />

      {/* Border Animation */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite',
          }}
        />
      </div>

      {/* Border */}
      <div
        className={`absolute inset-0 rounded-xl border border-${glow}-500/30`}
        style={{
          boxShadow: `0 0 20px rgba(0,255,255,0.1)`,
        }}
      />

      {/* Title Bar */}
      {title && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-slate-900 border border-cyan-500/30 rounded-md">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title}</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl" />
    </motion.div>
  );
}

// ==================== DIGITAL DISPLAY ====================
function DigitalDisplay({ value, label, unit, digits = 4 }: { value: number | string; label: string; unit?: string; digits?: number }) {
  const displayValue = typeof value === 'number' ? value.toString().padStart(digits, '0') : value;

  return (
    <div className="flex flex-col items-center">
      <div
        className="bg-slate-950 px-4 py-2 rounded border border-cyan-500/30"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 10px rgba(0,255,255,0.1)',
        }}
      >
        <span className="font-mono text-2xl text-cyan-400 tracking-wider" style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>
          {displayValue}
        </span>
        {unit && <span className="ml-1 text-sm text-cyan-600">{unit}</span>}
      </div>
      <span className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{label}</span>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function GeneratorOracleModule() {
  // State
  const [language, setLanguage] = useState<string>('en');
  const [t, setT] = useState<OracleTranslations>(getOracleTranslation('en'));
  const [isRTL, setIsRTL] = useState(false);

  // Controller selection
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ControllerFaultCode[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fault code display
  const [selectedFault, setSelectedFault] = useState<ControllerFaultCode | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['symptoms', 'causes', 'reset']));

  // Parameters
  const [liveParams, setLiveParams] = useState<LiveParameters>(DEFAULT_LIVE_PARAMETERS);
  const [parameterAnalysis, setParameterAnalysis] = useState<ParameterAnalysis[]>([]);

  // Tabs
  const [activeTab, setActiveTab] = useState<'search' | 'diagnose' | 'history' | 'settings'>('search');

  // History
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistoryEntry[]>([]);

  // Offline
  const [isOffline, setIsOffline] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalCodes, setTotalCodes] = useState(0);

  // Animation states
  const [systemTime, setSystemTime] = useState(new Date());

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

      const count = getTotalFaultCodeCount();
      setTotalCodes(count);

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
            const allCodes = getAllFaultCodes();
            await initializeOfflineData(allCodes, (loaded, total) => {
              setLoadingProgress(Math.round((loaded / total) * 100));
            });
            setOfflineReady(true);
          }

          const history = await getDiagnosisHistory(20);
          setDiagnosisHistory(history);
        } catch (error) {
          console.error('Failed to initialize IndexedDB:', error);
        }
      }
    };

    init();

    return () => {
      window.removeEventListener('online', () => setIsOffline(false));
      window.removeEventListener('offline', () => setIsOffline(true));
    };
  }, []);

  // Handlers
  const handleLanguageChange = useCallback(async (langCode: string) => {
    setLanguage(langCode);
    setT(getOracleTranslation(langCode));
    const langInfo = SUPPORTED_ORACLE_LANGUAGES.find(l => l.code === langCode);
    setIsRTL(langInfo?.rtl || false);
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
    setSearchResults([]);
    setSearchQuery('');
    if (isDatabaseAvailable()) {
      await saveSetting('lastSelectedBrand', brand);
    }
  }, []);

  const handleModelSelect = useCallback(async (model: string) => {
    setSelectedModel(model);
    setSearchResults([]);
    setSearchQuery('');
    if (isDatabaseAvailable()) {
      await saveSetting('lastSelectedModel', model);
    }
  }, []);

  const runDiagnosis = useCallback(() => {
    if (!selectedModel) return;

    const thresholds = getControllerThresholds(selectedBrand || '', selectedModel);
    const params = thresholds?.parameters || getDefaultThresholds();
    const analysis = analyzeParameters(liveParams, params);
    setParameterAnalysis(analysis);

    const criticalParams = analysis.filter(a => a.status === 'critical');
    const warningParams = analysis.filter(a => a.status === 'warning');

    if (criticalParams.length > 0 || warningParams.length > 0) {
      const modelCodes = getFaultCodesByModel(selectedModel);
      const matchingFaults = modelCodes.filter(code => {
        return criticalParams.some(p =>
          code.title.toLowerCase().includes(p.parameter.toLowerCase()) ||
          code.subcategory.toLowerCase().includes(p.parameter.toLowerCase())
        ) || warningParams.some(p =>
          code.title.toLowerCase().includes(p.parameter.toLowerCase()) ||
          code.subcategory.toLowerCase().includes(p.parameter.toLowerCase())
        );
      });
      setSearchResults(matchingFaults.slice(0, 50));
    }
  }, [selectedBrand, selectedModel, liveParams]);

  const saveDiagnosis = useCallback(async (fault: ControllerFaultCode) => {
    if (!isDatabaseAvailable()) return;

    const entry: DiagnosisHistoryEntry = {
      timestamp: new Date().toISOString(),
      controllerBrand: selectedBrand || fault.brand,
      controllerModel: selectedModel || fault.model,
      faultCodeId: fault.id,
      faultCode: fault.code,
      faultTitle: fault.title,
      parameters: { ...liveParams } as unknown as Record<string, number | null>,
      resolved: false,
    };

    await saveDiagnosisHistory(entry);
    const history = await getDiagnosisHistory(20);
    setDiagnosisHistory(history);
  }, [selectedBrand, selectedModel, liveParams]);

  const handleFeedback = useCallback(async (faultId: string, worked: 'yes' | 'no' | 'partial', notes?: string) => {
    if (!isDatabaseAvailable()) return;

    await saveFeedback({
      faultCodeId: faultId,
      solutionWorked: worked,
      notes,
      controllerModel: selectedModel || '',
    });
  }, [selectedModel]);

  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    const brand = Object.values(CONTROLLER_BRANDS).find(b =>
      b.name.toLowerCase().includes(selectedBrand.toLowerCase())
    );
    return brand?.models || [];
  }, [selectedBrand]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'shutdown': return 'text-red-500 bg-red-500/10 border-red-500/50';
      case 'critical': return 'text-orange-500 bg-orange-500/10 border-orange-500/50';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/50';
      default: return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/50';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <LicenseGate>
    <div className={`min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Animated Background */}
      <HolographicBackground />

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Add shimmer animation and copy protection CSS */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Copy protection for sensitive fault code data */
        .protected-content,
        .fault-code-data,
        .fault-code-card {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }

        /* Allow selection on input fields and buttons */
        input, button, textarea, a {
          -webkit-user-select: auto !important;
          user-select: auto !important;
        }
      `}</style>

      {/* Main Container */}
      <div className="relative z-10">
        {/* ==================== COMMAND HEADER ==================== */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4">
            {/* Top Bar - System Status */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <div className="flex items-center gap-6">
                <StatusLED status={isOffline ? 'offline' : 'ok'} label="NETWORK" />
                <StatusLED status={offlineReady ? 'ok' : 'warning'} label="DATABASE" />
                <StatusLED status="ok" label="SYSTEM" />
              </div>

              <div className="flex items-center gap-4">
                {/* System Time */}
                <div className="font-mono text-cyan-400 text-sm">
                  {systemTime.toLocaleTimeString('en-US', { hour12: false })}
                </div>

                {/* Language Selector */}
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="appearance-none bg-slate-900/80 text-cyan-400 px-3 py-1 rounded border border-cyan-500/30 cursor-pointer text-sm font-mono focus:outline-none focus:border-cyan-500"
                >
                  {SUPPORTED_ORACLE_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Header */}
            <div className="flex items-center justify-between py-4">
              {/* Logo & Title */}
              <div className="flex items-center gap-4">
                {/* Animated Logo */}
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700 flex items-center justify-center"
                    style={{
                      boxShadow: '0 0 30px rgba(0,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 30px rgba(0,255,255,0.4)',
                        '0 0 50px rgba(0,255,255,0.6)',
                        '0 0 30px rgba(0,255,255,0.4)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>

                  {/* Rotating Ring */}
                  <motion.div
                    className="absolute -inset-2 border-2 border-dashed border-cyan-500/30 rounded-xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    {t.appTitle}
                  </h1>
                  <p className="text-sm text-cyan-600 font-mono">{t.appSubtitle}</p>
                </div>
              </div>

              {/* Stats Display */}
              <div className="hidden lg:flex items-center gap-8">
                <DigitalDisplay value={totalCodes} label={t.faultCodes} digits={5} />
                <DigitalDisplay value="5" label={t.controllers} digits={2} />
                <DigitalDisplay value={offlineReady ? 'READY' : 'SYNC'} label="STATUS" />
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 pb-2">
              {(['search', 'diagnose', 'history', 'settings'] as const).map(tab => (
                <HexButton
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  size="sm"
                >
                  {t[`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}` as keyof OracleTranslations]}
                </HexButton>
              ))}
            </div>
          </div>
        </header>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {/* ==================== SEARCH TAB ==================== */}
            {activeTab === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Controller Selection Panel */}
                <HoloPanel title="CONTROLLER SELECTION">
                  <div className="space-y-6">
                    {/* Brand Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(CONTROLLER_BRANDS).map(([key, brand]) => (
                        <motion.button
                          key={key}
                          onClick={() => handleBrandSelect(brand.name)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative p-4 rounded-lg transition-all ${
                            selectedBrand === brand.name
                              ? 'bg-cyan-500/20 border-2 border-cyan-500'
                              : 'bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50'
                          }`}
                          style={{
                            boxShadow: selectedBrand === brand.name
                              ? '0 0 30px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.1)'
                              : 'none',
                          }}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">
                              {key === 'DSE' && '⚡'}
                              {key === 'COMAP' && '🔴'}
                              {key === 'WOODWARD' && '🟢'}
                              {key === 'SMARTGEN' && '🟣'}
                              {key === 'POWERWIZARD' && '🟡'}
                            </div>
                            <div className={`text-sm font-medium ${selectedBrand === brand.name ? 'text-cyan-300' : 'text-slate-400'}`}>
                              {brand.name}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              {brand.models.length} models
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          {selectedBrand === brand.name && (
                            <motion.div
                              className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              style={{ boxShadow: '0 0 10px rgba(0,255,255,0.8)' }}
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Model Selection */}
                    {selectedBrand && availableModels.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-4 border-t border-slate-700"
                      >
                        <div className="text-xs text-cyan-500 uppercase tracking-wider mb-3">{t.selectModel}</div>
                        <div className="flex flex-wrap gap-2">
                          {availableModels.map(model => (
                            <motion.button
                              key={model}
                              onClick={() => handleModelSelect(model)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                                selectedModel === model
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-cyan-500/50'
                              }`}
                              style={{
                                boxShadow: selectedModel === model ? '0 0 15px rgba(0,255,255,0.5)' : 'none',
                              }}
                            >
                              {model}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </HoloPanel>

                {/* Search Terminal */}
                <HoloPanel title="FAULT CODE SEARCH">
                  <div className="relative">
                    <div className="flex items-center gap-3 bg-slate-950 rounded-lg border border-cyan-500/30 px-4 py-3">
                      <span className="text-cyan-500 font-mono">{'>'}</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="flex-1 bg-transparent text-cyan-300 placeholder-slate-600 focus:outline-none font-mono text-lg"
                        style={{ textShadow: '0 0 5px rgba(0,255,255,0.3)' }}
                      />
                      {isSearching && (
                        <motion.div
                          className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                    </div>

                    {/* Decorative line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-300 to-transparent"
                      initial={{ width: 0 }}
                      animate={{ width: searchQuery ? '100%' : '30%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </HoloPanel>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <HoloPanel title={`RESULTS: ${searchResults.length} CODES FOUND`}>
                    <div className="space-y-3">
                      {searchResults.map(fault => (
                        <FaultCodeCard
                          key={fault.id}
                          fault={fault}
                          t={t}
                          isExpanded={selectedFault?.id === fault.id}
                          onToggle={() => setSelectedFault(selectedFault?.id === fault.id ? null : fault)}
                          onSaveDiagnosis={() => saveDiagnosis(fault)}
                          onFeedback={handleFeedback}
                          expandedSections={expandedSections}
                          toggleSection={toggleSection}
                          getSeverityColor={getSeverityColor}
                        />
                      ))}
                    </div>
                  </HoloPanel>
                )}

                {searchQuery && !isSearching && searchResults.length === 0 && (
                  <HoloPanel>
                    <div className="text-center py-12">
                      <div className="text-cyan-600 text-lg font-mono">{t.noResults}</div>
                      <div className="text-slate-600 text-sm mt-2">Try a different search term or select a controller first</div>
                    </div>
                  </HoloPanel>
                )}
              </motion.div>
            )}

            {/* ==================== DIAGNOSE TAB ==================== */}
            {activeTab === 'diagnose' && (
              <motion.div
                key="diagnose"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Live Parameters Control Panel */}
                <HoloPanel title="LIVE PARAMETER INPUT">
                  {!selectedModel && (
                    <div className="text-center py-12">
                      <div className="text-cyan-600 text-lg font-mono">SELECT CONTROLLER FIRST</div>
                      <div className="text-slate-600 text-sm mt-2">Go to Search tab and select a controller model</div>
                    </div>
                  )}

                  {selectedModel && (
                    <div className="space-y-8">
                      {/* Gauge Display Row */}
                      <div className="flex justify-center gap-6 flex-wrap">
                        <PowerRing value={liveParams.voltageL1N || 0} max={500} label="L1-N VOLT" color="cyan" />
                        <PowerRing value={liveParams.frequency || 0} max={65} label="FREQUENCY" color="amber" />
                        <PowerRing value={liveParams.rpm || 0} max={2000} label="RPM" color="green" />
                        <PowerRing value={liveParams.loadPercent || 0} max={100} label="LOAD %" color="purple" />
                      </div>

                      {/* Knob Controls */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <GlowingKnob
                          label={t.voltage + ' L1-N'}
                          value={liveParams.voltageL1N}
                          onChange={(v) => setLiveParams(p => ({ ...p, voltageL1N: v }))}
                          unit="V"
                          min={0}
                          max={500}
                        />
                        <GlowingKnob
                          label={t.voltage + ' L2-N'}
                          value={liveParams.voltageL2N}
                          onChange={(v) => setLiveParams(p => ({ ...p, voltageL2N: v }))}
                          unit="V"
                          min={0}
                          max={500}
                        />
                        <GlowingKnob
                          label={t.voltage + ' L3-N'}
                          value={liveParams.voltageL3N}
                          onChange={(v) => setLiveParams(p => ({ ...p, voltageL3N: v }))}
                          unit="V"
                          min={0}
                          max={500}
                        />
                        <GlowingKnob
                          label={t.frequency}
                          value={liveParams.frequency}
                          onChange={(v) => setLiveParams(p => ({ ...p, frequency: v }))}
                          unit="Hz"
                          min={45}
                          max={65}
                        />
                        <GlowingKnob
                          label={t.rpm}
                          value={liveParams.rpm}
                          onChange={(v) => setLiveParams(p => ({ ...p, rpm: v }))}
                          unit="RPM"
                          min={0}
                          max={2000}
                        />
                        <GlowingKnob
                          label={t.oilPressure}
                          value={liveParams.oilPressure}
                          onChange={(v) => setLiveParams(p => ({ ...p, oilPressure: v }))}
                          unit="PSI"
                          min={0}
                          max={100}
                        />
                        <GlowingKnob
                          label={t.coolantTemp}
                          value={liveParams.coolantTemp}
                          onChange={(v) => setLiveParams(p => ({ ...p, coolantTemp: v }))}
                          unit="°C"
                          min={0}
                          max={120}
                        />
                        <GlowingKnob
                          label={t.batteryVoltage}
                          value={liveParams.batteryVoltage}
                          onChange={(v) => setLiveParams(p => ({ ...p, batteryVoltage: v }))}
                          unit="V"
                          min={0}
                          max={30}
                        />
                        <GlowingKnob
                          label={t.loadPercent}
                          value={liveParams.loadPercent}
                          onChange={(v) => setLiveParams(p => ({ ...p, loadPercent: v }))}
                          unit="%"
                          min={0}
                          max={100}
                        />
                        <GlowingKnob
                          label={t.fuelLevel}
                          value={liveParams.fuelLevel}
                          onChange={(v) => setLiveParams(p => ({ ...p, fuelLevel: v }))}
                          unit="%"
                          min={0}
                          max={100}
                        />
                      </div>

                      {/* Run Diagnosis Button */}
                      <motion.button
                        onClick={runDiagnosis}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)',
                          boxShadow: '0 0 30px rgba(0,255,255,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
                        }}
                      >
                        <span className="relative z-10 text-white">{t.runDiagnosis}</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.button>
                    </div>
                  )}
                </HoloPanel>

                {/* Analysis Results */}
                {parameterAnalysis.length > 0 && (
                  <HoloPanel title="PARAMETER ANALYSIS">
                    <div className="grid gap-3">
                      {parameterAnalysis.map((analysis, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            analysis.status === 'critical' ? 'bg-red-500/10 border-red-500/50' :
                            analysis.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/50' :
                            analysis.status === 'normal' ? 'bg-green-500/10 border-green-500/50' :
                            'bg-slate-800/50 border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <StatusLED
                              status={analysis.status === 'critical' ? 'critical' : analysis.status === 'warning' ? 'warning' : 'ok'}
                              label=""
                            />
                            <span className="text-slate-300 font-medium">{analysis.parameter}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`font-mono text-lg ${
                              analysis.status === 'critical' ? 'text-red-400' :
                              analysis.status === 'warning' ? 'text-yellow-400' :
                              analysis.status === 'normal' ? 'text-green-400' :
                              'text-slate-400'
                            }`}>
                              {analysis.value !== null ? `${analysis.value} ${analysis.unit}` : '-'}
                            </span>
                            <span className="text-xs text-slate-500 max-w-[200px] truncate">{analysis.message}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </HoloPanel>
                )}

                {/* Matching Faults */}
                {searchResults.length > 0 && (
                  <HoloPanel title={`MATCHING FAULT CODES: ${searchResults.length}`}>
                    <div className="space-y-3">
                      {searchResults.slice(0, 10).map(fault => (
                        <FaultCodeCard
                          key={fault.id}
                          fault={fault}
                          t={t}
                          isExpanded={selectedFault?.id === fault.id}
                          onToggle={() => setSelectedFault(selectedFault?.id === fault.id ? null : fault)}
                          onSaveDiagnosis={() => saveDiagnosis(fault)}
                          onFeedback={handleFeedback}
                          expandedSections={expandedSections}
                          toggleSection={toggleSection}
                          getSeverityColor={getSeverityColor}
                        />
                      ))}
                    </div>
                  </HoloPanel>
                )}
              </motion.div>
            )}

            {/* ==================== HISTORY TAB ==================== */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HoloPanel title="DIAGNOSIS HISTORY LOG">
                  {diagnosisHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-cyan-600 text-lg font-mono">NO HISTORY DATA</div>
                      <div className="text-slate-600 text-sm mt-2">Diagnosed faults will appear here</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {diagnosisHistory.map((entry, idx) => (
                        <motion.div
                          key={entry.id || idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-mono text-cyan-400 text-lg">{entry.faultCode}</div>
                              <div className="text-slate-300">{entry.faultTitle}</div>
                              <div className="text-sm text-slate-500 mt-1">
                                {entry.controllerModel} • {new Date(entry.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <StatusLED status={entry.resolved ? 'ok' : 'warning'} label={entry.resolved ? 'RESOLVED' : 'PENDING'} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </HoloPanel>
              </motion.div>
            )}

            {/* ==================== SETTINGS TAB ==================== */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <HoloPanel title="SYSTEM CONFIGURATION">
                  <div className="space-y-6">
                    {/* Offline Status */}
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div>
                        <div className="text-slate-300 font-medium">{t.offlineMode}</div>
                        <div className="text-sm text-slate-500">
                          {offlineReady ? `${totalCodes.toLocaleString()} codes cached for offline use` : 'Synchronizing...'}
                        </div>
                      </div>
                      <StatusLED status={offlineReady ? 'ok' : 'warning'} label={offlineReady ? 'READY' : 'SYNC'} />
                    </div>

                    {/* Contact Support */}
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="text-slate-300 font-medium mb-4">{t.needHelp}</div>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`tel:${CONTACT_INFO.phone}`}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/20 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {t.callSupport}
                        </a>
                        <a
                          href={`https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-all"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          {t.whatsappSupport}
                        </a>
                        <a
                          href={`mailto:${CONTACT_INFO.email}`}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/20 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {t.emailSupport}
                        </a>
                      </div>
                    </div>
                  </div>
                </HoloPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ==================== OFFLINE INDICATOR ==================== */}
        {isOffline && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50"
          >
            <div className="bg-yellow-500/90 text-yellow-900 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium backdrop-blur-sm">
              <motion.div
                className="w-2 h-2 bg-yellow-900 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              OFFLINE MODE - All features available locally
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </LicenseGate>
  );
}

// ==================== FAULT CODE CARD ====================
function FaultCodeCard({
  fault,
  t,
  isExpanded,
  onToggle,
  onSaveDiagnosis,
  onFeedback,
  expandedSections,
  toggleSection,
  getSeverityColor,
}: {
  fault: ControllerFaultCode;
  t: OracleTranslations;
  isExpanded: boolean;
  onToggle: () => void;
  onSaveDiagnosis: () => void;
  onFeedback: (faultId: string, worked: 'yes' | 'no' | 'partial', notes?: string) => void;
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
  getSeverityColor: (severity: string) => string;
}) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  return (
    <motion.div
      className="relative bg-slate-900/80 rounded-xl border border-cyan-500/20 overflow-hidden fault-code-card protected-content"
      style={{
        boxShadow: isExpanded ? '0 0 30px rgba(0,255,255,0.1)' : 'none',
      }}
      layout
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Fault Code */}
          <div
            className="font-mono text-xl text-cyan-400 px-3 py-1 bg-cyan-500/10 rounded border border-cyan-500/30 fault-code-data"
            style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}
          >
            {fault.code}
          </div>

          {/* Severity Badge */}
          <div className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getSeverityColor(fault.severity)}`}>
            {fault.severity}
          </div>

          {/* Title */}
          <div className="text-slate-200 text-left">{fault.title}</div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono">{fault.model}</span>
          <motion.svg
            className="w-5 h-5 text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-cyan-500/20"
          >
            <div className="p-6 space-y-6">
              {/* Description */}
              <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-700">
                <div className="text-xs text-cyan-500 uppercase tracking-wider mb-2">{t.description}</div>
                <div className="text-slate-300 leading-relaxed">{fault.description}</div>
              </div>

              {/* Symptoms */}
              <CollapsibleSection
                title={t.symptoms}
                icon="🔍"
                isOpen={expandedSections.has('symptoms')}
                onToggle={() => toggleSection('symptoms')}
              >
                <ul className="space-y-2">
                  {fault.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-cyan-500 mt-1">▸</span>
                      <span className="text-slate-300">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              {/* Possible Causes */}
              <CollapsibleSection
                title={t.possibleCauses}
                icon="⚙️"
                isOpen={expandedSections.has('causes')}
                onToggle={() => toggleSection('causes')}
              >
                <div className="space-y-3">
                  {fault.possibleCauses.map((cause, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          cause.likelihood === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          cause.likelihood === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {cause.likelihood} probability
                        </span>
                      </div>
                      <div className="text-slate-200 font-medium">{cause.cause}</div>
                      <div className="text-sm text-slate-500 mt-1">Verify: {cause.verification}</div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Diagnostic Steps */}
              <CollapsibleSection
                title={t.diagnosticSteps}
                icon="📋"
                isOpen={expandedSections.has('diagnostic')}
                onToggle={() => toggleSection('diagnostic')}
              >
                <ol className="space-y-3">
                  {fault.diagnosticSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-4 p-3 bg-slate-950/50 rounded-lg border border-slate-700">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-200">{step.action}</div>
                        <div className="text-sm text-green-400 mt-1">Expected: {step.expectedResult}</div>
                        {step.tools && step.tools.length > 0 && (
                          <div className="text-xs text-slate-500 mt-1">Tools: {step.tools.join(', ')}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </CollapsibleSection>

              {/* RESET PATHWAYS - KEY FEATURE */}
              <CollapsibleSection
                title={`🔄 ${t.resetPathways} - HOW TO CLEAR THIS FAULT`}
                icon="🔧"
                isOpen={expandedSections.has('reset')}
                onToggle={() => toggleSection('reset')}
                highlight={true}
              >
                <div className="space-y-4">
                  {fault.resetPathways.map((pathway, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          pathway.method === 'auto' ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
                          pathway.method === 'keypad' ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' :
                          pathway.method === 'software' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {pathway.method} reset
                        </span>
                        <span className="text-xs text-slate-400">
                          Firmware: {pathway.applicableFirmware.join(', ')}
                        </span>
                      </div>

                      {pathway.requiresCondition.length > 0 && (
                        <div className="flex items-center gap-2 mb-3 text-yellow-400 text-sm">
                          <span>⚠️</span>
                          <span>Required conditions: {pathway.requiresCondition.join(', ')}</span>
                        </div>
                      )}

                      {/* Step by step reset instructions */}
                      <ol className="space-y-3">
                        {pathway.steps.map((step, stepIdx) => (
                          <motion.li
                            key={stepIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: stepIdx * 0.1 }}
                            className="flex gap-3 items-start"
                          >
                            <div className="w-7 h-7 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {step.stepNumber}
                            </div>
                            <div className="flex-1">
                              <div className="text-slate-200 font-medium">{step.action}</div>
                              {step.keySequence && (
                                <div className="flex gap-2 mt-2">
                                  {step.keySequence.map((key, keyIdx) => (
                                    <span
                                      key={keyIdx}
                                      className="px-3 py-1 bg-slate-800 border border-cyan-500/50 rounded text-cyan-300 font-mono text-sm"
                                      style={{ boxShadow: '0 0 10px rgba(0,255,255,0.2)' }}
                                    >
                                      {key}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {step.menuPath && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                                  <span>Menu:</span>
                                  {step.menuPath.map((menu, menuIdx) => (
                                    <span key={menuIdx} className="flex items-center gap-1">
                                      {menuIdx > 0 && <span className="text-cyan-500">→</span>}
                                      <span className="text-cyan-300">{menu}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="text-sm text-green-400 mt-1">→ {step.expectedResponse}</div>
                            </div>
                          </motion.li>
                        ))}
                      </ol>

                      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <span className="text-green-400 text-sm font-medium">✓ Success: {pathway.successIndicator}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Solutions */}
              <CollapsibleSection
                title={t.solutions}
                icon="🛠️"
                isOpen={expandedSections.has('solutions')}
                onToggle={() => toggleSection('solutions')}
              >
                <div className="space-y-4">
                  {fault.solutions.map((solution, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          solution.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          solution.difficulty === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          solution.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {solution.difficulty}
                        </span>
                        <span className="text-xs text-slate-500">{solution.timeEstimate}</span>
                        <span className="text-xs text-slate-500">
                          Est. Cost: ${solution.estimatedCost.min}-${solution.estimatedCost.max}
                        </span>
                      </div>

                      <ol className="space-y-2 list-decimal list-inside text-slate-300">
                        {solution.procedureSteps.map((step, stepIdx) => (
                          <li key={stepIdx} className="pl-2">{step}</li>
                        ))}
                      </ol>

                      {solution.tools.length > 0 && (
                        <div className="mt-3 text-sm text-slate-500">
                          <span className="text-slate-400">Tools needed:</span> {solution.tools.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Safety Warnings */}
              {fault.safetyWarnings.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 font-medium mb-3">
                    <span className="text-xl">⚠️</span>
                    <span>{t.safetyWarnings}</span>
                  </div>
                  <ul className="space-y-2">
                    {fault.safetyWarnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-red-300 text-sm">
                        <span>•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions & Feedback */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-700">
                <motion.button
                  onClick={onSaveDiagnosis}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 text-sm font-medium"
                >
                  📁 Save to History
                </motion.button>

                {!feedbackGiven && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">{t.didItWork}</span>
                    <motion.button
                      onClick={() => { onFeedback(fault.id, 'yes'); setFeedbackGiven(true); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30 hover:bg-green-500/30 text-sm"
                    >
                      ✓ {t.yes}
                    </motion.button>
                    <motion.button
                      onClick={() => { onFeedback(fault.id, 'partial'); setFeedbackGiven(true); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30 hover:bg-yellow-500/30 text-sm"
                    >
                      ~ {t.partiallyWorked}
                    </motion.button>
                    <motion.button
                      onClick={() => { onFeedback(fault.id, 'no'); setFeedbackGiven(true); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30 hover:bg-red-500/30 text-sm"
                    >
                      ✗ {t.no}
                    </motion.button>
                  </div>
                )}

                {feedbackGiven && (
                  <span className="text-sm text-green-400">✓ {t.thankYou}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==================== COLLAPSIBLE SECTION ====================
function CollapsibleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  highlight = false,
}: {
  title: string;
  icon?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg overflow-hidden border ${highlight ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-700'}`}>
      <button
        onClick={onToggle}
        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
          highlight ? 'bg-cyan-500/10 hover:bg-cyan-500/20' : 'bg-slate-800/50 hover:bg-slate-800'
        }`}
      >
        <span className={`text-sm font-medium ${highlight ? 'text-cyan-300' : 'text-slate-300'}`}>
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </span>
        <motion.svg
          className={`w-4 h-4 ${highlight ? 'text-cyan-400' : 'text-slate-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-4 bg-slate-900/30"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
