'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const TABS = [
  { id: 'overview', label: 'Overview', color: 'cyan' },
  { id: 'types', label: 'UPS Types', color: 'blue' },
  { id: 'components', label: 'Components', color: 'slate' },
  { id: 'sizing', label: 'Sizing Guide', color: 'purple' },
  { id: 'batteries', label: 'Batteries', color: 'green' },
  { id: 'installation', label: 'Installation', color: 'amber' },
  { id: 'maintenance', label: 'Maintenance', color: 'teal' },
  { id: 'faults', label: 'Troubleshooting', color: 'red' },
  { id: 'pricing', label: 'Pricing', color: 'emerald' },
  { id: 'shipping', label: 'Send Your UPS', color: 'orange' },
  { id: 'warranty', label: 'Warranty', color: 'indigo' },
];

// Comprehensive UPS Overview - 10 Detailed Paragraphs
const UPS_OVERVIEW = [
  {
    title: "Understanding Uninterruptible Power Supply Systems",
    content: `An Uninterruptible Power Supply (UPS) is a critical electrical device that provides emergency power when the main power source fails. Unlike generators that take seconds to start, a UPS switches to battery power in milliseconds, preventing any interruption to connected equipment. In Kenya and East Africa, where power outages, voltage fluctuations, and power quality issues are common, UPS systems are essential for protecting sensitive electronic equipment in data centers, hospitals, banks, offices, and industrial facilities. The UPS not only provides backup power during outages but also conditions incoming power to protect equipment from surges, sags, spikes, and harmonic distortion. Understanding the different types of UPS systems, proper sizing, and maintenance is essential for ensuring reliable power protection.`
  },
  {
    title: "How UPS Systems Work",
    content: `A UPS system converts AC power to DC to charge batteries, then inverts DC back to AC to power loads. During normal operation, the UPS conditions incoming power while keeping batteries charged. When utility power fails, the UPS seamlessly transfers to battery power without interruption. The key components include a rectifier/charger that converts AC to DC and charges batteries, batteries that store energy for backup, an inverter that converts DC back to clean AC power, and a static bypass switch that can transfer load directly to utility power if the UPS fails. The transfer time between power sources is the critical specification - online UPS systems have zero transfer time, while offline systems may have 2-10ms transfer time which is still acceptable for most computer equipment.`
  },
  {
    title: "Online vs. Offline vs. Line-Interactive UPS",
    content: `The three main UPS topologies offer different levels of protection and efficiency. Offline (Standby) UPS is the simplest and most economical - it passes utility power directly to the load and switches to battery only when power fails. Line-Interactive UPS adds an autotransformer to regulate voltage during sags and swells without using battery, extending battery life. Online (Double-Conversion) UPS continuously converts power through the rectifier and inverter, providing the highest level of protection with zero transfer time and complete isolation from utility problems. For critical applications like data centers, medical equipment, and telecommunications, online UPS is the standard choice. For office computers and home use, line-interactive provides good protection at lower cost.`
  },
  {
    title: "The Critical Role of Batteries in UPS Performance",
    content: `Batteries are the heart of any UPS system and typically the first component to fail. Most UPS systems use Valve-Regulated Lead-Acid (VRLA) batteries, either Absorbed Glass Mat (AGM) or Gel types, which are sealed and maintenance-free. Battery runtime depends on the load connected and battery capacity (measured in Amp-hours). At full load, small UPS systems may provide 5-10 minutes of runtime, while larger systems with extended battery banks can run for hours. Battery life is significantly affected by temperature - every 10°C above 25°C cuts battery life in half. Regular battery testing is essential as batteries degrade over time even if rarely used. Most VRLA batteries last 3-5 years under optimal conditions, though this varies greatly based on number of discharge cycles, depth of discharge, and environmental conditions.`
  },
  {
    title: "UPS Sizing: Getting It Right",
    content: `Proper UPS sizing is critical - an undersized UPS will fail under load, while an oversized UPS wastes money and may operate inefficiently. The first step is calculating total load in Watts or VA (Volt-Amps). Watts represent real power doing actual work, while VA represents apparent power including reactive power. The ratio is called power factor, typically 0.8-0.9 for computer loads. UPS capacity is rated in VA, so if your load is 1000W at 0.8 power factor, you need 1250VA minimum. Always add 20-25% margin for future growth and to avoid running the UPS at maximum capacity. For runtime requirements beyond the standard battery, calculate the Watt-hours needed and specify additional battery modules accordingly.`
  },
  {
    title: "Power Quality Issues UPS Systems Address",
    content: `Beyond backup power, UPS systems protect against numerous power quality problems that can damage sensitive electronics or cause data corruption. Power outages (blackouts) are the obvious threat, but sags (voltage dips) and surges (voltage spikes) are more common and equally damaging. Electrical noise from motors, welders, or radio interference can corrupt data. Frequency variations from unstable generators affect motor speeds and timing circuits. Harmonic distortion from non-linear loads causes heating and malfunction in sensitive equipment. Online UPS systems address all these issues by regenerating clean, regulated power regardless of input quality. Line-interactive systems handle most issues except severe distortion. Proper grounding and surge protection complete the power quality solution.`
  },
  {
    title: "UPS Installation Best Practices",
    content: `Professional UPS installation ensures reliable operation and safety. The UPS must be installed in a clean, dry, well-ventilated area with ambient temperature ideally between 20-25°C. Adequate clearance around the unit allows heat dissipation and service access. Input wiring must be sized for full UPS current plus battery charging load. A dedicated circuit with appropriate overcurrent protection is essential. The UPS should be connected to a proper earth ground for safety and noise filtering. For larger systems, a maintenance bypass switch allows the UPS to be isolated for service without powering down the load. Critical loads should have their neutral-ground bond at the UPS output only to prevent ground loops. All installation must comply with local electrical codes and manufacturer requirements.`
  },
  {
    title: "Preventive Maintenance for Maximum Reliability",
    content: `Regular maintenance extends UPS and battery life while ensuring reliability when you need it most. Monthly checks should include verifying UPS status indicators, checking for alarms, and ensuring the area is clean and ventilated. Quarterly maintenance should include battery voltage checks, visual inspection for swelling or leakage, and cleaning of air filters. Annually, a comprehensive service should include battery load testing, thermal scanning for hot connections, firmware updates, and filter replacement. Every 3-5 years, batteries typically need replacement even if testing shows acceptable voltage - internal resistance increases with age, reducing capacity. Maintaining a maintenance log helps track trends and predict failures before they occur.`
  },
  {
    title: "Common UPS Problems and Solutions",
    content: `Understanding common failure modes helps in troubleshooting and prevention. Frequent alarms or transfers often indicate input power problems - check utility voltage quality and generator compatibility. Shortened runtime suggests battery aging - test battery capacity and replace if below 80%. UPS running on bypass may indicate overload, fan failure, or internal fault. Overheating typically results from blocked ventilation or failed cooling fans. Harmonic distortion on output can indicate capacitor aging in the inverter section. For modular UPS systems, module failures should be investigated promptly as remaining modules carry increased load. Many modern UPS systems have remote monitoring capability that alerts you to problems before they cause downtime.`
  },
  {
    title: "Our Comprehensive UPS Services",
    content: `At Emerson Industrial Maintenance Services, we provide complete UPS solutions from specification to long-term maintenance. Our team includes power systems engineers who can analyze your requirements and specify the optimal UPS solution, considering factors like load characteristics, runtime requirements, growth projections, and available space. We represent leading UPS manufacturers including APC (Schneider Electric), Eaton, Vertiv (Emerson), Riello, and others. Our workshop can repair UPS systems of all brands and sizes, from small 1kVA office units to large 3-phase data center systems. We stock batteries for common UPS models and can supply batteries for any system. We offer maintenance contracts that include regular inspections, battery testing, and emergency response. Whether you need a new UPS installation, battery replacement, repairs, or preventive maintenance, we deliver reliable power protection solutions.`
  }
];

// UPS Types
const UPS_TYPES = [
  {
    type: 'Offline (Standby) UPS',
    topology: 'Standby',
    efficiency: '95-98%',
    transferTime: '2-10 ms',
    powerRange: '300VA - 3kVA',
    waveform: 'Simulated Sine / Square',
    protection: 'Basic surge protection, Battery backup',
    applications: ['Home computers', 'Small office equipment', 'POS terminals', 'Routers/modems'],
    advantages: ['Low cost', 'High efficiency', 'Simple design', 'Compact size'],
    disadvantages: ['Transfer time gap', 'No voltage regulation', 'Square wave output (cheap models)', 'Not for sensitive equipment'],
    brands: ['APC Back-UPS', 'CyberPower', 'Tripp Lite'],
    priceRange: 'KES 8,000 - 35,000'
  },
  {
    type: 'Line-Interactive UPS',
    topology: 'Line-Interactive',
    efficiency: '94-97%',
    transferTime: '2-4 ms',
    powerRange: '500VA - 10kVA',
    waveform: 'Pure Sine Wave',
    protection: 'AVR voltage regulation, Surge protection, Battery backup',
    applications: ['Office servers', 'Network equipment', 'Workstations', 'Medical devices', 'Industrial controls'],
    advantages: ['Voltage regulation without battery', 'Pure sine wave output', 'Good efficiency', 'Extended battery life'],
    disadvantages: ['Short transfer time', 'Limited frequency regulation', 'Not for severe power problems'],
    brands: ['APC Smart-UPS', 'Eaton 5P/5PX', 'Vertiv GXT5'],
    priceRange: 'KES 25,000 - 400,000'
  },
  {
    type: 'Online Double-Conversion UPS',
    topology: 'Online',
    efficiency: '90-96%',
    transferTime: '0 ms (Zero)',
    powerRange: '1kVA - 10MVA',
    waveform: 'Pure Sine Wave (regulated)',
    protection: 'Complete isolation, Zero transfer time, Frequency conversion, Full conditioning',
    applications: ['Data centers', 'Hospitals', 'Telecom', 'Banks', 'Broadcasting', 'Manufacturing'],
    advantages: ['Zero transfer time', 'Complete power conditioning', 'Frequency regulation', 'Generator compatible', 'Highest protection'],
    disadvantages: ['Higher cost', 'Lower efficiency', 'More heat generation', 'Complex maintenance'],
    brands: ['APC Galaxy', 'Eaton 93PM/93PR', 'Vertiv Liebert', 'Riello', 'Huawei'],
    priceRange: 'KES 80,000 - 50,000,000+'
  },
  {
    type: 'Modular UPS',
    topology: 'Online Modular',
    efficiency: '94-97%',
    transferTime: '0 ms',
    powerRange: '10kVA - 3MVA',
    waveform: 'Pure Sine Wave',
    protection: 'N+1 redundancy, Hot-swappable modules, Scalable capacity',
    applications: ['Data centers', 'Large enterprises', 'Critical infrastructure', 'Cloud facilities'],
    advantages: ['Scalable capacity', 'N+1 redundancy', 'Hot-swap modules', 'Pay as you grow', 'High availability'],
    disadvantages: ['High initial cost', 'Complex architecture', 'Specialized maintenance'],
    brands: ['APC Symmetra', 'Eaton 93PM', 'Vertiv APM', 'ABB Conceptpower DPA'],
    priceRange: 'KES 2,000,000 - 100,000,000+'
  }
];

// UPS Components
const UPS_COMPONENTS = [
  {
    name: 'Rectifier/Charger',
    description: 'Converts incoming AC power to DC to charge batteries and power the inverter section.',
    function: 'AC to DC conversion, Battery charging, Power factor correction',
    diagram: `
┌─────────────────────────────┐
│     RECTIFIER SECTION       │
├─────────────────────────────┤
│  AC INPUT   → EMI Filter    │
│     ↓                       │
│  ┌────────────────────┐     │
│  │ BRIDGE RECTIFIER   │     │
│  │  AC→DC             │     │
│  │  ↙ ↓ ↓ ↘           │     │
│  │ D1 D2 D3 D4        │     │
│  └────────────────────┘     │
│     ↓                       │
│  FILTER CAPACITORS          │
│  ═════════════════          │
│     ↓                       │
│  DC BUS → To Inverter       │
│         → To Battery        │
└─────────────────────────────┘
    `,
    failureSigns: ['Battery not charging', 'Input current high', 'UPS in bypass mode']
  },
  {
    name: 'Battery Bank',
    description: 'Stores energy to provide backup power during utility outages. Typically VRLA (AGM or Gel) batteries.',
    function: 'Energy storage, Backup power source',
    diagram: `
┌─────────────────────────────┐
│      BATTERY BANK           │
├─────────────────────────────┤
│                             │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ BAT │ │ BAT │ │ BAT │   │
│  │  1  │ │  2  │ │  3  │   │
│  │+   -│ │+   -│ │+   -│   │
│  └──┬──┘ └──┬──┘ └──┬──┘   │
│     │   Series │     │      │
│     └───────┴───────┘       │
│           ↓                 │
│      DC BUS CONNECTION      │
│                             │
│  12V batteries × N          │
│  = 36V / 48V / 192V / 384V  │
└─────────────────────────────┘
    `,
    failureSigns: ['Short runtime', 'Swollen cases', 'White corrosion', 'Failed battery test']
  },
  {
    name: 'Inverter',
    description: 'Converts DC power from batteries or rectifier back to AC power for connected loads.',
    function: 'DC to AC conversion, Voltage regulation, Frequency control',
    diagram: `
┌─────────────────────────────┐
│       INVERTER SECTION      │
├─────────────────────────────┤
│                             │
│   DC BUS INPUT              │
│      ↓                      │
│  ┌────────────────────┐     │
│  │   IGBT BRIDGE      │     │
│  │  ┌────┐  ┌────┐    │     │
│  │  │ Q1 │  │ Q2 │    │     │
│  │  └────┘  └────┘    │     │
│  │  ┌────┐  ┌────┐    │     │
│  │  │ Q3 │  │ Q4 │    │     │
│  │  └────┘  └────┘    │     │
│  └────────────────────┘     │
│      ↓                      │
│   LC OUTPUT FILTER          │
│   ═══════════════           │
│      ↓                      │
│   AC OUTPUT (Pure Sine)     │
└─────────────────────────────┘
    `,
    failureSigns: ['No output voltage', 'Distorted waveform', 'Overload alarms']
  },
  {
    name: 'Static Bypass Switch',
    description: 'Semiconductor switch that can instantly transfer load between inverter and bypass (direct utility) path.',
    function: 'Fast load transfer, Overload protection, Maintenance bypass',
    diagram: `
┌─────────────────────────────┐
│    STATIC BYPASS SWITCH     │
├─────────────────────────────┤
│                             │
│   UTILITY INPUT             │
│       │                     │
│       ├─────────────────┐   │
│       │                 │   │
│       ↓                 ↓   │
│  ┌─────────┐      ┌─────────┐
│  │ INVERTER│      │ BYPASS  │
│  │  PATH   │      │  PATH   │
│  └────┬────┘      └────┬────┘
│       │    SCR         │    │
│       │   SWITCH       │    │
│       │  ←══════→      │    │
│       │                │    │
│       └────────┬───────┘    │
│                │            │
│           OUTPUT TO LOAD    │
└─────────────────────────────┘
    `,
    failureSigns: ['Failed to transfer', 'Stuck in bypass', 'Transfer time slow']
  },
  {
    name: 'Control Board / DSP',
    description: 'Digital Signal Processor or microcontroller that monitors all parameters and controls UPS operation.',
    function: 'System monitoring, Control algorithms, Communication, Alarms',
    diagram: `
┌─────────────────────────────┐
│      CONTROL SYSTEM         │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐    │
│  │   DSP / CONTROLLER  │    │
│  │  ┌───────────────┐  │    │
│  │  │ Monitoring    │  │    │
│  │  │ • Voltage     │  │    │
│  │  │ • Current     │  │    │
│  │  │ • Frequency   │  │    │
│  │  │ • Temperature │  │    │
│  │  │ • Battery     │  │    │
│  │  └───────────────┘  │    │
│  └─────────────────────┘    │
│           ↓                 │
│  ┌────────┼────────┐        │
│  ↓        ↓        ↓        │
│ LCD    NETWORK   RELAY      │
│DISPLAY  CARD    OUTPUTS     │
└─────────────────────────────┘
    `,
    failureSigns: ['No display', 'Communication failures', 'False alarms']
  },
  {
    name: 'Cooling System',
    description: 'Fans and heat sinks to dissipate heat from power electronics.',
    function: 'Temperature control, Component cooling, Air circulation',
    diagram: `
┌─────────────────────────────┐
│      COOLING SYSTEM         │
├─────────────────────────────┤
│                             │
│   AIR INTAKE (filtered)     │
│       ↓ ↓ ↓ ↓ ↓ ↓           │
│  ┌─────────────────────┐    │
│  │      FAN TRAY       │    │
│  │  ╔═══╗ ╔═══╗ ╔═══╗  │    │
│  │  ║ O ║ ║ O ║ ║ O ║  │    │
│  │  ╚═══╝ ╚═══╝ ╚═══╝  │    │
│  └─────────────────────┘    │
│       ↓ ↓ ↓ ↓ ↓ ↓           │
│   HEATSINK / COMPONENTS     │
│   ═══════════════════       │
│       ↓ ↓ ↓ ↓ ↓ ↓           │
│   HOT AIR EXHAUST           │
│                             │
│   Temp sensors throughout   │
└─────────────────────────────┘
    `,
    failureSigns: ['High temperature alarms', 'Fan noise/failure', 'Overheating shutdowns']
  }
];

// Sizing Guide
const UPS_SIZING = {
  steps: [
    { step: 1, title: 'List All Equipment', description: 'Identify every device to be protected with its power rating (Watts or VA)' },
    { step: 2, title: 'Calculate Total Load', description: 'Add up all loads. Use VA if available, or Watts × 1.25 to estimate VA' },
    { step: 3, title: 'Add Growth Margin', description: 'Add 20-25% for future equipment and to avoid running at maximum capacity' },
    { step: 4, title: 'Determine Runtime', description: 'Decide how long you need UPS to run: bridge to generator, safe shutdown, or extended operation' },
    { step: 5, title: 'Select UPS Rating', description: 'Choose UPS with capacity exceeding your calculation from manufacturer range' },
    { step: 6, title: 'Size Battery Extension', description: 'For extended runtime, calculate battery bank size or specify external battery packs' },
  ],
  commonLoads: [
    { equipment: 'Desktop Computer', watts: '150-300W', va: '200-400VA' },
    { equipment: 'Laptop', watts: '50-90W', va: '65-120VA' },
    { equipment: '24" Monitor', watts: '30-50W', va: '40-65VA' },
    { equipment: 'Server (1U)', watts: '200-500W', va: '250-650VA' },
    { equipment: 'Server (2U)', watts: '400-800W', va: '500-1000VA' },
    { equipment: 'Network Switch (24-port)', watts: '20-50W', va: '25-65VA' },
    { equipment: 'Router/Firewall', watts: '20-100W', va: '25-130VA' },
    { equipment: 'NAS Storage', watts: '50-200W', va: '65-250VA' },
    { equipment: 'Printer (Laser)', watts: '400-1500W', va: '500-1900VA' },
    { equipment: 'Medical Monitor', watts: '50-150W', va: '65-200VA' },
    { equipment: 'POS Terminal', watts: '100-200W', va: '130-260VA' },
    { equipment: 'CCTV DVR', watts: '50-150W', va: '65-200VA' },
  ],
  runtimeTable: [
    { upsVA: '1000VA', load50: '30 min', load75: '15 min', load100: '8 min' },
    { upsVA: '2000VA', load50: '35 min', load75: '18 min', load100: '10 min' },
    { upsVA: '3000VA', load50: '40 min', load75: '20 min', load100: '12 min' },
    { upsVA: '5000VA', load50: '25 min', load75: '12 min', load100: '7 min' },
    { upsVA: '10000VA', load50: '20 min', load75: '10 min', load100: '5 min' },
    { upsVA: '20000VA', load50: '15 min', load75: '8 min', load100: '4 min' },
  ],
};

// Battery Information
const BATTERY_INFO = {
  types: [
    {
      type: 'VRLA AGM (Absorbed Glass Mat)',
      description: 'Most common UPS battery. Electrolyte absorbed in glass mat separators.',
      lifespan: '3-5 years (standard), 8-10 years (long-life)',
      advantages: ['Maintenance-free', 'Spill-proof', 'Low self-discharge', 'Good for high discharge'],
      limitations: ['Temperature sensitive', 'Cannot be revived if deep discharged', 'Fixed capacity'],
      brands: ['CSB', 'Yuasa', 'Panasonic', 'Vision', 'Leoch'],
      priceRange: 'KES 2,500 - 8,000 per 12V battery'
    },
    {
      type: 'VRLA Gel',
      description: 'Electrolyte in gel form. Better for deep discharge and high temperatures.',
      lifespan: '5-8 years typical',
      advantages: ['Better deep discharge recovery', 'Higher temperature tolerance', 'Longer cycle life'],
      limitations: ['More expensive', 'Lower high-rate performance', 'Slower charging'],
      brands: ['Sonnenschein', 'Victron', 'BAE', 'Ritar'],
      priceRange: 'KES 5,000 - 15,000 per 12V battery'
    },
    {
      type: 'Lithium-Ion (Li-Ion)',
      description: 'Modern technology offering longer life and smaller footprint.',
      lifespan: '10-15 years',
      advantages: ['2-3x longer life', '50% smaller/lighter', 'Faster charging', 'More cycles', 'Better at high temp'],
      limitations: ['Higher initial cost', 'Requires BMS', 'Different charging requirements'],
      brands: ['Eaton', 'Vertiv', 'APC (Schneider)', 'Huawei'],
      priceRange: 'KES 50,000 - 500,000+ per module'
    }
  ],
  voltages: [
    { config: '12V', series: '1 battery', typical: '500-800VA UPS' },
    { config: '24V', series: '2 batteries', typical: '1-2kVA UPS' },
    { config: '36V', series: '3 batteries', typical: '1.5-3kVA UPS' },
    { config: '48V', series: '4 batteries', typical: '1.5-3kVA UPS' },
    { config: '72V', series: '6 batteries', typical: '2-5kVA UPS' },
    { config: '96V', series: '8 batteries', typical: '3-6kVA UPS' },
    { config: '192V', series: '16 batteries', typical: '6-20kVA UPS' },
    { config: '240V', series: '20 batteries', typical: '10-40kVA UPS' },
    { config: '384V', series: '32 batteries', typical: '30-200kVA UPS' },
    { config: '480V', series: '40 batteries', typical: '100kVA+ UPS' },
  ],
  testingProcedures: [
    { test: 'Visual Inspection', description: 'Check for swelling, leaks, corrosion, damage', frequency: 'Monthly' },
    { test: 'Voltage Check', description: 'Measure individual and total string voltage', frequency: 'Monthly' },
    { test: 'Connection Check', description: 'Verify tight connections, no corrosion', frequency: 'Quarterly' },
    { test: 'Impedance/Conductance Test', description: 'Measures internal resistance to assess health', frequency: 'Annually' },
    { test: 'Load Bank Test', description: 'Discharge test to verify actual capacity', frequency: 'Annually' },
    { test: 'Thermal Scan', description: 'Infrared scan to detect hot spots', frequency: 'Annually' },
  ]
};

// Installation Steps
const INSTALLATION_STEPS = [
  { phase: 'Site Survey', tasks: ['Assess existing power infrastructure', 'Measure available space', 'Check ventilation and cooling', 'Verify floor load capacity', 'Plan cable routes', 'Identify bypass requirements'], time: '1 day', icon: '📋' },
  { phase: 'System Design', tasks: ['Calculate total load', 'Select appropriate UPS model', 'Size battery bank for runtime', 'Design input/output wiring', 'Plan maintenance bypass', 'Specify monitoring requirements'], time: '2-3 days', icon: '📐' },
  { phase: 'Equipment Delivery', tasks: ['Receive and inspect UPS', 'Receive and inspect batteries', 'Verify all accessories', 'Store properly until installation', 'Coordinate installation date'], time: '1-4 weeks', icon: '📦' },
  { phase: 'Physical Installation', tasks: ['Position UPS unit', 'Install battery cabinet if separate', 'Install external maintenance bypass', 'Mount distribution panels', 'Install cable trays', 'Set up environmental monitoring'], time: '1-2 days', icon: '🔧' },
  { phase: 'Electrical Connection', tasks: ['Connect input supply', 'Connect battery strings', 'Connect load distribution', 'Install bypass connections', 'Verify grounding', 'Install surge protection'], time: '1-2 days', icon: '⚡' },
  { phase: 'Commissioning', tasks: ['Power up sequence', 'Program UPS parameters', 'Verify battery charging', 'Test transfer to battery', 'Verify bypass operation', 'Load test at rated capacity', 'Document all settings'], time: '1 day', icon: '✅' },
  { phase: 'Handover', tasks: ['Operator training', 'Provide documentation', 'Set up remote monitoring', 'Register warranty', 'Establish maintenance schedule'], time: '2-4 hours', icon: '📚' },
];

// Maintenance Schedule
const MAINTENANCE_SCHEDULE = [
  { interval: 'Daily', tasks: ['Check UPS status indicators', 'Verify load percentage', 'Note any alarms', 'Check room temperature'], responsible: 'Site operator', tools: 'Visual inspection' },
  { interval: 'Monthly', tasks: ['Record battery voltage', 'Check UPS load', 'Verify cooling fans running', 'Check for error logs', 'Clean dust from vents'], responsible: 'IT/Facilities staff', tools: 'Multimeter, logbook' },
  { interval: 'Quarterly', tasks: ['Battery visual inspection', 'Check all connections', 'Verify room ventilation', 'Review alarm history', 'Test UPS communication'], responsible: 'Technician', tools: 'Inspection checklist' },
  { interval: 'Semi-Annual', tasks: ['Battery impedance test', 'Clean/replace air filters', 'Check capacitor condition', 'Verify bypass operation', 'Update firmware if available'], responsible: 'UPS specialist', tools: 'Battery tester, thermal camera' },
  { interval: 'Annual', tasks: ['Full load bank test', 'Battery capacity test', 'Thermal scan of all connections', 'Calibrate battery monitor', 'Full system inspection', 'Update maintenance records'], responsible: 'Certified engineer', tools: 'Load bank, battery analyzer' },
  { interval: 'Every 3-5 Years', tasks: ['Battery replacement', 'Capacitor inspection/replacement', 'Fan replacement if needed', 'Full recalibration', 'Consider UPS upgrade'], responsible: 'UPS service company', tools: 'Replacement parts, test equipment' },
];

// Fault Database
const FAULT_DATABASE = [
  { fault: 'UPS on Battery - No Utility Power', causes: ['Power outage', 'Input breaker tripped', 'Input wiring fault', 'Utility voltage out of range'], diagnostics: ['Check utility power at other outlets', 'Check input breaker', 'Measure input voltage'], solution: 'If utility power OK elsewhere, check input wiring and breaker. Adjust input voltage window if borderline voltage.', urgency: 'high' },
  { fault: 'Low Battery / Short Runtime', causes: ['Battery end of life', 'Battery not charging', 'Overloaded UPS', 'Battery connection loose', 'Ambient temperature high'], diagnostics: ['Check battery age', 'Measure charging voltage', 'Check load percentage', 'Measure battery temperature'], solution: 'Test battery capacity. Replace batteries if over 3-4 years old or capacity below 80%. Check for overload.', urgency: 'medium' },
  { fault: 'UPS Running on Bypass', causes: ['Inverter overload', 'Inverter fault', 'Cooling fan failure', 'Internal temperature high', 'User commanded bypass'], diagnostics: ['Check load percentage', 'Check temperature readings', 'Check fan operation', 'Review fault codes'], solution: 'Reduce load if overloaded. Clear temperature alarms, check cooling. Service inverter section if fault persists.', urgency: 'high' },
  { fault: 'Battery Not Charging', causes: ['Charger fault', 'Battery disconnect open', 'Battery string failed', 'Charger fuse blown', 'Control board fault'], diagnostics: ['Check battery breaker', 'Measure charger output voltage', 'Check individual battery voltages'], solution: 'If charger output OK, check battery connections and breaker. Replace charger section if no output.', urgency: 'high' },
  { fault: 'Overload Alarm', causes: ['Too many loads connected', 'Load equipment fault', 'Startup inrush', 'UPS undersized'], diagnostics: ['Check actual load vs UPS capacity', 'Identify high-draw equipment', 'Check for equipment faults'], solution: 'Reduce connected load. Stagger equipment startup. If persistent, upgrade to larger UPS.', urgency: 'medium' },
  { fault: 'High Temperature Alarm', causes: ['Blocked ventilation', 'Failed cooling fans', 'Room AC failure', 'Dirty filters', 'High ambient temperature'], diagnostics: ['Check room temperature', 'Verify fan operation', 'Check air filter condition', 'Check for obstructions'], solution: 'Clean or replace filters. Ensure adequate room cooling. Replace failed fans. Reduce UPS load to reduce heat.', urgency: 'high' },
  { fault: 'Communication Failure', causes: ['Network card fault', 'Cable disconnected', 'Network configuration issue', 'Firmware bug'], diagnostics: ['Ping UPS IP address', 'Check cable connections', 'Verify network settings', 'Check card status'], solution: 'Reconnect cables, verify IP settings, restart network card, update firmware if available.', urgency: 'low' },
  { fault: 'Output Voltage Out of Range', causes: ['Calibration drift', 'Inverter fault', 'Capacitor aging', 'Heavy unbalanced load'], diagnostics: ['Measure output voltage with calibrated meter', 'Check load balance across phases', 'Review event logs'], solution: 'Recalibrate output voltage. If out of adjustment range, service inverter components.', urgency: 'medium' },
];

// Pricing
const UPS_PRICING = [
  { size: '650VA / 360W', type: 'Offline', phases: '1ph', runtime: '5-10 min', price: 'KES 8,000 - 15,000', application: 'Home PC, Router' },
  { size: '1000VA / 600W', type: 'Line-Interactive', phases: '1ph', runtime: '8-15 min', price: 'KES 18,000 - 35,000', application: 'Office workstation' },
  { size: '1500VA / 900W', type: 'Line-Interactive', phases: '1ph', runtime: '10-20 min', price: 'KES 28,000 - 50,000', application: 'Multiple workstations' },
  { size: '2000VA / 1.6kW', type: 'Line-Interactive', phases: '1ph', runtime: '10-15 min', price: 'KES 45,000 - 80,000', application: 'Small server' },
  { size: '3000VA / 2.4kW', type: 'Online', phases: '1ph', runtime: '8-12 min', price: 'KES 80,000 - 150,000', application: 'Server room' },
  { size: '5000VA / 4kW', type: 'Online', phases: '1ph', runtime: '5-10 min', price: 'KES 150,000 - 280,000', application: 'Data closet' },
  { size: '6000VA / 4.8kW', type: 'Online', phases: '1ph', runtime: '5-8 min', price: 'KES 200,000 - 350,000', application: 'Critical loads' },
  { size: '10kVA / 8kW', type: 'Online', phases: '1ph/3ph', runtime: '5-10 min', price: 'KES 350,000 - 600,000', application: 'Server room' },
  { size: '15kVA / 12kW', type: 'Online', phases: '3ph', runtime: '5-8 min', price: 'KES 550,000 - 900,000', application: 'Small data center' },
  { size: '20kVA / 16kW', type: 'Online', phases: '3ph', runtime: '5-10 min', price: 'KES 700,000 - 1,200,000', application: 'Data center' },
  { size: '30kVA / 24kW', type: 'Online', phases: '3ph', runtime: '5-8 min', price: 'KES 1,000,000 - 1,800,000', application: 'Enterprise' },
  { size: '40kVA / 32kW', type: 'Online', phases: '3ph', runtime: '5-8 min', price: 'KES 1,400,000 - 2,500,000', application: 'Enterprise' },
  { size: '60kVA / 54kW', type: 'Online', phases: '3ph', runtime: '5-8 min', price: 'KES 2,200,000 - 3,500,000', application: 'Data center' },
  { size: '80kVA / 72kW', type: 'Online', phases: '3ph', runtime: '5-8 min', price: 'KES 2,800,000 - 4,500,000', application: 'Data center' },
  { size: '100kVA / 90kW', type: 'Online', phases: '3ph', runtime: '5-8 min', price: 'KES 3,500,000 - 5,500,000', application: 'Large data center' },
  { size: '200kVA / 180kW', type: 'Online', phases: '3ph', runtime: '5-8 min', price: 'KES 7,000,000 - 12,000,000', application: 'Enterprise DC' },
];

// Shipping Info
const SHIPPING_INFO = {
  nairobi: { cost: 'FREE', note: 'Free collection for UPS requiring service' },
  centralKenya: { regions: ['Kiambu', 'Muranga', 'Nyeri', 'Kirinyaga', 'Nyandarua'], cost: 'KES 2,000 - 6,000', time: 'Same day' },
  riftValley: { regions: ['Nakuru', 'Narok', 'Kajiado', 'Naivasha', 'Eldoret'], cost: 'KES 4,000 - 12,000', time: '1-2 days' },
  western: { regions: ['Kisumu', 'Kakamega', 'Bungoma', 'Kisii'], cost: 'KES 6,000 - 15,000', time: '1-2 days' },
  coast: { regions: ['Mombasa', 'Kilifi', 'Malindi', 'Kwale'], cost: 'KES 8,000 - 20,000', time: '2-3 days' },
  eastAfrica: {
    countries: [
      { country: 'Uganda', cities: 'Kampala, Jinja, Entebbe', cost: 'KES 15,000 - 30,000', time: '3-5 days' },
      { country: 'Tanzania', cities: 'Arusha, Dar es Salaam', cost: 'KES 18,000 - 40,000', time: '3-7 days' },
      { country: 'Rwanda', cities: 'Kigali', cost: 'KES 22,000 - 45,000', time: '4-6 days' },
    ]
  }
};

// Warranty Info
const WARRANTY_INFO = {
  standard: { duration: '12 Months', coverage: ['New UPS installations', 'Battery replacements (6 months)', 'Repair services', 'Component replacements'], conditions: ['Operated within specifications', 'Adequate ventilation maintained', 'No unauthorized modifications', 'Original batteries not mixed with other brands'] },
  extended: { duration: '24-36 Months', coverage: ['Premium UPS brands', 'With maintenance contract', 'Including battery coverage', 'Parts and labor'], conditions: ['Semi-annual maintenance by us', 'Environmental monitoring installed', 'Genuine parts only', 'Site conditions maintained'] },
  exclusions: ['Damage from lightning/power surge (if no SPD)', 'Damage from overloading', 'Consumables (fuses, batteries after normal life)', 'Software/firmware issues', 'Damage from improper installation', 'Cosmetic damage', 'Damage from environmental factors (water, dust, extreme temp)']
};

export default function UPSPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="bg-black min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <Image src="/images/24.png" alt="UPS Systems" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.3) 0%, rgba(0, 100, 180, 0.25) 100%)' }} />
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)' }} />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        <motion.div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6" style={{ opacity: heroOpacity, y: textY }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="max-w-5xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">Uninterrupted Power Experts</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">UPS Systems</span>
              <span className="block bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">& Solutions</span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed">
              Complete UPS solutions. Online, Line-Interactive, Modular. Battery replacement. Maintenance. All sizes from 650VA to 500kVA. 12-24 months warranty.
            </motion.p>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 1 }} className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 flex flex-wrap gap-4 justify-center">
              <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=UPS%20System%20Inquiry" label="WhatsApp Quote" />
              <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" label="Call Now" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Complete Guide to UPS Systems</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Everything you need to know about Uninterruptible Power Supplies.</p>
              </div>
              <div className="grid gap-8">
                {UPS_OVERVIEW.map((section, index) => (
                  <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">{section.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{section.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'types' && (
            <motion.div key="types" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Types of UPS Systems</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Complete guide to UPS topologies with specifications.</p>
              </div>
              <div className="space-y-6">
                {UPS_TYPES.map((ups) => (
                  <div key={ups.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-blue-500/30 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">{ups.type}</h3>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">{ups.topology}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">{ups.priceRange}</p>
                          <p className="text-gray-500 text-sm">{ups.powerRange}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 grid md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-gray-400">Efficiency:</span> <span className="text-white">{ups.efficiency}</span></div>
                      <div><span className="text-gray-400">Transfer Time:</span> <span className="text-white">{ups.transferTime}</span></div>
                      <div><span className="text-gray-400">Waveform:</span> <span className="text-white">{ups.waveform}</span></div>
                      <div><span className="text-gray-400">Protection:</span> <span className="text-white text-xs">{ups.protection}</span></div>
                    </div>
                    <div className="p-6 border-t border-white/10 grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-green-400 text-sm font-bold mb-2">Advantages</h4>
                        <div className="flex flex-wrap gap-2">{ups.advantages.map((adv, i) => (<span key={i} className="px-2 py-1 bg-green-500/10 text-green-300 text-xs rounded">{adv}</span>))}</div>
                      </div>
                      <div>
                        <h4 className="text-amber-400 text-sm font-bold mb-2">Applications</h4>
                        <div className="flex flex-wrap gap-2">{ups.applications.map((app, i) => (<span key={i} className="px-2 py-1 bg-amber-500/10 text-amber-300 text-xs rounded">{app}</span>))}</div>
                      </div>
                    </div>
                    <div className="p-6 border-t border-white/10 bg-white/5">
                      <p className="text-gray-400 text-sm"><span className="text-white font-medium">Brands:</span> {ups.brands.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div key="components" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Components</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Detailed breakdown of all UPS internal components.</p>
              </div>
              <div className="space-y-4">
                {UPS_COMPONENTS.map((comp) => (
                  <div key={comp.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden">
                    <button onClick={() => setExpandedComponent(expandedComponent === comp.name ? null : comp.name)} className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5">
                      <div>
                        <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{comp.function}</p>
                      </div>
                      <span className={`text-purple-400 transition-transform ${expandedComponent === comp.name ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedComponent === comp.name && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/10">
                          <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-purple-400 font-bold mb-2">Description</h4>
                              <p className="text-gray-300 text-sm mb-4">{comp.description}</p>
                              <h4 className="text-red-400 font-bold mb-2">Signs of Failure</h4>
                              <ul className="space-y-1">{comp.failureSigns.map((sign, i) => (<li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-red-400">!</span>{sign}</li>))}</ul>
                            </div>
                            <div className="bg-black/30 rounded-lg p-4">
                              <h4 className="text-amber-400 font-bold mb-2">Block Diagram</h4>
                              <pre className="text-purple-400 text-xs font-mono whitespace-pre overflow-x-auto">{comp.diagram}</pre>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'sizing' && (
            <motion.div key="sizing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Sizing Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Calculate the right UPS size for your requirements.</p>
              </div>
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-6">6-Step Sizing Process</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {UPS_SIZING.steps.map((step) => (
                    <div key={step.step} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 bg-purple-500 text-white font-bold rounded-full flex items-center justify-center">{step.step}</span>
                        <h4 className="text-white font-bold">{step.title}</h4>
                      </div>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl p-8 border border-blue-500/30">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">Common Equipment Power Ratings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left border-b border-white/20"><th className="py-3 px-4 text-gray-400">Equipment</th><th className="py-3 px-4 text-gray-400">Watts</th><th className="py-3 px-4 text-gray-400">VA</th></tr></thead>
                    <tbody>{UPS_SIZING.commonLoads.map((load) => (<tr key={load.equipment} className="border-b border-white/10 hover:bg-white/5"><td className="py-3 px-4 text-white">{load.equipment}</td><td className="py-3 px-4 text-cyan-400">{load.watts}</td><td className="py-3 px-4 text-purple-400">{load.va}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-6">Typical Runtime (Internal Batteries)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left border-b border-white/20"><th className="py-3 px-4 text-gray-400">UPS Size</th><th className="py-3 px-4 text-gray-400">50% Load</th><th className="py-3 px-4 text-gray-400">75% Load</th><th className="py-3 px-4 text-gray-400">100% Load</th></tr></thead>
                    <tbody>{UPS_SIZING.runtimeTable.map((row) => (<tr key={row.upsVA} className="border-b border-white/10 hover:bg-white/5"><td className="py-3 px-4 text-white font-bold">{row.upsVA}</td><td className="py-3 px-4 text-green-400">{row.load50}</td><td className="py-3 px-4 text-amber-400">{row.load75}</td><td className="py-3 px-4 text-red-400">{row.load100}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'batteries' && (
            <motion.div key="batteries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Battery Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Complete guide to UPS batteries - types, configurations, and testing.</p>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                {BATTERY_INFO.types.map((battery) => (
                  <div key={battery.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-green-500/30 p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-2">{battery.type}</h3>
                    <p className="text-gray-400 text-sm mb-4">{battery.description}</p>
                    <div className="space-y-3">
                      <div><span className="text-gray-500">Lifespan:</span> <span className="text-white">{battery.lifespan}</span></div>
                      <div><span className="text-gray-500">Price:</span> <span className="text-green-400">{battery.priceRange}</span></div>
                      <div><span className="text-gray-500 block mb-1">Advantages:</span><div className="flex flex-wrap gap-1">{battery.advantages.map((adv, i) => (<span key={i} className="px-2 py-1 bg-green-500/10 text-green-300 text-xs rounded">{adv}</span>))}</div></div>
                      <div><span className="text-gray-500 block mb-1">Brands:</span><p className="text-gray-300 text-sm">{battery.brands.join(', ')}</p></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border border-amber-500/30">
                <h3 className="text-2xl font-bold text-amber-400 mb-6">Battery Voltage Configurations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left border-b border-white/20"><th className="py-3 px-4 text-gray-400">DC Voltage</th><th className="py-3 px-4 text-gray-400">Batteries in Series</th><th className="py-3 px-4 text-gray-400">Typical UPS Size</th></tr></thead>
                    <tbody>{BATTERY_INFO.voltages.map((config) => (<tr key={config.config} className="border-b border-white/10 hover:bg-white/5"><td className="py-3 px-4 text-amber-400 font-bold">{config.config}</td><td className="py-3 px-4 text-white">{config.series}</td><td className="py-3 px-4 text-gray-300">{config.typical}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-8 border border-blue-500/30">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">Battery Testing Procedures</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {BATTERY_INFO.testingProcedures.map((test) => (
                    <div key={test.test} className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-bold mb-2">{test.test}</h4>
                      <p className="text-gray-400 text-sm mb-2">{test.description}</p>
                      <span className="text-blue-400 text-xs">Frequency: {test.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'installation' && (
            <motion.div key="installation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Installation Process</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Professional installation ensures reliability and safety.</p>
              </div>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500" />
                <div className="space-y-6">
                  {INSTALLATION_STEPS.map((step, index) => (
                    <motion.div key={step.phase} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="relative pl-20">
                      <div className="absolute left-4 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-lg">{step.icon}</div>
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-white">{step.phase}</h3>
                          <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-sm rounded-full">{step.time}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">{step.tasks.map((task, i) => (<div key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{task}</div>))}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Maintenance Schedule</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Regular maintenance ensures reliability when you need it most.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MAINTENANCE_SCHEDULE.map((schedule) => (
                  <div key={schedule.interval} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-teal-500/30 p-6">
                    <h3 className="text-xl font-bold text-teal-400 mb-2">{schedule.interval}</h3>
                    <p className="text-gray-500 text-sm mb-4">By: {schedule.responsible}</p>
                    <ul className="space-y-2 mb-4">{schedule.tasks.map((task, i) => (<li key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{task}</li>))}</ul>
                    <p className="text-gray-500 text-xs border-t border-white/10 pt-4">Tools: {schedule.tools}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS Troubleshooting Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Diagnose and solve common UPS problems.</p>
              </div>
              <div className="space-y-4">
                {FAULT_DATABASE.map((fault) => (
                  <div key={fault.fault} className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border ${fault.urgency === 'high' ? 'border-red-500/30' : fault.urgency === 'medium' ? 'border-amber-500/30' : 'border-blue-500/30'} overflow-hidden`}>
                    <button onClick={() => setExpandedFault(expandedFault === fault.fault ? null : fault.fault)} className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5">
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 text-xs rounded ${fault.urgency === 'high' ? 'bg-red-500/20 text-red-400' : fault.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{fault.urgency.toUpperCase()}</span>
                        <span className="text-white font-medium">{fault.fault}</span>
                      </div>
                      <span className="text-gray-400">▼</span>
                    </button>
                    <AnimatePresence>
                      {expandedFault === fault.fault && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden">
                          <div className="p-6 space-y-4">
                            <div><h4 className="text-amber-400 font-bold mb-2">Possible Causes</h4><div className="flex flex-wrap gap-2">{fault.causes.map((c, i) => (<span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{c}</span>))}</div></div>
                            <div><h4 className="text-blue-400 font-bold mb-2">Diagnostics</h4><ul className="space-y-1">{fault.diagnostics.map((d, i) => (<li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-blue-400">•</span>{d}</li>))}</ul></div>
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"><h4 className="text-green-400 font-bold mb-2">Solution</h4><p className="text-gray-300 text-sm">{fault.solution}</p></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">UPS System Pricing</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Estimated prices for UPS systems of various sizes.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left bg-gray-800/50"><th className="py-4 px-4 text-gray-400 rounded-tl-lg">Size</th><th className="py-4 px-4 text-gray-400">Type</th><th className="py-4 px-4 text-gray-400">Phases</th><th className="py-4 px-4 text-gray-400">Runtime</th><th className="py-4 px-4 text-gray-400">Application</th><th className="py-4 px-4 text-gray-400 rounded-tr-lg">Price Range</th></tr></thead>
                  <tbody>{UPS_PRICING.map((row, index) => (<tr key={row.size} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}><td className="py-4 px-4 text-white font-bold">{row.size}</td><td className="py-4 px-4 text-purple-400">{row.type}</td><td className="py-4 px-4 text-gray-300">{row.phases}</td><td className="py-4 px-4 text-gray-300">{row.runtime}</td><td className="py-4 px-4 text-gray-400 text-xs">{row.application}</td><td className="py-4 px-4 text-green-400 font-bold">{row.price}</td></tr>))}</tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'shipping' && (
            <motion.div key="shipping" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Send Your UPS for Service</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">We collect UPS systems from anywhere in Kenya and East Africa for repair.</p>
              </div>
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30 text-center">
                <h3 className="text-2xl font-bold text-green-400 mb-2">Nairobi Area</h3>
                <p className="text-4xl font-bold text-white mb-4">{SHIPPING_INFO.nairobi.cost}</p>
                <p className="text-gray-400">{SHIPPING_INFO.nairobi.note}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[{ name: 'Central Kenya', ...SHIPPING_INFO.centralKenya }, { name: 'Rift Valley', ...SHIPPING_INFO.riftValley }, { name: 'Western Kenya', ...SHIPPING_INFO.western }, { name: 'Coast Region', ...SHIPPING_INFO.coast }].map((region) => (
                  <div key={region.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-orange-500/30 p-6">
                    <h3 className="text-lg font-bold text-orange-400 mb-2">{region.name}</h3>
                    <p className="text-2xl font-bold text-white mb-3">{region.cost}</p>
                    <p className="text-gray-500 text-sm mb-3">Transit: {region.time}</p>
                    <div className="flex flex-wrap gap-2">{region.regions.map((r, i) => (<span key={i} className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded">{r}</span>))}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/30 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Need UPS Service?</h3>
                <p className="text-gray-400 mb-6">Contact us to arrange collection or get a repair quote.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=UPS%20Repair%20Request" label="WhatsApp Us" />
                  <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" label="Call Now" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'warranty' && (
            <motion.div key="warranty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Warranty Information</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">Comprehensive warranty coverage for peace of mind.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-indigo-500/30 p-8">
                  <div className="text-center mb-6"><h3 className="text-2xl font-bold text-indigo-400 mb-2">Standard Warranty</h3><p className="text-4xl font-bold text-white">{WARRANTY_INFO.standard.duration}</p></div>
                  <h4 className="text-gray-400 text-sm mb-3">Coverage:</h4>
                  <ul className="space-y-2 mb-6">{WARRANTY_INFO.standard.coverage.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{item}</li>))}</ul>
                  <h4 className="text-gray-400 text-sm mb-3">Conditions:</h4>
                  <ul className="space-y-2">{WARRANTY_INFO.standard.conditions.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-400 text-sm"><span className="text-indigo-400">•</span>{item}</li>))}</ul>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-500/30 p-8">
                  <div className="text-center mb-6"><span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">RECOMMENDED</span><h3 className="text-2xl font-bold text-emerald-400 mt-4 mb-2">Extended Warranty</h3><p className="text-4xl font-bold text-white">{WARRANTY_INFO.extended.duration}</p></div>
                  <h4 className="text-gray-400 text-sm mb-3">Coverage:</h4>
                  <ul className="space-y-2 mb-6">{WARRANTY_INFO.extended.coverage.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{item}</li>))}</ul>
                  <h4 className="text-gray-400 text-sm mb-3">Conditions:</h4>
                  <ul className="space-y-2">{WARRANTY_INFO.extended.conditions.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-400 text-sm"><span className="text-emerald-400">•</span>{item}</li>))}</ul>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-4">Warranty Exclusions</h3>
                <div className="grid md:grid-cols-2 gap-4">{WARRANTY_INFO.exclusions.map((item, i) => (<div key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-red-400">✗</span>{item}</div>))}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-3xl p-8 md:p-12 border border-purple-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need UPS Solutions?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Professional UPS supply, installation, battery replacement, and maintenance. All sizes from 650VA to 500kVA. 12-24 months warranty.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=UPS%20Quote%20Request" size="lg" label="Get Free Quote" />
            <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" size="lg" label="Call Us Now" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
