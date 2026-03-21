/**
 * Troubleshooting Guides Data
 *
 * SEO-optimized troubleshooting guides for common generator problems.
 * Each guide targets search queries like "generator won't start Kenya"
 * and includes step-by-step instructions with safety warnings.
 */

export interface TroubleshootingGuide {
  slug: string;
  title: string;
  description: string;
  category: 'starting' | 'electrical' | 'cooling' | 'fuel' | 'noise' | 'output';
  symptoms: string[];
  causes: { cause: string; likelihood: 'high' | 'medium' | 'low' }[];
  steps: { step: number; title: string; description: string; warning?: string }[];
  toolsNeeded: string[];
  partsNeeded: string[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  whenToCallProfessional: string[];
  relatedFaultCodes?: string[];
  seoKeywords: string[];
}

export const TROUBLESHOOTING_CATEGORIES = [
  {
    id: 'starting',
    name: 'Starting Issues',
    icon: '🔑',
    description: 'Problems getting your generator to start or stay running',
    color: 'amber',
  },
  {
    id: 'electrical',
    name: 'Electrical Problems',
    icon: '⚡',
    description: 'Power output, voltage, and electrical system issues',
    color: 'cyan',
  },
  {
    id: 'cooling',
    name: 'Cooling System',
    icon: '🌡️',
    description: 'Overheating, coolant leaks, and radiator problems',
    color: 'red',
  },
  {
    id: 'fuel',
    name: 'Fuel System',
    icon: '⛽',
    description: 'Fuel leaks, contamination, and injection issues',
    color: 'orange',
  },
  {
    id: 'noise',
    name: 'Noise & Vibration',
    icon: '🔊',
    description: 'Unusual sounds, excessive vibration, and mechanical noise',
    color: 'purple',
  },
  {
    id: 'output',
    name: 'Power Output',
    icon: '🔌',
    description: 'Low power, fluctuating output, and load issues',
    color: 'green',
  },
] as const;

export const TROUBLESHOOTING_GUIDES: TroubleshootingGuide[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // STARTING ISSUES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'generator-wont-start',
    title: "Generator Won't Start - Complete Troubleshooting Guide",
    description: "Step-by-step guide to diagnose why your generator won't start. Covers battery, fuel, and control panel issues common in Kenya.",
    category: 'starting',
    symptoms: [
      'Generator does not respond when start button is pressed',
      'No sound or clicking when trying to start',
      'Control panel is dark or unresponsive',
      'Emergency stop indicator is lit',
    ],
    causes: [
      { cause: 'Dead or weak battery', likelihood: 'high' },
      { cause: 'Emergency stop button engaged', likelihood: 'high' },
      { cause: 'No fuel or fuel valve closed', likelihood: 'high' },
      { cause: 'Faulty starter motor', likelihood: 'medium' },
      { cause: 'Blown control panel fuse', likelihood: 'medium' },
      { cause: 'Corroded battery terminals', likelihood: 'medium' },
      { cause: 'Faulty ignition switch', likelihood: 'low' },
      { cause: 'Control module failure', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Check Emergency Stop',
        description: 'Ensure the emergency stop button is released. Most generators have a red mushroom-shaped button that must be twisted or pulled to release.',
        warning: 'Do not bypass the emergency stop - it is a critical safety feature.',
      },
      {
        step: 2,
        title: 'Verify Fuel Supply',
        description: 'Check the fuel tank level and ensure the fuel valve is open. Look for the fuel shutoff valve near the fuel tank or fuel filter and make sure it is in the "ON" position.',
      },
      {
        step: 3,
        title: 'Test Battery Voltage',
        description: 'Use a multimeter to test battery voltage. A healthy 12V battery should read 12.4-12.8V. Below 12V indicates a weak or dead battery that needs charging or replacement.',
        warning: 'Remove jewelry and wear insulated gloves when working with batteries.',
      },
      {
        step: 4,
        title: 'Inspect Battery Terminals',
        description: 'Check for white or green corrosion on battery terminals. Clean with a wire brush and baking soda solution if needed. Ensure terminals are tight and secure.',
      },
      {
        step: 5,
        title: 'Check Control Panel',
        description: 'Look for fault codes or warning lights on the controller display. Note any error codes displayed - these can be looked up in the Generator Oracle tool.',
      },
      {
        step: 6,
        title: 'Test Starter Motor',
        description: 'Turn the key or press start and listen for the starter motor. A clicking sound with no cranking usually indicates a dead battery. Complete silence may indicate a starter motor fault.',
      },
      {
        step: 7,
        title: 'Inspect Fuses',
        description: 'Locate and check all fuses in the control panel. Replace any blown fuses with the same amperage rating.',
        warning: 'Always replace fuses with the correct amperage rating - never use a higher rated fuse.',
      },
    ],
    toolsNeeded: [
      'Multimeter',
      'Wire brush',
      'Adjustable wrench',
      'Screwdriver set',
      'Flashlight',
    ],
    partsNeeded: [
      'Replacement fuses (assorted)',
      'Battery terminal cleaner',
      'Dielectric grease',
    ],
    estimatedTime: '15-45 minutes',
    difficulty: 'easy',
    whenToCallProfessional: [
      'Starter motor needs replacement',
      'Control module shows internal fault codes',
      'Battery keeps dying despite being charged',
      'Electrical wiring is damaged or burned',
    ],
    relatedFaultCodes: ['E001', 'E002', 'E003', 'E051', 'E101'],
    seoKeywords: ['generator wont start Kenya', 'generator not starting', 'generator dead battery', 'generator no power'],
  },

  {
    slug: 'generator-cranks-but-wont-start',
    title: 'Generator Cranks But Will Not Start - Fuel & Air System Guide',
    description: 'Diagnose why your generator cranks normally but fails to fire. Common causes include air in fuel lines, clogged filters, and injection problems.',
    category: 'starting',
    symptoms: [
      'Starter motor turns engine but it will not fire',
      'Engine cranks strongly but does not catch',
      'Brief firing attempts then stops',
      'Exhaust shows no smoke when cranking',
    ],
    causes: [
      { cause: 'Air in fuel lines', likelihood: 'high' },
      { cause: 'Clogged fuel filter', likelihood: 'high' },
      { cause: 'Empty fuel tank', likelihood: 'high' },
      { cause: 'Contaminated fuel', likelihood: 'medium' },
      { cause: 'Faulty fuel lift pump', likelihood: 'medium' },
      { cause: 'Injection pump failure', likelihood: 'low' },
      { cause: 'Low compression', likelihood: 'low' },
      { cause: 'Timing out of adjustment', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Verify Fuel Level',
        description: 'Check the fuel gauge and visually inspect the tank. Even if the gauge shows fuel, tanks can have sediment that blocks the pickup tube.',
      },
      {
        step: 2,
        title: 'Check Fuel Quality',
        description: 'Drain a small sample from the water separator or filter bowl. Look for water droplets (separate layer at bottom), dark discoloration, or unusual smell.',
        warning: 'Collect fuel in an approved container and dispose of properly. Do not allow fuel to contact skin.',
      },
      {
        step: 3,
        title: 'Bleed Fuel System',
        description: 'Locate the fuel system bleed points (usually on the fuel filter and injection pump). Open bleed screws and operate the manual priming lever until clear fuel flows without bubbles.',
      },
      {
        step: 4,
        title: 'Inspect Fuel Filter',
        description: 'Check if the fuel filter is clogged. A dirty filter will be dark and contaminated. Replace if in doubt - filters are inexpensive compared to injection pump damage.',
      },
      {
        step: 5,
        title: 'Test Fuel Lift Pump',
        description: 'Disconnect the fuel line at the filter inlet. Operate the manual priming lever - fuel should flow steadily. No flow indicates a faulty lift pump.',
      },
      {
        step: 6,
        title: 'Check Air Filter',
        description: 'A severely clogged air filter can prevent starting. Remove and inspect - replace if dirty or damaged. Never run the engine without an air filter.',
        warning: 'Dust ingestion can cause rapid engine wear. Always ensure the air filter is properly installed.',
      },
      {
        step: 7,
        title: 'Verify Compression',
        description: 'For advanced diagnosis, use a compression gauge. Diesel engines need 350-400 PSI for reliable starting. Low compression indicates internal wear.',
      },
    ],
    toolsNeeded: [
      'Fuel sample container',
      'Wrench set',
      'Fuel line clamps',
      'Clean rags',
      'Compression gauge (optional)',
    ],
    partsNeeded: [
      'Fuel filter element',
      'Fuel filter O-rings',
      'Bleed screw washers',
    ],
    estimatedTime: '30-90 minutes',
    difficulty: 'medium',
    whenToCallProfessional: [
      'Injection pump needs repair or calibration',
      'Low compression across multiple cylinders',
      'Timing needs adjustment',
      'Fuel contamination is severe',
    ],
    relatedFaultCodes: ['E011', 'E012', 'E151', 'E152', 'E311'],
    seoKeywords: ['generator cranks but wont start', 'generator fuel problems', 'diesel generator not firing', 'generator air in fuel'],
  },

  {
    slug: 'generator-starts-then-stops',
    title: 'Generator Starts Then Stops Immediately - Shutdown Causes',
    description: 'Why your generator starts briefly then shuts down. Diagnose fuel delivery, safety shutdowns, and sensor issues.',
    category: 'starting',
    symptoms: [
      'Generator starts but dies within seconds',
      'Engine runs for 5-10 seconds then stops',
      'Controller shows fault after shutdown',
      'Generator hunts or surges before stopping',
    ],
    causes: [
      { cause: 'Low oil pressure shutdown', likelihood: 'high' },
      { cause: 'Fuel starvation', likelihood: 'high' },
      { cause: 'Air in fuel system', likelihood: 'high' },
      { cause: 'Faulty oil pressure sensor', likelihood: 'medium' },
      { cause: 'Blocked fuel vent', likelihood: 'medium' },
      { cause: 'Speed sensor fault', likelihood: 'medium' },
      { cause: 'Governor hunting', likelihood: 'low' },
      { cause: 'ECU safety timeout', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Check Oil Level',
        description: 'With engine stopped and on level ground, check oil level with dipstick. Oil should be between MIN and MAX marks. Low oil triggers automatic shutdown.',
        warning: 'Never run an engine with low oil - severe damage can occur within minutes.',
      },
      {
        step: 2,
        title: 'Read Fault Codes',
        description: 'Check the controller display for shutdown reason. Most controllers display the fault that triggered shutdown. Write down any codes for reference.',
      },
      {
        step: 3,
        title: 'Test Oil Pressure Sender',
        description: 'Disconnect the oil pressure sender wire. If the generator runs (with caution), the sensor may be faulty. Verify with a mechanical gauge.',
        warning: 'Only run briefly to test - do not operate without oil pressure protection.',
      },
      {
        step: 4,
        title: 'Check Fuel Tank Vent',
        description: 'A blocked fuel tank vent creates vacuum that stops fuel flow. Listen for air rushing when you open the fuel cap. Clean or replace vent if blocked.',
      },
      {
        step: 5,
        title: 'Inspect Fuel Lines',
        description: 'Look for collapsed, kinked, or cracked fuel lines. Check all connections for air leaks. A cracked fuel line can draw air into the system.',
      },
      {
        step: 6,
        title: 'Bleed Fuel System',
        description: 'Re-bleed the fuel system even if previously done. Small air pockets can cause delayed stalling.',
      },
      {
        step: 7,
        title: 'Check Speed Sensor',
        description: 'The magnetic pickup senses engine RPM. A faulty sensor may report incorrect speed, causing shutdown. Check gap and wiring connections.',
      },
    ],
    toolsNeeded: [
      'Dipstick (usually attached)',
      'Mechanical oil pressure gauge',
      'Wrench set',
      'Multimeter',
    ],
    partsNeeded: [
      'Engine oil (correct grade)',
      'Oil pressure sender',
      'Fuel line sections',
    ],
    estimatedTime: '20-60 minutes',
    difficulty: 'medium',
    whenToCallProfessional: [
      'Oil pressure is genuinely low (not sensor fault)',
      'Engine makes knocking sounds',
      'Governor cannot be adjusted',
      'ECU shows internal faults',
    ],
    relatedFaultCodes: ['E021', 'E022', 'E111', 'E112', 'E201'],
    seoKeywords: ['generator starts then stops', 'generator shuts down immediately', 'generator auto shutdown', 'generator dies after starting'],
  },

  {
    slug: 'generator-hard-to-start-cold',
    title: 'Generator Hard to Start in Cold Weather - Cold Start Guide',
    description: 'Solutions for difficult cold starts in Kenya highlands and during cold mornings. Covers glow plugs, heaters, and fuel issues.',
    category: 'starting',
    symptoms: [
      'Generator cranks slowly in cold weather',
      'Requires multiple start attempts when cold',
      'White smoke during cold cranking',
      'Starts fine when warm but struggles cold',
    ],
    causes: [
      { cause: 'Weak battery (cold reduces capacity)', likelihood: 'high' },
      { cause: 'Faulty glow plugs/intake heater', likelihood: 'high' },
      { cause: 'Wrong oil viscosity for temperature', likelihood: 'medium' },
      { cause: 'Fuel gelling (below 10C)', likelihood: 'medium' },
      { cause: 'Poor compression', likelihood: 'low' },
      { cause: 'Slow glow plug relay', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Wait for Glow Plug Cycle',
        description: 'Turn key to ON position and wait for glow plug indicator light to go off before cranking. This may take 10-30 seconds in cold weather.',
      },
      {
        step: 2,
        title: 'Test Battery Cold Cranking',
        description: 'Cold weather reduces battery capacity by up to 50%. Test battery under load - should maintain above 9.6V while cranking.',
      },
      {
        step: 3,
        title: 'Check Glow Plugs',
        description: 'Remove glow plugs and test with a multimeter. Each should show 0.5-2 ohms resistance. Infinite resistance means the glow plug is burned out.',
        warning: 'Glow plugs get extremely hot. Allow cooling time before handling.',
      },
      {
        step: 4,
        title: 'Verify Oil Grade',
        description: 'Check oil specification matches temperature range. In cold areas (below 15C), use 10W-30 or 15W-40. Thick oil makes cold starting difficult.',
      },
      {
        step: 5,
        title: 'Check for Fuel Gelling',
        description: 'In very cold conditions, diesel can gel. Look for waxy residue in fuel filter. Use winter diesel or fuel additives if needed.',
      },
      {
        step: 6,
        title: 'Install Block Heater',
        description: 'For frequent cold starts, consider installing an engine block heater. Pre-warming the engine significantly improves starting.',
      },
    ],
    toolsNeeded: [
      'Multimeter',
      'Glow plug socket',
      'Battery load tester',
      'Thermometer',
    ],
    partsNeeded: [
      'Glow plugs (set)',
      'Cold weather battery',
      'Correct grade oil',
      'Anti-gel fuel additive',
    ],
    estimatedTime: '30-120 minutes',
    difficulty: 'medium',
    whenToCallProfessional: [
      'Multiple glow plugs are failed',
      'Compression test needed',
      'Block heater installation required',
      'Injection timing adjustment needed',
    ],
    relatedFaultCodes: ['E031', 'E032', 'E033', 'E131'],
    seoKeywords: ['generator cold start problem', 'generator hard to start cold', 'generator wont start cold weather', 'diesel generator cold morning'],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ELECTRICAL PROBLEMS
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'generator-no-power-output',
    title: 'Generator Running But No Power Output - Electrical Guide',
    description: 'Diagnose why your generator runs but produces no electricity. Covers AVR, excitation, and alternator issues.',
    category: 'electrical',
    symptoms: [
      'Engine runs normally but no voltage output',
      'Voltage meter reads zero',
      'Connected equipment does not work',
      'Circuit breaker not tripped but no power',
    ],
    causes: [
      { cause: 'Tripped circuit breaker', likelihood: 'high' },
      { cause: 'Loss of residual magnetism', likelihood: 'high' },
      { cause: 'Faulty AVR (Automatic Voltage Regulator)', likelihood: 'medium' },
      { cause: 'Broken excitation wiring', likelihood: 'medium' },
      { cause: 'Faulty capacitor (on capacitor-excited units)', likelihood: 'medium' },
      { cause: 'Alternator winding failure', likelihood: 'low' },
      { cause: 'Brush wear (on brush-type alternators)', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Check Circuit Breaker',
        description: 'Locate the main output breaker and ensure it is in the ON position. Reset if tripped. Check for signs of overheating or damage.',
      },
      {
        step: 2,
        title: 'Test Output Voltage',
        description: 'Use a multimeter on AC voltage setting. Measure between output terminals. Should read close to rated voltage (220V single phase, 380-415V three phase).',
        warning: 'Generator output voltage can be lethal. Use properly insulated probes and stand on dry insulating surface.',
      },
      {
        step: 3,
        title: 'Check Residual Magnetism',
        description: 'If voltage is zero and AVR tests good, residual magnetism may be lost. This requires "flashing the field" with a 12V battery - procedure varies by model.',
      },
      {
        step: 4,
        title: 'Inspect AVR',
        description: 'Locate the AVR (usually in alternator terminal box or control panel). Check for burned components, loose wires, or damaged circuit board.',
      },
      {
        step: 5,
        title: 'Test Excitation Circuit',
        description: 'Measure voltage at AVR input and output terminals. Refer to service manual for expected values. Broken wiring will show infinite resistance.',
      },
      {
        step: 6,
        title: 'Check Brushes (Brush-Type)',
        description: 'On brush-type alternators, worn brushes prevent excitation. Check brush length against service limit. Replace if worn below minimum.',
      },
      {
        step: 7,
        title: 'Inspect Alternator Windings',
        description: 'Use a megger or insulation tester to check winding condition. Low insulation resistance indicates winding failure requiring rewinding.',
        warning: 'Disconnect all electronics before megger testing - high voltage can damage sensitive equipment.',
      },
    ],
    toolsNeeded: [
      'Multimeter',
      'Insulation tester (megger)',
      'Screwdriver set',
      '12V battery and cables (for flashing)',
    ],
    partsNeeded: [
      'AVR (model-specific)',
      'Brush set',
      'Excitation capacitor',
    ],
    estimatedTime: '30-90 minutes',
    difficulty: 'hard',
    whenToCallProfessional: [
      'AVR replacement required',
      'Alternator rewinding needed',
      'Complex excitation circuit faults',
      'You are not comfortable with high voltage',
    ],
    relatedFaultCodes: ['E041', 'E042', 'E241', 'E242', 'E243'],
    seoKeywords: ['generator no power output', 'generator running no electricity', 'generator no voltage', 'generator AVR fault'],
  },

  {
    slug: 'generator-voltage-fluctuating',
    title: 'Generator Voltage Fluctuating - Unstable Power Output',
    description: 'Fix unstable voltage that damages sensitive equipment. Diagnose AVR, governor, and load issues.',
    category: 'electrical',
    symptoms: [
      'Lights dim and brighten rhythmically',
      'Voltage meter needle swings',
      'Equipment showing voltage errors',
      'UPS systems reporting unstable input',
    ],
    causes: [
      { cause: 'Governor hunting/surging', likelihood: 'high' },
      { cause: 'AVR out of adjustment', likelihood: 'high' },
      { cause: 'Unbalanced three-phase load', likelihood: 'medium' },
      { cause: 'Loose wiring connections', likelihood: 'medium' },
      { cause: 'Engine speed fluctuations', likelihood: 'medium' },
      { cause: 'Faulty AVR sensing circuit', likelihood: 'low' },
      { cause: 'Alternator winding issues', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Check Engine Speed',
        description: 'Voltage and frequency are linked to engine RPM. Use a tachometer to verify stable 1500 RPM (50Hz) or 1800 RPM (60Hz). Fluctuating RPM causes voltage fluctuations.',
      },
      {
        step: 2,
        title: 'Verify Load Balance',
        description: 'On three-phase systems, measure current on each phase. Phases should be balanced within 10%. Large imbalance causes voltage issues.',
      },
      {
        step: 3,
        title: 'Check Load Percentage',
        description: 'Generators perform best at 50-80% load. Very light loads (below 30%) can cause hunting. Try adding load or adjusting governor.',
      },
      {
        step: 4,
        title: 'Inspect AVR Settings',
        description: 'Locate AVR adjustment potentiometers (usually marked VOLTAGE and STABILITY). Small adjustments can improve stability. Turn slowly and observe effect.',
        warning: 'Mark original positions before adjusting. Incorrect settings can damage equipment.',
      },
      {
        step: 5,
        title: 'Check Governor Linkage',
        description: 'Inspect the mechanical linkage between governor and fuel rack. Worn or loose linkage causes hunting. Check for worn bushings and loose fasteners.',
      },
      {
        step: 6,
        title: 'Test Under Different Loads',
        description: 'Document voltage at no load, 25%, 50%, 75%, and 100% load. This helps identify if issue is load-related or constant.',
      },
    ],
    toolsNeeded: [
      'Multimeter',
      'Clamp ammeter',
      'Tachometer',
      'Small screwdriver (for adjustments)',
    ],
    partsNeeded: [
      'Governor springs',
      'Linkage bushings',
      'AVR if faulty',
    ],
    estimatedTime: '30-60 minutes',
    difficulty: 'medium',
    whenToCallProfessional: [
      'Governor requires calibration',
      'AVR needs replacement',
      'Problem persists after adjustments',
      'Alternator testing required',
    ],
    relatedFaultCodes: ['E043', 'E044', 'E244', 'E321'],
    seoKeywords: ['generator voltage fluctuating', 'generator unstable power', 'generator power surging', 'generator voltage drops'],
  },

  {
    slug: 'generator-tripping-breaker',
    title: 'Generator Keeps Tripping Circuit Breaker - Overload Guide',
    description: 'Why your generator breaker keeps tripping and how to fix it. Diagnose overloading, short circuits, and breaker faults.',
    category: 'electrical',
    symptoms: [
      'Circuit breaker trips under load',
      'Breaker trips immediately on starting equipment',
      'Random breaker trips during operation',
      'Breaker feels hot to touch',
    ],
    causes: [
      { cause: 'Overload - connected load exceeds capacity', likelihood: 'high' },
      { cause: 'High inrush current from motors', likelihood: 'high' },
      { cause: 'Short circuit in connected equipment', likelihood: 'medium' },
      { cause: 'Faulty/worn circuit breaker', likelihood: 'medium' },
      { cause: 'Loose breaker connections', likelihood: 'medium' },
      { cause: 'Generator underrated for application', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Calculate Total Load',
        description: 'Add up the wattage of all connected equipment. Include motor starting watts (3-6x running watts). Total must not exceed generator rated output.',
      },
      {
        step: 2,
        title: 'Reduce Load',
        description: 'Disconnect some equipment and test. Start with highest-power items. If breaker holds, you were overloaded.',
      },
      {
        step: 3,
        title: 'Check for Short Circuits',
        description: 'Disconnect all loads. Reset breaker and run generator. If it holds, reconnect equipment one by one to identify faulty item.',
        warning: 'A short circuit can cause fire. Disconnect faulty equipment immediately.',
      },
      {
        step: 4,
        title: 'Inspect Breaker Connections',
        description: 'With generator off, check breaker terminal connections. Loose connections cause heat and nuisance tripping. Tighten to specification.',
      },
      {
        step: 5,
        title: 'Test Breaker',
        description: 'Check if breaker trips at rated current using a clamp meter. A failing breaker may trip below its rating.',
      },
      {
        step: 6,
        title: 'Stagger Motor Starts',
        description: 'Start large motors one at a time with delays. Air conditioners and pumps have high starting current that can trip breakers if started simultaneously.',
      },
    ],
    toolsNeeded: [
      'Clamp ammeter',
      'Multimeter',
      'Screwdriver',
      'Calculator',
    ],
    partsNeeded: [
      'Replacement breaker (if faulty)',
      'Cable lugs',
    ],
    estimatedTime: '15-45 minutes',
    difficulty: 'easy',
    whenToCallProfessional: [
      'Breaker replacement required',
      'Short circuit cannot be located',
      'Wiring upgrade needed',
      'Generator sizing assessment required',
    ],
    relatedFaultCodes: ['E045', 'E245', 'E246', 'E331'],
    seoKeywords: ['generator trips breaker', 'generator overload', 'generator breaker keeps tripping', 'generator circuit breaker fault'],
  },

  {
    slug: 'generator-not-charging-battery',
    title: 'Generator Not Charging Battery - Charging System Guide',
    description: 'Diagnose why your generator battery keeps going flat. Covers alternator, charging circuit, and battery issues.',
    category: 'electrical',
    symptoms: [
      'Battery voltage drops over time',
      'Battery needs frequent charging',
      'Charge indicator shows no charge',
      'Battery is dead after generator sits idle',
    ],
    causes: [
      { cause: 'Faulty battery charger/rectifier', likelihood: 'high' },
      { cause: 'Loose charging connections', likelihood: 'high' },
      { cause: 'Dead battery cells', likelihood: 'medium' },
      { cause: 'Broken charging wiring', likelihood: 'medium' },
      { cause: 'Auxiliary alternator failure', likelihood: 'low' },
      { cause: 'Excessive parasitic draw', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Test Battery Condition',
        description: 'Use a battery tester or hydrometer to check cell condition. One bad cell means the battery needs replacement regardless of charging system.',
      },
      {
        step: 2,
        title: 'Check Charging Voltage',
        description: 'With engine running, measure voltage across battery terminals. Should read 13.8-14.4V for a 12V system. Lower indicates charging problem.',
      },
      {
        step: 3,
        title: 'Inspect Connections',
        description: 'Check all wiring from charging source to battery. Look for corrosion, loose terminals, or damaged wires. Clean and tighten as needed.',
      },
      {
        step: 4,
        title: 'Test Charger Output',
        description: 'Locate the battery charger (usually in control panel or engine-mounted). Measure DC output voltage - should be 13.8-14.4V.',
      },
      {
        step: 5,
        title: 'Check for Parasitic Draw',
        description: 'With engine off, measure current flow from battery. More than 50mA indicates excessive draw from controller or accessories.',
      },
      {
        step: 6,
        title: 'Verify Fuses',
        description: 'Check charging circuit fuses. A blown fuse in the charging line will prevent battery charging.',
      },
    ],
    toolsNeeded: [
      'Multimeter',
      'Battery tester',
      'Wire brush',
      'Wrench set',
    ],
    partsNeeded: [
      'Battery charger',
      'Battery',
      'Charging fuses',
      'Battery cables',
    ],
    estimatedTime: '20-60 minutes',
    difficulty: 'medium',
    whenToCallProfessional: [
      'Charger replacement required',
      'Auxiliary alternator testing needed',
      'Wiring repair required',
      'Parasitic draw source cannot be found',
    ],
    relatedFaultCodes: ['E046', 'E047', 'E247'],
    seoKeywords: ['generator not charging battery', 'generator battery keeps dying', 'generator charge fault', 'generator battery drain'],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // COOLING SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'generator-overheating',
    title: 'Generator Overheating - Complete Cooling System Guide',
    description: 'Prevent engine damage from overheating. Diagnose coolant, radiator, thermostat, and water pump issues.',
    category: 'cooling',
    symptoms: [
      'High temperature warning light on',
      'Temperature gauge in red zone',
      'Engine shuts down on overtemperature',
      'Coolant boiling or steaming',
      'Sweet smell from engine area',
    ],
    causes: [
      { cause: 'Low coolant level', likelihood: 'high' },
      { cause: 'Clogged radiator fins', likelihood: 'high' },
      { cause: 'Faulty thermostat stuck closed', likelihood: 'medium' },
      { cause: 'Broken fan belt', likelihood: 'medium' },
      { cause: 'Water pump failure', likelihood: 'medium' },
      { cause: 'Blocked coolant passages', likelihood: 'low' },
      { cause: 'Faulty temperature sensor', likelihood: 'low' },
      { cause: 'Head gasket failure', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Allow Engine to Cool',
        description: 'Stop the engine and let it cool for at least 30 minutes before working on cooling system. This prevents burns and allows accurate checks.',
        warning: 'Never open a hot cooling system - pressurized coolant can cause severe burns.',
      },
      {
        step: 2,
        title: 'Check Coolant Level',
        description: 'With engine cool, check coolant level in expansion tank and radiator. Top up with correct coolant mix (50/50 antifreeze and water).',
      },
      {
        step: 3,
        title: 'Inspect Radiator',
        description: 'Look for debris blocking airflow through radiator fins. Use compressed air or water to clean from inside out (reverse of airflow direction).',
      },
      {
        step: 4,
        title: 'Check Fan Belt',
        description: 'Inspect belt for cracks, glazing, or looseness. Belt should deflect about 10-15mm when pressed. Replace if damaged or adjust tension.',
      },
      {
        step: 5,
        title: 'Test Thermostat',
        description: 'Remove thermostat and place in boiling water. It should open fully. If it stays closed, replace it. Note the opening temperature stamped on it.',
      },
      {
        step: 6,
        title: 'Check Water Pump',
        description: 'With engine running, feel top and bottom radiator hoses. Both should get hot. If bottom stays cold, water may not be circulating - pump may be faulty.',
      },
      {
        step: 7,
        title: 'Look for Leaks',
        description: 'Inspect all hoses, water pump, radiator, and head gasket area for coolant leaks. A pressure test helps find small leaks.',
      },
      {
        step: 8,
        title: 'Check for Combustion Gas',
        description: 'Use a combustion leak tester to check for exhaust gases in coolant. Presence indicates head gasket failure.',
        warning: 'Continuing to run with a blown head gasket will destroy the engine.',
      },
    ],
    toolsNeeded: [
      'Coolant pressure tester',
      'Combustion leak tester',
      'Thermometer',
      'Belt tension gauge',
      'Wrench set',
    ],
    partsNeeded: [
      'Coolant/antifreeze',
      'Thermostat',
      'Fan belt',
      'Radiator hoses',
      'Hose clamps',
    ],
    estimatedTime: '30-120 minutes',
    difficulty: 'medium',
    whenToCallProfessional: [
      'Head gasket replacement needed',
      'Water pump replacement required',
      'Radiator needs repair or replacement',
      'Internal blockage suspected',
    ],
    relatedFaultCodes: ['E061', 'E062', 'E063', 'E261', 'E262'],
    seoKeywords: ['generator overheating', 'generator high temperature', 'generator cooling problem', 'generator coolant leak'],
  },

  {
    slug: 'generator-coolant-leak',
    title: 'Generator Coolant Leak - Finding and Fixing Leaks',
    description: 'How to find and repair coolant leaks before they cause overheating. Covers hoses, radiator, water pump, and gaskets.',
    category: 'cooling',
    symptoms: [
      'Coolant level keeps dropping',
      'Puddles of green/pink fluid under generator',
      'Sweet smell when engine runs',
      'White steam from engine area',
      'Overheating after running for extended time',
    ],
    causes: [
      { cause: 'Cracked or perished hoses', likelihood: 'high' },
      { cause: 'Loose hose clamps', likelihood: 'high' },
      { cause: 'Radiator leak', likelihood: 'medium' },
      { cause: 'Water pump seal failure', likelihood: 'medium' },
      { cause: 'Expansion tank crack', likelihood: 'medium' },
      { cause: 'Head gasket failure', likelihood: 'low' },
      { cause: 'Core plug failure', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Clean Engine Bay',
        description: 'Clean the engine and cooling system components so you can clearly see where any leak originates.',
      },
      {
        step: 2,
        title: 'Visual Inspection',
        description: 'Look for wet spots, white residue (dried coolant), or green/pink stains. Check all hoses, connections, radiator, and water pump.',
      },
      {
        step: 3,
        title: 'Pressure Test System',
        description: 'Use a cooling system pressure tester to pressurize the system with engine off. Watch for pressure drop and look for emerging coolant.',
      },
      {
        step: 4,
        title: 'Check Hoses',
        description: 'Feel hoses for soft spots, bulges, or cracks. Squeeze to check for internal deterioration. Check hose clamps for tightness.',
      },
      {
        step: 5,
        title: 'Inspect Radiator',
        description: 'Look for wetness around radiator tanks and core. Check for damage from debris impact. Small leaks may only show when hot.',
      },
      {
        step: 6,
        title: 'Check Water Pump',
        description: 'Look for coolant dripping from weep hole at bottom of pump. A small weep is normal; steady flow indicates seal failure.',
      },
      {
        step: 7,
        title: 'Test for Internal Leak',
        description: 'Check oil dipstick for milky discoloration (coolant mixing with oil). Check exhaust for white smoke. Either indicates head gasket failure.',
        warning: 'Do not run engine if coolant is mixing with oil - severe damage will result.',
      },
    ],
    toolsNeeded: [
      'Cooling system pressure tester',
      'Flashlight',
      'Mirror (for hard-to-see areas)',
      'Screwdriver set',
    ],
    partsNeeded: [
      'Radiator hoses',
      'Hose clamps',
      'Coolant',
      'Radiator stop-leak (temporary only)',
    ],
    estimatedTime: '30-90 minutes',
    difficulty: 'easy',
    whenToCallProfessional: [
      'Radiator repair or replacement needed',
      'Water pump replacement required',
      'Head gasket suspected',
      'Core plug replacement needed',
    ],
    relatedFaultCodes: ['E064', 'E065', 'E263'],
    seoKeywords: ['generator coolant leak', 'generator leaking coolant', 'generator antifreeze leak', 'generator water leak'],
  },

  {
    slug: 'generator-radiator-fan-not-working',
    title: 'Generator Radiator Fan Not Working - Cooling Fan Guide',
    description: 'Diagnose why your generator cooling fan is not spinning. Covers belt, motor, thermal switch, and wiring issues.',
    category: 'cooling',
    symptoms: [
      'Fan does not spin when engine is running',
      'Engine overheats at idle or low load',
      'Fan spins slowly or intermittently',
      'Unusual noise from fan area',
    ],
    causes: [
      { cause: 'Broken or loose fan belt', likelihood: 'high' },
      { cause: 'Faulty thermal switch/sensor', likelihood: 'medium' },
      { cause: 'Electric fan motor failure', likelihood: 'medium' },
      { cause: 'Damaged fan blades', likelihood: 'medium' },
      { cause: 'Fan clutch failure (if equipped)', likelihood: 'low' },
      { cause: 'Wiring or relay fault', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Check Fan Belt',
        description: 'Inspect the belt that drives the fan. Look for cracks, glazing, fraying, or breakage. Check tension - should deflect 10-15mm.',
      },
      {
        step: 2,
        title: 'Inspect Fan Blades',
        description: 'Look for cracked, bent, or missing blades. Damaged blades cause vibration and reduced airflow. Replace the entire fan if damaged.',
        warning: 'Keep hands, clothing, and tools away from fan when engine is running.',
      },
      {
        step: 3,
        title: 'Test Electric Fan (if equipped)',
        description: 'If the generator has an electric fan, check power supply at motor connector. Should have battery voltage when thermal switch activates.',
      },
      {
        step: 4,
        title: 'Check Thermal Switch',
        description: 'Locate the thermal switch in the coolant system. Test with multimeter - should close (show continuity) when coolant is hot.',
      },
      {
        step: 5,
        title: 'Test Fan Clutch',
        description: 'Some generators have a viscous fan clutch. When cold, fan should spin freely. When hot, it should be more resistant.',
      },
      {
        step: 6,
        title: 'Check Fan Relay',
        description: 'For electric fans, locate and test the relay. Swap with similar relay temporarily to test if in doubt.',
      },
    ],
    toolsNeeded: [
      'Multimeter',
      'Belt tension gauge',
      'Flashlight',
      'Wrench set',
    ],
    partsNeeded: [
      'Fan belt',
      'Thermal switch',
      'Fan motor',
      'Fan clutch',
    ],
    estimatedTime: '20-60 minutes',
    difficulty: 'medium',
    whenToCallProfessional: [
      'Fan motor replacement needed',
      'Fan clutch replacement required',
      'Wiring repair needed',
      'Belt tensioner replacement',
    ],
    relatedFaultCodes: ['E066', 'E067', 'E264', 'E265'],
    seoKeywords: ['generator fan not working', 'generator cooling fan fault', 'generator overheats no fan', 'generator fan belt broken'],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // FUEL SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'generator-fuel-leak',
    title: 'Generator Fuel Leak - Safety and Repair Guide',
    description: 'Find and fix diesel fuel leaks safely. Critical safety guide covering fuel lines, filters, injection system, and tank issues.',
    category: 'fuel',
    symptoms: [
      'Strong diesel smell',
      'Wet spots or puddles under generator',
      'Visible fuel dripping',
      'Fuel consumption higher than normal',
      'Fuel level drops when engine is off',
    ],
    causes: [
      { cause: 'Cracked or perished fuel lines', likelihood: 'high' },
      { cause: 'Loose fuel line connections', likelihood: 'high' },
      { cause: 'Fuel filter seal failure', likelihood: 'medium' },
      { cause: 'Injection line leak', likelihood: 'medium' },
      { cause: 'Tank or tank seal leak', likelihood: 'medium' },
      { cause: 'Return line failure', likelihood: 'low' },
      { cause: 'Injection pump seal failure', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Stop Engine Immediately',
        description: 'If you smell fuel or see a leak, stop the engine immediately. Fuel leaks are a serious fire hazard.',
        warning: 'Diesel fuel is flammable. No smoking, open flames, or sparks near the generator. Have a fire extinguisher ready.',
      },
      {
        step: 2,
        title: 'Ventilate the Area',
        description: 'Open enclosure doors or ensure good ventilation. Fuel vapors can accumulate and create explosion hazard.',
      },
      {
        step: 3,
        title: 'Clean the Area',
        description: 'Wipe away fuel so you can identify the source. Use absorbent materials and dispose of properly.',
      },
      {
        step: 4,
        title: 'Trace the Leak Source',
        description: 'Follow the fuel system from tank to engine. Check tank, fuel lines, filter, lift pump, injection pump, and injector lines.',
      },
      {
        step: 5,
        title: 'Check Fuel Lines',
        description: 'Inspect flexible fuel lines for cracks, hardening, or soft spots. Check metal lines for corrosion or damage. Check all connections.',
      },
      {
        step: 6,
        title: 'Inspect Fuel Filter',
        description: 'Check fuel filter housing for cracks. Ensure seal/O-ring is in good condition. Check drain valve if equipped.',
      },
      {
        step: 7,
        title: 'Check Injection Lines',
        description: 'High pressure injection lines can develop pinhole leaks. Look for wet spots or spray patterns. Never try to tighten while running.',
        warning: 'High pressure fuel spray can penetrate skin. Never use hands to check for leaks while engine is running.',
      },
    ],
    toolsNeeded: [
      'Wrench set',
      'Flashlight',
      'Clean rags',
      'Fuel-safe container',
      'Fire extinguisher',
    ],
    partsNeeded: [
      'Fuel line (correct size)',
      'Fuel line clamps',
      'Filter O-rings',
      'Injection line washers',
    ],
    estimatedTime: '30-90 minutes',
    difficulty: 'medium',
    whenToCallProfessional: [
      'Injection pump leaks',
      'Tank repair needed',
      'High pressure line replacement',
      'You cannot locate the leak',
    ],
    relatedFaultCodes: ['E071', 'E072', 'E271'],
    seoKeywords: ['generator fuel leak', 'generator diesel leak', 'generator leaking fuel', 'generator fuel line leak'],
  },

  {
    slug: 'generator-smoking-black-smoke',
    title: 'Generator Black Smoke - Causes and Solutions',
    description: 'Diagnose black smoke from generator exhaust. Indicates incomplete combustion from overload, air restriction, or injection problems.',
    category: 'fuel',
    symptoms: [
      'Black or dark gray smoke from exhaust',
      'Smoke increases under load',
      'Soot deposits on exhaust',
      'Reduced power output',
      'Increased fuel consumption',
    ],
    causes: [
      { cause: 'Overloading (load exceeds capacity)', likelihood: 'high' },
      { cause: 'Blocked air filter', likelihood: 'high' },
      { cause: 'Faulty injector (over-fueling)', likelihood: 'medium' },
      { cause: 'Injection timing off', likelihood: 'medium' },
      { cause: 'Turbocharger problems', likelihood: 'medium' },
      { cause: 'Poor fuel quality', likelihood: 'low' },
      { cause: 'Worn engine (low compression)', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Check Current Load',
        description: 'Measure actual load with clamp meter. Calculate percentage of rated capacity. Reduce load if exceeding 80% rated output.',
      },
      {
        step: 2,
        title: 'Inspect Air Filter',
        description: 'Remove and check air filter. Hold up to light - if no light passes through, it needs replacement. Clean or replace as appropriate.',
      },
      {
        step: 3,
        title: 'Check Air Intake System',
        description: 'Inspect intake ducting for blockages, collapsed hoses, or damaged components. Ensure all connections are sealed.',
      },
      {
        step: 4,
        title: 'Verify Turbo Operation',
        description: 'If turbocharged, listen for turbo spool-up under load. Check for boost leaks in charge air cooler and piping.',
      },
      {
        step: 5,
        title: 'Test Fuel Quality',
        description: 'Drain sample from water separator. Check for contamination, water, or unusual color. Use fresh fuel from reputable source.',
      },
      {
        step: 6,
        title: 'Check Exhaust Backpressure',
        description: 'Blocked exhaust systems cause black smoke. Check exhaust piping for restrictions. Measure backpressure if possible.',
      },
      {
        step: 7,
        title: 'Run Load Test',
        description: 'If smoke only appears at high load, problem may be injector or timing related. Professional diagnosis needed.',
      },
    ],
    toolsNeeded: [
      'Clamp ammeter',
      'Air filter inspection light',
      'Fuel sample container',
      'Boost pressure gauge (turbo engines)',
    ],
    partsNeeded: [
      'Air filter element',
      'Air intake hoses',
      'Fuel filter',
    ],
    estimatedTime: '20-60 minutes',
    difficulty: 'easy',
    whenToCallProfessional: [
      'Injector testing and replacement',
      'Injection timing adjustment',
      'Turbocharger diagnosis',
      'Compression test needed',
    ],
    relatedFaultCodes: ['E081', 'E082', 'E281', 'E282'],
    seoKeywords: ['generator black smoke', 'generator smoking', 'generator exhaust smoke', 'generator dark smoke'],
  },

  {
    slug: 'generator-diesel-in-oil',
    title: 'Diesel Fuel in Engine Oil - Fuel Dilution Problem',
    description: 'Diagnose fuel dilution of engine oil. Serious issue that can cause engine damage if not addressed. Covers injector and injection pump problems.',
    category: 'fuel',
    symptoms: [
      'Oil level rising instead of dropping',
      'Oil smells like diesel',
      'Oil appears thin when checked',
      'Oil pressure lower than normal',
      'Excessive engine wear',
    ],
    causes: [
      { cause: 'Leaking injector seal', likelihood: 'high' },
      { cause: 'Failed injector (stuck open)', likelihood: 'high' },
      { cause: 'Injection pump seal failure', likelihood: 'medium' },
      { cause: 'Excessive idling or light loads', likelihood: 'medium' },
      { cause: 'Worn piston rings', likelihood: 'low' },
      { cause: 'Lift pump diaphragm failure', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Confirm Fuel in Oil',
        description: 'Pull dipstick and smell - fuel contamination has distinct diesel odor. Oil may appear thinner than normal and may be over the max mark.',
        warning: 'Running engine with fuel-diluted oil causes rapid bearing wear. Stop engine until resolved.',
      },
      {
        step: 2,
        title: 'Check Oil Level Trend',
        description: 'If oil level is rising rather than dropping between changes, fuel is entering crankcase. Document levels daily to confirm.',
      },
      {
        step: 3,
        title: 'Inspect Injector Seals',
        description: 'Remove injectors and check copper sealing washers and O-rings. Damaged seals allow fuel to leak past injector into cylinder.',
      },
      {
        step: 4,
        title: 'Test Injectors',
        description: 'Have injectors tested on a test bench. A stuck-open injector will drip fuel into cylinder continuously.',
      },
      {
        step: 5,
        title: 'Check Lift Pump',
        description: 'On mechanical lift pumps with diaphragms, fuel can leak into crankcase through pump mount. Look for fuel weeping from pump.',
      },
      {
        step: 6,
        title: 'Change Oil Immediately',
        description: 'Once fuel dilution is fixed, change oil and filter immediately. Diluted oil has poor lubrication properties.',
      },
      {
        step: 7,
        title: 'Review Operating Conditions',
        description: 'Excessive idling or very light loads cause incomplete combustion, washing fuel past rings. Maintain minimum 30% load.',
      },
    ],
    toolsNeeded: [
      'Injector removal tools',
      'Oil sample container',
      'Torque wrench',
      'Clean rags',
    ],
    partsNeeded: [
      'Injector seals/washers',
      'Engine oil (correct grade)',
      'Oil filter',
      'Injectors (if faulty)',
    ],
    estimatedTime: '60-180 minutes',
    difficulty: 'hard',
    whenToCallProfessional: [
      'Injector testing and replacement',
      'Injection pump repair',
      'Engine damage assessment',
      'Lift pump replacement',
    ],
    relatedFaultCodes: ['E083', 'E084', 'E283', 'E284'],
    seoKeywords: ['diesel in engine oil', 'generator fuel in oil', 'generator oil dilution', 'generator oil smells like diesel'],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // NOISE & OTHER ISSUES
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    slug: 'generator-making-loud-noise',
    title: 'Generator Making Loud or Unusual Noise - Sound Diagnosis',
    description: 'Identify and fix abnormal generator sounds. Covers knocking, rattling, whining, and other concerning noises.',
    category: 'noise',
    symptoms: [
      'New or louder than normal sound',
      'Knocking or banging noise',
      'Whining or screaming sound',
      'Rattling or clattering',
      'Grinding noise',
    ],
    causes: [
      { cause: 'Loose bolts or panels', likelihood: 'high' },
      { cause: 'Worn or loose belt', likelihood: 'high' },
      { cause: 'Low oil level', likelihood: 'medium' },
      { cause: 'Exhaust leak', likelihood: 'medium' },
      { cause: 'Bearing failure (alternator or engine)', likelihood: 'medium' },
      { cause: 'Injector knock', likelihood: 'low' },
      { cause: 'Rod or main bearing failure', likelihood: 'low' },
      { cause: 'Loose flywheel', likelihood: 'low' },
    ],
    steps: [
      {
        step: 1,
        title: 'Identify Noise Location',
        description: 'Try to locate where noise originates. Use a mechanics stethoscope or wooden dowel to isolate sound source (touch dowel to component, other end to ear).',
        warning: 'Keep hands and tools away from moving parts. Stop engine before touching any components.',
      },
      {
        step: 2,
        title: 'Check for Loose Items',
        description: 'Inspect enclosure panels, covers, and guards. Tighten any loose bolts. Check for debris that may have fallen into enclosure.',
      },
      {
        step: 3,
        title: 'Check Oil Level',
        description: 'Low oil causes knocking sound and will quickly destroy engine. Check immediately and top up if low.',
      },
      {
        step: 4,
        title: 'Inspect Belts',
        description: 'Check fan belt, alternator belt, and any other belts. Worn belts squeal; loose belts slap. Check tension and condition.',
      },
      {
        step: 5,
        title: 'Listen to Exhaust',
        description: 'A leak in the exhaust system causes popping or ticking noise. Look for black soot deposits indicating leak location.',
      },
      {
        step: 6,
        title: 'Check Alternator',
        description: 'Spin alternator by hand (when stopped). Grinding or rough feel indicates bearing wear. Listen near alternator when running.',
      },
      {
        step: 7,
        title: 'Monitor and Document',
        description: 'If you cannot identify source, document when noise occurs (startup, under load, at idle), character of noise, and any changes. This helps diagnosis.',
      },
      {
        step: 8,
        title: 'Assess Severity',
        description: 'A new knocking sound from engine internals requires immediate shutdown and professional inspection to prevent catastrophic damage.',
        warning: 'Heavy internal knocking (rod knock) means stop immediately. Continuing to run will destroy the engine.',
      },
    ],
    toolsNeeded: [
      'Mechanics stethoscope',
      'Flashlight',
      'Wrench set',
      'Belt tension gauge',
    ],
    partsNeeded: [
      'Drive belts',
      'Engine oil',
      'Exhaust gaskets',
      'Hardware (bolts, nuts)',
    ],
    estimatedTime: '15-60 minutes',
    difficulty: 'medium',
    whenToCallProfessional: [
      'Internal engine knock',
      'Bearing replacement needed',
      'Noise source cannot be identified',
      'Unusual noise after previous repair',
    ],
    relatedFaultCodes: ['E091', 'E092', 'E291'],
    seoKeywords: ['generator loud noise', 'generator knocking sound', 'generator unusual noise', 'generator rattling noise'],
  },
];

// Helper function to get guides by category
export function getGuidesByCategory(category: string): TroubleshootingGuide[] {
  return TROUBLESHOOTING_GUIDES.filter(guide => guide.category === category);
}

// Helper function to get a single guide by slug
export function getGuideBySlug(slug: string): TroubleshootingGuide | undefined {
  return TROUBLESHOOTING_GUIDES.find(guide => guide.slug === slug);
}

// Helper function to get all slugs for static generation
export function getAllGuideSlugs(): string[] {
  return TROUBLESHOOTING_GUIDES.map(guide => guide.slug);
}

// Helper function to get related guides
export function getRelatedGuides(currentSlug: string, limit: number = 3): TroubleshootingGuide[] {
  const currentGuide = getGuideBySlug(currentSlug);
  if (!currentGuide) return [];

  return TROUBLESHOOTING_GUIDES
    .filter(guide => guide.slug !== currentSlug && guide.category === currentGuide.category)
    .slice(0, limit);
}
