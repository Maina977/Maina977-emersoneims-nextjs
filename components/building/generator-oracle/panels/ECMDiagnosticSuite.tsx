'use client';

/**
 * ORACLE UNIVERSAL DIAGNOSTIC SUITE - 10 Engine Platform Interfaces
 *
 * IMPORTANT DISCLAIMER:
 * This is an INDEPENDENT diagnostic reference tool created for educational and
 * troubleshooting purposes. Generator Oracle is NOT affiliated with, endorsed by,
 * licensed by, or officially associated with any engine or controller manufacturer.
 *
 * All brand names, model numbers, and trademarks mentioned are the property of
 * their respective owners. References to manufacturer protocols are for
 * COMPATIBILITY purposes only - indicating which engine platforms this tool
 * can communicate with using standard J1939/CAN protocols.
 *
 * This tool provides GENERIC diagnostic capabilities compatible with:
 * - Swedish Marine/Industrial Engine platforms (J1939/ISO15765)
 * - American Heavy Equipment Engine platforms (J1939/CAN)
 * - American Diesel Engine platforms (J1939/J1708)
 * - British Industrial Engine platforms (J1939/CAN)
 * - American Agricultural Engine platforms (J1939/CAN)
 * - American Heavy-Duty Diesel platforms (J1939/J1587)
 * - German High-Performance Engine platforms (J1939/MDEC)
 * - American Standby Power platforms (Modbus/CAN)
 * - British Controller platforms (Modbus/RS485)
 * - European Controller platforms (Modbus/CAN)
 *
 * For official diagnostics, warranty service, or certified repairs, always
 * consult the manufacturer's authorized service centers.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Battery,
  Bluetooth,
  Cable,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Cpu,
  Database,
  Download,
  Droplets,
  Fan,
  FileText,
  Flame,
  Gauge,
  HardDrive,
  History,
  Layers,
  LineChart,
  Loader2,
  MonitorSmartphone,
  Play,
  Power,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sliders,
  Sparkles,
  Thermometer,
  Timer,
  Truck,
  Upload,
  Usb,
  Wifi,
  Wrench,
  Zap,
  XCircle,
  Cog,
  CircuitBoard,
  Wind,
  Waves,
  ShieldCheck,
  Radio,
  Plug,
  RotateCcw,
  Workflow
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// ECM BRANDS - 10 Diagnostic Platforms
// ═══════════════════════════════════════════════════════════════════════════════

interface ECMBrand {
  id: string;
  name: string;
  fullName: string;
  manufacturer: string;
  logo: string;
  color: string;
  protocols: string[];
  description: string;
}

const ECM_BRANDS: ECMBrand[] = [
  {
    id: 'swedish-marine',
    name: 'Swedish Marine',
    fullName: 'Swedish Marine/Industrial Platform',
    manufacturer: 'Nordic Engine Systems',
    logo: '🔷',
    color: '#003057',
    protocols: ['J1939', 'ISO 15765', 'KWP2000'],
    description: 'Compatible with Swedish marine & industrial engines'
  },
  {
    id: 'american-heavy',
    name: 'American Heavy',
    fullName: 'American Heavy Equipment Platform',
    manufacturer: 'US Heavy Machinery',
    logo: '🟡',
    color: '#FFCD00',
    protocols: ['J1939', 'Proprietary CAN', 'CAN'],
    description: 'Compatible with American heavy equipment engines'
  },
  {
    id: 'american-diesel',
    name: 'American Diesel',
    fullName: 'American Diesel Engine Platform',
    manufacturer: 'US Diesel Systems',
    logo: '🔴',
    color: '#C8102E',
    protocols: ['J1939', 'J1708', 'ISO 15765'],
    description: 'Compatible with American diesel & gas engines'
  },
  {
    id: 'british-industrial',
    name: 'British Industrial',
    fullName: 'British Industrial Engine Platform',
    manufacturer: 'UK Engine Systems',
    logo: '🟢',
    color: '#00843D',
    protocols: ['J1939', 'CAN', 'Proprietary'],
    description: 'Compatible with British industrial engines'
  },
  {
    id: 'american-agri',
    name: 'American Agri',
    fullName: 'American Agricultural Platform',
    manufacturer: 'US Agricultural Systems',
    logo: '🟩',
    color: '#367C2B',
    protocols: ['J1939', 'CAN', 'Telematics'],
    description: 'Compatible with American agricultural engines'
  },
  {
    id: 'american-hd',
    name: 'American HD',
    fullName: 'American Heavy-Duty Platform',
    manufacturer: 'US HD Engine Systems',
    logo: '⬛',
    color: '#1C1C1C',
    protocols: ['J1939', 'J1587', 'CAN'],
    description: 'Compatible with American heavy-duty diesel engines'
  },
  {
    id: 'german-performance',
    name: 'German Performance',
    fullName: 'German High-Performance Platform',
    manufacturer: 'European Power Systems',
    logo: '🔵',
    color: '#0033A0',
    protocols: ['J1939', 'MDEC', 'CAN'],
    description: 'Compatible with German high-performance engines'
  },
  {
    id: 'american-standby',
    name: 'American Standby',
    fullName: 'American Standby Power Platform',
    manufacturer: 'US Power Systems',
    logo: '🟦',
    color: '#005DAA',
    protocols: ['Modbus', 'CAN', 'Ethernet'],
    description: 'Compatible with American standby generators'
  },
  {
    id: 'british-controller',
    name: 'British Controller',
    fullName: 'British Controller Platform',
    manufacturer: 'UK Control Systems',
    logo: '🌊',
    color: '#00A3E0',
    protocols: ['Modbus', 'CAN J1939', 'RS485'],
    description: 'Compatible with British generator controllers'
  },
  {
    id: 'european-controller',
    name: 'European Controller',
    fullName: 'European Controller Platform',
    manufacturer: 'EU Control Systems',
    logo: '🟠',
    color: '#FF6B00',
    protocols: ['Modbus', 'CAN', 'Ethernet'],
    description: 'Compatible with European generator controllers'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM CATEGORIES - Sidebar Navigation
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  subsystems: SubSystem[];
}

interface SubSystem {
  id: string;
  name: string;
  parameters: LiveParameter[];
  faultCodes: FaultCode[];
  activeTests: ActiveTest[];
  calibrations: CalibrationParam[];
}

interface LiveParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  status: 'normal' | 'warning' | 'critical';
  spn?: number;
}

interface FaultCode {
  code: string;
  spn?: number;
  fmi?: number;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'logged' | 'cleared';
  causes: string[];
  repairs: string[];
}

interface ActiveTest {
  id: string;
  name: string;
  description: string;
  duration: number;
  warning?: string;
}

interface CalibrationParam {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  default: number;
  authRequired: boolean;
}

const SYSTEM_CATEGORIES: SystemCategory[] = [
  {
    id: 'engine',
    name: 'Engine',
    icon: Cog,
    description: 'Engine mechanical systems and performance',
    subsystems: [
      {
        id: 'engine-general',
        name: 'General',
        parameters: [
          { id: 'rpm', name: 'Engine Speed', value: 1500, unit: 'RPM', min: 0, max: 2500, status: 'normal', spn: 190 },
          { id: 'load', name: 'Engine Load', value: 65, unit: '%', min: 0, max: 100, status: 'normal', spn: 92 },
          { id: 'torque', name: 'Engine Torque', value: 850, unit: 'Nm', min: 0, max: 1500, status: 'normal', spn: 513 },
          { id: 'hours', name: 'Engine Hours', value: 4562, unit: 'hrs', min: 0, max: 999999, status: 'normal', spn: 247 },
          { id: 'starts', name: 'Total Starts', value: 3245, unit: '', min: 0, max: 999999, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 91 / FMI 3', spn: 91, fmi: 3, description: 'Accelerator Pedal Position - Voltage Above Normal', severity: 'warning', status: 'logged', causes: ['Throttle position sensor failure', 'Wiring short to power', 'ECM input circuit fault'], repairs: ['Check TPS wiring', 'Replace TPS sensor', 'Check ECM connector'] },
          { code: 'SPN 190 / FMI 0', spn: 190, fmi: 0, description: 'Engine Speed - Data Valid But Above Normal', severity: 'critical', status: 'active', causes: ['Overspeed condition', 'Governor malfunction', 'Injection timing error'], repairs: ['Check governor actuator', 'Verify timing', 'Inspect fuel system'] },
        ],
        activeTests: [
          { id: 'cylinder-cutout', name: 'Cylinder Cutout Test', description: 'Disable individual cylinders to identify weak/failing injectors', duration: 60 },
          { id: 'compression', name: 'Relative Compression Test', description: 'Compare compression balance across cylinders', duration: 30 },
        ],
        calibrations: [
          { id: 'high-idle', name: 'High Idle Speed', value: 1850, unit: 'RPM', min: 1800, max: 2000, default: 1850, authRequired: true },
          { id: 'low-idle', name: 'Low Idle Speed', value: 700, unit: 'RPM', min: 600, max: 800, default: 700, authRequired: true },
        ]
      },
      {
        id: 'engine-timing',
        name: 'Timing & Injection',
        parameters: [
          { id: 'inj-timing', name: 'Injection Timing', value: 8.5, unit: '°BTDC', min: 0, max: 20, status: 'normal' },
          { id: 'rail-pressure', name: 'Fuel Rail Pressure', value: 1850, unit: 'bar', min: 0, max: 2500, status: 'normal', spn: 157 },
          { id: 'inj-duration', name: 'Injection Duration', value: 2.4, unit: 'ms', min: 0, max: 10, status: 'normal' },
        ],
        faultCodes: [],
        activeTests: [],
        calibrations: []
      }
    ]
  },
  {
    id: 'fuel',
    name: 'Fuel System',
    icon: Droplets,
    description: 'Fuel delivery, injection, and filtration',
    subsystems: [
      {
        id: 'fuel-supply',
        name: 'Fuel Supply',
        parameters: [
          { id: 'fuel-level', name: 'Fuel Tank Level', value: 75, unit: '%', min: 0, max: 100, status: 'normal', spn: 96 },
          { id: 'fuel-pressure-supply', name: 'Supply Pump Pressure', value: 4.5, unit: 'bar', min: 0, max: 10, status: 'normal' },
          { id: 'fuel-temp', name: 'Fuel Temperature', value: 42, unit: '°C', min: -40, max: 100, status: 'normal', spn: 174 },
          { id: 'fuel-rate', name: 'Fuel Consumption Rate', value: 45.2, unit: 'L/hr', min: 0, max: 200, status: 'normal', spn: 183 },
          { id: 'water-in-fuel', name: 'Water in Fuel', value: 0, unit: '', min: 0, max: 1, status: 'normal', spn: 97 },
        ],
        faultCodes: [
          { code: 'SPN 97 / FMI 15', spn: 97, fmi: 15, description: 'Water In Fuel Indicator - High Most Severe', severity: 'critical', status: 'active', causes: ['Water contamination in fuel tank', 'Fuel/water separator full', 'Condensation in tank'], repairs: ['Drain fuel/water separator', 'Test fuel sample', 'Replace filter', 'Drain and clean tank'] },
          { code: 'SPN 157 / FMI 1', spn: 157, fmi: 1, description: 'Fuel Rail Pressure - Data Valid But Below Normal', severity: 'warning', status: 'active', causes: ['Fuel filter clogged', 'Lift pump failure', 'Fuel line restriction', 'Injector leak'], repairs: ['Replace fuel filters', 'Check lift pump operation', 'Inspect fuel lines', 'Perform injector leak-off test'] },
        ],
        activeTests: [
          { id: 'injector-leak', name: 'Injector Leak-Off Test', description: 'Measure fuel return from each injector to identify internal leaks', duration: 120, warning: 'Engine must be at operating temperature' },
          { id: 'prime-fuel', name: 'Electric Fuel Pump Prime', description: 'Activate electric fuel pump to prime system', duration: 30 },
        ],
        calibrations: [
          { id: 'rail-pressure-target', name: 'Target Rail Pressure', value: 1800, unit: 'bar', min: 1500, max: 2200, default: 1800, authRequired: true },
        ]
      },
      {
        id: 'fuel-injection',
        name: 'Fuel Injection',
        parameters: [
          { id: 'rail-pressure', name: 'Common Rail Pressure', value: 1850, unit: 'bar', min: 0, max: 2500, status: 'normal', spn: 157 },
          { id: 'pilot-qty', name: 'Pilot Injection Quantity', value: 2.5, unit: 'mm³', min: 0, max: 10, status: 'normal' },
          { id: 'main-qty', name: 'Main Injection Quantity', value: 85, unit: 'mm³', min: 0, max: 200, status: 'normal' },
          { id: 'inj1-trim', name: 'Injector 1 Trim', value: 0.5, unit: '%', min: -10, max: 10, status: 'normal' },
          { id: 'inj2-trim', name: 'Injector 2 Trim', value: -0.3, unit: '%', min: -10, max: 10, status: 'normal' },
          { id: 'inj3-trim', name: 'Injector 3 Trim', value: 0.2, unit: '%', min: -10, max: 10, status: 'normal' },
          { id: 'inj4-trim', name: 'Injector 4 Trim', value: -0.8, unit: '%', min: -10, max: 10, status: 'normal' },
          { id: 'inj5-trim', name: 'Injector 5 Trim', value: 0.1, unit: '%', min: -10, max: 10, status: 'normal' },
          { id: 'inj6-trim', name: 'Injector 6 Trim', value: 0.4, unit: '%', min: -10, max: 10, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 651 / FMI 5', spn: 651, fmi: 5, description: 'Injector Cylinder #1 - Current Below Normal', severity: 'critical', status: 'logged', causes: ['Injector solenoid open circuit', 'Wiring harness damage', 'ECM driver circuit failure'], repairs: ['Check injector connector', 'Measure injector resistance', 'Inspect wiring harness', 'Replace injector'] },
        ],
        activeTests: [
          { id: 'inj-cutout', name: 'Injector Cutout Test', description: 'Disable each injector sequentially to identify cylinder contribution', duration: 60 },
          { id: 'inj-buzz', name: 'Injector Buzz Test', description: 'Energize injectors to verify solenoid operation', duration: 10 },
        ],
        calibrations: []
      }
    ]
  },
  {
    id: 'cooling',
    name: 'Cooling System',
    icon: Thermometer,
    description: 'Engine cooling, thermostat, and radiator',
    subsystems: [
      {
        id: 'cooling-temps',
        name: 'Temperatures',
        parameters: [
          { id: 'coolant-temp', name: 'Coolant Temperature', value: 85, unit: '°C', min: -40, max: 120, status: 'normal', spn: 110 },
          { id: 'coolant-temp-out', name: 'Coolant Temp (Radiator Out)', value: 78, unit: '°C', min: -40, max: 120, status: 'normal' },
          { id: 'intercooler-temp', name: 'Charge Air Cooler Temp', value: 52, unit: '°C', min: -40, max: 100, status: 'normal', spn: 52 },
          { id: 'oil-cooler-temp', name: 'Oil Cooler Outlet Temp', value: 88, unit: '°C', min: -40, max: 150, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 110 / FMI 16', spn: 110, fmi: 16, description: 'Engine Coolant Temperature - High Warning', severity: 'warning', status: 'active', causes: ['Low coolant level', 'Thermostat stuck closed', 'Radiator blockage', 'Water pump failure', 'Fan belt slipping'], repairs: ['Check coolant level', 'Inspect thermostat', 'Clean radiator', 'Check water pump', 'Inspect belt tension'] },
          { code: 'SPN 110 / FMI 0', spn: 110, fmi: 0, description: 'Engine Coolant Temperature - Data Valid Above Normal', severity: 'critical', status: 'logged', causes: ['Severe overheating', 'Complete coolant loss', 'Head gasket failure'], repairs: ['STOP ENGINE IMMEDIATELY', 'Allow cooling', 'Check for leaks', 'Pressure test cooling system'] },
        ],
        activeTests: [
          { id: 'fan-test', name: 'Cooling Fan Test', description: 'Activate cooling fan at full speed', duration: 30 },
          { id: 'thermostat-test', name: 'Thermostat Function Test', description: 'Monitor temperature rise during warmup', duration: 300 },
        ],
        calibrations: [
          { id: 'fan-on-temp', name: 'Fan ON Temperature', value: 88, unit: '°C', min: 80, max: 98, default: 88, authRequired: false },
          { id: 'fan-off-temp', name: 'Fan OFF Temperature', value: 82, unit: '°C', min: 75, max: 90, default: 82, authRequired: false },
          { id: 'high-temp-warn', name: 'High Temp Warning', value: 100, unit: '°C', min: 95, max: 105, default: 100, authRequired: true },
          { id: 'high-temp-shutdown', name: 'High Temp Shutdown', value: 107, unit: '°C', min: 100, max: 115, default: 107, authRequired: true },
        ]
      },
      {
        id: 'cooling-flow',
        name: 'Coolant Flow',
        parameters: [
          { id: 'coolant-level', name: 'Coolant Level', value: 100, unit: '%', min: 0, max: 100, status: 'normal', spn: 111 },
          { id: 'coolant-pressure', name: 'Coolant Pressure', value: 1.2, unit: 'bar', min: 0, max: 2.5, status: 'normal' },
          { id: 'water-pump-speed', name: 'Water Pump Speed', value: 2800, unit: 'RPM', min: 0, max: 5000, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 111 / FMI 1', spn: 111, fmi: 1, description: 'Coolant Level - Low', severity: 'warning', status: 'active', causes: ['External leak', 'Internal leak (head gasket)', 'Radiator cap failure'], repairs: ['Pressure test system', 'Check hoses and clamps', 'Inspect head gasket', 'Replace radiator cap'] },
        ],
        activeTests: [],
        calibrations: []
      }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical System',
    icon: Zap,
    description: 'Batteries, charging, starting, and sensors',
    subsystems: [
      {
        id: 'electrical-battery',
        name: 'Battery & Charging',
        parameters: [
          { id: 'battery-voltage', name: 'Battery Voltage', value: 28.2, unit: 'V', min: 0, max: 32, status: 'normal', spn: 168 },
          { id: 'charging-voltage', name: 'Charging Voltage', value: 28.5, unit: 'V', min: 0, max: 32, status: 'normal' },
          { id: 'charging-current', name: 'Charging Current', value: 45, unit: 'A', min: 0, max: 100, status: 'normal' },
          { id: 'alternator-temp', name: 'Alternator Temperature', value: 75, unit: '°C', min: 0, max: 150, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 168 / FMI 17', spn: 168, fmi: 17, description: 'Battery Voltage - Low Warning', severity: 'warning', status: 'active', causes: ['Battery drain', 'Alternator failure', 'Belt slipping', 'Poor connection'], repairs: ['Load test battery', 'Check alternator output', 'Inspect belt tension', 'Clean terminals'] },
          { code: 'SPN 168 / FMI 0', spn: 168, fmi: 0, description: 'Battery Voltage - High', severity: 'warning', status: 'logged', causes: ['Voltage regulator failure', 'Loose connections'], repairs: ['Check voltage regulator', 'Inspect wiring'] },
        ],
        activeTests: [
          { id: 'alternator-output', name: 'Alternator Output Test', description: 'Measure alternator voltage and current output', duration: 30 },
          { id: 'battery-load', name: 'Battery Load Test', description: 'Apply load to battery and measure voltage drop', duration: 15 },
        ],
        calibrations: [
          { id: 'charge-voltage', name: 'Target Charge Voltage', value: 28.4, unit: 'V', min: 27, max: 29, default: 28.4, authRequired: false },
          { id: 'low-voltage-warn', name: 'Low Voltage Warning', value: 24, unit: 'V', min: 22, max: 26, default: 24, authRequired: true },
        ]
      },
      {
        id: 'electrical-starting',
        name: 'Starting System',
        parameters: [
          { id: 'starter-voltage', name: 'Starter Voltage', value: 24.5, unit: 'V', min: 0, max: 32, status: 'normal' },
          { id: 'crank-speed', name: 'Cranking Speed', value: 180, unit: 'RPM', min: 0, max: 400, status: 'normal' },
          { id: 'glow-plug-current', name: 'Glow Plug Current', value: 45, unit: 'A', min: 0, max: 100, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 677 / FMI 5', spn: 677, fmi: 5, description: 'Starter Motor Relay - Current Below Normal', severity: 'warning', status: 'logged', causes: ['Starter relay failure', 'Wiring fault', 'Starter motor failure'], repairs: ['Check starter relay', 'Inspect wiring', 'Test starter motor'] },
        ],
        activeTests: [
          { id: 'starter-test', name: 'Starter Engage Test', description: 'Engage starter motor without fuel injection', duration: 5, warning: 'Disable fuel system first' },
          { id: 'glow-plug-test', name: 'Glow Plug Test', description: 'Activate glow plugs and measure current', duration: 30 },
        ],
        calibrations: [
          { id: 'crank-time-limit', name: 'Crank Time Limit', value: 30, unit: 's', min: 10, max: 60, default: 30, authRequired: true },
          { id: 'glow-time', name: 'Glow Plug Time', value: 10, unit: 's', min: 5, max: 30, default: 10, authRequired: false },
        ]
      },
      {
        id: 'electrical-sensors',
        name: 'Sensors',
        parameters: [
          { id: 'map-sensor', name: 'MAP Sensor Voltage', value: 2.4, unit: 'V', min: 0, max: 5, status: 'normal' },
          { id: 'ect-sensor', name: 'ECT Sensor Voltage', value: 1.8, unit: 'V', min: 0, max: 5, status: 'normal' },
          { id: 'oil-pressure-sensor', name: 'Oil Pressure Sensor', value: 3.2, unit: 'V', min: 0, max: 5, status: 'normal' },
          { id: 'crank-sensor', name: 'Crank Position Sensor', value: 1, unit: '', min: 0, max: 1, status: 'normal' },
          { id: 'cam-sensor', name: 'Cam Position Sensor', value: 1, unit: '', min: 0, max: 1, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 723 / FMI 8', spn: 723, fmi: 8, description: 'Engine Speed Sensor - Abnormal Frequency', severity: 'critical', status: 'active', causes: ['Sensor failure', 'Air gap incorrect', 'Tone wheel damage', 'Wiring fault'], repairs: ['Check sensor gap', 'Inspect tone wheel', 'Test sensor output', 'Check wiring'] },
        ],
        activeTests: [],
        calibrations: []
      }
    ]
  },
  {
    id: 'intake-exhaust',
    name: 'Intake/Exhaust',
    icon: Wind,
    description: 'Air intake, turbocharger, and exhaust',
    subsystems: [
      {
        id: 'intake-air',
        name: 'Air Intake',
        parameters: [
          { id: 'intake-temp', name: 'Intake Air Temperature', value: 42, unit: '°C', min: -40, max: 80, status: 'normal', spn: 105 },
          { id: 'boost-pressure', name: 'Boost Pressure', value: 1.8, unit: 'bar', min: 0, max: 4, status: 'normal', spn: 102 },
          { id: 'baro-pressure', name: 'Barometric Pressure', value: 101, unit: 'kPa', min: 80, max: 110, status: 'normal', spn: 108 },
          { id: 'air-filter-dp', name: 'Air Filter Restriction', value: 2.5, unit: 'kPa', min: 0, max: 10, status: 'normal', spn: 107 },
          { id: 'maf', name: 'Mass Air Flow', value: 450, unit: 'kg/hr', min: 0, max: 1000, status: 'normal', spn: 132 },
        ],
        faultCodes: [
          { code: 'SPN 107 / FMI 0', spn: 107, fmi: 0, description: 'Air Filter Restriction - Above Normal', severity: 'warning', status: 'active', causes: ['Dirty air filter', 'Collapsed intake hose', 'Blocked air intake'], repairs: ['Replace air filter', 'Inspect intake ducting', 'Check pre-cleaner'] },
          { code: 'SPN 102 / FMI 16', spn: 102, fmi: 16, description: 'Boost Pressure - High Warning', severity: 'warning', status: 'logged', causes: ['Wastegate stuck closed', 'Boost sensor fault', 'Turbo overspeeding'], repairs: ['Check wastegate operation', 'Verify boost sensor', 'Inspect turbo'] },
        ],
        activeTests: [
          { id: 'wastegate-test', name: 'Wastegate Actuator Test', description: 'Cycle wastegate actuator to verify operation', duration: 15 },
        ],
        calibrations: [
          { id: 'boost-limit', name: 'Maximum Boost Pressure', value: 2.5, unit: 'bar', min: 1.5, max: 3.5, default: 2.5, authRequired: true },
        ]
      },
      {
        id: 'turbo',
        name: 'Turbocharger',
        parameters: [
          { id: 'turbo-speed', name: 'Turbo Speed', value: 85000, unit: 'RPM', min: 0, max: 150000, status: 'normal', spn: 103 },
          { id: 'turbo-oil-pressure', name: 'Turbo Oil Pressure', value: 3.5, unit: 'bar', min: 0, max: 6, status: 'normal' },
          { id: 'vgt-position', name: 'VGT Position', value: 45, unit: '%', min: 0, max: 100, status: 'normal', spn: 1209 },
          { id: 'compressor-outlet-temp', name: 'Compressor Outlet Temp', value: 165, unit: '°C', min: 0, max: 250, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 1209 / FMI 7', spn: 1209, fmi: 7, description: 'VGT Actuator - Not Responding', severity: 'critical', status: 'active', causes: ['VGT actuator failure', 'Sticking vanes', 'Electrical fault'], repairs: ['Check actuator operation', 'Clean VGT vanes', 'Inspect wiring'] },
        ],
        activeTests: [
          { id: 'vgt-sweep', name: 'VGT Sweep Test', description: 'Move VGT vanes through full range', duration: 30 },
        ],
        calibrations: []
      },
      {
        id: 'exhaust',
        name: 'Exhaust',
        parameters: [
          { id: 'exhaust-temp-1', name: 'Exhaust Temp (Turbo In)', value: 520, unit: '°C', min: 0, max: 900, status: 'normal', spn: 173 },
          { id: 'exhaust-temp-2', name: 'Exhaust Temp (Turbo Out)', value: 380, unit: '°C', min: 0, max: 700, status: 'normal' },
          { id: 'exhaust-pressure', name: 'Exhaust Back Pressure', value: 15, unit: 'kPa', min: 0, max: 50, status: 'normal', spn: 81 },
        ],
        faultCodes: [
          { code: 'SPN 173 / FMI 0', spn: 173, fmi: 0, description: 'Exhaust Temperature - High', severity: 'critical', status: 'active', causes: ['Excessive load', 'Injection timing retarded', 'Turbo failure', 'Exhaust restriction'], repairs: ['Reduce load', 'Check injection timing', 'Inspect turbo', 'Check exhaust system'] },
        ],
        activeTests: [],
        calibrations: []
      }
    ]
  },
  {
    id: 'lubrication',
    name: 'Lubrication',
    icon: Droplets,
    description: 'Engine oil pressure, temperature, and level',
    subsystems: [
      {
        id: 'oil-system',
        name: 'Oil System',
        parameters: [
          { id: 'oil-pressure', name: 'Engine Oil Pressure', value: 4.2, unit: 'bar', min: 0, max: 10, status: 'normal', spn: 100 },
          { id: 'oil-temp', name: 'Engine Oil Temperature', value: 95, unit: '°C', min: -40, max: 150, status: 'normal', spn: 175 },
          { id: 'oil-level', name: 'Engine Oil Level', value: 85, unit: '%', min: 0, max: 100, status: 'normal', spn: 98 },
          { id: 'oil-life', name: 'Oil Life Remaining', value: 65, unit: '%', min: 0, max: 100, status: 'normal' },
          { id: 'oil-filter-dp', name: 'Oil Filter ΔP', value: 0.8, unit: 'bar', min: 0, max: 3, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 100 / FMI 1', spn: 100, fmi: 1, description: 'Engine Oil Pressure - Low', severity: 'critical', status: 'active', causes: ['Low oil level', 'Oil pump failure', 'Oil filter clogged', 'Bearing wear', 'Oil pressure sensor fault'], repairs: ['Check oil level immediately', 'Inspect oil pump', 'Replace oil filter', 'Check bearings', 'Test sensor'] },
          { code: 'SPN 175 / FMI 16', spn: 175, fmi: 16, description: 'Engine Oil Temperature - High Warning', severity: 'warning', status: 'logged', causes: ['Oil cooler blockage', 'Low oil level', 'Excessive load', 'Wrong oil viscosity'], repairs: ['Clean oil cooler', 'Check oil level', 'Reduce load', 'Verify oil specification'] },
        ],
        activeTests: [
          { id: 'oil-pressure-test', name: 'Oil Pressure Test', description: 'Monitor oil pressure at various RPMs', duration: 60 },
        ],
        calibrations: [
          { id: 'low-oil-warn', name: 'Low Oil Pressure Warning', value: 1.5, unit: 'bar', min: 1, max: 2.5, default: 1.5, authRequired: true },
          { id: 'low-oil-shutdown', name: 'Low Oil Pressure Shutdown', value: 0.8, unit: 'bar', min: 0.5, max: 1.5, default: 0.8, authRequired: true },
        ]
      }
    ]
  },
  {
    id: 'aftertreatment',
    name: 'Aftertreatment',
    icon: Sparkles,
    description: 'DPF, SCR, DOC, and emissions systems',
    subsystems: [
      {
        id: 'dpf',
        name: 'Diesel Particulate Filter',
        parameters: [
          { id: 'dpf-soot', name: 'DPF Soot Load', value: 45, unit: '%', min: 0, max: 100, status: 'normal', spn: 3251 },
          { id: 'dpf-ash', name: 'DPF Ash Load', value: 15, unit: '%', min: 0, max: 100, status: 'normal', spn: 3250 },
          { id: 'dpf-inlet-temp', name: 'DPF Inlet Temperature', value: 385, unit: '°C', min: 0, max: 700, status: 'normal', spn: 3242 },
          { id: 'dpf-outlet-temp', name: 'DPF Outlet Temperature', value: 420, unit: '°C', min: 0, max: 700, status: 'normal', spn: 3246 },
          { id: 'dpf-dp', name: 'DPF Differential Pressure', value: 8.5, unit: 'kPa', min: 0, max: 30, status: 'normal', spn: 3251 },
          { id: 'regen-status', name: 'Regeneration Status', value: 0, unit: '', min: 0, max: 3, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 3251 / FMI 0', spn: 3251, fmi: 0, description: 'DPF Soot Load - Above Normal', severity: 'warning', status: 'active', causes: ['Failed regeneration', 'Excessive idle time', 'Faulty sensors', 'Injector issues'], repairs: ['Force regeneration', 'Check sensors', 'Inspect injectors', 'Verify exhaust temperatures'] },
          { code: 'SPN 3251 / FMI 16', spn: 3251, fmi: 16, description: 'DPF Differential Pressure - High', severity: 'critical', status: 'logged', causes: ['Blocked DPF', 'Ash accumulation', 'Failed regen cycles'], repairs: ['Perform forced regen', 'DPF cleaning required', 'Check ash load', 'May need replacement'] },
        ],
        activeTests: [
          { id: 'force-regen', name: 'Forced DPF Regeneration', description: 'Initiate parked regeneration to burn off soot', duration: 1800, warning: 'Keep away from flammable materials. Exhaust temps exceed 600°C' },
          { id: 'regen-inhibit', name: 'Regeneration Inhibit', description: 'Prevent automatic regeneration', duration: 0 },
        ],
        calibrations: [
          { id: 'regen-soot-threshold', name: 'Regen Soot Threshold', value: 80, unit: '%', min: 60, max: 95, default: 80, authRequired: true },
        ]
      },
      {
        id: 'scr',
        name: 'Selective Catalytic Reduction',
        parameters: [
          { id: 'def-level', name: 'DEF Tank Level', value: 75, unit: '%', min: 0, max: 100, status: 'normal', spn: 1761 },
          { id: 'def-temp', name: 'DEF Temperature', value: 25, unit: '°C', min: -40, max: 80, status: 'normal', spn: 3031 },
          { id: 'def-quality', name: 'DEF Concentration', value: 32.5, unit: '%', min: 30, max: 35, status: 'normal', spn: 3364 },
          { id: 'nox-upstream', name: 'NOx (Engine Out)', value: 850, unit: 'ppm', min: 0, max: 2000, status: 'normal', spn: 3216 },
          { id: 'nox-downstream', name: 'NOx (Tailpipe)', value: 45, unit: 'ppm', min: 0, max: 500, status: 'normal', spn: 3226 },
          { id: 'scr-efficiency', name: 'SCR Conversion Efficiency', value: 94.7, unit: '%', min: 0, max: 100, status: 'normal' },
          { id: 'scr-inlet-temp', name: 'SCR Inlet Temperature', value: 350, unit: '°C', min: 0, max: 600, status: 'normal', spn: 4360 },
        ],
        faultCodes: [
          { code: 'SPN 1761 / FMI 17', spn: 1761, fmi: 17, description: 'DEF Tank Level - Low Warning', severity: 'warning', status: 'active', causes: ['Low DEF level', 'Level sensor fault'], repairs: ['Fill DEF tank', 'Check sensor operation'] },
          { code: 'SPN 3364 / FMI 0', spn: 3364, fmi: 0, description: 'DEF Quality - Out of Range', severity: 'critical', status: 'logged', causes: ['Contaminated DEF', 'Wrong fluid used', 'Sensor fault'], repairs: ['Drain and refill with quality DEF', 'Check DEF quality sensor', 'Verify DEF source'] },
          { code: 'SPN 3719 / FMI 31', spn: 3719, fmi: 31, description: 'NOx Conversion Efficiency - Below Threshold', severity: 'warning', status: 'active', causes: ['DEF quality issue', 'SCR catalyst degradation', 'NOx sensor fault', 'Low SCR temperature'], repairs: ['Verify DEF quality', 'Check NOx sensors', 'Inspect catalyst', 'Review duty cycle'] },
        ],
        activeTests: [
          { id: 'def-dosing-test', name: 'DEF Dosing Test', description: 'Verify DEF injection quantity and timing', duration: 60 },
          { id: 'nox-sensor-test', name: 'NOx Sensor Test', description: 'Verify NOx sensor accuracy with reference gas', duration: 120 },
        ],
        calibrations: []
      }
    ]
  },
  {
    id: 'protection',
    name: 'Protection',
    icon: ShieldCheck,
    description: 'Engine protection limits and shutdowns',
    subsystems: [
      {
        id: 'protection-limits',
        name: 'Protection Limits',
        parameters: [
          { id: 'overspeed-status', name: 'Overspeed Protection', value: 1, unit: '', min: 0, max: 1, status: 'normal' },
          { id: 'overtemp-status', name: 'Overtemperature Protection', value: 1, unit: '', min: 0, max: 1, status: 'normal' },
          { id: 'low-oil-status', name: 'Low Oil Protection', value: 1, unit: '', min: 0, max: 1, status: 'normal' },
          { id: 'high-coolant-status', name: 'High Coolant Temp Protection', value: 1, unit: '', min: 0, max: 1, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 1569 / FMI 31', spn: 1569, fmi: 31, description: 'Engine Protection System - Shutdown Active', severity: 'critical', status: 'active', causes: ['Protection limit exceeded', 'Multiple fault conditions'], repairs: ['Identify root cause', 'Clear faults after repair', 'Verify protection systems'] },
        ],
        activeTests: [],
        calibrations: [
          { id: 'overspeed-limit', name: 'Overspeed Limit', value: 2200, unit: 'RPM', min: 2000, max: 2500, default: 2200, authRequired: true },
          { id: 'high-temp-shutdown', name: 'High Temp Shutdown', value: 107, unit: '°C', min: 100, max: 115, default: 107, authRequired: true },
          { id: 'low-oil-shutdown', name: 'Low Oil Shutdown', value: 0.8, unit: 'bar', min: 0.5, max: 1.5, default: 0.8, authRequired: true },
        ]
      }
    ]
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: Radio,
    description: 'CAN bus, J1939, and network diagnostics',
    subsystems: [
      {
        id: 'can-bus',
        name: 'CAN Bus',
        parameters: [
          { id: 'can-bus-load', name: 'CAN Bus Load', value: 35, unit: '%', min: 0, max: 100, status: 'normal' },
          { id: 'can-error-count', name: 'CAN Error Count', value: 0, unit: '', min: 0, max: 255, status: 'normal' },
          { id: 'j1939-messages', name: 'J1939 Messages/sec', value: 245, unit: '/s', min: 0, max: 1000, status: 'normal' },
          { id: 'nodes-detected', name: 'Nodes Detected', value: 5, unit: '', min: 0, max: 20, status: 'normal' },
        ],
        faultCodes: [
          { code: 'SPN 639 / FMI 2', spn: 639, fmi: 2, description: 'J1939 Network - Data Erratic', severity: 'warning', status: 'logged', causes: ['CAN bus termination', 'Wiring fault', 'ECU communication error'], repairs: ['Check terminating resistors', 'Inspect wiring', 'Verify ECU addresses'] },
        ],
        activeTests: [
          { id: 'can-bus-test', name: 'CAN Bus Integrity Test', description: 'Check CAN bus for errors and measure bus load', duration: 30 },
        ],
        calibrations: []
      }
    ]
  },
  {
    id: 'generator',
    name: 'Generator',
    icon: Zap,
    description: 'AC generator output and load',
    subsystems: [
      {
        id: 'generator-output',
        name: 'Generator Output',
        parameters: [
          { id: 'gen-voltage-l1', name: 'Voltage L1-N', value: 230, unit: 'V', min: 0, max: 300, status: 'normal' },
          { id: 'gen-voltage-l2', name: 'Voltage L2-N', value: 232, unit: 'V', min: 0, max: 300, status: 'normal' },
          { id: 'gen-voltage-l3', name: 'Voltage L3-N', value: 229, unit: 'V', min: 0, max: 300, status: 'normal' },
          { id: 'gen-current-l1', name: 'Current L1', value: 125, unit: 'A', min: 0, max: 500, status: 'normal' },
          { id: 'gen-current-l2', name: 'Current L2', value: 118, unit: 'A', min: 0, max: 500, status: 'normal' },
          { id: 'gen-current-l3', name: 'Current L3', value: 122, unit: 'A', min: 0, max: 500, status: 'normal' },
          { id: 'gen-frequency', name: 'Frequency', value: 50.0, unit: 'Hz', min: 0, max: 70, status: 'normal' },
          { id: 'gen-power-kw', name: 'Active Power', value: 75, unit: 'kW', min: 0, max: 200, status: 'normal' },
          { id: 'gen-power-kva', name: 'Apparent Power', value: 82, unit: 'kVA', min: 0, max: 250, status: 'normal' },
          { id: 'gen-pf', name: 'Power Factor', value: 0.91, unit: '', min: 0, max: 1, status: 'normal' },
        ],
        faultCodes: [
          { code: 'GEN-001', description: 'Under Voltage L1', severity: 'warning', status: 'logged', causes: ['AVR failure', 'Overload', 'Excitation fault'], repairs: ['Check AVR', 'Reduce load', 'Check excitation circuit'] },
          { code: 'GEN-002', description: 'Over Frequency', severity: 'critical', status: 'active', causes: ['Governor fault', 'Load rejection', 'Speed sensor error'], repairs: ['Check governor', 'Verify load', 'Check speed sensor'] },
        ],
        activeTests: [
          { id: 'load-bank-test', name: 'Load Bank Test', description: 'Apply stepped load to verify generator output', duration: 300 },
          { id: 'avr-test', name: 'AVR Response Test', description: 'Verify AVR voltage regulation', duration: 60 },
        ],
        calibrations: [
          { id: 'target-voltage', name: 'Target Voltage', value: 230, unit: 'V', min: 220, max: 240, default: 230, authRequired: true },
          { id: 'target-frequency', name: 'Target Frequency', value: 50.0, unit: 'Hz', min: 49, max: 51, default: 50.0, authRequired: true },
          { id: 'under-voltage-trip', name: 'Under Voltage Trip', value: 200, unit: 'V', min: 180, max: 210, default: 200, authRequired: true },
          { id: 'over-voltage-trip', name: 'Over Voltage Trip', value: 260, unit: 'V', min: 250, max: 280, default: 260, authRequired: true },
        ]
      }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ECMDiagnosticSuite() {
  // State
  const [selectedBrand, setSelectedBrand] = useState<ECMBrand>(ECM_BRANDS[0]);
  const [selectedSystem, setSelectedSystem] = useState<SystemCategory>(SYSTEM_CATEGORIES[0]);
  const [selectedSubsystem, setSelectedSubsystem] = useState<SubSystem>(SYSTEM_CATEGORIES[0].subsystems[0]);
  const [expandedSystems, setExpandedSystems] = useState<string[]>(['engine']);
  const [activeTab, setActiveTab] = useState<'livedata' | 'faults' | 'tests' | 'calibration'>('livedata');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProtocol, setConnectionProtocol] = useState('J1939');

  // Toggle system expansion
  const toggleSystem = (systemId: string) => {
    setExpandedSystems(prev =>
      prev.includes(systemId)
        ? prev.filter(id => id !== systemId)
        : [...prev, systemId]
    );
  };

  // Select subsystem
  const selectSubsystem = (system: SystemCategory, subsystem: SubSystem) => {
    setSelectedSystem(system);
    setSelectedSubsystem(subsystem);
  };

  // Connect handler
  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-emerald-400';
      case 'warning': return 'text-amber-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning': return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* DISCLAIMER BANNER */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2">
        <div className="max-w-[1800px] mx-auto flex items-center gap-2 text-xs text-amber-400/80">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p>
            <strong>Independent Reference Tool:</strong> Generator Oracle is NOT affiliated with any engine manufacturer.
            Platform names indicate protocol compatibility only. All trademarks belong to their respective owners.
            For official service, contact authorized dealers.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* TOP BAR - Platform Selector */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
              {ECM_BRANDS.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    selectedBrand.id === brand.id
                      ? 'bg-slate-800 border border-cyan-500/50 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-lg">{brand.logo}</span>
                  <span className="font-medium">{brand.name}</span>
                </button>
              ))}
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg ${connectionProtocol === 'J1939' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`} onClick={() => setConnectionProtocol('J1939')}>
                  <Cable className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg ${connectionProtocol === 'Bluetooth' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`} onClick={() => setConnectionProtocol('Bluetooth')}>
                  <Bluetooth className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg ${connectionProtocol === 'WiFi' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`} onClick={() => setConnectionProtocol('WiFi')}>
                  <Wifi className="w-5 h-5" />
                </button>
                <button className={`p-2 rounded-lg ${connectionProtocol === 'USB' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`} onClick={() => setConnectionProtocol('USB')}>
                  <Usb className="w-5 h-5" />
                </button>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isConnected ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-sm font-medium">{isConnected ? `${selectedBrand.name} Connected` : 'Disconnected'}</span>
              </div>

              <button
                onClick={isConnected ? () => setIsConnected(false) : handleConnect}
                disabled={isConnecting}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isConnected
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
                }`}
              >
                {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Power className="w-5 h-5" />}
                {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1800px] mx-auto flex">
        {/* ─────────────────────────────────────────────────────────────────────────────── */}
        {/* LEFT SIDEBAR - System Navigation (Scrollable) */}
        {/* ─────────────────────────────────────────────────────────────────────────────── */}
        <div className="w-72 min-h-[calc(100vh-64px)] bg-slate-900/50 border-r border-slate-700/50 overflow-y-auto">
          <div className="p-4">
            {/* Brand Info Header */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: selectedBrand.color + '30' }}>
                  {selectedBrand.logo}
                </div>
                <div>
                  <h2 className="text-white font-bold">{selectedBrand.fullName}</h2>
                  <p className="text-xs text-slate-400">{selectedBrand.manufacturer}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-2">{selectedBrand.description}</p>
              <div className="flex flex-wrap gap-1">
                {selectedBrand.protocols.map(p => (
                  <span key={p} className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-300">{p}</span>
                ))}
              </div>
            </div>

            {/* System Categories */}
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Systems</h3>
            <div className="space-y-1">
              {SYSTEM_CATEGORIES.map((system) => {
                const Icon = system.icon;
                const isExpanded = expandedSystems.includes(system.id);
                const isSelected = selectedSystem.id === system.id;

                return (
                  <div key={system.id}>
                    {/* System Header */}
                    <button
                      onClick={() => toggleSystem(system.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-left font-medium">{system.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Subsystems */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 pl-4 border-l border-slate-700/50 py-1 space-y-0.5">
                            {system.subsystems.map((subsystem) => (
                              <button
                                key={subsystem.id}
                                onClick={() => selectSubsystem(system, subsystem)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                  selectedSubsystem.id === subsystem.id
                                    ? 'bg-cyan-500/20 text-cyan-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                                }`}
                              >
                                {subsystem.name}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────── */}
        {/* MAIN CONTENT AREA */}
        {/* ─────────────────────────────────────────────────────────────────────────────── */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                {(() => { const Icon = selectedSystem.icon; return <Icon className="w-7 h-7 text-cyan-400" />; })()}
                {selectedSystem.name} - {selectedSubsystem.name}
              </h1>
              <p className="text-slate-400">{selectedSystem.description}</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/50">
              {[
                { id: 'livedata', label: 'Live Data', icon: Activity },
                { id: 'faults', label: 'Fault Codes', icon: AlertTriangle, count: selectedSubsystem.faultCodes.filter(f => f.status === 'active').length },
                { id: 'tests', label: 'Active Tests', icon: Play },
                { id: 'calibration', label: 'Calibration', icon: Sliders },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{tab.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* LIVE DATA TAB */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'livedata' && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedSubsystem.parameters.map((param) => (
                <div
                  key={param.id}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-slate-400">{param.name}</span>
                    {param.spn && (
                      <span className="text-xs text-slate-600">SPN {param.spn}</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${getStatusColor(param.status)}`}>
                      {typeof param.value === 'number' ? param.value.toLocaleString() : param.value}
                    </span>
                    <span className="text-slate-500">{param.unit}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        param.status === 'normal' ? 'bg-emerald-500' :
                        param.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (param.value / param.max) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>{param.min}</span>
                    <span>{param.max} {param.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* FAULT CODES TAB */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'faults' && (
            <div className="space-y-4">
              {/* Action buttons */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  disabled={!isConnected}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  Read Fault Codes
                </button>
                <button
                  disabled={!isConnected}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium border border-slate-700 disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  Clear Faults
                </button>
              </div>

              {/* Fault codes list */}
              {selectedSubsystem.faultCodes.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                  <p>No fault codes in this subsystem</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSubsystem.faultCodes.map((fault, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-2xl p-4 ${getSeverityBg(fault.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-mono font-bold">{fault.code}</span>
                          <span className={`ml-3 px-2 py-0.5 rounded text-xs uppercase ${
                            fault.status === 'active' ? 'bg-red-500/30 text-red-300' :
                            fault.status === 'logged' ? 'bg-amber-500/30 text-amber-300' :
                            'bg-emerald-500/30 text-emerald-300'
                          }`}>
                            {fault.status}
                          </span>
                        </div>
                        <span className={`text-xs uppercase font-semibold ${
                          fault.severity === 'critical' ? 'text-red-400' :
                          fault.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                        }`}>
                          {fault.severity}
                        </span>
                      </div>
                      <p className="font-medium mb-3">{fault.description}</p>

                      {/* Possible Causes */}
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1">Possible Causes</h4>
                        <ul className="list-disc list-inside text-sm space-y-0.5 text-slate-300">
                          {fault.causes.map((cause, i) => (
                            <li key={i}>{cause}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Repairs */}
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-slate-500 mb-1">Repair Actions</h4>
                        <ul className="list-disc list-inside text-sm space-y-0.5 text-slate-300">
                          {fault.repairs.map((repair, i) => (
                            <li key={i}>{repair}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* ACTIVE TESTS TAB */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'tests' && (
            <div className="space-y-4">
              {selectedSubsystem.activeTests.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Wrench className="w-12 h-12 mx-auto mb-3" />
                  <p>No active tests available for this subsystem</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {selectedSubsystem.activeTests.map((test) => (
                    <div
                      key={test.id}
                      className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5"
                    >
                      <h3 className="text-lg font-bold text-white mb-2">{test.name}</h3>
                      <p className="text-slate-400 text-sm mb-3">{test.description}</p>

                      {test.warning && (
                        <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-3 text-sm text-amber-400">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {test.warning}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          {test.duration}s duration
                        </span>
                        <button
                          disabled={!isConnected}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium disabled:opacity-50"
                        >
                          <Play className="w-4 h-4" />
                          Run Test
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* CALIBRATION TAB */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'calibration' && (
            <div className="space-y-4">
              {/* Info Notice */}
              <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
                <Shield className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Professional Mode - Full Access</h4>
                  <p className="text-sm text-amber-400/70">You have full access to all calibration parameters. Changes may affect engine performance. Document all changes for reference.</p>
                </div>
              </div>

              {selectedSubsystem.calibrations.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Sliders className="w-12 h-12 mx-auto mb-3" />
                  <p>No calibration parameters for this subsystem</p>
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                  <div className="divide-y divide-slate-700/50">
                    {selectedSubsystem.calibrations.map((param) => (
                      <div key={param.id} className="p-4 hover:bg-slate-800/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{param.name}</span>
                            {param.authRequired && (
                              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">Advanced</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-cyan-400">
                              {param.value}
                              <span className="text-sm font-normal text-slate-400 ml-1">{param.unit}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            value={param.value}
                            className="flex-1 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer"
                            disabled={!isConnected}
                          />
                          <span className="text-xs text-slate-500 w-32 text-right">
                            {param.min} - {param.max} {param.unit}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Default: {param.default} {param.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedSubsystem.calibrations.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    disabled={!isConnected}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5" />
                    Write to ECU
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium border border-slate-700">
                    <RotateCcw className="w-5 h-5" />
                    Reset to Defaults
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
