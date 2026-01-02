'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLead from "../../components/generators/SectionLead";
import UnifiedCTA from "@/components/cta/UnifiedCTA";
import Link from 'next/link';

// =====================================================
// COMPREHENSIVE DIESEL GENERATOR SOLUTIONS HUB
// The most detailed generator troubleshooting guide in East Africa
// =====================================================

const SOLUTION_CATEGORIES = [
  { id: 'installation', label: '🔧 Installation', color: 'amber' },
  { id: 'maintenance', label: '🛠️ Maintenance', color: 'green' },
  { id: 'faults', label: '⚠️ Faults &amp; Solutions', color: 'red' },
  { id: 'repairs', label: '🔩 Repairs', color: 'blue' },
  { id: 'controls', label: '🎛️ Control Systems', color: 'purple' },
];

// INSTALLATION GUIDES
const INSTALLATION_GUIDES = [
  {
    title: 'Site Preparation &amp; Foundation',
    icon: '🏗️',
    steps: [
      { step: 'Survey the installation site for proper ventilation (minimum 1.5m clearance all sides)', critical: true },
      { step: 'Calculate foundation requirements: Mass = 2× Generator weight minimum', critical: true },
      { step: 'Ensure concrete curing time: 28 days for full strength, 7 days minimum', critical: false },
      { step: 'Install anti-vibration mounts (AVM) - spring or rubber isolators based on RPM', critical: true },
      { step: 'Verify floor load capacity: Typically 500-1500 kg/m² for generators', critical: false },
      { step: 'Plan exhaust routing: Maximum 3 bends, proper rain cap, thermal expansion allowance', critical: true },
    ],
    proTip: 'Foundation mass should be 2-5× the generator weight. For 500kVA (3,500kg), foundation should be 7,000-17,500kg concrete.',
  },
  {
    title: 'Electrical Connections',
    icon: '⚡',
    steps: [
      { step: 'Size cables using IEE regulations: I = P/(√3 × V × PF × Eff) for 3-phase', critical: true },
      { step: 'Install properly rated circuit breakers: MCCB at generator, ACB at main panel', critical: true },
      { step: 'Connect neutral-earth bond at ONE point only (generator or main panel)', critical: true },
      { step: 'Verify phase sequence (R-Y-B) using phase rotation meter before paralleling', critical: true },
      { step: 'Install surge protection devices (SPD) Type 1+2 at generator output', critical: false },
      { step: 'Test insulation resistance: &gt;1MΩ @ 500V DC for LV, &gt;100MΩ for MV', critical: true },
    ],
    proTip: 'Cable sizing formula: Cross-section (mm²) = (1.732 × I × L × ρ) / (ΔV × 1000) where ρ=0.0175 for copper.',
  },
  {
    title: 'Fuel System Installation',
    icon: '⛽',
    steps: [
      { step: 'Install day tank within 3m of generator, main tank within 30m maximum', critical: false },
      { step: 'Size fuel lines: Minimum 10mm ID for up to 100kVA, 15mm for up to 500kVA', critical: true },
      { step: 'Install fuel water separator and primary filter before engine fuel filter', critical: true },
      { step: 'Ensure return line is larger than supply (prevents vapor lock)', critical: true },
      { step: 'Install emergency fuel shutoff valve accessible from outside generator room', critical: true },
      { step: 'Test fuel system: Prime, check for leaks, verify fuel lift pump pressure (2-5 PSI)', critical: true },
    ],
    proTip: 'Fuel consumption estimate: 0.25-0.30 liters per kWh. A 200kVA @ 80% load ≈ 40 liters/hour.',
  },
  {
    title: 'Cooling System Setup',
    icon: '❄️',
    steps: [
      { step: 'Calculate radiator airflow: Minimum 8-12 m³/min per 100kW for air-cooled', critical: true },
      { step: 'Install remote radiator if needed: Max head 15m, use glycol mix 30-50%', critical: false },
      { step: 'Size ventilation openings: Intake = 0.5 × radiator area, Exhaust = 1.5 × radiator area', critical: true },
      { step: 'Install motorized louvers with generator start interlock', critical: false },
      { step: 'Fill coolant: 50% water + 50% ethylene glycol, add DCA4 additive', critical: true },
      { step: 'Pressure test cooling system: 1.0-1.4 bar, check for leaks', critical: true },
    ],
    proTip: 'Room temperature should stay below 40°C. Calculate: Heat rejection (kW) = Rated Power × 0.3 for cooling needs.',
  },
  {
    title: 'Exhaust System Installation',
    icon: '💨',
    steps: [
      { step: 'Size exhaust pipe: Minimum equal to engine exhaust outlet, larger for long runs', critical: true },
      { step: 'Install flexible connector at engine to absorb vibration (stainless bellows)', critical: true },
      { step: 'Support exhaust every 1.5-2m, allow for thermal expansion (10mm per 3m)', critical: true },
      { step: 'Maintain maximum backpressure: 3-4 kPa for naturally aspirated, 6-7 kPa for turbo', critical: true },
      { step: 'Install rain cap and spark arrestor (required for enclosed areas)', critical: false },
      { step: 'Wrap exhaust with insulation in occupied areas (surface temp &lt;60°C)', critical: false },
    ],
    proTip: 'Excessive backpressure causes: Power loss (1% per 0.25 kPa over limit), increased fuel consumption, engine damage.',
  },
  {
    title: 'Control Panel &amp; ATS Installation',
    icon: '🎛️',
    steps: [
      { step: 'Mount control panel at eye level, protected from vibration and moisture', critical: false },
      { step: 'Wire all sensors: Oil pressure, water temp, fuel level, battery voltage, RPM pickup', critical: true },
      { step: 'Configure ATS: Mains fail delay 5-10s, transfer time &lt;100ms, retransfer delay 5-30min', critical: true },
      { step: 'Set protection parameters: Overspeed 110%, undervoltage 85%, overcurrent 110%', critical: true },
      { step: 'Test emergency stop circuit: Must stop engine and disable start', critical: true },
      { step: 'Commission remote monitoring if required: GSM, Ethernet, Modbus', critical: false },
    ],
    proTip: 'DeepSea &amp; PowerWizard controllers: Always backup configuration before commissioning. Use PC software for parameter changes.',
  },
];

// MAINTENANCE SCHEDULES
const MAINTENANCE_SCHEDULES = [
  {
    interval: 'Daily Checks',
    icon: '📋',
    color: 'green',
    tasks: [
      { task: 'Check engine oil level (between L and H marks when cold)', time: '2 min' },
      { task: 'Inspect coolant level in expansion tank (should be visible)', time: '1 min' },
      { task: 'Verify fuel level - minimum 1/4 tank for standby units', time: '1 min' },
      { task: 'Check for leaks: Oil, fuel, coolant under and around generator', time: '3 min' },
      { task: 'Inspect battery terminals for corrosion, verify 12.6V+ (24V system: 25.2V+)', time: '2 min' },
      { task: 'Review control panel for active alarms or warning lights', time: '1 min' },
      { task: 'Check air filter restriction indicator (if equipped)', time: '1 min' },
    ],
    totalTime: '10-15 minutes',
  },
  {
    interval: 'Weekly Checks',
    icon: '📅',
    color: 'blue',
    tasks: [
      { task: 'Run generator for 30 minutes under 50%+ load (prevents wet stacking)', time: '30 min' },
      { task: 'Check belt tension: 10-15mm deflection with 10kg force', time: '3 min' },
      { task: 'Inspect exhaust system for leaks (white residue indicates leak)', time: '3 min' },
      { task: 'Test battery charger output: Float 13.6V, Boost 14.4V', time: '2 min' },
      { task: 'Check fuel water separator, drain if necessary', time: '3 min' },
      { task: 'Verify ATS operation: Simulate mains fail, confirm auto-start', time: '5 min' },
      { task: 'Log all meter readings: Hours, kWh, starts, last service', time: '2 min' },
    ],
    totalTime: '45-60 minutes',
  },
  {
    interval: '250 Hours / 6 Months',
    icon: '🔧',
    color: 'amber',
    tasks: [
      { task: 'Change engine oil (use OEM spec: 15W-40 CI-4 or CJ-4 typically)', time: '30 min' },
      { task: 'Replace oil filter', time: '10 min' },
      { task: 'Replace fuel filter(s) - primary and secondary', time: '20 min' },
      { task: 'Clean/replace air filter element', time: '15 min' },
      { task: 'Check and adjust valve clearances (if due per OEM)', time: '60 min' },
      { task: 'Inspect and clean battery terminals, apply dielectric grease', time: '10 min' },
      { task: 'Test coolant concentration and condition (refractometer)', time: '10 min' },
      { task: 'Check all hose clamps and connections', time: '15 min' },
    ],
    totalTime: '3-4 hours',
    parts: ['Engine oil (15-30L)', 'Oil filter', 'Fuel filters (2)', 'Air filter'],
  },
  {
    interval: '500 Hours / 12 Months',
    icon: '⚙️',
    color: 'orange',
    tasks: [
      { task: 'All 250-hour service items PLUS:', time: '-' },
      { task: 'Replace coolant and flush system', time: '60 min' },
      { task: 'Inspect alternator bearings and brushes (if applicable)', time: '30 min' },
      { task: 'Check injector spray pattern (requires specialized equipment)', time: '45 min' },
      { task: 'Test and calibrate protection relays', time: '30 min' },
      { task: 'Perform load bank test at 100% for 2 hours', time: '120 min' },
      { task: 'Inspect turbocharger for shaft play and oil leaks', time: '20 min' },
      { task: 'Test block heater operation', time: '10 min' },
    ],
    totalTime: '6-8 hours',
    parts: ['Coolant 50L', 'DCA4 additive', 'Belts', 'Thermostat (if needed)'],
  },
  {
    interval: '2000 Hours / 3 Years',
    icon: '🔩',
    color: 'red',
    tasks: [
      { task: 'Complete top-end overhaul assessment', time: '120 min' },
      { task: 'Replace all belts (fan, alternator, water pump)', time: '45 min' },
      { task: 'Replace water pump (preventive)', time: '90 min' },
      { task: 'Inspect/replace injectors', time: '120 min' },
      { task: 'Test compression across all cylinders (variation &lt;10%)', time: '60 min' },
      { task: 'Overhaul or replace starting motor and alternator', time: '120 min' },
      { task: 'Replace all coolant hoses', time: '60 min' },
      { task: 'Calibrate governor and fuel system', time: '60 min' },
      { task: 'Replace batteries (typical life 3-5 years)', time: '30 min' },
    ],
    totalTime: '2-3 days',
    parts: ['Major service kit', 'Batteries', 'Water pump', 'Injectors', 'Belts', 'Hoses'],
  },
];

// FAULTS AND SOLUTIONS DATABASE
const FAULTS_DATABASE = [
  {
    category: 'Starting Failures',
    icon: '🚫',
    faults: [
      {
        symptom: 'Engine cranks but does not start',
        possibleCauses: [
          'No fuel reaching injectors (air in fuel system)',
          'Fuel shutoff solenoid not energizing',
          'Glow plugs/intake heater not working (cold weather)',
          'Fuel filters clogged',
          'Low compression',
          'Incorrect timing',
        ],
        diagnosticSteps: [
          'Check fuel pressure at injector rail: Should be 2.5-4 bar (LP) or 200-2000 bar (HP)',
          'Verify fuel shutoff solenoid: 12V/24V at terminal when cranking',
          'Test glow plug resistance: 0.5-2Ω each, replace if open circuit',
          'Bleed fuel system at highest point (usually on filter housing)',
          'Perform compression test: Minimum 20 bar, max 10% variation',
        ],
        solution: 'Most common cause is air in fuel system after running out of fuel or filter change. Bleed system completely, check for suction leaks on fuel lines.',
        severity: 'high',
        estimatedRepairTime: '30 min - 4 hours',
      },
      {
        symptom: 'Engine does not crank (no rotation)',
        possibleCauses: [
          'Battery dead or discharged (&lt;10.5V)',
          'Starter motor failure',
          'Starter solenoid failure',
          'Emergency stop engaged',
          'Control system fault',
          'Seized engine (hydraulic lock)',
        ],
        diagnosticSteps: [
          'Check battery voltage: Should be &gt;12.6V (25.2V for 24V system)',
          'Test at starter solenoid: 12V/24V when key turned',
          'Bypass control system: Apply direct power to starter solenoid',
          'Check E-stop circuit: Should be closed (N/C contacts)',
          'Try to rotate engine manually (barring tool or breaker bar)',
        ],
        solution: 'If batteries are good but starter does not engage, check connections and starter solenoid. If engine is locked, DO NOT force - check for hydrostatic lock from coolant/fuel leak into cylinder.',
        severity: 'critical',
        estimatedRepairTime: '15 min - 8 hours',
      },
      {
        symptom: 'Engine starts but immediately stops',
        possibleCauses: [
          'Fuel starvation after initial burst',
          'Oil pressure not building (sensor or actual)',
          'Governor not stabilizing',
          'Control panel protection shutdown',
          'Exhaust backpressure too high',
        ],
        diagnosticSteps: [
          'Watch oil pressure gauge: Should reach 2 bar within 5 seconds',
          'Check control panel for fault codes',
          'Monitor fuel pressure during start sequence',
          'Check governor actuator movement',
          'Verify no debris in exhaust',
        ],
        solution: 'If oil pressure alarm, check oil level first. If level OK, oil pressure sensor may be faulty - verify with mechanical gauge. Fuel issues often relate to blocked filters or air leaks.',
        severity: 'high',
        estimatedRepairTime: '30 min - 2 hours',
      },
    ],
  },
  {
    category: 'Running Problems',
    icon: '⚡',
    faults: [
      {
        symptom: 'Engine hunting/surging (RPM unstable)',
        possibleCauses: [
          'Governor malfunction or misadjustment',
          'Fuel quality issues (water/contamination)',
          'Air in fuel system',
          'Speed sensor gap incorrect',
          'Load fluctuations affecting control',
          'Actuator sticking or failing',
        ],
        diagnosticSteps: [
          'Check speed sensor gap: 0.5-1.0mm from flywheel teeth',
          'Inspect fuel for water (clear bottle test)',
          'Monitor actuator position while hunting',
          'Check droop setting on controller (should be 3-5%)',
          'Verify no air leaks in fuel system',
        ],
        solution: 'Governor hunting is often caused by speed sensor gap or contaminated fuel. For electronic governors, check actuator linkage and controller parameters. For mechanical, adjust droop settings.',
        severity: 'medium',
        estimatedRepairTime: '30 min - 3 hours',
      },
      {
        symptom: 'Engine overheating (&gt;95°C)',
        possibleCauses: [
          'Low coolant level',
          'Thermostat stuck closed',
          'Radiator blocked (internal or external)',
          'Fan belt slipping or broken',
          'Water pump failure',
          'Head gasket failure',
          'Overloading',
        ],
        diagnosticSteps: [
          'Check coolant level when cold - should be visible in expansion tank',
          'Feel radiator: Top should be hot, bottom cooler (confirms flow)',
          'Check fan belt tension and condition',
          'Monitor load: Should not exceed 80% continuous',
          'Check for exhaust gas in coolant (block test kit)',
          'Infrared scan for hot spots',
        ],
        solution: 'Most overheating is caused by low coolant, dirty radiator, or failed thermostat. For repeated overheating, perform pressure test and check for head gasket failure (compression gases in coolant).',
        severity: 'critical',
        estimatedRepairTime: '30 min - 8 hours',
      },
      {
        symptom: 'Low/no power output (voltage issues)',
        possibleCauses: [
          'AVR (Automatic Voltage Regulator) failure',
          'Exciter winding damage',
          'Main rotor or stator winding issue',
          'Sensing circuit problem',
          'Diode failure in rotating rectifier',
          'Speed too low (under-frequency)',
        ],
        diagnosticSteps: [
          'Check output voltage: Should be 380-415V ±5%',
          'Check frequency: Should be 50Hz ±0.5%',
          'Measure excitation voltage at AVR output',
          'Test diodes in rotating rectifier',
          'Check sensing voltage to AVR',
          'Inspect brushes and slip rings (if applicable)',
        ],
        solution: 'No voltage output is usually AVR or excitation issue. Apply external DC to field (field flash) to test alternator. If voltage builds, AVR is suspect. If no response, check rotating rectifier diodes.',
        severity: 'high',
        estimatedRepairTime: '1-8 hours',
      },
      {
        symptom: 'Excessive black smoke',
        possibleCauses: [
          'Air filter blocked',
          'Overloading',
          'Injector problems (worn nozzles)',
          'Turbocharger issues',
          'Incorrect timing',
          'Low compression',
        ],
        diagnosticSteps: [
          'Check air filter restriction indicator',
          'Monitor actual load vs rated capacity',
          'Inspect turbo: Spin freely? Oil leaks?',
          'Check injector spray pattern',
          'Verify timing marks alignment',
        ],
        solution: 'Black smoke = too much fuel or not enough air. Start with air filter. If clean, check turbo boost pressure. Worn injectors cause poor atomization leading to incomplete combustion.',
        severity: 'medium',
        estimatedRepairTime: '30 min - 6 hours',
      },
      {
        symptom: 'Excessive white/blue smoke',
        possibleCauses: [
          'Cold engine (white smoke normal for first few minutes)',
          'Worn piston rings (blue smoke)',
          'Valve stem seal failure (blue smoke)',
          'Turbo seal failure (blue smoke)',
          'Head gasket leak (white smoke, sweet smell)',
          'Incorrect oil grade',
        ],
        diagnosticSteps: [
          'Note when smoke occurs: Start only? Under load? All the time?',
          'Check oil consumption rate',
          'Compression test all cylinders',
          'Check coolant level (dropping without visible leak = head gasket)',
          'Inspect turbo for oil in inlet/outlet',
        ],
        solution: 'Blue smoke = burning oil. White smoke = coolant/water. Blue smoke after sitting = valve seals. Blue smoke under load = rings/turbo. White smoke + coolant loss = head gasket.',
        severity: 'high',
        estimatedRepairTime: '2-24 hours',
      },
    ],
  },
  {
    category: 'Electrical &amp; Control Faults',
    icon: '🔌',
    faults: [
      {
        symptom: 'Frequency unstable or incorrect',
        possibleCauses: [
          'Governor malfunction',
          'Speed sensor failure',
          'Controller parameter incorrect',
          'Magnetic pickup gap wrong',
          'Load unbalance',
          'Engine mechanical issue',
        ],
        diagnosticSteps: [
          'Check frequency with calibrated meter: Should be 50.0Hz ±0.5Hz',
          'Verify speed sensor signal on scope',
          'Check controller speed setting and droop',
          'Monitor frequency under varying loads',
          'Check for cylinder imbalance (exhaust temp variation)',
        ],
        solution: 'Frequency = (RPM × Poles) / 120. For 50Hz 4-pole: 1500 RPM required. Adjust governor or controller speed setting. Check speed sensor if signal is noisy or missing.',
        severity: 'high',
        estimatedRepairTime: '30 min - 2 hours',
      },
      {
        symptom: 'Circuit breaker tripping',
        possibleCauses: [
          'Overload condition',
          'Short circuit in load',
          'Earth fault',
          'Breaker undersized',
          'Thermal overload from poor connection',
          'Inrush current from motor loads',
        ],
        diagnosticSteps: [
          'Check actual load vs breaker rating',
          'Measure current on all phases (should be balanced ±10%)',
          'Test earth leakage current (&lt;30mA for safety)',
          'Inspect breaker for signs of overheating',
          'Check connection torques',
        ],
        solution: 'If tripping on start, inrush current may be cause - consider soft starters or star-delta. If tripping under load, check for overloading or unbalanced loads. Thermal tripping indicates connection issues.',
        severity: 'medium',
        estimatedRepairTime: '30 min - 4 hours',
      },
      {
        symptom: 'Battery not charging',
        possibleCauses: [
          'Alternator/charger failure',
          'Belt slipping or broken',
          'Loose connections',
          'Battery sulfated (will not accept charge)',
          'Voltage regulator fault',
          'Blown fuse in charging circuit',
        ],
        diagnosticSteps: [
          'Check charging voltage: Should be 13.8-14.4V (27.6-28.8V for 24V)',
          'Check belt tension and condition',
          'Measure voltage drop across connections (&lt;0.5V)',
          'Test battery capacity (load test)',
          'Check charger output directly',
        ],
        solution: 'If engine-driven alternator: Check belt, voltage regulator, diodes. If standalone charger: Check output, connections, fuses. Batteries older than 5 years often cannot hold charge.',
        severity: 'medium',
        estimatedRepairTime: '30 min - 2 hours',
      },
    ],
  },
  {
    category: 'Fuel System Issues',
    icon: '⛽',
    faults: [
      {
        symptom: 'Hard starting after sitting',
        possibleCauses: [
          'Fuel system air leak (fuel drains back)',
          'Injector leak-back excessive',
          'Fuel lift pump failure',
          'Fuel heater not working (cold weather)',
        ],
        diagnosticSteps: [
          'Check if priming helps (if yes, fuel draining back)',
          'Inspect all fuel line connections',
          'Test fuel lift pump: Should prime within 20-30 seconds',
          'Measure injector leak-back (max 100ml/min total)',
        ],
        solution: 'Air entering system overnight usually indicates check valve failure in lift pump or leaking fitting. Pressurize system and check all connections with soapy water.',
        severity: 'medium',
        estimatedRepairTime: '1-4 hours',
      },
      {
        symptom: 'Fuel contamination (water/algae)',
        possibleCauses: [
          'Condensation in tank',
          'Poor fuel storage practices',
          'Tank vent allowing water ingress',
          'Biodiesel degradation',
        ],
        diagnosticSteps: [
          'Drain water from tank bottom (install drain if not present)',
          'Test fuel: Water content &lt;200ppm acceptable',
          'Check for algae growth (dark slime in filters)',
          'Inspect tank vent for proper function',
        ],
        solution: 'Drain tank completely if heavily contaminated. Install fuel polishing system for standby units. Add biocide treatment. Use fuel within 6 months for best quality.',
        severity: 'medium',
        estimatedRepairTime: '2-8 hours',
      },
    ],
  },
  {
    category: 'Mechanical Issues',
    icon: '🔩',
    faults: [
      {
        symptom: 'Abnormal engine noise (knocking)',
        possibleCauses: [
          'Low oil pressure/level',
          'Bearing failure (connecting rod, main)',
          'Piston slap',
          'Injector timing wrong',
          'Loose flywheel bolts',
          'Valve train issues',
        ],
        diagnosticSteps: [
          'STOP ENGINE if knock is loud or metallic',
          'Check oil level and pressure immediately',
          'Listen with stethoscope to isolate location',
          'Check for metal in oil filter',
          'Inspect flywheel bolt torque',
        ],
        solution: 'Heavy knocking = STOP IMMEDIATELY. Light knock may be timing or injector related. Always check oil first. Metal in filter indicates bearing failure - requires teardown.',
        severity: 'critical',
        estimatedRepairTime: '1-40 hours',
      },
      {
        symptom: 'Excessive vibration',
        possibleCauses: [
          'Loose engine mounts',
          'Misfiring cylinder',
          'Unbalanced alternator',
          'Coupling misalignment',
          'Loose flywheel',
          'Foundation issues',
        ],
        diagnosticSteps: [
          'Check all mounting bolt torques',
          'Monitor exhaust temperature per cylinder (should be ±30°C)',
          'Inspect coupling alignment',
          'Check foundation for cracks',
          'Vibration analysis if severe',
        ],
        solution: 'New vibration after running fine usually indicates mount failure or misfiring. Check all mounts and perform exhaust temperature analysis to identify misfiring cylinder.',
        severity: 'medium',
        estimatedRepairTime: '30 min - 4 hours',
      },
    ],
  },
];

// REPAIR PROCEDURES
const REPAIR_PROCEDURES = [
  {
    title: 'AVR Replacement',
    difficulty: 'Medium',
    time: '1-2 hours',
    tools: ['Multimeter', 'Insulated screwdrivers', 'Wire strippers', 'Electrical tape'],
    steps: [
      'Disconnect generator from load and stop engine',
      'Locate AVR - usually inside alternator terminal box or control panel',
      'Photograph all wire connections before disconnecting',
      'Disconnect sensing wires (from output), field wires (to rotor), and power supply',
      'Remove mounting screws and old AVR',
      'Install new AVR - ensure same model or compatible replacement',
      'Reconnect all wires per diagram - verify correct terminals',
      'Set voltage potentiometer to mid-range position',
      'Start generator on no-load, measure voltage',
      'Adjust voltage potentiometer to achieve 400-415V',
      'Apply load gradually, verify voltage stability',
    ],
    warnings: ['High voltage present - ensure generator is stopped', 'Incorrect wiring can damage AVR instantly', 'Use OEM or verified compatible replacement'],
  },
  {
    title: 'Injector Replacement',
    difficulty: 'High',
    time: '4-6 hours',
    tools: ['Injector puller', 'Torque wrench', 'New copper washers', 'Clean diesel', 'Injector test equipment'],
    steps: [
      'Clean around injectors to prevent debris entering engine',
      'Disconnect fuel return lines (mark for reassembly)',
      'Disconnect high-pressure fuel lines - use proper line wrench',
      'Remove injector hold-down clamps',
      'Use injector puller to remove injectors - do not pry',
      'Remove and discard old copper washers',
      'Clean injector seats in cylinder head',
      'Install new copper washers (one per injector)',
      'Install injectors - hand tight initially',
      'Torque hold-down clamps: 20-30 Nm typically (check OEM spec)',
      'Reconnect high-pressure lines: 25-35 Nm',
      'Reconnect return lines',
      'Bleed fuel system completely',
      'Start engine - check for leaks, proper operation',
    ],
    warnings: ['Cleanliness is critical - any debris can damage new injectors', 'Always use new copper washers', 'Over-torquing can crack injector bodies'],
  },
  {
    title: 'Water Pump Replacement',
    difficulty: 'Medium-High',
    time: '3-5 hours',
    tools: ['Socket set', 'Gasket scraper', 'Coolant drain pan', 'New gasket/O-ring', 'Torque wrench'],
    steps: [
      'Allow engine to cool completely',
      'Drain coolant from radiator and block',
      'Remove drive belts',
      'Remove water pump pulley (may need puller)',
      'Remove pump mounting bolts in sequence',
      'Carefully remove pump - note gasket orientation',
      'Clean all old gasket material from mounting surface',
      'Install new gasket/O-ring with sealant if required',
      'Install new pump - hand tight all bolts first',
      'Torque bolts in sequence: 15-25 Nm typically',
      'Reinstall pulley and belts - adjust tension',
      'Fill cooling system with correct coolant mix',
      'Bleed air from system',
      'Run engine, check for leaks, verify temperature',
    ],
    warnings: ['Never work on hot engine', 'Capture and properly dispose of old coolant', 'Ensure impeller rotation direction matches'],
  },
  {
    title: 'Turbocharger Inspection &amp; Replacement',
    difficulty: 'High',
    time: '4-8 hours',
    tools: ['Socket set', 'New gaskets', 'Clean oil', 'Dial indicator', 'Safety glasses'],
    steps: [
      'Allow turbo to cool - extremely hot after operation',
      'Remove air intake pipe - inspect compressor wheel',
      'Remove exhaust outlet pipe - inspect turbine wheel',
      'Check shaft play: Radial &lt;0.1mm, Axial &lt;0.15mm',
      'Inspect for oil leaks in compressor and turbine housings',
      'If replacement needed: Remove oil feed and drain lines',
      'Remove mounting bolts from exhaust manifold and air inlet',
      'Remove turbo assembly',
      'Install new turbo with new gaskets',
      'Pre-fill oil inlet with clean engine oil',
      'Connect oil feed and drain lines with new seals',
      'Connect exhaust and intake piping',
      'Before starting: Crank engine with fuel shutoff to prime oil',
      'Start engine and idle for 5 minutes - check for leaks',
    ],
    warnings: ['Turbo spins at 100,000+ RPM - any damage can cause catastrophic failure', 'Never run engine without oil supply to turbo', 'Let turbo cool before inspection'],
  },
  {
    title: 'Governor/Actuator Calibration',
    difficulty: 'Medium',
    time: '1-3 hours',
    tools: ['Digital tachometer', 'Controller software', 'Laptop', 'Communication cable'],
    steps: [
      'Connect to controller via software (DSE/PowerWizard)',
      'Download current configuration as backup',
      'Check speed sensor gap: 0.5-1.0mm',
      'With engine running no-load, adjust speed to 1500 RPM (50Hz)',
      'Set droop percentage: 3-5% for most applications',
      'Verify governor actuator full travel',
      'Apply 25%, 50%, 75%, 100% load steps',
      'Observe frequency recovery time (&lt;5 seconds)',
      'Adjust stability and gain parameters if hunting',
      'Test emergency stop response',
      'Save new configuration',
      'Document all parameter changes',
    ],
    warnings: ['Incorrect settings can cause overspeed condition', 'Always backup configuration first', 'Never disable protection circuits during testing'],
  },
];

export default function GeneratorsSolutionHub() {
  const [activeCategory, setActiveCategory] = useState('installation');
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const [expandedRepair, setExpandedRepair] = useState<string | null>(null);

  return (
    <main className="bg-black min-h-screen">
      <SectionLead
        title="Diesel Generator Solutions Hub"
        subtitle="The most comprehensive generator troubleshooting, installation, maintenance &amp; repair guide in East Africa. No one else provides this depth of technical knowledge."
      />

      {/* Category Navigation */}
      <section className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {SOLUTION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          {/* INSTALLATION SECTION */}
          {activeCategory === 'installation' && (
            <motion.div
              key="installation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Generator Installation Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Complete step-by-step installation procedures from site preparation to commissioning. 
                  Following these guidelines ensures safe, reliable operation and warranty compliance.
                </p>
              </div>

              {INSTALLATION_GUIDES.map((guide, idx) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-amber-500/20 overflow-hidden"
                >
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{guide.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{guide.title}</h3>
                        <p className="text-amber-400 text-sm">Step {idx + 1} of {INSTALLATION_GUIDES.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIdx) => (
                        <div 
                          key={stepIdx}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            step.critical ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.critical ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'
                          }`}>
                            {stepIdx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm">{step.step}</p>
                            {step.critical && (
                              <span className="text-red-400 text-xs mt-1 block">⚠️ Critical Step - Do not skip</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      <p className="text-amber-400 text-sm">
                        <strong>💡 Pro Tip:</strong> {guide.proTip}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* MAINTENANCE SECTION */}
          {activeCategory === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Maintenance Schedules &amp; Checklists</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Preventive maintenance is the key to generator reliability. Follow these OEM-based schedules 
                  to maximize lifespan and minimize unexpected failures.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MAINTENANCE_SCHEDULES.map((schedule, idx) => (
                  <motion.div
                    key={schedule.interval}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/20 overflow-hidden"
                  >
                    <div className={`p-4 border-b border-white/10 ${
                      schedule.color === 'green' ? 'bg-green-500/20' :
                      schedule.color === 'blue' ? 'bg-blue-500/20' :
                      schedule.color === 'amber' ? 'bg-amber-500/20' :
                      schedule.color === 'orange' ? 'bg-orange-500/20' :
                      'bg-red-500/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{schedule.icon}</span>
                        <span className={`font-bold ${
                          schedule.color === 'green' ? 'text-green-400' :
                          schedule.color === 'blue' ? 'text-blue-400' :
                          schedule.color === 'amber' ? 'text-amber-400' :
                          schedule.color === 'orange' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>{schedule.totalTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-2">{schedule.interval}</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {schedule.tasks.map((task, taskIdx) => (
                          <div key={taskIdx} className="flex items-start gap-2 text-sm">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <span className="text-gray-300 flex-1">{task.task}</span>
                            <span className="text-gray-500 text-xs">{task.time}</span>
                          </div>
                        ))}
                      </div>
                      {schedule.parts && (
                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                          <p className="text-gray-400 text-xs font-medium mb-2">Required Parts:</p>
                          <p className="text-gray-300 text-xs">{schedule.parts.join(' • ')}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Maintenance Tips */}
              <div className="mt-12 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-2xl p-8 border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-6">🔑 Key Maintenance Principles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🛢️</span>
                      <div>
                        <h4 className="text-white font-bold">Oil is Lifeblood</h4>
                        <p className="text-gray-400 text-sm">Check daily. Change religiously. Use correct grade only. Oil analysis can predict problems before failure.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⛽</span>
                      <div>
                        <h4 className="text-white font-bold">Fuel Quality Matters</h4>
                        <p className="text-gray-400 text-sm">Water is the enemy. Contaminated fuel causes 80% of injector failures. Test and polish regularly.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🌡️</span>
                      <div>
                        <h4 className="text-white font-bold">Temperature Control</h4>
                        <p className="text-gray-400 text-sm">Overheating causes 60% of engine failures. Check coolant, thermostat, and airflow regularly.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🔋</span>
                      <div>
                        <h4 className="text-white font-bold">Battery Reliability</h4>
                        <p className="text-gray-400 text-sm">Dead battery = generator won&apos;t start when you need it most. Test monthly, replace every 3-4 years.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* FAULTS & SOLUTIONS SECTION */}
          {activeCategory === 'faults' && (
            <motion.div
              key="faults"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Fault Diagnosis &amp; Solutions</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Systematic troubleshooting guides for every common generator problem. 
                  Click on any fault to see detailed diagnostic steps and solutions.
                </p>
              </div>

              {FAULTS_DATABASE.map((category) => (
                <div key={category.category} className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3 sticky top-20 bg-black py-4 z-40">
                    <span className="text-2xl">{category.icon}</span>
                    {category.category}
                  </h3>
                  
                  {category.faults.map((fault, faultIdx) => (
                    <motion.div
                      key={fault.symptom}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: faultIdx * 0.1 }}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFault(expandedFault === fault.symptom ? null : fault.symptom)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            fault.severity === 'critical' ? 'bg-red-500 text-white' :
                            fault.severity === 'high' ? 'bg-orange-500 text-white' :
                            'bg-yellow-500 text-black'
                          }`}>
                            {fault.severity.toUpperCase()}
                          </span>
                          <span className="text-white font-medium">{fault.symptom}</span>
                        </div>
                        <motion.span
                          animate={{ rotate: expandedFault === fault.symptom ? 180 : 0 }}
                          className="text-gray-400"
                        >
                          ▼
                        </motion.span>
                      </button>
                      
                      <AnimatePresence>
                        {expandedFault === fault.symptom && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/10"
                          >
                            <div className="p-6 space-y-6">
                              {/* Possible Causes */}
                              <div>
                                <h4 className="text-amber-400 font-bold mb-3">🔍 Possible Causes</h4>
                                <div className="grid md:grid-cols-2 gap-2">
                                  {fault.possibleCauses.map((cause, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                      <span className="text-amber-500">•</span>
                                      <span className="text-gray-300">{cause}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Diagnostic Steps */}
                              <div>
                                <h4 className="text-cyan-400 font-bold mb-3">🔧 Diagnostic Steps</h4>
                                <div className="space-y-2">
                                  {fault.diagnosticSteps.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                      </span>
                                      <span className="text-gray-300 text-sm">{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Solution */}
                              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <h4 className="text-green-400 font-bold mb-2">✅ Solution</h4>
                                <p className="text-gray-300 text-sm">{fault.solution}</p>
                              </div>

                              {/* Meta Info */}
                              <div className="flex items-center gap-6 text-sm text-gray-400">
                                <span>⏱️ Estimated repair time: <strong className="text-white">{fault.estimatedRepairTime}</strong></span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}

          {/* REPAIRS SECTION */}
          {activeCategory === 'repairs' && (
            <motion.div
              key="repairs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Repair Procedures</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  Step-by-step repair procedures for common generator components. 
                  These guides are written by our experienced technicians with decades of field experience.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {REPAIR_PROCEDURES.map((repair, idx) => (
                  <motion.div
                    key={repair.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-blue-500/20 overflow-hidden"
                  >
                    <div className="p-4 bg-blue-500/10 border-b border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">{repair.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            repair.difficulty === 'High' ? 'bg-red-500 text-white' :
                            repair.difficulty === 'Medium-High' ? 'bg-orange-500 text-white' :
                            'bg-yellow-500 text-black'
                          }`}>
                            {repair.difficulty}
                          </span>
                          <span className="text-gray-400 text-sm">⏱️ {repair.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <button
                        onClick={() => setExpandedRepair(expandedRepair === repair.title ? null : repair.title)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <span>Tools: {repair.tools.slice(0, 3).join(', ')}...</span>
                          <span className="text-blue-400">{expandedRepair === repair.title ? 'Hide steps ▲' : 'Show steps ▼'}</span>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedRepair === repair.title && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4"
                          >
                            {/* Tools */}
                            <div className="bg-white/5 rounded-lg p-3">
                              <p className="text-gray-400 text-xs font-medium mb-2">Required Tools:</p>
                              <div className="flex flex-wrap gap-2">
                                {repair.tools.map((tool, tidx) => (
                                  <span key={tidx} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{tool}</span>
                                ))}
                              </div>
                            </div>

                            {/* Steps */}
                            <div className="space-y-2">
                              {repair.steps.map((step, stepIdx) => (
                                <div key={stepIdx} className="flex items-start gap-3 text-sm">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                    {stepIdx + 1}
                                  </span>
                                  <span className="text-gray-300">{step}</span>
                                </div>
                              ))}
                            </div>

                            {/* Warnings */}
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                              <p className="text-red-400 text-xs font-bold mb-2">⚠️ Warnings:</p>
                              {repair.warnings.map((warning, widx) => (
                                <p key={widx} className="text-gray-300 text-xs">• {warning}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CONTROLS SECTION */}
          {activeCategory === 'controls' && (
            <motion.div
              key="controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Control Systems Guide</h2>
                <p className="text-gray-400 max-w-3xl mx-auto">
                  For comprehensive DeepSea and PowerWizard programming, configuration, and troubleshooting, 
                  visit our dedicated Controls Solutions Hub.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/solutions/controls" className="group">
                  <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl border border-purple-500/30 p-8 hover:border-purple-400 transition-all duration-300">
                    <span className="text-5xl block mb-4">🎛️</span>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">DeepSea &amp; PowerWizard</h3>
                    <p className="text-gray-400 mb-4">Complete configuration, fault codes, parameter settings, and communication setup for all DSE and PowerWizard controllers.</p>
                    <span className="text-purple-400 font-medium">Explore Control Systems →</span>
                  </div>
                </Link>
                
                <Link href="/solutions/diesel-automation" className="group">
                  <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-2xl border border-cyan-500/30 p-8 hover:border-cyan-400 transition-all duration-300">
                    <span className="text-5xl block mb-4">🤖</span>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Diesel Automation</h3>
                    <p className="text-gray-400 mb-4">AMF panels, auto-start systems, remote monitoring, load sharing, and synchronization configurations.</p>
                    <span className="text-cyan-400 font-medium">Explore Automation →</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-3xl p-8 md:p-12 border border-amber-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Expert Help?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Our team of certified generator technicians is available 24/7 for emergency repairs, 
            scheduled maintenance, and technical consultations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <UnifiedCTA action="contact" size="lg" label="Get Expert Help" />
            <UnifiedCTA action="site-survey" variant="secondary" size="lg" label="Schedule Site Visit" />
          </div>
        </div>
      </section>
    </main>
  );
}
