'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import UnifiedCTA from "@/components/cta/UnifiedCTA";

const TABS = [
  { id: 'overview', label: 'Overview', color: 'cyan' },
  { id: 'types', label: 'AC Types', color: 'blue' },
  { id: 'components', label: 'Components', color: 'slate' },
  { id: 'sizing', label: 'BTU Sizing', color: 'purple' },
  { id: 'refrigerants', label: 'Refrigerants', color: 'green' },
  { id: 'installation', label: 'Installation', color: 'amber' },
  { id: 'maintenance', label: 'Maintenance', color: 'teal' },
  { id: 'faults', label: 'Troubleshooting', color: 'red' },
  { id: 'pricing', label: 'Pricing', color: 'emerald' },
  { id: 'warranty', label: 'Warranty', color: 'indigo' },
];

// Comprehensive AC Overview - 10 Detailed Paragraphs
const AC_OVERVIEW = [
  {
    title: "Understanding Air Conditioning Systems",
    content: `Air conditioning systems are essential for comfort, productivity, and equipment protection in Kenya's tropical climate. Modern AC systems do more than cool air - they control humidity, filter particulates, and circulate fresh air for healthier indoor environments. From homes and offices to hospitals and data centers, properly designed and maintained AC systems create optimal conditions for people and processes. In commercial settings, AC directly impacts customer comfort, employee productivity, and even food safety. In industrial applications, precise temperature control protects sensitive equipment and processes. Understanding the different types of AC systems, their proper sizing, installation requirements, and maintenance needs is essential for achieving reliable, energy-efficient cooling.`
  },
  {
    title: "The Refrigeration Cycle Explained",
    content: `Air conditioning works on the principle of heat transfer using the refrigeration cycle. The process begins with liquid refrigerant absorbing heat from indoor air as it evaporates in the evaporator coil, cooling the air. The gaseous refrigerant is then compressed by the compressor, raising its temperature and pressure. This hot, high-pressure gas flows to the outdoor condenser coil where it releases heat to the outside air and condenses back to liquid. The liquid refrigerant passes through an expansion device, dropping in pressure and temperature, ready to absorb more heat. This continuous cycle moves heat from inside to outside, effectively cooling the indoor space. The efficiency of this cycle depends on proper refrigerant charge, clean coils, adequate airflow, and correct operating pressures.`
  },
  {
    title: "Choosing the Right AC System",
    content: `Selecting the appropriate AC system requires careful consideration of multiple factors including cooling load, space configuration, budget, energy efficiency, and future expansion plans. Split systems offer quiet operation and flexible installation for residential and small commercial applications. Cassette and ducted systems provide even air distribution for larger spaces and multiple rooms. VRF (Variable Refrigerant Flow) systems excel in buildings with varied cooling and heating requirements across multiple zones. Chiller systems are the choice for large commercial and industrial facilities. The initial cost must be balanced against operating efficiency - a more expensive inverter system may pay for itself in energy savings over a few years. Our engineers conduct thorough site assessments to recommend the optimal system for each application.`
  },
  {
    title: "The Importance of Proper Sizing",
    content: `Correct AC sizing is critical for comfort, efficiency, and equipment longevity. An undersized system will run continuously without achieving desired temperature, wasting energy and wearing out prematurely. An oversized system will short-cycle - turning on and off frequently - which prevents proper dehumidification, causes temperature swings, and stresses compressor components. Sizing calculations must consider floor area, ceiling height, insulation quality, window area and orientation, number of occupants, heat-generating equipment, and local climate conditions. In Kenya, factors like western sun exposure, minimal insulation in many buildings, and high occupancy in commercial spaces often require larger capacity than basic area calculations suggest. Professional load calculations ensure optimal system performance.`
  },
  {
    title: "Understanding Refrigerants and Environmental Impact",
    content: `Refrigerants have evolved significantly to reduce environmental impact. Older R22 (HCFC) refrigerant depletes the ozone layer and is being phased out globally under the Montreal Protocol. Modern systems use R410A, R32, or R290 (propane) with zero ozone depletion potential. R32 has become increasingly popular as it has lower global warming potential than R410A while offering similar or better efficiency. When servicing older R22 systems, conversion to drop-in alternatives like R407C is possible but requires careful consideration of compatibility and performance implications. Environmental regulations require proper refrigerant handling, recovery, and disposal by certified technicians. Our team is trained in all refrigerant types and follows best practices for environmental compliance.`
  },
  {
    title: "Installation Quality: The Foundation of Performance",
    content: `Even the best AC equipment will underperform if poorly installed. Critical installation factors include correct indoor and outdoor unit positioning, proper pipe sizing and insulation, accurate refrigerant charge, correct electrical connections, and adequate drainage. Indoor units must be mounted level with proper clearance for airflow and maintenance. Outdoor units need adequate ventilation and protection from direct sun if possible. Refrigerant piping must be properly brazed, leak-tested, evacuated of moisture and air, and charged to manufacturer specifications. Electrical installations must comply with local codes with proper circuit protection. Drain pipes must slope correctly to prevent water backup and condensation issues. Professional installation by trained technicians ensures your investment performs as expected.`
  },
  {
    title: "Preventive Maintenance: Maximizing Efficiency and Lifespan",
    content: `Regular maintenance is essential for AC system performance, efficiency, and longevity. Dirty filters restrict airflow, reducing efficiency by 5-15% and potentially causing evaporator icing. Dirty coils insulate the heat transfer surface, forcing the system to work harder and consume more energy. Low refrigerant charge reduces capacity and efficiency while potentially damaging the compressor. Electrical connections loosen over time, causing heating and potential failure. A comprehensive maintenance program includes regular filter cleaning or replacement, coil cleaning, refrigerant pressure checks, electrical tightening and testing, condensate drain clearing, and overall system inspection. Maintenance frequency depends on usage and environment - dusty locations and 24/7 operations require more frequent attention.`
  },
  {
    title: "Common AC Problems and Prevention",
    content: `Understanding common failure modes helps in prevention and quick diagnosis. Insufficient cooling often results from dirty filters, low refrigerant, or dirty coils - all preventable with maintenance. Compressor failure, the most expensive repair, is usually caused by low or incorrect refrigerant charge, electrical issues, or repeated short-cycling. Frozen evaporator coils indicate restricted airflow or low refrigerant. Water leaks typically result from clogged drain lines or improper installation. Strange noises may indicate loose components, failing bearings, or refrigerant issues. Many problems can be avoided through regular professional maintenance and prompt attention to early warning signs like reduced performance, unusual sounds, or increased energy consumption.`
  },
  {
    title: "Energy Efficiency and Cost Savings",
    content: `In Kenya's commercial environment, air conditioning often represents 40-60% of electricity costs. Improving AC efficiency directly impacts operational costs. Inverter technology can reduce energy consumption by 30-50% compared to fixed-speed systems. Proper sizing prevents energy waste from oversized systems. Regular maintenance maintains rated efficiency. Smart controls and programmable thermostats reduce runtime during unoccupied hours. In some applications, economizers can use cool outside air when available, reducing compressor runtime. For larger installations, building management systems (BMS) optimize HVAC operation based on occupancy, weather, and electricity tariffs. Our energy audit services can identify specific opportunities to reduce your cooling costs while maintaining comfort.`
  },
  {
    title: "Our Comprehensive AC Services",
    content: `Emerson Industrial Maintenance Services provides complete air conditioning solutions across Kenya and East Africa. Our services include system design and load calculations, supply of quality equipment from leading brands, professional installation with proper commissioning, preventive maintenance contracts, emergency repair services, refrigerant handling and recharging, compressor repairs and replacements, control system upgrades, and energy efficiency consulting. We service all AC types including split systems, cassettes, ducted systems, VRF/VRV, and chillers. Our technicians are factory-trained on major brands including Daikin, LG, Samsung, Midea, Carrier, and others. With fully equipped service vehicles and well-stocked spare parts inventory, we provide fast, reliable service to minimize your downtime.`
  }
];

// AC Types
const AC_TYPES = [
  {
    type: 'Wall-Mounted Split AC',
    capacity: '9,000 - 36,000 BTU (0.75 - 3 Ton)',
    installation: 'Indoor wall mount + outdoor condenser',
    efficiency: 'Up to SEER 22 (Inverter)',
    applications: ['Bedrooms', 'Living rooms', 'Small offices', 'Retail shops'],
    advantages: ['Affordable', 'Easy installation', 'Individual control', 'Wide availability'],
    disadvantages: ['Limited coverage area', 'Wall space required', 'Visible indoor unit'],
    brands: ['Daikin', 'LG', 'Samsung', 'Midea', 'Hisense', 'TCL'],
    priceRange: 'KES 35,000 - 180,000'
  },
  {
    type: 'Cassette AC (Ceiling Mounted)',
    capacity: '18,000 - 60,000 BTU (1.5 - 5 Ton)',
    installation: 'Ceiling void + outdoor condenser',
    efficiency: 'Up to SEER 20',
    applications: ['Offices', 'Restaurants', 'Retail', 'Conference rooms'],
    advantages: ['360° airflow', 'Aesthetically pleasing', 'Even distribution', 'Hidden in ceiling'],
    disadvantages: ['Requires ceiling void', 'Higher cost', 'Complex installation'],
    brands: ['Daikin', 'LG', 'Mitsubishi', 'Carrier', 'Trane'],
    priceRange: 'KES 120,000 - 450,000'
  },
  {
    type: 'Floor Standing / Console AC',
    capacity: '24,000 - 60,000 BTU (2 - 5 Ton)',
    installation: 'Floor mount + outdoor condenser',
    efficiency: 'Up to SEER 18',
    applications: ['Large offices', 'Halls', 'Retail', 'Server rooms'],
    advantages: ['High capacity', 'No ceiling work', 'Easy maintenance', 'Powerful airflow'],
    disadvantages: ['Takes floor space', 'Visible unit', 'May require stands'],
    brands: ['LG', 'Samsung', 'Carrier', 'Daikin'],
    priceRange: 'KES 150,000 - 400,000'
  },
  {
    type: 'Ducted Split System',
    capacity: '36,000 - 120,000+ BTU (3 - 10+ Ton)',
    installation: 'Ceiling void + ductwork + outdoor',
    efficiency: 'Up to SEER 18',
    applications: ['Whole house', 'Large offices', 'Hotels', 'Hospitals'],
    advantages: ['Hidden system', 'Multiple rooms', 'Even temperature', 'Central control'],
    disadvantages: ['Requires ductwork', 'Higher cost', 'Complex design', 'Ceiling void needed'],
    brands: ['Daikin', 'Carrier', 'Trane', 'Mitsubishi'],
    priceRange: 'KES 300,000 - 1,500,000+'
  },
  {
    type: 'VRF/VRV Multi-Split System',
    capacity: '5 - 200+ Tons (system)',
    installation: 'Multiple indoor + single/multiple outdoor',
    efficiency: 'Up to SEER 25+',
    applications: ['Large buildings', 'Hotels', 'Offices', 'Mixed-use'],
    advantages: ['Individual zone control', 'Heat recovery option', 'High efficiency', 'Scalable'],
    disadvantages: ['High initial cost', 'Specialized installation', 'Complex controls'],
    brands: ['Daikin VRV', 'LG Multi-V', 'Mitsubishi City Multi', 'Toshiba'],
    priceRange: 'KES 1,500,000 - 50,000,000+'
  },
  {
    type: 'Air-Cooled Chiller',
    capacity: '20 - 500+ Tons',
    installation: 'Rooftop/outdoor + AHUs + piping',
    efficiency: 'COP 2.5-4.0',
    applications: ['Large commercial', 'Industrial', 'Data centers', 'Hospitals'],
    advantages: ['Centralized', 'Very large capacity', 'Flexible distribution', 'BMS integration'],
    disadvantages: ['Very high cost', 'Requires plant room', 'Complex maintenance', 'Chilled water piping'],
    brands: ['Carrier', 'Trane', 'York', 'Daikin', 'Climaveneta'],
    priceRange: 'KES 5,000,000 - 100,000,000+'
  }
];

// AC Components with Diagrams
const AC_COMPONENTS = [
  {
    name: 'Compressor',
    description: 'The heart of the system - compresses refrigerant gas, raising its temperature and pressure for heat rejection.',
    function: 'Compress low-pressure gas to high-pressure gas',
    types: ['Rotary (small split)', 'Scroll (medium)', 'Screw (large chiller)', 'Reciprocating (legacy)'],
    diagram: `
┌─────────────────────────────┐
│       COMPRESSOR            │
├─────────────────────────────┤
│                             │
│   LOW PRESSURE GAS IN       │
│         ↓                   │
│   ┌───────────────────┐     │
│   │    COMPRESSION    │     │
│   │     CHAMBER       │     │
│   │  ┌─────────────┐  │     │
│   │  │  MOTOR      │  │     │
│   │  │  ════════   │  │     │
│   │  │  SCROLL/    │  │     │
│   │  │  ROTARY     │  │     │
│   │  └─────────────┘  │     │
│   └───────────────────┘     │
│         ↓                   │
│   HIGH PRESSURE GAS OUT     │
│                             │
│   Types: Inverter/Fixed     │
└─────────────────────────────┘
    `,
    maintenance: ['Check oil level', 'Monitor amp draw', 'Check for vibration', 'Listen for unusual noise']
  },
  {
    name: 'Condenser Coil (Outdoor)',
    description: 'Heat exchanger where hot refrigerant gas releases heat to outdoor air and condenses to liquid.',
    function: 'Reject heat from refrigerant to outside air',
    types: ['Air-cooled (most common)', 'Water-cooled (cooling tower)', 'Evaporative'],
    diagram: `
┌─────────────────────────────┐
│    CONDENSER (OUTDOOR)      │
├─────────────────────────────┤
│                             │
│   HOT GAS IN →              │
│              ↓              │
│   ┌───────────────────┐     │
│   │  FINNED COIL      │     │
│   │  ═══════════════  │     │
│   │  ═══════════════  │     │
│   │  ═══════════════  │     │
│   │  ═══════════════  │     │
│   │  ═══════════════  │     │
│   └───────────────────┘     │
│         ↓  ← FAN AIR        │
│   LIQUID OUT                │
│                             │
│   Keep fins clean!          │
└─────────────────────────────┘
    `,
    maintenance: ['Clean coil regularly', 'Check fan operation', 'Clear obstructions', 'Wash with coil cleaner']
  },
  {
    name: 'Evaporator Coil (Indoor)',
    description: 'Heat exchanger where liquid refrigerant absorbs heat from indoor air and evaporates.',
    function: 'Absorb heat from room air, cool and dehumidify',
    types: ['Direct expansion', 'Chilled water (AHU)'],
    diagram: `
┌─────────────────────────────┐
│    EVAPORATOR (INDOOR)      │
├─────────────────────────────┤
│                             │
│   WARM AIR IN ←             │
│              ↓              │
│   ┌───────────────────┐     │
│   │  FINNED COIL      │     │
│   │  ═══════════════  │     │
│   │  ═══════════════  │     │
│   │  ═══════════════  │     │
│   │  ═══════════════  │     │
│   └───────────────────┘     │
│         ↓                   │
│   COOL AIR OUT →            │
│                             │
│   CONDENSATE → DRAIN        │
└─────────────────────────────┘
    `,
    maintenance: ['Clean/replace filter', 'Clean coil annually', 'Check drain', 'Check fan operation']
  },
  {
    name: 'Expansion Device',
    description: 'Reduces refrigerant pressure and temperature before entering evaporator.',
    function: 'Meter refrigerant flow, drop pressure',
    types: ['Capillary tube (small)', 'TXV (larger)', 'Electronic EXV (VRF)'],
    diagram: `
┌─────────────────────────────┐
│    EXPANSION DEVICE         │
├─────────────────────────────┤
│                             │
│   HIGH PRESSURE LIQUID      │
│         │                   │
│         ↓                   │
│   ┌───────────────────┐     │
│   │   TXV / CAPILLARY │     │
│   │                   │     │
│   │   ○───────────○   │     │
│   │   LARGE  SMALL    │     │
│   │   PORT   PORT     │     │
│   │                   │     │
│   │   Sensing bulb →  │     │
│   └───────────────────┘     │
│         ↓                   │
│   LOW PRESSURE LIQUID/GAS   │
│                             │
└─────────────────────────────┘
    `,
    maintenance: ['Check superheat/subcooling', 'Clean inlet filter', 'Check sensing bulb']
  },
  {
    name: 'Blower/Fan Motor',
    description: 'Circulates air across evaporator coil (indoor) or condenser coil (outdoor).',
    function: 'Air circulation for heat transfer',
    types: ['PSC motor (older)', 'ECM motor (efficient)', 'DC inverter fan'],
    diagram: `
┌─────────────────────────────┐
│      BLOWER ASSEMBLY        │
├─────────────────────────────┤
│                             │
│   ┌───────────────────┐     │
│   │   BLOWER WHEEL    │     │
│   │  ╭─────────────╮  │     │
│   │  │ ◉ ◉ ◉ ◉ ◉ │  │     │
│   │  │   MOTOR     │  │     │
│   │  │ ◉ ◉ ◉ ◉ ◉ │  │     │
│   │  ╰─────────────╯  │     │
│   └───────────────────┘     │
│                             │
│   AIR → ════════ → AIR      │
│   IN      FLOW      OUT     │
│                             │
│   CFM varies with speed     │
└─────────────────────────────┘
    `,
    maintenance: ['Clean blower wheel', 'Lubricate bearings', 'Check amp draw', 'Clean fan blades']
  },
  {
    name: 'Control PCB / Inverter Board',
    description: 'Electronic brain of the system controlling all functions and inverter motor speed.',
    function: 'System control, compressor speed modulation, fault protection',
    types: ['Basic relay board', 'Inverter control', 'Smart Wi-Fi enabled'],
    diagram: `
┌─────────────────────────────┐
│      CONTROL BOARD          │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │    PCB LAYOUT       │    │
│  │  ┌───┐ ┌───┐ ┌───┐  │    │
│  │  │CPU│ │PWR│ │COM│  │    │
│  │  └───┘ └───┘ └───┘  │    │
│  │                     │    │
│  │  SENSORS:           │    │
│  │  • Room temp        │    │
│  │  • Coil temp        │    │
│  │  • Outdoor temp     │    │
│  │                     │    │
│  │  OUTPUTS:           │    │
│  │  • Compressor       │    │
│  │  • Fan speed        │    │
│  │  • Valve control    │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
    `,
    maintenance: ['Protect from voltage spikes', 'Keep dry', 'Check error codes', 'Update firmware']
  }
];

// BTU Sizing Guide
const BTU_SIZING = {
  basicTable: [
    { area: '9-14 m²', btu: '9,000 BTU', tons: '0.75 Ton', room: 'Small bedroom, home office' },
    { area: '15-22 m²', btu: '12,000 BTU', tons: '1 Ton', room: 'Standard bedroom, small living room' },
    { area: '23-32 m²', btu: '18,000 BTU', tons: '1.5 Ton', room: 'Large bedroom, medium living room' },
    { area: '33-45 m²', btu: '24,000 BTU', tons: '2 Ton', room: 'Large living room, small office' },
    { area: '46-65 m²', btu: '36,000 BTU', tons: '3 Ton', room: 'Large office, conference room' },
    { area: '66-90 m²', btu: '48,000 BTU', tons: '4 Ton', room: 'Large commercial, restaurant' },
    { area: '91-120 m²', btu: '60,000 BTU', tons: '5 Ton', room: 'Large hall, showroom' },
  ],
  adjustmentFactors: [
    { factor: 'Sunny room / West-facing windows', adjustment: '+10 to +20%' },
    { factor: 'Shaded room / East-facing', adjustment: '-10%' },
    { factor: 'Kitchen area', adjustment: '+4,000 BTU' },
    { factor: 'Each additional person above 2', adjustment: '+600 BTU' },
    { factor: 'High ceiling (>3m)', adjustment: '+10 to +20%' },
    { factor: 'Large window area (>30% wall)', adjustment: '+10 to +15%' },
    { factor: 'Top floor / Direct roof exposure', adjustment: '+20 to +30%' },
    { factor: 'Poor insulation / Old building', adjustment: '+20 to +30%' },
    { factor: 'Heat-generating equipment', adjustment: 'Calculate separately' },
    { factor: 'Server room / Data center', adjustment: '2-3x normal load' },
  ],
  formula: 'BTU = Area (sq ft) × 25 × Adjustment Factors',
  note: 'For precise commercial sizing, professional load calculation (Manual J/N) is recommended.',
};

// Refrigerant Information
const REFRIGERANT_INFO = {
  types: [
    { name: 'R22 (HCFC)', gwp: '1810', odp: '0.05', status: 'PHASED OUT', notes: 'Legacy systems only, no new equipment', replacement: 'R407C, R410A, R32', pressure: '~200 psi discharge' },
    { name: 'R410A (HFC)', gwp: '2088', odp: '0', status: 'CURRENT (declining)', notes: 'Most common current refrigerant', replacement: 'R32, R290', pressure: '~400 psi discharge' },
    { name: 'R32 (HFC)', gwp: '675', odp: '0', status: 'CURRENT (growing)', notes: 'Lower GWP, better efficiency, mildly flammable', replacement: 'N/A - current best', pressure: '~350 psi discharge' },
    { name: 'R290 (Propane)', gwp: '3', odp: '0', status: 'EMERGING', notes: 'Natural refrigerant, excellent efficiency, flammable', replacement: 'N/A', pressure: '~240 psi discharge' },
    { name: 'R407C (HFC)', gwp: '1774', odp: '0', status: 'RETROFIT', notes: 'R22 replacement option', replacement: 'R410A, R32', pressure: '~300 psi discharge' },
    { name: 'R134a (HFC)', gwp: '1430', odp: '0', status: 'CURRENT', notes: 'Chillers, automotive', replacement: 'R1234yf', pressure: '~180 psi discharge' },
  ],
  handling: [
    'Only certified technicians should handle refrigerants',
    'Always recover refrigerant before system opening',
    'Never vent refrigerant to atmosphere',
    'Store cylinders upright in cool, ventilated area',
    'Check for leaks before and after charging',
    'Document all refrigerant additions and recoveries'
  ]
};

// Installation Steps
const INSTALLATION_STEPS = [
  { phase: 'Site Survey', tasks: ['Assess room layout and dimensions', 'Identify power supply location', 'Plan indoor and outdoor unit positions', 'Check pipe run distances', 'Identify drainage route', 'Verify electrical capacity'], time: '1-2 hours', icon: '📋' },
  { phase: 'Indoor Unit Installation', tasks: ['Mark and drill mounting holes', 'Install mounting bracket (level)', 'Cut wall penetration (83mm)', 'Mount indoor unit', 'Route drain pipe (with slope)', 'Connect control wiring'], time: '1-2 hours', icon: '🔧' },
  { phase: 'Outdoor Unit Installation', tasks: ['Prepare mounting location', 'Install mounting brackets/pad', 'Position outdoor unit', 'Ensure adequate clearances', 'Plan piping route'], time: '1 hour', icon: '⚡' },
  { phase: 'Piping Installation', tasks: ['Measure and cut copper pipes', 'Flare pipe ends properly', 'Connect refrigerant lines', 'Insulate suction line', 'Install pipe support clips', 'Seal wall penetration'], time: '2-3 hours', icon: '🔩' },
  { phase: 'Electrical Connection', tasks: ['Install dedicated circuit breaker', 'Run power cable to outdoor unit', 'Connect unit terminals', 'Verify correct voltage', 'Test earthing continuity'], time: '1-2 hours', icon: '⚡' },
  { phase: 'Vacuum & Charge', tasks: ['Pressure test with nitrogen', 'Connect vacuum pump', 'Evacuate system (<500 micron)', 'Hold vacuum for 30 min', 'Release factory charge', 'Top up if pipe length requires'], time: '1-2 hours', icon: '🧪' },
  { phase: 'Commissioning', tasks: ['Power on system', 'Run in cooling mode', 'Check superheat/subcooling', 'Verify airflow', 'Check drainage', 'Test remote control', 'Document installation'], time: '30-60 min', icon: '✅' },
];

// Maintenance Schedule
const MAINTENANCE_SCHEDULE = [
  { interval: 'Weekly (User)', tasks: ['Check filter condition', 'Verify cooling performance', 'Listen for unusual sounds', 'Check for water leaks', 'Clean remote control'], responsible: 'User/Operator', tools: 'Visual inspection' },
  { interval: 'Monthly', tasks: ['Clean or replace air filters', 'Check drain line flow', 'Wipe indoor unit exterior', 'Clear debris from outdoor unit', 'Test all modes'], responsible: 'User/Technician', tools: 'Filter, cloth, water' },
  { interval: 'Quarterly', tasks: ['Clean evaporator coil', 'Clean condenser coil', 'Check refrigerant pressures', 'Check electrical connections', 'Lubricate fan motors', 'Test safety controls'], responsible: 'Technician', tools: 'Coil cleaner, gauges, multimeter' },
  { interval: 'Semi-Annual', tasks: ['Deep clean all coils', 'Chemical wash if needed', 'Check compressor amp draw', 'Verify superheat/subcooling', 'Inspect insulation', 'Calibrate thermostat', 'Check drainage system'], responsible: 'Technician', tools: 'Professional cleaning equipment' },
  { interval: 'Annual', tasks: ['Full system inspection', 'Check refrigerant charge', 'Electrical safety test', 'Assess overall condition', 'Recommend repairs/upgrades', 'Update maintenance log'], responsible: 'Senior Technician', tools: 'Complete toolkit' },
];

// Fault Database
const FAULT_DATABASE = [
  { fault: 'AC not cooling adequately', causes: ['Dirty filter', 'Low refrigerant', 'Dirty coils', 'Undersized unit', 'Compressor issue', 'Airflow restriction'], diagnostics: ['Check filter', 'Check coil condition', 'Measure pressures', 'Check airflow'], solution: 'Clean/replace filter, clean coils, check and top up refrigerant if needed, verify proper sizing.', urgency: 'medium' },
  { fault: 'AC not turning on', causes: ['Power supply issue', 'Breaker tripped', 'Capacitor failed', 'Compressor overload', 'Control board fault', 'Thermostat issue'], diagnostics: ['Check power', 'Check breaker', 'Test capacitor', 'Check error codes'], solution: 'Reset breaker, replace capacitor if failed, check error codes and address specific fault.', urgency: 'high' },
  { fault: 'Water dripping from indoor unit', causes: ['Clogged drain line', 'Dirty evaporator', 'Tilted unit', 'Frozen coil thawing', 'Drain pan cracked'], diagnostics: ['Check drain flow', 'Inspect drain pan', 'Check unit level', 'Inspect coil'], solution: 'Clear drain blockage, clean drain line with vacuum/pressure, level unit, fix drain pan.', urgency: 'medium' },
  { fault: 'Ice forming on evaporator coil', causes: ['Low refrigerant', 'Dirty filter', 'Blocked coil', 'Fan not running', 'Low outdoor temperature'], diagnostics: ['Check filter', 'Check fan operation', 'Measure pressures'], solution: 'Clean filter, verify fan operation, check refrigerant charge, do not run below minimum outdoor temp.', urgency: 'high' },
  { fault: 'AC making unusual noise', causes: ['Loose parts', 'Fan blade hitting', 'Compressor failing', 'Refrigerant issues', 'Debris in unit'], diagnostics: ['Identify noise location', 'Check fan clearance', 'Listen to compressor'], solution: 'Tighten loose parts, clear obstructions, check fan alignment. Compressor noise may indicate failure.', urgency: 'medium' },
  { fault: 'Compressor not starting', causes: ['Capacitor failed', 'Overload tripped', 'Winding open', 'Locked rotor', 'Low voltage', 'Control fault'], diagnostics: ['Test capacitor', 'Check overload reset', 'Measure windings', 'Check voltage'], solution: 'Replace capacitor, reset overload. If windings open or shorted, compressor replacement required.', urgency: 'high' },
  { fault: 'High electricity bills', causes: ['Dirty system', 'Low refrigerant', 'Oversized unit', 'Old inefficient unit', 'Thermostat issues', 'Air leaks in room'], diagnostics: ['Check system efficiency', 'Compare to rated consumption', 'Audit usage patterns'], solution: 'Service system, check refrigerant, seal room leaks, consider upgrading to inverter system.', urgency: 'low' },
  { fault: 'Bad smell from AC', causes: ['Mold in drain pan', 'Dirty evaporator', 'Dead animal/insect', 'Cigarette smoke absorbed'], diagnostics: ['Inspect drain pan', 'Check evaporator', 'Check for blockages'], solution: 'Deep clean evaporator and drain pan with antimicrobial treatment, replace filter.', urgency: 'medium' },
];

// Pricing
const AC_PRICING = [
  { capacity: '9,000 BTU (0.75T)', type: 'Split Non-Inverter', brand: 'Entry', supplyPrice: 'KES 35,000 - 45,000', installPrice: 'KES 8,000 - 12,000', maintenance: 'KES 3,000/visit' },
  { capacity: '12,000 BTU (1T)', type: 'Split Non-Inverter', brand: 'Entry', supplyPrice: 'KES 40,000 - 55,000', installPrice: 'KES 10,000 - 15,000', maintenance: 'KES 3,500/visit' },
  { capacity: '12,000 BTU (1T)', type: 'Split Inverter', brand: 'Premium', supplyPrice: 'KES 65,000 - 95,000', installPrice: 'KES 10,000 - 15,000', maintenance: 'KES 4,000/visit' },
  { capacity: '18,000 BTU (1.5T)', type: 'Split Inverter', brand: 'Premium', supplyPrice: 'KES 85,000 - 130,000', installPrice: 'KES 12,000 - 18,000', maintenance: 'KES 4,500/visit' },
  { capacity: '24,000 BTU (2T)', type: 'Split Inverter', brand: 'Premium', supplyPrice: 'KES 110,000 - 170,000', installPrice: 'KES 15,000 - 22,000', maintenance: 'KES 5,000/visit' },
  { capacity: '24,000 BTU (2T)', type: 'Cassette', brand: 'Standard', supplyPrice: 'KES 150,000 - 220,000', installPrice: 'KES 25,000 - 40,000', maintenance: 'KES 6,000/visit' },
  { capacity: '36,000 BTU (3T)', type: 'Split Inverter', brand: 'Premium', supplyPrice: 'KES 160,000 - 250,000', installPrice: 'KES 20,000 - 30,000', maintenance: 'KES 6,000/visit' },
  { capacity: '48,000 BTU (4T)', type: 'Cassette', brand: 'Standard', supplyPrice: 'KES 280,000 - 400,000', installPrice: 'KES 40,000 - 60,000', maintenance: 'KES 8,000/visit' },
  { capacity: '60,000 BTU (5T)', type: 'Floor Standing', brand: 'Standard', supplyPrice: 'KES 300,000 - 450,000', installPrice: 'KES 35,000 - 50,000', maintenance: 'KES 8,000/visit' },
  { capacity: 'Custom', type: 'Ducted System', brand: 'Premium', supplyPrice: 'KES 400,000 - 2,000,000', installPrice: 'KES 100,000 - 500,000', maintenance: 'Custom quote' },
  { capacity: 'Custom', type: 'VRF System', brand: 'Premium', supplyPrice: 'KES 1,500,000+', installPrice: 'KES 500,000+', maintenance: 'AMC contract' },
];

// Warranty Info
const WARRANTY_INFO = {
  standard: { duration: '12 Months', coverage: ['Installation workmanship', 'Refrigerant leaks (installation related)', 'Electrical connections', 'Parts replaced during repair'], conditions: ['Professional installation', 'Regular maintenance', 'No unauthorized modifications'] },
  equipment: { duration: '1-5 Years (Brand)', coverage: ['Compressor (typically 5 years)', 'Other components (1-2 years)', 'Manufacturing defects'], conditions: ['Authorized installer', 'Registration required', 'Proof of purchase'] },
  extended: { duration: '24-36 Months', coverage: ['All standard coverage', 'Annual maintenance included', 'Priority response', 'Parts and labor'], conditions: ['AMC contract active', 'Regular scheduled service', 'Genuine parts only'] },
  exclusions: ['Damage from voltage issues', 'Unauthorized repairs', 'Cosmetic damage', 'Acts of nature', 'Consumables (filters)', 'Improper use']
};

export default function ACPage() {
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
          <Image src="/images/8.png" alt="Air Conditioning Systems" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(0, 180, 255, 0.3) 0%, rgba(0, 100, 200, 0.25) 100%)' }} />
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)' }} />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        <motion.div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6" style={{ opacity: heroOpacity, y: textY }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="max-w-5xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">Climate Control Experts</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">Air Conditioning</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">Solutions</span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed">
              Complete AC solutions. Split, Cassette, VRF, Ducted, Chillers. Installation, maintenance, repairs. All major brands. 12-24 months warranty.
            </motion.p>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 1 }} className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 flex flex-wrap gap-4 justify-center">
              <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=AC%20Inquiry" label="WhatsApp Quote" />
              <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" label="Call Now" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {TABS.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{tab.label}</button>))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">Complete Guide to Air Conditioning</h2><p className="text-gray-400 max-w-3xl mx-auto">Everything you need to know about AC systems, sizing, and maintenance.</p></div>
              <div className="grid gap-8">
                {AC_OVERVIEW.map((section, index) => (<motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-cyan-500/20"><h3 className="text-xl font-bold text-cyan-400 mb-4">{section.title}</h3><p className="text-gray-300 leading-relaxed">{section.content}</p></motion.div>))}
              </div>
            </motion.div>
          )}

          {activeTab === 'types' && (
            <motion.div key="types" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">Types of AC Systems</h2><p className="text-gray-400 max-w-3xl mx-auto">Complete range from residential splits to commercial chillers.</p></div>
              <div className="space-y-6">
                {AC_TYPES.map((ac) => (
                  <div key={ac.type} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-blue-500/30 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex justify-between items-start flex-wrap gap-4"><div><h3 className="text-xl font-bold text-blue-400 mb-2">{ac.type}</h3><span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">{ac.capacity}</span></div><div className="text-right"><p className="text-green-400 font-bold">{ac.priceRange}</p><p className="text-gray-500 text-sm">{ac.efficiency}</p></div></div>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                      <div><h4 className="text-green-400 text-sm font-bold mb-2">Advantages</h4><div className="flex flex-wrap gap-2">{ac.advantages.map((adv, i) => (<span key={i} className="px-2 py-1 bg-green-500/10 text-green-300 text-xs rounded">{adv}</span>))}</div></div>
                      <div><h4 className="text-amber-400 text-sm font-bold mb-2">Applications</h4><div className="flex flex-wrap gap-2">{ac.applications.map((app, i) => (<span key={i} className="px-2 py-1 bg-amber-500/10 text-amber-300 text-xs rounded">{app}</span>))}</div></div>
                    </div>
                    <div className="p-6 border-t border-white/10 bg-white/5"><p className="text-gray-400 text-sm"><span className="text-white font-medium">Brands:</span> {ac.brands.join(', ')}</p></div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div key="components" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">AC Components</h2><p className="text-gray-400 max-w-3xl mx-auto">Detailed breakdown of all major AC components.</p></div>
              <div className="space-y-4">
                {AC_COMPONENTS.map((comp) => (
                  <div key={comp.name} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden">
                    <button onClick={() => setExpandedComponent(expandedComponent === comp.name ? null : comp.name)} className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5"><div><h3 className="text-lg font-bold text-white">{comp.name}</h3><p className="text-gray-400 text-sm mt-1">{comp.function}</p></div><span className={`text-cyan-400 transition-transform ${expandedComponent === comp.name ? 'rotate-180' : ''}`}>▼</span></button>
                    <AnimatePresence>
                      {expandedComponent === comp.name && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/10">
                          <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div><h4 className="text-cyan-400 font-bold mb-2">Description</h4><p className="text-gray-300 text-sm mb-4">{comp.description}</p><h4 className="text-green-400 font-bold mb-2">Maintenance</h4><ul className="space-y-1">{comp.maintenance.map((tip, i) => (<li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-green-400">•</span>{tip}</li>))}</ul></div>
                            <div className="bg-black/30 rounded-lg p-4"><h4 className="text-amber-400 font-bold mb-2">Diagram</h4><pre className="text-cyan-400 text-xs font-mono whitespace-pre overflow-x-auto">{comp.diagram}</pre></div>
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
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">BTU Sizing Guide</h2><p className="text-gray-400 max-w-3xl mx-auto">Calculate the right AC size for your space.</p></div>
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-6">Basic BTU Chart</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm"><thead><tr className="text-left border-b border-white/20"><th className="py-3 px-4 text-gray-400">Room Area</th><th className="py-3 px-4 text-gray-400">BTU Required</th><th className="py-3 px-4 text-gray-400">Tons</th><th className="py-3 px-4 text-gray-400">Typical Room</th></tr></thead><tbody>{BTU_SIZING.basicTable.map((row) => (<tr key={row.area} className="border-b border-white/10 hover:bg-white/5"><td className="py-3 px-4 text-white font-bold">{row.area}</td><td className="py-3 px-4 text-purple-400">{row.btu}</td><td className="py-3 px-4 text-cyan-400">{row.tons}</td><td className="py-3 px-4 text-gray-300">{row.room}</td></tr>))}</tbody></table>
                </div>
              </div>
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border border-amber-500/30">
                <h3 className="text-2xl font-bold text-amber-400 mb-6">Adjustment Factors</h3>
                <div className="grid md:grid-cols-2 gap-4">{BTU_SIZING.adjustmentFactors.map((f) => (<div key={f.factor} className="flex justify-between items-center bg-white/5 rounded-lg p-4"><span className="text-gray-300">{f.factor}</span><span className="text-amber-400 font-bold">{f.adjustment}</span></div>))}</div>
              </div>
            </motion.div>
          )}

          {activeTab === 'refrigerants' && (
            <motion.div key="refrigerants" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">Refrigerant Guide</h2><p className="text-gray-400 max-w-3xl mx-auto">Understanding AC refrigerants and environmental impact.</p></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="text-left bg-gray-800/50"><th className="py-4 px-4 text-gray-400 rounded-tl-lg">Refrigerant</th><th className="py-4 px-4 text-gray-400">GWP</th><th className="py-4 px-4 text-gray-400">ODP</th><th className="py-4 px-4 text-gray-400">Status</th><th className="py-4 px-4 text-gray-400">Notes</th><th className="py-4 px-4 text-gray-400 rounded-tr-lg">Replacement</th></tr></thead><tbody>{REFRIGERANT_INFO.types.map((ref, index) => (<tr key={ref.name} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}><td className="py-4 px-4 text-white font-bold">{ref.name}</td><td className="py-4 px-4 text-red-400">{ref.gwp}</td><td className="py-4 px-4 text-gray-300">{ref.odp}</td><td className={`py-4 px-4 ${ref.status.includes('PHASED') ? 'text-red-400' : ref.status.includes('CURRENT') ? 'text-green-400' : 'text-amber-400'}`}>{ref.status}</td><td className="py-4 px-4 text-gray-400 text-xs">{ref.notes}</td><td className="py-4 px-4 text-cyan-400">{ref.replacement}</td></tr>))}</tbody></table>
              </div>
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-8 border border-green-500/30">
                <h3 className="text-xl font-bold text-green-400 mb-4">Refrigerant Handling Best Practices</h3>
                <ul className="grid md:grid-cols-2 gap-3">{REFRIGERANT_INFO.handling.map((item, i) => (<li key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{item}</li>))}</ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'installation' && (
            <motion.div key="installation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">AC Installation Process</h2><p className="text-gray-400 max-w-3xl mx-auto">Professional installation ensures optimal performance.</p></div>
              <div className="relative"><div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-green-500" /><div className="space-y-6">{INSTALLATION_STEPS.map((step, index) => (<motion.div key={step.phase} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="relative pl-20"><div className="absolute left-4 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-lg">{step.icon}</div><div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-cyan-500/30 p-6"><div className="flex justify-between items-start mb-4"><h3 className="text-lg font-bold text-white">{step.phase}</h3><span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-full">{step.time}</span></div><div className="grid md:grid-cols-2 gap-2">{step.tasks.map((task, i) => (<div key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{task}</div>))}</div></div></motion.div>))}</div></div>
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">AC Maintenance Schedule</h2><p className="text-gray-400 max-w-3xl mx-auto">Regular maintenance ensures efficiency and longevity.</p></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{MAINTENANCE_SCHEDULE.map((schedule) => (<div key={schedule.interval} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-teal-500/30 p-6"><h3 className="text-xl font-bold text-teal-400 mb-2">{schedule.interval}</h3><p className="text-gray-500 text-sm mb-4">By: {schedule.responsible}</p><ul className="space-y-2 mb-4">{schedule.tasks.map((task, i) => (<li key={i} className="flex items-start gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{task}</li>))}</ul><p className="text-gray-500 text-xs border-t border-white/10 pt-4">Tools: {schedule.tools}</p></div>))}</div>
            </motion.div>
          )}

          {activeTab === 'faults' && (
            <motion.div key="faults" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">AC Troubleshooting Guide</h2><p className="text-gray-400 max-w-3xl mx-auto">Diagnose and solve common AC problems.</p></div>
              <div className="space-y-4">{FAULT_DATABASE.map((fault) => (<div key={fault.fault} className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border ${fault.urgency === 'high' ? 'border-red-500/30' : fault.urgency === 'medium' ? 'border-amber-500/30' : 'border-blue-500/30'} overflow-hidden`}><button onClick={() => setExpandedFault(expandedFault === fault.fault ? null : fault.fault)} className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5"><div className="flex items-center gap-4"><span className={`px-2 py-1 text-xs rounded ${fault.urgency === 'high' ? 'bg-red-500/20 text-red-400' : fault.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{fault.urgency.toUpperCase()}</span><span className="text-white font-medium">{fault.fault}</span></div><span className="text-gray-400">▼</span></button><AnimatePresence>{expandedFault === fault.fault && (<motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-white/10 overflow-hidden"><div className="p-6 space-y-4"><div><h4 className="text-amber-400 font-bold mb-2">Possible Causes</h4><div className="flex flex-wrap gap-2">{fault.causes.map((c, i) => (<span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{c}</span>))}</div></div><div><h4 className="text-blue-400 font-bold mb-2">Diagnostics</h4><ul className="space-y-1">{fault.diagnostics.map((d, i) => (<li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-blue-400">•</span>{d}</li>))}</ul></div><div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"><h4 className="text-green-400 font-bold mb-2">Solution</h4><p className="text-gray-300 text-sm">{fault.solution}</p></div></div></motion.div>)}</AnimatePresence></div>))}</div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">AC Pricing Guide</h2><p className="text-gray-400 max-w-3xl mx-auto">Estimated prices for AC supply, installation, and maintenance.</p></div>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left bg-gray-800/50"><th className="py-4 px-4 text-gray-400 rounded-tl-lg">Capacity</th><th className="py-4 px-4 text-gray-400">Type</th><th className="py-4 px-4 text-gray-400">Brand</th><th className="py-4 px-4 text-gray-400">Supply Price</th><th className="py-4 px-4 text-gray-400">Installation</th><th className="py-4 px-4 text-gray-400 rounded-tr-lg">Maintenance</th></tr></thead><tbody>{AC_PRICING.map((row, index) => (<tr key={index} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}><td className="py-4 px-4 text-white font-bold">{row.capacity}</td><td className="py-4 px-4 text-cyan-400">{row.type}</td><td className="py-4 px-4 text-gray-300">{row.brand}</td><td className="py-4 px-4 text-green-400">{row.supplyPrice}</td><td className="py-4 px-4 text-amber-400">{row.installPrice}</td><td className="py-4 px-4 text-gray-400">{row.maintenance}</td></tr>))}</tbody></table></div>
            </motion.div>
          )}

          {activeTab === 'warranty' && (
            <motion.div key="warranty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-4">Warranty Information</h2><p className="text-gray-400 max-w-3xl mx-auto">Comprehensive warranty coverage for your AC investment.</p></div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-indigo-500/30 p-8"><div className="text-center mb-6"><h3 className="text-xl font-bold text-indigo-400 mb-2">Installation Warranty</h3><p className="text-3xl font-bold text-white">{WARRANTY_INFO.standard.duration}</p></div><h4 className="text-gray-400 text-sm mb-3">Coverage:</h4><ul className="space-y-2">{WARRANTY_INFO.standard.coverage.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{item}</li>))}</ul></div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-blue-500/30 p-8"><div className="text-center mb-6"><h3 className="text-xl font-bold text-blue-400 mb-2">Equipment Warranty</h3><p className="text-3xl font-bold text-white">{WARRANTY_INFO.equipment.duration}</p></div><h4 className="text-gray-400 text-sm mb-3">Coverage:</h4><ul className="space-y-2">{WARRANTY_INFO.equipment.coverage.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{item}</li>))}</ul></div>
                <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-500/30 p-8"><div className="text-center mb-6"><span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">AMC</span><h3 className="text-xl font-bold text-emerald-400 mt-4 mb-2">Extended Coverage</h3><p className="text-3xl font-bold text-white">{WARRANTY_INFO.extended.duration}</p></div><h4 className="text-gray-400 text-sm mb-3">Coverage:</h4><ul className="space-y-2">{WARRANTY_INFO.extended.coverage.map((item, i) => (<li key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-green-400">✓</span>{item}</li>))}</ul></div>
              </div>
              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/30"><h3 className="text-xl font-bold text-red-400 mb-4">Warranty Exclusions</h3><div className="grid md:grid-cols-2 gap-4">{WARRANTY_INFO.exclusions.map((item, i) => (<div key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span className="text-red-400">✗</span>{item}</div>))}</div></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-3xl p-8 md:p-12 border border-cyan-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need AC Solutions?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Professional AC supply, installation, and maintenance. All types and sizes. All major brands. 12-24 months warranty.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="custom" href="https://wa.me/254722274914?text=AC%20Quote%20Request" size="lg" label="Get Free Quote" />
            <UnifiedCTA action="custom" href="tel:+254722274914" variant="secondary" size="lg" label="Call Us Now" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Request Site Survey" />
          </div>
        </div>
      </section>
    </main>
  );
}
