/**
 * REPAIR CENTRE registry.
 *
 * Articles are data, rendered by a server component, so every section is in the
 * initial HTML and reachable by crawlers and by readers without JavaScript.
 * Adding an article means adding a file and one entry here.
 */

import type { RepairArticle, RepairHub } from './types';
import { generatorCranksNoStart } from './articles/generator-cranks-no-start';
import { generatorStartsThenStops } from './articles/generator-starts-then-stops';
import { generatorLowOilPressureShutdown } from './articles/generator-low-oil-pressure-shutdown';
import { generatorNoVoltageOutput } from './articles/generator-no-voltage-output';
import { generatorUnstableVoltage } from './articles/generator-unstable-voltage';
import { generatorOverheating } from './articles/generator-overheating';
import { generatorAvrFaultDiagnosis } from './articles/generator-avr-fault-diagnosis';
import { starterMotorClicksButWillNotCrank } from './articles/starter-motor-clicks-but-will-not-crank';
import { upsBypassFault } from './articles/ups-bypass-fault';
import { inverterSwitchesOffUnderLoad } from './articles/inverter-switches-off-under-load';
import { inverterWillNotSwitchOn } from './articles/inverter-will-not-switch-on';
import { inverterNotChargingBatteries } from './articles/inverter-not-charging-batteries';
import { inverterMosfetFailureDiagnosis } from './articles/inverter-mosfet-failure-diagnosis';
import { inverterIgbtTestingAndFailure } from './articles/inverter-igbt-testing-and-failure';
import { solarInverterDcBusFault } from './articles/solar-inverter-dc-bus-fault';
import { upsNotChargingBatteries } from './articles/ups-not-charging-batteries';
import { upsOnBatteryWithMainsPresent } from './articles/ups-on-battery-with-mains-present';

export * from './types';

export const REPAIR_ARTICLES: RepairArticle[] = [
  generatorCranksNoStart,
  generatorStartsThenStops,
  generatorLowOilPressureShutdown,
  generatorNoVoltageOutput,
  generatorUnstableVoltage,
  generatorOverheating,
  generatorAvrFaultDiagnosis,
  starterMotorClicksButWillNotCrank,
  upsBypassFault,
  inverterSwitchesOffUnderLoad,
  inverterWillNotSwitchOn,
  inverterNotChargingBatteries,
  inverterMosfetFailureDiagnosis,
  inverterIgbtTestingAndFailure,
  solarInverterDcBusFault,
  upsNotChargingBatteries,
  upsOnBatteryWithMainsPresent,
];

export const REPAIR_HUBS: RepairHub[] = [
  {
    slug: 'generators',
    title: 'Generator Repair & Troubleshooting',
    intro:
      'Diagnosis and repair guidance for diesel generating sets — starting faults, protective shutdowns, output problems, cooling, fuel and control systems. Written for technicians working on real plant, with the safety constraints stated rather than assumed.',
    scope: [
      'Starting and cranking faults',
      'Protective shutdowns — oil pressure, coolant temperature, overspeed',
      'Output faults — no voltage, unstable voltage, frequency problems',
      'Fuel system diagnosis',
      'Cooling system diagnosis',
      'Controller and communication faults',
      'Transfer switching and load acceptance',
    ],
    articleSlugs: [
      'generator-cranks-but-will-not-start',
      'generator-starts-then-stops',
      'generator-low-oil-pressure-shutdown',
      'generator-produces-no-voltage-output',
      'generator-unstable-voltage',
      'generator-overheating',
      'generator-avr-fault-diagnosis',
      'starter-motor-clicks-but-will-not-crank',
    ],
  },
  {
    slug: 'inverters',
    title: 'Inverter Repair & Troubleshooting',
    intro:
      'Fault diagnosis for off-grid, hybrid and grid-tied inverters, including output-stage, charging and thermal faults. Board-level guidance is published only where it can be given safely and accurately.',
    scope: ['No output', 'Shutdown under load', 'Charging faults', 'Overheating', 'DC bus faults', 'Power-stage failure'],
    articleSlugs: [
      'inverter-switches-off-under-load',
      'inverter-will-not-switch-on',
      'inverter-not-charging-batteries',
      'inverter-mosfet-failure-diagnosis',
      'inverter-igbt-testing-and-failure',
      'solar-inverter-dc-bus-fault',
    ],
  },
  {
    slug: 'ups',
    title: 'UPS Repair & Troubleshooting',
    intro:
      'Diagnosis for offline, line-interactive and online double-conversion UPS systems, including bypass behaviour, battery autonomy and the generator interaction that causes most critical-power failures.',
    scope: ['Will not power on', 'Bypass faults', 'Battery and autonomy faults', 'Rectifier and inverter faults', 'Generator interaction'],
    articleSlugs: ['ups-not-charging-batteries', 'ups-on-battery-with-mains-present', 'ups-bypass-fault'],
  },
  {
    slug: 'controllers',
    title: 'Controller Diagnostics',
    intro:
      'Fault interpretation for generator controllers including DSE, ComAp, Woodward, SmartGen, PowerWizard, Datakom, Lovato, Siemens, Enko and Volvo Penta VODIA.',
    scope: ['Alarm interpretation', 'Reset pathways', 'Communication faults', 'Configuration and timers', 'Sensing faults'],
    articleSlugs: [],
  },
];

const ARTICLE_INDEX = new Map(REPAIR_ARTICLES.map(a => [a.slug, a]));
const HUB_INDEX = new Map(REPAIR_HUBS.map(h => [h.slug, h]));

export function getRepairArticle(slug: string): RepairArticle | null {
  return ARTICLE_INDEX.get(slug) ?? null;
}

export function getRepairHub(slug: string): RepairHub | null {
  return HUB_INDEX.get(slug) ?? null;
}

/** Articles actually written for a hub. Never returns placeholders. */
export function getArticlesForHub(hubSlug: string): RepairArticle[] {
  return REPAIR_ARTICLES.filter(a => a.hub === hubSlug);
}

export function getAllRepairArticleSlugs(): { hub: string; slug: string }[] {
  return REPAIR_ARTICLES.map(a => ({ hub: a.hub, slug: a.slug }));
}

export const REPAIR_ARTICLE_COUNT = REPAIR_ARTICLES.length;
