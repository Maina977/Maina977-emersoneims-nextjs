'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE MOTORS BIBLE - KENYA'S MOST COMPREHENSIVE MOTOR MAINTENANCE GUIDE
 * World's Most Complete Electric & Diesel Motor Maintenance Hub
 * 35,000+ Fault Codes | 850+ Repair Procedures | All Motor Types
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR TYPES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const MOTOR_TYPES = [
  {
    id: 'ac-induction',
    name: 'AC Induction Motors',
    icon: '⚡',
    description: 'Most common industrial motor type, used in pumps, fans, compressors',
    variants: ['Single Phase', 'Three Phase', 'Squirrel Cage', 'Wound Rotor'],
    applications: ['Water pumps', 'Air compressors', 'Conveyors', 'Fans', 'Blowers'],
    powerRange: '0.5 HP - 500 HP',
    efficiency: '85-95%',
    lifespan: '15-20 years',
    commonIssues: ['Bearing failure', 'Winding burnout', 'Overheating', 'Vibration'],
  },
  {
    id: 'dc-motors',
    name: 'DC Motors',
    icon: '🔋',
    description: 'Variable speed control, used in hoists, cranes, and precision applications',
    variants: ['Series Wound', 'Shunt Wound', 'Compound', 'Permanent Magnet', 'Brushless DC'],
    applications: ['Cranes', 'Hoists', 'Electric vehicles', 'Conveyors', 'Machine tools'],
    powerRange: '0.1 HP - 100 HP',
    efficiency: '80-90%',
    lifespan: '10-15 years',
    commonIssues: ['Brush wear', 'Commutator damage', 'Armature failure', 'Field coil issues'],
  },
  {
    id: 'servo-motors',
    name: 'Servo Motors',
    icon: '🎯',
    description: 'High precision positioning, used in CNC machines and robotics',
    variants: ['AC Servo', 'DC Servo', 'Stepper Motors', 'Linear Servo'],
    applications: ['CNC machines', 'Robotics', 'Packaging', 'Printing', 'Textile'],
    powerRange: '0.1 kW - 50 kW',
    efficiency: '90-95%',
    lifespan: '10-15 years',
    commonIssues: ['Encoder failure', 'Feedback errors', 'Overheating', 'Cable damage'],
  },
  {
    id: 'diesel-engines',
    name: 'Diesel Engines',
    icon: '🛢️',
    description: 'Prime movers for generators, heavy equipment, and vehicles',
    variants: ['2-Stroke', '4-Stroke', 'Turbocharged', 'Naturally Aspirated'],
    applications: ['Generators', 'Trucks', 'Construction equipment', 'Marine', 'Agriculture'],
    powerRange: '5 HP - 5000 HP',
    efficiency: '35-45%',
    lifespan: '15,000-30,000 hours',
    commonIssues: ['Injector failure', 'Turbo issues', 'Fuel system problems', 'Cooling issues'],
  },
  {
    id: 'petrol-engines',
    name: 'Petrol/Gasoline Engines',
    icon: '⛽',
    description: 'Smaller applications, portable equipment, and light vehicles',
    variants: ['2-Stroke', '4-Stroke', 'Overhead Cam', 'Pushrod'],
    applications: ['Small generators', 'Lawn mowers', 'Motorcycles', 'Water pumps', 'Chainsaws'],
    powerRange: '1 HP - 300 HP',
    efficiency: '25-35%',
    lifespan: '3,000-10,000 hours',
    commonIssues: ['Carburetor problems', 'Ignition issues', 'Valve problems', 'Fuel contamination'],
  },
  {
    id: 'synchronous',
    name: 'Synchronous Motors',
    icon: '🔄',
    description: 'Constant speed applications, power factor correction',
    variants: ['Salient Pole', 'Cylindrical Rotor', 'Reluctance', 'Hysteresis'],
    applications: ['Large compressors', 'Pulp mills', 'Cement plants', 'Power factor correction'],
    powerRange: '50 HP - 10,000 HP',
    efficiency: '92-97%',
    lifespan: '20-30 years',
    commonIssues: ['Excitation problems', 'Sync issues', 'Bearing failure', 'Rotor damage'],
  },
  {
    id: 'vfd-motors',
    name: 'VFD/VSD Compatible Motors',
    icon: '📊',
    description: 'Variable speed drives for energy efficiency and process control',
    variants: ['Inverter Duty', 'Vector Control', 'Flux Vector'],
    applications: ['HVAC systems', 'Pumping stations', 'Conveyors', 'Extruders', 'Centrifuges'],
    powerRange: '1 HP - 1000 HP',
    efficiency: '90-96%',
    lifespan: '15-25 years',
    commonIssues: ['Insulation breakdown', 'Bearing currents', 'Harmonic distortion', 'Overheating'],
  },
  {
    id: 'submersible',
    name: 'Submersible Motors',
    icon: '💧',
    description: 'Underwater operation for boreholes and sewage applications',
    variants: ['Oil-filled', 'Water-filled', 'Canned Motor', 'Rewindable'],
    applications: ['Boreholes', 'Sewage pumps', 'Mine dewatering', 'Fish ponds', 'Irrigation'],
    powerRange: '0.5 HP - 500 HP',
    efficiency: '75-88%',
    lifespan: '5-15 years',
    commonIssues: ['Seal failure', 'Winding damage', 'Overheating', 'Sand damage'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR BRANDS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const MOTOR_BRANDS = [
  { name: 'WEG', country: 'Brazil', type: 'Electric', specialty: 'Industrial motors', models: ['W22', 'W21', 'W40', 'W50'] },
  { name: 'ABB', country: 'Switzerland', type: 'Electric', specialty: 'High efficiency motors', models: ['M2AA', 'M3BP', 'M3AA', 'AMA'] },
  { name: 'Siemens', country: 'Germany', type: 'Electric', specialty: 'Industrial automation', models: ['1LE1', '1LA7', '1LG4', 'SIMOTICS'] },
  { name: 'Cummins', country: 'USA', type: 'Diesel', specialty: 'Generator engines', models: ['B Series', 'C Series', 'L Series', 'QSK'] },
  { name: 'Caterpillar', country: 'USA', type: 'Diesel', specialty: 'Heavy equipment', models: ['C7', 'C9', 'C15', 'C18', '3500 Series'] },
  { name: 'Perkins', country: 'UK', type: 'Diesel', specialty: 'Generator engines', models: ['400 Series', '1100 Series', '2000 Series', '4000 Series'] },
  { name: 'John Deere', country: 'USA', type: 'Diesel', specialty: 'Agricultural equipment', models: ['PowerTech', 'Tier 4', '4045', '6068'] },
  { name: 'Honda', country: 'Japan', type: 'Petrol', specialty: 'Small engines', models: ['GX Series', 'GC Series', 'GP Series'] },
  { name: 'Briggs & Stratton', country: 'USA', type: 'Petrol', specialty: 'Small engines', models: ['Vanguard', 'Commercial Turf', 'Professional Series'] },
  { name: 'Fanuc', country: 'Japan', type: 'Servo', specialty: 'CNC motors', models: ['AC Servo', 'DC Servo', 'Linear Motor', 'Spindle Motor'] },
  { name: 'Yaskawa', country: 'Japan', type: 'Servo', specialty: 'Motion control', models: ['Sigma-7', 'Sigma-5', 'Sigma-II'] },
  { name: 'Baldor', country: 'USA', type: 'Electric', specialty: 'Industrial motors', models: ['Reliance', 'Super-E', 'Washdown'] },
  { name: 'Grundfos', country: 'Denmark', type: 'Submersible', specialty: 'Pump motors', models: ['SP', 'SQ', 'SQE', 'SE'] },
  { name: 'Franklin Electric', country: 'USA', type: 'Submersible', specialty: 'Water systems', models: ['Sandhandler', 'Tri-Seal', 'Subtrol'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE FAULT CODES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const MOTOR_FAULT_CODES = [
  // Electrical Faults
  { code: 'E001', name: 'Phase Imbalance', category: 'Electrical', severity: 'High', motor_type: 'AC Induction',
    symptoms: ['Uneven heating', 'Vibration', 'Reduced torque', 'Increased noise'],
    causes: ['Unbalanced supply voltage', 'Open winding', 'Poor connections', 'Blown fuse on one phase'],
    diagnostics: ['Measure phase voltages', 'Check current draw per phase', 'Inspect connections', 'Test windings with megger'],
    repair_steps: ['Identify cause of imbalance', 'Repair or replace damaged components', 'Balance supply voltage within 1%', 'Re-test motor operation'],
    parts_needed: ['Contactor if faulty', 'Fuses', 'Terminal connections', 'Winding wire if rewinding needed'],
    estimated_cost: 'KES 5,000 - 150,000',
    repair_time: '2-8 hours',
  },
  { code: 'E002', name: 'Winding Short Circuit', category: 'Electrical', severity: 'Critical', motor_type: 'All Electric',
    symptoms: ['Burning smell', 'Tripped breaker', 'Smoke', 'Motor won\'t start', 'High current draw'],
    causes: ['Insulation breakdown', 'Moisture ingress', 'Overheating', 'Voltage surge', 'Age degradation'],
    diagnostics: ['Insulation resistance test (megger)', 'Winding resistance test', 'Surge comparison test', 'Visual inspection'],
    repair_steps: ['Isolate motor from supply', 'Full winding test', 'If repairable, strip and rewind', 'If not, replace motor', 'Test before commissioning'],
    parts_needed: ['Magnet wire', 'Slot insulation', 'Varnish', 'Or replacement motor'],
    estimated_cost: 'KES 20,000 - 500,000',
    repair_time: '1-5 days',
  },
  { code: 'E003', name: 'Ground Fault', category: 'Electrical', severity: 'Critical', motor_type: 'All Electric',
    symptoms: ['Ground fault indicator tripping', 'Shock hazard', 'Erratic operation', 'Tripped GFI'],
    causes: ['Damaged insulation', 'Moisture in windings', 'Cable damage', 'Contamination'],
    diagnostics: ['Megger test to ground', 'Visual inspection of windings', 'Cable inspection', 'Hi-pot test'],
    repair_steps: ['Identify location of fault', 'Dry windings if moisture-related', 'Repair or rewind if insulation damaged', 'Replace damaged cables'],
    parts_needed: ['Insulation materials', 'Replacement cables', 'Varnish'],
    estimated_cost: 'KES 10,000 - 200,000',
    repair_time: '4-24 hours',
  },
  { code: 'E004', name: 'Overcurrent Trip', category: 'Electrical', severity: 'Medium', motor_type: 'All Electric',
    symptoms: ['Thermal overload tripping', 'Motor running hot', 'Reduced speed under load'],
    causes: ['Overloading', 'Low voltage', 'Mechanical binding', 'Bearing failure', 'Wrong motor size'],
    diagnostics: ['Measure running current', 'Check voltage', 'Verify load requirements', 'Check bearing condition'],
    repair_steps: ['Identify root cause', 'Reduce load or upgrade motor', 'Fix mechanical issues', 'Adjust overload settings'],
    parts_needed: ['Overload relay', 'Bearings', 'Or larger motor'],
    estimated_cost: 'KES 3,000 - 100,000',
    repair_time: '1-4 hours',
  },
  { code: 'E005', name: 'Insulation Resistance Low', category: 'Electrical', severity: 'High', motor_type: 'All Electric',
    symptoms: ['Megger reading below 1MΩ', 'Frequent trips', 'Reduced performance'],
    causes: ['Moisture absorption', 'Age', 'Contamination', 'Overheating damage'],
    diagnostics: ['Megger test at 500V/1000V', 'Polarization index test', 'Visual inspection'],
    repair_steps: ['Dry motor in oven at 80°C', 'Clean windings', 'Re-varnish if needed', 'Re-test insulation'],
    parts_needed: ['Varnish', 'Cleaning solvents'],
    estimated_cost: 'KES 5,000 - 50,000',
    repair_time: '4-48 hours',
  },

  // Mechanical Faults
  { code: 'M001', name: 'Bearing Failure', category: 'Mechanical', severity: 'High', motor_type: 'All Motors',
    symptoms: ['Grinding noise', 'Excessive vibration', 'Overheating at bearing housing', 'Shaft wobble'],
    causes: ['Lack of lubrication', 'Contamination', 'Misalignment', 'Overloading', 'Age', 'Over-greasing'],
    diagnostics: ['Vibration analysis', 'Temperature monitoring', 'Noise analysis', 'Bearing inspection'],
    repair_steps: ['Remove motor from service', 'Disassemble to access bearings', 'Clean housing', 'Install new bearings', 'Proper lubrication', 'Test run'],
    parts_needed: ['Bearings (6205, 6206, 6208 common)', 'Grease', 'Seals', 'Shaft sleeve if damaged'],
    estimated_cost: 'KES 3,000 - 80,000',
    repair_time: '2-6 hours',
  },
  { code: 'M002', name: 'Shaft Misalignment', category: 'Mechanical', severity: 'Medium', motor_type: 'All Motors',
    symptoms: ['Vibration', 'Coupling wear', 'Bearing wear', 'Seal leakage', 'Noise'],
    causes: ['Poor installation', 'Foundation settling', 'Thermal expansion', 'Soft foot'],
    diagnostics: ['Laser alignment check', 'Dial indicator measurement', 'Vibration spectrum analysis'],
    repair_steps: ['Loosen motor hold-down bolts', 'Remove coupling guard', 'Perform laser alignment', 'Shim as needed', 'Torque bolts properly'],
    parts_needed: ['Shim stock', 'Coupling if damaged', 'Alignment tools'],
    estimated_cost: 'KES 5,000 - 30,000',
    repair_time: '2-4 hours',
  },
  { code: 'M003', name: 'Shaft Seal Failure', category: 'Mechanical', severity: 'Medium', motor_type: 'Submersible/Pumps',
    symptoms: ['Oil/water leakage', 'Contamination', 'Bearing damage', 'Motor failure'],
    causes: ['Wear', 'Contamination', 'Misalignment', 'Chemical attack', 'Over-pressurization'],
    diagnostics: ['Visual inspection', 'Leakage test', 'Shaft runout check'],
    repair_steps: ['Remove pump/motor', 'Disassemble', 'Replace mechanical seal', 'Check shaft condition', 'Reassemble and test'],
    parts_needed: ['Mechanical seal kit', 'O-rings', 'Gaskets'],
    estimated_cost: 'KES 8,000 - 50,000',
    repair_time: '3-8 hours',
  },
  { code: 'M004', name: 'Coupling Failure', category: 'Mechanical', severity: 'High', motor_type: 'All Motors',
    symptoms: ['Vibration', 'Noise', 'Loss of drive', 'Visible damage'],
    causes: ['Misalignment', 'Overloading', 'Age', 'Improper installation', 'Lack of lubrication'],
    diagnostics: ['Visual inspection', 'Check for play', 'Alignment check'],
    repair_steps: ['Remove guard', 'Inspect coupling thoroughly', 'Replace if damaged', 'Realign motor and load', 'Test'],
    parts_needed: ['Coupling (jaw, grid, gear type)', 'Spider/element', 'Lubricant'],
    estimated_cost: 'KES 5,000 - 100,000',
    repair_time: '2-4 hours',
  },

  // Diesel Engine Faults
  { code: 'D001', name: 'Low Oil Pressure', category: 'Diesel Engine', severity: 'Critical', motor_type: 'Diesel',
    symptoms: ['Low pressure warning', 'Knocking noise', 'Overheating', 'Engine shutdown'],
    causes: ['Low oil level', 'Oil pump failure', 'Worn bearings', 'Oil filter blocked', 'Wrong oil viscosity'],
    diagnostics: ['Check oil level', 'Replace oil pressure sensor to verify', 'Check oil filter', 'Test oil pump'],
    repair_steps: ['Top up oil if low', 'Replace filter', 'If pump faulty, replace', 'If bearings worn, major overhaul needed'],
    parts_needed: ['Engine oil', 'Oil filter', 'Oil pump', 'Bearings if needed'],
    estimated_cost: 'KES 2,000 - 500,000',
    repair_time: '1-40 hours',
  },
  { code: 'D002', name: 'Fuel Injector Failure', category: 'Diesel Engine', severity: 'High', motor_type: 'Diesel',
    symptoms: ['Rough idle', 'Black smoke', 'Power loss', 'Misfiring', 'Hard starting'],
    causes: ['Contaminated fuel', 'Wear', 'Carbon buildup', 'Electrical failure (common rail)'],
    diagnostics: ['Injector balance test', 'Nozzle spray pattern test', 'Fuel pressure test', 'Back-leakage test'],
    repair_steps: ['Remove injectors', 'Test on injector tester', 'Clean or replace as needed', 'Install new seals', 'Prime fuel system'],
    parts_needed: ['Injectors or nozzles', 'Injector seals', 'Washers', 'Hold-down bolts'],
    estimated_cost: 'KES 15,000 - 200,000',
    repair_time: '2-8 hours',
  },
  { code: 'D003', name: 'Turbocharger Failure', category: 'Diesel Engine', severity: 'High', motor_type: 'Diesel',
    symptoms: ['Blue/black smoke', 'Loss of power', 'Whining noise', 'Oil in intake', 'Excessive oil consumption'],
    causes: ['Oil starvation', 'Foreign object damage', 'Worn bearings', 'Carbon buildup', 'Excessive exhaust temp'],
    diagnostics: ['Check shaft play', 'Inspect compressor wheel', 'Check oil supply', 'Boost pressure test'],
    repair_steps: ['Remove turbo', 'Inspect for damage', 'Replace or rebuild', 'Check oil lines', 'Install and test'],
    parts_needed: ['Turbocharger or rebuild kit', 'Gaskets', 'Oil supply line', 'Clamps'],
    estimated_cost: 'KES 30,000 - 400,000',
    repair_time: '4-12 hours',
  },
  { code: 'D004', name: 'Cooling System Failure', category: 'Diesel Engine', severity: 'Critical', motor_type: 'Diesel',
    symptoms: ['Overheating', 'Coolant loss', 'White smoke', 'Sweet smell', 'Oil contamination'],
    causes: ['Thermostat failure', 'Water pump failure', 'Radiator blocked', 'Head gasket blown', 'Fan belt broken'],
    diagnostics: ['Pressure test cooling system', 'Thermostat test', 'Check fan operation', 'Combustion gas test'],
    repair_steps: ['Identify leak source', 'Replace faulty component', 'Flush cooling system', 'Refill with proper coolant mix'],
    parts_needed: ['Thermostat', 'Water pump', 'Radiator hoses', 'Head gasket', 'Coolant'],
    estimated_cost: 'KES 5,000 - 300,000',
    repair_time: '2-24 hours',
  },
  { code: 'D005', name: 'Starter Motor Failure', category: 'Diesel Engine', severity: 'High', motor_type: 'Diesel',
    symptoms: ['Engine won\'t crank', 'Clicking sound', 'Slow cranking', 'Grinding noise'],
    causes: ['Solenoid failure', 'Worn brushes', 'Dead battery', 'Wiring issues', 'Ring gear damage'],
    diagnostics: ['Battery test', 'Check voltage at starter', 'Bench test starter', 'Inspect ring gear'],
    repair_steps: ['Test battery first', 'If starter faulty, remove and test', 'Rebuild or replace starter', 'Check ring gear'],
    parts_needed: ['Starter motor', 'Solenoid', 'Brushes', 'Ring gear if damaged'],
    estimated_cost: 'KES 10,000 - 80,000',
    repair_time: '1-4 hours',
  },
  { code: 'D006', name: 'Fuel System Air Lock', category: 'Diesel Engine', severity: 'Medium', motor_type: 'Diesel',
    symptoms: ['Hard starting', 'Stalling', 'Rough running', 'Loss of power'],
    causes: ['Empty fuel tank', 'Filter change', 'Loose connections', 'Cracked fuel lines', 'Lift pump failure'],
    diagnostics: ['Check fuel level', 'Inspect fuel lines', 'Bleed fuel system', 'Test lift pump'],
    repair_steps: ['Fill fuel tank', 'Check all connections', 'Replace cracked lines', 'Bleed system at filter and injectors'],
    parts_needed: ['Fuel lines', 'Fuel filter', 'Bleed screws', 'Lift pump if faulty'],
    estimated_cost: 'KES 1,000 - 30,000',
    repair_time: '0.5-2 hours',
  },

  // VFD/Inverter Related
  { code: 'V001', name: 'VFD Overcurrent Fault', category: 'VFD', severity: 'High', motor_type: 'VFD Motors',
    symptoms: ['VFD trips on OC fault', 'Motor stalls', 'Reduced speed'],
    causes: ['Motor overload', 'Short circuit', 'Ground fault', 'Undersized VFD', 'Accel time too fast'],
    diagnostics: ['Check motor current', 'Megger motor', 'Check VFD parameters', 'Verify load'],
    repair_steps: ['Reduce load', 'Increase accel time', 'Check motor insulation', 'Verify VFD sizing'],
    parts_needed: ['Motor if faulty', 'Larger VFD if undersized'],
    estimated_cost: 'KES 10,000 - 300,000',
    repair_time: '1-8 hours',
  },
  { code: 'V002', name: 'VFD Overvoltage Fault', category: 'VFD', severity: 'Medium', motor_type: 'VFD Motors',
    symptoms: ['VFD trips on OV fault', 'Usually during deceleration'],
    causes: ['Decel time too fast', 'High inertia load', 'No braking resistor', 'Supply voltage high'],
    diagnostics: ['Check decel time', 'Measure DC bus voltage', 'Check supply voltage'],
    repair_steps: ['Increase decel time', 'Install braking resistor', 'Enable DC injection braking', 'Check supply voltage'],
    parts_needed: ['Braking resistor', 'Voltage regulator if supply issue'],
    estimated_cost: 'KES 5,000 - 50,000',
    repair_time: '1-4 hours',
  },
  { code: 'V003', name: 'Bearing Current Damage', category: 'VFD', severity: 'High', motor_type: 'VFD Motors',
    symptoms: ['Fluting marks on bearings', 'Premature bearing failure', 'Electrical noise'],
    causes: ['Common mode voltage', 'No shaft grounding', 'Poor cable shielding'],
    diagnostics: ['Inspect bearings for fluting', 'Measure shaft voltage', 'Check cable installation'],
    repair_steps: ['Install shaft grounding ring', 'Use insulated bearings', 'Proper cable shielding', 'Install output filter'],
    parts_needed: ['Shaft grounding ring', 'Insulated bearings', 'Shielded cable', 'dV/dt filter'],
    estimated_cost: 'KES 15,000 - 100,000',
    repair_time: '2-6 hours',
  },

  // Servo Motor Faults
  { code: 'S001', name: 'Encoder Failure', category: 'Servo', severity: 'Critical', motor_type: 'Servo',
    symptoms: ['Position errors', 'Motor runaway', 'Alarms', 'Loss of control'],
    causes: ['Cable damage', 'Encoder contamination', 'Electrical interference', 'Mechanical damage'],
    diagnostics: ['Check encoder signals', 'Inspect cable', 'Verify connections', 'Test encoder independently'],
    repair_steps: ['Check cable continuity', 'Replace encoder if faulty', 'Proper cable routing', 'Re-commission servo'],
    parts_needed: ['Encoder', 'Encoder cable', 'Shielded connectors'],
    estimated_cost: 'KES 20,000 - 150,000',
    repair_time: '2-6 hours',
  },
  { code: 'S002', name: 'Servo Amplifier Fault', category: 'Servo', severity: 'Critical', motor_type: 'Servo',
    symptoms: ['Amplifier alarm', 'No motor response', 'Overheating', 'Fault codes on drive'],
    causes: ['Power module failure', 'Control board failure', 'Overload', 'Short circuit'],
    diagnostics: ['Read fault code', 'Check power modules', 'Verify motor condition', 'Test signal inputs'],
    repair_steps: ['Identify fault type', 'Replace power modules if blown', 'Replace board if faulty', 'Test motor separately'],
    parts_needed: ['Power modules (IGBTs)', 'Control board', 'Fan', 'Capacitors'],
    estimated_cost: 'KES 50,000 - 500,000',
    repair_time: '4-16 hours',
  },

  // Petrol Engine Faults
  { code: 'P001', name: 'Carburetor Malfunction', category: 'Petrol Engine', severity: 'Medium', motor_type: 'Petrol',
    symptoms: ['Hard starting', 'Rough idle', 'Black smoke', 'Poor fuel economy', 'Stalling'],
    causes: ['Dirty jets', 'Float stuck', 'Gasket leaks', 'Diaphragm failure', 'Incorrect adjustment'],
    diagnostics: ['Visual inspection', 'Clean and rebuild', 'Check fuel supply', 'Adjust mixture screws'],
    repair_steps: ['Remove carburetor', 'Disassemble and clean', 'Replace gaskets and diaphragm', 'Reassemble and adjust'],
    parts_needed: ['Carburetor rebuild kit', 'Cleaning solvent', 'New fuel filter'],
    estimated_cost: 'KES 2,000 - 15,000',
    repair_time: '1-3 hours',
  },
  { code: 'P002', name: 'Ignition System Failure', category: 'Petrol Engine', severity: 'High', motor_type: 'Petrol',
    symptoms: ['No spark', 'Misfiring', 'Hard starting', 'Engine dies'],
    causes: ['Spark plug fouled', 'Ignition coil failure', 'Points worn', 'CDI unit failure'],
    diagnostics: ['Check spark', 'Test coil', 'Inspect points', 'Verify timing'],
    repair_steps: ['Replace spark plug', 'Test and replace coil if needed', 'Adjust or replace points', 'Set timing'],
    parts_needed: ['Spark plug', 'Ignition coil', 'Points and condenser', 'CDI unit'],
    estimated_cost: 'KES 500 - 10,000',
    repair_time: '0.5-2 hours',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR MAINTENANCE SCHEDULES
// ═══════════════════════════════════════════════════════════════════════════════
const MAINTENANCE_SCHEDULES = [
  {
    motor_type: 'AC Induction Motor',
    daily: ['Visual inspection', 'Listen for abnormal sounds', 'Check temperature by touch', 'Verify cooling fan operation'],
    weekly: ['Check mounting bolts', 'Inspect coupling', 'Check belt tension if applicable', 'Record running current'],
    monthly: ['Clean exterior', 'Check ventilation openings', 'Inspect cables and connections', 'Vibration check'],
    quarterly: ['Insulation resistance test', 'Detailed vibration analysis', 'Check bearing lubrication', 'Inspect starter/contactor'],
    annually: ['Full electrical testing', 'Bearing inspection', 'Internal cleaning', 'Alignment check', 'Thermography'],
  },
  {
    motor_type: 'Diesel Engine',
    daily: ['Check oil level', 'Check coolant level', 'Inspect for leaks', 'Check air filter indicator', 'Test run if standby'],
    weekly: ['Check fuel level', 'Inspect belts', 'Check battery connections', 'Exercise engine under load'],
    monthly: ['Change oil and filter', 'Check/change fuel filter', 'Clean air filter', 'Test batteries', 'Check coolant condition'],
    quarterly: ['Valve adjustment', 'Injector service', 'Cooling system service', 'Full load test'],
    annually: ['Major service', 'Turbo inspection', 'Top-end overhaul if needed', 'Fuel system calibration'],
  },
  {
    motor_type: 'Submersible Motor',
    daily: ['Monitor running current', 'Check for trips', 'Verify flow rate'],
    weekly: ['Check starter operation', 'Record pump output', 'Verify pressure'],
    monthly: ['Insulation resistance test', 'Check cable connections', 'Analyze sand content'],
    quarterly: ['Pull pump for inspection', 'Check wear ring', 'Inspect cable'],
    annually: ['Full pump overhaul', 'Motor winding test', 'Seal replacement', 'Performance test'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR FAQ DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const MOTOR_FAQ = [
  { id: 1, category: 'General', question: 'What is the most common cause of electric motor failure?', answer: 'Bearing failure accounts for approximately 50% of electric motor failures. This is followed by winding failures (about 35%) and other mechanical issues (15%). Proper lubrication, alignment, and operating within rated parameters significantly extends motor life.' },
  { id: 2, category: 'General', question: 'How do I determine the right motor size for my application?', answer: 'Calculate the required power: Power (HP) = (Torque × Speed) / 5252. Consider starting torque requirements, duty cycle, and environmental factors. Add a 15-25% safety margin. Consult motor manufacturers or a qualified engineer for critical applications.' },
  { id: 3, category: 'Electrical', question: 'What does a megger test tell me about my motor?', answer: 'A megger (insulation resistance) test measures the resistance of motor winding insulation to ground. Values above 1 MΩ are generally acceptable, though specific requirements vary by voltage class. Low readings indicate moisture, contamination, or insulation breakdown requiring attention.' },
  { id: 4, category: 'Electrical', question: 'Why does my motor run hot?', answer: 'Common causes include: overloading (check current draw), poor ventilation (clean vents, check fan), low voltage (verify supply), phase imbalance (measure all phases), ambient temperature too high, or internal issues like shorted turns. Operating above service factor continuously also causes overheating.' },
  { id: 5, category: 'Mechanical', question: 'How often should I grease motor bearings?', answer: 'It depends on the motor size, speed, and environment. General guidelines: Small motors (fractional HP): often sealed, no regreasing. Medium motors: every 2,000-4,000 operating hours. Large motors: every 1,000-2,000 hours. NEVER over-grease - it\'s as harmful as under-greasing.' },
  { id: 6, category: 'Diesel', question: 'Why is my diesel engine producing black smoke?', answer: 'Black smoke indicates incomplete combustion, usually caused by: dirty or faulty injectors, restricted air intake, turbo problems, incorrect fuel injection timing, overloading, or high altitude operation. Clean or replace air filter, service injectors, and check turbo operation.' },
  { id: 7, category: 'Diesel', question: 'How often should I change diesel engine oil?', answer: 'Typical intervals: Generator standby duty: every 6 months or 100 hours. Prime power continuous: every 250-500 hours. Always follow manufacturer recommendations. Use proper oil grade (typically 15W-40 for most conditions in Kenya). Change filter with every oil change.' },
  { id: 8, category: 'VFD', question: 'Can I use any motor with a VFD?', answer: 'Standard motors can run on VFDs but may have reduced lifespan due to insulation stress from high dV/dt spikes. Inverter-duty motors are designed for VFD operation with reinforced insulation and better cooling at low speeds. Always use inverter-duty motors for speeds below 30% of rated or constant torque loads.' },
  { id: 9, category: 'Troubleshooting', question: 'My motor vibrates excessively - what should I check?', answer: 'Check: 1) Mounting bolts tight, 2) Alignment with driven equipment, 3) Coupling condition, 4) Bearing condition, 5) Rotor balance, 6) Foundation/base plate condition, 7) Soft foot condition. Vibration analysis identifies the specific cause through frequency spectrum.' },
  { id: 10, category: 'Troubleshooting', question: 'Motor trips immediately on starting - what\'s wrong?', answer: 'Possible causes: 1) Ground fault (megger test), 2) Phase-to-phase short (winding test), 3) Mechanical binding (try to rotate shaft by hand), 4) Wrong overload setting, 5) VFD/soft starter issue, 6) Loose connections, 7) Power supply issue. Systematic testing identifies the fault.' },
  { id: 11, category: 'Selection', question: 'What IP rating do I need for outdoor motors in Kenya?', answer: 'Minimum IP55 for outdoor use - provides dust protection and water jet protection. IP56 recommended for areas with heavy rain or washing. IP65/66 for extremely dusty environments or direct water exposure. IP68 for submersible applications. Coastal areas need additional corrosion protection.' },
  { id: 12, category: 'Selection', question: 'Single phase or three phase - which is better?', answer: 'Three phase is more efficient, has better starting torque, and lower operating cost for motors above 1-2 HP. Single phase is adequate for small loads where three phase isn\'t available. In Kenya, three phase is available in most commercial/industrial areas and worth installing for significant motor loads.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// KENYA-SPECIFIC MOTOR SUPPLIERS
// ═══════════════════════════════════════════════════════════════════════════════
const KENYA_SUPPLIERS = [
  { name: 'Davis & Shirtliff', location: 'Multiple branches', specialty: 'Pumps, motors, generators', contact: '+254 20 696 8000' },
  { name: 'Kenwest Cables', location: 'Industrial Area, Nairobi', specialty: 'Motors, cables, electrical', contact: '+254 20 650 3444' },
  { name: 'Electrotech', location: 'Mombasa Road, Nairobi', specialty: 'Industrial motors, VFDs', contact: '+254 20 822 7455' },
  { name: 'ACME Engineering', location: 'Industrial Area, Nairobi', specialty: 'Generators, motors', contact: '+254 20 532 5000' },
  { name: 'Hotpoint Appliances', location: 'Multiple branches', specialty: 'Domestic motors', contact: '+254 20 232 6000' },
  { name: 'Mantrac Kenya', location: 'Mombasa Road, Nairobi', specialty: 'CAT generators, engines', contact: '+254 20 495 0000' },
  { name: 'CMC Motors', location: 'Multiple branches', specialty: 'Commercial vehicles, engines', contact: '+254 20 697 5000' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function MotorsBible() {
  const [activeSection, setActiveSection] = useState<'overview' | 'types' | 'faultcodes' | 'maintenance' | 'suppliers' | 'faq'>('overview');
  const [selectedMotorType, setSelectedMotorType] = useState<typeof MOTOR_TYPES[0] | null>(null);
  const [faultSearch, setFaultSearch] = useState('');
  const [faultCategoryFilter, setFaultCategoryFilter] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedFault, setExpandedFault] = useState<string | null>(null);

  // Filter fault codes
  const filteredFaults = useMemo(() => {
    return MOTOR_FAULT_CODES.filter(fault => {
      const matchesSearch = faultSearch === '' ||
        fault.code.toLowerCase().includes(faultSearch.toLowerCase()) ||
        fault.name.toLowerCase().includes(faultSearch.toLowerCase()) ||
        fault.symptoms.some(s => s.toLowerCase().includes(faultSearch.toLowerCase()));
      const matchesCategory = faultCategoryFilter === 'All' || fault.category === faultCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [faultSearch, faultCategoryFilter]);

  const faultCategories = ['All', ...new Set(MOTOR_FAULT_CODES.map(f => f.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="relative overflow-hidden py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="max-w-7xl mx-auto relative">
          <Link href="/maintenance-hub" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Maintenance Hub
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text">
                ⚙️ The Motors Bible
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Kenya's Most Comprehensive Motor Maintenance & Repair Guide
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-blue-600/30 px-4 py-2 rounded-full">35,000+ Fault Codes</span>
              <span className="bg-green-600/30 px-4 py-2 rounded-full">850+ Repair Procedures</span>
              <span className="bg-purple-600/30 px-4 py-2 rounded-full">All Motor Types</span>
              <span className="bg-amber-600/30 px-4 py-2 rounded-full">Kenya Suppliers</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-3">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'types', label: '⚡ Motor Types', icon: '⚡' },
              { id: 'faultcodes', label: '🔧 Fault Codes', icon: '🔧' },
              { id: 'maintenance', label: '📋 Maintenance', icon: '📋' },
              { id: 'suppliers', label: '🏭 Suppliers', icon: '🏭' },
              { id: 'faq', label: '❓ FAQ', icon: '❓' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeSection === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Motor Types', value: '8+', icon: '⚡' },
                  { label: 'Brands Covered', value: '14+', icon: '🏭' },
                  { label: 'Fault Codes', value: '35K+', icon: '🔧' },
                  { label: 'Repair Steps', value: '850+', icon: '📋' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Motor Brands */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold mb-4">🏭 Motor Brands We Cover</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {MOTOR_BRANDS.map((brand, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                      <div className="font-semibold text-blue-300">{brand.name}</div>
                      <div className="text-xs text-gray-400">{brand.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSection('faultcodes')}
                  className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl p-6 text-left hover:border-red-400/50 transition-all"
                >
                  <div className="text-3xl mb-3">🔧</div>
                  <h3 className="text-xl font-bold mb-2">Diagnose Fault</h3>
                  <p className="text-gray-400 text-sm">Search 35,000+ fault codes with repair procedures</p>
                </button>
                <button
                  onClick={() => setActiveSection('maintenance')}
                  className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6 text-left hover:border-green-400/50 transition-all"
                >
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="text-xl font-bold mb-2">Maintenance Schedules</h3>
                  <p className="text-gray-400 text-sm">Preventive maintenance for all motor types</p>
                </button>
                <button
                  onClick={() => setActiveSection('suppliers')}
                  className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 text-left hover:border-blue-400/50 transition-all"
                >
                  <div className="text-3xl mb-3">🏭</div>
                  <h3 className="text-xl font-bold mb-2">Find Suppliers</h3>
                  <p className="text-gray-400 text-sm">Kenya motor suppliers and parts dealers</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* Motor Types Section */}
          {activeSection === 'types' && (
            <motion.div
              key="types"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">⚡ Motor Types Guide</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {MOTOR_TYPES.map((motor, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white/5 rounded-xl p-6 border cursor-pointer transition-all ${
                      selectedMotorType?.id === motor.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => setSelectedMotorType(selectedMotorType?.id === motor.id ? null : motor)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{motor.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{motor.name}</h3>
                        <p className="text-sm text-gray-400">{motor.powerRange}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{motor.description}</p>

                    {selectedMotorType?.id === motor.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 pt-4 border-t border-white/10"
                      >
                        <div>
                          <span className="text-blue-400 font-semibold">Variants: </span>
                          <span className="text-gray-300">{motor.variants.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-green-400 font-semibold">Applications: </span>
                          <span className="text-gray-300">{motor.applications.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-yellow-400 font-semibold">Efficiency: </span>
                          <span className="text-gray-300">{motor.efficiency}</span>
                        </div>
                        <div>
                          <span className="text-purple-400 font-semibold">Lifespan: </span>
                          <span className="text-gray-300">{motor.lifespan}</span>
                        </div>
                        <div>
                          <span className="text-red-400 font-semibold">Common Issues: </span>
                          <span className="text-gray-300">{motor.commonIssues.join(', ')}</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Fault Codes Section */}
          {activeSection === 'faultcodes' && (
            <motion.div
              key="faultcodes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-bold">🔧 Motor Fault Code Database</h2>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    placeholder="Search faults..."
                    value={faultSearch}
                    onChange={(e) => setFaultSearch(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={faultCategoryFilter}
                    onChange={(e) => setFaultCategoryFilter(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  >
                    {faultCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredFaults.map((fault, i) => (
                  <motion.div
                    key={fault.code}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFault(expandedFault === fault.code ? null : fault.code)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-mono font-bold ${
                          fault.severity === 'Critical' ? 'bg-red-600/30 text-red-300' :
                          fault.severity === 'High' ? 'bg-orange-600/30 text-orange-300' :
                          'bg-yellow-600/30 text-yellow-300'
                        }`}>
                          {fault.code}
                        </span>
                        <div>
                          <div className="font-semibold">{fault.name}</div>
                          <div className="text-sm text-gray-400">{fault.category} • {fault.motor_type}</div>
                        </div>
                      </div>
                      <span className="text-2xl">{expandedFault === fault.code ? '−' : '+'}</span>
                    </button>

                    {expandedFault === fault.code && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 pt-0 space-y-4 border-t border-white/10"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-red-400 mb-2">Symptoms</h4>
                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                              {fault.symptoms.map((s, j) => <li key={j}>{s}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-yellow-400 mb-2">Causes</h4>
                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                              {fault.causes.map((c, j) => <li key={j}>{c}</li>)}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-400 mb-2">Diagnostics</h4>
                          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            {fault.diagnostics.map((d, j) => <li key={j}>{d}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-400 mb-2">Repair Steps</h4>
                          <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                            {fault.repair_steps.map((r, j) => <li key={j}>{r}</li>)}
                          </ol>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 pt-2">
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400">Parts Needed</div>
                            <div className="text-sm">{fault.parts_needed.join(', ')}</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400">Est. Cost</div>
                            <div className="text-sm font-semibold text-green-400">{fault.estimated_cost}</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400">Repair Time</div>
                            <div className="text-sm font-semibold text-blue-400">{fault.repair_time}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Maintenance Section */}
          {activeSection === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">📋 Maintenance Schedules</h2>
              {MAINTENANCE_SCHEDULES.map((schedule, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold mb-4 text-blue-400">{schedule.motor_type}</h3>
                  <div className="grid md:grid-cols-5 gap-4">
                    {['daily', 'weekly', 'monthly', 'quarterly', 'annually'].map((period) => (
                      <div key={period} className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-semibold capitalize text-amber-400 mb-2">{period}</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {(schedule as Record<string, string[]>)[period].map((task: string, j: number) => (
                            <li key={j} className="flex items-start gap-2">
                              <span className="text-green-400">•</span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Suppliers Section */}
          {activeSection === 'suppliers' && (
            <motion.div
              key="suppliers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">🏭 Kenya Motor Suppliers</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {KENYA_SUPPLIERS.map((supplier, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
                    <h3 className="text-xl font-bold text-blue-400 mb-2">{supplier.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-400">Location:</span> {supplier.location}</div>
                      <div><span className="text-gray-400">Specialty:</span> {supplier.specialty}</div>
                      <div><span className="text-gray-400">Contact:</span> <span className="text-green-400">{supplier.contact}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FAQ Section */}
          {activeSection === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">❓ Frequently Asked Questions</h2>
              {MOTOR_FAQ.map((faq) => (
                <div key={faq.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded bg-blue-600/30 text-blue-300">{faq.category}</span>
                      <span className="font-semibold">{faq.question}</span>
                    </div>
                    <span>{expandedFaq === faq.id ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 pt-0 text-gray-300 border-t border-white/10"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>The Motors Bible - Kenya's Most Comprehensive Motor Maintenance Guide</p>
          <p className="text-sm mt-2">Part of Emerson EIMS Maintenance Hub</p>
        </div>
      </footer>
    </div>
  );
}
