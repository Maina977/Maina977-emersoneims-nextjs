'use client';

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║   INTERACTIVE DIAGNOSTIC SYSTEM - Generator Oracle                            ║
 * ║   Copyright © 2024-2026 EmersonEIMS. All Rights Reserved.                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * Complete interactive diagnostic interfaces mimicking CAT ET, VODIA, Cummins INSITE
 * with clickable diagrams for all generator systems.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fuel,
  Thermometer,
  Zap,
  Settings,
  ToggleLeft,
  ChevronRight,
  ChevronDown,
  Info,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Wrench,
  Send,
  X,
  ArrowLeft,
  Search,
  BookOpen,
  Activity,
  Gauge,
  Battery,
  Fan,
  Droplets,
  Flame,
  CircuitBoard,
  Cable,
  Power,
  RotateCcw,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemComponent {
  id: string;
  name: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  description: string;
  function: string;
  symptoms: string[];
  troubleshooting: string[];
  partNumbers: { brand: string; partNo: string; price: string }[];
  tools: string[];
  specifications: { name: string; value: string }[];
  connections: string[];
  commonFaults: { fault: string; cause: string; solution: string }[];
  maintenanceInterval?: string;
  testProcedure?: string[];
}

interface DiagnosticSystem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  components: SystemComponent[];
  flowDescription: string;
  diagram: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE SYSTEM DATA
// ═══════════════════════════════════════════════════════════════════════════════

const DIAGNOSTIC_SYSTEMS: DiagnosticSystem[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FUEL SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'fuel',
    name: 'Fuel System',
    icon: <Fuel className="w-6 h-6" />,
    color: 'amber',
    description: 'Complete fuel delivery system from tank to combustion',
    flowDescription: 'Fuel flows: Tank → Primary Filter → Lift Pump → Secondary Filter → Injection Pump → High Pressure Lines → Injectors → Combustion Chamber. Return fuel goes back to tank.',
    diagram: 'fuel-system',
    components: [
      {
        id: 'fuel-tank',
        name: 'Fuel Tank',
        icon: <Droplets className="w-5 h-5" />,
        position: { x: 5, y: 40 },
        size: { width: 12, height: 20 },
        description: 'Stores diesel fuel for the engine. Includes pickup tube, return line connection, vent, and level sender.',
        function: 'Fuel storage and supply reservoir. Must be properly vented to prevent vacuum during fuel draw.',
        symptoms: [
          'Engine starving for fuel',
          'Fuel gauge reading incorrect',
          'Fuel leaks from tank',
          'Water contamination in fuel',
          'Air entering fuel system',
        ],
        troubleshooting: [
          'Check fuel level visually (don\'t trust gauge alone)',
          'Inspect tank for rust, sediment, water at bottom',
          'Verify vent is not blocked (open cap while running - if runs better, vent is blocked)',
          'Check pickup tube is not clogged or cracked',
          'Drain water from tank bottom if equipped with drain',
        ],
        partNumbers: [
          { brand: 'Universal', partNo: 'Fuel Tank Sender', price: '8,500' },
          { brand: 'Generic', partNo: 'Tank Vent Cap', price: '1,200' },
          { brand: 'Universal', partNo: 'Pickup Tube Assembly', price: '4,500' },
        ],
        tools: ['Fuel transfer pump', 'Clean containers', 'Flashlight', 'Water finding paste'],
        specifications: [
          { name: 'Typical Capacity', value: '100-500 liters' },
          { name: 'Material', value: 'Steel or polyethylene' },
          { name: 'Pickup Height', value: '25-50mm from bottom' },
        ],
        connections: ['Fuel supply line to primary filter', 'Return line from injection pump', 'Vent line to atmosphere', 'Level sender wiring'],
        commonFaults: [
          { fault: 'Tank vent blocked', cause: 'Debris, insect nest, kinked vent hose', solution: 'Clean or replace vent assembly' },
          { fault: 'Water in fuel', cause: 'Condensation, contaminated delivery', solution: 'Drain water, add fuel treatment' },
          { fault: 'Sediment buildup', cause: 'Age, contaminated fuel', solution: 'Clean tank, install water separator' },
        ],
        maintenanceInterval: 'Drain water monthly, clean tank annually',
      },
      {
        id: 'primary-filter',
        name: 'Primary Fuel Filter (Water Separator)',
        icon: <Droplets className="w-5 h-5" />,
        position: { x: 22, y: 35 },
        size: { width: 10, height: 15 },
        description: 'First stage filtration with water separation. Removes large particles and water from fuel before lift pump.',
        function: 'Coarse filtration (10-30 micron) and water separation to protect lift pump and downstream components.',
        symptoms: [
          'Low fuel pressure',
          'Engine hunting/surging',
          'Hard starting',
          'Water in fuel bowl',
          'Reduced power under load',
        ],
        troubleshooting: [
          'Check water in fuel bowl - drain if present',
          'Check filter restriction indicator if equipped',
          'Replace filter if more than 500 hours or 6 months',
          'Prime system after filter change',
          'Check for air leaks at filter head gasket',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: 'FS19732', price: '3,500' },
          { brand: 'CAT', partNo: '326-1644', price: '4,200' },
          { brand: 'Perkins', partNo: '26560143', price: '2,800' },
          { brand: 'Racor', partNo: 'R60P', price: '2,500' },
        ],
        tools: ['Filter wrench', 'Drain pan', 'Clean rags', 'Hand primer pump'],
        specifications: [
          { name: 'Filtration Rating', value: '10-30 microns' },
          { name: 'Water Separation', value: '95%+ efficiency' },
          { name: 'Service Interval', value: '500 hours or 6 months' },
        ],
        connections: ['Inlet from fuel tank', 'Outlet to lift pump', 'Drain valve for water'],
        commonFaults: [
          { fault: 'Filter clogged', cause: 'Contaminated fuel, exceeded service interval', solution: 'Replace filter element' },
          { fault: 'Water not separating', cause: 'Element saturated, wrong element', solution: 'Replace with correct element' },
          { fault: 'Air leak at head', cause: 'O-ring damaged, head loose', solution: 'Replace O-ring, tighten properly' },
        ],
        maintenanceInterval: 'Drain water daily, replace element every 500 hours',
      },
      {
        id: 'lift-pump',
        name: 'Fuel Lift Pump (Transfer Pump)',
        icon: <RotateCcw className="w-5 h-5" />,
        position: { x: 35, y: 40 },
        size: { width: 10, height: 12 },
        description: 'Low pressure pump that draws fuel from tank through primary filter and pushes to injection pump.',
        function: 'Creates 3-7 PSI (0.2-0.5 bar) to supply fuel to injection pump inlet. Prevents cavitation in injection pump.',
        symptoms: [
          'Hard starting',
          'Engine dies under load',
          'Air in fuel system',
          'Fuel starvation at high RPM',
          'Lift pump not clicking (electric type)',
        ],
        troubleshooting: [
          'Check pump operation - listen for clicking (electric) or feel diaphragm movement (mechanical)',
          'Measure outlet pressure - should be 3-7 PSI',
          'Check for inlet restriction (collapsed hose)',
          'Verify power supply (electric pump) - 12V/24V at connector',
          'Test check valves if equipped',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: '3936316', price: '18,000' },
          { brand: 'CAT', partNo: '349-1063', price: '25,000' },
          { brand: 'Perkins', partNo: 'ULPK0038', price: '12,000' },
          { brand: 'Bosch', partNo: '0440008999', price: '15,000' },
        ],
        tools: ['Fuel pressure gauge', 'Multimeter', 'Hand tools', 'Clean containers'],
        specifications: [
          { name: 'Output Pressure', value: '3-7 PSI (0.2-0.5 bar)' },
          { name: 'Flow Rate', value: '60-120 LPH' },
          { name: 'Type', value: 'Mechanical diaphragm or electric' },
        ],
        connections: ['Inlet from primary filter', 'Outlet to secondary filter', 'Power supply (electric)', 'Ground'],
        commonFaults: [
          { fault: 'No fuel delivery', cause: 'Diaphragm ruptured, motor failed', solution: 'Replace pump' },
          { fault: 'Low pressure', cause: 'Worn pump, air leak on suction', solution: 'Replace pump or fix leak' },
          { fault: 'Intermittent operation', cause: 'Bad connection, failing motor', solution: 'Check wiring, replace if needed' },
        ],
        maintenanceInterval: 'Inspect every 1000 hours, replace if weak',
      },
      {
        id: 'secondary-filter',
        name: 'Secondary Fuel Filter (Fine Filter)',
        icon: <Droplets className="w-5 h-5" />,
        position: { x: 48, y: 35 },
        size: { width: 10, height: 15 },
        description: 'Final filtration stage before injection pump. Removes fine particles that could damage precision injection components.',
        function: 'Fine filtration (2-5 micron) to protect injection pump and injectors from microscopic contaminants.',
        symptoms: [
          'Gradual power loss',
          'Injector noise increasing',
          'Fuel pressure drop',
          'Injector failure',
          'Smoke color change',
        ],
        troubleshooting: [
          'Check pressure drop across filter - should be <5 PSI',
          'Cut open old filter to inspect contamination level',
          'Replace at recommended interval regardless of appearance',
          'Bleed air after replacement',
          'Check for bypass valve operation',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: 'FF5052', price: '2,800' },
          { brand: 'CAT', partNo: '1R-0751', price: '3,500' },
          { brand: 'Perkins', partNo: '26560145', price: '2,200' },
          { brand: 'Donaldson', partNo: 'P551315', price: '2,000' },
        ],
        tools: ['Filter wrench', 'Drain pan', 'Bleed screws tool', 'Clean rags'],
        specifications: [
          { name: 'Filtration Rating', value: '2-5 microns' },
          { name: 'Efficiency', value: '98.7% at rated micron' },
          { name: 'Service Interval', value: '250-500 hours' },
        ],
        connections: ['Inlet from lift pump', 'Outlet to injection pump'],
        commonFaults: [
          { fault: 'Restricted flow', cause: 'Clogged element', solution: 'Replace filter' },
          { fault: 'Injector wear', cause: 'Filter not changed, wrong micron rating', solution: 'Use correct filter, maintain schedule' },
          { fault: 'Air in system', cause: 'Loose housing, bad O-ring', solution: 'Tighten, replace O-ring' },
        ],
        maintenanceInterval: 'Replace every 250-500 hours',
      },
      {
        id: 'injection-pump',
        name: 'Fuel Injection Pump',
        icon: <Settings className="w-5 h-5" />,
        position: { x: 62, y: 30 },
        size: { width: 14, height: 25 },
        description: 'High pressure pump that meters and delivers precisely timed fuel to each injector. Heart of the fuel system.',
        function: 'Generates 150-2000+ bar pressure, meters exact fuel quantity, times delivery to engine position.',
        symptoms: [
          'Hard starting (timing off)',
          'Black smoke (over-fueling)',
          'White smoke (timing retarded)',
          'Knocking (timing advanced)',
          'Loss of power',
          'Hunting/surging at idle',
          'Engine won\'t shut off (rack stuck)',
        ],
        troubleshooting: [
          'Check timing marks - pump to engine alignment',
          'Verify fuel cutoff solenoid operation',
          'Check delivery valves for leakback',
          'Inspect governor linkage for binding',
          'Test fuel delivery rate to each cylinder',
          'Check for air leaks at inlet',
          'Verify throttle/rack movement is full range',
        ],
        partNumbers: [
          { brand: 'Bosch', partNo: '0460426401', price: '185,000' },
          { brand: 'Cummins', partNo: '3977353', price: '220,000' },
          { brand: 'CAT', partNo: '317-8021', price: '350,000' },
          { brand: 'Zexel', partNo: '104641-7280', price: '165,000' },
          { brand: 'Denso', partNo: '096400-1500', price: '175,000' },
        ],
        tools: ['Timing tools', 'Dial indicator', 'Fuel pressure gauge', 'Injector tester', 'Torque wrench'],
        specifications: [
          { name: 'Pressure (Mechanical)', value: '150-350 bar' },
          { name: 'Pressure (Common Rail)', value: '1600-2500 bar' },
          { name: 'Timing Accuracy', value: '±0.5 degrees' },
          { name: 'Delivery Variance', value: '<3% between cylinders' },
        ],
        connections: ['Inlet from secondary filter', 'High pressure lines to injectors', 'Return line to tank', 'Governor linkage', 'Shutoff solenoid', 'Timing drive from engine'],
        commonFaults: [
          { fault: 'Timing drift', cause: 'Worn drive coupling, loose mounting', solution: 'Reset timing, replace coupling' },
          { fault: 'Uneven delivery', cause: 'Worn plungers, delivery valves', solution: 'Overhaul or replace pump' },
          { fault: 'No shutoff', cause: 'Solenoid failed, rack stuck', solution: 'Replace solenoid, free rack' },
          { fault: 'Low pressure', cause: 'Worn pump elements, air leak', solution: 'Overhaul pump' },
        ],
        maintenanceInterval: 'Overhaul every 8000-12000 hours, calibrate annually',
        testProcedure: [
          '1. Check static timing with dial indicator',
          '2. Connect fuel flow meter to each injector line',
          '3. Crank engine and measure delivery per stroke',
          '4. Compare delivery between cylinders (<3% variance)',
          '5. Test shutoff solenoid - should cut fuel immediately',
          '6. Check governor response with RPM change',
        ],
      },
      {
        id: 'injectors',
        name: 'Fuel Injectors (Nozzles)',
        icon: <Flame className="w-5 h-5" />,
        position: { x: 80, y: 25 },
        size: { width: 10, height: 20 },
        description: 'Precision spray nozzles that atomize fuel into the combustion chamber at exact timing and spray pattern.',
        function: 'Convert high pressure fuel into fine mist spray pattern for efficient combustion. Open at preset pressure, close to prevent dribble.',
        symptoms: [
          'Black smoke from specific cylinder',
          'Knocking in one cylinder',
          'Misfiring',
          'Power loss',
          'Increased fuel consumption',
          'Rough idle',
          'Exhaust smell of unburned fuel',
        ],
        troubleshooting: [
          'Cylinder cutout test - disconnect one at a time, no RPM change = dead cylinder',
          'Check exhaust temperature at each port - cold = no combustion',
          'Back-leak test - should be <10ml/min at rated pressure',
          'Pop test - check opening pressure (200-250 bar typical)',
          'Spray pattern test - should be fine mist, symmetrical cone',
          'Check nozzle tip for carbon buildup',
        ],
        partNumbers: [
          { brand: 'Bosch', partNo: '0432131743', price: '18,000' },
          { brand: 'Cummins', partNo: '3919350', price: '22,000' },
          { brand: 'CAT', partNo: '127-8209', price: '35,000' },
          { brand: 'Denso', partNo: '093400-5571', price: '16,000' },
          { brand: 'Delphi', partNo: 'EJBR02501Z', price: '15,000' },
        ],
        tools: ['Injector tester (pop tester)', 'Torque wrench', 'Injector puller', 'Copper washer set', 'Nozzle cleaning kit'],
        specifications: [
          { name: 'Opening Pressure', value: '200-350 bar (varies by engine)' },
          { name: 'Spray Angle', value: '140-160 degrees' },
          { name: 'Number of Holes', value: '4-8 holes' },
          { name: 'Back Leak', value: '<10 ml/min at rated pressure' },
        ],
        connections: ['High pressure line from pump', 'Return line to tank', 'Combustion chamber'],
        commonFaults: [
          { fault: 'Dribbling', cause: 'Worn needle seat, low opening pressure', solution: 'Replace nozzle' },
          { fault: 'Poor spray pattern', cause: 'Blocked holes, worn tip', solution: 'Clean or replace nozzle' },
          { fault: 'Won\'t open', cause: 'Seized needle, blocked inlet', solution: 'Replace injector' },
          { fault: 'Excessive leak-back', cause: 'Worn needle/barrel', solution: 'Replace injector' },
        ],
        maintenanceInterval: 'Test every 2000 hours, replace every 8000 hours or as needed',
        testProcedure: [
          '1. Remove injector from engine',
          '2. Connect to injector test bench',
          '3. Pump slowly to check opening pressure',
          '4. Observe spray pattern - should be fine mist, symmetrical',
          '5. Check for after-dribble - nozzle should cut cleanly',
          '6. Measure back-leak time at rated pressure',
          '7. Compare results to specifications',
        ],
      },
      {
        id: 'governor',
        name: 'Governor (Speed Control)',
        icon: <Gauge className="w-5 h-5" />,
        position: { x: 62, y: 60 },
        size: { width: 12, height: 15 },
        description: 'Controls engine speed by adjusting fuel delivery based on load. Maintains stable frequency.',
        function: 'Senses engine speed, compares to setpoint, adjusts fuel rack/throttle to maintain constant speed regardless of load changes.',
        symptoms: [
          'Speed hunting/surging',
          'Over-speed on load rejection',
          'Under-speed on load application',
          'Unstable frequency',
          'Engine won\'t reach full speed',
          'Slow response to load changes',
        ],
        troubleshooting: [
          'Check mechanical linkage for binding or wear',
          'Verify speed sensor signal (electronic governors)',
          'Adjust gain and stability settings',
          'Check actuator response - should be smooth, full travel',
          'Verify fuel rack moves freely',
          'Check for air in hydraulic governor oil',
        ],
        partNumbers: [
          { brand: 'Woodward', partNo: 'EG3P', price: '85,000' },
          { brand: 'GAC', partNo: 'ADC225', price: '65,000' },
          { brand: 'Cummins', partNo: '3408326', price: '120,000' },
          { brand: 'CAT', partNo: '263-5674', price: '95,000' },
        ],
        tools: ['Tachometer', 'Oscilloscope', 'Multimeter', 'Governor adjustment tools'],
        specifications: [
          { name: 'Speed Regulation', value: '±0.25% (isochronous)' },
          { name: 'Droop Setting', value: '3-5% (parallel operation)' },
          { name: 'Response Time', value: '<0.3 seconds' },
        ],
        connections: ['Fuel rack/throttle linkage', 'Speed sensor input', 'Power supply', 'Remote speed adjustment'],
        commonFaults: [
          { fault: 'Hunting', cause: 'Gain too high, worn linkage', solution: 'Reduce gain, replace linkage' },
          { fault: 'Slow response', cause: 'Gain too low, actuator weak', solution: 'Increase gain, check actuator' },
          { fault: 'Over-speed', cause: 'Governor failure, stuck actuator', solution: 'Replace governor/actuator' },
        ],
        maintenanceInterval: 'Calibrate annually, replace actuator every 10000 hours',
      },
      {
        id: 'fuel-actuator',
        name: 'Fuel Control Actuator',
        icon: <Settings className="w-5 h-5" />,
        position: { x: 48, y: 60 },
        size: { width: 10, height: 12 },
        description: 'Electric or hydraulic actuator that converts governor signal to mechanical movement of fuel rack.',
        function: 'Receives signal from governor, moves fuel rack/throttle to commanded position for speed control.',
        symptoms: [
          'No throttle response',
          'Jerky throttle movement',
          'Can\'t reach full fuel',
          'Actuator buzzing',
          'Slow speed changes',
        ],
        troubleshooting: [
          'Check actuator power supply voltage',
          'Measure signal from governor',
          'Verify full stroke movement (mechanical)',
          'Check for binding in linkage',
          'Test actuator off-engine if possible',
        ],
        partNumbers: [
          { brand: 'Woodward', partNo: '8404-5006', price: '45,000' },
          { brand: 'GAC', partNo: 'ACT225', price: '35,000' },
          { brand: 'Cummins', partNo: '3408324', price: '55,000' },
        ],
        tools: ['Multimeter', 'Actuator test bench', 'Hand tools'],
        specifications: [
          { name: 'Stroke', value: '10-30mm' },
          { name: 'Response Time', value: '<100ms' },
          { name: 'Force', value: '20-50N' },
        ],
        connections: ['Governor signal wires', 'Fuel rack linkage', 'Position feedback (if equipped)'],
        commonFaults: [
          { fault: 'No movement', cause: 'Failed coil, no signal', solution: 'Check signal, replace actuator' },
          { fault: 'Partial movement', cause: 'Weak actuator, binding', solution: 'Free linkage, replace actuator' },
          { fault: 'Oscillation', cause: 'Feedback issue, governor settings', solution: 'Adjust governor, check feedback' },
        ],
        maintenanceInterval: 'Check annually, replace if sluggish',
      },
      {
        id: 'fuel-shutoff',
        name: 'Fuel Shutoff Solenoid',
        icon: <Power className="w-5 h-5" />,
        position: { x: 75, y: 55 },
        size: { width: 8, height: 10 },
        description: 'Electromagnetic valve that enables or disables fuel flow to stop/allow engine operation.',
        function: 'When energized (or de-energized depending on type), allows fuel to reach injectors. Safety shutdown device.',
        symptoms: [
          'Engine won\'t start (no fuel)',
          'Engine won\'t stop',
          'Clicking sound, no start',
          'Intermittent starting',
        ],
        troubleshooting: [
          'Check voltage at solenoid with key ON - should be 12V or 24V',
          'Listen for click when key turned ON',
          'Manually push/pull plunger to verify movement',
          'Check ground circuit continuity',
          'Verify controller is commanding solenoid ON',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: '3935649', price: '12,000' },
          { brand: 'CAT', partNo: '155-4653', price: '18,000' },
          { brand: 'Perkins', partNo: '26420472', price: '8,500' },
          { brand: 'Woodward', partNo: '1504-12C6U1B1', price: '15,000' },
        ],
        tools: ['Multimeter', 'Test light', 'Hand tools'],
        specifications: [
          { name: 'Voltage', value: '12V or 24V DC' },
          { name: 'Type', value: 'Pull or push type' },
          { name: 'Current Draw', value: '1-3A' },
        ],
        connections: ['Power from controller', 'Ground', 'Mechanical linkage to fuel rack'],
        commonFaults: [
          { fault: 'No click', cause: 'No power, failed coil', solution: 'Check circuit, replace solenoid' },
          { fault: 'Clicks but no start', cause: 'Weak solenoid, stuck plunger', solution: 'Replace solenoid' },
          { fault: 'Won\'t shut off', cause: 'Stuck open, broken linkage', solution: 'Replace, fix linkage' },
        ],
        maintenanceInterval: 'Test annually, replace if sluggish',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COOLING SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cooling',
    name: 'Cooling System',
    icon: <Thermometer className="w-6 h-6" />,
    color: 'blue',
    description: 'Engine temperature regulation through coolant circulation',
    flowDescription: 'Coolant flows: Water Pump → Engine Block → Cylinder Head → Thermostat → Radiator → Water Pump. Bypass circuit available when cold.',
    diagram: 'cooling-system',
    components: [
      {
        id: 'radiator',
        name: 'Radiator',
        icon: <Fan className="w-5 h-5" />,
        position: { x: 10, y: 20 },
        size: { width: 20, height: 30 },
        description: 'Heat exchanger that transfers heat from coolant to ambient air. Core of the cooling system.',
        function: 'Dissipates engine heat to atmosphere through large surface area of fins and tubes.',
        symptoms: [
          'Engine overheating',
          'Coolant loss without visible leak',
          'Reduced cooling capacity',
          'Visible blockage in core',
          'Coolant contamination (oil)',
        ],
        troubleshooting: [
          'Check for debris blocking airflow through fins',
          'Pressure test system - should hold 7-15 PSI',
          'Check for internal blockage - feel for cold spots',
          'Verify cap pressure rating is correct',
          'Inspect for external leaks at tanks and hoses',
        ],
        partNumbers: [
          { brand: 'Generic 500kVA', partNo: 'RAD-500-CU', price: '85,000' },
          { brand: 'Generic 1000kVA', partNo: 'RAD-1000-AL', price: '145,000' },
          { brand: 'Cummins', partNo: '3655113', price: '180,000' },
        ],
        tools: ['Pressure tester', 'Infrared thermometer', 'Fin comb', 'Pressure washer'],
        specifications: [
          { name: 'Material', value: 'Copper/brass or aluminum' },
          { name: 'Pressure Rating', value: '7-15 PSI (0.5-1 bar)' },
          { name: 'Temperature Drop', value: '10-15°C across radiator' },
        ],
        connections: ['Top hose from engine', 'Bottom hose to water pump', 'Overflow tank'],
        commonFaults: [
          { fault: 'External leak', cause: 'Corrosion, damage, loose hose', solution: 'Repair or replace radiator' },
          { fault: 'Internal blockage', cause: 'Scale buildup, debris', solution: 'Flush or replace core' },
          { fault: 'Fin damage', cause: 'Physical damage, corrosion', solution: 'Straighten fins or replace' },
        ],
        maintenanceInterval: 'Clean fins monthly, flush system annually',
      },
      {
        id: 'water-pump',
        name: 'Water Pump',
        icon: <RotateCcw className="w-5 h-5" />,
        position: { x: 50, y: 50 },
        size: { width: 12, height: 15 },
        description: 'Centrifugal pump driven by engine that circulates coolant throughout the cooling system.',
        function: 'Creates flow of coolant through engine, radiator, and heater circuits. Critical for heat transfer.',
        symptoms: [
          'Overheating',
          'Coolant leak at weep hole',
          'Noise from pump area',
          'Low coolant flow',
          'Bearing play',
        ],
        troubleshooting: [
          'Check for coolant leak at weep hole (indicates seal failure)',
          'Feel for bearing play by moving pulley',
          'Listen for grinding or squealing noise',
          'Verify belt tension and condition',
          'Check flow by observing movement in expansion tank',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: '3800974', price: '35,000' },
          { brand: 'CAT', partNo: '352-2149', price: '45,000' },
          { brand: 'Perkins', partNo: 'U5MW0194', price: '28,000' },
        ],
        tools: ['Belt tension gauge', 'Coolant flow meter', 'Stethoscope', 'Pulley puller'],
        specifications: [
          { name: 'Flow Rate', value: '200-400 LPM' },
          { name: 'Drive', value: 'Belt or gear driven' },
          { name: 'Impeller Type', value: 'Centrifugal' },
        ],
        connections: ['Inlet from radiator bottom', 'Outlet to engine block', 'Belt drive from crankshaft'],
        commonFaults: [
          { fault: 'Seal leak', cause: 'Worn seal, shaft corrosion', solution: 'Replace water pump' },
          { fault: 'Bearing failure', cause: 'Belt tension wrong, age', solution: 'Replace water pump' },
          { fault: 'Impeller corrosion', cause: 'Wrong coolant, cavitation', solution: 'Replace pump, use correct coolant' },
        ],
        maintenanceInterval: 'Inspect every 2000 hours, replace every 6000 hours',
      },
      {
        id: 'thermostat',
        name: 'Thermostat',
        icon: <Thermometer className="w-5 h-5" />,
        position: { x: 35, y: 25 },
        size: { width: 10, height: 10 },
        description: 'Temperature-sensitive valve that controls coolant flow to radiator, maintaining optimal operating temperature.',
        function: 'Opens progressively as coolant warms up, allowing flow to radiator. Keeps engine at optimal 80-95°C.',
        symptoms: [
          'Engine overheating (stuck closed)',
          'Engine running too cool (stuck open)',
          'Slow warmup',
          'Temperature fluctuating',
          'Heater not working',
        ],
        troubleshooting: [
          'Check engine reaches operating temp (80-95°C)',
          'Feel upper radiator hose - should get hot when thermostat opens',
          'Remove and test in hot water - should open at rated temperature',
          'Check for debris preventing full closure',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: '3076489', price: '3,500' },
          { brand: 'CAT', partNo: '247-7133', price: '4,500' },
          { brand: 'Perkins', partNo: 'CH11620', price: '2,800' },
        ],
        tools: ['Infrared thermometer', 'Pot of water for testing', 'Thermometer'],
        specifications: [
          { name: 'Opening Temperature', value: '82-88°C typical' },
          { name: 'Full Open Temperature', value: '95-100°C' },
          { name: 'Type', value: 'Wax pellet' },
        ],
        connections: ['Coolant outlet from head', 'To radiator and bypass'],
        commonFaults: [
          { fault: 'Stuck closed', cause: 'Wax element failed, corrosion', solution: 'Replace thermostat' },
          { fault: 'Stuck open', cause: 'Wax element failed', solution: 'Replace thermostat' },
          { fault: 'Partial opening', cause: 'Debris, worn', solution: 'Replace thermostat' },
        ],
        maintenanceInterval: 'Replace every 3 years or if issues',
      },
      {
        id: 'coolant-temp-sensor',
        name: 'Coolant Temperature Sensor',
        icon: <Thermometer className="w-5 h-5" />,
        position: { x: 65, y: 30 },
        size: { width: 8, height: 8 },
        description: 'Sends coolant temperature signal to ECM and gauges for monitoring and protection.',
        function: 'Converts temperature to electrical signal. Used for fuel injection timing, fan control, and protection shutdown.',
        symptoms: [
          'Gauge reading wrong',
          'Fan not activating',
          'Check engine light',
          'Poor cold start',
          'Protection not working',
        ],
        troubleshooting: [
          'Compare gauge to actual temp (IR thermometer)',
          'Measure sensor resistance - should change with temp',
          'Check wiring for shorts or opens',
          'Verify ECM is receiving correct signal',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: '4954905', price: '4,500' },
          { brand: 'CAT', partNo: '227-5626', price: '5,800' },
          { brand: 'Bosch', partNo: '0281002209', price: '3,200' },
        ],
        tools: ['Multimeter', 'IR thermometer', 'Sensor socket'],
        specifications: [
          { name: 'Type', value: 'NTC thermistor' },
          { name: 'Resistance at 25°C', value: '2000-3000 ohms typical' },
          { name: 'Resistance at 80°C', value: '300-400 ohms typical' },
        ],
        connections: ['Signal wire to ECM', 'Ground (or signal return)'],
        commonFaults: [
          { fault: 'Wrong reading', cause: 'Sensor drift, wiring fault', solution: 'Replace sensor, check wiring' },
          { fault: 'No reading', cause: 'Open circuit, failed sensor', solution: 'Replace sensor' },
          { fault: 'Erratic reading', cause: 'Loose connection, intermittent', solution: 'Clean/tighten connections' },
        ],
        maintenanceInterval: 'Replace if inaccurate',
      },
      {
        id: 'cooling-fan',
        name: 'Cooling Fan',
        icon: <Fan className="w-5 h-5" />,
        position: { x: 10, y: 55 },
        size: { width: 15, height: 15 },
        description: 'Draws air through radiator to provide cooling. May be belt-driven, electric, or hydraulic.',
        function: 'Provides airflow for heat dissipation when generator is stationary or ambient airflow is insufficient.',
        symptoms: [
          'Overheating at low speeds/stationary',
          'Excessive noise',
          'Fan not engaging',
          'Belt squealing',
          'Vibration',
        ],
        troubleshooting: [
          'Check belt condition and tension',
          'Verify fan clutch engagement (if equipped)',
          'Check electric fan motor operation',
          'Inspect blades for damage or cracks',
          'Verify fan shroud is intact for proper airflow',
        ],
        partNumbers: [
          { brand: 'Generic', partNo: '6-blade 600mm', price: '12,000' },
          { brand: 'Horton', partNo: 'Fan Clutch', price: '45,000' },
          { brand: 'Electric', partNo: '24V 500W motor', price: '28,000' },
        ],
        tools: ['Belt tension gauge', 'Multimeter', 'Infrared thermometer'],
        specifications: [
          { name: 'Diameter', value: '500-800mm typical' },
          { name: 'Drive', value: 'Belt, electric, or hydraulic' },
          { name: 'CFM', value: '5000-15000 CFM' },
        ],
        connections: ['Belt to crankshaft', 'Electric wiring (if electric)', 'Fan shroud to radiator'],
        commonFaults: [
          { fault: 'Belt slip', cause: 'Belt worn, wrong tension', solution: 'Replace belt, adjust tension' },
          { fault: 'Clutch not engaging', cause: 'Viscous fluid leaked, bi-metal failed', solution: 'Replace fan clutch' },
          { fault: 'Blade damage', cause: 'Debris, fatigue', solution: 'Replace fan' },
        ],
        maintenanceInterval: 'Inspect belt every 500 hours, replace every 2000 hours',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTRICAL SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'electrical',
    name: 'Electrical System',
    icon: <Zap className="w-6 h-6" />,
    color: 'yellow',
    description: 'Power generation and control electrical systems',
    flowDescription: 'Engine drives alternator rotor → Magnetic field induces voltage in stator → AVR regulates excitation → Output power through circuit breakers → Load.',
    diagram: 'electrical-system',
    components: [
      {
        id: 'alternator',
        name: 'Main Alternator (Generator End)',
        icon: <Zap className="w-5 h-5" />,
        position: { x: 40, y: 20 },
        size: { width: 20, height: 25 },
        description: 'Converts mechanical energy from engine to electrical power. Contains stator, rotor, exciter, and diodes.',
        function: 'Primary power generation. Rotor magnetic field induces AC voltage in stator windings. Exciter provides rotor field current.',
        symptoms: [
          'No output voltage',
          'Low voltage',
          'Fluctuating voltage',
          'Overheating',
          'Unusual noise',
          'Voltage spikes',
        ],
        troubleshooting: [
          'Check residual voltage with engine running (5-10V indicates magnetism)',
          'Measure stator resistance - should be balanced between phases',
          'Check rotor resistance - compare to specs',
          'Test exciter stator and rotor',
          'Inspect diode rectifier for shorts/opens',
          'Verify AVR is receiving sensing voltage',
        ],
        partNumbers: [
          { brand: 'Stamford', partNo: 'UCI274', price: '850,000' },
          { brand: 'Leroy Somer', partNo: 'LSA 46.2', price: '780,000' },
          { brand: 'Mecc Alte', partNo: 'ECO38-2L', price: '650,000' },
          { brand: 'Marathon', partNo: '572RSL6209', price: '720,000' },
        ],
        tools: ['Megger (insulation tester)', 'Multimeter', 'Clamp ammeter', 'Oscilloscope'],
        specifications: [
          { name: 'Output', value: '415V, 50Hz, 3-phase' },
          { name: 'Power Factor', value: '0.8 lagging' },
          { name: 'Efficiency', value: '95%+' },
          { name: 'Insulation Class', value: 'H (180°C)' },
        ],
        connections: ['Coupling to engine', 'Output terminals U/V/W', 'Neutral', 'AVR sensing', 'Exciter field'],
        commonFaults: [
          { fault: 'No voltage', cause: 'Lost residual, AVR failed, wiring', solution: 'Flash field, check AVR, inspect wiring' },
          { fault: 'Low voltage', cause: 'AVR setting, excitation issue', solution: 'Adjust AVR, check exciter' },
          { fault: 'Winding failure', cause: 'Overload, insulation breakdown', solution: 'Rewind or replace' },
        ],
        maintenanceInterval: 'Insulation test annually, bearing replacement every 20000 hours',
        testProcedure: [
          '1. Measure stator resistance between phases (should be equal ±5%)',
          '2. Insulation test stator to ground (>5 megohms)',
          '3. Measure rotor resistance (compare to nameplate)',
          '4. Test exciter windings',
          '5. Check rotating diodes with multimeter',
          '6. Run generator and measure output voltage balance',
        ],
      },
      {
        id: 'avr',
        name: 'Automatic Voltage Regulator (AVR)',
        icon: <Settings className="w-5 h-5" />,
        position: { x: 65, y: 30 },
        size: { width: 12, height: 12 },
        description: 'Electronic controller that maintains constant output voltage by adjusting excitation current.',
        function: 'Senses output voltage, compares to setpoint, adjusts field current to maintain stable voltage regardless of load.',
        symptoms: [
          'Voltage hunting/oscillating',
          'Over-voltage',
          'Under-voltage',
          'No voltage regulation',
          'Voltage drop under load',
        ],
        troubleshooting: [
          'Check sensing voltage inputs (should be 415V across phases)',
          'Adjust VOLT pot - sets no-load voltage',
          'Adjust STAB pot - reduces hunting',
          'Adjust DROOP pot - load sharing',
          'Check field output with clamp ammeter',
          'Verify power supply to AVR',
        ],
        partNumbers: [
          { brand: 'Stamford', partNo: 'AS440', price: '12,000' },
          { brand: 'Stamford', partNo: 'SX460', price: '15,000' },
          { brand: 'Leroy Somer', partNo: 'R448', price: '18,000' },
          { brand: 'Mecc Alte', partNo: 'DSR', price: '14,000' },
          { brand: 'Basler', partNo: 'AVC125-10', price: '45,000' },
        ],
        tools: ['Multimeter', 'Oscilloscope', 'Small screwdriver for adjustments'],
        specifications: [
          { name: 'Voltage Regulation', value: '±0.5% steady state' },
          { name: 'Sensing Voltage', value: '190-480V AC' },
          { name: 'Field Current', value: '3-10A DC typical' },
        ],
        connections: ['Sensing input (3-phase)', 'Field output (+/-)', 'PMG input (if equipped)', 'Remote adjust'],
        commonFaults: [
          { fault: 'Hunting', cause: 'Stability setting wrong, sensing issue', solution: 'Adjust STAB, check sensing' },
          { fault: 'Over-voltage', cause: 'VOLT pot too high, AVR failure', solution: 'Adjust VOLT, replace AVR' },
          { fault: 'No output', cause: 'AVR failed, no sensing input', solution: 'Check inputs, replace AVR' },
        ],
        maintenanceInterval: 'Calibrate annually',
      },
      {
        id: 'exciter',
        name: 'Exciter Assembly',
        icon: <CircuitBoard className="w-5 h-5" />,
        position: { x: 45, y: 50 },
        size: { width: 14, height: 12 },
        description: 'Small generator mounted on main shaft that provides DC field current to main rotor through rotating diodes.',
        function: 'Converts AVR output to rotating DC supply for main rotor. Eliminates need for brushes and slip rings.',
        symptoms: [
          'Low voltage at all loads',
          'Voltage drops under load',
          'Exciter field hot',
          'No voltage buildup',
        ],
        troubleshooting: [
          'Measure exciter stator resistance',
          'Measure exciter rotor resistance',
          'Test rotating diodes (forward and reverse)',
          'Check AVR field output current',
          'Inspect connections and insulation',
        ],
        partNumbers: [
          { brand: 'Stamford', partNo: 'Exciter Rotor Assembly', price: '85,000' },
          { brand: 'Stamford', partNo: 'Diode Bridge', price: '35,000' },
          { brand: 'Generic', partNo: 'Rotating Diode Set', price: '15,000' },
        ],
        tools: ['Multimeter', 'Clamp ammeter', 'Insulation tester'],
        specifications: [
          { name: 'Output', value: '30-100V AC (before rectification)' },
          { name: 'Current', value: 'Matches main field requirements' },
        ],
        connections: ['Stator to AVR', 'Rotor to rotating diodes', 'Diodes to main field'],
        commonFaults: [
          { fault: 'Diode failure', cause: 'Voltage spike, overload', solution: 'Replace diode assembly' },
          { fault: 'Winding short', cause: 'Overheating, insulation failure', solution: 'Rewind exciter' },
          { fault: 'Open circuit', cause: 'Connection failure', solution: 'Repair connections' },
        ],
        maintenanceInterval: 'Test annually with alternator',
      },
      {
        id: 'mccb',
        name: 'Main Circuit Breaker (MCCB/ACB)',
        icon: <ToggleLeft className="w-5 h-5" />,
        position: { x: 75, y: 20 },
        size: { width: 12, height: 18 },
        description: 'Primary protection and disconnection device for generator output. Protects against overload and short circuit.',
        function: 'Provides automatic overload and short circuit protection. Allows manual connection/disconnection of load.',
        symptoms: [
          'Tripping on load',
          'Won\'t close',
          'Won\'t trip',
          'Nuisance tripping',
          'Contacts damaged',
        ],
        troubleshooting: [
          'Check trip settings match generator rating',
          'Verify load current is within breaker capacity',
          'Test trip function with test button',
          'Inspect contacts for pitting or damage',
          'Check operating mechanism',
          'Verify correct coordination with downstream devices',
        ],
        partNumbers: [
          { brand: 'Schneider', partNo: 'NSX630F', price: '125,000' },
          { brand: 'ABB', partNo: 'SACE Emax 2', price: '180,000' },
          { brand: 'Siemens', partNo: '3WL1363', price: '165,000' },
        ],
        tools: ['Primary injection test set', 'Contact resistance meter', 'Multimeter'],
        specifications: [
          { name: 'Rated Current', value: 'Match generator output' },
          { name: 'Breaking Capacity', value: '36-100kA' },
          { name: 'Trip Unit', value: 'Electronic or thermal-magnetic' },
        ],
        connections: ['Generator output', 'Load cables', 'Trip coil', 'Auxiliary contacts'],
        commonFaults: [
          { fault: 'Nuisance trip', cause: 'Wrong setting, inrush current', solution: 'Adjust settings, add inrush delay' },
          { fault: 'Won\'t close', cause: 'Trip not reset, interlock active', solution: 'Reset trip, check interlocks' },
          { fault: 'Contact damage', cause: 'Overload, short circuit', solution: 'Replace contacts or breaker' },
        ],
        maintenanceInterval: 'Test annually, service every 5 years',
      },
      {
        id: 'battery-system',
        name: 'Starting Battery System',
        icon: <Battery className="w-5 h-5" />,
        position: { x: 10, y: 60 },
        size: { width: 15, height: 12 },
        description: 'Provides DC power for engine starting, control systems, and emergency operations.',
        function: 'Supplies high current for starting motor. Powers controller, fuel solenoid, and safety systems.',
        symptoms: [
          'Slow cranking',
          'No crank',
          'Controller dead',
          'Battery not charging',
          'Short battery life',
        ],
        troubleshooting: [
          'Check battery voltage - should be >12.6V (12V) or >25.2V (24V)',
          'Load test - should hold >9.6V (12V) during cranking',
          'Check connections - clean and tight',
          'Verify charging voltage - 13.8-14.4V (12V) or 27.6-28.8V (24V)',
          'Check for parasitic drain',
        ],
        partNumbers: [
          { brand: 'Generic', partNo: '12V 100Ah', price: '18,000' },
          { brand: 'Generic', partNo: '12V 150Ah', price: '25,000' },
          { brand: 'Exide', partNo: 'N200', price: '35,000' },
        ],
        tools: ['Battery load tester', 'Multimeter', 'Battery hydrometer', 'Wire brush'],
        specifications: [
          { name: 'Capacity', value: '100-200Ah typical' },
          { name: 'CCA', value: '600-1000A' },
          { name: 'Voltage', value: '12V or 24V system' },
        ],
        connections: ['Positive to starter and control panel', 'Negative to engine block/chassis', 'Charger connection'],
        commonFaults: [
          { fault: 'Dead cell', cause: 'Age, sulfation, overcharge', solution: 'Replace battery' },
          { fault: 'Poor connection', cause: 'Corrosion, loose terminal', solution: 'Clean and tighten' },
          { fault: 'Overcharging', cause: 'Charger malfunction', solution: 'Replace charger' },
        ],
        maintenanceInterval: 'Check monthly, replace every 3-5 years',
      },
      {
        id: 'starter-motor',
        name: 'Starter Motor',
        icon: <RotateCcw className="w-5 h-5" />,
        position: { x: 30, y: 65 },
        size: { width: 12, height: 10 },
        description: 'High-torque DC motor that cranks the engine for starting. Engages flywheel ring gear.',
        function: 'Converts battery power to mechanical rotation. Pinion engages flywheel, cranks engine to starting speed.',
        symptoms: [
          'No cranking - click only',
          'Slow cranking',
          'Grinding noise',
          'Starter stays engaged',
          'Intermittent operation',
        ],
        troubleshooting: [
          'Check battery voltage during cranking (>9.6V for 12V system)',
          'Verify solenoid clicks and engages',
          'Test voltage at starter terminal - should be battery voltage',
          'Check pinion engagement and retraction',
          'Inspect ring gear teeth for damage',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: '3957593', price: '45,000' },
          { brand: 'CAT', partNo: '307-7177', price: '85,000' },
          { brand: 'Perkins', partNo: '2873K632', price: '38,000' },
          { brand: 'Bosch', partNo: '0001231039', price: '42,000' },
        ],
        tools: ['Multimeter', 'Amp clamp', 'Socket set', 'Pry bar'],
        specifications: [
          { name: 'Voltage', value: '12V or 24V DC' },
          { name: 'Power', value: '3-7 kW' },
          { name: 'Current Draw', value: '150-400A cranking' },
        ],
        connections: ['Battery positive', 'Solenoid signal from controller', 'Ground to engine'],
        commonFaults: [
          { fault: 'Solenoid failure', cause: 'Worn contacts, coil failure', solution: 'Replace solenoid' },
          { fault: 'Motor failure', cause: 'Worn brushes, armature damage', solution: 'Rebuild or replace starter' },
          { fault: 'Pinion damage', cause: 'Incorrect engagement, worn teeth', solution: 'Replace pinion or starter' },
        ],
        maintenanceInterval: 'Inspect every 2000 hours, rebuild every 5000 hours',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENGINE SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'engine',
    name: 'Engine System',
    icon: <Settings className="w-6 h-6" />,
    color: 'red',
    description: 'Core engine mechanical components and systems',
    flowDescription: 'Air → Turbo → Intercooler → Intake Manifold → Cylinders (with fuel from injectors) → Combustion → Exhaust → Turbo → Muffler',
    diagram: 'engine-system',
    components: [
      {
        id: 'turbocharger',
        name: 'Turbocharger',
        icon: <Fan className="w-5 h-5" />,
        position: { x: 70, y: 15 },
        size: { width: 14, height: 14 },
        description: 'Exhaust-driven compressor that increases air density for more power. Critical for diesel performance.',
        function: 'Uses exhaust energy to compress intake air. Increases power density by forcing more air into cylinders.',
        symptoms: [
          'Black smoke',
          'Loss of power',
          'Turbo whistle or whine',
          'Oil in intake or exhaust',
          'Slow boost buildup',
        ],
        troubleshooting: [
          'Check for shaft play - radial and axial movement',
          'Inspect compressor and turbine wheels for damage',
          'Verify oil supply and drain lines are clear',
          'Check boost pressure with gauge',
          'Listen for unusual sounds',
          'Check wastegate operation',
        ],
        partNumbers: [
          { brand: 'Holset', partNo: 'HX35', price: '85,000' },
          { brand: 'Garrett', partNo: 'GT3576', price: '95,000' },
          { brand: 'BorgWarner', partNo: 'S300', price: '88,000' },
        ],
        tools: ['Boost pressure gauge', 'Dial indicator', 'Inspection mirror', 'Pyrometer'],
        specifications: [
          { name: 'Boost Pressure', value: '1-2 bar typical' },
          { name: 'Max Speed', value: '100,000-150,000 RPM' },
          { name: 'Operating Temp', value: '600-700°C (turbine side)' },
        ],
        connections: ['Exhaust manifold inlet', 'Exhaust outlet', 'Air inlet', 'Compressed air outlet to intercooler', 'Oil supply and drain'],
        commonFaults: [
          { fault: 'Oil leak', cause: 'Seal failure, drain blocked', solution: 'Rebuild turbo, clear drain' },
          { fault: 'Wheel damage', cause: 'Foreign object, over-speed', solution: 'Replace turbo core' },
          { fault: 'Bearing failure', cause: 'Oil starvation, contamination', solution: 'Replace turbo' },
        ],
        maintenanceInterval: 'Inspect every 2000 hours, rebuild at 8000-15000 hours',
      },
      {
        id: 'air-filter',
        name: 'Air Cleaner/Filter',
        icon: <Fan className="w-5 h-5" />,
        position: { x: 80, y: 40 },
        size: { width: 12, height: 15 },
        description: 'Removes dust and particles from intake air to protect engine internals.',
        function: 'Filters intake air to 2-10 microns. Prevents abrasive particles from damaging cylinders, rings, and bearings.',
        symptoms: [
          'Power loss',
          'Black smoke',
          'High restriction indicator',
          'Turbo damage',
          'Increased oil consumption',
        ],
        troubleshooting: [
          'Check restriction indicator',
          'Visual inspection of element',
          'Check housing seals and clamps',
          'Verify ducting is intact',
          'Clean or replace element per schedule',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: 'AF25139M', price: '8,500' },
          { brand: 'CAT', partNo: '245-6375', price: '12,000' },
          { brand: 'Donaldson', partNo: 'P181059', price: '6,500' },
        ],
        tools: ['Air filter cleaning kit', 'Compressed air', 'Restriction gauge'],
        specifications: [
          { name: 'Filtration', value: '99.9% at 2-10 microns' },
          { name: 'Max Restriction', value: '6.3 kPa (25" H2O)' },
        ],
        connections: ['Intake ducting from atmosphere', 'Clean side to turbo or intake manifold'],
        commonFaults: [
          { fault: 'Clogged filter', cause: 'Dusty environment, exceeded interval', solution: 'Replace element' },
          { fault: 'Damaged seal', cause: 'Installation error, age', solution: 'Replace seal' },
          { fault: 'Housing leak', cause: 'Damage, loose clamps', solution: 'Repair housing, tighten clamps' },
        ],
        maintenanceInterval: 'Check every 250 hours, replace every 500-1000 hours',
      },
      {
        id: 'oil-system',
        name: 'Lubrication System',
        icon: <Droplets className="w-5 h-5" />,
        position: { x: 30, y: 40 },
        size: { width: 16, height: 18 },
        description: 'Provides pressurized oil for lubrication and cooling of engine internals.',
        function: 'Oil pump draws from sump, pressurizes through filter, distributes to bearings, turbo, and other components.',
        symptoms: [
          'Low oil pressure',
          'High oil temperature',
          'Oil consumption',
          'Bearing noise',
          'Oil in coolant',
        ],
        troubleshooting: [
          'Check oil level and condition',
          'Verify correct oil viscosity',
          'Replace filter if overdue',
          'Check pressure at gallery - should be 40-60 PSI hot',
          'Inspect for leaks',
          'Check oil cooler if equipped',
        ],
        partNumbers: [
          { brand: 'Cummins', partNo: 'LF9009', price: '3,500' },
          { brand: 'CAT', partNo: '1R-0739', price: '4,200' },
          { brand: 'Perkins', partNo: 'CH10929', price: '2,800' },
        ],
        tools: ['Oil pressure gauge', 'Thermometer', 'Oil analysis kit', 'Suction gun'],
        specifications: [
          { name: 'Pressure', value: '40-60 PSI (hot idle)' },
          { name: 'Oil Type', value: 'API CI-4 or CJ-4' },
          { name: 'Capacity', value: 'Varies by engine' },
        ],
        connections: ['Sump to oil pump', 'Filter to main gallery', 'Return from components'],
        commonFaults: [
          { fault: 'Low pressure', cause: 'Worn bearings, weak pump, low level', solution: 'Diagnose cause, repair' },
          { fault: 'High consumption', cause: 'Worn rings/guides, leaks', solution: 'Repair or overhaul' },
          { fault: 'Contamination', cause: 'Coolant leak, fuel dilution', solution: 'Find and fix source' },
        ],
        maintenanceInterval: 'Change oil every 250-500 hours, filter at each change',
      },
      {
        id: 'exhaust-system',
        name: 'Exhaust System',
        icon: <Flame className="w-5 h-5" />,
        position: { x: 55, y: 60 },
        size: { width: 20, height: 12 },
        description: 'Routes exhaust gases from engine through turbo and muffler to atmosphere.',
        function: 'Safely removes combustion exhaust, drives turbo, reduces noise, and may include emission controls.',
        symptoms: [
          'Excessive backpressure',
          'Loud exhaust noise',
          'Power loss',
          'Exhaust leaks',
          'DPF regeneration issues',
        ],
        troubleshooting: [
          'Measure backpressure - should be <3" H2O',
          'Inspect for leaks at gaskets and joints',
          'Check muffler for internal collapse',
          'Verify DPF is not clogged (if equipped)',
          'Inspect flex connections',
        ],
        partNumbers: [
          { brand: 'Generic', partNo: 'Muffler 6" diameter', price: '25,000' },
          { brand: 'Generic', partNo: 'Exhaust Flex', price: '8,500' },
          { brand: 'Generic', partNo: 'Gasket Set', price: '3,500' },
        ],
        tools: ['Backpressure gauge', 'Pyrometer', 'Inspection mirror'],
        specifications: [
          { name: 'Max Backpressure', value: '3" H2O (7.5 kPa)' },
          { name: 'Temperature', value: '400-600°C' },
        ],
        connections: ['Turbo exhaust outlet', 'Flex section', 'Muffler', 'Exhaust pipe to atmosphere'],
        commonFaults: [
          { fault: 'High backpressure', cause: 'Clogged muffler/DPF, kinked pipe', solution: 'Replace or clean' },
          { fault: 'Leak', cause: 'Failed gasket, cracked pipe', solution: 'Replace gasket, repair pipe' },
          { fault: 'Excessive noise', cause: 'Muffler damage, loose parts', solution: 'Replace muffler' },
        ],
        maintenanceInterval: 'Inspect annually, replace muffler if restricted',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ATS (AUTOMATIC TRANSFER SWITCH)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ats',
    name: 'ATS / Transfer Switch',
    icon: <ToggleLeft className="w-6 h-6" />,
    color: 'purple',
    description: 'Automatic Transfer Switch - switches between utility and generator power',
    flowDescription: 'Monitors utility power → Detects failure → Signals generator to start → Waits for generator ready → Transfers load to generator → Monitors for utility return → Re-transfers to utility → Signals generator shutdown',
    diagram: 'ats-system',
    components: [
      {
        id: 'ats-controller',
        name: 'ATS Controller',
        icon: <CircuitBoard className="w-5 h-5" />,
        position: { x: 40, y: 15 },
        size: { width: 20, height: 15 },
        description: 'Brain of the transfer switch. Monitors utility, controls transfer sequence, and coordinates with generator.',
        function: 'Senses utility voltage and frequency, manages time delays, controls contactor switching, signals generator.',
        symptoms: [
          'No automatic transfer',
          'Transfer to generator with utility present',
          'Won\'t return to utility',
          'Generator not starting',
          'Display not working',
        ],
        troubleshooting: [
          'Check utility sensing connections',
          'Verify generator sensing connections',
          'Check time delay settings',
          'Test start signal output to generator',
          'Verify phase rotation is correct',
          'Check for fault indication',
        ],
        partNumbers: [
          { brand: 'DSE', partNo: 'DSE334', price: '55,000' },
          { brand: 'ComAp', partNo: 'InteliATS NT', price: '75,000' },
          { brand: 'ASCO', partNo: '5220 Controller', price: '85,000' },
        ],
        tools: ['Multimeter', 'Phase rotation meter', 'Controller software'],
        specifications: [
          { name: 'Sensing Voltage', value: '110-480V AC' },
          { name: 'Frequency', value: '50/60 Hz' },
          { name: 'Time Delays', value: 'Adjustable 0-300 seconds' },
        ],
        connections: ['Utility sensing (3-phase)', 'Generator sensing (3-phase)', 'Start signal to generator', 'Contactor coils', 'Manual override'],
        commonFaults: [
          { fault: 'No sensing', cause: 'Blown fuse, loose connection', solution: 'Replace fuse, check wiring' },
          { fault: 'Wrong transfer', cause: 'Settings incorrect, sensing fault', solution: 'Adjust settings, check sensing' },
          { fault: 'No start signal', cause: 'Output failed, wiring issue', solution: 'Check output, repair wiring' },
        ],
        maintenanceInterval: 'Test monthly, calibrate annually',
      },
      {
        id: 'ats-contactors',
        name: 'Transfer Contactors',
        icon: <ToggleLeft className="w-5 h-5" />,
        position: { x: 35, y: 45 },
        size: { width: 30, height: 20 },
        description: 'Heavy-duty contactors that physically switch load between utility and generator sources.',
        function: 'Mechanically interlocked contactors ensure only one source is connected at a time. Handle full load current.',
        symptoms: [
          'Stuck in one position',
          'Won\'t transfer',
          'Transfer noise/chattering',
          'Overheating',
          'Arc damage',
        ],
        troubleshooting: [
          'Check mechanical interlock operation',
          'Verify coil voltage when transfer commanded',
          'Inspect main contacts for pitting',
          'Check auxiliary contacts',
          'Test manual transfer mechanism',
          'Verify no mechanical binding',
        ],
        partNumbers: [
          { brand: 'ASCO', partNo: '940 Contactor', price: '185,000' },
          { brand: 'ABB', partNo: 'OT Series', price: '145,000' },
          { brand: 'Schneider', partNo: 'LTMR08', price: '165,000' },
        ],
        tools: ['Contact resistance meter', 'Multimeter', 'Mechanical test tools'],
        specifications: [
          { name: 'Current Rating', value: 'Match load requirement' },
          { name: 'Coil Voltage', value: '24VDC, 110VAC, 220VAC' },
          { name: 'Mechanical Life', value: '10,000+ operations' },
        ],
        connections: ['Utility input', 'Generator input', 'Load output', 'Coil power from controller'],
        commonFaults: [
          { fault: 'Contact welding', cause: 'Overload, wrong rating', solution: 'Replace contacts, check rating' },
          { fault: 'Mechanical jam', cause: 'Debris, wear, misalignment', solution: 'Clean, lubricate, align' },
          { fault: 'Interlock failure', cause: 'Mechanical damage', solution: 'Repair or replace mechanism' },
        ],
        maintenanceInterval: 'Inspect every 6 months, exercise monthly',
      },
      {
        id: 'utility-breaker',
        name: 'Utility Input Breaker',
        icon: <Power className="w-5 h-5" />,
        position: { x: 10, y: 40 },
        size: { width: 12, height: 15 },
        description: 'Circuit breaker on utility side input providing overcurrent protection.',
        function: 'Protects against overcurrent from utility side. Allows isolation of utility source.',
        symptoms: [
          'Tripping unexpectedly',
          'Won\'t close',
          'No utility power to ATS',
        ],
        troubleshooting: [
          'Check trip indication',
          'Verify utility voltage present before breaker',
          'Test breaker trip function',
          'Check for proper rating',
        ],
        partNumbers: [
          { brand: 'Schneider', partNo: 'NSX series', price: '45,000' },
          { brand: 'ABB', partNo: 'TMAX series', price: '52,000' },
        ],
        tools: ['Multimeter', 'Primary injection test set'],
        specifications: [
          { name: 'Rating', value: 'Match utility supply' },
          { name: 'Breaking Capacity', value: 'Match available fault current' },
        ],
        connections: ['Utility supply', 'To ATS utility input'],
        commonFaults: [
          { fault: 'Nuisance trip', cause: 'Wrong rating, loose connection', solution: 'Check rating, tighten connections' },
          { fault: 'No power', cause: 'Tripped, failed closed', solution: 'Reset or replace' },
        ],
        maintenanceInterval: 'Test annually',
      },
      {
        id: 'gen-breaker',
        name: 'Generator Input Breaker',
        icon: <Power className="w-5 h-5" />,
        position: { x: 72, y: 40 },
        size: { width: 12, height: 15 },
        description: 'Circuit breaker on generator side input providing overcurrent protection.',
        function: 'Protects generator from overload. Allows isolation of generator source.',
        symptoms: [
          'Generator trips on transfer',
          'Won\'t close',
          'Generator overload',
        ],
        troubleshooting: [
          'Check breaker rating vs generator capacity',
          'Verify no overload condition',
          'Test trip settings',
          'Check connections',
        ],
        partNumbers: [
          { brand: 'Schneider', partNo: 'NSX series', price: '48,000' },
          { brand: 'ABB', partNo: 'TMAX series', price: '55,000' },
        ],
        tools: ['Multimeter', 'Clamp ammeter'],
        specifications: [
          { name: 'Rating', value: 'Match generator output' },
          { name: 'Trip Settings', value: 'Coordinate with generator protection' },
        ],
        connections: ['Generator output', 'To ATS generator input'],
        commonFaults: [
          { fault: 'Trip on transfer', cause: 'Inrush current, wrong setting', solution: 'Adjust trip curve' },
          { fault: 'Overload trip', cause: 'Load exceeds generator', solution: 'Reduce load or upsize generator' },
        ],
        maintenanceInterval: 'Test annually',
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// AI QUESTION HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

interface AIQuestion {
  question: string;
  component?: SystemComponent;
  system?: DiagnosticSystem;
}

const AIQuestionPanel = ({
  component,
  system,
  onClose
}: {
  component?: SystemComponent;
  system?: DiagnosticSystem;
  onClose: () => void;
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{role: string; content: string}[]>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setQuestion('');

    try {
      // Build context for the AI
      let context = '';
      if (component) {
        context = `The user is asking about the ${component.name} component.

Description: ${component.description}
Function: ${component.function}
Common Symptoms: ${component.symptoms.join(', ')}
Troubleshooting Steps: ${component.troubleshooting.join('; ')}
Part Numbers: ${component.partNumbers.map(p => `${p.brand}: ${p.partNo} (KES ${p.price})`).join(', ')}
Common Faults: ${component.commonFaults.map(f => `${f.fault}: ${f.cause} → ${f.solution}`).join('; ')}`;
      }
      if (system) {
        context += `\n\nThis is part of the ${system.name}. ${system.flowDescription}`;
      }

      const response = await fetch('/api/generator-oracle/expert-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversation, userMessage],
          systemPrompt: `You are a generator diagnostic expert. Answer questions about generator components with specific, actionable information.

${context}

Always include:
- Specific diagnostic steps
- Part numbers when relevant
- Tool requirements
- Safety warnings if applicable
- Follow-up questions to verify the issue

Be concise but thorough.`
        }),
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.content || data.fallbackContent || 'I apologize, I could not generate a response.' };
      setConversation(prev => [...prev, assistantMessage]);
    } catch (error) {
      setConversation(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your question. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-96 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold text-white">Ask About {component?.name || system?.name}</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="h-72 overflow-y-auto p-4 space-y-3">
        {conversation.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ask any question about {component?.name || system?.name}</p>
            <p className="text-sm mt-2">Examples:</p>
            <p className="text-xs text-slate-600">"How do I test this?"</p>
            <p className="text-xs text-slate-600">"What causes failure?"</p>
          </div>
        )}
        {conversation.map((msg, i) => (
          <div key={i} className={`${msg.role === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-[85%] p-3 rounded-xl ${
              msg.role === 'user'
                ? 'bg-cyan-500/20 text-cyan-100'
                : 'bg-slate-800/50 text-slate-200'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Settings className="w-4 h-4" />
            </motion.div>
            <span className="text-sm">Analyzing...</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleAsk}
            disabled={isLoading || !question.trim()}
            className="p-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 rounded-xl transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FAULT CODE LOOKUP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const FaultCodeLookup = () => {
  const [faultCode, setFaultCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [conversation, setConversation] = useState<{role: string; content: string}[]>([]);

  const searchFaultCode = async () => {
    if (!faultCode.trim()) return;
    setIsSearching(true);

    const userMessage = { role: 'user', content: `What does fault code ${faultCode} mean? Give me the full diagnosis, causes, solutions, and part numbers needed.` };
    setConversation([userMessage]);

    try {
      const response = await fetch('/api/generator-oracle/expert-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [userMessage],
          systemPrompt: `You are a generator fault code expert. When given a fault code, provide:

1. **Code Meaning**: What this fault indicates
2. **Severity**: Shutdown/Warning/Informational
3. **Possible Causes**: List all causes in order of probability
4. **Diagnostic Steps**: Step-by-step troubleshooting
5. **Required Tools**: What tools are needed
6. **Part Numbers**: OEM and aftermarket part numbers with prices in KES
7. **Safety Warnings**: Any safety considerations

After providing the diagnosis, ask:
- "Have you checked [most likely cause]?"
- "What symptoms are you observing?"
- "Did this resolve your issue?"

Be specific and actionable. Include torque specs, wire colors, and pin numbers where relevant.`
        }),
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content || data.fallbackContent || 'Fault code not found in database. Please provide more details about the controller brand and model.'
      };
      setConversation(prev => [...prev, assistantMessage]);
      setResult(data);
    } catch (error) {
      setConversation([{ role: 'assistant', content: 'Error looking up fault code. Please try again.' }]);
    } finally {
      setIsSearching(false);
    }
  };

  const askFollowUp = async (question: string) => {
    if (!question.trim()) return;
    setIsSearching(true);

    const userMessage = { role: 'user', content: question };
    setConversation(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/generator-oracle/expert-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversation, userMessage],
        }),
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.content || 'Please try again.' };
      setConversation(prev => [...prev, assistantMessage]);
    } catch (error) {
      setConversation(prev => [...prev, { role: 'assistant', content: 'Error processing follow-up. Please try again.' }]);
    } finally {
      setIsSearching(false);
    }
  };

  const [followUpInput, setFollowUpInput] = useState('');

  return (
    <div className="space-y-6">
      {/* Fault Code Input */}
      <div className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          Fault Code Lookup
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Enter any fault code from DSE, ComAp, Cummins, CAT, Woodward, SmartGen, or any controller
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={faultCode}
            onChange={(e) => setFaultCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && searchFaultCode()}
            placeholder="Enter fault code (e.g., SPN-111, E020, A001, P0171)"
            className="flex-1 px-4 py-3 bg-slate-900/80 border border-red-500/30 rounded-xl text-white font-mono text-lg placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={searchFaultCode}
            disabled={isSearching}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
          >
            {isSearching ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Settings className="w-5 h-5" />
              </motion.div>
            ) : (
              <Search className="w-5 h-5" />
            )}
            {isSearching ? 'Searching...' : 'Diagnose'}
          </motion.button>
        </div>

        {/* Quick Code Examples */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-slate-500">Examples:</span>
          {['SPN-111', 'SPN-100', 'E020', 'E047', 'A001', 'HGM-15', 'P0171'].map(code => (
            <button
              key={code}
              onClick={() => { setFaultCode(code); }}
              className="px-2 py-1 bg-slate-800/50 text-slate-400 text-xs rounded hover:bg-slate-700/50 hover:text-white transition-colors"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {conversation.length > 0 && (
        <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl space-y-4">
          <h4 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Diagnosis for: <span className="font-mono text-white">{faultCode}</span>
          </h4>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {conversation.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                <div className={`inline-block max-w-full p-4 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/20 text-cyan-100'
                    : 'bg-slate-900/50 text-slate-200'
                }`}>
                  <div className="text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                        .replace(/\n/g, '<br>')
                        .replace(/^(\d+)\./gm, '<span class="text-cyan-400 font-bold">$1.</span>')
                        .replace(/•/g, '<span class="text-cyan-400">•</span>')
                    }}
                  />
                </div>
              </div>
            ))}
            {isSearching && (
              <div className="flex items-center gap-2 text-slate-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Settings className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">Analyzing...</span>
              </div>
            )}
          </div>

          {/* Follow-up Input */}
          <div className="pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-2">Ask a follow-up question:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && followUpInput.trim()) {
                    askFollowUp(followUpInput);
                    setFollowUpInput('');
                  }
                }}
                placeholder="e.g., What part should I replace? What tools do I need?"
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => {
                  if (followUpInput.trim()) {
                    askFollowUp(followUpInput);
                    setFollowUpInput('');
                  }
                }}
                className="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            {/* Quick follow-ups */}
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                'What part should I replace?',
                'What tools do I need?',
                'How long will this take?',
                'Is this a serious issue?',
                'What causes this fault?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => askFollowUp(q)}
                  className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AI PROBLEM SOLVER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const AIProblemSolver = () => {
  const [problem, setProblem] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conversation, setConversation] = useState<{role: string; content: string}[]>([]);
  const [followUpInput, setFollowUpInput] = useState('');

  const analyzeProblem = async () => {
    if (!problem.trim()) return;
    setIsAnalyzing(true);

    const userMessage = { role: 'user', content: problem };
    setConversation([userMessage]);

    try {
      const response = await fetch('/api/generator-oracle/expert-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [userMessage],
          systemPrompt: `You are an expert generator diagnostic technician with 30 years of experience. When a technician describes a problem, you MUST:

1. **Acknowledge the Problem**: Confirm you understand what they're experiencing
2. **Ask Clarifying Questions**: Before diagnosing, ask 2-3 quick questions like:
   - "What brand/model is the generator?"
   - "When did this start happening?"
   - "Any recent maintenance or changes?"

3. **Provide Diagnosis**: Give probable causes in order of likelihood (percentage)
4. **Step-by-Step Troubleshooting**: Detailed steps with specific values
5. **Required Tools**: List exactly what they need
6. **Part Numbers**: Provide OEM part numbers with KES prices
7. **Safety Warnings**: Include ⚠️ warnings where needed

After each response, ALWAYS ask engagement questions:
- "Have you checked this yet?"
- "What did you find?"
- "Did this solve the issue?"
- "Do you need more detail on any step?"
- "What tools do you have available?"

Be conversational but thorough. Use emojis for clarity (⚠️ warning, ✅ done, 🔧 tool needed).`
        }),
      });

      const data = await response.json();
      setConversation(prev => [...prev, { role: 'assistant', content: data.content || 'Please provide more details about the problem.' }]);
    } catch (error) {
      setConversation(prev => [...prev, { role: 'assistant', content: 'Error analyzing problem. Please try again.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const askFollowUp = async (question: string) => {
    if (!question.trim()) return;
    setIsAnalyzing(true);

    const userMessage = { role: 'user', content: question };
    setConversation(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/generator-oracle/expert-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversation, userMessage],
        }),
      });

      const data = await response.json();
      setConversation(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      setConversation(prev => [...prev, { role: 'assistant', content: 'Error processing. Please try again.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Problem Input */}
      <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          AI Problem Solver
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Describe your generator problem in plain language. The AI will diagnose and guide you to the solution.
        </p>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe your problem... e.g., 'The generator is overheating on load', 'Generator won't start', 'ECM not communicating with controller', 'Black smoke under load', 'Voltage fluctuating'"
          className="w-full h-24 px-4 py-3 bg-slate-900/80 border border-cyan-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
        />
        <div className="mt-3 flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500">Quick problems:</span>
            {[
              'Generator overheating on load',
              'Won\'t start',
              'Low oil pressure',
              'Voltage hunting',
              'Black smoke',
            ].map(p => (
              <button
                key={p}
                onClick={() => setProblem(p)}
                className="px-2 py-1 bg-slate-800/50 text-slate-400 text-xs rounded hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyzeProblem}
            disabled={isAnalyzing || !problem.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Settings className="w-5 h-5" />
              </motion.div>
            ) : (
              <Wrench className="w-5 h-5" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Diagnose Problem'}
          </motion.button>
        </div>
      </div>

      {/* Conversation */}
      {conversation.length > 0 && (
        <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl space-y-4">
          <h4 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            AI Diagnosis & Guidance
          </h4>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {conversation.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                <div className={`inline-block max-w-full p-4 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/20 text-cyan-100'
                    : 'bg-slate-900/50 text-slate-200'
                }`}>
                  <div className="text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                        .replace(/\n/g, '<br>')
                        .replace(/^(\d+)\./gm, '<span class="text-cyan-400 font-bold">$1.</span>')
                        .replace(/•/g, '<span class="text-cyan-400">•</span>')
                    }}
                  />
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-slate-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Settings className="w-4 h-4" />
                </motion.div>
                <span className="text-sm">AI is analyzing...</span>
              </div>
            )}
          </div>

          {/* Follow-up Input */}
          <div className="pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-2">Continue the conversation:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && followUpInput.trim()) {
                    askFollowUp(followUpInput);
                    setFollowUpInput('');
                  }
                }}
                placeholder="Type your response or question..."
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => {
                  if (followUpInput.trim()) {
                    askFollowUp(followUpInput);
                    setFollowUpInput('');
                  }
                }}
                className="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            {/* Quick responses */}
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                'Yes, I checked that',
                'No, how do I check?',
                'What part do I need?',
                'Give me more detail',
                'Problem is solved!',
                'Still not working',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => askFollowUp(q)}
                  className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function InteractiveDiagnosticSystem() {
  const [activeTab, setActiveTab] = useState<'systems' | 'faultcode' | 'aisolve'>('systems');
  const [selectedSystem, setSelectedSystem] = useState<DiagnosticSystem | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<SystemComponent | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const colorMap: Record<string, string> = {
    amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
  };

  // If viewing system details, show that instead of tabs
  if (selectedSystem || selectedComponent) {
    // Continue to system/component view...
  } else {
    // Main view with tabs
    return (
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-2 bg-slate-900/60 rounded-2xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('faultcode')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'faultcode'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            Fault Code Lookup
          </button>
          <button
            onClick={() => setActiveTab('aisolve')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'aisolve'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            AI Problem Solver
          </button>
          <button
            onClick={() => setActiveTab('systems')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'systems'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Settings className="w-5 h-5" />
            System Diagrams
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'faultcode' && (
            <motion.div
              key="faultcode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FaultCodeLookup />
            </motion.div>
          )}

          {activeTab === 'aisolve' && (
            <motion.div
              key="aisolve"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AIProblemSolver />
            </motion.div>
          )}

          {activeTab === 'systems' && (
            <motion.div
              key="systems"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Interactive System Diagrams
                </h2>
                <p className="text-slate-400">
                  Click any system to explore clickable components with full diagnostics
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DIAGNOSTIC_SYSTEMS.map((system) => (
                  <motion.button
                    key={system.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSystem(system)}
                    className={`p-6 bg-gradient-to-br ${colorMap[system.color]} border rounded-2xl text-left transition-all group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-900/50 rounded-xl group-hover:scale-110 transition-transform">
                        {system.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{system.name}</h3>
                        <p className="text-sm text-slate-400 mb-3">{system.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {system.components.length} clickable components
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // System Detail View with Components
  if (selectedSystem && !selectedComponent) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedSystem(null)}
              className="p-2 hover:bg-slate-800 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div className="p-3 bg-slate-800 rounded-xl">
              {selectedSystem.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedSystem.name}</h2>
              <p className="text-sm text-slate-400">{selectedSystem.components.length} interactive components</p>
            </div>
          </div>
          <button
            onClick={() => setShowAIPanel(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/30"
          >
            <HelpCircle className="w-5 h-5" />
            Ask AI About {selectedSystem.name}
          </button>
        </div>

        {/* Flow Description */}
        <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
          <h4 className="text-sm font-medium text-slate-300 mb-2">System Flow:</h4>
          <p className="text-sm text-slate-400">{selectedSystem.flowDescription}</p>
        </div>

        {/* Interactive Diagram - Components as clickable cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedSystem.components.map((component) => (
            <motion.button
              key={component.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedComponent(component)}
              className={`p-4 bg-gradient-to-br ${colorMap[selectedSystem.color]} border rounded-xl text-left transition-all relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-900/50 rounded-lg">
                    {component.icon}
                  </div>
                  <span className="font-medium text-white text-sm">{component.name}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{component.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{component.commonFaults.length} common faults</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {showAIPanel && (
            <AIQuestionPanel
              system={selectedSystem}
              onClose={() => setShowAIPanel(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Component Detail View
  if (selectedComponent) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedComponent(null)}
              className="p-2 hover:bg-slate-800 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div className="p-3 bg-slate-800 rounded-xl">
              {selectedComponent.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedComponent.name}</h2>
              <p className="text-sm text-slate-400">{selectedSystem?.name}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAIPanel(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-500/30"
          >
            <HelpCircle className="w-5 h-5" />
            Ask AI
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Description & Function */}
          <div className="space-y-4">
            {/* Description */}
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> Description
              </h4>
              <p className="text-slate-300 text-sm">{selectedComponent.description}</p>
            </div>

            {/* Function */}
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Function
              </h4>
              <p className="text-slate-300 text-sm">{selectedComponent.function}</p>
            </div>

            {/* Specifications */}
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Specifications
              </h4>
              <div className="space-y-2">
                {selectedComponent.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-400">{spec.name}</span>
                    <span className="text-white font-mono">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connections */}
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <Cable className="w-4 h-4" /> Connections
              </h4>
              <ul className="space-y-1">
                {selectedComponent.connections.map((conn, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    {conn}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Symptoms & Troubleshooting */}
          <div className="space-y-4">
            {/* Symptoms */}
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Symptoms of Failure
              </h4>
              <ul className="space-y-2">
                {selectedComponent.symptoms.map((symptom, i) => (
                  <li key={i} className="text-sm text-red-200 flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            {/* Troubleshooting */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4" /> Troubleshooting Steps
              </h4>
              <ol className="space-y-2">
                {selectedComponent.troubleshooting.map((step, i) => (
                  <li key={i} className="text-sm text-amber-200 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Tools Required */}
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4" /> Tools Required
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedComponent.tools.map((tool, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Common Faults */}
        <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
          <h4 className="text-sm font-semibold text-orange-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Common Faults & Solutions
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left border-b border-slate-700">
                  <th className="pb-2 pr-4">Fault</th>
                  <th className="pb-2 pr-4">Cause</th>
                  <th className="pb-2">Solution</th>
                </tr>
              </thead>
              <tbody>
                {selectedComponent.commonFaults.map((fault, i) => (
                  <tr key={i} className="border-b border-slate-700/50">
                    <td className="py-3 pr-4 text-red-300">{fault.fault}</td>
                    <td className="py-3 pr-4 text-slate-300">{fault.cause}</td>
                    <td className="py-3 text-green-300">{fault.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Part Numbers */}
        <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
          <h4 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Part Numbers & Pricing (KES)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left border-b border-slate-700">
                  <th className="pb-2 pr-4">Brand</th>
                  <th className="pb-2 pr-4">Part Number</th>
                  <th className="pb-2">Price (KES)</th>
                </tr>
              </thead>
              <tbody>
                {selectedComponent.partNumbers.map((part, i) => (
                  <tr key={i} className="border-b border-slate-700/50">
                    <td className="py-2 pr-4 text-white">{part.brand}</td>
                    <td className="py-2 pr-4 font-mono text-cyan-300">{part.partNo}</td>
                    <td className="py-2 text-green-300">{part.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Procedure */}
        {selectedComponent.testProcedure && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Test Procedure
            </h4>
            <ol className="space-y-2">
              {selectedComponent.testProcedure.map((step, i) => (
                <li key={i} className="text-sm text-green-200">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Maintenance */}
        {selectedComponent.maintenanceInterval && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Maintenance Interval
            </h4>
            <p className="text-sm text-blue-200">{selectedComponent.maintenanceInterval}</p>
          </div>
        )}

        {/* AI Panel */}
        <AnimatePresence>
          {showAIPanel && (
            <AIQuestionPanel
              component={selectedComponent}
              system={selectedSystem || undefined}
              onClose={() => setShowAIPanel(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}
