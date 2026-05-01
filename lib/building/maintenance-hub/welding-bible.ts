/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WELDING BIBLE - COMPREHENSIVE DATA
 * Repair Manuals, Parts Catalogue, Maintenance Schedules
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// REPAIR MANUALS
// ═══════════════════════════════════════════════════════════════════════════════
export const WELDING_REPAIR_MANUALS = [
  {
    id: 'rm-weld-001',
    title: 'Arc Welder Troubleshooting & Repair',
    category: 'Equipment Repair',
    difficulty: 'Medium',
    timeRequired: '1-4 hours',
    tools: ['Multimeter', 'Screwdrivers', 'Hex keys', 'Wire brush', 'Contact cleaner'],
    safetyWarnings: [
      'Disconnect power before opening welder',
      'Capacitors may hold charge - allow 5 minutes after power off',
      'Never bypass safety interlocks',
      'Use insulated tools',
    ],
    steps: [
      { step: 1, title: 'Safety Isolation', description: 'Disconnect and verify power off', details: 'Unplug welder or turn off breaker. Wait 5 minutes for capacitors to discharge.', caution: 'Verify with multimeter before touching internals' },
      { step: 2, title: 'Visual Inspection', description: 'Inspect all visible components', details: 'Check cables, connections, burn marks, loose wires, damaged components.', caution: 'Note position of all wires before disconnecting' },
      { step: 3, title: 'Test Power Circuit', description: 'Check input power path', details: 'Test switch, fuse/breaker, power cable continuity, input terminals.', caution: 'Replace damaged power cables immediately' },
      { step: 4, title: 'Check Output Circuit', description: 'Test welding output', details: 'Check output terminals, cables, electrode holder, work clamp connections.', caution: 'Output voltage can be lethal' },
      { step: 5, title: 'Inspect Rectifier/Transformer', description: 'Test power components', details: 'Check diodes (if rectifier), transformer windings, cooling fan.', caution: 'Some components not field serviceable' },
      { step: 6, title: 'Clean Internals', description: 'Remove dust and debris', details: 'Use compressed air, brush away dust, clean connections.', caution: 'Metal dust is conductive' },
      { step: 7, title: 'Reassemble and Test', description: 'Put back together and verify', details: 'Reconnect all wires, replace covers, test weld on scrap.', caution: 'Test at low current first' },
    ],
    verification: [
      'No error lights/codes',
      'Stable arc at all settings',
      'No overheating',
      'All safety features working',
      'Proper voltage and current output',
    ],
  },
  {
    id: 'rm-weld-002',
    title: 'MIG Welder Wire Feed System Repair',
    category: 'Equipment Repair',
    difficulty: 'Medium',
    timeRequired: '30 min - 2 hours',
    tools: ['Screwdrivers', 'Wire cutters', 'Pliers', 'Contact cleaner', 'Spare liners and tips'],
    safetyWarnings: [
      'Disconnect power before working on wire feed',
      'Wire can exit gun unexpectedly',
      'Release wire tension before removing',
    ],
    steps: [
      { step: 1, title: 'Check Wire Spool', description: 'Inspect wire condition', details: 'Check for rust, kinks, tangles, proper size.', caution: 'Do not use rusty wire' },
      { step: 2, title: 'Inspect Drive Rolls', description: 'Check feed mechanism', details: 'Check groove type matches wire, check for wear, proper tension.', caution: 'Wrong groove damages wire' },
      { step: 3, title: 'Check Liner', description: 'Inspect and replace liner', details: 'Pull out and inspect liner for kinks, debris, wear.', caution: 'Liner should slide smoothly' },
      { step: 4, title: 'Inspect Contact Tip', description: 'Check tip condition', details: 'Look for wear, spatter buildup, correct size.', caution: 'Worn tips cause poor arc' },
      { step: 5, title: 'Clean Gas Nozzle', description: 'Remove spatter from nozzle', details: 'Use anti-spatter spray, clean with brush or pliers.', caution: 'Blocked nozzle affects gas coverage' },
      { step: 6, title: 'Check Gas Flow', description: 'Verify shielding gas', details: 'Check regulator, flow rate, hose connections.', caution: 'Insufficient gas causes porosity' },
      { step: 7, title: 'Test Feed', description: 'Run wire through system', details: 'Feed wire with gun pulled, check smooth feeding.', caution: 'Adjust tension as needed' },
    ],
    verification: [
      'Smooth wire feeding',
      'No bird nesting',
      'Good arc stability',
      'Proper gas coverage',
      'No spatter buildup',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PARTS CATALOGUE WITH KENYA SUPPLIERS
// ═══════════════════════════════════════════════════════════════════════════════
export const WELDING_PARTS_CATALOGUE = {
  electrodes: [
    { partNumber: 'E6013-2.5', description: 'Mild Steel Electrode 6013 2.5mm', brand: 'Bohler', priceKES: 2500, application: 'General purpose', suppliers: ['EmersonEIMS'] },
    { partNumber: 'E6013-3.2', description: 'Mild Steel Electrode 6013 3.2mm', brand: 'Bohler', priceKES: 2800, application: 'General purpose', suppliers: ['EmersonEIMS'] },
    { partNumber: 'E7018-3.2', description: 'Low Hydrogen Electrode 7018 3.2mm', brand: 'Bohler', priceKES: 4500, application: 'Structural', suppliers: ['EmersonEIMS'] },
    { partNumber: 'E308L-2.5', description: 'Stainless Steel Electrode 308L 2.5mm', brand: 'Bohler', priceKES: 8500, application: 'Stainless', suppliers: ['EmersonEIMS'] },
    { partNumber: 'E312-3.2', description: 'Dissimilar Metals Electrode 312 3.2mm', brand: 'Bohler', priceKES: 9500, application: 'Dissimilar metals', suppliers: ['EmersonEIMS'] },
  ],
  migWire: [
    { partNumber: 'MIG-ER70S-0.8', description: 'MIG Wire ER70S-6 0.8mm 15kg', brand: 'ESAB', priceKES: 6500, application: 'Mild steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'MIG-ER70S-1.0', description: 'MIG Wire ER70S-6 1.0mm 15kg', brand: 'ESAB', priceKES: 6500, application: 'Mild steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'MIG-ER308L-0.8', description: 'MIG Wire ER308L 0.8mm 5kg', brand: 'ESAB', priceKES: 12000, application: 'Stainless', suppliers: ['EmersonEIMS'] },
    { partNumber: 'MIG-FLUX-1.2', description: 'Flux Cored Wire E71T-1 1.2mm', brand: 'Lincoln', priceKES: 15000, application: 'High deposition', suppliers: ['EmersonEIMS'] },
  ],
  tigFillers: [
    { partNumber: 'TIG-ER70S-1.6', description: 'TIG Filler ER70S-2 1.6mm', brand: 'ESAB', priceKES: 3500, application: 'Mild steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'TIG-ER308L-1.6', description: 'TIG Filler ER308L 1.6mm', brand: 'ESAB', priceKES: 8500, application: 'Stainless', suppliers: ['EmersonEIMS'] },
    { partNumber: 'TIG-ER4043-2.4', description: 'TIG Filler ER4043 2.4mm', brand: 'ESAB', priceKES: 5500, application: 'Aluminum', suppliers: ['EmersonEIMS'] },
    { partNumber: 'TIG-ERCU-2.4', description: 'TIG Filler Silicon Bronze 2.4mm', brand: 'ESAB', priceKES: 6500, application: 'Bronze/Copper', suppliers: ['EmersonEIMS'] },
  ],
  consumables: [
    { partNumber: 'TIP-M6-0.8', description: 'Contact Tip M6 0.8mm (10pc)', brand: 'Various', priceKES: 500, application: 'MIG torch', suppliers: ['EmersonEIMS'] },
    { partNumber: 'TIP-M6-1.0', description: 'Contact Tip M6 1.0mm (10pc)', brand: 'Various', priceKES: 500, application: 'MIG torch', suppliers: ['EmersonEIMS'] },
    { partNumber: 'NOZZLE-MIG-16', description: 'Gas Nozzle 16mm', brand: 'Various', priceKES: 350, application: 'MIG torch', suppliers: ['EmersonEIMS'] },
    { partNumber: 'LINER-STEEL-4M', description: 'Steel Liner 0.8-1.0mm 4m', brand: 'Various', priceKES: 800, application: 'MIG torch', suppliers: ['EmersonEIMS'] },
    { partNumber: 'TUNGSTEN-2.4', description: 'Tungsten Electrode 2% Thoriated 2.4mm', brand: 'Various', priceKES: 450, application: 'TIG welding', suppliers: ['EmersonEIMS'] },
    { partNumber: 'CUP-CERAMIC-8', description: 'Ceramic Cup #8', brand: 'Various', priceKES: 150, application: 'TIG torch', suppliers: ['EmersonEIMS'] },
  ],
  gases: [
    { partNumber: 'CO2-CYLINDER', description: 'CO2 Cylinder 50kg (refill)', brand: 'BOC', priceKES: 3500, application: 'MIG welding', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ARGON-CYLINDER', description: 'Argon Cylinder (refill)', brand: 'BOC', priceKES: 4500, application: 'TIG/MIG welding', suppliers: ['EmersonEIMS'] },
    { partNumber: 'MIXGAS-C25', description: 'Argon/CO2 Mix 75/25 (refill)', brand: 'BOC', priceKES: 5500, application: 'MIG spray', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-CYLINDER', description: 'Oxygen Cylinder (refill)', brand: 'BOC', priceKES: 2500, application: 'Oxy-Acetylene', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ACET-CYLINDER', description: 'Acetylene Cylinder (refill)', brand: 'BOC', priceKES: 3500, application: 'Oxy-Acetylene', suppliers: ['EmersonEIMS'] },
  ],
  ppe: [
    { partNumber: 'HELMET-AUTO', description: 'Auto-darkening Welding Helmet', brand: '3M', priceKES: 8500, application: 'Eye protection', suppliers: ['EmersonEIMS'] },
    { partNumber: 'GLOVES-MIG', description: 'MIG Welding Gloves', brand: 'Various', priceKES: 1200, application: 'Hand protection', suppliers: ['EmersonEIMS'] },
    { partNumber: 'APRON-LEATHER', description: 'Leather Welding Apron', brand: 'Various', priceKES: 2500, application: 'Body protection', suppliers: ['EmersonEIMS'] },
    { partNumber: 'JACKET-WELDING', description: 'Flame Resistant Jacket', brand: 'Various', priceKES: 3500, application: 'Body protection', suppliers: ['EmersonEIMS'] },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAINTENANCE SCHEDULES
// ═══════════════════════════════════════════════════════════════════════════════
export const WELDING_MAINTENANCE_SCHEDULES = {
  arcWelder: {
    daily: [
      { task: 'Clean work area', procedure: 'Remove spatter, slag, debris from welding area', tools: ['Brush', 'Chisel'] },
      { task: 'Inspect cables', procedure: 'Check for damage, loose connections', tools: ['Visual'] },
      { task: 'Check electrode holder', procedure: 'Verify secure grip, no damage', tools: ['Visual'] },
    ],
    weekly: [
      { task: 'Clean air vents', procedure: 'Remove dust from cooling vents', tools: ['Brush', 'Compressed air'] },
      { task: 'Check ground clamp', procedure: 'Clean contact surface, check cable', tools: ['Wire brush'] },
    ],
    monthly: [
      { task: 'Internal inspection', procedure: 'Open and clean interior (if accessible)', tools: ['Screwdriver', 'Compressed air'] },
      { task: 'Check connections', procedure: 'Tighten all electrical connections', tools: ['Wrench', 'Screwdriver'] },
    ],
    annually: [
      { task: 'Full service', procedure: 'Complete cleaning, check all components', tools: ['Full toolkit'] },
      { task: 'Cable replacement', procedure: 'Replace worn cables', tools: ['Cable kit'] },
      { task: 'Electrical test', procedure: 'Test output voltage and current', tools: ['Multimeter'] },
    ],
  },
  migWelder: {
    daily: [
      { task: 'Clean gun nozzle', procedure: 'Remove spatter from nozzle', tools: ['Anti-spatter', 'Pliers'] },
      { task: 'Check wire feed', procedure: 'Verify smooth feeding', tools: ['None'] },
      { task: 'Check gas flow', procedure: 'Verify adequate flow rate', tools: ['Flow meter'] },
    ],
    weekly: [
      { task: 'Replace contact tip', procedure: 'Install new tip when worn', tools: ['Pliers'] },
      { task: 'Check drive rolls', procedure: 'Inspect for wear, clean', tools: ['Brush'] },
      { task: 'Inspect liner', procedure: 'Check for debris, kinks', tools: ['Visual'] },
    ],
    monthly: [
      { task: 'Replace liner', procedure: 'Install new liner', tools: ['Liner kit'] },
      { task: 'Clean wire feeder', procedure: 'Remove all dust and debris', tools: ['Compressed air'] },
      { task: 'Check gas connections', procedure: 'Test for leaks', tools: ['Soapy water'] },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMERSONEIMS PARTS & SERVICES - YOUR TRUSTED PARTNER
// ═══════════════════════════════════════════════════════════════════════════════
export const WELDING_KENYA_SUPPLIERS = [
  { name: 'EmersonEIMS', location: 'Nairobi, Kenya (Serving All Counties)', specialization: 'Complete Welding Solutions - Equipment, Consumables, Maintenance & Repairs', phone: '+254 768 860 665', email: 'info@emersoneims.com' },
];

// Export all
export const WELDING_BIBLE_DATA = {
  repairManuals: WELDING_REPAIR_MANUALS,
  partsCatalogue: WELDING_PARTS_CATALOGUE,
  maintenanceSchedules: WELDING_MAINTENANCE_SCHEDULES,
  suppliers: WELDING_KENYA_SUPPLIERS,
};
