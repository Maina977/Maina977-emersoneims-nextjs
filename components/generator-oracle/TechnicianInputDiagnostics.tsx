'use client';

/**
 * TECHNICIAN INPUT DIAGNOSTICS
 * Input your readings and get instant diagnostic analysis
 * The miracle happens here - technicians input data, system provides solutions
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// PARAMETER RANGES AND THRESHOLDS
// ═══════════════════════════════════════════════════════════════════════════════
interface ParameterSpec {
  name: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  warningLow: number;
  warningHigh: number;
  criticalLow: number;
  criticalHigh: number;
  description: string;
}

const PARAMETER_SPECS: Record<string, ParameterSpec> = {
  oilPressure: {
    name: 'Oil Pressure',
    unit: 'PSI',
    normalMin: 30,
    normalMax: 60,
    warningLow: 20,
    warningHigh: 70,
    criticalLow: 15,
    criticalHigh: 80,
    description: 'Engine lubrication oil pressure'
  },
  coolantTemp: {
    name: 'Coolant Temperature',
    unit: '°C',
    normalMin: 75,
    normalMax: 95,
    warningLow: 60,
    warningHigh: 100,
    criticalLow: 40,
    criticalHigh: 105,
    description: 'Engine cooling water temperature'
  },
  batteryVoltage: {
    name: 'Battery Voltage',
    unit: 'V DC',
    normalMin: 24,
    normalMax: 28,
    warningLow: 22,
    warningHigh: 30,
    criticalLow: 20,
    criticalHigh: 32,
    description: 'Starting battery voltage (24V system)'
  },
  rpm: {
    name: 'Engine Speed',
    unit: 'RPM',
    normalMin: 1480,
    normalMax: 1520,
    warningLow: 1450,
    warningHigh: 1550,
    criticalLow: 1400,
    criticalHigh: 1600,
    description: 'Engine rotational speed'
  },
  frequency: {
    name: 'Output Frequency',
    unit: 'Hz',
    normalMin: 49.5,
    normalMax: 50.5,
    warningLow: 49,
    warningHigh: 51,
    criticalLow: 47,
    criticalHigh: 53,
    description: 'Generator output frequency'
  },
  voltageL1N: {
    name: 'Voltage L1-N',
    unit: 'V AC',
    normalMin: 220,
    normalMax: 240,
    warningLow: 210,
    warningHigh: 250,
    criticalLow: 200,
    criticalHigh: 260,
    description: 'Phase to neutral voltage'
  },
  voltageL1L2: {
    name: 'Voltage L1-L2',
    unit: 'V AC',
    normalMin: 380,
    normalMax: 420,
    warningLow: 370,
    warningHigh: 430,
    criticalLow: 360,
    criticalHigh: 440,
    description: 'Phase to phase voltage'
  },
  currentL1: {
    name: 'Current L1',
    unit: 'A',
    normalMin: 0,
    normalMax: 500,
    warningLow: 0,
    warningHigh: 550,
    criticalLow: 0,
    criticalHigh: 600,
    description: 'Phase L1 current'
  },
  loadPercent: {
    name: 'Load Percentage',
    unit: '%',
    normalMin: 30,
    normalMax: 80,
    warningLow: 10,
    warningHigh: 90,
    criticalLow: 5,
    criticalHigh: 100,
    description: 'Generator load percentage'
  },
  powerFactor: {
    name: 'Power Factor',
    unit: '',
    normalMin: 0.85,
    normalMax: 1.0,
    warningLow: 0.75,
    warningHigh: 1.0,
    criticalLow: 0.65,
    criticalHigh: 1.0,
    description: 'Power factor (lagging/leading)'
  },
  fuelLevel: {
    name: 'Fuel Level',
    unit: '%',
    normalMin: 30,
    normalMax: 100,
    warningLow: 20,
    warningHigh: 100,
    criticalLow: 10,
    criticalHigh: 100,
    description: 'Fuel tank level percentage'
  },
  oilTemperature: {
    name: 'Oil Temperature',
    unit: '°C',
    normalMin: 70,
    normalMax: 100,
    warningLow: 50,
    warningHigh: 110,
    criticalLow: 30,
    criticalHigh: 120,
    description: 'Engine oil temperature'
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DIAGNOSTIC RULES AND ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════
interface DiagnosticResult {
  parameter: string;
  status: 'normal' | 'warning' | 'critical';
  value: number;
  unit: string;
  message: string;
  possibleCauses: string[];
  immediateActions: string[];
  longTermFixes: string[];
  relatedParameters: string[];
}

export type AcSystem = '50-230' | '50-220' | '60-120' | '60-127' | '60-277';
export const AC_SYSTEMS: Record<AcSystem, { label: string; hz: number; ln: number; ll: number }> = {
  '50-230': { label: '50 Hz, 230/400 V (Kenya, East Africa)', hz: 50, ln: 230, ll: 400 },
  '50-220': { label: '50 Hz, 220/380 V', hz: 50, ln: 220, ll: 380 },
  '60-120': { label: '60 Hz, 120/208 V', hz: 60, ln: 120, ll: 208 },
  '60-127': { label: '60 Hz, 127/220 V', hz: 60, ln: 127, ll: 220 },
  '60-277': { label: '60 Hz, 277/480 V', hz: 60, ln: 277, ll: 480 },
};
/** Bands around the chosen system's nominal: normal +/-4 %, warning +/-8 %, critical +/-13 %. */
function band(nom: number) {
  const r = (x: number) => Math.round(x * 10) / 10;
  return { normalMin: r(nom * 0.96), normalMax: r(nom * 1.04), warningLow: r(nom * 0.92), warningHigh: r(nom * 1.08), criticalLow: r(nom * 0.87), criticalHigh: r(nom * 1.13) };
}
function specFor(key: string, spec: ParameterSpec, ac: AcSystem): ParameterSpec {
  const sys = AC_SYSTEMS[ac];
  if (key === 'frequency') {
    const f = sys.hz;
    return { ...spec, normalMin: f - 0.5, normalMax: f + 0.5, warningLow: f - 1, warningHigh: f + 1, criticalLow: f - 3, criticalHigh: f + 3, description: `Generator output frequency (${f} Hz system)` };
  }
  if (key === 'rpm') {
    const n = sys.hz === 60 ? 1800 : 1500;
    return { ...spec, normalMin: n - 20, normalMax: n + 20, warningLow: n - 50, warningHigh: n + 50, criticalLow: n - 100, criticalHigh: n + 100, description: `Engine speed (${n} RPM for a 4-pole ${sys.hz} Hz set)` };
  }
  if (key === 'voltageL1N') return { ...spec, ...band(sys.ln), description: `Phase to neutral voltage (${sys.ln} V nominal)` };
  if (key === 'voltageL1L2') return { ...spec, ...band(sys.ll), description: `Phase to phase voltage (${sys.ll} V nominal)` };
  return spec;
}

// Readings no gauge can show are a typing error, not a diagnosis (audit 2026-10-31).
const IMPOSSIBLE: Record<string, (v: number) => boolean> = {
  oilPressure: (v) => v < 0, coolantTemp: (v) => v < -40 || v > 300, batteryVoltage: (v) => v < 0 || v > 60,
  rpm: (v) => v < 0 || v > 5000, powerFactor: (v) => v < 0 || v > 1, loadPercent: (v) => v < 0 || v > 200,
  frequency: (v) => v < 0 || v > 100, voltageL1N: (v) => v < 0 || v > 1000, voltageL1L2: (v) => v < 0 || v > 1500,
  currentL1: (v) => v < 0, fuelLevel: (v) => v < 0 || v > 100, oilTemperature: (v) => v < -40 || v > 250,
};
export function analyzeParameter(paramKey: string, value: number, batterySystem: '12' | '24' = '24', ac: AcSystem = '50-230'): DiagnosticResult | null {
  let spec = PARAMETER_SPECS[paramKey];
  if (!spec || value === null || value === undefined || isNaN(value)) return null;
  if (IMPOSSIBLE[paramKey]?.(value)) return null;
  spec = specFor(paramKey, spec, ac);
  // The technician says which bank it is: guessing from the voltage called 12.6 V
  // normal on a badly discharged 24 V set (re-audit 2026-10-31).
  if (paramKey === 'batteryVoltage' && batterySystem === '12') {
    spec = { ...spec, normalMin: 12.4, normalMax: 14.6, warningLow: 12, warningHigh: 15, criticalLow: 10.5, criticalHigh: 16, description: 'Starting battery voltage (12V system)' };
  }

  let status: 'normal' | 'warning' | 'critical' = 'normal';
  let message = '';
  let possibleCauses: string[] = [];
  let immediateActions: string[] = [];
  let longTermFixes: string[] = [];
  let relatedParameters: string[] = [];

  // Determine status
  if (value < spec.criticalLow || value > spec.criticalHigh) {
    status = 'critical';
  } else if (value < spec.warningLow || value > spec.warningHigh) {
    status = 'warning';
  } else if (value >= spec.normalMin && value <= spec.normalMax) {
    status = 'normal';
  } else {
    status = 'warning';
  }

  // Generate specific analysis based on parameter and status
  switch (paramKey) {
    case 'oilPressure':
      if (value < spec.criticalLow) {
        message = `CRITICAL: Oil pressure at ${value} ${spec.unit} is dangerously low. STOP ENGINE IMMEDIATELY to prevent catastrophic damage.`;
        possibleCauses = [
          'Low oil level in sump - check dipstick immediately',
          'Faulty oil pressure sender - verify with mechanical gauge',
          'Worn engine bearings allowing excessive oil bypass',
          'Failed or failing oil pump - insufficient pressure generation',
          'Stuck-open pressure relief valve - oil bypassing to sump',
          'Severely clogged oil filter restricting flow',
          'Oil diluted with fuel or coolant reducing viscosity'
        ];
        immediateActions = [
          'STOP ENGINE IMMEDIATELY - do not attempt restart',
          'Check oil level on dipstick - add oil if low',
          'Install mechanical gauge to verify actual pressure',
          'Inspect for visible oil leaks under engine',
          'Check oil condition - smell for fuel, look for milky appearance'
        ];
        longTermFixes = [
          'Replace oil pressure sender if reading is false',
          'Perform complete oil and filter change with correct grade',
          'Inspect oil pump drive and replace pump if worn',
          'Check relief valve operation and replace spring if weak',
          'If bearing knock present, engine rebuild required'
        ];
        relatedParameters = ['oilTemperature', 'coolantTemp', 'rpm'];
      } else if (value < spec.warningLow) {
        message = `WARNING: Oil pressure at ${value} ${spec.unit} is below normal. Monitor closely and investigate cause.`;
        possibleCauses = [
          'Oil level slightly low',
          'Oil becoming thin due to overheating or dilution',
          'Sender calibration drift',
          'Normal for hot idle on some engines'
        ];
        immediateActions = [
          'Check oil level and top up if needed',
          'Monitor oil temperature',
          'Verify reading with mechanical gauge if available'
        ];
        longTermFixes = [
          'Consider oil and filter change',
          'Investigate any oil consumption issues',
          'Check sender calibration'
        ];
        relatedParameters = ['oilTemperature', 'rpm'];
      } else if (value > spec.warningHigh) {
        message = `WARNING: Oil pressure at ${value} ${spec.unit} is above normal. Possible relief valve or sensor issue.`;
        possibleCauses = [
          'Oil pressure relief valve stuck closed',
          'Faulty oil pressure sender reading high',
          'Oil too thick for temperature (wrong grade)',
          'Cold start - pressure will normalize as oil warms'
        ];
        immediateActions = [
          'Allow engine to warm up and recheck',
          'Verify reading with mechanical gauge',
          'Check oil grade matches specification'
        ];
        longTermFixes = [
          'Inspect and clean relief valve',
          'Replace sender if faulty',
          'Change to correct oil grade'
        ];
        relatedParameters = ['oilTemperature'];
      } else {
        message = `NORMAL: Oil pressure at ${value} ${spec.unit} is within optimal operating range.`;
        immediateActions = ['No action required - continue monitoring'];
      }
      break;

    case 'coolantTemp':
      if (value > spec.criticalHigh) {
        message = `CRITICAL: Coolant temperature at ${value} ${spec.unit} is dangerously high. ENGINE DAMAGE IMMINENT.`;
        possibleCauses = [
          'Low coolant level - check expansion tank and radiator',
          'Cooling fan not running - check belt, motor, or thermal switch',
          'Thermostat stuck closed - blocking coolant flow',
          'Radiator blocked externally with debris',
          'Radiator blocked internally with scale or corrosion',
          'Failed water pump - impeller worn or shaft broken',
          'Head gasket failure - combustion gases in cooling system',
          'Air trapped in cooling system after service'
        ];
        immediateActions = [
          'STOP ENGINE IMMEDIATELY to prevent damage',
          'DO NOT open radiator cap while hot - severe burn risk',
          'Allow engine to cool for at least 30-60 minutes',
          'Check for visible coolant leaks',
          'Verify cooling fan rotation when engine is hot'
        ];
        longTermFixes = [
          'Top up coolant with correct mixture when cool',
          'Replace thermostat if stuck',
          'Clean or replace radiator if blocked',
          'Replace water pump if failed',
          'Head gasket test if combustion gas contamination suspected'
        ];
        relatedParameters = ['oilTemperature', 'loadPercent', 'rpm'];
      } else if (value > spec.warningHigh) {
        message = `WARNING: Coolant temperature at ${value} ${spec.unit} is elevated. Reduce load and investigate.`;
        possibleCauses = [
          'High ambient temperature',
          'Heavy load on generator',
          'Cooling system needs maintenance',
          'Low coolant level'
        ];
        immediateActions = [
          'Reduce generator load if possible',
          'Check coolant level',
          'Verify fan is operating',
          'Inspect radiator for blockage'
        ];
        longTermFixes = [
          'Service cooling system',
          'Consider load management',
          'Improve ventilation around generator'
        ];
        relatedParameters = ['loadPercent', 'oilTemperature'];
      } else if (value < spec.warningLow) {
        message = `WARNING: Coolant temperature at ${value} ${spec.unit} is low. Engine may not be at operating temperature.`;
        possibleCauses = [
          'Thermostat stuck open - never reaching operating temp',
          'Recent cold start - still warming up',
          'Very low ambient temperature',
          'Temperature sender fault'
        ];
        immediateActions = [
          'Allow engine to warm up under light load',
          'Check that thermostat is installed',
          'Verify sender is reading correctly'
        ];
        longTermFixes = [
          'Replace thermostat if stuck open',
          'Consider engine block heater in cold climates'
        ];
        relatedParameters = ['oilTemperature'];
      } else {
        message = `NORMAL: Coolant temperature at ${value} ${spec.unit} is within optimal operating range.`;
        immediateActions = ['No action required - continue monitoring'];
      }
      break;

    case 'batteryVoltage':
      if (value < spec.criticalLow) {
        message = `CRITICAL: Battery voltage at ${value} ${spec.unit} is critically low. Engine may not start.`;
        possibleCauses = [
          'Battery discharged or failed',
          'Charging system not working - alternator fault',
          'Loose or corroded battery connections',
          'Parasitic drain when engine stopped',
          'Battery past end of life'
        ];
        immediateActions = [
          'Check battery connections - clean and tighten',
          'Attempt jump start or use battery charger',
          'Check battery age - replace if over 3-5 years',
          'Verify charging when engine running'
        ];
        longTermFixes = [
          'Replace battery if cells are weak',
          'Test and replace alternator if not charging',
          'Install battery maintenance charger',
          'Check for parasitic drains in electrical system'
        ];
        relatedParameters = ['rpm'];
      } else if (value < spec.warningLow) {
        message = `WARNING: Battery voltage at ${value} ${spec.unit} is low. Charging system may not be keeping up.`;
        possibleCauses = [
          'Alternator output low',
          'High electrical load',
          'Battery beginning to fail',
          'Belt slipping on alternator'
        ];
        immediateActions = [
          'Check W terminal/charge lamp indicator',
          'Verify alternator belt tension',
          'Measure charging voltage at battery'
        ];
        longTermFixes = [
          'Service or replace alternator',
          'Load test battery and replace if needed',
          'Check belt and tensioner'
        ];
        relatedParameters = ['rpm'];
      } else if (value > spec.warningHigh) {
        message = `WARNING: Battery voltage at ${value} ${spec.unit} is high. Overcharging may damage battery.`;
        possibleCauses = [
          'Voltage regulator failed - overcharging',
          'Wrong battery type installed',
          'Sensor or meter error'
        ];
        immediateActions = [
          'Check for battery boiling or swelling',
          'Verify reading with separate multimeter',
          'Check voltage regulator output'
        ];
        longTermFixes = [
          'Replace voltage regulator if faulty',
          'Verify correct battery specification'
        ];
        relatedParameters = [];
      } else {
        message = `NORMAL: Battery voltage at ${value} ${spec.unit} is within optimal range.`;
        immediateActions = ['No action required - charging system operating correctly'];
      }
      break;

    case 'frequency':
      if (value < spec.criticalLow || value > spec.criticalHigh) {
        message = `CRITICAL: Output frequency at ${value} ${spec.unit} is severely out of specification. Connected equipment at risk.`;
        possibleCauses = [
          'Governor malfunction - not controlling engine speed',
          'Severe load changes overwhelming governor',
          'Engine underpowered for load',
          'Fuel supply problem affecting engine speed',
          'Speed sensor fault giving wrong feedback'
        ];
        immediateActions = [
          'Check engine RPM - frequency tracks speed',
          'Reduce load immediately',
          'Check governor actuator operation',
          'Verify fuel supply and pressure'
        ];
        longTermFixes = [
          'Calibrate or replace governor/actuator',
          'Service speed sensor',
          'Review load versus generator capacity',
          'Check fuel system completely'
        ];
        relatedParameters = ['rpm', 'loadPercent'];
      } else if (value < spec.warningLow || value > spec.warningHigh) {
        message = `WARNING: Output frequency at ${value} ${spec.unit} is outside normal tolerance.`;
        possibleCauses = [
          'Governor needs adjustment',
          'Load changes faster than governor response',
          'Minor speed sensor issue'
        ];
        immediateActions = [
          'Monitor RPM stability',
          'Check governor droop/isochronous setting',
          'Reduce sudden load changes if possible'
        ];
        longTermFixes = [
          'Tune governor parameters',
          'Service governor actuator',
          'Consider load sequencing'
        ];
        relatedParameters = ['rpm', 'loadPercent'];
      } else {
        message = `NORMAL: Output frequency at ${value} ${spec.unit} is within specification.`;
        immediateActions = ['No action required - governor maintaining stable frequency'];
      }
      break;

    case 'voltageL1N':
    case 'voltageL1L2':
      if (value < spec.criticalLow) {
        message = `CRITICAL: Voltage at ${value} ${spec.unit} is dangerously low. Equipment malfunction likely.`;
        possibleCauses = [
          'AVR (Automatic Voltage Regulator) failure',
          'Exciter winding fault',
          'Loss of sensing voltage to AVR',
          'Severe overload causing voltage collapse',
          'Generator winding partial failure'
        ];
        immediateActions = [
          'Check AVR connections and sensing inputs',
          'Reduce load immediately',
          'Check exciter field voltage',
          'Verify generator is not overloaded'
        ];
        longTermFixes = [
          'Replace AVR if faulty',
          'Service exciter and main generator windings',
          'Review load versus generator rating'
        ];
        relatedParameters = ['loadPercent', 'currentL1', 'powerFactor'];
      } else if (value > spec.criticalHigh) {
        message = `CRITICAL: Voltage at ${value} ${spec.unit} is dangerously high. Equipment damage risk.`;
        possibleCauses = [
          'AVR over-exciting generator',
          'AVR voltage setpoint too high',
          'Loss of voltage sensing causing AVR to over-excite',
          'AVR failure in high-output mode'
        ];
        immediateActions = [
          'Stop generator if voltage excessive',
          'Check AVR settings and sensing',
          'Verify sensing circuit connections'
        ];
        longTermFixes = [
          'Recalibrate or replace AVR',
          'Verify sensing transformer ratios',
          'Check all sensing circuit components'
        ];
        relatedParameters = ['loadPercent', 'powerFactor'];
      } else if (value < spec.warningLow || value > spec.warningHigh) {
        message = `WARNING: Voltage at ${value} ${spec.unit} is outside normal range. Monitor and adjust.`;
        possibleCauses = [
          'AVR needs adjustment',
          'Load power factor affecting voltage',
          'Sensing circuit calibration drift'
        ];
        immediateActions = [
          'Adjust AVR voltage setpoint if accessible',
          'Check power factor of load',
          'Monitor for further drift'
        ];
        longTermFixes = [
          'Professional AVR calibration',
          'Correct power factor with capacitors if needed'
        ];
        relatedParameters = ['powerFactor', 'loadPercent'];
      } else {
        message = `NORMAL: Voltage at ${value} ${spec.unit} is within optimal range.`;
        immediateActions = ['No action required - AVR maintaining stable voltage'];
      }
      break;

    case 'loadPercent':
      if (value > spec.criticalHigh) {
        message = `CRITICAL: Generator load at ${value}${spec.unit} exceeds rating. Immediate action required.`;
        possibleCauses = [
          'Actual load exceeds generator capacity',
          'Motor starting inrush not accounted for',
          'Additional loads connected since sizing',
          'CT ratio incorrect giving false high reading'
        ];
        immediateActions = [
          'Shed non-essential loads immediately',
          'Check for stuck motors or short circuits',
          'Verify CT programming matches actual CTs',
          'Listen for engine struggling under load'
        ];
        longTermFixes = [
          'Conduct proper load study',
          'Consider generator upsizing',
          'Implement load shedding scheme',
          'Add soft starters to large motors'
        ];
        relatedParameters = ['frequency', 'voltageL1N', 'coolantTemp'];
      } else if (value > spec.warningHigh) {
        message = `WARNING: Generator load at ${value}${spec.unit} is high. Monitor engine parameters closely.`;
        possibleCauses = [
          'Approaching generator capacity',
          'Power factor may be causing high kVA'
        ];
        immediateActions = [
          'Monitor engine temperature and oil pressure',
          'Be ready to shed loads if parameters deteriorate',
          'Check power factor - correct if low'
        ];
        longTermFixes = [
          'Review connected loads',
          'Plan for future load growth',
          'Consider power factor correction'
        ];
        relatedParameters = ['coolantTemp', 'oilTemperature', 'powerFactor'];
      } else if (value < spec.warningLow) {
        message = `WARNING: Generator load at ${value}${spec.unit} is very low. Engine may wet stack.`;
        possibleCauses = [
          'Minimal connected load',
          'Generator oversized for application',
          'Load shifted to another source'
        ];
        immediateActions = [
          'If continuous low load, consider periodic loading',
          'Check for wet stacking signs (black exhaust, carbon buildup)'
        ];
        longTermFixes = [
          'Apply load bank periodically',
          'Review if smaller generator appropriate',
          'Implement minimum load controls'
        ];
        relatedParameters = ['coolantTemp'];
      } else {
        message = `NORMAL: Generator load at ${value}${spec.unit} is within optimal operating range.`;
        immediateActions = ['No action required - generator operating at healthy load level'];
      }
      break;

    case 'powerFactor':
      if (value < spec.criticalLow) {
        message = `CRITICAL: Power factor at ${value} is very poor. Generator capacity severely limited.`;
        possibleCauses = [
          'Large inductive loads (motors, transformers) without correction',
          'Incorrect power factor capacitors',
          'Variable frequency drives causing harmonics',
          'Unbalanced or nonlinear loads'
        ];
        immediateActions = [
          'Identify major inductive loads',
          'Check existing PF capacitors if installed',
          'May need to derate generator for low PF'
        ];
        longTermFixes = [
          'Install power factor correction capacitors',
          'Size capacitors for actual load profile',
          'Consider active PF correction for variable loads'
        ];
        relatedParameters = ['loadPercent', 'currentL1'];
      } else if (value < spec.warningLow) {
        message = `WARNING: Power factor at ${value} is below optimal. Generator output limited.`;
        possibleCauses = [
          'Inductive loads dominating',
          'PF correction insufficient',
          'Lighting ballasts or motor loads'
        ];
        immediateActions = [
          'Monitor current versus kW',
          'Generator can deliver less kW at lower PF'
        ];
        longTermFixes = [
          'Add or adjust PF correction',
          'Review motor starting impact'
        ];
        relatedParameters = ['currentL1', 'loadPercent'];
      } else {
        message = `NORMAL: Power factor at ${value} is good. Generator operating efficiently.`;
        immediateActions = ['No action required - power factor optimal'];
      }
      break;

    case 'fuelLevel':
      if (value < spec.criticalLow) {
        message = `CRITICAL: Fuel level at ${value}${spec.unit} is critically low. REFUEL IMMEDIATELY.`;
        possibleCauses = [
          'Fuel consumed during operation',
          'Fuel leak from tank or lines',
          'Fuel theft',
          'Fuel sender fault giving false low reading'
        ];
        immediateActions = [
          'Arrange immediate fuel delivery',
          'Check for fuel leaks under tank and lines',
          'Calculate run time remaining and plan accordingly'
        ];
        longTermFixes = [
          'Implement fuel monitoring system',
          'Set up automatic refueling schedule',
          'Install fuel tank level switch with alarm'
        ];
        relatedParameters = [];
      } else if (value < spec.warningLow) {
        message = `WARNING: Fuel level at ${value}${spec.unit} is low. Plan for refueling soon.`;
        possibleCauses = [
          'Normal consumption',
          'Increased usage above planned'
        ];
        immediateActions = [
          'Schedule fuel delivery',
          'Estimate remaining run time',
          'Check fuel consumption rate'
        ];
        longTermFixes = [
          'Improve fuel monitoring',
          'Adjust delivery schedule'
        ];
        relatedParameters = [];
      } else {
        message = `NORMAL: Fuel level at ${value}${spec.unit} is adequate.`;
        immediateActions = ['No action required - fuel supply sufficient'];
      }
      break;

    case 'rpm': {
      const nominal = (spec.normalMin + spec.normalMax) / 2;
      if (status === 'normal') {
        message = `NORMAL: Engine speed ${value} RPM is right for this ${nominal === 1800 ? '60' : '50'} Hz set.`;
        immediateActions = ['No action required'];
      } else if (value > nominal) {
        message = `${status === 'critical' ? 'CRITICAL' : 'WARNING'}: Engine speed ${value} RPM is above the ${nominal} RPM this set should run at.`;
        possibleCauses = ['Governor or actuator set too high or sticking', 'Speed sensor (MPU) reading wrong', 'Load rejected suddenly', 'Wrong frequency selected on the controller'];
        immediateActions = status === 'critical' ? ['Stop the engine with the emergency stop and keep clear of the engine and alternator', 'Do not restart until the governor and fuel control are checked'] : ['Check the governor speed setting and actuator linkage', 'Compare with a hand tachometer'];
        longTermFixes = ['Calibrate the governor', 'Check the speed sensor gap and signal'];
      } else {
        message = `${status === 'critical' ? 'CRITICAL' : 'WARNING'}: Engine speed ${value} RPM is below the ${nominal} RPM this set should run at.`;
        possibleCauses = ['Load above the set rating', 'Blocked fuel or air filters', 'Air in the fuel', 'Governor or actuator weak or mis-set'];
        immediateActions = ['Reduce the load', 'Check fuel and air filters', 'Check the governor response'];
        longTermFixes = ['Service the fuel system', 'Review the load against the rating'];
      }
      relatedParameters = ['frequency', 'loadPercent'];
      break;
    }

    default:
      if (status === 'normal') {
        message = `NORMAL: ${spec.name} at ${value} ${spec.unit} is within operating range.`;
        immediateActions = ['No action required'];
      } else if (status === 'warning') {
        message = `WARNING: ${spec.name} at ${value} ${spec.unit} is outside normal range.`;
        possibleCauses = ['Sensor drift', 'Operating condition variation'];
        immediateActions = ['Monitor and investigate if persists'];
        longTermFixes = ['Calibrate sensor', 'Review operating conditions'];
      } else {
        message = `CRITICAL: ${spec.name} at ${value} ${spec.unit} is at critical level.`;
        possibleCauses = ['System fault', 'Sensor failure', 'Operating condition extreme'];
        immediateActions = ['Investigate immediately', 'Consider shutdown if safety risk'];
        longTermFixes = ['Full system inspection', 'Component replacement if needed'];
      }
  }

  return {
    parameter: spec.name,
    status,
    value,
    unit: spec.unit,
    message,
    possibleCauses,
    immediateActions,
    longTermFixes,
    relatedParameters
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
interface TechnicianInputDiagnosticsProps {
  className?: string;
}

// Readings where the first action is to stop (re-audit 2026-10-31).
function withStopAdvice(key: string, value: number, r: DiagnosticResult | null, ac: AcSystem = '50-230'): DiagnosticResult | null {
  if (!r) return r;
  if (key === 'rpm' && AC_SYSTEMS[ac].hz === 50 && value > 1600) {
    return { ...r, message: `Engine speed ${value} RPM is above a 50 Hz set's 1500 RPM: this is overspeed. (If this is really a 60 Hz set, choose 60 Hz above.)`, possibleCauses: ['Governor or actuator set too high or sticking', 'Speed sensor (MPU) reading wrong', 'Wrong frequency selected on the controller'], immediateActions: ['On a 50 Hz set: stop the engine with the emergency stop and do not restart until the governor and fuel control are checked.', 'Keep clear of the engine and alternator while it is running fast.'] };
  }
  if (/^voltage/.test(key) && value === 0) {
    return { ...r, message: 'No output voltage.', immediateActions: ['Isolate the load before testing: lethal voltage can return without warning.', 'Check engine speed, the breaker and fuses, then the AVR and residual magnetism. Qualified electrician only.'] };
  }
  return r;
}

export default function TechnicianInputDiagnostics({ className = '' }: TechnicianInputDiagnosticsProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [batterySystem, setBatterySystem] = useState<'12' | '24'>('24');
  const [acSystem, setAcSystem] = useState<AcSystem>('50-230');

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const analyzeAll = () => {
    setShowResults(true);
  };

  const clearAll = () => {
    setInputs({});
    setShowResults(false);
  };

  const results = useMemo(() => {
    if (!showResults) return [];
    // With no output voltage, load and power factor say nothing on their own
    // (audit 2026-11-05: 0 V also flagged "wet stack" and "very poor" PF).
    const noOutput = ['voltageL1N', 'voltageL1L2'].some((k) => inputs[k] !== undefined && inputs[k] !== '' && parseFloat(inputs[k]) === 0);
    return Object.entries(inputs)
      .filter(([key]) => !(noOutput && (key === 'loadPercent' || key === 'powerFactor')))
      .map(([key, value]) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return null;
        return withStopAdvice(key, numValue, analyzeParameter(key, numValue, batterySystem, acSystem), acSystem);
      })
      .filter((r): r is DiagnosticResult => r !== null);
  }, [inputs, showResults, batterySystem, acSystem]);

  const criticalCount = results.filter(r => r.status === 'critical').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const normalCount = results.filter(r => r.status === 'normal').length;

  const statusColors = {
    normal: 'bg-green-500/20 border-green-500 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    critical: 'bg-red-500/20 border-red-500 text-red-400',
  };

  return (
    <div className={`bg-slate-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🔧</span> Technician Input Diagnostics
        </h2>
        <p className="text-purple-100 text-sm mt-1">
          Enter your readings below - the system will analyze and provide detailed solutions
        </p>
      </div>

      {/* Input Section */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-white font-bold mb-3">Enter Your Readings</h3>
        <label className="block text-sm text-slate-300 mb-3">Starting battery system{' '}
          <select value={batterySystem} onChange={(e) => setBatterySystem(e.target.value as '12' | '24')} className="ml-2 bg-slate-800 text-white rounded px-2 py-1">
            <option value="24">24 V</option>
            <option value="12">12 V</option>
          </select>
        </label>
        <label className="block text-sm text-slate-300 mb-3">Generator output system{' '}
          <select value={acSystem} onChange={(e) => setAcSystem(e.target.value as AcSystem)} className="ml-2 bg-slate-800 text-white rounded px-2 py-1">
            {(Object.keys(AC_SYSTEMS) as AcSystem[]).map((k) => <option key={k} value={k}>{AC_SYSTEMS[k].label}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(PARAMETER_SPECS).map(([key, spec]) => (
            <div key={key} className="bg-slate-800 rounded-lg p-3">
              <label className="block text-slate-400 text-xs mb-1">{spec.name}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="--"
                  value={inputs[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
                <span className="text-slate-500 text-xs self-center min-w-[30px]">{spec.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={analyzeAll}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
          >
            ⚡ ANALYZE READINGS
          </button>
          <button
            onClick={clearAll}
            className="px-6 py-3 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Readings no gauge can show are named, not silently dropped (audit 2026-11-05). */}
      {showResults && (() => {
        const ignored = Object.entries(inputs).filter(([k, v]) => v !== '' && !isNaN(parseFloat(v)) && IMPOSSIBLE[k]?.(parseFloat(v))).map(([k, v]) => `${PARAMETER_SPECS[k]?.name ?? k} ${v}`);
        return ignored.length ? (
          <div role="alert" className="mx-4 mt-4 p-3 rounded-lg border border-amber-500/50 bg-amber-500/10 text-amber-200 text-sm">
            Not analysed, because no working gauge can show these values: {ignored.join('; ')}. Check the reading or the units.
          </div>
        ) : null;
      })()}
      {/* Results Section */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Summary */}
            <div className="p-4 bg-slate-800/50 border-b border-slate-700">
              <h3 className="text-white font-bold mb-3">Analysis Summary</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-red-400 font-bold">{criticalCount} Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-yellow-400 font-bold">{warningCount} Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-400 font-bold">{normalCount} Normal</span>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="p-4 space-y-4">
              {results
                .sort((a, b) => {
                  const order = { critical: 0, warning: 1, normal: 2 };
                  return order[a.status] - order[b.status];
                })
                .map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`border rounded-lg overflow-hidden ${statusColors[result.status]}`}
                  >
                    {/* Result Header */}
                    <div className="p-4 border-b border-current/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {result.status === 'critical' ? '🚨' : result.status === 'warning' ? '⚠️' : '✅'}
                          </span>
                          <div>
                            <h4 className="text-lg font-bold text-white">{result.parameter}</h4>
                            <p className="text-sm">
                              Reading: <span className="font-bold">{result.value} {result.unit}</span>
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${statusColors[result.status]}`}>
                          {result.status}
                        </span>
                      </div>
                      <p className="mt-2 text-white font-medium">{result.message}</p>
                    </div>

                    {/* Details */}
                    {result.status !== 'normal' && (
                      <div className="p-4 bg-slate-900/50 space-y-4">
                        {/* Possible Causes */}
                        {result.possibleCauses.length > 0 && (
                          <div>
                            <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                              <span>🔍</span> Possible Causes
                            </h5>
                            <ul className="space-y-1">
                              {result.possibleCauses.map((cause, i) => (
                                <li key={i} className="text-slate-300 text-sm flex gap-2">
                                  <span className="text-cyan-400">•</span>
                                  <span>{cause}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Immediate Actions */}
                        {result.immediateActions.length > 0 && (
                          <div>
                            <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                              <span>⚡</span> Immediate Actions
                            </h5>
                            <ul className="space-y-1">
                              {result.immediateActions.map((action, i) => (
                                <li key={i} className="text-slate-300 text-sm flex gap-2">
                                  <span className="text-amber-400 font-bold">{i + 1}.</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Long-Term Fixes */}
                        {result.longTermFixes.length > 0 && (
                          <div>
                            <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                              <span>🔧</span> Long-Term Solutions
                            </h5>
                            <ul className="space-y-1">
                              {result.longTermFixes.map((fix, i) => (
                                <li key={i} className="text-slate-300 text-sm flex gap-2">
                                  <span className="text-green-400">→</span>
                                  <span>{fix}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Related Parameters */}
                        {result.relatedParameters.length > 0 && (
                          <div className="pt-2 border-t border-slate-700">
                            <span className="text-slate-500 text-xs">Also check: </span>
                            {result.relatedParameters.map((param, i) => (
                              <span key={i} className="text-cyan-400 text-xs">
                                {PARAMETER_SPECS[param]?.name}
                                {i < result.relatedParameters.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {showResults && results.length === 0 && (
        <div className="p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-slate-400">Enter some readings above to see the analysis</p>
        </div>
      )}

      {/* Help Section */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <details className="group">
          <summary className="cursor-pointer text-cyan-400 font-medium flex items-center gap-2">
            <span>💡</span> How to Use This Tool
          </summary>
          <div className="mt-3 text-slate-300 text-sm space-y-2">
            <p><strong>1. Take Readings:</strong> Use your multimeter, clamp meter, and controller display to record actual values.</p>
            <p><strong>2. Enter Values:</strong> Input each reading in the corresponding field above.</p>
            <p><strong>3. Analyze:</strong> Click the Analyze button to get instant diagnostic results.</p>
            <p><strong>4. Follow Actions:</strong> Critical issues are highlighted first. Follow the immediate actions to resolve problems.</p>
            <p><strong>5. Related Parameters:</strong> Check related parameters as issues often have interconnected causes.</p>
          </div>
        </details>
      </div>
    </div>
  );
}
