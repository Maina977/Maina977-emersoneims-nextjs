/**
 * 🤖 INTELLIGENT DIAGNOSTIC ENGINE
 * 
 * AI-powered natural language fault diagnosis system
 * - Symptom-based troubleshooting
 * - Multi-layered diagnostic logic
 * - Solution recommendations with safety notes
 * - Quality assessment and fake product detection
 * 
 * Input: "Inverter is on but no power"
 * Output: Root causes, solutions, parts, tools, safety warnings
 */

// ==================== DIAGNOSTIC DATABASE ====================

export interface DiagnosticProblem {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  equipment: string[]; // affected components
  rootCauses: RootCause[];
  diagnosticSteps: DiagnosticStep[];
  solutions: Solution[];
  preventionTips: string[];
  safetyWarnings: string[];
}

export interface RootCause {
  name: string;
  likelihood: number; // 0-1
  checkPoint: string;
  relatedComponents: string[];
}

export interface DiagnosticStep {
  step: number;
  instruction: string;
  tools?: string[];
  expectedResults: string[];
  nextIfYes?: string;
  nextIfNo?: string;
}

export interface Solution {
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeRequired: number; // minutes
  tools: string[];
  parts: string[];
  steps: string[];
  costEstimate: number;
  successRate: number; // 0-1
}

// ==================== COMPREHENSIVE DIAGNOSTIC DATABASE ====================

export const DIAGNOSTIC_DATABASE: Record<string, DiagnosticProblem> = {
  'inverter-no-power': {
    id: 'inverter-no-power',
    title: 'Inverter On But No Power Output',
    description: 'Inverter display shows active, but no AC power is available at outlets',
    keywords: ['no power', 'inverter on', 'no ac', 'no output', 'dead'],
    severity: 'critical',
    equipment: ['Inverter', 'Battery', 'AC Breaker', 'Wiring'],
    rootCauses: [
      {
        name: 'AC disconnect switch is OFF',
        likelihood: 0.4,
        checkPoint: 'Check AC disconnect breaker near inverter',
        relatedComponents: ['AC Disconnect', 'AC Breaker'],
      },
      {
        name: 'Battery voltage too low',
        likelihood: 0.3,
        checkPoint: 'Check battery voltage - should match inverter rating (24V, 48V, 96V)',
        relatedComponents: ['Battery', 'Battery Cables'],
      },
      {
        name: 'Faulty AC wiring or connections',
        likelihood: 0.2,
        checkPoint: 'Check AC output terminals for loose connections or corrosion',
        relatedComponents: ['AC Wiring', 'Terminals', 'Breaker'],
      },
      {
        name: 'Inverter fault (internal failure)',
        likelihood: 0.1,
        checkPoint: 'Check error codes on inverter display',
        relatedComponents: ['Inverter'],
      },
    ],
    diagnosticSteps: [
      {
        step: 1,
        instruction: 'Check AC disconnect switch position - should be ON (up position)',
        tools: ['Visual inspection'],
        expectedResults: ['Disconnect switch is in ON position'],
        nextIfYes: 'step2',
        nextIfNo: 'solution1',
      },
      {
        step: 2,
        instruction: 'Check battery voltage with multimeter. Should read 24V, 48V, or 96V depending on system',
        tools: ['Digital Multimeter'],
        expectedResults: ['Voltage reading within ±5V of rated voltage'],
        nextIfYes: 'step3',
        nextIfNo: 'solution2',
      },
      {
        step: 3,
        instruction: 'Check AC output terminals for loose connections - wiggle each terminal',
        tools: ['Visual inspection', 'Multimeter'],
        expectedResults: ['All terminals tight, reading 230V AC at output'],
        nextIfYes: 'success',
        nextIfNo: 'solution3',
      },
    ],
    solutions: [
      {
        title: 'Turn ON AC Disconnect Switch',
        difficulty: 'beginner',
        timeRequired: 2,
        tools: ['None'],
        parts: [],
        steps: [
          'Locate the AC disconnect switch on the wall near inverter',
          'Flip switch to ON position (typically up)',
          'Check if AC outlets have power (test with a lamp)',
          'If power restores, problem solved',
        ],
        costEstimate: 0,
        successRate: 0.95,
      },
      {
        title: 'Charge Depleted Battery',
        difficulty: 'beginner',
        timeRequired: 480, // 8 hours
        tools: ['None'],
        parts: ['Solar Panels' , 'Generator (if needed)'],
        steps: [
          'Check battery voltage with multimeter',
          'If below 20V (for 24V system), battery is deeply discharged',
          'Allow solar panels to charge (may take several hours)',
          'For faster charging, connect backup generator to inverter AC input',
          'Monitor battery voltage until it reaches rated voltage',
        ],
        costEstimate: 5000, // fuel cost
        successRate: 0.98,
      },
      {
        title: 'Tighten AC Terminal Connections',
        difficulty: 'beginner',
        timeRequired: 15,
        tools: ['Wrench (10mm, 12mm)', 'Multimeter'],
        parts: [],
        steps: [
          '⚠️ SAFETY: Turn OFF AC disconnect before touching terminals',
          'Locate AC output terminals on inverter rear panel',
          'Using wrench, tighten each terminal - should be snug but not over-tight',
          'Check for corrosion - clean with wire brush if needed',
          'Reapply thin layer of dielectric grease to connections',
          'Turn AC disconnect back ON and test',
        ],
        costEstimate: 0,
        successRate: 0.92,
      },
    ],
    preventionTips: [
      'Monthly: Check all AC/DC connections for corrosion',
      'Quarterly: Test AC output with multimeter',
      'Annually: Inspect battery terminals for tightness',
      'Weekly: Visually check inverter display for error codes',
    ],
    safetyWarnings: [
      '⚡ DANGER: Always turn OFF AC disconnect before servicing',
      '⚡ DANGER: 230V AC is present on output terminals - risk of electrocution',
      '⚡ DANGER: Do not work on terminals while power is flowing',
      '⚡ CAUTION: Battery contains hazardous voltage - respect it',
      '🧤 Wear insulated gloves when checking connections',
    ],
  },

  'inverter-not-charging': {
    id: 'inverter-not-charging',
    title: 'Inverter Not Charging Battery',
    description: 'Inverter connected to mains/generator but battery voltage is not increasing',
    keywords: ['not charging', 'charger off', 'no charge', 'battery empty'],
    severity: 'high',
    equipment: ['Inverter', 'Battery', 'AC Input', 'Charger Circuit'],
    rootCauses: [
      {
        name: 'AC input not connected or no AC available',
        likelihood: 0.35,
        checkPoint: 'Check AC mains connection and voltage',
        relatedComponents: ['AC Input', 'Mains Supply', 'Cables'],
      },
      {
        name: 'Charger circuit disabled or not active',
        likelihood: 0.3,
        checkPoint: 'Check inverter settings - charger priority may be set to "off"',
        relatedComponents: ['Inverter Settings', 'Charger Circuit'],
      },
      {
        name: 'Battery disconnected or faulty',
        likelihood: 0.2,
        checkPoint: 'Check battery connections and voltage',
        relatedComponents: ['Battery', 'Battery Cables', 'DC Switch'],
      },
      {
        name: 'Over-temperature shutdown (charger overheated)',
        likelihood: 0.15,
        checkPoint: 'Check inverter temperature and ventilation',
        relatedComponents: ['Inverter Heat Sink', 'Ventilation'],
      },
    ],
    diagnosticSteps: [
      {
        step: 1,
        instruction: 'Check if AC mains/generator is providing voltage - test with multimeter at AC input terminals',
        tools: ['Digital Multimeter'],
        expectedResults: ['Reading 220-240V AC on mains terminals'],
        nextIfYes: 'step2',
        nextIfNo: 'check-mains',
      },
      {
        step: 2,
        instruction: 'Access inverter menu and check charger settings - look for "Charger" or "AC Charger" option',
        tools: ['Inverter Control Panel'],
        expectedResults: ['Charger is set to ON or AUTO mode'],
        nextIfYes: 'step3',
        nextIfNo: 'solution-charger',
      },
      {
        step: 3,
        instruction: 'Check battery voltage - should be lower than inverter rated voltage when deeply discharged',
        tools: ['Digital Multimeter'],
        expectedResults: ['Battery voltage reading, note if it changes over 5 minutes'],
        nextIfYes: 'step4',
        nextIfNo: 'solution-battery',
      },
      {
        step: 4,
        instruction: 'Feel inverter surface - if very hot, thermal shutdown may be active',
        tools: ['Hand (caution: may be hot)'],
        expectedResults: ['Inverter is warm but not extremely hot'],
        nextIfYes: 'success',
        nextIfNo: 'solution-thermal',
      },
    ],
    solutions: [
      {
        title: 'Enable Charger in Inverter Settings',
        difficulty: 'intermediate',
        timeRequired: 10,
        tools: ['Inverter Remote or Display'],
        parts: [],
        steps: [
          'Press Menu or Settings button on inverter',
          'Navigate to "Charger Settings" or "AC Charger"',
          'Change setting from "OFF" to "ON" or "AUTO"',
          'Set charging current to desired level (e.g., 30A, 50A)',
          'Save settings',
          'Monitor battery voltage - should start increasing',
        ],
        costEstimate: 0,
        successRate: 0.88,
      },
      {
        title: 'Check AC Input Connection',
        difficulty: 'beginner',
        timeRequired: 20,
        tools: ['Multimeter', 'Wrench'],
        parts: [],
        steps: [
          'Locate AC input terminals (usually marked "AC IN" on inverter)',
          'Check for loose connections - tighten if needed',
          'Verify AC mains is reaching these terminals (test with multimeter)',
          'If no voltage, check circuit breaker in home panel',
          'Check for tripped GFCI or RCD outlets',
        ],
        costEstimate: 0,
        successRate: 0.91,
      },
      {
        title: 'Cool Down Inverter (Thermal Issue)',
        difficulty: 'beginner',
        timeRequired: 60,
        tools: ['None'],
        parts: [],
        steps: [
          'Turn OFF inverter AC disconnect switch',
          'Ensure inverter is in a cool, well-ventilated area',
          'Remove any obstructions blocking air vents',
          'Wait 30-60 minutes for inverter to cool',
          'Check that ambient temperature is within acceptable range (typically <40°C)',
          'Turn AC disconnect back ON',
          'Charger should resume operation',
        ],
        costEstimate: 0,
        successRate: 0.85,
      },
    ],
    preventionTips: [
      'Regularly monitor charger operation - it should activate when AC is available',
      'Keep inverter in cool, ventilated location',
      'Set charger priority appropriately for your needs',
      'Test AC charging monthly with mains or generator',
    ],
    safetyWarnings: [
      '⚡ DANGER: Do not work on AC terminals while power is present',
      '🔥 CAUTION: Inverter may be hot during charging - allow cooling time',
      '⚠️ WARNING: Some inverter settings affect system stability - change carefully',
    ],
  },

  'battery-not-charging': {
    id: 'battery-not-charging',
    title: 'Battery Showing Not Charging',
    description: 'Battery percentage stuck at same level, solar panels producing but not charging',
    keywords: ['battery stuck', 'no charge', 'not charging', 'stalled'],
    severity: 'high',
    equipment: ['Battery', 'MPPT Controller', 'Solar Panels', 'DC Wiring'],
    rootCauses: [
      {
        name: 'Solar panels not producing enough power',
        likelihood: 0.3,
        checkPoint: 'Check solar panel voltage and current with multimeter',
        relatedComponents: ['Solar Panels', 'PV Wiring'],
      },
      {
        name: 'MPPT controller not tracking power',
        likelihood: 0.25,
        checkPoint: 'Check MPPT display for power reading',
        relatedComponents: ['MPPT Controller', 'Combiner Box'],
      },
      {
        name: 'Battery BMS shutdown (battery management system protection)',
        likelihood: 0.25,
        checkPoint: 'Check battery display or BMS indicator lights',
        relatedComponents: ['Battery', 'BMS Circuit'],
      },
      {
        name: 'DC wiring issue or loose connections',
        likelihood: 0.2,
        checkPoint: 'Check all DC connections from PV to battery',
        relatedComponents: ['DC Wiring', 'Connectors', 'Breakers'],
      },
    ],
    diagnosticSteps: [
      {
        step: 1,
        instruction: 'Check solar panel output voltage with multimeter - should be higher than battery voltage',
        tools: ['Digital Multimeter', 'Safety glasses'],
        expectedResults: ['Voltage reading of 400-600V depending on system'],
        nextIfYes: 'step2',
        nextIfNo: 'check-panels',
      },
      {
        step: 2,
        instruction: 'Check MPPT controller display - does it show power (watts)?',
        tools: ['Visual inspection'],
        expectedResults: ['MPPT display shows power output > 0W'],
        nextIfYes: 'step3',
        nextIfNo: 'check-mppt',
      },
      {
        step: 3,
        instruction: 'Check DC connections between MPPT and battery - look for loose terminals',
        tools: ['Visual inspection', 'Multimeter'],
        expectedResults: ['All terminals tight, voltage drop < 1V'],
        nextIfYes: 'step4',
        nextIfNo: 'solution-connection',
      },
      {
        step: 4,
        instruction: 'Check if battery BMS has shutdown - look for error light or zero current',
        tools: ['Battery display', 'Visual inspection'],
        expectedResults: ['Battery accepting current, BMS active'],
        nextIfYes: 'success',
        nextIfNo: 'solution-bms',
      },
    ],
    solutions: [
      {
        title: 'Clean Solar Panels (if low production)',
        difficulty: 'beginner',
        timeRequired: 45,
        tools: ['Soft brush', 'Water', 'Squeegee', 'Safety harness'],
        parts: ['Mild soap'],
        steps: [
          'Wait until morning or late afternoon (cool panels)',
          'Safety: Use harness if panels are on roof',
          'Rinse panels with water',
          'Use soft brush with mild soap to gently clean',
          'Rinse thoroughly with clean water',
          'Dry with squeegee',
          'Check MPPT controller - power should increase',
        ],
        costEstimate: 0,
        successRate: 0.82,
      },
      {
        title: 'Reset MPPT Controller',
        difficulty: 'intermediate',
        timeRequired: 10,
        tools: ['MPPT Control Panel'],
        parts: [],
        steps: [
          'Access MPPT menu',
          'Look for "System Reset" or "Auto Search" option',
          'Activate reset - MPPT will re-scan for solar arrays',
          'Wait 2 minutes for MPPT to re-initialize',
          'Check if power tracking resumes',
          'If not, try manual voltage adjustment in settings',
        ],
        costEstimate: 0,
        successRate: 0.79,
      },
      {
        title: 'Check and Reset Battery BMS',
        difficulty: 'intermediate',
        timeRequired: 30,
        tools: ['BMS Control Panel', 'Multimeter'],
        parts: [],
        steps: [
          'Check battery BMS display for shutdown codes',
          'Common codes: Over-temperature, Over-current, Low voltage',
          'If thermal shutdown: allow battery to cool 30+ minutes',
          'If over-current: disconnect AC loads and try again',
          'If low voltage: charge from mains power first, then solar',
          'Some BMS units have manual reset button - press if visible',
        ],
        costEstimate: 0,
        successRate: 0.8,
      },
    ],
    preventionTips: [
      'Keep solar panels clean - dust reduces output by 20%+',
      'Check MPPT tracking weekly during sunny hours',
      'Monitor battery temperature - keep in 15-35°C range',
      'Avoid deep discharge cycles on LiFePO4 batteries',
    ],
    safetyWarnings: [
      '⚡ WARNING: Solar panels produce DC voltage - respect panel terminals',
      '🔥 CAUTION: Panels on roof - use safety harness and fall protection',
      '⚠️ WARNING: BMS may have high-current relay - avoid forced resets',
      '🧤 Wear gloves when handling connectors',
    ],
  },

  'overheating': {
    id: 'overheating',
    title: 'System Overheating (Inverter or Battery)',
    description: 'Inverter or battery getting hot, may be shutting down intermittently',
    keywords: ['hot', 'overheating', 'shutdown', 'temperature', 'thermal'],
    severity: 'high',
    equipment: ['Inverter', 'Battery', 'Ventilation', 'Ambient'],
    rootCauses: [
      {
        name: 'Poor ventilation or enclosed space',
        likelihood: 0.4,
        checkPoint: 'Check if inverter/battery is in enclosed cabinet',
        relatedComponents: ['Mounting Location', 'Cabinet'],
      },
      {
        name: 'High ambient temperature (hot environment)',
        likelihood: 0.3,
        checkPoint: 'Check room temperature - should be <30°C ideally',
        relatedComponents: ['Environment', 'AC/Cooling'],
      },
      {
        name: 'Heavy load causing high current',
        likelihood: 0.2,
        checkPoint: 'Check if AC appliances are running at peak',
        relatedComponents: ['Loads', 'AC Output'],
      },
      {
        name: 'Heat sink covered or blocked',
        likelihood: 0.1,
        checkPoint: 'Check inverter/battery heat sink for dust/blockage',
        relatedComponents: ['Heat Sink', 'Fan (if present)'],
      },
    ],
    diagnosticSteps: [
      {
        step: 1,
        instruction: 'Check ambient temperature with thermometer - record reading',
        tools: ['Thermometer'],
        expectedResults: ['Temperature reading between 15-35°C'],
        nextIfYes: 'step2',
        nextIfNo: 'cooling-needed',
      },
      {
        step: 2,
        instruction: 'Feel air flow around inverter - should be clear unobstructed air path',
        tools: ['None'],
        expectedResults: ['Air freely circulates around device'],
        nextIfYes: 'step3',
        nextIfNo: 'solution-ventilation',
      },
      {
        step: 3,
        instruction: 'Check for dust on heat sink - shine light at an angle to see fins',
        tools: ['Flashlight'],
        expectedResults: ['Heat sink is clean and not clogged'],
        nextIfYes: 'step4',
        nextIfNo: 'solution-dust',
      },
      {
        step: 4,
        instruction: 'Turn off non-essential AC loads and monitor temperature change',
        tools: ['Thermometer'],
        expectedResults: ['Temperature decreases over next 5 minutes'],
        nextIfYes: 'success',
        nextIfNo: 'internal-fault',
      },
    ],
    solutions: [
      {
        title: 'Improve Ventilation',
        difficulty: 'beginner',
        timeRequired: 30,
        tools: ['Drill', 'Saw', 'Ventilation fans (optional)'],
        parts: ['Ventilation grates', 'Mounting brackets'],
        steps: [
          'If inverter in cabinet: drill holes in cabinet sides',
          'Install ventilation grates to allow air flow',
          'Maintain minimum 10cm clearance on all sides',
          'Consider adding small 12V ventilation fan',
          'Direct cool air in, hot air out',
          'Monitor temperature - should drop 5-10°C',
        ],
        costEstimate: 2000,
        successRate: 0.89,
      },
      {
        title: 'Move System to Cooler Location',
        difficulty: 'intermediate',
        timeRequired: 120,
        tools: ['Movers', 'Wrenches', 'Multimeter'],
        parts: ['New mounting location needed'],
        steps: [
          'Find location with cooler ambient temperature',
          'Basement, north-facing wall, or shaded room preferred',
          'Shut down system properly before moving',
          'Carefully disconnect and move inverter/battery',
          'Reconnect all DC and AC wiring carefully',
          'Test all connections before turning back on',
        ],
        costEstimate: 5000,
        successRate: 0.92,
      },
      {
        title: 'Clean Heat Sink (if clogged)',
        difficulty: 'beginner',
        timeRequired: 20,
        tools: ['Soft brush', 'Compressed air', 'Vacuum'],
        parts: [],
        steps: [
          '⚠️ SAFETY: Turn OFF and disconnect system',
          'Use soft brush to gently remove dust from heat sink fins',
          'Use compressed air to blow out remaining dust',
          'Do NOT use liquid - may damage electronics',
          'Allow device to dry completely',
          'Turn system back on and monitor temperature',
        ],
        costEstimate: 0,
        successRate: 0.85,
      },
    ],
    preventionTips: [
      'Check ambient temperature monthly - ensure <35°C in equipment area',
      'Maintain clear ventilation paths around all equipment',
      'Clean heat sinks quarterly',
      'Avoid running at maximum capacity during peak ambient heat',
      'Install thermometer to monitor conditions',
    ],
    safetyWarnings: [
      '🔥 CAUTION: Equipment may be VERY HOT - allow cooling before touching',
      '⚡ DANGER: Turn OFF and disconnect before any maintenance',
      '💨 WARNING: Use compressed air carefully - may damage components',
      '🧤 Wear heat-resistant gloves when checking temperature',
    ],
  },

  'low-production': {
    id: 'low-production',
    title: 'Low Solar Production',
    description: 'System producing less power than expected on sunny day',
    keywords: ['low output', 'production down', 'power low', 'underperforming'],
    severity: 'medium',
    equipment: ['Solar Panels', 'MPPT', 'Inverter', 'Wiring'],
    rootCauses: [
      {
        name: 'Dirty or shaded panels',
        likelihood: 0.35,
        checkPoint: 'Visual inspection - look for dust, bird droppings, tree shade',
        relatedComponents: ['Solar Panels', 'Mounting location'],
      },
      {
        name: 'Misaligned or poorly positioned panels',
        likelihood: 0.25,
        checkPoint: 'Check panel angle and orientation',
        relatedComponents: ['Mounting structure', 'Panel angles'],
      },
      {
        name: 'Partial shading from trees or structures',
        likelihood: 0.25,
        checkPoint: 'Watch shadow movement throughout day',
        relatedComponents: ['Surrounding environment', 'Mounting height'],
      },
      {
        name: 'Wiring or connection losses',
        likelihood: 0.15,
        checkPoint: 'Check all DC connections and wiring gauges',
        relatedComponents: ['DC Wiring', 'Connectors', 'Breakers'],
      },
    ],
    diagnosticSteps: [
      {
        step: 1,
        instruction: 'Visually inspect panels for dirt, dust, or bird droppings',
        tools: ['Binoculars or ladder'],
        expectedResults: ['Panels appear relatively clean and clear'],
        nextIfYes: 'step2',
        nextIfNo: 'solution-cleaning',
      },
      {
        step: 2,
        instruction: 'Check for shadows on panels throughout the day - take photos at 9am, 12pm, 3pm',
        tools: ['Camera or visual observation'],
        expectedResults: ['No shadows on panels during peak sun hours (9am-3pm)'],
        nextIfYes: 'step3',
        nextIfNo: 'solution-shading',
      },
      {
        step: 3,
        instruction: 'Compare current production to expected production on sunny day',
        tools: ['MPPT display', 'Weather data'],
        expectedResults: ['Current production within 10% of expected'],
        nextIfYes: 'success',
        nextIfNo: 'check-wiring',
      },
    ],
    solutions: [
      {
        title: 'Clean Solar Panels',
        difficulty: 'beginner',
        timeRequired: 60,
        tools: ['Soft brush', 'Water', 'Squeegee'],
        parts: ['Mild soap'],
        steps: [
          'Choose cool part of day (early morning or late afternoon)',
          'Use ladder or elevated platform for safe access',
          'Rinse panels with water first',
          'Apply mild soap solution with soft brush',
          'Scrub gently - do NOT scratch glass',
          'Rinse thoroughly with clean water',
          'Dry with squeegee or soft cloth',
          'Production should increase 5-15% immediately',
        ],
        costEstimate: 500,
        successRate: 0.95,
      },
      {
        title: 'Trim Tree Branches (if shading)',
        difficulty: 'intermediate',
        timeRequired: 120,
        tools: ['Pruning saw', 'Ladder', 'Gloves'],
        parts: [],
        steps: [
          'Identify which trees are casting shadows',
          'Prune branches that shade panels during peak hours (9am-3pm)',
          'Try to remove shadow without cutting too much',
          'Do NOT damage tree - cut only necessary branches',
          'Monitor shadow movement after trimming',
          'May need to trim again in different seasons',
        ],
        costEstimate: 5000,
        successRate: 0.88,
      },
      {
        title: 'Reposition Solar Panels (if possible)',
        difficulty: 'advanced',
        timeRequired: 480,
        tools: ['Mounting hardware', 'Wrenches', 'Level'],
        parts: ['New mounting materials if needed'],
        steps: [
          'This is advanced - consider hiring professional',
          'Current ideal angles: typically 15-25° for most East African locations',
          'North-facing is usually optimal (if southern hemisphere)',
          'Ensure no new shading in new location',
          'May require new wiring runs',
          'System output can increase 15-25% with optimal angle',
        ],
        costEstimate: 50000,
        successRate: 0.91,
      },
    ],
    preventionTips: [
      'Clean panels every 3 months in dry climate, monthly in dusty areas',
      'Trim nearby trees each season to prevent shadow creep',
      'Monitor daily production - sudden drops indicate shading or dirt',
      'Take photos of panels monthly to spot accumulation',
    ],
    safetyWarnings: [
      '⚠️ SAFETY: Use proper ladder and fall protection if accessing roof',
      '🌞 CAUTION: Panels reflect sun - use eye protection',
      '⚡ WARNING: Panels produce power even when wet - use insulated tools',
      '🧤 Wear cut-resistant gloves when handling panel frames',
    ],
  },
};

// ==================== DIAGNOSTIC ENGINE CLASS ====================

export class DiagnosticEngine {
  /**
   * Intelligently search for matching problems from user symptom
   */
  diagnoseProblem(symptom: string): DiagnosticProblem[] {
    const symptomLower = symptom.toLowerCase();
    const matches: { problem: DiagnosticProblem; score: number }[] = [];

    for (const problem of Object.values(DIAGNOSTIC_DATABASE)) {
      let score = 0;

      // Exact title match
      if (problem.title.toLowerCase() === symptomLower) {
        score += 100;
      }

      // Keywords match
      for (const keyword of problem.keywords) {
        if (symptomLower.includes(keyword.toLowerCase())) {
          score += 20;
        }
      }

      // Description partial match
      if (problem.description.toLowerCase().includes(symptomLower)) {
        score += 15;
      }

      // Word-by-word matching
      const symptomWords = symptom.toLowerCase().split(/\s+/);
      for (const word of symptomWords) {
        if (word.length > 3) {
          if (problem.title.toLowerCase().includes(word)) score += 10;
          if (problem.description.toLowerCase().includes(word)) score += 5;
        }
      }

      if (score > 0) {
        matches.push({ problem, score });
      }
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    // Return top 3 matches
    return matches.slice(0, 3).map(m => m.problem);
  }

  /**
   * Generate detailed troubleshooting guide
   */
  generateTroubleshootingGuide(problem: DiagnosticProblem) {
    return {
      title: problem.title,
      severity: problem.severity,
      description: problem.description,
      rootCauses: problem.rootCauses,
      diagnosticSteps: problem.diagnosticSteps,
      solutions: problem.solutions,
      preventionTips: problem.preventionTips,
      safetyWarnings: problem.safetyWarnings,
    };
  }

  /**
   * Get recommended solution based on severity and difficulty
   */
  getRecommendedSolution(problem: DiagnosticProblem, userSkillLevel: 'beginner' | 'intermediate' | 'advanced'): Solution | null {
    // Filter solutions by skill level
    const suitableSolutions = problem.solutions.filter(s => {
      if (userSkillLevel === 'beginner') return s.difficulty === 'beginner';
      if (userSkillLevel === 'intermediate') return s.difficulty !== 'advanced';
      return true; // advanced user can do any
    });

    if (suitableSolutions.length === 0) return null;

    // Sort by success rate (highest first)
    suitableSolutions.sort((a, b) => b.successRate - a.successRate);

    return suitableSolutions[0];
  }

  /**
   * Get all diagnostic problems
   */
  getAllProblems(): DiagnosticProblem[] {
    return Object.values(DIAGNOSTIC_DATABASE);
  }

  /**
   * Search problems by equipment type
   */
  searchByEquipment(equipment: string): DiagnosticProblem[] {
    return Object.values(DIAGNOSTIC_DATABASE).filter(p =>
      p.equipment.some(e => e.toLowerCase().includes(equipment.toLowerCase()))
    );
  }
}

export default DiagnosticEngine;
