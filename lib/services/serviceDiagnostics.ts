/**
 * Per-service diagnostics bundle: maps each /services/<slug> page to its
 * Advanced Calculator component key, Q&A pairs, telemetry gauges, sub-service
 * tags, and deep-content links (Bible / Maintenance Hub / Solutions page).
 *
 * Source of truth for what was previously scattered across /diagnostics.
 * Service pages embed this directly so users no longer have to leave the
 * subpage to reach the calculator or troubleshooting content.
 */

export type CalculatorKey =
  | 'generators'
  | 'solar'
  | 'high-voltage'
  | 'motor-rewinding'
  | 'ac'
  | 'ups'
  | 'borehole'
  | 'fabrication'
  | 'incinerators';

export interface DiagnosticQA {
  q: string;
  a: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  solutions: string[];
}

export interface DiagnosticGauge {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}

export interface DeepLink {
  label: string;
  href: string;
  icon: string;
  description: string;
}

export interface ServiceDiagnostics {
  calculatorKey: CalculatorKey;
  calculatorTitle: string;
  formula: string;
  subServices: string[];
  qaPairs: DiagnosticQA[];
  gauges: DiagnosticGauge[];
  deepLinks: DeepLink[];
}

const GEN_QA: DiagnosticQA[] = [
  { q: 'Generator fails to start?', a: 'Check battery (12.5V+), fuel level, oil level. Ensure fuel valve open.', severity: 'high', solutions: ['Charge/replace battery', 'Refill fuel', 'Check oil level', 'Bleed fuel system'] },
  { q: 'Generator starts but stops immediately?', a: 'Fuel starvation or faulty governor. Check fuel filter, pump, governor.', severity: 'high', solutions: ['Replace fuel filter', 'Test fuel pump (2.5–3.5 PSI)', 'Adjust governor linkage'] },
  { q: 'No power output?', a: 'Check AVR, alternator field winding, circuit breakers.', severity: 'critical', solutions: ['Test AVR output', 'Check alternator excitation', 'Reset breakers'] },
  { q: 'Generator overheating?', a: 'Check coolant, radiator, fan belt, thermostat.', severity: 'high', solutions: ['Top up coolant', 'Clean radiator fins', 'Adjust fan belt'] },
  { q: 'Excessive black smoke?', a: 'Rich fuel mixture or incomplete combustion.', severity: 'medium', solutions: ['Replace air filter', 'Clean injectors', 'Check timing'] },
  { q: 'Low oil pressure warning?', a: 'Check oil level immediately. Stop if below 20 PSI.', severity: 'critical', solutions: ['Add correct oil', 'Replace filter', 'Test sensor'] },
];

const GEN_GAUGES: DiagnosticGauge[] = [
  { label: 'Oil Pressure', value: 45, max: 80, unit: 'PSI', color: '#00ff00' },
  { label: 'Coolant Temp', value: 85, max: 120, unit: '°C', color: '#ffaa00' },
  { label: 'RPM', value: 1500, max: 2000, unit: 'RPM', color: '#00ffff' },
];

const GEN_DEEP_LINKS: DeepLink[] = [
  { label: 'Open Live Engineering Tools', href: '#widgets', icon: '🎛️', description: 'Interactive knobs, charts, diagrams with sourced data' },
  { label: 'Open Sizing Calculator', href: '#calculator', icon: '🧮', description: 'Pick the right kVA on this page' },
  { label: 'Read Technical Bible', href: '#bible', icon: '📖', description: 'Engineering brief, brands, schematics — all on this page' },
  { label: 'Top 10 Brands Compared', href: '#bible-brands', icon: '🏷️', description: 'Cummins, Perkins, CAT, FG Wilson, SDMO…' },
  { label: 'Schematics & Diagrams', href: '#bible-diagrams', icon: '📐', description: 'Single-line, fuel system, cooling loop' },
  { label: 'Repair Manual', href: '#bible-repair', icon: '🛠️', description: 'Step-by-step procedures' },
  { label: 'Error Codes', href: '#bible-errors', icon: '⚠️', description: 'Decode controller faults' },
  { label: 'Parts Manual', href: '#bible-parts', icon: '🧰', description: 'OEM part numbers & service intervals' },
  { label: 'ROI & Cost Tables', href: '#bible-roi', icon: '💰', description: 'Capex, opex, payback' },
];

const SOLAR_QA: DiagnosticQA[] = [
  { q: 'Panels not charging batteries?', a: 'Check orientation, shading, connections. Test voltage (18-22V for 12V system).', severity: 'high', solutions: ['Clean panels', 'Remove shading', 'Check charge controller'] },
  { q: 'Inverter showing error?', a: 'Common: overvoltage, undervoltage, overload, overtemperature.', severity: 'medium', solutions: ['Reduce AC load', 'Check battery voltage', 'Improve ventilation'] },
  { q: 'Battery draining quickly?', a: 'Test capacity (80%+ of rated Ah). Check parasitic loads.', severity: 'medium', solutions: ['Load test battery', 'Check phantom loads', 'Replace if 5+ years old'] },
  { q: 'Low panel output?', a: 'Degradation, dirt, or bypass diode failure.', severity: 'low', solutions: ['Clean panels', 'Test each panel', 'Check bypass diodes'] },
];

const SOLAR_GAUGES: DiagnosticGauge[] = [
  { label: 'Panel Voltage', value: 38, max: 50, unit: 'V', color: '#ffff00' },
  { label: 'Battery SOC', value: 85, max: 100, unit: '%', color: '#00ff00' },
  { label: 'Inverter Load', value: 65, max: 100, unit: '%', color: '#00ffff' },
];

const SOLAR_DEEP_LINKS: DeepLink[] = [
  { label: 'Open Live Engineering Tools', href: '#widgets', icon: '🎛️', description: 'Interactive knobs, charts, diagrams with sourced data' },
  { label: 'Open Solar Calculator', href: '#calculator', icon: '🧮', description: 'Right-size panels, batteries, inverter' },
  { label: 'Read Technical Bible', href: '#bible', icon: '📖', description: 'PV physics, MPPT, batteries — all on this page' },
  { label: 'Top 10 Brands Compared', href: '#bible-brands', icon: '🏷️', description: 'Canadian Solar, JA, Jinko, Victron, SMA…' },
  { label: 'Schematics & Diagrams', href: '#bible-diagrams', icon: '📐', description: 'PV system, MPPT strings, battery bank' },
  { label: 'Repair Manual', href: '#bible-repair', icon: '🛠️', description: 'Inverter faults, battery service' },
  { label: 'Error Codes', href: '#bible-errors', icon: '⚠️', description: 'Inverter & charge-controller codes' },
  { label: 'Parts Manual', href: '#bible-parts', icon: '🧰', description: 'Modules, fuses, MC4, BMS' },
  { label: 'ROI & Payback', href: '#bible-roi', icon: '💰', description: 'kWh savings, payback years' },
];

const HV_QA: DiagnosticQA[] = [
  { q: 'Voltage drop in distribution?', a: 'Undersized cables, loose connections. Should be <3%.', severity: 'medium', solutions: ['Calculate cable size', 'Check terminations', 'Upgrade cables'] },
  { q: 'Transformer overheating?', a: 'Overload, poor ventilation, or internal fault.', severity: 'critical', solutions: ['Reduce load', 'Check cooling fans', 'Test oil quality'] },
  { q: 'Neutral-earth voltage high?', a: 'Poor neutral connection. Should be <2V.', severity: 'high', solutions: ['Check neutral continuity', 'Tighten connections', 'Balance loads'] },
  { q: 'Frequent outages?', a: 'Faulty protection, overloaded circuit, or external factors.', severity: 'high', solutions: ['Check protection settings', 'Balance loads', 'Inspect insulators'] },
];

const HV_GAUGES: DiagnosticGauge[] = [
  { label: 'Line Voltage', value: 11000, max: 15000, unit: 'V', color: '#ff0000' },
  { label: 'Load Current', value: 250, max: 400, unit: 'A', color: '#ffaa00' },
  { label: 'Power Factor', value: 92, max: 100, unit: '%', color: '#00ff00' },
];

const HV_DEEP_LINKS: DeepLink[] = [
  { label: 'Open Live Engineering Tools', href: '#widgets', icon: '🎛️', description: 'Interactive knobs, charts, diagrams with sourced data' },
  { label: 'Open Voltage-Drop Calculator', href: '#calculator', icon: '🧮', description: 'Cable sizing & drop on this page' },
  { label: 'Read Technical Bible', href: '#bible', icon: '📖', description: 'Switchgear, MCC, protection — all on this page' },
  { label: 'Top 10 Brands Compared', href: '#bible-brands', icon: '🏷️', description: 'ABB, Schneider, Siemens, Hager, Legrand…' },
  { label: 'Schematics & Diagrams', href: '#bible-diagrams', icon: '📐', description: 'MDB layout, ATS wiring, grounding' },
  { label: 'Repair Manual', href: '#bible-repair', icon: '🛠️', description: 'Panel service procedures' },
  { label: 'Error Codes', href: '#bible-errors', icon: '⚠️', description: 'Trip causes & resets' },
  { label: 'Parts Manual', href: '#bible-parts', icon: '🧰', description: 'MCBs, MCCBs, contactors, busbars' },
  { label: 'ROI & Cost Tables', href: '#bible-roi', icon: '💰', description: 'Per-way pricing & lifecycle' },
];

const MOTOR_QA: DiagnosticQA[] = [
  { q: 'Motor not starting after rewind?', a: 'Check winding connections, insulation resistance (>1MΩ), rotation.', severity: 'high', solutions: ['Verify connections', 'Test insulation', 'Check centrifugal switch'] },
  { q: 'Motor overheating after rewind?', a: 'Wrong wire gauge, incorrect turns, or ventilation issues.', severity: 'high', solutions: ['Verify wire gauge', 'Count turns', 'Clean ventilation'] },
  { q: 'Motor running but low power?', a: 'Shorted turns, wrong configuration, or low voltage.', severity: 'medium', solutions: ['Test winding resistance', 'Verify delta/star', 'Check supply voltage'] },
  { q: 'Excessive vibration?', a: 'Unbalanced rotor, worn bearings, or misalignment.', severity: 'medium', solutions: ['Balance rotor', 'Replace bearings', 'Check alignment'] },
];

const MOTOR_GAUGES: DiagnosticGauge[] = [
  { label: 'Insulation', value: 500, max: 1000, unit: 'MΩ', color: '#00ff00' },
  { label: 'Winding Temp', value: 75, max: 120, unit: '°C', color: '#ffaa00' },
  { label: 'Vibration', value: 2, max: 10, unit: 'mm/s', color: '#00ffff' },
];

const MOTOR_DEEP_LINKS: DeepLink[] = [
  { label: 'Open Live Engineering Tools', href: '#widgets', icon: '🎛️', description: 'Interactive knobs, charts, diagrams with sourced data' },
  { label: 'Open Rewinding Calculator', href: '#calculator', icon: '🧮', description: 'FLA, turns, wire gauge on this page' },
  { label: 'Read Technical Bible', href: '#bible', icon: '📖', description: 'Windings, bearings, IR test — all on this page' },
  { label: 'Top 10 Brands Compared', href: '#bible-brands', icon: '🏷️', description: 'WEG, ABB, Siemens, Crompton, Grundfos…' },
  { label: 'Schematics & Diagrams', href: '#bible-diagrams', icon: '📐', description: 'Cross-section, star-delta, IR test' },
  { label: 'Repair Manual', href: '#bible-repair', icon: '🛠️', description: 'Rewind procedure & balancing' },
  { label: 'Error Codes', href: '#bible-errors', icon: '⚠️', description: 'Burn-out & vibration causes' },
  { label: 'Parts Manual', href: '#bible-parts', icon: '🧰', description: 'Bearings, varnish, wire, slot wedges' },
  { label: 'ROI & Rewind vs Replace', href: '#bible-roi', icon: '💰', description: 'When to rewind vs buy new' },
];

const AC_QA: DiagnosticQA[] = [
  { q: 'AC not cooling?', a: 'Check thermostat, air filter, refrigerant level, compressor.', severity: 'high', solutions: ['Replace filter', 'Check refrigerant (R410A: 118/250 PSI)', 'Clean condenser'] },
  { q: 'AC freezing up?', a: 'Low airflow or low refrigerant.', severity: 'medium', solutions: ['Turn off, let ice melt', 'Replace filter', 'Test refrigerant'] },
  { q: 'AC making loud noise?', a: 'Worn compressor, loose fan, or debris.', severity: 'medium', solutions: ['Tighten fan blades', 'Remove debris', 'Check compressor mounts'] },
  { q: 'AC tripping breaker?', a: 'Overload, short circuit, or compressor failure.', severity: 'high', solutions: ['Test amp draw', 'Check for shorts', 'Test capacitor'] },
];

const AC_GAUGES: DiagnosticGauge[] = [
  { label: 'Suction PSI', value: 68, max: 150, unit: 'PSI', color: '#0088ff' },
  { label: 'Discharge PSI', value: 250, max: 400, unit: 'PSI', color: '#ff4444' },
  { label: 'Superheat', value: 12, max: 30, unit: '°F', color: '#00ff00' },
];

const AC_DEEP_LINKS: DeepLink[] = [
  { label: 'Open Live Engineering Tools', href: '#widgets', icon: '🎛️', description: 'Interactive knobs, charts, diagrams with sourced data' },
  { label: 'Open BTU Calculator', href: '#calculator', icon: '🧮', description: 'Right-size cooling on this page' },
  { label: 'Read Technical Bible', href: '#bible', icon: '📖', description: 'Refrigeration cycle, chillers — all on this page' },
  { label: 'Top 10 Brands Compared', href: '#bible-brands', icon: '🏷️', description: 'Daikin, Mitsubishi, LG, Carrier, Trane…' },
  { label: 'Schematics & Diagrams', href: '#bible-diagrams', icon: '📐', description: 'Refrigeration cycle, chiller system' },
  { label: 'Repair Manual', href: '#bible-repair', icon: '🛠️', description: 'Recharge, leak fix, compressor swap' },
  { label: 'Error Codes', href: '#bible-errors', icon: '⚠️', description: 'E1–E9 split & VRF codes' },
  { label: 'Parts Manual', href: '#bible-parts', icon: '🧰', description: 'Capacitors, fan motors, PCBs' },
  { label: 'ROI & Energy Saving', href: '#bible-roi', icon: '💰', description: 'EER, SEER, annual kWh' },
];

const UPS_QA: DiagnosticQA[] = [
  { q: 'UPS not switching to battery?', a: 'Dead batteries, faulty transfer switch. Test battery (13.5V+).', severity: 'critical', solutions: ['Load test batteries', 'Replace if >3 years', 'Check connections'] },
  { q: 'UPS runtime very short?', a: 'Battery capacity degraded. Batteries last 3-5 years.', severity: 'high', solutions: ['Perform capacity test', 'Replace all batteries', 'Reduce load'] },
  { q: 'UPS showing overload?', a: 'Connected load exceeds UPS rating.', severity: 'medium', solutions: ['Calculate wattage', 'Remove non-essential devices', 'Upgrade UPS'] },
  { q: 'UPS making beeping noise?', a: 'On battery (normal) or fault condition.', severity: 'low', solutions: ['Check display', 'Restore mains', 'Run self-test'] },
];

const UPS_GAUGES: DiagnosticGauge[] = [
  { label: 'Battery V', value: 54, max: 60, unit: 'V', color: '#00ff00' },
  { label: 'Load', value: 45, max: 100, unit: '%', color: '#ffaa00' },
  { label: 'Runtime', value: 25, max: 60, unit: 'min', color: '#00ffff' },
];

const UPS_DEEP_LINKS: DeepLink[] = [
  { label: 'Open Live Engineering Tools', href: '#widgets', icon: '🎛️', description: 'Interactive knobs, charts, diagrams with sourced data' },
  { label: 'Open Runtime Calculator', href: '#calculator', icon: '🧮', description: 'Battery Ah & runtime on this page' },
  { label: 'Read Technical Bible', href: '#bible', icon: '📖', description: 'Online vs offline, batteries — all on this page' },
  { label: 'Top 10 Brands Compared', href: '#bible-brands', icon: '🏷️', description: 'APC, Eaton, Vertiv, Riello, CyberPower…' },
  { label: 'Schematics & Diagrams', href: '#bible-diagrams', icon: '📐', description: 'Double-conversion vs offline' },
  { label: 'Repair Manual', href: '#bible-repair', icon: '🛠️', description: 'Battery swap, fan, capacitor' },
  { label: 'Error Codes', href: '#bible-errors', icon: '⚠️', description: 'F01–F99 fault decoder' },
  { label: 'Parts Manual', href: '#bible-parts', icon: '🧰', description: 'Batteries, fans, PCBs, breakers' },
  { label: 'ROI & Downtime Cost', href: '#bible-roi', icon: '💰', description: 'KES per minute downtime saved' },
];

const PUMP_QA: DiagnosticQA[] = [
  { q: 'Pump not delivering water?', a: 'Check water level, pump depth, foot valve, delivery pipe.', severity: 'high', solutions: ['Measure water level', 'Lower pump', 'Replace foot valve'] },
  { q: 'Pump tripping overload?', a: 'Motor overload, bearing failure, voltage issues.', severity: 'high', solutions: ['Measure current', 'Test insulation', 'Check for sand'] },
  { q: 'Low water pressure?', a: 'Worn impellers, blocked strainer, air in system.', severity: 'medium', solutions: ['Clean strainer', 'Bleed air', 'Replace impellers'] },
  { q: 'Pump cycling frequently?', a: 'Pressure tank waterlogged or faulty pressure switch.', severity: 'medium', solutions: ['Check tank air pressure', 'Adjust pressure switch', 'Replace bladder'] },
];

const PUMP_GAUGES: DiagnosticGauge[] = [
  { label: 'Pressure', value: 3.5, max: 6, unit: 'Bar', color: '#00ffff' },
  { label: 'Flow Rate', value: 8, max: 15, unit: 'm³/h', color: '#00ff00' },
  { label: 'Motor Amps', value: 12, max: 20, unit: 'A', color: '#ffaa00' },
];

const PUMP_DEEP_LINKS: DeepLink[] = [
  { label: 'Open Live Engineering Tools', href: '#widgets', icon: '🎛️', description: 'Interactive knobs, charts, diagrams with sourced data' },
  { label: 'Open Pump Calculator', href: '#calculator', icon: '🧮', description: 'Head, flow, power on this page' },
  { label: 'Read Technical Bible', href: '#bible', icon: '📖', description: 'Submersible, VSD, pressure — all on this page' },
  { label: 'Top 10 Brands Compared', href: '#bible-brands', icon: '🏷️', description: 'Grundfos, Pedrollo, Franklin, Lorentz, DAB…' },
  { label: 'Schematics & Diagrams', href: '#bible-diagrams', icon: '📐', description: 'Borehole section, VSD, pressure tank' },
  { label: 'Repair Manual', href: '#bible-repair', icon: '🛠️', description: 'Pump pull, impeller, seal swap' },
  { label: 'Error Codes', href: '#bible-errors', icon: '⚠️', description: 'Controller & VSD fault codes' },
  { label: 'Parts Manual', href: '#bible-parts', icon: '🧰', description: 'Impellers, seals, cable, tanks' },
  { label: 'ROI & Energy Tables', href: '#bible-roi', icon: '💰', description: 'kWh per m³ pumped' },
];

const INCIN_QA: DiagnosticQA[] = [
  { q: 'Temperature not reaching setpoint?', a: 'Check burner, fuel supply, temperature sensor, airflow.', severity: 'high', solutions: ['Clean burner nozzle', 'Check fuel pressure', 'Verify damper position'] },
  { q: 'Excessive smoke emission?', a: 'Incomplete combustion. Adjust air-to-fuel ratio.', severity: 'high', solutions: ['Increase combustion air', 'Check fuel quality', 'Clean air passages'] },
  { q: 'Safety interlock tripping?', a: 'Door switch, high temp, or flame failure.', severity: 'critical', solutions: ['Check door seal', 'Verify flame sensor', 'Test interlocks'] },
  { q: 'Controller not responding?', a: 'Power supply, fuse, or control board issue.', severity: 'high', solutions: ['Test power supply', 'Replace fuse', 'Check control board'] },
];

const INCIN_GAUGES: DiagnosticGauge[] = [
  { label: 'Chamber Temp', value: 850, max: 1200, unit: '°C', color: '#ff4400' },
  { label: 'Stack Temp', value: 450, max: 800, unit: '°C', color: '#ffaa00' },
  { label: 'O2 Level', value: 8, max: 21, unit: '%', color: '#00ff00' },
];

const INCIN_DEEP_LINKS: DeepLink[] = [
  { label: 'Open Live Engineering Tools', href: '#widgets', icon: '🎛️', description: 'Interactive knobs, charts, diagrams with sourced data' },
  { label: 'Open Capacity Calculator', href: '#calculator', icon: '🧮', description: 'Sizing & burn rate on this page' },
  { label: 'Read Technical Bible', href: '#bible', icon: '📖', description: 'Two-chamber, NEMA, emissions — all on this page' },
  { label: 'Top 10 Brands Compared', href: '#bible-brands', icon: '🏷️', description: 'Inceltech, ATI, Addfield, Macrotec, Matthews…' },
  { label: 'Schematics & Diagrams', href: '#bible-diagrams', icon: '📐', description: 'Two-chamber, combustion air flow' },
  { label: 'Repair Manual', href: '#bible-repair', icon: '🛠️', description: 'Refractory, burner, controls' },
  { label: 'Error Codes', href: '#bible-errors', icon: '⚠️', description: 'Flame failure, over-temp, interlocks' },
  { label: 'Parts Manual', href: '#bible-parts', icon: '🧰', description: 'Burners, refractory, thermocouples' },
  { label: 'ROI & NEMA Compliance', href: '#bible-roi', icon: '💰', description: 'kg/hr cost & licensing' },
];

/**
 * Map every /services/<slug> page to the diagnostics bundle that powers
 * its embedded calculator + Q&A + gauges. Keep keys in sync with the
 * slugs in `lib/services/allServices.ts`.
 */
export const SERVICE_DIAGNOSTICS: Record<string, ServiceDiagnostics> = {
  'cummins-generators': {
    calculatorKey: 'generators',
    calculatorTitle: 'Generator Sizing Calculator',
    formula: 'Generator kVA = (Load × Safety Factor) / Power Factor',
    subServices: ['Sales', 'Installation', '3-Year Warranty', 'Spare Parts', 'Service Contracts'],
    qaPairs: GEN_QA,
    gauges: GEN_GAUGES,
    deepLinks: GEN_DEEP_LINKS,
  },
  'generator-repairs': {
    calculatorKey: 'generators',
    calculatorTitle: 'Generator Sizing Calculator',
    formula: 'Generator kVA = (Load × Safety Factor) / Power Factor',
    subServices: ['Engine', 'Controls', 'Electricals', 'Cooling', 'Fuel System', 'Overhaul'],
    qaPairs: GEN_QA,
    gauges: GEN_GAUGES,
    deepLinks: GEN_DEEP_LINKS,
  },
  'ats-changeover': {
    calculatorKey: 'generators',
    calculatorTitle: 'Generator Sizing Calculator',
    formula: 'Generator kVA = (Load × Safety Factor) / Power Factor',
    subServices: ['Auto Transfer Switch', 'Manual Changeover', 'Synchronization', 'Load-Shedding'],
    qaPairs: GEN_QA,
    gauges: GEN_GAUGES,
    deepLinks: GEN_DEEP_LINKS,
  },
  'distribution-boards': {
    calculatorKey: 'high-voltage',
    calculatorTitle: 'Voltage Drop Calculator',
    formula: 'Voltage Drop = (2 × Length × Current × 0.0175) / Cable Size',
    subServices: ['LV Boards', 'MV Switchgear', 'MCCs', 'Earthing', 'Protection Coordination'],
    qaPairs: HV_QA,
    gauges: HV_GAUGES,
    deepLinks: HV_DEEP_LINKS,
  },
  'solar-energy': {
    calculatorKey: 'solar',
    calculatorTitle: 'Solar Panel Calculator',
    formula: 'Panels Needed = (Daily Energy × 1000) / (Panel Wattage × Sun Hours)',
    subServices: ['Panels', 'Batteries', 'Inverter', 'Hybrid Systems', 'Grid-Tie'],
    qaPairs: SOLAR_QA,
    gauges: SOLAR_GAUGES,
    deepLinks: SOLAR_DEEP_LINKS,
  },
  'motor-rewinding': {
    calculatorKey: 'motor-rewinding',
    calculatorTitle: 'Motor Rewinding Calculator',
    formula: 'Full Load Amps = (HP × 746) / (Voltage × Efficiency × PF)',
    subServices: ['Single Phase Motors', 'Three Phase Motors', 'Submersible Motors', 'DC Motors'],
    qaPairs: MOTOR_QA,
    gauges: MOTOR_GAUGES,
    deepLinks: MOTOR_DEEP_LINKS,
  },
  'ac-installation': {
    calculatorKey: 'ac',
    calculatorTitle: 'AC Sizing Calculator (BTU)',
    formula: 'BTU = Room Area × Ceiling Height × 337 × Sun Factor',
    subServices: ['Split Units', 'Central AC', 'Chillers', 'VRF Systems', 'Cold Rooms'],
    qaPairs: AC_QA,
    gauges: AC_GAUGES,
    deepLinks: AC_DEEP_LINKS,
  },
  'ups-systems': {
    calculatorKey: 'ups',
    calculatorTitle: 'UPS Runtime Calculator',
    formula: 'Runtime (hours) = (Capacity × Voltage × 0.8) / Load',
    subServices: ['Online UPS', 'Offline UPS', 'Line Interactive', 'Modular UPS', 'Battery Banks'],
    qaPairs: UPS_QA,
    gauges: UPS_GAUGES,
    deepLinks: UPS_DEEP_LINKS,
  },
  'borehole-pumps': {
    calculatorKey: 'borehole',
    calculatorTitle: 'Pump Sizing Calculator',
    formula: 'Power (kW) = (Flow × Head × 9.81) / (3600 × Efficiency)',
    subServices: ['Submersible Pumps', 'Jet Pumps', 'Solar Pumps', 'Pump Controllers', 'Pressure Tanks'],
    qaPairs: PUMP_QA,
    gauges: PUMP_GAUGES,
    deepLinks: PUMP_DEEP_LINKS,
  },
  'hospital-incinerators': {
    calculatorKey: 'incinerators',
    calculatorTitle: 'Incinerator Capacity Calculator',
    formula: 'Heat Output (MJ/h) = Volume × Calorific Value × Efficiency',
    subServices: ['Temperature Controls', 'Combustion Systems', 'Emission Monitoring', 'Safety Interlocks'],
    qaPairs: INCIN_QA,
    gauges: INCIN_GAUGES,
    deepLinks: INCIN_DEEP_LINKS,
  },
};

export function getServiceDiagnostics(slug: string): ServiceDiagnostics | null {
  return SERVICE_DIAGNOSTICS[slug] ?? null;
}
