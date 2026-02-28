'use client';

/**
 * COMPREHENSIVE GENERATOR ORACLE SETTINGS PANEL
 * Complete configuration system for all diagnostic preferences
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsPanelProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  offlineReady: boolean;
  totalCodes: number;
}

// Supported languages
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
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
    theme: 'dark',
    soundEffects: true,
    hapticFeedback: true,
    autoSave: true,

    // Units
    temperatureUnit: 'celsius',
    pressureUnit: 'psi',
    voltageDisplay: 'line-to-neutral',

    // Alerts & Thresholds
    alertsEnabled: true,
    criticalAlertSound: true,
    warningAlertSound: false,
    oilPressureWarning: 25,
    oilPressureCritical: 15,
    coolantTempWarning: 95,
    coolantTempCritical: 105,
    voltageWarningLow: 210,
    voltageWarningHigh: 250,
    frequencyTolerance: 1.0,

    // Data Management
    autoBackup: true,
    backupFrequency: 'weekly',
    retainHistory: 90,
    exportFormat: 'pdf',

    // Connectivity
    autoConnect: true,
    connectionTimeout: 30,
    retryAttempts: 3,
    modbusAddress: 1,
    baudRate: 9600,

    // Display
    dashboardLayout: 'standard',
    showGaugeLabels: true,
    animationsEnabled: true,
    highContrastMode: false,
    fontSize: 'medium',

    // Privacy
    shareAnonymousData: false,
    enableDiagnostics: true,
  });

  const updateSetting = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'language' && typeof value === 'string') {
      onLanguageChange(value);
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'units', label: 'Units & Display', icon: '📏' },
    { id: 'alerts', label: 'Alerts & Thresholds', icon: '🚨' },
    { id: 'data', label: 'Data Management', icon: '💾' },
    { id: 'connectivity', label: 'Connectivity', icon: '🔌' },
    { id: 'display', label: 'Display Options', icon: '🖥️' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'about', label: 'About & Support', icon: '❓' },
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
      setSettings({
        language: 'en',
        theme: 'dark',
        soundEffects: true,
        hapticFeedback: true,
        autoSave: true,
        temperatureUnit: 'celsius',
        pressureUnit: 'psi',
        voltageDisplay: 'line-to-neutral',
        alertsEnabled: true,
        criticalAlertSound: true,
        warningAlertSound: false,
        oilPressureWarning: 25,
        oilPressureCritical: 15,
        coolantTempWarning: 95,
        coolantTempCritical: 105,
        voltageWarningLow: 210,
        voltageWarningHigh: 250,
        frequencyTolerance: 1.0,
        autoBackup: true,
        backupFrequency: 'weekly',
        retainHistory: 90,
        exportFormat: 'pdf',
        autoConnect: true,
        connectionTimeout: 30,
        retryAttempts: 3,
        modbusAddress: 1,
        baudRate: 9600,
        dashboardLayout: 'standard',
        showGaugeLabels: true,
        animationsEnabled: true,
        highContrastMode: false,
        fontSize: 'medium',
        shareAnonymousData: false,
        enableDiagnostics: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
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
            className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Export Settings
          </button>
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
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
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {/* Offline Status */}
          <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${offlineReady ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
              <div>
                <div className="text-sm text-slate-400">Offline Database</div>
                <div className={offlineReady ? 'text-green-400 font-medium' : 'text-amber-400'}>
                  {offlineReady ? `${totalCodes.toLocaleString()} codes ready` : 'Syncing...'}
                </div>
              </div>
            </div>
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
                <h3 className="text-lg font-bold text-white mb-4">General Settings</h3>

                {/* Language */}
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Language / Lugha / Langue</label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Toggles */}
                {[
                  { key: 'soundEffects', label: 'Sound Effects', desc: 'Play audio feedback for actions and alerts' },
                  { key: 'hapticFeedback', label: 'Haptic Feedback', desc: 'Vibration feedback on mobile devices' },
                  { key: 'autoSave', label: 'Auto-Save', desc: 'Automatically save diagnostic sessions' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{label}</div>
                        <div className="text-sm text-slate-500">{desc}</div>
                      </div>
                      <button
                        onClick={() => updateSetting(key, !settings[key as keyof typeof settings])}
                        className={`w-14 h-7 rounded-full transition-colors ${
                          settings[key as keyof typeof settings] ? 'bg-cyan-500' : 'bg-slate-600'
                        }`}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full shadow"
                          animate={{ x: settings[key as keyof typeof settings] ? 26 : 2 }}
                        />
                      </button>
                    </div>
                  </div>
                ))}
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
                <h3 className="text-lg font-bold text-white mb-4">Units & Measurement</h3>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Temperature Unit</label>
                  <div className="flex gap-2">
                    {['celsius', 'fahrenheit'].map((unit) => (
                      <button
                        key={unit}
                        onClick={() => updateSetting('temperatureUnit', unit)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                          settings.temperatureUnit === unit
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {unit === 'celsius' ? '°C Celsius' : '°F Fahrenheit'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Pressure Unit</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'psi', label: 'PSI' },
                      { id: 'bar', label: 'Bar' },
                      { id: 'kpa', label: 'kPa' },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => updateSetting('pressureUnit', id)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                          settings.pressureUnit === id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {label}
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
                    <option value="line-to-neutral">Line-to-Neutral (L-N)</option>
                    <option value="line-to-line">Line-to-Line (L-L)</option>
                    <option value="both">Show Both</option>
                  </select>
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
                <h3 className="text-lg font-bold text-white mb-4">Alerts & Thresholds</h3>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-white font-medium">Enable Alerts</div>
                      <div className="text-sm text-slate-500">Receive notifications for parameter violations</div>
                    </div>
                    <button
                      onClick={() => updateSetting('alertsEnabled', !settings.alertsEnabled)}
                      className={`w-14 h-7 rounded-full transition-colors ${
                        settings.alertsEnabled ? 'bg-cyan-500' : 'bg-slate-600'
                      }`}
                    >
                      <motion.div
                        className="w-6 h-6 bg-white rounded-full shadow"
                        animate={{ x: settings.alertsEnabled ? 26 : 2 }}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Oil Pressure Thresholds */}
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-amber-500/30">
                    <h4 className="text-amber-400 font-medium mb-3">🛢️ Oil Pressure (PSI)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Warning Level</label>
                        <input
                          type="number"
                          value={settings.oilPressureWarning}
                          onChange={(e) => updateSetting('oilPressureWarning', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Critical Level</label>
                        <input
                          type="number"
                          value={settings.oilPressureCritical}
                          onChange={(e) => updateSetting('oilPressureCritical', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coolant Temp Thresholds */}
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-red-500/30">
                    <h4 className="text-red-400 font-medium mb-3">🌡️ Coolant Temperature (°C)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Warning Level</label>
                        <input
                          type="number"
                          value={settings.coolantTempWarning}
                          onChange={(e) => updateSetting('coolantTempWarning', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Critical Level</label>
                        <input
                          type="number"
                          value={settings.coolantTempCritical}
                          onChange={(e) => updateSetting('coolantTempCritical', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Voltage Thresholds */}
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/30">
                    <h4 className="text-blue-400 font-medium mb-3">⚡ Voltage Warning (V)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Low Warning</label>
                        <input
                          type="number"
                          value={settings.voltageWarningLow}
                          onChange={(e) => updateSetting('voltageWarningLow', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">High Warning</label>
                        <input
                          type="number"
                          value={settings.voltageWarningHigh}
                          onChange={(e) => updateSetting('voltageWarningHigh', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Frequency Tolerance */}
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-green-500/30">
                    <h4 className="text-green-400 font-medium mb-3">📊 Frequency Tolerance (Hz)</h4>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Tolerance from 50Hz</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.frequencyTolerance}
                        onChange={(e) => updateSetting('frequencyTolerance', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                      />
                      <div className="text-xs text-slate-500 mt-1">
                        Alert when frequency outside {50 - settings.frequencyTolerance}Hz - {50 + settings.frequencyTolerance}Hz
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
                <h3 className="text-lg font-bold text-white mb-4">Data Management</h3>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Automatic Backup</div>
                      <div className="text-sm text-slate-500">Back up diagnostic history automatically</div>
                    </div>
                    <button
                      onClick={() => updateSetting('autoBackup', !settings.autoBackup)}
                      className={`w-14 h-7 rounded-full transition-colors ${
                        settings.autoBackup ? 'bg-cyan-500' : 'bg-slate-600'
                      }`}
                    >
                      <motion.div
                        className="w-6 h-6 bg-white rounded-full shadow"
                        animate={{ x: settings.autoBackup ? 26 : 2 }}
                      />
                    </button>
                  </div>
                </div>

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
                  <label className="block text-sm text-slate-400 mb-2">Retain History (Days)</label>
                  <select
                    value={settings.retainHistory}
                    onChange={(e) => updateSetting('retainHistory', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>1 year</option>
                    <option value={-1}>Forever</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Default Export Format</label>
                  <div className="flex gap-2">
                    {['pdf', 'csv', 'json'].map((format) => (
                      <button
                        key={format}
                        onClick={() => updateSetting('exportFormat', format)}
                        className={`flex-1 py-3 rounded-lg font-medium uppercase transition-colors ${
                          settings.exportFormat === format
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-colors">
                    <div className="text-2xl mb-2">📥</div>
                    <div className="font-medium">Import Data</div>
                    <div className="text-xs text-green-400/70">Restore from backup</div>
                  </button>
                  <button className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-colors">
                    <div className="text-2xl mb-2">📤</div>
                    <div className="font-medium">Export All Data</div>
                    <div className="text-xs text-blue-400/70">Download complete backup</div>
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
                <h3 className="text-lg font-bold text-white mb-4">Connectivity Settings</h3>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Auto-Connect</div>
                      <div className="text-sm text-slate-500">Automatically connect to known devices</div>
                    </div>
                    <button
                      onClick={() => updateSetting('autoConnect', !settings.autoConnect)}
                      className={`w-14 h-7 rounded-full transition-colors ${
                        settings.autoConnect ? 'bg-cyan-500' : 'bg-slate-600'
                      }`}
                    >
                      <motion.div
                        className="w-6 h-6 bg-white rounded-full shadow"
                        animate={{ x: settings.autoConnect ? 26 : 2 }}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Connection Timeout (seconds)</label>
                    <input
                      type="number"
                      value={settings.connectionTimeout}
                      onChange={(e) => updateSetting('connectionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    />
                  </div>

                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <label className="block text-sm text-slate-400 mb-2">Retry Attempts</label>
                    <input
                      type="number"
                      value={settings.retryAttempts}
                      onChange={(e) => updateSetting('retryAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/30">
                  <h4 className="text-blue-400 font-medium mb-3">🔌 Modbus Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Slave Address</label>
                      <input
                        type="number"
                        value={settings.modbusAddress}
                        onChange={(e) => updateSetting('modbusAddress', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Baud Rate</label>
                      <select
                        value={settings.baudRate}
                        onChange={(e) => updateSetting('baudRate', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                      >
                        <option value={9600}>9600</option>
                        <option value={19200}>19200</option>
                        <option value={38400}>38400</option>
                        <option value={57600}>57600</option>
                        <option value={115200}>115200</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DISPLAY OPTIONS */}
            {activeSection === 'display' && (
              <motion.div
                key="display"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">Display Options</h3>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Dashboard Layout</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'standard', label: 'Standard' },
                      { id: 'compact', label: 'Compact' },
                      { id: 'detailed', label: 'Detailed' },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => updateSetting('dashboardLayout', id)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                          settings.dashboardLayout === id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <label className="block text-sm text-slate-400 mb-2">Font Size</label>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => updateSetting('fontSize', size)}
                        className={`flex-1 py-3 rounded-lg font-medium capitalize transition-colors ${
                          settings.fontSize === size
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {[
                  { key: 'showGaugeLabels', label: 'Show Gauge Labels', desc: 'Display labels on all gauge visualizations' },
                  { key: 'animationsEnabled', label: 'Enable Animations', desc: 'Smooth transitions and visual effects' },
                  { key: 'highContrastMode', label: 'High Contrast Mode', desc: 'Increased visibility for accessibility' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{label}</div>
                        <div className="text-sm text-slate-500">{desc}</div>
                      </div>
                      <button
                        onClick={() => updateSetting(key, !settings[key as keyof typeof settings])}
                        className={`w-14 h-7 rounded-full transition-colors ${
                          settings[key as keyof typeof settings] ? 'bg-cyan-500' : 'bg-slate-600'
                        }`}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full shadow"
                          animate={{ x: settings[key as keyof typeof settings] ? 26 : 2 }}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* PRIVACY */}
            {activeSection === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white mb-4">Privacy & Security</h3>

                {[
                  { key: 'shareAnonymousData', label: 'Share Anonymous Usage Data', desc: 'Help improve Generator Oracle by sharing anonymized diagnostics' },
                  { key: 'enableDiagnostics', label: 'Enable App Diagnostics', desc: 'Allow error reporting to improve stability' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{label}</div>
                        <div className="text-sm text-slate-500">{desc}</div>
                      </div>
                      <button
                        onClick={() => updateSetting(key, !settings[key as keyof typeof settings])}
                        className={`w-14 h-7 rounded-full transition-colors ${
                          settings[key as keyof typeof settings] ? 'bg-cyan-500' : 'bg-slate-600'
                        }`}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full shadow"
                          animate={{ x: settings[key as keyof typeof settings] ? 26 : 2 }}
                        />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <h4 className="text-red-400 font-medium mb-3">🗑️ Data Management</h4>
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                      Clear Diagnostic History
                    </button>
                    <button className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                      Clear Cached Data
                    </button>
                    <button className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                      Delete All Data
                    </button>
                  </div>
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
                <h3 className="text-lg font-bold text-white mb-4">About Generator Oracle</h3>

                <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <span className="text-4xl">🔮</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Generator Oracle</h3>
                      <p className="text-cyan-400">Version 3.0</p>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">
                    The most comprehensive generator diagnostic system in the world. Supporting 10 major controller brands
                    with over 400,000+ fault codes and detailed troubleshooting procedures.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-slate-500">Fault Codes</div>
                      <div className="text-xl font-bold text-cyan-400">{totalCodes.toLocaleString()}+</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-slate-500">Controllers</div>
                      <div className="text-xl font-bold text-cyan-400">10 Brands</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-slate-500">Languages</div>
                      <div className="text-xl font-bold text-cyan-400">7</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-slate-500">Status</div>
                      <div className="text-xl font-bold text-green-400">FREE</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎁</span>
                    <h4 className="text-amber-400 font-bold">Free Access Period</h4>
                  </div>
                  <p className="text-slate-300">
                    Full premium access until <strong className="text-white">April 1st, 2026</strong>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    After trial: KES 20,000/year for unlimited access
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <h4 className="text-white font-medium mb-3">📞 Support Contacts</h4>
                  <div className="space-y-2">
                    <a href="tel:+254782914717" className="flex items-center gap-3 text-blue-400 hover:text-blue-300">
                      <span>📱</span> +254 782 914 717
                    </a>
                    <a href="https://wa.me/254768860665" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-green-400 hover:text-green-300">
                      <span>💬</span> WhatsApp Support
                    </a>
                    <a href="mailto:support@emersoneims.com" className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300">
                      <span>📧</span> support@emersoneims.com
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
