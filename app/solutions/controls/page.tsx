'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import UnifiedCTA from "@/components/cta/UnifiedCTA";
import CinematicHeroImage from "@/components/hero/CinematicHeroImage";

// =====================================================
// COMPREHENSIVE DEEPSEA & POWERWIZARD SOLUTIONS HUB
// The most detailed controller guide in East Africa
// =====================================================

const CONTROLLER_TABS = [
  { id: 'deepsea', label: '🟦 DeepSea Series', color: 'blue' },
  { id: 'powerwizard', label: '🟧 PowerWizard', color: 'orange' },
  { id: 'faultcodes', label: '⚠️ Fault Codes', color: 'red' },
  { id: 'configuration', label: '⚙️ Configuration', color: 'green' },
  { id: 'communication', label: '📡 Communications', color: 'purple' },
];

// DEEPSEA CONTROLLER DATABASE
const DEEPSEA_CONTROLLERS = [
  {
    model: 'DSE4510/4520',
    category: 'Basic',
    features: ['Manual/Auto start', 'Engine protection', 'LCD display', 'Configurable I/O'],
    application: 'Basic standby generators, single unit operation',
    programming: 'DSE Configuration Suite (Free)',
    specs: {
      voltage: '8-35V DC',
      operatingTemp: '-40°C to +70°C',
      display: '132 x 64 LCD',
      protection: 'Oil pressure, water temp, overspeed, underspeed',
    },
    commonIssues: [
      'Alarm: Under Speed - Check magnetic pickup gap (0.5-1mm)',
      'No start - Verify fuel solenoid output on pin 6',
      'LCD blank - Check DC supply voltage >8V',
    ],
  },
  {
    model: 'DSE6010/6020',
    category: 'Auto Mains Failure',
    features: ['AMF operation', 'Remote start/stop', 'Event logging', 'RS232/RS485'],
    application: 'Automatic standby with mains monitoring',
    programming: 'DSE Configuration Suite + SCADA Link',
    specs: {
      voltage: '8-35V DC',
      operatingTemp: '-40°C to +70°C',
      display: 'Icon-based LED',
      protection: 'Full engine + generator protection',
    },
    commonIssues: [
      'Fail to start on mains fail - Check mains sensing voltage connections',
      'Alarm: Mains High Volts - Adjust mains voltage trip levels',
      'Transfer delay too long - Reduce AMF time delay setting',
    ],
  },
  {
    model: 'DSE7310/7320',
    category: 'Auto Mains Failure',
    features: ['AMF operation', 'Full metering', 'Event logging', 'Modbus', 'USB', 'Ethernet option'],
    application: 'Advanced standby with comprehensive monitoring',
    programming: 'DSE Configuration Suite, WebNet, SCADA',
    specs: {
      voltage: '8-35V DC',
      operatingTemp: '-40°C to +85°C',
      display: '240 x 128 TFT color',
      protection: 'Full engine + generator + mains monitoring',
    },
    commonIssues: [
      'Communication timeout - Check RS485 termination resistor (120Ω)',
      'Alarm: Over Current - Verify CT ratio in configuration',
      'Incorrect kW reading - Check voltage and CT connections',
    ],
  },
  {
    model: 'DSE7410/7420',
    category: 'AMF + Load Share',
    features: ['All 7310 features', 'Sync paralleling', 'Load sharing', 'Governor/AVR control'],
    application: 'Multiple generator synchronization and load sharing',
    programming: 'DSE Configuration Suite, Load Share configuration',
    specs: {
      voltage: '8-35V DC',
      operatingTemp: '-40°C to +85°C',
      display: '240 x 128 TFT color',
      protection: 'Full protection + synchronization checks',
    },
    commonIssues: [
      'Sync fail - Check frequency matching (<0.5Hz difference)',
      'Load unbalance - Adjust droop settings on all units',
      'Reverse power alarm - Check phase sequence, CT orientation',
    ],
  },
  {
    model: 'DSE7510/7520',
    category: 'Utility Parallel',
    features: ['All 7410 features', 'Mains parallel', 'Export/import control', 'PF correction'],
    application: 'Peak shaving, grid parallel, cogeneration',
    programming: 'DSE Configuration Suite, Advanced parallel config',
    specs: {
      voltage: '8-35V DC',
      operatingTemp: '-40°C to +85°C',
      display: '240 x 128 TFT color',
      protection: 'G59/G99 compliant protection relays',
    },
    commonIssues: [
      'Export limit exceeded - Adjust import/export setpoints',
      'Vector shift trip - Check grid stability, adjust settings',
      'PF correction hunting - Tune VAr control PID parameters',
    ],
  },
  {
    model: 'DSE8610/8660',
    category: 'Multi-Set Master',
    features: ['Bus control', 'Multiple genset management', 'Priority logic', 'Sequential start'],
    application: 'Power stations, data centers, large facilities',
    programming: 'DSE Configuration Suite, Master module config',
    specs: {
      voltage: '8-35V DC',
      operatingTemp: '-40°C to +85°C',
      display: '7" TFT touchscreen (8660)',
      protection: 'System-wide protection coordination',
    },
    commonIssues: [
      'Priority override not working - Check master/slave hierarchy',
      'Sequential start fail - Verify start delays and available units',
      'Bus breaker won\'t close - Check bus voltage matching',
    ],
  },
];

// POWERWIZARD DATABASE
const POWERWIZARD_CONTROLLERS = [
  {
    model: 'PowerWizard 1.0',
    category: 'Basic',
    features: ['Digital engine protection', 'Basic metering', 'Event logging', 'RS232'],
    application: 'Basic generator protection and control',
    programming: 'ServiceRanger 4',
    specs: {
      voltage: '12-32V DC',
      operatingTemp: '-40°C to +85°C',
      display: 'LED status indicators',
    },
    parameters: ['Speed sensing', 'Oil pressure', 'Coolant temp', 'Battery voltage'],
  },
  {
    model: 'PowerWizard 1.1',
    category: 'Enhanced Basic',
    features: ['All PW1.0 features', 'Better display', 'Extended I/O', 'CAN communication'],
    application: 'Standard generator applications with remote monitoring',
    programming: 'ServiceRanger 4, IntelliSite',
    specs: {
      voltage: '12-32V DC',
      operatingTemp: '-40°C to +85°C',
      display: '4-line LCD display',
    },
    parameters: ['All PW1.0 + additional alarms', 'Fuel level', 'Service timers'],
  },
  {
    model: 'PowerWizard 2.0',
    category: 'Advanced',
    features: ['Full metering', 'Load share ready', 'Extended event logging', 'Multiple communication'],
    application: 'Advanced single unit or parallel-ready applications',
    programming: 'ServiceRanger 4, IntelliSite, Modbus',
    specs: {
      voltage: '12-32V DC',
      operatingTemp: '-40°C to +85°C',
      display: 'Large graphic LCD',
    },
    parameters: ['Complete engine + generator monitoring', 'Power metering', 'Sync check'],
  },
  {
    model: 'PowerWizard 2.1',
    category: 'Premium',
    features: ['All PW2.0 features', 'Touchscreen', 'Enhanced graphics', 'Advanced parallel'],
    application: 'Premium installations requiring advanced monitoring',
    programming: 'ServiceRanger 4, IntelliSite, Full SCADA integration',
    specs: {
      voltage: '12-32V DC',
      operatingTemp: '-40°C to +85°C',
      display: 'Color touchscreen',
    },
    parameters: ['Full system monitoring', 'Trend logging', 'Custom displays'],
  },
];

// FAULT CODES DATABASE
const FAULT_CODES = [
  {
    category: 'DeepSea Engine Faults',
    icon: '🔧',
    codes: [
      { code: '01', description: 'Emergency Stop', cause: 'E-Stop button pressed', action: 'Release E-Stop, reset alarm, check for actual emergency' },
      { code: '02', description: 'Low Oil Pressure', cause: 'Oil level low, pump failure, sensor fault', action: 'Check oil level, verify with mechanical gauge, check sensor wiring' },
      { code: '03', description: 'High Engine Temperature', cause: 'Coolant issue, thermostat, fan failure', action: 'Check coolant level, verify temp with IR gun, check fan operation' },
      { code: '04', description: 'Low Coolant Temperature', cause: 'Stuck thermostat, faulty sender', action: 'Check thermostat operation, verify sender resistance' },
      { code: '05', description: 'Under Speed', cause: 'Load issue, fuel problem, governor fault', action: 'Check fuel supply, governor actuator, reduce load if needed' },
      { code: '06', description: 'Over Speed', cause: 'Governor malfunction, speed sensor issue', action: 'Check governor, verify speed with tachometer, check sensor gap' },
      { code: '07', description: 'Low Fuel Level', cause: 'Tank empty, sender fault, wiring issue', action: 'Check fuel tank level physically, verify sender operation' },
      { code: '08', description: 'Fail to Start', cause: 'Multiple possible: fuel, batteries, starter', action: 'Follow systematic start troubleshooting procedure' },
      { code: '09', description: 'Fail to Stop', cause: 'Fuel solenoid stuck, governor issue', action: 'Check fuel solenoid, manual stop, check governor output' },
      { code: '10', description: 'Charge Fail', cause: 'Alternator failure, belt, regulator', action: 'Check belt tension, alternator output, battery connections' },
    ],
  },
  {
    category: 'DeepSea Generator Faults',
    icon: '⚡',
    codes: [
      { code: '20', description: 'Under Voltage', cause: 'AVR fault, excitation issue, load unbalance', action: 'Check AVR, verify excitation voltage, balance loads' },
      { code: '21', description: 'Over Voltage', cause: 'AVR malfunction, sensing issue', action: 'Check AVR voltage pot, verify sensing connections' },
      { code: '22', description: 'Under Frequency', cause: 'Engine speed low, governor issue', action: 'Adjust governor speed, check fuel supply' },
      { code: '23', description: 'Over Frequency', cause: 'Engine speed high, governor overshoot', action: 'Check governor stability, adjust speed setting' },
      { code: '24', description: 'Over Current', cause: 'Overload, short circuit, CT ratio wrong', action: 'Check actual load, verify CT configuration' },
      { code: '25', description: 'Earth Fault', cause: 'Insulation breakdown, earth leakage', action: 'Perform insulation test, identify earth fault location' },
      { code: '26', description: 'Reverse Power', cause: 'Phase sequence wrong, CT reversed', action: 'Check phase rotation, verify CT polarity' },
      { code: '27', description: 'kW Overload', cause: 'Excessive load demand', action: 'Reduce load, check generator rating' },
      { code: '28', description: 'Negative Phase Sequence', cause: 'Phase unbalance, missing phase', action: 'Check phase voltages, identify unbalanced loads' },
    ],
  },
  {
    category: 'DeepSea Mains Faults',
    icon: '🏠',
    codes: [
      { code: '40', description: 'Mains Under Voltage', cause: 'Grid voltage dropped', action: 'Verify grid voltage, check sensing connections' },
      { code: '41', description: 'Mains Over Voltage', cause: 'Grid voltage high', action: 'Verify grid voltage, adjust trip settings if false' },
      { code: '42', description: 'Mains Under Frequency', cause: 'Grid frequency dropped', action: 'Verify grid frequency, check for grid issues' },
      { code: '43', description: 'Mains Over Frequency', cause: 'Grid frequency high', action: 'Verify grid frequency, check settings' },
      { code: '44', description: 'Mains Phase Rotation', cause: 'Phase sequence incorrect', action: 'Check mains phase connection sequence (R-Y-B)' },
      { code: '45', description: 'Mains High Current', cause: 'Overload on mains incomer', action: 'Check mains load, verify CT ratio' },
    ],
  },
  {
    category: 'PowerWizard Common Alarms',
    icon: '🟧',
    codes: [
      { code: 'E014', description: 'High Engine Temperature', cause: 'Cooling system issue', action: 'Check coolant, thermostat, fan, water pump' },
      { code: 'E015', description: 'Low Oil Pressure', cause: 'Oil system issue', action: 'Check oil level, filter, pump, pressure sender' },
      { code: 'E016', description: 'Overspeed', cause: 'Speed control issue', action: 'Check governor, fuel system, speed sensor' },
      { code: 'E023', description: 'Fail to Start', cause: 'Start system failure', action: 'Check batteries, starter, fuel, control settings' },
      { code: 'E025', description: 'Fail to Crank', cause: 'Cranking system issue', action: 'Check batteries, starter motor, wiring' },
      { code: 'E031', description: 'High Battery Voltage', cause: 'Charger issue, battery', action: 'Check battery charger output, battery condition' },
      { code: 'E032', description: 'Low Battery Voltage', cause: 'Battery discharge, charger fail', action: 'Check charger, battery, connections' },
      { code: 'E061', description: 'High AC Voltage', cause: 'AVR or sensing issue', action: 'Check AVR settings, voltage sensing' },
      { code: 'E062', description: 'Low AC Voltage', cause: 'AVR or excitation issue', action: 'Check AVR, excitation, load' },
      { code: 'E195', description: 'Overcrank', cause: 'Engine won\'t start after attempts', action: 'Check fuel, air, compression, glow plugs' },
    ],
  },
];

// CONFIGURATION PROCEDURES
const CONFIGURATION_PROCEDURES = [
  {
    title: 'DeepSea Initial Configuration',
    controller: 'DSE73xx/74xx Series',
    steps: [
      { step: 'Connect to controller using USB or RS232 cable', note: 'USB drivers may be required for first connection' },
      { step: 'Launch DSE Configuration Suite software', note: 'Available free from DSE website' },
      { step: 'Click "Read" to download current configuration', note: 'Always backup before changes' },
      { step: 'Configure Engine Settings: Speed sensing, protection levels', note: 'Match to engine OEM specs' },
      { step: 'Configure Generator Settings: Voltage, CT ratio, PT ratio', note: 'Verify with actual measurements' },
      { step: 'Configure Mains Settings: Voltage, frequency, delays', note: 'Match to local grid standards' },
      { step: 'Configure Communication: Modbus address, baud rate', note: 'Document settings for SCADA' },
      { step: 'Write configuration to controller', note: 'Verify by reading back' },
      { step: 'Test all protection functions before commissioning', note: 'Use simulation mode if available' },
    ],
    parameters: [
      { param: 'Speed Sensor Teeth', typical: '113-160', description: 'Match to flywheel ring gear' },
      { param: 'Oil Pressure Warning', typical: '100 kPa', description: 'Adjust based on engine specs' },
      { param: 'Oil Pressure Trip', typical: '70 kPa', description: 'Critical protection level' },
      { param: 'Water Temp Warning', typical: '95°C', description: 'Before shutdown' },
      { param: 'Water Temp Trip', typical: '105°C', description: 'Engine protection' },
      { param: 'CT Primary', typical: 'Match CT rating', description: 'e.g., 200/5A = 200' },
      { param: 'Nominal Voltage', typical: '400V', description: 'Line-to-line voltage' },
    ],
  },
  {
    title: 'PowerWizard Configuration',
    controller: 'PowerWizard 1.x/2.x',
    steps: [
      { step: 'Connect using Cat ET tool or ServiceRanger software', note: 'Requires compatible adapter' },
      { step: 'Login with appropriate service level password', note: 'Level 2 or 3 for parameter changes' },
      { step: 'Navigate to Configuration > Engine Parameters', note: 'Set speed, pressure, temp limits' },
      { step: 'Navigate to Configuration > Generator Parameters', note: 'Set voltage, current, frequency' },
      { step: 'Navigate to Configuration > Control Parameters', note: 'Set start/stop sequences' },
      { step: 'Navigate to Configuration > Communication', note: 'Set Modbus, CAN parameters' },
      { step: 'Download parameters to controller', note: 'May require engine stop' },
      { step: 'Perform functional tests of all protections', note: 'Document test results' },
    ],
    parameters: [
      { param: 'Speed Rating', typical: '1500 RPM', description: 'Match to generator spec' },
      { param: 'Overspeed Setpoint', typical: '110%', description: 'Typically 1650 RPM for 50Hz' },
      { param: 'Underspeed Setpoint', typical: '90%', description: 'Typically 1350 RPM' },
      { param: 'Rated Voltage', typical: '400V', description: 'Match to generator rating' },
      { param: 'Rated Current', typical: 'Match kVA/V', description: 'Full load amps' },
    ],
  },
  {
    title: 'ATS Configuration',
    controller: 'DSE334/335 ATS Controller',
    steps: [
      { step: 'Configure mains voltage sensing ranges', note: 'Typically ±10% of nominal' },
      { step: 'Set mains failure detection delay', note: '5-10 seconds typical' },
      { step: 'Configure generator start signal output', note: 'Relay or voltage output' },
      { step: 'Set transfer delay (mains fail to gen)', note: 'Match to gen start time + 10s' },
      { step: 'Configure retransfer conditions', note: 'Mains return voltage and time' },
      { step: 'Set cool-down timer', note: '3-5 minutes typical' },
      { step: 'Configure bypass operation', note: 'Manual override requirements' },
      { step: 'Test complete transfer sequence', note: 'Simulate mains failure' },
    ],
    parameters: [
      { param: 'Mains Low Voltage Trip', typical: '340V', description: '85% of nominal' },
      { param: 'Mains High Voltage Trip', typical: '460V', description: '115% of nominal' },
      { param: 'Mains Fail Delay', typical: '5s', description: 'Prevent nuisance transfers' },
      { param: 'Retransfer Delay', typical: '30min', description: 'Ensure mains stability' },
      { param: 'Cool Down Time', typical: '300s', description: '5 minutes unloaded run' },
    ],
  },
];

// COMMUNICATION SETUP GUIDES
const COMMUNICATION_GUIDES = [
  {
    title: 'Modbus RTU/RS485 Setup',
    icon: '🔌',
    steps: [
      'Configure controller Modbus address (unique per device, 1-247)',
      'Set baud rate: 9600 or 19200 most common',
      'Set data format: 8N1 (8 data bits, no parity, 1 stop bit)',
      'Connect RS485 A+ to master A+, B- to B-',
      'Install 120Ω termination resistor at both ends of bus',
      'Maximum bus length: 1200m at 9600 baud',
      'Maximum devices: 32 without repeaters',
    ],
    troubleshooting: [
      'No communication: Check A/B wiring polarity (try swapping)',
      'Intermittent: Check termination resistors, reduce baud rate',
      'Wrong data: Verify slave address, register mapping',
    ],
    registerMap: [
      { register: '0x0000', description: 'Generator L1-N Voltage', scale: '0.1V' },
      { register: '0x0003', description: 'Generator Frequency', scale: '0.1Hz' },
      { register: '0x0006', description: 'Engine Speed', scale: 'RPM' },
      { register: '0x000B', description: 'Oil Pressure', scale: 'kPa' },
      { register: '0x000C', description: 'Coolant Temperature', scale: '°C' },
      { register: '0x0016', description: 'Total kWh', scale: 'kWh' },
    ],
  },
  {
    title: 'Ethernet/Modbus TCP Setup',
    icon: '🌐',
    steps: [
      'Configure static IP address on controller (avoid DHCP)',
      'Set subnet mask (typically 255.255.255.0)',
      'Set gateway if required for remote access',
      'Default Modbus TCP port: 502',
      'Ensure network switch supports required traffic',
      'Consider managed switch for priority traffic',
      'Implement firewall rules for security',
    ],
    troubleshooting: [
      'Can\'t ping controller: Check cable, IP config, subnet',
      'Connection drops: Check timeout settings, network stability',
      'Multiple masters: Ensure only one active connection or use separate ports',
    ],
    networkDesign: [
      'Use dedicated VLAN for generator controls',
      'Implement redundant network paths for critical sites',
      'Consider industrial-grade switches for harsh environments',
    ],
  },
  {
    title: 'GSM/4G Remote Monitoring',
    icon: '📱',
    steps: [
      'Install GSM modem with data-enabled SIM card',
      'Configure APN settings per carrier',
      'Set up DSE WebNet or equivalent cloud platform',
      'Configure data push intervals (1-15 minutes typical)',
      'Set up SMS/email alert recipients',
      'Configure alarm priority and routing',
      'Test remote access and alarm notification',
    ],
    troubleshooting: [
      'No signal: Check antenna, SIM status, APN settings',
      'Data not updating: Verify push interval, check cloud service',
      'Missing alarms: Check alarm routing configuration',
    ],
    security: [
      'Use VPN for remote parameter changes',
      'Implement two-factor authentication where possible',
      'Regular password changes',
      'Audit log review',
    ],
  },
];

export default function ControlsSolutionHub() {
  const [activeTab, setActiveTab] = useState('deepsea');
  const [expandedController, setExpandedController] = useState<string | null>(null);
  const [expandedFaultCategory, setExpandedFaultCategory] = useState<string | null>('DeepSea Engine Faults');
  const [expandedConfig, setExpandedConfig] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="bg-black min-h-screen">
      {/* Cinematic Hero Section with Hollywood Color Grading */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {/* Background Image with Cinematic Scale */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <Image
            src="/images/68.png"
            alt="Generator Control Systems"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          {/* Hollywood Cinematic Color Grading Overlays */}
          {/* Teal/Green Color Grade - Technology & Control Theme */}
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(0, 60, 80, 0.3) 0%, rgba(0, 180, 120, 0.15) 100%)' }} />

          {/* Deep Contrast Enhancement */}
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)' }} />

          {/* Blue Shadow Tint - Cinematic Shadows */}
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(to bottom, rgba(5, 20, 40, 0.5) 0%, rgba(10, 25, 20, 0.4) 100%)' }} />

          {/* Cool Cyan Highlight Push - Tech Feel */}
          <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(0, 200, 180, 0.25) 0%, transparent 60%)' }} />

          {/* Film Grain Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette Effect */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Cinematic Letterbox Gradient - Top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />

          {/* Cinematic Letterbox Gradient - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        {/* Animated Tech Pulse */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.12, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
          style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(0, 200, 150, 0.15) 50%, transparent 60%)' }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
          style={{ opacity: heroOpacity, y: textY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-5xl"
          >
            {/* Cinematic Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">Controller Experts</span>
            </motion.div>

            {/* Main Title with Cinematic Typography */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                DeepSea & PowerWizard
              </span>
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Solutions Hub
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed"
            >
              The most comprehensive generator controller programming, configuration, and troubleshooting guide in East Africa.
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
            />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
              <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cinematic Anamorphic Lens Flare */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent blur-sm" />
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {CONTROLLER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {/* DEEPSEA SECTION */}
          {activeTab === 'deepsea' && (
            <motion.div
              key="deepsea"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">DeepSea Controller Range</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Complete guide to all DeepSea (DSE) controller models, from basic to advanced multi-set applications. 
                  Click each model for detailed specifications, common issues, and programming information.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {DEEPSEA_CONTROLLERS.map((controller, idx) => (
                  <motion.div
                    key={controller.model}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-2xl border border-blue-500/30 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedController(expandedController === controller.model ? null : controller.model)}
                      className="w-full text-left p-6 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                            {controller.category}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-2">{controller.model}</h3>
                          <p className="text-gray-400 text-sm mt-1">{controller.application}</p>
                        </div>
                        <motion.span
                          animate={{ rotate: expandedController === controller.model ? 180 : 0 }}
                          className="text-gray-400 text-xl"
                        >
                          ▼
                        </motion.span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedController === controller.model && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-blue-500/20"
                        >
                          <div className="p-6 space-y-4">
                            {/* Features */}
                            <div>
                              <h4 className="text-blue-400 font-medium mb-2">Features:</h4>
                              <div className="flex flex-wrap gap-2">
                                {controller.features.map((feature, fidx) => (
                                  <span key={fidx} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Specifications */}
                            <div>
                              <h4 className="text-blue-400 font-medium mb-2">Specifications:</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-400">Supply Voltage:</div>
                                <div className="text-white">{controller.specs.voltage}</div>
                                <div className="text-gray-400">Operating Temp:</div>
                                <div className="text-white">{controller.specs.operatingTemp}</div>
                                <div className="text-gray-400">Display:</div>
                                <div className="text-white">{controller.specs.display}</div>
                              </div>
                            </div>

                            {/* Programming */}
                            <div>
                              <h4 className="text-blue-400 font-medium mb-2">Programming Software:</h4>
                              <p className="text-gray-300 text-sm">{controller.programming}</p>
                            </div>

                            {/* Common Issues */}
                            <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                              <h4 className="text-red-400 font-medium mb-2">⚠️ Common Issues:</h4>
                              <div className="space-y-2">
                                {controller.commonIssues.map((issue, iidx) => (
                                  <p key={iidx} className="text-gray-300 text-sm">• {issue}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* POWERWIZARD SECTION */}
          {activeTab === 'powerwizard' && (
            <motion.div
              key="powerwizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">PowerWizard Controller Range</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Complete guide to Caterpillar/FG Wilson PowerWizard controllers. From basic protection to premium 
                  touchscreen models with advanced parallel capabilities.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {POWERWIZARD_CONTROLLERS.map((controller, idx) => (
                  <motion.div
                    key={controller.model}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-orange-900/30 to-gray-900 rounded-2xl border border-orange-500/30 overflow-hidden"
                  >
                    <div className="p-6">
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                        {controller.category}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2">{controller.model}</h3>
                      <p className="text-gray-400 text-sm mt-1">{controller.application}</p>

                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="text-orange-400 font-medium mb-2">Features:</h4>
                          <div className="flex flex-wrap gap-2">
                            {controller.features.map((feature, fidx) => (
                              <span key={fidx} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-400">Supply:</div>
                          <div className="text-white">{controller.specs.voltage}</div>
                          <div className="text-gray-400">Display:</div>
                          <div className="text-white">{controller.specs.display}</div>
                          <div className="text-gray-400">Software:</div>
                          <div className="text-white">{controller.programming}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ServiceRanger Info */}
              <div className="mt-12 bg-gradient-to-r from-orange-900/30 to-yellow-900/30 rounded-2xl p-8 border border-orange-500/30">
                <h3 className="text-2xl font-bold text-orange-400 mb-6">🛠️ ServiceRanger 4 Software</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-bold mb-3">Key Functions:</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Read and clear diagnostic trouble codes (DTCs)</li>
                      <li>• View real-time engine and generator parameters</li>
                      <li>• Configure protection settings and setpoints</li>
                      <li>• Download firmware updates</li>
                      <li>• Generate diagnostic reports</li>
                      <li>• Calibrate sensors and adjust parameters</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-3">Connection Requirements:</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Cat Communications Adapter 3 (CA3)</li>
                      <li>• USB to Cat cable adapter</li>
                      <li>• Valid ServiceRanger license</li>
                      <li>• Windows 10/11 compatible PC</li>
                      <li>• Access level password for parameter changes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FAULT CODES SECTION */}
          {activeTab === 'faultcodes' && (
            <motion.div
              key="faultcodes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Complete Fault Code Reference</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Comprehensive database of all DeepSea and PowerWizard fault codes with causes and solutions. 
                  The most complete reference available in the region.
                </p>
              </div>

              {FAULT_CODES.map((category) => (
                <div key={category.category} className="space-y-4">
                  <button
                    onClick={() => setExpandedFaultCategory(expandedFaultCategory === category.category ? null : category.category)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-900/30 to-gray-900 rounded-xl border border-red-500/30 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="text-xl font-bold text-white">{category.category}</h3>
                      <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                        {category.codes.length} codes
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedFaultCategory === category.category ? 180 : 0 }}
                      className="text-gray-400"
                    >
                      ▼
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {expandedFaultCategory === category.category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-white/10">
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Code</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Description</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Possible Cause</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {category.codes.map((fault) => (
                                  <tr key={fault.code} className="hover:bg-white/5">
                                    <td className="px-4 py-3">
                                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded font-mono text-sm font-bold">
                                        {fault.code}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-white text-sm font-medium">{fault.description}</td>
                                    <td className="px-4 py-3 text-gray-400 text-sm">{fault.cause}</td>
                                    <td className="px-4 py-3 text-green-400 text-sm">{fault.action}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {/* CONFIGURATION SECTION */}
          {activeTab === 'configuration' && (
            <motion.div
              key="configuration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Configuration Procedures</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Step-by-step configuration guides for DeepSea, PowerWizard, and ATS controllers. 
                  Includes parameter recommendations based on years of field experience.
                </p>
              </div>

              {CONFIGURATION_PROCEDURES.map((config, idx) => (
                <motion.div
                  key={config.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-green-900/30 to-gray-900 rounded-2xl border border-green-500/30 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedConfig(expandedConfig === config.title ? null : config.title)}
                    className="w-full text-left p-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                          {config.controller}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-2">{config.title}</h3>
                      </div>
                      <motion.span
                        animate={{ rotate: expandedConfig === config.title ? 180 : 0 }}
                        className="text-gray-400 text-xl"
                      >
                        ▼
                      </motion.span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedConfig === config.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-green-500/20"
                      >
                        <div className="p-6 space-y-6">
                          {/* Configuration Steps */}
                          <div>
                            <h4 className="text-green-400 font-bold mb-4">Configuration Steps:</h4>
                            <div className="space-y-3">
                              {config.steps.map((step, sidx) => (
                                <div key={sidx} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-black flex items-center justify-center text-xs font-bold">
                                    {sidx + 1}
                                  </span>
                                  <div>
                                    <p className="text-white text-sm">{step.step}</p>
                                    <p className="text-gray-500 text-xs mt-1">💡 {step.note}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Parameter Reference */}
                          <div>
                            <h4 className="text-green-400 font-bold mb-4">Typical Parameter Values:</h4>
                            <div className="bg-black/30 rounded-lg overflow-hidden">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-white/10">
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Parameter</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Typical Value</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Notes</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {config.parameters.map((param, pidx) => (
                                    <tr key={pidx}>
                                      <td className="px-4 py-2 text-white text-sm">{param.param}</td>
                                      <td className="px-4 py-2 text-green-400 text-sm font-mono">{param.typical}</td>
                                      <td className="px-4 py-2 text-gray-400 text-sm">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* COMMUNICATION SECTION */}
          {activeTab === 'communication' && (
            <motion.div
              key="communication"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Communication &amp; Networking</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Complete guides for setting up Modbus RTU, Modbus TCP, GSM remote monitoring, and SCADA integration.
                </p>
              </div>

              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                {COMMUNICATION_GUIDES.map((guide, idx) => (
                  <motion.div
                    key={guide.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-purple-900/30 to-gray-900 rounded-2xl border border-purple-500/30 p-6"
                  >
                    <span className="text-4xl block mb-4">{guide.icon}</span>
                    <h3 className="text-xl font-bold text-white mb-4">{guide.title}</h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-purple-400 font-medium text-sm mb-2">Setup Steps:</h4>
                        <ol className="space-y-1">
                          {guide.steps.map((step, sidx) => (
                            <li key={sidx} className="text-gray-300 text-xs flex items-start gap-2">
                              <span className="text-purple-400">{sidx + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                        <h4 className="text-red-400 font-medium text-sm mb-2">Troubleshooting:</h4>
                        {guide.troubleshooting.map((tip, tidx) => (
                          <p key={tidx} className="text-gray-300 text-xs">• {tip}</p>
                        ))}
                      </div>

                      {guide.registerMap && (
                        <div className="bg-black/30 rounded-lg p-3">
                          <h4 className="text-purple-400 font-medium text-sm mb-2">Common Registers:</h4>
                          <div className="space-y-1">
                            {guide.registerMap.map((reg, ridx) => (
                              <div key={ridx} className="flex justify-between text-xs">
                                <span className="text-gray-500 font-mono">{reg.register}</span>
                                <span className="text-gray-300">{reg.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-8 md:p-12 border border-purple-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Controller Programming Support?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Our certified technicians have programmed thousands of DeepSea and PowerWizard controllers. 
            From basic commissioning to complex parallel systems, we have the expertise you need.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Configuration Service" />
          </div>
        </div>
      </section>
    </main>
  );
}
