/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INCINERATORS BIBLE - COMPREHENSIVE DATA
 * Repair Manuals, Parts Catalogue, Maintenance Schedules
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// REPAIR MANUALS
// ═══════════════════════════════════════════════════════════════════════════════
export const INCINERATOR_REPAIR_MANUALS = [
  {
    id: 'rm-inc-001',
    title: 'Burner System Troubleshooting',
    category: 'Combustion System',
    difficulty: 'Advanced',
    timeRequired: '2-6 hours',
    tools: ['Multimeter', 'Combustion analyzer', 'Pressure gauge', 'Screwdrivers', 'Wrenches'],
    safetyWarnings: [
      'Allow complete cool-down before service (minimum 4 hours)',
      'Purge chamber before working on burner',
      'Isolate fuel supply at source',
      'Use appropriate PPE - high temperature hazard',
      'Never bypass safety interlocks',
    ],
    steps: [
      { step: 1, title: 'Cool Down', description: 'Allow incinerator to cool completely', details: 'Wait minimum 4 hours after last burn. Verify chamber temperature is safe.', caution: 'Surface temperatures can cause severe burns' },
      { step: 2, title: 'Isolate Systems', description: 'Shut off fuel and electrical', details: 'Close fuel valves, lock out electrical panel, verify isolation.', caution: 'Follow lock-out/tag-out procedure' },
      { step: 3, title: 'Inspect Ignition', description: 'Check ignition system', details: 'Check spark electrode, transformer, flame sensor, wiring.', caution: 'High voltage at ignition transformer' },
      { step: 4, title: 'Check Fuel System', description: 'Inspect fuel delivery', details: 'Check pump, nozzle, filter, solenoid valves, pressure.', caution: 'Fuel is flammable' },
      { step: 5, title: 'Inspect Burner', description: 'Check burner components', details: 'Check nozzle pattern, air damper, combustion chamber condition.', caution: 'Do not disturb refractory' },
      { step: 6, title: 'Test Controls', description: 'Verify control system', details: 'Check temperature controller, flame relay, safety interlocks.', caution: 'Test all safety features' },
      { step: 7, title: 'Commission', description: 'Start up and tune', details: 'Light burner, check flame, tune air/fuel ratio, verify temperatures.', caution: 'Monitor closely during startup' },
    ],
    verification: [
      'Clean ignition and stable flame',
      'Correct fuel pressure',
      'Proper air/fuel ratio',
      'Temperature reaching setpoint',
      'All safety interlocks working',
      'Emissions within limits',
    ],
  },
  {
    id: 'rm-inc-002',
    title: 'Refractory Lining Repair',
    category: 'Structure',
    difficulty: 'Advanced',
    timeRequired: '1-3 days',
    tools: ['Chisel', 'Hammer', 'Trowel', 'Mixing equipment', 'Forms', 'Safety equipment'],
    safetyWarnings: [
      'Complete cool-down essential (24+ hours)',
      'Wear respirator - refractory dust hazard',
      'Structural integrity must be maintained',
      'Allow proper curing time before firing',
    ],
    steps: [
      { step: 1, title: 'Assessment', description: 'Inspect damage extent', details: 'Map all cracks, spalling, erosion. Determine repair vs replacement.', caution: 'Document thoroughly before repair' },
      { step: 2, title: 'Remove Damaged Material', description: 'Chip out deteriorated refractory', details: 'Remove loose material, cut back to sound material.', caution: 'Wear respirator and eye protection' },
      { step: 3, title: 'Clean Surface', description: 'Prepare bonding surface', details: 'Remove dust, dampen surface but not soaking wet.', caution: 'Good bond requires clean surface' },
      { step: 4, title: 'Install Anchors', description: 'Add metal anchors if needed', details: 'Weld anchors to shell for large repairs.', caution: 'Anchors must be correct material' },
      { step: 5, title: 'Apply Refractory', description: 'Place repair material', details: 'Mix castable per instructions, apply in layers, vibrate to remove air.', caution: 'Correct water ratio critical' },
      { step: 6, title: 'Cure', description: 'Allow proper curing', details: 'Cover with plastic, mist regularly, allow 24-48 hours.', caution: 'Temperature must stay above 10°C' },
      { step: 7, title: 'Dry Out', description: 'Controlled heat-up', details: 'Gradual temperature increase over 24 hours to drive out moisture.', caution: 'Rapid heating causes spalling' },
    ],
    verification: [
      'No visible cracks after curing',
      'Good bond to existing material',
      'Proper thickness achieved',
      'Surface finish acceptable',
      'Survives initial heat-up',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PARTS CATALOGUE WITH KENYA SUPPLIERS
// ═══════════════════════════════════════════════════════════════════════════════
export const INCINERATOR_PARTS_CATALOGUE = {
  burners: [
    { partNumber: 'BURNER-DIESEL-50', description: 'Diesel Burner 50kW', brand: 'Riello', priceKES: 85000, application: 'Small incinerator', suppliers: ['EmersonEIMS'] },
    { partNumber: 'BURNER-DIESEL-150', description: 'Diesel Burner 150kW', brand: 'Riello', priceKES: 165000, application: 'Medium incinerator', suppliers: ['EmersonEIMS'] },
    { partNumber: 'BURNER-DIESEL-300', description: 'Diesel Burner 300kW', brand: 'Baltur', priceKES: 285000, application: 'Large incinerator', suppliers: ['EmersonEIMS'] },
    { partNumber: 'BURNER-GAS-100', description: 'Gas Burner 100kW', brand: 'Weishaupt', priceKES: 125000, application: 'Gas-fired units', suppliers: ['EmersonEIMS'] },
  ],
  ignition: [
    { partNumber: 'IGNITION-TRANS', description: 'Ignition Transformer 2x5kV', brand: 'Danfoss', priceKES: 12000, application: 'Spark ignition', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ELECTRODE-IGN', description: 'Ignition Electrode', brand: 'Various', priceKES: 2500, application: 'Spark generation', suppliers: ['EmersonEIMS'] },
    { partNumber: 'FLAME-SENSOR', description: 'Flame Sensor/Photocell', brand: 'Honeywell', priceKES: 8500, application: 'Flame detection', suppliers: ['EmersonEIMS'] },
    { partNumber: 'FLAME-RELAY', description: 'Flame Safety Relay', brand: 'Honeywell', priceKES: 15000, application: 'Burner control', suppliers: ['EmersonEIMS'] },
  ],
  fuel: [
    { partNumber: 'NOZZLE-0.6', description: 'Burner Nozzle 0.6 GPH', brand: 'Danfoss', priceKES: 1500, application: 'Small burners', suppliers: ['EmersonEIMS'] },
    { partNumber: 'NOZZLE-1.0', description: 'Burner Nozzle 1.0 GPH', brand: 'Danfoss', priceKES: 1500, application: 'Medium burners', suppliers: ['EmersonEIMS'] },
    { partNumber: 'FUEL-PUMP', description: 'Fuel Pump', brand: 'Danfoss', priceKES: 18000, application: 'Fuel delivery', suppliers: ['EmersonEIMS'] },
    { partNumber: 'SOLENOID-FUEL', description: 'Fuel Solenoid Valve', brand: 'Various', priceKES: 8500, application: 'Fuel control', suppliers: ['EmersonEIMS'] },
    { partNumber: 'FILTER-FUEL', description: 'Fuel Filter Element', brand: 'Various', priceKES: 1200, application: 'Fuel filtration', suppliers: ['EmersonEIMS'] },
  ],
  refractory: [
    { partNumber: 'CASTABLE-1500', description: 'Castable Refractory 1500°C 25kg', brand: 'Morgan', priceKES: 8500, application: 'Chamber lining', suppliers: ['EmersonEIMS'] },
    { partNumber: 'CASTABLE-1800', description: 'Castable Refractory 1800°C 25kg', brand: 'Morgan', priceKES: 12500, application: 'High-temp zones', suppliers: ['EmersonEIMS'] },
    { partNumber: 'FIBER-BLANKET', description: 'Ceramic Fiber Blanket 25mm', brand: 'Morgan', priceKES: 5500, application: 'Per sqm', suppliers: ['EmersonEIMS'] },
    { partNumber: 'MORTAR-REF', description: 'Refractory Mortar 25kg', brand: 'Morgan', priceKES: 4500, application: 'Brick laying', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ANCHOR-SS', description: 'SS Refractory Anchor', brand: 'Various', priceKES: 150, application: 'Each', suppliers: ['EmersonEIMS'] },
  ],
  controls: [
    { partNumber: 'TEMP-CONTROLLER', description: 'Temperature Controller PID', brand: 'Honeywell', priceKES: 25000, application: 'Chamber control', suppliers: ['EmersonEIMS'] },
    { partNumber: 'THERMOCOUPLE-K', description: 'Thermocouple Type K 1200°C', brand: 'Various', priceKES: 8500, application: 'Temperature sensing', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PRESSURE-SW', description: 'Air Pressure Switch', brand: 'Honeywell', priceKES: 5500, application: 'Air proving', suppliers: ['EmersonEIMS'] },
    { partNumber: 'TIMER-PROG', description: 'Programmable Timer', brand: 'Various', priceKES: 12000, application: 'Cycle control', suppliers: ['EmersonEIMS'] },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAINTENANCE SCHEDULES
// ═══════════════════════════════════════════════════════════════════════════════
export const INCINERATOR_MAINTENANCE_SCHEDULES = {
  medical: {
    daily: [
      { task: 'Visual inspection', procedure: 'Check for smoke, leaks, unusual operation', tools: ['Visual'] },
      { task: 'Ash removal', procedure: 'Remove ash when chamber is cool', tools: ['Shovel', 'Containers'] },
      { task: 'Check temperature log', procedure: 'Verify temperatures reached minimum', tools: ['Log book'] },
    ],
    weekly: [
      { task: 'Clean ignition system', procedure: 'Clean electrodes and flame sensor', tools: ['Brush', 'Cloth'] },
      { task: 'Check door seals', procedure: 'Inspect gaskets for damage', tools: ['Visual'] },
      { task: 'Test safety interlocks', procedure: 'Verify door switch, overtemp cutout work', tools: ['None'] },
    ],
    monthly: [
      { task: 'Burner service', procedure: 'Clean nozzle, check pump, filter', tools: ['Service kit'] },
      { task: 'Refractory inspection', procedure: 'Look for cracks, erosion, hot spots', tools: ['Torch'] },
      { task: 'Stack inspection', procedure: 'Check for buildup, corrosion', tools: ['Visual'] },
      { task: 'Control calibration', procedure: 'Verify temperature controller accuracy', tools: ['Calibrator'] },
    ],
    annually: [
      { task: 'Full inspection', procedure: 'Complete system inspection', tools: ['Full toolkit'] },
      { task: 'Emissions test', procedure: 'Stack emissions analysis', tools: ['Analyzer'] },
      { task: 'Refractory repair', procedure: 'Repair any damaged areas', tools: ['Refractory materials'] },
      { task: 'Electrical check', procedure: 'Megger test motors, check connections', tools: ['Megger'] },
    ],
  },
  industrial: {
    daily: [
      { task: 'Pre-start checks', procedure: 'Check fuel, air, controls before start', tools: ['Checklist'] },
      { task: 'Monitor operation', procedure: 'Log temperatures, pressures, fuel use', tools: ['Log book'] },
      { task: 'Ash management', procedure: 'Remove ash as required', tools: ['Equipment'] },
    ],
    weekly: [
      { task: 'Burner maintenance', procedure: 'Clean nozzle, check ignition', tools: ['Service kit'] },
      { task: 'Safety system test', procedure: 'Test all safety interlocks', tools: ['None'] },
      { task: 'Inspect seals', procedure: 'Check all door and access seals', tools: ['Visual'] },
    ],
    monthly: [
      { task: 'Combustion analysis', procedure: 'Measure O2, CO, efficiency', tools: ['Combustion analyzer'] },
      { task: 'Refractory inspection', procedure: 'Detailed chamber inspection', tools: ['Torch', 'Probe'] },
      { task: 'Control check', procedure: 'Verify all sensors and controllers', tools: ['Calibration equipment'] },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMERSONEIMS PARTS & SERVICES - YOUR TRUSTED PARTNER
// ═══════════════════════════════════════════════════════════════════════════════
export const INCINERATOR_KENYA_SUPPLIERS = [
  { name: 'EmersonEIMS', location: 'Nairobi, Kenya (Serving All Counties)', specialization: 'Complete Incinerator Solutions - Installation, Parts, Maintenance & Repairs', phone: '+254 768 860 665', email: 'info@emersoneims.com' },
];

// Export all
export const INCINERATOR_BIBLE_DATA = {
  repairManuals: INCINERATOR_REPAIR_MANUALS,
  partsCatalogue: INCINERATOR_PARTS_CATALOGUE,
  maintenanceSchedules: INCINERATOR_MAINTENANCE_SCHEDULES,
  suppliers: INCINERATOR_KENYA_SUPPLIERS,
};
