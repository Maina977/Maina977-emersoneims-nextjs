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
import { safeIsolationAndProvingDead } from './articles/safe-isolation-and-proving-dead';
import { generatorExcessiveSmoke } from './articles/generator-excessive-smoke';
import { testInstrumentsAndMeasurementErrors } from './articles/test-instruments-and-measurement-errors';
import { j1939SpnFmiExplained } from './articles/j1939-spn-fmi-explained';
import { dieselEngineAbnormalNoise } from './articles/diesel-engine-abnormal-noise';
import { solarChargeControllerNotCharging } from './articles/solar-charge-controller-not-charging';
import { solarStringFaultDiagnosis } from './articles/solar-string-fault-diagnosis';
import { solarModuleDegradationBypassDiodes } from './articles/solar-module-degradation-bypass-diodes';
import { motorOverloadTripping } from './articles/motor-overload-tripping';
import { pumpRunsContinuously } from './articles/pump-runs-continuously';
import { generatorStartsInManualNotAuto } from './articles/generator-starts-in-manual-not-auto';
import { upsBatteryReplacement } from './articles/ups-battery-replacement';
import { atsWillNotReturnToMains } from './articles/ats-will-not-return-to-mains';
import { dieselFuelContamination } from './articles/diesel-fuel-contamination';
import { inverterSwitchesOffUnderLoad } from './articles/inverter-switches-off-under-load';
import { inverterWillNotSwitchOn } from './articles/inverter-will-not-switch-on';
import { inverterNotChargingBatteries } from './articles/inverter-not-charging-batteries';
import { inverterMosfetFailureDiagnosis } from './articles/inverter-mosfet-failure-diagnosis';
import { inverterIgbtTestingAndFailure } from './articles/inverter-igbt-testing-and-failure';
import { solarInverterDcBusFault } from './articles/solar-inverter-dc-bus-fault';
import { upsNotChargingBatteries } from './articles/ups-not-charging-batteries';
import { upsOnBatteryWithMainsPresent } from './articles/ups-on-battery-with-mains-present';
import { upsWillNotPowerOn } from './articles/ups-will-not-power-on';
import { motorBearingFailureDiagnosis } from './articles/motor-bearing-failure-diagnosis';
import { boreholeDropCableAndMotorTesting } from './articles/borehole-drop-cable-and-motor-testing';
import { pcbResetSupervisorClockFaults } from './articles/pcb-reset-supervisor-clock-faults';
import { pcbCleaningTrackRepairContamination } from './articles/pcb-cleaning-track-repair-contamination';
import { pcbRepairOrReplaceDecision } from './articles/pcb-repair-or-replace-decision';
import { driveThermalDeratingAndCooling } from './articles/drive-thermal-derating-and-cooling';
import { driveMotorCableScreeningEarthLeakage } from './articles/drive-motor-cable-screening-earth-leakage';
import { driveCapacitorAgeingAndStorage } from './articles/drive-capacitor-ageing-and-storage';
import { atsContactorInterlockFaults } from './articles/ats-contactor-interlock-faults';
import { atsPositionIndicationAuxiliaryContacts } from './articles/ats-position-indication-auxiliary-contacts';
import { generatorAirRestrictionTurbocharger } from './articles/generator-air-restriction-turbocharger';
import { generatorAltitudeAmbientDerating } from './articles/generator-altitude-ambient-derating';
import { dieselValveTrainAndClearances } from './articles/diesel-valve-train-and-clearances';
import { turbochargerMechanicalCondition } from './articles/turbocharger-mechanical-condition';
import { pumpHydraulicWearSandAbrasion } from './articles/pump-hydraulic-wear-sand-abrasion';
import { inverterOverheatingDiagnosis } from './articles/inverter-overheating-diagnosis';
import { insulationTestingProtectingElectronics } from './articles/insulation-testing-protecting-electronics';
import { controllerCommunicationFaults } from './articles/controller-communication-faults';

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
  safeIsolationAndProvingDead,
  generatorExcessiveSmoke,
  testInstrumentsAndMeasurementErrors,
  j1939SpnFmiExplained,
  dieselEngineAbnormalNoise,
  solarChargeControllerNotCharging,
  solarStringFaultDiagnosis,
  solarModuleDegradationBypassDiodes,
  motorOverloadTripping,
  pumpRunsContinuously,
  generatorStartsInManualNotAuto,
  upsBatteryReplacement,
  atsWillNotReturnToMains,
  dieselFuelContamination,
  inverterSwitchesOffUnderLoad,
  inverterWillNotSwitchOn,
  inverterNotChargingBatteries,
  inverterMosfetFailureDiagnosis,
  inverterIgbtTestingAndFailure,
  solarInverterDcBusFault,
  upsNotChargingBatteries,
  upsOnBatteryWithMainsPresent,
  upsWillNotPowerOn,
  motorBearingFailureDiagnosis,
  boreholeDropCableAndMotorTesting,
  pcbResetSupervisorClockFaults,
  pcbCleaningTrackRepairContamination,
  pcbRepairOrReplaceDecision,
  driveThermalDeratingAndCooling,
  driveMotorCableScreeningEarthLeakage,
  driveCapacitorAgeingAndStorage,
  atsContactorInterlockFaults,
  atsPositionIndicationAuxiliaryContacts,
  generatorAirRestrictionTurbocharger,
  generatorAltitudeAmbientDerating,
  dieselValveTrainAndClearances,
  turbochargerMechanicalCondition,
  pumpHydraulicWearSandAbrasion,
  inverterOverheatingDiagnosis,
  insulationTestingProtectingElectronics,
  controllerCommunicationFaults,
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
      'inverter-overheating-diagnosis',
    ],
  },
  {
    slug: 'ups',
    title: 'UPS Repair & Troubleshooting',
    intro:
      'Diagnosis for offline, line-interactive and online double-conversion UPS systems, including bypass behaviour, battery autonomy and the generator interaction that causes most critical-power failures.',
    scope: ['Will not power on', 'Bypass faults', 'Battery and autonomy faults', 'Rectifier and inverter faults', 'Generator interaction'],
    articleSlugs: ['ups-not-charging-batteries', 'ups-on-battery-with-mains-present', 'ups-bypass-fault', 'ups-inverter-fault-diagnosis', 'ups-battery-replacement', 'ups-will-not-power-on'],
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
    articleSlugs: ['pcb-short-circuit-diagnosis', 'motherboard-power-rail-diagnosis', 'pcb-reset-supervisor-clock-faults', 'pcb-cleaning-track-repair-contamination', 'pcb-repair-or-replace-decision'],
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
    articleSlugs: ['ats-not-changing-over', 'ats-will-not-return-to-mains', 'ats-contactor-interlock-faults', 'ats-position-indication-auxiliary-contacts'],
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
    articleSlugs: ['three-phase-motor-failure-diagnosis', 'motor-overload-tripping', 'motor-bearing-failure-diagnosis'],
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
    articleSlugs: ['borehole-pump-no-water-delivery', 'pump-runs-continuously', 'borehole-drop-cable-and-motor-testing', 'pump-hydraulic-wear-sand-abrasion'],
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
      // Added 2026-07-30. The hub already carried an article on charge
      // controllers, but no scope line acknowledged it — so a genuine guide sat
      // on the page under a scope list that never claimed the subject.
      'Charge controllers and battery charging',
    ],
    articleSlugs: [
      'solar-system-underperforming',
      'solar-charge-controller-not-charging',
      'solar-string-fault-diagnosis',
      'solar-module-degradation-bypass-diodes',
    ],
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
    articleSlugs: ['vfd-drive-fault-diagnosis', 'drive-thermal-derating-and-cooling', 'drive-motor-cable-screening-earth-leakage', 'drive-capacitor-ageing-and-storage'],
  },
  {
    slug: 'safety',
    title: 'Electrical Safety & Safe Isolation',
    intro:
      'The disciplines every other guide in the Repair Centre depends on — identifying every source, locking off, proving dead at the point of work, and controlling stored energy. Power equipment routinely has more than one source, and several of them cannot be switched off at all.',
    scope: [
      'Safe isolation and proving dead',
      'Lockout, tagout and multi-person working',
      'Multiple and hidden sources — backfeed, auto-start, PV, batteries',
      'Stored energy: DC bus, capacitors, springs, pressure, heat',
      'Test instrument selection and proving',
      'When to stop and escalate',
    ],
    articleSlugs: ['safe-isolation-and-proving-dead'],
  },
  {
    slug: 'fuel-systems',
    title: 'Fuel & Combustion Diagnosis',
    intro:
      'Diesel fuel, air and combustion faults — smoke diagnosis, fuel contamination, injection and the loading problems that damage engines without any component failing. Written for Kenyan conditions, where dust loading, altitude derating and long-stored fuel matter more than temperate assumptions allow.',
    scope: [
      'Smoke diagnosis — black, blue and white',
      'Air restriction and turbocharger faults',
      'Wet stacking and light-load damage',
      'Fuel contamination, water and filtration',
      'Injection and combustion faults',
      'Altitude and ambient derating',
    ],
    articleSlugs: ['generator-excessive-smoke', 'diesel-fuel-contamination', 'generator-air-restriction-turbocharger', 'generator-altitude-ambient-derating'],
  },
  {
    slug: 'testing-tools',
    title: 'Test Instruments & Measurement',
    intro:
      'Choosing instruments, using them safely, and knowing where each one misleads. Measurement category is a safety rating rather than an accuracy one, and the two commonest field errors — averaging meters on distorted waveforms, and ghost voltages on high-impedance inputs — both produce confident, entirely believable wrong numbers.',
    scope: [
      'Measurement categories and instrument selection',
      'True-RMS versus averaging on distorted waveforms',
      'Ghost voltages and low-impedance mode',
      'AC versus DC clamp measurement',
      'Insulation testing and protecting electronics',
      'Interpreting readings in context',
    ],
    articleSlugs: ['test-instruments-and-measurement-errors', 'insulation-testing-protecting-electronics'],
  },
  {
    slug: 'fault-codes',
    title: 'Fault Codes & Diagnostic Messages',
    intro:
      'How to read the codes your equipment reports — the structure behind J1939 engine diagnostics, and why a code identifies a measurement rather than a cause. Written to make a code database usable: the aim is a technician who can interpret an unfamiliar code correctly, not one who looks up a number and stops thinking.',
    scope: [
      'J1939 SPN and FMI structure',
      'Separating signal faults from real conditions',
      'Occurrence counts and code history',
      'Engine ECM versus controller-generated codes',
      'Why generic code lists mislead',
      'Recording codes before clearing them',
    ],
    articleSlugs: ['j1939-spn-fmi-explained'],
  },
  {
    slug: 'engine-systems',
    title: 'Engine Mechanical Diagnosis',
    intro:
      'Diesel engine mechanical condition — abnormal noise, lubrication and the judgements where continuing to run costs far more than stopping. The urgent decision on this equipment is usually not what the fault is, but whether the engine should be running while you work it out.',
    scope: [
      'Abnormal noise and knock identification',
      'Bearing failure and when to stop immediately',
      'Oil pressure, contamination and analysis',
      'Valve train and clearances',
      'Turbocharger mechanical condition',
      'Repair versus replacement judgements',
    ],
    articleSlugs: ['diesel-engine-abnormal-noise', 'diesel-valve-train-and-clearances', 'turbocharger-mechanical-condition'],
  },
  {
    slug: 'controllers',
    title: 'Controller Diagnostics',
    intro:
      'Fault interpretation for generator controllers including DSE, ComAp, Woodward, SmartGen, PowerWizard, Datakom, Lovato, Siemens, Enko and Volvo Penta VODIA.',
    scope: ['Alarm interpretation', 'Reset pathways', 'Communication faults', 'Configuration and timers', 'Sensing faults'],
    articleSlugs: ['controller-alarm-interpretation', 'generator-starts-in-manual-not-auto', 'controller-communication-faults'],
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
