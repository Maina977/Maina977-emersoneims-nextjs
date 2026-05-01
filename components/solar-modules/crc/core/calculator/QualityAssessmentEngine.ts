/**
 * ✅ QUALITY & AUTHENTICITY DETECTION SYSTEM
 * 
 * Comprehensive database for:
 * - Authentic vs counterfeit product detection
 * - Brand-specific authentication markers
 * - Quality assessment guides
 * - Vendor verification
 * - Installation best practices
 */

// ==================== AUTHENTICITY DETECTION ====================

export interface AuthenticityMarker {
  name: string;
  authentic: string[];
  counterfeit: string[];
  checkMethod: string;
}

export interface ProductQualityGrade {
  product: string;
  rating: number; // 1-10
  durability: string;
  efficiency: string;
  warranty: string;
  priceRange: string;
  recommendations: string[];
  redFlags: string[];
}

// ==================== SOLAR PANEL AUTHENTICITY ====================

export const PANEL_AUTHENTICITY_MARKERS: AuthenticityMarker[] = [
  {
    name: 'Serial Number Verification',
    authentic: [
      'Series number on backsheet matches spec sheet',
      'Sequential numbering per production batch',
      'Format: [Brand]-[Year]-[Month]-[Batch]-[Number]',
      'Manufacturer can verify with serial lookup online',
    ],
    counterfeit: [
      'Serial number not matching spec sheet',
      'Repeated identical serial numbers',
      'Non-sequential numbering',
      'Manufacturer cannot find serial in database',
    ],
    checkMethod: 'Contact manufacturer with serial - they can verify production date and location',
  },
  {
    name: 'Glass Quality & Weight',
    authentic: [
      'Heavy borosilicate glass (3mm tempered)',
      'Smooth edges with no chips',
      'Uniform thickness across panel',
      'Clear, no bubbles or discoloration',
    ],
    counterfeit: [
      'Light, thin glass (may break easily)',
      'Rough or chipped edges',
      'Variable thickness',
      'Cloudy or yellow tint',
    ],
    checkMethod: 'Weigh panel - authentic 550W ≈ 22-23kg. Tap gently - should sound solid.',
  },
  {
    name: 'Backsheet & Frame',
    authentic: [
      'Rigid aluminum frame without dents',
      'Backsheet: white/clear without discoloration',
      'EVA layer even and smooth',
      'Frame markings and logo crisp',
    ],
    counterfeit: [
      'Bent or thin aluminum frame',
      'Yellow/brown backsheet discoloration',
      'Bubbles in EVA layer',
      'Blurry or rough frame markings',
    ],
    checkMethod: 'Inspect frame for straightness. Backsheet should show no yellowing. Look for bubbles in EVA.',
  },
  {
    name: 'Junction Box & Connectors',
    authentic: [
      'MC4 connectors (click-lock, no soldering)',
      'Connectors from Amphenol or Phoenix Contact',
      'Diodes clearly marked with specifications',
      'Backplane potting (black epoxy) complete and smooth',
    ],
    counterfeit: [
      'Non-standard connectors (force-fit, poor contact)',
      'Off-brand diodes or no markings',
      'Incomplete potting with gaps',
      'Loose or rattling junction box',
    ],
    checkMethod: 'Pull MC4 connectors - should require noticeable force and click. Connectors should be stamped "Amphenol".',
  },
  {
    name: 'Output Specification Match',
    authentic: [
      'Voc (open circuit voltage) ≈ 37-39V (for 550W panel)',
      'Isc (short circuit current) ≈ 15-16A',
      'Power output tolerance: ±3% (±16W for 550W)',
      'Efficiency: 20%+ for premium panels',
    ],
    counterfeit: [
      'Voc significantly lower (>30V deviation)',
      'Isc not matching specifications',
      'Power tolerance poor (actual >5% off)',
      'Efficiency too low (<18%)',
    ],
    checkMethod: 'Use solar multimeter under sunlight. Record Voc, Isc, and power. Compare to nameplate.',
  },
];

export const INVERTER_AUTHENTICITY_MARKERS: AuthenticityMarker[] = [
  {
    name: 'Internal Component Quality',
    authentic: [
      'Heavy, quality power transformer (if not switching)',
      'Larger IGBT transistors (≥30mm×15mm)',
      'Capacitors from Rubycon, Epcos, or Nichicon',
      'PCB professionally manufactured with clear solder',
    ],
    counterfeit: [
      'Flimsy internal construction',
      'Small IGBT chips (may be underpowered)',
      'No-name capacitors or dry solder joints',
      'Rough PCB with cold solder',
    ],
    checkMethod: 'Open case (if warranty allows). Inspect components. Weigh unit - authentic 5kW ≈ 60-70kg.',
  },
  {
    name: 'Display & Controls',
    authentic: [
      'Clear LCD or LED display with all modes',
      'Menu navigation is smooth and responsive',
      'Settings persist after power off',
      'Firmware version displayed and updateable',
    ],
    counterfeit: [
      'Dim or flickering display',
      'Menu lags or unresponsive buttons',
      'Settings reset after power cycle',
      'No firmware info or outdated version',
    ],
    checkMethod: 'Turn on, check display clarity. Navigate menus slowly. Power off/on to verify settings persisted.',
  },
  {
    name: 'Thermal & Acoustic Performance',
    authentic: [
      'Mild warming during operation (not >60°C)',
      'Quiet operation (fan, if any, smooth sound)',
      'No strange buzzing or clicking sounds',
      'Efficient cooling - runs cool under load',
    ],
    counterfeit: [
      'Gets very hot quickly (>70°C in minutes)',
      'Loud fan noise or grinding sounds',
      'Buzzing, clicking, or arcing sounds',
      'Poor thermal management - throttles quickly',
    ],
    checkMethod: 'Let run at load for 1 hour. Check temperature. Listen for strange sounds. Check for throttling.',
  },
  {
    name: 'Output Waveform Quality',
    authentic: [
      'Pure sine wave (THD <3%)',
      'Output voltage ±10V of 230V nominal',
      'Frequency stable at 50Hz (±0.1Hz)',
      'No audible buzzing in connected appliances',
    ],
    counterfeit: [
      'Modified sine wave (clear steps visible)',
      'Voltage fluctuates ±50V or more',
      'Frequency drifts (audible in fans)',
      'Devices buzz, motors hum, TVs flicker',
    ],
    checkMethod: 'Use oscilloscope to check waveform. Use multimeter for voltage. Listen for device buzzing.',
  },
  {
    name: 'Connector Quality & Labeling',
    authentic: [
      'Heavy, gold-plated DC connectors (Anderson PowerPole)',
      'AC connectors fully insulated and rated',
      'Labels in clear English with all specs',
      'CE/RoHS/EMC certifications visible',
    ],
    counterfeit: [
      'Thin, poor-quality connectors',
      'Unsafe AC connectors or poor insulation',
      'Labels misspelled or hard to read',
      'Missing certifications or fake logos',
    ],
    checkMethod: 'Inspect DC connectors - should require firm insertion. Check for official markings.',
  },
];

export const BATTERY_AUTHENTICITY_MARKERS: AuthenticityMarker[] = [
  {
    name: 'Cell & Pack Quality',
    authentic: [
      'Even weight distribution (no lumps)',
      'Metal casing: no rust or corrosion',
      'Terminal connections clean and tight',
      'BMS circuit board: professional solder, clear labels',
    ],
    counterfeit: [
      'Uneven weight or loose components',
      'Rust or corrosion on casing',
      'Loose or poorly soldered terminals',
      'Crude BMS with messy wiring',
    ],
    checkMethod: 'Weigh battery - authentic 48V 100Ah LiFePO4 ≈ 45-50kg. Check for rust or corrosion.',
  },
  {
    name: 'BMS Functionality',
    authentic: [
      'Balancing: all cells within 0.01V of each other',
      'Over-temperature cutoff <60°C',
      'Over-current protection: <±100A threshold',
      'Low voltage cutoff: properly adjustable',
    ],
    counterfeit: [
      'No cell balancing (wide voltage variations)',
      'No thermal protection (gets dangerously hot)',
      'Over-current threshold too high or absent',
      'No low voltage cutoff or cutoff too low',
    ],
    checkMethod: 'Use multimeter to check cell voltages (if accessible). Monitor temperature during discharge.',
  },
  {
    name: 'Capacity Verification',
    authentic: [
      'Full charge cycle reaches rated capacity ±5%',
      'Internal resistance <2 milliohms per cell',
      'Cycle life: >3000 cycles (LiFePO4) or >1000 (AGM)',
      'Self-discharge rate: <2% per month',
    ],
    counterfeit: [
      'Actual capacity 20-50% lower than rated',
      'Very high internal resistance (loses power quickly)',
      'Capacity drops rapidly with cycles',
      'Quick self-discharge (empty in weeks)',
    ],
    checkMethod: 'Run full charge-discharge cycle. Measure time to full discharge. Compare to rated Ah.',
  },
  {
    name: 'Certifications & Documentation',
    authentic: [
      'UL/CE/RoHS certifications on packaging',
      'Full spec sheet with cycle life data',
      'Warranty card with serial number',
      'QR code links to test data',
    ],
    counterfeit: [
      'No certifications or generic labels',
      'Incomplete or vague specifications',
      'No warranty card or obvious forgery',
      'Dead or fraudulent QR code links',
    ],
    checkMethod: 'Scan QR code and verify manufacturer website. Check for security features on packaging.',
  },
  {
    name: 'Temperature & Safety Performance',
    authentic: [
      'Safe in high temperatures (LiFePO4: thermally stable)',
      'No venting or puffing under stress',
      'Thermal cutoff prevents thermal runaway',
      'Safe even if punctured (LiFePO4 is non-flammable)',
    ],
    counterfeit: [
      'Overheats easily',
      'Puffs or vents gas (safety concern!)',
      'No thermal protection',
      'Fire risk if damaged (cobalt oxide cells)',
    ],
    checkMethod: 'Monitor temperature during heavy discharge. Observe for any puffing or off-gassing.',
  },
];

// ==================== PRODUCT QUALITY RATINGS ====================

export const PANEL_QUALITY_RATINGS: ProductQualityGrade[] = [
  {
    product: 'JA Solar 550W Mono',
    rating: 9.2,
    durability: 'Excellent - proven track record in harsh climates',
    efficiency: '21.5% - leading efficiency',
    warranty: '12 years product, 25 years output guarantee',
    priceRange: 'KSH 14,000-16,000',
    recommendations: [
      'Excellent choice for harsh climate (dust, sand)',
      'High reliability backed by warranty',
      'Good resale value',
      'Widely supported by technicians',
    ],
    redFlags: [],
  },
  {
    product: 'Canadian Solar 545W',
    rating: 9.0,
    durability: 'Excellent - 30+ years track record',
    efficiency: '21.3% - very high',
    warranty: '12 years product, 25 years output',
    priceRange: 'KSH 14,000-15,000',
    recommendations: [
      'Proven reliability over decades',
      'Great for East Africa (hot climate)',
      'Strong warranty support',
      'Good for large installations',
    ],
    redFlags: [],
  },
  {
    product: 'Generic 400W Panel',
    rating: 4.2,
    durability: 'Poor - may not last 5 years',
    efficiency: '18% - significantly lower',
    warranty: '1-2 years only (often not honored)',
    priceRange: 'KSH 6,000-8,000 (very cheap)',
    recommendations: [
      '❌ NOT recommended unless temporary system',
      '⚠️ High failure risk',
      '⚠️ Poor warranty support',
    ],
    redFlags: [
      '🚩 Price suspiciously low',
      '🚩 No brand recognition',
      '🚩 Limited warranty',
      '🚩 May be electrical fire hazard',
    ],
  },
];

export const INVERTER_QUALITY_RATINGS: ProductQualityGrade[] = [
  {
    product: 'Deye SUN5K-G03 5kW Hybrid',
    rating: 8.8,
    durability: 'Very good - reliable in field',
    efficiency: '96%+ AC efficiency',
    warranty: '5 years parts & labor',
    priceRange: 'KSH 80,000-90,000',
    recommendations: [
      'Excellent value for money',
      'Good warranty and support',
      'Reliable in tropical climates',
      'Professional installation available',
    ],
    redFlags: [],
  },
  {
    product: 'Solis 5kW Hybrid',
    rating: 9.1,
    durability: 'Excellent - premium build',
    efficiency: '97% AC efficiency',
    warranty: '5 years parts & labor (extendable)',
    priceRange: 'KSH 85,000-95,000',
    recommendations: [
      'Premium choice for commercial systems',
      'Excellent customer support',
      'Best thermal management',
      'Compatible with most batteries',
    ],
    redFlags: [],
  },
  {
    product: 'Generic 5kW Inverter',
    rating: 3.5,
    durability: 'Very poor - may fail in first year',
    efficiency: '85% AC efficiency (poor)',
    warranty: '1 year only',
    priceRange: 'KSH 30,000-40,000 (unrealistically cheap)',
    recommendations: [
      '❌ NOT RECOMMENDED under any circumstances',
      '⚠️ Risk of house fire',
      '⚠️ No warranty support',
      '⚠️ May damage connected equipment',
    ],
    redFlags: [
      '🚩 EXTREME RED FLAG - Price too low to be real',
      '🚩 Generic branding - no manufacturer support',
      '🚩 Documented safety failures online',
      '🚩 Modified sine wave likely (not pure)',
      '🚩 Fire hazard reported in forums',
    ],
  },
];

export const BATTERY_QUALITY_RATINGS: ProductQualityGrade[] = [
  {
    product: 'LiFePO4 48V 200Ah (9.6kWh)',
    rating: 9.3,
    durability: 'Excellent - 10+ year lifespan',
    efficiency: '98% charge/discharge efficiency',
    warranty: '10 years or 6000 cycles',
    priceRange: 'KSH 400,000-500,000',
    recommendations: [
      '✅ Best option for serious systems',
      'Safest chemistry (no thermal runaway)',
      'Most cycles (6000+)',
      'Lowest maintenance',
      'Most expensive but best value long-term',
    ],
    redFlags: [],
  },
  {
    product: 'AGM 48V 100Ah (4.8kWh)',
    rating: 6.5,
    durability: 'Good - 5-7 year lifespan',
    efficiency: '90% charge/discharge efficiency',
    warranty: '2-3 years typically',
    priceRange: 'KSH 150,000-200,000',
    recommendations: [
      'Good for smaller systems',
      'Decent warranty',
      'Easy to find locally',
      'But: heavy, needs ventilation, limited cycles',
    ],
    redFlags: [
      '⚠️ Limited cycle life (1000 cycles)',
      '⚠️ Heavy to move (50kg+)',
      '⚠️ Requires ventilation (off-gas)',
      '⚠️ Cannot deep discharge repeatedly',
    ],
  },
  {
    product: 'Generic Lead-Acid 48V 100Ah',
    rating: 2.1,
    durability: 'Very poor - 1-2 years maximum',
    efficiency: '70-80% inefficient',
    warranty: 'Often none or not honored',
    priceRange: 'KSH 60,000-80,000 (seems cheap)',
    recommendations: [
      '❌ AVOID - false economy',
      '⚠️ Will need replacement within 1 year',
      '⚠️ High failure rate reported',
      '❌ Not worth the replacement hassle',
    ],
    redFlags: [
      '🚩 Cheap price is a trap - low quality',
      '🚩 Weak plate construction (visible corrosion)',
      '🚩 Sulfate buildup common',
      '🚩 May explode if overcharged',
      '🚩 Safety risk - avoid at all costs',
    ],
  },
];

// ==================== INSTALLATION BEST PRACTICES ====================

export const INSTALLATION_BEST_PRACTICES = {
  panels: [
    '✅ Mount at optimal angle: 15-25° for East Africa',
    '✅ North-facing slope for maximum sun hours',
    '✅ Minimum 1 meter clearance from roof edge',
    '✅ Use stainless steel hardware (not aluminum, rusts faster)',
    '✅ Apply sealant to all penetrations',
    '✅ Use PV-rated MC4 connectors (not electrical tape)',
    '✅ String panels in series (not parallel if possible)',
    '✅ Use compatible breakers and disconnects',
    '✅ Ground array with 6mm copper cable',
    '✅ Inspect installation yearly for damage',
  ],
  inverter: [
    '✅ Mount in cool, well-ventilated location (<30°C ambient)',
    '✅ Keep 30cm clearance all around for air flow',
    '✅ Install AC & DC disconnects within 1 meter',
    '✅ Use appropriately sized breakers and fuses',
    '✅ Ground the inverter chassis',
    '✅ Use proper cable gauges (no undersizing)',
    '✅ Keep away from water and humidity',
    '✅ Label all connections clearly',
    '✅ Set parameters correctly before operation',
    '✅ Test safety shutdown (disconnect switches)',
  ],
  battery: [
    '✅ Mount on stable, level surface',
    '✅ Adequate ventilation to prevent gas buildup',
    '✅ Temperature controlled (15-25°C ideal)',
    '✅ Separate positive and negative terminals (isolated)',
    '✅ Use proper gauge cables (short runs)',
    '✅ Install battery monitor/BMS display',
    '✅ Never short-circuit terminals',
    '✅ Regular voltage checks (monthly)',
    '✅ Prevent overcharging and deep discharge',
    '✅ Keep clean and dry - prevent corrosion',
  ],
};

// ==================== QUALITY ASSESSMENT CLASS ====================

export class QualityAssessmentEngine {
  /**
   * Rate product authenticity (0-100)
   */
  rateAuthenticity(
    product: string,
    type: 'panel' | 'inverter' | 'battery',
    observations: Record<string, string>
  ): { score: number; verdict: string; risks: string[] } {
    let score = 100;
    const risks: string[] = [];

    const markers = type === 'panel' ? PANEL_AUTHENTICITY_MARKERS : 
                    type === 'inverter' ? INVERTER_AUTHENTICITY_MARKERS : 
                    BATTERY_AUTHENTICITY_MARKERS;

    for (const marker of markers) {
      const observation = observations[marker.name];
      if (!observation) continue;

      const obsLower = observation.toLowerCase();

      // Check if it matches authentic or counterfeit markers
      const isAuthentic = marker.authentic.some(a => obsLower.includes(a.toLowerCase()));
      const isCounterfeit = marker.counterfeit.some(c => obsLower.includes(c.toLowerCase()));

      if (isCounterfeit) {
        score -= 25;
        risks.push(`❌ ${marker.name}: ${observation}`);
      } else if (!isAuthentic) {
        score -= 10;
        risks.push(`⚠️ ${marker.name}: Unable to verify`);
      }
    }

    score = Math.max(0, Math.min(100, score));

    let verdict = 'UNKNOWN';
    if (score >= 85) verdict = '✅ AUTHENTIC - Safe to purchase';
    else if (score >= 65) verdict = '⚠️ PROBABLY AUTHENTIC - Verify further';
    else if (score >= 40) verdict = '🚩 SUSPICIOUS - Request more verification';
    else verdict = '❌ LIKELY COUNTERFEIT - DO NOT PURCHASE';

    return { score, verdict, risks };
  }

  /**
   * Get quality grade for product
   */
  getQualityGrade(product: string, type: 'panel' | 'inverter' | 'battery'): ProductQualityGrade | null {
    const ratings = type === 'panel' ? PANEL_QUALITY_RATINGS :
                    type === 'inverter' ? INVERTER_QUALITY_RATINGS :
                    BATTERY_QUALITY_RATINGS;

    return ratings.find(r => r.product.toLowerCase() === product.toLowerCase()) || null;
  }

  /**
   * Get red flags for product
   */
  getRedFlags(product: string, type: 'panel' | 'inverter' | 'battery'): string[] {
    const grade = this.getQualityGrade(product, type);
    return grade?.redFlags || [];
  }

  /**
   * Get installation best practices
   */
  getBestPractices(type: 'panel' | 'inverter' | 'battery'): string[] {
    return INSTALLATION_BEST_PRACTICES[type] || [];
  }
}

export default QualityAssessmentEngine;
