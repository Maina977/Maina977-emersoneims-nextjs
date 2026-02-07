'use client';

/**
 * Controller Simulator - Visual Replicas Compatible with 9 Controller Types
 * Mimics exact button layouts and display styles
 * Supports manual input for sensor readings and AI analysis
 *
 * DISCLAIMER: This is an independently developed tool.
 * NOT affiliated with or endorsed by any controller manufacturer.
 *
 * Compatible Controller Types:
 * 1. DSE Type - Compatible with DeepSea Electronics controllers
 * 2. ComAp Type - Compatible with ComAp controllers
 * 3. Woodward Type - Compatible with Woodward controllers
 * 4. SmartGen Type - Compatible with SmartGen controllers
 * 5. PowerWizard Type - Compatible with PowerWizard controllers
 * 6. Datakom Type - Compatible with Datakom controllers
 * 7. Lovato Type - Compatible with Lovato controllers
 * 8. Siemens Type - Compatible with Siemens controllers
 * 9. ENKO Type - Compatible with ENKO controllers
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DISCLAIMER: Generator Oracle is an independently developed diagnostic tool.
 * It is NOT affiliated with, endorsed by, or sponsored by any controller manufacturer.
 * All brand names mentioned are trademarks of their respective owners.
 * "Compatible with" indicates the tool works with these controller types.
 */

// Controller Types Configuration - Compatible with 9 Controller Brands
export const CONTROLLER_TYPES = {
  DSE: {
    id: 'DSE',
    name: 'Compatible with DSE Controllers',
    shortName: 'DSE Type',
    color: '#1E40AF', // Blue
    accentColor: '#3B82F6',
    displayColor: '#0f172a',
    textColor: '#22d3ee',
    compatibleWith: ['DSE 4510', 'DSE 4610', 'DSE 5110', 'DSE 7320', 'DSE 8610'],
    displayType: 'lcd',
    buttonLayout: 'standard',
    hasMenuWheel: true,
    hasLedIndicators: true,
  },
  COMAP: {
    id: 'COMAP',
    name: 'Compatible with ComAp Controllers',
    shortName: 'ComAp Type',
    color: '#DC2626', // Red
    accentColor: '#EF4444',
    displayColor: '#1e1e1e',
    textColor: '#10b981',
    compatibleWith: ['InteliLite NT', 'InteliGen NTC', 'InteliSys NT'],
    displayType: 'graphic',
    buttonLayout: 'horizontal',
    hasMenuWheel: false,
    hasLedIndicators: true,
  },
  WOODWARD: {
    id: 'WOODWARD',
    name: 'Compatible with Woodward Controllers',
    shortName: 'Woodward Type',
    color: '#059669', // Green
    accentColor: '#10B981',
    displayColor: '#0a0a0a',
    textColor: '#fbbf24',
    compatibleWith: ['EasyGen 3000', 'EasyGen 3500', 'LS-5', 'GCP-30'],
    displayType: 'lcd',
    buttonLayout: 'vertical',
    hasMenuWheel: true,
    hasLedIndicators: true,
  },
  SMARTGEN: {
    id: 'SMARTGEN',
    name: 'Compatible with SmartGen Controllers',
    shortName: 'SmartGen Type',
    color: '#7C3AED', // Purple
    accentColor: '#8B5CF6',
    displayColor: '#171717',
    textColor: '#84cc16',
    compatibleWith: ['HGM6120', 'HGM9320', 'HGM9510', 'HGM9520'],
    displayType: 'graphic',
    buttonLayout: 'grid',
    hasMenuWheel: false,
    hasLedIndicators: true,
  },
  POWERWIZARD: {
    id: 'POWERWIZARD',
    name: 'Compatible with PowerWizard Controllers',
    shortName: 'PowerWizard Type',
    color: '#CA8A04', // Yellow/Gold
    accentColor: '#EAB308',
    displayColor: '#1c1917',
    textColor: '#06b6d4',
    compatibleWith: ['PowerWizard 1.0', 'PowerWizard 1.1', 'PowerWizard 2.0'],
    displayType: 'lcd',
    buttonLayout: 'caterpillar',
    hasMenuWheel: false,
    hasLedIndicators: true,
  },
  DATAKOM: {
    id: 'DATAKOM',
    name: 'Compatible with Datakom Controllers',
    shortName: 'Datakom Type',
    color: '#0891B2', // Cyan
    accentColor: '#06B6D4',
    displayColor: '#0c1821',
    textColor: '#22d3ee',
    compatibleWith: ['DKG-109', 'DKG-307', 'DKG-509', 'D-500', 'D-700'],
    displayType: 'lcd',
    buttonLayout: 'standard',
    hasMenuWheel: true,
    hasLedIndicators: true,
  },
  LOVATO: {
    id: 'LOVATO',
    name: 'Compatible with Lovato Controllers',
    shortName: 'Lovato Type',
    color: '#EA580C', // Orange
    accentColor: '#F97316',
    displayColor: '#1a1a1a',
    textColor: '#fb923c',
    compatibleWith: ['RGK600', 'RGK800', 'ATL600', 'ATL900'],
    displayType: 'graphic',
    buttonLayout: 'horizontal',
    hasMenuWheel: false,
    hasLedIndicators: true,
  },
  SIEMENS: {
    id: 'SIEMENS',
    name: 'Compatible with Siemens Controllers',
    shortName: 'Siemens Type',
    color: '#009999', // Teal
    accentColor: '#14B8A6',
    displayColor: '#0f1419',
    textColor: '#5eead4',
    compatibleWith: ['SICAM A8000', 'SIPROTEC 7SJ', 'SIPROTEC 7UT', 'SENTRON PAC'],
    displayType: 'graphic',
    buttonLayout: 'grid',
    hasMenuWheel: true,
    hasLedIndicators: true,
  },
  ENKO: {
    id: 'ENKO',
    name: 'Compatible with ENKO Controllers',
    shortName: 'ENKO Type',
    color: '#7C3AED', // Violet
    accentColor: '#A78BFA',
    displayColor: '#1e1b2e',
    textColor: '#c4b5fd',
    compatibleWith: ['GCU-100', 'GCU-300', 'GCU-500', 'AMF-100', 'SYNC-100'],
    displayType: 'lcd',
    buttonLayout: 'vertical',
    hasMenuWheel: false,
    hasLedIndicators: true,
  },
};

// Sensor Parameters Configuration
export const SENSOR_PARAMETERS = {
  engineOilPressure: {
    name: 'Engine Oil Pressure',
    unit: 'PSI',
    normalRange: { min: 25, max: 80 },
    warningLow: 20,
    criticalLow: 15,
    warningHigh: 90,
    criticalHigh: 100,
    sensorType: 'analog',
  },
  coolantTemperature: {
    name: 'Coolant Temperature',
    unit: '°C',
    normalRange: { min: 75, max: 95 },
    warningLow: 60,
    criticalLow: 40,
    warningHigh: 100,
    criticalHigh: 110,
    sensorType: 'analog',
  },
  batteryVoltage: {
    name: 'Battery Voltage',
    unit: 'V',
    normalRange: { min: 12.4, max: 14.5 },
    warningLow: 11.5,
    criticalLow: 10.5,
    warningHigh: 15.0,
    criticalHigh: 16.0,
    sensorType: 'analog',
  },
  engineRPM: {
    name: 'Engine RPM',
    unit: 'RPM',
    normalRange: { min: 1450, max: 1550 },
    warningLow: 1400,
    criticalLow: 1350,
    warningHigh: 1600,
    criticalHigh: 1650,
    sensorType: 'MPU',
  },
  generatorFrequency: {
    name: 'Generator Frequency',
    unit: 'Hz',
    normalRange: { min: 49.5, max: 50.5 },
    warningLow: 48.5,
    criticalLow: 47.5,
    warningHigh: 51.5,
    criticalHigh: 52.5,
    sensorType: 'digital',
  },
  generatorVoltage: {
    name: 'Generator Voltage',
    unit: 'V',
    normalRange: { min: 380, max: 420 },
    warningLow: 360,
    criticalLow: 340,
    warningHigh: 440,
    criticalHigh: 460,
    sensorType: 'analog',
  },
  loadPercentage: {
    name: 'Load Percentage',
    unit: '%',
    normalRange: { min: 0, max: 80 },
    warningLow: 0,
    criticalLow: 0,
    warningHigh: 90,
    criticalHigh: 100,
    sensorType: 'calculated',
  },
  fuelLevel: {
    name: 'Fuel Level',
    unit: '%',
    normalRange: { min: 20, max: 100 },
    warningLow: 15,
    criticalLow: 10,
    warningHigh: 100,
    criticalHigh: 100,
    sensorType: 'analog',
  },
  airFilterRestriction: {
    name: 'Air Filter Restriction',
    unit: 'inH2O',
    normalRange: { min: 0, max: 15 },
    warningLow: 0,
    criticalLow: 0,
    warningHigh: 20,
    criticalHigh: 25,
    sensorType: 'analog',
  },
  exhaustTemperature: {
    name: 'Exhaust Temperature',
    unit: '°C',
    normalRange: { min: 300, max: 550 },
    warningLow: 200,
    criticalLow: 150,
    warningHigh: 600,
    criticalHigh: 650,
    sensorType: 'analog',
  },
};

// Error/Alarm Types
export interface ActiveAlarm {
  code: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface ControllerSimulatorProps {
  controllerType: keyof typeof CONTROLLER_TYPES;
  onAnalyzeError?: (errorCode: string, sensorData: Record<string, number>) => void;
  onResetRequest?: (errorCode: string) => void;
  activeAlarms?: ActiveAlarm[];
  className?: string;
}

export default function ControllerSimulator({
  controllerType,
  onAnalyzeError,
  onResetRequest,
  activeAlarms = [],
  className = '',
}: ControllerSimulatorProps) {
  const config = CONTROLLER_TYPES[controllerType];

  // Sensor values state - manual input by technician
  const [sensorValues, setSensorValues] = useState<Record<string, number>>({
    engineOilPressure: 45,
    coolantTemperature: 85,
    batteryVoltage: 13.8,
    engineRPM: 1500,
    generatorFrequency: 50.0,
    generatorVoltage: 400,
    loadPercentage: 65,
    fuelLevel: 75,
    airFilterRestriction: 8,
    exhaustTemperature: 450,
  });

  // Controller state
  const [engineRunning, setEngineRunning] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'main' | 'alarms' | 'parameters' | 'input'>('main');
  const [selectedAlarm, setSelectedAlarm] = useState<ActiveAlarm | null>(null);
  const [showInputModal, setShowInputModal] = useState(false);
  const [editingParameter, setEditingParameter] = useState<string | null>(null);

  // LED Indicators
  const [leds, setLeds] = useState({
    power: true,
    auto: true,
    manual: false,
    running: false,
    alarm: activeAlarms.some(a => a.severity === 'warning'),
    fault: activeAlarms.some(a => a.severity === 'critical' || a.severity === 'shutdown'),
    mains: true,
    genset: false,
  });

  useEffect(() => {
    setLeds(prev => ({
      ...prev,
      running: engineRunning,
      genset: engineRunning,
      alarm: activeAlarms.some(a => a.severity === 'warning' && !a.acknowledged),
      fault: activeAlarms.some(a => (a.severity === 'critical' || a.severity === 'shutdown') && !a.acknowledged),
    }));
  }, [engineRunning, activeAlarms]);

  // Get parameter status
  const getParameterStatus = (paramKey: string, value: number) => {
    const param = SENSOR_PARAMETERS[paramKey as keyof typeof SENSOR_PARAMETERS];
    if (!param) return 'normal';

    if (value <= param.criticalLow || value >= param.criticalHigh) return 'critical';
    if (value <= param.warningLow || value >= param.warningHigh) return 'warning';
    if (value >= param.normalRange.min && value <= param.normalRange.max) return 'normal';
    return 'warning';
  };

  // Handle parameter input
  const handleParameterChange = (paramKey: string, value: number) => {
    setSensorValues(prev => ({ ...prev, [paramKey]: value }));
  };

  // Analyze current readings
  const handleAnalyze = () => {
    const criticalParams = Object.entries(sensorValues).filter(([key, value]) =>
      getParameterStatus(key, value) === 'critical'
    );

    if (criticalParams.length > 0 && onAnalyzeError) {
      // Generate error code based on critical parameters
      const errorCode = generateErrorCode(criticalParams[0][0]);
      onAnalyzeError(errorCode, sensorValues);
    }
  };

  // Generate error code based on parameter
  const generateErrorCode = (paramKey: string): string => {
    const codeMap: Record<string, string> = {
      engineOilPressure: '190-0',
      coolantTemperature: '110-0',
      batteryVoltage: '168-1',
      engineRPM: '190-8',
      generatorFrequency: '261-1',
      generatorVoltage: '262-1',
      loadPercentage: '520-1',
      fuelLevel: '94-0',
      airFilterRestriction: '107-1',
      exhaustTemperature: '173-0',
    };
    return codeMap[paramKey] || '000-0';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Controller Housing */}
      <div
        className="rounded-2xl p-1 shadow-2xl"
        style={{ backgroundColor: config.color }}
      >
        {/* Inner Panel */}
        <div className="bg-slate-900 rounded-xl p-4">
          {/* Top Section - LED Indicators */}
          {config.hasLedIndicators && (
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex gap-2">
                <LED color="green" active={leds.power} label="PWR" />
                <LED color="green" active={leds.auto} label="AUTO" />
                <LED color="yellow" active={leds.manual} label="MAN" />
                <LED color="green" active={leds.running} label="RUN" />
              </div>
              <div className="flex gap-2">
                <LED color="yellow" active={leds.alarm} blink label="ALM" />
                <LED color="red" active={leds.fault} blink label="FLT" />
              </div>
              <div className="flex gap-2">
                <LED color="blue" active={leds.mains} label="MAINS" />
                <LED color="green" active={leds.genset} label="GEN" />
              </div>
            </div>
          )}

          {/* Main Display */}
          <div
            className="rounded-lg p-4 mb-4 min-h-[200px] font-mono text-sm"
            style={{ backgroundColor: config.displayColor }}
          >
            <AnimatePresence mode="wait">
              {currentScreen === 'main' && (
                <MainScreen
                  key="main"
                  sensorValues={sensorValues}
                  textColor={config.textColor}
                  engineRunning={engineRunning}
                  activeAlarms={activeAlarms}
                  getParameterStatus={getParameterStatus}
                />
              )}
              {currentScreen === 'alarms' && (
                <AlarmsScreen
                  key="alarms"
                  alarms={activeAlarms}
                  textColor={config.textColor}
                  onSelectAlarm={setSelectedAlarm}
                  selectedAlarm={selectedAlarm}
                />
              )}
              {currentScreen === 'parameters' && (
                <ParametersScreen
                  key="parameters"
                  sensorValues={sensorValues}
                  textColor={config.textColor}
                  getParameterStatus={getParameterStatus}
                  onEditParameter={(param) => {
                    setEditingParameter(param);
                    setShowInputModal(true);
                  }}
                />
              )}
              {currentScreen === 'input' && (
                <ManualInputScreen
                  key="input"
                  sensorValues={sensorValues}
                  textColor={config.textColor}
                  onValueChange={handleParameterChange}
                  onAnalyze={handleAnalyze}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Button Panel */}
          <ButtonPanel
            config={config}
            currentScreen={currentScreen}
            setCurrentScreen={setCurrentScreen}
            engineRunning={engineRunning}
            setEngineRunning={setEngineRunning}
            autoMode={autoMode}
            setAutoMode={setAutoMode}
            onReset={() => selectedAlarm && onResetRequest?.(selectedAlarm.code)}
            hasActiveAlarms={activeAlarms.length > 0}
          />
        </div>
      </div>

      {/* Manual Input Modal */}
      <AnimatePresence>
        {showInputModal && editingParameter && (
          <ManualInputModal
            parameter={editingParameter}
            currentValue={sensorValues[editingParameter] || 0}
            onSave={(value) => {
              handleParameterChange(editingParameter, value);
              setShowInputModal(false);
              setEditingParameter(null);
            }}
            onClose={() => {
              setShowInputModal(false);
              setEditingParameter(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// LED Indicator Component
function LED({ color, active, blink, label }: { color: string; active: boolean; blink?: boolean; label: string }) {
  const colorMap = {
    red: active ? 'bg-red-500 shadow-red-500/50' : 'bg-red-900',
    green: active ? 'bg-green-500 shadow-green-500/50' : 'bg-green-900',
    yellow: active ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-yellow-900',
    blue: active ? 'bg-blue-500 shadow-blue-500/50' : 'bg-blue-900',
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`w-3 h-3 rounded-full ${colorMap[color as keyof typeof colorMap]} ${active ? 'shadow-lg' : ''}`}
        animate={blink && active ? { opacity: [1, 0.3, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <span className="text-[8px] text-slate-500 mt-0.5">{label}</span>
    </div>
  );
}

// Main Display Screen
function MainScreen({
  sensorValues,
  textColor,
  engineRunning,
  activeAlarms,
  getParameterStatus,
}: {
  sensorValues: Record<string, number>;
  textColor: string;
  engineRunning: boolean;
  activeAlarms: ActiveAlarm[];
  getParameterStatus: (key: string, value: number) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-2"
      style={{ color: textColor }}
    >
      {/* Status Bar */}
      <div className="flex justify-between border-b border-slate-700 pb-2">
        <span>{engineRunning ? 'RUNNING' : 'STOPPED'}</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <ParameterDisplay
          label="OIL PRESS"
          value={sensorValues.engineOilPressure}
          unit="PSI"
          status={getParameterStatus('engineOilPressure', sensorValues.engineOilPressure)}
        />
        <ParameterDisplay
          label="COOLANT"
          value={sensorValues.coolantTemperature}
          unit="°C"
          status={getParameterStatus('coolantTemperature', sensorValues.coolantTemperature)}
        />
        <ParameterDisplay
          label="BATTERY"
          value={sensorValues.batteryVoltage}
          unit="V"
          status={getParameterStatus('batteryVoltage', sensorValues.batteryVoltage)}
          decimals={1}
        />
        <ParameterDisplay
          label="RPM"
          value={sensorValues.engineRPM}
          unit=""
          status={getParameterStatus('engineRPM', sensorValues.engineRPM)}
        />
        <ParameterDisplay
          label="FREQ"
          value={sensorValues.generatorFrequency}
          unit="Hz"
          status={getParameterStatus('generatorFrequency', sensorValues.generatorFrequency)}
          decimals={1}
        />
        <ParameterDisplay
          label="VOLTAGE"
          value={sensorValues.generatorVoltage}
          unit="V"
          status={getParameterStatus('generatorVoltage', sensorValues.generatorVoltage)}
        />
        <ParameterDisplay
          label="LOAD"
          value={sensorValues.loadPercentage}
          unit="%"
          status={getParameterStatus('loadPercentage', sensorValues.loadPercentage)}
        />
        <ParameterDisplay
          label="FUEL"
          value={sensorValues.fuelLevel}
          unit="%"
          status={getParameterStatus('fuelLevel', sensorValues.fuelLevel)}
        />
      </div>

      {/* Active Alarms Banner */}
      {activeAlarms.length > 0 && (
        <motion.div
          className="mt-2 p-2 bg-red-900/50 rounded text-center text-xs"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⚠️ {activeAlarms.length} ACTIVE ALARM{activeAlarms.length > 1 ? 'S' : ''} - PRESS ALARM TO VIEW
        </motion.div>
      )}
    </motion.div>
  );
}

// Parameter Display Component
function ParameterDisplay({
  label,
  value,
  unit,
  status,
  decimals = 0,
}: {
  label: string;
  value: number;
  unit: string;
  status: string;
  decimals?: number;
}) {
  const statusColors = {
    normal: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
  };

  return (
    <div className={`flex justify-between ${statusColors[status as keyof typeof statusColors] || 'text-inherit'}`}>
      <span>{label}:</span>
      <span className="font-bold">
        {value.toFixed(decimals)} {unit}
      </span>
    </div>
  );
}

// Alarms Screen
function AlarmsScreen({
  alarms,
  textColor,
  onSelectAlarm,
  selectedAlarm,
}: {
  alarms: ActiveAlarm[];
  textColor: string;
  onSelectAlarm: (alarm: ActiveAlarm) => void;
  selectedAlarm: ActiveAlarm | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-2"
      style={{ color: textColor }}
    >
      <div className="border-b border-slate-700 pb-2 font-bold">ACTIVE ALARMS ({alarms.length})</div>
      {alarms.length === 0 ? (
        <div className="text-center py-4 text-slate-500">No active alarms</div>
      ) : (
        <div className="space-y-1 max-h-[150px] overflow-y-auto">
          {alarms.map((alarm, idx) => (
            <motion.div
              key={idx}
              className={`p-2 rounded text-xs cursor-pointer ${
                selectedAlarm?.code === alarm.code
                  ? 'bg-slate-700'
                  : 'hover:bg-slate-800'
              } ${
                alarm.severity === 'critical' || alarm.severity === 'shutdown'
                  ? 'border-l-2 border-red-500'
                  : alarm.severity === 'warning'
                  ? 'border-l-2 border-yellow-500'
                  : ''
              }`}
              onClick={() => onSelectAlarm(alarm)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between">
                <span className="font-bold">{alarm.code}</span>
                <span className={
                  alarm.severity === 'critical' || alarm.severity === 'shutdown'
                    ? 'text-red-400'
                    : alarm.severity === 'warning'
                    ? 'text-yellow-400'
                    : 'text-blue-400'
                }>
                  {alarm.severity.toUpperCase()}
                </span>
              </div>
              <div className="truncate">{alarm.message}</div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Parameters Screen with Edit Option
function ParametersScreen({
  sensorValues,
  textColor,
  getParameterStatus,
  onEditParameter,
}: {
  sensorValues: Record<string, number>;
  textColor: string;
  getParameterStatus: (key: string, value: number) => string;
  onEditParameter: (param: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-1 text-xs"
      style={{ color: textColor }}
    >
      <div className="border-b border-slate-700 pb-1 font-bold">SENSOR PARAMETERS - TAP TO EDIT</div>
      <div className="max-h-[160px] overflow-y-auto space-y-1">
        {Object.entries(SENSOR_PARAMETERS).map(([key, param]) => (
          <motion.div
            key={key}
            className="flex justify-between items-center p-1 hover:bg-slate-800 rounded cursor-pointer"
            onClick={() => onEditParameter(key)}
            whileTap={{ scale: 0.98 }}
          >
            <span className="truncate flex-1">{param.name}</span>
            <span className={`font-bold ml-2 ${
              getParameterStatus(key, sensorValues[key]) === 'critical' ? 'text-red-400' :
              getParameterStatus(key, sensorValues[key]) === 'warning' ? 'text-yellow-400' : ''
            }`}>
              {sensorValues[key]?.toFixed(key.includes('Voltage') || key.includes('Frequency') ? 1 : 0)} {param.unit}
            </span>
            <span className="ml-2 text-slate-500">✎</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Manual Input Screen
function ManualInputScreen({
  sensorValues,
  textColor,
  onValueChange,
  onAnalyze,
}: {
  sensorValues: Record<string, number>;
  textColor: string;
  onValueChange: (key: string, value: number) => void;
  onAnalyze: () => void;
}) {
  const [selectedParam, setSelectedParam] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (selectedParam && inputValue) {
      onValueChange(selectedParam, parseFloat(inputValue));
      setInputValue('');
      setSelectedParam(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-2"
      style={{ color: textColor }}
    >
      <div className="border-b border-slate-700 pb-1 font-bold text-sm">MANUAL INPUT MODE</div>
      <p className="text-xs text-slate-400">
        Enter real readings from the generator. The AI will analyze and diagnose issues.
      </p>

      {/* Parameter Selection */}
      <select
        value={selectedParam || ''}
        onChange={(e) => setSelectedParam(e.target.value)}
        className="w-full bg-slate-800 text-xs p-2 rounded border border-slate-600"
      >
        <option value="">Select Parameter...</option>
        {Object.entries(SENSOR_PARAMETERS).map(([key, param]) => (
          <option key={key} value={key}>{param.name}</option>
        ))}
      </select>

      {/* Value Input */}
      {selectedParam && (
        <div className="flex gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter ${SENSOR_PARAMETERS[selectedParam as keyof typeof SENSOR_PARAMETERS]?.unit}`}
            className="flex-1 bg-slate-800 text-xs p-2 rounded border border-slate-600"
            step="0.1"
          />
          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-cyan-600 text-white text-xs rounded hover:bg-cyan-700"
          >
            SET
          </button>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded hover:from-amber-600 hover:to-orange-600"
      >
        🔮 ANALYZE WITH AI
      </button>

      {/* Current Values Summary */}
      <div className="text-xs text-slate-500 mt-2">
        <div>Current readings entered: {Object.keys(sensorValues).length}</div>
      </div>
    </motion.div>
  );
}

// Button Panel Component
function ButtonPanel({
  config,
  currentScreen,
  setCurrentScreen,
  engineRunning,
  setEngineRunning,
  autoMode,
  setAutoMode,
  onReset,
  hasActiveAlarms,
}: {
  config: typeof CONTROLLER_TYPES[keyof typeof CONTROLLER_TYPES];
  currentScreen: string;
  setCurrentScreen: (screen: 'main' | 'alarms' | 'parameters' | 'input') => void;
  engineRunning: boolean;
  setEngineRunning: (running: boolean) => void;
  autoMode: boolean;
  setAutoMode: (auto: boolean) => void;
  onReset: () => void;
  hasActiveAlarms: boolean;
}) {
  return (
    <div className="space-y-3">
      {/* Navigation Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <ControlButton
          label="MAIN"
          active={currentScreen === 'main'}
          onClick={() => setCurrentScreen('main')}
          color={config.accentColor}
        />
        <ControlButton
          label="ALARMS"
          active={currentScreen === 'alarms'}
          onClick={() => setCurrentScreen('alarms')}
          color={config.accentColor}
          pulse={hasActiveAlarms}
        />
        <ControlButton
          label="PARAMS"
          active={currentScreen === 'parameters'}
          onClick={() => setCurrentScreen('parameters')}
          color={config.accentColor}
        />
        <ControlButton
          label="INPUT"
          active={currentScreen === 'input'}
          onClick={() => setCurrentScreen('input')}
          color="#06b6d4"
        />
      </div>

      {/* Mode & Control Buttons */}
      <div className="flex gap-2">
        <ControlButton
          label="AUTO"
          active={autoMode}
          onClick={() => setAutoMode(true)}
          color="#22c55e"
          className="flex-1"
        />
        <ControlButton
          label="MANUAL"
          active={!autoMode}
          onClick={() => setAutoMode(false)}
          color="#eab308"
          className="flex-1"
        />
      </div>

      {/* Start/Stop/Reset */}
      <div className="flex gap-2">
        <ControlButton
          label="START"
          onClick={() => setEngineRunning(true)}
          color="#22c55e"
          className="flex-1"
          disabled={engineRunning}
        />
        <ControlButton
          label="STOP"
          onClick={() => setEngineRunning(false)}
          color="#ef4444"
          className="flex-1"
          disabled={!engineRunning}
        />
        <ControlButton
          label="RESET"
          onClick={onReset}
          color="#f97316"
          className="flex-1"
        />
      </div>
    </div>
  );
}

// Control Button Component
function ControlButton({
  label,
  active,
  onClick,
  color,
  className = '',
  disabled = false,
  pulse = false,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  color: string;
  className?: string;
  disabled?: boolean;
  pulse?: boolean;
}) {
  return (
    <motion.button
      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        backgroundColor: active ? color : '#374151',
        color: active ? '#fff' : '#9ca3af',
        boxShadow: active ? `0 0 10px ${color}50` : 'none',
      }}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.95 }}
      animate={pulse ? { opacity: [1, 0.5, 1] } : {}}
      transition={pulse ? { duration: 0.5, repeat: Infinity } : {}}
    >
      {label}
    </motion.button>
  );
}

// Manual Input Modal
function ManualInputModal({
  parameter,
  currentValue,
  onSave,
  onClose,
}: {
  parameter: string;
  currentValue: number;
  onSave: (value: number) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(currentValue.toString());
  const param = SENSOR_PARAMETERS[parameter as keyof typeof SENSOR_PARAMETERS];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-4">
          Edit {param?.name || parameter}
        </h3>

        {param && (
          <div className="text-xs text-slate-400 mb-4 space-y-1">
            <div>Normal Range: {param.normalRange.min} - {param.normalRange.max} {param.unit}</div>
            <div>Warning: &lt;{param.warningLow} or &gt;{param.warningHigh} {param.unit}</div>
            <div>Critical: &lt;{param.criticalLow} or &gt;{param.criticalHigh} {param.unit}</div>
          </div>
        )}

        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-lg font-mono mb-4"
          step="0.1"
          autoFocus
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(parseFloat(value))}
            className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
