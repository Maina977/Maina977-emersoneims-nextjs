'use client';

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║   PROFESSIONAL DIAGNOSTIC TOOLS - Generator Oracle                            ║
 * ║   10 Dealer-Level Diagnostic Interfaces                                        ║
 * ║   Copyright © 2024-2026 EmersonEIMS. All Rights Reserved.                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * DISCLAIMER: These are independently developed diagnostic reference interfaces.
 * NOT affiliated with any equipment manufacturer. All designs are original.
 * Brand references are for compatibility indication only.
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  searchFaultCodes,
  getFaultCodesByBrand,
  getTotalFaultCodeCount,
  type ControllerFaultCode,
} from '@/lib/generator-oracle/controllerFaultCodes';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Settings,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Save,
  Trash2,
  Play,
  Pause,
  Square,
  BarChart3,
  Cpu,
  Database,
  Wifi,
  Battery,
  Thermometer,
  Gauge,
  Power,
  Cable,
  Monitor,
  HardDrive,
  Search,
  FileText,
  Wrench,
  Eye,
  PenTool,
  Layers,
  Grid,
  List,
  Clock,
  Calendar,
  User,
  Lock,
  Unlock,
  Info,
  HelpCircle,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  Menu,
  Home,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Printer,
  Share2,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Bluetooth,
  Usb,
  Radio,
  Signal,
  MapPin,
  Fuel,
  Droplets,
  Wind,
  Flame,
  CircuitBoard,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

interface GeneratorInfo {
  make: string;
  model: string;
  kva: number;
  serialNumber: string;
  engineModel: string;
  controllerType: string;
  hours: number;
}

interface DiagnosticTool {
  id: string;
  name: string;
  shortName: string;
  compatibleWith: string[];
  icon: React.ReactNode;
  primaryColor: string;
  secondaryColor: string;
  screenColor: string;
  textColor: string;
  description: string;
}

interface FaultCode {
  code: string;
  spn?: number;
  fmi?: number;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'logged' | 'pending';
  count: number;
  firstOccurrence: string;
  lastOccurrence: string;
}

interface LiveParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: 'normal' | 'warning' | 'critical';
}

interface TechnicianInput {
  problemDescription: string;
  symptoms: string[];
  observedConditions: {
    engineStarts: boolean | null;
    engineRuns: boolean | null;
    generatorProducesVoltage: boolean | null;
    loadCapable: boolean | null;
    alarmsPresent: boolean | null;
    unusualSounds: boolean | null;
    visibleSmoke: boolean | null;
    fluidLeaks: boolean | null;
  };
  measurements: {
    batteryVoltage: string;
    oilPressure: string;
    coolantTemp: string;
    frequency: string;
    voltage: string;
  };
  recentMaintenance: string;
  environmentalFactors: string;
}

interface DiagnosticGuidance {
  step: number;
  title: string;
  instruction: string;
  expectedResult: string;
  ifPasses: string;
  ifFails: string;
  tools: string[];
  safetyNotes: string[];
}

interface FollowUpQuestion {
  id: string;
  question: string;
  options: string[];
  selectedAnswer: string | null;
  impact: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIAGNOSTIC TOOLS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DIAGNOSTIC_TOOLS: DiagnosticTool[] = [
  {
    id: 'heavy-equipment',
    name: 'Heavy Equipment Diagnostic Suite',
    shortName: 'HEDS',
    compatibleWith: ['Caterpillar', 'CAT', 'Olympian', 'FG Wilson'],
    icon: <Cpu className="w-6 h-6" />,
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    screenColor: '#1a1a0a',
    textColor: '#ffcc00',
    description: 'Professional diagnostic system for heavy equipment engines and generators',
  },
  {
    id: 'marine-engine',
    name: 'Marine Engine Diagnostic System',
    shortName: 'MEDS',
    compatibleWith: ['Volvo Penta', 'Marine', 'Industrial'],
    icon: <Activity className="w-6 h-6" />,
    primaryColor: '#003057',
    secondaryColor: '#001a33',
    screenColor: '#0a1525',
    textColor: '#60a5fa',
    description: 'Complete marine and industrial engine diagnostic platform',
  },
  {
    id: 'industrial-analyzer',
    name: 'Industrial Engine Analyzer',
    shortName: 'IEA',
    compatibleWith: ['Cummins', 'Onan', 'Stamford'],
    icon: <BarChart3 className="w-6 h-6" />,
    primaryColor: '#DC2626',
    secondaryColor: '#991B1B',
    screenColor: '#1a0a0a',
    textColor: '#fca5a5',
    description: 'Advanced analysis tool for industrial diesel engines',
  },
  {
    id: 'controller-config',
    name: 'Controller Configuration Suite',
    shortName: 'CCS',
    compatibleWith: ['DSE', 'Deep Sea Electronics'],
    icon: <Settings className="w-6 h-6" />,
    primaryColor: '#1E40AF',
    secondaryColor: '#1E3A8A',
    screenColor: '#0a0f1a',
    textColor: '#93c5fd',
    description: 'Generator controller programming and configuration tool',
  },
  {
    id: 'intelligent-controller',
    name: 'Intelligent Controller Interface',
    shortName: 'ICI',
    compatibleWith: ['ComAp', 'InteliGen', 'InteliLite'],
    icon: <Sparkles className="w-6 h-6" />,
    primaryColor: '#EF4444',
    secondaryColor: '#DC2626',
    screenColor: '#1a0f0f',
    textColor: '#fecaca',
    description: 'Smart controller diagnostics and configuration platform',
  },
  {
    id: 'precision-governor',
    name: 'Precision Governor Diagnostic',
    shortName: 'PGD',
    compatibleWith: ['Woodward', 'EasyGen', 'Governor'],
    icon: <Sliders className="w-6 h-6" />,
    primaryColor: '#059669',
    secondaryColor: '#047857',
    screenColor: '#0a1a0f',
    textColor: '#6ee7b7',
    description: 'Governor and speed control system diagnostic tool',
  },
  {
    id: 'service-terminal',
    name: 'Engine Service Terminal',
    shortName: 'EST',
    compatibleWith: ['Perkins', 'Massey Ferguson'],
    icon: <HardDrive className="w-6 h-6" />,
    primaryColor: '#7C3AED',
    secondaryColor: '#6D28D9',
    screenColor: '#0f0a1a',
    textColor: '#c4b5fd',
    description: 'Comprehensive engine service and diagnostic terminal',
  },
  {
    id: 'agri-power',
    name: 'Agricultural Power Diagnostic',
    shortName: 'APD',
    compatibleWith: ['John Deere', 'Agricultural', 'Farming'],
    icon: <Sun className="w-6 h-6" />,
    primaryColor: '#16A34A',
    secondaryColor: '#15803D',
    screenColor: '#0a1a0a',
    textColor: '#86efac',
    description: 'Agricultural and farming equipment diagnostic system',
  },
  {
    id: 'high-power',
    name: 'High-Power Engine Analyzer',
    shortName: 'HPEA',
    compatibleWith: ['MTU', 'Rolls-Royce', 'High Power'],
    icon: <Zap className="w-6 h-6" />,
    primaryColor: '#0891B2',
    secondaryColor: '#0E7490',
    screenColor: '#0a1a1f',
    textColor: '#67e8f9',
    description: 'High-power engine diagnostic and analysis platform',
  },
  {
    id: 'standby-power',
    name: 'Standby Power Diagnostic',
    shortName: 'SPD',
    compatibleWith: ['Kohler', 'Generac', 'Standby'],
    icon: <Battery className="w-6 h-6" />,
    primaryColor: '#4F46E5',
    secondaryColor: '#4338CA',
    screenColor: '#0f0a1f',
    textColor: '#a5b4fc',
    description: 'Standby and backup power system diagnostic tool',
  },
];

// Comprehensive live parameters - Based on CAT ET, VODIA, and professional diagnostic tools
const generateLiveParameters = (): LiveParameter[] => [
  // Engine Core Parameters
  { id: 'rpm', name: 'Engine Speed', value: 1500 + Math.random() * 10 - 5, unit: 'RPM', min: 0, max: 2000, status: 'normal' },
  { id: 'desired_rpm', name: 'Desired Engine Speed', value: 1500, unit: 'RPM', min: 0, max: 2000, status: 'normal' },
  { id: 'engine_hours', name: 'Total Engine Hours', value: 4567 + Math.random() * 0.01, unit: 'hrs', min: 0, max: 100000, status: 'normal' },
  { id: 'engine_load', name: 'Engine Load', value: 65 + Math.random() * 5, unit: '%', min: 0, max: 100, status: 'normal' },
  { id: 'throttle_pos', name: 'Throttle Position', value: 68 + Math.random() * 2, unit: '%', min: 0, max: 100, status: 'normal' },

  // Oil System
  { id: 'oil_pressure', name: 'Engine Oil Pressure', value: 4.2 + Math.random() * 0.3, unit: 'bar', min: 0, max: 10, status: 'normal' },
  { id: 'oil_temp', name: 'Engine Oil Temperature', value: 92 + Math.random() * 3, unit: '°C', min: 0, max: 150, status: 'normal' },
  { id: 'oil_level', name: 'Oil Level', value: 85 + Math.random() * 2, unit: '%', min: 0, max: 100, status: 'normal' },

  // Cooling System
  { id: 'coolant_temp', name: 'Coolant Temperature', value: 85 + Math.random() * 2, unit: '°C', min: 0, max: 120, status: 'normal' },
  { id: 'coolant_level', name: 'Coolant Level', value: 92 + Math.random() * 3, unit: '%', min: 0, max: 100, status: 'normal' },
  { id: 'coolant_pressure', name: 'Coolant Pressure', value: 1.2 + Math.random() * 0.1, unit: 'bar', min: 0, max: 3, status: 'normal' },
  { id: 'radiator_outlet', name: 'Radiator Outlet Temp', value: 78 + Math.random() * 2, unit: '°C', min: 0, max: 100, status: 'normal' },

  // Fuel System
  { id: 'fuel_pressure', name: 'Fuel Rail Pressure', value: 1800 + Math.random() * 50, unit: 'bar', min: 0, max: 2500, status: 'normal' },
  { id: 'fuel_temp', name: 'Fuel Temperature', value: 42 + Math.random() * 2, unit: '°C', min: 0, max: 80, status: 'normal' },
  { id: 'fuel_rate', name: 'Fuel Consumption Rate', value: 45 + Math.random() * 5, unit: 'L/hr', min: 0, max: 200, status: 'normal' },
  { id: 'fuel_level', name: 'Fuel Tank Level', value: 72 + Math.random() * 1, unit: '%', min: 0, max: 100, status: 'normal' },
  { id: 'injection_timing', name: 'Injection Timing', value: 12 + Math.random() * 0.5, unit: '°BTDC', min: -10, max: 30, status: 'normal' },

  // Turbo/Air Intake
  { id: 'boost_pressure', name: 'Boost Pressure', value: 1.8 + Math.random() * 0.1, unit: 'bar', min: 0, max: 4, status: 'normal' },
  { id: 'intake_manifold_temp', name: 'Intake Manifold Temp', value: 48 + Math.random() * 3, unit: '°C', min: 0, max: 100, status: 'normal' },
  { id: 'intake_manifold_press', name: 'Intake Manifold Pressure', value: 2.1 + Math.random() * 0.1, unit: 'bar', min: 0, max: 5, status: 'normal' },
  { id: 'turbo_speed', name: 'Turbo Speed', value: 85000 + Math.random() * 2000, unit: 'RPM', min: 0, max: 150000, status: 'normal' },
  { id: 'air_filter_diff', name: 'Air Filter Restriction', value: 2.5 + Math.random() * 0.5, unit: 'kPa', min: 0, max: 10, status: 'normal' },

  // Exhaust System
  { id: 'exhaust_temp', name: 'Exhaust Gas Temp', value: 520 + Math.random() * 20, unit: '°C', min: 0, max: 800, status: 'normal' },
  { id: 'exhaust_press', name: 'Exhaust Backpressure', value: 3.2 + Math.random() * 0.3, unit: 'kPa', min: 0, max: 15, status: 'normal' },
  { id: 'dpf_soot_load', name: 'DPF Soot Load', value: 35 + Math.random() * 5, unit: '%', min: 0, max: 100, status: 'normal' },
  { id: 'dpf_diff_press', name: 'DPF Differential Pressure', value: 8 + Math.random() * 1, unit: 'kPa', min: 0, max: 25, status: 'normal' },

  // Electrical System
  { id: 'battery_voltage', name: 'Battery Voltage', value: 27.8 + Math.random() * 0.2, unit: 'V', min: 20, max: 32, status: 'normal' },
  { id: 'charge_voltage', name: 'Charging Voltage', value: 28.4 + Math.random() * 0.3, unit: 'V', min: 20, max: 32, status: 'normal' },
  { id: 'alternator_current', name: 'Alternator Current', value: 45 + Math.random() * 5, unit: 'A', min: 0, max: 200, status: 'normal' },
  { id: 'starter_current', name: 'Last Starter Current', value: 850, unit: 'A', min: 0, max: 2000, status: 'normal' },

  // Generator Output
  { id: 'gen_voltage_l1', name: 'Generator Voltage L1-N', value: 230 + Math.random() * 2, unit: 'V', min: 0, max: 300, status: 'normal' },
  { id: 'gen_voltage_l2', name: 'Generator Voltage L2-N', value: 231 + Math.random() * 2, unit: 'V', min: 0, max: 300, status: 'normal' },
  { id: 'gen_voltage_l3', name: 'Generator Voltage L3-N', value: 229 + Math.random() * 2, unit: 'V', min: 0, max: 300, status: 'normal' },
  { id: 'gen_current_l1', name: 'Generator Current L1', value: 520 + Math.random() * 20, unit: 'A', min: 0, max: 2000, status: 'normal' },
  { id: 'gen_current_l2', name: 'Generator Current L2', value: 515 + Math.random() * 20, unit: 'A', min: 0, max: 2000, status: 'normal' },
  { id: 'gen_current_l3', name: 'Generator Current L3', value: 525 + Math.random() * 20, unit: 'A', min: 0, max: 2000, status: 'normal' },
  { id: 'frequency', name: 'Output Frequency', value: 50 + Math.random() * 0.1 - 0.05, unit: 'Hz', min: 45, max: 55, status: 'normal' },
  { id: 'power_kw', name: 'Active Power (kW)', value: 450 + Math.random() * 20, unit: 'kW', min: 0, max: 750, status: 'normal' },
  { id: 'power_kva', name: 'Apparent Power (kVA)', value: 485 + Math.random() * 20, unit: 'kVA', min: 0, max: 800, status: 'normal' },
  { id: 'power_kvar', name: 'Reactive Power (kVAR)', value: 145 + Math.random() * 10, unit: 'kVAR', min: 0, max: 400, status: 'normal' },
  { id: 'power_factor', name: 'Power Factor', value: 0.92 + Math.random() * 0.02, unit: '', min: 0, max: 1, status: 'normal' },

  // AVR/Excitation
  { id: 'excitation_voltage', name: 'Excitation Voltage', value: 28 + Math.random() * 2, unit: 'V', min: 0, max: 50, status: 'normal' },
  { id: 'excitation_current', name: 'Excitation Current', value: 4.5 + Math.random() * 0.5, unit: 'A', min: 0, max: 15, status: 'normal' },
  { id: 'avr_trim', name: 'AVR Voltage Trim', value: 0, unit: '%', min: -10, max: 10, status: 'normal' },
];

// Comprehensive fault codes - Based on J1939/SPN/FMI standards used by CAT ET, VODIA, etc.
const SAMPLE_FAULTS: FaultCode[] = [
  // Active Faults
  { code: 'SPN 110 FMI 16', spn: 110, fmi: 16, description: 'Engine Coolant Temperature - High Warning', severity: 'warning', status: 'active', count: 1, firstOccurrence: '2026-03-20 11:45', lastOccurrence: '2026-03-20 11:45' },
  { code: 'SPN 3226 FMI 0', spn: 3226, fmi: 0, description: 'Aftertreatment DPF Soot Load - Above Normal', severity: 'warning', status: 'active', count: 1, firstOccurrence: '2026-03-21 08:30', lastOccurrence: '2026-03-21 08:30' },

  // Logged Faults (History)
  { code: 'SPN 100 FMI 4', spn: 100, fmi: 4, description: 'Engine Oil Pressure - Voltage Below Normal', severity: 'warning', status: 'logged', count: 2, firstOccurrence: '2026-03-15 14:32', lastOccurrence: '2026-03-18 09:15' },
  { code: 'SPN 190 FMI 0', spn: 190, fmi: 0, description: 'Engine Speed - Data Valid Above Normal (Overspeed Event)', severity: 'critical', status: 'logged', count: 1, firstOccurrence: '2026-03-10 08:00', lastOccurrence: '2026-03-10 08:00' },
  { code: 'SPN 94 FMI 1', spn: 94, fmi: 1, description: 'Fuel Delivery Pressure - Data Valid But Below Normal', severity: 'warning', status: 'logged', count: 3, firstOccurrence: '2026-03-05 16:20', lastOccurrence: '2026-03-12 10:45' },
  { code: 'SPN 102 FMI 16', spn: 102, fmi: 16, description: 'Boost Pressure - High Warning (Possible Turbo Issue)', severity: 'warning', status: 'logged', count: 1, firstOccurrence: '2026-03-08 14:15', lastOccurrence: '2026-03-08 14:15' },
  { code: 'SPN 168 FMI 18', spn: 168, fmi: 18, description: 'Battery Potential - Low Warning', severity: 'info', status: 'logged', count: 4, firstOccurrence: '2026-02-28 06:00', lastOccurrence: '2026-03-15 06:30' },
  { code: 'SPN 91 FMI 3', spn: 91, fmi: 3, description: 'Throttle Position Sensor - Voltage Above Normal', severity: 'warning', status: 'logged', count: 1, firstOccurrence: '2026-03-01 09:00', lastOccurrence: '2026-03-01 09:00' },
  { code: 'SPN 1569 FMI 31', spn: 1569, fmi: 31, description: 'Engine Protection Torque Derate - Active', severity: 'info', status: 'logged', count: 2, firstOccurrence: '2026-03-10 08:05', lastOccurrence: '2026-03-15 14:40' },
  { code: 'SPN 3719 FMI 16', spn: 3719, fmi: 16, description: 'Aftertreatment Exhaust Gas Temp - High Warning', severity: 'warning', status: 'logged', count: 1, firstOccurrence: '2026-03-18 13:20', lastOccurrence: '2026-03-18 13:20' },

  // Pending Faults
  { code: 'SPN 105 FMI 15', spn: 105, fmi: 15, description: 'Intake Manifold Temperature - High Caution', severity: 'info', status: 'pending', count: 1, firstOccurrence: '2026-03-21 10:00', lastOccurrence: '2026-03-21 10:00' },
];

// Cylinder cutout test data
interface CylinderTestResult {
  cylinder: number;
  rpmDrop: number;
  contribution: number;
  status: 'normal' | 'weak' | 'faulty';
}

// Injector calibration data
interface InjectorCalibration {
  cylinder: number;
  trimCode: string;
  currentTrim: number;
  flow: number;
  status: 'calibrated' | 'needs_calibration';
}

// Freeze Frame Data - Snapshot when fault occurred
interface FreezeFrameData {
  faultCode: string;
  timestamp: string;
  engineHours: number;
  parameters: {
    name: string;
    value: number;
    unit: string;
  }[];
}

// ECU Configuration Backup
interface ECUBackup {
  id: string;
  name: string;
  date: string;
  ecuSerial: string;
  softwareVersion: string;
  parameterCount: number;
  size: string;
}

// Component Health Score
interface ComponentHealth {
  component: string;
  healthScore: number;
  trend: 'improving' | 'stable' | 'degrading';
  lastService: string;
  nextService: string;
  alerts: string[];
}

// Service Documentation
interface ServiceDocument {
  id: string;
  title: string;
  type: 'manual' | 'bulletin' | 'tsb' | 'recall';
  date: string;
  relevance: 'high' | 'medium' | 'low';
}

// Sample Freeze Frame Data
const SAMPLE_FREEZE_FRAMES: FreezeFrameData[] = [
  {
    faultCode: 'SPN 110 FMI 16',
    timestamp: '2026-03-20 11:45:32',
    engineHours: 4562,
    parameters: [
      { name: 'Engine RPM', value: 1498, unit: 'RPM' },
      { name: 'Coolant Temp', value: 102, unit: '°C' },
      { name: 'Oil Pressure', value: 4.1, unit: 'bar' },
      { name: 'Boost Pressure', value: 1.9, unit: 'bar' },
      { name: 'Fuel Temp', value: 48, unit: '°C' },
      { name: 'Ambient Temp', value: 38, unit: '°C' },
      { name: 'Engine Load', value: 78, unit: '%' },
      { name: 'Battery Voltage', value: 27.6, unit: 'V' },
    ],
  },
  {
    faultCode: 'SPN 100 FMI 4',
    timestamp: '2026-03-18 09:15:08',
    engineHours: 4558,
    parameters: [
      { name: 'Engine RPM', value: 1502, unit: 'RPM' },
      { name: 'Coolant Temp', value: 85, unit: '°C' },
      { name: 'Oil Pressure', value: 2.8, unit: 'bar' },
      { name: 'Oil Temp', value: 95, unit: '°C' },
      { name: 'Fuel Pressure', value: 1780, unit: 'bar' },
      { name: 'Engine Load', value: 45, unit: '%' },
      { name: 'Battery Voltage', value: 27.8, unit: 'V' },
      { name: 'Intake Temp', value: 42, unit: '°C' },
    ],
  },
];

// Sample ECU Backups
const SAMPLE_ECU_BACKUPS: ECUBackup[] = [
  { id: 'backup1', name: 'Factory Default', date: '2024-01-15', ecuSerial: 'ECU-2024-00123', softwareVersion: 'v3.2.1', parameterCount: 245, size: '128 KB' },
  { id: 'backup2', name: 'Pre-Service Backup', date: '2026-02-20', ecuSerial: 'ECU-2024-00123', softwareVersion: 'v3.2.1', parameterCount: 245, size: '128 KB' },
  { id: 'backup3', name: 'Optimized Settings', date: '2026-03-01', ecuSerial: 'ECU-2024-00123', softwareVersion: 'v3.2.1', parameterCount: 245, size: '128 KB' },
];

// Sample Component Health Data
const SAMPLE_COMPONENT_HEALTH: ComponentHealth[] = [
  { component: 'Engine Oil System', healthScore: 85, trend: 'stable', lastService: '2026-02-15', nextService: '2026-05-15', alerts: [] },
  { component: 'Cooling System', healthScore: 72, trend: 'degrading', lastService: '2025-11-20', nextService: '2026-04-01', alerts: ['Coolant temp trending high', 'Recommend coolant flush'] },
  { component: 'Fuel System', healthScore: 91, trend: 'stable', lastService: '2026-01-10', nextService: '2026-07-10', alerts: [] },
  { component: 'Air Intake/Turbo', healthScore: 88, trend: 'stable', lastService: '2026-02-15', nextService: '2026-08-15', alerts: [] },
  { component: 'Electrical System', healthScore: 95, trend: 'improving', lastService: '2026-03-01', nextService: '2026-09-01', alerts: [] },
  { component: 'Aftertreatment (DPF)', healthScore: 65, trend: 'degrading', lastService: '2025-10-05', nextService: '2026-04-05', alerts: ['DPF soot load elevated', 'Regen cycle recommended'] },
  { component: 'Generator/AVR', healthScore: 94, trend: 'stable', lastService: '2026-01-20', nextService: '2026-07-20', alerts: [] },
  { component: 'Governor/Speed Control', healthScore: 89, trend: 'stable', lastService: '2026-02-01', nextService: '2026-08-01', alerts: [] },
];

// Sample Service Documents
const SAMPLE_SERVICE_DOCS: ServiceDocument[] = [
  { id: 'doc1', title: 'Engine Oil Specifications & Change Intervals', type: 'manual', date: '2024-06-15', relevance: 'high' },
  { id: 'doc2', title: 'TSB-2026-003: High Coolant Temperature Issues', type: 'tsb', date: '2026-02-28', relevance: 'high' },
  { id: 'doc3', title: 'DPF Regeneration Procedures', type: 'manual', date: '2024-03-10', relevance: 'high' },
  { id: 'doc4', title: 'SB-2025-018: Fuel Injector Calibration Update', type: 'bulletin', date: '2025-09-15', relevance: 'medium' },
  { id: 'doc5', title: 'Controller Software Update v3.2.2', type: 'bulletin', date: '2026-03-01', relevance: 'medium' },
  { id: 'doc6', title: 'Turbocharger Maintenance Guide', type: 'manual', date: '2024-01-20', relevance: 'low' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DIAGNOSTIC TOOL INTERFACE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface DiagnosticToolInterfaceProps {
  tool: DiagnosticTool;
  generatorInfo: GeneratorInfo;
  onClose: () => void;
  onAIAnalyze: () => void;
}

function DiagnosticToolInterface({ tool, generatorInfo, onClose, onAIAnalyze }: DiagnosticToolInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'monitor' | 'faults' | 'params' | 'wiring' | 'tests' | 'config' | 'techinput' | 'health' | 'backup' | 'reports' | 'docs'>('monitor');
  const [liveParams, setLiveParams] = useState<LiveParameter[]>(generateLiveParameters());
  const [faults, setFaults] = useState<FaultCode[]>(SAMPLE_FAULTS);
  const [isConnected, setIsConnected] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [selectedFreezeFrame, setSelectedFreezeFrame] = useState<FreezeFrameData | null>(null);
  const [dataHistory, setDataHistory] = useState<{time: string; rpm: number; temp: number; load: number}[]>([]);

  // Technician Input State
  const [techInput, setTechInput] = useState<TechnicianInput>({
    problemDescription: '',
    symptoms: [],
    observedConditions: {
      engineStarts: null,
      engineRuns: null,
      generatorProducesVoltage: null,
      loadCapable: null,
      alarmsPresent: null,
      unusualSounds: null,
      visibleSmoke: null,
      fluidLeaks: null,
    },
    measurements: {
      batteryVoltage: '',
      oilPressure: '',
      coolantTemp: '',
      frequency: '',
      voltage: '',
    },
    recentMaintenance: '',
    environmentalFactors: '',
  });

  const [faultCodeSearch, setFaultCodeSearch] = useState('');
  const [searchResults, setSearchResults] = useState<ControllerFaultCode[]>([]);
  const [selectedDbFault, setSelectedDbFault] = useState<ControllerFaultCode | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [diagnosticGuidance, setDiagnosticGuidance] = useState<DiagnosticGuidance[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);

  // Total fault codes available
  const totalFaultCodes = useMemo(() => getTotalFaultCodeCount(), []);

  // Search fault codes from 400k database
  const handleFaultCodeSearch = useCallback((query: string) => {
    setFaultCodeSearch(query);
    if (query.length >= 2) {
      const results = searchFaultCodes(query).slice(0, 20);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, []);

  // Generate follow-up questions based on symptoms
  const generateFollowUpQuestions = useCallback(() => {
    const questions: FollowUpQuestion[] = [];

    if (techInput.observedConditions.engineStarts === false) {
      questions.push({
        id: 'starter-sound',
        question: 'What sound does the starter motor make when cranking is attempted?',
        options: ['No sound at all', 'Clicking sound only', 'Starter spins but engine does not turn', 'Normal cranking sound but no start', 'Grinding noise'],
        selectedAnswer: null,
        impact: 'Determines if issue is electrical (battery/starter) or mechanical',
      });
      questions.push({
        id: 'battery-condition',
        question: 'What is the exact battery voltage measured at the terminals under load?',
        options: ['Below 10V', '10-11V', '11-12V', '12-12.6V', 'Above 12.6V'],
        selectedAnswer: null,
        impact: 'Battery voltage under cranking load indicates battery health',
      });
    }

    if (techInput.observedConditions.engineRuns === false && techInput.observedConditions.engineStarts === true) {
      questions.push({
        id: 'runtime-before-stall',
        question: 'How long does the engine run before stopping?',
        options: ['Less than 5 seconds', '5-30 seconds', '30 seconds to 2 minutes', '2-5 minutes', 'Random/unpredictable'],
        selectedAnswer: null,
        impact: 'Runtime duration helps isolate fuel, air, or sensor issues',
      });
      questions.push({
        id: 'stall-conditions',
        question: 'Under what conditions does the engine stop?',
        options: ['Always at same RPM', 'When applying load', 'Only at idle', 'After reaching temperature', 'Sudden cutout without warning'],
        selectedAnswer: null,
        impact: 'Stall conditions point to specific protection circuits or sensor faults',
      });
    }

    if (techInput.observedConditions.alarmsPresent === true) {
      questions.push({
        id: 'alarm-type',
        question: 'What alarm codes are displayed on the controller?',
        options: ['Low oil pressure', 'High coolant temperature', 'Overspeed', 'Fail to start', 'Emergency stop active', 'Other fault code'],
        selectedAnswer: null,
        impact: 'Alarm codes directly indicate the protection that triggered',
      });
    }

    if (techInput.observedConditions.generatorProducesVoltage === false) {
      questions.push({
        id: 'voltage-reading',
        question: 'What voltage is measured at the generator output terminals?',
        options: ['0V (no voltage)', '1-50V (residual only)', '50-150V (low)', '150-350V (partial)', '350-400V but unstable'],
        selectedAnswer: null,
        impact: 'Voltage level determines AVR, excitation, or winding issues',
      });
      questions.push({
        id: 'avr-indicator',
        question: 'Are there any indicator LEDs or displays on the AVR?',
        options: ['No LEDs visible', 'Green LED steady', 'Red LED flashing', 'No power to AVR', 'AVR has no indicators'],
        selectedAnswer: null,
        impact: 'AVR status helps isolate voltage regulation issues',
      });
    }

    if (techInput.observedConditions.unusualSounds === true) {
      questions.push({
        id: 'sound-type',
        question: 'Describe the unusual sound in detail:',
        options: ['Knocking from engine', 'Squealing/belt noise', 'Electrical buzzing', 'Exhaust backfire', 'Turbo whistle abnormal', 'Metallic grinding'],
        selectedAnswer: null,
        impact: 'Sound characteristics indicate mechanical or component failure',
      });
    }

    if (techInput.observedConditions.visibleSmoke === true) {
      questions.push({
        id: 'smoke-color',
        question: 'What color is the exhaust smoke?',
        options: ['White smoke (coolant)', 'Blue smoke (oil burning)', 'Black smoke (rich mixture)', 'Grey smoke', 'Smoke from engine bay not exhaust'],
        selectedAnswer: null,
        impact: 'Smoke color directly indicates type of combustion issue',
      });
    }

    // Always ask about recent events
    questions.push({
      id: 'recent-changes',
      question: 'Have there been any recent changes or events before this problem started?',
      options: ['No recent changes', 'Recent fuel delivery', 'Recent maintenance/service', 'Power outage/overload event', 'Environmental factors (flooding, dust, etc.)', 'Equipment was idle for extended period'],
      selectedAnswer: null,
      impact: 'Recent events often correlate directly with failure modes',
    });

    setFollowUpQuestions(questions);
  }, [techInput.observedConditions]);

  // Generate diagnostic guidance based on all inputs
  const generateDiagnosticGuidance = useCallback(() => {
    const guidance: DiagnosticGuidance[] = [];
    let step = 1;

    // Engine won't start - comprehensive guidance
    if (techInput.observedConditions.engineStarts === false) {
      guidance.push({
        step: step++,
        title: 'Verify Battery & Starting Circuit',
        instruction: 'Measure battery voltage at terminals with multimeter. Should read 12.6V+ for 12V system or 25.2V+ for 24V system. Check battery connections for corrosion and tightness. Measure voltage at starter solenoid when cranking.',
        expectedResult: 'Battery voltage above 12.6V (or 25.2V), voltage present at starter when key in crank position',
        ifPasses: 'Battery and basic wiring is good - proceed to fuel system check',
        ifFails: 'Charge or replace battery, clean connections, check fuses and wiring to starter',
        tools: ['Digital Multimeter', 'Battery Load Tester', 'Wire Brush'],
        safetyNotes: ['Disconnect battery before cleaning terminals', 'Wear safety glasses', 'Keep sparks away from battery'],
      });

      guidance.push({
        step: step++,
        title: 'Check Fuel System',
        instruction: 'Verify fuel level in tank. Check fuel filter condition. Bleed fuel system at injection pump. Listen for electric fuel pump operation (if equipped). Check for air in fuel lines.',
        expectedResult: 'Fuel present at injectors, no air in system, filter clean',
        ifPasses: 'Fuel system OK - proceed to check compression and timing',
        ifFails: 'Replace fuel filter, bleed system completely, check fuel pump, inspect tank for contamination',
        tools: ['Fuel Pressure Gauge', 'Clear Tubing for Bleeding', 'Fuel Filter Wrench'],
        safetyNotes: ['No smoking or open flames', 'Have fire extinguisher ready', 'Collect spilled fuel properly'],
      });

      guidance.push({
        step: step++,
        title: 'Verify Controller Inputs',
        instruction: 'Check controller display for fault codes. Verify emergency stop is not engaged. Check all safety interlocks (door switches, oil level, etc.). Review controller event log for shutdown reasons.',
        expectedResult: 'No blocking faults, all safety interlocks satisfied, controller in AUTO or MANUAL mode ready to start',
        ifPasses: 'Controller ready - check mechanical systems',
        ifFails: 'Clear faults after addressing root cause, reset emergency stop, satisfy all interlocks',
        tools: ['Controller Manual', 'Diagnostic Software', 'PC with Interface Cable'],
        safetyNotes: ['Understand fault before clearing', 'Document all codes for records'],
      });
    }

    // Engine runs but no voltage
    if (techInput.observedConditions.engineRuns === true && techInput.observedConditions.generatorProducesVoltage === false) {
      guidance.push({
        step: step++,
        title: 'Check AVR Power Supply',
        instruction: 'Measure AC voltage at AVR input terminals from auxiliary winding. Should be 170-250VAC depending on configuration. Check AVR fuse if present. Verify wiring connections are secure.',
        expectedResult: '170-250VAC at AVR input terminals',
        ifPasses: 'AVR has power - check sensing and output circuits',
        ifFails: 'Check auxiliary winding, verify wiring, replace damaged conductors',
        tools: ['AC Voltmeter', 'AVR Wiring Diagram', 'Insulated Screwdrivers'],
        safetyNotes: ['High voltage present - use insulated tools', 'Do not touch live terminals', 'Kill engine before disconnecting wires'],
      });

      guidance.push({
        step: step++,
        title: 'Test Residual Magnetism',
        instruction: 'Measure output voltage at generator terminals. Even without AVR, residual magnetism should produce 5-20V. If zero volts, generator may need to be "flashed" to restore magnetism.',
        expectedResult: '5-20V residual voltage from generator windings',
        ifPasses: 'Residual magnetism present - AVR or sensing circuit likely at fault',
        ifFails: 'Flash the field: momentarily apply DC to rotor/field winding using battery',
        tools: ['AC Voltmeter', 'Jumper Wires', '12V Battery for Flashing'],
        safetyNotes: ['Flash with engine OFF only', 'Brief 2-3 second flash only', 'Observe polarity if marked'],
      });

      guidance.push({
        step: step++,
        title: 'Test AVR Output',
        instruction: 'With AVR powered and engine running, measure DC output from AVR to rotor/field. Should increase as AVR tries to build voltage. Check voltage adjustment potentiometer setting.',
        expectedResult: '30-120VDC at AVR output depending on model and load',
        ifPasses: 'AVR producing output - check exciter and rotor circuit',
        ifFails: 'AVR may be faulty - check stability pot, sensing connections. Replace AVR if confirmed bad.',
        tools: ['DC Voltmeter', 'AVR Technical Manual', 'Small Screwdriver for Pot'],
        safetyNotes: ['Rotating equipment danger', 'High DC voltage on field circuit'],
      });
    }

    // Overheating issues
    if (techInput.symptoms.includes('overheating') || techInput.observedConditions.fluidLeaks === true) {
      guidance.push({
        step: step++,
        title: 'Inspect Cooling System',
        instruction: 'Check coolant level and condition. Inspect radiator for blockage (external debris, internal scaling). Check fan belt tension and condition. Test thermostat operation. Check water pump for leaks and proper operation.',
        expectedResult: 'Coolant full and clean, radiator clear, belt tight, thermostat opening at correct temp',
        ifPasses: 'Cooling system mechanically OK - check for loading or airflow issues',
        ifFails: 'Add/replace coolant, clean radiator, replace belt, replace thermostat or water pump as needed',
        tools: ['Coolant Tester', 'Pressure Tester', 'Infrared Thermometer', 'Belt Tension Gauge'],
        safetyNotes: ['Never open hot radiator', 'Coolant is toxic - dispose properly', 'Hot engine burns'],
      });
    }

    setDiagnosticGuidance(guidance);

    // Calculate confidence score based on completeness of information
    let completeness = 0;
    if (techInput.problemDescription.length > 20) completeness += 15;
    if (techInput.symptoms.length > 0) completeness += 15;
    Object.values(techInput.observedConditions).forEach(v => { if (v !== null) completeness += 5; });
    Object.values(techInput.measurements).forEach(v => { if (v && v.length > 0) completeness += 5; });
    const answeredQuestions = followUpQuestions.filter(q => q.selectedAnswer !== null).length;
    completeness += (answeredQuestions / Math.max(followUpQuestions.length, 1)) * 25;

    setConfidenceScore(Math.min(99, completeness));
    setAnalysisComplete(true);
  }, [techInput, followUpQuestions]);

  // Simulate live data updates
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setLiveParams(generateLiveParameters());
    }, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Status bar component
  const StatusBar = () => (
    <div className="flex items-center justify-between px-4 py-2 text-xs" style={{ backgroundColor: tool.secondaryColor }}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-white/80">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <span className="text-white/60">|</span>
        <span className="text-white/80">{generatorInfo.make} {generatorInfo.model}</span>
        <span className="text-white/60">|</span>
        <span className="text-white/80">{generatorInfo.kva} kVA</span>
        <span className="text-white/60">|</span>
        <span className="text-white/80">S/N: {generatorInfo.serialNumber}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white/80">{generatorInfo.hours.toLocaleString()} hrs</span>
        <span className="text-white/60">|</span>
        <span className="text-white/80">{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );

  // Navigation button component
  const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
        active
          ? 'text-white'
          : 'text-white/60 hover:text-white/80 hover:bg-white/5'
      }`}
      style={active ? { backgroundColor: tool.primaryColor } : {}}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  // Dropdown button component with smart positioning (opens up or down based on position)
  const DropdownButton = ({ id, label, options, onSelect, selectedValue }: { id: string; label: string; options: string[]; onSelect: (opt: string) => void; selectedValue?: string }) => {
    const [dropdownPosition, setDropdownPosition] = useState<'up' | 'down'>('down');
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
      if (showDropdown === id) {
        setShowDropdown(null);
      } else {
        // Check position to determine if dropdown should open up or down
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const dropdownHeight = Math.min(options.length * 40, 300); // Approximate height

          if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            setDropdownPosition('up');
          } else {
            setDropdownPosition('down');
          }
        }
        setShowDropdown(id);
      }
    };

    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white hover:bg-slate-700 hover:border-slate-500 transition-colors"
        >
          <span>{selectedValue || label}</span>
          {showDropdown === id ? (
            dropdownPosition === 'up' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {showDropdown === id && (
          <div
            className={`absolute left-0 w-56 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-[100] max-h-[300px] overflow-y-auto ${
              dropdownPosition === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
          >
            {options.map((opt, index) => (
              <button
                key={opt}
                onClick={() => { onSelect(opt); setShowDropdown(null); }}
                className={`w-full px-4 py-2.5 text-left text-sm text-white hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${index === options.length - 1 ? 'rounded-b-lg' : ''} ${
                  selectedValue === opt ? 'bg-cyan-500/10 text-cyan-400' : ''
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Live Monitor Tab
  const MonitorTab = () => (
    <div className="p-4 space-y-4">
      {/* Main gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {liveParams.slice(0, 4).map((param) => (
          <div key={param.id} className="p-4 rounded-xl border" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: tool.textColor + '80' }}>{param.name}</div>
            <div className="text-3xl font-bold font-mono" style={{ color: tool.textColor }}>
              {param.value.toFixed(1)}
            </div>
            <div className="text-xs" style={{ color: tool.textColor + '60' }}>{param.unit}</div>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 rounded-full bg-slate-700">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((param.value - param.min) / (param.max - param.min)) * 100}%`,
                  backgroundColor: param.status === 'normal' ? '#22c55e' : param.status === 'warning' ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Parameter list */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: tool.primaryColor + '40' }}>
        <div className="px-4 py-2 font-medium text-sm" style={{ backgroundColor: tool.primaryColor, color: 'white' }}>
          Live Parameters
        </div>
        <div className="divide-y divide-slate-700" style={{ backgroundColor: tool.screenColor }}>
          {liveParams.map((param) => (
            <div key={param.id} className="flex items-center justify-between px-4 py-2">
              <span className="text-sm" style={{ color: tool.textColor + 'cc' }}>{param.name}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm" style={{ color: tool.textColor }}>{param.value.toFixed(2)} {param.unit}</span>
                <div className={`w-2 h-2 rounded-full ${param.status === 'normal' ? 'bg-green-500' : param.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Fault Codes Tab
  const FaultsTab = () => (
    <div className="p-4 space-y-4">
      {/* Fault toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: tool.primaryColor }}>
            <RefreshCw className="w-4 h-4" />
            Read Codes
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600">
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded bg-red-500/20 text-red-400">{faults.filter(f => f.status === 'active').length} Active</span>
          <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400">{faults.filter(f => f.status === 'logged').length} Logged</span>
        </div>
      </div>

      {/* Fault list */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: tool.primaryColor + '40' }}>
        <table className="w-full text-sm" style={{ backgroundColor: tool.screenColor }}>
          <thead>
            <tr className="text-left" style={{ backgroundColor: tool.primaryColor }}>
              <th className="px-4 py-2 text-white">Code</th>
              <th className="px-4 py-2 text-white">Description</th>
              <th className="px-4 py-2 text-white">Status</th>
              <th className="px-4 py-2 text-white">Count</th>
              <th className="px-4 py-2 text-white">Last Occurrence</th>
              <th className="px-4 py-2 text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {faults.map((fault) => (
              <tr key={fault.code} className="hover:bg-white/5 cursor-pointer" onClick={() => setSelectedFault(fault)}>
                <td className="px-4 py-3 font-mono" style={{ color: tool.textColor }}>{fault.code}</td>
                <td className="px-4 py-3" style={{ color: tool.textColor + 'cc' }}>{fault.description}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    fault.status === 'active' ? 'bg-red-500/20 text-red-400' :
                    fault.status === 'logged' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {fault.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center" style={{ color: tool.textColor + '80' }}>{fault.count}</td>
                <td className="px-4 py-3" style={{ color: tool.textColor + '80' }}>{fault.lastOccurrence}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded hover:bg-white/10">
                      <Info className="w-4 h-4" style={{ color: tool.textColor }} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-white/10">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected fault details */}
      {selectedFault && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border"
          style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>{selectedFault.code}</h3>
              <p style={{ color: tool.textColor + '80' }}>{selectedFault.description}</p>
            </div>
            <button onClick={() => setSelectedFault(null)} className="p-1">
              <X className="w-5 h-5" style={{ color: tool.textColor + '60' }} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span style={{ color: tool.textColor + '60' }}>SPN:</span>
              <span className="ml-2 font-mono" style={{ color: tool.textColor }}>{selectedFault.spn}</span>
            </div>
            <div>
              <span style={{ color: tool.textColor + '60' }}>FMI:</span>
              <span className="ml-2 font-mono" style={{ color: tool.textColor }}>{selectedFault.fmi}</span>
            </div>
            <div>
              <span style={{ color: tool.textColor + '60' }}>First Seen:</span>
              <span className="ml-2" style={{ color: tool.textColor }}>{selectedFault.firstOccurrence}</span>
            </div>
            <div>
              <span style={{ color: tool.textColor + '60' }}>Occurrences:</span>
              <span className="ml-2" style={{ color: tool.textColor }}>{selectedFault.count}</span>
            </div>
          </div>
          <button
            onClick={onAIAnalyze}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: tool.primaryColor }}
          >
            <Sparkles className="w-4 h-4" />
            AI Analyze This Fault
          </button>
        </motion.div>
      )}
    </div>
  );

  // Wiring Diagrams Tab - With Working Diagram Selection
  const WiringTab = () => {
    const [diagramType, setDiagramType] = useState<'Power Wiring' | 'Control Wiring' | 'Sensor Wiring' | 'CAN Bus' | 'Complete'>('Complete');

    return (
    <div className="p-4 space-y-4 ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>
          Wiring Diagrams - {generatorInfo.make} {generatorInfo.model} ({generatorInfo.kva} kVA)
        </h3>
        <div className="flex items-center gap-2">
          {/* Diagram Type Selector - Now Working */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            {(['Power Wiring', 'Control Wiring', 'Sensor Wiring', 'CAN Bus', 'Complete'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDiagramType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  diagramType === type
                    ? 'text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
                style={diagramType === type ? { backgroundColor: tool.primaryColor } : {}}
              >
                {type}
              </button>
            ))}
          </div>
          <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 hover:scale-105 transition-all" title="Print Diagram">
            <Printer className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 hover:scale-105 transition-all" title="Download PDF">
            <Download className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Diagram Type Description */}
      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
        <p className="text-sm" style={{ color: tool.textColor }}>
          {diagramType === 'Power Wiring' && 'Showing: Main power connections - Battery, starter, alternator charging circuit, and main power distribution.'}
          {diagramType === 'Control Wiring' && 'Showing: Controller connections - Start/stop circuits, safety interlocks, relay outputs, and indicator connections.'}
          {diagramType === 'Sensor Wiring' && 'Showing: Sensor circuits - Oil pressure, coolant temperature, speed pickup, fuel level, and auxiliary sensors.'}
          {diagramType === 'CAN Bus' && 'Showing: CAN bus network - J1939 data connections, ECM communications, and remote monitoring interfaces.'}
          {diagramType === 'Complete' && 'Showing: Complete system diagram - All wiring including power, control, sensors, and communications.'}
        </p>
      </div>

      {/* SVG Wiring Diagram */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: tool.primaryColor + '40' }}>
        <svg viewBox="0 0 800 500" className="w-full" style={{ backgroundColor: tool.screenColor }}>
          {/* Controller Box */}
          <rect x="300" y="50" width="200" height="120" rx="8" fill="#1e293b" stroke={tool.primaryColor} strokeWidth="2" />
          <text x="400" y="75" fill={tool.textColor} fontSize="12" textAnchor="middle" fontWeight="bold">
            {generatorInfo.controllerType || 'Controller'}
          </text>

          {/* Terminal strips */}
          {['B+', 'B-', 'GND', 'W', 'OIL', 'TEMP', 'FUEL', 'CRANK'].map((term, i) => (
            <g key={term}>
              <rect x={315 + (i % 4) * 45} y={90 + Math.floor(i / 4) * 35} width="35" height="25" rx="2" fill="#334155" stroke="#475569" />
              <text x={332 + (i % 4) * 45} y={107 + Math.floor(i / 4) * 35} fill={tool.textColor} fontSize="8" textAnchor="middle">{term}</text>
            </g>
          ))}

          {/* Engine Block */}
          <rect x="50" y="200" width="150" height="200" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <text x="125" y="230" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">{generatorInfo.engineModel || 'Engine'}</text>

          {/* Engine sensors */}
          {['Oil Sensor', 'Temp Sensor', 'Speed Pickup', 'Fuel Solenoid'].map((sensor, i) => (
            <g key={sensor}>
              <rect x="70" y={250 + i * 35} width="110" height="25" rx="2" fill="#334155" />
              <text x="125" y={267 + i * 35} fill="#94a3b8" fontSize="9" textAnchor="middle">{sensor}</text>
              {/* Wire to controller */}
              <path
                d={`M 180 ${262 + i * 35} Q 250 ${262 + i * 35} 315 ${105 + i * 8}`}
                stroke={['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'][i]}
                strokeWidth="2"
                fill="none"
              />
            </g>
          ))}

          {/* Generator/Alternator */}
          <rect x="550" y="200" width="150" height="150" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <text x="625" y="230" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">Alternator</text>
          <text x="625" y="250" fill="#64748b" fontSize="10" textAnchor="middle">{generatorInfo.kva} kVA</text>

          {/* Alternator terminals */}
          {['U', 'V', 'W', 'N', 'AVR+', 'AVR-'].map((term, i) => (
            <g key={term}>
              <rect x={565 + (i % 3) * 45} y={270 + Math.floor(i / 3) * 35} width="35" height="25" rx="2" fill="#334155" stroke="#475569" />
              <text x={582 + (i % 3) * 45} y={287 + Math.floor(i / 3) * 35} fill={tool.textColor} fontSize="8" textAnchor="middle">{term}</text>
            </g>
          ))}

          {/* Battery */}
          <rect x="50" y="50" width="100" height="80" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <text x="100" y="80" fill="#94a3b8" fontSize="10" textAnchor="middle">Battery</text>
          <rect x="60" y="95" width="35" height="20" rx="2" fill="#ef4444" />
          <text x="77" y="109" fill="white" fontSize="10" textAnchor="middle">+</text>
          <rect x="105" y="95" width="35" height="20" rx="2" fill="#1e293b" stroke="#475569" />
          <text x="122" y="109" fill="#94a3b8" fontSize="10" textAnchor="middle">-</text>

          {/* Battery to controller wiring */}
          <path d="M 150 85 L 200 85 Q 220 85 220 100 L 220 90 Q 220 105 240 105 L 300 105" stroke="#ef4444" strokeWidth="3" fill="none" />
          <path d="M 150 105 L 190 105 Q 210 105 210 120 L 210 130 Q 210 145 230 145 L 300 145" stroke="#475569" strokeWidth="3" fill="none" />

          {/* Controller to Alternator */}
          <path d="M 500 110 L 530 110 Q 550 110 550 130 L 550 200" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5,5" />

          {/* Legend */}
          <g transform="translate(550, 400)">
            <text x="0" y="0" fill="#94a3b8" fontSize="10" fontWeight="bold">Wire Colors:</text>
            <rect x="0" y="10" width="20" height="3" fill="#ef4444" />
            <text x="25" y="15" fill="#94a3b8" fontSize="8">+24V DC (Red)</text>
            <rect x="100" y="10" width="20" height="3" fill="#1e293b" stroke="#475569" />
            <text x="125" y="15" fill="#94a3b8" fontSize="8">Ground (Black)</text>
            <rect x="0" y="25" width="20" height="3" fill="#22c55e" />
            <text x="25" y="30" fill="#94a3b8" fontSize="8">Sensor Signal (Green)</text>
            <rect x="100" y="25" width="20" height="3" fill="#3b82f6" />
            <text x="125" y="30" fill="#94a3b8" fontSize="8">CAN Bus (Blue)</text>
          </g>

          {/* Title */}
          <text x="400" y="480" fill={tool.textColor} fontSize="14" textAnchor="middle" fontWeight="bold">
            {generatorInfo.make} {generatorInfo.model} - {generatorInfo.kva} kVA - Schematic Wiring Diagram
          </text>
        </svg>
      </div>

      {/* Connection table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: tool.primaryColor + '40' }}>
        <div className="px-4 py-2 font-medium text-sm" style={{ backgroundColor: tool.primaryColor, color: 'white' }}>
          Terminal Connections
        </div>
        <table className="w-full text-sm" style={{ backgroundColor: tool.screenColor }}>
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-2 text-left" style={{ color: tool.textColor }}>Terminal</th>
              <th className="px-4 py-2 text-left" style={{ color: tool.textColor }}>Function</th>
              <th className="px-4 py-2 text-left" style={{ color: tool.textColor }}>Wire Color</th>
              <th className="px-4 py-2 text-left" style={{ color: tool.textColor }}>Connects To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {[
              { terminal: 'B+', function: 'Battery Positive', color: 'Red 4mm²', connects: 'Battery + via 10A fuse' },
              { terminal: 'B-', function: 'Battery Negative', color: 'Black 4mm²', connects: 'Battery -' },
              { terminal: 'W', function: 'Speed Pickup', color: 'White/Blue shielded', connects: 'Magnetic pickup' },
              { terminal: 'OIL', function: 'Oil Pressure', color: 'Brown 1mm²', connects: 'Oil pressure sender' },
              { terminal: 'TEMP', function: 'Coolant Temp', color: 'Green 1mm²', connects: 'NTC temp sensor' },
              { terminal: 'CRANK', function: 'Starter Output', color: 'Yellow 2.5mm²', connects: 'Starter solenoid' },
            ].map((conn) => (
              <tr key={conn.terminal}>
                <td className="px-4 py-2 font-mono" style={{ color: tool.textColor }}>{conn.terminal}</td>
                <td className="px-4 py-2" style={{ color: tool.textColor + 'cc' }}>{conn.function}</td>
                <td className="px-4 py-2" style={{ color: tool.textColor + '80' }}>{conn.color}</td>
                <td className="px-4 py-2" style={{ color: tool.textColor + '80' }}>{conn.connects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  // Active Tests Tab - Professional diagnostic tests like CAT ET, VODIA
  const TestsTab = () => {
    const [activeTest, setActiveTest] = useState<string | null>(null);
    const [testProgress, setTestProgress] = useState(0);
    const [cylinderResults, setCylinderResults] = useState<CylinderTestResult[]>([]);

    const runCylinderTest = () => {
      setActiveTest('cylinder_cutout');
      setTestProgress(0);
      setCylinderResults([]);

      // Simulate cylinder cutout test
      const cylinders = [1, 2, 3, 4, 5, 6];
      let currentCyl = 0;

      const testInterval = setInterval(() => {
        if (currentCyl < cylinders.length) {
          const result: CylinderTestResult = {
            cylinder: cylinders[currentCyl],
            rpmDrop: 45 + Math.random() * 30,
            contribution: 14 + Math.random() * 5,
            status: Math.random() > 0.15 ? 'normal' : (Math.random() > 0.5 ? 'weak' : 'faulty'),
          };
          setCylinderResults(prev => [...prev, result]);
          currentCyl++;
          setTestProgress((currentCyl / cylinders.length) * 100);
        } else {
          clearInterval(testInterval);
          setActiveTest(null);
        }
      }, 1500);
    };

    const DIAGNOSTIC_TESTS = [
      // Engine Tests
      { category: 'Engine Diagnostics', tests: [
        { id: 'cylinder_cutout', name: 'Cylinder Cutout Test', desc: 'Disable each injector to identify weak cylinders', icon: <Fuel className="w-5 h-5" />, warning: true, duration: '2 min' },
        { id: 'compression', name: 'Relative Compression Test', desc: 'Compare compression across all cylinders via cranking speed', icon: <Activity className="w-5 h-5" />, warning: false, duration: '30 sec' },
        { id: 'valve_timing', name: 'Valve Timing Verification', desc: 'Check engine timing marks and cam/crank sync', icon: <Clock className="w-5 h-5" />, warning: false, duration: '1 min' },
        { id: 'injector_flow', name: 'Injector Flow Balance', desc: 'Compare fuel delivery across all injectors', icon: <Droplets className="w-5 h-5" />, warning: true, duration: '3 min' },
      ]},
      // Turbo/Air System Tests
      { category: 'Turbo & Air System', tests: [
        { id: 'turbo_test', name: 'Turbo Boost Test', desc: 'Verify turbo response and boost pressure under load', icon: <Wind className="w-5 h-5" />, warning: false, duration: '2 min' },
        { id: 'wastegate', name: 'Wastegate Actuator Test', desc: 'Test wastegate solenoid and actuator movement', icon: <ToggleRight className="w-5 h-5" />, warning: false, duration: '30 sec' },
        { id: 'air_intake', name: 'Air Intake System Test', desc: 'Check for intake restrictions and leaks', icon: <Wind className="w-5 h-5" />, warning: false, duration: '1 min' },
      ]},
      // Aftertreatment Tests
      { category: 'Aftertreatment (DPF/SCR)', tests: [
        { id: 'dpf_regen', name: 'Forced DPF Regeneration', desc: 'Initiate parked regeneration cycle to clean DPF', icon: <Flame className="w-5 h-5" />, warning: true, duration: '30-45 min' },
        { id: 'dpf_leak', name: 'DPF Leak Test', desc: 'Test for exhaust leaks in aftertreatment system', icon: <AlertTriangle className="w-5 h-5" />, warning: false, duration: '5 min' },
        { id: 'scr_test', name: 'SCR/DEF System Test', desc: 'Verify DEF injection and NOx reduction', icon: <Droplets className="w-5 h-5" />, warning: false, duration: '3 min' },
      ]},
      // Electrical Tests
      { category: 'Electrical System', tests: [
        { id: 'glow_plug', name: 'Glow Plug Test', desc: 'Test each glow plug resistance and current draw', icon: <Zap className="w-5 h-5" />, warning: false, duration: '1 min' },
        { id: 'starter', name: 'Starter Circuit Test', desc: 'Verify starter motor current draw and cranking speed', icon: <Power className="w-5 h-5" />, warning: false, duration: '30 sec' },
        { id: 'alternator', name: 'Charging System Test', desc: 'Test alternator output and voltage regulation', icon: <Battery className="w-5 h-5" />, warning: false, duration: '1 min' },
        { id: 'sensors', name: 'Sensor Range Test', desc: 'Verify all sensor signals are within specification', icon: <Gauge className="w-5 h-5" />, warning: false, duration: '2 min' },
      ]},
      // Generator Tests
      { category: 'Generator / Alternator', tests: [
        { id: 'avr_test', name: 'AVR Response Test', desc: 'Test automatic voltage regulator response to load changes', icon: <Zap className="w-5 h-5" />, warning: false, duration: '2 min' },
        { id: 'load_test', name: 'Load Bank Test', desc: 'Apply resistive load and verify power output', icon: <BarChart3 className="w-5 h-5" />, warning: true, duration: '15 min' },
        { id: 'insulation', name: 'Winding Insulation Test', desc: 'Megger test on stator windings', icon: <CircuitBoard className="w-5 h-5" />, warning: true, duration: '5 min' },
        { id: 'sync_check', name: 'Synchronization Test', desc: 'Verify sync check relay and paralleling capability', icon: <RefreshCw className="w-5 h-5" />, warning: true, duration: '3 min' },
      ]},
      // Actuator Overrides
      { category: 'Actuator Overrides', tests: [
        { id: 'fan_override', name: 'Cooling Fan Override', desc: 'Manually control engine cooling fan speed', icon: <Wind className="w-5 h-5" />, warning: false, duration: 'Manual' },
        { id: 'fuel_prime', name: 'Fuel Pump Prime', desc: 'Manually activate fuel transfer pump', icon: <Droplets className="w-5 h-5" />, warning: false, duration: 'Manual' },
        { id: 'throttle_test', name: 'Throttle Actuator Test', desc: 'Move throttle through full range', icon: <Sliders className="w-5 h-5" />, warning: true, duration: '30 sec' },
      ]},
    ];

    return (
      <div className="p-4 space-y-6 ">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>Bi-Directional Controls & Active Tests</h3>
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Some tests require engine running or may affect operation</span>
          </div>
        </div>

        {/* Cylinder Cutout Test Results */}
        {cylinderResults.length > 0 && (
          <div className="p-4 rounded-xl border" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '60' }}>
            <h4 className="font-medium mb-3" style={{ color: tool.textColor }}>Cylinder Cutout Test Results</h4>
            <div className="grid grid-cols-6 gap-2">
              {cylinderResults.map((result) => (
                <div
                  key={result.cylinder}
                  className={`p-3 rounded-lg text-center ${
                    result.status === 'normal' ? 'bg-green-500/20 border border-green-500/50' :
                    result.status === 'weak' ? 'bg-amber-500/20 border border-amber-500/50' :
                    'bg-red-500/20 border border-red-500/50'
                  }`}
                >
                  <div className="text-lg font-bold" style={{ color: tool.textColor }}>Cyl {result.cylinder}</div>
                  <div className="text-xs mt-1" style={{ color: tool.textColor + '80' }}>
                    RPM Drop: {result.rpmDrop.toFixed(0)}
                  </div>
                  <div className="text-xs" style={{ color: tool.textColor + '80' }}>
                    Contrib: {result.contribution.toFixed(1)}%
                  </div>
                  <div className={`text-xs font-medium mt-1 ${
                    result.status === 'normal' ? 'text-green-400' :
                    result.status === 'weak' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {result.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
            {activeTest === 'cylinder_cutout' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: tool.textColor + '80' }}>
                  <span>Testing cylinders...</span>
                  <span>{testProgress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${testProgress}%`, backgroundColor: tool.primaryColor }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Test Categories */}
        {DIAGNOSTIC_TESTS.map((category) => (
          <div key={category.category} className="space-y-3">
            <h4 className="font-medium text-sm uppercase tracking-wide" style={{ color: tool.primaryColor }}>{category.category}</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {category.tests.map((test) => (
                <div
                  key={test.id}
                  className="p-4 rounded-xl border cursor-pointer hover:border-opacity-100 transition-all group"
                  style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: tool.primaryColor + '20', color: tool.primaryColor }}>
                        {test.icon}
                      </div>
                      <div>
                        <h4 className="font-medium" style={{ color: tool.textColor }}>{test.name}</h4>
                        <p className="text-xs" style={{ color: tool.textColor + '80' }}>{test.desc}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {test.warning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700" style={{ color: tool.textColor + '80' }}>{test.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => test.id === 'cylinder_cutout' ? runCylinderTest() : setActiveTest(test.id)}
                    disabled={activeTest !== null}
                    className="w-full mt-2 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-all hover:opacity-90"
                    style={{ backgroundColor: tool.primaryColor }}
                  >
                    {activeTest === test.id ? 'Running...' : 'Start Test'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Configuration Tab
  const ConfigTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>ECU Configuration & Parameters</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600">
            <Upload className="w-4 h-4" />
            Read All
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: tool.primaryColor }}>
            <Download className="w-4 h-4" />
            Write All
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {[
          { category: 'Governor', params: [
            { name: 'Low Idle Speed', value: 700, unit: 'RPM', min: 600, max: 900 },
            { name: 'High Idle Speed', value: 1850, unit: 'RPM', min: 1700, max: 2000 },
            { name: 'Rated Speed', value: 1500, unit: 'RPM', min: 1400, max: 1600 },
          ]},
          { category: 'Protection', params: [
            { name: 'Low Oil Pressure Shutdown', value: 0.8, unit: 'bar', min: 0.5, max: 2.0 },
            { name: 'High Coolant Temp Shutdown', value: 105, unit: '°C', min: 95, max: 115 },
            { name: 'Overspeed Shutdown', value: 1650, unit: 'RPM', min: 1550, max: 1750 },
          ]},
          { category: 'Starting', params: [
            { name: 'Crank Time', value: 10, unit: 'sec', min: 5, max: 30 },
            { name: 'Crank Rest Time', value: 5, unit: 'sec', min: 3, max: 15 },
            { name: 'Start Attempts', value: 3, unit: '', min: 1, max: 5 },
          ]},
        ].map((group) => (
          <div key={group.category} className="rounded-xl border overflow-hidden" style={{ borderColor: tool.primaryColor + '40' }}>
            <div className="px-4 py-2 font-medium text-sm flex items-center justify-between" style={{ backgroundColor: tool.primaryColor, color: 'white' }}>
              <span>{group.category}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="divide-y divide-slate-700" style={{ backgroundColor: tool.screenColor }}>
              {group.params.map((param) => (
                <div key={param.name} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm" style={{ color: tool.textColor + 'cc' }}>{param.name}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      defaultValue={param.value}
                      min={param.min}
                      max={param.max}
                      step={param.unit === 'bar' ? 0.1 : 1}
                      className="w-24 px-3 py-2 rounded-lg bg-slate-800 border-2 border-slate-600 text-right font-mono text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-text transition-all hover:border-slate-500"
                      style={{ color: tool.textColor, caretColor: 'white' }}
                    />
                    <span className="text-xs w-12" style={{ color: tool.textColor + '60' }}>{param.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // TECHNICIAN INPUT TAB - Full Diagnostic Engagement System
  // ═══════════════════════════════════════════════════════════════════════════════
  const TechInputTab = () => (
    <div className="p-4 space-y-6">
      {/* Header with Fault Code Database Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>Technician Diagnostic Input</h3>
          <p className="text-sm" style={{ color: tool.textColor + '80' }}>
            Integrated with {totalFaultCodes.toLocaleString()}+ fault codes database
          </p>
        </div>
        {analysisComplete && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs" style={{ color: tool.textColor + '60' }}>Diagnostic Confidence</div>
              <div className="text-2xl font-bold" style={{ color: confidenceScore > 80 ? '#22c55e' : confidenceScore > 50 ? '#f59e0b' : '#ef4444' }}>
                {confidenceScore.toFixed(0)}%
              </div>
            </div>
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#334155" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke={confidenceScore > 80 ? '#22c55e' : confidenceScore > 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${confidenceScore} 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Fault Code Search - Integrated with 400k+ codes */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
        <h4 className="font-medium mb-3 flex items-center gap-2" style={{ color: tool.textColor }}>
          <Search className="w-4 h-4" />
          Quick Fault Code Lookup ({totalFaultCodes.toLocaleString()}+ codes)
        </h4>
        <div className="relative">
          <input
            type="text"
            placeholder="Search fault code, SPN, description... (e.g., '190', 'oil pressure', 'P0300')"
            value={faultCodeSearch}
            onChange={(e) => handleFaultCodeSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-64 overflow-y-auto z-10">
              {searchResults.map((fault, idx) => (
                <button
                  key={`${fault.brand}-${fault.code}-${idx}`}
                  onClick={() => {
                    setSelectedDbFault(fault);
                    setFaultCodeSearch('');
                    setSearchResults([]);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-700 border-b border-slate-700 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400">{fault.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">{fault.brand}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{fault.description}</p>
                  <span className="text-xs text-slate-500">{fault.category} | {fault.severity}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Fault Code Details */}
        {selectedDbFault && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-slate-900/50 border border-cyan-500/30"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-bold text-cyan-400">{selectedDbFault.code}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">{selectedDbFault.brand}</span>
                  {selectedDbFault.model && <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">{selectedDbFault.model}</span>}
                </div>
                <h4 className="text-white font-medium mt-1">{selectedDbFault.description}</h4>
              </div>
              <button onClick={() => setSelectedDbFault(null)} className="p-1 hover:bg-slate-700 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div><span className="text-slate-500">Category:</span> <span className="text-white">{selectedDbFault.category}</span></div>
              <div><span className="text-slate-500">Alarm:</span> <span className="text-white">{selectedDbFault.alarmType}</span></div>
              <div><span className="text-slate-500">Severity:</span> <span className={selectedDbFault.severity === 'critical' || selectedDbFault.severity === 'shutdown' ? 'text-red-400' : selectedDbFault.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'}>{selectedDbFault.severity}</span></div>
            </div>

            {selectedDbFault.possibleCauses && selectedDbFault.possibleCauses.length > 0 && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-slate-400 mb-2">Possible Causes:</h5>
                <ul className="space-y-2">
                  {selectedDbFault.possibleCauses.map((cause, i) => (
                    <li key={i} className="text-sm text-slate-300 p-2 bg-slate-800/50 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${cause.likelihood === 'high' ? 'bg-red-500/20 text-red-400' : cause.likelihood === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {cause.likelihood}
                        </span>
                        <span className="text-white">{cause.cause}</span>
                      </div>
                      <p className="text-xs text-slate-400 pl-2">Verify: {cause.verification}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedDbFault.diagnosticSteps && selectedDbFault.diagnosticSteps.length > 0 && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-slate-400 mb-2">Diagnostic Steps:</h5>
                <ol className="space-y-2">
                  {selectedDbFault.diagnosticSteps.map((step) => (
                    <li key={step.step} className="text-sm text-slate-300 p-2 bg-slate-800/50 rounded">
                      <div className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">{step.step}.</span>
                        <div className="flex-1">
                          <p className="text-white">{step.action}</p>
                          <p className="text-xs text-green-400 mt-1">Expected: {step.expectedResult}</p>
                          {step.tools && step.tools.length > 0 && (
                            <p className="text-xs text-slate-500 mt-1">Tools: {step.tools.join(', ')}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {selectedDbFault.solutions && selectedDbFault.solutions.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-slate-400 mb-2">Solutions:</h5>
                <ul className="space-y-3">
                  {selectedDbFault.solutions.map((solution, i) => (
                    <li key={i} className="text-sm text-slate-300 p-3 bg-slate-800/50 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          solution.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                          solution.difficulty === 'moderate' ? 'bg-amber-500/20 text-amber-400' :
                          solution.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {solution.difficulty}
                        </span>
                        <span className="text-slate-500 text-xs">~{solution.timeEstimate}</span>
                      </div>
                      <ol className="space-y-1 mb-2">
                        {solution.procedureSteps.map((step, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-cyan-400">{j + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                      {solution.tools.length > 0 && (
                        <p className="text-xs text-slate-500">Tools: {solution.tools.join(', ')}</p>
                      )}
                      {/* Enhanced Parts with OEM Part Numbers */}
                      {solution.spareParts && solution.spareParts.length > 0 ? (
                        <div className="mt-2 p-2 bg-amber-900/20 rounded-lg">
                          <p className="text-xs font-medium text-amber-400 mb-1">🔧 Spare Parts (OEM Part Numbers):</p>
                          {solution.spareParts.map((part, k) => (
                            <div key={k} className="flex justify-between items-center text-xs border-b border-slate-700 py-1 last:border-0">
                              <span className="text-slate-300">{part.name}</span>
                              <span className="font-mono text-cyan-400">{part.partNumber}</span>
                              <span className="text-green-400">${part.estimatedCost.min}-{part.estimatedCost.max}</span>
                            </div>
                          ))}
                        </div>
                      ) : solution.parts.length > 0 && (
                        <p className="text-xs text-cyan-400 mt-1">Parts: {solution.parts.join(', ')}</p>
                      )}

                      {/* Required Tools with Specifications */}
                      {solution.requiredTools && solution.requiredTools.length > 0 && (
                        <div className="mt-2 p-2 bg-purple-900/20 rounded-lg">
                          <p className="text-xs font-medium text-purple-400 mb-1">🛠 Required Tools:</p>
                          <div className="flex flex-wrap gap-1">
                            {solution.requiredTools.map((tool, k) => (
                              <span key={k} className={`text-[10px] px-1.5 py-0.5 rounded ${tool.essential ? 'bg-red-500/30 text-red-300' : 'bg-slate-600 text-slate-300'}`}>
                                {tool.name} {tool.specification && `(${tool.specification})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Manual References */}
                      {solution.manualReferences && solution.manualReferences.length > 0 && (
                        <div className="mt-2 p-2 bg-blue-900/20 rounded-lg">
                          <p className="text-xs font-medium text-blue-400 mb-1">📚 Manual References:</p>
                          {solution.manualReferences.map((manual, k) => (
                            <div key={k} className="text-[10px] text-slate-300 border-b border-slate-700 py-0.5 last:border-0">
                              <span className="font-medium text-blue-300">{manual.type}:</span> {manual.title} - {manual.section} {manual.page && `(p.${manual.page})`}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Controller Navigation */}
                      {solution.controllerNavigation && (
                        <div className="mt-2 p-2 bg-emerald-900/20 rounded-lg">
                          <p className="text-xs font-medium text-emerald-400 mb-1">🎮 Controller Navigation ({solution.controllerNavigation.brand} {solution.controllerNavigation.model}):</p>
                          {solution.controllerNavigation.accessPath.slice(0, 5).map((step, k) => (
                            <div key={k} className="flex items-center gap-1 text-[10px]">
                              <span className="font-bold text-cyan-400">{step.step}.</span>
                              <span className="text-slate-300">{step.button}</span>
                              <span className="text-slate-500">→</span>
                              <span className="text-green-400 italic">{step.display}</span>
                            </div>
                          ))}
                          {solution.controllerNavigation.defaultPassword && (
                            <p className="text-[10px] text-amber-400 mt-1">🔑 Default PIN: {solution.controllerNavigation.defaultPassword}</p>
                          )}
                        </div>
                      )}

                      {/* Verification Steps */}
                      {solution.verificationSteps && solution.verificationSteps.length > 0 && (
                        <div className="mt-2 p-2 bg-teal-900/20 rounded-lg">
                          <p className="text-xs font-medium text-teal-400 mb-1">✅ Verification Steps:</p>
                          {solution.verificationSteps.slice(0, 4).map((vstep, k) => (
                            <div key={k} className="text-[10px] border-b border-slate-700 py-0.5 last:border-0">
                              <div className="flex gap-1">
                                <span className="font-bold text-teal-300">{vstep.step}.</span>
                                <span className="text-slate-300">{vstep.action}</span>
                              </div>
                              <div className="pl-3 text-green-400 italic">✓ {vstep.passIndicator}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-green-400 mt-2 font-medium">
                        💰 Est. Cost: {solution.estimatedCost.currency} {solution.estimatedCost.min}-{solution.estimatedCost.max}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Internal Spare Parts Links (SEO) */}
            <div className="mt-3 p-3 bg-green-900/20 rounded-lg">
              <p className="text-xs font-medium text-green-400 mb-2">🛒 ORDER SPARE PARTS:</p>
              <div className="grid md:grid-cols-2 gap-2">
                <a href="/spare-parts/engine/oil-system" className="flex items-center gap-2 text-xs p-2 bg-slate-800/50 rounded hover:bg-slate-700/50 transition">
                  <span className="text-cyan-400">→</span>
                  <span className="text-slate-300">Oil System Parts</span>
                </a>
                <a href="/spare-parts/engine/cooling" className="flex items-center gap-2 text-xs p-2 bg-slate-800/50 rounded hover:bg-slate-700/50 transition">
                  <span className="text-cyan-400">→</span>
                  <span className="text-slate-300">Cooling System Parts</span>
                </a>
                <a href="/spare-parts/engine/fuel" className="flex items-center gap-2 text-xs p-2 bg-slate-800/50 rounded hover:bg-slate-700/50 transition">
                  <span className="text-cyan-400">→</span>
                  <span className="text-slate-300">Fuel System Parts</span>
                </a>
                <a href="/spare-parts/electrical/avr" className="flex items-center gap-2 text-xs p-2 bg-slate-800/50 rounded hover:bg-slate-700/50 transition">
                  <span className="text-cyan-400">→</span>
                  <span className="text-slate-300">AVR & Electrical Parts</span>
                </a>
              </div>
              <div className="mt-3 flex gap-2">
                <a href="/spare-parts" className="flex-1 text-center text-xs p-2 bg-cyan-600/30 text-cyan-400 rounded hover:bg-cyan-600/50 transition font-medium">
                  Browse All Parts
                </a>
                <a href="/spare-parts/quote" className="flex-1 text-center text-xs p-2 bg-green-600/30 text-green-400 rounded hover:bg-green-600/50 transition font-medium">
                  Request Quote
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Problem Description - Main Input Area */}
      <div className="rounded-xl border-2 p-6" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: tool.primaryColor + '30' }}>
            <PenTool className="w-5 h-5" style={{ color: tool.primaryColor }} />
          </div>
          <div>
            <h4 className="font-bold text-lg" style={{ color: tool.textColor }}>Describe Your Generator Issue</h4>
            <p className="text-sm" style={{ color: tool.textColor + '80' }}>Type your problem description below - be as detailed as possible</p>
          </div>
        </div>
        <textarea
          value={techInput.problemDescription}
          onChange={(e) => setTechInput({ ...techInput, problemDescription: e.target.value })}
          placeholder="Example: Generator starts but shuts down after 30 seconds. Warning light for high temperature comes on. This started yesterday after a power outage. The coolant level looks normal..."
          rows={5}
          className="w-full px-4 py-4 rounded-xl bg-slate-800 border-2 border-slate-600 text-white placeholder:text-slate-400 resize-none text-base focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-text"
          style={{ caretColor: 'white' }}
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs" style={{ color: tool.textColor + '60' }}>
            {techInput.problemDescription.length > 0 ? `${techInput.problemDescription.length} characters` : 'Start typing to describe the issue...'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setTechInput({ ...techInput, problemDescription: '' })}
              className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Additional Notes Input */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
        <h4 className="font-medium mb-3 flex items-center gap-2" style={{ color: tool.textColor }}>
          <FileText className="w-4 h-4" />
          Additional Notes & Observations
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Recent Maintenance (what was done?)</label>
            <input
              type="text"
              value={techInput.recentMaintenance}
              onChange={(e) => setTechInput({ ...techInput, recentMaintenance: e.target.value })}
              placeholder="e.g., Oil change 2 weeks ago, filter replacement..."
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none cursor-text"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Environmental Factors</label>
            <input
              type="text"
              value={techInput.environmentalFactors}
              onChange={(e) => setTechInput({ ...techInput, environmentalFactors: e.target.value })}
              placeholder="e.g., Dusty location, high humidity, recent rain..."
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none cursor-text"
            />
          </div>
        </div>
      </div>

      {/* Observed Conditions - Quick Assessment */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
        <h4 className="font-medium mb-4" style={{ color: tool.textColor }}>Quick Condition Assessment</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'engineStarts', label: 'Engine cranks and starts', icon: <Power className="w-4 h-4" /> },
            { key: 'engineRuns', label: 'Engine runs continuously', icon: <Activity className="w-4 h-4" /> },
            { key: 'generatorProducesVoltage', label: 'Generator produces voltage', icon: <Zap className="w-4 h-4" /> },
            { key: 'loadCapable', label: 'Able to accept and maintain load', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'alarmsPresent', label: 'Controller shows alarms/faults', icon: <AlertTriangle className="w-4 h-4" /> },
            { key: 'unusualSounds', label: 'Unusual sounds present', icon: <Volume2 className="w-4 h-4" /> },
            { key: 'visibleSmoke', label: 'Visible smoke from exhaust', icon: <Wind className="w-4 h-4" /> },
            { key: 'fluidLeaks', label: 'Fluid leaks observed', icon: <Droplets className="w-4 h-4" /> },
          ].map(({ key, label, icon }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3">
                <span style={{ color: tool.primaryColor }}>{icon}</span>
                <span className="text-sm text-slate-300">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTechInput({
                    ...techInput,
                    observedConditions: { ...techInput.observedConditions, [key]: true }
                  })}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    techInput.observedConditions[key as keyof typeof techInput.observedConditions] === true
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  YES
                </button>
                <button
                  onClick={() => setTechInput({
                    ...techInput,
                    observedConditions: { ...techInput.observedConditions, [key]: false }
                  })}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    techInput.observedConditions[key as keyof typeof techInput.observedConditions] === false
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Measurements Input - Easy to Fill */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
        <h4 className="font-medium mb-4 flex items-center gap-2" style={{ color: tool.textColor }}>
          <Gauge className="w-5 h-5" style={{ color: tool.primaryColor }} />
          Enter Measured Values (if available)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'batteryVoltage', label: 'Battery Voltage', unit: 'V', placeholder: '24.0', icon: <Battery className="w-4 h-4" /> },
            { key: 'oilPressure', label: 'Oil Pressure', unit: 'bar', placeholder: '4.0', icon: <Gauge className="w-4 h-4" /> },
            { key: 'coolantTemp', label: 'Coolant Temp', unit: '°C', placeholder: '85', icon: <Thermometer className="w-4 h-4" /> },
            { key: 'frequency', label: 'Frequency', unit: 'Hz', placeholder: '50.0', icon: <Activity className="w-4 h-4" /> },
            { key: 'voltage', label: 'Output Voltage', unit: 'V', placeholder: '400', icon: <Zap className="w-4 h-4" /> },
          ].map(({ key, label, unit, placeholder, icon }) => (
            <div key={key} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <label className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span style={{ color: tool.primaryColor }}>{icon}</span>
                {label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={techInput.measurements[key as keyof typeof techInput.measurements]}
                  onChange={(e) => setTechInput({
                    ...techInput,
                    measurements: { ...techInput.measurements, [key]: e.target.value }
                  })}
                  placeholder={placeholder}
                  className="w-full px-3 py-3 pr-12 rounded-lg bg-slate-900 border-2 border-slate-600 text-white text-right font-mono text-lg focus:border-cyan-500 focus:outline-none cursor-text"
                  style={{ caretColor: 'white' }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 text-sm font-medium">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Analysis Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={generateFollowUpQuestions}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium"
          style={{ backgroundColor: tool.primaryColor }}
        >
          <HelpCircle className="w-5 h-5" />
          Generate Follow-Up Questions
        </button>
        <button
          onClick={generateDiagnosticGuidance}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600"
        >
          <Sparkles className="w-5 h-5" />
          AI Generate Diagnostic Guidance
        </button>
      </div>

      {/* Follow-Up Questions */}
      {followUpQuestions.length > 0 && (
        <div className="rounded-xl border p-4" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
          <h4 className="font-medium mb-4 flex items-center gap-2" style={{ color: tool.textColor }}>
            <HelpCircle className="w-5 h-5" />
            Follow-Up Questions ({followUpQuestions.filter(q => q.selectedAnswer).length}/{followUpQuestions.length} answered)
          </h4>
          <div className="space-y-4">
            {followUpQuestions.map((question) => (
              <div key={question.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-white font-medium mb-2">{question.question}</p>
                <p className="text-xs text-slate-500 mb-3">Impact: {question.impact}</p>
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFollowUpQuestions(followUpQuestions.map(q =>
                          q.id === question.id ? { ...q, selectedAnswer: option } : q
                        ));
                      }}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        question.selectedAnswer === option
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostic Guidance Results */}
      {diagnosticGuidance.length > 0 && (
        <div className="rounded-xl border p-4" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
          <h4 className="font-medium mb-4 flex items-center gap-2" style={{ color: tool.textColor }}>
            <Wrench className="w-5 h-5" />
            Step-by-Step Diagnostic Guidance
          </h4>
          <div className="space-y-4">
            {diagnosticGuidance.map((step) => (
              <div key={step.step} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: tool.primaryColor }}
                  >
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-bold text-lg mb-2">{step.title}</h5>
                    <p className="text-slate-300 mb-4">{step.instruction}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-slate-900/50">
                        <div className="text-xs text-slate-500 uppercase mb-1">Expected Result</div>
                        <p className="text-sm text-green-400">{step.expectedResult}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/50">
                        <div className="text-xs text-slate-500 uppercase mb-1">Tools Required</div>
                        <p className="text-sm text-slate-300">{step.tools.join(', ')}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                        <div className="text-xs text-green-400 uppercase mb-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> If Test Passes
                        </div>
                        <p className="text-sm text-slate-300">{step.ifPasses}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                        <div className="text-xs text-red-400 uppercase mb-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> If Test Fails
                        </div>
                        <p className="text-sm text-slate-300">{step.ifFails}</p>
                      </div>
                    </div>

                    {step.safetyNotes.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <div className="text-xs text-amber-400 uppercase mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Safety Notes
                        </div>
                        <ul className="text-sm text-slate-300">
                          {step.safetyNotes.map((note, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-400">•</span> {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Notes */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
        <h4 className="font-medium mb-3" style={{ color: tool.textColor }}>Additional Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400">Recent Maintenance / Service History</label>
            <textarea
              value={techInput.recentMaintenance}
              onChange={(e) => setTechInput({ ...techInput, recentMaintenance: e.target.value })}
              placeholder="Last oil change, filter replacements, any recent repairs..."
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 resize-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Environmental Factors</label>
            <textarea
              value={techInput.environmentalFactors}
              onChange={(e) => setTechInput({ ...techInput, environmentalFactors: e.target.value })}
              placeholder="Temperature, humidity, dust, altitude, recent weather events..."
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 resize-none text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // HEALTH TAB - Component Health Scoring & Predictive Maintenance
  // ═══════════════════════════════════════════════════════════════════════════════
  const HealthTab = () => (
    <div className="p-4 space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>Component Health & Predictive Maintenance</h3>
          <p className="text-sm" style={{ color: tool.textColor + '80' }}>AI-powered health scoring based on sensor trends and service history</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/20 border border-green-500/40">
          <Activity className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">Overall Health: 84%</span>
        </div>
      </div>

      {/* Health Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {SAMPLE_COMPONENT_HEALTH.map((item) => (
          <div
            key={item.component}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium" style={{ color: tool.textColor }}>{item.component}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    item.trend === 'improving' ? 'bg-green-500/20 text-green-400' :
                    item.trend === 'stable' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {item.trend === 'improving' ? '↑ Improving' : item.trend === 'stable' ? '→ Stable' : '↓ Degrading'}
                  </span>
                </div>
              </div>
              {/* Health Score Circle */}
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#334155" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke={item.healthScore >= 80 ? '#22c55e' : item.healthScore >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3"
                    strokeDasharray={`${item.healthScore} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold" style={{ color: tool.textColor }}>{item.healthScore}%</span>
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span style={{ color: tool.textColor + '60' }}>Last Service:</span>
                <span className="ml-1" style={{ color: tool.textColor }}>{item.lastService}</span>
              </div>
              <div>
                <span style={{ color: tool.textColor + '60' }}>Next Service:</span>
                <span className="ml-1" style={{ color: tool.textColor }}>{item.nextService}</span>
              </div>
            </div>

            {/* Alerts */}
            {item.alerts.length > 0 && (
              <div className="space-y-1">
                {item.alerts.map((alert, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs p-2 rounded bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span className="text-amber-400">{alert}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // BACKUP TAB - ECU Configuration Backup/Restore
  // ═══════════════════════════════════════════════════════════════════════════════
  const BackupTab = () => (
    <div className="p-4 space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>ECU Configuration Backup & Restore</h3>
          <p className="text-sm" style={{ color: tool.textColor + '80' }}>Save and restore ECU parameter configurations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium" style={{ backgroundColor: tool.primaryColor }}>
          <Save className="w-4 h-4" />
          Create New Backup
        </button>
      </div>

      {/* Current ECU Info */}
      <div className="p-4 rounded-xl border" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '60' }}>
        <h4 className="font-medium mb-3" style={{ color: tool.textColor }}>Current ECU Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span style={{ color: tool.textColor + '60' }}>Serial Number:</span>
            <p className="font-mono" style={{ color: tool.textColor }}>ECU-2024-00123</p>
          </div>
          <div>
            <span style={{ color: tool.textColor + '60' }}>Software Version:</span>
            <p className="font-mono" style={{ color: tool.textColor }}>v3.2.1</p>
          </div>
          <div>
            <span style={{ color: tool.textColor + '60' }}>Calibration Date:</span>
            <p style={{ color: tool.textColor }}>2026-03-01</p>
          </div>
          <div>
            <span style={{ color: tool.textColor + '60' }}>Parameters:</span>
            <p style={{ color: tool.textColor }}>245 configured</p>
          </div>
        </div>
      </div>

      {/* Saved Backups */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: tool.primaryColor + '40' }}>
        <div className="px-4 py-2 font-medium text-sm" style={{ backgroundColor: tool.primaryColor, color: 'white' }}>
          Saved Configurations
        </div>
        <div className="divide-y divide-slate-700" style={{ backgroundColor: tool.screenColor }}>
          {SAMPLE_ECU_BACKUPS.map((backup) => (
            <div key={backup.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5" style={{ color: tool.primaryColor }} />
                <div>
                  <p className="font-medium" style={{ color: tool.textColor }}>{backup.name}</p>
                  <p className="text-xs" style={{ color: tool.textColor + '60' }}>
                    {backup.date} • {backup.softwareVersion} • {backup.parameterCount} params • {backup.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600">
                  <Download className="w-4 h-4 inline mr-1" />
                  Export
                </button>
                <button className="px-3 py-1.5 rounded-lg text-white text-sm" style={{ backgroundColor: tool.primaryColor }}>
                  <RotateCcw className="w-4 h-4 inline mr-1" />
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 font-medium">Important Notice</p>
            <p className="text-sm text-amber-400/80">
              Restoring ECU configurations will overwrite current settings. Always create a backup of current configuration before restoring. Incorrect settings may affect engine operation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // REPORTS TAB - Diagnostic Report Generation
  // ═══════════════════════════════════════════════════════════════════════════════
  const ReportsTab = () => (
    <div className="p-4 space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>Diagnostic Reports & Data Export</h3>
          <p className="text-sm" style={{ color: tool.textColor + '80' }}>Generate comprehensive reports and export diagnostic data</p>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: 'Full Diagnostic Report', desc: 'Complete system analysis with all parameters, faults, and recommendations', icon: <FileText className="w-6 h-6" />, format: 'PDF' },
          { name: 'Fault History Report', desc: 'Historical fault codes with freeze frame data and trends', icon: <AlertTriangle className="w-6 h-6" />, format: 'PDF' },
          { name: 'Service Summary', desc: 'Quick overview for service records and maintenance logs', icon: <Wrench className="w-6 h-6" />, format: 'PDF' },
          { name: 'Parameter Data Export', desc: 'All current parameters in spreadsheet format', icon: <Database className="w-6 h-6" />, format: 'CSV/Excel' },
          { name: 'Health Assessment Report', desc: 'Component health scores and predictive maintenance alerts', icon: <Activity className="w-6 h-6" />, format: 'PDF' },
          { name: 'Data Log Export', desc: 'Recorded session data for offline analysis', icon: <HardDrive className="w-6 h-6" />, format: 'CSV' },
        ].map((report) => (
          <div
            key={report.name}
            className="p-4 rounded-xl border hover:border-opacity-100 transition-all cursor-pointer group"
            style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: tool.primaryColor + '20', color: tool.primaryColor }}>
                {report.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium" style={{ color: tool.textColor }}>{report.name}</h4>
                <p className="text-xs mt-1" style={{ color: tool.textColor + '80' }}>{report.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-700" style={{ color: tool.textColor + '80' }}>{report.format}</span>
                  <button className="px-3 py-1 rounded-lg text-white text-sm" style={{ backgroundColor: tool.primaryColor }}>
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Freeze Frame Data */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: tool.primaryColor + '40' }}>
        <div className="px-4 py-2 font-medium text-sm flex items-center justify-between" style={{ backgroundColor: tool.primaryColor, color: 'white' }}>
          <span>Freeze Frame Data (Fault Snapshots)</span>
          <span className="text-xs opacity-80">{SAMPLE_FREEZE_FRAMES.length} snapshots available</span>
        </div>
        <div className="divide-y divide-slate-700" style={{ backgroundColor: tool.screenColor }}>
          {SAMPLE_FREEZE_FRAMES.map((frame, idx) => (
            <div key={idx} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-mono font-medium" style={{ color: tool.textColor }}>{frame.faultCode}</span>
                  <span className="text-xs ml-2" style={{ color: tool.textColor + '60' }}>{frame.timestamp}</span>
                </div>
                <button
                  onClick={() => setSelectedFreezeFrame(selectedFreezeFrame?.faultCode === frame.faultCode ? null : frame)}
                  className="text-sm px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600"
                  style={{ color: tool.textColor }}
                >
                  {selectedFreezeFrame?.faultCode === frame.faultCode ? 'Hide' : 'View'} Data
                </button>
              </div>
              {selectedFreezeFrame?.faultCode === frame.faultCode && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 p-3 rounded-lg bg-slate-800/50">
                  {frame.parameters.map((param, pidx) => (
                    <div key={pidx} className="text-xs">
                      <span style={{ color: tool.textColor + '60' }}>{param.name}:</span>
                      <span className="ml-1 font-mono" style={{ color: tool.textColor }}>{param.value} {param.unit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // DOCS TAB - Service Documentation with Detailed Content
  // ═══════════════════════════════════════════════════════════════════════════════
  const DocsTab = () => {
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [docCategory, setDocCategory] = useState('All');

    // Detailed manual content
    const DETAILED_MANUALS: Record<string, { title: string; sections: { heading: string; content: string }[] }> = {
      'doc1': {
        title: 'Engine Oil Specifications & Change Intervals',
        sections: [
          { heading: 'Recommended Oil Specifications', content: 'Use high-quality diesel engine oil meeting API CI-4, CJ-4, or CK-4 specifications. For most operating conditions, SAE 15W-40 is recommended. In extreme cold conditions below -15°C, use SAE 10W-30 or synthetic 5W-40. The oil must meet manufacturer viscosity requirements and have proper additive packages for diesel engine protection.' },
          { heading: 'Oil Change Intervals', content: 'Standard interval: Every 250-500 operating hours or 6 months, whichever comes first. Severe duty applications (dusty environments, high load, extreme temperatures): Every 150-250 hours. Always check oil condition weekly using dipstick - look for fuel dilution, coolant contamination, or excessive darkening.' },
          { heading: 'Oil Capacity & Procedure', content: 'Typical capacity: 35-45 liters depending on engine model. Procedure: 1) Run engine to operating temperature. 2) Shut down and wait 10 minutes. 3) Drain oil completely. 4) Replace oil filter. 5) Add new oil to correct level. 6) Run engine and check for leaks. 7) Recheck level after 5 minutes.' },
          { heading: 'Oil Analysis Program', content: 'Recommend sampling every oil change. Send to certified laboratory for wear metal analysis, contamination detection, and viscosity verification. Track trends over time to identify developing issues before failure occurs.' },
        ]
      },
      'doc2': {
        title: 'TSB-2026-003: High Coolant Temperature Issues',
        sections: [
          { heading: 'Problem Description', content: 'Some units may experience intermittent high coolant temperature warnings during extended high-load operation, particularly in ambient temperatures above 35°C. This bulletin addresses diagnostic steps and corrective actions.' },
          { heading: 'Affected Units', content: 'All generators with engine hours between 2000-8000 hours, manufactured between 2022-2025. Check production date on data plate.' },
          { heading: 'Root Cause Analysis', content: 'Investigation revealed three potential causes: 1) Radiator core fouling from airborne debris. 2) Thermostat not opening fully at correct temperature. 3) Water pump impeller erosion reducing coolant flow.' },
          { heading: 'Corrective Action', content: 'Step 1: Clean radiator core with low-pressure water (not exceeding 30 PSI). Step 2: Test thermostat in heated water - should open fully at 82°C. Step 3: If issue persists, inspect water pump for cavitation damage. Replace components as necessary and refill with correct coolant mixture (50/50 ELC).' },
        ]
      },
      'doc3': {
        title: 'DPF Regeneration Procedures',
        sections: [
          { heading: 'Understanding DPF Operation', content: 'The Diesel Particulate Filter captures soot particles from exhaust gases. Over time, accumulated soot must be burned off through regeneration. Three types exist: Passive (automatic during normal operation), Active (ECM-initiated at idle), and Parked/Service (manually initiated).' },
          { heading: 'When Regeneration is Required', content: 'Monitor DPF soot load percentage via diagnostic tool. Passive regen occurs continuously above 300°C exhaust temp. Active regen triggers at 60-80% soot load. Parked regen required if soot exceeds 90% or active regen repeatedly fails. Warning light indicates regeneration needed.' },
          { heading: 'Parked Regeneration Procedure', content: '1) Park in well-ventilated area away from combustibles. 2) Connect diagnostic tool. 3) Ensure coolant at operating temperature. 4) Fuel tank minimum 25% full. 5) Initiate parked regen via diagnostic menu. 6) Process takes 30-45 minutes - do not interrupt. 7) Exhaust temperatures will exceed 500°C - maintain safe distance.' },
          { heading: 'Post-Regeneration Verification', content: 'After completion, verify soot load dropped below 20%. Check DPF differential pressure returned to normal range (typically 2-8 kPa at idle). Clear any related fault codes. Document regeneration in service records.' },
        ]
      },
      'doc4': {
        title: 'SB-2025-018: Fuel Injector Calibration Update',
        sections: [
          { heading: 'Bulletin Overview', content: 'Updated injector trim calibration values improve fuel delivery accuracy and reduce emissions. This update applies to all units with electronic fuel injection systems.' },
          { heading: 'Calibration Procedure', content: 'Each injector has unique trim codes stamped on the body. Enter these codes into the ECM using diagnostic software. Codes compensate for manufacturing variations between injectors, ensuring equal fuel delivery across all cylinders.' },
          { heading: 'When to Recalibrate', content: 'Required after: 1) Injector replacement. 2) ECM replacement or reflash. 3) Rough running diagnosis. 4) Emissions test failure. Always verify correct codes are entered - incorrect values cause performance issues.' },
        ]
      },
      'doc5': {
        title: 'Controller Software Update v3.2.2',
        sections: [
          { heading: 'Release Notes', content: 'Version 3.2.2 includes bug fixes for communication stability, improved load sharing response, and enhanced protection features. Update recommended for all units running version 3.1.x or earlier.' },
          { heading: 'Update Procedure', content: '1) Connect PC with update software. 2) Backup current configuration. 3) Download update file to controller. 4) Wait for automatic restart. 5) Verify version in system info. 6) Restore any custom parameters if needed.' },
          { heading: 'Changes in This Version', content: 'Fixed: Occasional CAN bus timeout errors. Improved: Faster load pickup response. Added: New overspeed protection configuration option. Enhanced: Remote monitoring data refresh rate.' },
        ]
      },
      'doc6': {
        title: 'Turbocharger Maintenance Guide',
        sections: [
          { heading: 'Turbo Inspection Schedule', content: 'Visual inspection every 500 hours: Check for oil leaks at seals, exhaust discoloration, unusual sounds. Every 2000 hours: Measure shaft play (radial and axial). Replace turbo if play exceeds specifications or boost pressure drops.' },
          { heading: 'Common Turbo Issues', content: 'Oil starvation: Most common failure cause - ensure adequate oil supply and cleanliness. Compressor surge: Listen for cyclic whooshing - indicates boost control or intake restriction. Exhaust leaks: Black soot deposits indicate seal failure.' },
          { heading: 'Turbo Replacement Procedure', content: 'Critical: Pre-fill new turbo with clean oil before installation. Check oil supply and drain lines are clear. After installation, crank engine without starting to prime turbo. Start and idle for 3-5 minutes before applying load. Verify no leaks and boost pressure is correct.' },
        ]
      },
    };

    const filteredDocs = docCategory === 'All'
      ? SAMPLE_SERVICE_DOCS
      : SAMPLE_SERVICE_DOCS.filter(d => d.type === docCategory.toLowerCase());

    return (
      <div className="p-4 space-y-6 ">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>Service Documentation</h3>
            <p className="text-sm" style={{ color: tool.textColor + '80' }}>Manuals, Technical Service Bulletins, and Relevant Documentation</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tool.textColor + '60' }} />
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-sm w-64 focus:border-cyan-500 focus:outline-none"
              style={{ color: tool.textColor }}
            />
          </div>
        </div>

        {/* Document Categories - Now Clickable */}
        <div className="flex gap-2 flex-wrap">
          {['All', 'Manuals', 'TSB', 'Bulletins', 'Recalls'].map((cat) => (
            <button
              key={cat}
              onClick={() => setDocCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                docCategory === cat
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 hover:scale-105'
              }`}
              style={docCategory === cat ? { backgroundColor: tool.primaryColor } : { color: tool.textColor }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Selected Document Viewer */}
        {selectedDoc && DETAILED_MANUALS[selectedDoc] && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border-2"
            style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold" style={{ color: tool.textColor }}>{DETAILED_MANUALS[selectedDoc].title}</h4>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: tool.textColor }} />
              </button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {DETAILED_MANUALS[selectedDoc].sections.map((section, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-800/50">
                  <h5 className="font-medium mb-2" style={{ color: tool.primaryColor }}>{section.heading}</h5>
                  <p className="text-sm leading-relaxed" style={{ color: tool.textColor + 'cc' }}>{section.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>
        )}

        {/* Document List - Now with Working Buttons */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: tool.primaryColor + '40' }}>
          <div className="divide-y divide-slate-700" style={{ backgroundColor: tool.screenColor }}>
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    doc.type === 'manual' ? 'bg-blue-500/20 text-blue-400' :
                    doc.type === 'tsb' ? 'bg-red-500/20 text-red-400' :
                    doc.type === 'bulletin' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: tool.textColor }}>{doc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${
                        doc.type === 'manual' ? 'bg-blue-500/20 text-blue-400' :
                        doc.type === 'tsb' ? 'bg-red-500/20 text-red-400' :
                        doc.type === 'bulletin' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {doc.type}
                      </span>
                      <span className="text-xs" style={{ color: tool.textColor + '60' }}>{doc.date}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        doc.relevance === 'high' ? 'bg-green-500/20 text-green-400' :
                        doc.relevance === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {doc.relevance} relevance
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 hover:scale-105 transition-all text-sm"
                  >
                    <Eye className="w-4 h-4" style={{ color: tool.textColor }} />
                    <span style={{ color: tool.textColor }}>View</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:scale-105 transition-all text-sm text-white" style={{ backgroundColor: tool.primaryColor }}>
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="p-4 rounded-xl border" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
          <h4 className="font-medium mb-3" style={{ color: tool.textColor }}>Quick Reference - {generatorInfo.make} {generatorInfo.model}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span style={{ color: tool.textColor + '60' }}>Oil Type:</span>
              <p style={{ color: tool.textColor }}>15W-40 CI-4</p>
            </div>
            <div>
              <span style={{ color: tool.textColor + '60' }}>Oil Capacity:</span>
              <p style={{ color: tool.textColor }}>42 liters</p>
            </div>
            <div>
              <span style={{ color: tool.textColor + '60' }}>Coolant Type:</span>
              <p style={{ color: tool.textColor }}>ELC Extended Life</p>
            </div>
            <div>
            <span style={{ color: tool.textColor + '60' }}>Fuel Filter:</span>
            <p style={{ color: tool.textColor }}>P/N: FF5580</p>
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/90 p-4 pt-24 pb-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ backgroundColor: '#0f172a', border: `2px solid ${tool.primaryColor}` }}
      >
        {/* Title Bar with prominent Back Button */}
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: tool.primaryColor }}>
          <div className="flex items-center gap-3">
            {/* Prominent Back Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Menu</span>
            </button>
            <div className="w-px h-8 bg-white/30" />
            {tool.icon}
            <div>
              <h2 className="font-bold text-white">{tool.name}</h2>
              <p className="text-xs text-white/70">Version 3.0 - Generator Oracle</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded hover:bg-white/10" onClick={() => setIsConnected(!isConnected)} title="Connection Status">
              {isConnected ? <Wifi className="w-5 h-5 text-green-400" /> : <Wifi className="w-5 h-5 text-red-400" />}
            </button>
            <button className="p-2 rounded hover:bg-white/10" onClick={() => setIsRecording(!isRecording)} title="Data Recording">
              {isRecording ? <Square className="w-5 h-5 text-red-400" /> : <Play className="w-5 h-5 text-white" />}
            </button>
            <button onClick={onAIAnalyze} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium shadow-lg">
              <Sparkles className="w-4 h-4" />
              AI Analyze
            </button>
            <button onClick={onClose} className="p-2 rounded hover:bg-white/10 ml-2" title="Close">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar />

        {/* Navigation - Two Rows for More Tabs */}
        <div className="border-b border-slate-700" style={{ backgroundColor: '#1e293b' }}>
          {/* Primary Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 flex-wrap">
            <NavButton icon={<Monitor className="w-4 h-4" />} label="Monitor" active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} />
            <NavButton icon={<AlertTriangle className="w-4 h-4" />} label="Faults" active={activeTab === 'faults'} onClick={() => setActiveTab('faults')} />
            <NavButton icon={<Sliders className="w-4 h-4" />} label="Config" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
            <NavButton icon={<CircuitBoard className="w-4 h-4" />} label="Wiring" active={activeTab === 'wiring'} onClick={() => setActiveTab('wiring')} />
            <NavButton icon={<Play className="w-4 h-4" />} label="Tests" active={activeTab === 'tests'} onClick={() => setActiveTab('tests')} />
            <NavButton icon={<User className="w-4 h-4" />} label="Tech Input" active={activeTab === 'techinput'} onClick={() => setActiveTab('techinput')} />
            <div className="w-px h-6 bg-slate-600 mx-1" />
            <NavButton icon={<Activity className="w-4 h-4" />} label="Health" active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
            <NavButton icon={<HardDrive className="w-4 h-4" />} label="Backup" active={activeTab === 'backup'} onClick={() => setActiveTab('backup')} />
            <NavButton icon={<FileText className="w-4 h-4" />} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
            <NavButton icon={<Layers className="w-4 h-4" />} label="Docs" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />

            <div className="flex-1" />

            {/* Data Export */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Content Area with Scroll Controls */}
        <div className="flex-1 overflow-hidden relative">
          <div id="content-scroll" className="h-full overflow-y-auto scroll-smooth">
            <AnimatePresence mode="wait">
              {activeTab === 'monitor' && <MonitorTab />}
              {activeTab === 'faults' && <FaultsTab />}
              {activeTab === 'config' && <ConfigTab />}
              {activeTab === 'wiring' && <WiringTab />}
              {activeTab === 'tests' && <TestsTab />}
              {activeTab === 'techinput' && <TechInputTab />}
              {activeTab === 'health' && <HealthTab />}
              {activeTab === 'backup' && <BackupTab />}
              {activeTab === 'reports' && <ReportsTab />}
              {activeTab === 'docs' && <DocsTab />}
            </AnimatePresence>
          </div>

          {/* Floating Scroll Navigation Buttons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
            <button
              onClick={() => document.getElementById('content-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600 shadow-lg hover:scale-110 transition-all group"
              title="Scroll to top"
            >
              <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-white" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('content-scroll');
                if (el) el.scrollTo({ top: el.scrollTop + 200, behavior: 'smooth' });
              }}
              className="p-3 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600 shadow-lg hover:scale-110 transition-all group"
              title="Scroll down"
            >
              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('content-scroll');
                if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
              }}
              className="p-3 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-600 shadow-lg hover:scale-110 transition-all group"
              title="Scroll to bottom"
            >
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white rotate-90" />
            </button>
          </div>
        </div>

        {/* Footer with Quick Actions */}
        <div className="flex items-center justify-between px-4 py-2 text-xs border-t border-slate-700" style={{ backgroundColor: '#1e293b' }}>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Protocol: J1939</span>
            <span>Baud: 250kbps</span>
            <span>Node: 0x00</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-slate-500">
              <span>TX: 1,234</span>
              <span>RX: 5,678</span>
              <span>Errors: 0</span>
            </div>
            {/* Tab Navigation Arrows */}
            <div className="flex items-center gap-1 ml-4 border-l border-slate-600 pl-4">
              <button
                onClick={() => {
                  const tabs = ['monitor', 'faults', 'config', 'wiring', 'tests', 'techinput', 'health', 'backup', 'reports', 'docs'];
                  const currentIdx = tabs.indexOf(activeTab);
                  if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1] as typeof activeTab);
                }}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Previous tab"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-500 text-xs px-2">{activeTab}</span>
              <button
                onClick={() => {
                  const tabs = ['monitor', 'faults', 'config', 'wiring', 'tests', 'techinput', 'health', 'backup', 'reports', 'docs'];
                  const currentIdx = tabs.indexOf(activeTab);
                  if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1] as typeof activeTab);
                }}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Next tab"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT COMPONENT - TOOL SELECTION GRID
// ═══════════════════════════════════════════════════════════════════════════════

interface ProfessionalDiagnosticToolsProps {
  generatorInfo?: GeneratorInfo;
}

export default function ProfessionalDiagnosticTools({ generatorInfo }: ProfessionalDiagnosticToolsProps) {
  const [selectedTool, setSelectedTool] = useState<DiagnosticTool | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [genInfo, setGenInfo] = useState<GeneratorInfo>(generatorInfo || {
    make: 'Cummins',
    model: 'C500 D5',
    kva: 500,
    serialNumber: 'CUM-2024-12345',
    engineModel: 'QSX15-G9',
    controllerType: 'DSE 7320',
    hours: 4567,
  });

  // Generator selection form - show by default if no generator configured
  const [showGenSelector, setShowGenSelector] = useState(!generatorInfo);

  // Generator brands and models database
  const GENERATOR_BRANDS = [
    { name: 'Cummins', models: ['C500 D5', 'C400 D5', 'C350 D5', 'C275 D5', 'C200 D5', 'C150 D5', 'C100 D5', 'QSK60', 'QSK50', 'QSX15'] },
    { name: 'Caterpillar', models: ['C32', 'C18', 'C15', 'C13', 'C9.3', 'C7.1', 'C4.4', '3516', '3512', '3508', '3406'] },
    { name: 'Perkins', models: ['4008TAG2A', '4006TAG2A', '2806A-E18TAG2', '2506A-E15TAG2', '2206A-E13TAG3', '1506A-E88TAG5', '1104D-E44TAG2'] },
    { name: 'Volvo Penta', models: ['TAD1643GE', 'TAD1642GE', 'TAD1641GE', 'TAD1344GE', 'TAD734GE', 'D13', 'D11', 'D8', 'D5'] },
    { name: 'MTU', models: ['16V4000', '12V4000', '8V4000', '16V2000', '12V2000', '8V2000', '6R1500', '6R1300', '6R1100'] },
    { name: 'John Deere', models: ['6135HFG82', '6090HFG84', '6068HFG82', '4045HFG82', '4045TFG80', '3029TFG80', '6135HFC06'] },
    { name: 'Kohler', models: ['KD4000', 'KD3500', 'KD2800', 'KD2000', 'KD1800', 'KD1500', 'KD1250', 'KD1000', 'KD800', 'KD600'] },
    { name: 'Generac', models: ['SD600', 'SD500', 'SD400', 'SD350', 'SD300', 'SD250', 'SD200', 'SD175', 'SD150', 'SD100'] },
    { name: 'FG Wilson', models: ['P2500', 'P2000', 'P1700', 'P1500', 'P1250', 'P1000', 'P800', 'P650', 'P550', 'P450', 'P300'] },
    { name: 'Olympian', models: ['GEP550', 'GEP450', 'GEP380', 'GEP330', 'GEP275', 'GEP220', 'GEP165', 'GEP110', 'GEP88', 'GEP65'] },
  ];

  const KVA_RATINGS = [10, 15, 20, 25, 30, 40, 50, 60, 75, 88, 100, 125, 150, 175, 200, 250, 275, 300, 350, 400, 450, 500, 550, 600, 650, 750, 800, 900, 1000, 1100, 1250, 1400, 1500, 1750, 2000, 2250, 2500, 3000];

  const selectedBrandModels = GENERATOR_BRANDS.find(b => b.name === genInfo.make)?.models || [];

  return (
    <div className="space-y-6 pt-4">
      {/* Header with prominent generator selection */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Professional Diagnostic Tools</h2>
          <p className="text-slate-400">10 dealer-level diagnostic interfaces with full functionality</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIPanel(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-cyan-600 shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            AI Analyzer
          </button>
          <button
            onClick={() => setShowGenSelector(!showGenSelector)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/30"
          >
            <Settings className="w-5 h-5" />
            {showGenSelector ? 'Hide Generator Setup' : 'Configure Generator'}
          </button>
        </div>
      </div>

      {/* Generator Info Card */}
      <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-slate-500 uppercase">Generator</span>
              <p className="text-white font-medium">{genInfo.make} {genInfo.model}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase">Rating</span>
              <p className="text-white font-medium">{genInfo.kva} kVA</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase">Engine</span>
              <p className="text-white font-medium">{genInfo.engineModel}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase">Controller</span>
              <p className="text-white font-medium">{genInfo.controllerType}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase">Hours</span>
              <p className="text-white font-medium">{genInfo.hours.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm">Ready to Connect</span>
          </div>
        </div>
      </div>

      {/* Generator Selector Panel - Prominent Setup */}
      <AnimatePresence>
        {showGenSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/50 rounded-2xl space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Generator Configuration</h3>
                    <p className="text-sm text-slate-400">Select your generator to get accurate diagnostics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-400">Required for accurate diagnosis</span>
                </div>
              </div>

              {/* Main Selection Row */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-cyan-400 uppercase">
                    <span className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs">1</span>
                    Generator Make
                  </label>
                  <select
                    value={genInfo.make}
                    onChange={(e) => setGenInfo({ ...genInfo, make: e.target.value, model: '' })}
                    className="w-full px-4 py-3 bg-slate-800/80 border-2 border-slate-600 hover:border-cyan-500/50 focus:border-cyan-500 rounded-xl text-white text-lg transition-colors cursor-pointer"
                  >
                    <option value="">-- Select Make --</option>
                    {GENERATOR_BRANDS.map((brand) => (
                      <option key={brand.name} value={brand.name}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-cyan-400 uppercase">
                    <span className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs">2</span>
                    Model / Series
                  </label>
                  <select
                    value={genInfo.model}
                    onChange={(e) => setGenInfo({ ...genInfo, model: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/80 border-2 border-slate-600 hover:border-cyan-500/50 focus:border-cyan-500 rounded-xl text-white text-lg transition-colors cursor-pointer"
                    disabled={!genInfo.make}
                  >
                    <option value="">-- Select Model --</option>
                    {selectedBrandModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                    <option value="custom">Other (Enter Custom)</option>
                  </select>
                  {genInfo.model === 'custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom model..."
                      onChange={(e) => setGenInfo({ ...genInfo, model: e.target.value })}
                      className="w-full mt-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-cyan-400 uppercase">
                    <span className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs">3</span>
                    kVA Rating
                  </label>
                  <select
                    value={genInfo.kva}
                    onChange={(e) => setGenInfo({ ...genInfo, kva: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-800/80 border-2 border-slate-600 hover:border-cyan-500/50 focus:border-cyan-500 rounded-xl text-white text-lg transition-colors cursor-pointer"
                  >
                    <option value={0}>-- Select kVA --</option>
                    {KVA_RATINGS.map((kva) => (
                      <option key={kva} value={kva}>{kva} kVA</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Secondary Details */}
              <div className="grid md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <label className="text-xs text-slate-400 uppercase mb-1 block">Engine Model</label>
                  <input
                    type="text"
                    value={genInfo.engineModel}
                    onChange={(e) => setGenInfo({ ...genInfo, engineModel: e.target.value })}
                    placeholder="e.g., QSX15-G9"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase mb-1 block">Controller Type</label>
                  <select
                    value={genInfo.controllerType}
                    onChange={(e) => setGenInfo({ ...genInfo, controllerType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white cursor-pointer"
                  >
                    <option value="">-- Select --</option>
                    {['DSE 7320', 'DSE 7310', 'DSE 8610', 'DSE 8620', 'DSE 8660', 'ComAp InteliGen NT', 'ComAp InteliLite NT', 'ComAp InteliSys NT', 'Woodward EasyGen-3000', 'Woodward EasyGen-2500', 'PowerWizard 1.1', 'PowerWizard 2.0', 'Datakom D-500', 'Datakom D-700', 'SmartGen HGM9510', 'SmartGen HGM9520', 'Deif AGC-4'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase mb-1 block">Serial Number</label>
                  <input
                    type="text"
                    value={genInfo.serialNumber}
                    onChange={(e) => setGenInfo({ ...genInfo, serialNumber: e.target.value })}
                    placeholder="Enter serial..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase mb-1 block">Running Hours</label>
                  <input
                    type="number"
                    value={genInfo.hours}
                    onChange={(e) => setGenInfo({ ...genInfo, hours: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 4500"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-slate-500">
                  Configured: <span className="text-white font-medium">{genInfo.make} {genInfo.model} {genInfo.kva > 0 ? `(${genInfo.kva} kVA)` : ''}</span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGenSelector(false)}
                    className="px-6 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowGenSelector(false)}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 font-medium shadow-lg transition-all"
                  >
                    Apply & Start Diagnosis
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool Grid - Clickable Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Select Diagnostic Tool</h3>
          <p className="text-sm text-slate-400">Click any tool to launch</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {DIAGNOSTIC_TOOLS.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => setSelectedTool(tool)}
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.97 }}
              className="p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden cursor-pointer hover:shadow-2xl"
              style={{
                backgroundColor: tool.screenColor,
                borderColor: tool.primaryColor + '60',
                boxShadow: `0 4px 20px ${tool.primaryColor}20`
              }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${tool.primaryColor}40, transparent)` }}
              />

              {/* Click indicator pulse */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300" />

              <div className="relative">
                {/* Icon with pulse on hover */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: tool.primaryColor + '30', color: tool.primaryColor }}
                >
                  {tool.icon}
                </div>

                {/* Name */}
                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-white transition-colors">{tool.shortName}</h3>
                <p className="text-xs mb-2" style={{ color: tool.textColor + '80' }}>{tool.name}</p>

                {/* Compatible with */}
                <div className="flex flex-wrap gap-1">
                  {tool.compatibleWith.slice(0, 2).map((brand) => (
                    <span
                      key={brand}
                      className="px-2 py-0.5 rounded text-[10px]"
                      style={{ backgroundColor: tool.primaryColor + '20', color: tool.primaryColor }}
                    >
                      {brand}
                    </span>
                  ))}
                </div>

                {/* Launch indicator - always visible but more prominent on hover */}
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all">
                  <span className="text-[10px] text-white/60 group-hover:text-white/90 hidden sm:inline">Launch</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" style={{ color: tool.primaryColor }} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Tool Interface */}
      <AnimatePresence>
        {selectedTool && (
          <DiagnosticToolInterface
            tool={selectedTool}
            generatorInfo={genInfo}
            onClose={() => setSelectedTool(null)}
            onAIAnalyze={() => setShowAIPanel(true)}
          />
        )}
      </AnimatePresence>

      {/* AI Analysis Panel */}
      <AnimatePresence>
        {showAIPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowAIPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 border border-cyan-500/50 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="font-bold text-white">AI Diagnostic Analysis</h3>
                    <p className="text-xs text-white/70">Generator Oracle Intelligence</p>
                  </div>
                </div>
                <button onClick={() => setShowAIPanel(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <h4 className="text-cyan-400 font-medium mb-2">Analysis for: {genInfo.make} {genInfo.model}</h4>
                  <p className="text-slate-300 text-sm">
                    Based on the current diagnostic data, the AI system has analyzed your generator&apos;s health status and identified potential areas of concern.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Engine Parameters: Normal</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">All engine sensors within normal operating range.</p>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-400 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Maintenance Due: Oil Change</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">Oil change recommended based on 500-hour interval. Current: {genInfo.hours} hours.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600">
                    Generate Full Report
                  </button>
                  <button className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600">
                    Ask AI a Question
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
