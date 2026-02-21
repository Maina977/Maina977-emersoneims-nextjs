/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BOREHOLE & PUMP BIBLE - COMPREHENSIVE DATA
 * Repair Manuals, Parts Catalogue, Maintenance Schedules
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// REPAIR MANUALS
// ═══════════════════════════════════════════════════════════════════════════════
export const BOREHOLE_REPAIR_MANUALS = [
  {
    id: 'rm-bh-001',
    title: 'Submersible Pump Installation Procedure',
    category: 'Installation',
    difficulty: 'Advanced',
    timeRequired: '4-8 hours',
    tools: ['Crane/tripod', 'Pipe wrenches', 'Torque wrench', 'Megger', 'Clamp meter', 'Drop pipe clamps', 'Safety harness'],
    safetyWarnings: [
      'Never work alone on borehole installations',
      'Always use safety harness near open borehole',
      'Lock out power before any electrical work',
      'Verify pump and motor compatibility',
      'Check borehole depth and water level before selection',
    ],
    steps: [
      { step: 1, title: 'Pre-Installation Tests', description: 'Test pump and motor before installation', details: 'Megger test motor windings (>20MΩ), check pump rotation, verify cable integrity.', caution: 'Never install pump without testing first' },
      { step: 2, title: 'Prepare Borehole', description: 'Clean and verify borehole condition', details: 'Check depth, measure water level, verify casing condition, check for obstructions.', caution: 'Note any damage to casing' },
      { step: 3, title: 'Assemble Pump String', description: 'Connect pump, motor, and first pipe', details: 'Use Teflon tape on threads, torque to specification, attach cable with proper clips.', caution: 'Never overtighten pipe connections' },
      { step: 4, title: 'Lower Pump Assembly', description: 'Carefully lower pump into borehole', details: 'Use crane or tripod, add pipe sections, secure cable at regular intervals.', caution: 'Control descent speed - never drop pump' },
      { step: 5, title: 'Set Pump Depth', description: 'Position pump at correct depth', details: 'Minimum 10m below dynamic water level, at least 3m above pump intake.', caution: 'Too shallow causes air ingestion' },
      { step: 6, title: 'Install Wellhead', description: 'Complete surface installation', details: 'Install wellhead cap, pressure tank, check valve, pressure gauge.', caution: 'Ensure sanitary seal' },
      { step: 7, title: 'Electrical Connections', description: 'Connect pump to control panel', details: 'Connect to starter, verify phase sequence, check voltage.', caution: 'Wrong phase rotation damages pump' },
      { step: 8, title: 'Commission and Test', description: 'Start pump and verify operation', details: 'Monitor current, pressure, flow rate. Run for minimum 1 hour.', caution: 'Observe for any anomalies' },
    ],
    verification: [
      'Motor insulation >20MΩ',
      'Current balanced all phases',
      'Flow rate meets specification',
      'Pressure stable',
      'No water hammer',
      'No abnormal noise or vibration',
    ],
  },
  {
    id: 'rm-bh-002',
    title: 'Pump Retrieval and Replacement',
    category: 'Maintenance',
    difficulty: 'Advanced',
    timeRequired: '6-12 hours',
    tools: ['Crane/tripod', 'Pipe wrenches', 'Chain tongs', 'Pipe rack', 'Lifting clamps', 'Safety equipment'],
    safetyWarnings: [
      'Pump and pipe assembly is extremely heavy',
      'Use certified lifting equipment',
      'Secure each pipe section immediately',
      'Never stand under suspended load',
      'Check all rigging before lifting',
    ],
    steps: [
      { step: 1, title: 'Isolate Power', description: 'Disconnect and lock out electrical supply', details: 'Turn off breaker, lock out, verify power off at motor terminals.', caution: 'Never work with power connected' },
      { step: 2, title: 'Disconnect Surface', description: 'Remove wellhead and surface piping', details: 'Disconnect pressure tank, check valve, surface pipe.', caution: 'Relieve any pressure first' },
      { step: 3, title: 'Prepare Lifting', description: 'Set up crane or tripod over borehole', details: 'Position lifting equipment, attach safety cables.', caution: 'Verify lifting capacity exceeds total weight' },
      { step: 4, title: 'Begin Retrieval', description: 'Lift pump assembly from borehole', details: 'Lift slowly, use pipe clamps, remove pipe sections one by one.', caution: 'Secure each pipe on rack immediately' },
      { step: 5, title: 'Extract Pump', description: 'Remove pump and motor from borehole', details: 'Final lift brings pump to surface, disconnect cable.', caution: 'Inspect pump for damage' },
      { step: 6, title: 'Inspect Components', description: 'Examine all retrieved components', details: 'Check pump, motor, cable, all pipe sections for wear or damage.', caution: 'Document condition for future reference' },
      { step: 7, title: 'Prepare New Pump', description: 'Test and prepare replacement pump', details: 'Megger test, check rotation, verify specifications match.', caution: 'Never reuse damaged components' },
      { step: 8, title: 'Reinstall', description: 'Install new pump following installation procedure', details: 'Follow pump installation manual procedure.', caution: 'Take time - rushing causes problems' },
    ],
    verification: [
      'All components accounted for',
      'No damage to borehole casing',
      'New pump tested before installation',
      'System commissioned successfully',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PARTS CATALOGUE WITH KENYA SUPPLIERS
// ═══════════════════════════════════════════════════════════════════════════════
export const BOREHOLE_PARTS_CATALOGUE = {
  submersiblePumps: [
    { partNumber: 'DAYLIFF-D3-4-8', description: 'Submersible Pump 3" 4-Stage 0.75HP', brand: 'Davis & Shirtliff', priceKES: 45000, application: '50m depth, 2m³/hr', suppliers: ['Davis & Shirtliff'] },
    { partNumber: 'DAYLIFF-D4-6-11', description: 'Submersible Pump 4" 6-Stage 1.5HP', brand: 'Davis & Shirtliff', priceKES: 65000, application: '80m depth, 4m³/hr', suppliers: ['Davis & Shirtliff'] },
    { partNumber: 'GRUNDFOS-SP5A-8', description: 'Submersible Pump SP5A-8', brand: 'Grundfos', priceKES: 95000, application: '100m depth, 5m³/hr', suppliers: ['Grundfos Kenya'] },
    { partNumber: 'GRUNDFOS-SP8A-12', description: 'Submersible Pump SP8A-12', brand: 'Grundfos', priceKES: 145000, application: '120m depth, 8m³/hr', suppliers: ['Grundfos Kenya'] },
    { partNumber: 'PEDROLLO-4SR4-12', description: 'Submersible Pump 4" 12-Stage 1.5HP', brand: 'Pedrollo', priceKES: 55000, application: '100m depth, 4m³/hr', suppliers: ['Water Equipment Ltd'] },
  ],
  submersibleMotors: [
    { partNumber: 'MOTOR-4-0.75KW', description: 'Submersible Motor 4" 0.75kW', brand: 'Franklin', priceKES: 28000, application: '0.75HP pumps', suppliers: ['Davis & Shirtliff'] },
    { partNumber: 'MOTOR-4-1.5KW', description: 'Submersible Motor 4" 1.5kW', brand: 'Franklin', priceKES: 38000, application: '2HP pumps', suppliers: ['Davis & Shirtliff'] },
    { partNumber: 'MOTOR-4-2.2KW', description: 'Submersible Motor 4" 2.2kW', brand: 'Franklin', priceKES: 52000, application: '3HP pumps', suppliers: ['Davis & Shirtliff'] },
    { partNumber: 'MOTOR-4-3.0KW', description: 'Submersible Motor 4" 3.0kW', brand: 'Grundfos', priceKES: 68000, application: '4HP pumps', suppliers: ['Grundfos Kenya'] },
  ],
  cables: [
    { partNumber: 'CABLE-SUB-3X2.5', description: 'Submersible Cable 3x2.5mm²', brand: 'Various', priceKES: 350, application: 'Per meter, up to 1.5HP', suppliers: ['Electrical wholesalers'] },
    { partNumber: 'CABLE-SUB-3X4', description: 'Submersible Cable 3x4mm²', brand: 'Various', priceKES: 550, application: 'Per meter, up to 3HP', suppliers: ['Electrical wholesalers'] },
    { partNumber: 'CABLE-SUB-3X6', description: 'Submersible Cable 3x6mm²', brand: 'Various', priceKES: 850, application: 'Per meter, up to 5HP', suppliers: ['Electrical wholesalers'] },
    { partNumber: 'CABLE-SUB-3X10', description: 'Submersible Cable 3x10mm²', brand: 'Various', priceKES: 1400, application: 'Per meter, up to 10HP', suppliers: ['Electrical wholesalers'] },
  ],
  risePipes: [
    { partNumber: 'PIPE-HDPE-50', description: 'HDPE Pipe 50mm PN10', brand: 'Local', priceKES: 180, application: 'Per meter', suppliers: ['Pipe suppliers'] },
    { partNumber: 'PIPE-HDPE-63', description: 'HDPE Pipe 63mm PN10', brand: 'Local', priceKES: 280, application: 'Per meter', suppliers: ['Pipe suppliers'] },
    { partNumber: 'PIPE-GI-2', description: 'Galvanized Pipe 2" Class B', brand: 'Local', priceKES: 650, application: 'Per meter', suppliers: ['Hardware suppliers'] },
    { partNumber: 'PIPE-GI-3', description: 'Galvanized Pipe 3" Class B', brand: 'Local', priceKES: 1200, application: 'Per meter', suppliers: ['Hardware suppliers'] },
  ],
  controls: [
    { partNumber: 'PANEL-DOL-1.5', description: 'DOL Starter Panel 1.5HP', brand: 'Local', priceKES: 18000, application: 'Small pumps', suppliers: ['Electrical suppliers'] },
    { partNumber: 'PANEL-DOL-3', description: 'DOL Starter Panel 3HP', brand: 'Local', priceKES: 25000, application: 'Medium pumps', suppliers: ['Electrical suppliers'] },
    { partNumber: 'PANEL-SD-7.5', description: 'Star-Delta Panel 7.5HP', brand: 'Local', priceKES: 45000, application: 'Large pumps', suppliers: ['Electrical suppliers'] },
    { partNumber: 'VFD-1.5KW', description: 'VFD Drive 1.5kW', brand: 'ABB/Schneider', priceKES: 35000, application: 'Variable speed', suppliers: ['Electrical suppliers'] },
    { partNumber: 'LEVEL-SWITCH', description: 'Float Level Switch', brand: 'Various', priceKES: 2500, application: 'Tank level', suppliers: ['Electrical suppliers'] },
  ],
  accessories: [
    { partNumber: 'TANK-PRESSURE-100', description: 'Pressure Tank 100L', brand: 'Zilmet', priceKES: 28000, application: 'Pressure boosting', suppliers: ['Davis & Shirtliff'] },
    { partNumber: 'TANK-PRESSURE-200', description: 'Pressure Tank 200L', brand: 'Zilmet', priceKES: 45000, application: 'Large systems', suppliers: ['Davis & Shirtliff'] },
    { partNumber: 'GAUGE-PRESSURE', description: 'Pressure Gauge 0-10 bar', brand: 'Various', priceKES: 1500, application: 'Monitoring', suppliers: ['Instrumentation suppliers'] },
    { partNumber: 'CHECK-VALVE-2', description: 'Check Valve 2" Brass', brand: 'Various', priceKES: 3500, application: 'Backflow prevention', suppliers: ['Plumbing suppliers'] },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAINTENANCE SCHEDULES
// ═══════════════════════════════════════════════════════════════════════════════
export const BOREHOLE_MAINTENANCE_SCHEDULES = {
  submersiblePump: {
    weekly: [
      { task: 'Check pump operation', procedure: 'Verify pump starts and runs normally', tools: ['None'] },
      { task: 'Record pressure and flow', procedure: 'Log pressure gauge and flow meter readings', tools: ['Log book'] },
    ],
    monthly: [
      { task: 'Check electrical current', procedure: 'Measure and record current on all phases', tools: ['Clamp meter'] },
      { task: 'Inspect control panel', procedure: 'Check for loose connections, burnt contacts', tools: ['Screwdriver'] },
      { task: 'Test safety devices', procedure: 'Test overload, dry run protection', tools: ['None'] },
    ],
    quarterly: [
      { task: 'Water quality test', procedure: 'Test for pH, TDS, bacteria', tools: ['Test kit'] },
      { task: 'Insulation test', procedure: 'Megger test motor windings', tools: ['Megger'] },
      { task: 'Check wellhead seal', procedure: 'Verify sanitary seal intact', tools: ['Visual'] },
    ],
    annually: [
      { task: 'Full system inspection', procedure: 'Complete inspection of all components', tools: ['Full toolkit'] },
      { task: 'Pump performance test', procedure: 'Measure actual vs design flow', tools: ['Flow meter'] },
      { task: 'Professional water test', procedure: 'Full laboratory water analysis', tools: ['Sample bottles'] },
    ],
  },
  boreholeSystem: {
    monthly: [
      { task: 'Clean filters', procedure: 'Clean or replace pressure side filters', tools: ['Filter wrench'] },
      { task: 'Check pressure tank', procedure: 'Verify pre-charge pressure', tools: ['Tire gauge'] },
      { task: 'Inspect piping', procedure: 'Check for leaks, corrosion', tools: ['Visual'] },
    ],
    annually: [
      { task: 'Water level measurement', procedure: 'Measure static and dynamic water levels', tools: ['Depth meter'] },
      { task: 'Yield test', procedure: 'Pumping test to verify yield', tools: ['Flow meter'] },
      { task: 'CCTV inspection', procedure: 'Camera inspection of casing (every 5 years)', tools: ['CCTV camera'] },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// KENYA SUPPLIERS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
export const BOREHOLE_KENYA_SUPPLIERS = [
  { name: 'Davis & Shirtliff', location: 'Nationwide (30+ branches)', specialization: 'Pumps, motors, tanks, water treatment', phone: '+254 20 696 8000', email: 'sales@dayliff.com' },
  { name: 'Grundfos Kenya', location: 'Nairobi', specialization: 'Premium submersible pumps', phone: '+254 20 xxx xxxx', email: 'kenya@grundfos.com' },
  { name: 'Water Equipment Ltd', location: 'Nairobi', specialization: 'Pumps, drilling equipment', phone: '+254 20 xxx xxxx', email: 'info@waterequip.co.ke' },
  { name: 'Aqua Well Drillers', location: 'Nairobi', specialization: 'Borehole drilling, rehabilitation', phone: '+254 722 xxx xxx', email: 'info@aquawell.co.ke' },
  { name: 'Kenya Drilling Co.', location: 'Multiple locations', specialization: 'Drilling, pump installation', phone: '+254 20 xxx xxxx', email: 'info@kenydrilling.co.ke' },
];

// Export all
export const BOREHOLE_BIBLE_DATA = {
  repairManuals: BOREHOLE_REPAIR_MANUALS,
  partsCatalogue: BOREHOLE_PARTS_CATALOGUE,
  maintenanceSchedules: BOREHOLE_MAINTENANCE_SCHEDULES,
  suppliers: BOREHOLE_KENYA_SUPPLIERS,
};
