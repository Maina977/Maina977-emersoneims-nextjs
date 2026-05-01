'use client';

/**
 * ULTRA-COMPREHENSIVE GENERATOR ORACLE SETTINGS PANEL
 * Complete configuration system with 100+ settings across 12 categories
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsPanelProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  offlineReady: boolean;
  totalCodes: number;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'Global' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', region: 'East Africa' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'Francophone Africa' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', region: 'MENA' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹', region: 'Ethiopia' },
  { code: 'so', name: 'Soomaali', flag: '🇸🇴', region: 'Somalia' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', region: 'Lusophone' },
  { code: 'zh', name: '中文', flag: '🇨🇳', region: 'China' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', region: 'India' },
];

const TIMEZONES = [
  { id: 'Africa/Nairobi', label: 'East Africa Time (EAT)', offset: '+03:00' },
  { id: 'Africa/Lagos', label: 'West Africa Time (WAT)', offset: '+01:00' },
  { id: 'Africa/Cairo', label: 'Egypt Time (EET)', offset: '+02:00' },
  { id: 'Africa/Johannesburg', label: 'South Africa Time (SAST)', offset: '+02:00' },
  { id: 'UTC', label: 'Coordinated Universal Time', offset: '+00:00' },
  { id: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: '+04:00' },
];

const CURRENCIES = [
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KES' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TZS' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'UGX' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RWF' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'ETB' },
];

export default function SettingsPanel({
  language,
  onLanguageChange,
  offlineReady,
  totalCodes,
}: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState<string>('general');
  const [settings, setSettings] = useState({
    // General
    language: language,
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'KES',
    theme: 'dark',
    soundEffects: true,
    hapticFeedback: true,
    autoSave: true,
    startupPanel: 'dashboard',

    // Units & Measurement
    temperatureUnit: 'celsius',
    pressureUnit: 'psi',
    voltageDisplay: 'line-to-neutral',
    frequencyStandard: '50hz',
    fuelUnit: 'liters',
    distanceUnit: 'km',
    powerUnit: 'kva',

    // Alerts & Notifications
    alertsEnabled: true,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    criticalAlertSound: true,
    warningAlertSound: false,
    infoAlertSound: false,
    alertVolume: 80,
    vibrationPattern: 'standard',
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '06:00',
    notificationEmail: '',
    notificationPhone: '',

    // Thresholds
    oilPressureWarning: 25,
    oilPressureCritical: 15,
    oilPressureShutdown: 10,
    coolantTempWarning: 95,
    coolantTempCritical: 105,
    coolantTempShutdown: 110,
    voltageWarningLow: 210,
    voltageWarningHigh: 250,
    voltageCriticalLow: 190,
    voltageCriticalHigh: 270,
    frequencyTolerance: 1.0,
    frequencyWarning: 2.0,
    frequencyCritical: 3.0,
    loadWarning: 80,
    loadCritical: 95,
    fuelLevelWarning: 25,
    fuelLevelCritical: 10,
    batteryVoltageWarning: 11.5,
    batteryVoltageCritical: 10.5,

    // Data Management
    autoBackup: true,
    backupFrequency: 'weekly',
    backupLocation: 'cloud',
    retainHistory: 365,
    exportFormat: 'pdf',
    compressionEnabled: true,
    encryptBackups: true,
    autoCleanup: true,
    cleanupAge: 90,

    // Connectivity
    autoConnect: true,
    connectionTimeout: 30,
    retryAttempts: 3,
    retryDelay: 5,
    modbusAddress: 1,
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    pollingInterval: 1000,
    tcpPort: 502,
    enableBluetooth: true,
    enableWifi: true,
    preferredConnection: 'auto',

    // Display
    dashboardLayout: 'standard',
    showGaugeLabels: true,
    animationsEnabled: true,
    highContrastMode: false,
    fontSize: 'medium',
    colorScheme: 'default',
    showGridLines: true,
    compactMode: false,
    showTechnicalDetails: true,
    defaultView: 'dashboard',
    gaugeStyle: 'modern',
    chartAnimations: true,

    // Diagnostics
    autoAnalysis: true,
    aiAssistance: true,
    showProbabilities: true,
    detailedSteps: true,
    includeSafetyWarnings: true,
    showPartNumbers: true,
    showEstimatedCosts: true,
    linkToManuals: true,
    voiceGuidance: false,
    autoSuggestParts: true,

    // Reports
    reportFormat: 'pdf',
    includeCharts: true,
    includePhotos: true,
    includeSignature: true,
    companyLogo: true,
    reportTemplate: 'standard',
    autoGenerateReports: false,
    reportRecipients: '',
    watermarkReports: true,

    // Privacy & Security
    shareAnonymousData: false,
    enableDiagnostics: true,
    requirePin: false,
    pinCode: '',
    autoLock: true,
    lockTimeout: 5,
    biometricAuth: false,
    encryptLocalData: true,
    clearOnUninstall: true,

    // Advanced
    debugMode: false,
    verboseLogging: false,
    developerMode: false,
    betaFeatures: false,
    performanceMode: 'balanced',
    cacheSize: 500,
    maxHistoryItems: 1000,
    enableTelemetry: false,
  });

  const updateSetting = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'language' && typeof value === 'string') {
      onLanguageChange(value);
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️', desc: 'Language, region, preferences' },
    { id: 'units', label: 'Units', icon: '📏', desc: 'Measurement units & display' },
    { id: 'alerts', label: 'Alerts', icon: '🔔', desc: 'Notifications & sounds' },
    { id: 'thresholds', label: 'Thresholds', icon: '🎚️', desc: 'Warning & critical levels' },
    { id: 'data', label: 'Data', icon: '💾', desc: 'Backup & storage' },
    { id: 'connectivity', label: 'Connectivity', icon: '🔌', desc: 'Connections & protocols' },
    { id: 'display', label: 'Display', icon: '🖥️', desc: 'Visual appearance' },
    { id: 'diagnostics', label: 'Diagnostics', icon: '🔬', desc: 'Analysis settings' },
    { id: 'reports', label: 'Reports', icon: '📄', desc: 'Report generation' },
    { id: 'privacy', label: 'Security', icon: '🔒', desc: 'Privacy & protection' },
    { id: 'advanced', label: 'Advanced', icon: '🛠️', desc: 'Developer options' },
    { id: 'about', label: 'About', icon: '❓', desc: 'Info & support' },
  ];

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generator-oracle-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToDefaults = () => {
    if (confirm('Reset all settings to default values? This cannot be undone.')) {
      window.location.reload();
    }
  };

  // Toggle component
  const Toggle = ({ value, onChange, disabled = false }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`w-14 h-7 rounded-full transition-colors ${value ? 'bg-cyan-500' : 'bg-slate-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow"
        animate={{ x: value ? 26 : 2 }}
      />
    </button>
  );

  // Setting Row component
  const SettingRow = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-medium">{label}</div>
          {desc && <div className="text-sm text-slate-500">{desc}</div>}
        </div>
        {children}
      </div>
    </div>
  );

  // Slider component
  const Slider = ({ value, onChange, min = 0, max = 100, step = 1, suffix = '' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; suffix?: string }) => (
    <div className="flex items-center gap-3 w-48">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
      <span className="text-cyan-400 font-medium w-16 text-right">{value}{suffix}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-3xl">⚙️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Settings & Configuration</h2>
            <p className="text-slate-400">Customize your Generator Oracle experience</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportSettings}
            className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
          >
            <span>📤</span> Export
          </button>
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-500'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <div>
                  <div className="font-medium">{section.label}</div>
                  <div className="text-xs text-slate-500">{section.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Status Cards */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${offlineReady ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
              <div>
                <div className="text-sm text-slate-400">Database Status</div>
                <div className={offlineReady ? 'text-green-400 font-medium' : 'text-amber-400'}>
                  {offlineReady ? `${totalCodes.toLocaleString()} codes` : 'Syncing...'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
            <div className="text-sm text-cyan-400 mb-1">Version</div>
            <div className="text-white font-bold">Generator Oracle v3.0</div>
            <div className="text-xs text-slate-400 mt-1">Build 2026.02.28</div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* GENERAL SETTINGS */}
            {activeSection === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">🌍 General Settings</h3>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Language / Lugha</label>
                  <div className="grid grid-cols-3 gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => updateSetting('language', lang.code)}
                        className={`p-3 rounded-lg text-left transition-all ${
                          settings.language === lang.code
                            ? 'bg-cyan-500/20 border-2 border-cyan-500'
                            : 'bg-slate-800 border-2 border-transparent hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{lang.flag}</span>
                          <div>
                            <div className="text-white font-medium">{lang.name}</div>
                            <div className="text-xs text-slate-500">{lang.region}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => updateSetting('timezone', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    >
                      {TIMEZONES.map(tz => (
                        <option key={tz.id} value={tz.id}>{tz.label} ({tz.offset})</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSetting('currency', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    >
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>{c.symbol} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Date Format</label>
                    <div className="flex gap-2">
                      {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => updateSetting('dateFormat', fmt)}
                          className={`flex-1 py-2 rounded-lg text-sm ${
                            settings.dateFormat === fmt ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Time Format</label>
                    <div className="flex gap-2">
                      {[{ id: '24h', label: '24 Hour' }, { id: '12h', label: '12 Hour' }].map(fmt => (
                        <button
                          key={fmt.id}
                          onClick={() => updateSetting('timeFormat', fmt.id)}
                          className={`flex-1 py-2 rounded-lg ${
                            settings.timeFormat === fmt.id ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <SettingRow label="Sound Effects" desc="Play audio feedback for actions">
                  <Toggle value={settings.soundEffects} onChange={(v) => updateSetting('soundEffects', v)} />
                </SettingRow>

                <SettingRow label="Haptic Feedback" desc="Vibration on mobile devices">
                  <Toggle value={settings.hapticFeedback} onChange={(v) => updateSetting('hapticFeedback', v)} />
                </SettingRow>

                <SettingRow label="Auto-Save" desc="Automatically save diagnostic sessions">
                  <Toggle value={settings.autoSave} onChange={(v) => updateSetting('autoSave', v)} />
                </SettingRow>
              </motion.div>
            )}

            {/* UNITS SETTINGS */}
            {activeSection === 'units' && (
              <motion.div
                key="units"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">📏 Units & Measurement</h3>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Temperature Unit</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'celsius', label: '°C Celsius', example: '95°C' },
                      { id: 'fahrenheit', label: '°F Fahrenheit', example: '203°F' },
                    ].map(unit => (
                      <button
                        key={unit.id}
                        onClick={() => updateSetting('temperatureUnit', unit.id)}
                        className={`flex-1 p-4 rounded-lg transition-colors ${
                          settings.temperatureUnit === unit.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        <div className="font-medium">{unit.label}</div>
                        <div className="text-sm opacity-70">e.g. {unit.example}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Pressure Unit</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'psi', label: 'PSI', example: '45 PSI' },
                      { id: 'bar', label: 'Bar', example: '3.1 Bar' },
                      { id: 'kpa', label: 'kPa', example: '310 kPa' },
                    ].map(unit => (
                      <button
                        key={unit.id}
                        onClick={() => updateSetting('pressureUnit', unit.id)}
                        className={`flex-1 p-4 rounded-lg transition-colors ${
                          settings.pressureUnit === unit.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        <div className="font-medium">{unit.label}</div>
                        <div className="text-sm opacity-70">{unit.example}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Frequency Standard</label>
                  <div className="flex gap-2">
                    {[
                      { id: '50hz', label: '50 Hz', desc: 'Africa, Europe, Asia' },
                      { id: '60hz', label: '60 Hz', desc: 'Americas, Japan' },
                    ].map(std => (
                      <button
                        key={std.id}
                        onClick={() => updateSetting('frequencyStandard', std.id)}
                        className={`flex-1 p-4 rounded-lg transition-colors ${
                          settings.frequencyStandard === std.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        <div className="font-medium">{std.label}</div>
                        <div className="text-sm opacity-70">{std.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Voltage Display</label>
                  <select
                    value={settings.voltageDisplay}
                    onChange={(e) => updateSetting('voltageDisplay', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="line-to-neutral">Line-to-Neutral (L-N) - 240V</option>
                    <option value="line-to-line">Line-to-Line (L-L) - 415V</option>
                    <option value="both">Show Both</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Fuel Volume</label>
                    <div className="flex gap-2">
                      {['liters', 'gallons'].map(unit => (
                        <button
                          key={unit}
                          onClick={() => updateSetting('fuelUnit', unit)}
                          className={`flex-1 py-2 rounded-lg capitalize ${
                            settings.fuelUnit === unit ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Power Display</label>
                    <div className="flex gap-2">
                      {['kva', 'kw'].map(unit => (
                        <button
                          key={unit}
                          onClick={() => updateSetting('powerUnit', unit)}
                          className={`flex-1 py-2 rounded-lg uppercase ${
                            settings.powerUnit === unit ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ALERTS SETTINGS */}
            {activeSection === 'alerts' && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">🔔 Alerts & Notifications</h3>

                <SettingRow label="Enable All Alerts" desc="Master switch for all notifications">
                  <Toggle value={settings.alertsEnabled} onChange={(v) => updateSetting('alertsEnabled', v)} />
                </SettingRow>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-white font-medium mb-4">Notification Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📱</span>
                        <div>
                          <div className="text-white">Push Notifications</div>
                          <div className="text-xs text-slate-500">In-app and device alerts</div>
                        </div>
                      </div>
                      <Toggle value={settings.pushNotifications} onChange={(v) => updateSetting('pushNotifications', v)} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📧</span>
                        <div>
                          <div className="text-white">Email Notifications</div>
                          <div className="text-xs text-slate-500">Receive alerts via email</div>
                        </div>
                      </div>
                      <Toggle value={settings.emailNotifications} onChange={(v) => updateSetting('emailNotifications', v)} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💬</span>
                        <div>
                          <div className="text-white">SMS Notifications</div>
                          <div className="text-xs text-slate-500">Critical alerts via SMS</div>
                        </div>
                      </div>
                      <Toggle value={settings.smsNotifications} onChange={(v) => updateSetting('smsNotifications', v)} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-white font-medium mb-4">Alert Sounds</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400">🚨 Shutdown/Critical</span>
                      <Toggle value={settings.criticalAlertSound} onChange={(v) => updateSetting('criticalAlertSound', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400">⚠️ Warning</span>
                      <Toggle value={settings.warningAlertSound} onChange={(v) => updateSetting('warningAlertSound', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400">ℹ️ Information</span>
                      <Toggle value={settings.infoAlertSound} onChange={(v) => updateSetting('infoAlertSound', v)} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-3">Alert Volume</label>
                  <Slider
                    value={settings.alertVolume}
                    onChange={(v) => updateSetting('alertVolume', v)}
                    min={0}
                    max={100}
                    suffix="%"
                  />
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-amber-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-amber-400 font-medium">🌙 Quiet Hours</div>
                      <div className="text-sm text-slate-500">Silence non-critical alerts during set hours</div>
                    </div>
                    <Toggle value={settings.quietHoursEnabled} onChange={(v) => updateSetting('quietHoursEnabled', v)} />
                  </div>
                  {settings.quietHoursEnabled && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={settings.quietHoursStart}
                          onChange={(e) => updateSetting('quietHoursStart', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">End Time</label>
                        <input
                          type="time"
                          value={settings.quietHoursEnd}
                          onChange={(e) => updateSetting('quietHoursEnd', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* THRESHOLDS SETTINGS */}
            {activeSection === 'thresholds' && (
              <motion.div
                key="thresholds"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">🎚️ Alert Thresholds</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Oil Pressure */}
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-amber-500/30">
                    <h4 className="text-amber-400 font-medium mb-4">🛢️ Oil Pressure (PSI)</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-amber-400">Warning</span>
                          <span className="text-white">&lt; {settings.oilPressureWarning} PSI</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={50}
                          value={settings.oilPressureWarning}
                          onChange={(e) => updateSetting('oilPressureWarning', Number(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg accent-amber-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-orange-400">Critical</span>
                          <span className="text-white">&lt; {settings.oilPressureCritical} PSI</span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={30}
                          value={settings.oilPressureCritical}
                          onChange={(e) => updateSetting('oilPressureCritical', Number(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg accent-orange-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-red-400">Shutdown</span>
                          <span className="text-white">&lt; {settings.oilPressureShutdown} PSI</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={20}
                          value={settings.oilPressureShutdown}
                          onChange={(e) => updateSetting('oilPressureShutdown', Number(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg accent-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coolant Temperature */}
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-red-500/30">
                    <h4 className="text-red-400 font-medium mb-4">🌡️ Coolant Temp (°C)</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-amber-400">Warning</span>
                          <span className="text-white">&gt; {settings.coolantTempWarning}°C</span>
                        </div>
                        <input
                          type="range"
                          min={80}
                          max={100}
                          value={settings.coolantTempWarning}
                          onChange={(e) => updateSetting('coolantTempWarning', Number(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg accent-amber-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-orange-400">Critical</span>
                          <span className="text-white">&gt; {settings.coolantTempCritical}°C</span>
                        </div>
                        <input
                          type="range"
                          min={95}
                          max={115}
                          value={settings.coolantTempCritical}
                          onChange={(e) => updateSetting('coolantTempCritical', Number(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg accent-orange-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-red-400">Shutdown</span>
                          <span className="text-white">&gt; {settings.coolantTempShutdown}°C</span>
                        </div>
                        <input
                          type="range"
                          min={100}
                          max={120}
                          value={settings.coolantTempShutdown}
                          onChange={(e) => updateSetting('coolantTempShutdown', Number(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg accent-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Voltage */}
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/30">
                    <h4 className="text-blue-400 font-medium mb-4">⚡ Voltage (V)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Low Warning</label>
                        <input
                          type="number"
                          value={settings.voltageWarningLow}
                          onChange={(e) => updateSetting('voltageWarningLow', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">High Warning</label>
                        <input
                          type="number"
                          value={settings.voltageWarningHigh}
                          onChange={(e) => updateSetting('voltageWarningHigh', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Low Critical</label>
                        <input
                          type="number"
                          value={settings.voltageCriticalLow}
                          onChange={(e) => updateSetting('voltageCriticalLow', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">High Critical</label>
                        <input
                          type="number"
                          value={settings.voltageCriticalHigh}
                          onChange={(e) => updateSetting('voltageCriticalHigh', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-green-500/30">
                    <h4 className="text-green-400 font-medium mb-4">📊 Frequency (Hz)</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Tolerance</span>
                          <span className="text-white">±{settings.frequencyTolerance} Hz</span>
                        </div>
                        <input
                          type="range"
                          min={0.5}
                          max={3}
                          step={0.1}
                          value={settings.frequencyTolerance}
                          onChange={(e) => updateSetting('frequencyTolerance', Number(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg accent-green-500"
                        />
                      </div>
                      <div className="text-xs text-slate-500 p-2 bg-slate-800/50 rounded">
                        Normal range: {50 - settings.frequencyTolerance} - {50 + settings.frequencyTolerance} Hz
                      </div>
                    </div>
                  </div>
                </div>

                {/* Load & Fuel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/30">
                    <h4 className="text-purple-400 font-medium mb-4">📈 Load (%)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Warning Level</label>
                        <Slider value={settings.loadWarning} onChange={(v) => updateSetting('loadWarning', v)} suffix="%" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Critical Level</label>
                        <Slider value={settings.loadCritical} onChange={(v) => updateSetting('loadCritical', v)} suffix="%" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/50 rounded-xl border border-cyan-500/30">
                    <h4 className="text-cyan-400 font-medium mb-4">⛽ Fuel Level (%)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Warning Level</label>
                        <Slider value={settings.fuelLevelWarning} onChange={(v) => updateSetting('fuelLevelWarning', v)} suffix="%" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Critical Level</label>
                        <Slider value={settings.fuelLevelCritical} onChange={(v) => updateSetting('fuelLevelCritical', v)} suffix="%" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DATA MANAGEMENT */}
            {activeSection === 'data' && (
              <motion.div
                key="data"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">💾 Data Management</h3>

                <SettingRow label="Automatic Backup" desc="Back up data automatically">
                  <Toggle value={settings.autoBackup} onChange={(v) => updateSetting('autoBackup', v)} />
                </SettingRow>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Backup Frequency</label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => updateSetting('backupFrequency', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Backup Location</label>
                    <select
                      value={settings.backupLocation}
                      onChange={(e) => updateSetting('backupLocation', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="cloud">Cloud Storage</option>
                      <option value="local">Local Device</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Retain History</label>
                  <select
                    value={settings.retainHistory}
                    onChange={(e) => updateSetting('retainHistory', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  >
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>6 months</option>
                    <option value={365}>1 year</option>
                    <option value={730}>2 years</option>
                    <option value={-1}>Forever</option>
                  </select>
                </div>

                <SettingRow label="Encrypt Backups" desc="Secure backup files with encryption">
                  <Toggle value={settings.encryptBackups} onChange={(v) => updateSetting('encryptBackups', v)} />
                </SettingRow>

                <SettingRow label="Compress Data" desc="Reduce storage space usage">
                  <Toggle value={settings.compressionEnabled} onChange={(v) => updateSetting('compressionEnabled', v)} />
                </SettingRow>

                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/30">
                    <div className="text-2xl mb-2">📥</div>
                    <div className="font-medium">Import Data</div>
                  </button>
                  <button className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30">
                    <div className="text-2xl mb-2">📤</div>
                    <div className="font-medium">Export All</div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* CONNECTIVITY */}
            {activeSection === 'connectivity' && (
              <motion.div
                key="connectivity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">🔌 Connectivity Settings</h3>

                <SettingRow label="Auto-Connect" desc="Connect to known devices automatically">
                  <Toggle value={settings.autoConnect} onChange={(v) => updateSetting('autoConnect', v)} />
                </SettingRow>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Timeout (sec)</label>
                    <input
                      type="number"
                      value={settings.connectionTimeout}
                      onChange={(e) => updateSetting('connectionTimeout', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Retry Attempts</label>
                    <input
                      type="number"
                      value={settings.retryAttempts}
                      onChange={(e) => updateSetting('retryAttempts', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Poll Interval (ms)</label>
                    <input
                      type="number"
                      value={settings.pollingInterval}
                      onChange={(e) => updateSetting('pollingInterval', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/30">
                  <h4 className="text-blue-400 font-medium mb-4">📡 Modbus RTU Settings</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Slave Address</label>
                      <input
                        type="number"
                        value={settings.modbusAddress}
                        onChange={(e) => updateSetting('modbusAddress', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Baud Rate</label>
                      <select
                        value={settings.baudRate}
                        onChange={(e) => updateSetting('baudRate', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                      >
                        {[9600, 19200, 38400, 57600, 115200].map(rate => (
                          <option key={rate} value={rate}>{rate}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Data Bits</label>
                      <select
                        value={settings.dataBits}
                        onChange={(e) => updateSetting('dataBits', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                      >
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Parity</label>
                      <select
                        value={settings.parity}
                        onChange={(e) => updateSetting('parity', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                      >
                        <option value="none">None</option>
                        <option value="even">Even</option>
                        <option value="odd">Odd</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-white font-medium mb-4">Wireless</h4>
                  <div className="space-y-3">
                    <SettingRow label="Bluetooth" desc="Connect via Bluetooth">
                      <Toggle value={settings.enableBluetooth} onChange={(v) => updateSetting('enableBluetooth', v)} />
                    </SettingRow>
                    <SettingRow label="WiFi" desc="Connect via WiFi network">
                      <Toggle value={settings.enableWifi} onChange={(v) => updateSetting('enableWifi', v)} />
                    </SettingRow>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DISPLAY */}
            {activeSection === 'display' && (
              <motion.div
                key="display"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">🖥️ Display Options</h3>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Dashboard Layout</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['standard', 'compact', 'detailed'].map(layout => (
                      <button
                        key={layout}
                        onClick={() => updateSetting('dashboardLayout', layout)}
                        className={`p-4 rounded-lg capitalize ${
                          settings.dashboardLayout === layout
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Font Size</label>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large', 'extra-large'].map(size => (
                      <button
                        key={size}
                        onClick={() => updateSetting('fontSize', size)}
                        className={`flex-1 py-3 rounded-lg capitalize ${
                          settings.fontSize === size
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {size.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Gauge Style</label>
                  <div className="flex gap-2">
                    {['modern', 'classic', 'minimal'].map(style => (
                      <button
                        key={style}
                        onClick={() => updateSetting('gaugeStyle', style)}
                        className={`flex-1 py-3 rounded-lg capitalize ${
                          settings.gaugeStyle === style
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <SettingRow label="Show Gauge Labels" desc="Display labels on gauges">
                  <Toggle value={settings.showGaugeLabels} onChange={(v) => updateSetting('showGaugeLabels', v)} />
                </SettingRow>

                <SettingRow label="Animations" desc="Enable smooth transitions">
                  <Toggle value={settings.animationsEnabled} onChange={(v) => updateSetting('animationsEnabled', v)} />
                </SettingRow>

                <SettingRow label="High Contrast Mode" desc="Improved visibility">
                  <Toggle value={settings.highContrastMode} onChange={(v) => updateSetting('highContrastMode', v)} />
                </SettingRow>

                <SettingRow label="Show Grid Lines" desc="Display grid on charts">
                  <Toggle value={settings.showGridLines} onChange={(v) => updateSetting('showGridLines', v)} />
                </SettingRow>

                <SettingRow label="Compact Mode" desc="Reduce spacing for more content">
                  <Toggle value={settings.compactMode} onChange={(v) => updateSetting('compactMode', v)} />
                </SettingRow>
              </motion.div>
            )}

            {/* DIAGNOSTICS */}
            {activeSection === 'diagnostics' && (
              <motion.div
                key="diagnostics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">🔬 Diagnostic Settings</h3>

                <SettingRow label="Auto Analysis" desc="Automatically analyze fault codes">
                  <Toggle value={settings.autoAnalysis} onChange={(v) => updateSetting('autoAnalysis', v)} />
                </SettingRow>

                <SettingRow label="AI Assistance" desc="Get AI-powered diagnostic suggestions">
                  <Toggle value={settings.aiAssistance} onChange={(v) => updateSetting('aiAssistance', v)} />
                </SettingRow>

                <SettingRow label="Show Probabilities" desc="Display confidence percentages">
                  <Toggle value={settings.showProbabilities} onChange={(v) => updateSetting('showProbabilities', v)} />
                </SettingRow>

                <SettingRow label="Detailed Steps" desc="Show step-by-step repair procedures">
                  <Toggle value={settings.detailedSteps} onChange={(v) => updateSetting('detailedSteps', v)} />
                </SettingRow>

                <SettingRow label="Safety Warnings" desc="Include safety precautions">
                  <Toggle value={settings.includeSafetyWarnings} onChange={(v) => updateSetting('includeSafetyWarnings', v)} />
                </SettingRow>

                <SettingRow label="Show Part Numbers" desc="Display OEM part numbers">
                  <Toggle value={settings.showPartNumbers} onChange={(v) => updateSetting('showPartNumbers', v)} />
                </SettingRow>

                <SettingRow label="Cost Estimates" desc="Show estimated repair costs">
                  <Toggle value={settings.showEstimatedCosts} onChange={(v) => updateSetting('showEstimatedCosts', v)} />
                </SettingRow>

                <SettingRow label="Link to Manuals" desc="Show links to service manuals">
                  <Toggle value={settings.linkToManuals} onChange={(v) => updateSetting('linkToManuals', v)} />
                </SettingRow>

                <SettingRow label="Voice Guidance" desc="Audio instructions (accessibility)">
                  <Toggle value={settings.voiceGuidance} onChange={(v) => updateSetting('voiceGuidance', v)} />
                </SettingRow>
              </motion.div>
            )}

            {/* REPORTS */}
            {activeSection === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">📄 Report Settings</h3>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Default Format</label>
                  <div className="flex gap-2">
                    {['pdf', 'excel', 'word', 'html'].map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => updateSetting('reportFormat', fmt)}
                        className={`flex-1 py-3 rounded-lg uppercase ${
                          settings.reportFormat === fmt
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Report Template</label>
                  <select
                    value={settings.reportTemplate}
                    onChange={(e) => updateSetting('reportTemplate', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="standard">Standard Report</option>
                    <option value="detailed">Detailed Technical Report</option>
                    <option value="summary">Executive Summary</option>
                    <option value="maintenance">Maintenance Log</option>
                  </select>
                </div>

                <SettingRow label="Include Charts" desc="Add visual charts to reports">
                  <Toggle value={settings.includeCharts} onChange={(v) => updateSetting('includeCharts', v)} />
                </SettingRow>

                <SettingRow label="Include Photos" desc="Attach diagnostic photos">
                  <Toggle value={settings.includePhotos} onChange={(v) => updateSetting('includePhotos', v)} />
                </SettingRow>

                <SettingRow label="Digital Signature" desc="Add signature field">
                  <Toggle value={settings.includeSignature} onChange={(v) => updateSetting('includeSignature', v)} />
                </SettingRow>

                <SettingRow label="Company Logo" desc="Include your company logo">
                  <Toggle value={settings.companyLogo} onChange={(v) => updateSetting('companyLogo', v)} />
                </SettingRow>

                <SettingRow label="Watermark" desc="Add watermark to reports">
                  <Toggle value={settings.watermarkReports} onChange={(v) => updateSetting('watermarkReports', v)} />
                </SettingRow>
              </motion.div>
            )}

            {/* PRIVACY & SECURITY */}
            {activeSection === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">🔒 Privacy & Security</h3>

                <SettingRow label="Require PIN" desc="Lock app with PIN code">
                  <Toggle value={settings.requirePin} onChange={(v) => updateSetting('requirePin', v)} />
                </SettingRow>

                {settings.requirePin && (
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">PIN Code</label>
                    <input
                      type="password"
                      maxLength={6}
                      value={settings.pinCode}
                      onChange={(e) => updateSetting('pinCode', e.target.value)}
                      placeholder="Enter 4-6 digit PIN"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                )}

                <SettingRow label="Biometric Authentication" desc="Use fingerprint or face">
                  <Toggle value={settings.biometricAuth} onChange={(v) => updateSetting('biometricAuth', v)} />
                </SettingRow>

                <SettingRow label="Auto-Lock" desc="Lock after inactivity">
                  <Toggle value={settings.autoLock} onChange={(v) => updateSetting('autoLock', v)} />
                </SettingRow>

                {settings.autoLock && (
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Lock Timeout (minutes)</label>
                    <Slider value={settings.lockTimeout} onChange={(v) => updateSetting('lockTimeout', v)} min={1} max={30} suffix=" min" />
                  </div>
                )}

                <SettingRow label="Encrypt Local Data" desc="Secure stored data">
                  <Toggle value={settings.encryptLocalData} onChange={(v) => updateSetting('encryptLocalData', v)} />
                </SettingRow>

                <SettingRow label="Share Anonymous Data" desc="Help improve the app">
                  <Toggle value={settings.shareAnonymousData} onChange={(v) => updateSetting('shareAnonymousData', v)} />
                </SettingRow>

                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <h4 className="text-red-400 font-medium mb-3">🗑️ Danger Zone</h4>
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700">
                      Clear Diagnostic History
                    </button>
                    <button className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700">
                      Clear Cache
                    </button>
                    <button className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                      Delete All Data
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ADVANCED */}
            {activeSection === 'advanced' && (
              <motion.div
                key="advanced"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">🛠️ Advanced Settings</h3>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <p className="text-amber-400 text-sm">⚠️ These settings are for advanced users only.</p>
                </div>

                <SettingRow label="Debug Mode" desc="Enable debug logging">
                  <Toggle value={settings.debugMode} onChange={(v) => updateSetting('debugMode', v)} />
                </SettingRow>

                <SettingRow label="Verbose Logging" desc="Detailed system logs">
                  <Toggle value={settings.verboseLogging} onChange={(v) => updateSetting('verboseLogging', v)} />
                </SettingRow>

                <SettingRow label="Developer Mode" desc="Access developer tools">
                  <Toggle value={settings.developerMode} onChange={(v) => updateSetting('developerMode', v)} />
                </SettingRow>

                <SettingRow label="Beta Features" desc="Try experimental features">
                  <Toggle value={settings.betaFeatures} onChange={(v) => updateSetting('betaFeatures', v)} />
                </SettingRow>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Performance Mode</label>
                  <select
                    value={settings.performanceMode}
                    onChange={(e) => updateSetting('performanceMode', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="battery-saver">Battery Saver</option>
                    <option value="balanced">Balanced</option>
                    <option value="performance">High Performance</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Cache Size (MB)</label>
                  <Slider value={settings.cacheSize} onChange={(v) => updateSetting('cacheSize', v)} min={100} max={2000} suffix=" MB" />
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Max History Items</label>
                  <Slider value={settings.maxHistoryItems} onChange={(v) => updateSetting('maxHistoryItems', v)} min={100} max={5000} suffix="" />
                </div>
              </motion.div>
            )}

            {/* ABOUT */}
            {activeSection === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">❓ About Generator Oracle</h3>

                <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <span className="text-5xl">🔮</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Generator Oracle</h3>
                      <p className="text-cyan-400 font-medium">Version 3.0 Enterprise</p>
                      <p className="text-sm text-slate-400">Build 2026.02.28</p>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-6">
                    The world&apos;s most comprehensive generator diagnostic system. Supporting 10+ major controller brands
                    with 400,000+ fault codes and AI-powered troubleshooting.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">{totalCodes.toLocaleString()}+</div>
                      <div className="text-xs text-slate-400">Fault Codes</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">10+</div>
                      <div className="text-xs text-slate-400">Controllers</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">9</div>
                      <div className="text-xs text-slate-400">Languages</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">FREE</div>
                      <div className="text-xs text-slate-400">Until Apr 2026</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎁</span>
                    <h4 className="text-amber-400 font-bold">Free Premium Access</h4>
                  </div>
                  <p className="text-slate-300">
                    Full access until <strong className="text-white">April 1st, 2026</strong>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    After trial: KES 20,000/year | USD 150/year
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-white font-medium mb-4">📞 Support Contacts</h4>
                  <div className="space-y-3">
                    <a href="tel:+254782914717" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg text-blue-400 hover:bg-slate-800">
                      <span className="text-xl">📱</span>
                      <div>
                        <div className="font-medium">+254 782 914 717</div>
                        <div className="text-xs text-slate-500">Call Support</div>
                      </div>
                    </a>
                    <a href="https://wa.me/254768860665" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg text-green-400 hover:bg-slate-800">
                      <span className="text-xl">💬</span>
                      <div>
                        <div className="font-medium">WhatsApp Support</div>
                        <div className="text-xs text-slate-500">Chat with us</div>
                      </div>
                    </a>
                    <a href="mailto:support@emersoneims.com" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg text-cyan-400 hover:bg-slate-800">
                      <span className="text-xl">📧</span>
                      <div>
                        <div className="font-medium">support@emersoneims.com</div>
                        <div className="text-xs text-slate-500">Email Support</div>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-white font-medium mb-3">Legal</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">
                      Terms of Service
                    </button>
                    <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">
                      Privacy Policy
                    </button>
                    <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">
                      Licenses
                    </button>
                  </div>
                </div>

                <div className="text-center text-slate-500 text-sm py-4">
                  © 2026 Emerson EIMS. All rights reserved.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
