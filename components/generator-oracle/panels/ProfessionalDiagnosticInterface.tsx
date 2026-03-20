'use client';

/**
 * ORACLE PROFESSIONAL DIAGNOSTIC INTERFACE
 *
 * IMPORTANT DISCLAIMER:
 * This is an INDEPENDENT diagnostic reference tool created for educational and
 * troubleshooting purposes. Generator Oracle is NOT affiliated with, endorsed by,
 * licensed by, or officially associated with any engine, controller, or equipment
 * manufacturer including but not limited to any Swedish, American, British, German,
 * or other international manufacturers.
 *
 * All brand names, model numbers, product names, and trademarks mentioned throughout
 * this application are the property of their respective owners. References to
 * "dealer-level" or "professional-grade" describe functionality comparable to
 * authorized tools, NOT official manufacturer tools.
 *
 * This tool provides GENERIC diagnostic capabilities using standard protocols
 * (J1939, CAN, Modbus) that are compatible with multiple engine platforms.
 *
 * For official diagnostics, warranty service, or certified repairs, always consult
 * the manufacturer's authorized service centers and official technical manuals.
 *
 * Features:
 * - Fault Code Management (Read/Clear DTCs)
 * - Live Data Monitoring with Graphing
 * - ECU Communication & Configuration
 * - Bi-Directional Controls (Active Tests)
 * - Parameter Adjustments & Calibration
 * - Data Logging & Reporting
 * - Guided Diagnostics
 * - Multi-Language Support
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Battery,
  Bluetooth,
  Cable,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Download,
  FileText,
  Gauge,
  HardDrive,
  History,
  Languages,
  Layers,
  Lightbulb,
  LineChart,
  ListChecks,
  Loader2,
  MonitorSmartphone,
  Play,
  Power,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Sliders,
  Sparkles,
  Square,
  Terminal,
  ThermometerSun,
  Timer,
  Trash2,
  Truck,
  Upload,
  Usb,
  Wifi,
  Wrench,
  Zap,
  XCircle
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES (Standard J1939/CAN Compatible)
// ═══════════════════════════════════════════════════════════════════════════════

interface DiagnosticFaultCode {
  code: string;
  spn?: number;
  fmi?: number;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'logged' | 'cleared';
  occurenceCount: number;
  firstSeen: Date;
  lastSeen: Date;
  freezeFrameData?: Record<string, number | string>;
  possibleCauses: string[];
  recommendedActions: string[];
  affectedSystem: string;
}

interface LiveDataParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  normal: { low: number; high: number };
  category: string;
  pgn?: number;
  updateRate: number; // Hz
  history: { time: number; value: number }[];
}

interface ECUInfo {
  manufacturer: string;
  model: string;
  serialNumber: string;
  partNumber: string;
  firmwareVersion: string;
  calibrationId: string;
  hardwareRevision: string;
  productionDate: string;
  totalHours: number;
  totalFuel: number;
}

interface BiDirectionalTest {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  warning: string;
  steps: string[];
  expectedResult: string;
}

interface CalibrationParameter {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  defaultValue: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  requiresAuth: boolean;
  affectsEmissions: boolean;
  description: string;
}

interface ConnectionStatus {
  connected: boolean;
  protocol: string;
  baudRate: number;
  ecuAddress: number;
  signalStrength: number;
  lastCommunication: Date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE CATEGORIES (10 Services)
// ═══════════════════════════════════════════════════════════════════════════════

const SERVICE_CATEGORIES = [
  { id: 'generators', name: 'Diesel Generators', icon: Zap, color: '#EF4444' },
  { id: 'solar', name: 'Solar Systems', icon: ThermometerSun, color: '#F59E0B' },
  { id: 'ats', name: 'ATS/Changeover', icon: RefreshCw, color: '#10B981' },
  { id: 'distribution', name: 'Distribution Boards', icon: Layers, color: '#3B82F6' },
  { id: 'motors', name: 'Motor Rewinding', icon: Activity, color: '#8B5CF6' },
  { id: 'ups', name: 'UPS Systems', icon: Battery, color: '#06B6D4' },
  { id: 'borehole', name: 'Borehole Pumps', icon: Database, color: '#0EA5E9' },
  { id: 'hvac', name: 'AC Installation', icon: ThermometerSun, color: '#14B8A6' },
  { id: 'incinerators', name: 'Hospital Incinerators', icon: Sparkles, color: '#F97316' },
  { id: 'automation', name: 'Automation & Controls', icon: Cpu, color: '#6366F1' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════════════════════════

const SAMPLE_FAULT_CODES: DiagnosticFaultCode[] = [
  {
    code: 'SPN 100 / FMI 4',
    spn: 100,
    fmi: 4,
    description: 'Engine Oil Pressure - Voltage Below Normal',
    severity: 'critical',
    status: 'active',
    occurenceCount: 3,
    firstSeen: new Date('2026-03-15'),
    lastSeen: new Date('2026-03-20'),
    possibleCauses: [
      'Low oil level',
      'Oil pressure sensor failure',
      'Wiring harness damage',
      'Oil pump failure',
      'Blocked oil filter'
    ],
    recommendedActions: [
      'Check engine oil level immediately',
      'Inspect oil pressure sensor and wiring',
      'Verify oil filter condition',
      'Check oil pump operation'
    ],
    affectedSystem: 'Engine Lubrication'
  },
  {
    code: 'SPN 110 / FMI 16',
    spn: 110,
    fmi: 16,
    description: 'Engine Coolant Temperature - High Warning',
    severity: 'warning',
    status: 'active',
    occurenceCount: 5,
    firstSeen: new Date('2026-03-18'),
    lastSeen: new Date('2026-03-20'),
    possibleCauses: [
      'Low coolant level',
      'Thermostat stuck closed',
      'Radiator blockage',
      'Water pump failure',
      'Fan belt slipping'
    ],
    recommendedActions: [
      'Check coolant level and condition',
      'Inspect thermostat operation',
      'Clean or replace radiator',
      'Check water pump and fan belt'
    ],
    affectedSystem: 'Engine Cooling'
  },
  {
    code: 'SPN 3719 / FMI 31',
    spn: 3719,
    fmi: 31,
    description: 'Aftertreatment SCR NOx Conversion - Efficiency Below Threshold',
    severity: 'warning',
    status: 'logged',
    occurenceCount: 1,
    firstSeen: new Date('2026-03-10'),
    lastSeen: new Date('2026-03-10'),
    possibleCauses: [
      'DEF quality issue',
      'SCR catalyst degradation',
      'NOx sensor malfunction',
      'DEF dosing unit failure'
    ],
    recommendedActions: [
      'Verify DEF quality and level',
      'Check NOx sensors upstream and downstream',
      'Inspect DEF dosing system',
      'Consider SCR catalyst replacement if degraded'
    ],
    affectedSystem: 'Aftertreatment'
  }
];

const SAMPLE_LIVE_DATA: LiveDataParameter[] = [
  { id: 'rpm', name: 'Engine Speed', value: 1500, unit: 'RPM', min: 0, max: 2500, normal: { low: 700, high: 2200 }, category: 'Engine', updateRate: 10, history: [] },
  { id: 'coolant_temp', name: 'Coolant Temperature', value: 85, unit: '°C', min: -40, max: 120, normal: { low: 75, high: 95 }, category: 'Engine', updateRate: 1, history: [] },
  { id: 'oil_pressure', name: 'Oil Pressure', value: 4.2, unit: 'bar', min: 0, max: 10, normal: { low: 2, high: 6 }, category: 'Engine', updateRate: 5, history: [] },
  { id: 'boost_pressure', name: 'Boost Pressure', value: 1.8, unit: 'bar', min: 0, max: 4, normal: { low: 0, high: 3.5 }, category: 'Engine', updateRate: 10, history: [] },
  { id: 'fuel_pressure', name: 'Fuel Rail Pressure', value: 1850, unit: 'bar', min: 0, max: 2500, normal: { low: 300, high: 2200 }, category: 'Fuel', updateRate: 10, history: [] },
  { id: 'intake_temp', name: 'Intake Air Temperature', value: 42, unit: '°C', min: -40, max: 80, normal: { low: -20, high: 60 }, category: 'Engine', updateRate: 1, history: [] },
  { id: 'exhaust_temp', name: 'Exhaust Temperature', value: 520, unit: '°C', min: 0, max: 900, normal: { low: 200, high: 700 }, category: 'Exhaust', updateRate: 2, history: [] },
  { id: 'battery_voltage', name: 'Battery Voltage', value: 28.2, unit: 'V', min: 0, max: 32, normal: { low: 24, high: 30 }, category: 'Electrical', updateRate: 1, history: [] },
  { id: 'load_percent', name: 'Engine Load', value: 65, unit: '%', min: 0, max: 100, normal: { low: 0, high: 100 }, category: 'Engine', updateRate: 5, history: [] },
  { id: 'fuel_rate', name: 'Fuel Rate', value: 45.2, unit: 'L/hr', min: 0, max: 100, normal: { low: 0, high: 80 }, category: 'Fuel', updateRate: 2, history: [] },
];

const BIDIRECTIONAL_TESTS: BiDirectionalTest[] = [
  {
    id: 'injector_cutout',
    name: 'Injector Cutout Test',
    description: 'Sequentially disable each fuel injector to identify weak or failing cylinders',
    category: 'Engine',
    duration: 60,
    warning: 'Engine must be running at operating temperature. Do not exceed 60 seconds per cylinder.',
    steps: [
      'Ensure engine is at operating temperature (>70°C coolant)',
      'Connect diagnostic tool and establish communication',
      'Select cylinder to disable (1-6)',
      'Monitor RPM drop and engine smoothness',
      'Record results for each cylinder',
      'Compare drop percentage across all cylinders'
    ],
    expectedResult: 'Each cylinder should show similar RPM drop (±15%). Uneven drop indicates injector or compression issue.'
  },
  {
    id: 'dpf_regen',
    name: 'Forced DPF Regeneration',
    description: 'Initiate manual diesel particulate filter regeneration cycle',
    category: 'Aftertreatment',
    duration: 1800,
    warning: 'Vehicle must be stationary. Exhaust temperatures will exceed 600°C. Keep away from flammable materials.',
    steps: [
      'Park on level ground away from flammable materials',
      'Ensure fuel tank is at least 25% full',
      'Verify no active fault codes that would prevent regen',
      'Initiate forced regeneration',
      'Monitor soot level and exhaust temperature',
      'Do not interrupt until complete'
    ],
    expectedResult: 'Soot level should reduce to <10%. Process typically takes 20-30 minutes.'
  },
  {
    id: 'actuator_test',
    name: 'Actuator Functional Test',
    description: 'Test solenoids, relays, and actuators for proper operation',
    category: 'Electrical',
    duration: 30,
    warning: 'Engine should be off for most actuator tests. Follow specific test instructions.',
    steps: [
      'Turn ignition to ON (engine off)',
      'Select actuator to test from list',
      'Activate actuator and observe response',
      'Check for audible click (relays) or movement',
      'Verify control signal reaches actuator',
      'Record pass/fail for each component'
    ],
    expectedResult: 'Each actuator should respond within specified time and show correct operation.'
  },
  {
    id: 'compression_test',
    name: 'Cylinder Compression Test',
    description: 'Measure relative compression across all cylinders during cranking',
    category: 'Engine',
    duration: 30,
    warning: 'Disconnect fuel system before cranking. Battery must be fully charged.',
    steps: [
      'Disable fuel injection system',
      'Ensure battery voltage > 24V',
      'Crank engine for 5 seconds',
      'Tool will measure cranking speed variation',
      'Compare compression balance across cylinders'
    ],
    expectedResult: 'All cylinders should show compression within 10% of average. Low cylinder indicates valve, ring, or head gasket issue.'
  }
];

const CALIBRATION_PARAMETERS: CalibrationParameter[] = [
  { id: 'high_idle', name: 'High Idle Speed', category: 'Governor', currentValue: 1850, defaultValue: 1850, unit: 'RPM', min: 1800, max: 2000, step: 10, requiresAuth: true, affectsEmissions: false, description: 'Maximum engine speed at no load' },
  { id: 'low_idle', name: 'Low Idle Speed', category: 'Governor', currentValue: 700, defaultValue: 700, unit: 'RPM', min: 600, max: 800, step: 10, requiresAuth: true, affectsEmissions: true, description: 'Minimum engine speed at idle' },
  { id: 'rated_power', name: 'Rated Power Limit', category: 'Power', currentValue: 250, defaultValue: 250, unit: 'kW', min: 100, max: 300, step: 5, requiresAuth: true, affectsEmissions: true, description: 'Maximum power output limit' },
  { id: 'droop', name: 'Governor Droop', category: 'Governor', currentValue: 0, defaultValue: 0, unit: '%', min: 0, max: 10, step: 0.5, requiresAuth: true, affectsEmissions: false, description: 'Speed droop from no-load to full-load' },
  { id: 'torque_limit', name: 'Torque Limit', category: 'Power', currentValue: 1200, defaultValue: 1200, unit: 'Nm', min: 800, max: 1500, step: 10, requiresAuth: true, affectsEmissions: true, description: 'Maximum engine torque' },
  { id: 'fan_on_temp', name: 'Fan On Temperature', category: 'Cooling', currentValue: 85, defaultValue: 85, unit: '°C', min: 75, max: 95, step: 1, requiresAuth: false, affectsEmissions: false, description: 'Temperature at which cooling fan activates' },
  { id: 'fan_off_temp', name: 'Fan Off Temperature', category: 'Cooling', currentValue: 80, defaultValue: 80, unit: '°C', min: 70, max: 90, step: 1, requiresAuth: false, affectsEmissions: false, description: 'Temperature at which cooling fan deactivates' },
  { id: 'overspeed', name: 'Overspeed Shutdown', category: 'Protection', currentValue: 2200, defaultValue: 2200, unit: 'RPM', min: 2000, max: 2400, step: 50, requiresAuth: true, affectsEmissions: false, description: 'Engine speed that triggers shutdown' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProfessionalDiagnosticInterface() {
  // State
  const [activeTab, setActiveTab] = useState<'faults' | 'livedata' | 'bidirectional' | 'calibration' | 'programming' | 'logging' | 'info'>('faults');
  const [selectedService, setSelectedService] = useState(SERVICE_CATEGORIES[0]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    protocol: 'J1939',
    baudRate: 250000,
    ecuAddress: 0x00,
    signalStrength: 0,
    lastCommunication: new Date()
  });
  const [faultCodes, setFaultCodes] = useState<DiagnosticFaultCode[]>(SAMPLE_FAULT_CODES);
  const [liveData, setLiveData] = useState<LiveDataParameter[]>(SAMPLE_LIVE_DATA);
  const [isScanning, setIsScanning] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [selectedFault, setSelectedFault] = useState<DiagnosticFaultCode | null>(null);
  const [selectedParameters, setSelectedParameters] = useState<string[]>(['rpm', 'coolant_temp', 'oil_pressure', 'load_percent']);
  const [isLogging, setIsLogging] = useState(false);
  const [activeTest, setActiveTest] = useState<BiDirectionalTest | null>(null);
  const [language, setLanguage] = useState('en');

  const liveDataIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate live data updates
  useEffect(() => {
    if (connectionStatus.connected) {
      liveDataIntervalRef.current = setInterval(() => {
        setLiveData(prev => prev.map(param => ({
          ...param,
          value: param.value + (Math.random() - 0.5) * (param.max - param.min) * 0.02,
          history: [
            ...param.history.slice(-100),
            { time: Date.now(), value: param.value }
          ]
        })));
      }, 200);
    }

    return () => {
      if (liveDataIntervalRef.current) {
        clearInterval(liveDataIntervalRef.current);
      }
    };
  }, [connectionStatus.connected]);

  // Handlers
  const handleConnect = useCallback(() => {
    setIsScanning(true);
    setTimeout(() => {
      setConnectionStatus({
        connected: true,
        protocol: 'J1939 CAN',
        baudRate: 250000,
        ecuAddress: 0x00,
        signalStrength: 95,
        lastCommunication: new Date()
      });
      setIsScanning(false);
    }, 2000);
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnectionStatus(prev => ({ ...prev, connected: false, signalStrength: 0 }));
  }, []);

  const handleScanFaults = useCallback(() => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  }, []);

  const handleClearFaults = useCallback(() => {
    setIsClearing(true);
    setTimeout(() => {
      setFaultCodes(prev => prev.map(f => ({ ...f, status: 'cleared' as const })));
      setIsClearing(false);
    }, 2000);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'warning': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'logged': return <History className="w-4 h-4 text-amber-400" />;
      case 'cleared': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-amber-400/80">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p>
            <strong>Independent Tool:</strong> Generator Oracle is NOT affiliated with any manufacturer.
            This tool uses standard J1939/CAN protocols for compatibility. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>

      {/* Header - Connection Status Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Oracle Diagnostic Interface</h1>
                <p className="text-xs text-slate-400">Professional ECM Diagnostics - Dealer-Grade Functionality</p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-4">
              {/* Connection Method Indicators */}
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg transition-all ${connectionStatus.protocol === 'J1939 CAN' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Cable className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg transition-all ${connectionStatus.protocol === 'Bluetooth' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Bluetooth className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg transition-all ${connectionStatus.protocol === 'WiFi' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Wifi className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg transition-all ${connectionStatus.protocol === 'USB' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Usb className="w-5 h-5" />
                </button>
              </div>

              {/* Connection Status Indicator */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${connectionStatus.connected ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <div className={`w-2 h-2 rounded-full ${connectionStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-sm font-medium">
                  {connectionStatus.connected ? `Connected - ${connectionStatus.protocol}` : 'Disconnected'}
                </span>
                {connectionStatus.connected && (
                  <span className="text-xs text-emerald-400/70">{connectionStatus.signalStrength}%</span>
                )}
              </div>

              {/* Connect/Disconnect Button */}
              <button
                onClick={connectionStatus.connected ? handleDisconnect : handleConnect}
                disabled={isScanning}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  connectionStatus.connected
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30'
                }`}
              >
                {isScanning ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : connectionStatus.connected ? (
                  <Power className="w-5 h-5" />
                ) : (
                  <Zap className="w-5 h-5" />
                )}
                {isScanning ? 'Connecting...' : connectionStatus.connected ? 'Disconnect' : 'Connect'}
              </button>

              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
              >
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="ar">العربية</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Service Category Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Select Service Category</h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {SERVICE_CATEGORIES.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    selectedService.id === service.id
                      ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-6 h-6" style={{ color: service.color }} />
                  <span className="text-xs text-slate-400 text-center">{service.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-slate-900/50 p-2 rounded-2xl border border-slate-700/50">
          {[
            { id: 'faults', label: 'Fault Codes', icon: AlertTriangle, count: faultCodes.filter(f => f.status === 'active').length },
            { id: 'livedata', label: 'Live Data', icon: Activity },
            { id: 'bidirectional', label: 'Active Tests', icon: Play },
            { id: 'calibration', label: 'Calibration', icon: Sliders },
            { id: 'programming', label: 'ECU Programming', icon: Download },
            { id: 'logging', label: 'Data Logging', icon: Save },
            { id: 'info', label: 'ECU Info', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* FAULT CODES TAB */}
          {activeTab === 'faults' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleScanFaults}
                  disabled={!connectionStatus.connected || isScanning}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/30"
                >
                  {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  {isScanning ? 'Scanning...' : 'Read Fault Codes'}
                </button>
                <button
                  onClick={handleClearFaults}
                  disabled={!connectionStatus.connected || isClearing || faultCodes.filter(f => f.status === 'active').length === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-slate-700"
                >
                  {isClearing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  {isClearing ? 'Clearing...' : 'Clear All Codes'}
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 border border-slate-700">
                  <FileText className="w-5 h-5" />
                  Export Report
                </button>
              </div>

              {/* Fault Summary */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">{faultCodes.filter(f => f.status === 'active' && f.severity === 'critical').length}</div>
                      <div className="text-sm text-red-400/70">Critical Faults</div>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-400">{faultCodes.filter(f => f.status === 'active' && f.severity === 'warning').length}</div>
                      <div className="text-sm text-amber-400/70">Warnings</div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <History className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{faultCodes.filter(f => f.status === 'logged').length}</div>
                      <div className="text-sm text-blue-400/70">Logged Events</div>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-400">{faultCodes.filter(f => f.status === 'cleared').length}</div>
                      <div className="text-sm text-emerald-400/70">Cleared</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fault Code List */}
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white">Diagnostic Trouble Codes (DTCs)</h3>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {faultCodes.map((fault) => (
                    <motion.div
                      key={fault.code}
                      className={`p-4 hover:bg-slate-800/50 cursor-pointer transition-all ${selectedFault?.code === fault.code ? 'bg-slate-800/70' : ''}`}
                      onClick={() => setSelectedFault(fault)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getSeverityColor(fault.severity)}`}>
                          {getStatusIcon(fault.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-lg font-bold text-white">{fault.code}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(fault.severity)}`}>
                              {fault.severity.toUpperCase()}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs ${fault.status === 'active' ? 'bg-red-500/20 text-red-400' : fault.status === 'logged' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                              {fault.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-300">{fault.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span>Occurrences: {fault.occurenceCount}</span>
                            <span>System: {fault.affectedSystem}</span>
                            <span>Last Seen: {fault.lastSeen.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Fault Detail Panel */}
              {selectedFault && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{selectedFault.code}</h3>
                    <button
                      onClick={() => setSelectedFault(null)}
                      className="p-2 hover:bg-slate-800 rounded-lg"
                    >
                      <XCircle className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Possible Causes
                      </h4>
                      <ul className="space-y-2">
                        {selectedFault.possibleCauses.map((cause, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-300">
                            <span className="text-amber-400 mt-1">•</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        Recommended Actions
                      </h4>
                      <ul className="space-y-2">
                        {selectedFault.recommendedActions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-300">
                            <span className="text-cyan-400 font-bold">{i + 1}.</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* LIVE DATA TAB */}
          {activeTab === 'livedata' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Parameter Selection */}
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Select Parameters to Monitor</h3>
                <div className="flex flex-wrap gap-2">
                  {liveData.map((param) => (
                    <button
                      key={param.id}
                      onClick={() => {
                        setSelectedParameters(prev =>
                          prev.includes(param.id)
                            ? prev.filter(p => p !== param.id)
                            : [...prev, param.id]
                        );
                      }}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedParameters.includes(param.id)
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {param.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Data Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {liveData
                  .filter(param => selectedParameters.includes(param.id))
                  .map((param) => {
                    const isNormal = param.value >= param.normal.low && param.value <= param.normal.high;
                    const percentage = ((param.value - param.min) / (param.max - param.min)) * 100;

                    return (
                      <div
                        key={param.id}
                        className={`bg-slate-900/50 border rounded-2xl p-4 ${
                          isNormal ? 'border-slate-700/50' : 'border-amber-500/50 bg-amber-500/5'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">{param.name}</span>
                          <Gauge className={`w-4 h-4 ${isNormal ? 'text-emerald-400' : 'text-amber-400'}`} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                          {param.value.toFixed(param.unit === 'RPM' || param.unit === 'bar' && param.value > 100 ? 0 : 1)}
                          <span className="text-lg font-normal text-slate-400 ml-1">{param.unit}</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${isNormal ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-amber-500 to-red-500'}`}
                            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-slate-500">
                          <span>{param.min}{param.unit}</span>
                          <span className={isNormal ? 'text-emerald-400' : 'text-amber-400'}>
                            Normal: {param.normal.low}-{param.normal.high}
                          </span>
                          <span>{param.max}{param.unit}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Data Logging Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsLogging(!isLogging)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isLogging
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
                  }`}
                >
                  {isLogging ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isLogging ? 'Stop Recording' : 'Start Recording'}
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 border border-slate-700">
                  <Download className="w-5 h-5" />
                  Export CSV
                </button>
              </div>
            </motion.div>
          )}

          {/* BIDIRECTIONAL TESTS TAB */}
          {activeTab === 'bidirectional' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-400">Safety Warning</h4>
                  <p className="text-sm text-amber-400/70">Active tests may affect engine operation. Ensure vehicle is in a safe location with adequate ventilation. Follow all safety procedures.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {BIDIRECTIONAL_TESTS.map((test) => (
                  <div
                    key={test.id}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">{test.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{test.description}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        {test.duration}s
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded">{test.category}</span>
                    </div>

                    <button
                      onClick={() => setActiveTest(test)}
                      disabled={!connectionStatus.connected}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Play className="w-5 h-5" />
                      Run Test
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CALIBRATION TAB */}
          {activeTab === 'calibration' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-400">Authorization Required</h4>
                  <p className="text-sm text-red-400/70">Modifying calibration parameters may affect emissions compliance and engine warranty. Some parameters require dealer-level authorization.</p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white">Engine Calibration Parameters</h3>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {CALIBRATION_PARAMETERS.map((param) => (
                    <div key={param.id} className="p-4 hover:bg-slate-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-white font-medium">{param.name}</span>
                          <span className="ml-2 text-xs text-slate-500">[{param.category}]</span>
                          {param.affectsEmissions && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">Emissions</span>
                          )}
                          {param.requiresAuth && (
                            <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Auth Required</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-cyan-400">
                            {param.currentValue}
                            <span className="text-sm font-normal text-slate-400 ml-1">{param.unit}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{param.description}</p>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={param.currentValue}
                          className="flex-1 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer"
                          disabled={!connectionStatus.connected}
                        />
                        <span className="text-xs text-slate-500">
                          Range: {param.min} - {param.max} {param.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  disabled={!connectionStatus.connected}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-5 h-5" />
                  Write Parameters to ECU
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 border border-slate-700">
                  <RefreshCw className="w-5 h-5" />
                  Reset to Defaults
                </button>
              </div>
            </motion.div>
          )}

          {/* ECU INFO TAB */}
          {activeTab === 'info' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  ECU Information
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Manufacturer', value: 'Cummins Inc.' },
                    { label: 'ECU Model', value: 'CM2350A' },
                    { label: 'Serial Number', value: 'CPL-8765-2024-03' },
                    { label: 'Part Number', value: '4309175' },
                    { label: 'Firmware Version', value: '6.32.0' },
                    { label: 'Calibration ID', value: 'QSB67_250HP_1800_PRIME_v3.2.1' },
                    { label: 'Hardware Revision', value: 'REV-C' },
                    { label: 'Production Date', value: '2024-01-15' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Engine Totals
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Hours', value: '4,562 hrs' },
                    { label: 'Total Fuel Used', value: '125,430 L' },
                    { label: 'Total Starts', value: '3,245' },
                    { label: 'Total kWh', value: '856,230 kWh' },
                    { label: 'Avg Fuel Rate', value: '27.5 L/hr' },
                    { label: 'Avg Load', value: '68%' },
                    { label: 'Oil Change Hours', value: '487 hrs ago' },
                    { label: 'Filter Change Hours', value: '245 hrs ago' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-amber-400" />
                  Component Information
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { component: 'Fuel Injectors', status: 'Good', hours: '4,562 hrs', icon: '⚙️' },
                    { component: 'Turbocharger', status: 'Good', hours: '4,562 hrs', icon: '🌀' },
                    { component: 'EGR Valve', status: 'Good', hours: '4,562 hrs', icon: '🔄' },
                    { component: 'DPF System', status: 'Monitor', hours: '87% loaded', icon: '🔥' },
                    { component: 'SCR Catalyst', status: 'Good', hours: '92% efficiency', icon: '🧪' },
                    { component: 'DEF Quality', status: 'Good', hours: '32.5% concentration', icon: '💧' },
                  ].map((item) => (
                    <div key={item.component} className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-white font-medium">{item.component}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${item.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-slate-500">{item.hours}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PROGRAMMING TAB */}
          {activeTab === 'programming' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-400">Critical Operation</h4>
                  <p className="text-sm text-red-400/70">ECU programming is a critical operation. Do not interrupt power or communication during flashing. Incorrect firmware may render the ECU inoperable.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-cyan-400" />
                    Firmware Update
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Current Version</span>
                      <span className="text-white font-mono">6.32.0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Latest Available</span>
                      <span className="text-emerald-400 font-mono">6.35.0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Update Size</span>
                      <span className="text-white">4.2 MB</span>
                    </div>
                    <button
                      disabled={!connectionStatus.connected}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-5 h-5" />
                      Download & Install Update
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-purple-400" />
                    Calibration File
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Current Calibration</span>
                      <span className="text-white font-mono">v3.2.1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Engine Rating</span>
                      <span className="text-white">250HP @ 1800RPM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Application</span>
                      <span className="text-white">Prime Power</span>
                    </div>
                    <button
                      disabled={!connectionStatus.connected}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-5 h-5" />
                      Load Custom Calibration
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* DATA LOGGING TAB */}
          {activeTab === 'logging' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Data Logger Configuration</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Sample Rate</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                      <option>10 Hz (100ms)</option>
                      <option>5 Hz (200ms)</option>
                      <option>1 Hz (1 second)</option>
                      <option>0.1 Hz (10 seconds)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Trigger Mode</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                      <option>Manual Start/Stop</option>
                      <option>Fault Code Trigger</option>
                      <option>Parameter Threshold</option>
                      <option>Engine Running</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Buffer Size</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                      <option>1 Hour</option>
                      <option>4 Hours</option>
                      <option>8 Hours</option>
                      <option>24 Hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recorded Sessions</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Session_2026-03-20_14-30', duration: '45 min', size: '2.3 MB', parameters: 12 },
                    { name: 'Session_2026-03-19_09-15', duration: '2 hrs', size: '8.7 MB', parameters: 24 },
                    { name: 'Session_2026-03-18_16-45', duration: '30 min', size: '1.8 MB', parameters: 8 },
                  ].map((session) => (
                    <div key={session.name} className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <div>
                          <div className="text-white font-medium">{session.name}</div>
                          <div className="text-xs text-slate-500">
                            {session.duration} • {session.parameters} parameters • {session.size}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg">
                          <LineChart className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg">
                          <Download className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg">
                          <Trash2 className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
