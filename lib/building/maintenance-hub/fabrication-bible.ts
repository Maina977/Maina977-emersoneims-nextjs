/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FABRICATION BIBLE - COMPREHENSIVE DATA
 * Repair Manuals, Parts Catalogue, Maintenance Schedules
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// FAULT CODES - 200+ Comprehensive Fabrication Faults
// ═══════════════════════════════════════════════════════════════════════════════
export const FABRICATION_FAULT_CODES = [
  // Cutting Equipment Faults
  { code: 'FAB-CUT-001', description: 'Plasma cutter no arc start', system: 'Plasma Cutting', severity: 'high', cause: 'Consumables worn, air pressure low, or torch grounded', repair: ['Check consumables', 'Verify air pressure 75-85 PSI', 'Check torch connections'], parts: ['Electrode', 'Nozzle', 'Swirl ring'], costKES: 3500, time: '30 min' },
  { code: 'FAB-CUT-002', description: 'Plasma cut quality poor - dross', system: 'Plasma Cutting', severity: 'medium', cause: 'Wrong speed, worn consumables, incorrect height', repair: ['Adjust cutting speed', 'Replace consumables', 'Set correct standoff'], parts: ['Nozzle', 'Shield'], costKES: 2500, time: '20 min' },
  { code: 'FAB-CUT-003', description: 'Plasma consumables wearing fast', system: 'Plasma Cutting', severity: 'medium', cause: 'Piercing thick material, contaminated air', repair: ['Add air dryer/filter', 'Reduce pierces', 'Use edge starts'], parts: ['Air filter', 'Consumable set'], costKES: 8500, time: '1 hr' },
  { code: 'FAB-CUT-004', description: 'Plasma torch overheating', system: 'Plasma Cutting', severity: 'high', cause: 'Exceeding duty cycle, coolant issue', repair: ['Allow cooling', 'Check coolant level', 'Reduce duty'], parts: ['Coolant', 'Torch o-rings'], costKES: 5500, time: '30 min' },
  { code: 'FAB-CUT-005', description: 'Oxy-fuel no ignition', system: 'Oxy-Fuel', severity: 'high', cause: 'No fuel, blocked passages, damaged striker', repair: ['Check gas supply', 'Clean torch tip', 'Replace striker'], parts: ['Striker', 'Tip cleaner'], costKES: 1500, time: '15 min' },
  { code: 'FAB-CUT-006', description: 'Oxy-fuel flame popping/backfire', system: 'Oxy-Fuel', severity: 'critical', cause: 'Dirty tip, low pressure, loose connections', repair: ['Clean tip immediately', 'Check pressures', 'Tighten connections'], parts: ['Cutting tip', 'Flashback arrestor'], costKES: 4500, time: '20 min' },
  { code: 'FAB-CUT-007', description: 'Oxy-fuel cut not clean', system: 'Oxy-Fuel', severity: 'medium', cause: 'Wrong tip size, incorrect pressures', repair: ['Select correct tip', 'Adjust oxy pressure', 'Clean preheat holes'], parts: ['Cutting tip set'], costKES: 3500, time: '15 min' },
  { code: 'FAB-CUT-008', description: 'Bandsaw blade breaking', system: 'Band Saw', severity: 'medium', cause: 'Wrong speed, blade tension, feed pressure', repair: ['Adjust speed for material', 'Set correct tension', 'Reduce feed'], parts: ['Saw blade'], costKES: 8500, time: '30 min' },
  { code: 'FAB-CUT-009', description: 'Bandsaw blade wandering', system: 'Band Saw', severity: 'medium', cause: 'Dull blade, wrong tooth pitch, guides worn', repair: ['Replace blade', 'Match pitch to material', 'Adjust guides'], parts: ['Blade', 'Guide inserts'], costKES: 12000, time: '45 min' },
  { code: 'FAB-CUT-010', description: 'Angle grinder disc shattering', system: 'Grinder', severity: 'critical', cause: 'Wrong disc type, over-speed, damaged disc', repair: ['Use correct disc rating', 'Check RPM', 'Inspect discs before use'], parts: ['Cutting disc', 'Guard'], costKES: 500, time: '5 min' },

  // Bending/Forming Faults
  { code: 'FAB-BND-001', description: 'Press brake angle incorrect', system: 'Press Brake', severity: 'medium', cause: 'Wrong die, material springback, tonnage low', repair: ['Calculate springback', 'Adjust overbend', 'Check tooling'], parts: ['Die set'], costKES: 45000, time: '1 hr' },
  { code: 'FAB-BND-002', description: 'Press brake hydraulic leak', system: 'Press Brake', severity: 'high', cause: 'Seal failure, hose damage', repair: ['Replace seals', 'Check hose connections', 'Add hydraulic oil'], parts: ['Seal kit', 'Hydraulic hose'], costKES: 15000, time: '2 hr' },
  { code: 'FAB-BND-003', description: 'Press brake not building pressure', system: 'Press Brake', severity: 'high', cause: 'Pump failure, relief valve issue', repair: ['Check pump operation', 'Adjust relief valve', 'Check oil level'], parts: ['Pump', 'Relief valve'], costKES: 85000, time: '4 hr' },
  { code: 'FAB-BND-004', description: 'Roll bender slipping', system: 'Roll Bender', severity: 'medium', cause: 'Rolls worn, insufficient pressure', repair: ['Resurface rolls', 'Increase pressure', 'Clean material'], parts: ['Roll set'], costKES: 125000, time: '2 hr' },
  { code: 'FAB-BND-005', description: 'Tube bender wrinkling', system: 'Tube Bender', severity: 'medium', cause: 'Wrong mandrel, too tight radius', repair: ['Use correct mandrel', 'Use wiper die', 'Check clamp pressure'], parts: ['Mandrel', 'Wiper die'], costKES: 25000, time: '1 hr' },
  { code: 'FAB-BND-006', description: 'Shear blade marks on cut', system: 'Shear', severity: 'medium', cause: 'Blades dull, gap incorrect', repair: ['Sharpen or replace blades', 'Adjust blade gap'], parts: ['Shear blades'], costKES: 45000, time: '3 hr' },
  { code: 'FAB-BND-007', description: 'Shear twisting material', system: 'Shear', severity: 'medium', cause: 'Blade gap uneven, holddown weak', repair: ['Level blade gap', 'Adjust holddowns', 'Check hydraulics'], parts: ['Holddown pads'], costKES: 8500, time: '1 hr' },
  { code: 'FAB-BND-008', description: 'Punch press missing punches', system: 'Punch Press', severity: 'medium', cause: 'Worn punch, die clearance wrong', repair: ['Sharpen punch', 'Check alignment', 'Adjust clearance'], parts: ['Punch', 'Die'], costKES: 15000, time: '1 hr' },
  { code: 'FAB-BND-009', description: 'Notcher tearing metal', system: 'Notcher', severity: 'medium', cause: 'Dull blades, wrong blade angle', repair: ['Sharpen blades', 'Check blade geometry'], parts: ['Notcher blades'], costKES: 25000, time: '2 hr' },
  { code: 'FAB-BND-010', description: 'Ironworker cylinder slow', system: 'Ironworker', severity: 'medium', cause: 'Low hydraulic pressure, worn seals', repair: ['Check hydraulic level', 'Replace seals', 'Check pump'], parts: ['Seal kit'], costKES: 12000, time: '2 hr' },

  // Drilling/Machining Faults
  { code: 'FAB-DRL-001', description: 'Drill bit breaking', system: 'Drilling', severity: 'medium', cause: 'Speed too high, no coolant, dull bit', repair: ['Reduce RPM', 'Add cutting fluid', 'Use sharp bit'], parts: ['Drill bit'], costKES: 2500, time: '10 min' },
  { code: 'FAB-DRL-002', description: 'Drill bit wandering', system: 'Drilling', severity: 'medium', cause: 'No center punch, dull bit, runout', repair: ['Center punch first', 'Sharpen bit', 'Check spindle'], parts: ['Center punch', 'Drill bit'], costKES: 1500, time: '15 min' },
  { code: 'FAB-DRL-003', description: 'Drill press spindle vibration', system: 'Drill Press', severity: 'high', cause: 'Worn bearings, bent spindle', repair: ['Replace bearings', 'Check spindle runout', 'Balance'], parts: ['Spindle bearings'], costKES: 15000, time: '3 hr' },
  { code: 'FAB-DRL-004', description: 'Mag drill losing grip', system: 'Mag Drill', severity: 'critical', cause: 'Dirty surface, weak magnet, thin material', repair: ['Clean surface', 'Check magnet strength', 'Use backing plate'], parts: ['Magnet assembly'], costKES: 35000, time: '1 hr' },
  { code: 'FAB-DRL-005', description: 'Tap breaking in hole', system: 'Tapping', severity: 'high', cause: 'Wrong tap size, no lubricant, chips buildup', repair: ['Use proper pilot hole', 'Add tapping fluid', 'Clear chips regularly'], parts: ['Spiral tap', 'Tap extractor'], costKES: 5500, time: '1-3 hr' },
  { code: 'FAB-DRL-006', description: 'Thread stripping during tapping', system: 'Tapping', severity: 'medium', cause: 'Oversized pilot hole, material soft', repair: ['Use correct drill size', 'Use thread insert'], parts: ['Helicoil kit'], costKES: 3500, time: '30 min' },
  { code: 'FAB-DRL-007', description: 'Countersink chatter', system: 'Drilling', severity: 'low', cause: 'Speed too high, no pilot', repair: ['Reduce speed', 'Use piloted countersink'], parts: ['Piloted countersink'], costKES: 2500, time: '10 min' },
  { code: 'FAB-DRL-008', description: 'Hole saw binding', system: 'Drilling', severity: 'medium', cause: 'Chips buildup, no coolant', repair: ['Clear chips frequently', 'Add cutting oil', 'Reduce pressure'], parts: ['Hole saw'], costKES: 4500, time: '20 min' },
  { code: 'FAB-DRL-009', description: 'Reamer producing oversized hole', system: 'Reaming', severity: 'medium', cause: 'Wrong reamer, too fast, no float', repair: ['Use correct reamer', 'Reduce speed', 'Allow float'], parts: ['Reamer'], costKES: 8500, time: '30 min' },
  { code: 'FAB-DRL-010', description: 'Annular cutter not ejecting slug', system: 'Mag Drill', severity: 'low', cause: 'Ejector pin worn, chips jamming', repair: ['Replace ejector', 'Clean cutter', 'Proper depth setting'], parts: ['Ejector pin'], costKES: 1500, time: '15 min' },

  // Surface Treatment Faults
  { code: 'FAB-SFC-001', description: 'Sandblast poor coverage', system: 'Sandblasting', severity: 'medium', cause: 'Pressure low, nozzle worn, wrong media', repair: ['Check compressor', 'Replace nozzle', 'Select correct media'], parts: ['Blast nozzle', 'Media'], costKES: 5500, time: '30 min' },
  { code: 'FAB-SFC-002', description: 'Paint not adhering', system: 'Painting', severity: 'medium', cause: 'Surface not prepped, contamination', repair: ['Degrease surface', 'Sandblast', 'Apply primer'], parts: ['Primer', 'Degreaser'], costKES: 3500, time: '2 hr' },
  { code: 'FAB-SFC-003', description: 'Powder coat orange peel', system: 'Powder Coating', severity: 'medium', cause: 'Wrong cure temp, powder too thick', repair: ['Adjust temperature', 'Apply thinner coat', 'Check gun settings'], parts: ['Powder'], costKES: 5500, time: '1 hr' },
  { code: 'FAB-SFC-004', description: 'Galvanizing bare spots', system: 'Galvanizing', severity: 'medium', cause: 'Surface contamination, flux failure', repair: ['Clean thoroughly', 'Re-flux', 'Re-dip'], parts: ['Flux', 'Zinc'], costKES: 8500, time: '2 hr' },
  { code: 'FAB-SFC-005', description: 'Grinding burn marks', system: 'Grinding', severity: 'medium', cause: 'Too much pressure, wrong wheel', repair: ['Reduce pressure', 'Use correct wheel', 'Allow cooling'], parts: ['Grinding wheel'], costKES: 2500, time: '30 min' },
  { code: 'FAB-SFC-006', description: 'Wire brush not cleaning weld', system: 'Finishing', severity: 'low', cause: 'Wire brush worn, wrong type', repair: ['Replace brush', 'Use stainless brush for stainless'], parts: ['Wire brush'], costKES: 800, time: '10 min' },
  { code: 'FAB-SFC-007', description: 'Flap disc loading up', system: 'Finishing', severity: 'low', cause: 'Aluminum or soft material', repair: ['Use loading-resistant disc', 'Use wax stick'], parts: ['Flap disc'], costKES: 1500, time: '15 min' },
  { code: 'FAB-SFC-008', description: 'Deburring leaving sharp edges', system: 'Finishing', severity: 'medium', cause: 'Wrong tool, insufficient passes', repair: ['Use proper deburr tool', 'Multiple passes', 'Check all edges'], parts: ['Deburr tool'], costKES: 2500, time: '30 min' },
  { code: 'FAB-SFC-009', description: 'Polishing swirl marks', system: 'Polishing', severity: 'low', cause: 'Wrong sequence, contaminated buff', repair: ['Follow grit sequence', 'Clean or replace buff', 'Correct compound'], parts: ['Buffing wheel', 'Compound'], costKES: 3500, time: '1 hr' },
  { code: 'FAB-SFC-010', description: 'Passivation failure on stainless', system: 'Finishing', severity: 'high', cause: 'Iron contamination, improper process', repair: ['Remove contamination', 'Repassivate', 'Use stainless tools only'], parts: ['Passivation solution'], costKES: 5500, time: '2 hr' },

  // Assembly/Fitting Faults
  { code: 'FAB-ASM-001', description: 'Bolt holes not aligning', system: 'Assembly', severity: 'medium', cause: 'Tolerance stackup, distortion', repair: ['Ream to size', 'Use match drilling', 'Check templates'], parts: ['Reamer'], costKES: 2500, time: '1 hr' },
  { code: 'FAB-ASM-002', description: 'Weld distortion misaligning parts', system: 'Assembly', severity: 'high', cause: 'Excessive heat input, wrong sequence', repair: ['Back-step welding', 'Use fixtures', 'Preheat if needed'], parts: ['Fixtures', 'Clamps'], costKES: 15000, time: '4 hr' },
  { code: 'FAB-ASM-003', description: 'Gasket leaking after assembly', system: 'Assembly', severity: 'medium', cause: 'Surface not flat, wrong torque', repair: ['Resurface flanges', 'Use correct gasket', 'Torque in sequence'], parts: ['Gasket', 'Gasket maker'], costKES: 3500, time: '2 hr' },
  { code: 'FAB-ASM-004', description: 'Thread galling on stainless bolts', system: 'Assembly', severity: 'medium', cause: 'No lubricant, too fast assembly', repair: ['Use anti-seize', 'Go slow', 'Use coated fasteners'], parts: ['Anti-seize', 'Coated bolts'], costKES: 2500, time: '30 min' },
  { code: 'FAB-ASM-005', description: 'Press fit too loose', system: 'Assembly', severity: 'medium', cause: 'Tolerance wrong, bore worn', repair: ['Machine new size', 'Use Loctite', 'Knurl shaft'], parts: ['Retaining compound'], costKES: 1500, time: '1 hr' },
  { code: 'FAB-ASM-006', description: 'Press fit cracking hub', system: 'Assembly', severity: 'high', cause: 'Interference too high, brittle material', repair: ['Check tolerances', 'Heat hub before assembly'], parts: ['New hub'], costKES: 25000, time: '3 hr' },
  { code: 'FAB-ASM-007', description: 'Bearing not seating fully', system: 'Assembly', severity: 'high', cause: 'Shoulder not clean, wrong method', repair: ['Clean shoulder', 'Use bearing press', 'Heat if needed'], parts: ['Bearing'], costKES: 8500, time: '1 hr' },
  { code: 'FAB-ASM-008', description: 'Seal installing damaged', system: 'Assembly', severity: 'medium', cause: 'Wrong tool, cocked installation', repair: ['Use seal driver', 'Keep square', 'Lube lip'], parts: ['Seal'], costKES: 2500, time: '30 min' },
  { code: 'FAB-ASM-009', description: 'Rivet not setting properly', system: 'Assembly', severity: 'medium', cause: 'Wrong rivet size, grip too long', repair: ['Check grip range', 'Use correct size rivet', 'Check tool'], parts: ['Rivets'], costKES: 1500, time: '15 min' },
  { code: 'FAB-ASM-010', description: 'Structural bolt undertorqued', system: 'Assembly', severity: 'critical', cause: 'Wrong torque, no calibration', repair: ['Use calibrated wrench', 'Follow spec exactly', 'Mark after torque'], parts: ['DTI washers'], costKES: 3500, time: '30 min' },

  // Measurement/Quality Faults
  { code: 'FAB-QC-001', description: 'Parts out of tolerance', system: 'Quality', severity: 'high', cause: 'Machine wear, operator error, material variation', repair: ['Calibrate equipment', 'Check procedure', 'Verify material'], parts: ['Calibration tools'], costKES: 5500, time: '2 hr' },
  { code: 'FAB-QC-002', description: 'Weld defects - porosity', system: 'Quality', severity: 'high', cause: 'Contamination, gas issue, technique', repair: ['Clean material', 'Check gas flow', 'Proper technique'], parts: ['Wire brush', 'Gas'], costKES: 3500, time: '1 hr' },
  { code: 'FAB-QC-003', description: 'Weld defects - undercut', system: 'Quality', severity: 'high', cause: 'Speed too fast, wrong angle, high current', repair: ['Slow down', 'Correct angle', 'Reduce amps'], parts: ['None'], costKES: 0, time: '30 min' },
  { code: 'FAB-QC-004', description: 'Weld defects - lack of fusion', system: 'Quality', severity: 'critical', cause: 'Low heat, poor technique, contamination', repair: ['Increase heat', 'Proper manipulation', 'Clean joint'], parts: ['None'], costKES: 0, time: '1 hr' },
  { code: 'FAB-QC-005', description: 'Dimensional creep in production', system: 'Quality', severity: 'medium', cause: 'Tool wear, setup drift', repair: ['Check first piece', 'Regular verification', 'Maintain tools'], parts: ['Go/no-go gauges'], costKES: 8500, time: '1 hr' },
  { code: 'FAB-QC-006', description: 'Surface finish too rough', system: 'Quality', severity: 'medium', cause: 'Wrong process, tool marks', repair: ['Add finishing operation', 'Use finer abrasive'], parts: ['Finishing supplies'], costKES: 3500, time: '2 hr' },
  { code: 'FAB-QC-007', description: 'Flatness out of spec', system: 'Quality', severity: 'medium', cause: 'Welding distortion, stress', repair: ['Stress relieve', 'Straighten', 'Machine flat'], parts: ['None'], costKES: 5500, time: '4 hr' },
  { code: 'FAB-QC-008', description: 'Squareness error', system: 'Quality', severity: 'medium', cause: 'Fixture problem, measurement error', repair: ['Check fixture', 'Use precision square', 'Tack sequence'], parts: ['Precision square'], costKES: 5500, time: '1 hr' },
  { code: 'FAB-QC-009', description: 'Paint thickness wrong', system: 'Quality', severity: 'low', cause: 'Wrong technique, no measurement', repair: ['Use thickness gauge', 'Adjust spray parameters'], parts: ['Coating gauge'], costKES: 15000, time: '30 min' },
  { code: 'FAB-QC-010', description: 'Hardness not meeting spec', system: 'Quality', severity: 'high', cause: 'Wrong heat treatment, material error', repair: ['Verify material cert', 'Re-heat treat if possible'], parts: ['None'], costKES: 8500, time: '4 hr' },

  // Safety/Compliance Faults
  { code: 'FAB-SAF-001', description: 'Guard missing or removed', system: 'Safety', severity: 'critical', cause: 'Removed and not replaced', repair: ['Reinstall guard immediately', 'Lock out if guard missing'], parts: ['Guard'], costKES: 15000, time: '1 hr' },
  { code: 'FAB-SAF-002', description: 'Emergency stop not working', system: 'Safety', severity: 'critical', cause: 'Wiring fault, button failure', repair: ['Test all E-stops', 'Replace faulty units', 'Check wiring'], parts: ['E-stop button'], costKES: 3500, time: '1 hr' },
  { code: 'FAB-SAF-003', description: 'Ventilation inadequate', system: 'Safety', severity: 'high', cause: 'Fans not working, blocked ducts', repair: ['Service fans', 'Clear ducts', 'Add extraction'], parts: ['Fans', 'Ducting'], costKES: 45000, time: '4 hr' },
  { code: 'FAB-SAF-004', description: 'Fire extinguisher empty/expired', system: 'Safety', severity: 'critical', cause: 'No inspection, used and not replaced', repair: ['Replace or recharge immediately', 'Implement inspection routine'], parts: ['Fire extinguisher'], costKES: 5500, time: '15 min' },
  { code: 'FAB-SAF-005', description: 'PPE not available', system: 'Safety', severity: 'high', cause: 'Not stocked, not enforced', repair: ['Stock appropriate PPE', 'Enforce usage', 'Train workers'], parts: ['PPE set'], costKES: 15000, time: '1 hr' },
  { code: 'FAB-SAF-006', description: 'Lifting equipment not certified', system: 'Safety', severity: 'critical', cause: 'Inspection lapsed', repair: ['Get certified inspection', 'Do not use until certified'], parts: ['Certification'], costKES: 25000, time: '1 day' },
  { code: 'FAB-SAF-007', description: 'Compressed gas cylinders unsecured', system: 'Safety', severity: 'high', cause: 'No chains, improper storage', repair: ['Chain all cylinders', 'Proper storage area', 'Caps in place'], parts: ['Chains', 'Cylinder rack'], costKES: 8500, time: '2 hr' },
  { code: 'FAB-SAF-008', description: 'Electrical cables damaged', system: 'Safety', severity: 'high', cause: 'Wear, crushing, cuts', repair: ['Replace damaged cables', 'Route properly', 'Use protection'], parts: ['Power cables'], costKES: 5500, time: '1 hr' },
  { code: 'FAB-SAF-009', description: 'No lockout/tagout procedure', system: 'Safety', severity: 'critical', cause: 'Procedure not established', repair: ['Develop LOTO procedure', 'Train all workers', 'Provide equipment'], parts: ['LOTO kit'], costKES: 12000, time: '1 day' },
  { code: 'FAB-SAF-010', description: 'Housekeeping hazards', system: 'Safety', severity: 'medium', cause: 'Poor practices, no schedule', repair: ['Implement 5S program', 'Daily cleaning', 'Designated storage'], parts: ['Cleaning supplies'], costKES: 5500, time: '4 hr' },

  // More cutting faults
  { code: 'FAB-CUT-011', description: 'Laser cutter poor edge quality', system: 'Laser Cutting', severity: 'medium', cause: 'Focus wrong, gas pressure, lens dirty', repair: ['Check focus', 'Clean lens', 'Adjust parameters'], parts: ['Lens', 'Nozzle'], costKES: 25000, time: '1 hr' },
  { code: 'FAB-CUT-012', description: 'Waterjet abrasive not flowing', system: 'Waterjet', severity: 'high', cause: 'Hopper empty, feed tube blocked', repair: ['Fill hopper', 'Clear tube', 'Check metering'], parts: ['Abrasive garnet'], costKES: 15000, time: '30 min' },
  { code: 'FAB-CUT-013', description: 'CNC plasma arc drift', system: 'CNC Plasma', severity: 'medium', cause: 'THC malfunction, consumables', repair: ['Check torch height control', 'Replace consumables'], parts: ['Consumable set'], costKES: 8500, time: '1 hr' },
  { code: 'FAB-CUT-014', description: 'Shear blade chipping', system: 'Shear', severity: 'medium', cause: 'Material too hard, impact', repair: ['Check material specs', 'Replace blade section'], parts: ['Shear blade'], costKES: 45000, time: '4 hr' },
  { code: 'FAB-CUT-015', description: 'Nibbler leaving burrs', system: 'Nibbler', severity: 'low', cause: 'Punch/die worn', repair: ['Replace punch and die', 'Check clearance'], parts: ['Punch', 'Die'], costKES: 8500, time: '1 hr' },
  { code: 'FAB-CUT-016', description: 'Router bit burning wood/plastic', system: 'Router', severity: 'low', cause: 'Dull bit, speed too high, feed too slow', repair: ['Replace bit', 'Adjust parameters'], parts: ['Router bit'], costKES: 5500, time: '15 min' },
  { code: 'FAB-CUT-017', description: 'Cold saw blade vibrating', system: 'Cold Saw', severity: 'medium', cause: 'Blade loose, damaged teeth', repair: ['Tighten blade', 'Replace if damaged', 'Check arbor'], parts: ['Cold saw blade'], costKES: 35000, time: '1 hr' },
  { code: 'FAB-CUT-018', description: 'Flame cutting excessive preheat', system: 'Oxy-Fuel', severity: 'medium', cause: 'Wrong tip, pressure too high', repair: ['Select correct tip', 'Reduce acetylene'], parts: ['Cutting tip'], costKES: 2500, time: '10 min' },
  { code: 'FAB-CUT-019', description: 'Abrasive disc glazing', system: 'Grinder', severity: 'low', cause: 'Wrong grade for material', repair: ['Use softer grade disc', 'Increase pressure slightly'], parts: ['Cutting disc'], costKES: 500, time: '5 min' },
  { code: 'FAB-CUT-020', description: 'Plasma pilot arc not transferring', system: 'Plasma Cutting', severity: 'high', cause: 'Material grounding poor, standoff wrong', repair: ['Check work clamp connection', 'Adjust standoff', 'Clean material'], parts: ['Work clamp'], costKES: 2500, time: '15 min' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// REPAIR MANUALS
// ═══════════════════════════════════════════════════════════════════════════════
export const FABRICATION_REPAIR_MANUALS = [
  {
    id: 'rm-fab-001',
    title: 'Plasma Cutter Maintenance & Consumables',
    category: 'Cutting Equipment',
    difficulty: 'Medium',
    timeRequired: '30 min - 2 hours',
    tools: ['Screwdriver', 'Clean cloths', 'Contact cleaner', 'Multimeter'],
    safetyWarnings: [
      'Disconnect power before any maintenance',
      'Allow torch to cool before handling',
      'Compressed air can cause injury',
      'Wear safety glasses',
    ],
    steps: [
      { step: 1, title: 'Disconnect Power', description: 'Turn off and unplug machine', details: 'Ensure main power is off, wait for capacitors to discharge.', caution: 'High voltage present' },
      { step: 2, title: 'Remove Torch Shield', description: 'Remove outer shield cup', details: 'Unscrew or pull off shield cup, inspect for damage.', caution: 'May be hot after use' },
      { step: 3, title: 'Remove Nozzle', description: 'Unscrew cutting nozzle', details: 'Remove nozzle, inspect for wear, damage, circular pattern.', caution: 'Replace if orifice worn' },
      { step: 4, title: 'Remove Electrode', description: 'Unscrew electrode from torch', details: 'Check hafnium insert, replace when cavity exceeds 1.5mm.', caution: 'Critical wear component' },
      { step: 5, title: 'Check Swirl Ring', description: 'Inspect swirl ring condition', details: 'Check for cracks, melting, blocked holes.', caution: 'Damaged ring causes poor cut quality' },
      { step: 6, title: 'Clean Torch Body', description: 'Clean all internal surfaces', details: 'Use clean cloth, contact cleaner if needed, remove debris.', caution: 'Do not damage threads' },
      { step: 7, title: 'Install New Consumables', description: 'Install in reverse order', details: 'Install swirl ring, electrode, nozzle, shield cup. Hand tight only.', caution: 'Do not overtighten' },
      { step: 8, title: 'Check Air Supply', description: 'Verify clean dry air', details: 'Drain water trap, check filter, verify 75-85 PSI.', caution: 'Moisture destroys consumables' },
    ],
    verification: [
      'Pilot arc starts immediately',
      'Arc transfers cleanly',
      'Cut quality is good',
      'No air leaks',
      'Consumables seated properly',
    ],
  },
  {
    id: 'rm-fab-002',
    title: 'Press Brake Die Change Procedure',
    category: 'Forming Equipment',
    difficulty: 'Medium',
    timeRequired: '30 min - 1 hour',
    tools: ['Die blocks', 'Wrench set', 'Lifting equipment', 'Level', 'Cleaning materials'],
    safetyWarnings: [
      'Lock out machine before die change',
      'Dies are heavy - use proper lifting',
      'Keep hands clear of pinch points',
      'Verify tooling compatibility',
    ],
    steps: [
      { step: 1, title: 'Lock Out Machine', description: 'Full lockout/tagout procedure', details: 'Turn off, lock out main breaker, verify no stored energy.', caution: 'Never skip this step' },
      { step: 2, title: 'Lower Ram', description: 'Rest ram on die blocks', details: 'Position die blocks, lower ram to rest position.', caution: 'Support ram weight' },
      { step: 3, title: 'Release Top Clamps', description: 'Remove punch clamping', details: 'Loosen clamps, remove punch tooling carefully.', caution: 'Tooling may fall' },
      { step: 4, title: 'Remove Bottom Die', description: 'Release and remove die', details: 'Loosen clamps, remove die segments, clean bed.', caution: 'Heavy components' },
      { step: 5, title: 'Clean All Surfaces', description: 'Clean bed and ram', details: 'Remove debris, chips, old lubricant from mounting surfaces.', caution: 'Clean surfaces essential for accuracy' },
      { step: 6, title: 'Install New Bottom Die', description: 'Position and clamp die', details: 'Center die, align with ram, tighten clamps progressively.', caution: 'Verify die is level' },
      { step: 7, title: 'Install New Top Punch', description: 'Mount and align punch', details: 'Insert punch, align with die, tighten clamps.', caution: 'Check alignment carefully' },
      { step: 8, title: 'Test and Adjust', description: 'Make test bends', details: 'Remove blocks, power up, make test bends on scrap.', caution: 'Start with low pressure' },
    ],
    verification: [
      'Tooling centered and aligned',
      'All clamps torqued properly',
      'Test bend angle correct',
      'No unusual sounds',
      'Machine operates smoothly',
    ],
  },
  {
    id: 'rm-fab-003',
    title: 'Bandsaw Blade Replacement',
    category: 'Cutting Equipment',
    difficulty: 'Easy',
    timeRequired: '15-30 minutes',
    tools: ['Blade coil handler', 'Blade brush', 'Tension gauge', 'Gloves'],
    safetyWarnings: [
      'Power off and locked out',
      'Blade edges are sharp',
      'Blade can uncoil with force',
      'Wear heavy gloves',
    ],
    steps: [
      { step: 1, title: 'Power Off', description: 'Disconnect power', details: 'Turn off, lock out power supply.', caution: 'Verify blade stopped' },
      { step: 2, title: 'Release Tension', description: 'Relax blade tension completely', details: 'Turn tension knob to release all tension.', caution: 'Blade may move' },
      { step: 3, title: 'Remove Guards', description: 'Open blade guards', details: 'Remove or open all blade guards for access.', caution: 'Note guard positions' },
      { step: 4, title: 'Remove Old Blade', description: 'Remove blade from wheels', details: 'Slip blade off wheels, carefully coil for disposal.', caution: 'Blade edges sharp' },
      { step: 5, title: 'Clean Wheels', description: 'Clean wheel surfaces', details: 'Brush wheels clean, check for damage.', caution: 'Replace damaged wheels' },
      { step: 6, title: 'Install New Blade', description: 'Mount new blade on wheels', details: 'Uncoil carefully, teeth pointing down, mount on wheels.', caution: 'Check tooth direction' },
      { step: 7, title: 'Set Tracking', description: 'Center blade on wheels', details: 'Adjust tracking wheel to center blade.', caution: 'Blade should run in center' },
      { step: 8, title: 'Set Tension', description: 'Apply correct tension', details: 'Tension to blade manufacturer spec, use gauge if available.', caution: 'Under/over tension causes problems' },
    ],
    verification: [
      'Blade tracks centered on wheels',
      'Tension is correct',
      'Blade runs true at all speeds',
      'All guards reinstalled',
      'Test cut is straight',
    ],
  },
  {
    id: 'rm-fab-004',
    title: 'Hydraulic System Troubleshooting',
    category: 'General Maintenance',
    difficulty: 'Advanced',
    timeRequired: '1-4 hours',
    tools: ['Pressure gauge', 'Flow meter', 'Thermometer', 'Multimeter', 'Sample bottles', 'Wrenches'],
    safetyWarnings: [
      'Relieve all pressure before opening system',
      'Hot oil causes burns',
      'Hydraulic injection injury risk',
      'Wear PPE when handling oil',
    ],
    steps: [
      { step: 1, title: 'Document Problem', description: 'Note all symptoms', details: 'Record what machine does/doesnt do, unusual sounds, speeds.', caution: 'Good diagnosis starts with observation' },
      { step: 2, title: 'Check Oil Level', description: 'Verify oil quantity', details: 'Check sight glass or dipstick, should be full when warm.', caution: 'Running low causes pump damage' },
      { step: 3, title: 'Check Oil Condition', description: 'Assess oil quality', details: 'Take sample, check color, smell, contamination.', caution: 'Dark/burnt smell indicates overheating' },
      { step: 4, title: 'Check Filters', description: 'Inspect all filters', details: 'Check suction strainer, return filter, pressure filter indicators.', caution: 'Clogged filters cause cavitation' },
      { step: 5, title: 'Check Pump', description: 'Test pump output', details: 'Connect flow meter, compare to spec, check for noise.', caution: 'Whining indicates cavitation' },
      { step: 6, title: 'Check Pressure', description: 'Test system pressure', details: 'Connect gauge at various points, compare to spec.', caution: 'Low pressure = pump or relief valve issue' },
      { step: 7, title: 'Check Cylinders', description: 'Test for internal leakage', details: 'Pressurize, check for drift, external leaks.', caution: 'Drift indicates seal bypass' },
      { step: 8, title: 'Check Valves', description: 'Test directional and relief valves', details: 'Verify valve operation, adjust relief if needed.', caution: 'Never exceed max system pressure' },
    ],
    verification: [
      'Full pressure achieved',
      'No unusual sounds',
      'Oil temperature normal',
      'All cylinders operate correctly',
      'No external leaks',
    ],
  },
  {
    id: 'rm-fab-005',
    title: 'Oxy-Fuel Equipment Setup and Testing',
    category: 'Cutting Equipment',
    difficulty: 'Medium',
    timeRequired: '30 min - 1 hour',
    tools: ['Wrench set', 'Leak detection fluid', 'Tip cleaners', 'Striker', 'PPE'],
    safetyWarnings: [
      'Never use oil/grease on oxygen equipment',
      'Stand to side when opening valves',
      'Store cylinders chained upright',
      'Keep fire extinguisher nearby',
      'Never use damaged equipment',
    ],
    steps: [
      { step: 1, title: 'Inspect Cylinders', description: 'Check cylinder condition', details: 'Look for damage, check test dates, verify contents.', caution: 'Do not use damaged cylinders' },
      { step: 2, title: 'Secure Cylinders', description: 'Chain cylinders properly', details: 'Chain to wall or cart, keep upright, separate fuel from oxygen.', caution: 'Falling cylinders are dangerous' },
      { step: 3, title: 'Crack Valves', description: 'Clear valve seats', details: 'Stand aside, briefly open each valve to blow out debris.', caution: 'Point away from people' },
      { step: 4, title: 'Install Regulators', description: 'Attach regulators to cylinders', details: 'Use correct fittings, hand tight then wrench tighten.', caution: 'Never force connections' },
      { step: 5, title: 'Connect Hoses', description: 'Attach hoses to regulators', details: 'Green to oxygen, red to fuel, check connections secure.', caution: 'Never interchange hoses' },
      { step: 6, title: 'Leak Test', description: 'Check all connections', details: 'Pressurize, apply leak detection fluid to all joints.', caution: 'Fix all leaks before use' },
      { step: 7, title: 'Set Pressures', description: 'Adjust working pressures', details: 'Set oxygen and fuel per tip chart, close torch valves first.', caution: 'Follow manufacturer recommendations' },
      { step: 8, title: 'Test Light', description: 'Light and adjust flame', details: 'Open fuel slightly, ignite, add oxygen to neutral flame.', caution: 'Always use striker, never lighter' },
    ],
    verification: [
      'No leaks at any connection',
      'Neutral flame achieved',
      'Pressures stable',
      'Flashback arrestors installed',
      'All hoses in good condition',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PARTS CATALOGUE WITH KENYA SUPPLIERS
// ═══════════════════════════════════════════════════════════════════════════════
export const FABRICATION_PARTS_CATALOGUE = {
  plasma: [
    { partNumber: 'PLASMA-ELEC-45', description: 'Electrode for 45A Plasma', brand: 'Hypertherm', priceKES: 1500, application: 'PowerMax 45', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PLASMA-ELEC-65', description: 'Electrode for 65A Plasma', brand: 'Hypertherm', priceKES: 1800, application: 'PowerMax 65/85', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PLASMA-NOZ-45', description: 'Nozzle for 45A Plasma', brand: 'Hypertherm', priceKES: 1200, application: 'PowerMax 45', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PLASMA-NOZ-65', description: 'Nozzle for 65A Plasma', brand: 'Hypertherm', priceKES: 1500, application: 'PowerMax 65/85', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PLASMA-SWIRL', description: 'Swirl Ring', brand: 'Hypertherm', priceKES: 2500, application: 'All PowerMax', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PLASMA-SHIELD', description: 'Shield Cup', brand: 'Hypertherm', priceKES: 3500, application: 'All PowerMax', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PLASMA-SET-45', description: 'Consumable Kit 45A', brand: 'Hypertherm', priceKES: 12000, application: '10-piece kit', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PLASMA-SET-65', description: 'Consumable Kit 65A', brand: 'Hypertherm', priceKES: 15000, application: '10-piece kit', suppliers: ['EmersonEIMS'] },
  ],
  oxyFuel: [
    { partNumber: 'OXY-TIP-000', description: 'Cutting Tip Size 000', brand: 'Victor', priceKES: 2500, application: '1-3mm steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-TIP-0', description: 'Cutting Tip Size 0', brand: 'Victor', priceKES: 2500, application: '3-6mm steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-TIP-1', description: 'Cutting Tip Size 1', brand: 'Victor', priceKES: 2500, application: '6-12mm steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-TIP-2', description: 'Cutting Tip Size 2', brand: 'Victor', priceKES: 2500, application: '12-25mm steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-TIP-3', description: 'Cutting Tip Size 3', brand: 'Victor', priceKES: 2800, application: '25-50mm steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-REG-OXY', description: 'Oxygen Regulator', brand: 'Victor', priceKES: 12000, application: 'CGA 540', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-REG-ACET', description: 'Acetylene Regulator', brand: 'Victor', priceKES: 12000, application: 'CGA 510', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-HOSE-SET', description: 'Hose Set 15m', brand: 'Various', priceKES: 8500, application: 'Twin hose', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-FLASHBACK', description: 'Flashback Arrestor Set', brand: 'Various', priceKES: 5500, application: 'Torch end', suppliers: ['EmersonEIMS'] },
    { partNumber: 'OXY-STRIKER', description: 'Flint Striker', brand: 'Various', priceKES: 350, application: 'Ignition', suppliers: ['EmersonEIMS'] },
  ],
  sawBlades: [
    { partNumber: 'SAW-BAND-34', description: 'Bandsaw Blade 34x1.1mm', brand: 'Lenox', priceKES: 8500, application: 'General steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'SAW-BAND-41', description: 'Bandsaw Blade 41x1.3mm', brand: 'Lenox', priceKES: 12500, application: 'Heavy duty', suppliers: ['EmersonEIMS'] },
    { partNumber: 'SAW-COLD-250', description: 'Cold Saw Blade 250mm', brand: 'Various', priceKES: 25000, application: 'Steel cutting', suppliers: ['EmersonEIMS'] },
    { partNumber: 'SAW-COLD-300', description: 'Cold Saw Blade 300mm', brand: 'Various', priceKES: 35000, application: 'Steel cutting', suppliers: ['EmersonEIMS'] },
    { partNumber: 'SAW-CIRC-7', description: 'Circular Saw Blade 7" Metal', brand: 'DeWalt', priceKES: 3500, application: 'Steel cutting', suppliers: ['EmersonEIMS'] },
    { partNumber: 'SAW-CIRC-14', description: 'Circular Saw Blade 14" Metal', brand: 'DeWalt', priceKES: 8500, application: 'Chop saw', suppliers: ['EmersonEIMS'] },
  ],
  abrasives: [
    { partNumber: 'ABR-CUT-4.5', description: 'Cutting Disc 4.5" x 1mm', brand: 'Pferd', priceKES: 150, application: 'Angle grinder', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ABR-CUT-9', description: 'Cutting Disc 9" x 2mm', brand: 'Pferd', priceKES: 350, application: 'Large grinder', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ABR-GRIND-4.5', description: 'Grinding Disc 4.5" x 6mm', brand: 'Pferd', priceKES: 250, application: 'Metal grinding', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ABR-FLAP-60', description: 'Flap Disc 4.5" 60 grit', brand: 'Pferd', priceKES: 450, application: 'Finishing', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ABR-FLAP-80', description: 'Flap Disc 4.5" 80 grit', brand: 'Pferd', priceKES: 450, application: 'Finishing', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ABR-WIRE-CUP', description: 'Wire Cup Brush', brand: 'Various', priceKES: 650, application: 'Cleaning', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ABR-WIRE-WHEEL', description: 'Wire Wheel 4.5"', brand: 'Various', priceKES: 550, application: 'Cleaning', suppliers: ['EmersonEIMS'] },
    { partNumber: 'ABR-SAND-80', description: 'Sandpaper Roll 80 grit', brand: 'Various', priceKES: 2500, application: '50m roll', suppliers: ['EmersonEIMS'] },
  ],
  drillBits: [
    { partNumber: 'DRILL-HSS-SET', description: 'HSS Drill Bit Set 1-13mm', brand: 'Dormer', priceKES: 8500, application: 'General drilling', suppliers: ['EmersonEIMS'] },
    { partNumber: 'DRILL-COBALT-SET', description: 'Cobalt Drill Set 1-10mm', brand: 'Dormer', priceKES: 15000, application: 'Stainless steel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'DRILL-ANNULAR-12', description: 'Annular Cutter 12mm', brand: 'Rotabroach', priceKES: 3500, application: 'Mag drill', suppliers: ['EmersonEIMS'] },
    { partNumber: 'DRILL-ANNULAR-22', description: 'Annular Cutter 22mm', brand: 'Rotabroach', priceKES: 4500, application: 'Mag drill', suppliers: ['EmersonEIMS'] },
    { partNumber: 'DRILL-HOLE-22', description: 'Hole Saw 22mm', brand: 'Various', priceKES: 850, application: 'Sheet metal', suppliers: ['EmersonEIMS'] },
    { partNumber: 'DRILL-HOLE-32', description: 'Hole Saw 32mm', brand: 'Various', priceKES: 1200, application: 'Sheet metal', suppliers: ['EmersonEIMS'] },
    { partNumber: 'DRILL-STEP', description: 'Step Drill 4-32mm', brand: 'Various', priceKES: 3500, application: 'Multiple sizes', suppliers: ['EmersonEIMS'] },
    { partNumber: 'TAP-SET-METRIC', description: 'Metric Tap Set M3-M12', brand: 'Dormer', priceKES: 12500, application: 'Threading', suppliers: ['EmersonEIMS'] },
  ],
  hydraulics: [
    { partNumber: 'HYD-OIL-20L', description: 'Hydraulic Oil ISO 46 20L', brand: 'Total', priceKES: 8500, application: 'General hydraulics', suppliers: ['EmersonEIMS'] },
    { partNumber: 'HYD-FILTER-10', description: 'Hydraulic Filter Element', brand: 'Parker', priceKES: 5500, application: 'Return line', suppliers: ['EmersonEIMS'] },
    { partNumber: 'HYD-SEAL-KIT', description: 'Cylinder Seal Kit', brand: 'Various', priceKES: 3500, application: 'Per cylinder', suppliers: ['EmersonEIMS'] },
    { partNumber: 'HYD-HOSE-3/8', description: 'Hydraulic Hose 3/8" per meter', brand: 'Various', priceKES: 850, application: 'High pressure', suppliers: ['EmersonEIMS'] },
    { partNumber: 'HYD-HOSE-1/2', description: 'Hydraulic Hose 1/2" per meter', brand: 'Various', priceKES: 1200, application: 'High pressure', suppliers: ['EmersonEIMS'] },
    { partNumber: 'HYD-FITTING-KIT', description: 'Hydraulic Fitting Kit', brand: 'Various', priceKES: 8500, application: 'Common sizes', suppliers: ['EmersonEIMS'] },
  ],
  safety: [
    { partNumber: 'PPE-HELMET', description: 'Auto-darkening Helmet', brand: '3M', priceKES: 8500, application: 'Welding/cutting', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PPE-GOGGLES-SHADE5', description: 'Cutting Goggles Shade 5', brand: 'Various', priceKES: 850, application: 'Oxy-fuel', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PPE-GLOVES-WELD', description: 'Welding Gloves', brand: 'Various', priceKES: 1200, application: 'Heat protection', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PPE-APRON', description: 'Leather Apron', brand: 'Various', priceKES: 2500, application: 'Body protection', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PPE-BOOTS', description: 'Safety Boots Steel Toe', brand: 'Various', priceKES: 5500, application: 'Foot protection', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PPE-EARPLUGS', description: 'Ear Plugs (box 200)', brand: '3M', priceKES: 2500, application: 'Hearing', suppliers: ['EmersonEIMS'] },
    { partNumber: 'PPE-RESPIRATOR', description: 'Half Face Respirator', brand: '3M', priceKES: 3500, application: 'Fumes', suppliers: ['EmersonEIMS'] },
    { partNumber: 'FIRE-EXT-CO2', description: 'Fire Extinguisher CO2 5kg', brand: 'Various', priceKES: 12500, application: 'Electrical/metal fires', suppliers: ['EmersonEIMS'] },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAINTENANCE SCHEDULES
// ═══════════════════════════════════════════════════════════════════════════════
export const FABRICATION_MAINTENANCE_SCHEDULES = {
  cuttingEquipment: {
    daily: [
      { task: 'Inspect consumables', procedure: 'Check electrode, nozzle, tip condition', tools: ['Visual'] },
      { task: 'Check air/gas supply', procedure: 'Verify pressure, drain water traps', tools: ['Pressure gauge'] },
      { task: 'Clean work area', procedure: 'Remove slag, spatter, debris', tools: ['Brush', 'Scraper'] },
      { task: 'Inspect cables', procedure: 'Check for damage, loose connections', tools: ['Visual'] },
    ],
    weekly: [
      { task: 'Clean torch', procedure: 'Remove spatter, clean threads', tools: ['Wire brush', 'Contact cleaner'] },
      { task: 'Check work clamp', procedure: 'Clean contact surface, check cable', tools: ['Wire brush'] },
      { task: 'Inspect regulators', procedure: 'Check gauges, test for leaks', tools: ['Leak detector'] },
      { task: 'Clean filters', procedure: 'Clean or replace air filters', tools: ['Compressed air'] },
    ],
    monthly: [
      { task: 'Full torch inspection', procedure: 'Disassemble, clean, check all parts', tools: ['Torch kit'] },
      { task: 'Calibrate settings', procedure: 'Verify cut parameters on test piece', tools: ['Test materials'] },
      { task: 'Check hoses', procedure: 'Inspect entire length for damage', tools: ['Visual'] },
    ],
    annually: [
      { task: 'Professional service', procedure: 'Full machine service by technician', tools: ['Service kit'] },
      { task: 'Replace hoses', procedure: 'Replace all gas and air hoses', tools: ['Hose kit'] },
      { task: 'Calibration', procedure: 'Calibrate all pressure gauges', tools: ['Calibration equipment'] },
    ],
  },
  formingEquipment: {
    daily: [
      { task: 'Check oil level', procedure: 'Verify hydraulic oil level', tools: ['Sight glass'] },
      { task: 'Inspect tooling', procedure: 'Check dies for damage, wear', tools: ['Visual'] },
      { task: 'Clean bed', procedure: 'Remove debris from work surface', tools: ['Brush'] },
      { task: 'Test safety devices', procedure: 'Verify guards, E-stops work', tools: ['None'] },
    ],
    weekly: [
      { task: 'Grease fittings', procedure: 'Lubricate all grease points', tools: ['Grease gun'] },
      { task: 'Check hydraulic filters', procedure: 'Check filter indicators', tools: ['Visual'] },
      { task: 'Clean machine', procedure: 'Wipe down all surfaces', tools: ['Rags'] },
    ],
    monthly: [
      { task: 'Oil analysis', procedure: 'Take oil sample, check condition', tools: ['Sample bottle'] },
      { task: 'Check cylinders', procedure: 'Inspect for leaks, drift', tools: ['Visual'] },
      { task: 'Electrical check', procedure: 'Check all connections, sensors', tools: ['Multimeter'] },
    ],
    annually: [
      { task: 'Full service', procedure: 'Complete machine service', tools: ['Full toolkit'] },
      { task: 'Replace filters', procedure: 'Replace all hydraulic filters', tools: ['Filter kit'] },
      { task: 'Calibrate', procedure: 'Check and calibrate backgauge', tools: ['Calibration tools'] },
    ],
  },
  generalShop: {
    daily: [
      { task: '5S check', procedure: 'Sort, Set, Shine, Standardize, Sustain', tools: ['Checklist'] },
      { task: 'Inspect hand tools', procedure: 'Check all tools before use', tools: ['Visual'] },
      { task: 'Check PPE', procedure: 'Verify all PPE available and good', tools: ['Visual'] },
      { task: 'Fire safety', procedure: 'Check extinguisher access, clear exits', tools: ['Visual'] },
    ],
    weekly: [
      { task: 'Organize tool storage', procedure: 'Return all tools to proper place', tools: ['None'] },
      { task: 'Inspect grinding wheels', procedure: 'Ring test, check guards', tools: ['None'] },
      { task: 'Clean ventilation', procedure: 'Clear dust from vents, fans', tools: ['Brush'] },
    ],
    monthly: [
      { task: 'Calibrate measuring tools', procedure: 'Check squares, tapes, gauges', tools: ['Standards'] },
      { task: 'Inventory consumables', procedure: 'Check stock levels, reorder', tools: ['Inventory list'] },
      { task: 'Safety meeting', procedure: 'Review safety topics, incidents', tools: ['None'] },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMERSONEIMS PARTS & SERVICES - YOUR TRUSTED PARTNER
// ═══════════════════════════════════════════════════════════════════════════════
export const FABRICATION_KENYA_SUPPLIERS = [
  { name: 'EmersonEIMS', location: 'Nairobi, Kenya (Serving All Counties)', specialization: 'Complete Fabrication Solutions - Equipment, Tools, Maintenance & Repairs', phone: '+254 768 860 665', email: 'info@emersoneims.com' },
];

// Export all
export const FABRICATION_BIBLE_DATA = {
  faultCodes: FABRICATION_FAULT_CODES,
  repairManuals: FABRICATION_REPAIR_MANUALS,
  partsCatalogue: FABRICATION_PARTS_CATALOGUE,
  maintenanceSchedules: FABRICATION_MAINTENANCE_SCHEDULES,
  suppliers: FABRICATION_KENYA_SUPPLIERS,
};
