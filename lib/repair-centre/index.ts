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
import { pcbShortCircuitDiagnosis } from './articles/pcb-short-circuit-diagnosis';
import { motherboardPowerRailDiagnosis } from './articles/motherboard-power-rail-diagnosis';
import { atsNotChangingOver } from './articles/ats-not-changing-over';
import { generatorBatteryNotCharging } from './articles/generator-battery-not-charging';
import { upsInverterFaultDiagnosis } from './articles/ups-inverter-fault-diagnosis';
import { controllerAlarmInterpretation } from './articles/controller-alarm-interpretation';
import { threePhaseMotorFailureDiagnosis } from './articles/three-phase-motor-failure-diagnosis';
import { boreholePumpNoWaterDelivery } from './articles/borehole-pump-no-water-delivery';
import { solarSystemUnderperforming } from './articles/solar-system-underperforming';
import { vfdDriveFaultDiagnosis } from './articles/vfd-drive-fault-diagnosis';
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
  pcbShortCircuitDiagnosis,
  motherboardPowerRailDiagnosis,
  atsNotChangingOver,
  generatorBatteryNotCharging,
  upsInverterFaultDiagnosis,
  controllerAlarmInterpretation,
  threePhaseMotorFailureDiagnosis,
  boreholePumpNoWaterDelivery,
  solarSystemUnderperforming,
  vfdDriveFaultDiagnosis,
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
      'generator-battery-not-charging',
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
    articleSlugs: ['ups-not-charging-batteries', 'ups-on-battery-with-mains-present', 'ups-bypass-fault', 'ups-inverter-fault-diagnosis'],
  },
  {
    slug: 'pcb-motherboards',
    title: 'PCB & Motherboard Repair',
    intro:
      'Component-level diagnosis and board repair for industrial control and power electronics — locating shorted rails, tracing supply chains, and deciding when a board is worth repairing at all. Published only where the method can be given without inventing values: every board-specific voltage, pinout and component value is deferred to the manufacturer reference.',
    scope: [
      'Short-circuit location and current-limited fault finding',
      'Power-rail diagnosis and sequencing',
      'Reset, supervisor and clock faults',
      'Component testing and failure modes',
      'Board cleaning, track repair and contamination',
      'When to repair and when to replace',
    ],
    articleSlugs: ['pcb-short-circuit-diagnosis', 'motherboard-power-rail-diagnosis'],
  },
  {
    slug: 'ats-changeover',
    title: 'ATS & Changeover Panel Diagnosis',
    intro:
      'Automatic transfer switch and changeover panel faults — why a switch refuses to transfer, how to separate a control decision from a mechanical failure, and the interlock rules that exist to stop utility and generator being connected together.',
    scope: [
      'Failure to transfer on mains loss',
      'Failure to return to utility',
      'Sensing, thresholds and timer settings',
      'Contactor, motor operator and interlock faults',
      'Position indication and auxiliary contacts',
    ],
    articleSlugs: ['ats-not-changing-over'],
  },
  {
    slug: 'motors',
    title: 'Motor Diagnosis & Rewinding',
    intro:
      'Three-phase motor faults — windings, bearings and the supply problems that destroy otherwise healthy machines. Most burnt-out motors were killed by something outside them, so these guides diagnose the installation as well as the machine, and set out honestly when a rewind is worth it and when it is not.',
    scope: [
      'Winding failure and insulation testing',
      'Single-phasing and supply faults',
      'Bearing failure and mechanical causes',
      'Overload protection and duty',
      'Variable-speed drive interaction',
      'Repair, rewind or replace',
    ],
    articleSlugs: ['three-phase-motor-failure-diagnosis'],
  },
  {
    slug: 'pumps',
    title: 'Pump Diagnosis & Repair',
    intro:
      'Borehole and water pump faults — level, hydraulics, delivery path and the electrical side down the hole. Most of the diagnosis belongs at the surface, because pulling a pump is expensive and hazardous and is frequently unnecessary once the water level has actually been measured.',
    scope: [
      'No delivery and reduced flow',
      'Water level, drawdown and borehole yield',
      'Non-return valves and rising main faults',
      'Hydraulic wear and sand abrasion',
      'Drop cable, splice and motor testing',
      'Dry-run protection and control',
    ],
    articleSlugs: ['borehole-pump-no-water-delivery'],
  },
  {
    slug: 'solar',
    title: 'Solar PV Diagnosis & Repair',
    intro:
      'Solar array and system faults — yield, strings, shading, soiling and the difference between a real fault and an expectation set against nameplate. Written to establish what output SHOULD be for the conditions first, because without that reference "underperforming" is an opinion rather than a measurement.',
    scope: [
      'Underperformance and yield loss',
      'Soiling, shading and vegetation',
      'String faults, fuses and connectors',
      'Module degradation and bypass diodes',
      'Inverter clipping and export limitation',
      'DC bus and isolation faults',
    ],
    articleSlugs: ['solar-system-underperforming'],
  },
  {
    slug: 'industrial-electronics',
    title: 'Industrial Electronics & Drives',
    intro:
      'Variable-speed drives and industrial power electronics — reading a trip correctly, and separating a genuine drive failure from the load, ramp, cooling or installation defect that caused it. Includes the practices that reliably destroy drives and are still found on live installations.',
    scope: [
      'Drive trips and fault interpretation',
      'DC bus over-voltage and regeneration',
      'Thermal derating and cooling',
      'Motor cable, screening and earth leakage',
      'Installation defects that destroy drives',
      'Capacitor ageing and storage',
    ],
    articleSlugs: ['vfd-drive-fault-diagnosis'],
  },
  {
    slug: 'controllers',
    title: 'Controller Diagnostics',
    intro:
      'Fault interpretation for generator controllers including DSE, ComAp, Woodward, SmartGen, PowerWizard, Datakom, Lovato, Siemens, Enko and Volvo Penta VODIA.',
    scope: ['Alarm interpretation', 'Reset pathways', 'Communication faults', 'Configuration and timers', 'Sensing faults'],
    articleSlugs: ['controller-alarm-interpretation'],
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
