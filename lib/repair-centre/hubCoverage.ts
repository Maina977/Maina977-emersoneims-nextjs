/**
 * Repair Centre — what each hub's scope list is ACTUALLY backed by.
 *
 * WHY THIS EXISTS
 * ---------------
 * Every hub page printed a "Scope" list of five to seven topics as plain text.
 * Ten of the fifteen hubs advertised more than they delivered — /repair-centre/solar
 * listed six topics and shipped two articles, and one of the topics it advertised
 * ("DC bus and isolation faults") was covered by an article filed under the
 * inverters hub, so the solar page promised it and linked nowhere.
 *
 * A page that tells a technician it covers something and then doesn't is worse
 * than a page that says nothing. This module makes the promise auditable:
 *
 *   covers      — scope label -> article slugs that genuinely cover it. Slugs may
 *                 belong to ANY hub; cross-hub coverage is the point.
 *   servicePath — the commercial page for the category, so a reader who wants it
 *                 done rather than explained has somewhere to go.
 *   siblings    — adjacent hubs, so a thin hub is not a dead end.
 *
 * A scope label with no entry in `covers` is NOT hidden. The hub page lists it
 * under a heading that says plainly it is not yet published. Declaring the gap is
 * the honest position; silently implying coverage is not.
 *
 * Enforced by scripts/audit-repair-centre.mjs (check 10): every key in `covers`
 * must be a real scope label on that hub, and every slug must be a real article.
 */

export interface HubCoverage {
  /** Scope label (verbatim from the hub's `scope` array) -> covering article slugs. */
  covers: Record<string, string[]>;
  /** Commercial service page for this category, when one exists. */
  servicePath?: string;
  /** Adjacent hubs worth offering the reader. */
  siblings: string[];
}

export const HUB_COVERAGE: Record<string, HubCoverage> = {
  generators: {
    servicePath: '/services/generator-repairs',
    siblings: ['controllers', 'fuel-systems', 'engine-systems', 'ats-changeover'],
    covers: {
      'Starting and cranking faults': [
        'generator-cranks-but-will-not-start',
        'starter-motor-clicks-but-will-not-crank',
        'generator-battery-not-charging',
      ],
      'Protective shutdowns — oil pressure, coolant temperature, overspeed': [
        'generator-low-oil-pressure-shutdown',
        'generator-overheating',
      ],
      'Output faults — no voltage, unstable voltage, frequency problems': [
        'generator-produces-no-voltage-output',
        'generator-unstable-voltage',
        'generator-avr-fault-diagnosis',
      ],
      'Fuel system diagnosis': [
        'generator-starts-then-stops',
        'diesel-fuel-contamination',
        'generator-excessive-smoke',
      ],
      'Cooling system diagnosis': ['generator-overheating'],
      'Controller and communication faults': [
        'controller-alarm-interpretation',
        'generator-starts-in-manual-not-auto',
        'j1939-spn-fmi-explained',
      ],
      'Transfer switching and load acceptance': [
        'ats-not-changing-over',
        'ats-will-not-return-to-mains',
      ],
    },
  },

  inverters: {
    servicePath: '/services/ups-systems',
    siblings: ['solar', 'ups', 'pcb-motherboards', 'industrial-electronics'],
    covers: {
      'No output': ['inverter-will-not-switch-on'],
      'Shutdown under load': ['inverter-switches-off-under-load'],
      'Charging faults': ['inverter-not-charging-batteries'],
      'DC bus faults': ['solar-inverter-dc-bus-fault'],
      'Power-stage failure': [
        'inverter-mosfet-failure-diagnosis',
        'inverter-igbt-testing-and-failure',
      ],
    },
  },

  ups: {
    servicePath: '/services/ups-systems',
    siblings: ['inverters', 'generators', 'ats-changeover', 'pcb-motherboards'],
    covers: {
      'Bypass faults': ['ups-bypass-fault'],
      'Battery and autonomy faults': ['ups-battery-replacement', 'ups-not-charging-batteries'],
      'Rectifier and inverter faults': ['ups-inverter-fault-diagnosis'],
      'Generator interaction': ['ups-on-battery-with-mains-present'],
    },
  },

  solar: {
    servicePath: '/services/solar-energy',
    siblings: ['inverters', 'ups', 'pumps', 'industrial-electronics'],
    covers: {
      'Underperformance and yield loss': ['solar-system-underperforming'],
      'Soiling, shading and vegetation': ['solar-system-underperforming'],
      'Inverter clipping and export limitation': ['solar-system-underperforming'],
      // The fix for the orphan: this article lives in the inverters hub, and the
      // solar hub advertised the topic while linking nowhere.
      'DC bus and isolation faults': ['solar-inverter-dc-bus-fault'],
      'Charge controllers and battery charging': ['solar-charge-controller-not-charging'],
    },
  },

  'ats-changeover': {
    servicePath: '/services/ats-changeover',
    siblings: ['generators', 'controllers', 'ups'],
    covers: {
      'Failure to transfer on mains loss': ['ats-not-changing-over'],
      'Failure to return to utility': ['ats-will-not-return-to-mains'],
      'Sensing, thresholds and timer settings': [
        'ats-not-changing-over',
        'ats-will-not-return-to-mains',
      ],
    },
  },

  motors: {
    servicePath: '/services/motor-rewinding',
    siblings: ['industrial-electronics', 'pumps', 'testing-tools'],
    covers: {
      'Winding failure and insulation testing': ['three-phase-motor-failure-diagnosis'],
      'Single-phasing and supply faults': ['three-phase-motor-failure-diagnosis'],
      'Overload protection and duty': ['motor-overload-tripping'],
      'Variable-speed drive interaction': ['vfd-drive-fault-diagnosis'],
      'Repair, rewind or replace': ['three-phase-motor-failure-diagnosis'],
    },
  },

  pumps: {
    servicePath: '/services/borehole-pumps',
    siblings: ['motors', 'solar', 'controllers'],
    covers: {
      'No delivery and reduced flow': ['borehole-pump-no-water-delivery'],
      'Water level, drawdown and borehole yield': ['borehole-pump-no-water-delivery'],
      'Non-return valves and rising main faults': ['borehole-pump-no-water-delivery'],
      'Dry-run protection and control': ['pump-runs-continuously'],
    },
  },

  'pcb-motherboards': {
    siblings: ['industrial-electronics', 'inverters', 'ups', 'testing-tools'],
    covers: {
      'Short-circuit location and current-limited fault finding': ['pcb-short-circuit-diagnosis'],
      'Power-rail diagnosis and sequencing': ['motherboard-power-rail-diagnosis'],
      'Component testing and failure modes': [
        'inverter-mosfet-failure-diagnosis',
        'inverter-igbt-testing-and-failure',
      ],
    },
  },

  'industrial-electronics': {
    siblings: ['motors', 'pcb-motherboards', 'inverters', 'testing-tools'],
    covers: {
      'Drive trips and fault interpretation': ['vfd-drive-fault-diagnosis'],
      'DC bus over-voltage and regeneration': [
        'vfd-drive-fault-diagnosis',
        'solar-inverter-dc-bus-fault',
      ],
      'Installation defects that destroy drives': ['vfd-drive-fault-diagnosis'],
    },
  },

  safety: {
    siblings: ['testing-tools', 'generators', 'solar', 'pcb-motherboards'],
    covers: {
      'Safe isolation and proving dead': ['safe-isolation-and-proving-dead'],
      'Lockout, tagout and multi-person working': ['safe-isolation-and-proving-dead'],
      'Multiple and hidden sources — backfeed, auto-start, PV, batteries': [
        'safe-isolation-and-proving-dead',
      ],
      'Stored energy: DC bus, capacitors, springs, pressure, heat': [
        'safe-isolation-and-proving-dead',
        'solar-inverter-dc-bus-fault',
      ],
      'Test instrument selection and proving': [
        'test-instruments-and-measurement-errors',
        'safe-isolation-and-proving-dead',
      ],
      'When to stop and escalate': ['safe-isolation-and-proving-dead'],
    },
  },

  'fuel-systems': {
    servicePath: '/services/generator-repairs',
    siblings: ['generators', 'engine-systems', 'fault-codes'],
    covers: {
      'Smoke diagnosis — black, blue and white': ['generator-excessive-smoke'],
      'Wet stacking and light-load damage': ['generator-excessive-smoke'],
      'Fuel contamination, water and filtration': ['diesel-fuel-contamination'],
      'Injection and combustion faults': ['generator-excessive-smoke'],
    },
  },

  'testing-tools': {
    siblings: ['safety', 'motors', 'pcb-motherboards', 'industrial-electronics'],
    covers: {
      'Measurement categories and instrument selection': ['test-instruments-and-measurement-errors'],
      'True-RMS versus averaging on distorted waveforms': ['test-instruments-and-measurement-errors'],
      'Ghost voltages and low-impedance mode': ['test-instruments-and-measurement-errors'],
      'AC versus DC clamp measurement': ['test-instruments-and-measurement-errors'],
      'Interpreting readings in context': ['test-instruments-and-measurement-errors'],
    },
  },

  'fault-codes': {
    siblings: ['controllers', 'generators', 'engine-systems'],
    covers: {
      'J1939 SPN and FMI structure': ['j1939-spn-fmi-explained'],
      'Separating signal faults from real conditions': [
        'j1939-spn-fmi-explained',
        'controller-alarm-interpretation',
      ],
      'Occurrence counts and code history': ['j1939-spn-fmi-explained'],
      'Engine ECM versus controller-generated codes': [
        'j1939-spn-fmi-explained',
        'controller-alarm-interpretation',
      ],
      'Why generic code lists mislead': ['j1939-spn-fmi-explained'],
      'Recording codes before clearing them': ['j1939-spn-fmi-explained'],
    },
  },

  'engine-systems': {
    servicePath: '/services/generator-repairs',
    siblings: ['generators', 'fuel-systems', 'fault-codes'],
    covers: {
      'Abnormal noise and knock identification': ['diesel-engine-abnormal-noise'],
      'Bearing failure and when to stop immediately': ['diesel-engine-abnormal-noise'],
      'Oil pressure, contamination and analysis': ['generator-low-oil-pressure-shutdown'],
      'Repair versus replacement judgements': ['diesel-engine-abnormal-noise'],
    },
  },

  controllers: {
    servicePath: '/services/generator-repairs',
    siblings: ['generators', 'fault-codes', 'ats-changeover'],
    covers: {
      'Alarm interpretation': ['controller-alarm-interpretation'],
      'Reset pathways': ['controller-alarm-interpretation'],
      'Configuration and timers': ['generator-starts-in-manual-not-auto'],
      'Sensing faults': ['controller-alarm-interpretation', 'generator-starts-in-manual-not-auto'],
    },
  },
};

export function getHubCoverage(hubSlug: string): HubCoverage | undefined {
  return HUB_COVERAGE[hubSlug];
}
