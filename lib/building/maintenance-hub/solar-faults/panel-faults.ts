/**
 * Comprehensive Solar Panel Fault Codes & Issues
 * Covering all major panel types and common issues
 * World's Most Comprehensive Solar Maintenance Hub
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL FAULT/ISSUE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface PanelFault {
  code: string;
  name: string;
  panelTypes: string[];
  brands: string[];
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Warning';
  category: string;
  description: string;
  symptoms: string[];
  causes: string[];
  diagnosticSteps: string[];
  solution: string;
  repairProcedure: string[];
  preventionMeasures: string[];
  safetyWarnings: string[];
  estimatedRepairTime: string;
  toolsRequired: string[];
  partsRequired: string[];
  technicalNotes: string;
  affectsWarranty: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAL SOLAR PANEL FAULTS (All Panel Types)
// ═══════════════════════════════════════════════════════════════════════════════

export const GENERAL_PANEL_FAULTS: PanelFault[] = [
  {
    code: 'PNL-001',
    name: 'Hot Spot',
    panelTypes: ['Monocrystalline', 'Polycrystalline', 'Thin-Film'],
    brands: ['All brands'],
    severity: 'Critical',
    category: 'Cell Damage',
    description: 'Localized overheating in one or more cells caused by current mismatch, shading, or cell defects. Hot spots can reach temperatures exceeding 150°C and cause permanent damage or fire.',
    symptoms: [
      'Visible brown/burn marks on panel surface',
      'Localized discoloration of backsheet',
      'Reduced power output',
      'Visible thermal anomaly on IR camera',
      'Burning smell in severe cases',
      'Cracked or melted encapsulant'
    ],
    causes: [
      'Partial shading from objects, dirt, or bird droppings',
      'Cracked or damaged cells',
      'Manufacturing defects',
      'Poor quality solder joints',
      'Faulty bypass diodes',
      'Cell mismatch within string',
      'Physical damage to panel'
    ],
    diagnosticSteps: [
      'Perform visual inspection for burn marks or discoloration',
      'Use IR thermal camera during peak solar hours',
      'Compare temperature of suspected hot spot to surrounding cells',
      'Temperature difference >20°C indicates hot spot',
      'Check for shading sources',
      'Test bypass diodes',
      'Measure individual string currents if accessible'
    ],
    solution: 'Remove shading source if present. For cell damage, panel replacement is typically required. Minor hot spots may be manageable with proper monitoring.',
    repairProcedure: [
      'Document hot spot location with photos and thermal images',
      'Remove any shading objects (trim trees, clean debris)',
      'Test bypass diodes - replace if faulty',
      'If hot spot persists with clear panel, document for warranty',
      'Severe hot spots require panel replacement',
      'Monitor affected panel closely if kept in service',
      'Consider string reconfiguration to isolate affected panel'
    ],
    preventionMeasures: [
      'Regular cleaning schedule',
      'Trim vegetation that may shade panels',
      'Use quality panels with robust bypass diodes',
      'Avoid installation in areas with frequent shading',
      'Annual thermal inspection',
      'Bird deterrent systems'
    ],
    safetyWarnings: [
      'Hot spots can cause fires - do not ignore',
      'Panel surface can exceed 80°C during inspection',
      'Do not touch suspected hot spot area',
      'Disconnect string before close inspection',
      'Have fire extinguisher available'
    ],
    estimatedRepairTime: '30 minutes for cleaning, 1-2 hours for panel replacement',
    toolsRequired: ['IR thermal camera', 'Multimeter', 'Panel cleaning kit', 'IV curve tracer (optional)'],
    partsRequired: ['Replacement panel if damaged', 'Bypass diodes if faulty'],
    technicalNotes: 'Hot spots exceeding 85°C are critical. Panel efficiency loss from hot spots is typically 10-25%. Bypass diodes should limit hot spot current but may fail over time.',
    affectsWarranty: true
  },
  {
    code: 'PNL-002',
    name: 'Micro-Cracks',
    panelTypes: ['Monocrystalline', 'Polycrystalline'],
    brands: ['All crystalline silicon brands'],
    severity: 'Medium',
    category: 'Cell Damage',
    description: 'Microscopic cracks in silicon cells that may propagate over time, reducing power output and potentially leading to hot spots.',
    symptoms: [
      'Gradual power output decline',
      'Visible snail trails (silver/dark lines)',
      'Hot spots in cracked areas',
      'Lower than expected IV curve',
      'Reduced fill factor'
    ],
    causes: [
      'Rough handling during transport/installation',
      'Thermal cycling stress',
      'Hail or impact damage',
      'Walking on panels',
      'Improper mounting causing flex',
      'Manufacturing defects',
      'Excessive wind loading'
    ],
    diagnosticSteps: [
      'Visual inspection for snail trails (indicates advanced cracks)',
      'Electroluminescence (EL) imaging to detect micro-cracks',
      'Compare current IV curve to nameplate',
      'Thermal imaging for associated hot spots',
      'Review installation/handling history',
      'Check mounting for excessive panel flex'
    ],
    solution: 'Minor micro-cracks may be monitored. Severe cracking with significant power loss requires panel replacement under warranty if applicable.',
    repairProcedure: [
      'Perform EL imaging to quantify crack extent',
      'Document power output versus nameplate',
      'If >5% power loss, pursue warranty claim',
      'Review mounting system for improvements',
      'Consider more robust panels for replacement',
      'Monitor affected panels for degradation'
    ],
    preventionMeasures: [
      'Proper handling and transport procedures',
      'Use panel edge clamps, not center mount',
      'Adequate mounting point spacing',
      'Half-cut cell panels are more resistant',
      'Avoid walking on panels',
      'Proper stacking during storage'
    ],
    safetyWarnings: [
      'Cracked panels can create shock hazard',
      'Water ingress through cracks possible',
      'Monitor for hot spot development'
    ],
    estimatedRepairTime: '1-2 hours for inspection and documentation',
    toolsRequired: ['EL camera', 'IV curve tracer', 'IR camera', 'Multimeter'],
    partsRequired: ['Replacement panels if required'],
    technicalNotes: 'Micro-cracks often not visible but detectable by EL imaging. Half-cut cell design limits micro-crack propagation. Most panels have some micro-cracks from manufacturing/transport.',
    affectsWarranty: true
  },
  {
    code: 'PNL-003',
    name: 'PID (Potential Induced Degradation)',
    panelTypes: ['Monocrystalline', 'Polycrystalline'],
    brands: ['All crystalline silicon brands'],
    severity: 'High',
    category: 'Electrical Degradation',
    description: 'Power loss caused by voltage stress between cells and frame, typically in high voltage strings with negative grounding. Can cause 30-80% power loss.',
    symptoms: [
      'Significant power output reduction (30-80%)',
      'Affected panels appear darker in EL imaging',
      'Problem worse in high humidity',
      'Panels at string ends most affected',
      'Gradual performance decline'
    ],
    causes: [
      'High system voltage',
      'High humidity environment',
      'Negative string voltage to ground',
      'Poor quality encapsulant',
      'Insufficient anti-PID protection',
      'Grounding configuration'
    ],
    diagnosticSteps: [
      'Measure individual panel output',
      'Compare to expected output',
      'EL imaging shows dark areas',
      'Check string polarity and grounding',
      'Review system voltage configuration',
      'Environmental assessment (humidity levels)'
    ],
    solution: 'PID is sometimes reversible by applying reverse voltage overnight. Prevention through proper system design is preferred.',
    repairProcedure: [
      'Document affected panels and power loss',
      'Apply PID recovery box (reverse voltage at night)',
      'Consider re-grounding system if transformer-based',
      'Replace severely affected panels',
      'Install string-level anti-PID devices',
      'Verify new panels are PID-resistant'
    ],
    preventionMeasures: [
      'Use PID-resistant panels (certified)',
      'Positive grounding where possible',
      'Anti-PID inverters or recovery boxes',
      'Proper encapsulant materials',
      'Reduce string voltage if possible',
      'Consider environmental conditions'
    ],
    safetyWarnings: [
      'High voltage hazard during PID recovery',
      'Work with qualified technician',
      'Follow inverter manufacturer guidelines'
    ],
    estimatedRepairTime: 'Recovery takes 1-7 nights; replacement 2-4 hours per panel',
    toolsRequired: ['IV curve tracer', 'EL camera', 'PID recovery box', 'Multimeter'],
    partsRequired: ['PID recovery device', 'Replacement panels if needed'],
    technicalNotes: 'PID-free panels are certified per IEC 62804. Recovery success varies - some damage may be permanent. N-type cells are inherently PID resistant.',
    affectsWarranty: true
  },
  {
    code: 'PNL-004',
    name: 'Delamination',
    panelTypes: ['All types'],
    brands: ['All brands'],
    severity: 'High',
    category: 'Structural',
    description: 'Separation of panel layers (glass, encapsulant, cells, backsheet) allowing moisture ingress and causing corrosion and power loss.',
    symptoms: [
      'Visible bubbles or ripples in panel surface',
      'Milky/hazy appearance in areas',
      'Moisture visible under glass',
      'Corrosion of cell contacts',
      'Yellowing of encapsulant',
      'Power output decline'
    ],
    causes: [
      'Poor manufacturing quality',
      'Inadequate encapsulant bonding',
      'Extreme temperature cycling',
      'UV degradation over time',
      'Water ingress through edges',
      'Manufacturing process errors'
    ],
    diagnosticSteps: [
      'Visual inspection for bubbles, discoloration',
      'Check edges for gaps or separation',
      'Look for moisture or corrosion',
      'Measure power output decline',
      'Document extent of delamination',
      'Check multiple panels for pattern'
    ],
    solution: 'Delamination is not repairable. Panel must be replaced. Document for warranty claim.',
    repairProcedure: [
      'Document delamination with photos',
      'Measure and record power output',
      'File warranty claim with manufacturer',
      'Replace affected panels',
      'Inspect adjacent panels',
      'Review if systemic issue'
    ],
    preventionMeasures: [
      'Purchase quality panels from reputable manufacturers',
      'Verify proper certifications',
      'Proper storage before installation',
      'Avoid panels with visible defects'
    ],
    safetyWarnings: [
      'Delaminated panels can create shock hazard',
      'Water ingress increases danger',
      'Do not operate severely delaminated panels'
    ],
    estimatedRepairTime: '1-2 hours for replacement per panel',
    toolsRequired: ['Visual inspection', 'Camera for documentation'],
    partsRequired: ['Replacement panels'],
    technicalNotes: 'Most warranties cover delamination. Good panels should not delaminate within warranty period. Often indicates manufacturing quality issue.',
    affectsWarranty: true
  },
  {
    code: 'PNL-005',
    name: 'Snail Trails',
    panelTypes: ['Monocrystalline', 'Polycrystalline'],
    brands: ['All crystalline silicon brands'],
    severity: 'Medium',
    category: 'Visual/Performance',
    description: 'Silver or dark discoloration lines on cell surface, typically following micro-crack patterns. Caused by chemical reaction with moisture and silver paste.',
    symptoms: [
      'Silver/gray/brown meandering lines on cells',
      'Lines follow crack patterns',
      'Visible from close inspection',
      'May affect aesthetics more than performance',
      'Associated power loss 3-10%'
    ],
    causes: [
      'Moisture ingress through micro-cracks',
      'Chemical reaction with silver paste',
      'Poor encapsulant quality',
      'Underlying micro-crack damage',
      'EVA containing certain additives'
    ],
    diagnosticSteps: [
      'Visual inspection for characteristic patterns',
      'Correlate with EL imaging for cracks',
      'Measure actual power output',
      'Compare to expected performance',
      'Assess extent of snail trails'
    ],
    solution: 'Snail trails indicate underlying micro-cracks. Monitor performance and claim warranty if significant degradation occurs.',
    repairProcedure: [
      'Document snail trails photographically',
      'Perform EL imaging to assess cracks',
      'Measure power output',
      'If >5% degradation, warranty claim',
      'Replace if significant power loss',
      'Monitor remaining panels'
    ],
    preventionMeasures: [
      'Use quality panels with proper EVA',
      'Proper handling to prevent micro-cracks',
      'Good mounting practices',
      'Select panels with quality certifications'
    ],
    safetyWarnings: [
      'Snail trails indicate moisture ingress',
      'Monitor for performance decline',
      'May indicate larger quality issues'
    ],
    estimatedRepairTime: '1-2 hours for inspection and documentation',
    toolsRequired: ['Camera', 'EL imaging', 'IV tracer'],
    partsRequired: ['Replacement panels if warranty approved'],
    technicalNotes: 'Snail trails are symptoms of micro-cracks plus moisture. Some power loss is typical but often within degradation tolerance.',
    affectsWarranty: true
  },
  {
    code: 'PNL-006',
    name: 'Junction Box Failure',
    panelTypes: ['All types'],
    brands: ['All brands'],
    severity: 'Critical',
    category: 'Electrical',
    description: 'Failure of the junction box including diode failure, water ingress, burned connections, or cable damage. Can cause total panel failure or fire.',
    symptoms: [
      'Panel not producing power',
      'Burn marks at junction box',
      'Melted cable insulation',
      'Water inside junction box',
      'Hot junction box during operation',
      'Intermittent power output'
    ],
    causes: [
      'Water ingress through poor sealing',
      'Bypass diode failure',
      'Loose terminal connections',
      'Manufacturing defects',
      'UV degradation of sealant',
      'Rodent damage to cables'
    ],
    diagnosticSteps: [
      'Visual inspection of junction box',
      'Check for burn marks or melting',
      'Open junction box (if serviceable) and inspect',
      'Test bypass diodes',
      'Check terminal connections',
      'Measure panel output'
    ],
    solution: 'Minor repairs may be possible for serviceable junction boxes. Severe damage requires panel replacement.',
    repairProcedure: [
      'Disconnect string and isolate panel',
      'Open junction box (if serviceable)',
      'Test and replace failed diodes',
      'Repair or replace loose connections',
      'Reseal junction box properly',
      'If non-serviceable or severely damaged, replace panel'
    ],
    preventionMeasures: [
      'Regular junction box inspection',
      'Ensure proper sealing',
      'Quality panels with IP67+ junction boxes',
      'Rodent guards on cables',
      'Annual maintenance inspections'
    ],
    safetyWarnings: [
      'Fire hazard from failed junction box',
      'Disconnect before inspection',
      'Hot junction box indicates problem',
      'Do not operate damaged junction box'
    ],
    estimatedRepairTime: '30-60 minutes for repair, 1-2 hours for replacement',
    toolsRequired: ['Screwdriver', 'Multimeter', 'Diode tester', 'Sealant', 'Replacement diodes'],
    partsRequired: ['Bypass diodes', 'Junction box sealant', 'Cable connectors'],
    technicalNotes: 'Many modern junction boxes are sealed and non-serviceable. Bypass diodes typically rated for 15-20A, Vf ~0.5V.',
    affectsWarranty: true
  },
  {
    code: 'PNL-007',
    name: 'Ground Fault',
    panelTypes: ['All types'],
    brands: ['All brands'],
    severity: 'Critical',
    category: 'Electrical Safety',
    description: 'Unintended electrical connection between panel conductors and ground (frame or mounting), creating shock hazard and potential fire risk.',
    symptoms: [
      'Inverter ground fault alarm',
      'System shutdown',
      'Low insulation resistance readings',
      'Tripped GFDI device',
      'Reduced system output',
      'Shock from equipment'
    ],
    causes: [
      'Damaged cable insulation',
      'Water ingress to conductors',
      'Crushed or pinched cables',
      'Connector failure',
      'Frame damage contacting cells',
      'Animal damage',
      'Manufacturing defect'
    ],
    diagnosticSteps: [
      'Measure string insulation resistance to ground',
      'Should be >1MΩ (typically >40MΩ when dry)',
      'Isolate strings to find affected string',
      'Isolate panels to find affected panel',
      'Visual inspection for damage',
      'Check all connectors and cable runs'
    ],
    solution: 'Locate and repair the ground fault source. May require cable replacement, connector repair, or panel replacement.',
    repairProcedure: [
      'Use insulation tester to locate fault',
      'Divide and isolate to narrow down location',
      'Inspect suspected area visually',
      'Repair damaged insulation with appropriate tape/sleeve',
      'Replace damaged cables or connectors',
      'Replace panel if internal ground fault',
      'Verify repair with insulation test'
    ],
    preventionMeasures: [
      'Proper cable management',
      'Cable clips and protection',
      'Quality connectors',
      'Regular insulation testing',
      'Rodent protection',
      'Avoid sharp edges on mounting'
    ],
    safetyWarnings: [
      'Ground faults are shock hazard',
      'Can cause fire if undetected',
      'Do not bypass ground fault protection',
      'Use proper PPE during testing',
      'Isolate before repair'
    ],
    estimatedRepairTime: '2-6 hours depending on fault location',
    toolsRequired: ['Insulation tester (megger)', 'Multimeter', 'Cable repair supplies'],
    partsRequired: ['Replacement cables', 'Connectors', 'Insulation tape/sleeves'],
    technicalNotes: 'Minimum insulation resistance is typically 1MΩ × system voltage in kV. Ground faults often worse in wet conditions. Morning dew can temporarily reduce readings.',
    affectsWarranty: false
  },
  {
    code: 'PNL-008',
    name: 'Soiling/Contamination',
    panelTypes: ['All types'],
    brands: ['All brands'],
    severity: 'Medium',
    category: 'Maintenance',
    description: 'Accumulation of dirt, dust, bird droppings, pollen, or other contamination on panel surface reducing light transmission and power output.',
    symptoms: [
      'Visible dirt/debris on panels',
      'Power output 5-25% below expected',
      'Uneven soiling patterns',
      'Hot spots from heavy localized soiling',
      'Bird droppings visible'
    ],
    causes: [
      'Environmental dust and pollution',
      'Bird droppings',
      'Pollen accumulation',
      'Nearby construction',
      'Agricultural dust',
      'Low tilt angle (poor self-cleaning)',
      'Infrequent rain'
    ],
    diagnosticSteps: [
      'Visual inspection of panel surfaces',
      'Compare output to expected/historical',
      'Check for hot spots from soiling',
      'Assess soiling pattern and source',
      'Review cleaning history'
    ],
    solution: 'Clean panels with appropriate methods and establish regular cleaning schedule.',
    repairProcedure: [
      'Clean panels early morning or late evening (cool panels)',
      'Use deionized water or appropriate cleaning solution',
      'Soft brush or squeegee - no abrasive materials',
      'Clean from top to bottom',
      'Remove bird droppings promptly (hot spot risk)',
      'Establish cleaning schedule based on environment'
    ],
    preventionMeasures: [
      'Install at optimal tilt for self-cleaning',
      'Bird deterrent systems',
      'Regular cleaning schedule',
      'Automated cleaning systems for large arrays',
      'Hydrophobic panel coatings'
    ],
    safetyWarnings: [
      'Fall hazard during cleaning',
      'Do not clean hot panels (thermal shock risk)',
      'Use proper PPE',
      'Secure roof access'
    ],
    estimatedRepairTime: '1-4 hours depending on array size',
    toolsRequired: ['Soft brush', 'Squeegee', 'DI water', 'Cleaning solution', 'Safety equipment'],
    partsRequired: ['None'],
    technicalNotes: 'Typical soiling losses 2-7% annually in moderate climates. Desert and agricultural areas may see 25%+ loss without cleaning. Rain provides some natural cleaning.',
    affectsWarranty: false
  },
  {
    code: 'PNL-009',
    name: 'LID (Light Induced Degradation)',
    panelTypes: ['Monocrystalline', 'Polycrystalline'],
    brands: ['Crystalline silicon brands'],
    severity: 'Low',
    category: 'Normal Degradation',
    description: 'Initial power loss (1-3%) in crystalline silicon panels during first hours of sun exposure due to boron-oxygen complex formation. Normal and expected.',
    symptoms: [
      'Initial power output below nameplate',
      'Stabilizes after first few days of exposure',
      'Power loss typically 1-3%',
      'Not progressive after initial period'
    ],
    causes: [
      'Boron-oxygen defect formation in P-type silicon',
      'Normal physics of crystalline silicon',
      'Higher in some cell types than others',
      'Cannot be avoided but can be minimized'
    ],
    diagnosticSteps: [
      'Measure initial power output',
      'Compare to nameplate (expect 1-3% less)',
      'Verify stabilization after 1-2 days',
      'Ongoing loss indicates other issues'
    ],
    solution: 'LID is normal and expected. No action required unless loss exceeds typical range.',
    repairProcedure: [
      'No repair needed - normal behavior',
      'Document initial performance',
      'If loss exceeds 5%, investigate other causes',
      'Panel warranties account for LID'
    ],
    preventionMeasures: [
      'N-type cells have no or very low LID',
      'Some manufacturers pre-condition panels',
      'PERC cells typically have low LID',
      'Panel specifications should account for LID'
    ],
    safetyWarnings: [
      'No safety concerns related to LID'
    ],
    estimatedRepairTime: 'N/A - normal behavior',
    toolsRequired: ['IV curve tracer for measurement'],
    partsRequired: ['None'],
    technicalNotes: 'LID is well understood and normal. N-type cells do not exhibit LID. Some manufacturers pre-expose panels to stabilize before rating.',
    affectsWarranty: false
  },
  {
    code: 'PNL-010',
    name: 'LeTID (Light and Elevated Temperature Induced Degradation)',
    panelTypes: ['PERC Monocrystalline'],
    brands: ['PERC panel manufacturers'],
    severity: 'Medium',
    category: 'Degradation',
    description: 'Power degradation in PERC cells when exposed to light and elevated temperatures, can cause 6-10% loss over first 1-2 years before stabilizing.',
    symptoms: [
      'Progressive power loss over months',
      'Worse in hot climates',
      'Affects entire panel uniformly',
      'May partially recover in winter',
      'Loss typically 3-10%'
    ],
    causes: [
      'Hydrogen-related defects in PERC cells',
      'Combination of light and heat exposure',
      'Manufacturing process variations',
      'Not fully understood mechanism'
    ],
    diagnosticSteps: [
      'Track power output over time',
      'Compare degradation to warranty curve',
      'Rule out other degradation causes',
      'Monitor seasonal variations',
      'Professional testing may be needed'
    ],
    solution: 'LeTID is permanent but limited. Modern PERC panels have improved resistance. Monitor and claim warranty if degradation exceeds limits.',
    repairProcedure: [
      'Document power output over time',
      'Compare to warranty degradation curve',
      'If exceeding warranty, file claim',
      'Consider replacement if severe',
      'No field repair possible'
    ],
    preventionMeasures: [
      'Select LeTID-tested panels',
      'Verify manufacturer quality processes',
      'N-type cells do not exhibit LeTID',
      'Some PERC processes minimize LeTID'
    ],
    safetyWarnings: [
      'No direct safety concerns',
      'Monitor for excessive degradation'
    ],
    estimatedRepairTime: 'N/A - no field repair possible',
    toolsRequired: ['IV curve tracer', 'Performance monitoring'],
    partsRequired: ['Replacement panels if warranty claim'],
    technicalNotes: 'LeTID is specific to PERC technology. Manufacturers have improved processes. Can cause 6-10% loss but stabilizes after 1-2 years. Consider LeTID-tested panels.',
    affectsWarranty: true
  },
  {
    code: 'PNL-011',
    name: 'Broken Glass',
    panelTypes: ['All glass-covered types'],
    brands: ['All brands'],
    severity: 'Critical',
    category: 'Physical Damage',
    description: 'Cracked or shattered front glass from impact, thermal stress, or manufacturing defect. Exposes cells to moisture and creates safety hazard.',
    symptoms: [
      'Visible cracks in glass surface',
      'Shattered glass pattern',
      'Moisture ingress',
      'Exposed cell material',
      'Power output may or may not be affected'
    ],
    causes: [
      'Hail impact',
      'Debris impact',
      'Thermal shock',
      'Manufacturing defect (spontaneous)',
      'Walking on panels',
      'Improper handling/installation'
    ],
    diagnosticSteps: [
      'Visual inspection for glass damage',
      'Assess extent of breakage',
      'Check for moisture ingress',
      'Measure power output',
      'Document for insurance/warranty'
    ],
    solution: 'Replace broken panels. Document for insurance or warranty claim.',
    repairProcedure: [
      'Isolate and disconnect affected panel',
      'Document damage photographically',
      'File insurance claim (weather damage)',
      'File warranty claim (manufacturing defect)',
      'Replace panel',
      'Dispose of broken panel safely'
    ],
    preventionMeasures: [
      'Proper handling during installation',
      'Hail-resistant panel selection for prone areas',
      'Do not walk on panels',
      'Protective storage',
      'Snow/debris management'
    ],
    safetyWarnings: [
      'Broken glass is cutting hazard',
      'Electrical hazard from exposed cells',
      'Do not operate broken panels',
      'Wear gloves during removal'
    ],
    estimatedRepairTime: '1-2 hours per panel replacement',
    toolsRequired: ['Safety gloves', 'Tools for panel removal', 'Camera for documentation'],
    partsRequired: ['Replacement panel'],
    technicalNotes: 'Most panels use tempered glass that shatters into small pieces. Some use reinforced glass. Glass breakage is usually covered by product warranty or homeowner insurance.',
    affectsWarranty: true
  },
  {
    code: 'PNL-012',
    name: 'Backsheet Damage',
    panelTypes: ['Panels with polymer backsheets'],
    brands: ['All brands using polymer backsheets'],
    severity: 'High',
    category: 'Structural',
    description: 'Degradation, cracking, or yellowing of the polymer backsheet exposing internal components to moisture and environmental damage.',
    symptoms: [
      'Visible cracks in backsheet',
      'Yellowing or discoloration',
      'Chalking or powdering surface',
      'Delamination from cells',
      'Moisture visible inside panel',
      'Corrosion of busbars visible through back'
    ],
    causes: [
      'UV degradation over time',
      'Poor quality backsheet material',
      'Excessive heat exposure',
      'Manufacturing defects',
      'Environmental stress cracking'
    ],
    diagnosticSteps: [
      'Visual inspection of backsheet',
      'Check for cracks, yellowing, chalking',
      'Look for moisture or corrosion',
      'Measure power output',
      'Document extent of damage'
    ],
    solution: 'Backsheet damage is not repairable. Replace affected panels and claim warranty.',
    repairProcedure: [
      'Document backsheet damage',
      'Measure and record power output',
      'File warranty claim with manufacturer',
      'Replace affected panels',
      'Check other panels of same batch'
    ],
    preventionMeasures: [
      'Select panels with quality backsheets',
      'Glass-glass panels have no backsheet',
      'Verify manufacturer quality reputation'
    ],
    safetyWarnings: [
      'Damaged backsheet creates electrical hazard',
      'Moisture ingress risk',
      'Do not operate severely damaged panels'
    ],
    estimatedRepairTime: '1-2 hours per panel replacement',
    toolsRequired: ['Visual inspection', 'Documentation camera'],
    partsRequired: ['Replacement panels'],
    technicalNotes: 'Quality backsheets should last 25+ years. TPT/TPE backsheets have known issues in some cases. Glass-glass panels eliminate backsheet failure mode.',
    affectsWarranty: true
  },
  {
    code: 'PNL-013',
    name: 'Connector Failure',
    panelTypes: ['All types'],
    brands: ['All brands'],
    severity: 'High',
    category: 'Electrical',
    description: 'Failure of MC4 or other connectors due to corrosion, water ingress, poor crimp, or mechanical damage. Can cause arcing and fire.',
    symptoms: [
      'Intermittent power output',
      'Hot connector during operation',
      'Burn marks on connector',
      'Corrosion visible in connector',
      'Melted connector housing',
      'Arc fault indication'
    ],
    causes: [
      'Water ingress from poor mating',
      'Incompatible connector brands mixed',
      'Poor crimping of connector',
      'UV degradation of housing',
      'Mechanical stress on cables',
      'Corrosion from environment'
    ],
    diagnosticSteps: [
      'Visual inspection of all connectors',
      'IR thermal imaging during operation',
      'Check for secure mating',
      'Look for corrosion or burn marks',
      'Test connection resistance'
    ],
    solution: 'Replace damaged connectors. Use compatible connectors only.',
    repairProcedure: [
      'Disconnect string before repair',
      'Cut damaged connector off cable',
      'Install new connector with proper crimp',
      'Use same brand connector throughout',
      'Verify proper insertion force',
      'Test connection before energizing'
    ],
    preventionMeasures: [
      'Use only matching connector brands',
      'Proper crimping technique',
      'Cable strain relief',
      'Regular connector inspection',
      'Quality connectors (MC4 original or certified compatible)'
    ],
    safetyWarnings: [
      'Failed connectors can cause fires',
      'Arc flash hazard',
      'Disconnect before working on connectors',
      'Do not pull on cables to disconnect'
    ],
    estimatedRepairTime: '15-30 minutes per connector',
    toolsRequired: ['MC4 crimping tool', 'Wire strippers', 'IR camera', 'Multimeter'],
    partsRequired: ['MC4 connectors (matched brand)', 'Heat shrink if needed'],
    technicalNotes: 'Never mix MC4 connector brands. Staubli and other genuine MC4 connectors are recommended. Proper crimping is critical - use manufacturer tool.',
    affectsWarranty: false
  },
  {
    code: 'PNL-014',
    name: 'EVA Browning/Yellowing',
    panelTypes: ['All types with EVA encapsulant'],
    brands: ['All brands using EVA'],
    severity: 'Medium',
    category: 'Degradation',
    description: 'Discoloration of EVA encapsulant due to UV exposure, reducing light transmission to cells and causing power loss.',
    symptoms: [
      'Yellow or brown discoloration visible',
      'Typically starts at edges or hot spots',
      'Gradual power output decline',
      'More visible in certain lighting',
      'Associated with older panels'
    ],
    causes: [
      'UV degradation of EVA over time',
      'Excessive operating temperatures',
      'Poor quality EVA formulation',
      'Hot spots accelerating degradation',
      'Normal aging in some cases'
    ],
    diagnosticSteps: [
      'Visual inspection for discoloration',
      'Compare to clean areas or new panels',
      'Measure light transmission if possible',
      'Track power output decline',
      'Assess extent of yellowing'
    ],
    solution: 'EVA browning is not repairable. Monitor power output and claim warranty if degradation exceeds limits.',
    repairProcedure: [
      'Document yellowing photographically',
      'Measure and track power output',
      'Compare to warranty degradation guarantee',
      'File warranty claim if applicable',
      'Replace panels if severe'
    ],
    preventionMeasures: [
      'Select panels with quality EVA',
      'POE encapsulant is more stable than EVA',
      'Proper system design to minimize temperatures',
      'Address hot spots promptly'
    ],
    safetyWarnings: [
      'Severely yellowed panels may have other issues',
      'Monitor for associated problems'
    ],
    estimatedRepairTime: 'N/A - not field repairable',
    toolsRequired: ['Visual inspection', 'Performance monitoring'],
    partsRequired: ['Replacement panels if warranty claim'],
    technicalNotes: 'Modern EVA formulations are more stable than older types. POE encapsulant is increasingly used for better long-term stability.',
    affectsWarranty: true
  },
  {
    code: 'PNL-015',
    name: 'Frame Damage/Corrosion',
    panelTypes: ['Framed panels'],
    brands: ['All brands'],
    severity: 'Medium',
    category: 'Structural',
    description: 'Physical damage or corrosion of aluminum panel frame affecting structural integrity or electrical grounding.',
    symptoms: [
      'Visible dents or bends in frame',
      'Corrosion or oxidation on frame',
      'Loose frame corners',
      'Frame separating from laminate',
      'Mounting difficulties',
      'Grounding concerns'
    ],
    causes: [
      'Installation damage',
      'Hail or debris impact',
      'Corrosive environment (coastal)',
      'Poor quality frame material',
      'Galvanic corrosion from dissimilar metals',
      'Improper mounting hardware'
    ],
    diagnosticSteps: [
      'Visual inspection of frame',
      'Check all corners and edges',
      'Verify frame-laminate bond',
      'Check mounting point condition',
      'Verify grounding continuity'
    ],
    solution: 'Minor damage may be acceptable. Severe damage affecting structure or grounding requires replacement.',
    repairProcedure: [
      'Assess extent of damage',
      'Minor cosmetic damage - monitor',
      'Corrosion - clean and protect if minor',
      'Severe corrosion or damage - replace panel',
      'Verify grounding after any repair'
    ],
    preventionMeasures: [
      'Proper handling during installation',
      'Use stainless steel hardware in coastal areas',
      'Avoid dissimilar metal contact',
      'Anti-corrosion treatment if needed',
      'Quality panels with anodized frames'
    ],
    safetyWarnings: [
      'Damaged frames may compromise grounding',
      'Structural integrity concerns',
      'Sharp edges from damage'
    ],
    estimatedRepairTime: '30 minutes for inspection, 1-2 hours for replacement',
    toolsRequired: ['Visual inspection', 'Grounding tester'],
    partsRequired: ['Replacement panel if needed'],
    technicalNotes: 'Aluminum frames are typically anodized for corrosion resistance. Coastal installations may need additional protection. Frame damage affecting structure is warranty issue.',
    affectsWarranty: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// THIN-FILM SPECIFIC FAULTS
// ═══════════════════════════════════════════════════════════════════════════════

export const THIN_FILM_FAULTS: PanelFault[] = [
  {
    code: 'TF-001',
    name: 'Staebler-Wronski Effect (SWE)',
    panelTypes: ['Amorphous Silicon (a-Si)', 'Thin-Film Silicon'],
    brands: ['Sharp', 'Kaneka', 'Other a-Si manufacturers'],
    severity: 'Low',
    category: 'Normal Degradation',
    description: 'Initial light-induced degradation in amorphous silicon panels, causing 10-30% power loss before stabilizing.',
    symptoms: [
      'Initial power loss 10-30% over first weeks',
      'Stabilization after 1000 hours of exposure',
      'Seasonal recovery in some cases',
      'Normal behavior for a-Si'
    ],
    causes: [
      'Metastable defects in amorphous silicon',
      'Fundamental property of a-Si material',
      'Cannot be prevented',
      'Partially reverses at high temperature (annealing)'
    ],
    diagnosticSteps: [
      'Monitor initial performance vs stabilized rating',
      'a-Si panels are rated at stabilized output',
      'Verify stabilization after 1-2 months'
    ],
    solution: 'No action needed - normal behavior. Panels are rated at stabilized output.',
    repairProcedure: [
      'No repair needed - expected behavior',
      'Verify panel rating is stabilized value',
      'Monitor for proper stabilization'
    ],
    preventionMeasures: [
      'Cannot prevent - fundamental to a-Si',
      'Select panels with stabilized ratings',
      'Size system for stabilized output'
    ],
    safetyWarnings: ['No safety concerns'],
    estimatedRepairTime: 'N/A - normal behavior',
    toolsRequired: ['Performance monitoring'],
    partsRequired: ['None'],
    technicalNotes: 'SWE is expected in a-Si panels. Manufacturers rate at stabilized output. Some recovery occurs at high temperatures. Not seen in CdTe or CIGS thin-film.',
    affectsWarranty: false
  },
  {
    code: 'TF-002',
    name: 'Moisture Ingress',
    panelTypes: ['CdTe', 'CIGS', 'a-Si'],
    brands: ['First Solar', 'Solar Frontier', 'Other thin-film'],
    severity: 'High',
    category: 'Environmental Damage',
    description: 'Water infiltration into thin-film module causing corrosion of active layers and contacts.',
    symptoms: [
      'Delamination visible',
      'Corrosion patterns',
      'Power loss progressive',
      'Edge darkening',
      'Hazy appearance'
    ],
    causes: [
      'Edge seal failure',
      'Frame seal degradation',
      'Manufacturing defects',
      'Physical damage allowing entry',
      'Extended high humidity'
    ],
    diagnosticSteps: [
      'Visual inspection for moisture signs',
      'Check edge seals',
      'Look for corrosion patterns',
      'Measure power output decline',
      'EL imaging if available'
    ],
    solution: 'Not repairable. Replace affected modules under warranty if applicable.',
    repairProcedure: [
      'Document moisture ingress',
      'File warranty claim',
      'Replace modules',
      'Inspect adjacent modules'
    ],
    preventionMeasures: [
      'Quality modules with good sealing',
      'Proper installation',
      'Avoid physical damage'
    ],
    safetyWarnings: ['Moisture creates electrical hazard'],
    estimatedRepairTime: '1-2 hours per module replacement',
    toolsRequired: ['Documentation camera'],
    partsRequired: ['Replacement modules'],
    technicalNotes: 'Thin-film technologies are more sensitive to moisture than crystalline silicon. Edge seal quality is critical.',
    affectsWarranty: true
  },
  {
    code: 'TF-003',
    name: 'Scribing Line Issues',
    panelTypes: ['CdTe', 'CIGS', 'a-Si'],
    brands: ['All thin-film manufacturers'],
    severity: 'Medium',
    category: 'Manufacturing/Performance',
    description: 'Problems with the laser scribing that separates cells in monolithic thin-film modules.',
    symptoms: [
      'Lower than expected output',
      'Shunt currents between cells',
      'Visible scribing irregularities',
      'Hot spots along scribe lines'
    ],
    causes: [
      'Manufacturing process issues',
      'Debris in scribing',
      'Laser alignment problems',
      'Material inconsistencies'
    ],
    diagnosticSteps: [
      'IV curve analysis for shunting',
      'Thermal imaging for hot scribes',
      'Compare to expected output',
      'EL imaging if available'
    ],
    solution: 'Manufacturing defect - warranty replacement.',
    repairProcedure: [
      'Document performance issue',
      'IV curve as evidence',
      'Warranty claim',
      'Replace modules'
    ],
    preventionMeasures: [
      'Quality manufacturer selection',
      'Incoming inspection of modules'
    ],
    safetyWarnings: ['No immediate safety concern'],
    estimatedRepairTime: '1-2 hours for testing and replacement',
    toolsRequired: ['IV curve tracer', 'IR camera'],
    partsRequired: ['Replacement modules'],
    technicalNotes: 'Scribing quality is critical in thin-film manufacturing. Monolithic integration requires precise laser scribing.',
    affectsWarranty: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// BIFACIAL PANEL SPECIFIC FAULTS
// ═══════════════════════════════════════════════════════════════════════════════

export const BIFACIAL_FAULTS: PanelFault[] = [
  {
    code: 'BIF-001',
    name: 'Rear Side Soiling',
    panelTypes: ['Bifacial'],
    brands: ['All bifacial panel manufacturers'],
    severity: 'Medium',
    category: 'Maintenance',
    description: 'Accumulation of dirt or debris on the rear side of bifacial panels reducing rear gain.',
    symptoms: [
      'Reduced bifacial gain',
      'Visible soiling on rear',
      'Lower than expected output',
      'Performance below bifacial factor'
    ],
    causes: [
      'Dust and dirt accumulation',
      'Low mounting height',
      'Poor ground surface',
      'Lack of rain/wind cleaning',
      'Nearby dirt sources'
    ],
    diagnosticSteps: [
      'Inspect rear of panels',
      'Compare output to expected bifacial gain',
      'Assess mounting height and ground surface'
    ],
    solution: 'Clean rear surface and optimize installation conditions.',
    repairProcedure: [
      'Clean rear surface',
      'Consider ground cover improvements',
      'Verify mounting height adequate',
      'Install at 1m+ height where possible'
    ],
    preventionMeasures: [
      'Adequate mounting height',
      'Light-colored ground cover',
      'Regular cleaning schedule'
    ],
    safetyWarnings: ['Fall hazard when cleaning'],
    estimatedRepairTime: '1-2 hours for cleaning',
    toolsRequired: ['Cleaning equipment'],
    partsRequired: ['None'],
    technicalNotes: 'Bifacial gain typically 5-30% depending on ground albedo, mounting height, and tilt. Rear soiling directly reduces gain.',
    affectsWarranty: false
  },
  {
    code: 'BIF-002',
    name: 'Albedo Mismatch',
    panelTypes: ['Bifacial'],
    brands: ['All bifacial panel manufacturers'],
    severity: 'Low',
    category: 'Design/Performance',
    description: 'Ground reflectivity lower than expected, reducing bifacial energy gain.',
    symptoms: [
      'Bifacial gain below projections',
      'Dark ground surface beneath array',
      'Seasonal variation in rear gain'
    ],
    causes: [
      'Dark roofing material',
      'Dirt ground surface',
      'Vegetation growth beneath array',
      'Shadows on ground surface',
      'Incorrect albedo in design'
    ],
    diagnosticSteps: [
      'Measure actual ground albedo',
      'Compare to design assumptions',
      'Assess ground surface',
      'Check for obstructions'
    ],
    solution: 'Improve ground albedo with white covering or adjust expectations.',
    repairProcedure: [
      'Install white ground cover',
      'Clear vegetation beneath array',
      'Remove obstructions to ground surface',
      'Adjust performance expectations'
    ],
    preventionMeasures: [
      'Accurate albedo measurement in design',
      'Ground cover selection',
      'Consider site conditions'
    ],
    safetyWarnings: ['No safety concerns'],
    estimatedRepairTime: 'Varies based on ground treatment',
    toolsRequired: ['Albedo measurement device'],
    partsRequired: ['Ground cover material if used'],
    technicalNotes: 'Typical albedo: grass 20%, concrete 30%, white membrane 60%+. Bifacial gain depends heavily on ground reflectivity.',
    affectsWarranty: false
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ALL PANEL FAULTS
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_PANEL_FAULTS: PanelFault[] = [
  ...GENERAL_PANEL_FAULTS,
  ...THIN_FILM_FAULTS,
  ...BIFACIAL_FAULTS
];

export const PANEL_CATEGORIES = [
  'Cell Damage',
  'Electrical Degradation',
  'Structural',
  'Visual/Performance',
  'Electrical',
  'Electrical Safety',
  'Maintenance',
  'Normal Degradation',
  'Degradation',
  'Physical Damage',
  'Environmental Damage',
  'Manufacturing/Performance',
  'Design/Performance'
];

// Helper functions
export function getPanelFaultByCode(code: string): PanelFault | undefined {
  return ALL_PANEL_FAULTS.find(f => f.code.toLowerCase() === code.toLowerCase());
}

export function getPanelFaultsByCategory(category: string): PanelFault[] {
  return ALL_PANEL_FAULTS.filter(f => f.category.toLowerCase() === category.toLowerCase());
}

export function getPanelFaultsBySeverity(severity: string): PanelFault[] {
  return ALL_PANEL_FAULTS.filter(f => f.severity.toLowerCase() === severity.toLowerCase());
}

export function searchPanelFaults(keyword: string): PanelFault[] {
  const term = keyword.toLowerCase();
  return ALL_PANEL_FAULTS.filter(f =>
    f.code.toLowerCase().includes(term) ||
    f.name.toLowerCase().includes(term) ||
    f.description.toLowerCase().includes(term) ||
    f.panelTypes.some(t => t.toLowerCase().includes(term))
  );
}

export function getTotalPanelFaultCount(): number {
  return ALL_PANEL_FAULTS.length;
}

export default ALL_PANEL_FAULTS;
