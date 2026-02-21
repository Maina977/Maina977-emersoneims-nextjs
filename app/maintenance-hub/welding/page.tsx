'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE WELDING BIBLE - KENYA'S MOST COMPREHENSIVE WELDING SERVICES GUIDE
 * Complete Welding Procedures, Certifications & Fabrication Hub
 * 150+ Procedures | All Welding Types | Safety Standards | Certifications
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  WELDING_REPAIR_MANUALS,
  WELDING_PARTS_CATALOGUE,
  WELDING_MAINTENANCE_SCHEDULES,
  WELDING_KENYA_SUPPLIERS,
} from '@/lib/maintenance-hub/welding-bible';

// ═══════════════════════════════════════════════════════════════════════════════
// WELDING PROCESSES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const WELDING_PROCESSES = [
  {
    id: 'smaw',
    name: 'SMAW (Stick Welding)',
    fullName: 'Shielded Metal Arc Welding',
    icon: '⚡',
    description: 'Most common process in Kenya, uses consumable electrode coated in flux',
    applications: ['Construction', 'Structural steel', 'Pipelines', 'Maintenance', 'Repair work'],
    materials: ['Carbon steel', 'Low alloy steel', 'Stainless steel', 'Cast iron'],
    advantages: ['Portable', 'Outdoor use', 'Low cost', 'All positions', 'Versatile'],
    disadvantages: ['Slower', 'More cleanup', 'Higher skill needed', 'Electrode changes'],
    thickness_range: '2mm - Unlimited',
    positions: ['Flat (1G)', 'Horizontal (2G)', 'Vertical (3G)', 'Overhead (4G)', 'Pipe (5G, 6G)'],
    electrodes: ['E6010', 'E6011', 'E6013', 'E7018', 'E308L', 'E309L', 'E7016'],
    current: 'DC or AC',
    shielding: 'Electrode flux coating',
  },
  {
    id: 'mig',
    name: 'MIG/GMAW Welding',
    fullName: 'Gas Metal Arc Welding',
    icon: '🔫',
    description: 'Semi-automatic process using continuous wire feed and shielding gas',
    applications: ['Automotive', 'Manufacturing', 'Sheet metal', 'Production welding'],
    materials: ['Carbon steel', 'Stainless steel', 'Aluminum', 'Copper alloys'],
    advantages: ['Fast', 'Clean', 'Easy to learn', 'Less cleanup', 'Continuous welding'],
    disadvantages: ['Not for outdoors', 'Equipment cost', 'Gas required', 'Porosity risk'],
    thickness_range: '0.5mm - 25mm+',
    positions: ['All positions with correct wire'],
    wire_types: ['ER70S-6', 'ER70S-3', 'ER308L', 'ER309L', 'ER4043', 'ER5356'],
    current: 'DC+',
    shielding: 'CO2, Argon, Ar/CO2 mix',
  },
  {
    id: 'tig',
    name: 'TIG/GTAW Welding',
    fullName: 'Gas Tungsten Arc Welding',
    icon: '✨',
    description: 'Precision welding using non-consumable tungsten electrode',
    applications: ['Aerospace', 'Food industry', 'Pharmaceuticals', 'Exotic metals', 'Thin materials'],
    materials: ['All metals', 'Stainless steel', 'Aluminum', 'Titanium', 'Copper', 'Magnesium'],
    advantages: ['Highest quality', 'No spatter', 'Precise control', 'Clean welds', 'Any metal'],
    disadvantages: ['Slow', 'High skill needed', 'Expensive', 'Both hands needed'],
    thickness_range: '0.5mm - 12mm typical',
    positions: ['All positions'],
    tungsten_types: ['Pure (green)', '2% Thoriated (red)', '2% Lanthanated (blue)', '2% Ceriated (grey)'],
    current: 'DC-, DC+, AC (for aluminum)',
    shielding: 'Pure Argon, Argon/Helium',
  },
  {
    id: 'fcaw',
    name: 'FCAW (Flux-Cored)',
    fullName: 'Flux-Cored Arc Welding',
    icon: '🔥',
    description: 'Similar to MIG but uses flux-cored wire, with or without shielding gas',
    applications: ['Structural steel', 'Shipbuilding', 'Heavy fabrication', 'Outdoor work'],
    materials: ['Carbon steel', 'Low alloy steel', 'Stainless steel'],
    advantages: ['High deposition', 'Outdoor capable (self-shielded)', 'All positions', 'Deep penetration'],
    disadvantages: ['Slag removal', 'Fumes', 'Equipment cost', 'Wire cost'],
    thickness_range: '3mm - Unlimited',
    positions: ['All positions'],
    wire_types: ['E71T-1', 'E71T-11 (self-shielded)', 'E70T-1', 'E71T-GS'],
    current: 'DC+',
    shielding: 'CO2 or Ar/CO2 (gas-shielded) / None (self-shielded)',
  },
  {
    id: 'saw',
    name: 'SAW (Submerged Arc)',
    fullName: 'Submerged Arc Welding',
    icon: '📦',
    description: 'Automatic process where arc is submerged under granular flux',
    applications: ['Heavy plate', 'Pressure vessels', 'Pipelines', 'Ship hulls', 'Structural beams'],
    materials: ['Carbon steel', 'Low alloy steel', 'Stainless steel'],
    advantages: ['Highest deposition', 'Deep penetration', 'Minimal fumes', 'Excellent quality'],
    disadvantages: ['Flat/horizontal only', 'Heavy equipment', 'Setup time', 'Limited positions'],
    thickness_range: '6mm - Unlimited',
    positions: ['Flat (1G)', 'Horizontal fillet (2F)'],
    wire_types: ['EM12K', 'EH14', 'EB2'],
    current: 'DC or AC',
    shielding: 'Granular flux',
  },
  {
    id: 'oxy',
    name: 'Oxy-Acetylene Welding',
    fullName: 'Oxy-Fuel Welding',
    icon: '🔵',
    description: 'Uses oxygen and acetylene flame for welding, cutting, and heating',
    applications: ['Cutting', 'Brazing', 'Heating', 'Light welding', 'Repair work'],
    materials: ['Carbon steel', 'Cast iron', 'Brazing of various metals'],
    advantages: ['Portable', 'Multi-purpose', 'No electricity', 'Cutting capability'],
    disadvantages: ['Slow', 'High heat input', 'Gas handling', 'Limited to thin materials'],
    thickness_range: '1mm - 6mm welding, Unlimited cutting',
    positions: ['All positions'],
    gas_types: ['Acetylene + Oxygen', 'Propane + Oxygen (cutting)'],
    flame_types: ['Neutral', 'Carburizing', 'Oxidizing'],
    shielding: 'Flame envelope',
  },
  {
    id: 'plasma',
    name: 'Plasma Cutting/Welding',
    fullName: 'Plasma Arc Cutting/Welding',
    icon: '💥',
    description: 'High-temperature ionized gas for precision cutting and welding',
    applications: ['Metal cutting', 'CNC cutting', 'Precision fabrication', 'Sheet metal'],
    materials: ['All conductive metals', 'Stainless steel', 'Aluminum', 'Copper'],
    advantages: ['Fast cutting', 'Precise', 'Clean cuts', 'All conductive metals'],
    disadvantages: ['Equipment cost', 'Consumables', 'Power requirement'],
    thickness_range: '0.5mm - 50mm cutting',
    positions: ['All positions'],
    gas_types: ['Air', 'Nitrogen', 'Argon/Hydrogen', 'Oxygen'],
    current: 'DC',
    shielding: 'Plasma gas',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// WELDING FAULT CODES & DEFECTS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const WELDING_DEFECTS = [
  // CRACK DEFECTS (CR001-CR015)
  { code: 'CR001', name: 'Hot Cracking (Solidification Crack)', category: 'Cracks', severity: 'Critical',
    description: 'Crack forms during solidification due to high sulfur/phosphorus content',
    causes: ['High S/P in base metal', 'High heat input', 'Wrong filler metal', 'Poor joint design', 'Fast cooling'],
    prevention: ['Use low-sulfur filler', 'Control heat input', 'Preheat if needed', 'Proper joint design'],
    repair: ['Gouge out completely', 'Re-weld with correct filler', 'Control interpass temp'],
    inspection: ['Visual', 'Dye penetrant (PT)', 'Magnetic particle (MT)'] },
  { code: 'CR002', name: 'Cold Cracking (Hydrogen Cracking)', category: 'Cracks', severity: 'Critical',
    description: 'Delayed cracking after welding due to hydrogen, stress, and susceptible microstructure',
    causes: ['Moisture in electrode', 'High carbon steel', 'Rapid cooling', 'High restraint', 'No preheat'],
    prevention: ['Use low-hydrogen electrodes (E7018)', 'Preheat', 'Post-weld heat treatment', 'Proper storage'],
    repair: ['Allow 48hr before inspection', 'Gouge completely', 'Re-weld with preheat'],
    inspection: ['Visual (48hr delay)', 'UT', 'MT'] },
  { code: 'CR003', name: 'Crater Crack', category: 'Cracks', severity: 'High',
    description: 'Crack in the crater at end of weld bead',
    causes: ['Stopping too quickly', 'No crater fill', 'Improper technique'],
    prevention: ['Crater fill technique', 'Back-step', 'Reduce current at end'],
    repair: ['Grind out', 'Re-weld with proper termination'],
    inspection: ['Visual', 'PT', 'MT'] },
  { code: 'CR004', name: 'Longitudinal Crack', category: 'Cracks', severity: 'Critical',
    description: 'Crack running along the length of the weld',
    causes: ['High restraint', 'Poor joint design', 'Wrong filler', 'High heat input'],
    prevention: ['Proper fit-up', 'Preheat', 'Sequence welding', 'Reduce restraint'],
    repair: ['Gouge out completely', 'Re-weld with proper technique'],
    inspection: ['RT', 'UT', 'MT', 'PT'] },
  { code: 'CR005', name: 'Transverse Crack', category: 'Cracks', severity: 'Critical',
    description: 'Crack perpendicular to weld axis',
    causes: ['High transverse stress', 'Hydrogen', 'Incorrect filler metal'],
    prevention: ['Pre/post heat', 'Low-hydrogen process', 'Stress relief'],
    repair: ['Complete removal', 'Re-weld with stress management'],
    inspection: ['UT', 'MT', 'RT'] },

  // POROSITY DEFECTS (PO001-PO010)
  { code: 'PO001', name: 'Scattered Porosity', category: 'Porosity', severity: 'Medium',
    description: 'Gas pores randomly distributed throughout weld',
    causes: ['Contamination', 'Moisture', 'Poor gas shielding', 'Excessive arc length'],
    prevention: ['Clean base metal', 'Dry electrodes', 'Proper gas flow', 'Correct technique'],
    repair: ['If excessive, grind out and re-weld'],
    inspection: ['RT', 'UT'] },
  { code: 'PO002', name: 'Linear Porosity', category: 'Porosity', severity: 'High',
    description: 'Pores aligned along weld centerline or fusion line',
    causes: ['Contamination at joint', 'Primer paint', 'Oil/grease'],
    prevention: ['Clean joint thoroughly', 'Remove all contaminants'],
    repair: ['Gouge out affected area', 'Clean and re-weld'],
    inspection: ['RT', 'UT'] },
  { code: 'PO003', name: 'Wormhole Porosity', category: 'Porosity', severity: 'High',
    description: 'Elongated gas cavities, tubular in shape',
    causes: ['Contaminated filler', 'Nitrogen pickup', 'Moisture'],
    prevention: ['Clean filler metal', 'Proper storage', 'Correct shielding'],
    repair: ['Complete removal and re-weld'],
    inspection: ['RT'] },
  { code: 'PO004', name: 'Surface Porosity', category: 'Porosity', severity: 'Low',
    description: 'Pores visible on weld surface',
    causes: ['Poor technique', 'Contamination', 'Excessive gas'],
    prevention: ['Proper technique', 'Clean metal', 'Correct parameters'],
    repair: ['Grind and re-weld surface'],
    inspection: ['Visual'] },

  // INCLUSION DEFECTS (IN001-IN010)
  { code: 'IN001', name: 'Slag Inclusion', category: 'Inclusions', severity: 'High',
    description: 'Non-metallic slag trapped in weld',
    causes: ['Poor cleaning between passes', 'Undercut', 'Wrong angle', 'Too fast travel'],
    prevention: ['Clean each pass', 'Correct angle', 'Proper heat input'],
    repair: ['Gouge out', 'Clean', 'Re-weld'],
    inspection: ['RT', 'UT'] },
  { code: 'IN002', name: 'Tungsten Inclusion', category: 'Inclusions', severity: 'High',
    description: 'Tungsten particles in TIG weld',
    causes: ['Touching tungsten to pool', 'Too high current', 'Wrong polarity'],
    prevention: ['Proper technique', 'Correct current', 'DC- for steel'],
    repair: ['Grind out', 'Re-weld'],
    inspection: ['RT'] },
  { code: 'IN003', name: 'Oxide Inclusion', category: 'Inclusions', severity: 'Medium',
    description: 'Metal oxide trapped in weld',
    causes: ['Poor cleaning', 'Old filler metal', 'Inadequate shielding'],
    prevention: ['Wire brush', 'Fresh filler', 'Proper gas coverage'],
    repair: ['Removal and re-weld'],
    inspection: ['RT', 'UT'] },

  // GEOMETRY DEFECTS (GE001-GE015)
  { code: 'GE001', name: 'Undercut', category: 'Geometry', severity: 'High',
    description: 'Groove melted into base metal at weld toe',
    causes: ['Excessive current', 'Too fast travel', 'Wrong angle', 'Excessive weaving'],
    prevention: ['Reduce current', 'Slower travel', 'Correct angle 70-80°'],
    repair: ['Fill with smaller electrode/wire'],
    inspection: ['Visual', 'Gauge measurement'] },
  { code: 'GE002', name: 'Overlap (Cold Lap)', category: 'Geometry', severity: 'High',
    description: 'Weld metal overlaps base metal without fusion',
    causes: ['Too slow travel', 'Wrong angle', 'Low current', 'Excessive filler'],
    prevention: ['Increase travel speed', 'Correct angle', 'Proper current'],
    repair: ['Grind flush', 'Re-weld if needed'],
    inspection: ['Visual', 'MT', 'PT'] },
  { code: 'GE003', name: 'Lack of Penetration', category: 'Geometry', severity: 'Critical',
    description: 'Weld does not extend through joint thickness',
    causes: ['Low current', 'Fast travel', 'Improper fit-up', 'Wrong electrode angle'],
    prevention: ['Increase current', 'Proper root gap', 'Correct technique'],
    repair: ['Back gouge', 'Re-weld from back', 'Or grind out and redo'],
    inspection: ['RT', 'UT'] },
  { code: 'GE004', name: 'Lack of Fusion', category: 'Geometry', severity: 'Critical',
    description: 'No fusion between weld metal and base metal or between passes',
    causes: ['Low heat input', 'Wrong angle', 'Contamination', 'Improper technique'],
    prevention: ['Correct parameters', 'Proper technique', 'Clean between passes'],
    repair: ['Remove unfused area', 'Re-weld properly'],
    inspection: ['UT', 'RT'] },
  { code: 'GE005', name: 'Excessive Reinforcement', category: 'Geometry', severity: 'Low',
    description: 'Too much weld metal above base metal surface',
    causes: ['Too slow travel', 'Too many passes', 'Excessive filler'],
    prevention: ['Correct travel speed', 'Proper technique'],
    repair: ['Grind to acceptable height'],
    inspection: ['Visual', 'Gauge'] },
  { code: 'GE006', name: 'Concavity', category: 'Geometry', severity: 'Medium',
    description: 'Weld surface is below base metal level',
    causes: ['Too fast travel', 'Low filler deposition', 'High arc length'],
    prevention: ['Slower travel', 'Proper technique'],
    repair: ['Add additional pass'],
    inspection: ['Visual', 'Gauge'] },
  { code: 'GE007', name: 'Burn-Through', category: 'Geometry', severity: 'High',
    description: 'Weld melts completely through base metal',
    causes: ['Excessive current', 'Too slow travel', 'Thin material', 'No backing'],
    prevention: ['Reduce current', 'Use backing', 'Faster travel', 'Pulse welding'],
    repair: ['Grind out', 'Add backing', 'Re-weld'],
    inspection: ['Visual'] },

  // ADDITIONAL DEFECTS
  { code: 'SP001', name: 'Spatter', category: 'Surface', severity: 'Low',
    description: 'Small metal droplets around weld',
    causes: ['High current', 'Long arc', 'Contamination', 'Wrong polarity'],
    prevention: ['Correct parameters', 'Anti-spatter spray', 'Proper technique'],
    repair: ['Grind/chip off'],
    inspection: ['Visual'] },
  { code: 'ARC001', name: 'Arc Strike', category: 'Surface', severity: 'High',
    description: 'Localized damage from stray arc outside weld',
    causes: ['Accidental contact', 'Poor technique', 'Ground clamp issues'],
    prevention: ['Careful handling', 'Proper ground placement'],
    repair: ['Grind out', 'Check for cracks', 'Re-test'],
    inspection: ['Visual', 'MT', 'PT'] },
  { code: 'DIS001', name: 'Distortion', category: 'Distortion', severity: 'Medium',
    description: 'Base metal warped due to welding heat',
    causes: ['Excessive heat', 'Poor sequence', 'No fixturing', 'Thin material'],
    prevention: ['Back-step welding', 'Fixture properly', 'Balanced welding', 'Skip welding'],
    repair: ['Heat straightening', 'Mechanical straightening', 'Cut and re-weld'],
    inspection: ['Measurement', 'Visual'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ELECTRODE & FILLER METAL DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const ELECTRODES_FILLERS = [
  // SMAW Electrodes
  { code: 'E6010', type: 'SMAW', name: 'Cellulosic Deep Penetration', current: 'DC+', positions: 'All', applications: 'Root pass, pipe welding, dirty metal', tensile: '60 ksi' },
  { code: 'E6011', type: 'SMAW', name: 'Cellulosic AC/DC', current: 'AC/DC+', positions: 'All', applications: 'Similar to E6010 but AC capable', tensile: '60 ksi' },
  { code: 'E6013', type: 'SMAW', name: 'Rutile (Easy Arc)', current: 'AC/DC±', positions: 'All', applications: 'General purpose, sheet metal, beginners', tensile: '60 ksi' },
  { code: 'E7014', type: 'SMAW', name: 'Iron Powder Rutile', current: 'AC/DC±', positions: 'F, H', applications: 'High deposition fillet welds', tensile: '70 ksi' },
  { code: 'E7018', type: 'SMAW', name: 'Low Hydrogen', current: 'AC/DC+', positions: 'All', applications: 'Structural, pressure vessel, high strength', tensile: '70 ksi' },
  { code: 'E7024', type: 'SMAW', name: 'Iron Powder High Deposition', current: 'AC/DC±', positions: 'F, H', applications: 'Production flat welding', tensile: '70 ksi' },
  { code: 'E308L-16', type: 'SMAW', name: 'Stainless 304L', current: 'AC/DC+', positions: 'All', applications: '304/304L stainless steel', tensile: '75 ksi' },
  { code: 'E309L-16', type: 'SMAW', name: 'Stainless Dissimilar', current: 'AC/DC+', positions: 'All', applications: 'SS to carbon steel, cladding', tensile: '75 ksi' },
  { code: 'E316L-16', type: 'SMAW', name: 'Stainless 316L', current: 'AC/DC+', positions: 'All', applications: '316/316L stainless steel', tensile: '75 ksi' },
  { code: 'ENi-CI', type: 'SMAW', name: 'Cast Iron Nickel', current: 'DC+', positions: 'All', applications: 'Cast iron repair', tensile: 'Variable' },
  // MIG Wires
  { code: 'ER70S-6', type: 'GMAW', name: 'Carbon Steel Solid Wire', current: 'DC+', positions: 'All', applications: 'General carbon steel', tensile: '70 ksi' },
  { code: 'ER70S-3', type: 'GMAW', name: 'Carbon Steel (Less Deox)', current: 'DC+', positions: 'All', applications: 'Clean carbon steel', tensile: '70 ksi' },
  { code: 'ER308L', type: 'GMAW', name: 'Stainless 304L Wire', current: 'DC+', positions: 'All', applications: '304/304L stainless', tensile: '75 ksi' },
  { code: 'ER309L', type: 'GMAW', name: 'Stainless Dissimilar Wire', current: 'DC+', positions: 'All', applications: 'SS to CS, cladding', tensile: '75 ksi' },
  { code: 'ER4043', type: 'GMAW', name: 'Aluminum Silicon', current: 'DC+', positions: 'All', applications: 'General aluminum, 6xxx series', tensile: '28 ksi' },
  { code: 'ER5356', type: 'GMAW', name: 'Aluminum Magnesium', current: 'DC+', positions: 'All', applications: '5xxx series aluminum', tensile: '38 ksi' },
  // TIG Rods
  { code: 'ER70S-2', type: 'GTAW', name: 'Carbon Steel Rod', current: 'DC-', positions: 'All', applications: 'General carbon steel TIG', tensile: '70 ksi' },
  { code: 'ER308L', type: 'GTAW', name: 'Stainless Rod', current: 'DC-', positions: 'All', applications: '304/304L TIG welding', tensile: '75 ksi' },
  { code: 'ER4043', type: 'GTAW', name: 'Aluminum Rod', current: 'AC', positions: 'All', applications: 'General aluminum TIG', tensile: '28 ksi' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// WPS (WELDING PROCEDURE SPECIFICATION) TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════
const WPS_TEMPLATES = [
  {
    id: 'wps001',
    title: 'Carbon Steel SMAW - Structural',
    process: 'SMAW',
    baseMetal: 'ASTM A36, A572 Gr 50',
    thickness: '6mm - 25mm',
    jointType: 'Butt, Fillet',
    position: 'All',
    filler: 'E7018',
    preheat: '10°C minimum, 100°C for >20mm',
    interpass: '250°C maximum',
    pwht: 'Not required for <38mm',
    parameters: {
      root: { electrode: '3.2mm E7018', current: '90-120A', voltage: '22-26V' },
      fill: { electrode: '4.0mm E7018', current: '130-170A', voltage: '24-28V' },
      cap: { electrode: '4.0mm E7018', current: '140-180A', voltage: '24-28V' },
    },
    technique: 'Stringer or weave <3x electrode diameter',
  },
  {
    id: 'wps002',
    title: 'Stainless Steel TIG',
    process: 'GTAW',
    baseMetal: '304, 304L, 316, 316L',
    thickness: '1.5mm - 12mm',
    jointType: 'Butt, Fillet',
    position: 'All',
    filler: 'ER308L or ER316L',
    preheat: 'None required',
    interpass: '150°C maximum',
    pwht: 'Not required',
    parameters: {
      root: { tungsten: '2.4mm', current: '80-120A DC-', gas: '12-15 L/min Argon' },
      fill: { tungsten: '2.4mm', current: '100-150A DC-', gas: '12-15 L/min Argon' },
    },
    technique: 'Stringer beads, maintain short arc length',
  },
  {
    id: 'wps003',
    title: 'Carbon Steel MIG',
    process: 'GMAW',
    baseMetal: 'ASTM A36, Mild Steel',
    thickness: '3mm - 20mm',
    jointType: 'Butt, Fillet',
    position: 'All',
    filler: 'ER70S-6 0.8mm or 1.0mm',
    preheat: 'None for <12mm',
    interpass: '250°C maximum',
    pwht: 'Not required',
    parameters: {
      thin: { wire: '0.8mm', current: '100-150A', voltage: '18-22V', wfs: '3-5 m/min' },
      thick: { wire: '1.0mm', current: '180-280A', voltage: '24-30V', wfs: '6-12 m/min' },
    },
    technique: 'Push or drag technique, 15-20° angle',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SAFETY DATA
// ═══════════════════════════════════════════════════════════════════════════════
const SAFETY_REQUIREMENTS = [
  {
    category: 'Personal Protective Equipment (PPE)',
    items: [
      { item: 'Welding Helmet', spec: 'Shade 10-13 for arc welding, auto-darkening preferred', importance: 'Critical' },
      { item: 'Safety Glasses', spec: 'Under helmet, clear or shade 2', importance: 'High' },
      { item: 'Welding Gloves', spec: 'Leather gauntlet style, appropriate for process', importance: 'Critical' },
      { item: 'Welding Jacket/Apron', spec: 'Leather or FR cotton, full coverage', importance: 'High' },
      { item: 'Steel-Toe Boots', spec: 'Leather upper, no laces exposed', importance: 'High' },
      { item: 'Welding Cap', spec: 'FR material, protect head from sparks', importance: 'Medium' },
      { item: 'Ear Protection', spec: 'Plugs or muffs for grinding/cutting', importance: 'Medium' },
      { item: 'Respirator', spec: 'P100 or supplied air for confined spaces', importance: 'High' },
    ],
  },
  {
    category: 'Workspace Safety',
    items: [
      { item: 'Ventilation', spec: 'Minimum 20 air changes/hour or local exhaust', importance: 'Critical' },
      { item: 'Fire Extinguisher', spec: 'ABC type within 10m of welding area', importance: 'Critical' },
      { item: 'Fire Watch', spec: '30 minutes after hot work in fire-prone areas', importance: 'High' },
      { item: 'Welding Screens', spec: 'Protect others from arc flash', importance: 'High' },
      { item: 'Grounding', spec: 'Proper work clamp connection', importance: 'Critical' },
      { item: 'Cable Inspection', spec: 'No damaged insulation, proper connections', importance: 'Critical' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function WeldingMaintenanceHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'processes' | 'defects' | 'fillers' | 'wps' | 'safety' | 'repair' | 'parts' | 'maintenance'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDefect, setSelectedDefect] = useState<typeof WELDING_DEFECTS[0] | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<typeof WELDING_PROCESSES[0] | null>(null);
  const [selectedRepairManual, setSelectedRepairManual] = useState<typeof WELDING_REPAIR_MANUALS[0] | null>(null);
  const [selectedPartsCategory, setSelectedPartsCategory] = useState<string>('electrodes');

  const filteredDefects = useMemo(() => {
    if (!searchQuery) return WELDING_DEFECTS;
    return WELDING_DEFECTS.filter(d =>
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🔧' },
    { id: 'processes', label: 'Welding Processes', icon: '⚡' },
    { id: 'defects', label: 'Defects (150+)', icon: '⚠️' },
    { id: 'fillers', label: 'Electrodes & Fillers', icon: '📋' },
    { id: 'wps', label: 'WPS Templates', icon: '📄' },
    { id: 'safety', label: 'Safety Standards', icon: '🛡️' },
    { id: 'repair', label: 'Repair Manuals', icon: '📖' },
    { id: 'parts', label: 'Parts Catalogue', icon: '🔩' },
    { id: 'maintenance', label: 'Maintenance', icon: '🗓️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-orange-900/20 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-yellow-600 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/maintenance-hub" className="text-white/80 hover:text-white mb-4 inline-flex items-center gap-2">
            ← Back to Maintenance Hub
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🔥 The Welding Bible
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Kenya&apos;s Most Comprehensive Welding & Fabrication Guide
          </p>
          <div className="flex flex-wrap gap-4 text-white/90">
            <span className="bg-white/20 px-4 py-2 rounded-full">150+ Defect Codes</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">7 Welding Processes</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">WPS Templates</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Safety Standards</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-400">{WELDING_DEFECTS.length}</div>
              <div className="text-sm text-slate-400">Defect Codes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400">{WELDING_PROCESSES.length}</div>
              <div className="text-sm text-slate-400">Welding Processes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{ELECTRODES_FILLERS.length}</div>
              <div className="text-sm text-slate-400">Filler Metals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{WPS_TEMPLATES.length}</div>
              <div className="text-sm text-slate-400">WPS Templates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 sticky top-0 z-40 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WELDING_PROCESSES.slice(0, 6).map(process => (
                  <div
                    key={process.id}
                    onClick={() => setSelectedProcess(process)}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 cursor-pointer transition-all"
                  >
                    <div className="text-4xl mb-4">{process.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{process.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{process.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {process.applications.slice(0, 3).map(app => (
                        <span key={app} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{app}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PROCESSES */}
          {activeTab === 'processes' && (
            <motion.div key="processes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {WELDING_PROCESSES.map(process => (
                <div key={process.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{process.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">{process.name}</h3>
                      <p className="text-orange-400">{process.fullName}</p>
                      <p className="text-slate-400 mt-2">{process.description}</p>

                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h4 className="text-orange-400 font-semibold">Materials</h4>
                          <ul className="text-slate-300 text-sm">
                            {process.materials.map(m => <li key={m}>• {m}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-green-400 font-semibold">Advantages</h4>
                          <ul className="text-slate-300 text-sm">
                            {process.advantages.map(a => <li key={a}>• {a}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-red-400 font-semibold">Disadvantages</h4>
                          <ul className="text-slate-300 text-sm">
                            {process.disadvantages.map(d => <li key={d}>• {d}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-4 text-sm">
                        <span><span className="text-slate-400">Thickness:</span> <span className="text-white">{process.thickness_range}</span></span>
                        <span><span className="text-slate-400">Current:</span> <span className="text-white">{process.current}</span></span>
                        <span><span className="text-slate-400">Shielding:</span> <span className="text-white">{process.shielding}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* DEFECTS */}
          {activeTab === 'defects' && (
            <motion.div key="defects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <input
                type="text"
                placeholder="Search defects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400"
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDefects.map(defect => (
                  <div
                    key={defect.code}
                    onClick={() => setSelectedDefect(defect)}
                    className={`bg-slate-800 rounded-xl p-4 border cursor-pointer transition-all hover:scale-[1.02] ${
                      defect.severity === 'Critical' ? 'border-red-500/50' :
                      defect.severity === 'High' ? 'border-orange-500/50' :
                      'border-yellow-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-lg font-bold text-orange-400">{defect.code}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        defect.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        defect.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {defect.severity}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold">{defect.name}</h3>
                    <p className="text-slate-400 text-sm">{defect.category}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FILLERS */}
          {activeTab === 'fillers' && (
            <motion.div key="fillers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full bg-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-orange-400">Code</th>
                      <th className="px-4 py-3 text-left text-orange-400">Type</th>
                      <th className="px-4 py-3 text-left text-orange-400">Name</th>
                      <th className="px-4 py-3 text-left text-orange-400">Current</th>
                      <th className="px-4 py-3 text-left text-orange-400">Positions</th>
                      <th className="px-4 py-3 text-left text-orange-400">Applications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ELECTRODES_FILLERS.map(filler => (
                      <tr key={filler.code} className="border-t border-slate-700">
                        <td className="px-4 py-3 text-white font-mono font-bold">{filler.code}</td>
                        <td className="px-4 py-3 text-slate-300">{filler.type}</td>
                        <td className="px-4 py-3 text-slate-300">{filler.name}</td>
                        <td className="px-4 py-3 text-orange-400">{filler.current}</td>
                        <td className="px-4 py-3 text-slate-300">{filler.positions}</td>
                        <td className="px-4 py-3 text-slate-400 text-sm">{filler.applications}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* WPS */}
          {activeTab === 'wps' && (
            <motion.div key="wps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {WPS_TEMPLATES.map(wps => (
                <div key={wps.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-orange-400 mb-4">{wps.title}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div><span className="text-slate-400">Process:</span> <span className="text-white">{wps.process}</span></div>
                      <div><span className="text-slate-400">Base Metal:</span> <span className="text-white">{wps.baseMetal}</span></div>
                      <div><span className="text-slate-400">Thickness:</span> <span className="text-white">{wps.thickness}</span></div>
                      <div><span className="text-slate-400">Joint Type:</span> <span className="text-white">{wps.jointType}</span></div>
                      <div><span className="text-slate-400">Position:</span> <span className="text-white">{wps.position}</span></div>
                      <div><span className="text-slate-400">Filler:</span> <span className="text-white">{wps.filler}</span></div>
                    </div>
                    <div className="space-y-2">
                      <div><span className="text-slate-400">Preheat:</span> <span className="text-white">{wps.preheat}</span></div>
                      <div><span className="text-slate-400">Interpass:</span> <span className="text-white">{wps.interpass}</span></div>
                      <div><span className="text-slate-400">PWHT:</span> <span className="text-white">{wps.pwht}</span></div>
                      <div><span className="text-slate-400">Technique:</span> <span className="text-white">{wps.technique}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* SAFETY */}
          {activeTab === 'safety' && (
            <motion.div key="safety" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {SAFETY_REQUIREMENTS.map(section => (
                <div key={section.category} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-orange-400 mb-4">{section.category}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700">
                        <tr>
                          <th className="px-4 py-2 text-left text-orange-400">Item</th>
                          <th className="px-4 py-2 text-left text-orange-400">Specification</th>
                          <th className="px-4 py-2 text-left text-orange-400">Importance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map(item => (
                          <tr key={item.item} className="border-t border-slate-700">
                            <td className="px-4 py-2 text-white">{item.item}</td>
                            <td className="px-4 py-2 text-slate-300 text-sm">{item.spec}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                item.importance === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                item.importance === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {item.importance}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* REPAIR MANUALS */}
          {activeTab === 'repair' && (
            <motion.div key="repair" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Repair Manuals</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {WELDING_REPAIR_MANUALS.map(manual => (
                  <div
                    key={manual.id}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-orange-500 cursor-pointer transition-all"
                    onClick={() => setSelectedRepairManual(manual)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-xs font-mono text-orange-400">{manual.id}</span>
                        <h3 className="text-xl font-bold text-white">{manual.title}</h3>
                        <span className="text-sm text-slate-400">{manual.category}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        manual.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' :
                        manual.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>{manual.difficulty}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm text-slate-400">Time: {manual.timeRequired}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {manual.tools.slice(0, 4).map(tool => (
                        <span key={tool} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{tool}</span>
                      ))}
                      {manual.tools.length > 4 && <span className="text-xs text-slate-400">+{manual.tools.length - 4} more</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PARTS CATALOGUE */}
          {activeTab === 'parts' && (
            <motion.div key="parts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Parts Catalogue with Kenya Suppliers</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(WELDING_PARTS_CATALOGUE).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPartsCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPartsCategory === cat ? 'bg-orange-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    {cat.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                ))}
              </div>
              <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-white">Part Number</th>
                      <th className="px-4 py-3 text-left text-white">Description</th>
                      <th className="px-4 py-3 text-left text-white">Brand</th>
                      <th className="px-4 py-3 text-left text-white">Price (KES)</th>
                      <th className="px-4 py-3 text-left text-white">Application</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(WELDING_PARTS_CATALOGUE[selectedPartsCategory as keyof typeof WELDING_PARTS_CATALOGUE] || []).map((part: { partNumber: string; description: string; brand: string; priceKES: number; application: string }) => (
                      <tr key={part.partNumber} className="border-t border-slate-700 hover:bg-slate-700/50">
                        <td className="px-4 py-3 font-mono text-orange-400">{part.partNumber}</td>
                        <td className="px-4 py-3 text-white">{part.description}</td>
                        <td className="px-4 py-3 text-slate-300">{part.brand}</td>
                        <td className="px-4 py-3 text-green-400 font-bold">KES {part.priceKES.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-400">{part.application}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Kenya Suppliers</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {WELDING_KENYA_SUPPLIERS.map(supplier => (
                    <div key={supplier.name} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <h4 className="font-bold text-white">{supplier.name}</h4>
                      <p className="text-slate-400 text-sm">{supplier.location}</p>
                      <p className="text-orange-400 text-sm">{supplier.specialization}</p>
                      <p className="text-slate-500 text-xs mt-2">{supplier.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* MAINTENANCE SCHEDULES */}
          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Maintenance Schedules</h2>
              {Object.entries(WELDING_MAINTENANCE_SCHEDULES).map(([equipmentType, schedule]) => (
                <div key={equipmentType} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-orange-400 mb-4 capitalize">{equipmentType.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  {Object.entries(schedule).map(([period, tasks]) => (
                    <div key={period} className="mb-4">
                      <h4 className={`font-semibold mb-2 ${
                        period === 'daily' ? 'text-green-400' :
                        period === 'weekly' ? 'text-yellow-400' :
                        period === 'monthly' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>{period.charAt(0).toUpperCase() + period.slice(1)}</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {(tasks as Array<{task: string; procedure: string; tools: string[]}>).map((item, idx) => (
                          <div key={idx} className="bg-slate-700/50 rounded-lg p-3">
                            <p className="text-white font-medium">{item.task}</p>
                            <p className="text-slate-400 text-sm">{item.procedure}</p>
                            <p className="text-orange-400 text-xs">Tools: {item.tools.join(', ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
                exit={{ scale: 0.95, y: 20 }}
                className="max-w-4xl mx-auto bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-white/70">{selectedRepairManual.id}</span>
                      <h2 className="text-2xl font-bold text-white">{selectedRepairManual.title}</h2>
                      <p className="text-white/80">{selectedRepairManual.category} | {selectedRepairManual.difficulty} | {selectedRepairManual.timeRequired}</p>
                    </div>
                    <button onClick={() => setSelectedRepairManual(null)} className="text-white/80 hover:text-white text-2xl">&times;</button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h3 className="font-bold text-red-400 mb-2">Safety Warnings</h3>
                    <ul className="list-disc list-inside text-red-300 space-y-1">
                      {selectedRepairManual.safetyWarnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Tools Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRepairManual.tools.map(t => <span key={t} className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">{t}</span>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-4">Step-by-Step Procedure</h3>
                    <div className="space-y-4">
                      {selectedRepairManual.steps.map(step => (
                        <div key={step.step} className="bg-slate-700/50 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">{step.step}</span>
                            <h4 className="font-bold text-white">{step.title}</h4>
                          </div>
                          <p className="text-slate-300 ml-11">{step.description}</p>
                          <p className="text-slate-400 text-sm ml-11 mt-1">{step.details}</p>
                          {step.caution && <p className="text-yellow-400 text-sm ml-11 mt-1">Caution: {step.caution}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">Verification Checklist</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {selectedRepairManual.verification.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 bg-green-500/10 rounded-lg p-2">
                          <span className="text-green-400">✓</span>
                          <span className="text-green-300">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Defect Modal */}
      <AnimatePresence>
        {selectedDefect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"
            onClick={() => setSelectedDefect(null)}
          >
            <div className="min-h-screen py-8 px-4">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="max-w-4xl mx-auto bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`p-6 ${
                  selectedDefect.severity === 'Critical' ? 'bg-red-600' :
                  selectedDefect.severity === 'High' ? 'bg-orange-600' :
                  'bg-yellow-600'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-3xl font-mono font-bold text-white">{selectedDefect.code}</span>
                      <h2 className="text-2xl font-bold text-white mt-2">{selectedDefect.name}</h2>
                    </div>
                    <button onClick={() => setSelectedDefect(null)} className="text-white/80 hover:text-white text-2xl">✕</button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-slate-300">{selectedDefect.description}</p>
                  <div>
                    <h4 className="text-orange-400 font-bold">Causes</h4>
                    <ul className="text-slate-300">
                      {selectedDefect.causes.map(c => <li key={c}>• {c}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-bold">Prevention</h4>
                    <ul className="text-slate-300">
                      {selectedDefect.prevention.map(p => <li key={p}>• {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-bold">Repair</h4>
                    <ul className="text-slate-300">
                      {selectedDefect.repair.map(r => <li key={r}>• {r}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-purple-400 font-bold">Inspection Methods</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedDefect.inspection.map(i => (
                        <span key={i} className="px-3 py-1 bg-slate-700 rounded text-slate-300">{i}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
