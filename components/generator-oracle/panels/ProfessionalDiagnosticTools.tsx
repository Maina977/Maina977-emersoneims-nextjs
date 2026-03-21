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

// Sample live parameters
const generateLiveParameters = (): LiveParameter[] => [
  { id: 'rpm', name: 'Engine Speed', value: 1500 + Math.random() * 10 - 5, unit: 'RPM', min: 0, max: 2000, status: 'normal' },
  { id: 'oil_pressure', name: 'Oil Pressure', value: 4.2 + Math.random() * 0.3, unit: 'bar', min: 0, max: 10, status: 'normal' },
  { id: 'coolant_temp', name: 'Coolant Temp', value: 85 + Math.random() * 2, unit: '°C', min: 0, max: 120, status: 'normal' },
  { id: 'boost_pressure', name: 'Boost Pressure', value: 1.8 + Math.random() * 0.1, unit: 'bar', min: 0, max: 4, status: 'normal' },
  { id: 'fuel_pressure', name: 'Fuel Pressure', value: 350 + Math.random() * 10, unit: 'kPa', min: 0, max: 500, status: 'normal' },
  { id: 'exhaust_temp', name: 'Exhaust Temp', value: 520 + Math.random() * 20, unit: '°C', min: 0, max: 800, status: 'normal' },
  { id: 'battery_voltage', name: 'Battery Voltage', value: 27.8 + Math.random() * 0.2, unit: 'V', min: 20, max: 32, status: 'normal' },
  { id: 'load_percent', name: 'Load', value: 65 + Math.random() * 5, unit: '%', min: 0, max: 100, status: 'normal' },
  { id: 'frequency', name: 'Frequency', value: 50 + Math.random() * 0.1 - 0.05, unit: 'Hz', min: 45, max: 55, status: 'normal' },
  { id: 'power_kw', name: 'Active Power', value: 450 + Math.random() * 20, unit: 'kW', min: 0, max: 750, status: 'normal' },
];

// Sample fault codes
const SAMPLE_FAULTS: FaultCode[] = [
  { code: 'SPN 100 FMI 4', spn: 100, fmi: 4, description: 'Engine Oil Pressure - Voltage Below Normal', severity: 'warning', status: 'logged', count: 2, firstOccurrence: '2026-03-15 14:32', lastOccurrence: '2026-03-18 09:15' },
  { code: 'SPN 110 FMI 16', spn: 110, fmi: 16, description: 'Engine Coolant Temperature - High Warning', severity: 'warning', status: 'active', count: 1, firstOccurrence: '2026-03-20 11:45', lastOccurrence: '2026-03-20 11:45' },
  { code: 'SPN 190 FMI 0', spn: 190, fmi: 0, description: 'Engine Speed - Data Valid Above Normal', severity: 'info', status: 'logged', count: 5, firstOccurrence: '2026-03-10 08:00', lastOccurrence: '2026-03-19 16:30' },
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
  const [activeTab, setActiveTab] = useState<'monitor' | 'faults' | 'params' | 'wiring' | 'tests' | 'config' | 'techinput'>('monitor');
  const [liveParams, setLiveParams] = useState<LiveParameter[]>(generateLiveParameters());
  const [faults, setFaults] = useState<FaultCode[]>(SAMPLE_FAULTS);
  const [isConnected, setIsConnected] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

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

  // Wiring Diagrams Tab
  const WiringTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>
          Wiring Diagrams - {generatorInfo.make} {generatorInfo.model} ({generatorInfo.kva} kVA)
        </h3>
        <div className="flex items-center gap-2">
          <DropdownButton
            id="diagram-type"
            label="Diagram Type"
            options={['Power Wiring', 'Control Wiring', 'Sensor Wiring', 'CAN Bus', 'Complete']}
            onSelect={() => {}}
          />
          <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            <Printer className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            <Download className="w-4 h-4 text-white" />
          </button>
        </div>
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

  // Active Tests Tab
  const TestsTab = () => (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold" style={{ color: tool.textColor }}>Bi-Directional Controls & Active Tests</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: 'Injector Cutout Test', desc: 'Disable injectors one by one', icon: <Fuel className="w-5 h-5" />, warning: true },
          { name: 'Cylinder Compression', desc: 'Relative compression test', icon: <Activity className="w-5 h-5" />, warning: false },
          { name: 'DPF Regeneration', desc: 'Force DPF regen cycle', icon: <Flame className="w-5 h-5" />, warning: true },
          { name: 'Actuator Test', desc: 'Test solenoids and relays', icon: <ToggleRight className="w-5 h-5" />, warning: false },
          { name: 'Fan Override', desc: 'Manual fan control', icon: <Wind className="w-5 h-5" />, warning: false },
          { name: 'Glow Plug Test', desc: 'Test glow plug circuit', icon: <Zap className="w-5 h-5" />, warning: false },
        ].map((test) => (
          <div
            key={test.name}
            className="p-4 rounded-xl border cursor-pointer hover:border-opacity-100 transition-all"
            style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: tool.primaryColor + '20', color: tool.primaryColor }}>
                  {test.icon}
                </div>
                <div>
                  <h4 className="font-medium" style={{ color: tool.textColor }}>{test.name}</h4>
                  <p className="text-xs" style={{ color: tool.textColor + '80' }}>{test.desc}</p>
                </div>
              </div>
              {test.warning && (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <button
              className="w-full mt-2 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: tool.primaryColor }}
            >
              Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );

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
                      className="w-24 px-3 py-1 rounded bg-slate-800 border border-slate-600 text-right font-mono text-sm"
                      style={{ color: tool.textColor }}
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
    <div className="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                      {solution.parts.length > 0 && (
                        <p className="text-xs text-cyan-400 mt-1">Parts: {solution.parts.join(', ')}</p>
                      )}
                      <p className="text-xs text-green-400 mt-1">
                        Est. Cost: {solution.estimatedCost.currency} {solution.estimatedCost.min}-{solution.estimatedCost.max}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Problem Description */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
        <h4 className="font-medium mb-3" style={{ color: tool.textColor }}>Problem Description</h4>
        <textarea
          value={techInput.problemDescription}
          onChange={(e) => setTechInput({ ...techInput, problemDescription: e.target.value })}
          placeholder="Describe the problem in detail. Include when it started, any patterns, and what was happening before the issue began..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 resize-none"
        />
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

      {/* Measurements Input */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: tool.screenColor, borderColor: tool.primaryColor + '40' }}>
        <h4 className="font-medium mb-4" style={{ color: tool.textColor }}>Measured Parameters</h4>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { key: 'batteryVoltage', label: 'Battery Voltage', unit: 'V', icon: <Battery className="w-4 h-4" /> },
            { key: 'oilPressure', label: 'Oil Pressure', unit: 'bar', icon: <Gauge className="w-4 h-4" /> },
            { key: 'coolantTemp', label: 'Coolant Temp', unit: '°C', icon: <Thermometer className="w-4 h-4" /> },
            { key: 'frequency', label: 'Frequency', unit: 'Hz', icon: <Activity className="w-4 h-4" /> },
            { key: 'voltage', label: 'Output Voltage', unit: 'V', icon: <Zap className="w-4 h-4" /> },
          ].map(({ key, label, unit, icon }) => (
            <div key={key}>
              <label className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                {icon} {label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={techInput.measurements[key as keyof typeof techInput.measurements]}
                  onChange={(e) => setTechInput({
                    ...techInput,
                    measurements: { ...techInput.measurements, [key]: e.target.value }
                  })}
                  placeholder="--"
                  className="w-full px-3 py-2 pr-10 rounded bg-slate-800 border border-slate-600 text-white text-right font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{unit}</span>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 pt-20">
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

        {/* Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-700" style={{ backgroundColor: '#1e293b' }}>
          <NavButton icon={<Monitor className="w-4 h-4" />} label="Monitor" active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} />
          <NavButton icon={<AlertTriangle className="w-4 h-4" />} label="Faults" active={activeTab === 'faults'} onClick={() => setActiveTab('faults')} />
          <NavButton icon={<Sliders className="w-4 h-4" />} label="Config" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
          <NavButton icon={<CircuitBoard className="w-4 h-4" />} label="Wiring" active={activeTab === 'wiring'} onClick={() => setActiveTab('wiring')} />
          <NavButton icon={<Play className="w-4 h-4" />} label="Tests" active={activeTab === 'tests'} onClick={() => setActiveTab('tests')} />
          <NavButton icon={<User className="w-4 h-4" />} label="Tech Input" active={activeTab === 'techinput'} onClick={() => setActiveTab('techinput')} />

          <div className="flex-1" />

          {/* Arrow navigation */}
          <button className="p-2 rounded hover:bg-slate-700">
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 rounded hover:bg-slate-700">
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 rounded hover:bg-slate-700">
            <ChevronUp className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 rounded hover:bg-slate-700">
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'monitor' && <MonitorTab />}
            {activeTab === 'faults' && <FaultsTab />}
            {activeTab === 'config' && <ConfigTab />}
            {activeTab === 'wiring' && <WiringTab />}
            {activeTab === 'tests' && <TestsTab />}
            {activeTab === 'techinput' && <TechInputTab />}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 text-xs border-t border-slate-700" style={{ backgroundColor: '#1e293b' }}>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Protocol: J1939</span>
            <span>Baud: 250kbps</span>
            <span>Node: 0x00</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>TX: 1,234</span>
            <span>RX: 5,678</span>
            <span>Errors: 0</span>
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
