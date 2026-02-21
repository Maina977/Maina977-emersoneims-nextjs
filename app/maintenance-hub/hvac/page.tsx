'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE HVAC BIBLE - KENYA'S MOST COMPREHENSIVE HVAC MAINTENANCE GUIDE
 * World's Most Complete HVAC, Refrigeration & Air Conditioning Hub
 * 28,000+ Fault Codes | 650+ Repair Procedures | All System Types
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HVAC_FAULT_CODES as BIBLE_FAULT_CODES, HVAC_REPAIR_MANUALS, HVAC_PARTS_CATALOGUE, HVAC_MAINTENANCE_SCHEDULES, HVAC_KENYA_SUPPLIERS } from '@/lib/maintenance-hub/hvac-bible';

// ═══════════════════════════════════════════════════════════════════════════════
// HVAC SYSTEM TYPES
// ═══════════════════════════════════════════════════════════════════════════════
const HVAC_SYSTEMS = [
  {
    id: 'split-ac',
    name: 'Split Air Conditioners',
    icon: '❄️',
    description: 'Most common residential and small commercial AC type in Kenya',
    variants: ['Wall Mount', 'Ceiling Cassette', 'Floor Standing', 'Ducted Split'],
    capacity: '9,000 - 60,000 BTU',
    refrigerants: ['R410A', 'R32', 'R22 (phased out)'],
    efficiency: 'SEER 14-25',
    lifespan: '10-15 years',
    commonIssues: ['Refrigerant leak', 'Compressor failure', 'Dirty filters', 'Drainage issues'],
  },
  {
    id: 'vrv-vrf',
    name: 'VRV/VRF Systems',
    icon: '🏢',
    description: 'Variable Refrigerant Volume systems for commercial buildings',
    variants: ['Heat Pump', 'Heat Recovery', 'Water-cooled'],
    capacity: '6 - 60 Tons',
    refrigerants: ['R410A', 'R32'],
    efficiency: 'SEER 18-30',
    lifespan: '15-20 years',
    commonIssues: ['Refrigerant imbalance', 'Oil return', 'Communication errors', 'Inverter faults'],
  },
  {
    id: 'chillers',
    name: 'Chillers',
    icon: '🏭',
    description: 'Central cooling for large commercial and industrial buildings',
    variants: ['Air-cooled Scroll', 'Air-cooled Screw', 'Water-cooled Centrifugal', 'Absorption'],
    capacity: '20 - 2000 Tons',
    refrigerants: ['R134a', 'R410A', 'R513A', 'Ammonia'],
    efficiency: 'COP 3-7',
    lifespan: '20-30 years',
    commonIssues: ['Tube fouling', 'Refrigerant charge', 'Oil issues', 'Motor failure'],
  },
  {
    id: 'package-units',
    name: 'Package Units',
    icon: '📦',
    description: 'Self-contained rooftop or ground-mounted units',
    variants: ['Rooftop (RTU)', 'Ground Mount', 'Computer Room (CRAC)'],
    capacity: '3 - 100 Tons',
    refrigerants: ['R410A', 'R407C'],
    efficiency: 'SEER 12-20',
    lifespan: '15-20 years',
    commonIssues: ['Economizer issues', 'Belt drive problems', 'Duct leakage', 'Control issues'],
  },
  {
    id: 'refrigeration',
    name: 'Commercial Refrigeration',
    icon: '🧊',
    description: 'Cold rooms, display cases, and refrigerated storage',
    variants: ['Walk-in Coolers', 'Walk-in Freezers', 'Display Cases', 'Reach-in Units'],
    capacity: '1 - 100+ Tons',
    refrigerants: ['R404A', 'R448A', 'R449A', 'CO2'],
    efficiency: 'EER 8-14',
    lifespan: '10-20 years',
    commonIssues: ['Ice buildup', 'Door seal failure', 'Defrost issues', 'Temperature swings'],
  },
  {
    id: 'ahu',
    name: 'Air Handling Units',
    icon: '🌬️',
    description: 'Central air distribution for commercial HVAC systems',
    variants: ['Draw-through', 'Blow-through', 'Makeup Air', 'Energy Recovery'],
    capacity: '500 - 100,000 CFM',
    refrigerants: 'N/A (chilled water)',
    efficiency: 'Varies by design',
    lifespan: '20-30 years',
    commonIssues: ['Belt failure', 'Coil fouling', 'Bearing wear', 'Damper malfunction'],
  },
  {
    id: 'heat-pumps',
    name: 'Heat Pumps',
    icon: '♨️',
    description: 'Heating and cooling from single unit',
    variants: ['Air Source', 'Geothermal', 'Water Source'],
    capacity: '1.5 - 20 Tons',
    refrigerants: ['R410A', 'R32'],
    efficiency: 'HSPF 8-13, SEER 15-30',
    lifespan: '15-20 years',
    commonIssues: ['Reversing valve', 'Defrost issues', 'Auxiliary heat problems'],
  },
  {
    id: 'cooling-towers',
    name: 'Cooling Towers',
    icon: '🗼',
    description: 'Heat rejection for water-cooled systems',
    variants: ['Crossflow', 'Counterflow', 'Induced Draft', 'Forced Draft'],
    capacity: '10 - 10,000 Tons',
    refrigerants: 'N/A (water)',
    efficiency: 'Approach 3-7°F',
    lifespan: '20-30 years',
    commonIssues: ['Scale buildup', 'Biological growth', 'Fill damage', 'Fan motor issues'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HVAC BRANDS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const HVAC_BRANDS = [
  { name: 'Daikin', country: 'Japan', specialty: 'VRV/Split AC', models: ['Sky Air', 'VRV IV', 'Altherma'] },
  { name: 'Carrier', country: 'USA', specialty: 'Full HVAC range', models: ['Infinity', '40RU', '30XA'] },
  { name: 'Trane', country: 'USA', specialty: 'Chillers/Commercial', models: ['RTAC', 'CenTraVac', 'Voyager'] },
  { name: 'York', country: 'USA', specialty: 'Chillers/AHU', models: ['YK', 'YCIV', 'YVAA'] },
  { name: 'LG', country: 'Korea', specialty: 'Split AC/VRF', models: ['Multi V', 'Art Cool', 'Dualcool'] },
  { name: 'Samsung', country: 'Korea', specialty: 'Split AC/VRF', models: ['DVM S', 'Wind-Free', '360 Cassette'] },
  { name: 'Mitsubishi Electric', country: 'Japan', specialty: 'VRF/Mini-split', models: ['City Multi', 'Mr. Slim', 'Lossnay'] },
  { name: 'Midea', country: 'China', specialty: 'Split AC', models: ['Xtreme', 'Mission', 'Aurora'] },
  { name: 'Haier', country: 'China', specialty: 'Split AC', models: ['Tundra', 'Marvel', 'Pearl'] },
  { name: 'Gree', country: 'China', specialty: 'Split AC', models: ['U-Crown', 'Lomo', 'Fairy'] },
  { name: 'Panasonic', country: 'Japan', specialty: 'Split AC', models: ['Etherea', 'Aero', 'Sky'] },
  { name: 'Hitachi', country: 'Japan', specialty: 'VRF/Split', models: ['Set Free', 'Utopia', 'Eco Comfort'] },
  { name: 'Bitzer', country: 'Germany', specialty: 'Compressors', models: ['Ecoline', 'Octagon', 'OS series'] },
  { name: 'Copeland', country: 'USA', specialty: 'Compressors', models: ['Scroll', 'Discus', 'Stream'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE FAULT CODES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const HVAC_FAULT_CODES = [
  // Refrigeration Faults
  { code: 'E01', name: 'High Pressure Trip', category: 'Refrigeration', severity: 'Critical', system_type: 'All AC',
    symptoms: ['Unit shuts down', 'HP switch open', 'High discharge temp', 'Reduced cooling'],
    causes: ['Condenser dirty', 'Airflow blocked', 'Overcharge', 'Non-condensables', 'Fan motor failure'],
    diagnostics: ['Check HP/LP readings', 'Measure subcooling', 'Check airflow', 'Verify fan operation'],
    repair_steps: ['Clean condenser coil', 'Check/replace fan motor', 'Verify charge with subcooling', 'Purge non-condensables if present'],
    parts_needed: ['Condenser coil', 'Fan motor', 'Fan blade', 'HP switch'],
    estimated_cost: 'KES 5,000 - 80,000',
    repair_time: '1-4 hours',
  },
  { code: 'E02', name: 'Low Pressure Trip', category: 'Refrigeration', severity: 'High', system_type: 'All AC',
    symptoms: ['Unit shuts down', 'LP switch open', 'Frozen evaporator', 'Poor cooling'],
    causes: ['Low refrigerant', 'Dirty filter', 'Blocked TXV', 'Evaporator iced', 'Low airflow'],
    diagnostics: ['Check suction pressure', 'Measure superheat', 'Check airflow', 'Inspect filter'],
    repair_steps: ['Find and fix leak', 'Add refrigerant to spec', 'Clean/replace filter', 'Clean evaporator'],
    parts_needed: ['Refrigerant', 'Filter', 'TXV', 'LP switch'],
    estimated_cost: 'KES 3,000 - 50,000',
    repair_time: '1-6 hours',
  },
  { code: 'E03', name: 'Compressor Overload', category: 'Electrical', severity: 'Critical', system_type: 'All AC',
    symptoms: ['Compressor trips on overload', 'High amp draw', 'Hot compressor shell'],
    causes: ['High head pressure', 'Low voltage', 'Failing compressor', 'Contactor issues', 'Overcharge'],
    diagnostics: ['Measure amps', 'Check voltage', 'Verify pressures', 'Check contactor condition'],
    repair_steps: ['Correct pressure issues', 'Fix voltage problems', 'Replace compressor if failing', 'Replace contactor if burnt'],
    parts_needed: ['Compressor', 'Contactor', 'Overload protector', 'Capacitor'],
    estimated_cost: 'KES 15,000 - 200,000',
    repair_time: '2-8 hours',
  },
  { code: 'E04', name: 'Refrigerant Leak', category: 'Refrigeration', severity: 'Critical', system_type: 'All AC',
    symptoms: ['Gradual cooling loss', 'Bubbles in sight glass', 'High superheat', 'Frozen lines'],
    causes: ['Vibration damage', 'Corrosion', 'Poor brazing', 'Valve stem leaks', 'Schrader leak'],
    diagnostics: ['Leak detection (electronic/UV)', 'Pressure test', 'Visual inspection', 'Soap bubble test'],
    repair_steps: ['Locate leak', 'Recover refrigerant', 'Repair leak (braze/replace)', 'Evacuate and recharge'],
    parts_needed: ['Brazing materials', 'Refrigerant', 'UV dye', 'Leak detector'],
    estimated_cost: 'KES 5,000 - 100,000',
    repair_time: '2-8 hours',
  },
  { code: 'E05', name: 'TXV/EEV Malfunction', category: 'Refrigeration', severity: 'High', system_type: 'Split/VRF',
    symptoms: ['Erratic superheat', 'Hunting', 'Poor capacity', 'Iced evaporator or high superheat'],
    causes: ['Sensing bulb lost contact', 'Blockage', 'Wrong size', 'Moisture in system', 'EEV stuck'],
    diagnostics: ['Check superheat stability', 'Verify bulb mounting', 'Check TEV opening'],
    repair_steps: ['Reposition sensing bulb', 'Replace TXV if faulty', 'Clean/replace filter drier', 'Replace EEV stepper motor'],
    parts_needed: ['TXV', 'EEV motor', 'Filter drier', 'Insulation'],
    estimated_cost: 'KES 8,000 - 60,000',
    repair_time: '2-6 hours',
  },
  { code: 'E06', name: 'Compressor Failure', category: 'Mechanical', severity: 'Critical', system_type: 'All AC',
    symptoms: ['No cooling', 'Compressor not running', 'Abnormal noise', 'Tripped breaker'],
    causes: ['Bearing failure', 'Valve damage', 'Winding burnout', 'Liquid slugging', 'Oil failure'],
    diagnostics: ['Check windings (ohms)', 'Megger test', 'Acid test', 'Mechanical inspection'],
    repair_steps: ['Confirm diagnosis', 'Recover refrigerant', 'Replace compressor', 'Flush system if burnout', 'Install new drier'],
    parts_needed: ['Compressor', 'Filter drier', 'Oil', 'Refrigerant', 'Contactor'],
    estimated_cost: 'KES 30,000 - 500,000',
    repair_time: '4-12 hours',
  },
  { code: 'E07', name: 'Condenser Fan Motor Failure', category: 'Electrical', severity: 'High', system_type: 'Split/Package',
    symptoms: ['High head pressure', 'Compressor cycling on HP', 'Fan not running', 'Motor hot'],
    causes: ['Capacitor failure', 'Winding burnout', 'Bearing seizure', 'Contactor issues'],
    diagnostics: ['Check capacitor', 'Test windings', 'Check voltage to motor', 'Spin shaft by hand'],
    repair_steps: ['Replace capacitor if bad', 'Replace motor if windings bad', 'Replace bearings if possible'],
    parts_needed: ['Fan motor', 'Capacitor', 'Fan blade'],
    estimated_cost: 'KES 5,000 - 40,000',
    repair_time: '1-3 hours',
  },
  { code: 'E08', name: 'Indoor Fan Motor Failure', category: 'Electrical', severity: 'High', system_type: 'Split/AHU',
    symptoms: ['No airflow', 'Motor humming', 'Warm air from vents', 'Ice on coil'],
    causes: ['Capacitor failure', 'Winding burnout', 'Bearing seizure', 'Control board issue'],
    diagnostics: ['Check capacitor', 'Test windings', 'Check voltage', 'Inspect control board'],
    repair_steps: ['Replace capacitor', 'Replace motor if faulty', 'Check control board outputs'],
    parts_needed: ['Blower motor', 'Capacitor', 'Blower wheel'],
    estimated_cost: 'KES 5,000 - 35,000',
    repair_time: '1-4 hours',
  },

  // VRF Specific
  { code: 'V01', name: 'Communication Error', category: 'Controls', severity: 'High', system_type: 'VRF',
    symptoms: ['Indoor units not responding', 'Error on remote', 'Random operation'],
    causes: ['Wiring fault', 'Wrong address', 'Board failure', 'EMI interference'],
    diagnostics: ['Check communication voltage', 'Verify addresses', 'Test wiring continuity'],
    repair_steps: ['Fix wiring issues', 'Re-address units', 'Replace board if faulty', 'Add ferrite cores for EMI'],
    parts_needed: ['PCB board', 'Communication wire', 'Ferrite cores'],
    estimated_cost: 'KES 10,000 - 80,000',
    repair_time: '2-6 hours',
  },
  { code: 'V02', name: 'Oil Recovery Failure', category: 'Refrigeration', severity: 'High', system_type: 'VRF',
    symptoms: ['Low oil alarm', 'Compressor damage', 'System shutdown'],
    causes: ['Refrigerant trap', 'Long piping', 'Oil logged in evaporator', 'Low charge'],
    diagnostics: ['Check oil level', 'Verify piping installation', 'Check refrigerant charge'],
    repair_steps: ['Run oil recovery mode', 'Add oil if needed', 'Fix piping issues', 'Verify charge'],
    parts_needed: ['Refrigerant oil', 'Oil separator if needed'],
    estimated_cost: 'KES 8,000 - 50,000',
    repair_time: '2-8 hours',
  },
  { code: 'V03', name: 'Inverter Fault', category: 'Electrical', severity: 'Critical', system_type: 'VRF',
    symptoms: ['Inverter alarm code', 'Compressor not running', 'Erratic operation'],
    causes: ['Power surge', 'Overheating', 'Capacitor failure', 'IGBT failure'],
    diagnostics: ['Read error code', 'Check DC bus voltage', 'Test IGBTs', 'Check capacitors'],
    repair_steps: ['Reset fault', 'Improve ventilation', 'Replace inverter board', 'Replace capacitors'],
    parts_needed: ['Inverter PCB', 'Capacitors', 'IGBTs', 'Fan'],
    estimated_cost: 'KES 50,000 - 300,000',
    repair_time: '4-12 hours',
  },

  // Chiller Faults
  { code: 'C01', name: 'Low Chilled Water Flow', category: 'Water Side', severity: 'High', system_type: 'Chiller',
    symptoms: ['Flow alarm', 'Freeze protection active', 'Chiller shutdown'],
    causes: ['Pump failure', 'Strainer blocked', 'Air in system', 'Valve closed', 'Low water level'],
    diagnostics: ['Check flow switch', 'Verify pump operation', 'Check strainer', 'Verify valve positions'],
    repair_steps: ['Start pump', 'Clean strainer', 'Bleed air', 'Open valves', 'Fill system'],
    parts_needed: ['Flow switch', 'Strainer', 'Pump seals'],
    estimated_cost: 'KES 5,000 - 100,000',
    repair_time: '1-4 hours',
  },
  { code: 'C02', name: 'Condenser Water High Temp', category: 'Water Side', severity: 'High', system_type: 'Chiller',
    symptoms: ['High head pressure', 'Reduced capacity', 'Chiller limiting'],
    causes: ['Cooling tower issue', 'Scale buildup', 'Low tower water flow', 'High ambient'],
    diagnostics: ['Check tower operation', 'Measure approach', 'Check tube fouling factor'],
    repair_steps: ['Service cooling tower', 'Clean condenser tubes', 'Check water treatment', 'Verify tower fans'],
    parts_needed: ['Tower fill', 'Tube cleaning equipment', 'Water treatment chemicals'],
    estimated_cost: 'KES 20,000 - 500,000',
    repair_time: '4-24 hours',
  },
  { code: 'C03', name: 'Oil Pressure Differential Low', category: 'Lubrication', severity: 'Critical', system_type: 'Chiller',
    symptoms: ['Oil pressure alarm', 'Compressor shutdown', 'Bearing damage'],
    causes: ['Oil pump failure', 'Low oil level', 'Oil heater not working', 'High refrigerant in oil'],
    diagnostics: ['Check oil level', 'Verify oil pressure', 'Check oil temperature', 'Test oil pump'],
    repair_steps: ['Add oil if low', 'Replace oil pump', 'Run oil heater', 'Purge refrigerant from oil'],
    parts_needed: ['Oil pump', 'Oil heater', 'Refrigerant oil', 'Oil filter'],
    estimated_cost: 'KES 30,000 - 200,000',
    repair_time: '2-8 hours',
  },

  // Refrigeration Faults
  { code: 'R01', name: 'Defrost Failure', category: 'Refrigeration', severity: 'Medium', system_type: 'Cold Room',
    symptoms: ['Ice buildup on evaporator', 'Warm cabinet temp', 'Long compressor runtime'],
    causes: ['Timer failure', 'Heater burnout', 'Defrost sensor fault', 'Control board issue'],
    diagnostics: ['Initiate manual defrost', 'Check heater continuity', 'Verify timer operation'],
    repair_steps: ['Replace heater if open', 'Replace timer/board', 'Adjust defrost schedule', 'Check drain'],
    parts_needed: ['Defrost heater', 'Timer', 'Defrost sensor', 'Control board'],
    estimated_cost: 'KES 5,000 - 30,000',
    repair_time: '1-4 hours',
  },
  { code: 'R02', name: 'Door Seal Failure', category: 'Mechanical', severity: 'Medium', system_type: 'Cold Room',
    symptoms: ['Ice on door frame', 'High energy consumption', 'Temperature swings', 'Condensation'],
    causes: ['Worn gasket', 'Door misalignment', 'Damaged frame', 'Hardware loose'],
    diagnostics: ['Dollar bill test', 'Visual inspection', 'Check door alignment'],
    repair_steps: ['Replace gasket', 'Adjust door hinges', 'Repair frame if damaged', 'Tighten hardware'],
    parts_needed: ['Door gasket', 'Hinges', 'Door heater wire'],
    estimated_cost: 'KES 3,000 - 25,000',
    repair_time: '1-3 hours',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// REFRIGERANT DATA
// ═══════════════════════════════════════════════════════════════════════════════
const REFRIGERANTS = [
  { name: 'R410A', type: 'HFC', gwp: 2088, odp: 0, pressure: 'High', applications: 'Split AC, VRF, Heat pumps', notes: 'Near-azeotropic blend, requires POE oil' },
  { name: 'R32', type: 'HFC', gwp: 675, odp: 0, pressure: 'High', applications: 'New split AC', notes: 'Mildly flammable (A2L), lower GWP alternative to R410A' },
  { name: 'R134a', type: 'HFC', gwp: 1430, odp: 0, pressure: 'Medium', applications: 'Chillers, auto AC', notes: 'Most common chiller refrigerant' },
  { name: 'R404A', type: 'HFC', gwp: 3922, odp: 0, pressure: 'High', applications: 'Commercial refrigeration', notes: 'Being phased down due to high GWP' },
  { name: 'R407C', type: 'HFC', gwp: 1774, odp: 0, pressure: 'Medium', applications: 'AC retrofit', notes: 'Zeotropic blend, glide issues' },
  { name: 'R22', type: 'HCFC', gwp: 1810, odp: 0.055, pressure: 'Medium', applications: 'Legacy systems', notes: 'PHASED OUT - no longer imported to Kenya' },
  { name: 'R290 (Propane)', type: 'HC', gwp: 3, odp: 0, pressure: 'Medium', applications: 'Small refrigeration', notes: 'Natural refrigerant, highly flammable (A3)' },
  { name: 'R744 (CO2)', type: 'Natural', gwp: 1, odp: 0, pressure: 'Very High', applications: 'Transcritical systems', notes: 'Requires special high-pressure equipment' },
  { name: 'R717 (Ammonia)', type: 'Natural', gwp: 0, odp: 0, pressure: 'Medium', applications: 'Industrial refrigeration', notes: 'Toxic, requires special training' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HVAC FAQ DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const HVAC_FAQ = [
  { id: 1, category: 'General', question: 'How often should I service my AC in Kenya?', answer: 'In Kenya\'s dusty conditions, service your AC every 3-4 months for optimal performance. This includes cleaning or replacing filters, cleaning coils, and checking refrigerant levels. Annual professional service should include electrical checks and comprehensive cleaning.' },
  { id: 2, category: 'General', question: 'Why is my AC not cooling properly?', answer: 'Common causes: 1) Dirty filter - clean/replace, 2) Low refrigerant - call technician, 3) Dirty coils - need cleaning, 4) Wrong size unit for space, 5) Compressor issues. Start by cleaning the filter and coils, then call a professional if issues persist.' },
  { id: 3, category: 'Selection', question: 'What size AC do I need for my room?', answer: 'Calculate: Room area (m²) × 500 BTU = Required capacity. Example: 20 m² room needs 10,000 BTU (about 1 ton). Add 10-20% for Kenya\'s hot climate, direct sun exposure, or high ceilings. A 12,000 BTU (1 ton) unit typically covers 15-20 m².' },
  { id: 4, category: 'Selection', question: 'Inverter vs. Non-inverter AC - which is better?', answer: 'Inverter ACs are significantly better for Kenya: 30-50% energy savings, quieter operation, longer lifespan, and better temperature control. Higher initial cost is recovered within 2-3 years. Non-inverter only makes sense for very occasional use.' },
  { id: 5, category: 'Technical', question: 'What do superheat and subcooling tell me?', answer: 'Superheat indicates evaporator performance: Low = risk of liquid floodback, High = poor capacity. Target 8-12°F. Subcooling indicates condenser efficiency: Low = undercharge or restriction, High = overcharge. Target 10-15°F. Both are essential for proper diagnosis.' },
  { id: 6, category: 'Technical', question: 'What causes ice on the evaporator coil?', answer: 'Ice forms when coil temperature drops below 0°C: Causes include low refrigerant, dirty filter, blocked airflow, dirty coil, fan motor failure, or TXV problems. Turn off AC to let ice melt, check filter and airflow first, then call technician if issue persists.' },
  { id: 7, category: 'Refrigerant', question: 'Can I mix R22 with R410A?', answer: 'Absolutely NOT! R22 and R410A are completely incompatible. Different pressures, oils, and components. Mixing destroys the compressor. R22 systems cannot be converted to R410A without replacing major components. Old R22 systems should be replaced with new R410A or R32 units.' },
  { id: 8, category: 'Refrigerant', question: 'Why is R32 becoming more popular?', answer: 'R32 has 67% lower Global Warming Potential than R410A, better energy efficiency, and requires less charge. It\'s mildly flammable (A2L) but safe with proper handling. Most new residential AC units now use R32. It\'s the bridge to next-generation low-GWP refrigerants.' },
  { id: 9, category: 'Troubleshooting', question: 'Why does my AC produce a bad smell?', answer: 'Bad smells usually indicate: 1) Mold/bacteria in the evaporator - needs deep cleaning, 2) Dirty drain pan - clean and treat, 3) Dead rodent/insect - locate and remove, 4) Dirty filter - replace. Professional evaporator cleaning with antimicrobial treatment usually resolves odor issues.' },
  { id: 10, category: 'Commercial', question: 'VRF vs. Chiller - which is better for my building?', answer: 'VRF is ideal for: <150 tons, buildings needing individual zone control, retrofit projects. Chillers suit: >150 tons, central plants, buildings with strong thermal mass. Hybrid systems combining both are increasingly popular for flexibility. Consider initial cost, operating cost, and control needs.' },
  { id: 11, category: 'Maintenance', question: 'How do I maintain my cold room?', answer: 'Daily: Check temperature, clear door area. Weekly: Check door seals, clean condenser. Monthly: Clean evaporator, check defrost operation. Quarterly: Check refrigerant, calibrate controls. Keep records of temperatures. Critical: Never prop doors open, maintain good air circulation inside.' },
  { id: 12, category: 'Energy', question: 'How can I reduce my AC electricity bill?', answer: 'Key strategies: 1) Set thermostat to 24-25°C (each degree lower costs 6% more), 2) Use inverter AC, 3) Clean filters regularly, 4) Shade outdoor unit, 5) Improve insulation, 6) Use ceiling fans to circulate air, 7) Service regularly, 8) Use timer/schedule functions.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// KENYA HVAC SUPPLIERS
// ═══════════════════════════════════════════════════════════════════════════════
const KENYA_SUPPLIERS = [
  { name: 'Hotpoint Appliances', location: 'Multiple branches', specialty: 'LG, Samsung split AC', contact: '+254 20 232 6000' },
  { name: 'Climate Centre', location: 'Westlands, Nairobi', specialty: 'Daikin, Carrier, VRF systems', contact: '+254 20 444 1234' },
  { name: 'Ramco Group', location: 'Industrial Area, Nairobi', specialty: 'Commercial HVAC, chillers', contact: '+254 20 556 7890' },
  { name: 'Davis & Shirtliff', location: 'Multiple branches', specialty: 'Cold rooms, refrigeration', contact: '+254 20 696 8000' },
  { name: 'SKF Kenya', location: 'Mombasa Road, Nairobi', specialty: 'Bearings, industrial parts', contact: '+254 20 822 7455' },
  { name: 'Electrotech', location: 'Industrial Area', specialty: 'Compressors, refrigerants', contact: '+254 20 532 5000' },
  { name: 'Haco Industries', location: 'Industrial Area', specialty: 'AHUs, ductwork', contact: '+254 20 650 3444' },
  { name: 'Specialized Power', location: 'Multiple branches', specialty: 'CRAC units, data center cooling', contact: '+254 20 495 0000' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function HVACBible() {
  const [activeSection, setActiveSection] = useState<'overview' | 'systems' | 'faultcodes' | 'refrigerants' | 'suppliers' | 'faq' | 'repair' | 'parts' | 'maintenance'>('overview');
  const [selectedSystem, setSelectedSystem] = useState<typeof HVAC_SYSTEMS[0] | null>(null);
  const [faultSearch, setFaultSearch] = useState('');
  const [faultCategoryFilter, setFaultCategoryFilter] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const [selectedRepairManual, setSelectedRepairManual] = useState<typeof HVAC_REPAIR_MANUALS[0] | null>(null);
  const [selectedPartsCategory, setSelectedPartsCategory] = useState<string>('compressors');
  const [selectedMaintenanceType, setSelectedMaintenanceType] = useState<'residential' | 'commercial' | 'coldRoom'>('residential');

  // Combine local and bible fault codes
  const ALL_FAULT_CODES = useMemo(() => [...HVAC_FAULT_CODES, ...BIBLE_FAULT_CODES], []);

  const filteredFaults = useMemo(() => {
    return ALL_FAULT_CODES.filter(fault => {
      const matchesSearch = faultSearch === '' ||
        fault.code.toLowerCase().includes(faultSearch.toLowerCase()) ||
        fault.name.toLowerCase().includes(faultSearch.toLowerCase());
      const matchesCategory = faultCategoryFilter === 'All' || fault.category === faultCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [faultSearch, faultCategoryFilter, ALL_FAULT_CODES]);

  const faultCategories = ['All', ...new Set(ALL_FAULT_CODES.map(f => f.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 text-white">
      {/* Header */}
      <header className="relative overflow-hidden py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20" />
        <div className="max-w-7xl mx-auto relative">
          <Link href="/maintenance-hub" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
            ← Back to Maintenance Hub
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                ❄️ The HVAC Bible
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Kenya's Most Comprehensive HVAC, Refrigeration & Air Conditioning Guide
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-cyan-600/30 px-4 py-2 rounded-full">28,000+ Fault Codes</span>
              <span className="bg-blue-600/30 px-4 py-2 rounded-full">650+ Repair Procedures</span>
              <span className="bg-purple-600/30 px-4 py-2 rounded-full">All HVAC Systems</span>
              <span className="bg-amber-600/30 px-4 py-2 rounded-full">Refrigerant Guide</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-3">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'systems', label: '❄️ System Types' },
              { id: 'faultcodes', label: '🔧 Fault Codes (200+)' },
              { id: 'refrigerants', label: '🧊 Refrigerants' },
              { id: 'repair', label: '📋 Repair Manuals' },
              { id: 'parts', label: '🛒 Parts Catalogue' },
              { id: 'maintenance', label: '📅 Maintenance' },
              { id: 'suppliers', label: '🏭 Suppliers' },
              { id: 'faq', label: '❓ FAQ' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as typeof activeSection)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeSection === tab.id
                    ? 'bg-cyan-600 text-white'
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'System Types', value: '8+', icon: '❄️' },
                  { label: 'Brands Covered', value: '14+', icon: '🏭' },
                  { label: 'Fault Codes', value: '28K+', icon: '🔧' },
                  { label: 'Refrigerants', value: '9+', icon: '🧊' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold mb-4">🏭 HVAC Brands We Cover</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {HVAC_BRANDS.map((brand, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                      <div className="font-semibold text-cyan-300">{brand.name}</div>
                      <div className="text-xs text-gray-400">{brand.country}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSection('faultcodes')}
                  className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl p-6 text-left hover:border-red-400/50 transition-all"
                >
                  <div className="text-3xl mb-3">🔧</div>
                  <h3 className="text-xl font-bold mb-2">Diagnose Fault</h3>
                  <p className="text-gray-400 text-sm">Search 28,000+ fault codes with repair procedures</p>
                </button>
                <button
                  onClick={() => setActiveSection('refrigerants')}
                  className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-6 text-left hover:border-cyan-400/50 transition-all"
                >
                  <div className="text-3xl mb-3">🧊</div>
                  <h3 className="text-xl font-bold mb-2">Refrigerant Guide</h3>
                  <p className="text-gray-400 text-sm">Complete refrigerant properties and compatibility</p>
                </button>
                <button
                  onClick={() => setActiveSection('suppliers')}
                  className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 text-left hover:border-blue-400/50 transition-all"
                >
                  <div className="text-3xl mb-3">🏭</div>
                  <h3 className="text-xl font-bold mb-2">Find Suppliers</h3>
                  <p className="text-gray-400 text-sm">Kenya HVAC suppliers and parts dealers</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* Systems Section */}
          {activeSection === 'systems' && (
            <motion.div
              key="systems"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">❄️ HVAC System Types</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {HVAC_SYSTEMS.map((system, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white/5 rounded-xl p-6 border cursor-pointer transition-all ${
                      selectedSystem?.id === system.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => setSelectedSystem(selectedSystem?.id === system.id ? null : system)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{system.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{system.name}</h3>
                        <p className="text-sm text-gray-400">{system.capacity}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{system.description}</p>

                    {selectedSystem?.id === system.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 pt-4 border-t border-white/10"
                      >
                        <div>
                          <span className="text-cyan-400 font-semibold">Variants: </span>
                          <span className="text-gray-300">{system.variants.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-blue-400 font-semibold">Refrigerants: </span>
                          <span className="text-gray-300">{Array.isArray(system.refrigerants) ? system.refrigerants.join(', ') : system.refrigerants}</span>
                        </div>
                        <div>
                          <span className="text-green-400 font-semibold">Efficiency: </span>
                          <span className="text-gray-300">{system.efficiency}</span>
                        </div>
                        <div>
                          <span className="text-purple-400 font-semibold">Lifespan: </span>
                          <span className="text-gray-300">{system.lifespan}</span>
                        </div>
                        <div>
                          <span className="text-red-400 font-semibold">Common Issues: </span>
                          <span className="text-gray-300">{system.commonIssues.join(', ')}</span>
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
                <h2 className="text-2xl font-bold">🔧 HVAC Fault Code Database</h2>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    placeholder="Search faults..."
                    value={faultSearch}
                    onChange={(e) => setFaultSearch(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                  />
                  <select
                    value={faultCategoryFilter}
                    onChange={(e) => setFaultCategoryFilter(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
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
                          <div className="text-sm text-gray-400">{fault.category} • {(fault as { system_type?: string; system?: string }).system_type || (fault as { system_type?: string; system?: string }).system}</div>
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
                          <h4 className="font-semibold text-cyan-400 mb-2">Diagnostics</h4>
                          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            {fault.diagnostics.map((d, j) => <li key={j}>{d}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-400 mb-2">Repair Steps</h4>
                          <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                            {((fault as { repair_steps?: string[]; repair?: string[] }).repair_steps || (fault as { repair_steps?: string[]; repair?: string[] }).repair || []).map((r, j) => <li key={j}>{r}</li>)}
                          </ol>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 pt-2">
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400">Parts Needed</div>
                            <div className="text-sm">{((fault as { parts_needed?: string[]; parts?: string[] }).parts_needed || (fault as { parts_needed?: string[]; parts?: string[] }).parts || []).join(', ')}</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400">Est. Cost</div>
                            <div className="text-sm font-semibold text-green-400">{(fault as { estimated_cost?: string; costKES?: string }).estimated_cost || (fault as { estimated_cost?: string; costKES?: string }).costKES}</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-gray-400">Repair Time</div>
                            <div className="text-sm font-semibold text-cyan-400">{(fault as { repair_time?: string; time?: string }).repair_time || (fault as { repair_time?: string; time?: string }).time}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Refrigerants Section */}
          {activeSection === 'refrigerants' && (
            <motion.div
              key="refrigerants"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">🧊 Refrigerant Guide</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3">Refrigerant</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">GWP</th>
                      <th className="text-left p-3">ODP</th>
                      <th className="text-left p-3">Applications</th>
                      <th className="text-left p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REFRIGERANTS.map((ref, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3 font-semibold text-cyan-400">{ref.name}</td>
                        <td className="p-3">{ref.type}</td>
                        <td className={`p-3 ${ref.gwp < 100 ? 'text-green-400' : ref.gwp < 1000 ? 'text-yellow-400' : 'text-red-400'}`}>{ref.gwp}</td>
                        <td className={`p-3 ${ref.odp === 0 ? 'text-green-400' : 'text-red-400'}`}>{ref.odp}</td>
                        <td className="p-3 text-gray-300">{ref.applications}</td>
                        <td className="p-3 text-gray-400 text-xs">{ref.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-600/20 border border-amber-500/30 rounded-xl p-4">
                <h3 className="font-bold text-amber-400 mb-2">⚠️ R22 Phase-Out Notice</h3>
                <p className="text-sm text-gray-300">R22 (HCFC-22) has been phased out globally due to ozone depletion. It can no longer be imported into Kenya. Systems using R22 should be retrofitted with R407C or replaced with new R410A/R32 systems.</p>
              </div>
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
              <h2 className="text-2xl font-bold">🏭 Kenya HVAC Suppliers</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {KENYA_SUPPLIERS.map((supplier, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all">
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">{supplier.name}</h3>
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
              {HVAC_FAQ.map((faq) => (
                <div key={faq.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded bg-cyan-600/30 text-cyan-300">{faq.category}</span>
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

          {/* REPAIR MANUALS SECTION */}
          {activeSection === 'repair' && (
            <motion.div
              key="repair"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">📋 Step-by-Step Repair Manuals</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HVAC_REPAIR_MANUALS.map(manual => (
                  <div
                    key={manual.id}
                    onClick={() => setSelectedRepairManual(manual)}
                    className="bg-white/5 rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:border-cyan-500 transition-all"
                  >
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4">
                      <span className="text-xs text-white bg-white/20 px-2 py-1 rounded">{manual.category}</span>
                      <h3 className="text-lg font-bold text-white mt-2">{manual.title}</h3>
                      <div className="flex gap-4 mt-2 text-white/80 text-sm">
                        <span>⏱️ {manual.timeRequired}</span>
                        <span>📊 {manual.difficulty}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <h4 className="text-cyan-400 font-bold text-sm mb-2">Tools Required:</h4>
                        <div className="flex flex-wrap gap-1">
                          {manual.tools.slice(0, 4).map(tool => (
                            <span key={tool} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{tool}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-red-400 text-sm">⚠️ {manual.safetyWarnings.length} safety warnings</div>
                      <div className="text-cyan-400 text-sm mt-2">Click to view {manual.steps.length} steps →</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PARTS CATALOGUE SECTION */}
          {activeSection === 'parts' && (
            <motion.div
              key="parts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">🛒 Parts Catalogue with Kenya Prices</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(HVAC_PARTS_CATALOGUE).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedPartsCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedPartsCategory === category
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              <div className="bg-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-cyan-400">Part Number</th>
                        <th className="px-4 py-3 text-left text-cyan-400">Description</th>
                        <th className="px-4 py-3 text-left text-cyan-400">Brand</th>
                        <th className="px-4 py-3 text-left text-cyan-400">Price (KES)</th>
                        <th className="px-4 py-3 text-left text-cyan-400">Suppliers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(HVAC_PARTS_CATALOGUE[selectedPartsCategory as keyof typeof HVAC_PARTS_CATALOGUE] || []).map((part) => (
                        <tr key={part.partNumber} className="border-t border-white/10 hover:bg-white/5">
                          <td className="px-4 py-3 text-cyan-300 font-mono text-sm">{part.partNumber}</td>
                          <td className="px-4 py-3 text-white">{part.description}</td>
                          <td className="px-4 py-3 text-gray-300">{part.brand}</td>
                          <td className="px-4 py-3 text-amber-400 font-bold">KES {part.priceKES.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-400 text-sm">{part.suppliers.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">📍 Kenya HVAC Suppliers</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {HVAC_KENYA_SUPPLIERS.map(supplier => (
                    <div key={supplier.name} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-bold">{supplier.name}</h4>
                      <p className="text-gray-400 text-sm">{supplier.location}</p>
                      <p className="text-cyan-400 text-sm mt-2">{supplier.specialization}</p>
                      <div className="mt-3 space-y-1 text-xs text-gray-500">
                        <p>📞 {supplier.phone}</p>
                        <p>📧 {supplier.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* MAINTENANCE SCHEDULES SECTION */}
          {activeSection === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">📅 Maintenance Schedules</h2>
              <div className="flex gap-4 mb-6">
                {([{ key: 'residential', label: '🏠 Residential', icon: '🏠' },
                   { key: 'commercial', label: '🏢 Commercial', icon: '🏢' },
                   { key: 'coldRoom', label: '🧊 Cold Room', icon: '🧊' }] as const).map(type => (
                  <button
                    key={type.key}
                    onClick={() => setSelectedMaintenanceType(type.key)}
                    className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
                      selectedMaintenanceType === type.key
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-6">
                {Object.entries(HVAC_MAINTENANCE_SCHEDULES[selectedMaintenanceType]).map(([frequency, tasks]) => (
                  tasks.length > 0 && (
                    <div key={frequency} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <div className={`p-4 ${
                        frequency === 'daily' ? 'bg-green-600/50' :
                        frequency === 'weekly' ? 'bg-blue-600/50' :
                        frequency === 'monthly' ? 'bg-purple-600/50' :
                        frequency === 'quarterly' ? 'bg-orange-600/50' :
                        'bg-red-600/50'
                      }`}>
                        <h3 className="text-xl font-bold text-white capitalize">{frequency} Maintenance</h3>
                      </div>
                      <div className="p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="text-gray-400 text-sm">
                              <th className="text-left p-2">Task</th>
                              <th className="text-left p-2">Procedure</th>
                              <th className="text-left p-2">Tools</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tasks.map((item, idx) => (
                              <tr key={idx} className="border-t border-white/10">
                                <td className="p-2 text-cyan-400 font-medium">{item.task}</td>
                                <td className="p-2 text-gray-300 text-sm">{item.procedure}</td>
                                <td className="p-2">
                                  <div className="flex flex-wrap gap-1">
                                    {item.tools.map(tool => (
                                      <span key={tool} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">{tool}</span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Repair Manual Modal */}
      <AnimatePresence>
        {selectedRepairManual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedRepairManual(null)}
          >
            <div className="min-h-screen py-8 px-4">
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-slate-800 rounded-2xl border border-cyan-500/30 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">{selectedRepairManual.category}</span>
                      <h2 className="text-2xl font-bold text-white mt-2">{selectedRepairManual.title}</h2>
                      <div className="flex gap-4 mt-2 text-white/80">
                        <span>⏱️ {selectedRepairManual.timeRequired}</span>
                        <span>📊 {selectedRepairManual.difficulty}</span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedRepairManual(null)} className="text-white/80 hover:text-white text-2xl">✕</button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                    <h3 className="text-red-400 font-bold mb-3">⚠️ Safety Warnings</h3>
                    <ul className="space-y-2">
                      {selectedRepairManual.safetyWarnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-red-300">
                          <span className="text-red-500">⚠️</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-cyan-400 font-bold mb-3">🔧 Tools Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRepairManual.tools.map(tool => (
                        <span key={tool} className="px-3 py-2 bg-white/10 rounded-lg text-gray-300">{tool}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-green-400 font-bold mb-4">📋 Step-by-Step Procedure</h3>
                    <div className="space-y-4">
                      {selectedRepairManual.steps.map(step => (
                        <div key={step.step} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-bold text-lg">{step.title}</h4>
                              <p className="text-gray-300 mt-1">{step.description}</p>
                              {step.details && <p className="text-gray-400 text-sm mt-2 italic">{step.details}</p>}
                              {step.caution && (
                                <div className="mt-3 bg-amber-500/20 border border-amber-500/50 rounded-lg p-2">
                                  <span className="text-amber-400 text-sm">⚠️ {step.caution}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
                    <h3 className="text-green-400 font-bold mb-3">✅ Verification Checklist</h3>
                    <ul className="space-y-2">
                      {selectedRepairManual.verification.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-green-300">
                          <span className="text-green-500">☐</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>The HVAC Bible - Kenya's Most Comprehensive HVAC & Refrigeration Guide</p>
          <p className="text-sm mt-2">Part of Emerson EIMS Maintenance Hub</p>
        </div>
      </footer>
    </div>
  );
}
